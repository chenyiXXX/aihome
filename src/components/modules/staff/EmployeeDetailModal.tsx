import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Shield,
  Cpu,
  Check,
  Crown,
  Database,
  Zap,
  TrendingUp,
  UserCheck,
  UserX
} from 'lucide-react';
import { EmployeeItem, RoleConfig } from '../../../types';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeItem | null;
  roles: RoleConfig[];
  initialTab?: 'auth' | 'quota';
  onSaveEmployee: (updated: EmployeeItem) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  roles,
  onSaveEmployee
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('销售业务员');
  const [quotaLimit, setQuotaLimit] = useState<number>(2000);
  const [accountStatus, setAccountStatus] = useState<'启用' | '已禁用'>('启用');
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [customQuotaInput, setCustomQuotaInput] = useState<string>('2000');

  useEffect(() => {
    if (employee) {
      setSelectedRole(employee.role);
      setQuotaLimit(employee.aiQuotaLimit);
      setCustomQuotaInput(String(employee.aiQuotaLimit));
      setAccountStatus(employee.status === '已禁用' ? '已禁用' : '启用');
      setIsLeader(Boolean(employee.isDeptLeader));
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const handleSave = () => {
    onSaveEmployee({
      ...employee,
      role: selectedRole as any,
      aiQuotaLimit: Number(customQuotaInput) || quotaLimit,
      status: accountStatus,
      isDeptLeader: isLeader
    });
    onClose();
  };

  const handleQuotaPreset = (val: number) => {
    setQuotaLimit(val);
    setCustomQuotaInput(String(val));
  };

  const handleCustomQuotaChange = (val: string) => {
    setCustomQuotaInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setQuotaLimit(num);
    }
  };

  const currentRoleObj = roles.find((r) => r.roleName === selectedRole);
  const effectiveLimit = Number(customQuotaInput) || quotaLimit;
  const remaining = Math.max(0, effectiveLimit - employee.aiQuotaUsed);
  const usagePercent = Math.min(100, Math.round((employee.aiQuotaUsed / Math.max(1, effectiveLimit)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-50/40 via-white to-slate-50/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EA3A20] to-[#c42810] flex items-center justify-center text-white font-bold text-base shadow-xs">
              {employee.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{employee.name}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  企微认证
                </span>
                {isLeader && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Crown className="w-3 h-3 text-amber-600" />
                    部门负责人
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                <span>ID: {employee.wecomUserId || employee.id}</span>
                <span>·</span>
                <span>{employee.department}</span>
                {employee.wecomPosition && (
                  <>
                    <span>·</span>
                    <span>{employee.wecomPosition}</span>
                  </>
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
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs flex-1">
          
          {/* Section 1: Role Assignment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Shield className="w-4 h-4 text-[#EA3A20]" />
                <span>分配系统角色</span>
              </label>
              <span className="text-slate-400 text-xs">已选：<strong className="text-slate-700">{selectedRole}</strong></span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {roles.map((r) => {
                const isSelected = selectedRole === r.roleName;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.roleName)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#EA3A20] bg-red-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{r.roleName}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#EA3A20] bg-[#EA3A20] text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {r.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Role Permissions Summary */}
            {currentRoleObj?.dataPermission && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>数据可见范围：</span>
                  <span className="font-bold text-slate-800">{currentRoleObj.dataPermission.scopeLabel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">客户脱敏：<strong className={currentRoleObj.dataPermission.maskCustomerContact ? "text-emerald-600" : "text-slate-600"}>{currentRoleObj.dataPermission.maskCustomerContact ? '已开启' : '关闭'}</strong></span>
                  <span className="text-slate-400">底价保护：<strong className={currentRoleObj.dataPermission.maskCostPrice ? "text-emerald-600" : "text-slate-600"}>{currentRoleObj.dataPermission.maskCostPrice ? '已保护' : '可见'}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Account Status & Org Management */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>账号与管理属性</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">账号状态</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">控制该员工是否可登录系统</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAccountStatus(accountStatus === '启用' ? '已禁用' : '启用')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    accountStatus === '启用'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {accountStatus === '启用' ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>启用</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5" />
                      <span>禁用</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">部门负责人</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">享有下级部门审核与管理权限</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeader(!isLeader)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isLeader
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <Crown className={`w-3.5 h-3.5 ${isLeader ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{isLeader ? '负责人' : '普通成员'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Daily AI Quota Limit */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>每日 AI 算力限额</span>
              </label>
              <span className="text-xs text-slate-400">次日 00:00 自动刷新</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/80 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={customQuotaInput}
                    onChange={(e) => handleCustomQuotaChange(e.target.value)}
                    placeholder="输入算力上限..."
                    className="w-full px-3 py-2 text-sm font-bold font-mono rounded-xl border border-purple-200 bg-white text-purple-900 focus:outline-none focus:border-purple-500 shadow-2xs"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    次/天
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono font-bold text-purple-700 bg-white px-3 py-2 rounded-xl border border-purple-200">
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                  <span>{effectiveLimit}</span>
                  <span className="text-[10px] text-purple-400 font-normal">次/天</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5">
                {[1000, 1500, 2000, 3000, 5000, 10000].map((val) => {
                  const isSelected = Number(customQuotaInput) === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuotaPreset(val)}
                      className={`flex-1 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-purple-200/80 hover:bg-purple-100/50'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              {/* Today's Usage Breakdown */}
              <div className="pt-2 border-t border-purple-100/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    今日已消耗：<strong className="text-slate-800 font-mono">{employee.aiQuotaUsed}</strong> 次
                  </span>
                  <span>
                    剩余：<strong className="text-emerald-700 font-mono">{remaining}</strong> 次
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 cursor-pointer transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>保存设置</span>
          </button>
        </div>

      </div>
    </div>
  );
};
