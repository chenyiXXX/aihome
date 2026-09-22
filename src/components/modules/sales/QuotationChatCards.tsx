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
  Image as ImageIcon,
  Calculator,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Info,
  Sparkle,
  Globe,
  Tag,
  MapPin
} from 'lucide-react';
import {
  QuotationRequirementConfirmData,
  GeneratedQuotationCardData,
  MissingQuoteFieldsData,
  QuotationCalculationMethod,
  QuoteMarketType
} from '../../../types';

// 标准外贸出口投影产品清单 (USD)
export const DEFAULT_PROJECTION_ITEMS_OVERSEAS = [
  {
    id: 'proj-1',
    category: '橱柜工程',
    name: '现代意式极简全屋定制橱柜 (含中岛台)',
    spec: '进口爱格板 W1000 + 45°斜切无拉手 + 纯白岩板台面 + 岛台指定 RAL 5004 海军蓝哑光烤漆',
    qty: 12.5,
    unit: '延米',
    estimatedPrice: 680,
    color: 'RAL 5004 海军蓝 (中岛) + 暖白肤感 (主柜)',
    hardware: 'Blum 阻尼铰链 + 隐形触碰反弹器'
  },
  {
    id: 'proj-2',
    category: '衣帽间工程',
    name: '主卧实木高定步入式衣帽间系统',
    spec: '多层实木高定柜体 + 铝合金窄边框茶色玻璃门 + 嵌入式 3000K 暖光感应灯带',
    qty: 24,
    unit: '㎡',
    estimatedPrice: 450,
    color: '胡桃木纹多层实木 + 茶色透明钢化玻璃',
    hardware: '重型静音阻尼滑轨'
  },
  {
    id: 'proj-3',
    category: '五金与配件',
    name: '奥地利百隆 (Blum) 原装顶配阻尼五金系统',
    spec: '集成顶配快装阻尼缓冲铰链 48 只 + 豪华金属骑马抽屉 12 套 + 调味拉篮',
    qty: 1,
    unit: '套',
    estimatedPrice: 1850,
    hardware: '原装进口 Blum 终身质保'
  }
];

// 标准国内内销投影产品清单 (CNY)
export const DEFAULT_PROJECTION_ITEMS_DOMESTIC = [
  {
    id: 'proj-dom-1',
    category: '橱柜工程',
    name: '现代意式极简全屋定制橱柜 (含中岛台)',
    spec: '进口爱格板 W1000 + 45°斜切无拉手 + 纯白岩板台面 + 岛台指定 RAL 5004 海军蓝哑光烤漆',
    qty: 12.5,
    unit: '延米',
    estimatedPrice: 4800,
    color: 'RAL 5004 海军蓝 (中岛) + 暖白肤感 (主柜)',
    hardware: 'Blum 阻尼铰链 + 隐形触碰反弹器'
  },
  {
    id: 'proj-dom-2',
    category: '衣帽间工程',
    name: '主卧实木高定步入式衣帽间系统',
    spec: '多层实木高定柜体 + 铝合金窄边框茶色玻璃门 + 嵌入式 3000K 暖光感应灯带',
    qty: 24,
    unit: '㎡',
    estimatedPrice: 3200,
    color: '胡桃木纹多层实木 + 茶色透明钢化玻璃',
    hardware: '重型静音阻尼滑轨'
  },
  {
    id: 'proj-dom-3',
    category: '五金与配件',
    name: '奥地利百隆 (Blum) 原装顶配阻尼五金系统',
    spec: '集成顶配快装阻尼缓冲铰链 48 只 + 豪华金属骑马抽屉 12 套 + 调味拉篮',
    qty: 1,
    unit: '套',
    estimatedPrice: 13000,
    hardware: '原装进口 Blum 终身质保'
  },
  {
    id: 'proj-dom-4',
    category: '入户服务',
    name: '国内专车干线配送与入户安装调试交付',
    spec: '包含专车直达、搬楼入户、现场高精度安装调试与工程验收',
    qty: 1,
    unit: '项',
    estimatedPrice: 9800,
    hardware: '金牌安装团队'
  }
];

// 标准展开面积/拆板BOM精细核算清单项 (外贸出口 USD)
export const DEFAULT_DISASSEMBLY_ITEMS = [
  {
    id: 'dis-1',
    category: '柜体工程板件',
    name: '柜体主框架 (18mm多层实木 / PUR激光封边)',
    spec: '多层实木耐磨抗潮基材 + PUR无缝激光封边 + CNC预埋螺栓孔',
    qty: 76.8,
    unit: '㎡展开',
    estimatedPrice: 95,
    color: '北美黑胡桃木纹',
    hardware: '含隐形连接偏心件'
  },
  {
    id: 'dis-2',
    category: '柜体背板',
    name: '高强度防潮卡槽背板 (9mm多层实木)',
    spec: '9mm双面贴皮卡槽嵌入式固定 + 防变形加固受力筋',
    qty: 32.4,
    unit: '㎡展开',
    estimatedPrice: 55,
    color: '同色北美黑胡桃',
    hardware: '专用榫槽固定'
  },
  {
    id: 'dis-3',
    category: '门板与抽屉面',
    name: '极简免拉手门板 (进口爱格板 W1000 + 45°斜切)',
    spec: '进口爱格板 W1000 + 45°内切免拉手斜边 + PET零度超亚肤感',
    qty: 48.5,
    unit: '㎡展开',
    estimatedPrice: 145,
    color: 'RAL 5004 海军蓝 (中岛) + 暖白肤感',
    hardware: '免拉手暗槽'
  },
  {
    id: 'dis-4',
    category: '透光门板系统',
    name: '极窄边框茶色透明防爆钢化玻璃门板',
    spec: '20mm极窄太空灰阳极氧化铝合金边框 + 5mm深茶色防爆钢化玻璃',
    qty: 18.2,
    unit: '㎡展开',
    estimatedPrice: 190,
    color: '太空灰铝框 + 茶玻',
    hardware: '天地暗装阻尼铰链'
  },
  {
    id: 'dis-5',
    category: '台面工程',
    name: '纯白通体岩板操作台面与中岛台四面包边',
    spec: '12mm纯白通体超白岩板 + 45°海棠角无缝密拼防污倒角',
    qty: 9.5,
    unit: '㎡展开',
    estimatedPrice: 230,
    color: '雪山白哑光岩板',
    hardware: '台下盆一体打磨'
  },
  {
    id: 'dis-6',
    category: '五金配件BOM',
    name: '奥地利百隆 (Blum Clip Top) 快装阻尼缓冲铰链',
    spec: '原装进口 3D 快调阻尼铰链 110°大开角 + 纯黑一体装饰盖',
    qty: 68,
    unit: '只',
    estimatedPrice: 12.5,
    hardware: 'Blum 终身质保'
  },
  {
    id: 'dis-7',
    category: '五金配件BOM',
    name: '百隆豪华金属超薄乐卡骑马抽屉导轨套件',
    spec: '全拉出式阻尼静音重型金属抽底滑轨 (40kg承重)',
    qty: 14,
    unit: '套',
    estimatedPrice: 68,
    hardware: 'Blum Tandembox'
  },
  {
    id: 'dis-8',
    category: '智能电气灯光',
    name: '嵌入式 3000K 暖白低压柔性感应线条灯带',
    spec: '45°斜切隐形导光铝槽 + 人体手扫双控低压稳压电源',
    qty: 36,
    unit: '米',
    estimatedPrice: 18,
    color: '3000K 暖白光',
    hardware: '低压CE/UL安全认证电源'
  },
  {
    id: 'dis-9',
    category: '定制加工工时',
    name: '高精度数控CNC下料打孔与德国豪迈异形封边加工',
    spec: '数控六面钻零公差排孔 + 德国豪迈PUR防潮封边全套流水线工序',
    qty: 1,
    unit: '批',
    estimatedPrice: 1350,
    hardware: '豪迈流水线工费'
  }
];

// 标准展开面积/拆板BOM精细核算清单项 (国内内销 CNY)
export const DEFAULT_DISASSEMBLY_ITEMS_DOMESTIC = [
  {
    id: 'dis-dom-1',
    category: '柜体工程板件',
    name: '柜体主框架 (18mm多层实木 / PUR激光封边)',
    spec: '多层实木耐磨抗潮基材 + PUR无缝激光封边 + CNC预埋螺栓孔',
    qty: 76.8,
    unit: '㎡展开',
    estimatedPrice: 680,
    color: '北美黑胡桃木纹',
    hardware: '含隐形连接偏心件'
  },
  {
    id: 'dis-dom-2',
    category: '柜体背板',
    name: '高强度防潮卡槽背板 (9mm多层实木)',
    spec: '9mm双面贴皮卡槽嵌入式固定 + 防变形加固受力筋',
    qty: 32.4,
    unit: '㎡展开',
    estimatedPrice: 390,
    color: '同色北美黑胡桃',
    hardware: '专用榫槽固定'
  },
  {
    id: 'dis-dom-3',
    category: '门板与抽屉面',
    name: '极简免拉手门板 (进口爱格板 W1000 + 45°斜切)',
    spec: '进口爱格板 W1000 + 45°内切免拉手斜边 + PET零度超亚肤感',
    qty: 48.5,
    unit: '㎡展开',
    estimatedPrice: 1050,
    color: 'RAL 5004 海军蓝 + 暖白肤感',
    hardware: '免拉手暗槽'
  },
  {
    id: 'dis-dom-4',
    category: '透光门板系统',
    name: '极窄边框茶色透明防爆钢化玻璃门板',
    spec: '20mm极窄太空灰阳极氧化铝合金边框 + 5mm深茶色防爆钢化玻璃',
    qty: 18.2,
    unit: '㎡展开',
    estimatedPrice: 1360,
    color: '太空灰铝框 + 茶玻',
    hardware: '天地暗装阻尼铰链'
  },
  {
    id: 'dis-dom-5',
    category: '台面工程',
    name: '纯白通体岩板操作台面与中岛台四面包边',
    spec: '12mm纯白通体超白岩板 + 45°海棠角无缝密拼防污倒角',
    qty: 9.5,
    unit: '㎡展开',
    estimatedPrice: 1650,
    color: '雪山白哑光岩板',
    hardware: '台下盆一体打磨'
  },
  {
    id: 'dis-dom-6',
    category: '五金配件BOM',
    name: '奥地利百隆 (Blum Clip Top) 快装阻尼缓冲铰链',
    spec: '原装进口 3D 快调阻尼铰链 110°大开角 + 纯黑一体装饰盖',
    qty: 68,
    unit: '只',
    estimatedPrice: 88,
    hardware: '原装百隆质保'
  },
  {
    id: 'dis-dom-7',
    category: '抽屉滑轨系统',
    name: '百隆乐居豪华双层超薄金属骑马抽套装 (含静音阻尼)',
    spec: '500mm深 / 动态承重 40kg / 顺滑静音自闭',
    qty: 12,
    unit: '套',
    estimatedPrice: 420,
    hardware: '含快拆卡扣'
  },
  {
    id: 'dis-dom-8',
    category: '氛围与感应系统',
    name: '45°斜发光嵌入式双色温铝槽LED灯带 + 智能感应电源',
    spec: '预埋铝槽无可见光点 + 3000K-4000K微波感应驱动',
    qty: 36,
    unit: '米',
    estimatedPrice: 88,
    hardware: '含变压明纬电源'
  },
  {
    id: 'dis-dom-9',
    category: '国内包装与物流',
    name: '工厂高密蜂窝护角保护 + 防潮收缩膜',
    spec: '专车直送包装标准，加厚瓦楞纸箱护边',
    qty: 1,
    unit: '批',
    estimatedPrice: 3800,
    hardware: '工厂标准品控'
  },
  {
    id: 'dis-dom-10',
    category: '国内安装与调试',
    name: '工厂认证金牌安装师傅入户上门安装与精调',
    spec: '现场激光水平放线校准，收口条无缝微调，质检交付',
    qty: 1,
    unit: '项',
    estimatedPrice: 9500,
    hardware: 'PA认证工程师'
  }
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfirmed = data.status === 'confirmed';
  const calcMethod = data.calculationMethod || 'projection';
  const marketType = data.quoteMarketType || (data.currency === 'CNY' ? 'domestic' : 'overseas');
  const isDomestic = marketType === 'domestic' || data.currency === 'CNY';

  const displayItems = calcMethod === 'disassembly'
    ? (data.disassemblyItems && data.disassemblyItems.length > 0 ? data.disassemblyItems : (isDomestic ? DEFAULT_DISASSEMBLY_ITEMS_DOMESTIC : DEFAULT_DISASSEMBLY_ITEMS))
    : (data.productItems && data.productItems.length > 0 ? data.productItems : (isDomestic ? DEFAULT_PROJECTION_ITEMS_DOMESTIC : DEFAULT_PROJECTION_ITEMS_OVERSEAS));

  const handleConfirmClick = () => {
    if (isConfirmed || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(data.id, data);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div
      id={`quote-confirm-card-${data.id}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs my-2 text-left ${
        isConfirmed
          ? 'bg-slate-50/90 border-emerald-200 ring-1 ring-emerald-500/20'
          : 'bg-white border-slate-200 ring-1 ring-slate-900/5'
      }`}
    >
      {/* 头部标题与标识 */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          isConfirmed
            ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
            : 'bg-slate-50 border-slate-100 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              isConfirmed ? 'bg-emerald-600 text-white' : 'bg-[#EA3A20] text-white'
            }`}
          >
            {isConfirmed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-bold tracking-tight text-slate-900">
            {isConfirmed ? '报价需求已核准' : '报价需求核对'}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
              isConfirmed
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isConfirmed ? '已核准算价' : '待销售核对'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
              isDomestic
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {isDomestic ? '国内价格体系 (CNY)' : '国外价格体系 (USD)'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {calcMethod === 'disassembly' ? '拆板计价' : '投影计价'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3 text-xs text-slate-700">
        {/* 项目与客户信息 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
          <div>
            <span className="text-slate-400 block">客户名称</span>
            <span className="font-bold text-slate-800 truncate block mt-0.5">{data.customerName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">项目名称</span>
            <span className="font-bold text-slate-800 truncate block mt-0.5">{data.projectName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">交付条款</span>
            <span className="font-medium text-slate-800 truncate block mt-0.5">{data.tradeTerm}</span>
          </div>
          <div>
            <span className="text-slate-400 block">生产交期</span>
            <span className="font-medium text-slate-800 truncate block mt-0.5">{data.leadTime}</span>
          </div>
        </div>

        {/* 关联图纸（如有） */}
        {data.designDrawings && data.designDrawings.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap py-0.5">
            <span className="text-[11px] text-slate-400 font-medium shrink-0">关联图纸:</span>
            {data.designDrawings.map((dwg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onViewDrawing?.(dwg.name)}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-[11px] cursor-pointer transition-colors"
              >
                <FileText className="w-3 h-3 text-slate-400" />
                <span className="font-medium">{dwg.name}</span>
                {dwg.size && <span className="text-[10px] text-slate-400">({dwg.size})</span>}
              </button>
            ))}
          </div>
        )}

        {/* 结算条款与算价状态 */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-600">
            <span className="text-slate-400 mr-1.5">结算条款:</span>
            <span>{data.depositTerm}</span>
          </div>

          <div className="text-right shrink-0 text-[11px]">
            {isConfirmed ? (
              <span className="text-emerald-700 font-medium">✓ 报价已核算生成</span>
            ) : (
              <span className="text-slate-400 font-medium">价格将在核对确认后自动计算</span>
            )}
          </div>
        </div>

        {/* 操作区 */}
        <div className="pt-1 flex items-center justify-end">
          {isConfirmed ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>需求已确认 · 报价核算完成</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConfirmClick}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#EA3A20] hover:bg-[#d63219] shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>正在计算价格并生成报价单...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-3.5 h-3.5" />
                  <span>确认需求无误，开始计算报价</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. 报价单缺失必要字段信息卡片 (Missing Quote Fields Card)
// ==========================================
interface MissingQuoteFieldsCardProps {
  data: MissingQuoteFieldsData;
  onSupplement: (filledData: {
    method: QuotationCalculationMethod;
    marketType?: QuoteMarketType;
    category: string;
    dimensions: string;
    material: string;
    hardware: string;
    tradeTerm: string;
  }) => void;
  onSelectPreset: (method: QuotationCalculationMethod, marketType?: QuoteMarketType) => void;
}

export const MissingQuoteFieldsCard: React.FC<MissingQuoteFieldsCardProps> = ({
  data,
  onSupplement,
  onSelectPreset
}) => {
  const [selectedMarket, setSelectedMarket] = useState<QuoteMarketType>(
    data.detectedMarketType || 'overseas'
  );
  const [selectedMethod, setSelectedMethod] = useState<QuotationCalculationMethod>(
    data.detectedCalculationMethod || 'projection'
  );
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customCategory, setCustomCategory] = useState('意式高定极简橱柜与主卧步入式衣帽间');
  const [customDimensions, setCustomDimensions] = useState('主卧衣帽间24㎡投影 + 橱柜12.5延米 (含CAD图纸)');
  const [customMaterial, setCustomMaterial] = useState('进口爱格板 W1000 + 45°免拉手 + PET零度肤感面');
  const [customHardware, setCustomHardware] = useState('奥地利百隆 Blum 原装快装阻尼铰链与骑马抽屉');
  const [customTradeTerm, setCustomTradeTerm] = useState(
    data.detectedMarketType === 'domestic' ? '国内专车入户安装交付 (含13%增值税专用发票)' : 'CIF Los Angeles Port (USD)'
  );

  const handleSwitchFormMarket = (m: QuoteMarketType) => {
    setSelectedMarket(m);
    if (m === 'domestic') {
      setCustomTradeTerm('国内专车入户安装交付 (含13%增值税专用发票)');
    } else {
      setCustomTradeTerm('CIF Los Angeles Port (USD)');
    }
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onSupplement({
      method: selectedMethod,
      marketType: selectedMarket,
      category: customCategory,
      dimensions: customDimensions,
      material: customMaterial,
      hardware: customHardware,
      tradeTerm: customTradeTerm
    });
  };

  return (
    <div
      id={`missing-quote-fields-${data.id}`}
      className="rounded-2xl border border-amber-300/80 bg-white overflow-hidden shadow-sm my-2 text-left ring-1 ring-amber-500/20 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 px-4 py-3 border-b border-amber-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-950">
                报价单生成提示：尚缺少必要字段信息
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                需补充 {data.missingFields.length} 项关键参数
              </span>
              {data.isMarketTypeAutoDetected ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>市场类型已识别: {data.detectedMarketType === 'domestic' ? '国内内销' : '国外出口'}</span>
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  需确认: 国内价格 vs 国外价格
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              定制家居报价需明确<strong>价格体系 (国内/国外)</strong>、<strong>计价规则 (投影/拆板)</strong>及工艺参数，请从下方快速选定或补充：
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Missing Fields Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>AI 检测到当前会话还缺少以下信息：</span>
            </div>
            {data.detectedMarketReason && (
              <span className="text-[10px] text-slate-400">
                💡 {data.detectedMarketReason}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.missingFields.map((field, idx) => (
              <div
                key={field.key}
                className="p-2.5 rounded-xl border border-amber-200/70 bg-amber-50/40 flex items-start gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-amber-200/80 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 text-[11px]">{field.label}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-red-100 text-red-700">
                      必选
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-snug">{field.description}</p>
                  <p className="text-[9px] text-slate-400 truncate">
                    示例: {field.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Presets: 国外 vs 国内 + 投影 vs 拆板方案 */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-[#EA3A20]" />
              <span>推荐标准化补充方案（一键选择直接生成对应报价卡片）：</span>
            </span>
            <span className="text-[10px] text-slate-400">支持国外出口(USD) 与 国内内销(CNY)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Preset 1: 国外出口 · 按投影方式 */}
            <div className="p-3 rounded-2xl border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-b from-blue-50/50 to-white transition-all space-y-2.5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>方案 A：🌍 国外出口 · 按「投影」计价</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">
                    USD 结算
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  按照柜体正面投影面积核算（24㎡衣帽间+12.5延米中岛橱柜），CIF 洛杉矶港，进口爱格板与百隆五金。
                </p>
                <div className="bg-white/80 p-2 rounded-xl text-[10px] text-slate-500 space-y-1 border border-blue-100">
                  <div>• 价格体系: <strong>国外外贸价格 (USD 美元 / CIF到港)</strong></div>
                  <div>• 计价模式: <strong>按投影计价 (正面宽×高)</strong></div>
                  <div>• 包装交付: ISTA 3A 蜂窝板木架防损包装</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPreset('projection', 'overseas')}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>选用「国外出口 · 投影计价」生成</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preset 2: 国外出口 · 按拆板精算 */}
            <div className="p-3 rounded-2xl border-2 border-teal-200 hover:border-teal-400 bg-gradient-to-b from-teal-50/50 to-white transition-all space-y-2.5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                    <Box className="w-4 h-4 text-teal-600" />
                    <span>方案 B：🌍 国外出口 · 按「拆板」精算</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-700">
                    外贸BOM精算
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  按板材平铺展开面积与五金BOM拆单精算（76.8㎡柜体+48.5㎡门板），FOB 深圳港，18mm多层实木+茶玻门。
                </p>
                <div className="bg-white/80 p-2 rounded-xl text-[10px] text-slate-500 space-y-1 border border-teal-100">
                  <div>• 价格体系: <strong>国外外贸价格 (USD 美元 / FOB离岸)</strong></div>
                  <div>• 计价模式: <strong>按拆板展开面积 + 五金BOM明细</strong></div>
                  <div>• 质检交付: 1:1 试装视频质检 + ISPM15 包装</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPreset('disassembly', 'overseas')}
                className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>选用「国外出口 · 拆板精算」生成</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preset 3: 国内内销 · 按投影送装 */}
            <div className="p-3 rounded-2xl border-2 border-rose-200 hover:border-rose-400 bg-gradient-to-b from-rose-50/50 to-white transition-all space-y-2.5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <span className="text-sm">🇨🇳</span>
                    <span>方案 C：国内内销 · 按「投影」送装</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700">
                    RMB 含税
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  按正面投影面积计算（24㎡衣帽间+12.5延米橱柜），包含 13% 专票、专车直达干线物流与金牌师傅上门安装。
                </p>
                <div className="bg-white/80 p-2 rounded-xl text-[10px] text-slate-500 space-y-1 border border-rose-100">
                  <div>• 价格体系: <strong>国内价格体系 (CNY 人民币 / 含税送装)</strong></div>
                  <div>• 计价模式: <strong>按投影计价 (正面宽×高)</strong></div>
                  <div>• 增值服务: 包含搬楼入户与上门精调安装交付</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPreset('projection', 'domestic')}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>选用「国内内销 · 投影送装」生成</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preset 4: 国内内销 · 按拆板精算 */}
            <div className="p-3 rounded-2xl border-2 border-amber-200 hover:border-amber-400 bg-gradient-to-b from-amber-50/50 to-white transition-all space-y-2.5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="text-sm">🇨🇳</span>
                    <span>方案 D：国内内销 · 按「拆板」精算</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                    内销BOM精调
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  针对国内异形大宅，按板件展开面积与五金BOM逐项精细拆单，包含专票与全案驻场技术对接。
                </p>
                <div className="bg-white/80 p-2 rounded-xl text-[10px] text-slate-500 space-y-1 border border-amber-100">
                  <div>• 价格体系: <strong>国内价格体系 (CNY 人民币 / 展开BOM)</strong></div>
                  <div>• 计价模式: <strong>按拆板展开面积 + 五金BOM明细</strong></div>
                  <div>• 质保服务: 工厂金牌认证 5 年质保 + 终身维护</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPreset('disassembly', 'domestic')}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>选用「国内内销 · 拆板精算」生成</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Input Drawer / Form */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-xs font-semibold text-slate-600 hover:text-[#EA3A20] flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{showCustomForm ? '收起自定义补充表单' : '✍️ 或手动自定义录入缺失字段信息'}</span>
              {showCustomForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showCustomForm && (
            <form onSubmit={handleSubmitCustom} className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              {/* 关键 1：市场体系选择 */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  1. 选择报价所属市场价格体系 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchFormMarket('overseas')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedMarket === 'overseas'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>🌍 国外出口价格体系 (USD 美元)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchFormMarket('domestic')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedMarket === 'domestic'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>🇨🇳</span>
                    <span>国内内销价格体系 (CNY 人民币)</span>
                  </button>
                </div>
              </div>

              {/* 关键 2：计价方式切换 */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  2. 选择计价计算方式 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('projection')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedMethod === 'projection'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>📐 按照“投影”方式计价</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('disassembly')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedMethod === 'disassembly'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>🧩 按照“拆板”方式计价</span>
                  </button>
                </div>
              </div>

              {/* 品类空间 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    3. 定制品类与空间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="如: 极简橱柜+主卧步入式衣帽间"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    4. 工程尺寸/面积/图纸 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customDimensions}
                    onChange={(e) => setCustomDimensions(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="如: 投影24㎡或76.8㎡展开"
                  />
                </div>
              </div>

              {/* 材质与五金 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    5. 板材材质与表面工艺 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customMaterial}
                    onChange={(e) => setCustomMaterial(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="如: 爱格W1000 / 多层实木 / PET肤感"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    6. 五金品牌配置要求
                  </label>
                  <input
                    type="text"
                    value={customHardware}
                    onChange={(e) => setCustomHardware(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    placeholder="如: 奥地利百隆Blum阻尼铰链与导轨"
                  />
                </div>
              </div>

              {/* 贸易条款 */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  7. 交付贸易条款与结算币种
                </label>
                <input
                  type="text"
                  value={customTradeTerm}
                  onChange={(e) => setCustomTradeTerm(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  placeholder={selectedMarket === 'domestic' ? '国内送装交付 (含13%增值税)' : 'CIF Los Angeles Port (USD) 或 FOB 深圳'}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA3A20] to-[#c42810] hover:from-[#c42810] hover:to-[#9e1c08] text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>提交补充信息，生成「{selectedMarket === 'domestic' ? '国内价格' : '国外价格'}」核对卡</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. AI 已生成的正式报价单 / 形式发票 (PI) 卡片
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

  const isDomestic = data.quoteMarketType === 'domestic' || data.currency === 'CNY';
  const currSymbol = isDomestic ? '¥' : '$';

  const handleCopy = () => {
    const textToCopy = isDomestic
      ? `【国内定制销售报价单 ${data.quoteNo}】\n\n${data.salesPitchZh}`
      : `【Proforma Invoice ${data.quoteNo}】\n\n${data.salesPitchEn}\n\n---\n${data.salesPitchZh}`;
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
      <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b text-white ${
        isDomestic
          ? 'bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border-rose-900/50'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-900/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA3A20] to-orange-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold tracking-tight">
                {isDomestic ? '国内定制销售报价单 · DOMESTIC SALES QUOTATION' : '外贸商业形式发票 · PROFORMA INVOICE'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                {data.quoteNo}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                isDomestic ? 'bg-rose-500/20 text-rose-200 border-rose-400/30' : 'bg-blue-500/20 text-blue-200 border-blue-400/30'
              }`}>
                {isDomestic ? '🇨🇳 国内内销价格体系 (CNY)' : '🌍 国外出口价格体系 (USD)'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1">
                {data.calculationMethod === 'disassembly' ? (
                  <>
                    <Box className="w-3 h-3 text-amber-300" />
                    <span>计价: 按拆板精算</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3 h-3 text-amber-300" />
                    <span>计价: 按投影面积</span>
                  </>
                )}
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
          <span>对客商务报价函 & 话术</span>
        </button>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {activeTab === 'items' ? (
          <>
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-red-50/60 rounded-xl border border-red-100">
                <span className="text-[10px] text-slate-500 block font-medium">
                  报价总金额 ({isDomestic ? '含13%专票' : (data.tradeTerm?.slice(0, 3) || 'CIF')})
                </span>
                <span className="text-base font-black font-mono text-[#EA3A20]">
                  {currSymbol}{data.totalAmount.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block font-mono">{data.currency}</span>
              </div>
              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-500 block font-medium">首期定金 ({data.depositPercent}%)</span>
                <span className="text-base font-bold font-mono text-amber-900">
                  {currSymbol}{data.depositAmount.toLocaleString()}
                </span>
                <span className="text-[9px] text-amber-700 block">用于锁定板材排产</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block font-medium">尾款 ({100 - data.depositPercent}%)</span>
                <span className="text-base font-bold font-mono text-slate-800">
                  {currSymbol}{data.balanceAmount.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block">
                  {isDomestic ? '现场安装验收完毕后' : '见提单副本或装柜前'}
                </span>
              </div>
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-500 block font-medium">
                  {isDomestic ? '运输与交付' : '预估体积 & 装柜'}
                </span>
                <span className="text-sm font-bold text-blue-900 truncate block mt-0.5">
                  {data.cbmEstimate ? `${data.cbmEstimate} CBM` : (isDomestic ? '专车直达' : '42.5 CBM')}
                </span>
                <span className="text-[9px] text-blue-700 block truncate">{data.containerLoading}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-bold">
                  {data.calculationMethod === 'disassembly'
                    ? `板件展开BOM与五金明细清单 (${isDomestic ? '国内价格' : '国外价格'})`
                    : `按投影面积核算产品清单 (${isDomestic ? '国内价格' : '国外价格'})`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {data.calculationMethod === 'disassembly' ? '计价单位: ㎡展开 / 只 / 套 / 米' : '计价单位: ㎡投影 / 延米 / 套'}
                </span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2">定制项目 / 材质工艺</th>
                    <th className="px-3 py-2 text-center w-24">数量</th>
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
                        {currSymbol}{item.price.toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                        {currSymbol}{item.subtotal.toLocaleString()}
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
            {!isDomestic && (
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
            )}

            <div className="p-3 bg-slate-50 text-slate-700 rounded-xl space-y-2 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-[11px] font-bold text-slate-900 block">
                  💡 {isDomestic ? '国内客户商务报价函与成单策略' : '中文对客策略解析'}
                </span>
                {isDomestic && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium transition-colors cursor-pointer border border-rose-200"
                  >
                    {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPitch ? '已复制' : '复制报价单信息'}</span>
                  </button>
                )}
              </div>
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
              <span>下载 PDF {isDomestic ? '销售报价单' : '形式发票'}</span>
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
              <span>{copiedPitch ? '话术已复制' : (isDomestic ? '复制国内报价话术' : '复制英文报价话术')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

