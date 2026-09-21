import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Download,
  ArrowUpRight,
  Cpu,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { AgentStatMetric } from '../../types';
import { TimeRangeFilterBar } from './analytics/TimeRangeFilterBar';
import { EmployeeAgentAnalytics } from './analytics/EmployeeAgentAnalytics';
import { UserSystemUsageAnalytics } from './analytics/UserSystemUsageAnalytics';
import {
  TimeFilterState,
  INITIAL_TIME_FILTER,
  getTimePeriodLabel,
  getTimeMultiplier,
  getAgentTrendData
} from './analytics/analyticsTimeUtils';

interface AnalyticsModuleProps {
  statsData?: AgentStatMetric[];
  subView: string;
}

// Base Agent Performance Data
const BASE_AGENT_PERFORMANCE_LIST = [
  {
    rank: 1,
    name: '报价商务智能体',
    domain: '销售外贸',
    baseCalls: 3030,
    baseTokens: 4320000,
    avgLatency: '2.1s',
    resolutionRate: '98.4%',
    status: '运行中'
  },
  {
    rank: 2,
    name: '前置处理智能体',
    domain: '售前接待',
    baseCalls: 2358,
    baseTokens: 3180000,
    avgLatency: '1.8s',
    resolutionRate: '96.7%',
    status: '运行中'
  },
  {
    rank: 3,
    name: '商务文案生成智能体',
    domain: '营销推广',
    baseCalls: 1684,
    baseTokens: 2860000,
    avgLatency: '3.2s',
    resolutionRate: '95.8%',
    status: '运行中'
  },
  {
    rank: 4,
    name: '工艺质检智能体',
    domain: '研发设计',
    baseCalls: 842,
    baseTokens: 1420000,
    avgLatency: '2.6s',
    resolutionRate: '97.5%',
    status: '运行中'
  },
  {
    rank: 5,
    name: '合规风控智能体',
    domain: '关务风控',
    baseCalls: 506,
    baseTokens: 1020000,
    avgLatency: '1.9s',
    resolutionRate: '99.1%',
    status: '运行中'
  }
];

// Agent Share Distribution Data
const AGENT_SHARE_DATA = [
  { name: '报价商务智能体', value: 36, color: '#EA3A20' },
  { name: '前置处理智能体', value: 28, color: '#0F4A47' },
  { name: '商务文案生成智能体', value: 20, color: '#F59E0B' },
  { name: '工艺质检智能体', value: 10, color: '#3B82F6' },
  { name: '合规风控智能体', value: 6, color: '#8B5CF6' }
];

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ subView }) => {
  // Time filter state
  const [timeFilter, setTimeFilter] = useState<TimeFilterState>(INITIAL_TIME_FILTER);

  // Search query & Toast
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isUserAnalytics = subView === '用户使用系统统计';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Time multiplier & label
  const timeMultiplier = useMemo(() => getTimeMultiplier(timeFilter), [timeFilter]);
  const timePeriodLabel = useMemo(() => getTimePeriodLabel(timeFilter), [timeFilter]);

  // Scaled agent performance list
  const scaledAgentList = useMemo(() => {
    return BASE_AGENT_PERFORMANCE_LIST.map((agent) => {
      const calls = Math.max(1, Math.round(agent.baseCalls * timeMultiplier));
      const tokensRaw = Math.round(agent.baseTokens * timeMultiplier);
      const tokens =
        tokensRaw >= 1000000
          ? `${(tokensRaw / 1000000).toFixed(2)}M`
          : `${Math.round(tokensRaw / 1000)}K`;
      return {
        ...agent,
        callCount: calls,
        tokens
      };
    });
  }, [timeMultiplier]);

  // Filtered Agent List
  const filteredAgentList = useMemo(() => {
    if (!searchQuery.trim()) return scaledAgentList;
    const q = searchQuery.toLowerCase();
    return scaledAgentList.filter(
      (a) => a.name.toLowerCase().includes(q) || a.domain.toLowerCase().includes(q)
    );
  }, [scaledAgentList, searchQuery]);

  // Dynamic trend data
  const agentDailyTrends = useMemo(() => {
    return getAgentTrendData(timeFilter);
  }, [timeFilter]);

  // KPI Metrics calculation
  const kpiMetrics = useMemo(() => {
    const totalCalls = Math.round(8420 * timeMultiplier);
    const tokensRaw = Math.round(12800000 * timeMultiplier);
    const tokens =
      tokensRaw >= 1000000000
        ? `${(tokensRaw / 1000000000).toFixed(2)}B`
        : tokensRaw >= 1000000
        ? `${(tokensRaw / 1000000).toFixed(1)}M`
        : `${Math.round(tokensRaw / 1000)}K`;

    return {
      totalCalls,
      resolutionRate: '97.4%',
      tokens,
      avgLatency: '2.3s'
    };
  }, [timeMultiplier]);

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['排名', '智能体名称', '所属业务域', '调用次数', 'Token消耗', '平均响应耗时', '任务解决率', '状态'];
    const rows = filteredAgentList.map((a) => [
      `${a.rank}`,
      a.name,
      a.domain,
      `${a.callCount}`,
      a.tokens,
      a.avgLatency,
      a.resolutionRate,
      a.status
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `智能体效能统计_${timeFilter.mode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`已成功导出智能体统计报表 (${timePeriodLabel})`);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full overflow-y-auto custom-scrollbar px-8 pb-16 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & SubView Info */}
      <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {isUserAnalytics ? '用户使用系统统计' : '智能体数据统计'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-[#EA3A20] border border-red-100">
              数据看板
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isUserAnalytics
              ? '深度统计企业各部门及员工登录系统时长、日常访问频次、24小时活跃时段热度及各模块投入明细'
              : '实时监测 AI 智能体集群响应负载、任务采纳率及企业各部门员工调用明细数据'}
          </p>
        </div>
      </div>

      {/* Unified Time Range Filter Bar (近7天、近30天、指定日期范围、指定月份、指定季节、指定年份、全周期) */}
      <TimeRangeFilterBar filter={timeFilter} onChange={setTimeFilter} />

      {/* Main Content Area */}
      {!isUserAnalytics ? (
        <div className="space-y-6">
          {/* 1. KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                智能体总调用量
              </span>
              <div className="text-3xl font-black text-slate-900 font-sans">
                {kpiMetrics.totalCalls.toLocaleString()} <span className="text-sm font-medium text-slate-400">次</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" /> 21.4% 较上周期提升
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                任务解决采纳率
              </span>
              <div className="text-3xl font-black text-[#EA3A20] font-sans">
                {kpiMetrics.resolutionRate}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" /> 3.8% 模型采纳率提升
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                Token 消耗总量
              </span>
              <div className="text-3xl font-black text-slate-900 font-sans">
                {kpiMetrics.tokens} <span className="text-sm font-medium text-slate-400">tokens</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                单次平均 1.52K tokens
              </span>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                平均响应耗时
              </span>
              <div className="text-3xl font-black text-[#0F4A47] font-sans">
                {kpiMetrics.avgLatency}
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                流式首字输出 &lt; 450ms
              </span>
            </div>
          </div>

          {/* 2. Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Line Chart */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">核心智能体日调用量走势</h3>
                  <span className="text-xs text-slate-400">
                    统计周期：{timePeriodLabel}
                  </span>
                </div>
              </div>
              <div className="h-68 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={agentDailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="报价商务" stroke="#EA3A20" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="前置处理" stroke="#0F4A47" strokeWidth={2} />
                    <Line type="monotone" dataKey="商务文案" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="工艺质检" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Donut Chart */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">智能体调用份额占比</h3>
                <span className="text-xs text-slate-400">各业务智能体任务分布</span>
              </div>
              <div className="h-68 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={AGENT_SHARE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {AGENT_SHARE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 3. 智能体效能与负载明细表 */}
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">智能体效能与负载明细表</h3>
                <span className="text-xs text-slate-400">
                  按当前周期（{timePeriodLabel}）综合调用量及解决准确度排序
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索智能体名称或业务域..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8.5 pl-9 pr-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20]"
                  />
                </div>

                <button
                  onClick={handleExportCSV}
                  className="h-8.5 px-3.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出报表</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold bg-slate-50/50">
                    <th className="py-4 pl-6 pr-3 w-16 text-center">排名</th>
                    <th className="py-4 px-4 font-bold text-slate-900">智能体名称</th>
                    <th className="py-4 px-4 font-bold text-slate-900">所属业务域</th>
                    <th className="py-4 px-4 font-bold text-slate-900">总调用量</th>
                    <th className="py-4 px-4 font-bold text-slate-900">Token 消耗总量</th>
                    <th className="py-4 px-4 font-bold text-slate-900">平均耗时</th>
                    <th className="py-4 px-4 font-bold text-slate-900">任务解决率</th>
                    <th className="py-4 pr-6 pl-4 font-bold text-slate-900 text-right">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-xs">
                  {filteredAgentList.map((agent) => (
                    <tr key={agent.rank} className="hover:bg-slate-50/70 transition-colors h-14">
                      <td className="py-4 pl-6 pr-3 text-center">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                            agent.rank === 1
                              ? 'bg-orange-100 text-[#EA3A20]'
                              : agent.rank === 2
                              ? 'bg-slate-200 text-slate-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {agent.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-[#EA3A20]" />
                          <span className="font-bold text-slate-900">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">{agent.domain}</td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {agent.callCount.toLocaleString()} 次
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-700">{agent.tokens}</td>
                      <td className="py-4 px-4 font-mono text-slate-500">{agent.avgLatency}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {agent.resolutionRate}
                        </span>
                      </td>
                      <td className="py-4 pr-6 pl-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {agent.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredAgentList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        未找到匹配的智能体数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. 员工对智能体调用的明细表（直接展示在智能体效能和负载明细表下方，支持按部门查询） */}
          <div className="pt-2">
            <EmployeeAgentAnalytics
              timeMultiplier={timeMultiplier}
              timePeriodLabel={timePeriodLabel}
            />
          </div>
        </div>
      ) : (
        /* 用户使用系统统计视图（时长、频率与时段分布维度） */
        <UserSystemUsageAnalytics
          timeFilter={timeFilter}
          timeMultiplier={timeMultiplier}
          timePeriodLabel={timePeriodLabel}
        />
      )}
    </div>
  );
};
