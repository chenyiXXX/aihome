import React, { useState, useMemo } from 'react';
import { Download, Search, CheckCircle2, Calendar, Cpu, X, Copy, Check, ExternalLink, RotateCcw } from 'lucide-react';

interface OperationLogItem {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  detail: string;
  timestamp: string;
  ipAddress: string;
}

interface QALogItem {
  id: string;
  userName: string;
  userRole: string;
  agentName: string;
  question: string;
  tokensUsed: number;
  answerSnippet: string;
  knowledgeBaseRefs: string[];
  timestamp: string;
  ipAddress: string;
}

interface LoginLogItem {
  id: string;
  userName: string;
  userRole: string;
  actionType: '登录系统' | '退出系统';
  ipAddress: string;
  timestamp: string;
}

interface AuditLogsModuleProps {
  subView?: string;
}

const INITIAL_OPERATION_LOGS: OperationLogItem[] = [
  { id: 'LOG-OP-01', userName: 'Chen Yi (陈总)', userRole: '超级管理员', action: '系统配置变更', detail: '切换默认模型为 gemini-2.5-flash，启用 CBM 海运自动算力规则', timestamp: '2026-09-17 20:52:10', ipAddress: '113.88.204.12' },
  { id: 'LOG-OP-02', userName: 'Sophia Wang', userRole: '外贸主管', action: '知识库维护', detail: '新增公共话术库条目：[实木与板材环保标准说明 (FSC & E0 Grade)]', timestamp: '2026-09-17 19:15:33', ipAddress: '183.14.62.88' },
  { id: 'LOG-OP-03', userName: 'Alex Schmidt', userRole: '销售业务员', action: '数据导出', detail: '导出 2026年9月 北美高意向 RFQ 客户清单 (共 28 条)', timestamp: '2026-09-17 16:40:02', ipAddress: '221.7.201.5' },
  { id: 'LOG-OP-04', userName: 'Elena Rostova', userRole: '营销专家', action: '营销内容发布', detail: '发布 Instagram 跨境建材秋季展会推广图文', timestamp: '2026-09-17 14:10:45', ipAddress: '114.119.131.2' },
  { id: 'LOG-OP-05', userName: '李工', userRole: '资深木作工艺师', action: '价格体系变更', detail: '更新爱格板 E0级 柜体板基准单价至 $36.5/㎡', timestamp: '2026-09-16 11:20:18', ipAddress: '60.28.15.99' },
  { id: 'LOG-OP-06', userName: 'Chen Yi (陈总)', userRole: '超级管理员', action: '权限变更', detail: '分配销售业务员 Alex Schmidt [BOQ导出与核价] 权限', timestamp: '2026-09-15 09:30:11', ipAddress: '113.88.204.12' },
];

const INITIAL_QA_LOGS: QALogItem[] = [
  {
    id: 'LOG-QA-01',
    userName: 'Alex Schmidt',
    userRole: '销售业务员',
    agentName: '报价商务智能体',
    question: '请详细核算 1*40HQ 高柜集装箱能装载多少套 3+2+1 意式全真皮沙发 SL-802，并列出海运费均摊成本及 CBM 空间利用率。',
    tokensUsed: 1420,
    answerSnippet: '根据体积核算公式，SL-802 系列打包后单套体积为 1.75 CBM，40HQ 限重 26 吨/有效容积 68 CBM，预计装柜 38 套。空间利用率达到 97.7%，美西港口海运均摊成本约为 $42.5/套。建议在报价单中附带装柜示意图。',
    knowledgeBaseRefs: [
      '图纸与BOQ规范库 (v2.6.0)',
      '产品合规与质检库 (v3.5.0)',
      '商业文档生成库 (v2.5.0)',
      '海运自动算力规则库 (v1.8.2)',
      'FSC森林认证标准库 (v4.1.0)',
      '意式家具工艺参数库 (v2.0.1)',
      '北美高意向客户白皮书库 (v3.0.0)',
      'ERP同步对接规范库 (v1.2.5)',
      '海外合规风控法规库 (v5.1.2)',
      '多语言外贸沟通语料库 (v2.2.4)',
      '涂装与饰面工艺手册库 (v1.9.0)',
      '国际物流集装箱配载库 (v2.1.1)'
    ],
    timestamp: '2026-09-17 20:10:45',
    ipAddress: '221.7.201.5'
  },
  {
    id: 'LOG-QA-02',
    userName: 'Sophia Wang',
    userRole: '外贸主管',
    agentName: '前置处理智能体',
    question: '美东客户要求提供 CARB P2 认证，我们目前使用的 E0 级多层板是否能够完全替代？需要准备哪些补充检测报告？',
    tokensUsed: 980,
    answerSnippet: '可以完全替代。E0级甲醛释放量 <=0.05mg/m³，严格优于 CARB P2 (0.09ppm) 限值要求。建议向客户提供国家建材检验中心出具的中英文检测报告及 EPA TSCA Title VI 符合性声明。',
    knowledgeBaseRefs: [
      '产品合规与质检库 (v3.5.0)',
      '图纸与BOQ规范库 (v2.6.0)',
      '合规风控规则库 (v3.5.0)',
      '北美环保标准白皮书 (v1.1.0)',
      'E0级板材检测报告集 (v2.0.0)',
      'CARB认证对照指南 (v1.4.2)',
      '海外清关实务库 (v3.1.0)',
      '企业质量信用档案库 (v4.0.1)'
    ],
    timestamp: '2026-09-17 18:32:19',
    ipAddress: '183.14.62.88'
  },
  {
    id: 'LOG-QA-03',
    userName: 'Elena Rostova',
    userRole: '营销专家',
    agentName: '商务文案生成智能体',
    question: '撰写一段针对加州高定别墅厨房项目的英文报价跟进话术，重点突出实木多层板的防水防潮性能以及 10 年质保承诺。',
    tokensUsed: 1650,
    answerSnippet: 'Dear Client, regarding your custom solid oak kitchen cabinets inquiry for California villas, we are pleased to offer our premium multi-layer waterproof solution backed by an industry-leading 10-year warranty. All materials strictly meet CARB P2 standards...',
    knowledgeBaseRefs: [
      '商业文档生成库 (v2.5.0)',
      '高定别墅设计标准库 (v1.9.2)',
      '英文商务信函模版库 (v3.0.1)',
      '防水防潮工艺技术库 (v2.1.0)',
      '售后质保条款汇编 (v1.2.0)',
      '海外客户沟通语料库 (v2.4.0)'
    ],
    timestamp: '2026-09-17 15:45:03',
    ipAddress: '114.119.131.2'
  },
];

const INITIAL_LOGIN_LOGS: LoginLogItem[] = [
  { id: 'LOG-IN-01', userName: 'Chen Yi (陈总)', userRole: '超级管理员', actionType: '登录系统', ipAddress: '113.88.204.12', timestamp: '2026-09-17 08:30:15' },
  { id: 'LOG-IN-02', userName: 'Sophia Wang', userRole: '外贸主管', actionType: '登录系统', ipAddress: '183.14.62.88', timestamp: '2026-09-17 09:05:42' },
  { id: 'LOG-IN-03', userName: 'Alex Schmidt', userRole: '销售业务员', actionType: '登录系统', ipAddress: '221.7.201.5', timestamp: '2026-09-17 09:12:00' },
  { id: 'LOG-IN-04', userName: 'Alex Schmidt', userRole: '销售业务员', actionType: '退出系统', ipAddress: '221.7.201.5', timestamp: '2026-09-17 12:00:10' },
  { id: 'LOG-IN-05', userName: 'Alex Schmidt', userRole: '销售业务员', actionType: '登录系统', ipAddress: '221.7.201.5', timestamp: '2026-09-17 13:30:00' },
  { id: 'LOG-IN-06', userName: 'Elena Rostova', userRole: '营销专家', actionType: '登录系统', ipAddress: '114.119.131.2', timestamp: '2026-09-17 10:20:11' },
];

type LogTab = '操作日志' | 'AI 问答日志' | '用户登录日志';
type DateRangePreset = 'all' | 'today' | '7d' | '30d';

export const AuditLogsModule: React.FC<AuditLogsModuleProps> = () => {
  const [activeTab, setActiveTab] = useState<LogTab>('操作日志');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState<DateRangePreset>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedQALog, setSelectedQALog] = useState<QALogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'question' | 'answer' | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Date filtering logic based on presets
  const isWithinDatePreset = (timestamp: string, preset: DateRangePreset): boolean => {
    if (preset === 'all') return true;
    if (preset === 'today') return timestamp.startsWith('2026-09-17');
    if (preset === '7d') return timestamp >= '2026-09-10';
    if (preset === '30d') return timestamp >= '2026-08-18';
    return true;
  };

  // Filtered Operation Logs
  const filteredOpLogs = useMemo(() => {
    return INITIAL_OPERATION_LOGS.filter((item) => {
      const matchDate = isWithinDatePreset(item.timestamp, dateRange);
      if (!matchDate) return false;
      if (!searchKeyword.trim()) return true;
      const kw = searchKeyword.toLowerCase();
      return (
        item.userName.toLowerCase().includes(kw) ||
        item.userRole.toLowerCase().includes(kw) ||
        item.action.toLowerCase().includes(kw) ||
        item.detail.toLowerCase().includes(kw) ||
        item.ipAddress.includes(kw)
      );
    });
  }, [searchKeyword, dateRange]);

  // Filtered QA Logs
  const filteredQALogs = useMemo(() => {
    return INITIAL_QA_LOGS.filter((item) => {
      const matchDate = isWithinDatePreset(item.timestamp, dateRange);
      if (!matchDate) return false;
      if (!searchKeyword.trim()) return true;
      const kw = searchKeyword.toLowerCase();
      return (
        item.userName.toLowerCase().includes(kw) ||
        item.agentName.toLowerCase().includes(kw) ||
        item.question.toLowerCase().includes(kw) ||
        item.answerSnippet.toLowerCase().includes(kw) ||
        item.knowledgeBaseRefs.some((kb) => kb.toLowerCase().includes(kw))
      );
    });
  }, [searchKeyword, dateRange]);

  // Filtered Login Logs
  const filteredLoginLogs = useMemo(() => {
    return INITIAL_LOGIN_LOGS.filter((item) => {
      const matchDate = isWithinDatePreset(item.timestamp, dateRange);
      if (!matchDate) return false;
      if (!searchKeyword.trim()) return true;
      const kw = searchKeyword.toLowerCase();
      return (
        item.userName.toLowerCase().includes(kw) ||
        item.userRole.toLowerCase().includes(kw) ||
        item.actionType.includes(kw) ||
        item.ipAddress.includes(kw)
      );
    });
  }, [searchKeyword, dateRange]);

  const currentCount =
    activeTab === '操作日志'
      ? filteredOpLogs.length
      : activeTab === 'AI 问答日志'
      ? filteredQALogs.length
      : filteredLoginLogs.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (activeTab === '操作日志') setSelectedIds(filteredOpLogs.map((i) => i.id));
      else if (activeTab === 'AI 问答日志') setSelectedIds(filteredQALogs.map((i) => i.id));
      else setSelectedIds(filteredLoginLogs.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setDateRange('all');
  };

  // Export to actual downloadable CSV
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (activeTab === '操作日志') {
      headers = ['时间', '操作人', '角色', '操作类型', '操作详情', 'IP地址'];
      const data = selectedIds.length > 0 ? filteredOpLogs.filter((i) => selectedIds.includes(i.id)) : filteredOpLogs;
      rows = data.map((i) => [i.timestamp, i.userName, i.userRole, i.action, `"${i.detail.replace(/"/g, '""')}"`, i.ipAddress]);
    } else if (activeTab === 'AI 问答日志') {
      headers = ['时间', '提问人', '调用智能体', '提问内容', 'Token消耗', '回答摘要', '引用知识库', 'IP地址'];
      const data = selectedIds.length > 0 ? filteredQALogs.filter((i) => selectedIds.includes(i.id)) : filteredQALogs;
      rows = data.map((i) => [
        i.timestamp,
        i.userName,
        i.agentName,
        `"${i.question.replace(/"/g, '""')}"`,
        `${i.tokensUsed}`,
        `"${i.answerSnippet.replace(/"/g, '""')}"`,
        `"${i.knowledgeBaseRefs.join('; ')}"`,
        i.ipAddress
      ]);
    } else {
      headers = ['时间', '用户', '角色', '事件类型', 'IP地址'];
      const data = selectedIds.length > 0 ? filteredLoginLogs.filter((i) => selectedIds.includes(i.id)) : filteredLoginLogs;
      rows = data.map((i) => [i.timestamp, i.userName, i.userRole, i.actionType, i.ipAddress]);
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`已成功导出 ${rows.length} 条记录至 Excel (CSV) 文件`);
  };

  const copyToClipboard = (text: string, field: 'question' | 'answer') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8 relative">

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Unified AI Q&A Detail Drawer / Inspection Dialog */}
      {selectedQALog && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#EA3A20] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI 问答详情审计</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{selectedQALog.timestamp}</span>
                    <span>·</span>
                    <span>{selectedQALog.ipAddress}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedQALog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
              {/* Meta Summary Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">提问人</span>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">{selectedQALog.userName}</div>
                  <span className="text-[10px] text-slate-500">{selectedQALog.userRole}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">调用智能体</span>
                  <div className="font-bold text-blue-700 text-xs mt-0.5">{selectedQALog.agentName}</div>
                  <span className="text-[10px] text-slate-500">知识检索引擎</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Token 消耗量</span>
                  <div className="font-bold text-orange-600 font-mono text-xs mt-0.5">{selectedQALog.tokensUsed.toLocaleString()} tokens</div>
                  <span className="text-[10px] text-slate-500">双向多轮交互</span>
                </div>
              </div>

              {/* Question Section */}
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">提问内容</span>
                  <button
                    onClick={() => copyToClipboard(selectedQALog.question, 'question')}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#EA3A20] cursor-pointer"
                  >
                    {copiedField === 'question' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'question' ? '已复制' : '复制全文'}</span>
                  </button>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{selectedQALog.question}</p>
              </div>

              {/* Answer Section */}
              <div className="rounded-2xl bg-blue-50/40 border border-blue-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">AI 回答内容</span>
                  <button
                    onClick={() => copyToClipboard(selectedQALog.answerSnippet, 'answer')}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#EA3A20] cursor-pointer"
                  >
                    {copiedField === 'answer' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'answer' ? '已复制' : '复制全文'}</span>
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedQALog.answerSnippet}</p>
              </div>

              {/* Knowledge Base Citations List */}
              <div className="rounded-2xl border border-slate-100 p-4 bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800">
                    引用知识库清单 ({selectedQALog.knowledgeBaseRefs.length})
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">命中检索版本一致</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedQALog.knowledgeBaseRefs.map((kb, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs">
                      <span className="w-5 h-5 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium truncate" title={kb}>{kb}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedQALog(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Filter & Action Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-4 mb-3 shrink-0 gap-4">
        {/* Category Tabs */}
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(['操作日志', 'AI 问答日志', '用户登录日志'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedIds([]);
                }}
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

        {/* Unified Search, Date Preset & Export Bar */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          {/* Quick Date Range Pills */}
          <div className="bg-white rounded-xl p-1 border border-slate-200/90 flex items-center gap-0.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1 shrink-0" />
            {(
              [
                { key: 'all', label: '全部' },
                { key: 'today', label: '今日' },
                { key: '7d', label: '近7天' },
                { key: '30d', label: '近30天' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setDateRange(item.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  dateRange === item.key
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Unified Keyword Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索用户、角色、关键词或IP..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full h-9 pl-9 pr-8 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20]"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Reset if active */}
          {(searchKeyword || dateRange !== 'all') && (
            <button
              onClick={handleResetFilters}
              title="重置所有筛选"
              className="h-9 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置</span>
            </button>
          )}

          {/* Primary Export Button */}
          <button
            onClick={handleExportCSV}
            className="h-9 px-4 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs shrink-0 active:scale-95"
            title="导出为 Excel CSV 报表"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出日志</span>
          </button>
        </div>
      </div>

      {/* Batch Action Toolbar when items are selected */}
      {selectedIds.length > 0 && (
        <div className="mb-3 px-4 py-2.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2 font-medium text-orange-950">
            <CheckCircle2 className="w-4 h-4 text-[#EA3A20]" />
            <span>已勾选 <strong>{selectedIds.length}</strong> 条日志记录</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1 rounded-lg bg-[#EA3A20] text-white font-bold hover:bg-[#c42810] cursor-pointer transition-colors shadow-2xs"
            >
              导出选中记录
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1 rounded-lg bg-white border border-orange-200 text-orange-900 hover:bg-orange-100/50 cursor-pointer transition-colors"
            >
              取消勾选
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-y-auto custom-scrollbar flex-1">
          
          {/* TAB 1: 操作日志 */}
          {activeTab === '操作日志' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold bg-slate-50/50 sticky top-0 z-10">
                  <th className="py-4 pl-6 pr-3 w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredOpLogs.length > 0 && selectedIds.length === filteredOpLogs.length}
                      className="rounded-md border-slate-300 w-4 h-4 cursor-pointer accent-[#EA3A20]"
                    />
                  </th>
                  <th className="py-4 px-4 font-bold text-slate-900">时间</th>
                  <th className="py-4 px-4 font-bold text-slate-900">操作人</th>
                  <th className="py-4 px-4 font-bold text-slate-900">角色</th>
                  <th className="py-4 px-4 font-bold text-slate-900">操作类型</th>
                  <th className="py-4 px-4 font-bold text-slate-900">操作详情</th>
                  <th className="py-4 pr-6 pl-4 font-bold text-slate-900 text-right">IP 地址</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-xs">
                {filteredOpLogs.map((log) => {
                  const isChecked = selectedIds.includes(log.id);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors h-16">
                      <td className="py-4 pl-6 pr-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(log.id)}
                          className="rounded-md border-slate-300 w-4 h-4 cursor-pointer accent-[#EA3A20]"
                        />
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{log.userName}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#FFF4F2] text-[#EA3A20] border border-red-100">
                          {log.userRole}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-700">{log.action}</td>
                      <td className="py-4 px-4 text-slate-800 font-medium max-w-md truncate" title={log.detail}>
                        {log.detail}
                      </td>
                      <td className="py-4 pr-6 pl-4 font-mono text-slate-400 text-[11px] text-right">{log.ipAddress}</td>
                    </tr>
                  );
                })}
                {filteredOpLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 text-xs">
                      暂无匹配的操作日志记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB 2: AI 问答日志 */}
          {activeTab === 'AI 问答日志' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold bg-slate-50/50 sticky top-0 z-10">
                  <th className="py-4 pl-6 pr-3 w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredQALogs.length > 0 && selectedIds.length === filteredQALogs.length}
                      className="rounded-md border-slate-300 w-4 h-4 cursor-pointer accent-[#EA3A20]"
                    />
                  </th>
                  <th className="py-4 px-4 font-bold text-slate-900">时间</th>
                  <th className="py-4 px-4 font-bold text-slate-900">提问人</th>
                  <th className="py-4 px-4 font-bold text-slate-900">调用智能体</th>
                  <th className="py-4 px-4 font-bold text-slate-900">提问内容</th>
                  <th className="py-4 px-4 font-bold text-slate-900">Token 消耗</th>
                  <th className="py-4 px-4 font-bold text-slate-900">引用知识库</th>
                  <th className="py-4 pr-6 pl-4 font-bold text-slate-900 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-xs">
                {filteredQALogs.map((log) => {
                  const isChecked = selectedIds.includes(log.id);
                  const firstKb = log.knowledgeBaseRefs[0] || '';
                  const extraKbCount = log.knowledgeBaseRefs.length - 1;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors h-16">
                      <td className="py-4 pl-6 pr-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(log.id)}
                          className="rounded-md border-slate-300 w-4 h-4 cursor-pointer accent-[#EA3A20]"
                        />
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{log.userName}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1 w-fit">
                          <Cpu className="w-3 h-3" />
                          {log.agentName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedQALog(log)}
                          className="text-left text-slate-800 font-medium max-w-md truncate block hover:text-[#EA3A20] cursor-pointer"
                          title="点击查看问答详情"
                        >
                          {log.question}
                        </button>
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-slate-700">
                        {log.tokensUsed.toLocaleString()} <span className="text-[10px] text-slate-400">tokens</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-medium truncate max-w-[200px]">
                            {firstKb}
                          </span>
                          {extraKbCount > 0 && (
                            <button
                              onClick={() => setSelectedQALog(log)}
                              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer transition-colors"
                              title="点击查看所有引用知识库"
                            >
                              +{extraKbCount} 个
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 pr-6 pl-4 text-right">
                        <button
                          onClick={() => setSelectedQALog(log)}
                          className="text-xs font-bold text-[#EA3A20] hover:underline cursor-pointer"
                        >
                          详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredQALogs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 text-xs">
                      暂无匹配的 AI 问答日志记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: 用户登录日志 */}
          {activeTab === '用户登录日志' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold bg-slate-50/50 sticky top-0 z-10">
                  <th className="py-4 pl-6 pr-3 w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredLoginLogs.length > 0 && selectedIds.length === filteredLoginLogs.length}
                      className="rounded-md border-slate-300 w-4 h-4 cursor-pointer accent-[#EA3A20]"
                    />
                  </th>
                  <th className="py-4 px-4 font-bold text-slate-900">时间</th>
                  <th className="py-4 px-4 font-bold text-slate-900">用户</th>
                  <th className="py-4 px-4 font-bold text-slate-900">角色</th>
                  <th className="py-4 px-4 font-bold text-slate-900">事件类型</th>
                  <th className="py-4 pr-6 pl-4 font-bold text-slate-900 text-right">IP 地址</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-xs">
                {filteredLoginLogs.map((log) => {
                  const isChecked = selectedIds.includes(log.id);
                  const isLogin = log.actionType === '登录系统';
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors h-16">
                      <td className="py-4 pl-6 pr-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(log.id)}
                          className="rounded-md border-slate-300 w-4 h-4 cursor-pointer accent-[#EA3A20]"
                        />
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{log.userName}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#FFF4F2] text-[#EA3A20] border border-red-100">
                          {log.userRole}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                            isLogin
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {log.actionType}
                        </span>
                      </td>
                      <td className="py-4 pr-6 pl-4 font-mono text-slate-400 text-[11px] text-right">{log.ipAddress}</td>
                    </tr>
                  );
                })}
                {filteredLoginLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-xs">
                      暂无匹配的用户登录日志记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

        </div>

        {/* Standard Clean Enterprise Pagination / Data Summary Footer */}
        <div className="flex items-center justify-between pt-4 pb-1 shrink-0 px-2 text-xs text-slate-500">
          <span>共 {currentCount} 条日志数据</span>
          <div className="flex items-center gap-1">
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">第 1 页</span>
          </div>
        </div>
      </div>

    </div>
  );
};
