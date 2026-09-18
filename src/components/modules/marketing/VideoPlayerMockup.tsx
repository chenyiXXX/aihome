import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Laptop,
  Music
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
  onToggleDeviceMode
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const playTimerRef = useRef<number | null>(null);

  const totalDuration = video.durationSeconds || 15;

  // Find active shot
  const activeShotIndex = video.shots.findIndex((s) => {
    return currentTimeSec >= s.startSec && currentTimeSec < s.endSec;
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
          return Number((prev + 0.2).toFixed(1));
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTimeSec(Number((ratio * totalDuration).toFixed(1)));
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentTimeSec / totalDuration) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden select-none">
      {/* Video Display Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
        <div
          className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 flex flex-col justify-between ${
            deviceMode === 'phone'
              ? 'w-[280px] h-[480px] max-h-[68vh] shrink-0'
              : 'w-full max-w-[540px] aspect-video max-h-[68vh] shrink-0'
          }`}
        >
          {/* Background Visual Clip */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentShot?.previewImage || video.coverImage}
              alt={currentShot?.shotType || 'video frame'}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* Minimal Top Badges */}
          <div className="relative z-10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] border border-white/10 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>分镜 0{currentShot?.order || 1} / 0{video.shots.length}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">{currentShot?.shotType}</span>
            </div>

            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-[10px] border border-white/10 text-slate-300">
              <Music className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate max-w-[70px]">{video.bgmTrack.title.split(' ')[0]}</span>
            </div>
          </div>

          {/* Center Play Button Overlay */}
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-10 flex-1 flex items-center justify-center cursor-pointer group"
          >
            {!isPlaying && (
              <div className="w-13 h-13 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 transition-transform group-hover:scale-110">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            )}
          </div>

          {/* Bottom Subtitle */}
          <div className="relative z-10 px-4 pb-3 text-center pointer-events-none">
            <p className="text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
              {currentShot?.subtitles || video.hookText}
            </p>
          </div>
        </div>
      </div>

      {/* Simplified Playback Control Bar */}
      <div className="px-5 py-3 bg-slate-900/90 border-t border-white/10 shrink-0 space-y-2.5">
        {/* Scrubber Progress Bar */}
        <div
          onClick={handleSeek}
          className="relative w-full h-1.5 bg-white/20 hover:h-2 rounded-full overflow-hidden cursor-pointer transition-all"
          title="点击跳转播放进度"
        >
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#EA3A20] rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls & Time */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTimeSec(0);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="重头播放"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 ml-1">
              {formatTime(currentTimeSec)} / {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? '取消静音' : '静音'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={onToggleDeviceMode}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={deviceMode === 'phone' ? '切换横屏 (16:9)' : '切换竖屏 (9:16)'}
            >
              {deviceMode === 'phone' ? (
                <Laptop className="w-3.5 h-3.5" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
              )}
            </button>
          </div>
        </div>

        {/* Shot Segment Navigator (Compact & Minimal) */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-white/5">
          {video.shots.map((shot, idx) => {
            const isActive = activeShotIndex === idx;
            return (
              <button
                key={shot.id}
                type="button"
                onClick={() => handleJumpToShot(shot)}
                className={`py-1.5 px-2 rounded-lg text-left transition-all cursor-pointer truncate ${
                  isActive
                    ? 'bg-white/15 text-white font-bold border border-white/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-transparent'
                }`}
                title={`镜头 0${shot.order}: ${shot.shotType} (${shot.timeRange})`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className={isActive ? 'text-[#EA3A20]' : ''}>镜头 0{shot.order}</span>
                  <span className="font-mono text-[9px] opacity-70">{shot.timeRange.split(' - ')[0]}</span>
                </div>
                <div className="text-[10px] truncate opacity-90">{shot.shotType}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
