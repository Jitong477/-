import React, { useState } from 'react';
import { 
  Home, 
  Bookmark, 
  Sparkles, 
  User,
  Zap
} from 'lucide-react';
import { INITIAL_VIDEOS, INITIAL_USER_STATS } from './data';
import { VideoItem, SavedItem, VocabItem, UserStats } from './types';
import VerticalVideoFeed from './components/VerticalVideoFeed';
import AICorpus from './components/AICorpus';
import AIRemixGenerated from './components/AIRemixGenerated';

export default function App() {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  
  // Tab control states: 'HOME' | 'CORPUS' | 'REMIX'
  const [activeTab, setActiveTab] = useState<'HOME' | 'CORPUS' | 'REMIX'>('HOME');
  
  // Custom states for Comments
  const [commentsMap, setCommentsMap] = useState<Record<string, Array<{ user: string, text: string, time: string }>>>({
    v1: [
      { user: "雅思学霸_8.5分", text: "描述静谧风光和文化景点时，这套词汇简直太地道了！点赞！", time: "10分钟前" },
      { user: "苏州追梦人", text: "完美捕捉到了山塘街运河那种悠闲静谧的水乡风情，非常有代入感。", time: "1小时前" },
      { user: "考官格蕾丝", text: " excellent combination / 完美融合了‘视觉盛宴’和‘心灵修行’，雅思高分句式！", time: "1天前" }
    ],
    v2: [
      { user: "未来思想家", text: "训练集中的‘偏见’以及‘网络安全监测’绝对是雅思口语第三部分科技类话题的极佳高分素材。", time: "30分钟前" },
      { user: "科技青年", text: "人类对技术发展的‘主动问责’至关重要，这个高能观点背下来可以横扫整科！", time: "3小时前" }
    ],
    v3: [
      { user: "古建守护人", text: "在急速扩张的现代化高楼大厦中，古典庙宇和老建筑依然承载着无可替代的城市灵魂。", time: "4小时前" },
      { user: "城市规划师雅思", text: "这套词汇非常适合用来论述‘有形文化遗产’如何充当我们与祖先智慧的连接纽带。", time: "1天前" }
    ]
  });

  // Prepopulate saved folders for realistic demo presentation
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: "sav-1",
      videoItemId: "v3",
      videoTitle: "红人演讲：在平行世界里，活出你想要的多元精彩",
      category: "Culture",
      savedAt: "2026-05-28 14:32",
      title: "多元生命轨迹思辩",
      vocabAdded: [
        { word: "Diverse life trajectories", translation: "多样化的人生轨迹" },
        { word: "Sovereignty of self-determination", translation: "自我决定权" }
      ],
      template: "Personally, sovereignty of self-determination is paramount when planning our future. Young people should dare to explore diverse life trajectories.",
      folder: "PART 3"
    },
    {
      id: "sav-2",
      videoItemId: "v1",
      videoTitle: "古典留园与拙政园的满分国潮画境",
      category: "Culture",
      savedAt: "2026-05-29 09:12",
      title: "古典美学与宁静避风港",
      vocabAdded: [
        { word: "Horticultural masterpiece", translation: "园艺杰作" },
        { word: "Labyrinthine pathways", translation: "曲径通幽的路径" }
      ],
      template: "In my personal perspective, visiting a classical Chinese garden represents the ultimate escape from the concrete jungle, offering rich horticultural masterpieces.",
      folder: "PART 2"
    }
  ]);

  // Operations: Video Navigation index
  const handleVideoChange = (idx: number) => {
    if (idx >= 0 && idx < videos.length) {
      setActiveVideoIndex(idx);
    }
  };

  // Operations: Like / Double click
  const handleLikeToggle = (videoId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return {
          ...v,
          hasLiked: !v.hasLiked
        };
      }
      return v;
    }));
  };

  // Operations: Bookmark / Add directly to Saved folders
  const handleBookmarkToggle = (videoId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const nextState = !v.hasBookmarked;
        
        // Dynamic additions/removals inside saving collections
        if (nextState) {
          const newItem: SavedItem = {
            id: `sav-${Date.now()}`,
            videoItemId: v.id,
            videoTitle: v.title,
            category: v.category,
            savedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            vocabAdded: v.keyVocab,
            template: v.speakingTemplate,
            title: `${v.category} Flash Note`,
            folder: "PART 2"
          };
          setSavedItems(curr => [newItem, ...curr]);
          setUserStats(st => ({
            ...st,
            completedTasks: st.completedTasks + 1
          }));
        } else {
          setSavedItems(curr => curr.filter(item => item.videoItemId !== videoId));
        }

        return {
          ...v,
          hasBookmarked: nextState
        };
      }
      return v;
    }));
  };

  // Triggering the dynamic AI REMIX output view
  const handleTriggerRemix = (video: VideoItem) => {
    const idx = videos.findIndex(v => v.id === video.id);
    if (idx !== -1) {
      setActiveVideoIndex(idx);
    }
    setActiveTab('REMIX');
    
    // Increment stats counter
    setUserStats(prev => ({
      ...prev,
      totalRemixes: prev.totalRemixes + 1
    }));
  };

  // Adding Comments dynamically
  const handleAddComment = (videoId: string, text: string) => {
    const newCmt = {
      user: "备考学子_我",
      text,
      time: "刚刚"
    };
    setCommentsMap(prev => ({
      ...prev,
      [videoId]: [newCmt, ...(prev[videoId] || [])]
    }));
  };

  // Saving compiled custom speaking remixes
  const handleSaveToFolder = (remix: { title: string; template: string; vocab: VocabItem[]; folder?: 'PART 1' | 'PART 2' | 'PART 3' }) => {
    const curVid = videos[activeVideoIndex];
    const savedItem: SavedItem = {
      id: `sav-${Date.now()}`,
      videoItemId: curVid.id,
      videoTitle: remix.title,
      category: curVid.category,
      savedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      vocabAdded: remix.vocab,
      template: remix.template,
      title: "AI智能自定义口语重叠卡",
      folder: remix.folder || 'PART 2'
    };

    setSavedItems(prev => [savedItem, ...prev]);
    
    // Sync indicator
    setVideos(prev => prev.map(v => {
      if (v.id === curVid.id) {
        return { ...v, hasBookmarked: true };
      }
      return v;
    }));
  };

  // One-click AI interactive content summary saving handler
  const handleSaveInteractiveSummary = (data: {
    videoItemId: string;
    videoTitle: string;
    category: string;
    vocab: VocabItem[];
    customNotes: string;
    englishDescription: string;
    folder?: 'PART 1' | 'PART 2' | 'PART 3';
  }) => {
    const chosenFolder = data.folder || 'PART 1';

    const savedItem: SavedItem = {
      id: `sav-${Date.now()}`,
      videoItemId: data.videoItemId,
      videoTitle: `${data.videoTitle}`,
      category: data.category,
      savedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      vocabAdded: data.vocab,
      template: data.customNotes.trim()
        ? `【学到心得】：${data.customNotes.trim()}\n\n【AI英文场景描述】：${data.englishDescription}`
        : `【AI英文场景描述】：${data.englishDescription}`,
      title: `AI备考归档（存入 ${chosenFolder}）`,
      folder: chosenFolder
    };

    setSavedItems(prev => [savedItem, ...prev]);

    // Update video bookmark status
    setVideos(prev => prev.map(v => {
      if (v.id === data.videoItemId) {
        return { ...v, hasBookmarked: true };
      }
      return v;
    }));

    // Update user stats
    setUserStats(st => ({
      ...st,
      completedTasks: st.completedTasks + 1,
      totalRemixes: st.totalRemixes + 1
    }));
  };

  // Remove saved portfolio template
  const handleRemoveSavedItem = (id: string) => {
    const currentItem = savedItems.find(item => item.id === id);
    if (currentItem) {
      // Untag homescreen video
      setVideos(prev => prev.map(v => {
        if (v.id === currentItem.videoItemId) {
          return { ...v, hasBookmarked: false };
        }
        return v;
      }));
    }
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const isCurrentVideoSaved = savedItems.some(
    item => item.videoItemId === videos[activeVideoIndex].id
  );

  return (
    <div className="min-h-screen bg-black text-on-background relative flex flex-col antialiased selection:bg-primary-container/20">
      
      {/* Decorative Top header accent lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-30 pointer-events-none z-50" />

      {/* Main Study Screen Component Router */}
      <main className={`flex-1 w-full relative overflow-hidden ${activeTab === 'HOME' ? 'max-w-none' : 'max-w-7xl mx-auto pb-28 md:pb-6 px-4 md:px-0'}`}>
        {activeTab === 'HOME' && (
          <VerticalVideoFeed 
            videos={videos}
            activeVideoIndex={activeVideoIndex}
            onVideoChange={handleVideoChange}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onTriggerRemix={handleTriggerRemix}
            onAddComment={handleAddComment}
            commentsMap={commentsMap}
            onSaveInteractiveSummary={handleSaveInteractiveSummary}
          />
        )}

        {activeTab === 'CORPUS' && (
          <AICorpus 
            videos={videos}
            savedItems={savedItems}
            onTriggerRemix={handleTriggerRemix}
          />
        )}

        {activeTab === 'REMIX' && (
          <AIRemixGenerated 
            currentVideo={videos[activeVideoIndex]}
            allVideos={videos}
            onVideoChange={handleVideoChange}
            onSaveToFolder={handleSaveToFolder}
            isSaved={isCurrentVideoSaved}
          />
        )}
      </main>

      {/* 
        Sleek, Cyber-Minimalist Glassmorphic Bottom Navigation Bar Shell Layout
        as defined in the target screens & design blueprints!
      */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 h-22 bg-background/70 backdrop-blur-xl border-t border-white/10 shadow-[0_-12px_24px_rgba(188,19,254,0.18)] rounded-t-2xl">
        
        {/* Tab 1: 主页 (Home Feed) */}
        <button 
          onClick={() => setActiveTab('HOME')}
          className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
            activeTab === 'HOME' 
              ? 'text-primary-container drop-shadow-[0_0_8px_rgba(188,19,254,0.65)] scale-105' 
              : 'text-on-surface-variant opacity-60 hover:opacity-100 hover:text-primary'
          }`}
        >
          <Home className="w-6 h-6 stroke-[2.2]" />
          <span className="font-mono text-[10px] mt-1 font-bold">首页</span>
        </button>

        {/* Tab 2: AI语料库 dynamic grids */}
        <button 
          onClick={() => setActiveTab('CORPUS')}
          className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
            activeTab === 'CORPUS' 
              ? 'text-primary-container drop-shadow-[0_0_8px_rgba(188,19,254,0.65)] scale-105' 
              : 'text-on-surface-variant opacity-60 hover:opacity-100 hover:text-primary'
          }`}
        >
          <Sparkles className="w-6 h-6 stroke-[2.2]" />
          <span className="font-mono text-[10px] mt-1 font-bold">AI语料库</span>
        </button>

        {/* Tab 3: AI提分重塑 Dynamic Cockpit */}
        <button 
          onClick={() => setActiveTab('REMIX')}
          className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
            activeTab === 'REMIX' 
              ? 'text-primary-container drop-shadow-[0_0_8px_rgba(188,19,254,0.65)] scale-105' 
              : 'text-on-surface-variant opacity-60 hover:opacity-100 hover:text-primary'
          }`}
        >
          <Zap className="w-6 h-6 stroke-[2.2] animate-pulse text-indigo-400" />
          <span className="font-mono text-[10px] mt-1 font-bold">AI提分重塑</span>
        </button>

      </nav>

    </div>
  );
}
