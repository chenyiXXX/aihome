import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Check,
  Building2,
  Layers,
  FileText,
  CheckCircle2,
  ArrowRight,
  Film,
  Smartphone,
  Laptop,
  Music,
  Mic,
  Clock,
  Wand2,
  Loader2,
  UploadCloud,
  Link,
  Scissors,
  Shuffle,
  Play,
  RotateCcw,
  Sliders,
  AlertCircle,
  Copy,
  FolderArchive,
  Volume2,
  Tag,
  Zap,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  VideoClipItem,
  VideoShot,
  AVAILABLE_BGM_TRACKS,
  AVAILABLE_VOICEOVERS,
  AVAILABLE_VIDEO_MATERIALS,
  BgmTrack,
  VoiceoverConfig
} from '../../../data/videoClipData';
import { AVAILABLE_PRODUCTS, AVAILABLE_CASES } from '../../../data/graphicTextData';

interface CreateVideoClipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateVideo: (newVideo: VideoClipItem) => void;
}

// --------------------------------------------------------------------------
// Presets for Mode 1 (要素生成灵感预设)
// --------------------------------------------------------------------------
const INSPIRATION_TOPICS = [
  {
    topic: '2026现代极简橱柜趋势：PET零度超亚板材实测',
    product: 'PET肤感板系列',
    script: '“为什么装了全屋定制的人，三年后都后悔没选PET零度超亚板？水泡三天不涨，钢丝球刮擦无痕，来看这段显微实测！”'
  },
  {
    topic: '海湾高奢工法：迪拜云溪港精装大平层木作实录',
    product: '岩板岛台台面系统',
    script: '“在50℃极端海湾湿热气候下，木作如何做到十年不胀不翘？迪拜顶奢豪宅同款铝蜂窝内胆，中国佛山智造出海实录！”'
  },
  {
    topic: '工厂智造解密：德国豪迈激光封边微米公差科普',
    product: '德国进口阻尼五金系列',
    script: '“一根头发丝十分之一的零胶缝封边是如何炼成的？带你直击工业4.0智造车间，告别传统胶水发黑开裂通病！”'
  },
  {
    topic: '意式极简门为何越来越薄？4mm极窄航空铝与隐形铰链解析',
    product: '意式极简铝框玻璃门',
    script: '“推拉顺滑到像悬浮在空气里！4mm极窄航空铝框+天地隐藏式磁悬浮阻尼，开合瞬间尽显私宅高级质感！”'
  }
];

// --------------------------------------------------------------------------
// Presets for Mode 2 (对标视频样本)
// --------------------------------------------------------------------------
const BENCHMARK_VIDEO_PRESETS = [
  {
    id: 'bench-01',
    title: '【行业爆款】德国豪迈激光封边微距手摸实拍.mp4',
    sourceUrl: 'https://v.douyin.com/iRo9sXq/',
    platform: '抖音 120W+ 播放',
    duration: '00:18',
    aspect: '9:16',
    cover: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    originalScript: '“普通橱柜用三年受潮发黑，真正的高定为什么水泡三天都不变形？来看这段微距实拍！德国豪迈激光热熔封边，零胶水无缝防水！”',
    structureAnalysis: '【前3秒痛点设问】(0-3s) -> 【微距硬核实测】(3-12s) -> 【工厂实力背书与引导】(12-18s)',
    bpm: 124,
    recommendedRemakeStrategy: '保留前3秒痛点结构，将镜头替换为我司佛山基地4K车间实拍，重新生成中英双语旁白',
    targetProduct: 'PET肤感板系列'
  },
  {
    id: 'bench-02',
    title: '【海外获客爆款】迪拜海湾豪宅270度落地窗木作全景.mp4',
    sourceUrl: 'https://www.tiktok.com/@luxuryinterior/video/987654321',
    platform: 'TikTok 86W 播放',
    duration: '00:28',
    aspect: '16:9',
    cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    originalScript: '“In the heart of Dubai Creek Harbour, where extreme coastal heat meets bespoke luxury woodwork. Engineered for extreme climate resilience.”',
    structureAnalysis: '【航拍大平层入户】(0-5s) -> 【门墙柜一体化细节环绕】(5-20s) -> 【海外工程外贸合作CTA】(20-28s)',
    bpm: 112,
    recommendedRemakeStrategy: '采用我司迪拜云溪港实景4K航拍镜头，替换莫氏6级岩板岛台特写，重新配音英语外贸解说',
    targetProduct: '岩板岛台台面系统'
  },
  {
    id: 'bench-03',
    title: '【材料痛点对比】传统劣质板材 vs 高定防潮板浸水实测.mp4',
    sourceUrl: 'https://v.douyin.com/kLm87Ty/',
    platform: '视频号 45W 播放',
    duration: '00:15',
    aspect: '9:16',
    cover: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    originalScript: '“花了几十万装全屋定制，不到两年封边翘皮、内部发霉！真正耐用的高定板材必须具备这三项硬核指标！”',
    structureAnalysis: '【视觉冲击痛点展示】(0-3s) -> 【双板材暴力泡水实测】(3-10s) -> 【解决方案与领取样板】(10-15s)',
    bpm: 128,
    recommendedRemakeStrategy: '痛点转移策略：将竞品缺陷对比转换为我方激光封边实测镜头，引导私信索取实体色板盒',
    targetProduct: '德国进口阻尼五金系列'
  }
];

export const CreateVideoClipModal: React.FC<CreateVideoClipModalProps> = ({
  isOpen,
  onClose,
  onCreateVideo
}) => {
  // Mode Selection: 'elements' (三大要素生成) | 'benchmark' (对标视频二创) | 'matrix' (多素材矩阵混剪)
  const [creationMode, setCreationMode] = useState<'elements' | 'benchmark' | 'matrix'>('elements');

  // --------------------------------------------------------------------------
  // Mode 1 State: 要素生成 (主题 / 产品 / 视频文案，任选或全选)
  // --------------------------------------------------------------------------
  const [m1Topic, setM1Topic] = useState('');
  const [m1Products, setM1Products] = useState<string[]>([]);
  const [m1Script, setM1Script] = useState('');

  // Universal Video Settings (混剪平台通用设置)
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [durationSeconds, setDurationSeconds] = useState<number>(15);
  const [selectedBgmId, setSelectedBgmId] = useState<string>(AVAILABLE_BGM_TRACKS[0].id);
  const [selectedVoiceoverId, setSelectedVoiceoverId] = useState<string>(AVAILABLE_VOICEOVERS[0].speakerId);
  const [pacingStyle, setPacingStyle] = useState<'rhythmic' | 'cinematic' | 'macro'>('rhythmic');
  const [captionStyle, setCaptionStyle] = useState<'gold' | 'spec' | 'bilingual'>('gold');

  // --------------------------------------------------------------------------
  // Mode 2 State: 对标视频二创
  // --------------------------------------------------------------------------
  const [benchInputType, setBenchInputType] = useState<'preset' | 'file' | 'url'>('preset');
  const [selectedBenchPresetId, setSelectedBenchPresetId] = useState<string>(BENCHMARK_VIDEO_PRESETS[0].id);
  const [benchUrl, setBenchUrl] = useState('');
  const [benchUploadedFileName, setBenchUploadedFileName] = useState<string | null>(null);
  const [benchRemakeStrategy, setBenchRemakeStrategy] = useState<'rewrite' | 'painpoint' | 'bilingual'>('rewrite');
  const [benchReplaceVisuals, setBenchReplaceVisuals] = useState(true);
  const [benchAntiDuplicationFilter, setBenchAntiDuplicationFilter] = useState(true);
  const [benchTargetProduct, setBenchTargetProduct] = useState<string>(AVAILABLE_PRODUCTS[0].name);

  // --------------------------------------------------------------------------
  // Mode 3 State: 多素材矩阵混剪
  // --------------------------------------------------------------------------
  const [matrixHookShots, setMatrixHookShots] = useState<string[]>(['vmat-01', 'vmat-03']);
  const [matrixBodyShots, setMatrixBodyShots] = useState<string[]>(['vmat-02', 'vmat-04', 'vmat-05']);
  const [matrixCtaShots, setMatrixCtaShots] = useState<string[]>(['vmat-07']);
  const [matrixOutputCount, setMatrixOutputCount] = useState<number>(1);
  const [matrixShuffleOrder, setMatrixShuffleOrder] = useState(true);
  const [matrixBeatSync, setMatrixBeatSync] = useState(true);

  // --------------------------------------------------------------------------
  // Loading & Generation Animation State
  // --------------------------------------------------------------------------
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepText, setGenerationStepText] = useState('');

  // Active benchmark data
  const currentBenchmark = BENCHMARK_VIDEO_PRESETS.find((b) => b.id === selectedBenchPresetId) || BENCHMARK_VIDEO_PRESETS[0];

  // Mode 1: Calculate how many of the 3 primary elements are filled
  const elementsFilledCount = useMemo(() => {
    let count = 0;
    if (m1Topic.trim()) count++;
    if (m1Products.length > 0) count++;
    if (m1Script.trim()) count++;
    return count;
  }, [m1Topic, m1Products, m1Script]);

  // Mode 1: Quick fill from inspiration preset
  const handleApplyInspiration = (preset: typeof INSPIRATION_TOPICS[0]) => {
    setM1Topic(preset.topic);
    setM1Products([preset.product]);
    setM1Script(preset.script);
  };

  // Mode 1: AI Auto-complete missing elements
  const handleAiAutoCompleteElements = () => {
    if (!m1Topic.trim() && m1Products.length === 0 && !m1Script.trim()) {
      handleApplyInspiration(INSPIRATION_TOPICS[0]);
      return;
    }

    if (!m1Topic.trim()) {
      if (m1Products.length > 0) {
        setM1Topic(`2026高定前沿实测：${m1Products.join('与')}的微距工法解析`);
      } else {
        setM1Topic('2026极简全案定制核心工艺与避坑实录');
      }
    }

    if (m1Products.length === 0) {
      setM1Products(['PET肤感板系列', '德国进口阻尼五金系列']);
    }

    if (!m1Script.trim()) {
      setM1Script(
        `“为什么你花大几十万做的高定，用不到三年就变形开裂？问题就出在选材与封边工艺的毫厘之差！佛山工业4.0智造，水泡72小时不变形，来看这段显微实录！”`
      );
    }
  };

  // Toggle product selection in Mode 1
  const toggleM1Product = (name: string) => {
    setM1Products((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Submit and assemble Video Clip
  const handleGenerateAndSubmit = () => {
    setIsGenerating(true);
    setGenerationStepText('AI 正在分析核心要素与镜头语言需求...');

    setTimeout(() => {
      setGenerationStepText('正在检索 4K 实拍车间镜头与 B-Roll 素材库...');
    }, 400);

    setTimeout(() => {
      setGenerationStepText('正在自动对齐 BGM 音频鼓点并生成动态分镜故事板...');
    }, 800);

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

      // ----------------------------------------------------------------------
      // Build Result for Mode 1: 要素智能装配
      // ----------------------------------------------------------------------
      if (creationMode === 'elements') {
        finalProducts = m1Products.length > 0 ? m1Products : ['PET肤感板系列', '吊滑极简门'];
        newTopic = m1Topic.trim() || `${finalProducts[0]}高定工法爆款实测`;
        newVideoTitle = `${newTopic} (${durationSeconds}秒黄金混剪版)`;
        newHookText =
          m1Script.trim() ||
          `“花了几十万装全屋定制，到底是一次性消耗品还是能用十年？来看看这块水泡了72小时的门板！”`;
        newSummary = `基于【${newTopic}】，AI 智能提取${finalProducts.join('、')}核心工法卖点，匹配 ${matchedBgm.bpm} BPM 卡点鼓点与${matchedVoice.speakerName}声线。`;

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
            subtitles: `「${newTopic.slice(0, 22)}」`,
            captionEffect: captionStyle === 'gold' ? '金色高光大字动效' : '硬核参数标',
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
            cameraMotion: '侧向微距慢速平移 + 手摸抗指纹测试',
            voiceoverScript: `针对${finalProducts.join('与')}的严苛工艺，德国豪迈激光热熔无缝封边，防水防潮无胶缝。`,
            subtitles: `【核心工法实测】${finalProducts[0]}微米级公差实拍`,
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
            voiceoverScript: '佛山工业4.0基地直供出海，私信获取全套出海方案与实体色板样品盒。',
            subtitles: '“佛山高定直供全球 · 私信咨询专属清单”',
            captionEffect: '品牌合作CTA卡片',
            transition: '叠化淡入',
            soundFx: '清脆品牌提示音'
          }
        ];
      }

      // ----------------------------------------------------------------------
      // Build Result for Mode 2: 对标视频二创
      // ----------------------------------------------------------------------
      else if (creationMode === 'benchmark') {
        const bench = currentBenchmark;
        finalProducts = [benchTargetProduct || bench.targetProduct];
        newTopic = `[二创] ${bench.title.replace('.mp4', '')}`;
        newVideoTitle = `【爆款二创】${bench.title.replace('【行业爆款】', '').replace('.mp4', '')} (去重重制版)`;
        newHookText =
          benchRemakeStrategy === 'bilingual'
            ? '“Engineered with German Homag laser precision in Foshan smart hub. Why ultra-luxury projects never crack under coastal climate?”'
            : benchRemakeStrategy === 'painpoint'
            ? '“很多客户问为什么传统封边三年就发黑翘皮？对比我司德国激光热熔零胶缝，看完这个微距你就懂了！”'
            : '“为什么真正的顶奢大宅，一眼就能看出高定木作的质感？关键全在激光微米封边与极窄隐形轨道！”';
        newSummary = `根据对标视频《${bench.title}》爆款节奏拆解，完成文案去重改编、镜头替换为我司4K车间实拍素材、重新合成音画卡点。`;
        finalCoverImage = bench.cover;

        generatedShots = [
          {
            id: `shot-${Date.now()}-1`,
            order: 1,
            shotType: '全景推镜',
            timeRange: '00:00 - 00:04',
            startSec: 0,
            endSec: 4,
            previewImage: bench.cover,
            cameraMotion: '去重变焦 1.04x + 前推入镜',
            voiceoverScript: newHookText,
            subtitles: `【对标爆款二创】${bench.title.slice(0, 18)}`,
            captionEffect: '高冲击力痛点花字',
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
            cameraMotion: '我司实拍车间 4K 激光微米封边实测镜头替换',
            voiceoverScript: `植入【${finalProducts[0]}】核心工艺，航空级铝蜂窝与莫氏6级岩板结合，彻底消除原片版权风险。`,
            subtitles: `我司佛山智造车间实测 · 激光热熔零胶缝`,
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
            cameraMotion: '全景大平层展厅退景展示',
            voiceoverScript: '佛山工业4.0智造直供全球，支持个性化工程定制与出海样板寄送。',
            subtitles: '“佛山高定工厂直供 · 支持私信获取全套BOM”',
            captionEffect: '品牌转化二维码',
            transition: '叠化淡入',
            soundFx: '品牌质感尾音'
          }
        ];
      }

      // ----------------------------------------------------------------------
      // Build Result for Mode 3: 多素材矩阵混剪
      // ----------------------------------------------------------------------
      else {
        finalProducts = ['PET肤感板系列', '意式极简铝框玻璃门'];
        newTopic = '矩阵混剪：多镜头随机组合裂变工程';
        newVideoTitle = `【矩阵裂变混剪】车间工法与海湾豪宅高光混剪工程 #${Math.floor(100 + Math.random() * 900)}`;
        newHookText = '“普通高定看表面，真正的高奢看收口！今天带你微距拆解价值百万的豪宅木作！”';
        newSummary = `自动装配 ${matrixHookShots.length} 个前3秒钩子镜头 + ${matrixBodyShots.length} 个车间工法镜头 + ${matrixCtaShots.length} 个转化镜头，通过节奏卡点与随机变焦去重。`;

        generatedShots = [
          {
            id: `shot-${Date.now()}-1`,
            order: 1,
            shotType: '全景推镜',
            timeRange: '00:00 - 00:04',
            startSec: 0,
            endSec: 4,
            previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
            cameraMotion: '航拍大范围推入 + 自动鼓点卡点',
            voiceoverScript: newHookText,
            subtitles: '“佛山智造工业4.0 · 重新定义高定精度”',
            captionEffect: '动态金色大字',
            transition: '硬切',
            soundFx: '重音鼓点'
          },
          {
            id: `shot-${Date.now()}-2`,
            order: 2,
            shotType: '微距特写',
            timeRange: '00:04 - 00:09',
            startSec: 4,
            endSec: 9,
            previewImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80',
            cameraMotion: '微距镜头横向平移 + 0.98x微变速去重',
            voiceoverScript: '机械臂智能激光下料封边，公差控制在0.05毫米以内。',
            subtitles: '【工法实测】微米级热熔激光封边',
            captionEffect: '数据指示标',
            transition: '镜头推拉',
            soundFx: '机械自吸声'
          },
          {
            id: `shot-${Date.now()}-3`,
            order: 3,
            shotType: '细节摇镜',
            timeRange: '00:09 - 00:15',
            startSec: 9,
            endSec: 15,
            previewImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
            cameraMotion: '西厨岛台环绕退镜 + 官方二维码浮现',
            voiceoverScript: '全球大平层工程木作直供，私信即刻获取全套CAD深化图纸。',
            subtitles: '“佛山高定直供全球 · 私信咨询专属清单”',
            captionEffect: '品牌转化CTA',
            transition: '叠化淡入',
            soundFx: '清脆提示音'
          }
        ];
      }

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
        publishPlatform: aspectRatio === '9:16' ? '抖音 / 视频号 / TikTok' : 'YouTube / 海外官网',
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
    }, 1100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* ================================================================= */}
        {/* Header                                                            */}
        {/* ================================================================= */}
        <div className="bg-[#0F4A47] text-white px-7 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Film className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>新建视频剪辑工程</span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  AI 混剪工作台
                </span>
              </h2>
              <p className="text-xs text-slate-200 mt-0.5">
                支持要素生成、对标二创与多素材矩阵混剪，AI 自动装配 4K 实拍镜头与卡点音轨
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* Three Creation Modes Tab Switcher                                */}
        {/* ================================================================= */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-7 pt-3 shrink-0">
          <div className="grid grid-cols-3 gap-2">
            {/* Mode 1 */}
            <button
              type="button"
              onClick={() => setCreationMode('elements')}
              className={`pb-3 px-4 text-left border-b-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                creationMode === 'elements'
                  ? 'border-[#EA3A20] text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  creationMode === 'elements' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>方式一：核心要素生成</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-[#EA3A20] font-normal">
                    三要素任选
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">主题 / 产品 / 视频文案</div>
              </div>
            </button>

            {/* Mode 2 */}
            <button
              type="button"
              onClick={() => setCreationMode('benchmark')}
              className={`pb-3 px-4 text-left border-b-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                creationMode === 'benchmark'
                  ? 'border-[#EA3A20] text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  creationMode === 'benchmark' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>方式二：对标视频二创</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-normal">
                    爆款重制
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">上传爆款 / 链接抓取去重</div>
              </div>
            </button>

            {/* Mode 3 */}
            <button
              type="button"
              onClick={() => setCreationMode('matrix')}
              className={`pb-3 px-4 text-left border-b-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                creationMode === 'matrix'
                  ? 'border-[#EA3A20] text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  creationMode === 'matrix' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>方式三：素材矩阵混剪</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-normal">
                    批量裂变
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">镜头自由混排 / 鼓点卡点</div>
              </div>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Modal Scrollable Body                                             */}
        {/* ================================================================= */}
        <div className="p-7 space-y-6 text-xs overflow-y-auto custom-scrollbar flex-1">
          {/* =============================================================== */}
          {/* MODE 1: 核心要素生成 (主题、产品、文案 三要素任填或全填)       */}
          {/* =============================================================== */}
          {creationMode === 'elements' && (
            <div className="space-y-5">
              {/* Element Status Banner */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span>三大核心要素智能装配机制</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-mono text-[10px]">
                        已填要素 {elementsFilledCount} / 3
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                      设定好<strong>主题</strong>、选好<strong>产品</strong>、<strong>视频文案</strong>，三大要素<strong>有任一即可生成</strong>，也可全部填写。未填项将由 AI 结合出海高定案例库自动补全。
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAiAutoCompleteElements}
                  className="px-3.5 py-1.5 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>一键 AI 补全全部要素</span>
                </button>
              </div>

              {/* Inspiration Presets Pill List */}
              <div>
                <label className="block text-slate-700 font-bold mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#EA3A20]" />
                    <span>快速灵感选题（点击直接一键填入三要素）</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">支持自由修改</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {INSPIRATION_TOPICS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyInspiration(item)}
                      className="p-2.5 text-left rounded-xl border border-slate-200/80 hover:border-[#EA3A20]/50 hover:bg-rose-50/30 transition-all cursor-pointer group bg-slate-50/50"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-[#EA3A20] line-clamp-1">
                        {item.topic}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">
                          {item.product}
                        </span>
                        <span className="truncate">{item.script.slice(0, 24)}...</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Element 1: Topic */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4A47] text-white flex items-center justify-center text-[10px] font-mono">
                      1
                    </span>
                    <span>要素一：视频主题 / 核心痛点</span>
                    <span className="text-[10px] text-slate-400 font-normal">（可填，若留空由 AI 推理）</span>
                  </label>
                  {m1Topic.trim() && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 已填写
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={m1Topic}
                  onChange={(e) => setM1Topic(e.target.value)}
                  placeholder="例如：2026现代极简橱柜趋势、海湾50℃高湿环境门板耐候实测..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                />
              </div>

              {/* Element 2: Products */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4A47] text-white flex items-center justify-center text-[10px] font-mono">
                      2
                    </span>
                    <span>要素二：关联产品 / 工法库（可多选）</span>
                    <span className="text-[10px] text-slate-400 font-normal">（可勾选，若留空由 AI 选配）</span>
                  </label>
                  {m1Products.length > 0 && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 已选择 {m1Products.length} 款
                    </span>
                  )}
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

              {/* Element 3: Video Script / Hook Text */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F4A47] text-white flex items-center justify-center text-[10px] font-mono">
                      3
                    </span>
                    <span>要素三：视频文案 / 前3秒黄金钩子口播脚本</span>
                    <span className="text-[10px] text-slate-400 font-normal">（可输入或使用 AI 生成）</span>
                  </label>
                  {m1Script.trim() ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 已填写
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setM1Script(
                          `“为什么你花几十万做的高定，开门总有一声闷响？问题就出在隐形轨道的毫厘之差！普通吊滑门用半年就卡顿变形，真正的高奢私宅都在用这款磁悬浮自吸轨道！”`
                        );
                      }}
                      className="text-[#EA3A20] hover:underline flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>✨ AI 生成爆款脚本</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={m1Script}
                  onChange={(e) => setM1Script(e.target.value)}
                  placeholder="可输入口播文案、前3秒设问金句，或留空让 AI 结合当前主题自动装配高完播口播..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* MODE 2: 对标视频二创 (上传对标视频或链接，AI拆解去重与重制)     */}
          {/* =============================================================== */}
          {creationMode === 'benchmark' && (
            <div className="space-y-5">
              {/* Benchmark Sub-tabs */}
              <div>
                <label className="block text-slate-700 font-bold mb-2 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#EA3A20]" />
                  <span>选择对标视频输入来源</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'preset', label: '选择实战爆款样例 (推荐)', icon: Film },
                    { id: 'file', label: '本地上传对标视频 (MP4/MOV)', icon: UploadCloud },
                    { id: 'url', label: '粘贴短视频链接解析', icon: Link }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setBenchInputType(tab.id as any)}
                        className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all text-xs ${
                          benchInputType === tab.id
                            ? 'border-[#0F4A47] bg-emerald-50/50 text-[#0F4A47] shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Source Input 1: Preset Samples */}
              {benchInputType === 'preset' && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    选择同行动作爆款对标视频进行深度拆解与重制：
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {BENCHMARK_VIDEO_PRESETS.map((bench) => (
                      <button
                        key={bench.id}
                        type="button"
                        onClick={() => setSelectedBenchPresetId(bench.id)}
                        className={`p-3 text-left rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          selectedBenchPresetId === bench.id
                            ? 'border-[#EA3A20] bg-rose-50/40 text-slate-900 ring-2 ring-[#EA3A20]/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <img
                          src={bench.cover}
                          alt={bench.title}
                          className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                              {bench.platform}
                            </span>
                            <span className="font-mono">{bench.duration} | {bench.aspect}</span>
                          </div>
                          <div className="font-bold text-xs text-slate-900 truncate">{bench.title}</div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 italic">
                            {bench.originalScript}
                          </p>
                          <div className="text-[10px] text-emerald-700 font-medium mt-1">
                            💡 拆解结构：{bench.structureAnalysis}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Input 2: File Upload */}
              {benchInputType === 'file' && (
                <div className="p-6 border-2 border-dashed border-slate-300 hover:border-[#EA3A20] rounded-2xl bg-slate-50 text-center transition-all">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="font-bold text-xs text-slate-800">
                    {benchUploadedFileName ? `已成功载入：${benchUploadedFileName}` : '点击或拖拽上传对标短视频文件'}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    支持 MP4 / MOV / AVI 格式，单个文件不超过 500MB，AI 自动抽帧拆解分镜与提取音频
                  </p>
                  <label className="inline-block mt-3 px-4 py-1.5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-xl font-bold text-xs cursor-pointer shadow-2xs">
                    <span>选择本地视频</span>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-matroska"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setBenchUploadedFileName(file.name);
                        }
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Source Input 3: URL Parse */}
              {benchInputType === 'url' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-slate-700 font-bold">粘贴短视频分享链接</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={benchUrl}
                      onChange={(e) => setBenchUrl(e.target.value)}
                      placeholder="支持抖音、快手、小红书、TikTok、视频号分享短链..."
                      className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setBenchUrl('https://v.douyin.com/iRo9sXq/ (已抓取原片分镜)');
                      }}
                      className="px-4 py-2 bg-[#0F4A47] text-white font-bold rounded-xl text-xs hover:bg-[#0b3836] cursor-pointer shrink-0"
                    >
                      智能抓取解析
                    </button>
                  </div>
                </div>
              )}

              {/* AI Benchmark Analysis Report Card */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>AI 对标视频特征萃取看板</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                    完播预测 89% · 平均切镜 2.6s
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 space-y-1">
                  <p>
                    <strong className="text-slate-900">原片口播提取：</strong>
                    {currentBenchmark.originalScript}
                  </p>
                  <p>
                    <strong className="text-slate-900">推荐二创方向：</strong>
                    {currentBenchmark.recommendedRemakeStrategy}
                  </p>
                </div>
              </div>

              {/* Remake Settings (二创混剪要素) */}
              <div className="space-y-3 pt-1">
                <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-700" />
                  <span>市面平台混剪去重与重制策略配置</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'rewrite', label: '同款去重洗稿', desc: '保留爆款逻辑，文案改写降重' },
                    { id: 'painpoint', label: '痛点转移策略', desc: '将原片竞品缺陷转为我司工艺' },
                    { id: 'bilingual', label: '中英双语出海', desc: '原片译制为母语级外贸口播' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setBenchRemakeStrategy(s.id as any)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        benchRemakeStrategy === s.id
                          ? 'border-[#EA3A20] bg-rose-50/50 text-slate-900 ring-1 ring-[#EA3A20]'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs">{s.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={benchReplaceVisuals}
                      onChange={(e) => setBenchReplaceVisuals(e.target.checked)}
                      className="w-4 h-4 text-[#EA3A20] rounded border-slate-300 focus:ring-[#EA3A20]"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-800">替换为我司4K实拍镜头库</div>
                      <div className="text-[10px] text-slate-400">规避原片版权侵权，凸显真实智造工厂</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={benchAntiDuplicationFilter}
                      onChange={(e) => setBenchAntiDuplicationFilter(e.target.checked)}
                      className="w-4 h-4 text-[#EA3A20] rounded border-slate-300 focus:ring-[#EA3A20]"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-800">智能抽帧与动态变焦去重</div>
                      <div className="text-[10px] text-slate-400">消除视频MD5指纹，提升平台推流权重</div>
                    </div>
                  </label>
                </div>

                {/* Target product binding */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">二创重点植入的高定产品</label>
                  <select
                    value={benchTargetProduct}
                    onChange={(e) => setBenchTargetProduct(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
                  >
                    {AVAILABLE_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} · {p.tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* MODE 3: 多素材矩阵混剪 (分层挑选素材、随机裂变批量成片)        */}
          {/* =============================================================== */}
          {creationMode === 'matrix' && (
            <div className="space-y-5">
              <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-2.5">
                <Shuffle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span>素材分层装配与矩阵裂变混剪</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-200/70 text-indigo-900 font-mono text-[10px]">
                      智能卡点装配
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    将实拍素材按「片头钩子层」、「片中工法卖点层」、「片尾转化层」进行分层组合，AI 智能根据 BGM 重音鼓点卡点切镜并自动去重。
                  </p>
                </div>
              </div>

              {/* Hook Layer */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded text-[10px]">片头层</span>
                    <span>前3秒抓人吸睛素材 (Hook 候选)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">已选 {matrixHookShots.length} 个镜头</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_VIDEO_MATERIALS.slice(0, 2).map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() =>
                        setMatrixHookShots((prev) =>
                          prev.includes(mat.id) ? prev.filter((id) => id !== mat.id) : [...prev, mat.id]
                        )
                      }
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                        matrixHookShots.includes(mat.id)
                          ? 'border-[#EA3A20] bg-rose-50/50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <img src={mat.thumbnail} alt="" className="w-12 h-9 rounded object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs truncate">{mat.title}</div>
                        <div className="text-[10px] text-slate-400">{mat.duration} | {mat.categoryLabel}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Layer */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[10px]">片中层</span>
                    <span>核心卖点与工法微距实拍镜头 (Body 候选)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">已选 {matrixBodyShots.length} 个镜头</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_VIDEO_MATERIALS.slice(2, 5).map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() =>
                        setMatrixBodyShots((prev) =>
                          prev.includes(mat.id) ? prev.filter((id) => id !== mat.id) : [...prev, mat.id]
                        )
                      }
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                        matrixBodyShots.includes(mat.id)
                          ? 'border-[#0F4A47] bg-emerald-50/50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <img src={mat.thumbnail} alt="" className="w-10 h-8 rounded object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs truncate">{mat.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{mat.categoryLabel}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Matrix Control Parameters */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">矩阵批量裂变工程数</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { count: 1, label: '生成 1 条深度精品' },
                      { count: 3, label: '生成 3 条不同分镜' },
                      { count: 5, label: '批量裂变 5 条矩阵' }
                    ].map((item) => (
                      <button
                        key={item.count}
                        type="button"
                        onClick={() => setMatrixOutputCount(item.count)}
                        className={`py-2 px-2 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                          matrixOutputCount === item.count
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-700 font-bold">混剪去重算法开关</label>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={matrixShuffleOrder}
                        onChange={(e) => setMatrixShuffleOrder(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>随机组合排列镜头，确保每条视频镜头次序不重复</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={matrixBeatSync}
                        onChange={(e) => setMatrixBeatSync(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>依附 BGM 鼓点重音自动卡点切镜</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* Universal Cutting Settings (市面混剪平台通用核心设置)          */}
          {/* =============================================================== */}
          <div className="pt-4 border-t border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>输出格式与卡点音频控制（混剪平台通用）</span>
              </h3>
              <span className="text-[10px] text-slate-400">4K HDR 60fps 硬件加速渲染</span>
            </div>

            {/* Aspect Ratio & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">画面画幅比例</label>
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
                    <span>9:16 竖屏短视频</span>
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
                    <span>16:9 横屏宣传大片</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">目标成片时长</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { sec: 15, label: '15秒 (黄金完播)' },
                    { sec: 20, label: '20秒 (工法解密)' },
                    { sec: 30, label: '30秒 (全案大片)' }
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

            {/* BGM & Voiceover Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-indigo-500" />
                  <span>BGM 节拍音乐卡点库</span>
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
                  <span>AI 智能解说声线与语速</span>
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
            {creationMode === 'elements' && (
              <span>
                当前要素满足状态：
                <strong className="text-emerald-700 font-bold">
                  {elementsFilledCount > 0 ? `已填写 ${elementsFilledCount}/3 项 (已就绪可生成)` : '可直接生成 (由 AI 自动推配)'}
                </strong>
              </span>
            )}
            {creationMode === 'benchmark' && (
              <span>
                对标视频：<strong className="text-slate-800 font-bold">{currentBenchmark.title.slice(0, 20)}...</strong>
              </span>
            )}
            {creationMode === 'matrix' && (
              <span>
                混剪方案：<strong className="text-slate-800 font-bold">装配 {matrixHookShots.length + matrixBodyShots.length + matrixCtaShots.length} 个镜头组合</strong>
              </span>
            )}
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
                    {creationMode === 'elements'
                      ? '生成视频工程并进入 AI 剪辑'
                      : creationMode === 'benchmark'
                      ? '一键对标二创并进入 AI 剪辑'
                      : '批量矩阵装配并进入 AI 剪辑'}
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
