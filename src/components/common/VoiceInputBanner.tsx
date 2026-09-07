import React from 'react';
import { Mic, MicOff, Check, X, Globe, Radio } from 'lucide-react';

interface VoiceInputBannerProps {
  isListening: boolean;
  transcript: string;
  interimTranscript?: string;
  audioLevel: number;
  lang: string;
  onToggleLang: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  errorMsg?: string | null;
}

export const VoiceInputBanner: React.FC<VoiceInputBannerProps> = ({
  isListening,
  transcript,
  interimTranscript,
  audioLevel,
  lang,
  onToggleLang,
  onConfirm,
  onCancel,
  errorMsg
}) => {
  if (!isListening) return null;

  // Normalized heights for audio waveform bars
  const bars = [
    Math.max(4, Math.min(24, Math.round(audioLevel * 0.4))),
    Math.max(6, Math.min(28, Math.round(audioLevel * 0.8))),
    Math.max(8, Math.min(32, Math.round(audioLevel * 1.0))),
    Math.max(6, Math.min(26, Math.round(audioLevel * 0.7))),
    Math.max(4, Math.min(20, Math.round(audioLevel * 0.5)))
  ];

  return (
    <div className="p-3 bg-gradient-to-r from-red-50/90 via-amber-50/70 to-orange-50/80 border border-red-200/80 rounded-2xl shadow-xs space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>

          <span className="text-xs font-bold text-red-900 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>正在进行语音识别... 请对着麦克风说话</span>
          </span>

          {/* Language Switch */}
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 border border-red-200 text-red-700 hover:bg-red-100/70 cursor-pointer transition-colors"
            title="切换识别语言"
          >
            <Globe className="w-2.5 h-2.5" />
            <span>{lang === 'zh-CN' ? '中文 (普通话)' : 'English (外贸英语)'}</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onConfirm}
            className="px-2.5 py-1 bg-[#EA3A20] hover:bg-[#c42810] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="完成并填入输入框"
          >
            <Check className="w-3 h-3" />
            <span>完成转写</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-2 py-1 bg-white/80 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-medium flex items-center gap-0.5 cursor-pointer transition-colors"
            title="取消本次语音"
          >
            <X className="w-3 h-3" />
            <span>取消</span>
          </button>
        </div>
      </div>

      {/* Voice Wave Visualizer & Real-time Transcript */}
      <div className="flex items-center gap-3 bg-white/90 p-2.5 rounded-xl border border-red-100 min-h-[44px]">
        {/* Equalizer Bars */}
        <div className="flex items-center gap-1 h-7 px-1 shrink-0">
          {bars.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-[#EA3A20] rounded-full transition-all duration-75"
              style={{ height: `${height}px` }}
            />
          ))}
        </div>

        {/* Live Text Area */}
        <div className="flex-1 min-w-0 text-xs font-medium text-slate-800 leading-relaxed">
          {transcript || interimTranscript ? (
            <span>
              {transcript}
              <span className="text-slate-400 italic">{interimTranscript}</span>
            </span>
          ) : (
            <span className="text-slate-400 italic">
              正在收音中... 支持输入外贸定制专业术语、报价要求或业务问题
            </span>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="text-[10px] text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">
          {errorMsg}
        </div>
      )}
    </div>
  );
};
