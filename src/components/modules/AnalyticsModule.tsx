import React, { useState } from 'react';
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
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { AgentStatMetric } from '../../types';

interface AnalyticsModuleProps {
  statsData: AgentStatMetric[];
  subView: string;
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ statsData, subView }) => {
  const [activeRange, setActiveRange] = useState<'7 Days' | '30 Days' | 'All Time'>('7 Days');

  const categoryData = [
    { name: '全屋橱衣柜 Solid Wood Cabinetry', value: 45, color: '#EA3A20' },
    { name: '意式真皮沙发 Leather Sofa', value: 30, color: '#0F4A47' },
    { name: '酒店工程套房 Hotel Contract', value: 15, color: '#F59E0B' },
    { name: '五金配件与软装 Hardware/Decor', value: 10, color: '#8B5CF6' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar px-8 pb-8 space-y-6">
      
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between py-4 mb-2 shrink-0">
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(['7 Days', '30 Days', 'All Time'] as const).map((range) => {
            const isActive = activeRange === range;
            return (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>

        <button className="h-9 px-4.5 rounded-full bg-[#FFEFEA] text-[#EA3A20] hover:bg-[#ffe3dc] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
          <span>Export Report</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Stat Cards matching Jobick Spacing & Shadows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">海外询盘处理总量</span>
          <div className="text-3xl font-black text-slate-900 font-sans">462 条</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> 24.5% 较上周上升
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">AI 自动解决率</span>
          <div className="text-3xl font-black text-[#EA3A20] font-sans">97.2%</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" /> 3.8% 模型准确率提高
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">平均响应速度</span>
          <div className="text-3xl font-black text-[#0F4A47] font-sans">2.6s</div>
          <span className="text-[11px] text-slate-400 font-medium">毫秒级秒级首回</span>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">推广引流有效线索</span>
          <div className="text-3xl font-black text-slate-900 font-sans">348 个</div>
          <span className="text-[11px] font-bold text-[#EA3A20]">来自 Instagram / Pinterest</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sales Agent Daily Trend */}
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="text-sm font-bold text-slate-900">询盘处理趋势与 AI 解决率走势</h3>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="salesInquiriesHandled" name="询盘量" stroke="#EA3A20" strokeWidth={2.5} />
                <Line type="monotone" dataKey="salesAiResolutionRate" name="AI解决率(%)" stroke="#0F4A47" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution Pie Chart */}
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="text-sm font-bold text-slate-900">品爱家具出口品类询盘热度占比</h3>
          <div className="h-68 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
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

    </div>
  );
};
