import { useEffect, useState } from "react";
import "../stylesheets/home.css";
import Nav from "./nav";
import axios from "axios";

function Home() {
  const [GOTD, setGOTD] = useState([null]);
  const [gameinfo, setGameinfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios.get("http://localhost:5099/GOTD")
          .then(res => {
            setGOTD(res.data);
            setLoading(false);
          })
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
        <div className="image">
          <img src={loading ? "loading" : GOTD[1][0]?.cover?.url} alt="" />
        </div>
        <div className="gametitle">
          <h3>Game of the day</h3>
          <p key={loading ? "loading" : GOTD[0]?.id} >{loading ? "loading" : GOTD[0]?.vg_name }</p>
          <p className="description"> {loading ? "loading" : GOTD[1][0]?.summary}</p>
          <button className="mute-button" type="button">mute</button>
        </div>
      </div>
    </>
  );
}

export default Home;
