import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { BrowserRouter, HashRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Problem from "./pages/Problem";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ReviewSolutions from "./pages/ReviewSolutions";

function App() {
  const [user, setUser] = useState<any>(null);
  const isNativePlatform = Capacitor.isNativePlatform();
  const Router = isNativePlatform ? HashRouter : BrowserRouter;
  const routerProps = isNativePlatform ? {} : { basename: import.meta.env.BASE_URL };

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = isNativePlatform ? "/#/login" : `${import.meta.env.BASE_URL}login`;
  }

  return (
    <Router {...routerProps}>
      <nav className="navbar">
        <Link to={user ? "/dashboard" : "/"} className="logo">
          PROB<span>LINX</span>
        </Link>

        <div className="navlinks">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/post">Post Problem</Link>
              <Link to="/review">Review Solutions</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register" className="navPill">
                Join Problinx
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route path="/post" element={user ? <Problem /> : <Navigate to="/login" replace />} />
        <Route path="/review" element={user ? <ReviewSolutions /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
