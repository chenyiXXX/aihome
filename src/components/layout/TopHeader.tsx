import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MultiTabBar, TabItem } from './MultiTabBar';

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  department?: string;
}

interface TopHeaderProps {
  tabs: TabItem[];
  activeTabKey: string;
  onSelectTab: (tab: TabItem) => void;
  onCloseTab: (tabId: string, e: React.MouseEvent) => void;
  onNewAction?: () => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onLogout?: () => void;
  currentUser?: UserProfile;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  tabs,
  activeTabKey,
  onSelectTab,
  onCloseTab,
  unreadCount = 0,
  onOpenNotifications,
  onLogout,
  currentUser = {
    name: 'Franklin Jr',
    role: '超级管理员 (Superadmin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  }
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutToast, setLogoutToast] = useState<string | null>(null);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    }
    setLogoutToast('已安全退出当前账号');
    setTimeout(() => {
      setLogoutToast(null);
    }, 3500);
  };

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
      <div className="flex items-center gap-3 shrink-0">
        {/* Bell Notifications Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          title={`消息通知面板 (${unreadCount} 条未读)`}
          className="relative w-10 h-10 rounded-full bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 group"
        >
          <Bell className="w-4.5 h-4.5 text-slate-600 group-hover:text-[#EA3A20] transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#EA3A20] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Logout Button right next to Notifications */}
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          title="退出登录"
          className="relative w-10 h-10 rounded-full bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 group"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* User Profile Pill at Far Top-Right */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200/80 cursor-pointer group shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block text-left">
            <div className="font-bold text-slate-800 text-xs tracking-tight leading-tight group-hover:text-[#EA3A20] transition-colors">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-400 font-medium leading-tight truncate max-w-[120px]">
              {currentUser.role.split(' ')[0]}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">确认退出登录？</h3>
                <p className="text-xs text-slate-500 mt-0.5">当前登录账号: {currentUser.name} ({currentUser.role.split(' ')[0]})</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>确认退出</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification after Logout */}
      {logoutToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{logoutToast}</span>
        </div>
      )}
    </header>
  );
};
