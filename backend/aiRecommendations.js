// 📍 backend/aiRecommendations.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Make sure node-fetch@2 is installed

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
Mention if the system can run it on Ultra, High, Medium, or Low settings. Provide clear and brief optimization tips.
`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer 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`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        const data = await response.json();
        console.log('🔵 OpenRouter response:', JSON.stringify(data, null, 2));

        if (!data.choices || !data.choices.length) {
            return res.status(500).json({ error: 'No response from OpenRouter.' });
        }

        res.json({ recommendation: data.choices[0].message.content });

    } catch (error) {
        console.error('🔴 OpenRouter request failed:', error);
        res.status(500).json({ error: 'Failed to get AI recommendation.' });
    }
});

module.exports = router;
