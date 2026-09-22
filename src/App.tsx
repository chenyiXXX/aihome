import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ModuleType } from './types';
import { PrimarySidebar } from './components/layout/PrimarySidebar';
import { TopHeader } from './components/layout/TopHeader';
import { TabItem } from './components/layout/MultiTabBar';
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
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { LoginPage } from './components/auth/LoginPage';
import { initialNotifications } from './data/mockNotifications';
import { NotificationItem, NotificationCategory } from './types';
import {
  getPathByModuleAndSubView,
  parseRoute
} from './routes/routeConfig';
import {
  MOCK_ROLE_ACCOUNTS,
  UserRoleProfile,
  getAllowedModulesForRole,
  isModuleAllowedForRole
} from './config/rolePermissions';

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

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Current route resolved from browser URL
  const currentRoute = parseRoute(location.pathname);
  const activeModule = currentRoute.moduleId;
  const subView = currentRoute.subView;

  // Authentication State (Enterprise WeChat Scan Login)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserRoleProfile>(MOCK_ROLE_ACCOUNTS[0]);

  const [isScriptDrawerOpen, setIsScriptDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const handleMarkAllNotificationsAsRead = (category?: NotificationCategory) => {
    setNotifications((prev) =>
      prev.map((item) =>
        !category || category === 'all' || item.category === category
          ? { ...item, isRead: true }
          : item
      )
    );
  };

  const handleClearReadNotifications = () => {
    setNotifications((prev) => prev.filter((item) => !item.isRead));
  };

  const handleNavigateFromNotification = (path: string, _item: NotificationItem) => {
    setIsNotificationDrawerOpen(false);
    navigate(path);
  };

  // Active composite tab key
  const activeTabKey = `${activeModule}__${subView}`;

  // Multi-tab windows list: synced with browser navigation
  const [openTabs, setOpenTabs] = useState<TabItem[]>([
    {
      id: `${currentRoute.moduleId}__${currentRoute.subView}`,
      moduleId: currentRoute.moduleId,
      moduleTitle: currentRoute.moduleTitle,
      subView: currentRoute.subView,
      title: currentRoute.pageTitle,
      closable: true
    }
  ]);

  // Whenever URL changes or role changes, ensure permissions and sync openTabs
  useEffect(() => {
    const route = parseRoute(location.pathname);
    const allowed = getAllowedModulesForRole(currentUser.role);

    // If attempting to visit a module not allowed for this role, redirect to first allowed module
    if (route.moduleId && !allowed.includes(route.moduleId)) {
      const defaultModule = allowed[0] || 'home';
      const defaultPath = getPathByModuleAndSubView(defaultModule);
      navigate(defaultPath, { replace: true });
      return;
    }

    const tabKey = `${route.moduleId}__${route.subView}`;

    setOpenTabs((prev) => {
      const exists = prev.some((tab) => tab.id === tabKey);
      if (exists) {
        return prev;
      }
      return [
        ...prev,
        {
          id: tabKey,
          moduleId: route.moduleId,
          moduleTitle: route.moduleTitle,
          subView: route.subView,
          title: route.pageTitle,
          closable: true
        }
      ];
    });
  }, [location.pathname, currentUser.role, navigate]);

  // When switching user role directly from header or login
  const handleSwitchRole = (roleProfile: UserRoleProfile) => {
    setCurrentUser(roleProfile);
    const allowed = getAllowedModulesForRole(roleProfile.role);

    // Filter open tabs to keep only allowed modules
    setOpenTabs((prev) => {
      const filtered = prev.filter((tab) => allowed.includes(tab.moduleId));
      if (filtered.length === 0) {
        const defaultModule = allowed[0] || 'home';
        const defaultPath = getPathByModuleAndSubView(defaultModule);
        const routeDef = parseRoute(defaultPath);
        return [
          {
            id: `${routeDef.moduleId}__${routeDef.subView}`,
            moduleId: routeDef.moduleId,
            moduleTitle: routeDef.moduleTitle,
            subView: routeDef.subView,
            title: routeDef.pageTitle,
            closable: true
          }
        ];
      }
      return filtered;
    });

    // Check if current route is allowed
    const route = parseRoute(location.pathname);
    if (!allowed.includes(route.moduleId)) {
      const defaultModule = allowed[0] || 'home';
      const defaultPath = getPathByModuleAndSubView(defaultModule);
      navigate(defaultPath, { replace: true });
    }
  };

  // When selecting a module/subview from sidebar
  const handleSelectModule = (mod: ModuleType, targetSubView?: string) => {
    const targetPath = getPathByModuleAndSubView(mod, targetSubView);
    navigate(targetPath);
  };

  // When switching subview within page or sidebar
  const handleSelectSubView = (newSubView: string) => {
    const route = parseRoute(location.pathname);
    const targetPath = getPathByModuleAndSubView(route.moduleId, newSubView);
    navigate(targetPath);
  };

  // Clicking an open tab in the MultiTabBar
  const handleSelectTab = (tab: TabItem) => {
    const targetPath = getPathByModuleAndSubView(tab.moduleId, tab.subView);
    navigate(targetPath);
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
        const targetPath = getPathByModuleAndSubView(nextTab.moduleId, nextTab.subView);
        navigate(targetPath);
      }
    }
  };

  // If user is logged out, render Enterprise WeChat QR scan login page
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          if (user) {
            handleSwitchRole({
              name: user.name,
              role: user.role,
              avatar: user.avatar,
              department: user.department || '智能数字化中心'
            });
            const allowed = getAllowedModulesForRole(user.role);
            const defaultModule = allowed[0] || 'home';
            const defaultPath = getPathByModuleAndSubView(defaultModule);
            setIsAuthenticated(true);
            navigate(defaultPath);
          } else {
            setIsAuthenticated(true);
            navigate('/home');
          }
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#F8F9FA] text-slate-800 overflow-hidden font-sans antialiased select-none">
      
      {/* 1. Left Docked Sidebar */}
      <PrimarySidebar
        activeModule={activeModule}
        subView={subView}
        onSelectModule={handleSelectModule}
        onSelectSubView={handleSelectSubView}
        unreadInquiriesCount={2}
        currentUserRole={currentUser.role}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-[#F8F9FA]">
        
        {/* Top Header Bar with Integrated Multi-Tab Windows */}
        <TopHeader
          tabs={openTabs}
          activeTabKey={activeTabKey}
          onSelectTab={handleSelectTab}
          onCloseTab={handleCloseTab}
          unreadCount={unreadNotificationsCount}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          currentUser={currentUser}
          onLogout={() => setIsAuthenticated(false)}
          onSwitchRole={handleSwitchRole}
          onNewAction={() => {
            if (activeModule === 'in_sales') {
              setIsScriptDrawerOpen(true);
            }
          }}
        />

        {/* Dynamic Module Workspace via React Router */}
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col pt-1">
          <Routes>
            {/* Root redirect (系统默认打开知识问答模块) */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* 1. 知识问答 */}
            <Route path="/home" element={<HomeModule />} />

            {/* 2. 售前询盘助手 */}
            <Route
              path="/pre-sales"
              element={<PreSalesModule inquiries={initialInquiries} subView="售前询盘列表" />}
            />

            {/* 3. 销售助手 */}
            <Route
              path="/in-sales"
              element={
                <InSalesModule
                  sessions={initialSessions}
                  chatMessages={mockChatMessages}
                  scripts={initialScripts}
                  subView="会话列表"
                  onOpenAddScriptDrawer={() => setIsScriptDrawerOpen(true)}
                />
              }
            />

            {/* 4. 运营助手 */}
            <Route path="/marketing" element={<Navigate to="/marketing/video" replace />} />
            <Route
              path="/marketing/video"
              element={
                <MarketingModule
                  videoClips={initialVideoClips}
                  posts={initialPosts}
                  subView="视频剪辑"
                />
              }
            />
            <Route
              path="/marketing/article"
              element={
                <MarketingModule
                  videoClips={initialVideoClips}
                  posts={initialPosts}
                  subView="图文生成"
                />
              }
            />
            <Route
              path="/marketing/audit"
              element={
                <MarketingModule
                  videoClips={initialVideoClips}
                  posts={initialPosts}
                  subView="发布审核"
                />
              }
            />
            <Route
              path="/marketing/schedule"
              element={
                <MarketingModule
                  videoClips={initialVideoClips}
                  posts={initialPosts}
                  subView="发布计划"
                />
              }
            />
            <Route
              path="/marketing/materials"
              element={
                <MarketingModule
                  videoClips={initialVideoClips}
                  posts={initialPosts}
                  subView="素材库"
                />
              }
            />
            <Route
              path="/marketing/accounts"
              element={
                <MarketingModule
                  videoClips={initialVideoClips}
                  posts={initialPosts}
                  subView="账号管理"
                />
              }
            />

            {/* 5. 知识库管理 */}
            <Route path="/knowledge" element={<Navigate to="/knowledge/upload" replace />} />
            <Route
              path="/knowledge/upload"
              element={
                <KnowledgeModule
                  articles={initialKBArticles}
                  categories={initialKBCategories}
                  tags={initialKBTags}
                  versions={initialKBVersions}
                  subView="内容上传"
                />
              }
            />
            <Route
              path="/knowledge/review"
              element={
                <KnowledgeModule
                  articles={initialKBArticles}
                  categories={initialKBCategories}
                  tags={initialKBTags}
                  versions={initialKBVersions}
                  subView="知识复核"
                />
              }
            />
            <Route
              path="/knowledge/categories"
              element={
                <KnowledgeModule
                  articles={initialKBArticles}
                  categories={initialKBCategories}
                  tags={initialKBTags}
                  versions={initialKBVersions}
                  subView="分类管理"
                />
              }
            />
            <Route
              path="/knowledge/tags"
              element={
                <KnowledgeModule
                  articles={initialKBArticles}
                  categories={initialKBCategories}
                  tags={initialKBTags}
                  versions={initialKBVersions}
                  subView="标签管理"
                />
              }
            />

            {/* 6. 面价汇率 */}
            <Route path="/pricing" element={<Navigate to="/pricing/list" replace />} />
            <Route
              path="/pricing/list"
              element={
                <PricingMaintenanceModule
                  subView="面价"
                  onSelectSubView={handleSelectSubView}
                />
              }
            />
            <Route
              path="/pricing/exchange-rates"
              element={
                <PricingMaintenanceModule
                  subView="汇率"
                  onSelectSubView={handleSelectSubView}
                />
              }
            />

            {/* 7. 数据统计 */}
            <Route path="/analytics" element={<Navigate to="/analytics/agent" replace />} />
            <Route
              path="/analytics/agent"
              element={
                <AnalyticsModule
                  statsData={initialAgentStats}
                  subView="智能体统计"
                />
              }
            />
            <Route
              path="/analytics/user"
              element={
                <AnalyticsModule
                  statsData={initialAgentStats}
                  subView="用户使用系统统计"
                />
              }
            />
            <Route path="/analytics/sales" element={<Navigate to="/analytics/agent" replace />} />
            <Route path="/analytics/marketing" element={<Navigate to="/analytics/agent" replace />} />
            <Route path="/analytics/training" element={<Navigate to="/analytics/user" replace />} />
            <Route path="/analytics/qa" element={<Navigate to="/analytics/user" replace />} />

            {/* 8. 员工权限 */}
            <Route path="/employee" element={<Navigate to="/employee/list" replace />} />
            <Route
              path="/employee/list"
              element={
                <StaffModule
                  employees={initialEmployees}
                  roles={initialRoles}
                  subView="员工列表"
                  onSelectSubView={handleSelectSubView}
                />
              }
            />
            <Route
              path="/employee/roles"
              element={
                <StaffModule
                  employees={initialEmployees}
                  roles={initialRoles}
                  subView="角色管理"
                  onSelectSubView={handleSelectSubView}
                />
              }
            />

            {/* 9. 智能体基础设置 */}
            <Route path="/system" element={<Navigate to="/system/agent" replace />} />
            <Route
              path="/system/agent"
              element={
                <SystemConfigModule
                  config={initialSystemConfig}
                  subView="Agent 配置"
                  onSelectSubView={handleSelectSubView}
                />
              }
            />
            <Route
              path="/system/skill"
              element={
                <SystemConfigModule
                  config={initialSystemConfig}
                  subView="Skill 配置"
                  onSelectSubView={handleSelectSubView}
                />
              }
            />

            {/* 10. 日志与审计 */}
            <Route path="/audit" element={<AuditLogsModule />} />
            <Route path="/audit/*" element={<AuditLogsModule />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>

      </div>

      {/* Global Slide-Over Drawer for Adding Scripts / Config */}
      <DrawerContainer
        isOpen={isScriptDrawerOpen}
        onClose={() => setIsScriptDrawerOpen(false)}
        title="新增常用沟通话术"
      />

      {/* Global Slide-Over Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onClearRead={handleClearReadNotifications}
        onNavigateToAction={handleNavigateFromNotification}
      />

    </div>
  );
}

export default App;
