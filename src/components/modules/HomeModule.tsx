import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  HelpCircle,
  Clock,
  CheckCircle2,
  Copy,
  ArrowRight
} from 'lucide-react';

export const HomeModule: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{
    id: string;
    question: string;
    answer: string;
    code?: string;
    confidence?: number;
    time: string;
  }>>([
    {
      id: 'qa-1',
      question: '外贸定制橱柜欧洲 FSC 认证与 CARB P2 板材环保标准的差异及报关要求是什么？',
      answer: '欧洲 FSC (Forest Stewardship Council) 认证关注木材合法可持续来源；而美国 CARB P2 (California Air Resources Board) 及 TSCA Title VI 关注甲醛释放量限制 (≤0.05 ppm)。欧洲海关提单 (B/L) 需附带 Chain of Custody (CoC) 编号，而美国进口时需出具 EPA Compliance Certificate。',
      code: 'KB-CAB-001',
      confidence: 0.98,
      time: '10:24 AM'
    }
  ]);

  const quickPrompts = [
    '意式极简实木皮沙发 1*40HQ 海运 CBM 装箱率如何核算？',
    '德国百隆 Blum 隐形滑轨与底座五金的报价浮动条款是什么？',
    '北美买家要求 ISTA 3A 跌落测试包装标准，工厂合规要求有哪些？',
    '板式衣柜柜体 E0 级与 E1 级防潮板的单方溢价与报关申报编码'
  ];

  const handleAskKnowledgeBase = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/knowledge/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();

      setQaHistory(prev => [
        {
          id: `qa-${Date.now()}`,
          question: q,
          answer: data.answer || '未能从知识库匹配答案，请补充产品条款。',
          code: data.sourceCode || 'KB-GEN-001',
          confidence: data.confidence || 0.92,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      if (!questionText) setQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-y-auto">
      
      {/* Top Banner Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
            通用知识库智能问答
            <span className="px-2 py-0.5 text-[11px] bg-blue-100 text-blue-700 font-semibold rounded-full">
              Gemini 2.5 检索增强
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            快速查询外贸定制家居工艺标准、海运包装规范、环保认证条款及出口报价规则
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Search / Question Input Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>输入家居外贸常见问题或产品工艺细节</span>
          </div>

          <div className="flex gap-2">
            <textarea
              rows={3}
              placeholder="例如：询问某款极简衣柜的板材防潮性能、包装跌落测试要求或欧美海关申报规则..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed"
            />
            <button
              onClick={() => handleAskKnowledgeBase()}
              disabled={loading}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? '检索中...' : '提交问答'}</span>
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="pt-1">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">高频业务快捷推荐：</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskKnowledgeBase(p)}
                  className="p-2.5 text-left text-xs bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 text-slate-700 hover:text-blue-700 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Q&A History Stream */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>实时问答记录 ({qaHistory.length})</span>
          </h2>

          {qaHistory.map((qa) => (
            <div key={qa.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-800">{qa.question}</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{qa.time}</span>
              </div>

              <div className="flex items-start gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-slate-800 leading-relaxed font-normal">{qa.answer}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>出处来源：<strong className="text-blue-600 font-mono">{qa.code}</strong></span>
                      <span>置信度：<strong className="text-emerald-600 font-mono">{qa.confidence ? (qa.confidence * 100).toFixed(0) : 95}%</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
