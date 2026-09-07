import {
  InquiryItem,
  SessionItem,
  ChatMessage,
  ScriptItem,
  VideoClipItem,
  MarketingPost,
  KBArticle,
  KBCategory,
  KBTag,
  KBVersion,
  AgentStatMetric,
  EmployeeItem,
  WeComDept,
  OrgDeptNode,
  RoleConfig,
  SystemAgentConfig,
  AgentSkill,
  AgentSkillParameter,
  SalesAgentItem,
  OperationLog,
  QARecordLog,
  ContentGenLog,
  BOQPriceItem,
  BOQPricingRule,
  BOQLineItem,
  ExchangeRateItem,
  ExchangeRateLogItem
} from '../types';
import { initialSalesAgents, initialSalesSkills } from './salesAgentData';

// Mock 2.1 & 2.2 Inquiries (售前询盘 - WhatsApp 专属通道)
export const initialInquiries: InquiryItem[] = [
  {
    id: 'INQ-2026-001',
    inquiryNo: 'RFQ-8829-US',
    buyerName: 'David Miller',
    companyName: 'Apex Architecture & Interior Group',
    country: 'United States',
    countryCode: 'US',
    channel: 'WhatsApp',
    contactNumber: '+1 (415) 890-2134',
    email: 'david.miller@apex-interior.com',
    furnitureCategory: '全屋实木橱柜定制 Solid Wood Kitchen Cabinets',
    budget: '$65,000 - $120,000',
    quantity: '3 Villas (Full House Project)',
    intentLevel: 'Hot (S级)',
    status: 'AI已自动答复',
    createdAt: '2026-08-17 19:42',
    assignedSales: 'Sophia (外贸主管)',
    title: 'California 3 Luxury Villas Solid Wood Kitchen Cabinetry Project',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-17 19:42',
    targetDelivery: '45 Days / CIF Los Angeles',
    rawContent: 'Hi, we are looking for a OEM custom furniture supplier in China for 3 luxury residential villas in California. Need solid white oak cabinets with soft-close hinges (Blum/DTC), waterproof sink base, E0 grade eco-friendly plywood carcass. Attached floor plan CAD. Please provide FOB Shenzhen quotation and production lead time.',
    content: 'Hi, we are looking for a OEM custom furniture supplier in China for 3 luxury residential villas in California. Need solid white oak cabinets with soft-close hinges (Blum/DTC), waterproof sink base, E0 grade eco-friendly plywood carcass. Attached floor plan CAD. Please provide FOB Shenzhen quotation and production lead time.',
    attachments: [
      { name: 'Villa_A_Kitchen_CAD_Floorplan.pdf', url: '#', size: '4.2 MB', type: 'pdf' },
      { name: 'Material_Spec_Sheet_Oak_Veneer.png', url: '#', size: '1.8 MB', type: 'image' }
    ],
    aiReplyDraft: `Dear David Miller,\n\nThank you for contacting HomeCraft via WhatsApp! We have reviewed your CAD floorplans for the 3 California Villa projects.\n\nHere is our initial proposal:\n1. Carcass: 18mm E0 Grade Eucalyptus Plywood with Waterproof Melamine Finish.\n2. Door Panel: 20mm European Solid White Oak with Natural Matte PU Lacquer Finish.\n3. Hardware: Blum 3D Adjustable Soft-close Hinges & Undermount Drawer Runners.\n4. Estimated FOB Shenzhen Price: $78,500 for 3 Villa sets.\n5. Production Lead Time: 28 Days upon CAD approval & 30% deposit.\n\nWe can provide physical wood finish swatches & 3D renderings within 24 hours.`,
    aiScore: 95,
    aiAnalysis: {
      intentLevel: 'Hot (S级大单)',
      confidenceScore: 0.96,
      summary: '买家为加利福尼亚州注册建筑设计事务所合伙人，通过WhatsApp发来豪宅工程需求。附带完整建筑CAD与百隆五金规范，对环保等级(E0)与交期敏感，属于极高转化价值标杆客户。',
      suggestedReply: `Dear David Miller,\n\nThank you for contacting HomeCraft via WhatsApp! We have reviewed your CAD floorplans for the 3 California Villa projects.\n\nHere is our initial proposal:\n1. Carcass: 18mm E0 Grade Eucalyptus Plywood with Waterproof Melamine Finish.\n2. Door Panel: 20mm European Solid White Oak with Natural Matte PU Lacquer Finish.\n3. Hardware: Blum 3D Adjustable Soft-close Hinges & Undermount Drawer Runners.\n4. Estimated FOB Shenzhen Price: $78,500 for 3 Villa sets.\n5. Production Lead Time: 28 Days upon CAD approval & 30% deposit.\n\nWe can provide physical wood finish swatches & 3D renderings within 24 hours.`
    }
  },
  {
    id: 'INQ-2026-002',
    inquiryNo: 'RFQ-9102-DE',
    buyerName: 'Klaus Schmidt',
    companyName: 'Wohnkultur Möbel Import GmbH',
    country: 'Germany',
    countryCode: 'DE',
    channel: 'WhatsApp',
    contactNumber: '+49 171 8921102',
    email: 'k.schmidt@wohnkultur-ffm.de',
    furnitureCategory: '意式极简真皮沙发 Italian Minimalist Leather Sofas',
    budget: '€40,000 - €80,000',
    quantity: '1x40HQ Container (Approx 38 sets)',
    intentLevel: 'Hot (S级)',
    status: '已提供CAD报价',
    createdAt: '2026-08-17 15:20',
    assignedSales: 'Alex (高级业务员)',
    title: 'Modular Sectional Top-Grain Leather Sofas 1x40HQ Container Inquiry',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-17 15:20',
    targetDelivery: '35 Days / FOB Ningbo',
    rawContent: 'Guten Tag, we require high-end modular sectional sofas with top-grain Italian leather (1.4-1.6mm thickness) and high-density memory foam (45kg/m³). Must comply with BS5852 / CAL117 fire retardant standards and FSC timber frames. Need 1x40HQ container load optimization (CBM calculation).',
    content: 'Guten Tag, we require high-end modular sectional sofas with top-grain Italian leather (1.4-1.6mm thickness) and high-density memory foam (45kg/m³). Must comply with BS5852 / CAL117 fire retardant standards and FSC timber frames. Need 1x40HQ container load optimization (CBM calculation).',
    attachments: [
      { name: 'Modular_Sofa_Dimensions_DE.pdf', url: '#', size: '2.9 MB', type: 'pdf' }
    ],
    aiReplyDraft: `Dear Mr. Schmidt,\n\nGreetings from HomeCraft! Our Italian Leather Sofa series strictly adheres to BS5852 fire-retardant standards and FSC certified kiln-dried larch inner wood frames.\n\nCBM Container Optimization for 1x40HQ:\n- Model SL-802 Sectional: 38 Sets (Total 66.8 CBM, Fill rate 98.2%)\n- Leather Option: Top Grain Italian Aniline Leather (#218 Saddle Tan)\n- FOB Ningbo Unit Price: €1,150 / set\n\nSample leather swatches are ready for express delivery via DHL.`,
    aiScore: 91,
    aiAnalysis: {
      intentLevel: 'Hot (S级采购)',
      confidenceScore: 0.94,
      summary: '德国法兰克福老牌高端家具进口商，通过WhatsApp询价整柜集装箱采购需求，对木材FSC证书与阻燃等级测试要求严格，排柜容积率已由计算Skill自动测算。',
      suggestedReply: `Dear Mr. Schmidt,\n\nGreetings from HomeCraft! Our Italian Leather Sofa series strictly adheres to BS5852 fire-retardant standards and FSC certified kiln-dried larch inner wood frames.\n\nCBM Container Optimization for 1x40HQ:\n- Model SL-802 Sectional: 38 Sets (Total 66.8 CBM, Fill rate 98.2%)\n- Leather Option: Top Grain Italian Aniline Leather (#218 Saddle Tan)\n- FOB Ningbo Unit Price: €1,150 / set\n\nSample leather swatches are ready for express delivery via DHL.`
    }
  },
  {
    id: 'INQ-2026-003',
    inquiryNo: 'RFQ-7734-UAE',
    buyerName: 'Tariq Al-Mansoor',
    companyName: 'Royal Horizon Hospitality Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    channel: 'WhatsApp',
    contactNumber: '+971 50 123 4567',
    email: 'tariq@royalhorizon.ae',
    furnitureCategory: '酒店工程定制工程款 Hotel Bedroom & Public Area Sets',
    budget: '$150,000+',
    quantity: '120 Hotel Rooms',
    intentLevel: 'Warm (A级)',
    status: '待跟进',
    createdAt: '2026-08-17 11:05',
    assignedSales: 'Sophia (外贸主管)',
    title: 'Dubai Marina 4-Star Boutique Hotel 120 Guestrooms Full Joinery Package',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-17 11:05',
    targetDelivery: '60 Days / CIF Dubai Port',
    rawContent: 'Looking for contract furniture manufacturer for a 4-star boutique hotel in Dubai Marina. Headboards, nightstands, wardrobe with brass stainless steel inlay, and writing desk. Need mock-up room sample within 15 days.',
    content: 'Looking for contract furniture manufacturer for a 4-star boutique hotel in Dubai Marina. Headboards, nightstands, wardrobe with brass stainless steel inlay, and writing desk. Need mock-up room sample within 15 days.',
    attachments: [
      { name: 'Hotel_Boutique_BOQ_List.xlsx', url: '#', size: '850 KB', type: 'pdf' }
    ],
    aiReplyDraft: `Dear Mr. Al-Mansoor,\n\nHomeCraft has extensive experience in Middle East hotel contract furniture. We can complete the 1:1 Mock-up bedroom sample within 12 days at our Foshan manufacturing base.\n\nPreliminary BOQ quotation has been generated by our AI Cost Estimation system.`,
    aiScore: 86,
    aiAnalysis: {
      intentLevel: 'Warm (A级大额工程)',
      confidenceScore: 0.88,
      summary: '迪拜滨海区4星精品酒店翻新项目，包含120间客房固装与活动家具。重点关注打样周期与黄铜PVD镀钛工艺，打样通过后签单率极高。',
      suggestedReply: `Dear Mr. Al-Mansoor,\n\nHomeCraft has extensive experience in Middle East hotel contract furniture. We can complete the 1:1 Mock-up bedroom sample within 12 days at our Foshan manufacturing base.\n\nPreliminary BOQ quotation has been generated by our AI Cost Estimation system.`
    }
  },
  {
    id: 'INQ-2026-004',
    inquiryNo: 'RFQ-5511-AU',
    buyerName: 'Emma Watson',
    companyName: 'Sydney Home Studio',
    country: 'Australia',
    countryCode: 'AU',
    channel: 'WhatsApp',
    contactNumber: '+61 2 9821 4455',
    email: 'emma@sydneyhomestudio.com.au',
    furnitureCategory: '现代板式隐形衣柜 Custom Modern Sliding Wardrobes',
    budget: '$18,000 - $35,000',
    quantity: '15 Sets',
    intentLevel: 'Standard (B级)',
    status: '打样中',
    createdAt: '2026-08-16 18:30',
    assignedSales: 'Leo (业务员)',
    title: 'Custom Modern Aluminium Frame Wardrobe Sliding Doors with Sensor LED',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-16 18:30',
    targetDelivery: '25 Days / FOB Guangzhou',
    rawContent: 'Inquiring about aluminium frame glass doors custom wardrobe with LED sensor lights. Must meet AS/NZS 1859 Australian eco standards.',
    content: 'Inquiring about aluminium frame glass doors custom wardrobe with LED sensor lights. Must meet AS/NZS 1859 Australian eco standards.',
    attachments: [],
    aiScore: 78,
    aiAnalysis: {
      intentLevel: 'Standard (B级中单)',
      confidenceScore: 0.82,
      summary: '澳大利亚悉尼本地定制家居工作室，寻求铝框玻璃门与柜内感应灯带配套生产，对澳洲AS/NZS环保标准及包装抗摔要求明确。'
    }
  },
  {
    id: 'INQ-2026-005',
    inquiryNo: 'RFQ-6208-FR',
    buyerName: 'Pierre Dubois',
    companyName: 'Atelier Parisien de Design',
    country: 'France',
    countryCode: 'FR',
    channel: 'WhatsApp',
    contactNumber: '+33 1 42 68 55 00',
    email: 'p.dubois@atelier-parisien.fr',
    furnitureCategory: '巴黎豪华顶层公寓定制衣帽间与胡桃木饰面系统 Walk-in Closet',
    budget: '€95,000',
    quantity: '2 Penthouse Suites',
    intentLevel: 'Hot (S级)',
    status: '待跟进',
    createdAt: '2026-08-16 14:15',
    assignedSales: 'Sophia (外贸主管)',
    title: 'Paris 8th Arrondissement Penthouse Luxury Walk-in Closet & Walnut Paneling',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-16 14:15',
    targetDelivery: '40 Days / CIF Le Havre',
    rawContent: 'Bonjour, we are managing a luxury renovation project near Champs-Élysées. Requesting detailed quotation for natural canaletto walnut veneer wall panels and bespoke island wardrobe with integrated leather watch drawer inserts. CAD elevations attached.',
    content: 'Bonjour, we are managing a luxury renovation project near Champs-Élysées. Requesting detailed quotation for natural canaletto walnut veneer wall panels and bespoke island wardrobe with integrated leather watch drawer inserts. CAD elevations attached.',
    attachments: [
      { name: 'Paris_Penthouse_Closet_Elevations.pdf', url: '#', size: '5.6 MB', type: 'pdf' },
      { name: 'Walnut_Veneer_Sample_Ref.jpg', url: '#', size: '1.2 MB', type: 'image' }
    ],
    aiReplyDraft: `Cher M. Dubois,\n\nMerci pour votre message WhatsApp! Notre usine maîtrise parfaitement le plaquage en noyer canaletto sélectionné et les finitions cuir cousu main.\n\nNous vous enverrons le devis détaillé CIF Le Havre sous 24h.`,
    aiScore: 93,
    aiAnalysis: {
      intentLevel: 'Hot (S级高奢项目)',
      confidenceScore: 0.95,
      summary: '巴黎香榭丽舍大街附近顶奢私宅改造工程，WhatsApp直发附带立面剖面图。要求北美黑胡桃(Canaletto)自然拼花与真皮首饰收纳抽屉，溢价空间大。'
    }
  },
  {
    id: 'INQ-2026-006',
    inquiryNo: 'RFQ-4491-ES',
    buyerName: 'Carlos Mendoza',
    companyName: 'Marbella Luxury Resorts S.L.',
    country: 'Spain',
    countryCode: 'ES',
    channel: 'WhatsApp',
    contactNumber: '+34 952 77 12 34',
    email: 'carlos@marbella-resorts.es',
    furnitureCategory: '地中海度假村柚木户外与餐厅实木家具 Teak Wood Sets',
    budget: '$85,000 - $110,000',
    quantity: '60 Outdoor & Dining Sets',
    intentLevel: 'Warm (A级)',
    status: 'AI已自动答复',
    createdAt: '2026-08-16 10:20',
    assignedSales: 'Alex (高级业务员)',
    title: 'Costa del Sol Resort Grade A Teak Outdoor Dining & Lounge Furniture',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-16 10:20',
    targetDelivery: '30 Days / FOB Shenzhen',
    rawContent: 'Hola amigo, we need marine-grade Myanmar teak outdoor dining tables and sun loungers for our beach club in Marbella. Must withstand high UV, salt spray and rain. Quick shipping before high season in November.',
    content: 'Hola amigo, we need marine-grade Myanmar teak outdoor dining tables and sun loungers for our beach club in Marbella. Must withstand high UV, salt spray and rain. Quick shipping before high season in November.',
    attachments: [],
    aiReplyDraft: `Estimado Carlos,\n\n¡Gracias por contactarnos por WhatsApp! Suministramos madera de teca de grado A tratada con aceite impermeabilizante marino que resiste perfectamente el ambiente salino de Marbella.`,
    aiScore: 89,
    aiAnalysis: {
      intentLevel: 'Warm (A级急迫询盘)',
      confidenceScore: 0.91,
      summary: '西班牙太阳海岸度假区买家，通过WhatsApp发来紧急采购需求。交期敏感（要求11月旺季前交付），防盐雾耐候工艺已自动匹配涂装标准。'
    }
  },
  {
    id: 'INQ-2026-007',
    inquiryNo: 'RFQ-3382-IT',
    buyerName: 'Matteo Rossi',
    companyName: 'Milan Interior Architecture Studio',
    country: 'Italy',
    countryCode: 'IT',
    channel: 'WhatsApp',
    contactNumber: '+39 02 8712 9901',
    email: 'm.rossi@milano-arch.it',
    furnitureCategory: '极简无框隐形门与极窄铝框联动移门 Pocket Doors',
    budget: '€130,000',
    quantity: '250 Sets (Commercial & Residential)',
    intentLevel: 'Hot (S级)',
    status: '已签单',
    createdAt: '2026-08-15 16:45',
    assignedSales: 'Sophia (外贸主管)',
    title: 'Concealed Magnetic Lock Flush-to-Wall Doors Project',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-15 16:45',
    targetDelivery: '45 Days / CIF Genoa',
    rawContent: 'Following up on our WhatsApp chat. We inspected your flush-to-wall concealed door samples with Italian AGB magnetic locks. Ready to place initial pilot order for 250 sets.',
    content: 'Following up on our WhatsApp chat. We inspected your flush-to-wall concealed door samples with Italian AGB magnetic locks. Ready to place initial pilot order for 250 sets.',
    attachments: [
      { name: 'Door_Specifications_AGB_Lock.pdf', url: '#', size: '1.4 MB', type: 'pdf' }
    ],
    aiScore: 98,
    aiAnalysis: {
      intentLevel: 'Hot (S级已签约)',
      confidenceScore: 0.99,
      summary: '意大利建筑工程商，通过WhatsApp沟通并确认图纸细节，磁吸静音锁与壁可贴暗铰链工艺完全通过审核。'
    }
  },
  {
    id: 'INQ-2026-008',
    inquiryNo: 'RFQ-2914-JP',
    buyerName: 'Kenji Sato (佐藤健二)',
    companyName: 'Tokyo Urban Living Co., Ltd.',
    country: 'Japan',
    countryCode: 'JP',
    channel: 'WhatsApp',
    contactNumber: '+81 90 5521 8890',
    email: 'sato@tokyo-urban-living.co.jp',
    furnitureCategory: '日式极简收纳榻榻米与隐藏式五金床架 Tatami Modular Storage',
    budget: '$45,000',
    quantity: '50 Compact Apartments',
    intentLevel: 'Warm (A级)',
    status: '待跟进',
    createdAt: '2026-08-15 11:30',
    assignedSales: 'Leo (业务员)',
    title: 'Tokyo Compact Micro-Apartment Modular Tatami & Wall Bed System',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-15 11:30',
    targetDelivery: '30 Days / FOB Shanghai',
    rawContent: 'Hello, we develop micro-studios in Shinjuku, Tokyo. Need modular tatami storage boxes and hydraulic lift wall beds. Must pass Japan JIS F☆☆☆☆ formaldehyde emission tests.',
    content: 'Hello, we develop micro-studios in Shinjuku, Tokyo. Need modular tatami storage boxes and hydraulic lift wall beds. Must pass Japan JIS F☆☆☆☆ formaldehyde emission tests.',
    attachments: [],
    aiScore: 84,
    aiAnalysis: {
      intentLevel: 'Warm (A级专业买家)',
      confidenceScore: 0.86,
      summary: '日本东京新宿小户型公寓开发商，重点核验JIS最高环保F☆☆☆☆标准和液压阻尼气撑五金寿命，符合我司出口日本生产线标准。'
    }
  },
  {
    id: 'INQ-2026-009',
    inquiryNo: 'RFQ-1823-GB',
    buyerName: 'Liam Gallagher',
    companyName: 'Celtic Crest Hospitality UK',
    country: 'United Kingdom',
    countryCode: 'GB',
    channel: 'WhatsApp',
    contactNumber: '+44 7700 900192',
    email: 'liam@celtic-crest.co.uk',
    furnitureCategory: '英国爱丁堡精品酒店80间客房家具工程 Boutique Hotel Casegoods',
    budget: '£72,000',
    quantity: '80 Rooms Package',
    intentLevel: 'Warm (A级)',
    status: 'AI已自动答复',
    createdAt: '2026-08-14 17:10',
    assignedSales: 'Alex (高级业务员)',
    title: 'Edinburgh Boutique Hotel Refurbishment: Bedheads, Desks & Wardrobes',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-14 17:10',
    targetDelivery: '40 Days / CIF Southampton',
    rawContent: 'Looking for a reliable factory to supply casegoods for 80 rooms in Edinburgh. Crib 5 fire retardant fabric upholstery and contract grade scratch-resistant melamine surfaces.',
    content: 'Looking for a reliable factory to supply casegoods for 80 rooms in Edinburgh. Crib 5 fire retardant fabric upholstery and contract grade scratch-resistant melamine surfaces.',
    attachments: [],
    aiScore: 87,
    aiAnalysis: {
      intentLevel: 'Warm (A级英国工程)',
      confidenceScore: 0.89,
      summary: '英国爱丁堡老牌酒店翻新工程，通过WhatsApp发送客房改造清单，明确要求软包满足英标 BS 7176 / Crib 5 阻燃规范。'
    }
  },
  {
    id: 'INQ-2026-010',
    inquiryNo: 'RFQ-1049-US',
    buyerName: 'Sarah Jenkins',
    companyName: 'Manhattan Penthouse Renovations',
    country: 'United States',
    countryCode: 'US',
    channel: 'WhatsApp',
    contactNumber: '+1 (212) 650-8822',
    email: 'sarah@manhattan-renovations.com',
    furnitureCategory: '曼哈顿私宅奢华中岛台与岩板水盆柜 Island Cabinets with Sintered Stone',
    budget: '$110,000',
    quantity: 'Single Luxury Residence',
    intentLevel: 'Hot (S级)',
    status: '已提供CAD报价',
    createdAt: '2026-08-14 09:30',
    assignedSales: 'Sophia (外贸主管)',
    title: 'Tribeca Luxury Loft Sintered Stone Waterfall Island & Lacquer Kitchen',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-14 09:30',
    targetDelivery: '35 Days / Air Cargo & Ocean',
    rawContent: 'Inquiry from our Manhattan Tribeca project. Need 3.6m seamless waterfall sintered stone kitchen island with custom matte metallic lacquer drawer fronts and automated servo-drive touch latches.',
    content: 'Inquiry from our Manhattan Tribeca project. Need 3.6m seamless waterfall sintered stone kitchen island with custom matte metallic lacquer drawer fronts and automated servo-drive touch latches.',
    attachments: [
      { name: 'Tribeca_Kitchen_Specs_Render.pdf', url: '#', size: '6.8 MB', type: 'pdf' }
    ],
    aiScore: 94,
    aiAnalysis: {
      intentLevel: 'Hot (S级高定)',
      confidenceScore: 0.97,
      summary: '纽约曼哈顿Tribeca豪宅项目，通过WhatsApp直发需求。需要3.6米超长大板无缝岩板中岛与金属漆面，具备超高工艺附加值。'
    }
  },
  {
    id: 'INQ-2026-011',
    inquiryNo: 'RFQ-0994-CH',
    buyerName: 'Hans Weber',
    companyName: 'Zurich Alpine Chalets AG',
    country: 'Switzerland',
    countryCode: 'CH',
    channel: 'WhatsApp',
    contactNumber: '+41 79 211 4455',
    email: 'h.weber@alpine-chalets.ch',
    furnitureCategory: '瑞士高山木屋全屋落叶松原木定制家具 Alpine Larch Solid Wood',
    budget: 'CHF 140,000',
    quantity: '2 Alpine Chalets',
    intentLevel: 'Hot (S级)',
    status: '待跟进',
    createdAt: '2026-08-13 15:40',
    assignedSales: 'Alex (高级业务员)',
    title: 'Zermatt Ski Chalet Bespoke Brushed Larch Timber Bedroom & Dining Project',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-13 15:40',
    targetDelivery: '50 Days / CIF Basel',
    rawContent: 'Grüezi, seeking skilled woodworking manufacturer for two luxury ski chalets in Zermatt. Brushed alpine larch solid wood with natural beeswax finish. Detailed joinery schedules ready for tender.',
    content: 'Grüezi, seeking skilled woodworking manufacturer for two luxury ski chalets in Zermatt. Brushed alpine larch solid wood with natural beeswax finish. Detailed joinery schedules ready for tender.',
    attachments: [
      { name: 'Zermatt_Chalet_Tender_Package.zip', url: '#', size: '12.4 MB', type: 'pdf' }
    ],
    aiScore: 96,
    aiAnalysis: {
      intentLevel: 'Hot (S级瑞士高端大单)',
      confidenceScore: 0.98,
      summary: '瑞士采尔马特滑雪木屋全案高定，通过WhatsApp发来招标图纸。要求欧洲落叶松拉丝工艺与纯天然蜂蜡表面处理。'
    }
  },
  {
    id: 'INQ-2026-012',
    inquiryNo: 'RFQ-0821-AE',
    buyerName: 'Elena Rostova',
    companyName: 'Dubai Marina Residences',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    channel: 'WhatsApp',
    contactNumber: '+971 52 981 3344',
    email: 'elena.rostova@gmail.com',
    furnitureCategory: '轻奢真皮弧形沙发与天然大理石茶几 Curved Sofa & Marble Tables',
    budget: '$52,000',
    quantity: '3 Penthouses Living Sets',
    intentLevel: 'Warm (A级)',
    status: 'AI已自动答复',
    createdAt: '2026-08-13 10:15',
    assignedSales: 'Sophia (外贸主管)',
    title: 'Curved Boucle/Leather Sofa & Calacatta Marble Tables Inquiry',
    platform: 'WhatsApp Business API',
    receivedAt: '2026-08-13 10:15',
    targetDelivery: '30 Days / CIF Jebel Ali',
    rawContent: 'Saw your catalog showcasing the curved sofa with Italian Calacatta Viola marble coffee tables! We need 3 sets for our Dubai penthouse projects. Can you quote FOB and shipping?',
    content: 'Saw your catalog showcasing the curved sofa with Italian Calacatta Viola marble coffee tables! We need 3 sets for our Dubai penthouse projects. Can you quote FOB and shipping?',
    attachments: [],
    aiScore: 88,
    aiAnalysis: {
      intentLevel: 'Warm (A级高意向)',
      confidenceScore: 0.92,
      summary: '迪拜滨海豪宅买家通过WhatsApp咨询高溢价弧形沙发与天然大理石茶几，前置处理智能体已自动打标并完成初筛。'
    }
  }
];

// Mock 3.1 & 3.2 Sessions (销售助手)
export const initialSessions: SessionItem[] = [
  {
    id: 'SESS-101',
    customerName: 'Apex Architecture & Interiors LLC',
    avatar: 'DM',
    channel: 'WhatsApp',
    sourceType: 'api_sync',
    contactInfo: '+1 (415) 890-2134',
    companyName: 'Apex Architecture & Interiors LLC',
    unreadCount: 2,
    lastMessage: 'The 3D CAD rendering for Villa A looks amazing! Can we change the island cabinet color to Navy Blue?',
    lastTime: '19:48',
    tags: ['美国买家', 'S级大单', '待确认颜色', 'CAD已发'],
    assignedStaff: 'Sophia',
    status: '跟进中'
  },
  {
    id: 'SESS-102',
    customerName: '陈建国',
    avatar: '陈',
    channel: '企微',
    sourceType: 'api_sync',
    contactInfo: 'wxid_sz88931200',
    companyName: '深圳市品尚整装设计工程有限公司',
    unreadCount: 1,
    lastMessage: '南山豪宅项目的整墙碳晶护墙板和隐形门节点图已收到，请尽快安排打样寄送。',
    lastTime: '18:20',
    tags: ['国内工程', '大客户', '全案定制', '打样确认中'],
    assignedStaff: 'Alex',
    status: '跟进中'
  },
  {
    id: 'SESS-103',
    customerName: 'Klaus Schmidt',
    avatar: 'KS',
    channel: 'WhatsApp',
    sourceType: 'manual',
    contactInfo: '+49 171 8921102',
    companyName: 'Wohnkultur Frankfurt GmbH',
    unreadCount: 0,
    lastMessage: 'DHL tracking received for the leather swatches. Will test the flammability in our Frankfurt lab.',
    lastTime: '16:05',
    tags: ['德国客户', '展会结识', '真皮沙发', '需要BS5852', '发样打样中'],
    assignedStaff: 'Alex',
    status: '已成交'
  },
  {
    id: 'SESS-104',
    customerName: '上海璞境高端私宅设计院',
    avatar: '李',
    channel: '企微',
    sourceType: 'manual',
    contactInfo: '138-1721-9988',
    companyName: '上海璞境高端私宅设计院',
    unreadCount: 0,
    lastMessage: '进口爱格板与百隆五金的进场时间请提前3天报备，业主下周会到现场验收。',
    lastTime: '14:30',
    tags: ['私宅别墅', '销售自建', '高定衣帽间', '爱格板(EGGER)', '排期确认'],
    assignedStaff: 'Sophia',
    status: '已报价'
  },
  {
    id: 'SESS-105',
    customerName: 'Dubai Royal Oasis Hotel Project',
    avatar: 'TA',
    channel: 'WhatsApp',
    sourceType: 'api_sync',
    contactInfo: '+971 50 123 4567',
    companyName: 'Royal Oasis Hospitality Group',
    unreadCount: 1,
    lastMessage: 'Please confirm if the stainless steel trim uses PVD gold coating or electroplating?',
    lastTime: '12:15',
    tags: ['迪拜酒店工程', '高额采购', '工艺确认中'],
    assignedStaff: 'Sophia',
    status: '已报价'
  },
  {
    id: 'SESS-106',
    customerName: '张明哲',
    avatar: '张',
    channel: '企微',
    sourceType: 'api_sync',
    contactInfo: 'wxid_gz_jm8991',
    companyName: '广州极简意境家居科技有限公司',
    unreadCount: 0,
    lastMessage: '请把最新的极简无框玻璃门报价表和铰链测试报告发一份给我。',
    lastTime: '10:45',
    tags: ['意向客户', '展厅上样', '玻璃门系统'],
    assignedStaff: 'Franklin Jr',
    status: '跟进中'
  },
  {
    id: 'SESS-107',
    customerName: '杭州建发养云静舍项目',
    avatar: '王',
    channel: '线下对接',
    sourceType: 'manual',
    contactInfo: '139-5812-3344',
    companyName: '建发房产杭州城市公司',
    unreadCount: 0,
    lastMessage: '展厅实地验厂后已确认碳晶护墙板和全屋隐藏门节点，约下周二签订工程总包合同。',
    lastTime: '09:30',
    tags: ['线下对接', '展会结识', '工程总包', '打样确认中', '预算充足'],
    assignedStaff: 'Franklin Jr',
    status: '已流失'
  },
  {
    id: 'SESS-108',
    customerName: '志宏空间建筑设计事务所',
    avatar: '周',
    channel: '线下对接',
    sourceType: 'api_sync',
    contactInfo: '136-9988-7711',
    companyName: '志宏空间建筑设计事务所',
    unreadCount: 0,
    lastMessage: '展位现场洽谈样板间定制合作，已带走爱格板与金属收口色卡箱。',
    lastTime: '昨天',
    tags: ['线下对接', '全案高定', '展厅上样', '意向客户'],
    assignedStaff: 'Alex',
    status: '跟进中'
  }
];

// Mock Chat Messages for SESS-101
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'M-1',
    sessionId: 'SESS-101',
    sender: 'customer',
    content: 'Hi Sophia, we reviewed your $78,500 quotation for the 3 California Villas. Price is within our expectation.',
    timestamp: '19:35',
    translatedContent: '你好 Sophia，我们复核了 3 套加州别墅 $78,500 的报价，价格在预期范围内。'
  },
  {
    id: 'M-2',
    sessionId: 'SESS-101',
    sender: 'sales',
    content: 'Great to hear that David! Our team has finished the exploded 3D CAD drawings with all DTC soft-close hardware callouts.',
    timestamp: '19:40'
  },
  {
    id: 'M-3',
    sessionId: 'SESS-101',
    sender: 'customer',
    content: 'The 3D CAD rendering for Villa A looks amazing! Can we change the island cabinet color to Navy Blue (RAL 5004)?',
    timestamp: '19:48',
    translatedContent: 'Villa A 的 3D CAD 渲染图太棒了！我们能把中岛台橱柜颜色改成海军蓝 (RAL 5004) 吗？'
  }
];

// Mock 话术库 (Scripts Library - As seen in Screenshot 1!)
export const initialScripts: ScriptItem[] = [
  {
    id: 'SCR-001',
    title: '实木与板材环保标准说明 (FSC & E0 Grade)',
    content: 'Our custom furniture exclusively utilizes E0-grade eco-friendly plywood and FSC-certified kiln-dried solid woods (European Oak, American Walnut, Pinewood). Formaldehyde emissions are strictly controlled below 0.05mg/m³, far exceeding European E1 and US CARB P2 regulations. Safe for immediate residential installation.',
    category: '材质与环保标准',
    isPrivate: false,
    order: 1,
    tags: ['FSC认证', 'E0环保', '零甲醛', '美欧通用'],
    useCount: 142
  },
  {
    id: 'SCR-002',
    title: '海运包装防潮与跌落测试 (ISTA 3A Standards)',
    content: 'For long-distance ocean freight, each custom module is packed with: 1) 5-layer EPE protective foam corner guards; 2) Vacuum-sealed anti-moisture plastic film; 3) 7-ply heavy-duty corrugated cartons; 4) Wooden crate reinforced framework for glass/marble components. Certified by ISTA 3A transit testing with 0.2% historical damage rate.',
    category: '海运与CBM核算',
    isPrivate: false,
    order: 2,
    tags: ['海运防潮', 'ISTA3A包装', '打木架', '零破损'],
    useCount: 98
  },
  {
    id: 'SCR-003',
    title: '外贸定制付款条款与交期承诺 (FOB/CIF)',
    content: 'Standard trade terms: 30% T/T deposit upon CAD shop drawing sign-off; 70% balance paid prior to loading or against B/L copy. Standard lead time is 25-30 days for cabinet projects and 20 days for soft seating. Expedited production available for hotel mock-up orders within 12 days.',
    category: '交期与付款条款',
    isPrivate: false,
    order: 3,
    tags: ['FOB条款', '付款方式', '交期30天', '定金比例'],
    useCount: 215
  },
  {
    id: 'SCR-004',
    title: '私人专享-迪拜奢华酒店不锈钢PVD电镀话术',
    content: 'Our brass and stainless steel metal accents use 304-grade stainless with PVD titanium vacuum ion plating (not standard electroplating). Guaranteeing zero color fading, zero oxidation or tarnishing in coastal high-humidity environments like Dubai & Florida for 15+ years.',
    category: '材质与环保标准',
    isPrivate: true,
    order: 4,
    tags: ['PVD电镀', '304不锈钢', '抗氧化', '迪拜专属'],
    useCount: 37
  }
];

// Mock 4.1 & 4.2 & 4.3 & 4.4 & 4.5 Marketing (运营助手)
export const initialVideoClips: VideoClipItem[] = [
  {
    id: 'VID-001',
    title: '美式红橡木全屋定制 - 5轴数控雕刻精加工',
    furnitureModel: 'Oak Custom Cabinetry Collection 2026',
    sourceType: '工厂生产线',
    duration: '00:35',
    aiAspect: '9:16 (TikTok/Reels)',
    scriptText: '【00:00】特写：德国Homag数控雕刻刀在红橡木门板上精准铣雕。【00:10】配音："Precision meets timeless elegance. See how we craft custom solid oak kitchen cabinets for US homes."【00:25】画面：包装打线与防潮木箱封盖。',
    status: '已剪辑',
    previewCover: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'VID-002',
    title: '意式头层黄牛皮沙发 - 2400次高弹回弹测试',
    furnitureModel: 'Minimalist Modular Leather Sofa SL-802',
    sourceType: '展厅实拍',
    duration: '00:48',
    aiAspect: '1:1 (Instagram Feed)',
    scriptText: '【00:00】展示皮质张力与手工拉扣工艺。【00:20】"1.6mm Aniline Top Grain Leather from Northern Italy. Comfort engineered for luxury living spaces."',
    status: '审核通过',
    previewCover: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'
  }
];

export const initialPosts: MarketingPost[] = [
  {
    id: 'POST-801',
    title: '2026 Architectural Custom Wardrobes Catalog Launch',
    platform: 'Instagram',
    contentType: '图文轮播',
    textCopy: '✨ Elevate your client interior projects with our 2026 Modern Modular Wardrobe Series! Featuring eco-friendly E0 plywood, integrated LED motion sensors, and Italian soft-close sliding hardware. Direct factory export from Foshan, China. DM for full BOQ catalog & free CAD layout!',
    hashtags: ['#CustomWardrobe', '#FurnitureExporter', '#B2BFurniture', '#InteriorDesigners'],
    status: '已排期',
    scheduledTime: '2026-08-18 10:00 (EST)',
    aiAuditStatus: '合规无风险',
    metrics: { views: 4200, likes: 310, inquiries: 18 }
  },
  {
    id: 'POST-802',
    title: 'Why US Architects Choose FSC Certified Solid Wood Cabinets',
    platform: 'LinkedIn',
    contentType: '案例文章',
    textCopy: 'In modern commercial & residential real estate development, sustainability is no longer optional. At HomeCraft, every wooden furniture module is FSC certified and tested against ISTA 3A transit shock standard...',
    hashtags: ['#Architecture', '#RealEstateDevelopment', '#SustainableBuilding', '#CustomFurniture'],
    status: '已发布',
    scheduledTime: '2026-08-16 14:00 (EST)',
    aiAuditStatus: '合规无风险',
    metrics: { views: 8900, likes: 640, inquiries: 42 }
  }
];

// Mock 5.1 & 5.2 & 5.3 Knowledge Base (知识库管理)
export const initialKBArticles: KBArticle[] = [
  // ============================================================================
  // 【全生命周期版本状态对照完备测试数据】（置顶前11条，方便对需求与状态联调）
  // ============================================================================

  // 1. 全生命周期 01: 草稿（未提交复核）
  {
    id: 'KB-REVIEW-DRAFT-01',
    title: '智能升降中岛台与意大利岩板热弯一体成型工艺生产标准（草稿初审稿）',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 全卫',
    code: 'KB-DRAFT-SMART-ISLAND',
    version: 'v0.9.0-draft',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-20 17:00',
    content: `# 智能升降岛台与岩板热弯工艺拆单标准 (草稿未定稿)

## 1. 结构骨架选材
- 内部立柱采用 2.5mm 加厚航空级铝合金；
- 双电机同步驱动，行程 650mm-1050mm，承重测试 ≥ 180kg。

## 2. 待确认事项
- [ ] 需与意大利岩板供应商确认 12mm 弯折 R 角最大弧度公差；
- [ ] 需补充 220V/110V 宽电压电机防夹手传感器布线方案。`,
    status: '草稿',
    viewCount: 4,
    contentType: 'document',
    fileType: 'DOCX',
    fileSize: '3.8 MB',
    chunksCount: 8,
    tags: ['空间: 中西岛台厨柜', '材质: 岩板一体台盆'],
    auditLogs: [
      {
        id: 'LOG-KB-DRAFT-001',
        articleId: 'KB-REVIEW-DRAFT-01',
        operator: 'David (结构工程师)',
        operatorRole: '工程师',
        timestamp: '2026-08-20 17:00:00',
        action: 'create',
        actionLabel: '保存为本地草稿',
        version: 'v0.9.0',
        wasPublished: false,
        diffSummary: '初始草稿录入，未提交复核'
      }
    ]
  },

  // 2. 全生命周期 02: 复核审批中（初次创建·无历史发布版本）
  {
    id: 'KB-REVIEW-PENDING-01',
    title: '2026澳洲及新西兰阻燃与高定板材技术合规认证标准（AS/NZS 3837）',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
    code: 'KB-COMPLIANCE-AU-01',
    version: 'v1.0.0-rc1',
    wasPublished: false,
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-20 14:15',
    content: `# 澳洲与新西兰全屋定制 AS/NZS 3837 阻燃与环保检验规程

## 1. 适用工程背景
针对出口悉尼、墨尔本及奥克兰高层公寓与商业写字楼的全屋固定式柜体（Joinery）阻燃合规要求。

## 2. 核心技术指标
- **Group Number 等级**：公共区域走廊柜门必须达到 Group 1 或 Group 2 阻燃要求；
- **烟雾释放指数（Smoke Growth Rate Index）**：SMOGRA 指数必须小于等于 100 m²/s²；
- **环保甲醛释放量**：严格执行 AS/NZS 1859.1 规定的 Super E0（≤0.3mg/L）标准。

## 3. 随柜报关必备附带资料
1. 具备 NATA 认可资质的第三方实验室阻燃燃烧测试报告原件扫描件；
2. 每一个包装箱外侧粘贴澳新合规二维码防伪溯源码。`,
    status: '等待复核',
    viewCount: 12,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '8.6 MB',
    chunksCount: 24,
    pendingAction: 'create',
    reviewStatus: 'pending',
    tags: ['合规风控: CARB P2认证', '环保等级: 欧洲F4星', '语言: 英语 (English)'],
    applicableRoles: ['外贸销售岗', '方案设计师', '报关合规官'],
    applicableRegions: ['大洋洲/澳洲新西兰', '欧美英美澳加'],
    securityLevel: '内部',
    expiryType: 'permanent',
    auditLogs: [
      {
        id: 'LOG-KB-PENDING-001',
        articleId: 'KB-REVIEW-PENDING-01',
        operator: 'Alex (外贸业务员)',
        operatorRole: '业务录入员',
        timestamp: '2026-08-20 14:15:30',
        action: 'submit_review',
        actionLabel: '上传新建知识条目并提交复核',
        version: 'v1.0.0',
        wasPublished: false,
        diffSummary: '新建【AS/NZS 3837 阻燃与环保检验规程】，提交平台管理员审核',
        afterSnapshot: {
          title: '2026澳洲及新西兰阻燃与高定板材技术合规认证标准（AS/NZS 3837）',
          category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
          content: '澳洲与新西兰全屋定制 AS/NZS 3837 阻燃与环保检验规程...',
          version: 'v1.0.0',
          status: '等待复核'
        }
      }
    ]
  },

  // 3. 全生命周期 03: 复核不通过（初次创建·无历史发布版本）
  {
    id: 'KB-REVIEW-REJECTED-01',
    title: '中东GCC大客户私人折扣与佣金返点内部执行细则（未经审批版）',
    category: '销售话术 / 销售实战、竞对与风险控制 / 算价公式、权限与合同法务',
    code: 'KB-SALES-DISCOUNT-FORBIDDEN',
    version: 'v1.0.0',
    wasPublished: false,
    author: 'Leo (新员工)',
    updatedAt: '2026-08-19 11:20',
    content: `# 中东区域大客户返佣与私人特批折扣参考标准

## 1. 特批折扣档位
- 针对 50 万美金以上整单，业务员可自主在 PI 形式发票上给予 8% 现金折让；
- 允许通过海外离岸账户向中介商支付 3% 居间咨询费。

（注：本条款需经合规审核）`,
    status: '复核不通过',
    viewCount: 8,
    contentType: 'markdown',
    fileType: 'MD',
    fileSize: '3.1 KB',
    chunksCount: 10,
    reviewStatus: 'rejected',
    reviewComment: '严重违反公司外贸合规与财务反洗钱准则：业务员严禁擅自承诺现金折让与离岸佣金，所有返点必须通过法务特批合同并出具合法 BOQ 佣金协议。已驳回，请重新修改。',
    reviewer: 'Sophia (主管/平台管理员)',
    reviewedAt: '2026-08-19 11:45:00',
    tags: ['合规风控: 敏感词拦截', '销售阶段: 逼单与谈判'],
    auditLogs: [
      {
        id: 'LOG-KB-REJ-002',
        articleId: 'KB-REVIEW-REJECTED-01',
        operator: 'Sophia (主管/平台管理员)',
        operatorRole: '平台管理员',
        timestamp: '2026-08-19 11:45:00',
        action: 'reject',
        actionLabel: '平台管理员复核驳回',
        version: 'v1.0.0',
        wasPublished: false,
        reviewComment: '严重违反公司外贸合规与财务反洗钱准则：业务员严禁擅自承诺现金折让与离岸佣金，所有返点必须通过法务特批合同并出具合法 BOQ 佣金协议。已驳回，请重新修改。',
        diffSummary: '复核不通过，状态变更为【复核不通过】，退回作者修订'
      },
      {
        id: 'LOG-KB-REJ-001',
        articleId: 'KB-REVIEW-REJECTED-01',
        operator: 'Leo (新员工)',
        operatorRole: '业务员',
        timestamp: '2026-08-19 11:20:00',
        action: 'submit_review',
        actionLabel: '提交新规复核申请',
        version: 'v1.0.0',
        wasPublished: false,
        diffSummary: '首次提交中东大客户返点条款'
      }
    ]
  },

  // 4. 全生命周期 04: 生效中（标准已发布生效版本）
  {
    id: 'KB-BRAND-01',
    title: '品爱家居 2008-2026 发展历程与全球 100+ 国家外贸交付网络',
    category: '基础知识库 / 品牌实力',
    code: 'KB-BRAND-2026-01',
    version: 'v2.4.0',
    author: 'Franklin Jr (管理员)',
    updatedAt: '2026-08-18',
    content: '品爱家居成立于2008年，拥有12万平方米工业4.0智能制造生产基地，全面引进德国豪迈（HOMAG）全自动封边及智能柔性切割生产线。业务辐射中东、北美、澳洲、东南亚等全球100多个国家和地区，服务超过50,000+海内外工程及高端豪宅业主，具备ISO9001/ISO14001与FSC全链条认证。',
    status: '已发布',
    viewCount: 2350,
    fileType: 'PDF',
    fileSize: '18.4 MB',
    chunksCount: 68,
    tags: ['外贸交付: 全球交付网络', '外贸交付: 德国豪迈智造', '合规风控: FSC产销监管链'],
    auditLogs: [
      {
        id: 'LOG-BRAND-003',
        articleId: 'KB-BRAND-01',
        operator: 'Sophia (主管/平台管理员)',
        operatorRole: '平台管理员',
        timestamp: '2026-08-18 14:30:10',
        action: 'approve',
        actionLabel: '平台管理员复核通过并发布',
        version: 'v2.4.0',
        wasPublished: true,
        reviewComment: '已核验2026年度最新12万平智造基地产线扩建数据与FSC/ISO14001环保全链条认证，数据准确完备，同意发布。',
        diffSummary: '版本晋升为 v2.4.0，补充2026年最新50,000+全球豪宅工程交付案例与ISO14001认证',
        beforeSnapshot: {
          title: '品爱家居 2008-2025 发展历程与全球 80+ 国家外贸网络',
          version: 'v2.2.0',
          status: '已发布',
          category: '基础知识库 / 品牌实力',
          tags: ['外贸交付: 全球交付网络', '合规风控: FSC产销监管链'],
          content: '品爱家居成立于2008年，拥有8万平方米标准制造生产车间，引进数控开料机与封边机。业务辐射中东、北美、东南亚等全球80多个国家，服务超过30,000+海内外业主，具备ISO9001认证。'
        },
        afterSnapshot: {
          title: '品爱家居 2008-2026 发展历程与全球 100+ 国家外贸交付网络',
          version: 'v2.4.0',
          status: '已发布',
          category: '基础知识库 / 品牌实力',
          tags: ['外贸交付: 全球交付网络', '外贸交付: 德国豪迈智造', '合规风控: FSC产销监管链'],
          content: '品爱家居成立于2008年，拥有12万平方米工业4.0智能制造生产基地，全面引进德国豪迈（HOMAG）全自动封边及智能柔性切割生产线。业务辐射中东、北美、澳洲、东南亚等全球100多个国家和地区，服务超过50,000+海内外工程及高端豪宅业主，具备ISO9001/ISO14001与FSC全链条认证。'
        }
      },
      {
        id: 'LOG-BRAND-002',
        articleId: 'KB-BRAND-01',
        operator: 'Franklin Jr (管理员)',
        operatorRole: '内容维护员',
        timestamp: '2026-08-18 10:15:00',
        action: 'submit_review',
        actionLabel: '更新智造基地面积与出口国数据并提交复核',
        version: 'v2.3.0',
        wasPublished: false,
        diffSummary: '将基地面积从8万㎡更新为12万㎡，全球交付国由80+扩增至100+，增加德国豪迈HOMAG柔性线标定',
        beforeSnapshot: {
          title: '品爱家居 2008-2025 发展历程与全球 80+ 国家外贸网络',
          version: 'v2.2.0',
          status: '已发布',
          category: '基础知识库 / 品牌实力',
          tags: ['外贸交付: 全球交付网络'],
          content: '品爱家居成立于2008年，拥有8万平方米标准制造生产车间，引进数控开料机与封边机。业务辐射中东、北美、东南亚等客户，具备ISO9001认证。'
        },
        afterSnapshot: {
          title: '品爱家居 2008-2026 发展历程与全球 100+ 国家外贸交付网络',
          version: 'v2.3.0',
          status: '等待复核',
          category: '基础知识库 / 品牌实力',
          tags: ['外贸交付: 全球交付网络', '外贸交付: 德国豪迈智造', '合规风控: FSC产销监管链'],
          content: '品爱家居成立于2008年，拥有12万平方米工业4.0智能制造生产基地，全面引进德国豪迈（HOMAG）全自动封边及智能柔性切割生产线。业务辐射中东、北美、澳洲、东南亚等全球100多个国家和地区，服务超过50,000+海内外工程及高端豪宅业主，具备ISO9001/ISO14001与FSC全链条认证。'
        }
      },
      {
        id: 'LOG-BRAND-001',
        articleId: 'KB-BRAND-01',
        operator: 'Alex (外贸业务员)',
        operatorRole: '初始录入员',
        timestamp: '2026-06-10 09:00:00',
        action: 'create',
        actionLabel: '初始创建品牌历程白皮书',
        version: 'v1.0.0',
        wasPublished: true,
        diffSummary: '系统首次录入品爱外贸品牌历史与基本生产交付资质',
        afterSnapshot: {
          title: '品爱家居发展历程与外贸网络',
          version: 'v1.0.0',
          status: '已发布',
          category: '基础知识库 / 品牌实力',
          tags: ['外贸交付: 全球交付网络'],
          content: '品爱家居始创于2008年佛山，专注海外全屋定制外贸出口，产品涵盖整体橱柜、全屋衣柜与浴室柜定制，服务全球多个国家。'
        }
      }
    ]
  },

  // 5. 全生命周期 05: 生效中 + 新版复核审批中 (线上运行 v2.0.0，新版 v2.1.0 提审中)
  {
    id: 'KB-REVIEW-PENDING-02',
    title: '出口北美工程单BOQ与海运拼柜装箱体积(CBM)免税计算规则修订版',
    category: '基础知识库 / 品牌实力',
    code: 'KB-FIN-CBM-02',
    version: 'v2.0.0',
    wasPublished: true,
    pendingVersion: 'v2.1.0',
    author: 'Emma (报价核算员)',
    updatedAt: '2026-08-20 16:30',
    content: `# 出口北美工程定制单 CBM 与托盘免税配比算法 (2026修订)

## 1. 箱规与打托优化系数
- 标准 40HQ 高柜理论装载 68 CBM，经过三层瓦楞护角与熏蒸木托加固后，实际有效排柜系数设定为 **88.5% (即 60.2 CBM)**；
- 针对异形台面与超长门板（>2700mm），强制采用实木免熏蒸胶合板箱，按毛体积增加 12% 预留防震缓冲裕度。

## 2. 关税加征豁免分类与 HS Code 申报指引
- 厨房橱柜 HS 编码：9403.40.0000；
- 卧室衣柜 HS 编码：9403.50.0000；
- 所有 BOQ 报价单必须分拆五金件与木制品品类税率。`,
    status: '等待复核',
    viewCount: 45,
    contentType: 'document',
    fileType: 'XLSX',
    fileSize: '4.2 MB',
    chunksCount: 18,
    pendingAction: 'update',
    reviewStatus: 'pending',
    tags: ['外贸交付: FOB条款', '外贸交付: CIF到港', '合规风控: 原产地证'],
    applicableRoles: ['外贸销售岗', '财务核算岗'],
    applicableRegions: ['北美美加地区'],
    securityLevel: '机密',
    expiryType: 'permanent',
    auditLogs: [
      {
        id: 'LOG-KB-PENDING-002',
        articleId: 'KB-REVIEW-PENDING-02',
        operator: 'Emma (报价核算员)',
        operatorRole: '财务核算员',
        timestamp: '2026-08-20 16:30:12',
        action: 'edit',
        actionLabel: '编辑正文与HS编码申报规则并提交复核',
        version: 'v2.1.0',
        wasPublished: false,
        diffSummary: '修正 40HQ 实际排柜安全系数从 85% 上调为 88.5%，更新 HS Code 关税申报分拆细则',
        beforeSnapshot: {
          title: '出口北美工程单BOQ与海运拼柜装箱体积(CBM)计算规则',
          version: 'v2.0.0',
          status: '已发布',
          content: '标准 40HQ 高柜实际排柜系数为 85%...'
        },
        afterSnapshot: {
          title: '出口北美工程单BOQ与海运拼柜装箱体积(CBM)免税计算规则修订版',
          version: 'v2.1.0',
          status: '等待复核',
          content: '标准 40HQ 高柜有效排柜系数设定为 88.5% (即 60.2 CBM)...'
        }
      }
    ]
  },

  // 6. 全生命周期 06: 生效中 + 新版复核不通过 (线上运行 v1.8.0，新版 v1.9.0 驳回)
  {
    id: 'KB-REVIEW-REJECTED-02',
    title: '中东沙特及阿联酋高端别墅阻燃防腐木饰面板施工工艺标准与验收规范（2026修订案）',
    category: '基础知识库 / 产品与技术百科 / 工艺百科 / 全屋五金与工艺标准',
    code: 'KB-ENG-GCC-FIRE-03',
    version: 'v1.8.0',
    wasPublished: true,
    rejectedVersion: 'v1.9.0',
    author: 'David (工程技术员)',
    updatedAt: '2026-08-20 15:40',
    content: `# 中东沙特与阿联酋高端别墅阻燃防腐木饰面工程规范 (v1.8.0 正式生效版)

## 1. 适用工程范围
针对中东海湾国家（沙特利雅得、吉达，阿联酋迪拜、阿布扎比）高温、高湿、高盐雾气候环境的高定木饰面、隐形门及护墙板工程。

## 2. 阻燃与环保强制标准
- **阻燃等级**：依据沙特民防总局（SCDI）规范，木饰面板芯材必须达到 **ASTM E84 Class A (或 EN 13501-1 Class A1)** 级阻燃；
- **防腐防潮处理**：背板与侧边必须采用三道环氧树脂封边，喷涂抗霉菌隔离涂层；
- **甲醛释放量**：执行欧洲 F4 星 / E0 级超低释放环保要求。

## 3. 验收与交工报告
每批次随柜必须附带国际认可第三方实验室（如 SGS / Intertek）出具的 Class A 防火耐燃检测报告原件。`,
    status: '已发布',
    viewCount: 168,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '6.8 MB',
    chunksCount: 22,
    reviewStatus: 'rejected',
    reviewer: 'Sophia (主管/平台管理员)',
    reviewedAt: '2026-08-20 15:40:00',
    reviewComment: '经法务与工程部审核：修订草案第3条擅自将中东阻燃等级从 Class A-1 降级为商业级 B-2，不符合沙特民防总局(SCDI)强制标准，存在重大索赔违约风险。新版 v1.9.0 复核不通过，请维持线上 v1.8.0 规范并重新修正后提交！',
    tags: ['环保等级: 欧洲F4星', '合规风控: 敏感词拦截', '外贸交付: CIF到港'],
    applicableRoles: ['外贸销售岗', '方案设计师', '报关合规官'],
    applicableRegions: ['GCC中东六国', '沙特阿拉伯', '阿联酋迪拜'],
    securityLevel: '内部',
    expiryType: 'permanent',
    auditLogs: [
      {
        id: 'LOG-KB-REJ-PUB-002',
        articleId: 'KB-REVIEW-REJECTED-02',
        operator: 'Sophia (主管/平台管理员)',
        operatorRole: '平台管理员',
        timestamp: '2026-08-20 15:40:00',
        action: 'reject',
        actionLabel: '平台管理员复核驳回',
        version: 'v1.9.0',
        wasPublished: true,
        reviewComment: '经法务与工程部审核：修订草案第3条擅自将中东阻燃等级从 Class A-1 降级为商业级 B-2，不符合沙特民防总局(SCDI)强制标准，存在重大索赔违约风险。新版 v1.9.0 复核不通过，请维持线上 v1.8.0 规范并重新修正后提交！',
        diffSummary: '新版 v1.9.0 复核不通过，驳回修改；线上继续保留生效 v1.8.0 版本',
        beforeSnapshot: {
          title: '中东沙特及阿联酋高端别墅阻燃防腐木饰面板施工工艺标准与验收规范',
          version: 'v1.8.0',
          status: '已发布',
          content: '依据沙特民防总局（SCDI）规范，木饰面板芯材必须达到 ASTM E84 Class A 级阻燃...'
        },
        afterSnapshot: {
          title: '中东沙特及阿联酋高端别墅阻燃防腐木饰面板施工工艺标准与验收规范（2026修订案）',
          version: 'v1.9.0',
          status: '复核不通过',
          content: '依据沙特民防总局（SCDI）规范，木饰面板芯材调整为 Class B-2 商业级阻燃...'
        }
      },
      {
        id: 'LOG-KB-REJ-PUB-001',
        articleId: 'KB-REVIEW-REJECTED-02',
        operator: 'David (工程技术员)',
        operatorRole: '工程技术员',
        timestamp: '2026-08-20 14:50:00',
        action: 'edit',
        actionLabel: '提交工程标准修订版 v1.9.0',
        version: 'v1.9.0',
        wasPublished: true,
        diffSummary: '提交修改中东工程阻燃分级与背板涂层工艺'
      }
    ]
  },

  // 7. 全生命周期 07: 生效中 + 新版过审排期待生效 (线上运行 v2.0.0，新版 v2.1.0 已过审待 09-01 生效)
  {
    id: 'KB-REVIEW-PENDING-EFFECTIVE-01',
    title: '2026年Q4全屋定制外贸出口退税结汇与海关申报合规指引（新版过审待生效）',
    category: '报关认证 / 外贸合规与退税清关 / 欧美及中东清关申报与海关编码',
    code: 'KB-CUSTOMS-TAX-2026Q4',
    version: 'v2.0.0',
    wasPublished: true,
    pendingEffectiveVersion: 'v2.1.0',
    pendingEffectiveStartDate: '2026-09-01',
    author: 'Emily (关务合规主管)',
    updatedAt: '2026-08-22 10:15',
    content: `# 2026年Q4全屋定制出口退税结汇规范 (v2.0.0 正式生效版)

## 1. 现行结汇与退税税率
- 实木及板式家具综合退税率维持 13%；
- 单证备案需在报关单结关后 15 个工作日内完成系统核销。

## 2. 报关单证要求
- 报关单、提单、增值税专用发票“三单一致”；
- 境外汇款水单对应客户名称需与备案合同保持一致。`,
    status: '已发布',
    viewCount: 342,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    chunksCount: 18,
    reviewStatus: 'approved',
    reviewer: 'Sophia (主管/平台管理员)',
    reviewedAt: '2026-08-22 10:15:00',
    reviewComment: '新版本 v2.1.0 经关务总监与财务部联合复核通过！由于涉及海关2026年9月1日新关税税则调整，系统已锁定并将于 2026-09-01 零点准时自动切换为线上正式生效版本。',
    tags: ['外贸合规: 退税申报', '外贸合规: 报关单证'],
    applicableRoles: ['关务跟单岗', '外贸销售岗', '财务审计岗'],
    applicableRegions: ['欧美市场', 'GCC中东六国'],
    securityLevel: '内部',
    expiryType: 'permanent',
    auditLogs: [
      {
        id: 'LOG-KB-PEFF-002',
        articleId: 'KB-REVIEW-PENDING-EFFECTIVE-01',
        operator: 'Sophia (主管/平台管理员)',
        operatorRole: '平台管理员',
        timestamp: '2026-08-22 10:15:00',
        action: 'approve',
        actionLabel: '复核通过（排期自动生效）',
        version: 'v2.1.0',
        wasPublished: true,
        reviewComment: '新版本 v2.1.0 经关务总监与财务部联合复核通过！由于涉及海关2026年9月1日新关税税则调整，系统已锁定并将于 2026-09-01 零点准时自动切换为线上正式生效版本。',
        diffSummary: '新版本 v2.1.0 审批通过，设定于 2026-09-01 自动生效上线；当前保留运行 v2.0.0'
      },
      {
        id: 'LOG-KB-PEFF-001',
        articleId: 'KB-REVIEW-PENDING-EFFECTIVE-01',
        operator: 'Emily (关务合规主管)',
        operatorRole: '关务合规主管',
        timestamp: '2026-08-21 16:30:00',
        action: 'edit',
        actionLabel: '提交关税新规修订版 v2.1.0',
        version: 'v2.1.0',
        wasPublished: true,
        diffSummary: '根据海关总署最新公告预先更新Q4结汇税率'
      }
    ]
  },

  // 8. 全生命周期 08: 已过有效期 + 新版复核审批中 (原版 v1.0.0 已过期，新版 v2.0.0 提审中)
  {
    id: 'KB-EXP-REVIEWING-01',
    title: '2025欧洲环保涂装检测认证与CE合规检测报告（原版已过期·新版复核审批中）',
    category: '报关认证 / 欧盟CE与美标CARB认证标准 / 欧盟CE建材与板材EN717-1甲醛测试',
    code: 'KB-CERT-EU-CE-2025',
    version: 'v1.0.0',
    pendingVersion: 'v2.0.0',
    wasPublished: true,
    author: 'Lucas (认证工程师)',
    updatedAt: '2026-08-25 14:20',
    content: `# 欧洲环保涂装与CE合规检测规范 (原版已过期)

## 1. 2025历史检测指标 (已失效)
- EN717-1 舱室法甲醛释放量 ≤ 0.05 mg/m³；
- 原认证证书已于 2025-12-31 到期。

## 2. 2026新版升级提报 (新版 v2.0.0 复核审批中)
- 增加全系列水性UV漆VOC检测与欧盟REACH 235项SVHC高度关注物质合规清单；
- 当前新版本正处于合规部门复核审批中。`,
    status: '失效',
    viewCount: 412,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '3.6 MB',
    chunksCount: 14,
    reviewStatus: 'pending',
    reviewer: 'Sophia (主管/平台管理员)',
    tags: ['报关认证: 欧盟CE认证', '外贸合规: 报关单证'],
    expiryType: 'custom',
    validityStartDate: '2025-01-01',
    validityEndDate: '2025-12-31',
    auditLogs: [
      {
        id: 'LOG-EXP-REV-002',
        articleId: 'KB-EXP-REVIEWING-01',
        operator: 'Lucas (认证工程师)',
        operatorRole: '认证工程师',
        timestamp: '2026-08-25 14:20:00',
        action: 'submit_review',
        actionLabel: '提交延期及标准升级版 v2.0.0 复核',
        version: 'v2.0.0',
        wasPublished: true,
        diffSummary: '基于已过期的 v1.0.0 提交新版检测报告，申请重新复核上线'
      },
      {
        id: 'LOG-EXP-REV-001',
        articleId: 'KB-EXP-REVIEWING-01',
        operator: '系统自动时效调度器',
        operatorRole: '系统服务',
        timestamp: '2026-01-01 00:00:00',
        action: 'expire',
        actionLabel: '有效期届满自动失效',
        version: 'v1.0.0',
        wasPublished: true,
        diffSummary: '证书有效期到期，系统置为已失效状态'
      }
    ]
  },

  // 9. 全生命周期 09: 已过有效期 + 新版复核不通过 (原版 v1.5.0 已过期，新版 v2.0.0 驳回)
  {
    id: 'KB-EXP-REJECTED-01',
    title: '2025广交会海外买家离岸结算与跨境退税申报指南（原版已过期·新版复核未通过）',
    category: '报关认证 / 外贸合规与退税清关 / 欧美及中东清关申报与海关编码',
    code: 'KB-TAX-OFFSHORE-2025',
    version: 'v1.5.0',
    rejectedVersion: 'v2.0.0',
    wasPublished: true,
    author: 'Leo (新员工)',
    updatedAt: '2026-08-24 16:45',
    content: `# 2025离岸结算与退税申报指南 (已过有效期)

## 1. 历史执行条款 (2026-05-31到期失效)
- 原结算账户单证流已封存；

## 2. 提交的新版本修订 (复核不通过)
- 尝试修订为离岸自结账模式，因缺少税务局最新电子回单签章被复核驳回。`,
    status: '失效',
    viewCount: 156,
    contentType: 'markdown',
    fileType: 'MD',
    fileSize: '2.8 KB',
    chunksCount: 10,
    reviewStatus: 'rejected',
    reviewer: 'Sophia (主管/平台管理员)',
    reviewedAt: '2026-08-24 17:00:00',
    reviewComment: '该知识条目原版本已过期。新提交的 v2.0.0 修订版缺少税务部门最新加盖电子签章的完税凭证，请补齐财务资料后重新发起复核。',
    tags: ['外贸合规: 退税申报', '合规风控: 敏感词拦截'],
    expiryType: 'custom',
    validityStartDate: '2025-06-01',
    validityEndDate: '2026-05-31',
    auditLogs: [
      {
        id: 'LOG-EXP-REJ-002',
        articleId: 'KB-EXP-REJECTED-01',
        operator: 'Sophia (主管/平台管理员)',
        operatorRole: '平台管理员',
        timestamp: '2026-08-24 17:00:00',
        action: 'reject',
        actionLabel: '新版复核驳回',
        version: 'v2.0.0',
        wasPublished: true,
        reviewComment: '原版本已过期。新版缺少税务局加盖电子签章的完税凭证，驳回修订。',
        diffSummary: '新版 v2.0.0 复核不通过，退回作者修改'
      },
      {
        id: 'LOG-EXP-REJ-001',
        articleId: 'KB-EXP-REJECTED-01',
        operator: '系统自动时效调度器',
        operatorRole: '系统服务',
        timestamp: '2026-06-01 00:00:00',
        action: 'expire',
        actionLabel: '有效期届满自动失效',
        version: 'v1.5.0',
        wasPublished: true,
        diffSummary: '原版本到期失效'
      }
    ]
  },

  // 10. 全生命周期 10: 已过有效期 + 新版过审排期待生效 (原版 v1.1.0 已过期，新版 v2.0.0 已过审待 09-01 生效)
  {
    id: 'KB-EXP-PENDING-EFFECTIVE-01',
    title: '2025年中东GCC工程五金配件耐腐蚀耐磨检测指引（原版已过期·新版过审待生效）',
    category: '报关认证 / 欧盟CE与美标CARB认证标准 / 美国CARB P2与EPA木制品环保认证',
    code: 'KB-CERT-GCC-HARDWARE',
    version: 'v1.1.0',
    pendingEffectiveVersion: 'v2.0.0',
    pendingEffectiveStartDate: '2026-09-01',
    wasPublished: true,
    author: 'Emily (关务合规主管)',
    updatedAt: '2026-08-23 09:30',
    content: `# GCC工程五金防腐蚀检测指引 (原版已过期)

## 1. 2025标准 (已于 2026-06-30 到期失效)
- 96小时中性盐雾测试（NSS）达 8 级；

## 2. 2026新规 (新版本 v2.0.0 已复核通过，排期 2026-09-01 生效上线)
- 升级至 240小时酸性盐雾测试（AASS）及沙尘磨损耐候测试；
- 审批已通过，系统将于 2026-09-01 零点准时激活上线。`,
    status: '失效',
    viewCount: 280,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '4.5 MB',
    chunksCount: 16,
    reviewStatus: 'approved',
    reviewer: 'Sophia (主管/平台管理员)',
    reviewedAt: '2026-08-23 09:30:00',
    reviewComment: '新版本 v2.0.0 已复核通过！由于中东沙特海关联合SABER新规于9月1日正式执行，系统设定于 2026-09-01 自动生效上线。',
    tags: ['报关认证: 沙特SABER/GCC认证', '外贸合规: 报关单证'],
    expiryType: 'custom',
    validityStartDate: '2025-01-01',
    validityEndDate: '2026-06-30',
    auditLogs: [
      {
        id: 'LOG-EXP-PEFF-002',
        articleId: 'KB-EXP-PENDING-EFFECTIVE-01',
        operator: 'Sophia (主管/平台管理员)',
        operatorRole: '平台管理员',
        timestamp: '2026-08-23 09:30:00',
        action: 'approve',
        actionLabel: '复核通过（排期自动生效）',
        version: 'v2.0.0',
        wasPublished: true,
        reviewComment: '新版本 v2.0.0 已复核通过，排期于 2026-09-01 自动生效上线。',
        diffSummary: '原版本已过期，新版本审批通过并排期待生效'
      },
      {
        id: 'LOG-EXP-PEFF-001',
        articleId: 'KB-EXP-PENDING-EFFECTIVE-01',
        operator: '系统自动时效调度器',
        operatorRole: '系统服务',
        timestamp: '2026-07-01 00:00:00',
        action: 'expire',
        actionLabel: '有效期届满自动失效',
        version: 'v1.1.0',
        wasPublished: true,
        diffSummary: '原版本到期失效'
      }
    ]
  },

  // 11. 全生命周期 11: 已过有效期，无新版本 (原版 v1.2.0 已过期)
  {
    id: 'KB-REVIEW-EXPIRED-01',
    title: '2025年度春季广交会客商现场签约全屋柜体定金双倍膨胀优惠细则（已过期·无新版本）',
    category: '营销活动 / 限时促销与商务返点政策 / 全屋柜体首单定金膨胀方案',
    code: 'KB-MKT-EXPIRED-2025',
    version: 'v1.2.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2025-05-30',
    content: `# 2025春季广交会展位现场签约限时优惠补贴政策

## 1. 活动有效期
- 2025年4月15日 - 2025年5月5日止（现已全面失效）。

## 2. 优惠条款
- 现场交付 $2,000 定金抵扣 $5,000 货款；
- 免费赠送 1 套德国海蒂诗抽屉滑轨展架。`,
    status: '失效',
    viewCount: 890,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '5.1 MB',
    chunksCount: 16,
    reviewStatus: 'expired',
    tags: ['营销活动: 订舱限时直降', '营销活动: 展会专案'],
    expiryType: 'custom',
    validityStartDate: '2025-04-15',
    validityEndDate: '2025-05-05',
    auditLogs: [
      {
        id: 'LOG-KB-EXP-001',
        articleId: 'KB-REVIEW-EXPIRED-01',
        operator: '系统自动时效调度器',
        operatorRole: '系统服务',
        timestamp: '2025-05-06 00:00:00',
        action: 'expire',
        actionLabel: '有效期届满自动失效',
        version: 'v1.2.0',
        wasPublished: true,
        diffSummary: '活动截止日期到达，系统自动将知识条目置为【已失效】状态'
      }
    ]
  },

  // ============================================================================
  // 【常规业务知识条目列表】
  // ============================================================================
  {
    id: 'KB-BRAND-02',
    title: '品爱工业4.0智能制造基地与德国豪迈HOMAG柔性生产线白皮书',
    category: '基础知识库 / 品牌实力',
    code: 'KB-BRAND-2026-02',
    version: 'v2.2.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-15',
    content: '工厂配备6条全自动智能封边加工中心、激光无缝封边系统及智能立体板件分拣仓储。加工公差严格控制在±0.3mm以内，日均产能达1500标准柜体单元，实现从CAD/CAM深化设计到数控机床生产数据无缝直通。',
    status: '已发布',
    viewCount: 1420,
    fileType: 'DOCX',
    fileSize: '8.6 MB',
    chunksCount: 52,
    tags: ['外贸交付: 德国豪迈智造', '材质: 激光无缝封边', '环保等级: ENF级无醛'],
    auditLogs: [
      {
        id: 'LOG-FACTORY-002',
        articleId: 'KB-BRAND-02',
        operator: 'Sophia (主管/平台管理员)',
        operatorRole: '平台管理员',
        timestamp: '2026-08-15 15:40:00',
        action: 'approve',
        actionLabel: '平台管理员复核通过并发布',
        version: 'v2.2.0',
        wasPublished: true,
        reviewComment: '激光无缝封边加工公差±0.3mm与CAD/CAM直通接口参数核验通过，予以发布上线。',
        diffSummary: '升级封边加工公差标准由±0.5mm提升至±0.3mm，新增激光无缝封边技术指标',
        beforeSnapshot: {
          title: '品爱工业智造基地与柔性生产线白皮书',
          version: 'v2.0.0',
          status: '已发布',
          category: '基础知识库 / 品牌实力',
          tags: ['外贸交付: 德国豪迈智造'],
          content: '工厂配备4条自动封边机及板件分拣仓。加工公差控制在±0.5mm以内，日均产能800标准柜体单元。'
        },
        afterSnapshot: {
          title: '品爱工业4.0智能制造基地与德国豪迈HOMAG柔性生产线白皮书',
          version: 'v2.2.0',
          status: '已发布',
          category: '基础知识库 / 品牌实力',
          tags: ['外贸交付: 德国豪迈智造', '材质: 激光无缝封边', '环保等级: ENF级无醛'],
          content: '工厂配备6条全自动智能封边加工中心、激光无缝封边系统及智能立体板件分拣仓储。加工公差严格控制在±0.3mm以内，日均产能达1500标准柜体单元，实现从CAD/CAM深化设计到数控机床生产数据无缝直通。'
        }
      }
    ]
  },

  // 2. 基础知识库 / 产品与技术百科 / 产品百科 / 柜类
  {
    id: 'KB-SERIES-01',
    title: '2026年度意式极简「米兰晨曦」全屋高端定制系列手册',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
    code: 'KB-SERIES-MILAN-01',
    version: 'v2.3.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-16',
    content: '「米兰晨曦」系列主打极窄边框铝框玻璃门、45度斜边免拉手工艺与超哑光准分子肤感烤漆门板。涵盖开放式中西岛台厨柜、通顶式悬浮衣帽间及格栅背板护墙系统，营造通透奢华的空间延伸感。',
    status: '已发布',
    viewCount: 1780,
    fileType: 'PDF',
    fileSize: '24.2 MB',
    chunksCount: 94,
    tags: ['风格: 意式极简', '色系: 曜石黑金', '材质: 爱格板(EGGER)']
  },
  {
    id: 'KB-SERIES-02',
    title: '新中式「东方印月」原木整装系列结构与选配工艺指南',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
    code: 'KB-SERIES-ORIENTAL-02',
    version: 'v1.8.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-10',
    content: '融合传统榫卯美学与现代五金阻尼，采用北美黑胡桃与特级白蜡木直拼板。表面采用植物木蜡油环保涂装，保留天然温润木纹肌理，标配实木格栅屏风与隐藏式中式茶台收纳系统。',
    status: '已发布',
    viewCount: 960,
    fileType: 'DOCX',
    fileSize: '6.4 MB',
    chunksCount: 46,
    tags: ['风格: 新中式', '材质: 多层实木板', '色系: 原木色系']
  },

  // 3. 基础知识库 / 产品与技术百科 / 产品百科 / 柜类
  {
    id: 'KB-BRAND-HARDWARE-01',
    title: '品爱PinAi与国际五金联名品牌（Blum百隆/海蒂诗/萨利切）供应链名录',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
    code: 'KB-BRAND-BLUM-01',
    version: 'v2.5.0',
    author: 'Chen Yi (陈总)',
    updatedAt: '2026-08-14',
    content: '品爱全球战略集采合作清单：奥地利Blum（百隆）全系顶级阻尼铰链、乐客抽屉系统；德国Hettich（海蒂诗）滑轨与电动开门器；意大利Salice（萨利切）气动上翻折叠支撑五金。均提供原厂溯源防伪码与20年质量质保承诺。',
    status: '已发布',
    viewCount: 2100,
    fileType: 'XLSX',
    fileSize: '3.1 MB',
    chunksCount: 38,
    tags: ['材质: 百隆Blum五金', '材质: 海蒂诗Hettich', '外贸交付: FOB条款']
  },
  {
    id: 'KB-BRAND-PANEL-02',
    title: '进口克诺斯邦（Kronospan）与爱格（EGGER）原厂正品溯源及授权书',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
    code: 'KB-BRAND-EGGER-02',
    version: 'v2.0.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-11',
    content: '奥地利EGGER爱格板与欧洲克诺斯邦全线同步引入，环保标准达到欧洲顶级F4星与EN 16516认证。同步木纹双饰面花色涵盖W1000白、H3303橡木、U999黑灰等海内外经典流行色系。',
    status: '已发布',
    viewCount: 1640,
    fileType: 'PDF',
    fileSize: '12.8 MB',
    chunksCount: 56,
    tags: ['材质: 爱格板(EGGER)', '材质: 克诺斯邦', '环保等级: 欧洲F4星']
  },

  // 4. 基础知识库 / 产品与技术百科 / 产品百科 / 柜类
  {
    id: 'KB-CABINET-01',
    title: '出口美欧外贸全屋定制家具通用规格与板材标准',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
    code: 'KB-FUR-2026-01',
    version: 'v2.4.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-15',
    content: '本规定涵盖出口北美及欧盟的所有柜体（橱柜、衣柜、浴室柜）的技术指标。强制采用E0级多层实木板/马尾松实木颗粒板。柜体厚度标准为18mm，背板5mm/9mm带双面三聚氰胺贴面。五金件默认配置DTC或Blum阻尼抽屉轨与门铰，所有暴露孔位须配备隐藏防尘盖。',
    status: '已发布',
    viewCount: 1420,
    fileType: 'PDF',
    fileSize: '14.8 MB',
    chunksCount: 142,
    tags: ['空间: 步入式衣帽间', '环保等级: E0级环保', '合规风控: CARB P2认证'],
    reviewStatus: 'approved',
    reviewer: 'Sophia (平台管理员)',
    reviewedAt: '2026-08-15 16:20:45',
    auditLogs: [
      {
        id: 'LOG-KB-003',
        articleId: 'KB-CABINET-01',
        operator: 'Sophia (主管/平台管理员)',
        operatorRole: '平台管理员',
        timestamp: '2026-08-15 16:20:45',
        action: 'approve',
        actionLabel: '平台管理员复核通过并发布',
        version: 'v2.4.0',
        wasPublished: true,
        reviewComment: '符合美欧外贸全屋柜体出口标准，环保检测指标完备，予以正式发布上线。',
        diffSummary: '复核通过，状态变更为【已发布】，版本号晋升为 v2.4.0',
        beforeSnapshot: {
          title: '出口美欧外贸全屋定制家具通用规格与板材标准',
          version: 'v2.3.0',
          status: '等待复核',
          category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
          content: '本规定涵盖出口北美及欧盟的所有柜体（橱柜、衣柜、浴室柜）的技术指标。强制采用E1级多层实木板。柜体厚度标准为16mm，背板5mm贴面。',
          tags: ['空间: 步入式衣帽间', '环保等级: E1级环保']
        },
        afterSnapshot: {
          title: '出口美欧外贸全屋定制家具通用规格与板材标准',
          version: 'v2.4.0',
          status: '已发布',
          category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
          content: '本规定涵盖出口北美及欧盟的所有柜体（橱柜、衣柜、浴室柜）的技术指标。强制采用E0级多层实木板/马尾松实木颗粒板。柜体厚度标准为18mm，背板5mm/9mm带双面三聚氰胺贴面。五金件默认配置DTC或Blum阻尼抽屉轨与门铰，所有暴露孔位须配备隐藏防尘盖。',
          tags: ['空间: 步入式衣帽间', '环保等级: E0级环保', '合规风控: CARB P2认证']
        }
      },
      {
        id: 'LOG-KB-002',
        articleId: 'KB-CABINET-01',
        operator: 'Alex (外贸业务员)',
        operatorRole: '业务录入员',
        timestamp: '2026-08-15 10:15:20',
        action: 'submit_review',
        actionLabel: '编辑正文与参数并提交复核',
        version: 'v2.3.0',
        wasPublished: false,
        diffSummary: '升级环保等级至E0/CARB P2标准，将柜体厚度从16mm加厚为18mm，添加防尘盖规范',
        beforeSnapshot: {
          title: '出口美欧外贸全屋定制家具通用规格与板材标准',
          version: 'v2.3.0',
          status: '已发布',
          category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
          content: '本规定涵盖出口北美及欧盟的所有柜体（橱柜、衣柜、浴室柜）的技术指标。强制采用E1级多层实木板。柜体厚度标准为16mm，背板5mm贴面。',
          tags: ['空间: 步入式衣帽间', '环保等级: E1级环保']
        },
        afterSnapshot: {
          title: '出口美欧外贸全屋定制家具通用规格与板材标准',
          version: 'v2.3.0',
          status: '等待复核',
          category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
          content: '本规定涵盖出口北美及欧盟的所有柜体（橱柜、衣柜、浴室柜）的技术指标。强制采用E0级多层实木板/马尾松实木颗粒板。柜体厚度标准为18mm，背板5mm/9mm带双面三聚氰胺贴面。五金件默认配置DTC或Blum阻尼抽屉轨与门铰，所有暴露孔位须配备隐藏防尘盖。',
          tags: ['空间: 步入式衣帽间', '环保等级: E0级环保', '合规风控: CARB P2认证']
        }
      },
      {
        id: 'LOG-KB-001',
        articleId: 'KB-CABINET-01',
        operator: 'Alex (外贸业务员)',
        operatorRole: '业务录入员',
        timestamp: '2026-07-20 09:30:00',
        action: 'create',
        actionLabel: '初始创建知识条目',
        version: 'v1.0.0',
        wasPublished: true,
        diffSummary: '首次录入美欧板材与柜体通用尺寸规范文档',
        afterSnapshot: {
          title: '出口美欧外贸全屋定制家具通用规格与板材标准',
          version: 'v1.0.0',
          status: '已发布',
          category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
          content: '本规定涵盖出口北美及欧盟的所有柜体（橱柜、衣柜、浴室柜）的技术指标。强制采用E1级多层实木板。柜体厚度标准为16mm，背板5mm贴面。',
          tags: ['空间: 步入式衣帽间', '环保等级: E1级环保']
        }
      }
    ]
  },
  {
    id: 'KB-CABINET-02',
    title: '全屋定制橱柜与步入式衣帽间收纳模数与内部功能五金安装规范',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 柜类',
    code: 'KB-CABINET-MOD-02',
    version: 'v2.1.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-13',
    content: '厨房地柜标准深度600mm，吊柜深度350mm；转角联动拉篮（小怪物/飞碟）安装间隙预留规范；步入式衣帽间裤架、升降衣通、密码首饰盒抽屉模数尺寸（宽450/600/900mm）标准化安装指南。',
    status: '已发布',
    viewCount: 1150,
    fileType: 'DOCX',
    fileSize: '7.2 MB',
    chunksCount: 62,
    tags: ['空间: 步入式衣帽间', '空间: 中西岛台厨柜', '材质: 百隆Blum五金']
  },

  // 5. 基础知识库 / 产品与技术百科 / 产品百科 / 门墙
  {
    id: 'KB-WALL-01',
    title: '外贸定制门墙一体化技术深化与金属收口规范',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 门墙',
    code: 'KB-WALL-2026-02',
    version: 'v2.2.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-17',
    content: '门墙系统采用挂板干挂铝合金龙骨卡扣工艺，保证基层平整度与热胀冷缩间隙。隐形门系统标配意大利隐形天地轴铰链与磁吸静音锁体，护墙板与门扇饰面采用同批次德国木皮UV涂装，严控色差ΔE<0.8。',
    status: '已发布',
    viewCount: 880,
    fileType: 'DOCX',
    fileSize: '6.8 MB',
    chunksCount: 74,
    tags: ['空间: 门墙一体', '风格: 极简轻奢', '材质: 碳晶木饰面']
  },
  {
    id: 'KB-WALL-02',
    title: '极简隐形门与碳晶木饰面护墙干挂铝合金龙骨施工节点图解',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 门墙',
    code: 'KB-WALL-NODE-02',
    version: 'v1.9.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-09',
    content: '详述护墙板阴阳角收口铝条节点、踢脚线内嵌内凹式极简发光工艺、悬挑背景墙承重龙骨加固标准及海外施工现场快速拼装卡件工法。',
    status: '已发布',
    viewCount: 750,
    fileType: 'PDF',
    fileSize: '15.4 MB',
    chunksCount: 58,
    tags: ['空间: 门墙一体', '风格: 意式极简', '材质: 碳晶木饰面']
  },

  // 6. 基础知识库 / 产品与技术百科 / 产品百科 / 门窗
  {
    id: 'KB-WINDOW-01',
    title: '断桥铝系统门窗外贸出口欧标CE认证与抗风压水密性检测报告',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 门窗',
    code: 'KB-WIN-CE-01',
    version: 'v2.0.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-12',
    content: '品爱系统门窗采用6063-T6高精级原生铝材，PA66GF25三道密封隔热条，整窗K值达到1.2 W/(㎡·K)。通过美标AAMA/WDMA及欧标EN 14351-1气密性8级、水密性6级、抗风压9级极限风压测试。',
    status: '已发布',
    viewCount: 920,
    fileType: 'PDF',
    fileSize: '16.2 MB',
    chunksCount: 65,
    tags: ['材质: 断桥铝系统门窗', '合规风控: 欧美CE/美标AAMA', '外贸交付: 打木架防震包装']
  },

  // 7. 基础知识库 / 产品与技术百科 / 产品百科 / 全卫
  {
    id: 'KB-BATH-01',
    title: '防潮多层实木智能浴室柜与一体化岩板台盆定制技术指南',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 全卫',
    code: 'KB-BATH-VANITY-01',
    version: 'v2.1.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-14',
    content: '针对海外沿海高湿度环境，全卫柜体采用双面覆膜防水多层桦木实木板，边部使用PUR防水胶无缝封边。配备智能除雾LED美妆镜柜、下水管道U型避让抽屉设计及大无缝一体烧结岩板台盆。',
    status: '已发布',
    viewCount: 1100,
    fileType: 'DOCX',
    fileSize: '5.8 MB',
    chunksCount: 48,
    tags: ['空间: 全卫浴室', '材质: 岩板一体台盆', '材质: 多层实木板']
  },

  // 8. 基础知识库 / 产品与技术百科 / 产品百科 / 智能对接
  {
    id: 'KB-SMART-01',
    title: '智能家居Zigbee/Tuya协议在全屋定制感应灯带与电动升降柜中的集成规范',
    category: '基础知识库 / 产品与技术百科 / 产品百科 / 智能对接',
    code: 'KB-SMART-IOT-01',
    version: 'v1.9.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-16',
    content: '规范全屋定制柜体内嵌COB无点光线型灯带（2700K-6000K无级调光）、人体雷达微波感应模块、电动智能升降吊柜与智能指纹锁柜的变压器隐藏走线与弱电集成标准，支持Apple HomeKit与Google Assistant联动。',
    status: '已发布',
    viewCount: 840,
    fileType: 'DOCX',
    fileSize: '4.9 MB',
    chunksCount: 42,
    tags: ['空间: 中西岛台厨柜', '风格: 现代简约', '材质: 智能弱电集成']
  },

  // 9. 基础知识库 / 产品与技术百科 / 产品组合 / 按低中高端
  {
    id: 'KB-TIER-01',
    title: '全屋定制经济型/舒适型/奢华型三大梯度材料配置与报价梯队对照表',
    category: '基础知识库 / 产品与技术百科 / 产品组合 / 按低中高端',
    code: 'KB-TIER-MATRIX-01',
    version: 'v2.2.0',
    author: 'Chen Yi (陈总)',
    updatedAt: '2026-08-11',
    content: '1. 经济型（Standard）：国产优质颗粒板+DTC阻尼五金+三聚氰胺饰面；\n2. 舒适型（Premium）：进口爱格/克诺斯邦+百隆Blum五金+PET高光/肤感门板；\n3. 奢华高定（Luxury）：多层实木/纯原木+萨利切+天然木皮真皮包覆+透光天然石。',
    status: '已发布',
    viewCount: 1650,
    fileType: 'XLSX',
    fileSize: '2.8 MB',
    chunksCount: 54,
    tags: ['材质: 爱格板(EGGER)', '材质: 百隆Blum五金', '环保等级: E0级环保']
  },

  // 10. 基础知识库 / 产品与技术百科 / 产品组合 / 按风格
  {
    id: 'KB-STYLE-COMBO-01',
    title: '主流外贸出海全屋定制六大风格（地中海/现代简约/意式极简等）搭配清单',
    category: '基础知识库 / 产品与技术百科 / 产品组合 / 按风格',
    code: 'KB-COMBO-STYLE-01',
    version: 'v2.3.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-13',
    content: '针对不同国家客户偏好提炼的风格套系：北美青睐现代过渡风（Transitional）与美式实木模压；中东及希腊沿海青睐地中海浪漫拱形与蓝白暖调；欧洲澳新偏爱北欧原木与极简无把手设计。',
    status: '已发布',
    viewCount: 1820,
    fileType: 'PDF',
    fileSize: '21.5 MB',
    chunksCount: 88,
    tags: ['风格: 地中海', '风格: 现代简约', '色系: 暖色调']
  },

  // 11. 基础知识库 / 产品与技术百科 / 产品组合 / 按预算
  {
    id: 'KB-BUDGET-01',
    title: '外贸工程单按总价预算（$10K/$30K/$80K+）全屋柜体与门墙配比推荐方案',
    category: '基础知识库 / 产品与技术百科 / 产品组合 / 按预算',
    code: 'KB-COMBO-BUDGET-01',
    version: 'v2.0.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-15',
    content: '为海外B端地产开发商与独立业主定制的预算分配模型：$10,000-$20,000入门全屋公寓包；$30,000-$50,000独栋别墅标配包；$80,000+超豪宅全案整装定制包的单方平米造价与用料配比。',
    status: '已发布',
    viewCount: 1390,
    fileType: 'XLSX',
    fileSize: '3.6 MB',
    chunksCount: 45,
    tags: ['空间: 独栋别墅', '空间: 大平层', '外贸交付: FOB条款']
  },

  // 12. 基础知识库 / 产品与技术百科 / 产品组合 / 按户型分类 / 按色系
  {
    id: 'KB-COLOR-COMBO-01',
    title: '全屋定制2026流行色系（暖色调/冷色调/大地暖灰/莫兰迪绿）色卡与样块指南',
    category: '基础知识库 / 产品与技术百科 / 产品组合 / 按户型分类 / 按色系',
    code: 'KB-COMBO-COLOR-01',
    version: 'v2.1.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-16',
    content: '提供小户型（暖色调浅奶咖反射采光）、大平层（冷色调黑灰与曜石黑金）、挑高别墅（莫兰迪绿与原木色系双拼）等不同户型与色系搭配的国际标准RAL/PANTONE色号对照表。',
    status: '已发布',
    viewCount: 1250,
    fileType: 'PDF',
    fileSize: '19.4 MB',
    chunksCount: 72,
    tags: ['色系: 暖色调', '色系: 冷色调', '色系: 莫兰迪绿']
  },

  // 13. 基础知识库 / 空间设计与美学案例库 / 按户型
  {
    id: 'KB-SPACE-LAYOUT-01',
    title: '大平层豪宅（200-500㎡）全屋动线规划与开放式客餐厅定制方案',
    category: '基础知识库 / 空间设计与美学案例库 / 按户型',
    code: 'KB-SPACE-LAYOUT-01',
    version: 'v2.2.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-17',
    content: '剖析大平层双动线（家政动线与主人动线）设计逻辑，包含洄游式社交中岛厨房、开放式红酒雪茄区定制展柜与全景落地窗地台储物休闲系统方案。',
    status: '已发布',
    viewCount: 1470,
    fileType: 'PDF',
    fileSize: '22.0 MB',
    chunksCount: 82,
    tags: ['空间: 大平层', '空间: 开放式客餐厅', '风格: 意式极简']
  },

  // 14. 基础知识库 / 空间设计与美学案例库 / 按风格
  {
    id: 'KB-SPACE-STYLE-01',
    title: '地中海浪漫风情与海景度假别墅整屋定制落地实景图鉴',
    category: '基础知识库 / 空间设计与美学案例库 / 按风格',
    code: 'KB-SPACE-STYLE-01',
    version: 'v2.4.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-15',
    content: '收录希腊圣托里尼与西班牙沿海度假别墅实景案例：浪漫圆拱门廊门套、浅砂岩暖色调肌理护墙板、复古黄铜做旧五金与天然橡木直拼台面，营造松弛自然的度假美学。',
    status: '已发布',
    viewCount: 2050,
    fileType: 'PDF',
    fileSize: '31.2 MB',
    chunksCount: 110,
    tags: ['风格: 地中海', '色系: 暖色调', '空间: 独栋别墅']
  },

  // 15. 基础知识库 / 空间设计与美学案例库 / 按色系
  {
    id: 'KB-SPACE-COLOR-01',
    title: '经典冷色调与黑白灰极简工业风全屋定制配色与灯光氛围指引',
    category: '基础知识库 / 空间设计与美学案例库 / 按色系',
    code: 'KB-SPACE-COLOR-01',
    version: 'v1.9.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-10',
    content: '展示炭黑哑光金属漆面、冷色调水泥浇筑质感面板与暖色3000K内嵌漫反射灯带的平衡美学。有效避免冷灰空间沉闷感，打造现代硬朗又不失温度的精英生活空间。',
    status: '已发布',
    viewCount: 1320,
    fileType: 'PDF',
    fileSize: '17.8 MB',
    chunksCount: 64,
    tags: ['色系: 冷色调', '色系: 经典黑白灰', '风格: 现代简约']
  },

  // 16. 基础知识库 / 空间设计与美学案例库 / 业主真实案例
  {
    id: 'KB-105',
    title: '迪拜帆船酒店海景公寓 480㎡ 全屋定制落地美学案例',
    category: '基础知识库 / 空间设计与美学案例库 / 业主真实案例',
    code: 'KB-CASE-2026-08',
    version: 'v2.0.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-16',
    content: '项目位于迪拜Marina核心区，包含开放式中西双厨、意式极简隐形门系统、智能感应步入式衣帽间及304不锈钢PVD电镀金属隔断。采用高温抗紫外线哑光烤漆门板，历经45天海运与现场装配，实现零破损一次性高标准交付。',
    status: '已发布',
    viewCount: 3100,
    fileType: 'PDF',
    fileSize: '28.5 MB',
    chunksCount: 196,
    tags: ['空间: 大平层', '风格: 意式极简', '色系: 曜石黑金']
  },
  {
    id: 'KB-CASE-02',
    title: '悉尼海湾独栋别墅 620㎡ 全案全屋定制海运与海外工人组装全纪实',
    category: '基础知识库 / 空间设计与美学案例库 / 业主真实案例',
    code: 'KB-CASE-SYDNEY-02',
    version: 'v2.2.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-14',
    content: '澳大利亚悉尼客户整栋别墅2个40HQ集装箱直装交付。全套使用AS/NZS澳洲认证低甲醛EO环保板材，品爱提供全套英文3D安装编号图解与视频指导，当地安装队14天高效完成全部组装验收。',
    status: '已发布',
    viewCount: 2240,
    fileType: 'PDF',
    fileSize: '25.6 MB',
    chunksCount: 130,
    tags: ['空间: 独栋别墅', '外贸交付: 40HQ整柜装箱', '环保等级: E0级环保']
  },

  // 17. 销售话术 / 跟进阶段话术 / 第一阶段：首次进店/咨询（破冰建信）
  {
    id: 'KB-103',
    title: '首次进店/线上咨询破冰话术：3分钟建立信任与需求画像',
    category: '销售话术 / 跟进阶段话术 / 第一阶段：首次进店/咨询（破冰建信）',
    code: 'KB-SALES-STAGE-01',
    version: 'v2.1.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-12',
    content: '【破冰金句】"Hello [Client Name], thank you for reaching out to PinAi Home! I noticed you are interested in modern custom cabinetry for your villa project. Are you looking for whole-house custom joinery or specific modular solutions like kitchen and walk-in closets?" 核心要点：明确项目类型、工期与预算区间，3分钟内完成客户等级S/A/B初判。',
    status: '已发布',
    viewCount: 1890,
    fileType: 'DOCX',
    fileSize: '4.2 MB',
    chunksCount: 85,
    tags: ['销售阶段: 首次进店破冰', '销售阶段: 痛点与需求挖掘']
  },
  {
    id: 'KB-STAGE-1-WHATSAPP',
    title: '海外WhatsApp与官网LiveChat进线10秒黄金首问与客户甄别话术',
    category: '销售话术 / 跟进阶段话术 / 第一阶段：首次进店/咨询（破冰建信）',
    code: 'KB-STAGE-1-CHAT',
    version: 'v2.3.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-18',
    content: '针对线上海外询盘的高转化模板：1. 快速确认国家/港口；2. 索取建筑平面CAD图纸；3. 告知品爱全球工程案例背书与免费3D深化设计支持，迅速引导添加WhatsApp进一步发送选色手册。',
    status: '已发布',
    viewCount: 1560,
    fileType: 'DOCX',
    fileSize: '3.8 MB',
    chunksCount: 60,
    tags: ['销售阶段: 首次进店破冰', '外贸交付: FOB条款']
  },

  // 18. 销售话术 / 跟进阶段话术 / 第二阶段：上门初测/复尺（痛点挖掘）
  {
    id: 'KB-STAGE-2-01',
    title: '外贸CAD图纸初审与海外现场激光测距复尺沟通专业话术清单',
    category: '销售话术 / 跟进阶段话术 / 第二阶段：上门初测/复尺（痛点挖掘）',
    code: 'KB-STAGE-02-SURVEY',
    version: 'v2.0.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-14',
    content: '【复尺引导话术】指导海外客户或其总包工人使用红外测距仪确认：1. 地面与天花水平倾斜度；2. 墙面垂直度公差；3. 燃气表/下水主管道/新风出风口避让尺寸。通过专业提问展现品爱严谨的工程把控能力。',
    status: '已发布',
    viewCount: 1430,
    fileType: 'DOCX',
    fileSize: '5.2 MB',
    chunksCount: 70,
    tags: ['销售阶段: 痛点与需求挖掘', '空间: 门墙一体']
  },

  // 19. 销售话术 / 跟进阶段话术 / 第三阶段：方案讲解/出图（美学引导）
  {
    id: 'KB-STAGE-3-01',
    title: '3D云渲染效果图远程在线投屏讲解与高级感美学引导话术模板',
    category: '销售话术 / 跟进阶段话术 / 第三阶段：方案讲解/出图（美学引导）',
    code: 'KB-STAGE-03-3D',
    version: 'v2.2.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-16',
    content: '【在线开会讲图话术】通过Zoom/Teams投屏3D全景模型时，重点引导客户体验：主灯关闭下的氛围灯效、橱柜下拉拉篮的人体工学高度、门墙同色一体化转角的视觉延伸感，以生活场景共情推动方案一次性过审。',
    status: '已发布',
    viewCount: 1680,
    fileType: 'DOCX',
    fileSize: '6.1 MB',
    chunksCount: 78,
    tags: ['销售阶段: 方案讲解与出图', '风格: 现代简约', '色系: 暖色调']
  },

  // 20. 销售话术 / 跟进阶段话术 / 第四阶段：逼单与谈判（临门一脚）
  {
    id: 'KB-STAGE-4-01',
    title: '外贸大客户海运订舱截止日前限时锁价与定金支付逼单话术',
    category: '销售话术 / 跟进阶段话术 / 第四阶段：逼单与谈判（临门一脚）',
    code: 'KB-STAGE-04-CLOSE',
    version: 'v2.4.0',
    author: 'Chen Yi (陈总)',
    updatedAt: '2026-08-17',
    content: '【临门逼单法】"Dear [Name], our production queue for next month shipping vessel is closing this Friday. Confirming your 30% deposit today will lock in current raw material pricing and guarantee container arrival before your interior deadline." 结合工厂排期紧张度与海运舱位涨价预期促成签约。',
    status: '已发布',
    viewCount: 2200,
    fileType: 'DOCX',
    fileSize: '4.5 MB',
    chunksCount: 82,
    tags: ['销售阶段: 逼单与谈判', '外贸交付: 40HQ整柜装箱']
  },

  // 21. 销售话术 / 跟进阶段话术 / 第五阶段：沉寂客户激活（长尾唤醒）
  {
    id: 'KB-STAGE-5-01',
    title: '海外沉睡客户30天/60天/90天多波次精准唤醒文案与展会邀请话术',
    category: '销售话术 / 跟进阶段话术 / 第五阶段：沉寂客户激活（长尾唤醒）',
    code: 'KB-STAGE-05-WAKE',
    version: 'v1.9.0',
    author: 'Elena Rostova (运营官)',
    updatedAt: '2026-08-15',
    content: '沉寂分层唤醒策略：第30天发送同区域类似户型竣工实拍视频；第60天免费寄送新季色板样品包（含DHL运单号主动关怀）；第90天以广交会/迪拜Big5展会专属VIP入场券和专属工厂折扣名义再次激活沟通。',
    status: '已发布',
    viewCount: 1350,
    fileType: 'DOCX',
    fileSize: '4.1 MB',
    chunksCount: 55,
    tags: ['销售阶段: 长尾客户激活', '外贸交付: CIF到港']
  },

  // 22. 销售话术 / 销售实战、竞对与风险控制 / 竞争对手话术
  {
    id: 'KB-COMBAT-RIVAL-01',
    title: '面对本地本土高价定制工坊 vs 品爱中国超级工厂性价比竞争截杀话术',
    category: '销售话术 / 销售实战、竞对与风险控制 / 竞争对手话术',
    code: 'KB-RIVAL-LOCAL-01',
    version: 'v2.2.0',
    author: 'Chen Yi (陈总)',
    updatedAt: '2026-08-16',
    content: '【截杀要点】海外本地小工坊通常手工制作、周期长（3-6个月）、造价极贵且无法做大尺寸激光封边。品爱拥有工业4.0数控高精设备，同等甚至更高配置总造价（含海运关税）仅为当地的40%-60%，且交付周期可控在30天内。',
    status: '已发布',
    viewCount: 1980,
    fileType: 'DOCX',
    fileSize: '5.5 MB',
    chunksCount: 76,
    tags: ['销售阶段: 竞对性价比防守', '外贸交付: 德国豪迈智造']
  },

  // 23. 销售话术 / 销售实战、竞对与风险控制 / 算价公式、权限与合同法务
  {
    id: 'KB-104',
    title: '外贸整柜定制阶梯报价折算法与外贸合同履约法务条例',
    category: '销售话术 / 销售实战、竞对与风险控制 / 算价公式、权限与合同法务',
    code: 'KB-LEGAL-2026-04',
    version: 'v1.9.0',
    author: 'Chen Yi (陈总)',
    updatedAt: '2026-08-14',
    content: '1. 阶梯算价模型：整柜（1*40HQ）标准柜体投影面积按¥680-1280/㎡基准计价，超出2个整柜享额外3%大客户折扣；\n2. FOB/CIF风险分界点与国际海事海运保险投保约定；\n3. CAD深化图纸签字确认后，生产排单周期与违约赔付上限条款细则。',
    status: '已发布',
    viewCount: 1120,
    fileType: 'XLSX',
    fileSize: '2.4 MB',
    chunksCount: 52,
    tags: ['外贸交付: FOB条款', '外贸交付: CIF到港', '外贸交付: 40HQ整柜装箱']
  },

  // 24. 销售话术 / 销售实战、竞对与风险控制 / 决策链攻防策略
  {
    id: 'KB-COMBAT-CHAIN-01',
    title: '海外工程项目甲方业主、设计事务所主创与总包施工方多方利益平衡话术',
    category: '销售话术 / 销售实战、竞对与风险控制 / 决策链攻防策略',
    code: 'KB-CHAIN-DECISION-01',
    version: 'v2.1.0',
    author: 'Chen Yi (陈总)',
    updatedAt: '2026-08-17',
    content: '【决策链攻防】针对设计师侧：强调品爱出图配合度高、色彩还原度达99%且保护其原创版权；针对施工方侧：强调预埋件模块化拼装、防呆卡扣设计节省其现场人工工时；针对业主侧：锁定环保FSC认证与总成本节约。',
    status: '已发布',
    viewCount: 1620,
    fileType: 'DOCX',
    fileSize: '5.9 MB',
    chunksCount: 68,
    tags: ['销售阶段: 方案讲解与出图', '合规风控: FSC产销监管链']
  },

  // 25. 全球合规与文化红线/禁用话术库 / 法律法规与通用禁用词表
  {
    id: 'KB-108',
    title: '欧盟与美国外贸广告宣传禁用词及反不当竞争合规清单',
    category: '全球合规与文化红线/禁用话术库 / 法律法规与通用禁用词表',
    code: 'KB-FORBIDDEN-LAWS-01',
    version: 'v2.0.0',
    author: 'Legal Dept (法务合规组)',
    updatedAt: '2026-08-18',
    content: '【禁用词清单】：\n1. 严禁在未获第三方认证前使用 "100% Zero Formaldehyde"（应规范表述为 "Ultra-low emission complying with US EPA TSCA Title VI"）；\n2. 禁止使用虚假绝对化用语如 "The Most Durable in the World"；\n3. 碳中和及环保可再生声明必须附带FSC/PEFC认证溯源码。',
    status: '已发布',
    viewCount: 1980,
    fileType: 'DOCX',
    fileSize: '4.8 MB',
    chunksCount: 42,
    tags: ['合规风控: 广告法禁用词', '合规风控: FSC产销监管链']
  },

  // 26. 全球合规与文化红线/禁用话术库 / 分区域文化与宗教禁忌红线 / 中东/伊斯兰市场
  {
    id: 'KB-107',
    title: '中东与海湾七国伊斯兰文化风俗与销售禁忌红线手册',
    category: '全球合规与文化红线/禁用话术库 / 分区域文化与宗教禁忌红线 / 中东/伊斯兰市场',
    code: 'KB-FORBIDDEN-MIDEAST-01',
    version: 'v1.5.0',
    author: 'Fatima (外贸合规专家)',
    updatedAt: '2026-08-19',
    content: '【严禁红线】：\n1. 严禁在定制方案或产品画册中使用具象人像雕刻、特定宗教图腾变形或涉及猪皮革材质（必须明确标注100%纯牛皮或超纤仿真皮）；\n2. 礼拜空间设计需严格预留麦加方向（Qibla）方位指引；\n3. 斋月期间商务沟通礼仪与时间禁忌规范。',
    status: '已发布',
    viewCount: 1650,
    fileType: 'DOCX',
    fileSize: '4.5 MB',
    chunksCount: 36,
    tags: ['合规风控: 中东宗教合规', '合规风控: 广告法禁用词']
  },

  // 27. 全球合规与文化红线/禁用话术库 / 分区域文化与宗教禁忌红线 / 欧美/北美市场
  {
    id: 'KB-FORBIDDEN-WEST-01',
    title: '欧美市场禁用童工、强迫劳动合规溯源声明与FSC森林环保监管要求',
    category: '全球合规与文化红线/禁用话术库 / 分区域文化与宗教禁忌红线 / 欧美/北美市场',
    code: 'KB-FORBIDDEN-WEST-01',
    version: 'v2.1.0',
    author: 'Legal Dept (法务合规组)',
    updatedAt: '2026-08-17',
    content: '【合规强制要求】：所有出口美国及欧盟实木原料必须具备FSC CoC产销监管链溯源证明；木质包装必须加盖IPPC熏蒸标识；遵守加州65号提案（Proposition 65）重金属限量标识法规。',
    status: '已发布',
    viewCount: 1520,
    fileType: 'PDF',
    fileSize: '13.2 MB',
    chunksCount: 50,
    tags: ['合规风控: 欧美PFAS禁令', '合规风控: FSC产销监管链', '环保等级: CARB P2认证']
  },

  // 28. 全球合规与文化红线/禁用话术库 / 分区域文化与宗教禁忌红线 / 东南亚/东亚市场
  {
    id: 'KB-FORBIDDEN-ASIA-01',
    title: '东南亚高湿热气候白蚁防虫防潮板材选型及当地风水禁忌指引',
    category: '全球合规与文化红线/禁用话术库 / 分区域文化与宗教禁忌红线 / 东南亚/东亚市场',
    code: 'KB-FORBIDDEN-ASIA-01',
    version: 'v1.8.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-15',
    content: '【东南亚与东亚规范】：\n1. 针对新马泰热带雨林气候，柜体强制采用防白蚁硼砂处理与防水多层板；\n2. 遵循华人家居风水禁忌：床头不宜对镜、进门不可直冲灶台、梁压顶隐藏包边方案；\n3. 日本市场严格执行JIS A 1460 F4星级超低甲醛（≤0.3mg/L）标准。',
    status: '已发布',
    viewCount: 1410,
    contentType: 'document',
    fileType: 'DOCX',
    fileSize: '5.1 MB',
    chunksCount: 44,
    tags: ['合规风控: 东南亚防白蚁', '环保等级: 欧洲F4星', '材质: 多层实木板'],
    attachmentFile: {
      name: '东南亚高湿热气候白蚁防虫防潮板材选型及当地风水禁忌指引.docx',
      size: '5.1 MB',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ext: 'docx'
    }
  },

  // 29. 视频知识库：意式极简隐形门与五金安装实操视频
  {
    id: 'KB-VIDEO-01',
    title: '【实操视频】2026意式极简隐形门与隐藏五金天地轴安装标准实录.mp4',
    category: '产品与技术百科 / 工艺结构百科 / 门墙柜一体化安装规范',
    code: 'KB-VID-DOOR-01',
    version: 'v1.2.0',
    author: 'Master Li (安装总监)',
    updatedAt: '2026-08-18',
    content: '【视频内容提炼与AI依据】：\n- 00:15 天地轴隐形合页预埋开槽公差必须控制在±0.5mm以内；\n- 02:30 磁吸静音锁体定位与门扇阻尼闭门器缓冲力度微调方法；\n- 05:40 护墙板与门套铝合金收口型材45度微缝对角拼接工艺要点；\n- 08:20 现场垂直度与激光水平仪校准检测及验收标准清单。',
    status: '已发布',
    viewCount: 2380,
    contentType: 'video',
    fileType: 'VIDEO',
    fileSize: '148.5 MB',
    chunksCount: 68,
    tags: ['五金配件: 隐藏式天地轴', '空间: 门墙一体', '风格: 意式极简'],
    videoInfo: {
      url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-with-wooden-furniture-41487-large.mp4',
      duration: '09分42秒',
      coverUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      sourceName: '工厂安装教学组实拍-4K',
      transcript: '大家好，今天我们演示2026年最新意式极简无框隐形门的天地轴与隐藏闭门器安装规范。首先使用激光水准仪对门洞进行三点找平，确保垂直度偏差小于1毫米...'
    }
  },

  // 30. PPT文档：新品全屋定制方案发布与外贸培训PPT
  {
    id: 'KB-PPT-01',
    title: '【培训PPT】2026米兰国际设计周全屋定制系列方案与高端选材推介',
    category: '销售话术与对齐百科 / 业务员标准跟进话术 / 方案讲解/出图（美学引导）',
    code: 'KB-PPT-MILAN-2026',
    version: 'v2.0.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-16',
    content: '【PPT核心章节纲要】：\n- Slide 1-8：2026米兰设计周三大设计哲学：原木侘寂、意式极简、光影系统；\n- Slide 9-16：爱格板（EGGER）与克诺斯邦（Kronospan）饰面肌理触感及哑光抗指纹技术优势；\n- Slide 17-24：海湾豪宅高定案例剖析——迪拜云溪港2000平独栋别墅全案实景；\n- Slide 25-32：外贸大单议价策略与交期CBM装柜优化方案。',
    status: '已发布',
    viewCount: 1890,
    contentType: 'document',
    fileType: 'PPTX',
    fileSize: '42.8 MB',
    chunksCount: 56,
    tags: ['风格: 意式极简', '材质: 爱格板(EGGER)', '空间: 大平层'],
    attachmentFile: {
      name: '2026米兰国际设计周全屋定制系列方案与高端选材推介.pptx',
      size: '42.8 MB',
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ext: 'pptx'
    }
  },

  // 31. Markdown 标准知识条款
  {
    id: 'KB-MD-01',
    title: '【Markdown规范】全屋定制板材防潮性能（24h吸水厚度膨胀率）测试标准与判定准则',
    category: '产品与技术百科 / 产品百科 / 按板材',
    code: 'KB-SPEC-EXPANSION-MD',
    version: 'v1.0.0',
    author: 'Quality Lab (品质中心)',
    updatedAt: '2026-08-19',
    content: '# 板材防潮性能（24小时吸水厚度膨胀率）测试规程\n\n## 1. 测试标准与环境依据\n- **参照国际标准**：EN 317 / ASTM D1037 / GB/T 17657-2013\n- **恒温恒湿水浴槽条件**：水温 (20 ± 1)°C，浸泡时间 24h ± 15min\n\n## 2. 各材质合格判定阈值\n| 板材类型 | 标准膨胀率上限 | 适用空间与气候 |\n| :--- | :--- | :--- |\n| 多层实木夹板 | ≤ 6.0% | 厨房地柜、浴室柜、热带多雨地区 |\n| 欧松板 (OSB-3) | ≤ 8.0% | 承重背板、护墙基底板 |\n| 进口爱格防潮刨花板 (P3/Hydro) | ≤ 9.5% | 全屋衣柜、餐边柜柜体 |\n| 普通刨花板 | ≤ 14.0% | 干燥卧室门板与挂板 |\n\n> ⚠️ **质检红线**：若吸水膨胀率超过 12%，严禁出具出口质检合格单，批次直接封存退回。',
    status: '已发布',
    viewCount: 920,
    contentType: 'markdown',
    fileType: 'MD',
    fileSize: '3.2 KB',
    chunksCount: 18,
    tags: ['语言: 中文 (简体/繁体)', '语言: 英语 (English)', '材质: 多层实木板', '材质: 爱格板(EGGER)', '环保等级: ENF级无醛']
  },

  // ============================================================================
  // 专业术语词汇表 (Glossary & Terminology Management)
  // ============================================================================
  // 32. 国际贸易与海运交付术语
  {
    id: 'KB-GLOSSARY-TRADE-01',
    title: '【词汇表】国际贸易海运与国际交付术语速查表 (Incoterms 2020 · FOB/CIF/DDP/EXW及海运装载术语)',
    category: '专业术语词汇表 / 国际贸易与海运交付术语 (Incoterms & Shipping)',
    code: 'KB-TERM-TRADE-01',
    version: 'v2.5.0',
    author: 'Franklin Jr (管理员)',
    updatedAt: '2026-08-19',
    content: `# 国际贸易海运与交付专业术语表 (Incoterms 2020)

针对外贸家居整装定制出口业务，以下为核心交付条款与国际物流术语标准定义、风险划分点及业务场景：

## 1. 国际贸易术语核心对照 (Trade Terms)
| 术语简称 | 英文全称 | 中文标准释义 | 风险转移界限 | 运费与保险承担方 | 常见适用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EXW** | Ex Works | 工厂交货 | 工厂出厂装车前 | 买方全权承担海运、保险与进出口清关 | 海外客户自指定国内货代自提 |
| **FOB** | Free on Board | 船上交货 (离岸价) | 货物在装运港装上指定船只后 | 买方订舱并承担海运费，卖方承担国内拖车与报关 | 最常用的外贸大宗标准条款 |
| **CIF** | Cost, Insurance and Freight | 成本加保险费、运费 (到岸价) | 货物在装运港越过船舷 | 卖方负责海运订舱与购买海运险 (最低险ICC-C) | 海外买家要求送达目的港口 |
| **CFR** | Cost and Freight | 成本加运费 | 货物在装运港装船 | 卖方负责海运订舱，买方自理海运保险 | 客户指定自身集团保险框架 |
| **DDP** | Delivered Duty Paid | 完税后交货 (双清包税到门) | 货物在买方指定目的地卸货前 | 卖方承担全程运费、保险、出口退税及进口关税 | 跨境电商独立站、高净值业主豪宅包办 |
| **DAP** | Delivered at Place | 目的地交货 (未完税) | 货物在指定目的地运载工具上 | 卖方承担运费至目的地，买方自理进口清关税费 | 工程项目海外当地承包商合作 |

## 2. 国际海运与集装箱装柜常用术语
- **CBM (Cubic Meter / 立方米)**：体积计量单位。全屋定制柜体按拆包装外箱长×宽×高(m)相乘累计计算。
- **20GP / 40HQ 集装箱**：
  - \`20GP\`（20尺普柜）：容积约 28-30 CBM，限重 18-22 吨；
  - \`40HQ\`（40尺高柜）：容积约 65-68 CBM，限重 22-26 吨（定制板材整柜主力箱型）。
- **FCL (Full Container Load / 整箱装载)**：独占集装箱，适合大平层/别墅全案订单。
- **LCL (Less than Container Load / 拼箱散货)**：与其他货主拼柜，板件必须强化全封闭免熏蒸胶合板木箱包装。
- **B/L (Bill of Lading / 海运提单)**：物权凭证；**Telex Release (电放提单)** 凭电放保函发货人放货。
- **Demurrage & Detention (滞港费 / 滞箱费)**：集装箱超期未清关提货产生的港口与船公司租金。
- **COO / Form E / Form A (原产地证)**：减免关税或自贸协定证明文件。

## 3. 外贸商谈与邮件标准化表达 (AI 自动对齐)
- *报价条款*："Our standard quotation is based on **FOB Shenzhen port**, packed with standard wooden crates."
- *提单通知*："Please find attached the **Surrendered Bill of Lading (Telex Release)** along with the **Packing List** and **Commercial Invoice**."`,
    status: '已发布',
    viewCount: 2450,
    contentType: 'markdown',
    fileType: 'MD',
    fileSize: '6.4 KB',
    chunksCount: 32,
    tags: ['语言: 英语 (English)', '语言: 中文 (简体/繁体)', '外贸交付: FOB条款', '外贸交付: CIF到港', '外贸交付: 双清包税DDP', '外贸交付: 40HQ整柜装箱']
  },

  // 33. 家具定制、材质与五金工艺术语
  {
    id: 'KB-GLOSSARY-FURNITURE-02',
    title: '【词汇表】全屋定制家具材质、板材基材与功能五金结构多语种术语库 (中/英/西/阿/德)',
    category: '专业术语词汇表 / 家具定制、材质与五金工艺术语 (Materials & Craft)',
    code: 'KB-TERM-FURN-02',
    version: 'v2.3.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-19',
    content: `# 全屋定制家具材质与五金工艺多语种术语词汇库

本词汇库涵盖外贸出海常用语种对照（中 / 英 / 西班牙 / 阿拉伯 / 德语），用于产品规格书、技术协议及多语种 AI 沟通：

## 1. 板材基材与饰面多语种对照表
| 中文术语 | 英文 (English) | 西班牙语 (Español) | 阿拉伯语 (العربية) | 德语 (Deutsch) | 核心技术规格与公差 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **多层实木夹板** | Plywood / Solid Wood Plywood | Madera contrachapada | خشب رقائقي متعدد الطبقات | Sperrholz / Multiplexplatte | 18mm/25mm 桦木/桉木交错层压，耐潮水膨胀率≤6% |
| **实木颗粒刨花板** | Particle Board / Chipboard | Tablero de partículas | خشب حبيبي مضغوط | Spanplatte (P2/P3) | 密度 650-720 kg/m³，表面高平整度 |
| **欧松板** | OSB (Oriented Strand Board) | Tablero de virutas orientadas | لوح الخشب الموجه (OSB) | Grobspanplatte (OSB-3) | 握钉力强，定向铺装无甲醛MDI胶水 |
| **三聚氰胺双饰面板** | Melamine Faced Board (MFC) | Tablero melamínico | لوح ميلامين مزدوج | Melaminharzbeschichtete Platte | 耐磨转数≥400转，耐高温耐划痕 |
| **肤感PET门板** | Skin-touch PET Board | Tablero PET tacto seda | لوح PET بملمس ناعم كالحرير | Anti-Fingerprint PET-Platte | 纳米抗指纹微晶涂层，光泽度<5GU |
| **高光UV烤漆板** | High-gloss UV Lacquer Board | Tablero lacado UV alto brillo | لوح طلاء للأشعة فوق البنفسجية لامع | Hochglanz-Lackplatte | 7底3面UV固化工艺，耐黄变等级≥4级 |
| **碳晶木饰面护墙板** | Carbon Crystal Wall Panel | Panel de pared de cristal de carbono | لوح حائط كريستال كربوني | Carbonkristall-Wandpaneel | 防火B1级，防潮防白蚁，干挂铝龙骨 |
| **烧结岩板台面** | Sintered Stone Countertop | Encimera de piedra sinterizada | سطح حجر متكلس رخامي | Sinterstein-Arbeitsplatte | 1200℃高温烧结，莫氏硬度6-7级，吸水率<0.02% |

## 2. 功能五金与机械结构多语种对照表
| 中文术语 | 英文 (English) | 西班牙语 (Español) | 阿拉伯语 (العربية) | 德语 (Deutsch) | 应用位置与配置 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **阻尼缓冲铰链** | Soft-closing Hinge | Bisagra con cierre suave | مفصلة هيدروليكية هادئة | Dämpfungsscharnier | 开启角度 105°/155°/170°，百隆Blum/海蒂诗 |
| **隐藏式托底抽屉滑轨** | Undermount Drawer Slide | Corredera oculta de montaje inferior | سكة درج مخفية سفلية | Unterflur-Schubkastenauszug | 承重 30-50kg，同步静音回弹带齿轮联动 |
| **天地轴隐形合页** | Pivot Hinge / Concealed Pivot | Bisagra pivotante oculta | مفصل محور مخفي للأبواب | Verdecktes Pivot-Türband | 隐形门/超高门板专配，双向调节±2mm |
| **反弹按压器** | Push-to-Open Latch | Sistema de apertura por presión | نظام دفع للفتح بالضغط | Druckschnäpper (Tip-on) | 无把手柜门极简设计，磁吸缓冲一体 |
| **双向阻尼移门滑轮** | Bi-directional Soft-close Sliding Roller | Rueda corredera con doble amortiguador | عجلات أبواب سحاب بفرامل مزدوجة | Schiebetürbeschlag mit Dämpfung | 承重80kg，上下防跳槽卡扣结构 |
| **激光PUR无缝封边** | PUR Seamless Laser Edge Banding | Canteado láser PUR sin juntas | شريط حواف PUR بتقنية الليزر | PUR-Nullfugenkante | 胶线厚度<0.05mm，耐湿热耐老化 |

## 3. 常见公差与装配术语
- **Clearance / Gap**：门缝拼装间隙（标准标准缝宽 2.0mm - 2.5mm）；
- **Dovetail Joint (燕尾榫)**：抽屉实木围板高强度结构；
- **Carcass (柜体)** vs **Front / Shutter (门板/面板)**；
- **Plinth / Kickboard (踢脚板)**：地柜底部可调脚挡水板，高度 80-100mm。`,
    status: '已发布',
    viewCount: 3120,
    contentType: 'markdown',
    fileType: 'MD',
    fileSize: '7.8 KB',
    chunksCount: 38,
    tags: ['语言: 英语 (English)', '语言: 西班牙语 (Español)', '语言: 阿拉伯语 (العربية)', '语言: 德语 (Deutsch)', '语言: 中文 (简体/繁体)', '材质: 多层实木板', '材质: 爱格板(EGGER)', '材质: 百隆Blum五金', '材质: 碳晶木饰面', '空间: 门墙一体']
  },

  // 34. 国际支付、外汇与信用证术语
  {
    id: 'KB-GLOSSARY-PAYMENT-03',
    title: '【词汇表】外贸国际结算、外汇金融与信用证(L/C)跟单标准术语释义表 (中英双语版)',
    category: '专业术语词汇表 / 国际支付、外汇与信用证术语 (Payment & Financial)',
    code: 'KB-TERM-PAY-03',
    version: 'v2.1.0',
    author: 'Chen Yi (陈总)',
    updatedAt: '2026-08-19',
    content: `# 国际外贸支付结算、外汇与信用证标准术语释义

本标准词汇表针对大宗外贸家居工程项目与渠道批发结算，规范财务、跟单与销售人员的术语理解：

## 1. 国际结算方式术语表
- **T/T (Telegraphic Transfer / 电汇)**：
  - *Standard Trade Term*：30% Advance Deposit by T/T upon order confirmation, 70% Balance payment before shipment (or against B/L copy).
  - *定金*：Advance Deposit / Down Payment；*尾款*：Balance Payment。
- **L/C (Letter of Credit / 信用证)**：银行信用担保付款凭证。
  - **Irrevocable At Sight L/C (不可撤销即期信用证)**：最稳健的信用证形式，开证行见符合要求的全套单据立即议付。
  - **Usance L/C (远期信用证)**：L/C 30/60/90 days after B/L date。需注意客户贴现利息与汇率波动风险。
  - **Revolving L/C (循环信用证)**：适合长期每月分批采购定制家具的连锁开发商。
- **D/P (Documents against Payment / 付款交单)**：买方银行只有在买方付清货款后方可将商业单据交由买方提货。
- **CAD (Cash Against Documents / 凭单付现)**：货运单据送达买方银行，买方见单付款赎单。
- **Escrow / Alibaba Trade Assurance (跨境第三方托管/信保)**：通过三方监管平台冻结预付款，买家确认签收无损后解冻放款。

## 2. 国际单证与外汇结算核心术语
- **PI (Proforma Invoice / 形式发票)**：具有法律约束力的预订合同，载明规格、价格、收款银行账号 (SWIFT Code, IBAN)。
- **CI (Commercial Invoice / 商业发票)**：报关与客户清关计税的正式发票。
- **PL (Packing List / 装箱单)**：详细列明箱号、毛重 (Gross Weight)、净重 (Net Weight)、体积 (CBM) 及包装箱数。
- **SWIFT Code (环球银行金融电信协会代码)** / **IBAN (国际银行账号)**：跨境收汇必备电汇代码。
- **Beneficiary (受益人)** vs **Applicant (开证申请人/买方)**。
- **Discrepancy (信用证不符点)**：单据字样与信用证条款不完全一致导致的拒付或扣减不符点费 (Discrepancy Fee: $50-$100/次)。
- **FX Hedging / Lock-in Exchange Rate (外汇套期保值与远期锁汇)**：规避人民币兑美元、欧元、阿联酋迪拉姆汇率波动的金融工具。`,
    status: '已发布',
    viewCount: 1850,
    contentType: 'document',
    fileType: 'DOCX',
    fileSize: '5.2 MB',
    chunksCount: 30,
    tags: ['语言: 英语 (English)', '语言: 中文 (简体/繁体)', '外贸交付: FOB条款', '合规风控: 广告法禁用词'],
    attachmentFile: {
      name: '外贸国际结算、外汇金融与信用证跟单标准术语释义表.docx',
      size: '5.2 MB',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ext: 'docx'
    }
  },

  // 35. 国际质量认证与绿色环保术语
  {
    id: 'KB-GLOSSARY-CERT-04',
    title: '【词汇表】全球绿色环保、防虫抗火与家具质量检测认证术语与标准解析库',
    category: '专业术语词汇表 / 国际质量认证与绿色环保术语 (Certifications & Eco)',
    code: 'KB-TERM-CERT-04',
    version: 'v2.4.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-19',
    content: `# 全球绿色环保认证与家具质量检测专业术语库

本标准库为欧美、中东、亚太等主流外贸市场的准入认证与技术门槛提供标准术语定义：

## 1. 欧美甲醛与挥发性有机物 (VOC) 环保标准
- **CARB Phase 2 (California Air Resources Board)**：加州空气资源委员会复合木制品严苛甲醛释放法规（刨花板≤0.09ppm，多层板≤0.05ppm）。
- **US EPA TSCA Title VI (Toxic Substances Control Act)**：美国环保署有毒物质控制法案第6章，全美强制执行。
- **ENF 级 (Zero-Added-Formaldehyde / 无醛添加)**：中国最新国标 GB/T 39600-2021 最高等级（甲醛释放量 ≤0.025 mg/m³）。
- **F☆☆☆☆ (JIS A 1460 F4星级)**：日本工业标准最高环保等级（甲醛释放量 ≤0.3 mg/L）。
- **PFAS-Free (无氟环保声明)**：欧盟 REACH 法规与美国多州禁止在布艺软包及板材防水防污涂层中使用全氟化合物。

## 2. 森林可持续与产销监管链认证
- **FSC CoC (Forest Stewardship Council - Chain of Custody)**：森林管理委员会产销监管链认证，确保每一块木材均来自合法采伐可持续人工林。
- **PEFC (Programme for the Endorsement of Forest Certification)**：森林认证认可计划。
- **IPPC / ISPM 15 (木质包装熏蒸与热处理印章)**：国际植物检疫标准，出口原木托盘必须加盖 "HT" (Heat Treatment) 标识。

## 3. 防火阻燃与力学安全测试术语
- **BS 5852 / BS 7176**：英国软体家具香烟与明火点火源 (Crib 5) 阻燃测试标准（工程酒店项目强制要求）。
- **CAL 117 (California Technical Bulletin 117-2013)**：加州阻燃软包测试标准。
- **CE EN 14351-1**：欧盟建筑门窗与五金系统合格准入认证。
- **ISTA-3A (International Safe Transit Association)**：国际安全运输协会集装箱包装跌落、振动与抗压综合测试。`,
    status: '已发布',
    viewCount: 2290,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '11.8 MB',
    chunksCount: 46,
    tags: ['语言: 英语 (English)', '语言: 中文 (简体/繁体)', '环保等级: CARB P2认证', '环保等级: FSC产销监管链', '环保等级: 欧洲F4星', '合规风控: 欧美PFAS禁令'],
    attachmentFile: {
      name: '全球绿色环保、防虫抗火与家具质量检测认证术语与标准解析库.pdf',
      size: '11.8 MB',
      type: 'application/pdf',
      ext: 'pdf'
    }
  },

  // 36. 外贸商务沟通与询盘报价术语
  {
    id: 'KB-GLOSSARY-COMM-05',
    title: '【词汇表】外贸B2B商务洽谈、询盘跟进与交期客诉多语种高频术语对照表 (中/英/西/阿/俄)',
    category: '专业术语词汇表 / 外贸商务沟通与询盘报价术语 (Business Inquiry & RFQ)',
    code: 'KB-TERM-RFQ-05',
    version: 'v2.0.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-19',
    content: `# 外贸B2B商务谈判、客诉与询盘沟通多语种术语库

涵盖外贸业务员从首次询盘、打样、图纸深化到交期排产与客诉售后全链路高频商务术语：

## 1. 商务接单与询盘核心术语对照
| 中文术语 | 英文 (English) | 西班牙语 (Español) | 阿拉伯语 (العربية) | 俄语 (Русский) | 业务定义与场景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **询价单** | RFQ (Request for Quotation) | Solicitud de cotización | طلب عرض أسعار (RFQ) | Запрос котировки | 客户发来的采购规格与数量清单 |
| **最小起订量** | MOQ (Minimum Order Quantity) | Cantidad mínima de pedido | الحد الأدنى للطلب (MOQ) | Минимальный объем заказа | 标准柜体 1 套起定，特注门板需满 50 ㎡ |
| **交期 / 货期** | Lead Time / Turnaround Time | Plazo de entrega | مهلة التصنيع والتسليم | Срок поставки / Изготовления | 常规生产交期 25-35 天（不含海运时间） |
| **深化施工图** | Shop Drawing / Millwork CAD | Planos de taller de ebanistería | مخططات التصنيع التنفيذية | Рабочие чертежи / Деталировка | 工厂生产与现场预埋依据的 1:1 施工图 |
| **打样样板间** | Mock-up Room / Prototype Sample | Muestra de prototipo / Habitación piloto | نموذج عينة الغرفة التجريبية | Макет / Образец комнаты | 大宗酒店/公寓工程签单前的实体打样 |
| **材质色卡皮册** | Swatch Book / Material Samples | Muestrario de acabados y telas | كتالوج عينات المواد والأقمشة | Каталог образцов материалов | 包含木皮、岩板、PET及皮布小样的便携册 |
| **不可抗力条款** | Force Majeure Clause | Cláusula de fuerza mayor | بند القوة القاهرة | Форс-мажорные обстоятельства | 台风、海运战争险、海关罢工免责条款 |
| **质保期限** | Warranty Period | Período de garantía | فترة الضمان المعتمدة | Гарантийный срок | 柜体五金结构质保 5-10 年承诺 |

## 2. 生产交付与客诉索赔术语
- **Discrepancy & Claim (不符点与客诉索赔)**：海外开箱若发现板件磕碰破损，买方需在收到货物 14 天内提交 Photo Proof（破损照片/条形码标识）；
- **Airfreight Replacement (空运补件)**：对于工程紧急缺失的核心五金或门板，工厂承诺 48 小时内快速补件并走 DHL/FedEx 国际空运；
- **Assembly Instruction / Knock-down Manual (KD组装说明书)**：3D 爆炸图拼装指引与防呆螺栓五金包编号清单。`,
    status: '已发布',
    viewCount: 2180,
    contentType: 'markdown',
    fileType: 'MD',
    fileSize: '6.9 KB',
    chunksCount: 35,
    tags: ['语言: 英语 (English)', '语言: 西班牙语 (Español)', '语言: 阿拉伯语 (العربية)', '语言: 俄语 (Русский)', '语言: 中文 (简体/繁体)', '销售阶段: 首次进店破冰', '销售阶段: 痛点与需求挖掘', '销售阶段: 逼单与谈判']
  },

  // ============================================================================
  // 营销活动 (Marketing Campaigns & Promotions)
  // ============================================================================
  // 37. 营销活动 / 限时促销与商务返点政策
  {
    id: 'KB-MKT-PROMO-01',
    title: '【营销方案】2026海外工程样板房上样补贴与首单定金膨胀促销执行案',
    category: '营销活动 / 限时促销与商务返点政策 / 海外样板房/展厅上样补贴政策',
    code: 'KB-MKT-PROMO-01',
    version: 'v1.5.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-18',
    content: `# 2026海外工程样板房上样补贴与首单定金膨胀促销方案

## 1. 活动背景与核心目的
针对海外中东、欧美及东南亚大型地产业主与工装设计公司，推出「首单样板房 1:1 实体补贴」政策，加速大宗工程订单落地。

## 2. 优惠政策与梯度返点
- **定金膨胀礼**：预付 $5,000 美金工程锁定定金，抵扣 $10,000 美金首柜大货货款；
- **样板房 50% 现金补贴**：大宗别墅群/公寓项目签约超 10 套柜体，前期样板间打样费用按 50% 直接在尾款中冲抵；
- **免费提供 3D 渲染与全套物料色卡箱**：随样品附赠价值 $800 的全套铝合金、木皮与 PET 色卡手提箱。

## 3. 适用时间与执行范围
- **有效时间**：2026-08-01 至 2026-11-30
- **适用对象**：海外注册工程总包、设计事务所及区域独家渠道代理商。`,
    status: '已发布',
    viewCount: 1940,
    contentType: 'document',
    fileType: 'DOCX',
    fileSize: '4.8 MB',
    chunksCount: 28,
    expiryType: 'custom',
    validityStartDate: '2026-08-01',
    validityEndDate: '2026-11-30',
    expiryDate: '2026-11-30',
    tags: ['活动类型: 样品间补贴', '活动类型: 定金膨胀', '外贸交付: FOB条款', '语言: 英语 (English)'],
    attachmentFile: {
      name: '2026海外工程样板房上样补贴与首单定金膨胀促销执行案.docx',
      size: '4.8 MB',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ext: 'docx'
    }
  },

  // 38. 营销活动 / 国际展会与海外招商专案
  {
    id: 'KB-MKT-EXPO-01',
    title: '【展会邀约】第138届中国进出口商品交易会（广交会）外贸全屋定制海外客商专享签约礼包与邀约指南',
    category: '营销活动 / 国际展会与海外招商专案 / 广交会 / 广州建博会专属邀约案',
    code: 'KB-MKT-EXPO-01',
    version: 'v2.0.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-19',
    content: `# 第138届广交会（Canton Fair）海外客商专属邀约与现场签约礼遇

## 1. 展位信息与接待安排
- **展位位置**：广交会琶洲展馆 11.2 号馆 B18-22（全屋定制国际展区）
- **工厂参观直通车**：展会期间每日 14:00 安排专属豪华商务车直达佛山 5 万㎡智能制造工业园现场验厂。

## 2. 现场签约五重豪礼
1. **海运装柜加固免费赠送**：现场签单免收 ISTA-3A 熏蒸木架包装加固费（单柜节省约 $1,200）；
2. **专属首席设计师驻场**：海外客户携带 CAD 建筑平面图可享受 2 小时极速 3D 方案初排；
3. **阶梯折扣**：签约满 1 个 40HQ 享受 95 折，满 3 个 40HQ 享受 92 折并赠送全套展厅样板。`,
    status: '已发布',
    viewCount: 2450,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '8.4 MB',
    chunksCount: 34,
    expiryType: 'custom',
    validityStartDate: '2026-09-01',
    validityEndDate: '2026-10-31',
    expiryDate: '2026-10-31',
    tags: ['活动类型: 展会特惠', '外贸交付: 40HQ整柜装箱', '语言: 英语 (English)', '语言: 阿拉伯语 (العربية)'],
    attachmentFile: {
      name: '第138届广交会外贸全屋定制客商专享签约礼包与邀约指南.pdf',
      size: '8.4 MB',
      type: 'application/pdf',
      ext: 'pdf'
    }
  },

  // 39. 营销活动 / 节假日与季度主题营销
  {
    id: 'KB-MKT-RAMADAN-01',
    title: '【节日大促】2026中东斋月（Ramadan）与海湾豪宅整装季联合促销方案及专属话术',
    category: '营销活动 / 节假日与季度主题营销 / 中东斋月与开斋节 (Ramadan) 专享方案',
    code: 'KB-MKT-RAMADAN-01',
    version: 'v2.1.0',
    author: 'Fatima (外贸合规专家)',
    updatedAt: '2026-08-19',
    content: `# 2026 中东斋月与开斋节 (Ramadan & Eid) 全屋定制专属促销案

## 1. 促销核心理念
在伊斯兰世界最神圣的斋月期间，以「Ramadan Kareem · 焕新奢居」为主题，主打家庭团聚场景的大空间中西双厨、祈祷室定制壁柜与宴客客餐厅定制方案。

## 2. 优惠权益
- **中东专享 88 折海运拼柜补贴**：发往迪拜 Jebel Ali、沙特 Dammam / Jeddah 及多哈 Hamad 港口航线享受专属海运贴息；
- **清真环保认证背书**：所有胶水与板材严格符合无酒精、无动物油脂成分认证，配发官方清真声明；
- **赠送黄金 PVD 金属收口条**：每个全案订单免费升级 304 不锈钢香槟金 PVD 隐形收口条。

## 3. 黄金跟进话术
"Ramadan Mubarak! May this holy month bring peace and prosperity to your family. In celebration of Ramadan, PinAi is delighted to extend our exclusive GCC Home Renovation Package with priority manufacturing slots and complimentary shipping protection for your villa project."`,
    status: '已发布',
    viewCount: 2890,
    contentType: 'markdown',
    fileType: 'MD',
    fileSize: '5.6 KB',
    chunksCount: 26,
    expiryType: 'custom',
    validityStartDate: '2026-02-15',
    validityEndDate: '2026-04-15',
    expiryDate: '2026-04-15',
    tags: ['活动类型: 节日大促', '合规风控: 中东宗教合规', '语言: 阿拉伯语 (العربية)', '语言: 英语 (English)', '空间: 独栋别墅']
  },

  // ============================================================================
  // 内部培训 (Internal Training & Onboarding)
  // ============================================================================
  // 40. 内部培训 / 新人入职通识与外贸全流程 SOP
  {
    id: 'KB-TRAIN-SOP-01',
    title: '【新人通识】外贸全屋定制大单全流程跟进与风控交付 SOP 培训手册',
    category: '内部培训 / 新人入职通识与外贸全流程 SOP / 外贸定制大单全流程跟进 SOP',
    code: 'KB-TRAIN-SOP-01',
    version: 'v2.6.0',
    author: 'Sophia (主管)',
    updatedAt: '2026-08-19',
    content: `# 外贸全屋定制大单全流程跟进与交付标准化 SOP

## 1. 业务全生命周期八步法
1. **线索初筛 (0-24h)**：判断买家画像（B2B 开发商 / 设计师 / 终端豪宅业主），确认图纸齐全度；
2. **CAD/BOQ 初步报价 (24-48h)**：根据板材体系（爱格/颗粒板/多层板）出具中英双语形式发票（PI）；
3. **收取定金与深化出图 (3-5天)**：确认 30% T/T 定金到账，安排结构工程师深化 1:1 拆单施工图；
4. **客户图纸与色卡签章确认**：制作样品色卡寄送 DHL，双方邮件盖章确认图纸与色号；
5. **工厂排产与生产质检 (20-30天)**：豪迈数控开料、激光封边、试装预拼并拍摄验货视频；
6. **包装与海运装柜**：打 5 层防潮膜与 ISTA-3A 木箱，拍摄装柜封条照片与装箱单（PL）；
7. **收回尾款与电放提单**：见 B/L 提单副本或装船前结清 70% 尾款，签发电放提单（Telex Release）；
8. **海外售后与组装指导**：提供 3D 拼装视频与全套零件编号清单，实时在线答疑。`,
    status: '已发布',
    viewCount: 3420,
    contentType: 'document',
    fileType: 'DOCX',
    fileSize: '9.2 MB',
    chunksCount: 42,
    expiryType: 'permanent',
    tags: ['培训阶段: 新人入门SOP', '外贸交付: FOB条款', '外贸交付: 40HQ整柜装箱', '语言: 中文 (简体/繁体)'],
    attachmentFile: {
      name: '外贸全屋定制大单全流程跟进与风控交付SOP培训手册.docx',
      size: '9.2 MB',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ext: 'docx'
    }
  },

  // 41. 内部培训 / 产品结构、板材选型与 CAD 深化实战
  {
    id: 'KB-TRAIN-CAD-01',
    title: '【设计进阶】全屋定制柜体模数、公差控制与 3D 渲染光影表现实操指引',
    category: '内部培训 / 产品结构、板材选型与 CAD 深化实战 / CAD 平面拆图与 3D 云渲染出图规范',
    code: 'KB-TRAIN-CAD-01',
    version: 'v2.2.0',
    author: 'David (结构工程师)',
    updatedAt: '2026-08-19',
    content: `# 全屋定制柜体模数化设计与高精度拆单规范

## 1. 核心结构公差红线
- **门缝与抽屉间隙**：标准预留 2.0mm - 2.5mm，铝框玻璃门需预留 3.0mm 防碰撞；
- **踢脚板退缩尺寸**：地柜底部踢脚板（Plinth）必须内缩 50mm，符合人体工学站立防踢脚；
- **转角盲区避让**：L型与U型转角必须预留 70mm 封边防撞条，确保门板与把手 90 度完全开启。

## 2. 3D 效果图灯光氛围渲染原则
- 统一采用 3500K-4000K 暖白光作为基础漫反射主光源；
- 柜内层板嵌入式 45 度斜角漫反射灯带需设为 3000K，突出材质温润木纹质感；
- 镜面与金属高光区域避免产生过曝死白，保持真实物理渲染（PBR）材质质感。`,
    status: '已发布',
    viewCount: 2680,
    contentType: 'document',
    fileType: 'PDF',
    fileSize: '15.6 MB',
    chunksCount: 36,
    expiryType: 'permanent',
    tags: ['培训阶段: CAD深化拆图', '培训阶段: 产品工艺进阶', '材质: 爱格板(EGGER)', '空间: 门墙一体'],
    attachmentFile: {
      name: '全屋定制柜体模数公差控制与3D渲染出图规范.pdf',
      size: '15.6 MB',
      type: 'application/pdf',
      ext: 'pdf'
    }
  },

  // 42. 内部培训 / 销冠技能实战演练与跨文化商务谈判
  {
    id: 'KB-TRAIN-SALES-01',
    title: '【销冠演练】面对中东与欧美高净值客户的异议化解话术与心理攻防策略',
    category: '内部培训 / 销冠技能实战演练与跨文化商务谈判 / 高净值客户异议化解与心理博弈',
    code: 'KB-TRAIN-SALES-01',
    version: 'v2.3.0',
    author: 'Alex (外贸业务员)',
    updatedAt: '2026-08-19',
    content: `# 面对海外高净值客户的高频异议化解与心理学实战策略

## 1. 常见异议应对模型：3F 法则 (Feel, Felt, Found)

### 异议场景一："Your price is 15% higher than another Chinese factory."
- **化解话术**："I completely understand why cost is a major consideration for your project (Feel). Many of our Australian and US interior clients initially had the exact same thought (Felt). However, when they evaluated our imported PUR laser edge-banding, FSC-certified zero-formaldehyde panels, and Blum hardware that guarantees 200,000 cycles with zero call-back repairs, they found that our total lifecycle installation cost and zero-damage ocean packaging actually saved them over 20% in overseas contractor labor (Found)."

### 异议场景二："Can we reduce the deposit to 10%?"
- **化解话术**："Because our custom furniture is 100% tailor-made to your unique architectural dimensions and cannot be resold, the 30% advance deposit is the standard threshold to lock your raw material procurement and reserve CNC production line capacity."`,
    status: '已发布',
    viewCount: 3820,
    contentType: 'markdown',
    fileType: 'MD',
    fileSize: '6.4 KB',
    chunksCount: 32,
    expiryType: 'permanent',
    tags: ['培训阶段: 销冠谈判攻防', '培训阶段: 跨文化沟通', '销售阶段: 逼单与谈判', '语言: 英语 (English)']
  },

  // 43. 运营素材库 / 社媒短视频分镜与实拍素材 / 家居展厅与工艺实拍原片
  {
    id: 'KB-OPS-ASSET-01',
    title: '【4K实拍】2026 意式轻奢衣帽间与岛台无缝激光封边工艺实拍视频源素材',
    category: '运营素材库 / 社媒短视频分镜与实拍素材 / 家居展厅与工艺实拍原片',
    code: 'KB-OPS-VID-01',
    version: 'v1.0.0',
    author: 'Marketing (运营团队)',
    updatedAt: '2026-08-26',
    content: `# 意式轻奢衣帽间 4K 展厅漫游与工艺细节实拍素材库

## 1. 镜头分镜清单 (Shot List)
- **镜头 1 (0:00-0:05)**: 广角推镜头进入全屋定制展厅，聚焦智能感应灯带亮起与玻璃铝框门反光质感。
- **镜头 2 (0:05-0:12)**: 微距特写德国豪迈 PUR 激光无缝封边（0.1mm肉眼不可见胶线对比传统EVA胶线）。
- **镜头 3 (0:12-0:20)**: 百隆 Blum 阻尼抽屉 50kg 承重顺滑推拉实测，展示内部天鹅绒首饰收纳分格。
- **镜头 4 (0:20-0:30)**: 外籍模特优雅走过岛台，展示整墙一体化隐形门与碳晶护墙板搭配效果。

## 2. 推荐营销文案旁白 (Voiceover EN)
*"Step into modern European elegance. Precision-crafted in our Industry 4.0 smart factory with zero-glue laser edge-banding and sustainable ENF-grade cores. Delivering luxury custom joinery worldwide."*`,
    status: '已发布',
    viewCount: 4210,
    contentType: 'markdown',
    fileType: 'VIDEO',
    fileSize: '128.4 MB',
    chunksCount: 28,
    expiryType: 'permanent',
    tags: ['素材类型: 4K实拍原片', '分发渠道: Instagram Reels', '风格: 意式极简', '材质: 爱格板(EGGER)']
  },

  // 44. 运营素材库 / 出海图文文案与海报视觉资产 / Instagram/LinkedIn 出海文案模板
  {
    id: 'KB-OPS-ASSET-02',
    title: '【出海推文】海外高端别墅全屋定制 B2B 采购意向激发推文文案与渲染图包',
    category: '运营素材库 / 出海图文文案与海报视觉资产 / Instagram/LinkedIn 出海文案模板',
    code: 'KB-OPS-PIC-02',
    version: 'v1.1.0',
    author: 'Marketing (运营团队)',
    updatedAt: '2026-08-25',
    content: `# B2B 海外工程与独栋豪宅定制高转化推文模版

## 1. LinkedIn B2B 深度贴文模板
**Headline**: *Are high overseas contractor costs and long cabinet lead times shrinking your project margins?*
**Body**:
As architectural builders and interior developers, you need precision, predictability, and uncompromising luxury. At HomeCraft Joinery:
- 🏭 150,000 sqm intelligent manufacturing base with German HOMAG CNC lines.
- 🌿 100% compliant with EPA TSCA Title VI & FSC certifications.
- 📦 Pre-assembled flat-pack ocean containers tested under ISTA-3A standards.
- ⏱️ Guaranteed 30-day production turnaround.

**CTA**: DM us or email project blueprints for a free 24-hour BOM estimate and 3D rendering package.

## 2. Instagram 极简美学排版与 Hashtag 标签组
#CustomCabinets #ArchitecturalMillwork #LuxuryInteriors #ModernWardrobe #B2BJoinery #VillaDesign #InteriorDesigners`,
    status: '已发布',
    viewCount: 3150,
    contentType: 'markdown',
    fileType: 'DOCX',
    fileSize: '3.8 MB',
    chunksCount: 22,
    expiryType: 'permanent',
    tags: ['素材类型: 出海文案模板', '分发渠道: LinkedIn', '分发渠道: Instagram', '语言: 英语 (English)']
  }
];

// Mock 5.4 Knowledge Base Tags (知识库成对标签管理：标签名与标签值)
export const initialKBTags: KBTag[] = [
  // 0. 运营素材库 - 素材类型 (公司官方内置)
  {
    id: 'TAG-OPS-MATERIAL-TYPE',
    name: '素材类型',
    values: ['4K实拍原片', '渲染效果图', '出海文案模板', '短视频分镜脚本', '买家秀评测', '展会海报源文件', '品牌画册电子版'],
    builtinValues: ['4K实拍原片', '渲染效果图', '出海文案模板', '短视频分镜脚本', '买家秀评测', '展会海报源文件', '品牌画册电子版'],
    color: 'purple',
    categoryGroup: '运营素材库',
    description: '运营素材多媒体格式与形态划分，涵盖实拍原片、高定渲染图、分镜脚本与出海文案等',
    isBuiltin: true,
    createdAt: '2026-08-20 09:00',
    updatedAt: '2026-08-26 14:30',
    creator: 'Sophia (主管)'
  },
  // 0.1 运营素材库 - 分发渠道 (公司官方内置)
  {
    id: 'TAG-OPS-CHANNELS',
    name: '分发渠道',
    values: ['Instagram', 'TikTok', 'LinkedIn', 'Pinterest', 'Facebook', 'YouTube', '官网博客/SEO'],
    builtinValues: ['Instagram', 'TikTok', 'LinkedIn', 'Pinterest', 'Facebook', 'YouTube', '官网博客/SEO'],
    color: 'rose',
    categoryGroup: '运营素材库',
    description: '海外社媒矩阵与全球数字获客分发平台',
    isBuiltin: true,
    createdAt: '2026-08-20 09:30',
    updatedAt: '2026-08-26 15:00',
    creator: 'Sophia (主管)'
  },
  // 0. 专业术语词汇表 - 语言 (公司官方内置 - 外贸出海核心语种)
  {
    id: 'TAG-LANG',
    name: '语言',
    values: [
      '英语 (English)',
      '西班牙语 (Español)',
      '阿拉伯语 (العربية)',
      '俄语 (Русский)',
      '法语 (Français)',
      '德语 (Deutsch)',
      '葡萄牙语 (Português)',
      '日语 (日本語)',
      '越南语 (Tiếng Việt)',
      '泰语 (ภาษาไทย)',
      '印尼语 (Bahasa Indonesia)',
      '中文 (简体/繁体)'
    ],
    builtinValues: [
      '英语 (English)',
      '西班牙语 (Español)',
      '阿拉伯语 (العربية)',
      '俄语 (Русский)',
      '法语 (Français)',
      '德语 (Deutsch)',
      '葡萄牙语 (Português)',
      '日语 (日本語)',
      '越南语 (Tiếng Việt)',
      '泰语 (ภาษาไทย)',
      '印尼语 (Bahasa Indonesia)',
      '中文 (简体/繁体)'
    ],
    color: 'indigo',
    categoryGroup: '专业术语词汇表',
    description: '外贸出海全语种支持标签体系，涵盖英语、西语、阿拉伯语、俄语、德法语、东南亚语系等，支持跨语言智能检索、多语种商谈话术对齐与AI翻译',
    isBuiltin: true,
    createdAt: '2026-08-01 07:30',
    updatedAt: '2026-08-19 14:00',
    creator: 'Sophia (主管)'
  },
  // 1. 营销活动 - 活动类型 (公司官方内置 - 营销活动专属标签体系)
  {
    id: 'TAG-MKT-TYPE',
    name: '活动类型',
    values: ['限时促销', '展会特惠', '样品间补贴', '定金膨胀', '节日大促', '清库特惠', '海外拼柜补贴'],
    builtinValues: ['限时促销', '展会特惠', '样品间补贴', '定金膨胀', '节日大促', '清库特惠', '海外拼柜补贴'],
    color: 'rose',
    categoryGroup: '营销活动',
    description: '营销与促销活动类型细分，用于区分展会、订舱限时直降、样板房补贴、定金膨胀等活动',
    isBuiltin: true,
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-19 15:00',
    creator: 'Sophia (主管)'
  },
  // 2. 内部培训 - 培训阶段 (公司官方内置 - 内部培训专属标签体系)
  {
    id: 'TAG-TRAIN-STAGE',
    name: '培训阶段',
    values: ['新人入门SOP', '产品工艺进阶', 'CAD深化拆图', '销冠谈判攻防', '跨文化沟通', '外贸合规实战'],
    builtinValues: ['新人入门SOP', '产品工艺进阶', 'CAD深化拆图', '销冠谈判攻防', '跨文化沟通', '外贸合规实战'],
    color: 'indigo',
    categoryGroup: '内部培训',
    description: '员工入职、专业产品技能与大单谈判进阶培训分层体系',
    isBuiltin: true,
    createdAt: '2026-08-01 08:30',
    updatedAt: '2026-08-19 15:30',
    creator: 'Sophia (主管)'
  },
  // 3. 基础知识库 - 风格 (公司官方内置)
  {
    id: 'TAG-STYLE',
    name: '风格',
    values: ['地中海', '现代简约', '意式极简', '极简轻奢', '新中式', '法式复古', '美式轻奢', '原木侘寂'],
    builtinValues: ['地中海', '现代简约', '意式极简', '极简轻奢', '新中式', '法式复古', '美式轻奢', '原木侘寂'],
    color: 'purple',
    categoryGroup: '基础知识库',
    description: '全屋定制主流设计风格，涵盖地中海、现代、意式、新中式等视觉美学流派',
    isBuiltin: true,
    createdAt: '2026-08-01 10:00',
    updatedAt: '2026-08-18 15:30',
    creator: 'Sophia (主管)'
  },
  // 2. 基础知识库 - 色系 (公司官方内置)
  {
    id: 'TAG-COLOR',
    name: '色系',
    values: ['暖色调', '冷色调', '经典黑白灰', '大地暖灰', '莫兰迪绿', '原木色系', '曜石黑金'],
    builtinValues: ['暖色调', '冷色调', '经典黑白灰', '大地暖灰', '莫兰迪绿', '原木色系', '曜石黑金'],
    color: 'amber',
    categoryGroup: '基础知识库',
    description: '空间色彩搭配基调，包含暖色调、冷色调、黑白灰、莫兰迪色系等色卡规划',
    isBuiltin: true,
    createdAt: '2026-08-01 10:30',
    updatedAt: '2026-08-18 16:00',
    creator: 'Sophia (主管)'
  },
  // 3. 基础知识库 - 空间 (公司官方内置)
  {
    id: 'TAG-SPACE',
    name: '空间',
    values: ['大平层', '独栋别墅', '开放式客餐厅', '中西岛台厨柜', '步入式衣帽间', '全卫浴室', '门墙一体'],
    builtinValues: ['大平层', '独栋别墅', '开放式客餐厅', '中西岛台厨柜', '步入式衣帽间', '全卫浴室', '门墙一体'],
    color: 'cyan',
    categoryGroup: '基础知识库',
    description: '定制场景与空间户型，涵盖独栋别墅、大平层、岛台厨柜、步入式衣帽间等',
    isBuiltin: true,
    createdAt: '2026-08-02 09:00',
    updatedAt: '2026-08-17 11:20',
    creator: 'David (结构工程师)'
  },
  // 4. 基础知识库 - 材质 (公司官方内置)
  {
    id: 'TAG-MATERIAL',
    name: '材质',
    values: ['多层实木板', '马尾松颗粒板', '爱格板(EGGER)', '克诺斯邦', '百隆Blum五金', '海蒂诗Hettich', '岩板一体台盆', '碳晶木饰面', '断桥铝系统门窗'],
    builtinValues: ['多层实木板', '马尾松颗粒板', '爱格板(EGGER)', '克诺斯邦', '百隆Blum五金', '海蒂诗Hettich', '岩板一体台盆', '碳晶木饰面', '断桥铝系统门窗'],
    color: 'blue',
    categoryGroup: '基础知识库',
    description: '基材板材、进口五金配件、饰面涂层及门窗系统材料选型库',
    isBuiltin: true,
    createdAt: '2026-08-01 11:00',
    updatedAt: '2026-08-18 14:00',
    creator: 'David (结构工程师)'
  },
  // 5. 基础知识库 - 环保等级 (公司官方内置)
  {
    id: 'TAG-ECO',
    name: '环保等级',
    values: ['E0级环保', 'ENF级无醛', '欧洲F4星', 'CARB P2认证', 'FSC产销监管链'],
    builtinValues: ['E0级环保', 'ENF级无醛', '欧洲F4星', 'CARB P2认证', 'FSC产销监管链'],
    color: 'emerald',
    categoryGroup: '基础知识库',
    description: '超低甲醛释放标准与国际森林认证，涵盖E0、ENF、日本F4星等严苛指标',
    isBuiltin: true,
    createdAt: '2026-08-01 08:30',
    updatedAt: '2026-08-18 09:15',
    creator: 'Sophia (主管)'
  },
  // 6. 销售话术 - 销售阶段 (公司官方内置)
  {
    id: 'TAG-SALES-STAGE',
    name: '销售阶段',
    values: ['首次进店破冰', '痛点与需求挖掘', '方案讲解与出图', '逼单与谈判', '长尾客户激活', '竞对性价比防守'],
    builtinValues: ['首次进店破冰', '痛点与需求挖掘', '方案讲解与出图', '逼单与谈判', '长尾客户激活', '竞对性价比防守'],
    color: 'rose',
    categoryGroup: '销售话术',
    description: '外贸全流程跟进阶段与谈判攻防，从进店破冰、图纸复尺到临门逼单与沉寂唤醒',
    isBuiltin: true,
    createdAt: '2026-08-01 14:00',
    updatedAt: '2026-08-18 10:30',
    creator: 'Alex (外贸业务员)'
  },
  // 7. 全球合规与文化红线/禁用话术库 - 合规风控 (公司官方内置)
  {
    id: 'TAG-COMPLIANCE',
    name: '合规风控',
    values: ['广告法禁用词', '中东宗教合规', '欧美PFAS禁令', '东南亚防白蚁', '海运ISTA-3A防震'],
    builtinValues: ['广告法禁用词', '中东宗教合规', '欧美PFAS禁令', '东南亚防白蚁', '海运ISTA-3A防震'],
    color: 'red',
    categoryGroup: '全球合规与文化红线/禁用话术库',
    description: '全球外贸出海文化禁忌、宗教礼仪红线、环保法规与广告法禁用词库',
    isBuiltin: true,
    createdAt: '2026-08-01 09:00',
    updatedAt: '2026-08-19 08:45',
    creator: 'Fatima (外贸合规专家)'
  },
  // 8. 基础知识库 - 外贸交付 (公司官方内置)
  {
    id: 'TAG-TRADE',
    name: '外贸交付',
    values: ['FOB条款', 'CIF到港', '打木架防震包装', '40HQ整柜装箱', '双清包税DDP', '全球交付网络', '德国豪迈智造'],
    builtinValues: ['FOB条款', 'CIF到港', '打木架防震包装', '40HQ整柜装箱', '双清包税DDP', '全球交付网络', '德国豪迈智造'],
    color: 'indigo',
    categoryGroup: '基础知识库',
    description: '国际海运贸易术语、整柜集装箱装载、防震木架打托与全球海外清关标准',
    isBuiltin: true,
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-18 09:00',
    creator: 'Franklin Jr (管理员)'
  },
  // 9. 通用 - 项目专案 (自定义示例)
  {
    id: 'TAG-CUSTOM-PROJECT',
    name: '项目专案',
    values: ['迪拜云溪港豪宅', '伦敦肯辛顿公寓', '加州硅谷样板房', '2026米兰设计周'],
    builtinValues: [],
    color: 'amber',
    categoryGroup: '通用',
    description: '团队内部自定的大客户工程专案与海外展会定制标识',
    isBuiltin: false,
    createdAt: '2026-08-16 16:00',
    updatedAt: '2026-08-19 11:20',
    creator: 'Alex (外贸业务员)'
  }
];

export const initialKBCategories: KBCategory[] = [
  // 1. 基础知识库 (开启管理员复核)
  {
    id: 'CAT-BASE',
    name: '基础知识库',
    code: 'KB-BASE',
    itemCount: 48,
    isBuiltin: true,
    requireReview: true,
    reviewTriggers: {
      onUpload: true,
      onEdit: true,
      onDelete: true
    },
    children: [
      {
        id: 'CAT-BASE-BRAND',
        name: '品牌实力',
        code: 'KB-BRAND',
        itemCount: 14,
        isBuiltin: true,
        requireReview: true
      },
      {
        id: 'CAT-BASE-PROD-TECH',
        name: '产品与技术百科',
        code: 'KB-PROD-TECH',
        itemCount: 22,
        isBuiltin: true,
        requireReview: true,
        children: [
          {
            id: 'CAT-BASE-PROD-ENCY',
            name: '产品百科',
            code: 'KB-PROD-ENCY',
            itemCount: 14,
            isBuiltin: true,
            requireReview: true,
            children: [
              { id: 'CAT-PROD-CABINET', name: '柜类', code: 'KB-ITEM-CABINET', itemCount: 5, isBuiltin: true, requireReview: true },
              { id: 'CAT-PROD-WALL', name: '门墙', code: 'KB-ITEM-WALL', itemCount: 3, isBuiltin: true, requireReview: true },
              { id: 'CAT-PROD-WINDOW', name: '门窗', code: 'KB-ITEM-WINDOW', itemCount: 2, isBuiltin: true, requireReview: false },
              { id: 'CAT-PROD-BATH', name: '全卫', code: 'KB-ITEM-BATH', itemCount: 2, isBuiltin: true, requireReview: true },
              { id: 'CAT-PROD-SMART', name: '智能对接', code: 'KB-ITEM-SMART', itemCount: 2, isBuiltin: true, requireReview: false }
            ]
          },
          {
            id: 'CAT-BASE-PROD-COMBO',
            name: '产品组合',
            code: 'KB-PROD-COMBO',
            itemCount: 8,
            isBuiltin: true,
            requireReview: false,
            children: [
              { id: 'CAT-PROD-TIER', name: '按低中高端', code: 'KB-COMBO-TIER', itemCount: 2, isBuiltin: true },
              { id: 'CAT-PROD-STYLE', name: '按风格', code: 'KB-COMBO-STYLE', itemCount: 2, isBuiltin: true },
              { id: 'CAT-PROD-BUDGET', name: '按预算', code: 'KB-COMBO-BUDGET', itemCount: 2, isBuiltin: true },
              {
                id: 'CAT-PROD-LAYOUT',
                name: '按户型分类',
                code: 'KB-COMBO-LAYOUT',
                itemCount: 2,
                isBuiltin: true,
                children: [
                  { id: 'CAT-PROD-COLOR', name: '按色系', code: 'KB-COMBO-COLOR', itemCount: 2, isBuiltin: true }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'CAT-BASE-SPACE-AESTHETICS',
        name: '空间设计与美学案例库',
        code: 'KB-SPACE-AESTHETICS',
        itemCount: 12,
        isBuiltin: true,
        requireReview: false,
        children: [
          { id: 'CAT-SPACE-LAYOUT', name: '按户型', code: 'KB-SPACE-LAYOUT', itemCount: 3, isBuiltin: true },
          { id: 'CAT-SPACE-STYLE', name: '按风格', code: 'KB-SPACE-STYLE', itemCount: 3, isBuiltin: true },
          { id: 'CAT-SPACE-COLOR', name: '按色系', code: 'KB-SPACE-COLOR', itemCount: 2, isBuiltin: true },
          { id: 'CAT-SPACE-REAL-CASES', name: '业主真实案例', code: 'KB-SPACE-CASES', itemCount: 4, isBuiltin: true }
        ]
      }
    ]
  },
  // 2. 销售话术 (开启管理员复核)
  {
    id: 'CAT-SALES-SCRIPTS',
    name: '销售话术',
    code: 'KB-SALES-SCRIPTS',
    itemCount: 36,
    isBuiltin: true,
    requireReview: true,
    reviewTriggers: {
      onUpload: true,
      onEdit: true,
      onDelete: true
    },
    children: [
      {
        id: 'CAT-SALES-STAGES',
        name: '跟进阶段话术',
        code: 'KB-STAGE-SCRIPTS',
        itemCount: 24,
        isBuiltin: true,
        children: [
          { id: 'CAT-STAGE-1', name: '第一阶段：首次进店/咨询（破冰建信）', code: 'KB-STAGE-01', itemCount: 5, isBuiltin: true },
          { id: 'CAT-STAGE-2', name: '第二阶段：上门初测/复尺（痛点挖掘）', code: 'KB-STAGE-02', itemCount: 5, isBuiltin: true },
          { id: 'CAT-STAGE-3', name: '第三阶段：方案讲解/出图（美学引导）', code: 'KB-STAGE-03', itemCount: 6, isBuiltin: true },
          { id: 'CAT-STAGE-4', name: '第四阶段：逼单与谈判（临门一脚）', code: 'KB-STAGE-04', itemCount: 5, isBuiltin: true },
          { id: 'CAT-STAGE-5', name: '第五阶段：沉寂客户激活（长尾唤醒）', code: 'KB-STAGE-05', itemCount: 3, isBuiltin: true }
        ]
      },
      {
        id: 'CAT-SALES-COMBAT',
        name: '销售实战、竞对与风险控制',
        code: 'KB-COMBAT-SCRIPTS',
        itemCount: 12,
        isBuiltin: true,
        children: [
          { id: 'CAT-COMBAT-COMPETITOR', name: '竞争对手话术', code: 'KB-COMBAT-RIVAL', itemCount: 4, isBuiltin: true },
          { id: 'CAT-COMBAT-PRICING-LEGAL', name: '算价公式、权限与合同法务', code: 'KB-COMBAT-LEGAL', itemCount: 5, isBuiltin: true },
          { id: 'CAT-COMBAT-DECISION-CHAIN', name: '决策链攻防策略', code: 'KB-COMBAT-STRATEGY', itemCount: 3, isBuiltin: true }
        ]
      }
    ]
  },
  // 3. 营销活动 (内置分类 - 放在销售话术后)
  {
    id: 'CAT-MARKETING-CAMPAIGNS',
    name: '营销活动',
    code: 'KB-MARKETING-CAMPAIGNS',
    itemCount: 18,
    isBuiltin: true,
    children: [
      {
        id: 'CAT-MKT-PROMO-POLICY',
        name: '限时促销与商务返点政策',
        code: 'KB-MKT-PROMO',
        itemCount: 6,
        isBuiltin: true,
        children: [
          { id: 'CAT-MKT-PROMO-CABINET', name: '全屋柜体首单定金膨胀方案', code: 'KB-MKT-PROMO-01', itemCount: 3, isBuiltin: true },
          { id: 'CAT-MKT-PROMO-SAMPLE', name: '海外样板房/展厅上样补贴政策', code: 'KB-MKT-PROMO-02', itemCount: 3, isBuiltin: true }
        ]
      },
      {
        id: 'CAT-MKT-EXPO-EVENTS',
        name: '国际展会与海外招商专案',
        code: 'KB-MKT-EXPO',
        itemCount: 6,
        isBuiltin: true,
        children: [
          { id: 'CAT-MKT-EXPO-CANTON', name: '广交会 / 广州建博会专属邀约案', code: 'KB-MKT-EXPO-01', itemCount: 3, isBuiltin: true },
          { id: 'CAT-MKT-EXPO-OVERSEAS', name: '中东五大行业展 (Big 5 Dubai) 获客案', code: 'KB-MKT-EXPO-02', itemCount: 3, isBuiltin: true }
        ]
      },
      {
        id: 'CAT-MKT-SEASONAL-FEST',
        name: '节假日与季度主题营销',
        code: 'KB-MKT-SEASONAL',
        itemCount: 6,
        isBuiltin: true,
        children: [
          { id: 'CAT-MKT-SEASON-RAMADAN', name: '中东斋月与开斋节 (Ramadan) 专享方案', code: 'KB-MKT-SEASON-01', itemCount: 3, isBuiltin: true },
          { id: 'CAT-MKT-SEASON-BLACKFRIDAY', name: '欧美黑五/圣诞年终筑家焕新季', code: 'KB-MKT-SEASON-02', itemCount: 3, isBuiltin: true }
        ]
      }
    ]
  },
  // 4. 全球合规与文化红线/禁用话术库
  {
    id: 'CAT-COMPLIANCE-FORBIDDEN-TOP',
    name: '全球合规与文化红线/禁用话术库',
    code: 'KB-FORBIDDEN-SCRIPTS',
    itemCount: 15,
    isBuiltin: true,
    children: [
      {
        id: 'CAT-FORBIDDEN-LAWS',
        name: '法律法规与通用禁用词表',
        code: 'KB-FORBIDDEN-LAWS',
        itemCount: 6,
        isBuiltin: true
      },
      {
        id: 'CAT-FORBIDDEN-CULTURE-RELIGION',
        name: '分区域文化与宗教禁忌红线',
        code: 'KB-FORBIDDEN-REGIONS',
        itemCount: 9,
        isBuiltin: true,
        children: [
          { id: 'CAT-FORBIDDEN-MIDEAST', name: '中东/伊斯兰市场', code: 'KB-FORBIDDEN-MIDEAST', itemCount: 3, isBuiltin: true },
          { id: 'CAT-FORBIDDEN-WEST', name: '欧美/北美市场', code: 'KB-FORBIDDEN-WEST', itemCount: 3, isBuiltin: true },
          { id: 'CAT-FORBIDDEN-ASIA', name: '东南亚/东亚市场', code: 'KB-FORBIDDEN-ASIA', itemCount: 3, isBuiltin: true }
        ]
      }
    ]
  },
  // 5. 专业术语词汇表 (内置专业分类 - 外贸与家居术语管理)
  {
    id: 'CAT-GLOSSARY-ROOT',
    name: '专业术语词汇表',
    code: 'KB-GLOSSARY',
    itemCount: 32,
    isBuiltin: true,
    children: [
      {
        id: 'CAT-GLOSSARY-TRADE',
        name: '国际贸易与海运交付术语 (Incoterms & Shipping)',
        code: 'KB-GLOSSARY-TRADE',
        itemCount: 8,
        isBuiltin: true
      },
      {
        id: 'CAT-GLOSSARY-FURNITURE',
        name: '家具定制、材质与五金工艺术语 (Materials & Craft)',
        code: 'KB-GLOSSARY-FURNITURE',
        itemCount: 8,
        isBuiltin: true
      },
      {
        id: 'CAT-GLOSSARY-PAYMENT',
        name: '国际支付、外汇与信用证术语 (Payment & Financial)',
        code: 'KB-GLOSSARY-PAYMENT',
        itemCount: 6,
        isBuiltin: true
      },
      {
        id: 'CAT-GLOSSARY-CERT',
        name: '国际质量认证与绿色环保术语 (Certifications & Eco)',
        code: 'KB-GLOSSARY-CERT',
        itemCount: 5,
        isBuiltin: true
      },
      {
        id: 'CAT-GLOSSARY-COMM',
        name: '外贸商务沟通与询盘报价术语 (Business Inquiry & RFQ)',
        code: 'KB-GLOSSARY-COMM',
        itemCount: 5,
        isBuiltin: true
      }
    ]
  },
  // 6. 内部培训 (内置分类 - 放在专业术语词汇表后)
  {
    id: 'CAT-INTERNAL-TRAINING',
    name: '内部培训',
    code: 'KB-INTERNAL-TRAINING',
    itemCount: 22,
    isBuiltin: true,
    children: [
      {
        id: 'CAT-TRAIN-ONBOARDING',
        name: '新人入职通识与外贸全流程 SOP',
        code: 'KB-TRAIN-ONBOARD',
        itemCount: 7,
        isBuiltin: true,
        children: [
          { id: 'CAT-TRAIN-SOP-FLOW', name: '外贸定制大单全流程跟进 SOP', code: 'KB-TRAIN-SOP-01', itemCount: 4, isBuiltin: true },
          { id: 'CAT-TRAIN-CORP-CULTURE', name: '品牌历史、产能优势与全案能力', code: 'KB-TRAIN-SOP-02', itemCount: 3, isBuiltin: true }
        ]
      },
      {
        id: 'CAT-TRAIN-PRODUCT-DESIGN',
        name: '产品结构、板材选型与 CAD 深化实战',
        code: 'KB-TRAIN-PROD-DESIGN',
        itemCount: 8,
        isBuiltin: true,
        children: [
          { id: 'CAT-TRAIN-CAD-STANDARD', name: 'CAD 平面拆图与 3D 云渲染出图规范', code: 'KB-TRAIN-CAD-01', itemCount: 4, isBuiltin: true },
          { id: 'CAT-TRAIN-HARDWARE-PRACTICE', name: '五金受力计算与激光无缝封边实操', code: 'KB-TRAIN-CAD-02', itemCount: 4, isBuiltin: true }
        ]
      },
      {
        id: 'CAT-TRAIN-SALES-CHAMPION',
        name: '销冠技能实战演练与跨文化商务谈判',
        code: 'KB-TRAIN-SALES',
        itemCount: 7,
        isBuiltin: true,
        children: [
          { id: 'CAT-TRAIN-NEGOTIATION', name: '高净值客户异议化解与心理博弈', code: 'KB-TRAIN-SALES-01', itemCount: 4, isBuiltin: true },
          { id: 'CAT-TRAIN-CROSS-CULTURE', name: '跨文化商务礼仪与多语种洽谈演练', code: 'KB-TRAIN-SALES-02', itemCount: 3, isBuiltin: true }
        ]
      }
    ]
  },
  // 7. 运营素材库 (内置一级分类 - 社媒短视频、出海图文与买家秀资产)
  {
    id: 'CAT-OPERATIONS-ASSETS',
    name: '运营素材库',
    code: 'KB-OPERATIONS-ASSETS',
    itemCount: 26,
    isBuiltin: true,
    requireReview: false,
    reviewTriggers: {
      onUpload: true,
      onEdit: false,
      onDelete: true
    },
    children: [
      {
        id: 'CAT-OPS-VIDEOS',
        name: '社媒短视频分镜与实拍素材',
        code: 'KB-OPS-VIDEO',
        itemCount: 12,
        isBuiltin: true,
        children: [
          { id: 'CAT-OPS-VIDEO-SHOWROOM', name: '家居展厅与工艺实拍原片', code: 'KB-OPS-VID-01', itemCount: 4, isBuiltin: true },
          { id: 'CAT-OPS-VIDEO-FACTORY', name: '工业4.0数控智造车间镜头', code: 'KB-OPS-VID-02', itemCount: 4, isBuiltin: true },
          { id: 'CAT-OPS-VIDEO-SCRIPTS', name: '出海爆款短视频旁白与分镜脚本', code: 'KB-OPS-VID-03', itemCount: 4, isBuiltin: true }
        ]
      },
      {
        id: 'CAT-OPS-GRAPHICS',
        name: '出海图文文案与海报视觉资产',
        code: 'KB-OPS-GRAPHIC',
        itemCount: 10,
        isBuiltin: true,
        children: [
          { id: 'CAT-OPS-GRAPHIC-RENDERS', name: '高定全案 3D 渲染效果图库', code: 'KB-OPS-PIC-01', itemCount: 4, isBuiltin: true },
          { id: 'CAT-OPS-GRAPHIC-POSTS', name: 'Instagram/LinkedIn 出海文案模板', code: 'KB-OPS-PIC-02', itemCount: 3, isBuiltin: true },
          { id: 'CAT-OPS-GRAPHIC-POSTERS', name: '海外展会与促销活动海报源文件', code: 'KB-OPS-PIC-03', itemCount: 3, isBuiltin: true }
        ]
      },
      {
        id: 'CAT-OPS-SHOWCASE',
        name: '海外客户买家秀与红人评测库',
        code: 'KB-OPS-SHOWCASE',
        itemCount: 6,
        isBuiltin: true,
        children: [
          { id: 'CAT-OPS-SHOWCASE-INFLUENCER', name: '海外设计师/KOL 开箱评测实拍', code: 'KB-OPS-CASE-01', itemCount: 3, isBuiltin: true },
          { id: 'CAT-OPS-SHOWCASE-RESIDENCE', name: '全球海外豪宅实景交付案例集', code: 'KB-OPS-CASE-02', itemCount: 3, isBuiltin: true }
        ]
      }
    ]
  }
];

export const initialKBVersions: KBVersion[] = [
  {
    version: 'v2.4.0',
    releaseDate: '2026-08-15',
    author: 'Sophia',
    changeLog: '新增 2026 欧盟环保 PFAS 限制条款；更新实木门板哑光漆含水率控制标准 (8%-12%)。',
    articleCount: 41
  },
  {
    version: 'v2.3.0',
    releaseDate: '2026-06-01',
    author: 'Alex',
    changeLog: '补充北美 ISTA 3A 集装箱装载跌落标准；增加多国语种 AI 自动答复关键词库。',
    articleCount: 38
  }
];

// Mock 6.1 Data Analytics (数据统计)
export const initialAgentStats: AgentStatMetric[] = [
  { date: '08-11', salesInquiriesHandled: 42, salesAiResolutionRate: 88, marketingPostsGenerated: 12, marketingInquiryLeads: 24, avgResponseSeconds: 4.2 },
  { date: '08-12', salesInquiriesHandled: 58, salesAiResolutionRate: 91, marketingPostsGenerated: 18, marketingInquiryLeads: 35, avgResponseSeconds: 3.8 },
  { date: '08-13', salesInquiriesHandled: 65, salesAiResolutionRate: 94, marketingPostsGenerated: 15, marketingInquiryLeads: 41, avgResponseSeconds: 3.5 },
  { date: '08-14', salesInquiriesHandled: 50, salesAiResolutionRate: 89, marketingPostsGenerated: 22, marketingInquiryLeads: 38, avgResponseSeconds: 4.0 },
  { date: '08-15', salesInquiriesHandled: 72, salesAiResolutionRate: 96, marketingPostsGenerated: 28, marketingInquiryLeads: 56, avgResponseSeconds: 3.1 },
  { date: '08-16', salesInquiriesHandled: 84, salesAiResolutionRate: 95, marketingPostsGenerated: 31, marketingInquiryLeads: 68, avgResponseSeconds: 2.9 },
  { date: '08-17', salesInquiriesHandled: 91, salesAiResolutionRate: 97, marketingPostsGenerated: 35, marketingInquiryLeads: 82, avgResponseSeconds: 2.6 }
];

// Mock WeCom Organization Structure Tree (企业微信组织架构 - 严格对照截图)
export const initialOrgTree: OrgDeptNode[] = [
  {
    id: 'product_center',
    name: '产品中心',
    hasChildren: true,
    children: [
      { id: 'design_dept', name: '设计部', parentId: 'product_center', hasChildren: false },
      { id: 'pm_dept', name: '产品管理部', parentId: 'product_center', hasChildren: false },
      { id: 'research_inst', name: '研究所', parentId: 'product_center', hasChildren: false },
      { id: 'marketing_dept', name: '市场部', parentId: 'product_center', hasChildren: false }
    ]
  },
  {
    id: 'mfg_center',
    name: '制造中心',
    hasChildren: true,
    children: [
      { id: 'mfg_assembly', name: '装配车间', parentId: 'mfg_center', hasChildren: false },
      { id: 'mfg_supply', name: '供应链部', parentId: 'mfg_center', hasChildren: false }
    ]
  },
  {
    id: 'qa_center',
    name: '流程与质量',
    hasChildren: true,
    children: [
      { id: 'qa_qc', name: '品质控制部', parentId: 'qa_center', hasChildren: false },
      { id: 'qa_audit', name: '流程体系部', parentId: 'qa_center', hasChildren: false }
    ]
  },
  {
    id: 'hr_center',
    name: '人力行政',
    hasChildren: true,
    children: [
      { id: 'hr_recruitment', name: '招聘与培训组', parentId: 'hr_center', hasChildren: false },
      { id: 'hr_admin', name: '行政综合组', parentId: 'hr_center', hasChildren: false }
    ]
  },
  {
    id: 'it_center',
    name: '信息',
    hasChildren: true,
    children: [
      { id: 'it_infra', name: '系统网络组', parentId: 'it_center', hasChildren: false },
      { id: 'it_apps', name: '企业信息化组', parentId: 'it_center', hasChildren: false }
    ]
  },
  {
    id: 'aftersales_center',
    name: '售后',
    hasChildren: true,
    children: [
      { id: 'aftersales_tech', name: '技术支持部', parentId: 'aftersales_center', hasChildren: false },
      { id: 'aftersales_svc', name: '客户服务部', parentId: 'aftersales_center', hasChildren: false }
    ]
  },
  {
    id: 'fin_center',
    name: '财务',
    hasChildren: true,
    children: [
      { id: 'fin_acc', name: '财务核算部', parentId: 'fin_center', hasChildren: false },
      { id: 'fin_tax', name: '税务与资金部', parentId: 'fin_center', hasChildren: false }
    ]
  }
];

// Flat list for compatibility & count
export const initialWeComDepts: WeComDept[] = [
  { id: 'product_center', name: '产品中心', memberCount: 8, hasChildren: true },
  { id: 'design_dept', name: '设计部', parentId: 'product_center', memberCount: 2, hasChildren: false },
  { id: 'pm_dept', name: '产品管理部', parentId: 'product_center', memberCount: 2, hasChildren: false },
  { id: 'research_inst', name: '研究所', parentId: 'product_center', memberCount: 1, hasChildren: false },
  { id: 'marketing_dept', name: '市场部', parentId: 'product_center', memberCount: 2, hasChildren: false },
  { id: 'mfg_center', name: '制造中心', memberCount: 2, hasChildren: true },
  { id: 'qa_center', name: '流程与质量', memberCount: 1, hasChildren: true },
  { id: 'hr_center', name: '人力行政', memberCount: 1, hasChildren: true },
  { id: 'it_center', name: '信息', memberCount: 1, hasChildren: true },
  { id: 'aftersales_center', name: '售后', memberCount: 1, hasChildren: true },
  { id: 'fin_center', name: '财务', memberCount: 1, hasChildren: true }
];

// Mock 7.1 & 7.2 Employees & Roles (员工权限 - 对接企业微信通讯录)
export const initialEmployees: EmployeeItem[] = [
  {
    id: 'EMP-001',
    name: '陈逸',
    email: '379411495chenyi@gmail.com',
    department: '产品中心',
    deptId: 'product_center',
    deptPath: '产品中心',
    isDeptLeader: true,
    wecomUserId: 'ChenYi_001',
    wecomMobile: '13800138001',
    wecomPosition: '产品中心总监',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '超级管理员',
    status: '启用',
    lastActive: '2026-08-17 20:55',
    aiQuotaLimit: 10000,
    aiQuotaUsed: 1420
  },
  {
    id: 'EMP-002',
    name: '王淑华',
    email: 'sophia.wang@homecraft-ai.com',
    department: '产品管理部',
    deptId: 'pm_dept',
    deptPath: '产品中心 / 产品管理部',
    isDeptLeader: true,
    wecomUserId: 'Sophia_Wang',
    wecomMobile: '13900139002',
    wecomPosition: '产品管理部主管',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '外贸主管',
    status: '启用',
    lastActive: '2026-08-17 20:42',
    aiQuotaLimit: 3000,
    aiQuotaUsed: 890
  },
  {
    id: 'EMP-003',
    name: '张晓雅',
    email: 'chloe.z@homecraft-ai.com',
    department: '设计部',
    deptId: 'design_dept',
    deptPath: '产品中心 / 设计部',
    isDeptLeader: false,
    wecomUserId: 'Chloe_Zhang',
    wecomMobile: '13400134006',
    wecomPosition: '资深工业设计工程师',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '内容审稿员',
    status: '启用',
    lastActive: '2026-08-17 15:10',
    aiQuotaLimit: 2500,
    aiQuotaUsed: 540
  },
  {
    id: 'EMP-004',
    name: '卢卡斯',
    email: 'lucas.m@homecraft-ai.com',
    department: '设计部',
    deptId: 'design_dept',
    deptPath: '产品中心 / 设计部',
    isDeptLeader: false,
    wecomUserId: 'Lucas_Miller',
    wecomMobile: '13500135005',
    wecomPosition: 'UI/UX体验设计师',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '销售业务员',
    status: '启用',
    lastActive: '2026-08-17 16:30',
    aiQuotaLimit: 1500,
    aiQuotaUsed: 310
  },
  {
    id: 'EMP-005',
    name: '施密特',
    email: 'alex.s@homecraft-ai.com',
    department: '市场部',
    deptId: 'marketing_dept',
    deptPath: '产品中心 / 市场部',
    isDeptLeader: false,
    wecomUserId: 'Alex_Schmidt',
    wecomMobile: '13700137003',
    wecomPosition: '海外市场调研经理',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '销售业务员',
    status: '启用',
    lastActive: '2026-08-17 18:12',
    aiQuotaLimit: 1500,
    aiQuotaUsed: 430
  },
  {
    id: 'EMP-006',
    name: '叶莲娜',
    email: 'elena.r@homecraft-ai.com',
    department: '研究所',
    deptId: 'research_inst',
    deptPath: '产品中心 / 研究所',
    isDeptLeader: true,
    wecomUserId: 'Elena_Rostova',
    wecomMobile: '13600136004',
    wecomPosition: '智能烹饪算法与温控研究员',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '推广运营官',
    status: '启用',
    lastActive: '2026-08-17 17:05',
    aiQuotaLimit: 2000,
    aiQuotaUsed: 620
  },
  {
    id: 'EMP-007',
    name: '万斯',
    email: 'marcus.v@homecraft-ai.com',
    department: '产品管理部',
    deptId: 'pm_dept',
    deptPath: '产品中心 / 产品管理部',
    isDeptLeader: false,
    wecomUserId: 'Marcus_Vance',
    wecomMobile: '13300133007',
    wecomPosition: '商用厨电高级产品经理',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '销售业务员',
    status: '启用',
    lastActive: '2026-08-17 14:20',
    aiQuotaLimit: 1500,
    aiQuotaUsed: 780
  },
  {
    id: 'EMP-008',
    name: '林德伟',
    email: 'david.lin@homecraft-ai.com',
    department: '市场部',
    deptId: 'marketing_dept',
    deptPath: '产品中心 / 市场部',
    isDeptLeader: false,
    wecomUserId: 'David_Lin',
    wecomMobile: '13200132008',
    wecomPosition: '市场增长与用户调研专员',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '推广运营官',
    status: '已禁用',
    lastActive: '2026-08-17 11:45',
    aiQuotaLimit: 2000,
    aiQuotaUsed: 890
  },
  {
    id: 'EMP-009',
    name: '周敏',
    email: 'emma.z@utech-kitchen.com',
    department: '信息',
    deptId: 'it_center',
    deptPath: '信息',
    isDeptLeader: true,
    wecomUserId: 'Emma_Zhou',
    wecomMobile: '13100131009',
    wecomPosition: '企业信息化系统架构师',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '内容审稿员',
    status: '启用',
    lastActive: '2026-08-17 10:30',
    aiQuotaLimit: 2500,
    aiQuotaUsed: 420
  },
  {
    id: 'EMP-010',
    name: '刘凯',
    email: 'kevin.l@utech-kitchen.com',
    department: '制造中心',
    deptId: 'mfg_center',
    deptPath: '制造中心',
    isDeptLeader: true,
    wecomUserId: 'Kevin_Liu',
    wecomMobile: '13000130010',
    wecomPosition: '高端智能厨电装配主管',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '销售业务员',
    status: '启用',
    lastActive: '2026-08-17 09:15',
    aiQuotaLimit: 2000,
    aiQuotaUsed: 1120
  },
  {
    id: 'EMP-011',
    name: '宋磊',
    email: 'frank.s@utech-kitchen.com',
    department: '流程与质量',
    deptId: 'qa_center',
    deptPath: '流程与质量',
    isDeptLeader: true,
    wecomUserId: 'Frank_Song',
    wecomMobile: '13000130011',
    wecomPosition: '质量控制与合规高级经理',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '外贸主管',
    status: '启用',
    lastActive: '2026-08-17 10:15',
    aiQuotaLimit: 3000,
    aiQuotaUsed: 520
  },
  {
    id: 'EMP-012',
    name: '赵雅丽',
    email: 'grace.z@utech-kitchen.com',
    department: '人力行政',
    deptId: 'hr_center',
    deptPath: '人力行政',
    isDeptLeader: true,
    wecomUserId: 'Grace_Zhao',
    wecomMobile: '13000130012',
    wecomPosition: '人事行政组织发展总监',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '超级管理员',
    status: '启用',
    lastActive: '2026-08-17 09:50',
    aiQuotaLimit: 4000,
    aiQuotaUsed: 670
  },
  {
    id: 'EMP-013',
    name: '孙恒',
    email: 'henry.s@utech-kitchen.com',
    department: '售后',
    deptId: 'aftersales_center',
    deptPath: '售后',
    isDeptLeader: true,
    wecomUserId: 'Henry_Sun',
    wecomMobile: '13000130013',
    wecomPosition: '海外技术支持与备件主管',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '销售业务员',
    status: '启用',
    lastActive: '2026-08-17 11:20',
    aiQuotaLimit: 2500,
    aiQuotaUsed: 890
  },
  {
    id: 'EMP-014',
    name: '钱馨',
    email: 'cynthia.q@utech-kitchen.com',
    department: '财务',
    deptId: 'fin_center',
    deptPath: '财务',
    isDeptLeader: true,
    wecomUserId: 'Cynthia_Qian',
    wecomMobile: '13000130014',
    wecomPosition: '外贸结算与税务资金总监',
    wecomStatus: '已激活',
    wecomSyncTime: '今日 15:30:22',
    role: '超级管理员',
    status: '启用',
    lastActive: '2026-08-17 13:40',
    aiQuotaLimit: 3500,
    aiQuotaUsed: 430
  }
];

export const initialRoles: RoleConfig[] = [
  {
    id: 'ROLE-ADMIN',
    roleName: '超级管理员',
    description: '拥有外贸 AI 平台所有模块的全局读写、权限分配与算力配置最高权限。',
    userCount: 1,
    permissions: [
      { module: '首页问答', view: true, edit: true, delete: true, export: true },
      { module: '售前询盘助手', view: true, edit: true, delete: true, export: true },
      { module: '销售助手', view: true, edit: true, delete: true, export: true },
      { module: '运营助手', view: true, edit: true, delete: true, export: true },
      { module: '知识库管理', view: true, edit: true, delete: true, export: true },
      { module: '数据统计', view: true, edit: true, delete: true, export: true },
      { module: '员工权限', view: true, edit: true, delete: true, export: true },
      { module: '系统配置', view: true, edit: true, delete: true, export: true },
      { module: '日志审计', view: true, edit: true, delete: true, export: true }
    ],
    dataPermission: {
      scope: 'all',
      scopeLabel: '全部数据权限 (跨部门全公司)',
      customRegions: ['北美市场', '欧洲市场', '中东与海湾', '澳洲与大洋洲'],
      maskCustomerContact: false,
      maskCostPrice: false
    },
    operationPermissions: {
      inquiryAssign: true,
      inquiryTakeover: true,
      inquiryExport: true,
      customerTransfer: true,
      customerPriceQuote: true,
      customerTagEdit: true,
      marketingApprove: true,
      marketingDirectPost: true,
      marketingBatchGenerate: true,
      knowledgePublish: true,
      knowledgeVectorRebuild: true,
      knowledgeExport: true,
      wecomSyncManual: true,
      roleManage: true,
      quotaAdjust: true,
      auditExport: true
    }
  },
  {
    id: 'ROLE-SUPERVISOR',
    roleName: '外贸主管',
    description: '管理询盘分配、会话监控、话术库共享审核及智能答复质量调控。',
    userCount: 2,
    permissions: [
      { module: '首页问答', view: true, edit: true, delete: false, export: true },
      { module: '售前询盘助手', view: true, edit: true, delete: false, export: true },
      { module: '销售助手', view: true, edit: true, delete: false, export: true },
      { module: '知识库管理', view: true, edit: true, delete: false, export: true },
      { module: '数据统计', view: true, edit: false, delete: false, export: true }
    ],
    dataPermission: {
      scope: 'dept_and_sub',
      scopeLabel: '本部门及下属部门数据',
      customDepts: ['外贸事业部', '售前客服与在线接待组', '海外业务一组', '海外业务二组'],
      maskCustomerContact: false,
      maskCostPrice: false
    },
    operationPermissions: {
      inquiryAssign: true,
      inquiryTakeover: true,
      inquiryExport: true,
      customerTransfer: true,
      customerPriceQuote: true,
      customerTagEdit: true,
      marketingApprove: false,
      marketingDirectPost: false,
      marketingBatchGenerate: false,
      knowledgePublish: true,
      knowledgeVectorRebuild: false,
      knowledgeExport: true,
      wecomSyncManual: false,
      roleManage: false,
      quotaAdjust: true,
      auditExport: false
    }
  },
  {
    id: 'ROLE-SALES',
    roleName: '销售业务员',
    description: '负责单客询盘跟进、即时会话与私人话术库维护。',
    userCount: 8,
    permissions: [
      { module: '首页问答', view: true, edit: false, delete: false, export: false },
      { module: '售前询盘助手', view: true, edit: true, delete: false, export: false },
      { module: '销售助手', view: true, edit: true, delete: false, export: false },
      { module: '知识库管理', view: true, edit: false, delete: false, export: false }
    ],
    dataPermission: {
      scope: 'self_only',
      scopeLabel: '仅本人数据权限 (个人私海与负责客户)',
      maskCustomerContact: true,
      maskCostPrice: true
    },
    operationPermissions: {
      inquiryAssign: false,
      inquiryTakeover: false,
      inquiryExport: false,
      customerTransfer: false,
      customerPriceQuote: false,
      customerTagEdit: true,
      marketingApprove: false,
      marketingDirectPost: false,
      marketingBatchGenerate: false,
      knowledgePublish: false,
      knowledgeVectorRebuild: false,
      knowledgeExport: false,
      wecomSyncManual: false,
      roleManage: false,
      quotaAdjust: false,
      auditExport: false
    }
  },
  {
    id: 'ROLE-MARKETING',
    roleName: '推广运营官',
    description: '负责海外社媒矩阵运营、AI视频与图文内容生成及发布审核。',
    userCount: 3,
    permissions: [
      { module: '首页问答', view: true, edit: false, delete: false, export: false },
      { module: '运营助手', view: true, edit: true, delete: true, export: true },
      { module: '数据统计', view: true, edit: false, delete: false, export: true }
    ],
    dataPermission: {
      scope: 'dept_only',
      scopeLabel: '本部门数据权限 (海外品牌推广部)',
      maskCustomerContact: true,
      maskCostPrice: true
    },
    operationPermissions: {
      inquiryAssign: false,
      inquiryTakeover: false,
      inquiryExport: false,
      customerTransfer: false,
      customerPriceQuote: false,
      customerTagEdit: false,
      marketingApprove: true,
      marketingDirectPost: true,
      marketingBatchGenerate: true,
      knowledgePublish: false,
      knowledgeVectorRebuild: false,
      knowledgeExport: false,
      wecomSyncManual: false,
      roleManage: false,
      quotaAdjust: false,
      auditExport: false
    }
  }
];

// Mock 8.2 Agent Skills (智能体技能库配置)
export const initialAgentSkills: AgentSkill[] = [
  {
    id: 'skill-cbm-calc',
    name: '集装箱装柜 CBM 与配载测算',
    code: 'cbm_container_calculator',
    category: '计算与配载',
    description: '外贸全屋定制家具柜体/软体大件装柜容积智能算法。根据产品长宽高包装规格、堆码规则及安全限重，实时输出 20GP/40GP/40HQ 装箱套数、剩余空间与配重预警。',
    version: 'v2.4.0',
    status: 'enabled',
    iconName: 'Calculator',
    triggerType: '混合触发',
    triggerKeywords: ['装柜', 'CBM', '40HQ', '20GP', '集装箱', '配载', '装箱体积'],
    inputSchemaSummary: '{ items: Array<{ name: string, l: number, w: number, h: number, qty: number, weightKg: number }>, containerType: "20GP" | "40GP" | "40HQ" }',
    outputSchemaSummary: '{ totalCbm: number, totalWeightKg: number, utilizationRate: string, maxSets: number, overWeightWarning: boolean }',
    lastInvoked: '2026-08-17 21:10',
    invocationCount: 1420,
    successRate: '99.6%',
    avgLatencyMs: 180,
    parameters: [
      { name: '40HQ 标准装载体积上限', key: 'hq40_cbm_cap', type: 'number', value: 68.0, description: '40HQ有效可用方数（含装箱损耗膨胀率后的安全容积）', unit: 'CBM' },
      { name: '40HQ 最大安全限重', key: 'hq40_max_weight', type: 'number', value: 26000, description: '欧美航线海运柜体最大货物净重核算限制', unit: 'kg' },
      { name: '包装纸箱膨胀系数', key: 'expansion_ratio', type: 'number', value: 1.08, description: '考虑实木与免漆板外包装蜂窝纸箱公差与堆叠挤压膨胀率' },
      { name: '优先配载策略', key: 'priority_mode', type: 'select', value: '容积优先 (Volume First)', options: ['容积优先 (Volume First)', '限重优先 (Weight First)', '动平衡装载'], description: '当体积和重量到达临界值时的装箱推荐优先权' }
    ]
  },
  {
    id: 'skill-boq-price',
    name: 'BOQ 工程明细自动算价与阶梯报价',
    code: 'boq_price_estimator',
    category: '计算与配载',
    description: '深度联动产品价格维护库，基于客户工程图纸清单的展开面积、延米、五金配件、涂装工艺及人工费，按工厂底价及毛利率自动生成专业美金 FOB 阶梯报价明细单。',
    version: 'v3.1.2',
    status: 'enabled',
    iconName: 'Coins',
    triggerType: '自动语义唤起',
    triggerKeywords: ['报价', 'BOQ', '算价', '单价', 'FOB价格', '延米', '展开面积'],
    inputSchemaSummary: '{ boqRows: Array<BOQItem>, defaultPort: string, targetMargin: number }',
    outputSchemaSummary: '{ totalCostCNY: number, totalFobUSD: number, unitPerSqmUSD: number, quotationPdfUrl: string }',
    lastInvoked: '2026-08-17 20:45',
    invocationCount: 2850,
    successRate: '99.8%',
    avgLatencyMs: 240,
    parameters: [
      { name: '默认外贸目标毛利率', key: 'target_margin', type: 'number', value: 25, description: '外贸定制项目基准加价率', unit: '%' },
      { name: '结汇基准汇率 (USD/CNY)', key: 'fx_rate', type: 'number', value: 7.15, description: '系统每日自动同步或锁定汇率基准', unit: '¥' },
      { name: '非标定制加工附加费率', key: 'custom_surcharge', type: 'number', value: 5, description: '针对异形圆弧、格栅及免拉手斜切工艺的附加损耗补偿', unit: '%' },
      { name: '阶梯订单让利门槛 (1*40HQ以上)', key: 'volume_discount', type: 'number', value: 3.5, description: '达到整柜装货体量时自动给予海外买家的让利折扣率', unit: '%' }
    ]
  },
  {
    id: 'skill-cad-analyzer',
    name: 'CAD 施工图深化与立面尺寸公差解析',
    code: 'cad_drawing_analyzer',
    category: '工程与图纸',
    description: '读取海外建筑师或深化设计师提供的 CAD DWG/DXF/PDF 图纸信息，提取柜体高度、深度、门缝间隙公差、天地隐形铰链开孔位置及铝合金拉手预埋槽位。',
    version: 'v1.8.0',
    status: 'enabled',
    iconName: 'Layers',
    triggerType: '指令调用',
    triggerKeywords: ['图纸', 'CAD', 'DWG', '深化', '公差', '铰链开孔', '平立面'],
    inputSchemaSummary: '{ fileUrl: string, drawingType: "plan" | "elevation" | "section" }',
    outputSchemaSummary: '{ dimensions: { w: number, h: number, d: number }, gapTolerances: string[], hardwareSlots: string[] }',
    lastInvoked: '2026-08-17 19:20',
    invocationCount: 680,
    successRate: '98.5%',
    avgLatencyMs: 620,
    parameters: [
      { name: '门板开合安全公差基准', key: 'gap_tolerance', type: 'number', value: 2.0, description: '无拉手柜门及抽屉立面留缝标准', unit: 'mm' },
      { name: '封边倒角圆弧半径', key: 'edge_radius', type: 'number', value: 1.5, description: 'PUR/激光封边工艺修边标准', unit: 'mm' },
      { name: '自动校验踢脚板暗藏插座避位', key: 'plinth_check', type: 'boolean', value: true, description: '开启后自动核算踢脚线高度与暗藏灯带/插座距离' }
    ]
  },
  {
    id: 'skill-compliance-check',
    name: '国际家具环保与质检认证合规审查',
    code: 'compliance_spec_verifier',
    category: '合规与质检',
    description: '严格审查出口目的地国法律法规与环保认证准入条件，对 FSC 森林认证链条、美国 CARB P2 / EPA TSCA Title VI 甲醛、英国 BS5852 软包阻燃标准自动对照审查。',
    version: 'v2.1.0',
    status: 'enabled',
    iconName: 'ShieldCheck',
    triggerType: '事件监听',
    triggerKeywords: ['FSC', 'CARB', 'P2', 'E0', '环保认证', 'BS5852', '阻燃', '甲醛测试报告'],
    inputSchemaSummary: '{ destinationCountry: string, materials: string[], certificationRequirements: string[] }',
    outputSchemaSummary: '{ isCompliant: boolean, matchedCertificates: string[], riskAlerts: string[], guidanceNotice: string }',
    lastInvoked: '2026-08-17 21:05',
    invocationCount: 1940,
    successRate: '100%',
    avgLatencyMs: 95,
    parameters: [
      { name: '甲醛释放最高限值标准', key: 'hcho_limit_standard', type: 'select', value: 'EN 717-1 E0 (<=0.05mg/m3)', options: ['EN 717-1 E0 (<=0.05mg/m3)', 'CARB P2 (<=0.09ppm)', 'JIS F4星 (<=0.3mg/L)', 'ENF 级 (<=0.025mg/m3)'], description: 'AI向海外买家出具技术答复时的基准甲醛等级' },
      { name: '无合规证书时强制拦截发出', key: 'block_unverified_claims', type: 'boolean', value: true, description: '若知识库内未检索到对应质检报告原件编号，禁止AI向买家做出绝对承诺' },
      { name: '海绵软包阻燃标贴自动附带', key: 'auto_flame_label', type: 'boolean', value: true, description: '针对出口英联邦国家产品，自动附带 BS5852 防火标贴制作规范' }
    ]
  },
  {
    id: 'skill-email-writer',
    name: '外贸商务函电与跟单排产文案生成',
    code: 'multilingual_email_drafter',
    category: '商务与文案',
    description: '针对国际家居大宗买家心理，生成包括初次询盘专业答复、打样签板确认函、生产进度节点播报视频说明、验货通知书及尾款催付公函等外贸地道商业信函。',
    version: 'v2.0.1',
    status: 'enabled',
    iconName: 'Mail',
    triggerType: '自动语义唤起',
    triggerKeywords: ['写邮件', '商务信函', '催定金', '打样确认', '验货通知', '跟单邮件'],
    inputSchemaSummary: '{ stage: string, clientName: string, keyPoints: string[], tone: string }',
    outputSchemaSummary: '{ subject: string, bodyEn: string, bodyZh: string, attachmentsSuggested: string[] }',
    lastInvoked: '2026-08-17 18:40',
    invocationCount: 3120,
    successRate: '99.5%',
    avgLatencyMs: 310,
    parameters: [
      { name: '默认邮件信函风格', key: 'email_tone', type: 'select', value: '专业严谨商务高层 (Executive)', options: ['专业严谨商务高层 (Executive)', '现代亲切顾问风格 (Consultative)', '坚定追单谈判风格 (Firm & Direct)'], description: '外贸函电用词典雅度与行文节奏' },
      { name: '自动附带海外展会邀约尾缀', key: 'include_expo_footer', type: 'boolean', value: true, description: '在邮件尾部自动提示意大利米兰展/广交会我司展位编号' },
      { name: '包含技术参数规格对比表', key: 'include_specs_table', type: 'boolean', value: true, description: '自动在正文中生成板材环保、五金开合测试对比小表格' }
    ]
  },
  {
    id: 'skill-fob-freight',
    name: '国际海运航线运费与目的港费用参考',
    code: 'fob_freight_estimator',
    category: '计算与配载',
    description: '实时估算由中国华南/华东主要家具出口口岸（盐田、蛇口、南沙、宁波）发往北美长滩、纽约，欧洲汉堡、鹿特丹，中东杰贝阿里的航线参考运价与航期。',
    version: 'v1.5.0',
    status: 'enabled',
    iconName: 'Ship',
    triggerType: '指令调用',
    triggerKeywords: ['运费', '海运', '航期', '港口', 'FOB', 'CIF', '目的港费用'],
    inputSchemaSummary: '{ podPort: string, polPort?: string, containerType: string }',
    outputSchemaSummary: '{ oceanFreightUSD: number, transitDays: number, inlandTruckingCNY: number, thcFeeCNY: number }',
    lastInvoked: '2026-08-17 17:15',
    invocationCount: 890,
    successRate: '99.1%',
    avgLatencyMs: 160,
    parameters: [
      { name: '默认启运港 (POL)', key: 'default_pol', type: 'select', value: 'Shenzhen Yantian (深圳盐田港)', options: ['Shenzhen Yantian (深圳盐田港)', 'Shenzhen Shekou (深圳蛇口港)', 'Guangzhou Nansha (广州南沙港)', 'Ningbo Zhoushan (宁波舟山港)'], description: '海运报关出货首选始发港口' },
      { name: '旺季附加费预警浮动比例', key: 'pss_buffer_ratio', type: 'number', value: 12.0, description: '考虑红海绕航及欧美旺季附加费 (PSS/GRI) 波动风险上浮比率', unit: '%' }
    ]
  },
  {
    id: 'skill-voice-transcribe',
    name: '外贸口语与多语种流式语音转文字',
    code: 'voice_speech_transcriber',
    category: '语音与多模态',
    description: '基于 Web Speech 音频流与外贸定制领域专有名词词典，支持销售人员与学员使用普通话或外贸英文口述实战话术，实时纠错并转写为工整文字。',
    version: 'v1.9.0',
    status: 'enabled',
    iconName: 'Mic',
    triggerType: '指令调用',
    triggerKeywords: ['语音转文字', '麦克风录入', '口述', '语音识别'],
    inputSchemaSummary: '{ audioStream: MediaStream, lang: "zh-CN" | "en-US" }',
    outputSchemaSummary: '{ transcript: string, confidence: number, correctedTerms: string[] }',
    lastInvoked: '2026-08-17 21:18',
    invocationCount: 4250,
    successRate: '99.9%',
    avgLatencyMs: 80,
    parameters: [
      { name: '默认首选识别语言', key: 'default_voice_lang', type: 'select', value: 'zh-CN (普通话)', options: ['zh-CN (普通话)', 'en-US (外贸英语)'], description: '点击麦克风时优先激活的语种' },
      { name: '自动专业术语语义纠正', key: 'auto_term_correct', type: 'boolean', value: true, description: '将口语中的音近词自动规范为专业家具术语（如百隆、海蒂诗、爱格等）' }
    ]
  }
];

// Mock 8.1 System Agent Config (智能体基础设置: Agent 配置)
export const initialSystemConfig: SystemAgentConfig = {
  agentName: 'HomeCraft Global AI 外贸定制全流程智能体',
  agentId: 'agent-bespoke-custom-v3',
  primaryPersona: 'Senior Foreign Trade Director & Furniture Structural Engineer (资深外贸定制总监兼家具结构工程师)',
  systemPrompt: `你是一家拥有20年出口历史的中国高端全屋定制与工程家具制造商的【外贸定制销售总监兼家具结构首席工程师】。
你的核心职责包括：
1. 精准解答海外设计师、开发商、B2B家具进口商关于板材（E0/CARB P2/FSC）、实木贴皮、PUR激光封边、Blum/Hettich五金及定制公差等专业问题；
2. 严谨核算柜体延米、展开面积 BOQ 工程清单及 1*40HQ 集装箱装柜 CBM 配载优化；
3. 用地道流利的外贸英语与海外买家高效谈判，提供有理有据的交期排产方案与阶梯报价，兼顾商业利润与客户信任；
4. 严格遵守国际环保安全认证与企业商业秘密风控，严禁泄露工厂原始成本底价公式。`,
  languageMode: '中英双语 (默认)',
  temperature: 0.3,
  topP: 0.85,
  maxOutputTokens: 4096,
  contextRounds: 20,
  geminiModel: 'gemini-2.5-flash',
  autoReplyDelaySeconds: 3,
  enableAiScore: true,
  enableCbmCalculator: true,
  enableWatermark: true,
  enableFSCComplianceFilter: true,
  enablePriceFormulaMasking: true,
  fobDefaultPort: 'Shenzhen / Yantian (深圳盐田港)',
  toneStyle: '严谨专业',
  salesAgents: initialSalesAgents,
  skills: [...initialSalesSkills, ...initialAgentSkills]
};

// Mock 9.1 & 9.2 & 9.3 Logs & Audit (日志与审计)
export const initialOperationLogs: OperationLog[] = [
  { id: 'LOG-901', userName: 'Chen Yi (陈总)', userRole: '超级管理员', ipAddress: '113.88.204.12', action: '修改系统配置', module: '系统配置', detail: '将默认 Gemini AI 模型切换为 gemini-2.5-flash，启用 CBM 海运自动算力', timestamp: '2026-08-17 20:52', status: '成功' },
  { id: 'LOG-902', userName: 'Sophia Wang', userRole: '外贸主管', ipAddress: '183.14.62.88', action: '新增公共话术', module: '销售助手', detail: '添加话术：[实木与板材环保标准说明 (FSC & E0 Grade)]', timestamp: '2026-08-17 19:15', status: '成功' },
  { id: 'LOG-903', userName: 'Alex Schmidt', userRole: '销售业务员', ipAddress: '221.7.201.5', action: '导出询盘清单', module: '售前客服', detail: '导出 2026年8月 北美高意向 RFQ 清单 (28条)', timestamp: '2026-08-17 16:40', status: '成功' }
];

export const initialQALogs: QARecordLog[] = [
  { id: 'QA-501', userName: 'Alex Schmidt', question: '请算一下 1*40HQ 能放多少套 3+2+1 意式全真皮沙发 SL-802？', answerSnippet: '根据体积核算公式，SL-802 系列打包后单套体积为 1.75 CBM，40HQ 限重 26 吨/68 CBM，预计可装 38 套...', confidence: 0.98, sourceCode: 'KB-SOFA-2026-03', durationMs: 420, timestamp: '2026-08-17 20:10' },
  { id: 'QA-502', userName: 'Sophia Wang', question: '美东客户要求 CARB P2 认证，我们 E0 级多层板可以替代吗？', answerSnippet: '可以！E0级甲醛释放量 <=0.05mg/m³，其指标严格优于 CARB P2 (0.09ppm) 要求，可以直接提供测报告...', confidence: 0.99, sourceCode: 'KB-FUR-2026-01', durationMs: 310, timestamp: '2026-08-17 18:32' }
];

export const initialContentLogs: ContentGenLog[] = [
  { id: 'GEN-301', operator: 'Elena Rostova', genType: 'Instagram文案', promptUsed: '2026 Modular Wardrobes Collection for European architects', tokensUsed: 840, timestamp: '2026-08-17 17:00', status: '完成' },
  { id: 'GEN-302', operator: 'Sophia Wang', genType: '询盘报价单', promptUsed: 'California 3 Villas Solid Oak Kitchen Cabinets RFQ Reply', tokensUsed: 1250, timestamp: '2026-08-17 19:43', status: '完成' }
];

// Mock 6.1 Product Price Maintenance: BOQ Unit Price Items (BOQ单价库)
export const initialBOQPriceItems: BOQPriceItem[] = [
  {
    id: 'BOQ-CAB-001',
    code: 'CAB-EGGER-E0',
    name: '爱格板 E0级 柜体板 (欧标环保)',
    category: '柜体板材',
    spec: '18mm / 双饰面耐磨层 / E0级环保 / 含ABS激光封边',
    unit: '展开㎡',
    currency: 'USD',
    basePriceUSD: 36.5,
    basePriceRMB: 260.0,
    wasteRatePercent: 8,
    formulaDesc: '展开面积(㎡) × 基准单价 × (1 + 损耗率 8%)',
    status: '已生效',
    updatedAt: '2026-08-28 14:30',
    tags: ['爱格', 'E0', '激光封边', '常备库存']
  },
  {
    id: 'BOQ-CAB-002',
    code: 'CAB-PLYWOOD-SOLID',
    name: '全桉多层实木夹板柜体 (防潮高抗弯)',
    category: '柜体板材',
    spec: '18mm / 桉木多层芯材 / CARB P2级 / 厨房卫浴优选',
    unit: '展开㎡',
    currency: 'USD',
    basePriceUSD: 42.0,
    basePriceRMB: 302.0,
    wasteRatePercent: 8,
    formulaDesc: '展开面积(㎡) × 基准单价 × (1 + 损耗率 8%)',
    status: '已生效',
    updatedAt: '2026-08-25 10:15',
    tags: ['多层板', '防水防潮', 'CARB P2']
  },
  {
    id: 'BOQ-CAB-003',
    code: 'CAB-OSB-SUPER',
    name: '欧松精木OSB无醛实木切片柜体',
    category: '柜体板材',
    spec: '18mm / MDI生态胶水 / 无醛添加 / 握钉力极强',
    unit: '展开㎡',
    currency: 'USD',
    basePriceUSD: 39.8,
    basePriceRMB: 286.0,
    wasteRatePercent: 7,
    formulaDesc: '展开面积(㎡) × 基准单价 × (1 + 损耗率 7%)',
    status: '已生效',
    updatedAt: '2026-08-20 16:40',
    tags: ['欧松板', '无醛级', '承重优选']
  },
  {
    id: 'BOQ-DOOR-001',
    code: 'DOOR-PET-SKIN',
    name: '意式极简肤感 PET 饰面柜门',
    category: '定制门板',
    spec: '22mm / 抗指纹PET耐划膜 / 铝合金隐形拉直器 / 柜体匹配',
    unit: '投影㎡',
    currency: 'USD',
    basePriceUSD: 88.0,
    basePriceRMB: 630.0,
    wasteRatePercent: 5,
    formulaDesc: '立面投影面积(㎡) × 门板基准单价 × (1 + 损耗 5%)',
    status: '已生效',
    updatedAt: '2026-08-30 09:12',
    tags: ['PET肤感', '极简门板', '抗指纹']
  },
  {
    id: 'BOQ-DOOR-002',
    code: 'DOOR-LACQUER-MATT',
    name: '德系哑光无缝喷粉烤漆门板',
    category: '定制门板',
    spec: '20mm中纤板 / 六面全包覆喷粉 / 零甲醛释放 / 防水耐刮',
    unit: '投影㎡',
    currency: 'USD',
    basePriceUSD: 115.0,
    basePriceRMB: 825.0,
    wasteRatePercent: 6,
    formulaDesc: '立面投影面积(㎡) × 烤漆单价 × (1 + 损耗 6%)',
    status: '已生效',
    updatedAt: '2026-08-26 15:20',
    tags: ['无缝喷粉', '六面全包', '高端定制']
  },
  {
    id: 'BOQ-DOOR-003',
    code: 'DOOR-ALUM-GLASS',
    name: '极简黑钛铝框 灰玻/长虹玻璃通高门',
    category: '定制门板',
    spec: '极窄铝合金边框 / 4mm汽车级钢化玻璃 / 预埋通长拉手',
    unit: '投影㎡',
    currency: 'USD',
    basePriceUSD: 135.0,
    basePriceRMB: 970.0,
    wasteRatePercent: 5,
    formulaDesc: '玻璃门投影面积(㎡) × 铝玻复合单价',
    status: '已生效',
    updatedAt: '2026-08-29 11:45',
    tags: ['铝框玻璃门', '长虹玻璃', '轻奢']
  },
  {
    id: 'BOQ-DOOR-004',
    code: 'DOOR-VENEER-OAK',
    name: '北美白橡天然原木实木贴皮门板',
    category: '定制门板',
    spec: '20mm / 0.6mm天然白橡木皮 / 环保开放漆纹理',
    unit: '投影㎡',
    currency: 'USD',
    basePriceUSD: 155.0,
    basePriceRMB: 1110.0,
    wasteRatePercent: 8,
    formulaDesc: '立面投影面积(㎡) × 实木贴皮单价 × 损耗率',
    status: '已生效',
    updatedAt: '2026-08-24 17:00',
    tags: ['天然木皮', '白橡木', '天然纹理']
  },
  {
    id: 'BOQ-TOP-001',
    code: 'TOP-PORCELAIN-15MM',
    name: '15mm 意大利鱼肚金通体岩板台面',
    category: '台面石材',
    spec: '15mm厚度 / 莫氏硬度7级 / 纳米防污渗透 / 45度海棠角倒边',
    unit: '延米',
    currency: 'USD',
    basePriceUSD: 78.0,
    basePriceRMB: 560.0,
    wasteRatePercent: 10,
    formulaDesc: '延米长度(m) × 延米单价 × (1 + 损耗率 10%) + 倒角加工费',
    status: '已生效',
    updatedAt: '2026-08-27 13:50',
    tags: ['鱼肚金岩板', '15mm厚', '莫氏硬度7级']
  },
  {
    id: 'BOQ-TOP-002',
    code: 'TOP-QUARTZ-CRYSTAL',
    name: '喜仕隆高级结晶纯白石英石台面',
    category: '台面石材',
    spec: '20mm厚度 / 93%天然石英结晶 / 抗渗油抗渗透',
    unit: '延米',
    currency: 'USD',
    basePriceUSD: 62.0,
    basePriceRMB: 445.0,
    wasteRatePercent: 8,
    formulaDesc: '延米长度(m) × 石英石基准价 × (1 + 损耗率 8%)',
    status: '已生效',
    updatedAt: '2026-08-22 14:10',
    tags: ['纯白石英石', '20mm厚', '食品级接触']
  },
  {
    id: 'BOQ-HARD-001',
    code: 'HARD-BLUM-CLIP',
    name: '奥地利百隆 Blum 快装集成阻尼铰链',
    category: '基础五金',
    spec: '110度快装铰链 / 71B3550 内置阻尼 / 20万次开合寿命',
    unit: '个',
    currency: 'USD',
    basePriceUSD: 3.2,
    basePriceRMB: 23.0,
    wasteRatePercent: 3,
    formulaDesc: '实际门板铰链配比数量(个) × 单价',
    status: '已生效',
    updatedAt: '2026-08-30 08:30',
    tags: ['Blum百隆', '阻尼铰链', '质保20年']
  },
  {
    id: 'BOQ-HARD-002',
    code: 'HARD-BLUM-TANDEM',
    name: '百隆 Blum 豪华骑马抽隐形阻尼滑轨',
    category: '功能配件',
    spec: '标配500mm / 40KG承重 / 带豪华金属高抽帮 / 静音自闭',
    unit: '套',
    currency: 'USD',
    basePriceUSD: 24.5,
    basePriceRMB: 176.0,
    wasteRatePercent: 2,
    formulaDesc: '抽屉组数量(套) × 骑马抽单价',
    status: '已生效',
    updatedAt: '2026-08-29 16:20',
    tags: ['骑马抽', '隐形滑轨', '高承重']
  },
  {
    id: 'BOQ-HARD-003',
    code: 'HARD-LED-STRIP',
    name: '45度斜发光嵌入式双色温铝槽LED灯带',
    category: '功能配件',
    spec: '3000K-4000K暖白调光 / 预埋型铝合金开槽 / 含明纬感应电源',
    unit: '米',
    currency: 'USD',
    basePriceUSD: 9.5,
    basePriceRMB: 68.0,
    wasteRatePercent: 5,
    formulaDesc: '布灯长度(米) × 单价 + 电源驱动套件',
    status: '已生效',
    updatedAt: '2026-08-28 11:15',
    tags: ['嵌入式LED', '感应灯带', '氛围照明']
  },
  {
    id: 'BOQ-PACK-001',
    code: 'PACK-EXPORT-CRATE',
    name: '全密封免熏蒸出口九脚胶合板木箱',
    category: '出口包装',
    spec: 'ISPM 15出口免检 / 12mm胶合板 / 内部高密EPE珍珠棉护角',
    unit: '套',
    currency: 'USD',
    basePriceUSD: 55.0,
    basePriceRMB: 395.0,
    wasteRatePercent: 0,
    formulaDesc: '整柜包装体积分摊或按每单元柜(套)计取',
    status: '已生效',
    updatedAt: '2026-08-26 10:00',
    tags: ['免熏蒸木箱', '海运防震', '出口免检']
  },
  {
    id: 'BOQ-PACK-002',
    code: 'PACK-CARTON-HONEY',
    name: '五层加厚高抗压蜂窝纸箱 + 护角包扎',
    category: '出口包装',
    spec: 'A=A 加强型瓦楞纸板 / 边缘高密度硬质护角 / 收缩膜防潮',
    unit: '套',
    currency: 'USD',
    basePriceUSD: 16.0,
    basePriceRMB: 115.0,
    wasteRatePercent: 0,
    formulaDesc: '按平包分件数量计取',
    status: '已生效',
    updatedAt: '2026-08-21 15:30',
    tags: ['蜂窝纸箱', '防潮缠绕膜', '平包装']
  },
  {
    id: 'BOQ-LABOR-001',
    code: 'LABOR-FACTORY-PREASS',
    name: '工厂预组装调试与防尘封膜工时',
    category: '人工安装',
    spec: '出厂前100%试装校验 / 柜体垂直度平整度复验 / 防尘静电膜',
    unit: '套',
    currency: 'USD',
    basePriceUSD: 28.0,
    basePriceRMB: 200.0,
    wasteRatePercent: 0,
    formulaDesc: '按定制主柜单元套数计费',
    status: '已生效',
    updatedAt: '2026-08-25 18:00',
    tags: ['工厂预装', '全检合格', '质保品控']
  }
];

// Mock 6.2 Product Price Maintenance: BOQ Calculation Rules (算价规则配置)
export const initialBOQPricingRules: BOQPricingRule[] = [
  {
    id: 'RULE-001',
    name: '投影面积转展开面积折算系数 (柜体)',
    category: '面积算法',
    formulaDesc: '展开面积(㎡) ≈ 投影面积(宽×高) × 折算系数 (用于快速估算展开板材量)',
    factor: 3.65,
    unit: '倍数',
    isEnabled: true,
    remarks: '标准深度 550~600mm 深度衣柜/高柜的标准展开面积平均经验系数'
  },
  {
    id: 'RULE-002',
    name: '标准板材裁切损耗率 (Cutting Waste)',
    category: '损耗率',
    formulaDesc: '最终板材用量 = 净用量 × (1 + 损耗率)',
    factor: 8,
    unit: '%',
    isEnabled: true,
    remarks: '大型电子锯排版下料的综合边角料与修边损耗'
  },
  {
    id: 'RULE-003',
    name: '超高通顶门板非标加价系数 (> 2400mm)',
    category: '非标系数',
    formulaDesc: '当门板高度 H > 2400mm 且 <= 2800mm 时，门板基准单价上浮加价系数',
    factor: 15,
    unit: '%',
    isEnabled: true,
    remarks: '需采用通长铝合金拉直器及加长基板排料'
  },
  {
    id: 'RULE-004',
    name: '外币换算基准汇率 (USD / RMB)',
    category: '外币汇率',
    formulaDesc: 'RMB 金额 = USD 金额 × 结算汇率',
    factor: 7.20,
    unit: '汇率',
    isEnabled: true,
    remarks: '外贸官方结算指导汇率，用于外币与人民币自动折算'
  },
  {
    id: 'RULE-005',
    name: '海运防潮高标准加固包装加成',
    category: '出口包装',
    formulaDesc: '若订单选择【全免熏蒸木箱海运加固】，整单在蜂窝纸箱基础上按立方/套计费',
    factor: 38,
    unit: 'USD/套',
    isEnabled: true,
    remarks: '包含集装箱长途海运防霉干燥剂包及熏蒸检疫标准'
  }
];

// Mock 6.2 汇率管理数据
export const initialExchangeRates: ExchangeRateItem[] = [
  {
    id: 'RATE-USD',
    currencyCode: 'USD',
    currencyName: '美元 (主结算币种)',
    symbol: '$',
    flag: '🇺🇸',
    marketRate: 7.1845,
    systemRate: 7.2000,
    bufferPercent: 0.5,
    settlementRate: 7.2360,
    isBaseCurrency: true,
    status: '已生效',
    autoSync: true,
    lastUpdated: '2026-09-03 16:30',
    operator: 'Franklin Jr (Superadmin)',
    changeRate24h: 0.12
  },
  {
    id: 'RATE-EUR',
    currencyCode: 'EUR',
    currencyName: '欧元 (欧洲高端工程)',
    symbol: '€',
    flag: '🇪🇺',
    marketRate: 7.8210,
    systemRate: 7.8500,
    bufferPercent: 1.0,
    settlementRate: 7.9285,
    isBaseCurrency: false,
    status: '已生效',
    autoSync: true,
    lastUpdated: '2026-09-03 16:30',
    operator: 'Franklin Jr (Superadmin)',
    changeRate24h: -0.28
  },
  {
    id: 'RATE-GBP',
    currencyCode: 'GBP',
    currencyName: '英镑 (英国别墅豪宅)',
    symbol: '£',
    flag: '🇬🇧',
    marketRate: 9.2140,
    systemRate: 9.2500,
    bufferPercent: 1.0,
    settlementRate: 9.3425,
    isBaseCurrency: false,
    status: '已锁定',
    autoSync: false,
    lastUpdated: '2026-09-01 10:00',
    operator: '财务总监 (Alice Zhang)',
    changeRate24h: 0.05
  },
  {
    id: 'RATE-AUD',
    currencyCode: 'AUD',
    currencyName: '澳元 (澳洲公寓联排)',
    symbol: 'A$',
    flag: '🇦🇺',
    marketRate: 4.7120,
    systemRate: 4.7500,
    bufferPercent: 1.5,
    settlementRate: 4.8213,
    isBaseCurrency: false,
    status: '已生效',
    autoSync: true,
    lastUpdated: '2026-09-03 16:30',
    operator: '系统自动同步',
    changeRate24h: 0.35
  },
  {
    id: 'RATE-CAD',
    currencyCode: 'CAD',
    currencyName: '加元 (北美温哥华/多伦多)',
    symbol: 'C$',
    flag: '🇨🇦',
    marketRate: 5.2380,
    systemRate: 5.2800,
    bufferPercent: 1.2,
    settlementRate: 5.3434,
    isBaseCurrency: false,
    status: '已生效',
    autoSync: true,
    lastUpdated: '2026-09-03 16:30',
    operator: '系统自动同步',
    changeRate24h: -0.15
  },
  {
    id: 'RATE-AED',
    currencyCode: 'AED',
    currencyName: '阿联酋迪拉姆 (迪拜中东豪宅)',
    symbol: 'AED',
    flag: '🇦🇪',
    marketRate: 1.9560,
    systemRate: 1.9600,
    bufferPercent: 0.8,
    settlementRate: 1.9757,
    isBaseCurrency: false,
    status: '已生效',
    autoSync: true,
    lastUpdated: '2026-09-03 16:30',
    operator: '系统自动同步',
    changeRate24h: 0.02
  },
  {
    id: 'RATE-SGD',
    currencyCode: 'SGD',
    currencyName: '新加坡元 (东南亚高奢公寓)',
    symbol: 'S$',
    flag: '🇸🇬',
    marketRate: 5.3420,
    systemRate: 5.3800,
    bufferPercent: 1.0,
    settlementRate: 5.4338,
    isBaseCurrency: false,
    status: '已生效',
    autoSync: true,
    lastUpdated: '2026-09-03 16:30',
    operator: '系统自动同步',
    changeRate24h: 0.18
  }
];

export const initialExchangeRateLogs: ExchangeRateLogItem[] = [
  {
    id: 'LOG-FX-101',
    currencyCode: 'USD',
    currencyName: '美元',
    previousRate: 7.1500,
    newRate: 7.2000,
    changeType: '季度锁汇',
    operator: 'Franklin Jr',
    timestamp: '2026-09-01 09:30',
    note: 'Q3季度财务锁汇调整，统一下发销售智能体BOQ试算与报价引擎'
  },
  {
    id: 'LOG-FX-102',
    currencyCode: 'GBP',
    currencyName: '英镑',
    previousRate: 9.1800,
    newRate: 9.2500,
    changeType: '手动调整',
    operator: '财务总监 (Alice Zhang)',
    timestamp: '2026-08-25 15:20',
    note: '应对英镑长周期工程合同波动风险，手动上浮锁定汇率'
  },
  {
    id: 'LOG-FX-103',
    currencyCode: 'USD',
    currencyName: '美元',
    previousRate: 7.1820,
    newRate: 7.1845,
    changeType: '自动同步',
    operator: '央行中间价同步引擎',
    timestamp: '2026-09-03 09:15',
    note: '每日早盘自动同步中国外汇交易中心牌价'
  },
  {
    id: 'LOG-FX-104',
    currencyCode: 'AUD',
    currencyName: '澳元',
    previousRate: 4.7000,
    newRate: 4.7500,
    changeType: '安全缓冲调整',
    operator: 'Franklin Jr',
    timestamp: '2026-08-18 11:45',
    note: '澳元汇率波动放大，安全缓冲比提升至 1.5%'
  }
];


