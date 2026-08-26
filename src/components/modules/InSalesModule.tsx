import React, { useState } from 'react';
import {
  Send,
  BookOpen,
  Calculator,
  Languages,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { SessionItem, ChatMessage, ScriptItem } from '../../types';

interface InSalesModuleProps {
  sessions: SessionItem[];
  chatMessages: ChatMessage[];
  scripts: ScriptItem[];
  subView: string;
  onOpenAddScriptDrawer: () => void;
}

export const InSalesModule: React.FC<InSalesModuleProps> = ({
  sessions,
  chatMessages,
  scripts,
  onOpenAddScriptDrawer
}) => {
  const [activeSession, setActiveSession] = useState<SessionItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [scriptTab, setScriptTab] = useState<'public' | 'private'>('public');
  const [activeTab, setActiveTab] = useState<string>('活跃会话');

  // CBM Calculator Modal
  const [showCbmCalc, setShowCbmCalc] = useState(false);
  const [cbmLength, setCbmLength] = useState(220);
  const [cbmWidth, setCbmWidth] = useState(90);
  const [cbmHeight, setCbmHeight] = useState(85);
  const [cbmQty, setCbmQty] = useState(30);

  const singleCbm = (cbmLength * cbmWidth * cbmHeight) / 1000000;
  const totalCbm = singleCbm * cbmQty;
  const fillRate = Math.min(100, Math.round((totalCbm / 68.0) * 100));

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !activeSession) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId: activeSession.id,
      sender: 'sales',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputMessage('');
  };

  const handleInsertScript = (script: ScriptItem) => {
    setInputMessage((prev) => (prev ? `${prev}\n\n${script.content}` : script.content));
  };

  const filteredScripts = scripts.filter((s) => (scriptTab === 'public' ? !s.isPrivate : s.isPrivate));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      
      {activeSession ? (
        /* Detailed Active Chat View */
        <div className="flex-1 flex overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] mt-2">
          
          {/* Main Chat Workspace */}
          <div className="flex-1 flex flex-col h-full bg-slate-50/40">
            
            {/* Active Customer Top Bar */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {activeSession.avatar}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{activeSession.customerName}</h2>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>渠道: <strong className="text-slate-700">{activeSession.channel}</strong></span>
                    <span>责任人: <strong className="text-slate-700">{activeSession.assignedStaff}</strong></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 text-xs font-bold bg-[#DDECE8] text-[#2D6A5D] rounded-full uppercase">
                  {activeSession.status}
                </span>
                <button
                  onClick={() => setActiveSession(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold cursor-pointer transition-colors"
                >
                  返回列表
                </button>
              </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-xl ${m.sender === 'sales' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-2xs ${
                    m.sender === 'sales' ? 'bg-[#EA3A20]' : 'bg-slate-800'
                  }`}>
                    {m.sender === 'sales' ? 'ME' : 'CU'}
                  </div>

                  <div className="space-y-1">
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'sales'
                        ? 'bg-[#EA3A20] text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs shadow-2xs'
                    }`}>
                      <div>{m.content}</div>

                      {m.translatedContent && (
                        <div className="mt-2 pt-2 border-t border-white/20 text-white/80 text-[11px] flex items-start gap-1">
                          <Languages className="w-3 h-3 text-white shrink-0 mt-0.5" />
                          <span>AI 同传：{m.translatedContent}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 px-1 font-mono">{m.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-3 text-xs text-slate-500 pb-1">
                <button
                  onClick={() => setShowCbmCalc(true)}
                  className="flex items-center gap-1 hover:text-[#EA3A20] cursor-pointer font-bold transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-500" /> CBM 海运试算工具
                </button>
              </div>

              <div className="relative flex items-end gap-2">
                <textarea
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="输入沟通回复，或选择右侧 AI 推荐话术..."
                  className="flex-1 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="px-5 py-3 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" /> 发送
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar: AI Copilot & Knowledge Scripts */}
          <div className="w-80 bg-white border-l border-slate-100 flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <Sparkles className="w-4 h-4 text-[#EA3A20]" /> AI 辅助话术推荐
              </div>
              <button
                onClick={onOpenAddScriptDrawer}
                className="text-[11px] text-[#EA3A20] hover:underline font-bold cursor-pointer"
              >
                + 自定义话术
              </button>
            </div>

            <div className="flex border-b border-slate-100 text-xs">
              <button
                onClick={() => setScriptTab('public')}
                className={`flex-1 py-2.5 text-center font-bold transition-colors cursor-pointer ${
                  scriptTab === 'public'
                    ? 'text-[#EA3A20] border-b-2 border-[#EA3A20]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                企业公共库 ({scripts.filter((s) => !s.isPrivate).length})
              </button>
              <button
                onClick={() => setScriptTab('private')}
                className={`flex-1 py-2.5 text-center font-bold transition-colors cursor-pointer ${
                  scriptTab === 'private'
                    ? 'text-[#EA3A20] border-b-2 border-[#EA3A20]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                个人常用 ({scripts.filter((s) => s.isPrivate).length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredScripts.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => handleInsertScript(sc)}
                  className="p-3 bg-slate-50 hover:bg-[#FFF4F2] border border-slate-100 hover:border-[#EA3A20]/30 rounded-2xl cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800">{sc.title}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-white text-slate-500 rounded-full font-bold border border-slate-100">
                      {sc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {sc.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Sessions Table View matching Jobick Design */
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Top Filter Bar */}
          <div className="flex items-center justify-between py-4 mb-2 shrink-0">
            <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
              {['活跃会话', '历史会话', '已结束会话', '未分配', '机器人'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#EA3A20] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAddScriptDrawer}
                className="h-9 px-4.5 rounded-full bg-[#0F4A47] text-white hover:bg-[#0b3836] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <span>+ 新建话术</span>
              </button>

              <button className="h-9 px-4.5 rounded-full bg-[#FFEFEA] text-[#EA3A20] hover:bg-[#ffe3dc] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
                <span>Newest</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-900 text-xs font-bold">
                  <th className="py-4.5 pl-6 pr-3 w-12 text-center">
                    <input type="checkbox" className="rounded-md border-slate-300 w-4 h-4" />
                  </th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">联系人</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">会话ID</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">接待成员</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">社媒渠道</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">最新留言</th>
                  <th className="py-4.5 px-4 font-bold text-slate-900">访客标签</th>
                  <th className="py-4.5 pr-6 pl-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-xs">
                {sessions.map((sess) => (
                  <tr
                    key={sess.id}
                    onClick={() => setActiveSession(sess)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors h-16"
                  >
                    <td className="py-4 pl-6 pr-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded-md border-slate-300 w-4 h-4" />
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                          {sess.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{sess.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{sess.lastTime}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500">{sess.id}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">{sess.assignedStaff}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-red-50 text-[#EA3A20] font-bold rounded-full text-[11px] border border-red-100">
                        {sess.channel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 truncate max-w-xs font-medium">{sess.lastMessage}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {sess.tags.map((t, i) => (
                          <span key={i} className="px-2.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 pr-6 pl-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSession(sess);
                        }}
                        className="px-4 py-1.5 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        进入会话
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-6 pb-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500">
              Showing 4 of 48 Sessions
            </span>
            <div className="flex items-center gap-2">
              <button className="px-4.5 py-1.5 rounded-full border border-[#EA3A20]/40 bg-[#FFF5F2] text-[#EA3A20] text-xs font-bold cursor-pointer">
                Prev
              </button>
              <button className="w-8 h-8 rounded-full bg-[#EA3A20] text-white font-bold text-xs shadow-xs">
                1
              </button>
              <button className="w-8 h-8 rounded-full text-slate-600 font-bold text-xs hover:bg-white">
                2
              </button>
              <button className="px-4.5 py-1.5 rounded-full border border-[#EA3A20]/40 bg-[#FFF5F2] text-[#EA3A20] text-xs font-bold cursor-pointer">
                Next
              </button>
            </div>
          </div>

        </div>
      )}

      {/* CBM Container Load Calculator Modal */}
      {showCbmCalc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-500" /> 1*40HQ 海运 CBM 装载率自动试算器
              </h3>
              <button onClick={() => setShowCbmCalc(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">长 (cm)</label>
                <input
                  type="number"
                  value={cbmLength}
                  onChange={(e) => setCbmLength(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">宽 (cm)</label>
                <input
                  type="number"
                  value={cbmWidth}
                  onChange={(e) => setCbmWidth(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">高 (cm)</label>
                <input
                  type="number"
                  value={cbmHeight}
                  onChange={(e) => setCbmHeight(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-600 font-medium block mb-1">拟采购套数</label>
              <input
                type="number"
                value={cbmQty}
                onChange={(e) => setCbmQty(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-amber-900 font-medium">
                <span>单件打包体积:</span>
                <span className="font-mono font-bold">{singleCbm.toFixed(3)} CBM</span>
              </div>
              <div className="flex justify-between text-amber-900 font-medium">
                <span>订单总核算体积:</span>
                <span className="font-mono font-bold text-amber-700">{totalCbm.toFixed(2)} CBM</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-amber-900 text-[11px]">
                  <span>40HQ (68 CBM) 填充率:</span>
                  <span className="font-mono font-bold">{fillRate}%</span>
                </div>
                <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full transition-all duration-300" style={{ width: `${fillRate}%` }} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  handleSendMessage(`[CBM 海运核算结果]\n单件体积: ${singleCbm.toFixed(3)} CBM\n${cbmQty}套总体积: ${totalCbm.toFixed(2)} CBM (1*40HQ 充填率: ${fillRate}%)`);
                  setShowCbmCalc(false);
                }}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                插入聊天发送给买家
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
