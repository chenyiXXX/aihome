import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Phone,
  MoreVertical,
  ChevronDown,
  ArrowLeft,
  CheckSquare,
  Square
} from 'lucide-react';
import { InquiryItem } from '../../types';

interface PreSalesModuleProps {
  inquiries: InquiryItem[];
  subView: string;
}

// Company branding mock list with vibrant colored geometric icons matching 03_ApplicationPage.png
const mockApplications = [
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Bubbles Studios',
    iconBg: 'bg-blue-600',
    iconAccent: 'bg-amber-400',
    type: 'FULLTIME',
    position: 'UI Designer',
    contact: '012 3123412 441',
    status: 'PENDING'
  },
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Kelon Team',
    iconBg: 'bg-fuchsia-600',
    iconAccent: 'bg-amber-400',
    type: 'PART TIME',
    position: 'UI Reseracher',
    contact: '012 3123412 441',
    status: 'ON HOLD'
  },
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Kripton Inc.',
    iconBg: 'bg-indigo-950',
    iconAccent: 'bg-amber-400',
    type: 'PART TIME',
    position: 'UI Reseracher',
    contact: '012 3123412 441',
    status: 'CANDIDATE'
  },
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Bubbles Studios',
    iconBg: 'bg-emerald-500',
    iconAccent: 'bg-amber-300',
    type: 'FULLTIME',
    position: 'UI Designer',
    contact: '012 3123412 441',
    status: 'PENDING'
  },
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Kelon Team',
    iconBg: 'bg-amber-500',
    iconAccent: 'bg-emerald-300',
    type: 'PART TIME',
    position: 'UI Reseracher',
    contact: '012 3123412 441',
    status: 'ON HOLD'
  },
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Kripton Inc.',
    iconBg: 'bg-teal-600',
    iconAccent: 'bg-amber-400',
    type: 'PART TIME',
    position: 'UI Reseracher',
    contact: '012 3123412 441',
    status: 'CANDIDATE'
  },
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Bubbles Studios',
    iconBg: 'bg-green-600',
    iconAccent: 'bg-white',
    type: 'FULLTIME',
    position: 'UI Designer',
    contact: '012 3123412 441',
    status: 'PENDING'
  },
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Kelon Team',
    iconBg: 'bg-pink-600',
    iconAccent: 'bg-amber-300',
    type: 'PART TIME',
    position: 'UI Reseracher',
    contact: '012 3123412 441',
    status: 'ON HOLD'
  },
  {
    orderId: '#000123456',
    dateApplied: 'Nov 21th 2020 09:21 AM',
    company: 'Kripton Inc.',
    iconBg: 'bg-red-600',
    iconAccent: 'bg-white',
    type: 'PART TIME',
    position: 'UI Reseracher',
    contact: '012 3123412 441',
    status: 'CANDIDATE'
  }
];

export const PreSalesModule: React.FC<PreSalesModuleProps> = ({ inquiries, subView: initialSubView }) => {
  const [currentTab, setCurrentTab] = useState<'All Status' | 'Pending' | 'On-Hold' | 'Candidate'>('All Status');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem>(inquiries[0]);
  const [isDetailView, setIsDetailView] = useState(initialSubView === '询盘内容详情');
  const [autoDraft, setAutoDraft] = useState<string>(
    selectedInquiry.aiAnalysis?.suggestedReply || ''
  );
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const toggleSelectRow = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === mockApplications.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockApplications.map((_, i) => i));
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center justify-center min-w-[96px] px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-slate-400 border border-slate-300 uppercase bg-white">
            PENDING
          </span>
        );
      case 'ON HOLD':
        return (
          <span className="inline-flex items-center justify-center min-w-[96px] px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-[#2D6A5D] bg-[#DDECE8] uppercase">
            ON HOLD
          </span>
        );
      case 'CANDIDATE':
        return (
          <span className="inline-flex items-center justify-center min-w-[96px] px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-[#EA3A20] border border-[#EA3A20] uppercase bg-white">
            CANDIDATE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center min-w-[96px] px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-slate-500 border border-slate-200 uppercase bg-white">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar px-8 pb-8">
      
      {/* 1. Filter Tabs Bar & Sort Dropdown matching 03_ApplicationPage.png */}
      <div className="flex items-center justify-between py-4 mb-2 shrink-0">
        {/* Left Segmented Filter Tabs */}
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(['All Status', 'Pending', 'On-Hold', 'Candidate'] as const).map((tab) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right Sort Filter Pill */}
        <button className="h-9 px-4.5 rounded-full bg-[#FFEFEA] text-[#EA3A20] hover:bg-[#ffe3dc] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
          <span>Newest</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Main Content Card Area */}
      {isDetailView ? (
        /* Detailed RFQ View */
        <div className="flex-1 flex flex-col gap-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsDetailView(false)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#EA3A20] bg-white border border-slate-200 px-4 py-2 rounded-full shadow-2xs cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回询盘列表
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">询盘编号：</span>
              <span className="text-xs font-bold font-mono text-slate-700">{selectedInquiry.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left RFQ Content */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 text-xs bg-red-50 text-[#EA3A20] font-bold rounded-lg border border-red-100">
                    {selectedInquiry.platform}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">{selectedInquiry.title}</h2>
                </div>
                <span className="text-xs font-mono text-slate-400">{selectedInquiry.receivedAt}</span>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl text-xs space-y-2 text-slate-700 border border-slate-100">
                <div>买家名称：<strong className="text-slate-900">{selectedInquiry.buyerName}</strong> ({selectedInquiry.country})</div>
                <div>联系邮箱：<span className="font-mono text-[#EA3A20] font-medium">{selectedInquiry.email}</span></div>
                <div>目标交付：<span className="font-semibold text-slate-800">{selectedInquiry.targetDelivery}</span></div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">买家原始询盘内容 (RFQ Raw Content)</label>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                  {selectedInquiry.rawContent}
                </div>
              </div>
            </div>

            {/* Right AI Analysis & Reply Draft */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Sparkles className="w-5 h-5 text-[#EA3A20]" />
                  AI 意向识别与 FOB 报价回复草稿
                </h2>

                <div className="p-4 bg-[#FFF4F2] border border-[#EA3A20]/20 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#EA3A20]">
                    <span>买家意向评级：{selectedInquiry.aiAnalysis?.intentLevel}</span>
                    <span>置信度：{(selectedInquiry.aiAnalysis?.confidenceScore || 0) * 100}%</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedInquiry.aiAnalysis?.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">AI 自动生成答复与报价单草稿</label>
                  <textarea
                    rows={8}
                    value={autoDraft}
                    onChange={(e) => setAutoDraft(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsDetailView(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  暂存草稿
                </button>
                <button className="px-6 py-2.5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95">
                  <Send className="w-4 h-4" /> 确认发送给买家
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* The Signature Jobick White Table Card */
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold tracking-tight">
                    <th className="py-4.5 pl-6 pr-3 w-12 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        {selectedRows.length === mockApplications.length ? (
                          <CheckSquare className="w-4.5 h-4.5 text-[#EA3A20]" />
                        ) : (
                          <Square className="w-4.5 h-4.5 text-slate-300" />
                        )}
                      </button>
                    </th>
                    <th className="py-4.5 px-4 font-bold text-slate-900">Order ID</th>
                    <th className="py-4.5 px-4 font-bold text-slate-900">Date Applied</th>
                    <th className="py-4.5 px-4 font-bold text-slate-900">Company</th>
                    <th className="py-4.5 px-4 font-bold text-slate-900">Type</th>
                    <th className="py-4.5 px-4 font-bold text-slate-900">Position</th>
                    <th className="py-4.5 px-4 font-bold text-slate-900">Contact</th>
                    <th className="py-4.5 px-4 font-bold text-slate-900">Status</th>
                    <th className="py-4.5 pr-6 pl-2 text-right"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100/80 text-xs">
                  {mockApplications.map((item, index) => {
                    const isSelected = selectedRows.includes(index);
                    return (
                      <tr
                        key={index}
                        onClick={() => {
                          setIsDetailView(true);
                          setSelectedInquiry(inquiries[index % inquiries.length]);
                        }}
                        className={`hover:bg-slate-50/70 transition-colors cursor-pointer h-16 ${
                          isSelected ? 'bg-red-50/30' : ''
                        }`}
                      >
                        {/* Checkbox Column */}
                        <td
                          className="py-4 pl-6 pr-3 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectRow(index);
                          }}
                        >
                          <button className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                            {isSelected ? (
                              <CheckSquare className="w-4.5 h-4.5 text-[#EA3A20]" />
                            ) : (
                              <Square className="w-4.5 h-4.5 text-slate-300" />
                            )}
                          </button>
                        </td>

                        {/* Order ID */}
                        <td className="py-4 px-4 font-semibold text-slate-800">
                          {item.orderId}
                        </td>

                        {/* Date Applied */}
                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {item.dateApplied}
                        </td>

                        {/* Company with Vibrant Geometric App Icon */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shadow-2xs overflow-hidden shrink-0`}
                            >
                              <div
                                className={`absolute -right-1 -top-1 w-5 h-5 rounded-full ${item.iconAccent}`}
                              />
                              <div className="relative w-3.5 h-3.5 rounded-full bg-white/90" />
                            </div>
                            <span className="font-bold text-slate-900 text-xs truncate max-w-[140px]">
                              {item.company}
                            </span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-4">
                          <span className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                            {item.type}
                          </span>
                        </td>

                        {/* Position */}
                        <td className="py-4 px-4 text-slate-700 font-medium">
                          {item.position}
                        </td>

                        {/* Contact Phone */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-900 font-bold">
                            <Phone className="w-3.5 h-3.5 text-[#0F4A47] fill-[#0F4A47]" />
                            <span>{item.contact}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
                          {renderStatusBadge(item.status)}
                        </td>

                        {/* Action Dots */}
                        <td
                          className="py-4 pr-6 pl-2 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Pagination Footer matching 03_ApplicationPage.png */}
          <div className="flex items-center justify-between pt-6 pb-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500">
              Showing 5 of 102 Data
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-4.5 py-1.5 rounded-full border border-[#EA3A20]/40 bg-[#FFF5F2] hover:bg-[#ffece6] text-[#EA3A20] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                Prev
              </button>

              {/* Number Buttons */}
              {[1, 2, 3, 4].map((page) => {
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-[#EA3A20] text-white shadow-xs scale-105'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
                className="px-4.5 py-1.5 rounded-full border border-[#EA3A20]/40 bg-[#FFF5F2] hover:bg-[#ffece6] text-[#EA3A20] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
