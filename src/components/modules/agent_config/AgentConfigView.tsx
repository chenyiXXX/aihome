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
  X
} from 'lucide-react';
import { SystemAgentConfig, SalesAgentItem, AgentSkillParameter, AgentSkill } from '../../../types';
import { initialSalesAgents, initialSalesSkills } from '../../../data/salesAgentData';
import { initialAgentSkills } from '../../../data/mockData';
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

  const [savedTip, setSavedTip] = useState(false);

  // Update selected agent status
  const handleToggleAgentStatus = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = agentsList.map((ag) => {
      if (ag.id === agentId) {
        const nextStatus: SalesAgentItem['status'] = ag.status === 'active' ? 'inactive' : 'active';
        return { ...ag, status: nextStatus };
      }
      return ag;
    });
    setAgentsList(updated);
    if (onSave) onSave({ salesAgents: updated });
  };

  // Update a parameter for editing agent
  const handleUpdateAgentParam = (key: string, val: any) => {
    setEditingAgent((prev) => {
      const updatedParams = prev.parameters.map((p) => (p.key === key ? { ...p, value: val } : p));
      return { ...prev, parameters: updatedParams };
    });
  };

  // Save changes to current agent
  const handleSaveCurrentAgent = () => {
    const updated = agentsList.map((ag) => (ag.id === editingAgent.id ? editingAgent : ag));
    setAgentsList(updated);
    if (onSave) {
      onSave({ salesAgents: updated });
    }
    setSavedTip(true);
    setTimeout(() => setSavedTip(false), 2000);
  };

  // Save mounted skills for editing agent
  const handleSaveMountSkills = (newCodes: string[]) => {
    const updatedAgent: SalesAgentItem = {
      ...editingAgent,
      attachedSkillCodes: newCodes
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
    const defaultAgent = initialSalesAgents.find((a) => a.id === editingAgent.id);
    if (defaultAgent) {
      setEditingAgent((prev) => ({ ...prev, systemPrompt: defaultAgent.systemPrompt }));
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
    <div className="space-y-6">
      {/* View Mode Switcher Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-[#EA3A20] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>销售类智能体矩阵 (7大协同智能体)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                viewMode === 'matrix' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              核心集群
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('global')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'global'
                ? 'bg-[#EA3A20] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>全局兜底与推理底座</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveCurrentAgent}
            className="px-4 py-1.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            {savedTip ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{savedTip ? '已保存配置！' : '保存当前智能体配置'}</span>
          </button>
        </div>
      </div>

      {/* MATRIX VIEW: 7 大销售类智能体 */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          {/* Agent Selector Grid & Filter Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>销售类智能体列表</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    共 7 个协同智能体
                  </span>
                </h3>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索智能体名称/角色/模型..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] w-64 shadow-2xs"
                />
              </div>
            </div>

            {/* Horizontal Agent Cards Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {filteredAgents.map((agent) => {
                const Icon = getAgentIcon(agent.code);
                const isSelected = agent.id === selectedAgentId;
                const isActive = agent.status === 'active';

                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`bg-white border rounded-2xl p-3.5 cursor-pointer transition-all flex flex-col justify-between shadow-2xs ${
                      isSelected
                        ? 'border-[#EA3A20] ring-2 ring-[#EA3A20]/20 bg-[#FFF4F2]/30'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#EA3A20] text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Status badge toggle */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleAgentStatus(agent.id, e)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                          title="点击切换运行/停用状态"
                        >
                          {isActive ? '运行中' : '已停用'}
                        </button>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 truncate mb-0.5">{agent.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono truncate mb-2">{agent.code}</p>

                      <div className="flex items-center gap-1 flex-wrap mb-2">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          {agent.category}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-mono">
                          {agent.geminiModel.replace('gemini-2.5-', '')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>24h: {agent.throughput24h}</span>
                      <span>{agent.avgLatencyMs}ms</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Deep Configuration Panel for the Selected Agent */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
            {/* Header of Selected Agent */}
            <div className="flex items-start justify-between gap-4 flex-wrap pb-5 border-b border-slate-100">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EA3A20]/10 text-[#EA3A20] flex items-center justify-center shrink-0 shadow-xs">
                  {React.createElement(getAgentIcon(editingAgent.code), { className: 'w-6 h-6' })}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900">{editingAgent.name}</h2>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                      {editingAgent.code}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {editingAgent.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        editingAgent.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {editingAgent.status === 'active' ? '● 运行中' : '○ 停用状态'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
                    {editingAgent.description}
                  </p>
                </div>
              </div>

              {/* Metrics pill */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">24小时吞吐</span>
                  <span className="font-bold text-slate-800">{editingAgent.throughput24h.toLocaleString()} 询盘</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">平均延迟</span>
                  <span className="font-bold text-slate-800">{editingAgent.avgLatencyMs} ms</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">精准度</span>
                  <span className="font-bold text-emerald-600">{editingAgent.accuracyRate}</span>
                </div>
              </div>
            </div>

            {/* Grid 2 Columns: Model & Hyperparameters + Attached Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Col: Gemini Model & Hyperparameters */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#EA3A20]" />
                  <span>Gemini 大模型选型与推理超参数</span>
                </h4>

                {/* Model Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">推荐推理模型 (Google GenAI)</label>
                  <select
                    value={editingAgent.geminiModel}
                    onChange={(e) => setEditingAgent({ ...editingAgent, geminiModel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (极速毫秒级响应，低功耗高并发)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (深度复杂多模态推理，高精度工艺知识解析)</option>
                    <option value="gemini-2.5-flash-thinking">
                      Gemini 2.5 Flash Thinking (思维链深度算价，BOQ与外贸复杂数学推演)
                    </option>
                  </select>
                </div>

                {/* Temperature & Top-P */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">采样温度 (Temperature)</span>
                      <span className="font-mono font-bold text-[#EA3A20]">{editingAgent.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={editingAgent.temperature}
                      onChange={(e) =>
                        setEditingAgent({ ...editingAgent, temperature: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#EA3A20]"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      {editingAgent.temperature < 0.2 ? '极低发散，高度确切严谨' : '平衡逻辑与适度语言润色'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">核采样 (Top-P)</span>
                      <span className="font-mono font-bold text-blue-600">{editingAgent.topP}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={editingAgent.topP}
                      onChange={(e) => setEditingAgent({ ...editingAgent, topP: parseFloat(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                    <span className="text-[10px] text-slate-400 block">候选词累积概率截断阈值</span>
                  </div>
                </div>

                {/* Max Tokens & Context Rounds */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">最大单次输出 Token</label>
                    <input
                      type="number"
                      value={editingAgent.maxOutputTokens}
                      onChange={(e) =>
                        setEditingAgent({ ...editingAgent, maxOutputTokens: parseInt(e.target.value) || 2048 })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">长会话记忆回溯轮次</label>
                    <input
                      type="number"
                      value={editingAgent.contextRounds}
                      onChange={(e) =>
                        setEditingAgent({ ...editingAgent, contextRounds: parseInt(e.target.value) || 15 })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Right Col: Attached Sales Skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-slate-900">
                      挂载的销售类核心 Skill 库 (已绑定 {editingAgent.attachedSkillCodes.length} 项)
                    </h4>
                  </div>

                  {/* Prominent Mount / Manage Button */}
                  <button
                    type="button"
                    onClick={() => setIsSkillMountModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                    title="点击打开技能挂载弹窗，勾选或解除当前智能体挂载的算法技能"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-700" />
                    <span>+ 挂载 / 管理技能</span>
                  </button>
                </div>

                {mountNotification && (
                  <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
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
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2">
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
                          className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs">
                              <Zap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-xs font-bold text-slate-900 truncate">
                                  {skill ? skill.name : skillCode}
                                </h5>
                                <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                                  {skillCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {skill ? skill.description : '专业外贸销售算法组件'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              已挂载
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUnmountSkill(skillCode)}
                              className="text-[11px] px-2 py-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                              title="解除此技能挂载"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span className="hidden sm:inline">解除挂载</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Custom Agent Specific Parameters */}
                {editingAgent.parameters && editingAgent.parameters.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      <span>{editingAgent.name} 专属业务策略参数</span>
                    </h5>
                    <div className="space-y-2 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3">
                      {editingAgent.parameters.map((param) => (
                        <div key={param.key} className="flex items-center justify-between gap-4 text-xs py-1">
                          <div>
                            <span className="font-medium text-slate-800">{param.name}</span>
                            <span className="text-[10px] text-slate-400 block">{param.description}</span>
                          </div>

                          <div className="shrink-0">
                            {param.type === 'boolean' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateAgentParam(param.key, !param.value)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                                  param.value ? 'bg-[#EA3A20]' : 'bg-slate-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                    param.value ? 'translate-x-4.5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            )}

                            {param.type === 'number' && (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={param.value}
                                  onChange={(e) =>
                                    handleUpdateAgentParam(param.key, parseFloat(e.target.value) || 0)
                                  }
                                  className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono text-right"
                                />
                                {param.unit && <span className="text-[10px] text-slate-500">{param.unit}</span>}
                              </div>
                            )}

                            {param.type === 'select' && param.options && (
                              <select
                                value={param.value}
                                onChange={(e) => handleUpdateAgentParam(param.key, e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 max-w-[180px]"
                              >
                                {param.options.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* System Prompt Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-[#EA3A20]" />
                  <span>【{editingAgent.name}】人设与系统核心指令 (System Prompt)</span>
                </label>

                <button
                  type="button"
                  onClick={handleResetAgentPrompt}
                  className="text-xs text-slate-500 hover:text-[#EA3A20] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>恢复出厂预设人设</span>
                </button>
              </div>

              <textarea
                rows={7}
                value={editingAgent.systemPrompt}
                onChange={(e) => setEditingAgent({ ...editingAgent, systemPrompt: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono leading-relaxed text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                placeholder="请输入详细的 System Prompt 指令..."
              />
            </div>

            {/* Interactive Live Sandbox Debugger */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#EA3A20]" />
                  <h4 className="text-xs font-bold text-slate-900">
                    智能体实时交互沙箱调试 (Live Sandbox Tester)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">
                  模拟海外买家发送询盘，即时检验此智能体的推理结论与风控过滤
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
                    className="text-[10px] bg-slate-100 hover:bg-[#FFF4F2] hover:text-[#EA3A20] text-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60 cursor-pointer truncate max-w-xs"
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
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                />
                <button
                  type="button"
                  onClick={() => handleSendDebug()}
                  disabled={isDebugging || !debugInput.trim()}
                  className="px-4 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>测试运行</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL VIEW: 全局默认底座参数 (Fallback Configuration) */}
      {viewMode === 'global' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">系统全局默认 Agent 底座与回退配置</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                当未指定具体销售类智能体承接时，系统默认采用的综合人设与基础语言、出港口岸参数
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveCurrentAgent}
              className="px-4 py-1.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              {savedTip ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>保存全局底座</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">系统默认智能体集群主名称</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">多语种自动同传与翻译模式</label>
                <select
                  value={languageMode}
                  onChange={(e) => setLanguageMode(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                >
                  <option value="中英双语 (默认)">中英双语 (默认 - 海外英文答复，内部中文对照)</option>
                  <option value="多国语言自动翻译">多国语言自动翻译 (德语/西语/阿语实时映射)</option>
                  <option value="纯英文纯粹视角">纯英文纯粹视角 (严格纯正外贸商务信函)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">默认 FOB 海运始发港口</label>
                <input
                  type="text"
                  value={config.fobDefaultPort || 'Shenzhen / Yantian (深圳盐田港)'}
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">默认行文语气基调</label>
                <select
                  value={toneStyle}
                  onChange={(e) => setToneStyle(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                >
                  <option value="严谨专业">严谨专业 (强调结构力学与环保认证，推荐)</option>
                  <option value="高层商务">高层商务 (典雅沉稳，适合大宗工程开发商)</option>
                  <option value="工程顾问">工程顾问 (深入节点图纸与五金公差)</option>
                  <option value="热情亲切">热情亲切 (敏捷响应，侧重打样签板)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">自动回复拟人化延迟</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={3}
                    min={0}
                    max={30}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-right"
                  />
                  <span className="text-xs text-slate-500">秒 (模拟人工打字状态，提升买家信任感)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Mount Modal */}
      <SkillMountModal
        isOpen={isSkillMountModalOpen}
        agent={editingAgent}
        allSkills={allAvailableSkills}
        onClose={() => setIsSkillMountModalOpen(false)}
        onSaveMount={handleSaveMountSkills}
      />
    </div>
  );
};
