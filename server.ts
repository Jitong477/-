import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Helper to call OpenAI-compatible Proxy
async function callOpenAIApi(
  messages: Array<{ role: string; content: string }>,
  systemInstruction?: string,
  isJson: boolean = false
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "YOUR_KEY" || apiKey === "") {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const payloadMessages: Array<{ role: string; content: string }> = [];
  if (systemInstruction) {
    payloadMessages.push({ role: "system", content: systemInstruction });
  }
  payloadMessages.push(...messages);

  const requestBody: any = {
    model: "Jitong",
    messages: payloadMessages,
    temperature: 0.7
  };

  if (isJson) {
    requestBody.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.openai-next.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI proxy API failed: ${response.status} ${response.statusText} - ${errText}`);
  }

  const data: any = await response.json();
  const replyText = data.choices?.[0]?.message?.content || "";
  return replyText;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI IELTS Speaking Script Remix
  app.post("/api/remix", async (req, res) => {
    try {
      const { title, category, originalTranscript, keywords, targetBand = "8.0", userPractice } = req.body;
      
      const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "YOUR_KEY" && process.env.OPENAI_API_KEY !== "";
      if (!hasKey) {
        // Return structured, contextual mock fallback when OpenAI API key is not configured yet
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

      // We have a live OpenAI-compatible proxy configured! Prepare prompt context
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
    { "word": "High-scoring vocab word or idiom", "translation": "Chinese translation" }
  ],
  "template": "A beautifully drafted 3-4 sentence speaking model answer script that seamlessly integrates the target keywords naturally, providing a pristine Band ${targetBand}+ template answer.",
  "usage": [
    "IELTS Part applicability 1, e.g. Part 2: Describe a memorable journey",
    "IELTS Part applicability 2, e.g. Part 3: Urban planning and tourism"
  ],
  "aiFeedback": "If the user provided a userPractice draft, analyze their draft, critique their grammatical accuracy, lexical resource, pronunciation focus, and tell them exactly what changes would bump it to Band ${targetBand}+. Otherwise, write a highly encouraging greeting from the IELTS examiner with custom advice for mastering this video topic."
}

Do not wrap the JSON inside markdown code blocks (e.g. \`\`\`json). Return ONLY valid, JSON string.`;

      const responseText = await callOpenAIApi([{ role: "user", content: prompt }], undefined, true);

      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      cleanedResponse = cleanedResponse.trim();
      const parsed = JSON.parse(cleanedResponse);
      res.json({ ...parsed, isOfflineSimulated: false });
    } catch (e: any) {
      console.error("OpenAI Speak generation failure:", e);
      res.status(500).json({ error: e.message || "Failed to communicate with AI model" });
    }
  });

  // API Route: AI Tutor Q&A and Chat Conversation
  app.post("/api/chat", async (req, res) => {
    try {
      const { videoCtx, messages, text } = req.body;
      const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "YOUR_KEY" && process.env.OPENAI_API_KEY !== "";

      const systemIns = `You are a warm, highly encouraging, and professional IELTS Speaking Examiner and Senior Language Coach.
You are helping the user practice speaking based on their active IELTS video lesson: "${videoCtx.title}" (${videoCtx.category}).
Key vocabulary they just learned in this lesson:
${(videoCtx.keyVocab || []).map((v: any) => `- ${v.word}: ${v.translation}`).join('\n')}

Their transcript context: "${videoCtx.englishTranscript}"

Goal:
1. Help them practice their speaking.
2. If they ask how to translate something (e.g. "园林用英语怎么说" or "小桥流水怎么翻译"), give them highly idiomatic, elegant Band 8.0+ IELTS expressions instead of generic student English.
3. Keep the conversation interactive. Always ask an interesting follow-up question or suggest prompt options they can say next.
4. If they give an English sentence, praise their attempt, point out any grammar or lexical improvements, and offer a "Remixed version" (polished output).
5. Output response in clean Markdown. Keep your tone encouraging and professional! No clinical jargon; make it a friendly chat as if in a real tutoring session.`;

      if (!hasKey) {
        // Return highly contextual simulated mock answers for learning based on active video topic
        const lowerInput = text.toLowerCase();
        let reply = "";
        if (lowerInput.includes("园林") || lowerInput.includes("garden")) {
          reply = `**📚 苏州古典园林的高级雅思表达：**\n\n1. **Classical Gardens of Suzhou** (苏州古典园林)\n2. **Horticultural masterpiece** (园艺巅峰杰作 - 用来代替 very nice garden)\n3. **Labyrinthine pathways** (曲径通幽/迷宫般的园林路径)\n4. **A peaceful sanctuary** (心灵静谧的避风港 - 用来代替 quiet place)\n5. **Pristine whitewashed walls and dark-tiled roofs** (粉墙黛瓦/经典的白墙黛瓦)\n6. **Delicate stone bridges over bubbling streams** (小桥流水 - 溪水叮咚、精致石桥)\n\n**💡 提分金句示范：**\n> *"To me, the classical Chinese gardens in Suzhou are not just tourist attractions, but absolute **horticultural masterpieces**. Wandering among those **pristine whitewashed walls and dark-tiled roofs**, alongside **delicate stone bridges over bubbling streams**, offers an incredible **quiet sanctuary for spiritual replenishment**."*\n\n你可以把这句收藏进你的口语备考本！你还想知道关于园林的什么表达吗？你可以打字问我哦！*(提示：已开启离线模拟，配置 Settings > Secrets 中的 OPENAI_API_KEY 以体验无限实时 AI 对话！)*`;
        } else if (lowerInput.includes("焦虑") || lowerInput.includes("anxiety") || lowerInput.includes("董宇辉")) {
          reply = `**🧠 关于心理健康与焦虑的高阶口语词块：**\n\n1. **Inevitable by-product of ambition** (雄心壮志的必然产物 - 用来替代 bad feeling from work)\n2. **Discontent with status quo** (对现状不太满足/渴望进步)\n3. **Decompress frayed nerves** (放松极度紧绷焦虑的神经)\n\n**🎤 口语示范：**\n> *"Anxiety is often an inevitable by-product of our ambitions, especially when we are discontent with the status quo and driven to make rapid progress."*\n\n你可以试着输入：“这些词怎么用在 Part 3 现代人压力大 话题中？”或者继续向我提问表达法！`;
        } else if (lowerInput.includes("多元") || lowerInput.includes("trajectories") || lowerInput.includes("大冰") || lowerInput.includes("职业") || lowerInput.includes("生命") || lowerInput.includes("精彩") || lowerInput.includes("平凡")) {
          reply = `**🌟 多元职业与人生选择的主流口语大招：**\n\n1. **Diverse life trajectories** (多样化的人生轨迹)\n2. **Sovereignty of self-determination** (命运/自我决断的自主权)\n3. **Shatter conventional stereotypes of success** (击碎传统的单一成功定义)\n\n**🎤 原创高分模版：**\n> *"Exploring diverse life trajectories allows the younger generation to shatter conventional stereotypes of success and exert their sovereignty of self-determination."*\n\n你可以问我：**“‘下班生活很丰富’用英语怎么高级描写？”** 或者直接打字发给我！`;
        } else if (lowerInput.includes("姥姥") || lowerInput.includes("烹饪") || lowerInput.includes("做饭") || lowerInput.includes("grandma") || lowerInput.includes("cooking") || lowerInput.includes("爱") || lowerInput.includes("长辈")) {
          reply = `**👩‍🍳 描写姥姥与隔代疼爱的高分词汇：**\n\n1. **Culinary talents** (精湛的妙手厨艺)\n2. **Meticulous recipes** (精心慢制的私房菜谱)\n3. **Unconditional affection** (毫无保留的爱意与溺爱)\n4. **Intergenerational bonding** (隔代亲密的情感联结)\n\n**✨ 雅思 Part 2 绝佳导入：**\n> *"If I were to talk about an exceptional cook in my family, it would definitely be my grandma. She possesses incredible culinary talents and always prepares meticulous recipes daily with unconditional affection."*\n\n你可以随便发一句你写的英文，比如 *"My grandma cook is very good"*，我会立刻帮你 Remix 雕琢提升为雅思 8.0+ 精致段落！`;
        } else {
          reply = `哈罗！你发送的：*"${text}"* 我收到啦！\n\n这是一个很棒的切入点。在当前关联的雅思【${videoCtx.title}】里，我们重点推荐学透这几个核心词块：\n${(videoCtx.keyVocab || []).map((v: any) => `* **${v.word}** (${v.translation})`).join('\n')}\n\n你可以试着这样问我：**“${videoCtx.category === 'Culture' ? '‘园林景观’高分英文怎么高级描写？' : '请帮我把: She cooked food, I became fat 润色并提升的分数吧！'}”**，看我如何一秒帮你重塑提分！*(小贴士：配置 API Key 后这里将升级为由 Jitong 实时交互的智能雅思私教哦！)*`;
        }

        return res.json({ reply });
      }

      // Convert conversation history messages to OpenAI expected content objects
      const contents: Array<{ role: string; content: string }> = [];
      
      // Filter out leading model/ai messages to ensure the chat always starts with a user turn
      const chatTurns = messages.filter((msg: any, idx: number) => {
        if (idx === 0 && msg.sender !== 'user') return false; // Skip the initial localized AI greeting
        return true;
      });

      // Map chat messages to OpenAI content objects
      chatTurns.forEach((msg: any) => {
        const role = msg.sender === 'user' ? 'user' : 'assistant';
        
        // If the last added message has the same role, combine them to keep strictly alternating turns
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].content += "\n" + msg.text;
        } else {
          contents.push({
            role: role,
            content: msg.text
          });
        }
      });

      const reply = await callOpenAIApi(contents, systemIns, false);
      res.json({ reply });
    } catch (err: any) {
      console.error("Chat generation failed:", err);
      res.status(500).json({ error: err.message || "Failed to generate chat response" });
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
