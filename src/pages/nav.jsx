import React from "react";
import { Link } from "react-router-dom";
import "../stylesheets/nav.css"; // Import the styles

function Nav() {
  return (
        <div className="top">
            <nav className="navbar">
                <Link href="/all-games">All Games</Link>
                <Link href="/most-played">Top 10 Played Games</Link>
                <Link href="/milestones">Milestones</Link>
                <Link href="/completed">100%ed Games</Link>
                <Link href="/finished">Finished Games</Link>
            </nav>
        </div>
  );
}

export default Nav;
