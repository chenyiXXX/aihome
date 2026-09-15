import React, { useRef } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Video,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Sparkles,
  RefreshCw,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Table as TableIcon,
  Quote,
  Eye,
  Edit3,
  Play,
  Clock,
  Film
} from 'lucide-react';
import { KBArticle } from '../../../types';

interface ArticleContentTabProps {
  editingArticle: KBArticle | null;
  articleFormTitle: string;
  setArticleFormTitle: (val: string) => void;
  articleFormCategory: string;
  setArticleFormCategory: (val: string) => void;
  allCategoryPaths: { id: string; name: string; fullPath: string }[];
  articleContentType: 'markdown' | 'document' | 'video';
  setArticleContentType: (val: 'markdown' | 'document' | 'video') => void;
  articleMarkdownView: 'edit' | 'preview' | 'split';
  setArticleMarkdownView: (val: 'edit' | 'preview' | 'split') => void;
  articleFormContent: string;
  setArticleFormContent: (val: string) => void;
  articleFormDocType: 'DOCX' | 'PPTX' | 'PDF' | 'XLSX';
  setArticleFormDocType: (val: 'DOCX' | 'PPTX' | 'PDF' | 'XLSX') => void;
  articleFormDocFile: {
    name: string;
    size: string;
    type: string;
    ext: string;
    url?: string;
    ocrExtractedText?: string;
  } | null;
  setArticleFormDocFile: (val: any) => void;
  articleFormVideoUrl: string;
  setArticleFormVideoUrl: (val: string) => void;
  articleFormVideoDuration: string;
  setArticleFormVideoDuration: (val: string) => void;
  articleFormVideoCover: string;
  setArticleFormVideoCover: (val: string) => void;
  articleFormVideoSourceName: string;
  setArticleFormVideoSourceName: (val: string) => void;
  articleFormVideoTranscript: string;
  setArticleFormVideoTranscript: (val: string) => void;
  docFileInputRef: React.RefObject<HTMLInputElement>;
  videoFileInputRef: React.RefObject<HTMLInputElement>;
  showToast: (msg: string) => void;
}

export const ArticleContentTab: React.FC<ArticleContentTabProps> = ({
  editingArticle,
  articleFormTitle,
  setArticleFormTitle,
  articleFormCategory,
  setArticleFormCategory,
  allCategoryPaths,
  articleContentType,
  setArticleContentType,
  articleMarkdownView,
  setArticleMarkdownView,
  articleFormContent,
  setArticleFormContent,
  articleFormDocType,
  setArticleFormDocType,
  articleFormDocFile,
  setArticleFormDocFile,
  articleFormVideoUrl,
  setArticleFormVideoUrl,
  articleFormVideoDuration,
  setArticleFormVideoDuration,
  articleFormVideoCover,
  setArticleFormVideoCover,
  articleFormVideoSourceName,
  setArticleFormVideoSourceName,
  articleFormVideoTranscript,
  setArticleFormVideoTranscript,
  docFileInputRef,
  videoFileInputRef,
  showToast
}) => {
  const handleInsertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = articleFormContent.substring(start, end);
    const replacement = `${prefix}${selectedText || '示例文本'}${suffix}`;
    const newContent =
      articleFormContent.substring(0, start) +
      replacement +
      articleFormContent.substring(end);
    setArticleFormContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 4)
      );
    }, 50);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 text-xs">
      {/* Row 1: Title & Category in One Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1.5 flex flex-col justify-start">
          <div className="flex justify-between items-center h-5">
            <label className="font-bold text-slate-700 block">
              <span className="text-red-500 mr-1">*</span>条目标题
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {articleFormTitle.length}/100
            </span>
          </div>
          <input
            type="text"
            maxLength={100}
            placeholder="例如：2026现代意式轻奢定制衣帽间五金与板材规范"
            value={articleFormTitle}
            onChange={(e) => setArticleFormTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#EA3A20] text-xs shadow-2xs"
          />
          {editingArticle && (
            <div className="text-[11px] text-slate-400 font-mono px-0.5 pt-0.5 truncate">
              系统编号: {editingArticle.code} · 版本: {editingArticle.version}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5 flex flex-col justify-start min-w-0">
          <div className="flex justify-between items-center h-5">
            <label className="font-bold text-slate-700 block">
              <span className="text-red-500 mr-1">*</span>归属分类
            </label>
          </div>
          <select
            value={articleFormCategory}
            onChange={(e) => setArticleFormCategory(e.target.value)}
            className="w-full min-w-0 max-w-full truncate px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer text-xs shadow-2xs"
          >
            {allCategoryPaths.map((c) => (
              <option key={c.id} value={c.fullPath}>
                {c.fullPath}
              </option>
            ))}
          </select>
          <div className="text-[11px] text-slate-400 px-0.5 pt-0.5 truncate">
            条目归属对应分类，将自动继承权限与检索权重
          </div>
        </div>
      </div>

      {/* Row 3: Knowledge Carrier / Content Type Switcher */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700 flex items-center gap-1.5">
            <span>知识形态载体</span>
            <span className="text-[11px] font-normal text-slate-400">
              (选择知识的主要表达形态)
            </span>
          </label>
        </div>

        {/* Carrier Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setArticleContentType('markdown')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              articleContentType === 'markdown'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText
              className={`w-3.5 h-3.5 ${
                articleContentType === 'markdown' ? 'text-[#EA3A20]' : 'text-slate-400'
              }`}
            />
            <span>富文本 / Markdown</span>
          </button>

          <button
            type="button"
            onClick={() => setArticleContentType('document')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              articleContentType === 'document'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet
              className={`w-3.5 h-3.5 ${
                articleContentType === 'document' ? 'text-blue-600' : 'text-slate-400'
              }`}
            />
            <span>文档附件 (DOCX/PPT/PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => setArticleContentType('video')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              articleContentType === 'video'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video
              className={`w-3.5 h-3.5 ${
                articleContentType === 'video' ? 'text-purple-600' : 'text-slate-400'
              }`}
            />
            <span>视频知识 (MP4/教学实拍)</span>
          </button>
        </div>

        {/* Carrier Form 1: Markdown / Rich Text Content Form */}
        {articleContentType === 'markdown' && (
          <div className="space-y-2 animate-in fade-in">
            {/* Markdown Toolbar */}
            <div className="flex items-center justify-between bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 flex-wrap gap-1">
              <div className="flex items-center gap-0.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('### ', '')}
                  title="插入三级标题"
                  className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('#### ', '')}
                  title="插入四级标题"
                  className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('**', '**')}
                  title="加粗"
                  className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('*', '*')}
                  title="斜体"
                  className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('> ', '')}
                  title="引用"
                  className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('- ', '')}
                  title="无序列表"
                  className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('1. ', '')}
                  title="有序列表"
                  className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertMarkdownSyntax(
                      '\n| 属性参数 | 标准规格 | 备注说明 |\n| :--- | :--- | :--- |\n| 板材厚度 | 18mm / 25mm | 欧标E0级 |\n'
                    )
                  }
                  title="插入表格"
                  className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* View Switcher & AI Assist */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const aiDraft = `\n\n### 🤖 AI智能扩写标准工艺规范\n1. **外观检验标准**：表面无划痕、气泡与压痕，对角线公差控制在 ±0.5mm 以内。\n2. **包装海运防护**：采用珍珠棉+加厚蜂窝纸箱+打木架，内置干燥剂满足海运防潮防霉要求。\n3. **质保条款**：主体结构提供 5 年质保，五金件 3 年免费以旧换新。`;
                    setArticleFormContent(articleFormContent + aiDraft);
                    showToast('AI 已自动生成标准外贸工艺与包装条款！');
                  }}
                  className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>AI智能扩写</span>
                </button>

                <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setArticleMarkdownView('edit')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                      articleMarkdownView === 'edit'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleMarkdownView('split')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                      articleMarkdownView === 'split'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    双栏
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleMarkdownView('preview')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                      articleMarkdownView === 'preview'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    预览
                  </button>
                </div>
              </div>
            </div>

            {/* Markdown Text Area / Preview */}
            <div
              className={`grid gap-3 ${
                articleMarkdownView === 'split' ? 'grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {(articleMarkdownView === 'edit' || articleMarkdownView === 'split') && (
                <textarea
                  id="article-content-textarea"
                  rows={10}
                  placeholder="在此输入条目正文（支持 Markdown 语法、表格与结构化规程）..."
                  value={articleFormContent}
                  onChange={(e) => setArticleFormContent(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#EA3A20] shadow-inner resize-y"
                />
              )}

              {(articleMarkdownView === 'preview' || articleMarkdownView === 'split') && (
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl max-h-72 overflow-y-auto custom-scrollbar prose prose-xs text-slate-700">
                  {articleFormContent ? (
                    <div className="space-y-2 whitespace-pre-wrap font-sans text-xs">
                      {articleFormContent}
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-center py-8">
                      暂无内容，左侧输入正文后实时渲染预览
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Carrier Form 2: Document File Upload & Parser */}
        {articleContentType === 'document' && (
          <div className="space-y-3 animate-in fade-in">
            <input
              type="file"
              ref={docFileInputRef}
              accept=".docx,.pdf,.pptx,.xlsx,.doc"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const ext = file.name.split('.').pop()?.toUpperCase() || 'DOCX';
                  const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                  setArticleFormDocFile({
                    name: file.name,
                    size: sizeMB,
                    type: 'document',
                    ext: ext.toLowerCase(),
                    ocrExtractedText: `【文档自动解析提炼内容】\n文件名称：${file.name}\n解析时间：${new Date().toLocaleTimeString()}\n已自动完成 28 页矢量文字与图表 OCR 结构化提取，准备切片为 14 个向量语义块。`
                  });
                  if (!articleFormTitle) {
                    setArticleFormTitle(file.name.replace(/\.[^/.]+$/, ''));
                  }
                  showToast(`已成功装载文档文件「${file.name}」并完成文本预解析！`);
                }
              }}
              className="hidden"
            />

            {/* Doc Type Selector Pills */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">文档格式：</span>
              {(['DOCX', 'PPTX', 'PDF', 'XLSX'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setArticleFormDocType(fmt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    articleFormDocType === fmt
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* File Dropzone */}
            <div
              onClick={() => docFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-500 bg-blue-50/20 hover:bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="font-semibold text-slate-800 text-xs">
                点击上传 或 将 {articleFormDocType} 文档拖拽到此处
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                支持 DOCX、PPTX、PDF、XLSX 等格式
              </p>
            </div>

            {/* Loaded Document Info Card */}
            {articleFormDocFile && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {articleFormDocFile.ext.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-xs truncate max-w-xs">
                      {articleFormDocFile.name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{articleFormDocFile.size}</span>
                      <span>·</span>
                      <span className="text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> 已就绪
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => docFileInputRef.current?.click()}
                    className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    更换文件
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleFormDocFile(null)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Extracted Text Content Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>文档正文与提取内容</span>
                </label>
              </div>
              <textarea
                rows={5}
                placeholder="此处显示文档解析结果，支持在此输入补充内容与关键说明..."
                value={articleFormDocFile?.ocrExtractedText || articleFormContent}
                onChange={(e) => {
                  if (articleFormDocFile) {
                    setArticleFormDocFile({
                      ...articleFormDocFile,
                      ocrExtractedText: e.target.value
                    });
                  }
                  setArticleFormContent(e.target.value);
                }}
                className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Carrier Form 3: Video Knowledge */}
        {articleContentType === 'video' && (
          <div className="space-y-3 animate-in fade-in">
            <input
              type="file"
              ref={videoFileInputRef}
              accept="video/mp4,video/quicktime,video/webm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                  if (setArticleFormVideoSourceName) setArticleFormVideoSourceName(file.name);
                  if (setArticleFormVideoDuration) setArticleFormVideoDuration('08分45秒');
                  setArticleFormVideoCover(
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
                  );
                  setArticleFormVideoTranscript(
                    `【音轨字幕】\n00:15 大家好，今天演示意式极简全屋定制门板的隐藏天地轴开槽工艺与五金预埋。\n01:30 重点注意：实木多层板与蜂窝铝板的膨胀系数差异，四周预留 2mm 呼吸微缝。\n04:10 铰链承重测试：单个承重 25kg，三点受力均摊。\n07:20 现场包装封边与外贸出口打木架标准规范。`
                  );
                  if (!articleFormTitle) {
                    setArticleFormTitle(file.name.replace(/\.[^/.]+$/, ''));
                  }
                  showToast(`已装载视频文件「${file.name}」(${sizeMB})`);
                }
              }}
              className="hidden"
            />

            {/* Video File Dropzone */}
            <div
              onClick={() => videoFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50/40 rounded-2xl p-5 text-center cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div className="font-semibold text-slate-800 text-xs">
                点击上传 MP4 / MOV 等实录视频
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                支持主流高清视频格式
              </p>
            </div>

            {/* Video Transcript / AI Speech Extraction */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>视频文字说明与分段摘要</span>
                </label>
              </div>
              <textarea
                rows={5}
                placeholder="输入视频语音字幕或要点摘要..."
                value={articleFormVideoTranscript || articleFormContent}
                onChange={(e) => {
                  setArticleFormVideoTranscript(e.target.value);
                  setArticleFormContent(e.target.value);
                }}
                className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
