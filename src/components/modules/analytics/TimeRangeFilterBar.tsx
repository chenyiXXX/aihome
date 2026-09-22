import React from 'react';
import { Calendar, CalendarRange, Clock, Sparkles } from 'lucide-react';
import {
  TimeFilterState,
  TimeRangeMode,
  getTimePeriodLabel,
  SYSTEM_LAUNCH_DATE,
  AVAILABLE_YEARS,
  getAvailableMonths,
  getAvailableQuarters
} from './analyticsTimeUtils';

interface TimeRangeFilterBarProps {
  filter: TimeFilterState;
  onChange: (filter: TimeFilterState) => void;
}

const PRESET_OPTIONS: { key: TimeRangeMode; label: string }[] = [
  { key: '7d', label: '近 7 天' },
  { key: '30d', label: '近 30 天' },
  { key: 'custom_range', label: '指定日期范围' },
  { key: 'month', label: '指定月份' },
  { key: 'quarter', label: '指定季节' },
  { key: 'year', label: '指定年份' },
  { key: 'all', label: '全周期' }
];

export const TimeRangeFilterBar: React.FC<TimeRangeFilterBarProps> = ({ filter, onChange }) => {
  const handleModeChange = (mode: TimeRangeMode) => {
    // When switching to month or quarter, make sure they match 2026 rules
    const nextMonth = filter.year === 2026 && filter.month < 11 ? 11 : filter.month;
    const nextQuarter = filter.year === 2026 ? 4 : filter.quarter;
    onChange({
      ...filter,
      mode,
      month: nextMonth,
      quarter: nextQuarter
    });
  };

  const periodLabel = getTimePeriodLabel(filter);
  const availableMonths = getAvailableMonths(filter.year);
  const availableQuarters = getAvailableQuarters(filter.year);

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] space-y-3">
      {/* Top Pills Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            时间范围:
          </span>
          <div className="bg-slate-50 p-1 rounded-2xl border border-slate-100 flex items-center gap-1 flex-wrap">
            {PRESET_OPTIONS.map((item) => {
              const isActive = filter.mode === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleModeChange(item.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EA3A20] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Label Display */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-[#EA3A20]" />
          <span className="font-medium">当前统计范围:</span>
          <span className="font-bold text-slate-900">{periodLabel}</span>
        </div>
      </div>

      {/* Contextual Selector Controls */}
      {filter.mode === 'custom_range' && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 animate-fade-in text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <CalendarRange className="w-4 h-4 text-[#EA3A20]" />
            指定日期范围:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">起始 (最早 2026-11-01):</label>
            <input
              type="date"
              min={SYSTEM_LAUNCH_DATE}
              value={filter.startDate < SYSTEM_LAUNCH_DATE ? SYSTEM_LAUNCH_DATE : filter.startDate}
              onChange={(e) => onChange({ ...filter, startDate: e.target.value })}
              className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] cursor-pointer"
            />
          </div>
          <span className="text-slate-400">至</span>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">截止:</label>
            <input
              type="date"
              min={SYSTEM_LAUNCH_DATE}
              value={filter.endDate}
              onChange={(e) => onChange({ ...filter, endDate: e.target.value })}
              className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onChange({ ...filter, startDate: '2026-11-01', endDate: '2026-11-20' })}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] cursor-pointer"
            >
              上线至今 (11-01~11-20)
            </button>
            <button
              onClick={() => onChange({ ...filter, startDate: '2026-11-14', endDate: '2026-11-20' })}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] cursor-pointer"
            >
              近 7 天 (11-14~11-20)
            </button>
            <button
              onClick={() => onChange({ ...filter, startDate: '2026-11-01', endDate: '2026-11-30' })}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] cursor-pointer"
            >
              11月全周期 (11-01~11-30)
            </button>
          </div>
        </div>
      )}

      {filter.mode === 'month' && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 animate-fade-in text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#EA3A20]" />
            选择指定月份:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">年份:</label>
            <select
              value={filter.year}
              onChange={(e) => {
                const y = Number(e.target.value);
                const m = y === 2026 ? 11 : 1;
                onChange({ ...filter, year: y, month: m });
              }}
              className="h-8 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] cursor-pointer"
            >
              {AVAILABLE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y} 年 (上线年)
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">月份:</label>
            <select
              value={filter.month}
              onChange={(e) => onChange({ ...filter, month: Number(e.target.value) })}
              className="h-8 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m.month} value={m.month}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-[11px] text-slate-400">
            * 2026年1月-10月系统尚未上线无数据，已过滤
          </span>
        </div>
      )}

      {filter.mode === 'quarter' && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 animate-fade-in text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            选择指定季节 / 季度:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">年份:</label>
            <select
              value={filter.year}
              onChange={(e) => onChange({ ...filter, year: Number(e.target.value) })}
              className="h-8 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#EA3A20] cursor-pointer"
            >
              {AVAILABLE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y} 年
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {availableQuarters.map((q) => {
              const isSelected = filter.quarter === q.quarter;
              return (
                <button
                  key={q.quarter}
                  onClick={() => onChange({ ...filter, quarter: q.quarter })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{q.label}</span>
                  <span className="ml-1 opacity-80 text-[10px]">({q.season} · {q.months})</span>
                </button>
              );
            })}
          </div>
          <span className="text-[11px] text-slate-400">
            * 2026年前三季度 (Q1/Q2/Q3) 系统尚未上线，已过滤
          </span>
        </div>
      )}

      {filter.mode === 'year' && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 animate-fade-in text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#EA3A20]" />
            选择指定年份:
          </span>
          <div className="flex items-center gap-1.5">
            {AVAILABLE_YEARS.map((y) => {
              const isSelected = filter.year === y;
              return (
                <button
                  key={y}
                  onClick={() => onChange({ ...filter, year: y })}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#EA3A20] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {y} 全年度 (11月上线运营至今)
                </button>
              );
            })}
          </div>
          <span className="text-[11px] text-slate-400">
            * 系统于 2026 年 11 月上线，2026 之前年份无历史数据，已过滤
          </span>
        </div>
      )}
    </div>
  );
};
