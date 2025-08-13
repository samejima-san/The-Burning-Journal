import { useEffect, useState } from "react";
import "../stylesheets/top10played.css";
import GameControls from "../components/gamecontrols";
import axios from "axios";
import { Link } from "react-router-dom";

function Top10() {
  const [Ten, setTen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const API_BASE = process.env.REACT_APP_DEV === "dev" ? "http://localhost:5099/" : process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE}top10`)
      .then((res) => {
        console.log("Fetched data:", res.data);
        setTen(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function normalizeName(name) {
    return name.toLowerCase().replace(/\s*\(.*?\)\s*/g, "").trim();
  }

  // Safe check before building reorderedImages
  let reorderedImages = [];
  if (Ten.length === 2 && Ten[0] && Ten[1]) {
    const normalizedToImage = new Map();
    Ten[1].forEach((img) => {
      normalizedToImage.set(normalizeName(img.name), img);
    });

    reorderedImages = Ten[0].map(
      (game) => normalizedToImage.get(normalizeName(game.vg_name)) || { image_url: "default.jpg" }
    );
  }

  return (
    <div className="game-wrapper">
      <div className="main-container">
        <div className="back">
          {console.log(`${API_BASE}top10`)}
          <Link to="/">{">"}</Link>
          <h1>Top 10 Games</h1>
          <p>{currentTime.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
          })}</p>
        </div>

        <div className="top10">
          {loading ? (
            <div className="item">loading...</div>
          ) : Ten.length === 2 && Ten[0]?.length > 0 ? (
            Ten[0].map((game, index) => (
              <div key={index} className="item">
                <div className="leftside">
                  <img src={reorderedImages[index]?.image_url} alt={game.vg_name} />
                </div>
                <div className="rightside">
                  <h3>Total hours played: {game.hours_played}</h3>
                  <h2>{game.vg_name}</h2>
                  <h3>Year I started playing: {game.year_played}</h3>
                  <p>
                    Completed:{" "}
                    <input type="checkbox" checked={game.completed} disabled={!game.completed} />
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No data found.</p>
          )}
        </div>
        <div className="controls">
          <GameControls />
        </div>
      </div>
    </div>
  );
}

export default Top10;
