import React, { useState } from 'react';
import { 
  Award, 
  Target, 
  BookOpen, 
  Trash2, 
  Volume2, 
  TrendingUp, 
  Sparkles,
  ClipboardList,
  FolderHeart
} from 'lucide-react';
import { UserStats, SavedItem, VocabItem } from '../types';

interface MyProfileProps {
  stats: UserStats;
  savedItems: SavedItem[];
  onRemoveSavedItem: (id: string) => void;
}

export default function MyProfile({
  stats,
  savedItems,
  onRemoveSavedItem
}: MyProfileProps) {
  const [activeTab, setActiveTab] = useState<'CARDS' | 'METRICS'>('CARDS');
  const [speakingText, setSpeakingText] = useState("");

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
      setSpeakingText(text);
      utterance.onend = () => setSpeakingText("");
    }
  };

  // Dynamic performance indicators
  const skills = [
    { name: "英语发音能力 (Pronunciation)", rate: stats.pronunciation, color: "from-purple-500 to-indigo-500", label: "Band 7.5" },
    { name: "高级词汇储备 (Lexical Resource)", rate: stats.vocabulary, color: "from-cyan-500 to-blue-500", label: "Band 8.0" },
    { name: "语法精确驾驭 (Grammatical Accuracy)", rate: stats.grammar, color: "from-rose-500 to-pink-500", label: "Band 7.0" },
    { name: "口语连贯流利 (Fluency & Coherence)", rate: stats.fluency, color: "from-amber-500 to-yellow-500", label: "Band 7.4" }
  ];

  return (
    <div className="w-full bg-background min-h-[calc(100vh-100px)] md:min-h-screen text-on-background pb-32 pt-4 px-4 select-none">
      
      {/* Top Header Card */}
      <div className="glass-card rounded-2xl p-4 mb-5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 pointer-events-none opacity-10">
          <Award className="w-24 h-24 text-primary" />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-container to-secondary-container flex items-center justify-center font-display font-extrabold text-white text-lg shadow-lg">
            IL
          </div>
          <div>
            <h2 className="text-white font-display font-bold text-base">雅思考生小雅</h2>
            <p className="text-xs text-primary font-mono flex items-center gap-1 mt-0.5">
              <Target className="w-3.5 h-3.5" />
              奋斗目标提分：雅思 Band {stats.targetScore}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider block">当前估算总分</span>
          <span className="text-xl text-secondary-container font-mono font-bold block">
            {stats.currentEstimatedScore}
          </span>
        </div>
      </div>

      {/* Interactive Selection tab headers */}
      <div className="flex bg-zinc-950 p-1 rounded-xl gap-1 border border-white/5 mb-5 select-none text-xs font-semibold">
        <button 
          onClick={() => setActiveTab('CARDS')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeTab === 'CARDS' 
              ? 'bg-white/10 text-white font-bold' 
              : 'text-on-surface-variant/70 hover:text-white'
          }`}
        >
          备考夹语料 ({savedItems.length})
        </button>
        <button 
          onClick={() => setActiveTab('METRICS')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeTab === 'METRICS' 
              ? 'bg-white/10 text-white font-bold' 
              : 'text-on-surface-variant/70 hover:text-white'
          }`}
        >
          AI 雅思核心能谱看板 (备考分析)
        </button>
      </div>

      {/* CARDS List Content View */}
      {activeTab === 'CARDS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-display font-bold text-white text-sm flex items-center gap-1.5">
              <FolderHeart className="w-4 h-4 text-primary" />
              已存特训范本与亮点生词库
            </h3>
            <span className="text-[10px] font-mono text-on-surface-variant text-right">
              当前存有 {savedItems.length} 篇
            </span>
          </div>

          {savedItems.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl border-white/5 text-on-surface-variant text-xs space-y-2">
              <ClipboardList className="w-8 h-8 text-on-surface-variant/40 mx-auto" />
              <p>暂无已存的提分模板内容噢。</p>
              <p className="text-[10px] opacity-70">点击视频底部的 “一键雅思” 生成AI模塑方案，并点击右下方保存卡片建立您的口语库。</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedItems.map((item) => (
                <div 
                  key={item.id}
                  className="glass-card rounded-xl p-4 border border-white/5 space-y-3 animate-fadeIn"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-primary-container/20 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider font-extrabold border border-primary/10">
                        {item.category === 'Culture' ? '姑苏文化专题' : item.category === 'Tech' ? '人工科技伦理' : item.category === 'Travel' ? '绝美旅游推荐' : '温馨社会家庭'} 精品语料
                      </span>
                      <h4 className="text-white text-xs font-extrabold mt-1.5 font-display line-clamp-1">
                        {item.videoTitle}
                      </h4>
                    </div>
                    
                    <button 
                      onClick={() => onRemoveSavedItem(item.id)}
                      className="text-on-surface-variant hover:text-rose-500 p-1 rounded hover:bg-white/5 active:scale-95 transition-all"
                      title="从备考文件夹中移除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Vocabulary highlight pills */}
                  {item.vocabAdded && item.vocabAdded.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.vocabAdded.map((v, i) => (
                        <div 
                          key={i} 
                          onClick={() => playSpeech(v.word)}
                          className="flex items-center gap-1 bg-zinc-900 border border-white/5 hover:border-primary/20 px-2 py-0.5 rounded text-[10px] text-white cursor-pointer"
                        >
                          <span className="text-secondary-container">•</span>
                          <span>{v.word} ({v.translation})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Copy Speaking text */}
                  <div className="p-3 bg-zinc-950/85 rounded-xl text-xs italic text-on-surface border border-white/5 select-text relative group">
                    <p className="font-serif leading-relaxed line-clamp-3">"{item.template}"</p>
                    <button 
                      onClick={() => playSpeech(item.template)}
                      className="absolute right-2 bottom-2 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform"
                      title="听取真人发音朗读示范"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${speakingText === item.template ? 'animate-bounce text-secondary-container' : ''}`} />
                    </button>
                  </div>

                  <div className="text-[10px] text-on-surface-variant font-mono text-right select-none">
                    完美重塑生成于：{item.savedAt}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* METRICS Examiner Analytics View */}
      {activeTab === 'METRICS' && (
        <div className="space-y-5 animate-fadeIn">
          
          {/* Target Score Gauges */}
          <div className="glass-card rounded-2xl p-4">
            <h3 className="font-display font-bold text-white text-sm mb-4 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              雅思考试核心能力维度测算
            </h3>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface font-semibold">{skill.name}</span>
                    <span className="text-secondary-container font-mono font-bold">{skill.label} ({skill.rate}%)</span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      style={{ width: `${skill.rate}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} neon-glow-primary transition-all duration-1000`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical progression graph drawn beautifully using custom clean responsive inline SVG */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-display font-bold text-white text-sm">
                  口语模塑多维成长曲线图
                </h3>
                <p className="text-xs text-on-surface-variant font-mono">周维度综合表现跃升轨迹</p>
              </div>
              <span className="text-xs font-mono font-bold text-primary flex items-center gap-1">
                连续打卡天数 <Sparkles className="w-3.5 h-3.5 text-primary" />
              </span>
            </div>

            {/* Custom Interactive SVG Progression Chart */}
            <div className="w-full h-40 bg-zinc-950/70 rounded-xl p-2 border border-white/5 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                {/* Horizontal reference lines */}
                <line x1="20" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="20" y1="50" x2="280" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1="20" y1="80" x2="280" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                
                {/* Score indicators */}
                <text x="5" y="24" fill="#a1a1aa" fontSize="8" fontFamily="monospace">8.0分</text>
                <text x="5" y="54" fill="#a1a1aa" fontSize="8" fontFamily="monospace">7.0分</text>
                <text x="5" y="84" fill="#a1a1aa" fontSize="8" fontFamily="monospace">6.0分</text>

                {/* Score plot path line */}
                <path 
                  d="M 30,85 Q 90,75 140,48 T 260,35" 
                  fill="none" 
                  stroke="url(#purple-cyan-grad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Dots */}
                <circle cx="30" cy="85" r="4.5" fill="#ebb2ff" />
                <circle cx="140" cy="48" r="4.5" fill="#00dce5" />
                <circle cx="260" cy="35" r="5.5" fill="#bc13fe" className="animate-pulse" />

                {/* Text dates */}
                <text x="30" y="110" fill="#71717a" fontSize="7" textAnchor="middle" fontFamily="monospace">第1周</text>
                <text x="140" y="110" fill="#71717a" fontSize="7" textAnchor="middle" fontFamily="monospace">第2周</text>
                <text x="260" y="110" fill="#ebb2ff" fontSize="7" textAnchor="middle" fontFamily="monospace">当前突破</text>

                {/* Gradient shader definitions */}
                <defs>
                  <linearGradient id="purple-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ebb2ff" />
                    <stop offset="50%" stopColor="#00f4fe" />
                    <stop offset="100%" stopColor="#bc13fe" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Quick Stats Bento block */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-on-surface-variant font-mono uppercase">AI智能重塑积累量</span>
              <span className="text-xl text-primary font-mono font-bold mt-2">{stats.totalRemixes} 次</span>
            </div>
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-on-surface-variant font-mono uppercase">累积打卡完成精读</span>
              <span className="text-xl text-secondary-container font-mono font-bold mt-2">{stats.completedTasks} 篇</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
