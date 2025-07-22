import React from "react";
import { Link } from "react-router-dom";
import "../stylesheets/nav.css"; // Import the styles

function Nav() {
  return (
        <div className="top">
            <nav className="navbar">
                <Link to="/all-games">All Games</Link>
                <Link to="/top10">Top 10 Played Games</Link>
                <Link to="/milestones">Milestones</Link>
                <Link to="/completed">100%ed Games</Link>
                <Link to="/finished">Finished Games</Link>
            </nav>
        </div>
  );
}

export default Nav;
