import React, { useEffect, useState } from "react";
import "./GameLibrary.css";

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/steam/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch games", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-text">Loading Steam Library...</p>;

  return (
    <div className="library-container">
      <h2 className="library-heading">🎮 Your Steam Game Library</h2>
      <div className="game-grid">
        {games.map((game) => (
          <div key={game.appid} className="game-card">
            <img src={game.img_icon_url} alt={game.name} className="game-icon" />
            <h4>{game.name}</h4>
            <p>Playtime: {game.playtime_hours} hrs</p>
            <button className="opt-btn">Optimize</button>
            <button className="check-btn">Installed?</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLibrary;
