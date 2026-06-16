import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

type ProfileRecord = {
  credits?: number;
  email?: string;
  name?: string;
  skill_have?: string;
  skill_want?: string;
};

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    setUser(currentUser);

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("name,email,skill_have,skill_want,credits")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    setProfile(data);
    setLoading(false);
  }

  if (loading) {
    return <div className="page"><p>Loading profile...</p></div>;
  }

  if (!user) {
    return <div className="page"><p>Please sign in to view your profile.</p></div>;
  }

  const displayName =
    profile?.name || user.user_metadata?.name || user.email?.split("@")[0] || "Student";
  const displayEmail = profile?.email || user.email || "";
  const skillHave = profile?.skill_have || "Add a skill you can help others with";
  const skillWant = profile?.skill_want || "Add a skill you want to learn next";
  const credits = profile?.credits ?? 0;
  const connections = skillHave && skillWant ? 2 : 0;

  return (
    <div className="profilePage">
      <section className="profileHero">
        <div className="profileGlow profileGlowOne" />
        <div className="profileGlow profileGlowTwo" />

        <div className="profileIdentity">
          <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>

          <div>
            <span className="profileEyebrow">Your learning identity</span>
            <h1>{displayName}</h1>
            <p>{displayEmail}</p>
          </div>
        </div>

        <div className="profileHighlights">
          <div className="highlightCard">
            <span>You can help with</span>
            <strong>{skillHave}</strong>
          </div>
          <div className="highlightCard">
            <span>You want to learn</span>
            <strong>{skillWant}</strong>
          </div>
        </div>
      </section>

      <section className="profileGrid">
        <div className="profilePanel">
          <h2>Profile snapshot</h2>
          <p>
            This is what other students should see when they open your profile.
            Your skills now show up here instead of being hidden during sign-up.
          </p>

          <div className="skillChips">
            <span>{skillHave}</span>
            <span>{skillWant}</span>
          </div>

          <div className="profileActions">
            <Link to="/review" className="sectionLink">
              Review your posted problems
            </Link>
          </div>
        </div>

        <div className="statsPanel">
          <div className="statCard">
            <h3>{credits}</h3>
            <p>Credits</p>
          </div>
          <div className="statCard">
            <h3>1</h3>
            <p>Active profile</p>
          </div>
          <div className="statCard">
            <h3>{connections}</h3>
            <p>Skill paths</p>
          </div>
        </div>
      </section>
    </div>
  );
}
