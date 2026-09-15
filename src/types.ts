// Global Types for HomeCraft Custom Furniture Foreign Trade AI Platform

export type ModuleType =
  | 'home'                 // 一、首页 (1.1 通用知识库问答)
  | 'pre_sales'            // 二、售前客服 (2.1 询盘列表, 2.2 询盘内容详情)
  | 'in_sales'             // 三、销售助手 (3.1 会话列表, 3.2 会话详情 & 话术/素材)
  | 'marketing'            // 四、运营助手 (4.1 视频剪辑, 4.2 图文生成, 4.3 发布审核, 4.4 发布计划, 4.5 账号管理)
  | 'knowledge_base'       // 五、知识库管理 (5.1 内容上传, 5.2 知识复核, 5.3 分类管理, 5.4 标签管理)
  | 'pricing_maintenance'  // 六、产品价格维护 (6.1 面价设置, 6.2 汇率管理, 6.3 算价规则配置, 6.4 BOQ报价试算)
  | 'analytics'            // 七、数据统计 (智能体使用情况)
  | 'employee'             // 八、员工权限 (7.1 员工列表, 7.2 角色配置)
  | 'sys_config'           // 九、系统配置 (8.1 智能体基础配置)
  | 'audit_logs';          // 十、日志与审计 (9.1 操作日志, 9.2 问答记录, 9.3 内容生成记录)

// Drawer State for slide-over side drawer (as seen in user screenshot 1: "添加话术")
export interface DrawerConfig {
  isOpen: boolean;
  type: 'add_script' | 'add_inquiry' | 'edit_kb' | 'add_staff' | 'edit_role' | 'create_post' | 'add_material' | null;
  title: string;
  data?: any;
}

// 1.1 Knowledge QA Types
export interface QAMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: { title: string; code: string }[];
  confidence?: number;
  category?: string;
  feedback?: 'like' | 'dislike' | null;
}

// 2. Pre-sales Inquiry Types (售前询盘)
export type InquiryChannel =
  | 'WhatsApp'
  | 'Alibaba'
  | 'Made-in-China'
  | 'Official Website'
  | 'Email'
  | 'Exhibition'
  | 'Social Media';

export interface InquiryChatMessage {
  id: string;
  sender: 'customer' | 'bot';
  senderName: string;
  time: string;
  content: string;
  translatedContent?: string;
  attachments?: {
    name: string;
    size: string;
    type: 'image' | 'pdf' | 'cad' | 'excel';
    url?: string;
  }[];
}

export interface InquiryItem {
  id: string;
  inquiryNo: string;
  buyerName: string;
  companyName: string;
  country: string;
  countryCode: string;
  channel: InquiryChannel | string;
  contactNumber?: string;
  furnitureCategory: string; // e.g., '全屋定制 Solid Wood Cabinetry', '意式真皮沙发 Sofa', '现代简易衣柜 Wardrobe'
  budget: string;
  quantity: string;
  intentLevel: 'Hot (S级)' | 'Warm (A级)' | 'Standard (B级)' | 'Cold (C级)';
  status?: '待跟进' | 'AI已自动答复' | '已提供CAD报价' | '打样中' | '已签单' | '已归档' | string;
  createdAt: string;
  assignedSales?: string;
  content: string;
  attachments: { name: string; url: string; size: string; type: 'image' | 'pdf' | 'cad' | 'excel' }[];
  aiReplyDraft?: string;
  aiScore: number;
  platform?: string;
  title?: string;
  receivedAt?: string;
  email?: string;
  targetDelivery?: string;
  rawContent?: string;
  chatHistory?: InquiryChatMessage[];
  botTurns?: number;
  aiAnalysis?: {
    intentLevel?: string;
    confidenceScore?: number;
    summary?: string;
    suggestedReply?: string;
  };
}

// 3. In-sales Chat & Scripts Types (销售助手)
export interface SessionItem {
  id: string;
  customerName: string;
  avatar: string;
  channel: '企微' | 'WhatsApp' | '线下对接' | '企业微信' | string;
  contactInfo?: string; // 手机号/企微ID/WA号码
  companyName?: string; // 企业或项目名称
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  tags: string[];
  assignedStaff: string;
  status: '跟进中' | '已报价' | '已成交' | '已流失';
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'customer' | 'sales' | 'ai_copilot';
  content: string;
  timestamp: string;
  translatedContent?: string;
  attachmentUrl?: string;
  
  // Rich formatting and AI states
  isGenerating?: boolean;
  generationTimeMs?: number;
  messageType?: 'text' | 'text_image' | 'text_file' | 'text_video' | 'rich_text' | 'video_only' | 'file_only';
  attachments?: {
    id: string;
    type: 'image' | 'file' | 'video';
    url: string;
    name: string;
    size?: string;
    thumbnail?: string;
    duration?: string;
  }[];
  citations?: {
    id: string;
    title: string;
    version: string;
    category?: string;
    excerpt?: string;
  }[];
  // 引用的社媒聊天记录 (Quoted social chat records)
  quotedMessages?: {
    id: string;
    sender: 'customer' | 'sales' | string;
    senderName?: string;
    content: string;
    timestamp?: string;
  }[];
}

// 话术库 (Scripts Library - As shown in Screenshot 1!)
export interface ScriptItem {
  id: string;
  title: string;
  content: string;
  category: string; // e.g. '常用问候', '材质与环保标准', '海运与CBM核算', '交期与付款条款', '售后质保'
  isPrivate: boolean; // 公共话术库 vs 私人话术库
  order: number;
  tags: string[];
  useCount: number;
}

// 4. Marketing Assistant Types (运营助手)
export type MediaType = 'video' | 'image' | 'audio';
export type AspectRatioType = '9:16' | '16:9' | '1:1' | '4:3' | 'other';

export interface MediaAssetItem {
  id: string;
  code: string; // e.g., 'MED-2026-081'
  title: string;
  type: MediaType;
  url: string;
  thumbnail: string;
  duration?: string; // 视频或音频时长，如 '00:15'
  durationSec?: number; // 秒数，如 15
  width?: number;
  height?: number;
  aspectRatio: AspectRatioType;
  resolution?: string; // e.g. '4K UHD (3840x2160)', '1080P FHD'
  fps?: number; // 60, 30
  fileSize: string; // '34.2 MB'
  format: string; // 'MP4', 'MOV', 'JPG', 'PNG', 'WEBP', 'WAV'
  folderId: string; // 所属素材箱/文件夹 ID
  folderName: string;
  tags: string[]; // ['#极简整家', '#爱格板', '#五金铰链']
  usageCount: number; // 混剪引用次数
  isFavorite: boolean; // 是否星标收藏
  uploader: string;
  uploadedAt: string;
  scenesDetected?: string[]; // AI 检测的分镜场景标签
  colorPalette?: string[]; // AI 色彩分析
  associatedProjects?: string[]; // 已关联的视频或图文项目
  isDeleted?: boolean; // 是否处于回收站中
  deletedAt?: string; // 移入回收站时间，如 '2026-09-10 10:15'
}

export interface MediaFolderItem {
  id: string;
  name: string;
  icon?: string;
  assetCount: number;
  isSystem?: boolean;
}

export interface VideoClipItem {
  id: string;
  title: string;
  furnitureModel: string;
  sourceType: '展厅实拍' | '3D渲染动画' | '工厂生产线' | '客户交货回访';
  duration: string;
  aiAspect: '9:16 (TikTok/Reels)' | '16:9 (YouTube)' | '1:1 (Instagram Feed)';
  scriptText: string;
  status: '已剪辑' | '剪辑中' | '配音渲染中' | '审核通过';
  previewCover: string;
}

export interface MarketingPost {
  id: string;
  title: string;
  platform: 'Instagram' | 'LinkedIn' | 'Pinterest' | 'TikTok' | 'Facebook';
  contentType: '图文轮播' | '短视频' | '案例文章' | '展会邀请';
  textCopy: string;
  hashtags: string[];
  status: '草稿' | '待审核' | '已排期' | '已发布';
  scheduledTime: string;
  aiAuditStatus: '合规无风险' | '需注意描述' | '合规警告';
  metrics?: { views: number; likes: number; inquiries: number };
}

export interface KBTag {
  id: string;
  name: string; // 标签名 (Tag Key, 例如: '风格', '色系', '材质', '空间', '环保等级', '销售阶段', '合规风控', '外贸交付')
  values: string[]; // 标签值列表 (Tag Values, 例如: 风格: ['地中海', '现代简约', '意式极简'], 色系: ['暖色调', '冷色调', '经典黑白灰'])
  color: 'red' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan' | 'indigo' | 'slate';
  categoryGroup: string; // '产品与材质' | '销售话术' | '空间美学' | '合规风控' | '外贸业务' | '通用维度'
  description?: string;
  usageCount?: number;
  isBuiltin?: boolean; // 是否为公司官方内置标准标签 (true: 公司内置, false: 团队自定义)
  builtinValues?: string[]; // 官方内置标准值清单 (区分官方标准词与自定义扩展词)
  createdAt: string;
  updatedAt?: string;
  creator?: string;
}

export interface KBAuditLog {
  id: string;
  articleId: string;
  operator: string;
  operatorRole?: string;
  timestamp: string;
  action: 'create' | 'edit' | 'submit_review' | 'approve' | 'reject' | 'delete_request' | 'rollback' | 'expire';
  actionLabel: string; // e.g. "新建知识条目", "编辑修改提交", "平台管理员复核通过", "复核驳回", "版本回滚"
  version: string; // e.g. "v2.4.0"
  wasPublished: boolean; // 是否曾经发布
  reviewComment?: string; // 审批/驳回审核意见
  diffSummary?: string; // 变更摘要
  beforeSnapshot?: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
    version?: string;
    status?: string;
  };
  afterSnapshot?: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
    version?: string;
    status?: string;
  };
}

// 5. Knowledge Management Types (知识库管理)
export interface KBArticle {
  id: string;
  title: string;
  category: string; // 全屋定制, 软体家具, 五金包材, 报关认证
  code: string;
  version: string; // e.g. v2.4.0
  author: string;
  updatedAt: string;
  content: string;
  status: '草稿' | '等待复核' | '已发布' | '复核不通过' | '失效';
  viewCount: number;
  contentType?: 'markdown' | 'document' | 'video'; // 知识内容形式：Markdown文本、文档附件、视频
  fileType?: 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'VIDEO' | 'MD' | 'MANUAL';
  fileSize?: string;
  chunksCount?: number;
  chunkCount?: number;
  tags?: string[];
  // 复核流转信息
  wasPublished?: boolean; // 是否曾有正式发布版本
  pendingVersion?: string; // 正在复核中未生效的新版本号 (如 v2.5.0)
  rejectedVersion?: string; // 新版本复核被驳回/未通过的版本号 (如 v2.1.0)
  pendingEffectiveVersion?: string; // 复核已通过但尚未到达生效日期的新版本号 (如 v2.3.0)
  pendingEffectiveStartDate?: string; // 待生效起始生效日期 (如 2026-09-01)
  reviewStatus?: 'pending' | 'approved' | 'rejected' | 'expired';
  reviewComment?: string; // 复核审核意见或驳回原因
  reviewer?: string; // 审核人 (平台管理员)
  reviewedAt?: string; // 审核时间
  pendingAction?: 'create' | 'update' | 'delete'; // 待复核动作类型
  // 变更与审计历史
  auditLogs?: KBAuditLog[];
  // 业务适用与权限管控配置
  applicableRoles?: string[]; // 适用角色* (多选，如：外贸销售岗、内容推广岗、方案设计师等)
  applicableRegions?: string[]; // 适用地区/语种* (多选，如：GCC中东六国、英文/阿拉伯语等)
  securityLevel?: '公开' | '内部' | '机密'; // 知识密级：公开 / 内部 / 机密
  expiryType?: 'permanent' | 'custom'; // 有效期限类型：永久有效 / 设置有效期
  validityStartDate?: string; // 有效期开始日期 (YYYY-MM-DD)
  validityEndDate?: string; // 有效期结束日期 (YYYY-MM-DD)
  expiryDate?: string; // 指定失效/截止日期 (YYYY-MM-DD，兼容旧字段)
  relatedArticleIds?: string[]; // 关联条目 (知识库关联文章ID列表)
  // 视频知识扩展
  videoInfo?: {
    url?: string;
    duration?: string;
    coverUrl?: string;
    sourceName?: string;
    transcript?: string; // 视频语音转写文本 (供 AI 语义向量检索)
  };
  // 文档附件扩展
  attachmentFile?: {
    name: string;
    size: string;
    type: string;
    ext: string;
    url?: string;
    ocrExtractedText?: string;
  };
}

export interface KBCategory {
  id: string;
  name: string;
  code: string;
  itemCount: number;
  isBuiltin?: boolean;
  applicableRoles?: string[]; // 适用角色 (多选，如：外贸销售岗、内容推广岗、方案设计师等)
  requireReview?: boolean; // 该分类下上传/编辑/删除是否需要平台管理员复核
  reviewTriggers?: {
    onUpload?: boolean; // 上传新知识需复核
    onEdit?: boolean;   // 编辑修改需复核
    onDelete?: boolean; // 删除需复核
  };
  children?: KBCategory[];
}

export interface KBVersion {
  version: string;
  releaseDate: string;
  author: string;
  changeLog: string;
  articleCount: number;
}

// 6. Data Analytics Types (数据统计)
export interface AgentStatMetric {
  date: string;
  salesInquiriesHandled: number;
  salesAiResolutionRate: number; // percentage
  marketingPostsGenerated: number;
  marketingInquiryLeads: number;
  avgResponseSeconds: number;
}

// 7. Employee & Permissions Types (员工权限)
export interface OrgDeptNode {
  id: string;
  name: string;
  parentId?: string;
  hasChildren?: boolean;
  memberCount?: number;
  children?: OrgDeptNode[];
}

export interface WeComDept {
  id: number | string;
  name: string;
  parentId?: number | string;
  memberCount: number;
  hasChildren?: boolean;
}

export interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  department: string;
  deptId?: number | string;
  deptPath?: string;
  isDeptLeader?: boolean; // 部门负责人：是 / 否
  wecomUserId: string; // 企业微信成员UserID
  wecomAvatar?: string;
  wecomMobile: string; // 企业微信手机号
  wecomPosition: string; // 企业微信职位
  wecomStatus: '已激活' | '未激活' | '已离职';
  wecomSyncTime?: string;
  role: '超级管理员' | '外贸主管' | '销售业务员' | '推广运营官' | '内容审稿员' | string;
  status: '启用' | '禁用' | '在职 (正常)' | '已禁用';
  lastActive: string;
  aiQuotaLimit: number; // 每日 AI 算力限额
  aiQuotaUsed: number;
}

export type DataScopeType = 'all' | 'dept_and_sub' | 'dept_only' | 'self_only' | 'custom';

export interface DataPermissionConfig {
  scope: DataScopeType;
  scopeLabel: string;
  customDepts?: string[];
  customRegions?: string[]; // e.g. ['北美市场', '欧洲市场', '中东与海湾', '澳洲与大洋洲']
  maskCustomerContact: boolean; // 客户电话/邮箱/WhatsApp脱敏保护
  maskCostPrice: boolean; // 出厂成本与底价毛利脱敏
}

export interface OperationPermissionsConfig {
  // 售前询盘
  inquiryAssign: boolean; // 询盘人工改派
  inquiryTakeover: boolean; // 强制接管会话
  inquiryExport: boolean; // 导出询盘线索
  // 客户与销售
  customerTransfer: boolean; // 公私海客户转移
  customerPriceQuote: boolean; // 生成工程特批底价单
  customerTagEdit: boolean; // 强制变更客户阶段与标签
  // 营销与运营
  marketingApprove: boolean; // 海外社媒发布审核
  marketingDirectPost: boolean; // 直连社媒一键发布
  marketingBatchGenerate: boolean; // 批量AI视频与文案生成
  // 知识库管理
  knowledgePublish: boolean; // 免审发布知识词条
  knowledgeVectorRebuild: boolean; // 触发向量库全量重建
  knowledgeExport: boolean; // 导出外贸工艺百科
  // 员工与系统
  wecomSyncManual: boolean; // 手动同步企业微信通讯录
  roleManage: boolean; // 分配与配置角色
  quotaAdjust: boolean; // 调整员工AI算力上限
  auditExport: boolean; // 导出审计日志
}

export interface RoleConfig {
  id: string;
  roleName: string;
  description: string;
  userCount: number;
  permissions: {
    module: string;
    view: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
  }[];
  dataPermission: DataPermissionConfig;
  operationPermissions: OperationPermissionsConfig;
}

// 8. System Config Types (智能体基础设置: 销售类智能体 Agent 配置 & 销售类 Skill 配置)
export type SalesAgentCode =
  | 'pre_processing_agent'
  | 'intent_dispatcher_agent'
  | 'knowledge_expert_agent'
  | 'quotation_commercial_agent'
  | 'sales_strategy_agent'
  | 'qc_compliance_agent'
  | 'aftersales_troubleshooting_agent';

export interface SalesAgentItem {
  id: string;
  name: string;
  code: SalesAgentCode;
  role: string;
  category: '前置接入' | '中枢路由' | '核心专家' | '商务报价' | '策略推进' | '合规风控' | '售后保障';
  description: string;
  status: 'active' | 'inactive' | 'standby';
  geminiModel: string;
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  contextRounds: number;
  systemPrompt: string;
  attachedSkillCodes: string[];
  throughput24h: number;
  avgLatencyMs: number;
  accuracyRate: string;
  pipelineOrder: number;
  parameters: AgentSkillParameter[];
  iconName: string;
}

export interface AgentSkillParameter {
  name: string;
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  value: any;
  options?: string[];
  description: string;
  unit?: string;
}

export interface AgentSkill {
  id: string;
  name: string;
  code: string;
  category:
    | '解析与数据'
    | '通信与同步'
    | '画像与枚举'
    | '检索与RAG'
    | '报价与计价'
    | '文档与商业'
    | '风控与合规'
    | '生命周期'
    | '知识协同'
    | '计算与配载'
    | '工程与图纸'
    | '合规与质检'
    | '商务与文案'
    | '语音与多模态';
  description: string;
  version: string;
  status: 'enabled' | 'disabled';
  iconName: string;
  triggerType: '自动语义唤起' | '指令调用' | '事件监听' | '混合触发' | '流水线串联';
  triggerKeywords: string[];
  parameters: AgentSkillParameter[];
  inputSchemaSummary: string;
  outputSchemaSummary: string;
  associatedAgents?: string[];
  apiEndpoint?: string;
  lastInvoked?: string;
  invocationCount: number;
  successRate: string;
  avgLatencyMs: number;
  isCustom?: boolean;
}

export interface SystemAgentConfig {
  agentName: string;
  agentId?: string;
  primaryPersona: string;
  languageMode: '中英双语 (默认)' | '多国语言自动翻译' | '纯英文纯粹视角';
  temperature: number;
  topP?: number;
  maxOutputTokens?: number;
  contextRounds?: number;
  geminiModel: string;
  autoReplyDelaySeconds: number;
  enableAiScore: boolean;
  enableCbmCalculator: boolean;
  enableWatermark: boolean;
  enableFSCComplianceFilter?: boolean;
  enablePriceFormulaMasking?: boolean;
  fobDefaultPort: string;
  defaultModel?: string;
  systemPrompt?: string;
  toneStyle?: '严谨专业' | '热情亲切' | '高层商务' | '工程顾问';
  salesAgents?: SalesAgentItem[];
  skills?: AgentSkill[];
}

// 9. Logs & Audit Types (日志与审计)
export interface OperationLog {
  id: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  action: string;
  module: string;
  detail: string;
  timestamp: string;
  status: '成功' | '失败' | '警告';
}

export interface QARecordLog {
  id: string;
  userName: string;
  question: string;
  answerSnippet: string;
  confidence: number;
  sourceCode: string;
  durationMs: number;
  timestamp: string;
}

export interface ContentGenLog {
  id: string;
  operator: string;
  genType: '视频脚本' | 'Instagram文案' | '询盘报价单' | '知识库修订';
  promptUsed: string;
  tokensUsed: number;
  timestamp: string;
  status: '完成' | '生成中';
}

// 6. Product Price Maintenance & BOQ (产品价格维护与BOQ清单计算)
export interface BOQPriceItem {
  id: string;
  code: string;               // 部件编号 e.g. MAT-CAB-001
  name: string;               // 部件名称 e.g. 爱格E0级柜体实木颗粒板
  category: '柜体板材' | '定制门板' | '台面石材' | '基础五金' | '功能配件' | '出口包装' | '人工安装';
  spec: string;               // 规格/材质说明 e.g. 18mm/双饰面/E0级/环保认证
  unit: '投影㎡' | '展开㎡' | '延米' | '个' | '套' | '米';
  currency: 'USD' | 'CNY';
  basePriceUSD: number;       // 外贸出口基准单价(USD)
  basePriceRMB: number;       // 内销折算价(RMB)
  wasteRatePercent: number;   // 损耗率(%) e.g. 8%
  formulaDesc: string;        // 算价公式逻辑说明 e.g. 展开面积 × 单价 × (1 + 损耗率)
  status: '已生效' | '待生效' | '已停用';
  updatedAt: string;
  tags?: string[];
}

export interface BOQPricingRule {
  id: string;
  name: string;
  category: '面积算法' | '损耗率' | '非标系数' | '出口包装' | '外币汇率';
  formulaDesc: string;
  factor: number | string;
  unit?: string;
  isEnabled: boolean;
  remarks: string;
}

export interface BOQLineItem {
  id: string;
  itemNo: number;
  partName: string;
  category: string;
  spec: string;
  calcLogic: string;
  quantity: number;
  unit: string;
  unitPriceUSD: number;
  amountUSD: number;
  wastePercent: number;
  totalUSD: number;
}

// 6.2 汇率管理 Types
export interface ExchangeRateItem {
  id: string;
  currencyCode: string;   // 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'AED' | 'SGD'
  currencyName: string;   // '美元' | '欧元' | '英镑' | '澳元' | '加元' | '阿联酋迪拉姆' | '新加坡元'
  symbol: string;         // '$' | '€' | '£' | 'A$' | 'C$' | 'AED' | 'S$'
  flag: string;           // '🇺🇸' | '🇪🇺' | '🇬🇧' | '🇦🇺' | '🇨🇦' | '🇦🇪' | '🇸🇬'
  marketRate: number;     // 市场实时中间牌价 (对CNY)
  systemRate: number;     // 企业核算锁定汇率 (用于BOQ与报价)
  bufferPercent: number;  // 锁汇安全抗波动浮动比 (%)
  settlementRate: number; // 实际核算汇率 (systemRate * (1 + bufferPercent/100))
  isBaseCurrency?: boolean;// 是否为核心结算主货币 (USD)
  status: '已生效' | '已锁定' | '预警中';
  autoSync: boolean;      // 是否开启每日自动同步
  lastUpdated: string;    // 最后更新时间
  operator: string;       // 最后维护人
  changeRate24h: number;  // 24小时波动率 %
}

export interface ExchangeRateLogItem {
  id: string;
  currencyCode: string;
  currencyName: string;
  previousRate: number;
  newRate: number;
  changeType: '手动调整' | '自动同步' | '季度锁汇' | '安全缓冲调整';
  operator: string;
  timestamp: string;
  note: string;
}

