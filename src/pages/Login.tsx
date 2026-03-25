import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginUser() {
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div className="authPage">
      <div className="authShell">
        <section className="authHero">
          <div className="heroBadge">PROBLINX</div>
          <h1>Trade skills. Solve real problems. Build your circle.</h1>
          <p>
            Sign in to meet peers, share what you know, and find the next skill
            you want to grow.
          </p>

          <div className="heroStats">
            <div className="heroStat">
              <strong>24/7</strong>
              <span>peer support</span>
            </div>
            <div className="heroStat">
              <strong>Skills</strong>
              <span>matched by interest</span>
            </div>
            <div className="heroStat">
              <strong>Projects</strong>
              <span>shared with your network</span>
            </div>
          </div>
        </section>

        <section className="authCard">
          <div className="authCardTop">
            <div className="authIcon">↗</div>
            <div>
              <h2>Sign In</h2>
              <p>Jump back into your learning profile.</p>
            </div>
          </div>

          <div className="authForm">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={loginUser} disabled={loading} className="primaryButton">
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          <p className="authSwitch">
            Need an account? <Link to="/register">Create one here</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
