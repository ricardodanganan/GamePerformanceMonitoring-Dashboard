import React, { useEffect, useState } from "react";
import "./GameLibrary.css";

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch game library
    fetch("http://localhost:3001/steam/games")
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error("Failed to fetch games", err));

    // Fetch profile info (avatar + name)
    fetch("http://localhost:3001/steam/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  return (
    <div className="library-container">
      {profile && (
        <div className="profile-section">
          <img src={profile.avatar} alt="Steam Avatar" className="steam-avatar" />
          <h3 className="steam-name">{profile.name}</h3>
        </div>
      )}

      <h2 className="library-heading">🎮 Your Steam Game Library</h2>
      <div className="game-grid">
        {games.map((game) => (
          <div key={game.appid} className="game-card">
            <img src={game.img_icon_url} alt={game.name} className="game-icon" />
            <div className="game-title">{game.name}</div>
            <p className="game-playtime">Playtime: {game.playtime_hours} hrs</p>
            <div className="btn-container">
              <button className="opt-btn">Optimize</button>
              <button className="check-btn">Installed?</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLibrary;
