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
  Square
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
}

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  isOpen,
  onClose,
  role,
  onSaveRole,
  allDepts
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'data' | 'operation'>('menu');
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
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
    '售前询盘助手',
    '销售助手',
    '运营助手',
    '知识库管理',
    '数据统计',
    '员工权限',
    '系统配置',
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
      
      // Ensure all modules exist in permissions
      const initialPerms = availableModules.map((mod) => {
        const found = role.permissions.find((p) => p.module === mod);
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
  }, [role, isOpen]);

  if (!isOpen || !role) return null;

  // Menu Perms toggle
  const togglePerm = (moduleName: string, field: 'view' | 'edit' | 'delete' | 'export') => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.module === moduleName) {
          const updated = { ...p, [field]: !p[field] };
          // If edit/delete/export is checked, view must be true
          if ((field === 'edit' || field === 'delete' || field === 'export') && updated[field]) {
            updated.view = true;
          }
          // If view is unchecked, others must be unchecked
          if (field === 'view' && !updated.view) {
            updated.edit = false;
            updated.delete = false;
            updated.export = false;
          }
          return updated;
        }
        return p;
      })
    );
  };

  const toggleRowAll = (moduleName: string) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.module === moduleName) {
          const allChecked = p.view && p.edit && p.delete && p.export;
          return {
            ...p,
            view: !allChecked,
            edit: !allChecked,
            delete: !allChecked,
            export: !allChecked
          };
        }
        return p;
      })
    );
  };

  const toggleAllModules = (enableAll: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => ({
        ...p,
        view: enableAll,
        edit: enableAll,
        delete: enableAll,
        export: enableAll
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
    const updatedRole: RoleConfig = {
      ...role,
      roleName,
      description,
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
        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EA3A20] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-900">配置角色权限矩阵</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-[#EA3A20] border border-red-100">
                  {roleName || '未命名角色'}
                </span>
                <span className="text-xs text-slate-400 font-mono">({role.userCount} 人使用中)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                统一配置该系统角色的菜单访问、数据隔离范围与细粒度业务操作权限
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

        {/* Tab Navigation */}
        <div className="px-7 pt-4 pb-2 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'menu'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#EA3A20]" />
              <span>1. 菜单与模块权限</span>
              <span className="text-[10px] bg-red-50 text-[#EA3A20] px-1.5 py-0.2 rounded-full font-mono">
                {permissions.filter((p) => p.view).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'data'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>2. 数据权限与脱敏</span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded-full">
                {dataPermission.scope === 'all'
                  ? '全部'
                  : dataPermission.scope === 'dept_and_sub'
                  ? '部门及下级'
                  : dataPermission.scope === 'dept_only'
                  ? '本部门'
                  : dataPermission.scope === 'self_only'
                  ? '仅本人'
                  : '自定义'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('operation')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'operation'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. 细粒度操作权限</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded-full font-mono">
                {Object.values(operationPermissions).filter(Boolean).length}/16
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            修改后该角色下所有员工账号即时生效
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-6 custom-scrollbar text-xs">
          
          {/* TAB 1: MENU PERMISSIONS */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">模块导航访问与控制清单</span>
                  <span className="text-slate-400 text-[11px]">(取消查看权限将对该角色隐藏整套导航与对应接口)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAllModules(true)}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-[#EA3A20] hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    一键全部开启
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
                      <th className="py-3.5 px-4 w-44">系统功能模块</th>
                      <th className="py-3.5 px-4 text-center w-24">
                        <span className="flex items-center justify-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>查看权限</span>
                        </span>
                      </th>
                      <th className="py-3.5 px-4 text-center w-24">
                        <span className="flex items-center justify-center gap-1">
                          <Edit className="w-3.5 h-3.5 text-slate-400" />
                          <span>编辑/新增</span>
                        </span>
                      </th>
                      <th className="py-3.5 px-4 text-center w-24">
                        <span className="flex items-center justify-center gap-1">
                          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>删除权限</span>
                        </span>
                      </th>
                      <th className="py-3.5 px-4 text-center w-24">
                        <span className="flex items-center justify-center gap-1">
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>数据导出</span>
                        </span>
                      </th>
                      <th className="py-3.5 px-4 text-right w-24">快速控制</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {permissions.map((perm) => {
                      const allChecked = perm.view && perm.edit && perm.delete && perm.export;
                      return (
                        <tr key={perm.module} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EA3A20]" />
                            {perm.module}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={perm.view}
                              onChange={() => togglePerm(perm.module, 'view')}
                              className="rounded border-slate-300 text-[#EA3A20] focus:ring-[#EA3A20] w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={perm.edit}
                              onChange={() => togglePerm(perm.module, 'edit')}
                              className="rounded border-slate-300 text-[#EA3A20] focus:ring-[#EA3A20] w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={perm.delete}
                              onChange={() => togglePerm(perm.module, 'delete')}
                              className="rounded border-slate-300 text-[#EA3A20] focus:ring-[#EA3A20] w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={perm.export}
                              onChange={() => togglePerm(perm.module, 'export')}
                              className="rounded border-slate-300 text-[#EA3A20] focus:ring-[#EA3A20] w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => toggleRowAll(perm.module)}
                              className="text-[11px] font-bold text-slate-400 hover:text-[#EA3A20] cursor-pointer"
                            >
                              {allChecked ? '全部取消' : '整行全选'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: DATA PERMISSIONS */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              
              {/* Scope Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <Database className="w-4 h-4 text-blue-600" />
                    数据可见性与隔离范围 (Data Scope)
                  </h4>
                  <span className="text-[11px] text-slate-400">决定该角色可查询的客户、询盘、会话和统计报表跨度</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Option 1: All */}
                  <div
                    onClick={() =>
                      setDataPermission({
                        ...dataPermission,
                        scope: 'all',
                        scopeLabel: '全部数据权限 (跨部门全公司)'
                      })
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      dataPermission.scope === 'all'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>全部数据权限</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          dataPermission.scope === 'all'
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {dataPermission.scope === 'all' && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      可查阅全公司跨部门、跨海外所有大区、所有销售人员名下的客户询盘、聊天记录与成交数据（适用于总经理/副总裁/超管）。
                    </p>
                  </div>

                  {/* Option 2: Dept + Sub */}
                  <div
                    onClick={() =>
                      setDataPermission({
                        ...dataPermission,
                        scope: 'dept_and_sub',
                        scopeLabel: '本部门及下属部门数据'
                      })
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      dataPermission.scope === 'dept_and_sub'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Building className="w-4 h-4 text-indigo-600" />
                        <span>本部门及下属子部门数据</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          dataPermission.scope === 'dept_and_sub'
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {dataPermission.scope === 'dept_and_sub' && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      仅可查阅当前员工所属部门以及该部门挂载的所有下级子团队成员数据（适用于外贸事业部总监、大区经理）。
                    </p>
                  </div>

                  {/* Option 3: Dept Only */}
                  <div
                    onClick={() =>
                      setDataPermission({
                        ...dataPermission,
                        scope: 'dept_only',
                        scopeLabel: '本部门数据权限'
                      })
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      dataPermission.scope === 'dept_only'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Users className="w-4 h-4 text-teal-600" />
                        <span>本部门数据权限</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          dataPermission.scope === 'dept_only'
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {dataPermission.scope === 'dept_only' && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      仅限查看当前直属部门内的数据，无法查看其他平级部门或跨事业部线索（适用于组长、推广部主管）。
                    </p>
                  </div>

                  {/* Option 4: Self Only */}
                  <div
                    onClick={() =>
                      setDataPermission({
                        ...dataPermission,
                        scope: 'self_only',
                        scopeLabel: '仅本人数据权限'
                      })
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      dataPermission.scope === 'self_only'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>仅本人数据权限 (个人私海)</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          dataPermission.scope === 'self_only'
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {dataPermission.scope === 'self_only' && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      严格隔离，仅能查阅与操作由本人跟进负责的客户、本人参与的 AI 会话及分配名下询盘（适用于一线销售业务员）。
                    </p>
                  </div>

                </div>
              </div>

              {/* Sensitive Field Masking */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-[#EA3A20]" />
                  敏感字段脱敏加密与商业机密保护
                </h4>

                <div className="space-y-2.5">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <span>客户联系方式强制脱敏保护 (防飞单防私撬)</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          安全推荐
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1">
                        开启后，该角色查阅客户详情与询盘时，海外买家电话、邮箱、WhatsApp 账号自动掩码显示（如 <code className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded border border-slate-200">+1 646***2918</code>），杜绝销售离职私带客户。
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDataPermission({
                          ...dataPermission,
                          maskCustomerContact: !dataPermission.maskCustomerContact
                        })
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        dataPermission.maskCustomerContact ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          dataPermission.maskCustomerContact ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <span>工厂出厂成本与最低毛利率脱敏保护</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          商业机密
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1">
                        开启后，在 BOQ 报价与定制算法中隐藏工厂真实出厂成本底价与利润率红线，业务员仅可查看对外指导 FOB 价格与标准阶梯折扣。
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDataPermission({
                          ...dataPermission,
                          maskCostPrice: !dataPermission.maskCostPrice
                        })
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        dataPermission.maskCostPrice ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          dataPermission.maskCostPrice ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: OPERATION PERMISSIONS */}
          {activeTab === 'operation' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    各业务模块功能细粒度操作权限
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">控制具体业务流中的核心按键、批量操作、审核终审与管理敏感动作</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allOn = Object.keys(operationPermissions).reduce((acc, key) => {
                        acc[key as keyof OperationPermissionsConfig] = true;
                        return acc;
                      }, {} as OperationPermissionsConfig);
                      setOperationPermissions(allOn);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer transition-colors"
                  >
                    全部授权
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => {
                      // Safety preset: standard sales
                      setOperationPermissions({
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
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    恢复标准安全预设
                  </button>
                </div>
              </div>

              {/* Group 1: Pre-Sales & Inquiry */}
              <div className="p-4.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>售前客服与询盘管理</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.inquiryAssign}
                      onChange={() => toggleOperation('inquiryAssign')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800">询盘人工改派与指派</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">将未分流或公共询盘指派给指定业务员</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.inquiryTakeover}
                      onChange={() => toggleOperation('inquiryTakeover')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800">强制接管 AI / 转交会话</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">打断 AI 自动接待并强制接入人工客服</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.inquiryExport}
                      onChange={() => toggleOperation('inquiryExport')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>批量导出询盘明细</span>
                        <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-bold">敏感</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">导出包含买家画像与采购需求的 Excel</div>
                    </div>
                  </label>

                </div>
              </div>

              {/* Group 2: Customer & Sales */}
              <div className="p-4.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>销售助手与客户跟进</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.customerTransfer}
                      onChange={() => toggleOperation('customerTransfer')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800">客户公私海划转与转交</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">将客户移入公海池或转让给其他同事</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.customerPriceQuote}
                      onChange={() => toggleOperation('customerPriceQuote')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>生成特批底价报价单</span>
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold">核心定价</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">越过常规折扣生成特批工程 FOB 价格</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.customerTagEdit}
                      onChange={() => toggleOperation('customerTagEdit')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800">强制修改客户生命周期标签</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">变更客户意向等级与商机跟进阶段</div>
                    </div>
                  </label>

                </div>
              </div>

              {/* Group 3: Marketing & Social */}
              <div className="p-4.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>运营助手与海外社媒矩阵</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.marketingApprove}
                      onChange={() => toggleOperation('marketingApprove')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>社媒发布计划终审与驳回</span>
                        <span className="text-[9px] bg-purple-100 text-purple-800 px-1 py-0.2 rounded font-bold">内容终审</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">审核 TikTok/YouTube 图文视频发布</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.marketingDirectPost}
                      onChange={() => toggleOperation('marketingDirectPost')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800">直连社媒 API 一键发布</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">免审核直接推送内容至海外官方账号</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.marketingBatchGenerate}
                      onChange={() => toggleOperation('marketingBatchGenerate')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800">批量调用 AI 生成视频与文案</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">高频批量生成多语种外贸种草脚本</div>
                    </div>
                  </label>

                </div>
              </div>

              {/* Group 4: Knowledge Base */}
              <div className="p-4.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>知识库管理与核心资产</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.knowledgePublish}
                      onChange={() => toggleOperation('knowledgePublish')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>工艺词条免审直接发布上线</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">直接生效</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">知识库更新无需主管审批即刻进 RAG 库</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.knowledgeVectorRebuild}
                      onChange={() => toggleOperation('knowledgeVectorRebuild')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>触发向量库全量重建</span>
                        <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-bold">高危算力</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">对十万级知识切片执行 Embedding 重新切分</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.knowledgeExport}
                      onChange={() => toggleOperation('knowledgeExport')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>导出外贸定制工艺百科</span>
                        <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-bold">核心资产</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">导出包含激光封边/五金配置的企业全量资料</div>
                    </div>
                  </label>

                </div>
              </div>

              {/* Group 5: Staff & Admin */}
              <div className="p-4.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>员工管理与系统安全</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.wecomSyncManual}
                      onChange={() => toggleOperation('wecomSyncManual')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800">手动全量同步企业微信</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">触发企微通讯录 API 同步接口</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.roleManage}
                      onChange={() => toggleOperation('roleManage')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>分配与变更员工角色</span>
                        <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-bold">高权</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">为企微同步员工授予系统角色</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.quotaAdjust}
                      onChange={() => toggleOperation('quotaAdjust')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800">调整员工每日 AI 算力上限</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">设定员工单日调用大模型次数</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={operationPermissions.auditExport}
                      onChange={() => toggleOperation('auditExport')}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>导出全平台审计日志</span>
                        <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-bold">合规安全</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">导出操作轨迹与 IP 访问流水</div>
                    </div>
                  </label>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>配置完成后，所有归属于「{roleName}」的员工权限在下一次刷新时自动同步生效。</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 cursor-pointer transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#d0311a] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>保存权限配置</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
