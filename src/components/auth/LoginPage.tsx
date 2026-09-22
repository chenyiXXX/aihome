import React, { useState, useEffect } from 'react';
import {
  QrCode,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Smartphone,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MOCK_ROLE_ACCOUNTS, UserRoleProfile } from '../../config/rolePermissions';

interface LoginPageProps {
  onLoginSuccess: (userProfile?: { name: string; role: string; avatar: string; department?: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [scanStatus, setScanStatus] = useState<'waiting' | 'scanned' | 'success' | 'expired'>('waiting');
  const [countdown, setCountdown] = useState(60);
  const [selectedRole, setSelectedRole] = useState<UserRoleProfile>(MOCK_ROLE_ACCOUNTS[0]);

  const mockAccounts = MOCK_ROLE_ACCOUNTS;

  useEffect(() => {
    if (scanStatus !== 'waiting') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setScanStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [scanStatus]);

  const handleRefreshQr = () => {
    setScanStatus('waiting');
    setCountdown(60);
  };

  const handleSimulateScan = () => {
    if (scanStatus === 'waiting') {
      setScanStatus('scanned');
    }
  };

  const handleConfirmMobileLogin = () => {
    setScanStatus('success');
    setTimeout(() => {
      onLoginSuccess(selectedRole);
    }, 800);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      
      {/* LEFT: Full-Height Immersive Custom Home Architectural Showcase */}
      <div className="relative flex-1 lg:w-7/12 h-full bg-slate-900 overflow-hidden flex flex-col justify-between p-8 lg:p-12 text-white">
        
        {/* Background High-End Villa & Custom Cabinetry Visual with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Custom Kitchen & Living Architecture"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.42] contrast-[1.1] transition-transform duration-1000"
          />
          {/* Subtle Ambient Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/90" />
        </div>

        {/* Top Brand Info */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EA3A20] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#EA3A20]/30 tracking-tight">
              PA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">品爱智能家居</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/90 border border-white/15">
                  AI 外贸中枢
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium tracking-wider">PINAI CUSTOM HOME OS</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>智能多 Agent 引擎实时运行中</span>
          </div>
        </div>

        {/* Center Architectural Blueprint & Glass Card */}
        <div className="relative z-10 my-auto max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white/90 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#EA3A20]" />
            <span>2026 全球全屋定制数字化中枢</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
            极简全屋定制
            <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              全链路智能营销与协同中枢
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
            从海外多渠道获客、BOQ 自动极速算价到短视频与图文矩阵生成，为品爱全球定制供应链提供高效的智能化赋能。
          </p>

          {/* 3 Interactive Highlight Capsules */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md">
              <div className="text-base font-bold text-white font-mono">15,400+</div>
              <div className="text-[11px] text-slate-400 mt-0.5">五金与板材面价库</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md">
              <div className="text-base font-bold text-[#EA3A20] font-mono">0.3s</div>
              <div className="text-[11px] text-slate-400 mt-0.5">BOQ 极速算价响应</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md">
              <div className="text-base font-bold text-emerald-400 font-mono">24/7</div>
              <div className="text-[11px] text-slate-400 mt-0.5">多语种营销矩阵</div>
            </div>
          </div>
        </div>

        {/* Bottom Left Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10">
          <span>品爱智能全屋定制 · 国际工程与外贸事业部</span>
          <span className="font-mono text-[11px]">Ver 2026.9.18-PROD</span>
        </div>

      </div>

      {/* RIGHT: Full-Height Clean Enterprise WeChat Login Panel */}
      <div className="lg:w-5/12 h-full bg-white flex flex-col justify-between p-8 lg:p-12 shrink-0 border-l border-slate-200 shadow-2xl relative z-10 overflow-y-auto">
        
        {/* Top Header Placeholder / Security Badge */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>企业微信官方安全加密</span>
          </div>
        </div>

        {/* Center: Authentic Enterprise WeChat Scan Card */}
        <div className="my-auto w-full max-w-[340px] mx-auto flex flex-col items-center text-center">
          
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.8 8.6C18.6 4.9 15.2 2 11 2C6.6 2 3 5.4 3 9.6C3 11.9 4.1 13.9 5.8 15.3L5.1 17.8L7.8 16.5C8.8 16.9 9.9 17.2 11 17.2C11.3 17.2 11.6 17.2 11.9 17.1C12.1 18.5 13.1 19.6 14.5 20.3L16.6 21.3L16 19.4C17.4 18.3 18.3 16.7 18.3 14.8C18.3 13.5 17.8 12.3 17 11.3C18.1 10.7 18.8 9.7 18.8 8.6Z"
                fill="#1877F2"
              />
              <circle cx="8" cy="8" r="1.2" fill="#FFFFFF" />
              <circle cx="13" cy="8" r="1.2" fill="#FFFFFF" />
              <circle cx="14" cy="14" r="1" fill="#4CD964" />
              <circle cx="17" cy="14" r="1" fill="#FFCC00" />
              <circle cx="15.5" cy="16.5" r="1" fill="#FF3B30" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">企业微信扫码登录</h2>
          </div>

          {/* QR Code Frame */}
          <div className="relative w-[260px] h-[260px] bg-white rounded-3xl border-2 border-slate-100 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
            
            {/* Waiting State */}
            {scanStatus === 'waiting' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer Corner Finders */}
                  <path d="M5 5 h22 v22 h-22 z M9 9 v14 h14 v-14 z M12 12 h8 v8 h-8 z" />
                  <path d="M73 5 h22 v22 h-22 z M77 9 v14 h14 v-14 z M80 12 h8 v8 h-8 z" />
                  <path d="M5 73 h22 v22 h-22 z M9 77 v14 h14 v-14 z M12 80 h8 v8 h-8 z" />
                  <path d="M68 68 h18 v18 h-18 z M72 72 v10 h10 v-10 z" />

                  {/* QR Matrix */}
                  <rect x="32" y="6" width="4" height="4" />
                  <rect x="40" y="6" width="8" height="4" />
                  <rect x="52" y="6" width="4" height="4" />
                  <rect x="60" y="6" width="4" height="4" />
                  <rect x="32" y="14" width="8" height="4" />
                  <rect x="44" y="14" width="4" height="4" />
                  <rect x="56" y="14" width="8" height="4" />
                  <rect x="36" y="22" width="4" height="4" />
                  <rect x="48" y="22" width="8" height="4" />
                  <rect x="6" y="32" width="4" height="8" />
                  <rect x="14" y="32" width="8" height="4" />
                  <rect x="26" y="32" width="4" height="4" />
                  <rect x="34" y="32" width="8" height="8" />
                  <rect x="46" y="32" width="8" height="4" />
                  <rect x="58" y="32" width="4" height="8" />
                  <rect x="66" y="32" width="12" height="4" />
                  <rect x="82" y="32" width="12" height="4" />
                  <rect x="6" y="44" width="12" height="4" />
                  <rect x="22" y="44" width="4" height="4" />
                  <rect x="30" y="44" width="4" height="8" />
                  <rect x="38" y="44" width="12" height="4" />
                  <rect x="54" y="44" width="8" height="8" />
                  <rect x="66" y="44" width="4" height="4" />
                  <rect x="74" y="44" width="8" height="8" />
                  <rect x="86" y="44" width="8" height="4" />
                  <rect x="10" y="52" width="8" height="4" />
                  <rect x="22" y="52" width="4" height="8" />
                  <rect x="38" y="52" width="4" height="4" />
                  <rect x="46" y="52" width="4" height="4" />
                  <rect x="66" y="52" width="4" height="8" />
                  <rect x="86" y="52" width="8" height="8" />
                  <rect x="6" y="60" width="8" height="4" />
                  <rect x="18" y="60" width="4" height="8" />
                  <rect x="30" y="60" width="12" height="4" />
                  <rect x="46" y="60" width="8" height="8" />
                  <rect x="58" y="60" width="4" height="4" />
                  <rect x="32" y="74" width="8" height="4" />
                  <rect x="44" y="74" width="4" height="8" />
                  <rect x="52" y="74" width="8" height="4" />
                  <rect x="36" y="86" width="4" height="8" />
                  <rect x="44" y="86" width="12" height="4" />
                  <rect x="6" y="86" width="4" height="4" />
                </svg>

                {/* Gentle laser indicator */}
                <div className="absolute inset-x-3 top-3 h-0.5 bg-gradient-to-r from-transparent via-[#1877F2] to-transparent shadow-[0_0_8px_#1877F2] animate-bounce duration-1000" />
              </div>
            )}

            {/* Scanned State */}
            {scanStatus === 'scanned' && (
              <div className="flex flex-col items-center justify-center p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative">
                  <img
                    src={selectedRole.avatar}
                    alt={selectedRole.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedRole.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{selectedRole.department}</div>
                </div>
                <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  扫码成功，请在手机端确认
                </div>
              </div>
            )}

            {/* Success State */}
            {scanStatus === 'success' && (
              <div className="flex flex-col items-center justify-center p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">登录成功</div>
                  <div className="text-xs text-slate-500 mt-0.5">正在为您加载工作台...</div>
                </div>
              </div>
            )}

            {/* Expired State */}
            {scanStatus === 'expired' && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 space-y-3 text-center animate-in fade-in duration-200">
                <span className="text-xs text-slate-600 font-medium">二维码已过期</span>
                <button
                  type="button"
                  onClick={handleRefreshQr}
                  className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#1464cc] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>刷新二维码</span>
                </button>
              </div>
            )}

          </div>

          {/* Subtitle Caption */}
          <div className="mt-5">
            <p className="text-sm font-medium text-slate-600">
              {scanStatus === 'waiting' && '请使用企业微信扫描二维码登录'}
              {scanStatus === 'scanned' && '请在手机端点击【确认登录】'}
              {scanStatus === 'success' && '安全验证通过'}
              {scanStatus === 'expired' && '二维码已失效，请刷新'}
            </p>
            {scanStatus === 'waiting' && (
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                二维码有效倒计时: {countdown}s
              </span>
            )}
          </div>

          {/* Main Action Trigger */}
          <div className="w-full mt-6 space-y-3">
            {scanStatus === 'waiting' && (
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-3 rounded-2xl bg-[#1877F2] hover:bg-[#1464cc] text-white text-sm font-bold transition-all shadow-md shadow-[#1877F2]/20 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <QrCode className="w-4 h-4" />
                <span>模拟手机企业微信扫码</span>
              </button>
            )}

            {scanStatus === 'scanned' && (
              <button
                type="button"
                onClick={handleConfirmMobileLogin}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <UserCheck className="w-4 h-4" />
                <span>手机端确认登录</span>
              </button>
            )}

            {scanStatus === 'expired' && (
              <button
                type="button"
                onClick={handleRefreshQr}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>刷新二维码</span>
              </button>
            )}

            {/* Role Switcher */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 flex-wrap">
              {mockAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedRole(acc);
                    setScanStatus('scanned');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    selectedRole.name === acc.name
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {acc.name.split(' ')[0]} ({acc.role})
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Security Footer */}
        <div className="text-center text-xs text-slate-400">
          <span>品爱智能全屋定制 · 经企业微信开放平台安全鉴权</span>
        </div>

      </div>

    </div>
  );
};
