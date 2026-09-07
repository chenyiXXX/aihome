import { InquiryChatMessage, InquiryItem } from '../types';

/**
 * 售前机器人与海外买家在 WhatsApp 上的真实多轮双语交互聊天记录
 */
export const mockInquiryChatHistories: Record<string, InquiryChatMessage[]> = {
  'INQ-2026-001': [
    {
      id: 'msg-001-1',
      sender: 'customer',
      senderName: 'David Miller',
      time: '2026-08-17 19:40:12',
      content:
        'Hi, we are looking for an OEM custom furniture supplier in China for 3 luxury residential villas in California. Need solid white oak cabinets with soft-close hinges (Blum/DTC), waterproof sink base, E0 grade eco-friendly plywood carcass. Attached floor plan CAD. Please provide FOB Shenzhen quotation and production lead time.',
      translatedContent:
        '您好，我们在寻找中国优质定制家具工厂，承接美国加州3套豪华住宅别墅项目。需要北美白橡木实木门板、百隆/DTC静音阻尼铰链、水槽柜防水底板、E0级环保多层板柜体。附上建筑CAD平面图，请提供FOB深圳报价及工期。',
      attachments: [
        { name: 'Villa_A_Kitchen_CAD_Floorplan.pdf', size: '4.2 MB', type: 'pdf' },
        { name: 'Material_Spec_Sheet_Oak_Veneer.png', size: '1.8 MB', type: 'image' }
      ]
    },
    {
      id: 'msg-001-2',
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: '2026-08-17 19:40:38',
      content:
        'Hello David, thank you for contacting HomeCraft Custom Furniture (Foshan, China)! 👋\n\nI am your 24/7 AI Pre-sales Assistant. I have received your CAD floorplan and project requirements for the 3 California luxury villas.\n\nOur workshop has 15 years of OEM export experience for North American high-end residential joinery, with full US CARB Phase 2 & EPA Title VI environmental certifications.',
      translatedContent:
        'David您好，感谢您联系佛山美居定制家具！👋 我是您的7×24小时售前AI助手。已收到您发来的加州3套别墅CAD平面图与材质规范。我厂拥有15年北美高端豪宅定制出口经验，全系板材通过美国CARB Phase 2与EPA Title VI环保认证。'
    },
    {
      id: 'msg-001-3',
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: '2026-08-17 19:41:15',
      content:
        'To generate the most accurate preliminary FOB Shenzhen quotation, could you please clarify 2 quick technical points:\n1. Hardware: Do you prefer Austrian Blum Tandembox / 3D clip-top or DTC Luxury series?\n2. Wood Finish: Do you prefer Natural clear matte PU lacquer (10% gloss) or wire-brushed oak stain?\n3. Scope: Do you require custom sintered stone/quartz countertops fabricated from our factory as well?',
      translatedContent:
        '为了给您测算最精确的FOB深圳出厂报价，请确认以下技术细节：\n1. 五金品牌：倾向奥地利百隆Blum 3D快装阻尼系列，还是DTC高端系列？\n2. 木饰面工艺：自然哑光PU清漆（10度微光）还是拉丝做旧木蜡油？\n3. 范围：是否需要我厂同时加工配套的岩板/石英石台面？'
    },
    {
      id: 'msg-001-4',
      sender: 'customer',
      senderName: 'David Miller',
      time: '2026-08-17 19:43:02',
      content:
        'We specify Austrian Blum 3D soft-close hinges and undermount drawer slides. For wood finish, natural matte PU lacquer with 10% sheen. Countertops will be sourced locally in California, so only kitchen cabinets and island joinery required.',
      translatedContent:
        '我们指定使用奥地利百隆Blum 3D阻尼铰链和底装隐藏滑轨。木皮饰面采用10度哑光PU清漆。台面我们将在加利福尼亚本地采购安装，因此仅需橱柜柜体、门板和中岛木作。'
    },
    {
      id: 'msg-001-5',
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: '2026-08-17 19:43:45',
      content:
        'Got it! Specification updated in system:\n✅ Carcass: 18mm E0 Grade Eucalyptus Plywood with Waterproof Melamine\n✅ Door Panel: 20mm European Solid White Oak with Natural Matte PU Finish\n✅ Hardware: Blum 3D Adjustable Soft-close Hinges & Undermount Drawer Runners\n✅ Scope: 3 Villa Kitchens + Central Islands (approx 86 linear meters total)\n\n💰 Estimated FOB Shenzhen Price: $78,500 for all 3 Villa sets (approx $26,100 / villa)\n⏱️ Production Lead Time: 28 Days upon CAD sign-off & 30% deposit\n📦 Packing & Container: Estimated 1 x 40HQ container load',
      translatedContent:
        '已更新您的项目技术规格清单：\n✅ 柜体：18mm E0级桉木多层实木板+防水三聚氰胺饰面\n✅ 门板：20mm 欧洲白橡实木拼板+自然哑光PU漆\n✅ 五金：奥地利Blum 3D可调阻尼铰链与骑马抽滑轨\n✅ 规模：3套别墅主厨房+中岛（总计约86延米）\n\n💰 预估FOB深圳出厂价：3套总计 $78,500（约合 $26,100/套）\n⏱️ 工厂生产交期：CAD深化图纸签字确认及30%定金后28天完成\n📦 集装箱排柜：预估整柜 1×40HQ 即可完全装载'
    },
    {
      id: 'msg-001-6',
      sender: 'customer',
      senderName: 'David Miller',
      time: '2026-08-17 19:45:20',
      content:
        'The pricing and timeline look very competitive. Can you send physical wood finish swatches and a miniature sample cabinet door to our San Francisco design office before we finalize the contract?',
      translatedContent:
        '价格和工期非常有竞争力。在敲定合同前，能否先给我们旧金山的设计办公室寄送白橡木色板和一扇样柜门？'
    },
    {
      id: 'msg-001-7',
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: '2026-08-17 19:46:10',
      content:
        'Absolutely! We can dispatch our White Oak Swatch Box and a miniature sample door via DHL Express tomorrow (3-4 business days to California). ✈️\n\nI have recorded your project and sample request into our CRM database. Our senior engineering director and sales specialist will review the CAD drawings and send you the sample DHL tracking number shortly!',
      translatedContent:
        '没问题！我们明天即可通过DHL特快专递将白橡木色卡盒及缩比实体样门寄出（3-4个工作日直达加州）。✈️\n\n我已经将您的项目和打样需求完整录入CRM客户库，外贸工程总监和业务团队将进一步复核CAD图纸并向您同步DHL单号！'
    }
  ],

  'INQ-2026-002': [
    {
      id: 'msg-002-1',
      sender: 'customer',
      senderName: 'Klaus Schmidt',
      time: '2026-08-17 15:18:30',
      content:
        'Guten Tag, we require high-end modular sectional sofas with top-grain Italian leather (1.4-1.6mm thickness) and high-density memory foam (45kg/m³). Must comply with BS5852 / CAL117 fire retardant standards and FSC timber frames. Need 1x40HQ container load optimization (CBM calculation).',
      translatedContent:
        '日安！我们需要采购高端组合式模块真皮沙发，要求1.4-1.6mm头层意大利头层皮及45kg/m³高密度慢回弹海绵。必须符合英国BS5852/加州CAL117阻燃标准及FSC森林认证实木内架。请提供1x40HQ集装箱排柜容积测算。',
      attachments: [{ name: 'Modular_Sofa_Dimensions_DE.pdf', size: '2.9 MB', type: 'pdf' }]
    },
    {
      id: 'msg-002-2',
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: '2026-08-17 15:19:05',
      content:
        'Guten Tag Herr Schmidt! Herzlich willkommen bei HomeCraft Custom Furniture. 👋\n\nOur inner frames use kiln-dried FSC larch wood (moisture <12%) with serpentine spring steel suspension. All our exported foams hold certified BS5852 & CAL117 fire test reports.\n\nOur Container Packing Optimization Agent has calculated the loading plan for 1x40HQ:\n• Model SL-802 Sectional: exactly 38 Sets (Total volume 66.8 CBM, Container fill rate 98.2%)\n• Leather Option: Top Grain Italian Aniline Leather (#218 Saddle Tan)\n• FOB Ningbo Unit Price: €1,150 / set\n• Total 1x40HQ FOB: €43,700',
      translatedContent:
        'Schmidt先生日安！欢迎咨询佛山美居家具。👋\n我国内架均采用FSC认证烘干落叶松（含水率<12%）及蛇簧锰钢平衡减震。出口海绵均具备BS5852与CAL117权威阻燃检测报告。\n\n智能排柜算法已为您测算1x40HQ集装箱方案：\n• SL-802组合沙发：刚好可装 38套（总容积 66.8 CBM，集装箱装载率达 98.2%）\n• 皮料配置：意大利进口头层全粒面半苯胺真皮（#218马鞍棕）\n• FOB宁波单套单价：€1,150 / 套\n• 整柜FOB总计：€43,700'
    },
    {
      id: 'msg-002-3',
      sender: 'customer',
      senderName: 'Klaus Schmidt',
      time: '2026-08-17 15:20:45',
      content:
        'Sehr gut! Can you include 4 full-hide leather swatch rings (Saddle Tan, Olive Green, Matte Black, Cognac) by express to our Frankfurt showroom?',
      translatedContent:
        '很好！能否快递寄送4套完整的皮料色皮环（马鞍棕、橄榄绿、哑光黑、干邑色）至我们法兰克福展厅？'
    },
    {
      id: 'msg-002-4',
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: '2026-08-17 15:21:18',
      content:
        'Ja, natürlich! The leather sample rings and German technical test certificates are packed for DHL express dispatch. Our sales representative Alex will follow up on CRM order confirmation.',
      translatedContent:
        '当然可以！真皮样皮环及全套德规检测报告已打包完毕准备DHL寄送。业务团队Alex将跟进正式合同确认。'
    }
  ],

  'INQ-2026-003': [
    {
      id: 'msg-003-1',
      sender: 'customer',
      senderName: 'Tariq Al-Mansoor',
      time: '2026-08-17 11:02:40',
      content:
        'Looking for contract furniture manufacturer for a 4-star boutique hotel in Dubai Marina. 120 guest rooms: headboards, nightstands, wardrobe with brass stainless steel inlay, and writing desk. Need mock-up room sample within 15 days.',
      translatedContent:
        '寻找迪拜滨海区4星级精品酒店工程家具制造工厂。120间客房：床头软包、床头柜、嵌黄铜不锈钢衣柜及书桌。要求15天内完成1:1样板间打样。',
      attachments: [{ name: 'Hotel_Boutique_BOQ_List.xlsx', size: '850 KB', type: 'excel' }]
    },
    {
      id: 'msg-003-2',
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: '2026-08-17 11:03:22',
      content:
        'Marhaban Mr. Al-Mansoor! Welcome to HomeCraft Hospitality Division. 🏨 We have supplied joinery to over 30 luxury hotels in UAE and Saudi Arabia. Our Foshan factory can complete your 1:1 guestroom mock-up in 12 days.\n\nPreliminary BOQ quotation has been calculated: approx $168,000 CIF Dubai Port for 120 room packages.',
      translatedContent:
        'Al-Mansoor先生您好！欢迎咨询美居酒店工程事业部。🏨 我们曾为阿联酋与沙特30余家豪华酒店提供全套固装与活动家具。佛山工厂可在12天内完成1:1实体样板房交付。\n\n智能算价已自动解析BOQ清单：120间客房预估全案为 $168,000 CIF迪拜港。'
    }
  ],

  'INQ-2026-005': [
    {
      id: 'msg-005-1',
      sender: 'customer',
      senderName: 'Pierre Dubois',
      time: '2026-08-16 14:12:10',
      content:
        'Bonjour, we are managing a luxury renovation project near Champs-Élysées. Requesting detailed quotation for natural canaletto walnut veneer wall panels and bespoke island wardrobe with integrated leather watch drawer inserts. CAD elevations attached.',
      translatedContent:
        '您好，我们正在主持巴黎香榭丽舍大街附近的顶层私宅翻新工程。需要纯天然北美黑胡桃（Canaletto）木饰面护墙板与中岛衣帽间（内嵌真皮腕表收纳抽屉）详细报价。附上CAD立面图。',
      attachments: [
        { name: 'Paris_Penthouse_Closet_Elevations.pdf', size: '5.6 MB', type: 'pdf' },
        { name: 'Walnut_Veneer_Sample_Ref.jpg', size: '1.2 MB', type: 'image' }
      ]
    },
    {
      id: 'msg-005-2',
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: '2026-08-16 14:13:00',
      content:
        'Cher M. Dubois, merci pour votre message WhatsApp! 👋\nOur atelier excels in book-matched Canaletto walnut veneering with Italian Sayerlack PU coating, and hand-stitched saddle leather jewelry dividers.\n\nEstimated project cost for the 2 penthouse suites: €95,000 CIF Le Havre port. 3D renderings and finish sample boards ready for dispatch.',
      translatedContent:
        'Dubois先生您好，感谢您通过WhatsApp联系我们！👋 我厂精通北美黑胡桃自然对拼纹饰面与意大利式真皮缝线首饰抽屉工艺。预估两套顶层套房整体预算为 €95,000 CIF勒阿弗尔港。3D深化效果图及材质实样板已准备就绪。'
    }
  ]
};

/**
 * 获取或自动生成询盘的聊天记录内容（若没有预置，根据询盘信息动态生成逼真的 WhatsApp 机器人接待对话）
 */
export const getInquiryChatHistory = (inquiry: InquiryItem): InquiryChatMessage[] => {
  if (mockInquiryChatHistories[inquiry.id]) {
    return mockInquiryChatHistories[inquiry.id];
  }

  // 动态根据询盘数据构建自然交互
  const time = inquiry.createdAt || inquiry.receivedAt || '2026-08-16 10:20';
  return [
    {
      id: `dyn-msg-${inquiry.id}-1`,
      sender: 'customer',
      senderName: inquiry.buyerName,
      time: `${time}:10`,
      content: inquiry.rawContent || inquiry.content,
      translatedContent: `来自 ${inquiry.country} 买家 ${inquiry.buyerName} 的首条进线诉求：${inquiry.furnitureCategory}，预计预算 ${inquiry.budget}。`,
      attachments: inquiry.attachments
    },
    {
      id: `dyn-msg-${inquiry.id}-2`,
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: `${time}:35`,
      content: `Hello ${inquiry.buyerName}! Thank you for reaching out to HomeCraft Custom Furniture via WhatsApp. 👋\n\nI am your 24/7 AI Pre-sales Assistant. I have received your request regarding "${inquiry.furnitureCategory}". We specialize in bespoke solid wood and contract joinery exports.`,
      translatedContent: `${inquiry.buyerName} 您好！感谢您通过 WhatsApp 联系佛山美居家具。👋 我是您的 7×24 小时售前 AI 接待机器人，已收到您关于“${inquiry.furnitureCategory}”的定制咨询。`
    },
    {
      id: `dyn-msg-${inquiry.id}-3`,
      sender: 'bot',
      senderName: 'HomeCraft 售前AI机器人 (Foshan Millwork Bot)',
      time: `${time}:55`,
      content:
        inquiry.aiReplyDraft ||
        inquiry.aiAnalysis?.suggestedReply ||
        `Our engineering team has reviewed your preliminary inquiry for ${inquiry.quantity}. Estimated FOB pricing is aligned with your budget (${inquiry.budget}). We can arrange physical material swatches and CAD confirmation right away!`,
      translatedContent:
        '售前机器人已自动比对佛山工厂面价库与集装箱容积，初步方案与您的预算范围相匹配，支持寄送实体色板及安排深化图纸确认。'
    }
  ];
};
