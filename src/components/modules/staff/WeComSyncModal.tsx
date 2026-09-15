import React, { useState } from 'react';
import {
  Building2,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  X,
  Server,
  Users,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';

interface WeComSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastSyncTime: string;
  deptCount: number;
  employeeCount: number;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const WeComSyncModal: React.FC<WeComSyncModalProps> = ({
  isOpen,
  onClose,
  lastSyncTime,
  deptCount,
  employeeCount,
  onTriggerSync,
  isSyncing
}) => {
  const [syncFreq, setSyncFreq] = useState<'2h' | '6h' | 'realtime'>('realtime');
  const [autoDeactivate, setAutoDeactivate] = useState(true);
  const [autoAssignDefaultRole, setAutoAssignDefaultRole] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">企业微信通讯录对接</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  连接正常
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs">
          
          {/* Status Box */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>组织架构部门</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{deptCount} <span className="text-xs font-normal text-slate-500">个部门</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>在职员工</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{employeeCount} <span className="text-xs font-normal text-slate-500">人</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>最近同步</span>
              </div>
              <div className="text-sm font-bold text-slate-800 font-mono mt-0.5">{lastSyncTime}</div>
            </div>
          </div>

          {/* Connection Details */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>授权凭证</span>
            </h4>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">企业 ID (CorpID):</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  wwd78a9c20f128e45
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">通讯录凭证 (Secret):</span>
                <span className="font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  ••••••••••••••••••••3kQ8
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">事件回调 Webhook:</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-mono text-[11px]">
                  https://api.homecraft-ai.com/wecom/events/v1
                </span>
              </div>
            </div>
          </div>

          {/* Sync Strategies */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>同步规则</span>
            </h4>
            
            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">自动同步策略</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    实时接收变更回调与定时核验
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setSyncFreq('realtime')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      syncFreq === 'realtime' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    实时回调
                  </button>
                  <button
                    onClick={() => setSyncFreq('2h')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      syncFreq === '2h' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    每2小时
                  </button>
                  <button
                    onClick={() => setSyncFreq('6h')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      syncFreq === '6h' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    每6小时
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-100 bg-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">离职员工自动停用权限</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    企微标记离职后立即停用账号与 AI 算力
                  </div>
                </div>
                <button
                  onClick={() => setAutoDeactivate(!autoDeactivate)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    autoDeactivate ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      autoDeactivate ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-100 bg-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">入职自动分配初始角色</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    新员工默认分配「销售业务员」与每日 1,500 算力
                  </div>
                </div>
                <button
                  onClick={() => setAutoAssignDefaultRole(!autoAssignDefaultRole)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    autoAssignDefaultRole ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      autoAssignDefaultRole ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <a
            href="https://work.weixin.qq.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 font-medium transition-colors"
          >
            <span>企业微信管理后台</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 cursor-pointer transition-colors"
            >
              关闭
            </button>
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? '正在同步...' : '立即同步'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
