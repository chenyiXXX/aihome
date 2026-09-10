import React from 'react';
import {
  SlidersHorizontal,
  Globe,
  Calendar,
  Link2,
  ChevronDown,
  Check,
  X,
  Search,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { KBArticle } from '../../../types';

interface ArticlePermissionsTabProps {
  articleFormRegions: string[];
  setArticleFormRegions: React.Dispatch<React.SetStateAction<string[]>>;
  isRegionsDropdownOpen: boolean;
  setIsRegionsDropdownOpen: (val: boolean) => void;
  customRegionInput: string;
  setCustomRegionInput: (val: string) => void;
  PRESET_REGIONS: string[];
  articleFormExpiryType: 'permanent' | 'custom';
  setArticleFormExpiryType: (val: 'permanent' | 'custom') => void;
  articleFormStartDate?: string;
  setArticleFormStartDate?: (val: string) => void;
  articleFormEndDate?: string;
  setArticleFormEndDate?: (val: string) => void;
  articleFormExpiryDate?: string;
  setArticleFormExpiryDate?: (val: string) => void;
  articleFormRelatedIds: string[];
  setArticleFormRelatedIds: React.Dispatch<React.SetStateAction<string[]>>;
  relatedSearchQuery: string;
  setRelatedSearchQuery: (val: string) => void;
  isRelatedDropdownOpen: boolean;
  setIsRelatedDropdownOpen: (val: boolean) => void;
  contentList: KBArticle[];
  editingArticle: KBArticle | null;
}

export const ArticlePermissionsTab: React.FC<ArticlePermissionsTabProps> = ({
  articleFormRegions,
  setArticleFormRegions,
  isRegionsDropdownOpen,
  setIsRegionsDropdownOpen,
  customRegionInput,
  setCustomRegionInput,
  PRESET_REGIONS,
  articleFormExpiryType,
  setArticleFormExpiryType,
  articleFormStartDate = '',
  setArticleFormStartDate,
  articleFormEndDate = '',
  setArticleFormEndDate,
  articleFormExpiryDate = '',
  setArticleFormExpiryDate,
  articleFormRelatedIds,
  setArticleFormRelatedIds,
  relatedSearchQuery,
  setRelatedSearchQuery,
  isRelatedDropdownOpen,
  setIsRelatedDropdownOpen,
  contentList,
  editingArticle: _editingArticle
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentStartDate = articleFormStartDate || todayStr;
  const currentEndDate = articleFormEndDate || articleFormExpiryDate || '';

  // Calculate if end date is strictly before start date
  const isEndDateInvalid = Boolean(
    currentStartDate && currentEndDate && currentEndDate < currentStartDate
  );

  // Calculate day difference
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  const durationDays = calculateDays(currentStartDate, currentEndDate);

  const handleSetQuickDuration = (days: number) => {
    const base = new Date(currentStartDate || todayStr);
    base.setDate(base.getDate() + days);
    const newEnd = base.toISOString().split('T')[0];
    if (setArticleFormEndDate) {
      setArticleFormEndDate(newEnd);
    }
    if (setArticleFormExpiryDate) {
      setArticleFormExpiryDate(newEnd);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 text-xs">
      {/* 业务适用与有效期限配置面板 */}
      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-100 text-[#EA3A20] flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs">业务适用与有效期限配置</span>
              <span className="text-[11px] text-slate-400 ml-2">
                设置适用地区/语种、知识有效期限与关联知识条目（岗位权限已由所属分类统一部署）
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: 适用地区/语种* & 有效期限 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* 1. 适用地区/语种* (多选下拉框) */}
          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-red-500 mr-0.5">*</span>适用地区/语种 (多选)
              </label>
              <span className="text-[11px] text-emerald-600 font-medium">
                已选 {articleFormRegions.length} 个
              </span>
            </div>

            {/* Trigger Dropdown Button */}
            <div
              onClick={() => setIsRegionsDropdownOpen(!isRegionsDropdownOpen)}
              className="w-full min-h-[38px] p-2 bg-white border border-slate-200 rounded-xl text-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="flex flex-wrap gap-1 items-center max-w-[88%]">
                {articleFormRegions.length === 0 ? (
                  <span className="text-slate-400 text-xs">请选择适用地区/语种...</span>
                ) : (
                  articleFormRegions.map((region) => (
                    <span
                      key={region}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setArticleFormRegions(articleFormRegions.filter((r) => r !== region));
                      }}
                    >
                      {region}
                      <X className="w-2.5 h-2.5 hover:text-red-600" />
                    </span>
                  ))
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isRegionsDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Regions Dropdown Menu */}
            {isRegionsDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px]">
                  <span className="text-slate-400">选择目标市场/语言：</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setArticleFormRegions([...PRESET_REGIONS])}
                      className="text-emerald-600 hover:underline cursor-pointer"
                    >
                      全选
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleFormRegions([])}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      清空
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                  {PRESET_REGIONS.map((region) => {
                    const isChecked = articleFormRegions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setArticleFormRegions(articleFormRegions.filter((r) => r !== region));
                          } else {
                            setArticleFormRegions([...articleFormRegions, region]);
                          }
                        }}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50 text-emerald-900 font-medium'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{region}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom region input */}
                <div className="flex gap-1.5 pt-1.5 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="自定义地区/语种..."
                    value={customRegionInput}
                    onChange={(e) => setCustomRegionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customRegionInput.trim()) {
                        e.preventDefault();
                        if (!articleFormRegions.includes(customRegionInput.trim())) {
                          setArticleFormRegions([...articleFormRegions, customRegionInput.trim()]);
                        }
                        setCustomRegionInput('');
                      }
                    }}
                    className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customRegionInput.trim() && !articleFormRegions.includes(customRegionInput.trim())) {
                        setArticleFormRegions([...articleFormRegions, customRegionInput.trim()]);
                        setCustomRegionInput('');
                      }
                    }}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 cursor-pointer"
                  >
                    添加
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. 有效期限 (日期选择器: 永久有效 或 设置有效期) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                有效期限
              </label>
              <span className="text-[10px] text-slate-400">适用于限时政策或阶段性规范</span>
            </div>

            <div className="space-y-2.5">
              {/* Option Selector: 永久有效 vs 设置有效期 */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setArticleFormExpiryType('permanent')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    articleFormExpiryType === 'permanent'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      articleFormExpiryType === 'permanent'
                        ? 'border-amber-600 bg-amber-600'
                        : 'border-slate-300'
                    }`}
                  >
                    {articleFormExpiryType === 'permanent' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span>永久有效</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setArticleFormExpiryType('custom');
                    if (!articleFormStartDate && setArticleFormStartDate) {
                      setArticleFormStartDate(todayStr);
                    }
                    if (!articleFormEndDate && setArticleFormEndDate) {
                      const nextYear = new Date();
                      nextYear.setFullYear(nextYear.getFullYear() + 1);
                      const defaultEnd = nextYear.toISOString().split('T')[0];
                      setArticleFormEndDate(defaultEnd);
                      if (setArticleFormExpiryDate) setArticleFormExpiryDate(defaultEnd);
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    articleFormExpiryType === 'custom'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      articleFormExpiryType === 'custom'
                        ? 'border-amber-600 bg-amber-600'
                        : 'border-slate-300'
                    }`}
                  >
                    {articleFormExpiryType === 'custom' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span>设置有效期</span>
                </button>
              </div>

              {/* Custom Validity Range: Start Date & End Date */}
              {articleFormExpiryType === 'custom' && (
                <div className="p-3 bg-white border border-amber-200/90 rounded-xl space-y-3 shadow-2xs animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-start">
                    {/* 开始日期 */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <span className="text-red-500">*</span>开始日期
                      </label>
                      <input
                        type="date"
                        value={currentStartDate}
                        onChange={(e) => {
                          const newStart = e.target.value;
                          if (setArticleFormStartDate) {
                            setArticleFormStartDate(newStart);
                          }
                          if (currentEndDate && currentEndDate < newStart) {
                            const newEndObj = new Date(newStart);
                            newEndObj.setMonth(newEndObj.getMonth() + 3);
                            const adjustedEnd = newEndObj.toISOString().split('T')[0];
                            if (setArticleFormEndDate) setArticleFormEndDate(adjustedEnd);
                            if (setArticleFormExpiryDate) setArticleFormExpiryDate(adjustedEnd);
                          }
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    {/* 结束日期 */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span className="text-red-500">*</span>结束日期
                        </label>
                        <span className="text-[10px] text-slate-400">不能早于开始日期</span>
                      </div>
                      <input
                        type="date"
                        value={currentEndDate}
                        min={currentStartDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (setArticleFormEndDate) setArticleFormEndDate(val);
                          if (setArticleFormExpiryDate) setArticleFormExpiryDate(val);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 ${
                          isEndDateInvalid
                            ? 'bg-rose-50 border border-rose-300 text-rose-900 focus:ring-rose-500'
                            : 'bg-slate-50 border border-slate-200 text-slate-800 focus:ring-amber-500 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Validation Alert when End Date < Start Date */}
                  {isEndDateInvalid ? (
                    <div className="flex items-center gap-1.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-bold text-rose-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>结束日期（{currentEndDate}）不能小于开始日期（{currentStartDate}），请重新选择！</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-medium text-amber-800">
                        <span>有效期跨度:</span>
                        <span className="font-bold font-mono text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded">
                          {durationDays} 天
                        </span>
                        {currentStartDate && currentEndDate && (
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            ({currentStartDate} <ArrowRight className="inline w-2.5 h-2.5" /> {currentEndDate})
                          </span>
                        )}
                      </div>

                      {/* Quick Duration Preset Buttons */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">快捷:</span>
                        {[
                          { label: '30天', days: 30 },
                          { label: '90天', days: 90 },
                          { label: '半年', days: 180 },
                          { label: '1年', days: 365 }
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            type="button"
                            onClick={() => handleSetQuickDuration(btn.days)}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-[10px] text-slate-600 transition-colors cursor-pointer"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. 关联条目 (搜索选择框) */}
        <div className="space-y-1.5 pt-3 border-t border-slate-200/60">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-indigo-600" />
              关联知识条目 (搜索选择框)
            </label>
            <span className="text-[11px] text-indigo-600 font-medium">
              已关联 {articleFormRelatedIds.length} 篇知识
            </span>
          </div>

          {/* Selected Related Articles Chips */}
          {articleFormRelatedIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200 max-h-24 overflow-y-auto custom-scrollbar">
              {articleFormRelatedIds.map((rId) => {
                const relatedArt = contentList.find((a) => a.id === rId);
                if (!relatedArt) return null;
                return (
                  <span
                    key={rId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-medium shadow-2xs"
                  >
                    <span className="font-mono text-[10px] text-indigo-600">{relatedArt.code}</span>
                    <span className="truncate max-w-[200px]">{relatedArt.title}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setArticleFormRelatedIds(articleFormRelatedIds.filter((id) => id !== rId))
                      }
                      className="text-indigo-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Related Article Search & Select Trigger */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="搜索知识条目标题或编号关联其他条目..."
                  value={relatedSearchQuery}
                  onChange={(e) => {
                    setRelatedSearchQuery(e.target.value);
                    setIsRelatedDropdownOpen(true);
                  }}
                  onFocus={() => setIsRelatedDropdownOpen(true)}
                  className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                />
                {relatedSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setRelatedSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsRelatedDropdownOpen(!isRelatedDropdownOpen)}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl font-medium hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs text-xs"
              >
                <span>浏览全部</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isRelatedDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Related Articles Dropdown Selection */}
            {isRelatedDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1 max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-1.5 px-2 border-b border-slate-100 text-[11px] text-slate-400">
                  <span>点击条目加入关联知识</span>
                  <button
                    type="button"
                    onClick={() => setIsRelatedDropdownOpen(false)}
                    className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                  >
                    关闭
                  </button>
                </div>

                {contentList
                  .filter((art) => {
                    // Filter out current article being edited
                    if (_editingArticle && art.id === _editingArticle.id) return false;
                    if (!relatedSearchQuery.trim()) return true;
                    const q = relatedSearchQuery.toLowerCase();
                    return (
                      art.title.toLowerCase().includes(q) ||
                      art.code.toLowerCase().includes(q) ||
                      art.category.toLowerCase().includes(q)
                    );
                  })
                  .slice(0, 15)
                  .map((art) => {
                    const isSelected = articleFormRelatedIds.includes(art.id);
                    return (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setArticleFormRelatedIds(
                              articleFormRelatedIds.filter((id) => id !== art.id)
                            );
                          } else {
                            setArticleFormRelatedIds([...articleFormRelatedIds, art.id]);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-medium'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 max-w-[85%]">
                          <div
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <div>
                            <div className="truncate font-medium">{art.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                              <span>{art.code}</span>
                              <span>·</span>
                              <span className="text-slate-500">{art.category}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {art.fileType || 'MD'}
                        </span>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
