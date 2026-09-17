import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  LayoutGrid,
  Database,
  Sliders,
  Check,
  AlertTriangle,
  Lock,
  Globe,
  Building,
  User,
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  Info,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';
import {
  RoleConfig,
  DataScopeType,
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

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  isOpen,
  onClose,
  role,
  onSaveRole,
  allDepts,
  isNewRole = false
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'data' | 'operation'>('menu');
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [permissions, setPermissions] = useState<RoleConfig['permissions']>([]);
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
    '产品价格维护',
    '数据统计',
    '员工权限',
    '智能体基础设置',
    '日志审计'
  ];

  const availableRegions = [
    '北美市场 (美国/加拿大)',
    '欧洲市场 (英德法西意)',
    '中东与海湾七国 (阿联酋/沙特)',
    '澳洲与大洋洲 (澳新)',
    '东南亚及亚太新兴市场'
  ];

  useEffect(() => {
    if (role) {
      setRoleName(role.roleName);
      setDescription(role.description);
      setNameError('');
      setActiveTab('menu');
      
      // Ensure all modules exist in permissions
      const initialPerms = availableModules.map((mod) => {
        const found = role.permissions?.find((p) => p.module === mod);
        return (
          found || {
            module: mod,
            view: false,
            edit: false,
            delete: false,
            export: false
          }
        );
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

  const togglePerm = (moduleName: string) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.module === moduleName) {
          return { ...p, view: !p.view };
        }
        return p;
      })
    );
  };

  const toggleAllModules = (enableAll: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => ({
        ...p,
        view: enableAll
      }))
    );
  };

  // Operation Perms toggle
  const toggleOperation = (key: keyof OperationPermissionsConfig) => {
    setOperationPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-7 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/20 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EA3A20] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-slate-900">
                  {isNewRole ? '新增系统角色' : '配置角色权限'}
                </h3>
                {!isNewRole && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {roleName || '未命名角色'}
                  </span>
                )}
                {!isNewRole && (
                  <span className="text-xs text-slate-400 font-mono">({role.userCount} 人使用中)</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isNewRole
                  ? '设置角色基本信息，并配置该角色的系统菜单访问权限'
                  : '管理角色的系统访问与配置权限'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content Body */}
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
                  placeholder="如：外贸销售助理 / 运营助理"
                  className={`w-full px-3.5 py-2 rounded-xl border bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    nameError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-[#0F4A47]'
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
                角色职责描述
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要说明该角色的业务范围与职责定位..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4A47]"
              />
            </div>
          </div>

          {/* MENU PERMISSIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-sm">菜单权限配置</span>
                <span className="text-slate-400 text-xs ml-2">
                  (已授权 {permissions.filter((p) => p.view).length} / {permissions.length} 个功能模块)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAllModules(true)}
                  className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors"
                >
                  全部开启
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => toggleAllModules(false)}
                  className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  清空所有
                </button>
              </div>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold text-[11px]">
                    <th className="py-3.5 px-6">系统功能模块</th>
                    <th className="py-3.5 px-6 text-right w-36">
                      <span className="flex items-center justify-end gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>查看权限</span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissions.map((perm) => (
                    <tr key={perm.module} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EA3A20]" />
                        {perm.module}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <input
                          type="checkbox"
                          checked={perm.view}
                          onChange={() => togglePerm(perm.module)}
                          className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50">
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
  );
};
