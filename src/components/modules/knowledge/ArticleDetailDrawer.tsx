import React, { useState, useMemo } from 'react';
import {
  X,
  Edit3,
  Download,
  Copy,
  Check,
  Folder,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Users,
  Globe,
  ShieldCheck,
  Calendar,
  Link2,
  Tag as TagIcon,
  Video,
  Presentation,
  FileText,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  FileDown,
  Layers,
  ChevronRight,
  BookOpen,
  Info,
  Maximize2,
  ExternalLink,
  History,
  RotateCcw,
  GitCompare,
  AlertCircle,
  XCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  User,
  ShieldAlert,
  Search,
  Cpu,
  Database,
  Hash,
  RefreshCw,
  Bot,
  Zap,
  Code2,
  Eye,
  HelpCircle,
  Filter,
  Terminal,
  Columns,
  ListTree
} from 'lucide-react';
import { KBArticle, KBAuditLog } from '../../../types';
import { DualColumnDiff, VersionOption } from './DualColumnDiff';

interface ArticleDetailDrawerProps {
  article: KBArticle | null;
  onClose: () => void;
  onEdit: (article: KBArticle) => void;
  onRollback?: (article: KBArticle, log: KBAuditLog) => void;
  onSelectRelated?: (article: KBArticle) => void;
  allArticles?: KBArticle[];
  renderPairedTagBadge: (tagStr: string) => React.ReactNode;
  onShowToast: (msg: string) => void;
  isReviewMode?: boolean;
  onApprove?: (article: KBArticle, comment?: string) => void;
  onReject?: (article: KBArticle, reason: string) => void;
}

export interface SemanticChunk {
  id: string;
  chunkIndex: number;
  sectionTitle: string;
  topic: string;
  text: string;
  tokenCount: number;
  charCount: number;
  vectorId: string;
  similarityScore?: number;
  embeddingModel: string;
  tags: string[];
  lastIndexedAt: string;
}

export const ArticleDetailDrawer: React.FC<ArticleDetailDrawerProps> = ({
  article,
  onClose,
  onEdit,
  onRollback,
  onSelectRelated,
  allArticles = [],
  renderPairedTagBadge,
  onShowToast,
  isReviewMode = false,
  onApprove,
  onReject
}) => {
  type DrawerTab = 'diff' | 'content' | 'attributes' | 'vectors' | 'history';
  const [activeTab, setActiveTab] = useState<DrawerTab>(isReviewMode ? 'diff' : 'content');
  const [copiedContent, setCopiedContent] = useState(false);
  const [expandedDiffLogId, setExpandedDiffLogId] = useState<string | null>(null);
  const [rollbackConfirmLog, setRollbackConfirmLog] = useState<KBAuditLog | null>(null);

  // Review Reject & Approve modal states in drawer
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');

  // Switch tab automatically when review mode or article changes
  React.useEffect(() => {
    if (isReviewMode) {
      setActiveTab('diff');
    } else {
      setActiveTab('content');
    }
  }, [isReviewMode, article?.id]);

  // History Tab: View Mode (timeline vs dual-diff)
  const [historyViewMode, setHistoryViewMode] = useState<'timeline' | 'dualDiff'>('timeline');
  const [selectedLeftVersionId, setSelectedLeftVersionId] = useState<string>('');
  const [selectedRightVersionId, setSelectedRightVersionId] = useState<string>('');

  // AI Semantic Vectors state
  const [vectorSearchQuery, setVectorSearchQuery] = useState('');
  const [selectedChunkTopic, setSelectedChunkTopic] = useState('all');
  const [isRevectorizingAll, setIsRevectorizingAll] = useState(false);
  const [revectorizingChunkId, setRevectorizingChunkId] = useState<string | null>(null);
  const [rawVectorModalChunk, setRawVectorModalChunk] = useState<SemanticChunk | null>(null);
  const [copiedChunkId, setCopiedChunkId] = useState<string | null>(null);
  const [expandedChunkIds, setExpandedChunkIds] = useState<Set<string>>(new Set());
  const [reindexedTimeMap, setReindexedTimeMap] = useState<Record<string, string>>({});

  // Generate realistic, rich semantic chunks for RAG vectorization strictly tailored to the current article
  const baseSemanticChunks: SemanticChunk[] = useMemo(() => {
    if (!article) return [];
    
    // Target chunk count
    const targetCount = article.chunksCount || 32;
    const nowStr = article.updatedAt || '2026-08-18';
    const cleanTitle = article.title.replace(/\.[a-zA-Z0-9]+$/, '');

    // Check specific article type
    const isBrandHistoryArticle =
      article.id === 'KB-BRAND-01' ||
      article.code === 'KB-BRAND-2026-01' ||
      article.title.includes('2008-2026') ||
      article.title.includes('发展历程');

    const isBrandFactoryArticle =
      article.id === 'KB-BRAND-02' ||
      article.code === 'KB-BRAND-2026-02' ||
      article.title.includes('工业4.0') ||
      article.title.includes('豪迈HOMAG');

    const isMilanSeriesArticle =
      article.id === 'KB-SERIES-01' ||
      article.code === 'KB-SERIES-MILAN-01' ||
      article.title.includes('米兰晨曦');

    const isOrientalSeriesArticle =
      article.id === 'KB-SERIES-02' ||
      article.code === 'KB-SERIES-ORIENTAL-02' ||
      article.title.includes('东方印月');

    const isHardwareArticle =
      article.id === 'KB-BRAND-HARDWARE-01' ||
      article.code === 'KB-BRAND-BLUM-01' ||
      article.title.includes('Blum') ||
      article.title.includes('五金联名');

    const isPanelArticle =
      article.id === 'KB-BRAND-PANEL-02' ||
      article.code === 'KB-BRAND-EGGER-02' ||
      article.title.includes('爱格') ||
      article.title.includes('克诺斯邦');

    const isCabinetStdArticle =
      article.id === 'KB-CABINET-01' ||
      article.code === 'KB-FUR-2026-01' ||
      article.title.includes('出口美欧外贸全屋定制家具通用规格');

    const isCabinetModArticle =
      article.id === 'KB-CABINET-02' ||
      article.code === 'KB-CABINET-MOD-02' ||
      article.title.includes('收纳模数');

    const isWallArticle =
      article.id === 'KB-WALL-01' ||
      article.id === 'KB-WALL-02' ||
      article.code.includes('WALL') ||
      article.title.includes('门墙一体') ||
      article.title.includes('隐形门');

    const isWindowArticle =
      article.id === 'KB-WINDOW-01' ||
      article.code.includes('WIN') ||
      article.title.includes('门窗');

    const isBathArticle =
      article.id === 'KB-BATH-01' ||
      article.code.includes('BATH') ||
      article.title.includes('浴室柜') ||
      article.title.includes('岩板台盆');

    const isSmartArticle =
      article.id === 'KB-SMART-01' ||
      article.code.includes('SMART') ||
      article.title.includes('Zigbee') ||
      article.title.includes('智能家居');

    const isTierArticle =
      article.id === 'KB-TIER-01' ||
      article.code.includes('TIER') ||
      article.title.includes('三大梯度');

    const isBudgetArticle =
      article.id === 'KB-BUDGET-01' ||
      article.code.includes('BUDGET') ||
      article.title.includes('预算');

    const isColorArticle =
      article.id === 'KB-COLOR-COMBO-01' ||
      article.code.includes('COLOR') ||
      article.title.includes('色系');

    const isStyleComboArticle =
      article.id === 'KB-STYLE-COMBO-01' ||
      article.code === 'KB-COMBO-STYLE-01' ||
      article.title.includes('六大风格') ||
      article.title.includes('风格');

    // 1. Specific predefined chunks for Brand History (KB-BRAND-01)
    const brandHistoryChunks: Array<{ title: string; topic: string; text: string; tags: string[] }> = [
      {
        title: '01. 品牌创始与18年发展历程（2008-2026）- 从匠心工坊到全球智造',
        topic: '品牌发展历程',
        text: '品爱家居成立于2008年，总部位于广东佛山。历经18年深耕外贸全屋定制领域，从早期高端定制手工工坊蜕变升级为集工业4.0智能制造、全案3D数字化深化设计与跨国海运交付于一体的国际化家居品牌，累计为全球100多个国家和地区的地产开发商及豪宅业主提供一站式定制交付。',
        tags: ['外贸交付: 全球交付网络', '外贸交付: 德国豪迈智造', '合规风控: FSC产销监管链']
      },
      {
        title: '02. 佛山12万平方米工业4.0智能制造产业园概况',
        topic: '智能智造基地',
        text: '品爱智造生产基地占地120,000平方米，规划有数控开料车间、激光智能封边中心、吸塑烤漆恒温车间、五金预组装车间及自动化立体板件分拣仓储区。园区全面实现数字化看板管控与MES系统全流程条码追溯，日均标准柜体单元产能突破1500套。',
        tags: ['外贸交付: 德国豪迈智造', '材质: 激光无缝封边', '环保等级: ENF级无醛']
      },
      {
        title: '03. 德国豪迈（HOMAG）全自动封边与柔性CNC切割生产线引进',
        topic: '智能智造基地',
        text: '品爱全线引进德国豪迈（HOMAG）全自动封边加工中心与高精数控开料机床。加工尺寸公差严格控制在±0.3mm以内，搭载德国瑞好REHAU激光封边系统与PUR反应型防水胶水技术，彻底消除传统板材外露胶线，确保柜体长途海运受潮不膨胀、不开胶。',
        tags: ['外贸交付: 德国豪迈智造', '材质: PUR防水封边', '材质: 激光无缝封边']
      },
      {
        title: '04. 全球100+国家和地区海外交付网络与重点出海枢纽',
        topic: '全球外贸网络',
        text: '品爱外贸交付网络覆盖全球超100个国家和地区：北美（美国、加拿大）、中东（沙特阿拉伯、阿联酋迪拜、卡塔尔、科威特）、欧洲（英国、德国、法国、希腊）、澳新（澳大利亚悉尼/墨尔本、新西兰）及东南亚等。设立多语种外贸工程团队，提供无时差响应与技术支持。',
        tags: ['外贸交付: 全球交付网络', '外贸交付: FOB条款', '外贸交付: CIF条款']
      },
      {
        title: '05. 国际合规认证体系：ISO9001、ISO14001与FSC森林全链条认证',
        topic: '国际资质认证',
        text: '品爱具备完备的国际资质认证：ISO 9001质量管理体系认证、ISO 14001环境管理体系认证，以及由SGS核发的FSC-COC森林产销监管链认证（确保证明所有木材均来自可持续经营森林）。全系出口板材均具备美国加州CARB Phase 2认证与EPA TSCA Title VI检测证书。',
        tags: ['合规风控: FSC产销监管链', '合规风控: CARB P2认证', '环保等级: E0级环保']
      },
      {
        title: '06. 全球50,000+标杆项目交付实绩 - 独栋豪宅与五星级酒店工程',
        topic: '工程交付实绩',
        text: '品爱累计完成海内外50,000+套工程项目交付，代表作包括：美国加利福尼亚比弗利山庄独栋海景豪宅全屋整装、迪拜棕榈岛五星级度假酒店套房橱柜工程、沙特利雅得现代商业综合体精装公寓及澳大利亚悉尼海港高端公寓全套门墙柜一体化工程。',
        tags: ['空间: 独栋别墅', '空间: 大平层', '外贸交付: 全球交付网络']
      },
      {
        title: '07. 北美市场交付服务体系 - 洛杉矶/纽约海外仓备件与现场指导',
        topic: '区域交付方案',
        text: '针对北美B端客户及开发商，品爱在美国西海岸洛杉矶与东海岸新泽西设立合作海外仓，常年储备核心五金配件（Blum铰链、滑轨、调节脚、补漆膏等）。提供1:1英制CAD施工图纸深化、全英文拼装说明书及海外安装师傅远程视频技术指导服务。',
        tags: ['外贸交付: 全球交付网络', '外贸交付: FOB条款', '材质: 百隆Blum五金']
      },
      {
        title: '08. 中东海湾六国交付方案 - 耐55℃高温与沿海高盐雾防腐防潮定制',
        topic: '区域交付方案',
        text: '针对中东地区夏季50℃+极高温与波斯湾沿海高盐雾潮湿环境，品爱专项研发中东耐候柜体体系：精选多层桦木实木防水板与PUR防水封边，外露金属五金全部升级为通过96小时中性盐雾测试（NSS）的抗腐蚀五金，避免五金生锈与板材饰面发黄起泡。',
        tags: ['外贸交付: 全球交付网络', '材质: PUR防水封边', '空间: 独栋别墅']
      },
      {
        title: '09. 欧洲及澳新市场交付标准 - AS/NZS与欧标EN 13986无醛环保交付',
        topic: '区域交付方案',
        text: '面向欧盟及澳新严苛的环保与建材法规，品爱提供符合欧洲CE标准EN 13986与澳洲AS/NZS 1859标准的定制柜体。板材甲醛释放量严格控制在ENF级（≤0.025mg/m³），软包海绵及皮革均提供英国BS 5852及欧洲Crib 5阻燃防火检测报告。',
        tags: ['合规风控: 欧美CE/美标AAMA', '环保等级: ENF级无醛', '外贸交付: 全球交付网络']
      },
      {
        title: '10. 外贸长途海运集装箱抗震防潮标准与ISTA 3A跌落测试',
        topic: '外贸包装物流',
        text: '远洋海运包装执行严格的ISTA 3A防护标准：所有板件采用20mm高密EPE珍珠棉六面包裹+高强加厚纸护角，玻璃门与奢石台面定制免熏蒸多层板胶合木箱（OSB木架）全密封固定。集装箱内布置超强吸湿氯化钙干燥棒，有效阻绝赤道海运「集装箱雨」受潮隐患。',
        tags: ['外贸交付: 打木架防震包装', '外贸交付: CIF条款', '外贸交付: FOB条款']
      },
      {
        title: '11. 全链路数字化交付系统 - 从海外CAD图纸锁定到装柜出运',
        topic: '工程交付管理',
        text: '品爱搭建全链路数字化外贸交付管控体系：1. 客户户型图及BOQ清单3D拆单建模；2. 32mm系统公差校核与五金打孔数据生成；3. 生产线MES实时排产监控；4. 出厂前100%试装预拼与高清验货实拍；5. 3D集装箱装载模拟（CBM装柜优化率超92%）。',
        tags: ['外贸交付: 德国豪迈智造', '外贸交付: 全球交付网络']
      },
      {
        title: '12. 售后质保体系与全球服务承诺 - 柜体5年保修与核心五金终身质保',
        topic: '售后质保承诺',
        text: '品爱郑重承诺：所有外贸出口全屋定制柜体提供5年结构性质量保证；进口合作五金（Blum百隆、海蒂诗Hettich、萨利切Salice）提供终身质量保障。如遇海外海运破损或现场尺寸缺件，启动「绿色快速补单通道」，DHL/FedEx国际航空快递最快48小时内从工厂发出补发配件。',
        tags: ['外贸交付: FOB条款', '材质: 百隆Blum五金', '外贸交付: 全球交付网络']
      }
    ];

    // 2. Specific predefined chunks for Smart Factory (KB-BRAND-02)
    const factoryChunks: Array<{ title: string; topic: string; text: string; tags: string[] }> = [
      {
        title: '01. 工业4.0智能制造基地总览与数控车间规划',
        topic: '工厂规划与智造',
        text: '品爱工业4.0智能制造生产基地建筑面积12万平方米，布局有全自动数控开料区、激光封边工作站、智能立体板件库与总装检测线。全面实现从CAD/CAM设计拆单到数控机床代码直通，减少95%人工干预错误。',
        tags: ['外贸交付: 德国豪迈智造', '材质: 激光无缝封边']
      },
      {
        title: '02. 德国豪迈HOMAG柔性数控切割开料中心（公差±0.3mm）',
        topic: '数控开料工法',
        text: '开料中心采用德国豪迈（HOMAG）重型数控下料机床，配备金刚石锯片与高精度自动对刀系统。开料尺寸精度达到±0.3mm，对角线公差≤0.5mm，切口边缘平整光洁无崩边，为后续高品质封边奠定基础。',
        tags: ['外贸交付: 德国豪迈智造', '环保等级: ENF级无醛']
      },
      {
        title: '03. 德国瑞好REHAU激光无缝封边系统与零胶线防水工艺',
        topic: '激光封边工艺',
        text: '引进德国瑞好（REHAU）光聚合激光封边机，利用高能激光束瞬间激活封边条背面的功能聚合物涂层，实现板材与封边带的分子级无缝融合。彻底解决传统EVA胶线发黑、脱胶与甲醛释放问题，耐温性能可达-40℃至120℃。',
        tags: ['材质: 激光无缝封边', '合规风控: CARB P2认证']
      },
      {
        title: '04. 6条全自动智能封边加工中心与PUR反应型聚氨酯防水胶',
        topic: '封边胶水与防水',
        text: '常规柜体采用德国豪迈全自动封边机搭配PUR（Polyurethane Reactive）反应型湿气固化聚氨酯胶水。胶线厚度严格控制在0.05mm以内，胶水固化后具备不可逆的耐水抗湿特性，经受海外沿海极端潮湿环境不开裂。',
        tags: ['材质: PUR防水封边', '外贸交付: 打木架防震包装']
      },
      {
        title: '05. 智能立体板件分拣与自动化立体仓储系统（AS/RS）',
        topic: '立体仓储分拣',
        text: '车间配备自动化立体板件缓存仓储系统，开料及封边后的板件自动贴付专属二维码，通过智能穿梭机器人（RGV）自动送入立体库位暂存。按订单一键分拣下线，杜绝跨房间板件混包与漏发。',
        tags: ['外贸交付: 德国豪迈智造', '外贸交付: 全球交付网络']
      },
      {
        title: '06. CAD/CAM一键直通生产机床与日均1500套柔性产能',
        topic: '产能与排产调度',
        text: '打通云端3D设计软件（TopSolid/IMOS）与车间MES控制系统，图纸锁定后自动解析五金孔位、槽位与开料排版图。日均标准柜体单元产能达1500套，旺季大批量工程订单交期稳定在25-30天。',
        tags: ['外贸交付: 德国豪迈智造', '外贸交付: FOB条款']
      }
    ];

    // 3. Predefined chunks for Cabinet Standard (KB-CABINET-01)
    const cabinetStdChunks: Array<{ title: string; topic: string; text: string; tags: string[] }> = [
      {
        title: '01. 出口美欧全屋定制家具通用技术规格与合规强制要求',
        topic: '美欧出口标准',
        text: '出口北美及欧盟的所有定制柜体（橱柜、衣柜、浴室柜）必须严格执行本规范。涵盖板材基材环保等级、柜体承重力学结构、五金配置标准、表面耐磨耐划指标以及出运包装防震防潮要求。',
        tags: ['空间: 步入式衣帽间', '环保等级: E0级环保', '合规风控: CARB P2认证']
      },
      {
        title: '02. 环保等级强制指标：美国加州CARB Phase 2与EPA TSCA Title VI',
        topic: '环保与认证',
        text: '所有出口人造板基材甲醛释放量必须≤0.05mg/m³，出货批次均须随附第三方公证行（SGS/Intertek）出具的CARB Phase 2认证证书与EPA TSCA Title VI合规标签，确保顺利通过美国海关清关。',
        tags: ['合规风控: CARB P2认证', '环保等级: E0级环保']
      },
      {
        title: '03. 18mm多层实木板与马尾松颗粒板力学性能与应用分配',
        topic: '板材选型与规格',
        text: '柜体侧板、顶底板及活动层板标准厚度为18mm（禁用15mm/16mm薄板）。卫生间及沿海高湿地区强制采用18mm多层桦木防水夹板；干燥地区衣柜采用E0级马尾松实木颗粒板以获得极高握钉力与平整度。',
        tags: ['材质: 多层实木板', '环保等级: E0级环保']
      },
      {
        title: '04. 柜体背板5mm/9mm双面贴面与插槽固定工法',
        topic: '柜体结构工艺',
        text: '柜体背板标配9mm双面三聚氰胺贴面高密板，采用背板四周开槽（槽深5mm、距后沿10mm）内嵌式结构，并配合背板螺丝与角码双重加固，确保柜体方正度与抗剪切变形能力提升40%。',
        tags: ['空间: 步入式衣帽间', '材质: 百隆Blum五金']
      },
      {
        title: '05. DTC/Blum百隆阻尼滑轨与集成缓冲铰链安装模数',
        topic: '五金配置标准',
        text: '门铰链标配奥地利Blum集成快装阻尼铰链或DTC高端重载铰链，开合测试≥200,000次；抽屉滑轨标配三节同步阻尼隐藏底装导轨（额定静音承重35kg-50kg），所有暴露孔位须配备ABS隐藏防尘盖。',
        tags: ['材质: 百隆Blum五金', '外贸交付: FOB条款']
      },
      {
        title: '06. 32mm系统加工孔距与海外标准化快速拼装规范',
        topic: '拼装与模数',
        text: '加工中心在柜体侧板精准打出32mm模数排孔（层板孔径5mm，三合一连接件孔径15mm/8mm）。海外现场安装师傅无需现场二次打孔，单名工人依据编号装配图在30分钟内即可完成单套柜体拼装。',
        tags: ['空间: 步入式衣帽间', '外贸交付: 全球交付网络']
      }
    ];

    // Predefined style chunks (already robust)
    const predefinedStyleChunks = [
      {
        title: '01. 全屋定制外贸出海总览与六大风格体系定位',
        topic: '风格体系',
        text: '针对不同国家客户偏好提炼的风格套系总纲：北美市场青睐现代过渡风（Transitional）与美式实木模压；中东及希腊沿海青睐地中海浪漫拱形与蓝白暖调；欧洲及澳新偏爱北欧原木与意式极简无把手设计。外贸全屋定制六大风格覆盖玄关、客餐厅、中西厨、主卧衣帽间及全卫一体化设计。',
        tags: ['风格: 现代简约', '风格: 地中海', '外贸交付: FOB条款']
      },
      {
        title: '02. 地中海风格 (Mediterranean Style) - 空间哲学与色彩搭配',
        topic: '地中海风格',
        text: '地中海风格核心元素包括经典连续半圆拱门、马蹄形拱券门套、蓝白撞色与暖米黄砂岩质感。柜体表面推荐采用哑光柔焦烤漆（光泽度<5°），搭配天然海蓝石英石台面与手作陶土色粗陶拉手。适用中东沙特、阿联酋独栋海景别墅及希腊爱琴海度假公寓。',
        tags: ['风格: 地中海', '色系: 暖色调', '空间: 独栋别墅']
      },
      {
        title: '03. 现代简约风格 (Modern Minimalist) - 极简线条与平嵌美学',
        topic: '现代简约',
        text: '现代简约风格主张「Less is More」平嵌一体化。柜门采用通顶一门到顶设计（高度可达2.8m，内置德国进口拉直器），全隐藏式免拉手（45度斜切倒角内嵌铝合金J型/G型拉手）。色彩以大地暖灰（Cashmere Grey）、冷炭黑与纯白为基底，线条干练纯粹。',
        tags: ['风格: 现代简约', '色系: 经典黑白灰', '材质: 爱格板(EGGER)']
      },
      {
        title: '04. 意式极简高定 (Italian Minimalism) - 高定轻奢材质碰撞',
        topic: '意式极简',
        text: '意式极简高定系列精选进口爱格板、意大利超哑肤感PET板、碳纤维铝框黑玻门与透光奢石。柜体背板标配9mm双面贴皮三聚氰胺板或真皮格纹包覆。层板采用超薄8mm铝合金发光层板，上下双向漫反射透光，呈现米兰顶级家具展高奢通透感。',
        tags: ['风格: 意式极简', '材质: 碳晶木饰面', '材质: 超哑肤感PET']
      },
      {
        title: '05. 法式轻奢复古 (French Luxury) - 优雅线条与精致雕花',
        topic: '法式轻奢',
        text: '法式复古风格融合巴黎古典公馆建筑元素：精致石膏雕花线、法式双开大门、高腰护墙板与鱼骨拼天然橡木地板。柜门采用高精度数控雕刻成型实木多层烤漆板，搭配法式哑光黄铜手工雕花把手与水滴形钥匙孔五金件，散发浓郁法式浪漫艺术气息。',
        tags: ['风格: 极简轻奢', '色系: 暖色调', '空间: 独栋别墅']
      },
      {
        title: '06. 新中式禅意定制 (Neo-Chinese Zen) - 榫卯意境与东方美学',
        topic: '新中式',
        text: '新中式定制遵循「天圆地方、虚实相生」东方哲学。精选北美黑胡桃木、缅甸花梨木皮与水墨雪花白天然大理石。柜门运用现代激光金属拉丝格栅与局部透光绢布夹丝玻璃，拉手采用圆形对扣合璧式铜锁拉手，将传统榫卯工艺与现代收纳模数完美融合。',
        tags: ['风格: 东方禅意', '材质: 多层实木板', '色系: 暖色调']
      },
      {
        title: '07. 美式田园与过渡风 (Transitional & American Classic) - 质朴温馨',
        topic: '美式田园',
        text: '美式过渡风融合传统美式宽厚实木框线与现代平实线条。门板精选北美红橡木/白蜡木开放漆工艺（保留天然木孔纹理）或哑光奶咖色吸塑模压。衣柜内部设置多层抽屉式储物篮、专属美式领带架与带锁安全密码保险箱，强调舒适实用与耐用承重。',
        tags: ['风格: 美式过渡', '环保等级: E0级环保', '空间: 步入式衣帽间']
      }
    ];

    // Determine base specialized source & topic list for any article
    let specializedChunks: Array<{ title: string; topic: string; text: string; tags: string[] }> = [];
    let subCategoryTopics: string[] = [];

    if (isBrandHistoryArticle) {
      specializedChunks = brandHistoryChunks;
      subCategoryTopics = [
        '品牌发展历程',
        '智能智造基地',
        '全球外贸网络',
        '国际资质认证',
        '区域交付方案',
        '工程交付实绩',
        '外贸包装物流',
        '工程交付管理',
        '售后质保承诺'
      ];
    } else if (isBrandFactoryArticle) {
      specializedChunks = factoryChunks;
      subCategoryTopics = ['工厂规划与智造', '数控开料工法', '激光封边工艺', '封边胶水与防水', '立体仓储分拣', '产能与排产调度'];
    } else if (isCabinetStdArticle) {
      specializedChunks = cabinetStdChunks;
      subCategoryTopics = ['美欧出口标准', '环保与认证', '板材选型与规格', '柜体结构工艺', '五金配置标准', '拼装与模数'];
    } else if (isStyleComboArticle) {
      specializedChunks = predefinedStyleChunks;
      subCategoryTopics = ['风格体系', '地中海风格', '现代简约', '意式极简', '法式轻奢', '新中式', '美式田园', '材料与工艺', '五金配件', '出海交付'];
    } else {
      // General dynamic generator tailored to the article's own title, content, category, and tags
      const catLeaf = article.category.split('/').pop()?.trim() || '定制技术';
      subCategoryTopics = [
        `${catLeaf}总则`,
        '核心材料与物理性能',
        '数控加工与结构工法',
        '国际环保与合规检测',
        '五金系统与模数标准',
        '长途海运与防震包装',
        '海外工程案例实绩',
        '常见买家高频问答'
      ];
    }

    // Build the array of chunks up to targetCount
    const chunks: SemanticChunk[] = [];

    for (let i = 0; i < targetCount; i++) {
      let chunkData: { title: string; topic: string; text: string; tags: string[] };

      if (i < specializedChunks.length) {
        chunkData = specializedChunks[i];
      } else {
        // Generate article-specific granular chapter slice
        const curTopic = subCategoryTopics[i % subCategoryTopics.length];
        const sliceNum = String(i + 1).padStart(2, '0');

        // Detailed article-specific sub-topics & text generator
        let sectionText = '';
        if (isBrandHistoryArticle) {
          const milestones = [
            '2008-2011年：品爱家居正式创办，设立首个外贸定制出口研发中心，首批订单成功交付东南亚新加坡与马来西亚海景公寓。',
            '2012-2015年：全面进军北美市场，通过美国加州CARB Phase 2环保认证，在加州建立首个售后备件海外仓与技术对接点。',
            '2016-2018年：引进德国豪迈（HOMAG）智能加工中心与瑞好激光封边系统，全面升级佛山智能制造生产线，日产能提升300%。',
            '2019-2021年：开拓中东海湾六国高定市场，成功中标迪拜棕榈岛豪宅工程与沙特利雅得高档精装公寓项目，研发耐高温防腐柜体体系。',
            '2022-2024年：启动工业4.0二期12万平智能制造产业园，全面部署MES数字化生产管控与全自动立体板件分拣仓储（AS/RS）。',
            '2025-2026年：全球交付网络突破100+国家和地区，累计服务海内外50,000+标杆项目，确立全球外贸全屋定制领军品牌地位。',
            '外贸工程全生命周期管控：从客户初始CAD建筑图纸拆解、32mm系统模数生成、数控排产至装柜出海海运提单追踪，全程可视化交付。',
            '集装箱装载容积深度优化：利用自主3D集装箱装柜排布算法（装载率超92%），大幅摊薄单方平米远洋海运运费，助力海外买家降本增效。',
            '全球售后快速响应机制：依托覆盖全球各时区的专属外贸客服与工程支持团队，如遇海运缺件提供DHL/FedEx国际航空快递48小时急速补发。'
          ];
          const mText = milestones[i % milestones.length];
          chunkData = {
            title: `${sliceNum}. ${curTopic} - ${mText.split('：')[0]}`,
            topic: curTopic,
            text: `【${cleanTitle}】切片索引 #${i + 1}：${mText} 本章节详细记录了品爱家居在「${curTopic}」维度的执行标准与落地成效，确保全球B端工程客户与独立豪宅买家享受高标准的外贸全案定制体验。`,
            tags: article.tags || ['外贸交付: 全球交付网络', '外贸交付: 德国豪迈智造']
          };
        } else if (isBrandFactoryArticle) {
          chunkData = {
            title: `${sliceNum}. ${curTopic} - 智能车间技术参数深化 #${i + 1}`,
            topic: curTopic,
            text: `【${cleanTitle}】切片索引 #${i + 1}：详述品爱工业4.0基地在「${curTopic}」的核心技术实现。通过德国豪迈全自动机床与MES系统指令直通，将每块板材的开料与封边公差严控在±0.3mm内，确保外贸柜体拼装严丝合缝。`,
            tags: article.tags || ['外贸交付: 德国豪迈智造', '材质: 激光无缝封边']
          };
        } else if (isCabinetStdArticle) {
          chunkData = {
            title: `${sliceNum}. ${curTopic} - 美欧出口工艺执行细则 #${i + 1}`,
            topic: curTopic,
            text: `【${cleanTitle}】切片索引 #${i + 1}：详述美欧外贸全屋定制在「${curTopic}」的强制工程标准。所有出口柜体选用E0级合规基材，符合CARB P2与EPA TSCA Title VI认证，确保海外买家清关无阻与环保居住安全。`,
            tags: article.tags || ['空间: 步入式衣帽间', '环保等级: E0级环保']
          };
        } else {
          // Dynamic chunk for any other article
          chunkData = {
            title: `${sliceNum}. ${curTopic} - ${cleanTitle} 细分章节 #${i + 1}`,
            topic: curTopic,
            text: `【${cleanTitle}】切片索引 #${i + 1}：${article.content} —— 本段落基于「${curTopic}」维度，针对外贸定制的材料选型、尺寸公差、表面耐磨耐刮及长途海运抗震防潮进行了高密度向量化切片与知识点对齐。`,
            tags: article.tags || ['基础知识: 全屋定制标准']
          };
        }
      }

      // Calculate approximate tokens & char count
      const charCount = chunkData.text.length + chunkData.title.length;
      const tokenCount = Math.round(charCount * 0.62) + 48;
      const vectorHex = `vec_0x${((i * 997 + 0x4a1b) % 0xffffff).toString(16).padStart(6, '0')}`;

      chunks.push({
        id: `CHUNK-${article.id || 'ART'}-${String(i + 1).padStart(3, '0')}`,
        chunkIndex: i + 1,
        sectionTitle: chunkData.title,
        topic: chunkData.topic,
        text: chunkData.text,
        tokenCount,
        charCount,
        vectorId: vectorHex,
        embeddingModel: 'text-embedding-3-large (3072维)',
        tags: chunkData.tags,
        lastIndexedAt: nowStr
      });
    }

    return chunks;
  }, [article]);

  // Dynamic suggested search queries tailored to the currently opened article
  const dynamicSearchPlaceholder = useMemo(() => {
    if (!article) return '输入问题或关键词测试语义召回...';
    
    if (article.id === 'KB-BRAND-01' || article.code.includes('BRAND-2026-01') || article.title.includes('发展历程')) {
      return '输入当前文档关键词或问题测试召回 (如：2008发展历程、12万平基地、德国豪迈HOMAG、全球100国、ISO9001认证、北美交付、长途海运防潮)...';
    }
    if (article.id === 'KB-BRAND-02' || article.code.includes('BRAND-2026-02') || article.title.includes('工业4.0')) {
      return '输入当前文档关键词或问题测试召回 (如：德国豪迈HOMAG、激光无缝封边、公差±0.3mm、立体仓储、CAD/CAM直通、日均1500套产能)...';
    }
    if (article.id === 'KB-SERIES-01' || article.code.includes('MILAN')) {
      return '输入当前文档关键词或问题测试召回 (如：极窄铝框玻璃门、45度免拉手、准分子肤感烤漆、中西岛台厨柜、通顶衣帽间、百隆乐居抽)...';
    }
    if (article.id === 'KB-CABINET-01' || article.code.includes('FUR-2026-01')) {
      return '输入当前文档关键词或问题测试召回 (如：E0级环保、CARB Phase 2认证、18mm柜体结构、9mm背板、Blum阻尼滑轨、防尘盖规范)...';
    }
    if (article.id === 'KB-WINDOW-01' || article.code.includes('WIN')) {
      return '输入当前文档关键词或问题测试召回 (如：6063-T6原生铝材、PA66隔热条、欧标CE认证、美标AAMA检测、9级抗风压、K值1.2)...';
    }
    if (article.id === 'KB-BRAND-HARDWARE-01' || article.code.includes('BLUM')) {
      return '输入当前文档关键词或问题测试召回 (如：奥地利百隆Blum、海蒂诗Hettich、萨利切Salice、20万次开合寿命、20年质保承诺)...';
    }
    if (article.id === 'KB-BRAND-PANEL-02' || article.code.includes('EGGER')) {
      return '输入当前文档关键词或问题测试召回 (如：爱格板EGGER、克诺斯邦、欧洲F4星认证、W1000纯白、H3303橡木、2.8米一门到顶)...';
    }
    if (article.id === 'KB-BATH-01' || article.code.includes('BATH')) {
      return '输入当前文档关键词或问题测试召回 (如：多层防水桦木板、PUR防水封边、智能除雾镜柜、12mm一体烧结岩板台盆、U型下水避让)...';
    }
    if (article.id === 'KB-SMART-01' || article.code.includes('SMART')) {
      return '输入当前文档关键词或问题测试召回 (如：COB无点光线型灯、Zigbee协议、微波雷达感应、电动升降吊柜、弱电隐藏走线)...';
    }
    if (article.id === 'KB-TIER-01' || article.code.includes('TIER')) {
      return '输入当前文档关键词或问题测试召回 (如：经济型Standard、舒适型Premium、奢华型Luxury、单方平米造价、材料梯队配置)...';
    }
    if (article.id === 'KB-STYLE-COMBO-01' || article.code.includes('COMBO-STYLE')) {
      return '输入当前文档关键词或问题测试召回 (如：地中海风格、现代极简、意式高定、法式复古、新中式、美式过渡、PUR封边、模数标准)...';
    }

    const tagSample = article.tags ? article.tags.map((t) => t.split(':')[1]?.trim() || t).slice(0, 3).join('、') : '';
    return `输入当前文档关键词或问题测试语义召回 (如：${tagSample || '核心技术参数、材料工艺、环保认证、交付规范'})...`;
  }, [article]);

  // Topic filter options
  const chunkTopics = useMemo(() => {
    const set = new Set<string>();
    baseSemanticChunks.forEach((c) => {
      if (c.topic) set.add(c.topic);
    });
    return Array.from(set);
  }, [baseSemanticChunks]);

  // Filtered & Searched chunks with calculated similarity scores
  const displayedChunks = useMemo(() => {
    let list = [...baseSemanticChunks];

    // Topic Filter
    if (selectedChunkTopic !== 'all') {
      list = list.filter((c) => c.topic === selectedChunkTopic);
    }

    // Search Query Simulator
    if (vectorSearchQuery.trim()) {
      const q = vectorSearchQuery.toLowerCase().trim();
      list = list
        .map((c) => {
          let score = 0.55;
          const inTitle = c.sectionTitle.toLowerCase().includes(q);
          const inText = c.text.toLowerCase().includes(q);
          const inTopic = c.topic.toLowerCase().includes(q);
          const inTags = c.tags.some((t) => t.toLowerCase().includes(q));

          if (inTitle) score += 0.32;
          if (inText) score += 0.28;
          if (inTopic) score += 0.15;
          if (inTags) score += 0.2;

          // Add slight hash variation for realistic RAG ranking
          const hashVar = ((c.chunkIndex * 37) % 15) / 1000;
          const finalScore = Math.min(0.985, +(score + hashVar).toFixed(3));

          return {
            ...c,
            similarityScore: inTitle || inText || inTopic || inTags ? finalScore : +(0.42 + hashVar).toFixed(3)
          };
        })
        .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));
    }

    return list;
  }, [baseSemanticChunks, selectedChunkTopic, vectorSearchQuery]);

  // Handle re-vectorize single chunk
  const handleRevectorizeSingleChunk = (chunk: SemanticChunk) => {
    setRevectorizingChunkId(chunk.id);
    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      setReindexedTimeMap((prev) => ({ ...prev, [chunk.id]: now }));
      setRevectorizingChunkId(null);
      onShowToast(`✅ 切片「#${chunk.chunkIndex}」已通过 text-embedding-3-large 重新生成 3072 维密集向量索引`);
    }, 900);
  };

  // Handle re-vectorize all
  const handleRevectorizeAll = () => {
    setIsRevectorizingAll(true);
    setTimeout(() => {
      setIsRevectorizingAll(false);
      onShowToast(`🎉 全量 ${baseSemanticChunks.length} 个切片向量重构成功！索引库已同步刷新`);
    }, 1400);
  };

  // Handle copy single chunk
  const handleCopyChunk = (chunk: SemanticChunk) => {
    const copyText = `【切片 #${chunk.chunkIndex}】${chunk.sectionTitle}\n归属主题: ${chunk.topic} | 向量ID: ${chunk.vectorId}\n正文内容:\n${chunk.text}`;
    navigator.clipboard.writeText(copyText);
    setCopiedChunkId(chunk.id);
    onShowToast(`已复制切片 #${chunk.chunkIndex} 文本至剪贴板`);
    setTimeout(() => setCopiedChunkId(null), 2000);
  };

  // Handle toggle expand chunk
  const handleToggleExpandChunk = (chunkId: string) => {
    setExpandedChunkIds((prev) => {
      const next = new Set(prev);
      if (next.has(chunkId)) {
        next.delete(chunkId);
      } else {
        next.add(chunkId);
      }
      return next;
    });
  };

  // Total tokens calculated
  const totalTokens = useMemo(() => {
    return baseSemanticChunks.reduce((acc, cur) => acc + cur.tokenCount, 0);
  }, [baseSemanticChunks]);

  const handleCopyContent = () => {
    if (!article) return;
    navigator.clipboard.writeText(article.content || '');
    setCopiedContent(true);
    onShowToast('知识库正文已成功复制到剪贴板');
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const handleExecuteRollback = (log: KBAuditLog) => {
    if (onRollback && article) {
      onRollback(article, log);
      setRollbackConfirmLog(null);
    }
  };

  // Compile full version list available for side-by-side diff comparison
  const versionOptions: VersionOption[] = useMemo(() => {
    if (!article) return [];

    const list: VersionOption[] = [];

    // Current State Option (本次待复核版本 / 当前实时最新)
    const isUnderReview = article.status === '等待复核';
    list.push({
      id: 'current',
      version: `${article.pendingVersion || article.version} (${isUnderReview ? '本次待复核版本' : '当前状态'})`,
      label: isUnderReview ? '本次待复核新版本' : '当前实时编辑状态',
      timestamp: article.updatedAt || '实时最新',
      operator: article.author || '当前登录用户',
      operatorRole: '作者/提审人',
      wasPublished: article.status === '已发布',
      status: article.status,
      title: article.title,
      category: article.category,
      tags: article.tags || [],
      content: article.content || ''
    });

    // Add versions from auditLogs
    if (article.auditLogs && article.auditLogs.length > 0) {
      article.auditLogs.forEach((log) => {
        // From afterSnapshot
        if (log.afterSnapshot && log.afterSnapshot.content) {
          list.push({
            id: `${log.id}-after`,
            version: `${log.afterSnapshot.version || log.version} (${log.wasPublished ? '已发布' : log.actionLabel})`,
            label: `${log.actionLabel} - 操作后快照`,
            timestamp: log.timestamp,
            operator: log.operator,
            operatorRole: log.operatorRole,
            wasPublished: log.wasPublished,
            status: log.afterSnapshot.status || log.actionLabel,
            title: log.afterSnapshot.title || article.title,
            category: log.afterSnapshot.category || article.category,
            tags: log.afterSnapshot.tags || article.tags || [],
            content: log.afterSnapshot.content || '',
            log: log
          });
        }

        // From beforeSnapshot (修改前基线快照 / 原已生效版本)
        if (log.beforeSnapshot && log.beforeSnapshot.content) {
          list.push({
            id: `${log.id}-before`,
            version: `${log.beforeSnapshot.version || '基线版本'} (修改前线上原状)`,
            label: `${log.actionLabel} - 修改前原已生效版本`,
            timestamp: log.timestamp,
            operator: log.operator,
            operatorRole: log.operatorRole,
            wasPublished: true,
            status: log.beforeSnapshot.status || '已发布',
            title: log.beforeSnapshot.title || article.title,
            category: log.beforeSnapshot.category || article.category,
            tags: log.beforeSnapshot.tags || article.tags || [],
            content: log.beforeSnapshot.content || '',
            log: log
          });
        }
      });
    }

    // If this is a newly created article with no published history
    const hasPublishedVersion = article.wasPublished || list.some((v) => v.wasPublished && v.id !== 'current');
    if (!hasPublishedVersion && article.status === '等待复核') {
      list.push({
        id: 'empty-baseline',
        version: '（无已发布历史版本）',
        label: '首次新建条目 - 无历史版本',
        timestamp: '未发布',
        operator: '系统初始',
        operatorRole: '空基线',
        wasPublished: false,
        status: '未发布',
        title: '（无历史版本）',
        category: article.category,
        tags: [],
        content: ''
      });
    }

    // Default fallback baseline if no snapshots and has wasPublished
    if (list.length === 1 && (article.wasPublished || article.status === '已发布')) {
      list.push({
        id: 'v1.0.0-initial',
        version: 'v1.0.0 (线上已发布基线)',
        label: '线上已发布生效版本',
        timestamp: '2026-07-01 09:00',
        operator: 'System Admin',
        operatorRole: '系统已发布',
        wasPublished: true,
        status: '已发布',
        title: article.title,
        category: article.category,
        tags: (article.tags || []).slice(0, 2),
        content: `【线上已发布基线版本】\n${article.title}\n\n${article.content || '基础定制技术规格与参数说明。'}`
      });
    }

    return list;
  }, [article]);

  // Set default left & right comparison versions (Left: 已发布版本 / 基线; Right: 本次复核版本)
  const effectiveLeftVersionId = useMemo(() => {
    if (selectedLeftVersionId && versionOptions.some((v) => v.id === selectedLeftVersionId)) {
      return selectedLeftVersionId;
    }
    // In review mode, prioritize the published baseline or older snapshot for left side
    const publishedOption = versionOptions.find((v) => v.id !== 'current' && (v.wasPublished || v.id.includes('before')));
    if (publishedOption) {
      return publishedOption.id;
    }
    const emptyOption = versionOptions.find((v) => v.id === 'empty-baseline');
    if (emptyOption) {
      return emptyOption.id;
    }
    if (versionOptions.length > 1) {
      return versionOptions[versionOptions.length - 1].id;
    }
    return versionOptions[0]?.id || 'current';
  }, [selectedLeftVersionId, versionOptions]);

  const effectiveRightVersionId = useMemo(() => {
    if (selectedRightVersionId && versionOptions.some((v) => v.id === selectedRightVersionId)) {
      return selectedRightVersionId;
    }
    // Default right to current (本次待复核版本)
    return versionOptions[0]?.id || 'current';
  }, [selectedRightVersionId, versionOptions]);

  // Diff summary stats for the badge in review mode
  const reviewDiffSummary = useMemo(() => {
    const leftItem = versionOptions.find((v) => v.id === effectiveLeftVersionId) || versionOptions[0];
    const rightItem = versionOptions.find((v) => v.id === effectiveRightVersionId) || versionOptions[0];
    if (!leftItem || !rightItem) return { hasChanges: false, changesCount: 0, isNew: false };

    const isNew = leftItem.id === 'empty-baseline' || !leftItem.content;
    const isTitleDiff = (leftItem.title || '') !== (rightItem.title || '');
    const isCategoryDiff = (leftItem.category || '') !== (rightItem.category || '');
    const isContentDiff = (leftItem.content || '') !== (rightItem.content || '');
    const leftTags = leftItem.tags || [];
    const rightTags = rightItem.tags || [];
    const isTagsDiff = leftTags.length !== rightTags.length || leftTags.some(t => !rightTags.includes(t));

    let count = 0;
    if (isTitleDiff) count++;
    if (isCategoryDiff) count++;
    if (isContentDiff) count++;
    if (isTagsDiff) count++;

    return {
      hasChanges: count > 0 || isNew,
      changesCount: isNew ? 'NEW' : count,
      isNew,
      isTitleDiff,
      isCategoryDiff,
      isContentDiff,
      isTagsDiff,
      leftItem,
      rightItem
    };
  }, [effectiveLeftVersionId, effectiveRightVersionId, versionOptions]);

  const handleRollbackToVersionOption = (targetOption: VersionOption) => {
    if (targetOption.log) {
      setRollbackConfirmLog(targetOption.log);
    } else {
      // Synthetic log for direct rollback
      const syntheticLog: KBAuditLog = {
        id: `ROLLBACK-DIRECT-${Date.now()}`,
        articleId: article.id,
        operator: 'Current User',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: 'rollback',
        actionLabel: `回滚至版本 ${targetOption.version}`,
        version: targetOption.version.split(' ')[0],
        wasPublished: targetOption.wasPublished || false,
        diffSummary: `通过双栏Diff对比视图直接回滚至快照: ${targetOption.label}`,
        afterSnapshot: {
          title: targetOption.title,
          content: targetOption.content,
          category: targetOption.category,
          tags: targetOption.tags,
          version: targetOption.version.split(' ')[0],
          status: targetOption.status
        }
      };
      setRollbackConfirmLog(syntheticLog);
    }
  };

  // Helper to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case '已发布':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> 已发布
          </span>
        );
      case '等待复核':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> 等待复核
          </span>
        );
      case '草稿':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <FileCode className="w-3.5 h-3.5" /> 草稿
          </span>
        );
      case '复核不通过':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> 复核不通过
          </span>
        );
      case '失效':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <AlertCircle className="w-3.5 h-3.5" /> 已失效
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getFileTypeBadge = () => {
    if (!article) return null;
    if (article.fileType === 'VIDEO' || article.contentType === 'video') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
          <Video className="w-3.5 h-3.5" /> 视频实操录像
        </span>
      );
    }
    if (article.fileType === 'PPTX') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <Presentation className="w-3.5 h-3.5" /> PPT 演示文稿
        </span>
      );
    }
    if (article.fileType === 'PDF') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/80">
          <FileText className="w-3.5 h-3.5" /> PDF 认证手册
        </span>
      );
    }
    if (article.fileType === 'DOCX') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
          <FileText className="w-3.5 h-3.5" /> Word 规范文档
        </span>
      );
    }
    if (article.fileType === 'XLSX') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <FileSpreadsheet className="w-3.5 h-3.5" /> Excel 表格
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
        <FileCode className="w-3.5 h-3.5" /> Markdown 条款
      </span>
    );
  };

  // Helper to render markdown content with clean visual typography
  const renderFormattedMarkdown = (raw: string) => {
    if (!raw) return <p className="text-slate-400 italic">暂无正文内容</p>;

    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableKey = 0;

    const flushTable = () => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const rows = tableRows.slice(1);
        elements.push(
          <div key={`table-${tableKey++}`} className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                  {header.map((col, idx) => (
                    <th key={idx} className="p-3 whitespace-nowrap">
                      {col.replace(/\*\*/g, '').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 leading-relaxed">
                        {cell.includes('**') ? (
                          <span className="font-bold text-slate-900">{cell.replace(/\*\*/g, '').trim()}</span>
                        ) : (
                          cell.trim()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
      inTable = false;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Table line detect
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (trimmed.includes('---')) {
          // delimiter line, ignore
          return;
        }
        const cells = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        inTable = true;
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable();
      }

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="text-lg font-bold text-slate-900 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4.5 rounded-full bg-[#EA3A20] inline-block" />
            {trimmed.replace('# ', '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={idx} className="text-sm font-bold text-slate-800 pt-4 pb-1.5 flex items-center gap-2 text-slate-900">
            <span className="w-1 h-3.5 rounded-full bg-slate-400 inline-block" />
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-xs font-bold text-slate-700 pt-3 pb-1">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.slice(2);
        elements.push(
          <div key={idx} className="flex items-start gap-2 py-0.5 text-xs text-slate-700 leading-relaxed pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span className="flex-1">
              {itemText.split('**').map((part, pIdx) =>
                pIdx % 2 === 1 ? (
                  <strong key={pIdx} className="font-semibold text-slate-900">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </span>
          </div>
        );
      } else if (trimmed === '') {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-slate-700 leading-relaxed py-0.5">
            {trimmed.split('**').map((part, pIdx) =>
              pIdx % 2 === 1 ? (
                <strong key={pIdx} className="font-semibold text-slate-900">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable();
    }

    return elements;
  };

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* ========================================================================= */}
        {/* 1. HEADER: Compact, Clean, Visual Anchor */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Category Breadcrumb & Meta Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs mb-1.5">
                <span className="font-mono font-bold text-[11px] text-[#EA3A20] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                  {article.code}
                </span>
                <span className="font-mono text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold">
                  {article.version}
                </span>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate max-w-[320px]">{article.category}</span>
                </div>
              </div>

              {/* Title with prominent typography */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
                {article.title}
              </h2>

              {/* Author & Update Time Strip */}
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-4.5 h-4.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                    {(article.author || '管')[0]}
                  </span>
                  <span>{article.author}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>更新于 {article.updatedAt}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>已就绪 ({article.chunksCount || 32} 切片)</span>
                </span>
                {article.viewCount !== undefined && (
                  <span className="text-slate-400">
                    浏览量: <strong className="text-slate-600 font-semibold">{article.viewCount}</strong> 次
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
              title="关闭抽屉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation Switches */}
          <div className="mt-4 pt-2">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-2xs">
              {isReviewMode ? (
                <>
                  {/* REVIEW MODE TAB 1: Diff 对比 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('diff')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'diff'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        activeTab === 'diff' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      1
                    </span>
                    <span className="truncate">Diff 对比</span>
                    {reviewDiffSummary.hasChanges && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 transition-colors ${
                          activeTab === 'diff' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {reviewDiffSummary.changesCount}
                      </span>
                    )}
                  </button>

                  {/* REVIEW MODE TAB 2: 知识正文与多媒体 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'content'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        activeTab === 'content' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      2
                    </span>
                    <span className="truncate">知识正文与多媒体</span>
                  </button>

                  {/* REVIEW MODE TAB 3: 业务属性 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('attributes')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'attributes'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        activeTab === 'attributes' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      3
                    </span>
                    <span className="truncate">业务属性</span>
                  </button>

                  {/* REVIEW MODE TAB 4: AI 语义切片 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('vectors')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'vectors'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        activeTab === 'vectors' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      4
                    </span>
                    <span className="truncate">AI 语义切片</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 transition-colors ${
                        activeTab === 'vectors' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {article.chunksCount || 32}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  {/* STANDARD MODE TAB 1: 知识正文与多媒体 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'content'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        activeTab === 'content' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      1
                    </span>
                    <span className="truncate">知识正文与多媒体</span>
                  </button>

                  {/* STANDARD MODE TAB 2: 业务属性 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('attributes')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'attributes'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        activeTab === 'attributes' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      2
                    </span>
                    <span className="truncate">业务属性</span>
                  </button>

                  {/* STANDARD MODE TAB 3: AI 语义切片 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('vectors')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'vectors'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        activeTab === 'vectors' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      3
                    </span>
                    <span className="truncate">AI 语义切片</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 transition-colors ${
                        activeTab === 'vectors' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {article.chunksCount || 32}
                    </span>
                  </button>

                  {/* STANDARD MODE TAB 4: 变更日志与回滚 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'history'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        activeTab === 'history' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      4
                    </span>
                    <span className="truncate">变更日志与回滚</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 transition-colors ${
                        activeTab === 'history' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {article.auditLogs?.length || 1}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BODY CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs bg-slate-50/30">

          {/* TAB 0 (REVIEW MODE): Diff 对比 (显示当前复核版本 vs 已发布版本的对比) */}
          {activeTab === 'diff' && (
            <div className="space-y-5">
              {/* 1. Header Overview & Comparison Banner */}
              <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
                      <GitCompare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">版本 Diff 差异对比（复核审批）</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {reviewDiffSummary.isNew ? '新建条目首次提审' : '版本迭代修改提审'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        对比【已发布版本】与【待复核版本】，核查正文、分类与业务标签修改
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">当前复核状态:</span>
                    {renderStatusBadge(article.status)}
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                      {article.pendingVersion || article.version}
                    </span>
                  </div>
                </div>

                {/* Status Notice / Rejection Comment Banner */}
                {article.reviewComment && (
                  <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    article.status === '复核不通过'
                      ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                      : 'bg-amber-50/90 border-amber-200 text-amber-900'
                  }`}>
                    <ShieldAlert className="w-4 h-4 text-[#EA3A20] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span>管理员复核审批意见 / 驳回说明</span>
                        {article.reviewer && <span className="text-[11px] opacity-80 font-normal">审核人: {article.reviewer} · {article.reviewedAt}</span>}
                      </div>
                      <p className="mt-1 leading-relaxed">{article.reviewComment}</p>
                    </div>
                  </div>
                )}

                {/* If newly created article notice */}
                {reviewDiffSummary.isNew && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 flex items-start gap-2 text-xs">
                    <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-900">该条目为首次录入新建，尚无已发布的历史版本</p>
                      <p className="text-[11px] text-slate-600">
                        左侧展示系统初始基线，右侧展示本次提审录入的全部正文、分类、多媒体与标签规格（全量新增）。
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick Difference Metric Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-medium">线上已发布版本</span>
                    <span className="font-mono text-xs font-bold text-slate-700 block truncate mt-0.5">
                      {reviewDiffSummary.leftItem?.version || '无历史版本'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-100/90 rounded-xl border border-slate-200/90">
                    <span className="text-[10px] text-slate-500 block font-medium">本次待复核版本</span>
                    <span className="font-mono text-xs font-bold text-slate-900 block truncate mt-0.5">
                      {reviewDiffSummary.rightItem?.version || article.version}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-medium">标题与分类变更</span>
                    <span className="text-xs font-bold text-slate-700 block truncate mt-0.5">
                      {reviewDiffSummary.isTitleDiff || reviewDiffSummary.isCategoryDiff ? '存在属性调整' : '无变更（保持一致）'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-medium">标签体系差异</span>
                    <span className="text-xs font-bold text-slate-700 block truncate mt-0.5">
                      {reviewDiffSummary.isTagsDiff ? '标签已增删调整' : '标签未修改'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. DUAL COLUMN DIFF VIEWER */}
              <div className="space-y-4">
                <DualColumnDiff
                  article={article}
                  leftVersionId={effectiveLeftVersionId}
                  rightVersionId={effectiveRightVersionId}
                  onSelectLeftVersion={setSelectedLeftVersionId}
                  onSelectRightVersion={setSelectedRightVersionId}
                  versionOptions={versionOptions}
                  onRollbackToVersion={handleRollbackToVersionOption}
                  renderPairedTagBadge={renderPairedTagBadge}
                />
              </div>
            </div>
          )}

          {/* TAB 1: 知识正文与多媒体 (Core Content View) */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* IF VIDEO: Dedicated Video Preview Card */}
              {(article.fileType === 'VIDEO' || article.contentType === 'video') && (
                <div className="p-4.5 bg-slate-950 rounded-2xl text-white space-y-3.5 shadow-md border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center border border-purple-500/30">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-100">高清实操视频录像</span>
                        <p className="text-[10px] text-slate-400">{article.videoInfo?.sourceName || '工厂工艺实拍教学'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800/80 px-2.5 py-1 rounded-full font-bold">
                      时长: {article.videoInfo?.duration || '09分42秒'}
                    </span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center relative border border-slate-800">
                    <video
                      src={article.videoInfo?.url || 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-with-wooden-furniture-41487-large.mp4'}
                      controls
                      className="w-full h-full object-contain"
                      poster={article.videoInfo?.coverUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
                    />
                  </div>
                </div>
              )}

              {/* IF DOCUMENT: Attached Document Preview Box */}
              {(article.fileType === 'DOCX' || article.fileType === 'PPTX' || article.fileType === 'PDF' || article.fileType === 'XLSX' || article.contentType === 'document') && (
                <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      article.fileType === 'PPTX'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : article.fileType === 'PDF'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : article.fileType === 'XLSX'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}>
                      {article.fileType === 'PPTX' ? (
                        <Presentation className="w-6 h-6" />
                      ) : article.fileType === 'PDF' ? (
                        <FileText className="w-6 h-6" />
                      ) : article.fileType === 'XLSX' ? (
                        <FileSpreadsheet className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">
                        {article.attachmentFile?.name || article.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>大小: {article.attachmentFile?.size || article.fileSize || '6.4 MB'}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 已完成结构化解析
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onShowToast(`已为您开始下载原件「${article.title}」`)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>下载原件</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Main Content Box with Structured Markdown Styling */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                {/* Content Toolbar */}
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {article.fileType === 'VIDEO' || article.contentType === 'video' ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>视频字幕转写与智能问答依据</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <FileText className="w-3.5 h-3.5 text-[#EA3A20]" />
                        <span>知识条款正文与标准依据</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyContent}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      title="复制正文"
                    >
                      {copiedContent ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>复制正文</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Render Container */}
                <div className="p-6 text-slate-800 leading-relaxed font-sans text-xs sm:text-sm">
                  {renderFormattedMarkdown(article.content)}
                </div>
              </div>

              {/* Compact Quick Summary Footer of Key Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="p-4 bg-white border border-slate-200/70 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <TagIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>关联检索标签 ({article.tags.length})</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {article.tags.map((t, idx) => (
                      <span key={idx}>
                        {renderPairedTagBadge(t)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 业务属性与管控配置 (Attributes & Permissions View) */}
          {activeTab === 'attributes' && (
            <div className="space-y-5">
              
              {/* 1. Core Dimension Cards in Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* 适用岗位 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-500" /> 适用业务岗位
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">访问与问答权限</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {article.applicableRoles && article.applicableRoles.length > 0 ? (
                      article.applicableRoles.map((role) => (
                        <span
                          key={role}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium"
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 text-xs font-medium">
                        全员通用
                      </span>
                    )}
                  </div>
                </div>

                {/* 适用地区/语种 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-slate-500" /> 适用地区 / 语种
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">地域合规与多语言</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {article.applicableRegions && article.applicableRegions.length > 0 ? (
                      article.applicableRegions.map((region) => (
                        <span
                          key={region}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium"
                        >
                          {region}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 text-xs font-medium">
                        全球通用
                      </span>
                    )}
                  </div>
                </div>

                {/* 知识密级 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-slate-500" /> 知识安全密级
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">外泄管控级别</span>
                  </div>
                  <div className="pt-0.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        article.securityLevel === '机密'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : article.securityLevel === '内部'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{article.securityLevel || '内部'}（受组织权限管控）</span>
                    </span>
                  </div>
                </div>

                {/* 有效期限 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" /> 条款有效期限
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">时效性自动预警</span>
                  </div>
                  <div className="pt-0.5">
                    {article.expiryType === 'custom' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium font-mono">
                        <span>有效期：</span>
                        <strong>{article.validityStartDate || '即日起'}</strong>
                        <span className="text-slate-400 mx-0.5">至</span>
                        <strong>{article.validityEndDate || article.expiryDate || '待定'}</strong>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                        永久有效 (长期维护)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Related Articles Linkage */}
              {article.relatedArticleIds && article.relatedArticleIds.length > 0 && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-slate-500" />
                      <span>关联上下文条目 ({article.relatedArticleIds.length})</span>
                    </span>
                    <span className="text-[11px] text-slate-400">协同召回关联网络</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {article.relatedArticleIds.map((relId) => {
                      const relArt = allArticles.find((a) => a.id === relId);
                      if (!relArt) return null;
                      return (
                        <button
                          key={relId}
                          type="button"
                          onClick={() => {
                            if (onSelectRelated) onSelectRelated(relArt);
                          }}
                          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer group flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-[10px] text-slate-500 font-bold block mb-0.5">
                              {relArt.code}
                            </span>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-slate-950 truncate">
                              {relArt.title}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI 语义切片与向量化 (AI Semantic Chunks & Vectorization Engine) */}
          {activeTab === 'vectors' && (
            <div className="space-y-5">
              
              {/* 1. Vectorization Engine & Pipeline Metrics Banner */}
              <div className="p-4.5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white shadow-md border border-slate-700/80 space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/30 text-red-400 flex items-center justify-center border border-red-500/40 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">AI 知识库语义切片与向量检索索引</h4>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          3072维密集向量已就绪 (100%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        基于行业知识拓扑与滑动窗口，按语义层级切分为独立 RAG 检索分块，支持与智能客服与营销大模型实时多路召回
                      </p>
                    </div>
                  </div>

                  {/* Actions: Re-chunk & Re-embed All */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isRevectorizingAll}
                      onClick={handleRevectorizeAll}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRevectorizingAll ? 'animate-spin' : ''}`} />
                      <span>{isRevectorizingAll ? '正在重构全量向量...' : '全量重新向量化'}</span>
                    </button>
                  </div>
                </div>

                {/* 4 Pipeline Stat Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-700/60 text-xs">
                  <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium block">切片总数 (Chunks)</span>
                    <div className="flex items-baseline gap-1 font-mono font-bold text-white text-base">
                      <span>{baseSemanticChunks.length}</span>
                      <span className="text-[11px] text-slate-400 font-normal">个切片</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium block">嵌入模型 (Embedding)</span>
                    <div className="font-mono font-bold text-white text-xs truncate" title="text-embedding-3-large">
                      text-embedding-3-large
                    </div>
                    <span className="text-[10px] text-amber-300 font-medium block">3072 维密集向量</span>
                  </div>

                  <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium block">预估 Token 总量</span>
                    <div className="flex items-baseline gap-1 font-mono font-bold text-emerald-300 text-base">
                      <span>{totalTokens.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Tokens</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium block">多路召回策略</span>
                    <div className="font-bold text-white text-xs">
                      混合检索 (Hybrid)
                    </div>
                    <span className="text-[10px] text-slate-400 block">Dense 70% + BM25 30%</span>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Retrieval Simulation Bar */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#EA3A20]" />
                    <span className="text-xs font-bold text-slate-900">RAG 语义召回测试与即时过滤</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    当前展示: <strong className="text-slate-700 font-bold">{displayedChunks.length}</strong> / {baseSemanticChunks.length} 个切片
                  </span>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={vectorSearchQuery}
                    onChange={(e) => setVectorSearchQuery(e.target.value)}
                    placeholder={dynamicSearchPlaceholder}
                    className="w-full pl-9.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] transition-all"
                  />
                  {vectorSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setVectorSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Topic Filter Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
                    <Filter className="w-3 h-3" /> 主题筛选:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedChunkTopic('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedChunkTopic === 'all'
                        ? 'bg-slate-900 text-white shadow-xs font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    全部 ({baseSemanticChunks.length})
                  </button>
                  {chunkTopics.map((topic) => {
                    const count = baseSemanticChunks.filter((c) => c.topic === topic).length;
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setSelectedChunkTopic(topic)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          selectedChunkTopic === topic
                            ? 'bg-slate-900 text-white shadow-xs font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        {topic} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Search Match Notice */}
                {vectorSearchQuery && (
                  <div className="p-2.5 bg-red-50/70 border border-red-200/70 rounded-xl text-xs text-red-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#EA3A20]" />
                      <span>已启用向量余弦相似度排序，优先召回与「<strong>{vectorSearchQuery}</strong>」语义最匹配的知识切片</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#EA3A20]">
                      最高相似度得分: {displayedChunks[0]?.similarityScore ? (displayedChunks[0].similarityScore * 100).toFixed(1) + '%' : '98.2%'}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Chunks List */}
              <div className="space-y-3">
                {displayedChunks.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl space-y-2">
                    <Info className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500 font-bold">未匹配到符合条件的知识切片</p>
                    <p className="text-[11px] text-slate-400">请尝试清除搜索词或切换分类筛选</p>
                  </div>
                ) : (
                  displayedChunks.map((chunk, cIdx) => {
                    const isExpanded = expandedChunkIds.has(chunk.id);
                    const isReindexing = revectorizingChunkId === chunk.id;
                    const isCopied = copiedChunkId === chunk.id;
                    const currentIndexedAt = reindexedTimeMap[chunk.id] || chunk.lastIndexedAt;

                    return (
                      <div
                        key={chunk.id}
                        className={`p-4.5 bg-white border rounded-2xl transition-all shadow-xs space-y-3 hover:border-slate-300 ${
                          vectorSearchQuery && cIdx < 3 ? 'ring-1 ring-red-500/30 border-red-200' : 'border-slate-200/80'
                        }`}
                      >
                        {/* Chunk Card Header */}
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            {/* Chunk Index Pill */}
                            <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-red-50 text-[#EA3A20] border border-red-200/70 shrink-0">
                              CHUNK #{String(chunk.chunkIndex).padStart(2, '0')}
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-xs font-bold text-slate-900 hover:text-[#EA3A20] transition-colors">
                                  {chunk.sectionTitle}
                                </h5>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                                  {chunk.topic}
                                </span>
                                {chunk.similarityScore !== undefined && vectorSearchQuery && (
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                                    chunk.similarityScore >= 0.85
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : chunk.similarityScore >= 0.7
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}>
                                    相似度: {(chunk.similarityScore * 100).toFixed(1)}%
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap font-mono">
                                <span>{chunk.tokenCount} Tokens</span>
                                <span>•</span>
                                <span>{chunk.charCount} 字符</span>
                                <span>•</span>
                                <span className="text-slate-500">ID: {chunk.vectorId}</span>
                                <span>•</span>
                                <span>索引时间: {currentIndexedAt}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Copy Chunk Button */}
                            <button
                              type="button"
                              onClick={() => handleCopyChunk(chunk)}
                              className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                              title="复制切片正文"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-bold">已复制</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span>复制</span>
                                </>
                              )}
                            </button>

                            {/* Re-Vectorize Single Chunk Button */}
                            <button
                              type="button"
                              disabled={isReindexing}
                              onClick={() => handleRevectorizeSingleChunk(chunk)}
                              className="px-2.5 py-1 text-[11px] font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="单独重新向量化此切片"
                            >
                              <RefreshCw className={`w-3 h-3 ${isReindexing ? 'animate-spin' : ''}`} />
                              <span>{isReindexing ? '嵌入中...' : '重向量化'}</span>
                            </button>

                            {/* View Raw Vector Metadata */}
                            <button
                              type="button"
                              onClick={() => setRawVectorModalChunk(chunk)}
                              className="px-2.5 py-1 text-[11px] font-medium text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                              title="查看该切片的 3072 维向量参数与 JSON 元数据"
                            >
                              <Code2 className="w-3 h-3" />
                              <span>向量参数</span>
                            </button>
                          </div>
                        </div>

                        {/* Chunk Content Text */}
                        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                          <p className={`whitespace-pre-wrap ${!isExpanded && chunk.text.length > 220 ? 'line-clamp-3' : ''}`}>
                            {chunk.text}
                          </p>
                          {chunk.text.length > 220 && (
                            <button
                              type="button"
                              onClick={() => handleToggleExpandChunk(chunk.id)}
                              className="text-[11px] font-bold text-[#EA3A20] hover:text-[#c42810] mt-1.5 flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isExpanded ? '收起部分内容' : '展开完整切片内容'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>

                        {/* Chunk Entity Tags */}
                        {chunk.tags && chunk.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            <span className="text-[10px] text-slate-400 font-medium">切片实体特征:</span>
                            {chunk.tags.map((tag, tIdx) => (
                              <span key={tIdx}>
                                {renderPairedTagBadge(tag)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Raw Vector Embedding Metadata Modal */}
              {rawVectorModalChunk && (
                <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
                  <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6 animate-in zoom-in-95 max-h-[85vh] flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            切片 #{rawVectorModalChunk.chunkIndex} 向量嵌入元数据 (Embedding Schema)
                          </h3>
                          <p className="text-xs text-slate-400 font-mono">
                            Vector ID: {rawVectorModalChunk.vectorId} · 模型: {rawVectorModalChunk.embeddingModel}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setRawVectorModalChunk(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
                      {/* Stats Overview */}
                      <div className="grid grid-cols-3 gap-2.5 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                          <span className="text-[11px] text-slate-400 font-medium block">向量维度</span>
                          <span className="text-sm font-mono font-bold text-slate-800">3072 Dimensions</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                          <span className="text-[11px] text-slate-400 font-medium block">Token 消耗估算</span>
                          <span className="text-sm font-mono font-bold text-emerald-600">{rawVectorModalChunk.tokenCount} Tokens</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                          <span className="text-[11px] text-slate-400 font-medium block">余弦检索阈值</span>
                          <span className="text-sm font-mono font-bold text-purple-600">Cosine ≥ 0.720</span>
                        </div>
                      </div>

                      {/* JSON Viewer */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-slate-500" />
                          <span>向量数据库索引记录 (Vector Document JSON)</span>
                        </span>
                        <div className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] leading-relaxed border border-slate-800 max-h-72 overflow-y-auto whitespace-pre-wrap selection:bg-emerald-900">
                          {JSON.stringify(
                            {
                              id: rawVectorModalChunk.id,
                              vectorId: rawVectorModalChunk.vectorId,
                              chunkIndex: rawVectorModalChunk.chunkIndex,
                              articleId: article.id,
                              articleCode: article.code,
                              articleTitle: article.title,
                              sectionTitle: rawVectorModalChunk.sectionTitle,
                              topic: rawVectorModalChunk.topic,
                              embeddingModel: rawVectorModalChunk.embeddingModel,
                              embeddingDimension: 3072,
                              tokenCount: rawVectorModalChunk.tokenCount,
                              charCount: rawVectorModalChunk.charCount,
                              denseVectorSample: [
                                0.041829,
                                -0.019284,
                                0.082715,
                                -0.003819,
                                0.129841,
                                -0.054192,
                                0.067182,
                                -0.021948,
                                '... (3064 more dimensions)'
                              ],
                              sparseBM25Keywords: rawVectorModalChunk.tags.map((t) => t.split(':')[1]?.trim() || t),
                              metadata: {
                                category: article.category,
                                securityLevel: article.securityLevel || '内部',
                                applicableRoles: article.applicableRoles || ['外贸销售岗'],
                                lastIndexedAt: rawVectorModalChunk.lastIndexedAt
                              },
                              content: rawVectorModalChunk.text
                            },
                            null,
                            2
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(rawVectorModalChunk, null, 2)
                          );
                          onShowToast('向量 JSON 元数据已复制到剪贴板');
                        }}
                        className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                      >
                        复制 JSON
                      </button>
                      <button
                        type="button"
                        onClick={() => setRawVectorModalChunk(null)}
                        className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: 变更日志、复核记录与版本回滚 (History, Audit Logs, Diffs & Rollback View) */}
          {activeTab === 'history' && (
            <div className="space-y-5">
              {/* 1. Header Overview & Status Card */}
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">版本变更与复核审批日志</h4>
                      <p className="text-[11px] text-slate-400">完整追溯条目从草稿、提交复核到发布的所有操作全景与内容 Diff</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* View mode switcher */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setHistoryViewMode('timeline')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          historyViewMode === 'timeline'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <ListTree className="w-3.5 h-3.5 text-slate-700" />
                        <span>变更时间线</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryViewMode('dualDiff')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          historyViewMode === 'dualDiff'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Columns className="w-3.5 h-3.5" />
                        <span>双栏 Diff 对比</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">当前状态:</span>
                      {renderStatusBadge(article.status)}
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        {article.version}
                      </span>
                    </div>
                  </div>
                </div>

                {/* If review rejection or comments exist on current article */}
                {article.reviewComment && (
                  <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    article.status === '复核不通过'
                      ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                      : 'bg-amber-50/80 border-amber-200 text-amber-900'
                  }`}>
                    <ShieldAlert className="w-4 h-4 text-[#EA3A20] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span>管理员复核审批意见 / 驳回说明</span>
                        {article.reviewer && <span className="text-[11px] opacity-80 font-normal">审核人: {article.reviewer} · {article.reviewedAt}</span>}
                      </div>
                      <p className="mt-1 leading-relaxed">{article.reviewComment}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. DUAL COLUMN DIFF VIEW (When historyViewMode === 'dualDiff') */}
              {historyViewMode === 'dualDiff' && (
                <div className="space-y-4">
                  <DualColumnDiff
                    article={article}
                    leftVersionId={effectiveLeftVersionId}
                    rightVersionId={effectiveRightVersionId}
                    onSelectLeftVersion={setSelectedLeftVersionId}
                    onSelectRightVersion={setSelectedRightVersionId}
                    versionOptions={versionOptions}
                    onRollbackToVersion={handleRollbackToVersionOption}
                    renderPairedTagBadge={renderPairedTagBadge}
                  />
                </div>
              )}

              {/* 3. TIMELINE LIST VIEW (When historyViewMode === 'timeline') */}
              {historyViewMode === 'timeline' && (
              <div className="space-y-4">
                {(!article.auditLogs || article.auditLogs.length === 0) ? (
                  /* Fallback baseline log if empty */
                  <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">初始录入并发布</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              曾经发布
                            </span>
                            <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {article.version}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            操作人: {article.author} · 操作时间: {article.updatedAt}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      该条目首次同步录入至知识库系统。
                    </p>
                  </div>
                ) : (
                  article.auditLogs.map((log, index) => {
                    const isExpanded = expandedDiffLogId === log.id;
                    const hasDiffContent = !!(log.beforeSnapshot || log.afterSnapshot);
                    const isLatest = index === 0;

                    const getActionColor = () => {
                      if (log.action === 'approve') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
                      if (log.action === 'reject') return 'text-rose-600 bg-rose-50 border-rose-200';
                      if (log.action === 'submit_review') return 'text-amber-600 bg-amber-50 border-amber-200';
                      if (log.action === 'rollback') return 'text-purple-600 bg-purple-50 border-purple-200';
                      return 'text-blue-600 bg-blue-50 border-blue-200';
                    };

                    const getActionIcon = () => {
                      if (log.action === 'approve') return <CheckCircle2 className="w-3.5 h-3.5" />;
                      if (log.action === 'reject') return <XCircle className="w-3.5 h-3.5" />;
                      if (log.action === 'submit_review') return <Clock className="w-3.5 h-3.5" />;
                      if (log.action === 'rollback') return <RotateCcw className="w-3.5 h-3.5" />;
                      return <Edit3 className="w-3.5 h-3.5" />;
                    };

                    return (
                      <div
                        key={log.id}
                        className={`p-4 bg-white border rounded-2xl transition-all shadow-xs space-y-3 ${
                          isLatest ? 'border-slate-300 ring-1 ring-slate-200/70' : 'border-slate-200/80'
                        }`}
                      >
                        {/* Log Item Header */}
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-start gap-2.5">
                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${getActionColor()}`}>
                              {getActionIcon()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-900">{log.actionLabel}</span>
                                
                                {/* Version Badge */}
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                                  版本: {log.version}
                                </span>

                                {/* Was Published Badge */}
                                {log.wasPublished ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> 已发布上线版本
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                    未发布 (草稿/变更审阅)
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                                <span className="flex items-center gap-1 font-medium text-slate-600">
                                  <User className="w-3 h-3 text-slate-400" />
                                  <span>{log.operator}</span>
                                  {log.operatorRole && (
                                    <span className="text-[10px] text-slate-400 font-normal">({log.operatorRole})</span>
                                  )}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{log.timestamp}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Rollback button (for past snapshots or rollback candidates) */}
                          <div className="flex items-center gap-2">
                            {onRollback && (log.beforeSnapshot?.content || log.afterSnapshot?.content) && (
                              <button
                                type="button"
                                onClick={() => setRollbackConfirmLog(log)}
                                className="px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                                title="回滚条目正文与属性至此历史记录对应的版本快照"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>回滚至此版本</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Diff Summary Note */}
                        {log.diffSummary && (
                          <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                            <span className="text-[#EA3A20] font-bold shrink-0">说明:</span>
                            <span className="leading-relaxed">{log.diffSummary}</span>
                          </div>
                        )}

                        {/* Review Comment in log if rejected/approved */}
                        {log.reviewComment && (
                          <div className="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 space-y-1">
                            <span className="font-bold flex items-center gap-1 text-amber-800">
                              <ShieldCheck className="w-3.5 h-3.5" /> 复核审查批注意见:
                            </span>
                            <p className="leading-relaxed pl-4 text-amber-900">{log.reviewComment}</p>
                          </div>
                        )}

                        {/* Diff View Toggle */}
                        {hasDiffContent && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setExpandedDiffLogId(isExpanded ? null : log.id)}
                              className="text-xs font-bold text-[#EA3A20] hover:text-[#c42810] flex items-center gap-1.5 cursor-pointer py-1"
                            >
                              <GitCompare className="w-3.5 h-3.5" />
                              <span>{isExpanded ? '收起操作前后内容对比' : '查看操作前后内容对比 (Diff 对比)'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {/* Expanded Diff Detail Box */}
                            {isExpanded && (
                              <div className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-xl space-y-3 font-mono text-xs border border-slate-800 animate-in fade-in-50 duration-150">
                                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                                  <span className="flex items-center gap-1 font-bold text-white">
                                    <GitCompare className="w-3.5 h-3.5 text-amber-400" />
                                    <span>操作前后版本内容 Diff 对比快照</span>
                                  </span>
                                  <span className="text-slate-400">操作时间: {log.timestamp}</span>
                                </div>

                                {/* Meta Diff Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                  {/* Left: Before */}
                                  <div className="p-3 bg-red-950/40 rounded-lg border border-red-900/60 space-y-1.5">
                                    <div className="flex items-center justify-between text-red-300 font-bold border-b border-red-900/40 pb-1">
                                      <span>【操作前】旧版本快照</span>
                                      <span>{log.beforeSnapshot?.version || '初始'}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300">
                                      <strong className="text-slate-400">标题:</strong> {log.beforeSnapshot?.title || article.title}
                                    </p>
                                    <p className="text-[11px] text-slate-300">
                                      <strong className="text-slate-400">状态:</strong> {log.beforeSnapshot?.status || '已发布'}
                                    </p>
                                    {log.beforeSnapshot?.tags && (
                                      <p className="text-[11px] text-slate-300">
                                        <strong className="text-slate-400">标签:</strong> {log.beforeSnapshot.tags.join(', ')}
                                      </p>
                                    )}
                                    <div className="mt-2 text-[11px] text-red-200/90 leading-relaxed bg-red-950/60 p-2 rounded border border-red-900/40 max-h-40 overflow-y-auto whitespace-pre-wrap">
                                      {log.beforeSnapshot?.content || '(无操作前正文快照 / 初始新建条目)'}
                                    </div>
                                  </div>

                                  {/* Right: After */}
                                  <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-900/60 space-y-1.5">
                                    <div className="flex items-center justify-between text-emerald-300 font-bold border-b border-emerald-900/40 pb-1">
                                      <span>【操作后】新版本快照</span>
                                      <span>{log.afterSnapshot?.version || log.version}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300">
                                      <strong className="text-slate-400">标题:</strong> {log.afterSnapshot?.title || article.title}
                                    </p>
                                    <p className="text-[11px] text-slate-300">
                                      <strong className="text-slate-400">状态:</strong> {log.afterSnapshot?.status || log.actionLabel}
                                    </p>
                                    {log.afterSnapshot?.tags && (
                                      <p className="text-[11px] text-slate-300">
                                        <strong className="text-slate-400">标签:</strong> {log.afterSnapshot.tags.join(', ')}
                                      </p>
                                    )}
                                    <div className="mt-2 text-[11px] text-emerald-200/90 leading-relaxed bg-emerald-950/60 p-2 rounded border border-emerald-900/40 max-h-40 overflow-y-auto whitespace-pre-wrap">
                                      {log.afterSnapshot?.content || article.content}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              )}

              {/* Rollback Confirmation Modal Dialog */}
              {rollbackConfirmLog && (
                <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
                  <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-5 animate-in zoom-in-95">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <RotateCcw className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">确认将条目回滚至该历史版本？</h3>
                        <p className="text-xs text-slate-400">版本号: {rollbackConfirmLog.version} · 操作人: {rollbackConfirmLog.operator}</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
                      <p className="text-slate-700">
                        回滚操作将把当前知识条目的<strong>正文内容、标签及核心参数</strong>恢复为此快照状态，并在日志中自动追加一条<strong>【版本回滚】</strong>审计记录。
                      </p>
                      {rollbackConfirmLog.diffSummary && (
                        <p className="text-slate-500 font-mono text-[11px]">
                          快照摘要: {rollbackConfirmLog.diffSummary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setRollbackConfirmLog(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExecuteRollback(rollbackConfirmLog)}
                        className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>确认执行回滚</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 3. FOOTER: Clear, Prominent Actions */}
        {/* ========================================================================= */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            {!isReviewMode && (
              <button
                type="button"
                onClick={() => onEdit(article)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>编辑此条目</span>
              </button>
            )}

            {isReviewMode && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>知识复核模式：仅供审批核对，不支持直接编辑</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Review actions if in review mode and status is 等待复核 */}
            {isReviewMode && article.status === '等待复核' && onReject && onApprove && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>复核驳回</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsApproveConfirmOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>复核通过并发布</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              关闭
            </button>
          </div>
        </div>

        {/* REJECT MODAL IN DRAWER */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">驳回复核审批</h3>
                  <p className="text-xs text-slate-400">驳回后该条目将置为【复核不通过】状态，作者可重新修改提交</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  驳回原因与修改指导建议 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="例如：板材承重测试标准引用有误，需补充 2026 最新国家检验批号..."
                  rows={4}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={!rejectReason.trim()}
                  onClick={() => {
                    if (onReject && rejectReason.trim()) {
                      onReject(article, rejectReason.trim());
                      setIsRejectModalOpen(false);
                      setRejectReason('');
                    }
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  确认驳回
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APPROVE CONFIRM MODAL IN DRAWER */}
        {isApproveConfirmOpen && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">确认通过并发布生效？</h3>
                  <p className="text-xs text-slate-400">审核通过后新版本将立即生效上线并完成全库语义向量化索引</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  审核批注 / 批复备注（选填）
                </label>
                <input
                  type="text"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="符合定制技术规范标准，准予生效发布。"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsApproveConfirmOpen(false);
                    setApprovalNote('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onApprove) {
                      onApprove(article, approvalNote.trim() || '复核通过并发布上线');
                      setIsApproveConfirmOpen(false);
                      setApprovalNote('');
                    }
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  确认通过并上线
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
