import React, { useState } from 'react';
import { ModuleType } from './types';
import { PrimarySidebar } from './components/layout/PrimarySidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MultiTabBar, TabItem } from './components/layout/MultiTabBar';
import { HomeModule } from './components/modules/HomeModule';
import { PreSalesModule } from './components/modules/PreSalesModule';
import { InSalesModule } from './components/modules/InSalesModule';
import { MarketingModule } from './components/modules/MarketingModule';
import { KnowledgeModule } from './components/modules/KnowledgeModule';
import { PricingMaintenanceModule } from './components/modules/PricingMaintenanceModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { StaffModule } from './components/modules/StaffModule';
import { SystemConfigModule } from './components/modules/SystemConfigModule';
import { AuditLogsModule } from './components/modules/AuditLogsModule';
import { DrawerContainer } from './components/common/DrawerContainer';

import {
  initialInquiries,
  initialSessions,
  mockChatMessages,
  initialScripts,
  initialVideoClips,
  initialPosts,
  initialKBArticles,
  initialKBCategories,
  initialKBTags,
  initialKBVersions,
  initialAgentStats,
  initialEmployees,
  initialRoles,
  initialSystemConfig,
  initialOperationLogs
} from './data/mockData';

const getModuleTitleById = (mod: ModuleType): string => {
  switch (mod) {
    case 'home':
      return '首页';
    case 'pre_sales':
      return '售前客服';
    case 'in_sales':
      return '销售助手';
    case 'marketing':
      return '运营助手';
    case 'knowledge_base':
      return '知识库管理';
    case 'pricing_maintenance':
      return '产品价格维护';
    case 'analytics':
      return '数据统计';
    case 'employee':
      return '员工权限';
    case 'sys_config':
      return '系统配置';
    case 'audit_logs':
      return '日志与审计';
    default:
      return '售前客服';
  }
};

const getDefaultSubViewByModule = (mod: ModuleType): string => {
  switch (mod) {
    case 'home':
      return '通用知识问答';
    case 'pre_sales':
      return '售前询盘列表';
    case 'in_sales':
      return '会话列表';
    case 'marketing':
      return '视频剪辑';
    case 'knowledge_base':
      return '内容上传';
    case 'pricing_maintenance':
      return '单价库';
    case 'analytics':
      return '销售智能体统计';
    case 'employee':
      return '员工列表';
    case 'sys_config':
      return '智能体基础配置';
    case 'audit_logs':
      return '操作日志';
    default:
      return '售前询盘列表';
  }
};

export function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('pre_sales');
  const [subView, setSubView] = useState<string>('售前询盘列表');
  const [isScriptDrawerOpen, setIsScriptDrawerOpen] = useState(false);

  // Active composite tab key
  const activeTabKey = `${activeModule}__${subView}`;

  // Multi-tab windows list: allows simultaneous distinct subview tabs
  const [openTabs, setOpenTabs] = useState<TabItem[]>([
    {
      id: 'pre_sales__售前询盘列表',
      moduleId: 'pre_sales',
      moduleTitle: '售前客服',
      subView: '售前询盘列表',
      title: '售前客服',
      closable: true
    }
  ]);

  // When selecting a module/subview from sidebar
  const handleSelectModule = (mod: ModuleType, targetSubView?: string) => {
    const finalSubView = targetSubView || getDefaultSubViewByModule(mod);
    const tabKey = `${mod}__${finalSubView}`;

    setActiveModule(mod);
    setSubView(finalSubView);

    setOpenTabs((prev) => {
      const exists = prev.some((tab) => tab.id === tabKey);
      if (exists) {
        return prev;
      }
      return [
        ...prev,
        {
          id: tabKey,
          moduleId: mod,
          moduleTitle: getModuleTitleById(mod),
          subView: finalSubView,
          title: finalSubView,
          closable: true
        }
      ];
    });
  };

  // When switching subview within page or sidebar
  const handleSelectSubView = (newSubView: string) => {
    const tabKey = `${activeModule}__${newSubView}`;

    setSubView(newSubView);

    setOpenTabs((prev) => {
      const exists = prev.some((tab) => tab.id === tabKey);
      if (exists) {
        return prev;
      }
      return [
        ...prev,
        {
          id: tabKey,
          moduleId: activeModule,
          moduleTitle: getModuleTitleById(activeModule),
          subView: newSubView,
          title: newSubView,
          closable: true
        }
      ];
    });
  };

  // Clicking an open tab in the MultiTabBar
  const handleSelectTab = (tab: TabItem) => {
    setActiveModule(tab.moduleId);
    setSubView(tab.subView);
  };

  // Closing a tab
  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openTabs.length <= 1) return; // Keep at least one tab

    const closingIndex = openTabs.findIndex((t) => t.id === tabId);
    const remainingTabs = openTabs.filter((t) => t.id !== tabId);

    setOpenTabs(remainingTabs);

    // If active tab was closed, switch to adjacent tab
    if (activeTabKey === tabId) {
      const nextTab =
        remainingTabs[Math.max(0, closingIndex - 1)] || remainingTabs[0];
      if (nextTab) {
        setActiveModule(nextTab.moduleId);
        setSubView(nextTab.subView);
      }
    }
  };

  const getModuleTitle = () => {
    return getModuleTitleById(activeModule);
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'home':
        return <HomeModule />;
      case 'pre_sales':
        return <PreSalesModule inquiries={initialInquiries} subView={subView} />;
      case 'in_sales':
        return (
          <InSalesModule
            sessions={initialSessions}
            chatMessages={mockChatMessages}
            scripts={initialScripts}
            subView={subView}
            onOpenAddScriptDrawer={() => setIsScriptDrawerOpen(true)}
          />
        );
      case 'marketing':
        return (
          <MarketingModule
            videoClips={initialVideoClips}
            posts={initialPosts}
            subView={subView}
          />
        );
      case 'knowledge_base':
        return (
          <KnowledgeModule
            articles={initialKBArticles}
            categories={initialKBCategories}
            tags={initialKBTags}
            versions={initialKBVersions}
            subView={subView}
          />
        );
      case 'pricing_maintenance':
        return (
          <PricingMaintenanceModule
            subView={subView}
            onSelectSubView={handleSelectSubView}
          />
        );
      case 'analytics':
        return <AnalyticsModule statsData={initialAgentStats} subView={subView} />;
      case 'employee':
        return <StaffModule employees={initialEmployees} roles={initialRoles} subView={subView} />;
      case 'sys_config':
        return <SystemConfigModule config={initialSystemConfig} subView={subView} />;
      case 'audit_logs':
        return <AuditLogsModule logs={initialOperationLogs as any} subView={subView} />;
      default:
        return <PreSalesModule inquiries={initialInquiries} subView={subView} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8F9FA] text-slate-800 overflow-hidden font-sans antialiased select-none">
      
      {/* 1. Left Docked Sidebar */}
      <PrimarySidebar
        activeModule={activeModule}
        subView={subView}
        onSelectModule={handleSelectModule}
        onSelectSubView={handleSelectSubView}
        unreadInquiriesCount={2}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8F9FA]">
        
        {/* Top Header Bar with Integrated Multi-Tab Windows */}
        <TopHeader
          tabs={openTabs}
          activeTabKey={activeTabKey}
          onSelectTab={handleSelectTab}
          onCloseTab={handleCloseTab}
          onNewAction={() => {
            if (activeModule === 'in_sales') {
              setIsScriptDrawerOpen(true);
            }
          }}
        />

        {/* Dynamic Module Workspace */}
        <main className="flex-1 overflow-hidden flex flex-col pt-1">
          {renderActiveModule()}
        </main>

      </div>

      {/* Global Slide-Over Drawer for Adding Scripts / Config */}
      <DrawerContainer
        isOpen={isScriptDrawerOpen}
        onClose={() => setIsScriptDrawerOpen(false)}
        title="新增常用沟通话术"
      />

    </div>
  );
}

export default App;
