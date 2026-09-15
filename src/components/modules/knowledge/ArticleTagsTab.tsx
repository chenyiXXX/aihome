import React from 'react';
import { Tag, X, Search, Check, Plus } from 'lucide-react';
import { KBArticle, KBTag } from '../../../types';

interface ArticleTagsTabProps {
  articleFormTags: string;
  setArticleFormTags: (val: string) => void;
  tagList: KBTag[];
  setTagList: React.Dispatch<React.SetStateAction<KBTag[]>>;
  contentList: KBArticle[];
  articleModalTab: 'builtin' | 'custom';
  setArticleModalTab: (val: 'builtin' | 'custom') => void;
  articleModalTagSearch: string;
  setArticleModalTagSearch: (val: string) => void;
  articleModalInlineAddValue: Record<string, string>;
  setArticleModalInlineAddValue: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isArticleModalAddingDim: boolean;
  setIsArticleModalAddingDim: (val: boolean) => void;
  articleModalNewDimName: string;
  setArticleModalNewDimName: (val: string) => void;
  articleModalNewDimValues: string;
  setArticleModalNewDimValues: (val: string) => void;
  parseTagPair: (str: string) => { key: string; value: string };
  showToast: (msg: string) => void;
}

export const ArticleTagsTab: React.FC<ArticleTagsTabProps> = ({
  articleFormTags,
  setArticleFormTags,
  tagList,
  setTagList,
  contentList,
  articleModalTab,
  setArticleModalTab,
  articleModalTagSearch,
  setArticleModalTagSearch,
  articleModalInlineAddValue,
  setArticleModalInlineAddValue,
  isArticleModalAddingDim,
  setIsArticleModalAddingDim,
  articleModalNewDimName,
  setArticleModalNewDimName,
  articleModalNewDimValues,
  setArticleModalNewDimValues,
  parseTagPair,
  showToast
}) => {
  const selectedTagList = articleFormTags
    .split(/[,，\n]/)
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3.5 animate-in fade-in duration-150 text-xs">
      {/* Selected Tags Top Bar */}
      <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#EA3A20]" />
            <span className="font-bold text-slate-800">已选标签</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold">
              {selectedTagList.length}
            </span>
          </div>

          {articleFormTags.trim() && (
            <button
              type="button"
              onClick={() => setArticleFormTags('')}
              className="text-[11px] text-slate-400 hover:text-red-600 cursor-pointer px-2 py-0.5 rounded hover:bg-red-50 transition-colors"
            >
              清空已选
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap min-h-[32px]">
          {selectedTagList.length === 0 && (
            <span className="text-xs text-slate-400 py-1">
              暂无已选标签，请在下方点击候选词或新建维度
            </span>
          )}

          {selectedTagList.map((tagStr, idx) => {
            const { key, value } = parseTagPair(tagStr);

            return (
              <span
                key={idx}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white text-slate-800 text-xs px-2.5 py-1 shadow-2xs gap-1.5 transition-all"
              >
                <span className="font-medium">
                  {value ? (
                    <>
                      <span className="text-slate-500">{key}:</span> {value}
                    </>
                  ) : (
                    key
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setArticleFormTags(
                      selectedTagList.filter((_, i) => i !== idx).join(', ')
                    );
                  }}
                  className="text-slate-400 hover:text-red-600 cursor-pointer transition-colors ml-0.5"
                  title="移除此标签"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Main Selection Area: Unified Company Tags */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-3">
        {/* Header & Search Filter */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-xs">公司通用标签库</span>
            <span className="text-[10px] text-slate-400">所有标签全员统一可用</span>
          </div>

          {/* Filter Search */}
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索标签维度或候选词..."
              value={articleModalTagSearch}
              onChange={(e) => setArticleModalTagSearch(e.target.value)}
              className="w-full pl-8 pr-6 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
            />
            {articleModalTagSearch && (
              <button
                type="button"
                onClick={() => setArticleModalTagSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Unified Tag Dimensions List */}
        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          {tagList
            .filter((t) => {
              if (!articleModalTagSearch.trim()) return true;
              const q = articleModalTagSearch.toLowerCase().trim();
              return (
                t.name.toLowerCase().includes(q) ||
                t.values?.some((v) => v.toLowerCase().includes(q))
              );
            })
            .map((t) => {
              const currentTags = articleFormTags
                .split(/[,，\n]/)
                .map((str) => str.trim())
                .filter(Boolean);

              return (
                <div
                  key={t.id}
                  className="p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  {/* Left: Tag Key */}
                  <div className="flex items-center gap-2 sm:w-28 shrink-0">
                    <span className="font-semibold text-slate-800 text-xs">{t.name}</span>
                  </div>

                  {/* Right: Candidate Values Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap flex-1">
                    {(t.values || []).map((v) => {
                      const pairStr1 = `${t.name}: ${v}`;
                      const pairStr2 = `${t.name}:${v}`;
                      const isSelected = currentTags.some(
                        (ct) => ct === pairStr1 || ct === pairStr2 || ct === v
                      );

                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setArticleFormTags(
                                currentTags
                                  .filter((ct) => ct !== pairStr1 && ct !== pairStr2 && ct !== v)
                                  .join(', ')
                              );
                            } else {
                              setArticleFormTags([...currentTags, `${t.name}: ${v}`].join(', '));
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-all flex items-center gap-1 select-none ${
                            isSelected
                              ? 'bg-[#EA3A20] text-white border-[#EA3A20] font-semibold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{v}</span>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[2.5]" />}
                        </button>
                      );
                    })}

                    {/* Inline Add Value */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="+ 添加值"
                        value={articleModalInlineAddValue[t.id] || ''}
                        onChange={(e) =>
                          setArticleModalInlineAddValue((prev) => ({
                            ...prev,
                            [t.id]: e.target.value
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const rawVal = articleModalInlineAddValue[t.id]?.trim();
                            if (!rawVal) return;
                            if (!t.values?.includes(rawVal)) {
                              const updated = [...(t.values || []), rawVal];
                              setTagList((prev) =>
                                prev.map((item) =>
                                  item.id === t.id ? { ...item, values: updated } : item
                                )
                              );
                            }
                            // Auto select it
                            const pairStr = `${t.name}: ${rawVal}`;
                            if (!currentTags.includes(pairStr)) {
                              setArticleFormTags([...currentTags, pairStr].join(', '));
                            }
                            setArticleModalInlineAddValue((prev) => ({
                              ...prev,
                              [t.id]: ''
                            }));
                          }
                        }}
                        className="w-20 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Quick Add Tag Dimension */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
          {isArticleModalAddingDim ? (
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              <input
                type="text"
                placeholder="新维度名 (如: 客群定位)"
                value={articleModalNewDimName}
                onChange={(e) => setArticleModalNewDimName(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs w-36 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
              />
              <input
                type="text"
                placeholder="候选值 (逗号分隔, 如: 豪宅业主, 精英白领)"
                value={articleModalNewDimValues}
                onChange={(e) => setArticleModalNewDimValues(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs flex-1 min-w-[160px] focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
              />
              <button
                type="button"
                onClick={() => {
                  const dimName = articleModalNewDimName.trim();
                  if (!dimName) return;
                  const vals = articleModalNewDimValues
                    .split(/[,，\n]/)
                    .map((v) => v.trim())
                    .filter(Boolean);
                  const newTag: KBTag = {
                    id: `TAG-${Date.now()}`,
                    name: dimName,
                    values: vals,
                    builtinValues: [],
                    color: 'indigo',
                    categoryGroup: '公司通用',
                    isBuiltin: false,
                    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    creator: '管理员'
                  };
                  setTagList((prev) => [...prev, newTag]);
                  setIsArticleModalAddingDim(false);
                  setArticleModalNewDimName('');
                  setArticleModalNewDimValues('');
                  showToast(`已创建通用标签维度「${dimName}」`);
                }}
                className="px-3 py-1 bg-[#EA3A20] text-white rounded-lg text-xs font-semibold hover:bg-[#c42810] cursor-pointer"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setIsArticleModalAddingDim(false)}
                className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer hover:bg-slate-300"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsArticleModalAddingDim(true)}
              className="w-full py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#EA3A20]" />
              <span>新建标签维度</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
