export interface UserUsageRecord {
  id: string;
  rank: number;
  name: string;
  empCode: string;
  dept: string;
  deptCategory: string;
  role: string;
  baseTotalHours: number;
  baseDailyHours: number;
  baseTotalSessions: number;
  baseDailySessions: number;
  avgSessionDurationMin: number;
  activeDays: number;
  totalDays: number;
  activeTier: 'high' | 'medium' | 'light';
  peakHour: string;
  deviceRatio: { pc: number; mobile: number };
  moduleUsage: { module: string; pct: number; hours: number }[];
  isOnline: boolean;
  lastActive: string;
}

export interface HourlyUsagePoint {
  hour: string;
  sessions: number;
  onlineHours: number;
  activeUsers: number;
}

export interface DepartmentUsagePoint {
  deptName: string;
  staffCount: number;
  totalHours: number;
  totalSessions: number;
  avgDailyHours: number;
  avgDailySessions: number;
  activeRate: string;
}

export const DEPARTMENT_FILTER_TABS = [
  { key: 'all', label: '全部部门' },
  { key: '海外营销业务部', label: '海外营销业务部 (销售外贸)' },
  { key: '产品中心', label: '产品中心 (产管/设计/研发)' },
  { key: '制造中心', label: '制造中心 (装配/供应链)' },
  { key: '流程与质量', label: '流程与质量 (QC/合规)' },
  { key: '人力行政', label: '人力行政' },
  { key: '总经办', label: '总经办' }
];

export const USAGE_TIER_OPTIONS = [
  { key: 'all', label: '全部活跃等级' },
  { key: 'high', label: '高频深潜 (日均 ≥ 5h)' },
  { key: 'medium', label: '常态活跃 (日均 2h ~ 5h)' },
  { key: 'light', label: '轻度偶发 (日均 < 2h)' }
];

export const INITIAL_USER_USAGE_RECORDS: UserUsageRecord[] = [
  {
    id: 'U-USAGE-001',
    rank: 1,
    name: 'Alex Schmidt',
    empCode: 'EMP-005',
    dept: '海外营销业务部 / 欧美销售组',
    deptCategory: '海外营销业务部',
    role: '资深外贸业务员',
    baseTotalHours: 168.5,
    baseDailyHours: 8.0,
    baseTotalSessions: 425,
    baseDailySessions: 20.2,
    avgSessionDurationMin: 23.8,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'high',
    peakHour: '14:00 - 17:30 & 20:00 - 22:30',
    deviceRatio: { pc: 92, mobile: 8 },
    moduleUsage: [
      { module: '销售助手 (会话/话术)', pct: 38, hours: 64.0 },
      { module: '售前客服 (询盘对接)', pct: 28, hours: 47.2 },
      { module: '知识问答 (全域知识库)', pct: 18, hours: 30.3 },
      { module: '产品价格维护 (BOQ试算)', pct: 12, hours: 20.2 },
      { module: '运营助手与其它', pct: 4, hours: 6.8 }
    ],
    isOnline: true,
    lastActive: '2026-11-20 19:28'
  },
  {
    id: 'U-USAGE-002',
    rank: 2,
    name: 'Sophia Wang (王淑华)',
    empCode: 'EMP-002',
    dept: '产品中心 / 产品管理部',
    deptCategory: '产品中心',
    role: '外贸主管兼产品专家',
    baseTotalHours: 154.2,
    baseDailyHours: 7.3,
    baseTotalSessions: 388,
    baseDailySessions: 18.5,
    avgSessionDurationMin: 23.8,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'high',
    peakHour: '09:00 - 11:45 & 14:00 - 17:00',
    deviceRatio: { pc: 88, mobile: 12 },
    moduleUsage: [
      { module: '售前客服 (询盘对接)', pct: 36, hours: 55.5 },
      { module: '知识问答 (全域知识库)', pct: 26, hours: 40.1 },
      { module: '销售助手 (会话/话术)', pct: 20, hours: 30.8 },
      { module: '产品价格维护 (BOQ试算)', pct: 14, hours: 21.6 },
      { module: '运营助手与其它', pct: 4, hours: 6.2 }
    ],
    isOnline: true,
    lastActive: '2026-11-20 19:15'
  },
  {
    id: 'U-USAGE-003',
    rank: 3,
    name: 'Elena Rostova',
    empCode: 'EMP-006',
    dept: '海外营销业务部 / 市场品牌组',
    deptCategory: '海外营销业务部',
    role: '跨境营销专家',
    baseTotalHours: 142.8,
    baseDailyHours: 6.8,
    baseTotalSessions: 350,
    baseDailySessions: 16.7,
    avgSessionDurationMin: 24.5,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'high',
    peakHour: '10:00 - 12:00 & 15:00 - 18:00',
    deviceRatio: { pc: 85, mobile: 15 },
    moduleUsage: [
      { module: '运营助手 (图文/剪辑)', pct: 42, hours: 60.0 },
      { module: '知识问答 (全域知识库)', pct: 28, hours: 40.0 },
      { module: '销售助手 (素材/营销)', pct: 18, hours: 25.7 },
      { module: '售前客服 (询盘对接)', pct: 8, hours: 11.4 },
      { module: '其它管理模块', pct: 4, hours: 5.7 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 18:35'
  },
  {
    id: 'U-USAGE-004',
    rank: 4,
    name: 'Michael Chen (陈墨)',
    empCode: 'EMP-001',
    dept: '产品中心 / CMF与3D研发部',
    deptCategory: '产品中心',
    role: '资深家具研发工程师',
    baseTotalHours: 136.0,
    baseDailyHours: 6.5,
    baseTotalSessions: 312,
    baseDailySessions: 14.9,
    avgSessionDurationMin: 26.2,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'high',
    peakHour: '09:30 - 12:00 & 14:00 - 17:30',
    deviceRatio: { pc: 96, mobile: 4 },
    moduleUsage: [
      { module: '知识问答 (工艺/技术标准)', pct: 45, hours: 61.2 },
      { module: '产品价格维护 (结构算价)', pct: 25, hours: 34.0 },
      { module: '售前客服 (技术支持)', pct: 15, hours: 20.4 },
      { module: '销售助手 (产品参数)', pct: 10, hours: 13.6 },
      { module: '其它模块', pct: 5, hours: 6.8 }
    ],
    isOnline: true,
    lastActive: '2026-11-20 19:22'
  },
  {
    id: 'U-USAGE-005',
    rank: 5,
    name: 'David Wilson',
    empCode: 'EMP-007',
    dept: '海外营销业务部 / 亚太销售组',
    deptCategory: '海外营销业务部',
    role: '大客户销售经理',
    baseTotalHours: 129.4,
    baseDailyHours: 6.2,
    baseTotalSessions: 335,
    baseDailySessions: 16.0,
    avgSessionDurationMin: 23.2,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'high',
    peakHour: '10:00 - 12:30 & 14:30 - 18:00',
    deviceRatio: { pc: 82, mobile: 18 },
    moduleUsage: [
      { module: '销售助手 (会话/话术)', pct: 40, hours: 51.8 },
      { module: '售前客服 (高净值询盘)', pct: 30, hours: 38.8 },
      { module: '产品价格维护 (外币报价)', pct: 18, hours: 23.3 },
      { module: '知识问答 (全域知识库)', pct: 10, hours: 12.9 },
      { module: '其它模块', pct: 2, hours: 2.6 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 18:10'
  },
  {
    id: 'U-USAGE-006',
    rank: 6,
    name: 'Chloe Lin (林小曼)',
    empCode: 'EMP-003',
    dept: '流程与质量 / QC品控组',
    deptCategory: '流程与质量',
    role: '外贸质量检验主管',
    baseTotalHours: 122.5,
    baseDailyHours: 5.8,
    baseTotalSessions: 295,
    baseDailySessions: 14.0,
    avgSessionDurationMin: 24.9,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'high',
    peakHour: '08:30 - 11:30 & 13:30 - 16:30',
    deviceRatio: { pc: 75, mobile: 25 },
    moduleUsage: [
      { module: '知识问答 (质检与环保标准)', pct: 52, hours: 63.7 },
      { module: '合规风控 (出货审查)', pct: 26, hours: 31.9 },
      { module: '售前客服 (质量答疑)', pct: 12, hours: 14.7 },
      { module: '知识库管理 (上传质检案例)', pct: 10, hours: 12.2 }
    ],
    isOnline: true,
    lastActive: '2026-11-20 19:05'
  },
  {
    id: 'U-USAGE-007',
    rank: 7,
    name: 'Lucas Dupont',
    empCode: 'EMP-008',
    dept: '海外营销业务部 / 欧洲大区',
    deptCategory: '海外营销业务部',
    role: '外贸代表',
    baseTotalHours: 118.0,
    baseDailyHours: 5.6,
    baseTotalSessions: 305,
    baseDailySessions: 14.5,
    avgSessionDurationMin: 23.2,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'high',
    peakHour: '15:00 - 19:00 & 21:00 - 23:00',
    deviceRatio: { pc: 86, mobile: 14 },
    moduleUsage: [
      { module: '销售助手 (法意西多语种)', pct: 45, hours: 53.1 },
      { module: '售前客服 (欧美询盘)', pct: 32, hours: 37.8 },
      { module: '知识问答 (CE认证与材料)', pct: 15, hours: 17.7 },
      { module: '其它业务模块', pct: 8, hours: 9.4 }
    ],
    isOnline: true,
    lastActive: '2026-11-20 19:30'
  },
  {
    id: 'U-USAGE-008',
    rank: 8,
    name: 'James Rodriguez',
    empCode: 'EMP-009',
    dept: '制造中心 / 智能装配工厂',
    deptCategory: '制造中心',
    role: '生产排期与工程主管',
    baseTotalHours: 105.6,
    baseDailyHours: 5.0,
    baseTotalSessions: 268,
    baseDailySessions: 12.8,
    avgSessionDurationMin: 23.6,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'high',
    peakHour: '08:00 - 11:00 & 13:00 - 16:00',
    deviceRatio: { pc: 78, mobile: 22 },
    moduleUsage: [
      { module: '知识问答 (BOM排期与图纸)', pct: 48, hours: 50.7 },
      { module: '产品价格维护 (工时工序)', pct: 24, hours: 25.3 },
      { module: '知识库管理 (工单工艺)', pct: 16, hours: 16.9 },
      { module: '其它管理模块', pct: 12, hours: 12.7 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 17:50'
  },
  {
    id: 'U-USAGE-009',
    rank: 9,
    name: 'Rachel Adams',
    empCode: 'EMP-010',
    dept: '流程与质量 / 国际关务合规组',
    deptCategory: '流程与质量',
    role: '关务合规专家',
    baseTotalHours: 98.4,
    baseDailyHours: 4.7,
    baseTotalSessions: 242,
    baseDailySessions: 11.5,
    avgSessionDurationMin: 24.4,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '09:00 - 11:30 & 14:00 - 16:30',
    deviceRatio: { pc: 94, mobile: 6 },
    moduleUsage: [
      { module: '知识问答 (海关编码与关税)', pct: 55, hours: 54.1 },
      { module: '合规风控 (原产地证书)', pct: 25, hours: 24.6 },
      { module: '销售助手 (报关条款审核)', pct: 12, hours: 11.8 },
      { module: '其它模块', pct: 8, hours: 7.9 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 17:35'
  },
  {
    id: 'U-USAGE-010',
    rank: 10,
    name: 'Oliver Kim (金泰贤)',
    empCode: 'EMP-011',
    dept: '海外营销业务部 / 日韩拉美组',
    deptCategory: '海外营销业务部',
    role: '外贸业务员',
    baseTotalHours: 94.2,
    baseDailyHours: 4.5,
    baseTotalSessions: 236,
    baseDailySessions: 11.2,
    avgSessionDurationMin: 23.9,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '09:30 - 12:00 & 14:00 - 17:00',
    deviceRatio: { pc: 88, mobile: 12 },
    moduleUsage: [
      { module: '销售助手 (日韩商谈话术)', pct: 42, hours: 39.6 },
      { module: '售前客服 (多平台对接)', pct: 30, hours: 28.3 },
      { module: '知识问答 (定制家具规格)', pct: 18, hours: 17.0 },
      { module: '产品价格维护 (折算汇率)', pct: 10, hours: 9.3 }
    ],
    isOnline: true,
    lastActive: '2026-11-20 19:18'
  },
  {
    id: 'U-USAGE-011',
    rank: 11,
    name: 'Emily Davis',
    empCode: 'EMP-012',
    dept: '产品中心 / 工业设计室',
    deptCategory: '产品中心',
    role: '高级色彩与CMF设计师',
    baseTotalHours: 88.6,
    baseDailyHours: 4.2,
    baseTotalSessions: 210,
    baseDailySessions: 10.0,
    avgSessionDurationMin: 25.3,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '10:00 - 12:30 & 15:00 - 18:00',
    deviceRatio: { pc: 98, mobile: 2 },
    moduleUsage: [
      { module: '知识问答 (色卡库与流行趋势)', pct: 46, hours: 40.8 },
      { module: '运营助手 (渲染效果图图文)', pct: 28, hours: 24.8 },
      { module: '销售助手 (设计方案提炼)', pct: 16, hours: 14.2 },
      { module: '其它模块', pct: 10, hours: 8.8 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 17:15'
  },
  {
    id: 'U-USAGE-012',
    rank: 12,
    name: 'Marcus Weber',
    empCode: 'EMP-013',
    dept: '制造中心 / 国际仓储供应链',
    deptCategory: '制造中心',
    role: '海外仓与国际物流经理',
    baseTotalHours: 82.5,
    baseDailyHours: 3.9,
    baseTotalSessions: 205,
    baseDailySessions: 9.8,
    avgSessionDurationMin: 24.1,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '09:00 - 11:30 & 14:00 - 16:30',
    deviceRatio: { pc: 80, mobile: 20 },
    moduleUsage: [
      { module: '知识问答 (海运港口规则/包装)', pct: 50, hours: 41.3 },
      { module: '产品价格维护 (海运计费阶梯)', pct: 22, hours: 18.2 },
      { module: '销售助手 (交期查询)', pct: 18, hours: 14.8 },
      { module: '其它模块', pct: 10, hours: 8.2 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 16:50'
  },
  {
    id: 'U-USAGE-013',
    rank: 13,
    name: 'Grace Liu (刘雅琴)',
    empCode: 'EMP-004',
    dept: '人力行政 / 组织效能部',
    deptCategory: '人力行政',
    role: 'HR经理兼培训讲师',
    baseTotalHours: 76.4,
    baseDailyHours: 3.6,
    baseTotalSessions: 185,
    baseDailySessions: 8.8,
    avgSessionDurationMin: 24.8,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '09:30 - 12:00 & 14:30 - 17:00',
    deviceRatio: { pc: 86, mobile: 14 },
    moduleUsage: [
      { module: '员工培训与在线考核', pct: 45, hours: 34.4 },
      { module: '知识问答 (企业内训与制度)', pct: 30, hours: 22.9 },
      { module: '员工权限与组织配置', pct: 15, hours: 11.5 },
      { module: '其它管理模块', pct: 10, hours: 7.6 }
    ],
    isOnline: true,
    lastActive: '2026-11-20 18:55'
  },
  {
    id: 'U-USAGE-014',
    rank: 14,
    name: 'Thomas Müller',
    empCode: 'EMP-014',
    dept: '总经办 / 战略发展办',
    deptCategory: '总经办',
    role: '海外战略分析师',
    baseTotalHours: 71.8,
    baseDailyHours: 3.4,
    baseTotalSessions: 162,
    baseDailySessions: 7.7,
    avgSessionDurationMin: 26.6,
    activeDays: 20,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '10:00 - 12:00 & 15:30 - 18:00',
    deviceRatio: { pc: 95, mobile: 5 },
    moduleUsage: [
      { module: '数据统计看板 (大盘监控)', pct: 48, hours: 34.5 },
      { module: '知识问答 (市场竞争与年报)', pct: 32, hours: 23.0 },
      { module: '销售助手 (核心大客进展)', pct: 12, hours: 8.6 },
      { module: '其它模块', pct: 8, hours: 5.7 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 17:40'
  },
  {
    id: 'U-USAGE-015',
    rank: 15,
    name: 'Hannah Zhang (张涵)',
    empCode: 'EMP-015',
    dept: '人力行政 / 综合行政部',
    deptCategory: '人力行政',
    role: '行政主管',
    baseTotalHours: 64.5,
    baseDailyHours: 3.1,
    baseTotalSessions: 158,
    baseDailySessions: 7.5,
    avgSessionDurationMin: 24.5,
    activeDays: 21,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '08:30 - 11:00 & 14:00 - 16:30',
    deviceRatio: { pc: 82, mobile: 18 },
    moduleUsage: [
      { module: '知识问答 (行政资产与流程)', pct: 40, hours: 25.8 },
      { module: '知识库管理 (制度规范发版)', pct: 32, hours: 20.6 },
      { module: '员工权限管理', pct: 18, hours: 11.6 },
      { module: '其它日常模块', pct: 10, hours: 6.5 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 16:45'
  },
  {
    id: 'U-USAGE-016',
    rank: 16,
    name: 'Leo Martin',
    empCode: 'EMP-016',
    dept: '海外营销业务部 / 展会特需组',
    deptCategory: '海外营销业务部',
    role: '展会接待专员',
    baseTotalHours: 58.2,
    baseDailyHours: 2.8,
    baseTotalSessions: 145,
    baseDailySessions: 6.9,
    avgSessionDurationMin: 24.1,
    activeDays: 19,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '10:00 - 12:30 & 14:00 - 17:00',
    deviceRatio: { pc: 70, mobile: 30 },
    moduleUsage: [
      { module: '售前客服 (展会名片录入)', pct: 45, hours: 26.2 },
      { module: '销售助手 (展会特惠报价)', pct: 32, hours: 18.6 },
      { module: '知识问答 (展品规格)', pct: 15, hours: 8.7 },
      { module: '其它模块', pct: 8, hours: 4.7 }
    ],
    isOnline: true,
    lastActive: '2026-11-20 19:20'
  },
  {
    id: 'U-USAGE-017',
    rank: 17,
    name: 'Claire Moreau',
    empCode: 'EMP-017',
    dept: '总经办 / 运营督导部',
    deptCategory: '总经办',
    role: '合规督导审计员',
    baseTotalHours: 52.0,
    baseDailyHours: 2.5,
    baseTotalSessions: 130,
    baseDailySessions: 6.2,
    avgSessionDurationMin: 24.0,
    activeDays: 18,
    totalDays: 21,
    activeTier: 'medium',
    peakHour: '09:00 - 11:30 & 15:00 - 17:30',
    deviceRatio: { pc: 92, mobile: 8 },
    moduleUsage: [
      { module: '日志与审计 (业务留痕查验)', pct: 52, hours: 27.0 },
      { module: '知识问答 (企业合规指引)', pct: 28, hours: 14.6 },
      { module: '数据统计看板', pct: 12, hours: 6.2 },
      { module: '其它审计项', pct: 8, hours: 4.2 }
    ],
    isOnline: false,
    lastActive: '2026-11-20 16:30'
  },
  {
    id: 'U-USAGE-018',
    rank: 18,
    name: 'Samuel Lee (李成民)',
    empCode: 'EMP-018',
    dept: '制造中心 / 生产设备维护组',
    deptCategory: '制造中心',
    role: 'CNC数控机床维保工程师',
    baseTotalHours: 36.4,
    baseDailyHours: 1.7,
    baseTotalSessions: 95,
    baseDailySessions: 4.5,
    avgSessionDurationMin: 23.0,
    activeDays: 16,
    totalDays: 21,
    activeTier: 'light',
    peakHour: '08:30 - 10:30 & 13:30 - 15:00',
    deviceRatio: { pc: 65, mobile: 35 },
    moduleUsage: [
      { module: '知识问答 (设备维保与故障排查)', pct: 65, hours: 23.7 },
      { module: '知识库管理 (机修手册)', pct: 22, hours: 8.0 },
      { module: '其它工厂模块', pct: 13, hours: 4.7 }
    ],
    isOnline: false,
    lastActive: '2026-11-19 16:20'
  },
  {
    id: 'U-USAGE-019',
    rank: 19,
    name: 'Arthur Pendelton',
    empCode: 'EMP-019',
    dept: '总经办 / 战略顾问组',
    deptCategory: '总经办',
    role: '高级外部战略顾问',
    baseTotalHours: 28.5,
    baseDailyHours: 1.4,
    baseTotalSessions: 62,
    baseDailySessions: 3.0,
    avgSessionDurationMin: 27.6,
    activeDays: 12,
    totalDays: 21,
    activeTier: 'light',
    peakHour: '10:30 - 12:00',
    deviceRatio: { pc: 90, mobile: 10 },
    moduleUsage: [
      { module: '数据统计看板 (经营宏观概览)', pct: 60, hours: 17.1 },
      { module: '知识问答 (行业洞察研报)', pct: 30, hours: 8.5 },
      { module: '其它模块', pct: 10, hours: 2.9 }
    ],
    isOnline: false,
    lastActive: '2026-11-18 11:45'
  },
  {
    id: 'U-USAGE-020',
    rank: 20,
    name: 'Zoe Becker',
    empCode: 'EMP-020',
    dept: '流程与质量 / 绿色环保认证部',
    deptCategory: '流程与质量',
    role: 'FSC/碳足迹认证专员',
    baseTotalHours: 25.2,
    baseDailyHours: 1.2,
    baseTotalSessions: 58,
    baseDailySessions: 2.8,
    avgSessionDurationMin: 26.1,
    activeDays: 11,
    totalDays: 21,
    activeTier: 'light',
    peakHour: '14:00 - 16:00',
    deviceRatio: { pc: 95, mobile: 5 },
    moduleUsage: [
      { module: '知识问答 (FSC及环保合规)', pct: 62, hours: 15.6 },
      { module: '知识库管理 (认证报告沉淀)', pct: 25, hours: 6.3 },
      { module: '产品价格维护 (环保溢价计算)', pct: 13, hours: 3.3 }
    ],
    isOnline: false,
    lastActive: '2026-11-17 15:30'
  }
];

// 24-hour Distribution Pattern
export const BASE_HOURLY_USAGE: HourlyUsagePoint[] = [
  { hour: '00:00', sessions: 28, onlineHours: 11.2, activeUsers: 8 },
  { hour: '01:00', sessions: 14, onlineHours: 5.6, activeUsers: 4 },
  { hour: '02:00', sessions: 8, onlineHours: 3.1, activeUsers: 2 },
  { hour: '03:00', sessions: 5, onlineHours: 2.0, activeUsers: 2 },
  { hour: '04:00', sessions: 6, onlineHours: 2.4, activeUsers: 2 },
  { hour: '05:00', sessions: 18, onlineHours: 7.2, activeUsers: 6 },
  { hour: '06:00', sessions: 42, onlineHours: 16.8, activeUsers: 14 },
  { hour: '07:00', sessions: 86, onlineHours: 34.4, activeUsers: 28 },
  { hour: '08:00', sessions: 210, onlineHours: 84.0, activeUsers: 68 },
  { hour: '09:00', sessions: 465, onlineHours: 186.0, activeUsers: 115 },
  { hour: '10:00', sessions: 580, onlineHours: 232.0, activeUsers: 124 },
  { hour: '11:00', sessions: 520, onlineHours: 208.0, activeUsers: 118 },
  { hour: '12:00', sessions: 220, onlineHours: 88.0, activeUsers: 54 },
  { hour: '13:00', sessions: 310, onlineHours: 124.0, activeUsers: 72 },
  { hour: '14:00', sessions: 610, onlineHours: 244.0, activeUsers: 126 },
  { hour: '15:00', sessions: 680, onlineHours: 272.0, activeUsers: 128 },
  { hour: '16:00', sessions: 640, onlineHours: 256.0, activeUsers: 125 },
  { hour: '17:00', sessions: 510, onlineHours: 204.0, activeUsers: 112 },
  { hour: '18:00', sessions: 280, onlineHours: 112.0, activeUsers: 65 },
  { hour: '19:00', sessions: 195, onlineHours: 78.0, activeUsers: 42 },
  { hour: '20:00', sessions: 380, onlineHours: 152.0, activeUsers: 84 },
  { hour: '21:00', sessions: 420, onlineHours: 168.0, activeUsers: 90 },
  { hour: '22:00', sessions: 260, onlineHours: 104.0, activeUsers: 58 },
  { hour: '23:00', sessions: 110, onlineHours: 44.0, activeUsers: 26 }
];

// Department Distribution Base
export const BASE_DEPARTMENT_USAGE: DepartmentUsagePoint[] = [
  {
    deptName: '海外营销业务部',
    staffCount: 52,
    totalHours: 712.5,
    totalSessions: 1820,
    avgDailyHours: 6.8,
    avgDailySessions: 17.5,
    activeRate: '100%'
  },
  {
    deptName: '产品中心',
    staffCount: 34,
    totalHours: 432.0,
    totalSessions: 1050,
    avgDailyHours: 6.3,
    avgDailySessions: 15.4,
    activeRate: '100%'
  },
  {
    deptName: '制造中心',
    staffCount: 22,
    totalHours: 245.0,
    totalSessions: 610,
    avgDailyHours: 5.5,
    avgDailySessions: 13.8,
    activeRate: '95.5%'
  },
  {
    deptName: '流程与质量',
    staffCount: 12,
    totalHours: 186.0,
    totalSessions: 460,
    avgDailyHours: 5.1,
    avgDailySessions: 12.7,
    activeRate: '100%'
  },
  {
    deptName: '人力行政',
    staffCount: 8,
    totalHours: 98.5,
    totalSessions: 245,
    avgDailyHours: 4.1,
    avgDailySessions: 10.2,
    activeRate: '100%'
  },
  {
    deptName: '总经办',
    staffCount: 6,
    totalHours: 68.0,
    totalSessions: 160,
    avgDailyHours: 3.7,
    avgDailySessions: 8.8,
    activeRate: '100%'
  }
];
