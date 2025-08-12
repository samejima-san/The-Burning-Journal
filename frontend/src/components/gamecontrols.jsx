import React from "react";


import "../stylesheets/gamecontrols.css";

function GameControls() {
  return (
<div className="controls-area">
  <div className="dpad">
    <button className="up">▲</button>
    <div className="middle">
      <button className="left">◀</button>
      <button className="center"></button>
      <button className="right">▶</button>
    </div>
    <button className="down">▼</button>
  </div>
  <div className="buttons">
    <button className="a-button">A</button>
    <button className="b-button">B</button>
  </div>
</div>

  );
}

export default GameControls;