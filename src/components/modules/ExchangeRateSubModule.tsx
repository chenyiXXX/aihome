import React, { useState, useMemo, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  FileSpreadsheet,
  ExternalLink,
  ShieldCheck,
  Check,
  Eye,
  Search,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  Database,
  Link2
} from 'lucide-react';
import { ExchangeRateItem } from '../../types';
import { initialExchangeRates } from '../../data/mockData';

interface ExchangeRateSubModuleProps {
  currentBaseRate: number;
  onUpdateBaseRate?: (newRate: number) => void;
  hideHeader?: boolean;
  externalRatesList?: Array<ExchangeRateItem & { docCell: string }>;
  onRatesListChange?: (newRates: Array<ExchangeRateItem & { docCell: string }>) => void;
  externalLastUpdatedTime?: string;
  onLastUpdatedChange?: (newTime: string) => void;
}

export const ExchangeRateSubModule: React.FC<ExchangeRateSubModuleProps> = ({
  currentBaseRate,
  onUpdateBaseRate,
  hideHeader = false,
  externalRatesList,
  onRatesListChange,
  externalLastUpdatedTime,
  onLastUpdatedChange
}) => {
  // Document source config
  const documentSourceInfo = {
    docName: '《企业财务中心外贸多币种结算基准与锁汇牌价表.xlsx》',
    docUrl: 'https://docs.company.internal/finance/fx_settlement_benchmarks_2026q3.xlsx',
    sheetName: '外贸多币种即时结算牌价表',
    syncStrategy: '只读映射 • 每日 09:30 自动拉取 • 支持即时重新读取',
    sourceDept: '集团财务管理中心 / 资金风控部',
    dataSource: '中国外汇交易中心 (CFETS) + 银行外汇牌价实时中枢'
  };

  // State: Latest Update Time (formatted string)
  const [docLastUpdatedTime, setDocLastUpdatedTime] = useState<string>(
    externalLastUpdatedTime || '2026-09-03 16:30:15'
  );
  const [nextScheduledTime, setNextScheduledTime] = useState<string>('2026-09-04 09:30:00');

  // Sync external update time
  useEffect(() => {
    if (externalLastUpdatedTime) {
      setDocLastUpdatedTime(externalLastUpdatedTime);
    }
  }, [externalLastUpdatedTime]);

  // State: Exchange Rates List (Read directly from document)
  const [internalRatesList, setInternalRatesList] = useState<Array<ExchangeRateItem & { docCell: string }>>(() => {
    const docCells = ['FX!B2:E2', 'FX!B3:E3', 'FX!B4:E4', 'FX!B5:E5', 'FX!B6:E6', 'FX!B7:E7', 'FX!B8:E8'];
    return initialExchangeRates.map((item, idx) => {
      const sysRate = item.currencyCode === 'USD' ? (currentBaseRate || item.systemRate) : item.systemRate;
      const settle = +(sysRate * (1 + item.bufferPercent / 100)).toFixed(4);
      return {
        ...item,
        systemRate: sysRate,
        settlementRate: settle,
        lastUpdated: '2026-09-03 16:30:15',
        docCell: docCells[idx] || `FX!B${idx + 2}`
      };
    });
  });

  const ratesList = externalRatesList || internalRatesList;
  const setRatesList = (newVal: Array<ExchangeRateItem & { docCell: string }> | ((prev: Array<ExchangeRateItem & { docCell: string }>) => Array<ExchangeRateItem & { docCell: string }>)) => {
    if (typeof newVal === 'function') {
      const updated = newVal(ratesList);
      if (onRatesListChange) {
        onRatesListChange(updated);
      } else {
        setInternalRatesList(updated);
      }
    } else {
      if (onRatesListChange) {
        onRatesListChange(newVal);
      } else {
        setInternalRatesList(newVal);
      }
    }
  };

  // Search & Filter
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  // Detail Modal State (Read-only view of document mapping)
  const [selectedDocItem, setSelectedDocItem] = useState<(ExchangeRateItem & { docCell: string }) | null>(null);
  const [isDocConfigModalOpen, setIsDocConfigModalOpen] = useState(false);

  // Sync animation state
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered List
  const filteredRates = useMemo(() => {
    return ratesList.filter((item) => {
      const matchKeyword =
        !searchKeyword ||
        item.currencyCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.currencyName.toLowerCase().includes(searchKeyword.toLowerCase());

      const matchStatus =
        statusFilter === '全部' || item.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [ratesList, searchKeyword, statusFilter]);

  // Re-read rates from designated document
  const handleReReadDocument = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      setDocLastUpdatedTime(nowStr);
      if (onLastUpdatedChange) {
        onLastUpdatedChange(nowStr);
      }

      // Slightly update rates to simulate reading fresh data from document
      const updated = ratesList.map((item) => {
        const delta = (Math.random() * 0.004 - 0.002) * item.systemRate;
        const newSystem = +(item.systemRate + delta).toFixed(4);
        const newSettle = +(newSystem * (1 + item.bufferPercent / 100)).toFixed(4);
        return {
          ...item,
          systemRate: newSystem,
          settlementRate: newSettle,
          lastUpdated: nowStr
        };
      });

      setRatesList(updated);

      // Update parent USD if changed
      const updatedUSD = updated.find((r) => r.currencyCode === 'USD');
      if (updatedUSD && onUpdateBaseRate) {
        onUpdateBaseRate(updatedUSD.systemRate);
      }

      showToast(`已成功从指定文档《${documentSourceInfo.docName}》读取最新汇率数据！`);
    }, 850);
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${hideHeader ? 'min-h-0' : 'px-8 pb-8'}`}>
      
      {/* Top Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between py-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold shadow-xs">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">汇率管理</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>从指定文档读取 (只读模式)</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                本系统直接读取财务指定文档中的外贸多币种汇率与结算基准，用于全系统BOQ工程量自动折算，无需本地维护
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsDocConfigModalOpen(true)}
              className="h-9 px-4 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="查看汇率数据源文档连接信息"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>查看源文档配置</span>
            </button>

            <button
              type="button"
              onClick={handleReReadDocument}
              disabled={isSyncing}
              className="h-9 px-4.5 rounded-full bg-[#EA3A20] text-white hover:bg-[#d6341c] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              title="立即从财务指定文档读取最新汇率"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? '正在从文档读取...' : '从指定文档重新读取'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        
        {/* Rates Table from Designated Document */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col">
          
          {/* Table Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <h2 className="text-sm font-bold text-slate-900">从指定文档读取的全部结算汇率</h2>
              <span className="text-xs text-slate-400 font-mono">({filteredRates.length} 币种)</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="全部">全部状态</option>
                <option value="已生效">已生效</option>
                <option value="已锁定">已锁定</option>
              </select>

              {/* Search Bar */}
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="搜索货币代码/名称..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full h-8 pl-8 pr-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold bg-slate-50/60">
                  <th className="py-3 px-4">币种代号</th>
                  <th className="py-3 px-3">币种全称</th>
                  <th className="py-3 px-3 text-right">文档基准汇率 (CNY)</th>
                  <th className="py-3 px-3 text-right">市场实时参考</th>
                  <th className="py-3 px-3 text-center">安全缓冲</th>
                  <th className="py-3 px-3 text-right">核算结算汇率</th>
                  <th className="py-3 px-3 text-center">源文档位置</th>
                  <th className="py-3 px-3">数据最新更新时间</th>
                  <th className="py-3 px-3 text-center">状态</th>
                  <th className="py-3 pr-4 pl-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRates.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.flag}</span>
                        <span className="font-mono font-bold text-slate-800">{item.currencyCode}</span>
                        {item.currencyCode === 'USD' && (
                          <span className="px-1.5 py-0.2 rounded bg-red-50 text-[#EA3A20] text-[9px] font-bold">主基准</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {item.currencyName}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                      ¥{item.systemRate.toFixed(4)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono text-slate-600 font-medium">
                        ¥{item.marketRate.toFixed(4)}
                      </div>
                      <div className={`text-[10px] font-mono ${item.changeRate24h >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.changeRate24h >= 0 ? '+' : ''}{item.changeRate24h}%
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold text-[11px]">
                        +{item.bufferPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono font-bold text-emerald-700 text-sm">
                        ¥{item.settlementRate.toFixed(4)}
                      </div>
                      <div className="text-[10px] text-slate-400">BOQ核算价</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono rounded text-[11px] border border-blue-100">
                        {item.docCell}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{item.lastUpdated}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        item.status === '已锁定'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>从文档同步</span>
                      </span>
                    </td>
                    <td className="py-3 pr-4 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedDocItem(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                        title="查看源文档映射明细"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Table Footer */}
          <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>数据源文档：<strong className="text-slate-800">{documentSourceInfo.docName}</strong></span>
              <span>•</span>
              <span>当前共读取 <strong className="text-slate-800">{ratesList.length}</strong> 个结算币种汇率</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>如需调整基准汇率或锁汇政策，请直接在集团财务中心的指定文档中维护，保存后本系统自动同步</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================= MODAL: 查看数据源文档连接配置 ======================= */}
      {isDocConfigModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">汇率数据源文档连接配置</h3>
                  <p className="text-[11px] text-slate-400">只读映射模式：本系统不作本地数据修改</p>
                </div>
              </div>
              <button
                onClick={() => setIsDocConfigModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">指定文档名称</span>
                  <span className="font-bold text-slate-900">{documentSourceInfo.docName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">文档存储地址</span>
                  <span className="font-mono text-slate-700 text-[11px] truncate max-w-[280px]">
                    {documentSourceInfo.docUrl}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">目标工作表 (Sheet)</span>
                  <span className="font-mono font-semibold text-blue-700">{documentSourceInfo.sheetName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">文档所有权 / 维护部门</span>
                  <span className="font-semibold text-slate-800">{documentSourceInfo.sourceDept}</span>
                </div>
              </div>

              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1.5">
                <div className="font-bold text-[#EA3A20] flex items-center gap-1.5 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>数据最新更新时间</span>
                </div>
                <div className="text-base font-mono font-extrabold text-slate-900">
                  {docLastUpdatedTime}
                </div>
                <div className="text-[11px] text-slate-500">
                  每逢财务中心更新文档，本系统在每日开盘 09:30 自动拉取，或点击「从指定文档重新读取」即刻更新。
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-[11px] leading-relaxed">
                <strong>说明：</strong> 本系统定位为外贸定制报价与工程量清单计算中枢，不参与基础汇率的录入与修改，严格执行集团财务指定文档发布的牌价基准与锁汇规范。
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDocConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDocConfigModalOpen(false);
                    handleReReadDocument();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EA3A20] text-white hover:bg-[#d6341c] font-bold cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>立即从该文档重新读取</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: 查看单项币种在文档中的映射明细 ======================= */}
      {selectedDocItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedDocItem.flag}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedDocItem.currencyCode} - {selectedDocItem.currencyName}
                  </h3>
                  <p className="text-[11px] text-slate-400">文档映射单元格: {selectedDocItem.docCell}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocItem(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px]">文档基准汇率</div>
                  <div className="text-base font-mono font-extrabold text-slate-900 mt-0.5">
                    ¥{selectedDocItem.systemRate.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px]">安全缓冲溢价</div>
                  <div className="text-base font-mono font-extrabold text-emerald-600 mt-0.5">
                    +{selectedDocItem.bufferPercent}%
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="text-emerald-800 text-[10px] font-bold">最终核算结算汇率 (用于BOQ)</div>
                <div className="text-xl font-mono font-black text-emerald-700 mt-0.5">
                  ¥{selectedDocItem.settlementRate.toFixed(4)}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  核算公式：基准单价(外币) × {selectedDocItem.settlementRate.toFixed(4)} = 人民币成本基准
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">指定来源文档：</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[200px]">{documentSourceInfo.docName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">工作表位置：</span>
                  <span className="font-mono text-blue-700">{documentSourceInfo.sheetName} ! {selectedDocItem.docCell}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">数据最新更新时间：</span>
                  <span className="font-mono font-bold text-red-600">{selectedDocItem.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">数据读取状态：</span>
                  <span className="text-emerald-600 font-bold">校验通过 • 正常生效</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDocItem(null)}
                  className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
