import React, { useEffect, useState } from "react";
import "./GameLibrary.css";

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGame, setExpandedGame] = useState(null);
  const [requirementsData, setRequirementsData] = useState({});
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [pcSpecs, setPcSpecs] = useState(null);
  const [showSpecs, setShowSpecs] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchSpecs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/system-specs");
      const data = await res.json();
      setPcSpecs(data);
    } catch (err) {
      console.error("Failed to fetch specs:", err);
    }
    setLoading(false);
  };

  function extractValue(rawString, key) {
    try {
      const fixed = rawString.replace(/'/g, '"').replace(/None/g, "null");
      const parsed = JSON.parse(fixed);
      return parsed[key] || "Not Available";
    } catch (err) {
      return "Invalid Data";
    }
  }

  // Function to get RAM status based on requirements and PC specs
  function getRAMStatus(reqData, pcSpecs) {
    const yourRAM_MB = parseInt(extractValue(pcSpecs.ram, "totalRAM"), 10);
    if (!reqData || !yourRAM_MB || isNaN(yourRAM_MB)) return "⚠️ Unable to compare";

    const ramRegex = /(\d+)\s?GB/i;
    const minMatch = reqData.minimum?.match(ramRegex);
    const recMatch = reqData.recommended?.match(ramRegex);

    const minGB = minMatch ? parseInt(minMatch[1]) : null;
    const recGB = recMatch ? parseInt(recMatch[1]) : null;
    const yourRAM_GB = yourRAM_MB / 1024;

    if (recGB && yourRAM_GB >= recGB) return "✅ Above Recommended";
    if (minGB && yourRAM_GB >= minGB) return "⚠️ Meets Minimum";
    if (minGB && yourRAM_GB < minGB) return "❌ Below Minimum";

    return "⚠️ Requirement data not available";
  }

  // Function to get CPU status based on requirements and PC specs
  function getCPUStatus(reqData, pcSpecs) {
    const yourCPU = extractValue(pcSpecs.cpu, "cpuName")?.toLowerCase();
    if (!yourCPU || !reqData) return "⚠️ Unable to compare";
  
    const cpuRegex = /(intel|amd)?\s*(core)?\s*(i\d|ryzen\s?\d)/i;
  
    const minMatch = reqData.minimum?.match(cpuRegex);
    const recMatch = reqData.recommended?.match(cpuRegex);
  
    const yourMatch = yourCPU.match(cpuRegex);
  
    if (!yourMatch || (!minMatch && !recMatch)) return "⚠️ Not enough data";
  
    const yourLevel = yourMatch[3].replace(/\s+/g, "").toLowerCase();
    const recLevel = recMatch?.[3].replace(/\s+/g, "").toLowerCase();
    const minLevel = minMatch?.[3].replace(/\s+/g, "").toLowerCase();
  
    // Order of preference
    const levels = ["i3", "i5", "i7", "i9", "ryzen3", "ryzen5", "ryzen7", "ryzen9"];
  
    const yourIndex = levels.indexOf(yourLevel);
    const recIndex = levels.indexOf(recLevel);
    const minIndex = levels.indexOf(minLevel);
  
    if (recIndex !== -1 && yourIndex >= recIndex) return "✅ Above Recommended";
    if (minIndex !== -1 && yourIndex >= minIndex) return "⚠️ Meets Minimum";
    if (minIndex !== -1 && yourIndex < minIndex) return "❌ Below Minimum";
  
    return "⚠️ Could not determine CPU match";
  }  

  // Function to get GPU status based on requirements and PC specs
  function getGPUStatus(reqData, pcSpecs) {
    const yourGPU = extractValue(pcSpecs.gpu, "gpuName")?.toLowerCase();
    if (!yourGPU || !reqData) return "⚠️ Unable to compare";
  
    const gpuRegex = /(gtx\s?\d{3,4}|rtx\s?\d{3,4}|rx\s?\d{3,4})/i;
  
    const recMatch = reqData.recommended?.match(gpuRegex);
    const minMatch = reqData.minimum?.match(gpuRegex);
  
    const yourMatch = yourGPU.match(gpuRegex);
  
    if (!yourMatch || (!minMatch && !recMatch)) return "⚠️ Not enough data";
  
    const yourModel = yourMatch[0].replace(/\s+/g, "").toLowerCase();
    const recModel = recMatch?.[0].replace(/\s+/g, "").toLowerCase();
    const minModel = minMatch?.[0].replace(/\s+/g, "").toLowerCase();
  
    const knownModels = [
      "gtx550", "gtx760", "gtx780", "gtx960", "gtx970", "gtx1050", "gtx1060", "gtx1070", "gtx1080",
      "rtx2060", "rtx2070", "rtx2080", "rtx3060", "rtx3070", "rtx3080", "rtx4060", "rtx4070", "rtx4080",
      "rx570", "rx580", "rx6600", "rx6700", "rx6800", "rx6900", "rx7600", "rx7700", "rx7900"
    ];
  
    const getModelRank = (model) => knownModels.indexOf(model);
  
    const yourRank = getModelRank(yourModel);
    const recRank = getModelRank(recModel);
    const minRank = getModelRank(minModel);
  
    if (recRank !== -1 && yourRank >= recRank) return "✅ Above Recommended";
    if (minRank !== -1 && yourRank >= minRank) return "⚠️ Meets Minimum";
    if (minRank !== -1 && yourRank < minRank) return "❌ Below Minimum";
  
    return "⚠️ Could not determine GPU match";
  }  

  return (
    <div className="library-container">
      {profile && (
        <div className="profile-section">
          <img src={profile.avatar} alt="Steam Avatar" className="steam-avatar" />
          <h3 className="steam-name">{profile.name}</h3>
        </div>
      )}

      <h2 className="library-heading">🎮 Steam Game Library</h2>
      <button className="pcspecs-btn" onClick={() => {
        setShowSpecs(true);
        fetchSpecs();
      }}>
        🖥️ Show My PC Specs
      </button>

      {showSpecs && (
        <div className="modal-overlay" onClick={() => setShowSpecs(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setShowSpecs(false)}>×</span>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner" />
                <p>Loading PC Specs...</p>
              </div>
            ) : (
              <>
                <h3>💻 Your PC Specs</h3>
                <div className="spec-row"><b>🧠 CPU:</b> {extractValue(pcSpecs.cpu, "cpuName")}</div>
                <div className="spec-row"><b>🎮 GPU:</b> {extractValue(pcSpecs.gpu, "gpuName")}</div>
                <div className="spec-row"><b>💾 Disk:</b> {extractValue(pcSpecs.disk, "totalDisk")} GB</div>
                <div className="spec-row"><b>🧬 RAM:</b> {extractValue(pcSpecs.ram, "totalRAM")} MB</div>
              </>
            )}
          </div>
        </div>
      )}

      <input
        type="text"
        className="search-bar"
        placeholder="Search games..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="game-grid">
        {[...games]
          .filter((game) => game.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
                <p className="game-playtime">Playtime: {game.playtime_hours} hrs</p>

                <div className="btn-container">
                  <button
                    className="opt-btn"
                    onClick={async () => {
                      if (expandedGame === game.appid) {
                        setExpandedGame(null);
                      } else {
                        setLoadingRequirements(true);
                        setExpandedGame(game.appid);
                        try {
                          const response = await fetch(
                            `http://localhost:3001/steam/requirements?game=${encodeURIComponent(game.name)}`
                          );
                          const data = await response.json();
                          setRequirementsData((prev) => ({
                            ...prev,
                            [game.appid]: data.requirements,
                          }));
                        } catch (error) {
                          setRequirementsData((prev) => ({
                            ...prev,
                            [game.appid]: {
                              minimum: "Error fetching requirements",
                              recommended: "",
                            },
                          }));
                        } finally {
                          setLoadingRequirements(false);
                        }
                      }
                    }}
                  >
                    {isExpanded ? "Hide Info" : "Requirements"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="accordion-content">
                    {loadingRequirements ? (
                      <p>⏳ Fetching system requirements...</p>
                    ) : (
                      <>
                        <p>📌 <strong>Minimum:</strong></p>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                          {requirementsData[game.appid]?.minimum || "Not available"}
                        </pre>
                        <p>📌 <strong>Recommended:</strong></p>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                          {requirementsData[game.appid]?.recommended || "Not available"}
                        </pre>

                        {pcSpecs && (
                          <div className="ram-compare-box">
                            <h4>🧪 RAM Comparison</h4>
                            <p>Your RAM: <strong>{extractValue(pcSpecs.ram, "totalRAM")} MB</strong></p>
                            <p>Status: <strong>{getRAMStatus(requirementsData[game.appid], pcSpecs)}</strong></p>
                            <h4>🧪 CPU Comparison</h4>
                            <p>Your CPU: <strong>{extractValue(pcSpecs.cpu, "cpuName")}</strong></p>
                            <p>Status: <strong>{getCPUStatus(requirementsData[game.appid], pcSpecs)}</strong></p>
                            <h4>🧪 GPU Comparison</h4>
                            <p>Your GPU: <strong>{extractValue(pcSpecs.gpu, "gpuName")}</strong></p>
                            <p>Status: <strong>{getGPUStatus(requirementsData[game.appid], pcSpecs)}</strong></p>
                          </div>
                        )}
                      </>
                    )}
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

