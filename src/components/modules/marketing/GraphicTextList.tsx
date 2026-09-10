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
  Bot
} from 'lucide-react';
import {
  GraphicTextItem,
  generateWeChatArticleHtml
} from '../../../data/graphicTextData';

interface GraphicTextListProps {
  articles: GraphicTextItem[];
  onSelectArticle: (article: GraphicTextItem) => void;
  onCreateNew: () => void;
  onDeleteArticle: (id: string) => void;
  onPreviewArticle: (article: GraphicTextItem) => void;
}

export const GraphicTextList: React.FC<GraphicTextListProps> = ({
  articles,
  onSelectArticle,
  onCreateNew,
  onDeleteArticle,
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
      if (statusFilter !== 'all' && item.status !== statusFilter) {
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

  // Statistics
  const stats = useMemo(() => {
    const total = articles.length;
    const synced = articles.filter((a) => a.status === '已同步微信草稿箱').length;
    const drafts = articles.filter((a) => a.status === '本地草稿').length;
    const pending = articles.filter((a) => a.status === '待审核').length;
    const totalReads = articles.reduce((acc, cur) => acc + (cur.readCount || 0), 0);
    return { total, synced, drafts, pending, totalReads };
  }, [articles]);

  const handleCopyHtml = (article: GraphicTextItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const html = generateWeChatArticleHtml(article);
    navigator.clipboard.writeText(html);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除图文方案《${title}》吗？`)) {
      onDeleteArticle(id);
    }
  };

  const getThemeBadge = (style: GraphicTextItem['themeStyle']) => {
    switch (style) {
      case 'emerald':
        return { label: '墨绿高奢', bg: 'bg-[#0F4A47]/10 text-[#0F4A47] border-[#0F4A47]/20' };
      case 'dark':
        return { label: '极简黑白', bg: 'bg-zinc-800/10 text-zinc-800 border-zinc-300' };
      case 'warm':
        return { label: '暖调燕麦', bg: 'bg-amber-700/10 text-amber-800 border-amber-300' };
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar p-5 lg:p-7">
      <div className="max-w-[1600px] w-full mx-auto space-y-5">
        
        {/* ===================================================================== */}
        {/* 1. Header: Simplified Title & Action Button                           */}
        {/* ===================================================================== */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">图文生成</h1>
            <span className="text-xs text-slate-400 font-medium">（共 {stats.total} 篇）</span>
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
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: '全部方案', count: stats.total },
              { id: '已同步微信草稿箱', label: '已同步微信', count: stats.synced },
              { id: '本地草稿', label: '本地草稿', count: stats.drafts },
              { id: '待审核', label: '待审核', count: stats.pending }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-[#0F4A47] text-white shadow-2xs'
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
            <h3 className="text-sm font-bold text-slate-800">未检索到匹配的图文方案</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              您可以更换搜索关键词或筛选状态，或直接点击下方按钮新建一篇高定图文方案。
            </p>
            <button
              type="button"
              onClick={onCreateNew}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F4A47] hover:bg-[#0b3836] text-white text-xs font-bold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建图文</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredArticles.map((article) => {
              const theme = getThemeBadge(article.themeStyle);
              return (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#0F4A47]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer"
                >
                  {/* Top Cover Image Stage */}
                  <div className="relative h-40 bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      {/* Status */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center gap-1 truncate ${
                          article.status === '已同步微信草稿箱'
                            ? 'bg-emerald-500/90 text-white shadow-xs'
                            : article.status === '待审核'
                            ? 'bg-amber-500/90 text-white shadow-xs'
                            : 'bg-slate-800/80 text-white'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
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
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0F4A47] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                        {article.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
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

                        <button
                          type="button"
                          onClick={(e) => handleDelete(article.id, article.title, e)}
                          className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectArticle(article)}
                        className="h-7 px-2.5 rounded-lg bg-[#0F4A47] hover:bg-[#0b3836] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0"
                      >
                        <Bot className="w-3 h-3" />
                        <span>工作台</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
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
