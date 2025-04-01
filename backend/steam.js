const express = require("express");
const axios = require("axios");
const router = express.Router();

// Steam API credentials and user ID
const STEAM_API_KEY = "13E4AF2448ABFE7C4F1EA848B56E15E7"; // Steam API key
const STEAM_USER_ID = "76561198046984855"; //Steam user ID 

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

// ✅ New route to get Steam profile info (for avatar)
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
            avatar: player.avatarfull, // full-sized profile pic
        });
    } catch (err) {
        console.error("Failed to fetch Steam profile:", err.message);
        res.status(500).json({ error: "Failed to fetch Steam profile" });
    }
});

module.exports = router;
