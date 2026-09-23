import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  Eye,
  AlertCircle,
  Database,
  CheckCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import {
  RoleConfig,
  RoleMenuPermission,
  MenuDataScope,
  DataPermissionConfig,
  OperationPermissionsConfig
} from '../../../types';

interface RolePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleConfig | null;
  onSaveRole: (updatedRole: RoleConfig) => void;
  allDepts: string[];
  isNewRole?: boolean;
}

const DATA_SCOPE_OPTIONS: { key: MenuDataScope; label: string; desc: string }[] = [
  { key: 'all', label: '全部数据', desc: '全公司所有数据' },
  { key: 'dept_and_sub', label: '所属部门及其子部门的数据', desc: '本部门及下属子部门数据' },
  { key: 'self_only', label: '自己创建的数据', desc: '仅本人创建/负责的数据' }
];

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  isOpen,
  onClose,
  role,
  onSaveRole,
  allDepts,
  isNewRole = false
}) => {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [permissions, setPermissions] = useState<RoleMenuPermission[]>([]);
  const [dataPermission, setDataPermission] = useState<DataPermissionConfig>({
    scope: 'self_only',
    scopeLabel: '仅本人数据权限',
    customDepts: [],
    customRegions: ['北美市场', '欧洲市场'],
    maskCustomerContact: true,
    maskCostPrice: true
  });
  const [operationPermissions, setOperationPermissions] = useState<OperationPermissionsConfig>({
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
  });

  const availableModules = [
    '知识问答',
    '售前询盘',
    '销售助手',
    '运营助手',
    '知识库管理',
    '面价汇率',
    '数据统计',
    '员工权限',
    '智能体基础设置',
    '日志与审计'
  ];

  useEffect(() => {
    if (role) {
      setRoleName(role.roleName);
      setDescription(role.description);
      setNameError('');
      
      // Ensure all modules exist in permissions with proper dataScope defaults
      const initialPerms = availableModules.map((mod) => {
        const found = role.permissions?.find((p) => p.module === mod || (mod === '日志与审计' && p.module === '日志审计'));
        if (found) {
          return {
            ...found,
            module: mod,
            dataScope: found.dataScope || (role.id === 'ROLE-ADMIN' ? 'all' : 'dept_and_sub')
          };
        }
        return {
          module: mod,
          view: false,
          dataScope: 'dept_and_sub' as MenuDataScope,
          edit: false,
          delete: false,
          export: false
        };
      });
      setPermissions(initialPerms);

      if (role.dataPermission) {
        setDataPermission({ ...role.dataPermission });
      } else {
        setDataPermission({
          scope: 'self_only',
          scopeLabel: '仅本人数据权限',
          customDepts: [],
          customRegions: ['北美市场'],
          maskCustomerContact: true,
          maskCostPrice: true
        });
      }

      if (role.operationPermissions) {
        setOperationPermissions({ ...role.operationPermissions });
      }
    }
  }, [role, isOpen, isNewRole]);

  if (!isOpen || !role) return null;

  // Toggle view checkbox for a module
  const togglePerm = (moduleName: string) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.module === moduleName) {
          const nextView = !p.view;
          return {
            ...p,
            view: nextView,
            dataScope: p.dataScope || 'dept_and_sub'
          };
        }
        return p;
      })
    );
  };

  // Change data scope for a module (三选一单选)
  const handleDataScopeChange = (moduleName: string, scope: MenuDataScope) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.module === moduleName) {
          return { ...p, dataScope: scope };
        }
        return p;
      })
    );
  };

  // Select all modules
  const toggleAllModules = (enableAll: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => ({
        ...p,
        view: enableAll,
        dataScope: p.dataScope || 'dept_and_sub'
      }))
    );
  };

  // Batch change data scope for all enabled modules
  const handleBatchSetDataScope = (scope: MenuDataScope) => {
    setPermissions((prev) =>
      prev.map((p) => (p.view ? { ...p, dataScope: scope } : p))
    );
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      setNameError('请输入角色名称');
      return;
    }
    const updatedRole: RoleConfig = {
      ...role,
      roleName: roleName.trim(),
      description: description.trim() || '业务权限角色',
      permissions,
      dataPermission,
      operationPermissions
    };
    onSaveRole(updatedRole);
    onClose();
  };

  const enabledCount = permissions.filter((p) => p.view).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-7 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-50/20 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EA3A20] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-slate-900">
                  {isNewRole ? '新增角色' : '配置角色权限'}
                </h3>
                {!isNewRole && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {roleName || '未命名角色'}
                  </span>
                )}
                {!isNewRole && (
                  <span className="text-xs text-slate-400 font-mono">({role.userCount} 人)</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-6 custom-scrollbar text-xs">
          
          {/* Basic Info Form */}
          <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-100 space-y-3.5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  角色名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => {
                    setRoleName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="输入角色名称 (如：海外大客户业务主管)"
                  className={`w-full px-3.5 py-2 rounded-xl border bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    nameError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-[#EA3A20]'
                  }`}
                />
                {nameError && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{nameError}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                职责描述
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="输入角色职责说明"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#EA3A20]"
              />
            </div>
          </div>

          {/* MENU & DATA SCOPE PERMISSIONS */}
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">功能菜单权限与数据范围配置</span>
                <span className="text-slate-400 text-xs font-mono">
                  (已启用 {enabledCount} / {permissions.length} 个模块)
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Quick Select All / Unselect All */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-xl shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAllModules(true)}
                    className="px-2.5 py-0.5 rounded-lg text-xs font-bold text-[#EA3A20] hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    全选开启
                  </button>
                  <span className="text-slate-200">|</span>
                  <button
                    type="button"
                    onClick={() => toggleAllModules(false)}
                    className="px-2.5 py-0.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    全部关闭
                  </button>
                </div>

                {/* Batch Set Data Scope for Enabled Modules */}
                {enabledCount > 0 && (
                  <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium">批量设为:</span>
                    <div className="flex items-center gap-1">
                      {DATA_SCOPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleBatchSetDataScope(opt.key)}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-lg text-[11px] text-slate-700 font-medium cursor-pointer transition-colors"
                          title={`将已开启的 ${enabledCount} 个模块统一设置为「${opt.label}」`}
                        >
                          {opt.label === '所属部门及其子部门的数据' ? '所属部门及子部门' : opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Menu & Data Scope Table */}
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold text-[11px]">
                    <th className="py-3 px-5 w-44">功能模块</th>
                    <th className="py-3 px-4 w-28 text-center">
                      <span className="inline-flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>查看权限</span>
                      </span>
                    </th>
                    <th className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-[#EA3A20]" />
                        <span>查看权限的数据范围 (三选一单选)</span>
                        <span className="text-[10px] font-normal text-slate-400">
                          - 勾选查看权限后生效
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissions.map((perm) => {
                    const isViewEnabled = perm.view;
                    const currentScope: MenuDataScope = perm.dataScope || 'dept_and_sub';

                    return (
                      <tr
                        key={perm.module}
                        className={`transition-colors ${
                          isViewEnabled ? 'hover:bg-slate-50/60 bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        {/* 功能模块名称 */}
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full transition-colors ${
                                isViewEnabled ? 'bg-[#EA3A20]' : 'bg-slate-300'
                              }`}
                            />
                            <span className={isViewEnabled ? 'text-slate-900' : 'text-slate-400'}>
                              {perm.module}
                            </span>
                          </div>
                        </td>

                        {/* 查看权限 Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={isViewEnabled}
                              onChange={() => togglePerm(perm.module)}
                              className="rounded border-slate-300 text-[#EA3A20] focus:ring-[#EA3A20] w-4 h-4 cursor-pointer"
                            />
                          </label>
                        </td>

                        {/* 查看权限的数据范围：三选一单选 (全部数据 / 所属部门及其子部门的数据 / 自己创建的数据) */}
                        <td className="py-3.5 px-5">
                          {isViewEnabled ? (
                            <div className="flex flex-wrap items-center gap-2">
                              {DATA_SCOPE_OPTIONS.map((opt) => {
                                const isSelected = currentScope === opt.key;
                                return (
                                  <label
                                    key={opt.key}
                                    onClick={() => handleDataScopeChange(perm.module, opt.key)}
                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isSelected
                                        ? 'bg-red-50/90 border-[#EA3A20]/60 text-[#EA3A20] font-bold shadow-2xs ring-1 ring-[#EA3A20]/20'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                                    }`}
                                    title={opt.desc}
                                  >
                                    <span
                                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                        isSelected
                                          ? 'border-[#EA3A20] bg-[#EA3A20]'
                                          : 'border-slate-300 bg-white'
                                      }`}
                                    >
                                      {isSelected && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                      )}
                                    </span>
                                    <span>{opt.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400 text-xs py-1 select-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              <span className="text-slate-400">未勾选查看权限（勾选左侧开启后可选择数据范围）</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#EA3A20]" />
            <span>已为角色配置 <strong>{enabledCount}</strong> 项功能菜单及其对应的数据可见范围</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 cursor-pointer transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isNewRole ? '创建角色' : '保存权限'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

