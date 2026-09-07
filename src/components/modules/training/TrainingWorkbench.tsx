import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Send,
  Loader2,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TrainingCourse, TrainingLesson, QuizData } from '../../../data/trainingData';

interface TrainingWorkbenchProps {
  course: TrainingCourse;
  onAdvanceLesson: () => void;
  onSubmitQuiz: (lessonId: string, answer: string) => Promise<any>;
  onAskMentorQuestion: (question: string) => void;
  isGrading: boolean;
}

export const TrainingWorkbench: React.FC<TrainingWorkbenchProps> = ({
  course,
  onAdvanceLesson,
  onSubmitQuiz,
  onAskMentorQuestion,
  isGrading
}) => {
  const [showOutline, setShowOutline] = useState(false);
  const [activeQuizModal, setActiveQuizModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [lastGradeResult, setLastGradeResult] = useState<any>(null);

  const currentLesson = course.lessons[course.currentLessonIndex] || course.lessons[0];
  const completedCount = course.lessons.filter((l) => l.status === 'completed').length;
  const progressPercent = Math.round((completedCount / course.lessons.length) * 100);
  const nextLesson = course.lessons[course.currentLessonIndex + 1];

  const hasActiveQuiz = currentLesson && currentLesson.quiz;
  const isCurrentQuizPassed = currentLesson?.quiz?.passed;

  const handleOpenQuiz = () => {
    setActiveQuizModal(true);
    if (currentLesson?.quiz?.submittedAnswer) {
      if (currentLesson.quiz.type === 'choice') {
        setSelectedOption(currentLesson.quiz.submittedAnswer);
      } else {
        setTextAnswer(currentLesson.quiz.submittedAnswer);
      }
    }
  };

  const handleSubmitQuiz = async () => {
    const answer = currentLesson?.quiz?.type === 'choice' ? selectedOption : textAnswer;
    if (!answer.trim()) return;

    const result = await onSubmitQuiz(currentLesson.id, answer);
    if (result) {
      setLastGradeResult(result);
    }
  };

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

        {/* Progress & Efficiency KPIs */}
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

          {/* Interaction & Quiz Score */}
          <div className="border-l border-white/10 pl-4 py-0.5 text-right hidden lg:block">
            <div className="text-[10px] text-slate-400">互动 / 测验均分</div>
            <div className="font-mono font-bold text-slate-200">
              <span className="text-emerald-400">{course.interactiveCount}次互动</span>
              <span className="mx-1 text-slate-500">|</span>
              <span className="text-amber-300">{course.averageQuizScore}分</span>
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
            const isLock = lesson.status === 'locked';

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
                  {lesson.quiz && (
                    <span className="text-slate-500">
                      {lesson.quiz.passed ? `考分: ${lesson.quiz.score}分` : '含实战考题'}
                    </span>
                  )}
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
          <span className="text-slate-500 text-[11px]">
            请充分阅读导师资料，有疑问可直接向导师提问。学完后点击确认推进。
          </span>
        </div>

        {/* Action Buttons: Quiz & Next Lesson */}
        <div className="flex items-center gap-2">
          {hasActiveQuiz && (
            <button
              type="button"
              onClick={handleOpenQuiz}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs ${
                isCurrentQuizPassed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-600 text-white hover:bg-amber-700 ring-2 ring-amber-400/30'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>
                {isCurrentQuizPassed
                  ? `课后考核已通过 (${currentLesson.quiz?.score}分)`
                  : '进入本节考题测验'}
              </span>
            </button>
          )}

          {(!hasActiveQuiz || isCurrentQuizPassed) && nextLesson && (
            <button
              type="button"
              onClick={onAdvanceLesson}
              className="px-3.5 py-1.5 bg-[#EA3A20] text-white rounded-xl font-bold hover:bg-[#d0321a] cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>确认已掌握，进入下一节</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {progressPercent === 100 && (
            <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>全课程考核圆满结业</span>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal / Floating Drawer */}
      {activeQuizModal && currentLesson.quiz && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    第 {currentLesson.lessonNumber} 节课后实战考核
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    岗位导师：{course.mentorName} 阅卷评审
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuizModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Question & Input */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Question Text */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium leading-relaxed">
                <span className="font-bold text-amber-700 mr-1.5">[考核题目]</span>
                {currentLesson.quiz.question}
              </div>

              {/* Multiple Choice Options */}
              {currentLesson.quiz.type === 'choice' && currentLesson.quiz.options && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">请选择最符合外贸定制业务规范的选项：</div>
                  {currentLesson.quiz.options.map((opt) => (
                    <label
                      key={opt.key}
                      onClick={() => setSelectedOption(opt.key)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedOption === opt.key
                          ? 'bg-red-50/60 border-[#EA3A20] text-slate-900 shadow-2xs font-medium'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quiz-opt"
                        checked={selectedOption === opt.key}
                        onChange={() => setSelectedOption(opt.key)}
                        className="mt-0.5 text-[#EA3A20] focus:ring-[#EA3A20]"
                      />
                      <div className="flex-1">
                        <span className="font-bold mr-1">{opt.key}.</span>
                        <span>{opt.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Text Input for Open-ended scenarios */}
              {currentLesson.quiz.type === 'text' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">请写出你的作答策略与话术：</span>
                    <span className="text-[11px] text-slate-400">建议结合讲义核心知识点阐述</span>
                  </div>
                  <textarea
                    rows={4}
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="在此输入您的实战解答内容...（例如：首先共情客户预算要求，引用其他欧美买家案例，重点核算全生命周期成本...）"
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] resize-none"
                  />
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>考察要点：{currentLesson.quiz.standardKeyPoints.join('、')}</span>
                  </div>
                </div>
              )}

              {/* Grading Feedback Results if already submitted */}
              {currentLesson.quiz.mentorReview && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>导师阅卷结果：{currentLesson.quiz.grade}</span>
                    </span>
                    <span className="font-mono font-bold text-base text-amber-700">
                      {currentLesson.quiz.score} 分
                    </span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {currentLesson.quiz.mentorReview}
                  </p>
                  {currentLesson.quiz.passed && (
                    <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>考核达标！已准予进入下一章节。</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                满分 100 分，80 分及以上视为合格通过
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveQuizModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
                >
                  暂存稍后
                </button>
                <button
                  type="button"
                  disabled={
                    isGrading ||
                    (currentLesson.quiz.type === 'choice' ? !selectedOption : !textAnswer.trim())
                  }
                  onClick={handleSubmitQuiz}
                  className="px-4 py-1.5 bg-[#EA3A20] text-white rounded-xl text-xs font-bold hover:bg-[#d0321a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {isGrading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>导师智能评分中...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>提交导师阅卷打分</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
