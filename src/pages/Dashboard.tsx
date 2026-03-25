import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

type ProblemRecord = {
  id: string;
  title: string;
  description: string;
  skills?: string;
  created_at?: string;
  user_id: string;
};

type SolutionRecord = {
  approved_at?: string | null;
  created_at?: string;
  id: string;
  problem_id: string;
  solution_text: string;
  solver_id: string;
  status: string;
};

type ProfileRecord = {
  name?: string;
  user_id: string;
};

const CREDIT_REWARD = 10;

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [problems, setProblems] = useState<ProblemRecord[]>([]);
  const [solutionsByProblem, setSolutionsByProblem] = useState<Record<string, SolutionRecord[]>>({});
  const [profilesByUser, setProfilesByUser] = useState<Record<string, ProfileRecord>>({});
  const [solutionDrafts, setSolutionDrafts] = useState<Record<string, string>>({});
  const [openComposerId, setOpenComposerId] = useState<string | null>(null);
  const [submittingFor, setSubmittingFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataWarning, setDataWarning] = useState("");
  const [solutionsEnabled, setSolutionsEnabled] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setDataWarning("");
    setSolutionsEnabled(true);

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    setUser(currentUser);

    const { data: problemRows, error: problemsError } = await supabase
      .from("problems")
      .select("*")
      .order("created_at", { ascending: false });

    if (problemsError) {
      setDataWarning(problemsError.message);
      setLoading(false);
      return;
    }

    const problemsData = (problemRows || []) as ProblemRecord[];
    setProblems(problemsData);

    const { data: solutionRows, error: solutionsError } = await supabase
      .from("solutions")
      .select("*")
      .order("created_at", { ascending: true });

    if (solutionsError) {
      setSolutionsEnabled(false);
      setDataWarning(
        "Solutions are disabled because the database table is missing. Run the new SQL migration in your Supabase project to enable solving and credit approval."
      );
      setSolutionsByProblem({});
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

    const participantIds = Array.from(
      new Set([
        ...problemsData.map((problem) => problem.user_id),
        ...((solutionRows || []) as SolutionRecord[]).map((solution) => solution.solver_id),
      ])
    );

    if (participantIds.length > 0) {
      const { data: profileRows } = await supabase
        .from("profiles")
        .select("user_id,name")
        .in("user_id", participantIds);

      const mappedProfiles = ((profileRows || []) as ProfileRecord[]).reduce<
        Record<string, ProfileRecord>
      >((accumulator, profile) => {
        accumulator[profile.user_id] = profile;
        return accumulator;
      }, {});

      setProfilesByUser(mappedProfiles);
    }

    setLoading(false);
  }

  function getDisplayName(userId: string) {
    return profilesByUser[userId]?.name || "Community member";
  }

  function updateDraft(problemId: string, value: string) {
    setSolutionDrafts((current) => ({ ...current, [problemId]: value }));
  }

  async function submitSolution(problemId: string) {
    const draft = solutionDrafts[problemId]?.trim();

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!solutionsEnabled) {
      alert("Solutions are not enabled yet. Please apply the new Supabase migration first.");
      return;
    }

    if (!draft) {
      alert("Write your solution before submitting");
      return;
    }

    setSubmittingFor(problemId);

    const { error } = await supabase.from("solutions").insert([
      {
        problem_id: problemId,
        solver_id: user.id,
        solution_text: draft,
      },
    ]);

    setSubmittingFor(null);

    if (error) {
      alert(error.message);
      return;
    }

    setSolutionDrafts((current) => ({ ...current, [problemId]: "" }));
    setOpenComposerId(null);
    await loadDashboard();
  }

  const featuredProblems = problems.slice(0, 3);
  const approvedSolutions = Object.values(solutionsByProblem)
    .flat()
    .filter((solution) => solution.status === "approved").length;

  return (
    <div className="dashboardPage">
      <section className="welcomeCard dashboardHero">
        <div className="dashboardHeroCopy">
          <span className="heroBadge">HOME</span>
          <h1>Build your skill network around real student problems.</h1>
          <p>
            Discover open problems, submit your own solution, and earn credits
            only after the original poster approves your help.
          </p>

          <div className="dashboardCtas">
            <Link to="/post" className="ctaPrimary">
              Post a problem
            </Link>
            <Link to="/review" className="ctaSecondary">
              Review solutions
            </Link>
          </div>
        </div>

        <div className="dashboardOrbital">
          <div className="orbitalRing orbitalRingOne" />
          <div className="orbitalRing orbitalRingTwo" />
          <div className="orbitalCard">
            <strong>{problems.length}</strong>
            <span>open challenges</span>
          </div>
        </div>
      </section>

      <section className="dashboardStats">
        <div className="statCard">
          <h3>{problems.length}</h3>
          <p>Recent posts</p>
        </div>
        <div className="statCard">
          <h3>{approvedSolutions}</h3>
          <p>Approved solutions</p>
        </div>
        <div className="statCard">
          <h3>{featuredProblems.length}</h3>
          <p>Featured now</p>
        </div>
      </section>

      <section className="dashboardSection">
        <div className="sectionHeader">
          <div>
            <span className="sectionLabel">Problem feed</span>
            <h2>Recent Problems</h2>
          </div>
          <Link to="/post" className="sectionLink">
            Create one
          </Link>
        </div>

        {dataWarning ? <div className="warningCard">{dataWarning}</div> : null}

        {loading ? (
          <div className="emptyStateCard">
            <h3>Loading dashboard...</h3>
            <p>Your problem and solution feed is on the way.</p>
          </div>
        ) : problems.length === 0 ? (
          <div className="emptyStateCard">
            <h3>No problems posted yet</h3>
            <p>
              Start the first thread for your community and invite others to
              help solve it.
            </p>
            <Link to="/post" className="ctaPrimary">
              Post the first problem
            </Link>
          </div>
        ) : (
          <div className="problemFeed">
            {problems.map((problem, index) => {
              const solutions = solutionsByProblem[problem.id] || [];
              const approvedSolution = solutions.find((solution) => solution.status === "approved");
              const isOwner = user?.id === problem.user_id;

              return (
                <article key={problem.id} className="problemCard featuredProblemCard problemThreadCard">
                  <div className="problemHeader">
                    <div>
                      <span className="problemIndex">0{index + 1}</span>
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
                      {approvedSolution ? <span>Solved</span> : <span>Open</span>}
                    </div>
                    <div className="problemPulse">
                      <span className="pulseDot" />
                      Posted by {getDisplayName(problem.user_id)}
                    </div>
                  </div>

                  <div className="solutionPanel">
                    <div className="solutionPanelHeader">
                      <div>
                        <h4>Solutions</h4>
                        <p>
                          Submit an answer. The problem owner approves the best
                          one and credits are awarded after approval.
                        </p>
                      </div>
                      {isOwner ? (
                        <Link to="/review" className="ghostButton actionLink">
                          Review in approval page
                        </Link>
                      ) : null}
                      {!isOwner && !approvedSolution && solutionsEnabled ? (
                        <button
                          className="ghostButton"
                          onClick={() =>
                            setOpenComposerId((current) =>
                              current === problem.id ? null : problem.id
                            )
                          }
                        >
                          {openComposerId === problem.id ? "Close" : "Solve this"}
                        </button>
                      ) : null}
                    </div>

                    {openComposerId === problem.id && !approvedSolution && solutionsEnabled ? (
                      <div className="solutionComposer">
                        <textarea
                          rows={4}
                          placeholder="Write how you would solve this problem..."
                          value={solutionDrafts[problem.id] || ""}
                          onChange={(event) => updateDraft(problem.id, event.target.value)}
                        />
                        <button
                          className="primaryButton"
                          onClick={() => submitSolution(problem.id)}
                          disabled={submittingFor === problem.id}
                        >
                          {submittingFor === problem.id ? "Submitting..." : "Submit solution"}
                        </button>
                      </div>
                    ) : null}

                    {!solutionsEnabled ? (
                      <div className="solutionEmpty">
                        Solving is disabled right now because the `solutions`
                        table has not been created in Supabase yet.
                      </div>
                    ) : null}

                    <div className="solutionList">
                      {solutions.length === 0 ? (
                        <div className="solutionEmpty">
                          No solutions yet. Be the first one to help.
                        </div>
                      ) : (
                        solutions.map((solution) => {
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
                                      ? `Approved +${CREDIT_REWARD} credits`
                                      : isOwner
                                        ? "Pending your review"
                                        : "Pending review by problem owner"}
                                  </span>
                                </div>
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
