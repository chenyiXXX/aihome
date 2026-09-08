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
  Bot
} from 'lucide-react';
import { InquiryItem, InquiryChatMessage } from '../../../types';
import { getInquiryChatHistory } from '../../../data/inquiryChatData';
import { exportInquiriesToExcel } from '../../../utils/exportInquiries';

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

  const handleCopyPhone = (phone?: string) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleExportSingle = () => {
    exportInquiriesToExcel([inquiry], `HomeCraft_询盘客户_${inquiry.buyerName}_${inquiry.inquiryNo || inquiry.id}`);
  };

  const handleSendSimulatedMessage = (textToSend?: string) => {
    const content = textToSend || simulatedInput;
    if (!content.trim()) return;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newCustMsg: InquiryChatMessage = {
      id: `sim-cust-${Date.now()}`,
      sender: 'customer',
      senderName: inquiry.buyerName,
      time: timeStr,
      content: content.trim(),
      translatedContent: `（客户新消息）${content.trim()}`
    };

    setMessages((prev) => [...prev, newCustMsg]);
    setSimulatedInput('');
    setIsBotReplying(true);

    // AI bot simulated response in 1s
    setTimeout(() => {
      const botResponse: InquiryChatMessage = {
        id: `sim-bot-${Date.now()}`,
        sender: 'bot',
        senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
        time: timeStr,
        content: `Thank you for your message, ${inquiry.buyerName}! 🤖\n\nOur engineering team has noted your question: "${content.trim()}". All millwork specifications comply with high-end export standards (E0/CARB Phase 2). We have updated the technical parameters in your project file and our senior sales director will follow up with the formal quote!`,
        translatedContent: `感谢您的沟通，${inquiry.buyerName}！🤖\n已针对您提出的问题更新技术备忘。我厂工艺全系符合E0/CARB Phase 2环保与出口高规。客户档案与诉求已同步至 CRM 待业务主管跟进。`
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsBotReplying(false);
    }, 1100);
  };

  return (
    <div className="flex-1 flex flex-col gap-5 animate-fade-in pb-8">
      {/* 1. Top Navigation & Action Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回询盘客户列表</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                {inquiry.inquiryNo || inquiry.id}
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                {inquiry.buyerName} - {inquiry.companyName}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                WhatsApp 售前机器人已接入
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              询盘时间：{inquiry.createdAt || inquiry.receivedAt} · 来源：WhatsApp Business API · 国家/地区：{inquiry.country}
            </p>
          </div>
        </div>

        {/* Right Actions: Export */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showTranslation
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="切换显示或隐藏双语翻译"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showTranslation ? '已开启中文翻译' : '仅看外语原文'}</span>
          </button>

          <button
            onClick={handleExportSingle}
            className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出到本地 Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column View: Left Chat Stream, Right Customer & AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: WhatsApp Chat Transcript Container (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-[760px]">
          
          {/* Chat Stream Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    售前机器人 ⇄ {inquiry.buyerName}
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 font-mono">
                    {inquiry.contactNumber}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  WhatsApp 端到端加密会话 · 售前机器人 7×24 小时自动应答与参数提纯
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
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
                          📎 买家发送的文件与图纸 ({msg.attachments.length}个):
                        </span>
                        <div className="space-y-1">
                          {msg.attachments.map((att, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 ml-2 shrink-0">{att.size}</span>
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

          {/* Interactive Simulation Sandbox (Allows testing bot reception) */}
          <div className="pt-2 border-t border-slate-100 shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>模拟买家与售前机器人问答（测试接待效果）</span>
              </span>
              <span className="text-[10px] text-slate-400">仅用于接待效果演练，不影响买家真实会话</span>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'Can you provide FOB Shenzhen price for 50 sets?',
                'Do you offer free wood finish samples via DHL?',
                'What is your standard production lead time for full villa?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendSimulatedMessage(q)}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={simulatedInput}
                onChange={(e) => setSimulatedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendSimulatedMessage();
                }}
                placeholder="以买家身份输入英文/中文问题，测试售前机器人自动解答..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSendSimulatedMessage()}
                disabled={!simulatedInput.trim() || isBotReplying}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  simulatedInput.trim() && !isBotReplying
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>发送测试</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Customer Profile & AI Triage Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Buyer Profile & Contact */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>询盘买家与企业档案</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                {inquiry.country} ({inquiry.countryCode})
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">买家姓名：</span>
                <span className="font-bold text-slate-800">{inquiry.buyerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">所属机构：</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={inquiry.companyName}>
                  {inquiry.companyName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">电子邮箱：</span>
                <span className="font-mono text-slate-700">{inquiry.email || '未填/通过WA沟通'}</span>
              </div>

              {/* WhatsApp Contact with Copy */}
              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-[10px] text-emerald-800 font-medium">WhatsApp 直连号码</div>
                    <div className="font-mono text-xs font-bold text-emerald-900">{inquiry.contactNumber}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyPhone(inquiry.contactNumber)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPhone ? '已复制' : '复制号码'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Inquiry Requirements & Parameter Extraction */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>采购品类与需求规格</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                进线: {inquiry.createdAt || inquiry.receivedAt}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">采购品类：</span>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-bold text-slate-800">
                  {inquiry.furnitureCategory}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-600" /> 预算规模
                  </span>
                  <span className="font-bold text-emerald-700 font-mono text-xs mt-0.5 block">{inquiry.budget}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Package className="w-3 h-3 text-blue-600" /> 采购数量/规模
                  </span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5 block truncate">{inquiry.quantity}</span>
                </div>
              </div>

              {inquiry.targetDelivery && (
                <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" /> 期望交期与条款：
                  </span>
                  <span className="font-medium text-slate-800">{inquiry.targetDelivery}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: AI Triage & Pre-sales Robot Summary */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>售前智能体意向诊断</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-100 text-[#EA3A20] border border-red-200">
                  {inquiry.intentLevel}
                </span>
                <span className="text-[11px] font-mono font-bold text-red-600">{inquiry.aiScore}分</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
              {inquiry.aiAnalysis?.summary ||
                '买家通过 WhatsApp 发起工程定制询价，包含CAD图纸与技术要求。售前智能体已完成多轮智能接待与面价测算。'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
