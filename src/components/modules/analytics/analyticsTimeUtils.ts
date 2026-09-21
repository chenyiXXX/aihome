export type TimeRangeMode =
  | '7d'
  | '30d'
  | 'custom_range'
  | 'month'
  | 'quarter'
  | 'year'
  | 'all';

export interface TimeFilterState {
  mode: TimeRangeMode;
  startDate: string;
  endDate: string;
  year: number;
  month: number;
  quarter: number; // 4 for 2026 (since launched in Nov)
}

// System launch date is 2026-11-01. No data exists before this date.
export const SYSTEM_LAUNCH_DATE = '2026-11-01';
export const SYSTEM_LAUNCH_YEAR = 2026;
export const SYSTEM_LAUNCH_MONTH = 11;

export const INITIAL_TIME_FILTER: TimeFilterState = {
  mode: '7d',
  startDate: '2026-11-01',
  endDate: '2026-11-20',
  year: 2026,
  month: 11,
  quarter: 4
};

// Available years (only 2026 onwards since system launched Nov 2026)
export const AVAILABLE_YEARS = [2026];

// Available months per year: for 2026, only November & December (system launched in Nov)
export const getAvailableMonths = (year: number): { month: number; label: string }[] => {
  if (year === 2026) {
    return [
      { month: 11, label: '11 月 (系统上线首月)' },
      { month: 12, label: '12 月' }
    ];
  }
  return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, label: `${i + 1} 月` }));
};

// Available quarters per year: for 2026, only Q4 (冬季 11-12月)
export const getAvailableQuarters = (year: number): { quarter: number; label: string; season: string; months: string }[] => {
  if (year === 2026) {
    return [
      { quarter: 4, label: '第四季度 (Q4)', season: '冬季', months: '11月上线 - 12月' }
    ];
  }
  return [
    { quarter: 1, label: '第一季度 (Q1)', season: '春季', months: '1月 - 3月' },
    { quarter: 2, label: '第二季度 (Q2)', season: '夏季', months: '4月 - 6月' },
    { quarter: 3, label: '第三季度 (Q3)', season: '秋季', months: '7月 - 9月' },
    { quarter: 4, label: '第四季度 (Q4)', season: '冬季', months: '10月 - 12月' }
  ];
};

export function getTimePeriodLabel(filter: TimeFilterState): string {
  switch (filter.mode) {
    case '7d':
      return '近 7 天 (2026-11-14 ~ 2026-11-20)';
    case '30d':
      return '近 30 天 (2026-11-01 ~ 2026-11-20 · 上线运营至今)';
    case 'custom_range':
      return `指定日期范围 (${filter.startDate} 至 ${filter.endDate})`;
    case 'month':
      return `指定月份 (${filter.year}年 ${filter.month}月)`;
    case 'quarter': {
      return `指定季节 (${filter.year}年 第四季度 · 冬季 · 上线运营期)`;
    }
    case 'year':
      return `指定年份 (${filter.year} 全年度 · 11月上线运营)`;
    case 'all':
      return '全周期 (2026年11月上线至今)';
  }
}

export function getTimeMultiplier(filter: TimeFilterState): number {
  switch (filter.mode) {
    case '7d':
      return 1.0;
    case '30d':
      return 2.8;
    case 'custom_range': {
      const start = new Date(filter.startDate).getTime();
      const end = new Date(filter.endDate).getTime();
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
      return Math.max(0.2, Number((days / 7).toFixed(2)));
    }
    case 'month':
      return 3.5;
    case 'quarter':
      return 6.8;
    case 'year':
      return 8.2;
    case 'all':
      return 8.2;
  }
}

export interface AgentTrendPoint {
  date: string;
  报价商务: number;
  前置处理: number;
  商务文案: number;
  工艺质检: number;
  解决率: number;
}

export function getAgentTrendData(filter: TimeFilterState): AgentTrendPoint[] {
  switch (filter.mode) {
    case '7d':
      return [
        { date: '11-14', 报价商务: 420, 前置处理: 340, 商务文案: 250, 工艺质检: 130, 解决率: 97.2 },
        { date: '11-15', 报价商务: 460, 前置处理: 360, 商务文案: 270, 工艺质检: 145, 解决率: 97.5 },
        { date: '11-16', 报价商务: 510, 前置处理: 390, 商务文案: 290, 工艺质检: 160, 解决率: 97.8 },
        { date: '11-17', 报价商务: 560, 前置处理: 420, 商务文案: 310, 工艺质检: 175, 解决率: 98.2 },
        { date: '11-18', 报价商务: 590, 前置处理: 445, 商务文案: 330, 工艺质检: 185, 解决率: 98.5 },
        { date: '11-19', 报价商务: 620, 前置处理: 465, 商务文案: 345, 工艺质检: 195, 解决率: 98.7 },
        { date: '11-20', 报价商务: 650, 前置处理: 485, 商务文案: 360, 工艺质检: 205, 解决率: 98.9 },
      ];

    case '30d':
      return [
        { date: '11-01 (上线)', 报价商务: 120, 前置处理: 95, 商务文案: 60, 工艺质检: 30, 解决率: 94.5 },
        { date: '11-04', 报价商务: 210, 前置处理: 160, 商务文案: 110, 工艺质检: 55, 解决率: 95.8 },
        { date: '11-08', 报价商务: 330, 前置处理: 250, 商务文案: 170, 工艺质检: 85, 解决率: 96.5 },
        { date: '11-12', 报价商务: 440, 前置处理: 330, 商务文案: 230, 工艺质检: 120, 解决率: 97.2 },
        { date: '11-15', 报价商务: 510, 前置处理: 390, 商务文案: 280, 工艺质检: 150, 解决率: 97.8 },
        { date: '11-18', 报价商务: 590, 前置处理: 445, 商务文案: 330, 工艺质检: 185, 解决率: 98.5 },
        { date: '11-20', 报价商务: 650, 前置处理: 485, 商务文案: 360, 工艺质检: 205, 解决率: 98.9 },
      ];

    case 'custom_range':
      return [
        { date: `${filter.startDate.slice(5)}`, 报价商务: 320, 前置处理: 240, 商务文案: 160, 工艺质检: 80, 解决率: 96.0 },
        { date: '周期25%', 报价商务: 410, 前置处理: 320, 商务文案: 220, 工艺质检: 115, 解决率: 96.8 },
        { date: '周期50%', 报价商务: 500, 前置处理: 380, 商务文案: 270, 工艺质检: 145, 解决率: 97.5 },
        { date: '周期75%', 报价商务: 580, 前置处理: 430, 商务文案: 310, 工艺质检: 170, 解决率: 98.2 },
        { date: `${filter.endDate.slice(5)}`, 报价商务: 650, 前置处理: 485, 商务文案: 360, 工艺质检: 205, 解决率: 98.9 },
      ];

    case 'month':
      return [
        { date: `${filter.month}月01日 (上线)`, 报价商务: 150, 前置处理: 110, 商务文案: 75, 工艺质检: 35, 解决率: 95.0 },
        { date: `${filter.month}月05日`, 报价商务: 260, 前置处理: 190, 商务文案: 130, 工艺质检: 70, 解决率: 96.0 },
        { date: `${filter.month}月10日`, 报价商务: 390, 前置处理: 290, 商务文案: 200, 工艺质检: 105, 解决率: 96.8 },
        { date: `${filter.month}月15日`, 报价商务: 500, 前置处理: 375, 商务文案: 265, 工艺质检: 140, 解决率: 97.6 },
        { date: `${filter.month}月20日`, 报价商务: 650, 前置处理: 485, 商务文案: 360, 工艺质检: 205, 解决率: 98.9 },
      ];

    case 'quarter': {
      return [
        { date: '11月 (上线运营)', 报价商务: 12400, 前置处理: 9200, 商务文案: 6600, 工艺质检: 3400, 解决率: 97.6 },
        { date: '12月 (预估走势)', 报价商务: 16800, 前置处理: 12400, 商务文案: 8900, 工艺质检: 4600, 解决率: 98.5 },
      ];
    }

    case 'year':
      return [
        { date: '11月 (上线首月)', 报价商务: 12400, 前置处理: 9200, 商务文案: 6600, 工艺质检: 3400, 解决率: 97.6 },
        { date: '12月', 报价商务: 16800, 前置处理: 12400, 商务文案: 8900, 工艺质检: 4600, 解决率: 98.5 },
      ];

    case 'all':
      return [
        { date: '2026年11月 (上线至今)', 报价商务: 12400, 前置处理: 9200, 商务文案: 6600, 工艺质检: 3400, 解决率: 97.6 },
      ];
  }
}
