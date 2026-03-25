// // // import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// // // import Dashboard from "./pages/Dashboard";
// // // import Problem from "./pages/Problem";
// // // import Profile from "./pages/Profile";

// // // function App() {
// // //   return (
// // //     <BrowserRouter>

// // //       {/* Navbar */}
// // //       <nav
// // //         style={{
// // //           display: "flex",
// // //           justifyContent: "space-between",
// // //           padding: "15px 40px",
// // //           background: "#0f172a",
// // //           color: "#fff",
// // //           alignItems: "center"
// // //         }}
// // //       >
// // //         <h2>PROBLINX</h2>

// // //         <div style={{ display: "flex", gap: "20px" }}>
// // //           <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
// // //             Dashboard
// // //           </Link>

// // //           <Link to="/post" style={{ color: "#fff", textDecoration: "none" }}>
// // //             Post Problem
// // //           </Link>

// // //           <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>
// // //             Profile
// // //           </Link>
// // //         </div>
// // //       </nav>

// // //       {/* Pages */}
// // //       <Routes>
// // //         <Route path="/" element={<Dashboard />} />
// // //         <Route path="/post" element={<Problem />} />
// // //         <Route path="/profile" element={<Profile />} />
// // //       </Routes>

// // //     </BrowserRouter>
// // //   );
// // // }

// // // export default App;
// // import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// // import Dashboard from "./pages/Dashboard";
// // import Problem from "./pages/Problem";
// // import Profile from "./pages/Profile";

// // function App() {
// //   return (
// //     <BrowserRouter>

// //       <nav className="navbar">

// //         <h2 className="logo">🚀 PROBLINX</h2>

// //         <div className="navlinks">
// //           <Link to="/">Dashboard</Link>
// //           <Link to="/post">Post Problem</Link>
// //           <Link to="/profile">Profile</Link>
// //         </div>

// //       </nav>

// //       <Routes>
// //         <Route path="/" element={<Dashboard />} />
// //         <Route path="/post" element={<Problem />} />
// //         <Route path="/profile" element={<Profile />} />
// //       </Routes>

// //     </BrowserRouter>
// //   );
// // }

// // export default App;
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import { supabase } from "./supabaseClient";

// import Dashboard from "./pages/Dashboard";
// import Problem from "./pages/Problem";
// import Profile from "./pages/Profile";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// function App() {

// async function logout(){
// await supabase.auth.signOut()
// window.location.href="/login"
// }

// return (

// <BrowserRouter>

// <nav className="navbar">

// <h2 className="logo">🚀 PROBLINX</h2>

// <div className="navLinks">
// <Link to="/">Dashboard</Link>
// <Link to="/post">Post Problem</Link>
// <Link to="/profile">Profile</Link>
// <Link to="/login">Login</Link>
// <Link to="/register">Register</Link>
// </div>

// </nav>
// <Routes>

// <Route path="/" element={<Dashboard />} />

// <Route path="/post" element={<Problem />} />

// <Route path="/profile" element={<Profile />} />

// <Route path="/login" element={<Login />} />

// <Route path="/register" element={<Register />} />

// </Routes>

// </BrowserRouter>

// );

// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Dashboard from "./pages/Dashboard";
import Problem from "./pages/Problem";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReviewSolutions from "./pages/ReviewSolutions";

function App() {

const [user,setUser] = useState<any>(null)

useEffect(()=>{

checkUser()

supabase.auth.onAuthStateChange((event,session)=>{
setUser(session?.user ?? null)
})

},[])

async function checkUser(){

const {data} = await supabase.auth.getUser()

setUser(data.user)

}

async function logout(){

await supabase.auth.signOut()

window.location.href="/login"

}

return(

<BrowserRouter basename={import.meta.env.BASE_URL}>

<nav className="navbar">

<Link to="/" className="logo">
PROB<span>LINX</span>
</Link>

<div className="navlinks">

{user && (
<>
<Link to="/">Home</Link>
<Link to="/post">Post Problem</Link>
<Link to="/review">Review Solutions</Link>
<Link to="/profile">Profile</Link>

<button onClick={logout}>
Logout
</button>
</>
)}

</div>

</nav>

<Routes>

{!user && (
<>
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="*" element={<Navigate to="/login"/>} />
</>
)}

{user && (
<>
<Route path="/" element={<Dashboard />} />
<Route path="/post" element={<Problem />} />
<Route path="/review" element={<ReviewSolutions />} />
<Route path="/profile" element={<Profile />} />
<Route path="*" element={<Navigate to="/"/>} />
</>
)}

</Routes>

</BrowserRouter>

)

}

export default App;
