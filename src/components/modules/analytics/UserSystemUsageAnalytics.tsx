import React, { useState, useMemo, useEffect } from 'react';
import {
  Clock,
  Activity,
  Users,
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Monitor,
  Smartphone,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3,
  Sun,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  UserUsageRecord,
  INITIAL_USER_USAGE_RECORDS,
  DEPARTMENT_FILTER_TABS,
  USAGE_TIER_OPTIONS,
  BASE_HOURLY_USAGE,
  BASE_DEPARTMENT_USAGE
} from '../../../data/userSystemUsageData';
import { TimeFilterState } from './analyticsTimeUtils';
import { Pagination } from '../../common/Pagination';

interface UserSystemUsageAnalyticsProps {
  timeFilter: TimeFilterState;
  timeMultiplier: number;
  timePeriodLabel: string;
}

type SortField = 'totalHours' | 'dailyHours' | 'totalSessions' | 'dailySessions' | 'avgSessionMin';

export const UserSystemUsageAnalytics: React.FC<UserSystemUsageAnalyticsProps> = ({
  timeFilter,
  timeMultiplier,
  timePeriodLabel
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalHours');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [chartView, setChartView] = useState<'trend' | 'hourly' | 'department'>('trend');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Reset pagination when filter condition changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDept, selectedTier, searchQuery, sortField, sortAsc, timeMultiplier]);

  // Dynamic scaled records based on timeMultiplier
  const scaledRecords = useMemo(() => {
    return INITIAL_USER_USAGE_RECORDS.map((item) => {
      const scaledTotalHours = Number((item.baseTotalHours * timeMultiplier).toFixed(1));
      const scaledTotalSessions = Math.max(1, Math.round(item.baseTotalSessions * timeMultiplier));
      const activeDays = Math.min(
        Math.round(21 * Math.min(1, timeMultiplier)),
        Math.round(item.activeDays * Math.min(1, timeMultiplier))
      );
      return {
        ...item,
        totalHours: scaledTotalHours,
        dailyHours: item.baseDailyHours,
        totalSessions: scaledTotalSessions,
        dailySessions: item.baseDailySessions,
        avgSessionMin: item.avgSessionDurationMin,
        activeDaysDisplay: activeDays > 0 ? activeDays : 1
      };
    });
  }, [timeMultiplier]);

  // Filtered & sorted records
  const processedRecords = useMemo(() => {
    let result = scaledRecords.filter((rec) => {
      // Dept filter
      if (selectedDept !== 'all' && rec.deptCategory !== selectedDept) {
        return false;
      }
      // Tier filter
      if (selectedTier !== 'all' && rec.activeTier !== selectedTier) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = rec.name.toLowerCase().includes(q);
        const matchCode = rec.empCode.toLowerCase().includes(q);
        const matchDept = rec.dept.toLowerCase().includes(q);
        const matchRole = rec.role.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDept && !matchRole) {
          return false;
        }
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortAsc) {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return result;
  }, [scaledRecords, selectedDept, selectedTier, searchQuery, sortField, sortAsc]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedRecords.slice(start, start + pageSize);
  }, [processedRecords, currentPage, pageSize]);

  // Macro KPI Metrics
  const macroKPI = useMemo(() => {
    const totalUsers = processedRecords.length;
    const totalHours = Number(
      processedRecords.reduce((acc, curr) => acc + curr.totalHours, 0).toFixed(1)
    );
    const totalSessions = processedRecords.reduce((acc, curr) => acc + curr.totalSessions, 0);
    const avgDailyHours =
      totalUsers > 0
        ? Number((processedRecords.reduce((acc, curr) => acc + curr.dailyHours, 0) / totalUsers).toFixed(1))
        : 0;
    const avgDailySessions =
      totalUsers > 0
        ? Number((processedRecords.reduce((acc, curr) => acc + curr.dailySessions, 0) / totalUsers).toFixed(1))
        : 0;
    const avgSessionMin =
      totalUsers > 0
        ? Number(
            (
              processedRecords.reduce((acc, curr) => acc + curr.avgSessionMin, 0) / totalUsers
            ).toFixed(1)
          )
        : 0;

    const highTierUsers = processedRecords.filter((r) => r.activeTier === 'high').length;
    const highTierPct = totalUsers > 0 ? Math.round((highTierUsers / totalUsers) * 100) : 0;

    return {
      totalUsers,
      totalHours,
      totalSessions,
      avgDailyHours,
      avgDailySessions,
      avgSessionMin,
      highTierPct
    };
  }, [processedRecords]);

  // Daily Trend Data for Dual-Axis Chart
  const dailyTrendData = useMemo(() => {
    // Generate 7-14 points depending on timeFilter
    const pointsCount = timeFilter.mode === 'quarter' || timeFilter.mode === 'year' || timeFilter.mode === 'all' ? 12 : 7;
    const result = [];
    const baseDate = new Date(2026, 10, 14); // 2026-11-14

    for (let i = 0; i < pointsCount; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dateStr = `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')}`;
      const dayFactor = i % 7 === 5 || i % 7 === 6 ? 0.35 : 1.0; // weekend factor
      const variance = 0.9 + (i * 37 % 25) / 100;
      
      const dailyHours = Number((245 * timeMultiplier * dayFactor * variance).toFixed(1));
      const dailySessions = Math.round(580 * timeMultiplier * dayFactor * variance);
      const activeUsers = Math.round(118 * dayFactor * (0.95 + (i % 5) * 0.02));

      result.push({
        date: dateStr,
        总在线时长: dailyHours,
        访问频次: dailySessions,
        活跃人次: activeUsers
      });
    }
    return result;
  }, [timeMultiplier, timeFilter]);

  // Hourly Distribution Data
  const hourlyData = useMemo(() => {
    return BASE_HOURLY_USAGE.map((item) => ({
      ...item,
      sessions: Math.round(item.sessions * Math.max(0.5, timeMultiplier * 0.8)),
      onlineHours: Number((item.onlineHours * Math.max(0.5, timeMultiplier * 0.8)).toFixed(1))
    }));
  }, [timeMultiplier]);

  // Department Comparison Data
  const deptComparisonData = useMemo(() => {
    return BASE_DEPARTMENT_USAGE.map((item) => ({
      ...item,
      totalHours: Number((item.totalHours * timeMultiplier).toFixed(1)),
      totalSessions: Math.round(item.totalSessions * timeMultiplier)
    }));
  }, [timeMultiplier]);

  // Toggle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      '排名',
      '员工姓名',
      '工号',
      '所属部门',
      '职务岗位',
      '累计在线时长(小时)',
      '日均在线时长(小时)',
      '系统访问总频次(次)',
      '日均访问频次(次/天)',
      '单次平均时长(分钟)',
      '活跃天数',
      '活跃度评级',
      '最常活跃时段',
      '最近活动时间'
    ];

    const rows = processedRecords.map((r, idx) => [
      `${idx + 1}`,
      r.name,
      r.empCode,
      r.dept,
      r.role,
      `${r.totalHours}`,
      `${r.dailyHours}`,
      `${r.totalSessions}`,
      `${r.dailySessions}`,
      `${r.avgSessionMin}`,
      `${r.activeDaysDisplay}`,
      r.activeTier === 'high' ? '高频深潜' : r.activeTier === 'medium' ? '常态活跃' : '轻度偶发',
      r.peakHour,
      r.lastActive
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `用户使用系统时长与频率统计报表_${selectedDept}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`已成功导出《用户使用系统时长与频率统计报表》(${timePeriodLabel})`);
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

      {/* 1. Macro KPI Cards: Focusing specifically on Duration & Frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* KPI 1: 系统累计在线时长 */}
        <div className="p-5.5 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              系统累计在线总时长
            </span>
            <span className="p-1.5 bg-red-50 text-[#EA3A20] rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-[#EA3A20] font-sans">
            {macroKPI.totalHours.toLocaleString()} <span className="text-sm font-medium text-slate-400">小时</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>较上周期增长 15.4%</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            日均全员在线达 {Number((macroKPI.totalHours / 21).toFixed(1))} 小时
          </span>
        </div>

        {/* KPI 2: 系统访问/登录总频次 */}
        <div className="p-5.5 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              系统访问总频次
            </span>
            <span className="p-1.5 bg-teal-50 text-[#0F4A47] rounded-xl">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-[#0F4A47] font-sans">
            {macroKPI.totalSessions.toLocaleString()} <span className="text-sm font-medium text-slate-400">人次</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>会话建立率 99.8%</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            日均系统交互约 {Math.round(macroKPI.totalSessions / 21)} 次
          </span>
        </div>

        {/* KPI 3: 人均日均在线时长 */}
        <div className="p-5.5 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              人均日均在线时长
            </span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-xl">
              <Sun className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans">
            {macroKPI.avgDailyHours} <span className="text-sm font-medium text-slate-400">小时/天</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
            <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 font-bold">
              深度使用率 {macroKPI.highTierPct}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            核心外贸与产品人员达 7.5+h
          </span>
        </div>

        {/* KPI 4: 人均日均访问频次 */}
        <div className="p-5.5 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              人均日均访问频次
            </span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-blue-600 font-sans">
            {macroKPI.avgDailySessions} <span className="text-sm font-medium text-slate-400">次/人/天</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 font-bold">
              常态高粘性
            </span>
            <span>多任务穿插</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            平均每 45 分钟产生一次系统交互
          </span>
        </div>

        {/* KPI 5: 平均单次停留时长 */}
        <div className="p-5.5 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              单次平均停留时长
            </span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-xl">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans">
            {macroKPI.avgSessionMin} <span className="text-sm font-medium text-slate-400">分钟/次</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>无异常挂机闲置</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            沉浸式会话 (&gt;30min) 占比 42%
          </span>
        </div>
      </div>

      {/* 2. Visual Charts: Duration & Frequency Multi-dimensional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Multi-mode Chart */}
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {chartView === 'trend' && '每日系统访问频次与在线总时长双轴走势'}
                  {chartView === 'hourly' && '全天 24 小时活跃时段与访问频次热度分布'}
                  {chartView === 'department' && '各部门使用时长与访问频次横向对比'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  {timePeriodLabel}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-0.5 block">
                {chartView === 'trend' && '柱状图表示每日访问频次（人次），折线图表示当日全员累计在线总时长（小时）'}
                {chartView === 'hourly' && '呈现企业员工在各时段的在线时长与会话发起峰值'}
                {chartView === 'department' && '对比不同职能部门在系统中的投入时长与日常访问粘性'}
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setChartView('trend')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  chartView === 'trend'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                趋势双轴图
              </button>
              <button
                onClick={() => setChartView('hourly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  chartView === 'hourly'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                24小时时段
              </button>
              <button
                onClick={() => setChartView('department')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  chartView === 'department'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                部门横向对比
              </button>
            </div>
          </div>

          {/* Chart Rendering Container */}
          <div className="h-76 w-full pt-2">
            {chartView === 'trend' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyTrendData} margin={{ top: 20, right: 25, left: -5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} name="访问频次(次)" />
                  <YAxis yAxisId="right" orientation="right" stroke="#EA3A20" fontSize={11} name="在线时长(h)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      borderRadius: '16px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="访问频次" fill="#0F4A47" radius={[6, 6, 0, 0]} maxBarSize={36} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="总在线时长"
                    stroke="#EA3A20"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#EA3A20' }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {chartView === 'hourly' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA3A20" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EA3A20" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F4A47" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0F4A47" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      borderRadius: '16px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    name="访问频次(次)"
                    stroke="#EA3A20"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSessions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="onlineHours"
                    name="累计在线时长(h)"
                    stroke="#0F4A47"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {chartView === 'department' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptComparisonData} margin={{ top: 20, right: 20, left: -5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="deptName" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      borderRadius: '16px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="totalHours" name="总在线时长(h)" fill="#EA3A20" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="totalSessions" name="总访问频次(次)" fill="#0F4A47" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Info: Usage Habit & Device Distribution */}
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">使用特征与终端分布</h3>
              <span className="text-xs text-slate-400 font-medium">心跳活跃留存</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">时长区间分布与工作习惯画像</span>
          </div>

          {/* Duration Tier Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">日均在线时长区间分布</span>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EA3A20]" />
                  高频深潜 (≥ 5小时/天)
                </span>
                <span className="font-mono text-slate-900 font-bold">45% (9人)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#EA3A20]" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-700" />
                  常态活跃 (2h ~ 5小时/天)
                </span>
                <span className="font-mono text-slate-900 font-bold">40% (8人)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-teal-700" style={{ width: '40%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  轻度偶发 (&lt; 2小时/天)
                </span>
                <span className="font-mono text-slate-900 font-bold">15% (3人)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-slate-400" style={{ width: '15%' }} />
              </div>
            </div>
          </div>

          {/* Device Access Distribution */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2.5">
            <span className="text-xs font-bold text-slate-700 block">访问终端比例</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 font-mono">89.2%</div>
                  <div className="text-[10px] text-slate-400">PC 桌面端</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-100">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 font-mono">10.8%</div>
                  <div className="text-[10px] text-slate-400">移动工作台</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100/80 text-[11px] text-amber-800 leading-relaxed">
            💡 统计口径说明：系统时长基于用户真实网页操作、鼠标移动与网络心跳判定，超过 15 分钟无任何操作将自动暂停时长累加，确保统计数据真实可信。
          </div>
        </div>
      </div>

      {/* 3. Multi-dimensional Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
        {/* Department Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> 部门筛选:
            </span>
            {DEPARTMENT_FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedDept(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  selectedDept === tab.key
                    ? 'bg-[#EA3A20] text-white font-bold shadow-sm shadow-red-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            导出使用统计报表
          </button>
        </div>

        {/* Secondary Filters: Tier, Sort & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tier Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">活跃等级:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="h-8.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] transition-all cursor-pointer"
              >
                {USAGE_TIER_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Period Badge */}
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>当前周期: </span>
              <span className="font-bold text-slate-800">{timePeriodLabel}</span>
            </div>

            <div className="text-xs text-slate-400">
              共筛选出 <strong className="text-slate-800">{processedRecords.length}</strong> 位员工
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索员工姓名、工号、部门或职位..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* 4. Detailed Ranking Table: User System Usage Duration & Frequency */}
      <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>员工系统使用时长与频次明细榜单</span>
              {selectedDept !== 'all' && (
                <span className="text-xs font-normal text-[#EA3A20] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                  {selectedDept}
                </span>
              )}
            </h3>
            <span className="text-xs text-slate-400 mt-0.5 block">
              展示员工累计在线时长、日均时长、访问频次及活跃度等级（点击列表行可展开查看模块功能分配）
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            显示第 {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, processedRecords.length)} 条，共 {processedRecords.length} 位员工
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-14">排名</th>
                <th className="py-3.5 px-4 min-w-[180px]">员工信息</th>
                <th className="py-3.5 px-4 min-w-[150px]">所属部门 / 职位</th>
                
                {/* Sortable: 累计在线时长 */}
                <th
                  onClick={() => handleSort('totalHours')}
                  className="py-3.5 px-4 min-w-[160px] cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>累计在线时长</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'totalHours' ? 'text-[#EA3A20]' : 'text-slate-300'}`} />
                  </div>
                </th>

                {/* Sortable: 日均在线时长 */}
                <th
                  onClick={() => handleSort('dailyHours')}
                  className="py-3.5 px-4 min-w-[130px] cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>日均在线时长</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'dailyHours' ? 'text-[#EA3A20]' : 'text-slate-300'}`} />
                  </div>
                </th>

                {/* Sortable: 访问总频次 */}
                <th
                  onClick={() => handleSort('totalSessions')}
                  className="py-3.5 px-4 min-w-[130px] cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>访问总频次</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'totalSessions' ? 'text-[#EA3A20]' : 'text-slate-300'}`} />
                  </div>
                </th>

                {/* Sortable: 日均访问频次 */}
                <th
                  onClick={() => handleSort('dailySessions')}
                  className="py-3.5 px-4 min-w-[120px] cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>日均频次</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'dailySessions' ? 'text-[#EA3A20]' : 'text-slate-300'}`} />
                  </div>
                </th>

                {/* Sortable: 单次平均时长 */}
                <th
                  onClick={() => handleSort('avgSessionMin')}
                  className="py-3.5 px-4 min-w-[120px] cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>单次平均时长</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'avgSessionMin' ? 'text-[#EA3A20]' : 'text-slate-300'}`} />
                  </div>
                </th>

                <th className="py-3.5 px-4 min-w-[110px]">活跃度等级</th>
                <th className="py-3.5 px-4 min-w-[130px]">最常活跃时段</th>
                <th className="py-3.5 px-4 min-w-[140px]">最近活动</th>
                <th className="py-3.5 px-4 text-center w-12">详情</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    未找到匹配该筛选条件的用户使用数据
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item, idx) => {
                  const absoluteRank = (currentPage - 1) * pageSize + idx + 1;
                  const isExpanded = expandedUserId === item.id;
                  const maxHours = 180 * timeMultiplier;
                  const progressPct = Math.min(100, Math.round((item.totalHours / maxHours) * 100));

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => setExpandedUserId(isExpanded ? null : item.id)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-red-50/30' : ''
                        }`}
                      >
                        {/* 排名 */}
                        <td className="py-4 px-4 text-center font-mono">
                          {absoluteRank === 1 ? (
                            <span className="w-6 h-6 rounded-full bg-[#EA3A20] text-white font-bold flex items-center justify-center mx-auto text-xs shadow-xs">
                              1
                            </span>
                          ) : absoluteRank === 2 ? (
                            <span className="w-6 h-6 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center mx-auto text-xs shadow-xs">
                              2
                            </span>
                          ) : absoluteRank === 3 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mx-auto text-xs shadow-xs">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold">{absoluteRank}</span>
                          )}
                        </td>

                        {/* 员工信息 */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/80 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 shadow-2xs">
                              {item.name.slice(0, 1)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.isOnline && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 在线
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {item.empCode}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 所属部门与职位 */}
                        <td className="py-4 px-4">
                          <div className="text-slate-800 font-medium">{item.dept}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{item.role}</div>
                        </td>

                        {/* 累计在线时长 (Hours) */}
                        <td className="py-4 px-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-sm font-bold text-[#EA3A20]">
                              {item.totalHours}
                            </span>
                            <span className="text-[11px] text-slate-400">小时</span>
                          </div>
                          <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="h-full rounded-full bg-[#EA3A20]"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </td>

                        {/* 日均在线时长 (Daily Hours) */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-800">
                          {item.dailyHours}{' '}
                          <span className="text-[11px] font-normal text-slate-400">h/天</span>
                        </td>

                        {/* 访问总频次 (Sessions) */}
                        <td className="py-4 px-4">
                          <div className="font-mono text-sm font-bold text-[#0F4A47]">
                            {item.totalSessions.toLocaleString()}{' '}
                            <span className="text-[11px] font-normal text-slate-400">次</span>
                          </div>
                        </td>

                        {/* 日均频次 (Daily Sessions) */}
                        <td className="py-4 px-4 font-mono text-slate-700 font-medium">
                          {item.dailySessions}{' '}
                          <span className="text-[11px] text-slate-400">次/天</span>
                        </td>

                        {/* 单次平均时长 */}
                        <td className="py-4 px-4 font-mono text-slate-700 font-medium">
                          {item.avgSessionMin}{' '}
                          <span className="text-[11px] text-slate-400">分钟</span>
                        </td>

                        {/* 活跃度等级 */}
                        <td className="py-4 px-4">
                          {item.activeTier === 'high' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              高频深潜 (≥5h)
                            </span>
                          ) : item.activeTier === 'medium' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              常态活跃 (2-5h)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              轻度偶发 (&lt;2h)
                            </span>
                          )}
                        </td>

                        {/* 最常活跃时段 */}
                        <td className="py-4 px-4 text-slate-600 text-[11px]">
                          {item.peakHour}
                        </td>

                        {/* 最近活动 */}
                        <td className="py-4 px-4 text-slate-500 text-[11px] font-mono">
                          {item.lastActive}
                        </td>

                        {/* 详情展开图标 */}
                        <td className="py-4 px-4 text-center text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#EA3A20] mx-auto" />
                          ) : (
                            <ChevronDown className="w-4 h-4 mx-auto" />
                          )}
                        </td>
                      </tr>

                      {/* Expandable Row Detail */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-b border-slate-100">
                          <td colSpan={12} className="p-6">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/70 space-y-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                    <span>{item.name} · 系统功能模块使用时长与交互行为特征</span>
                                    <span className="text-[11px] font-normal text-slate-400 font-mono">
                                      ({item.empCode})
                                    </span>
                                  </h4>
                                  <span className="text-[11px] text-slate-400">
                                    统计该员工在各业务功能模块的在线投入时长及终端习惯
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-slate-500">
                                    活跃天数: <strong className="text-slate-800">{item.activeDaysDisplay} / 21 天</strong>
                                  </span>
                                  <span className="text-slate-300">|</span>
                                  <span className="text-slate-500">
                                    PC端: <strong className="text-slate-800">{item.deviceRatio.pc}%</strong>
                                  </span>
                                  <span className="text-slate-300">|</span>
                                  <span className="text-slate-500">
                                    移动端: <strong className="text-slate-800">{item.deviceRatio.mobile}%</strong>
                                  </span>
                                </div>
                              </div>

                              {/* Module Usage Breakdown Progress Bars */}
                              <div className="space-y-3">
                                <span className="text-xs font-bold text-slate-700 block">
                                  主要功能模块时长投入分布
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {item.moduleUsage.map((m, mIdx) => {
                                    const scaledHours = Number((m.hours * timeMultiplier).toFixed(1));
                                    return (
                                      <div
                                        key={mIdx}
                                        className="p-3 bg-slate-50/90 rounded-xl border border-slate-100 space-y-1.5"
                                      >
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium text-slate-800 truncate">
                                            {m.module}
                                          </span>
                                          <span className="font-mono font-bold text-[#EA3A20]">
                                            {scaledHours}h ({m.pct}%)
                                          </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                                          <div
                                            className="h-full rounded-full bg-[#EA3A20]"
                                            style={{ width: `${m.pct}%` }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Footer Tips for the employee */}
                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>
                                    最常使用时段: <strong className="text-slate-700">{item.peakHour}</strong>
                                  </span>
                                </div>
                                <div>
                                  单次最长连续会话记录: <strong className="text-slate-700">1 小时 42 分钟</strong>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalItems={processedRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 20, 50]}
            itemUnit="位员工"
          />
        </div>
      </div>
    </div>
  );
};
