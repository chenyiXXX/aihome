import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Calculator,
  Languages,
  Sparkles,
  Zap,
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
  SlidersHorizontal
} from 'lucide-react';
import { SessionItem, ChatMessage, ScriptItem } from '../../types';
import { useVoiceToText } from '../../hooks/useVoiceToText';
import { VoiceInputBanner } from '../common/VoiceInputBanner';

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
        { id: 'kb-01', title: '《柜体板材防潮防水性能对比白皮书》', version: 'v2.1' },
        { id: 'kb-02', title: '《工厂实验室测试数据标准手册》', version: 'v1.4' }
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
  const [expandedCitations, setExpandedCitations] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputMode, setInputMode] = useState<'keyboard' | 'voice'>('keyboard');

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

  const toggleCitations = (msgId: string) => {
    setExpandedCitations(prev => prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId]);
  };
  const [profileTab, setProfileTab] = useState<'history' | 'tags' | 'assets' | 'knowledge'>('history');
  const [activeTab, setActiveTab] = useState<'企微' | 'WhatsApp' | '线下对接'>('企微');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'api_sync' | 'manual'>('all');
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
  const [selectedTags, setSelectedTags] = useState<string[]>(['销售自建', '待跟进']);
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const quickTagOptions = [
    '销售自建',
    '全案高定',
    '展会获客',
    '私宅别墅',
    '酒店工程',
    '爱格板定制',
    '碳晶护墙板',
    '隐形门系统',
    '外贸大单',
    '待打样',
    '打样确认中',
    '预算充足',
    '工期紧急'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // CBM Calculator Modal
  const [showCbmCalc, setShowCbmCalc] = useState(false);
  const [cbmLength, setCbmLength] = useState(220);
  const [cbmWidth, setCbmWidth] = useState(90);
  const [cbmHeight, setCbmHeight] = useState(85);
  const [cbmQty, setCbmQty] = useState(30);

  const singleCbm = (cbmLength * cbmWidth * cbmHeight) / 1000000;
  const totalCbm = singleCbm * cbmQty;
  const fillRate = Math.min(100, Math.round((totalCbm / 68.0) * 100));

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !activeSession) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId: activeSession.id,
      sender: 'sales',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

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
            return {
              ...m,
              isGenerating: false,
              content: '已为您生成相关的话术与报价。建议向客户强调我们在工期和品质上的双重保障。',
              messageType: 'text_file',
              attachments: [
                {
                  id: `att-ai-${Date.now()}`,
                  type: 'file',
                  url: '#',
                  name: 'Quotation_Villa_Updated.pdf',
                  size: '1.5 MB'
                }
              ],
              citations: [
                { id: 'kb-03', title: '《外贸报价单生成规范》', version: 'v1.1' }
              ]
            };
          }
          return m;
        })
      );
    }, 2500);
  };

  const handleInsertScript = (script: ScriptItem) => {
    setInputMessage((prev) => (prev ? `${prev}\n\n${script.content}` : script.content));
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    const avatarText = newCustomerName.trim().slice(0, 2).toUpperCase();
    const newSess: SessionItem = {
      id: `SESS-${Math.floor(200 + Math.random() * 800)}`,
      customerName: newCustomerName.trim(),
      avatar: avatarText,
      channel: newChannel,
      sourceType: 'manual',
      companyName: newCompanyName.trim() || undefined,
      contactInfo: newContactInfo.trim() || undefined,
      unreadCount: 0,
      lastMessage: initialNote.trim() || '销售手动发起建联，等待沟通...',
      lastTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tags: selectedTags.length > 0 ? selectedTags : ['销售自建', newChannel],
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
    setSelectedTags(['销售自建', '待跟进']);
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

  // Preset Sample Loader for quick demo testing
  const loadPresetDemo = (preset: 'chat_villa' | 'audio_hotel' | 'whatsapp_export') => {
    setIsAiAnalyzing(false);
    setAiAnalysisCompleted(false);
    
    if (preset === 'chat_villa') {
      setRecordInputMode('chat_upload');
      setUploadedFileName('微信聊天记录_深圳湾一号业主张先生_202608.txt');
      setUploadedFileSize('128 KB');
      setRawRecordText(`【微信聊天记录导录】
张先生(14:22): 你好，朋友推荐你们家做高定很专业。我深圳湾一号280平大平层准备开工，全屋需要做隐形门系统和爱格板衣帽间。
销售(14:25): 张总您好！非常荣幸，深圳湾一号我们刚做完两套同户型全案，对承重墙及中央空调隐藏式回风口收口非常熟练。
张先生(14:30): 太好了，我预算在35-45万左右，希望能尽快看到碳晶护墙板实物小样和爱格板色卡，下周三能否安排上门量尺？
销售(14:32): 没问题张总，已为您锁定资深深化设计师，周三上午10点准时携带色板箱前往现场量尺！`);
    } else if (preset === 'audio_hotel') {
      setRecordInputMode('audio_upload');
      setUploadedFileName('展会面谈录音_迪拜精品酒店定制采购总监_2026.mp3');
      setUploadedFileSize('8.6 MB');
      setRawRecordText(`【面谈现场录音转写】
客户代表(Tariq): We are sourcing customized joinery and fire-rated wall panels for a 45-villa resort in Palm Jumeirah. All woodwork must meet BS5852 standard with PVD titanium brass trims. Total volume estimated around 12x 40HQ containers.
销售业务员(Sophia): Excellent, Tariq. We have full ISO and British Standard test reports for all our fire-resistant core panels, and our in-house PVD coating line ensures exact color consistency. We can dispatch master sample boxes to your Dubai office within 4 business days.`);
    } else {
      setRecordInputMode('chat_upload');
      setUploadedFileName('WhatsApp_Chat_Apex_Architecture_US.txt');
      setUploadedFileSize('64 KB');
      setRawRecordText(`David Miller (Apex Arch US): Can you supply customized oak veneer fluted panels for our Miami penthouse project? Total ceiling height 3.2m, need seamless joint detailing. Budget is around $80,000 USD for the wood package.`);
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

      // Auto Merge & Select extracted tags into Tag List
      const newTagSet = Array.from(new Set([...selectedTags, ...extracted.tags]));
      setSelectedTags(newTagSet);

      // Set Structured Demand into Note Textarea
      setInitialNote(extracted.structuredDemand);
    }, 1200);
  };

  
  const filteredSessions = sessionList.filter((s) => {
    if (s.channel !== activeTab && !(activeTab === '企微' && s.channel === '企业微信')) return false;
    if (sourceFilter === 'api_sync' && s.sourceType !== 'api_sync') return false;
    if (sourceFilter === 'manual' && s.sourceType !== 'manual') return false;
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
                <span>会话列表</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                  {filteredSessions.length}
                </span>
              </h2>
            </div>
            <button
              onClick={() => {
                setNewChannel(activeTab);
                setShowCreateModal(true);
              }}
              className="h-8 px-3 rounded-full bg-[#0F4A47] text-white hover:bg-[#0b3836] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
              title="新建销售跟进会话"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ 新建会话</span>
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

            {/* Source & Status Dropdowns */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as 'all' | 'api_sync' | 'manual')}
                  className="appearance-none w-full h-7 pl-2.5 pr-6 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="all">全部来源</option>
                  <option value="api_sync">⚡ 接口对接</option>
                  <option value="manual">👤 销售自建</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

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
                  <option value="不是客户">不是客户</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
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
                    onClick={() => setActiveSession(sess)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#0F4A47]/5 border-[#0F4A47] ring-1 ring-[#0F4A47]/30 shadow-xs border-l-[5px] border-l-[#0F4A47]'
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
                        {sess.sourceType === 'api_sync' ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100">
                            <Zap className="w-2.5 h-2.5 text-indigo-500 fill-indigo-400" />
                            接口
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200/60">
                            <UserPlus className="w-2.5 h-2.5 text-amber-600" />
                            自建
                          </span>
                        )}
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

                      {/* Quick Status Pill */}
                      <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={sess.status}
                          onChange={(e) => handleStatusChange(sess.id, e.target.value)}
                          className={`appearance-none h-5 pl-2 pr-5 rounded-full border text-[10px] font-bold focus:outline-none cursor-pointer transition-colors ${
                            sess.status === '跟进中' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            sess.status === '已报价' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            sess.status === '已成交' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            sess.status === '已流失' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="跟进中">跟进中</option>
                          <option value="已报价">已报价</option>
                          <option value="已成交">已成交</option>
                          <option value="已流失">已流失</option>
                          <option value="不是客户">不是客户</option>
                        </select>
                        <ChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

          {/* Left Footer: Count & Pagination */}
          <div className="p-2.5 px-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
            <span>共 {filteredSessions.length} 条会话</span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white cursor-pointer"
              >
                上一页
              </button>
              <span className="px-1.5 font-bold text-slate-700">1</span>
              <button
                disabled={true}
                className="px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-400 disabled:opacity-40 cursor-not-allowed"
              >
                下一页
              </button>
            </div>
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
                    title={isLeftCollapsed ? '展开左侧会话列表' : '收起左侧会话列表'}
                  >
                    {isLeftCollapsed ? <PanelLeftOpen className="w-4 h-4 text-[#0F4A47]" /> : <PanelLeftClose className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-sm font-bold text-slate-900 truncate">{activeSession.customerName}</h2>
                      {/* Source Indicator Tag */}
                      {activeSession.sourceType === 'api_sync' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100 shrink-0">
                          <Zap className="w-3 h-3 text-indigo-500 fill-indigo-400" />
                          接口对接
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-200/60 shrink-0">
                          <UserPlus className="w-3 h-3 text-amber-600" />
                          销售自建
                        </span>
                      )}
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
                        activeSession.status === '已流失' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <option value="跟进中">跟进中</option>
                      <option value="已报价">已报价</option>
                      <option value="已成交">已成交</option>
                      <option value="已流失">已流失</option>
                      <option value="不是客户">不是客户</option>
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
                                  <div className="mt-3 pt-2 border-t border-slate-100">
                                    <button 
                                      onClick={() => toggleCitations(m.id)}
                                      className="text-[10px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-bold cursor-pointer transition-colors"
                                    >
                                      <BookOpen className="w-3 h-3" /> 查看知识库引用 ({m.citations.length})
                                      <ChevronDown className={`w-3 h-3 transition-transform ${expandedCitations.includes(m.id) ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {expandedCitations.includes(m.id) && (
                                      <div className="flex flex-col gap-1.5 mt-2">
                                        {m.citations.map(cit => (
                                          <div key={cit.id} className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-colors group">
                                            <div className="flex items-center gap-2">
                                              <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                              <span className="text-[11px] text-slate-700 font-bold group-hover:text-indigo-700">{cit.title}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-indigo-200">{cit.version}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
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
                  <div className="p-4 bg-white border-t border-slate-100 space-y-2 shrink-0">
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
                          onClick={() => setShowCbmCalc(true)}
                          className="flex items-center gap-1 hover:text-[#EA3A20] cursor-pointer font-bold transition-colors"
                        >
                          <Calculator className="w-3.5 h-3.5 text-amber-500" /> 生成报价单
                        </button>
                      </div>

                      {/* Input Method Switcher */}
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

                    <div className="relative flex items-end gap-2">
                      <textarea
                        rows={2}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={
                          isListening
                            ? '正在倾听语音转文字中... 也可以直接在键盘打字输入...'
                            : '向 AI 销售助手提问，支持键盘打字或点击麦克风语音转文字...'
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
                        title={isListening ? '点击完成语音录入' : '点击开始语音转文字'}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim()}
                        className="h-11 px-5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" /> 发送
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
                      <span>支持键盘输入（Enter 发送，Shift+Enter 换行）或语音实时转文字</span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>AI 销售实战辅助 & 合规保密保障</span>
                      </span>
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
                        <div className="space-y-4">
                          <div className="text-xs text-slate-500 text-center mb-4">— 上次跟进: 昨天 19:48 —</div>
                          {chatMessages.map((msg, i) => (
                            <div key={i} className="flex gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-600">
                                {msg.sender === 'sales' ? 'ME' : 'CU'}
                              </div>
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold text-slate-500">{msg.sender === 'sales' ? '我 (Franklin)' : activeSession.customerName} <span className="font-normal text-slate-400 ml-1">{msg.timestamp}</span></div>
                                <div className={`p-2.5 rounded-xl text-xs text-slate-700 leading-relaxed ${msg.sender === 'sales' ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-white border border-slate-200'}`}>
                                  {msg.content}
                                </div>
                              </div>
                            </div>
                          ))}
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
                请在左侧会话列表中点击选中客户进行即时沟通，或点击上方「+ 新建会话」录入新客户。
              </p>
              <button
                onClick={() => {
                  setNewChannel(activeTab);
                  setShowCreateModal(true);
                }}
                className="px-5 py-2 rounded-full bg-[#0F4A47] hover:bg-[#0b3836] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>立即新建跟进会话</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Modal: 新建会话 (销售手动创建 & AI 智能解析沟通记录/录音) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shadow-2xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    新建销售跟进会话
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0F4A47]/10 text-[#0F4A47] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#EA3A20]" /> 支持 AI 沟通解析
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">销售人员手动建联客户，支持上传聊天文本或面谈录音由 AI 提取需求与标签</p>
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
                    onClick={() => setNewChannel('企微')}
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
                    onClick={() => setNewChannel('WhatsApp')}
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
                    onClick={() => setNewChannel('线下对接')}
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

              {/* 1. 客户标签（已按要求更名，并支持AI自动识别添加） */}
              <div className="bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-800 font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#EA3A20]" />
                    客户标签
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">已选 {selectedTags.length} 个标签（支持 AI 自动推荐）</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickTagOptions.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#EA3A20] text-white shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. 初始需求 / 建联记录 (支持手动输入 / 上传聊天记录 / 上传面谈录音 + AI解析) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-slate-800 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0F4A47]" />
                    初始需求 / 建联记录
                  </label>

                  {/* 录入模式切换 Tab */}
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
                      <span>手动录入</span>
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
                </div>

                {/* 上传聊天记录视图 */}
                {recordInputMode === 'chat_upload' && (
                  <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">上传客户聊天沟通内容</div>
                          <div className="text-[10px] text-slate-400">支持微信/企微/WhatsApp 聊天截图、.txt 导录、文本或 PDF</div>
                        </div>
                      </div>

                      {/* 快速演示样本 */}
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-400">测试示例:</span>
                        <button
                          type="button"
                          onClick={() => loadPresetDemo('chat_villa')}
                          className="px-2 py-0.5 bg-white hover:bg-indigo-100 text-indigo-600 rounded-md font-bold border border-indigo-200 cursor-pointer"
                        >
                          豪宅私宅沟通
                        </button>
                        <button
                          type="button"
                          onClick={() => loadPresetDemo('whatsapp_export')}
                          className="px-2 py-0.5 bg-white hover:bg-indigo-100 text-indigo-600 rounded-md font-bold border border-indigo-200 cursor-pointer"
                        >
                          WhatsApp 外贸
                        </button>
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
                        className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white/70 hover:bg-white rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
                      >
                        <UploadCloud className="w-6 h-6 text-indigo-500" />
                        <span className="text-xs font-bold text-slate-700">点击或拖拽聊天记录文件至此</span>
                        <span className="text-[10px] text-slate-400">支持 .txt / .doc / .pdf / 微信截图</span>
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

                {/* 上传面谈录音视图 */}
                {recordInputMode === 'audio_upload' && (
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">上传面谈录音音频内容</div>
                          <div className="text-[10px] text-slate-400">支持展会面谈、展厅验厂、电话会议音频（MP3 / M4A / WAV）</div>
                        </div>
                      </div>

                      {/* 快速演示样本 */}
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-400">测试示例:</span>
                        <button
                          type="button"
                          onClick={() => loadPresetDemo('audio_hotel')}
                          className="px-2 py-0.5 bg-white hover:bg-emerald-100 text-emerald-700 rounded-md font-bold border border-emerald-200 cursor-pointer"
                        >
                          展会面谈录音(迪拜)
                        </button>
                      </div>
                    </div>

                    {/* Hidden input */}
                    <input
                      type="file"
                      ref={audioInputRef}
                      className="hidden"
                      accept=".mp3,.wav,.m4a,.aac,.ogg"
                      onChange={(e) => {
                        const file不易 = e.target.files?.[0];
                        if (file不易) handleFileUpload(file不易, 'audio');
                      }}
                    />

                    {/* Audio Drop Zone */}
                    {!uploadedFileName ? (
                      <div
                        onClick={() => audioInputRef.current?.click()}
                        className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-white/70 hover:bg-white rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
                      >
                        <Mic className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-700">点击或拖拽录音文件至此</span>
                        <span className="text-[10px] text-slate-400">支持 MP3, M4A, WAV, AAC (最大 50MB)</span>
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
                        <span>AI 智能解析成功！已提取客户标签并整理结构化需求</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        意向度: {aiExtractedSummary.urgencyLevel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-600 pt-1">
                      <span className="font-bold text-slate-700">AI 推荐并已自动勾选标签：</span>
                      {aiExtractedSummary.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-white text-[#EA3A20] rounded-md font-bold border border-rose-200 text-[10px]">
                          +{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 初始需求/建联记录 最终整理结果输入区 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-500 font-medium">
                      结构化客户需求摘要（保存后将作为初始沟通备忘录）：
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
                    placeholder="如：客户在展会了解碳晶板与实木定制，约定今日提供色板与CAD报价清单...（可直接输入，也可使用上方 AI 自动解析生成）"
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
                  <span>创建并进入会话</span>
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

    </div>
  );
};
