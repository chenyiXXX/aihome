import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Building2,
  Layers,
  FileText,
  CheckCircle2,
  Film,
  Smartphone,
  Laptop,
  Music,
  Mic,
  Wand2,
  Loader2,
  UploadCloud,
  Share2,
  Languages,
  Sliders,
  Play,
  RotateCcw,
  Tag
} from 'lucide-react';
import {
  VideoClipItem,
  VideoShot,
  AVAILABLE_BGM_TRACKS,
  AVAILABLE_VOICEOVERS,
  BgmTrack,
  VoiceoverConfig
} from '../../../data/videoClipData';
import { AVAILABLE_PRODUCTS } from '../../../data/graphicTextData';

interface CreateVideoClipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateVideo: (newVideo: VideoClipItem) => void;
}

// --------------------------------------------------------------------------
// Available Publishing Platforms (海外 & 国内)
// --------------------------------------------------------------------------
interface PlatformOption {
  id: string;
  name: string;
  region: 'overseas' | 'domestic';
  regionLabel: string;
  accentColor: string;
}

const PUBLISH_PLATFORMS: PlatformOption[] = [
  // 海外平台
  { id: 'tiktok', name: 'TikTok', region: 'overseas', regionLabel: '海外', accentColor: 'border-slate-800 text-slate-900 bg-slate-100' },
  { id: 'instagram', name: 'Instagram', region: 'overseas', regionLabel: '海外', accentColor: 'border-pink-500 text-pink-700 bg-pink-50' },
  { id: 'facebook', name: 'Facebook', region: 'overseas', regionLabel: '海外', accentColor: 'border-blue-600 text-blue-700 bg-blue-50' },
  // 国内平台
  { id: 'douyin', name: '抖音', region: 'domestic', regionLabel: '国内', accentColor: 'border-slate-800 text-slate-900 bg-slate-100' },
  { id: 'wechat_channels', name: '微信视频号', region: 'domestic', regionLabel: '国内', accentColor: 'border-emerald-600 text-emerald-700 bg-emerald-50' },
  { id: 'xiaohongshu', name: '小红书', region: 'domestic', regionLabel: '国内', accentColor: 'border-rose-500 text-rose-700 bg-rose-50' }
];

export const CreateVideoClipModal: React.FC<CreateVideoClipModalProps> = ({
  isOpen,
  onClose,
  onCreateVideo
}) => {
  // Mode Selection: 'elements' (方式一：核心要素生成) | 'benchmark' (方式二：对标视频二创)
  const [creationMode, setCreationMode] = useState<'elements' | 'benchmark'>('elements');

  // --------------------------------------------------------------------------
  // Language & Platform Configuration
  // --------------------------------------------------------------------------
  const [videoLanguage, setVideoLanguage] = useState<'中文' | '英文'>('中文');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'TikTok',
    'Instagram',
    '抖音',
    '微信视频号'
  ]);

  // --------------------------------------------------------------------------
  // Mode 1 State: 核心三要素 (主题 / 产品 / 视频文案)
  // --------------------------------------------------------------------------
  const [m1Topic, setM1Topic] = useState('');
  const [m1Products, setM1Products] = useState<string[]>([AVAILABLE_PRODUCTS[0].name]);
  const [m1Script, setM1Script] = useState('');

  // --------------------------------------------------------------------------
  // Mode 2 State: 对标视频上传与关联产品
  // --------------------------------------------------------------------------
  const [uploadedBenchmarkFile, setUploadedBenchmarkFile] = useState<{
    name: string;
    size: string;
    duration: string;
    previewUrl?: string;
  } | null>(null);
  const [benchTargetProduct, setBenchTargetProduct] = useState<string>(AVAILABLE_PRODUCTS[0].name);

  // --------------------------------------------------------------------------
  // Universal Video Settings (画面比例、成片时长、BGM、旁白)
  // --------------------------------------------------------------------------
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [durationSeconds, setDurationSeconds] = useState<number>(15);
  const [selectedBgmId, setSelectedBgmId] = useState<string>(AVAILABLE_BGM_TRACKS[0].id);
  const [selectedVoiceoverId, setSelectedVoiceoverId] = useState<string>(
    videoLanguage === '英文' ? 'spk-01' : 'spk-03'
  );

  // Loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepText, setGenerationStepText] = useState('');

  // Toggle platform selection
  const handleTogglePlatform = (platformName: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformName)) {
        if (prev.length <= 1) return prev; // Keep at least one platform selected
        return prev.filter((p) => p !== platformName);
      }
      return [...prev, platformName];
    });
  };

  // Select all overseas or domestic platforms
  const handleSelectPlatformGroup = (region: 'overseas' | 'domestic') => {
    const groupNames = PUBLISH_PLATFORMS.filter((p) => p.region === region).map((p) => p.name);
    setSelectedPlatforms((prev) => {
      const allIncluded = groupNames.every((name) => prev.includes(name));
      if (allIncluded) {
        const remaining = prev.filter((name) => !groupNames.includes(name));
        return remaining.length > 0 ? remaining : [groupNames[0]];
      }
      return Array.from(new Set([...prev, ...groupNames]));
    });
  };

  // Switch video language and adapt default voiceover
  const handleLanguageChange = (lang: '中文' | '英文') => {
    setVideoLanguage(lang);
    if (lang === '英文') {
      const englishVoice = AVAILABLE_VOICEOVERS.find((v) => v.language === '英文') || AVAILABLE_VOICEOVERS[0];
      setSelectedVoiceoverId(englishVoice.speakerId);
    } else {
      const chineseVoice = AVAILABLE_VOICEOVERS.find((v) => v.language === '中文') || AVAILABLE_VOICEOVERS[2];
      setSelectedVoiceoverId(chineseVoice.speakerId);
    }
  };

  // Toggle product selection in Mode 1
  const toggleM1Product = (name: string) => {
    setM1Products((prev) => {
      if (prev.includes(name)) {
        if (prev.length <= 1) return prev;
        return prev.filter((n) => n !== name);
      }
      return [...prev, name];
    });
  };

  // Quick fill sample script based on selected language
  const handleFillSampleScript = () => {
    if (videoLanguage === '英文') {
      setM1Script(
        '“Why do luxury coastal villas in Dubai never experience warped cabinetry? Engineered with German Homag laser edge-banding in Foshan smart hub. Water-tested for 72 hours with zero swelling!”'
      );
      if (!m1Topic) {
        setM1Topic('Bespoke Coastal Joinery: German Laser Precision Architecture');
      }
    } else {
      setM1Script(
        '“为什么装了全屋定制的人，三年后都后悔没选激光微米封边？水泡三天不涨，钢丝球刮擦无痕，来看这段显微实测！”'
      );
      if (!m1Topic) {
        setM1Topic('2026现代极简橱柜工法实测：激光封边零胶缝解析');
      }
    }
  };

  // Quick load sample benchmark video for testing
  const handleLoadSampleBenchmark = () => {
    setUploadedBenchmarkFile({
      name: '【行业爆款对标】德国豪迈激光封边微距手摸实拍.mp4',
      size: '28.4 MB',
      duration: '00:18',
      previewUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    });
  };

  // Handle local video file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedBenchmarkFile({
        name: file.name,
        size: `${sizeMb} MB`,
        duration: '00:20',
        previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
      });
    }
  };

  // Submit and create Video Clip
  const handleGenerateAndSubmit = () => {
    setIsGenerating(true);
    setGenerationStepText('AI 正在分析核心要素与镜头语言需求...');

    setTimeout(() => {
      setGenerationStepText('正在检索 4K 实拍车间镜头与 B-Roll 素材库...');
    }, 350);

    setTimeout(() => {
      setGenerationStepText('正在自动对齐 BGM 音频鼓点并生成动态分镜故事板...');
    }, 700);

    setTimeout(() => {
      const matchedBgm = AVAILABLE_BGM_TRACKS.find((b) => b.id === selectedBgmId) || AVAILABLE_BGM_TRACKS[0];
      const matchedVoice = AVAILABLE_VOICEOVERS.find((v) => v.speakerId === selectedVoiceoverId) || AVAILABLE_VOICEOVERS[0];

      let newVideoTitle = '';
      let newTopic = '';
      let newHookText = '';
      let newSummary = '';
      let finalProducts: string[] = [];
      let finalCoverImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80';
      let generatedShots: VideoShot[] = [];

      const isEnglish = videoLanguage === '英文';

      // ----------------------------------------------------------------------
      // Build Result for Mode 1: 核心三要素生成
      // ----------------------------------------------------------------------
      if (creationMode === 'elements') {
        finalProducts = m1Products.length > 0 ? m1Products : [AVAILABLE_PRODUCTS[0].name];
        if (isEnglish) {
          newTopic = m1Topic.trim() || `${finalProducts[0]} Bespoke Architectural Joinery`;
          newVideoTitle = `${newTopic} (${durationSeconds}s Showcase)`;
          newHookText =
            m1Script.trim() ||
            '“Why do high-end architects specify zero-glue laser edge banding? Experience extreme climate durability direct from Foshan.”';
          newSummary = `Bespoke video clip highlighting ${finalProducts.join(', ')} precision craftsmanship with ${matchedBgm.bpm} BPM soundtrack and ${matchedVoice.speakerName}.`;
        } else {
          newTopic = m1Topic.trim() || `${finalProducts[0]}高定工法爆款实测`;
          newVideoTitle = `${newTopic} (${durationSeconds}秒混剪版)`;
          newHookText =
            m1Script.trim() ||
            '“花了几十万装全屋定制，到底是一次性消耗品还是能用十年？来看看这块水泡了72小时的门板！”';
          newSummary = `基于【${newTopic}】，AI 智能提取${finalProducts.join('、')}核心工法卖点，匹配 ${matchedBgm.bpm} BPM 卡点鼓点与${matchedVoice.speakerName}声线。`;
        }

        generatedShots = [
          {
            id: `shot-${Date.now()}-1`,
            order: 1,
            shotType: '全景推镜',
            timeRange: '00:00 - 00:04',
            startSec: 0,
            endSec: 4,
            previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
            cameraMotion: '前推缓入 + 景深自适应平滑变焦',
            voiceoverScript: newHookText,
            subtitles: isEnglish ? `"${newTopic.slice(0, 32)}"` : `「${newTopic.slice(0, 22)}」`,
            captionEffect: '高光质感大字动效',
            transition: '硬切',
            soundFx: '低频呼啸 (Whoosh)'
          },
          {
            id: `shot-${Date.now()}-2`,
            order: 2,
            shotType: '微距特写',
            timeRange: '00:04 - 00:10',
            startSec: 4,
            endSec: 10,
            previewImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
            cameraMotion: '侧向微距慢速平移 + 激光热熔零胶缝实录',
            voiceoverScript: isEnglish
              ? `Engineered for ${finalProducts[0]}, German Homag laser heat-bonding delivers seamless waterproof performance.`
              : `针对${finalProducts.join('与')}的严苛工艺，德国豪迈激光热熔无缝封边，防水防潮无胶缝。`,
            subtitles: isEnglish ? `[Precision Spec] ${finalProducts[0]} 0.05mm tolerance` : `【核心工法实测】${finalProducts[0]}微米级公差实拍`,
            captionEffect: '硬核数据指示标',
            transition: '镜头推拉',
            soundFx: '机械自吸质感声'
          },
          {
            id: `shot-${Date.now()}-3`,
            order: 3,
            shotType: '细节摇镜',
            timeRange: '00:10 - 00:15',
            startSec: 10,
            endSec: durationSeconds,
            previewImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
            cameraMotion: '退景展示整案空间 + 品牌光晕定格',
            voiceoverScript: isEnglish
              ? 'Direct global delivery from Foshan Industry 4.0 hub. Inquire now for full project specifications.'
              : '佛山工业4.0基地直供出海，私信获取全套出海方案与实体色板样品盒。',
            subtitles: isEnglish ? '"Foshan Luxury Joinery · Direct Global Supply"' : '“佛山高定直供全球 · 私信咨询专属清单”',
            captionEffect: '品牌合作CTA卡片',
            transition: '叠化淡入',
            soundFx: '清脆品牌提示音'
          }
        ];
      }
      // ----------------------------------------------------------------------
      // Build Result for Mode 2: 对标视频上传二创
      // ----------------------------------------------------------------------
      else {
        finalProducts = [benchTargetProduct || AVAILABLE_PRODUCTS[0].name];
        const rawFileName = uploadedBenchmarkFile?.name || '对标爆款视频';
        const cleanName = rawFileName.replace(/\.(mp4|mov|avi)$/i, '').replace(/^【.*?】/, '');

        if (isEnglish) {
          newTopic = `[Remake] ${cleanName}`;
          newVideoTitle = `【Viral Remake】${cleanName} (Bespoke Cut)`;
          newHookText =
            '“Why ultra-luxury penthouses worldwide choose German laser-sealed joinery over traditional glued panels? Watch this micro-lens test.”';
          newSummary = `Deconstructed viral benchmark video 《${rawFileName}》, rewritten into English voiceover, and replaced with 4K factory footage.`;
        } else {
          newTopic = `[二创] ${cleanName}`;
          newVideoTitle = `【爆款二创】${cleanName} (去重重制版)`;
          newHookText =
            '“很多客户问为什么普通封边三年就发黑翘皮？对比我司激光热熔零胶缝，看完这个微距你就懂了！”';
          newSummary = `根据上传对标视频《${rawFileName}》爆款节奏拆解，完成文案去重改编、镜头替换为我司4K车间实拍素材、重新合成音画卡点。`;
        }

        finalCoverImage =
          uploadedBenchmarkFile?.previewUrl ||
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';

        generatedShots = [
          {
            id: `shot-${Date.now()}-1`,
            order: 1,
            shotType: '全景推镜',
            timeRange: '00:00 - 00:04',
            startSec: 0,
            endSec: 4,
            previewImage: finalCoverImage,
            cameraMotion: '去重微变焦 1.03x + 黄金节奏前推入镜',
            voiceoverScript: newHookText,
            subtitles: isEnglish ? `[Viral Remake] ${cleanName.slice(0, 24)}` : `【对标爆款二创】${cleanName.slice(0, 18)}`,
            captionEffect: '痛点设问花字',
            transition: '硬切',
            soundFx: '转场重音'
          },
          {
            id: `shot-${Date.now()}-2`,
            order: 2,
            shotType: '微距特写',
            timeRange: '00:04 - 00:10',
            startSec: 4,
            endSec: 10,
            previewImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
            cameraMotion: '替换为我司实拍车间 4K 激光微米封边实测镜头',
            voiceoverScript: isEnglish
              ? `Integrated with ${finalProducts[0]}, featuring aircraft-grade aluminum honeycomb and zero glue line.`
              : `植入【${finalProducts[0]}】核心工艺，航空级铝蜂窝与莫氏6级岩板结合，消除原片版权风险。`,
            subtitles: isEnglish ? 'Foshan Smart Factory 4K Test' : '我司佛山智造车间实测 · 激光热熔零胶缝',
            captionEffect: '技术参数悬浮框',
            transition: '镜头推拉',
            soundFx: '激光高频扫描音'
          },
          {
            id: `shot-${Date.now()}-3`,
            order: 3,
            shotType: '细节摇镜',
            timeRange: '00:10 - 00:16',
            startSec: 10,
            endSec: 16,
            previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
            cameraMotion: '全景展厅退镜 + 官方咨询浮现',
            voiceoverScript: isEnglish
              ? 'Bespoke joinery manufactured in Foshan, shipped globally with CAD drawing support.'
              : '佛山工业4.0智造直供全球，支持个性化工程定制与出海样板寄送。',
            subtitles: isEnglish ? '"Foshan Luxury Joinery · Direct Global Supply"' : '“佛山高定工厂直供 · 支持私信获取全套BOM”',
            captionEffect: '品牌转化二维码',
            transition: '叠化淡入',
            soundFx: '品牌质感尾音'
          }
        ];
      }

      const formattedPlatforms = selectedPlatforms.join(' · ');

      const newVideo: VideoClipItem = {
        id: `clip-${Date.now()}`,
        topic: newTopic,
        title: newVideoTitle,
        hookText: newHookText,
        summary: newSummary,
        coverImage: finalCoverImage,
        aspectRatio,
        durationSeconds,
        durationText: durationSeconds === 15 ? '00:15' : durationSeconds === 20 ? '00:20' : '00:30',
        resolution: '4K 60fps',
        publishPlatform: formattedPlatforms,
        targetPlatforms: selectedPlatforms,
        language: videoLanguage,
        status: '剪辑中',
        createdAt: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        estimatedViews: `${Math.floor(50 + Math.random() * 80)}.${Math.floor(Math.random() * 9)}W`,
        themeStyle: 'emerald',
        bgmTrack: matchedBgm,
        voiceover: matchedVoice,
        linkedProducts: finalProducts,
        linkedCase: {
          id: 'case-dubai',
          name: '阿联酋迪拜云溪港顶层复式全景',
          location: '阿联酋 · 迪拜云溪港',
          clipCount: 8
        },
        shots: generatedShots
      };

      setIsGenerating(false);
      onCreateVideo(newVideo);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* ================================================================= */}
        {/* Header                                                            */}
        {/* ================================================================= */}
        <div className="p-5 px-7 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold shadow-xs">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">新建视频剪辑工程</h2>
            </div>
          </div>

          {/* Creation Modes Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => setCreationMode('elements')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                creationMode === 'elements'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#EA3A20]" />
              <span>基础创建</span>
            </button>
            <button
              type="button"
              onClick={() => setCreationMode('benchmark')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                creationMode === 'benchmark'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#EA3A20]" />
              <span>对标二创</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* Modal Scrollable Body                                             */}
        {/* ================================================================= */}
        <div className="p-7 space-y-6 text-xs overflow-y-auto custom-scrollbar flex-1">
          {/* =============================================================== */}
          {/* 核心配置栏：视频语言与目标发布平台 (高亮简洁)                   */}
          {/* =============================================================== */}
          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* 语言选择 (中文 / 英文) */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                  <Languages className="w-3.5 h-3.5 text-[#EA3A20]" />
                  <span>视频语言版本</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('中文')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      videoLanguage === '中文'
                        ? 'bg-[#0F4A47] border-[#0F4A47] text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {videoLanguage === '中文' && <Check className="w-3.5 h-3.5" />}
                    <span>中文 (普通话)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLanguageChange('英文')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      videoLanguage === '英文'
                        ? 'bg-[#0F4A47] border-[#0F4A47] text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {videoLanguage === '英文' && <Check className="w-3.5 h-3.5" />}
                    <span>英文 (English)</span>
                  </button>
                </div>
              </div>

              {/* 发布平台多选 (海外: TikTok, Instagram, Facebook; 国内: 抖音, 视频号, 小红书) */}
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                    <Share2 className="w-3.5 h-3.5 text-[#0F4A47]" />
                    <span>目标发布平台</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      （已选 {selectedPlatforms.length} 个）
                    </span>
                  </label>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleSelectPlatformGroup('overseas')}
                      className="text-slate-500 hover:text-[#0F4A47] font-medium cursor-pointer"
                    >
                      海外全选
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleSelectPlatformGroup('domestic')}
                      className="text-slate-500 hover:text-[#0F4A47] font-medium cursor-pointer"
                    >
                      国内全选
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {PUBLISH_PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.name);
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => handleTogglePlatform(platform.name)}
                        className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-rose-50/80 border-[#EA3A20] text-slate-900 font-bold shadow-2xs ring-1 ring-[#EA3A20]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[9px] text-slate-400 uppercase tracking-tight">
                          {platform.regionLabel}
                        </span>
                        <div className="text-[11px] truncate w-full flex items-center justify-center gap-1">
                          {isSelected && <Check className="w-2.5 h-2.5 text-[#EA3A20]" />}
                          <span>{platform.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* MODE 1: 基础创建                                                */}
          {/* =============================================================== */}
          {creationMode === 'elements' && (
            <div className="space-y-4">
              {/* 视频主题 */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="font-bold text-slate-800 text-xs block">
                  视频主题
                </label>
                <input
                  type="text"
                  value={m1Topic}
                  onChange={(e) => setM1Topic(e.target.value)}
                  placeholder={
                    videoLanguage === '英文'
                      ? 'e.g. 2026 Bespoke Luxury Kitchen Trends: German Homag Laser Edge-banding...'
                      : '例如：2026现代极简橱柜趋势、海湾50℃高湿环境门板耐候实测...'
                  }
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                />
              </div>

              {/* 关联产品 */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs">
                    关联产品
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    已选 {m1Products.length} 款
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_PRODUCTS.map((prod) => {
                    const isSelected = m1Products.includes(prod.name);
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => toggleM1Product(prod.name)}
                        className={`p-2.5 rounded-xl border text-left flex items-start justify-between gap-1.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#EA3A20] bg-rose-50/60 text-slate-900 ring-1 ring-[#EA3A20]'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{prod.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">{prod.tag}</div>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#EA3A20] shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 视频文案 */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="font-bold text-slate-800 text-xs block">
                  口播与分镜脚本
                </label>
                <textarea
                  rows={3}
                  value={m1Script}
                  onChange={(e) => setM1Script(e.target.value)}
                  placeholder={
                    videoLanguage === '英文'
                      ? 'Enter the opening voiceover script, hook question, or call-to-action...'
                      : '输入口播文案与分镜设问脚本，或留空由系统自动提取工法卖点生成...'
                  }
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* MODE 2: 对标二创                                                */}
          {/* =============================================================== */}
          {creationMode === 'benchmark' && (
            <div className="space-y-4">
              {/* 上传对标视频区域 */}
              <div>
                <label className="block text-slate-800 font-bold mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-[#EA3A20]" />
                    <span>上传对标视频</span>
                  </span>
                  {!uploadedBenchmarkFile && (
                    <button
                      type="button"
                      onClick={handleLoadSampleBenchmark}
                      className="text-[#0F4A47] hover:underline text-[11px] font-medium cursor-pointer"
                    >
                      载入示例视频
                    </button>
                  )}
                </label>

                {!uploadedBenchmarkFile ? (
                  <div className="p-8 border-2 border-dashed border-slate-300 hover:border-[#EA3A20] rounded-2xl bg-slate-50 text-center transition-all">
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <div className="font-bold text-xs text-slate-800">
                      点击或拖拽上传对标短视频文件
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      支持 MP4、MOV 格式，建议 15~60 秒
                    </p>
                    <label className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-xl font-bold text-xs cursor-pointer shadow-2xs transition-colors">
                      <Film className="w-4 h-4" />
                      <span>选择本地视频</span>
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Film className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {uploadedBenchmarkFile.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-medium text-[10px]">
                            已解析
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                          <span>大小: {uploadedBenchmarkFile.size}</span>
                          <span>·</span>
                          <span>时长: {uploadedBenchmarkFile.duration}</span>
                          <span>·</span>
                          <span>画幅: 9:16</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors">
                        <span>更换视频</span>
                        <input
                          type="file"
                          accept="video/mp4,video/quicktime"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setUploadedBenchmarkFile(null)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="移除视频"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 二创重点关联产品 */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="block text-slate-800 font-bold text-xs">
                  关联产品
                </label>
                <select
                  value={benchTargetProduct}
                  onChange={(e) => setBenchTargetProduct(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
                >
                  {AVAILABLE_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} · {p.tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* Universal Video Settings (画幅、时长、BGM、声线)               */}
          {/* =============================================================== */}
          <div className="pt-4 border-t border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>参数设置</span>
              </h3>
            </div>

            {/* 画幅比例与时长 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">画幅比例</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all ${
                      aspectRatio === '9:16'
                        ? 'border-[#EA3A20] bg-rose-50/50 text-[#EA3A20] shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>9:16 竖屏</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all ${
                      aspectRatio === '16:9'
                        ? 'border-[#0F4A47] bg-emerald-50/50 text-[#0F4A47] shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>16:9 横屏</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">成片时长</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { sec: 15, label: '15 秒' },
                    { sec: 20, label: '20 秒' },
                    { sec: 30, label: '30 秒' }
                  ].map((item) => (
                    <button
                      key={item.sec}
                      type="button"
                      onClick={() => setDurationSeconds(item.sec)}
                      className={`py-2 px-2 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                        durationSeconds === item.sec
                          ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* BGM 节拍库 & 旁白声线 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-indigo-500" />
                  <span>背景音乐</span>
                </label>
                <select
                  value={selectedBgmId}
                  onChange={(e) => setSelectedBgmId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
                >
                  {AVAILABLE_BGM_TRACKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.bpm} BPM · {b.audioMood})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-rose-500" />
                  <span>配音声线</span>
                </label>
                <select
                  value={selectedVoiceoverId}
                  onChange={(e) => setSelectedVoiceoverId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
                >
                  {AVAILABLE_VOICEOVERS.map((v) => (
                    <option key={v.speakerId} value={v.speakerId}>
                      {v.speakerName} · {v.style} ({v.language})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Modal Footer                                                      */}
        {/* ================================================================= */}
        <div className="bg-slate-50 px-7 py-4 border-t border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
              {videoLanguage}
            </span>
            <span>
              已选 {selectedPlatforms.length} 个发布平台：
              <strong className="text-slate-800 font-bold truncate max-w-[240px] inline-block align-bottom">
                {selectedPlatforms.join('、')}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/80 font-bold cursor-pointer transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleGenerateAndSubmit}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white font-bold cursor-pointer transition-all shadow-xs active:scale-95 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{generationStepText || '正在进行 AI 混剪装配...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>
                    {creationMode === 'elements' ? '生成视频工程' : '开始对标二创'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
