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

      {/* Quick Stats Bento block */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-on-surface-variant font-mono uppercase">AI 智能重塑积累量</span>
          <span className="text-xl text-primary font-mono font-bold mt-2">{stats.totalRemixes} 次</span>
        </div>
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-on-surface-variant font-mono uppercase">专属口语背重合张数</span>
          <span className="text-xl text-secondary-container font-mono font-bold mt-2">{savedItems.length} 张</span>
        </div>
      </div>

      {/* CARDS List Content View */}
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
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider font-extrabold border border-primary/20 inline-block mr-1.5">
                      {item.folder || 'PART 2'}
                    </span>
                    <span className="bg-white/5 text-on-surface-variant px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border border-white/5 inline-block">
                      精品语料
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

    </div>
  );
}
