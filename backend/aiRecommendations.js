const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config(); // Load .env values

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;
const API_VERSION = process.env.API_VERSION || "2023-05-15";

router.post('/api/optimize', async (req, res) => {
  const { gameName, specs, requirements } = req.body;

  console.log('🟡 Received optimization request:', { gameName, specs, requirements });

  if (!gameName || !specs || !requirements) {
    return res.status(400).json({ error: 'Missing game name, system specs, or requirements.' });
  }

  try {
    const prompt = `
    Compare the user's PC specifications to the game's minimum and recommended requirements.
    State whether each component (CPU, RAM, GPU) is below, meets, or exceeds the game's requirements.
    Finally, recommend the best graphics setting (Low, Medium, High, Ultra) the user should start with.
    
    Game: ${gameName}
    
    == Game Requirements ==
    
    Minimum:
    ${requirements.minimum}
    
    Recommended:
    ${requirements.recommended}
    
    == User's PC Specs ==
    
    CPU: 12th Gen Intel(R) Core(TM) i7-12650H, 10 cores, 2.7 GHz  
    RAM: 32,454 MB (32 GB)  
    GPU: NVIDIA GeForce RTX 4060 Laptop GPU, 1140 MHz clock speed, 12.44 TFLOPS  
    
    Based on the comparison, provide a short summary that includes:
    1. Whether the user's PC can run the game.
    2. Recommended graphics settings.
    3. Performance tip if any component is near the minimum.
    `;    

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
          max_tokens: 600,
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
