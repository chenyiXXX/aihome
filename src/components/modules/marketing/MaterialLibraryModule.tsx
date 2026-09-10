import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Folder,
  FolderPlus,
  FolderOpen,
  Film,
  Image as ImageIcon,
  Music,
  Plus,
  Upload,
  Search,
  Grid,
  List,
  Filter,
  Check,
  CheckSquare,
  Square,
  Play,
  Pause,
  Clock,
  Scissors,
  Download,
  Trash2,
  Tag,
  Star,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info,
  Maximize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  MoreVertical,
  Layers,
  ArrowUpDown,
  X,
  AlertCircle,
  FileVideo,
  FileImage,
  FileAudio,
  Eye,
  Share2,
  Radio,
  MoveRight
} from 'lucide-react';
import { MediaAssetItem, MediaFolderItem, MediaType, AspectRatioType } from '../../../types';

interface MaterialLibraryModuleProps {
  onNavigateToClip?: () => void;
}

// Initial Mock Folders
const initialFolders: MediaFolderItem[] = [
  { id: 'folder-all', name: '全部素材', assetCount: 16, isSystem: true },
  { id: 'folder-fav', name: '⭐ 收藏标星', assetCount: 5, isSystem: true },
  { id: 'folder-showroom', name: '2026轻奢新品展厅实拍', assetCount: 4 },
  { id: 'folder-factory', name: '德国数控机床流水线', assetCount: 3 },
  { id: 'folder-joinery', name: '门墙柜一体实景案例', assetCount: 3 },
  { id: 'folder-overseas', name: '欧美出海混剪爆款库', assetCount: 3 },
  { id: 'folder-hardware', name: '五金配件阻尼特写', assetCount: 2 },
  { id: 'folder-material', name: '材质纹理与色卡高清库', assetCount: 1 },
];

// Initial Rich Mock Assets
const initialAssets: MediaAssetItem[] = [
  {
    id: 'asset-v1',
    code: 'MED-V2026-001',
    title: '2026极简意式悬浮岛台与感应灯带运镜',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-kitchen-interior-with-island-41315-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    duration: '00:14',
    durationSec: 14,
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '4K UHD (2160×3840)',
    fps: 60,
    fileSize: '38.5 MB',
    format: 'MP4',
    folderId: 'folder-showroom',
    folderName: '2026轻奢新品展厅实拍',
    tags: ['#意式轻奢', '#悬浮岛台', '#感应灯带', '#大平层运镜', '#9:16竖屏'],
    usageCount: 4,
    isFavorite: true,
    uploader: '张林 (视觉总监)',
    uploadedAt: '2026-09-02 14:20',
    scenesDetected: ['现代极简厨房', '中岛台大理石台面', '下嵌式隐藏灯槽'],
    colorPalette: ['#1C1D21', '#8C827A', '#EAE6E1'],
    associatedProjects: ['2026意式极简全屋定制宣传片', 'TikTok海外爆款橱柜案例EP01']
  },
  {
    id: 'asset-v2',
    code: 'MED-V2026-002',
    title: '德国豪迈 CNC 封边机激光微米无缝切削',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-moving-in-a-futuristic-factory-43178-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    duration: '00:18',
    durationSec: 18,
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    resolution: '4K UHD (3840×2160)',
    fps: 60,
    fileSize: '45.2 MB',
    format: 'MP4',
    folderId: 'folder-factory',
    folderName: '德国数控机床流水线',
    tags: ['#工厂实拍', '#德国豪迈', '#激光封边', '#工业制造', '#品质背书'],
    usageCount: 2,
    isFavorite: true,
    uploader: '王工 (制造中心)',
    uploadedAt: '2026-09-01 10:15',
    scenesDetected: ['数控高速铣削', '激光热熔封边带', '微米级公差质检'],
    colorPalette: ['#2F3542', '#70A1FF', '#E4E7EB'],
    associatedProjects: ['德国工业4.0制造实力官方纪录片']
  },
  {
    id: 'asset-v3',
    code: 'MED-V2026-003',
    title: '百隆静音阻尼滑轨抽屉 50000 次开合测试特写',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-opening-and-closing-a-kitchen-cabinet-drawer-42998-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    duration: '00:08',
    durationSec: 8,
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '1080P FHD (1080×1920)',
    fps: 60,
    fileSize: '16.4 MB',
    format: 'MP4',
    folderId: 'folder-hardware',
    folderName: '五金配件阻尼特写',
    tags: ['#百隆五金', '#静音阻尼', '#开合特写', '#细节微距', '#短视频卡点'],
    usageCount: 6,
    isFavorite: false,
    uploader: '李晨 (运营策划)',
    uploadedAt: '2026-08-30 16:40',
    scenesDetected: ['抽屉顺滑拉开', '阻尼静音自动回弹', '五金钢印LOGO微距'],
    colorPalette: ['#57606F', '#A4B0BE', '#F1F2F6'],
    associatedProjects: ['五金配件严苛测试合集', '海外TikTok生活细节展示']
  },
  {
    id: 'asset-v4',
    code: 'MED-V2026-004',
    title: '门墙柜一体化极简隐形门推拉推背感运镜',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-corridor-with-wooden-doors-42861-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=80',
    duration: '00:12',
    durationSec: 12,
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '4K UHD (2160×3840)',
    fps: 30,
    fileSize: '29.8 MB',
    format: 'MP4',
    folderId: 'folder-joinery',
    folderName: '门墙柜一体实景案例',
    tags: ['#门墙柜一体', '#隐形门', '#极简无框', '#大平层交付'],
    usageCount: 3,
    isFavorite: true,
    uploader: '张林 (视觉总监)',
    uploadedAt: '2026-08-28 11:10',
    scenesDetected: ['木饰面墙板', '天地轴隐形门旋转', '走廊平齐线条'],
    colorPalette: ['#3A3B3C', '#967D6D', '#DFD8D0'],
    associatedProjects: ['2026大平层高定交付全景混剪']
  },
  {
    id: 'asset-v5',
    code: 'MED-V2026-005',
    title: '爱格环保板材水滴斥水防潮严苛实测',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-water-drops-sliding-down-a-dark-surface-42994-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    duration: '00:10',
    durationSec: 10,
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '1080P FHD',
    fps: 60,
    fileSize: '22.1 MB',
    format: 'MP4',
    folderId: 'folder-material',
    folderName: '材质纹理与色卡高清库',
    tags: ['#爱格板', '#防潮防水', '#耐磨防刮', '#环保实测'],
    usageCount: 1,
    isFavorite: false,
    uploader: '质检科小赵',
    uploadedAt: '2026-08-25 09:30',
    scenesDetected: ['水滴荷叶效应斥水', '钢丝球刮擦无痕', '截面实木颗粒紧密'],
    colorPalette: ['#1E272E', '#485460', '#D2DAE2'],
    associatedProjects: ['板材耐用度硬核科普']
  },
  {
    id: 'asset-v6',
    code: 'MED-V2026-006',
    title: '豪宅主卧通顶玻璃衣柜与内置皮革收纳格特写',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-walk-in-closet-with-glass-doors-42862-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=600&auto=format&fit=crop&q=80',
    duration: '00:22',
    durationSec: 22,
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '4K UHD',
    fps: 60,
    fileSize: '56.7 MB',
    format: 'MP4',
    folderId: 'folder-showroom',
    folderName: '2026轻奢新品展厅实拍',
    tags: ['#玻璃衣柜', '#皮革抽屉', '#首饰收纳', '#意式高定'],
    usageCount: 5,
    isFavorite: true,
    uploader: '张林 (视觉总监)',
    uploadedAt: '2026-08-20 17:00',
    scenesDetected: ['茶色钢化玻璃反光', '真皮首饰格盘展示', '层板感应微光'],
    colorPalette: ['#2F3640', '#718093', '#F5F6FA'],
    associatedProjects: ['2026衣帽间新品巡展短视频']
  },
  {
    id: 'asset-v7',
    code: 'MED-V2026-007',
    title: '7秒黄金Hook开头：全景快速拉近至开放式西厨岛台',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-open-plan-apartment-living-room-41316-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80',
    duration: '00:06',
    durationSec: 6,
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '4K 60fps',
    fps: 60,
    fileSize: '15.3 MB',
    format: 'MP4',
    folderId: 'folder-overseas',
    folderName: '欧美出海混剪爆款库',
    tags: ['#黄金7秒', '#高完播率', '#转场Hook', '#出海爆款'],
    usageCount: 9,
    isFavorite: true,
    uploader: '李晨 (运营策划)',
    uploadedAt: '2026-08-18 14:00',
    scenesDetected: ['客厅至西厨快速穿梭', '高动态范围光影', '视觉冲击力开头'],
    colorPalette: ['#192A56', '#487EB0', '#F5CD79'],
    associatedProjects: ['海外TikTok高点击短视频EP01-EP05']
  },
  {
    id: 'asset-v8',
    code: 'MED-V2026-008',
    title: '意大利全自动水性UV漆连续光固化涂装流水线',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-industrial-machine-operating-smoothly-in-a-warehouse-42995-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&auto=format&fit=crop&q=80',
    duration: '00:16',
    durationSec: 16,
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    resolution: '4K UHD (3840×2160)',
    fps: 30,
    fileSize: '41.0 MB',
    format: 'MP4',
    folderId: 'folder-factory',
    folderName: '德国数控机床流水线',
    tags: ['#UV光固化', '#环保涂装', '#智能智造', '#质感漆面'],
    usageCount: 0,
    isFavorite: false,
    uploader: '王工 (制造中心)',
    uploadedAt: '2026-08-15 11:20',
    scenesDetected: ['滚涂平整漆膜', '紫外线光固化灯区', '漆面如镜倒影'],
    colorPalette: ['#353B48', '#7F8FA6', '#F5F6FA'],
    associatedProjects: []
  },

  // Image Assets
  {
    id: 'asset-p1',
    code: 'MED-P2026-101',
    title: '极简奶油风全屋定制客餐厅 4K 渲染效果图',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    resolution: '3840×2160',
    fileSize: '6.8 MB',
    format: 'JPG',
    folderId: 'folder-showroom',
    folderName: '2026轻奢新品展厅实拍',
    tags: ['#奶油风', '#客餐厅一体', '#悬空电视柜', '#3D渲染'],
    usageCount: 3,
    isFavorite: true,
    uploader: '陈工 (空间设计)',
    uploadedAt: '2026-09-03 10:00',
    scenesDetected: ['弧形转角柜', '一体式无拉手收纳', '柔和温润暖光'],
    colorPalette: ['#EADBCE', '#C5B5A5', '#7F7469'],
    associatedProjects: ['小红书图文：为什么2026年全屋定制都在选奶油风']
  },
  {
    id: 'asset-p2',
    code: 'MED-P2026-102',
    title: '欧洲进口天然橡木木皮拉丝自然山纹质感特写',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=600&auto=format&fit=crop&q=80',
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '2160×3840',
    fileSize: '5.2 MB',
    format: 'PNG',
    folderId: 'folder-material',
    folderName: '材质纹理与色卡高清库',
    tags: ['#天然木皮', '#山纹特写', '#原木触感', '#极简肌理'],
    usageCount: 2,
    isFavorite: false,
    uploader: '质检科小赵',
    uploadedAt: '2026-09-02 15:40',
    scenesDetected: ['立体钢刷木纹', '自然原木节疤与纹理', '哑光触感漆膜'],
    colorPalette: ['#9C7A58', '#4E3824', '#DBC3A3'],
    associatedProjects: ['实木整家材质手册']
  },
  {
    id: 'asset-p3',
    code: 'MED-P2026-103',
    title: '嵌入式冰箱与定制高柜平嵌对齐实景细节',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&auto=format&fit=crop&q=80',
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '2160×3840',
    fileSize: '4.7 MB',
    format: 'JPG',
    folderId: 'folder-joinery',
    folderName: '门墙柜一体实景案例',
    tags: ['#平嵌冰箱', '#高柜收纳', '#严丝合缝', '#安装工艺'],
    usageCount: 0,
    isFavorite: false,
    uploader: '张林 (视觉总监)',
    uploadedAt: '2026-08-29 11:30',
    scenesDetected: ['2mm微缝对齐', '底部散热专利格栅', '同色门板贴面'],
    colorPalette: ['#2F3640', '#718093', '#ECEFF1'],
    associatedProjects: []
  },
  {
    id: 'asset-p4',
    code: 'MED-P2026-104',
    title: '2026米兰高定色卡矩阵：哑光金属、真皮与岩板组合',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    resolution: '3840×2160',
    fileSize: '7.5 MB',
    format: 'WEBP',
    folderId: 'folder-showroom',
    folderName: '2026轻奢新品展厅实拍',
    tags: ['#高定色卡', '#岩板台面', '#金属拉手', '#设计美学'],
    usageCount: 4,
    isFavorite: true,
    uploader: '陈工 (空间设计)',
    uploadedAt: '2026-08-27 16:20',
    scenesDetected: ['多色板拼接展示', '灯光漫反射质感', '高端五金选配'],
    colorPalette: ['#2C3E50', '#BDC3C7', '#E67E22'],
    associatedProjects: ['海外高端B2B经销商画册', 'Pinterest灵感板']
  },
  {
    id: 'asset-p5',
    code: 'MED-P2026-105',
    title: '大平层全案完工实景摄影：悬浮玄关柜与入户端景',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&auto=format&fit=crop&q=80',
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    resolution: '2160×3840',
    fileSize: '8.1 MB',
    format: 'JPG',
    folderId: 'folder-joinery',
    folderName: '门墙柜一体实景案例',
    tags: ['#玄关柜', '#入户端景', '#完工实拍', '#客户实景'],
    usageCount: 3,
    isFavorite: true,
    uploader: '张林 (视觉总监)',
    uploadedAt: '2026-08-24 09:15',
    scenesDetected: ['悬浮鞋柜底部留空', '换鞋凳一体设计', '木饰面墙板无缝过渡'],
    colorPalette: ['#23272A', '#7289DA', '#FFFFFF'],
    associatedProjects: ['Instagram高赞案例实录']
  },

  // Audio Assets
  {
    id: 'asset-a1',
    code: 'MED-A2026-201',
    title: '意式极简展厅轻奢高级感 Ambient 卡点 BGM',
    type: 'audio',
    url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    duration: '00:30',
    durationSec: 30,
    aspectRatio: 'other',
    fileSize: '2.4 MB',
    format: 'MP3',
    folderId: 'folder-overseas',
    folderName: '欧美出海混剪爆款库',
    tags: ['#高级BGM', '#轻奢卡点', '#环境氛围音', '#短视频配乐'],
    usageCount: 8,
    isFavorite: true,
    uploader: '李晨 (运营策划)',
    uploadedAt: '2026-09-01 18:00',
    associatedProjects: ['2026品牌宣传片', '短视频配乐模版']
  },
  {
    id: 'asset-a2',
    code: 'MED-A2026-202',
    title: '五金抽屉推入自吸锁紧“咔嗒”高保真清脆声效',
    type: 'audio',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-wood-hard-pop-hit-3122.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    duration: '00:02',
    durationSec: 2,
    aspectRatio: 'other',
    fileSize: '0.4 MB',
    format: 'WAV',
    folderId: 'folder-hardware',
    folderName: '五金配件阻尼特写',
    tags: ['#音效', '#清脆阻尼', '#开合声音', '#微距特写音'],
    usageCount: 5,
    isFavorite: false,
    uploader: '李晨 (运营策划)',
    uploadedAt: '2026-08-28 14:30',
    associatedProjects: ['五金静音特写Shorts']
  },
  {
    id: 'asset-a3',
    code: 'MED-A2026-203',
    title: '快节奏短视频混剪卡点节奏乐 (节奏鼓点)',
    type: 'audio',
    url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    duration: '00:15',
    durationSec: 15,
    aspectRatio: 'other',
    fileSize: '1.2 MB',
    format: 'MP3',
    folderId: 'folder-overseas',
    folderName: '欧美出海混剪爆款库',
    tags: ['#快剪鼓点', '#15秒Hook', '#高完播配乐'],
    usageCount: 7,
    isFavorite: true,
    uploader: '李晨 (运营策划)',
    uploadedAt: '2026-08-22 10:20',
    associatedProjects: ['7秒完播率混剪工程']
  }
];

export const MaterialLibraryModule: React.FC<MaterialLibraryModuleProps> = ({ onNavigateToClip }) => {
  // Folders & Assets State
  const [folders, setFolders] = useState<MediaFolderItem[]>(initialFolders);
  const [assets, setAssets] = useState<MediaAssetItem[]>(initialAssets);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('folder-all');

  // Filters State
  const [selectedType, setSelectedType] = useState<'all' | MediaType>('all');
  const [selectedAspect, setSelectedAspect] = useState<'all' | AspectRatioType>('all');
  const [selectedResolution, setSelectedResolution] = useState<string>('all');
  const [selectedDurationRange, setSelectedDurationRange] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'usage_desc' | 'size_desc' | 'duration_desc'>('date_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState<boolean>(false);

  // Hover Scrub State
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);
  const [hoverProgress, setHoverProgress] = useState<number>(0);

  // Clip Basket / Selection for Video Remix (混剪托盘)
  const [basketAssets, setBasketAssets] = useState<MediaAssetItem[]>([]);
  const [isBasketOpen, setIsBasketOpen] = useState<boolean>(false);

  // Deep Preview & In/Out Trimmer Modal
  const [previewModalAsset, setPreviewModalAsset] = useState<MediaAssetItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [markIn, setMarkIn] = useState<number>(0);
  const [markOut, setMarkOut] = useState<number>(10);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTargetFolder, setUploadTargetFolder] = useState<string>('folder-showroom');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // New Folder Modal State
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');

  // Audio Playback in card preview
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Calculate dynamic counts
  const counts = useMemo(() => {
    const total = assets.length;
    const video = assets.filter((a) => a.type === 'video').length;
    const image = assets.filter((a) => a.type === 'image').length;
    const audio = assets.filter((a) => a.type === 'audio').length;
    const fav = assets.filter((a) => a.isFavorite).length;
    return { total, video, image, audio, fav };
  }, [assets]);

  // Filtered and Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        // Folder check
        if (selectedFolderId === 'folder-fav') {
          if (!asset.isFavorite) return false;
        } else if (selectedFolderId !== 'folder-all') {
          if (asset.folderId !== selectedFolderId) return false;
        }

        // Favorite Toggle Filter
        if (filterFavoriteOnly && !asset.isFavorite) return false;

        // Type check
        if (selectedType !== 'all' && asset.type !== selectedType) return false;

        // Aspect check
        if (selectedAspect !== 'all' && asset.aspectRatio !== selectedAspect) return false;

        // Resolution check
        if (selectedResolution !== 'all') {
          if (selectedResolution === '4k' && !asset.resolution?.includes('4K')) return false;
          if (selectedResolution === '1080p' && !asset.resolution?.includes('1080P')) return false;
        }

        // Duration check
        if (selectedDurationRange !== 'all' && asset.durationSec !== undefined) {
          if (selectedDurationRange === 'short' && asset.durationSec > 7) return false; // 0-7s
          if (selectedDurationRange === 'medium' && (asset.durationSec <= 7 || asset.durationSec > 15)) return false; // 7-15s
          if (selectedDurationRange === 'long' && asset.durationSec <= 15) return false; // 15s+
        }

        // Search check
        if (searchKeyword.trim()) {
          const kw = searchKeyword.toLowerCase();
          const matchTitle = asset.title.toLowerCase().includes(kw);
          const matchCode = asset.code.toLowerCase().includes(kw);
          const matchTags = asset.tags.some((t) => t.toLowerCase().includes(kw));
          const matchFolder = asset.folderName.toLowerCase().includes(kw);
          if (!matchTitle && !matchCode && !matchTags && !matchFolder) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'usage_desc') {
          return b.usageCount - a.usageCount;
        }
        if (sortBy === 'duration_desc') {
          return (b.durationSec || 0) - (a.durationSec || 0);
        }
        if (sortBy === 'size_desc') {
          return parseFloat(b.fileSize) - parseFloat(a.fileSize);
        }
        // date_desc
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      });
  }, [
    assets,
    selectedFolderId,
    filterFavoriteOnly,
    selectedType,
    selectedAspect,
    selectedResolution,
    selectedDurationRange,
    searchKeyword,
    sortBy
  ]);

  // Handle Toggle Star / Favorite
  const handleToggleFavorite = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssets((prev) =>
      prev.map((item) =>
        item.id === assetId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // Add / Remove from Clip Basket
  const handleToggleBasket = (asset: MediaAssetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBasketAssets((prev) => {
      const exists = prev.some((item) => item.id === asset.id);
      if (exists) {
        return prev.filter((item) => item.id !== asset.id);
      } else {
        return [...prev, asset];
      }
    });
  };

  // Open Detailed Preview & Trimmer Modal
  const handleOpenPreviewModal = (asset: MediaAssetItem) => {
    setPreviewModalAsset(asset);
    setIsPlaying(false);
    setCurrentTime(0);
    setMarkIn(0);
    setMarkOut(asset.durationSec || 10);
  };

  // Video Time Update in Modal
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Toggle Video Play/Pause in Modal
  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Set Mark In (入点)
  const handleSetMarkIn = () => {
    if (videoRef.current) {
      const now = Math.min(videoRef.current.currentTime, markOut - 1);
      setMarkIn(Math.max(0, parseFloat(now.toFixed(1))));
    }
  };

  // Set Mark Out (出点)
  const handleSetMarkOut = () => {
    if (videoRef.current) {
      const maxDur = previewModalAsset?.durationSec || 10;
      const now = Math.max(videoRef.current.currentTime, markIn + 1);
      setMarkOut(Math.min(maxDur, parseFloat(now.toFixed(1))));
    }
  };

  // Jump to Time
  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Handle Create Folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newId = `folder-${Date.now()}`;
    const newFolder: MediaFolderItem = {
      id: newId,
      name: newFolderName.trim(),
      assetCount: 0,
      isSystem: false
    };
    setFolders((prev) => [...prev, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
    setSelectedFolderId(newId);
  };

  // Simulate File Upload
  const handleSimulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const timer = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 90) {
          clearInterval(timer);
          setTimeout(() => {
            setIsUploading(false);
            setShowUploadModal(false);
            // Add a mock new asset
            const createdAsset: MediaAssetItem = {
              id: `asset-new-${Date.now()}`,
              code: `MED-V2026-${Math.floor(100 + Math.random() * 900)}`,
              title: '新品激光雕刻与大平层门板平整度高精检测 (刚上传)',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-opening-and-closing-a-kitchen-cabinet-drawer-42998-large.mp4',
              thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
              duration: '00:15',
              durationSec: 15,
              width: 2160,
              height: 3840,
              aspectRatio: '9:16',
              resolution: '4K UHD (2160×3840)',
              fps: 60,
              fileSize: '32.6 MB',
              format: 'MP4',
              folderId: uploadTargetFolder,
              folderName: folders.find((f) => f.id === uploadTargetFolder)?.name || '未分组',
              tags: ['#高精检测', '#刚上传', '#4K超清', '#智能质检'],
              usageCount: 0,
              isFavorite: true,
              uploader: '当前登录运营员',
              uploadedAt: '刚刚',
              scenesDetected: ['激光扫平标线', '平整度微米检测'],
              colorPalette: ['#1C1D21', '#4A90E2']
            };
            setAssets((prev) => [createdAsset, ...prev]);
            // Update folder count
            setFolders((prev) =>
              prev.map((f) =>
                f.id === uploadTargetFolder ? { ...f, assetCount: f.assetCount + 1 } : f
              )
            );
          }, 400);
          return 100;
        }
        return p + 25;
      });
    }, 200);
  };

  // Audio Play toggle
  const handleTogglePlayAudio = (asset: MediaAssetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingAudioId === asset.id) {
      audioPreviewRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(asset.id);
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = asset.url;
        audioPreviewRef.current.play().catch(() => {});
      }
    }
  };

  // Calculate total duration in basket
  const totalBasketDurationSec = useMemo(() => {
    return basketAssets.reduce((acc, curr) => acc + (curr.durationSec || 5), 0);
  }, [basketAssets]);

  const formatSecToMinSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  return (
    <div id="material-library-module" className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden p-3 lg:p-4">
      {/* Hidden audio element for instant preview */}
      <audio
        ref={audioPreviewRef}
        onEnded={() => setPlayingAudioId(null)}
        className="hidden"
      />

      {/* Main Dual-Column Layout: Left Folders + Right Asset Workspace */}
      <div className="flex-1 flex gap-3.5 lg:gap-4 overflow-hidden min-h-0">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Folders / Bins Tree Panel                                     */}
        {/* ========================================================================= */}
        <div className="w-64 md:w-72 shrink-0 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Header */}
          <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold">
                <FolderOpen className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">素材箱目录 (Bins)</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowNewFolderModal(true)}
              className="h-7 px-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="新建素材箱/分组"
            >
              <FolderPlus className="w-3.5 h-3.5 text-slate-600" />
              <span>新建</span>
            </button>
          </div>

          {/* Quick Storage Meter */}
          <div className="px-4 py-2.5 bg-[#0F4A47]/5 border-b border-slate-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Layers className="w-3.5 h-3.5 text-[#0F4A47]" />
              <span>云端素材库容量</span>
            </div>
            <span className="font-mono font-bold text-[#0F4A47]">3.8 GB / 100 GB</span>
          </div>

          {/* Folder List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
            {folders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full px-3 py-2 rounded-2xl flex items-center justify-between text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0F4A47] text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Folder
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {folder.id === 'folder-all'
                      ? counts.total
                      : folder.id === 'folder-fav'
                      ? counts.fav
                      : assets.filter((a) => a.folderId === folder.id).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Left Footer Info */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500 flex items-center justify-between">
            <span>支持混剪直接裁切调用</span>
            <span className="inline-flex items-center gap-1 text-[#EA3A20] font-bold">
              <Sparkles className="w-3 h-3" /> AI 标签增强
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Media Assets Browser & Management Workspace                  */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden min-w-0">
          
          {/* Top Control Bar: Search, Upload Button, Category Tabs */}
          <div className="p-3.5 px-4 border-b border-slate-100 bg-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Type Category Pills */}
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
                {[
                  { key: 'all' as const, label: '全部素材', count: counts.total, icon: Layers },
                  { key: 'video' as const, label: '视频片段 (B-Roll)', count: counts.video, icon: Film },
                  { key: 'image' as const, label: '高清图片/渲染', count: counts.image, icon: ImageIcon },
                  { key: 'audio' as const, label: '音效 & BGM', count: counts.audio, icon: Music }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = selectedType === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setSelectedType(tab.key)}
                      className={`h-7 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        active
                          ? 'bg-[#EA3A20] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          active ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-500'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Action Buttons: Batch Upload & Open Basket */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="h-8 px-3.5 rounded-full bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ 批量上传素材</span>
                </button>

                {basketAssets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsBasketOpen(!isBasketOpen)}
                    className="h-8 px-3 rounded-full bg-[#0F4A47] hover:bg-[#0b3836] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>混剪托盘 ({basketAssets.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Second Row: Detailed Filters, Search, Aspect Ratio, Resolution & View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              
              {/* Left Filters Group */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Box */}
                <div className="relative w-56 lg:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="按名称、标签或 #关键词 检索..."
                    className="h-7.5 pl-8.5 pr-7 w-full rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] focus:border-[#EA3A20]"
                  />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Aspect Ratio Filter */}
                <select
                  value={selectedAspect}
                  onChange={(e) => setSelectedAspect(e.target.value as any)}
                  className="h-7.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="all">全部画幅比例</option>
                  <option value="9:16">📱 9:16 竖屏 (Reels/Shorts)</option>
                  <option value="16:9">🖥️ 16:9 横屏 (YouTube/官网)</option>
                  <option value="1:1">⏹️ 1:1 方形 (Instagram)</option>
                </select>

                {/* Duration Filter */}
                <select
                  value={selectedDurationRange}
                  onChange={(e) => setSelectedDurationRange(e.target.value)}
                  className="h-7.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="all">全部镜头时长</option>
                  <option value="short">⚡ 0~7秒 (卡点/转场Hook)</option>
                  <option value="medium">⏱️ 7~15秒 (产品核心卖点)</option>
                  <option value="long">🎬 15秒+ (完整工艺讲解)</option>
                </select>

                {/* Resolution Filter */}
                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="h-7.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="all">全部分辨率</option>
                  <option value="4k">4K UHD 超高清</option>
                  <option value="1080p">1080P 全高清</option>
                </select>

                {/* Favorite Star Toggle Button */}
                <button
                  type="button"
                  onClick={() => setFilterFavoriteOnly(!filterFavoriteOnly)}
                  className={`h-7.5 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    filterFavoriteOnly
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${filterFavoriteOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                  <span>仅看星标</span>
                </button>
              </div>

              {/* Right View & Sort Controls */}
              <div className="flex items-center gap-2">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-7.5 px-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                  >
                    <option value="date_desc">按上传时间最新</option>
                    <option value="usage_desc">按混剪引用次数</option>
                    <option value="duration_desc">按时长从长到短</option>
                    <option value="size_desc">按文件大小排序</option>
                  </select>
                </div>

                {/* Grid / List Switcher */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="网格平铺视图"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="详细表格视图"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* ASSETS DISPLAY AREA (Grid / List)                                         */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/40">
            {filteredAssets.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Film className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">没有找到符合条件的素材</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  可尝试调整筛选标签、切换素材箱目录或清空搜索关键字。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedAspect('all');
                    setSelectedResolution('all');
                    setSelectedDurationRange('all');
                    setSearchKeyword('');
                    setFilterFavoriteOnly(false);
                    setSelectedFolderId('folder-all');
                  }}
                  className="mt-4 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  重置所有筛选
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                {filteredAssets.map((asset) => {
                  const isInBasket = basketAssets.some((b) => b.id === asset.id);
                  const isHovered = hoveredAssetId === asset.id;

                  return (
                    <div
                      key={asset.id}
                      onClick={() => handleOpenPreviewModal(asset)}
                      onMouseEnter={() => setHoveredAssetId(asset.id)}
                      onMouseLeave={() => {
                        setHoveredAssetId(null);
                        setHoverProgress(0);
                      }}
                      onMouseMove={(e) => {
                        if (asset.type === 'video') {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
                          setHoverProgress(percent);
                        }
                      }}
                      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col relative shadow-2xs hover:shadow-md ${
                        isInBasket
                          ? 'border-[#0F4A47] ring-2 ring-[#0F4A47]/20 bg-slate-50/50'
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Media Thumbnail & Badges Container */}
                      <div className="relative aspect-16/10 bg-slate-900 overflow-hidden shrink-0">
                        <img
                          src={asset.thumbnail}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Hover Scrub Simulation Bar for Videos */}
                        {asset.type === 'video' && isHovered && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40 z-20">
                            <div
                              className="h-full bg-[#EA3A20]"
                              style={{ width: `${Math.round(hoverProgress * 100)}%` }}
                            />
                          </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                        {/* Top-Left: Resolution & FPS Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                          {asset.type === 'video' ? (
                            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-bold border border-white/10">
                              {asset.resolution?.includes('4K') ? '4K 60FPS' : '1080P'}
                            </span>
                          ) : asset.type === 'image' ? (
                            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-bold border border-white/10">
                              {asset.format}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-900/80 backdrop-blur-xs text-indigo-200 text-[9px] font-mono font-bold border border-indigo-400/20">
                              AUDIO
                            </span>
                          )}

                          {/* Aspect Ratio Badge */}
                          {asset.aspectRatio !== 'other' && (
                            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-slate-200 text-[9px] font-mono font-bold border border-white/10">
                              {asset.aspectRatio}
                            </span>
                          )}
                        </div>

                        {/* Top-Right: Star Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(asset.id, e)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center cursor-pointer transition-colors z-10"
                          title={asset.isFavorite ? '取消标星' : '标星收藏'}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              asset.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-white/80'
                            }`}
                          />
                        </button>

                        {/* Bottom-Left: Type Icon & Duration / Dimensions */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 z-10">
                          {asset.type === 'video' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                              <Film className="w-2.5 h-2.5 text-red-400" />
                              {asset.duration}
                            </span>
                          ) : asset.type === 'image' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono">
                              <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
                              {asset.resolution}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleTogglePlayAudio(asset, e)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EA3A20] text-white text-[10px] font-mono font-bold shadow-xs cursor-pointer"
                            >
                              {playingAudioId === asset.id ? (
                                <>
                                  <Pause className="w-2.5 h-2.5" />
                                  <span>暂停</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-2.5 h-2.5 fill-white" />
                                  <span>试听 ({asset.duration})</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Bottom-Right: Quick Add to Remix Basket Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleBasket(asset, e)}
                          className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs z-10 ${
                            isInBasket
                              ? 'bg-[#0F4A47] text-white'
                              : 'bg-white/90 hover:bg-white text-slate-800'
                          }`}
                          title={isInBasket ? '从混剪托盘移除' : '加入混剪托盘'}
                        >
                          {isInBasket ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>已入剪辑</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>+ 混剪</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Card Content Information */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-[10px] text-slate-400 font-mono">{asset.code}</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                              {asset.folderName}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-[#EA3A20] transition-colors">
                            {asset.title}
                          </h4>
                        </div>

                        {/* Tags Pill Row */}
                        <div className="flex flex-wrap gap-1 items-center">
                          {asset.tags.slice(0, 2).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {asset.tags.length > 2 && (
                            <span className="text-[9px] text-slate-400 font-mono">
                              +{asset.tags.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Footer Row: Usage count and size */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>
                            {asset.usageCount > 0 ? (
                              <strong className="text-[#0F4A47]">已混剪 {asset.usageCount} 次</strong>
                            ) : (
                              <span className="text-slate-400">未被引用</span>
                            )}
                          </span>
                          <span className="font-mono text-slate-400">{asset.fileSize}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold text-[11px]">
                      <th className="py-2.5 pl-4 pr-2 w-10 text-center">选择</th>
                      <th className="py-2.5 px-3">素材缩略图 & 标题</th>
                      <th className="py-2.5 px-3">类型 / 编码</th>
                      <th className="py-2.5 px-3">比例与画质</th>
                      <th className="py-2.5 px-3">时长 / 文件大小</th>
                      <th className="py-2.5 px-3">所属素材箱</th>
                      <th className="py-2.5 px-3 text-center">混剪引用</th>
                      <th className="py-2.5 px-3">上传人 & 时间</th>
                      <th className="py-2.5 pr-4 pl-2 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAssets.map((asset) => {
                      const isInBasket = basketAssets.some((b) => b.id === asset.id);
                      return (
                        <tr
                          key={asset.id}
                          onClick={() => handleOpenPreviewModal(asset)}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            isInBasket ? 'bg-[#0F4A47]/5' : ''
                          }`}
                        >
                          <td className="py-3 pl-4 pr-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleToggleBasket(asset)}
                              className="text-slate-400 hover:text-[#0F4A47] cursor-pointer"
                            >
                              {isInBasket ? (
                                <CheckSquare className="w-4 h-4 text-[#0F4A47]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          {/* Thumbnail & Title */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 relative">
                                <img
                                  src={asset.thumbnail}
                                  alt={asset.title}
                                  className="w-full h-full object-cover"
                                />
                                {asset.type === 'video' && (
                                  <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/70 text-white text-[8px] font-mono rounded">
                                    {asset.duration}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-bold text-slate-900 hover:text-[#EA3A20] transition-colors truncate max-w-xs md:max-w-md">
                                  {asset.title}
                                </h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {asset.tags.slice(0, 3).map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Type & Code */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              {asset.type === 'video' ? (
                                <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold">
                                  视频
                                </span>
                              ) : asset.type === 'image' ? (
                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">
                                  图片
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold">
                                  音频
                                </span>
                              )}
                              <span className="font-mono text-slate-500 text-[11px]">{asset.code}</span>
                            </div>
                          </td>

                          {/* Aspect & Resolution */}
                          <td className="py-3 px-3">
                            <div className="text-slate-700 font-medium">
                              <span className="font-mono font-bold">{asset.aspectRatio}</span>
                              <span className="text-slate-400 mx-1">·</span>
                              <span className="text-slate-500">{asset.resolution || asset.format}</span>
                            </div>
                          </td>

                          {/* Duration & Size */}
                          <td className="py-3 px-3 font-mono text-slate-600">
                            <div>{asset.duration || '-'}</div>
                            <div className="text-[10px] text-slate-400">{asset.fileSize}</div>
                          </td>

                          {/* Folder */}
                          <td className="py-3 px-3 text-slate-600">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium">
                              <Folder className="w-3 h-3 text-slate-400" />
                              {asset.folderName}
                            </span>
                          </td>

                          {/* Usage Count */}
                          <td className="py-3 px-3 text-center">
                            {asset.usageCount > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                {asset.usageCount} 次
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">未使用</span>
                            )}
                          </td>

                          {/* Uploader & Date */}
                          <td className="py-3 px-3 text-slate-500 text-[11px]">
                            <div>{asset.uploader}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{asset.uploadedAt}</div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 pr-4 pl-2 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleBasket(asset)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                  isInBasket
                                    ? 'bg-[#0F4A47] text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {isInBasket ? '已选入' : '+ 混剪'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenPreviewModal(asset)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                                title="查看详情"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Bar: Item Count & Legend */}
          <div className="p-3 px-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-3">
              <span>共找到 <strong>{filteredAssets.length}</strong> 项素材</span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                已准备就绪，支持一键载入视频剪辑工程
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">已勾选混剪片段：{basketAssets.length} 个</span>
              {basketAssets.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBasketAssets([])}
                  className="text-xs text-[#EA3A20] hover:underline cursor-pointer"
                >
                  清空托盘
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* FLOATING CLIP BASKET TRAY (底部浮动混剪抽屉托盘)                             */}
      {/* ========================================================================= */}
      {basketAssets.length > 0 && (
        <div
          id="remix-basket-tray"
          className="fixed bottom-6 right-8 z-40 bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-slate-200 p-3.5 max-w-xl w-full animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#0F4A47] text-white flex items-center justify-center font-bold text-xs">
                <Film className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">
                混剪制作托盘 ({basketAssets.length} 个镜头片段)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold">
                预估总长: {formatSecToMinSec(totalBasketDurationSec)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsBasketOpen(!isBasketOpen)}
              className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {isBasketOpen ? '收起序列' : '展开序列'}
            </button>
          </div>

          {/* Sequence Thumbnails Strip */}
          {isBasketOpen && (
            <div className="py-2.5 flex items-center gap-2 overflow-x-auto custom-scrollbar">
              {basketAssets.map((clip, idx) => (
                <div
                  key={clip.id}
                  className="relative group shrink-0 w-20 h-14 rounded-xl bg-slate-900 overflow-hidden border border-slate-200"
                >
                  <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/70 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="absolute bottom-1 right-1 px-1 bg-black/70 text-white text-[8px] font-mono rounded">
                    {clip.duration || '00:05'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleBasket(clip)}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="移出"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500">
              已将所选片段标记入点与出点
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBasketAssets([])}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                清空
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToClip) {
                    onNavigateToClip();
                  } else {
                    alert(`已将 ${basketAssets.length} 个镜头载入 AI 视频剪辑工程！`);
                  }
                }}
                className="px-4 py-1.5 rounded-full bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>🎬 一键载入视频剪辑工程</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEEP PREVIEW & IN/OUT TRIMMER MODAL (深度预览与打点剪辑弹窗)                 */}
      {/* ========================================================================= */}
      {previewModalAsset && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 lg:p-6 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold">
                  {previewModalAsset.type === 'video' ? (
                    <Film className="w-4 h-4" />
                  ) : previewModalAsset.type === 'image' ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <Music className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{previewModalAsset.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                    <span>{previewModalAsset.code}</span>
                    <span>·</span>
                    <span>{previewModalAsset.folderName}</span>
                    <span>·</span>
                    <span>{previewModalAsset.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleBasket(previewModalAsset)}
                  className={`h-8 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    basketAssets.some((b) => b.id === previewModalAsset.id)
                      ? 'bg-[#0F4A47] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {basketAssets.some((b) => b.id === previewModalAsset.id)
                      ? '已加入混剪'
                      : '加入混剪托盘'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewModalAsset(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split into Player (Left) + Metadata Inspector (Right) */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              
              {/* Left Player Area */}
              <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {previewModalAsset.type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center max-h-[500px]">
                    <video
                      ref={videoRef}
                      src={previewModalAsset.url}
                      poster={previewModalAsset.thumbnail}
                      onTimeUpdate={handleVideoTimeUpdate}
                      muted={isMuted}
                      className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                      controls={false}
                    />

                    {/* Custom Video Control & Mark In/Out Trimming Bar */}
                    <div className="w-full max-w-2xl mt-4 bg-slate-900/90 rounded-2xl p-3 text-white space-y-2.5 backdrop-blur-md border border-white/10">
                      
                      {/* Timeline Slider with Mark In / Out indicators */}
                      <div className="relative pt-2 pb-1">
                        <input
                          type="range"
                          min={0}
                          max={previewModalAsset.durationSec || 15}
                          step={0.1}
                          value={currentTime}
                          onChange={(e) => handleSeek(parseFloat(e.target.value))}
                          className="w-full accent-[#EA3A20] cursor-pointer"
                        />
                        {/* Visual Range for [Mark In - Mark Out] */}
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                          <span>00:00</span>
                          <span className="text-[#EA3A20] font-bold">
                            当前: {formatSecToMinSec(currentTime)}
                          </span>
                          <span>{previewModalAsset.duration}</span>
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleTogglePlay}
                            className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold cursor-pointer hover:scale-105"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-slate-900" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSeek(Math.max(0, currentTime - 1))}
                            className="px-2 py-1 rounded bg-white/10 text-[11px] hover:bg-white/20 cursor-pointer"
                          >
                            -1s
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSeek(Math.min(previewModalAsset.durationSec || 15, currentTime + 1))}
                            className="px-2 py-1 rounded bg-white/10 text-[11px] hover:bg-white/20 cursor-pointer"
                          >
                            +1s
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-white"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Mark In & Mark Out (混剪打入点/出点) */}
                        <div className="flex items-center gap-2 bg-black/40 p-1.5 px-3 rounded-xl border border-white/10 text-xs">
                          <span className="text-slate-400 text-[11px]">混剪取段:</span>
                          <button
                            type="button"
                            onClick={handleSetMarkIn}
                            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] cursor-pointer"
                            title="标记当前时间为入点 [I]"
                          >
                            [入点 {formatSecToMinSec(markIn)}]
                          </button>
                          <span className="text-slate-500">~</span>
                          <button
                            type="button"
                            onClick={handleSetMarkOut}
                            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] cursor-pointer"
                            title="标记当前时间为出点 [O]"
                          >
                            [出点 {formatSecToMinSec(markOut)}]
                          </button>
                          <span className="text-emerald-400 font-mono font-bold text-[11px]">
                            时长 {(markOut - markIn).toFixed(1)}s
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : previewModalAsset.type === 'image' ? (
                  <div className="max-w-full max-h-[500px] flex items-center justify-center">
                    <img
                      src={previewModalAsset.url}
                      alt={previewModalAsset.title}
                      className="max-h-[480px] max-w-full rounded-2xl object-contain shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-md bg-slate-900 rounded-3xl p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 text-[#EA3A20] flex items-center justify-center mx-auto">
                      <Music className="w-8 h-8" />
                    </div>
                    <h4 className="text-white font-bold text-sm">{previewModalAsset.title}</h4>
                    <audio src={previewModalAsset.url} controls className="w-full" />
                  </div>
                )}
              </div>

              {/* Right Metadata Inspector */}
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-5 overflow-y-auto custom-scrollbar space-y-4">
                {/* Tech Specs */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#0F4A47]" /> 技术参数规格
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-xs text-slate-600 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">格式编码</span>
                      <span className="font-mono font-bold text-slate-800">{previewModalAsset.format} (H.264/AAC)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">画幅比例</span>
                      <span className="font-mono font-bold text-slate-800">{previewModalAsset.aspectRatio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">物理分辨率</span>
                      <span className="font-mono font-bold text-slate-800">{previewModalAsset.resolution}</span>
                    </div>
                    {previewModalAsset.fps && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">帧率 (FPS)</span>
                        <span className="font-mono font-bold text-slate-800">{previewModalAsset.fps} FPS</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">文件大小</span>
                      <span className="font-mono text-slate-800">{previewModalAsset.fileSize}</span>
                    </div>
                  </div>
                </div>

                {/* AI Detected Scenes */}
                {previewModalAsset.scenesDetected && previewModalAsset.scenesDetected.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#EA3A20]" /> AI 检测分镜识别
                    </h4>
                    <div className="space-y-1">
                      {previewModalAsset.scenesDetected.map((scene, sIdx) => (
                        <div
                          key={sIdx}
                          className="px-2.5 py-1 rounded-xl bg-red-50/60 border border-red-100 text-slate-800 text-xs flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EA3A20]" />
                          <span>{scene}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags Management */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-500" /> 标签属性 (Tags)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewModalAsset.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Associated Projects */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-slate-500" /> 关联混剪项目
                  </h4>
                  {previewModalAsset.associatedProjects && previewModalAsset.associatedProjects.length > 0 ? (
                    <div className="space-y-1">
                      {previewModalAsset.associatedProjects.map((proj, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                        >
                          {proj}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">暂无项目引用，可作为新首发原片使用。</p>
                  )}
                </div>

                {/* Modal Action Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleBasket(previewModalAsset);
                      setPreviewModalAsset(null);
                    }}
                    className="w-full py-2 rounded-xl bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>裁切当前选段并加入混剪</span>
                  </button>
                  <a
                    href={previewModalAsset.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下载原始素材文件</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BATCH UPLOAD MODAL (批量上传素材弹窗)                                       */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">批量上传多媒体素材</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-[#EA3A20] rounded-2xl p-6 text-center bg-slate-50/60 transition-colors cursor-pointer space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-[#EA3A20] flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                点击选择文件，或将视频/图片拖拽至此区域
              </p>
              <p className="text-[11px] text-slate-400">
                支持 MP4, MOV, JPG, PNG, WEBP, WAV, MP3（单文件最大 2GB）
              </p>
            </div>

            {/* Folder Target Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                存储目标素材箱 (Bin)
              </label>
              <select
                value={uploadTargetFolder}
                onChange={(e) => setUploadTargetFolder(e.target.value)}
                className="w-full h-8.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
              >
                {folders
                  .filter((f) => !f.isSystem)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* AI Auto Enhancements Toggle */}
            <div className="p-3 bg-red-50/50 rounded-2xl border border-red-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Sparkles className="w-4 h-4 text-[#EA3A20]" />
                <span>自动开启 AI 场景检测与智能打标</span>
              </div>
              <span className="text-[10px] font-bold text-[#EA3A20] bg-white px-2 py-0.5 rounded-full border border-red-200">
                已启用
              </span>
            </div>

            {/* Upload Progress Bar if Uploading */}
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>上传中与云端画质转码...</span>
                  <span className="font-mono font-bold text-[#EA3A20]">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#EA3A20] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={handleSimulateUpload}
                className="px-5 py-2 rounded-full bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? '正在上传转码...' : '开始上传素材'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEW FOLDER MODAL (新建素材箱弹窗)                                          */}
      {/* ========================================================================= */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#0F4A47]" />
                <h3 className="text-xs font-bold text-slate-900">新建素材箱目录 (Bin)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">素材箱名称</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="例如：2026米兰展高定展位精剪"
                autoFocus
                className="w-full h-8.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F4A47]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-1.5 rounded-full bg-[#0F4A47] hover:bg-[#0b3836] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                创建素材箱
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
