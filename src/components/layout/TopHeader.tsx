import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { MultiTabBar, TabItem } from './MultiTabBar';

interface TopHeaderProps {
  tabs: TabItem[];
  activeTabKey: string;
  onSelectTab: (tab: TabItem) => void;
  onCloseTab: (tabId: string, e: React.MouseEvent) => void;
  onNewAction?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  tabs,
  activeTabKey,
  onSelectTab,
  onCloseTab
}) => {
  return (
    <header className="h-16 px-8 bg-transparent flex items-center justify-between shrink-0 select-none gap-6 pt-2">
      {/* Left: Multi-Tab Windows Bar positioned directly where the Title used to be */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <MultiTabBar
          tabs={tabs}
          activeTabKey={activeTabKey}
          onSelectTab={onSelectTab}
          onCloseTab={onCloseTab}
        />
      </div>

      {/* Right Header Navigation & Actions */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Bell Notifications Badge */}
        <button
          title="通知"
          className="relative w-10 h-10 rounded-full bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Bell className="w-4.5 h-4.5 text-slate-600" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#EA3A20] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
            18
          </span>
        </button>

        {/* User Profile Pill at Far Top-Right */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200/80 cursor-pointer group shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Franklin Jr"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block text-left">
            <div className="font-bold text-slate-800 text-xs tracking-tight leading-tight group-hover:text-[#EA3A20] transition-colors">
              Franklin Jr
            </div>
            <div className="text-[10px] text-slate-400 font-medium leading-tight">
              Superadmin
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};
