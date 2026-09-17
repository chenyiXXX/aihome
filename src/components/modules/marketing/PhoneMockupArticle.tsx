import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreHorizontal,
  Bookmark,
  Share2,
  Heart,
  ThumbsUp,
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Smartphone,
  Laptop
} from 'lucide-react';
import { GraphicTextItem } from '../../../data/graphicTextData';

interface PhoneMockupArticleProps {
  article: GraphicTextItem;
  themeColor?: 'emerald' | 'dark' | 'warm';
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  displayMode?: 'phone' | 'wide';
}

export const PhoneMockupArticle: React.FC<PhoneMockupArticleProps> = ({
  article,
  themeColor = 'emerald',
  isFullScreen = false,
  onToggleFullScreen,
  displayMode = 'phone'
}) => {
  const [activeTab, setActiveTab] = useState<'article' | 'specs'>('article');
  const [likes, setLikes] = useState(article.readCount ? Math.floor(article.readCount * 0.12) : 520);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const colorStyles = {
    emerald: {
      accent: 'text-[#0F4A47]',
      bgAccent: 'bg-[#EA3A20]',
      borderAccent: 'border-[#0F4A47]',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      highlightBox: 'bg-[#F4F9F8] border-[#0F4A47]/30 text-[#0F4A47]',
      quoteBorder: 'border-l-4 border-[#0F4A47]'
    },
    dark: {
      accent: 'text-slate-900',
      bgAccent: 'bg-slate-900',
      borderAccent: 'border-slate-900',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      highlightBox: 'bg-slate-50 border-slate-300 text-slate-900',
      quoteBorder: 'border-l-4 border-slate-900'
    },
    warm: {
      accent: 'text-[#965A3E]',
      bgAccent: 'bg-[#965A3E]',
      borderAccent: 'border-[#965A3E]',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
      highlightBox: 'bg-[#FDF9F6] border-[#965A3E]/30 text-[#965A3E]',
      quoteBorder: 'border-l-4 border-[#965A3E]'
    }
  }[themeColor || 'emerald'];

  // --------------------------------------------------------------------------
  // Wide Mode: WeChat Desktop / Tablet article reader presentation
  // --------------------------------------------------------------------------
  if (displayMode === 'wide') {
    return (
      <div className={`w-full max-w-[720px] mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col ${
        isFullScreen ? 'h-[calc(100vh-140px)]' : 'h-[720px]'
      }`}>
        {/* Desktop Browser / WeChat Top Nav */}
        <div className="h-12 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-bold text-slate-700 ml-2">微信公众号 · 宽屏高精度排版预览</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">字数：{article.wordCount} 字</span>
            {onToggleFullScreen && (
              <button
                onClick={onToggleFullScreen}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                title={isFullScreen ? '退出全屏' : '页面全屏展示'}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Wide Article Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 sm:px-12 py-8 space-y-6 text-slate-800">
          {/* Article Big Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Author Meta Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 border-b border-slate-100 pb-4">
            <span className="font-bold text-[#0F4A47] flex items-center gap-1.5 text-sm">
              <Building2 className="w-4 h-4 text-[#0F4A47]" />
              {article.author}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold">
              原创
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                article.status === '已发布'
                  ? 'bg-emerald-100 text-emerald-800'
                  : article.status === '已同步到微信'
                  ? 'bg-emerald-50 text-emerald-700'
                  : article.status === '计划发布'
                  ? 'bg-indigo-50 text-indigo-700'
                  : article.status === '审核不通过'
                  ? 'bg-rose-50 text-rose-700'
                  : article.status === '发布审核中'
                  ? 'bg-amber-50 text-amber-700'
                  : article.status === '回收站'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-sky-50 text-sky-700'
              }`}
            >
              {article.status}
            </span>
            <span>{article.createdAt}</span>
            <span>广东 · 高定外贸发布</span>
          </div>

          {/* Lead Quote / Insight Box */}
          <div className={`p-5 rounded-2xl text-sm leading-relaxed border ${colorStyles.highlightBox}`}>
            <div className="flex items-center gap-2 font-bold mb-2 text-xs tracking-wide">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>【本期导读与设计洞察】</span>
            </div>
            <p className="opacity-95 leading-relaxed">{article.summary}</p>
          </div>

          {/* Associated Assets Badge Bar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold">关联产品体系</span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                {article.linkedProducts.length} 款已联调规格
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.linkedProducts.map((p, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold shadow-2xs"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">实景落地案例:</span>
              <span className="font-bold text-slate-800">
                {article.linkedCase.name}
              </span>
            </div>
          </div>

          {/* Material Parameters Table Card */}
          <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
            <div className={`${colorStyles.bgAccent} text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between`}>
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                核心工法与材质技术参数明细
              </span>
              <span className="text-xs text-white/80 font-mono">BOM 规格标准</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs bg-white">
              {article.materialsParameters.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between">
                  <div className="font-medium text-slate-800">{item.name}</div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${colorStyles.accent}`}>{item.spec}</div>
                    <div className="text-xs text-slate-400">{item.standard}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Article Sections */}
          <div className="space-y-8 pt-2">
            {article.contentSections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className={`text-base font-bold text-slate-900 ${colorStyles.quoteBorder} pl-3 py-0.5 leading-snug`}>
                  {section.title}
                </h3>

                {section.paragraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm text-slate-700 leading-relaxed text-justify"
                  >
                    {para}
                  </p>
                ))}

                {section.highlightQuote && (
                  <div className="py-3 px-4 bg-slate-50 border-l-3 border-emerald-500 rounded-r-2xl text-xs italic text-slate-700">
                    {section.highlightQuote}
                  </div>
                )}

                {section.image && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-xs space-y-2 bg-slate-50 p-2">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-72 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    {section.caption && (
                      <div className="text-xs text-slate-500 text-center py-1 font-medium">
                        {section.caption}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Case Gallery Grid */}
          {article.linkedCase.images && article.linkedCase.images.length > 0 && (
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  {article.linkedCase.name} 实景高清组图
                </span>
                <span className="text-xs text-slate-400">共 {article.linkedCase.photoCount || 8} 张</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {article.linkedCase.images.map((img, i) => (
                  <div key={i} className="h-32 rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
                    <img
                      src={img}
                      alt="案例细节"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official WeChat Brand Card / Contact CTA */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-100/80 rounded-3xl p-6 text-center space-y-3 mt-6">
            <div className="w-12 h-12 rounded-full bg-[#EA3A20] text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-900/10 font-serif font-bold text-base">
              HC
            </div>
            <div className="font-bold text-sm text-slate-900">HomeCraft 高定工程全球交付中心</div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              支持高定门墙柜一体化外贸定制、1:1 实景打样及全套 CAD/3D 施工深化图。
            </p>
            <div className="pt-1">
              <button className="px-6 py-2 rounded-full bg-[#EA3A20] text-white text-xs font-bold shadow-xs cursor-pointer hover:bg-[#d6341c] transition-all">
                预约工程样板房沟通
              </button>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>阅读 {article.readCount || '12.5k'}</span>
              <span className="cursor-pointer hover:text-slate-600">在看 368</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  hasLiked ? 'text-red-500 font-bold' : 'hover:text-slate-600'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-red-500' : ''}`} />
                <span>{likes}</span>
              </button>
              <button className="hover:text-slate-600 cursor-pointer">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Default Phone Mockup Mode: iPhone 16 Pro styling
  // --------------------------------------------------------------------------
  return (
    <div className={`flex justify-center items-center py-2 select-none relative group ${
      isFullScreen ? 'w-full h-full' : ''
    }`}>
      {/* Smartphone Outer Casing */}
      <div className={`relative bg-slate-950 rounded-[48px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 flex flex-col transition-all duration-300 ${
        isFullScreen
          ? 'w-[380px] sm:w-[410px] h-[calc(100vh-130px)] max-h-[860px]'
          : 'w-[340px] sm:w-[375px] h-[690px]'
      }`}>
        {/* Quick Full Screen Hover Button on casing */}
        {onToggleFullScreen && !isFullScreen && (
          <button
            onClick={onToggleFullScreen}
            className="absolute -top-3 -right-3 z-50 px-3 py-1.5 bg-[#EA3A20] hover:bg-[#d6341c] text-white text-[11px] font-bold rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer opacity-90 group-hover:opacity-100 transition-all hover:scale-105"
            title="在页面全屏展示"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>全屏展示</span>
          </button>
        )}

        {/* Dynamic Island / Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 ring-1 ring-white/10" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Screen Bezel and Inner Display */}
        <div className="w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col relative font-sans text-slate-800">
          {/* iOS Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-800 shrink-0 z-30 bg-white/95 backdrop-blur-xs">
            <span className="font-mono font-bold">09:41</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="text-[10px] font-mono">5G</span>
              <div className="w-5 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center">
                <div className="w-3 h-full bg-slate-800 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* WeChat Top Navigation Bar */}
          <div className="h-11 px-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-20">
            <div className="flex items-center gap-1 text-slate-700 cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs font-medium">微信</span>
            </div>
            <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
              公众号文章
            </span>
            <div className="flex items-center gap-2 text-slate-700">
              {onToggleFullScreen && (
                <button
                  onClick={onToggleFullScreen}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  title={isFullScreen ? '退出全屏' : '全屏展示手机预览'}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}
              <Bookmark className="w-4 h-4 text-slate-500 hover:text-slate-900 cursor-pointer" />
              <MoreHorizontal className="w-4.5 h-4.5 text-slate-600 hover:text-slate-900 cursor-pointer" />
            </div>
          </div>

          {/* Scrollable Article Body Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-3 pb-14 space-y-4">
            {/* Article Big Title */}
            <h1 className="text-[18px] font-bold text-slate-900 leading-snug tracking-tight">
              {article.title}
            </h1>

            {/* Author Meta Row */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 border-b border-slate-100 pb-3">
              <span className="font-bold text-[#0F4A47] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#0F4A47]" />
                {article.author}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                原创
              </span>
              <span>{article.createdAt.split(' ')[0]}</span>
              <span>广东</span>
            </div>

            {/* Lead Quote / Insight Box */}
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${colorStyles.highlightBox}`}>
              <div className="flex items-center gap-1.5 font-bold mb-1.5 text-[11px] tracking-wide">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>【本期导读与设计洞察】</span>
              </div>
              <p className="opacity-90">{article.summary}</p>
            </div>

            {/* Associated Assets Badge Bar */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium text-[11px]">关联产品</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  {article.linkedProducts.length} 款已联调
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {article.linkedProducts.map((p, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-[11px] font-bold shadow-2xs"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">实景落地案例:</span>
                <span className="font-bold text-slate-800 truncate max-w-[190px]">
                  {article.linkedCase.name}
                </span>
              </div>
            </div>

            {/* Material Parameters Table Card */}
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
              <div className={`${colorStyles.bgAccent} text-white px-3 py-2 text-xs font-bold flex items-center justify-between`}>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  核心工法与材质技术参数
                </span>
                <span className="text-[10px] text-white/80 font-mono">BOM 规格</span>
              </div>
              <div className="divide-y divide-slate-100 text-[11px] bg-white">
                {article.materialsParameters.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div className="font-medium text-slate-700">{item.name}</div>
                    <div className="text-right">
                      <div className={`font-bold ${colorStyles.accent}`}>{item.spec}</div>
                      <div className="text-[10px] text-slate-400">{item.standard}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Article Sections (Paragraphs & High-res Photos) */}
            <div className="space-y-5 pt-1">
              {article.contentSections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className={`text-sm font-bold text-slate-900 ${colorStyles.quoteBorder} pl-2.5 py-0.5 leading-snug`}>
                    {section.title}
                  </h3>

                  {section.paragraphs.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-xs text-slate-700 leading-relaxed text-justify"
                    >
                      {para}
                    </p>
                  ))}

                  {section.highlightQuote && (
                    <div className="py-2.5 px-3 bg-slate-50 border-l-2 border-emerald-500 rounded-r-xl text-xs italic text-slate-700">
                      {section.highlightQuote}
                    </div>
                  )}

                  {section.image && (
                    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-xs space-y-1.5 bg-slate-50 p-1">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-44 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                      {section.caption && (
                        <div className="text-[10px] text-slate-500 text-center py-1 font-medium">
                          {section.caption}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Project Photo Gallery Strip (Case Study Photos) */}
            {article.linkedCase.images && article.linkedCase.images.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    {article.linkedCase.name} 实景组图
                  </span>
                  <span className="text-[10px] text-slate-400">共 {article.linkedCase.photoCount || 8} 张</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {article.linkedCase.images.slice(0, 4).map((img, i) => (
                    <div key={i} className="h-24 rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
                      <img
                        src={img}
                        alt="案例细节"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official WeChat Brand Card / Contact CTA */}
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-100/80 rounded-2xl p-4 text-center space-y-2 mt-4">
              <div className="w-10 h-10 rounded-full bg-[#EA3A20] text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-900/10 font-serif font-bold text-sm">
                HC
              </div>
              <div className="font-bold text-xs text-slate-900">HomeCraft 高定工程全球交付中心</div>
              <p className="text-[10px] text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                支持高定门墙柜一体化外贸定制、1:1 实景打样及全套 CAD/3D 施工深化图。
              </p>
              <div className="pt-1">
                <button className="px-4 py-1.5 rounded-full bg-[#EA3A20] text-white text-[11px] font-bold shadow-xs cursor-pointer hover:bg-[#d6341c] transition-all">
                  预约工程样板房沟通
                </button>
              </div>
            </div>

            {/* WeChat Read & Interaction Stats Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span>阅读 {article.readCount || '12.5k'}</span>
                <span className="cursor-pointer hover:text-slate-600">在看 368</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${
                    hasLiked ? 'text-red-500 font-bold' : 'hover:text-slate-600'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-500' : ''}`} />
                  <span>{likes}</span>
                </button>
                <button className="hover:text-slate-600 cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Virtual Home Bar (iOS indicator) */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-30" />
        </div>
      </div>
    </div>
  );
};
