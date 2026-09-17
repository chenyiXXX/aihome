import React, { useState, useEffect } from 'react';
import {
  Save,
  Check,
  Bot,
  Wrench,
  Sliders,
  Sparkles,
  Layers,
  HelpCircle,
  Download,
  Upload
} from 'lucide-react';
import { SystemAgentConfig, AgentSkill } from '../../types';
import { initialAgentSkills } from '../../data/mockData';
import { AgentConfigView } from './agent_config/AgentConfigView';
import { SkillConfigView } from './agent_config/SkillConfigView';

interface SystemConfigModuleProps {
  config: SystemAgentConfig;
  subView: string;
  onSelectSubView?: (subView: string) => void;
}

export const SystemConfigModule: React.FC<SystemConfigModuleProps> = ({
  config,
  subView,
  onSelectSubView
}) => {
  // Determine tab from subView
  const initialTab = subView === 'Skill 配置' ? 'Skill 配置' : 'Agent 配置';
  const [activeTab, setActiveTab] = useState<'Agent 配置' | 'Skill 配置'>(initialTab);
  
  // Local state for full config
  const [agentConfig, setAgentConfig] = useState<SystemAgentConfig>(config);
  const [skillsList, setSkillsList] = useState<AgentSkill[]>(config.skills || initialAgentSkills);
  const [isSaved, setIsSaved] = useState(false);

  // Synchronize when external subView changes
  useEffect(() => {
    if (subView === 'Skill 配置') {
      setActiveTab('Skill 配置');
    } else if (subView === 'Agent 配置' || subView === '智能体基础配置' || subView === '智能体基础设置') {
      setActiveTab('Agent 配置');
    }
  }, [subView]);

  const handleTabChange = (tab: 'Agent 配置' | 'Skill 配置') => {
    setActiveTab(tab);
    if (onSelectSubView) {
      onSelectSubView(tab);
    }
  };

  const handleSaveGlobal = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const handleExportConfig = () => {
    const fullPayload = {
      exportTime: new Date().toISOString(),
      agentConfig,
      skills: skillsList
    };
    const blob = new Blob([JSON.stringify(fullPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HomeCraft_AI_Agent_Config_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-3 mb-2 shrink-0 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900">
            {activeTab}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {activeTab === 'Agent 配置' ? '智能体基础设置：涵盖 Agent 核心模型底座参数与全局算力' : 'Skill 专业外贸算力与工具库配置'}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportConfig}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="导出当前全套 Agent 与 Skill JSON 配置清单"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">导出配置包</span>
          </button>

          <button
            type="button"
            onClick={handleSaveGlobal}
            className="h-9 px-5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs active:scale-95"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? '已全局保存！' : '保存全局基础设置'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col pt-2 pr-1">
        {activeTab === 'Agent 配置' && (
          <AgentConfigView
            config={agentConfig}
            allSkills={skillsList}
            onSave={(newCfg) => {
              setAgentConfig((prev) => ({ ...prev, ...newCfg }));
            }}
          />
        )}

        {activeTab === 'Skill 配置' && (
          <SkillConfigView
            skills={skillsList}
            onUpdateSkills={(updated) => {
              setSkillsList(updated);
            }}
          />
        )}
      </div>
    </div>
  );
};
