import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ShieldCheck,
  Mail,
  Ship,
  Mic,
  Coins,
  Calculator,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
  FileSpreadsheet,
  Radio,
  Tags,
  SearchCode,
  FileText,
  ShieldAlert,
  Clock,
  BookCheck,
  Bot
} from 'lucide-react';
import { AgentSkill, AgentSkillParameter } from '../../../types';
import { SkillSandboxModal } from './SkillSandboxModal';
import { AgentBindModal } from './AgentBindModal';

interface SkillConfigViewProps {
  skills: AgentSkill[];
  onUpdateSkills?: (updatedSkills: AgentSkill[]) => void;
}

const CATEGORIES = [
  '全部技能',
  '销售类核心Skill (9项)',
  '解析与数据',
  '通信与同步',
  '画像与枚举',
  '检索与RAG',
  '报价与计价',
  '文档与商业',
  '风控与合规',
  '生命周期',
  '知识协同',
  '计算与配载',
  '工程与图纸',
  '合规与质检',
  '商务与文案',
  '语音与多模态'
] as const;

export const SkillConfigView: React.FC<SkillConfigViewProps> = ({ skills: initialSkills, onUpdateSkills }) => {
  const [skillsList, setSkillsList] = useState<AgentSkill[]>(initialSkills);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部技能');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(skillsList[0]?.id || null);
  
  // Sandbox modal state
  const [testingSkill, setTestingSkill] = useState<AgentSkill | null>(null);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  // Agent Binding Modal state
  const [bindingSkill, setBindingSkill] = useState<AgentSkill | null>(null);

  // New Skill Modal state
  const [isNewSkillModalOpen, setIsNewSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCode, setNewSkillCode] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<AgentSkill['category']>('计算与配载');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillKeywords, setNewSkillKeywords] = useState('');

  const [savedTip, setSavedTip] = useState(false);

  // Toggle skill on/off
  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = skillsList.map((s) => {
      if (s.id === id) {
        return { ...s, status: s.status === 'enabled' ? ('disabled' as const) : ('enabled' as const) };
      }
      return s;
    });
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);
  };

  // Update a parameter of a skill
  const handleUpdateParam = (skillId: string, paramKey: string, newValue: any) => {
    const updated = skillsList.map((s) => {
      if (s.id === skillId) {
        const newParams = s.parameters.map((p) => {
          if (p.key === paramKey) {
            return { ...p, value: newValue };
          }
          return p;
        });
        return { ...s, parameters: newParams };
      }
      return s;
    });
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);
  };

  // Save changes
  const handleSaveAll = () => {
    if (onUpdateSkills) onUpdateSkills(skillsList);
    setSavedTip(true);
    setTimeout(() => setSavedTip(false), 2000);
  };

  // Filter skills
  const SALES_SKILL_CODES = [
    'drawing_boq_parser',
    'chat_stream_sync',
    'customer_tagging_enum',
    'hybrid_rag_search',
    'quotation_calculation',
    'commercial_document_gen',
    'compliance_regex_guardrail',
    'quote_lifecycle_tracker',
    'knowledge_review_publish'
  ];

  const filteredSkills = skillsList.filter((s) => {
    let matchCategory = true;
    if (selectedCategory === '全部技能') {
      matchCategory = true;
    } else if (selectedCategory === '销售类核心Skill (9项)') {
      matchCategory = SALES_SKILL_CODES.includes(s.code) || (s.associatedAgents && s.associatedAgents.length > 0);
    } else {
      matchCategory = s.category === selectedCategory;
    }

    const matchSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.triggerKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.associatedAgents && s.associatedAgents.some((ag) => ag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchCategory && matchSearch;
  });

  // Calculate metrics
  const totalSkills = skillsList.length;
  const enabledSkills = skillsList.filter((s) => s.status === 'enabled').length;
  const totalInvocations = skillsList.reduce((acc, s) => acc + s.invocationCount, 0);

  // Helper for skill icon
  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSpreadsheet':
        return FileSpreadsheet;
      case 'Radio':
        return Radio;
      case 'Tags':
        return Tags;
      case 'SearchCode':
        return SearchCode;
      case 'Calculator':
        return Calculator;
      case 'FileText':
        return FileText;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Clock':
        return Clock;
      case 'BookCheck':
        return BookCheck;
      case 'Coins':
        return Coins;
      case 'Layers':
        return Layers;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Mail':
        return Mail;
      case 'Ship':
        return Ship;
      case 'Mic':
        return Mic;
      default:
        return Wrench;
    }
  };

  // Handle add custom skill
  const handleCreateCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillCode.trim()) return;

    const newSkill: AgentSkill = {
      id: `skill-custom-${Date.now()}`,
      name: newSkillName.trim(),
      code: newSkillCode.trim().toLowerCase().replace(/\s+/g, '_'),
      category: newSkillCategory,
      description: newSkillDesc.trim() || '自定义外贸定制算力与业务扩展技能',
      version: 'v1.0.0',
      status: 'enabled',
      iconName: 'Wrench',
      triggerType: '自动语义唤起',
      triggerKeywords: newSkillKeywords
        ? newSkillKeywords.split(/[,， ]+/).filter(Boolean)
        : ['自定义', newSkillName.trim()],
      inputSchemaSummary: '{ query: string, context: Record<string, any> }',
      outputSchemaSummary: '{ result: any, code: number }',
      invocationCount: 0,
      successRate: '100%',
      avgLatencyMs: 120,
      isCustom: true,
      parameters: [
        {
          name: '默认调用超时时间',
          key: 'timeout_ms',
          type: 'number',
          value: 3000,
          description: '毫秒级调用安全超时门限',
          unit: 'ms'
        }
      ]
    };

    const updated = [newSkill, ...skillsList];
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);

    // Reset & close
    setNewSkillName('');
    setNewSkillCode('');
    setNewSkillDesc('');
    setNewSkillKeywords('');
    setIsNewSkillModalOpen(false);
  };

  // Save agent bindings for a skill
  const handleSaveAgentBinding = (updatedAssociatedAgents: string[]) => {
    if (!bindingSkill) return;
    const updated = skillsList.map((s) =>
      s.id === bindingSkill.id || s.code === bindingSkill.code
        ? { ...s, associatedAgents: updatedAssociatedAgents }
        : s
    );
    setSkillsList(updated);
    if (onUpdateSkills) {
      onUpdateSkills(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Metrics & Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>装备技能总数</span>
            <Layers className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{totalSkills} 项</div>
          <div className="text-[11px] text-slate-400">覆盖全流程算力</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>当前已激活</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{enabledSkills} 项</div>
          <div className="text-[11px] text-slate-400">在线就绪率 100%</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>综合调用成功率</span>
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">99.7%</div>
          <div className="text-[11px] text-emerald-600 font-medium">高可用零故障</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>过去24H调用量</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{totalInvocations.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">持续支撑客服与对练</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>平均响应耗时</span>
            <Activity className="w-3.5 h-3.5 text-[#EA3A20]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#EA3A20]">185 ms</div>
          <div className="text-[11px] text-slate-400">极速毫秒级流式下发</div>
        </div>
      </div>

      {/* 2. Controls, Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索技能名称/关键词/代码..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] w-52"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsNewSkillModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#EA3A20]" />
            <span>自定义技能</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-1.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            {savedTip ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{savedTip ? '已保存！' : '保存技能配置'}</span>
          </button>
        </div>
      </div>

      {/* 3. Skills Cards Grid / List */}
      <div className="space-y-4">
        {filteredSkills.map((skill) => {
          const Icon = getSkillIcon(skill.iconName);
          const isExpanded = expandedSkillId === skill.id;
          const isEnabled = skill.status === 'enabled';

          return (
            <div
              key={skill.id}
              className={`bg-white border rounded-3xl transition-all shadow-[0_2px_16px_rgba(0,0,0,0.02)] overflow-hidden ${
                isEnabled ? 'border-slate-200/80' : 'border-slate-200/50 opacity-75'
              }`}
            >
              {/* Card Header Banner */}
              <div
                onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Skill Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      isEnabled
                        ? 'bg-[#EA3A20]/10 text-[#EA3A20]'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{skill.name}</h4>
                      <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {skill.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {skill.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {skill.version}
                      </span>
                      {skill.isCustom && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          自定义扩展
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {skill.description}
                    </p>

                    {/* Trigger Keywords */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-medium text-slate-400">触发词:</span>
                      {skill.triggerKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Associated Sales Agents */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[11px] font-medium text-slate-400">关联智能体:</span>
                      {skill.associatedAgents && skill.associatedAgents.length > 0 ? (
                        skill.associatedAgents.map((agName, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70 text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                          >
                            <Bot className="w-2.5 h-2.5 text-amber-600" />
                            {agName}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">暂未挂载到智能体</span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBindingSkill(skill);
                        }}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ml-1"
                        title="点击选择挂载到哪些外贸销售智能体"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>挂载到智能体</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Header Stats & Controls */}
                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Invocations and latency pill */}
                  <div className="hidden lg:flex flex-col items-end text-[11px] text-slate-500 font-mono pr-2">
                    <span>调用: <b className="text-slate-800">{skill.invocationCount.toLocaleString()}</b> 次</span>
                    <span>耗时: <b className="text-slate-800">{skill.avgLatencyMs}ms</b> | 成功率: <b className="text-emerald-600">{skill.successRate}</b></span>
                  </div>

                  {/* Sandbox Run Test Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setTestingSkill(skill);
                      setIsSandboxOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#FFF4F2] text-slate-700 hover:text-[#EA3A20] text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200/80 transition-all shadow-2xs"
                    title="在沙箱中传入模拟参数进行测试"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>测试运行</span>
                  </button>

                  {/* Toggle Enable Switch */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleStatus(skill.id, e)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      isEnabled ? 'bg-[#EA3A20]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>

                  {/* Expand Chevron */}
                  <button
                    type="button"
                    onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Parameters & Details Section */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-5 space-y-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#EA3A20]" />
                      <span>算法与业务规则关键参数配置 (Configurable Parameters)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      参数即时生效，调整后将影响 AI 生成的数据与判定逻辑
                    </span>
                  </div>

                  {/* Parameters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skill.parameters.map((param) => (
                      <div
                        key={param.key}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200/70 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">
                            {param.name}
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            key: {param.key}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {param.description}
                        </p>

                        {/* Input by Type */}
                        <div className="pt-1">
                          {param.type === 'number' && (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="any"
                                value={param.value}
                                onChange={(e) =>
                                  handleUpdateParam(
                                    skill.id,
                                    param.key,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                              />
                              {param.unit && (
                                <span className="text-xs font-bold font-mono text-slate-500 shrink-0">
                                  {param.unit}
                                </span>
                              )}
                            </div>
                          )}

                          {param.type === 'select' && param.options && (
                            <select
                              value={param.value}
                              onChange={(e) =>
                                handleUpdateParam(skill.id, param.key, e.target.value)
                              }
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                            >
                              {param.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          )}

                          {param.type === 'boolean' && (
                            <label className="flex items-center gap-2.5 cursor-pointer py-1">
                              <input
                                type="checkbox"
                                checked={!!param.value}
                                onChange={(e) =>
                                  handleUpdateParam(skill.id, param.key, e.target.checked)
                                }
                                className="w-4 h-4 rounded accent-[#EA3A20]"
                              />
                              <span className="text-xs font-bold text-slate-700">
                                {param.value ? '已启用该限制项' : '未启用该限制项'}
                              </span>
                            </label>
                          )}

                          {param.type === 'string' && (
                            <input
                              type="text"
                              value={param.value}
                              onChange={(e) =>
                                handleUpdateParam(skill.id, param.key, e.target.value)
                              }
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Schema Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-mono">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        入参数据结构定义 (Input Schema Summary):
                      </span>
                      <pre className="text-[11px] text-blue-300 whitespace-pre-wrap leading-relaxed">
                        {skill.inputSchemaSummary}
                      </pre>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-mono">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        出参数据结构定义 (Output Schema Summary):
                      </span>
                      <pre className="text-[11px] text-emerald-300 whitespace-pre-wrap leading-relaxed">
                        {skill.outputSchemaSummary}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredSkills.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-700">未找到符合条件的技能项</div>
            <p className="text-xs text-slate-400">
              请尝试调整分类筛选或清空搜索关键词
            </p>
          </div>
        )}
      </div>

      {/* Sandbox Test Modal */}
      <SkillSandboxModal
        isOpen={isSandboxOpen}
        skill={testingSkill}
        onClose={() => {
          setIsSandboxOpen(false);
          setTestingSkill(null);
        }}
      />

      {/* Create Custom Skill Modal */}
      {isNewSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#EA3A20]" />
                <span>注册新增自定义技能 (Register Custom Skill)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewSkillModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
              >
                取消
              </button>
            </div>

            <form onSubmit={handleCreateCustomSkill} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  技能名称 <span className="text-[#EA3A20]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：海运熏蒸证书真伪比对器"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  技能代码 Identifier <span className="text-[#EA3A20]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：fumigation_cert_verifier"
                  value={newSkillCode}
                  onChange={(e) => setNewSkillCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">所属分类</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  >
                    <option value="计算与配载">计算与配载</option>
                    <option value="工程与图纸">工程与图纸</option>
                    <option value="合规与质检">合规与质检</option>
                    <option value="商务与文案">商务与文案</option>
                    <option value="语音与多模态">语音与多模态</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">触发关键词</label>
                  <input
                    type="text"
                    placeholder="逗号隔开，如：熏蒸, IPPC, 虫害"
                    value={newSkillKeywords}
                    onChange={(e) => setNewSkillKeywords(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">技能功能描述</label>
                <textarea
                  rows={3}
                  placeholder="阐明此技能解决的外贸具体计算或验证场景..."
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold cursor-pointer shadow-xs active:scale-95"
                >
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Agent Binding Modal */}
      {bindingSkill && (
        <AgentBindModal
          isOpen={!!bindingSkill}
          skill={bindingSkill}
          onClose={() => setBindingSkill(null)}
          onSaveBinding={handleSaveAgentBinding}
        />
      )}
    </div>
  );
};
