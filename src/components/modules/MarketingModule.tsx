import React, { useState, useEffect } from 'react';
import {
  Video,
  FileText,
  ShieldCheck,
  Calendar,
  Sparkles,
  Play,
  Share2,
  CheckCircle,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { VideoClipItem, MarketingPost } from '../../types';

interface MarketingModuleProps {
  videoClips: VideoClipItem[];
  posts: MarketingPost[];
  subView: string;
}

export const MarketingModule: React.FC<MarketingModuleProps> = ({ videoClips, posts, subView }) => {
  const [topic, setTopic] = useState('2026 Modular Luxury Custom Wardrobe Collection');
  const [channel, setChannel] = useState('Instagram');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'图文内容生成' | '视频剪辑' | '内容审核' | '发布计划'>(
    subView === '视频剪辑'
      ? '视频剪辑'
      : subView.includes('审核')
      ? '内容审核'
      : subView === '发布计划'
      ? '发布计划'
      : '图文内容生成'
  );

  useEffect(() => {
    if (subView === '视频剪辑') {
      setActiveTab('视频剪辑');
    } else if (subView.includes('审核')) {
      setActiveTab('内容审核');
    } else if (subView === '发布计划') {
      setActiveTab('发布计划');
    } else {
      setActiveTab('图文内容生成');
    }
  }, [subView]);

  const handleGenerateContent = async (type: 'text' | 'video_script') => {
    setLoading(true);
    try {
      const res = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: type === 'video_script' ? 'video_script' : 'text',
          title: topic,
          targetChannel: channel,
          language: '英文',
          keywords: 'Custom furniture, Solid wood cabinetry, Factory direct, High-end luxury'
        })
      });
      const data = await res.json();
      setGeneratedResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between py-4 mb-2 shrink-0">
        <div className="bg-white rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-1">
          {(['图文内容生成', '视频剪辑', '内容审核', '发布计划'] as const).map((tab) => {
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

        <button className="h-9 px-4.5 rounded-full bg-[#FFEFEA] text-[#EA3A20] hover:bg-[#ffe3dc] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
          <span>Social Channels</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === '图文内容生成' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Input Form */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-[#EA3A20]" /> 图文营销文案 AI 生成器
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">宣发主题/产品概念</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA3A20]/20 focus:border-[#EA3A20]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">发布渠道目标</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Instagram', 'LinkedIn', 'Pinterest', 'TikTok', 'Facebook'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setChannel(p)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold text-center cursor-pointer transition-all ${
                        channel === p
                          ? 'bg-[#EA3A20] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleGenerateContent('text')}
                disabled={loading}
                className="w-full py-3.5 bg-[#EA3A20] hover:bg-[#c42810] text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" /> {loading ? '文案生成中...' : '生成海外多语种营销文案'}
              </button>
            </div>

            {/* Right Column: Output Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Share2 className="w-4 h-4 text-[#0F4A47]" /> 生成的推文效果预览 ({channel})
              </h2>

              {generatedResult ? (
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">{generatedResult.title}</h3>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {generatedResult.content}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200">
                    {generatedResult.hashtags?.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-0.5 text-[10px] bg-white text-[#EA3A20] rounded-full font-bold border border-red-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs">
                  在左侧点击“生成海外多语种营销文案”，预览效果将实时渲染于此。
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === '视频剪辑' && (
          <div className="space-y-6">
            <div className="p-6 bg-[#0F4A47] text-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex items-center justify-between">
              <div>
                <span className="px-3 py-1 text-xs font-bold bg-white/10 text-white rounded-full border border-white/20">
                  AI 智能视频剪辑与分镜生成
                </span>
                <h2 className="text-lg font-bold mt-2">家居展厅 & 制造工厂 15秒/30秒 爆款短视频模板</h2>
                <p className="text-xs text-slate-200 mt-1 max-w-xl">
                  输入家具产品或生产工艺主题，AI 将自动剪辑展厅镜头、自动配音英文旁白并匹配 9:16 Shorts/Reels 比例。
                </p>
              </div>
              <button
                onClick={() => handleGenerateContent('video_script')}
                disabled={loading}
                className="px-6 py-3 bg-[#EA3A20] hover:bg-[#c42810] text-white font-bold text-xs rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" /> {loading ? '脚本智能生成中...' : '生成短视频分镜脚本'}
              </button>
            </div>

            {/* Video Clips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoClips.map((clip) => (
                <div key={clip.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3">
                  <div className="relative h-48 bg-slate-900">
                    <img src={clip.previewCover} alt={clip.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                    <button className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                    </button>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] bg-slate-900/80 text-white rounded-full font-mono">
                      {clip.duration} | {clip.aiAspect}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] bg-[#DDECE8] text-[#2D6A5D] rounded-full font-bold">
                      {clip.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900">{clip.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {clip.scriptText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === '内容审核' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-[#0F4A47]" /> AI 营销内容合规与品牌合规审计
            </h2>

            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">审核通过：POST-801 (2026 Architectural Custom Wardrobes)</h4>
                  <p className="mt-1">符合欧洲 FSC 森林环保声明规范，无虚假宣传风险；BS5852 阻燃标准用语准确。</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">需注意描述：POST-803 (German Hardware Supplier Claim)</h4>
                  <p className="mt-1">包含“100% German Made”字样。建议调整为：“Features German-Engineered Soft-close Hinge Systems”以规避商标海关风险。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === '发布计划' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-[#EA3A20]" /> 社媒自动发布计划日历
            </h2>

            <div className="space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs hover:bg-[#FFF4F2] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[10px] bg-[#EA3A20] text-white font-bold rounded-full">{p.platform}</span>
                      <h3 className="font-bold text-slate-900">{p.title}</h3>
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-3">
                      <span>排期时间: {p.scheduledTime}</span>
                      <span>预估浏览: {p.metrics?.views || 0}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white text-[#EA3A20] font-bold rounded-full text-[11px] border border-red-100">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
