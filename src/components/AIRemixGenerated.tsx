import React, { useState } from 'react';
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
  MessageSquareCode
} from 'lucide-react';
import { VideoItem, VocabItem, SavedItem } from '../types';

interface AIRemixGeneratedProps {
  currentVideo: VideoItem;
  onSaveToFolder: (remixData: { title: string; template: string; vocab: VocabItem[] }) => void;
  isSaved: boolean;
}

export default function AIRemixGenerated({
  currentVideo,
  onSaveToFolder,
  isSaved
}: AIRemixGeneratedProps) {
  const [copied, setCopied] = useState(false);
  const [speakingWord, setSpeakingWord] = useState("");
  
  // Custom AI speaking trial state
  const [targetScore, setTargetScore] = useState("8.0");
  const [userSpeechDraft, setUserSpeechDraft] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Live Generated Remix Result
  const [generatedRemix, setGeneratedRemix] = useState<{
    band: string;
    vocabulary: VocabItem[];
    template: string;
    usage: string[];
    aiFeedback?: string | null;
  }>({
    band: currentVideo.bandScore.replace("BAND ", ""),
    vocabulary: currentVideo.keyVocab,
    template: currentVideo.speakingTemplate,
    usage: currentVideo.usage
  });

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
    
    // 🔑 钥匙填在这里！它会自动去抓取你在 GitHub Secrets 里存的 VITE_AI_API_KEY
    const MY_API_KEY = import.meta.env.VITE_AI_API_KEY || process.env.VITE_AI_API_KEY; 
    
    // 🌐 网址和模型名字（根据你用的第三方 API 供应商修改，这里以 OpenAI 格式为例）
    const API_URL = "https://api.openai.com/v1/chat/completions"; 
    const MODEL_NAME = "gpt-4o"; 

    // 如果云端没读到钥匙，打印报错，防止网页白屏
    if (!MY_API_KEY) {
      console.error("未检测到云端环境变量 VITE_AI_API_KEY");
      alert("因为未检测到云端密钥，一键智能模塑已切换为内置的高分口语模板。请确保部署平台已同步该 Secret。");
      setIsLoadingAI(false);
      return;
    }

    // 🧠 拼装给大模型的提示词（Prompt）
    const promptText = `
你现在是 "IELTS Layer" 的核心 AI 引擎。你的工作是把输入的英文口语草稿或视频内容瞬间重构为雅思口语高分素材。
用户期望的目标分数是: Band ${targetScore}。

请对以下内容进行润色、转换与评估：
"${userSpeechDraft || currentVideo.englishTranscript}"

请必须严格按照以下纯 JSON 格式输出，不要包含任何闲聊，也不要用 \`\`\`json 这样的包裹标记：
{
  "band": "${targetScore}",
  "vocabulary": [
    {"word": "高级词汇1", "pinyin": "pīn yīn", "translation": "中文意思"},
    {"word": "高级词汇2", "pinyin": "pīn yīn", "translation": "中文意思"},
    {"word": "高级词汇3", "pinyin": "pīn yīn", "translation": "中文意思"}
  ],
  "template": "润色后达到 Band ${targetScore} 的完整口语回答语篇范本...",
  "usage": [
    "🏷️ [AI Smart Tagging 自动贴签] - 适用常考话题",
    "❓ [Abstract Discussion Questions 考官追问模拟] - 模拟问题"
  ],
  "aiFeedback": "【🎯 提分诊断报告】\\n❌ 原文诊断: ...\\n✨ 智能 Remix 提分建议: ..."
}
`;

    try {
      // 🚀 发送网络请求，带着钥匙去开大模型的门
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MY_API_KEY}` // 👈 钥匙在这里被使用了！
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: "user", content: promptText }],
          temperature: 0.7
        }),
      });

      const jsonResult = await response.json();
      const rawText = jsonResult.choices[0].message.content.trim();
      const data = JSON.parse(rawText); 
      
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
      console.error("AI 核心大脑请求失败:", err);
      // 降级容错：如果接口由于网络问题报错，自动切回内置的高分静态小样，确保黑客松现场不崩
      setGeneratedRemix({
        band: currentVideo.bandScore.replace("BAND ", "").replace("雅思 ", "").replace("分", "").trim(),
        vocabulary: currentVideo.keyVocab,
        template: currentVideo.speakingTemplate,
        usage: currentVideo.usage,
        aiFeedback: "【⚡ 演示模式激活】当前请求由于网络延迟或中转限制，已自动为您呈现预设的高分语料资产。"
      });
    } finally {
      setIsLoadingAI(false);
    }
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
              雅思 Band {generatedRemix.band}+ 精选高分词汇
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container border border-secondary-container/30 font-mono text-[10px] font-bold uppercase tracking-wider">
              {currentVideo.category === 'Culture' ? '文化主题常考' : currentVideo.category === 'Tech' ? '科技伦理核心' : currentVideo.category === 'Travel' ? '经典旅游地标' : '重点家庭话题'}
            </span>
            <span className="px-3 py-1 rounded-full border border-white/10 text-on-surface-variant font-mono text-[10px] uppercase font-bold tracking-wider">
              {currentVideo.category === 'Culture' ? '深度文化篇目' : currentVideo.category === 'Tech' ? '数字社会篇目' : currentVideo.category === 'Travel' ? '地道游记篇目' : '温馨代际篇目'}
            </span>
          </div>
        </div>

        {/* Dynamic AI custom adjustments cockpit */}
        <div className="glass-card rounded-2xl p-4 border border-secondary-container/10 bg-black/40">
          <div className="flex items-center gap-2 text-secondary-container mb-3">
            <Cpu className="w-4 h-4 text-secondary-container" />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">
              一键雅思中枢 (内置 Gemini 智能推荐)
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
                    <span className="font-mono text-[9px] text-secondary-container bg-secondary-container/10 px-1 py-0.2 rounded">
                      {vocab.pinyin}
                    </span>
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
          onClick={() => onSaveToFolder({
            title: currentVideo.title,
            template: generatedRemix.template,
            vocab: generatedRemix.vocabulary
          })}
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

    </div>
  );
}
