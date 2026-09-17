import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  BookOpen,
  FileText,
  X,
  Send,
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  StaffTrainingRecord,
  initialDepartmentStats,
  initialCourseHeatStats,
  initialTrainingTrends,
  initialStaffTrainingRecords
} from '../../../data/staffTrainingData';

export const StaffTrainingAnalytics: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'7 Days' | '30 Days' | 'Quarter' | 'Year'>('30 Days');
  const [selectedDept, setSelectedDept] = useState<string>('全部部门');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'needs_retake'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [records, setRecords] = useState<StaffTrainingRecord[]>(initialStaffTrainingRecords);
  const [selectedRecord, setSelectedRecord] = useState<StaffTrainingRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchDept = selectedDept === '全部部门' || r.department === selectedDept;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchStatus && matchSearch;
    });
  }, [records, selectedDept, statusFilter, searchQuery]);

  // Handle reminding employee
  const handleRemindEmployee = (name: string) => {
    showToast(`已向 ${name} 发送「带教课程进阶督办提醒」通知至工作台与移动端！`);
  };

  // Export report simulation
  const handleExportReport = () => {
    showToast('已生成《品爱家居·2026员工岗位培训与带教考评效能报告.xlsx》，已下载到本地！');
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
              <GraduationCap className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">员工培训统计</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4F2] text-[#EA3A20] border border-red-200">
              岗位导师带教 & 智能考评
            </span>
          </div>
          <p className="text-xs text-slate-500">
            全维度监测外贸销售、海外运营与新员工入职培训完成率、考试得分与导师互动学习效能
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
            <span>导出培训报表</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">参训员工总人数</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans tracking-tight">42 <span className="text-sm font-semibold text-slate-400">人</span></div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" /> 全员覆盖率 96.8% (环比 +8 人)
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">岗位课程整体通关率</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F4A47] font-sans tracking-tight">89.5%</div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> 人均学习课时: 4.2 小时
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">实战考评平均得分</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#EA3A20] font-sans tracking-tight">92.4 <span className="text-sm font-semibold text-slate-400">分</span></div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            S / A 级达标率 83.3% (及格线 80分)
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">带教答疑与学习效能</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans tracking-tight">95.8 <span className="text-sm font-semibold text-slate-400">分</span></div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> 人均互动 12.4 次 · 解决率 98.6%
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Department Progress & Scores */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">各部门岗位培训完成率与考核均分对比</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">衡量各部门学员课程通关进度与导师实战考试得分水平</p>
            </div>
            <span className="text-xs font-bold text-[#EA3A20] bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              业务与客服组领跑
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialDepartmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="completionRate" name="培训完成率 (%)" fill="#0F4A47" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="averageScore" name="考核平均分" fill="#EA3A20" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Course Category Trainee Distribution */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">核心课程参训热度占比</h3>
              <span className="text-[11px] text-slate-400 font-mono">共4门专项</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">外贸定制销冠谈判大单为最高频参选课程</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={initialCourseHeatStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="traineeCount"
                >
                  {initialCourseHeatStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item: any) => [`${val} 人 (${item.payload.category})`, '参训人数']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-800">42</span>
              <span className="text-[10px] text-slate-400 font-medium">总学员</span>
            </div>
          </div>

          {/* Custom Mini Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {initialCourseHeatStats.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-600 truncate">{c.name}</span>
                </div>
                <span className="font-bold text-slate-800 shrink-0">{c.traineeCount}人 ({c.passRate}%通过)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Study Hours & Mentor Interactive Questions Trend */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">学员学习时长与导师实战问答互动走势</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              呈现“问得越多、对练越深、考评通关率越高”的良性学习成长规律
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-1 bg-[#EA3A20] rounded-full inline-block" /> 导师答疑互动数
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-1 bg-[#EA3A20] rounded-full inline-block" /> 学习时长 (小时)
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={initialTrainingTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Line type="monotone" dataKey="interactions" name="导师互动答疑次数" stroke="#EA3A20" strokeWidth={2.5} dot={{ r: 3.5, fill: '#EA3A20' }} />
              <Line type="monotone" dataKey="studyHours" name="总累计学时(h)" stroke="#0F4A47" strokeWidth={2.5} dot={{ r: 3.5, fill: '#0F4A47' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Training Records & Assessment Dossier Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden space-y-4 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">员工培训明细与带教考核档案</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              点击学员可调取导师逐题阅卷记录、实操作答及针对性改进建议
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
            >
              <option value="全部部门">全部部门</option>
              <option value="外贸业务一组">外贸业务一组</option>
              <option value="售前客服组">售前客服组</option>
              <option value="海外品牌推广部">海外品牌推广部</option>
              <option value="定制工程设计组">定制工程设计组</option>
              <option value="人力与组织发展部">人力与组织发展部</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
            >
              <option value="all">全部考评状态</option>
              <option value="completed">已通关达标</option>
              <option value="in_progress">带教在学中</option>
              <option value="needs_retake">待复盘补考</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索员工 / 课程 / 导师..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8.5 pr-3 py-1.5 w-48 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider bg-slate-50/60">
                <th className="py-3 px-4 rounded-l-xl">学员基本信息</th>
                <th className="py-3 px-3">所属部门 / 岗位</th>
                <th className="py-3 px-3">带教导师</th>
                <th className="py-3 px-3">在学课程与阶段</th>
                <th className="py-3 px-3">学习进度</th>
                <th className="py-3 px-3">学时与提问</th>
                <th className="py-3 px-3 text-center">最新考评成绩</th>
                <th className="py-3 px-3 text-center">考核状态</th>
                <th className="py-3 px-4 text-right rounded-r-xl">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Name and avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rec.avatar}
                        alt={rec.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-[#EA3A20] transition-colors">
                          {rec.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{rec.employeeId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Department & Role */}
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-800">{rec.department}</div>
                    <div className="text-[10px] text-slate-400">{rec.role}</div>
                  </td>

                  {/* Mentor */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <GraduationCap className="w-3.5 h-3.5 text-[#EA3A20]" />
                      <span>{rec.mentorName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{rec.mentorTitle.split('·')[0]}</div>
                  </td>

                  {/* Course & Current Lesson */}
                  <td className="py-3.5 px-3 max-w-[200px]">
                    <div className="font-medium text-slate-800 truncate" title={rec.courseTitle}>
                      {rec.courseTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate" title={rec.currentLesson}>
                      {rec.currentLesson}
                    </div>
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3.5 px-3 min-w-[120px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-700">{rec.progressPercent}%</span>
                      <span className="text-[10px] text-slate-400">{rec.completedLessons}/{rec.totalLessons} 节</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          rec.progressPercent === 100
                            ? 'bg-emerald-500'
                            : rec.progressPercent > 50
                            ? 'bg-[#EA3A20]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${rec.progressPercent}%` }}
                      />
                    </div>
                  </td>

                  {/* Study Time & Questions */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{rec.studyMinutes} 分钟</span>
                    </div>
                    <div className="text-[10px] text-purple-700 font-medium flex items-center gap-0.5">
                      <MessageSquare className="w-2.5 h-2.5 text-purple-500" />
                      <span>{rec.interactiveQuestionsCount} 次带教提问</span>
                    </div>
                  </td>

                  {/* Exam Score */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                        rec.latestScore >= 95
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rec.latestScore >= 80
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {rec.latestScore} 分 · {rec.grade.split(' ')[0]}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center">
                    {rec.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> 已通关达标
                      </span>
                    )}
                    {rec.status === 'in_progress' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#1a73e8] border border-blue-200">
                        <Clock className="w-3 h-3" /> 带教在学中
                      </span>
                    )}
                    {rec.status === 'needs_retake' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-[#EA3A20] border border-red-200">
                        <AlertCircle className="w-3 h-3" /> 待复盘补考
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#EA3A20] hover:bg-[#FFEFEA] cursor-pointer transition-colors"
                      >
                        考评详情
                      </button>

                      {rec.status !== 'completed' && (
                        <button
                          onClick={() => handleRemindEmployee(rec.name)}
                          className="px-2 py-1 rounded-lg text-[11px] text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
                          title="督办催促学习"
                        >
                          催学
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

      {/* Detail Assessment Dossier Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={selectedRecord.avatar}
                  alt={selectedRecord.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{selectedRecord.name} · 岗位带教与阅卷档案</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                      {selectedRecord.employeeId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedRecord.department} · {selectedRecord.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 text-xs">
              {/* Course & Mentor Summary */}
              <div className="p-4 rounded-2xl bg-[#FFF9F8] border border-red-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">所学考核课程</span>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">{selectedRecord.courseTitle}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    带教导师：<strong className="text-slate-800">{selectedRecord.mentorName}</strong> ({selectedRecord.mentorTitle})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block">实操考核评定</span>
                  <div className="text-2xl font-black text-[#EA3A20] font-sans">
                    {selectedRecord.latestScore} <span className="text-xs font-semibold text-slate-500">分</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">{selectedRecord.grade}</span>
                </div>
              </div>

              {/* Exam Question */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#EA3A20]" />
                  考核题目：
                </span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium leading-relaxed">
                  {selectedRecord.examQuestion}
                </div>
              </div>

              {/* Student Answer */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  学员实操作答（文字/录音转写）：
                </span>
                <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-800 leading-relaxed font-sans">
                  {selectedRecord.studentAnswer}
                </div>
              </div>

              {/* Standard Key Points */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold text-[11px]">标准得分要点（采分标准）：</span>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.standardKeyPoints.map((pt, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium border border-slate-200">
                      ✓ {pt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mentor Review */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  带教导师评卷反馈与实操点拨：
                </span>
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-emerald-950 font-medium leading-relaxed">
                  {selectedRecord.mentorReview}
                </div>
              </div>

              {/* AI Improvement Tip */}
              <div className="p-3.5 bg-purple-50/60 border border-purple-200/80 rounded-xl text-purple-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] text-purple-800 font-bold">智能带教跟进建议</strong>
                  <p className="text-[11px] text-purple-900 mt-0.5 leading-relaxed">{selectedRecord.aiImprovementTip}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">最后活跃记录：{selectedRecord.lastActiveDate}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast(`已打印并归档《${selectedRecord.name}·岗位合格培训报告》`);
                    setSelectedRecord(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  导出个人档案
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
