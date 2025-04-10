const express = require("express");
const axios = require("axios");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
require("dotenv").config(); 

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_ID = process.env.STEAM_USER_ID;
const RAWG_API_KEY = process.env.RAWG_API_KEY;

// Get list of owned Steam games
router.get("/games", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
      {
        params: {
          key: STEAM_API_KEY,
          steamid: STEAM_USER_ID,
          include_appinfo: true,
          include_played_free_games: true,
        },
      }
    );

    const games = response.data.response.games || [];
    res.json(
      games.map((game) => ({
        appid: game.appid,
        name: game.name,
        playtime_hours: (game.playtime_forever / 60).toFixed(1),
        img_icon_url: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
      }))
    );
  } catch (err) {
    console.error("Steam games error:", err.message);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// Get Steam profile info
router.get("/profile", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
      {
        params: {
          key: STEAM_API_KEY,
          steamids: STEAM_USER_ID,
        },
      }
    );

    const player = response.data.response.players[0];
    res.json({
      name: player.personaname,
      avatar: player.avatarfull,
    });
  } catch (err) {
    console.error("Steam profile error:", err.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get RAWG requirements
router.get("/requirements", async (req, res) => {
  const gameName = req.query.game;
  try {
    const searchURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameName)}`;
    const searchRes = await axios.get(searchURL);
    const results = searchRes.data?.results;

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Game not found on RAWG" });
    }

    const slug = results[0].slug;
    const detailsURL = `https://api.rawg.io/api/games/${slug}?key=${RAWG_API_KEY}`;
    const detailsRes = await axios.get(detailsURL);

    const pcPlatform = detailsRes.data.platforms?.find(
      (p) => p.platform?.slug === "pc"
    );
    const requirements = pcPlatform?.requirements || {
      minimum: "No data",
      recommended: "No data",
    };

    res.json({
      slug,
      name: detailsRes.data.name,
      requirements,
    });
  } catch (err) {
    console.error("RAWG error:", err.message);
    res.status(500).json({ error: "Failed to fetch from RAWG" });
  }
});

// Export single game's data to CSV
router.post("/export-csv", (req, res) => {
  const data = req.body;

  if (!data || !data.name) {
    return res.status(400).json({ error: "Invalid game data." });
  }

  const csvData = {
    "Game Name": data.name,
    "Playtime (hrs)": data.playtime,
    "CPU": data.specs.cpu,
    "CPU Status": data.comparisons.cpu,
    "GPU": data.specs.gpu,
    "GPU Status": data.comparisons.gpu,
    "RAM (MB)": data.specs.ram,
    "RAM Status": data.comparisons.ram,
    "Optimization Summary": data.aiTip || "No tip available",
  };

  const json2csv = new Parser();
  const csv = json2csv.parse(csvData);

  const fileName = `${data.name.replace(/[^a-z0-9]/gi, "_")}_Report.csv`;
  const filePath = path.join(__dirname, "../exports", fileName);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, csv);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("CSV download error:", err.message);
      res.status(500).json({ error: "Failed to export CSV" });
    } else {
      fs.unlinkSync(filePath); // cleanup after download
    }
  });
});

module.exports = router;
