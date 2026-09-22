import { ModuleType } from '../types';

export type UserRoleType = '超级管理员' | '基础数据维护' | '销售' | '运营推广';

export interface UserRoleProfile {
  name: string;
  role: string;
  department: string;
  avatar: string;
}

/**
 * 角色对应的可见功能菜单配置：
 * - 超级管理员：可以看到所有的菜单；
 * - 基础数据维护：售前询盘、知识库管理、面价汇率、数据统计、员工权限、智能体基础设置、日志与审计；
 * - 销售：可以看到【知识问答】、【销售助手】、【知识库管理】、【面价汇率】；
 * - 运营推广：可以看到【知识问答】、【运营助手】、【知识库管理】。
 */
export const ROLE_ALLOWED_MODULES: Record<UserRoleType, ModuleType[]> = {
  '超级管理员': [
    'home',
    'in_sales',
    'marketing',
    'pre_sales',
    'knowledge_base',
    'pricing_maintenance',
    'analytics',
    'employee',
    'sys_config',
    'audit_logs'
  ],
  '基础数据维护': [
    'pre_sales',
    'knowledge_base',
    'pricing_maintenance',
    'analytics',
    'employee',
    'sys_config',
    'audit_logs'
  ],
  '销售': [
    'home',
    'in_sales',
    'knowledge_base',
    'pricing_maintenance'
  ],
  '运营推广': [
    'home',
    'marketing',
    'knowledge_base'
  ]
};

export const MOCK_ROLE_ACCOUNTS: UserRoleProfile[] = [
  {
    name: 'Franklin Jr',
    role: '超级管理员',
    department: '智能数字化中心',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: '林工',
    role: '基础数据维护',
    department: '基础数据与知识工程部',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sophia Wang',
    role: '销售',
    department: '海外业务事业部',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: '陈工',
    role: '运营推广',
    department: '海外推广运营部',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

/**
 * 标准化角色名称到四大预设角色
 */
export function normalizeRole(roleName?: string): UserRoleType {
  if (!roleName) return '超级管理员';
  if (roleName.includes('基础数据') || roleName.includes('数据维护')) {
    return '基础数据维护';
  }
  if (roleName.includes('销售') || roleName.includes('业务') || roleName.includes('外贸主管')) {
    return '销售';
  }
  if (roleName.includes('运营') || roleName.includes('推广') || roleName.includes('BOQ') || roleName.includes('boq')) {
    return '运营推广';
  }
  return '超级管理员';
}

/**
 * 获取指定角色允许访问的模块列表
 */
export function getAllowedModulesForRole(roleName?: string): ModuleType[] {
  const normRole = normalizeRole(roleName);
  return ROLE_ALLOWED_MODULES[normRole] || ROLE_ALLOWED_MODULES['超级管理员'];
}

/**
 * 校验指定模块是否在当前角色的权限列表中
 */
export function isModuleAllowedForRole(moduleId: ModuleType, roleName?: string): boolean {
  const allowedList = getAllowedModulesForRole(roleName);
  return allowedList.includes(moduleId);
}
