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
      {/* Top Header & Tab Selector Bar */}
      <div className="flex items-center justify-between py-4 mb-2 shrink-0 border-b border-slate-200/80">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-200/80 flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleTabChange('Agent 配置')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'Agent 配置'
                  ? 'bg-[#EA3A20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Agent 配置</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('Skill 配置')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'Skill 配置'
                  ? 'bg-[#EA3A20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Skill 配置</span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>智能体基础设置：涵盖 Agent 核心模型底座参数与 Skill 专业外贸算力工具库</span>
          </div>
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
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pr-1">
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
