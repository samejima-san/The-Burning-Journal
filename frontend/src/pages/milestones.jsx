import { useState } from "react";
import { Link } from "react-router-dom";
import "../stylesheets/milestones.css";

function Milestones() {
  const [currentTime, setCurrentTime] = useState(new Date());
  return (
    <div className="milestones">
      <div className="back">
        <Link to="/">{">"}</Link>
        <h1>Top 10 Games</h1>
        <p>{currentTime.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}</p>
      </div>
      <h1>Milestones Page</h1>
      <p>This page will display various milestones related to gaming achievements.</p>
      {/* Add your milestone content here */}
    </div>
  );
}   

export default Milestones;