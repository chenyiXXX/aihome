import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  ShieldCheck,
  X,
  Plus,
  CheckSquare,
  Square,
  Sparkles,
  Info
} from 'lucide-react';
import { initialKBArticles, initialKBCategories } from '../../../data/mockData';
import { KBArticle } from '../../../types';

export interface SelectedKBArticleItem {
  id: string;
  title: string;
  code: string;
  category: string;
}

interface KnowledgeBaseSelectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  selectedArticles: SelectedKBArticleItem[];
  onToggleCategory: (categoryName: string, articlesInCategory: KBArticle[]) => void;
  onToggleArticle: (article: SelectedKBArticleItem) => void;
  onClearSelection: () => void;
  onInsertQuoteToInput?: (quoteText: string) => void;
  currentUserRole?: string;
}

export const KnowledgeBaseSelectorDrawer: React.FC<KnowledgeBaseSelectorDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  selectedArticles,
  onToggleCategory,
  onToggleArticle,
  onClearSelection,
  onInsertQuoteToInput,
  currentUserRole = '超级管理员 (Superadmin)'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    '材质与环保认证': true,
    '产品与工艺百科': true,
    '海运包装与CBM': true,
    '外贸业务与商务谈判': false,
    '报关认证与海关编码': false,
    '品牌实力与企业荣誉': false
  });

  // Group published articles into clean, intuitive category buckets
  const categoryGroups = useMemo(() => {
    const published = initialKBArticles.filter(
      (a) => a.status === '已发布' || a.status === '等待复核' || a.status === '草稿'
    );

    const groups: Record<
      string,
      {
        name: string;
        code: string;
        description: string;
        articles: KBArticle[];
      }
    > = {
      '材质与环保认证': {
        name: '材质与环保认证',
        code: 'KB-CAT-MAT',
        description: '涵盖欧洲FSC森林认证、美标CARB P2/TSCA、E0级防潮多层板标准',
        articles: []
      },
      '产品与工艺百科': {
        name: '产品与工艺百科',
        code: 'KB-CAT-TECH',
        description: '高定柜体激光封边、进口百隆Blum五金系统、岩板与实木加工',
        articles: []
      },
      '海运包装与CBM': {
        name: '海运包装与CBM',
        code: 'KB-CAT-PKG',
        description: 'ISTA 3A抗跌落海运防损包装、40HQ集装箱容积率排柜核算',
        articles: []
      },
      '外贸业务与商务谈判': {
        name: '外贸业务与商务谈判',
        code: 'KB-CAT-SOP',
        description: '大单商务谈判SOP、3F异议化解话术、30%定金与交期锁价',
        articles: []
      },
      '报关认证与海关编码': {
        name: '报关认证与海关编码',
        code: 'KB-CAT-CUSTOMS',
        description: '欧美及中东清关申报单证、HS商品编码退税与商检要求',
        articles: []
      },
      '品牌实力与企业荣誉': {
        name: '品牌实力与企业荣誉',
        code: 'KB-CAT-BRAND',
        description: '品爱超级工厂智造实力、全球工程案例交付与资质背书',
        articles: []
      }
    };

    published.forEach((art) => {
      const catStr = (art.category || '').toLowerCase();
      const titleStr = (art.title || '').toLowerCase();

      if (catStr.includes('报关') || catStr.includes('ce') || catStr.includes('退税') || titleStr.includes('海关编码')) {
        groups['报关认证与海关编码'].articles.push(art);
      } else if (catStr.includes('海运') || catStr.includes('cbm') || catStr.includes('包装') || titleStr.includes('ista') || titleStr.includes('装箱')) {
        groups['海运包装与CBM'].articles.push(art);
      } else if (catStr.includes('品牌') || titleStr.includes('工厂') || titleStr.includes('实力')) {
        groups['品牌实力与企业荣誉'].articles.push(art);
      } else if (catStr.includes('销售') || catStr.includes('谈判') || catStr.includes('sop') || titleStr.includes('异议')) {
        groups['外贸业务与商务谈判'].articles.push(art);
      } else if (catStr.includes('柜类') || catStr.includes('门墙') || catStr.includes('门窗') || catStr.includes('全卫') || catStr.includes('工艺') || titleStr.includes('五金') || titleStr.includes('封边')) {
        groups['产品与工艺百科'].articles.push(art);
      } else {
        groups['材质与环保认证'].articles.push(art);
      }
    });

    return groups;
  }, []);

  // Filter groups and articles by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return categoryGroups;
    }
    const q = searchQuery.toLowerCase().trim();
    const result: Record<string, (typeof categoryGroups)[string]> = {};

    Object.entries(categoryGroups).forEach(([key, group]) => {
      const matchesGroup =
        group.name.toLowerCase().includes(q) ||
        group.description.toLowerCase().includes(q) ||
        group.code.toLowerCase().includes(q);

      const matchingArticles = group.articles.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.code.toLowerCase().includes(q) ||
          (art.category && art.category.toLowerCase().includes(q))
      );

      if (matchesGroup || matchingArticles.length > 0) {
        result[key] = {
          ...group,
          articles: matchesGroup ? group.articles : matchingArticles
        };
      }
    });

    return result;
  }, [categoryGroups, searchQuery]);

  const toggleExpand = (catName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // When whole category is selected, standalone articles exclude those belonging to selected categories
  const standaloneSelectedArticles = useMemo(() => {
    return selectedArticles.filter(
      (art) => !selectedCategories.includes(art.category || '')
    );
  }, [selectedArticles, selectedCategories]);

  const totalSelectedCount = selectedCategories.length + standaloneSelectedArticles.length;

  if (!isOpen) return null;

  return (
    <div className="w-[360px] lg:w-[400px] border-l border-slate-200/90 bg-slate-50/50 flex flex-col shrink-0 h-full overflow-hidden transition-all duration-300">
      {/* Drawer Header */}
      <div className="p-3.5 px-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>授权知识库</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold">
                问答引用
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">勾选知识分类或条目，精准圈定回答范围</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          title="收起知识库侧边栏"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Authorized Account Banner */}
      <div className="px-4 py-2 bg-purple-50/60 border-b border-purple-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-purple-900 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
          <span className="truncate">
            账号：<strong className="font-semibold">{currentUserRole}</strong>
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
          全库可见
        </span>
      </div>

      {/* Search Input */}
      <div className="p-3 bg-white border-b border-slate-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索知识分类或知识条目标题..."
            className="h-8 pl-8 pr-7 w-full rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F4A47] focus:border-[#0F4A47]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Items Status / Action Bar */}
      <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="font-bold">已选引用：</span>
          <span
            className={`font-mono font-bold px-1.5 py-0.2 rounded text-[11px] ${
              totalSelectedCount > 0 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {totalSelectedCount}
          </span>
          <span className="text-slate-400 text-[11px]">项</span>
        </div>

        {totalSelectedCount > 0 && (
          <button
            type="button"
            onClick={onClearSelection}
            className="text-[11px] text-red-600 hover:text-red-700 font-medium cursor-pointer flex items-center gap-1 hover:underline"
          >
            清空所有引用
          </button>
        )}
      </div>

      {/* Categories & Articles Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {Object.keys(filteredGroups).length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs px-4">
            未检索到匹配的知识库分类或条目，请调整关键词。
          </div>
        ) : (
          Object.entries(filteredGroups).map(([groupName, group]) => {
            const isCategorySelected = selectedCategories.includes(groupName);
            const isExpanded = expandedCategories[groupName] ?? true;

            // Count selected articles inside this group
            const selectedArticlesInGroupCount = group.articles.filter((a) =>
              selectedArticles.some((sa) => sa.id === a.id)
            ).length;

            return (
              <div
                key={groupName}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isCategorySelected
                    ? 'bg-purple-50/40 border-purple-300 shadow-2xs'
                    : 'bg-white border-slate-200/90 shadow-2xs'
                }`}
              >
                {/* Category Header Row */}
                <div className="p-2.5 px-3 flex items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Checkbox for Category selection */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCategory(groupName, group.articles);
                        if (!isCategorySelected) {
                          // Auto collapse category to keep drawer view clean and simplified
                          setExpandedCategories((prev) => ({ ...prev, [groupName]: false }));
                        }
                      }}
                      className="cursor-pointer text-slate-400 hover:text-purple-700 transition-colors shrink-0"
                      title={isCategorySelected ? '取消选中该分类' : '选中整个知识分类（包含该类目全部条目）'}
                    >
                      {isCategorySelected ? (
                        <div className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded border border-slate-300 hover:border-purple-600 bg-white" />
                      )}
                    </button>

                    {/* Category Title & Icon */}
                    <div
                      onClick={() => toggleExpand(groupName)}
                      className="flex items-center gap-1.5 cursor-pointer min-w-0 flex-1"
                    >
                      <Folder
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isCategorySelected ? 'text-purple-600' : 'text-slate-500'
                        }`}
                      />
                      <span className="font-bold text-xs text-slate-800 truncate">
                        {groupName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono shrink-0">
                        {group.articles.length}篇
                      </span>
                    </div>
                  </div>

                  {/* Right: Expand Toggle */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCategorySelected ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold shadow-2xs">
                        已整类引用
                      </span>
                    ) : selectedArticlesInGroupCount > 0 ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-mono">
                        已选{selectedArticlesInGroupCount}条
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toggleExpand(groupName)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                      title={isExpanded ? '收起条目' : '展开条目'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Subtext description */}
                <div className="px-3 pb-2 text-[10px] text-slate-400 line-clamp-1">
                  {group.description}
                </div>

                {/* Articles List inside Category */}
                {isExpanded && group.articles.length > 0 && (
                  <div className="border-t border-slate-100 bg-slate-50/40 p-1.5 space-y-1">
                    {isCategorySelected && (
                      <div className="p-2 px-2.5 rounded-xl bg-purple-100/70 border border-purple-200 text-purple-950 text-[11px] flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Folder className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span>已整类勾选，仅需引用分类名称即可生效</span>
                        </div>
                        <span className="text-[10px] text-purple-700 font-mono">共{group.articles.length}篇</span>
                      </div>
                    )}
                    {group.articles.map((article) => {
                      const isArticleSelected =
                        isCategorySelected || selectedArticles.some((sa) => sa.id === article.id);

                      return (
                        <div
                          key={article.id}
                          onClick={() =>
                            onToggleArticle({
                              id: article.id,
                              title: article.title,
                              code: article.code,
                              category: groupName
                            })
                          }
                          className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2 ${
                            isArticleSelected
                              ? 'bg-purple-50/90 border-purple-200 text-purple-950 shadow-2xs'
                              : 'bg-white hover:bg-slate-100/80 border-slate-200/80 text-slate-800'
                          }`}
                        >
                          {/* Article Checkbox */}
                          <div className="mt-0.5 shrink-0">
                            {isArticleSelected ? (
                              <div className="w-3.5 h-3.5 rounded bg-purple-600 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            ) : (
                              <div className="w-3.5 h-3.5 rounded border border-slate-300 bg-white" />
                            )}
                          </div>

                          {/* Article Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-[11px] font-bold line-clamp-2 leading-snug">
                                {article.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                              <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {article.code}
                              </span>
                              {isCategorySelected ? (
                                <span className="text-purple-700 bg-purple-100/90 px-1.5 py-0.2 rounded border border-purple-200 text-[10px] font-medium">
                                  随分类整选
                                </span>
                              ) : (
                                <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100">
                                  {article.status}
                                </span>
                              )}
                              {article.fileType && (
                                <span className="text-slate-500">
                                  {article.fileType}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick quote button */}
                          {onInsertQuoteToInput && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onInsertQuoteToInput(`《${article.title}》`);
                              }}
                              className="shrink-0 p-1 text-slate-400 hover:text-purple-700 hover:bg-purple-100/50 rounded cursor-pointer transition-colors"
                              title="将本条目书名号引用插入到输入框"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Instructions */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>引用提示</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          已勾选的分类或知识条目将自动作为上下文引用，对话模型将优先针对所圈定的知识范围精准回答。
        </p>
      </div>
    </div>
  );
};
