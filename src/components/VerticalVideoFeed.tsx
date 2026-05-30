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
  Send
} from 'lucide-react';
import { VideoItem } from '../types';

interface VerticalVideoFeedProps {
  videos: VideoItem[];
  activeVideoIndex: number;
  onVideoChange: (idx: number) => void;
  onLikeToggle: (id: string) => void;
  onBookmarkToggle: (id: string) => void;
  onTriggerRemix: (video: VideoItem) => void;
  onAddComment: (videoId: string, comment: string) => void;
  commentsMap: Record<string, Array<{ user: string, text: string, time: string }>>;
}

export default function VerticalVideoFeed({
  videos,
  activeVideoIndex,
  onVideoChange,
  onLikeToggle,
  onBookmarkToggle,
  onTriggerRemix,
  onAddComment,
  commentsMap
}: VerticalVideoFeedProps) {
  const currentVideo = videos[activeVideoIndex];
  
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fallback category tabs
  const categories = ["推荐", "音乐", "个人成长", "苏州文化"];

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
    <div className="relative w-full max-w-[420px] mx-auto h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] md:max-h-[820px] aspect-[9/16] bg-black md:rounded-[40px] md:border-[10px] md:border-zinc-900 overflow-hidden shadow-2xl flex flex-col z-10 select-none md:shadow-[0_24px_60px_rgba(188,19,254,0.15)]">
      
      {/* Background Scenic / Video Mock Image */}
      <div className="absolute inset-x-0 top-0 bottom-0 z-0">
        <img 
          alt={currentVideo.title} 
          src={currentVideo.bgImage} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-in-out select-none"
        />
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
            const isSelected = currentVideo.category === "Culture" && cat === "苏州文化" ||
                               currentVideo.category === "Travel" && cat === "推荐" ||
                               currentVideo.category === "Tech" && cat === "个人成长" ||
                               currentVideo.category === "Family" && cat === "个人成长";
            return (
              <div key={cat} className="flex flex-col items-center">
                <button 
                  onClick={() => {
                    // Try to swap to a video of this category
                    const matchedIdx = videos.findIndex(v => v.category === (cat === "苏州文化" ? "Culture" : "Travel"));
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
            onClick={() => onTriggerRemix(currentVideo)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-container via-purple-600 to-secondary-container flex items-center justify-center text-white ai-glow neon-pulse active:scale-90 duration-300 group cursor-pointer"
            title="Generate IELTS remix speak template"
          >
            <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
          </button>
          <span className="text-[10px] uppercase tracking-wider font-bold text-primary text-shadow-md text-center mt-1">
            一键雅思
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
            <span className="bg-primary-container text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shadow-[0_0_8px_rgba(188,19,254,0.4)]">
              {currentVideo.bandScore}
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

    </div>
  );
}
