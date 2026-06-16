import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Problem() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title.trim() || !description.trim() || !skill.trim()) {
      alert("Please fill in the title, description, and required skill");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      alert("Please login first");
      return;
    }

    const { error } = await supabase.from("problems").insert([
      {
        title: title.trim(),
        description: description.trim(),
        skills: skill,
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(`Could not post problem: ${error.message}`);
      return;
    }

    alert("Problem posted successfully");
    navigate("/dashboard");
  }

  return (
    <div className="problemPage">
      <section className="problemHero">
        <div className="problemHeroCopy">
          <span className="heroBadge">POST A PROBLEM</span>
          <h1>Turn a stuck moment into a collaboration opportunity.</h1>
          <p>
            Share what you are building, what is blocking you, and which skill
            would help most. The clearer the post, the better your matches.
          </p>

          <div className="problemSteps">
            <div className="stepCard">
              <strong>1</strong>
              <span>Write the challenge clearly</span>
            </div>
            <div className="stepCard">
              <strong>2</strong>
              <span>Name the skill you need</span>
            </div>
            <div className="stepCard">
              <strong>3</strong>
              <span>Invite the right peer help</span>
            </div>
          </div>
        </div>
      </section>

      <section className="problemComposer">
        <div className="sectionHeader">
          <div>
            <span className="sectionLabel">New challenge</span>
            <h2>Create your post</h2>
          </div>
        </div>

        <div className="formCard problemFormCard">
          <label htmlFor="problem-title">Problem title</label>
          <input
            id="problem-title"
            placeholder="Example: Need help debugging my React dashboard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="problem-description">Describe the problem</label>
          <textarea
            id="problem-description"
            placeholder="What are you trying to build, what have you tried, and where are you stuck?"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="problem-skill">Required skill</label>
          <input
            id="problem-skill"
            placeholder="Example: React, SQL, Figma, Python"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />

          <button onClick={submit} disabled={loading} className="primaryButton">
            {loading ? "Posting..." : "Submit Problem"}
          </button>
        </div>
      </section>
    </div>
  );
}
