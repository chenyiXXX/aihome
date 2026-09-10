import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Play,
  Copy,
  Trash2,
  Film,
  Smartphone,
  Laptop,
  Music,
  Mic,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Clock
} from 'lucide-react';
import { VideoClipItem, VideoClipStatus } from '../../../data/videoClipData';

interface VideoClipListProps {
  videos: VideoClipItem[];
  onSelectVideo: (video: VideoClipItem) => void;
  onCreateNew: () => void;
  onDeleteVideo: (id: string) => void;
  onRestoreVideo?: (id: string) => void;
  onPreviewVideo: (video: VideoClipItem) => void;
}

export const VideoClipList: React.FC<VideoClipListProps> = ({
  videos,
  onSelectVideo,
  onCreateNew,
  onDeleteVideo,
  onRestoreVideo,
  onPreviewVideo
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [aspectFilter, setAspectFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Statistics across the statuses
  const stats = useMemo(() => {
    const activeTotal = videos.filter((v) => v.status !== '回收站').length;
    const editing = videos.filter((v) => v.status === '剪辑中').length;
    const syncedToJianying = videos.filter((v) => v.status === '已同步到剪映').length;
    const reviewing = videos.filter((v) => v.status === '发布审核中').length;
    const rejected = videos.filter((v) => v.status === '审核不通过').length;
    const scheduled = videos.filter((v) => v.status === '计划发布').length;
    const published = videos.filter((v) => v.status === '已发布').length;
    const trash = videos.filter((v) => v.status === '回收站').length;
    return { activeTotal, editing, syncedToJianying, reviewing, rejected, scheduled, published, trash };
  }, [videos]);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return videos.filter((item) => {
      // Status filter
      if (statusFilter === 'all') {
        if (item.status === '回收站') return false;
      } else if (item.status !== statusFilter) {
        return false;
      }
      // Aspect ratio filter
      if (aspectFilter !== 'all' && item.aspectRatio !== aspectFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchTopic = item.topic.toLowerCase().includes(q);
        const matchHook = item.hookText.toLowerCase().includes(q);
        const matchProducts = item.linkedProducts.some((p) => p.toLowerCase().includes(q));
        const matchCase = item.linkedCase.name.toLowerCase().includes(q);
        if (!matchTitle && !matchTopic && !matchHook && !matchProducts && !matchCase) {
          return false;
        }
      }
      return true;
    });
  }, [videos, statusFilter, aspectFilter, searchQuery]);

  const handleCopyScript = (video: VideoClipItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const scriptText = `【视频工程】${video.title}\n【黄金钩子】${video.hookText}\n【BGM音轨】${video.bgmTrack.title}\n【AI配音】${video.voiceover.speakerName}\n\n【分镜拆解】\n${video.shots.map((s) => `分镜 ${s.order} (${s.timeRange}) [${s.shotType}]\n画面运镜: ${s.cameraMotion}\n口播旁白: ${s.voiceoverScript}\n字幕花字: ${s.subtitles}\n转场音效: ${s.transition} / ${s.soundFx}`).join('\n\n')}`;
    navigator.clipboard.writeText(scriptText);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, title: string, status: VideoClipStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === '回收站') {
      if (window.confirm(`确定要彻底删除视频工程《${title}》吗？此操作无法撤销。`)) {
        onDeleteVideo(id);
      }
    } else {
      if (window.confirm(`确定要将视频工程《${title}》移入回收站吗？`)) {
        onDeleteVideo(id);
      }
    }
  };

  const handleRestore = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRestoreVideo) {
      onRestoreVideo(id);
    }
  };

  const getStatusBadgeStyle = (status: VideoClipStatus) => {
    switch (status) {
      case '剪辑中':
        return {
          pill: 'bg-sky-500/90 text-white',
          border: 'border-sky-300/40',
          dot: 'bg-sky-200'
        };
      case '已同步到剪映':
        return {
          pill: 'bg-teal-600/90 text-white',
          border: 'border-teal-300/40',
          dot: 'bg-teal-200'
        };
      case '发布审核中':
        return {
          pill: 'bg-amber-500/90 text-white',
          border: 'border-amber-300/40',
          dot: 'bg-amber-200'
        };
      case '审核不通过':
        return {
          pill: 'bg-rose-500/90 text-white',
          border: 'border-rose-300/40',
          dot: 'bg-rose-200'
        };
      case '计划发布':
        return {
          pill: 'bg-indigo-500/90 text-white',
          border: 'border-indigo-300/40',
          dot: 'bg-indigo-200'
        };
      case '已发布':
        return {
          pill: 'bg-emerald-500/90 text-white',
          border: 'border-emerald-300/40',
          dot: 'bg-emerald-200'
        };
      case '回收站':
        return {
          pill: 'bg-slate-600/90 text-white',
          border: 'border-slate-400/40',
          dot: 'bg-slate-300'
        };
      default:
        return {
          pill: 'bg-slate-700/90 text-white',
          border: 'border-slate-500/40',
          dot: 'bg-slate-300'
        };
    }
  };

  // Status Tabs ordered exactly as requested
  const statusTabs = [
    { id: 'all', label: '全部工程', count: stats.activeTotal },
    { id: '剪辑中', label: '剪辑中', count: stats.editing },
    { id: '已同步到剪映', label: '已同步到剪映', count: stats.syncedToJianying },
    { id: '发布审核中', label: '发布审核中', count: stats.reviewing },
    { id: '审核不通过', label: '审核不通过', count: stats.rejected },
    { id: '计划发布', label: '计划发布', count: stats.scheduled },
    { id: '已发布', label: '已发布', count: stats.published },
    { id: '回收站', label: '回收站', count: stats.trash }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar p-5 lg:p-7">
      <div className="max-w-[1600px] w-full mx-auto space-y-5">
        {/* ===================================================================== */}
        {/* 1. Header: Simplified Title & Action Button                           */}
        {/* ===================================================================== */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">视频剪辑</h1>
            <span className="text-xs text-slate-400 font-medium">（共 {stats.activeTotal} 个工程）</span>
          </div>

          <button
            type="button"
            onClick={onCreateNew}
            className="h-9 px-4 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建视频</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* 2. Search & Filters Bar (Consistent with GraphicTextList)             */}
        {/* ===================================================================== */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-[#0F4A47] text-white shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Ratio Filter */}
          <div className="flex items-center gap-2.5">
            {/* Aspect Ratio select */}
            <select
              value={aspectFilter}
              onChange={(e) => setAspectFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0F4A47] cursor-pointer"
            >
              <option value="all">全画幅比例</option>
              <option value="9:16">9:16 竖屏 (Reels/Shorts)</option>
              <option value="16:9">16:9 横屏 (宣传大片)</option>
            </select>

            {/* Keyword Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索工程名称、钩子文案、产品或案例..."
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F4A47]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. Video Cards Grid Area                                              */}
        {/* ===================================================================== */}
        {filteredVideos.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200/80">
            <Film className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">
              {statusFilter === '回收站'
                ? '回收站暂无视频工程'
                : '未找到符合筛选条件的视频工程'}
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              {statusFilter === '回收站'
                ? '被删除的视频工程将暂时归档于回收站，可随时还原'
                : '可以尝试更换筛选标签或新建视频工程'}
            </p>
            {statusFilter !== '回收站' && (
              <button
                type="button"
                onClick={onCreateNew}
                className="px-4 py-2 bg-[#EA3A20] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#c42810] cursor-pointer"
              >
                + 新建视频
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredVideos.map((video) => {
              const badgeStyle = getStatusBadgeStyle(video.status);
              const isTrash = video.status === '回收站';
              const isRejected = video.status === '审核不通过';

              return (
                <div
                  key={video.id}
                  onClick={() => !isTrash && onSelectVideo(video)}
                  className={`group bg-white rounded-3xl border overflow-hidden shadow-sm transition-all flex flex-col ${
                    isTrash
                      ? 'border-slate-200/60 opacity-80 cursor-default'
                      : 'border-slate-200/80 hover:shadow-md hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  {/* Video Thumbnail & Header Bar */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
                    <img
                      src={video.coverImage}
                      alt={video.title}
                      className={`w-full h-full object-cover transition-transform duration-500 opacity-85 ${
                        !isTrash && 'group-hover:scale-105'
                      } ${isTrash && 'grayscale-40'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Aspect & Duration Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
                        {video.aspectRatio === '9:16' ? (
                          <Smartphone className="w-3 h-3 text-rose-400" />
                        ) : (
                          <Laptop className="w-3 h-3 text-blue-400" />
                        )}
                        <span>{video.aspectRatio}</span>
                      </span>
                      <span className="px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono border border-white/10">
                        {video.durationText}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-bold">
                        {video.resolution}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 shadow-sm border ${badgeStyle.pill} ${badgeStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                        {video.status}
                      </span>
                    </div>

                    {/* Center Play Button Overlay */}
                    {!isTrash && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewVideo(video);
                        }}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#EA3A20] group-hover:text-white transition-all cursor-pointer"
                        title="快速全屏预览视频"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                    )}

                    {/* Bottom Hook Text */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[11px] text-slate-200 line-clamp-1 italic">
                        {video.hookText}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{video.publishPlatform}</span>
                        <span>{video.shots.length} 个分镜镜头</span>
                      </div>
                      <h3 className={`font-bold text-sm text-slate-900 line-clamp-2 leading-snug transition-colors ${
                        !isTrash && 'group-hover:text-[#EA3A20]'
                      }`}>
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {video.summary}
                      </p>

                      {/* Scheduled publish indicator */}
                      {video.status === '计划发布' && video.scheduledPublishTime && (
                        <div className="mt-2 px-2.5 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-1.5 text-[11px] text-indigo-700">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="font-medium truncate">计划发布：{video.scheduledPublishTime}</span>
                        </div>
                      )}

                      {/* Reject Reason Notice Box */}
                      {isRejected && video.auditRejectReason && (
                        <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-100/90 text-rose-700 text-[11px] leading-relaxed flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-bold">审核意见：</span>
                            <span className="text-rose-600 line-clamp-2">{video.auditRejectReason}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BGM & Voiceover Info Pills */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded-md border border-slate-200/60 flex items-center gap-1 font-medium">
                        <Music className="w-3 h-3 text-indigo-500" />
                        <span className="truncate max-w-[130px]">{video.bgmTrack.title.split(' ')[0]}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded-md border border-slate-200/60 flex items-center gap-1 font-medium">
                        <Mic className="w-3 h-3 text-rose-500" />
                        <span className="truncate max-w-[120px]">{video.voiceover.speakerName.split(' ')[0]}</span>
                      </span>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleCopyScript(video, e)}
                          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="复制分镜脚本与技术规范"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {isTrash ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handleRestore(video.id, e)}
                              className="text-emerald-600 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                              title="还原至剪辑中"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>还原</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(video.id, video.title, video.status, e)}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              title="彻底删除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(video.id, video.title, video.status, e)}
                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="移入回收站"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {copiedId === video.id && (
                          <span className="text-[10px] text-emerald-600 font-bold">已复制脚本</span>
                        )}
                      </div>

                      {isTrash ? (
                        <span className="text-[11px] text-slate-400 italic">已归档回收站</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectVideo(video)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-[#EA3A20] text-slate-700 group-hover:text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>进入 AI 剪辑</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
