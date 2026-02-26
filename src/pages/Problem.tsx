import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlignLeft, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import AppNavbar from "@/components/AppNavbar";

const Problem = () => {
  const [form, setForm] = useState({ title: "", description: "", skills: "" });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.skills) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Problem posted successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl font-bold text-foreground">Post a Problem</h1>
          <p className="mt-1 text-muted-foreground">Describe your problem and the skills needed to solve it.</p>

          <div className="mt-8 rounded-xl border border-border bg-card p-8 card-elevated">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Problem Title</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="title"
                    placeholder="e.g. Need help with REST API"
                    className="pl-10"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="desc"
                    placeholder="Describe your problem in detail..."
                    className="min-h-[120px] pl-10"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <div className="relative">
                  <Tags className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="skills"
                    placeholder="e.g. Node.js, Express, MongoDB"
                    className="pl-10"
                    value={form.skills}
                    onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Submit Problem
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Problem;
