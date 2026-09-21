import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Cpu,
  Bot,
  Building2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { EmployeeAgentStat } from '../../../types';
import { INITIAL_EMPLOYEE_AGENT_STATS, DEPARTMENT_OPTIONS, AGENT_FILTER_OPTIONS } from '../../../data/employeeAgentData';
import { Pagination } from '../../common/Pagination';

interface EmployeeAgentAnalyticsProps {
  timeMultiplier: number;
  timePeriodLabel: string;
}

const AGENT_COLORS: Record<string, string> = {
  报价商务智能体: '#EA3A20',
  前置处理智能体: '#0F4A47',
  商务文案生成智能体: '#F59E0B',
  工艺质检智能体: '#3B82F6',
  合规风控智能体: '#8B5CF6'
};

export const EmployeeAgentAnalytics: React.FC<EmployeeAgentAnalyticsProps> = ({
  timeMultiplier,
  timePeriodLabel
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('全部智能体');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDept, selectedAgent, searchQuery, timeMultiplier]);

  // Scaled employee data based on timeMultiplier
  const scaledEmployees = useMemo(() => {
    return INITIAL_EMPLOYEE_AGENT_STATS.map((emp) => {
      const scaledCalls = Math.max(1, Math.round(emp.totalCalls * timeMultiplier));
      const scaledTokenCount = Math.round(emp.tokenCountRaw * timeMultiplier);
      const formattedTokens =
        scaledTokenCount >= 1000000
          ? `${(scaledTokenCount / 1000000).toFixed(2)}M`
          : `${Math.round(scaledTokenCount / 1000)}K`;

      const scaledBreakdown = emp.agentBreakdown.map((ab) => {
        const c = Math.max(0, Math.round(ab.calls * timeMultiplier));
        const rawTokens = (ab.calls / emp.totalCalls) * scaledTokenCount;
        const formattedT =
          rawTokens >= 1000000
            ? `${(rawTokens / 1000000).toFixed(2)}M`
            : `${Math.round(rawTokens / 1000)}K`;
        return {
          ...ab,
          calls: c,
          tokens: formattedT
        };
      });

      return {
        ...emp,
        totalCalls: scaledCalls,
        totalTokens: formattedTokens,
        tokenCountRaw: scaledTokenCount,
        agentBreakdown: scaledBreakdown
      };
    });
  }, [timeMultiplier]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    let result = scaledEmployees;

    // Filter by department
    if (selectedDept !== 'all') {
      result = result.filter(
        (emp) => emp.deptCategory === selectedDept || emp.dept.includes(selectedDept)
      );
    }

    // Filter by specific agent
    if (selectedAgent !== '全部智能体') {
      result = result.filter((emp) => {
        const item = emp.agentBreakdown.find((a) => a.agentName === selectedAgent);
        return item && item.calls > 0;
      });
      // Sort by the specific agent's call count
      result = [...result].sort((a, b) => {
        const callsA = a.agentBreakdown.find((x) => x.agentName === selectedAgent)?.calls || 0;
        const callsB = b.agentBreakdown.find((x) => x.agentName === selectedAgent)?.calls || 0;
        return callsB - callsA;
      });
    } else {
      // Sort by total calls
      result = [...result].sort((a, b) => b.totalCalls - a.totalCalls);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.empCode.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q) ||
          emp.dept.toLowerCase().includes(q)
      );
    }

    // Re-assign ranks
    return result.map((emp, index) => ({
      ...emp,
      rank: index + 1
    }));
  }, [scaledEmployees, selectedDept, selectedAgent, searchQuery]);

  // Paginated employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      '排名',
      '员工姓名',
      '工号',
      '所属部门',
      '职务岗位',
      '智能体总调用量',
      'Token消耗量',
      '最常用智能体',
      '任务采纳解决率',
      '活跃天数',
      '最后调用时间',
      '报价商务智能体调用',
      '前置处理智能体调用',
      '商务文案生成智能体调用',
      '工艺质检智能体调用',
      '合规风控智能体调用'
    ];

    const rows = filteredEmployees.map((emp) => {
      const findCalls = (agent: string) =>
        emp.agentBreakdown.find((a) => a.agentName === agent)?.calls || 0;
      return [
        `${emp.rank}`,
        emp.name,
        emp.empCode,
        emp.dept,
        emp.role,
        `${emp.totalCalls}`,
        emp.totalTokens,
        emp.favAgent,
        emp.resolutionRate,
        `${emp.activeDays}天`,
        emp.lastActive,
        `${findCalls('报价商务智能体')}`,
        `${findCalls('前置处理智能体')}`,
        `${findCalls('商务文案生成智能体')}`,
        `${findCalls('工艺质检智能体')}`,
        `${findCalls('合规风控智能体')}`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `员工智能体使用统计_${selectedDept}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`已成功导出「${selectedDept === 'all' ? '全部部门' : selectedDept}」员工智能体使用统计报表`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Query Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Department Pills / Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              部门筛选:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {DEPARTMENT_OPTIONS.map((dept) => {
                const isActive = selectedDept === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#EA3A20] text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100'
                    }`}
                  >
                    {dept.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs shrink-0 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出员工统计报表</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100/80">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Specific Agent Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-slate-400" />
                智能体:
              </span>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="h-8.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] cursor-pointer"
              >
                {AGENT_FILTER_OPTIONS.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Period Tag Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 border border-amber-100 rounded-xl text-[11px] text-amber-800">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>当前周期：{timePeriodLabel}</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索员工姓名、工号或职务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Employee Usage Table with Expandable Row & Pagination */}
      <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              员工智能体使用明细榜单
              {selectedDept !== 'all' && (
                <span className="ml-2 text-xs font-normal text-[#EA3A20] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                  {selectedDept}
                </span>
              )}
            </h3>
            <span className="text-xs text-slate-400">
              按调用量及采纳准确度排序，展示员工对各智能体的具体使用特征
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            共查询到 {filteredEmployees.length} 位员工
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold bg-slate-50/50">
                <th className="py-4 pl-6 pr-3 w-16 text-center">排名</th>
                <th className="py-4 px-4 font-bold text-slate-900">员工信息</th>
                <th className="py-4 px-4 font-bold text-slate-900">所属部门</th>
                <th className="py-4 px-4 font-bold text-slate-900">职务角色</th>
                <th className="py-4 px-4 font-bold text-slate-900">总调用量</th>
                <th className="py-4 px-4 font-bold text-slate-900">Token消耗</th>
                <th className="py-4 px-4 font-bold text-slate-900">最常用智能体</th>
                <th className="py-4 px-4 font-bold text-slate-900">任务解决率</th>
                <th className="py-4 px-4 font-bold text-slate-900">最后调用时间</th>
                <th className="py-4 pr-6 pl-4 font-bold text-slate-900 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {paginatedEmployees.map((emp) => {
                const isExpanded = expandedEmployeeId === emp.id;
                return (
                  <React.Fragment key={emp.id}>
                    <tr
                      onClick={() => setExpandedEmployeeId(isExpanded ? null : emp.id)}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-50/80' : ''
                      }`}
                    >
                      <td className="py-4 pl-6 pr-3 text-center">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                            emp.rank === 1
                              ? 'bg-orange-100 text-[#EA3A20]'
                              : emp.rank === 2
                              ? 'bg-slate-200 text-slate-700'
                              : emp.rank === 3
                              ? 'bg-amber-100 text-amber-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {emp.rank}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                            {emp.name.slice(0, 1)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{emp.name}</span>
                            <span className="font-mono text-[11px] text-slate-400">{emp.empCode}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                          {emp.dept}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-600 font-medium">{emp.role}</td>

                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {emp.totalCalls.toLocaleString()} 次
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-700">{emp.totalTokens}</td>

                      <td className="py-4 px-4">
                        <span
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold border"
                          style={{
                            backgroundColor: `${AGENT_COLORS[emp.favAgent] || '#EA3A20'}15`,
                            color: AGENT_COLORS[emp.favAgent] || '#EA3A20',
                            borderColor: `${AGENT_COLORS[emp.favAgent] || '#EA3A20'}30`
                          }}
                        >
                          {emp.favAgent}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {emp.resolutionRate}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                        {emp.lastActive}
                      </td>

                      <td className="py-4 pr-6 pl-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedEmployeeId(isExpanded ? null : emp.id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#EA3A20] hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? '收起' : '详情'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable row: Breakdown of 5 agents for this employee */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90">
                        <td colSpan={10} className="py-4 px-6">
                          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-[#EA3A20]" />
                                <span className="font-bold text-xs text-slate-900">
                                  {emp.name}（{emp.empCode}）各智能体调用明细
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                累计活跃 {emp.activeDays} 天 · 人均日调用 {(emp.totalCalls / emp.activeDays).toFixed(1)} 次
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                              {emp.agentBreakdown.map((agent) => (
                                <div
                                  key={agent.agentName}
                                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                      {agent.agentName}
                                    </span>
                                    <span
                                      className="w-2 h-2 rounded-full shrink-0"
                                      style={{ backgroundColor: AGENT_COLORS[agent.agentName] || '#EA3A20' }}
                                    />
                                  </div>
                                  <div className="text-base font-black text-slate-900 font-mono">
                                    {agent.calls.toLocaleString()}{' '}
                                    <span className="text-[11px] font-normal text-slate-400">次</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                                    <span>Token: {agent.tokens}</span>
                                    <span className="text-emerald-600 font-medium">{agent.resolutionRate}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    响应耗时: {agent.avgLatency}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    未找到符合条件的员工智能体使用数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredEmployees.length > 0 && (
          <div className="border-t border-slate-100 p-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredEmployees.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              itemUnit="人"
            />
          </div>
        )}
      </div>
    </div>
  );
};
