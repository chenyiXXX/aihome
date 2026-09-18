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
  Bot,
  Users,
  Cpu,
  Clock,
  CheckCircle2,
  Activity,
  Layers,
  Search,
  Sparkles
} from 'lucide-react';
import { AgentStatMetric } from '../../types';

interface AnalyticsModuleProps {
  statsData?: AgentStatMetric[];
  subView: string;
}

// Mock Daily Trend Data for 智能体统计
const AGENT_DAILY_TRENDS = [
  { date: '09-11', 报价商务: 380, 前置处理: 310, 商务文案: 220, 工艺质检: 110, 解决率: 95.8 },
  { date: '09-12', 报价商务: 420, 前置处理: 340, 商务文案: 250, 工艺质检: 125, 解决率: 96.2 },
  { date: '09-13', 报价商务: 450, 前置处理: 360, 商务文案: 240, 工艺质检: 130, 解决率: 96.5 },
  { date: '09-14', 报价商务: 390, 前置处理: 300, 商务文案: 210, 工艺质检: 105, 解决率: 97.0 },
  { date: '09-15', 报价商务: 460, 前置处理: 350, 商务文案: 260, 工艺质检: 140, 解决率: 97.1 },
  { date: '09-16', 报价商务: 510, 前置处理: 390, 商务文案: 280, 工艺质检: 155, 解决率: 97.5 },
  { date: '09-17', 报价商务: 560, 前置处理: 420, 商务文案: 310, 工艺质检: 170, 解决率: 98.2 },
];

// Agent Share Distribution Data
const AGENT_SHARE_DATA = [
  { name: '报价商务智能体', value: 36, color: '#EA3A20' },
  { name: '前置处理智能体', value: 28, color: '#0F4A47' },
  { name: '商务文案生成智能体', value: 20, color: '#F59E0B' },
  { name: '工艺质检智能体', value: 10, color: '#3B82F6' },
  { name: '合规风控智能体', value: 6, color: '#8B5CF6' }
];

// Agent Performance Ranking
const AGENT_PERFORMANCE_LIST = [
  {
    rank: 1,
    name: '报价商务智能体',
    domain: '销售外贸',
    callCount: 3030,
    tokens: '4.32M',
    avgLatency: '2.1s',
    resolutionRate: '98.4%',
    status: '运行中'
  },
  {
    rank: 2,
    name: '前置处理智能体',
    domain: '售前接待',
    callCount: 2358,
    tokens: '3.18M',
    avgLatency: '1.8s',
    resolutionRate: '96.7%',
    status: '运行中'
  },
  {
    rank: 3,
    name: '商务文案生成智能体',
    domain: '营销推广',
    callCount: 1684,
    tokens: '2.86M',
    avgLatency: '3.2s',
    resolutionRate: '95.8%',
    status: '运行中'
  },
  {
    rank: 4,
    name: '工艺质检智能体',
    domain: '研发设计',
    callCount: 842,
    tokens: '1.42M',
    avgLatency: '2.6s',
    resolutionRate: '97.5%',
    status: '运行中'
  },
  {
    rank: 5,
    name: '合规风控智能体',
    domain: '关务风控',
    callCount: 506,
    tokens: '1.02M',
    avgLatency: '1.9s',
    resolutionRate: '99.1%',
    status: '运行中'
  }
];

// Mock User Usage Trends
const USER_USAGE_TRENDS = [
  { date: '09-11', 销售外贸: 340, 市场运营: 180, 设计研发: 120, 活跃人数: 38 },
  { date: '09-12', 销售外贸: 370, 市场运营: 200, 设计研发: 135, 活跃人数: 41 },
  { date: '09-13', 销售外贸: 410, 市场运营: 210, 设计研发: 140, 活跃人数: 44 },
  { date: '09-14', 销售外贸: 350, 市场运营: 170, 设计研发: 110, 活跃人数: 36 },
  { date: '09-15', 销售外贸: 430, 市场运营: 230, 设计研发: 155, 活跃人数: 45 },
  { date: '09-16', 销售外贸: 480, 市场运营: 250, 设计研发: 170, 活跃人数: 47 },
  { date: '09-17', 销售外贸: 530, 市场运营: 270, 设计研发: 190, 活跃人数: 48 },
];

// Department Share Data
const DEPT_SHARE_DATA = [
  { name: '销售外贸部', value: 46, color: '#EA3A20' },
  { name: '市场运营部', value: 24, color: '#0F4A47' },
  { name: '设计研发部', value: 18, color: '#F59E0B' },
  { name: '供应链与采购部', value: 12, color: '#3B82F6' }
];

// User Activity Ranking
const USER_ACTIVITY_LIST = [
  {
    rank: 1,
    name: 'Alex Schmidt',
    role: '销售业务员',
    dept: '销售外贸部',
    calls: 864,
    tokens: '1.25M',
    activeDays: '28 天',
    favAgent: '报价商务智能体',
    lastActive: '2026-09-17 20:10'
  },
  {
    rank: 2,
    name: 'Sophia Wang',
    role: '外贸主管',
    dept: '销售外贸部',
    calls: 720,
    tokens: '980K',
    activeDays: '26 天',
    favAgent: '前置处理智能体',
    lastActive: '2026-09-17 19:15'
  },
  {
    rank: 3,
    name: 'Elena Rostova',
    role: '营销专家',
    dept: '市场运营部',
    calls: 592,
    tokens: '860K',
    activeDays: '24 天',
    favAgent: '商务文案生成智能体',
    lastActive: '2026-09-17 15:45'
  },
  {
    rank: 4,
    name: '李工',
    role: '资深木作工艺师',
    dept: '设计研发部',
    calls: 430,
    tokens: '620K',
    activeDays: '21 天',
    favAgent: '工艺质检智能体',
    lastActive: '2026-09-16 11:20'
  },
  {
    rank: 5,
    name: 'Chen Yi (陈总)',
    role: '超级管理员',
    dept: '总经办',
    calls: 310,
    tokens: '480K',
    activeDays: '19 天',
    favAgent: '报价商务智能体',
    lastActive: '2026-09-17 20:52'
  },
  {
    rank: 6,
    name: 'Marco Rossi',
    role: '海外大客户经理',
    dept: '销售外贸部',
    calls: 280,
    tokens: '410K',
    activeDays: '18 天',
    favAgent: '报价商务智能体',
    lastActive: '2026-09-17 14:05'
  }
];

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ subView }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isUserAnalytics = subView === '用户使用系统统计';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered Agent List
  const filteredAgentList = useMemo(() => {
    if (!searchQuery.trim()) return AGENT_PERFORMANCE_LIST;
    const q = searchQuery.toLowerCase();
    return AGENT_PERFORMANCE_LIST.filter(
      (a) => a.name.toLowerCase().includes(q) || a.domain.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered User List
  const filteredUserList = useMemo(() => {
    if (!searchQuery.trim()) return USER_ACTIVITY_LIST;
    const q = searchQuery.toLowerCase();
    return USER_ACTIVITY_LIST.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.dept.toLowerCase().includes(q) ||
        u.favAgent.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Export CSV Report
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (!isUserAnalytics) {
      headers = ['排名', '智能体名称', '所属业务域', '调用次数', 'Token消耗', '平均响应耗时', '任务解决率', '状态'];
      rows = filteredAgentList.map((a) => [
        `${a.rank}`,
        a.name,
        a.domain,
        `${a.callCount}`,
        a.tokens,
        a.avgLatency,
        a.resolutionRate,
        a.status
      ]);
    } else {
      headers = ['排名', '用户姓名', '角色', '所属部门', '调用次数', 'Token消耗', '活跃天数', '高频使用智能体', '最后活跃时间'];
      rows = filteredUserList.map((u) => [
        `${u.rank}`,
        u.name,
        u.role,
        u.dept,
        `${u.calls}`,
        u.tokens,
        u.activeDays,
        u.favAgent,
        u.lastActive
      ]);
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${isUserAnalytics ? '用户使用系统统计' : '智能体统计'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`已成功导出 ${isUserAnalytics ? '用户使用系统统计' : '智能体统计'} 报表`);
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

      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 mb-2 shrink-0 gap-4">
        {/* Time Preset Pills */}
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(
            [
              { key: '7d', label: '近 7 天' },
              { key: '30d', label: '近 30 天' },
              { key: 'all', label: '全周期' },
            ] as const
          ).map((item) => {
            const isActive = timeRange === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTimeRange(item.key)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Search & Export */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isUserAnalytics ? '搜索姓名、角色或部门...' : '搜索智能体名称或业务域...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20]"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="h-9 px-4 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs shrink-0 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出报表</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 智能体统计 */}
      {!isUserAnalytics && (
        <>
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                智能体总调用量
              </span>
              <div className="text-3xl font-black text-slate-900 font-sans">
                8,420 <span className="text-sm font-medium text-slate-400">次</span>
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
                97.2%
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
                12.8M <span className="text-sm font-medium text-slate-400">tokens</span>
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
                2.4s
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                流式首字输出 &lt; 450ms
              </span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Line Chart */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">核心智能体日调用量走势</h3>
                  <span className="text-xs text-slate-400">各智能体交互频次及解决率变化</span>
                </div>
              </div>
              <div className="h-68 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={AGENT_DAILY_TRENDS}>
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

          {/* Performance Table */}
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">智能体效能与负载明细表</h3>
                <span className="text-xs text-slate-400">按调用量及解决准确度综合排序</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">共 5 个系统智能体</span>
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
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                          agent.rank === 1 ? 'bg-orange-100 text-[#EA3A20]' : agent.rank === 2 ? 'bg-slate-200 text-slate-700' : 'text-slate-400'
                        }`}>
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
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">{agent.callCount.toLocaleString()} 次</td>
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
        </>
      )}

      {/* VIEW 2: 用户使用系统统计 */}
      {isUserAnalytics && (
        <>
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                活跃用户 (DAU / MAU)
              </span>
              <div className="text-3xl font-black text-slate-900 font-sans">
                48 <span className="text-sm font-medium text-slate-400">/ 62 人</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" /> 团队系统渗透率 77.4%
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                人均日交互提问量
              </span>
              <div className="text-3xl font-black text-[#EA3A20] font-sans">
                14.6 <span className="text-sm font-medium text-slate-400">次/日</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" /> 18.2% 环比上升
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                累计会话交互轮次
              </span>
              <div className="text-3xl font-black text-slate-900 font-sans">
                6,240 <span className="text-sm font-medium text-slate-400">轮</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                总有效时长 386 小时
              </span>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                知识资产复用沉淀
              </span>
              <div className="text-3xl font-black text-[#0F4A47] font-sans">
                1,280 <span className="text-sm font-medium text-slate-400">次</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                沉淀优质商用问答对 450+
              </span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Line Chart */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4 lg:col-span-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">部门提问量与活跃走势</h3>
                <span className="text-xs text-slate-400">各业务部门每日系统使用频次</span>
              </div>
              <div className="h-68 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={USER_USAGE_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="销售外贸" stroke="#EA3A20" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="市场运营" stroke="#0F4A47" strokeWidth={2} />
                    <Line type="monotone" dataKey="设计研发" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Donut Chart */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">部门系统使用分布</h3>
                <span className="text-xs text-slate-400">各团队提问总量占比</span>
              </div>
              <div className="h-68 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={DEPT_SHARE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {DEPT_SHARE_DATA.map((entry, index) => (
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

          {/* User Activity Table */}
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">用户使用活跃度排行榜</h3>
                <span className="text-xs text-slate-400">按近30天调用提问次数综合排序</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">共 {filteredUserList.length} 位团队成员</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold bg-slate-50/50">
                    <th className="py-4 pl-6 pr-3 w-16 text-center">排名</th>
                    <th className="py-4 px-4 font-bold text-slate-900">用户姓名</th>
                    <th className="py-4 px-4 font-bold text-slate-900">角色 / 部门</th>
                    <th className="py-4 px-4 font-bold text-slate-900">近30天提问调用</th>
                    <th className="py-4 px-4 font-bold text-slate-900">Token 消耗量</th>
                    <th className="py-4 px-4 font-bold text-slate-900">活跃天数</th>
                    <th className="py-4 px-4 font-bold text-slate-900">高频使用智能体</th>
                    <th className="py-4 pr-6 pl-4 font-bold text-slate-900 text-right">最后活跃时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-xs">
                  {filteredUserList.map((user) => (
                    <tr key={user.rank} className="hover:bg-slate-50/70 transition-colors h-14">
                      <td className="py-4 pl-6 pr-3 text-center">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                          user.rank === 1 ? 'bg-orange-100 text-[#EA3A20]' : user.rank === 2 ? 'bg-slate-200 text-slate-700' : 'text-slate-400'
                        }`}>
                          {user.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">{user.name}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#FFF4F2] text-[#EA3A20] text-[11px] font-bold border border-red-100">
                            {user.role}
                          </span>
                          <span className="text-slate-400 text-[11px]">{user.dept}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">{user.calls.toLocaleString()} 次</td>
                      <td className="py-4 px-4 font-mono text-slate-600">{user.tokens}</td>
                      <td className="py-4 px-4 font-medium text-slate-700">{user.activeDays}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-100">
                          {user.favAgent}
                        </span>
                      </td>
                      <td className="py-4 pr-6 pl-4 font-mono text-slate-400 text-[11px] text-right">{user.lastActive}</td>
                    </tr>
                  ))}
                  {filteredUserList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        未找到匹配的用户数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
