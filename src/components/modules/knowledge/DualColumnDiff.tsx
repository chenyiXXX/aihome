import React, { useMemo } from 'react';
import {
  GitCompare,
  ArrowRight,
  Plus,
  Minus,
  Equal,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  Tag as TagIcon,
  Shield,
  FileText,
  HelpCircle
} from 'lucide-react';
import { KBAuditLog, KBArticle } from '../../../types';

export interface VersionOption {
  id: string;
  version: string;
  label: string;
  timestamp: string;
  operator: string;
  operatorRole?: string;
  wasPublished?: boolean;
  status: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  log?: KBAuditLog;
}

interface DualColumnDiffProps {
  article: KBArticle;
  leftVersionId: string;
  rightVersionId: string;
  onSelectLeftVersion: (id: string) => void;
  onSelectRightVersion: (id: string) => void;
  versionOptions: VersionOption[];
  onRollbackToVersion?: (targetVersion: VersionOption) => void;
  renderPairedTagBadge?: (tagStr: string) => React.ReactNode;
}

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed' | 'modified';
  leftLine?: string;
  leftNum?: number;
  rightLine?: string;
  rightNum?: number;
}

/**
 * Line by line diff algorithm with basic LCS alignment
 */
function computeLineDiff(leftText: string, rightText: string): DiffLine[] {
  const leftLines = leftText.split('\n');
  const rightLines = rightText.split('\n');

  // If text is identical
  if (leftText === rightText) {
    return leftLines.map((line, idx) => ({
      type: 'unchanged',
      leftLine: line,
      leftNum: idx + 1,
      rightLine: line,
      rightNum: idx + 1
    }));
  }

  // Dynamic programming LCS matrix for alignment
  const n = leftLines.length;
  const m = rightLines.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (leftLines[i - 1] === rightLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build aligned diff
  const result: DiffLine[] = [];
  let i = n;
  let j = m;

  const stack: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      stack.push({
        type: 'unchanged',
        leftLine: leftLines[i - 1],
        leftNum: i,
        rightLine: rightLines[j - 1],
        rightNum: j
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({
        type: 'added',
        rightLine: rightLines[j - 1],
        rightNum: j
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      stack.push({
        type: 'removed',
        leftLine: leftLines[i - 1],
        leftNum: i
      });
      i--;
    }
  }

  return stack.reverse();
}

export const DualColumnDiff: React.FC<DualColumnDiffProps> = ({
  article,
  leftVersionId,
  rightVersionId,
  onSelectLeftVersion,
  onSelectRightVersion,
  versionOptions,
  onRollbackToVersion,
  renderPairedTagBadge
}) => {
  const leftItem = versionOptions.find((v) => v.id === leftVersionId) || versionOptions[0];
  const rightItem = versionOptions.find((v) => v.id === rightVersionId) || versionOptions[versionOptions.length - 1];

  // Compute diff lines for the main content
  const diffLines = useMemo(() => {
    return computeLineDiff(leftItem?.content || '', rightItem?.content || '');
  }, [leftItem?.content, rightItem?.content]);

  // Statistics
  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    diffLines.forEach((l) => {
      if (l.type === 'added') added++;
      else if (l.type === 'removed') removed++;
      else unchanged++;
    });

    const isTitleChanged = (leftItem?.title || '') !== (rightItem?.title || '');
    const isCategoryChanged = (leftItem?.category || '') !== (rightItem?.category || '');
    const isStatusChanged = (leftItem?.status || '') !== (rightItem?.status || '');
    const leftTags = leftItem?.tags || [];
    const rightTags = rightItem?.tags || [];
    const tagsAdded = rightTags.filter((t) => !leftTags.includes(t));
    const tagsRemoved = leftTags.filter((t) => !rightTags.includes(t));

    return {
      added,
      removed,
      unchanged,
      isTitleChanged,
      isCategoryChanged,
      isStatusChanged,
      tagsAdded,
      tagsRemoved,
      hasAnyDiff: added > 0 || removed > 0 || isTitleChanged || isCategoryChanged || isStatusChanged || tagsAdded.length > 0 || tagsRemoved.length > 0
    };
  }, [diffLines, leftItem, rightItem]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs">
      {/* Header Bar: Selector & Comparison Controls */}
      <div className="flex flex-col gap-3.5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">版本内容可视化 Diff 对比 (Side-by-Side)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  多版本比对
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                支持自由选择基准版本与目标版本，精准对比正文、属性、标签与元数据变更
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold font-mono">
              <Plus className="w-3 h-3" /> +{stats.added} 行新增
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold font-mono">
              <Minus className="w-3 h-3" /> -{stats.removed} 行删除
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[11px] font-medium font-mono">
              <Equal className="w-3 h-3" /> {stats.unchanged} 行相同
            </span>
          </div>
        </div>

        {/* Version Pickers Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Left Version Selector */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                <span>基准版本 (左侧/旧版本)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {leftItem?.timestamp || '初始记录'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={leftVersionId}
                onChange={(e) => onSelectLeftVersion(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 shadow-2xs"
              >
                {versionOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.version} - {v.label} ({v.timestamp})
                  </option>
                ))}
              </select>

              {onRollbackToVersion && leftItem && leftItem.id !== 'current' && (
                <button
                  type="button"
                  onClick={() => onRollbackToVersion(leftItem)}
                  className="px-2.5 py-1.5 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs active:scale-95"
                  title="回滚到左侧选中的基准版本"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>回滚此版</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>操作人: {leftItem?.operator} {leftItem?.operatorRole ? `(${leftItem.operatorRole})` : ''}</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                leftItem?.status === '已发布'
                  ? 'bg-emerald-50 text-emerald-700'
                  : leftItem?.status === '等待复核'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {leftItem?.status}
              </span>
            </div>
          </div>

          {/* Right Version Selector */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>比对目标版本 (右侧/新版本)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {rightItem?.timestamp || '最新'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={rightVersionId}
                onChange={(e) => onSelectRightVersion(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 shadow-2xs"
              >
                {versionOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.version} - {v.label} ({v.timestamp})
                  </option>
                ))}
              </select>

              {onRollbackToVersion && rightItem && rightItem.id !== 'current' && (
                <button
                  type="button"
                  onClick={() => onRollbackToVersion(rightItem)}
                  className="px-2.5 py-1.5 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs active:scale-95"
                  title="回滚到右侧选中的目标版本"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>回滚此版</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>操作人: {rightItem?.operator} {rightItem?.operatorRole ? `(${rightItem.operatorRole})` : ''}</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                rightItem?.status === '已发布'
                  ? 'bg-emerald-50 text-emerald-700'
                  : rightItem?.status === '等待复核'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {rightItem?.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Properties Diff Bar (Title, Category, Tags) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>属性与分类元数据差异</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {stats.isTitleChanged || stats.isCategoryChanged || stats.tagsAdded.length > 0 || stats.tagsRemoved.length > 0
              ? '⚠️ 检测到属性变更'
              : '✓ 属性与元数据完全一致'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Left Meta */}
          <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-100 pb-1 font-mono">
              <span>基准属性 [{leftItem?.version}]</span>
              <span>{leftItem?.status}</span>
            </div>
            <div className="space-y-1.5">
              <div>
                <span className="text-[11px] text-slate-400 block">文档标题:</span>
                <p className={`text-xs leading-snug p-1 rounded ${stats.isTitleChanged ? 'text-rose-800 bg-rose-50 border border-rose-200 font-bold' : 'text-slate-800 font-medium'}`}>
                  {leftItem?.title || article.title}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">所属分类目录:</span>
                <p className={`text-[11px] p-1 rounded ${stats.isCategoryChanged ? 'text-rose-800 bg-rose-50 border border-rose-200 font-bold' : 'text-slate-600'}`}>
                  {leftItem?.category || article.category}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">标准标签集:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(leftItem?.tags && leftItem.tags.length > 0) ? (
                    leftItem.tags.map((tag, idx) => {
                      const isRemoved = stats.tagsRemoved.includes(tag);
                      return (
                        <span
                          key={idx}
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            isRemoved
                              ? 'bg-rose-50 text-rose-700 border-rose-200 line-through opacity-80'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {tag}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">无标签</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Meta */}
          <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-100 pb-1 font-mono">
              <span>目标属性 [{rightItem?.version}]</span>
              <span>{rightItem?.status}</span>
            </div>
            <div className="space-y-1.5">
              <div>
                <span className="text-[11px] text-slate-400 block">文档标题:</span>
                <p className={`text-xs leading-snug p-1 rounded ${stats.isTitleChanged ? 'text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold' : 'text-slate-800 font-medium'}`}>
                  {rightItem?.title || article.title}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">所属分类目录:</span>
                <p className={`text-[11px] p-1 rounded ${stats.isCategoryChanged ? 'text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold' : 'text-slate-600'}`}>
                  {rightItem?.category || article.category}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">标准标签集:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(rightItem?.tags && rightItem.tags.length > 0) ? (
                    rightItem.tags.map((tag, idx) => {
                      const isAdded = stats.tagsAdded.includes(tag);
                      return (
                        <span
                          key={idx}
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            isAdded
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold ring-1 ring-emerald-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {tag}
                          {isAdded && ' (+)'}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">无标签</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Side-by-Side Diff Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>正文逐行比对 (Line-by-Line Unified Diff)</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            基准: {leftItem?.version} ↔ 目标: {rightItem?.version}
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-slate-800 font-mono text-[11px] leading-relaxed shadow-2xs">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-slate-100/90 border-b border-slate-200 text-slate-600 text-[11px] font-semibold py-2 px-3">
            <div className="flex items-center justify-between pr-3 border-r border-slate-200">
              <span className="text-rose-700 font-medium">基准版本 ({leftItem?.version})</span>
              <span className="text-[10px] text-slate-500 font-normal">[-] 移除或修改前</span>
            </div>
            <div className="flex items-center justify-between pl-3">
              <span className="text-emerald-700 font-medium">目标版本 ({rightItem?.version})</span>
              <span className="text-[10px] text-slate-500 font-normal">[+] 新增或修改后</span>
            </div>
          </div>

          {/* Lines Container */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {diffLines.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-sans">
                两版本正文内容完全一致，未发现任何差异。
              </div>
            ) : (
              diffLines.map((line, idx) => {
                if (line.type === 'unchanged') {
                  return (
                    <div key={idx} className="grid grid-cols-2 hover:bg-slate-50/80 transition-colors">
                      {/* Left */}
                      <div className="flex items-start border-r border-slate-200 pr-2 py-1 select-text">
                        <span className="w-8 text-right text-slate-400 select-none text-[10px] pr-2 shrink-0 font-mono">
                          {line.leftNum}
                        </span>
                        <span className="text-slate-700 whitespace-pre-wrap break-all flex-1">
                          {line.leftLine || ' '}
                        </span>
                      </div>
                      {/* Right */}
                      <div className="flex items-start pl-2 py-1 select-text">
                        <span className="w-8 text-right text-slate-400 select-none text-[10px] pr-2 shrink-0 font-mono">
                          {line.rightNum}
                        </span>
                        <span className="text-slate-700 whitespace-pre-wrap break-all flex-1">
                          {line.rightLine || ' '}
                        </span>
                      </div>
                    </div>
                  );
                }

                if (line.type === 'removed') {
                  return (
                    <div key={idx} className="grid grid-cols-2 bg-rose-50/50 hover:bg-rose-50/70 transition-colors">
                      {/* Left: Removed content */}
                      <div className="flex items-start border-r border-slate-200 pr-2 py-1 select-text bg-rose-50/70">
                        <span className="w-8 text-right text-rose-600 select-none text-[10px] pr-2 shrink-0 font-mono font-bold">
                          - {line.leftNum}
                        </span>
                        <span className="text-rose-900 whitespace-pre-wrap break-all flex-1 font-medium bg-rose-100/90 px-1 rounded-xs">
                          {line.leftLine}
                        </span>
                      </div>
                      {/* Right: Empty */}
                      <div className="flex items-start pl-2 py-1 select-none text-slate-400 bg-slate-50/40">
                        <span className="w-8 text-right text-slate-300 text-[10px] pr-2 shrink-0 font-mono">
                          ...
                        </span>
                        <span className="text-slate-400 italic text-[10px]">(目标版本中已删除)</span>
                      </div>
                    </div>
                  );
                }

                if (line.type === 'added') {
                  return (
                    <div key={idx} className="grid grid-cols-2 bg-emerald-50/50 hover:bg-emerald-50/70 transition-colors">
                      {/* Left: Empty */}
                      <div className="flex items-start border-r border-slate-200 pr-2 py-1 select-none text-slate-400 bg-slate-50/40">
                        <span className="w-8 text-right text-slate-300 text-[10px] pr-2 shrink-0 font-mono">
                          ...
                        </span>
                        <span className="text-slate-400 italic text-[10px]">(基准版本无此行)</span>
                      </div>
                      {/* Right: Added content */}
                      <div className="flex items-start pl-2 py-1 select-text bg-emerald-50/70">
                        <span className="w-8 text-right text-emerald-600 select-none text-[10px] pr-2 shrink-0 font-mono font-bold">
                          + {line.rightNum}
                        </span>
                        <span className="text-emerald-900 whitespace-pre-wrap break-all flex-1 font-medium bg-emerald-100/90 px-1 rounded-xs">
                          {line.rightLine}
                        </span>
                      </div>
                    </div>
                  );
                }

                return null;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
