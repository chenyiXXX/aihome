import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  FileCode,
  Video,
  Presentation,
  FileSpreadsheet,
  Check,
  X,
  Eye,
  GitCompare,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square,
  RotateCcw,
  Sparkles,
  MessageSquare,
  User,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Info,
  Folder,
  ShieldAlert
} from 'lucide-react';
import { KBArticle, KBAuditLog } from '../../../types';
import { DualColumnDiff, VersionOption } from './DualColumnDiff';

interface ArticleReviewSubViewProps {
  articles?: KBArticle[];
  categories?: { name: string; fullPath: string; id: string }[];
  onApprove?: (article: KBArticle, comment?: string) => void;
  onReject?: (article: KBArticle, reason: string) => void;
  onBatchApprove?: (articleIds: string[], comment?: string) => void;
  onBatchReject?: (articleIds: string[], reason: string) => void;
  onPreviewArticle?: (article: KBArticle) => void;
  onEditArticle?: (article: KBArticle) => void;
  onRollback?: (article: KBArticle, log: KBAuditLog) => void;
  renderPairedTagBadge?: (tagStr: string) => React.ReactNode;
  showToast?: (msg: string) => void;
  onShowToast?: (msg: string) => void;
}

export const ArticleReviewSubView: React.FC<ArticleReviewSubViewProps> = ({
  articles = [],
  categories = [],
  onApprove = (_article: KBArticle, _comment?: string) => {},
  onReject = (_article: KBArticle, _reason?: string) => {},
  onBatchApprove = (_articleIds: string[], _comment?: string) => {},
  onBatchReject = (_articleIds: string[], _reason?: string) => {},
  onPreviewArticle = (_article: KBArticle) => {},
  onEditArticle = (_article: KBArticle) => {},
  onRollback = (_article: KBArticle, _log: KBAuditLog) => {},
  renderPairedTagBadge = (_tagStr: string) => null,
  showToast,
  onShowToast
}) => {
  const triggerToast = (msg: string) => {
    if (showToast) showToast(msg);
    else if (onShowToast) onShowToast(msg);
  };
  // Current active review tab: 待复核 | 复核通过 | 复核不通过
  const [activeTab, setActiveTab] = useState<'待复核' | '复核通过' | '复核不通过'>('待复核');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [opTypeFilter, setOpTypeFilter] = useState<'全部' | 'create' | 'update' | 'delete'>('全部');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredTitle, setHoveredTitle] = useState<{ id: string; title: string; rect: { top: number; left: number; width: number; height: number } } | null>(null);

  // Modal states
  const [rejectingArticle, setRejectingArticle] = useState<KBArticle | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvingArticle, setApprovingArticle] = useState<KBArticle | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [diffArticle, setDiffArticle] = useState<KBArticle | null>(null);
  const [diffLeftVersionId, setDiffLeftVersionId] = useState<string>('');
  const [diffRightVersionId, setDiffRightVersionId] = useState<string>('');
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [batchRejectionReason, setBatchRejectionReason] = useState('');

  // Reset selected version comparisons when diffArticle changes
  React.useEffect(() => {
    setDiffLeftVersionId('');
    setDiffRightVersionId('');
  }, [diffArticle?.id]);

  // Version options generation for diffArticle modal (identical to Detail Drawer Tab 1)
  const diffVersionOptions: VersionOption[] = React.useMemo(() => {
    if (!diffArticle) return [];

    const list: VersionOption[] = [];

    // Current State Option (本次待复核版本 / 当前实时最新)
    const isUnderReview = diffArticle.status === '等待复核';
    list.push({
      id: 'current',
      version: `${diffArticle.pendingVersion || diffArticle.version} (${isUnderReview ? '本次待复核版本' : '当前状态'})`,
      label: isUnderReview ? '本次待复核新版本' : '当前实时编辑状态',
      timestamp: diffArticle.updatedAt || '实时最新',
      operator: diffArticle.author || '当前登录用户',
      operatorRole: '作者/提审人',
      wasPublished: diffArticle.status === '已发布',
      status: diffArticle.status,
      title: diffArticle.title,
      category: diffArticle.category,
      tags: diffArticle.tags || [],
      content: diffArticle.content || ''
    });

    // Add versions from auditLogs
    if (diffArticle.auditLogs && diffArticle.auditLogs.length > 0) {
      diffArticle.auditLogs.forEach((log) => {
        // From afterSnapshot
        if (log.afterSnapshot && log.afterSnapshot.content) {
          list.push({
            id: `${log.id}-after`,
            version: `${log.afterSnapshot.version || log.version} (${log.wasPublished ? '已发布' : log.actionLabel})`,
            label: `${log.actionLabel} - 操作后快照`,
            timestamp: log.timestamp,
            operator: log.operator,
            operatorRole: log.operatorRole,
            wasPublished: log.wasPublished,
            status: log.afterSnapshot.status || log.actionLabel,
            title: log.afterSnapshot.title || diffArticle.title,
            category: log.afterSnapshot.category || diffArticle.category,
            tags: log.afterSnapshot.tags || diffArticle.tags || [],
            content: log.afterSnapshot.content || '',
            log: log
          });
        }

        // From beforeSnapshot (修改前基线快照 / 原已生效版本)
        if (log.beforeSnapshot && log.beforeSnapshot.content) {
          list.push({
            id: `${log.id}-before`,
            version: `${log.beforeSnapshot.version || '基线版本'} (修改前线上原状)`,
            label: `${log.actionLabel} - 修改前原已生效版本`,
            timestamp: log.timestamp,
            operator: log.operator,
            operatorRole: log.operatorRole,
            wasPublished: true,
            status: log.beforeSnapshot.status || '已发布',
            title: log.beforeSnapshot.title || diffArticle.title,
            category: log.beforeSnapshot.category || diffArticle.category,
            tags: log.beforeSnapshot.tags || diffArticle.tags || [],
            content: log.beforeSnapshot.content || '',
            log: log
          });
        }
      });
    }

    // If this is a newly created article with no published history
    const hasPublishedVersion = diffArticle.wasPublished || list.some((v) => v.wasPublished && v.id !== 'current');
    if (!hasPublishedVersion && diffArticle.status === '等待复核') {
      list.push({
        id: 'empty-baseline',
        version: '（无已发布历史版本）',
        label: '首次新建条目 - 无历史版本',
        timestamp: '未发布',
        operator: '系统初始',
        operatorRole: '空基线',
        wasPublished: false,
        status: '未发布',
        title: '（无历史版本）',
        category: diffArticle.category,
        tags: [],
        content: ''
      });
    }

    // Default fallback baseline if no snapshots and has wasPublished
    if (list.length === 1 && (diffArticle.wasPublished || diffArticle.status === '已发布')) {
      list.push({
        id: 'v1.0.0-initial',
        version: 'v1.0.0 (线上已发布基线)',
        label: '线上已发布生效版本',
        timestamp: '2026-07-01 09:00',
        operator: 'System Admin',
        operatorRole: '系统已发布',
        wasPublished: true,
        status: '已发布',
        title: diffArticle.title,
        category: diffArticle.category,
        tags: (diffArticle.tags || []).slice(0, 2),
        content: `【线上已发布基线版本】\n${diffArticle.title}\n\n${diffArticle.content || '基础定制技术规格与参数说明。'}`
      });
    }

    return list;
  }, [diffArticle]);

  // Set default left & right comparison versions (Left: 已发布版本 / 基线; Right: 本次复核版本)
  const effectiveDiffLeftVersionId = React.useMemo(() => {
    if (diffLeftVersionId && diffVersionOptions.some((v) => v.id === diffLeftVersionId)) {
      return diffLeftVersionId;
    }
    const publishedOption = diffVersionOptions.find((v) => v.id !== 'current' && (v.wasPublished || v.id.includes('before')));
    if (publishedOption) {
      return publishedOption.id;
    }
    const emptyOption = diffVersionOptions.find((v) => v.id === 'empty-baseline');
    if (emptyOption) {
      return emptyOption.id;
    }
    if (diffVersionOptions.length > 1) {
      return diffVersionOptions[diffVersionOptions.length - 1].id;
    }
    return diffVersionOptions[0]?.id || 'current';
  }, [diffLeftVersionId, diffVersionOptions]);

  const effectiveDiffRightVersionId = React.useMemo(() => {
    if (diffRightVersionId && diffVersionOptions.some((v) => v.id === diffRightVersionId)) {
      return diffRightVersionId;
    }
    return diffVersionOptions[0]?.id || 'current';
  }, [diffRightVersionId, diffVersionOptions]);

  // Diff summary stats for the badge & metric cards
  const diffReviewSummary = React.useMemo(() => {
    const leftItem = diffVersionOptions.find((v) => v.id === effectiveDiffLeftVersionId) || diffVersionOptions[0];
    const rightItem = diffVersionOptions.find((v) => v.id === effectiveDiffRightVersionId) || diffVersionOptions[0];
    if (!leftItem || !rightItem) return { hasChanges: false, changesCount: 0, isNew: false };

    const isNew = leftItem.id === 'empty-baseline' || !leftItem.content;
    const isTitleDiff = (leftItem.title || '') !== (rightItem.title || '');
    const isCategoryDiff = (leftItem.category || '') !== (rightItem.category || '');
    const isContentDiff = (leftItem.content || '') !== (rightItem.content || '');
    const leftTags = leftItem.tags || [];
    const rightTags = rightItem.tags || [];
    const isTagsDiff = leftTags.length !== rightTags.length || leftTags.some(t => !rightTags.includes(t));

    let count = 0;
    if (isTitleDiff) count++;
    if (isCategoryDiff) count++;
    if (isContentDiff) count++;
    if (isTagsDiff) count++;

    return {
      hasChanges: count > 0 || isNew,
      changesCount: isNew ? 'NEW' : count,
      isNew,
      isTitleDiff,
      isCategoryDiff,
      isContentDiff,
      isTagsDiff,
      leftItem,
      rightItem
    };
  }, [effectiveDiffLeftVersionId, effectiveDiffRightVersionId, diffVersionOptions]);

  // Quick preset rejection templates
  const quickRejectionTags = [
    '包含未公开敏感底价',
    '材质标准未达 CARB P2 / E0 认证',
    '缺少多语种国际版翻译',
    '工艺公差缺少 CAD 施工节点图',
    '违反中东/伊斯兰文化合规红线'
  ];

  // Helper to map article status to review tab
  const getTabArticles = (tab: '待复核' | '复核通过' | '复核不通过') => {
    switch (tab) {
      case '待复核':
        return articles.filter((a) => a.status === '等待复核');
      case '复核通过':
        return articles.filter((a) => a.status === '已发布');
      case '复核不通过':
        return articles.filter((a) => a.status === '复核不通过');
      default:
        return [];
    }
  };

  const pendingCount = getTabArticles('待复核').length;
  const approvedCount = getTabArticles('复核通过').length;
  const rejectedCount = getTabArticles('复核不通过').length;

  // Filter current tab list by search, category & operation type
  const currentTabArticles = getTabArticles(activeTab);

  const filteredArticles = currentTabArticles.filter((item) => {
    // Category filter
    if (categoryFilter !== '全部') {
      if (!item.category.includes(categoryFilter) && !categoryFilter.includes(item.category)) {
        return false;
      }
    }

    // Operation type filter
    if (opTypeFilter !== '全部') {
      const itemAction = item.pendingAction || (item.auditLogs?.[0]?.action === 'create' ? 'create' : 'update');
      if (itemAction !== opTypeFilter) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchAuthor = item.author.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchContent = item.content.toLowerCase().includes(q);
      const matchComment = item.reviewComment?.toLowerCase().includes(q);
      return matchTitle || matchCode || matchAuthor || matchCategory || matchContent || Boolean(matchComment);
    }

    return true;
  });

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredArticles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredArticles.map((a) => a.id)));
    }
  };

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Execution Handlers
  const handleConfirmApprove = () => {
    if (!approvingArticle) return;
    onApprove(approvingArticle, approvalNote.trim() || '经平台管理员合规核对无误，予以发布上线。');
    setApprovingArticle(null);
    setApprovalNote('');
  };

  const handleConfirmReject = () => {
    if (!rejectingArticle) return;
    if (!rejectionReason.trim()) {
      triggerToast('⚠️ 请填写驳回理由或选择快速意见！');
      return;
    }
    onReject(rejectingArticle, rejectionReason.trim());
    setRejectingArticle(null);
    setRejectionReason('');
  };

  const handleConfirmBatchApprove = () => {
    if (selectedIds.size === 0) return;
    const ids: string[] = Array.from(selectedIds);
    onBatchApprove(ids, '平台管理员批量复核通过');
    setSelectedIds(new Set());
  };

  const handleConfirmBatchReject = () => {
    if (selectedIds.size === 0) return;
    if (!batchRejectionReason.trim()) {
      triggerToast('⚠️ 请输入批量驳回理由！');
      return;
    }
    const ids: string[] = Array.from(selectedIds);
    onBatchReject(ids, batchRejectionReason.trim());
    setSelectedIds(new Set());
    setIsBatchRejectModalOpen(false);
    setBatchRejectionReason('');
  };

  // Render file icon helper
  const renderItemIcon = (item: KBArticle) => {
    if (item.contentType === 'video' || item.fileType === 'VIDEO') {
      return (
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Video className="w-4 h-4" />
        </div>
      );
    }
    if (item.fileType === 'PPTX') {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Presentation className="w-4 h-4" />
        </div>
      );
    }
    if (item.fileType === 'PDF') {
      return (
        <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
      );
    }
    if (item.fileType === 'XLSX') {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <FileSpreadsheet className="w-4 h-4" />
        </div>
      );
    }
    if (item.fileType === 'DOCX') {
      return (
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
        <FileCode className="w-4 h-4" />
      </div>
    );
  };

  // Helper for OpType badge
  const renderOpBadge = (item: KBArticle) => {
    const action = item.pendingAction || (item.auditLogs?.[0]?.action === 'create' ? 'create' : 'update');
    if (action === 'create') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
          <span>➕ 新建上传</span>
        </span>
      );
    }
    if (action === 'delete') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
          <span>🗑️ 申请删除</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        <span>✏️ 编辑修改</span>
      </span>
    );
  };

  // Latest audit log helper
  const getLatestAuditLog = (item: KBArticle): KBAuditLog | undefined => {
    if (item.auditLogs && item.auditLogs.length > 0) {
      return item.auditLogs[0];
    }
    return undefined;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        <div
          onClick={() => setActiveTab('待复核')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            activeTab === '待复核'
              ? 'bg-amber-500/10 border-amber-500 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-500">待复核条目</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-600">{pendingCount}</span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded-md">
                需管理员审批
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('复核通过')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            activeTab === '复核通过'
              ? 'bg-emerald-500/10 border-emerald-500 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-500">复核通过 (已发布)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">{approvedCount}</span>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded-md">
                线上生效
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('复核不通过')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            activeTab === '复核不通过'
              ? 'bg-red-500/10 border-red-500 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-500">复核不通过 (已驳回)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-red-600">{rejectedCount}</span>
              <span className="text-[10px] text-red-700 font-medium bg-red-50 px-1.5 py-0.2 rounded-md">
                退回修订
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Header Navigation & Filters Bar */}
        <div className="p-4 border-b border-slate-100 space-y-3 shrink-0 bg-slate-50/40">
          {/* Sub-menu Tabs */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab('待复核');
                  setSelectedIds(new Set());
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === '待复核'
                    ? 'bg-white text-[#EA3A20] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>待复核</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === '待复核' ? 'bg-amber-100 text-amber-800' : 'bg-slate-300 text-slate-600'
                }`}>
                  {pendingCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('复核通过');
                  setSelectedIds(new Set());
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === '复核通过'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>复核通过</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 text-slate-500">
                  {approvedCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('复核不通过');
                  setSelectedIds(new Set());
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === '复核不通过'
                    ? 'bg-white text-red-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-red-500" />
                <span>复核不通过</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 text-slate-500">
                  {rejectedCount}
                </span>
              </button>
            </div>

            {/* Filter Dropdowns & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Filter */}
              <div className="flex items-center gap-1 text-xs min-w-0">
                <span className="text-slate-400 shrink-0">分类:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="max-w-[180px] sm:max-w-[220px] truncate px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="全部">全部分类</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.fullPath}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operation Type Filter */}
              <div className="flex items-center gap-1 text-xs shrink-0">
                <span className="text-slate-400 shrink-0">操作类型:</span>
                <select
                  value={opTypeFilter}
                  onChange={(e) => setOpTypeFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="全部">全部类型</option>
                  <option value="create">➕ 新建上传</option>
                  <option value="update">✏️ 编辑修改</option>
                  <option value="delete">🗑️ 申请删除</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative w-48 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索标题/作者/意见..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8.5 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Batch Actions Bar (when rows are selected in '待复核' tab) */}
          {selectedIds.size > 0 && activeTab === '待复核' && (
            <div className="p-2 px-3 bg-red-50/80 border border-[#EA3A20]/20 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <CheckSquare className="w-4 h-4 text-[#EA3A20]" />
                <span>已选中 {selectedIds.size} 项待复核条目</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleConfirmBatchApprove}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>批量通过</span>
                </button>
                <button
                  onClick={() => setIsBatchRejectModalOpen(true)}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>批量驳回</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table Column Headers */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={handleToggleSelectAll}
              className="text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {selectedIds.size > 0 && selectedIds.size === filteredArticles.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-[#EA3A20]" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
            </button>
            <span>知识条目标题</span>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <span className="hidden md:inline-block w-28 text-left">归属分类</span>
            <span className="hidden sm:inline-block w-24 text-left">提审类型</span>
            <span className="hidden lg:inline-block w-28 text-left">提审人 / 时间</span>
            <span className="hidden xl:inline-block w-20 text-left">版本号</span>
            <span className="w-40 text-right">复核操作</span>
          </div>
        </div>

        {/* Table Body List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
          {filteredArticles.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <ShieldCheck className="w-10 h-10 text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-medium">当前列表暂无符合条件的知识条目</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#EA3A20] font-bold hover:underline cursor-pointer"
                >
                  清除搜索条件
                </button>
              )}
            </div>
          ) : (
            filteredArticles.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const latestLog = getLatestAuditLog(item);
              const hasDiff = Boolean(latestLog?.beforeSnapshot || latestLog?.afterSnapshot);

              return (
                <div
                  key={item.id}
                  onClick={() => onPreviewArticle(item)}
                  className={`group flex items-center justify-between p-3.5 px-4 hover:bg-slate-50 transition-colors text-xs cursor-pointer ${
                    isSelected ? 'bg-red-50/30' : ''
                  }`}
                >
                  {/* Left: Checkbox + Icon + Title + Tags */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                    <button
                      type="button"
                      onClick={(e) => handleToggleSelectOne(item.id, e)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-[#EA3A20]" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {renderItemIcon(item)}

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            // Only trigger floating tooltip if text is actually truncated/overflowed
                            if (el.scrollWidth > el.clientWidth + 1) {
                              const rect = el.getBoundingClientRect();
                              setHoveredTitle({
                                id: item.id,
                                title: item.title,
                                rect: {
                                  top: rect.top,
                                  left: rect.left,
                                  width: rect.width,
                                  height: rect.height
                                }
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredTitle(null)}
                          className="font-bold text-slate-800 truncate group-hover:text-[#EA3A20] transition-colors"
                        >
                          {item.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                        <span className="font-mono">{item.code}</span>
                        {item.fileSize && (
                          <>
                            <span>•</span>
                            <span>{item.fileSize}</span>
                          </>
                        )}
                        <span className="md:hidden">• {item.category}</span>
                        {item.reviewComment && (
                          <span className="text-red-600 bg-red-50 px-1.5 py-0.2 rounded font-medium truncate max-w-xs">
                            驳回原因: {item.reviewComment}
                          </span>
                        )}
                      </div>

                      {/* Paired tags snippet */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {item.tags.slice(0, 3).map((tagStr) => (
                            <React.Fragment key={tagStr}>
                              {renderPairedTagBadge(tagStr)}
                            </React.Fragment>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-[10px] text-slate-400">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle & Right Columns */}
                  <div className="flex items-center gap-6 shrink-0">
                    {/* Category */}
                    <div className="hidden md:block w-28 truncate text-[11px] text-slate-500 font-medium">
                      <span className="truncate block" title={item.category}>
                        {item.category.split('/').pop()?.trim() || item.category}
                      </span>
                    </div>

                    {/* OpType Badge Column */}
                    <div className="hidden sm:block w-24">
                      {renderOpBadge(item)}
                    </div>

                    {/* Applicant & Submit Time */}
                    <div className="hidden lg:block w-28 text-left">
                      <span className="text-slate-700 font-medium block truncate">
                        {item.author}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {item.updatedAt}
                      </span>
                    </div>

                    {/* Version */}
                    <div className="hidden xl:block w-20 text-left">
                      <span className="font-mono text-xs font-bold text-slate-700 block">
                        {item.version}
                      </span>
                    </div>

                    {/* Actions Column */}
                    <div
                      className="flex items-center gap-1 w-40 justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Diff View Button */}
                      {hasDiff && (
                        <button
                          onClick={() => setDiffArticle(item)}
                          title="查看版本 Diff 对比"
                          className="px-2 py-1 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                        >
                          <GitCompare className="w-3 h-3 text-[#EA3A20]" />
                          <span>Diff</span>
                        </button>
                      )}

                      {/* Detail Drawer */}
                      <button
                        onClick={() => onPreviewArticle(item)}
                        title="查看知识条目详情"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Pending Review Actions */}
                      {activeTab === '待复核' && (
                        <>
                          <button
                            onClick={() => {
                              setApprovingArticle(item);
                              setApprovalNote('');
                            }}
                            title="复核通过并发布"
                            className="px-2.5 py-1 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs text-[11px]"
                          >
                            <Check className="w-3 h-3" />
                            <span>通过</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectingArticle(item);
                              setRejectionReason('');
                            }}
                            title="复核驳回"
                            className="px-2 py-1 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                          >
                            <X className="w-3 h-3" />
                            <span>驳回</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <span>
            共 {filteredArticles.length} 条记录（当前状态：【{activeTab}】）
          </span>
          <span className="font-mono text-[10px]">
            平台审核管控模式: 严格风控已就绪
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: APPROVE CONFIRMATION */}
      {/* ========================================================================= */}
      {approvingArticle && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">确认复核通过并发布</h3>
                <p className="text-xs text-slate-400">通过后条目将正式进入向量知识库并上线生效</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
              <span className="font-bold text-slate-700 block truncate">{approvingArticle.title}</span>
              <p className="text-slate-500 flex items-center gap-2">
                <span>编码: {approvingArticle.code}</span>
                <span>•</span>
                <span>归属: {approvingArticle.category}</span>
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">管理员审批意见 (可选)</label>
              <textarea
                rows={3}
                placeholder="例如：经合规与技术核对无误，准予发布上线..."
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setApprovingArticle(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>确认通过发布</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REJECT CONFIRMATION */}
      {/* ========================================================================= */}
      {rejectingArticle && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">复核驳回与退回修改</h3>
                  <p className="text-xs text-slate-400">填写明确驳回原因以便业务作者针对性修改</p>
                </div>
              </div>
              <button
                onClick={() => setRejectingArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
              <span className="font-bold text-slate-700 block truncate">{rejectingArticle.title}</span>
              <p className="text-slate-500 flex items-center gap-2">
                <span>提审人: {rejectingArticle.author}</span>
                <span>•</span>
                <span>归属: {rejectingArticle.category}</span>
              </p>
            </div>

            {/* Quick Reason Suggestions */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-500 block">快捷选择驳回原因:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {quickRejectionTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (rejectionReason) {
                        setRejectionReason(`${rejectionReason}；${tag}`);
                      } else {
                        setRejectionReason(tag);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                <span className="text-red-500 mr-1">*</span>详细驳回理由与修改要求
              </label>
              <textarea
                rows={4}
                placeholder="请详细说明驳回原因，例如：缺少第三方机构检验报告、存在价格歧视风险..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setRejectingArticle(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>确认驳回退回</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BATCH REJECT */}
      {/* ========================================================================= */}
      {isBatchRejectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">批量驳回选中条目</h3>
                <p className="text-xs text-slate-400">将对 {selectedIds.size} 项条目统一执行复核驳回</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                <span className="text-red-500 mr-1">*</span>批量驳回理由
              </label>
              <textarea
                rows={3}
                placeholder="输入驳回意见..."
                value={batchRejectionReason}
                onChange={(e) => setBatchRejectionReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsBatchRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmBatchReject}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                确认批量驳回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DIFF COMPARISON MODAL (Identical to ArticleDetailDrawer Tab 1) */}
      {/* ========================================================================= */}
      {diffArticle && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-6xl w-full h-[90vh] shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <GitCompare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>版本 Diff 差异对比（复核审批）</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                      {diffArticle.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {diffReviewSummary.isNew ? '新建条目首次提审' : '版本迭代修改提审'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    对比【已发布版本】与【本次待复核版本】，精准核查正文、分类与业务标签修改
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <span className="text-xs text-slate-500 font-medium">当前复核状态:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    diffArticle.status === '等待复核'
                      ? 'bg-amber-100 text-amber-800'
                      : diffArticle.status === '已发布'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {diffArticle.status}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    {diffArticle.pendingVersion || diffArticle.version}
                  </span>
                </div>

                <button
                  onClick={() => setDiffArticle(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs bg-slate-50/30">
              {/* 1. Header Overview & Comparison Banner */}
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3.5">
                {/* Status Notice / Rejection Comment Banner */}
                {diffArticle.reviewComment && (
                  <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    diffArticle.status === '复核不通过'
                      ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                      : 'bg-amber-50/90 border-amber-200 text-amber-900'
                  }`}>
                    <ShieldAlert className="w-4 h-4 text-[#EA3A20] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span>管理员复核审批意见 / 驳回说明</span>
                        {diffArticle.reviewer && (
                          <span className="text-[11px] opacity-80 font-normal">
                            审核人: {diffArticle.reviewer} · {diffArticle.reviewedAt}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 leading-relaxed">{diffArticle.reviewComment}</p>
                    </div>
                  </div>
                )}

                {/* If newly created article notice */}
                {diffReviewSummary.isNew && (
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-2 text-xs">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold">该条目为首次录入新建，尚无已发布的历史版本</p>
                      <p className="text-[11px] text-blue-700">
                        左侧展示系统空基线，右侧展示本次提审录入的全部正文、分类、多媒体与标签规格（全量新增）。
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick Difference Metric Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-medium">线上已发布版本</span>
                    <span className="font-mono text-xs font-bold text-slate-700 block truncate mt-0.5">
                      {diffReviewSummary.leftItem?.version || '无历史版本'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-200/60">
                    <span className="text-[10px] text-purple-600 block font-medium">本次待复核版本</span>
                    <span className="font-mono text-xs font-bold text-purple-900 block truncate mt-0.5">
                      {diffReviewSummary.rightItem?.version || diffArticle.version}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-medium">标题与分类变更</span>
                    <span className="text-xs font-bold text-slate-700 block truncate mt-0.5">
                      {diffReviewSummary.isTitleDiff || diffReviewSummary.isCategoryDiff ? '存在属性调整' : '无变更（保持一致）'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-medium">标签体系差异</span>
                    <span className="text-xs font-bold text-slate-700 block truncate mt-0.5">
                      {diffReviewSummary.isTagsDiff ? '标签已增删调整' : '标签未修改'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. DUAL COLUMN DIFF VIEWER */}
              <div className="space-y-4">
                <DualColumnDiff
                  article={diffArticle}
                  leftVersionId={effectiveDiffLeftVersionId}
                  rightVersionId={effectiveDiffRightVersionId}
                  onSelectLeftVersion={setDiffLeftVersionId}
                  onSelectRightVersion={setDiffRightVersionId}
                  versionOptions={diffVersionOptions}
                  renderPairedTagBadge={renderPairedTagBadge}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0 flex-wrap gap-2">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>提审人: <strong className="text-slate-700">{diffArticle.author}</strong> ({diffArticle.updatedAt})</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const art = diffArticle;
                    setDiffArticle(null);
                    onPreviewArticle(art);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>查看完整条目详情</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDiffArticle(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  关闭
                </button>

                {diffArticle.status === '等待复核' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const art = diffArticle;
                        setDiffArticle(null);
                        setRejectingArticle(art);
                        setRejectionReason('');
                      }}
                      className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer transition-all shadow-2xs"
                    >
                      驳回申请
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const art = diffArticle;
                        setDiffArticle(null);
                        setApprovingArticle(art);
                        setApprovalNote('');
                      }}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>复核通过并发布</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tooltip for Truncated Titles on Hover */}
      {hoveredTitle && (
        <div
          style={{
            position: 'fixed',
            top: Math.max(12, hoveredTitle.rect.top - 8),
            left: Math.max(16, Math.min(window.innerWidth - 440, hoveredTitle.rect.left)),
            transform: 'translateY(-100%)',
            zIndex: 99999,
          }}
          className="pointer-events-none max-w-sm sm:max-w-md p-2.5 px-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700/80 text-xs font-normal leading-relaxed break-words animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-[#EA3A20]" />
            <span>知识条目完整标题</span>
          </div>
          <div className="font-bold text-slate-100 text-xs leading-normal select-none">
            {hoveredTitle.title}
          </div>
          {/* Tooltip downward pointer */}
          <div className="absolute left-6 -bottom-1 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/80" />
        </div>
      )}
    </div>
  );
};
