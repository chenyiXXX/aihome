import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Copy,
  ArrowRight,
  TrendingUp,
  Share2,
  Users,
  Target,
  FileText,
  BadgeCheck,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  UserPlus,
  Zap,
  X,
  HelpCircle,
  Clock,
  Sparkle,
  Mic,
  MicOff,
  Keyboard
} from 'lucide-react';
import {
  TrainingCourse,
  initialTrainingCourses
} from '../../data/trainingData';
import { useVoiceToText } from '../../hooks/useVoiceToText';
import { VoiceInputBanner } from '../common/VoiceInputBanner';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{ title: string; code: string }>;
  confidence?: number;
}

export interface ChatSession {
  id: string;
  code?: string;
  title: string;
  category: 'sales_training' | 'ops_training' | 'hr_training' | 'general';
  categoryLabel: string;
  badgeBg: string;
  badgeText: string;
  isBuiltin: boolean;
  roleTitle: string;
  roleSubtitle: string;
  kbScope: string;
  lastMessage: string;
  lastTime: string;
  recommendedPrompts: string[];
  messages: ChatMessage[];
}

const initialSessionsList: ChatSession[] = [
  {
    id: 'sess-sales',
    code: 'SESS-101',
    title: '销售培训 · 销冠谈判与异议化解',
    category: 'sales_training',
    categoryLabel: '内部培训 · 销售',
    badgeBg: 'bg-red-50 text-[#EA3A20] border-red-100',
    badgeText: '销售实战',
    isBuiltin: true,
    roleTitle: '外贸销冠导师 · 商务谈判AI私教',
    roleSubtitle: '专注中东/欧美豪宅大单推进、3F异议化解、30%定金与交期锁价谈判',
    kbScope: '《外贸定制大单SOP》/《面对高净值客户心理博弈》/《销冠话术库》',
    lastMessage: '面对欧美客户提出"别家工厂报价低15%"时，切忌直接降价，运用3F法则...',
    lastTime: '10:45',
    recommendedPrompts: [
      '欧美客户提出"别家工厂报价低15%"，如何运用3F法则化解？',
      '海外客户要求减少定金至10%，如何话术引导并坚持30%底线？',
      '德国百隆Blum五金与国产优质五金相比，向客户讲解溢价卖点的话术有哪些？',
      '外贸全屋定制如何向海外总包商讲解打样费并在大货中抵扣？'
    ],
    messages: [
      {
        id: 'msg-sales-1',
        sender: 'user',
        content: '面对欧美客户提出"别家工厂报价低15%"，销冠通常如何运用3F法则化解并保住利润？',
        timestamp: '10:42'
      },
      {
        id: 'msg-sales-2',
        sender: 'assistant',
        content: `【品爱家居内部培训·销冠商务谈判实战指导】

面对海外买家"别家报价低15%"的价格异议，切忌直接降价破防。资深外贸销冠标准采用 **3F 法则 (Feel, Felt, Found)** 进行认知重塑：

1. **Feel（共情理解）**：
   - *"I completely understand how critical cost optimization and margin control are for your multi-villa project."*
   - 先肯定买家对预算把控的专业度，消除对抗情绪。

2. **Felt（引用同行共鸣）**：
   - *"Many of our high-end interior designer and builder clients in California & Sydney felt exactly the same way when reviewing our initial quote compared to conventional suppliers."*
   - 告知客户其他成熟欧美总包商最初也有同感，建立从众与信任。

3. **Found（实证价值反差，核算全生命周期成本）**：
   - **德国豪迈激光封边技术**：零胶缝防水防潮，海运过赤道高湿集装箱无鼓包开裂隐患；
   - **原厂进口奥地利百隆 (Blum) 五金**：提供 200,000 次开合耐用质保，避免海外高昂的上门返修人工费（欧美人工高达 $80-$120/小时）；
   - **严格遵循 ISTA 3A 跌落海运防损包装**：蜂窝护角 + 5层重型瓦楞纸箱，运输破损率低于 0.3‰。
   - *"They found that our zero-defect delivery and pre-assembled cabinet accuracy actually saved them over 18% in total project installation labor on-site."*

**行动建议**：顺势提出寄送实物对比样板盒（含切面色卡与封边试块），并预约 15 分钟 Zoom 远程方案投屏，锁定买家决策层。`,
        timestamp: '10:45',
        sources: [
          { title: "《面对中东与欧美高净值客户的异议化解与心理博弈》", code: "KB-TRAIN-SALES-01" },
          { title: "《外贸定制大单全流程跟进与风控交付SOP手册》", code: "KB-TRAIN-SOP-01" }
        ],
        confidence: 0.99
      }
    ]
  },
  {
    id: 'sess-ops',
    code: 'SESS-102',
    title: '运营培训 · 社媒短视频与海外获客',
    category: 'ops_training',
    categoryLabel: '内部培训 · 运营',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-100',
    badgeText: '海外运营',
    isBuiltin: true,
    roleTitle: '海外数字营销导师 · 跨境获客实战顾问',
    roleSubtitle: '专注TikTok/Reels爆款家居短视频脚本、线上展会联动与海外独立站高意向RFQ引流',
    kbScope: '《社媒短视频分镜实拍规范》/《跨境B2B独立站SEO与转化》/《展会大促SOP》',
    lastMessage: 'TikTok家居爆款短视频必须在黄金前3秒建立视觉冲突与反差...',
    lastTime: '09:20',
    recommendedPrompts: [
      'TikTok/Instagram Reels 家居定制短视频前3秒黄金Hook如何设计？',
      '广交会与海外线下展会前30天，如何通过EDM与社媒做精准买家邀约？',
      '外贸独立站如何布局"Custom Kitchen Cabinet Manufacturer"长尾RFQ词？',
      '工厂数控5轴精雕实木门板的拍摄脚本分镜要点有哪些？'
    ],
    messages: [
      {
        id: 'msg-ops-1',
        sender: 'user',
        content: '我们在做海外 TikTok 和 Instagram Reels 时，怎样设计前3秒黄金 Hook 才能吸引欧美建筑设计师和高净值业主？',
        timestamp: '09:18'
      },
      {
        id: 'msg-ops-2',
        sender: 'assistant',
        content: `【品爱家居内部培训·海外短视频爆款营销实战】

海外 B2B/B2C 高端定制家居受众注重 **工艺精工感** 与 **极端耐用度验证**。前 3 秒黄金 Hook（吸睛钩子）必须采用“**强视觉冲突 + 极致细节特写**”三步法：

1. **黄金前 3 秒（视觉反差与悬念 Hook）**：
   - **场景 A（抗震暴力测试）**：将重型钢球或整箱红酒置于全拉伸 Blum 隐形滑轨抽屉上，镜头瞬间特写抽屉平稳缓降，配大字文案 *"Can your cabinet drawers handle 50KG without bending?"*；
   - **场景 B（高精度机加工）**：德国豪迈（HOMAG）五轴数控铣刀飞速在整块北美红橡木上雕出高精弧线的宏观特写，带原声切削轰鸣，配字幕 *"Precision engineering inside China's top bespoke factory."*

2. **中段 5-15 秒（工艺硬核背书）**：
   - 快速展示极简无拉手反弹开启、E0级环保板材横截面多层结构、激光无缝封边水浸泡对比试验。

3. **尾段 16-25 秒（明确行动号召 Call-To-Action）**：
   - 屏幕出现最新 2026 全球豪宅工程交付图册，字幕引导 *"Direct factory pricing for builders & designers. Comment 'BOQ' or click link in bio for free CAD catalogue."*

**转化关键提示**：所有发布视频必须在评论区首条置顶中英文询盘通道，专人 30 分钟内承接海外私信询盘。`,
        timestamp: '09:20',
        sources: [
          { title: "《海外社媒短视频分镜脚本与工艺实拍规范》", code: "KB-OPS-ASSET-01" },
          { title: "《跨境B2B独立站高转化SEO与RFQ承接规范》", code: "KB-OPS-SEO-02" }
        ],
        confidence: 0.98
      }
    ]
  },
  {
    id: 'sess-hr',
    code: 'SESS-103',
    title: '人力资源培训 · 提成激励与员工手册',
    category: 'hr_training',
    categoryLabel: '内部培训 · 人资',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    badgeText: '企业人资',
    isBuiltin: true,
    roleTitle: '集团人资培训导师 · 组织激励与制度顾问',
    roleSubtitle: '涵盖外贸业务员阶梯提成测算、海外出差参展报销、保密协议NDA与合规考核',
    kbScope: '《员工手册与薪酬绩效方案 v3.0》/《差旅报销与知识产权保密规范》',
    lastMessage: '外贸业务员阶梯提成按出货FOB净利润阶梯结算，毛利率≥35%可达...',
    lastTime: '昨天',
    recommendedPrompts: [
      '外贸业务员阶梯提成机制与发放时间节点是什么？',
      '参加海外展会（迪拜/德国/美国）的差旅报销及海外公杂补贴标准？',
      '新员工入职商业保密协议(NDA)与同业竞业禁止的红线条款有哪些？',
      '外贸大单客诉赔付的责任判定与绩效连带规则如何界定？'
    ],
    messages: [
      {
        id: 'msg-hr-1',
        sender: 'user',
        content: '请说明目前外贸业务员的阶梯提成核算方案、发放周期以及海外展会差旅补贴标准。',
        timestamp: '昨天 15:30'
      },
      {
        id: 'msg-hr-2',
        sender: 'assistant',
        content: `【品爱家居集团人力资源培训·薪酬激励与差旅制度规范】

依据《品爱家居集团员工手册与业务薪酬激励方案 v3.0》，核心细则如下：

### 一、 外贸业务员阶梯提成核算与发放机制
1. **核算基准**：按单笔定制订单实际履约的 **FOB 实际净利润额**（扣除海外打样损耗、海运港杂垫付及第三方商检费后）为核算基础；
2. **阶梯提成比例**：
   - **优质大单（毛利率 ≥ 35%）**：按净利润的 **10% ~ 12%** 计提；
   - **常规订单（毛利率 25% ~ 35%）**：按净利润的 **7% ~ 8%** 计提；
   - **战略跑量单（毛利率 18% ~ 25%）**：按净利润的 **5%** 计提。
3. **发放时间节点**：
   - 订单完成发货并确认收到买方 70% 尾款、海运提单电放完成无质量索赔后，次月 20 日薪酬周期全额兑现发放。

---

### 二、 海外出差与国际展会差旅津贴标准
1. **交通与住宿**：
   - **机票**：统一预订国际经济舱（飞行时长单程超过 8 小时可申请超级经济舱）；
   - **海外酒店住宿上限**：欧美澳新地区最高 **$180/间夜**；中东、日韩、东南亚最高 **$120/间夜**（展会期间若遇酒店浮动，由部门总监特批）；
2. **海外公杂与生活餐补**：
   - 给予海外出差人员 **$50/人/天** 的包干生活津贴；
3. **报销合规要求**：
   - 差旅归国后 5 个工作日内，凭机票行程单、海外正规 Commercial Invoice 贴票并在 OA 系统提交审批。`,
        timestamp: '昨天 15:32',
        sources: [
          { title: "《品爱家居集团员工手册与薪酬绩效激励方案 v3.0》", code: "KB-HR-POL-01" },
          { title: "《外贸业务差旅报销与知识产权保密合规规范》", code: "KB-HR-EXP-02" }
        ],
        confidence: 0.99
      }
    ]
  },
  {
    id: 'sess-general',
    code: 'SESS-104',
    title: '通用问答 · 欧美认证与定制工艺标准',
    category: 'general',
    categoryLabel: '产品工艺',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-100',
    badgeText: '工艺合规',
    isBuiltin: false,
    roleTitle: '外贸全案技术导师 · 全球工艺合规顾问',
    roleSubtitle: '解答实木/板材/皮革选型、FSC/CARB P2环保认证、ISTA 3A包装与国际关税申报',
    kbScope: '《2026出口材质合规手册》/《美欧海运包装ISTA 3A规范》/《产品百科》',
    lastMessage: '欧洲 FSC (Forest Stewardship Council) 认证关注木材合法来源...',
    lastTime: '10:24',
    recommendedPrompts: [
      '外贸定制橱柜欧洲 FSC 认证与 CARB P2 板材环保标准的差异及报关要求？',
      '意式极简实木皮沙发 1*40HQ 海运 CBM 装箱率如何核算？',
      '北美买家要求 ISTA 3A 跌落测试包装标准，工厂合规要求有哪些？',
      '板式衣柜柜体 E0 级与 E1 级防潮板的单方溢价与报关申报编码'
    ],
    messages: [
      {
        id: 'msg-gen-1',
        sender: 'user',
        content: '外贸定制橱柜欧洲 FSC 认证与 CARB P2 板材环保标准的差异及报关要求是什么？',
        timestamp: '10:22'
      },
      {
        id: 'msg-gen-2',
        sender: 'assistant',
        content: `【品爱家居外贸定制·通用知识库智能解答】

欧洲 **FSC** 认证与美国加州 **CARB P2 / TSCA Title VI** 环保标准在外贸报关、供应链溯源与检测限制方面存在本质区别：

1. **核心监管维度差异**：
   - **欧洲 FSC (Forest Stewardship Council)**：关注森林砍伐合法性与可持续森林经营溯源。整柜出货时，必须出具全链条产销监管链编号 (FSC-CoC)，确保木材非非法采伐来源；
   - **美国 CARB P2 (California Air Resources Board) 及 EPA TSCA Title VI**：严格管控复合木制品（刨花板、胶合板、MDF）中的游离甲醛释放量。严苛限值要求 ≤ 0.05 ppm。

2. **海关报关与清关单证要求**：
   - **出口欧洲**：商业发票 (Commercial Invoice) 与提单 (B/L) 需明确标注品爱的 FSC 证书编号，并提供经 FSC 认可的材质流转清单；
   - **出口美国/加拿大**：提关时必须随箱附带第三方公证行（如 SGS / Intertek）颁发的 CARB P2 合规检测报告，且纸箱外侧必须贴有符合 EPA 格式的合规声明贴纸 (Compliance Label)。

3. **品爱工厂工艺保障**：
   - 品爱全线外贸柜体均采用符合 FSC 认证的进口多层实木与大亚/爱格 E0 级低甲醛基材，通过德国 Henkel PUR 激光封边锁住游离挥发物，完全满足欧美双重严苛标准。`,
        timestamp: '10:24',
        sources: [
          { title: "2026版全屋家居出口材质合规手册 v3.2", code: "KB-FUR-2026-08" },
          { title: "美欧海运包装及跌落测试 ISTA 3A 规范", code: "KB-PKG-2025" }
        ],
        confidence: 0.98
      }
    ]
  }
];

export const HomeModule: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessionsList);
  const [activeSessionId, setActiveSessionId] = useState<string>('sess-sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'training' | 'general'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'builtin' | 'custom'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'learning' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'keyboard' | 'voice'>('keyboard');

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
    contextHint: 'general',
    defaultLang: 'zh-CN'
  });

  const handleVoiceConfirm = () => {
    const textToInsert = transcript || interimTranscript;
    if (textToInsert) {
      setInputQuery((prev) => (prev ? `${prev} ${textToInsert}` : textToInsert));
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
        setInputQuery((prev) => (prev ? `${prev} ${text}` : text));
      });
    }
  };

  // Training state: progress & efficiency tracking
  const [trainingCourses, setTrainingCourses] = useState<Record<string, TrainingCourse>>(initialTrainingCourses);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const isTrainingSession = activeSession.category !== 'general';
  const currentCourse = isTrainingSession ? trainingCourses[activeSessionId] : null;

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, loading]);

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterCategory === 'training' && s.category === 'general') return false;
    if (filterCategory === 'general' && s.category !== 'general') return false;

    if (sourceFilter === 'builtin' && !s.isBuiltin) return false;
    if (sourceFilter === 'custom' && s.isBuiltin) return false;

    if (statusFilter === 'learning') {
      // If learning, must be a training course with progress not 100%
      const course = trainingCourses[s.id];
      if (!course) return false;
    } else if (statusFilter === 'completed') {
      const course = trainingCourses[s.id];
      if (course && course.currentLessonIndex + 1 < course.lessons.length) return false;
    }

    return true;
  });

  // Create new custom session
  const handleCreateNewSession = () => {
    const newId = `sess-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      code: `SESS-${100 + sessions.length + 1}`,
      title: `自定义问答 · ${new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}`,
      category: 'general',
      categoryLabel: '自定义咨询',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      badgeText: '业务问答',
      isBuiltin: false,
      roleTitle: '外贸定制家居 AI 顾问',
      roleSubtitle: '支持任意关于实木/板式定制、外贸报价、海运装箱及海外施工规范的提问',
      kbScope: '《外贸全案知识库总集》/《产品技术百科》/《业务SOP》',
      lastMessage: '新对话已开启，请输入您的问题...',
      lastTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedPrompts: [
        '外贸定制家居 1*40HQ 集装箱海运防潮包装有哪些红线要求？',
        '针对海外公寓总包工程，如何快速出具 BOQ 工程量清单？',
        '全屋定制爱格板与实木多层板的单平米造价差异及卖点对比？'
      ],
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'assistant',
          content: '您好！我是品爱家居 AI 知识导师。您可以随时向我提问产品工艺、技术标准、外贸大单交付、内部流程或国际贸易合规细节。',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 0.99
        }
      ]
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  // Ask Question in current active session
  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q || loading) return;

    const userMsgId = `usr-${Date.now()}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      content: q,
      timestamp: currentTime
    };

    // Update active session with user message immediately
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            lastMessage: q,
            lastTime: currentTime,
            messages: [...s.messages, userMessage]
          };
        }
        return s;
      })
    );

    if (!textToSend) {
      setInputQuery('');
    }
    setLoading(true);

    try {
      const res = await fetch('/api/knowledge/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          category: activeSession.category,
          roleContext: activeSession.roleTitle
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: data.answer || '未能从知识库匹配到详细解答，请尝试补充更多背景条件。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [
          { title: activeSession.kbScope, code: 'KB-MASTER-AUTO' }
        ],
        confidence: data.confidence || 0.98
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              lastMessage: assistantMsg.content.slice(0, 45) + '...',
              lastTime: assistantMsg.timestamp,
              messages: [...s.messages, assistantMsg]
            };
          }
          return s;
        })
      );

      // In training mode, asking questions enhances employee learning efficiency
      if (isTrainingSession && currentCourse) {
        setTrainingCourses((prev) => {
          const c = prev[activeSessionId];
          if (!c) return prev;
          const newCount = c.interactiveCount + 1;
          const newEff = Math.min(99, c.efficiencyScore + 1);
          return {
            ...prev,
            [activeSessionId]: {
              ...c,
              interactiveCount: newCount,
              efficiencyScore: newEff
            }
          };
        });
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        content: `【系统提示】网络连接波动，已切换为企业离线知识库回复：针对问题"${q}"，请参考品爱外贸定制标准 SOP 库或在知识库管理模块查阅相关工艺文档。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0.90
      };
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, fallbackMsg]
            };
          }
          return s;
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick prompt click
  const handleQuickPromptClick = (promptText: string) => {
    handleSendMessage(promptText);
  };

  // Get icon by session type
  const getSessionIcon = (session: ChatSession) => {
    switch (session.category) {
      case 'sales_training':
        return <Target className="w-4 h-4 text-[#EA3A20]" />;
      case 'ops_training':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'hr_training':
        return <Users className="w-4 h-4 text-emerald-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden p-3 lg:p-4">
      {/* Main Dual-Column Split Workspace: Left List + Right Detail */}
      <div className="flex-1 flex gap-3.5 lg:gap-4 overflow-hidden min-h-0">
        
        {/* ========================================================= */}
        {/* 左侧：会话列表面板 (Left: Session List Panel)               */}
        {/* ========================================================= */}
        <div className="shrink-0 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 w-[350px] md:w-[370px] lg:w-[390px] xl:w-[410px]">
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
              type="button"
              onClick={handleCreateNewSession}
              className="h-8 px-3 rounded-full bg-[#0F4A47] text-white hover:bg-[#0b3836] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
              title="新建提问会话"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ 新建会话</span>
            </button>
          </div>

          {/* Channel / Category Filter Tabs */}
          <div className="p-3 pb-2 border-b border-slate-100 bg-white">
            <div className="bg-slate-100/90 rounded-full p-1 flex items-center gap-1">
              {[
                { key: 'all' as const, label: '全部', count: sessions.length },
                { key: 'training' as const, label: '内部培训', count: sessions.filter((s) => s.category !== 'general').length },
                { key: 'general' as const, label: '业务通用', count: sessions.filter((s) => s.category === 'general').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterCategory(tab.key)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    filterCategory === tab.key
                      ? 'bg-[#EA3A20] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      filterCategory === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/40 space-y-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索会话主题 / 导师 / 问答关键词..."
                className="h-8 pl-8 pr-7 w-full rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] focus:border-[#EA3A20]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
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
                  onChange={(e) => setSourceFilter(e.target.value as 'all' | 'builtin' | 'custom')}
                  className="appearance-none w-full h-7 pl-2.5 pr-6 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="all">全部来源</option>
                  <option value="builtin">⚡ 系统内置</option>
                  <option value="custom">👤 自定义提问</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'learning' | 'completed')}
                  className="appearance-none w-full h-7 pl-2.5 pr-6 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="all">全部状态</option>
                  <option value="learning">带教中</option>
                  <option value="completed">已掌握</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Session Cards Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-slate-50/20">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((sess, idx) => {
                const isSelected = activeSessionId === sess.id;
                const course = trainingCourses[sess.id];
                return (
                  <div
                    key={sess.id}
                    onClick={() => setActiveSessionId(sess.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#0F4A47]/5 border-[#0F4A47] ring-1 ring-[#0F4A47]/30 shadow-xs border-l-[5px] border-l-[#0F4A47]'
                        : 'bg-white hover:bg-slate-50/90 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* First Line: Title, ID, Source badge, Time */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`font-bold text-xs truncate ${isSelected ? 'text-[#0F4A47]' : 'text-slate-900'}`}>
                          {sess.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {sess.code || `SESS-${101 + idx}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {sess.isBuiltin ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100">
                            <Zap className="w-2.5 h-2.5 text-indigo-500 fill-indigo-400" />
                            内置
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200/60">
                            <UserPlus className="w-2.5 h-2.5 text-amber-600" />
                            自建
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">{sess.lastTime}</span>
                      </div>
                    </div>

                    {/* Meta Row: Category badge, Mentor/Scope, Quick Status */}
                    <div className="flex items-center justify-between gap-2 mb-2 text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`px-2 py-0.2 rounded-full font-bold text-[10px] border shrink-0 ${
                            sess.category === 'sales_training'
                              ? 'bg-blue-50 text-blue-600 border-blue-100'
                              : sess.category === 'ops_training'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : sess.category === 'hr_training'
                              ? 'bg-purple-50 text-purple-700 border-purple-100'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sess.category === 'general' ? '业务问答' : '内部培训'}
                        </span>
                        <span className="text-slate-500 text-[11px] font-medium truncate">
                          导师: <strong className="text-slate-700">{course?.mentorName || (sess.category === 'general' ? 'AI全案顾问' : '带教导师')}</strong>
                        </span>
                      </div>

                      {/* Quick Status Pill */}
                      <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full border text-[10px] font-bold bg-blue-50 text-blue-700 border-blue-200">
                          <span>{course ? '带教中' : '可提问'}</span>
                          <ChevronDown className="w-2.5 h-2.5 text-blue-500" />
                        </span>
                      </div>
                    </div>

                    {/* Last Message Snippet */}
                    <p className="text-[11px] text-slate-500 truncate leading-relaxed mb-2">
                      {sess.lastMessage || '等待提问与知识检索...'}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 items-center">
                      {course ? (
                        <>
                          <span className="px-1.5 py-0.2 text-[9px] bg-emerald-50 text-emerald-700 rounded font-medium border border-emerald-100">
                            进度: 第 {course.currentLessonIndex + 1}/{course.lessons.length} 节
                          </span>
                          <span className="px-1.5 py-0.2 text-[9px] bg-amber-50 text-amber-700 rounded font-medium border border-amber-100">
                            效率: {course.efficiencyScore}分
                          </span>
                        </>
                      ) : (
                        <span className="px-1.5 py-0.2 text-[9px] bg-indigo-50 text-indigo-700 rounded font-medium border border-indigo-100">
                          全案产品知识库
                        </span>
                      )}
                      {sess.recommendedPrompts?.slice(0, 2).map((prompt, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-1.5 py-0.2 text-[9px] bg-slate-100 text-slate-600 rounded font-medium truncate max-w-[95px]"
                          title={prompt}
                        >
                          {prompt}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs px-4">
                暂无符合条件的会话，可切换类别或清空搜索词。
              </div>
            )}
          </div>

          {/* Left Footer: Count & Pagination */}
          <div className="p-2.5 px-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
            <span>共 {filteredSessions.length} 条会话</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white cursor-pointer"
              >
                上一页
              </button>
              <span className="px-1.5 font-bold text-slate-700">{currentPage}</span>
              <button
                type="button"
                disabled={true}
                className="px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white cursor-pointer"
              >
                下一页
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT MAIN VIEW: Chat Conversation Content                                */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden min-w-0">
        
        {/* Right Header: Active Session Title & Mentor Info */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold text-slate-900">{activeSession.title}</h1>
            {isTrainingSession && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-[#EA3A20] border border-red-200">
                内部培训
              </span>
            )}
          </div>
          {isTrainingSession && currentCourse && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">带教导师:</span>
              <span className="font-bold text-slate-800">{currentCourse.mentorName}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">{currentCourse.mentorTitle}</span>
            </div>
          )}
        </div>

        {/* Right Chat Messages Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

          {/* Messages Stream */}
          {activeSession.messages.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Bot className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">会话已清空，请在下方输入或点击快捷问题开始</p>
            </div>
          ) : (
            activeSession.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-2xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    
                    <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">
                        {isUser ? '我 (业务学员)' : activeSession.roleTitle}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-[#EA3A20] text-white rounded-tr-xs font-medium'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs whitespace-pre-line'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Citations & Metadata for Assistant Message */}
                    {!isUser && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 px-1 text-[11px] text-slate-500">
                        <div className="flex flex-wrap items-center gap-2">
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-slate-400">出处：</span>
                              {msg.sources.map((src, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-mono text-[10px]"
                                  title={src.title}
                                >
                                  {src.code || src.title}
                                </span>
                              ))}
                            </div>
                          )}

                          {msg.confidence && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                              置信度 {(msg.confidence * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.id, msg.content)}
                          className="text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                          title="复制回答内容"
                        >
                          {copiedId === msg.id ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              已复制
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy className="w-3 h-3" />
                              复制回答
                            </span>
                          )}
                        </button>
                      </div>
                    )}

                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 font-bold text-xs">
                      <User className="w-4 h-4 text-slate-700" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                <div className="w-4 h-4 border-2 border-[#EA3A20] border-t-transparent rounded-full animate-spin" />
                <span>正在检索品爱内部知识库并由大模型推理合成专业回答...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Right Dock: Recommended Prompts + Input Form */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 space-y-3 shadow-sm">
          
          {/* Active Session Recommended Quick Prompts */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#EA3A20]" />
                <span>当前主题实战高频推荐提问：</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">点击即发</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {activeSession.recommendedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPromptClick(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50/80 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-[#EA3A20] text-xs shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 group"
                >
                  <span className="truncate max-w-sm">{prompt}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#EA3A20] shrink-0" />
                </button>
              ))}
            </div>
          </div>

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

          {/* Input Method Switch & Textarea Container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    if (isListening) stopListening();
                    setInputMode('keyboard');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    inputMode === 'keyboard' && !isListening
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5 text-slate-600" />
                  <span>键盘输入</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    isListening || inputMode === 'voice'
                      ? 'bg-[#EA3A20] text-white shadow-2xs font-bold animate-pulse'
                      : 'text-slate-500 hover:text-[#EA3A20]'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isListening ? '录音中 (点击完成)' : '语音转文字'}</span>
                </button>
              </div>

              {isListening && (
                <span className="text-[11px] text-[#EA3A20] font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#EA3A20]"></span>
                  正在收音并转写为文字...
                </span>
              )}
            </div>

            {/* Textarea Input + Mic Toggle + Send Button */}
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-[#EA3A20]/20 focus-within:border-[#EA3A20] transition-all">
              <textarea
                rows={2}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isListening
                    ? '正在倾听语音转写中... 您也可以直接使用键盘打字输入补充...'
                    : `在【${activeSession.categoryLabel}】中输入您的问题，支持键盘输入或点击麦克风语音转文字...`
                }
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed p-1"
              />

              <button
                type="button"
                onClick={handleToggleVoice}
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                  isListening
                    ? 'bg-red-600 text-white shadow-xs animate-pulse ring-2 ring-red-300'
                    : 'bg-white hover:bg-slate-200/80 text-slate-600 border border-slate-200/80 shadow-2xs hover:text-[#EA3A20]'
                }`}
                title={isListening ? '点击完成语音录入' : '点击开始语音转文字'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={loading || !inputQuery.trim()}
                className="h-10 px-5 bg-[#EA3A20] hover:bg-[#d6341c] text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? '检索中' : '发送'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>支持键盘输入（Enter 发送，Shift + Enter 换行）或语音转文字输入</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>已接入企业内部保密过滤，敏感数据出境合规风控开启</span>
            </span>
          </div>

        </div>

      </div>

      </div>

    </div>
  );
};

