import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { SystemAgentConfig, AgentSkill } from '../../types';
import { initialAgentSkills } from '../../data/mockData';
import { AgentConfigView } from './agent_config/AgentConfigView';
import { SkillConfigView, SkillConfigViewHandle } from './agent_config/SkillConfigView';

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
  const [isEditingSkill, setIsEditingSkill] = useState(false);

  const skillConfigRef = useRef<SkillConfigViewHandle>(null);

  // Synchronize when external subView changes
  useEffect(() => {
    setIsEditingSkill(false);
    if (subView === 'Skill 配置') {
      setActiveTab('Skill 配置');
    } else if (subView === 'Agent 配置' || subView === '智能体基础配置' || subView === '智能体基础设置') {
      setActiveTab('Agent 配置');
    }
  }, [subView]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      {/* Top Header Bar */}
      {!(activeTab === 'Skill 配置' && isEditingSkill) && (
        <div className="flex items-center justify-between py-3 mb-2 shrink-0 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              {activeTab}
            </h2>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {activeTab === 'Skill 配置' && (
              <button
                type="button"
                onClick={() => skillConfigRef.current?.openCreateModal()}
                className="h-9 px-4 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建 Skill</span>
              </button>
            )}
          </div>
        </div>
      )}

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
            ref={skillConfigRef}
            skills={skillsList}
            onUpdateSkills={(updated) => {
              setSkillsList(updated);
            }}
            onEditingChange={setIsEditingSkill}
          />
        )}
      </div>
    </div>
  );
};
