import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  RotateCcw,
  Sliders,
  ChevronDown,
  Check,
  Building2,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  X,
  Share2,
  Trash2,
  Eye,
  Smartphone,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  FileCode,
  QrCode,
  Maximize2,
  Minimize2,
  Laptop,
  Image as ImageIcon,
  Film,
  Tag,
  Palette,
  Wand2,
  Bot,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Mic,
  MicOff,
  Keyboard,
  Plus,
  Loader2,
  RefreshCw,
  FolderOpen,
  ZoomIn,
  FileText,
  ArrowLeft,
  LayoutGrid,
  List,
  Paperclip,
  Music,
  Activity,
  Play,
  Volume2,
  Download,
  Calendar,
  Scissors
} from 'lucide-react';
import {
  VideoClipItem,
  VideoClipStatus,
  VideoMaterialItem,
  VideoShot,
  INITIAL_VIDEO_CLIPS,
  AVAILABLE_VIDEO_MATERIALS,
  AVAILABLE_BGM_TRACKS,
  AVAILABLE_VOICEOVERS
} from '../../../data/videoClipData';
import { VideoClipList } from './VideoClipList';
import { CreateVideoClipModal } from './CreateVideoClipModal';
import { VideoPlayerMockup } from './VideoPlayerMockup';
import { useVoiceToText } from '../../../hooks/useVoiceToText';
import { VoiceInputBanner } from '../../common/VoiceInputBanner';
import { useChatAttachment } from '../../../hooks/useChatAttachment';
import { ChatAttachmentDropZone } from '../../common/ChatAttachmentDropZone';
import { ImagePreviewModal } from '../../common/ImagePreviewModal';

// --------------------------------------------------------------------------
// Types for Video Chat Messages
// --------------------------------------------------------------------------
export interface VideoChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
  size?: string;
}

export interface VideoChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isGenerating?: boolean;
  generationTimeMs?: number;
  modifiedSummary?: string[];
  attachedMaterials?: VideoMaterialItem[];
  attachments?: VideoChatAttachment[];
}

interface VideoClipModuleProps {
  onNavigateToPlan?: () => void;
}

export const VideoClipModule: React.FC<VideoClipModuleProps> = ({ onNavigateToPlan }) => {
  // --------------------------------------------------------------------------
  // Core State: Video Being Edited & List of Video Projects
  // --------------------------------------------------------------------------
  const [currentVideo, setCurrentVideo] = useState<VideoClipItem>(INITIAL_VIDEO_CLIPS[0]);
  const [videosList, setVideosList] = useState<VideoClipItem[]>(INITIAL_VIDEO_CLIPS);

  // View Mode: 'list' (工程管理列表) | 'editor' (三栏实时分镜微调工作台)
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Left & Right Panel Collapsed States
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(false);

  // Left Media Library Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [materialSearchQuery, setMaterialSearchQuery] = useState<string>('');
  const [selectedMaterialToAttach, setSelectedMaterialToAttach] = useState<VideoMaterialItem | null>(null);
  const [previewZoomMedia, setPreviewZoomMedia] = useState<VideoMaterialItem | null>(null);
  const [mediaViewMode, setMediaViewMode] = useState<'grid' | 'list'>('grid');

  // Preview & Device State
  const [displayDeviceMode, setDisplayDeviceMode] = useState<'phone' | 'wide'>('phone');
  const [activePlayerTab, setActivePlayerTab] = useState<'player' | 'storyboard'>('player');
  const [isFullScreenPreview, setIsFullScreenPreview] = useState<boolean>(false);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [showExportSuccessToast, setShowExportSuccessToast] = useState<boolean>(false);
  const [isSyncingJianying, setIsSyncingJianying] = useState<boolean>(false);
  const [showJianyingSuccessToast, setShowJianyingSuccessToast] = useState<boolean>(false);
  const [copySuccessToast, setCopySuccessToast] = useState<boolean>(false);

  // Chat Messages State
  const initialMessages: VideoChatMessage[] = [
    {
      id: 'msg-init-ai',
      sender: 'assistant',
      content: `您好！我是您的**全案短视频 AI 导演助手**。已为您基于当前产品库与迪拜精装案例自动装配生成了短视频工程：\n\n- **视频主题**：${currentVideo.title}\n- **画幅与时长**：【${currentVideo.aspectRatio} 竖屏】· ${currentVideo.durationText} · ${currentVideo.resolution}\n- **前3秒黄金钩子**：${currentVideo.hookText}\n- **已装配分镜**：共 ${currentVideo.shots.length} 个镜头（包含航拍推镜、豪迈激光封边微距、极窄吊滑自吸实测）\n- **BGM 与声线**：${currentVideo.bgmTrack.title} (${currentVideo.bgmTrack.bpm} BPM) · ${currentVideo.voiceover.speakerName}\n\n您可以在对话中随时输入微调指令（如“重写前3秒钩子”、“加快剪辑节奏”、“BGM对齐鼓点”、“替换分镜镜头”、“增加醒目字幕花字”等），右侧播放器将**实时无缝动态预览**！`,
      timestamp: '11:00',
      modifiedSummary: ['4K分镜自动装配完成', '已挂载 3 款高定BOM镜头', '对齐 112 BPM 轻奢爵士鼓点']
    },
    {
      id: 'msg-user-sample',
      sender: 'user',
      content: '把前3秒的口播钩子改得更具痛点设问感，突出普通橱柜受潮发黑和高定耐用度的反差；另外把第2个分镜的字幕改成金色高光大字。',
      timestamp: '11:02'
    },
    {
      id: 'msg-ai-sample',
      sender: 'assistant',
      content: `已为您优化黄金钩子口播与第2分镜花字动效！\n\n**修改说明**：\n1. **重构前3秒黄金钩子**：更新为“为什么别人家高定用十年像新装，普通橱柜用三年就受潮发黑？隐形封边决定寿命！”\n2. **更新分镜2字幕花字**：已应用「【零度超亚】50,000次耐刮磨实验室检测背书」金色高光发光动态效果。\n\n👉 **右侧播放器已实时重绘**，您可以点击播放查看卡点与花字动效！`,
      timestamp: '11:03',
      generationTimeMs: 1150,
      modifiedSummary: ['优化前3秒设问痛点黄金钩子', '分镜2应用金色高光大字动效']
    }
  ];

  const [messages, setMessages] = useState<VideoChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'keyboard' | 'voice'>('keyboard');
  const [previewModalImage, setPreviewModalImage] = useState<{ url: string; name: string } | null>(null);

  // Chat attachments: Ctrl+V clipboard paste & Drag-and-drop
  const {
    pendingAttachments,
    isDragOver,
    handlePaste,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    removeAttachment,
    clearAttachments,
    processFiles
  } = useChatAttachment();

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isAiThinking]);

  // Voice to text integration
  const {
    isListening,
    transcript,
    interimTranscript,
    audioLevel,
    lang,
    setLang,
    errorMsg,
    startListening,
    stopListening
  } = useVoiceToText({
    defaultLang: 'zh-CN',
    contextHint: 'general',
    onTranscriptChange: (text) => {
      setInputMessage(text);
    }
  });

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
      setInputMode('keyboard');
    } else {
      setInputMode('voice');
      startListening();
    }
  };

  const handleVoiceConfirm = () => {
    stopListening();
    setInputMode('keyboard');
  };

  const handleVoiceCancel = () => {
    stopListening();
    setInputMessage('');
    setInputMode('keyboard');
  };

  // Filter video materials in left library
  const filteredMaterials = useMemo(() => {
    return AVAILABLE_VIDEO_MATERIALS.filter((mat) => {
      if (selectedCategory !== 'all' && mat.category !== selectedCategory) return false;
      if (materialSearchQuery.trim()) {
        const q = materialSearchQuery.toLowerCase();
        const matchTitle = mat.title.toLowerCase().includes(q);
        const matchTags = mat.tags.some((t) => t.toLowerCase().includes(q));
        const matchCode = mat.code.toLowerCase().includes(q);
        if (!matchTitle && !matchTags && !matchCode) return false;
      }
      return true;
    });
  }, [selectedCategory, materialSearchQuery]);

  // --------------------------------------------------------------------------
  // Navigation & Video Project Management Handlers
  // --------------------------------------------------------------------------
  const handleSelectVideo = (video: VideoClipItem) => {
    setCurrentVideo(video);
    setDisplayDeviceMode(video.aspectRatio === '9:16' ? 'phone' : 'wide');
    setViewMode('editor');
    // Initialize welcome conversation for this video
    setMessages([
      {
        id: `msg-init-${video.id}`,
        sender: 'assistant',
        content: `您好！我是您的**全案短视频 AI 导演助手**。已为您载入短视频工程：\n\n- **视频主题**：${video.title}\n- **画幅与时长**：【${video.aspectRatio}】· ${video.durationText} · ${video.resolution}\n- **黄金钩子**：${video.hookText}\n- **分镜镜头数**：共 ${video.shots.length} 个分镜\n- **BGM 音轨**：${video.bgmTrack.title} (${video.bgmTrack.bpm} BPM)\n- **AI 旁白**：${video.voiceover.speakerName}\n\n您可以在对话中随时输入修改指令（如修改旁白文案、替换分镜镜头、重选BGM、调整转场特效等），右侧播放器将**实时无缝同步更新**！`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        modifiedSummary: ['工程载入完成', `已就绪 ${video.shots.length} 个镜头分镜`, `BGM: ${video.bgmTrack.title.split(' ')[0]}`]
      }
    ]);
  };

  const handleCreateVideo = (newVideo: VideoClipItem) => {
    setVideosList((prev) => [newVideo, ...prev]);
    handleSelectVideo(newVideo);
  };

  const handleDeleteVideo = (id: string) => {
    setVideosList((prev) => {
      const target = prev.find((v) => v.id === id);
      if (!target) return prev;
      if (target.status === '回收站') {
        // 彻底从工程列表中清除
        return prev.filter((v) => v.id !== id);
      } else {
        // 移入回收站
        return prev.map((v) => (v.id === id ? { ...v, status: '回收站' as VideoClipStatus } : v));
      }
    });

    if (currentVideo.id === id) {
      const remaining = videosList.filter((v) => v.id !== id && v.status !== '回收站');
      if (remaining.length > 0) {
        setCurrentVideo(remaining[0]);
      }
    }
  };

  const handleRestoreVideo = (id: string) => {
    setVideosList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: '剪辑中' as VideoClipStatus } : v))
    );
  };

  const handleUpdateStatus = (id: string, newStatus: VideoClipStatus) => {
    setVideosList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
    if (currentVideo.id === id) {
      setCurrentVideo((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handlePreviewVideo = (video: VideoClipItem) => {
    setCurrentVideo(video);
    setIsFullScreenPreview(true);
  };

  // --------------------------------------------------------------------------
  // Handle Sending a Modification Command to Video AI Copilot
  // --------------------------------------------------------------------------
  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputMessage;
    const hasAttachments = pendingAttachments.length > 0;
    if (!rawText.trim() && !selectedMaterialToAttach && !hasAttachments) return;

    const attachedMat = selectedMaterialToAttach;
    const attachmentsToSend: VideoChatAttachment[] = pendingAttachments.map((att) => ({
      id: att.id,
      name: att.name,
      type: att.type,
      url: att.previewUrl,
      size: att.size
    }));

    let userText = rawText.trim();
    if (!userText) {
      if (attachedMat) {
        userText = `请将镜头素材【${attachedMat.title}】插入到当前视频的分镜中。`;
      } else if (attachmentsToSend.length > 0) {
        userText = attachmentsToSend.some((a) => a.type === 'image')
          ? '请将我上传的现场实拍素材进行分析，并作为高光分镜替换至视频工程中。'
          : '已上传视频脚本或技术文件，请提取亮点优化旁白口播。';
      }
    }

    // 1. Append User Message
    const userMsg: VideoChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      attachedMaterials: attachedMat ? [attachedMat] : undefined,
      attachments: attachmentsToSend.length > 0 ? attachmentsToSend : undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSelectedMaterialToAttach(null);
    clearAttachments();
    setIsAiThinking(true);

    // 2. Simulate AI Processing & Modifying Video State
    setTimeout(() => {
      setIsAiThinking(false);
      const lower = userText.toLowerCase();

      let updatedVideo = { ...currentVideo };
      let modifications: string[] = [];

      // Check for uploaded attachments
      if (attachmentsToSend.length > 0) {
        const attNames = attachmentsToSend.map((a) => `【${a.name}】`).join('、');
        const imgAtt = attachmentsToSend.find((a) => a.type === 'image');
        if (imgAtt) {
          // Replace second shot preview
          const newShots = [...updatedVideo.shots];
          if (newShots.length > 1) {
            newShots[1] = {
              ...newShots[1],
              previewImage: imgAtt.url,
              technicalSpec: '用户自定义高光镜头素材'
            };
            updatedVideo.shots = newShots;
          }
          modifications.push(`已将您上传的素材${attNames}替换进分镜2并同步调整色彩饱和度`);
        } else {
          modifications.push(`已解析文件${attNames}，提取技术参数优化口播旁白`);
        }
      }

      // Check for Hook text modifications
      if (lower.includes('钩子') || lower.includes('前3秒') || lower.includes('hook') || lower.includes('吸引人') || lower.includes('留客')) {
        const hookOptions = [
          '“为什么装了全屋定制的人，三年后都后悔没选极窄磁悬浮门？看完这条少花冤枉钱！”',
          '“普通高定看表面，真正的高奢看收口！今天带你微距拆解价值百万的豪宅木作！”',
          '“花了几十万装橱柜，到底是一次性用品还是能用十年？来看看这块水泡了72小时的门板！”'
        ];
        const newHook = hookOptions[Math.floor(Math.random() * hookOptions.length)];
        updatedVideo.hookText = newHook;
        const newShots = [...updatedVideo.shots];
        if (newShots.length > 0) {
          newShots[0] = { ...newShots[0], voiceoverScript: newHook };
          updatedVideo.shots = newShots;
        }
        modifications.push('重构前3秒黄金钩子，强化痛点设问与完播率');
      }

      // Check for BGM modifications
      if (lower.includes('bgm') || lower.includes('背景音乐') || lower.includes('音乐') || lower.includes('卡点') || lower.includes('鼓点') || lower.includes('爵士') || lower.includes('节奏')) {
        if (lower.includes('卡点') || lower.includes('节奏') || lower.includes('电子')) {
          updatedVideo.bgmTrack = AVAILABLE_BGM_TRACKS[1];
          modifications.push('BGM 切换为【Precision Craftsmanship 硬核卡点电子】，分镜切点精准吸附 128 BPM 鼓点');
        } else if (lower.includes('交响') || lower.includes('大气') || lower.includes('大片')) {
          updatedVideo.bgmTrack = AVAILABLE_BGM_TRACKS[3];
          modifications.push('BGM 切换为【Grand Architectural Future 大师交响】，增强海外高定大片质感');
        } else {
          updatedVideo.bgmTrack = AVAILABLE_BGM_TRACKS[0];
          modifications.push('BGM 切换为【Milan Luxury Lifestyle 轻奢爵士】，营造空间呼吸感');
        }
      }

      // Check for Voiceover modifications
      if (lower.includes('配音') || lower.includes('旁白') || lower.includes('声音') || lower.includes('男声') || lower.includes('女声') || lower.includes('双语') || lower.includes('英文')) {
        if (lower.includes('英文') || lower.includes('双语') || lower.includes('商业')) {
          updatedVideo.voiceover = AVAILABLE_VOICEOVERS[0];
          modifications.push('切换为【James 磁性英音商业男声】，提升出海专业信任背书');
        } else if (lower.includes('工匠') || lower.includes('师傅') || lower.includes('硬核')) {
          updatedVideo.voiceover = AVAILABLE_VOICEOVERS[2];
          modifications.push('切换为【李工 20年资深木作工艺师】原声解密风格');
        } else {
          updatedVideo.voiceover = AVAILABLE_VOICEOVERS[1];
          modifications.push('切换为【Sophia 优雅轻奢美音女声】，增强中高净值业主情感共鸣');
        }
      }

      // Check for Subtitle / Caption flower words modifications
      if (lower.includes('字幕') || lower.includes('花字') || lower.includes('特效') || lower.includes('金色')) {
        const newShots = updatedVideo.shots.map((s, idx) => {
          if (idx === 1) {
            return {
              ...s,
              captionEffect: '金色奢华高光爆款花字',
              subtitles: '【零度超亚】50,000次耐刮磨 · 实验室实测无痕'
            };
          }
          return s;
        });
        updatedVideo.shots = newShots;
        modifications.push('分镜字幕应用高转化【金色奢华高光花字】与卖点微标');
      }

      // Check for attaching / inserting material
      if (attachedMat) {
        const newShots = [...updatedVideo.shots];
        if (newShots.length > 2) {
          newShots[2] = {
            ...newShots[2],
            previewImage: attachedMat.thumbnail,
            cameraMotion: '顺滑推镜 + 景深虚化聚焦',
            voiceoverScript: `针对${attachedMat.title}，采用微米级严苛公差与无胶缝工法。`,
            subtitles: `【${attachedMat.categoryLabel}】${attachedMat.title.slice(0, 18)}`,
            technicalSpec: attachedMat.description
          };
          updatedVideo.shots = newShots;
          modifications.push(`已将素材【${attachedMat.title}】装配至分镜3`);
        }
      }

      // Fallback modification message
      if (modifications.length === 0) {
        modifications.push('微调了分镜运镜焦距与旁白口播节奏');
        const newShots = [...updatedVideo.shots];
        if (newShots.length > 0) {
          newShots[0] = {
            ...newShots[0],
            cameraMotion: '前推缓入 + 景深自适应平滑变焦'
          };
          updatedVideo.shots = newShots;
        }
      }

      // Update state
      setCurrentVideo(updatedVideo);
      setVideosList((prev) => prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)));

      // Append AI Message
      const aiReply: VideoChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        content: `已为您完成视频分镜与音频轨道优化！\n\n**修改说明**：\n${modifications
          .map((m, i) => `${i + 1}. **${m}**`)
          .join('\n')}\n\n👉 **右侧播放器模型已实时无缝更新**，您可以滑动时间轴或点击播放查看最新分镜效果！`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        generationTimeMs: 1200,
        modifiedSummary: modifications
      };

      setMessages((prev) => [...prev, aiReply]);
    }, 1200);
  };

  const handleExportVideo = () => {
    setIsExportingVideo(true);
    setTimeout(() => {
      setIsExportingVideo(false);
      setShowExportSuccessToast(true);
      setTimeout(() => setShowExportSuccessToast(false), 3000);
    }, 1400);
  };

  const handleSyncToJianying = () => {
    setIsSyncingJianying(true);
    setTimeout(() => {
      setIsSyncingJianying(false);
      handleUpdateStatus(currentVideo.id, '已同步到剪映');
      setShowJianyingSuccessToast(true);
      setTimeout(() => setShowJianyingSuccessToast(false), 3500);
    }, 800);
  };

  const handleCopyScript = () => {
    const scriptText = `【视频工程】${currentVideo.title}\n【黄金钩子】${currentVideo.hookText}\n【BGM音轨】${currentVideo.bgmTrack.title}\n【AI配音】${currentVideo.voiceover.speakerName}\n\n【分镜拆解】\n${currentVideo.shots
      .map(
        (s) =>
          `分镜 ${s.order} (${s.timeRange}) [${s.shotType}]\n画面运镜: ${s.cameraMotion}\n口播旁白: ${s.voiceoverScript}\n字幕花字: ${s.subtitles}\n转场音效: ${s.transition} / ${s.soundFx}`
      )
      .join('\n\n')}`;
    navigator.clipboard.writeText(scriptText);
    setCopySuccessToast(true);
    setTimeout(() => setCopySuccessToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden select-none">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. LIST VIEW: 视频工程管理列表 */}
      {/* ---------------------------------------------------------------------- */}
      {viewMode === 'list' && (
        <VideoClipList
          videos={videosList}
          onSelectVideo={handleSelectVideo}
          onCreateNew={() => setIsCreateModalOpen(true)}
          onDeleteVideo={handleDeleteVideo}
          onRestoreVideo={handleRestoreVideo}
          onPreviewVideo={handlePreviewVideo}
        />
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 2. EDITOR VIEW: 三栏式 AI 视频剪辑与故事板生成工作台 */}
      {/* ---------------------------------------------------------------------- */}
      {viewMode === 'editor' && (
        <div className="flex-1 flex overflow-hidden">
          {/* ------------------------------------------------------------------ */}
          {/* COLUMN 1 (LEFT): 视频片段与素材库 (B-Roll Library) */}
          {/* ------------------------------------------------------------------ */}
          <div
            className={`bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 z-10 shrink-0 ${
              isLeftCollapsed ? 'w-0 p-0 border-0 opacity-0 pointer-events-none hidden' : 'w-80'
            }`}
          >
            {/* Left Panel Header with Back to List (Aligned with GraphicTextModule) */}
            <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="h-8 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
                title="返回视频工程列表"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>返回工程库</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-50 text-[#EA3A20] flex items-center justify-center font-bold shrink-0">
                  <Film className="w-3.5 h-3.5" />
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">素材库</h3>
                  <p className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
                    共 {AVAILABLE_VIDEO_MATERIALS.length} 项资产
                  </p>
                </div>
              </div>
            </div>

            {/* Search Box & View Mode Toggle (Aligned with GraphicTextModule) */}
            <div className="p-2.5 border-b border-slate-100 bg-white shrink-0 space-y-2">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={materialSearchQuery}
                    onChange={(e) => setMaterialSearchQuery(e.target.value)}
                    placeholder="搜索分镜镜头、工法实拍..."
                    className="h-7.5 pl-7 pr-6 w-full rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  />
                  {materialSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMaterialSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* JianYing View Switcher (Grid / List) */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg shrink-0 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('grid')}
                    className={`p-1 rounded-md cursor-pointer transition-all ${
                      mediaViewMode === 'grid'
                        ? 'bg-white text-[#EA3A20] shadow-2xs'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="双列紧凑宫格"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('list')}
                    className={`p-1 rounded-md cursor-pointer transition-all ${
                      mediaViewMode === 'list'
                        ? 'bg-white text-[#EA3A20] shadow-2xs'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="紧凑列表视图"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Category Filter Pills (Compact horizontal scroll) */}
              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'case', label: '落地案例' },
                  { key: 'factory', label: '智造车间' },
                  { key: 'macro', label: '硬核特写' },
                  { key: 'render', label: '光影实景' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'bg-[#EA3A20] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

                {/* Materials List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 bg-slate-50/40">
                  {filteredMaterials.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">
                      未找到相关镜头素材
                    </div>
                  ) : mediaViewMode === 'grid' ? (
                    /* 剪映经典 2 列双排紧凑宫格流 */
                    <div className="grid grid-cols-2 gap-2">
                      {filteredMaterials.map((mat) => {
                        const isSelected = selectedMaterialToAttach?.id === mat.id;
                        return (
                          <div
                            key={mat.id}
                            onClick={() => {
                              setSelectedMaterialToAttach(isSelected ? null : mat);
                            }}
                            className={`group bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-md flex flex-col relative cursor-pointer ${
                              isSelected
                                ? 'border-[#EA3A20] ring-2 ring-[#EA3A20]/20 bg-rose-50/10'
                                : 'border-slate-200/80 hover:border-[#EA3A20]/70'
                            }`}
                          >
                            {/* Compact 16:10 Thumbnail Stage */}
                            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                              <img
                                src={mat.thumbnail}
                                alt={mat.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                              {/* Duration Badge */}
                              <div className="absolute top-1 left-1 pointer-events-none">
                                <span className="px-1.5 py-0.2 rounded bg-black/65 backdrop-blur-xs text-white text-[9px] font-mono leading-tight flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                                  {mat.duration}
                                </span>
                              </div>

                              {/* Aspect/Resolution Badge */}
                              <div className="absolute bottom-1 left-1 pointer-events-none">
                                <span className="px-1 py-0.2 rounded bg-black/60 backdrop-blur-xs text-white/90 text-[8.5px] font-mono leading-tight">
                                  {mat.aspectRatio}
                                </span>
                              </div>

                              {/* Hover Overlay with Quick Actions */}
                              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-1.5 backdrop-blur-[0.5px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-amber-300 font-mono font-bold truncate">
                                    {mat.categoryLabel}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewZoomMedia(mat);
                                    }}
                                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
                                    title="放大预览大图与参数"
                                  >
                                    <ZoomIn className="w-2.5 h-2.5" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMaterialToAttach(isSelected ? null : mat);
                                  }}
                                  className={`w-full py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all ${
                                    isSelected
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-[#EA3A20] hover:bg-[#c42810] text-white'
                                  }`}
                                >
                                  {isSelected ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>已引用</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3" />
                                      <span>引用</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Compact Title & Category */}
                            <div className="p-1.5 bg-white">
                              <div
                                className="text-[11px] font-bold text-slate-800 truncate group-hover:text-[#EA3A20] transition-colors leading-tight"
                                title={mat.title}
                              >
                                {mat.title}
                              </div>
                              <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                                <span>{mat.categoryLabel}</span>
                                <span className="text-slate-300">|</span>
                                <span>{mat.resolution}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* 紧凑列表流模式 */
                    <div className="space-y-1.5">
                      {filteredMaterials.map((mat) => {
                        const isSelected = selectedMaterialToAttach?.id === mat.id;
                        return (
                          <div
                            key={mat.id}
                            onClick={() => {
                              setSelectedMaterialToAttach(isSelected ? null : mat);
                            }}
                            className={`group bg-white rounded-xl border p-1.5 flex items-center gap-2 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer ${
                              isSelected
                                ? 'border-[#EA3A20] ring-2 ring-[#EA3A20]/20 bg-rose-50/10'
                                : 'border-slate-200/80 hover:border-slate-300'
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="relative w-14 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                              <img
                                src={mat.thumbnail}
                                alt={mat.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/70 text-[8px] text-white font-mono leading-none">
                                {mat.duration}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewZoomMedia(mat);
                                }}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                                title="放大预览"
                              >
                                <ZoomIn className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Title & Specs */}
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold text-slate-800 truncate leading-tight group-hover:text-[#EA3A20]">
                                {mat.title}
                              </div>
                              <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-mono mt-0.5">
                                <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                                  {mat.categoryLabel}
                                </span>
                                <span>•</span>
                                <span>{mat.aspectRatio}</span>
                                <span>•</span>
                                <span>{mat.resolution}</span>
                              </div>
                            </div>

                            {/* Action button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMaterialToAttach(isSelected ? null : mat);
                              }}
                              className={`h-6.5 px-2 rounded-lg text-[10px] font-bold flex items-center gap-0.5 shrink-0 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#EA3A20] text-white shadow-2xs'
                                  : 'bg-rose-50 hover:bg-[#EA3A20] text-[#EA3A20] hover:text-white'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>已引用</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>引用</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Left Panel Footer Summary */}
                <div className="px-3 py-2 bg-slate-50 border-t border-slate-200/80 text-[10.5px] text-slate-500 flex items-center justify-between shrink-0">
                  <span>共 {filteredMaterials.length} 条素材</span>
                  <span className="text-slate-400 text-[10px]">点击素材快速引用</span>
                </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* COLUMN 2 (MIDDLE): 视频剪辑对话控制台 */}
          {/* ------------------------------------------------------------------ */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-200/80 min-w-[380px]">
            {/* Top Workspace Navigation Bar (Aligned with GraphicTextModule) */}
            <div className="p-3.5 px-5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* If left panel is collapsed, provide quick return to list */}
                {isLeftCollapsed && (
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 mr-1"
                    title="返回列表"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>返回列表</span>
                  </button>
                )}

                {/* Toggle Left Material Panel Button (Aligned position) */}
                <button
                  type="button"
                  onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0 border border-slate-200/60"
                  title={isLeftCollapsed ? '展开素材库' : '收起素材库'}
                >
                  {isLeftCollapsed ? <PanelLeftOpen className="w-4 h-4 text-[#0F4A47]" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>

                <div className="w-8 h-8 rounded-xl bg-[#EA3A20] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Film className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-slate-900 truncate">
                      {currentVideo.title}
                    </h2>
                    {/* Status Pill & Selector */}
                    <div className="relative group shrink-0">
                      <select
                        value={currentVideo.status}
                        onChange={(e) =>
                          handleUpdateStatus(currentVideo.id, e.target.value as VideoClipStatus)
                        }
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none ${
                          currentVideo.status === '剪辑中'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : currentVideo.status === '已同步到剪映'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : currentVideo.status === '发布审核中'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : currentVideo.status === '审核不通过'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : currentVideo.status === '计划发布'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : currentVideo.status === '已发布'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                        title="点击可修改工程状态"
                      >
                        <option value="剪辑中">剪辑中</option>
                        <option value="已同步到剪映">已同步到剪映</option>
                        <option value="发布审核中">发布审核中</option>
                        <option value="审核不通过">审核不通过</option>
                        <option value="计划发布">计划发布</option>
                        <option value="已发布">已发布</option>
                        <option value="回收站">回收站</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 truncate font-mono">
                    {currentVideo.language && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold font-sans text-[10px]">
                        {currentVideo.language}
                      </span>
                    )}
                    <span>{currentVideo.aspectRatio}</span>
                    <span>·</span>
                    <span>{currentVideo.durationText}</span>
                    <span>·</span>
                    <span>{currentVideo.shots.length} 个分镜</span>
                    <span>·</span>
                    <span>{currentVideo.publishPlatform}</span>
                  </p>
                </div>
              </div>

              {/* Panel Collapse Toggles */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsRightCollapsed(!isRightCollapsed)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
                  title={isRightCollapsed ? '展开实时播放器' : '折叠实时播放器'}
                >
                  {isRightCollapsed ? <PanelRightOpen className="w-4 h-4 text-[#EA3A20]" /> : <PanelRightClose className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Middle Chat Messages List */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 bg-slate-50/50"
            >
              {messages.map((msg) => {
                const isAi = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        isAi
                          ? 'bg-[#EA3A20] text-white'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Bubble Content */}
                    <div className={`space-y-1.5 max-w-[85%] ${isAi ? 'items-start' : 'items-end'}`}>
                      <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-600">{isAi ? 'AI 视频导演助手' : '视频运营师'}</span>
                        <span>{msg.timestamp}</span>
                        {msg.generationTimeMs && (
                          <span className="text-emerald-600 font-mono">
                            ⚡ {msg.generationTimeMs}ms
                          </span>
                        )}
                      </div>

                      {/* Attached Material Badge in User Message */}
                      {msg.attachedMaterials && msg.attachedMaterials.length > 0 && (
                        <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                          <Film className="w-3.5 h-3.5 text-[#EA3A20] shrink-0" />
                          <span className="font-bold truncate">
                            已引用镜头素材：{msg.attachedMaterials[0].title}
                          </span>
                        </div>
                      )}

                      {/* Attachments (Images/Files) */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.attachments.map((att) => (
                            <div
                              key={att.id}
                              onClick={() => {
                                if (att.type === 'image') {
                                  setPreviewModalImage({ url: att.url, name: att.name });
                                }
                              }}
                              className={`p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2 text-xs ${
                                att.type === 'image' ? 'cursor-pointer hover:border-rose-300' : ''
                              }`}
                            >
                              {att.type === 'image' ? (
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="w-10 h-10 object-cover rounded-lg shrink-0"
                                />
                              ) : (
                                <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 truncate max-w-[140px]">
                                  {att.name}
                                </p>
                                <span className="text-[10px] text-slate-400">{att.size || '附件'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Text Bubble */}
                      <div
                        className={`p-4 rounded-3xl text-xs leading-relaxed shadow-sm ${
                          isAi
                            ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                            : 'bg-slate-900 text-white rounded-tr-xs'
                        }`}
                      >
                        <div className="prose prose-xs max-w-none text-inherit prose-headings:font-bold prose-headings:text-inherit prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        {/* Modified Summary Badges */}
                        {msg.modifiedSummary && msg.modifiedSummary.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {msg.modifiedSummary.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full bg-rose-50 text-[#EA3A20] text-[10px] font-medium border border-rose-100 flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3 text-[#EA3A20]" />
                                <span>{item}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiThinking && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-[#EA3A20] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3.5 rounded-3xl rounded-tl-xs text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EA3A20]" />
                    <span>AI 正在匹配镜头素材并渲染分镜时间轴...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Recommendation Chips */}
            <div className="px-5 py-2.5 bg-slate-50/80 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0 text-xs">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-[#EA3A20]" />
                <span>AI 快速指令:</span>
              </span>
              {[
                '⚡ 重写前3秒黄金钩子(Hook)吸引完播',
                '🎬 加快分镜剪辑节奏，对齐BGM重音卡点',
                '🎙️ 切换为中英双语磁性商业男声AI旁白',
                '🏷️ 为第2分镜添加9:16竖屏金色高光花字',
                '🎵 更换为轻奢慢调高级感工法BGM',
                '🔬 将分镜2替换为豪迈微米激光封边微距'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendMessage(chip.slice(2).trim())}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/50 text-slate-600 hover:text-[#EA3A20] text-[11px] font-medium whitespace-nowrap transition-all shadow-2xs cursor-pointer shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Area with Attachments & DropZone */}
            <div className="p-4 bg-white border-t border-slate-200/80 shrink-0 space-y-2">
              {/* Selected Material From Left Library Badge */}
              {selectedMaterialToAttach && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Film className="w-3.5 h-3.5 text-[#EA3A20] shrink-0" />
                    <span className="font-bold text-rose-900 truncate">
                      准备插入镜头素材：{selectedMaterialToAttach.title}
                    </span>
                    <span className="text-[10px] text-rose-600 font-mono shrink-0">
                      ({selectedMaterialToAttach.duration})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMaterialToAttach(null)}
                    className="p-1 text-rose-500 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Voice Input Banner */}
              {inputMode === 'voice' && (
                <VoiceInputBanner
                  isListening={isListening}
                  transcript={transcript}
                  interimTranscript={interimTranscript}
                  audioLevel={audioLevel}
                  lang={lang}
                  onToggleLang={() => setLang(lang === 'zh-CN' ? 'en-US' : 'zh-CN')}
                  errorMsg={errorMsg}
                  onConfirm={handleVoiceConfirm}
                  onCancel={handleVoiceCancel}
                />
              )}

              {/* Chat Input Box with DropZone & Paste Support */}
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-2xl border transition-all ${
                  isDragOver
                    ? 'border-[#EA3A20] bg-rose-50/30 ring-2 ring-[#EA3A20]/20'
                    : 'border-slate-200/90 bg-slate-50/60 focus-within:border-[#EA3A20] focus-within:ring-2 focus-within:ring-[#EA3A20]/20'
                }`}
              >
                {/* Drag-and-drop overlay */}
                <ChatAttachmentDropZone
                  isDragOver={isDragOver}
                  pendingAttachments={pendingAttachments}
                  onRemoveAttachment={removeAttachment}
                  onClearAll={clearAttachments}
                  onPreviewImage={(url, name) => setPreviewModalImage({ url, name })}
                />

                <textarea
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="输入视频修改指令（如：把前3秒口播改得更吸睛、替换分镜镜头、更换BGM音轨等），支持Ctrl+V粘贴图片/文件或拖入素材..."
                  className="w-full p-3 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
                />

                <div className="px-3 py-2 flex items-center justify-between border-t border-slate-100 bg-white/70 rounded-b-2xl">
                  <div className="flex items-center gap-2">
                    {/* File Upload Trigger */}
                    <label
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      title="上传现场实拍图片或资料文件"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">添加素材</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            processFiles(Array.from(e.target.files));
                          }
                        }}
                      />
                    </label>

                    {/* Voice-to-text Toggle */}
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`p-1.5 rounded-xl transition-colors flex items-center gap-1 text-[11px] cursor-pointer ${
                        inputMode === 'voice'
                          ? 'bg-rose-100 text-[#EA3A20] font-bold'
                          : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                      }`}
                      title={inputMode === 'voice' ? '切换回键盘输入' : '开启语音输入'}
                    >
                      {inputMode === 'voice' ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{inputMode === 'voice' ? '语音模式' : '语音指令'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      Enter 发送 / Shift+Enter 换行
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={isAiThinking || (!inputMessage.trim() && !selectedMaterialToAttach && pendingAttachments.length === 0)}
                      className="px-4 py-1.5 bg-[#EA3A20] hover:bg-[#c42810] disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-2xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>发送指令</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* COLUMN 3 (RIGHT): 实时渲染播放器与分镜故事板 (Live Player & Storyboard) */}
          {/* ------------------------------------------------------------------ */}
          {!isRightCollapsed && (
            <div className="w-[440px] xl:w-[480px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden">
              {/* Top Action Bar */}
              <div className="px-4 py-3 bg-slate-950/90 border-b border-white/10 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">实时渲染预览</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono">
                    {currentVideo.aspectRatio}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="复制完整分镜口播与运镜脚本"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copySuccessToast ? '已复制' : '复制脚本'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncToJianying}
                    disabled={isSyncingJianying}
                    className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                    title="生成剪映草稿工程 (JianYing Draft) 并同步"
                  >
                    {isSyncingJianying ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>同步中...</span>
                      </>
                    ) : (
                      <>
                        <Scissors className="w-3 h-3" />
                        <span>同步到剪映</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportVideo}
                    disabled={isExportingVideo}
                    className="px-3 py-1 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    {isExportingVideo ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>渲染导出中...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        <span>导出 4K MP4</span>
                      </>
                    )}
                  </button>

                  {onNavigateToPlan && (
                    <button
                      type="button"
                      onClick={onNavigateToPlan}
                      className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="同步至发布计划排期"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>发布排期</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Live Video Player / Storyboard Mockup */}
              <div className="flex-1 overflow-hidden">
                <VideoPlayerMockup
                  video={currentVideo}
                  deviceMode={displayDeviceMode}
                  onToggleDeviceMode={() =>
                    setDisplayDeviceMode(displayDeviceMode === 'phone' ? 'wide' : 'phone')
                  }
                  activeTab={activePlayerTab}
                  onChangeTab={(tab) => setActivePlayerTab(tab)}
                />
              </div>

              {/* Toast Feedback */}
              {showJianyingSuccessToast && (
                <div className="p-3 bg-teal-700 text-white text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>已成功生成剪映草稿工程包 (JianYing Draft)，状态已变更为「已同步到剪映」！</span>
                </div>
              )}

              {showExportSuccessToast && (
                <div className="p-3 bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>4K 超高清短视频渲染打包完成，已加入导出下载队列！</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------------------------- */}
      {/* Create Video Project Modal */}
      <CreateVideoClipModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateVideo={handleCreateVideo}
      />

      {/* Zoom Media Detail Modal */}
      {previewZoomMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
              <div>
                <h3 className="font-bold text-sm text-amber-300">{previewZoomMedia.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {previewZoomMedia.code} · {previewZoomMedia.resolution} · {previewZoomMedia.duration} · {previewZoomMedia.fileSize}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewZoomMedia(null)}
                className="p-1 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={previewZoomMedia.url}
                alt={previewZoomMedia.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-xs text-slate-300 flex items-center justify-between bg-slate-950">
              <p className="line-clamp-2 pr-4">{previewZoomMedia.description}</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedMaterialToAttach(previewZoomMedia);
                  setPreviewZoomMedia(null);
                }}
                className="px-4 py-2 bg-[#EA3A20] text-white rounded-xl font-bold shrink-0 hover:bg-[#c42810] cursor-pointer"
              >
                引用至对话
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal for Chat Attachments */}
      <ImagePreviewModal
        isOpen={!!previewModalImage}
        onClose={() => setPreviewModalImage(null)}
        imageUrl={previewModalImage?.url || ''}
        imageName={previewModalImage?.name || ''}
      />

      {/* Fullscreen Player Modal */}
      {isFullScreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-white">
              <Film className="w-4 h-4 text-rose-400" />
              <span className="font-bold text-sm">{currentVideo.title}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullScreenPreview(false)}
              className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <VideoPlayerMockup
              video={currentVideo}
              deviceMode={displayDeviceMode}
              onToggleDeviceMode={() =>
                setDisplayDeviceMode(displayDeviceMode === 'phone' ? 'wide' : 'phone')
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};
