import React, { useEffect, useState } from "react";
import "./GameLibrary.css"; // Import the CSS file for styling

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGame, setExpandedGame] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/steam/games")
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error("Failed to fetch games", err));

    fetch("http://localhost:3001/steam/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile", err));
  }, []);

  return (
    <div className="library-container">
      {profile && (
        <div className="profile-section">
          <img
            src={profile.avatar}
            alt="Steam Avatar"
            className="steam-avatar"
          />
          <h3 className="steam-name">{profile.name}</h3>
        </div>
      )}

      <h2 className="library-heading">🎮 Steam Game Library</h2>
      <input
        type="text"
        className="search-bar"
        placeholder="Search games..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="game-grid">
        {[...games]
          .filter((game) =>
            game.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .sort((a, b) => parseFloat(b.playtime_hours) - parseFloat(a.playtime_hours))
          .map((game) => {
            const isExpanded = expandedGame === game.appid;
            const isHidden = expandedGame !== null && !isExpanded;

            return (
              <div
                key={game.appid}
                className={`game-card ${isHidden ? "card-hidden" : "card-visible"}`}
              >
                <img src={game.img_icon_url} alt={game.name} className="game-icon" />
                <div className="game-title">{game.name}</div>
                <p className="game-playtime">
                  Playtime: {game.playtime_hours} hrs
                </p>
                <div className="btn-container">
                  <button
                    className="opt-btn"
                    onClick={() =>
                      setExpandedGame(isExpanded ? null : game.appid)
                    }
                  >
                    {isExpanded ? "Hide Info" : "Requirements"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="accordion-content">
                    <p>
                      🔧 Optimization info loading for <strong>{game.name}</strong>...
                    </p>
                    <p>
                      💡 This will later show system requirement comparison, settings
                      recommendations, etc.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GameLibrary;
