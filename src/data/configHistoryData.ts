import { ConfigChangeRecord, SalesAgentItem, AgentSkill } from '../types';

/**
 * 默认预设的智能体修改历史记录 (严格对应 Agent 实际配置项：Prompt、挂载Skill、单次Token)
 */
export const defaultAgentHistoryMap: Record<string, ConfigChangeRecord[]> = {
  'agent-pre-process': [
    {
      id: 'HIST-AG-001',
      targetId: 'agent-pre-process',
      targetType: 'agent',
      targetName: '前置处理智能体',
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: '2026-09-17 10:15:24',
      changeType: 'prompt',
      changeSummary: '优化系统核心指令，增强全渠道多语种买家进线意图纠偏',
      diffDetails: [
        { field: '系统核心指令 (System Prompt)', before: '基础进线买家接待与拼写校验', after: '强化全渠道进线多语种识别与外贸专有名词/缩写容错纠偏' }
      ]
    },
    {
      id: 'HIST-AG-002',
      targetId: 'agent-pre-process',
      targetType: 'agent',
      targetName: '前置处理智能体',
      operatorName: 'Sophia Wang',
      operatorRole: '外贸主管',
      timestamp: '2026-09-14 16:40:02',
      changeType: 'skills',
      changeSummary: '挂载客户画像标签枚举Skill组件',
      diffDetails: [
        { field: '挂载技能清单 (attachedSkills)', before: 'chat_stream_sync', after: 'chat_stream_sync, customer_tagging_enum' }
      ]
    },
    {
      id: 'HIST-AG-003',
      targetId: 'agent-pre-process',
      targetType: 'agent',
      targetName: '前置处理智能体',
      operatorName: '李工',
      operatorRole: '系统架构师',
      timestamp: '2026-09-10 09:20:15',
      changeType: 'parameter',
      changeSummary: '调大单次最大输出 Token 上限',
      diffDetails: [
        { field: '最大单次 Token', before: '2048', after: '4096' }
      ]
    }
  ],

  'agent-intent-dispatcher': [
    {
      id: 'HIST-AG-004',
      targetId: 'agent-intent-dispatcher',
      targetType: 'agent',
      targetName: '意图分发智能体',
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: '2026-09-16 14:22:18',
      changeType: 'prompt',
      changeSummary: '更新意图分发规则，增加对复合图纸审阅与打样意图的流水线拆解',
      diffDetails: [
        { field: '系统核心指令 (System Prompt)', before: '意图四分类：材质/报价/谈判/售后', after: '新增复合意图自动拆分：图纸CAD深化 + BOQ预核价两步串联分派' }
      ]
    },
    {
      id: 'HIST-AG-005',
      targetId: 'agent-intent-dispatcher',
      targetType: 'agent',
      targetName: '意图分发智能体',
      operatorName: 'Sophia Wang',
      operatorRole: '外贸主管',
      timestamp: '2026-09-12 11:30:45',
      changeType: 'skills',
      changeSummary: '挂载合规校验与风控拦截 Skill',
      diffDetails: [
        { field: '挂载技能清单 (attachedSkills)', before: 'customer_tagging_enum', after: 'customer_tagging_enum, compliance_regex_guardrail' }
      ]
    }
  ],

  'agent-knowledge-expert': [
    {
      id: 'HIST-AG-006',
      targetId: 'agent-knowledge-expert',
      targetType: 'agent',
      targetName: '知识专家智能体',
      operatorName: '李工',
      operatorRole: '资深木作工艺师',
      timestamp: '2026-09-17 08:45:10',
      changeType: 'prompt',
      changeSummary: '补充欧标 EN 13986 与美标 CARB P2 板材环保合规比对知识库问答准则',
      diffDetails: [
        { field: '系统核心指令 (System Prompt)', before: '重点涵盖 E0 / F4星标准与油漆工艺', after: '增加加州 CARB Phase 2、TSCA Title VI 认证标准与爱格板饰面工艺解答规范' }
      ]
    },
    {
      id: 'HIST-AG-007',
      targetId: 'agent-knowledge-expert',
      targetType: 'agent',
      targetName: '知识专家智能体',
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: '2026-09-13 17:10:00',
      changeType: 'parameter',
      changeSummary: '扩展单次最大输出 Token 数量以满足工程长文本解答',
      diffDetails: [
        { field: '最大单次 Token', before: '4096', after: '8192' }
      ]
    }
  ],

  'agent-quotation-commercial': [
    {
      id: 'HIST-AG-008',
      targetId: 'agent-quotation-commercial',
      targetType: 'agent',
      targetName: '报价商务智能体',
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: '2026-09-16 17:35:40',
      changeType: 'skills',
      changeSummary: '挂载最新版海运排柜算法 Skill 与 FOB/CIF 计价引擎',
      diffDetails: [
        { field: '挂载技能清单 (attachedSkills)', before: 'fob_cif_pricing_engine', after: 'fob_cif_pricing_engine, container_cbm_calc' }
      ]
    },
    {
      id: 'HIST-AG-009',
      targetId: 'agent-quotation-commercial',
      targetType: 'agent',
      targetName: '报价商务智能体',
      operatorName: 'Alex Schmidt',
      operatorRole: '销售业务员',
      timestamp: '2026-09-11 13:15:20',
      changeType: 'prompt',
      changeSummary: '优化工程批量折扣阶梯指引与国际商会 Incoterms 条款说明',
      diffDetails: [
        { field: '系统核心指令 (System Prompt)', before: '标准 FOB 核价模版', after: '强化阶梯批量折扣与国际商会 Incoterms 规则指引' }
      ]
    }
  ],

  'agent-sales-strategy': [
    {
      id: 'HIST-AG-010',
      targetId: 'agent-sales-strategy',
      targetType: 'agent',
      targetName: '销售策略智能体',
      operatorName: 'Sophia Wang',
      operatorRole: '外贸主管',
      timestamp: '2026-09-15 15:50:12',
      changeType: 'prompt',
      changeSummary: '优化欧洲工程买家催促签板与降价谈判博弈策略提示词',
      diffDetails: [
        { field: '系统核心指令 (System Prompt)', before: '通用外贸跟进话术模版', after: '引入 SPIC 谈判策略：锁定样品打样确认周期，阶梯式让步附加质保条款' }
      ]
    }
  ],

  'agent-qc-compliance': [
    {
      id: 'HIST-AG-011',
      targetId: 'agent-qc-compliance',
      targetType: 'agent',
      targetName: '合规风控智能体',
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: '2026-09-15 11:20:00',
      changeType: 'prompt',
      changeSummary: '加入 FSC 森林认证与欧美阻燃标准 (BS 5852 / TB 117) 拦截准则',
      diffDetails: [
        { field: '系统核心指令 (System Prompt)', before: '常规产品品质标准审核', after: '加入 FSC 森林认证与欧美阻燃标准 (BS 5852 / TB 117) 拦截准则' }
      ]
    }
  ],

  'agent-aftersales-troubleshooting': [
    {
      id: 'HIST-AG-012',
      targetId: 'agent-aftersales-troubleshooting',
      targetType: 'agent',
      targetName: '售后排障智能体',
      operatorName: 'Elena Rostova',
      operatorRole: '营销与客服专家',
      timestamp: '2026-09-14 09:10:35',
      changeType: 'prompt',
      changeSummary: '更新国际海运集装箱受潮霉变与五金件海损索赔取证指引',
      diffDetails: [
        { field: '系统核心指令 (System Prompt)', before: '基础售后故障排除', after: '指导买家提供理赔4张必拍照片：集装箱封条、外箱唛头、破损局部与批号标签' }
      ]
    }
  ]
};

/**
 * 默认预设的 Skill 修改历史记录 (按 Skill ID 索引)
 */
export const defaultSkillHistoryMap: Record<string, ConfigChangeRecord[]> = {
  'skill-cbm-calc': [
    {
      id: 'HIST-SK-001',
      targetId: 'skill-cbm-calc',
      targetType: 'skill',
      targetName: '国际海运与集装箱智能配载计算',
      operatorName: '李工',
      operatorRole: '资深木作工艺师',
      timestamp: '2026-09-16 15:20:10',
      changeType: 'parameter',
      changeSummary: '更新 40HQ 柜型有效装箱容积安全折减系数与堆码防压限制',
      diffDetails: [
        { field: '40HQ 容积预留冗余比', before: '88.0%', after: '91.5%' },
        { field: '板式平铺装箱堆叠限制', before: '最高12层', after: '最高15层(须带防压护角)' }
      ]
    },
    {
      id: 'HIST-SK-002',
      targetId: 'skill-cbm-calc',
      targetType: 'skill',
      targetName: '国际海运与集装箱智能配载计算',
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: '2026-09-12 11:05:33',
      changeType: 'files',
      changeSummary: '更新 handler.ts 算力算法，支持不规则实木雕花件离散容积自动包络计算',
      diffDetails: [
        { field: '代码文件 (handler.ts)', before: '基础长宽高乘积包络盒', after: '重构 3D 凸包网格算法并优化浮点截断精度' },
        { field: '版本号 (version)', before: 'v2.1.0', after: 'v2.2.0' }
      ],
      fileDiffs: [
        {
          fileName: 'handler.ts',
          changeType: 'modified',
          oldContent: `/**\n * [v2.1.0 旧版代码] 国际海运与集装箱配载计算 Handler\n */\nexport function calculateCBM(lengthMm: number, widthMm: number, heightMm: number, count: number): number {\n  // 旧版基础包络盒直接乘积计算\n  const unitCbm = (lengthMm * widthMm * heightMm) / 1000000000;\n  return Number((unitCbm * count).toFixed(3));\n}\n\nexport function estimateContainerLoad(totalCbm: number, containerType: '20GP' | '40GP' | '40HQ'): number {\n  const cap = containerType === '20GP' ? 28 : containerType === '40GP' ? 58 : 68;\n  return Math.min(100, (totalCbm / cap) * 100);\n}`,
          newContent: `/**\n * [v2.2.0 新版代码] 国际海运与集装箱配载计算 Handler\n * 新增：支持不规则实木雕花件凸包离散网格容积折算与装箱防压护角冗余校验\n */\nexport function calculateCBM(lengthMm: number, widthMm: number, heightMm: number, count: number, irregularFactor = 1.05): number {\n  // 新版优化：引入非标异形工件凸包曲率折减补偿系数\n  const rawUnitCbm = (lengthMm * widthMm * heightMm) / 1000000000;\n  const finalUnitCbm = rawUnitCbm * irregularFactor;\n  return Number((finalUnitCbm * count).toFixed(4));\n}\n\nexport function estimateContainerLoad(totalCbm: number, containerType: '20GP' | '40GP' | '40HQ', safetyBuffer = 0.915): {\n  loadRatePercent: number;\n  usableCbm: number;\n  isOverload: boolean;\n} {\n  const rawCap = containerType === '20GP' ? 28 : containerType === '40GP' ? 58 : 68;\n  const usableCbm = Number((rawCap * safetyBuffer).toFixed(2));\n  const loadRatePercent = Number(((totalCbm / usableCbm) * 100).toFixed(1));\n  return {\n    loadRatePercent,\n    usableCbm,\n    isOverload: totalCbm > usableCbm\n  };\n}`
        }
      ],
      oldFilesSnapshot: [
        {
          name: 'handler.ts',
          content: `export function calculateCBM(l: number, w: number, h: number, c: number) { return (l*w*h*c)/1e9; }`,
          isMain: false
        }
      ],
      newFilesSnapshot: [
        {
          name: 'handler.ts',
          content: `export function calculateCBM(l: number, w: number, h: number, c: number, factor = 1.05) { return ((l*w*h)/1e9)*factor*c; }`,
          isMain: false
        }
      ]
    }
  ],

  'chat_stream_sync': [
    {
      id: 'HIST-SK-003',
      targetId: 'chat_stream_sync',
      targetType: 'skill',
      targetName: '全渠道会话流实时同步中继',
      operatorName: '李工',
      operatorRole: '系统架构师',
      timestamp: '2026-09-17 11:30:15',
      changeType: 'parameter',
      changeSummary: '将会话打字机流式下发首字延迟压缩至 45ms 以内',
      diffDetails: [
        { field: '流式缓冲下发时延 (chunk_buffer_ms)', before: '80ms', after: '35ms' },
        { field: '断线重连最大尝试次数', before: '3次', after: '5次' }
      ]
    }
  ],

  'customer_tagging_enum': [
    {
      id: 'HIST-SK-004',
      targetId: 'customer_tagging_enum',
      targetType: 'skill',
      targetName: '买家采购画像与意向层级动态打标',
      operatorName: 'Sophia Wang',
      operatorRole: '外贸主管',
      timestamp: '2026-09-15 16:15:00',
      changeType: 'trigger',
      changeSummary: '扩展触发关键词，增加“Villa Project”、“Boutique Hotel”等工程类高优意图',
      diffDetails: [
        { field: '触发关键词 (triggerKeywords)', before: 'rfq, wholesale, moq, catalog', after: 'rfq, wholesale, moq, catalog, villa project, boutique hotel, hospitality' },
        { field: '触发方式 (triggerType)', before: '指令调用', after: '自动语义唤起' }
      ]
    }
  ],

  'kb_rag_retrieval': [
    {
      id: 'HIST-SK-005',
      targetId: 'kb_rag_retrieval',
      targetType: 'skill',
      targetName: '多模态知识图谱混合检索 (RAG)',
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: '2026-09-16 10:00:20',
      changeType: 'files',
      changeSummary: '在 SKILL.md 中强化对 CAD 尺寸图与五金剖面向量检索切片规则',
      diffDetails: [
        { field: '文档规范 (SKILL.md)', before: '纯文本 Markdown 检索切分', after: '支持 DWG/PDF 矢量图纸与参数表元数据混合向量索引' },
        { field: 'Top-K 相似片段召回数', before: '4 条', after: '6 条' }
      ]
    }
  ],

  'fob_cif_pricing_engine': [
    {
      id: 'HIST-SK-006',
      targetId: 'fob_cif_pricing_engine',
      targetType: 'skill',
      targetName: '外贸大宗贸易条款智能核价引擎',
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: '2026-09-17 14:05:40',
      changeType: 'parameter',
      changeSummary: '同步 2026年9月 最新美西/美东/欧基港集装箱基础海运费指数',
      diffDetails: [
        { field: '宁波-洛杉矶 40HQ 基准运价', before: '$3,850', after: '$3,620' },
        { field: '深圳-汉堡 40HQ 基准运价', before: '$4,500', after: '$4,280' }
      ]
    }
  ]
};

/**
 * 获取指定智能体的完整修改历史（已包含预置历史和实时修改记录）
 */
export function getAgentChangeHistory(agent: SalesAgentItem): ConfigChangeRecord[] {
  if (agent.changeHistory && agent.changeHistory.length > 0) {
    return agent.changeHistory;
  }
  const preset = defaultAgentHistoryMap[agent.id] || defaultAgentHistoryMap[agent.code];
  if (preset && preset.length > 0) {
    return preset;
  }
  // 默认初始构建记录
  return [
    {
      id: `HIST-INIT-${agent.id}`,
      targetId: agent.id,
      targetType: 'agent',
      targetName: agent.name,
      operatorName: '系统管理员',
      operatorRole: '系统内置',
      timestamp: '2026-09-01 00:00:00',
      changeType: 'general',
      changeSummary: '初始化内置智能体系统核心指令、Token上限及挂载技能',
      diffDetails: [
        { field: '系统核心指令 (System Prompt)', before: '未设定', after: '已初始化内置指令' },
        { field: '最大单次 Token', before: '未设定', after: `${agent.maxOutputTokens || 2048}` },
        { field: '挂载技能清单 (attachedSkills)', before: '0 项', after: `${agent.attachedSkillCodes.length} 项技能` }
      ]
    }
  ];
}

/**
 * 获取指定 Skill 的完整修改历史（已包含预置历史和实时修改记录）
 */
export function getSkillChangeHistory(skill: AgentSkill): ConfigChangeRecord[] {
  if (skill.changeHistory && skill.changeHistory.length > 0) {
    return skill.changeHistory;
  }
  const preset = defaultSkillHistoryMap[skill.id] || defaultSkillHistoryMap[skill.code];
  if (preset && preset.length > 0) {
    return preset;
  }
  // 默认初始构建记录
  return [
    {
      id: `HIST-INIT-${skill.id}`,
      targetId: skill.id,
      targetType: 'skill',
      targetName: skill.name,
      operatorName: '系统管理员',
      operatorRole: '系统内置',
      timestamp: '2026-09-01 00:00:00',
      changeType: 'general',
      changeSummary: '注册并发布 Skill 基础规范、触发机制与代码文件',
      diffDetails: [
        { field: '版本', before: '无', after: skill.version || 'v1.0.0' },
        { field: '状态', before: '未激活', after: skill.status === 'enabled' ? '启用' : '禁用' },
        { field: '触发方式', before: '未绑定', after: skill.triggerType }
      ]
    }
  ];
}

/**
 * 格式化当前时间戳
 */
export function formatNow(): string {
  const now = new Date();
  const Y = now.getFullYear();
  const M = String(now.getMonth() + 1).padStart(2, '0');
  const D = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}
