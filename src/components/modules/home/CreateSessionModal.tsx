import React, { useState } from 'react';
import { X, Target, TrendingUp, Users, BookOpen, Check, Swords } from 'lucide-react';

export type SessionCategoryType = 'sales_training' | 'sales_drill' | 'ops_training' | 'hr_training' | 'general';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (sessionConfig: {
    title: string;
    category: SessionCategoryType;
    categoryLabel: string;
    badgeBg: string;
    badgeText: string;
    roleTitle: string;
    roleSubtitle: string;
    kbScope: string;
    recommendedPrompts: string[];
    welcomeMessage: string;
  }) => void;
}

interface CategoryOption {
  type: SessionCategoryType;
  title: string;
  badge: string;
  tagBg: string;
  tagColor: string;
  icon: React.ComponentType<{ className?: string }>;
  roleTitle: string;
  roleSubtitle: string;
  kbScope: string;
  defaultTitlePrefix: string;
  prompts: string[];
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    type: 'sales_training',
    title: '销售培训',
    badge: '销售培训',
    tagBg: 'bg-red-50 text-[#EA3A20] border-red-100',
    tagColor: 'text-[#EA3A20]',
    icon: Target,
    roleTitle: '外贸销冠导师 · 商务谈判AI私教',
    roleSubtitle: '专注中东/欧美大单推进、3F异议化解、30%定金与交期锁价谈判',
    kbScope: '《外贸定制大单SOP》/《面对高净值客户心理博弈》/《销冠话术库》',
    defaultTitlePrefix: '销售培训 · ',
    prompts: [
      '欧美客户提出"别家工厂报价低15%"，如何运用3F法则化解？',
      '海外客户要求减少定金至10%，如何引导并坚持30%底线？',
      '德国百隆Blum五金与国产优质五金相比，向客户讲解溢价卖点的话术有哪些？',
      '外贸全屋定制如何向海外总包商讲解打样费并在大货中抵扣？'
    ]
  },
  {
    type: 'sales_drill',
    title: '销售对练',
    badge: '销售对练',
    tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
    tagColor: 'text-amber-600',
    icon: Swords,
    roleTitle: 'AI 刁钻买家 / 采购总监 · 拟真实战对练',
    roleSubtitle: '全真模拟海外严苛客户，针对价格压制、质量质疑、打样账期与交期索赔开展实战攻防',
    kbScope: '《海外买家刁钻异议模拟库》/《大客户采购心理画像》/《销冠实战通关标准》',
    defaultTitlePrefix: '销售对练 · ',
    prompts: [
      '【价格施压】"你们的FOB报价比越南和波兰工厂高20%，不降价我们立即切换供应商。"',
      '【质量质疑】"我们收到过中国其他工厂的起皮开裂投诉，你们凭什么保证防潮5年？"',
      '【账期与定金】"首单我们只能付10%订金，见提单副本后付尾款，否则免谈。"',
      '【交期逼迫】"45天必须到鹿特丹港，延误一天按合同扣款2%，你们敢不敢签？"'
    ]
  },
  {
    type: 'ops_training',
    title: '运营培训',
    badge: '运营培训',
    tagBg: 'bg-blue-50 text-blue-700 border-blue-100',
    tagColor: 'text-blue-600',
    icon: TrendingUp,
    roleTitle: '海外数字营销导师 · 跨境获客实战顾问',
    roleSubtitle: '专注TikTok/Reels家居短视频脚本、线上展会联动与海外独立站引流',
    kbScope: '《社媒短视频分镜实拍规范》/《跨境B2B独立站SEO与转化》/《展会大促SOP》',
    defaultTitlePrefix: '运营培训 · ',
    prompts: [
      'TikTok/Instagram Reels 家居定制短视频前3秒黄金Hook如何设计？',
      '广交会与海外线下展会前30天，如何通过EDM与社媒做精准买家邀约？',
      '外贸独立站如何布局"Custom Kitchen Cabinet Manufacturer"长尾RFQ词？',
      '工厂数控5轴精雕实木门板的拍摄脚本分镜要点有哪些？'
    ]
  },
  {
    type: 'hr_training',
    title: '人力资源培训',
    badge: '人资培训',
    tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    tagColor: 'text-emerald-600',
    icon: Users,
    roleTitle: '集团人资培训导师 · 组织激励与制度顾问',
    roleSubtitle: '涵盖外贸业务员阶梯提成测算、海外出差参展报销、保密协议NDA与合规考核',
    kbScope: '《员工手册与薪酬绩效方案 v3.0》/《差旅报销与知识产权保密规范》',
    defaultTitlePrefix: '人力资源培训 · ',
    prompts: [
      '外贸业务员阶梯提成机制与发放时间节点是什么？',
      '参加海外展会（迪拜/德国/美国）的差旅报销及海外公杂补贴标准？',
      '新员工入职商业保密协议(NDA)与同业竞业禁止的红线条款有哪些？',
      '外贸大单客诉赔付的责任判定与绩效连带规则如何界定？'
    ]
  },
  {
    type: 'general',
    title: '知识问答',
    badge: '知识问答',
    tagBg: 'bg-purple-50 text-purple-700 border-purple-100',
    tagColor: 'text-purple-600',
    icon: BookOpen,
    roleTitle: '外贸全案技术导师 · 全球工艺合规顾问',
    roleSubtitle: '支持实木/板式选型、FSC/CARB P2环保合规、ISTA 3A包装与关税海运核算',
    kbScope: '《外贸全案知识库总集》/《产品技术百科》/《出口合规手册》',
    defaultTitlePrefix: '知识问答 · ',
    prompts: [
      '外贸定制橱柜欧洲 FSC 认证与 CARB P2 板材环保标准的差异及报关要求？',
      '意式极简实木皮沙发 1*40HQ 海运 CBM 装箱率如何核算？',
      '北美买家要求 ISTA 3A 跌落测试包装标准，工厂合规要求有哪些？',
      '板式衣柜柜体 E0 级与 E1 级防潮板的单方溢价与报关申报编码'
    ]
  }
];

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SessionCategoryType>('general');
  const [customTitle, setCustomTitle] = useState('');

  if (!isOpen) return null;

  const currentOption = CATEGORY_OPTIONS.find((c) => c.type === selectedCategory) || CATEGORY_OPTIONS[4];

  const handleConfirm = () => {
    const finalTitle = customTitle.trim() || `${currentOption.title} · ${new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}`;

    onCreate({
      title: finalTitle,
      category: currentOption.type,
      categoryLabel: currentOption.title,
      badgeBg: currentOption.tagBg,
      badgeText: currentOption.badge,
      roleTitle: currentOption.roleTitle,
      roleSubtitle: currentOption.roleSubtitle,
      kbScope: currentOption.kbScope,
      recommendedPrompts: currentOption.prompts,
      welcomeMessage: currentOption.type === 'general'
        ? `您好！我是品爱家居 AI 知识导师。您可以随时向我提问产品工艺、技术标准、外贸大单交付、内部流程或国际贸易合规细节。`
        : currentOption.type === 'sales_drill'
        ? `【销售实战对练开启】您好！我是本次对练的【欧美/中东大客户采购总监 · AI 模拟买家】。我将针对定制柜体价格、交期、定金条款及产品品质进行全真极限施压。请准备好，您可以直接向我发起商务破冰或承接我的采购询盘！`
        : `您好！我是您的【${currentOption.title}】专属导师。本会话已关联${currentOption.kbScope}，您可以直接向我发起实操提问或业务演练。`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">新建会话</h3>
            <p className="text-xs text-slate-400 mt-0.5">选择会话类别以匹配专属知识库与业务场景</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Category Select Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              会话类型
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORY_OPTIONS.map((opt) => {
                const isSelected = selectedCategory === opt.type;
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(opt.type);
                      if (!customTitle || CATEGORY_OPTIONS.some(o => customTitle.startsWith(o.defaultTitlePrefix))) {
                        setCustomTitle(`${opt.defaultTitlePrefix}${new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}`);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all relative flex items-center justify-between min-h-[52px] ${
                      opt.type === 'general' ? 'col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-[#EA3A20]/5 border-[#0F4A47] ring-1 ring-[#0F4A47]/20 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#EA3A20] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#0F4A47]' : 'text-slate-800'}`}>
                        {opt.title}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#EA3A20] text-white flex items-center justify-center text-[10px] shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              会话名称
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={`例：${currentOption.defaultTitlePrefix}外贸大单实战`}
              className="h-9 w-full px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F4A47] focus:border-[#0F4A47]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium cursor-pointer transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-8 px-5 rounded-xl bg-[#EA3A20] hover:bg-[#d6341c] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
          >
            确认创建
          </button>
        </div>
      </div>
    </div>
  );
};

