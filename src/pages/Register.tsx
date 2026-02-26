import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillHave: "",
    skillWant: "",
  });
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Account created! Welcome to PROBLINX.");
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl hero-gradient">
            <UserPlus className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Join PROBLINX</h1>
          <p className="mt-1 text-muted-foreground">Start exchanging skills today</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 card-elevated">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="John Doe" className="pl-10" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@college.edu" className="pl-10" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={form.password} onChange={(e) => handleChange("password", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillHave">Skill You Have</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="skillHave" placeholder="e.g. Python, UI Design" className="pl-10" value={form.skillHave} onChange={(e) => handleChange("skillHave", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillWant">Skill You Want to Learn</Label>
              <div className="relative">
                <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="skillWant" placeholder="e.g. Machine Learning" className="pl-10" value={form.skillWant} onChange={(e) => handleChange("skillWant", e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/" className="font-medium text-accent hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
