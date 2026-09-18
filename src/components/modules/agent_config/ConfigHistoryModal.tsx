import React, { useState } from 'react';
import {
  History,
  X,
  Search,
  Clock,
  User,
  Shield,
  FileCode,
  Sliders,
  Cpu,
  Layers,
  Sparkles,
  ToggleLeft,
  CheckCircle2,
  ArrowRight,
  Filter,
  Download,
  FileText
} from 'lucide-react';
import { ConfigChangeRecord } from '../../../types';

interface ConfigHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTitle: string;
  targetType: 'agent' | 'skill';
  targetCode?: string;
  records: ConfigChangeRecord[];
}

export const ConfigHistoryModal: React.FC<ConfigHistoryModalProps> = ({
  isOpen,
  onClose,
  targetTitle,
  targetType,
  targetCode,
  records
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const downloadFileContent = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadOldFile = (rec: ConfigChangeRecord, fileName?: string) => {
    if (rec.fileDiffs && rec.fileDiffs.length > 0) {
      const targetDiff = fileName ? rec.fileDiffs.find((f) => f.fileName === fileName) : rec.fileDiffs[0];
      if (targetDiff && targetDiff.oldContent !== undefined) {
        const name = targetDiff.fileName;
        const lastDot = name.lastIndexOf('.');
        const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
        const ext = lastDot !== -1 ? name.slice(lastDot) : '.txt';
        const cleanTime = rec.timestamp.replace(/[: -]/g, '');
        downloadFileContent(`${baseName}_旧版_${cleanTime}${ext}`, targetDiff.oldContent);
        return;
      }
    }
    if (rec.oldFilesSnapshot && rec.oldFilesSnapshot.length > 0) {
      const targetFile = fileName ? rec.oldFilesSnapshot.find((f) => f.name === fileName) : rec.oldFilesSnapshot[0];
      if (targetFile) {
        const name = targetFile.name;
        const lastDot = name.lastIndexOf('.');
        const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
        const ext = lastDot !== -1 ? name.slice(lastDot) : '.txt';
        const cleanTime = rec.timestamp.replace(/[: -]/g, '');
        downloadFileContent(`${baseName}_旧版_${cleanTime}${ext}`, targetFile.content);
        return;
      }
    }
    const fallback = `// [修改前旧版本源码文件]\n// 技能: ${rec.targetName}\n// 操作人: ${rec.operatorName}\n// 修改时间: ${rec.timestamp}\n\nexport function handler() {\n  // 原始旧版逻辑代码\n}\n`;
    downloadFileContent(`${rec.targetName}_旧版源码_${rec.timestamp.replace(/[: -]/g, '')}.ts`, fallback);
  };

  const handleDownloadNewFile = (rec: ConfigChangeRecord, fileName?: string) => {
    if (rec.fileDiffs && rec.fileDiffs.length > 0) {
      const targetDiff = fileName ? rec.fileDiffs.find((f) => f.fileName === fileName) : rec.fileDiffs[0];
      if (targetDiff && targetDiff.newContent !== undefined) {
        const name = targetDiff.fileName;
        const lastDot = name.lastIndexOf('.');
        const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
        const ext = lastDot !== -1 ? name.slice(lastDot) : '.txt';
        const cleanTime = rec.timestamp.replace(/[: -]/g, '');
        downloadFileContent(`${baseName}_新版_${cleanTime}${ext}`, targetDiff.newContent);
        return;
      }
    }
    if (rec.newFilesSnapshot && rec.newFilesSnapshot.length > 0) {
      const targetFile = fileName ? rec.newFilesSnapshot.find((f) => f.name === fileName) : rec.newFilesSnapshot[0];
      if (targetFile) {
        const name = targetFile.name;
        const lastDot = name.lastIndexOf('.');
        const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
        const ext = lastDot !== -1 ? name.slice(lastDot) : '.txt';
        const cleanTime = rec.timestamp.replace(/[: -]/g, '');
        downloadFileContent(`${baseName}_新版_${cleanTime}${ext}`, targetFile.content);
        return;
      }
    }
    const fallback = `// [修改后新版本源码文件]\n// 技能: ${rec.targetName}\n// 操作人: ${rec.operatorName}\n// 修改时间: ${rec.timestamp}\n\nexport function handler() {\n  // 优化后的新版逻辑代码\n}\n`;
    downloadFileContent(`${rec.targetName}_新版源码_${rec.timestamp.replace(/[: -]/g, '')}.ts`, fallback);
  };

  const handleDownloadComparisonBundle = (rec: ConfigChangeRecord) => {
    const comparisonData = {
      recordId: rec.id,
      skillName: rec.targetName,
      operator: rec.operatorName,
      timestamp: rec.timestamp,
      changeSummary: rec.changeSummary,
      fileDiffs: rec.fileDiffs || [],
      oldFilesSnapshot: rec.oldFilesSnapshot || [],
      newFilesSnapshot: rec.newFilesSnapshot || []
    };
    const jsonStr = JSON.stringify(comparisonData, null, 2);
    downloadFileContent(`${rec.targetName}_新旧源码对比包_${rec.timestamp.replace(/[: -]/g, '')}.json`, jsonStr);
  };

  if (!isOpen) return null;

  // Filter records
  const filteredRecords = records.filter((rec) => {
    // Type filter
    if (selectedType !== 'all' && rec.changeType !== selectedType) {
      return false;
    }
    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchOperator = rec.operatorName.toLowerCase().includes(q);
    const matchRole = rec.operatorRole?.toLowerCase().includes(q) || false;
    const matchSummary = rec.changeSummary.toLowerCase().includes(q);
    const matchDiff = rec.diffDetails?.some(
      (d) =>
        d.field.toLowerCase().includes(q) ||
        d.before.toLowerCase().includes(q) ||
        d.after.toLowerCase().includes(q)
    ) || false;

    return matchOperator || matchRole || matchSummary || matchDiff;
  });

  const getChangeTypeBadge = (type: ConfigChangeRecord['changeType']) => {
    switch (type) {
      case 'prompt':
        return { label: '提示词', bg: 'bg-purple-50 text-purple-700 border-purple-200/80', icon: Sparkles };
      case 'model':
        return { label: '模型底座', bg: 'bg-blue-50 text-blue-700 border-blue-200/80', icon: Cpu };
      case 'parameter':
        return { label: '参数配置', bg: 'bg-amber-50 text-amber-700 border-amber-200/80', icon: Sliders };
      case 'skills':
        return { label: '技能挂载', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', icon: Layers };
      case 'status':
        return { label: '启停状态', bg: 'bg-rose-50 text-rose-700 border-rose-200/80', icon: ToggleLeft };
      case 'files':
        return { label: '文件/代码', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80', icon: FileCode };
      case 'trigger':
        return { label: '触发机制', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/80', icon: Clock };
      default:
        return { label: '配置调整', bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Sliders };
    }
  };

  const handleExportHistory = () => {
    const exportData = {
      target: targetTitle,
      type: targetType,
      code: targetCode,
      exportTime: new Date().toISOString(),
      totalRecords: records.length,
      history: records
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${targetType}_${targetCode || 'item'}_修改记录_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F4A47]/10 text-[#0F4A47] flex items-center justify-center shadow-2xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {targetTitle} · 修改记录
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                  共 {records.length} 次变更
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{targetType === 'agent' ? '智能体 Agent 配置审计' : '技能 Skill 配置审计'}</span>
                {targetCode && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[11px] text-slate-600">{targetCode}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportHistory}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="导出修改记录为 JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出记录</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索修改用户、变更说明、字段详情..."
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0F4A47]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: '全部' },
              { id: 'prompt', label: '提示词' },
              { id: 'model', label: '模型' },
              { id: 'parameter', label: '参数' },
              { id: 'skills', label: '技能' },
              { id: 'files', label: '文件/代码' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer font-medium ${
                  selectedType === tab.id
                    ? 'bg-[#0F4A47] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {filteredRecords.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <History className="w-10 h-10 text-slate-300 mx-auto stroke-[1.5]" />
              <div className="text-xs font-medium text-slate-500">
                {searchQuery || selectedType !== 'all' ? '未检索到匹配的修改记录' : '暂无修改记录'}
              </div>
              <div className="text-[11px] text-slate-400">
                修改并保存配置后，系统将自动留存完整的审计日志
              </div>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {filteredRecords.map((rec, idx) => {
                const badge = getChangeTypeBadge(rec.changeType);
                const BadgeIcon = badge.icon;
                const isLatest = idx === 0 && selectedType === 'all' && !searchQuery;

                return (
                  <div key={rec.id || idx} className="relative group">
                    {/* Timeline node */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isLatest
                          ? 'bg-emerald-500 border-emerald-200 text-white shadow-xs ring-4 ring-emerald-50'
                          : 'bg-white border-slate-300 text-slate-500'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-white' : 'bg-slate-400'}`} />
                    </div>

                    {/* Record Card */}
                    <div className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs transition-all space-y-3">
                      {/* Card Header: User, Time, Type Tag */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{rec.operatorName}</span>
                          {rec.operatorRole && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                              {rec.operatorRole}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${badge.bg}`}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {rec.timestamp}
                          </span>

                          {isLatest && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                              当前生效中
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Change Summary */}
                      <div className="text-xs font-semibold text-slate-800">
                        {rec.changeSummary}
                      </div>

                      {/* Diff details table (if present) */}
                      {rec.diffDetails && rec.diffDetails.length > 0 && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 overflow-hidden text-xs space-y-2">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            变更详情明细 ({rec.diffDetails.length} 项)
                          </div>
                          <div className="divide-y divide-slate-200/60">
                            {rec.diffDetails.map((diff, dIdx) => (
                              <div key={dIdx} className="py-2 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                <div className="font-medium text-slate-700 sm:w-1/3 shrink-0 text-xs">
                                  {diff.field}
                                </div>
                                <div className="flex-1 flex items-center gap-2 text-xs">
                                  {/* Old value */}
                                  <div className="flex-1 px-2 py-1 rounded bg-rose-50/70 border border-rose-200/60 text-rose-800 break-all font-mono text-[11px]">
                                    <span className="text-[10px] text-rose-400 mr-1 font-sans">前:</span>
                                    {diff.before || '空'}
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {/* New value */}
                                  <div className="flex-1 px-2 py-1 rounded bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 break-all font-mono text-[11px] font-bold">
                                    <span className="text-[10px] text-emerald-500 mr-1 font-sans">后:</span>
                                    {diff.after || '空'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Source code change diff download box */}
                      {(rec.changeType === 'files' ||
                        (rec.fileDiffs && rec.fileDiffs.length > 0) ||
                        (rec.diffDetails && rec.diffDetails.some((d) => d.field.includes('文件') || d.field.includes('源码') || d.field.includes('handler') || d.field.includes('SKILL.md')))) && (
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 text-xs space-y-2.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <FileCode className="w-3.5 h-3.5 text-[#EA3A20]" />
                              <span>源码修改对比与本地文件下载</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              支持分别下载修改前 (旧版) 与修改后 (新版) 两份文件到本地对比
                            </span>
                          </div>

                          {rec.fileDiffs && rec.fileDiffs.length > 0 ? (
                            <div className="space-y-1.5">
                              {rec.fileDiffs.map((fd, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs gap-3 flex-wrap"
                                >
                                  <div className="flex items-center gap-2 font-mono text-slate-800 font-bold truncate">
                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span className="truncate">{fd.fileName}</span>
                                    {fd.changeType === 'added' && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-sans border border-emerald-200">
                                        新增
                                      </span>
                                    )}
                                    {fd.changeType === 'deleted' && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-sans border border-rose-200">
                                        删除
                                      </span>
                                    )}
                                    {fd.changeType === 'modified' && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-sans border border-amber-200">
                                        已修改
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {fd.oldContent !== undefined && (
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadOldFile(rec, fd.fileName)}
                                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                        title={`下载修改前旧版文件 (${fd.fileName})`}
                                      >
                                        <Download className="w-3 h-3 text-slate-500" />
                                        <span>下载旧版文件</span>
                                      </button>
                                    )}
                                    {fd.newContent !== undefined && (
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadNewFile(rec, fd.fileName)}
                                        className="px-2.5 py-1 rounded-lg bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs active:scale-95"
                                        title={`下载修改后新版文件 (${fd.fileName})`}
                                      >
                                        <Download className="w-3 h-3 text-white" />
                                        <span>下载新版文件</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleDownloadOldFile(rec)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                title="下载修改前旧版源码文件"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                <span>下载修改前旧文件</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadNewFile(rec)}
                                className="px-3 py-1.5 rounded-lg bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                                title="下载修改后新版源码文件"
                              >
                                <Download className="w-3.5 h-3.5 text-white" />
                                <span>下载修改后新文件</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadComparisonBundle(rec)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                title="下载包含新旧两份源码对比的完整 JSON 数据包"
                              >
                                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                                <span>下载两份文件对比包</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>记录包含所有操作用户、变更时间戳与前后对比细节</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
