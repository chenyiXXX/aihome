import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  Sparkles,
  Download,
  Copy,
  Check,
  Paperclip,
  Send,
  Languages,
  Clock,
  ShieldCheck,
  Phone,
  Building2,
  Globe2,
  DollarSign,
  Package,
  Layers,
  Bot,
  ZoomIn
} from 'lucide-react';
import { InquiryItem, InquiryChatMessage } from '../../../types';
import { getInquiryChatHistory } from '../../../data/inquiryChatData';
import { exportInquiriesToExcel } from '../../../utils/exportInquiries';
import { useChatAttachment } from '../../../hooks/useChatAttachment';
import { ChatAttachmentDropZone } from '../../common/ChatAttachmentDropZone';
import { ImagePreviewModal } from '../../common/ImagePreviewModal';

interface InquiryChatDetailViewProps {
  inquiry: InquiryItem;
  onBack: () => void;
}

export const InquiryChatDetailView: React.FC<InquiryChatDetailViewProps> = ({
  inquiry,
  onBack
}) => {
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [messages, setMessages] = useState<InquiryChatMessage[]>(() =>
    getInquiryChatHistory(inquiry)
  );
  const [simulatedInput, setSimulatedInput] = useState<string>('');
  const [isBotReplying, setIsBotReplying] = useState<boolean>(false);
  const [previewModalImage, setPreviewModalImage] = useState<{ url: string; name: string } | null>(null);

  // Attachment handling: Ctrl+V clipboard paste & Drag-and-drop
  const {
    pendingAttachments,
    isDragOver,
    handlePaste,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    removeAttachment,
    clearAttachments,
    processFiles
  } = useChatAttachment();

  const handleCopyPhone = (phone?: string) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleExportSingle = () => {
    exportInquiriesToExcel([inquiry], `HomeCraft_询盘客户_${inquiry.buyerName}_${inquiry.inquiryNo || inquiry.id}`);
  };

  const handleSendFollowUpMessage = (textToSend?: string) => {
    const content = textToSend || simulatedInput;
    const hasAttachments = pendingAttachments.length > 0;
    if (!content.trim() && !hasAttachments) return;

    const attachmentsToSend = pendingAttachments.map((att) => ({
      name: att.name,
      size: att.size || '未知大小',
      type: att.type === 'image' ? ('image' as const) : ('pdf' as const),
      url: att.previewUrl
    }));

    const finalContent = content.trim() || (attachmentsToSend.length > 0 ? `[发送了 ${attachmentsToSend.length} 个附件文件]` : '');

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newSalesMsg: InquiryChatMessage = {
      id: `sales-${Date.now()}`,
      sender: 'bot',
      senderName: '业务代表 (HomeCraft Sales)',
      time: timeStr,
      content: finalContent,
      translatedContent: `（外贸业务员回复）${finalContent}`,
      attachments: attachmentsToSend.length > 0 ? attachmentsToSend : undefined
    };

    setMessages((prev) => [...prev, newSalesMsg]);
    setSimulatedInput('');
    clearAttachments();
  };

  return (
    <div className="flex-1 flex flex-col gap-4 animate-fade-in pb-8">
      {/* 1. Top Navigation & Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回列表</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {inquiry.inquiryNo || inquiry.id}
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                {inquiry.buyerName} - {inquiry.companyName}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                WhatsApp 专线
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              询盘时间：{inquiry.createdAt || inquiry.receivedAt} · 国家/地区：{inquiry.country}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showTranslation
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>双语对照</span>
          </button>

          <button
            onClick={handleExportSingle}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出记录</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column View: Left Chat Stream, Right Customer & AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: WhatsApp Chat Transcript Container (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs flex flex-col h-[740px]">
          
          {/* Chat Stream Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {inquiry.buyerName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                    {inquiry.contactNumber}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  WhatsApp 在线接待记录
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
              共 {messages.length} 条记录
            </span>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4 bg-[#F8F9FA] rounded-2xl my-3 border border-slate-100">
            {/* WhatsApp Date Divider */}
            <div className="flex justify-center">
              <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-3 py-0.5 rounded-full shadow-2xs font-mono">
                {inquiry.createdAt ? inquiry.createdAt.split(' ')[0] : '2026-08-17'} · WhatsApp Business 接入记录
              </span>
            </div>

            {messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      {isCustomer ? (
                        <>
                          <Globe2 className="w-3 h-3 text-blue-500" />
                          <span>买家: {msg.senderName}</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">售前AI机器人 (HomeCraft)</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                  </div>

                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 text-xs shadow-2xs leading-relaxed space-y-2 ${
                      isCustomer
                        ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm'
                        : 'bg-[#E7F8EE] text-slate-900 border border-emerald-200/70 rounded-tr-sm'
                    }`}
                  >
                    {/* Message Body */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Bilingual Translation Card */}
                    {showTranslation && msg.translatedContent && (
                      <div className="pt-2 mt-2 border-t border-slate-200/60 text-[11px] text-slate-600 bg-slate-50/70 p-2 rounded-xl">
                        <div className="flex items-center gap-1 font-bold text-slate-500 text-[10px] mb-0.5">
                          <Languages className="w-3 h-3 text-slate-400" />
                          <span>中文译文参考</span>
                        </div>
                        <p className="leading-normal">{msg.translatedContent}</p>
                      </div>
                    )}

                    {/* Attachments if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="pt-2 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 block">
                          📎 发送的文件与图纸 ({msg.attachments.length}个):
                        </span>
                        <div className="space-y-1.5">
                          {msg.attachments.map((att, idx) => (
                            <div key={idx}>
                              {att.type === 'image' && att.url ? (
                                <div
                                  onClick={() => setPreviewModalImage({ url: att.url!, name: att.name })}
                                  className="group relative inline-block rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-2xs max-w-[220px]"
                                >
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="w-full max-h-36 object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="w-5 h-5 text-white drop-shadow" />
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2 truncate">
                                    <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400 ml-2 shrink-0">{att.size}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isBotReplying && (
              <div className="flex flex-col items-end">
                <div className="bg-[#E7F8EE] border border-emerald-200 text-emerald-800 rounded-2xl rounded-tr-sm p-3 text-xs flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin text-emerald-600" />
                  <span className="font-medium animate-pulse">售前机器人正在根据工厂报价知识库计算回复...</span>
                </div>
              </div>
            )}
          </div>

          {/* Follow-up / Reply Bar */}
          <div
            className="relative pt-2 border-t border-slate-100 shrink-0 space-y-2"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag & Drop Visual Overlay & Pending Attachments Chips */}
            <ChatAttachmentDropZone
              isDragOver={isDragOver}
              pendingAttachments={pendingAttachments}
              onRemoveAttachment={removeAttachment}
              onClearAll={clearAttachments}
              onPreviewImage={(url, name) => setPreviewModalImage({ url, name })}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>业务回复与跟进</span>
              </span>
              <span className="text-[10px] text-slate-400">支持拖拽文件或粘贴图纸</span>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {[
                '提供 FOB 深圳出厂报价清单',
                '索取全套 CAD 施工图深化文件',
                '安排寄送白橡木实木色板 (DHL特快)'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setSimulatedInput(q)}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <div className="flex items-center gap-2">
              <label
                title="上传图纸或文件附件"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200 transition-colors cursor-pointer shrink-0"
              >
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      processFiles(e.target.files);
                      e.target.value = '';
                    }
                  }}
                />
              </label>

              <input
                type="text"
                value={simulatedInput}
                onChange={(e) => setSimulatedInput(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendFollowUpMessage();
                }}
                placeholder="输入回复内容，按 Enter 键发送..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSendFollowUpMessage()}
                disabled={!simulatedInput.trim() && pendingAttachments.length === 0}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  simulatedInput.trim() || pendingAttachments.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>发送</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Customer Profile & AI Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          
          {/* Card 1: Buyer Profile & Contact */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>客户档案</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-600">
                {inquiry.country}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">买家姓名</span>
                <span className="font-semibold text-slate-800">{inquiry.buyerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">所属机构</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]" title={inquiry.companyName}>
                  {inquiry.companyName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">电子邮箱</span>
                <span className="font-mono text-slate-700">{inquiry.email || '未填'}</span>
              </div>

              {/* WhatsApp Contact with Copy */}
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <div className="font-mono text-xs font-bold text-emerald-900">{inquiry.contactNumber}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyPhone(inquiry.contactNumber)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPhone ? '已复制' : '复制'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Inquiry Requirements */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>采购需求</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {inquiry.createdAt || inquiry.receivedAt}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">采购品类</span>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 font-semibold text-slate-800">
                  {inquiry.furnitureCategory}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-600" /> 预算金额
                  </span>
                  <span className="font-bold text-emerald-700 font-mono text-xs mt-0.5 block">{inquiry.budget}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Package className="w-3 h-3 text-blue-600" /> 采购数量
                  </span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 block truncate">{inquiry.quantity}</span>
                </div>
              </div>

              {inquiry.targetDelivery && (
                <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" /> 期望交期
                  </span>
                  <span className="font-medium text-slate-800">{inquiry.targetDelivery}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: AI Triage Summary */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AI 商机评估</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-[#EA3A20] border border-red-200">
                  {inquiry.intentLevel}
                </span>
                <span className="text-[11px] font-mono font-bold text-red-600">{inquiry.aiScore}分</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs text-slate-700 leading-relaxed font-medium">
              {inquiry.aiAnalysis?.summary ||
                '买家通过 WhatsApp 发起工程定制询价，包含CAD图纸与技术要求。已完成多轮接待与面价测算。'}
            </div>
          </div>

        </div>

      </div>
      {/* Image Preview Modal */}
      {previewModalImage && (
        <ImagePreviewModal
          isOpen={!!previewModalImage}
          imageUrl={previewModalImage.url}
          imageName={previewModalImage.name}
          onClose={() => setPreviewModalImage(null)}
        />
      )}
    </div>
  );
};
