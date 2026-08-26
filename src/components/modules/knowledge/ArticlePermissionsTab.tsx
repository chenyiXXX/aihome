import React from 'react';
import {
  SlidersHorizontal,
  Users,
  Globe,
  ShieldCheck,
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
  articleFormRoles: string[];
  setArticleFormRoles: React.Dispatch<React.SetStateAction<string[]>>;
  isRolesDropdownOpen: boolean;
  setIsRolesDropdownOpen: (val: boolean) => void;
  customRoleInput: string;
  setCustomRoleInput: (val: string) => void;
  PRESET_ROLES: string[];
  articleFormRegions: string[];
  setArticleFormRegions: React.Dispatch<React.SetStateAction<string[]>>;
  isRegionsDropdownOpen: boolean;
  setIsRegionsDropdownOpen: (val: boolean) => void;
  customRegionInput: string;
  setCustomRegionInput: (val: string) => void;
  PRESET_REGIONS: string[];
  articleFormSecurityLevel: '公开' | '内部' | '机密';
  setArticleFormSecurityLevel: (val: '公开' | '内部' | '机密') => void;
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
  articleFormRoles,
  setArticleFormRoles,
  isRolesDropdownOpen,
  setIsRolesDropdownOpen,
  customRoleInput,
  setCustomRoleInput,
  PRESET_ROLES,
  articleFormRegions,
  setArticleFormRegions,
  isRegionsDropdownOpen,
  setIsRegionsDropdownOpen,
  customRegionInput,
  setCustomRegionInput,
  PRESET_REGIONS,
  articleFormSecurityLevel,
  setArticleFormSecurityLevel,
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
  editingArticle
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
      {/* 业务适用与权限管控配置面板 */}
      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-100 text-[#EA3A20] flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs">业务适用与权限管控配置</span>
              <span className="text-[11px] text-slate-400 ml-2">
                设置岗位分权、适用区域、保密等级、有效期与关联知识
              </span>
            </div>
          </div>
        </div>

        {/* Grid 1: 适用岗位* & 适用地区/语种* */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 1. 适用岗位* (多选下拉框) */}
          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-red-500 mr-0.5">*</span>适用岗位 (多选)
              </label>
              <span className="text-[11px] text-blue-600 font-medium">
                已选 {articleFormRoles.length} 个
              </span>
            </div>

            {/* Trigger Dropdown Button */}
            <div
              onClick={() => setIsRolesDropdownOpen(!isRolesDropdownOpen)}
              className="w-full min-h-[38px] p-2 bg-white border border-slate-200 rounded-xl text-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="flex flex-wrap gap-1 items-center max-w-[88%]">
                {articleFormRoles.length === 0 ? (
                  <span className="text-slate-400 text-xs">请选择适用岗位...</span>
                ) : (
                  articleFormRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setArticleFormRoles(articleFormRoles.filter((r) => r !== role));
                      }}
                    >
                      {role}
                      <X className="w-2.5 h-2.5 hover:text-red-600" />
                    </span>
                  ))
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isRolesDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Roles Dropdown Menu */}
            {isRolesDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px]">
                  <span className="text-slate-400">选择适用岗位：</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setArticleFormRoles([...PRESET_ROLES])}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      全选
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleFormRoles([])}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      清空
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                  {PRESET_ROLES.map((role) => {
                    const isChecked = articleFormRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setArticleFormRoles(articleFormRoles.filter((r) => r !== role));
                          } else {
                            setArticleFormRoles([...articleFormRoles, role]);
                          }
                        }}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50 text-blue-800 font-medium'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{role}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom role input */}
                <div className="flex gap-1.5 pt-1.5 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="自定义其他岗位..."
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customRoleInput.trim()) {
                        e.preventDefault();
                        if (!articleFormRoles.includes(customRoleInput.trim())) {
                          setArticleFormRoles([...articleFormRoles, customRoleInput.trim()]);
                        }
                        setCustomRoleInput('');
                      }
                    }}
                    className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customRoleInput.trim() && !articleFormRoles.includes(customRoleInput.trim())) {
                        setArticleFormRoles([...articleFormRoles, customRoleInput.trim()]);
                        setCustomRoleInput('');
                      }
                    }}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 cursor-pointer"
                  >
                    添加
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. 适用地区/语种* (多选下拉框) */}
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
        </div>

        {/* Grid 2: 知识密级 (单选按钮) & 有效期限 (日期选择器) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 border-t border-slate-200/60">
          {/* 3. 知识密级 (单选按钮: 公开 / 内部 / 机密) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              知识密级 (单选)
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  level: '公开' as const,
                  desc: '对客户公开',
                  color: 'text-emerald-700 bg-emerald-50 border-emerald-300'
                },
                {
                  level: '内部' as const,
                  desc: '仅员工可见',
                  color: 'text-blue-700 bg-blue-50 border-blue-300'
                },
                {
                  level: '机密' as const,
                  desc: '特权授权',
                  color: 'text-rose-700 bg-rose-50 border-rose-300'
                }
              ].map((item) => {
                const isSelected = articleFormSecurityLevel === item.level;
                return (
                  <label
                    key={item.level}
                    onClick={() => setArticleFormSecurityLevel(item.level)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? `${item.color} font-bold ring-2 ring-offset-1 ring-slate-400 shadow-xs`
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="securityLevel"
                        checked={isSelected}
                        onChange={() => setArticleFormSecurityLevel(item.level)}
                        className="w-3 h-3 text-[#EA3A20] focus:ring-[#EA3A20]"
                      />
                      <span className="text-xs">{item.level}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. 有效期限 (日期选择器: 永久有效 或 设置有效期) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                有效期限
              </label>
              <span className="text-[10px] text-slate-400">适用于限时政策、促销话术或阶段性规范</span>
            </div>

            <div className="space-y-2.5">
              {/* Option Selector: 永久有效 vs 设置有效期 */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setArticleFormExpiryType('permanent')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    articleFormExpiryType === 'permanent'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
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
                    if (!currentEndDate) {
                      const d = new Date(currentStartDate || todayStr);
                      d.setMonth(d.getMonth() + 3);
                      const defaultEnd = d.toISOString().split('T')[0];
                      if (setArticleFormEndDate) setArticleFormEndDate(defaultEnd);
                      if (setArticleFormExpiryDate) setArticleFormExpiryDate(defaultEnd);
                    }
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    articleFormExpiryType === 'custom'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
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
                          // If current end date is earlier than new start date, auto advance end date
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
                    currentStartDate &&
                    currentEndDate && (
                      <div className="flex items-center justify-between text-[11px] bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/80 text-amber-900">
                        <span className="flex items-center gap-1">
                          <span>📅 有效期限：</span>
                          <strong className="font-mono text-slate-800">{currentStartDate}</strong>
                          <span className="text-slate-400 mx-0.5">至</span>
                          <strong className="font-mono text-slate-800">{currentEndDate}</strong>
                        </span>
                        <span className="font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded text-[10px]">
                          共 {durationDays} 天有效
                        </span>
                      </div>
                    )
                  )}

                  {/* Quick Duration Preset Buttons (calculated from Start Date) */}
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">快捷延展区间:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleSetQuickDuration(30)}
                        className="px-2 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                      >
                        +30天 (1个月)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDuration(90)}
                        className="px-2 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                      >
                        +90天 (1季度)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDuration(180)}
                        className="px-2 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                      >
                        +180天 (半年)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDuration(365)}
                        className="px-2 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                      >
                        +1年 (12个月)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. 关联条目 (搜索选择框，关联知识库中的其他相关条目) */}
        <div className="pt-2 border-t border-slate-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-indigo-600" />
              关联条目 (搜索选择框)
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
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsRelatedDropdownOpen(!isRelatedDropdownOpen)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isRelatedDropdownOpen ? '收起列表' : '浏览选择'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isRelatedDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Dropdown list of articles */}
            {isRelatedDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 space-y-1 max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[11px] text-slate-400 flex justify-between">
                  <span>知识库条目列表 (点击关联/取消)</span>
                  <button
                    type="button"
                    onClick={() => setIsRelatedDropdownOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
                {contentList
                  .filter((art) => !editingArticle || art.id !== editingArticle.id)
                  .filter((art) => {
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
