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
  AlertTriangle,
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
  Upload,
  History,
  ArrowRight
} from 'lucide-react';
import { AgentSkill, AgentSkillParameter, ConfigChangeRecord } from '../../../types';
import { AgentBindModal } from './AgentBindModal';
import { getSkillChangeHistory, formatNow } from '../../../data/configHistoryData';
import { ConfigHistoryModal } from './ConfigHistoryModal';
import { SkillFileExplorer } from './SkillFileExplorer';
import { getCompleteSkillFiles } from '../../../data/skillFilesData';
import { initialSalesSkills } from '../../../data/salesAgentData';

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
  
  // Manual creation form state (no category)
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCode, setNewSkillCode] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  // File input ref for importing config packages
  const importPackageInputRef = React.useRef<HTMLInputElement | null>(null);

  // Custom skill deletion reminder state
  const [skillToDelete, setSkillToDelete] = useState<AgentSkill | null>(null);

  // Restore built-in skill to default settings
  const handleResetBuiltinSkill = (skill: AgentSkill, e: React.MouseEvent) => {
    e.stopPropagation();
    if (skill.isCustom) return;

    if (
      window.confirm(
        `确定要将内置技能「${skill.name}」恢复为系统出厂初始设置吗？\n\n提示：将重置所有自定义修改的源码文件、业务参数及调用规则。`
      )
    ) {
      const defaultSkill = initialSalesSkills.find((s) => s.code === skill.code || s.id === skill.id);
      const resetFiles = getCompleteSkillFiles(defaultSkill || skill);
      const resetSkill: AgentSkill = defaultSkill
        ? {
            ...defaultSkill,
            files: resetFiles
          }
        : {
            ...skill,
            files: resetFiles
          };

      // Add a history record for reset
      const resetRecord: ConfigChangeRecord = {
        id: `HIST-SK-RESET-${Date.now()}`,
        targetId: skill.id,
        targetType: 'skill',
        targetName: skill.name,
        operatorName: 'Chen Yi (陈总)',
        operatorRole: '超级管理员',
        timestamp: formatNow(),
        changeType: 'rollback',
        changeSummary: '恢复系统出厂初始设置（重置源码文件与参数配置）',
        diffDetails: [
          {
            field: '配置恢复',
            before: '自定义修改配置及源码',
            after: '系统出厂初始默认版本'
          }
        ]
      };

      const currentHistory = getSkillChangeHistory(skill);
      resetSkill.changeHistory = [resetRecord, ...currentHistory];

      const updated = skillsList.map((s) => (s.id === skill.id ? resetSkill : s));
      setSkillsList(updated);
      if (onUpdateSkills) onUpdateSkills(updated);
      if (editingSkill?.id === skill.id) {
        setEditingSkill(resetSkill);
      }
      alert(`已成功将内置技能「${skill.name}」恢复为系统初始设置！`);
    }
  };

  // Open deletion modal for custom skills
  const handleDeleteCustomSkillClick = (skill: AgentSkill, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!skill.isCustom) {
      alert('系统内置 Skill 不允许删除，仅支持「恢复初始设置」！');
      return;
    }
    setSkillToDelete(skill);
  };

  // Confirm delete custom skill
  const handleConfirmDeleteSkill = () => {
    if (!skillToDelete) return;
    const targetId = skillToDelete.id;
    const updated = skillsList.filter((s) => s.id !== targetId);
    setSkillsList(updated);
    if (onUpdateSkills) onUpdateSkills(updated);
    if (editingSkill?.id === targetId) {
      setEditingSkill(null);
    }
    setSkillToDelete(null);
  };

  // Agent Binding Modal state
  const [bindingSkill, setBindingSkill] = useState<AgentSkill | null>(null);
  const [savedTip, setSavedTip] = useState(false);

  // Ensure every skill has files array
  const getSkillFiles = (skill: AgentSkill) => {
    return getCompleteSkillFiles(skill);
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

  const handleImportPackageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingSkill) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Check if JSON configuration package
        if (file.name.endsWith('.json') || file.name.endsWith('.skill')) {
          try {
            const parsed = JSON.parse(text);
            if (parsed && typeof parsed === 'object') {
              const mergedFiles = parsed.files && Array.isArray(parsed.files)
                ? parsed.files
                : editingSkill.files;

              const updatedSkill: AgentSkill = {
                ...editingSkill,
                name: parsed.name || editingSkill.name,
                description: parsed.description || editingSkill.description,
                triggerType: parsed.triggerType || editingSkill.triggerType,
                triggerKeywords: parsed.triggerKeywords || editingSkill.triggerKeywords,
                parameters: parsed.parameters || editingSkill.parameters,
                version: parsed.version || editingSkill.version,
                files: mergedFiles
              };

              setEditingSkill(updatedSkill);
              const updatedList = skillsList.map((s) => (s.id === updatedSkill.id ? updatedSkill : s));
              setSkillsList(updatedList);
              if (onUpdateSkills) onUpdateSkills(updatedList);

              alert(`配置包导入成功！已从本地「${file.name}」导入配置与 ${mergedFiles ? mergedFiles.length : 0} 个文件。`);
              return;
            }
          } catch (jsonErr) {
            // fallback to single file import below
          }
        }

        // Single file import into current skill files
        const currentFiles = getSkillFiles(editingSkill);
        const existingIdx = currentFiles.findIndex((f) => f.name === file.name);
        let nextFiles;
        if (existingIdx !== -1) {
          nextFiles = currentFiles.map((f, idx) => (idx === existingIdx ? { ...f, content: text } : f));
        } else {
          nextFiles = [...currentFiles, { name: file.name, content: text, isMain: file.name === 'SKILL.md' }];
        }

        const updatedSkill: AgentSkill = {
          ...editingSkill,
          files: nextFiles
        };
        setEditingSkill(updatedSkill);
        const updatedList = skillsList.map((s) => (s.id === updatedSkill.id ? updatedSkill : s));
        setSkillsList(updatedList);
        if (onUpdateSkills) onUpdateSkills(updatedList);

        alert(`文件「${file.name}」已成功导入到当前 Skill 中！`);
      } catch (err) {
        alert('导入失败，请检查文件格式是否有效。');
      } finally {
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
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
            <input
              type="file"
              ref={importPackageInputRef}
              onChange={handleImportPackageFile}
              accept=".json,.skill,.zip,.txt,.md"
              className="hidden"
            />

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
              onClick={() => importPackageInputRef.current?.click()}
              className="h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="从本地选择文件导入配置包"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>导入配置包</span>
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
          <SkillFileExplorer
            files={files}
            skillName={editingSkill.name}
            skillCode={editingSkill.code}
            onUpdateFiles={(updatedFiles) => {
              const updated = { ...editingSkill, files: updatedFiles };
              setEditingSkill(updated);
              setSkillsList(skillsList.map((s) => (s.id === updated.id ? updated : s)));
            }}
          />
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
                <th className="py-3.5 px-6">技能名称</th>
                <th className="py-3.5 px-4">版本号</th>
                <th className="py-3.5 px-4">关联智能体</th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-6 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSkills.map((skill) => {
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
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>编辑</span>
                        </button>

                        {!skill.isCustom ? (
                          <button
                            type="button"
                            onClick={(e) => handleResetBuiltinSkill(skill, e)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1 transition-colors border border-amber-200/60 cursor-pointer"
                            title="恢复为系统出厂初始设置"
                          >
                            <RotateCcw className="w-2.5 h-2.5 text-amber-600" />
                            <span>恢复初始设置</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomSkillClick(skill, e)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
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

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">功能简述</label>
                    <input
                      type="text"
                      placeholder="一句话简述技能用途（例如：外贸业务智能算力与定制化处理逻辑）"
                      value={newSkillDesc}
                      onChange={(e) => setNewSkillDesc(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                    />
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



      {/* Custom Skill Deletion Warning Modal */}
      {skillToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start gap-3 bg-red-50/40">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900">删除自定义技能确认</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  技能名称：<span className="font-bold text-slate-800">{skillToDelete.name}</span> ({skillToDelete.code})
                </p>
              </div>
            </div>

            {/* Modal Body with Agent mounting reminders */}
            <div className="p-6 space-y-4 text-xs">
              {skillToDelete.associatedAgents && skillToDelete.associatedAgents.length > 0 ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>该技能当前正挂载在以下智能体上：</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skillToDelete.associatedAgents.map((agName, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]"
                      >
                        {agName}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-800 pt-1 leading-relaxed">
                    ⚠️ 注意：删除此自定义技能后，上述 <strong>{skillToDelete.associatedAgents.length}</strong> 个智能体将自动解除对该技能的依赖，且无法再调用其功能。
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 leading-relaxed">
                  该技能当前暂未挂载在任何智能体上。确认删除后，相关配置和源码文件将永久清除。
                </div>
              )}

              <p className="text-slate-600 font-medium">
                确定要删除自定义技能「<strong>{skillToDelete.name}</strong>」吗？此操作不可撤销。
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSkillToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSkill}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                确认删除
              </button>
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
