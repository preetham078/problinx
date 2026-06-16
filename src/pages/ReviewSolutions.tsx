import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

type ProblemRecord = {
  created_at?: string;
  description: string;
  id: string;
  skills?: string;
  title: string;
  user_id: string;
};

type SolutionRecord = {
  id: string;
  problem_id: string;
  solution_text: string;
  solver_id: string;
  status: string;
};

type ProfileRecord = {
  display_name?: string;
  email?: string;
  name?: string;
  user_id: string;
};

const CREDIT_REWARD = 10;

export default function ReviewSolutions() {
  const [user, setUser] = useState<User | null>(null);
  const [problems, setProblems] = useState<ProblemRecord[]>([]);
  const [solutionsByProblem, setSolutionsByProblem] = useState<Record<string, SolutionRecord[]>>({});
  const [profilesByUser, setProfilesByUser] = useState<Record<string, ProfileRecord>>({});
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadReviewQueue();
  }, []);

  async function loadReviewQueue() {
    setLoading(true);
    setErrorMessage("");

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    setUser(currentUser);

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const { data: problemRows, error: problemError } = await supabase
      .from("problems")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (problemError) {
      setErrorMessage(problemError.message);
      setLoading(false);
      return;
    }

    const ownedProblems = (problemRows || []) as ProblemRecord[];
    setProblems(ownedProblems);

    if (ownedProblems.length === 0) {
      setSolutionsByProblem({});
      setLoading(false);
      return;
    }

    const problemIds = ownedProblems.map((problem) => problem.id);

    const { data: solutionRows, error: solutionError } = await supabase
      .from("solutions")
      .select("*")
      .in("problem_id", problemIds)
      .order("created_at", { ascending: true });

    if (solutionError) {
      setErrorMessage(solutionError.message);
      setLoading(false);
      return;
    }

    const groupedSolutions = ((solutionRows || []) as SolutionRecord[]).reduce<
      Record<string, SolutionRecord[]>
    >((accumulator, solution) => {
      accumulator[solution.problem_id] = accumulator[solution.problem_id] || [];
      accumulator[solution.problem_id].push(solution);
      return accumulator;
    }, {});

    setSolutionsByProblem(groupedSolutions);

    const solverIds = Array.from(
      new Set(((solutionRows || []) as SolutionRecord[]).map((solution) => solution.solver_id))
    );

    if (solverIds.length > 0) {
      const { data: displayRows, error: displayNameError } = await supabase.rpc(
        "get_user_display_names",
        {
          p_user_ids: solverIds,
        }
      );

      if (!displayNameError) {
        const mappedDisplayNames = ((displayRows || []) as ProfileRecord[]).reduce<
          Record<string, ProfileRecord>
        >((accumulator, profile) => {
          accumulator[profile.user_id] = profile;
          return accumulator;
        }, {});

        setProfilesByUser(mappedDisplayNames);
      } else {
        const { data: profileRows } = await supabase
          .from("profiles")
          .select("user_id,name,email")
          .in("user_id", solverIds);

        const mappedProfiles = ((profileRows || []) as ProfileRecord[]).reduce<
          Record<string, ProfileRecord>
        >((accumulator, profile) => {
          accumulator[profile.user_id] = profile;
          return accumulator;
        }, {});

        setProfilesByUser(mappedProfiles);
      }
    }

    setLoading(false);
  }

  function getDisplayName(userId: string) {
    const profile = profilesByUser[userId];
    return profile?.display_name || profile?.name || profile?.email?.split("@")[0] || "Student";
  }

  async function approveSolution(solutionId: string) {
    setApprovingId(solutionId);

    const { error } = await supabase.rpc("approve_solution", {
      p_solution_id: solutionId,
    });

    setApprovingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    await loadReviewQueue();
  }

  const totalSolutions = Object.values(solutionsByProblem).flat().length;
  const pendingSolutions = Object.values(solutionsByProblem)
    .flat()
    .filter((solution) => solution.status !== "approved").length;

  return (
    <div className="reviewPage">
      <section className="reviewHero">
        <div>
          <span className="heroBadge">REVIEW SOLUTIONS</span>
          <h1>Approve solutions only for the problems you posted.</h1>
          <p>
            This page is your review space. Once you approve a good answer, the
            solver receives a fixed {CREDIT_REWARD} credits for that problem.
          </p>
        </div>

        <div className="dashboardStats reviewStats">
          <div className="statCard">
            <h3>{problems.length}</h3>
            <p>Your problems</p>
          </div>
          <div className="statCard">
            <h3>{totalSolutions}</h3>
            <p>Solutions received</p>
          </div>
          <div className="statCard">
            <h3>{pendingSolutions}</h3>
            <p>Waiting review</p>
          </div>
        </div>
      </section>

      <section className="dashboardSection">
        <div className="sectionHeader">
          <div>
            <span className="sectionLabel">Owner review</span>
            <h2>Your review queue</h2>
          </div>
          <Link to="/dashboard" className="sectionLink">
            Back to dashboard
          </Link>
        </div>

        {errorMessage ? <div className="warningCard">{errorMessage}</div> : null}

        {loading ? (
          <div className="emptyStateCard">
            <h3>Loading your review queue...</h3>
            <p>We are gathering the solutions for the problems you posted.</p>
          </div>
        ) : !user ? (
          <div className="emptyStateCard">
            <h3>Please sign in</h3>
            <p>You need to sign in before you can review submitted solutions.</p>
          </div>
        ) : problems.length === 0 ? (
          <div className="emptyStateCard">
            <h3>No posted problems yet</h3>
            <p>Post a problem first, then submitted solutions will appear here for approval.</p>
            <Link to="/post" className="ctaPrimary">
              Post your first problem
            </Link>
          </div>
        ) : (
          <div className="problemFeed">
            {problems.map((problem) => {
              const solutions = solutionsByProblem[problem.id] || [];
              const approvedSolution = solutions.find((solution) => solution.status === "approved");

              return (
                <article key={problem.id} className="problemCard featuredProblemCard problemThreadCard">
                  <div className="problemHeader">
                    <div>
                      <span className="problemIndex">Review</span>
                      <h3>{problem.title}</h3>
                    </div>
                    <span className="problemTime">
                      {problem.created_at
                        ? new Date(problem.created_at).toLocaleDateString()
                        : "Today"}
                    </span>
                  </div>

                  <p className="problemDesc">{problem.description}</p>

                  <div className="problemMetaRow">
                    <div className="tags">
                      <span>{problem.skills || "General help"}</span>
                      <span>{approvedSolution ? "Solved" : "Awaiting approval"}</span>
                    </div>
                  </div>

                  <div className="solutionPanel">
                    <div className="solutionPanelHeader">
                      <div>
                        <h4>Submitted answers</h4>
                        <p>
                          Only you can approve a solution here because this is
                          your posted problem.
                        </p>
                      </div>
                    </div>

                    <div className="solutionList">
                      {solutions.length === 0 ? (
                        <div className="solutionEmpty">
                          No one has submitted a solution for this problem yet.
                        </div>
                      ) : (
                        solutions.map((solution) => {
                          const canApprove =
                            solution.status !== "approved" && !approvedSolution;

                          return (
                            <div
                              key={solution.id}
                              className={`solutionCard ${
                                solution.status === "approved" ? "solutionCardApproved" : ""
                              }`}
                            >
                              <div className="solutionCardTop">
                                <div>
                                  <strong>{getDisplayName(solution.solver_id)}</strong>
                                  <span className="solutionStatus">
                                    {solution.status === "approved"
                                      ? `Approved and rewarded ${CREDIT_REWARD} credits`
                                      : `Pending your approval for ${CREDIT_REWARD} credits`}
                                  </span>
                                </div>
                                {canApprove ? (
                                  <button
                                    className="approveButton"
                                    onClick={() => approveSolution(solution.id)}
                                    disabled={approvingId === solution.id}
                                  >
                                    {approvingId === solution.id
                                      ? "Approving..."
                                      : `Approve +${CREDIT_REWARD}`}
                                  </button>
                                ) : null}
                              </div>

                              <p>{solution.solution_text}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
