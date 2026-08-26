import React from 'react';
import {
  X,
  LayoutDashboard,
  Send,
  Users,
  Sparkles,
  RotateCw,
  PieChart,
  Users2,
  Settings,
  FileText,
  ChevronRight
} from 'lucide-react';
import { ModuleType } from '../../types';

export interface TabItem {
  id: string; // Unique composite key e.g. `${moduleId}__${subView}`
  moduleId: ModuleType;
  moduleTitle: string;
  subView: string;
  title: string;
  closable?: boolean;
}

interface MultiTabBarProps {
  tabs: TabItem[];
  activeTabKey: string;
  onSelectTab: (tab: TabItem) => void;
  onCloseTab: (tabId: string, e: React.MouseEvent) => void;
}

const getModuleIcon = (id: ModuleType) => {
  switch (id) {
    case 'home':
      return LayoutDashboard;
    case 'pre_sales':
      return Send;
    case 'in_sales':
      return Users;
    case 'marketing':
      return Sparkles;
    case 'knowledge_base':
      return RotateCw;
    case 'analytics':
      return PieChart;
    case 'employee':
      return Users2;
    case 'sys_config':
      return Settings;
    case 'audit_logs':
      return FileText;
    default:
      return Send;
  }
};

export const MultiTabBar: React.FC<MultiTabBarProps> = ({
  tabs,
  activeTabKey,
  onSelectTab,
  onCloseTab
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1 max-w-full">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabKey;
        const Icon = getModuleIcon(tab.moduleId);

        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab)}
            className={`group relative h-10 px-4 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all duration-150 shrink-0 text-xs ${
              isActive
                ? 'bg-white text-[#EA3A20] font-bold shadow-xs border border-slate-200/90 ring-1 ring-black/[0.02]'
                : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 font-medium border border-transparent'
            }`}
          >
            {/* Module Icon */}
            <Icon
              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                isActive ? 'text-[#EA3A20]' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />

            {/* Tab Title */}
            <div className="flex items-center gap-1.5">
              <span className="whitespace-nowrap font-bold">{tab.moduleTitle}</span>
              {tab.subView &&
                tab.subView !== tab.moduleTitle &&
                tab.subView !== '通用知识问答' &&
                tab.subView !== '售前询盘列表' &&
                tab.subView !== '会话列表' && (
                  <>
                    <ChevronRight
                      className={`w-3 h-3 ${
                        isActive ? 'text-[#EA3A20]/60' : 'text-slate-400'
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap font-medium ${
                        isActive ? 'text-[#EA3A20]' : 'text-slate-500'
                      }`}
                    >
                      {tab.subView}
                    </span>
                  </>
                )}
            </div>

            {/* Close Button */}
            {tabs.length > 1 && (
              <button
                type="button"
                title="关闭标签页"
                onClick={(e) => onCloseTab(tab.id, e)}
                className={`w-4.5 h-4.5 rounded-full flex items-center justify-center transition-all ml-1 cursor-pointer ${
                  isActive
                    ? 'text-slate-400 hover:text-white hover:bg-[#EA3A20]'
                    : 'text-slate-400 opacity-60 group-hover:opacity-100 hover:bg-slate-300 hover:text-slate-800'
                }`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}

            {/* Active Bottom Glow Indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#EA3A20] rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};
