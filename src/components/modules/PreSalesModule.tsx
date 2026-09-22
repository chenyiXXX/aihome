import React, { useState, useMemo } from 'react';
import {
  MessageCircle,
  Sliders,
  Plus,
  Download,
  FileSpreadsheet,
  Search,
  CheckSquare,
  Square,
  Calendar,
  RotateCcw,
  Sparkles,
  Bot,
  Copy,
  Check,
  Building2,
  Phone,
  Clock,
  ExternalLink
} from 'lucide-react';
import { InquiryItem } from '../../types';
import { ChannelConfigModal } from './presales/ChannelConfigModal';
import { CreateInquiryModal } from './presales/CreateInquiryModal';
import { InquiryChatDetailView } from './presales/InquiryChatDetailView';
import { exportInquiriesToExcel } from '../../utils/exportInquiries';
import { getInquiryChatHistory } from '../../data/inquiryChatData';

interface PreSalesModuleProps {
  inquiries: InquiryItem[];
  subView: string;
}

type TimeQuickRange = 'ALL' | 'TODAY' | '7DAYS' | '30DAYS' | 'THIS_MONTH';

export const PreSalesModule: React.FC<PreSalesModuleProps> = ({
  inquiries: initialInquiriesProp,
  subView: initialSubView
}) => {
  const [inquiriesList, setInquiriesList] = useState<InquiryItem[]>(initialInquiriesProp);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'score' | 'budget'>('newest');

  // Time Range Filter States (列表提供询盘时间查询)
  const [timeQuickRange, setTimeQuickRange] = useState<TimeQuickRange>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Selection & Detail View
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem>(
    initialInquiriesProp[0] || ({} as InquiryItem)
  );
  const [isDetailView, setIsDetailView] = useState<boolean>(initialSubView === '询盘内容详情');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Modals & Feedback
  const [isChannelConfigOpen, setIsChannelConfigOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectInquiry = (item: InquiryItem) => {
    setSelectedInquiry(item);
    setIsDetailView(true);
  };

  const handleAddInquiry = (newInquiry: InquiryItem) => {
    setInquiriesList((prev) => [newInquiry, ...prev]);
    setSelectedInquiry(newInquiry);
    showToast('新询盘已成功录入并接入售前AI机器人！');
  };

  const handleCopyPhone = (e: React.MouseEvent, phone?: string, id?: string) => {
    e.stopPropagation();
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id || phone);
    setTimeout(() => setCopiedPhoneId(null), 2000);
    showToast(`WordPress 号码 ${phone} 已复制`);
  };

  // Helper to parse inquiry date
  const parseItemDate = (item: InquiryItem): Date | null => {
    const raw = item.createdAt || item.receivedAt;
    if (!raw) return null;
    const datePart = raw.split(' ')[0]; // e.g. 2026-08-17
    const d = new Date(datePart);
    return isNaN(d.getTime()) ? null : d;
  };

  const getChineseCountryName = (country?: string, countryCode?: string): string => {
    const map: Record<string, string> = {
      'United States': '美国',
      'US': '美国',
      'Germany': '德国',
      'DE': '德国',
      'United Kingdom': '英国',
      'UK': '英国',
      'GB': '英国',
      'United Arab Emirates': '阿拉伯联合酋长国',
      'AE': '阿拉伯联合酋长国',
      'Australia': '澳大利亚',
      'AU': '澳大利亚',
      'France': '法国',
      'FR': '法国',
      'Spain': '西班牙',
      'ES': '西班牙',
      'Italy': '意大利',
      'IT': '意大利',
      'Japan': '日本',
      'JP': '日本',
      'Switzerland': '瑞士',
      'CH': '瑞士'
    };
    if (country && map[country]) return map[country];
    if (countryCode && map[countryCode]) return map[countryCode];
    return country || '海外';
  };

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiriesList
      .filter((item) => {
        // 1. Keyword search (Name, phone, company, country, RFQ, category)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.buyerName?.toLowerCase().includes(q);
          const matchCompany = item.companyName?.toLowerCase().includes(q);
          const matchCountry = item.country?.toLowerCase().includes(q);
          const matchPhone = item.contactNumber?.toLowerCase().includes(q);
          const matchRfq = item.inquiryNo?.toLowerCase().includes(q);
          const matchCategory = item.furnitureCategory?.toLowerCase().includes(q);
          if (
            !matchName &&
            !matchCompany &&
            !matchCountry &&
            !matchPhone &&
            !matchRfq &&
            !matchCategory
          ) {
            return false;
          }
        }

        // 2. Time Range Filter (询盘时间查询)
        const itemDateStr = (item.createdAt || item.receivedAt || '').split(' ')[0];
        if (startDate && itemDateStr < startDate) {
          return false;
        }
        if (endDate && itemDateStr > endDate) {
          return false;
        }

        if (timeQuickRange !== 'ALL') {
          // Determine benchmark reference date from dataset (latest date: 2026-08-17)
          const refDateStr = '2026-08-17';
          if (timeQuickRange === 'TODAY') {
            if (itemDateStr !== refDateStr) return false;
          } else if (timeQuickRange === '7DAYS') {
            const minDate = '2026-08-10';
            if (itemDateStr < minDate) return false;
          } else if (timeQuickRange === '30DAYS' || timeQuickRange === 'THIS_MONTH') {
            if (!itemDateStr.startsWith('2026-08')) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return (b.aiScore || 0) - (a.aiScore || 0);
        }
        if (sortBy === 'budget') {
          return (b.budget || '').localeCompare(a.budget || '');
        }
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
  }, [inquiriesList, searchQuery, startDate, endDate, timeQuickRange, sortBy]);

  // Paginated Inquiries
  const totalPages = Math.ceil(filteredInquiries.length / pageSize) || 1;
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInquiries.slice(start, start + pageSize);
  }, [filteredInquiries, currentPage, pageSize]);

  // Selection handlers for batch export
  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((i) => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedInquiries.length && paginatedInquiries.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedInquiries.map((i) => i.id));
    }
  };

  const handleBatchExport = () => {
    if (selectedRows.length > 0) {
      const itemsToExport = inquiriesList.filter((item) => selectedRows.includes(item.id));
      exportInquiriesToExcel(itemsToExport, `HomeCraft_WordPress已勾选询盘_${itemsToExport.length}条`);
      showToast(`已成功导出勾选的 ${itemsToExport.length} 位客户询盘到 Excel！`);
    } else {
      exportInquiriesToExcel(filteredInquiries, `HomeCraft_WordPress询盘表_共${filteredInquiries.length}条`);
      showToast(`已成功导出当前筛选的全部 ${filteredInquiries.length} 条询盘数据到 Excel！`);
    }
  };

  const handleExportSingleRow = (e: React.MouseEvent, item: InquiryItem) => {
    e.stopPropagation();
    exportInquiriesToExcel([item], `HomeCraft_询盘客户_${item.buyerName}_${item.inquiryNo || item.id}`);
    showToast(`已成功导出客户 ${item.buyerName} 的询盘记录到 Excel！`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setTimeQuickRange('ALL');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
    setCurrentPage(1);
    setSelectedRows([]);
    showToast('已重置所有查询条件');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar px-4 lg:px-6 pb-6 pt-1 space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Header (Only on list view) */}
      {!isDetailView && (
        <div className="flex items-center justify-between py-3 mb-2 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">售前询盘</h2>
          </div>

          {/* Action Buttons: Batch Export */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleBatchExport}
              className="h-9 px-4 rounded-full bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>
                {selectedRows.length > 0
                  ? `导出选中 (${selectedRows.length})`
                  : '导出 Excel'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Detail View vs. Inquiries List */}
      {isDetailView ? (
        <InquiryChatDetailView inquiry={selectedInquiry} onBack={() => setIsDetailView(false)} />
      ) : (
        <div className="space-y-4">
          {/* 2.1 Time Range & Filter Bar */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex flex-col gap-3 shrink-0">
            {/* Row 1: Time Quick Range Tabs & Custom Date Inputs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>询盘时间:</span>
                </span>

                {/* Quick Date Pills */}
                {(
                  [
                    { id: 'ALL', label: '全部' },
                    { id: 'TODAY', label: '今日 (08-17)' },
                    { id: '7DAYS', label: '近 7 天' },
                    { id: '30DAYS', label: '近 30 天' },
                    { id: 'THIS_MONTH', label: '本月' }
                  ] as const
                ).map((tab) => {
                  const isActive = timeQuickRange === tab.id && !startDate && !endDate;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setTimeQuickRange(tab.id);
                        setStartDate('');
                        setEndDate('');
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#EA3A20] text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Date Range Picker */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 text-[11px] font-medium">起止日期:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-slate-400">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-mono focus:outline-none focus:border-emerald-500"
                />
                {(startDate || endDate || timeQuickRange !== 'ALL') && (
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      setTimeQuickRange('ALL');
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                    title="清空日期筛选"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Search, Intent Filter & Sorting */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px] max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索买家姓名、号码、公司、国家或品类..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>


              </div>

              {/* Sort selector & Reset */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-400 text-[11px] font-semibold">排序:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 text-slate-700 rounded-xl px-2.5 py-1 text-xs border border-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="newest">最新询盘</option>
                  <option value="score">AI意向评分</option>
                  <option value="budget">采购预算</option>
                </select>

                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  重置
                </button>
              </div>
            </div>

            {/* Batch Action Toolbar when items are selected */}
            {selectedRows.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 flex items-center justify-between text-xs animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>已选择 {selectedRows.length} 项</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRows([])}
                    className="text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                  >
                    取消选择
                  </button>
                  <button
                    onClick={handleBatchExport}
                    className="px-3 py-1 rounded-lg bg-[#EA3A20] hover:bg-[#d6341c] text-white font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>批量导出</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2.2 Inquiry Customer Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-900 text-xs font-semibold bg-slate-50/50">
                    <th className="py-3.5 pl-5 pr-3 w-12 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        title="全选 / 反选当前页"
                      >
                        {selectedRows.length === paginatedInquiries.length && paginatedInquiries.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-3 font-semibold text-slate-900">询盘编号</th>
                    <th className="py-3.5 px-3 font-semibold text-slate-900">客户</th>
                    <th className="py-3.5 px-3 font-semibold text-slate-900">国家</th>
                    <th className="py-3.5 px-3 font-semibold text-slate-900">询盘时间</th>
                    <th className="py-3.5 px-3 font-semibold text-slate-900">采购品类与需求</th>
                    <th className="py-3.5 px-3 font-semibold text-slate-900">接待状态</th>
                    <th className="py-3.5 pr-5 pl-2 text-right font-semibold text-slate-900">操作</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <MessageCircle className="w-8 h-8 text-slate-300" />
                          <p className="text-xs font-semibold">未找到符合该时间或筛选条件的询盘客户</p>
                          <button
                            onClick={handleResetFilters}
                            className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                          >
                            清空筛选查看全部
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedInquiries.map((item) => {
                      const isSelected = selectedRows.includes(item.id);
                      const chatHistory = getInquiryChatHistory(item);
                      const turnsCount = chatHistory.length;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => handleSelectInquiry(item)}
                          className={`hover:bg-slate-50/70 transition-colors cursor-pointer h-16 ${
                            isSelected ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          {/* Checkbox Column */}
                          <td
                            className="py-3.5 pl-6 pr-3 text-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectRow(item.id);
                            }}
                          >
                            <button className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                              {isSelected ? (
                                <CheckSquare className="w-4.5 h-4.5 text-emerald-600" />
                              ) : (
                                <Square className="w-4.5 h-4.5 text-slate-300" />
                              )}
                            </button>
                          </td>

                          {/* Inquiry RFQ No. */}
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                            {item.inquiryNo || item.id}
                          </td>

                          {/* Buyer & WordPress Phone */}
                          <td className="py-3.5 px-3">
                            <div className="min-w-[140px]">
                              <div className="font-bold text-slate-900 truncate">
                                <span>{item.buyerName}</span>
                              </div>
                              <div
                                onClick={(e) => handleCopyPhone(e, item.contactNumber, item.id)}
                                className="text-[11px] text-emerald-700 font-mono font-semibold flex items-center gap-1 mt-0.5 hover:text-emerald-800"
                                title="点击复制 WordPress 号码"
                              >
                                <MessageCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{item.contactNumber}</span>
                                {copiedPhoneId === item.id && (
                                  <span className="text-[9px] text-emerald-600 font-sans font-bold">已复制</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Country */}
                          <td className="py-3.5 px-3">
                            <span className="font-semibold text-slate-800 text-xs">
                              {getChineseCountryName(item.country, item.countryCode)}
                            </span>
                          </td>

                          {/* Inquiry Time (询盘时间) */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="text-slate-800 font-mono text-[11px] font-semibold">
                              {item.createdAt || item.receivedAt}
                            </div>
                          </td>

                          {/* Category & Requirements */}
                          <td className="py-3.5 px-3">
                            <div
                              className="max-w-[210px] truncate font-medium text-slate-800"
                              title={item.furnitureCategory}
                            >
                              {item.furnitureCategory}
                            </div>
                          </td>





                          {/* Pre-sales Robot Status & Chat Turns */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="font-medium text-emerald-800 text-[11px]">
                                {turnsCount} 轮会话
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td
                            className="py-3.5 pr-5 pl-2 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSelectInquiry(item)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer border border-emerald-200 hover:border-emerald-600 flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>查看会话</span>
                              </button>

                              <button
                                onClick={(e) => handleExportSingleRow(e, item)}
                                className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                title="导出此记录"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2.3 Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500">
              共 {filteredInquiries.length} 位询盘客户，当前显示第{' '}
              {filteredInquiries.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(filteredInquiries.length, currentPage * pageSize)} 位
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-1.5 rounded-full border border-emerald-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                  currentPage === 1
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                上一页
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-1.5 rounded-full border border-red-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-red-50 hover:bg-red-100 text-[#EA3A20]'
                }`}
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ChannelConfigModal
        isOpen={isChannelConfigOpen}
        onClose={() => setIsChannelConfigOpen(false)}
      />

      <CreateInquiryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddInquiry={handleAddInquiry}
      />
    </div>
  );
};
