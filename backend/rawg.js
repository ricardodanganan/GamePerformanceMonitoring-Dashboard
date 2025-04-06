// rawg.js (or paste at the bottom of steam.js)
const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔑 Your RAWG API key
const RAWG_API_KEY = "ad2598b205694f199f6a7cc5684681d8";

// 🔍 Get system requirements by game name
router.get("/requirements/:game", async (req, res) => {
    const gameName = req.params.game;

    try {
        // Step 1: Search the game by name
        const searchResponse = await axios.get("https://api.rawg.io/api/games", {
            params: {
                search: gameName,
                key: RAWG_API_KEY
            }
        });

        const results = searchResponse.data.results;
        if (!results || results.length === 0) {
            return res.status(404).json({ error: "Game not found" });
        }

        const slug = results[0].slug;

        // Step 2: Fetch full detail using the slug
        const detailResponse = await axios.get(`https://api.rawg.io/api/games/${slug}`, {
            params: {
                key: RAWG_API_KEY
            }
        });

        const gameDetails = detailResponse.data;
        const pcPlatform = gameDetails.platforms.find(p => p.platform.name === "PC");
        const requirements = pcPlatform?.requirements || {};

        res.json({
            game: gameDetails.name,
            slug: gameDetails.slug,
            requirements
        });

    } catch (error) {
        console.error("Error fetching RAWG data:", error.message);
        res.status(500).json({ error: "Failed to fetch system requirements" });
    }
});

module.exports = router;
