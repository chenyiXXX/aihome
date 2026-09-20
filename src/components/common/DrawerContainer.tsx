import React, { useState } from 'react';
import { X, Paperclip, Image, Video, Music, FileText, HelpCircle, Trash2 } from 'lucide-react';
import { DrawerConfig, ScriptItem } from '../../types';

interface DrawerContainerProps {
  drawerState?: DrawerConfig;
  isOpen?: boolean;
  title?: string;
  type?: string;
  onClose: () => void;
  onSaveScript?: (script: Partial<ScriptItem>) => void;
}

export const DrawerContainer: React.FC<DrawerContainerProps> = ({
  drawerState,
  isOpen,
  title: customTitle,
  type = 'add_script',
  onClose,
  onSaveScript
}) => {
  const isVisible = drawerState ? drawerState.isOpen : Boolean(isOpen);
  if (!isVisible) return null;

  const drawerTitle = drawerState?.title || customTitle || '添加话术';
  const drawerType = drawerState?.type || type;

  // Form State for "添加话术" matching User Screenshot 1!
  const [belongsTo, setBelongsTo] = useState('公共话术库');
  const [category, setCategory] = useState('材质与环保标准');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sendInOrder, setSendInOrder] = useState(false);

  const handleSubmitScript = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (onSaveScript) {
      onSaveScript({
        title,
        content,
        category,
        isPrivate: belongsTo === '私人话术库',
        tags: [category, '新增话术']
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Centered Modal Panel */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            {drawerTitle}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {drawerType === 'add_script' ? (
            <form id="drawer-script-form" onSubmit={handleSubmitScript} className="space-y-5">
              
              {/* 所属话术库 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>所属话术库
                </label>
                <select
                  value={belongsTo}
                  onChange={(e) => setBelongsTo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="公共话术库">公共话术库</option>
                  <option value="私人话术库">私人话术库</option>
                </select>
              </div>

              {/* 分类 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>分类
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="材质与环保标准">材质与环保标准 (FSC/E0/CARB)</option>
                  <option value="海运与CBM核算">海运与CBM核算 (ISTA 3A防潮包装)</option>
                  <option value="交期与付款条款">交期与付款条款 (FOB/CIF 30%T/T)</option>
                  <option value="常用问候与接单">常用问候与接单</option>
                  <option value="售后质保与索赔">售后质保与索赔</option>
                </select>
              </div>

              {/* 话术标题 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    <span className="text-red-500 mr-1">*</span>话术标题
                  </label>
                  <span className="text-[11px] text-slate-400">{title.length}/100</span>
                </div>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="请输入话术标题(内部可见，如：欧美E0级环保认证回复)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* 话术内容 Header + Checkbox */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <span className="text-red-500">*</span>话术内容
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendInOrder}
                      onChange={(e) => setSendInOrder(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span>按添加顺序依次发送</span>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                </div>

                {/* Textarea Box matching screenshot 1 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="p-3 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <span>支持格式化文本与多媒体富文本</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContent('')}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="清空"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    maxLength={5000}
                    placeholder="请输入话术详细回复内容，包含英文产品参数、认证证明或报价说明..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3.5 text-sm text-slate-800 focus:outline-none resize-none bg-transparent"
                    required
                  />

                  <div className="px-3.5 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-blue-600 font-medium">
                      <button type="button" className="flex items-center gap-1 hover:text-blue-700 cursor-pointer">
                        <FileText className="w-3.5 h-3.5" /> 添加文本
                      </button>
                      <button type="button" className="flex items-center gap-1 hover:text-blue-700 cursor-pointer">
                        <Image className="w-3.5 h-3.5" /> 添加图片
                      </button>
                      <button type="button" className="flex items-center gap-1 hover:text-blue-700 cursor-pointer">
                        <Video className="w-3.5 h-3.5" /> 添加视频
                      </button>
                      <button type="button" className="flex items-center gap-1 hover:text-blue-700 cursor-pointer">
                        <Paperclip className="w-3.5 h-3.5" /> 添加附件
                      </button>
                      <button type="button" className="flex items-center gap-1 hover:text-blue-700 cursor-pointer">
                        <Music className="w-3.5 h-3.5" /> 添加音频
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400">{content.length}/5000</span>
                  </div>
                </div>
              </div>

            </form>
          ) : (
            <div className="py-8 text-center text-slate-500">
              <p>其他类型配置表单已准备就绪。</p>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions matching screenshot 1 */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="submit"
            form="drawer-script-form"
            className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            确定
          </button>
        </div>

      </div>
    </div>
  );
};
