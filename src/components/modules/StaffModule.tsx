import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, MoreVertical } from 'lucide-react';
import { EmployeeItem, RoleConfig } from '../../types';

interface StaffModuleProps {
  employees: EmployeeItem[];
  roles: RoleConfig[];
  subView: string;
}

export const StaffModule: React.FC<StaffModuleProps> = ({ employees, roles, subView }) => {
  const [activeTab, setActiveTab] = useState<'员工列表' | '角色配置'>(
    subView.includes('角色') ? '角色配置' : '员工列表'
  );

  useEffect(() => {
    if (subView.includes('角色')) {
      setActiveTab('角色配置');
    } else {
      setActiveTab('员工列表');
    }
  }, [subView]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between py-4 mb-2 shrink-0">
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(['员工列表', '角色配置'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button className="h-9 px-4.5 rounded-full bg-[#0F4A47] text-white hover:bg-[#0b3836] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
            <Plus className="w-4 h-4" />
            <span>{activeTab === '员工列表' ? '新增员工账号' : '新增权限角色'}</span>
          </button>
          <button className="h-9 px-4.5 rounded-full bg-[#FFEFEA] text-[#EA3A20] hover:bg-[#ffe3dc] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
            <span>Newest</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === '员工列表' ? (
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold">
                  <th className="py-4.5 pl-6 pr-3 w-12 text-center">
                    <input type="checkbox" className="rounded-md border-slate-300 w-4 h-4" />
                  </th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">员工姓名</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">部门 & 邮箱</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">角色定位</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">AI 算力额度</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">最后活跃</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">状态</th>
                  <th className="py-4.5 pr-6 pl-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-xs">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors h-16">
                    <td className="py-4 pl-6 pr-3 text-center">
                      <input type="checkbox" className="rounded-md border-slate-300 w-4 h-4" />
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{emp.name}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{emp.department}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{emp.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-[11px] bg-[#FFF4F2] text-[#EA3A20] font-bold rounded-full border border-red-100">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-800">{emp.aiQuotaUsed} / {emp.aiQuotaLimit}</span>
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#EA3A20] rounded-full"
                            style={{ width: `${(emp.aiQuotaUsed / emp.aiQuotaLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">{emp.lastActive}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-[10px] bg-[#DDECE8] text-[#2D6A5D] font-bold rounded-full uppercase">
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 pl-2 text-right">
                      <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-slate-900">{role.roleName}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 font-bold rounded-full">
                        {role.userCount} 人使用
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                  </div>
                  <button className="px-4 py-1.5 bg-[#FFF4F2] text-[#EA3A20] hover:bg-[#ffece6] text-xs font-bold rounded-full cursor-pointer transition-colors">
                    配置矩阵
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {role.permissions.map((perm, pIdx) => (
                    <div key={pIdx} className="p-3 bg-slate-50 rounded-2xl text-xs flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-[#EA3A20]" />
                      <span className="truncate font-semibold">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
