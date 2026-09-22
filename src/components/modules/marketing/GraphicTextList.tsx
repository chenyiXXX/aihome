import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  Eye,
  Trash2,
  Layers,
  Building2,
  ChevronRight,
  ExternalLink,
  Check,
  FileText,
  Smartphone,
  Tag,
  Palette,
  ArrowRight,
  Bot,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import {
  GraphicTextItem,
  GraphicTextStatus,
  generateWeChatArticleHtml
} from '../../../data/graphicTextData';

interface GraphicTextListProps {
  articles: GraphicTextItem[];
  onSelectArticle: (article: GraphicTextItem) => void;
  onCreateNew: () => void;
  onDeleteArticle: (id: string) => void;
  onRestoreArticle?: (id: string) => void;
  onPreviewArticle: (article: GraphicTextItem) => void;
}

export const GraphicTextList: React.FC<GraphicTextListProps> = ({
  articles,
  onSelectArticle,
  onCreateNew,
  onDeleteArticle,
  onRestoreArticle,
  onPreviewArticle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      // Status filter
      if (statusFilter === 'all') {
        // Exclude trash from "All"
        if (item.status === '回收站') return false;
      } else if (item.status !== statusFilter) {
        return false;
      }
      // Theme filter
      if (themeFilter !== 'all' && item.themeStyle !== themeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchProducts = item.linkedProducts.some((p) => p.toLowerCase().includes(q));
        const matchCase = item.linkedCase.name.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchProducts && !matchCase) {
          return false;
        }
      }
      return true;
    });
  }, [articles, statusFilter, themeFilter, searchQuery]);

  // Statistics across all 7 statuses
  const stats = useMemo(() => {
    const activeTotal = articles.filter((a) => a.status !== '回收站').length;
    const editing = articles.filter((a) => a.status === '编辑中').length;
    const synced = articles.filter((a) => a.status === '已同步到微信').length;
    const reviewing = articles.filter((a) => a.status === '发布审核中').length;
    const rejected = articles.filter((a) => a.status === '审核不通过').length;
    const scheduled = articles.filter((a) => a.status === '计划发布').length;
    const published = articles.filter((a) => a.status === '已发布').length;
    const trash = articles.filter((a) => a.status === '回收站').length;
    const totalReads = articles.reduce((acc, cur) => acc + (cur.readCount || 0), 0);
    return { activeTotal, editing, synced, reviewing, rejected, scheduled, published, trash, totalReads };
  }, [articles]);

  const handleCopyHtml = (article: GraphicTextItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const html = generateWeChatArticleHtml(article);
    navigator.clipboard.writeText(html);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, title: string, status: GraphicTextStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === '回收站') {
      if (window.confirm(`确定要彻底删除图文方案《${title}》吗？此操作无法撤销。`)) {
        onDeleteArticle(id);
      }
    } else {
      if (window.confirm(`确定要将图文方案《${title}》移入回收站吗？`)) {
        onDeleteArticle(id);
      }
    }
  };

  const handleRestore = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRestoreArticle) {
      onRestoreArticle(id);
    }
  };

  const getStatusBadgeStyle = (status: GraphicTextStatus) => {
    switch (status) {
      case '编辑中':
        return {
          pill: 'bg-sky-500/90 text-white',
          border: 'border-sky-300/40',
          dot: 'bg-sky-200'
        };
      case '已同步到微信':
        return {
          pill: 'bg-emerald-600/90 text-white',
          border: 'border-emerald-300/40',
          dot: 'bg-emerald-200'
        };
      case '发布审核中':
        return {
          pill: 'bg-amber-500/90 text-white',
          border: 'border-amber-300/40',
          dot: 'bg-amber-200'
        };
      case '审核不通过':
        return {
          pill: 'bg-rose-500/90 text-white',
          border: 'border-rose-300/40',
          dot: 'bg-rose-200'
        };
      case '计划发布':
        return {
          pill: 'bg-indigo-500/90 text-white',
          border: 'border-indigo-300/40',
          dot: 'bg-indigo-200'
        };
      case '已发布':
        return {
          pill: 'bg-[#EA3A20]/95 text-white',
          border: 'border-emerald-400/40',
          dot: 'bg-emerald-300'
        };
      case '回收站':
        return {
          pill: 'bg-slate-600/90 text-white',
          border: 'border-slate-400/40',
          dot: 'bg-slate-300'
        };
      default:
        return {
          pill: 'bg-slate-700/90 text-white',
          border: 'border-slate-500/40',
          dot: 'bg-slate-300'
        };
    }
  };

  const getThemeBadge = (style: GraphicTextItem['themeStyle']) => {
    switch (style) {
      case 'emerald':
        return { label: '墨绿高奢', bg: 'bg-[#EA3A20]/10 text-[#0F4A47] border-[#0F4A47]/20' };
      case 'dark':
        return { label: '极简黑白', bg: 'bg-zinc-800/10 text-zinc-800 border-zinc-300' };
      case 'warm':
        return { label: '暖调燕麦', bg: 'bg-amber-700/10 text-amber-800 border-amber-300' };
    }
  };

  // Status Tabs ordered exactly as requested
  const statusTabs = [
    { id: 'all', label: '全部方案', count: stats.activeTotal },
    { id: '编辑中', label: '编辑中', count: stats.editing },
    { id: '已同步到微信', label: '已同步到微信', count: stats.synced },
    { id: '发布审核中', label: '发布审核中', count: stats.reviewing },
    { id: '审核不通过', label: '审核不通过', count: stats.rejected },
    { id: '计划发布', label: '计划发布', count: stats.scheduled },
    { id: '已发布', label: '已发布', count: stats.published },
    { id: '回收站', label: '回收站', count: stats.trash }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar px-4 lg:px-6 pb-6 pt-1">
      <div className="max-w-[1600px] w-full mx-auto space-y-4">
        
        {/* ===================================================================== */}
        {/* 1. Header: Simplified Title & Action Button                           */}
        {/* ===================================================================== */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">图文生成</h1>
            <span className="text-xs text-slate-400 font-medium">（共 {stats.activeTotal} 篇）</span>
          </div>

          <button
            type="button"
            onClick={onCreateNew}
            className="h-9 px-4 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建图文</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* 2. Search & Filters Bar                                               */}
        {/* ===================================================================== */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-[#EA3A20] text-white shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Style Filter */}
          <div className="flex items-center gap-2.5">
            {/* Theme filter select */}
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F4A47] cursor-pointer"
            >
              <option value="all">全部色标风格</option>
              <option value="emerald">墨绿高奢 (Emerald)</option>
              <option value="dark">极简黑白 (Dark)</option>
              <option value="warm">暖调燕麦 (Warm)</option>
            </select>

            {/* Keyword Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索标题、关联产品或案例..."
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F4A47]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* 4. Article Cards Grid                                                 */}
        {/* ===================================================================== */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {statusFilter === '回收站' ? '回收站暂无图文方案' : '未检索到匹配的图文方案'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {statusFilter === '回收站'
                ? '被删除的图文方案将安全归档于此，您可以随时一键还原或彻底删除。'
                : '您可以更换搜索关键词或筛选状态，或直接点击下方按钮新建一篇高定图文方案。'}
            </p>
            {statusFilter !== '回收站' && (
              <button
                type="button"
                onClick={onCreateNew}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建图文</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredArticles.map((article) => {
              const theme = getThemeBadge(article.themeStyle);
              const badgeStyle = getStatusBadgeStyle(article.status);
              const isTrash = article.status === '回收站';
              const isRejected = article.status === '审核不通过';

              return (
                <div
                  key={article.id}
                  onClick={() => !isTrash && onSelectArticle(article)}
                  className={`bg-white rounded-2xl border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200 flex flex-col overflow-hidden group ${
                    isTrash
                      ? 'border-slate-200/60 opacity-80 cursor-default'
                      : 'border-slate-200/90 hover:border-[#0F4A47]/40 hover:shadow-md cursor-pointer'
                  }`}
                >
                  {/* Top Cover Image Stage */}
                  <div className="relative h-40 bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        !isTrash && 'group-hover:scale-102'
                      } ${isTrash && 'grayscale-40'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      {/* Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center gap-1 truncate shadow-xs border ${badgeStyle.pill} ${badgeStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badgeStyle.dot}`} />
                        <span className="truncate">{article.status}</span>
                      </span>

                      {/* Theme Badge */}
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md bg-white/90 shrink-0 ${theme.bg}`}
                      >
                        {theme.label}
                      </span>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
                      <div className="flex items-center gap-1.5 font-mono text-slate-200">
                        <span>{article.wordCount} 字</span>
                        <span>•</span>
                        <span>{article.publishPlatform}</span>
                      </div>
                      <span className="text-slate-300 font-mono">
                        {article.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-1.5">
                      <h3 className={`text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug min-h-[2.5rem] transition-colors ${
                        !isTrash && 'group-hover:text-[#0F4A47]'
                      }`}>
                        {article.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>

                      {/* Scheduled publish reminder */}
                      {article.status === '计划发布' && article.scheduledPublishTime && (
                        <div className="mt-2 px-2.5 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-1.5 text-[11px] text-indigo-700">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="font-medium truncate">计划发布：{article.scheduledPublishTime}</span>
                        </div>
                      )}

                      {/* Reject Reason Notice Box */}
                      {isRejected && article.auditRejectReason && (
                        <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-100/90 text-rose-700 text-[11px] leading-relaxed flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-bold">审核意见：</span>
                            <span className="text-rose-600 line-clamp-2">{article.auditRejectReason}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Linked Assets Info */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-medium">关联产品:</span>
                        {article.linkedProducts.slice(0, 2).map((p, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium truncate max-w-[110px]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <div className="flex items-center gap-1 truncate max-w-[150px]">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{article.linkedCase.name}</span>
                        </div>
                        {article.readCount ? (
                          <div className="flex items-center gap-1 font-mono text-slate-400 shrink-0">
                            <Eye className="w-3 h-3" />
                            <span>{article.readCount}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleCopyHtml(article, e)}
                          className="h-7 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="复制微信富文本 HTML 代码"
                        >
                          {copiedId === article.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>HTML</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewArticle(article);
                          }}
                          className="h-7 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="手机真机排版预览"
                        >
                          <Smartphone className="w-3 h-3 text-slate-500" />
                          <span>预览</span>
                        </button>

                        {isTrash ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handleRestore(article.id, e)}
                              className="h-7 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="还原至编辑中"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>还原</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(article.id, article.title, article.status, e)}
                              className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors"
                              title="彻底删除"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(article.id, article.title, article.status, e)}
                            className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors"
                            title="移入回收站"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {isTrash ? (
                        <span className="text-[10px] text-slate-400 italic shrink-0">已归档回收站</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectArticle(article)}
                          className="h-7 px-2.5 rounded-lg bg-[#EA3A20] hover:bg-[#d6341c] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0"
                        >
                          <Bot className="w-3 h-3" />
                          <span>工作台</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
