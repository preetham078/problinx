import { Link } from "react-router-dom";
import { PlusCircle, Users, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppNavbar from "@/components/AppNavbar";

const problems = [
  { id: 1, title: "Need help building a REST API", desc: "Looking for someone experienced in Node.js/Express to help build a REST API for my e-commerce project.", skills: ["Node.js", "Express"], author: "Anika S.", time: "2h ago" },
  { id: 2, title: "UI Design for Mobile App", desc: "I need a clean Figma mockup for a fitness tracking app. Can offer Python tutoring in return.", skills: ["Figma", "UI/UX"], author: "Rahul M.", time: "5h ago" },
  { id: 3, title: "Machine Learning model tuning", desc: "Struggling with hyperparameter tuning for my CNN. Would love guidance from someone with ML experience.", skills: ["Python", "TensorFlow"], author: "Priya K.", time: "1d ago" },
];

const team = [
  { name: "Anika S.", skill: "Node.js", avatar: "A" },
  { name: "Rahul M.", skill: "UI/UX Design", avatar: "R" },
  { name: "Priya K.", skill: "Machine Learning", avatar: "P" },
  { name: "Dev T.", skill: "Flutter", avatar: "D" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Welcome */}
        <div className="mb-8 rounded-xl hero-gradient p-8 text-primary-foreground animate-fade-in">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Welcome back, Student! 👋</h1>
          <p className="mt-2 opacity-90">Find peers, exchange skills, and solve problems together.</p>
          <Link to="/problem">
            <Button variant="secondary" className="mt-4 gap-2">
              <PlusCircle className="h-4 w-4" /> Post a Problem
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Problems */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" /> Recent Problems
              </h2>
            </div>
            {problems.map((p, i) => (
              <div
                key={p.id}
                className="rounded-xl border border-border bg-card p-5 card-elevated animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-semibold text-card-foreground">{p.title}</h3>
                  <span className="text-xs text-muted-foreground">{p.time}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {p.skills.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                  <span className="ml-auto text-xs text-muted-foreground">by {p.author}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Team Preview */}
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" /> Peer Network
            </h2>
            <div className="space-y-3">
              {team.map((t, i) => (
                <div
                  key={t.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 card-elevated animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full hero-gradient text-sm font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.skill}</p>
                  </div>
                  <MessageSquare className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
