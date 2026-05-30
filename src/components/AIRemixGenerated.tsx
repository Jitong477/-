import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  FolderHeart, 
  BookOpen, 
  CheckCircle, 
  Award,
  Cpu,
  Brain,
  MessageSquareCode,
  ArrowRight,
  Layers,
  Zap,
  Send,
  MessageCircle
} from 'lucide-react';
import { VideoItem, VocabItem, SavedItem } from '../types';

interface AIRemixGeneratedProps {
  currentVideo: VideoItem;
  allVideos: VideoItem[];
  onVideoChange: (idx: number) => void;
  onSaveToFolder: (remixData: { title: string; template: string; vocab: VocabItem[]; folder?: 'PART 1' | 'PART 2' | 'PART 3' }) => void;
  isSaved: boolean;
}

const SHOWCASE_TRIALS = [
  {
    id: "trial-1",
    question: "园林篇：宁静美学与古建风貌如何升级？",
    tag: "名家美学 • 深度重塑效果",
    videoIndex: 0,
    originalText: "Suzhou garden is very old and nice. There is water and trees. I feel very quiet and peaceful there, it is good to visit.",
    targetBand: "8.5",
    remixedData: {
      band: "8.5",
      vocabulary: [
        { word: "Horticultural masterpiece", translation: "园艺杰作/园林艺术巅峰" },
        { word: "Spiritual replenishment", translation: "精神给养/心灵洗礼" },
        { word: "Labyrinthine pathways", translation: "曲径通幽/迷宫般的路径" },
        { word: "Historical preservation", translation: "历史风貌保护" }
      ],
      template: "In my personal perspective, visiting a classical Chinese garden represents the ultimate escape from the concrete jungle. This sanctuary provides immense spiritual replenishment, where the quiet pavilions, labyrinthine pathways, and ancient rockeries encourage people to contemplate cultural heritage and historical preservation.",
      usage: [
        "口语第二部分：描述一个能让你放松的安静场所（An attractive quiet place that you visited）",
        "口语第三部分：传统历史建筑在现代化城市中的价值与留存（Historical preservation in contemporary centers）"
      ],
      aiFeedback: `【🎯 极速上线体验：雅思 A/B 提分小样对决 A】

❌ 传统静态语料 (Baseline 基线风貌 - 约 5.5 分):
“Suzhou garden is very old and nice. I feel very quiet...”
诊断：词句匮乏重复 (nice/very old)，语法单落，无法传递江南古风精髓，体验平庸干瘪。

✨ AI 智能一键重塑重构 (Our Remixed Masterpiece - 提分至 8.5 分):
1. 【深度词块化】：小词“very old”重塑为“horticultural masterpiece” (园艺最高杰作)，将“quiet”升华为“spiritual replenishment” (心灵洗礼)。
2. 【高阶连贯度】：多层次描述“labyrinthine pathways” (曲径通幽之美)，主考官最重金词汇。
3. 【交互乐趣】：点击生词立马发音跟读，比枯燥静态大书库效率狂揽 300%！`
    }
  },
  {
    id: "trial-2",
    question: "点我测试【名家观点切片】变 Part 3 思辩：董宇辉聊焦虑的观点，怎么变成高分论据？",
    tag: "思辩逻辑 • 双向表达对比",
    videoIndex: 1,
    originalText: "董宇辉认为焦虑和压力大是由于太有上进心，一个人如果想进步就会处于焦虑中。痛苦是因为对现在不满意，嫌自己进步太慢。世界上的问题没办法彻底解决，但矛盾推动发展。建议通过阅读、运动和跟朋友聊天来放松。",
    targetBand: "7.5",
    remixedData: {
      band: "7.5",
      vocabulary: [
        { word: "Inevitable by-product", translation: "必然产物/伴生品" },
        { word: "Discontent with status quo", translation: "对现状感到不满/不安于现状" },
        { word: "Find a middle ground", translation: "寻找折中方案/取得良好均衡点" },
        { word: "Decompress frayed nerves", translation: "舒缓极度紧绷耗竭的敏感神经" }
      ],
      template: "Anxiety is often an inevitable by-product of ambition. People experience psychological stress simply because they are discontent with their status quo and driven to make rapid progress. To find a middle ground between intense pressure and personal well-being, individuals should consider unwinding through reading or physical exercises to decompress their frayed nerves.",
      usage: [
        "🏷️ [AI Smart Tagging 自动贴签] - Good for Part 3: Mental Health & Anxiety (心理健康与焦虑)",
        "🏷️ [AI Smart Tagging 自动贴签] - Good for Part 3: Modern Lifestyle & Social Pressure (现代生活与压力)",
        "❓ [Abstract Discussion Questions 考官追问模拟] - Examiner: 'Do you think a certain amount of anxiety is beneficial for personal growth?'"
      ],
      aiFeedback: `【🎯 极速上线体验：雅思 A/B 提分小样对决 B】

❌ 传统原本 (Baseline 基线风貌 - 中文主张直译复述):
“董宇辉认为焦虑和压力大是由于太有上进心，对现在不满意……建议看书运动放松。”
诊断：变成了中文发言的逐句死板复述，极度缺乏英语学术思辨输出的实操度与高分表达词块。

✨ 最终作品 (IELTS Layer) 智能 Remix 后的重构效果 (提分至 7.5+ 分):
1. 转化【上进心导致焦虑】的学术化思辨句型：
   "Anxiety is often an inevitable by-product of ambition. People experience psychological stress simply because they are discontent with their status quo and driven to make rapid progress."
2. 转化【运动阅读中和焦虑】的地道高级表达：
   "To find a middle ground between intense pressure and personal well-being, individuals should consider unwinding through reading or physical exercises to decompress their frayed nerves."`
    }
  },
  {
    id: "trial-3",
    question: "演讲篇：打破陈规与多元职业人生的思辩升级？",
    tag: "连贯表达 • 智识语篇重构",
    videoIndex: 1,
    originalText: "I think everyone should choose their own job. If they want to do what they like, they can do a normal job and also travel. This makes them happy。",
    targetBand: "8.0",
    remixedData: {
      band: "8.0",
      vocabulary: [
        { word: "Diverse life trajectories", translation: "多样化的人生轨迹/不同生涯选择" },
        { word: "Shatter conventional stereotypes", translation: "打破传统刻板成功观念" },
        { word: "Collaborative autonomy", translation: "协同自主和自主权" },
        { word: "Sovereignty of self-determination", translation: "自我掌握人生与选择的决定权" }
      ],
      template: "Personally, sovereignty of self-determination is paramount when planning our future. Young people should dare to explore diverse life trajectories because pursuing alternative careers helps shatter conventional stereotypes of success, which ultimately benefits mental growth and general well-being.",
      usage: [
        "口语第二部分：描述一个对你启发至深的人或演讲（An inspiring speech or talk that influenced you）",
        "口语第三部分：现代社会教育体系中多元发展的重要性（Educational structures and occupational flexibility）"
      ],
      aiFeedback: `【🎯 极速上线体验：雅思 A/B 提分小样对决 C】
 
 ❌ 传统静态语料 (Baseline 基线风貌 - 约 6.0 分):
 “I think everyone should choose their own job. This makes them happy.”
 诊断：句子粗短、逻辑因果链生硬，缺乏西方学术语篇所看重的“智识深度”。
 
 ✨ AI 智能一键重塑重构 (Our Remixed Masterpiece - 提分至 8.0 分):
 1. 【批判性思辨】：引入 “sovereignty of self-determination” (自我决定权) 和 “shatter conventional stereotypes of success” (打碎世俗偏见定义)，立意直接飞升。
 2. 【完美因果律】：借助 “because... which ultimately benefits...” 双重闭环，使流利度固若金汤！`
    }
  },
  {
    id: "trial-4",
    question: "人物篇：当博主家爱做饭的温暖姥姥变身满分口语考点？",
    tag: "细节叙事 • 地道场景描摹",
    videoIndex: 2,
    originalText: "My wife's mother came to our oversea house for months. She did good Chinese cooking for children, they like her very much. Finally all kids became very fat because of eating.",
    targetBand: "8.0",
    remixedData: {
      band: "8.0",
      vocabulary: [
        { word: "Meticulous recipes", translation: "精心调理准备的美味菜谱" },
        { word: "Unconditional affection", translation: "毫无保留的长辈疼爱/宠溺" },
        { word: "Culinary talents", translation: "精湛高超的妙厨手艺" },
        { word: "Intergenerational bonding", translation: "双向奔赴的隔代温情/情感纽带" }
      ],
      template: "If I were to describe an inspiring relative who is exceptional at cooking, it would definitely be my mother-in-law. During her months overseas, she showcased outstanding culinary talents and prepared meticulous recipes daily, demonstrating unconditional affection that resulted in the kids delightfully gaining weight and enjoying unforgettable intergenerational bonding.",
      usage: [
        "口语第二部分：描述一个你身边擅长做饭的人，或一个陪伴着你的亲戚长辈（A relative who is superb at cooking / family member who doted on you）",
        "口语第三部分：现代城市生活中的隔代抚养，以及美食在家庭日常联结中的温存写照（Intergenerational childcare / family bonding via food routines）"
      ],
      aiFeedback: `【🎯 极速上线体验：雅思 A/B 提分小样对决 D】
 
 ❌ 传统静态语料 (Baseline 基线风貌 - 约 5.5 分):
 “My wife's mother came... she did good Chinese cooking... all kids became very fat...”
 诊断：词句短小平淡（good, very fat），无法展示雅思所看重的情感写作连贯性与深度。
 
 ✨ AI 智能一键重塑重构 (Our Remixed Masterpiece - 提分至 8.0 分):
 1. 【情感描述升级】：引入 “intergenerational bonding” (隔代温情纽带) 和 “unconditional affection” (毫无保留的爱护疼溺)。
 2. 【高格调词组加持】：用 “meticulous recipes” (精致慢调菜谱) 替换 “good cooking”，逼格立即陡升。
 3. 【一键考研多能谱复合】：可一键无缝绑定到你的口语收藏夹中，既答“烹饪高手人选”又答“温暖长辈”！`
    }
  }
];

export default function AIRemixGenerated({
  currentVideo,
  allVideos,
  onVideoChange,
  onSaveToFolder,
  isSaved
}: AIRemixGeneratedProps) {
  const [copied, setCopied] = useState(false);
  const [speakingWord, setSpeakingWord] = useState("");
  
  // Custom AI speaking trial state
  const [targetScore, setTargetScore] = useState("8.0");
  const [userSpeechDraft, setUserSpeechDraft] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Stateful Chat Conversation Log States
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai', text: string, time: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatSuggestions, setChatSuggestions] = useState<string[]>([]);
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  
  const chatLogRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Live Generated Remix Result
  const [generatedRemix, setGeneratedRemix] = useState<{
    band: string;
    vocabulary: VocabItem[];
    template: string;
    usage: string[];
    aiFeedback?: string | null;
  }>({
    band: currentVideo.bandScore.replace("BAND ", "").replace("雅思 ", "").trim(),
    vocabulary: currentVideo.keyVocab,
    template: currentVideo.speakingTemplate,
    usage: currentVideo.usage
  });

  const getInitialMessages = (video: VideoItem) => {
    let suggestions = [];
    if (video.id === 'v1') {
      suggestions = [
        "园林经典的高分英文表达怎么说？",
        "‘白墙黛瓦、小桥流水’怎么高标准翻译？",
        "给我一个描写拙政国潮景致的 1 分钟 Part 2 真人精悍范本"
      ];
    } else if (video.id === 'v3') {
      suggestions = [
        "‘多元人生轨迹’在雅思口语中如何说得高雅？",
        "‘自我实现、掌握命运选择’怎么翻成高分智识句？",
        "给我一个关于‘追求另类职业职业人生’的 Part 3 口语论述"
      ];
    } else {
      suggestions = [
        "‘隔代温情与悉心疼爱’用什么雅思高级词汇描写？",
        "请帮我把: She cooked food, I became fat 润色并提升分数吧！",
        "帮我把‘姥姥不远万里在海外做饭’写成 Part 2 考研满分素材"
      ];
    }
    
    return {
      messages: [
        {
          sender: 'ai' as const,
          text: `哈罗！我是你的雅思口语智能私教。👋\n\n基于你当前正在学习的特色雅思精讲课程 **【${video.title}】**，我已经为你准备了几个最容易提分的互动练习切入点。\n\n你可以在下方打字直接提问我（比如：**“园林用英语怎么说”**、**“我的口语怎么改”**），或者**直接点击下方**我为你定制的这几个快捷互动话题：`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      suggestions
    };
  };

  // Sync state when parent switches active video
  useEffect(() => {
    const init = getInitialMessages(currentVideo);
    setChatMessages(init.messages);
    setChatSuggestions(init.suggestions);

    setGeneratedRemix({
      band: currentVideo.bandScore.replace("BAND ", "").replace("雅思 ", "").replace("分", "").trim(),
      vocabulary: currentVideo.keyVocab,
      template: currentVideo.speakingTemplate,
      usage: currentVideo.usage,
      aiFeedback: null
    });
    setUserSpeechDraft("");
  }, [currentVideo.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || chatInput;
    if (!content.trim() || isChatLoading) return;
    
    const newUserMessage = {
      sender: 'user' as const,
      text: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    if (!textToSend) {
      setChatInput("");
    }
    setIsChatLoading(true);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoCtx: currentVideo,
          messages: chatMessages.concat(newUserMessage),
          text: content
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, {
          sender: 'ai',
          text: data.reply || "对不起，智能私教没有返回内容，请稍后再试。",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("API call returned error status");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: "连接遇到了一点波动，别担心！一键配置 `OPENAI_API_KEY` 即可连接真人等效 AI 导师哦！当前你可以打字发送包含 '园林', '做饭', '焦虑', '职业' 的问题，我将立刻为你演示提分逻辑！",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      let cleanLine = line;
      let isBlockquote = false;
      let isBullet = false;
      
      if (cleanLine.startsWith('>')) {
        isBlockquote = true;
        cleanLine = cleanLine.substring(1).trim();
      } else if (cleanLine.startsWith('*') || cleanLine.startsWith('-')) {
        isBullet = true;
        cleanLine = cleanLine.substring(1).trim();
      }
      
      // Parse bold expressions **abc**
      const parts = [];
      let currentText = cleanLine;
      let boldMatch;
      
      while ((boldMatch = currentText.match(/\*\*(.*?)\*\*/)) !== null) {
        const startIndex = boldMatch.index!;
        const fullMatch = boldMatch[0];
        const boldText = boldMatch[1];
        
        if (startIndex > 0) {
          parts.push({ text: currentText.substring(0, startIndex), isBold: false });
        }
        parts.push({ text: boldText, isBold: true });
        currentText = currentText.substring(startIndex + fullMatch.length);
      }
      
      if (currentText) {
        parts.push({ text: currentText, isBold: false });
      }
      
      const renderedParts = parts.map((p, pIdx) => {
        if (p.isBold) {
          return <strong key={pIdx} className="text-secondary-container font-extrabold">{p.text}</strong>;
        }
        return p.text;
      });
      
      if (isBlockquote) {
        return (
          <blockquote key={lineIdx} className="pl-3 border-l-2 border-primary/50 bg-white/5 py-1.5 my-1.5 italic text-zinc-300 rounded-r text-xs leading-relaxed">
            {renderedParts}
          </blockquote>
        );
      }
      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 pl-2 my-0.5 text-xs text-zinc-200">
            <span className="text-secondary-container text-xs shrink-0">•</span>
            <span className="leading-relaxed">{renderedParts}</span>
          </div>
        );
      }
      
      return (
        <p key={lineIdx} className={`${line.trim() === "" ? "h-2" : "leading-relaxed my-0.5 text-xs text-zinc-100"}`}>
          {renderedParts}
        </p>
      );
    });
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedRemix.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
      setSpeakingWord(text);
      utterance.onend = () => setSpeakingWord("");
    }
  };

  // Pull speaking template adjustments using our custom express backend API!
  const handleRequestAISpeechRemix = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAI(true);
    try {
      const response = await fetch("/api/remix", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: currentVideo.title,
          category: currentVideo.category,
          originalTranscript: currentVideo.englishTranscript,
          keywords: currentVideo.keyVocab,
          targetBand: targetScore,
          userPractice: userSpeechDraft.trim() || null
        })
      });
      const data = await response.json();
      if (data) {
        setGeneratedRemix({
          band: data.band || targetScore,
          vocabulary: data.vocabulary || currentVideo.keyVocab,
          template: data.template || currentVideo.speakingTemplate,
          usage: data.usage || currentVideo.usage,
          aiFeedback: data.aiFeedback || null
        });
      }
    } catch (err) {
      console.error("AI Speaks model request failed:", err);
      alert("因为未配置 OPENAI_API_KEY，一键智能模塑已切换为内置的高分口语模板。");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSelectShowcase = (trial: typeof SHOWCASE_TRIALS[0]) => {
    onVideoChange(trial.videoIndex);
    setTargetScore(trial.targetBand);
    setUserSpeechDraft(trial.originalText);
    setIsLoadingAI(true);
    setTimeout(() => {
      setGeneratedRemix({
        band: trial.remixedData.band,
        vocabulary: trial.remixedData.vocabulary,
        template: trial.remixedData.template,
        usage: trial.remixedData.usage,
        aiFeedback: trial.remixedData.aiFeedback
      });
      setIsLoadingAI(false);
    }, 800);
  };

  return (
    <div className="w-full bg-background min-h-[calc(100vh-100px)] md:min-h-screen text-on-background pb-36 pt-4 px-4 select-none">
      
      {/* Background Cinematic Backdrop Overlay */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none select-none">
        <img 
          alt="Backdrop Classical" 
          src={currentVideo.bgImage} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale blur-md"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 space-y-5 max-w-xl mx-auto">
        
        {/* Result Header Glassmorphic Card */}
        <div className="glass-card rounded-2xl p-4 overflow-hidden relative">
          <div className="shimmer absolute inset-0 pointer-events-none" />
          
          <div className="flex items-center gap-xs mb-3">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <h2 className="font-display font-extrabold text-white text-lg">
              一键雅思高分模塑
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="px-3 py-1 rounded-full bg-primary-container text-white font-mono text-[10px] font-bold uppercase tracking-wider neon-glow-primary">
              精选高分表达
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container border border-secondary-container/30 font-mono text-[10px] font-bold uppercase tracking-wider">
              {currentVideo.category === 'Culture' ? '文化主题常考' : currentVideo.category === 'Tech' ? '科技伦理核心' : currentVideo.category === 'Travel' ? '经典旅游地标' : '重点家庭话题'}
            </span>
            <span className="px-3 py-1 rounded-full border border-white/10 text-on-surface-variant font-mono text-[10px] uppercase font-bold tracking-wider">
              {currentVideo.category === 'Culture' ? '深度文化篇目' : currentVideo.category === 'Tech' ? '数字社会篇目' : currentVideo.category === 'Travel' ? '地道游记篇目' : '温馨代际篇目'}
            </span>
          </div>
        </div>

        {/* 🎯 考生高阶备考提问建议 & A/B 极速测验小样 */}
        <div className="glass-card rounded-2xl p-4 border border-primary/20 bg-zinc-950/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-primary/20 text-primary font-mono text-[9px] font-bold uppercase tracking-wider rounded-bl-xl border-l border-b border-primary/10 flex items-center gap-1">
            <Zap className="w-3 h-3 text-secondary-container animate-pulse" />
            <span>黄金 A/B 体验小样</span>
          </div>
          
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="w-5 h-5 text-secondary-container" />
            <h3 className="font-display font-extrabold text-white text-sm">
              🎯 考官推荐提分必试问题（一键测评）
            </h3>
          </div>
          
          <p className="text-on-surface-variant text-xs leading-normal mb-3">
            传统检索往往给您一堆呆板而难背的长句子。点击下方最具代表性的体验小样，一秒领略传统表达被我们一键智能重构（Remix）后的神奇提分对比：
          </p>

          <div className="flex flex-col gap-2.5">
            {SHOWCASE_TRIALS.map((trial) => (
              <div 
                key={trial.id}
                onClick={() => handleSelectShowcase(trial)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-primary/40 cursor-pointer active:scale-[0.99] transition-all flex justify-between items-center group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary-container opacity-45 group-hover:opacity-100 transition-opacity" />
                <div className="pl-1.5 flex-1 pr-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono font-extrabold text-secondary-container bg-secondary-container/10 px-1.5 py-0.2 rounded uppercase tracking-wider">
                      {trial.tag}
                    </span>
                  </div>
                  <h4 className="text-white text-xs font-bold mt-1 leading-snug group-hover:text-primary transition-colors">
                    {trial.question}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant line-clamp-1 mt-0.5">
                    基线原本: "{trial.originalText}"
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Core Optimizing Dimensions Grid Indicators */}
          <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
            <div className="p-2 bg-white/5 rounded-lg text-center border border-white/5">
              <span className="text-[10px] font-bold text-secondary-container block">🎯 回答质量提升</span>
              <p className="text-[9px] text-on-surface-variant mt-0.5">突破 5.5 分低平 跃升 8.0+ 专家质感</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg text-center border border-white/5">
              <span className="text-[10px] font-bold text-secondary-container block">⚡ 信息效率跃迁</span>
              <p className="text-[9px] text-on-surface-variant mt-0.5">生词、听读、场景匹配多维全域剖析</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg text-center border border-white/5">
              <span className="text-[10px] font-bold text-secondary-container block">🎵 互动听说乐趣</span>
              <p className="text-[9px] text-on-surface-variant mt-0.5">第一视角融入 native TTS 示范随时即读</p>
            </div>
          </div>
        </div>

        {/* 🤖 Live AI 雅思私教对练中枢 (Stateful Interactive Chat Bot Console) */}
        <div id="ai-chat-coach" className="glass-card rounded-2xl p-4 border border-indigo-500/25 bg-black/55 relative overflow-hidden flex flex-col gap-3">
          <div className="absolute top-0 right-0 p-2 bg-indigo-500/10 text-indigo-400 font-mono text-[9px] font-bold uppercase tracking-wider rounded-bl-xl border-l border-b border-indigo-500/10 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-secondary-container animate-pulse" />
            <span>实时对练已联机</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <div>
              <h3 className="font-display font-extrabold text-white text-sm">
                🤖 Live AI 雅思私教对练中枢
              </h3>
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                对话式翻译与口语纠错、场景拓展
              </p>
            </div>
          </div>

          {/* Messages Log Box */}
          <div ref={chatLogRef} className="w-full bg-zinc-950/70 border border-white/10 rounded-xl p-3 h-[280px] overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-1.5 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                  msg.sender === 'user' ? 'bg-primary-container text-white' : 'bg-indigo-600 text-white'
                }`}>
                  {msg.sender === 'user' ? 'U' : 'AI'}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-3 py-2 text-xs flex flex-col gap-1.5 leading-relaxed shadow-md ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-primary-container to-indigo-700/60 rounded-tr-none text-white' 
                    : 'bg-white/5 border border-white/10 rounded-tl-none text-zinc-100'
                }`}>
                  <div className="whitespace-pre-wrap select-text">
                    {msg.sender === 'user' ? msg.text : renderMarkdown(msg.text)}
                  </div>
                  <span className="text-[9px] text-on-surface-variant/50 self-end font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            
            {isChatLoading && (
              <div className="flex gap-2 self-start max-w-[85%] items-center text-xs text-on-surface-variant pl-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-bounce delay-200" />
                  <span className="w-1.5 h-1.5 bg-secondary-container rounded-full animate-bounce delay-300" />
                </div>
                <span className="font-mono text-[10px]">AI 老师正在认真筹备回复中...</span>
              </div>
            )}
          </div>

          {/* Customized Recommendation Chips based on Lesson Content */}
          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-secondary-container" />
              💡 推荐提问 (关联你刚才学到的视频核心点):
            </span>
            <div className="flex flex-col gap-1.5">
              {chatSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isChatLoading}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 hover:border-indigo-500/40 rounded-xl text-[10px] font-bold text-left transition-all truncate hover:translate-x-0.5 cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Dialog Box Row */}
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="text"
              placeholder="请输入你想提问的高频句、生词翻译，或直接口语练习..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isChatLoading}
              className="flex-1 bg-zinc-950/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!chatInput.trim() || isChatLoading}
              className={`h-9 w-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                !chatInput.trim() || isChatLoading
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic AI custom adjustments cockpit */}
        <div className="glass-card rounded-2xl p-4 border border-secondary-container/10 bg-black/40">
          <div className="flex items-center gap-2 text-secondary-container mb-3">
            <Cpu className="w-4 h-4 text-secondary-container" />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">
              一键雅思中枢 (内置 Jitong 智能推荐)
            </h3>
          </div>

          <form onSubmit={handleRequestAISpeechRemix} className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-on-surface-variant shrink-0">目标提分等级:</label>
              <select 
                value={targetScore} 
                onChange={(e) => setTargetScore(e.target.value)}
                className="bg-zinc-950 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-primary-container"
              >
                <option value="6.5">Band 6.5 (中级/熟练运用)</option>
                <option value="7.5">Band 7.5 (高分/灵活应变)</option>
                <option value="8.0">Band 8.0 (极佳/表达生动)</option>
                <option value="9.0">Band 9.0 (专家级/母语化表达)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-on-surface-variant">在此键入你练习口语的英文，AI将为你进行高分修正:</span>
                <span className="text-[10px] text-secondary font-mono">实时润色反馈</span>
              </div>
              <textarea 
                rows={2}
                placeholder="键入你的英文口语草稿，或点击 “Remix” 让 AI Examiner 自动帮你润色并输出纠错意见..."
                value={userSpeechDraft}
                onChange={(e) => setUserSpeechDraft(e.target.value)}
                className="w-full bg-zinc-950/70 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-on-surface-variant/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoadingAI}
              className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                isLoadingAI 
                  ? 'bg-zinc-800 text-on-surface-variant cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-container to-secondary-container hover:scale-[1.01] active:scale-[0.99] text-white shadow-lg neon-glow-primary'
              }`}
            >
              <Brain className={`w-4 h-4 ${isLoadingAI ? 'animate-spin' : ''}`} />
              {isLoadingAI ? '智能考官正在分析重塑中...' : '启动一键雅思智能模塑'}
            </button>
          </form>

          {/* AI examiner diagnostic comments feedback area */}
          {generatedRemix.aiFeedback && (
            <div className="mt-3.5 p-3.5 bg-primary-container/10 border-l-4 border-primary rounded-r-xl relative animate-fadeIn">
              <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-primary">
                <Award className="w-4 h-4" />
                智能专家考官综合评估意见：
              </div>
              <p className="text-white text-xs whitespace-pre-wrap leading-relaxed select-text italic">
                {generatedRemix.aiFeedback}
              </p>
            </div>
          )}
        </div>

        {/* Key Vocabulary Section */}
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="font-mono font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
              精选亮点核心词汇高分强化
            </h3>
            <span className="text-[10px] text-secondary-container font-mono tracking-wider">
              点击下方列表中的生词卡片可听标准朗读发音
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {generatedRemix.vocabulary.map((vocab, index) => (
              <div 
                key={index}
                onClick={() => speakAudio(vocab.word)}
                className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary-container/20 flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-white text-sm font-bold">{vocab.word}</p>
                  </div>
                  <p className="text-on-surface-variant/85 text-xs mt-0.5">{vocab.translation}</p>
                </div>
                <Volume2 className={`w-4 h-4 transition-transform group-hover:scale-115 ${
                  speakingWord === vocab.word ? 'text-secondary-container animate-bounce' : 'text-primary'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Fluent IELTS Speaking Template Model */}
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="font-mono font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
            雅思高分模塑通用参考语篇范本
          </h3>
          
          <div className="relative">
            <p className="text-white font-serif text-sm leading-relaxed italic border-l-2 border-primary/40 pl-3 select-text">
              "{generatedRemix.template}"
            </p>

            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleCopyText}
                className="flex items-center gap-1 text-[11px] font-mono tracking-wider font-extrabold text-primary hover:text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-secondary-container" />
                    已为您一键复制模板！
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    一键复制范文
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Usage Bullet points */}
        <div className="glass-card rounded-2xl p-4 bg-zinc-950/60 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-secondary-container/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-secondary-container" />
            </div>
            <h3 className="font-mono font-bold text-[10px] text-white uppercase tracking-wider">
              智能分析：推荐适用的雅思常考话题 (含 Part 2/3)
            </h3>
          </div>

          <ul className="flex flex-col gap-2">
            {generatedRemix.usage.map((use, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-on-surface">
                <span className="text-secondary-container font-extrabold mt-0.5 shrink-0">•</span>
                <span className="leading-tight">{use}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Save FAB Pill (Electric gradient glow) */}
      <div className="fixed bottom-24 right-4 z-40">
        <button 
          onClick={() => {
            if (!isSaved) {
              setShowFolderSelector(true);
            }
          }}
          disabled={isSaved}
          className={`h-12 px-5 flex items-center gap-2 rounded-full font-display text-xs font-extrabold shadow-xl transition-all active:scale-95 cursor-pointer ${
            isSaved 
              ? 'bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-primary-container to-secondary-container text-white neon-glow-primary hover:opacity-90'
          }`}
        >
          <FolderHeart className={`w-4 h-4 ${isSaved ? '' : 'animate-pulse'}`} />
          <span>{isSaved ? '已存入雅思语料库' : '保存高分口语包'}</span>
        </button>
      </div>

      {/* Floating manual folder elements popup/modal */}
      {showFolderSelector && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs glass-card border border-primary-container/20 p-5 rounded-2xl animate-scaleIn shadow-[0_20px_50px_rgba(188,19,254,0.3)]">
            <h4 className="text-white font-display font-extrabold text-sm mb-3 text-center flex items-center justify-center gap-1.5">
              <FolderHeart className="w-4 h-4 text-primary" />
              请选择目标备考文件夹
            </h4>
            <p className="text-[11px] text-on-surface-variant text-center mb-4 leading-relaxed">
              您要将本次精心重塑的精品高分提能口语包手动保存至以下哪一个文件夹？
            </p>
            <div className="space-y-2">
              {[
                { key: 'PART 1', name: 'PART 1 (日常基础库)' },
                { key: 'PART 2', name: 'PART 2 (叙事描摹库)' },
                { key: 'PART 3', name: 'PART 3 (高阶思辨库)' }
              ].map((folderOpt) => (
                <button
                  key={folderOpt.key}
                  onClick={() => {
                    onSaveToFolder({
                      title: currentVideo.title,
                      template: generatedRemix.template,
                      vocab: generatedRemix.vocabulary,
                      folder: folderOpt.key as any
                    });
                    setShowFolderSelector(false);
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs text-white font-mono font-bold bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 rounded-xl transition-all cursor-pointer block"
                >
                  {folderOpt.name}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowFolderSelector(false)}
              className="mt-4 w-full py-2 border border-white/10 hover:bg-white/5 text-[10px] text-on-surface-variant rounded-lg transition-colors cursor-pointer block"
            >
              取消
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
