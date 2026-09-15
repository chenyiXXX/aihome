import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Building2,
  Layers,
  Palette,
  FileText,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Tag,
  Loader2,
  Wand2
} from 'lucide-react';
import {
  GraphicTextItem,
  AVAILABLE_PRODUCTS,
  AVAILABLE_CASES,
  AvailableProduct,
  AvailableCase
} from '../../../data/graphicTextData';

interface CreateGraphicTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateArticle: (newArticle: GraphicTextItem) => void;
}

const PRESET_TOPICS = [
  {
    topic: '2026现代极简橱柜设计趋势',
    title: '2026现代极简橱柜设计趋势：PET肤感板与吊滑隐形门的质感革命',
    summary: '极简不再是冰冷的空白，而是材质触感与隐形机械的深度共鸣。本文结合品爱在海外精装高定项目的交付实录，解析新一代豪宅橱柜的关键设计语言与工法准则。',
    defaultProducts: ['PET肤感板系列', '吊滑极简门'],
    defaultCaseId: 'case-dubai',
    theme: 'emerald' as const
  },
  {
    topic: '海湾高奢工法：迪拜精装公寓木作落地实录',
    title: '海湾高奢工法：迪拜精装公寓木作全景与无指纹PET落地实录',
    summary: '针对中东海湾气候高盐雾、高温差的特殊环境，深度拆解铝蜂窝抗变形门板、激光微米级无缝热熔封边与现场精密收口工法。',
    defaultProducts: ['PET肤感板系列', '岩板岛台台面系统'],
    defaultCaseId: 'case-dubai',
    theme: 'emerald' as const
  },
  {
    topic: '意式极简铝框玻璃门与隐形五金拆解',
    title: '意式极简铝框玻璃门为何成为私宅标配？极窄4mm边框与天地隐形铰链解析',
    summary: '通透与私密的折衷平衡，超窄航空铝框配合防爆茶玻，45°内嵌式无频闪泛光灯槽如何构筑虚实相生的现代居所。',
    defaultProducts: ['意式极简铝框玻璃门', '全景感应线性灯光系统'],
    defaultCaseId: 'case-singapore',
    theme: 'dark' as const
  },
  {
    topic: '开放式西厨岛台与食品级岩板工法',
    title: '开放式西厨岛台的材质演进：莫氏6级食品级岩板与无死角易洁体系',
    summary: '从耐1200℃高温到耐酸碱防渗色，无缝台下盆工法与悬浮挑空设计如何重塑现代大平层社交中心。',
    defaultProducts: ['岩板岛台台面系统', '德国进口阻尼五金系列'],
    defaultCaseId: 'case-london',
    theme: 'warm' as const
  },
  {
    topic: '滨海豪宅木作耐盐雾与防变形工法',
    title: '滨海豪宅木作耐盐雾实测：悉尼双湾独栋全套门墙柜一体化定制',
    summary: '抵御海洋湿热与高盐雾侵蚀，特殊环保UV涂装与全包覆密封封边技术在海外顶级海景别墅的成熟实践。',
    defaultProducts: ['吊滑极简门', '德国进口阻尼五金系列'],
    defaultCaseId: 'case-sydney',
    theme: 'emerald' as const
  }
];

export const CreateGraphicTextModal: React.FC<CreateGraphicTextModalProps> = ({
  isOpen,
  onClose,
  onCreateArticle
}) => {
  const [topic, setTopic] = useState(PRESET_TOPICS[0].topic);
  const [title, setTitle] = useState(PRESET_TOPICS[0].title);
  const [summary, setSummary] = useState(PRESET_TOPICS[0].summary);
  const [selectedProductNames, setSelectedProductNames] = useState<string[]>(PRESET_TOPICS[0].defaultProducts);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(PRESET_TOPICS[0].defaultCaseId);
  const [themeStyle, setThemeStyle] = useState<'emerald' | 'dark' | 'warm'>('emerald');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSelectPresetTopic = (preset: typeof PRESET_TOPICS[0]) => {
    setTopic(preset.topic);
    setTitle(preset.title);
    setSummary(preset.summary);
    setSelectedProductNames(preset.defaultProducts);
    setSelectedCaseId(preset.defaultCaseId);
    setThemeStyle(preset.theme);
  };

  const toggleProduct = (productName: string) => {
    setSelectedProductNames((prev) =>
      prev.includes(productName)
        ? prev.filter((p) => p !== productName)
        : [...prev, productName]
    );
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    setIsGenerating(true);

    const chosenCase = AVAILABLE_CASES.find((c) => c.id === selectedCaseId) || AVAILABLE_CASES[0];

    // Build rich materialsParameters based on selected products
    const sampleParameters = [
      {
        name: selectedProductNames[0] || '核心板材基材',
        spec: 'ENF / CARB Phase 2 环保级',
        standard: '甲醛释放量 ≤ 0.025mg/m³'
      },
      {
        name: selectedProductNames[1] || '表面工艺与五金',
        spec: '零度超亚抗指纹 / 航空级铝型材',
        standard: '50,000次耐磨擦拭测试通过'
      },
      {
        name: '滑轨/铰链耐疲劳认证',
        spec: '磁悬浮静音阻尼组',
        standard: '德国TÜV 20万次开合寿命认证'
      },
      {
        name: '工程耐候标准',
        spec: '耐盐雾抗变形蜂窝芯',
        standard: '中东/滨海高湿度环境认证'
      }
    ];

    const newArticle: GraphicTextItem = {
      id: `art-${Date.now()}`,
      topic: topic.trim() || '定制家居趋势专题',
      title: title.trim(),
      summary: summary.trim() || '本文结合品爱在海外高定私宅项目的交付实录，解析新一代豪宅门墙柜一体化核心设计语言与工法准则。',
      coverImage: chosenCase.cover || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      linkedProducts: selectedProductNames.length > 0 ? selectedProductNames : ['PET肤感板系列', '吊滑极简门'],
      linkedCase: {
        id: chosenCase.id,
        name: chosenCase.name,
        photoCount: chosenCase.photoCount,
        description: chosenCase.description,
        images: chosenCase.images
      },
      author: 'HomeCraft 高定工法组',
      publishPlatform: '微信公众号',
      status: '编辑中',
      createdAt: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') + ' ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      readCount: 0,
      wordCount: 2260,
      themeStyle: themeStyle,
      materialsParameters: sampleParameters,
      contentSections: [
        {
          title: '01 / 触觉与光影：新一代极简立面材质准则',
          paragraphs: [
            '极简空间的奢华感，往往诞生于微弱而细腻的触觉反馈之中。光面烤漆渐退之后，零度哑光与自然肌理成为国际主流。',
            '采用微波准分子固化处理的纳米级饰面，不仅在视觉上呈现温润低调的漫反射，更赋予材质抗指纹自修复的日常实用耐磨性能。'
          ],
          highlightQuote: '“真正的奢华无需反光喧哗，指尖触碰的瞬间，材质的沉静便是最高级的空间叙事。”',
          image: chosenCase.images[0] || chosenCase.cover,
          caption: `▲ ${chosenCase.name}：全案高定门墙柜一体化立面交付实录`
        },
        {
          title: '02 / 消隐机械：顶轨天幕与隐形五金的无界贯通',
          paragraphs: [
            '打破空间物理壁垒的核心，在于将承重构件与运动轨道隐入建筑结构内部。地面零地槽设计消除所有阻隔，让室内动线完全自由舒展。',
            '极窄航空级铝型材配合磁悬浮静音滑轨，整扇门在闭合时宛如整体护墙壁板，轻推之下如丝缎般滑顺闭合。'
          ],
          highlightQuote: '“地轨的消失，标志着厨房、餐厅与起居空间正式达成真正的物理与精神共融。”',
          image: chosenCase.images[1] || chosenCase.cover,
          caption: '▲ 磁悬浮顶轨移门：无缝衔接不同功能场域的通透视线'
        },
        {
          title: `03 / 落地复盘：${chosenCase.location}交付实操经验`,
          paragraphs: [
            `在${chosenCase.location}项目落地实施中，团队针对当地独特的气候与温湿度进行了严谨的耐候测试，确保长途海运后板材尺寸稳定性与封边密封性。`,
            '全案通过激光热熔微米级无缝封边技术，杜绝胶线发黑与开裂问题，为海外业主提供全生命周期质保的高规格空间体验。'
          ],
          image: chosenCase.images[2] || chosenCase.cover,
          caption: `▲ ${chosenCase.name}：精装细节收口与实景交付`
        }
      ]
    };

    setTimeout(() => {
      setIsGenerating(false);
      onCreateArticle(newArticle);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EA3A20] flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">新建图文方案</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
          {/* Section 1: Preset Topic Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-[#EA3A20]" />
              推荐主题
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TOPICS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPresetTopic(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs text-left cursor-pointer transition-all border ${
                    title === item.title
                      ? 'bg-red-50 border-[#EA3A20] text-[#EA3A20] font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.topic}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Article Title & Summary */}
          <div className="space-y-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                文章标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文章主标题..."
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4A47] focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                导读引言
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="输入文章前置导读与核心摘要..."
                className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F4A47] focus:border-transparent leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: Select Linked Products */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0F4A47]" />
                关联产品
              </span>
              <span className="text-[11px] text-[#0F4A47] font-bold font-mono">
                已选 {selectedProductNames.length} 项
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_PRODUCTS.map((prod) => {
                const isSelected = selectedProductNames.includes(prod.name);
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => toggleProduct(prod.name)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-[#0F4A47] ring-1 ring-[#0F4A47] text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#0F4A47] text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{prod.name}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{prod.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Select Linked Case */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0F4A47]" />
              关联案例
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_CASES.map((item) => {
                const isSelected = selectedCaseId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-[#0F4A47] ring-1 ring-[#0F4A47]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={item.cover}
                      alt={item.name}
                      className="w-16 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{item.location}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {item.photoCount} 张实拍
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#0F4A47] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Theme Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#0F4A47]" />
              排版风格
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  id: 'emerald' as const,
                  name: '墨绿 / 高定奢雅',
                  desc: '奢雅高定 · 经典案例',
                  color: '#0F4A47'
                },
                {
                  id: 'dark' as const,
                  name: '黑白 / 极简工法',
                  desc: '当代建筑 · 五金铝框',
                  color: '#18181b'
                },
                {
                  id: 'warm' as const,
                  name: '暖调 / 自然原木',
                  desc: '质感木作 · 柔和肌理',
                  color: '#92400e'
                }
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setThemeStyle(style.id)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    themeStyle === style.id
                      ? 'border-[#0F4A47] bg-slate-50 ring-1 ring-[#0F4A47]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: style.color }}
                    />
                    <span className="text-xs font-bold text-slate-800">{style.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/80 cursor-pointer transition-colors"
            >
              取消
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={isGenerating || !title.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>正在装配图文...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>生成图文方案</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
  );
};
