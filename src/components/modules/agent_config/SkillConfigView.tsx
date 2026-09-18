import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ShieldCheck,
  Mail,
  Ship,
  Mic,
  Coins,
  Calculator,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
  FileSpreadsheet,
  Radio,
  Tags,
  SearchCode,
  FileText,
  ShieldAlert,
  Clock,
  BookCheck,
  Bot,
  FolderOpen,
  FileCode,
  Trash2,
  ArrowLeft,
  Users,
  Edit3,
  Download,
  History,
  ArrowRight
} from 'lucide-react';
import { AgentSkill, AgentSkillParameter, ConfigChangeRecord } from '../../../types';
import { AgentBindModal } from './AgentBindModal';
import { getSkillChangeHistory, formatNow } from '../../../data/configHistoryData';
import { ConfigHistoryModal } from './ConfigHistoryModal';

interface SkillConfigViewProps {
  skills: AgentSkill[];
  onUpdateSkills?: (updatedSkills: AgentSkill[]) => void;
  onEditingChange?: (isEditing: boolean) => void;
}

const CATEGORIES = [
  '全部技能',
  '销售类核心Skill (9项)',
  '解析与数据',
  '通信与同步',
  '画像与枚举',
  '检索与RAG',
  '报价与计价',
  '文档与商业',
  '风控与合规',
  '生命周期',
  '知识协同',
  '计算与配载',
  '工程与图纸',
  '合规与质检',
  '商务与文案',
  '语音与多模态'
] as const;

export interface SkillConfigViewHandle {
  openCreateModal: () => void;
}

export const SkillConfigView = React.forwardRef<SkillConfigViewHandle, SkillConfigViewProps>(
  ({ skills: initialSkills, onUpdateSkills, onEditingChange }, ref) => {
    const [skillsList, setSkillsList] = useState<AgentSkill[]>(initialSkills);
    const [selectedCategory, setSelectedCategory] = useState<string>('全部技能');
    const [searchQuery, setSearchQuery] = useState('');

    React.useImperativeHandle(ref, () => ({
      openCreateModal: () => setIsCreateModalOpen(true)
    }));

  // Editing skill detail view state (Image 2)
  const [editingSkill, setEditingSkill] = useState<AgentSkill | null>(null);
  const [activeSkillTab, setActiveSkillTab] = useState<'overview' | 'files' | 'history'>('overview');
  const [selectedFileName, setSelectedFileName] = useState<string>('SKILL.md');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyTargetSkill, setHistoryTargetSkill] = useState<AgentSkill | null>(null);

  React.useEffect(() => {
    if (onEditingChange) {
      onEditingChange(!!editingSkill);
    }
  }, [editingSkill, onEditingChange]);

  // Create Skill Modal state (Image 1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'manual' | 'import' | null>(null);
  
  // Manual creation form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCode, setNewSkillCode] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<AgentSkill['category']>('计算与配载');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  const handleDeleteSkill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = skillsList.find((s) => s.id === id);
    if (target && !target.isCustom) {
      alert('系统内置 Skill 不允许删除！');
      return;
    }
    if (window.confirm('确定要删除该自定义 Skill 吗？')) {
      const updated = skillsList.filter((s) => s.id !== id);
      setSkillsList(updated);
      if (onUpdateSkills) onUpdateSkills(updated);
      if (editingSkill?.id === id) {
        setEditingSkill(null);
      }
    }
  };

  // Agent Binding Modal state
  const [bindingSkill, setBindingSkill] = useState<AgentSkill | null>(null);
  const [savedTip, setSavedTip] = useState(false);

  // Ensure every skill has files array
  const getSkillFiles = (skill: AgentSkill) => {
    if (skill.files && skill.files.length > 0) return skill.files;
    return [
      {
        name: 'SKILL.md',
        content: `# ${skill.name}\n\n${skill.description}\n\n## 触发唤起\n- 触发类型: ${skill.triggerType}\n- 触发关键词: ${skill.triggerKeywords.join(', ')}\n\n## 算力说明\n提供专业外贸定制家具智能服务，支持实时高并发推理与流式下发。`,
        isMain: true
      },
      {
        name: 'config.json',
        content: JSON.stringify(skill.parameters, null, 2),
        isMain: false
      },
      {
        name: 'handler.ts',
        content: `// ${skill.code} execution logic\nexport async function executeSkill(input: any) {\n  console.log('Running ${skill.code}', input);\n  return { status: 'success', data: input };\n}`,
        isMain: false
      }
    ];
  };

  // Toggle skill on/off
  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = skillsList.map((s) => {
      if (s.id === id) {
        const nextStatus = s.status === 'enabled' ? ('disabled' as const) : ('enabled' as const);
        const currentHist = getSkillChangeHistory(s);
        const newRecord: ConfigChangeRecord = {
          id: `HIST-SK-${Date.now()}`,
          targetId: s.id,
          targetType: 'skill',
          targetName: s.name,
          operatorName: 'Chen Yi (陈总)',
          operatorRole: '超级管理员',
          timestamp: formatNow(),
          changeType: 'status',
          changeSummary: nextStatus === 'enabled' ? '启用该技能组件' : '禁用该技能组件',
          diffDetails: [
            {
              field: '运行状态',
              before: s.status === 'enabled' ? '● 启用 (enabled)' : '○ 禁用 (disabled)',
              after: nextStatus === 'enabled' ? '● 启用 (enabled)' : '○ 禁用 (disabled)'
            }
          ]
        };
        const updatedItem = {
          ...s,
          status: nextStatus,
          changeHistory: [newRecord, ...currentHist]
        };
        if (editingSkill?.id === id) {
          setEditingSkill(updatedItem);
        }
        return updatedItem;
      }
      return s;
    });
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);
  };

  // Save changes to currently editing skill with audit diff recording
  const handleSaveEditingSkill = () => {
    if (!editingSkill) return;
    const original = skillsList.find((s) => s.id === editingSkill.id) || editingSkill;
    const diffs: Array<{ field: string; before: string; after: string }> = [];

    if (original.name !== editingSkill.name) {
      diffs.push({
        field: '技能名称',
        before: original.name,
        after: editingSkill.name
      });
    }

    if (original.description !== editingSkill.description) {
      diffs.push({
        field: '功能描述',
        before: (original.description || '').slice(0, 30) + '...',
        after: (editingSkill.description || '').slice(0, 30) + '...'
      });
    }

    if (original.triggerType !== editingSkill.triggerType) {
      diffs.push({
        field: '触发类型',
        before: original.triggerType,
        after: editingSkill.triggerType
      });
    }

    if (JSON.stringify(original.triggerKeywords) !== JSON.stringify(editingSkill.triggerKeywords)) {
      diffs.push({
        field: '唤起关键词',
        before: (original.triggerKeywords || []).join(', '),
        after: (editingSkill.triggerKeywords || []).join(', ')
      });
    }

    // Check files diff
    const oldFiles = original.files || [];
    const newFiles = editingSkill.files || [];
    const fileDiffList: Array<{ fileName: string; oldContent?: string; newContent?: string; changeType?: 'modified' | 'added' | 'deleted' }> = [];

    oldFiles.forEach((of) => {
      const nf = newFiles.find((f) => f.name === of.name);
      if (!nf) {
        fileDiffList.push({ fileName: of.name, oldContent: of.content, newContent: '', changeType: 'deleted' });
      } else if (nf.content !== of.content) {
        fileDiffList.push({ fileName: of.name, oldContent: of.content, newContent: nf.content, changeType: 'modified' });
      }
    });

    newFiles.forEach((nf) => {
      const of = oldFiles.find((f) => f.name === nf.name);
      if (!of) {
        fileDiffList.push({ fileName: nf.name, oldContent: '', newContent: nf.content, changeType: 'added' });
      }
    });

    if (fileDiffList.length > 0) {
      diffs.push({
        field: '文件源码',
        before: `包含 ${oldFiles.length} 个文件`,
        after: `修改了 ${fileDiffList.map((f) => f.fileName).join('、')}`
      });
    }

    // Check parameters diff
    if (JSON.stringify(original.parameters) !== JSON.stringify(editingSkill.parameters)) {
      diffs.push({
        field: '业务调用参数集',
        before: JSON.stringify(original.parameters || []).slice(0, 40) + '...',
        after: JSON.stringify(editingSkill.parameters || []).slice(0, 40) + '...'
      });
    }

    let currentHist = getSkillChangeHistory(editingSkill);
    if (diffs.length > 0) {
      const isFile = fileDiffList.length > 0 || diffs.some((d) => d.field.includes('文件') || d.field.includes('源码'));
      const isParam = diffs.some((d) => d.field.includes('参数'));
      const isTrigger = diffs.some((d) => d.field.includes('触发') || d.field.includes('关键词'));
      const newRecord: ConfigChangeRecord = {
        id: `HIST-SK-${Date.now()}`,
        targetId: editingSkill.id,
        targetType: 'skill',
        targetName: editingSkill.name,
        operatorName: 'Chen Yi (陈总)',
        operatorRole: '超级管理员',
        timestamp: formatNow(),
        changeType: isFile ? 'files' : isParam ? 'parameter' : isTrigger ? 'trigger' : 'general',
        changeSummary: isFile
          ? `更新代码文件 (${fileDiffList.map((f) => f.fileName).join('、')})`
          : `保存修改 Skill 配置 (${diffs.map((d) => d.field).join('、')})`,
        diffDetails: diffs,
        fileDiffs: fileDiffList.length > 0 ? fileDiffList : undefined,
        oldFilesSnapshot: oldFiles,
        newFilesSnapshot: newFiles
      };
      currentHist = [newRecord, ...currentHist];
    }

    const updatedSkillItem: AgentSkill = {
      ...editingSkill,
      changeHistory: currentHist
    };

    setEditingSkill(updatedSkillItem);
    const updated = skillsList.map((s) => (s.id === updatedSkillItem.id ? updatedSkillItem : s));
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);
    setSavedTip(true);
    setTimeout(() => setSavedTip(false), 2000);
  };

  const handleSaveAll = () => {
    if (onUpdateSkills) onUpdateSkills(skillsList);
    setSavedTip(true);
    setTimeout(() => setSavedTip(false), 2000);
  };

  const SALES_SKILL_CODES = [
    'drawing_boq_parser',
    'chat_stream_sync',
    'customer_tagging_enum',
    'hybrid_rag_search',
    'quotation_calculation',
    'commercial_document_gen',
    'compliance_regex_guardrail',
    'quote_lifecycle_tracker',
    'knowledge_review_publish'
  ];

  const filteredSkills = skillsList.filter((s) => {
    let matchCategory = true;
    if (selectedCategory === '全部技能') {
      matchCategory = true;
    } else if (selectedCategory === '销售类核心Skill (9项)') {
      matchCategory = SALES_SKILL_CODES.includes(s.code) || (s.associatedAgents && s.associatedAgents.length > 0);
    } else {
      matchCategory = s.category === selectedCategory;
    }

    const matchSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.triggerKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.associatedAgents && s.associatedAgents.some((ag) => ag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchCategory && matchSearch;
  });

  const totalSkills = skillsList.length;
  const enabledSkills = skillsList.filter((s) => s.status === 'enabled').length;
  const totalInvocations = skillsList.reduce((acc, s) => acc + s.invocationCount, 0);

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSpreadsheet':
        return FileSpreadsheet;
      case 'Radio':
        return Radio;
      case 'Tags':
        return Tags;
      case 'SearchCode':
        return SearchCode;
      case 'Calculator':
        return Calculator;
      case 'FileText':
        return FileText;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Clock':
        return Clock;
      case 'BookCheck':
        return BookCheck;
      case 'Coins':
        return Coins;
      case 'Layers':
        return Layers;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Mail':
        return Mail;
      case 'Ship':
        return Ship;
      case 'Mic':
        return Mic;
      default:
        return Wrench;
    }
  };

  // Handle Manual Skill Creation
  const handleCreateManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillCode.trim()) return;

    const newSkill: AgentSkill = {
      id: `skill-custom-${Date.now()}`,
      name: newSkillName.trim(),
      code: newSkillCode.trim().toLowerCase().replace(/\s+/g, '_'),
      category: newSkillCategory,
      description: newSkillDesc.trim() || '自定义外贸定制算力与业务扩展技能',
      version: 'v1.0.0',
      status: 'enabled',
      iconName: 'Wrench',
      triggerType: '自动语义唤起',
      triggerKeywords: ['自定义', newSkillName.trim()],
      inputSchemaSummary: '{ query: string, context: Record<string, any> }',
      outputSchemaSummary: '{ result: any, code: number }',
      invocationCount: 0,
      successRate: '100%',
      avgLatencyMs: 120,
      isCustom: true,
      files: [
        {
          name: 'SKILL.md',
          content: `# ${newSkillName.trim()}\n\n${newSkillDesc.trim() || '自定义技能文档'}\n\n## 算力描述\n按需调用。`,
          isMain: true
        },
        {
          name: 'handler.ts',
          content: `export function run() { return true; }`,
          isMain: false
        }
      ],
      parameters: [
        {
          name: '调用超时设定',
          key: 'timeout_ms',
          type: 'number',
          value: 3000,
          description: '毫秒级超时门限',
          unit: 'ms'
        }
      ]
    };

    const updated = [newSkill, ...skillsList];
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);

    setNewSkillName('');
    setNewSkillCode('');
    setNewSkillDesc('');
    setIsCreateModalOpen(false);
    setCreateMode(null);

    // Open detail view
    setEditingSkill(newSkill);
    setActiveSkillTab('files');
    setSelectedFileName('SKILL.md');
  };

  // Handle Local Import Simulation
  const handleSimulateImport = () => {
    const importedSkill: AgentSkill = {
      id: `skill-imported-${Date.now()}`,
      name: '本地导入外贸质检算力包',
      code: 'imported_quality_audit_skill',
      category: '合规与质检',
      description: '从本地 .skill 压缩包导入的高精度质检与合规比对算法组件',
      version: 'v2.1.0',
      status: 'enabled',
      iconName: 'ShieldAlert',
      triggerType: '自动语义唤起',
      triggerKeywords: ['质检', '合规', '本地包'],
      inputSchemaSummary: '{ auditTarget: string, standardCode: string }',
      outputSchemaSummary: '{ passed: boolean, score: number }',
      invocationCount: 42,
      successRate: '99.8%',
      avgLatencyMs: 140,
      isCustom: true,
      files: [
        {
          name: 'SKILL.md',
          content: `# 本地导入外贸质检算力包\n\n通过本地 .skill 压缩包成功导入的模块。\n\n## 导入说明\n包含完整的验证规则与本地合规检查清单。`,
          isMain: true
        },
        {
          name: 'validator.py',
          content: `def audit_quality(data):\n    # Local imported validation logic\n    return {"passed": True, "score": 98.5}`,
          isMain: false
        },
        {
          name: 'config.json',
          content: '{\n  "strictMode": true,\n  "tolerance": 0.01\n}',
          isMain: false
        }
      ],
      parameters: [
        {
          name: '严格质检模式',
          key: 'strict_mode',
          type: 'boolean',
          value: true,
          description: '是否开启全项零容忍质检'
        }
      ]
    };

    const updated = [importedSkill, ...skillsList];
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);

    setIsCreateModalOpen(false);
    setCreateMode(null);

    setEditingSkill(importedSkill);
    setActiveSkillTab('files');
    setSelectedFileName('SKILL.md');
  };

  const handleSaveAgentBinding = (updatedAssociatedAgents: string[]) => {
    if (!bindingSkill) return;
    const updated = skillsList.map((s) =>
      s.id === bindingSkill.id || s.code === bindingSkill.code
        ? { ...s, associatedAgents: updatedAssociatedAgents }
        : s
    );
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);
  };

  const handleExportSkillConfig = (skill: AgentSkill) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(skill, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${skill.code}_skill_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadFileContent = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadOldFile = (rec: ConfigChangeRecord, fileName?: string) => {
    if (rec.fileDiffs && rec.fileDiffs.length > 0) {
      const targetDiff = fileName ? rec.fileDiffs.find((f) => f.fileName === fileName) : rec.fileDiffs[0];
      if (targetDiff && targetDiff.oldContent !== undefined) {
        const name = targetDiff.fileName;
        const lastDot = name.lastIndexOf('.');
        const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
        const ext = lastDot !== -1 ? name.slice(lastDot) : '.txt';
        const cleanTime = rec.timestamp.replace(/[: -]/g, '');
        downloadFileContent(`${baseName}_旧版_${cleanTime}${ext}`, targetDiff.oldContent);
        return;
      }
    }
    if (rec.oldFilesSnapshot && rec.oldFilesSnapshot.length > 0) {
      const targetFile = fileName ? rec.oldFilesSnapshot.find((f) => f.name === fileName) : rec.oldFilesSnapshot[0];
      if (targetFile) {
        const name = targetFile.name;
        const lastDot = name.lastIndexOf('.');
        const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
        const ext = lastDot !== -1 ? name.slice(lastDot) : '.txt';
        const cleanTime = rec.timestamp.replace(/[: -]/g, '');
        downloadFileContent(`${baseName}_旧版_${cleanTime}${ext}`, targetFile.content);
        return;
      }
    }
    // Fallback
    const fallback = `// [修改前旧版本源码文件]\n// 技能: ${rec.targetName}\n// 操作人: ${rec.operatorName}\n// 修改时间: ${rec.timestamp}\n\nexport function handler() {\n  // 原始旧版逻辑代码\n}\n`;
    downloadFileContent(`${rec.targetName}_旧版源码_${rec.timestamp.replace(/[: -]/g, '')}.ts`, fallback);
  };

  const handleDownloadNewFile = (rec: ConfigChangeRecord, fileName?: string) => {
    if (rec.fileDiffs && rec.fileDiffs.length > 0) {
      const targetDiff = fileName ? rec.fileDiffs.find((f) => f.fileName === fileName) : rec.fileDiffs[0];
      if (targetDiff && targetDiff.newContent !== undefined) {
        const name = targetDiff.fileName;
        const lastDot = name.lastIndexOf('.');
        const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
        const ext = lastDot !== -1 ? name.slice(lastDot) : '.txt';
        const cleanTime = rec.timestamp.replace(/[: -]/g, '');
        downloadFileContent(`${baseName}_新版_${cleanTime}${ext}`, targetDiff.newContent);
        return;
      }
    }
    if (rec.newFilesSnapshot && rec.newFilesSnapshot.length > 0) {
      const targetFile = fileName ? rec.newFilesSnapshot.find((f) => f.name === fileName) : rec.newFilesSnapshot[0];
      if (targetFile) {
        const name = targetFile.name;
        const lastDot = name.lastIndexOf('.');
        const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
        const ext = lastDot !== -1 ? name.slice(lastDot) : '.txt';
        const cleanTime = rec.timestamp.replace(/[: -]/g, '');
        downloadFileContent(`${baseName}_新版_${cleanTime}${ext}`, targetFile.content);
        return;
      }
    }
    // Fallback
    const fallback = `// [修改后新版本源码文件]\n// 技能: ${rec.targetName}\n// 操作人: ${rec.operatorName}\n// 修改时间: ${rec.timestamp}\n\nexport function handler() {\n  // 优化后的新版逻辑代码\n}\n`;
    downloadFileContent(`${rec.targetName}_新版源码_${rec.timestamp.replace(/[: -]/g, '')}.ts`, fallback);
  };

  const handleDownloadComparisonBundle = (rec: ConfigChangeRecord) => {
    const comparisonData = {
      recordId: rec.id,
      skillName: rec.targetName,
      operator: rec.operatorName,
      timestamp: rec.timestamp,
      changeSummary: rec.changeSummary,
      fileDiffs: rec.fileDiffs || [],
      oldFilesSnapshot: rec.oldFilesSnapshot || [],
      newFilesSnapshot: rec.newFilesSnapshot || []
    };
    const jsonStr = JSON.stringify(comparisonData, null, 2);
    downloadFileContent(`${rec.targetName}_新旧源码对比包_${rec.timestamp.replace(/[: -]/g, '')}.json`, jsonStr);
  };

  // ==================== RENDER: SKILL DETAIL VIEW (IMAGE 2) ====================
  if (editingSkill) {
    const files = getSkillFiles(editingSkill);
    const selectedFile = files.find((f) => f.name === selectedFileName) || files[0];
    const mainFile = files.find((f) => f.isMain) || files[0];
    const subFiles = files.filter((f) => !f.isMain);

    return (
      <div className="flex-1 bg-white border border-slate-200/80 rounded-3xl flex flex-col h-full overflow-hidden shadow-xs animate-in fade-in duration-200">
        {/* Navigation Bar with Back Button, Tabs, and Export button */}
        <div className="px-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-3 cursor-pointer transition-colors"
              title="返回技能列表"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回列表</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <button
              type="button"
              onClick={() => setActiveSkillTab('overview')}
              className={`py-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                activeSkillTab === 'overview'
                  ? 'border-[#EA3A20] text-[#EA3A20]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              概览配置
            </button>
            <button
              type="button"
              onClick={() => setActiveSkillTab('files')}
              className={`py-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                activeSkillTab === 'files'
                  ? 'border-[#EA3A20] text-[#EA3A20]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              文件源码 ({files.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSkillTab('history')}
              className={`py-3 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeSkillTab === 'history'
                  ? 'border-[#EA3A20] text-[#EA3A20]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>修改记录 ({getSkillChangeHistory(editingSkill).length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExportSkillConfig(editingSkill)}
              className="h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="导出当前 Skill 配置包"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出配置包</span>
            </button>

            <button
              type="button"
              onClick={handleSaveEditingSkill}
              className="h-8 px-3.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
            >
              <Check className={`w-3.5 h-3.5 ${savedTip ? 'animate-bounce' : ''}`} />
              <span>{savedTip ? '已保存' : '保存修改'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeSkillTab === 'overview' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl">
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#EA3A20]" />
                <span>技能基础信息与业务参数</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-500 font-medium">技能名称</label>
                  <input
                    type="text"
                    value={editingSkill.name}
                    onChange={(e) => {
                      const updated = { ...editingSkill, name: e.target.value };
                      setEditingSkill(updated);
                      setSkillsList(skillsList.map((s) => (s.id === updated.id ? updated : s)));
                    }}
                    className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-medium">唯一代码标识 (Identifier)</label>
                  <input
                    type="text"
                    value={editingSkill.code}
                    disabled
                    className="w-full mt-1 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-500 font-medium text-xs">功能描述</label>
                <textarea
                  rows={3}
                  value={editingSkill.description}
                  onChange={(e) => {
                    const updated = { ...editingSkill, description: e.target.value };
                    setEditingSkill(updated);
                    setSkillsList(skillsList.map((s) => (s.id === updated.id ? updated : s)));
                  }}
                  className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {activeSkillTab === 'files' && (
          /* Files Editing Layout matching Image 2 */
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Left Sidebar: File Tree */}
            <div className="w-72 border-r border-slate-200/80 bg-slate-50/50 flex flex-col p-4 shrink-0 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">主文件</div>
                <button
                  type="button"
                  onClick={() => setSelectedFileName(mainFile.name)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFileName === mainFile.name
                      ? 'bg-[#EA3A20] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span className="truncate">{mainFile.name}</span>
                </button>
              </div>

              <div className="space-y-1 pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  附属文件 ({subFiles.length})
                </div>
                {subFiles.map((file) => (
                  <div
                    key={file.name}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                      selectedFileName === file.name
                        ? 'bg-[#EA3A20] text-white shadow-xs font-bold'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                    onClick={() => setSelectedFileName(file.name)}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (subFiles.length <= 1) return;
                        const newFiles = files.filter((f) => f.name !== file.name);
                        const updated = { ...editingSkill, files: newFiles };
                        setEditingSkill(updated);
                        setSkillsList(skillsList.map((s) => (s.id === updated.id ? updated : s)));
                        if (selectedFileName === file.name) setSelectedFileName(mainFile.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-200 transition-opacity p-1"
                      title="删除文件"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newFileName = `module_${Date.now().toString().slice(-4)}.ts`;
                    const newFiles = [...files, { name: newFileName, content: `// New file source\n`, isMain: false }];
                    const updated = { ...editingSkill, files: newFiles };
                    setEditingSkill(updated);
                    setSkillsList(skillsList.map((s) => (s.id === updated.id ? updated : s)));
                    setSelectedFileName(newFileName);
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-[#EA3A20] hover:text-[#EA3A20] text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ 新建文件</span>
                </button>
              </div>
            </div>

            {/* Right Main Area: File Editor matching Image 2 */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
              <div className="px-6 py-3 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-800">
                  <FileCode className="w-4 h-4 text-[#EA3A20]" />
                  <span>{selectedFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedFile.isMain) return;
                    const newFiles = files.filter((f) => f.name !== selectedFile.name);
                    const updated = { ...editingSkill, files: newFiles };
                    setEditingSkill(updated);
                    setSkillsList(skillsList.map((s) => (s.id === updated.id ? updated : s)));
                    setSelectedFileName(mainFile.name);
                  }}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="删除当前文件"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <textarea
                  value={selectedFile.content}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    const newFiles = files.map((f) => (f.name === selectedFile.name ? { ...f, content: newContent } : f));
                    const updated = { ...editingSkill, files: newFiles };
                    setEditingSkill(updated);
                    setSkillsList(skillsList.map((s) => (s.id === updated.id ? updated : s)));
                  }}
                  className="w-full h-full bg-slate-900 text-slate-100 font-mono text-xs p-5 rounded-2xl border border-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#EA3A20] resize-none custom-scrollbar shadow-inner"
                  placeholder="在此编写或修改文件内容..."
                />
              </div>
            </div>
          </div>
        )}

        {activeSkillTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl custom-scrollbar animate-in fade-in duration-200">
            {/* Timeline */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {getSkillChangeHistory(editingSkill).map((rec, idx) => {
                const isLatest = idx === 0;
                return (
                  <div key={rec.id || idx} className="relative group">
                    <div
                      className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isLatest
                          ? 'bg-emerald-500 border-emerald-200 text-white shadow-xs'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-white' : 'bg-slate-400'}`} />
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs space-y-3 transition-all">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{rec.operatorName}</span>
                          {rec.operatorRole && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                              {rec.operatorRole}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {rec.timestamp}
                          </span>
                          {isLatest && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                              生效中
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-slate-800">
                        {rec.changeSummary}
                      </div>

                      {rec.diffDetails && rec.diffDetails.length > 0 && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs space-y-1.5">
                          {rec.diffDetails.map((diff, dIdx) => (
                            <div key={dIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                              <span className="font-medium text-slate-600 sm:w-1/3 shrink-0 text-[11px]">
                                {diff.field}
                              </span>
                              <div className="flex-1 flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[11px] truncate max-w-[200px]">
                                  {diff.before || '空'}
                                </span>
                                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-[11px] font-bold truncate max-w-[200px]">
                                  {diff.after || '空'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Source code change diff download box */}
                      {(rec.changeType === 'files' ||
                        (rec.fileDiffs && rec.fileDiffs.length > 0) ||
                        (rec.diffDetails && rec.diffDetails.some((d) => d.field.includes('文件') || d.field.includes('源码') || d.field.includes('handler') || d.field.includes('SKILL.md')))) && (
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 text-xs space-y-2.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <FileCode className="w-3.5 h-3.5 text-[#EA3A20]" />
                              <span>源码修改对比与本地文件下载</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              支持分别下载修改前 (旧版) 与修改后 (新版) 两份文件到本地对比
                            </span>
                          </div>

                          {rec.fileDiffs && rec.fileDiffs.length > 0 ? (
                            <div className="space-y-1.5">
                              {rec.fileDiffs.map((fd, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs gap-3 flex-wrap"
                                >
                                  <div className="flex items-center gap-2 font-mono text-slate-800 font-bold truncate">
                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span className="truncate">{fd.fileName}</span>
                                    {fd.changeType === 'added' && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-sans border border-emerald-200">
                                        新增
                                      </span>
                                    )}
                                    {fd.changeType === 'deleted' && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-sans border border-rose-200">
                                        删除
                                      </span>
                                    )}
                                    {fd.changeType === 'modified' && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-sans border border-amber-200">
                                        已修改
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {fd.oldContent !== undefined && (
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadOldFile(rec, fd.fileName)}
                                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                        title={`下载修改前旧版文件 (${fd.fileName})`}
                                      >
                                        <Download className="w-3 h-3 text-slate-500" />
                                        <span>下载旧版文件</span>
                                      </button>
                                    )}
                                    {fd.newContent !== undefined && (
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadNewFile(rec, fd.fileName)}
                                        className="px-2.5 py-1 rounded-lg bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs active:scale-95"
                                        title={`下载修改后新版文件 (${fd.fileName})`}
                                      >
                                        <Download className="w-3 h-3 text-white" />
                                        <span>下载新版文件</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleDownloadOldFile(rec)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                title="下载修改前旧版源码文件"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                <span>下载修改前旧文件</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadNewFile(rec)}
                                className="px-3 py-1.5 rounded-lg bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                                title="下载修改后新版源码文件"
                              >
                                <Download className="w-3.5 h-3.5 text-white" />
                                <span>下载修改后新文件</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadComparisonBundle(rec)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                title="下载包含新旧两份源码对比的完整 JSON 数据包"
                              >
                                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                                <span>下载两份文件对比包</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== RENDER: SKILL LIST VIEW (1. 列表形式) ====================
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 3. Skills Table / List View */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">技能名称与标识</th>
                <th className="py-3.5 px-4">版本号</th>
                <th className="py-3.5 px-4">关联智能体</th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-6 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSkills.map((skill) => {
                const Icon = getSkillIcon(skill.iconName);
                const isEnabled = skill.status === 'enabled';

                return (
                  <tr
                    key={skill.id}
                    onClick={() => {
                      setEditingSkill(skill);
                      setActiveSkillTab('overview');
                    }}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EA3A20]/10 text-[#EA3A20] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 group-hover:text-[#EA3A20] transition-colors">
                              {skill.name}
                            </span>
                            {skill.isCustom ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                                自定义
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                系统内置
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-slate-400 text-[11px] block mt-0.5">
                            {skill.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs font-medium text-slate-700">
                      {skill.version || 'v1.0.0'}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {skill.associatedAgents && skill.associatedAgents.length > 0 ? (
                          skill.associatedAgents.map((ag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold"
                            >
                              {ag}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">暂未绑定</span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBindingSkill(skill);
                          }}
                          className="text-[11px] text-[#EA3A20] hover:underline font-bold ml-1"
                        >
                          + 绑定
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(skill.id, e)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                          isEnabled ? 'bg-[#EA3A20]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            isEnabled ? 'translate-x-4.5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkill(skill);
                            setActiveSkillTab('files');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>编辑</span>
                        </button>
                        {skill.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSkill(skill.id, e)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] flex items-center gap-1 transition-colors"
                            title="删除自定义技能"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                            <span>删除</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== CREATE SKILL MODAL (IMAGE 1) ==================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            {/* Header matching Image 1 */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-base font-bold text-slate-900">新建 skill</h3>
                <p className="text-xs text-slate-500 mt-0.5">选择添加 skill 的方式。</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCreateMode(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {!createMode ? (
                /* Two Selectable Cards matching Image 1 */
                <div className="space-y-3.5">
                  <div
                    onClick={() => setCreateMode('manual')}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-[#EA3A20] bg-white hover:bg-slate-50/80 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 group-hover:bg-[#EA3A20]/10 text-slate-600 group-hover:text-[#EA3A20] flex items-center justify-center font-bold transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">手动创建</h4>
                        <p className="text-xs text-slate-500 mt-0.5">从空白 SKILL.md 开始写。</p>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-[#EA3A20] font-bold text-lg">›</span>
                  </div>

                  <div
                    onClick={() => setCreateMode('import')}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-[#EA3A20] bg-white hover:bg-slate-50/80 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 group-hover:bg-[#EA3A20]/10 text-slate-600 group-hover:text-[#EA3A20] flex items-center justify-center font-bold transition-colors">
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">从本地导入</h4>
                        <p className="text-xs text-slate-500 mt-0.5">选择包含 SKILL.md 的文件夹，或 .skill / .zip 压缩包。</p>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-[#EA3A20] font-bold text-lg">›</span>
                  </div>
                </div>
              ) : createMode === 'manual' ? (
                /* Manual Creation Form */
                <form onSubmit={handleCreateManualSubmit} className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 pb-2">
                    <button
                      type="button"
                      onClick={() => setCreateMode(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold"
                    >
                      ← 返回选择方式
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      技能名称 <span className="text-[#EA3A20]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例如：意大利真皮沙发面料比对器"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      技能代码 Identifier <span className="text-[#EA3A20]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例如：italian_leather_matcher"
                      value={newSkillCode}
                      onChange={(e) => setNewSkillCode(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">所属分类</label>
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value as any)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                      >
                        <option value="计算与配载">计算与配载</option>
                        <option value="工程与图纸">工程与图纸</option>
                        <option value="合规与质检">合规与质检</option>
                        <option value="商务与文案">商务与文案</option>
                        <option value="语音与多模态">语音与多模态</option>
                        <option value="报价与计价">报价与计价</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">功能简述</label>
                      <input
                        type="text"
                        placeholder="一句话简述技能用途"
                        value={newSkillDesc}
                        onChange={(e) => setNewSkillDesc(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold cursor-pointer shadow-xs"
                    >
                      创建并开始编辑 SKILL.md
                    </button>
                  </div>
                </form>
              ) : (
                /* Import Simulation Form */
                <div className="space-y-4 animate-in fade-in duration-150 text-center py-4">
                  <div className="flex items-center justify-between pb-2">
                    <button
                      type="button"
                      onClick={() => setCreateMode(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold"
                    >
                      ← 返回选择方式
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 space-y-3 bg-slate-50/50">
                    <FolderOpen className="w-10 h-10 text-[#EA3A20] mx-auto" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">拖拽文件夹或点击上传 .skill / .zip 包</h4>
                      <p className="text-[11px] text-slate-400 mt-1">自动识别根目录下的 SKILL.md 与附加脚本文件</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulateImport}
                      className="px-5 py-2.5 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>选择本地文件并一键导入</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Agent Binding Modal */}
      {bindingSkill && (
        <AgentBindModal
          isOpen={!!bindingSkill}
          skill={bindingSkill}
          onClose={() => setBindingSkill(null)}
          onSaveBinding={handleSaveAgentBinding}
        />
      )}

      {/* Config History Modal */}
      <ConfigHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setHistoryTargetSkill(null);
        }}
        targetTitle={historyTargetSkill?.name || editingSkill?.name || '技能配置'}
        targetType="skill"
        targetCode={historyTargetSkill?.code || editingSkill?.code}
        records={
          historyTargetSkill
            ? getSkillChangeHistory(historyTargetSkill)
            : editingSkill
            ? getSkillChangeHistory(editingSkill)
            : []
        }
      />
    </div>
  );
});
