import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Shield,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Database,
  Sliders,
  Cpu,
  Phone,
  Mail,
  Lock,
  ExternalLink,
  Plus,
  MoreVertical,
  Check,
  FolderTree,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  Info,
  Crown
} from 'lucide-react';
import { EmployeeItem, RoleConfig, WeComDept, OrgDeptNode } from '../../types';
import { initialWeComDepts, initialOrgTree } from '../../data/mockData';
import { WeComSyncModal } from './staff/WeComSyncModal';
import { RolePermissionModal } from './staff/RolePermissionModal';
import { EmployeeDetailModal } from './staff/EmployeeDetailModal';

interface StaffModuleProps {
  employees: EmployeeItem[];
  roles: RoleConfig[];
  subView: string;
}

export const StaffModule: React.FC<StaffModuleProps> = ({
  employees: propEmployees,
  roles: propRoles,
  subView
}) => {
  const [activeTab, setActiveTab] = useState<'员工列表' | '角色配置'>(
    subView.includes('角色') ? '角色配置' : '员工列表'
  );

  // State
  const [employees, setEmployees] = useState<EmployeeItem[]>(propEmployees);
  const [roles, setRoles] = useState<RoleConfig[]>(propRoles);
  const [wecomDepts] = useState<WeComDept[]>(initialWeComDepts);
  // Default selected: 研究所 (matching the highlighted row in the user's screenshot)
  const [selectedDeptId, setSelectedDeptId] = useState<string>('research_inst');
  // Default expanded: 产品中心 (matching the expanded branch in the user's screenshot)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['product_center'])
  );
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('全部角色');
  const [selectedLeaderFilter, setSelectedLeaderFilter] = useState<string>('全部');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('全部状态');
  const [employeeModalTab, setEmployeeModalTab] = useState<'auth' | 'quota'>('auth');

  // WeCom Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('今日 15:30:22');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Modals
  const [isWeComModalOpen, setIsWeComModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleConfig | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  useEffect(() => {
    if (subView.includes('角色')) {
      setActiveTab('角色配置');
    } else {
      setActiveTab('员工列表');
    }
  }, [subView]);

  // Sync WeCom action
  const handleTriggerWeComSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = `今日 ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setLastSyncTime(timeStr);
      setSyncToast(
        `✅ 企业微信通讯录同步成功！已自动拉取全公司 ${wecomDepts.length} 个部门组织架构及 ${employees.length} 名在职员工，系统权限与 AI 算力自动绑定。`
      );
      setTimeout(() => setSyncToast(null), 5000);
    }, 1200);
  };

  // Role Save
  const handleSaveRole = (updatedRole: RoleConfig) => {
    setRoles((prev) => {
      const idx = prev.findIndex((r) => r.id === updatedRole.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRole;
        return next;
      }
      return [...prev, updatedRole];
    });
    setSyncToast(`✅ 角色「${updatedRole.roleName}」的菜单权限、数据权限及操作权限已更新并实时下发！`);
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Create new role
  const handleCreateNewRole = () => {
    const newRole: RoleConfig = {
      id: `ROLE-CUSTOM-${Date.now()}`,
      roleName: '新权限角色',
      description: '自定义外贸业务权限角色',
      userCount: 0,
      permissions: [
        { module: '知识问答', view: true, edit: false, delete: false, export: false },
        { module: '售前询盘助手', view: true, edit: false, delete: false, export: false },
        { module: '销售助手', view: true, edit: false, delete: false, export: false },
        { module: '运营助手', view: false, edit: false, delete: false, export: false },
        { module: '知识库管理', view: true, edit: false, delete: false, export: false },
        { module: '数据统计', view: false, edit: false, delete: false, export: false },
        { module: '员工权限', view: false, edit: false, delete: false, export: false },
        { module: '系统配置', view: false, edit: false, delete: false, export: false },
        { module: '日志审计', view: false, edit: false, delete: false, export: false }
      ],
      dataPermission: {
        scope: 'self_only',
        scopeLabel: '仅本人数据权限',
        maskCustomerContact: true,
        maskCostPrice: true
      },
      operationPermissions: {
        inquiryAssign: false,
        inquiryTakeover: false,
        inquiryExport: false,
        customerTransfer: false,
        customerPriceQuote: false,
        customerTagEdit: true,
        marketingApprove: false,
        marketingDirectPost: false,
        marketingBatchGenerate: false,
        knowledgePublish: false,
        knowledgeVectorRebuild: false,
        knowledgeExport: false,
        wecomSyncManual: false,
        roleManage: false,
        quotaAdjust: false,
        auditExport: false
      }
    };
    setEditingRole(newRole);
    setIsRoleModalOpen(true);
  };

  // Employee Save
  const handleSaveEmployee = (updatedEmp: EmployeeItem) => {
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));
    setSyncToast(`✅ 员工「${updatedEmp.name}」的系统角色与 AI 算力限额已更新！`);
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Toggle Employee Status (启用 / 禁用)
  const handleToggleEmployeeStatus = (empId: string) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === empId) {
          const isCurrentlyActive = e.status === '启用' || e.status === '在职 (正常)';
          const newStatus = isCurrentlyActive ? '已禁用' : '启用';
          setSyncToast(`已成功将员工「${e.name}」账号状态切换为【${newStatus}】`);
          setTimeout(() => setSyncToast(null), 3500);
          return { ...e, status: newStatus };
        }
        return e;
      })
    );
  };

  // Toggle Department Leader (部门负责人：是 / 否)
  const handleToggleDeptLeader = (empId: string) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === empId) {
          const newLeader = !e.isDeptLeader;
          setSyncToast(`已将员工「${e.name}」部门负责人属性设置为【${newLeader ? '是' : '否'}】`);
          setTimeout(() => setSyncToast(null), 3500);
          return { ...e, isDeptLeader: newLeader };
        }
        return e;
      })
    );
  };

  // Filtered employees
  // Expand / collapse single branch
  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Helper to collect all node IDs in tree
  const getAllDeptIds = (nodes: OrgDeptNode[]): string[] => {
    const ids: string[] = [];
    for (const node of nodes) {
      ids.push(node.id);
      if (node.children) {
        ids.push(...getAllDeptIds(node.children));
      }
    }
    return ids;
  };

  const handleExpandAll = () => {
    setExpandedNodes(new Set(getAllDeptIds(initialOrgTree)));
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Get all descendant department IDs for filtering employees
  const getDescendantDeptIds = (targetId: string, roots: OrgDeptNode[]): string[] => {
    const result: string[] = [targetId];
    const findAndCollect = (node: OrgDeptNode): boolean => {
      if (node.id === targetId) {
        const collectAll = (n: OrgDeptNode) => {
          if (n.children) {
            for (const c of n.children) {
              result.push(c.id);
              collectAll(c);
            }
          }
        };
        collectAll(node);
        return true;
      }
      if (node.children) {
        for (const c of node.children) {
          if (findAndCollect(c)) return true;
        }
      }
      return false;
    };
    for (const r of roots) {
      if (findAndCollect(r)) break;
    }
    return result;
  };

  // Helper to find dept name
  const getDeptNameById = (targetId: string, roots: OrgDeptNode[]): string => {
    for (const r of roots) {
      if (r.id === targetId) return r.name;
      if (r.children) {
        const found = getDeptNameById(targetId, r.children);
        if (found) return found;
      }
    }
    return '';
  };

  // Recursive tree rendering function (参照截图精确还原)
  const renderTreeNode = (node: OrgDeptNode, level = 0): React.ReactNode => {
    const isSelected = selectedDeptId === node.id;
    const hasKids = Boolean(node.hasChildren);
    const isExpanded = expandedNodes.has(node.id);

    // Search query filter for departments
    if (deptSearchQuery.trim()) {
      const q = deptSearchQuery.toLowerCase();
      const nodeMatches = node.name.toLowerCase().includes(q);
      const childMatches = (n: OrgDeptNode): boolean => {
        if (n.name.toLowerCase().includes(q)) return true;
        return Boolean(n.children && n.children.some(childMatches));
      };
      if (!nodeMatches && !childMatches(node)) {
        return null;
      }
    }

    // Indentation matching screenshot:
    // Level 0 (产品中心, 制造中心, etc.): pl-2.5 (has arrow ▶ or ▼)
    // Level 1 (设计部, 产品管理部, 研究所, 市场部): pl-[28px] (no arrow, folder aligned)
    const indentStyle = level === 0 ? 'pl-2.5' : 'pl-[28px]';

    return (
      <div key={node.id} className="w-full">
        <div
          onClick={() => {
            setSelectedDeptId(node.id);
            if (hasKids && !isExpanded) {
              setExpandedNodes((prev) => new Set([...prev, node.id]));
            }
          }}
          className={`flex items-center h-[34px] cursor-pointer transition-colors duration-75 select-none text-[13.5px] whitespace-nowrap pr-3 ${indentStyle} ${
            isSelected
              ? 'bg-[#e8f0fe] text-slate-900 font-medium'
              : 'text-[#333333] hover:bg-[#f6f8fa]'
          }`}
        >
          {/* Disclosure Triangle (solid ▶ or ▼) for level 0, or spacer for children */}
          {hasKids ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpand(node.id);
              }}
              className="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-slate-800 cursor-pointer mr-1 shrink-0"
            >
              {isExpanded ? (
                <svg className="w-2.5 h-2.5 fill-current text-slate-600" viewBox="0 0 10 10">
                  <polygon points="1,2.5 9,2.5 5,7.5" />
                </svg>
              ) : (
                <svg className="w-2.5 h-2.5 fill-current text-slate-600" viewBox="0 0 10 10">
                  <polygon points="2.5,1 7.5,5 2.5,9" />
                </svg>
              )}
            </button>
          ) : (
            <div className="w-1 mr-0.5 shrink-0" />
          )}

          {/* Yellow/Amber Enterprise Folder Icon */}
          <div className="w-4 h-4 flex items-center justify-center shrink-0 mr-1.5">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
              <path
                d="M1.5 3.5C1.5 2.95 1.95 2.5 2.5 2.5H5.8C6.1 2.5 6.35 2.65 6.55 2.85L7.6 4H13.5C14.05 4 14.5 4.45 14.5 5V12.5C14.5 13.05 14.05 13.5 13.5 13.5H2.5C1.95 13.5 1.5 13.05 1.5 12.5V3.5Z"
                fill="#F59E0B"
              />
              <path
                d="M1.5 5.5C1.5 5.1 1.8 4.75 2.2 4.75H13.8C14.2 4.75 14.5 5.1 14.5 5.5V12.5C14.5 13.05 14.05 13.5 13.5 13.5H2.5C1.95 13.5 1.5 13.05 1.5 12.5V5.5Z"
                fill="#FBBF24"
              />
            </svg>
          </div>

          {/* Department Name */}
          <span className="truncate leading-none text-[13.5px]">{node.name}</span>
        </div>

        {/* Children nodes if expanded */}
        {hasKids && (isExpanded || deptSearchQuery.trim().length > 0) && node.children && (
          <div>
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredEmployees = employees.filter((emp) => {
    // Dept filter
    if (selectedDeptId && selectedDeptId !== 'all') {
      const allowedIds = getDescendantDeptIds(selectedDeptId, initialOrgTree);
      const empDeptId = String(emp.deptId || '');
      if (!allowedIds.includes(empDeptId)) {
        return false;
      }
    }

    // Role filter
    if (selectedRoleFilter !== '全部角色' && emp.role !== selectedRoleFilter) {
      return false;
    }

    // Leader filter (部门负责人：是或否)
    if (selectedLeaderFilter !== '全部') {
      if (selectedLeaderFilter === '是' && !emp.isDeptLeader) return false;
      if (selectedLeaderFilter === '否' && emp.isDeptLeader) return false;
    }

    // Status filter (启用 / 禁用)
    if (selectedStatusFilter !== '全部状态') {
      const isEnabled = emp.status === '启用' || emp.status === '在职 (正常)';
      if (selectedStatusFilter === '启用' && !isEnabled) return false;
      if (selectedStatusFilter === '禁用' && isEnabled) return false;
      if (selectedStatusFilter === '在职' && !isEnabled) return false;
      if (selectedStatusFilter === '已禁用' && isEnabled) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        (emp.wecomUserId && emp.wecomUserId.toLowerCase().includes(q)) ||
        (emp.wecomMobile && emp.wecomMobile.includes(q)) ||
        emp.department.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const selectedDeptName = getDeptNameById(selectedDeptId, initialOrgTree) || '全部员工';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      
      {/* Toast Notification */}
      {syncToast && (
        <div className="mb-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{syncToast}</span>
          </div>
          <button
            onClick={() => setSyncToast(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold ml-4 cursor-pointer"
          >
            关闭
          </button>
        </div>
      )}

      {/* Top Filter Bar */}
      <div className="flex items-center justify-between py-3 mb-2 shrink-0">
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(['员工列表', '角色配置'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab === '员工列表' ? <Users className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{tab}</span>
                {tab === '员工列表' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {employees.length}
                  </span>
                )}
                {tab === '角色配置' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {roles.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {activeTab === '员工列表' ? (
            <>
              {/* Notice: No manual creation */}
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>企微组织架构已打通 · 无需手动创建账号</span>
              </div>

              <button
                onClick={handleTriggerWeComSync}
                disabled={isSyncing}
                className="h-9 px-4.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? '正在拉取企业微信...' : '立即同步企业微信'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleCreateNewRole}
              className="h-9 px-4.5 rounded-full bg-[#0F4A47] text-white hover:bg-[#0b3836] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>新增权限角色</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        
        {activeTab === '员工列表' ? (
          <div className="h-full flex gap-5 overflow-hidden">
            
            {/* Left Column: WeCom Organization Tree (参照截图精确还原) */}
            <div className="w-72 bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col overflow-hidden shrink-0">
              
              {/* Tree Header */}
              <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">组织架构</h4>
                    <span className="text-[10px] text-slate-400 font-mono">企业微信实时通讯录</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (expandedNodes.size > 2) {
                        handleCollapseAll();
                      } else {
                        handleExpandAll();
                      }
                    }}
                    title={expandedNodes.size > 2 ? "收起所有分支" : "展开所有分支"}
                    className="px-1.5 py-0.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px] font-medium transition-colors"
                  >
                    {expandedNodes.size > 2 ? '全部收起' : '全部展开'}
                  </button>
                  <button
                    onClick={() => setIsWeComModalOpen(true)}
                    title="查看企微对接详情"
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-700 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Search */}
              <div className="px-3 pt-2.5 pb-2 border-b border-slate-100/70 bg-slate-50/30">
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={deptSearchQuery}
                    onChange={(e) => setDeptSearchQuery(e.target.value)}
                    placeholder="搜索部门名称..."
                    className="w-full pl-7 pr-6 py-1 text-xs rounded-lg border border-slate-200/80 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                  />
                  {deptSearchQuery && (
                    <button
                      onClick={() => setDeptSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Tree List (参照截图设计) */}
              <div className="flex-1 overflow-y-auto overflow-x-auto py-1 custom-scrollbar">
                {initialOrgTree.map((node) => renderTreeNode(node, 0))}
              </div>

              {/* Sync status footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-600">已同步企微架构</span>
                </span>
                <span className="font-mono text-slate-400 text-[10px]">{lastSyncTime}</span>
              </div>
            </div>

            {/* Right Column: Employee Table & Toolbar */}
            <div className="flex-1 bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col overflow-hidden">
              
              {/* Table Toolbar */}
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
                
                {/* Search & Breadcrumb */}
                <div className="flex items-center gap-3 flex-1 min-w-[320px]">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索姓名、企微UserID、手机号或邮箱..."
                      className="w-full pl-9 pr-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#EA3A20]"
                    />
                  </div>

                  {selectedDeptId && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100 text-xs">
                      <span>{selectedDeptName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-mono">
                        {filteredEmployees.length}人
                      </span>
                      {selectedDeptId !== 'group' && (
                        <button
                          onClick={() => setSelectedDeptId('group')}
                          title="查看全部部门员工"
                          className="text-blue-500 hover:text-blue-800 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-[#EA3A20]"
                  >
                    <option value="全部角色">全部系统角色</option>
                    <option value="超级管理员">超级管理员</option>
                    <option value="外贸主管">外贸主管</option>
                    <option value="销售业务员">销售业务员</option>
                    <option value="推广运营官">推广运营官</option>
                    <option value="内容审稿员">内容审稿员</option>
                  </select>

                  <select
                    value={selectedLeaderFilter}
                    onChange={(e) => setSelectedLeaderFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-[#EA3A20]"
                  >
                    <option value="全部">部门负责人：全部</option>
                    <option value="是">部门负责人：是</option>
                    <option value="否">部门负责人：否</option>
                  </select>

                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-[#EA3A20]"
                  >
                    <option value="全部状态">全部账号状态</option>
                    <option value="启用">状态：启用</option>
                    <option value="禁用">状态：禁用</option>
                  </select>
                </div>

              </div>

              {/* Table Body - 8 Columns exactly as requested */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10">
                    <tr className="border-b border-slate-100 text-slate-700 text-xs font-bold">
                      <th className="py-3.5 pl-6 pr-3 font-bold text-slate-900">员工姓名</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900">企微ID</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900">所属部门</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900 text-center">部门负责人</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900">角色</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900">每日AI算力限额</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900 text-center">状态</th>
                      <th className="py-3.5 pr-6 pl-2 font-bold text-slate-900 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 text-xs">
                    {filteredEmployees.map((emp) => {
                      const isEnabled = emp.status === '启用' || emp.status === '在职 (正常)';

                      return (
                        <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors h-16">
                          
                          {/* 员工姓名 */}
                          <td className="py-3.5 pl-6 pr-3">
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 text-[13px] truncate leading-tight">
                                {emp.name}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1 truncate">
                                {emp.wecomPosition || '外贸顾问'}
                              </div>
                            </div>
                          </td>

                          {/* 企微ID */}
                          <td className="py-3.5 px-3">
                            <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100/90 px-2 py-1 rounded-md border border-slate-200/60 inline-flex items-center">
                              {emp.wecomUserId || emp.id}
                            </span>
                          </td>

                          {/* 3. 所属部门 */}
                          <td className="py-3.5 px-3">
                            <div className="font-semibold text-slate-800 truncate max-w-[160px]">
                              {emp.department}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]" title={emp.deptPath}>
                              {emp.deptPath || `优特智厨 / ${emp.department}`}
                            </div>
                          </td>

                          {/* 4. 部门负责人：是或否 */}
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex justify-center">
                              {emp.isDeptLeader ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleDeptLeader(emp.id)}
                                  title="点击切换部门负责人状态"
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs hover:bg-emerald-100 cursor-pointer transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>是</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleDeptLeader(emp.id)}
                                  title="点击设为部门负责人"
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                                >
                                  <span>否</span>
                                </button>
                              )}
                            </div>
                          </td>

                          {/* 5. 角色 */}
                          <td className="py-3.5 px-3">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEmployee(emp);
                                setEmployeeModalTab('auth');
                                setIsEmployeeModalOpen(true);
                              }}
                              title="点击进行授权配置"
                              className="px-2.5 py-1 text-xs bg-[#FFF4F2] text-[#EA3A20] font-bold rounded-full border border-red-100 hover:bg-[#ffece6] cursor-pointer transition-colors inline-flex items-center gap-1"
                            >
                              <span>{emp.role}</span>
                            </button>
                          </td>

                          {/* 6. 每日AI算力限额 */}
                          <td className="py-3.5 px-3">
                            <div className="space-y-1 min-w-[130px] max-w-[155px]">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-mono font-bold text-slate-800">
                                  {emp.aiQuotaLimit.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">次/天</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  已用 {emp.aiQuotaUsed}
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-600 rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(100, Math.round((emp.aiQuotaUsed / Math.max(1, emp.aiQuotaLimit)) * 100))}%`
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 7. 状态：可以操作启用或禁用 */}
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleEmployeeStatus(emp.id)}
                                title={isEnabled ? "点击操作：禁用该账号" : "点击操作：启用该账号"}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    isEnabled ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <span className={`text-xs font-bold ${isEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                                {isEnabled ? '启用' : '禁用'}
                              </span>
                            </div>
                          </td>

                          {/* 8. 操作：授权和算力配置 */}
                          <td className="py-3.5 pr-6 pl-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingEmployee(emp);
                                  setEmployeeModalTab('auth');
                                  setIsEmployeeModalOpen(true);
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/70 cursor-pointer transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
                                title="授予系统角色与数据权限"
                              >
                                <Shield className="w-3.5 h-3.5 text-blue-600" />
                                <span>授权</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingEmployee(emp);
                                  setEmployeeModalTab('quota');
                                  setIsEmployeeModalOpen(true);
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200/70 cursor-pointer transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
                                title="配置每日 AI 算力限额"
                              >
                                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                                <span>算力配置</span>
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredEmployees.length === 0 && (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    未找到符合条件的员工记录
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          /* TAB: 角色管理 (菜单权限 + 数据权限 + 操作权限) */
          <div className="h-full overflow-y-auto custom-scrollbar space-y-4 pr-1">
            
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0F4A47] rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold">企业外贸权限与安全控制矩阵 (RBAC)</h3>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  外贸 AI 系统支持三大维度立体授权：<strong>菜单权限</strong>（控制功能模块的读写删导）、<strong>数据权限</strong>（控制全司、部门、仅本人数据隔离及客户信息脱敏）、<strong>操作权限</strong>（控制特批报价、社媒审核、词条免审等细粒度业务动作）。
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateNewRole}
                  className="px-5 py-2.5 rounded-2xl bg-[#EA3A20] hover:bg-[#d0311a] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>创建自定义角色</span>
                </button>
              </div>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
              {roles.map((role) => {
                const menuCount = role.permissions.filter((p) => p.view).length;
                const totalMenu = role.permissions.length;
                const dataScope = role.dataPermission?.scopeLabel || '未设置数据权限';
                const maskContact = role.dataPermission?.maskCustomerContact;
                const maskCost = role.dataPermission?.maskCostPrice;
                const opPermsCount = role.operationPermissions
                  ? Object.values(role.operationPermissions).filter(Boolean).length
                  : 0;

                return (
                  <div
                    key={role.id}
                    className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-slate-200 transition-colors"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-slate-900">{role.roleName}</h3>
                            <span className="px-2.5 py-0.5 text-[10px] bg-slate-100 text-slate-700 font-bold rounded-full font-mono">
                              {role.userCount} 人正在使用
                            </span>
                            {role.id === 'ROLE-ADMIN' && (
                              <span className="px-2 py-0.5 text-[9px] bg-red-100 text-[#EA3A20] font-bold rounded-full">
                                超级权限
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingRole(role);
                            setIsRoleModalOpen(true);
                          }}
                          className="px-4 py-1.5 bg-[#FFF4F2] text-[#EA3A20] hover:bg-[#ffece6] text-xs font-bold rounded-full cursor-pointer transition-colors shrink-0"
                        >
                          配置权限矩阵
                        </button>
                      </div>

                      {/* Three Dimensions Overview */}
                      <div className="grid grid-cols-3 gap-2.5 pt-3">
                        
                        {/* 1. Menu Permissions */}
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Eye className="w-3 h-3 text-[#EA3A20]" />
                            <span>1. 菜单权限</span>
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            {menuCount} / {totalMenu} <span className="text-[10px] font-normal text-slate-500">模块可用</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {role.permissions.filter((p) => p.view).map((p) => p.module).slice(0, 3).join('、')}
                          </div>
                        </div>

                        {/* 2. Data Permissions */}
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Database className="w-3 h-3 text-blue-600" />
                            <span>2. 数据权限</span>
                          </div>
                          <div className="text-xs font-bold text-blue-900 truncate" title={dataScope}>
                            {role.dataPermission?.scope === 'all'
                              ? '全公司跨部门'
                              : role.dataPermission?.scope === 'dept_and_sub'
                              ? '本部门及下级'
                              : role.dataPermission?.scope === 'dept_only'
                              ? '本部门数据'
                              : '仅本人私海'}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            {maskContact && <span>🔒客户脱敏</span>}
                            {maskCost && <span>💰底价脱敏</span>}
                            {!maskContact && !maskCost && <span>明文全量查看</span>}
                          </div>
                        </div>

                        {/* 3. Operation Permissions */}
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Sliders className="w-3 h-3 text-emerald-600" />
                            <span>3. 操作权限</span>
                          </div>
                          <div className="text-xs font-bold text-emerald-900">
                            {opPermsCount} 项 <span className="text-[10px] font-normal text-slate-500">已授权</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {role.operationPermissions?.knowledgePublish ? '含免审发布' : '需审核流'}
                          </div>
                        </div>

                      </div>

                      {/* Fast Tag Pills */}
                      <div className="pt-3 flex flex-wrap gap-1.5">
                        {role.permissions
                          .filter((p) => p.view)
                          .map((perm) => (
                            <span
                              key={perm.module}
                              className="px-2.5 py-0.8 bg-slate-100/80 rounded-lg text-[10px] font-semibold text-slate-700"
                            >
                              {perm.module}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>角色ID: <code className="font-mono">{role.id}</code></span>
                      <button
                        onClick={() => {
                          setEditingRole(role);
                          setIsRoleModalOpen(true);
                        }}
                        className="text-slate-600 hover:text-[#EA3A20] font-bold cursor-pointer"
                      >
                        编辑权限矩阵 →
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* Modals */}
      <WeComSyncModal
        isOpen={isWeComModalOpen}
        onClose={() => setIsWeComModalOpen(false)}
        lastSyncTime={lastSyncTime}
        deptCount={wecomDepts.length}
        employeeCount={employees.length}
        onTriggerSync={handleTriggerWeComSync}
        isSyncing={isSyncing}
      />

      <RolePermissionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        role={editingRole}
        onSaveRole={handleSaveRole}
        allDepts={wecomDepts.map((d) => d.name)}
      />

      <EmployeeDetailModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employee={editingEmployee}
        roles={roles}
        initialTab={employeeModalTab}
        onSaveEmployee={handleSaveEmployee}
      />

    </div>
  );
};
