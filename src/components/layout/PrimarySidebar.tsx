import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Send,
  Users,
  Sparkles,
  RotateCw,
  Calculator,
  PieChart,
  Users2,
  Settings,
  FileText,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { ModuleType } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { isModuleAllowedForRole } from '../../config/rolePermissions';

interface PrimarySidebarProps {
  activeModule: ModuleType;
  subView: string;
  onSelectModule: (module: ModuleType, targetSubView?: string) => void;
  onSelectSubView: (subView: string) => void;
  unreadInquiriesCount?: number;
  currentUserRole?: string;
}

export const PrimarySidebar: React.FC<PrimarySidebarProps> = ({
  activeModule,
  subView,
  onSelectModule,
  onSelectSubView,
  currentUserRole = '超级管理员'
}) => {
  // Sidebar collapsed state (true = icon-only mode, false = expanded 256px mode)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Store the set of currently expanded module IDs in normal view
  const [expandedModules, setExpandedModules] = useState<Set<ModuleType>>(() => {
    const initial = new Set<ModuleType>();
    if (activeModule) {
      initial.add(activeModule);
    }
    return initial;
  });

  // Hover state for collapsed floating popover menu (fixed positioned to avoid overflow clipping)
  const [hoveredMenu, setHoveredMenu] = useState<{
    id: ModuleType;
    top: number;
    label: string;
    icon: any;
    defaultSubView: string;
    subViews: string[];
  } | null>(null);

  const hoverTimerRef = useRef<any>(null);

  // Keep expanded state in sync when activeModule changes externally
  useEffect(() => {
    if (activeModule) {
      setExpandedModules((prev) => new Set(prev).add(activeModule));
    }
  }, [activeModule]);

  const handleModuleClick = (modId: ModuleType, defaultSubView: string, hasSubViews: boolean) => {
    if (hasSubViews) {
      if (activeModule === modId) {
        // Toggle collapse/expand if clicking the currently active parent module
        setExpandedModules((prev) => {
          const next = new Set(prev);
          if (next.has(modId)) {
            next.delete(modId);
          } else {
            next.add(modId);
          }
          return next;
        });
      } else {
        // Switch module, navigate to default subview and expand
        onSelectModule(modId, defaultSubView);
        setExpandedModules((prev) => new Set(prev).add(modId));
      }
    } else {
      // Direct single-level module click
      onSelectModule(modId, defaultSubView);
    }
  };

  const handleItemMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: any) => {
    if (!isCollapsed) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredMenu({
      id: item.id,
      top: rect.top,
      label: item.label,
      icon: item.icon,
      defaultSubView: item.defaultSubView,
      subViews: item.subViews
    });
  };

  const handleItemMouseLeave = () => {
    if (!isCollapsed) return;
    hoverTimerRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 150);
  };

  const handlePopoverMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const handlePopoverMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 150);
  };

  const navItems = [
    {
      id: 'home' as ModuleType,
      label: '知识问答',
      icon: LayoutDashboard,
      defaultSubView: '知识问答',
      subViews: []
    },
    {
      id: 'in_sales' as ModuleType,
      label: '销售助手',
      icon: Users,
      defaultSubView: '会话列表',
      subViews: []
    },
    {
      id: 'marketing' as ModuleType,
      label: '运营助手',
      icon: Sparkles,
      defaultSubView: '视频剪辑',
      subViews: ['视频剪辑', '图文生成', '发布审核', '发布计划', '素材库', '账号管理']
    },
    {
      id: 'pre_sales' as ModuleType,
      label: '售前询盘',
      icon: Send,
      defaultSubView: '售前询盘列表',
      subViews: []
    },
    {
      id: 'knowledge_base' as ModuleType,
      label: '知识库管理',
      icon: RotateCw,
      defaultSubView: '内容上传',
      subViews: ['内容上传', '知识复核', '分类管理', '标签管理']
    },
    {
      id: 'pricing_maintenance' as ModuleType,
      label: '面价汇率',
      icon: Calculator,
      defaultSubView: '面价',
      subViews: []
    },
    {
      id: 'analytics' as ModuleType,
      label: '数据统计',
      icon: PieChart,
      defaultSubView: '智能体统计',
      subViews: ['智能体统计', '用户使用系统统计']
    },
    {
      id: 'employee' as ModuleType,
      label: '员工权限',
      icon: Users2,
      defaultSubView: '员工列表',
      subViews: ['员工列表', '角色列表']
    },
    {
      id: 'sys_config' as ModuleType,
      label: '智能体基础设置',
      icon: Settings,
      defaultSubView: 'Agent 配置',
      subViews: ['Agent 配置', 'Skill 配置']
    },
    {
      id: 'audit_logs' as ModuleType,
      label: '日志与审计',
      icon: FileText,
      defaultSubView: '日志与审计',
      subViews: []
    }
  ];

  const filteredNavItems = navItems.filter((item) =>
    isModuleAllowedForRole(item.id, currentUserRole)
  );

  return (
    <aside
      className={`bg-white text-slate-700 flex flex-col h-full shrink-0 select-none border-r border-slate-100/90 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 z-30 ${
        isCollapsed
          ? 'w-[84px] min-w-[84px] max-w-[84px]'
          : 'w-64 min-w-[256px] max-w-[256px]'
      }`}
    >
      {/* 1. Top Brand Logo & Collapse/Expand Button */}
      <div
        className={`flex items-center pt-5 pb-4 h-16 transition-all duration-300 ${
          isCollapsed ? 'justify-center gap-1.5 px-2' : 'justify-between px-5'
        }`}
      >
        <BrandLogo className={isCollapsed ? 'h-7' : 'h-9'} showText={!isCollapsed} />
        
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            setHoveredMenu(null);
          }}
          title={isCollapsed ? '展开菜单栏' : '收起菜单栏'}
          className="text-slate-400 hover:text-[#EA3A20] hover:bg-red-50/80 rounded-lg p-1 cursor-pointer transition-colors shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 2. Navigation List with Unified Scrollbar Styling */}
      <nav
        className={`flex-1 py-3 overflow-y-auto overflow-x-hidden custom-scrollbar ${
          isCollapsed ? 'space-y-2 px-2' : 'space-y-1'
        }`}
      >
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActiveModule = activeModule === item.id;
          const hasSubViews = item.subViews && item.subViews.length > 0;
          const isExpanded = hasSubViews && expandedModules.has(item.id);
          const isDirectActive = isActiveModule && !hasSubViews;
          const isParentActive = isActiveModule && hasSubViews;

          /* --- Collapsed Mode (Icon-Only) --- */
          if (isCollapsed) {
            return (
              <div
                key={item.id}
                className="relative flex justify-center"
                onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                onMouseLeave={handleItemMouseLeave}
              >
                {/* Collapsed Icon Button */}
                <button
                  onClick={() => {
                    handleModuleClick(item.id, item.defaultSubView, hasSubViews);
                  }}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
                    isActiveModule
                      ? 'bg-[#FFF4F2] text-[#EA3A20] font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  {/* Active Indicator on right edge in collapsed mode */}
                  {isActiveModule && (
                    <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#EA3A20] rounded-l-full shadow-xs" />
                  )}
                </button>
              </div>
            );
          }

          /* --- Expanded Mode (Standard Sidebar View) --- */
          return (
            <div key={item.id} className="space-y-0.5">
              {/* Primary Menu Item */}
              <button
                onClick={() => handleModuleClick(item.id, item.defaultSubView, hasSubViews)}
                className={`relative group w-full h-12 px-6 flex items-center justify-between transition-all duration-150 cursor-pointer text-sm ${
                  isDirectActive
                    ? 'bg-[#FFF4F2] text-[#EA3A20] font-bold'
                    : isParentActive
                    ? 'bg-transparent text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isDirectActive || isParentActive
                        ? 'text-[#EA3A20]'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {hasSubViews ? (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                      isExpanded ? 'rotate-90 text-[#EA3A20]' : 'text-slate-400'
                    }`}
                  />
                ) : (
                  isDirectActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#EA3A20] rounded-l-full shadow-xs" />
                  )
                )}
              </button>

              {/* Sub-menu List */}
              {isExpanded && (
                <div className="py-0.5 space-y-0.5 animate-fade-in">
                  {item.subViews.map((svName) => {
                    const isSubActive = isActiveModule && subView === svName;
                    return (
                      <button
                        key={svName}
                        onClick={() => {
                          onSelectModule(item.id, svName);
                        }}
                        className={`relative group w-full h-11 pl-14 pr-6 flex items-center justify-between text-left text-xs cursor-pointer transition-all duration-150 ${
                          isSubActive
                            ? 'bg-[#FFF4F2] text-[#EA3A20] font-bold'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 font-medium'
                        }`}
                      >
                        <span className="truncate">{svName}</span>
                        {isSubActive && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#EA3A20] rounded-l-full shadow-xs" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 3. Floating Popover in Collapsed Mode (Fixed positioning prevents clipping by scrollbar) */}
      {isCollapsed && hoveredMenu && (
        <div
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          style={{ top: `${hoveredMenu.top}px` }}
          className="fixed left-[92px] z-50 w-56 bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-2 animate-fade-in select-none"
        >
          {/* Hover Bridge */}
          <div className="absolute -left-3 top-0 bottom-0 w-3 bg-transparent" />

          {/* Popover Header */}
          <div className="flex items-center gap-2.5 px-3 py-2 border-b border-slate-100/90 mb-1">
            <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <hoveredMenu.icon className="w-3.5 h-3.5 text-[#EA3A20]" />
            </div>
            <span className="font-bold text-xs text-slate-900 tracking-tight">
              {hoveredMenu.label}
            </span>
          </div>

          {/* Submenu List or Direct Action */}
          {hoveredMenu.subViews && hoveredMenu.subViews.length > 0 ? (
            <div className="space-y-0.5">
              {hoveredMenu.subViews.map((svName) => {
                const isSubActive = activeModule === hoveredMenu.id && subView === svName;
                return (
                  <button
                    key={svName}
                    onClick={() => {
                      onSelectModule(hoveredMenu.id, svName);
                      setHoveredMenu(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSubActive
                        ? 'bg-[#FFF4F2] text-[#EA3A20] font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className="truncate">{svName}</span>
                    {isSubActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA3A20] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              onClick={() => {
                handleModuleClick(hoveredMenu.id, hoveredMenu.defaultSubView, false);
                setHoveredMenu(null);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#EA3A20] hover:bg-[#FFF4F2] transition-colors cursor-pointer"
            >
              进入{hoveredMenu.label}
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
