import React, { useState } from 'react';
import { Save, ChevronDown, Check } from 'lucide-react';
import { SystemAgentConfig } from '../../types';

interface SystemConfigModuleProps {
  config: SystemAgentConfig;
  subView: string;
}

export const SystemConfigModule: React.FC<SystemConfigModuleProps> = ({ config }) => {
  const [model, setModel] = useState(config.defaultModel);
  const [temperature, setTemperature] = useState(config.temperature);
  const [systemPrompt, setSystemPrompt] = useState(config.systemPrompt);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'模型参数' | '角色设定' | '同传与合规'>('模型参数');

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between py-4 mb-2 shrink-0">
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(['模型参数', '角色设定', '同传与合规'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EA3A20] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          className="h-9 px-5 rounded-full bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs active:scale-95"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? '已保存！' : '保存全局配置'}</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
        {activeTab === '模型参数' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-6">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">AI 基础底层大模型及算力分配</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">默认调用的 Gemini 模型版本</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (极致低延迟、高并发推荐)</option>
                  <option value="gemini-2.5-pro">gemini-2.5-pro (长文本高推理、复杂合同专用)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Temperature 采样随机度: <span className="font-mono text-[#EA3A20]">{temperature}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full mt-3 accent-[#EA3A20]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === '角色设定' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              全局销售智能体角色设定 (System Persona Prompt)
            </h2>

            <div>
              <textarea
                rows={10}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
              />
            </div>
          </div>
        )}

        {activeTab === '同传与合规' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">自动多语种同传与合规约束</h2>

            <div className="space-y-3.5 text-xs">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-[#FFF4F2] transition-colors">
                <input type="checkbox" defaultChecked className="rounded-md border-slate-300 w-4 h-4 accent-[#EA3A20]" />
                <span className="font-semibold text-slate-800">开启非英语海外买家聊天自动英/中实时双语同传模式</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-[#FFF4F2] transition-colors">
                <input type="checkbox" defaultChecked className="rounded-md border-slate-300 w-4 h-4 accent-[#EA3A20]" />
                <span className="font-semibold text-slate-800">严格遵守 FSC、CARB P2 及 BS5852 等国际家具认证关键词审校拦截</span>
              </label>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
