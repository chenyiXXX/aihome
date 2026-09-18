import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Building2,
  Shield,
  Check,
  UserCheck,
  UserX,
  ChevronDown,
  MessageSquare,
  Search
} from 'lucide-react';
import { EmployeeItem, RoleConfig, WhatsAppAccount } from '../../../types';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeItem | null;
  roles: RoleConfig[];
  whatsAppAccounts?: WhatsAppAccount[];
  initialTab?: 'auth' | 'quota';
  onSaveEmployee: (updated: EmployeeItem) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  roles,
  whatsAppAccounts = [],
  onSaveEmployee
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['销售业务员']);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [selectedWaId, setSelectedWaId] = useState<string>('');
  const [isWaDropdownOpen, setIsWaDropdownOpen] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'启用' | '已禁用'>('启用');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const waDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (employee) {
      if (employee.role) {
        const rolesList = employee.role.split(',').map((s) => s.trim()).filter(Boolean);
        setSelectedRoles(rolesList.length > 0 ? rolesList : ['销售业务员']);
      } else {
        setSelectedRoles(['销售业务员']);
      }
      setAccountStatus(employee.status === '已禁用' ? '已禁用' : '启用');
      setSelectedWaId(employee.whatsappAccountId || '');
    }
  }, [employee, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (waDropdownRef.current && !waDropdownRef.current.contains(e.target as Node)) {
        setIsWaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen || !employee) return null;

  const toggleRole = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      if (selectedRoles.length === 1) {
        return; // Keep at least one role
      }
      setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  const handleSave = () => {
    const targetWa = whatsAppAccounts.find((w) => w.id === selectedWaId);
    onSaveEmployee({
      ...employee,
      role: selectedRoles.join(', '),
      roles: selectedRoles,
      status: accountStatus,
      whatsappAccountId: selectedWaId || undefined,
      whatsappPhone: targetWa ? targetWa.phone : undefined,
      whatsappAccountName: targetWa ? targetWa.name : undefined
    });
    onClose();
  };

  const currentBoundWa = whatsAppAccounts.find((w) => w.id === selectedWaId);

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
          
          {/* Section 1: Role Assignment (Multi-select Dropdown) */}
          <div className="space-y-3 relative" ref={dropdownRef}>
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Shield className="w-4 h-4 text-[#EA3A20]" />
                <span>分配系统角色</span>
              </label>
              <span className="text-slate-400 text-xs">已选 {selectedRoles.length} 个角色</span>
            </div>

            <div className="relative">
              <div
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-1.5 flex-wrap min-h-[24px]">
                  {selectedRoles.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EA3A20]/10 text-[#EA3A20] font-bold rounded-lg border border-[#EA3A20]/20 text-[11px]"
                    >
                      {r}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRole(r);
                        }}
                        className="hover:bg-[#EA3A20]/20 rounded-full p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    </span>
                  ))}
                  {selectedRoles.length === 0 && (
                    <span className="text-slate-400">请选择系统角色（支持多选）...</span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden flex flex-col max-h-72">
                  <div className="p-2 border-b border-slate-100 bg-slate-50/70">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={roleSearchQuery}
                        onChange={(e) => setRoleSearchQuery(e.target.value)}
                        placeholder="搜索角色名称或职能..."
                        className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#EA3A20]"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <span>系统角色列表（可勾选多个）</span>
                    <span className="text-[#EA3A20]">已选 {selectedRoles.length} 个</span>
                  </div>
                  <div className="overflow-y-auto custom-scrollbar p-1 space-y-0.5 max-h-52">
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
                        const isChecked = selectedRoles.includes(r.roleName);
                        return (
                          <div
                            key={r.id}
                            onClick={() => toggleRole(r.roleName)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors ${
                              isChecked ? 'bg-red-50/50 text-[#EA3A20] font-bold' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                                  isChecked ? 'border-[#EA3A20] bg-[#EA3A20] text-white' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-xs truncate">{r.roleName}</div>
                                <div className="text-[10px] text-slate-400 font-normal truncate">{r.description}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: WhatsApp Account Binding (1-to-1) */}
          <div className="space-y-3 pt-1" ref={waDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>绑定 WhatsApp 账号</span>
              </label>
              <span className="text-slate-400 text-xs">1对1 独占绑定业务专线</span>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <div
                  onClick={() => setIsWaDropdownOpen(!isWaDropdownOpen)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-2xs"
                >
                  {currentBoundWa ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{currentBoundWa.name}</div>
                        <div className="text-[11px] font-mono text-emerald-700 mt-0.5">{currentBoundWa.phone}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400">暂未绑定 WhatsApp 账号（点击展开下拉选择）...</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isWaDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {selectedWaId && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWaId('');
                      setIsWaDropdownOpen(false);
                    }}
                    className="w-10 h-10 rounded-2xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 hover:border-rose-300 text-rose-500 hover:text-rose-700 flex items-center justify-center shrink-0 transition-all shadow-2xs cursor-pointer group/cancel"
                    title="取消绑定 / 绑定错误解绑"
                  >
                    <X className="w-4 h-4 stroke-[2.5] group-hover/cancel:scale-110 transition-transform" />
                  </button>
                )}
              </div>

              {/* Dropdown Menu */}
              {isWaDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden py-2 max-h-60 overflow-y-auto custom-scrollbar">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>选择企业 WhatsApp 客服/销售账号</span>
                    {selectedWaId && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWaId('');
                          setIsWaDropdownOpen(false);
                        }}
                        className="text-red-500 hover:text-red-700 text-[11px] cursor-pointer font-medium"
                      >
                        解除绑定
                      </button>
                    )}
                  </div>

                  {/* Option: Unbind */}
                  <div
                    onClick={() => {
                      setSelectedWaId('');
                      setIsWaDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !selectedWaId ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    <span className="text-xs">暂不绑定（恢复为未绑定状态）</span>
                    {!selectedWaId && <Check className="w-4 h-4 text-slate-600" />}
                  </div>

                  {/* WhatsApp list - 未被绑定的放在前面 */}
                  {[...whatsAppAccounts]
                    .sort((a, b) => {
                      const aBound = Boolean(a.boundEmployeeId);
                      const bBound = Boolean(b.boundEmployeeId);
                      if (!aBound && bBound) return -1;
                      if (aBound && !bBound) return 1;
                      return 0;
                    })
                    .map((wa) => {
                    const isSelected = selectedWaId === wa.id;
                    const isBoundToOther = Boolean(wa.boundEmployeeId && wa.boundEmployeeId !== employee.id);

                    return (
                      <div
                        key={wa.id}
                        onClick={() => {
                          setSelectedWaId(wa.id);
                          setIsWaDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/70 text-emerald-950 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <span>{wa.name}</span>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${wa.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {wa.phone}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
                              <Check className="w-3 h-3" />
                              当前选择
                            </span>
                          ) : isBoundToOther ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">
                              已绑：{wa.boundEmployeeName} (选择将转移)
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
              )}
            </div>
          </div>

          {/* Section 3: Account Status */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>账号与管理属性</span>
              </label>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">账号状态</div>
                <div className="text-slate-400 text-[11px] mt-0.5">控制该员工是否可登录系统</div>
              </div>
              <button
                type="button"
                onClick={() => setAccountStatus(accountStatus === '启用' ? '已禁用' : '启用')}
                className={`px-4 py-2 rounded-xl font-bold text-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  accountStatus === '启用'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {accountStatus === '启用' ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>启用</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>禁用</span>
                  </>
                )}
              </button>
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
