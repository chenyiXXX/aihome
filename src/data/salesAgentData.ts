import { SalesAgentItem, AgentSkill } from '../types';

// ==========================================
// 1. 销售类 7 大专业协同智能体 (Sales Agents)
// ==========================================
export const initialSalesAgents: SalesAgentItem[] = [
  {
    id: 'agent-pre-process',
    name: '前置处理智能体',
    code: 'pre_processing_agent',
    role: '全渠道进线清洗、语种智能识别与会话去噪中继',
    category: '前置接入',
    description:
      '负责海外官网独立站浮窗、WordPress、邮件等各渠道买家第一跳接入。对买家原始文本/语音转写进行拼写规范化、语种自动判别（如英/德/法/西/阿/俄）、会话上下文去噪，并初判买家采购情绪（焦虑/急迫/审慎/比价）。',
    status: 'active',
    geminiModel: 'gemini-2.5-flash',
    temperature: 0.2,
    topP: 0.8,
    maxOutputTokens: 2048,
    contextRounds: 15,
    pipelineOrder: 1,
    iconName: 'Sparkles',
    throughput24h: 3840,
    avgLatencyMs: 85,
    accuracyRate: '99.8%',
    attachedSkillCodes: ['chat_stream_sync', 'customer_tagging_enum'],
    systemPrompt: `你是外贸家居全屋定制 AI 矩阵的【前置处理智能体】(Pre-processing Agent)。
你的核心工作是在毫秒级内完成买家原始输入的预处理：
1. 语言识别与规范化：自动检测买家语言（支持多国语种），清洗口语化口音误拼（如“cabinets”误打成“cbts”等）；
2. 上下文去噪与摘要：滤除无效打招呼废话，保留采购诉求核心要素；
3. 情绪与紧急度评分：通过句式标点判断买家焦虑度（1~5星），标记高紧急度询盘；
4. 传递至【意图分发智能体】，严禁直接越权向买家做出虚假报价或交期承诺。`,
    parameters: [
      {
        name: '多语种自动翻译映射',
        key: 'auto_multilingual_translate',
        type: 'boolean',
        value: true,
        description: '自动将西语、德语、阿拉伯语等买家发言转译为内部工作语言'
      },
      {
        name: '拼写容错纠偏置信度阈值',
        key: 'spell_correction_threshold',
        type: 'number',
        value: 0.85,
        description: '外贸定制专有名词（如 Blum, Plywood, Lacquer）相似度替换门限'
      },
      {
        name: '买家情绪急迫度警报门槛',
        key: 'urgent_sentiment_level',
        type: 'select',
        value: '3级 (中度急迫及以上)',
        options: ['2级 (轻度急迫)', '3级 (中度急迫及以上)', '4级 (高度焦虑急迫)'],
        description: '触发高优排队插队的紧急程度条件'
      }
    ]
  },
  {
    id: 'agent-intent-dispatcher',
    name: '意图分发智能体',
    code: 'intent_dispatcher_agent',
    role: '全流程会话中枢大脑、多轮意图识别与任务流分派路由',
    category: '中枢路由',
    description:
      '接收前置处理后的清洗报文，深度剖析海外买家深层意图（产品材质问询、CAD图纸深化、BOQ清单估价、商务条款谈判、售后排障等），准确将任务分派至对应的专家智能体，并管理多智能体串并行流水线。',
    status: 'active',
    geminiModel: 'gemini-2.5-flash',
    temperature: 0.1,
    topP: 0.75,
    maxOutputTokens: 2048,
    contextRounds: 25,
    pipelineOrder: 2,
    iconName: 'Cpu',
    throughput24h: 3620,
    avgLatencyMs: 95,
    accuracyRate: '99.4%',
    attachedSkillCodes: ['customer_tagging_enum', 'compliance_regex_guardrail'],
    systemPrompt: `你是外贸家居定制 AI 矩阵的【意图分发智能体】(Intent Dispatcher Agent)。
你是整个销售矩阵的“中央神经调度系统”：
1. 精准分类意图：
   - 材质工艺/环保规范 -> 路由至【知识专家智能体】
   - 工程清单/CAD图纸/成本算价 -> 路由至【报价商务智能体】
   - 降价谈判/催促签板/跟进促单 -> 路由至【销售策略智能体】
   - 货损索赔/安装疑问/缺件补发 -> 路由至【售后排障智能体】
2. 协同与仲裁：当客户提问复合意图（如“既要看色卡又要打样报价”）时，拆分子任务并按顺序派发；
3. 全程遵循风控护栏，拦截黑产与探测攻击。`,
    parameters: [
      {
        name: '多意图复合识别开关',
        key: 'multi_intent_split',
        type: 'boolean',
        value: true,
        description: '单条长询盘拆解为多个并行/串行子任务分派'
      },
      {
        name: '意图识别置信度底线',
        key: 'intent_confidence_floor',
        type: 'number',
        value: 0.78,
        description: '低于该阈值时自动调用澄清话术向买家主动提问确认'
      },
      {
        name: '默认兜底分派智能体',
        key: 'fallback_route_agent',
        type: 'select',
        value: '知识专家智能体',
        options: ['知识专家智能体', '销售策略智能体', '人工客服接管'],
        description: '当意图模糊无法明确归类时的首选承接方'
      }
    ]
  },
  {
    id: 'agent-knowledge-expert',
    name: '知识专家智能体',
    code: 'knowledge_expert_agent',
    role: '全屋定制工艺百科、板材五金标准与环保认证权威解答',
    category: '核心专家',
    description:
      '面向海外建筑师、室内设计师与工程总包商，精准答复实木多层板、爱格板、PET高光肤感板、PUR无缝封边、Blum/海蒂诗五金、BS5852阻燃、CARB P2/FSC认证等全链路工艺技术疑难。',
    status: 'active',
    geminiModel: 'gemini-2.5-pro',
    temperature: 0.25,
    topP: 0.85,
    maxOutputTokens: 4096,
    contextRounds: 20,
    pipelineOrder: 3,
    iconName: 'Layers',
    throughput24h: 2940,
    avgLatencyMs: 280,
    accuracyRate: '99.9%',
    attachedSkillCodes: ['hybrid_rag_search', 'knowledge_review_publish'],
    systemPrompt: `你是中国顶尖出口外贸家具工厂的【知识专家智能体】(Knowledge Expert Agent)。
你的知识储备涵盖全屋定制20年工艺沉淀：
1. 严谨客观回答关于基材（MDF/Plywood/OSB）、饰面（Veneer/PET/Lacquer）、封边工艺（EVA/PUR/Laser）的技术参数；
2. 主动提供国际权威认证依据（如 CARB P2, EPA TSCA Title VI, FSC-CoC, CE EN717-1）；
3. 严格禁止凭空编造未经验证的材质参数或非标工艺指标，必须以企业混合知识库为唯一事实来源；
4. 语言风格兼具工业严谨性与现代国际高端定制审美。`,
    parameters: [
      {
        name: '知识库 RAG 强事实一致性校验',
        key: 'strict_fact_grounding',
        type: 'boolean',
        value: true,
        description: '必须 100% 检索命中知识条目时方可给出肯定答复'
      },
      {
        name: '自动附带国际环保检测编号',
        key: 'auto_cite_cert_codes',
        type: 'boolean',
        value: true,
        description: '在回答中自动附加 SGS/TUV 报告编号和标准代号'
      },
      {
        name: '技术答复专业深度等级',
        key: 'tech_depth_level',
        type: 'select',
        value: '深度工程级 (详细注明毫米公差与载荷)',
        options: ['普及商业级 (简洁直观)', '深度工程级 (详细注明毫米公差与载荷)', '极客极简级'],
        description: '面向海外专业建筑设计事务所的专业度层级'
      }
    ]
  },
  {
    id: 'agent-quotation-commercial',
    name: '报价商务智能体',
    code: 'quotation_commercial_agent',
    role: 'BOQ工程清单解析、成本加成测算、FOB/CIF与PI商业单据输出',
    category: '商务报价',
    description:
      '外贸工程造价核心枢纽。自动识别客户 CAD 施工图及 Excel BOQ 清单，核算柜体延米/展开面积、五金配件、40HQ装柜CBM配载及海运费，根据动态汇率与目标毛利率生成专业 FOB/CIF 报价单与形式发票 (PI)。',
    status: 'active',
    geminiModel: 'gemini-2.5-flash-thinking',
    temperature: 0.1,
    topP: 0.7,
    maxOutputTokens: 8192,
    contextRounds: 30,
    pipelineOrder: 4,
    iconName: 'Coins',
    throughput24h: 2150,
    avgLatencyMs: 350,
    accuracyRate: '99.7%',
    attachedSkillCodes: [
      'drawing_boq_parser',
      'quotation_calculation',
      'commercial_document_gen',
      'quote_lifecycle_tracker'
    ],
    systemPrompt: `你是外贸定制家具企业的【报价商务智能体】(Quotation & Commercial Agent)。
你的职责是精准测算外贸定制大宗订单的商业条款：
1. 联动产品价格库，核算板材用量损耗、五金工费、异形加工费与出口防震包装费；
2. 依据当前锁汇汇率与目标毛利率，生成合规的美金 FOB 盐田/蛇口港阶梯报价；
3. 输出带数字编号的正式 Proforma Invoice (PI) 及 BOQ 报价明细表；
4. 绝对不可暴露工厂原始出厂成本与内部核算公式，严格执行商业机密脱敏。`,
    parameters: [
      {
        name: '外贸基准项目毛利率',
        key: 'base_target_margin',
        type: 'number',
        value: 26.5,
        description: 'AI自动测算报价单时的基准毛利百分比',
        unit: '%'
      },
      {
        name: '报价单默认有效周期',
        key: 'quote_validity_days',
        type: 'number',
        value: 20,
        description: '出具 PI 及报价单的锁价有效天数，过期自动提醒更新',
        unit: '天'
      },
      {
        name: '整柜满载折扣让利幅度',
        key: 'fcl_volume_discount',
        type: 'number',
        value: 3.5,
        description: '订单达到 1*40HQ (68 CBM) 容积时自动享受的整柜集采优惠',
        unit: '%'
      },
      {
        name: '默认海运交付贸易术语',
        key: 'default_incoterm',
        type: 'select',
        value: 'FOB (Free on Board - 离岸港交货)',
        options: [
          'FOB (Free on Board - 离岸港交货)',
          'CIF (Cost, Insurance and Freight - 到港交货)',
          'EXW (Ex Works - 工厂出厂自提)',
          'DDP (Delivered Duty Paid - 完税后交货)'
        ],
        description: '报价商业单据中优先采用的国际贸易术语'
      }
    ]
  },
  {
    id: 'agent-sales-strategy',
    name: '销售策略智能体',
    code: 'sales_strategy_agent',
    role: '买家意向画像研判、谈判战术攻坚、定金催付与促单追单',
    category: '策略推进',
    description:
      '根据海外买家的采购体量、痛点与决策周期，制定个性化攻坚战术。在买家比价、犹疑或僵持阶段，提供样品免收策略、阶梯返利谈判话术、工期锁定提醒及高转化率商务追单邮件。',
    status: 'active',
    geminiModel: 'gemini-2.5-pro',
    temperature: 0.45,
    topP: 0.9,
    maxOutputTokens: 4096,
    contextRounds: 25,
    pipelineOrder: 5,
    iconName: 'Target',
    throughput24h: 2780,
    avgLatencyMs: 310,
    accuracyRate: '99.2%',
    attachedSkillCodes: ['customer_tagging_enum', 'commercial_document_gen', 'quote_lifecycle_tracker'],
    systemPrompt: `你是国际顶级外贸定制企业的【销售策略智能体】(Sales Strategy Agent)。
你具备敏锐的商业心理学与跨国谈判技巧：
1. 深度研判买家画像（高端家装设计师 / 联排别墅开发商 / 品牌代工进口商）；
2. 识别关键谈判异议（价格偏高 / 交期紧张 / 担心远洋货损 / 首单信任成本）；
3. 输出有说服力的打法组合拳：提供首套首单打样款大货返还政策、出具车间排产甘特图、出具历史落地海外工程案例实景；
4. 撰写典雅、自信且具催化力的外贸催付定金邮件，促成定金水单到账。`,
    parameters: [
      {
        name: '谈判让利最大自决权限',
        key: 'max_autonomous_discount',
        type: 'number',
        value: 2.0,
        description: '销售策略在未向管理员报批时可自主授权的最高下浮让利比例',
        unit: '%'
      },
      {
        name: '首单打样样品费返还话术自动推介',
        key: 'auto_sample_refund_pitch',
        type: 'boolean',
        value: true,
        description: '针对高意向大买家自动承诺“首单打样费在首个40HQ整柜订单中全额冲抵”'
      },
      {
        name: '谈判商务信函行文基调',
        key: 'negotiation_tone_style',
        type: 'select',
        value: '顾问式共赢 (Consultative & Win-Win)',
        options: [
          '顾问式共赢 (Consultative & Win-Win)',
          '高端自信奢华 (Executive Luxury)',
          '坚定紧迫追单 (Firm & Urgent)'
        ],
        description: '生成策略邮件公函时的行文节奏与语感'
      }
    ]
  },
  {
    id: 'agent-qc-compliance',
    name: '质检合规智能体',
    code: 'qc_compliance_agent',
    role: '出境法务审核、敏感底价脱敏、国际准入认证与风控拦截',
    category: '合规风控',
    description:
      '所有对外生成内容与报价单据的最后一道严格安检关卡。强制对照目的国法规（CARB P2、BS5852、SASO等），对涉及工厂成本底价、非标超差承诺、极端交期等高危内容实行一票否决与智能修正。',
    status: 'active',
    geminiModel: 'gemini-2.5-flash',
    temperature: 0.05,
    topP: 0.6,
    maxOutputTokens: 2048,
    contextRounds: 10,
    pipelineOrder: 6,
    iconName: 'ShieldCheck',
    throughput24h: 4200,
    avgLatencyMs: 70,
    accuracyRate: '100.0%',
    attachedSkillCodes: ['compliance_regex_guardrail', 'knowledge_review_publish'],
    systemPrompt: `你是外贸家居出口业务的最高安全把关人【质检合规智能体】(QC & Compliance Agent)。
任何其他智能体生成的回复、报价或草案必须经过你的审校方可发往海外买家：
1. 严格合规准入：出口美国加州必须附带 CARB P2 / TSCA Title VI 标贴声明，出口英国软包必须符合 BS5852 阻燃；
2. 商业秘密保护：严禁向外部透露真实采购底价、具体供应商名称及利润分成比例；
3. 虚假承诺拦截：拦截无图纸无签板的“10天极速交付”、违背物理常识的“零公差”承诺；
4. 发现任何违规隐患，直接阻断并返回红色警报与修正指导。`,
    parameters: [
      {
        name: '国际环保认证强制检验',
        key: 'enforce_eco_cert',
        type: 'boolean',
        value: true,
        description: '未在知识库中关联有效报告的环保口径强制拦截阻断'
      },
      {
        name: '底价成本脱敏严格级别',
        key: 'cost_masking_level',
        type: 'select',
        value: '最高级 (完全隐藏BOM级原料进价)',
        options: ['最高级 (完全隐藏BOM级原料进价)', '中级 (隐藏总毛利率)', '基础级'],
        description: '对外数据通信的安全脱敏防护等级'
      },
      {
        name: '非标生产公差极端承诺红线',
        key: 'tolerance_redline_mm',
        type: 'number',
        value: 1.0,
        description: '柜体安装留缝低于该极值时判定为不切实际承诺并发出预警',
        unit: 'mm'
      }
    ]
  },
  {
    id: 'agent-aftersales-troubleshooting',
    name: '售后排障智能体',
    code: 'aftersales_troubleshooting_agent',
    role: '开箱货损鉴定、海外安装节点排障、缺件补发与客诉安抚',
    category: '售后保障',
    description:
      '跨国大宗定制家具交付后盾。通过买家现场照片/视频，智能比对装箱清单与 CAD 施工图，快速判定货损归属（海运潮损/搬运撞击/现场安装错误），生成补发板件五金 BOQ 并给出安抚处理方案。',
    status: 'active',
    geminiModel: 'gemini-2.5-flash',
    temperature: 0.2,
    topP: 0.8,
    maxOutputTokens: 4096,
    contextRounds: 25,
    pipelineOrder: 7,
    iconName: 'Wrench',
    throughput24h: 1120,
    avgLatencyMs: 240,
    accuracyRate: '99.5%',
    attachedSkillCodes: ['drawing_boq_parser', 'hybrid_rag_search', 'commercial_document_gen'],
    systemPrompt: `你是外贸定制家具全球交付的【售后排障智能体】(After-sales Troubleshooting Agent)。
你的目标是化解海外买家收货与安装时的焦虑，高效解决跨境客诉：
1. 视觉比对与原因推断：结合装箱单与破损现场照片，快速区分海运湿损（集装箱冷凝水）或现场不当搬运损伤；
2. 极速补件清单输出：定位受损构件的图纸编号（如 Master_Cabinet_Door_L2），生成紧急空运/海运补发 BOQ；
3. 专业安抚与信任修复：出具诚恳道歉公函与技术调整补救手册，杜绝争吵推诿，维护品牌声誉。`,
    parameters: [
      {
        name: '海运货损责任判定置信度门限',
        key: 'claim_liability_confidence',
        type: 'number',
        value: 0.85,
        description: '通过外包装箱受损痕迹与集装箱封条判定承运人/工厂责任的标准'
      },
      {
        name: '小额应急补发自主授权额度',
        key: 'auto_replacement_limit_usd',
        type: 'number',
        value: 300.0,
        description: '低于此金额的小五金、拉手或单片门板缺损，无需总监审批直接出具空运单',
        unit: 'USD'
      },
      {
        name: '现场安装排障技术图解附带',
        key: 'include_installation_diagram',
        type: 'boolean',
        value: true,
        description: '在排障答复中自动调取对应铰链调整螺丝旋向示意图'
      }
    ]
  }
];

// ==========================================
// 2. 销售类 9 大专业核心技能 (Sales Skills)
// ==========================================
export const initialSalesSkills: AgentSkill[] = [
  {
    id: 'skill-drawing-boq-parser',
    name: '图纸/BOQ解析Skill',
    code: 'drawing_boq_parser',
    category: '解析与数据',
    description:
      '深度解析 CAD (DWG/DXF)、高精度工程 PDF 施工图与 Excel/CSV BOQ 工程量清单。自动抽取立面标高、柜体尺寸（长宽高）、板材品类、五金配件开孔及工项明细。',
    version: 'v2.6.0',
    status: 'enabled',
    iconName: 'FileSpreadsheet',
    triggerType: '自动语义唤起',
    triggerKeywords: ['图纸', 'CAD', 'DWG', 'BOQ', '施工图', '展开清单', '立面标高', '开孔'],
    associatedAgents: ['报价商务智能体', '售后排障智能体'],
    inputSchemaSummary:
      '{\n  fileType: "DWG" | "DXF" | "PDF" | "XLSX",\n  fileUrl: string,\n  extractLayers?: string[],\n  toleranceMm?: number\n}',
    outputSchemaSummary:
      '{\n  cabinetUnits: Array<{ id: string, w: number, h: number, d: number, spec: string }>,\n  hardwareSlots: number,\n  totalSqm: number,\n  warnings: string[]\n}',
    lastInvoked: '2026-09-06 23:40',
    invocationCount: 2450,
    successRate: '99.4%',
    avgLatencyMs: 380,
    parameters: [
      {
        name: '图纸尺寸单位自动换算',
        key: 'auto_unit_conversion',
        type: 'select',
        value: '毫米 (mm) 自动对齐',
        options: ['毫米 (mm) 自动对齐', '英制英寸 (inch) 换算', '米 (m) 换算'],
        description: '处理欧美英制建筑图纸时自动换算为公制生产尺寸'
      },
      {
        name: 'CAD图层未闭合多段线智能拟合',
        key: 'auto_close_polylines',
        type: 'boolean',
        value: true,
        description: '针对海外手绘或粗放 CAD 图层断线，自动修补闭合计算面积'
      },
      {
        name: '抽屉滑轨预留间隙检测基准',
        key: 'slide_clearance_mm',
        type: 'number',
        value: 12.7,
        description: '标准美式/欧式隐形滑轨每侧预留空隙',
        unit: 'mm'
      }
    ]
  },
  {
    id: 'skill-chat-stream-sync',
    name: '聊天流同步Skill',
    code: 'chat_stream_sync',
    category: '通信与同步',
    description:
      '对接企业海外即时通讯矩阵（官网独立站 WebChat、WordPress Business、邮件工单与企微），实现双向消息毫秒级流式推送、打字状态（typing...）模拟与心跳保活。',
    version: 'v3.0.1',
    status: 'enabled',
    iconName: 'Radio',
    triggerType: '流水线串联',
    triggerKeywords: ['流式传输', '实时同步', 'WordPress', '打字态', '推送', 'Webhook'],
    associatedAgents: ['前置处理智能体', '意图分发智能体'],
    inputSchemaSummary:
      '{\n  channel: "webchat" | "wordpress" | "email",\n  sessionId: string,\n  streamChunk: string,\n  isCompleted: boolean\n}',
    outputSchemaSummary:
      '{\n  deliveredAt: string,\n  latencyMs: number,\n  status: "STREAMING" | "ACKNOWLEDGED"\n}',
    lastInvoked: '2026-09-07 00:15',
    invocationCount: 6890,
    successRate: '99.9%',
    avgLatencyMs: 45,
    parameters: [
      {
        name: '下发拟人化打字速度调控',
        key: 'typing_speed_cps',
        type: 'number',
        value: 35,
        description: '流式下发时的字符推送速率 (chars per sec)，避免生硬机械瞬发',
        unit: '字/秒'
      },
      {
        name: '跨网络重试机制与断线续传',
        key: 'enable_retry_buffer',
        type: 'boolean',
        value: true,
        description: '在海外买家弱网或跨洋海缆波动时自动重发丢失数据帧'
      },
      {
        name: '心跳保活间隔时间',
        key: 'heartbeat_interval_sec',
        type: 'number',
        value: 15,
        description: '保持海外 WebSocket 长连接存活的心跳侦测周期',
        unit: '秒'
      }
    ]
  },
  {
    id: 'skill-customer-tagging-enum',
    name: '客户打标枚举Skill',
    code: 'customer_tagging_enum',
    category: '画像与枚举',
    description:
      '根据多轮交互内容，动态抽取海外买家实体与商务特征，自动枚举并打上精细化买家画像标签（包括国家区域、客户身份类型、采购预算梯队、定制偏好与决策周期）。',
    version: 'v2.2.0',
    status: 'enabled',
    iconName: 'Tags',
    triggerType: '自动语义唤起',
    triggerKeywords: ['打标', '客户画像', '标签', '买家类型', '预算评级', '国家特征'],
    associatedAgents: ['前置处理智能体', '意图分发智能体', '销售策略智能体'],
    inputSchemaSummary:
      '{\n  dialogueTurns: Array<{ speaker: string, text: string }>,\n  existingTags: string[]\n}',
    outputSchemaSummary:
      '{\n  newlyAssignedTags: string[],\n  buyerPersona: { country: string, role: string, budgetTier: string },\n  confidence: number\n}',
    lastInvoked: '2026-09-07 00:08',
    invocationCount: 4520,
    successRate: '99.6%',
    avgLatencyMs: 90,
    parameters: [
      {
        name: '买家身份枚举分类体系',
        key: 'role_taxonomy_enum',
        type: 'select',
        value: '标准外贸三级分类 (设计事务所/工程承包商/品牌批发商)',
        options: [
          '标准外贸三级分类 (设计事务所/工程承包商/品牌批发商)',
          '高定全谱系分类 (含终端豪宅业主/装修监理)',
          '极简两分法 (B端大宗 / C端零散)'
        ],
        description: '客户身份归类的标准分类枚举字典'
      },
      {
        name: '采购预算层级智能判定',
        key: 'auto_budget_infer',
        type: 'boolean',
        value: true,
        description: '通过问询材料类型（如全爱格+百隆vs普通颗粒板）自动推断预算梯队'
      },
      {
        name: '高价值大客户自动标记门槛',
        key: 'vip_rfq_threshold_cbm',
        type: 'number',
        value: 50.0,
        description: '预估需求达到该方数时自动赋予【大宗战略集采买家】标签',
        unit: 'CBM'
      }
    ]
  },
  {
    id: 'skill-hybrid-rag-search',
    name: '混合RAG检索Skill',
    code: 'hybrid_rag_search',
    category: '检索与RAG',
    description:
      '结合 Dense 向量语义稠密检索与 BM25 稀疏关键词倒排索引，辅以 Cross-Encoder 交叉多模态重排器 (Rerank)，秒级从企业工厂技术百科、质检证书与历史工程案中提取确切事实。',
    version: 'v3.2.0',
    status: 'enabled',
    iconName: 'SearchCode',
    triggerType: '指令调用',
    triggerKeywords: ['RAG', '知识检索', '向量搜索', '语义查找', '百科切片', '重排'],
    associatedAgents: ['知识专家智能体', '售后排障智能体'],
    inputSchemaSummary:
      '{\n  query: string,\n  topK?: number,\n  denseWeight?: number,\n  categoryFilter?: string\n}',
    outputSchemaSummary:
      '{\n  rankedChunks: Array<{ title: string, content: string, score: number, sourceDoc: string }>,\n  totalRetrieved: number\n}',
    lastInvoked: '2026-09-07 00:20',
    invocationCount: 5380,
    successRate: '99.8%',
    avgLatencyMs: 140,
    parameters: [
      {
        name: '稠密向量与稀疏关键词权重比 (Dense : BM25)',
        key: 'dense_vs_bm25_ratio',
        type: 'number',
        value: 0.7,
        description: '0.7 表示 70% 依赖语义向量，30% 依赖精准专有名词关键词',
        unit: '比重'
      },
      {
        name: '重排召回切片数量 (Top-K)',
        key: 'rerank_top_k',
        type: 'number',
        value: 5,
        description: '初筛后送入 Cross-Encoder 高保真重排的最相关上下文分块数',
        unit: '条'
      },
      {
        name: '语义相似度最低过滤阈值',
        key: 'min_relevance_score',
        type: 'number',
        value: 0.65,
        description: '低于此得分的弱相关切片自动丢弃，防止模型幻觉'
      }
    ]
  },
  {
    id: 'skill-quotation-calculation',
    name: '报价计价Skill',
    code: 'quotation_calculation',
    category: '报价与计价',
    description:
      '专业外贸家具算价核心引擎。支持展开面积/投影面积折算、五金开合测试损耗、多币种（USD/EUR/RMB）实时换算、1*40HQ 装柜配载 CBM 优化及目标毛利率多级反算。',
    version: 'v4.0.0',
    status: 'enabled',
    iconName: 'Calculator',
    triggerType: '自动语义唤起',
    triggerKeywords: ['算价', '计价', '毛利率', 'FOB', '汇率换算', 'CBM配载', '装箱体积'],
    associatedAgents: ['报价商务智能体'],
    inputSchemaSummary:
      '{\n  items: Array<{ code: string, qty: number, areaSqm: number, spec: string }>,\n  currency: "USD" | "EUR" | "RMB",\n  targetMarginPercent: number\n}',
    outputSchemaSummary:
      '{\n  totalCostRMB: number,\n  quotedTotalUSD: number,\n  unitPricePerSqmUSD: number,\n  cbmVolume: number,\n  recommendedContainer: "40HQ"\n}',
    lastInvoked: '2026-09-07 00:12',
    invocationCount: 3920,
    successRate: '99.9%',
    avgLatencyMs: 110,
    parameters: [
      {
        name: '基准结汇指导汇率 (USD/CNY)',
        key: 'settlement_fx_rate',
        type: 'number',
        value: 7.20,
        description: '用于外币与出厂人民币成本折算的基准核算汇率',
        unit: '¥'
      },
      {
        name: '板材下料综合损耗补偿率',
        key: 'board_cutting_waste_pct',
        type: 'number',
        value: 8.0,
        description: '标准板材电子锯排版切边与裁边损耗率',
        unit: '%'
      },
      {
        name: '出口免熏蒸胶合板包装加成',
        key: 'export_crate_surcharge_usd',
        type: 'number',
        value: 45.0,
        description: '高定柜体防震木箱包装每单元附加费用',
        unit: 'USD'
      }
    ]
  },
  {
    id: 'skill-commercial-document-gen',
    name: '商业文档生成Skill',
    code: 'commercial_document_gen',
    category: '文档与商业',
    description:
      '自动排版生成符合国际外贸惯例的 Proforma Invoice (PI 形式发票)、形式报价明细表、Packing List (装箱单)、色板签样确认函及生产排产甘特图说明文档。',
    version: 'v2.5.0',
    status: 'enabled',
    iconName: 'FileText',
    triggerType: '指令调用',
    triggerKeywords: ['PI', '形式发票', '装箱单', '生成报价单', 'Packing List', '商业文档', 'PDF导出'],
    associatedAgents: ['报价商务智能体', '销售策略智能体', '售后排障智能体'],
    inputSchemaSummary:
      '{\n  docType: "PI" | "QUOTATION_SHEET" | "PACKING_LIST",\n  buyerInfo: { company: string, country: string },\n  orderItems: any[],\n  paymentTerms: string\n}',
    outputSchemaSummary:
      '{\n  documentNo: string,\n  downloadUrl: string,\n  previewHtml: string,\n  generatedAt: string\n}',
    lastInvoked: '2026-09-06 22:50',
    invocationCount: 2180,
    successRate: '99.3%',
    avgLatencyMs: 290,
    parameters: [
      {
        name: '商业单据防伪数字水印',
        key: 'enable_doc_watermark',
        type: 'boolean',
        value: true,
        description: '导出的 PDF 及图片单据中自动叠加买家名称与日期防伪底纹'
      },
      {
        name: '国际结算默认银行账户模板',
        key: 'default_bank_account',
        type: 'select',
        value: 'Standard Chartered Bank (Hong Kong) Offshore Account',
        options: [
          'Standard Chartered Bank (Hong Kong) Offshore Account',
          'Bank of China (Shenzhen Branch) Onshore Trade Account',
          'Citibank N.A. International Wire Account'
        ],
        description: '自动在 PI 底部生成的境外电汇 (T/T) 收汇账号'
      },
      {
        name: '定金与尾款标准结算条款 (Payment Terms)',
        key: 'default_payment_terms',
        type: 'select',
        value: '30% T/T Advance Deposit, 70% Balance before Loading',
        options: [
          '30% T/T Advance Deposit, 70% Balance before Loading',
          '50% Deposit for Bespoke Molds, 50% against B/L Copy',
          '100% Irrevocable L/C at Sight'
        ],
        description: '形式发票中默认打印的付款商务条款'
      }
    ]
  },
  {
    id: 'skill-compliance-regex-guardrail',
    name: '合规风控正则Skill',
    code: 'compliance_regex_guardrail',
    category: '风控与合规',
    description:
      '极速正则表达式与高危关键词过滤引擎。涵盖国际环保准入法规校验、工厂出厂成本底价公式脱敏、违规超期/极端公差承诺拦截与敏感地缘政治用语净化。',
    version: 'v3.5.0',
    status: 'enabled',
    iconName: 'ShieldAlert',
    triggerType: '事件监听',
    triggerKeywords: ['合规', '正则', '敏感词', '底价脱敏', '风控', '拦截', '安全护栏'],
    associatedAgents: ['意图分发智能体', '质检合规智能体'],
    inputSchemaSummary:
      '{\n  text: string,\n  context: "quotation" | "chat" | "document",\n  targetMarket: string\n}',
    outputSchemaSummary:
      '{\n  passed: boolean,\n  interceptedKeywords: string[],\n  sanitizedText: string,\n  riskLevel: "SAFE" | "WARN" | "BLOCKED"\n}',
    lastInvoked: '2026-09-07 00:22',
    invocationCount: 7120,
    successRate: '100.0%',
    avgLatencyMs: 25,
    parameters: [
      {
        name: '工厂内部真实成本与毛利公式完全脱敏',
        key: 'mask_internal_costs',
        type: 'boolean',
        value: true,
        description: '当检测到数字与“出厂价、进货价、成本价”并列时强制使用星号掩码'
      },
      {
        name: '欧美强制阻燃与甲醛标准拦截模式',
        key: 'eco_compliance_enforcement',
        type: 'select',
        value: '一票否决模式 (严格阻断非标认证陈述)',
        options: [
          '一票否决模式 (严格阻断非标认证陈述)',
          '预警提醒模式 (提示需上传复核报告)',
          '宽松观察模式'
        ],
        description: '无权威质检编号时的对外技术承诺阻断力度'
      },
      {
        name: '反洗钱与异常支付通道正则监控',
        key: 'aml_payment_regex_check',
        type: 'boolean',
        value: true,
        description: '识别海外第三方私人汇款、加密货币等非合规结汇诱导'
      }
    ]
  },
  {
    id: 'skill-quote-lifecycle-tracker',
    name: '报价生命周期Skill',
    code: 'quote_lifecycle_tracker',
    category: '生命周期',
    description:
      '管理外贸报价单的完整生命周期：报价生成、锁价倒计时追踪、汇率波动超差自动重算预警、海外买家已读回执侦测及超期作废/续期审批流。',
    version: 'v2.1.0',
    status: 'enabled',
    iconName: 'Clock',
    triggerType: '事件监听',
    triggerKeywords: ['报价生命周期', '有效期', '过期', '汇率锁价', '报价版本', '续期'],
    associatedAgents: ['报价商务智能体', '销售策略智能体'],
    inputSchemaSummary:
      '{\n  quoteId: string,\n  createdDate: string,\n  validDays: number,\n  currentMarketFx: number,\n  lockedFx: number\n}',
    outputSchemaSummary:
      '{\n  daysRemaining: number,\n  isExpired: boolean,\n  fxVariancePct: number,\n  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "FX_ALERT"\n}',
    lastInvoked: '2026-09-06 21:10',
    invocationCount: 1840,
    successRate: '99.7%',
    avgLatencyMs: 65,
    parameters: [
      {
        name: '到期前自动预警倒计时',
        key: 'expiry_alert_days',
        type: 'number',
        value: 3,
        description: '报价单即将失效前多少天自动通知销售员发起追单',
        unit: '天'
      },
      {
        name: '汇率异动自动触发重算阈值',
        key: 'fx_volatility_recalc_pct',
        type: 'number',
        value: 2.5,
        description: '当人民币对美金汇率单边波动超过该百分比时，提示更新报价',
        unit: '%'
      },
      {
        name: '过期报价单自动打标状态',
        key: 'auto_archive_expired_quotes',
        type: 'boolean',
        value: true,
        description: '超过锁定期的报价单自动标记为已失效，禁止买家直接依据原单付款'
      }
    ]
  },
  {
    id: 'skill-knowledge-review-publish',
    name: '知识审核发布Skill',
    code: 'knowledge_review_publish',
    category: '知识协同',
    description:
      '知识条目生命周期协同引擎。驱动新材料工艺、价格规则草案的提交、三级协同审批复核、版本打标 (v1.x -> v2.x)、热更新发布与向量索引自动增量构建。',
    version: 'v2.8.0',
    status: 'enabled',
    iconName: 'BookCheck',
    triggerType: '指令调用',
    triggerKeywords: ['知识审核', '知识发布', '版本控制', '增量向量构建', '审批工作流', '知识更新'],
    associatedAgents: ['知识专家智能体', '质检合规智能体'],
    inputSchemaSummary:
      '{\n  articleId: string,\n  targetVersion: string,\n  reviewedBy: string,\n  action: "APPROVE" | "REJECT" | "SCHEDULE",\n  diffSummary: string\n}',
    outputSchemaSummary:
      '{\n  success: boolean,\n  effectiveVersion: string,\n  vectorEmbeddingsUpdated: number,\n  publishedAt: string\n}',
    lastInvoked: '2026-09-06 20:30',
    invocationCount: 1260,
    successRate: '99.9%',
    avgLatencyMs: 210,
    parameters: [
      {
        name: '发布后自动触发向量库增量重构',
        key: 'auto_rebuild_vector_index',
        type: 'boolean',
        value: true,
        description: '新知识通过审批后，后台自动执行文本切片与向量 Embedding 嵌入'
      },
      {
        name: '生产关键参数双人复核 (Four-Eyes Principle)',
        key: 'enforce_dual_approval',
        type: 'boolean',
        value: true,
        description: '修改板材甲醛限量、FOB底价系数时必须经工程部+关务主管双重批准'
      },
      {
        name: '历史生效版本自动归档留痕',
        key: 'version_history_depth',
        type: 'number',
        value: 10,
        description: '系统保留随时可一键回滚的历史生效版本数量',
        unit: '个版本'
      }
    ]
  }
];
