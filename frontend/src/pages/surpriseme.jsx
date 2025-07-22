import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../stylesheets/surpriseme.css";

function SurpriseMe() {
   const [currentTime, setCurrentTime] = useState(new Date());
   const [game, setGame] = useState(null);
   const [loading, setLoading] = useState(true);
   const API_BASE = process.env.REACT_APP_DEV === "dev" ? "http://localhost:5099/" : process.env.REACT_APP_API_URL;

     useEffect(() => {
      axios.get(`${API_BASE}surprise-me`)
          .then(res => {
            setGame(res.data);
            setLoading(false);
          })
          .catch(err => console.error(err));
  }, []);
  return (
    <div className="surprise-me">
        <div className="back">
          <Link to="/">{">"}</Link>
          <h1>Surprised?</h1>
          <p>{currentTime.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}</p>
      </div>
      <div className="content">
        <h1>{ loading ? "loading" : game[0].vg_name }</h1>
        <img src={loading ? "loading" : !game[1].length ? "/placeholder.png" : game[1][0].cover?.url ? `https:${game[1][0].cover.url.replace("t_thumb", "t_cover_big")}` : "/placeholder.png"} alt="game art" />
        <p>{loading ? "loading" : !game[1].length ? "No Summary Found" : game[1][0].summary }</p>
        <button className="mute-button" type="button">Mute</button>
      </div>
    </div>
  );
}
export default SurpriseMe;