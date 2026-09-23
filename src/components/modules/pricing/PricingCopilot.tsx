import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  Send,
  UploadCloud,
  FileSpreadsheet,
  DollarSign,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Search,
  Lock,
  UserCheck,
  Building2,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Copy,
  BookOpen
} from 'lucide-react';
import { BOQPriceItem, ExchangeRateItem } from '../../../types';

export interface PricingChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  type?: 'text' | 'file_upload_success' | 'file_upload_rejected';
  fileMeta?: {
    fileName: string;
    fileSize: string;
    targetType: 'price' | 'exchange_rate';
    updatedCount: number;
    details: string[];
  };
}

interface PricingCopilotProps {
  priceItems: BOQPriceItem[];
  ratesList: Array<ExchangeRateItem & { docCell: string }>;
  onUpdatePriceItems: (newItems: BOQPriceItem[]) => void;
  onUpdateRatesList: (newRates: Array<ExchangeRateItem & { docCell: string }>) => void;
  onSelectTab: (tab: '面价' | '汇率') => void;
  activeTab: '面价' | '汇率';
  currentExchangeRate: number;
  onShowToast: (msg: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const PricingCopilot: React.FC<PricingCopilotProps> = ({
  priceItems,
  ratesList,
  onUpdatePriceItems,
  onUpdateRatesList,
  onSelectTab,
  activeTab,
  currentExchangeRate,
  onShowToast,
  isCollapsed = false,
  onToggleCollapse
}) => {
  // Demo Role Toggle: 'admin' | 'staff'
  const [userRole, setUserRole] = useState<'admin' | 'staff'>('admin');
  
  // Chat input
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadType, setPendingUploadType] = useState<'price' | 'exchange_rate' | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('已成功复制回答内容至剪贴板');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Chat message history
  const [messages, setMessages] = useState<PricingChatMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'ai',
      text: '您好！我是【面价与汇率智能专家助手】。已深度挂载企业定制部件面价库（共 42 项，全球统一以人民币 RMB 计价，支持 S级/G级 价格系数核算）与财务外汇结算牌价中枢（7 大主流币种）。\n\n📌 **面价体系说明**：\n- **全球统一面价 (RMB)**：全球统一出厂基准定价（以人民币计价）。\n- **S级客户价格系数**：标准折扣系数（如 0.90 / 9折）。\n- **G级客户价格系数**：战略大宗折扣系数（如 0.75 / 75折）。\n您可随时向我咨询任何定制部件的全球统一面价、S/G级核算价格或财务外汇牌价。',
      timestamp: '刚刚',
      type: 'text'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Quick prompt suggestions
  const quickPrompts = [
    { label: '爱格板全球面价与S/G级折扣', query: '爱格板柜体的全球统一面价是多少？S级和G级的价格系数与折后结算价是多少？' },
    { label: '百隆阻尼铰链S级与G级价格', query: '百隆铰链的全球统一面价与S级、G级系数价格分别是多少？' },
    { label: '美元与欧元结算汇率', query: '请问当前美金和欧元的基准汇率与最终核算结算汇率是多少？' },
    { label: '英镑锁汇与安全缓冲', query: '英镑当前锁定的汇率是多少？有加安全缓冲吗？' }
  ];

  // Handle send prompt
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isThinking) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: PricingChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const reply = generateAiReply(query);
      const aiMsg: PricingChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);

      if (reply.suggestedTab) {
        onSelectTab(reply.suggestedTab);
      }
    }, 600);
  };

  // Generate intelligent response based on current live data
  const generateAiReply = (query: string): { text: string; suggestedTab?: '面价' | '汇率' } => {
    const q = query.toLowerCase();

    // 1. Check for exchange rate queries
    if (
      q.includes('汇率') ||
      q.includes('美金') ||
      q.includes('美元') ||
      q.includes('usd') ||
      q.includes('欧元') ||
      q.includes('eur') ||
      q.includes('英镑') ||
      q.includes('gbp') ||
      q.includes('澳元') ||
      q.includes('aud') ||
      q.includes('加币') ||
      q.includes('cad') ||
      q.includes('迪拉姆') ||
      q.includes('aed') ||
      q.includes('锁汇')
    ) {
      const usdItem = ratesList.find((r) => r.currencyCode === 'USD');
      const eurItem = ratesList.find((r) => r.currencyCode === 'EUR');
      const gbpItem = ratesList.find((r) => r.currencyCode === 'GBP');
      const audItem = ratesList.find((r) => r.currencyCode === 'AUD');

      if (q.includes('英镑') || q.includes('gbp')) {
        const item = gbpItem || ratesList[2];
        return {
          text: `💱 **英镑 (GBP) 财务结算汇率查询结果**：\n- **文档基准汇率**：1 GBP = ${item.systemRate.toFixed(4)} CNY\n- **安全缓冲比**：+${item.bufferPercent}%（锁汇政策防波动）\n- **最终核算结算汇率**：**${item.settlementRate.toFixed(4)}** CNY\n- **状态**：${item.status}，每日自动同步：${item.autoSync ? '已开启' : '关闭'}\n- **核算应用**：英国及英联邦工程大单报价均严格依据此汇率锁定生产周期原材料成本。`,
          suggestedTab: '汇率'
        };
      }

      if (q.includes('澳元') || q.includes('aud')) {
        const item = audItem || ratesList[3];
        return {
          text: `💱 **澳元 (AUD) 财务结算汇率查询结果**：\n- **文档基准汇率**：1 AUD = ${item.systemRate.toFixed(4)} CNY\n- **安全缓冲比**：+${item.bufferPercent}%\n- **最终核算结算汇率**：**${item.settlementRate.toFixed(4)}** CNY\n- **状态**：${item.status}，每日自动同步：${item.autoSync ? '已开启' : '关闭'}\n- 提示：澳洲海运专线报价已自动匹配该结算汇率。`,
          suggestedTab: '汇率'
        };
      }

      return {
        text: `💱 **外币即时结算汇率速览 (从财务指定文档同步)**：\n1. **美元 (USD)**：基准汇率 **${usdItem ? usdItem.systemRate.toFixed(4) : currentExchangeRate.toFixed(2)}** CNY | 结算汇率 **${usdItem ? usdItem.settlementRate.toFixed(4) : (currentExchangeRate * 1.01).toFixed(4)}** CNY (缓冲 +1.0%)\n2. **欧元 (EUR)**：基准汇率 **${eurItem ? eurItem.systemRate.toFixed(4) : '7.8500'}** CNY | 结算汇率 **${eurItem ? eurItem.settlementRate.toFixed(4) : '7.9442'}** CNY (缓冲 +1.2%)\n3. **英镑 (GBP)**：基准汇率 **${gbpItem ? gbpItem.systemRate.toFixed(4) : '9.1800'}** CNY | 结算汇率 **${gbpItem ? gbpItem.settlementRate.toFixed(4) : '9.3177'}** CNY (缓冲 +1.5%)\n\n📌 **应用说明**：全系统销售助手与报价单自动采用【最终核算结算汇率】进行 FOB/CIF 美金折算，已为您切换至右侧【汇率】选项卡查看全部 7 个结算币种。`,
        suggestedTab: '汇率'
      };
    }

    // 2. Check for material price queries
    if (
      q.includes('爱格') ||
      q.includes('柜体') ||
      q.includes('门板') ||
      q.includes('铰链') ||
      q.includes('百隆') ||
      q.includes('五金') ||
      q.includes('拉篮') ||
      q.includes('台面') ||
      q.includes('烤漆') ||
      q.includes('价格') ||
      q.includes('面价') ||
      q.includes('系数') ||
      q.includes('s级') ||
      q.includes('g级') ||
      q.includes('单价')
    ) {
      // Find matching items from priceItems
      const matched = priceItems.filter((p) => {
        const fullStr = (p.name + p.category + p.spec + p.code).toLowerCase();
        if (q.includes('爱格') && fullStr.includes('爱格')) return true;
        if (q.includes('百隆') && fullStr.includes('百隆')) return true;
        if (q.includes('铰链') && fullStr.includes('铰链')) return true;
        if (q.includes('门板') && fullStr.includes('门板')) return true;
        if (q.includes('台面') && fullStr.includes('台面')) return true;
        if (q.includes('烤漆') && fullStr.includes('烤漆')) return true;
        return false;
      });

      if (matched.length > 0) {
        const top3 = matched.slice(0, 3);
        const listDesc = top3
          .map((item, i) => {
            const unifiedPrice = item.unifiedPriceRMB ?? item.basePriceRMB;
            const sFactorRange = item.sGradeFactorRange
              ? `${item.sGradeFactorRange[0].toFixed(2)} ~ ${item.sGradeFactorRange[1].toFixed(2)}`
              : item.sGradeFactorMin && item.sGradeFactorMax
              ? `${item.sGradeFactorMin.toFixed(2)} ~ ${item.sGradeFactorMax.toFixed(2)}`
              : '0.85 ~ 0.92';
            const gFactorRange = item.gGradeFactorRange
              ? `${item.gGradeFactorRange[0].toFixed(2)} ~ ${item.gGradeFactorRange[1].toFixed(2)}`
              : item.gGradeFactorMin && item.gGradeFactorMax
              ? `${item.gGradeFactorMin.toFixed(2)} ~ ${item.gGradeFactorMax.toFixed(2)}`
              : '0.70 ~ 0.80';

            return `${i + 1}. **${item.name}** (${item.code})\n   - 规格/环保：${item.spec}\n   - **🌐 全球统一价格**：**¥${unifiedPrice.toFixed(2)} RMB / ${item.unit}**\n   - **⭐ S级价格系数范围**：\`${sFactorRange}\` (标准签约渠道授权区间)\n   - **💎 G级价格系数范围**：\`${gFactorRange}\` (战略大宗集采特批区间)\n   - 定额损耗率：${item.wasteRatePercent}%\n   - BOQ核算公式：\`${item.formulaDesc}\``;
          })
          .join('\n\n');

        return {
          text: `📋 **根据企业最新面价定额库，为您查询到以下【全球统一价格 (RMB)】及 S级/G级价格系数范围**：\n\n${listDesc}\n\n💡 **价格体系与系数说明**：\n- **全球统一价格**：所有市场统一的人民币基准价格；\n- **S级价格系数范围**：标准渠道/签约客户执行系数区间 (例如 \`0.85 ~ 0.92\`，即 85折 ~ 92折)；\n- **G级价格系数范围**：战略大客户/大宗集采执行系数区间 (例如 \`0.70 ~ 0.80\`，即 70折 ~ 80折)。`,
          suggestedTab: '面价'
        };
      }
    }

    // Default fallback helpful response
    return {
      text: `🤖 **面价与汇率查询助手为您解答**：\n\n根据系统最新定额库配置：\n- **计价体系**：全球统一面价（**人民币 RMB 计价**），支持 **S级** 与 **G级** 价格系数差异化核算结算\n- **当前有效物料定额**：共收录 **${priceItems.length}** 项标准定制部件\n- **财务外汇中枢**：挂载 **${ratesList.length}** 个主流币种实时牌价与安全锁汇系数\n\n您可直接提问，例如：\n- *“爱格板 W980 柜身板全球统一面价和S级/G级折后价是多少？”*\n- *“百隆顶配阻尼铰链的S级和G级价格系数分别是多少？”*\n- *“当前美元和欧元的结算汇率是多少？”*\n\n${userRole === 'admin' ? '✨ 您是管理员角色，也可以直接点击下方按钮上传最新的面价或汇率 Excel 表格进行一键同步覆盖。' : '🔒 提示：您当前为普通员工，已开启快速单价与多币种即时查询通道。'}`,
      suggestedTab: activeTab
    };
  };

  // Trigger file upload
  const handleTriggerUpload = (type: 'price' | 'exchange_rate') => {
    if (userRole !== 'admin') {
      onShowToast('⚠️ 操作受限：普通员工无权上传或覆盖面价与汇率文件，请联系管理员！');
      const rejectedMsg: PricingChatMessage = {
        id: `rej-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ **权限拦截提示**：您当前登录为【普通员工】权限，系统已锁定面价与汇率官方数据源更新通道。您仅可在此进行价格查询与汇率折算咨询。如需更新数据，请切换为超级管理员身份。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'file_upload_rejected'
      };
      setMessages((prev) => [...prev, rejectedMsg]);
      return;
    }

    setPendingUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Execute simulated file update
  const executeUploadUpdate = (type: 'price' | 'exchange_rate', fileName: string, fileSize: string) => {
    setIsThinking(true);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 1: User upload message
    const userMsg: PricingChatMessage = {
      id: `upload-${Date.now()}`,
      sender: 'user',
      text: `[上传文件] ${fileName} (${fileSize})`,
      timestamp: timeStr
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setIsThinking(false);

      if (type === 'price') {
        // Update price items: slightly bump or refresh items to show real change
        const updated = priceItems.map((item, idx) => {
          if (idx < 4) {
            const newPrice = +( (item.unifiedPriceRMB ?? item.basePriceRMB) * 1.02 ).toFixed(2);
            const sFactor = item.sGradeFactor ?? 0.90;
            const gFactor = item.gGradeFactor ?? 0.75;
            const newSPrice = +(newPrice * sFactor).toFixed(2);
            const newGPrice = +(newPrice * gFactor).toFixed(2);
            return {
              ...item,
              unifiedPriceRMB: newPrice,
              basePriceRMB: newPrice,
              sGradeFactor: sFactor,
              sGradePriceRMB: newSPrice,
              gGradeFactor: gFactor,
              gGradePriceRMB: newGPrice,
              domesticPriceRMB: newPrice,
              overseasPriceRMB: newSPrice,
              updatedAt: new Date().toLocaleDateString('zh-CN').replace(/\//g, '-') + ' ' + new Date().toLocaleTimeString()
            };
          }
          return item;
        });

        onUpdatePriceItems(updated);
        onSelectTab('面价');
        onShowToast(`已成功通过 AI 解析《${fileName}》，并自动更新 4 项产品的全球统一面价与S/G级系数！`);

        const aiSuccessMsg: PricingChatMessage = {
          id: `success-${Date.now()}`,
          sender: 'ai',
          text: `🎉 **面价文件智能解析并更新成功！**\n\nAI 已完成对《${fileName}》的字段映射与数值校验：\n- **有效字段**：物料编码、部件名称、规格、全球统一面价(RMB)、S级价格系数(0.90)、G级价格系数(0.75)、损耗率\n- **更新状态**：已自动将最新的 **4 项** 部件单价同步更新入库，右侧【面价列表】已实时呈现最新生效数值。\n- **生效时间**：${new Date().toLocaleString()}\n- **审计日志**：已记录管理员操作记录并通知销售助手智能体。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'file_upload_success',
          fileMeta: {
            fileName,
            fileSize,
            targetType: 'price',
            updatedCount: 4,
            details: [
              'BOQ-CAB-001 爱格板标准柜身板 (18mm) 全球统一面价与S/G级系数同步更新',
              'BOQ-CAB-002 桉木多层实木防潮板全球面价更新',
              'BOQ-DOOR-001 PET肤感柜门单价与系数校准',
              'BOQ-HARD-001 百隆Blum快装阻尼铰链更新全球面价'
            ]
          }
        };
        setMessages((prev) => [...prev, aiSuccessMsg]);
      } else {
        // Update exchange rates
        const nowFormatted = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-') + ' ' + new Date().toLocaleTimeString();
        const updatedRates = ratesList.map((r) => {
          if (r.currencyCode === 'USD') {
            const newSys = 7.22;
            return {
              ...r,
              systemRate: newSys,
              settlementRate: +(newSys * 1.01).toFixed(4),
              lastUpdated: nowFormatted
            };
          }
          if (r.currencyCode === 'EUR') {
            const newSys = 7.88;
            return {
              ...r,
              systemRate: newSys,
              settlementRate: +(newSys * 1.012).toFixed(4),
              lastUpdated: nowFormatted
            };
          }
          return {
            ...r,
            lastUpdated: nowFormatted
          };
        });

        onUpdateRatesList(updatedRates);
        onSelectTab('汇率');
        onShowToast(`已成功通过 AI 解析《${fileName}》，并自动更新美元与欧元结算汇率！`);

        const aiSuccessMsg: PricingChatMessage = {
          id: `success-${Date.now()}`,
          sender: 'ai',
          text: `🎉 **多币种汇率文件解析并更新成功！**\n\nAI 已读取财务中心发布的最新外汇牌价表：\n- **更新币种**：美元 (USD 7.2200)、欧元 (EUR 7.8800)\n- **安全缓冲模型**：自动重新计算最终核算结算汇率\n- **右侧联动**：右侧【汇率列表】已完成刷新，全系统 BOQ 自动折算即刻生效。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'file_upload_success',
          fileMeta: {
            fileName,
            fileSize,
            targetType: 'exchange_rate',
            updatedCount: 2,
            details: [
              '美元 USD: 基准汇率更新为 7.2200 CNY，结算汇率 7.2922 CNY',
              '欧元 EUR: 基准汇率更新为 7.8800 CNY，结算汇率 7.9746 CNY',
              '全系统 BOQ 报价单汇率自动按新标准折算'
            ]
          }
        };
        setMessages((prev) => [...prev, aiSuccessMsg]);
      }
    }, 1200);
  };

  // Handle actual file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileSize = `${(file.size / 1024).toFixed(1)} KB`;
    const type = pendingUploadType || (fileName.includes('汇率') || fileName.includes('rate') ? 'exchange_rate' : 'price');

    executeUploadUpdate(type, fileName, fileSize);
  };

  // Preset demo fast-update buttons for convenience in presentations
  const handleQuickUploadPreset = (type: 'price' | 'exchange_rate') => {
    if (userRole !== 'admin') {
      handleTriggerUpload(type);
      return;
    }

    if (type === 'price') {
      executeUploadUpdate('price', '品爱全屋定制2026年Q3出厂面价调整明细表.xlsx', '186.4 KB');
    } else {
      executeUploadUpdate('exchange_rate', '集团财务中心2026年9月第3周多币种牌价表.xlsx', '94.2 KB');
    }
  };

  // Collapsed Sidebar View (completely hidden when collapsed)
  if (isCollapsed) {
    return null;
  }

  return (
    <div 
      id="pricing-copilot-expanded-panel"
      className="w-[380px] xl:w-[410px] shrink-0 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-full overflow-hidden select-none transition-all duration-300"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />

      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EA3A20] to-[#ff6b4a] text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">面价汇率 AI 智能助手</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400">智能问答 • 文件变动自动更新</p>
            </div>
          </div>

          {/* Role Switcher Pill for Demo */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/70 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setUserRole('admin');
                onShowToast('已切换当前演示角色为：👑 管理员 (拥有上传更新权限)');
              }}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                userRole === 'admin'
                  ? 'bg-white text-[#EA3A20] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="切换为管理员：拥有上传面价/汇率文件更新权限"
            >
              <span>👑 管理员</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserRole('staff');
                onShowToast('已切换当前演示角色为：👤 普通员工 (仅限问答查询)');
              }}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                userRole === 'staff'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="切换为普通员工：只读问答，禁止上传文件"
            >
              <span>👤 普通员工</span>
            </button>
          </div>
        </div>

        {/* Permission status pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px]">
          <div className="flex items-center gap-1.5">
            {userRole === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-700 font-medium">当前权限：<strong className="text-emerald-700">管理级读写</strong>（支持上传解析入库）</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-slate-700 font-medium">当前权限：<strong className="text-amber-700">员工级查询</strong>（仅开放对话咨询）</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">BOM v2.6</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Assistant Avatar */}
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#EA3A20] to-[#ff6b4a] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Message Content & Metadata */}
              <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-1.5 px-1 text-[10px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span className="font-bold text-slate-700">
                    {isUser ? (userRole === 'admin' ? '我 (管理员)' : '我 (员工)') : '面价汇率助手'}
                  </span>
                  <span>•</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#EA3A20] text-white rounded-tr-xs font-normal shadow-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {/* File upload success card */}
                  {msg.type === 'file_upload_success' && msg.fileMeta ? (
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            已自动更新至右侧【{msg.fileMeta.targetType === 'price' ? '面价' : '汇率'}】列表
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                            <span className="font-mono">{msg.fileMeta.fileName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Details pill */}
                      <div className="bg-white p-2 rounded-xl border border-slate-200/70 space-y-1">
                        <div className="text-[10px] font-bold text-slate-600">更新详情摘要：</div>
                        {msg.fileMeta.details.map((d, idx) => (
                          <div key={idx} className="text-[10px] text-slate-600 flex items-start gap-1">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectTab(msg.fileMeta?.targetType === 'price' ? '面价' : '汇率')}
                        className="w-full py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>立即在右侧查看【{msg.fileMeta.targetType === 'price' ? '面价' : '汇率'}】</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : msg.type === 'file_upload_rejected' ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>无上传权限</span>
                      </div>
                      <p className="text-slate-700">{msg.text}</p>
                    </div>
                  ) : isUser ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <div className="text-xs leading-relaxed [&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2 [&>strong]:font-bold [&>a]:text-indigo-600 [&>a]:underline">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Assistant message copy action */}
                {!isUser && msg.type !== 'file_upload_success' && (
                  <div className="flex items-center justify-end px-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                      title="复制回答内容"
                    >
                      {copiedId === msg.id ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          已复制
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Copy className="w-2.5 h-2.5" />
                          复制
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 mt-0.5 font-bold text-xs">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#EA3A20] to-[#ff6b4a] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3 shadow-2xs flex items-center gap-2 text-xs text-slate-600 font-medium">
              <div className="w-3.5 h-3.5 border-2 border-[#EA3A20] border-t-transparent rounded-full animate-spin" />
              <span>AI 正在查询计算或解析文件中...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 pt-2 pb-1 border-t border-slate-100 bg-slate-50/50">
        <div className="text-[10px] text-slate-400 font-medium mb-1.5 flex items-center justify-between">
          <span>快捷咨询推荐</span>
          <span>点击快速提问</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p.query)}
              className="text-[10px] px-2 py-1 rounded-md bg-white border border-slate-200/80 text-slate-600 hover:text-[#EA3A20] hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer truncate max-w-[180px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Quick Upload Actions */}
      <div className="p-3 border-t border-slate-100 bg-white space-y-2">
        {userRole === 'admin' ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <UploadCloud className="w-3 h-3 text-[#EA3A20]" />
                <span>管理员专属：更新数据源</span>
              </span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                自动解析更新列表
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickUploadPreset('price')}
                className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-red-50/60 border border-slate-200/90 hover:border-red-200 text-slate-700 hover:text-[#EA3A20] text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="上传或同步最新面价文件，自动更新右侧面价列表"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#EA3A20]" />
                <span>上传面价文件</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickUploadPreset('exchange_rate')}
                className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-red-50/60 border border-slate-200/90 hover:border-red-200 text-slate-700 hover:text-[#EA3A20] text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="上传或同步最新汇率文件，自动更新右侧汇率列表"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>上传汇率文件</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 flex items-center gap-2 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>普通员工无权上传更新文件，仅支持价格与汇率咨询</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={userRole === 'admin' ? "问国内/国外价、查汇率，或说'帮我更新面价'..." : "咨询任何产品国内/国外人民币单价、工艺加价或外汇结算牌价..."}
              className="w-full h-9 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#EA3A20] focus:ring-1 focus:ring-red-200 transition-all"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isThinking}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              inputText.trim() && !isThinking
                ? 'bg-[#EA3A20] text-white hover:bg-[#d6341c] shadow-xs'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
