import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../stylesheets/allgames.css";
import GameControls from "../components/gamecontrols";

function Completed() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const gameGridRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const API_BASE = process.env.REACT_APP_DEV === "dev" ? "http://localhost:5099/" : process.env.REACT_APP_API_URL;



  const limit = 30;

  const loadGames = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}tbj_games/completed?offset=${page * limit}&limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
    }
    const data = await res.json();
    console.log("Fetched data:", data);
    setGames((prev) => [...prev, ...data]); // Or data.games
  } catch (error) {
    console.error("Failed to load games", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadGames();
  }, [page]);

useEffect(() => {
  const grid = gameGridRef.current;
  if (!grid) return;

  const handleScroll = () => {
    const scrollTop = grid.scrollTop;
    const scrollHeight = grid.scrollHeight;
    const clientHeight = grid.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 200 && !loading) {
      console.log("Reached bottom of game-grid");
      setPage((prev) => prev + 1);
    }
  };

  grid.addEventListener("scroll", handleScroll);
  return () => grid.removeEventListener("scroll", handleScroll);
}, [loading]);


  return (
    <div className="game-wrapper">
      <div className="main-container">
          <div className="back">
              <Link to="/">{">"}</Link>
              <h1>Completed Games</h1>
              <p>{currentTime.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}</p>
            </div>
        <div className="game-grid" ref={gameGridRef}>
          {games.map((game, index) => (
            <div key={index} className="game-tile" onClick={() => setSelectedGame(game)} >
              <img
                src={game.game_art_url[1] || "/placeholder.png"}
                alt={game.cleanname}
                loading="lazy"
                className="game-img"
              />
              <p>{game.cleanname}</p>
            </div>
          ))}
        </div>
          {selectedGame && (
          <div className="modal-overlay" onClick={() => setSelectedGame(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedGame(null)}>×</button>
              <div className="game-info">
                <h1>{selectedGame.cleanname}</h1>
                <img src={selectedGame.game_art_url[0] || "/placeholder.png"} alt="" />
                <div className="info">
                  <p>Year Played: {selectedGame.year_played}</p>
                  <p>Hours: {selectedGame.hours_played}</p>
                  <p>{selectedGame.rating === 0 || selectedGame.rating === null ? "Haven't Rated It Yet" : "Rating: " + selectedGame.rating }</p>
                  <p>Finished: {selectedGame.finished ?  "✔️ YES I DID ✔️" : "⏳ No...Cant Say That I Have" }</p>
                  <p>Completed: {selectedGame.completed ?  "✔️ YES I DID ✔️" : "⏳ No...Cant Say That I Have" }</p>
                </div>
                <p>{selectedGame.summary || "No summary available."}</p>
              </div>
          </div>
        </div>
  )}
        {loading && <p>Loading more games...</p>}
        </div>
        <div className="controls">
          <GameControls />
        </div>
    </div>
  );
}

export default Completed;
