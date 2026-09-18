import { ModuleType } from '../types';

export interface RouteDefinition {
  path: string;
  moduleId: ModuleType;
  subView: string;
  moduleTitle: string;
  pageTitle: string;
}

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  // 1. 知识问答
  {
    path: '/home',
    moduleId: 'home',
    subView: '知识问答',
    moduleTitle: '知识问答',
    pageTitle: '知识问答'
  },
  // 2. 售前询盘助手
  {
    path: '/pre-sales',
    moduleId: 'pre_sales',
    subView: '售前询盘列表',
    moduleTitle: '售前询盘助手',
    pageTitle: '售前询盘助手'
  },
  // 3. 销售助手
  {
    path: '/in-sales',
    moduleId: 'in_sales',
    subView: '会话列表',
    moduleTitle: '销售助手',
    pageTitle: '销售助手'
  },
  // 4. 运营助手
  {
    path: '/marketing/video',
    moduleId: 'marketing',
    subView: '视频剪辑',
    moduleTitle: '运营助手',
    pageTitle: '视频剪辑'
  },
  {
    path: '/marketing/article',
    moduleId: 'marketing',
    subView: '图文生成',
    moduleTitle: '运营助手',
    pageTitle: '图文生成'
  },
  {
    path: '/marketing/audit',
    moduleId: 'marketing',
    subView: '发布审核',
    moduleTitle: '运营助手',
    pageTitle: '发布审核'
  },
  {
    path: '/marketing/schedule',
    moduleId: 'marketing',
    subView: '发布计划',
    moduleTitle: '运营助手',
    pageTitle: '发布计划'
  },
  {
    path: '/marketing/materials',
    moduleId: 'marketing',
    subView: '素材库',
    moduleTitle: '运营助手',
    pageTitle: '素材库'
  },
  {
    path: '/marketing/accounts',
    moduleId: 'marketing',
    subView: '账号管理',
    moduleTitle: '运营助手',
    pageTitle: '账号管理'
  },
  // 5. 知识库管理
  {
    path: '/knowledge/upload',
    moduleId: 'knowledge_base',
    subView: '内容上传',
    moduleTitle: '知识库管理',
    pageTitle: '内容上传'
  },
  {
    path: '/knowledge/review',
    moduleId: 'knowledge_base',
    subView: '知识复核',
    moduleTitle: '知识库管理',
    pageTitle: '知识复核'
  },
  {
    path: '/knowledge/categories',
    moduleId: 'knowledge_base',
    subView: '分类管理',
    moduleTitle: '知识库管理',
    pageTitle: '分类管理'
  },
  {
    path: '/knowledge/tags',
    moduleId: 'knowledge_base',
    subView: '标签管理',
    moduleTitle: '知识库管理',
    pageTitle: '标签管理'
  },
  // 6. 产品价格维护
  {
    path: '/pricing/list',
    moduleId: 'pricing_maintenance',
    subView: '面价设置',
    moduleTitle: '产品价格维护',
    pageTitle: '面价设置'
  },
  {
    path: '/pricing/exchange-rates',
    moduleId: 'pricing_maintenance',
    subView: '汇率管理',
    moduleTitle: '产品价格维护',
    pageTitle: '汇率管理'
  },
  // 7. 数据统计
  {
    path: '/analytics/agent',
    moduleId: 'analytics',
    subView: '智能体统计',
    moduleTitle: '数据统计',
    pageTitle: '智能体统计'
  },
  {
    path: '/analytics/user',
    moduleId: 'analytics',
    subView: '用户使用系统统计',
    moduleTitle: '数据统计',
    pageTitle: '用户使用系统统计'
  },
  // 8. 员工权限
  {
    path: '/employee/list',
    moduleId: 'employee',
    subView: '员工列表',
    moduleTitle: '员工权限',
    pageTitle: '员工列表'
  },
  {
    path: '/employee/roles',
    moduleId: 'employee',
    subView: '角色列表',
    moduleTitle: '员工权限',
    pageTitle: '角色列表'
  },
  // 9. 智能体基础设置
  {
    path: '/system/agent',
    moduleId: 'sys_config',
    subView: 'Agent 配置',
    moduleTitle: '智能体基础设置',
    pageTitle: 'Agent 配置'
  },
  {
    path: '/system/skill',
    moduleId: 'sys_config',
    subView: 'Skill 配置',
    moduleTitle: '智能体基础设置',
    pageTitle: 'Skill 配置'
  },
  // 10. 日志与审计
  {
    path: '/audit',
    moduleId: 'audit_logs',
    subView: '日志与审计',
    moduleTitle: '日志与审计',
    pageTitle: '日志与审计'
  }
];

// Map from module & subView to path
export function getPathByModuleAndSubView(moduleId: ModuleType, subView?: string): string {
  if (subView) {
    const match = ROUTE_DEFINITIONS.find(
      (r) => r.moduleId === moduleId && r.subView === subView
    );
    if (match) return match.path;
  }
  const defaultMatch = ROUTE_DEFINITIONS.find((r) => r.moduleId === moduleId);
  return defaultMatch ? defaultMatch.path : '/pre-sales';
}

// Parse pathname to module and subView
export function parseRoute(pathname: string): {
  moduleId: ModuleType;
  subView: string;
  moduleTitle: string;
  pageTitle: string;
} {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  // Direct exact match
  const exact = ROUTE_DEFINITIONS.find((r) => r.path === normalized);
  if (exact) {
    return exact;
  }

  // Prefix matches for root module paths
  if (normalized.startsWith('/marketing')) {
    return ROUTE_DEFINITIONS.find((r) => r.path === '/marketing/video')!;
  }
  if (normalized.startsWith('/knowledge')) {
    return ROUTE_DEFINITIONS.find((r) => r.path === '/knowledge/upload')!;
  }
  if (normalized.startsWith('/pricing')) {
    return ROUTE_DEFINITIONS.find((r) => r.path === '/pricing/list')!;
  }
  if (normalized.startsWith('/analytics')) {
    return ROUTE_DEFINITIONS.find((r) => r.path === '/analytics/sales')!;
  }
  if (normalized.startsWith('/employee')) {
    if (normalized.includes('roles')) {
      return ROUTE_DEFINITIONS.find((r) => r.path === '/employee/roles')!;
    }
    return ROUTE_DEFINITIONS.find((r) => r.path === '/employee/list')!;
  }
  if (normalized.startsWith('/system')) {
    return ROUTE_DEFINITIONS.find((r) => r.path === '/system/agent')!;
  }
  if (normalized.startsWith('/audit')) {
    return ROUTE_DEFINITIONS.find((r) => r.path === '/audit/operations')!;
  }
  if (normalized === '/qa') {
    return ROUTE_DEFINITIONS.find((r) => r.path === '/home')!;
  }

  // Default fallback
  return ROUTE_DEFINITIONS.find((r) => r.path === '/pre-sales')!;
}
