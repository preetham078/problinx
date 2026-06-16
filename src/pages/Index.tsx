import { Link } from "react-router-dom";

const journeySteps = [
  {
    title: "Post what is blocking you",
    description:
      "Share the project context, your current roadblock, and the skill you need so the right people can jump in fast.",
  },
  {
    title: "Get peer solutions with context",
    description:
      "Students reply with thoughtful approaches instead of vague tips, making every answer more useful for real work.",
  },
  {
    title: "Approve the best help",
    description:
      "Once the solution actually works, approve it and reward the solver with credits inside your community.",
  },
];

const spotlightCards = [
  {
    label: "Frontend",
    title: "Debug a React dashboard",
    detail: "Students trade UI and state-management help around active class and side-project work.",
  },
  {
    label: "Data",
    title: "Untangle a SQL query",
    detail: "Database and analytics questions become searchable problem threads instead of disappearing in chats.",
  },
  {
    label: "Design",
    title: "Improve a product flow",
    detail: "Get feedback on copy, wireframes, and prototypes from peers who want to build alongside you.",
  },
];

export default function Index() {
  return (
    <main className="landingPage">
      <section className="landingHero">
        <div className="landingHeroCopy">
          <span className="heroBadge">Skill exchange for students</span>
          <h1>Problinx turns stuck moments into a campus problem-solving network.</h1>
          <p>
            Post real project blockers, receive practical solutions from peers,
            and build a profile around the help you give and the skills you are growing.
          </p>

          <div className="landingActions">
            <Link to="/register" className="ctaPrimary">
              Create your account
            </Link>
            <Link to="/login" className="ctaSecondary">
              Open dashboard
            </Link>
          </div>

          <div className="landingTrustRow">
            <div className="landingTrustCard">
              <strong>Peer-first</strong>
              <span>Built for classmates helping classmates on real work.</span>
            </div>
            <div className="landingTrustCard">
              <strong>Credit-based</strong>
              <span>Reward approved solutions instead of counting empty replies.</span>
            </div>
          </div>
        </div>

        <div className="landingPreview">
          <div className="previewPanel previewPanelPrimary">
            <span className="previewLabel">Live problem</span>
            <h2>Need help fixing my Supabase auth redirect in a Vite app</h2>
            <p>
              I can sign in, but the app keeps landing on the wrong route after authentication.
            </p>
            <div className="tags">
              <span>React</span>
              <span>Supabase</span>
              <span>Routing</span>
            </div>
          </div>

          <div className="previewPanel previewPanelSecondary">
            <div>
              <span className="previewLabel">Best-fit solver</span>
              <strong>Aisha, Frontend + Backend</strong>
            </div>
            <p>Suggested fix: route public visitors to landing, then send authenticated users to `/dashboard`.</p>
          </div>
        </div>
      </section>

      <section className="landingSection">
        <div className="sectionHeader">
          <div>
            <span className="sectionLabel">How it works</span>
            <h2>Simple flow, real accountability</h2>
          </div>
        </div>

        <div className="journeyGrid">
          {journeySteps.map((step, index) => (
            <article key={step.title} className="journeyCard">
              <span className="journeyIndex">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection">
        <div className="sectionHeader">
          <div>
            <span className="sectionLabel">Use cases</span>
            <h2>Designed for the problems students actually hit</h2>
          </div>
        </div>

        <div className="spotlightGrid">
          {spotlightCards.map((card) => (
            <article key={card.title} className="spotlightCard">
              <span className="problemIndex">{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landingCallout">
        <div>
          <span className="sectionLabel">Start now</span>
          <h2>Launch your Problinx network with profiles, problems, and approvals.</h2>
          <p>
            The dashboard, posting flow, review queue, and profile pages are already wired in.
            This landing page now gives the product a real front door.
          </p>
        </div>

        <div className="landingActions">
          <Link to="/register" className="ctaPrimary">
            Join the community
          </Link>
          <Link to="/login" className="sectionLink">
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
