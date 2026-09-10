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
  Paperclip
} from 'lucide-react';
import {
  GraphicTextItem,
  GraphicTextStatus,
  INITIAL_GRAPHIC_ARTICLES,
  AVAILABLE_PRODUCTS,
  AVAILABLE_CASES,
  generateWeChatArticleHtml
} from '../../../data/graphicTextData';
import { PhoneMockupArticle } from './PhoneMockupArticle';
import { GraphicTextList } from './GraphicTextList';
import { CreateGraphicTextModal } from './CreateGraphicTextModal';
import { useVoiceToText } from '../../../hooks/useVoiceToText';
import { VoiceInputBanner } from '../../common/VoiceInputBanner';
import { useChatAttachment } from '../../../hooks/useChatAttachment';
import { ChatAttachmentDropZone } from '../../common/ChatAttachmentDropZone';
import { ImagePreviewModal } from '../../common/ImagePreviewModal';

// --------------------------------------------------------------------------
// Types for Media Assets & Chat Messages
// --------------------------------------------------------------------------
export interface MediaMaterialItem {
  id: string;
  code: string;
  title: string;
  category: 'case' | 'render' | 'material' | 'hardware' | 'factory';
  categoryLabel: string;
  url: string;
  thumbnail: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: string;
  tags: string[];
  description: string;
  fileSize: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
  size?: string;
}

export interface MarketingChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isGenerating?: boolean;
  generationTimeMs?: number;
  modifiedSummary?: string[];
  appliedTheme?: 'emerald' | 'dark' | 'warm';
  attachedMaterials?: MediaMaterialItem[];
  attachments?: ChatAttachment[];
}

// --------------------------------------------------------------------------
// Rich Media Assets for Marketing Article Generation
// --------------------------------------------------------------------------
const MARKETING_MATERIALS: MediaMaterialItem[] = [
  {
    id: 'mat-01',
    code: 'MAT-P01',
    title: '迪拜阿联酋精装顶层大平层全景实景摄影',
    category: 'case',
    categoryLabel: '落地案例',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    resolution: '3840×2160',
    tags: ['#迪拜案例', '#大平层实拍', '#全景落地窗', '#极简奢华'],
    description: '迪拜滨海湾大平层交付实景，全屋门墙柜一体化定制',
    fileSize: '4.8 MB'
  },
  {
    id: 'mat-02',
    code: 'MAT-P02',
    title: '欧洲进口天然橡木木皮拉丝自然山纹质感特写',
    category: 'material',
    categoryLabel: '材质色卡',
    url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    resolution: '2160×3840',
    tags: ['#天然木皮', '#立体拉丝', '#山纹触感', '#零甲醛'],
    description: '精选欧洲白橡木直纹与山纹交织，德国高耐磨哑光触感面漆',
    fileSize: '3.6 MB'
  },
  {
    id: 'mat-03',
    code: 'MAT-P03',
    title: 'PET肤感板零度超亚抗指纹门板光影细节',
    category: 'material',
    categoryLabel: '材质色卡',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    resolution: '3840×2160',
    tags: ['#PET肤感板', '#抗指纹', '#零度超亚', '#环保基材'],
    description: '表面光泽度≤3GU，耐油污刮擦测试，触感温润如脂',
    fileSize: '5.2 MB'
  },
  {
    id: 'mat-04',
    code: 'MAT-P04',
    title: '磁悬浮静音吊滑门极窄 4mm 型材收口实录',
    category: 'hardware',
    categoryLabel: '工艺五金',
    url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    resolution: '2160×3840',
    tags: ['#吊滑隐形门', '#磁悬浮顶轨', '#地面无槽', '#极窄边框'],
    description: '顶轨天幕无地轨设计，磁悬浮阻尼自吸，50万次顺滑滑动',
    fileSize: '4.1 MB'
  },
  {
    id: 'mat-05',
    code: 'MAT-P05',
    title: '德国豪迈 CNC 封边机激光微米级无缝热熔封边',
    category: 'factory',
    categoryLabel: '智造工厂',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    resolution: '3840×2160',
    tags: ['#德国豪迈', '#激光封边', '#微米级公差', '#无胶缝防水'],
    description: '工业4.0激光封边生产线，板材截面防水防潮零渗透',
    fileSize: '6.4 MB'
  },
  {
    id: 'mat-06',
    code: 'MAT-P06',
    title: '意式极简西厨中岛台与下沉式隐藏灯槽特写',
    category: 'render',
    categoryLabel: '3D效果图',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    resolution: '3840×2160',
    tags: ['#意式中岛', '#悬浮岩板', '#3000K色温', '#无拉手设计'],
    description: '食品级莫氏6级岩板台面，全包覆无死角易洁收纳设计',
    fileSize: '5.9 MB'
  },
  {
    id: 'mat-07',
    code: 'MAT-P07',
    title: '百隆静音阻尼滑轨抽屉自吸闭合微距特写',
    category: 'hardware',
    categoryLabel: '工艺五金',
    url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    resolution: '2160×3840',
    tags: ['#百隆五金', '#阻尼抽屉', '#微距特写', '#静音自吸'],
    description: '高承重三节全拉出静音滑轨，终身质保缓冲阻尼',
    fileSize: '3.2 MB'
  },
  {
    id: 'mat-08',
    code: 'MAT-P08',
    title: '米兰展会高定材质矩阵：哑光金属与皮革色卡',
    category: 'material',
    categoryLabel: '材质色卡',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    resolution: '3840×2160',
    tags: ['#米兰高定', '#哑光金属', '#皮质抽面', '#轻奢色彩'],
    description: '2026国际家具展高定流行色系精选样板',
    fileSize: '4.5 MB'
  }
];

export const GraphicTextModule: React.FC = () => {
  // --------------------------------------------------------------------------
  // Core State: Current Article Being Modified
  // --------------------------------------------------------------------------
  const [currentArticle, setCurrentArticle] = useState<GraphicTextItem>(INITIAL_GRAPHIC_ARTICLES[0]);
  const [articlesList, setArticlesList] = useState<GraphicTextItem[]>(INITIAL_GRAPHIC_ARTICLES);

  // View Mode: 'list' (图文方案列表页) | 'editor' (新建/选中图文后的三栏微调工作台)
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Left & Right Panel Collapsed States (Same UX as InSalesModule)
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(false);

  // Left Media Library Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [materialSearchQuery, setMaterialSearchQuery] = useState<string>('');
  const [selectedMaterialToAttach, setSelectedMaterialToAttach] = useState<MediaMaterialItem | null>(null);
  const [previewZoomImage, setPreviewZoomImage] = useState<MediaMaterialItem | null>(null);
  const [mediaViewMode, setMediaViewMode] = useState<'grid' | 'list'>('grid');

  // Chat Messages State
  const initialMessages: MarketingChatMessage[] = [
    {
      id: 'msg-init-ai',
      sender: 'assistant',
      content: `您好！我是您的**全案运营 AI 助手**。已为您基于当前产品库与迪拜精装案例自动装配生成了最新的图文方案：\n\n- **文章主题**：${currentArticle.title}\n- **当前视觉色标**：【墨绿高奢】\n- **已挂载产品**：PET肤感板系列、吊滑极简门\n- **关联案例工程**：迪拜滨海湾精装公寓项目（共8张高清交付图）\n\n您可以在对话中随时输入修改指令（如修改标题、调整导语、替换素材配图、切换排版色系、扩写工艺段落等），右侧手机预览模型将**实时无缝同步更新**！`,
      timestamp: '10:00',
      modifiedSummary: ['初始版本生成完成', '已挂载 2 款产品 BOM 规格', '色标：墨绿高奢']
    },
    {
      id: 'msg-user-sample',
      sender: 'user',
      content: '把开头的导读引言改得更具高级感和设问语气，另外在正文第二节强调一下耐刮磨和抗指纹实测数据。',
      timestamp: '10:02'
    },
    {
      id: 'msg-ai-sample',
      sender: 'assistant',
      content: `已为您优化导读与核心工法章节！\n\n**修改说明**：\n1. **导读引言重构**：采用“极简的边界究竟在哪里？”经典设问开篇，强化设计哲学与空间通透感。\n2. **强化耐刮磨数据**：在 PET 肤感板部分补充了「莫氏硬度≥3H，经过 50,000 次超轻微划痕自修复与钢丝球擦拭零留痕」的实验室检测背书。\n\n👉 **右侧手机预览框已实时更新**，您可以滑动查看排版与金句效果！`,
      timestamp: '10:03',
      generationTimeMs: 1200,
      modifiedSummary: ['重构导言为设问式高级金句', '补充 PET 肤感板 5万次抗刮磨实测数据']
    }
  ];

  const [messages, setMessages] = useState<MarketingChatMessage[]>(initialMessages);
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

  // Preview & Sync State
  const [displayDeviceMode, setDisplayDeviceMode] = useState<'phone' | 'wide'>('phone');
  const [isFullScreenPreview, setIsFullScreenPreview] = useState<boolean>(false);
  const [isSyncingWeChat, setIsSyncingWeChat] = useState<boolean>(false);
  const [showSyncSuccessModal, setShowSyncSuccessModal] = useState<boolean>(false);
  const [syncedDraftId, setSyncedDraftId] = useState<string>('');
  const [copySuccessToast, setCopySuccessToast] = useState<boolean>(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isAiThinking]);

  // Voice to text integration (consistent with sales assistant)
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

  // Filter materials in left library
  const filteredMaterials = useMemo(() => {
    return MARKETING_MATERIALS.filter((mat) => {
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
  // Navigation & Article Management Handlers
  // --------------------------------------------------------------------------
  const handleSelectArticle = (article: GraphicTextItem) => {
    setCurrentArticle(article);
    setViewMode('editor');
    // Initialize welcome conversation for this article
    setMessages([
      {
        id: `msg-init-${article.id}`,
        sender: 'assistant',
        content: `您好！我是您的**全案运营 AI 助手**。已为您载入图文方案：\n\n- **文章主题**：${article.title}\n- **当前视觉色标**：${
          article.themeStyle === 'emerald' ? '【墨绿高奢】' : article.themeStyle === 'dark' ? '【极简黑白】' : '【暖调燕麦】'
        }\n- **已挂载产品**：${article.linkedProducts.join('、')}\n- **关联案例工程**：${article.linkedCase.name}\n\n您可以在对话中随时输入修改指令（如修改标题、调整导语、替换素材配图、切换排版色系、扩写工艺段落等），右侧手机预览模型将**实时无缝同步更新**！`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        modifiedSummary: ['方案载入完成', `已挂载 ${article.linkedProducts.length} 款产品规格`, `色标：${article.themeStyle === 'emerald' ? '墨绿高奢' : article.themeStyle === 'dark' ? '极简黑白' : '暖调燕麦'}`]
      }
    ]);
  };

  const handleCreateArticle = (newArticle: GraphicTextItem) => {
    setArticlesList((prev) => [newArticle, ...prev]);
    handleSelectArticle(newArticle);
  };

  const handleDeleteArticle = (id: string) => {
    setArticlesList((prev) => {
      const target = prev.find((a) => a.id === id);
      if (!target) return prev;
      if (target.status === '回收站') {
        // 彻底删除
        return prev.filter((a) => a.id !== id);
      } else {
        // 移入回收站
        return prev.map((a) => (a.id === id ? { ...a, status: '回收站' as const } : a));
      }
    });
    if (currentArticle.id === id) {
      const remaining = articlesList.filter((a) => a.id !== id);
      if (remaining.length > 0) {
        setCurrentArticle(remaining[0]);
      }
    }
  };

  const handleRestoreArticle = (id: string) => {
    setArticlesList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: '编辑中' as const } : a))
    );
  };

  const handleUpdateStatus = (newStatus: GraphicTextStatus) => {
    setCurrentArticle((prev) => {
      const updated: GraphicTextItem = {
        ...prev,
        status: newStatus
      };
      setArticlesList((list) => list.map((a) => (a.id === updated.id ? updated : a)));
      return updated;
    });
  };

  const handlePreviewArticle = (article: GraphicTextItem) => {
    setCurrentArticle(article);
    setIsFullScreenPreview(true);
  };

  // --------------------------------------------------------------------------
  // Handle Sending a Modification Command to Marketing AI Copilot
  // --------------------------------------------------------------------------
  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputMessage;
    const hasAttachments = pendingAttachments.length > 0;
    if (!rawText.trim() && !selectedMaterialToAttach && !hasAttachments) return;

    const attachedMat = selectedMaterialToAttach;
    const attachmentsToSend: ChatAttachment[] = pendingAttachments.map((att) => ({
      id: att.id,
      name: att.name,
      type: att.type,
      url: att.previewUrl,
      size: att.size
    }));

    let userText = rawText.trim();
    if (!userText) {
      if (attachedMat) {
        userText = `请在正文中引用并排版此素材：【${attachedMat.title}】`;
      } else if (attachmentsToSend.length > 0) {
        userText = attachmentsToSend.some((a) => a.type === 'image')
          ? '请将我上传的配图/素材进行分析，并排版至当前微信图文推文中。'
          : '已上传相关产品资料文件，请提取亮点补充至文章中。';
      }
    }

    // 1. Append User Message
    const userMsg: MarketingChatMessage = {
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

    // 2. Simulate AI Processing & Modifying Article State
    setTimeout(() => {
      setIsAiThinking(false);
      const lower = userText.toLowerCase();

      // State clones for updates
      let updatedArticle = { ...currentArticle };
      let modifications: string[] = [];

      // Check for uploaded attachments
      if (attachmentsToSend.length > 0) {
        const attNames = attachmentsToSend.map((a) => `【${a.name}】`).join('、');
        const imgAtt = attachmentsToSend.find((a) => a.type === 'image');
        if (imgAtt) {
          updatedArticle.coverImage = imgAtt.url;
          modifications.push(`已将您上传的图片素材${attNames}设为文章候选大封面并提取色彩基调`);
        } else {
          modifications.push(`已解析您上传的文件${attNames}，提取技术参数与规格补充至正文`);
        }
      }

      // Check for theme color changes
      if (lower.includes('墨绿') || lower.includes('高奢')) {
        updatedArticle.themeStyle = 'emerald';
        modifications.push('切换排版色系为【墨绿高奢】');
      } else if (lower.includes('燕麦') || lower.includes('暖调') || lower.includes('奶油')) {
        updatedArticle.themeStyle = 'warm';
        modifications.push('切换排版色系为【暖调燕麦】');
      } else if (lower.includes('黑白') || lower.includes('极简黑')) {
        updatedArticle.themeStyle = 'dark';
        modifications.push('切换排版色系为【极简黑白】');
      }

      // Check for title modification
      if (lower.includes('标题') || lower.includes('润色') || lower.includes('更吸引') || lower.includes('吸引人')) {
        const newTitles = [
          '2026顶级豪宅全案设计：PET肤感板与吊滑隐形门的空间减法',
          '重构大平层秩序：为什么顶奢私宅都在选用零度超亚肤感门板？',
          '迪拜滨海湾豪宅实录：解析新一代全隐形门墙柜一体化工艺准则',
          '2026高定家居趋势报告：极窄4mm天轨与微缝对齐的工艺美学'
        ];
        const nextTitle = newTitles[Math.floor(Math.random() * newTitles.length)];
        updatedArticle.title = nextTitle;
        modifications.push(`更新文章大标题为：《${nextTitle}》`);
      }

      // Check for summary/lead paragraph
      if (lower.includes('导语') || lower.includes('引言') || lower.includes('金句') || lower.includes('开篇')) {
        const nextSummary = '当繁杂的线条被空间所消解，高定所承载的便不再是张扬的装饰，而是微米级收口与指尖触感的静谧力量。本文深入品爱迪拜交付实景，揭秘如何以极简天轨与零度抗指纹肤感板，诠释真正经得起审视的纯粹奢华。';
        updatedArticle.summary = nextSummary;
        modifications.push('精炼导读引言与设计金句，提升完读率');
      }

      // Check for material attachment / image insertion
      if (attachedMat) {
        // If it's a cover candidate
        if (lower.includes('封面')) {
          updatedArticle.coverImage = attachedMat.url;
          modifications.push(`将素材【${attachedMat.title}】设为图文大封面`);
        } else {
          // Insert into first or second section
          const newSections = [...updatedArticle.contentSections];
          if (newSections.length > 1) {
            newSections[1] = {
              ...newSections[1],
              image: attachedMat.url,
              caption: `图示：${attachedMat.title} (${attachedMat.description})`
            };
          }
          updatedArticle.contentSections = newSections;
          modifications.push(`在正文章节中插入高解析配图【${attachedMat.title}】`);
        }
      }

      // Check for adding tech specs or BOM
      if (lower.includes('参数') || lower.includes('bom') || lower.includes('规格') || lower.includes('环保') || lower.includes('测试')) {
        const newParams = [
          ...updatedArticle.materialsParameters,
          {
            name: '五金铰链开合寿命',
            spec: '≥500,000 次',
            standard: 'SGS / 德国 LGA 国际耐疲劳金奖'
          }
        ];
        updatedArticle.materialsParameters = newParams;
        modifications.push('补充五金 50万次耐久与 SGS 国际质检参数');
      }

      // Fallback modification message if none triggered
      if (modifications.length === 0) {
        modifications.push('微调了正文排版行距与段落强调重点');
        const newSecs = [...updatedArticle.contentSections];
        newSecs[0] = {
          ...newSecs[0],
          highlightQuote: '“每一个微小的转角与缝隙，都在诉说着高定工艺对品质的克制与敬畏。”'
        };
        updatedArticle.contentSections = newSecs;
      }

      // Update actual article
      setCurrentArticle(updatedArticle);
      setArticlesList((prevList) =>
        prevList.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
      );

      // Append AI Response Message
      const aiReply: MarketingChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        content: `已为您完成图文内容的针对性润色与修改！\n\n**本轮修改动作**：\n${modifications
          .map((m, idx) => `${idx + 1}. **${m}**`)
          .join('\n')}\n\n👉 **右侧手机公众号模型预览已实时更新！** 您可滑动右侧预览框查验排版细节。`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        generationTimeMs: 1100,
        modifiedSummary: modifications,
        appliedTheme: updatedArticle.themeStyle
      };

      setMessages((prev) => [...prev, aiReply]);
    }, 1100);
  };

  // Quick Action: Change Theme Color via Prompt
  const handleQuickChangeTheme = (theme: 'emerald' | 'dark' | 'warm', label: string) => {
    handleSendMessage(`请将文章整体排版风格切换为【${label}】色系`);
  };

  // Quick Action: Re-generate Titles
  const handleQuickPolishTitle = () => {
    handleSendMessage('请帮我把大标题润色得更具海外买家吸引力，突出大平层高定与工艺细节');
  };

  // Quick Action: Polish Summary
  const handleQuickPolishSummary = () => {
    handleSendMessage('请重写开篇导语引言，用设问句切入，语言要典雅高级，突出设计洞察');
  };

  // Quick Action: Insert Material Directly
  const handleAttachMaterialToChat = (mat: MediaMaterialItem, action: 'chat' | 'cover' | 'insert') => {
    if (action === 'chat') {
      setSelectedMaterialToAttach(mat);
      setInputMessage(`请将素材【${mat.title}】作为插图补充到文章中，并配上一段工艺解析文字。`);
    } else if (action === 'cover') {
      setSelectedMaterialToAttach(mat);
      handleSendMessage(`请将选中的素材【${mat.title}】设为文章的大封面，并调整标题与配图整体契合度。`);
    } else {
      setSelectedMaterialToAttach(mat);
      handleSendMessage(`请在正文中引用【${mat.title}】，作为核心工艺图解展示。`);
    }
  };

  // Copy HTML to clipboard
  const handleCopyHtml = () => {
    const html = generateWeChatArticleHtml(currentArticle);
    navigator.clipboard.writeText(html);
    setCopySuccessToast(true);
    setTimeout(() => setCopySuccessToast(false), 2500);
  };

  // Sync to WeChat Draft Box
  const handleSyncToWeChat = () => {
    setIsSyncingWeChat(true);
    setTimeout(() => {
      setIsSyncingWeChat(false);
      const generatedId = `draft_${Math.random().toString(36).substring(2, 9)}_2026`;
      setSyncedDraftId(generatedId);
      setCurrentArticle((prev) => {
        const updated: GraphicTextItem = {
          ...prev,
          status: '已同步到微信',
          wechatDraftId: generatedId
        };
        setArticlesList((list) => list.map((a) => (a.id === updated.id ? updated : a)));
        return updated;
      });
      setShowSyncSuccessModal(true);
    }, 900);
  };

  return (
    <div id="graphic-text-copilot-module" className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {viewMode === 'list' ? (
        <GraphicTextList
          articles={articlesList}
          onSelectArticle={handleSelectArticle}
          onCreateNew={() => setIsCreateModalOpen(true)}
          onDeleteArticle={handleDeleteArticle}
          onRestoreArticle={handleRestoreArticle}
          onPreviewArticle={handlePreviewArticle}
        />
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-hidden p-3 lg:p-4">
          {/* ========================================================================= */}
          {/* 3-COLUMN MAIN WORKSPACE (左素材库 / 中AI对话微调 / 右手机预览)              */}
          {/* ========================================================================= */}
          <div className="flex-1 flex gap-3.5 lg:gap-4 overflow-hidden min-h-0">
        
        {/* ======================================================================= */}
        {/* 1. LEFT COLUMN: 素材库 (Media Library)                                   */}
        {/* ======================================================================= */}
        <div
          className={`shrink-0 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 ${
            isLeftCollapsed
              ? 'w-0 p-0 border-0 opacity-0 pointer-events-none hidden'
              : 'w-72 xl:w-80'
          }`}
        >
          {/* Header with Back to List */}
          <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="h-8 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
              title="返回图文方案列表"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>返回列表</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold shrink-0">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">素材库</h3>
                <p className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">共 {MARKETING_MATERIALS.length} 项资产</p>
              </div>
            </div>
          </div>

          {/* Search Box & View Mode Toggle (JianYing Style) */}
          <div className="p-2.5 border-b border-slate-100 bg-white shrink-0 space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={materialSearchQuery}
                  onChange={(e) => setMaterialSearchQuery(e.target.value)}
                  placeholder="检索实景、材质、五金..."
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
                  title="剪映宫格视图"
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

            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5">
              {[
                { id: 'all', label: '全部' },
                { id: 'case', label: '实景案例' },
                { id: 'material', label: '材质色卡' },
                { id: 'hardware', label: '工艺五金' },
                { id: 'factory', label: '智造工厂' },
                { id: 'render', label: '3D渲染' }
              ].map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                      active
                        ? 'bg-[#0F4A47] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Materials Scroll Grid (剪映式紧凑布局) */}
          <div className="flex-1 overflow-y-auto p-2.5 custom-scrollbar bg-slate-50/50">
            {filteredMaterials.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <span>未找到匹配的图文素材</span>
              </div>
            ) : mediaViewMode === 'grid' ? (
              /* 剪映经典 2 列宫格紧凑流 */
              <div className="grid grid-cols-2 gap-2">
                {filteredMaterials.map((mat) => {
                  const isSelected = selectedMaterialToAttach?.id === mat.id;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => handleAttachMaterialToChat(mat, 'chat')}
                      className={`group bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-md flex flex-col relative cursor-pointer ${
                        isSelected
                          ? 'border-[#EA3A20] ring-2 ring-[#EA3A20]/20'
                          : 'border-slate-200/80 hover:border-[#EA3A20]/70'
                      }`}
                    >
                      {/* Compact 4:3 Thumbnail Stage */}
                      <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                        <img
                          src={mat.thumbnail}
                          alt={mat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Corner Category Tag */}
                        <div className="absolute top-1 left-1 pointer-events-none">
                          <span className="px-1.5 py-0.2 rounded bg-black/65 backdrop-blur-xs text-white text-[9px] font-mono leading-tight">
                            {mat.categoryLabel}
                          </span>
                        </div>

                        {/* Bottom-right Aspect Tag */}
                        <div className="absolute bottom-1 right-1 pointer-events-none">
                          <span className="px-1 py-0.2 rounded bg-black/60 backdrop-blur-xs text-white/90 text-[8.5px] font-mono leading-tight">
                            {mat.aspectRatio}
                          </span>
                        </div>

                        {/* 剪映风格悬浮快捷操作层 (JianYing Hover Overlay) */}
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-1.5 backdrop-blur-[0.5px]">
                          {/* Top row: Preview & Set Cover */}
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewZoomImage(mat);
                              }}
                              className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
                              title="放大预览大图"
                            >
                              <ZoomIn className="w-2.5 h-2.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAttachMaterialToChat(mat, 'cover');
                              }}
                              className="px-1.5 py-0.5 rounded-md bg-white/20 hover:bg-white/40 text-white text-[9px] font-medium cursor-pointer transition-colors"
                              title="设为文章封面"
                            >
                              设封面
                            </button>
                          </div>

                          {/* Bottom JianYing-style Add Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAttachMaterialToChat(mat, 'chat');
                            }}
                            className="w-full py-1 rounded-lg bg-[#EA3A20] hover:bg-[#c42810] text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-95 transition-all"
                            title="引用到对话"
                          >
                            <Plus className="w-3 h-3" />
                            <span>引用</span>
                          </button>
                        </div>
                      </div>

                      {/* Compact Title */}
                      <div className="p-1.5 bg-white">
                        <div
                          className="text-[11px] font-medium text-slate-700 truncate group-hover:text-[#EA3A20] transition-colors leading-tight"
                          title={mat.title}
                        >
                          {mat.title}
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
                      onClick={() => handleAttachMaterialToChat(mat, 'chat')}
                      className={`group bg-white rounded-xl border p-1.5 flex items-center gap-2 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer ${
                        isSelected
                          ? 'border-[#EA3A20] ring-2 ring-[#EA3A20]/20'
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="relative w-11 h-11 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                        <img
                          src={mat.thumbnail}
                          alt={mat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewZoomImage(mat);
                          }}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                        >
                          <ZoomIn className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-800 truncate leading-tight group-hover:text-[#EA3A20]">
                          {mat.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono mt-0.5">
                          <span>{mat.categoryLabel}</span>
                          <span>•</span>
                          <span>{mat.aspectRatio}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttachMaterialToChat(mat, 'chat');
                          }}
                          className="h-6 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-[#EA3A20] text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                          title="引用到对话"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>引用</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Left Column Footer (JianYing style status) */}
          <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/70 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#EA3A20]" />
              点击或悬浮快捷引用
            </span>
            <span className="font-mono text-slate-500">{filteredMaterials.length} 项素材</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. CENTER COLUMN: 与运营 AI 助手对话的页面 (Chat & Modifying Workspace)  */}
        {/* ======================================================================= */}
        <div className="flex-1 min-w-0 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden">
          
          {/* Center Header: AI Copilot Profile & Sync Controls */}
          <div className="p-3.5 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* If left panel is collapsed, provide quick return to list */}
              {isLeftCollapsed && (
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 mr-1"
                  title="返回图文方案列表"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>返回列表</span>
                </button>
              )}

              {/* Toggle Left Material Panel Button */}
              <button
                type="button"
                onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                title={isLeftCollapsed ? '展开素材库' : '收起素材库'}
              >
                {isLeftCollapsed ? <PanelLeftOpen className="w-4 h-4 text-[#0F4A47]" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>

              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0F4A47] to-[#16605C] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 truncate">运营 AI 助手 · 图文微调与装配</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    实时联动预览
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="text-[11px] text-slate-400 truncate max-w-xs">
                    正在编辑：<strong className="text-slate-700 font-medium">{currentArticle.title}</strong>
                  </div>
                  {/* Status Dropdown Selector */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-slate-400 font-medium">状态:</span>
                    <select
                      value={currentArticle.status}
                      onChange={(e) => handleUpdateStatus(e.target.value as GraphicTextStatus)}
                      className={`h-6 px-2 rounded-lg text-[10px] font-bold border cursor-pointer focus:outline-none focus:ring-1 transition-colors ${
                        currentArticle.status === '编辑中'
                          ? 'bg-sky-50 text-sky-700 border-sky-200 focus:ring-sky-500'
                          : currentArticle.status === '已同步到微信'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500'
                          : currentArticle.status === '发布审核中'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500'
                          : currentArticle.status === '审核不通过'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500'
                          : currentArticle.status === '计划发布'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 focus:ring-indigo-500'
                          : currentArticle.status === '已发布'
                          ? 'bg-[#0F4A47]/10 text-[#0F4A47] border-[#0F4A47]/30 focus:ring-[#0F4A47]'
                          : 'bg-slate-100 text-slate-700 border-slate-300 focus:ring-slate-500'
                      }`}
                    >
                      <option value="编辑中">编辑中</option>
                      <option value="已同步到微信">已同步到微信</option>
                      <option value="发布审核中">发布审核中</option>
                      <option value="审核不通过">审核不通过</option>
                      <option value="计划发布">计划发布</option>
                      <option value="已发布">已发布</option>
                      <option value="回收站">回收站</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyHtml}
                className="h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="复制微信公众号排版 HTML"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copySuccessToast ? '已复制富文本!' : '复制 HTML'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncToWeChat}
                disabled={isSyncingWeChat}
                className="h-8 px-4 rounded-full bg-[#0F4A47] hover:bg-[#0b3836] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSyncingWeChat ? '正在同步微信...' : '同步至草稿箱'}</span>
              </button>

              {/* Toggle Right Phone Preview Button */}
              <button
                type="button"
                onClick={() => setIsRightCollapsed(!isRightCollapsed)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer ml-1"
                title={isRightCollapsed ? '展开手机预览' : '收起手机预览'}
              >
                {isRightCollapsed ? <PanelRightOpen className="w-4 h-4 text-[#0F4A47]" /> : <PanelRightClose className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Chat Stream (Messages) */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4 custom-scrollbar bg-slate-50/40"
          >
            {/* Audit Rejected Notice Banner */}
            {currentArticle.status === '审核不通过' && currentArticle.auditRejectReason && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>发布审核未通过</span>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('请根据审核驳回意见，自动帮我定位违规用词并完成合规修改')}
                      className="px-2.5 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      AI 一键合规修改
                    </button>
                  </div>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    {currentArticle.auditRejectReason}
                  </p>
                </div>
              </div>
            )}

            {/* Scheduled Publish Notice Banner */}
            {currentArticle.status === '计划发布' && currentArticle.scheduledPublishTime && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs flex items-center gap-2.5 shadow-2xs">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="flex-1">
                  <span className="font-bold">已设定计划自动发布：</span>
                  <span className="text-indigo-700">{currentArticle.scheduledPublishTime}</span>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.sender === 'user' ? 'ml-auto flex-row-reverse max-w-xl' : 'max-w-3xl'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-[#EA3A20]'
                      : 'bg-gradient-to-br from-[#0F4A47] to-[#1E7D77]'
                  }`}
                >
                  {m.sender === 'user' ? (
                    'ME'
                  ) : m.isGenerating ? (
                    <Loader2 className="w-4 h-4 text-emerald-200 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                  )}
                </div>

                {/* Message Bubble Container */}
                <div className="space-y-1 min-w-0">
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-[#EA3A20] text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {/* Attached Material Preview if attached */}
                    {m.attachedMaterials && m.attachedMaterials.length > 0 && (
                      <div className="mb-2.5 p-2 bg-white/10 rounded-xl border border-white/20 flex items-center gap-2">
                        <img
                          src={m.attachedMaterials[0].thumbnail}
                          alt=""
                          className="w-10 h-8 rounded-lg object-cover"
                        />
                        <div className="min-w-0 text-[11px]">
                          <div className="font-bold truncate">{m.attachedMaterials[0].title}</div>
                          <div className="opacity-75 text-[10px]">{m.attachedMaterials[0].resolution}</div>
                        </div>
                      </div>
                    )}

                    {/* Attachments if any (Pasted or Drag-dropped files/images) */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mb-2.5 flex flex-wrap gap-2">
                        {m.attachments.map((att) => (
                          <div key={att.id} className="inline-block">
                            {att.type === 'image' ? (
                              <div
                                onClick={() => setPreviewModalImage({ url: att.url, name: att.name })}
                                className="group relative rounded-xl overflow-hidden border border-white/30 cursor-pointer shadow-xs max-w-[200px]"
                              >
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="w-full max-h-40 object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <ZoomIn className="w-5 h-5 text-white drop-shadow" />
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] ${
                                  m.sender === 'user'
                                    ? 'bg-white/15 border-white/30 text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                <FileText className="w-4 h-4 text-[#EA3A20] shrink-0" />
                                <span className="font-medium truncate max-w-[140px]">{att.name}</span>
                                {att.size && <span className="text-[10px] opacity-75 font-mono">{att.size}</span>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <div className="text-xs leading-relaxed [&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2 [&>strong]:font-bold">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>

                    {/* Modification Summary Badge Pill (AI) */}
                    {m.modifiedSummary && m.modifiedSummary.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>改动已生效并同步右侧手机排版：</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {m.modifiedSummary.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp & Footer */}
                  <div className="text-[10px] text-slate-400 px-1 font-mono flex items-center gap-2">
                    <span>{m.timestamp}</span>
                    {m.sender === 'assistant' && m.generationTimeMs && (
                      <span className="text-slate-300">· 生成耗时 {(m.generationTimeMs / 1000).toFixed(1)}s</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* AI Generating Indicator */}
            {isAiThinking && (
              <div className="flex gap-3 max-w-xl animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-[#0F4A47] flex items-center justify-center text-white shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                </div>
                <div className="p-3.5 px-4 rounded-2xl bg-white border border-slate-100 rounded-tl-xs shadow-2xs text-xs text-[#0F4A47] font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse text-[#EA3A20]" />
                  <span>正在理解修改意图并重构图文排版...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Inspiration Pills */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            <span className="text-[10px] text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> 快捷微调灵感:
            </span>

            <button
              type="button"
              onClick={handleQuickPolishTitle}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#0F4A47] hover:text-[#0F4A47] text-[11px] font-bold text-slate-700 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
            >
              ✨ 润色标题：突出高定质感
            </button>

            <button
              type="button"
              onClick={() => handleQuickChangeTheme('emerald', '墨绿高奢')}
              className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-[11px] font-bold text-emerald-800 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
            >
              🎨 切换【墨绿高奢】色标
            </button>

            <button
              type="button"
              onClick={() => handleQuickChangeTheme('warm', '暖调燕麦')}
              className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 hover:bg-amber-100 text-[11px] font-bold text-amber-900 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
            >
              🌾 切换【暖调燕麦】色标
            </button>

            <button
              type="button"
              onClick={() => handleQuickChangeTheme('dark', '极简黑白')}
              className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 hover:bg-slate-200 text-[11px] font-bold text-slate-800 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
            >
              ⬛ 切换【极简黑白】色标
            </button>

            <button
              type="button"
              onClick={handleQuickPolishSummary}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#0F4A47] hover:text-[#0F4A47] text-[11px] font-bold text-slate-700 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
            >
              📝 重构导语引言为设问金句
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage('请在工法参数表中丰富 PET 肤感板与磁悬浮滑轨的检测标准与参数')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#0F4A47] hover:text-[#0F4A47] text-[11px] font-bold text-slate-700 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
            >
              📐 丰富 BOM 工法参数规格
            </button>
          </div>

          {/* Bottom Chat Input Bar (Aligned with InSalesModule) */}
          <div
            className="relative p-4 bg-white border-t border-slate-100 space-y-2 shrink-0"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag & Drop Visual Overlay & Pending Attachments Chips */}
            <ChatAttachmentDropZone
              isDragOver={isDragOver}
              pendingAttachments={pendingAttachments}
              onRemoveAttachment={removeAttachment}
              onClearAll={clearAttachments}
              onPreviewImage={(url, name) => setPreviewModalImage({ url, name })}
            />

            {/* Voice Input Banner */}
            <VoiceInputBanner
              isListening={isListening}
              transcript={transcript}
              interimTranscript={interimTranscript}
              audioLevel={audioLevel}
              lang={lang}
              onToggleLang={() => setLang(lang === 'zh-CN' ? 'en-US' : 'zh-CN')}
              onConfirm={handleVoiceConfirm}
              onCancel={handleVoiceCancel}
              errorMsg={errorMsg}
            />

            {/* Selected Material Preview Attachment Strip */}
            {selectedMaterialToAttach && (
              <div className="p-2 px-3 bg-red-50/70 rounded-xl border border-red-200 flex items-center justify-between text-xs animate-scale-up">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={selectedMaterialToAttach.thumbnail}
                    alt=""
                    className="w-9 h-7 rounded-lg object-cover border border-red-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 truncate block">
                      已选中素材引用：{selectedMaterialToAttach.title}
                    </span>
                    <span className="text-[10px] text-slate-500">{selectedMaterialToAttach.resolution}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMaterialToAttach(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  title="移除此引用"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Toolbar: Mode switch */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span className="text-[11px] text-slate-400">
                向运营 AI 发送任何修改指令，支持 Ctrl+V 粘贴与拖拉图片/文件
              </span>

              {/* Input Method Switcher & Attachment Button */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-600 hover:text-[#EA3A20] hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer">
                  <Paperclip className="w-3 h-3 text-slate-400" />
                  <span>上传附件</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        processFiles(e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>

                <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening) stopListening();
                      setInputMode('keyboard');
                    }}
                    className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      inputMode === 'keyboard' && !isListening
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Keyboard className="w-3 h-3 text-slate-600" />
                    <span>键盘输入</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      isListening || inputMode === 'voice'
                        ? 'bg-[#EA3A20] text-white shadow-2xs font-bold animate-pulse'
                        : 'text-slate-500 hover:text-[#EA3A20]'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isListening ? '录音中...' : '语音转文字'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Input Textarea & Send Button */}
            <div className="relative flex items-end gap-2">
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
                placeholder="在此向运营 AI 发送修改指令，支持 Ctrl+V 粘贴图片/文件、直接拖拉素材文件发送..."
                className="flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] focus:border-[#EA3A20] resize-none"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isAiThinking || (!inputMessage.trim() && !selectedMaterialToAttach && pendingAttachments.length === 0)}
                className="h-10 px-4 rounded-2xl bg-[#EA3A20] hover:bg-[#d6341c] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>发送</span>
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* 3. RIGHT COLUMN: 手机预览样式 (Phone Mockup Preview)                     */}
        {/* ======================================================================= */}
        <div
          className={`shrink-0 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 ${
            isRightCollapsed
              ? 'w-0 p-0 border-0 opacity-0 pointer-events-none hidden'
              : 'w-80 md:w-96 lg:w-[410px] xl:w-[440px]'
          }`}
        >
          {/* Right Header */}
          <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#0F4A47]/10 text-[#0F4A47] flex items-center justify-center font-bold">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">手机预览效果</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>微信公众平台排版实时渲染</span>
                </div>
              </div>
            </div>

            {/* Fullscreen Button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsFullScreenPreview(true)}
                className="h-7 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="全屏深度审稿"
              >
                <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                <span>全屏</span>
              </button>
            </div>
          </div>

          {/* Phone Shell Stage */}
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-slate-100/60 custom-scrollbar">
            <div className="w-full flex justify-center py-2">
              <PhoneMockupArticle
                article={currentArticle}
                themeColor={currentArticle.themeStyle}
                isFullScreen={false}
                displayMode={displayDeviceMode}
              />
            </div>
          </div>

          {/* Right Bottom Footer Actions */}
          <div className="p-3 px-4 border-t border-slate-100 bg-white flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsFullScreenPreview(true)}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>全屏展示效果</span>
            </button>

            <button
              type="button"
              onClick={handleSyncToWeChat}
              disabled={isSyncingWeChat}
              className="flex-1 py-2 rounded-xl bg-[#0F4A47] hover:bg-[#0b3836] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>一键同步微信</span>
            </button>
          </div>

        </div>

      </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE GRAPHIC TEXT MODAL POPUP                                           */}
      {/* ========================================================================= */}
      <CreateGraphicTextModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateArticle={handleCreateArticle}
      />

      {/* ========================================================================= */}
      {/* FULLSCREEN PREVIEW MODAL (全屏沉浸式审稿)                                  */}
      {/* ========================================================================= */}
      {isFullScreenPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-fade-in">
          <div className="h-14 px-6 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0F4A47] text-white flex items-center justify-center font-bold text-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight truncate max-w-lg">
                  {currentArticle.title}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  全案高定图文 · 全屏审稿模式
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyHtml}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copySuccessToast ? '已复制富文本' : '复制微信 HTML'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncToWeChat}
                disabled={isSyncingWeChat}
                className="px-4 py-1.5 rounded-full bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSyncingWeChat ? '同步中...' : '同步至草稿箱'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullScreenPreview(false)}
                className="px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
                <span>退出 (ESC)</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center custom-scrollbar">
            <PhoneMockupArticle
              article={currentArticle}
              themeColor={currentArticle.themeStyle}
              isFullScreen={true}
              displayMode="phone"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ZOOM IMAGE MODAL (大图特写预览)                                           */}
      {/* ========================================================================= */}
      {previewZoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-6 animate-fade-in cursor-pointer"
          onClick={() => setPreviewZoomImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-3 p-4 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">{previewZoomImage.title}</h4>
              <button
                type="button"
                onClick={() => setPreviewZoomImage(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center">
              <img
                src={previewZoomImage.url}
                alt={previewZoomImage.title}
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{previewZoomImage.resolution} · {previewZoomImage.fileSize}</span>
              <button
                type="button"
                onClick={() => {
                  handleAttachMaterialToChat(previewZoomImage, 'chat');
                  setPreviewZoomImage(null);
                }}
                className="px-4 py-1.5 rounded-full bg-[#EA3A20] text-white font-bold text-xs hover:bg-[#d6341c] cursor-pointer shadow-xs"
              >
                + 引用此图到 AI 对话
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SYNC SUCCESS MODAL POPUP                                                  */}
      {/* ========================================================================= */}
      {showSyncSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-scale-up">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">已成功同步至微信草稿箱！</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Draft ID: {syncedDraftId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSyncSuccessModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">同步公众号账号：</span>
                <span className="font-bold text-slate-800">HomeCraft 高定家居 (官方服务号)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">图文标题：</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                  {currentArticle.title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">草稿箱状态：</span>
                <span className="text-emerald-700 font-bold">草稿已就绪，可随时推送/群发</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              您现在可在微信公众平台后台（mp.weixin.qq.com）草稿箱中查看并安排群发，也可以在移动端「公众平台助手」APP 中直接扫码预览。
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSyncSuccessModal(false)}
                className="w-full py-2.5 rounded-full bg-[#0F4A47] hover:bg-[#0c3937] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal for Pasted / Dropped Images */}
      {previewModalImage && (
        <ImagePreviewModal
          isOpen={!!previewModalImage}
          imageUrl={previewModalImage.url}
          imageName={previewModalImage.name}
          onClose={() => setPreviewModalImage(null)}
        />
      )}

    </div>
  );
};
