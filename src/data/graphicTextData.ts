export type GraphicTextStatus = 
  | '编辑中'
  | '已同步到微信'
  | '发布审核中'
  | '审核不通过'
  | '计划发布'
  | '已发布'
  | '回收站';

export interface GraphicTextItem {
  id: string;
  topic: string;
  title: string;
  summary: string;
  coverImage: string;
  linkedProducts: string[];
  linkedCase: {
    id: string;
    name: string;
    photoCount: number;
    description: string;
    images: string[];
  };
  author: string;
  publishPlatform: '微信公众号' | '多平台矩阵';
  status: GraphicTextStatus;
  auditRejectReason?: string;
  scheduledPublishTime?: string;
  wechatDraftId?: string;
  createdAt: string;
  readCount?: number;
  wordCount: number;
  themeStyle: 'emerald' | 'dark' | 'warm';
  materialsParameters: {
    name: string;
    spec: string;
    standard: string;
  }[];
  contentSections: {
    title: string;
    paragraphs: string[];
    highlightQuote?: string;
    image?: string;
    caption?: string;
  }[];
}

export interface AvailableProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  tag: string;
}

export interface AvailableCase {
  id: string;
  name: string;
  location: string;
  photoCount: number;
  tags: string[];
  cover: string;
  images: string[];
  description: string;
}

// 关联产品备选项
export const AVAILABLE_PRODUCTS: AvailableProduct[] = [
  {
    id: 'prod-pet',
    name: 'PET肤感板系列',
    category: '门板饰面',
    description: '零度超亚抗指纹、耐磨耐划、耐高温高湿，E0/CARB-P2环保基材',
    tag: '零度超亚抗指纹'
  },
  {
    id: 'prod-sliding',
    name: '吊滑极简门',
    category: '室内门系统',
    description: '磁悬浮静音天轨、地面无槽无障碍、极窄4mm航空级铝合金型材',
    tag: '磁悬浮顶轨隐形'
  },
  {
    id: 'prod-glass',
    name: '意式极简铝框玻璃门',
    category: '展示柜门',
    description: '超窄框隐形天地铰链、灰玻/茶玻防爆钢化、内置45°内嵌式泛光灯槽',
    tag: '极窄4mm极简框'
  },
  {
    id: 'prod-sintered',
    name: '岩板岛台台面系统',
    category: '台面石材',
    description: '12mm莫氏6级耐刮磨食品级岩板，耐1200℃高温，无缝台下盆工法',
    tag: '耐高温食品级'
  },
  {
    id: 'prod-hardware',
    name: '德国进口阻尼五金系列',
    category: '功能五金',
    description: '50万次开合寿命疲劳测试，集成三维微调与液压柔音缓冲系统',
    tag: '50万次开合'
  },
  {
    id: 'prod-lighting',
    name: '全景感应线性灯光系统',
    category: '智能电气',
    description: '3000K低眩光柔光漫射，免开槽隐形铝型材嵌入，手扫/人体双模感应',
    tag: '3000K无频闪'
  }
];

// 关联案例备选项
export const AVAILABLE_CASES: AvailableCase[] = [
  {
    id: 'case-dubai',
    name: '迪拜精装公寓项目图 (共8张)',
    location: '阿联酋 · 迪拜云溪港 (Dubai Creek Harbour)',
    photoCount: 8,
    tags: ['迪拜精装', '现代极简', '全套橱柜', '吊滑隐形门'],
    cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    description: '迪拜高端海景公寓全套橱柜与门墙柜一体化落地，包含PET肤感板高柜、开放式岛台与磁悬浮吊滑隐形门系统。',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'case-london',
    name: '伦敦肯辛顿豪宅全屋定制案例 (共10张)',
    location: '英国 · 伦敦肯辛顿区',
    photoCount: 10,
    tags: ['英伦轻奢', '开放式中西厨', '实木混油'],
    cover: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    description: '历史保护建筑内部结构更新，运用现代极简收纳与隐形收口体系，打造低调奢华的生活空间。',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'case-singapore',
    name: '新加坡顶层公寓衣帽间项目 (共6张)',
    location: '新加坡 · 乌节路核心区',
    photoCount: 6,
    tags: ['步入式衣帽间', '铝框玻璃门', '感应光影'],
    cover: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=800&auto=format&fit=crop&q=80',
    description: '高密度热带气候下的防潮抗变型定制，铝合金框结合抗指纹门板，打造无界透明感。',
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'case-sydney',
    name: '悉尼滨海独栋全套木作案例 (共12张)',
    location: '澳大利亚 · 悉尼双湾 (Double Bay)',
    photoCount: 12,
    tags: ['滨海耐盐雾', '门墙柜一体', '现代侘寂'],
    cover: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=80',
    description: '耐高盐雾海洋气候特殊涂装工艺，门墙系统一体化极简隐形收口。',
    images: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

// 默认已生成的图文列表（列表形式展现）
export const INITIAL_GRAPHIC_ARTICLES: GraphicTextItem[] = [
  {
    id: 'art-001',
    topic: '2026现代极简橱柜设计趋势',
    title: '2026现代极简橱柜设计趋势：PET肤感板与吊滑隐形门的质感革命',
    summary: '极简不再是冰冷的空白，而是材质触感与隐形机械的深度共鸣。本文结合品爱在迪拜精装高定项目的交付实录，解析新一代豪宅橱柜的关键设计语言与工法准则。',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    linkedProducts: ['PET肤感板系列', '吊滑极简门'],
    linkedCase: {
      id: 'case-dubai',
      name: '迪拜精装公寓项目图 (共8张)',
      photoCount: 8,
      description: '迪拜云溪港精装公寓样板房全案定制，PET零度超亚高柜与无地轨吊滑移门',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80'
      ]
    },
    author: 'HomeCraft 高定工法组',
    publishPlatform: '微信公众号',
    status: '编辑中',
    wechatDraftId: 'WX-DRAFT-20260907-8821',
    createdAt: '2026-09-07 14:30',
    readCount: 4210,
    wordCount: 2180,
    themeStyle: 'emerald',
    materialsParameters: [
      { name: 'PET肤感板光泽度', spec: '≤ 3GU 零度超亚', standard: '抗指纹/疏油耐擦洗测试通过' },
      { name: '基材环保标准', spec: 'ENF / CARB Phase 2', standard: '甲醛释放量 ≤ 0.025mg/m³' },
      { name: '吊滑门轨道材质', spec: '6063-T6 航空级铝合金', standard: '壁厚2.5mm / 承重120kg' },
      { name: '滑动阻尼寿命', spec: '磁悬浮静音滑轮组', standard: '德国TÜV 20万次开合寿命认证' }
    ],
    contentSections: [
      {
        title: '01 / 触觉优先：为何零度 PET 肤感板成为豪宅新标配？',
        paragraphs: [
          '回顾近几年的高端整家定制，光面烤漆正在逐渐退潮，取而代之的是极致内敛的低饱和哑光肌理。PET 肤感板以其触如凝脂的丝滑温润质地，在海外高端私宅中占据了主导地位。',
          '与传统双饰面板不同，进口 PET 膜经微波准分子固化处理后，表面微观结构呈现无规纳米级绒毛，漫反射率接近100%，不仅彻底杜绝指纹残留，且具备卓越的自修复抗划痕性能。'
        ],
        highlightQuote: '“真正的奢华无需反光喧哗，指尖触碰的瞬间，材质的沉静便是最高级的空间叙事。”',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
        caption: '▲ 迪拜精装公寓样板间：全套 PET 肤感板无把手高柜系统'
      },
      {
        title: '02 / 立面消隐：无地槽吊滑极简门重构厨房场域',
        paragraphs: [
          '开放式与封闭式厨房之争，在吊滑极简门面前有了两全其美的解法。地面无需预埋任何凹槽或凸起轨道，大理石地面通铺无界，扫地机器人畅行无阻。',
          '天花隐形轨道嵌入吊顶龙骨内，配合极窄 4mm 边框航空铝型材，整扇门在闭合时宛如艺术极简壁板，在开启时轻若无物，磁悬浮阻尼实现毫厘级别的柔音缓闭。'
        ],
        highlightQuote: '“地轨的消失，标志着厨房与客餐厅动线正式达成真正的空间自由流淌。”',
        image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80',
        caption: '▲ 顶装天轨吊滑极简移门：开阔通透的餐厅与西厨连通动线'
      },
      {
        title: '03 / 案例实录：迪拜云溪港精装公寓 420㎡ 落地复盘',
        paragraphs: [
          '在迪拜的高温与强紫外线气候下，材料的耐候稳定性是工程成败的关键。HomeCraft 工厂在出厂前进行了 96 小时恒温恒湿老化测试，确保 PET 饰面在海湾气候下不泛黄、不开裂。',
          '全案采用激光无缝封边技术，胶缝达到肉眼难辨的 0.05mm 级别，不仅防水防潮性能提升 300%，更赋予柜体宛如整块原石雕琢的纯粹立面感。'
        ],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        caption: '▲ 迪拜精装公寓实景交付：中西双厨与整墙高柜立面'
      }
    ]
  },
  {
    id: 'art-002',
    topic: '海湾高奢工法：迪拜精装公寓木作落地实录',
    title: '海湾高奢工法：迪拜精装公寓木作全景与无指纹PET落地实录',
    summary: '针对中东 GCC 气候高盐雾、高温差的特殊环境，解析全套门墙柜出口集装箱包装、抗变形蜂窝芯铝蜂窝门板与现场精密收口工法。',
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    linkedProducts: ['PET肤感板系列', '岩板岛台台面系统'],
    linkedCase: {
      id: 'case-dubai',
      name: '迪拜精装公寓项目图 (共8张)',
      photoCount: 8,
      description: '迪拜云溪港精装公寓样板房全案定制',
      images: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
      ]
    },
    author: 'HomeCraft 外贸交付工程院',
    publishPlatform: '微信公众号',
    status: '已同步到微信',
    wechatDraftId: 'WX-DRAFT-20260905-1042',
    createdAt: '2026-09-05 18:20',
    readCount: 3890,
    wordCount: 1950,
    themeStyle: 'emerald',
    materialsParameters: [
      { name: '门板结构', spec: '铝蜂窝抗变形内芯', standard: '2.8米通顶一门到顶不变形' },
      { name: '封边工艺', spec: '德国豪迈激光封边', standard: '防水等级达到 DIN EN 204 D4' }
    ],
    contentSections: [
      {
        title: '01 / 气候特异性：耐高温高盐环境的材料甄选',
        paragraphs: ['中东海湾六国夏季气温超过45℃，对木作的胶合牢度与防潮性提出了极其严苛的考验...']
      }
    ]
  },
  {
    id: 'art-003',
    topic: '吊滑极简门为何成为海外设计师首选',
    title: '吊滑极简门为何成为海外设计师首选？五金结构与抗变形工艺深度拆解',
    summary: '彻底告别容易积灰且绊倒老幼的传统凸轨地槽，磁悬浮重型天轨如何实现 3000mm 超高单扇门轻盈推拉。',
    coverImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80',
    linkedProducts: ['吊滑极简门', '意式极简铝框玻璃门'],
    linkedCase: {
      id: 'case-sydney',
      name: '悉尼滨海独栋全套木作案例 (共12张)',
      photoCount: 12,
      description: '悉尼双湾滨海独栋高定住宅',
      images: [
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=80'
      ]
    },
    author: 'HomeCraft 研发中心',
    publishPlatform: '微信公众号',
    status: '发布审核中',
    createdAt: '2026-09-02 11:15',
    readCount: 1850,
    wordCount: 1760,
    themeStyle: 'dark',
    materialsParameters: [
      { name: '铝型材壁厚', spec: '2.5mm T6状态航空铝', standard: '抗弯强度 ≥ 240 MPa' }
    ],
    contentSections: [
      {
        title: '01 / 结构革新：天花暗藏轨道的承重奥秘',
        paragraphs: ['通过预埋工字钢龙骨与双层石膏板包覆，将滑轨重量无形转移至建筑主梁...']
      }
    ]
  },
  {
    id: 'art-004',
    topic: '2026米兰设计周高定橱柜前瞻',
    title: '2026米兰设计周高定橱柜前瞻：材质触感革命与一体化隐形收纳',
    summary: '从米兰展会前瞻洞察现代橱柜演化走向：免拉手、深色系原木、低光泽PET与金属收边条的精妙对话。',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    linkedProducts: ['PET肤感板系列', '德国进口阻尼五金系列'],
    linkedCase: {
      id: 'case-london',
      name: '伦敦肯辛顿豪宅全屋定制案例 (共10张)',
      photoCount: 10,
      description: '英国伦敦核心区历史风貌豪宅',
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80'
      ]
    },
    author: 'HomeCraft 品牌部',
    publishPlatform: '微信公众号',
    status: '计划发布',
    scheduledPublishTime: '2026-09-12 18:00 (自动定时群发)',
    createdAt: '2026-08-28 16:40',
    readCount: 2920,
    wordCount: 2400,
    themeStyle: 'warm',
    materialsParameters: [
      { name: '五金系统', spec: '全包覆阻尼暗铰链', standard: '三维快速微调' }
    ],
    contentSections: [
      {
        title: '01 / 设计语言：从横平竖直走向立体微雕',
        paragraphs: ['现代高定不再执着于复杂的雕花，而是通过 45 度倒角斜切和毫米级收边...']
      }
    ]
  },
  {
    id: 'art-005',
    topic: '大平层静音门窗与五金选型指南',
    title: '大平层静音门窗与重型阻尼五金选型实操指南',
    summary: '高定住宅对隔音与五金承重的高标准要求，本方案系统分析三轨推拉与磁吸静音锁体应用。',
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
    linkedProducts: ['意式极简铝框玻璃门', '德国进口阻尼五金系列'],
    linkedCase: {
      id: 'case-sydney',
      name: '悉尼滨海独栋全套木作案例 (共12张)',
      photoCount: 12,
      description: '悉尼双湾滨海独栋住宅静音工程',
      images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80']
    },
    author: 'HomeCraft 质检合规组',
    publishPlatform: '微信公众号',
    status: '审核不通过',
    auditRejectReason: '微信公众号官方违禁词检测：第1段内容提及“行业首创绝对静音”表述过于绝对，涉嫌广告法极限词，请在编辑中调整用词为“最高降噪达42dB”后重新提交审核。',
    createdAt: '2026-08-25 10:20',
    readCount: 1120,
    wordCount: 1680,
    themeStyle: 'dark',
    materialsParameters: [
      { name: '隔音阻尼', spec: 'EPDM三元乙丙密封胶条', standard: '气密等级达到8级' }
    ],
    contentSections: [
      {
        title: '01 / 静音系统设计要点',
        paragraphs: ['门窗的声学密封离不开三道密封胶条与气压平衡孔的精密配合...']
      }
    ]
  },
  {
    id: 'art-006',
    topic: '2026高端全屋定制流行色彩趋势发布',
    title: '2026高端全屋定制流行色彩趋势：低饱和大地色与自然质感的回归',
    summary: '色彩不再只是视觉装饰，而是空间情绪与居住者心境的映射。发布2026年度三大经典配色体系。',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    linkedProducts: ['PET肤感板系列', '岩板岛台台面系统'],
    linkedCase: {
      id: 'case-london',
      name: '伦敦肯辛顿豪宅全屋定制案例 (共10张)',
      photoCount: 10,
      description: '全屋低饱和大地色系落地交付实景',
      images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80']
    },
    author: 'HomeCraft 品牌设计部',
    publishPlatform: '微信公众号',
    status: '已发布',
    createdAt: '2026-08-20 09:30',
    readCount: 6850,
    wordCount: 2800,
    themeStyle: 'emerald',
    materialsParameters: [
      { name: '表面色彩光泽', spec: '进口水性抗黄变哑光色漆', standard: '耐光老化测试达5级' }
    ],
    contentSections: [
      {
        title: '01 / 大地色系的治愈力量',
        paragraphs: ['在现代快节奏都市生活中，低饱和大地色为归家者营造平缓舒适的心灵庇护所...']
      }
    ]
  },
  {
    id: 'art-007',
    topic: '废弃草案：旧版欧式雕花衣帽间工艺说明（已归档）',
    title: '【归档草案】旧版欧式复古雕花实木衣帽间工艺说明',
    summary: '该方案已根据最新现代轻奢品牌定位废弃，归档于回收站备查。',
    coverImage: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=800&auto=format&fit=crop&q=80',
    linkedProducts: ['德国进口阻尼五金系列'],
    linkedCase: {
      id: 'case-london',
      name: '早期古典全屋项目图 (共4张)',
      photoCount: 4,
      description: '早期欧式雕花木作方案',
      images: ['https://images.unsplash.com/photo-1558997519-83ea9252def8?w=800&auto=format&fit=crop&q=80']
    },
    author: 'HomeCraft 归档组',
    publishPlatform: '微信公众号',
    status: '回收站',
    createdAt: '2026-08-01 14:00',
    readCount: 320,
    wordCount: 1100,
    themeStyle: 'warm',
    materialsParameters: [
      { name: '木材材质', spec: '美国红橡实木拼板', standard: '传统榫卯结构' }
    ],
    contentSections: [
      {
        title: '01 / 传统工法历史记录',
        paragraphs: ['本篇作为技术储备归档，供后续复古定制项目查阅参考...']
      }
    ]
  }
];

// Helper to generate full WeChat native styled HTML for copying
export function generateWeChatArticleHtml(item: GraphicTextItem): string {
  const sectionsHtml = item.contentSections
    .map((sec) => `
      <section style="margin-top: 28px; margin-bottom: 24px;">
        <h3 style="font-size: 17px; font-weight: bold; color: #0f4a47; border-left: 4px solid #0f4a47; padding-left: 10px; margin-bottom: 14px; line-height: 1.4;">
          ${sec.title}
        </h3>
        ${sec.paragraphs
          .map(
            (p) => `<p style="font-size: 15px; color: #333333; line-height: 1.8; margin-bottom: 14px; text-align: justify; letter-spacing: 0.5px;">${p}</p>`
          )
          .join('')}
        ${
          sec.highlightQuote
            ? `
          <blockquote style="margin: 18px 0; padding: 14px 18px; background-color: #f6faf9; border-left: 3px solid #10b981; border-radius: 4px; color: #065f46; font-size: 14px; font-style: italic; line-height: 1.7;">
            ${sec.highlightQuote}
          </blockquote>
        `
            : ''
        }
        ${
          sec.image
            ? `
          <div style="margin: 18px 0; text-align: center;">
            <img src="${sec.image}" alt="${sec.title}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); display: block; margin: 0 auto;" />
            ${
              sec.caption
                ? `<p style="font-size: 12px; color: #888888; margin-top: 8px; text-align: center;">${sec.caption}</p>`
                : ''
            }
          </div>
        `
            : ''
        }
      </section>
    `)
    .join('');

  const paramsHtml = item.materialsParameters
    .map(
      (p) => `
      <tr style="border-bottom: 1px solid #eef2f6;">
        <td style="padding: 10px 12px; font-size: 13px; font-weight: bold; color: #1e293b; background-color: #f8fafc; width: 35%;">${p.name}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #0f4a47; font-weight: 600;">${p.spec}</td>
        <td style="padding: 10px 12px; font-size: 12px; color: #64748b;">${p.standard}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="max-width: 677px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; padding: 16px; color: #333333; line-height: 1.6;">
      <!-- Title -->
      <h1 style="font-size: 22px; font-weight: bold; color: #111827; line-height: 1.35; margin-bottom: 14px;">
        ${item.title}
      </h1>

      <!-- Meta Info -->
      <div style="font-size: 13px; color: #888888; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
        <span style="color: #0f4a47; font-weight: bold;">${item.author}</span>
        <span style="background-color: #e6f4f1; color: #0f4a47; font-size: 11px; padding: 2px 6px; border-radius: 3px;">原创</span>
        <span>${item.createdAt}</span>
      </div>

      <!-- Lead Quote Box -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; position: relative;">
        <div style="font-size: 12px; font-weight: bold; color: #0f4a47; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">【本期导读与设计洞察】</div>
        <p style="font-size: 14px; color: #475569; line-height: 1.8; margin: 0;">
          ${item.summary}
        </p>
      </div>

      <!-- Linked Assets Notice -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
        <div>
          <span style="font-weight: bold; color: #065f46;">关联产品：</span>
          <span style="color: #047857;">${item.linkedProducts.join(' · ')}</span>
        </div>
        <div style="color: #059669; font-weight: bold;">
          项目实录：${item.linkedCase.name}
        </div>
      </div>

      <!-- Material Parameters Table -->
      <div style="margin: 24px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f4a47; color: #ffffff; padding: 10px 14px; font-size: 13px; font-weight: bold;">
          📐 核心工法与材质技术参数明细
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid #cbd5e1; background-color: #f1f5f9;">
              <th style="padding: 8px 12px; font-size: 12px; color: #475569;">部件/工艺</th>
              <th style="padding: 8px 12px; font-size: 12px; color: #475569;">技术规格</th>
              <th style="padding: 8px 12px; font-size: 12px; color: #475569;">质检验收标准</th>
            </tr>
          </thead>
          <tbody>
            ${paramsHtml}
          </tbody>
        </table>
      </div>

      <!-- Main Body Sections -->
      ${sectionsHtml}

      <!-- Bottom Card & Footer -->
      <div style="margin-top: 36px; padding: 20px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; text-align: center;">
        <div style="font-size: 15px; font-weight: bold; color: #0f4a47; margin-bottom: 6px;">HomeCraft 高定工程全球交付中心</div>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 14px;">提供高规格门墙柜一体化外贸 OEM/ODM，支持 1:1 CAD/3D 效果图与实物色卡快递</p>
        <div style="display: inline-block; padding: 8px 18px; background-color: #0f4a47; color: #ffffff; border-radius: 20px; font-size: 13px; font-weight: bold;">
          预约设计师工法沟通 / 索取2026色卡料册
        </div>
      </div>
    </div>
  `;
}
