import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { ModuleType } from '../../types';

interface SecondarySidebarProps {
  activeModule: ModuleType;
  subView: string;
  onSelectSubView: (subView: string) => void;
  onOpenAddScriptDrawer?: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
  activeModule,
  subView,
  onSelectSubView,
  onOpenAddScriptDrawer,
  collapsed,
  onToggleCollapse
}) => {
  if (collapsed) {
    return (
      <div className="w-10 bg-[#dbe7f9] flex flex-col items-center py-3">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-md transition-colors cursor-pointer"
          title="展开侧边栏"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'conversation': true,
    'forms': true,
    'tags': true
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'home': return '知识问答';
      case 'pre_sales': return '询盘管理';
      case 'in_sales': return '客户';
      case 'marketing': return '营销推广';
      case 'knowledge_base': return '知识库管理';
      case 'analytics': return '数据报告';
      case 'employee': return '团队与权限';
      case 'sys_config': return '系统设置';
      case 'audit_logs': return '日志与审计';
    }
  };

  // Render sub-menu tree based on activeModule (NO NUMERIC PREFIXES)
  const renderTreeMenu = () => {
    switch (activeModule) {
      case 'in_sales':
      case 'pre_sales':
        return (
          <div className="space-y-1">
            {/* 客户列表 */}
            <button
              onClick={() => onSelectSubView(activeModule === 'pre_sales' ? '售前询盘列表' : '客户列表')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                subView.includes('列表') || subView === '客户列表'
                  ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100/80 font-medium'
              }`}
            >
              {activeModule === 'pre_sales' ? '售前询盘列表' : '客户列表'}
            </button>

            {/* 会话管理 ▾ */}
            <div className="pt-0.5">
              <button
                onClick={() => toggleSection('conversation')}
                className="w-full px-3.5 py-1.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <span>会话管理</span>
                {openSections['conversation'] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {openSections['conversation'] && (
                <div className="pl-5 space-y-0.5 mt-0.5">
                  <button
                    onClick={() => onSelectSubView('会话列表')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      subView === '会话列表' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    会话列表
                  </button>
                  <button
                    onClick={() => onSelectSubView('搜索聊天内容')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      subView === '搜索聊天内容' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    搜索聊天内容
                  </button>
                </div>
              )}
            </div>

            {/* 表单管理 ▾ */}
            <div>
              <button
                onClick={() => toggleSection('forms')}
                className="w-full px-3.5 py-1.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <span>表单管理</span>
                {openSections['forms'] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {openSections['forms'] && (
                <div className="pl-5 space-y-0.5 mt-0.5">
                  <button
                    onClick={() => onSelectSubView('订单列表')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      subView === '订单列表' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    订单列表
                  </button>
                  <button
                    onClick={() => onSelectSubView('邀评列表')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      subView === '邀评列表' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    邀评列表
                  </button>
                  <button
                    onClick={() => onSelectSubView('商品列表')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      subView === '商品列表' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    商品列表
                  </button>
                </div>
              )}
            </div>

            {/* 标签管理 ▾ */}
            <div>
              <button
                onClick={() => toggleSection('tags')}
                className="w-full px-3.5 py-1.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <span>标签管理</span>
                {openSections['tags'] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {openSections['tags'] && (
                <div className="pl-5 space-y-0.5 mt-0.5">
                  <button
                    onClick={() => onSelectSubView('访客标签')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      subView === '访客标签' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    访客标签
                  </button>
                  <button
                    onClick={() => onSelectSubView('会话标签')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      subView === '会话标签' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    会话标签
                  </button>
                </div>
              )}
            </div>

            {/* 话术库 */}
            <div className="pt-0.5">
              <button
                onClick={() => onSelectSubView('话术库')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  subView === '话术库'
                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                }`}
              >
                话术库
              </button>
            </div>

            {/* 素材库 */}
            <div>
              <button
                onClick={() => onSelectSubView('素材库')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  subView === '素材库'
                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                }`}
              >
                素材库
              </button>
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="space-y-1">
            <button
              onClick={() => onSelectSubView('通用知识问答')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '通用知识问答' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              通用知识问答
            </button>
            <button
              onClick={() => onSelectSubView('热门定制提问')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '热门定制提问' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              热门定制提问
            </button>
          </div>
        );

      case 'marketing':
        return (
          <div className="space-y-1">
            <button
              onClick={() => onSelectSubView('视频剪辑')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '视频剪辑' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              视频剪辑
            </button>
            <button
              onClick={() => onSelectSubView('图文内容生成')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '图文内容生成' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              图文内容生成
            </button>
            <button
              onClick={() => onSelectSubView('内容审核')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '内容审核' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              内容审核
            </button>
            <button
              onClick={() => onSelectSubView('发布计划')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '发布计划' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              发布计划
            </button>
          </div>
        );

      case 'knowledge_base':
        return (
          <div className="space-y-1">
            <button
              onClick={() => onSelectSubView('知识库内容编辑')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '知识库内容编辑' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              知识库内容编辑
            </button>
            <button
              onClick={() => onSelectSubView('知识库分类管理')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '知识库分类管理' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              知识库分类管理
            </button>
            <button
              onClick={() => onSelectSubView('知识库版本')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '知识库版本' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              知识库版本
            </button>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-1">
            <button
              onClick={() => onSelectSubView('销售智能体统计')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '销售智能体统计' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              销售智能体统计
            </button>
            <button
              onClick={() => onSelectSubView('推广智能体统计')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '推广智能体统计' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              推广智能体统计
            </button>
          </div>
        );

      case 'employee':
        return (
          <div className="space-y-1">
            <button
              onClick={() => onSelectSubView('员工列表')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '员工列表' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              员工列表
            </button>
            <button
              onClick={() => onSelectSubView('角色配置')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '角色配置' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              角色配置
            </button>
          </div>
        );

      case 'sys_config':
        return (
          <div className="space-y-1">
            <button
              onClick={() => onSelectSubView('智能体基础配置')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '智能体基础配置' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              智能体基础配置
            </button>
          </div>
        );

      case 'audit_logs':
        return (
          <div className="space-y-1">
            <button
              onClick={() => onSelectSubView('操作日志')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '操作日志' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              操作日志
            </button>
            <button
              onClick={() => onSelectSubView('问答记录')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '问答记录' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              问答记录
            </button>
            <button
              onClick={() => onSelectSubView('生成记录')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs cursor-pointer ${
                subView === '生成记录' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              生成记录
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-52 bg-[#f7f9fc] border-r border-slate-200/80 flex flex-col h-full shrink-0 select-none rounded-tl-2xl">
      {/* Header Bar matching Screenshot: "客户" + Panel icon */}
      <div className="h-12 px-4 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 text-base">{getModuleTitle()}</h2>
        <button
          onClick={onToggleCollapse}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          title="收起"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Sub-menu Content */}
      <div className="flex-1 overflow-y-auto px-2.5 py-1">
        {renderTreeMenu()}
      </div>
    </div>
  );
};
