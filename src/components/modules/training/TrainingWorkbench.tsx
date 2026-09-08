import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TrainingCourse, TrainingLesson } from '../../../data/trainingData';

interface TrainingWorkbenchProps {
  course: TrainingCourse;
  onAdvanceLesson: () => void;
  onAskMentorQuestion: (question: string) => void;
}

export const TrainingWorkbench: React.FC<TrainingWorkbenchProps> = ({
  course,
  onAdvanceLesson,
  onAskMentorQuestion
}) => {
  const [showOutline, setShowOutline] = useState(false);
  const [showKeyPoints, setShowKeyPoints] = useState(false);

  const currentLesson = course.lessons[course.currentLessonIndex] || course.lessons[0];
  const completedCount = course.lessons.filter((l) => l.status === 'completed').length;
  const progressPercent = Math.round((completedCount / course.lessons.length) * 100);
  const nextLesson = course.lessons[course.currentLessonIndex + 1];

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Top Banner: Mentor Role + Progress + Efficiency Metrics */}
      <div className="px-6 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        {/* Mentor & Course Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EA3A20] text-white flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                内部培训 · 岗位导师
              </span>
              <span className="text-xs font-bold text-slate-200">
                {course.mentorName} ({course.mentorTitle})
              </span>
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
              <span>{course.courseTitle}</span>
              <button
                type="button"
                onClick={() => setShowOutline(!showOutline)}
                className="text-[11px] text-slate-300 hover:text-white bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>课程大纲</span>
                {showOutline ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </h2>
          </div>
        </div>

        {/* Progress & Learning Metrics */}
        <div className="flex items-center gap-6 text-xs">
          {/* Progress Bar */}
          <div className="min-w-[150px] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300">培训进度</span>
              <span className="font-mono text-emerald-400 font-bold">
                {completedCount}/{course.lessons.length} 节 ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Efficiency Metric */}
          <div className="border-l border-white/10 pl-4 py-0.5 text-right">
            <div className="text-[10px] text-slate-400">学习效率指数</div>
            <div className="font-bold font-mono text-amber-300 flex items-center justify-end gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{course.efficiencyScore}分</span>
              <span className="text-[10px] text-slate-300 font-normal">({course.efficiencyGrade})</span>
            </div>
          </div>

          {/* Interaction Count */}
          <div className="border-l border-white/10 pl-4 py-0.5 text-right hidden lg:block">
            <div className="text-[10px] text-slate-400">问答互动次数</div>
            <div className="font-mono font-bold text-emerald-400 flex items-center justify-end gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{course.interactiveCount} 次答疑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Course Outline Drawer */}
      {showOutline && (
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
          {course.lessons.map((lesson, idx) => {
            const isCurr = idx === course.currentLessonIndex;
            const isDone = lesson.status === 'completed';

            return (
              <div
                key={lesson.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isCurr
                    ? 'bg-white border-[#EA3A20] shadow-xs ring-1 ring-[#EA3A20]/20'
                    : isDone
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-200/50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center gap-1.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurr ? (
                      <span className="w-4 h-4 rounded-full bg-[#EA3A20] text-white flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className={isCurr ? 'text-[#EA3A20]' : isDone ? 'text-emerald-800' : 'text-slate-500'}>
                      第 {idx + 1} 节
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{lesson.duration}</span>
                </div>
                <div className="font-medium text-slate-800 line-clamp-1">{lesson.title}</div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span
                    className={`font-bold ${
                      isDone
                        ? 'text-emerald-600'
                        : isCurr
                        ? 'text-amber-600 animate-pulse'
                        : 'text-slate-400'
                    }`}
                  >
                    {isDone ? '已掌握并通关' : isCurr ? '正在学习与答疑' : '待解锁'}
                  </span>
                  <span className="text-slate-400 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    <span>预计耗时 {lesson.duration}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Current Lesson Interactive Control Strip */}
      <div className="px-6 py-2.5 bg-amber-50/50 border-t border-amber-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="text-amber-900 font-bold">
            当前学习：第 {course.currentLessonIndex + 1} 节 · {currentLesson.title}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            请仔细研读讲义与实战要点，有疑问可随时向导师提问。学完后点击确认推进。
          </span>
        </div>

        {/* Action Buttons: Key Points & Next Lesson */}
        <div className="flex items-center gap-2">
          {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
            <button
              type="button"
              onClick={() => setShowKeyPoints(!showKeyPoints)}
              className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>本节要点速览</span>
              {showKeyPoints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {nextLesson ? (
            <button
              type="button"
              onClick={onAdvanceLesson}
              className="px-3.5 py-1.5 bg-[#EA3A20] text-white rounded-xl font-bold hover:bg-[#d0321a] cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>确认已掌握，进入下一节</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>全部课程已圆满学成</span>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Key Takeaways Panel */}
      {showKeyPoints && currentLesson.keyTakeaways && (
        <div className="px-6 py-3 bg-amber-50/90 border-t border-amber-200/60 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>第 {course.currentLessonIndex + 1} 节核心掌握要点：</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {currentLesson.keyTakeaways.map((point, idx) => (
              <li
                key={idx}
                className="bg-white/90 p-2.5 rounded-lg border border-amber-200 text-xs text-slate-800 flex items-start gap-2"
              >
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
