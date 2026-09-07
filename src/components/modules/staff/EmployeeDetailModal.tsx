import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  Shield,
  Cpu,
  Check,
  AlertCircle,
  Crown,
  Lock,
  Database,
  Sliders,
  Zap,
  TrendingUp,
  UserCheck
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
  initialTab = 'auth',
  onSaveEmployee
}) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'quota'>('auth');
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
      setActiveTab(initialTab);
    }
  }, [employee, isOpen, initialTab]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 via-white to-slate-50 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {employee.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{employee.name}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  企微认证
                </span>
                {isLeader && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Crown className="w-3 h-3 text-amber-600" />
                    部门负责人
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span>企微ID: <strong className="text-slate-700">{employee.wecomUserId || employee.id}</strong></span>
                <span>·</span>
                <span>所属部门: <strong className="text-slate-700">{employee.department}</strong></span>
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

        {/* Tab Navigation (授权 VS 算力配置) */}
        <div className="px-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('auth')}
            className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'auth'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>角色与权限授权</span>
          </button>

          <button
            onClick={() => setActiveTab('quota')}
            className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'quota'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>每日 AI 算力配置</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700 font-mono">
              {customQuotaInput || quotaLimit}次/天
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs flex-1">
          
          {/* Universal Quick Toggles (部门负责人 & 账号启用状态) */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            
            {/* 部门负责人: 是或否 */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 ${isLeader ? 'text-amber-600' : 'text-slate-400'}`} />
                <div>
                  <div className="font-bold text-slate-800">部门负责人</div>
                  <div className="text-[10px] text-slate-400">是否担任本部门主管负责人</div>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLeader(true)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    isLeader
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  是
                </button>
                <button
                  type="button"
                  onClick={() => setIsLeader(false)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    !isLeader
                      ? 'bg-slate-300 text-slate-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  否
                </button>
              </div>
            </div>

            {/* 状态: 启用或禁用 */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <UserCheck className={`w-4 h-4 ${accountStatus === '启用' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <div className="font-bold text-slate-800">账号访问状态</div>
                  <div className="text-[10px] text-slate-400">
                    {accountStatus === '启用' ? '正常登录系统' : '已被禁用禁止登录'}
                  </div>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setAccountStatus('启用')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    accountStatus === '启用'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  启用
                </button>
                <button
                  type="button"
                  onClick={() => setAccountStatus('已禁用')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    accountStatus === '已禁用'
                      ? 'bg-red-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  禁用
                </button>
              </div>
            </div>

          </div>

          {/* TAB 1: 角色与权限授权 */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              
              {/* Role Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#EA3A20]" />
                    授予系统业务角色 (分配功能权限与角色模板)
                  </label>
                  <span className="text-[11px] text-slate-400">选择对应预设角色</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {roles.map((r) => {
                    const isSelected = selectedRole === r.roleName;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRole(r.roleName)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#EA3A20] bg-red-50/40 shadow-xs'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{r.roleName}</span>
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
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
              </div>

              {/* Data Scope & Permission details */}
              {currentRoleObj?.dataPermission && (
                <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2 text-slate-700">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-bold text-blue-900">
                      <Database className="w-3.5 h-3.5 text-blue-600" />
                      当前角色绑定的数据隔离作用域：
                    </span>
                    <span className="font-bold text-blue-800 px-2 py-0.5 bg-white rounded-md border border-blue-200">
                      {currentRoleObj.dataPermission.scopeLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="p-2 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
                      <span className="text-slate-500">客户联系方式脱敏：</span>
                      <span className={currentRoleObj.dataPermission.maskCustomerContact ? "font-bold text-amber-600" : "font-bold text-emerald-600"}>
                        {currentRoleObj.dataPermission.maskCustomerContact ? '已开启脱敏' : '明文可见'}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
                      <span className="text-slate-500">出厂成本与底价毛利：</span>
                      <span className={currentRoleObj.dataPermission.maskCostPrice ? "font-bold text-amber-600" : "font-bold text-emerald-600"}>
                        {currentRoleObj.dataPermission.maskCostPrice ? '隐藏保护' : '完全可见'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* WeCom Sync Information Source */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    企业微信同步档案
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    同步时间: {employee.wecomSyncTime || '今日 15:30:22'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-400">企微职位：</span>
                    <span className="font-medium text-slate-800 ml-1">{employee.wecomPosition || '产品研发顾问'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-400">企微手机：</span>
                    <span className="font-mono font-medium text-slate-800 ml-1">{employee.wecomMobile || '138****0000'}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 每日 AI 算力配置 */}
          {activeTab === 'quota' && (
            <div className="space-y-4">
              
              {/* Daily Quota Limit Input & Presets */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    每日 AI 算力限额设置
                  </label>
                  <div className="flex items-center gap-1 font-mono font-bold text-purple-700 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    <span>{customQuotaInput || quotaLimit}</span>
                    <span className="text-[10px] text-purple-400">次/天</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={customQuotaInput}
                      onChange={(e) => handleCustomQuotaChange(e.target.value)}
                      placeholder="自定义算力点数上限..."
                      className="w-full px-3 py-2 text-sm font-bold font-mono rounded-xl border border-purple-200 bg-white text-purple-900 focus:outline-none focus:border-purple-500 shadow-2xs"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                      次/天
                    </span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <div className="text-[10px] text-slate-400 mb-1.5 font-medium">常用算力档位快速选择：</div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[1000, 1500, 2000, 3000, 5000, 10000].map((val) => {
                      const isSelected = Number(customQuotaInput) === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleQuotaPreset(val)}
                          className={`py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-colors cursor-pointer text-center ${
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
                </div>
              </div>

              {/* Usage Stats Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    今日算力使用概况
                  </span>
                  <span className="text-[11px] text-slate-400">每日 00:00 自动刷新限额</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <div className="text-slate-400 mb-1">今日已消耗</div>
                    <div className="font-mono text-base font-bold text-slate-800">
                      {employee.aiQuotaUsed} <span className="text-[10px] font-normal text-slate-400">次</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <div className="text-slate-400 mb-1">今日可用限额</div>
                    <div className="font-mono text-base font-bold text-purple-600">
                      {customQuotaInput || quotaLimit} <span className="text-[10px] font-normal text-purple-400">次</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <div className="text-slate-400 mb-1">剩余可用余量</div>
                    <div className="font-mono text-base font-bold text-emerald-600">
                      {Math.max(0, (Number(customQuotaInput) || quotaLimit) - employee.aiQuotaUsed)} <span className="text-[10px] font-normal text-emerald-400">次</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>消耗进度</span>
                    <span>{Math.round((employee.aiQuotaUsed / Math.max(1, Number(customQuotaInput) || quotaLimit)) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((employee.aiQuotaUsed / Math.max(1, Number(customQuotaInput) || quotaLimit)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Over-quota policy */}
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">超限保护策略说明</div>
                  <div className="text-[10px] text-amber-700/90 mt-0.5">
                    当员工单日 AI 算力消耗达到上限后，AI 智能助手将自动转为提示「今日算力额度已耗尽」，可通过主管审批申请临时追加算力或等待次日重置。
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="text-[11px] text-slate-400">
            {activeTab === 'auth' ? '正在配置：系统角色与数据作用域' : '正在配置：每日 AI 算力限额'}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 cursor-pointer transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>保存配置</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
