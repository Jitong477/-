export interface VocabItem {
  word: string;
  pinyin: string;
  translation: string;
  audioText?: string;
  definition?: string;
}

export interface VideoItem {
  id: string;
  creator: string;
  avatar: string;
  title: string;
  description: string;
  pills: string[];
  bandScore: string;
  bgImage: string;
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
  hasLiked?: boolean;
  hasBookmarked?: boolean;
  englishTranscript: string;
  chineseTranscript: string;
  category: 'Culture' | 'Tech' | 'Family' | 'Travel';
  keyVocab: VocabItem[];
  speakingTemplate: string;
  usage: string[];
  duration: string;
  ago: string;
}

export interface UserStats {
  targetScore: number;
  currentEstimatedScore: number;
  pronunciation: number;
  vocabulary: number;
  grammar: number;
  fluency: number;
  totalRemixes: number;
  completedTasks: number;
}

export interface SavedItem {
  id: string;
  videoItemId: string;
  videoTitle: string;
  category: string;
  savedAt: string;
  vocabAdded: VocabItem[];
  template: string;
  title: string;
}
