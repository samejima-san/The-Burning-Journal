import { useEffect, useState } from "react";
import "../stylesheets/home.css";
import Nav from "./nav";
import axios from "axios";

function Home() {
  const [GOTD, setGOTD] = useState([]);
  const [gameinfo, setGameinfo] = useState([]);

  useEffect(() => {
      axios.get("http://localhost:5099/GOTD")
          .then(res => setGOTD(res.data))
          .catch(err => console.error(err));
  }, []);
  return (
    <>
      <Nav></Nav>
      <div className="bottom">
        <h2>Something New?</h2>
        <button className="surprise-button" type="button">Surprise Me</button>
      </div>
      <div className="sidebar">
        <img src={GOTD[1][0]?.cover?.url} alt="" />
        <h3>Game of the day</h3>
        <p key={GOTD[0]?.id} >{GOTD[0]?.vg_name || "loading"}</p>
        <p className="description"> {GOTD[1][0]?.summary || "loading"}</p>
        <button className="mute-button" type="button">mute</button>
      </div>
    </>
  );
}

export default Home;
