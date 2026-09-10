import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Smartphone,
  Laptop,
  Film,
  Music,
  Mic,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { VideoClipItem, VideoShot } from '../../../data/videoClipData';

interface VideoPlayerMockupProps {
  video: VideoClipItem;
  deviceMode: 'phone' | 'wide';
  onToggleDeviceMode: () => void;
  activeTab?: 'player' | 'storyboard';
  onChangeTab?: (tab: 'player' | 'storyboard') => void;
}

export const VideoPlayerMockup: React.FC<VideoPlayerMockupProps> = ({
  video,
  deviceMode,
  onToggleDeviceMode,
  activeTab = 'player',
  onChangeTab
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const playTimerRef = useRef<number | null>(null);

  const totalDuration = video.durationSeconds || 15;

  // Find active shot
  const activeShotIndex = video.shots.findIndex((s) => {
    return currentTimeSec >= s.startSec && currentTimeSec <= s.endSec;
  });
  const currentShot: VideoShot = video.shots[activeShotIndex >= 0 ? activeShotIndex : 0];

  // Playback timer ticker
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDuration - 0.2) {
            return 0; // loop playback
          }
          return prev + 0.2;
        });
      }, 200);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, totalDuration]);

  // Jump to specific shot
  const handleJumpToShot = (shot: VideoShot) => {
    setCurrentTimeSec(shot.startSec);
    setIsPlaying(true);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentTimeSec / totalDuration) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-900/95 text-white overflow-hidden select-none">
      {/* Top Player Status Bar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold text-slate-200 truncate max-w-[180px]">
            {video.title}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
            video.status === '剪辑中'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
              : video.status === '已同步到剪映'
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
              : video.status === '发布审核中'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : video.status === '审核不通过'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              : video.status === '计划发布'
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              : video.status === '已发布'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
          }`}>
            {video.status}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30 hidden sm:inline">
            {video.resolution}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onChangeTab && (
            <div className="bg-white/10 p-0.5 rounded-lg flex text-[11px]">
              <button
                type="button"
                onClick={() => onChangeTab('player')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'player' ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                实时播放器
              </button>
              <button
                type="button"
                onClick={() => onChangeTab('storyboard')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'storyboard' ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                分镜故事板 ({video.shots.length})
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleDeviceMode}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            title="切换 9:16 竖屏 / 16:9 横屏"
          >
            {deviceMode === 'phone' ? (
              <>
                <Laptop className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">横屏模式</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">竖屏模式</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 overflow-y-auto custom-scrollbar">
        {activeTab === 'player' ? (
          <div
            className={`relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/15 transition-all duration-300 flex flex-col justify-between ${
              deviceMode === 'phone'
                ? 'w-[310px] h-[540px] max-h-[80vh] shrink-0'
                : 'w-full max-w-[620px] aspect-video max-h-[75vh] shrink-0'
            }`}
          >
            {/* Background Visual Clip Stage (Simulated high-res active shot) */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={currentShot?.previewImage || video.coverImage}
                alt={currentShot?.shotType || 'video frame'}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isPlaying ? 'scale-108 filter contrast-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />
            </div>

            {/* Top Shot Indicator Overlay */}
            <div className="relative z-10 p-4 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/90 text-white font-bold text-[10px] shadow-sm flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-spin" />
                    <span>分镜 0{currentShot?.order || 1} / 0{video.shots.length}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium border border-white/10">
                    {currentShot?.shotType}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 drop-shadow-sm font-mono flex items-center gap-1">
                  <span>运镜:</span>
                  <span className="text-white font-medium">{currentShot?.cameraMotion}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full text-[10px] border border-white/10">
                <Music className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate max-w-[80px] text-slate-200">
                  {video.bgmTrack.title.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Center Play/Pause Trigger Area */}
            <div
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-10 flex-1 flex items-center justify-center cursor-pointer"
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-xs transform hover:scale-110 transition-all border border-white/20">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              )}
            </div>

            {/* Bottom Subtitle & Voiceover Overlay */}
            <div className="relative z-10 p-4 space-y-3">
              {/* Dynamic Captions / Subtitle Pill */}
              <div className="text-center space-y-1">
                <div className="inline-block px-3 py-1.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-xl">
                  <p className="text-xs font-bold text-amber-300 tracking-wide animate-pulse">
                    {currentShot?.subtitles || video.hookText}
                  </p>
                </div>
                <p className="text-[11px] text-slate-200 leading-snug drop-shadow-md line-clamp-2 px-2">
                  “{currentShot?.voiceoverScript || video.summary}”
                </p>
              </div>

              {/* Player Scrubber & Controls */}
              <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 space-y-2">
                {/* Progress bar */}
                <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-rose-500 rounded-full transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Bottom Control buttons */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1 text-slate-200 hover:text-white transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTimeSec(0);
                        setIsPlaying(true);
                      }}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="重头播放"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[10px] text-slate-300">
                      {formatTime(currentTimeSec)} / {formatTime(totalDuration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                      {video.aspectRatio}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Storyboard Detail View */
          <div className="w-full max-w-2xl space-y-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>全部分镜拆解与运镜指令故事板</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                总镜头: {video.shots.length} 个 · 时长: {video.durationText}
              </span>
            </div>

            <div className="space-y-3">
              {video.shots.map((shot, idx) => {
                const isActive = activeShotIndex === idx;
                return (
                  <div
                    key={shot.id}
                    onClick={() => handleJumpToShot(shot)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-950/40 border-rose-500/80 ring-2 ring-rose-500/20'
                        : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/10">
                        <img
                          src={shot.previewImage}
                          alt={shot.shotType}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white">
                          {shot.timeRange}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                              分镜 0{shot.order}
                            </span>
                            <span className="font-bold text-xs text-slate-200">{shot.shotType}</span>
                            <span className="text-[10px] text-slate-400">· {shot.transition}</span>
                          </div>
                          {isActive && (
                            <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                              <Activity className="w-3 h-3 animate-spin" /> 当前播放中
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-1">
                          <span className="text-slate-400">运镜:</span> {shot.cameraMotion}
                        </p>
                        <p className="text-[11px] text-amber-200/90 font-medium line-clamp-1">
                          <span className="text-slate-400">口播:</span> {shot.voiceoverScript}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Storyboard Shot Rail Below Player */}
      {activeTab === 'player' && (
        <div className="px-4 py-3 bg-slate-950/90 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="flex items-center gap-1 font-bold text-slate-300">
              <Film className="w-3.5 h-3.5 text-rose-400" />
              <span>分镜时间轴点位（点击精准跳转镜头）</span>
            </span>
            <span className="font-mono text-slate-400">
              {currentShot ? `${currentShot.timeRange} (${currentShot.shotType})` : ''}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {video.shots.map((shot, idx) => {
              const isActive = activeShotIndex === idx;
              return (
                <button
                  key={shot.id}
                  type="button"
                  onClick={() => handleJumpToShot(shot)}
                  className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-rose-900/40 border-rose-500 text-white ring-1 ring-rose-500'
                      : 'bg-white/5 border-white/10 hover:border-white/25 text-slate-300'
                  }`}
                >
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                    <img
                      src={shot.previewImage}
                      alt={shot.shotType}
                      className="w-full h-full object-cover"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-rose-600/40 flex items-center justify-center">
                        <Play className="w-3 h-3 fill-white text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold truncate">0{shot.order}. {shot.shotType}</div>
                    <div className="text-[9px] font-mono text-slate-400">{shot.timeRange}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
