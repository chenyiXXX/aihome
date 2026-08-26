import React, { useState } from 'react';
import {
  X,
  Edit3,
  Download,
  Copy,
  Check,
  Folder,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Users,
  Globe,
  ShieldCheck,
  Calendar,
  Link2,
  Tag as TagIcon,
  Video,
  Presentation,
  FileText,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  FileDown,
  Layers,
  ChevronRight,
  BookOpen,
  Info,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { KBArticle } from '../../../types';

interface ArticleDetailDrawerProps {
  article: KBArticle | null;
  onClose: () => void;
  onEdit: (article: KBArticle) => void;
  onSelectRelated?: (article: KBArticle) => void;
  allArticles?: KBArticle[];
  renderPairedTagBadge: (tagStr: string) => React.ReactNode;
  onShowToast: (msg: string) => void;
}

export const ArticleDetailDrawer: React.FC<ArticleDetailDrawerProps> = ({
  article,
  onClose,
  onEdit,
  onSelectRelated,
  allArticles = [],
  renderPairedTagBadge,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'attributes' | 'vectors'>('content');
  const [copiedContent, setCopiedContent] = useState(false);

  if (!article) return null;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(article.content || '');
    setCopiedContent(true);
    onShowToast('知识库正文已成功复制到剪贴板');
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const getFileTypeBadge = () => {
    if (article.fileType === 'VIDEO' || article.contentType === 'video') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
          <Video className="w-3.5 h-3.5" /> 视频实操录像
        </span>
      );
    }
    if (article.fileType === 'PPTX') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <Presentation className="w-3.5 h-3.5" /> PPT 演示文稿
        </span>
      );
    }
    if (article.fileType === 'PDF') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/80">
          <FileText className="w-3.5 h-3.5" /> PDF 认证手册
        </span>
      );
    }
    if (article.fileType === 'DOCX') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
          <FileText className="w-3.5 h-3.5" /> Word 规范文档
        </span>
      );
    }
    if (article.fileType === 'XLSX') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <FileSpreadsheet className="w-3.5 h-3.5" /> Excel 表格
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
        <FileCode className="w-3.5 h-3.5" /> Markdown 条款
      </span>
    );
  };

  // Helper to render markdown content with clean visual typography
  const renderFormattedMarkdown = (raw: string) => {
    if (!raw) return <p className="text-slate-400 italic">暂无正文内容</p>;

    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableKey = 0;

    const flushTable = () => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const rows = tableRows.slice(1);
        elements.push(
          <div key={`table-${tableKey++}`} className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                  {header.map((col, idx) => (
                    <th key={idx} className="p-3 whitespace-nowrap">
                      {col.replace(/\*\*/g, '').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 leading-relaxed">
                        {cell.includes('**') ? (
                          <span className="font-bold text-slate-900">{cell.replace(/\*\*/g, '').trim()}</span>
                        ) : (
                          cell.trim()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
      inTable = false;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Table line detect
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (trimmed.includes('---')) {
          // delimiter line, ignore
          return;
        }
        const cells = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        inTable = true;
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable();
      }

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="text-lg font-bold text-slate-900 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4.5 rounded-full bg-[#EA3A20] inline-block" />
            {trimmed.replace('# ', '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={idx} className="text-sm font-bold text-slate-800 pt-4 pb-1.5 flex items-center gap-2 text-slate-900">
            <span className="w-1 h-3.5 rounded-full bg-slate-400 inline-block" />
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-xs font-bold text-slate-700 pt-3 pb-1">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.slice(2);
        elements.push(
          <div key={idx} className="flex items-start gap-2 py-0.5 text-xs text-slate-700 leading-relaxed pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span className="flex-1">
              {itemText.split('**').map((part, pIdx) =>
                pIdx % 2 === 1 ? (
                  <strong key={pIdx} className="font-semibold text-slate-900">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </span>
          </div>
        );
      } else if (trimmed === '') {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-slate-700 leading-relaxed py-0.5">
            {trimmed.split('**').map((part, pIdx) =>
              pIdx % 2 === 1 ? (
                <strong key={pIdx} className="font-semibold text-slate-900">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable();
    }

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* ========================================================================= */}
        {/* 1. HEADER: Compact, Clean, Visual Anchor */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Category Breadcrumb & Meta Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs mb-1.5">
                <span className="font-mono font-bold text-[11px] text-[#EA3A20] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                  {article.code}
                </span>
                <span className="font-mono text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold">
                  {article.version}
                </span>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate max-w-[320px]">{article.category}</span>
                </div>
              </div>

              {/* Title with prominent typography */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
                {article.title}
              </h2>

              {/* Author & Update Time Strip */}
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-4.5 h-4.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                    {(article.author || '管')[0]}
                  </span>
                  <span>{article.author}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>更新于 {article.updatedAt}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>已就绪 ({article.chunksCount || 32} 切片)</span>
                </span>
                {article.viewCount !== undefined && (
                  <span className="text-slate-400">
                    浏览量: <strong className="text-slate-600 font-semibold">{article.viewCount}</strong> 次
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
              title="关闭抽屉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation Switches (保持与新建/编辑条目 3 Step Tabs 风格统一) */}
          <div className="mt-4 pt-2">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-white text-[#EA3A20] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                    activeTab === 'content' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  1
                </span>
                <span className="truncate">1. 知识正文与多媒体</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('attributes')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'attributes'
                    ? 'bg-white text-[#EA3A20] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                    activeTab === 'attributes' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  2
                </span>
                <span className="truncate">2. 业务属性</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vectors')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'vectors'
                    ? 'bg-white text-[#EA3A20] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                    activeTab === 'vectors' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  3
                </span>
                <span className="truncate">3. AI 语义切片</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 transition-colors ${
                    activeTab === 'vectors' ? 'bg-red-50 text-[#EA3A20]' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {article.chunksCount || 32}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BODY CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs bg-slate-50/30">

          {/* TAB 1: 知识正文与多媒体 (Core Content View) */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* IF VIDEO: Dedicated Video Preview Card */}
              {(article.fileType === 'VIDEO' || article.contentType === 'video') && (
                <div className="p-4.5 bg-slate-950 rounded-2xl text-white space-y-3.5 shadow-md border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center border border-purple-500/30">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-100">高清实操视频录像</span>
                        <p className="text-[10px] text-slate-400">{article.videoInfo?.sourceName || '工厂工艺实拍教学'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800/80 px-2.5 py-1 rounded-full font-bold">
                      时长: {article.videoInfo?.duration || '09分42秒'}
                    </span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center relative border border-slate-800">
                    <video
                      src={article.videoInfo?.url || 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-with-wooden-furniture-41487-large.mp4'}
                      controls
                      className="w-full h-full object-contain"
                      poster={article.videoInfo?.coverUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
                    />
                  </div>
                </div>
              )}

              {/* IF DOCUMENT: Attached Document Preview Box */}
              {(article.fileType === 'DOCX' || article.fileType === 'PPTX' || article.fileType === 'PDF' || article.fileType === 'XLSX' || article.contentType === 'document') && (
                <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      article.fileType === 'PPTX'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : article.fileType === 'PDF'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : article.fileType === 'XLSX'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}>
                      {article.fileType === 'PPTX' ? (
                        <Presentation className="w-6 h-6" />
                      ) : article.fileType === 'PDF' ? (
                        <FileText className="w-6 h-6" />
                      ) : article.fileType === 'XLSX' ? (
                        <FileSpreadsheet className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">
                        {article.attachmentFile?.name || article.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>大小: {article.attachmentFile?.size || article.fileSize || '6.4 MB'}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 已完成结构化解析
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onShowToast(`已为您开始下载原件「${article.title}」`)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>下载原件</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Main Content Box with Structured Markdown Styling */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                {/* Content Toolbar */}
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {article.fileType === 'VIDEO' || article.contentType === 'video' ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>视频字幕转写与智能问答依据</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <FileText className="w-3.5 h-3.5 text-[#EA3A20]" />
                        <span>知识条款正文与标准依据</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyContent}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      title="复制正文"
                    >
                      {copiedContent ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>复制正文</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Render Container */}
                <div className="p-6 text-slate-800 leading-relaxed font-sans text-xs sm:text-sm">
                  {renderFormattedMarkdown(article.content)}
                </div>
              </div>

              {/* Compact Quick Summary Footer of Key Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="p-4 bg-white border border-slate-200/70 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <TagIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>关联检索标签 ({article.tags.length})</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {article.tags.map((t, idx) => (
                      <span key={idx}>
                        {renderPairedTagBadge(t)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 业务属性与管控配置 (Attributes & Permissions View) */}
          {activeTab === 'attributes' && (
            <div className="space-y-6">
              
              {/* 1. Core Dimension Cards in Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 适用岗位 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" /> 适用业务岗位
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">访问与问答权限</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.applicableRoles && article.applicableRoles.length > 0 ? (
                      article.applicableRoles.map((role) => (
                        <span
                          key={role}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-medium"
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        全员通用
                      </span>
                    )}
                  </div>
                </div>

                {/* 适用地区/语种 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-600" /> 适用地区 / 语种
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">地域合规与多语言</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.applicableRegions && article.applicableRegions.length > 0 ? (
                      article.applicableRegions.map((region) => (
                        <span
                          key={region}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-medium"
                        >
                          {region}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        全球通用
                      </span>
                    )}
                  </div>
                </div>

                {/* 知识密级 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-600" /> 知识安全密级
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">外泄管控级别</span>
                  </div>
                  <div className="pt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                        article.securityLevel === '机密'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : article.securityLevel === '内部'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>{article.securityLevel || '内部'}（受组织权限管控）</span>
                    </span>
                  </div>
                </div>

                {/* 有效期限 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-600" /> 条款有效期限
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">时效性自动预警</span>
                  </div>
                  <div className="pt-1">
                    {article.expiryType === 'custom' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium font-mono">
                        <span>有效期：</span>
                        <strong>{article.validityStartDate || '即日起'}</strong>
                        <span className="text-slate-400 mx-0.5">至</span>
                        <strong>{article.validityEndDate || article.expiryDate || '待定'}</strong>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                        永久有效 (长期维护)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Related Articles Linkage */}
              {article.relatedArticleIds && article.relatedArticleIds.length > 0 && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-indigo-600" />
                      <span>关联上下文条目 ({article.relatedArticleIds.length})</span>
                    </span>
                    <span className="text-[11px] text-slate-400">智能体将协同召回此关联网络</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {article.relatedArticleIds.map((relId) => {
                      const relArt = allArticles.find((a) => a.id === relId);
                      if (!relArt) return null;
                      return (
                        <button
                          key={relId}
                          type="button"
                          onClick={() => {
                            if (onSelectRelated) onSelectRelated(relArt);
                          }}
                          className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-left transition-all cursor-pointer group flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-[10px] text-indigo-600 font-bold block mb-0.5">
                              {relArt.code}
                            </span>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 truncate">
                              {relArt.title}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI 语义切片与向量采样 (Vectors & Chunks View) */}
          {activeTab === 'vectors' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">向量化已就绪 (Embedding 状态)</h4>
                    <p className="text-[11px] text-emerald-700">余弦相似度匹配阈值: 0.82+ · 混合 BM25 与 Dense Vector</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white text-emerald-800 border border-emerald-200 rounded-full font-mono text-xs font-bold shadow-2xs">
                  总计 {article.chunksCount || 32} 个切片
                </span>
              </div>

              {/* Sample Chunks Display */}
              <div className="space-y-3">
                <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Chunk #01 · 128 Tokens
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Vector ID: vec-{article.id}-001</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {article.content.slice(0, 220)}...
                  </p>
                </div>

                {article.content.length > 220 && (
                  <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Chunk #02 · 142 Tokens
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">Vector ID: vec-{article.id}-002</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {article.content.slice(220, 460)}...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 3. FOOTER: Clear, Prominent Actions */}
        {/* ========================================================================= */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(article)}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>编辑此条目</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            关闭详情
          </button>
        </div>

      </div>
    </div>
  );
};
