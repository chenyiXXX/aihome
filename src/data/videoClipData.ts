// --------------------------------------------------------------------------
// Video Clip Data Structures & Presets (Mirrors GraphicText Data Architecture)
// --------------------------------------------------------------------------

export interface VideoShot {
  id: string;
  order: number;
  shotType: '全景推镜' | '微距特写' | '细节摇镜' | '环绕移镜' | '升降镜头' | '硬核实测';
  timeRange: string;
  startSec: number;
  endSec: number;
  previewImage: string;
  cameraMotion: string;
  voiceoverScript: string;
  subtitles: string;
  captionEffect: string;
  transition: '硬切' | '镜头推拉' | '叠化淡入' | '光影闪白';
  soundFx: string;
  technicalSpec?: string;
}

export interface BgmTrack {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  duration: string;
  audioMood: string;
  url?: string;
}

export interface VoiceoverConfig {
  speakerId: string;
  speakerName: string;
  style: string;
  language: '中文' | '英文' | '中英双语';
  speed: string;
}

export type VideoClipStatus = 
  | '剪辑中'
  | '已同步到剪映'
  | '发布审核中'
  | '审核不通过'
  | '计划发布'
  | '已发布'
  | '回收站';

export interface VideoClipItem {
  id: string;
  topic: string;
  title: string;
  hookText: string;
  summary: string;
  coverImage: string;
  aspectRatio: '9:16' | '16:9';
  durationSeconds: number;
  durationText: string;
  resolution: '4K 60fps' | '1080P 60fps';
  publishPlatform: string;
  targetPlatforms?: string[];
  language?: '中文' | '英文';
  status: VideoClipStatus;
  auditRejectReason?: string;
  scheduledPublishTime?: string;
  createdAt: string;
  estimatedViews: string;
  themeStyle: 'emerald' | 'dark' | 'warm';
  bgmTrack: BgmTrack;
  voiceover: VoiceoverConfig;
  linkedProducts: string[];
  linkedCase: {
    id: string;
    name: string;
    location: string;
    clipCount: number;
  };
  shots: VideoShot[];
}

export interface VideoMaterialItem {
  id: string;
  code: string;
  title: string;
  category: 'case' | 'factory' | 'macro' | 'render' | 'bgm';
  categoryLabel: string;
  url: string;
  thumbnail: string;
  duration: string;
  aspectRatio: '9:16' | '16:9';
  resolution: string;
  tags: string[];
  description: string;
  fileSize: string;
}

// --------------------------------------------------------------------------
// Available Video B-Roll Material Library
// --------------------------------------------------------------------------
export const AVAILABLE_VIDEO_MATERIALS: VideoMaterialItem[] = [
  {
    id: 'vmat-01',
    code: 'B-ROLL-01',
    title: '迪拜滨海大平层 270°全景采光客厅缓缓前推镜头',
    category: 'case',
    categoryLabel: '落地案例',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
    duration: '00:04',
    aspectRatio: '9:16',
    resolution: '4K 60fps',
    tags: ['#全景推镜', '#迪拜精装', '#门墙一体', '#自然光影'],
    description: '4K慢动作滑轨前推，从落地窗阳光平移至PET高柜',
    fileSize: '48.2 MB'
  },
  {
    id: 'vmat-02',
    code: 'B-ROLL-02',
    title: '德国豪迈CNC封边机激光微米热熔无胶缝微距实录',
    category: 'factory',
    categoryLabel: '工厂智造',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    duration: '00:03',
    aspectRatio: '9:16',
    resolution: '4K 120fps',
    tags: ['#激光封边', '#德国豪迈', '#零胶缝防水', '#微距特写'],
    description: '微距镜头捕捉激光脉冲热熔瞬间，无缝封边完美交汇',
    fileSize: '36.5 MB'
  },
  {
    id: 'vmat-03',
    code: 'B-ROLL-03',
    title: 'PET肤感板零度超亚手模触感与指纹不留痕测试',
    category: 'macro',
    categoryLabel: '硬核特写',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&auto=format&fit=crop&q=80',
    duration: '00:03',
    aspectRatio: '9:16',
    resolution: '4K 60fps',
    tags: ['#抗指纹测试', '#零度超亚', '#触感温润', '#物理实验'],
    description: '手指按压测试与超微距油污擦拭对比，体现耐污性',
    fileSize: '29.1 MB'
  },
  {
    id: 'vmat-04',
    code: 'B-ROLL-04',
    title: '磁悬浮静音吊滑门无地轨极窄4mm型材顺滑滑动',
    category: 'macro',
    categoryLabel: '硬核特写',
    url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&auto=format&fit=crop&q=80',
    duration: '00:04',
    aspectRatio: '9:16',
    resolution: '4K 60fps',
    tags: ['#吊滑隐形门', '#磁悬浮', '#极窄边框', '#丝滑自吸'],
    description: '单指轻推门板滑行动作，末端阻尼柔和静音自吸合',
    fileSize: '41.3 MB'
  },
  {
    id: 'vmat-05',
    code: 'B-ROLL-05',
    title: '意式极简西厨中岛台内嵌45°暖光悬浮效果实景',
    category: 'render',
    categoryLabel: '光影实景',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80',
    duration: '00:05',
    aspectRatio: '9:16',
    resolution: '4K 60fps',
    tags: ['#西厨中岛', '#3000K灯带', '#悬浮岩板', '#氛围感'],
    description: '灯光缓亮过程，中岛台面与地面悬浮阴影对比',
    fileSize: '52.0 MB'
  },
  {
    id: 'vmat-06',
    code: 'B-ROLL-06',
    title: '百隆五金阻尼抽屉慢动作自吸闭合与高承重实测',
    category: 'macro',
    categoryLabel: '硬核特写',
    url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&auto=format&fit=crop&q=80',
    duration: '00:03',
    aspectRatio: '9:16',
    resolution: '4K 120fps',
    tags: ['#百隆五金', '#抽屉自吸', '#机械美学', '#50万次开合'],
    description: '侧面微距捕捉阻尼活塞缓慢压缩自闭瞬间',
    fileSize: '34.8 MB'
  },
  {
    id: 'vmat-07',
    code: 'B-ROLL-07',
    title: '伦敦肯辛顿独栋别墅全案实景环绕漫游镜头',
    category: 'case',
    categoryLabel: '落地案例',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&auto=format&fit=crop&q=80',
    duration: '00:05',
    aspectRatio: '16:9',
    resolution: '4K 60fps',
    tags: ['#英伦轻奢', '#环绕漫游', '#全屋定制', '#大师空间'],
    description: '手持云台平稳环绕拍摄，展示门墙柜一体化衔接',
    fileSize: '65.4 MB'
  },
  {
    id: 'vmat-08',
    code: 'B-ROLL-08',
    title: '智能智造全自动化板材立体分拣与封箱运输流水线',
    category: 'factory',
    categoryLabel: '工厂智造',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80',
    duration: '00:04',
    aspectRatio: '16:9',
    resolution: '4K 60fps',
    tags: ['#智能仓储', '#机械臂分拣', '#外贸出海标准', '#工厂实景'],
    description: '机械臂高速精准抓取定制板件并完成出口级打包',
    fileSize: '58.0 MB'
  }
];

// --------------------------------------------------------------------------
// Available BGM & Voiceover Presets
// --------------------------------------------------------------------------
export const AVAILABLE_BGM_TRACKS: BgmTrack[] = [
  {
    id: 'bgm-01',
    title: 'Milan Luxury Lifestyle (轻奢高级爵士)',
    genre: 'Neo-Jazz / Minimal',
    bpm: 112,
    duration: '02:45',
    audioMood: '轻奢优雅 · 空间呼吸感'
  },
  {
    id: 'bgm-02',
    title: 'Precision Craftsmanship (硬核工法节奏卡点)',
    genre: 'Electronic Beat',
    bpm: 128,
    duration: '01:50',
    audioMood: '科技动感 · 鼓点精准卡点'
  },
  {
    id: 'bgm-03',
    title: 'Nordic Sunlight Calm (北欧慢调自然声)',
    genre: 'Acoustic Ambient',
    bpm: 96,
    duration: '03:10',
    audioMood: '松弛治愈 · 温暖原木调'
  },
  {
    id: 'bgm-04',
    title: 'Grand Architectural Future (大师建筑交响)',
    genre: 'Orchestral Hybrid',
    bpm: 120,
    duration: '02:15',
    audioMood: '大气磅礴 · 品牌大片感'
  }
];

export const AVAILABLE_VOICEOVERS: VoiceoverConfig[] = [
  {
    speakerId: 'spk-01',
    speakerName: 'James (磁性英音商业男声)',
    style: '沉稳有力 / 国际奢华',
    language: '英文',
    speed: '1.0x 标准'
  },
  {
    speakerId: 'spk-02',
    speakerName: 'Sophia (优雅轻奢美音女声)',
    style: '温和优雅 / 情感种草',
    language: '中英双语',
    speed: '1.05x 适度紧凑'
  },
  {
    speakerId: 'spk-03',
    speakerName: '李工 (20年资深木作工艺师)',
    style: '专业硬核 / 实测解密',
    language: '中文',
    speed: '1.0x 标准'
  },
  {
    speakerId: 'spk-04',
    speakerName: 'Chloe (新潮家居探店博主)',
    style: '热情明快 / 黄金完播',
    language: '中文',
    speed: '1.15x 爆款卡点'
  }
];

// --------------------------------------------------------------------------
// Initial Video Clip Projects (Mirrors Initial Graphic Articles)
// --------------------------------------------------------------------------
export const INITIAL_VIDEO_CLIPS: VideoClipItem[] = [
  {
    id: 'clip-001',
    topic: '2026现代极简橱柜趋势短视频',
    title: '2026现代极简橱柜趋势：PET肤感板与隐形门的质感革命 (15秒爆款版)',
    hookText: '“为什么你花几十万做的高定，开门总有一声闷响？问题就出在隐形轨道的毫厘之差！”',
    summary: '针对海外高净值业主与设计师客群，聚焦PET零度超亚抗指纹实测与4mm磁悬浮吊滑门顺滑滑动，15秒黄金完播节奏剪辑。',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    durationSeconds: 15,
    durationText: '00:15',
    resolution: '4K 60fps',
    publishPlatform: '抖音 / 视频号 / TikTok',
    status: '剪辑中',
    createdAt: '2026-09-08 11:20',
    estimatedViews: '128.5W',
    themeStyle: 'emerald',
    bgmTrack: AVAILABLE_BGM_TRACKS[0],
    voiceover: AVAILABLE_VOICEOVERS[0],
    linkedProducts: ['PET肤感板系列', '吊滑极简门', '德国进口阻尼五金系列'],
    linkedCase: {
      id: 'case-dubai',
      name: '迪拜滨海精装公寓样板房',
      location: '阿联酋 · 迪拜云溪港',
      clipCount: 8
    },
    shots: [
      {
        id: 'shot-1',
        order: 1,
        shotType: '全景推镜',
        timeRange: '00:00 - 00:03',
        startSec: 0,
        endSec: 3,
        previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '低角度仰拍 + 快速向前推进',
        voiceoverScript: '极简不是冰冷的留白，而是触手可及的材质共鸣。',
        subtitles: '「极简高定，在于隐形之间的毫厘之争」',
        captionEffect: '金色高奢发光大字',
        transition: '硬切',
        soundFx: '低频空气爆鸣 (Whoosh)',
        technicalSpec: '3840×2160 全开全景 / 270°自然天光'
      },
      {
        id: 'shot-2',
        order: 2,
        shotType: '硬核实测',
        timeRange: '00:03 - 00:07',
        startSec: 3,
        endSec: 7,
        previewImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '微距微俯拍 + 钢丝球耐磨擦拭实录',
        voiceoverScript: 'PET零度超亚肤感门板，抗指纹耐刮磨，经受五万次钢丝球暴力擦拭零划痕。',
        subtitles: '【零度超亚】50,000次耐刮磨实验室检测背书',
        captionEffect: '红色硬核数据徽标弹入',
        transition: '镜头推拉',
        soundFx: '金属擦拭摩擦质感声',
        technicalSpec: '表面光泽度≤3GU / 莫氏硬度≥3H'
      },
      {
        id: 'shot-3',
        order: 3,
        shotType: '微距特写',
        timeRange: '00:07 - 00:11',
        startSec: 7,
        endSec: 11,
        previewImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '侧向跟焦平移 + 顺滑自吸特写',
        voiceoverScript: '极窄4毫米磁悬浮吊滑门，地面零轨道，磁吸静音自闭合。',
        subtitles: '【磁悬浮天轨】地面无槽 / 50万次顺滑开合',
        captionEffect: '极简白字带呼吸发光',
        transition: '光影闪白',
        soundFx: '高精机械阻尼自吸轻咔嗒声 (Click)',
        technicalSpec: '6063-T6航空铝合金 / 壁厚2.5mm'
      },
      {
        id: 'shot-4',
        order: 4,
        shotType: '细节摇镜',
        timeRange: '00:11 - 00:15',
        startSec: 11,
        endSec: 15,
        previewImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '45°环绕退景 + 品牌Logo光晕淡出',
        voiceoverScript: '佛山智造，直供全球高定豪宅。品爱出海定制，私信获取方案与样品盒。',
        subtitles: '“直供全球豪宅 · 私信定制专属工程清单”',
        captionEffect: '底部品牌呼吁行动条 (CTA)',
        transition: '叠化淡入',
        soundFx: '清脆品牌提示音 (Ding)',
        technicalSpec: '支持全屋门墙柜一体化深化设计与BOM导出'
      }
    ]
  },
  {
    id: 'clip-001b',
    topic: '极简步入式衣帽间与感应光影工法解析',
    title: '极简步入式衣帽间与感应光影工法：隐形泛光与双轨阻尼门实录 (剪映工程已同步)',
    hookText: '“为什么真正的高定衣帽间连一颗螺丝都看不见？隐形挂通与内嵌灯带细节来了！”',
    summary: '已成功导出剪映 Draft 草稿工程文件，包含多轨分层音频、字幕预设与4K工法高光微距片段，支持在剪映电脑端与手机端继续精剪。',
    coverImage: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    durationSeconds: 15,
    durationText: '00:15',
    resolution: '4K 60fps',
    publishPlatform: '抖音 / 视频号 / TikTok',
    status: '已同步到剪映',
    createdAt: '2026-09-08 14:10',
    estimatedViews: '68.3W',
    themeStyle: 'dark',
    bgmTrack: AVAILABLE_BGM_TRACKS[1],
    voiceover: AVAILABLE_VOICEOVERS[1],
    linkedProducts: ['意式极简铝框玻璃门', '吊滑极简门', '全景感应线性灯光系统'],
    linkedCase: {
      id: 'case-singapore',
      name: '新加坡乌节路顶层公寓项目',
      location: '新加坡 · 乌节路核心区',
      clipCount: 6
    },
    shots: [
      {
        id: 'shot-1b-1',
        order: 1,
        shotType: '微距特写',
        timeRange: '00:00 - 00:05',
        startSec: 0,
        endSec: 5,
        previewImage: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '极近微距移向45°斜切隐形导光槽',
        voiceoverScript: '连一颗螺丝都看不见，45度斜切隐形漫反射导光槽，见光不见灯。',
        subtitles: '「45°斜切隐形漫反射泛光 · 零螺丝外露」',
        captionEffect: '高光游走轮廓',
        transition: '硬切',
        soundFx: '灯光轻触音',
        technicalSpec: '3000K低眩光柔光显色指数Ra≥95'
      },
      {
        id: 'shot-1b-2',
        order: 2,
        shotType: '细节摇镜',
        timeRange: '00:05 - 00:10',
        startSec: 5,
        endSec: 10,
        previewImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '轻推双轨阻尼门，体验双向自吸静音闭合',
        voiceoverScript: '德国原装五金阻尼缓冲，手指轻触即可静音平缓复位。',
        subtitles: '【双向阻尼磁悬浮自吸】开合平滑静音',
        captionEffect: '阻尼力度动态标',
        transition: '镜头推拉',
        soundFx: '自吸复位咔哒声',
        technicalSpec: '10万次循环开合耐久测试'
      },
      {
        id: 'shot-1b-3',
        order: 3,
        shotType: '全景推镜',
        timeRange: '00:10 - 00:15',
        startSec: 10,
        endSec: 15,
        previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '平缓退后展示全景衣帽间空间',
        voiceoverScript: '佛山工业4.0智造出海，剪映工程已联动打包，随时开启渲染。',
        subtitles: '“佛山高定出海直供 · 点击咨询全案设计节点”',
        captionEffect: '品牌合作CTA卡片',
        transition: '叠化淡入',
        soundFx: '品牌提示音',
        technicalSpec: '提供英文版深化节点与剪映草稿工程包'
      }
    ]
  },
  {
    id: 'clip-002',
    topic: '海湾高奢工法：迪拜精装大平层落地实录',
    title: '海湾高奢工法：迪拜云溪港精装顶复木作全景 30秒品牌宣传大片',
    hookText: '“在50℃极端海湾湿热气候下，木作如何做到十年不胀不翘、严丝合缝？”',
    summary: '深度展现针对中东高盐雾气候的特殊阻燃与抗变形铝蜂窝门板技术，采用英文画外音强化海外工程信任背书。',
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    durationSeconds: 30,
    durationText: '00:30',
    resolution: '4K 60fps',
    publishPlatform: 'YouTube / 海外官网',
    status: '已发布',
    createdAt: '2026-09-07 16:40',
    estimatedViews: '54.2W',
    themeStyle: 'dark',
    bgmTrack: AVAILABLE_BGM_TRACKS[3],
    voiceover: AVAILABLE_VOICEOVERS[0],
    linkedProducts: ['PET肤感板系列', '岩板岛台台面系统', '意式极简铝框玻璃门'],
    linkedCase: {
      id: 'case-dubai',
      name: '迪拜滨海精装公寓样板房',
      location: '阿联酋 · 迪拜云溪港',
      clipCount: 12
    },
    shots: [
      {
        id: 'shot-2-1',
        order: 1,
        shotType: '全景推镜',
        timeRange: '00:00 - 00:06',
        startSec: 0,
        endSec: 6,
        previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '大范围航拍拉入至迪拜天际线落地窗',
        voiceoverScript: 'In the heart of Dubai Creek Harbour, where extreme coastal climate meets ultra-luxury living.',
        subtitles: '阿联酋迪拜云溪港顶层复式 · 全案门墙柜工程实录',
        captionEffect: '双语国际商务黑金条',
        transition: '硬切',
        soundFx: '低沉远雷声',
        technicalSpec: '耐中东50℃高温高湿特殊工法'
      },
      {
        id: 'shot-2-2',
        order: 2,
        shotType: '微距特写',
        timeRange: '00:06 - 00:14',
        startSec: 6,
        endSec: 14,
        previewImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '慢速微距移向铝蜂窝内芯与激光封边缝隙',
        voiceoverScript: 'Precision engineered with German Homag laser edge-banding and aviation-grade aluminum honeycomb core.',
        subtitles: '德国豪迈激光微米热熔封边 + 航空级铝蜂窝抗变形内胆',
        captionEffect: '3D透视工程参数标签浮现',
        transition: '镜头推拉',
        soundFx: '激光高频扫描音',
        technicalSpec: '0.05mm装配精度公差'
      },
      {
        id: 'shot-2-3',
        order: 3,
        shotType: '细节摇镜',
        timeRange: '00:14 - 00:22',
        startSec: 14,
        endSec: 22,
        previewImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '低角度环绕西厨挑空中岛台与隐藏灯带',
        voiceoverScript: 'Seamless island integration with Mohs-6 sintered stone and 3000K diffused anti-glare ambient lighting.',
        subtitles: '食品级莫氏6级岩板台面 · 3000K低眩光柔光光影系统',
        captionEffect: '光影流转渐变字幕',
        transition: '叠化淡入',
        soundFx: '优雅爵士重音卡点',
        technicalSpec: '耐1200℃明火耐酸碱'
      },
      {
        id: 'shot-2-4',
        order: 4,
        shotType: '升降镜头',
        timeRange: '00:22 - 00:30',
        startSec: 22,
        endSec: 30,
        previewImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '平缓上升后拉，展示整面门墙系统并出标',
        voiceoverScript: 'From Foshan smart manufacturing hub to premier global penthouses. Contact our team for bespoke engineering specifications.',
        subtitles: '佛山工业4.0智造基地 · 开启全球豪宅直供合作',
        captionEffect: '官方合作通道二维码浮现',
        transition: '叠化淡入',
        soundFx: '深邃弦乐尾音',
        technicalSpec: '提供英文版CAD详图与海外海运打包支持'
      }
    ]
  },
  {
    id: 'clip-003',
    topic: '工厂智造解密：德国豪迈激光封边微距实测',
    title: '工厂硬核工法：一根头发丝十分之一的零胶缝封边是如何炼成的？ (20秒竖屏版)',
    hookText: '“普通橱柜用三年受潮发黑，真正的高定为什么水泡三天都不变形？来看这段微距实拍！”',
    summary: '专为抖音与视频号工法科普打造，通过放大镜微距镜头直击封边缝隙，突出德国工业4.0严苛制造水准。',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    durationSeconds: 20,
    durationText: '00:20',
    resolution: '4K 60fps',
    publishPlatform: '抖音 / 视频号 / TikTok',
    status: '发布审核中',
    createdAt: '2026-09-06 09:15',
    estimatedViews: '92.1W',
    themeStyle: 'warm',
    bgmTrack: AVAILABLE_BGM_TRACKS[1],
    voiceover: AVAILABLE_VOICEOVERS[2],
    linkedProducts: ['PET肤感板系列', '德国进口阻尼五金系列'],
    linkedCase: {
      id: 'case-factory',
      name: '品爱佛山工业4.0智造总厂',
      location: '广东 · 佛山南海高新智造园',
      clipCount: 16
    },
    shots: [
      {
        id: 'shot-3-1',
        order: 1,
        shotType: '微距特写',
        timeRange: '00:00 - 00:05',
        startSec: 0,
        endSec: 5,
        previewImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '显微放大镜推入 + 激光光斑游走',
        voiceoverScript: '普通封边有0.3毫米胶缝，而德国豪迈激光封边，将公差压缩到0.05毫米以下。',
        subtitles: '「普通EVA胶缝 vs 豪迈激光微米热熔 显微级对比」',
        captionEffect: '高对比双色标对比',
        transition: '硬切',
        soundFx: '激光蜂鸣音',
        technicalSpec: '零胶缝 / 防潮抗霉渗透率99.9%'
      },
      {
        id: 'shot-3-2',
        order: 2,
        shotType: '全景推镜',
        timeRange: '00:05 - 00:10',
        startSec: 5,
        endSec: 10,
        previewImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '高速穿行无人自动化车间流水线',
        voiceoverScript: '整线无需人工干预，全程红外条码追踪，每块板件都有专属出海数字身份证。',
        subtitles: '工业4.0柔性生产线 · 板件专属数字追溯编码',
        captionEffect: '全息数据流动动态',
        transition: '镜头推拉',
        soundFx: '气缸机械节奏声',
        technicalSpec: '日吞吐量2000平米定制板材'
      },
      {
        id: 'shot-3-3',
        order: 3,
        shotType: '硬核实测',
        timeRange: '00:10 - 00:15',
        startSec: 10,
        endSec: 15,
        previewImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '将封边板材浸入沸水实验槽倒计时',
        voiceoverScript: '100℃沸水蒸煮4小时实测，边缘不脱胶、不膨胀，这就是出口中东和欧美的硬底气。',
        subtitles: '【100℃高温耐沸水蒸煮实测】零膨胀 / 零脱胶',
        captionEffect: '沸水泡泡动态警示框',
        transition: '光影闪白',
        soundFx: '水泡翻滚沸腾声',
        technicalSpec: '通过BS5852与EN717多重环保抗耐性检验'
      },
      {
        id: 'shot-3-4',
        order: 4,
        shotType: '细节摇镜',
        timeRange: '00:15 - 00:20',
        startSec: 15,
        endSec: 20,
        previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '成品样板盒滑入画面，镜头利落定格',
        voiceoverScript: '真材实料不怕微距检验。点击下方链接，为您免费顺丰包邮寄送工艺解剖样板盒。',
        subtitles: '“点击下方链接 · 免费申领高定工艺实体样板盒”',
        captionEffect: '闪烁包裹礼品浮标',
        transition: '叠化淡入',
        soundFx: '包装自粘封口声',
        technicalSpec: '顺丰专线全球直邮送样'
      }
    ]
  },
  {
    id: 'clip-004',
    topic: '意式极简铝框门与隐形五金开合实录',
    title: '意式极简门为何越来越薄？4mm极窄航空铝框与天地隐形铰链解析 (15秒短视频)',
    hookText: '“推拉顺滑到像悬浮在空气里！这扇门到底藏了什么黑科技？”',
    summary: '聚焦超窄铝框、茶玻防爆与天地隐形铰链设计，配合重音卡点展示轻奢私宅的轻盈通透。',
    coverImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    durationSeconds: 15,
    durationText: '00:15',
    resolution: '4K 60fps',
    publishPlatform: '抖音 / 视频号 / TikTok',
    status: '计划发布',
    scheduledPublishTime: '2026-09-12 18:00 (自动定时全平台发布)',
    createdAt: '2026-09-05 15:00',
    estimatedViews: '41.8W',
    themeStyle: 'dark',
    bgmTrack: AVAILABLE_BGM_TRACKS[1],
    voiceover: AVAILABLE_VOICEOVERS[1],
    linkedProducts: ['意式极简铝框玻璃门', '吊滑极简门', '全景感应线性灯光系统'],
    linkedCase: {
      id: 'case-singapore',
      name: '新加坡乌节路顶层公寓项目',
      location: '新加坡 · 乌节路核心区',
      clipCount: 6
    },
    shots: [
      {
        id: 'shot-4-1',
        order: 1,
        shotType: '微距特写',
        timeRange: '00:00 - 00:04',
        startSec: 0,
        endSec: 4,
        previewImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '极近微距聚焦于4mm极窄边框与45°倒角',
        voiceoverScript: '极窄4毫米，几乎感觉不到边框的存在。',
        subtitles: '「4mm航空级极窄铝框 · 天地轴隐形铰链」',
        captionEffect: '高光游走勾勒型材轮廓',
        transition: '硬切',
        soundFx: '轻脆风铃声',
        technicalSpec: '6063航空铝合金 / 阳极氧化亚光黑'
      },
      {
        id: 'shot-4-2',
        order: 2,
        shotType: '细节摇镜',
        timeRange: '00:04 - 00:08',
        startSec: 4,
        endSec: 8,
        previewImage: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '光线穿透灰玻，内置灯带渐次亮起',
        voiceoverScript: '防爆双层夹胶灰玻，通透中兼具隐私与高级氛围。',
        subtitles: '防爆夹胶灰玻 + 3000K暗藏式线性柔光',
        captionEffect: '柔光散开光晕字幕',
        transition: '镜头推拉',
        soundFx: '灯光触碰通电声',
        technicalSpec: '45°斜切隐形泛光灯槽'
      },
      {
        id: 'shot-4-3',
        order: 3,
        shotType: '全景推镜',
        timeRange: '00:08 - 00:15',
        startSec: 8,
        endSec: 15,
        previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '快速向后退镜展现整个步入式衣帽间',
        voiceoverScript: '让空间更通透，让收纳成为风景。品爱出海高定，打造无界极简家。',
        subtitles: '“佛山高定出海直供 · 私信获取全套节点大样图”',
        captionEffect: '金色CTA行动引导卡',
        transition: '叠化淡入',
        soundFx: '清脆自吸锁扣声',
        technicalSpec: '支持任意尺寸1:1定制与结构深化'
      }
    ]
  },
  {
    id: 'clip-005',
    topic: '法式复古高定木作：海外庄园全案实录',
    title: '法式复古全屋木作：弧形实木护墙板与古典罗马柱雕刻工艺',
    hookText: '“手工雕花真的比数控机床更有灵魂吗？带你看豪宅木作的纯手作细节！”',
    summary: '聚焦法式古典实木整装与纯手作擦金工艺，展现经典奢华复古美学与大国工匠精神。',
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    durationSeconds: 30,
    durationText: '00:30',
    resolution: '4K 60fps',
    publishPlatform: 'YouTube / 海外官网',
    status: '审核不通过',
    auditRejectReason: '海外发布平台规范提示：第2个分镜画面中缺少品爱企业官方商标出海合规水印，且BGM未绑定海外版权授权编码，请在微调中补充水印并重新提交发布审核。',
    createdAt: '2026-09-04 10:18',
    estimatedViews: '38.6W',
    themeStyle: 'warm',
    bgmTrack: AVAILABLE_BGM_TRACKS[3],
    voiceover: AVAILABLE_VOICEOVERS[0],
    linkedProducts: ['北美黑胡桃实木护墙', '手工贴金箔线框', '古典罗马柱定制柜'],
    linkedCase: {
      id: 'case-france',
      name: '法国波尔多酒庄私人度假别院',
      location: '法国 · 波尔多',
      clipCount: 10
    },
    shots: [
      {
        id: 'shot-5-1',
        order: 1,
        shotType: '全景推镜',
        timeRange: '00:00 - 00:08',
        startSec: 0,
        endSec: 8,
        previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '双轴轨道前推至实木弧形拱门',
        voiceoverScript: '法式古典的浪漫，源自于历久弥新的木作肌理。',
        subtitles: '「法国波尔多庄园 · 北美黑胡桃全案木作」',
        captionEffect: '复古烫金艺术字',
        transition: '硬切',
        soundFx: '深沉管风琴声',
        technicalSpec: 'FAS级北美黑胡桃原木 / 含水率8%-10%'
      },
      {
        id: 'shot-5-2',
        order: 2,
        shotType: '微距特写',
        timeRange: '00:08 - 00:18',
        startSec: 8,
        endSec: 18,
        previewImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '极近微距跟随老匠人金箔擦拭动作',
        voiceoverScript: '二十道手工打磨擦金工序，每一处雕花弧度皆是时光的雕琢。',
        subtitles: '【24K真金箔手作工艺】非机雕手工微刻',
        captionEffect: '金色闪粉流动光效',
        transition: '镜头推拉',
        soundFx: '柔和砂纸打磨声',
        technicalSpec: '德国开放式环保水性木器漆'
      }
    ]
  },
  {
    id: 'clip-006',
    topic: '工厂打样测试弃用版本（测试留底）',
    title: '【废弃工程】2025早春极简样品间初剪镜头卡点（已移入回收站）',
    hookText: '“早期未调色测试原片，仅作镜头测试库留存。”',
    summary: '测试用粗剪片段工程，包含部分过曝镜头与未授权背景音乐，已废弃归档至回收站。',
    coverImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    durationSeconds: 15,
    durationText: '00:15',
    resolution: '1080P 60fps',
    publishPlatform: '抖音 / 视频号 / TikTok',
    status: '回收站',
    createdAt: '2026-08-20 09:30',
    estimatedViews: '0W',
    themeStyle: 'dark',
    bgmTrack: AVAILABLE_BGM_TRACKS[1],
    voiceover: AVAILABLE_VOICEOVERS[2],
    linkedProducts: ['测试打样板件'],
    linkedCase: {
      id: 'case-test',
      name: '佛山工厂打样车间实验区',
      location: '广东 · 佛山',
      clipCount: 2
    },
    shots: [
      {
        id: 'shot-6-1',
        order: 1,
        shotType: '全景推镜',
        timeRange: '00:00 - 00:15',
        startSec: 0,
        endSec: 15,
        previewImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
        cameraMotion: '固定机位长镜头',
        voiceoverScript: '车间测试原片，未做白平衡校准。',
        subtitles: '【测试工程】',
        captionEffect: '普通灰白字幕',
        transition: '硬切',
        soundFx: '环境杂音',
        technicalSpec: '测试存档'
      }
    ]
  }
];
