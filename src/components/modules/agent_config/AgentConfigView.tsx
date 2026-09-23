import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Cpu,
  Sliders,
  Shield,
  Clock,
  Globe,
  Lock,
  Anchor,
  Check,
  RotateCcw,
  HelpCircle,
  FileCode,
  Zap,
  Award,
  Layers,
  Coins,
  Target,
  ShieldCheck,
  Wrench,
  ChevronRight,
  ArrowRight,
  Activity,
  Play,
  Send,
  RefreshCw,
  Terminal,
  ExternalLink,
  Flame,
  Search,
  Plus,
  Trash2,
  X,
  History,
  Download
} from 'lucide-react';
import { SystemAgentConfig, SalesAgentItem, AgentSkillParameter, AgentSkill, ConfigChangeRecord } from '../../../types';
import { initialSalesAgents, initialSalesSkills } from '../../../data/salesAgentData';
import { initialAgentSkills } from '../../../data/mockData';
import { getAgentChangeHistory, formatNow } from '../../../data/configHistoryData';
import { ConfigHistoryModal } from './ConfigHistoryModal';
import { SkillMountModal } from './SkillMountModal';

interface AgentConfigViewProps {
  config: SystemAgentConfig;
  allSkills?: AgentSkill[];
  onSave?: (newConfig: Partial<SystemAgentConfig>) => void;
}

export const AgentConfigView: React.FC<AgentConfigViewProps> = ({ config, allSkills, onSave }) => {
  // Sales Agents list
  const [agentsList, setAgentsList] = useState<SalesAgentItem[]>(
    config.salesAgents && config.salesAgents.length > 0 ? config.salesAgents : initialSalesAgents
  );

  // All available skills
  const allAvailableSkills: AgentSkill[] =
    allSkills && allSkills.length > 0
      ? allSkills
      : config.skills && config.skills.length > 0
      ? config.skills
      : [...initialSalesSkills, ...initialAgentSkills];

  // Selected Sales Agent
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agentsList[0]?.id || 'agent-pre-process');
  const selectedAgent = agentsList.find((a) => a.id === selectedAgentId) || agentsList[0];

  // Skill Mount Modal state
  const [isSkillMountModalOpen, setIsSkillMountModalOpen] = useState(false);
  const [mountNotification, setMountNotification] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'prompt' | 'skills' | 'test' | 'history'>('prompt');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyTargetAgent, setHistoryTargetAgent] = useState<SalesAgentItem | null>(null);

  // Top view mode: 'matrix' (7大销售智能体协同矩阵) vs 'global' (全局默认底座参数)
  const [viewMode, setViewMode] = useState<'matrix' | 'global'>('matrix');

  // Search filter for agents
  const [agentSearch, setAgentSearch] = useState('');

  // Global config fallback states
  const [agentName, setAgentName] = useState(config.agentName || 'HomeCraft Global AI 外贸定制全流程智能体');
  const [primaryPersona, setPrimaryPersona] = useState(
    config.primaryPersona || 'Senior Foreign Trade Director & Furniture Structural Engineer'
  );
  const [toneStyle, setToneStyle] = useState<'严谨专业' | '热情亲切' | '高层商务' | '工程顾问'>(
    config.toneStyle || '严谨专业'
  );
  const [systemPrompt, setSystemPrompt] = useState(config.systemPrompt || initialSalesAgents[0].systemPrompt);
  const [geminiModel, setGeminiModel] = useState(config.geminiModel || 'gemini-2.5-flash');
  const [temperature, setTemperature] = useState(config.temperature ?? 0.3);
  const [topP, setTopP] = useState(config.topP ?? 0.85);
  const [maxOutputTokens, setMaxOutputTokens] = useState(config.maxOutputTokens ?? 4096);
  const [contextRounds, setContextRounds] = useState(config.contextRounds ?? 20);
  const [languageMode, setLanguageMode] = useState(config.languageMode || '中英双语 (默认)');

  // Selected agent editing state
  const [editingAgent, setEditingAgent] = useState<SalesAgentItem>(selectedAgent);

  // Sync editing agent when selectedAgentId changes
  React.useEffect(() => {
    const target = agentsList.find((a) => a.id === selectedAgentId);
    if (target) {
      setEditingAgent(JSON.parse(JSON.stringify(target)));
    }
  }, [selectedAgentId, agentsList]);

  // Live sandbox debugging state
  const [debugInput, setDebugInput] = useState('');
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugMessages, setDebugMessages] = useState<
    Array<{ role: 'user' | 'agent' | 'system'; text: string; latencyMs?: number; tokens?: number }>
  >([
    {
      role: 'system',
      text: `已连接至【${selectedAgent?.name}】实时调试沙箱环境。当前调度模型：${selectedAgent?.geminiModel}，挂载 ${selectedAgent?.attachedSkillCodes.length} 项专属销售Skill。`
    }
  ]);

  // Update editing agent with real-time auto-save
  const updateEditingAgent = (updater: (prev: SalesAgentItem) => SalesAgentItem) => {
    setEditingAgent((prev) => {
      const next = updater(prev);
      setAgentsList((currentList) => {
        const nextList = currentList.map((ag) => (ag.id === next.id ? next : ag));
        if (onSave) onSave({ salesAgents: nextList });
        return nextList;
      });
      return next;
    });
  };

  // 导出当前 Agent 配置包
  const handleExportAgentConfig = () => {
    const attachedSkills = allAvailableSkills.filter((s) =>
      editingAgent.attachedSkillCodes.includes(s.code)
    );
    const fullPayload = {
      exportTime: new Date().toISOString(),
      agent: editingAgent,
      attachedSkills,
      globalFallbackConfig: {
        geminiModel,
        temperature,
        topP,
        maxOutputTokens,
        contextRounds,
        languageMode
      }
    };
    const blob = new Blob([JSON.stringify(fullPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editingAgent.code || 'agent'}_config_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Update selected agent status
  const handleToggleAgentStatus = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = agentsList.map((ag) => {
      if (ag.id === agentId) {
        const nextStatus: SalesAgentItem['status'] = ag.status === 'active' ? 'inactive' : 'active';
        const currentHist = getAgentChangeHistory(ag);
        const newRecord: ConfigChangeRecord = {
          id: `HIST-AG-${Date.now()}`,
          targetId: ag.id,
          targetType: 'agent',
          targetName: ag.name,
          operatorName: 'Chen Yi (陈总)',
          operatorRole: '超级管理员',
          timestamp: formatNow(),
          changeType: 'status',
          changeSummary: nextStatus === 'active' ? '启用智能体接入运行' : '停用智能体接入运行',
          diffDetails: [
            {
              field: '运行状态',
              before: ag.status === 'active' ? '● 运行中 (active)' : '○ 已停用 (inactive)',
              after: nextStatus === 'active' ? '● 运行中 (active)' : '○ 已停用 (inactive)'
            }
          ]
        };
        return {
          ...ag,
          status: nextStatus,
          changeHistory: [newRecord, ...currentHist]
        };
      }
      return ag;
    });
    setAgentsList(updated);
    if (onSave) onSave({ salesAgents: updated });
  };

  // Update a parameter for editing agent with real-time auto-save
  const handleUpdateAgentParam = (key: string, val: any) => {
    updateEditingAgent((prev) => {
      const updatedParams = prev.parameters.map((p) => (p.key === key ? { ...p, value: val } : p));
      return { ...prev, parameters: updatedParams };
    });
  };

  // Save mounted skills for editing agent
  const handleSaveMountSkills = (newCodes: string[]) => {
    const origCodes = editingAgent.attachedSkillCodes;
    const diffs: Array<{ field: string; before: string; after: string }> = [
      {
        field: '挂载技能清单 (attachedSkills)',
        before: origCodes.length > 0 ? origCodes.join(', ') : '无挂载技能',
        after: newCodes.length > 0 ? newCodes.join(', ') : '无挂载技能'
      }
    ];

    const currentHistory = getAgentChangeHistory(editingAgent);
    const newRecord: ConfigChangeRecord = {
      id: `HIST-AG-${Date.now()}`,
      targetId: editingAgent.id,
      targetType: 'agent',
      targetName: editingAgent.name,
      operatorName: 'Chen Yi (陈总)',
      operatorRole: '超级管理员',
      timestamp: formatNow(),
      changeType: 'skills',
      changeSummary: `调整挂载技能 (当前挂载 ${newCodes.length} 项 Skill)`,
      diffDetails: diffs
    };

    const updatedAgent: SalesAgentItem = {
      ...editingAgent,
      attachedSkillCodes: newCodes,
      changeHistory: [newRecord, ...currentHistory]
    };
    setEditingAgent(updatedAgent);
    const updatedList = agentsList.map((a) => (a.id === updatedAgent.id ? updatedAgent : a));
    setAgentsList(updatedList);
    if (onSave) {
      onSave({ salesAgents: updatedList });
    }
    setMountNotification(`已成功为【${updatedAgent.name}】更新挂载技能，当前共挂载 ${newCodes.length} 项 Skill！`);
    setTimeout(() => setMountNotification(null), 3000);
  };

  // Unmount a single skill
  const handleUnmountSkill = (skillCode: string) => {
    const newCodes = editingAgent.attachedSkillCodes.filter((code) => code !== skillCode);
    handleSaveMountSkills(newCodes);
  };

  // Reset current agent prompt to default
  const handleResetAgentPrompt = () => {
    const defaultAgent = initialSalesAgents.find((a) => a.id === editingAgent.id || a.code === editingAgent.code);
    if (defaultAgent) {
      updateEditingAgent((prev) => ({ ...prev, systemPrompt: defaultAgent.systemPrompt }));
    }
  };

  // Agent quick icon helper
  const getAgentIcon = (code: string) => {
    switch (code) {
      case 'pre_processing_agent':
        return Sparkles;
      case 'intent_dispatcher_agent':
        return Cpu;
      case 'knowledge_expert_agent':
        return Layers;
      case 'quotation_commercial_agent':
        return Coins;
      case 'sales_strategy_agent':
        return Target;
      case 'qc_compliance_agent':
        return ShieldCheck;
      case 'aftersales_troubleshooting_agent':
        return Wrench;
      default:
        return Bot;
    }
  };

  // Preset sample queries for quick debugging
  const getPresetQueries = (code: string) => {
    switch (code) {
      case 'pre_processing_agent':
        return [
          'Hello, ve need high quality kitch cabnts for our luxury villa in Berlin. Do u speak English?',
          'URGENT: Container #40HQ arriving tomorrow, need packing list immediately!!'
        ];
      case 'intent_dispatcher_agent':
        return [
          'Can you tell me if your plywood meets CARB P2, and also quote me 48 meters of base cabinets?',
          'Our client in London is complaining that the drawer slides got bent during shipping.'
        ];
      case 'knowledge_expert_agent':
        return [
          'What is the formaldehyde emission level of your E0 Plywood under EN 717-1 standard?',
          'Do your cabinet doors support Blum Clip-top 110-degree hinges with soft-close?'
        ];
      case 'quotation_commercial_agent':
        return [
          'Please estimate FOB Shenzhen price for 500 sqm PET gloss finish wardrobe panels with Blum slides.',
          'Can you calculate how many sets of 3-seater sofas fit in a 1*40HQ container?'
        ];
      case 'sales_strategy_agent':
        return [
          'The client says our quote is 8% higher than our competitor in Vietnam. How should we reply?',
          'Client has reviewed the quotation 3 times but hasn’t paid the 30% deposit yet. Draft follow-up.'
        ];
      case 'qc_compliance_agent':
        return [
          'Draft reply: "Our factory raw cost is $8,500, we promise 5 days delivery with zero mm tolerance."',
          'Verify if our solid oak veneer kitchen export to California requires TSCA Title VI label.'
        ];
      case 'aftersales_troubleshooting_agent':
        return [
          'Client received the container but 2 cabinet doors have veneer chipped off at the corner.',
          'The installer in Manchester cannot find the concealed hinge adjustment screws on the tall unit.'
        ];
      default:
        return ['Hello, please provide project quotation.'];
    }
  };

  // Handle run debug dialogue
  const handleSendDebug = (overrideQuery?: string) => {
    const textToSend = overrideQuery || debugInput;
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user' as const, text: textToSend };
    setDebugMessages((prev) => [...prev, userMsg]);
    if (!overrideQuery) setDebugInput('');
    setIsDebugging(true);

    setTimeout(() => {
      setIsDebugging(false);
      let replyText = '';
      switch (editingAgent.code) {
        case 'pre_processing_agent':
          replyText = `【前置清洗完成】
• 检测语言: 英文 (英语/德语混合)，已规范拼写为 "kitchen cabinets"
• 语义清洗: 滤除打招呼客套，保留核心诉求: [全屋厨房橱柜定制, 柏林别墅项目]
• 情绪研判: 中度急迫 (急需材料认证与报价)
• 流水线调度: 报文已格式化并毫秒级递交至【意图分发智能体】。`;
          break;
        case 'intent_dispatcher_agent':
          replyText = `【意图解析与路由分派】
• 识别主意图: 复合意图 (双任务流)
  1. 环保认证背调 (CARB P2) -> 并行分派至【知识专家智能体】
  2. 地柜延米算价 (48延米) -> 串行分派至【报价商务智能体】
• 挂载 Skill 调用: 客户打标枚举Skill (已打上标签: [欧洲项目, 别墅高定, Tier-A预算])
• 调度状态: 多智能体任务流水线建立完成，预估总端到端响应耗时: 320ms。`;
          break;
        case 'knowledge_expert_agent':
          replyText = `Dear Customer,
Regarding your inquiry on environmental compliance:
1. Formaldehyde Emission: Our E0 grade multi-layer plywood complies strictly with European EN 717-1 (<=0.05 mg/m³) and exceeds USA CARB Phase 2 / EPA TSCA Title VI (<=0.09 ppm).
2. Hardware Compatibility: All drawer profiles are pre-milled for original Austrian Blum Clip-Top Blumotion (110° concealed soft-close, 200,000 opening cycles test passed).
• 依据知识库切片: [KB-ENG-CARB-P2-2026, KB-BLUM-SPEC-V4]
• 质检证书报告: SGS Report #CANEC260819201 已验证。`;
          break;
        case 'quotation_commercial_agent':
          replyText = `【FOB 商务报价核算单】
• 项目: 500㎡ PET 肤感极简高柜 + Blum 原装阻尼五金
• 原料及异形加工费: ¥165,000 (含8%电子锯排版切边损耗)
• 离岸港口: 深圳盐田港 (FOB Shenzhen Yantian)
• 基准核算汇率: 7.20 USD/CNY | 目标毛利率: 26.5%
• 报价总金额: $31,500.00 USD (单价: $63.00/㎡)
• 挂载 Skill 产物: 已通过【商业文档生成Skill】自动生成 PI-20260907-US01，锁价期 20 天。`;
          break;
        case 'sales_strategy_agent':
          replyText = `【外贸销售策略攻坚建议】
• 痛点分析: 客户对越南供应链报价敏感，但越南在高端 PUR 激光封边与五金精准公差上缺陷率高；
• 应对战术:
  1. 差异化降维打法: 强调我司全线免漆激光封边耐水汽性能，提供免费空运首件实木皮打样；
  2. 阶梯返利谈判: 承诺“首单打样费 $500 将在首个 40HQ 整柜大货订单中 100% 全额冲抵货款”；
  3. 出具排产锁定公函: 告知由于金九银十旺季，当前定金可在下周直接锁定 35 天生产交期。`;
          break;
        case 'qc_compliance_agent':
          replyText = `【质检合规审查结论: 拦截并纠偏】
⚠️ 发现 2 项高危违规风险:
1. 拦截敏感成本词: 检测到内部出厂成本 “$8,500”，根据底价保护规则已强制屏蔽；
2. 拦截虚假交期承诺: “5 days with zero mm tolerance” 违背生产物理规律，已自动修正为：“标准定制生产工期为 35-42 天，执行 DIN 68861 ±1.5mm 国际柜体间隙公差”。
✅ 修正后安全发文字样已同步至输出缓冲区。`;
          break;
        case 'aftersales_troubleshooting_agent':
          replyText = `【售后客诉排障方案】
• 货损判定: 比对装箱照片与箱单，判定门板边角破损系由于海运集装箱卸货时铲车外力撞击；
• 应急补发措施:
  1. 定位图纸构件编号: [Cabinet_Front_Door_M04, 18mm PET Skin, 2150x450mm]
  2. 已触发【报价计价Skill】核算空运成本 ($185 USD)，在 $300 自主授权额度内；
  3. 72 小时内 CNC 极速加急补产，并通过 DHL Express 直达项目现场；
• 安抚公函已生成，附带现场临时补漆微调指南。`;
          break;
        default:
          replyText = '智能体任务执行完成。';
      }

      setDebugMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: replyText,
          latencyMs: Math.floor(Math.random() * 180 + 70),
          tokens: Math.floor(Math.random() * 450 + 220)
        }
      ]);
    }, 400);
  };

  const filteredAgents = agentsList.filter(
    (a) =>
      a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(agentSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(agentSearch.toLowerCase()) ||
      a.geminiModel.toLowerCase().includes(agentSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden space-y-4">
      {/* MATRIX VIEW: Dual Column Split Layout */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Left: 2-Level Category & Agent List */}
        <div className="w-72 sm:w-80 shrink-0 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          {/* Header & Search */}
          <div className="p-3.5 border-b border-slate-100 space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#EA3A20]" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                共 {filteredAgents.length} 个智能体
              </span>
            </div>
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="筛选智能体..."
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                className="w-full pl-7 pr-6 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
              />
            </div>
          </div>

          {/* 2-Level List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3">
            {[
              {
                groupName: '售前接入与调度集群',
                categories: ['前置接入', '中枢路由']
              },
              {
                groupName: '核心专家集群',
                categories: ['核心专家']
              },
              {
                groupName: '商务与策略集群',
                categories: ['商务报价', '策略推进']
              },
              {
                groupName: '风控与售后集群',
                categories: ['合规风控', '售后保障']
              }
            ].map((group) => {
              const groupAgents = filteredAgents.filter((a) => group.categories.includes(a.category));
              if (groupAgents.length === 0) return null;
              return (
                <div key={group.groupName} className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-1 mb-1">
                    <span>{group.groupName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                      {groupAgents.length}
                    </span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {groupAgents.map((agent) => {
                      const isSelected = agent.id === selectedAgentId;
                      return (
                        <div
                          key={agent.id}
                          onClick={() => setSelectedAgentId(agent.id)}
                          className={`flex items-center px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#EA3A20]/10 text-[#EA3A20] font-bold shadow-2xs border border-[#EA3A20]/20'
                              : 'hover:bg-slate-100/80 text-slate-700 font-medium border border-transparent'
                          }`}
                        >
                          <div className="font-bold truncate">{agent.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Configuration Panel */}
        <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-6 overflow-y-auto custom-scrollbar shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col space-y-6">
            {/* Header of Selected Agent */}
            <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900">{editingAgent.name}</h2>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                    {editingAgent.code}
                  </span>
                  <span className="text-xs font-medium text-slate-700 bg-slate-100/80 border border-slate-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 font-mono">
                    <Cpu className="w-3 h-3 text-[#EA3A20]" />
                    <span>
                      {editingAgent.geminiModel === 'gemini-2.5-flash' && 'Gemini 2.5 Flash'}
                      {editingAgent.geminiModel === 'gemini-2.5-pro' && 'Gemini 2.5 Pro'}
                      {editingAgent.geminiModel === 'gemini-2.5-flash-thinking' && 'Gemini 2.5 Flash Thinking'}
                      {!['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-thinking'].includes(editingAgent.geminiModel) && editingAgent.geminiModel}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  {editingAgent.description}
                </p>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportAgentConfig}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  title="导出当前 Agent 配置包 (JSON)"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>导出配置包</span>
                </button>
              </div>
            </div>

            {/* Clean Segmented Tab Navigation for Re-layout */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveDetailTab('prompt')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeDetailTab === 'prompt'
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Prompt</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('skills')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeDetailTab === 'skills'
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>挂载skill ({editingAgent.attachedSkillCodes.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('test')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeDetailTab === 'test'
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>测试</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('history')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeDetailTab === 'history'
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>修改记录 ({getAgentChangeHistory(editingAgent).length})</span>
              </button>
            </div>

            {/* Tab 1 Content: Prompt (System Prompt Editor + Token / Params) */}
            {activeDetailTab === 'prompt' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* System Prompt Editor */}
                <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-[#EA3A20]" />
                      <span>系统核心指令 (System Prompt)</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleResetAgentPrompt}
                      className="text-xs text-slate-500 hover:text-[#EA3A20] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>恢复默认人设</span>
                    </button>
                  </div>

                  <textarea
                    rows={10}
                    value={editingAgent.systemPrompt}
                    onChange={(e) => {
                      const newPrompt = e.target.value;
                      updateEditingAgent((prev) => ({ ...prev, systemPrompt: newPrompt }));
                    }}
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-mono leading-relaxed text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                    placeholder="请输入详细的 System Prompt 指令..."
                  />
                </div>

                {/* Max Tokens */}
                <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900">推理输出参数</h3>
                  </div>
                  <div className="space-y-1.5 bg-white p-4 rounded-xl border border-slate-200/60 shadow-2xs max-w-md">
                    <label className="text-xs font-bold text-slate-700">最大单次 Token</label>
                    <input
                      type="number"
                      value={editingAgent.maxOutputTokens}
                      onChange={(e) => {
                        const newTokens = parseInt(e.target.value) || 2048;
                        updateEditingAgent((prev) => ({ ...prev, maxOutputTokens: newTokens }));
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 Content: Skills Mounting */}
            {activeDetailTab === 'skills' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-bold text-slate-900">
                        已挂载 Skill 组件 ({editingAgent.attachedSkillCodes.length})
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSkillMountModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-700" />
                      <span>挂载技能</span>
                    </button>
                  </div>

                  {mountNotification && (
                    <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{mountNotification}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMountNotification(null)}
                        className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {editingAgent.attachedSkillCodes.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2">
                        <p className="text-xs text-slate-500">当前智能体尚未挂载任何 Skill 工具</p>
                        <button
                          type="button"
                          onClick={() => setIsSkillMountModalOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>立即从算法库挂载 Skill</span>
                        </button>
                      </div>
                    ) : (
                      editingAgent.attachedSkillCodes.map((skillCode) => {
                        const skill = allAvailableSkills.find((s) => s.code === skillCode);
                        return (
                          <div
                            key={skillCode}
                            className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                                <Zap className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-900 truncate">
                                  {skill ? skill.name : skillCode}
                                </h5>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {skill ? skill.description : '专业外贸销售算法组件'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                已挂载
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUnmountSkill(skillCode)}
                                className="text-[11px] px-2.5 py-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                                title="解除此技能挂载"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>解除</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 Content: Test Sandbox */}
            {activeDetailTab === 'test' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Interactive Live Sandbox Debugger */}
                <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#EA3A20]" />
                      <h3 className="text-xs font-bold text-slate-900">
                        实时沙箱调试
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      模拟询盘输入，实时检验推理与风控结论
                    </span>
                  </div>

                  {/* Chat Log Window */}
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 max-h-60 overflow-y-auto custom-scrollbar space-y-3 font-mono text-xs border border-slate-800 shadow-inner">
                    {debugMessages.map((msg, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded ${
                              msg.role === 'user'
                                ? 'bg-blue-900 text-blue-200'
                                : msg.role === 'agent'
                                ? 'bg-[#EA3A20]/30 text-[#EA3A20]'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {msg.role === 'user' ? 'BUYER' : msg.role === 'agent' ? editingAgent.name : 'SYSTEM'}
                          </span>
                          {msg.latencyMs && <span>耗时: {msg.latencyMs}ms</span>}
                          {msg.tokens && <span>Tokens: {msg.tokens}</span>}
                        </div>
                        <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 pl-1 leading-relaxed">
                          {msg.text}
                        </pre>
                      </div>
                    ))}
                    {isDebugging && (
                      <div className="flex items-center gap-2 text-slate-400 text-xs animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#EA3A20]" />
                        <span>智能体推理思考中...</span>
                      </div>
                    )}
                  </div>

                  {/* Preset Test Prompts Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium">快速测试用例:</span>
                    {getPresetQueries(editingAgent.code).map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendDebug(q)}
                        className="text-[10px] bg-white hover:bg-[#FFF4F2] hover:text-[#EA3A20] text-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60 cursor-pointer truncate max-w-xs"
                        title={q}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Input & Send Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={debugInput}
                      onChange={(e) => setDebugInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendDebug()}
                      placeholder={`给【${editingAgent.name}】发送一条测试消息，按 Enter 发送...`}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendDebug()}
                      disabled={isDebugging || !debugInput.trim()}
                      className="px-5 py-2.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>测试运行</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4 Content: History (修改记录) */}
            {activeDetailTab === 'history' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Timeline in tab */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {getAgentChangeHistory(editingAgent).map((rec, idx) => {
                    const isLatest = idx === 0;
                    return (
                      <div key={rec.id || idx} className="relative group">
                        {/* Timeline Node */}
                        <div
                          className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isLatest
                              ? 'bg-emerald-500 border-emerald-200 text-white shadow-xs'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-white' : 'bg-slate-400'}`} />
                        </div>

                        {/* Record Box */}
                        <div className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs space-y-2.5 transition-all">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{rec.operatorName}</span>
                              {rec.operatorRole && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                                  {rec.operatorRole}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {rec.timestamp}
                              </span>
                              {isLatest && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                                  生效中
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-xs font-semibold text-slate-800">
                            {rec.changeSummary}
                          </div>

                          {rec.diffDetails && rec.diffDetails.length > 0 && (
                            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs space-y-1.5">
                              {rec.diffDetails.map((diff, dIdx) => (
                                <div key={dIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                                  <span className="font-medium text-slate-600 sm:w-1/3 shrink-0 text-[11px]">
                                    {diff.field}
                                  </span>
                                  <div className="flex-1 flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[11px] truncate max-w-[200px]">
                                      {diff.before || '空'}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-[11px] font-bold truncate max-w-[200px]">
                                      {diff.after || '空'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Skill Mount Modal */}
      <SkillMountModal
        isOpen={isSkillMountModalOpen}
        agent={editingAgent}
        allSkills={allAvailableSkills}
        onClose={() => setIsSkillMountModalOpen(false)}
        onSaveMount={handleSaveMountSkills}
      />

      {/* Config History Modal */}
      <ConfigHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setHistoryTargetAgent(null);
        }}
        targetTitle={historyTargetAgent?.name || editingAgent.name}
        targetType="agent"
        targetCode={historyTargetAgent?.code || editingAgent.code}
        records={historyTargetAgent ? getAgentChangeHistory(historyTargetAgent) : getAgentChangeHistory(editingAgent)}
      />
    </div>
  );
};
