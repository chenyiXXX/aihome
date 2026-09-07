import React, { useState, useMemo } from 'react';
import {
  Calculator,
  FileSpreadsheet,
  Search,
  Download,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Info,
  Layers,
  DollarSign,
  RefreshCw,
  Clock,
  Eye,
  ExternalLink,
  Boxes,
  Sparkles,
  ArrowUpRight,
  X,
  FileText
} from 'lucide-react';
import { BOQPriceItem, BOQPricingRule, BOQLineItem } from '../../types';
import { initialBOQPriceItems, initialBOQPricingRules } from '../../data/mockData';
import { ExchangeRateSubModule } from './ExchangeRateSubModule';

interface PricingMaintenanceModuleProps {
  subView?: string;
  onSelectSubView?: (subView: string) => void;
}

export const PricingMaintenanceModule: React.FC<PricingMaintenanceModuleProps> = ({
  subView = '面价设置',
  onSelectSubView
}) => {
  // Current active subview tab (面价设置 | 算价规则配置 | BOQ报价试算)
  const normalizedSubView = (subView === 'BOQ单价库' || subView === '单价库' || subView === '面价设置') ? '面价设置' : subView;
  const [currentSubView, setCurrentSubView] = useState<string>(normalizedSubView || '面价设置');

  // Keep in sync with prop if changed externally
  React.useEffect(() => {
    if (subView) {
      setCurrentSubView((subView === 'BOQ单价库' || subView === '单价库' || subView === '面价设置') ? '面价设置' : subView);
    }
  }, [subView]);

  const handleTabChange = (view: string) => {
    setCurrentSubView(view);
    if (onSelectSubView) {
      onSelectSubView(view);
    }
  };

  // State: Price Items
  const [priceItems, setPriceItems] = useState<BOQPriceItem[]>(initialBOQPriceItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [unitFilter, setUnitFilter] = useState<string>('全部');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'CNY'>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(7.20);

  // Document Source Configuration (指定数据源文档信息)
  const documentSourceInfo = {
    docName: '《品爱全屋定制外贸产品标准单价及BOQ定额库.xlsx》',
    docUrl: 'https://docs.company.internal/pricing/boq_standard_prices_2026.xlsx',
    sheetName: '外贸标准定制单价定额表',
    sourceDept: '外贸供应链与定制研发中心 / 成本核算科',
    syncStrategy: '自动定时拉取 • 每小时刷新 • 本系统只读映射'
  };

  // State: Latest Update Time of Data
  const [docLastUpdatedTime, setDocLastUpdatedTime] = useState<string>('2026-09-03 16:30:15');
  const [isSyncingDoc, setIsSyncingDoc] = useState<boolean>(false);
  const [isDocConfigModalOpen, setIsDocConfigModalOpen] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<BOQPriceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State: Calculation Rules
  const [pricingRules, setPricingRules] = useState<BOQPricingRule[]>(initialBOQPricingRules);

  // State: Calculator Simulator
  const [calcModel, setCalcModel] = useState<'wardrobe' | 'kitchen' | 'foyer' | 'custom'>('wardrobe');
  const [widthMm, setWidthMm] = useState<number>(3200);
  const [heightMm, setHeightMm] = useState<number>(2600);
  const [depthMm, setDepthMm] = useState<number>(600);
  const [cabinetQty, setCabinetQty] = useState<number>(1);
  const [selectedCarcaseId, setSelectedCarcaseId] = useState<string>('BOQ-CAB-001');
  const [selectedDoorId, setSelectedDoorId] = useState<string>('BOQ-DOOR-001');
  const [selectedTopId, setSelectedTopId] = useState<string>('none');
  const [hasLedStrip, setHasLedStrip] = useState<boolean>(true);
  const [drawerCount, setDrawerCount] = useState<number>(4);
  const [packingTypeId, setPackingTypeId] = useState<string>('BOQ-PACK-001');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Filter price items
  const filteredItems = useMemo(() => {
    return priceItems.filter((item) => {
      if (selectedCategory !== '全部' && item.category !== selectedCategory) {
        return false;
      }
      if (unitFilter !== '全部' && item.unit !== unitFilter) {
        return false;
      }
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchSpec = item.spec.toLowerCase().includes(q);
        const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchCode && !matchSpec && !matchTag) return false;
      }
      return true;
    });
  }, [priceItems, selectedCategory, unitFilter, searchKeyword]);

  // Re-read / Sync Price Items directly from Designated Document
  const handleSyncFromDoc = () => {
    setIsSyncingDoc(true);
    setTimeout(() => {
      setIsSyncingDoc(false);
      const now = new Date();
      const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setDocLastUpdatedTime(nowStr);

      // Refresh items updated timestamp to match document read time
      setPriceItems((prev) =>
        prev.map((item) => ({
          ...item,
          updatedAt: nowStr
        }))
      );

      showToast(`已成功从指定文档《${documentSourceInfo.docName}》读取最新 ${priceItems.length} 条单价定额数据！`);
    }, 850);
  };

  // Toggle Rule Status
  const handleToggleRule = (ruleId: string) => {
    setPricingRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  // Preset scene models in calculator
  const handleSelectModel = (type: 'wardrobe' | 'kitchen' | 'foyer' | 'custom') => {
    setCalcModel(type);
    if (type === 'wardrobe') {
      setWidthMm(3200);
      setHeightMm(2600);
      setDepthMm(600);
      setSelectedCarcaseId('BOQ-CAB-001');
      setSelectedDoorId('BOQ-DOOR-001');
      setSelectedTopId('none');
      setHasLedStrip(true);
      setDrawerCount(4);
    } else if (type === 'kitchen') {
      setWidthMm(4200);
      setHeightMm(850);
      setDepthMm(600);
      setSelectedCarcaseId('BOQ-CAB-002');
      setSelectedDoorId('BOQ-DOOR-002');
      setSelectedTopId('BOQ-TOP-001');
      setHasLedStrip(false);
      setDrawerCount(3);
    } else if (type === 'foyer') {
      setWidthMm(1800);
      setHeightMm(2400);
      setDepthMm(380);
      setSelectedCarcaseId('BOQ-CAB-001');
      setSelectedDoorId('BOQ-DOOR-003');
      setSelectedTopId('none');
      setHasLedStrip(true);
      setDrawerCount(2);
    }
  };

  // Real-time BOQ Detailed Lines Calculation
  const boqCalculation = useMemo(() => {
    // 1. Dimensions
    const widthM = widthMm / 1000;
    const heightM = heightMm / 1000;
    const projectionArea = +(widthM * heightM).toFixed(2); // 投影面积 ㎡

    // Carcase expansion ratio from rules (default 3.65)
    const expansionRule = pricingRules.find((r) => r.id === 'RULE-001');
    const expansionFactor = expansionRule?.isEnabled ? Number(expansionRule.factor) : 3.65;
    const carcaseExpandedArea = +(projectionArea * expansionFactor).toFixed(2); // 展开面积 ㎡

    // Lines array
    const lines: BOQLineItem[] = [];
    let itemIndex = 1;

    // Line 1: 柜体板材
    const carcaseItem = priceItems.find((i) => i.id === selectedCarcaseId) || priceItems[0];
    if (carcaseItem) {
      const qty = +(carcaseExpandedArea * cabinetQty).toFixed(2);
      const subtotal = +(qty * carcaseItem.basePriceUSD * (1 + carcaseItem.wasteRatePercent / 100)).toFixed(2);
      lines.push({
        id: 'LINE-1',
        itemNo: itemIndex++,
        partName: carcaseItem.name,
        category: carcaseItem.category,
        spec: carcaseItem.spec,
        calcLogic: `展开面积 ${carcaseExpandedArea}㎡ × 柜数 ${cabinetQty}套`,
        quantity: qty,
        unit: carcaseItem.unit,
        unitPriceUSD: carcaseItem.basePriceUSD,
        amountUSD: +(qty * carcaseItem.basePriceUSD).toFixed(2),
        wastePercent: carcaseItem.wasteRatePercent,
        totalUSD: subtotal
      });
    }

    // Line 2: 门板选型
    const doorItem = priceItems.find((i) => i.id === selectedDoorId) || priceItems[3];
    if (doorItem) {
      // Check high door factor (>2400mm)
      const highDoorRule = pricingRules.find((r) => r.id === 'RULE-003');
      const isHighDoor = heightMm > 2400 && highDoorRule?.isEnabled;
      const highDoorMarkup = isHighDoor ? Number(highDoorRule?.factor || 15) : 0;

      const doorArea = +(projectionArea * cabinetQty).toFixed(2);
      const effectiveUnitPrice = +(doorItem.basePriceUSD * (1 + highDoorMarkup / 100)).toFixed(2);
      const subtotal = +(doorArea * effectiveUnitPrice * (1 + doorItem.wasteRatePercent / 100)).toFixed(2);

      lines.push({
        id: 'LINE-2',
        itemNo: itemIndex++,
        partName: `${doorItem.name}${isHighDoor ? ' (超高非标加价 +15%)' : ''}`,
        category: doorItem.category,
        spec: doorItem.spec,
        calcLogic: `立面投影面积 ${projectionArea}㎡ × ${cabinetQty}套`,
        quantity: doorArea,
        unit: doorItem.unit,
        unitPriceUSD: effectiveUnitPrice,
        amountUSD: +(doorArea * effectiveUnitPrice).toFixed(2),
        wastePercent: doorItem.wasteRatePercent,
        totalUSD: subtotal
      });
    }

    // Line 3: 台面石材 (if selected)
    if (selectedTopId !== 'none') {
      const topItem = priceItems.find((i) => i.id === selectedTopId);
      if (topItem) {
        const topLengthM = +(widthM * cabinetQty).toFixed(2);
        const subtotal = +(topLengthM * topItem.basePriceUSD * (1 + topItem.wasteRatePercent / 100)).toFixed(2);
        lines.push({
          id: 'LINE-3',
          itemNo: itemIndex++,
          partName: topItem.name,
          category: topItem.category,
          spec: topItem.spec,
          calcLogic: `按台面总延米计取 (${widthM}m × ${cabinetQty}套)`,
          quantity: topLengthM,
          unit: topItem.unit,
          unitPriceUSD: topItem.basePriceUSD,
          amountUSD: +(topLengthM * topItem.basePriceUSD).toFixed(2),
          wastePercent: topItem.wasteRatePercent,
          totalUSD: subtotal
        });
      }
    }

    // Line 4: 铰链配比 (基础五金)
    const hingeItem = priceItems.find((i) => i.code === 'HARD-BLUM-CLIP');
    if (hingeItem) {
      // Average 1 door leaf every 450mm width
      const doorsCount = Math.max(2, Math.round(widthMm / 450));
      // Hinges per door: if height > 2400mm -> 5 hinges, else 3-4 hinges
      const hingesPerDoor = heightMm > 2400 ? 5 : heightMm > 1800 ? 4 : 3;
      const totalHinges = doorsCount * hingesPerDoor * cabinetQty;
      const subtotal = +(totalHinges * hingeItem.basePriceUSD * (1 + hingeItem.wasteRatePercent / 100)).toFixed(2);

      lines.push({
        id: 'LINE-4',
        itemNo: itemIndex++,
        partName: hingeItem.name,
        category: hingeItem.category,
        spec: hingeItem.spec,
        calcLogic: `${doorsCount}扇门 × ${hingesPerDoor}只/门 × ${cabinetQty}套`,
        quantity: totalHinges,
        unit: hingeItem.unit,
        unitPriceUSD: hingeItem.basePriceUSD,
        amountUSD: +(totalHinges * hingeItem.basePriceUSD).toFixed(2),
        wastePercent: hingeItem.wasteRatePercent,
        totalUSD: subtotal
      });
    }

    // Line 5: 抽屉与滑轨 (功能配件)
    if (drawerCount > 0) {
      const tandemItem = priceItems.find((i) => i.code === 'HARD-BLUM-TANDEM');
      if (tandemItem) {
        const totalDrawers = drawerCount * cabinetQty;
        const subtotal = +(totalDrawers * tandemItem.basePriceUSD * (1 + tandemItem.wasteRatePercent / 100)).toFixed(2);
        lines.push({
          id: 'LINE-5',
          itemNo: itemIndex++,
          partName: tandemItem.name,
          category: tandemItem.category,
          spec: tandemItem.spec,
          calcLogic: `标配内抽 ${drawerCount}组 × ${cabinetQty}套`,
          quantity: totalDrawers,
          unit: tandemItem.unit,
          unitPriceUSD: tandemItem.basePriceUSD,
          amountUSD: +(totalDrawers * tandemItem.basePriceUSD).toFixed(2),
          wastePercent: tandemItem.wasteRatePercent,
          totalUSD: subtotal
        });
      }
    }

    // Line 6: 嵌入式灯带
    if (hasLedStrip) {
      const ledItem = priceItems.find((i) => i.code === 'HARD-LED-STRIP');
      if (ledItem) {
        // Vertical ambient LED strips along height
        const ledLengthM = +((heightM * 2 + widthM) * cabinetQty).toFixed(2);
        const subtotal = +(ledLengthM * ledItem.basePriceUSD * (1 + ledItem.wasteRatePercent / 100)).toFixed(2);
        lines.push({
          id: 'LINE-6',
          itemNo: itemIndex++,
          partName: ledItem.name,
          category: ledItem.category,
          spec: ledItem.spec,
          calcLogic: `双侧竖向+顶层横向布灯延米 (${ledLengthM}m)`,
          quantity: ledLengthM,
          unit: ledItem.unit,
          unitPriceUSD: ledItem.basePriceUSD,
          amountUSD: +(ledLengthM * ledItem.basePriceUSD).toFixed(2),
          wastePercent: ledItem.wasteRatePercent,
          totalUSD: subtotal
        });
      }
    }

    // Line 7: 出口包装与木架
    const packItem = priceItems.find((i) => i.id === packingTypeId);
    if (packItem) {
      const packQty = cabinetQty;
      const subtotal = +(packQty * packItem.basePriceUSD).toFixed(2);
      lines.push({
        id: 'LINE-7',
        itemNo: itemIndex++,
        partName: packItem.name,
        category: packItem.category,
        spec: packItem.spec,
        calcLogic: `整套出海免熏蒸防震包装 (${packQty}套)`,
        quantity: packQty,
        unit: packItem.unit,
        unitPriceUSD: packItem.basePriceUSD,
        amountUSD: +(packQty * packItem.basePriceUSD).toFixed(2),
        wastePercent: 0,
        totalUSD: subtotal
      });
    }

    // Line 8: 工厂预组装及品质检验
    const laborItem = priceItems.find((i) => i.code === 'LABOR-FACTORY-PREASS');
    if (laborItem) {
      const laborQty = cabinetQty;
      const subtotal = +(laborQty * laborItem.basePriceUSD).toFixed(2);
      lines.push({
        id: 'LINE-8',
        itemNo: itemIndex++,
        partName: laborItem.name,
        category: laborItem.category,
        spec: laborItem.spec,
        calcLogic: `出厂前100%试拼装调平与质检工时 (${laborQty}套)`,
        quantity: laborQty,
        unit: laborItem.unit,
        unitPriceUSD: laborItem.basePriceUSD,
        amountUSD: +(laborQty * laborItem.basePriceUSD).toFixed(2),
        wastePercent: 0,
        totalUSD: subtotal
      });
    }

    // Grand totals
    const grandTotalUSD = +lines.reduce((acc, curr) => acc + curr.totalUSD, 0).toFixed(2);
    const grandTotalRMB = +(grandTotalUSD * exchangeRate).toFixed(2);

    return {
      projectionArea,
      carcaseExpandedArea,
      lines,
      grandTotalUSD,
      grandTotalRMB
    };
  }, [
    widthMm,
    heightMm,
    depthMm,
    cabinetQty,
    selectedCarcaseId,
    selectedDoorId,
    selectedTopId,
    hasLedStrip,
    drawerCount,
    packingTypeId,
    priceItems,
    pricingRules,
    exchangeRate
  ]);

  // Copy BOQ to clipboard
  const handleCopyBOQ = () => {
    const textHeader = `【HomeCraft BOQ 出口报价清单 - 明细核算表】\n` +
      `规格尺寸: W ${widthMm}mm × H ${heightMm}mm × D ${depthMm}mm (数量: ${cabinetQty}套)\n` +
      `投影面积: ${boqCalculation.projectionArea} ㎡ | 柜体展开: ${boqCalculation.carcaseExpandedArea} ㎡\n` +
      `------------------------------------------------------------------------\n` +
      `序号 | 部件名称 | 规格材质 | 计价工程量 | 出口单价(USD) | 明细小计(USD)\n`;

    const textBody = boqCalculation.lines
      .map(
        (l) =>
          `${l.itemNo}. ${l.partName} | ${l.spec} | ${l.quantity} ${l.unit} | $${l.unitPriceUSD} | $${l.totalUSD}`
      )
      .join('\n');

    const textFooter = `\n------------------------------------------------------------------------\n` +
      `BOQ 预估出口总价: $${boqCalculation.grandTotalUSD.toLocaleString()} USD (折合 ¥${boqCalculation.grandTotalRMB.toLocaleString()} RMB, 汇率 ${exchangeRate})\n` +
      `注: 报价已含出厂质检试装、标准海运防震免熏蒸包装及板材裁切损耗。`;

    navigator.clipboard.writeText(`${textHeader}${textBody}${textFooter}`);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  // If subView is 汇率管理, render ExchangeRateSubModule
  if (currentSubView === '汇率管理') {
    return (
      <ExchangeRateSubModule
        currentBaseRate={exchangeRate}
        onUpdateBaseRate={(newRate) => {
          setExchangeRate(newRate);
          // Recalculate priceItems basePriceRMB if needed
          setPriceItems((prev) =>
            prev.map((item) => ({
              ...item,
              basePriceRMB: +(item.basePriceUSD * newRate).toFixed(2)
            }))
          );
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between py-3 shrink-0">
        
        {/* Left: Module Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold shadow-xs">
            <Calculator className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">产品价格维护</h1>
            <p className="text-[11px] text-slate-400 font-medium">维护外贸定制产品单价、损耗与计算公式，为报价单BOQ工程量清单提供实时精确价格</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {(currentSubView === '面价设置' || currentSubView === '单价库' || currentSubView === 'BOQ单价库') ? (
            <>
              <button
                type="button"
                onClick={() => setIsDocConfigModalOpen(true)}
                className="h-9 px-4 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="查看外部指定单价文档数据源配置"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>源文档配置</span>
              </button>

              <button
                type="button"
                onClick={handleSyncFromDoc}
                disabled={isSyncingDoc}
                className="h-9 px-4.5 rounded-full bg-[#EA3A20] text-white hover:bg-[#d6341c] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                title="从指定文档重新读取最新单价定额"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDoc ? 'animate-spin' : ''}`} />
                <span>{isSyncingDoc ? '正在读取...' : '从指定文档重新读取'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {currentSubView === 'BOQ报价试算' && (
                <button
                  type="button"
                  onClick={handleCopyBOQ}
                  className="h-9 px-4.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  {copiedSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSuccess ? '已复制BOQ清单' : '一键复制BOQ清单'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleTabChange('面价设置')}
                className="h-9 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>← 返回面价设置</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================= TAB 1: 面价设置 ======================= */}
      {(currentSubView === '面价设置' || currentSubView === '单价库' || currentSubView === 'BOQ单价库') && (
        <div className="flex-1 flex flex-col min-h-0 space-y-3.5">

          {/* Document Source Banner & Latest Update Time */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 border border-emerald-200/60">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{documentSourceInfo.docName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                    工作表: {documentSourceInfo.sheetName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>指定文档直读模式 (只读)</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span>数据源：<span className="text-slate-700 font-medium">{documentSourceInfo.sourceDept}</span></span>
                  <span>•</span>
                  <span>当前已加载：<strong className="text-slate-800">{priceItems.length}</strong> 条标准单价定额</span>
                  <span>•</span>
                  <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                    单价数据由源文档统一维护，系统只读解析，保障外贸报价基准绝对统一
                  </span>
                </div>
              </div>
            </div>

            {/* Latest Update Time Card */}
            <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
              <div className="bg-red-50/70 border border-red-100/90 rounded-xl px-4 py-2 flex items-center gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#EA3A20] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>数据最新更新时间</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-sm font-mono font-extrabold text-[#EA3A20] tracking-tight mt-0.5">
                    {docLastUpdatedTime}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncFromDoc}
                disabled={isSyncingDoc}
                className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="立即从指定文档重新读取最新单价"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDoc ? 'animate-spin' : ''}`} />
                <span>重新读取</span>
              </button>
            </div>
          </div>
          
          {/* Top Filter & Search Controls */}
          <div className="flex items-center justify-between gap-4 shrink-0 bg-white p-3 rounded-2xl border border-slate-100/90 shadow-2xs">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              {['全部', '柜体板材', '定制门板', '台面石材', '基础五金', '功能配件', '出口包装', '人工安装'].map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Right Search & Unit Filter */}
            <div className="flex items-center gap-2.5 shrink-0">
              
              {/* Unit Dropdown */}
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="h-8 px-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
              >
                <option value="全部">全部单位</option>
                <option value="展开㎡">展开㎡</option>
                <option value="投影㎡">投影㎡</option>
                <option value="延米">延米</option>
                <option value="个">个</option>
                <option value="套">套</option>
                <option value="米">米</option>
              </select>

              {/* Currency Display Mode */}
              <div className="bg-slate-100 p-0.5 rounded-xl flex items-center gap-0.5 text-xs font-bold">
                <button
                  onClick={() => setCurrencyMode('USD')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    currencyMode === 'USD' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrencyMode('CNY')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    currencyMode === 'CNY' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  RMB (¥)
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="搜索部件名称/编号/材质..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] focus:bg-white transition-all"
                />
              </div>

              {/* Export Button */}
              <button
                onClick={() => alert('已生成并导出最新BOQ单价Excel表格')}
                className="h-8 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="导出单价表"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>导出定额</span>
              </button>
            </div>
          </div>

          {/* Unit Price Table */}
          <div className="flex-1 bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden flex flex-col">
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10">
                  <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold">
                    <th className="py-3.5 pl-6 pr-3 w-12 text-center">
                      <input type="checkbox" className="rounded-md border-slate-300 w-4 h-4 cursor-pointer" />
                    </th>
                    <th className="py-3.5 px-3 font-bold text-slate-900">部件编码</th>
                    <th className="py-3.5 px-3 font-bold text-slate-900">部件名称</th>
                    <th className="py-3.5 px-3 font-bold text-slate-900">类别</th>
                    <th className="py-3.5 px-3 font-bold text-slate-900">规格/环保标准</th>
                    <th className="py-3.5 px-3 font-bold text-slate-900 text-center">单位</th>
                    <th className="py-3.5 px-3 font-bold text-slate-900 text-right">
                      {currencyMode === 'USD' ? '外贸基准价 (USD)' : '折算基准价 (RMB)'}
                    </th>
                    <th className="py-3.5 px-3 font-bold text-slate-900 text-center">损耗率</th>
                    <th className="py-3.5 px-3 font-bold text-slate-900">BOQ核算逻辑与公式</th>
                    <th className="py-3.5 px-3 font-bold text-slate-900 text-center">状态</th>
                    <th className="py-3.5 pr-6 pl-3 font-bold text-slate-900 text-right">文档明细</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-xs">
                  {filteredItems.map((item) => {
                    const displayPrice = currencyMode === 'USD'
                      ? `$${item.basePriceUSD.toFixed(2)}`
                      : `¥${item.basePriceRMB.toFixed(2)}`;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pl-6 pr-3 text-center">
                          <input type="checkbox" className="rounded-md border-slate-300 w-4 h-4 cursor-pointer" />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700 text-[11px]">
                          {item.code}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          <div>
                            <span>{item.name}</span>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                {item.tags.slice(0, 3).map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded font-normal"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            item.category === '柜体板材' ? 'bg-amber-50 text-amber-700 border-amber-200/70' :
                            item.category === '定制门板' ? 'bg-blue-50 text-blue-700 border-blue-200/70' :
                            item.category === '台面石材' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' :
                            item.category === '基础五金' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/70' :
                            item.category === '功能配件' ? 'bg-purple-50 text-purple-700 border-purple-200/70' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={item.spec}>
                          {item.spec}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="font-mono font-bold text-slate-900 text-sm">
                            {displayPrice}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {currencyMode === 'USD' ? `≈ ¥${item.basePriceRMB.toFixed(1)}` : `≈ $${item.basePriceUSD.toFixed(2)}`}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-600">
                          {item.wasteRatePercent}%
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px] max-w-[220px]">
                          <span className="bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded text-slate-600 inline-block font-mono">
                            {item.formulaDesc}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            文档同步
                          </span>
                        </td>
                        <td className="py-3 pr-6 pl-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedDetailItem(item)}
                              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors text-[11px] font-bold flex items-center gap-1 border border-slate-200/60 bg-white"
                              title="查看该单价在源文档中的完整映射属性"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>详情</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Bar */}
            <div className="py-3 px-6 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span>共维护 <strong className="text-slate-800">{priceItems.length}</strong> 个单价项</span>
                <span>•</span>
                <span>当前筛选显示 <strong className="text-[#EA3A20]">{filteredItems.length}</strong> 项</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>BOQ清单生成时将根据部件单位及损耗率自动累加分项金额</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: 算价规则配置 ======================= */}
      {currentSubView === '算价规则配置' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
          
          {/* Overview Info Banner */}
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">外贸定制 BOQ 全局算价规则体系</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  配置投影面积折算、下料损耗、非标加价与出口包装规则，所有修改将即时作用于报价单工程量计算。
                </p>
              </div>
            </div>
            <button
              onClick={() => alert('已将算价规则成功备份并同步至销售智能体报价引擎')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              同步到报价引擎
            </button>
          </div>

          {/* Rules Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingRules.map((rule) => {
              return (
                <div
                  key={rule.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {rule.category}
                        </span>
                        <span className="text-xs font-mono text-slate-400">ID: {rule.id}</span>
                      </div>
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          rule.isEnabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {rule.isEnabled ? '规则生效中' : '已停用'}
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-2">{rule.name}</h3>
                    
                    <div className="mt-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs font-mono text-slate-700">
                      {rule.formulaDesc}
                    </div>

                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                      {rule.remarks}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-400">当前计算基准值:</span>
                      <span className="text-lg font-mono font-bold text-[#EA3A20]">
                        {rule.factor}
                      </span>
                      <span className="text-xs font-bold text-slate-600">{rule.unit}</span>
                    </div>

                    <button
                      onClick={() => {
                        const newVal = prompt(`请输入新的【${rule.name}】基准值:`, String(rule.factor));
                        if (newVal !== null && !isNaN(Number(newVal))) {
                          setPricingRules((prev) =>
                            prev.map((r) => (r.id === rule.id ? { ...r, factor: Number(newVal) } : r))
                          );
                        }
                      }}
                      className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      修改系数
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================= TAB 3: BOQ报价试算工具 ======================= */}
      {currentSubView === 'BOQ报价试算' && (
        <div className="flex-1 flex gap-5 overflow-hidden">
          
          {/* Left: Interactive Configurator */}
          <div className="w-[360px] shrink-0 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#EA3A20]" />
                <h2 className="text-sm font-bold text-slate-900">定制空间与尺寸输入</h2>
              </div>
              <span className="text-[11px] font-bold text-slate-400">BOQ参数模拟</span>
            </div>

            {/* Presets */}
            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-bold text-slate-600">快捷预设模型</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'wardrobe', label: '通高衣柜' },
                  { id: 'kitchen', label: '西厨橱柜' },
                  { id: 'foyer', label: '玄关柜' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectModel(item.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                      calcModel === item.id
                        ? 'bg-[#EA3A20] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension Inputs */}
            <div className="space-y-3 mb-4 p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>外形物理尺寸 (mm)</span>
                <span className="text-[11px] font-mono text-slate-400">宽 × 高 × 深</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">宽度 (W)</span>
                  <input
                    type="number"
                    value={widthMm}
                    onChange={(e) => setWidthMm(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">高度 (H)</span>
                  <input
                    type="number"
                    value={heightMm}
                    onChange={(e) => setHeightMm(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">深度 (D)</span>
                  <input
                    type="number"
                    value={depthMm}
                    onChange={(e) => setDepthMm(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-600 font-semibold">定制单元套数:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCabinetQty(Math.max(1, cabinetQty - 1))}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-xs">{cabinetQty}</span>
                  <button
                    onClick={() => setCabinetQty(cabinetQty + 1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Material & Part Selections */}
            <div className="space-y-3 mb-4">
              
              {/* Carcase */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">柜体板材材质</label>
                <select
                  value={selectedCarcaseId}
                  onChange={(e) => setSelectedCarcaseId(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  {priceItems
                    .filter((i) => i.category === '柜体板材')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (${item.basePriceUSD}/{item.unit})
                      </option>
                    ))}
                </select>
              </div>

              {/* Door */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">门板材质造型</label>
                <select
                  value={selectedDoorId}
                  onChange={(e) => setSelectedDoorId(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  {priceItems
                    .filter((i) => i.category === '定制门板')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (${item.basePriceUSD}/{item.unit})
                      </option>
                    ))}
                </select>
              </div>

              {/* Countertop */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">台面石材 (可选)</label>
                <select
                  value={selectedTopId}
                  onChange={(e) => setSelectedTopId(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  <option value="none">无台面 (衣柜/壁柜)</option>
                  {priceItems
                    .filter((i) => i.category === '台面石材')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (${item.basePriceUSD}/{item.unit})
                      </option>
                    ))}
                </select>
              </div>

              {/* Hardware & Drawer */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">内抽组数</label>
                  <select
                    value={drawerCount}
                    onChange={(e) => setDrawerCount(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 cursor-pointer"
                  >
                    <option value={0}>0组 (无抽屉)</option>
                    <option value={2}>2组骑马抽</option>
                    <option value={3}>3组骑马抽</option>
                    <option value={4}>4组骑马抽</option>
                    <option value={6}>6组骑马抽</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">嵌入式LED</label>
                  <select
                    value={hasLedStrip ? 'yes' : 'no'}
                    onChange={(e) => setHasLedStrip(e.target.value === 'yes')}
                    className="w-full h-8 px-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 cursor-pointer"
                  >
                    <option value="yes">标配氛围灯带</option>
                    <option value="no">不含灯带</option>
                  </select>
                </div>
              </div>

              {/* Export Packing */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">出口海运包装标准</label>
                <select
                  value={packingTypeId}
                  onChange={(e) => setPackingTypeId(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] cursor-pointer"
                >
                  {priceItems
                    .filter((i) => i.category === '出口包装')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (${item.basePriceUSD}/{item.unit})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Engineering Derived Metrics */}
            <div className="mt-auto p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-900 font-bold">
                <span>自动测算投影面积:</span>
                <span className="font-mono">{boqCalculation.projectionArea} ㎡</span>
              </div>
              <div className="flex items-center justify-between text-amber-800">
                <span>按系数估算展开面积:</span>
                <span className="font-mono font-bold">{boqCalculation.carcaseExpandedArea} ㎡</span>
              </div>
            </div>
          </div>

          {/* Right: Detailed BOQ Breakdown Table */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-100/90 shadow-2xs flex flex-col overflow-hidden">
            
            {/* BOQ Header Banner */}
            <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EA3A20] text-white">
                    BOQ 报价明细
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">工程量清单及明细核算 (Bill of Quantities)</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  所有分项均根据左侧面价设置、板材损耗率及规格标准自动计算汇总，支持无缝导出至正式报价单。
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">预估出口报价总额 (FOB)</span>
                <div className="text-xl font-mono font-bold text-[#EA3A20]">
                  ${boqCalculation.grandTotalUSD.toLocaleString()}
                  <span className="text-xs text-slate-500 font-normal ml-1">USD</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono block">
                  约合 ¥{boqCalculation.grandTotalRMB.toLocaleString()} RMB
                </span>
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-white/95 backdrop-blur-xs z-10 border-b border-slate-100">
                  <tr className="text-slate-900 font-bold text-[11px]">
                    <th className="py-3 pl-5 pr-2 w-10 text-center">#</th>
                    <th className="py-3 px-3">分项部件名称</th>
                    <th className="py-3 px-3">规格与材质</th>
                    <th className="py-3 px-3">核算工程量</th>
                    <th className="py-3 px-3 text-right">出口单价</th>
                    <th className="py-3 px-3 text-center">损耗</th>
                    <th className="py-3 pr-5 pl-3 text-right">分项总价 (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boqCalculation.lines.map((line) => (
                    <tr key={line.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pl-5 pr-2 text-center text-slate-400 font-mono text-[11px]">
                        {line.itemNo}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{line.partName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{line.calcLogic}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={line.spec}>
                        {line.spec}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {line.quantity} <span className="text-[11px] font-normal text-slate-500">{line.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                        ${line.unitPriceUSD.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {line.wastePercent > 0 ? `+${line.wastePercent}%` : '-'}
                      </td>
                      <td className="py-3 pr-5 pl-3 text-right font-mono font-bold text-slate-900 text-sm">
                        ${line.totalUSD.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Summary Breakdown */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-slate-600">
                <span>共包含 <strong className="text-slate-900">{boqCalculation.lines.length}</strong> 个工程细目</span>
                <span>•</span>
                <span className="text-slate-500">已含包装、质检验收与防震加固</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyBOQ}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>复制明细清单</span>
                </button>
                <button
                  onClick={() => alert(`已生成针对该空间定制尺寸的 BOQ 报价单草稿，金额: $${boqCalculation.grandTotalUSD} USD`)}
                  className="px-4 py-1.5 rounded-xl bg-[#EA3A20] hover:bg-[#d6341c] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>导入至报价单</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: 源文档连接与映射配置 ======================= */}
      {isDocConfigModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">指定单价源文档配置与同步状态</h3>
                  <p className="text-[11px] text-slate-400">单价定额数据直读服务</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDocConfigModalOpen(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">指定源文档名称:</span>
                  <span className="font-bold text-slate-900">{documentSourceInfo.docName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">读取工作表 (Sheet):</span>
                  <span className="font-mono font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {documentSourceInfo.sheetName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">维护责任部门:</span>
                  <span className="text-slate-700 font-semibold">{documentSourceInfo.sourceDept}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">文档存储路径:</span>
                  <span className="font-mono text-[10px] text-slate-600 truncate max-w-[240px]">
                    {documentSourceInfo.docUrl}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">同步拉取策略:</span>
                  <span className="text-slate-700 font-medium">{documentSourceInfo.syncStrategy}</span>
                </div>
              </div>

              {/* Latest Update Time Card */}
              <div className="p-3.5 bg-red-50/70 border border-red-100 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>数据最新更新时间</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-base font-mono font-extrabold text-[#EA3A20] mt-0.5">
                    {docLastUpdatedTime}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/70 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>只读已映射 ({priceItems.length} 项)</span>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  本系统无需在前端手动添加、修改或维护单价数据。系统直接按指定文档结构自动解析并驱动报价计算，确保报价与供应链定额完全一致。
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                下次计划轮询: 10分钟后
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDocConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSyncFromDoc();
                    setIsDocConfigModalOpen(false);
                  }}
                  disabled={isSyncingDoc}
                  className="px-4 py-2 rounded-xl bg-[#EA3A20] text-white hover:bg-[#d6341c] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDoc ? 'animate-spin' : ''}`} />
                  <span>从指定文档重新读取</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: 查看单价项源文档映射明细 ======================= */}
      {selectedDetailItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">单价项源文档映射明细 (只读)</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{selectedDetailItem.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-slate-400 text-[11px] block">部件名称</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedDetailItem.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">定制类别</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{selectedDetailItem.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">规格 / 环保标准</span>
                  <span className="text-slate-700 font-medium mt-0.5 block">{selectedDetailItem.spec}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">计价单位</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{selectedDetailItem.unit}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-slate-400 text-[11px] block">外贸基准单价 (USD)</span>
                  <span className="font-mono font-extrabold text-[#EA3A20] text-base mt-0.5 block">
                    ${selectedDetailItem.basePriceUSD.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">折算基准单价 (RMB)</span>
                  <span className="font-mono font-bold text-slate-800 text-base mt-0.5 block">
                    ¥{selectedDetailItem.basePriceRMB.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">定额损耗率</span>
                  <span className="font-mono font-bold text-slate-700 mt-0.5 block">{selectedDetailItem.wasteRatePercent}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">核算状态</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>已生效同步</span>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-slate-400 text-[11px] block">BOQ核算逻辑与计算公式</span>
                <p className="font-mono text-slate-800 text-xs font-medium">{selectedDetailItem.formulaDesc}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-400 block">数据源文档</span>
                  <span className="font-bold text-slate-800">{documentSourceInfo.docName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">数据最新更新时间</span>
                  <span className="font-mono font-bold text-[#EA3A20]">{docLastUpdatedTime}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 text-[11px] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>此数据项由企业财务与工程指定文档驱动，不可在本地编辑修改。</span>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 animate-fade-in border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
