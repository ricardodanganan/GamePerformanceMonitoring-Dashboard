const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config(); // Load .env values

// 🔐 Use environment variables for safety
const AZURE_API_KEY = process.env.AZURE_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;
const API_VERSION = process.env.API_VERSION || "2023-05-15";


router.post('/api/optimize', async (req, res) => {
    const { gameName, specs } = req.body;

    console.log('🟡 Received from frontend:', { gameName, specs });

    if (!gameName || !specs) {
        return res.status(400).json({ error: 'Missing game name or system specs.' });
    }

    const prompt = `
    My PC has the following specs:
    - CPU: ${specs.cpu?.cpuName}
    - GPU: ${specs.gpu?.gpuName}
    - RAM: ${specs.ram?.totalRAM} MB

    Based on these specs, recommend the best graphics settings (resolution, textures, shadows, anti-aliasing, etc.) for the game "${gameName}".
    Mention if the system can run it on Ultra, High, Medium, or Low settings.
    Provide clear and brief optimization tips based on that game's in-game settings.
    `;

    try {
        const response = await fetch(
            `${AZURE_ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': AZURE_API_KEY,
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 400,
                }),
            }
        );

        const data = await response.json();

        console.log("🔵 Azure response:", JSON.stringify(data, null, 2));

        if (!data.choices || !data.choices.length) {
            return res.status(500).json({ error: 'No response from Azure OpenAI.' });
        }

        res.json({ recommendation: data.choices[0].message.content });

    } catch (error) {
        console.error("🔴 Azure OpenAI request failed:", error);
        res.status(500).json({ error: 'Failed to get AI recommendation.' });
    }
});

module.exports = router;

