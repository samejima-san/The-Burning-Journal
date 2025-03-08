import { useEffect, useState } from "react";
import "../stylesheets/top10played.css";
import axios from "axios";
import { Link } from "react-router-dom";

function Top10() {
  const [Ten, setTen] = useState([null]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
      axios.get("http://localhost:5099/top10")
          .then(res => {
            setTen(res.data);
            setLoading(false);
          })
          .catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, []);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="tenscreen">
        <div className="back">
            <Link to="/">{">"}</Link>
            <p>{currentTime.toLocaleTimeString()}</p>
        </div>
        <div className="top10">
            { loading ? <div className="item">loading...</div> : 
                Ten[0].map((game, index) => {
                return <div key={index} className="item">
                    <h3>Total hours played: {game?.hours_played}</h3>
                    <h2>{game?.vg_name}</h2>
                    <h3>Year I started playing: {game?.year_played}</h3>
                    <p>Completed: {game?.completed ? <input type="checkbox" checked/> : <input type="checkbox" checked disabled/> }</p>
                </div>
                //imagebutwedonthavethatreeee
            })}
        </div>
    </div>
  );
}

export default Top10;
