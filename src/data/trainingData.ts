export interface QuizData {
  id: string;
  question: string;
  type: 'choice' | 'text';
  options?: Array<{ key: string; label: string }>;
  correctOption?: string;
  standardKeyPoints: string[];
  explanation: string;
  submittedAnswer?: string;
  score?: number;
  grade?: string;
  passed?: boolean;
  mentorReview?: string;
}

export interface TrainingLesson {
  id: string;
  lessonNumber: number;
  title: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'locked';
  materialContent: string;
  keyTakeaways: string[];
  quiz?: QuizData;
}

export interface TrainingCourse {
  id: string;
  sessionId: string;
  courseTitle: string;
  mentorName: string;
  mentorTitle: string;
  targetRole: string;
  currentLessonIndex: number;
  efficiencyScore: number;
  efficiencyGrade: string;
  interactiveCount: number;
  studyMinutes: number;
  averageQuizScore: number;
  lessons: TrainingLesson[];
}

export const initialTrainingCourses: Record<string, TrainingCourse> = {
  'sess-sales': {
    id: 'course-sales',
    sessionId: 'sess-sales',
    courseTitle: '外贸全屋定制高阶销冠实战入门与大单谈判',
    mentorName: '林导师',
    mentorTitle: '资深外贸销冠导师 · 商务谈判总监',
    targetRole: '外贸大客户经理 / 海外定制家具销售',
    currentLessonIndex: 1, // Second lesson in progress
    efficiencyScore: 96,
    efficiencyGrade: 'S (卓越掌握)',
    interactiveCount: 4,
    studyMinutes: 22,
    averageQuizScore: 95,
    lessons: [
      {
        id: 'sales-l1',
        lessonNumber: 1,
        title: '核心板材合规与德国豪迈激光封边卖点透析',
        duration: '15分钟',
        status: 'completed',
        materialContent: `【品爱家居岗前培训·第1节讲义】
作为外贸定制家居销售，面对海外买家，首先必须具备核心工艺与环保资质的权威说服力：
1. 环保与防潮资质：
   - 欧洲市场必须符合 FSC 产销监管链溯源标准；
   - 北美市场必须满足 CARB P2 及 EPA TSCA Title VI 甲醛游离释放量限量（≤0.05 ppm）。
2. 豪迈激光封边（Laser Edge Banding）：
   - 传统 EVA 热熔胶封边在赤道集装箱海运（温湿度剧变）容易出现胶缝黑线、吸水膨胀开裂；
   - 品爱引进德国 HOMAG 激光封边机，实现零胶缝防水、无缝一体成型，耐水防潮性能提升 400%。
3. 奥地利原厂百隆（Blum）阻尼五金：
   - 承诺 200,000 次启闭疲劳测试质保，直击海外高昂的人工上门返工痛点。`,
        keyTakeaways: [
          '掌握 FSC 与 CARB P2 区别，提单附带 CoC 编号',
          '利用激光封边“零胶缝防潮”说服海运高湿痛点',
          '量化海外人工返修成本（$80-$120/小时）衬托百隆五金价值'
        ],
        quiz: {
          id: 'quiz-sales-1',
          question: '出口美国的板式衣柜在报关提货时，纸箱外侧及单证必须具备哪种环保合规标识？',
          type: 'choice',
          options: [
            { key: 'A', label: '只需标注普通的中国国标 E1 级质检贴纸' },
            { key: 'B', label: '必须附带符合 EPA 格式的 CARB P2 / TSCA Title VI 合规检测报告与声明标签' },
            { key: 'C', label: '仅需出具一般产地证 CO，无需任何环保资质' },
            { key: 'D', label: '只需提供工厂 ISO9001 质量认证副本' }
          ],
          correctOption: 'B',
          standardKeyPoints: ['CARB P2', 'TSCA Title VI', '合规检测报告'],
          explanation: '出口美国必须具备 CARB P2 / EPA TSCA Title VI 认证，否则面临海关扣关甚至退运罚款。',
          submittedAnswer: 'B',
          score: 100,
          grade: 'S (满分通过)',
          passed: true,
          mentorReview: '林导师点评：非常准确！环保合规是欧美大单的生死线，回答清晰果断。'
        }
      },
      {
        id: 'sales-l2',
        lessonNumber: 2,
        title: '欧美与中东大客户心理博弈与3F异议化解',
        duration: '20分钟',
        status: 'in_progress',
        materialContent: `【品爱家居岗前培训·第2节讲义】
很多新销售在遇到海外客户说“别家工厂报价比你低15%”时，极易心慌或直接请求降价。
请牢记销冠标准化采用的 3F 异议化解法则：
1. Feel（共情倾听）：
   - 绝不立刻辩驳，先充分肯定客户对工程预算控制的敏锐度（“I completely understand how critical cost optimization is...”）。
2. Felt（借力同行）：
   - 指出加州、悉尼许多同体量的精品豪宅总包商在初次比价时也有过完全相同的顾虑。
3. Found（价值反算全生命周期成本）：
   - 拿出实测数据：现场安装公差如果超标 3mm，海外现场工人改锯每工时耗费 $90；
   - 品爱 1:1 预装出厂与激光封边让海外总包商现场安装工期缩短 25%，综合人工节省远超 15% 差价！`,
        keyTakeaways: [
          '3F 法则：Feel（同理心）→ Felt（打消顾虑）→ Found（重构价值）',
          '永远不要单独降价，必须通过调整材料配置或起订量进行对等置换',
          '引导客户从单纯出厂价转向“材料+海外安装人工”综合采购成本'
        ],
        quiz: {
          id: 'quiz-sales-2',
          question: '实战演练题：某英国别墅工程采购总监回复邮件称："Other Ningbo suppliers offered $110/sqm for the same design, your price ($130) is too high." 请运用 3F 法则写出你的核心应答策略及关键话术要素。',
          type: 'text',
          standardKeyPoints: ['Feel共情成本考量', 'Felt引用同类海外买家顾虑', 'Found摆出零胶缝激光封边与百隆五金降低海外安装工时返工成本', '提议寄送对比样板盒或Zoom讲图'],
          explanation: '优秀的作答需包含：先理解客户预算压力，引用其他英国设计总包商类似经验，重点对比激光封边防水防爆裂、五金20万次寿命及避免现场高昂工时，最后顺势预约样板或会议推进下一步。'
        }
      },
      {
        id: 'sales-l3',
        lessonNumber: 3,
        title: '30%锁产定金、交期与防汇率波动谈判SOP',
        duration: '18分钟',
        status: 'locked',
        materialContent: `【品爱家居岗前培训·第3节讲义】
外贸定制行业属非标生产，定金与结算条款直接关乎公司现金流安全：
1. 30% T/T 定金核心谈判理由：
   - 定制品无法二次转售，定金到账直接用于锁定该批次板材期货价与进口百隆五金现货排产；
   - 配合抗汇率波动保护条款（±3%安全缓冲区间）。
2. 尾款与单证锁控：
   - 70% 尾款见提单（B/L）复印件或装柜前验货付清，严禁未收齐尾款直接电放（Telex Release）！
3. 锁价时效与催款话术：
   - “报价单有效期为 14 天，定金到账即锁定当期最优 BOM 成本并启动 1:1 拆单施工图深化”。`,
        keyTakeaways: [
          '坚守 30% T/T 预付款底线，非标定制防弃货风控',
          '阐明“定金到账=锁定大宗板材与海运舱位价格”',
          '严格执行未收全尾款不得电放提单的安全红线'
        ],
        quiz: {
          id: 'quiz-sales-3',
          question: '海外客户以"初次合作信任不足"为由，强烈要求仅付10%定金并货到后30天OA付款，新员工应采取哪种正规应对SOP？',
          type: 'choice',
          options: [
            { key: 'A', label: '为了促成首单，未经请示直接全盘接受客户的 10% 定金与 OA 条款' },
            { key: 'B', label: '坚守 30% 定金底线，解释定制家居不可逆拆单成本，可折中提议使用不可撤销即期信用证 (L/C at sight) 或由中信保投保评估' },
            { key: 'C', label: '直接拒绝客户并终止邮件沟通' },
            { key: 'D', label: '要求客户必须 100% 全款预付才可开始沟通' }
          ],
          correctOption: 'B',
          standardKeyPoints: ['不可逆拆单成本', '即期信用证L/C', '中信保投保'],
          explanation: '对于大额定制工程，定制产品无法转卖，首单必须严格控制账期风险，可建议 L/C 即期或中信保授信风控，而非盲目放账。'
        }
      }
    ]
  },
  'sess-ops': {
    id: 'course-ops',
    sessionId: 'sess-ops',
    courseTitle: '跨境家居短视频营销与海外展会数字化获客',
    mentorName: '陈导师',
    mentorTitle: '海外数字营销总监 · 跨境获客操盘手',
    targetRole: '跨境海外社媒运营 / 数字化营销专员',
    currentLessonIndex: 0, // First lesson in progress
    efficiencyScore: 92,
    efficiencyGrade: 'A (稳步进阶)',
    interactiveCount: 2,
    studyMinutes: 14,
    averageQuizScore: 90,
    lessons: [
      {
        id: 'ops-l1',
        lessonNumber: 1,
        title: 'TikTok / Instagram Reels 家居短视频前3秒黄金Hook',
        duration: '15分钟',
        status: 'in_progress',
        materialContent: `【品爱家居运营岗前培训·第1节讲义】
海外短视频算法高度依赖前 3 秒留存率（3s Retention Rate）。家居定制类视频千万不能从平淡的工厂大门开始拍！
1. 黄金前 3 秒三大爆款 Hook 模式：
   - 暴力极限承重测试：红酒或钢球放在百隆阻尼抽屉上，镜头特写平稳推进；
   - 强反差视觉奇观：数控机床 5 轴金刚石刀飞速雕刻实木凹槽；
   - 揭秘行话反常识：“Why Italian designers buy kitchen cabinets from China?”
2. 中段（Value 交付）：
   - 10 秒内展示无拉手极简线条、感应隐藏灯带、E0级环保板横截面；
3. 尾段（CTA 明确）：
   - 评论区置顶引导：“Comment 'BOQ' for 2026 luxury villa design catalogue & pricing list”.`,
        keyTakeaways: [
          '前 3 秒必须具备强视觉动作或疑问悬念，留存率提升 3 倍',
          '强调实工实料与数字化设备，展示中国制造硬核交付力',
          '全链路置顶引导海外建筑师与业主留言索取工程目录'
        ],
        quiz: {
          id: 'quiz-ops-1',
          question: '在策划面向欧美高净值业主的橱柜短视频时，以下哪种片头分镜留存转化效果最高？',
          type: 'choice',
          options: [
            { key: 'A', label: '以长达 8 秒的工厂大门升旗全景作为开场，配轻柔背景音乐' },
            { key: 'B', label: '前 3 秒直接特写德国豪迈刀具飞速精密切削木屑飞溅的原声镜头，配合大字英文疑问悬念' },
            { key: 'C', label: '纯文字黑屏展示公司的历史简介' },
            { key: 'D', label: '让车间工人站成一排对着镜头微笑招手' }
          ],
          correctOption: 'B',
          standardKeyPoints: ['强视觉动作', '微距特写', '原声切削', '英文悬念Hook'],
          explanation: '短视频前 3 秒必须通过强视觉冲击、微距特写或反常识疑问抓住用户眼球，平淡的门头或静态文字会导致高跳出率。'
        }
      },
      {
        id: 'ops-l2',
        lessonNumber: 2,
        title: '跨境B2B独立站长尾RFQ词布局与精准询盘承接',
        duration: '18分钟',
        status: 'locked',
        materialContent: `【品爱家居运营岗前培训·第2节讲义】
核心 B2B 买家不会只搜索“Furniture”，他们搜索的是精准采购词：
1. 高转化长尾词挖掘逻辑：
   - “Custom modern kitchen cabinet supplier for apartments”
   - “FSC certified solid oak bathroom vanity OEM factory”
2. 落地页承接要素：
   - 首屏必须有 3 秒看懂的工厂实景认证视频与在线即时询盘表单（RFQ Form）；
   - 承诺“4小时内回复工程量初步估价（Preliminary BOQ Estimation）”。`,
        keyTakeaways: [
          '精准布局海外工程承包商搜索的长尾工程词',
          '提升独立站首屏询盘表单交互体验与信赖背书',
          '设定 4 小时内首问必答机制保障转化率'
        ],
        quiz: {
          id: 'quiz-ops-2',
          question: '简答题：针对中东迪拜高档精装公寓项目，你会为独立站落地页布局哪些关键词与信赖背书？',
          type: 'text',
          standardKeyPoints: ['Dubai apartment millwork', '耐高温防潮实木多层板', 'FSC/CE认证', '中东大单工程案例背书'],
          explanation: '作答应包含针对中东气候（高热高湿）的工艺卖点、公寓批量工程关键词及过往中东地标项目的案例相册与工程商评价。'
        }
      },
      {
        id: 'ops-l3',
        lessonNumber: 3,
        title: '广交会与迪拜Big5国际展会全流程数字化获客SOP',
        duration: '20分钟',
        status: 'locked',
        materialContent: `【品爱家居运营岗前培训·第3节讲义】
国际展会不仅仅是 4 天现场摆摊，而是 60 天的数字化立体作战：
1. 展前 30 天：通过 EDM 与 LinkedIn 批量邀约往届买家，发放展位 VIP 预约码；
2. 展会现场：使用数字化名片识别工具，当天闭馆前将所有名片录入 CRM 归档；
3. 展后 24 小时：精准发送带当天合影与定制报价单的专属跟进邮件。`,
        keyTakeaways: [
          '展前多渠道精准私信邀约保证展位来访量',
          '现场名片当日数字化录入 CRM 建立分级',
          '展后 24 小时内快速发起个性化报价邮件'
        ]
      }
    ]
  },
  'sess-hr': {
    id: 'course-hr',
    sessionId: 'sess-hr',
    courseTitle: '品爱集团员工入职红线、阶梯提成与差旅报销制度',
    mentorName: '方导师',
    mentorTitle: '集团人力资源总监 · 组织发展顾问',
    targetRole: '新入职全体业务人员 / 后台运营骨干',
    currentLessonIndex: 0, // First lesson in progress
    efficiencyScore: 98,
    efficiencyGrade: 'S (卓越掌握)',
    interactiveCount: 3,
    studyMinutes: 19,
    averageQuizScore: 96,
    lessons: [
      {
        id: 'hr-l1',
        lessonNumber: 1,
        title: '企业文化、保密协议(NDA)与数据安全红线',
        duration: '15分钟',
        status: 'in_progress',
        materialContent: `【品爱家居人事岗前培训·第1节讲义】
欢迎加入品爱家居大家庭！作为一家年出口数千柜的国际化定制家居制造企业，数据资产安全是首要底线：
1. 核心保密资产界定：
   - 供应商采购底价表、BOM拆单原始报价模型、未公开定制工程CAD/3D图纸；
   - 严禁将客户名录、询盘历史通过私人微信、非合规个人网盘外传！
2. 邮件与沟通规范：
   - 所有涉外商务往来与报价单传送必须使用公司标准 @cn-pinai.com 企业邮箱；
3. 离职竞业限制：
   - 核心业务骨干签署 6-12 个月同业竞业禁止协议，公司依法按月发放补偿金。`,
        keyTakeaways: [
          '明确 BOM 报价、客户图纸属于绝对商业保密范围',
          '严禁使用私人社交软件外传公司涉密底价文件',
          '恪守企业邮箱办公红线保障商机可追溯'
        ],
        quiz: {
          id: 'quiz-hr-1',
          question: '新员工小王在与海外客户交流时，由于急于给客户看图纸，将包含其他客户工厂底价的完整 BOM 表直接通过私人邮箱发送，小王的行为触犯了哪项规章？',
          type: 'choice',
          options: [
            { key: 'A', label: '为了业务成交情有可原，公司予以表扬' },
            { key: 'B', label: '严重违反商业机密保护协议(NDA)与数据外发管理规范，面临严肃问责与合规处分' },
            { key: 'C', label: '没有任何问题，只要不是发给国内同行即可' },
            { key: 'D', label: '属于普通迟到早退轻微违纪' }
          ],
          correctOption: 'B',
          standardKeyPoints: ['商业机密保护协议', 'NDA', '底价外发违规'],
          explanation: '工厂底价表与客户资料属于企业核心机密，使用私人邮箱违规外发构成严重违纪。'
        }
      },
      {
        id: 'hr-l2',
        lessonNumber: 2,
        title: '外贸业务员阶梯净利润提成结算与发放节点',
        duration: '18分钟',
        status: 'locked',
        materialContent: `【品爱家居人事岗前培训·第2节讲义】
品爱家居崇尚“多劳多得、价值共创”的高激励机制：
1. 提成核算基数：
   - 按订单履约完成后的实际 FOB 净利润额计算（扣除直接采购及打样等刚性成本）；
2. 阶梯提成点数：
   - 单笔订单毛利率 ≥ 35%：提成比例为净利润的 10% - 12%；
   - 单笔订单毛利率 25% - 35%：提成比例为 7% - 8%；
   - 单笔订单毛利率 18% - 25%：提成比例为 5%；
3. 提成发放时间：
   - 收到买家 70% 尾款、单证放行且客户无索赔后的次月 20 日计入工资统发。`,
        keyTakeaways: [
          '以实际履约净利润为提成基准，注重高质量订单',
          '毛利率越高，所享阶梯提成百分比越丰厚',
          '尾款收齐放行后的次月 20 日全额兑现'
        ],
        quiz: {
          id: 'quiz-hr-2',
          question: '业务员承接了一笔毛利率达到 38% 的澳洲豪宅橱柜大单，净利润为 20 万元人民币，按公司激励制度，该单可计提的提成区间通常为多少？何时发放？',
          type: 'text',
          standardKeyPoints: ['10%-12%', '2万-2.4万元', '收到全部尾款后的次月20日'],
          explanation: '毛利率≥35%属于优质订单，提成比例为10%-12%（即2万-2.4万元），在客户结清尾款且无质量索赔后的次月20日发放。'
        }
      },
      {
        id: 'hr-l3',
        lessonNumber: 3,
        title: '海外展会出差参展报销与生活津贴标准',
        duration: '15分钟',
        status: 'locked',
        materialContent: `【品爱家居人事岗前培训·第3节讲义】
公司全力支持业务员开拓海外市场并参加国际展会：
1. 交通住宿标准：
   - 机票统一由行政预订国际经济舱；
   - 欧美酒店上限 $180/晚，中东东南亚上限 $120/晚；
2. 生活餐补津贴：
   - 海外出差期间享有 $50/人/天 的公杂与餐饮包干津贴；
3. 报销时效：
   - 回国后 5 个工作日内在 OA 提交完整 Invoice 票据审核。`,
        keyTakeaways: [
          '合规遵守海外酒店上限与差旅机票标准',
          '享受 $50/天 的海外生活差旅补贴',
          '回国 5 个工作日内及时完成票据整理与系统报销'
        ]
      }
    ]
  }
};
