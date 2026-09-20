import React, { useState, useMemo } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Search,
  BookOpen,
  CheckSquare,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Trash2,
  Calendar,
  Share2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { NotificationItem, NotificationCategory } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: (category?: NotificationCategory) => void;
  onClearRead: () => void;
  onNavigateToAction: (path: string, item: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearRead,
  onNavigateToAction
}) => {
  const [activeTab, setActiveTab] = useState<NotificationCategory>('all');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Category counts
  const unreadCountTotal = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const unreadCountKB = useMemo(() => notifications.filter((n) => n.category === 'kb_expiry' && !n.isRead).length, [notifications]);
  const unreadCountApproval = useMemo(() => notifications.filter((n) => n.category === 'approval' && !n.isRead).length, [notifications]);
  const unreadCountPub = useMemo(() => notifications.filter((n) => n.category === 'marketing_pub' && !n.isRead).length, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      if (activeTab !== 'all' && item.category !== activeTab) {
        return false;
      }
      // Unread only filter
      if (onlyUnread && item.isRead) {
        return false;
      }
      // Search keyword filter
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(kw);
        const inContent = item.content.toLowerCase().includes(kw);
        const inDoc = item.meta?.docName?.toLowerCase().includes(kw) || false;
        const inContentTitle = item.meta?.contentTitle?.toLowerCase().includes(kw) || false;
        const inApplicant = item.meta?.applicant?.toLowerCase().includes(kw) || false;
        if (!inTitle && !inContent && !inDoc && !inContentTitle && !inApplicant) {
          return false;
        }
      }
      return true;
    });
  }, [notifications, activeTab, onlyUnread, searchKeyword]);

  if (!isOpen) return null;

  const tabsConfig = [
    {
      key: 'all' as NotificationCategory,
      label: '全部',
      unreadCount: unreadCountTotal,
      icon: Bell
    },
    {
      key: 'kb_expiry' as NotificationCategory,
      label: '知识库有效期提醒',
      unreadCount: unreadCountKB,
      icon: BookOpen
    },
    {
      key: 'approval' as NotificationCategory,
      label: '审批类提醒',
      unreadCount: unreadCountApproval,
      icon: CheckSquare
    },
    {
      key: 'marketing_pub' as NotificationCategory,
      label: '运营内容发布情况通知',
      unreadCount: unreadCountPub,
      icon: Send
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[580px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EA3A20]/10 text-[#EA3A20] flex items-center justify-center font-bold shadow-2xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">消息通知面板</h2>
                {unreadCountTotal > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EA3A20] text-white shadow-2xs">
                    {unreadCountTotal} 条未读
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                实时接收知识库临期预警、流程审批与运营全渠道发布状态
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onMarkAllAsRead(activeTab === 'all' ? undefined : activeTab)}
              disabled={unreadCountTotal === 0}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              title="一键将当前所有通知标记为已读"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>全部已读</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Category Filter) */}
        <div className="px-6 pt-3 pb-0 border-b border-slate-200/80 bg-white shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative pb-3 px-2 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border-b-2 ${
                    isActive
                      ? 'border-[#EA3A20] text-[#EA3A20]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#EA3A20]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.unreadCount > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold leading-none ${
                        isActive
                          ? 'bg-[#EA3A20] text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Secondary Filter Bar */}
        <div className="px-6 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索消息内容、文档名称、申请人..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#EA3A20] focus:border-[#EA3A20]"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setOnlyUnread(!onlyUnread)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                onlyUnread
                  ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${onlyUnread ? 'bg-rose-500' : 'bg-slate-300'}`} />
              <span>仅看未读</span>
            </button>

            <button
              type="button"
              onClick={onClearRead}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="清理已读消息"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">暂无相关消息通知</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                {onlyUnread ? '所有待办与消息均已全部处理完毕' : '当前分类下暂无最新动态'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isKb = item.category === 'kb_expiry';
              const isApproval = item.category === 'approval';
              const isPub = item.category === 'marketing_pub';

              return (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && onMarkAsRead(item.id)}
                  className={`p-4 rounded-2xl border transition-all relative group cursor-pointer ${
                    !item.isRead
                      ? 'bg-white border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-slate-300'
                      : 'bg-slate-50/60 border-slate-200/50 hover:bg-slate-50 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!item.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#EA3A20] ring-4 ring-[#EA3A20]/20" />
                  )}

                  {/* Header info */}
                  <div className="flex items-start gap-3">
                    {/* Category Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isKb
                          ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                          : isApproval
                          ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                      }`}
                    >
                      {isKb && <BookOpen className="w-4.5 h-4.5" />}
                      {isApproval && <CheckSquare className="w-4.5 h-4.5" />}
                      {isPub && <Send className="w-4.5 h-4.5" />}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#EA3A20] transition-colors">
                          {item.title}
                        </span>

                        {/* Priority Badge */}
                        {item.priority === 'urgent' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            紧急
                          </span>
                        )}
                        {item.priority === 'high' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            高优
                          </span>
                        )}

                        {/* Special Meta Badges */}
                        {isKb && item.meta?.remainingDays !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              item.meta.remainingDays <= 5
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.meta.remainingDays === 0 ? '今日到期' : `仅剩 ${item.meta.remainingDays} 天`}
                          </span>
                        )}

                        {isApproval && item.meta?.approvalStatus && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              item.meta.approvalStatus === 'pending'
                                ? 'bg-blue-100 text-blue-800'
                                : item.meta.approvalStatus === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.meta.approvalStatus === 'pending' ? '待审核' : item.meta.approvalStatus === 'approved' ? '已批准' : '已驳回'}
                          </span>
                        )}

                        {isPub && item.meta?.publishStatus && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              item.meta.publishStatus === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.meta.publishStatus === 'scheduled'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.meta.publishStatus === 'success' ? '发布成功' : item.meta.publishStatus === 'scheduled' ? '定时就绪' : '推送失败'}
                          </span>
                        )}
                      </div>

                      {/* Content Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.content}
                      </p>

                      {/* Meta Pills (Platforms / Expiry dates / Views) */}
                      {isPub && item.meta?.publishPlatforms && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[11px] text-slate-400">推送渠道:</span>
                          {item.meta.publishPlatforms.map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700 font-medium"
                            >
                              {p}
                            </span>
                          ))}
                          {item.meta.viewsCount && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold ml-1 flex items-center gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" />
                              <span>{item.meta.viewsCount.toLocaleString()} 播放</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bottom Footer: Timestamp & Action Buttons */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{item.timestamp}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!item.isRead && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(item.id);
                              }}
                              className="text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                            >
                              标记已读
                            </button>
                          )}

                          {item.actionPath && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(item.id);
                                onNavigateToAction(item.actionPath!, item);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-[#EA3A20] text-white font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs text-[11px]"
                            >
                              <span>{item.actionText || '去查看'}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Bottom Footer */}
        <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>智能消息中心每 30 秒自动刷新同步最新提醒</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
          >
            关闭面板
          </button>
        </div>
      </div>
    </div>
  );
};
