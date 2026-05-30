import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  BookOpen, 
  FolderOpen, 
  Compass, 
  Cpu, 
  Users, 
  Building2,
  Volume2,
  Grid,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { VideoItem, VocabItem, SavedItem } from '../types';

interface AICorpusProps {
  videos: VideoItem[];
  savedItems: SavedItem[];
  onTriggerRemix: (vid: VideoItem) => void;
}

const partChineseName: Record<string, string> = {
  'PART 1': '口语第一部分',
  'PART 2': '口语第二部分',
  'PART 3': '口语第三部分',
  'VOCABULARY': '重点词卡'
};

export default function AICorpus({
  videos,
  savedItems,
  onTriggerRemix
}: AICorpusProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'Culture' | 'Tech' | 'Family' | 'Travel'>('Culture');
  const [selectedPart, setSelectedPart] = useState<'PART 1' | 'PART 2' | 'PART 3' | 'VOCABULARY' | null>(null);
  
  // States to view detailed vocab item in popup
  const [activeVocabDetail, setActiveVocabDetail] = useState<{ vocab: VocabItem; videoTitle: string } | null>(null);
  const [speakingText, setSpeakingText] = useState("");

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      setSpeakingText(text);
      utterance.onend = () => setSpeakingText("");
    }
  };

  // Filter video item lists
  const filteredVideos = videos.filter(vid => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      vid.title.toLowerCase().includes(query) ||
      vid.description.toLowerCase().includes(query) ||
      vid.keyVocab.some(v => v.word.toLowerCase().includes(query) || v.translation.includes(query));
      
    return matchesSearch;
  });

  // Calculate stats for items dynamically
  const getCategoryCount = (cat: string) => {
    if (cat === "Culture") return 124;
    if (cat === "Tech") return 86;
    if (cat === "Family") return 42;
    if (cat === "Travel") return 67;
    return 30;
  };

  // Filter lists inside active selected part
  const getSubList = () => {
    const results: VocabItem[] = [];
    const activeVids = videos.filter(v => v.category === selectedCategory);
    activeVids.forEach(v => {
      v.keyVocab.forEach(voc => {
        results.push(voc);
      });
    });
    return results;
  };

  return (
    <div className="w-full bg-background min-h-[calc(100vh-100px)] md:min-h-screen text-on-background pb-32 pt-4 px-4 select-none">
      
      {/* Top Title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-xs">
          <button className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/5 text-primary">
            <Search className="w-5 h-5" />
          </button>
          <h1 className="font-display text-2xl font-extrabold text-primary tracking-tight">
            AI 语料库
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/5 text-primary">
          <TrendingUp className="w-5 h-5" />
        </button>
      </div>

      {/* Modern Search Input Container */}
      <section className="mb-8">
        <div className="relative group">
          <input 
            type="text"
            className="w-full bg-white/5 border-b border-white/20 focus:border-primary-container focus:ring-0 text-sm py-3 px-2 text-white transition-all duration-300 outline-none placeholder-on-surface-variant/50"
            placeholder="搜索语料、笔记、AI建议..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary-container group-focus-within:w-full transition-all duration-500 shadow-[0_4px_12px_rgba(188,19,254,0.55)]" />
        </div>
      </section>

      {/* Category Grid Section - Bento Style */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            高级分类集锦 <span className="text-on-surface-variant text-xs font-normal">({filteredVideos.length} 个雅思高分篇目已精选)</span>
          </h2>
          <Grid className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          
          {/* Culture Grid */}
          <div 
            onClick={() => setSelectedCategory('Culture')}
            className={`glass-card p-4 rounded-2xl relative overflow-hidden group active:scale-95 cursor-pointer transition-all ${
              selectedCategory === 'Culture' 
                ? 'border-primary-container/60 shadow-[0_0_15px_rgba(188,19,254,0.15)] bg-white/10' 
                : 'border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />
            <Building2 className={`w-8 h-8 mb-2 ${selectedCategory === 'Culture' ? 'text-primary' : 'text-on-surface-variant'}`} />
            <h3 className="font-display font-semibold text-white text-sm">姑苏文化篇</h3>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
              {getCategoryCount('Culture')} 篇精品语料
            </p>
            
            {/* Display P1, P2 P3 circles */}
            <div className="mt-3 flex -space-x-1.5 select-none">
              <div className="w-5 h-5 rounded-full border border-background bg-primary-container flex items-center justify-center text-[8px] font-bold text-white">进阶</div>
              <div className="w-5 h-5 rounded-full border border-background bg-secondary-container flex items-center justify-center text-[8px] font-bold text-background font-mono">高分</div>
              <div className="w-5 h-5 rounded-full border border-background bg-tertiary-container flex items-center justify-center text-[8px] font-bold text-white">专家</div>
            </div>
          </div>

          {/* Tech Grid */}
          <div 
            onClick={() => setSelectedCategory('Tech')}
            className={`glass-card p-4 rounded-2xl relative overflow-hidden group active:scale-95 cursor-pointer transition-all ${
              selectedCategory === 'Tech' 
                ? 'border-primary-container/60 shadow-[0_0_15px_rgba(188,19,254,0.15)] bg-white/10' 
                : 'border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none" />
            <Cpu className={`w-8 h-8 mb-2 ${selectedCategory === 'Tech' ? 'text-secondary-container' : 'text-on-surface-variant'}`} />
            <h3 className="font-display font-semibold text-white text-sm">智能科技篇</h3>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
              {getCategoryCount('Tech')} 篇精品语料
            </p>
          </div>

          {/* Family Grid */}
          <div 
            onClick={() => setSelectedCategory('Family')}
            className={`glass-card p-4 rounded-2xl relative overflow-hidden group active:scale-95 cursor-pointer transition-all ${
              selectedCategory === 'Family' 
                ? 'border-primary-container/60 shadow-[0_0_15px_rgba(188,19,254,0.15)] bg-white/10' 
                : 'border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <Users className={`w-8 h-8 mb-2 ${selectedCategory === 'Family' ? 'text-primary' : 'text-on-surface-variant'}`} />
            <h3 className="font-display font-semibold text-white text-sm">社会代际篇</h3>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
              {getCategoryCount('Family')} 篇精品语料
            </p>
          </div>

          {/* Travel Grid */}
          <div 
            onClick={() => setSelectedCategory('Travel')}
            className={`glass-card p-4 rounded-2xl relative overflow-hidden group active:scale-95 cursor-pointer transition-all ${
              selectedCategory === 'Travel' 
                ? 'border-primary-container/60 shadow-[0_0_15px_rgba(188,19,254,0.15)] bg-white/10' 
                : 'border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <Compass className={`w-8 h-8 mb-2 ${selectedCategory === 'Travel' ? 'text-secondary-container' : 'text-on-surface-variant'}`} />
            <h3 className="font-display font-semibold text-white text-sm">绝美游记篇</h3>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
              {getCategoryCount('Travel')} 篇精品语料
            </p>
          </div>

        </div>
      </section>

      {/* Inside folder sub-tabs */}
      <section className="mb-8">
        <div className="flex items-center gap-xs mb-3">
          <FolderOpen className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-white text-sm md:text-base">
            当前选中：{selectedCategory === 'Culture' ? '姑苏文化特训' : 
                     selectedCategory === 'Tech' ? '人工科技伦理题库' : 
                     selectedCategory === 'Family' ? '社会学家庭代际题库' : '地道绝美游记题库'}
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar scroll-smooth">
          
          {['PART 1', 'PART 2', 'PART 3', 'VOCABULARY'].map((part) => {
            const isActive = selectedPart === part;
            return (
              <button 
                key={part}
                onClick={() => setSelectedPart(isActive ? null : part as any)}
                className={`flex-none w-28 p-3 rounded-xl text-center glass-card border transition-all active:scale-95 ${
                  isActive 
                    ? 'border-primary bg-primary/20 text-primary font-bold shadow-[0_0_10px_rgba(188,19,254,0.25)]' 
                    : 'border-white/5 hover:bg-white/5 text-on-surface-variant'
                }`}
              >
                <div className="font-mono text-xs font-extrabold flex items-center justify-center gap-1">
                  {partChineseName[part]}
                </div>
              </button>
            );
          })}
          
        </div>

        {/* Selected Part vocab list expanded */}
        {selectedPart && (
          <div className="mt-3 bg-white/5 rounded-xl border border-white/5 p-3 animate-fadeIn duration-200">
            <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {partChineseName[selectedPart]} 为您智能挑选的最佳关联考点生词：
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
              {getSubList().map((voc, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveVocabDetail({ vocab: voc, videoTitle: `${selectedCategory} Core Lesson` })}
                  className="p-2.5 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{voc.word}</p>
                    <p className="text-[10px] text-on-surface-variant/70 italic">{voc.pinyin} • {voc.translation}</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-secondary-container" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Recent saves list view */}
      <section className="mb-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-bold text-lg text-white">雅思精品提能语料库</h2>
          <button className="text-primary font-mono text-xs font-extrabold hover:underline">
            查看全部
          </button>
        </div>

        <div className="flex flex-col gap-3">
          
          {filteredVideos.map((vid) => {
            const vocabCount = vid.keyVocab.length;
            const cardBgImage = vid.bgImage;
            
            return (
              <div 
                key={vid.id}
                className="glass-card rounded-2xl overflow-hidden flex h-28 group relative hover:border-primary-container/20 transition-all cursor-pointer"
                onClick={() => onTriggerRemix(vid)}
              >
                
                {/* Embedded dynamic image with overlay */}
                <div className="w-1/3 relative overflow-hidden">
                  <img 
                    alt={vid.title} 
                    src={cardBgImage} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                  <div className="absolute bottom-2 left-2 px-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold tracking-wider text-white">
                    {vid.duration}
                  </div>
                </div>

                {/* Content info wrapper */}
                <div className="w-2/3 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="bg-primary-container/25 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase font-mono">
                        {vid.bandScore}
                      </span>
                      <span className="text-[10px] font-mono text-secondary hover:text-white transition-colors flex items-center gap-1">
                        一键雅思 <Sparkles className="w-3 h-3 text-secondary" />
                      </span>
                    </div>
                    <h4 className="text-white text-xs font-extrabold mt-1.5 line-clamp-1 font-display">
                      {vid.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-on-surface-variant font-mono">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-primary-container" />
                      <span className="text-[10px]">{vocabCount} 个亮点词汇</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-secondary-container" />
                      <span className="text-[10px]">{vid.ago}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* Detail overlay dialogue for vocabulary review */}
      {activeVocabDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-card p-6 rounded-2xl relative overflow-hidden border border-primary/20 animate-scaleIn">
            <div className="absolute top-0 right-0 p-2">
              <button 
                onClick={() => setActiveVocabDetail(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-sm font-bold active:scale-95"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 text-primary mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase">
                雅思核心词汇精选卡
              </span>
            </div>

            <h3 className="text-white font-display text-lg font-extrabold leading-snug">
              {activeVocabDetail.vocab.word}
            </h3>
            <p className="text-secondary font-mono text-xs mt-1">
              [ {activeVocabDetail.vocab.pinyin} ]
            </p>

            <div className="mt-4 p-3 bg-zinc-900/80 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-on-surface-variant uppercase font-mono block">地道中文详解</span>
              <span className="text-base text-white font-bold block mt-1">
                {activeVocabDetail.vocab.translation}
              </span>
            </div>

            <p className="text-xs text-on-surface-variant mt-3 text-center italic">
              摘录自雅思口语课目："{activeVocabDetail.videoTitle}"
            </p>

            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => handleSpeak(activeVocabDetail.vocab.word)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer select-none ${
                   speakingText === activeVocabDetail.vocab.word 
                    ? 'bg-secondary text-background neon-glow-secondary font-bold' 
                    : 'bg-primary-container text-white hover:opacity-90'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                {speakingText === activeVocabDetail.vocab.word ? '原声发音中...' : '点击朗读该单词'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
