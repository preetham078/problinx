import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillHave: "",
    skillWant: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function registerUser() {
    if (Object.values(form).some((value) => !value.trim())) {
      alert("Please fill in your name, email, and both skill fields");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          skill_have: form.skillHave,
          skill_want: form.skillWant,
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: user.id,
        email: form.email,
        name: form.name,
        skill_have: form.skillHave,
        skill_want: form.skillWant,
      });

      if (profileError) {
        setLoading(false);
        alert(profileError.message);
        return;
      }
    }

    setLoading(false);
    alert("Account created successfully");
    navigate("/login");
  }

  return (
    <div className="authPage">
      <div className="authShell">
        <section className="authHero authHeroWarm">
          <div className="heroBadge">BUILD YOUR PROFILE</div>
          <h1>Create a profile that shows what you know and what you want next.</h1>
          <p>
            Add your name, the skill you can offer, and the skill you want to
            learn so your profile becomes useful from day one.
          </p>

          <div className="heroOrbit">
            <span>Design</span>
            <span>Python</span>
            <span>DSA</span>
            <span>UI/UX</span>
          </div>
        </section>

        <section className="authCard">
          <div className="authCardTop">
            <div className="authIcon">+</div>
            <div>
              <h2>Create Account</h2>
              <p>Tell us how you want to show up in the community.</p>
            </div>
          </div>

          <div className="authForm">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@college.edu"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Choose a strong password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <label htmlFor="skillHave">Skill you can add</label>
            <input
              id="skillHave"
              placeholder="Example: React, Photoshop, Public speaking"
              value={form.skillHave}
              onChange={(e) => handleChange("skillHave", e.target.value)}
            />

            <label htmlFor="skillWant">Skill you want to learn</label>
            <input
              id="skillWant"
              placeholder="Example: Data analysis, UI design, AI"
              value={form.skillWant}
              onChange={(e) => handleChange("skillWant", e.target.value)}
            />

            <button onClick={registerUser} disabled={loading} className="primaryButton">
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>

          <p className="authSwitch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
