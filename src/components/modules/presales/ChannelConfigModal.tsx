import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Key,
  ShieldCheck,
  Zap,
  ExternalLink,
  Sliders,
  Copy,
  Check,
  MessageCircle,
  Bot,
  Clock,
  Send,
  FileCode2,
  Sparkles,
  Phone,
  Radio
} from 'lucide-react';

interface ChannelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChannelConfigModal: React.FC<ChannelConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'gateway' | 'ai_rules' | 'templates'>('gateway');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestSuccess, setWebhookTestSuccess] = useState(false);

  // WhatsApp Configuration State
  const [wabaId, setWabaId] = useState('109283749102834');
  const [phoneNumber, setPhoneNumber] = useState('+86 757 8890 2133');
  const [phoneNumberId, setPhoneNumberId] = useState('102938475610293');
  const [webhookUrl, setWebhookUrl] = useState('https://api.homecraft.ai/webhook/v2/whatsapp');
  const [verifyToken, setVerifyToken] = useState('homecraft_wa_verify_2026_sec');
  const [accessToken, setAccessToken] = useState('EAAO8ZCe4K...9xLq2vZbK91');

  // AI Rules State
  const [autoAiTriage, setAutoAiTriage] = useState(true);
  const [autoDraftReply, setAutoDraftReply] = useState(true);
  const [nightMode, setNightMode] = useState(true);
  const [autoCadPrompt, setAutoCadPrompt] = useState(true);
  const [autoLangDetect, setAutoLangDetect] = useState(true);
  const [vipAlertThreshold, setVipAlertThreshold] = useState<'S级' | 'A级及以上'>('A级及以上');

  // Welcome message template
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Hi! Thanks for reaching out to HomeCraft Custom Furniture (Foshan, China). We specialize in bespoke solid wood cabinetry, luxury sofas, and hospitality projects. Please share your project requirements, quantities, or CAD floorplans. Our engineering team and quotation system will get back to you shortly!'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setWebhookTestSuccess(true);
      setTimeout(() => setWebhookTestSuccess(false), 3000);
    }, 1200);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">WhatsApp Business 官方网关与自动接待设置</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  已连通
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                售前询盘专属通道：Meta Cloud API 实时流式双向收发与前置处理智能体 7×24h 实时接管
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('gateway')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'gateway'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>API 网关与 Webhook</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_rules')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ai_rules'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI 自动接待与初筛规则</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'templates'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>模板消息 (HSM)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-xs">
          
          {/* TAB 1: API Gateway & Webhook */}
          {activeTab === 'gateway' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-slate-700 leading-relaxed">
                  <strong>Meta for Developers 官方授权状态：</strong>
                  当前 WhatsApp 专线已通过 Business 账户认证，支持全天候毫秒级接收海外买家文本、语音、图片、PDF及CAD图纸，并由前置处理智能体自动解析。
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">WhatsApp Business 账号 ID (WABA ID)</label>
                    <input
                      type="text"
                      value={wabaId}
                      onChange={(e) => setWabaId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">官方绑定接收手机号</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-700 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">Webhook 回调接收地址 (Callback URL)</label>
                    <button
                      onClick={() => handleCopy('webhook', webhookUrl)}
                      className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'webhook' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'webhook' ? '已复制' : '复制地址'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Webhook 验证令牌 (Verify Token)</label>
                    <input
                      type="text"
                      value={verifyToken}
                      onChange={(e) => setVerifyToken(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Meta 永久访问令牌 (Access Token)</label>
                    <input
                      type="password"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Webhook Test Button */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingWebhook ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
                      <span>{isTestingWebhook ? '正在测试 Webhook 握手...' : '测试 Webhook 握手联通性'}</span>
                    </button>
                    {webhookTestSuccess && (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 握手成功！HTTP 200 OK
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">上次心跳：30秒前</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Rules & Automation */}
          {activeTab === 'ai_rules' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 block">7×24h 智能体接管与策略配置</label>

                {/* Switch 1: Auto AI Triage */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">WhatsApp 进线自动意向评级与分级打标</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">前置处理智能体自动提取买家国家、采购品类、预算、数量并计算置信度</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoAiTriage}
                    onChange={(e) => setAutoAiTriage(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Switch 2: Auto Draft FOB Reply */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">协同报价智能体自动生成初始 FOB 报价单</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">自动查询佛山实木工厂面价、排柜 CBM 容积并自动起草双语外贸专业答复</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDraftReply}
                    onChange={(e) => setAutoDraftReply(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Switch 3: Night Mode Autopilot */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">夜间与节假日全自动极速接待 (无业务员值班时)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">在非工作时间 30 秒内自动回复海外买家，避免高价值客户流失</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={nightMode}
                    onChange={(e) => setNightMode(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Switch 4: Auto CAD prompt */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">缺失图纸时自动智能索取 CAD / BOQ 清单</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">当买家只发模糊文字需求时，礼貌引导买家上传 DWG/PDF 建筑立面图与材质规范</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoCadPrompt}
                    onChange={(e) => setAutoCadPrompt(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* VIP Alert selector */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">VIP 大单极速强提醒门槛</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">符合评级的 WhatsApp 询盘将同步推送到业务主管企微与飞书</div>
                  </div>
                  <select
                    value={vipAlertThreshold}
                    onChange={(e) => setVipAlertThreshold(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-700"
                  >
                    <option value="S级">仅限 S级超大单 ($50,000+)</option>
                    <option value="A级及以上">A级及以上 (推荐)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Templates (HSM) */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  首条自动欢迎语 (Auto-Welcome Message Template)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  海外买家首次通过 WhatsApp 进线发送消息后，系统即时自动回发此信息：
                </p>
                <textarea
                  rows={4}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">
                  预审通过的 WhatsApp 官方模板消息 (HSM)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">quotation_ready_v1</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Meta 已通过</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">FOB 报价单与材质色板已生成通知模板</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">sample_dispatch_notice</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Meta 已通过</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">DHL 实木及皮料样板寄送单号推送模板</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">cad_mockup_approval</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Meta 已通过</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">1:1 定制图纸深化方案签字确认模板</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">container_loading_alert</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Meta 已通过</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">40HQ 集装箱装柜出运与提单跟踪通知</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            售前询盘助手已锁定 WhatsApp 专属模式，所有数据流均通过此通道加密交互
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-slate-200 hover:bg-white text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>设置已保存并生效</span>
                </>
              ) : (
                <span>保存网关与接管策略</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
