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
  ChevronDown,
  UserCheck,
  Plus,
  Globe,
  Radio,
  Lock,
  ExternalLink
} from 'lucide-react';
import { VideoClipItem, MarketingPost } from '../../types';
import { GraphicTextModule } from './marketing/GraphicTextModule';

interface MarketingModuleProps {
  videoClips: VideoClipItem[];
  posts: MarketingPost[];
  subView: string;
}

interface SocialAccount {
  id: string;
  platform: 'Instagram' | 'LinkedIn' | 'Pinterest' | 'TikTok' | 'Facebook' | 'YouTube';
  accountName: string;
  handle: string;
  avatar: string;
  status: '正常授权' | '授权即将过期' | '已断开' | '异常';
  followerCount: string;
  postCount: number;
  lastSyncTime: string;
  region: string;
}

export const MarketingModule: React.FC<MarketingModuleProps> = ({ videoClips, posts, subView }) => {
  const [topic, setTopic] = useState('2026 Modular Luxury Custom Wardrobe Collection');
  const [channel, setChannel] = useState('Instagram');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: 'ACC-001',
      platform: 'Instagram',
      accountName: 'HomeCraft Official Global',
      handle: '@homecraft_custom_luxury',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: '正常授权',
      followerCount: '48.6K',
      postCount: 312,
      lastSyncTime: '2026-08-26 18:30',
      region: '北美 / 全球'
    },
    {
      id: 'ACC-002',
      platform: 'TikTok',
      accountName: 'HomeCraft Furniture Factory',
      handle: '@homecraft_factory_direct',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      status: '正常授权',
      followerCount: '124.5K',
      postCount: 520,
      lastSyncTime: '2026-08-26 21:15',
      region: '北美 / 欧洲'
    },
    {
      id: 'ACC-003',
      platform: 'LinkedIn',
      accountName: 'HomeCraft Architectural Custom Joinery',
      handle: 'company/homecraft-b2b',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      status: '正常授权',
      followerCount: '18.2K',
      postCount: 184,
      lastSyncTime: '2026-08-25 14:00',
      region: '全球 B2B'
    },
    {
      id: 'ACC-004',
      platform: 'Pinterest',
      accountName: 'HomeCraft Modern Living Designs',
      handle: '@homecraft_interiors',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      status: '授权即将过期',
      followerCount: '32.1K',
      postCount: 890,
      lastSyncTime: '2026-08-20 09:20',
      region: '欧洲 / 澳洲'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'视频剪辑' | '图文生成' | '发布审核' | '发布计划' | '账号管理'>(
    subView === '视频剪辑'
      ? '视频剪辑'
      : subView === '图文生成' || subView === '图文内容生成'
      ? '图文生成'
      : subView.includes('审核')
      ? '发布审核'
      : subView === '发布计划'
      ? '发布计划'
      : subView === '账号管理'
      ? '账号管理'
      : '视频剪辑'
  );

  useEffect(() => {
    if (subView === '视频剪辑') {
      setActiveTab('视频剪辑');
    } else if (subView === '图文生成' || subView === '图文内容生成') {
      setActiveTab('图文生成');
    } else if (subView.includes('审核')) {
      setActiveTab('发布审核');
    } else if (subView === '发布计划') {
      setActiveTab('发布计划');
    } else if (subView === '账号管理') {
      setActiveTab('账号管理');
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
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pt-6 pb-8">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
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

        {activeTab === '图文生成' && (
          <GraphicTextModule />
        )}

        {activeTab === '发布审核' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-[#0F4A47]" /> 运营发布内容合规与品牌合规审核
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

        {activeTab === '账号管理' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#EA3A20]" /> 海外社媒矩阵账号管理与授权中心
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  统一绑定并授权海外主流社媒平台官方账号，支持多矩阵账号一键同步排期分发与授权状态健康监测。
                </p>
              </div>
              <button
                onClick={() => alert('点击添加新社媒账号授权')}
                className="px-5 py-2.5 bg-[#EA3A20] hover:bg-[#c42810] text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> 绑定新社媒账号
              </button>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 ring-2 ring-slate-100">
                        <img
                          src={acc.avatar}
                          alt={acc.accountName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{acc.accountName}</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{acc.handle}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shrink-0 ${
                        acc.status === '正常授权'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {acc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-2xl text-center border border-slate-100/80">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">平台渠道</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{acc.platform}</div>
                    </div>
                    <div className="border-x border-slate-200/80">
                      <div className="text-[10px] text-slate-400 font-medium">粉丝关注</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{acc.followerCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">已发布内容</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{acc.postCount} 篇</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" /> {acc.region}
                    </span>
                    <span>最后同步：{acc.lastSyncTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

