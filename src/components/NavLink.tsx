import { Link } from "react-router-dom";

export default function Navbar(){

return(

<div className="navbar">

<div className="logo">
PROB<span>LINX</span>
</div>

<div className="navicons">

<Link to="/">🏠</Link>

<Link to="/profile">👤</Link>

<Link to="/post">➕</Link>

<Link to="/login">🚪</Link>

</div>

</div>

)

}