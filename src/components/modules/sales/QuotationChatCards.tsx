import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Copy,
  Download,
  Edit3,
  Sparkles,
  Building2,
  User,
  ShieldCheck,
  Check,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronUp,
  Box,
  Image as ImageIcon
} from 'lucide-react';
import { QuotationRequirementConfirmData, GeneratedQuotationCardData } from '../../../types';

// ==========================================
// 1. 报价需求确认卡片 (Quotation Requirement Confirm Card)
// ==========================================
interface QuotationConfirmCardProps {
  data: QuotationRequirementConfirmData;
  onConfirm: (cardId: string, updatedData?: QuotationRequirementConfirmData) => void;
  onModify?: (cardId: string) => void;
  onViewDrawing?: (drawingName: string) => void;
}

export const QuotationConfirmCard: React.FC<QuotationConfirmCardProps> = ({
  data,
  onConfirm,
  onViewDrawing
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<QuotationRequirementConfirmData>(data);
  const [isExpandedDrawings, setIsExpandedDrawings] = useState(true);
  const [isExpandedProducts, setIsExpandedProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfirmed = data.status === 'confirmed';

  const handleUpdateItemQty = (itemId: string, newQty: number) => {
    const updatedItems = editableData.productItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, qty: Math.max(0.1, Number(newQty) || 1) };
      }
      return item;
    });
    const newTotal = updatedItems.reduce((acc, curr) => acc + curr.qty * curr.estimatedPrice, 0);
    setEditableData({
      ...editableData,
      productItems: updatedItems,
      totalEstimatedAmount: Math.round(newTotal)
    });
  };

  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    const updatedItems = editableData.productItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, estimatedPrice: Math.max(0, Number(newPrice) || 0) };
      }
      return item;
    });
    const newTotal = updatedItems.reduce((acc, curr) => acc + curr.qty * curr.estimatedPrice, 0);
    setEditableData({
      ...editableData,
      productItems: updatedItems,
      totalEstimatedAmount: Math.round(newTotal)
    });
  };

  const handleConfirmClick = () => {
    if (isConfirmed || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(data.id, editableData);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div
      id={`quote-confirm-card-${data.id}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm my-2 text-left ${
        isConfirmed
          ? 'bg-slate-50/90 border-emerald-200 ring-1 ring-emerald-500/20'
          : 'bg-white border-amber-200 ring-1 ring-amber-500/20'
      }`}
    >
      {/* Header Banner */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          isConfirmed
            ? 'bg-emerald-50/80 border-emerald-100 text-emerald-900'
            : 'bg-gradient-to-r from-amber-50 to-orange-50/60 border-amber-100 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              isConfirmed
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-2xs'
            }`}
          >
            {isConfirmed ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight">
                {isConfirmed ? '报价需求已核准 · 正式报价单已生成' : 'AI 智能报价 · 客户定制需求核对卡'}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isConfirmed
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                }`}
              >
                {isConfirmed ? '已核对生成' : '待销售确认'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isConfirmed
                ? `销售已确认核准需求（${data.confirmedAt || '刚刚'}），已生成正式 PI 形式发票。`
                : 'AI 已从当前客户沟通、设计图纸与知识库中自动提取报价清单，请核对信息是否准确：'}
            </p>
          </div>
        </div>

        {!isConfirmed && (
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#EA3A20] px-2.5 py-1 rounded-lg hover:bg-white/80 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? '完成微调' : '快速微调'}</span>
          </button>
        )}
      </div>

      <div className="p-4 space-y-3.5 text-xs text-slate-700">
        {/* Project & Client Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 text-[11px]">客户名称：</span>
            <span className="font-bold text-slate-800 truncate">{editableData.customerName}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 text-[11px]">项目名称：</span>
            <span className="font-bold text-slate-800 truncate">{editableData.projectName}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 text-[11px]">贸易条款：</span>
            <span className="font-semibold text-slate-800">{editableData.tradeTerm}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 font-mono rounded border border-blue-100">
              {editableData.currency}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 text-[11px]">生产交期：</span>
            <span className="font-semibold text-slate-800">{editableData.leadTime}</span>
          </div>
        </div>

        {/* 1. Design Drawings / Renderings Section (设计图纸与渲染图) */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setIsExpandedDrawings(!isExpandedDrawings)}
            className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold text-slate-800 text-[11px]">
                关联设计图纸与渲染效果图 ({editableData.designDrawings.length}份)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>{isExpandedDrawings ? '收起' : '展开'}</span>
              {isExpandedDrawings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isExpandedDrawings && (
            <div className="p-2.5 bg-white space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {editableData.designDrawings.map((dwg, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        {dwg.type === 'dwg' ? (
                          <FileText className="w-4 h-4" />
                        ) : dwg.type === 'image' ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                          {dwg.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{dwg.size}</span>
                          {dwg.tag && (
                            <span className="px-1 py-0.2 rounded bg-indigo-50 text-indigo-600 font-medium text-[9px]">
                              {dwg.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewDrawing?.(dwg.name)}
                      className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-white transition-colors shrink-0 cursor-pointer"
                    >
                      查看
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Product Line Items (产品类型与定制需求明细) */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setIsExpandedProducts(!isExpandedProducts)}
            className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Box className="w-3.5 h-3.5 text-[#EA3A20]" />
              <span className="font-bold text-slate-800 text-[11px]">
                定制产品类型与规格清单 ({editableData.productItems.length}项)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>{isExpandedProducts ? '收起' : '展开'}</span>
              {isExpandedProducts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isExpandedProducts && (
            <div className="divide-y divide-slate-100 bg-white">
              {editableData.productItems.map((item) => (
                <div key={item.id} className="p-3 hover:bg-slate-50/60 transition-colors space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.spec}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold font-mono text-[#EA3A20]">
                        ${(item.qty * item.estimatedPrice).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ${item.estimatedPrice}/{item.unit}
                      </div>
                    </div>
                  </div>

                  {/* Highlights (Color / Hardware / Custom) */}
                  <div className="flex items-center gap-2 flex-wrap text-[10px]">
                    {item.color && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                        🎨 颜色/涂装: {item.color}
                      </span>
                    )}
                    {item.hardware && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-100 font-medium">
                        🔩 五金配置: {item.hardware}
                      </span>
                    )}
                  </div>

                  {/* Inline Edit Controls if isEditing */}
                  {isEditing && !isConfirmed && (
                    <div className="mt-2 pt-2 border-t border-dashed border-slate-200 grid grid-cols-2 gap-3 bg-amber-50/40 p-2 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 shrink-0">数量({item.unit}):</span>
                        <input
                          type="number"
                          step="0.1"
                          value={item.qty}
                          onChange={(e) => handleUpdateItemQty(item.id, parseFloat(e.target.value))}
                          className="w-20 px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#EA3A20]"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 shrink-0">预估单价($):</span>
                        <input
                          type="number"
                          step="10"
                          value={item.estimatedPrice}
                          onChange={(e) => handleUpdateItemPrice(item.id, parseFloat(e.target.value))}
                          className="w-24 px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#EA3A20]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commercial Terms & Total Estimation */}
        <div className="p-3 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>结算条款: {editableData.depositTerm}</span>
            </div>
            {editableData.specialNotes && (
              <p className="text-[10px] text-slate-400">备注: {editableData.specialNotes}</p>
            )}
          </div>

          <div className="text-right w-full sm:w-auto">
            <span className="text-[10px] text-slate-400 font-medium block">预估报价总金额 ({editableData.currency})</span>
            <span className="text-lg font-black font-mono text-[#EA3A20]">
              ${editableData.totalEstimatedAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          {isConfirmed ? (
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>已核对确认 · 报价单已于下方会话中生成</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {isEditing ? '保存修改' : '修改内容'}
              </button>

              <button
                type="button"
                onClick={handleConfirmClick}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#EA3A20] to-[#c42810] hover:from-[#c42810] hover:to-[#9e1c08] shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>正在核算生成正式报价单...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>确认无误，立即生成报价单</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. AI 已生成的正式报价单 / 形式发票 (PI) 卡片
// ==========================================
interface GeneratedQuotationCardProps {
  data: GeneratedQuotationCardData;
  onOpenFullModal?: () => void;
  onCopyPitch?: (pitch: string) => void;
  onDownloadPdf?: () => void;
  onExportExcel?: () => void;
}

export const GeneratedQuotationCard: React.FC<GeneratedQuotationCardProps> = ({
  data,
  onOpenFullModal,
  onCopyPitch,
  onDownloadPdf,
  onExportExcel
}) => {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'pitch'>('items');

  const handleCopy = () => {
    const textToCopy = `【Proforma Invoice ${data.quoteNo}】\n\n${data.salesPitchEn}\n\n---\n${data.salesPitchZh}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPitch(true);
    onCopyPitch?.(textToCopy);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div
      id={`generated-quote-card-${data.quoteNo}`}
      className="rounded-2xl border border-indigo-200 bg-white overflow-hidden shadow-md my-2 text-left ring-1 ring-indigo-500/20"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA3A20] to-orange-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight">
                外贸商业形式发票 · PROFORMA INVOICE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                {data.quoteNo}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
              品爱家居 (PA Kitchen & Home) · {data.projectName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onOpenFullModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-white/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>全屏查看/打印</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 pt-3 border-b border-slate-100 gap-4 bg-slate-50/50">
        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className={`pb-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'items'
              ? 'border-[#EA3A20] text-[#EA3A20]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>报价明细与财务核算</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pitch')}
          className={`pb-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'pitch'
              ? 'border-[#EA3A20] text-[#EA3A20]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>对客中英商务报价函</span>
        </button>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {activeTab === 'items' ? (
          <>
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-red-50/60 rounded-xl border border-red-100">
                <span className="text-[10px] text-slate-500 block font-medium">报价总金额 (CIF)</span>
                <span className="text-base font-black font-mono text-[#EA3A20]">
                  ${data.totalAmount.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block font-mono">{data.currency}</span>
              </div>
              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-500 block font-medium">首期定金 ({data.depositPercent}%)</span>
                <span className="text-base font-bold font-mono text-amber-900">
                  ${data.depositAmount.toLocaleString()}
                </span>
                <span className="text-[9px] text-amber-700 block">用于锁定板材排产</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block font-medium">尾款 ({100 - data.depositPercent}%)</span>
                <span className="text-base font-bold font-mono text-slate-800">
                  ${data.balanceAmount.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block">见提单副本或装柜前</span>
              </div>
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-500 block font-medium">预估体积 & 装柜</span>
                <span className="text-sm font-bold text-blue-900 truncate block mt-0.5">
                  {data.cbmEstimate} CBM
                </span>
                <span className="text-[9px] text-blue-700 block truncate">{data.containerLoading}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2">定制项目 / 材质工艺</th>
                    <th className="px-3 py-2 text-center w-20">数量</th>
                    <th className="px-3 py-2 text-right w-24">单价</th>
                    <th className="px-3 py-2 text-right w-28">小计金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.spec}</div>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-medium text-slate-700">
                        {item.qty} {item.unit}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-slate-600">
                        ${item.price.toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                        ${item.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* English & Chinese Pitch View */
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-2 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-amber-400">
                  📧 建议直接复制发送客户的商务英文报价信 (English Quotation Email)
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
                >
                  {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitch ? '已复制' : '一键复制'}</span>
                </button>
              </div>
              <div className="text-xs font-mono leading-relaxed whitespace-pre-wrap text-slate-300">
                {data.salesPitchEn}
              </div>
            </div>

            <div className="p-3 bg-slate-50 text-slate-700 rounded-xl space-y-1 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-900 block">
                💡 中文对客策略解析
              </span>
              <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">
                {data.salesPitchZh}
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>有效工期: {data.leadTime} · 报价有效期: {data.validDays}天</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>下载 PDF 形式发票</span>
            </button>

            <button
              type="button"
              onClick={onExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>导出 Excel</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPitch ? '话术已复制' : '复制英文报价话术'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
