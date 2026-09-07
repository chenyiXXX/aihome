import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Check,
  Zap,
  Wrench,
  Bot,
  Filter,
  CheckSquare,
  Square,
  ShieldCheck,
  Coins,
  Cpu,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { SalesAgentItem, AgentSkill } from '../../../types';

interface SkillMountModalProps {
  isOpen: boolean;
  agent: SalesAgentItem;
  allSkills: AgentSkill[];
  onClose: () => void;
  onSaveMount: (newAttachedSkillCodes: string[]) => void;
}

const CATEGORY_TABS = [
  '全部技能',
  '销售核心技能',
  '解析与数据',
  '通信与同步',
  '画像与枚举',
  '检索与RAG',
  '报价与计价',
  '文档与商业',
  '风控与合规',
  '计算与配载',
  '工程与图纸',
  '合规与质检'
] as const;

export const SkillMountModal: React.FC<SkillMountModalProps> = ({
  isOpen,
  agent,
  allSkills,
  onClose,
  onSaveMount
}) => {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部技能');

  // Initialize selected skills when modal opens or agent changes
  useEffect(() => {
    if (isOpen) {
      setSelectedCodes(agent.attachedSkillCodes || []);
      setSearchQuery('');
      setSelectedCategory('全部技能');
    }
  }, [isOpen, agent]);

  if (!isOpen) return null;

  // Toggle a skill selection
  const handleToggleSkill = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Filter skills
  const SALES_CORE_CODES = [
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

  const filteredSkills = allSkills.filter((s) => {
    let matchCat = true;
    if (selectedCategory === '全部技能') {
      matchCat = true;
    } else if (selectedCategory === '销售核心技能') {
      matchCat = SALES_CORE_CODES.includes(s.code);
    } else {
      matchCat = s.category === selectedCategory;
    }

    const matchSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.triggerKeywords && s.triggerKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchCat && matchSearch;
  });

  // Select all currently filtered skills
  const handleSelectAllFiltered = () => {
    const codesToAdd = filteredSkills.map((s) => s.code);
    setSelectedCodes((prev) => Array.from(new Set([...prev, ...codesToAdd])));
  };

  // Deselect all currently filtered skills
  const handleDeselectAllFiltered = () => {
    const codesToRemove = new Set(filteredSkills.map((s) => s.code));
    setSelectedCodes((prev) => prev.filter((code) => !codesToRemove.has(code)));
  };

  const handleConfirm = () => {
    onSaveMount(selectedCodes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-linear-to-r from-slate-50 via-white to-amber-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">
                  为【{agent.name}】挂载与管理 Skill 算力
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                  {agent.code}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {agent.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                勾选或取消勾选要挂载给该智能体的工具库。挂载后智能体可在会话中依据 Prompt 和语义自动触发调用。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索技能名称、函数代码或触发关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
              />
            </div>

            {/* Quick Bulk Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>全选当前筛选</span>
              </button>
              <button
                type="button"
                onClick={handleDeselectAllFiltered}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 text-slate-500" />
                <span>清空当前筛选</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Selection Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSkills.map((skill) => {
              const isSelected = selectedCodes.includes(skill.code);
              return (
                <div
                  key={skill.id || skill.code}
                  onClick={() => handleToggleSkill(skill.code)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/40 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#EA3A20] text-white'
                          : 'border border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Skill details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{skill.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                        {skill.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {skill.category}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {skill.triggerType}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900">
                          ● 已挂载到该Agent
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>

                    {skill.triggerKeywords && skill.triggerKeywords.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        <span className="text-[10px] text-slate-400">唤起词:</span>
                        {skill.triggerKeywords.slice(0, 3).map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-500"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSkills.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              未找到匹配的 Skill，请调整搜索词或分类筛选
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">已勾选挂载：</span>
            <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {selectedCodes.length} / {allSkills.length} 项 Skill
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>确认并保存挂载</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
