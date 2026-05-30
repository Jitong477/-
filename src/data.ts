import { VideoItem, UserStats } from './types';

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    creator: "姑苏风雅集",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    title: "带你看古典留园与拙政园的满分国潮画境",
    description: "苏州园林不仅是艺术的结晶，更是宁静的避风港。和AI老师一起徜徉在拙政园与留园的白墙黛瓦、小桥流水中，学习雅思口语描述“安静场所”时的满分词汇！ #苏州园林 #拙政园 #国风文化 #雅思口语",
    pills: ["古典美学", "口语第二部分：安静之地", "文化遗产保护"],
    bandScore: "雅思 8.0分",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVHSEB2bvap77uS-Esri1-WgsJOB3RtzvfiSibuX60KIG6fPklo8yngUn6Do2nLO9-R6FZ-HhF4QX5H2tIStqVsyU9CWzDR_5D_umXb8yxU33PGYGq5EuLP7jee2ngPjF9Vr0FUZmASC8pNpfqGL6bBsPKMfuX6QHP19LBy7O3PnEUGM24GlX4sw8Esp3qKCQUCL_f-dDgwQ-21no_cV5wC3RWo3bmKF7l0s0EHoqFv-HEIp34VTtGyqHLzCYYBPj_6FTKZF33WXZB",
    likes: 18500,
    comments: 1205,
    bookmarks: 4500,
    shares: 920,
    hasLiked: false,
    hasBookmarked: false,
    englishTranscript: "The classical garden of Suzhou operates not merely as a horticultural masterpiece, but as a silent sanctuary for spiritual replenishment. Navigating these labyrinthine pathways allows modern individuals to cultivate a genuine sense of slow living, directly bridging our contemporary minds with the deep philosophy of historical preservation.",
    chineseTranscript: "苏州古典园林不仅是园艺杰作，更是让人心灵洗礼的幽静圣所。徜徉在迷宫般的回廊路径中，让现代人得以培养出一种真实的慢生活感，直接将我们当下的心境与深厚的历史保护哲学相连。",
    category: "Culture",
    keyVocab: [
      { word: "Horticultural masterpiece", translation: "园艺杰作/园林艺术巅峰" },
      { word: "Spiritual replenishment", translation: "精神给养/心灵洗礼" },
      { word: "Labyrinthine pathways", translation: "曲径通幽/迷宫般的路径" },
      { word: "Historical preservation", translation: "历史风貌保护" }
    ],
    speakingTemplate: "In my opinion, visiting a classical Chinese garden represents the ultimate escape from the concrete jungle. This sanctuary provides immense spiritual replenishment, where the quiet pavilions and ancient rockeries encourage people to contemplate cultural heritage and embrace a slower tempo of life.",
    usage: ["口语第二部分：描述一个能让你放松的安静场所（An attractive quiet place that you visited）", "口语第三部分：传统历史建筑在现代化城市中的价值与留存（Historical preservation in contemporary centers）"],
    duration: "0:58",
    ago: "2小时前"
  },
  {
    id: "v3",
    creator: "大冰演讲声",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    title: "红人演讲：在平行世界里，活出你想要的多元精彩",
    description: "大冰经典演说：既能朝九晚五，又能浪迹天涯。在这个充满可能的时代，我们不该被单一的生活方式局限，敢于追求多样化的人生。雅思口语大作文高分素材！ #大冰演讲 #心灵成长 #逆风生长 #雅思批判性口语",
    pills: ["不羁生命选择", "敢于不随大流", "打破职业束缚"],
    bandScore: "雅思 8.0分",
    bgImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600",
    likes: 21300,
    comments: 1845,
    bookmarks: 5800,
    shares: 1540,
    hasLiked: false,
    hasBookmarked: false,
    englishTranscript: "Embarking on diverse life trajectories empowers younger cohorts to shatter conventional stereotypes of singular success. By cultivating high collaborative autonomy, modern individuals preserve their sovereignty of self-determination, proving that living beautifully in parallel spheres is a tangible pursuit.",
    chineseTranscript: "开启多样化的人生轨迹，赋予了年轻一代打破单一成功刻板印象的力量。通过培养更高的协同自主选择，现代人在生活中保留了自我决断的主权，证明在平行世界里活出精彩并非空中楼阁。",
    category: "Family",
    keyVocab: [
      { word: "Diverse life trajectories", translation: "多样化的人生轨迹/不同的人生选择" },
      { word: "Shatter conventional stereotypes", translation: "打破传统陈旧观念与刻板定位" },
      { word: "Collaborative autonomy", translation: "协同自主和选择权利" },
      { word: "Sovereignty of self-determination", translation: "自我决定掌握人生掌控权" }
    ],
    speakingTemplate: "Sovereignty of self-determination is paramount when planning our future. Young people should dare to explore diverse life trajectories because pursuing alternative careers or arts helps shatter conventional stereotypes of success, which ultimately benefits mental growth and general well-being.",
    usage: ["口语第二部分：描述一个对你产生深远启发的人或其演讲（An inspiring speech or talk that influenced you）", "口语第三部分：现代社会工作压力、教育体系如何鼓励学生发展个人独创性（Educational systems encouraging individual uniqueness）"],
    duration: "1:45",
    ago: "1天前"
  },
  {
    id: "v4",
    creator: "德国女婿张阿福",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    title: "暖心生活集：姥姥海外带娃记，悉心大宴做饭让外孙们胖一圈！",
    description: "德国女婿博主张阿福分享海外亲子故事：孩子们的姥姥去海外一同生活了几个月，整天变着法子细心给孩子们做各种家乡美味，无尽温柔宠爱。等姥姥启程回国时，几个外孙全都不声不响地胖了一圈！雅思经典人物与故事描述高品质范本！ #张阿福 #家庭故事 #隔代亲 #舌尖温情 #雅思人物范式",
    pills: ["长辈悉心致臻", "温情亲子故事", "隔代关切纽带"],
    bandScore: "雅思 8.0分",
    bgImage: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&q=80&w=600",
    likes: 19450,
    comments: 1102,
    bookmarks: 3560,
    shares: 890,
    hasLiked: false,
    hasBookmarked: false,
    englishTranscript: "My mother-in-law traveled across the globe to reside with us overseas for several months, dedicating herself to preparing meticulous recipes and nurturing our young children. She showered them with unconditional affection through her exceptional culinary talents, so much so that all the kids gained noticeable weight before she returned to China!",
    chineseTranscript: "我的丈母娘（孩子的姥姥）不远万里飞到国外和我们同住了几个月，全身心地为孩子们准备精致美味的家乡菜，照料晚辈。她用无与伦比的绝赞厨艺和深厚的隔代爱护包裹着孩子们，以至于在她回国前，所有孩子全都不知不觉胖了一大圈！",
    category: "Tech",
    keyVocab: [
      { word: "Meticulous recipes", translation: "精心调理准备的美味菜谱" },
      { word: "Unconditional affection", translation: "毫无保留的长辈疼爱/宠溺" },
      { word: "Culinary talents", translation: "精湛高超的妙厨手艺" },
      { word: "Intergenerational bonding", translation: "双向奔赴的隔代温情/情感纽带" }
    ],
    speakingTemplate: "If I were to describe an inspiring relative who is exceptional at cooking, it would definitely be my mother-in-law. During her months overseas, she showcased outstanding culinary talents and prepared meticulous recipes daily, demonstrating unconditional affection that resulted in the kids delightfully gaining weight and enjoying unforgettable intergenerational bonding.",
    usage: ["口语第二部分：描述一个你身边擅长做饭的人，或一个十分关爱你的亲人长辈（A relative who is superb at cooking / an inspiring family member who doted on you）", "口语第三部分：当代现代家庭中隔代人共同抚养孩子的影响、传统中国菜肴在维系家庭情感纽带中的象征（Intergenerational childcare / family bonding through cultural dining routines）"],
    duration: "2:15",
    ago: "2天前"
  }
];

export const INITIAL_USER_STATS: UserStats = {
  targetScore: 7.5,
  currentEstimatedScore: 7.2,
  pronunciation: 75,
  vocabulary: 80,
  grammar: 70,
  fluency: 74,
  totalRemixes: 12,
  completedTasks: 8
};
