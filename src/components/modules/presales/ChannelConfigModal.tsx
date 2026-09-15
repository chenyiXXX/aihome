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
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">WhatsApp 渠道设置</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  已连接
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Meta Cloud API 官方网关接入与智能接待策略</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/30">
          <button
            onClick={() => setActiveTab('gateway')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gateway'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>网关配置</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_rules')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_rules'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>接待策略</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>消息模板</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
          
          {/* TAB 1: API Gateway & Webhook */}
          {activeTab === 'gateway' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>认证状态：Meta Business 官方商业认证 · 专线运行正常</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">心跳延迟 18ms</span>
              </div>

              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">WhatsApp 商业账号 ID (WABA ID)</label>
                    <input
                      type="text"
                      value={wabaId}
                      onChange={(e) => setWabaId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">官方绑定号码</label>
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
                    <label className="text-[11px] font-semibold text-slate-700">Webhook 回调地址 (Callback URL)</label>
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
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">验证令牌 (Verify Token)</label>
                    <input
                      type="text"
                      value={verifyToken}
                      onChange={(e) => setVerifyToken(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">访问令牌 (Access Token)</label>
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
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingWebhook ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
                      <span>{isTestingWebhook ? '测试中...' : '测试握手联通性'}</span>
                    </button>
                    {webhookTestSuccess && (
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 animate-fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 握手成功 (HTTP 200 OK)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Rules & Automation */}
          {activeTab === 'ai_rules' && (
            <div className="space-y-3">
              {/* Switch 1: Auto AI Triage */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">进线自动评级与意向标签</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">自动识别买家国家、品类、预算与数量，并计算综合意向评分</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoAiTriage}
                  onChange={(e) => setAutoAiTriage(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Switch 2: Auto Draft FOB Reply */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">自动起草初始 FOB 报价答复</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">根据产品面价库与包装规格自动起草双语专业回复</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoDraftReply}
                  onChange={(e) => setAutoDraftReply(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Switch 3: Night Mode Autopilot */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">非工作时段 AI 自动接待</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">夜间及节假日无业务员值班时快速响应海外客户</div>
                </div>
                <input
                  type="checkbox"
                  checked={nightMode}
                  onChange={(e) => setNightMode(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Switch 4: Auto CAD prompt */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">缺失图纸时主动索取 CAD / BOQ</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">需求较模糊时主动提示买家提供建筑平面图或材质清单</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoCadPrompt}
                  onChange={(e) => setAutoCadPrompt(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* VIP Alert selector */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">重点商机即时提醒门槛</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">达到评级的询盘实时推送到负责业务主管</div>
                </div>
                <select
                  value={vipAlertThreshold}
                  onChange={(e) => setVipAlertThreshold(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700"
                >
                  <option value="S级">仅限 S级 ($50,000+)</option>
                  <option value="A级及以上">A级及以上</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: Templates (HSM) */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">
                  首条自动欢迎语
                </label>
                <textarea
                  rows={3}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800 block">
                  已审核通过的消息模板 (HSM)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">quotation_ready_v1</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-medium rounded">已审核</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">FOB 报价单与材质色板已就绪通知</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">sample_dispatch_notice</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-medium rounded">已审核</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">木样及皮料样板寄送单号通知</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">cad_mockup_approval</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-medium rounded">已审核</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">图纸深化方案签字确认通知</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">container_loading_alert</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-medium rounded">已审核</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">集装箱装柜出运与提单跟踪通知</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-slate-200 hover:bg-white text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>已保存</span>
              </>
            ) : (
              <span>保存设置</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
