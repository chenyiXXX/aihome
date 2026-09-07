import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  HelpCircle,
  TrendingUp,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  MessageSquare,
  FileText,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Bot,
  X,
  Send,
  CornerDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  KnowledgeQALog,
  initialDailyQATrends,
  initialKBCategoryUsage,
  initialChannelUsage,
  initialHotQuestions,
  initialKnowledgeQALogs
} from '../../../data/knowledgeQAAnalyticsData';

export const GeneralKnowledgeQAAnalytics: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'7 Days' | '30 Days' | 'Quarter' | 'Year'>('30 Days');
  const [selectedChannel, setSelectedChannel] = useState<string>('全部渠道');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [logs, setLogs] = useState<KnowledgeQALog[]>(initialKnowledgeQALogs);
  const [selectedLog, setSelectedLog] = useState<KnowledgeQALog | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered Q&A Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchChannel = selectedChannel === '全部渠道' || log.channel === selectedChannel;
      const matchStatus = selectedStatus === 'all' || log.resolutionStatus === selectedStatus;
      const matchSearch =
        searchQuery.trim() === '' ||
        log.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.matchedDocTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.categoryGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.aiAnswerSnippet.toLowerCase().includes(searchQuery.toLowerCase());
      return matchChannel && matchStatus && matchSearch;
    });
  }, [logs, selectedChannel, selectedStatus, searchQuery]);

  const handleExportReport = () => {
    showToast('已生成《品爱家居·通用知识库智能问答与语义召回效能分析报告.xlsx》，已下载！');
  };

  const handleEnrichKB = (question: string) => {
    showToast(`已将问题「${question.slice(0, 16)}...」作为待补充词条一键推送到知识库待审池！`);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full overflow-y-auto custom-scrollbar px-6 lg:px-8 pb-16 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Range Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#EA3A20]">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">通用知识库问答统计</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4F2] text-[#EA3A20] border border-red-200">
              向量语义召回 & 智能问答效能看板
            </span>
          </div>
          <p className="text-xs text-slate-500">
            监测外贸定制产品百科、环保合规、五金工艺及计价规则在智能体端与员工工作台的召回率与直答解决率
          </p>
        </div>

        {/* Range Controls & Export */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-200 flex items-center gap-1">
            {[
              { id: '7 Days', label: '近 7 天' },
              { id: '30 Days', label: '近 30 天' },
              { id: 'Quarter', label: '本季度' },
              { id: 'Year', label: '年度累计' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRange(r.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeRange === r.id
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="h-8.5 px-4 rounded-full bg-[#FFEFEA] text-[#EA3A20] hover:bg-[#ffe3dc] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出问答报表</span>
          </button>
        </div>
      </div>

      {/* 4 Key KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">知识库问答调用总量</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans tracking-tight">10,050 <span className="text-sm font-semibold text-slate-400">次</span></div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" /> 较上周期提升 19.5%
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">精准语义召回命中率</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F4A47] font-sans tracking-tight">97.4%</div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 向量匹配相似度高于 0.85
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">AI 直答直接解决率</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#EA3A20] font-sans tracking-tight">92.6%</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            无需人工介入，买家/员工采纳率 98.2%
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">平均检索与问答时延</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans tracking-tight">1.3 <span className="text-sm font-semibold text-slate-400">秒</span></div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> 毫秒级知识分块检索 + 答案流式生成
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Q&A Trend & Resolution Rate */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">知识库调用走势与精准召回率趋势</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">每日知识检索调用量、相似度命中率及直答闭环率</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-1 bg-[#EA3A20] rounded-full inline-block" /> 问答调用量
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-1 bg-[#0F4A47] rounded-full inline-block" /> 命中率(%)
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-1 bg-[#F59E0B] rounded-full inline-block" /> 直答解决率(%)
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={initialDailyQATrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[85, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="queries" name="问答调用量(次)" stroke="#EA3A20" strokeWidth={2.5} dot={{ r: 3.5, fill: '#EA3A20' }} />
                <Line yAxisId="right" type="monotone" dataKey="hitRate" name="语义命中率(%)" stroke="#0F4A47" strokeWidth={2} dot={{ r: 3, fill: '#0F4A47' }} />
                <Line yAxisId="right" type="monotone" dataKey="resolvedRate" name="直接解决率(%)" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#F59E0B' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Source Distribution */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">知识库库源召回分布</h3>
              <span className="text-[11px] text-slate-400 font-mono">共5大类目</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">产品工艺与外贸合规认证为最高频检索领域</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={initialKBCategoryUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="queries"
                >
                  {initialKBCategoryUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name, item: any) => [`${val} 次 (${item.payload.percentage}%)`, '调用次数']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-slate-800">10,050</span>
              <span className="text-[10px] text-slate-400 font-medium">总召回</span>
            </div>
          </div>

          {/* Mini Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {initialKBCategoryUsage.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-600 truncate">{c.name.split(' ')[0]}</span>
                </div>
                <span className="font-bold text-slate-800 shrink-0">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Distribution & Hot Questions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Channel Usage Bar Chart */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">各应用终端调用渠道占比</h3>
            <span className="text-xs text-[#EA3A20] font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              售前智能体占比 45%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            涵盖售前官网/WhatsApp机器人、销售业务工作台及内部自查
          </p>

          <div className="space-y-3 pt-2">
            {initialChannelUsage.map((ch) => (
              <div key={ch.channel} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate">{ch.channel}</span>
                  <span className="font-bold text-slate-900 font-mono">{ch.queries}次 ({ch.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-2.5 mt-4">
            <Sparkles className="w-4 h-4 text-[#EA3A20] shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 leading-relaxed">
              <strong>洞察提点：</strong> 售前海外买家最关注欧美环保认证与海运货柜方数，销售工作台调用聚焦激光封边零胶缝与定制计价换算。
            </div>
          </div>
        </div>

        {/* Hot Questions Ranking Top 8 */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">高频热搜问答排行榜 (Top 8)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">统计买家询盘与业务谈判中最高频触发的知识库核心问题</p>
            </div>
            <span className="text-xs text-slate-500">按调用量实时降序</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider bg-slate-50/60">
                  <th className="py-2.5 px-3 rounded-l-xl w-12 text-center">排名</th>
                  <th className="py-2.5 px-3">提问内容</th>
                  <th className="py-2.5 px-3">对应知识类目</th>
                  <th className="py-2.5 px-3 text-center">调用频次</th>
                  <th className="py-2.5 px-3 text-center">召回命中率</th>
                  <th className="py-2.5 px-3 text-center rounded-r-xl">置信度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialHotQuestions.map((q) => (
                  <tr key={q.rank} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black ${
                          q.rank === 1
                            ? 'bg-[#EA3A20] text-white'
                            : q.rank === 2
                            ? 'bg-[#0F4A47] text-white'
                            : q.rank === 3
                            ? 'bg-[#F59E0B] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {q.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[280px]">
                      <div className="font-medium text-slate-800 truncate" title={q.question}>
                        {q.question}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        {q.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {q.queryCount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-emerald-600">
                      {q.hitRate}%
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                      {q.avgScore}分
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Q&A Logs & Retrieval Inspection Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden space-y-4 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">通用知识库实时调用与检索日志</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              记录每次用户/智能体提问的命中文档、向量相似度分数与 AI 直答详情
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Channel Filter */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
            >
              <option value="全部渠道">全部触发终端</option>
              <option value="售前AI智能体">售前AI智能体</option>
              <option value="销售顾问助手">销售顾问助手</option>
              <option value="员工自查">内部员工自查</option>
              <option value="海外推广运营">海外推广运营</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
            >
              <option value="all">全部直答状态</option>
              <option value="direct_resolved">AI 直接闭环解决</option>
              <option value="needs_kb_enrich">低置信度待知识补全</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索提问 / 召回文档 / 内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8.5 pr-3 py-1.5 w-52 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider bg-slate-50/60">
                <th className="py-3 px-4 rounded-l-xl">提问内容与时间</th>
                <th className="py-3 px-3">命中的知识库文档条款</th>
                <th className="py-3 px-3">所属类目</th>
                <th className="py-3 px-3">触发渠道</th>
                <th className="py-3 px-3 text-center">置信度分数</th>
                <th className="py-3 px-3 text-center">响应耗时</th>
                <th className="py-3 px-3 text-center">直答状态</th>
                <th className="py-3 px-4 text-right rounded-r-xl">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Question & Time */}
                  <td className="py-3.5 px-4 max-w-[260px]">
                    <div className="font-bold text-slate-900 group-hover:text-[#EA3A20] transition-colors truncate" title={log.question}>
                      {log.question}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-mono">{log.id}</span>
                      <span>·</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </td>

                  {/* Matched Doc */}
                  <td className="py-3.5 px-3 max-w-[220px]">
                    <div className="flex items-center gap-1 text-slate-800 font-medium truncate" title={log.matchedDocTitle}>
                      <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{log.matchedDocTitle}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                      {log.categoryGroup.split(' ')[0]}
                    </span>
                  </td>

                  {/* Channel */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="text-[11px] font-medium text-slate-700">
                      {log.channel}
                    </span>
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-bold text-xs ${
                        log.confidenceScore >= 95
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.confidenceScore >= 85
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {log.confidenceScore}% (相似度 {log.similarityRate})
                    </span>
                  </td>

                  {/* Latency */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className="text-[11px] font-mono text-slate-500">
                      {log.responseTimeMs} ms
                    </span>
                  </td>

                  {/* Resolution Status */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    {log.resolutionStatus === 'direct_resolved' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> 直接闭环
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" /> 待知识补全
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#EA3A20] hover:bg-[#FFEFEA] cursor-pointer transition-colors"
                      >
                        问答详情
                      </button>
                      {log.resolutionStatus === 'needs_kb_enrich' && (
                        <button
                          onClick={() => handleEnrichKB(log.question)}
                          className="px-2 py-1 rounded-lg text-[10px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 cursor-pointer transition-colors"
                          title="一键推送到知识库待审池"
                        >
                          补词条
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Q&A Log Deep Detail View */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">知识库语义问答详情与召回溯源</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-slate-700 border border-slate-200">
                      {selectedLog.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    来源终端：{selectedLog.channel} · 发生时间：{selectedLog.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs">
              
              {/* Question */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#EA3A20]" />
                  用户/智能体提问原题：
                </span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold leading-relaxed text-sm">
                  {selectedLog.question}
                </div>
              </div>

              {/* Matched KB Document & Confidence */}
              <div className="p-4 rounded-2xl bg-[#FFF9F8] border border-red-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">命中的知识库文档</span>
                  <div className="font-bold text-slate-900 text-xs mt-0.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-red-500" />
                    <span>{selectedLog.matchedDocTitle}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    分类归属：{selectedLog.categoryGroup}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block">语义置信度</span>
                  <div className="text-2xl font-black text-[#EA3A20] font-sans">
                    {selectedLog.confidenceScore}%
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 font-mono">余弦相似度 {selectedLog.similarityRate}</span>
                </div>
              </div>

              {/* Retrieved Context Excerpt */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#0F4A47]" />
                  向量切片检索命中原文片段（Prompt Context）：
                </span>
                <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl text-emerald-950 font-mono text-[11px] leading-relaxed">
                  {selectedLog.retrievedContext}
                </div>
              </div>

              {/* Generated AI Answer */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  AI 智能生成输出答案（面向买家/业务员）：
                </span>
                <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-xl text-slate-800 leading-relaxed font-sans text-xs">
                  {selectedLog.fullAnswer}
                </div>
              </div>

              {/* Response Meta */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">端到端响应耗时</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{selectedLog.responseTimeMs} ms</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">采纳满意评价</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <ThumbsUp className="w-3 h-3" /> 用户点赞好评
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">直接解决闭环</span>
                  <span className="text-xs font-bold text-[#EA3A20]">已闭环 (未转人工)</span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">品爱通用知识库检索引擘 v3.2</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleEnrichKB(selectedLog.question);
                    setSelectedLog(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
                >
                  关联新词条
                </button>
                <button
                  onClick={() => {
                    showToast('已将该问答对复制到剪贴板！');
                    setSelectedLog(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  复制问答对
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
