export interface StaffTrainingRecord {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  department: string;
  role: string;
  courseId: string;
  courseTitle: string;
  mentorName: string;
  mentorTitle: string;
  currentLesson: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  studyMinutes: number;
  interactiveQuestionsCount: number;
  latestScore: number;
  grade: 'S (卓越)' | 'A (良好)' | 'B (合格)' | 'C (待补考)';
  status: 'completed' | 'in_progress' | 'needs_retake';
  lastActiveDate: string;
  examQuestion: string;
  studentAnswer: string;
  standardKeyPoints: string[];
  mentorReview: string;
  aiImprovementTip: string;
}

export interface DepartmentTrainingStat {
  department: string;
  enrolledCount: number;
  completionRate: number; // Percentage e.g. 92
  averageScore: number; // e.g. 94.2
  totalStudyHours: number;
}

export interface CourseHeatStat {
  name: string;
  category: string;
  traineeCount: number;
  passRate: number;
  color: string;
}

export interface DailyTrainingTrend {
  date: string;
  studyHours: number;
  interactions: number;
  quizzesPassed: number;
}

export const initialDepartmentStats: DepartmentTrainingStat[] = [
  { department: '外贸业务一组', enrolledCount: 12, completionRate: 94, averageScore: 95.2, totalStudyHours: 48.5 },
  { department: '售前客服组', enrolledCount: 10, completionRate: 96, averageScore: 93.8, totalStudyHours: 42.0 },
  { department: '海外品牌推广部', enrolledCount: 8, completionRate: 88, averageScore: 91.5, totalStudyHours: 32.5 },
  { department: '定制工程设计组', enrolledCount: 7, completionRate: 85, averageScore: 89.0, totalStudyHours: 26.0 },
  { department: '人力与组织发展部', enrolledCount: 5, completionRate: 100, averageScore: 96.5, totalStudyHours: 19.5 }
];

export const initialCourseHeatStats: CourseHeatStat[] = [
  { name: '外贸全屋定制销冠谈判', category: '销售实战', traineeCount: 16, passRate: 94, color: '#EA3A20' },
  { name: 'TikTok/Instagram新媒体运营', category: '海外推广', traineeCount: 12, passRate: 88, color: '#0F4A47' },
  { name: '德系激光封边与环保合规', category: '产品百科', traineeCount: 9, passRate: 92, color: '#F59E0B' },
  { name: '企业文化与新员工试用期合规', category: '人事行政', traineeCount: 5, passRate: 100, color: '#8B5CF6' }
];

export const initialTrainingTrends: DailyTrainingTrend[] = [
  { date: '08-25', studyHours: 14.5, interactions: 38, quizzesPassed: 6 },
  { date: '08-26', studyHours: 18.2, interactions: 45, quizzesPassed: 8 },
  { date: '08-27', studyHours: 21.0, interactions: 52, quizzesPassed: 11 },
  { date: '08-28', studyHours: 19.5, interactions: 49, quizzesPassed: 9 },
  { date: '08-29', studyHours: 26.4, interactions: 68, quizzesPassed: 14 },
  { date: '08-30', studyHours: 24.8, interactions: 62, quizzesPassed: 13 },
  { date: '08-31', studyHours: 28.5, interactions: 74, quizzesPassed: 16 }
];

export const initialStaffTrainingRecords: StaffTrainingRecord[] = [
  {
    id: 'TR-REC-001',
    employeeId: 'EMP-003',
    name: 'Alex Schmidt',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    department: '海外业务一组',
    role: '外贸业务员',
    courseId: 'course-sales',
    courseTitle: '外贸全屋定制高阶销冠实战入门与大单谈判',
    mentorName: '林导师',
    mentorTitle: '资深外贸销冠导师 · 商务谈判总监',
    currentLesson: '第2节：客户异议处理与3F谈判实战拆解',
    completedLessons: 2,
    totalLessons: 3,
    progressPercent: 67,
    studyMinutes: 38,
    interactiveQuestionsCount: 7,
    latestScore: 96,
    grade: 'S (卓越)',
    status: 'in_progress',
    lastActiveDate: '今日 14:20',
    examQuestion: '面对北美买家“你们比越南工厂贵18%”的价格异议，如何运用 3F 法则有效化解？',
    studentAnswer: '先用 Feel 认同买家对成本控制的关切；再用 Felt 说明许多澳洲与加州客户在初次接洽时也曾比较过越南工厂；最后用 Found 摆事实：越南工厂供应链不全且多为手工涂胶易吸水开裂，品爱采用德国豪迈激光封边零胶缝及Blum五金，海外当地人工返工一次即超过$2000，整体综合持有成本实际上成品更省15%。',
    standardKeyPoints: ['Feel 同理共情', 'Felt 引用同区域标杆同行案例', 'Found 聚焦激光封边零胶缝与海外高昂上门维修人工成本'],
    mentorReview: '林导师评卷：答卷逻辑非常严密，切中海外工程客户最忌讳的售后人工风险点，3F法则运用熟练自然，准予96分高分！',
    aiImprovementTip: '实战中可配合《北美海运零胶缝耐湿热对比白皮书》PDF彩页直接发送给客户增强权威度。'
  },
  {
    id: 'TR-REC-002',
    employeeId: 'EMP-004',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    department: '海外品牌推广部',
    role: '推广运营官',
    courseId: 'course-marketing',
    courseTitle: 'TikTok & Instagram 海外定制家具爆款矩阵操盘',
    mentorName: '苏总监',
    mentorTitle: '海外新媒体操盘手 · 出海内容总监',
    currentLesson: '第3节：主页引流与WordPress高意向私域转化漏斗',
    completedLessons: 3,
    totalLessons: 3,
    progressPercent: 100,
    studyMinutes: 52,
    interactiveQuestionsCount: 9,
    latestScore: 98,
    grade: 'S (卓越)',
    status: 'completed',
    lastActiveDate: '昨日 17:45',
    examQuestion: '制作一条针对欧美中高端业主的厨房岛台短视频，黄金前3秒该如何构思视听钩子？',
    studentAnswer: '采用动态视觉反差钩子：前1.5秒特写展示德国电磁升降隐藏岛台瞬间升起并伴随高质感机械音效，屏幕居中文案弹出“This kitchen hidden feature saved $15,000 remodel cost!”；快速切换到女主人触碰激光封边无痕板材细节，引导评论区领取免费3D全屋效果图。',
    standardKeyPoints: ['前3秒强动作/反差音效', '聚焦痛点与省钱/增值数字文案', '强化品质微距细节并留出互动Hook'],
    mentorReview: '苏总监评卷：黄金3秒钩子节奏感极佳，音画配合到位，Call to Action引导自然，评定为98分卓越满分水平！',
    aiImprovementTip: '已达到上线实操标准，建议本周在 TikTok 账号安排首条 A/B 测试发布。'
  },
  {
    id: 'TR-REC-003',
    employeeId: 'EMP-002',
    name: 'Sophia Wang',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    department: '售前客服组',
    role: '外贸主管',
    courseId: 'course-sales',
    courseTitle: '外贸全屋定制高阶销冠实战入门与大单谈判',
    mentorName: '林导师',
    mentorTitle: '资深外贸销冠导师 · 商务谈判总监',
    currentLesson: '第1节：核心板材合规与德国豪迈激光封边卖点透析',
    completedLessons: 1,
    totalLessons: 3,
    progressPercent: 33,
    studyMinutes: 20,
    interactiveQuestionsCount: 4,
    latestScore: 94,
    grade: 'A (良好)',
    status: 'in_progress',
    lastActiveDate: '前天 11:15',
    examQuestion: '出口美国的板式衣柜在报关提货时，纸箱外侧及单证必须具备哪种环保合规标识？',
    studentAnswer: '必须附带符合 EPA 格式的 CARB P2 / TSCA Title VI 合规检测报告与声明标签，并核验 FSC 监管链编号。',
    standardKeyPoints: ['CARB P2', 'TSCA Title VI', '合规检测报告'],
    mentorReview: '林导师评卷：基础扎实，环保法规格局清晰，建议后续章节加快跟进节奏。',
    aiImprovementTip: '保持带教答疑频次，重点跟进第二节异议化解练习。'
  },
  {
    id: 'TR-REC-004',
    employeeId: 'EMP-006',
    name: 'David Zhang (张工)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    department: '定制工程设计组',
    role: '定制方案深化师',
    courseId: 'course-hr',
    courseTitle: '品爱家居员工手册、企业文化与跨部门协同',
    mentorName: '张敏总监',
    mentorTitle: '人力资源与组织发展总监',
    currentLesson: '第2节：试用期转正考核标准与工时合规规范',
    completedLessons: 2,
    totalLessons: 3,
    progressPercent: 67,
    studyMinutes: 25,
    interactiveQuestionsCount: 3,
    latestScore: 91,
    grade: 'A (良好)',
    status: 'in_progress',
    lastActiveDate: '今日 10:30',
    examQuestion: '新员工试用期转正考核核心维度包含哪些方面？遇跨部门配合延期应如何合规报备？',
    studentAnswer: '包含工作业绩达成率、专业知识实操考试得分（≥85分）、价值观与协同考核。遇跨部门设计延期，必须在24小时内在ERP提报进度异常并同步抄送部门主管与HRBP。',
    standardKeyPoints: ['业绩与专业考核', '协同与价值观', '24小时系统报备机制'],
    mentorReview: '张敏总监评卷：回答条理分明，熟悉合规流程，考核达标！',
    aiImprovementTip: '建议尽快完成最后一节信息安全与知识产权保密协议签署。'
  },
  {
    id: 'TR-REC-005',
    employeeId: 'EMP-007',
    name: 'Kelly Li (李娜)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    department: '海外业务一组',
    role: '初级外贸业务员',
    courseId: 'course-sales',
    courseTitle: '外贸全屋定制高阶销冠实战入门与大单谈判',
    mentorName: '林导师',
    mentorTitle: '资深外贸销冠导师 · 商务谈判总监',
    currentLesson: '第1节：核心板材合规与德国豪迈激光封边卖点透析',
    completedLessons: 0,
    totalLessons: 3,
    progressPercent: 15,
    studyMinutes: 8,
    interactiveQuestionsCount: 1,
    latestScore: 74,
    grade: 'C (待补考)',
    status: 'needs_retake',
    lastActiveDate: '08-28 16:00',
    examQuestion: '出口美国的板式衣柜在报关提货时，纸箱外侧及单证必须具备哪种环保合规标识？',
    studentAnswer: '仅提供工厂出厂合格证与普通国标E1级别质检报告。',
    standardKeyPoints: ['CARB P2', 'TSCA Title VI', '合规检测报告'],
    mentorReview: '林导师评卷：未命中核心点！欧美海关严查EPA TSCA与CARB P2认证，国标E1不能直接用于美国清关，已驳回重测。',
    aiImprovementTip: '请重新研读《品爱家居合规白皮书》第一节讲义，温习后点击重新测验。'
  }
];
