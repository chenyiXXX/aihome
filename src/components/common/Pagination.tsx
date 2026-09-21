import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  itemUnit?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = true,
  showSizeChanger = true,
  itemUnit = '条',
  className = ''
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const [jumpInput, setJumpInput] = useState('');

  // Generate page numbers to show with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('ellipsis');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpInput.trim(), 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      onPageChange(target);
      setJumpInput('');
    }
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 text-xs text-slate-600 select-none ${className}`}
    >
      {/* Left: Summary and Page Size */}
      <div className="flex items-center gap-3">
        <span className="text-slate-500">
          共 <strong className="font-semibold text-slate-800">{totalItems}</strong> {itemUnit}
          {totalItems > 0 && (
            <span className="hidden sm:inline text-slate-400 ml-1.5">
              （当前显示 {startItem} - {endItem} {itemUnit}）
            </span>
          )}
        </span>

        {showSizeChanger && onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                onPageSizeChange(newSize);
                onPageChange(1);
              }}
              aria-label="每页条数"
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 outline-none hover:border-slate-300 focus:border-[#EA3A20] focus:ring-1 focus:ring-[#EA3A20]/20 cursor-pointer shadow-2xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} {itemUnit}/页
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Buttons & Quick Jumper */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="首页"
          title="首页"
          className="p-1 rounded-lg border border-slate-200/80 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="上一页"
          title="上一页"
          className="px-2 py-1 rounded-lg border border-slate-200/80 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-0.5 font-medium shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">上一页</span>
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((item, idx) => {
            if (item === 'ellipsis') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 font-mono">
                  •••
                </span>
              );
            }
            const isCurrent = item === currentPage;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? 'bg-[#EA3A20] text-white shadow-xs font-bold'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="下一页"
          title="下一页"
          className="px-2 py-1 rounded-lg border border-slate-200/80 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-0.5 font-medium shadow-2xs cursor-pointer"
        >
          <span className="hidden sm:inline">下一页</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="末页"
          title="末页"
          className="p-1 rounded-lg border border-slate-200/80 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>

        {/* Quick Jumper */}
        {showQuickJumper && totalPages > 1 && (
          <form onSubmit={handleJump} className="hidden md:flex items-center gap-1 text-slate-500 ml-2">
            <span>跳至</span>
            <input
              type="text"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value.replace(/\D/g, ''))}
              placeholder={String(currentPage)}
              aria-label="跳转页码"
              className="w-10 text-center py-0.5 px-1 bg-white border border-slate-200 rounded-md text-slate-800 text-xs outline-none hover:border-slate-300 focus:border-[#EA3A20] focus:ring-1 focus:ring-[#EA3A20]/20 shadow-2xs font-mono"
            />
            <span>页</span>
          </form>
        )}
      </div>
    </div>
  );
};
