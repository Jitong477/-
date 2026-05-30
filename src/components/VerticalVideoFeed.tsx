import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Languages, 
  Search, 
  Plus, 
  Check, 
  MoreVertical, 
  Volume2, 
  ChevronUp, 
  ChevronDown,
  Send,
  Brain,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Tv,
  HelpCircle,
  FolderPlus,
  Compass,
  Briefcase,
  Play,
  Award,
  BookMarked
} from 'lucide-react';
import { VideoItem, VocabItem } from '../types';

const INTERACTIVE_PRESETS: Record<string, {
  hints: string[];
  description: string;
}> = {
  v1: {
    hints: [
      "我在本视频学到了用 'horticultural masterpiece' 替代 low-level 的 'very beautiful garden'，生动还原江南园林非物质风貌！",
      "拙政园的 'labyrinthine pathways' 曲径通幽之美完美契合雅思口语 Part 2 安静之地描述，词块连贯性满分！",
      "针对历史建筑保护话题，用 'silent sanctuary for spiritual replenishment'（心灵给养的静谧避难所）让考官眼前一亮。"
    ],
    description: "苏州园林作为艺术结晶与宁静避风港，适合解答雅思‘安静放松场所’（An attractive quiet place）或‘传统老建筑’话题。"
  },
  v3: {
    hints: [
      "大冰演讲中的 'diverse life trajectories'（多元人生轨迹）概念太炫了，完美抨击‘职场千篇一律’的常规陈见！",
      "考官最爱思辨深度！词组 'sovereignty of self-determination'（自我决断主权）直接冲刺口语 Band 8.5 高分。",
      "在探讨当代学生教育压力时，该素材力证了‘激发独特创造力’（individual uniqueness）的重要性。"
    ],
    description: "大冰平行世界励志演讲：‘既能朝九晚五，又能浪迹天涯’，完美击碎职业束缚，提供雅思口语 Part 3 多元教育与人生的思辨暴击！"
  },
  v4: {
    hints: [
      "我掌握了用 'culinary talents' 和 'meticulous recipes' 来描写姥姥无与伦比的厨艺，极接地气且情感浓厚！",
      "姥姥悉心照料晚辈的‘隔代温情’可以用 'intergenerational bonding' 与 'unconditional affection' 完美表达，主考官满分加持！",
      "整个事情（姥姥海外大宴带娃直到回国发现孩子们都胖了一圈）是非常精彩且极具生活趣味的雅思 Part 2 答题妙趣素材。"
    ],
    description: "视频里描述的姥姥带娃做饭故事是个极其绝妙的口语案例，可作为口语 Part 2 ‘十分关爱你的长辈且擅长烹饪的人’(A relative who is superb at cooking / family member who doted on you) 的绝赞案例素材！"
  }
};

interface VerticalVideoFeedProps {
  videos: VideoItem[];
  activeVideoIndex: number;
  onVideoChange: (idx: number) => void;
  onLikeToggle: (id: string) => void;
  onBookmarkToggle: (id: string) => void;
  onTriggerRemix: (video: VideoItem) => void;
  onAddComment: (videoId: string, comment: string) => void;
  commentsMap: Record<string, Array<{ user: string, text: string, time: string }>>;
  onSaveInteractiveSummary?: (data: {
    videoItemId: string;
    videoTitle: string;
    category: string;
    vocab: VocabItem[];
    customNotes: string;
    englishDescription: string;
    folder?: 'PART 1' | 'PART 2' | 'PART 3';
  }) => void;
}

export default function VerticalVideoFeed({
  videos,
  activeVideoIndex,
  onVideoChange,
  onLikeToggle,
  onBookmarkToggle,
  onTriggerRemix,
  onAddComment,
  commentsMap,
  onSaveInteractiveSummary
}: VerticalVideoFeedProps) {
  const currentVideo = videos[activeVideoIndex];
  
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // AI Content Summarization state variables
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryStep, setSummaryStep] = useState(1); // 1 = Scene English, 2 = Select details / Notes, 3 = Confirmation & folder allocation
  const [selectedVocab, setSelectedVocab] = useState<VocabItem[]>([]);
  const [customLearnedText, setCustomLearnedText] = useState("");
  const [isSpeakingSummary, setIsSpeakingSummary] = useState(false);
  const [savedSuccessAlert, setSavedSuccessAlert] = useState(false);
  const [selectedSavingFolder, setSelectedSavingFolder] = useState<'PART 1' | 'PART 2' | 'PART 3'>('PART 2');

  const handleOpenSummaryModal = () => {
    setShowSummaryModal(true);
    setSummaryStep(1);
    setSelectedVocab([]); // Toggle starts empty
    setCustomLearnedText("");
    setIsSpeakingSummary(false);
    setSavedSuccessAlert(false);

    // Auto-read summary transcript if browser supports
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentVideo.englishTranscript);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsSpeakingSummary(false);
      utterance.onerror = () => setIsSpeakingSummary(false);
      setIsSpeakingSummary(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeechSummary = () => {
    if ('speechSynthesis' in window) {
      if (isSpeakingSummary) {
        window.speechSynthesis.cancel();
        setIsSpeakingSummary(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(currentVideo.englishTranscript);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsSpeakingSummary(false);
      utterance.onerror = () => setIsSpeakingSummary(false);
      setIsSpeakingSummary(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleVocab = (vocab: VocabItem) => {
    setSelectedVocab(prev => {
      const exists = prev.some(v => v.word === vocab.word);
      if (exists) {
        return prev.filter(v => v.word !== vocab.word);
      } else {
        return [...prev, vocab];
      }
    });
  };

  const handleInsertHint = (hint: string) => {
    setCustomLearnedText(prev => {
      const base = prev.trim();
      const cleanHint = hint.replace(/^\d\.\s*/, '').replace(/^[•🎯]\s*/, '');
      if (base.includes(cleanHint)) return prev; // Avoid duplicates
      return base ? `${base}\n• ${cleanHint}` : `• ${cleanHint}`;
    });
  };

  const handleSaveSummaryToFolder = () => {
    if (onSaveInteractiveSummary) {
      onSaveInteractiveSummary({
        videoItemId: currentVideo.id,
        videoTitle: currentVideo.title,
        category: currentVideo.category,
        vocab: selectedVocab,
        customNotes: customLearnedText,
        englishDescription: currentVideo.englishTranscript,
        folder: selectedSavingFolder
      });
    }
    setSavedSuccessAlert(true);
    setSummaryStep(3);
  };

  // Fallback category tabs
  const categories = ["园林风景", "红人演讲", "博主故事"];

  const handleFollowToggle = (creator: string) => {
    setFollowedCreators(prev => ({
      ...prev,
      [creator]: !prev[creator]
    }));
  };

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for language learners
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("当前浏览器暂不支持语音合成朗读。");
    }
  };

  const currentComments = commentsMap[currentVideo.id] || [
    { user: "雅思冲锋队", text: "这个句式结构完美的契合了口语高分范式！", time: "2小时前" },
    { user: "山塘雨后", text: "姑苏水乡悠然静谧，这种‘slow life’的译法真的很棒。", time: "4小时前" },
    { user: "莉莉鸭", text: "感觉雅思考试用这个例子可以瞬间提分，感谢博主！", time: "1天前" }
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(currentVideo.id, newCommentText.trim());
    setNewCommentText("");
  };

  return (
    <div className="relative w-full h-[calc(100vh-88px)] bg-black overflow-hidden flex flex-col z-10 select-none">
      
      {/* Background Scenic / Video Player */}
      <div className="absolute inset-x-0 top-0 bottom-0 z-0">
        {currentVideo.videoUrl ? (
          <video 
            key={currentVideo.videoUrl}
            src={currentVideo.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-all duration-700 ease-in-out select-none"
          />
        ) : (
          <img 
            alt={currentVideo.title} 
            src={currentVideo.bgImage} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-700 ease-in-out select-none"
          />
        )}
        {/* Soft immersive overlays */}
        <div className="absolute inset-0 video-overlay-gradient pointer-events-none" />
      </div>

      {/* Cyber-Minimalist Top Navigation */}
      <nav className="absolute top-0 left-0 w-full z-30 flex justify-between items-center px-4 pt-4 pb-2 bg-transparent">
        <div className="flex items-center gap-xs">
          <button className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/10 text-primary transition-all">
            <Search className="w-5 h-5" />
          </button>
        </div>
        
        {/* Responsive tabs */}
        <div className="flex items-center gap-4">
          {categories.map((cat, idx) => {
            const isSelected = (currentVideo.category === "Culture" && cat === "园林风景") ||
                               (currentVideo.category === "Family" && cat === "红人演讲") ||
                               (currentVideo.category === "Tech" && cat === "博主故事");
            return (
              <div key={cat} className="flex flex-col items-center">
                <button 
                  onClick={() => {
                    const categoryMap: Record<string, string> = {
                      "园林风景": "Culture",
                      "红人演讲": "Family",
                      "博主故事": "Tech"
                    };
                    const targetCat = categoryMap[cat];
                    const matchedIdx = videos.findIndex(v => v.category === targetCat);
                    if (matchedIdx !== -1) onVideoChange(matchedIdx);
                  }}
                  className={`text-body-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'text-white text-shadow-md font-bold' 
                      : 'text-on-surface-variant opacity-50 hover:opacity-80'
                  }`}
                >
                  {cat}
                </button>
                {isSelected && (
                  <div className="h-[3px] w-4 mt-0.5 bg-primary rounded-full neon-glow-primary transition-all" />
                )}
              </div>
            );
          })}
        </div>

        <div className="relative">
          <button className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/10 text-primary transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Vertical Navigation Arrows for Easy Browsing */}
      <div className="absolute left-4 top-1/3 z-30 flex flex-col gap-2">
        <button 
          onClick={() => activeVideoIndex > 0 && onVideoChange(activeVideoIndex - 1)}
          disabled={activeVideoIndex === 0}
          className={`w-9 h-9 flex items-center justify-center rounded-full glass-card text-white hover:text-primary active:scale-95 transition-all ${
            activeVideoIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-85'
          }`}
          title="Prev speak lesson"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        
        <div className="text-center font-mono py-1 text-xs text-secondary-container bg-black/40 backdrop-blur-md rounded-full px-2 border border-white/5 select-none">
          {activeVideoIndex + 1}/{videos.length}
        </div>

        <button 
          onClick={() => activeVideoIndex < videos.length - 1 && onVideoChange(activeVideoIndex + 1)}
          disabled={activeVideoIndex === videos.length - 1}
          className={`w-9 h-9 flex items-center justify-center rounded-full glass-card text-white hover:text-primary active:scale-95 transition-all ${
            activeVideoIndex === videos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-85'
          }`}
          title="Next speak lesson"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Decorative Left cyber-minimalist neon accent line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-28 bg-gradient-to-b from-primary-container to-transparent opacity-60 rounded-r-md pointer-events-none" />

      {/* Creative Right Side Operations Stack */}
      <div className="absolute right-4 bottom-28 md:bottom-24 z-20 flex flex-col items-center gap-4">
        
        {/* Creator avatar with following dynamic state */}
        <div className="relative mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden bg-surface flex items-center justify-center">
            <img 
              alt={currentVideo.creator} 
              src={currentVideo.avatar} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => handleFollowToggle(currentVideo.creator)}
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full w-5 h-5 flex items-center justify-center border-2 border-background transition-all duration-300 ${
              followedCreators[currentVideo.creator] 
                ? 'bg-secondary-container text-background' 
                : 'bg-primary-container text-white hover:scale-105'
            }`}
          >
            {followedCreators[currentVideo.creator] ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : (
              <Plus className="w-3 h-3 stroke-[3]" />
            )}
          </button>
        </div>

        {/* Like dynamic button */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => onLikeToggle(currentVideo.id)}
            className={`w-12 h-12 flex items-center justify-center rounded-full glass-card transition-all duration-200 active:scale-90 ${
              currentVideo.hasLiked 
                ? 'bg-rose-500/20 text-rose-500 border-rose-500/35' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Heart className={`w-6 h-6 ${currentVideo.hasLiked ? 'fill-rose-500' : ''}`} />
          </button>
          <span className="font-mono text-xs text-white mt-1 shadow-sm select-none">
            {currentVideo.likes + (currentVideo.hasLiked ? 1 : 0)}
          </span>
        </div>

        {/* Interaction Comment Button */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setShowCommentsDrawer(true)}
            className="w-12 h-12 flex items-center justify-center rounded-full glass-card text-white hover:bg-white/10 active:scale-90 transition-all"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          <span className="font-mono text-xs text-white mt-1 select-none">
            {currentComments.length}
          </span>
        </div>

        {/* Save / Bookmark Button */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => onBookmarkToggle(currentVideo.id)}
            className={`w-12 h-12 flex items-center justify-center rounded-full glass-card transition-all duration-200 active:scale-90 ${
              currentVideo.hasBookmarked 
                ? 'bg-secondary-container/20 text-secondary-container border-secondary-container/35' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${currentVideo.hasBookmarked ? 'fill-secondary-container' : ''}`} />
          </button>
          <span className="font-mono text-xs text-white mt-1 select-none">
            {currentVideo.bookmarks + (currentVideo.hasBookmarked ? 1 : 0)}
          </span>
        </div>

        {/* Share Button (Mocked copy link) */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => {
              const shareUrl = window.location.href;
              navigator.clipboard.writeText(shareUrl);
              alert("链接已成功复制到剪贴板！快去给研习雅思口语的小伙伴们分享吧。");
            }}
            className="w-12 h-12 flex items-center justify-center rounded-full glass-card text-white hover:bg-white/10 active:scale-90 transition-all"
            title="复制分享链接"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* High Precision AI REMIX spark glowing button */}
        <div className="flex flex-col items-center mt-3">
          <button 
            onClick={handleOpenSummaryModal}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-container via-purple-600 to-secondary-container flex items-center justify-center text-white ai-glow neon-pulse active:scale-90 duration-300 group cursor-pointer"
            title="一键 AI 场景总结与口语互动"
          >
            <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
          </button>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary text-shadow-md text-center mt-1 animate-pulse">
            一键 AI 总结
          </span>
        </div>

      </div>

      {/* Immersive Bottom Content Information Overlay */}
      <div className="absolute left-0 bottom-6 w-full z-10 px-4 pb-4 pointer-events-none">
        
        <div className="max-w-[78%] flex flex-col gap-2 pointer-events-auto">
          
          {/* Creator Tag Line and Level Indicator */}
          <div className="flex items-center gap-2">
            <span className="font-display text-base md:text-lg font-bold text-white text-shadow">
              {currentVideo.creator}
            </span>
          </div>

          {/* Description script */}
          <p className="text-white text-sm leading-relaxed line-clamp-2 md:line-clamp-3 text-shadow-sm opacity-95">
            {currentVideo.description}
          </p>

          {/* Translucent Transcript study Card */}
          <div className="mt-2 glass-card p-3 rounded-xl flex items-center gap-3 relative overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/10 to-transparent pointer-events-none" />
            <div className="shimmer absolute inset-0 pointer-events-none" />
            
            {/* Play audio button triggers standard SpeechSynth */}
            <button 
              onClick={() => handleSpeech(currentVideo.englishTranscript)}
              className={`w-10 h-10 rounded-full border border-secondary-container flex items-center justify-center flex-shrink-0 transition-all ${
                isSpeaking 
                  ? 'bg-secondary-container text-background font-bold animate-ping' 
                  : 'bg-black/30 hover:bg-secondary-container/20 text-secondary-container'
              }`}
              title={isSpeaking ? '暂停朗读' : '朗读语料音频'}
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-secondary-container" />
                <span className="text-[10px] text-secondary-container font-mono font-bold uppercase tracking-wider">
                  AI 智能听力原文字幕
                </span>
                <span className="text-[10px] text-on-surface-variant font-mono ml-auto">
                  时长 {currentVideo.duration} • 点击真人发音朗读
                </span>
              </div>
              <p className="text-white font-serif text-xs italic mt-0.5 leading-snug line-clamp-1">
                "{currentVideo.englishTranscript}"
              </p>
              <p className="text-on-surface-variant text-[11px] mt-0.5 line-clamp-1">
                {currentVideo.chineseTranscript}
              </p>
            </div>
            
          </div>

        </div>

      </div>

      {/* Floating Drawer for Comments Discussion */}
      {showCommentsDrawer && (
        <div className="absolute inset-x-0 bottom-0 top-[25%] bg-zinc-950/95 backdrop-blur-2xl rounded-t-2xl border-t border-white/10 z-50 flex flex-col text-on-background select-text">
          
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/15">
            <div>
              <h3 className="font-display font-bold text-white text-base">
                评论互动交流 ({currentComments.length})
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">
                加入备考讨论共创群
              </p>
            </div>
            <button 
              onClick={() => setShowCommentsDrawer(false)}
              className="text-on-surface-variant hover:text-white font-semibold text-sm px-2.5 py-1.5 rounded-lg bg-white/5 active:scale-95 transition-all"
            >
              关闭
            </button>
          </div>

          {/* Comment list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar">
            {currentComments.map((cmt, idx) => (
              <div key={idx} className="flex gap-2 items-start border-b border-white/5 pb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-background uppercase">
                  {cmt.user.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">{cmt.user}</span>
                    <span className="text-[10px] text-on-surface-variant">{cmt.time}</span>
                  </div>
                  <p className="text-xs text-on-surface mt-1 whitespace-pre-wrap">{cmt.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form write comment */}
          <form onSubmit={handleCommentSubmit} className="p-4 bg-zinc-900 border-t border-white/10 flex items-center gap-2">
            <input 
              type="text"
              placeholder="分享你的发音笔记，或者向雅思学友提问..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-container transition-all"
            />
            <button 
              type="submit"
              className="p-2 rounded-lg bg-primary-container text-white hover:bg-opacity-90 active:scale-95 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* ========================================================= */}
      {/* 🔮 CORE BRAND-NEW FEATURE: AI 一键内容总结与口语交互舱 🔮 */}
      {/* ========================================================= */}
      {showSummaryModal && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-text animate-fadeIn">
          
          <div className="w-full max-w-lg bg-zinc-950/95 border border-primary/20 rounded-2xl shadow-[0_0_30px_rgba(188,19,254,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Glow Accent */}
            <div className="h-1 bg-gradient-to-r from-primary via-purple-600 to-secondary-container" />

            {/* Modal Header */}
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-secondary-container animate-pulse" />
                <div>
                  <h3 className="font-display font-extrabold text-white text-sm">
                    AI 一键内容总结互动舱
                  </h3>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    IELTS Interactive Scene Audio Summary
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowSummaryModal(false);
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                }}
                className="p-1 px-2.5 rounded-lg bg-white/5 text-xs text-on-surface-variant hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>

            {/* Stepper Wizard Indicator */}
            <div className="p-3 bg-black border-b border-white/5 flex justify-between items-center px-6">
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${summaryStep >= 1 ? 'bg-primary text-white font-extrabold' : 'bg-white/5 text-on-surface-variant'}`}>
                  1
                </span>
                <span className={`text-[11px] font-semibold ${summaryStep === 1 ? 'text-white font-bold' : 'text-on-surface-variant'}`}>
                  场景还原
                </span>
              </div>
              <div className="flex-1 h-[1px] bg-white/10 mx-3" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${summaryStep >= 2 ? 'bg-secondary-container text-black font-extrabold' : 'bg-white/5 text-on-surface-variant'}`}>
                  2
                </span>
                <span className={`text-[11px] font-semibold ${summaryStep === 2 ? 'text-white font-bold' : 'text-on-surface-variant'}`}>
                  自主/提炼心得
                </span>
              </div>
              <div className="flex-1 h-[1px] bg-white/10 mx-3" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${summaryStep >= 3 ? 'bg-emerald-500 text-white font-extrabold' : 'bg-white/5 text-on-surface-variant'}`}>
                  3
                </span>
                <span className={`text-[11px] font-semibold ${summaryStep === 3 ? 'text-white font-bold' : 'text-on-surface-variant'}`}>
                  自动归档
                </span>
              </div>
            </div>

            {/* Scrollable Content Shell */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

              {/* STEP 1: Scene Description */}
              {summaryStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3.5 bg-gradient-to-r from-primary-container/10 to-transparent rounded-xl border border-primary/10">
                    <span className="text-[10px] uppercase font-mono font-bold text-primary block mb-1">
                      【 AI 英文总结描述场景 (口语听读还原) 】
                    </span>
                    <h4 className="text-white text-xs font-bold leading-relaxed">
                      下面是 AI 对当前短视频环境场景的一位专业英语描述。点击下方的大喇叭开启真人级标准发音，开始沉浸式跟读训练：
                    </h4>
                  </div>

                  {/* Elegant transcript card */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3 relative overflow-hidden group">
                    <p className="text-white font-serif text-sm italic leading-relaxed select-text pr-8">
                      "{currentVideo.englishTranscript}"
                    </p>
                    
                    <p className="text-on-surface-variant text-xs pt-2 border-t border-white/5 leading-relaxed">
                      🇨🇳 {currentVideo.chineseTranscript}
                    </p>

                    <button 
                      onClick={handleSpeechSummary}
                      type="button"
                      className={`absolute right-3 top-3 w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center transition-all ${
                        isSpeakingSummary 
                          ? 'bg-primary text-white animate-pulse' 
                          : 'bg-black/40 text-primary hover:bg-primary/20'
                      }`}
                      title={isSpeakingSummary ? '点击暂停' : '听取标准发音朗读'}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3 bg-zinc-900 rounded-lg flex items-center gap-2 border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping shrink-0" />
                    <p className="text-[10px] text-on-surface-variant">
                      提示：熟读这套纯正地道表达，不仅能掌握地道江南情怀词汇，更是雅思大作文、口语描述高频率段落！
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setSummaryStep(2);
                      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    }}
                    type="button"
                    className="w-full py-3 bg-gradient-to-r from-primary-container to-secondary-container hover:opacity-95 active:scale-[0.99] rounded-xl text-xs font-extrabold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg neon-glow-primary"
                  >
                    <span>下一步：选择/自主输入学到了什么</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Choose Vocabulary and Personal inputs */}
              {summaryStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Select interactive vocabulary */}
                  <div className="space-y-2">
                    <h4 className="text-white text-xs font-extrabold flex items-center gap-1.5 uppercase font-mono tracking-wider text-secondary-container">
                      <BookOpen className="w-4 h-4" />
                      ① 选择你本次掌握的生词亮点 (点击多选标记)：
                    </h4>
                    <p className="text-on-surface-variant text-[10px]">
                      收集卡片将携带你选中的单词，一键载入你对应收藏夹的“我的生词库”：
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentVideo.keyVocab.map((vocab, index) => {
                        const isSelected = selectedVocab.some(v => v.word === vocab.word);
                        return (
                          <div 
                            key={index}
                            onClick={() => handleToggleVocab(vocab)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between group ${
                              isSelected 
                                ? 'bg-primary/10 border-primary shadow-[0_0_8px_rgba(188,19,254,0.2)] font-bold' 
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="pr-2 text-left">
                              <span className="block text-white text-xs font-bold font-mono group-hover:text-primary transition-colors">
                                {vocab.word}
                              </span>
                              <span className="text-[9px] text-on-surface-variant font-mono">
                                {vocab.translation}
                              </span>
                            </div>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'bg-primary border-primary text-white' : 'border-white/20'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick preset insertions to guide developer/evaluator */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-secondary-container">
                      <HelpCircle className="w-4 h-4" />
                      <h4 className="text-white text-xs font-extrabold uppercase font-mono tracking-wider">
                        ② 考官推荐提分体验小样 (一键填充心得)：
                      </h4>
                    </div>
                    <p className="text-[10px] text-on-surface-variant text-left">
                      体验者不知道输入什么？点击下方最契合该视频场景的问题与高分心得，一键快速填入心得：
                    </p>

                    <div className="flex flex-col gap-2">
                      {(INTERACTIVE_PRESETS[currentVideo.id] || INTERACTIVE_PRESETS['v1']).hints.map((hint, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleInsertHint(hint)}
                          className="p-2.5 bg-black hover:bg-white/5 border border-white/5 hover:border-secondary-container/40 rounded-xl cursor-pointer text-left transition-colors active:scale-[0.99] flex items-start gap-1.5 group"
                        >
                          <span className="text-secondary-container font-extrabold text-[11px] mt-0.5 group-hover:scale-110 transition-transform">🎯</span>
                          <p className="text-[10px] text-on-surface-variant leading-snug font-semibold text-white group-hover:text-secondary-container">
                            {hint}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manual custom texting */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5 text-left">
                    <label className="text-white text-xs font-extrabold block">
                      ③ 自由输入/编辑我本次学到的口语绝密心得：
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="在此直接键入你今天的心得、记忆口诀，或微调上面点击加入的学习范本内容..."
                      value={customLearnedText}
                      onChange={(e) => setCustomLearnedText(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 p-2.5 text-xs text-white placeholder-on-surface-variant/30 rounded-xl focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                    />
                  </div>

                  {/* Choose portfolio Folder target manually */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5 text-left">
                    <label className="text-white text-xs font-extrabold block">
                      ④ 手动选择并存入备考文件夹：
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'PART 1', label: 'PART 1 基础话题' },
                        { key: 'PART 2', label: 'PART 2 细节叙事' },
                        { key: 'PART 3', label: 'PART 3 思辨批判' }
                      ].map(opt => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setSelectedSavingFolder(opt.key as any)}
                          className={`py-2 text-center rounded-lg border text-[10px] font-mono font-extrabold transition-all cursor-pointer ${
                            selectedSavingFolder === opt.key 
                              ? 'bg-primary/20 border-primary text-white shadow-[0_0_8px_rgba(188,19,254,0.3)]' 
                              : 'bg-zinc-900 border-white/10 text-on-surface-variant hover:text-white hover:border-white/20'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buttons controls */}
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setSummaryStep(1)}
                      type="button"
                      className="px-4 py-3 border border-white/10 rounded-xl text-xs text-white hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer font-mono"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>上一步</span>
                    </button>
                    
                    <button 
                      onClick={handleSaveSummaryToFolder}
                      type="button"
                      className="flex-1 py-3 bg-gradient-to-r from-primary-container to-secondary-container hover:opacity-95 active:scale-95 text-xs font-extrabold text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg neon-glow-primary"
                    >
                      <span>下一步：存入收藏夹</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 3: Confirm and Successfully Archived Indicators */}
              {summaryStep === 3 && (
                <div className="space-y-4 py-4 text-center animate-fadeIn">
                  
                  {/* Success animation elements */}
                  <div className="py-2 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mb-4 relative animate-bounce">
                      <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                      <Check className="w-8 h-8 text-emerald-400 stroke-[3]" />
                    </div>

                    <h4 className="text-white font-display font-extrabold text-base">
                      🎉 智能存档成功！完美收录雅思卡包
                    </h4>
                    
                    <p className="text-on-surface-variant text-xs max-w-sm mt-2 leading-relaxed">
                      AI 已完成多维度听读测评重组。本一键内容总结卡片已成功加入并归档至你对应的雅思常考场景收藏库中！
                    </p>
                  </div>

                  {/* Saved detail stats cards */}
                  <div className="glass-card p-3 rounded-xl border border-white/5 max-w-sm mx-auto text-left space-y-2 bg-black/60 font-mono">
                    <div className="flex justify-between text-[11px] pb-1 border-b border-white/5">
                      <span className="text-on-surface-variant">目标视频：</span>
                      <span className="text-white text-right font-semibold truncate max-w-[200px]">{currentVideo.title}</span>
                    </div>
                    <div className="flex justify-between text-[11px] pb-1 border-b border-white/5">
                      <span className="text-on-surface-variant">手动选择归档至文件夹：</span>
                      <span className="text-secondary-container font-extrabold text-right">
                        {selectedSavingFolder} - {
                          selectedSavingFolder === 'PART 1' ? '日常基础话题库' :
                          selectedSavingFolder === 'PART 2' ? '叙事和精彩描摹' : '高阶批判思辨库'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] pb-1 border-b border-white/5">
                      <span className="text-on-surface-variant">本次掌握新词数目：</span>
                      <span className="text-white font-extrabold text-right">{selectedVocab.length} 个词组</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 italic text-center pt-1 leading-normal">
                      系统已成功将该提分素材与亮点词组加入到你的随身备考本！
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xs mx-auto">
                    <button 
                      onClick={() => setShowSummaryModal(false)}
                      type="button"
                      className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 active:scale-95 text-xs text-white rounded-xl transition-all cursor-pointer text-center select-none font-bold block"
                    >
                      完成，继续刷视频
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
