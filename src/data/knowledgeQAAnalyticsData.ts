export interface KnowledgeQALog {
  id: string;
  question: string;
  matchedDocTitle: string;
  categoryGroup: string;
  channel: '售前AI智能体' | '销售顾问助手' | '员工自查' | '海外推广运营';
  timestamp: string;
  confidenceScore: number; // e.g. 98
  similarityRate: number; // e.g. 0.96
  aiAnswerSnippet: string;
  fullAnswer: string;
  retrievedContext: string;
  feedback: 'positive' | 'negative' | 'none';
  resolutionStatus: 'direct_resolved' | 'agent_escalated' | 'needs_kb_enrich';
  responseTimeMs: number;
}

export interface HotQuestionStat {
  rank: number;
  question: string;
  category: string;
  queryCount: number;
  hitRate: number;
  avgScore: number;
  trend: 'up' | 'stable' | 'down';
}

export interface KBCategoryUsageStat {
  name: string;
  queries: number;
  percentage: number;
  color: string;
}

export interface ChannelUsageStat {
  channel: string;
  queries: number;
  percentage: number;
  color: string;
}

export interface DailyQATrend {
  date: string;
  queries: number;
  hitRate: number; // percentage e.g. 96
  resolvedRate: number; // percentage e.g. 92
  lowConfidenceCount: number;
}

export const initialDailyQATrends: DailyQATrend[] = [
  { date: '08-25', queries: 820, hitRate: 95.4, resolvedRate: 90.2, lowConfidenceCount: 18 },
  { date: '08-26', queries: 940, hitRate: 96.1, resolvedRate: 91.0, lowConfidenceCount: 15 },
  { date: '08-27', queries: 1120, hitRate: 97.2, resolvedRate: 92.5, lowConfidenceCount: 12 },
  { date: '08-28', queries: 1050, hitRate: 96.5, resolvedRate: 91.8, lowConfidenceCount: 16 },
  { date: '08-29', queries: 1280, hitRate: 97.8, resolvedRate: 93.4, lowConfidenceCount: 10 },
  { date: '08-30', queries: 1210, hitRate: 97.0, resolvedRate: 92.8, lowConfidenceCount: 14 },
  { date: '08-31', queries: 1360, hitRate: 98.2, resolvedRate: 94.1, lowConfidenceCount: 8 }
];

export const initialKBCategoryUsage: KBCategoryUsageStat[] = [
  { name: '产品与技术百科 (板材/工艺/柜体)', queries: 3820, percentage: 38, color: '#EA3A20' },
  { name: '外贸交付与合规认证 (CARB/TSCA/FSC)', queries: 2610, percentage: 26, color: '#0F4A47' },
  { name: '五金配件与安装售后 (Blum/激光封边)', queries: 1810, percentage: 18, color: '#F59E0B' },
  { name: '定制报价与工程计价规则 (展开/投影)', queries: 1210, percentage: 12, color: '#8B5CF6' },
  { name: '品牌实力与企业文化 (产能/展厅/质保)', queries: 600, percentage: 6, color: '#3B82F6' }
];

export const initialChannelUsage: ChannelUsageStat[] = [
  { channel: '售前AI智能体 (官网/WordPress/社媒)', queries: 4520, percentage: 45, color: '#EA3A20' },
  { channel: '销售顾问助手 (外贸业务谈判辅助)', queries: 2810, percentage: 28, color: '#0F4A47' },
  { channel: '内部员工自查 (新员工/设计师/客服)', queries: 1710, percentage: 17, color: '#F59E0B' },
  { channel: '海外推广运营 (文案/脚本生成匹配)', queries: 1010, percentage: 10, color: '#8B5CF6' }
];

export const initialHotQuestions: HotQuestionStat[] = [
  {
    rank: 1,
    question: '出口美国的定制家具需要提供哪些 EPA/CARB 环保合规认证文件？',
    category: '外贸交付与合规认证',
    queryCount: 1420,
    hitRate: 99.2,
    avgScore: 98.4,
    trend: 'up'
  },
  {
    rank: 2,
    question: '德国豪迈激光封边技术与传统 PUR 封边相比的核心优势是什么？',
    category: '产品与技术百科',
    queryCount: 1280,
    hitRate: 98.5,
    avgScore: 97.6,
    trend: 'up'
  },
  {
    rank: 3,
    question: '外贸海运一个 40 尺高柜 (40HQ) 大概能装多少平米定制板式家具？',
    category: '外贸交付与合规认证',
    queryCount: 960,
    hitRate: 96.8,
    avgScore: 95.2,
    trend: 'stable'
  },
  {
    rank: 4,
    question: '全屋定制中 Blum 铰链与百隆缓冲导轨官方质保期与承重参数？',
    category: '五金配件与安装售后',
    queryCount: 840,
    hitRate: 97.4,
    avgScore: 96.8,
    trend: 'up'
  },
  {
    rank: 5,
    question: '针对澳洲及北美沿海潮湿气候，卫生间浴室柜基材推荐什么？',
    category: '产品与技术百科',
    queryCount: 750,
    hitRate: 96.4,
    avgScore: 94.5,
    trend: 'stable'
  },
  {
    rank: 6,
    question: '工程全屋定制大单起订量 (MOQ) 与样品打样周期标准是怎样的？',
    category: '定制报价与工程计价',
    queryCount: 690,
    hitRate: 94.0,
    avgScore: 93.1,
    trend: 'stable'
  },
  {
    rank: 7,
    question: '欧标 E0 与国标 ENF 级别的甲醛释放量限值标准有何差异？',
    category: '外贸交付与合规认证',
    queryCount: 620,
    hitRate: 96.9,
    avgScore: 95.7,
    trend: 'down'
  },
  {
    rank: 8,
    question: '衣柜转角柜采用对开五金还是联动转角飞碟更节省海外物流方数？',
    category: '五金配件与安装售后',
    queryCount: 530,
    hitRate: 93.5,
    avgScore: 92.4,
    trend: 'up'
  }
];

export const initialKnowledgeQALogs: KnowledgeQALog[] = [
  {
    id: 'QA-LOG-8901',
    question: '你们出口到加州洛杉矶的橱柜，板材能过 CARB Phase 2 检验吗？有证书原件吗？',
    matchedDocTitle: '北美市场环保准入标准与 CARB P2 / TSCA Title VI 合规白皮书',
    categoryGroup: '外贸交付与合规认证',
    channel: '售前AI智能体',
    timestamp: '今日 16:42:15',
    confidenceScore: 99,
    similarityRate: 0.98,
    aiAnswerSnippet: '品爱家居全系出口北美板材均严格符合美国 EPA TSCA Title VI 及加利福尼亚 CARB P2 强制标准，每批次均随单附带第三方检测报告与溯源合格证...',
    fullAnswer: '尊敬的客户，品爱家居全系出口北美的实木多层板及高密度刨花板均严格符合美国 EPA TSCA Title VI 及加利福尼亚 CARB Phase 2 强制认证标准。我们的板材供应商均持有第三方公证机构（SGS / Intertek）颁发的合规证书，报关装箱单上将附具 CARB 认证标签及可查验的溯源批次编码，确保加州海关 100% 顺畅清关无合规阻碍。',
    retrievedContext: '【知识库条款】《品爱出口北美环保合规规范》第3.2节：所有发往北美（美国/加拿大）订单必须采用通过EPA TSCA Title VI及CARB Phase 2认证的低甲醛胶粘基材，外箱印刷相应合规字样...',
    feedback: 'positive',
    resolutionStatus: 'direct_resolved',
    responseTimeMs: 1240
  },
  {
    id: 'QA-LOG-8902',
    question: '德国豪迈激光封边相比普通的 EVA 热熔胶封边，耐热防水表现提升了多少？',
    matchedDocTitle: '德国豪迈激光封边技术原理与零胶缝防潮耐热对比测试',
    categoryGroup: '产品与技术百科',
    channel: '销售顾问助手',
    timestamp: '今日 16:15:30',
    confidenceScore: 98,
    similarityRate: 0.97,
    aiAnswerSnippet: '豪迈激光封边采用光聚合物活化反应形成永久共聚无痕界面，零胶缝抗温差达 -40℃~150℃，水煮膨胀率比 EVA 降低 85%...',
    fullAnswer: '相比传统 EVA 热熔胶封边，德国豪迈激光封边技术通过高能激光瞬间活化封边带功能层，与板材基材形成分子级共聚结合：① 零胶线无胶水外溢，彻底消除黑线发黄；② 防水防潮耐湿热性能提升 85% 以上，经 100℃ 热水浸泡测试 48 小时边缘无吸水剥离；③ 耐候温度跨度达 -40℃ 至 150℃，完全适应跨赤道远洋集装箱运输的高温高湿严苛环境。',
    retrievedContext: '【知识库条款】《板材工艺百科·封边篇》：激光封边零胶缝工艺核心指标：附着拉力≥350N，耐温-40℃~150℃，抗水蒸气渗透率比传统EVA提高85%以上。',
    feedback: 'positive',
    resolutionStatus: 'direct_resolved',
    responseTimeMs: 1180
  },
  {
    id: 'QA-LOG-8903',
    question: '一个 40HQ 高柜装全屋定制板件，一般能装多少立方米？运费怎么摊？',
    matchedDocTitle: '外贸全屋定制集装箱配载计算规则与 40HQ 包装体积标准',
    categoryGroup: '外贸交付与合规认证',
    channel: '销售顾问助手',
    timestamp: '今日 15:30:10',
    confidenceScore: 96,
    similarityRate: 0.94,
    aiAnswerSnippet: '标准 40HQ 理论容积 76m³，品爱扁平化打木架实装率达 65-68m³，折合全屋定制柜体板件约 450~520 平方米...',
    fullAnswer: '标准 40 尺高柜（40HQ）内部理论容积为 76m³。品爱工厂采用高精度扁平化蜂窝纸箱结合护角免熏蒸木托盘打包，实际安全配载体积通常在 65~68 立方米之间。按照全屋定制板式家具均厚 18mm 并包含门板五金包计算，通常可装运 450~520 平方米展开面积柜体。',
    retrievedContext: '【知识库条款】《外贸装箱与交付百科》第4.1条：40HQ实装建议控制在65-68CBM，重量不超26吨，每箱毛重建议低于35kg便于海外当地卸货人工搬运。',
    feedback: 'positive',
    resolutionStatus: 'direct_resolved',
    responseTimeMs: 1450
  },
  {
    id: 'QA-LOG-8904',
    question: '中东客户定制别墅项目需要全套耐高温防腐的意式极简隐形门五金，推荐哪款？',
    matchedDocTitle: '意式极简隐藏门专用天轴铰链与磁吸静音锁体工程选型指南',
    categoryGroup: '五金配件与安装售后',
    channel: '员工自查',
    timestamp: '今日 14:48:22',
    confidenceScore: 97,
    similarityRate: 0.95,
    aiAnswerSnippet: '推荐选用品爱定制款隐形天地轴铰链系统，表面经特氟龙防腐与阳极氧化喷砂，承重 80KG，耐温达 65℃ 永不卡顿...',
    fullAnswer: '针对中东高温干燥及海风高盐雾环境的别墅项目，强烈推荐选用品爱工程专用【意式隐形天地轴承重铰链系统】配【德国磁力静音缓冲锁体】。该铰链采用航空级高强度铝合金及耐热自润滑轴套，经 480 小时中性盐雾测试抗腐蚀达 10 级，单扇门额定承重 80KG，配合 3D 快速微调结构，即使在温差极大环境下门缝依然保持 1.5mm 极致等距。',
    retrievedContext: '【知识库条款】《五金选型规范》第7章：中东及海湾地区气候选型严禁普通碳钢镀锌件，隐形门标配特氟龙防腐天轴，耐温标准-20℃~+70℃。',
    feedback: 'positive',
    resolutionStatus: 'direct_resolved',
    responseTimeMs: 1320
  },
  {
    id: 'QA-LOG-8905',
    question: '沙特新规对智能指纹锁的 SASO 认证最新补充条款，知识库里有更新吗？',
    matchedDocTitle: '中东海湾地区 SASO 与 SABER 认证进出口合规动态速览',
    categoryGroup: '外贸交付与合规认证',
    channel: '售前AI智能体',
    timestamp: '今日 11:20:05',
    confidenceScore: 78,
    similarityRate: 0.74,
    aiAnswerSnippet: '当前知识库已收录 SASO 电子锁基本安全规范，但 2026 Q3 最新的沙特无线频谱 CITC 细化准则仍需由合规部复核更新...',
    fullAnswer: '您好，品爱智能五金已具备沙特 SABER 平台常规认证及 SASO 安全证书，但针对 2026 年最新补充的沙特无线射频与加密协议细则，我们的外贸合规专家正在同步最新细化条款。稍后我们的资深外贸顾问将连同最新沙特检验局批复文件向您一对一补充解答。',
    retrievedContext: '【知识库条款】《中东SABER准入》：常规五金执行通用机械安全标准；智能电子锁需补充低压电气与无线核准，2026新规草案待法务部最终定稿。',
    feedback: 'none',
    resolutionStatus: 'needs_kb_enrich',
    responseTimeMs: 1680
  },
  {
    id: 'QA-LOG-8906',
    question: '全屋定制合同中的展开面积和投影面积是怎么换算的？系数通常是多少？',
    matchedDocTitle: '定制家居计价算法与投影/展开面积换算系数对照表',
    categoryGroup: '定制报价与工程计价规则',
    channel: '员工自查',
    timestamp: '今日 10:05:40',
    confidenceScore: 99,
    similarityRate: 0.98,
    aiAnswerSnippet: '标准衣柜展开面积与投影面积系数通常在 3.2~3.8 之间；酒柜与带多宝格复杂柜体通常在 4.0~4.5 之间...',
    fullAnswer: '全屋定制中投影面积是柜体正立面宽×高（即正面投影面积），展开面积是将所有层板、立板、背板、门板平铺后的总平方米数。一般换算系数规律如下：① 标准卧室衣柜（含常规挂衣区+2个抽屉）：换算系数为 3.2 ~ 3.5；② 进深较深或隔层较多的书柜、展示柜：换算系数为 3.8 ~ 4.2；③ 包含格栅酒架、异形转角的复杂造型柜：系数约为 4.2 ~ 4.8。外贸工程报价中建议优先采用透明的展开面积计价。',
    retrievedContext: '【知识库条款】《定制报价规则手册》：展开面积标准公式=板材总平方数×基材单价+五金配件总价；投影均价=总价/正面投影平米数。',
    feedback: 'positive',
    resolutionStatus: 'direct_resolved',
    responseTimeMs: 1100
  }
];
