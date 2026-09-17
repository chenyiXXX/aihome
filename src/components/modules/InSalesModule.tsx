import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Calculator,
  Languages,
  Sparkles,
  UserPlus,
  Search,
  Building2,
  Phone,
  Tag,
  X,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Globe,
  UploadCloud,
  Mic,
  FileText,
  FileAudio,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Wand2,
  ArrowRight,
  HelpCircle,
  FileCheck,
  Loader2,
  Image as ImageIcon,
  PlayCircle,
  BookOpen,
  MicOff,
  Keyboard,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Check,
  Filter,
  SlidersHorizontal,
  QrCode,
  Users,
  User,
  Smartphone,
  Link2,
  AlertCircle,
  AlertTriangle,
  ChevronsUpDown,
  Clock,
  Quote,
  CheckSquare,
  Square,
  Paperclip,
  FileSpreadsheet,
  Plus,
  Trash2,
  Download,
  Package
} from 'lucide-react';
import { SessionItem, ChatMessage, ScriptItem } from '../../types';
import { useVoiceToText } from '../../hooks/useVoiceToText';
import { VoiceInputBanner } from '../common/VoiceInputBanner';
import { useChatAttachment } from '../../hooks/useChatAttachment';
import { ChatAttachmentDropZone } from '../common/ChatAttachmentDropZone';
import { ImagePreviewModal } from '../common/ImagePreviewModal';

// External WeCom / WhatsApp Chat Model
export interface ExternalSocialChat {
  id: string;
  name: string;
  channel: '企微' | 'WhatsApp';
  type: 'personal' | 'group';
  memberCount?: number;
  participantsDesc?: string;
  subtitle: string;
  lastMessage: string;
  lastTime: string;
  unread?: number;
  defaultCompany?: string;
  defaultPhone?: string;
  recommendedTags: string[];
  chatHistorySnippet: string;
}

export const mockWeComChats: ExternalSocialChat[] = [
  {
    id: 'wecom-1',
    name: '张明远 先生',
    channel: '企微',
    type: 'personal',
    subtitle: '华润置地大平层业主 · 139-2841-8899',
    lastMessage: '张先生：预算在35-45万左右，希望能尽快看到碳晶护墙板实物小样...',
    lastTime: '10:35',
    unread: 2,
    defaultCompany: '华润置地大平层 (280㎡)',
    defaultPhone: '139-2841-8899',
    recommendedTags: ['全案高定', '私宅别墅', '爱格板定制', '碳晶护墙板', '待打样'],
    chatHistorySnippet: `【企业微信私聊记录】\n张先生: 你好，朋友推荐你们家做全案高定很专业。我深圳湾大平层准备开工，全屋需要做隐形门系统和爱格板衣帽间。\n销售: 张总您好！非常荣幸，深圳湾一号我们刚做完两套同户型全案，对承重墙及中央空调隐藏式回风口收口非常熟练。\n张先生: 太好了，我预算在35-45万左右，希望能尽快看到碳晶护墙板实物小样和爱格板色卡，下周能否安排上门量尺？`
  },
  {
    id: 'wecom-2',
    name: '深圳湾壹号3栋高定私享群',
    channel: '企微',
    type: 'group',
    memberCount: 5,
    participantsDesc: '业主张总、主案刘工、深化陈工、品爱客服',
    subtitle: '5人群聊 · 业主张总、主案刘工、项目经理',
    lastMessage: '刘工：已将客餐厅碳晶护墙板节点CAD深化图发在群里，请核对。',
    lastTime: '09:18',
    defaultCompany: '深圳湾壹号3栋大平层豪宅',
    defaultPhone: '139-2841-8899',
    recommendedTags: ['全案高定', '客户群聊', '碳晶护墙板', '隐形门系统', '工期紧急'],
    chatHistorySnippet: `【企业微信群聊记录 - 深圳湾壹号3栋高定私享群】\n业主张总: 施工队下周准备进场了，背景墙隐形门和碳晶护墙板节点图好了吗？\n主案刘工: 已将客餐厅碳晶护墙板节点CAD深化图发在群里，请品爱深化团队核对。\n销售: 收到刘工，已交由工厂深化工程师审核，今天下午5点前回复打样确认方案！`
  },
  {
    id: 'wecom-3',
    name: '李工 (极简美学设计院)',
    channel: '企微',
    type: 'personal',
    subtitle: '千岛湖高端度假项目主理人 · 138-0571-6622',
    lastMessage: '李工：你们实木贴皮和碳晶板的阻燃报告下周能否随样品附上？',
    lastTime: '昨天',
    defaultCompany: '千岛湖高端独栋度假项目',
    defaultPhone: '138-0571-6622',
    recommendedTags: ['酒店工程', '全案高定', '碳晶护墙板', '待打样'],
    chatHistorySnippet: `【企业微信私聊记录】\n李工: 我们是杭州极简美学设计院的李工，负责千岛湖高端度假独栋项目。对墙板防潮和柜体环保等级要求极高（必须达到ENF级或日本F4星）。\n销售: 没问题李工，我们所有工程板材均具备国家阻燃及环保双重认证，随时可安排打样专函寄送。`
  },
  {
    id: 'wecom-4',
    name: '保利天悦全屋整装落地群',
    channel: '企微',
    type: 'group',
    memberCount: 6,
    participantsDesc: '业主王女士、软装顾问、品爱华南跟进组',
    subtitle: '6人群聊 · 业主王女士、设计师、品爱跟进组',
    lastMessage: '王女士：PET肤感板我们选哑光白，工期能不能压缩到25天？',
    lastTime: '周一',
    defaultCompany: '保利天悦全案整装',
    defaultPhone: '136-9988-1234',
    recommendedTags: ['全案高定', '客户群聊', '爱格板定制', '工期紧急'],
    chatHistorySnippet: `【企业微信群聊记录 - 保利天悦全屋整装落地群】\n王女士: PET肤感板我们选哑光白，台面配雪花白岩板，工期能不能压缩到25天？\n设计师: 柜体柜门尺寸已锁定，只要工厂排期顺畅，25天交付没问题。\n销售: 正在向供应链生产主管申请高定加急通道，稍后给您确认排产批次。`
  },
  {
    id: 'wecom-5',
    name: '陈建国 董事长',
    channel: '企微',
    type: 'personal',
    subtitle: '广州汇悦台独栋业主 · 137-1122-3344',
    lastMessage: '陈董：酒窖恒温柜和雪茄房的实木格栅方案做好了吗？',
    lastTime: '08:45',
    defaultCompany: '侨鑫汇悦台顶楼复式 (420㎡)',
    defaultPhone: '137-1122-3344',
    recommendedTags: ['全案高定', '私宅别墅', '实木定制', '预算充足'],
    chatHistorySnippet: `【企业微信私聊记录】\n陈董: 小林，我汇悦台顶楼复式地下室的雪茄房和整墙恒温酒窖，必须用北美黑胡桃原木，门铰五金全部要海蒂诗定制铰链。\n销售: 陈董您放心，专属深化师已完成恒温阻尼气密系统节点设计，今天下午带黑胡桃实木样板去您办公室当面汇报。`
  },
  {
    id: 'wecom-6',
    name: '万科瑧湾悦4栋全案落地组',
    channel: '企微',
    type: 'group',
    memberCount: 7,
    participantsDesc: '业主周总、工长老何、品爱定制设计师',
    subtitle: '7人群聊 · 业主周总、项目工长、品爱深化',
    lastMessage: '周总：主卧步入式衣帽间的皮革包覆背板打样寄出了吗？',
    lastTime: '昨天',
    defaultCompany: '万科瑧湾悦精装改造项目',
    defaultPhone: '135-6677-8899',
    recommendedTags: ['客户群聊', '全案高定', '爱格板定制', '待打样'],
    chatHistorySnippet: `【企业微信群聊记录】\n周总: 衣帽间岛台配灰色爱马仕橙车线皮革，色卡我们敲定了，样板寄出来了吗？\n销售: 周总好，顺丰特快已发出，单号SF19203810，预计明天上午送达您公司前台。`
  },
  {
    id: 'wecom-7',
    name: '林雅婷 女士',
    channel: '企微',
    type: 'personal',
    subtitle: '恒裕滨城二期业主 · 186-8899-7711',
    lastMessage: '林女士：极简悬浮浴室柜和岩板一体盆的报价单发我看下。',
    lastTime: '昨天',
    defaultCompany: '恒裕滨城二期私宅 (210㎡)',
    defaultPhone: '186-8899-7711',
    recommendedTags: ['全案高定', '私宅别墅', '碳晶护墙板'],
    chatHistorySnippet: `【企业微信私聊记录】\n林女士: 喜欢你们展厅那套悬浮无拉手浴室柜，底面带感应灯带的。全屋三个卫生间都做这种，给个详细预算报价单。\n销售: 林女士您好，已按原厂五金和德赛斯岩板规格配置好清单，已发送至您企微文件助手。`
  },
  {
    id: 'wecom-8',
    name: '洲际酒店行政套房木作打样群',
    channel: '企微',
    type: 'group',
    memberCount: 9,
    participantsDesc: '工程总监赵总、深化设计院、品爱工程部',
    subtitle: '9人群聊 · 酒店方总监、设计院、品爱工程交付',
    lastMessage: '赵总：阻燃B1级检测报告与甲醛释放量复测结果已过审。',
    lastTime: '前天',
    defaultCompany: '三亚海棠湾度假酒店工程',
    defaultPhone: '139-0011-2233',
    recommendedTags: ['酒店工程', '客户群聊', '工期紧急', '碳晶护墙板'],
    chatHistorySnippet: `【企业微信群聊记录】\n赵总: 样板房下月验收，120套客房的护墙板和木门排期能否提前一周？\n销售: 赵总，产线已预留专用数控机床，第一批打样合格后即刻全速排产。`
  },
  {
    id: 'wecom-9',
    name: '郑明 建筑师 (筑博设计)',
    channel: '企微',
    type: 'personal',
    subtitle: '筑博设计高端公建事业部 · 133-4455-6677',
    lastMessage: '郑工：外立面铝合金蜂窝板与室内碳晶板的过渡收口节点请提供DWG。',
    lastTime: '前天',
    defaultCompany: '金融城企业总部展厅',
    defaultPhone: '133-4455-6677',
    recommendedTags: ['酒店工程', '碳晶护墙板', '隐形门系统'],
    chatHistorySnippet: `【企业微信私聊记录】\n郑工: 我们负责金融城科技企业展厅，内部有大面积弧形曲面墙，你们碳晶板冷弯工艺最小半径能做到多少？\n销售: 郑工您好，我们热压成型可做至R300最小曲率，稍后将标准工艺剖面CAD发您。`
  },
  {
    id: 'wecom-10',
    name: '中海天钻顶复高定业主协调群',
    channel: '企微',
    type: 'group',
    memberCount: 4,
    participantsDesc: '业主宋总、室内主案、品爱客服',
    subtitle: '4人群聊 · 业主宋总、室内主案、品爱客服',
    lastMessage: '宋总：周末下午2点我们在现场复核楼梯踏步和格栅基层。',
    lastTime: '3天前',
    defaultCompany: '中海天钻顶层复式 (360㎡)',
    defaultPhone: '138-9900-1122',
    recommendedTags: ['客户群聊', '全案高定', '私宅别墅'],
    chatHistorySnippet: `【企业微信群聊记录】\n宋总: 踏步实木整板打磨完毕了吗？周末到现场看下油漆试色。\n销售: 没问题宋总，技术主管已备齐四种光泽度样块现场对比。`
  }
];

export const mockWhatsAppChats: ExternalSocialChat[] = [
  {
    id: 'wa-1',
    name: 'David Miller',
    channel: 'WhatsApp',
    type: 'personal',
    subtitle: 'Apex Architecture (Miami, US) · +1 (305) 982-3401',
    lastMessage: 'David: Can you supply customized oak veneer fluted panels? Budget $80k.',
    lastTime: '11:42',
    unread: 1,
    defaultCompany: 'Apex Architecture (Miami Penthouse)',
    defaultPhone: '+1 (305) 982-3401',
    recommendedTags: ['外贸大单', 'WhatsApp', '私宅别墅', '待打样', '预算充足'],
    chatHistorySnippet: `[WhatsApp Direct Chat with David Miller]\nDavid: Hello Franklin, saw your booth at KBIS. Can you supply customized oak veneer fluted panels for our Miami penthouse project? Total ceiling height 3.2m, need seamless joint detailing. Budget is around $80,000 USD for the wood package.\nFranklin Jr: Hi David! Absolutely. We produce 3.2m continuous fluted panels with tongue-and-groove joint profile. We can express ship a master sample box to Florida tomorrow.`
  },
  {
    id: 'wa-2',
    name: 'Dubai Villa 45 Joinery Project Group',
    channel: 'WhatsApp',
    type: 'group',
    memberCount: 8,
    participantsDesc: 'Tariq Al-Mansoor, Project Director, Sophia, QA Engineer',
    subtitle: '8 participants · Royal Oasis Hospitality & Pinai Joinery',
    lastMessage: 'Tariq: BS5852 fire rating certificates and 12x40HQ schedule confirmed.',
    lastTime: '08:30',
    defaultCompany: 'Royal Oasis Hospitality (Dubai)',
    defaultPhone: '+971 50 123 4567',
    recommendedTags: ['外贸大单', '客户群聊', '酒店工程', '待打样', '工期紧急'],
    chatHistorySnippet: `[WhatsApp Group: Dubai Villa 45 Joinery Project]\nTariq Al-Mansoor: Good morning team. We are sourcing customized joinery and fire-rated wall panels for a 45-villa resort in Palm Jumeirah. All woodwork must meet BS5852 standard with PVD titanium brass trims. Total volume around 12x 40HQ containers.\nFranklin Jr: Good morning Tariq. Master samples and test certifications are dispatched today via DHL express.`
  },
  {
    id: 'wa-3',
    name: 'Marcus Sterling',
    channel: 'WhatsApp',
    type: 'personal',
    subtitle: 'Mayfair Luxury Estates (London, UK) · +44 20 7946 0912',
    lastMessage: 'Marcus: Quotation approved for Kensington townhouses, sending deposit.',
    lastTime: '昨天',
    defaultCompany: 'Mayfair Luxury Estates',
    defaultPhone: '+44 20 7946 0912',
    recommendedTags: ['外贸大单', 'WhatsApp', '全案高定', '预算充足'],
    chatHistorySnippet: `[WhatsApp Direct Chat with Marcus Sterling]\nMarcus: Hi Franklin, we reviewed your $120,000 proposal for the 6 townhouses in Kensington. Board approved the PET super-matte finish.\nFranklin Jr: Wonderful news Marcus. We will prepare the formal proforma invoice and shop drawings immediately.`
  },
  {
    id: 'wa-4',
    name: 'Sydney Coastal Residence Fitout',
    channel: 'WhatsApp',
    type: 'group',
    memberCount: 4,
    participantsDesc: 'Oliver Chen (Developer), BuildCo Australia, Sales Team',
    subtitle: '4 participants · Oliver Chen, Interior Contractor, Pinai Sales',
    lastMessage: 'Oliver: Please share the aluminum frame invisible door catalog and pricing.',
    lastTime: '周二',
    defaultCompany: 'Sydney Coastal Villa Project',
    defaultPhone: '+61 2 9876 5432',
    recommendedTags: ['外贸大单', '客户群聊', '隐形门系统', '待打样'],
    chatHistorySnippet: `[WhatsApp Group: Sydney Coastal Residence Fitout]\nOliver Chen: Hey guys, we need 18 sets of floor-to-ceiling invisible doors with concealed hinges for the Vaucluse villa.\nFranklin Jr: Hi Oliver, catalog and CAD drawings sent to your email. Aluminum core structure guarantees no warping up to 3.0 meters.`
  },
  {
    id: 'wa-5',
    name: 'Elena Rostova',
    channel: 'WhatsApp',
    type: 'personal',
    subtitle: 'Alpine Chalet Interiors (Zurich, CH) · +41 44 234 5678',
    lastMessage: 'Elena: We require natural smoked larix panels for ski resort chalets.',
    lastTime: '昨天',
    defaultCompany: 'Alpine Luxury Chalet Project',
    defaultPhone: '+41 44 234 5678',
    recommendedTags: ['外贸大单', 'WhatsApp', '酒店工程', '待打样'],
    chatHistorySnippet: `[WhatsApp Direct Chat with Elena Rostova]\nElena: Franklin, our Swiss ski resort requires alpine rustic smoked wood panels with Class B-s1 fire certification.\nFranklin Jr: Hi Elena, we have tested smoked larix veneers ready in warehouse, express shipping samples to Zurich.`
  },
  {
    id: 'wa-6',
    name: 'Singapore Sentosa Cove Penthouse Coordination',
    channel: 'WhatsApp',
    type: 'group',
    memberCount: 6,
    participantsDesc: 'Kelvin Tan, Lead Architect, Pinai Project Lead',
    subtitle: '6 participants · Kelvin Tan, Lead Architect, Pinai Engineering',
    lastMessage: 'Kelvin: Humidity resistance test approved, ready for bulk container shipment.',
    lastTime: '3天前',
    defaultCompany: 'Sentosa Cove Waterfront Villa',
    defaultPhone: '+65 6789 0123',
    recommendedTags: ['外贸大单', '客户群聊', '全案高定', '预算充足'],
    chatHistorySnippet: `[WhatsApp Group: Sentosa Cove Penthouse Coordination]\nKelvin Tan: Tropical climate durability is critical for Sentosa waterfront. The PUR edge-banded PET panels showed zero peeling after 72h steam test.\nFranklin Jr: Thank you Kelvin! All cabinets will use zero-formaldehyde PUR adhesive and marine-grade plywood substrates.`
  }
];

interface InSalesModuleProps {
  sessions: SessionItem[];
  chatMessages: ChatMessage[];
  scripts: ScriptItem[];
  subView: string;
  onOpenAddScriptDrawer: () => void;
}

export const InSalesModule: React.FC<InSalesModuleProps> = ({
  sessions: initialSessionsList,
  chatMessages,
  scripts,
  onOpenAddScriptDrawer
}) => {
  const [sessionList, setSessionList] = useState<SessionItem[]>(initialSessionsList);
  // Default to the first session so list and detail are immediately visible together
  const [activeSession, setActiveSession] = useState<SessionItem | null>(() => {
    return initialSessionsList && initialSessionsList.length > 0 ? initialSessionsList[0] : null;
  });
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isRightProfileCollapsed, setIsRightProfileCollapsed] = useState<boolean>(false);
  const [showQuoteDetailsModal, setShowQuoteDetailsModal] = useState<boolean>(false);
  
  // Replace the direct customer chat with an AI Copilot chat
  const initialAiMessages: ChatMessage[] = [
    {
      id: 'msg-ai-1',
      sessionId: 'all',
      sender: 'ai_copilot',
      content: '你好，我是你的销售AI助手。你可以向我发送客户的疑问、痛点、户型图或者当前沟通的难点，我会为你深度分析并提供高转化的话术推荐与成单策略。',
      timestamp: '09:00',
      messageType: 'text'
    },
    {
      id: 'msg-sales-1',
      sessionId: 'all',
      sender: 'sales',
      content: '客户问我们的实木柜体和爱格板柜体的防水性能对比，有相关的测试视频和测试报告发给客户看吗？',
      timestamp: '09:05'
    },
    {
      id: 'msg-ai-2',
      sessionId: 'all',
      sender: 'ai_copilot',
      content: '为你找到相关的防水性能测试资料。\n\n**总结**：实木柜体（多层实木）采用封边工艺和表面漆面处理，具备极好的生活防水性能；爱格板则使用PUR封边，遇水不易膨胀。两者均能完美应对厨房和浴室的高湿环境。\n\n建议将以下**测试视频**和**第三方检测报告**发送给客户打消疑虑：',
      timestamp: '09:06',
      messageType: 'text_video',
      attachments: [
        {
          id: 'att-1',
          type: 'video',
          url: 'https://cdn.example.com/water-test.mp4',
          name: '水浸泡对比测试实验.mp4',
          duration: '01:15',
          thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'
        },
        {
          id: 'att-2',
          type: 'file',
          url: 'https://cdn.example.com/report.pdf',
          name: 'SGS_防水浸泡性能检测报告.pdf',
          size: '1.2 MB'
        }
      ],
      citations: [
        {
          id: 'kb-01',
          title: '《柜体板材防潮防水性能对比白皮书》',
          version: 'v2.1',
          category: '基材工艺标准',
          excerpt: '经 SGS 浸水检测：多层实木在 PUR 封边工艺下，耐水泡膨胀率<0.5%，达到欧标 EN312 P3 级防水防潮要求。'
        },
        {
          id: 'kb-02',
          title: '《工厂实验室测试数据标准手册》',
          version: 'v1.4',
          category: '实验室质检规范',
          excerpt: '72小时恒温恒湿循环浸泡实验中，多层实木结构胶合强度≥1.0MPa，无开裂分层现象。'
        }
      ]
    },
    {
      id: 'msg-sales-2',
      sessionId: 'all',
      sender: 'sales',
      content: '好，那我们有一款新的意式极简风格的岛台吗？发几张高清图给我看看，要带大理石纹理的。',
      timestamp: '09:08'
    },
    {
      id: 'msg-ai-3',
      sessionId: 'all',
      sender: 'ai_copilot',
      content: '有的，这是最新研发的「米兰之光」系列意式极简岛台，采用进口岩板（卡拉拉白大理石纹理），无拉手设计。',
      timestamp: '09:08',
      messageType: 'text_image',
      attachments: [
        {
          id: 'att-3',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
          name: 'island_design_1.jpg'
        },
        {
          id: 'att-4',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
          name: 'island_design_2.jpg'
        }
      ]
    }
  ];
  const [messages, setMessages] = useState<ChatMessage[]>(initialAiMessages);
  const [activeCitationModal, setActiveCitationModal] = useState<{
    id: string;
    title: string;
    version: string;
    category?: string;
    excerpt?: string;
  } | null>(null);
  const [inputMessage, setInputMessage] = useState('');
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

  // Voice to text integration for AI Sales Assistant chat
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
    contextHint: 'sales',
    defaultLang: 'zh-CN'
  });

  const handleVoiceConfirm = () => {
    const textToInsert = transcript || interimTranscript;
    if (textToInsert) {
      setInputMessage((prev) => (prev ? `${prev} ${textToInsert}` : textToInsert));
    }
    stopListening();
  };

  const handleVoiceCancel = () => {
    stopListening();
  };

  const handleToggleVoice = () => {
    if (isListening) {
      handleVoiceConfirm();
    } else {
      setInputMode('voice');
      startListening((text) => {
        setInputMessage((prev) => (prev ? `${prev} ${text}` : text));
      });
    }
  };

  const [profileTab, setProfileTab] = useState<'history' | 'tags' | 'assets' | 'knowledge'>('history');
  const [activeTab, setActiveTab] = useState<'企微' | 'WhatsApp' | '线下对接'>('企微');
  const [statusFilter, setStatusFilter] = useState<string>('跟进中');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleStatusChange = (id: string, newStatus: string) => {
    setSessionList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
    if (activeSession && activeSession.id === id) {
      setActiveSession({ ...activeSession, status: newStatus as any });
    }
  };

  // Create Session Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannel, setNewChannel] = useState<'企微' | 'WhatsApp' | '线下对接'>('企微');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactInfo, setNewContactInfo] = useState('');
  const [newAssignedStaff, setNewAssignedStaff] = useState('Franklin Jr');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [initialNote, setInitialNote] = useState('');

  // AI & Upload State for Session Creation
  const [recordInputMode, setRecordInputMode] = useState<'manual' | 'chat_upload' | 'audio_upload'>('manual');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [rawRecordText, setRawRecordText] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisCompleted, setAiAnalysisCompleted] = useState(false);
  const [aiExtractedSummary, setAiExtractedSummary] = useState<{
    customerName?: string;
    companyName?: string;
    contactInfo?: string;
    tags: string[];
    structuredDemand: string;
    urgencyLevel?: '高' | '中' | '一般';
    estimatedBudget?: string;
  } | null>(null);

  // Audio Playback simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Social chat sync state
  const [selectedExternalChatId, setSelectedExternalChatId] = useState<string | null>(null);
  const [externalChatFilter, setExternalChatFilter] = useState<'all' | 'personal' | 'group'>('all');
  const [externalChatSearch, setExternalChatSearch] = useState<string>('');
  const [isChatPickerOpen, setIsChatPickerOpen] = useState<boolean>(false);
  const chatPickerRef = useRef<HTMLDivElement>(null);

  // Selected quoted chat messages from right social chat history panel
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [pendingQuotedMessages, setPendingQuotedMessages] = useState<{
    id: string;
    sender: 'customer' | 'sales' | string;
    senderName?: string;
    content: string;
    timestamp?: string;
  }[]>([]);

  // Toggle selection of a social chat message
  const handleToggleQuoteMessage = (msg: { id: string; sender: string; content: string; timestamp?: string }) => {
    const isSelected = selectedQuoteIds.includes(msg.id);
    if (isSelected) {
      setSelectedQuoteIds(prev => prev.filter(id => id !== msg.id));
      setPendingQuotedMessages(prev => prev.filter(m => m.id !== msg.id));
    } else {
      setSelectedQuoteIds(prev => [...prev, msg.id]);
      const senderDisplayName = msg.sender === 'sales' ? '我 (Franklin)' : (activeSession?.customerName || '客户');
      setPendingQuotedMessages(prev => [
        ...prev,
        {
          id: msg.id,
          sender: msg.sender,
          senderName: senderDisplayName,
          content: msg.content,
          timestamp: msg.timestamp
        }
      ]);
    }
  };

  // Remove a quoted message from the input pending list
  const handleRemovePendingQuote = (quoteId: string) => {
    setSelectedQuoteIds(prev => prev.filter(id => id !== quoteId));
    setPendingQuotedMessages(prev => prev.filter(m => m.id !== quoteId));
  };

  // Clear all pending quotes
  const handleClearAllQuotes = () => {
    setSelectedQuoteIds([]);
    setPendingQuotedMessages([]);
  };

  // Quick preset questions for quoted messages
  const handleApplyQuotePromptPreset = (prompt: string) => {
    setInputMessage(prompt);
  };

  // Close chat picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatPickerRef.current && !chatPickerRef.current.contains(event.target as Node)) {
        setIsChatPickerOpen(false);
      }
    };
    if (isChatPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatPickerOpen]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // CBM Calculator Modal
  const [showCbmCalc, setShowCbmCalc] = useState(false);
  const [cbmLength, setCbmLength] = useState(220);
  const [cbmWidth, setCbmWidth] = useState(90);
  const [cbmHeight, setCbmHeight] = useState(85);
  const [cbmQty, setCbmQty] = useState(30);

  const singleCbm = (cbmLength * cbmWidth * cbmHeight) / 1000000;
  const totalCbm = singleCbm * cbmQty;
  const fillRate = Math.min(100, Math.round((totalCbm / 68.0) * 100));

  // Quotation / Proforma Invoice (PI) Generator Modal
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteCustomerName, setQuoteCustomerName] = useState('Franklin Jr (Miami Villa)');
  const [quoteProjectName, setQuoteProjectName] = useState('迈阿密顶层复式全案整木高定');
  const [quoteCurrency, setQuoteCurrency] = useState<'USD' | 'EUR' | 'CNY'>('USD');
  const [quoteTradeTerm, setQuoteTradeTerm] = useState('CIF Miami');
  const [quoteDesignFiles, setQuoteDesignFiles] = useState<Array<{ name: string; size: string; type: string }>>([
    { name: 'Miami_Villa_Kitchen_Cabinet_v2.dwg', size: '4.8 MB', type: 'dwg' },
    { name: 'Master_WalkIn_Wardrobe_Renderings.pdf', size: '12.4 MB', type: 'pdf' }
  ]);
  const [quoteItems, setQuoteItems] = useState<Array<{
    id: string;
    name: string;
    spec: string;
    qty: number;
    unit: string;
    price: number;
  }>>([
    {
      id: 'qi-1',
      name: '主厨现代极简橱柜定制 (含中岛台)',
      spec: '进口爱格板W1000 + 45°斜切无拉手 + 纯白岩板台面',
      qty: 12.5,
      unit: '延米',
      price: 680
    },
    {
      id: 'qi-2',
      name: '主卧实木步入式衣帽间系统',
      spec: '多层实木高定柜体 + 铝框茶玻门 + 嵌入式暖光感应灯带',
      qty: 24,
      unit: '㎡',
      price: 450
    },
    {
      id: 'qi-3',
      name: '奥地利百隆 (Blum) 原装阻尼五金系统',
      spec: '集成顶配阻尼缓冲铰链 48只 + 豪华骑马抽屉 12套',
      qty: 1,
      unit: '套',
      price: 1850
    }
  ]);
  const [quoteDepositPercent, setQuoteDepositPercent] = useState<number>(30);
  const [quoteLeadTime, setQuoteLeadTime] = useState<string>('25~30 工作日 (确认图纸与色板后)');
  const [quoteExportSuccess, setQuoteExportSuccess] = useState<string | null>(null);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    const hasAttachments = pendingAttachments.length > 0;
    if ((!text.trim() && !hasAttachments) || !activeSession) return;

    // Capture current pending quotes
    const quotesForThisMsg = pendingQuotedMessages.length > 0 ? [...pendingQuotedMessages] : undefined;

    // Capture attachments to send
    const attachmentsToSend: ChatMessage['attachments'] = pendingAttachments.map(att => ({
      id: att.id,
      type: att.type,
      url: att.previewUrl,
      name: att.name,
      size: att.size
    }));

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId: activeSession.id,
      sender: 'sales',
      content: text.trim() || (attachmentsToSend.length > 0 ? (attachmentsToSend.some(a => a.type === 'image') ? '【已发送图片】' : '【已发送附件/图纸】') : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quotedMessages: quotesForThisMsg,
      attachments: attachmentsToSend.length > 0 ? attachmentsToSend : undefined,
      messageType: attachmentsToSend.length > 0 ? (attachmentsToSend.some(a => a.type === 'image') ? 'text_image' : 'text_file') : 'text'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    clearAttachments();
    // Clear pending quotes after sending
    setSelectedQuoteIds([]);
    setPendingQuotedMessages([]);

    // Mock AI Generating State
    const aiMsgId = `msg-ai-${Date.now()}`;
    const aiGeneratingMsg: ChatMessage = {
      id: aiMsgId,
      sessionId: activeSession.id,
      sender: 'ai_copilot',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGenerating: true,
      generationTimeMs: 0
    };

    setMessages((prev) => [...prev, aiGeneratingMsg]);

    const startTime = Date.now();
    const interval = setInterval(() => {
      setMessages((prev) => 
        prev.map(m => m.id === aiMsgId ? { ...m, generationTimeMs: Date.now() - startTime } : m)
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setMessages((prev) => 
        prev.map(m => {
          if (m.id === aiMsgId) {
            let aiReplyContent = '已为您生成相关的话术与成单策略。建议向客户强调我们在工期和品质上的双重保障。';
            let attachments: ChatMessage['attachments'] = [
              {
                id: `att-ai-${Date.now()}`,
                type: 'file',
                url: '#',
                name: 'Quotation_Villa_Updated.pdf',
                size: '1.5 MB'
              }
            ];

            // If user attached images or files, recognize them with dedicated AI analysis
            if (attachmentsToSend && attachmentsToSend.length > 0) {
              const attNames = attachmentsToSend.map(a => `【${a.name}】`).join('、');
              const isImage = attachmentsToSend.some(a => a.type === 'image');
              if (isImage) {
                aiReplyContent = `### 🎯 AI 视觉图样与方案识别分析\n\n已成功接收您发送的图片：${attNames}。\n\n1. **图样与工艺特征解析**：\n   - 经视觉模型特征比对，该图纸/实景包含现代高定极简木作元素，门板推荐选用 **PET 零度超亚肤感板** 与 **PUR 激光封边工艺**，防潮耐黄变性能优异。\n   - 识别到内嵌式隐形拉手与铝合金框玻璃门搭配方案，质感高级。\n2. **设计与安装建议**：\n   - 如该方案属于通顶一门到顶设计（超过 2.4 米），强烈建议每扇门板加装 **内嵌式金属拉直器**（2 根/扇）以防板材因温湿度变化变形。\n3. **建议对客专业回复话术**：\n> "客户您好！您发送的设计效果图已收到并转交海外设计部深化。我们拥有同类高定落地的成熟案例与整套五金方案，稍后为您提供同等色号的板材切片实物视频与 3D 节点大样图！"`;
              } else {
                aiReplyContent = `### 🎯 AI 附件/工程图纸解析反馈\n\n已成功接收您发送的文件：${attNames}。\n\n1. **文件结构化归档**：\n   - 文件已自动纳入当前客户档案《${activeSession.customerName}》，提取到尺寸标注与工艺参数清单。\n2. **拆单与报价支持**：\n   - 已联动系统工程模块，可直接导出装箱体积 (CBM) 与海运估算，支持出具标准 Proforma Invoice (PI)。\n3. **建议对客专业回复话术**：\n> "工程图纸/清单已收到！技术部门正在进行精确拆单核算，稍后即可出具包含五金品牌配置与出厂工期的详细报价单供您审阅。"`;
              }
            } else if (quotesForThisMsg && quotesForThisMsg.length > 0) {
              const quoteSnippet = quotesForThisMsg.map(q => q.content).join(' ');
              const hasColorOrIsland = quoteSnippet.toLowerCase().includes('color') || quoteSnippet.toLowerCase().includes('island') || quoteSnippet.toLowerCase().includes('navy') || quoteSnippet.includes('颜色') || quoteSnippet.includes('岛台');
              const hasPriceOrQuote = quoteSnippet.toLowerCase().includes('quotation') || quoteSnippet.toLowerCase().includes('price') || quoteSnippet.includes('报价') || quoteSnippet.includes('78,500');

              if (hasColorOrIsland) {
                aiReplyContent = `### 🎯 针对客户引用对话的深度分析与回复话术

**客户关注点解析**：
客户对 Villa A 的 3D CAD 效果非常满意，并明确提出希望将**中岛台橱柜颜色调整为海军蓝 (RAL 5004)**。这表明客户处于高意向签约前夕的细节确认阶段。

---

#### 💡 推荐给客户的专业回复话术（中英双语）：

**英文版（建议直接复制发送给客户）**：
> "Hi David, wonderful question! Yes, absolutely. We can finish the island cabinetry in **Navy Blue (RAL 5004)** using our premium anti-fingerprint PUR matte lacquer with UV curing. 
> 
> Good news is: switching to RAL 5004 for the island will **NOT incur any additional surcharge** on the current $78,500 contract quotation. 
> 
> Our design team has already updated the 3D high-res rendering with the RAL 5004 Navy Blue island and brushed brass hardware for your final sign-off. Please check the attached revision rendering and updated specification sheet!"

**中文翻译与销售跟进策略**：
> "客户您好！完全没问题。我们可以将中岛台定制为 RAL 5004 海军蓝哑光肤感抗指纹烤漆。并且该调色在当前 $78,500 总报价内**无需额外加价**。设计团队已同步刷新了带黄铜五金的高清效果图供您最终确认。"

---

#### 📌 建议跟进动作：
1. 发送下方已附带的 RAL 5004 实物样板高清照片及微调后的 3D 渲染图；
2. 借此确认时机，推动签订最终定金合同并排期生产打样。`;
                attachments = [
                  {
                    id: `att-ai-color-1`,
                    type: 'image' as const,
                    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
                    name: 'Island_NavyBlue_RAL5004_Render.jpg'
                  },
                  {
                    id: `att-ai-color-2`,
                    type: 'file' as const,
                    url: '#',
                    name: 'Finish_Spec_RAL5004_Matte.pdf',
                    size: '2.1 MB'
                  }
                ];
              } else if (hasPriceOrQuote) {
                aiReplyContent = `### 🎯 针对客户报价意向的分析与逼单建议

**客户关注点解析**：
客户确认了 3 套加州别墅 **$78,500 的总报价在预算范围内**。目前处于从询价到定稿、签约交定金的关键窗口期。

---

#### 💡 建议销售话术（中英双语）：

**英文话术**：
> "Thank you David! We're thrilled that the $78,500 package aligns with your budget. To ensure the 60-day delivery to Los Angeles port is met before the holiday season, our workshop can reserve the dedicated production line once the 30% deposit agreement is signed. 
> 
> Would you like us to generate the formal Proforma Invoice (PI) and hardware schedule today?"

**中文说明**：
> 提示客户当前船期与排产计划紧凑，建议当天推进形式发票 (PI) 签订与 30% 定金锁定生产线。`;
              } else {
                aiReplyContent = `### 🎯 针对您引用的 ${quotesForThisMsg.length} 条社媒对话分析：

1. **核心痛点**：客户主要关心定制细节落地性、材料工艺标准与交付排期。
2. **话术建议**：向客户展示我们的工厂数字化生产资质与以往相似项目的落地实景，增强信任度并推动决策。
3. **推荐资料**：已为您匹配知识库中的技术白皮书与包装测试报告。`;
              }
            }

            return {
              ...m,
              isGenerating: false,
              content: aiReplyContent,
              messageType: 'text_file',
              attachments: attachments,
              citations: [
                {
                  id: 'kb-03',
                  title: '《外贸高定RAL色卡与表面烤漆工艺规范》',
                  version: 'v2.0',
                  category: '高定表面处理工艺',
                  excerpt: '技术规范：RAL 5004（海军蓝）采用底漆两遍+面漆三遍纳米哑光烘烤工艺，附着力达 0 级，耐磨耐划。'
                },
                {
                  id: 'kb-04',
                  title: '《外贸报价单与合同转化标准话术手册》',
                  version: 'v1.5',
                  category: '商务谈判指南',
                  excerpt: '商务指引：外贸定制柜体标准条款 30% T/T 定金锁定船期排产，交期25-30工作日，出厂前提供完整试装视频。'
                }
              ]
            };
          }
          return m;
        })
      );
    }, 2000);
  };

  const handleInsertScript = (script: ScriptItem) => {
    setInputMessage((prev) => (prev ? `${prev}\n\n${script.content}` : script.content));
  };

  const handleSelectExternalChat = (chat: ExternalSocialChat) => {
    setSelectedExternalChatId(chat.id);
    setIsChatPickerOpen(false);
    setNewCustomerName(chat.name);
    if (chat.defaultCompany) setNewCompanyName(chat.defaultCompany);
    if (chat.defaultPhone) setNewContactInfo(chat.defaultPhone);

    // 创建AI会话时，先不填写客户标签
    setSelectedTags([]);

    // 企微和 WhatsApp 仅保留手动输入
    setRecordInputMode('manual');
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setRawRecordText('');
    setInitialNote(`【从${chat.channel}${chat.type === 'group' ? '客户群聊' : '个人私聊'}「${chat.name}」同步】\n最新沟通摘要：${chat.lastMessage}\n${chat.subtitle}`);
  };

  const handleClearExternalChatSelection = () => {
    setSelectedExternalChatId(null);
    setIsChatPickerOpen(false);
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    const avatarText = newCustomerName.trim().slice(0, 2).toUpperCase();
    const isExternalSync = !!selectedExternalChatId;
    const newSess: SessionItem = {
      id: `SESS-${Math.floor(200 + Math.random() * 800)}`,
      customerName: newCustomerName.trim(),
      avatar: avatarText,
      channel: newChannel,
      companyName: newCompanyName.trim() || undefined,
      contactInfo: newContactInfo.trim() || undefined,
      unreadCount: 0,
      lastMessage: initialNote.trim() || (isExternalSync ? '已关联同步社媒对话，等待AI深化...' : '销售手动发起建联，等待沟通...'),
      lastTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tags: [], // 创建AI会话时，先不填写客户标签
      assignedStaff: newAssignedStaff,
      status: '跟进中'
    };

    setSessionList([newSess, ...sessionList]);
    setActiveTab(newChannel);
    setShowCreateModal(false);

    // Reset form
    setNewCustomerName('');
    setNewCompanyName('');
    setNewContactInfo('');
    setInitialNote('');
    setSelectedTags([]);
    setSelectedExternalChatId(null);
    setRecordInputMode('manual');
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setRawRecordText('');
    setAiAnalysisCompleted(false);
    setAiExtractedSummary(null);

    // Directly enter the newly created session
    setActiveSession(newSess);
  };

  // Mock Upload Handler
  const handleFileUpload = (file: File, type: 'chat' | 'audio') => {
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    
    if (type === 'chat') {
      setRawRecordText(`[导入聊天文件: ${file.name}]\n客户：“你好，我们在广州珠江新城有一套360平米的顶复豪宅，需要全案定制。主卧需要爱格W1000板材的步入式衣帽间，客厅整面要做碳晶护墙板和磁吸隐藏门。预算大概50万以内，要求下个月15号前打样确认并排期进场。”\n销售：“收到！我们有德国百隆五金和爱格官方授权，可提供1:1节点图与色板包邮送样。”`);
    } else {
      setRawRecordText(`[语音识别音频文件: ${file.name} | 时长: 03分42秒]\n【客户发言】：我们是杭州极简美学设计院的李工，负责千岛湖高端度假独栋项目。对墙板防潮和柜体环保等级要求极高（必须达到ENF级或日本F4星）。你们实木贴皮和碳晶板的阻燃报告（BS5852 / B1级）能否下周附在报价单里？\n【销售回应】：没问题李工，我们所有工程板材均具备国家阻燃及环保双重认证，随时可安排打样专函寄送。`);
    }
  };

  // Run AI Analysis
  const handleTriggerAiAnalysis = () => {
    if (!rawRecordText && !uploadedFileName) return;
    setIsAiAnalyzing(true);

    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiAnalysisCompleted(true);

      // AI Extracted Data depending on channel / context
      let extracted: typeof aiExtractedSummary = null;

      if (uploadedFileName?.includes('深圳湾') || rawRecordText.includes('深圳湾')) {
        extracted = {
          customerName: '张明远 先生',
          companyName: '深圳湾一号私宅大平层 (280㎡)',
          contactInfo: '139-2841-8899',
          tags: ['全案高定', '私宅别墅', '爱格板定制', '碳晶护墙板', '隐形门系统', '待打样', '预算充足'],
          urgencyLevel: '高',
          estimatedBudget: '35万 - 45万 RMB',
          structuredDemand: `【项目类型】深圳湾一号 280㎡ 大平层全案高定\n【核心材质需求】爱格板 (W1000/U708)、整墙碳晶护墙板、极简隐形门系统\n【关键节点要求】下周三量尺，急需寄送碳晶护墙板小样与色卡\n【预算范围】约 35万~45万元\n【销售跟进建议】已安排资深深化设计师带样箱上门，重点突出同小区实操案例与节点收口细节`
        };
      } else if (uploadedFileName?.includes('迪拜') || rawRecordText.includes('Dubai') || rawRecordText.includes('Palm Jumeirah')) {
        extracted = {
          customerName: 'Tariq Al-Mansoor',
          companyName: 'Royal Oasis Hospitality (Dubai)',
          contactInfo: '+971 50 123 4567',
          tags: ['外贸大单', '酒店工程', '待打样', '工期紧急', '预算充足'],
          urgencyLevel: '高',
          estimatedBudget: '$320,000+ USD (12x 40HQ)',
          structuredDemand: `【项目类型】迪拜朱美拉棕榈岛 45 栋度假别墅定制固装木作\n【核心工艺要求】BS5852 英国阻燃标准木作、PVD 钛金黄铜金属收边条、防潮耐高温处理\n【装柜估算】预计 12 个 40HQ 高柜\n【后续动作】4 个工作日内向客户迪拜代表处快递 Master Sample 打样箱及阻燃检测报告`
        };
      } else {
        extracted = {
          customerName: '李工 / 李工设计院',
          companyName: '千岛湖高端独栋度假项目',
          contactInfo: '138-0571-6622',
          tags: ['全案高定', '酒店工程', '爱格板定制', '碳晶护墙板', '待打样'],
          urgencyLevel: '中',
          estimatedBudget: '50万+ RMB',
          structuredDemand: `【客户意向】千岛湖高端度假项目固装与护墙板定制\n【环保/安全等级】明确要求 ENF 级 / 日本 F4 星环保标准，护墙板需 B1 级阻燃认证\n【跟进任务】下周初连同报价单附上官方检测报告与实木贴皮/碳晶板打样`
        };
      }

      setAiExtractedSummary(extracted);

      // Auto-populate form fields if empty or update
      if (extracted.customerName && !newCustomerName) {
        setNewCustomerName(extracted.customerName);
      }
      if (extracted.companyName && !newCompanyName) {
        setNewCompanyName(extracted.companyName);
      }
      if (extracted.contactInfo && !newContactInfo) {
        setNewContactInfo(extracted.contactInfo);
      }

      // 创建AI会话时，先不填写客户标签，保持为空
      setSelectedTags([]);

      // Set Structured Demand into Note Textarea
      setInitialNote(extracted.structuredDemand);
    }, 1200);
  };

  
  const filteredSessions = sessionList.filter((s) => {
    if (s.channel !== activeTab && !(activeTab === '企微' && s.channel === '企业微信')) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchName = s.customerName.toLowerCase().includes(q);
      const matchCompany = s.companyName?.toLowerCase().includes(q);
      const matchStaff = s.assignedStaff.toLowerCase().includes(q);
      const matchId = s.id.toLowerCase().includes(q);
      const matchMsg = s.lastMessage.toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchStaff && !matchId && !matchMsg) return false;
    }
    return true;
  });

  // Automatically select the first available session if none is selected
  useEffect(() => {
    if (!activeSession && filteredSessions.length > 0) {
      setActiveSession(filteredSessions[0]);
    }
  }, [filteredSessions, activeSession]);

  return (
    <div className="flex-1 flex flex-col h-full px-4 lg:px-6 pb-6 pt-1 overflow-hidden select-none">
      {/* Main Dual-Column Split Workspace: Left List + Right Detail */}
      <div className="flex-1 flex gap-3.5 lg:gap-4 overflow-hidden min-h-0">
        
        {/* ========================================================= */}
        {/* 左侧：会话列表面板 (Left: Session List Panel)               */}
        {/* ========================================================= */}
        <div
          className={`shrink-0 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 ${
            isLeftCollapsed
              ? 'w-0 p-0 border-0 opacity-0 pointer-events-none hidden'
              : 'w-[350px] md:w-[370px] lg:w-[390px] xl:w-[410px]'
          }`}
        >
          {/* Top Bar: Title, Count & New Session Button */}
          <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>AI会话列表</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                  {filteredSessions.length}
                </span>
              </h2>
            </div>
            <button
              onClick={() => {
                setNewChannel(activeTab);
                setRecordInputMode('manual');
                setShowCreateModal(true);
              }}
              className="h-8 px-3 rounded-full bg-[#EA3A20] text-white hover:bg-[#d6341c] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
              title="新建AI会话"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ 新建AI会话</span>
            </button>
          </div>

          {/* Channel Filter Tabs (企微, WhatsApp, 线下对接) */}
          <div className="p-3 pb-2 border-b border-slate-100 bg-white">
            <div className="bg-slate-100/90 rounded-full p-1 flex items-center gap-1">
              {(['企微', 'WhatsApp', '线下对接'] as const).map((tab) => {
                const count = sessionList.filter(
                  (s) => s.channel === tab || (tab === '企微' && s.channel === '企业微信')
                ).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeTab === tab
                        ? 'bg-[#EA3A20] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/40 space-y-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索客户姓名 / 企业 / 账号..."
                className="h-8 pl-8 pr-7 w-full rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] focus:border-[#EA3A20]"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full h-7 pl-2.5 pr-6 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="跟进中">跟进中</option>
                <option value="已报价">已报价</option>
                <option value="已成交">已成交</option>
                <option value="已流失">已流失</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Session Cards Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-slate-50/20">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((sess) => {
                const isSelected = activeSession?.id === sess.id;
                return (
                  <div
                    key={sess.id}
                    onClick={() => {
                      if (activeSession?.id !== sess.id) {
                        setSelectedQuoteIds([]);
                        setPendingQuotedMessages([]);
                      }
                      setActiveSession(sess);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#EA3A20]/5 border-[#0F4A47] ring-1 ring-[#0F4A47]/30 shadow-xs border-l-[5px] border-l-[#0F4A47]'
                        : 'bg-white hover:bg-slate-50/90 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* First Line: Name, ID, Source badge, Time */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`font-bold text-xs truncate ${isSelected ? 'text-[#0F4A47]' : 'text-slate-900'}`}>
                          {sess.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {sess.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">{sess.lastTime || '19:48'}</span>
                      </div>
                    </div>

                    {/* Meta Row: Channel badge, Sales staff, Quick Status */}
                    <div className="flex items-center justify-between gap-2 mb-2 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.2 rounded-full font-bold text-[10px] border ${
                            sess.channel === '企微' || sess.channel === '企业微信'
                              ? 'bg-blue-50 text-blue-600 border-blue-100'
                              : sess.channel === 'WhatsApp'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-purple-50 text-purple-700 border-purple-100'
                          }`}
                        >
                          {sess.channel === '企业微信' ? '企微' : sess.channel}
                        </span>
                        <span className="text-slate-500 text-[11px] font-medium">
                          销售: <strong className="text-slate-700">{sess.assignedStaff}</strong>
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            sess.status === '跟进中' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            sess.status === '已报价' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            sess.status === '已成交' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {sess.status}
                        </span>
                      </div>
                    </div>

                    {/* Last Message Snippet */}
                    <p className="text-[11px] text-slate-500 truncate leading-relaxed mb-2">
                      {sess.lastMessage || '等待进一步沟通对接...'}
                    </p>

                    {/* Tags */}
                    {sess.tags && sess.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 items-center">
                        {sess.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 text-[9px] bg-slate-100 text-slate-600 rounded font-medium truncate max-w-[95px]"
                          >
                            {tag}
                          </span>
                        ))}
                        {sess.tags.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-mono">+{sess.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs px-4">
                暂无符合条件的会话，可切换渠道或清空搜索词。
              </div>
            )}
          </div>

          {/* Left Footer: Session count & status */}
          <div className="p-2.5 px-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
            <span>共 {filteredSessions.length} 个活跃会话</span>
            <span className="text-[10px] text-slate-400">实时同步</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 右侧：会话详情与工作区 (Right: Session Detail Workspace)     */}
        {/* ========================================================= */}
        <div className="flex-1 min-w-0 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden">
          {activeSession ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Active Customer Top Bar */}
              <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Toggle Left List Button */}
                  <button
                    onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                    title={isLeftCollapsed ? '展开左侧AI会话列表' : '收起左侧AI会话列表'}
                  >
                    {isLeftCollapsed ? <PanelLeftOpen className="w-4 h-4 text-[#0F4A47]" /> : <PanelLeftClose className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-sm font-bold text-slate-900 truncate">{activeSession.customerName}</h2>
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                      <span>渠道: <strong className="text-slate-700">{activeSession.channel === '企业微信' ? '企微' : activeSession.channel}</strong></span>
                      {activeSession.contactInfo && (
                        <span>账号: <strong className="text-slate-700 font-mono">{activeSession.contactInfo}</strong></span>
                      )}
                      <span>销售员: <strong className="text-slate-700">{activeSession.assignedStaff}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Actions on Top Bar */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={activeSession.status}
                      onChange={(e) => handleStatusChange(activeSession.id, e.target.value)}
                      className={`appearance-none h-8 pl-3 pr-7 rounded-full border text-xs font-bold focus:outline-none cursor-pointer transition-colors ${
                        activeSession.status === '跟进中' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        activeSession.status === '已报价' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        activeSession.status === '已成交' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <option value="跟进中">跟进中</option>
                      <option value="已报价">已报价</option>
                      <option value="已成交">已成交</option>
                      <option value="已流失">已流失</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Toggle Right Profile Panel Button */}
                  <button
                    onClick={() => setIsRightProfileCollapsed(!isRightProfileCollapsed)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title={isRightProfileCollapsed ? '展开客户资料与背景信息' : '收起客户资料面板'}
                  >
                    {isRightProfileCollapsed ? <PanelRightOpen className="w-4 h-4 text-[#0F4A47]" /> : <PanelRightClose className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Main Workspace Body: AI Chat + Right Profile Panel */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Center Workspace: AI Sales Assistant Chat */}
                <div className="flex-1 flex flex-col h-full bg-slate-50/40 overflow-hidden">
                  
                  {/* Chat Stream */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-3 ${m.sender === 'sales' ? 'ml-auto flex-row-reverse max-w-xl' : 'max-w-3xl'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-2xs ${
                          m.sender === 'sales' ? 'bg-[#EA3A20]' : 'bg-gradient-to-br from-indigo-600 to-indigo-800'
                        }`}>
                          {m.sender === 'sales' ? 'ME' : (m.isGenerating ? <Loader2 className="w-4 h-4 text-indigo-100 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-100" />)}
                        </div>

                        <div className="space-y-1">
                          <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                            m.sender === 'sales'
                              ? 'bg-[#EA3A20] text-white rounded-tr-xs shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs shadow-2xs'
                          }`}>
                            {/* Quoted messages attachment if sales cited social chat records */}
                            {m.quotedMessages && m.quotedMessages.length > 0 && (
                              <div className={`mb-3 p-2.5 rounded-xl text-left space-y-1.5 ${
                                m.sender === 'sales'
                                  ? 'bg-black/15 border border-white/20 text-white'
                                  : 'bg-slate-50 border border-slate-200 text-slate-700'
                              }`}>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-90 pb-1 border-b border-white/20">
                                  <Quote className="w-3 h-3 text-amber-300 shrink-0" />
                                  <span>已引用 {m.quotedMessages.length} 条社媒聊天记录作为背景：</span>
                                </div>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                  {m.quotedMessages.map((qm, qIdx) => (
                                    <div key={qm.id || qIdx} className="text-[11px] bg-white/10 rounded-lg p-2 leading-relaxed">
                                      <div className="flex items-center justify-between text-[9px] opacity-80 mb-0.5 font-bold">
                                        <span>{qm.senderName || (qm.sender === 'sales' ? '我' : '客户')}</span>
                                        {qm.timestamp && <span className="font-mono">{qm.timestamp}</span>}
                                      </div>
                                      <div className="opacity-95">{qm.content}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {m.isGenerating ? (
                              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                正在分析客户信息并生成专业话术... {(m.generationTimeMs! / 1000).toFixed(1)}s
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {m.content && (
                                  <div className="text-xs leading-relaxed [&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2 [&>strong]:font-bold [&>a]:text-indigo-600 [&>a]:underline">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                                  </div>
                                )}

                                {m.attachments && m.attachments.length > 0 && (
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {m.attachments.map(att => (
                                      <div key={att.id} className="border border-slate-200 rounded-lg overflow-hidden flex flex-col group cursor-pointer hover:border-indigo-400 transition-colors">
                                        {att.type === 'image' && (
                                          <div className="relative h-24 bg-slate-100">
                                            <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        {att.type === 'video' && (
                                          <div className="relative h-24 bg-slate-800 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                                            {att.thumbnail ? (
                                              <img src={att.thumbnail} alt={att.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                            ) : (
                                              <div className="absolute inset-0 bg-slate-800 opacity-50" />
                                            )}
                                            <PlayCircle className="w-8 h-8 text-white z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                            {att.duration && <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">{att.duration}</span>}
                                          </div>
                                        )}
                                        {att.type === 'file' && (
                                          <div className="h-12 bg-slate-50 flex items-center px-3 gap-2">
                                            <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                              <div className="text-[10px] font-bold text-slate-700 truncate">{att.name}</div>
                                              {att.size && <div className="text-[9px] text-slate-400">{att.size}</div>}
                                            </div>
                                          </div>
                                        )}
                                        {att.type !== 'file' && (
                                          <div className="p-2 bg-white flex items-center gap-1.5">
                                            {att.type === 'image' ? <ImageIcon className="w-3 h-3 text-slate-400" /> : <PlayCircle className="w-3 h-3 text-slate-400" />}
                                            <span className="text-[10px] text-slate-600 truncate">{att.name}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {m.citations && m.citations.length > 0 && (
                                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                                      <BookOpen className="w-3 h-3 text-slate-400" />
                                      引用来源
                                    </span>
                                    {m.citations.map((cit, citIdx) => (
                                      <div key={cit.id} className="relative group/cit">
                                        <button
                                          type="button"
                                          onClick={() => setActiveCitationModal(cit)}
                                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100/90 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/80 hover:border-indigo-200 text-[10px] font-medium transition-colors cursor-pointer"
                                        >
                                          <span className="font-mono font-bold text-indigo-600">[{citIdx + 1}]</span>
                                          <span className="max-w-[130px] truncate">{cit.title.replace(/^《|》$/g, '')}</span>
                                        </button>

                                        {/* Floating lightweight popover on hover */}
                                        <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover/cit:flex flex-col z-50 w-72 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                                          <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-100">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                              <span className="shrink-0 w-4 h-4 rounded bg-indigo-50 text-indigo-600 font-mono text-[10px] font-bold flex items-center justify-center">
                                                {citIdx + 1}
                                              </span>
                                              <span className="text-xs font-bold text-slate-800 truncate">
                                                {cit.title}
                                              </span>
                                            </div>
                                            <span className="text-[9px] font-mono px-1 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 shrink-0">
                                              {cit.version}
                                            </span>
                                          </div>
                                          {cit.category && (
                                            <div className="mt-1 text-[10px] text-indigo-600 font-semibold">
                                              分类: {cit.category}
                                            </div>
                                          )}
                                          <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                                            {cit.excerpt || '收录于企业工艺与标准知识库，经工厂实验室验证与专家审核的权威依据。'}
                                          </p>
                                          <div className="mt-2 pt-1.5 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                                            <span>点击查看完整来源</span>
                                            <span className="text-indigo-600 font-medium flex items-center gap-0.5">
                                              权威知识库 <ArrowRight className="w-2.5 h-2.5" />
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {m.translatedContent && !m.isGenerating && (
                              <div className="mt-2 pt-2 border-t border-white/20 text-white/80 text-[11px] flex items-start gap-1">
                                <Languages className="w-3 h-3 text-white shrink-0 mt-0.5" />
                                <span>AI 同传：{m.translatedContent}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 px-1 font-mono flex items-center gap-2">
                            {m.timestamp}
                            {m.sender === 'ai_copilot' && !m.isGenerating && m.generationTimeMs !== undefined && (
                              <span className="text-slate-300">· 生成耗时 {(m.generationTimeMs / 1000).toFixed(1)}s</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Bar */}
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

                    <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowQuoteModal(true)}
                          className="flex items-center gap-1 hover:text-[#EA3A20] text-slate-700 cursor-pointer font-bold transition-colors"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-[#EA3A20]" /> 生成报价单 (PI)
                        </button>

                        <button
                          onClick={() => setShowCbmCalc(true)}
                          className="flex items-center gap-1 hover:text-[#EA3A20] text-slate-700 cursor-pointer font-bold transition-colors"
                        >
                          <Calculator className="w-3.5 h-3.5 text-amber-500" /> CBM 材积测算
                        </button>

                        <label className="flex items-center gap-1 hover:text-[#EA3A20] text-slate-500 cursor-pointer font-bold transition-colors">
                          <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                          <span>上传图片/文件</span>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) processFiles(e.target.files);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Compact Quoted messages preview bar */}
                    {pendingQuotedMessages.length > 0 && (
                      <div className="flex items-center justify-between px-3 py-2 bg-rose-50/80 border border-rose-200 rounded-xl text-xs">
                        <div className="flex items-center gap-2 font-bold text-[#EA3A20] truncate">
                          <Quote className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">已引用 {pendingQuotedMessages.length} 条社媒记录作为提问上下文</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowQuoteDetailsModal(true)}
                            className="text-[11px] text-[#EA3A20] hover:underline font-bold cursor-pointer"
                          >
                            查看 / 管理
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={handleClearAllQuotes}
                            className="text-[11px] text-slate-500 hover:text-red-600 font-medium cursor-pointer"
                          >
                            清空
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Modal to view / manage quoted messages */}
                    {showQuoteDetailsModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <Quote className="w-4 h-4 text-[#EA3A20]" />
                              已引用的社媒沟通记录 ({pendingQuotedMessages.length}条)
                            </h3>
                            <button
                              onClick={() => setShowQuoteDetailsModal(false)}
                              className="w-7 h-7 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {pendingQuotedMessages.map((qm) => (
                              <div
                                key={qm.id}
                                className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    qm.sender === 'sales' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                                  }`}>
                                    {qm.senderName || (qm.sender === 'sales' ? '我' : '客户')}
                                  </span>
                                  <span className="text-slate-700 truncate text-xs">
                                    {qm.content}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePendingQuote(qm.id)}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors shrink-0 cursor-pointer"
                                  title="移除此条引用"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">
                              AI 将结合以上引用的真实对话进行高定话术生成
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowQuoteDetailsModal(false)}
                              className="px-4 py-1.5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              确定
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative flex items-end gap-2">
                      <textarea
                        rows={2}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onPaste={handlePaste}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (!inputMessage.trim() && pendingQuotedMessages.length > 0) {
                              handleSendMessage('请针对以上引用的社媒客户对话，分析客户需求并给出专业回复建议与话术。');
                            } else if (inputMessage.trim() || pendingAttachments.length > 0) {
                              handleSendMessage();
                            }
                          }
                        }}
                        placeholder={
                          isListening
                            ? '正在语音录入，Enter 发送...'
                            : '输入问题或沟通难点，Enter 发送...'
                        }
                        className="flex-1 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20] resize-none"
                      />

                      <button
                        type="button"
                        onClick={handleToggleVoice}
                        className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                          isListening
                            ? 'bg-red-600 text-white shadow-xs animate-pulse ring-2 ring-red-300'
                            : 'bg-white hover:bg-slate-200/80 text-slate-600 border border-slate-200/80 shadow-2xs hover:text-[#EA3A20]'
                        }`}
                        title={isListening ? '点击完成语音录入' : '语音输入'}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          if (!inputMessage.trim() && pendingQuotedMessages.length > 0) {
                            handleSendMessage('请针对以上引用的社媒客户对话，分析客户需求并给出专业回复建议与话术。');
                          } else {
                            handleSendMessage();
                          }
                        }}
                        disabled={!inputMessage.trim() && pendingQuotedMessages.length === 0 && pendingAttachments.length === 0}
                        className="h-11 px-5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" /> 发送
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Sub-Panel: Customer Profile & Assets (Collapsible) */}
                {!isRightProfileCollapsed && (
                  <div className="w-[320px] lg:w-[340px] xl:w-[360px] bg-slate-50/50 border-l border-slate-200 flex flex-col h-full shrink-0 transition-all">
                    <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                        <FileCheck className="w-4 h-4 text-slate-600" /> 客户资料与背景信息
                      </div>
                    </div>

                    <div className="flex border-b border-slate-200 text-xs bg-white">
                      {(['history', 'tags', 'assets', 'knowledge'] as const).map((tab) => {
                        const labels: Record<typeof tab, string> = {
                          history: '聊天记录',
                          tags: '客户标签',
                          assets: '户型与报价',
                          knowledge: '关联知识'
                        };
                        return (
                          <button
                            key={tab}
                            onClick={() => setProfileTab(tab)}
                            className={`flex-1 py-3 text-center font-bold transition-colors cursor-pointer border-b-2 text-[11px] ${
                              profileTab === tab
                                ? 'text-[#EA3A20] border-[#EA3A20]'
                                : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            {labels[tab]}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50">
                      
                      {/* Profile Tab Content: 聊天记录 */}
                      {profileTab === 'history' && (
                        <div className="space-y-3.5">
                          {/* Top Action Header for Quote Selection */}
                          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                              <Quote className="w-3.5 h-3.5 text-[#EA3A20]" />
                              <span>勾选对话可引用至 AI 提问</span>
                            </div>
                            {selectedQuoteIds.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-[#EA3A20] bg-rose-50 px-2 py-0.5 rounded-md">
                                  已选 {selectedQuoteIds.length} 条
                                </span>
                                <button
                                  type="button"
                                  onClick={handleClearAllQuotes}
                                  className="text-[10px] text-slate-400 hover:text-slate-600 hover:underline cursor-pointer"
                                >
                                  清空
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  // Quick select all customer questions
                                  chatMessages.forEach(msg => {
                                    if (!selectedQuoteIds.includes(msg.id)) {
                                      handleToggleQuoteMessage(msg);
                                    }
                                  });
                                }}
                                className="text-[10px] text-[#0F4A47] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                全选对话
                              </button>
                            )}
                          </div>

                          <div className="text-xs text-slate-400 text-center mb-1 font-medium">— 上次跟进: 昨天 19:48 —</div>

                          {chatMessages.map((msg, i) => {
                            const isSelected = selectedQuoteIds.includes(msg.id);
                            return (
                              <div
                                key={msg.id || i}
                                onClick={() => handleToggleQuoteMessage(msg)}
                                className={`p-2.5 rounded-2xl border transition-all cursor-pointer group relative ${
                                  isSelected
                                    ? 'bg-rose-50/70 border-[#EA3A20] shadow-xs ring-1 ring-[#EA3A20]/30'
                                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  {/* Checkbox indicator */}
                                  <div className="pt-0.5 shrink-0">
                                    <div
                                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                        isSelected
                                          ? 'bg-[#EA3A20] text-white'
                                          : 'border border-slate-300 group-hover:border-[#EA3A20] text-transparent'
                                      }`}
                                    >
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  </div>

                                  {/* Avatar */}
                                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-[9px] font-bold text-slate-600 mt-0.5">
                                    {msg.sender === 'sales' ? 'ME' : 'CU'}
                                  </div>

                                  {/* Message Body */}
                                  <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="font-bold text-slate-700 truncate">
                                        {msg.sender === 'sales' ? '我 (Franklin)' : activeSession.customerName}
                                      </span>
                                      <span className="text-slate-400 font-mono ml-2 shrink-0">{msg.timestamp}</span>
                                    </div>

                                    <div className="text-xs text-slate-700 leading-relaxed break-words">
                                      {msg.content}
                                    </div>

                                    {msg.translatedContent && (
                                      <div className="text-[11px] text-slate-500 bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 mt-1 flex items-start gap-1">
                                        <Languages className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{msg.translatedContent}</span>
                                      </div>
                                    )}

                                    {/* Selected indicator badge */}
                                    {isSelected && (
                                      <div className="pt-0.5 flex items-center justify-end">
                                        <span className="text-[10px] text-[#EA3A20] bg-rose-50 px-1.5 py-0.5 rounded font-medium">
                                          已选入引用
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Profile Tab Content: 客户标签 */}
                      {profileTab === 'tags' && (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-indigo-500" /> 已分配标签</h3>
                            <div className="flex flex-wrap gap-2">
                              {activeSession.tags.map((tag, i) => (
                                <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                                  {tag}
                                </span>
                              ))}
                              <button className="px-2.5 py-1 border border-dashed border-slate-300 text-slate-400 rounded-lg text-xs font-bold hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer">
                                + 添加标签
                              </button>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-800 mb-3">AI 意向评估</h3>
                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                <span className="text-slate-500">转化概率</span>
                                <span className="font-bold text-emerald-600">High (85%)</span>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                <span className="text-slate-500">预算评估</span>
                                <span className="font-bold text-slate-800">$75,000 - $80,000</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">需求偏好</span>
                                <span className="font-bold text-slate-800">现代极简, 原木色</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Profile Tab Content: 户型与报价 */}
                      {profileTab === 'assets' && (
                        <div className="space-y-3">
                          <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 cursor-pointer transition-colors group flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 mb-0.5">Quotation_Villa_A_v2.pdf</div>
                              <div className="text-[10px] text-slate-400">昨天 18:30 • 2.4 MB</div>
                            </div>
                          </div>
                          <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 cursor-pointer transition-colors group flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 mb-0.5">FloorPlan_CAD_Export.dwg</div>
                              <div className="text-[10px] text-slate-400">周一 14:15 • 15.1 MB</div>
                            </div>
                          </div>
                          <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                            <UploadCloud className="w-4 h-4" /> 上传新文件
                          </button>
                        </div>
                      )}

                      {/* Profile Tab Content: 相关知识库 */}
                      {profileTab === 'knowledge' && (
                        <div className="space-y-3">
                          {scripts.slice(0, 3).map((sc) => (
                            <div
                              key={sc.id}
                              onClick={() => handleInsertScript(sc)}
                              className="p-3 bg-white hover:bg-[#FFF4F2] border border-slate-200 hover:border-[#EA3A20]/30 rounded-xl cursor-pointer transition-all space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-800">{sc.title}</span>
                                <span className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full font-bold border border-slate-100">
                                  {sc.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                {sc.content}
                              </p>
                            </div>
                          ))}
                          <div className="text-center pt-2">
                            <button className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer">
                              在知识库中搜索更多 →
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            /* Empty State when no session selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#0F4A47] flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">未选中任何会话</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-5">
                请在左侧AI会话列表中点击选中客户进行即时沟通，或点击上方「+ 新建AI会话」录入新客户。
              </p>
              <button
                onClick={() => {
                  setNewChannel(activeTab);
                  setShowCreateModal(true);
                }}
                className="px-5 py-2 rounded-full bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>立即新建AI会话</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Modal: 新建AI会话 (销售手动创建 & AI 智能解析沟通记录/录音) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shadow-2xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    新建会话
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSession} className="p-6 space-y-4 text-xs max-h-[82vh] overflow-y-auto custom-scrollbar">
              
              {/* 渠道选择 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">接入渠道</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setNewChannel('企微');
                      setSelectedExternalChatId(null);
                      setExternalChatFilter('all');
                      setExternalChatSearch('');
                      setIsChatPickerOpen(false);
                      setRecordInputMode('manual');
                    }}
                    className={`py-2.5 px-3 rounded-2xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all ${
                      newChannel === '企微' || newChannel === ('企业微信' as any)
                        ? 'border-blue-500 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span>企微</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewChannel('WhatsApp');
                      setSelectedExternalChatId(null);
                      setExternalChatFilter('all');
                      setExternalChatSearch('');
                      setIsChatPickerOpen(false);
                      setRecordInputMode('manual');
                    }}
                    className={`py-2.5 px-3 rounded-2xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all ${
                      newChannel === 'WhatsApp'
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-700 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewChannel('线下对接');
                      setSelectedExternalChatId(null);
                      setIsChatPickerOpen(false);
                    }}
                    className={`py-2.5 px-3 rounded-2xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all ${
                      newChannel === '线下对接'
                        ? 'border-purple-500 bg-purple-50/70 text-purple-700 ring-2 ring-purple-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span>线下对接</span>
                  </button>
                </div>
              </div>

              {/* 企微专属：紧凑对话选择器 */}
              {newChannel === '企微' && (
                <div ref={chatPickerRef} className="bg-blue-50/40 rounded-2xl p-3.5 border border-blue-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-blue-600" />
                        关联对话
                      </span>
                    </div>
                  </div>

                  {/* 如果已选中对话：展示紧凑优雅的单行已关联卡片（仅高约48px，不占表单空间） */}
                  {selectedExternalChatId && (() => {
                    const selectedChat = mockWeComChats.find(c => c.id === selectedExternalChatId);
                    if (!selectedChat) return null;
                    return (
                      <div className="bg-white rounded-xl p-2.5 border border-blue-200 shadow-2xs flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              selectedChat.type === 'group'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {selectedChat.type === 'group' ? (
                              <Users className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-800 text-xs truncate">
                                {selectedChat.name}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                  selectedChat.type === 'group'
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200/80'
                                }`}
                              >
                                {selectedChat.type === 'group' ? `${selectedChat.memberCount}人群聊` : '企微私聊'}
                              </span>
                              {selectedChat.defaultCompany && (
                                <span className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                  · {selectedChat.defaultCompany}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              {selectedChat.lastMessage}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setIsChatPickerOpen(true);
                              setExternalChatSearch('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            更换对话
                          </button>
                          <button
                            type="button"
                            onClick={handleClearExternalChatSelection}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="清除已选"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 未选中或点击更换时：高阶搜索触发器与下拉检索 Popover */}
                  <div className="relative">
                    {!selectedExternalChatId && (
                      <div className="space-y-1.5">
                        {/* 搜索选择器触发栏 */}
                        <div
                          onClick={() => setIsChatPickerOpen(!isChatPickerOpen)}
                          className={`w-full px-3 py-2 bg-white rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                            isChatPickerOpen
                              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-blue-200/80 hover:border-blue-400 hover:bg-blue-50/20 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-slate-600 min-w-0">
                            <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="text-[11px] text-slate-600 truncate">
                              搜索或选择企微对话...
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-1.5 py-0.5 rounded">
                              共 {mockWeComChats.length} 个对话
                            </span>
                            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </div>

                        {/* 常用/最近沟通快速选择胶囊 */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar text-[11px]">
                          <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" /> 最近活跃:
                          </span>
                          {mockWeComChats.slice(0, 4).map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handleSelectExternalChat(c)}
                              className="px-2 py-0.5 rounded-full bg-white hover:bg-blue-50 border border-blue-200/70 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-[10px] whitespace-nowrap transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                            >
                              {c.type === 'group' ? (
                                <Users className="w-2.5 h-2.5 text-indigo-500" />
                              ) : (
                                <User className="w-2.5 h-2.5 text-blue-500" />
                              )}
                              <span className="truncate max-w-[120px]">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 下拉高密度检索弹层 (Popover) */}
                    {isChatPickerOpen && (
                      <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* 搜索栏与分类 */}
                        <div className="p-2.5 bg-slate-50/80 border-b border-slate-100 space-y-2">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              autoFocus
                              value={externalChatSearch}
                              onChange={(e) => setExternalChatSearch(e.target.value)}
                              placeholder="输入客户名、群聊名或沟通关键词快速搜索..."
                              className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {externalChatSearch && (
                              <button
                                type="button"
                                onClick={() => setExternalChatSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setExternalChatFilter('all')}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                                  externalChatFilter === 'all'
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                              >
                                全部 ({mockWeComChats.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => setExternalChatFilter('personal')}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all ${
                                  externalChatFilter === 'personal'
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                              >
                                <User className="w-2.5 h-2.5" />
                                个人私聊 ({mockWeComChats.filter(c => c.type === 'personal').length})
                              </button>
                              <button
                                type="button"
                                onClick={() => setExternalChatFilter('group')}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all ${
                                  externalChatFilter === 'group'
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                              >
                                <Users className="w-2.5 h-2.5" />
                                客户群聊 ({mockWeComChats.filter(c => c.type === 'group').length})
                              </button>
                            </div>

                            <span className="text-[10px] text-slate-400">
                              支持 100+ 会话极速检索
                            </span>
                          </div>
                        </div>

                        {/* 高密度会话列表（单行 44px，平滑滚动，浏览上百条毫无压力） */}
                        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                          {mockWeComChats
                            .filter((c) => {
                              if (externalChatFilter === 'personal' && c.type !== 'personal') return false;
                              if (externalChatFilter === 'group' && c.type !== 'group') return false;
                              if (externalChatSearch.trim()) {
                                const q = externalChatSearch.toLowerCase();
                                return (
                                  c.name.toLowerCase().includes(q) ||
                                  c.subtitle.toLowerCase().includes(q) ||
                                  c.lastMessage.toLowerCase().includes(q)
                                );
                              }
                              return true;
                            })
                            .map((chat) => {
                              const isSelected = selectedExternalChatId === chat.id;
                              return (
                                <div
                                  key={chat.id}
                                  onClick={() => handleSelectExternalChat(chat)}
                                  className={`px-3 py-2 text-left cursor-pointer transition-colors flex items-center justify-between gap-3 group ${
                                    isSelected
                                      ? 'bg-blue-50/80 text-blue-900'
                                      : 'hover:bg-blue-50/40 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                        chat.type === 'group'
                                          ? 'bg-indigo-100 text-indigo-700'
                                          : 'bg-blue-100 text-blue-700'
                                      }`}
                                    >
                                      {chat.type === 'group' ? (
                                        <Users className="w-3.5 h-3.5" />
                                      ) : (
                                        <User className="w-3.5 h-3.5" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-xs text-slate-900 truncate">
                                          {chat.name}
                                        </span>
                                        <span
                                          className={`text-[9px] px-1 py-0.2 rounded font-medium ${
                                            chat.type === 'group'
                                              ? 'bg-indigo-50 text-indigo-600'
                                              : 'bg-slate-100 text-slate-500'
                                          }`}
                                        >
                                          {chat.type === 'group' ? `${chat.memberCount}人` : '私聊'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 truncate">
                                          {chat.subtitle.split('·')[0]}
                                        </span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                        {chat.lastMessage}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] text-slate-400 group-hover:hidden">
                                      {chat.lastTime}
                                    </span>
                                    <button
                                      type="button"
                                      className="hidden group-hover:flex px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold shadow-2xs items-center gap-0.5"
                                    >
                                      <span>选择关联</span>
                                      <Check className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                          {/* 搜索无结果 */}
                          {mockWeComChats.filter((c) => {
                            if (externalChatFilter === 'personal' && c.type !== 'personal') return false;
                            if (externalChatFilter === 'group' && c.type !== 'group') return false;
                            if (externalChatSearch.trim()) {
                              const q = externalChatSearch.toLowerCase();
                              return (
                                c.name.toLowerCase().includes(q) ||
                                c.subtitle.toLowerCase().includes(q) ||
                                c.lastMessage.toLowerCase().includes(q)
                              );
                            }
                            return true;
                          }).length === 0 && (
                            <div className="p-6 text-center text-slate-400 text-xs">
                              未找到匹配「{externalChatSearch}」的企微对话，可尝试更换关键词或清除筛选
                            </div>
                          )}
                        </div>

                        {/* 底部收起按钮 */}
                        <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>点击任意对话行即可快速导入上下文并关闭弹窗</span>
                          <button
                            type="button"
                            onClick={() => setIsChatPickerOpen(false)}
                            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                          >
                            收起面板
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* WhatsApp 专属：紧凑对话选择器 */}
              {newChannel === 'WhatsApp' && (
                <div ref={chatPickerRef} className="bg-emerald-50/40 rounded-2xl p-3.5 border border-emerald-100 space-y-2.5">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                          关联对话
                        </span>
                      </div>
                    </div>

                    {/* 如果已选中对话：展示紧凑优雅的单行已关联卡片 */}
                      {selectedExternalChatId && (() => {
                        const selectedChat = mockWhatsAppChats.find(c => c.id === selectedExternalChatId);
                        if (!selectedChat) return null;
                        return (
                          <div className="bg-white rounded-xl p-2.5 border border-emerald-200 shadow-2xs flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  selectedChat.type === 'group'
                                    ? 'bg-teal-100 text-teal-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {selectedChat.type === 'group' ? (
                                  <Users className="w-4 h-4" />
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-800 text-xs truncate">
                                    {selectedChat.name}
                                  </span>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                      selectedChat.type === 'group'
                                        ? 'bg-teal-50 text-teal-700 border border-teal-200/80'
                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                    }`}
                                  >
                                    {selectedChat.type === 'group' ? `${selectedChat.memberCount}人海外群` : 'WhatsApp 私聊'}
                                  </span>
                                  {selectedChat.defaultCompany && (
                                    <span className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                      · {selectedChat.defaultCompany}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {selectedChat.lastMessage}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsChatPickerOpen(true);
                                  setExternalChatSearch('');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                更换对话
                              </button>
                              <button
                                type="button"
                                onClick={handleClearExternalChatSelection}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="清除已选"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 未选中或点击更换时：高阶搜索触发器与下拉检索 Popover */}
                      <div className="relative">
                        {!selectedExternalChatId && (
                          <div className="space-y-1.5">
                            {/* 搜索选择器触发栏 */}
                            <div
                              onClick={() => setIsChatPickerOpen(!isChatPickerOpen)}
                              className={`w-full px-3 py-2 bg-white rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                                isChatPickerOpen
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                                  : 'border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-50/20 shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-slate-600 min-w-0">
                                <Search className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-[11px] text-slate-600 truncate">
                                  搜索或选择 WhatsApp 对话...
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded">
                                  共 {mockWhatsAppChats.length} 个对话
                                </span>
                                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                              </div>
                            </div>

                            {/* 常用/最近沟通快速选择胶囊 */}
                            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar text-[11px]">
                              <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" /> 最近活跃:
                              </span>
                              {mockWhatsAppChats.slice(0, 4).map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => handleSelectExternalChat(c)}
                                  className="px-2 py-0.5 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200/70 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-[10px] whitespace-nowrap transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                  {c.type === 'group' ? (
                                    <Users className="w-2.5 h-2.5 text-teal-600" />
                                  ) : (
                                    <User className="w-2.5 h-2.5 text-emerald-600" />
                                  )}
                                  <span className="truncate max-w-[130px]">{c.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 下拉高密度检索弹层 (Popover) */}
                        {isChatPickerOpen && (
                          <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-emerald-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                            {/* 搜索栏与分类 */}
                            <div className="p-2.5 bg-slate-50/80 border-b border-slate-100 space-y-2">
                              <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  autoFocus
                                  value={externalChatSearch}
                                  onChange={(e) => setExternalChatSearch(e.target.value)}
                                  placeholder="输入海外客商、项目群名或聊天关键词搜索..."
                                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                {externalChatSearch && (
                                  <button
                                    type="button"
                                    onClick={() => setExternalChatSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setExternalChatFilter('all')}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                                      externalChatFilter === 'all'
                                        ? 'bg-emerald-600 text-white font-bold'
                                        : 'text-slate-600 hover:bg-slate-200/60'
                                    }`}
                                  >
                                    全部 ({mockWhatsAppChats.length})
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setExternalChatFilter('personal')}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all ${
                                      externalChatFilter === 'personal'
                                        ? 'bg-emerald-600 text-white font-bold'
                                        : 'text-slate-600 hover:bg-slate-200/60'
                                    }`}
                                  >
                                    <User className="w-2.5 h-2.5" />
                                    海外私聊 ({mockWhatsAppChats.filter(c => c.type === 'personal').length})
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setExternalChatFilter('group')}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all ${
                                      externalChatFilter === 'group'
                                        ? 'bg-emerald-600 text-white font-bold'
                                        : 'text-slate-600 hover:bg-slate-200/60'
                                    }`}
                                  >
                                    <Users className="w-2.5 h-2.5" />
                                    项目群聊 ({mockWhatsAppChats.filter(c => c.type === 'group').length})
                                  </button>
                                </div>

                                <span className="text-[10px] text-slate-400">
                                  实时同步海外会话
                                </span>
                              </div>
                            </div>

                            {/* 高密度会话列表 */}
                            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                              {mockWhatsAppChats
                                .filter((c) => {
                                  if (externalChatFilter === 'personal' && c.type !== 'personal') return false;
                                  if (externalChatFilter === 'group' && c.type !== 'group') return false;
                                  if (externalChatSearch.trim()) {
                                    const q = externalChatSearch.toLowerCase();
                                    return (
                                      c.name.toLowerCase().includes(q) ||
                                      c.subtitle.toLowerCase().includes(q) ||
                                      c.lastMessage.toLowerCase().includes(q)
                                    );
                                  }
                                  return true;
                                })
                                .map((chat) => {
                                  const isSelected = selectedExternalChatId === chat.id;
                                  return (
                                    <div
                                      key={chat.id}
                                      onClick={() => handleSelectExternalChat(chat)}
                                      className={`px-3 py-2 text-left cursor-pointer transition-colors flex items-center justify-between gap-3 group ${
                                        isSelected
                                          ? 'bg-emerald-50/80 text-emerald-900'
                                          : 'hover:bg-emerald-50/40 text-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <div
                                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                            chat.type === 'group'
                                              ? 'bg-teal-100 text-teal-700'
                                              : 'bg-emerald-100 text-emerald-700'
                                          }`}
                                        >
                                          {chat.type === 'group' ? (
                                            <Users className="w-3.5 h-3.5" />
                                          ) : (
                                            <User className="w-3.5 h-3.5" />
                                          )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-xs text-slate-900 truncate">
                                              {chat.name}
                                            </span>
                                            <span
                                              className={`text-[9px] px-1 py-0.2 rounded font-medium ${
                                                chat.type === 'group'
                                                  ? 'bg-teal-50 text-teal-600'
                                                  : 'bg-slate-100 text-slate-500'
                                              }`}
                                            >
                                              {chat.type === 'group' ? `${chat.memberCount}人` : '私聊'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 truncate">
                                              {chat.subtitle.split('·')[0]}
                                            </span>
                                          </div>
                                          <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                            {chat.lastMessage}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[10px] text-slate-400 group-hover:hidden">
                                          {chat.lastTime}
                                        </span>
                                        <button
                                          type="button"
                                          className="hidden group-hover:flex px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold shadow-2xs items-center gap-0.5"
                                        >
                                          <span>选择关联</span>
                                          <Check className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}

                              {/* 搜索无结果 */}
                              {mockWhatsAppChats.filter((c) => {
                                if (externalChatFilter === 'personal' && c.type !== 'personal') return false;
                                if (externalChatFilter === 'group' && c.type !== 'group') return false;
                                if (externalChatSearch.trim()) {
                                  const q = externalChatSearch.toLowerCase();
                                  return (
                                    c.name.toLowerCase().includes(q) ||
                                    c.subtitle.toLowerCase().includes(q) ||
                                    c.lastMessage.toLowerCase().includes(q)
                                  );
                                }
                                return true;
                              }).length === 0 && (
                                <div className="p-6 text-center text-slate-400 text-xs">
                                  未找到匹配「{externalChatSearch}」的 WhatsApp 对话，可尝试更换关键词或清除筛选
                                </div>
                              )}
                            </div>

                            {/* 底部收起按钮 */}
                            <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                              <span>点击任意对话行即可快速导入上下文并关闭弹窗</span>
                              <button
                                type="button"
                                onClick={() => setIsChatPickerOpen(false)}
                                className="text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer"
                              >
                                收起面板
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* 客户姓名 & 负责销售人员 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    客户姓名 / 称呼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="如：张明远 先生 / Alex"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">负责销售人员</label>
                  <select
                    value={newAssignedStaff}
                    onChange={(e) => setNewAssignedStaff(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20] font-medium"
                  >
                    <option value="Franklin Jr">Franklin Jr (当前账号)</option>
                    <option value="Sophia">Sophia (外贸主管)</option>
                    <option value="Alex">Alex (销售业务员)</option>
                  </select>
                </div>
              </div>

              {/* 客户需求备忘 (支持手动输入 / 上传聊天记录 / 上传面谈录音 + AI解析) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-slate-800 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0F4A47]" />
                    客户需求备忘
                  </label>

                  {/* 录入模式切换 Tab（企微和 WhatsApp 仅保留手动输入，线下对接才显示另外两项） */}
                  {newChannel === '线下对接' ? (
                    <div className="bg-slate-100 p-0.5 rounded-xl flex items-center gap-1 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setRecordInputMode('manual')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          recordInputMode === 'manual'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>手动输入</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecordInputMode('chat_upload')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          recordInputMode === 'chat_upload'
                            ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-indigo-600'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>上传聊天记录</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecordInputMode('audio_upload')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          recordInputMode === 'audio_upload'
                            ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-emerald-600'
                        }`}
                      >
                        <Mic className="w-3 h-3" />
                        <span>上传面谈录音</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-100 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-700 flex items-center gap-1 shadow-2xs">
                      <span>手动输入</span>
                    </div>
                  )}
                </div>

                {/* 上传聊天记录视图（仅线下对接模式可选择并展示） */}
                {newChannel === '线下对接' && recordInputMode === 'chat_upload' && (
                  <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold text-slate-800">上传客户聊天沟通内容</div>
                      </div>
                    </div>

                    {/* Hidden input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".txt,.doc,.docx,.pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'chat');
                      }}
                    />

                    {/* Upload Drop Zone */}
                    {!uploadedFileName ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white/70 hover:bg-white rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                      >
                        <UploadCloud className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-medium text-slate-600">点击或拖拽聊天记录文件至此</span>
                      </div>
                    ) : (
                      <div className="bg-white border border-indigo-200 rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2.5 truncate">
                          <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-800 truncate">{uploadedFileName}</div>
                            <div className="text-[10px] text-slate-400">{uploadedFileSize} · 聊天文本已就绪</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileName(null);
                            setUploadedFileSize(null);
                            setRawRecordText('');
                            setAiAnalysisCompleted(false);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Raw Text Box */}
                    <div>
                      <textarea
                        rows={3}
                        value={rawRecordText}
                        onChange={(e) => setRawRecordText(e.target.value)}
                        placeholder="或直接在此处粘贴与客户的聊天文字对话记录..."
                        className="w-full p-2.5 bg-white border border-indigo-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* AI Parse Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        {rawRecordText ? `已读取 ${(rawRecordText.length)} 字记录` : '请上传文件或粘贴聊天记录'}
                      </span>
                      <button
                        type="button"
                        disabled={(!rawRecordText && !uploadedFileName) || isAiAnalyzing}
                        onClick={handleTriggerAiAnalysis}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          isAiAnalyzing
                            ? 'bg-indigo-400 text-white cursor-wait'
                            : rawRecordText || uploadedFileName
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isAiAnalyzing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>AI 深度解析中...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>✨ AI 解析聊天记录</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 上传面谈录音视图（仅线下对接模式可选择并展示） */}
                {newChannel === '线下对接' && recordInputMode === 'audio_upload' && (
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold text-slate-800">上传面谈录音音频内容</div>
                      </div>
                    </div>

                    {/* Hidden input */}
                    <input
                      type="file"
                      ref={audioInputRef}
                      className="hidden"
                      accept=".mp3,.wav,.m4a,.aac,.ogg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'audio');
                      }}
                    />

                    {/* Audio Drop Zone */}
                    {!uploadedFileName ? (
                      <div
                        onClick={() => audioInputRef.current?.click()}
                        className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-white/70 hover:bg-white rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                      >
                        <Mic className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-medium text-slate-600">点击或拖拽录音文件至此</span>
                      </div>
                    ) : (
                      <div className="bg-white border border-emerald-200 rounded-xl p-3 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 truncate">
                            <FileAudio className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-bold text-slate-800 truncate">{uploadedFileName}</div>
                              <div className="text-[10px] text-slate-400">{uploadedFileSize} · 录音音频文件</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFileName(null);
                              setUploadedFileSize(null);
                              setRawRecordText('');
                              setAiAnalysisCompleted(false);
                            }}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Simulated Audio Wave & Player */}
                        <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className="w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center cursor-pointer shadow-xs shrink-0"
                          >
                            {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                          </button>
                          
                          {/* Visual Audio Wave */}
                          <div className="flex-1 flex items-center gap-0.5 h-5">
                            {[30, 60, 45, 80, 95, 40, 70, 85, 30, 65, 90, 50, 75, 40, 85, 60, 35, 70, 90, 45, 60, 30].map((h, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full transition-all duration-300 ${
                                  isPlayingAudio ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                                }`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>

                          <span className="text-[10px] font-mono text-slate-500 font-bold shrink-0">03:45</span>
                        </div>
                      </div>
                    )}

                    {/* Audio Transcript / Raw Text */}
                    {rawRecordText && (
                      <div>
                        <textarea
                          rows={3}
                          value={rawRecordText}
                          onChange={(e) => setRawRecordText(e.target.value)}
                          placeholder="录音自动识别文字（可手动校对）..."
                          className="w-full p-2.5 bg-white border border-emerald-100 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    )}

                    {/* AI Parse Audio Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        {uploadedFileName ? '语音就绪，支持 ASR 转文字与需求提取' : '请选择或上传录音文件'}
                      </span>
                      <button
                        type="button"
                        disabled={(!rawRecordText && !uploadedFileName) || isAiAnalyzing}
                        onClick={handleTriggerAiAnalysis}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          isAiAnalyzing
                            ? 'bg-emerald-400 text-white cursor-wait'
                            : rawRecordText || uploadedFileName
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isAiAnalyzing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>AI 语音转写与意向提取中...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>✨ AI 解析面谈录音</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* AI 解析完成提示面板 */}
                {aiAnalysisCompleted && aiExtractedSummary && (
                  <div className="p-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-200/80 rounded-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <div className="flex items-center gap-1.5 text-amber-800">
                        <Sparkles className="w-4 h-4 text-[#EA3A20]" />
                        <span>已提取核心意向与需求</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        意向度: {aiExtractedSummary.urgencyLevel}
                      </span>
                    </div>
                  </div>
                )}

                {/* 需求备忘内容 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-500 font-medium">
                      需求摘要与备忘：
                    </span>
                    {initialNote && (
                      <button
                        type="button"
                        onClick={() => setInitialNote('')}
                        className="text-[10px] text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        清空文本
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={initialNote}
                    onChange={(e) => setInitialNote(e.target.value)}
                    placeholder="输入或补充客户沟通要点与定制需求..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20] leading-relaxed"
                  />
                </div>

              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white font-bold cursor-pointer transition-colors shadow-xs active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>创建并进入AI会话</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CBM Calculator Modal */}
      {showCbmCalc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">CBM 海运材积自动测算</h3>
              </div>
              <button
                onClick={() => setShowCbmCalc(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 font-bold">长 (cm)</label>
                  <input
                    type="number"
                    value={cbmLength}
                    onChange={(e) => setCbmLength(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-bold">宽 (cm)</label>
                  <input
                    type="number"
                    value={cbmWidth}
                    onChange={(e) => setCbmWidth(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-bold">高 (cm)</label>
                  <input
                    type="number"
                    value={cbmHeight}
                    onChange={(e) => setCbmHeight(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 font-bold">打包件数 (Qty)</label>
                <input
                  type="number"
                  value={cbmQty}
                  onChange={(e) => setCbmQty(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>单件体积：</span>
                  <span className="font-mono font-bold">{singleCbm.toFixed(3)} m³ (CBM)</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold">
                  <span>总装柜体积：</span>
                  <span className="font-mono text-[#EA3A20] text-sm">{totalCbm.toFixed(2)} m³</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>40HQ (68 m³) 装载率：</span>
                  <span className="font-bold">{fillRate}%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setInputMessage((prev) =>
                    prev
                      ? `${prev}\n[海运核算] 单件: ${singleCbm.toFixed(3)} CBM, ${cbmQty}件总计: ${totalCbm.toFixed(2)} CBM (40HQ装柜率约 ${fillRate}%)`
                      : `[海运核算] 单件: ${singleCbm.toFixed(3)} CBM, ${cbmQty}件总计: ${totalCbm.toFixed(2)} CBM (40HQ装柜率约 ${fillRate}%)`
                  );
                  setShowCbmCalc(false);
                }}
                className="w-full py-2.5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                插入核算结果至对话框
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation / Proforma Invoice (PI) Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#EA3A20] flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">生成外贸高定报价单 (Proforma Invoice / PI)</h3>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                      PI-2026-F089
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    关联设计图纸/方案、设定定制品类规格与贸易结算条款，生成标准化正式 PI 单据
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Config form */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. Client & Project info */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-3">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#EA3A20]" />
                    客户与定制项目信息
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 font-medium">客户抬头 (Bill To)</label>
                      <input
                        type="text"
                        value={quoteCustomerName}
                        onChange={(e) => setQuoteCustomerName(e.target.value)}
                        className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#EA3A20]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 font-medium">工程项目名称</label>
                      <input
                        type="text"
                        value={quoteProjectName}
                        onChange={(e) => setQuoteProjectName(e.target.value)}
                        className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#EA3A20]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 font-medium">结算币种 (Currency)</label>
                      <select
                        value={quoteCurrency}
                        onChange={(e) => setQuoteCurrency(e.target.value as any)}
                        className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#EA3A20]"
                      >
                        <option value="USD">USD ($) - 美元结算</option>
                        <option value="EUR">EUR (€) - 欧元结算</option>
                        <option value="CNY">CNY (¥) - 人民币含税</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 font-medium">贸易术语 (Incoterms)</label>
                      <select
                        value={quoteTradeTerm}
                        onChange={(e) => setQuoteTradeTerm(e.target.value)}
                        className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#EA3A20]"
                      >
                        <option value="CIF Miami">CIF Miami (含海运及保险到迈阿密港)</option>
                        <option value="FOB Shenzhen">FOB Shenzhen (深圳盐田港离岸价)</option>
                        <option value="EXW Factory">EXW Factory (佛山工厂出厂交货)</option>
                        <option value="DDP Los Angeles">DDP Los Angeles (双清含税到门)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Upload / Select Design Files */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                      关联设计图纸 / CAD / 效果图
                    </div>
                    <label className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer flex items-center gap-1">
                      <Plus className="w-3 h-3" /> 上传图纸文件
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const newFiles = Array.from(e.target.files).map(f => ({
                              name: f.name,
                              size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                              type: f.name.split('.').pop() || 'file'
                            }));
                            setQuoteDesignFiles(prev => [...prev, ...newFiles]);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    {quoteDesignFiles.map((df, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200/80 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold uppercase">
                            {df.type}
                          </span>
                          <span className="text-slate-700 font-medium truncate text-xs">{df.name}</span>
                          <span className="text-slate-400 text-[10px] shrink-0 font-mono">({df.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuoteDesignFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Product Specification Lines */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-500" />
                      定制产品配置清单
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuoteItems(prev => [
                          ...prev,
                          {
                            id: `qi-${Date.now()}`,
                            name: '客餐厅高定玄关柜系统',
                            spec: '欧标E0级多层实木 + 进口哑光烤漆 + 百隆阻尼铰链',
                            qty: 1,
                            unit: '套',
                            price: 1200
                          }
                        ]);
                      }}
                      className="text-[11px] text-[#EA3A20] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> 添加定制品类
                    </button>
                  </div>

                  <div className="space-y-2">
                    {quoteItems.map((it, idx) => (
                      <div key={it.id} className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={it.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQuoteItems(prev => prev.map(item => item.id === it.id ? { ...item, name: val } : item));
                            }}
                            className="flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-xs"
                            placeholder="品类名称 (如：主厨极简橱柜定制)"
                          />
                          {quoteItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setQuoteItems(prev => prev.filter(item => item.id !== it.id))}
                              className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            value={it.spec}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQuoteItems(prev => prev.map(item => item.id === it.id ? { ...item, spec: val } : item));
                            }}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px]"
                            placeholder="材质说明 (如：爱格W1000/烤漆/百隆五金)"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 shrink-0">数量:</span>
                            <input
                              type="number"
                              value={it.qty}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setQuoteItems(prev => prev.map(item => item.id === it.id ? { ...item, qty: val } : item));
                              }}
                              className="w-14 p-1 bg-slate-50 border border-slate-200 rounded text-center font-bold"
                            />
                            <input
                              type="text"
                              value={it.unit}
                              onChange={(e) => {
                                const val = e.target.value;
                                setQuoteItems(prev => prev.map(item => item.id === it.id ? { ...item, unit: val } : item));
                              }}
                              className="w-12 p-1 bg-slate-50 border border-slate-200 rounded text-center text-[11px]"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 shrink-0">单价:</span>
                            <input
                              type="number"
                              value={it.price}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setQuoteItems(prev => prev.map(item => item.id === it.id ? { ...item, price: val } : item));
                              }}
                              className="w-full p-1 bg-slate-50 border border-slate-200 rounded font-bold text-right"
                            />
                          </div>
                          <div className="flex items-center justify-end font-mono font-bold text-slate-900 text-xs">
                            <span>小计: {quoteCurrency === 'USD' ? '$' : quoteCurrency === 'EUR' ? '€' : '¥'}{(it.qty * it.price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Payment Terms & Delivery */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-2.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    商务结算与交期约定
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-500 font-medium">首期定金比例 (%)</label>
                      <input
                        type="number"
                        value={quoteDepositPercent}
                        onChange={(e) => setQuoteDepositPercent(Number(e.target.value))}
                        className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 font-medium">工厂生产交期</label>
                      <input
                        type="text"
                        value={quoteLeadTime}
                        onChange={(e) => setQuoteLeadTime(e.target.value)}
                        className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 cols: Live PI Document Preview */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 font-sans text-xs">
                  {/* PI Sheet Header */}
                  <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
                    <div>
                      <div className="text-sm font-extrabold tracking-wider text-slate-900">PROFORMA INVOICE</div>
                      <div className="text-[10px] text-slate-400 font-mono">形式发票与外贸定制报价单</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-[#EA3A20]">PI-2026-F089</div>
                      <div className="text-[10px] text-slate-400">{new Date().toISOString().split('T')[0]}</div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-1 text-[11px] border-b border-slate-100 pb-2">
                    <div className="text-slate-400 font-medium">CUSTOMER / 采购客户:</div>
                    <div className="font-bold text-slate-800">{quoteCustomerName}</div>
                    <div className="text-slate-600">{quoteProjectName}</div>
                    <div className="text-indigo-600 font-medium">交货条件: {quoteTradeTerm}</div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>定制品类明细</span>
                      <span>小计金额 ({quoteCurrency})</span>
                    </div>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                      {quoteItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between text-[11px] gap-2">
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 truncate">{item.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{item.qty} {item.unit} × {quoteCurrency === 'USD' ? '$' : quoteCurrency === 'EUR' ? '€' : '¥'}{item.price}</div>
                          </div>
                          <div className="font-mono font-bold text-slate-900 shrink-0">
                            {quoteCurrency === 'USD' ? '$' : quoteCurrency === 'EUR' ? '€' : '¥'}{(item.qty * item.price).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals & Payments */}
                  <div className="border-t border-slate-200 pt-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>报价总计 (Grand Total):</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {quoteCurrency === 'USD' ? '$' : quoteCurrency === 'EUR' ? '€' : '¥'}
                        {quoteItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>首期预付定金 ({quoteDepositPercent}% T/T):</span>
                      <span className="font-mono font-semibold text-emerald-700">
                        {quoteCurrency === 'USD' ? '$' : quoteCurrency === 'EUR' ? '€' : '¥'}
                        {Math.round(quoteItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0) * (quoteDepositPercent / 100)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>尾款余额 (发货前结清):</span>
                      <span className="font-mono font-semibold text-slate-700">
                        {quoteCurrency === 'USD' ? '$' : quoteCurrency === 'EUR' ? '€' : '¥'}
                        {Math.round(quoteItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0) * (1 - quoteDepositPercent / 100)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Summary footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>已关联图纸: {quoteDesignFiles.length} 份</span>
                    <span className="text-emerald-600 font-medium">品质质保 5 年</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-2 pt-1">
                  {quoteExportSuccess && (
                    <div className="p-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" /> {quoteExportSuccess}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const total = quoteItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0);
                        const currSym = quoteCurrency === 'USD' ? '$' : quoteCurrency === 'EUR' ? '€' : '¥';
                        const summaryText = `【形式发票与定制报价单 / Proforma Invoice】\nPI 单号: PI-2026-F089 | 项目: ${quoteProjectName}\n客户: ${quoteCustomerName} | 条款: ${quoteTradeTerm}\n\n品类明细:\n${quoteItems.map((it, i) => `${i+1}. ${it.name} (${it.spec}) - ${it.qty}${it.unit} × ${currSym}${it.price} = ${currSym}${(it.qty*it.price).toLocaleString()}`).join('\n')}\n\n总金额: ${currSym}${total.toLocaleString()} (${quoteCurrency})\n结算方式: ${quoteDepositPercent}% 定金 (${currSym}${Math.round(total * (quoteDepositPercent/100)).toLocaleString()})，生产交期 ${quoteLeadTime}。\n已绑定设计图纸: ${quoteDesignFiles.map(f => f.name).join(', ')}`;
                        setInputMessage(prev => prev ? `${prev}\n\n${summaryText}` : summaryText);
                        setShowQuoteModal(false);
                      }}
                      className="flex-1 py-2.5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <FileCheck className="w-4 h-4" /> 填入对话框并发送
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuoteExportSuccess('已成功导出 PI 形式发票 (PDF & Excel 格式)');
                        setTimeout(() => setQuoteExportSuccess(null), 3000);
                      }}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="导出正式 PI 单据"
                    >
                      <Download className="w-4 h-4" /> 导出 PI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Citation Detail Modal for clicking a citation badge */}
      {activeCitationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{activeCitationModal.title}</h3>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                    <span>版本: {activeCitationModal.version}</span>
                    {activeCitationModal.category && <span>· 分类: {activeCitationModal.category}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveCitationModal(null)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">权威引述摘录 (Authoritative Excerpt)</div>
              <p>{activeCitationModal.excerpt || '收录于企业工艺与标准知识库，经实验室与权威质检认证。'}</p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setActiveCitationModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  setActiveCitationModal(null);
                  setProfileTab('knowledge');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                在右侧知识库中查阅 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Lightbox Modal */}
      <ImagePreviewModal
        isOpen={!!previewModalImage}
        imageUrl={previewModalImage?.url || ''}
        imageName={previewModalImage?.name}
        onClose={() => setPreviewModalImage(null)}
      />

    </div>
  );
};
