import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code2,
  RefreshCw,
  Terminal,
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';
import { AgentSkill } from '../../../types';

interface SkillSandboxModalProps {
  skill: AgentSkill | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SkillSandboxModal: React.FC<SkillSandboxModalProps> = ({ skill, isOpen, onClose }) => {
  if (!isOpen || !skill) return null;

  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: 'success' | 'error';
    latencyMs: number;
    response: any;
  } | null>(null);

  // Generate sensible sample input based on skill code
  const getDefaultPayload = (code: string) => {
    switch (code) {
      case 'drawing_boq_parser':
      case 'cad_drawing_analyzer':
        return JSON.stringify(
          {
            fileType: 'DWG',
            fileUrl: 'https://oss.homecraft.com/drawings/Villa_Kitchen_Wardrobes_Master_Elevation.dwg',
            extractLayers: ['CABINET_PROFILE', 'HARDWARE_HINGES', 'DIMENSION_TOLERANCES', 'PLINTH_LINE'],
            targetUnit: 'mm',
            detectTolerances: true
          },
          null,
          2
        );
      case 'chat_stream_sync':
        return JSON.stringify(
          {
            channel: 'wordpress',
            senderId: '+1 (415) 890-2194',
            recipientSession: 'SESSION-WHATSAPP-NA-8092',
            streamChunk: 'We can definitely provide CARB P2 certified plywood with PUR laser edge banding for your project.',
            isCompleted: false,
            simulateTypingCps: 35
          },
          null,
          2
        );
      case 'customer_tagging_enum':
        return JSON.stringify(
          {
            dialogueTurns: [
              { speaker: 'buyer', text: 'Hi, I am Marcus Vance from Vance Studio Architectural Design in London.' },
              { speaker: 'buyer', text: 'We are working on a 12-unit luxury townhouse development in Chelsea. Need bespoke kitchen millwork and flush interior doors.' },
              { speaker: 'buyer', text: 'Targeting completion by Q1 2027. Budget around 180,000 GBP.' }
            ],
            existingTags: ['区域: 英国/欧洲']
          },
          null,
          2
        );
      case 'hybrid_rag_search':
        return JSON.stringify(
          {
            query: '英国工程别墅木饰面 BS 5852 防火阻燃要求以及甲醛释放量最高限量标准',
            topK: 5,
            denseWeight: 0.7,
            categoryFilter: '全屋五金与工艺标准 / 环保认证'
          },
          null,
          2
        );
      case 'quotation_calculation':
      case 'boq_price_estimator':
        return JSON.stringify(
          {
            projectName: 'Chelsea Townhouses Bespoke Kitchen Millwork (12 Units)',
            targetMarginPercent: 26.5,
            currency: 'USD',
            exchangeRate: 7.20,
            boqItems: [
              { category: '厨房地柜 (延米)', spec: 'E0多层实木+爱格抗指纹饰面', quantity: 48.0, unitCostCNY: 1850 },
              { category: '通顶高柜 (展开㎡)', spec: 'PET肤感门板+百隆隐形拉直器', quantity: 240.0, unitCostCNY: 420 },
              { category: '基础五金 (套)', spec: 'Blum Clip-Top 阻尼快装铰链', quantity: 180, unitCostCNY: 23.0 }
            ],
            packaging: 'ISPM 15 出口免熏蒸九脚胶合板箱'
          },
          null,
          2
        );
      case 'commercial_document_gen':
      case 'multilingual_email_drafter':
        return JSON.stringify(
          {
            docType: 'PI',
            contractNo: 'HC-2026-UK-099',
            buyerInfo: {
              company: 'Vance Studio Architectural Ltd',
              contact: 'Mr. Marcus Vance',
              address: 'Chelsea Harbour, London SW10 0XF, United Kingdom'
            },
            paymentTerms: '30% T/T Advance Deposit, 70% Balance before Container Loading',
            deliveryTerm: 'FOB Shenzhen Yantian',
            validityDays: 20
          },
          null,
          2
        );
      case 'compliance_regex_guardrail':
      case 'compliance_spec_verifier':
        return JSON.stringify(
          {
            contentToScan: 'Our factory internal raw cost is 12,500 USD, with 25% margin, and we can deliver 3 containers in 7 days with zero millimeter tolerance.',
            destinationMarket: 'UK / Europe (BS 5852 & CE EN 717-1)',
            declaredMaterials: ['Plywood E0', 'Solid Oak Veneer', 'PUR Laser Edge Banding'],
            scanCostMasking: true
          },
          null,
          2
        );
      case 'quote_lifecycle_tracker':
        return JSON.stringify(
          {
            quoteId: 'QT-2026-NA-0412',
            createdDate: '2026-08-20',
            lockedExchangeRate: 7.15,
            currentMarketExchangeRate: 7.236,
            validityDays: 20,
            clientViewStatus: 'READ_THREE_TIMES'
          },
          null,
          2
        );
      case 'knowledge_review_publish':
        return JSON.stringify(
          {
            articleId: 'KB-ENG-UK-FIRE-05',
            title: '英国独栋豪宅 BS 5852 软包阻燃与 PUR 激光封边验收标准',
            targetVersion: 'v2.1.0',
            reviewedBy: 'Sophia Wang (关务与合规主管)',
            reviewAction: 'APPROVE',
            diffSummary: '修正 BS 5852 阻燃标准附带测试编号为 UKAS-1029，补充背板环保免熏蒸声明'
          },
          null,
          2
        );
      case 'cbm_container_calculator':
        return JSON.stringify(
          {
            containerType: '40HQ',
            items: [
              { name: '意式全真皮三人家居沙发 SL-802', l_cm: 220, w_cm: 95, h_cm: 78, qty: 25, unitWeightKg: 65 },
              { name: '轻奢岩板餐桌 DT-104', l_cm: 180, w_cm: 90, h_cm: 76, qty: 15, unitWeightKg: 85 },
              { name: '北欧实木餐椅 DC-05', l_cm: 55, w_cm: 52, h_cm: 82, qty: 60, unitWeightKg: 8.5 }
            ]
          },
          null,
          2
        );
      default:
        return JSON.stringify({ testInput: 'Sample query data', timestamp: new Date().toISOString() }, null, 2);
    }
  };

  const [inputPayload, setInputPayload] = useState(() => getDefaultPayload(skill.code));

  const handleRunTest = () => {
    setIsRunning(true);
    setExecutionResult(null);

    setTimeout(() => {
      setIsRunning(false);
      // Generate simulated mock output based on skill
      let resultData: any = {};
      switch (skill.code) {
        case 'drawing_boq_parser':
        case 'cad_drawing_analyzer':
          resultData = {
            status: 'PARSED_SUCCESS',
            drawingFile: 'Villa_Kitchen_Wardrobes_Master_Elevation.dwg',
            totalCabinetUnits: 14,
            extractedDimensions: {
              totalLengthMm: 7800,
              standardHeightMm: 2750,
              depthMm: 600,
              plinthClearanceMm: 80
            },
            detectedHardware: {
              hingeBoreHoles: 48,
              drawerSlidePairs: 18,
              liftSystems: 4
            },
            doorGapTolerance: '2.0 mm (符合 DIN 68861 国际柜体间隙标准)',
            detectedAnomalies: ['检测到梁下净空预留 150mm，建议加装可调节顶部封边饰面板']
          };
          break;
        case 'chat_stream_sync':
          resultData = {
            status: 'STREAM_CONNECTED',
            channel: 'WordPress Business API Gateway',
            sessionLatencyMs: 38,
            framesTransferred: 6,
            typingStatus: 'TYPING_SIMULATED',
            ackTimestamp: new Date().toISOString(),
            clientHandshake: 'TLSv1.3 AES-256 OK'
          };
          break;
        case 'customer_tagging_enum':
          resultData = {
            status: 'TAGGED',
            detectedBuyerType: '英国中高端室内设计事务所 (Architectural Design Studio)',
            inferredBudgetTier: 'Tier-A 高净值工程定制 (预算 > 150,000 GBP)',
            projectScope: '12-Unit Townhouse Kitchen & Flush Doors',
            assignedTags: [
              '买家身份: 设计事务所',
              '目标区域: 英国/西欧',
              '预算层级: 高奢工程级',
              '核心偏好: 爱格饰面 + Blum五金',
              '项目周期: 2027-Q1交工',
              '跟进优先级: P0 (战略大客户)'
            ],
            confidence: 0.985
          };
          break;
        case 'hybrid_rag_search':
          resultData = {
            status: 'SEARCH_COMPLETED',
            totalRetrieved: 4,
            topRankedChunks: [
              {
                chunkId: 'KB-CHUNK-UK-BS5852-01',
                title: '英标 BS 5852 家具软包与木饰面耐燃阻燃试验等级',
                relevanceScore: 0.942,
                snippet: '出口英国商用及民用家具必须通过 BS 5852: Part 1 (Crib 5) 阻燃要求，内衬海绵密度需 ≥ 30kg/m³ 并附带防火标签...'
              },
              {
                chunkId: 'KB-CHUNK-EU-EN717-E0',
                title: '欧洲标准 EN 717-1 舱室法甲醛释放限量',
                relevanceScore: 0.895,
                snippet: '全线柜体板材执行 E0 级限量 (≤ 0.05 mg/m³)，完全符合欧洲建材 CPR 与 REACH 规范...'
              }
            ],
            rerankLatencyMs: 42
          };
          break;
        case 'quotation_calculation':
        case 'boq_price_estimator':
          resultData = {
            status: 'PRICED_ACCURATE',
            rawMaterialCostRMB: 198500.0,
            hardwareAndAccessoriesRMB: 32400.0,
            packagingAndInlandFobRMB: 14800.0,
            targetMargin: '26.5%',
            totalFobUSD: 46250.0,
            exchangeRateApplied: 7.20,
            unitPricePerSqmUSD: 142.8,
            cbmVolumeTotal: 49.6,
            containerPlan: '1*40HQ (容积利用率 72.9%, 建议搭配整箱发运)',
            priceLockValidUntil: '2026-09-27 (锁价20天)'
          };
          break;
        case 'commercial_document_gen':
        case 'multilingual_email_drafter':
          resultData = {
            status: 'DOC_GENERATED',
            documentNo: 'PI-20260907-UK099',
            docType: 'Proforma Invoice (PI)',
            buyerEntity: 'Vance Studio Architectural Ltd (London, UK)',
            totalAmountUSD: '$46,250.00',
            depositRequiredUSD: '$13,875.00 (30% T/T)',
            pdfDownloadUrl: 'https://oss.homecraft.com/docs/PI_HC-2026-UK-099_VanceStudio.pdf',
            securityWatermark: 'HOMECRAFT BESPOKE - CONFIDENTIAL FOR VANCE STUDIO',
            signatureStatus: 'SEALED_WITH_DIGITAL_STAMP'
          };
          break;
        case 'compliance_regex_guardrail':
        case 'compliance_spec_verifier':
          resultData = {
            status: 'SCANNED',
            passed: false,
            actionTaken: 'BLOCKED_AND_SANITIZED',
            interceptedViolations: [
              '拦截到敏感内部底价词汇: "raw cost is 12,500 USD" -> 已自动执行成本脱敏掩码',
              '拦截到极端公差承诺: "zero millimeter tolerance" -> 已纠偏为 "±1.5mm standard cabinet clearance"',
              '拦截到虚假交期: "7 days" -> 已修正为 "Standard bespoke production cycle 35-42 days"'
            ],
            sanitizedPreviewText: 'Our FOB quote is competitive, and our production lead time is 35-42 days with ±1.5mm precision craftsmanship.',
            riskLevel: 'INTERCEPTED_AND_FIXED'
          };
          break;
        case 'quote_lifecycle_tracker':
          resultData = {
            status: 'TRACKING_ACTIVE',
            quoteId: 'QT-2026-NA-0412',
            daysRemaining: 7,
            isExpired: false,
            fxVariance: '+1.20% (暂未突破 2.5% 重算红线)',
            clientEngagement: '海外买家已于今日 14:20 再次查阅报价单',
            actionSuggestion: '距离锁价到期还有 7 天，建议销售员发起限时定金排产追单'
          };
          break;
        case 'knowledge_review_publish':
          resultData = {
            status: 'PUBLISHED_HOT_RELOAD',
            articleId: 'KB-ENG-UK-FIRE-05',
            approvedVersion: 'v2.1.0',
            reviewer: 'Sophia Wang (关务与合规主管)',
            vectorChunksRebuilt: 8,
            effectiveStatus: 'ONLINE_ACTIVE',
            publishedTimestamp: new Date().toISOString()
          };
          break;
        case 'cbm_container_calculator':
          resultData = {
            status: 'COMPUTED',
            container: '40HQ (标称容积 68 CBM, 限重 26,000 kg)',
            itemsCalculated: 3,
            totalGrossCBM: 48.65,
            totalGrossWeightKg: 19850,
            containerVolumeUtilization: '71.54%',
            containerWeightUtilization: '76.35%',
            remainingAvailableCBM: 19.35,
            safeLoadingRecommendation: '建议还可以搭配装载约 40 张平放打包的轻型餐椅或软包脚踏以最大化摊薄单件海运费。'
          };
          break;
        default:
          resultData = { success: true, message: 'Skill executed cleanly without errors.' };
      }

      setExecutionResult({
        status: 'success',
        latencyMs: Math.floor(Math.random() * 120 + 70),
        response: resultData
      });
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#EA3A20]/10 flex items-center justify-center text-[#EA3A20]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">技能调试沙箱 (Skill Sandbox)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold">
                  {skill.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                模拟传入测试参数，验证 <span className="font-bold text-slate-700">{skill.name}</span> 算法与调用响应
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* Skill Info summary */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold">触发机制: {skill.triggerType}</span>
              <span className="text-slate-400 font-mono">当前版本: {skill.version}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500">匹配关键词:</span>
              {skill.triggerKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Test Input Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-600" />
                <span>模拟入参 JSON (Payload)</span>
              </label>
              <button
                type="button"
                onClick={() => setInputPayload(getDefaultPayload(skill.code))}
                className="text-[11px] text-[#EA3A20] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>重置示例数据</span>
              </button>
            </div>
            <textarea
              rows={7}
              value={inputPayload}
              onChange={(e) => setInputPayload(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA3A20] leading-relaxed resize-none"
            />
          </div>

          {/* Execution Result Box */}
          {executionResult && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>执行返回结果 (Output Response)</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  耗时: <span className="font-bold text-emerald-600">{executionResult.latencyMs}ms</span> | 状态: 200 OK
                </span>
              </div>
              <div className="p-3.5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 font-mono text-xs max-h-56 overflow-y-auto custom-scrollbar">
                <pre className="text-[11px] text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(executionResult.response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            沙箱调用运行于安全隔离容器中，不影响线上真实业务
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700 cursor-pointer transition-colors"
            >
              关闭
            </button>
            <button
              type="button"
              onClick={handleRunTest}
              disabled={isRunning}
              className="px-5 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 transition-all"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>执行中...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>执行模拟调用</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
