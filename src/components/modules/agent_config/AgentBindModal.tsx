import React, { useState, useEffect } from 'react';
import {
  X,
  Bot,
  Check,
  Zap,
  CheckSquare,
  Square,
  ShieldCheck,
  Cpu,
  Layers,
  Coins,
  Target,
  Wrench,
  Sparkles
} from 'lucide-react';
import { AgentSkill, SalesAgentItem } from '../../../types';
import { initialSalesAgents } from '../../../data/salesAgentData';

interface AgentBindModalProps {
  isOpen: boolean;
  skill: AgentSkill;
  onClose: () => void;
  onSaveBinding: (updatedAssociatedAgents: string[]) => void;
}

export const AgentBindModal: React.FC<AgentBindModalProps> = ({
  isOpen,
  skill,
  onClose,
  onSaveBinding
}) => {
  const [selectedAgentNames, setSelectedAgentNames] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedAgentNames(skill.associatedAgents || []);
    }
  }, [isOpen, skill]);

  if (!isOpen) return null;

  const handleToggleAgent = (agentName: string) => {
    setSelectedAgentNames((prev) =>
      prev.includes(agentName) ? prev.filter((n) => n !== agentName) : [...prev, agentName]
    );
  };

  const handleSelectAll = () => {
    setSelectedAgentNames(initialSalesAgents.map((a) => a.name));
  };

  const handleClearAll = () => {
    setSelectedAgentNames([]);
  };

  const handleConfirm = () => {
    onSaveBinding(selectedAgentNames);
    onClose();
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-linear-to-r from-slate-50 via-white to-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">
                  为【{skill.name}】挂载到智能体
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                  {skill.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                选择哪些外贸销售智能体装备并可调用此 Skill 算法能力
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

        {/* Quick actions bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            已勾选绑定：
            <b className="text-amber-600 font-mono ml-1">
              {selectedAgentNames.length} / {initialSalesAgents.length} 个智能体
            </b>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>全选</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-slate-500 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Square className="w-3.5 h-3.5" />
              <span>清空</span>
            </button>
          </div>
        </div>

        {/* 7 Sales Agents List */}
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {initialSalesAgents.map((agent) => {
            const isSelected = selectedAgentNames.includes(agent.name);
            const Icon = getAgentIcon(agent.code);

            return (
              <div
                key={agent.id}
                onClick={() => handleToggleAgent(agent.name)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/40 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#EA3A20] text-white'
                        : 'border border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{agent.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                        {agent.code}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 font-bold">
                        {agent.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{agent.role}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isSelected
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isSelected ? '已挂载' : '未挂载'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-2.5">
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
            <span>保存智能体绑定</span>
          </button>
        </div>
      </div>
    </div>
  );
};
