import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, AlertTriangle, CheckCircle2, Shield, User, Sparkles, Check } from 'lucide-react';
import { MultiTabBar, TabItem } from './MultiTabBar';
import { MOCK_ROLE_ACCOUNTS, UserRoleProfile, normalizeRole } from '../../config/rolePermissions';

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
  onSwitchRole?: (user: UserRoleProfile) => void;
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
    role: '超级管理员',
    department: '智能数字化中心',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  onSwitchRole
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutToast, setLogoutToast] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    setShowUserDropdown(false);
    if (onLogout) {
      onLogout();
    }
    setLogoutToast('已安全退出当前账号');
    setTimeout(() => {
      setLogoutToast(null);
    }, 3500);
  };

  const currentNormRole = normalizeRole(currentUser.role);

  return (
    <header className="h-16 px-8 bg-transparent flex items-center justify-between shrink-0 select-none gap-6 pt-2 relative z-40">
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

        {/* User Profile Pill at Far Top-Right with Role Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-3 pl-3 border-l border-slate-200/80 cursor-pointer group shrink-0 text-left"
          >
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
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* User Profile & Role Switch Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 top-12 mt-2 w-72 bg-white rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-700">
              {/* User Summary Header */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200/80 text-slate-700 font-semibold">
                        {currentUser.role.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {currentUser.department || '智能数字化中心'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Switch Section */}
              <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>切换登录角色与权限</span>
                <span className="text-[10px] text-slate-400 font-normal">实时切换菜单</span>
              </div>

              <div className="space-y-1">
                {MOCK_ROLE_ACCOUNTS.map((acc) => {
                  const isCurrent = currentNormRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => {
                        if (onSwitchRole) {
                          onSwitchRole(acc);
                        }
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#FFF4F2] text-[#EA3A20] font-bold border border-[#EA3A20]/20'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-[#EA3A20] text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold leading-tight">
                            {acc.role}
                            <span className="text-[10px] font-normal text-slate-400 ml-1.5">
                              ({acc.name})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                            {acc.role === '超级管理员' && '全模块最高权限'}
                            {acc.role === '基础数据维护' && '售前询盘 · 知识库 · 面价汇率 · 数据统计 · 权限与配置'}
                            {acc.role === '销售' && '知识问答 · 销售助手 · 知识库 · 面价汇率'}
                            {acc.role === '运营推广' && '知识问答 · 运营助手 · 知识库管理'}
                          </div>
                        </div>
                      </div>
                      {isCurrent && (
                        <Check className="w-4 h-4 text-[#EA3A20] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Divider & Logout */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>退出系统账号</span>
                </button>
              </div>
            </div>
          )}
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
