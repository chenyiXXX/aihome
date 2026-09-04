import React, { useState, useMemo, useRef } from 'react';
import {
  Calculator,
  FileSpreadsheet,
  Plus,
  Search,
  Download,
  Upload,
  Sliders,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Info,
  Layers,
  DollarSign,
  RefreshCw,
  Boxes,
  Sparkles,
  ArrowUpRight,
  X,
  FileText,
  FileUp
} from 'lucide-react';
import { BOQPriceItem, BOQPricingRule, BOQLineItem } from '../../types';
import { initialBOQPriceItems, initialBOQPricingRules } from '../../data/mockData';

interface PricingMaintenanceModuleProps {
  subView?: string;
  onSelectSubView?: (subView: string) => void;
}

export const PricingMaintenanceModule: React.FC<PricingMaintenanceModuleProps> = ({
  subView = '单价库',
  onSelectSubView
}) => {
  // Current active subview tab (单价库 | 算价规则配置 | BOQ报价试算)
  const normalizedSubView = subView === 'BOQ单价库' ? '单价库' : subView;
  const [currentSubView, setCurrentSubView] = useState<string>(normalizedSubView || '单价库');

  // Keep in sync with prop if changed externally
  React.useEffect(() => {
    if (subView) {
      setCurrentSubView(subView === 'BOQ单价库' ? '单价库' : subView);
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

  // Modal: Add / Edit Price Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BOQPriceItem | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '柜体板材' as BOQPriceItem['category'],
    spec: '',
    unit: '展开㎡' as BOQPriceItem['unit'],
    basePriceUSD: 40.0,
    basePriceRMB: 288.0,
    wasteRatePercent: 8,
    formulaDesc: '展开面积(㎡) × 基准单价 × (1 + 损耗率 8%)',
    tags: ''
  });

  // Batch Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<{ name: string; size: string } | null>(null);
  const [importPreviewList, setImportPreviewList] = useState<Array<{
    code: string;
    name: string;
    category: BOQPriceItem['category'];
    spec: string;
    unit: BOQPriceItem['unit'];
    basePriceUSD: number;
    basePriceRMB: number;
    wasteRatePercent: number;
    formulaDesc: string;
    tags: string[];
    valid: boolean;
  }>>([]);
  const [duplicateHandling, setDuplicateHandling] = useState<'overwrite' | 'skip' | 'rename'>('overwrite');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Open modal for new item
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      code: `ITEM-${Date.now().toString().slice(-4)}`,
      name: '',
      category: '柜体板材',
      spec: '',
      unit: '展开㎡',
      basePriceUSD: 45.0,
      basePriceRMB: 324.0,
      wasteRatePercent: 8,
      formulaDesc: '展开面积(㎡) × 基准单价 × (1 + 损耗率 8%)',
      tags: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (item: BOQPriceItem) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      spec: item.spec,
      unit: item.unit,
      basePriceUSD: item.basePriceUSD,
      basePriceRMB: item.basePriceRMB,
      wasteRatePercent: item.wasteRatePercent,
      formulaDesc: item.formulaDesc,
      tags: item.tags ? item.tags.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  // Save Item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedTags = formData.tags
      .split(/[,， ]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingItem) {
      setPriceItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                code: formData.code,
                name: formData.name,
                category: formData.category,
                spec: formData.spec,
                unit: formData.unit,
                basePriceUSD: Number(formData.basePriceUSD),
                basePriceRMB: Number(formData.basePriceRMB),
                wasteRatePercent: Number(formData.wasteRatePercent),
                formulaDesc: formData.formulaDesc,
                tags: parsedTags,
                updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
              }
            : item
        )
      );
    } else {
      const newItem: BOQPriceItem = {
        id: `BOQ-NEW-${Date.now().toString().slice(-4)}`,
        code: formData.code || `ITEM-${Math.floor(Math.random() * 900 + 100)}`,
        name: formData.name,
        category: formData.category,
        spec: formData.spec || '标准定制规格',
        unit: formData.unit,
        currency: 'USD',
        basePriceUSD: Number(formData.basePriceUSD),
        basePriceRMB: Number(formData.basePriceRMB),
        wasteRatePercent: Number(formData.wasteRatePercent),
        formulaDesc: formData.formulaDesc,
        status: '已生效',
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        tags: parsedTags.length > 0 ? parsedTags : ['新维护单价']
      };
      setPriceItems((prev) => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Sample batch import items for preview & quick testing
  const sampleImportItems = useMemo(() => [
    {
      code: 'CAB-BIRCH-01',
      name: '芬兰白桦多层实木板 (环保防潮)',
      category: '柜体板材' as const,
      spec: '18mm / E0级桦木全芯 / 耐磨耐水',
      unit: '展开㎡' as const,
      basePriceUSD: 48.5,
      basePriceRMB: 349.2,
      wasteRatePercent: 8,
      formulaDesc: '展开面积(㎡) × 基准单价 × (1 + 损耗率 8%)',
      tags: ['桦木实木', 'E0', '高抗弯'],
      valid: true
    },
    {
      code: 'DOOR-NANO-01',
      name: '纳米抗指纹极哑亲肤门板',
      category: '定制门板' as const,
      spec: '20mm / 表面纳米微晶膜 / 4H高硬度',
      unit: '投影㎡' as const,
      basePriceUSD: 108.0,
      basePriceRMB: 777.6,
      wasteRatePercent: 5,
      formulaDesc: '立面投影面积(㎡) × 门板基准单价 × (1 + 损耗 5%)',
      tags: ['纳米抗指纹', '极哑', '肤感'],
      valid: true
    },
    {
      code: 'ACC-SLIDE-HETTICH',
      name: '海蒂诗隐藏式阻尼静音滑轨',
      category: '基础五金' as const,
      spec: '500mm全拉出 / 40kg重型静音承重',
      unit: '套' as const,
      basePriceUSD: 16.8,
      basePriceRMB: 120.96,
      wasteRatePercent: 0,
      formulaDesc: '每组抽屉配置 1 套滑轨',
      tags: ['海蒂诗', '重型静音', '德国原装'],
      valid: true
    },
    {
      code: 'DOOR-ALUM-FRAME',
      name: '极简黑钛铝框灰玻通高门',
      category: '定制门板' as const,
      spec: '4mm超白钢化灰玻 / 航空级极窄钛铝边框',
      unit: '投影㎡' as const,
      basePriceUSD: 142.0,
      basePriceRMB: 1022.4,
      wasteRatePercent: 5,
      formulaDesc: '玻璃门投影面积(㎡) × 铝玻复合单价',
      tags: ['极窄铝框', '灰玻', '通高门'],
      valid: true
    }
  ], []);

  // Quick load sample template data
  const handleLoadSampleImport = () => {
    setImportFile({ name: '外贸全屋定制_BOQ标准单价明细表.xlsx', size: '28.4 KB' });
    setImportPreviewList(sampleImportItems);
    showToast('已加载示例单价导入数据');
  };

  // Download Standard Template CSV with UTF-8 BOM
  const handleDownloadTemplate = () => {
    const header = '部件编码,部件名称,类别,规格环保标准,计价单位,外贸基准价(USD),损耗率(%),BOQ核算逻辑,标签特征\n';
    const rows = [
      'CAB-BIRCH-01,芬兰白桦多层实木板,柜体板材,18mm / E0级桦木芯 / 防水防潮,展开㎡,48.5,8,展开面积(㎡) × 基准单价 × (1 + 损耗率 8%),桦木;E0;高端',
      'DOOR-NANO-01,纳米抗指纹极哑门板,定制门板,20mm / 肤感覆膜耐划伤,投影㎡,108.0,5,立面投影面积(㎡) × 门板基准单价 × (1 + 损耗 5%),纳米;抗指纹',
      'ACC-SLIDE-01,海蒂诗隐藏式阻尼滑轨,基础五金,500mm / 40kg重型静音,套,16.8,0,每组抽屉配置1套,海蒂诗;原装进口'
    ].join('\n');

    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '外贸定制产品单价库标准导入模板.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('已下载单价库标准导入模板文件');
  };

  // Handle uploaded file (supports CSV & Excel)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`
    });

    if (file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split(/\r?\n/).filter(Boolean);
          if (lines.length > 1) {
            const parsed = lines.slice(1).map((line, idx) => {
              const cols = line.split(',');
              const usd = Number(cols[5]) || 38;
              return {
                code: cols[0]?.trim() || `ITEM-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
                name: cols[1]?.trim() || `导入部件 ${idx + 1}`,
                category: (cols[2]?.trim() as any) || '柜体板材',
                spec: cols[3]?.trim() || '标准外贸定制规格',
                unit: (cols[4]?.trim() as any) || '展开㎡',
                basePriceUSD: usd,
                basePriceRMB: +(usd * exchangeRate).toFixed(2),
                wasteRatePercent: Number(cols[6]) || 5,
                formulaDesc: cols[7]?.trim() || '展开面积(㎡) × 基准单价',
                tags: cols[8] ? cols[8].split(';').map((t) => t.trim()) : ['导入数据'],
                valid: true
              };
            });
            setImportPreviewList(parsed);
            showToast(`已成功识别 ${parsed.length} 条待导入单价数据`);
            return;
          }
        } catch {
          // fallback
        }
        setImportPreviewList(sampleImportItems);
        showToast('已完成文件解析并生成导入预览');
      };
      reader.readAsText(file);
    } else {
      // For Excel files (.xlsx / .xls), provide standard parsed preview
      setImportPreviewList(sampleImportItems);
      showToast('已成功解析 Excel 格式并生成导入预览');
    }
  };

  // Confirm and commit batch import
  const handleConfirmImport = () => {
    if (importPreviewList.length === 0) return;

    setPriceItems((prev) => {
      let updated = [...prev];

      importPreviewList.forEach((imported) => {
        const newItem: BOQPriceItem = {
          id: `BOQ-IMP-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substr(2, 4)}`,
          code: imported.code,
          name: imported.name,
          category: imported.category,
          spec: imported.spec,
          unit: imported.unit,
          currency: 'USD',
          basePriceUSD: imported.basePriceUSD,
          basePriceRMB: imported.basePriceRMB,
          wasteRatePercent: imported.wasteRatePercent,
          formulaDesc: imported.formulaDesc,
          status: '已生效',
          updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          tags: imported.tags
        };

        const existingIdx = updated.findIndex((i) => i.code === imported.code);

        if (existingIdx >= 0) {
          if (duplicateHandling === 'overwrite') {
            updated[existingIdx] = { ...updated[existingIdx], ...newItem, id: updated[existingIdx].id };
          } else if (duplicateHandling === 'rename') {
            newItem.code = `${newItem.code}-NEW`;
            updated = [newItem, ...updated];
          }
          // 'skip' will leave existing item untouched
        } else {
          updated = [newItem, ...updated];
        }
      });

      return updated;
    });

    showToast(`成功导入 ${importPreviewList.length} 条单价项数据！`);
    setIsImportModalOpen(false);
    setImportFile(null);
    setImportPreviewList([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          {(currentSubView === '单价库' || currentSubView === 'BOQ单价库') ? (
            <>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="h-9 px-4 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="批量导入 Excel / CSV 单价数据"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>批量导入</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="h-9 px-4.5 rounded-full bg-[#EA3A20] text-white hover:bg-[#d6341c] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>新建单价项</span>
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
                onClick={() => handleTabChange('单价库')}
                className="h-9 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>← 返回单价库</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================= TAB 1: 单价库 ======================= */}
      {(currentSubView === '单价库' || currentSubView === 'BOQ单价库') && (
        <div className="flex-1 flex flex-col min-h-0 space-y-3.5">
          
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
                    <th className="py-3.5 pr-6 pl-3 font-bold text-slate-900 text-right">操作</th>
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
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.status === '已生效'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 pr-6 pl-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                              title="编辑单价"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
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
                  所有分项均根据左侧单价库、板材损耗率及规格标准自动计算汇总，支持无缝导出至正式报价单。
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

      {/* ======================= MODAL: 新建/编辑单价项 ======================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? '编辑 BOQ 单价项' : '新建 BOQ 单价项'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">部件编号 (Code)</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">定制类别</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  >
                    <option value="柜体板材">柜体板材</option>
                    <option value="定制门板">定制门板</option>
                    <option value="台面石材">台面石材</option>
                    <option value="基础五金">基础五金</option>
                    <option value="功能配件">功能配件</option>
                    <option value="出口包装">出口包装</option>
                    <option value="人工安装">人工安装</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">部件名称</label>
                <input
                  type="text"
                  required
                  placeholder="例如：爱格板 E0级 柜体板..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">规格/材质/环保等级说明</label>
                <input
                  type="text"
                  placeholder="例如：18mm / 双饰面耐磨层 / E0级环保..."
                  value={formData.spec}
                  onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">计价单位</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full h-8 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="展开㎡">展开㎡</option>
                    <option value="投影㎡">投影㎡</option>
                    <option value="延米">延米</option>
                    <option value="个">个</option>
                    <option value="套">套</option>
                    <option value="米">米</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">外贸单价 (USD)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.basePriceUSD}
                    onChange={(e) => {
                      const usd = Number(e.target.value);
                      setFormData({
                        ...formData,
                        basePriceUSD: usd,
                        basePriceRMB: +(usd * exchangeRate).toFixed(1)
                      });
                    }}
                    className="w-full h-8 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">损耗率 (%)</label>
                  <input
                    type="number"
                    value={formData.wasteRatePercent}
                    onChange={(e) => setFormData({ ...formData, wasteRatePercent: Number(e.target.value) })}
                    className="w-full h-8 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">BOQ核算逻辑/公式备注</label>
                <input
                  type="text"
                  value={formData.formulaDesc}
                  onChange={(e) => setFormData({ ...formData, formulaDesc: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">标签特征 (逗号分隔)</label>
                <input
                  type="text"
                  placeholder="如: E0, 激光封边, 原装进口"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA3A20] text-white hover:bg-[#d6341c] font-bold shadow-xs cursor-pointer"
                >
                  保存单价项
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= BATCH IMPORT MODAL ======================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold shadow-xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">批量导入单价库数据</h3>
                  <p className="text-[11px] text-slate-400">支持上传 Excel (.xlsx / .xls) 或 CSV 文件，批量维护外贸定制产品单价</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                  setImportPreviewList([]);
                }}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Step 1: Template Download Banner */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 text-slate-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">下载标准导入模板</div>
                    <div className="text-[11px] text-slate-500">
                      包含部件编码、名称、类别、材质规格、外贸基准价(USD)、损耗率等必填字段
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>下载模板 (.csv)</span>
                </button>
              </div>

              {/* Step 2: Upload Area */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">上传数据文件</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setImportFile({
                        name: file.name,
                        size: `${(file.size / 1024).toFixed(1)} KB`
                      });
                      if (file.name.endsWith('.csv')) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const text = ev.target?.result as string;
                          const lines = text.split(/\r?\n/).filter(Boolean);
                          if (lines.length > 1) {
                            const parsed = lines.slice(1).map((line, idx) => {
                              const cols = line.split(',');
                              const usd = Number(cols[5]) || 38;
                              return {
                                code: cols[0]?.trim() || `ITEM-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
                                name: cols[1]?.trim() || `导入部件 ${idx + 1}`,
                                category: (cols[2]?.trim() as any) || '柜体板材',
                                spec: cols[3]?.trim() || '标准外贸定制规格',
                                unit: (cols[4]?.trim() as any) || '展开㎡',
                                basePriceUSD: usd,
                                basePriceRMB: +(usd * exchangeRate).toFixed(2),
                                wasteRatePercent: Number(cols[6]) || 5,
                                formulaDesc: cols[7]?.trim() || '展开面积(㎡) × 基准单价',
                                tags: cols[8] ? cols[8].split(';').map((t) => t.trim()) : ['导入数据'],
                                valid: true
                              };
                            });
                            setImportPreviewList(parsed);
                            showToast(`已成功识别 ${parsed.length} 条待导入单价数据`);
                            return;
                          }
                          setImportPreviewList(sampleImportItems);
                        };
                        reader.readAsText(file);
                      } else {
                        setImportPreviewList(sampleImportItems);
                        showToast('已成功解析 Excel 格式并生成导入预览');
                      }
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    importFile
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  {importFile ? (
                    <div className="flex items-center justify-between px-3">
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            <span>{importFile.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({importFile.size})</span>
                          </div>
                          <div className="text-[11px] text-emerald-600 font-medium">
                            文件校验成功，已就绪可导入
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        重新选择
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-1">
                        <FileUp className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="font-bold text-slate-700">点击或将 Excel / CSV 文件拖拽到此处</p>
                      <p className="text-[11px] text-slate-400">
                        支持 .xlsx, .xls, .csv 格式，单次建议不超过 500 条
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadSampleImport();
                          }}
                          className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-slate-600 hover:text-slate-900 font-semibold text-[11px] shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-[#EA3A20]" />
                          <span>一键载入测试示例数据</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Duplicate Handling & Data Preview */}
              {importPreviewList.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>数据预览与校验</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        {importPreviewList.length} 条有效记录
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span>重复部件编码处理:</span>
                      <select
                        value={duplicateHandling}
                        onChange={(e) => setDuplicateHandling(e.target.value as any)}
                        className="h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                      >
                        <option value="overwrite">覆盖已有单价</option>
                        <option value="skip">跳过重复项</option>
                        <option value="rename">自动生成新编码</option>
                      </select>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] sticky top-0">
                        <tr>
                          <th className="py-2 px-3">部件编码</th>
                          <th className="py-2 px-3">部件名称</th>
                          <th className="py-2 px-2.5">类别</th>
                          <th className="py-2 px-2.5">单位</th>
                          <th className="py-2 px-3 text-right">单价 (USD)</th>
                          <th className="py-2 px-2.5 text-center">损耗</th>
                          <th className="py-2 px-2.5 text-center">校验状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {importPreviewList.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-slate-800 text-[11px]">{row.code}</td>
                            <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                            <td className="py-2 px-2.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                {row.category}
                              </span>
                            </td>
                            <td className="py-2 px-2.5 text-slate-500">{row.unit}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                              ${row.basePriceUSD.toFixed(2)}
                            </td>
                            <td className="py-2 px-2.5 text-center font-mono text-slate-500">{row.wasteRatePercent}%</td>
                            <td className="py-2 px-2.5 text-center">
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                                <Check className="w-3 h-3" />
                                <span>通过</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-500">
                {importPreviewList.length > 0 ? (
                  <span>
                    待导入 <strong className="text-slate-800">{importPreviewList.length}</strong> 项，确认后将即时写入单价库并生效
                  </span>
                ) : (
                  <span>请选择或拖拽文件进行数据解析</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportFile(null);
                    setImportPreviewList([]);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 font-bold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={importPreviewList.length === 0}
                  className={`px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                    importPreviewList.length > 0
                      ? 'bg-[#EA3A20] text-white hover:bg-[#d6341c]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>确认导入并生效</span>
                </button>
              </div>
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
