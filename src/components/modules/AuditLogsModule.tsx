import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { OperationLog } from '../../types';

interface AuditLogsModuleProps {
  logs: OperationLog[];
  subView: string;
}

export const AuditLogsModule: React.FC<AuditLogsModuleProps> = ({ logs }) => {
  const [activeFilter, setActiveFilter] = useState<'全部日志' | '系统操作' | 'AI 问答' | '推广生成'>('全部日志');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between py-4 mb-2 shrink-0">
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(['全部日志', '系统操作', 'AI 问答', '推广生成'] as const).map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
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

        <button className="h-9 px-4.5 rounded-full bg-[#FFEFEA] text-[#EA3A20] hover:bg-[#ffe3dc] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
          <span>Export Logs</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Area */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold">
                <th className="py-4.5 pl-6 pr-3 w-12 text-center">
                  <input type="checkbox" className="rounded-md border-slate-300 w-4 h-4" />
                </th>
                <th className="py-4.5 px-4 font-bold text-slate-900">时间</th>
                <th className="py-4.5 px-4 font-bold text-slate-900">操作人员</th>
                <th className="py-4.5 px-4 font-bold text-slate-900">角色定位</th>
                <th className="py-4.5 px-4 font-bold text-slate-900">操作模块</th>
                <th className="py-4.5 px-4 font-bold text-slate-900">详细行为描述</th>
                <th className="py-4.5 pr-6 pl-4 font-bold text-slate-900 text-right">IP 地址</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors h-16">
                  <td className="py-4 pl-6 pr-3 text-center">
                    <input type="checkbox" className="rounded-md border-slate-300 w-4 h-4" />
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{log.userName}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-[#FFF4F2] text-[#EA3A20] border border-red-100">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-700">{log.module}</td>
                  <td className="py-4 px-4 text-slate-800 font-medium">{log.detail}</td>
                  <td className="py-4 pr-6 pl-4 font-mono text-slate-400 text-[11px] text-right">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between pt-6 pb-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500">
            Showing {logs.length} of 120 Logs
          </span>
          <div className="flex items-center gap-2">
            <button className="px-4.5 py-1.5 rounded-full border border-[#EA3A20]/40 bg-[#FFF5F2] text-[#EA3A20] text-xs font-bold cursor-pointer">
              Prev
            </button>
            <button className="w-8 h-8 rounded-full bg-[#EA3A20] text-white font-bold text-xs shadow-xs">
              1
            </button>
            <button className="w-8 h-8 rounded-full text-slate-600 font-bold text-xs hover:bg-white">
              2
            </button>
            <button className="px-4.5 py-1.5 rounded-full border border-[#EA3A20]/40 bg-[#FFF5F2] text-[#EA3A20] text-xs font-bold cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
