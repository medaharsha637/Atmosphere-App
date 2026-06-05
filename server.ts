import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Weather Advice API
app.post('/api/weather/ai-advice', async (req, res) => {
  try {
    const { city, temperature, tempUnit, condition, windSpeed, humidity } = req.body;
    
    if (!city || temperature === undefined) {
      return res.status(400).json({ error: 'Missing required parameters: city or temperature' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback when API key is missing
      return res.json({
        summary: `The current weather in ${city} is currently ${condition} at ${temperature}°${tempUnit || 'C'}.`,
        clothing: "Dress in comfortable layers suitable for the current local temperature and condition.",
        activities: [
          "Take a gentle stroll to explore the neighborhood",
          "Relax indoors with a favorite book or hot beverage",
          "Check local forecasts for sudden changes"
        ],
        safety: "Stay hydrated and carry an umbrella if skies look dark or uncertain."
      });
    }

    const prompt = `Provide weather planning and advisory recommendations for the city of ${city} with the following weather conditions:
- Temperature: ${temperature}°${tempUnit || 'C'}
- Condition description: ${condition}
- Wind Speed: ${windSpeed} km/h
- Humidity: ${humidity}%
Provide a concise, highly readable dashboard-style advisory. Be accurate to the season and typical dress codes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert meteorological assistant specialized in personal styling, outdoor activity planning, and safety alerts based on weather forecasts. Provide strictly human-oriented advice that is actionable and personalized. Limit responses to concise, clear advisory statements.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A summary sentence capturing the precise visual vibe and feel of the weather today."
            },
            clothing: {
              type: Type.STRING,
              description: "A specific styling and layering dress code recommendation (e.g., layers, outerwear, accessories)."
            },
            activities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 highly contextual and practical suggestions (both indoor and outdoor) suitable for this exact weather code."
            },
            safety: {
              type: Type.STRING,
              description: "Important health or environmental warnings or tips (UV protection, wind warnings, road conditions, allergen risks, rain preps)."
            }
          },
          required: ["summary", "clothing", "activities", "safety"]
        }
      }
    });

    const text = response.text || '{}';
    const advice = JSON.parse(text.trim());
    return res.json(advice);
  } catch (err: any) {
    console.error('Error in AI weather advice proxy:', err);
    return res.status(500).json({ error: 'Failed to generate AI weather advice', details: err.message });
  }
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite or Static serve
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static assets from dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather app server successfully listening at http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Fatal initialization error:', err);
});
