import { User, BookOpen, Target, Award } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-fade-in">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full hero-gradient text-3xl font-bold text-primary-foreground">
              S
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Student User</h1>
            <p className="text-muted-foreground">you@college.edu</p>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Credits Earned", value: "120", icon: Award },
              { label: "Problems Solved", value: "8", icon: Target },
              { label: "Peers Helped", value: "5", icon: User },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 text-center card-elevated">
                <Icon className="mx-auto h-6 w-6 text-accent" />
                <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 card-elevated">
              <div className="flex items-center gap-2 text-card-foreground">
                <BookOpen className="h-5 w-5 text-accent" />
                <h2 className="font-display font-semibold">Skill You Have</h2>
              </div>
              <p className="mt-2 text-muted-foreground">Python, Data Analysis, Flask</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 card-elevated">
              <div className="flex items-center gap-2 text-card-foreground">
                <Target className="h-5 w-5 text-accent" />
                <h2 className="font-display font-semibold">Skill You Want to Learn</h2>
              </div>
              <p className="mt-2 text-muted-foreground">React, UI/UX Design, Cloud Deployment</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
