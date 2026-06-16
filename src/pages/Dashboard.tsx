import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
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
  display_name?: string;
  email?: string;
  name?: string;
  user_id: string;
};

type StoryRecord = {
  content: string;
  created_at?: string;
  expires_at: string;
  id: string;
  media_url?: string | null;
  user_id: string;
};

const CREDIT_REWARD = 10;

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [problems, setProblems] = useState<ProblemRecord[]>([]);
  const [stories, setStories] = useState<StoryRecord[]>([]);
  const [solutionsByProblem, setSolutionsByProblem] = useState<Record<string, SolutionRecord[]>>({});
  const [profilesByUser, setProfilesByUser] = useState<Record<string, ProfileRecord>>({});
  const [solutionDrafts, setSolutionDrafts] = useState<Record<string, string>>({});
  const [openComposerId, setOpenComposerId] = useState<string | null>(null);
  const [submittingFor, setSubmittingFor] = useState<string | null>(null);
  const [storyText, setStoryText] = useState("");
  const [storyMediaUrl, setStoryMediaUrl] = useState("");
  const [storyDurationHours, setStoryDurationHours] = useState("24");
  const [storyComposerOpen, setStoryComposerOpen] = useState(false);
  const [submittingStory, setSubmittingStory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataWarning, setDataWarning] = useState("");
  const [storyWarning, setStoryWarning] = useState("");
  const [solutionsEnabled, setSolutionsEnabled] = useState(true);
  const [storiesEnabled, setStoriesEnabled] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setDataWarning("");
    setStoryWarning("");
    setSolutionsEnabled(true);
    setStoriesEnabled(true);

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

    const nowIso = new Date().toISOString();
    const { data: storyRows, error: storiesError } = await supabase
      .from("stories")
      .select("*")
      .gt("expires_at", nowIso)
      .order("created_at", { ascending: false });

    const activeStories = (storyRows || []) as StoryRecord[];

    if (storiesError) {
      setStoriesEnabled(false);
      setStories([]);
      setStoryWarning(
        "Stories are disabled because the database table is missing. Run the new SQL migration in your Supabase project to enable dashboard stories."
      );
    } else {
      setStories(activeStories);
    }

    const participantIds = Array.from(
      new Set([
        ...problemsData.map((problem) => problem.user_id),
        ...((solutionRows || []) as SolutionRecord[]).map((solution) => solution.solver_id),
        ...activeStories.map((story) => story.user_id),
      ])
    );

    if (participantIds.length > 0) {
      const { data: displayRows, error: displayNameError } = await supabase.rpc(
        "get_user_display_names",
        {
          p_user_ids: participantIds,
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
          .in("user_id", participantIds);

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
    const currentUserName =
      user?.id === userId
        ? user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0]
        : "";

    return (
      profile?.display_name ||
      profile?.name ||
      profile?.email?.split("@")[0] ||
      currentUserName ||
      "Student"
    );
  }

  function getStoryTimeLeft(expiresAt: string) {
    const millisecondsLeft = new Date(expiresAt).getTime() - Date.now();
    const minutesLeft = Math.max(1, Math.ceil(millisecondsLeft / 60000));

    if (minutesLeft < 60) {
      return `${minutesLeft}m left`;
    }

    return `${Math.ceil(minutesLeft / 60)}h left`;
  }

  function updateDraft(problemId: string, value: string) {
    setSolutionDrafts((current) => ({ ...current, [problemId]: value }));
  }

  async function submitStory() {
    const content = storyText.trim();
    const mediaUrl = storyMediaUrl.trim();
    const durationHours = Number(storyDurationHours);

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!storiesEnabled) {
      alert("Stories are not enabled yet. Please apply the new Supabase migration first.");
      return;
    }

    if (!content && !mediaUrl) {
      alert("Write a story or add a media URL before posting");
      return;
    }

    if (!Number.isFinite(durationHours) || durationHours < 1 || durationHours > 168) {
      alert("Choose a story duration between 1 hour and 7 days");
      return;
    }

    setSubmittingStory(true);

    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from("stories").insert([
      {
        content,
        expires_at: expiresAt,
        media_url: mediaUrl || null,
        user_id: user.id,
      },
    ]);

    setSubmittingStory(false);

    if (error) {
      alert(error.message);
      return;
    }

    setStoryText("");
    setStoryMediaUrl("");
    setStoryDurationHours("24");
    setStoryComposerOpen(false);
    await loadDashboard();
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

      <section className="dashboardSection storiesSection">
        <div className="sectionHeader">
          <div>
            <span className="sectionLabel">Stories</span>
            <h2>Community Stories</h2>
          </div>
          <button
            className="sectionLink storyToggleButton"
            onClick={() => setStoryComposerOpen((current) => !current)}
          >
            {storyComposerOpen ? "Close" : "Add story"}
          </button>
        </div>

        {storyWarning ? <div className="warningCard">{storyWarning}</div> : null}

        {storyComposerOpen ? (
          <div className="storyComposer">
            <label htmlFor="story-text">Story</label>
            <textarea
              id="story-text"
              rows={3}
              placeholder="Share a quick update with everyone..."
              value={storyText}
              onChange={(event) => setStoryText(event.target.value)}
            />

            <label htmlFor="story-media">Media URL</label>
            <input
              id="story-media"
              placeholder="Optional image or video URL"
              value={storyMediaUrl}
              onChange={(event) => setStoryMediaUrl(event.target.value)}
            />

            <label htmlFor="story-duration">Visible for</label>
            <select
              id="story-duration"
              value={storyDurationHours}
              onChange={(event) => setStoryDurationHours(event.target.value)}
            >
              <option value="1">1 hour</option>
              <option value="6">6 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours</option>
              <option value="48">2 days</option>
              <option value="168">7 days</option>
            </select>

            <button
              className="primaryButton"
              onClick={submitStory}
              disabled={submittingStory}
            >
              {submittingStory ? "Uploading..." : "Upload story"}
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="storyTray">
            <div className="storyCard storyPlaceholder">Loading stories...</div>
          </div>
        ) : stories.length === 0 ? (
          <div className="emptyStateCard storyEmptyCard">
            <h3>No active stories</h3>
            <p>Upload the first story and it will be visible here until its time expires.</p>
          </div>
        ) : (
          <div className="storyTray">
            {stories.map((story) => (
              <article key={story.id} className="storyCard">
                {story.media_url ? (
                  <div className="storyMedia">
                    <img src={story.media_url} alt="" />
                  </div>
                ) : (
                  <div className="storyAvatar">{getDisplayName(story.user_id).charAt(0)}</div>
                )}
                <div className="storyBody">
                  <strong>{getDisplayName(story.user_id)}</strong>
                  {story.content ? <p>{story.content}</p> : null}
                  <span>{getStoryTimeLeft(story.expires_at)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
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
