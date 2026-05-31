import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// ==================== 🛠️ 智能诊断中枢 API 参数直连配置区 ====================
// 如果您不想使用 Secrets 环境变量，可以在下方直接将变量替换为您的真实秘钥参数。
// 这样在 AI Studio 的预览容器中直接修改该文件，系统就会实时载入并生效！
const CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY_HERE", // 请在这里填入您的 API 密钥，例如 "sk-xxx"
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "https://api.openai-next.com/v1", // 这里写您的 Cloudflare 代理网关地址
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4" // 您调用的核心大语言模型
};
// =========================================================================

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = CONFIG.OPENAI_API_KEY;
    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY_HERE") {
      return null;
    }
    openaiClient = new OpenAI({
      apiKey: apiKey,
      baseURL: CONFIG.OPENAI_BASE_URL,
    });
  }
  return openaiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI IELTS Speaking Script Remix (Offline Simulation with Online fallback)
  app.post("/api/remix", async (req, res) => {
    try {
      const { title, category, originalTranscript, keywords, targetBand = "8.0", userPractice } = req.body;
      
      const defaultVocab = keywords && keywords.length > 0 
        ? keywords.map((k: any) => ({
            word: k.word || k,
            translation: k.translation || "学术核心词"
          }))
        : [
            { word: "Immersive learning environment", translation: "沉浸式学习环境" },
            { word: "Linguistic dexterity", translation: "语言灵巧度/纯熟度" },
            { word: "Cultural heritage protection", translation: "文化遗产保护" }
          ];

      const client = getOpenAIClient();
      if (client) {
        try {
          const model = CONFIG.OPENAI_MODEL;
          const systemPrompt = `You are an expert IELTS Examiner and Academic Trainer. Take a piece of spoken baseline transcript (which might have weak grammar, basic lexicon, or simple phrasing), and reconstruct or 'Remix' it into a highly polished, band ${targetBand} model speaking sample.

Provide responses in strict JSON format. IMPORTANT: Only output a valid JSON object. Do not include markdown formatting or backticks around the JSON. Match the following schema exactly:
{
  "band": "${targetBand}",
  "vocabulary": [
    { "word": "advanced phrase", "translation": "Chinese translation of the phrase" }
  ],
  "template": "Speaking paragraphs at Band ${targetBand} level. Highly academic but natural flow",
  "usage": [
    "Recommended IELTS Topic Part 2 or 3 item"
  ],
  "aiFeedback": "Expert evaluation feedback (in Chinese) criticizing the original, comparing the improvements, and recommending practical pronunciation/logic-device tips for this speech."
}`;

          const userPrompt = `Video Topic: ${title}
Category: ${category}
Requested core vocab blocks: ${JSON.stringify(defaultVocab)}
Original transcript / User practice speech: ${userPractice || originalTranscript}
Target Band: ${targetBand}`;

          const completion = await client.chat.completions.create({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7
          });

          const rawText = completion.choices[0]?.message?.content?.trim() || "{}";
          const cleanText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
          const parsed = JSON.parse(cleanText);

          return res.json({
            band: parsed.band || targetBand,
            vocabulary: parsed.vocabulary || defaultVocab,
            template: parsed.template || "",
            usage: parsed.usage || [`Part 2/3: Talk about topics related to ${title}`],
            aiFeedback: parsed.aiFeedback || "智能重构已完成！",
            isRealAI: true
          });
        } catch (apiErr: any) {
          console.error("OpenAI Remix API call failed, falling back to simulated engine:", apiErr);
        }
      }

      // Custom simulated IELTS template based on categories and custom userPractice
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

      const userFeedback = userPractice 
        ? `【口语对练评估】\n目标分数：Band ${targetBand}\n当前评估：Band ${Math.min(parseFloat(targetBand), 6.5)}\n指导意见：您的发音清晰度不错，也能尝试运用亮点词块。建议增加像 "${defaultVocab[0]?.word || "immersive"}" 这类更具智识深度的词表达，并使用因果逻辑连词（如 consequently, thus）来加强流利度。` 
        : `欢迎使用 IELTS Layer 口语重构。点击“雅思智能模塑”以查看最符合 Band ${targetBand} 要求的重构范本，结合推荐词汇及段落进行诵读跟练！`;

      res.json({
        band: targetBand,
        vocabulary: defaultVocab,
        template: simulatedTemplate,
        usage: simulatedTips,
        aiFeedback: userFeedback,
        isOfflineSimulated: true
      });
    } catch (e: any) {
      console.error("Speak generation failure:", e);
      res.status(500).json({ error: e.message || "Failed to generate materials" });
    }
  });

  // API Route: AI Tutor Q&A and Chat Conversation (Offline Q&A Assist with Online fallback)
  app.post("/api/chat", async (req, res) => {
    try {
      const { videoCtx, messages, text } = req.body;
      const lowerInput = (text || "").toLowerCase();

      const client = getOpenAIClient();
      if (client) {
        try {
          const model = CONFIG.OPENAI_MODEL;
          
          // Format previous chat messages for real-time memory
          const apiMessages = (messages || []).map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }));

          // Ensure the current user question is in active messages if logs were empty
          if (apiMessages.length === 0 && text) {
            apiMessages.push({ role: 'user', content: text });
          }

          const systemMessage = {
            role: "system",
            content: `You are an expert IELTS 1v1 Speaking and Writing Tutor.
Currently studying Video Lesson: "${videoCtx?.title || "IELTS Lesson"}" (Category: ${videoCtx?.category || "General"}, Recommended Theme keywords: ${JSON.stringify(videoCtx?.keyVocab || [])}).

Guidelines:
1. Always reply in Chinese, except when presenting English words, phrases, idioms, and full native-speaker sample speaking responses.
2. Provide direct, supportive, and extremely clean replies.
3. If the user asks for a translation, phrase upgrade, or grammar correction:
   - Provide a highly encouraging analysis.
   - Show a clear, side-by-side comparison between:
     - ❌ Baseline (普通普通表达/原句)
     - ✨ IELTS Upgrade (雅思提分表达, standard Band 7.5+ or 8.5)
   - Explain 2-3 precise vocabulary/collocations used in the upgraded version in bullet points.
4. Keep the output neat, elegant, and readable using clean markdown.`
          };

          const completion = await client.chat.completions.create({
            model: model,
            messages: [systemMessage, ...apiMessages],
            temperature: 0.7
          });

          const replyMessage = completion.choices[0]?.message?.content || "抱歉，由于模型未能返回数据，未能处理您的请求。";
          return res.json({ reply: replyMessage, isRealAI: true });
        } catch (apiErr: any) {
          console.error("OpenAI Chat API call failed, falling back to simulated engine:", apiErr);
        }
      }

      let reply = "";

      if (lowerInput.includes("园林") || lowerInput.includes("garden")) {
        reply = `**📚 苏州古典园林的高级雅思表达：**\n\n1. **Classical Gardens of Suzhou** (苏州古典园林)\n2. **Horticultural masterpiece** (园艺巅峰杰作 - 用来代替 very nice garden)\n3. **Labyrinthine pathways** (曲径通幽/迷宫般的园林路径)\n4. **A peaceful sanctuary** (心灵静谧的避风港 - 用来替代 quiet place)\n5. **Pristine whitewashed walls and dark-tiled roofs** (粉墙黛瓦/经典的白墙黛瓦)\n6. **Delicate stone bridges over bubbling streams** (小桥流水 - 溪水叮咚、精致石桥)\n\n**💡 提分金句示范：**\n> *"To me, the classical Chinese gardens in Suzhou are not just tourist attractions, but absolute **horticultural masterpieces**. Wandering among those **pristine whitewashed walls and dark-tiled roofs**, alongside **delicate stone bridges over bubbling streams**, offers an incredible **quiet sanctuary for spiritual replenishment**."*\n\n你可以把这句收藏进你的口语备考本！你可以继续向我打字输入有关英语翻译或表达的困惑，我会即刻帮您雅思重构升阶！`;
      } else if (lowerInput.includes("焦虑") || lowerInput.includes("anxiety") || lowerInput.includes("董宇辉")) {
        reply = `**🧠 关于心理健康与焦虑的高阶口语词块：**\n\n1. **Inevitable by-product of ambition** (雄心壮志的必然产物 - 用来替代 bad feeling from work)\n2. **Discontent with status quo** (对现状不太满足/渴望进步)\n3. **Decompress frayed nerves** (放松极度紧绷焦虑的神经)\n\n**🎤 口语示范：**\n> *"Anxiety is often an inevitable by-product of our ambitions, especially when we are discontent with the status quo and driven to make rapid progress."*\n\n你可以试着输入有关其他雅思Part3常考的心理，健康或生活压力话题！`;
      } else if (lowerInput.includes("多元") || lowerInput.includes("trajectories") || lowerInput.includes("大冰") || lowerInput.includes("职业") || lowerInput.includes("生命") || lowerInput.includes("精彩") || lowerInput.includes("平凡")) {
        reply = `**🌟 多元职业与人生选择的主流口语大招：**\n\n1. **Diverse life trajectories** (多样化的人生轨迹)\n2. **Sovereignty of self-determination** (命运/自我决断的自主权)\n3. **Shatter conventional stereotypes of success** (击碎传统的单一成功定义)\n\n**🎤 原创高分模版：**\n> *"Exploring diverse life trajectories allows the younger generation to shatter conventional stereotypes of success and exert their sovereignty of self-determination."*\n\n这些智识语料非常适合用在 Part 3 陈述中，欢迎在口语包中归档跟练！`;
      } else if (lowerInput.includes("姥姥") || lowerInput.includes("烹饪") || lowerInput.includes("做饭") || lowerInput.includes("grandma") || lowerInput.includes("cooking") || lowerInput.includes("爱") || lowerInput.includes("长辈")) {
        reply = `**👩‍🍳 描写姥姥与隔代疼爱的高分词汇：**\n\n1. **Culinary talents** (精湛的妙手厨艺)\n2. **Meticulous recipes** (精心慢制的私房菜谱)\n3. **Unconditional affection** (毫无保留的爱意与溺爱)\n4. **Intergenerational bonding** (隔代亲密的情感联结)\n\n**✨ 雅思 Part 2 绝佳导入：**\n> *"If I were to talk about an exceptional cook in my family, it would definitely be my grandma. She possesses incredible culinary talents and always prepares meticulous recipes daily with unconditional affection."*\n\n这些词和句式能够立刻让你的叙事充满色彩与学术连贯性。`;
      } else {
        reply = `你好！关于视频 **【${videoCtx?.title || "课堂主题"}】**，为了帮助你获得最佳备考提升，当前课件推荐了这些核心亮点高分表达：\n${((videoCtx?.keyVocab) || []).map((v: any) => `* **${v.word}** (${v.translation})`).join('\n')}\n\n你可以试着输入一些雅思生词来测试如何升级发音与场景拓展，或者打入一些句子，我来帮你一键重构润色！`;
      }

      res.json({ reply });
    } catch (err: any) {
      console.error("Chat failure:", err);
      res.status(500).json({ error: err.message || "Failed to process chat" });
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
