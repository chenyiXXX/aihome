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
  Crown,
  Trash2,
  X,
  MessageSquare
} from 'lucide-react';
import { EmployeeItem, RoleConfig, WeComDept, OrgDeptNode, WhatsAppAccount } from '../../types';
import { initialWeComDepts, initialOrgTree, initialWhatsAppAccounts } from '../../data/mockData';
import { RolePermissionModal } from './staff/RolePermissionModal';
import { Pagination } from '../common/Pagination';

interface StaffModuleProps {
  employees: EmployeeItem[];
  roles: RoleConfig[];
  subView: string;
  onSelectSubView?: (subView: string) => void;
}

export const StaffModule: React.FC<StaffModuleProps> = ({
  employees: propEmployees,
  roles: propRoles,
  subView,
  onSelectSubView
}) => {
  const isRoleView = subView.includes('角色');

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
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('全部角色');
  const [selectedLeaderFilter, setSelectedLeaderFilter] = useState<string>('全部');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('全部状态');
  const [selectedWhatsAppFilter, setSelectedWhatsAppFilter] = useState<string>('全部');

  // WhatsApp Accounts State (1对1 绑定)
  const [whatsAppAccounts, setWhatsAppAccounts] = useState<WhatsAppAccount[]>(initialWhatsAppAccounts);
  const [activeWaDropdownEmpId, setActiveWaDropdownEmpId] = useState<string | null>(null);
  const [activeRoleDropdownEmpId, setActiveRoleDropdownEmpId] = useState<string | null>(null);
  const [waSearchQuery, setWaSearchQuery] = useState('');
  const [isAddingNewWa, setIsAddingNewWa] = useState(false);
  const [newWaName, setNewWaName] = useState('');
  const [newWaPhone, setNewWaPhone] = useState('');
  const [newWaRegion, setNewWaRegion] = useState('欧美综合');

  // Close WhatsApp & Role Dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.wa-dropdown-container')) {
        setActiveWaDropdownEmpId(null);
        setIsAddingNewWa(false);
      }
      if (!target.closest('.role-dropdown-container')) {
        setActiveRoleDropdownEmpId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // WeCom Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('今日 15:30:22');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Modals
  const [editingRole, setEditingRole] = useState<RoleConfig | null>(null);
  const [isCreatingNewRole, setIsCreatingNewRole] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

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
        `✅ 企业微信通讯录同步成功！`
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
    setSyncToast(`角色「${updatedRole.roleName}」权限配置已保存`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  // Create new role (Only configure menu permissions & data scopes)
  const handleCreateNewRole = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRole: RoleConfig = {
      id: `ROLE_CUSTOM_${randomSuffix}`,
      roleName: '',
      description: '',
      userCount: 0,
      permissions: [
        { module: '知识问答', view: true, dataScope: 'dept_and_sub', edit: false, delete: false, export: false },
        { module: '售前询盘', view: true, dataScope: 'dept_and_sub', edit: false, delete: false, export: false },
        { module: '销售助手', view: true, dataScope: 'dept_and_sub', edit: false, delete: false, export: false },
        { module: '运营助手', view: false, dataScope: 'dept_and_sub', edit: false, delete: false, export: false },
        { module: '知识库管理', view: true, dataScope: 'dept_and_sub', edit: false, delete: false, export: false },
        { module: '面价汇率', view: true, dataScope: 'all', edit: false, delete: false, export: false },
        { module: '数据统计', view: false, dataScope: 'dept_and_sub', edit: false, delete: false, export: false },
        { module: '员工权限', view: false, dataScope: 'dept_and_sub', edit: false, delete: false, export: false },
        { module: '智能体基础设置', view: false, dataScope: 'all', edit: false, delete: false, export: false },
        { module: '日志与审计', view: false, dataScope: 'dept_and_sub', edit: false, delete: false, export: false }
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
    setIsCreatingNewRole(true);
    setEditingRole(newRole);
    setIsRoleModalOpen(true);
  };

  // Edit existing role
  const handleEditRole = (role: RoleConfig) => {
    if (role.id === 'ROLE-ADMIN' || role.roleName === '超级管理员') {
      setSyncToast('⚠️ 超级管理员为系统核心内置角色，不可修改！');
      setTimeout(() => setSyncToast(null), 3000);
      return;
    }
    setIsCreatingNewRole(false);
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  // Delete role
  const handleDeleteRole = (roleId: string, roleName: string) => {
    if (roleId === 'ROLE-ADMIN' || roleName === '超级管理员') {
      setSyncToast('⚠️ 超级管理员为系统核心内置角色，不可删除！');
      setTimeout(() => setSyncToast(null), 3000);
      return;
    }
    const roleToDelete = roles.find((r) => r.id === roleId);
    if (roleToDelete && roleToDelete.userCount > 0) {
      setSyncToast(`⚠️ 角色「${roleName}」当前有 ${roleToDelete.userCount} 名员工使用中，请先转移员工角色后再删除！`);
      setTimeout(() => setSyncToast(null), 3500);
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    setSyncToast(`已成功删除角色「${roleName}」`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  // 员工角色徽章样式（统一黑色文本，去除五颜六色）
  const getRoleBadgeStyle = (_role?: string) => {
    return 'bg-slate-100 text-black border-slate-200/90 hover:bg-slate-200/80';
  };

  // 获取员工所有授权角色（支持多个角色）
  const getEmployeeRoles = (emp: EmployeeItem): string[] => {
    if (emp.roles && emp.roles.length > 0) return emp.roles;
    if (emp.role) {
      return emp.role.split(/[,，、/]+/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  // 员工列表直接多选切换角色
  const handleToggleEmployeeRole = (employeeId: string, roleName: string) => {
    const target = employees.find((e) => e.id === employeeId);
    if (!target) return;

    const currentRoles = getEmployeeRoles(target);
    let updatedRoles: string[];

    if (currentRoles.includes(roleName)) {
      if (currentRoles.length === 1) {
        setSyncToast(`⚠️ 员工「${target.name}」至少需要保留一个授权角色`);
        setTimeout(() => setSyncToast(null), 2500);
        return;
      }
      updatedRoles = currentRoles.filter((r) => r !== roleName);
    } else {
      updatedRoles = [...currentRoles, roleName];
    }

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId
          ? {
              ...e,
              role: updatedRoles.join(', '),
              roles: updatedRoles
            }
          : e
      )
    );

    setSyncToast(`✅ 已更新员工「${target.name}」授权角色：${updatedRoles.join('、')}`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  // 单选覆盖（备用兼容）
  const handleUpdateEmployeeRole = (employeeId: string, newRole: string) => {
    const target = employees.find((e) => e.id === employeeId);
    if (!target || target.role === newRole) return;

    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, role: newRole, roles: [newRole] } : e))
    );
    setSyncToast(`✅ 已将员工「${target.name}」的授权角色修改为「${newRole}」`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  // 1对1 绑定/解绑 WhatsApp 账号逻辑
  const handleBindWhatsApp = (employeeId: string, waAccountId: string | null) => {
    const targetEmp = employees.find((e) => e.id === employeeId);
    const empName = targetEmp ? targetEmp.name : '员工';

    // 1. 解除绑定操作 (Unbind)
    if (!waAccountId) {
      const oldWaId = targetEmp?.whatsappAccountId;
      const oldWa = whatsAppAccounts.find((w) => w.id === oldWaId);

      setEmployees((prev) =>
        prev.map((e) => {
          if (e.id === employeeId) {
            return {
              ...e,
              whatsappAccountId: undefined,
              whatsappPhone: undefined,
              whatsappAccountName: undefined
            };
          }
          return e;
        })
      );

      setWhatsAppAccounts((prev) =>
        prev.map((w) => {
          if (w.boundEmployeeId === employeeId || w.id === oldWaId) {
            return {
              ...w,
              boundEmployeeId: undefined,
              boundEmployeeName: undefined
            };
          }
          return w;
        })
      );

      setSyncToast(`已解除员工「${empName}」绑定的 WhatsApp 账号「${oldWa?.name || ''}」`);
      setTimeout(() => setSyncToast(null), 3500);
      return;
    }

    // 2. 绑定或转移操作 (Bind / Transfer - 严格 1对1)
    const targetWa = whatsAppAccounts.find((w) => w.id === waAccountId);
    if (!targetWa) return;

    const previousOwnerId = targetWa.boundEmployeeId;
    const previousOwnerName = targetWa.boundEmployeeName;
    const oldWaIdOfTargetEmp = targetEmp?.whatsappAccountId;

    setEmployees((prev) =>
      prev.map((e) => {
        // 当前员工绑定新账号
        if (e.id === employeeId) {
          return {
            ...e,
            whatsappAccountId: targetWa.id,
            whatsappPhone: targetWa.phone,
            whatsappAccountName: targetWa.name
          };
        }
        // 若该 WhatsApp 原本绑在其他员工身上，将其解绑以维护 1对1 独占原则
        if (previousOwnerId && e.id === previousOwnerId) {
          return {
            ...e,
            whatsappAccountId: undefined,
            whatsappPhone: undefined,
            whatsappAccountName: undefined
          };
        }
        return e;
      })
    );

    setWhatsAppAccounts((prev) =>
      prev.map((w) => {
        // 目标账号归属当前员工
        if (w.id === targetWa.id) {
          return {
            ...w,
            boundEmployeeId: employeeId,
            boundEmployeeName: empName
          };
        }
        // 当前员工原来绑定的旧账号恢复空闲
        if (oldWaIdOfTargetEmp && w.id === oldWaIdOfTargetEmp) {
          return {
            ...w,
            boundEmployeeId: undefined,
            boundEmployeeName: undefined
          };
        }
        // 安全兜底：如果其他记录还记录着 employeeId，清除掉
        if (w.boundEmployeeId === employeeId) {
          return {
            ...w,
            boundEmployeeId: undefined,
            boundEmployeeName: undefined
          };
        }
        return w;
      })
    );

    if (previousOwnerId && previousOwnerId !== employeeId) {
      setSyncToast(
        `已将 WhatsApp 账号「${targetWa.name}」转移绑定至「${empName}」（已解除原「${previousOwnerName}」的绑定）`
      );
    } else {
      setSyncToast(`✅ 已成功为「${empName}」绑定 WhatsApp 账号「${targetWa.name}」`);
    }
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
    if (selectedRoleFilter !== '全部角色') {
      const empRoles = getEmployeeRoles(emp);
      if (!empRoles.includes(selectedRoleFilter) && emp.role !== selectedRoleFilter) {
        return false;
      }
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

    // WhatsApp binding filter (全部 / 已绑定 / 未绑定)
    if (selectedWhatsAppFilter !== '全部') {
      const isBound = Boolean(emp.whatsappAccountId);
      if (selectedWhatsAppFilter === '已绑定' && !isBound) return false;
      if (selectedWhatsAppFilter === '未绑定' && isBound) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        (emp.wecomUserId && emp.wecomUserId.toLowerCase().includes(q)) ||
        (emp.wecomMobile && emp.wecomMobile.includes(q)) ||
        (emp.whatsappPhone && emp.whatsappPhone.includes(q)) ||
        (emp.whatsappAccountName && emp.whatsappAccountName.toLowerCase().includes(q)) ||
        emp.department.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Filtered roles for Role Management List
  const filteredRoles = roles.filter((role) => {
    if (!roleSearchQuery.trim()) return true;
    const q = roleSearchQuery.toLowerCase();
    return (
      role.roleName.toLowerCase().includes(q) ||
      role.id.toLowerCase().includes(q) ||
      role.description.toLowerCase().includes(q)
    );
  });

  // Employee Pagination
  const [empCurrentPage, setEmpCurrentPage] = useState<number>(1);
  const [empPageSize, setEmpPageSize] = useState<number>(10);

  useEffect(() => {
    setEmpCurrentPage(1);
  }, [selectedDeptId, selectedRoleFilter, selectedLeaderFilter, selectedStatusFilter, selectedWhatsAppFilter, searchQuery]);

  const paginatedEmployees = React.useMemo(() => {
    const start = (empCurrentPage - 1) * empPageSize;
    return filteredEmployees.slice(start, start + empPageSize);
  }, [filteredEmployees, empCurrentPage, empPageSize]);

  // Role Pagination
  const [roleCurrentPage, setRoleCurrentPage] = useState<number>(1);
  const [rolePageSize, setRolePageSize] = useState<number>(10);

  useEffect(() => {
    setRoleCurrentPage(1);
  }, [roleSearchQuery]);

  const paginatedRoles = React.useMemo(() => {
    const start = (roleCurrentPage - 1) * rolePageSize;
    return filteredRoles.slice(start, start + rolePageSize);
  }, [filteredRoles, roleCurrentPage, rolePageSize]);

  const selectedDeptName = getDeptNameById(selectedDeptId, initialOrgTree) || '全部员工';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-4 lg:px-6 pb-6 pt-1">
      
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

      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-1 mb-2 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900">
            {isRoleView ? '角色配置' : '员工列表'}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {isRoleView ? `共 ${roles.length} 个角色` : `共 ${employees.length} 名在职员工`}
          </span>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {!isRoleView && (
            <button
              onClick={handleTriggerWeComSync}
              disabled={isSyncing}
              className="h-9 px-4 rounded-full bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? '正在同步...' : '同步企微通讯录'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        
        {!isRoleView ? (
          <div className="h-full flex gap-5 overflow-hidden">
            
            {/* Left Column: WeCom Organization Tree (参照截图精确还原) */}
            <div className="w-72 bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col overflow-hidden shrink-0">
              
              {/* Tree Header */}
              <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EA3A20] flex items-center justify-center text-white shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">组织架构</h4>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (expandedNodes.size > 2) {
                      handleCollapseAll();
                    } else {
                      handleExpandAll();
                    }
                  }}
                  title={expandedNodes.size > 2 ? "收起所有分支" : "展开所有分支"}
                  className="px-2 py-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px] font-medium transition-colors"
                >
                  {expandedNodes.size > 2 ? '全部收起' : '全部展开'}
                </button>
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
                <div
                  onClick={() => setSelectedDeptId('all')}
                  className={`flex items-center gap-2 px-3 py-2 mx-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    selectedDeptId === 'all'
                      ? 'bg-[#EA3A20]/10 text-[#EA3A20] font-bold border border-[#EA3A20]/20'
                      : 'text-slate-700 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#EA3A20]" />
                  <span>全部</span>
                  <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500">
                    {employees.length}
                  </span>
                </div>
                <div className="my-1 border-t border-slate-100 mx-2" />

                {initialOrgTree.map((node) => renderTreeNode(node, 0))}
              </div>

              {/* Sync status footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-600">已同步</span>
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

                  {selectedDeptId && selectedDeptId !== 'all' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                      <span>部门：{selectedDeptName}</span>
                      <button
                        onClick={() => setSelectedDeptId('all')}
                        title="清除部门筛选"
                        className="text-slate-400 hover:text-slate-700 font-bold ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
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
                    <option value="全部角色">全部角色</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.roleName}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedLeaderFilter}
                    onChange={(e) => setSelectedLeaderFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-[#EA3A20]"
                  >
                    <option value="全部">负责人：全部</option>
                    <option value="是">负责人：是</option>
                    <option value="否">负责人：否</option>
                  </select>

                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-[#EA3A20]"
                  >
                    <option value="全部状态">状态：全部</option>
                    <option value="启用">状态：启用</option>
                    <option value="禁用">状态：禁用</option>
                  </select>

                  <select
                    value={selectedWhatsAppFilter}
                    onChange={(e) => setSelectedWhatsAppFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-[#EA3A20]"
                  >
                    <option value="全部">WhatsApp：全部</option>
                    <option value="已绑定">WhatsApp：已绑定</option>
                    <option value="未绑定">WhatsApp：未绑定</option>
                  </select>
                </div>

              </div>

              {/* Table Body - Columns */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10">
                    <tr className="border-b border-slate-100 text-slate-700 text-xs font-bold">
                      <th className="py-3.5 pl-6 pr-3 font-bold text-slate-900">员工姓名</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900">所属部门</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900 text-center">部门负责人</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900 min-w-[200px]">系统角色</th>
                      <th className="py-3.5 px-3 font-bold text-slate-900 min-w-[240px]">WhatsApp 账号</th>
                      <th className="py-3.5 pr-6 pl-3 font-bold text-slate-900 text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 text-xs">
                    {paginatedEmployees.map((emp, empIdx) => {
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

                          {/* 3. 所属部门 */}
                          <td className="py-3.5 px-3">
                            <div className="font-semibold text-slate-800 truncate max-w-[160px]">
                              {emp.department}
                            </div>
                          </td>

                          {/* 4. 部门负责人：是或否 (Read-only) */}
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex justify-center">
                              {emp.isDeptLeader ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>是</span>
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium">
                                  否
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 5. 角色 (直接在列表修改授权角色，支持多选与角色名查询) */}
                          <td className="py-3.5 px-3 relative">
                            {(() => {
                              const empRoles = getEmployeeRoles(emp);
                              return (
                                <div className="role-dropdown-container relative inline-block">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveRoleDropdownEmpId(
                                        activeRoleDropdownEmpId === emp.id ? null : emp.id
                                      );
                                      setActiveWaDropdownEmpId(null);
                                      setRoleSearchQuery('');
                                    }}
                                    className="group px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-bold flex items-center justify-between gap-1.5 cursor-pointer shadow-2xs transition-all max-w-[240px]"
                                    title="点击直接勾选或修改授权角色（支持多选）"
                                  >
                                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                      <Shield className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                                      {empRoles.length === 0 ? (
                                        <span className="text-slate-400 font-normal">暂无角色</span>
                                      ) : empRoles.length <= 2 ? (
                                        empRoles.map((role) => (
                                          <span
                                            key={role}
                                            className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 ${getRoleBadgeStyle(
                                              role
                                            )}`}
                                          >
                                            {role}
                                          </span>
                                        ))
                                      ) : (
                                        <>
                                          <span
                                            className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 ${getRoleBadgeStyle(
                                              empRoles[0]
                                            )}`}
                                          >
                                            {empRoles[0]}
                                          </span>
                                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-black border border-slate-200">
                                            +{empRoles.length - 1}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                                        activeRoleDropdownEmpId === emp.id ? 'rotate-180 text-slate-700' : ''
                                      }`}
                                    />
                                  </button>

                                  {/* 角色快捷多选授权下拉菜单 */}
                                  {activeRoleDropdownEmpId === emp.id && (
                                    <div
                                      className={`absolute left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 ${
                                        empIdx > filteredEmployees.length - 3 && filteredEmployees.length > 3
                                          ? 'bottom-full mb-1.5'
                                          : 'top-full mt-1.5'
                                      }`}
                                    >
                                      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                          <Shield className="w-3.5 h-3.5 text-[#EA3A20]" />
                                          <span className="font-bold text-xs text-slate-800">配置角色</span>
                                        </div>
                                        <span className="text-[11px] text-[#EA3A20] font-bold bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-full">
                                          已选 {empRoles.length} 项
                                        </span>
                                      </div>

                                      {/* 角色名查询搜索框 */}
                                      <div className="p-2 border-b border-slate-100 bg-white">
                                        <div className="relative">
                                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                          <input
                                            type="text"
                                            value={roleSearchQuery}
                                            onChange={(e) => setRoleSearchQuery(e.target.value)}
                                            placeholder="搜索角色..."
                                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#EA3A20] focus:bg-white"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      </div>

                                      <div className="p-1.5 max-h-56 overflow-y-auto custom-scrollbar space-y-0.5">
                                        {roles
                                          .filter((r) => {
                                            if (!roleSearchQuery.trim()) return true;
                                            const q = roleSearchQuery.toLowerCase();
                                            return (
                                              r.roleName.toLowerCase().includes(q) ||
                                              (r.description && r.description.toLowerCase().includes(q))
                                            );
                                          })
                                          .map((r) => {
                                            const isSelected = empRoles.includes(r.roleName);
                                            return (
                                              <div
                                                key={r.id}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleToggleEmployeeRole(emp.id, r.roleName);
                                                }}
                                                className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2.5 cursor-pointer transition-all border ${
                                                  isSelected
                                                    ? 'bg-red-50/70 border-red-200/80 text-slate-900 font-bold'
                                                    : 'bg-white border-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-100'
                                                }`}
                                              >
                                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                  <div
                                                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                                      isSelected
                                                        ? 'border-[#EA3A20] bg-[#EA3A20] text-white'
                                                        : 'border-slate-300 bg-white'
                                                    }`}
                                                  >
                                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                  </div>
                                                  <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                      <span className="font-bold truncate text-xs">{r.roleName}</span>
                                                      {r.roleName.includes('管理员') && (
                                                        <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                                                      )}
                                                    </div>
                                                    {r.description && (
                                                      <div className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                                                        {r.description}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        {roles.filter((r) => {
                                          if (!roleSearchQuery.trim()) return true;
                                          const q = roleSearchQuery.toLowerCase();
                                          return (
                                            r.roleName.toLowerCase().includes(q) ||
                                            (r.description && r.description.toLowerCase().includes(q))
                                          );
                                        }).length === 0 && (
                                          <div className="py-6 text-center text-slate-400 text-xs">
                                            未找到包含「{roleSearchQuery}」的角色
                                          </div>
                                        )}
                                      </div>

                                      <div className="p-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveRoleDropdownEmpId(null);
                                          }}
                                          className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer transition-colors text-xs"
                                        >
                                          完成
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </td>

                          {/* 6. 绑定WhatsApp账号 (1对1 下拉菜单选择) */}
                          <td className="py-3.5 px-3 relative">
                            <div className="wa-dropdown-container relative inline-block w-full max-w-[240px]">
                              {emp.whatsappAccountId ? (
                                <div className="flex items-center gap-1.5 w-full">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveWaDropdownEmpId(activeWaDropdownEmpId === emp.id ? null : emp.id);
                                      setWaSearchQuery('');
                                      setIsAddingNewWa(false);
                                    }}
                                    className="group px-2.5 py-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/90 hover:border-emerald-300 transition-all flex items-center justify-between gap-1.5 cursor-pointer flex-1 min-w-0 text-left shadow-2xs"
                                    title="更换账号"
                                  >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                        <MessageSquare className="w-2.5 h-2.5" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="font-bold text-emerald-950 text-[11px] truncate leading-tight">
                                          {emp.whatsappAccountName || '已绑定专线'}
                                        </div>
                                        <div className="text-[10px] text-emerald-700 font-mono truncate">
                                          {emp.whatsappPhone}
                                        </div>
                                      </div>
                                    </div>
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 text-emerald-700 shrink-0 transition-transform ${
                                        activeWaDropdownEmpId === emp.id ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>

                                  {/* 取消绑定按钮（叉叉） */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleBindWhatsApp(emp.id, null);
                                      if (activeWaDropdownEmpId === emp.id) {
                                        setActiveWaDropdownEmpId(null);
                                      }
                                    }}
                                    className="w-7 h-7 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 hover:border-rose-300 text-rose-500 hover:text-rose-700 flex items-center justify-center shrink-0 transition-all shadow-2xs cursor-pointer group/cancel"
                                    title="解除绑定"
                                  >
                                    <X className="w-3.5 h-3.5 stroke-[2.5] group-hover/cancel:scale-110 transition-transform" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveWaDropdownEmpId(activeWaDropdownEmpId === emp.id ? null : emp.id);
                                    setWaSearchQuery('');
                                    setIsAddingNewWa(false);
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/50 transition-all flex items-center justify-between gap-1.5 text-slate-500 hover:text-emerald-700 cursor-pointer text-xs font-medium w-full"
                                  title="绑定账号"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                                    <span>绑定账号</span>
                                  </div>
                                  <ChevronDown
                                    className={`w-3 h-3 text-slate-400 transition-transform ${
                                      activeWaDropdownEmpId === emp.id ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              )}

                              {/* Dropdown Menu */}
                              {activeWaDropdownEmpId === emp.id && (
                                <div
                                  className={`absolute left-0 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 ${
                                    empIdx > filteredEmployees.length - 3 && filteredEmployees.length > 3
                                      ? 'bottom-full mb-1.5'
                                      : 'top-full mt-1.5'
                                  }`}
                                >
                                  {/* Dropdown Header */}
                                  <div className="p-3 border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 via-white to-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-slate-900 text-xs">选择 WhatsApp 账号</div>
                                        <div className="text-[10px] text-slate-500">
                                          当前员工：<span className="font-bold text-slate-700">{emp.name}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setActiveWaDropdownEmpId(null)}
                                      className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Search Bar */}
                                  <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                                    <div className="relative">
                                      <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                      <input
                                        type="text"
                                        value={waSearchQuery}
                                        onChange={(e) => setWaSearchQuery(e.target.value)}
                                        placeholder="搜索姓名或手机号..."
                                        className="w-full pl-7 pr-3 py-1 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                                        autoFocus
                                      />
                                    </div>
                                  </div>

                                  {/* Account List */}
                                  <div className="max-h-56 overflow-y-auto custom-scrollbar p-1.5 space-y-1">
                                    {whatsAppAccounts
                                      .filter((acc) => {
                                        if (!waSearchQuery.trim()) return true;
                                        const q = waSearchQuery.toLowerCase();
                                        return (
                                          acc.name.toLowerCase().includes(q) ||
                                          acc.phone.includes(q) ||
                                          (acc.boundEmployeeName && acc.boundEmployeeName.toLowerCase().includes(q))
                                        );
                                      })
                                      .sort((a, b) => {
                                        // 1、没有被绑过的放在前面
                                        const aBound = Boolean(a.boundEmployeeId);
                                        const bBound = Boolean(b.boundEmployeeId);
                                        if (!aBound && bBound) return -1;
                                        if (aBound && !bBound) return 1;
                                        return 0;
                                      })
                                      .map((acc) => {
                                        const isCurrentlyBoundToThisEmp = acc.id === emp.whatsappAccountId;
                                        const isBoundToOtherEmp = Boolean(
                                          acc.boundEmployeeId && acc.boundEmployeeId !== emp.id
                                        );

                                        return (
                                          <div
                                            key={acc.id}
                                            onClick={() => {
                                              handleBindWhatsApp(emp.id, acc.id);
                                              setActiveWaDropdownEmpId(null);
                                            }}
                                            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                                              isCurrentlyBoundToThisEmp
                                                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-bold'
                                                : isBoundToOtherEmp
                                                ? 'bg-slate-50/70 border-slate-200/80 hover:bg-amber-50/60 hover:border-amber-300 text-slate-700'
                                                : 'bg-white border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 text-slate-800'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              <div
                                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                                  isCurrentlyBoundToThisEmp
                                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                                    : isBoundToOtherEmp
                                                    ? 'bg-slate-200 text-slate-600'
                                                    : 'bg-emerald-100 text-emerald-700'
                                                }`}
                                              >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                              </div>
                                              <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="font-bold text-xs text-slate-900 truncate">{acc.name}</span>
                                                  <span
                                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                      acc.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                                                    }`}
                                                    title={acc.status === 'online' ? '在线' : '离线'}
                                                  />
                                                </div>
                                                <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                                                  {acc.phone}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Status Indicator / Tag */}
                                            <div className="shrink-0 text-right">
                                              {isCurrentlyBoundToThisEmp ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
                                                  <Check className="w-3 h-3" />
                                                  当前绑定
                                                </span>
                                              ) : isBoundToOtherEmp ? (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200/90 text-slate-700 font-medium">
                                                  已绑：{acc.boundEmployeeName}
                                                </span>
                                              ) : (
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                  空闲可用
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>

                                  {/* Add New WhatsApp Quick Form */}
                                  {isAddingNewWa ? (
                                    <div className="p-2.5 border-t border-slate-100 bg-slate-50/90 space-y-2">
                                      <div className="text-[11px] font-bold text-slate-700">添加 WhatsApp 账号并绑定</div>
                                      <input
                                        type="text"
                                        placeholder="姓名 (如：张三)"
                                        value={newWaName}
                                        onChange={(e) => setNewWaName(e.target.value)}
                                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                                      />
                                      <input
                                        type="text"
                                        placeholder="手机号 (如：+86 138 0000 0000)"
                                        value={newWaPhone}
                                        onChange={(e) => setNewWaPhone(e.target.value)}
                                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                                      />
                                      <div className="flex items-center justify-end gap-1.5 pt-1">
                                        <button
                                          type="button"
                                          onClick={() => setIsAddingNewWa(false)}
                                          className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-md cursor-pointer"
                                        >
                                          取消
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (!newWaName.trim() || !newWaPhone.trim()) return;
                                            const newId = `WA-${String(whatsAppAccounts.length + 1).padStart(3, '0')}`;
                                            const newAcc: WhatsAppAccount = {
                                              id: newId,
                                              name: newWaName.trim(),
                                              phone: newWaPhone.trim(),
                                              region: newWaRegion,
                                              status: 'online',
                                              boundEmployeeId: emp.id,
                                              boundEmployeeName: emp.name
                                            };
                                            setWhatsAppAccounts((prev) => [...prev, newAcc]);
                                            handleBindWhatsApp(emp.id, newId);
                                            setNewWaName('');
                                            setNewWaPhone('');
                                            setIsAddingNewWa(false);
                                            setActiveWaDropdownEmpId(null);
                                          }}
                                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md cursor-pointer shadow-xs"
                                        >
                                          创建并绑定
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[10px] text-slate-400">
                                      <span>共 {whatsAppAccounts.length} 个账号</span>
                                      <button
                                        type="button"
                                        onClick={() => setIsAddingNewWa(true)}
                                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>添加新账号</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* 7. 状态：操作启用或禁用 */}
                          <td className="py-3.5 pr-6 pl-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleEmployeeStatus(emp.id)}
                                title={isEnabled ? "点击禁用" : "点击启用"}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  isEnabled ? 'bg-[#EA3A20]' : 'bg-slate-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    isEnabled ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <span className={`text-xs font-bold ${isEnabled ? 'text-[#EA3A20]' : 'text-slate-400'}`}>
                                {isEnabled ? '启用' : '禁用'}
                              </span>
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

              {/* Employee Table Pagination */}
              <Pagination
                currentPage={empCurrentPage}
                totalItems={filteredEmployees.length}
                pageSize={empPageSize}
                onPageChange={setEmpCurrentPage}
                onPageSizeChange={(newSize) => {
                  setEmpPageSize(newSize);
                  setEmpCurrentPage(1);
                }}
                itemUnit="人"
              />
            </div>

          </div>
        ) : (
          /* TAB: 角色管理 (列表形式) */
          <div className="h-full flex flex-col bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            
            {/* Table Header / Toolbar */}
            <div className="p-4.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={roleSearchQuery}
                    onChange={(e) => setRoleSearchQuery(e.target.value)}
                    placeholder="搜索角色..."
                    className="w-full pl-8.5 pr-8 py-2 rounded-full border border-slate-200 bg-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#0F4A47] transition-all"
                  />
                  {roleSearchQuery && (
                    <button
                      onClick={() => setRoleSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>共 <strong className="text-slate-800 font-mono">{roles.length}</strong> 个角色</span>
                  {roleSearchQuery && (
                    <span className="text-slate-400">(匹配筛选到 {filteredRoles.length} 个)</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateNewRole}
                  className="h-8.5 px-4 rounded-full bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增角色</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-100 text-slate-600 text-[11px] font-bold">
                  <tr>
                    <th className="py-3.5 px-6 w-56">角色名称</th>
                    <th className="py-3.5 px-4 min-w-[200px]">职责描述</th>
                    <th className="py-3.5 px-4 min-w-[300px]">功能菜单权限</th>
                    <th className="py-3.5 px-4 text-center w-28">关联员工</th>
                    <th className="py-3.5 px-6 text-right w-32">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedRoles.map((role) => {
                    const menuCount = role.permissions.filter((p) => p.view).length;
                    const totalMenu = role.permissions.length;
                    const isSuperAdmin = role.id === 'ROLE-ADMIN' || role.roleName === '超级管理员';

                    return (
                      <tr
                        key={role.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* 角色名称 */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{role.roleName}</span>
                            {isSuperAdmin && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                <Lock className="w-2.5 h-2.5 text-slate-500" />
                                <span>系统内置</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 角色职责说明 */}
                        <td className="py-4 px-4 text-slate-600 leading-relaxed max-w-xs">
                          {role.description || <span className="text-slate-300">暂无说明</span>}
                        </td>

                        {/* 菜单功能权限 */}
                        <td className="py-4 px-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-mono">
                                {menuCount} / {totalMenu} 模块
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {menuCount === totalMenu ? '全部菜单开放' : `已配置 ${menuCount} 项菜单`}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {role.permissions
                                .filter((p) => p.view)
                                .slice(0, 6)
                                .map((perm) => {
                                  const scopeLabel =
                                    perm.dataScope === 'all'
                                      ? '全部数据'
                                      : perm.dataScope === 'self_only'
                                      ? '仅本人'
                                      : '本部门及子部门';

                                  return (
                                    <span
                                      key={perm.module}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                                      title={`${perm.module} (数据范围: ${scopeLabel})`}
                                    >
                                      <span>{perm.module}</span>
                                      <span className="text-[9px] text-slate-400 font-mono">({scopeLabel})</span>
                                    </span>
                                  );
                                })}
                              {role.permissions.filter((p) => p.view).length > 6 && (
                                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200/50">
                                  +{role.permissions.filter((p) => p.view).length - 6}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 关联员工 */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedRoleFilter(role.roleName);
                              onSelectSubView?.('员工列表');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold font-mono text-xs cursor-pointer transition-colors"
                            title="点击筛选此角色的员工"
                          >
                            <Users className="w-3 h-3 text-slate-500" />
                            <span>{role.userCount}</span>
                            <span className="text-[10px] font-normal text-slate-500">人</span>
                          </button>
                        </td>

                        {/* 操作 */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isSuperAdmin ? (
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-400 bg-slate-100/90 border border-slate-200/80 rounded-lg select-none cursor-not-allowed"
                                title="内置超级管理员拥有全局最高权限，不支持修改与删除"
                              >
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>内置最高权限</span>
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditRole(role)}
                                  className="px-2.5 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  配置权限
                                </button>
                                <button
                                  onClick={() => handleDeleteRole(role.id, role.roleName)}
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                  title="删除角色"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRoles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p>未找到符合条件的系统角色</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Role Table Pagination */}
            <Pagination
              currentPage={roleCurrentPage}
              totalItems={filteredRoles.length}
              pageSize={rolePageSize}
              onPageChange={setRoleCurrentPage}
              onPageSizeChange={(newSize) => {
                setRolePageSize(newSize);
                setRoleCurrentPage(1);
              }}
              itemUnit="个角色"
            />
          </div>
        )}

      </div>

      {/* Role Permission Modal */}
      <RolePermissionModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setIsCreatingNewRole(false);
        }}
        role={editingRole}
        isNewRole={isCreatingNewRole}
        onSaveRole={handleSaveRole}
        allDepts={wecomDepts.map((d) => d.name)}
      />

    </div>
  );
};
