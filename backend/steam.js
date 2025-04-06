const express = require("express");
const axios = require("axios");
const router = express.Router();

// Steam API credentials and user ID
const STEAM_API_KEY = "13E4AF2448ABFE7C4F1EA848B56E15E7"; // Steam API key
const STEAM_USER_ID = "76561198046984855"; //Steam user ID 

// 🔹 Get Steam game library
router.get("/games", async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`,
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

        res.json(games.map(game => ({
            appid: game.appid,
            name: game.name,
            playtime_hours: (game.playtime_forever / 60).toFixed(1),
            img_icon_url: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
        })));
    } catch (err) {
        console.error("Failed to fetch Steam games:", err.message);
        res.status(500).json({ error: "Failed to fetch games from Steam API" });
    }
});

// 🔹 Get Steam profile info
router.get("/profile", async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/`,
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
        console.error("Failed to fetch Steam profile:", err.message);
        res.status(500).json({ error: "Failed to fetch Steam profile" });
    }
});

// ✅ 🔹 New RAWG system requirements route
const RAWG_API_KEY = "ad2598b205694f199f6a7cc5684681d8";

router.get("/requirements", async (req, res) => {
    const gameName = req.query.game;

    try {
        // Step 1: Search for the game
        const searchURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameName)}`;
        const searchRes = await axios.get(searchURL);
        const searchData = searchRes.data;

        if (!searchData.results || searchData.results.length === 0) {
            return res.status(404).json({ error: "Game not found on RAWG" });
        }

        // Step 2: Get detailed data using first matched game's slug
        const slug = searchData.results[0].slug;
        const detailsURL = `https://api.rawg.io/api/games/${slug}?key=${RAWG_API_KEY}`;
        const detailsRes = await axios.get(detailsURL);
        const detailsData = detailsRes.data;

        // ✅ Find the "PC" platform specifically
        const pcPlatform = detailsData.platforms?.find(p => p.platform?.slug === "pc");
        const requirements = pcPlatform?.requirements || {
        minimum: "No data",
        recommended: "No data"
        };

        res.json({
        slug,
        name: detailsData.name,
        requirements,
        });

    } catch (error) {
        console.error("RAWG API error:", error.message);
        res.status(500).json({ error: "Failed to fetch from RAWG" });
    }
});

module.exports = router;
