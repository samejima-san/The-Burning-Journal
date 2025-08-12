import { useEffect, useState } from "react";
import "../stylesheets/home.css";
import GameControls from "../components/gamecontrols";
import Nav from "./nav";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [GOTD, setGOTD] = useState([null]);
  const [gameinfo, setGameinfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_DEV === "dev" ? "http://localhost:5099/" : process.env.REACT_APP_API_URL;
  useEffect(() => {
      axios.get(`${API_BASE}GOTD`)
          .then(res => {
            setGOTD(res.data);
            setLoading(false);
          })
          .catch(err => console.error(err));
  }, []);
  return (
    <div className="game-wrapper">
      <div className="main-container">
        <Nav></Nav>
        <div className="bottom">
          <h2>Something New?</h2>
          <button className="surprise-button" type="button" onClick={()=>(navigate("/surprise-me"))}>Surprise Me</button>
        </div>
        <div className="sidebar">
          <div className="image">
            <img src={ loading ? "loading" : GOTD[1][0]?.cover?.url  ? `https:${GOTD[1][0]?.cover?.url.replace("t_thumb", "t_cover_big")}`: "fallback-image.jpg"} alt="game art" />
          </div>
          <div className="gametitle">
            <h3>Game of the day</h3>
            <p key={loading ? "loading" : GOTD[0]?.id} >{loading ? "loading" : GOTD[0]?.vg_name }</p>
            <p className="description"> {loading ? "loading" : GOTD[1][0]?.summary}</p>
            <button className="mute-button" type="button">mute</button>
          </div>
        </div>
    </div>
      <div className="controls">
        <GameControls /> 
      </div>
    </div>
  );
}

export default Home;
