import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  RotateCcw,
  Sliders,
  ChevronDown,
  Check,
  Building2,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  X,
  Share2,
  Trash2,
  Eye,
  Smartphone,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  FileCode,
  QrCode,
  Maximize2,
  Minimize2,
  Laptop
} from 'lucide-react';
import {
  GraphicTextItem,
  AvailableProduct,
  AvailableCase,
  AVAILABLE_PRODUCTS,
  AVAILABLE_CASES,
  INITIAL_GRAPHIC_ARTICLES,
  generateWeChatArticleHtml
} from '../../../data/graphicTextData';
import { PhoneMockupArticle } from './PhoneMockupArticle';

export const GraphicTextModule: React.FC = () => {
  // Mode: 'list' = 图文列表展示; 'wizard' = 三步走向导式生成/编辑
  const [viewMode, setViewMode] = useState<'list' | 'wizard'>('list');

  // Articles list state
  const [articles, setArticles] = useState<GraphicTextItem[]>(INITIAL_GRAPHIC_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | '已同步微信草稿箱' | '本地草稿' | '待审核'>('ALL');

  // Wizard Step: 1 = 【定调】, 2 = 【AI 自动装配中】(15-20秒), 3 = 【微调与同步】
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form States 【定调】
  const [topicInput, setTopicInput] = useState('2026现代极简橱柜设计趋势');
  const [selectedProductNames, setSelectedProductNames] = useState<string[]>([
    'PET肤感板系列',
    '吊滑极简门'
  ]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-dubai');
  const [themeStyle, setThemeStyle] = useState<'emerald' | 'dark' | 'warm'>('emerald');

  // Step 2 Assembly States 【AI 自动装配中】(15-20秒)
  const [assemblyProgress, setAssemblyProgress] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isAssemblyFinished, setIsAssemblyFinished] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Step 3 Fine-tuning & Sync States 【微调与同步】
  const [activeEditingArticle, setActiveEditingArticle] = useState<GraphicTextItem>(INITIAL_GRAPHIC_ARTICLES[0]);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [isSyncingWeChat, setIsSyncingWeChat] = useState<boolean>(false);
  const [showSyncSuccessModal, setShowSyncSuccessModal] = useState<boolean>(false);
  const [syncedDraftId, setSyncedDraftId] = useState<string>('');

  // 页面全屏展示手机/大屏预览状态
  const [isFullScreenPreview, setIsFullScreenPreview] = useState<boolean>(false);
  const [fullScreenDeviceMode, setFullScreenDeviceMode] = useState<'phone' | 'wide'>('phone');

  // 监听 ESC 快捷键退出全屏
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreenPreview) {
        setIsFullScreenPreview(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPreview]);

  // 从列表或向导直接开启全屏预览
  const handleOpenFullScreenPreview = (art: GraphicTextItem) => {
    setActiveEditingArticle(art);
    setEditTitle(art.title);
    setEditSummary(art.summary);
    setThemeStyle(art.themeStyle || 'emerald');
    setIsFullScreenPreview(true);
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Pre-set topics for quick-fill in Step 1
  const quickTopics = [
    '2026现代极简橱柜设计趋势',
    'PET肤感板与吊滑隐形门的质感革命',
    '迪拜高奢精装公寓极简橱柜全案实录',
    '中东海湾豪宅木作工法：耐高温高湿防变形解密'
  ];

  // Stages of Step 2 (as specified in user prompt:
  // 正在检索材质参数... -> 正在组织文案大纲... -> 正在渲染公众号样式与封面... -> 合规质检完成)
  const assemblyStages = [
    {
      title: '正在检索材质参数...',
      detail: '调取 PET 肤感板零度超亚抗指纹规格、吊滑门顶轨航空铝合金承重标准与 E0/CARB-P2 报告...',
      threshold: 25
    },
    {
      title: '正在组织文案大纲...',
      detail: '构建微信公众号深度爆款逻辑：痛点场景引言 -> 材质触感解析 -> 迪拜精装落地实录 -> 施工收口细节...',
      threshold: 55
    },
    {
      title: '正在渲染公众号样式与封面...',
      detail: '生成 2.35:1 微信封面首图，注入微信内联排版 CSS，装配材质参数明细卡与实景组图...',
      threshold: 85
    },
    {
      title: '合规质检完成',
      detail: '欧洲 FSC 森林认证与出口环保声明核验通过，检测无极限绝对化违禁词，符合微信公众平台规范。',
      threshold: 100
    }
  ];

  // Logs to display in Step 2 console
  const [logs, setLogs] = useState<string[]>([]);

  // Filtered Articles for List View
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (statusFilter !== 'ALL' && art.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchTopic = art.topic.toLowerCase().includes(q);
        const matchProducts = art.linkedProducts.some((p) => p.toLowerCase().includes(q));
        const matchCase = art.linkedCase.name.toLowerCase().includes(q);
        if (!matchTitle && !matchTopic && !matchProducts && !matchCase) return false;
      }
      return true;
    });
  }, [articles, statusFilter, searchQuery]);

  // Handle open Wizard to create new article
  const handleStartCreate = () => {
    setTopicInput('2026现代极简橱柜设计趋势');
    setSelectedProductNames(['PET肤感板系列', '吊滑极简门']);
    setSelectedCaseId('case-dubai');
    setThemeStyle('emerald');
    setCurrentStep(1);
    setViewMode('wizard');
  };

  // Handle open Wizard to view/edit existing article directly in Step 3
  const handleViewArticleInStep3 = (art: GraphicTextItem) => {
    setActiveEditingArticle(art);
    setEditTitle(art.title);
    setEditSummary(art.summary);
    setThemeStyle(art.themeStyle || 'emerald');
    setCurrentStep(3);
    setViewMode('wizard');
  };

  // Step 1 -> Step 2: Trigger AI Assembly (15-20 seconds)
  const handleTriggerAssembly = () => {
    if (!topicInput.trim()) {
      showToast('请输入本期图文主题');
      return;
    }
    if (selectedProductNames.length === 0) {
      showToast('请至少勾选 1 项关联产品');
      return;
    }

    setCurrentStep(2);
    setAssemblyProgress(0);
    setElapsedSeconds(0);
    setCurrentStageIdx(0);
    setIsAssemblyFinished(false);
    setLogs([
      `[INIT] 正在启动图文生成智能装配流水线...`,
      `[TOPIC] 锁定本期主题: "${topicInput}"`,
      `[PRODUCTS] 绑定关联产品: ${selectedProductNames.join(', ')}`,
      `[CASE] 绑定落地案例: ${AVAILABLE_CASES.find((c) => c.id === selectedCaseId)?.name || '迪拜精装公寓项目'}`
    ]);

    // Start 16-second timer (fits 15-20 seconds specification)
    const totalDurationMs = 16000;
    const intervalMs = 200;
    const stepIncrement = (100 / (totalDurationMs / intervalMs));

    let currentProgress = 0;
    let secondsCounter = 0;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      currentProgress += stepIncrement;
      secondsCounter += intervalMs / 1000;
      setElapsedSeconds(Math.floor(secondsCounter));

      if (currentProgress >= 25 && currentProgress < 55) {
        setCurrentStageIdx(1);
      } else if (currentProgress >= 55 && currentProgress < 85) {
        setCurrentStageIdx(2);
      } else if (currentProgress >= 85) {
        setCurrentStageIdx(3);
      }

      // Add log streams dynamically
      if (Math.floor(currentProgress) === 26) {
        setLogs((prev) => [
          ...prev,
          `[MAT-PARAM] 检索完成: PET肤感板光泽度 ≤ 3GU 零度超亚 / CARB Phase 2 达标`,
          `[HW-PARAM] 检索完成: 吊滑门顶轨承重 120kg / 磁悬浮柔音阻尼`
        ]);
      } else if (Math.floor(currentProgress) === 56) {
        setLogs((prev) => [
          ...prev,
          `[OUTLINE] 大纲编排完成: 4大核心章节 + 2处金句引言 + 参数矩阵对照表`,
          `[COPY] 注入专业外贸工程语调，融合迪拜实景落地参数`
        ]);
      } else if (Math.floor(currentProgress) === 86) {
        setLogs((prev) => [
          ...prev,
          `[RENDER] 微信公众号 677px 移动端排版样式就绪 (内联 CSS 规整完成)`,
          `[IMAGE] 装载 8 张迪拜精装公寓实拍高清组图及图注`
        ]);
      }

      if (currentProgress >= 100) {
        clearInterval(timerRef.current);
        setAssemblyProgress(100);
        setIsAssemblyFinished(true);
        setCurrentStageIdx(3);
        setLogs((prev) => [
          ...prev,
          `[AUDIT] 合规质检 100% 通过: 无虚假极限词，环保声明合法合规！`,
          `[READY] 图文方案装配完成，即将进入【微调与同步】手机预览...`
        ]);

        // Build the generated article item
        const linkedCaseObj = AVAILABLE_CASES.find((c) => c.id === selectedCaseId) || AVAILABLE_CASES[0];
        const newArt: GraphicTextItem = {
          id: `art-${Date.now()}`,
          topic: topicInput,
          title: `${topicInput}：${selectedProductNames.join('与')}的质感革命`,
          summary: `极简不是空间的虚无，而是材质触感与隐形机械的深度共鸣。本文结合品爱在${linkedCaseObj.name}的实际交付经验，解构新一代高定橱柜的关键设计语言与工法准则。`,
          coverImage: linkedCaseObj.cover,
          linkedProducts: selectedProductNames,
          linkedCase: {
            id: linkedCaseObj.id,
            name: linkedCaseObj.name,
            photoCount: linkedCaseObj.photoCount,
            description: linkedCaseObj.description,
            images: linkedCaseObj.images
          },
          author: 'HomeCraft 高定工法组',
          publishPlatform: '微信公众号',
          status: '本地草稿',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          readCount: 1,
          wordCount: 2260,
          themeStyle: themeStyle,
          materialsParameters: [
            { name: 'PET肤感板表面', spec: '≤ 3GU 零度超亚抗指纹', standard: '纳米准分子固化 / 自修复' },
            { name: '柜体环保等级', spec: 'ENF / CARB Phase 2', standard: '甲醛释放量 ≤ 0.025mg/m³' },
            { name: '吊滑门轨道材质', spec: '6063-T6 航空级铝合金', standard: '壁厚2.5mm / 承重120kg' },
            { name: '阻尼滑动测试', spec: '磁悬浮静音滑轮组', standard: '20万次开合寿命认证' }
          ],
          contentSections: [
            {
              title: `01 / 触觉革命：为何高端私宅青睐 ${selectedProductNames[0] || 'PET肤感板'}？`,
              paragraphs: [
                '在当代高定橱柜设计中，高光反光材料正逐步被低饱和度的极简哑光面料所替代。触感温润、指过无痕的质地，为空间注入了沉静克制的奢华气息。',
                '经微波准分子固化工艺处理的纳米级表面，具备极强的抗污疏油能力，即便是厨房重油烟环境，亦能轻松打理，历久弥新。'
              ],
              highlightQuote: '“当奢华褪去张扬的光泽，低调温润的肤感便成为生活质感的最真实表达。”',
              image: linkedCaseObj.images[1] || linkedCaseObj.cover,
              caption: `▲ ${linkedCaseObj.name}实景：${selectedProductNames[0]}极简整墙高柜`
            },
            {
              title: `02 / 边界消隐：${selectedProductNames[1] || '吊滑极简门'}重塑餐厨自由流动格局`,
              paragraphs: [
                '告别传统厚重地轨的积灰困扰与绊脚隐患，天轨吊滑系统实现了地面材质无缝通铺，彻底打通餐厨之间的空间界限。',
                '极窄航空铝合金边框搭配隐形缓冲阻尼，闭合时如艺术护墙，推开时隐入视线，实现真正意义上的空间自由呼吸。'
              ],
              highlightQuote: '“轨道的隐形，让每一次推拉都化作轻盈无声的空间仪式。”',
              image: linkedCaseObj.images[2] || linkedCaseObj.cover,
              caption: `▲ 顶装天花隐形天轨：自由贯通的西厨动线`
            },
            {
              title: `03 / 工程落地实录：${linkedCaseObj.name}交付复盘`,
              paragraphs: [
                `在海湾六国严苛的气温与紫外线考验下，HomeCraft 工厂在出货前经过全套恒温恒湿抗老化测试，确保大批量精装工程交付零色差、零形变。`,
                '采用激光无缝封边工艺，胶线达到极致的 0.05mm 级别，兼顾了极致美学与顶级防潮性能。'
              ],
              image: linkedCaseObj.images[0],
              caption: `▲ ${linkedCaseObj.name}实景完工验收交付`
            }
          ]
        };

        setActiveEditingArticle(newArt);
        setEditTitle(newArt.title);
        setEditSummary(newArt.summary);

        // Auto transition to Step 3 after a brief celebration pause
        setTimeout(() => {
          setCurrentStep(3);
        }, 1200);
      }
    }, intervalMs);
  };

  // Clean timer on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Quick skip button for Step 2 in case user wants immediate preview
  const handleFastSkipStep2 = () => {
    clearInterval(timerRef.current);
    setAssemblyProgress(100);
    setIsAssemblyFinished(true);
    setCurrentStageIdx(3);
    setTimeout(() => {
      setCurrentStep(3);
    }, 400);
  };

  // Step 3: Copy HTML
  const handleCopyHtml = () => {
    const html = generateWeChatArticleHtml({
      ...activeEditingArticle,
      title: editTitle || activeEditingArticle.title,
      summary: editSummary || activeEditingArticle.summary,
      themeStyle: themeStyle
    });

    navigator.clipboard.writeText(html);
    showToast('已成功复制公众号富文本 HTML！可直接在微信公众平台后台富文本编辑器粘贴。');
  };

  // Step 3: Sync to WeChat Drafts (一键同步至微信草稿箱)
  const handleSyncToWeChatDrafts = () => {
    setIsSyncingWeChat(true);

    setTimeout(() => {
      setIsSyncingWeChat(false);
      const generatedDraftId = `WX-DRAFT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSyncedDraftId(generatedDraftId);
      setShowSyncSuccessModal(true);

      // Update current article status
      const updated = {
        ...activeEditingArticle,
        title: editTitle || activeEditingArticle.title,
        summary: editSummary || activeEditingArticle.summary,
        themeStyle: themeStyle,
        status: '已同步微信草稿箱' as const,
        wechatDraftId: generatedDraftId
      };
      setActiveEditingArticle(updated);

      // Upsert into articles list
      setArticles((prev) => {
        const idx = prev.findIndex((a) => a.id === updated.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        } else {
          return [updated, ...prev];
        }
      });

      showToast(`已成功同步至微信公众号草稿箱 (ID: ${generatedDraftId})`);
    }, 1500);
  };

  // Step 3: Save and return to list
  const handleSaveAndReturnToList = () => {
    const updated = {
      ...activeEditingArticle,
      title: editTitle || activeEditingArticle.title,
      summary: editSummary || activeEditingArticle.summary,
      themeStyle: themeStyle
    };

    setArticles((prev) => {
      const idx = prev.findIndex((a) => a.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      } else {
        return [updated, ...prev];
      }
    });

    setViewMode('list');
    showToast('图文方案已保存至列表');
  };

  // Delete an article from list
  const handleDeleteArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确认删除该图文生成方案吗？')) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast('图文方案已删除');
    }
  };

  // Toggle product selection in Step 1
  const toggleProduct = (productName: string) => {
    if (selectedProductNames.includes(productName)) {
      if (selectedProductNames.length === 1) {
        showToast('请至少保留 1 项关联产品');
        return;
      }
      setSelectedProductNames(selectedProductNames.filter((p) => p !== productName));
    } else {
      setSelectedProductNames([...selectedProductNames, productName]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW MODE 1: 图文生成列表 (List View Format)               */}
      {/* ========================================================= */}
      {viewMode === 'list' && (
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar space-y-5 pb-8">
          {/* Top Banner & Action Header */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#0F4A47] text-white flex items-center justify-center shadow-md shadow-emerald-900/20 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">公众号与新媒体图文生成中心</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    AI 三步走向导装配
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  基于产品参数库与海外工程案例库，三步向导式快速装配高审美微信公众号深度图文，支持手机预览与草稿箱一键同步。
                </p>
              </div>
            </div>

            {/* Launch 3-Step Wizard Button */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={handleStartCreate}
                className="px-5 py-2.5 rounded-full bg-[#0F4A47] hover:bg-[#0c3937] text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>新建图文生成（三步走向导）</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 shrink-0">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="text-[11px] font-medium text-slate-400">已生成图文方案</div>
              <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{articles.length} 篇</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">覆盖 6 款核心高定产品</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="text-[11px] font-medium text-slate-400">已同步微信草稿箱</div>
              <div className="text-xl font-bold text-emerald-700 mt-1 font-mono">
                {articles.filter((a) => a.status === '已同步微信草稿箱').length} 篇
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">微信公众平台直连</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="text-[11px] font-medium text-slate-400">合规质检通过率</div>
              <div className="text-xl font-bold text-slate-900 mt-1 font-mono">100%</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">FSC与环保标准合规</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="text-[11px] font-medium text-slate-400">预估累计阅读量</div>
              <div className="text-xl font-bold text-slate-900 mt-1 font-mono">24.6k</div>
              <div className="text-[10px] text-slate-400 mt-0.5">平均完读率 68.4%</div>
            </div>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {(
                [
                  { id: 'ALL', label: '全部图文' },
                  { id: '已同步微信草稿箱', label: '已同步草稿箱' },
                  { id: '本地草稿', label: '本地草稿' },
                  { id: '待审核', label: '待审核' }
                ] as const
              ).map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0F4A47] text-white shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索主题、标题、关联产品或案例..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#0F4A47]"
              />
            </div>
          </div>

          {/* Graphic Text Articles Table (List Presentation Form) */}
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold bg-slate-50/60">
                    <th className="py-4 pl-6 pr-3 w-16">封面</th>
                    <th className="py-4 px-3 font-bold text-slate-900 min-w-[280px]">图文主题与标题</th>
                    <th className="py-4 px-3 font-bold text-slate-900 min-w-[180px]">关联产品</th>
                    <th className="py-4 px-3 font-bold text-slate-900 min-w-[160px]">关联项目案例</th>
                    <th className="py-4 px-3 font-bold text-slate-900 whitespace-nowrap">排版平台</th>
                    <th className="py-4 px-3 font-bold text-slate-900 whitespace-nowrap">同步状态</th>
                    <th className="py-4 px-3 font-bold text-slate-900 whitespace-nowrap">创建时间</th>
                    <th className="py-4 pr-6 pl-2 text-right font-bold text-slate-900 whitespace-nowrap">操作</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2.5">
                          <FileText className="w-9 h-9 text-slate-300" />
                          <p className="text-xs font-semibold text-slate-500">未检索到匹配的图文方案</p>
                          <button
                            onClick={handleStartCreate}
                            className="text-xs font-bold text-[#0F4A47] hover:underline cursor-pointer"
                          >
                            立即创建一篇新图文
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleViewArticleInStep3(item)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      >
                        {/* Thumbnail Cover */}
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </td>

                        {/* Title & Topic */}
                        <td className="py-3.5 px-3">
                          <div className="max-w-md">
                            <div className="text-[10px] text-emerald-800 font-bold tracking-tight">
                              主题: {item.topic}
                            </div>
                            <div className="font-bold text-slate-900 text-xs mt-0.5 line-clamp-1 group-hover:text-[#0F4A47] transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {item.summary}
                            </div>
                          </div>
                        </td>

                        {/* Linked Products */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {item.linkedProducts.map((prod, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {prod}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Linked Case */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 text-slate-800">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-medium truncate max-w-[150px]" title={item.linkedCase.name}>
                              {item.linkedCase.name}
                            </span>
                          </div>
                        </td>

                        {/* Platform */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.publishPlatform}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {item.status === '已同步微信草稿箱' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              已同步草稿箱
                            </span>
                          ) : item.status === '待审核' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              待审核
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              本地草稿
                            </span>
                          )}
                        </td>

                        {/* Created At */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                          {item.createdAt}
                        </td>

                        {/* Actions */}
                        <td
                          className="py-3.5 pr-6 pl-2 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenFullScreenPreview(item)}
                              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#0F4A47] text-[11px] font-bold transition-colors cursor-pointer border border-slate-200 hover:border-emerald-300 flex items-center gap-1"
                              title="全屏沉浸展示手机公众号预览效果"
                            >
                              <Maximize2 className="w-3 h-3 text-[#0F4A47]" />
                              <span>全屏展示</span>
                            </button>

                            <button
                              onClick={() => handleViewArticleInStep3(item)}
                              className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-[#0F4A47] text-[#0F4A47] hover:text-white text-[11px] font-bold transition-colors cursor-pointer border border-emerald-200 hover:border-[#0F4A47] flex items-center gap-1"
                              title="在手机模型框内预览并微调"
                            >
                              <Smartphone className="w-3 h-3" />
                              <span>微调与预览</span>
                            </button>

                            <button
                              onClick={() => {
                                const html = generateWeChatArticleHtml(item);
                                navigator.clipboard.writeText(html);
                                showToast('已复制该文章的微信富文本 HTML');
                              }}
                              className="p-1.5 rounded-full text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="复制 HTML"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleDeleteArticle(item.id, e)}
                              className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="删除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>共展示 {filteredArticles.length} 篇图文方案</span>
              <span className="text-[11px] text-slate-400">点击任意行可直接打开手机模型框进行排版微调与草稿同步</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW MODE 2: 三步走向导式设计 (Wizard Interactive Mode)     */}
      {/* ========================================================= */}
      {viewMode === 'wizard' && (
        <div className="flex-1 flex flex-col overflow-hidden space-y-4">
          {/* Top Wizard Navigation Header */}
          <div className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer border border-slate-200"
                title="返回图文列表"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>AI 图文装配向导</span>
                  <span className="text-xs font-normal text-slate-400">/ 微信公众号深度图文</span>
                </h2>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>遵循三步向导：定调 → AI 自动装配 → 微调与同步</span>
                </div>
              </div>
            </div>

            {/* 3-Step Wizard Indicator */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Step 1 Pill */}
              <div
                onClick={() => currentStep !== 2 && setCurrentStep(1)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentStep === 1
                    ? 'bg-[#0F4A47] text-white shadow-xs'
                    : currentStep > 1
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
                <span>第一步【定调】</span>
              </div>

              <div className="w-4 h-0.5 bg-slate-200" />

              {/* Step 2 Pill */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentStep === 2
                    ? 'bg-[#0F4A47] text-white shadow-xs animate-pulse'
                    : currentStep > 2
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400'
                }`}
                onClick={() => {
                  if (currentStep === 3) setCurrentStep(2);
                }}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
                <span>第二步【AI 自动装配中】</span>
              </div>

              <div className="w-4 h-0.5 bg-slate-200" />

              {/* Step 3 Pill */}
              <div
                onClick={() => {
                  if (activeEditingArticle.id) setCurrentStep(3);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentStep === 3
                    ? 'bg-[#0F4A47] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
                <span>第三步【微调与同步】</span>
              </div>
            </div>
          </div>

          {/* Step Content Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* ------------------------------------------------------------- */}
            {/* STEP 1: 【定调】                                               */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0F4A47]" />
                      <span>第一步【定调】：输入本期主题与关联资产</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      输入您的宣发主题，勾选关联的高定产品与实景工程案例，AI 将自动调取材质参数与工程施工规范。
                    </p>
                  </div>

                  {/* 1. 输入框：[ 本期主题，例如：2026现代极简橱柜设计趋势 ] */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[#EA3A20]">*</span>
                        <span>输入框：本期主题</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">例如：2026现代极简橱柜设计趋势</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="请输入本期主题，例如：2026现代极简橱柜设计趋势"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0F4A47] focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    {/* Quick preset chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400">快速填充主题灵感：</span>
                      {quickTopics.map((t, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTopicInput(t)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-[11px] text-slate-600 transition-colors cursor-pointer border border-slate-200"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. 下拉多选：[ 勾选关联产品：PET肤感板系列、吊滑极简门 ] */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="text-[#EA3A20]">*</span>
                        <span>下拉多选：勾选关联产品（已选 {selectedProductNames.length} 项）</span>
                      </label>
                      <span className="text-[11px] text-emerald-700 font-bold">
                        {selectedProductNames.join('、')}
                      </span>
                    </div>

                    {/* Multi-select Grid / Pills Dropdown Box */}
                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                      <div className="text-[11px] text-slate-500">
                        点击勾选需要融入文章深度解析的产品体系（系统将自动调入 BOM 规格与质检报告）：
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {AVAILABLE_PRODUCTS.map((prod) => {
                          const isSelected = selectedProductNames.includes(prod.name);
                          return (
                            <div
                              key={prod.id}
                              onClick={() => toggleProduct(prod.name)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-white border-[#0F4A47] shadow-2xs ring-1 ring-[#0F4A47]/20'
                                  : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="mt-0.5">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-[#0F4A47]" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <div className="space-y-0.5 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900">{prod.name}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                                    {prod.category}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                  {prod.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 3. 勾选案例：[ 迪拜精装公寓项目图 (共8张) ] */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="text-[#EA3A20]">*</span>
                        <span>勾选案例：绑定实际落地案例与现场实景组图</span>
                      </label>
                      <span className="text-[11px] text-slate-400">已选中的案例将自动提取实拍图与工程说明</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {AVAILABLE_CASES.map((c) => {
                        const isSelected = selectedCaseId === c.id;
                        return (
                          <div
                            key={c.id}
                            onClick={() => setSelectedCaseId(c.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3.5 ${
                              isSelected
                                ? 'bg-emerald-50/40 border-[#0F4A47] shadow-xs ring-1 ring-[#0F4A47]/30'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <img
                                src={c.cover}
                                alt={c.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">
                                {c.photoCount}张图
                              </span>
                            </div>

                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900">{c.name}</span>
                                {isSelected ? (
                                  <span className="w-4 h-4 rounded-full bg-[#0F4A47] text-white flex items-center justify-center text-[10px]">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="w-4 h-4 rounded-full border border-slate-300" />
                                )}
                              </div>
                              <div className="text-[10px] text-emerald-800 font-medium">{c.location}</div>
                              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                {c.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Visual Style Selector */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">公众号排版视觉风格：</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setThemeStyle('emerald')}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            themeStyle === 'emerald'
                              ? 'bg-[#0F4A47] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          🌿 墨绿高奢 (推荐)
                        </button>
                        <button
                          type="button"
                          onClick={() => setThemeStyle('dark')}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            themeStyle === 'dark'
                              ? 'bg-slate-900 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          ◼ 现代极简黑灰
                        </button>
                        <button
                          type="button"
                          onClick={() => setThemeStyle('warm')}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            themeStyle === 'warm'
                              ? 'bg-[#965A3E] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          🍂 暖调燕麦原木
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 点击按钮：[ 一键生成图文方案 ] */}
                  <div className="pt-4">
                    <button
                      onClick={handleTriggerAssembly}
                      className="w-full py-4 rounded-full bg-[#0F4A47] hover:bg-[#0c3937] text-white font-bold text-sm shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-5 h-5 text-emerald-300 animate-spin" />
                      <span>一键生成图文方案</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 2: 【AI 自动装配中】（耗时 15-20 秒）                      */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="max-w-3xl mx-auto space-y-6 py-6 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-6">
                  {/* Step 2 Header & Timer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#0F4A47] animate-pulse" />
                        <span>第二步【AI 自动装配中】</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        正在结合知识库、材质参数与落地案例组图进行装配，耗时约 15-20 秒
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-xs font-mono text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-[#0F4A47]" />
                        <span>耗时: 00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}</span>
                        <span className="text-slate-400">/ 预计 16 秒</span>
                      </div>

                      {/* Optional skip button */}
                      <button
                        onClick={handleFastSkipStep2}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="跳过剩余等待时间，直接查看生成结果"
                      >
                        ⚡ 极速跳过
                      </button>
                    </div>
                  </div>

                  {/* Main Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0F4A47] animate-ping" />
                        装配进度: {Math.round(assemblyProgress)}%
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {currentStageIdx === 3 && isAssemblyFinished
                          ? '✅ 装配完成，正在进入手机预览'
                          : assemblyStages[currentStageIdx].title}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-[#0F4A47] via-emerald-500 to-teal-400 rounded-full transition-all duration-300 shadow-xs"
                        style={{ width: `${Math.min(100, Math.max(2, assemblyProgress))}%` }}
                      />
                    </div>
                  </div>

                  {/* 4 Stages Sequence Cards:
                      正在检索材质参数... -> 正在组织文案大纲... -> 正在渲染公众号样式与封面... -> 合规质检完成 */}
                  <div className="space-y-3 pt-2">
                    {assemblyStages.map((stage, idx) => {
                      const isCompleted = assemblyProgress >= stage.threshold || (idx < currentStageIdx);
                      const isCurrent = currentStageIdx === idx && !isCompleted;
                      const isPending = !isCompleted && !isCurrent;

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                            isCompleted
                              ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                              : isCurrent
                              ? 'bg-white border-[#0F4A47] ring-1 ring-[#0F4A47]/20 shadow-xs'
                              : 'bg-slate-50/50 border-slate-100 text-slate-400'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                ✓
                              </div>
                            ) : isCurrent ? (
                              <div className="w-5 h-5 rounded-full bg-[#0F4A47] text-white flex items-center justify-center text-xs animate-spin">
                                ⚙
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
                                {idx + 1}
                              </div>
                            )}
                          </div>

                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`text-xs font-bold ${
                                  isCompleted
                                    ? 'text-emerald-950'
                                    : isCurrent
                                    ? 'text-slate-900 font-extrabold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {stage.title}
                              </h4>
                              <span className="text-[10px] font-mono font-medium text-slate-400">
                                阶段 0{idx + 1}/04
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed opacity-90">{stage.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Terminal / Live Assembly Log Console */}
                  <div className="bg-slate-900 rounded-2xl p-4 text-emerald-400 font-mono text-[11px] space-y-1.5 border border-slate-800 shadow-inner max-h-40 overflow-y-auto custom-scrollbar">
                    <div className="text-slate-500 border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>AI Assembly Log Stream</span>
                      <span className="text-emerald-500 animate-pulse">● LIVE</span>
                    </div>
                    {logs.map((line, i) => (
                      <div key={i} className="leading-relaxed">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 3: 【微调与同步】                                         */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-fade-in">
                {/* 2-Column Layout: Left = Smartphone Frame, Right = Fine-tune Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: 手机模型框内展示精美的公众号样式效果 (Col 1 to 6) */}
                  <div className="lg:col-span-6 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-2 px-2 text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-[#0F4A47]" />
                        <span>手机模型框：公众号排版效果渲染</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsFullScreenPreview(true)}
                          className="px-3 py-1 bg-white hover:bg-emerald-50 text-[#0F4A47] border border-emerald-300 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                          title="在页面全屏展示手机预览效果 (支持快捷键 Esc)"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-[#0F4A47] group-hover:scale-110 transition-transform" />
                          <span>全屏展示效果</span>
                        </button>
                        <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          实时联动渲染
                        </span>
                      </div>
                    </div>

                    {/* Smartphone Preview Component */}
                    <PhoneMockupArticle
                      article={{
                        ...activeEditingArticle,
                        title: editTitle || activeEditingArticle.title,
                        summary: editSummary || activeEditingArticle.summary,
                        themeStyle: themeStyle
                      }}
                      themeColor={themeStyle}
                      onToggleFullScreen={() => setIsFullScreenPreview(true)}
                    />
                  </div>

                  {/* Right Column: 微调编辑控制区 (Col 7 to 12) */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <Sliders className="w-4 h-4 text-[#0F4A47]" />
                            <span>第三步【微调】：文案与排版细节调整</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            修改内容将即时同步在左侧手机模型框中呈现
                          </p>
                        </div>
                      </div>

                      {/* Edit Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>微调文章大标题</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            字数：{(editTitle || activeEditingArticle.title).length}/40
                          </span>
                        </label>
                        <textarea
                          rows={2}
                          value={editTitle || activeEditingArticle.title}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0F4A47]"
                        />
                      </div>

                      {/* Edit Summary / Lead Quote */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>微调导读引言与金句</span>
                          <span className="text-[10px] text-slate-400 font-normal">公众号开头导读框</span>
                        </label>
                        <textarea
                          rows={3}
                          value={editSummary || activeEditingArticle.summary}
                          onChange={(e) => setEditSummary(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#0F4A47] leading-relaxed"
                        />
                      </div>

                      {/* Switch Visual Palette */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 block">切换排版视觉色标</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setThemeStyle('emerald')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              themeStyle === 'emerald'
                                ? 'bg-[#0F4A47] text-white shadow-2xs'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            🌿 墨绿高奢
                          </button>
                          <button
                            onClick={() => setThemeStyle('dark')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              themeStyle === 'dark'
                                ? 'bg-slate-900 text-white shadow-2xs'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            ◼ 极简黑白
                          </button>
                          <button
                            onClick={() => setThemeStyle('warm')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              themeStyle === 'warm'
                                ? 'bg-[#965A3E] text-white shadow-2xs'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            🍂 暖调燕麦
                          </button>
                        </div>
                      </div>

                      {/* Linked Assets Summary Card */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                        <div className="font-bold text-slate-800">已装配的工程资产信息</div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>
                            <span className="text-slate-400">关联产品：</span>
                            <span className="font-semibold text-slate-800">
                              {activeEditingArticle.linkedProducts.join(', ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">落地案例：</span>
                            <span className="font-semibold text-slate-800">
                              {activeEditingArticle.linkedCase.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">正文字数：</span>
                            <span className="font-semibold text-slate-800 font-mono">
                              {activeEditingArticle.wordCount} 字
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">合规审核：</span>
                            <span className="font-semibold text-emerald-700">质检 100% 通过</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick AI Polish Action Pills */}
                      <div className="pt-1">
                        <div className="text-[11px] text-slate-400 mb-1.5">一键 AI 语气润色：</div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => {
                              setEditTitle((prev) => `【工程实录】${prev.replace(/【.+?】/g, '')}`);
                              showToast('已增加【工程实录】高权威标题前缀');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            + 增加工程实录前缀
                          </button>
                          <button
                            onClick={() => {
                              setEditSummary(
                                (prev) =>
                                  `${prev} 本文附全套 CAD 节点大样与中东高温气候防变形质检报告。`
                              );
                              showToast('已在导读中强化技术资料交付背书');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            + 强化施工技术背书
                          </button>
                          <button
                            onClick={() => {
                              setThemeStyle('emerald');
                              showToast('已切换为高奢墨绿官方版式');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            恢复推荐排版配色
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* STEP 3 底部常驻操作栏 (Fixed Bottom Action Bar)               */}
          {/* [ 重新生成 ]、[ 复制 HTML ]、[ 一键同步至微信草稿箱 ]             */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 lg:px-12 py-3 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="返回第一步修改主题、关联产品与案例"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新生成</span>
                </button>

                <button
                  onClick={handleSaveAndReturnToList}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  保存并返回图文列表
                </button>
              </div>

              {/* Core Requested Action Buttons: [ 复制 HTML ]、[ 一键同步至微信草稿箱 ] */}
              <div className="flex items-center gap-3">
                {/* [ 全屏展示效果 ] */}
                <button
                  onClick={() => setIsFullScreenPreview(true)}
                  className="px-4 py-2.5 rounded-full border border-emerald-300 bg-white hover:bg-emerald-50 text-[#0F4A47] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  title="在页面全屏沉浸展示手机排版效果 (支持 ESC 键退出)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>全屏展示效果</span>
                </button>

                {/* [ 复制 HTML ] */}
                <button
                  onClick={handleCopyHtml}
                  className="px-5 py-2.5 rounded-full border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                  title="提取包含内联排版样式的公众号富文本 HTML"
                >
                  <FileCode className="w-4 h-4 text-emerald-700" />
                  <span>复制 HTML</span>
                </button>

                {/* [ 一键同步至微信草稿箱 ] */}
                <button
                  onClick={handleSyncToWeChatDrafts}
                  disabled={isSyncingWeChat}
                  className="px-6 py-2.5 rounded-full bg-[#0F4A47] hover:bg-[#0c3937] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
                  title="直接对接微信公众号开放平台草稿箱 API"
                >
                  {isSyncingWeChat ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>正在同步至微信草稿箱...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>一键同步至微信草稿箱</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 页面全屏沉浸式预览弹层 (Full-Screen Article Preview Modal)   */}
      {/* ========================================================= */}
      {isFullScreenPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col animate-fade-in select-none">
          {/* Top Fullscreen Control Bar */}
          <div className="h-16 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0 text-white shadow-lg">
            {/* Left: Article info badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-[#0F4A47] text-emerald-200 border border-emerald-600/40 flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                微
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold flex items-center gap-2">
                  <span className="text-white">微信公众号 · 全屏沉浸预览</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/90 border border-emerald-700/60 px-2 py-0.5 rounded-full font-mono">
                    实时联动
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-md">
                  {editTitle || activeEditingArticle.title}
                </p>
              </div>
            </div>

            {/* Center: Device Mode & Palette Switchers */}
            <div className="hidden md:flex items-center gap-3">
              {/* Display Mode Switcher (Phone vs Wide) */}
              <div className="flex items-center p-1 bg-slate-800/90 rounded-full border border-slate-700 text-xs">
                <button
                  onClick={() => setFullScreenDeviceMode('phone')}
                  className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    fullScreenDeviceMode === 'phone'
                      ? 'bg-[#0F4A47] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="iPhone 16 Pro 手机真机视口预览"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>手机模型 (380px)</span>
                </button>
                <button
                  onClick={() => setFullScreenDeviceMode('wide')}
                  className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    fullScreenDeviceMode === 'wide'
                      ? 'bg-[#0F4A47] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="宽屏大版展开阅读"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>大屏阅读 (720px)</span>
                </button>
              </div>

              {/* Theme Palette Switcher */}
              <div className="flex items-center p-1 bg-slate-800/90 rounded-full border border-slate-700 text-xs">
                <button
                  onClick={() => setThemeStyle('emerald')}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    themeStyle === 'emerald' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🌿 墨绿
                </button>
                <button
                  onClick={() => setThemeStyle('dark')}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    themeStyle === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ◼ 极简黑
                </button>
                <button
                  onClick={() => setThemeStyle('warm')}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    themeStyle === 'warm' ? 'bg-[#965A3E] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🍂 暖燕麦
                </button>
              </div>
            </div>

            {/* Right: Quick actions and Exit Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHtml}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                title="复制包含排版样式的公众号富文本 HTML"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>复制 HTML</span>
              </button>

              <button
                onClick={handleSyncToWeChatDrafts}
                disabled={isSyncingWeChat}
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0F4A47] hover:bg-[#0c3937] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                title="一键同步至微信草稿箱"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSyncingWeChat ? '同步中...' : '同步至草稿箱'}</span>
              </button>

              <button
                onClick={() => setIsFullScreenPreview(false)}
                className="px-3.5 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold border border-red-500/40 transition-all flex items-center gap-1.5 cursor-pointer ml-1"
                title="退出全屏预览 (或按键盘 ESC 键)"
              >
                <X className="w-4 h-4" />
                <span>退出全屏 (ESC)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Viewer Stage */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
            <PhoneMockupArticle
              article={{
                ...activeEditingArticle,
                title: editTitle || activeEditingArticle.title,
                summary: editSummary || activeEditingArticle.summary,
                themeStyle: themeStyle
              }}
              themeColor={themeStyle}
              isFullScreen={true}
              displayMode={fullScreenDeviceMode}
              onToggleFullScreen={() => setIsFullScreenPreview(false)}
            />
          </div>

          {/* Fullscreen Bottom Status Bar */}
          <div className="h-9 px-6 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>支持平滑鼠标滚轮 / 触摸拖动滑读完整文案、工法参数与案例高清图</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px]">
              <span>ESC / 点击右上角可随时退出全屏</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">HomeCraft WeChat Renderer</span>
            </div>
          </div>
        </div>
      )}

      {/* Sync Success Modal Popup */}
      {showSyncSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">已成功同步至微信草稿箱！</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Draft ID: {syncedDraftId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncSuccessModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">同步公众号账号：</span>
                <span className="font-bold text-slate-800">HomeCraft 高定家居 (官方服务号)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">图文标题：</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                  {editTitle || activeEditingArticle.title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">草稿箱状态：</span>
                <span className="text-emerald-700 font-bold">草稿已就绪，可随时推送/群发</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              您现在可在微信公众平台后台（mp.weixin.qq.com）草稿箱中查看并安排群发，也可以在移动端「公众平台助手」APP 中直接扫码预览。
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowSyncSuccessModal(false)}
                className="flex-1 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                继续编辑
              </button>
              <button
                onClick={() => {
                  setShowSyncSuccessModal(false);
                  setViewMode('list');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#0F4A47] hover:bg-[#0c3937] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                查看图文列表
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
