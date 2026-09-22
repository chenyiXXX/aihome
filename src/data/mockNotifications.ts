import { NotificationItem } from '../types';

export const initialNotifications: NotificationItem[] = [
  // ================= 1. 知识库有效期提醒 (kb_expiry) =================
  {
    id: 'notif-kb-01',
    category: 'kb_expiry',
    title: '知识文档即将过期预警',
    content: '《2026全屋极简定制五金选型手册 (V3.2)》有效期仅剩 5 天 (将于 2026-09-22 到期)。文档包含百隆、海蒂诗最新配件型号参数，请及时复核延期或上传最新版本。',
    timestamp: '2026-09-17 10:30',
    isRead: false,
    priority: 'urgent',
    targetModule: 'knowledge_base',
    targetSubView: '知识复核',
    actionText: '去知识库复核',
    actionPath: '/knowledge/review',
    meta: {
      expiryDate: '2026-09-22',
      remainingDays: 5,
      docName: '2026全屋极简定制五金选型手册 (V3.2)'
    }
  },
  {
    id: 'notif-kb-02',
    category: 'kb_expiry',
    title: '环保认证检测报告临期提醒',
    content: '《德国进口PET肤感板环保认证与SGS检测报告》将于 2026-09-25 到期 (剩余 8 天)。到期后AI问答与售前助手将暂停引用该质检报告，请联系供应商补充新周期SGS报告。',
    timestamp: '2026-09-17 09:15',
    isRead: false,
    priority: 'high',
    targetModule: 'knowledge_base',
    targetSubView: '知识复核',
    actionText: '查看证书详情',
    actionPath: '/knowledge/review',
    meta: {
      expiryDate: '2026-09-25',
      remainingDays: 8,
      docName: '德国进口PET肤感板环保认证与SGS检测报告'
    }
  },
  {
    id: 'notif-kb-03',
    category: 'kb_expiry',
    title: '年度标准文档复核周期已至',
    content: '《2026外贸出口海运加固与BOQ非标包装规范》已达到设定的年度复核周期 (2026-09-15)，需知识库管理员完成合规性复核。',
    timestamp: '2026-09-16 16:40',
    isRead: false,
    priority: 'normal',
    targetModule: 'knowledge_base',
    targetSubView: '内容上传',
    actionText: '立即复核',
    actionPath: '/knowledge/upload',
    meta: {
      expiryDate: '2026-09-15',
      remainingDays: 0,
      docName: '2026外贸出口海运加固与BOQ非标包装规范'
    }
  },
  {
    id: 'notif-kb-04',
    category: 'kb_expiry',
    title: '商品工艺手册临期提示',
    content: '《意式高定无缝封边与45°斜切工艺标准 (2025款)》将于 14 天后 (2026-10-01) 到期，建议更新至 2026 最新激光封边工艺版本。',
    timestamp: '2026-09-15 14:20',
    isRead: false,
    priority: 'normal',
    targetModule: 'knowledge_base',
    targetSubView: '知识复核',
    actionText: '去更新手册',
    actionPath: '/knowledge/review',
    meta: {
      expiryDate: '2026-10-01',
      remainingDays: 14,
      docName: '意式高定无缝封边与45°斜切工艺标准'
    }
  },
  {
    id: 'notif-kb-05',
    category: 'kb_expiry',
    title: '知识条目已成功自动延期',
    content: '《意式高定皮革供应商防伪溯源名录》已由系统自动根据采购部新合同延期至 2027-03-31，生效状态正常。',
    timestamp: '2026-09-14 11:00',
    isRead: true,
    priority: 'low',
    targetModule: 'knowledge_base',
    targetSubView: '分类管理',
    actionText: '查看知识库',
    actionPath: '/knowledge/categories',
    meta: {
      expiryDate: '2027-03-31',
      docName: '意式高定皮革供应商防伪溯源名录'
    }
  },
  {
    id: 'notif-kb-06',
    category: 'kb_expiry',
    title: '超期文档自动归档通知',
    content: '《2024旧版实木颗粒板防潮系数测试表》超期超过 30 天，系统已按知识管理策略自动移入历史归档库，不再对外贸询盘助手生效。',
    timestamp: '2026-09-12 08:30',
    isRead: true,
    priority: 'low',
    targetModule: 'knowledge_base',
    targetSubView: '标签管理',
    actionText: '查看归档',
    actionPath: '/knowledge/tags',
    meta: {
      docName: '2024旧版实木颗粒板防潮系数测试表'
    }
  },

  // ================= 2. 审批类提醒 (approval) =================
  {
    id: 'notif-appr-01',
    category: 'approval',
    title: '【待审批】海外社交媒体发布申请',
    content: '运营专员 李工 提交了短视频《2026现代极简橱柜趋势：PET肤感板与隐形门 (15秒爆款版)》的多平台发布审批申请 (拟发平台: 抖音、视频号、TikTok)。',
    timestamp: '2026-09-17 11:45',
    isRead: false,
    priority: 'urgent',
    targetModule: 'marketing',
    targetSubView: '发布审核',
    actionText: '前往审批',
    actionPath: '/marketing/audit',
    meta: {
      approvalStatus: 'pending',
      applicant: '李工 (运营专员)',
      contentTitle: '2026现代极简橱柜趋势 (15秒爆款版)',
      publishPlatforms: ['TikTok', '抖音', '视频号']
    }
  },
  {
    id: 'notif-appr-02',
    category: 'approval',
    title: '【待审批】豪宅全案图文推广审核',
    content: '外贸主笔 Sophia Wang 提交了图文《迪拜滨海大平层 270°全景豪宅：意式极简全屋定制实景落地》发布申请，请复核多语种翻译准确性与色差说明。',
    timestamp: '2026-09-17 09:50',
    isRead: false,
    priority: 'high',
    targetModule: 'marketing',
    targetSubView: '发布审核',
    actionText: '立即审核',
    actionPath: '/marketing/audit',
    meta: {
      approvalStatus: 'pending',
      applicant: 'Sophia Wang (外贸主管)',
      contentTitle: '迪拜滨海大平层 270°全景豪宅',
      publishPlatforms: ['小红书', 'Instagram', 'Pinterest']
    }
  },
  {
    id: 'notif-appr-03',
    category: 'approval',
    title: '【待审批】BOQ面价表与算价规则调整',
    content: '价格管理员 陈工 提交了《PET肤感板与进口百隆五金阶梯价格系数调整》审批单，调整幅度为 +3.2%，涉及所有新询盘自动报价逻辑。',
    timestamp: '2026-09-16 17:30',
    isRead: false,
    priority: 'urgent',
    targetModule: 'pricing_maintenance',
    targetSubView: '面价设置',
    actionText: '审核算价单',
    actionPath: '/pricing/list',
    meta: {
      approvalStatus: 'pending',
      applicant: '陈工 (价格主管)',
      contentTitle: 'PET肤感板与进口五金阶梯调价'
    }
  },
  {
    id: 'notif-appr-04',
    category: 'approval',
    title: '【审批已通过】智能体提示词优化上线',
    content: '您提交的《前置处理智能体 (pre_processing_agent) 拼写纠错阈值与小语种多路映射优化》已获超级管理员 Franklin Jr 批准并实时同步至生产环境。',
    timestamp: '2026-09-16 14:10',
    isRead: false,
    priority: 'normal',
    targetModule: 'sys_config',
    targetSubView: 'Agent 配置',
    actionText: '查看Agent配置',
    actionPath: '/system/agent',
    meta: {
      approvalStatus: 'approved',
      approver: 'Franklin Jr (Superadmin)',
      contentTitle: '前置处理智能体提示词与技能优化'
    }
  },
  {
    id: 'notif-appr-05',
    category: 'approval',
    title: '【审批驳回】知识库新分类添加未通过',
    content: '您发起的《中东非标特型木饰面特殊货运规则》知识分类创建申请被驳回。驳回原因：该规则应并入【外贸物流与清关】现有子分类，无需新增顶层分类。',
    timestamp: '2026-09-15 16:00',
    isRead: false,
    priority: 'high',
    targetModule: 'knowledge_base',
    targetSubView: '分类管理',
    actionText: '查看驳回意见',
    actionPath: '/knowledge/categories',
    meta: {
      approvalStatus: 'rejected',
      approver: '架构师评审组',
      contentTitle: '中东非标特型木饰面分类申请'
    }
  },
  {
    id: 'notif-appr-06',
    category: 'approval',
    title: '【待审批】智能体新技能挂载申请',
    content: '质检合规智能体请求挂载新发布的公共技能《compliance_fireproof_v2 (阻燃防潮国际认证标准)》，需管理员确认授权。',
    timestamp: '2026-09-15 10:20',
    isRead: false,
    priority: 'normal',
    targetModule: 'sys_config',
    targetSubView: 'Skill 配置',
    actionText: '去技能配置',
    actionPath: '/system/skill',
    meta: {
      approvalStatus: 'pending',
      applicant: '系统自动提请',
      contentTitle: '质检合规智能体技能挂载'
    }
  },

  // ================= 3. 运营内容发布情况通知 (marketing_pub) =================
  {
    id: 'notif-pub-01',
    category: 'marketing_pub',
    title: '【发布成功】短视频多平台同步完成',
    content: '《2026现代极简橱柜趋势：PET肤感板与隐形门的质感革命》已成功同步发布至 抖音、视频号、TikTok、Instagram！目前各渠道均处于推流播放状态。',
    timestamp: '2026-09-17 12:10',
    isRead: false,
    priority: 'high',
    targetModule: 'marketing',
    targetSubView: '发布计划',
    actionText: '查看发布排期',
    actionPath: '/marketing/schedule',
    meta: {
      publishStatus: 'success',
      publishPlatforms: ['TikTok', 'Instagram', '抖音', '视频号'],
      contentTitle: '2026现代极简橱柜趋势 (15秒爆款版)',
      viewsCount: 2460
    }
  },
  {
    id: 'notif-pub-02',
    category: 'marketing_pub',
    title: '【发布成功】小红书与Pinterest图文已推送',
    content: '图文作品《迪拜滨海大平层 270°全景豪宅：意式极简全屋定制实景落地》已成功推送至 小红书 (已收录在【豪宅全屋定制】专栏) 及 Pinterest 海外画板。',
    timestamp: '2026-09-17 10:05',
    isRead: false,
    priority: 'normal',
    targetModule: 'marketing',
    targetSubView: '图文生成',
    actionText: '查看图文详情',
    actionPath: '/marketing/article',
    meta: {
      publishStatus: 'success',
      publishPlatforms: ['小红书', 'Pinterest'],
      contentTitle: '迪拜滨海大平层 270°全景豪宅图文',
      viewsCount: 1820
    }
  },
  {
    id: 'notif-pub-03',
    category: 'marketing_pub',
    title: '【定时队列】预约发布已就绪',
    content: '《德国豪迈CNC封边激光一体机智造车间探秘》已进入自动排期队列，计划于明日 09:00 (东八区) 准时向 YouTube Shorts 与 视频号 发送。',
    timestamp: '2026-09-17 08:30',
    isRead: false,
    priority: 'normal',
    targetModule: 'marketing',
    targetSubView: '发布计划',
    actionText: '查看排期日历',
    actionPath: '/marketing/schedule',
    meta: {
      publishStatus: 'scheduled',
      publishPlatforms: ['YouTube Shorts', '视频号'],
      contentTitle: '德国豪迈CNC封边激光一体机智造车间探秘'
    }
  },
  {
    id: 'notif-pub-04',
    category: 'marketing_pub',
    title: '【发布失败告警】第三方平台授权失效',
    content: '视频《百隆五金阻尼抽屉慢动作特写》在尝试向 Instagram 官方账号推送时失败。原因：Instagram Business Token 已过期，请前往【账号管理】重新授权。',
    timestamp: '2026-09-16 18:25',
    isRead: false,
    priority: 'urgent',
    targetModule: 'marketing',
    targetSubView: '账号管理',
    actionText: '前往重新授权',
    actionPath: '/marketing/accounts',
    meta: {
      publishStatus: 'failed',
      publishPlatforms: ['Instagram'],
      contentTitle: '百隆五金阻尼抽屉慢动作特写'
    }
  },
  {
    id: 'notif-pub-05',
    category: 'marketing_pub',
    title: '【爆款里程碑】TikTok 单条播放量突破 50K',
    content: '发布的《意式极简西厨中岛台内嵌百隆五金》在 TikTok (美区/中东区) 累计播放量突破 52,000 次，产生 87 条询盘评论，系统已自动加权导入售前询盘池。',
    timestamp: '2026-09-16 15:40',
    isRead: false,
    priority: 'high',
    targetModule: 'pre_sales',
    targetSubView: '售前询盘列表',
    actionText: '查看关联询盘',
    actionPath: '/pre-sales',
    meta: {
      publishStatus: 'success',
      publishPlatforms: ['TikTok'],
      contentTitle: '意式极简西厨中岛台内嵌百隆五金',
      viewsCount: 52000
    }
  },
  {
    id: 'notif-pub-06',
    category: 'marketing_pub',
    title: '【发布排期调整】发布时段延期通知',
    content: '外贸运营团队将《伦敦肯辛顿独栋别墅全案实景 (英文解说版)》的排期由 09-18 延期至 09-20 20:00 (伦敦当地晚间黄金浏览时段)。',
    timestamp: '2026-09-15 17:15',
    isRead: false,
    priority: 'normal',
    targetModule: 'marketing',
    targetSubView: '发布计划',
    actionText: '查看计划表',
    actionPath: '/marketing/schedule',
    meta: {
      publishStatus: 'scheduled',
      publishPlatforms: ['YouTube', 'Instagram'],
      contentTitle: '伦敦肯辛顿独栋别墅全案实景'
    }
  },

  // ================= 4. Agent 运行报错 (agent_error) =================
  {
    id: 'notif-agent-err-01',
    category: 'agent_error',
    title: '【运行报错】报价商务智能体 BOQ 算价超时告警',
    content: '【报价商务智能体 (quotation_commercial_agent)】在执行复杂非标异型中岛柜算价任务时发生底层模型调用超时 (Gemini API 504 Gateway Timeout)，未能在规定 15s 内完成结构分解与计价。系统已自动启用备用降级计算规则并通知专员复核。',
    timestamp: '2026-09-17 12:45',
    isRead: false,
    priority: 'urgent',
    targetModule: 'sys_config',
    targetSubView: 'Agent 配置',
    actionText: '排查智能体配置',
    actionPath: '/system/agent',
    meta: {
      agentName: '报价商务智能体',
      agentCode: 'quotation_commercial_agent',
      errorCode: 'TIMEOUT_504',
      errorDetails: 'Gemini 2.5 Flash API 调用超时 (>15000ms)，触发降级规则'
    }
  },
  {
    id: 'notif-agent-err-02',
    category: 'agent_error',
    title: '【运行报错】前置处理智能体小语种分词解析异常',
    content: '【前置处理智能体 (pre_processing_agent)】在解析阿联酋买家阿拉伯语与英语混合的非标五金询盘时，多语种提取模块触发字符编码截断异常 (ERR_UNICODE_DECODE)，已降级至人工待办池。',
    timestamp: '2026-09-17 10:20',
    isRead: false,
    priority: 'high',
    targetModule: 'sys_config',
    targetSubView: 'Agent 配置',
    actionText: '查看异常日志',
    actionPath: '/system/agent',
    meta: {
      agentName: '前置处理智能体',
      agentCode: 'pre_processing_agent',
      errorCode: 'ERR_UNICODE_DECODE',
      errorDetails: 'Arabic/English mixed token segmentation failed'
    }
  },
  {
    id: 'notif-agent-err-03',
    category: 'agent_error',
    title: '【风控阻断】质检合规智能体风控拦截熔断',
    content: '【质检合规智能体 (qc_compliance_agent)】检测到外贸询盘草稿中包含禁止对外承诺的敏感加急交付条款（如“无图纸10天极速海外交付”），已触发一级风控拦截阻断并记录审计日志。',
    timestamp: '2026-09-16 16:15',
    isRead: false,
    priority: 'urgent',
    targetModule: 'audit_logs',
    targetSubView: '智能体调用日志',
    actionText: '查看审计日志',
    actionPath: '/audit',
    meta: {
      agentName: '质检合规智能体',
      agentCode: 'qc_compliance_agent',
      errorCode: 'GUARDRAIL_BLOCKED',
      errorDetails: 'Blocked sensitive SLA promise clause'
    }
  },
  {
    id: 'notif-agent-err-04',
    category: 'agent_error',
    title: '【运行告警】意图分发智能体 Token 阈值接近上限',
    content: '【意图分发智能体 (intent_dispatcher_agent)】在处理附带 12 个历史会话轮次的超长询盘上下文时，Prompt 长度达到预设上下文记忆窗口的 94% (7,680 / 8,192 Tokens)，建议开启上下文滚动摘要压缩。',
    timestamp: '2026-09-16 11:30',
    isRead: true,
    priority: 'normal',
    targetModule: 'sys_config',
    targetSubView: 'Agent 配置',
    actionText: '调整记忆参数',
    actionPath: '/system/agent',
    meta: {
      agentName: '意图分发智能体',
      agentCode: 'intent_dispatcher_agent',
      errorCode: 'TOKEN_LIMIT_NEAR',
      errorDetails: 'Prompt tokens 7,680 / 8,192 (94%)'
    }
  }
];
