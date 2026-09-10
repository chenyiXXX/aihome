import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  X,
  UploadCloud,
  FileSpreadsheet,
  FileCode,
  Paperclip
} from 'lucide-react';
import { ChatAttachmentItem } from '../../hooks/useChatAttachment';

interface ChatAttachmentDropZoneProps {
  isDragOver: boolean;
  pendingAttachments: ChatAttachmentItem[];
  onRemoveAttachment: (id: string) => void;
  onClearAll?: () => void;
  onPreviewImage?: (url: string, name: string) => void;
  brandColor?: string; // e.g. '#EA3A20'
}

export const ChatAttachmentDropZone: React.FC<ChatAttachmentDropZoneProps> = ({
  isDragOver,
  pendingAttachments,
  onRemoveAttachment,
  onClearAll,
  onPreviewImage,
  brandColor = '#EA3A20'
}) => {
  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
    if (['dwg', 'dxf', 'cad', 'json'].includes(ext)) {
      return <FileCode className="w-4 h-4 text-purple-600 shrink-0" />;
    }
    if (['pdf'].includes(ext)) {
      return <FileText className="w-4 h-4 text-red-600 shrink-0" />;
    }
    return <FileText className="w-4 h-4 text-indigo-600 shrink-0" />;
  };

  return (
    <>
      {/* 1. Drag & Drop Visual Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 pointer-events-none rounded-2xl bg-white/95 border-2 border-dashed border-[#EA3A20] flex flex-col items-center justify-center gap-1.5 shadow-lg backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#EA3A20] animate-bounce">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            松开鼠标即可添加图片或文件
          </p>
          <p className="text-[10px] text-slate-500">
            支持图片、图纸、PDF、Excel 等，添加后可一键发送至 AI 对话
          </p>
        </div>
      )}

      {/* 2. Pending Attachments Preview Chips */}
      {pendingAttachments.length > 0 && (
        <div className="mb-2 p-2 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
              <Paperclip className="w-3 h-3 text-[#EA3A20]" />
              <span>待发送附件 ({pendingAttachments.length})</span>
              <span className="text-[10px] text-slate-400 font-normal ml-1">
                (已就绪，按 Enter 或点击发送即可发出)
              </span>
            </span>
            {onClearAll && pendingAttachments.length > 1 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[10px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                清空
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
            {pendingAttachments.map((att) => (
              <div
                key={att.id}
                className="relative group shrink-0 flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-[#EA3A20]/60 transition-all max-w-[200px]"
              >
                {att.type === 'image' ? (
                  <div
                    onClick={() => onPreviewImage?.(att.previewUrl, att.name)}
                    className="w-8 h-8 rounded bg-slate-100 overflow-hidden shrink-0 cursor-pointer relative"
                    title="点击放大预览"
                  >
                    <img
                      src={att.previewUrl}
                      alt={att.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    {getFileIcon(att.name)}
                  </div>
                )}

                <div className="min-w-0 flex-1 pr-4">
                  <div className="text-[11px] font-bold text-slate-800 truncate" title={att.name}>
                    {att.name}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">{att.size}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveAttachment(att.id)}
                  className="absolute right-1 top-1 p-0.5 rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                  title="移除此附件"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
