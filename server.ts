import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dynamic Lazy Initialization for Gemini Client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient) {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
        aiClient = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }
    }
    return aiClient;
  }

  // API Route: AI IELTS Speaking Script Remix
  app.post("/api/remix", async (req, res) => {
    try {
      const { title, category, originalTranscript, keywords, targetBand = "8.0", userPractice } = req.body;
      
      const ai = getGeminiClient();
      if (!ai) {
        // Return structured, contextual mock fallback when Gemini API key is not configured yet
        const defaultVocab = keywords && keywords.length > 0 
          ? keywords.map((k: any) => ({
              word: k.word || k,
              translation: k.translation || "学术核心词",
              pinyin: k.pinyin || "xué shù hé xīn cí"
            }))
          : [
              { word: "Immersive learning environment", translation: "沉浸式学习环境", pinyin: "chén jìn shì xué xí huán jìng" },
              { word: "Linguistic dexterity", translation: "语言灵巧度/纯熟度", pinyin: "yǔ yán líng qiǎo dù" },
              { word: "Cultural heritage protection", translation: "文化遗产保护", pinyin: "wén huà yí chǎn bǎo hù" }
            ];

        // Custom simulated IELTS template based on categories
        let simulatedTemplate = "";
        let simulatedTips = [];
        if (category === "Culture" || title.toLowerCase().includes("china") || title.toLowerCase().includes("garden")) {
          simulatedTemplate = `Honestly, establishing an immersive learning environment within historic landscapes like traditional gardens naturally fosters linguistic dexterity. Understanding local communities enables deep cultural heritage protection.`;
          simulatedTips = [
            "Part 2: Describe a historic location or quiet place",
            "Part 3: Traditional architecture preservation as an investment"
          ];
        } else if (category === "Tech") {
          simulatedTemplate = `Regarding technology, automated structures outline virtual environments requiring strong human vigilance. Thus, resolving algorithmic bias is essential to secure mutual trust and digital accountability.`;
          simulatedTips = [
            "Part 3: Social consequences of artificial automation",
            "Part 3: Technology and long-term industrial shifts"
          ];
        } else {
          simulatedTemplate = `To achieve conversational agility, practicing in high-fidelity environments is completely paramount. Consistently applying advanced vocabulary transforms passive knowledge into native fluency.`;
          simulatedTips = [
            "Part 1: Your daily habits and study routines",
            "Part 2: A challenging skill you recently master"
          ];
        }

        return res.json({
          band: targetBand,
          vocabulary: defaultVocab,
          template: simulatedTemplate,
          usage: simulatedTips,
          aiFeedback: userPractice 
            ? `Your response matches IELTS Band ${targetBand}. You used ${keywords ? keywords.length : 0} keywords successfully. Good pronunciation and lexical diversity!` 
            : null,
          isOfflineSimulated: true
        });
      }

      // We have a live Gemini client! Prepare prompt context
      const prompt = `You are a professional IELTS Speaking Examiner and Senior Language Coach.
The user is studying a topic: "${title}" (Category: "${category}").
Original transcript / key theme of video file/lesson:
"${originalTranscript}"

User inputs target speaking parameters:
- Target Band: ${targetBand}
- Keywords to include or reinforce: ${JSON.stringify(keywords || [])}
${userPractice ? `- User's actual practical practice draft script: "${userPractice}"` : ''}

Generate IELTS speaking preparation materials matching Band ${targetBand}.
Provide the response in raw JSON format matching this schema:
{
  "band": "The target band score, e.g. ${targetBand}",
  "vocabulary": [
    { "word": "High-scoring vocab word or idiom", "pinyin": "Simplified Chinese pinyin", "translation": "Chinese translation" }
  ],
  "template": "A beautifully drafted 3-4 sentence speaking model answer script that seamlessly integrates the target keywords naturally, providing a pristine Band ${targetBand}+ template answer.",
  "usage": [
    "IELTS Part applicability 1, e.g. Part 2: Describe a memorable journey",
    "IELTS Part applicability 2, e.g. Part 3: Urban planning and tourism"
  ],
  "aiFeedback": "If the user provided a userPractice draft, analyze their draft, critique their grammatical accuracy, lexical resource, pronunciation focus, and tell them exactly what changes would bump it to Band ${targetBand}+. Otherwise, write a highly encouraging greeting from the IELTS examiner with custom advice for mastering this video topic."
}

Do not wrap the JSON inside markdown code blocks (e.g. \`\`\`json). Return ONLY valid, parsed JSON string.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });

      const responseText = response.text || "{}";
      const cleanedResponse = responseText.trim();
      const parsed = JSON.parse(cleanedResponse);
      res.json({ ...parsed, isOfflineSimulated: false });
    } catch (e: any) {
      console.error("Gemini speaking generation failure:", e);
      res.status(500).json({ error: e.message || "Failed to communicate with AI model" });
    }
  });

  // Serve static UI assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IELTS Layer full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
