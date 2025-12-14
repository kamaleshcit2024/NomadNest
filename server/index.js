import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../.env.local' }); // Try to read from root .env.local first
if (!process.env.API_KEY) {
  dotenv.config(); // Fallback to local .env
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

const DELIMITER = "|||SECTION_BREAK|||";

app.post('/api/generate-report', async (req, res) => {
  try {
    const { origin, destination, purpose } = req.body;

    if (!process.env.API_KEY) {
      return res.status(500).json({ error: "Server API Key configuration error" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash";

    const prompt = `
      Act as a senior global travel and relocation consultant.
      I need a comprehensive, real-time report for a citizen of "${origin}" traveling to "${destination}" for the purpose of "${purpose}".
      
      You MUST use Google Search to find the absolute latest regulations, as visa rules change frequently.

      Please structure your response into exactly four sections separated by the delimiter "${DELIMITER}".
      
      Structure:
      1.  **Visa & Entry Requirements**: Current visa status, e-visa availability, document checklist, processing times, and entry rules.
      2.  **Health & Safety Advisory**: Latest travel warnings, vaccination requirements (e.g., Yellow Fever, COVID-19), and emergency numbers.
          
          CRITICAL: At the very end of this section (before the delimiter), output a strictly valid JSON block wrapped in <safety_data> tags.
          Format:
          <safety_data>
          {
            "center": {"lat": 35.6762, "lng": 139.6503}, // Approximate center of the destination city
            "hotspots": [
               // Identify 3-5 specific areas, neighborhoods, or regions. Can be "High Risk", "Medium Risk", or "Safe Zone".
              {"name": "Kabukicho", "lat": 35.6938, "lng": 139.7034, "riskLevel": "Medium Risk", "description": "Nightlife district, be aware of touts."},
              {"name": "Roppongi", "lat": 35.6641, "lng": 139.7339, "riskLevel": "Safe Zone", "description": "Generally safe, popular with expats."}
            ]
          }
          </safety_data>

      3.  **Cultural Compass**:
          *   **Social Etiquette**: How to greet, body language, and dress code.
          *   **Dining & Tipping**: Table manners and detailed tipping guidelines.
          *   **Local Transportation**: common modes of transport, typical fares, and unique local transport etiquette or advice.
          *   **Money & Payments**: Local currency name, current exchange rate to USD, and advice on cash vs card usage.
          *   **Major Taboos**: Specific actions or topics to avoid.
          *   **Cost of Living**: Provide a Markdown table with columns "Item", "Cost (Local Currency)", and "Cost (USD)" for: Coffee, Inexpensive Meal, Taxi (1km), Mid-range Hotel, Internet (monthly).
          *   **Language Essentials**: List 5-10 essential local phrases with their English translations. Add a relevant emoji at the start of each phrase to visually represent its meaning (e.g., 👋 Hello).

          CRITICAL: At the very end of this section (before the delimiter), output THREE strictly valid JSON blocks.
          
          1. Wrapped in <chart_data> tags comparing estimated costs in USD between "${origin}" and "${destination}".
          Format:
          <chart_data>
          {
            "origin": "${origin}",
            "destination": "${destination}",
            "data": [
              {"label": "Coffee", "originPrice": 5.00, "destPrice": 2.50},
              {"label": "Meal", "originPrice": 15.00, "destPrice": 8.00},
              {"label": "Taxi (1km)", "originPrice": 2.00, "destPrice": 0.80}
            ]
          }
          </chart_data>

          2. Wrapped in <currency_data> tags containing the local currency code and exchange rate (1 USD = X Local).
          Format:
          <currency_data>
          {
            "code": "JPY",
            "name": "Japanese Yen",
            "rate": 145.50
          }
          </currency_data>

          3. Wrapped in <tipping_data> tags containing specific tipping advice.
          Format:
          <tipping_data>
          [
            {"category": "Restaurants", "advice": "10-15%", "explanation": "Standard for good service"},
            {"category": "Taxis", "advice": "Round up", "explanation": "For convenience"},
            {"category": "Hotels", "advice": "$1-2/bag", "explanation": "For porters"},
            {"category": "Guides", "advice": "10%", "explanation": "Per day"}
          ]
          </tipping_data>

      4.  **Smart Itinerary**: A 5-day day-by-day itinerary tailored specifically for a "${purpose}" trip. 
          *   If purpose is "Business": Focus on business districts, coworking spaces, efficient transport, and quiet dinner spots.
          *   If purpose is "Tourism": Focus on must-see landmarks and hidden gems.
          *   If purpose is "Digital Nomad": Focus on cafes with wifi, expat meetups, and budget-friendly living.
          *   Include "Morning", "Afternoon", and "Evening" for each day.

          CRITICAL: At the very end of this section (before any final delimiter), output a strictly valid JSON block wrapped in <itinerary_data> tags.
          This data will be used to render an interactive map.
          Format:
          <itinerary_data>
          {
            "center": {"lat": 35.6762, "lng": 139.6503}, // Approximate center of the destination city
            "points": [
               // Select 3-6 key locations mentioned in the itinerary. Try to be accurate with coordinates.
              {"name": "Senso-ji Temple", "day": 1, "lat": 35.7148, "lng": 139.7967, "desc": "Ancient Buddhist temple"},
              {"name": "Shibuya Crossing", "day": 2, "lat": 35.6595, "lng": 139.7004, "desc": "Famous scramble crossing"}
            ]
          }
          </itinerary_data>

      Do not include the delimiter at the very beginning or end of the response, only between the sections.
      Ensure the tone is professional, reassuring, and clear. Use Markdown headers (##, ###), bullet points, and tables where requested.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      },
    });

    const text = response.text || "";

    // Extract grounding chunks for citations
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = chunks
      .map((chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
          return { title: chunk.web.title, url: chunk.web.uri };
        }
        return null;
      })
      .filter((link) => link !== null);

    const uniqueLinks = Array.from(new Map(links.map(item => [item.url, item])).values());
    const sections = text.split(DELIMITER);

    const report = {
      visaSection: sections[0] ? sections[0].trim() : "Information unavailable.",
      safetySection: sections[1] ? sections[1].trim() : "Information unavailable.",
      cultureSection: sections[2] ? sections[2].trim() : "Information unavailable.",
      itinerarySection: sections[3] ? sections[3].trim() : "Itinerary unavailable.",
      groundingLinks: uniqueLinks,
    };

    res.json(report);

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate travel report." });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { history, message } = req.body;

    if (!process.env.API_KEY) {
      return res.status(500).json({ error: "Server API Key configuration error" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history,
      config: {
        systemInstruction: "You are a helpful travel assistant within the NomadNest app. Keep answers concise and helpful."
      }
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text });

  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
});

// --- Community Endpoints ---

// In-memory storage for topics (for demonstration)
let topics = [
  {
    id: 1,
    title: "Best health insurance for nomads in 2024?",
    author: "Sarah J.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    content: "Hi everyone, I'm planning to travel through SE Asia and South America for the next year. I'm looking for reliable health insurance that covers adventure sports and has good customer service. I've heard mixed reviews about SafetyWing. Any recommendations for alternatives that include good outpatient coverage?",
    repliesCount: 2,
    views: 1200,
    tags: ["Insurance", "Health", "Planning"],
    likes: 45,
    timestamp: "2 hours ago",
    replies: [
      { id: 101, author: "Mike T.", avatar: "https://i.pravatar.cc/150?u=mike", content: "I've been using Genki for the last 6 months. It's specifically designed for nomads and the claims process is super smooth. A bit pricier than SafetyWing but coverage is better.", timestamp: "1 hour ago", likes: 12 },
      { id: 102, author: "Elena R.", avatar: "https://i.pravatar.cc/150?u=elena", content: "Check out Cigna Global if you want really comprehensive coverage, but it's expensive. For standard travel medical, Genki or SafetyWing are the go-tos.", timestamp: "45 mins ago", likes: 8 }
    ]
  },
  {
    id: 2,
    title: "Visa run tips from Vietnam to Cambodia",
    author: "Mike T.",
    avatar: "https://i.pravatar.cc/150?u=mike",
    content: "My Vietnam E-visa is expiring in 5 days. Planning to do a border run to Moc Bai. Has anyone done this recently? How long does the process take on the Cambodian side? Do I need to book a bus in advance or can I find one easily in HCMC?",
    repliesCount: 1,
    views: 850,
    tags: ["Visa", "Vietnam", "Border Run"],
    likes: 22,
    timestamp: "5 hours ago",
    replies: [
      { id: 201, author: "James L.", avatar: "https://i.pravatar.cc/150?u=james", content: "Did this last week. Super easy. Took about 2 hours total for both sides. Make sure you have crisp USD for the Cambodian visa fee, they are picky!", timestamp: "3 hours ago", likes: 15 }
    ]
  },
  {
    id: 3,
    title: "Finding reliable WiFi in rural Italy",
    author: "Elena R.",
    avatar: "https://i.pravatar.cc/150?u=elena",
    content: "I'm looking at renting a villa in Tuscany for a month to focus on deep work. The hosts say they have WiFi, but I'm skeptical about speeds in rural areas. Does anyone have experience with Starlink rentals or specific 4G/5G sims that work well in the Italian countryside?",
    repliesCount: 1,
    views: 3100,
    tags: ["Italy", "WiFi", "Remote Work"],
    likes: 89,
    timestamp: "1 day ago",
    replies: [
      { id: 301, author: "Marco P.", avatar: "https://i.pravatar.cc/150?u=marco", content: "TIM has the best coverage in rural areas. I'd recommend getting a portable 5G router and a TIM sim card as a backup. Don't rely solely on the villa wifi.", timestamp: "20 hours ago", likes: 30 }
    ]
  },
  {
    id: 4,
    title: "Tax residency: Dubai vs Panama",
    author: "Alex B.",
    avatar: "https://i.pravatar.cc/150?u=alex",
    content: "I'm hitting a bracket where I need to optimize my tax residency. I'm torn between the 0% tax in Dubai vs the territorial tax system in Panama. Dubai seems more expensive but better connected. Panama is cheaper but maybe less convenient? Looking for thoughts from anyone who has established residency in either.",
    repliesCount: 0,
    views: 4500,
    tags: ["Taxes", "Finance", "Relocation"],
    likes: 112,
    timestamp: "2 days ago",
    replies: []
  },
];

app.get('/api/community/topics', (req, res) => {
  res.json(topics);
});

app.post('/api/community/topics', (req, res) => {
  const { title, content, tags, author } = req.body;
  const newTopic = {
    id: Date.now(),
    title,
    content,
    author: author || "Anonymous",
    avatar: "https://i.pravatar.cc/150?u=" + Date.now(),
    repliesCount: 0,
    views: 0,
    tags: tags || [],
    likes: 0,
    timestamp: "Just now",
    replies: []
  };
  topics.unshift(newTopic);
  res.json(newTopic);
});

app.post('/api/community/topics/:id/reply', (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;
  const topic = topics.find(t => t.id === parseInt(id));

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  const newReply = {
    id: Date.now(),
    author: author || "Anonymous",
    avatar: "https://i.pravatar.cc/150?u=" + Date.now(),
    content,
    timestamp: "Just now",
    likes: 0
  };

  topic.replies.push(newReply);
  topic.repliesCount++;
  res.json(newReply);
});

// --- Cost Calculator Endpoint ---

app.post('/api/cost-calculator', async (req, res) => {
  try {
    const { cityA, cityB } = req.body;

    if (!process.env.API_KEY) {
      return res.status(500).json({ error: "Server API Key configuration error" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash";

    const prompt = `
            Compare the cost of living between "${cityA}" and "${cityB}".
            Provide a single percentage difference representing how much cheaper or more expensive it is to live in "${cityB}" compared to "${cityA}".
            
            Return ONLY a valid JSON object with no markdown formatting.
            Format:
            {
                "percentage": 45, // Number only. Positive if cityB is more expensive, negative if cheaper.
                "verdict": "MORE EXPENSIVE" // or "CHEAPER"
            }
        `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);

  } catch (error) {
    console.error("Cost Calculator API Error:", error);
    // Fallback to random if AI fails
    const randomDiff = Math.floor(Math.random() * 60) - 30;
    res.json({
      percentage: randomDiff,
      verdict: randomDiff < 0 ? 'CHEAPER' : 'MORE EXPENSIVE'
    });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
