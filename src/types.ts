// Global Types for HomeCraft Custom Furniture Foreign Trade AI Platform

export type ModuleType =
  | 'home'             // 一、首页 (1.1 通用知识库问答)
  | 'pre_sales'        // 二、售前客服 (2.1 询盘列表, 2.2 询盘内容详情)
  | 'in_sales'         // 三、售中助手 (3.1 会话列表, 3.2 会话详情 & 话术/素材)
  | 'marketing'        // 四、推广助手 (4.1 视频剪辑, 4.2 图文生成, 4.3 内容审核, 4.4 发布计划)
  | 'knowledge_base'   // 五、知识库管理 (5.1 内容编辑, 5.2 分类管理, 5.3 知识库版本)
  | 'analytics'        // 六、数据统计 (智能体使用情况)
  | 'employee'         // 七、员工权限 (7.1 员工列表, 7.2 角色配置)
  | 'sys_config'       // 八、系统配置 (8.1 智能体基础配置)
  | 'audit_logs';      // 九、日志与审计 (9.1 操作日志, 9.2 问答记录, 9.3 内容生成记录)

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
export interface InquiryItem {
  id: string;
  inquiryNo: string;
  buyerName: string;
  companyName: string;
  country: string;
  countryCode: string;
  channel: 'Alibaba' | 'Made-in-China' | 'Official Website' | 'WhatsApp' | 'Exhibition';
  furnitureCategory: string; // e.g., '全屋定制 Solid Wood Cabinetry', '意式真皮沙发 Sofa', '现代简易衣柜 Wardrobe'
  budget: string;
  quantity: string;
  intentLevel: 'Hot (S级)' | 'Warm (A级)' | 'Standard (B级)' | 'Cold (C级)';
  status: '待跟进' | 'AI已自动答复' | '已提供CAD报价' | '打样中' | '已签单' | '已归档';
  createdAt: string;
  assignedSales: string;
  content: string;
  attachments: { name: string; url: string; size: string; type: 'image' | 'pdf' | 'cad' }[];
  aiReplyDraft?: string;
  aiScore: number;
}

// 3. In-sales Chat & Scripts Types (售中助手)
export interface SessionItem {
  id: string;
  customerName: string;
  avatar: string;
  channel: 'WhatsApp' | 'Email' | 'LiveChat' | 'WeChat Work';
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  tags: string[];
  assignedStaff: string;
  status: '沟通中' | '等待客户确认' | '图纸锁定' | '生产排单中' | '发货中';
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'customer' | 'sales' | 'ai_copilot';
  content: string;
  timestamp: string;
  translatedContent?: string;
  attachmentUrl?: string;
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

// 4. Marketing Assistant Types (推广助手)
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
  tags?: string[];
  // 复核流转信息
  wasPublished?: boolean; // 是否曾有正式发布版本
  pendingVersion?: string; // 正在复核中未生效的新版本号 (如 v2.5.0)
  reviewStatus?: 'pending' | 'approved' | 'rejected' | 'expired';
  reviewComment?: string; // 复核审核意见或驳回原因
  reviewer?: string; // 审核人 (平台管理员)
  reviewedAt?: string; // 审核时间
  pendingAction?: 'create' | 'update' | 'delete'; // 待复核动作类型
  // 变更与审计历史
  auditLogs?: KBAuditLog[];
  // 业务适用与权限管控配置
  applicableRoles?: string[]; // 适用岗位* (多选，如：外贸销售岗、内容推广岗、方案设计师等)
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
export interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  department: string;
  role: '超级管理员' | '外贸主管' | '销售业务员' | '推广运营官' | '内容审稿员';
  status: '在职 (正常)' | '已禁用';
  lastActive: string;
  aiQuotaLimit: number; // Daily AI calls limit
  aiQuotaUsed: number;
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
}

// 8. System Config Types (系统配置)
export interface SystemAgentConfig {
  agentName: string;
  primaryPersona: string;
  languageMode: '中英双语 (默认)' | '多国语言自动翻译' | '纯英文纯粹视角';
  temperature: number;
  geminiModel: string;
  autoReplyDelaySeconds: number;
  enableAiScore: boolean;
  enableCbmCalculator: boolean;
  enableWatermark: boolean;
  fobDefaultPort: string;
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
