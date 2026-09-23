import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree,
  Save,
  Plus,
  GitBranch,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Folder,
  FolderOpen,
  FileText,
  UploadCloud,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  RefreshCw,
  Trash2,
  Check,
  Edit3,
  ArrowUp,
  ArrowDown,
  GripVertical,
  X,
  Lock,
  Eye,
  ArrowRightLeft,
  Tag,
  Clock,
  Layers,
  CheckSquare,
  Square,
  Hash,
  Palette,
  Bookmark,
  ListFilter,
  SlidersHorizontal,
  Filter,
  FileSearch,
  ExternalLink,
  BookOpen,
  Library,
  Building2,
  ShieldCheck,
  HelpCircle,
  Video,
  Presentation,
  Play,
  Film,
  Download,
  FileUp,
  File,
  Code,
  Quote,
  Table,
  Link2,
  Calendar,
  ShieldAlert,
  Globe,
  Users,
  AlertTriangle,
  XCircle,
  AlertCircle,
  CalendarClock
} from 'lucide-react';
import { KBArticle, KBCategory, KBTag, KBVersion, KBAuditLog } from '../../types';
import { initialKBTags } from '../../data/mockData';
import { ArticleContentTab } from './knowledge/ArticleContentTab';
import { ArticleTagsTab } from './knowledge/ArticleTagsTab';
import { ArticlePermissionsTab } from './knowledge/ArticlePermissionsTab';
import { ArticleDetailDrawer } from './knowledge/ArticleDetailDrawer';
import { ArticleReviewSubView } from './knowledge/ArticleReviewSubView';
import { Pagination } from '../common/Pagination';
import { DeptTreeSelect } from '../common/DeptTreeSelect';

// 预设配置选项 (用于知识条目新建/编辑配置)
export const PRESET_DEPARTMENTS = [
  '产品中心',
  '设计部',
  '产品管理部',
  '研究所',
  '市场部',
  '制造中心',
  '装配车间',
  '供应链部',
  '流程与质量',
  '品质控制部',
  '流程体系部',
  '人力行政',
  '招聘与培训组',
  '行政综合组',
  '信息部',
  '售后服务部',
  '财务部',
  '全公司/全员'
];

export const PRESET_ROLES = [
  '外贸销售岗',
  '内容推广岗',
  '方案设计师',
  '安装技术岗',
  '关务跟单岗',
  '外贸采购岗',
  '生产主管',
  '全员通用'
];

export const PRESET_REGIONS = [
  'GCC中东六国',
  '英文/阿拉伯语',
  '北美地区 (美加 · CARB/EPA)',
  '欧洲市场 (英德法 · CE/BS5852)',
  '东南亚 (新马泰/印尼)',
  '澳洲与新西兰 (AS/NZS)',
  '拉美与西语区',
  '全球通用'
];

interface KnowledgeModuleProps {
  articles: KBArticle[];
  categories: KBCategory[];
  tags?: KBTag[];
  versions: KBVersion[];
  subView: string;
}

export const KnowledgeModule: React.FC<KnowledgeModuleProps> = ({
  articles: initialArticles,
  categories: initialCategories,
  tags: initialTags = initialKBTags,
  versions,
  subView
}) => {
  // Content List State
  const [contentList, setContentList] = useState<KBArticle[]>(initialArticles);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'markdown' | 'document' | 'video'>('all');
  const [selectedContentIds, setSelectedContentIds] = useState<Set<string>>(new Set());

  // Category Tree Dynamic State
  const [categoryList, setCategoryList] = useState<KBCategory[]>(initialCategories);
  const [treeSearchQuery, setTreeSearchQuery] = useState('');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(() => {
    const defaultExpanded = new Set<string>();
    const addAll = (nodes: KBCategory[]) => {
      nodes.forEach((n) => {
        defaultExpanded.add(n.id);
        if (n.children && n.children.length > 0) {
          addAll(n.children);
        }
      });
    };
    addAll(initialCategories);
    return defaultExpanded;
  });

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>('产品与技术百科 / 产品百科 / 按单品 / 柜类');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail & Preview Modal
  const [previewArticle, setPreviewArticle] = useState<KBArticle | null>(null);
  const [hoveredTitle, setHoveredTitle] = useState<{ id: string; title: string; rect: { top: number; left: number; width: number; height: number } } | null>(null);

  // Rejection Reason Detail Modal State
  const [rejectionDetailArticle, setRejectionDetailArticle] = useState<KBArticle | null>(null);

  // Create / Edit Article Modal
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KBArticle | null>(null);
  const [articleContentType, setArticleContentType] = useState<'markdown' | 'document' | 'video'>('markdown');
  const [articleMarkdownView, setArticleMarkdownView] = useState<'edit' | 'preview' | 'split'>('edit');
  const [articleFormTitle, setArticleFormTitle] = useState('');
  const [articleFormCategory, setArticleFormCategory] = useState('');
  const [articleFormTags, setArticleFormTags] = useState('');
  const [articleFormContent, setArticleFormContent] = useState('');

  // Document attachment states (Word, PPT, PDF, Excel)
  const [articleFormDocType, setArticleFormDocType] = useState<'DOCX' | 'PPTX' | 'PDF' | 'XLSX'>('DOCX');
  const [articleFormDocFile, setArticleFormDocFile] = useState<{ name: string; size: string; type: string; ext: string } | null>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // Video content states
  const [articleFormVideoUrl, setArticleFormVideoUrl] = useState('');
  const [articleFormVideoDuration, setArticleFormVideoDuration] = useState('08分30秒');
  const [articleFormVideoCover, setArticleFormVideoCover] = useState('');
  const [articleFormVideoSourceName, setArticleFormVideoSourceName] = useState('工厂工艺教学组实拍');
  const [articleFormVideoTranscript, setArticleFormVideoTranscript] = useState('');
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Article Modal 3 Top-Level Tabs: 'content' (设置知识内容) | 'tags' (打标签) | 'permissions' (配置业务范围和权限)
  const [articleModalStepTab, setArticleModalStepTab] = useState<'content' | 'tags' | 'permissions'>('content');

  // Article Modal Tag Picker helper states
  const [articleModalTab, setArticleModalTab] = useState<'builtin' | 'custom'>('builtin');
  const [articleModalTagSearch, setArticleModalTagSearch] = useState('');
  const [articleModalCustomTagInput, setArticleModalCustomTagInput] = useState('');
  const [articleModalInlineAddValue, setArticleModalInlineAddValue] = useState<Record<string, string>>({});
  const [isArticleModalAddingDim, setIsArticleModalAddingDim] = useState(false);
  const [articleModalNewDimName, setArticleModalNewDimName] = useState('');
  const [articleModalNewDimValues, setArticleModalNewDimValues] = useState('');
  const [articleModalNewDimGroup, setArticleModalNewDimGroup] = useState('自定义扩展');

  // ============================================================================
  // Article Configuration Options (业务配置与权限管控字段)
  // ============================================================================
  // 1. 适用地区/语种* (多选下拉)
  const [articleFormRegions, setArticleFormRegions] = useState<string[]>(['GCC中东六国', '英文/阿拉伯语']);
  const [isRegionsDropdownOpen, setIsRegionsDropdownOpen] = useState(false);
  const [customRegionInput, setCustomRegionInput] = useState('');

  // 2. 有效期限 (永久有效 或 设置有效期：开始日期与结束日期)
  const [articleFormExpiryType, setArticleFormExpiryType] = useState<'permanent' | 'custom'>('permanent');
  const [articleFormStartDate, setArticleFormStartDate] = useState<string>('');
  const [articleFormEndDate, setArticleFormEndDate] = useState<string>('');
  const [articleFormExpiryDate, setArticleFormExpiryDate] = useState<string>('');

  // 3. 关联条目 (搜索多选选择框)
  const [articleFormRelatedIds, setArticleFormRelatedIds] = useState<string[]>([]);
  const [relatedSearchQuery, setRelatedSearchQuery] = useState('');
  const [isRelatedDropdownOpen, setIsRelatedDropdownOpen] = useState(false);

  // Move Category Modal
  const [moveTargetArticle, setMoveTargetArticle] = useState<KBArticle | null>(null);
  const [targetCategoryPath, setTargetCategoryPath] = useState('');

  // Category CRUD Modals (For 分类管理)
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [modalParentNode, setModalParentNode] = useState<KBCategory | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatManagementDept, setNewCatManagementDept] = useState('产品中心');
  const [isNewCatManagementDropdownOpen, setIsNewCatManagementDropdownOpen] = useState(false);
  const [newCatViewableDepts, setNewCatViewableDepts] = useState<string[]>(['全公司/全员']);
  const [isNewCatViewableDropdownOpen, setIsNewCatViewableDropdownOpen] = useState(false);
  const [newCatCustomViewableDeptInput, setNewCatCustomViewableDeptInput] = useState('');
  const [newCatRequireReview, setNewCatRequireReview] = useState<boolean>(false);
  const [newCatReviewTriggers, setNewCatReviewTriggers] = useState<{ onUpload: boolean; onEdit: boolean; onDelete: boolean }>({
    onUpload: true,
    onEdit: true,
    onDelete: true
  });

  const [isEditCatModalOpen, setIsEditCatModalOpen] = useState(false);
  const [editingCatNode, setEditingCatNode] = useState<KBCategory | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatCode, setEditCatCode] = useState('');
  const [editCatManagementDept, setEditCatManagementDept] = useState('产品中心');
  const [isEditCatManagementDropdownOpen, setIsEditCatManagementDropdownOpen] = useState(false);
  const [editCatViewableDepts, setEditCatViewableDepts] = useState<string[]>([]);
  const [isEditCatViewableDropdownOpen, setIsEditCatViewableDropdownOpen] = useState(false);
  const [editCatCustomViewableDeptInput, setEditCatCustomViewableDeptInput] = useState('');
  const [editCatRequireReview, setEditCatRequireReview] = useState<boolean>(false);
  const [editCatReviewTriggers, setEditCatReviewTriggers] = useState<{ onUpload: boolean; onEdit: boolean; onDelete: boolean }>({
    onUpload: true,
    onEdit: true,
    onDelete: true
  });

  // 分类管理同级拖动排序状态
  const [draggedCatInfo, setDraggedCatInfo] = useState<{ id: string; name: string; parentId: string | null } | null>(null);
  const [dragOverCatInfo, setDragOverCatInfo] = useState<{ id: string; position: 'before' | 'after' } | null>(null);
  // 分类可查看部门展开查看所有浮层状态
  const [activeDeptsPopoverNode, setActiveDeptsPopoverNode] = useState<KBCategory | null>(null);

  // 点击外部自动关闭可查看部门全览浮层
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDeptsPopoverNode(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // ============================================================================
  // User Role for Tag Operations (平台管理员 admin vs 普通人员 staff)
  // 规则：只有平台管理才可以新增内置标签，其他的人默认新增自定义标签
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'staff'>('admin');

  // Tag Management State (知识库成对标签管理: 标签名与标签值增删查改)
  // ============================================================================
  const [tagList, setTagList] = useState<KBTag[]>(initialTags);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [selectedTagGroup, setSelectedTagGroup] = useState<string>('全部');
  const [selectedTagTypeFilter, setSelectedTagTypeFilter] = useState<'all' | 'builtin' | 'custom'>('all');
  const [tagSortBy, setTagSortBy] = useState<'usage' | 'time' | 'name'>('usage');
  const [tagViewMode, setTagViewMode] = useState<'table' | 'cards'>('cards');
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [activeTagForArticlesDrawer, setActiveTagForArticlesDrawer] = useState<{ tag: KBTag; value?: string } | null>(null);

  // Inline Quick Add Value on Card: Map of tagId -> current inputValue
  const [quickAddValues, setQuickAddValues] = useState<Record<string, string>>({});

  // Tag Add Modal State
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagValuesInput, setNewTagValuesInput] = useState('');
  const [newTagGroup, setNewTagGroup] = useState('通用');
  const [newTagCustomGroup, setNewTagCustomGroup] = useState('');
  const [newTagColor, setNewTagColor] = useState<KBTag['color']>('purple');
  const [newTagDesc, setNewTagDesc] = useState('');
  const [newTagIsBuiltin, setNewTagIsBuiltin] = useState<boolean>(true);

  // Tag Batch Add Modal State
  const [isBatchAddTagModalOpen, setIsBatchAddTagModalOpen] = useState(false);
  const [batchTagsInput, setBatchTagsInput] = useState('');
  const [batchTagGroup, setBatchTagGroup] = useState('通用');
  const [batchTagColor, setBatchTagColor] = useState<KBTag['color']>('purple');

  // Tag Edit Modal State
  const [isEditTagModalOpen, setIsEditTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<KBTag | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagValues, setEditTagValues] = useState<string[]>([]);
  const [editTagNewValueInput, setEditTagNewValueInput] = useState('');
  const [editTagGroup, setEditTagGroup] = useState('');
  const [editTagCustomGroup, setEditTagCustomGroup] = useState('');
  const [editTagColor, setEditTagColor] = useState<KBTag['color']>('purple');
  const [editTagDesc, setEditTagDesc] = useState('');
  const [editTagIsBuiltin, setEditTagIsBuiltin] = useState<boolean>(false);

  // Tag Delete Modal State
  const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
  const [deletingTag, setDeletingTag] = useState<KBTag | null>(null);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Determine active view mode
  const currentView: '内容上传' | '知识复核' | '分类管理' | '标签管理' =
    subView.includes('复核')
      ? '知识复核'
      : subView.includes('分类')
      ? '分类管理'
      : subView.includes('标签')
      ? '标签管理'
      : '内容上传';

  // Helper to parse key-value paired tags, e.g. "风格: 地中海" -> { key: "风格", value: "地中海", isPair: true }
  const parseTagPair = (tagStr: string): { key: string; value: string; isPair: boolean } => {
    if (!tagStr) return { key: '', value: '', isPair: false };
    if (tagStr.includes(':') || tagStr.includes('：')) {
      const parts = tagStr.split(/[:：]/).map((s) => s.trim());
      return {
        key: parts[0] || '',
        value: parts.slice(1).join(':').trim(),
        isPair: true
      };
    }
    return { key: tagStr.trim(), value: '', isPair: false };
  };

  // Helper for dynamic tag key usage count calculation
  const getTagUsageCount = (tag: KBTag): number => {
    return contentList.filter((c) => {
      if (!c.tags || c.tags.length === 0) return false;
      return c.tags.some((t) => {
        const parsed = parseTagPair(t);
        if (parsed.isPair) {
          return parsed.key.toLowerCase() === tag.name.toLowerCase();
        }
        return (
          t.toLowerCase() === tag.name.toLowerCase() ||
          (tag.values && tag.values.some((v) => v.toLowerCase() === t.toLowerCase()))
        );
      });
    }).length;
  };

  // Helper for specific tag value usage count
  const getTagValueUsageCount = (tagName: string, value: string): number => {
    return contentList.filter((c) => {
      if (!c.tags || c.tags.length === 0) return false;
      return c.tags.some((t) => {
        const parsed = parseTagPair(t);
        if (parsed.isPair) {
          return (
            parsed.key.toLowerCase() === tagName.toLowerCase() &&
            parsed.value.toLowerCase() === value.toLowerCase()
          );
        }
        return (
          t.toLowerCase() === value.toLowerCase() ||
          t.toLowerCase() === `${tagName}: ${value}`.toLowerCase() ||
          t.toLowerCase() === `${tagName}:${value}`.toLowerCase()
        );
      });
    }).length;
  };

  // Tag Color Badge Style Map - Unified calm neutral styling with subtle indicators
  const getTagBadgeStyle = (_color?: string) => {
    return 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300';
  };

  const getTagDotColor = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-rose-500';
      case 'blue': return 'bg-sky-500';
      case 'emerald': return 'bg-emerald-500';
      case 'amber': return 'bg-amber-500';
      case 'purple': return 'bg-purple-500';
      case 'rose': return 'bg-rose-500';
      case 'cyan': return 'bg-cyan-500';
      case 'indigo': return 'bg-indigo-500';
      default: return 'bg-slate-400';
    }
  };

  const colorOptions: { key: KBTag['color']; label: string; bgClass: string }[] = [
    { key: 'purple', label: '极简紫', bgClass: 'bg-purple-500' },
    { key: 'amber', label: '琥珀金', bgClass: 'bg-amber-500' },
    { key: 'red', label: '品爱红', bgClass: 'bg-red-500' },
    { key: 'blue', label: '科技蓝', bgClass: 'bg-blue-500' },
    { key: 'emerald', label: '环保绿', bgClass: 'bg-emerald-500' },
    { key: 'rose', label: '珊瑚粉', bgClass: 'bg-rose-500' },
    { key: 'cyan', label: '清爽青', bgClass: 'bg-cyan-500' },
    { key: 'indigo', label: '雅致靛', bgClass: 'bg-indigo-500' },
    { key: 'slate', label: '经典灰', bgClass: 'bg-slate-500' }
  ];

  // Dynamic Business Groups: First level categories from knowledge base + '通用'
  // 规则：业务分组跟着知识库的第一层级类目，下拉可以选择第一级类目加通用
  const kbFirstLevelCategories = categoryList.map((cat) => cat.name);
  const kbFirstLevelGroupOptions = Array.from(new Set(['通用', ...kbFirstLevelCategories]));
  const distinctTagGroups = Array.from(new Set(tagList.map((t) => t.categoryGroup).filter(Boolean)));
  const allTagGroupOptions = Array.from(new Set([...kbFirstLevelGroupOptions, ...distinctTagGroups]));

  // Filtered & Sorted Tags
  const filteredTags = tagList
    .filter((tag) => {
      const q = tagSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        tag.name.toLowerCase().includes(q) ||
        (tag.values && tag.values.some((v) => v.toLowerCase().includes(q))) ||
        (tag.description && tag.description.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (tagSortBy === 'usage') {
        return getTagUsageCount(b) - getTagUsageCount(a);
      }
      if (tagSortBy === 'name') {
        return a.name.localeCompare(b.name, 'zh-CN');
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

  // Tag Quick Inline Value Management
  const handleQuickAddTagValue = (tagId: string) => {
    const rawVal = quickAddValues[tagId]?.trim();
    if (!rawVal) return;

    const targetTag = tagList.find((t) => t.id === tagId);
    if (!targetTag) return;

    // Check duplicate
    if (targetTag.values?.some((v) => v.toLowerCase() === rawVal.toLowerCase())) {
      showToast(`⚠️ 标签「${targetTag.name}」已存在值「${rawVal}」`);
      return;
    }

    const updatedValues = [...(targetTag.values || []), rawVal];
    setTagList((prev) =>
      prev.map((t) =>
        t.id === tagId
          ? {
              ...t,
              values: updatedValues,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          : t
      )
    );

    setQuickAddValues((prev) => ({ ...prev, [tagId]: '' }));
    showToast(`✅ 已为「${targetTag.name}」添加标签值「${rawVal}」`);
  };

  const handleQuickRemoveTagValue = (tagId: string, valueToRemove: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const targetTag = tagList.find((t) => t.id === tagId);
    if (!targetTag) return;

    const updatedValues = (targetTag.values || []).filter((v) => v !== valueToRemove);
    setTagList((prev) =>
      prev.map((t) =>
        t.id === tagId
          ? {
              ...t,
              values: updatedValues,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          : t
      )
    );

    showToast(`🗑️ 已从「${targetTag.name}」中移除标签值「${valueToRemove}」`);
  };

  // Tag CRUD Handlers
  const handleOpenAddTagModal = () => {
    setNewTagName('');
    setNewTagValuesInput('');
    setNewTagColor('purple');
    setNewTagDesc('');
    setIsAddTagModalOpen(true);
  };

  const handleConfirmAddTag = () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) {
      showToast('⚠️ 请输入标签名称 (如：风格、色系、材质)');
      return;
    }

    // Check duplicate
    if (tagList.some((t) => t.name.toLowerCase() === trimmedName.toLowerCase())) {
      showToast(`⚠️ 标签名「${trimmedName}」已存在，请勿重复创建`);
      return;
    }

    // Parse values list
    const parsedValues = newTagValuesInput
      .split(/[,，\n、]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const distinctValues: string[] = parsedValues.length > 0 ? Array.from<string>(new Set(parsedValues)) : ['默认值'];

    const newTagItem: KBTag = {
      id: `TAG-${Date.now()}`,
      name: trimmedName,
      values: distinctValues,
      isBuiltin: true,
      builtinValues: [...distinctValues],
      color: newTagColor,
      categoryGroup: '通用',
      description: newTagDesc.trim() || undefined,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      creator: 'Franklin Jr (管理员)'
    };

    setTagList([newTagItem, ...tagList]);
    setIsAddTagModalOpen(false);
    showToast(`✅ 标签「${trimmedName}」创建成功`);
  };

  const handleConfirmBatchAddTags = () => {
    const lines = batchTagsInput
      .split(/[\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (lines.length === 0) {
      showToast('⚠️ 请输入至少一行标签数据 (如：风格: 地中海、现代简约)');
      return;
    }

    let addedCount = 0;
    const newItems: KBTag[] = [];

    lines.forEach((line) => {
      let tagName = line;
      let tagVals: string[] = [];

      if (line.includes(':') || line.includes('：')) {
        const parts = line.split(/[:：]/).map((s) => s.trim());
        tagName = parts[0];
        if (parts[1]) {
          tagVals = parts[1].split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
        }
      }

      if (tagName && !tagList.some((t) => t.name.toLowerCase() === tagName.toLowerCase()) && !newItems.some((t) => t.name.toLowerCase() === tagName.toLowerCase())) {
        const dVals = tagVals.length > 0 ? Array.from(new Set(tagVals)) : ['默认值'];
        newItems.push({
          id: `TAG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: tagName,
          values: dVals,
          isBuiltin: true,
          builtinValues: [...dVals],
          color: batchTagColor,
          categoryGroup: '通用',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          creator: 'Franklin Jr (管理员)'
        });
        addedCount++;
      }
    });

    if (addedCount === 0) {
      showToast('⚠️ 输入的标签已全部存在，未添加新标签');
      return;
    }

    setTagList([...newItems, ...tagList]);
    setIsBatchAddTagModalOpen(false);
    setBatchTagsInput('');
    showToast(`✅ 成功批量添加 ${addedCount} 个标签`);
  };

  const handleOpenEditTag = (tag: KBTag, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingTag(tag);
    setEditTagName(tag.name);
    setEditTagValues([...(tag.values || [])]);
    setEditTagNewValueInput('');
    setEditTagColor(tag.color);
    setEditTagDesc(tag.description || '');
    setIsEditTagModalOpen(true);
  };

  const handleConfirmEditTag = () => {
    if (!editingTag) return;
    const trimmed = editTagName.trim();
    if (!trimmed) {
      showToast('⚠️ 标签名不能为空');
      return;
    }

    // Check duplicate if name changed
    if (
      trimmed.toLowerCase() !== editingTag.name.toLowerCase() &&
      tagList.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      showToast(`⚠️ 标签名「${trimmed}」已被其他标签占用`);
      return;
    }

    const oldName = editingTag.name;
    const finalValues = Array.from(new Set(editTagValues.filter(Boolean)));

    // Update tag list
    setTagList((prev) =>
      prev.map((t) =>
        t.id === editingTag.id
          ? {
              ...t,
              name: trimmed,
              values: finalValues,
              isBuiltin: true,
              color: editTagColor,
              categoryGroup: '通用',
              description: editTagDesc.trim() || undefined,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          : t
      )
    );

    // If name changed, synchronize contentList articles that reference this tag!
    if (oldName !== trimmed) {
      let syncedArticlesCount = 0;
      setContentList((prev) =>
        prev.map((art) => {
          if (art.tags && art.tags.length > 0) {
            let changed = false;
            const updatedTags = art.tags.map((tg) => {
              const parsed = parseTagPair(tg);
              if (parsed.isPair && parsed.key === oldName) {
                changed = true;
                return `${trimmed}: ${parsed.value}`;
              }
              if (tg === oldName) {
                changed = true;
                return trimmed;
              }
              return tg;
            });
            if (changed) {
              syncedArticlesCount++;
              return { ...art, tags: updatedTags };
            }
          }
          return art;
        })
      );
      showToast(`✅ 标签已更新，并同步更新了 ${syncedArticlesCount} 篇关联文章`);
    } else {
      showToast(`✅ 标签「${trimmed}」已更新，现有 ${finalValues.length} 个标签值`);
    }

    setIsEditTagModalOpen(false);
    setEditingTag(null);
  };

  const handleOpenDeleteTag = (tag: KBTag, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeletingTag(tag);
    setIsDeleteTagModalOpen(true);
  };

  const handleConfirmDeleteTag = () => {
    if (!deletingTag) return;
    const nameToDelete = deletingTag.name;

    // Remove from tagList
    setTagList((prev) => prev.filter((t) => t.id !== deletingTag.id));

    // Remove from selectedTagIds
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      next.delete(deletingTag.id);
      return next;
    });

    // Clean up contentList tags
    let affectedCount = 0;
    setContentList((prev) =>
      prev.map((art) => {
        if (art.tags && art.tags.length > 0) {
          const originalLen = art.tags.length;
          const filtered = art.tags.filter((tg) => {
            const parsed = parseTagPair(tg);
            if (parsed.isPair) {
              return parsed.key !== nameToDelete;
            }
            return tg !== nameToDelete;
          });
          if (filtered.length !== originalLen) {
            affectedCount++;
            return { ...art, tags: filtered };
          }
        }
        return art;
      })
    );

    setIsDeleteTagModalOpen(false);
    setDeletingTag(null);
    showToast(`🗑️ 标签「${nameToDelete}」已删除，已解绑 ${affectedCount} 篇知识条目`);
  };

  const handleConfirmBatchDeleteTags = () => {
    if (selectedTagIds.size === 0) return;

    const tagsToDelete = tagList.filter((t) => selectedTagIds.has(t.id));
    const namesToDelete = new Set(tagsToDelete.map((t) => t.name));

    setTagList((prev) => prev.filter((t) => !selectedTagIds.has(t.id)));

    // Clean up contentList
    setContentList((prev) =>
      prev.map((art) => {
        if (art.tags && art.tags.length > 0) {
          const filtered = art.tags.filter((tg) => {
            const parsed = parseTagPair(tg);
            if (parsed.isPair) {
              return !namesToDelete.has(parsed.key);
            }
            return !namesToDelete.has(tg);
          });
          return { ...art, tags: filtered };
        }
        return art;
      })
    );

    const count = selectedTagIds.size;
    setSelectedTagIds(new Set());
    setIsBatchDeleteModalOpen(false);
    showToast(`🗑️ 成功批量删除 ${count} 个标签`);
  };

  const handleToggleSelectTag = (id: string) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Helper to render a high-contrast, structured two-tone badge for "标签名: 标签值"
  const renderPairedTagBadge = (tagStr: string, onClick?: () => void, isCompact = false) => {
    const parsed = parseTagPair(tagStr);
    const matchedDef = tagList.find((t) => t.name.toLowerCase() === parsed.key.toLowerCase());
    const isBuiltin = matchedDef ? Boolean(matchedDef.isBuiltin) : false;
    const color = matchedDef?.color || 'purple';

    if (parsed.isPair) {
      return (
        <span
          key={tagStr}
          onClick={onClick}
          className={`inline-flex items-center rounded-lg border border-slate-200/90 bg-white overflow-hidden text-[11px] font-medium transition-all select-none shadow-2xs ${
            onClick ? 'cursor-pointer hover:shadow-xs hover:border-slate-300 hover:scale-101 active:scale-98' : ''
          }`}
          title={`${parsed.key} : ${parsed.value} (${isBuiltin ? '内置标准标签' : '自定义标签'})`}
        >
          <span className="px-1.5 py-0.5 text-[10px] font-semibold shrink-0 border-r border-slate-200/80 bg-slate-100/90 text-slate-600 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${getTagDotColor(color)} shrink-0`} />
            <span>{parsed.key}</span>
          </span>
          <span className="px-2 py-0.5 text-[11px] font-medium text-slate-800 bg-white">
            {parsed.value}
          </span>
        </span>
      );
    }

    return (
      <span
        key={tagStr}
        onClick={onClick}
        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border border-slate-200/90 bg-white text-slate-700 inline-flex items-center gap-1.5 shadow-2xs ${
          onClick ? 'cursor-pointer hover:bg-slate-50 hover:border-slate-300 hover:shadow-xs' : ''
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${getTagDotColor(color)} shrink-0`} />
        <span>#{tagStr}</span>
      </span>
    );
  };

  const handleToggleSelectAllTags = () => {
    if (selectedTagIds.size === filteredTags.length) {
      setSelectedTagIds(new Set());
    } else {
      setSelectedTagIds(new Set(filteredTags.map((t) => t.id)));
    }
  };

  // Helper to extract all flatten category paths
  const getAllCategoryPaths = (nodes: KBCategory[], parentPath = ''): { name: string; fullPath: string; id: string }[] => {
    let result: { name: string; fullPath: string; id: string }[] = [];
    nodes.forEach((n) => {
      const currentPath = parentPath ? `${parentPath} / ${n.name}` : n.name;
      result.push({ name: n.name, fullPath: currentPath, id: n.id });
      if (n.children && n.children.length > 0) {
        result = result.concat(getAllCategoryPaths(n.children, currentPath));
      }
    });
    return result;
  };

  const allCategoryPaths = getAllCategoryPaths(categoryList);

  // Toggle Category Expand/Collapse
  const toggleNodeExpand = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAllNodes = () => {
    const all = new Set<string>();
    const addAll = (nodes: KBCategory[]) => {
      nodes.forEach((n) => {
        all.add(n.id);
        if (n.children) addAll(n.children);
      });
    };
    addAll(categoryList);
    setExpandedNodeIds(all);
  };

  const collapseAllNodes = () => {
    setExpandedNodeIds(new Set());
  };

  // Filter content items based on selected category & search
  const filteredContentList = contentList.filter((item) => {
    // Category filter
    if (selectedCategoryFilter) {
      const matchesCategory = item.category.includes(selectedCategoryFilter) ||
        selectedCategoryFilter.includes(item.category);
      if (!matchesCategory) return false;
    }

    // Type filter
    if (contentTypeFilter === 'markdown') {
      const isMd = item.contentType === 'markdown' || item.fileType === 'MD' || item.fileType === 'MANUAL';
      if (!isMd) return false;
    }
    if (contentTypeFilter === 'document') {
      const isDoc = item.contentType === 'document' ||
        item.fileType === 'DOCX' || item.fileType === 'PPTX' || item.fileType === 'PDF' || item.fileType === 'XLSX';
      if (!isDoc) return false;
    }
    if (contentTypeFilter === 'video') {
      const isVid = item.contentType === 'video' || item.fileType === 'VIDEO';
      if (!isVid) return false;
    }

    // Search query filter
    if (contentSearchQuery.trim()) {
      const q = contentSearchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
      const matchContent = item.content.toLowerCase().includes(q);
      const matchTranscript = item.videoInfo?.transcript?.toLowerCase().includes(q);
      return matchTitle || matchCode || matchCat || matchTags || matchContent || Boolean(matchTranscript);
    }

    return true;
  });

  // Knowledge content pagination
  const [contentCurrentPage, setContentCurrentPage] = useState<number>(1);
  const [contentPageSize, setContentPageSize] = useState<number>(10);

  // Reset page to 1 when filters change
  useEffect(() => {
    setContentCurrentPage(1);
  }, [selectedCategoryFilter, contentTypeFilter, contentSearchQuery]);

  const paginatedContentList = React.useMemo(() => {
    const start = (contentCurrentPage - 1) * contentPageSize;
    return filteredContentList.slice(start, start + contentPageSize);
  }, [filteredContentList, contentCurrentPage, contentPageSize]);

  // Calculate category stats
  const countStats = (nodes: KBCategory[]): { totalNodes: number; totalItems: number } => {
    let totalNodes = 0;
    let totalItems = 0;
    const traverse = (list: KBCategory[]) => {
      list.forEach((n) => {
        totalNodes += 1;
        totalItems += n.itemCount || 0;
        if (n.children && n.children.length > 0) {
          traverse(n.children);
        }
      });
    };
    traverse(nodes);
    return { totalNodes, totalItems };
  };

  const { totalNodes, totalItems } = countStats(categoryList);

  // Content Management Actions
  const handleOpenCreateArticle = () => {
    setEditingArticle(null);
    setArticleContentType('markdown');
    setArticleMarkdownView('edit');
    setArticleFormTitle('');
    setArticleFormCategory(selectedCategoryFilter || allCategoryPaths[0]?.fullPath || '基础知识库 / 品牌实力');
    setArticleFormTags('');
    setArticleFormContent('');

    // Reset Configuration Fields
    setArticleFormRegions(['GCC中东六国', '英文/阿拉伯语']);
    setIsRegionsDropdownOpen(false);
    setCustomRegionInput('');
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date();
    defaultEnd.setMonth(defaultEnd.getMonth() + 3);
    const endStr = defaultEnd.toISOString().split('T')[0];

    setArticleFormExpiryType('permanent');
    setArticleFormStartDate(todayStr);
    setArticleFormEndDate(endStr);
    setArticleFormExpiryDate(endStr);
    setArticleFormRelatedIds([]);
    setRelatedSearchQuery('');
    setIsRelatedDropdownOpen(false);

    // Reset doc attachment
    setArticleFormDocType('DOCX');
    setArticleFormDocFile(null);

    // Reset video info
    setArticleFormVideoUrl('');
    setArticleFormVideoDuration('08分30秒');
    setArticleFormVideoCover('');
    setArticleFormVideoSourceName('全屋定制实景演示');
    setArticleFormVideoTranscript('');

    setArticleModalTab('builtin');
    setArticleModalStepTab('content');
    setArticleModalTagSearch('');
    setArticleModalCustomTagInput('');
    setArticleModalInlineAddValue({});
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: KBArticle, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingArticle(art);
    
    // Determine content type
    let inferredType: 'markdown' | 'document' | 'video' = 'markdown';
    if (art.contentType) {
      inferredType = art.contentType;
    } else if (art.fileType === 'VIDEO') {
      inferredType = 'video';
    } else if (art.fileType === 'DOCX' || art.fileType === 'PPTX' || art.fileType === 'PDF' || art.fileType === 'XLSX') {
      inferredType = 'document';
    }
    setArticleContentType(inferredType);
    setArticleMarkdownView('edit');

    setArticleFormTitle(art.title);
    setArticleFormCategory(art.category);
    setArticleFormTags(art.tags ? art.tags.join(', ') : '');
    setArticleFormContent(art.content);

    // Populate Configuration Fields
    setArticleFormRegions(art.applicableRegions && art.applicableRegions.length > 0 ? art.applicableRegions : ['GCC中东六国', '英文/阿拉伯语']);
    setIsRegionsDropdownOpen(false);
    setCustomRegionInput('');
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date();
    defaultEnd.setMonth(defaultEnd.getMonth() + 3);
    const endStr = defaultEnd.toISOString().split('T')[0];

    setArticleFormExpiryType(art.expiryType || 'permanent');
    setArticleFormStartDate(art.validityStartDate || todayStr);
    setArticleFormEndDate(art.validityEndDate || art.expiryDate || endStr);
    setArticleFormExpiryDate(art.validityEndDate || art.expiryDate || endStr);
    setArticleFormRelatedIds(art.relatedArticleIds || []);
    setRelatedSearchQuery('');
    setIsRelatedDropdownOpen(false);

    // Populate document state
    if (art.fileType === 'PPTX') {
      setArticleFormDocType('PPTX');
    } else if (art.fileType === 'PDF') {
      setArticleFormDocType('PDF');
    } else if (art.fileType === 'XLSX') {
      setArticleFormDocType('XLSX');
    } else {
      setArticleFormDocType('DOCX');
    }

    if (art.attachmentFile) {
      setArticleFormDocFile(art.attachmentFile);
    } else if (inferredType === 'document') {
      setArticleFormDocFile({
        name: art.title,
        size: art.fileSize || '4.5 MB',
        type: 'document',
        ext: art.fileType?.toLowerCase() || 'docx'
      });
    } else {
      setArticleFormDocFile(null);
    }

    // Populate video state
    if (art.videoInfo) {
      setArticleFormVideoUrl(art.videoInfo.url || '');
      setArticleFormVideoDuration(art.videoInfo.duration || '08分30秒');
      setArticleFormVideoCover(art.videoInfo.coverUrl || '');
      setArticleFormVideoSourceName(art.videoInfo.sourceName || '全案实景拍摄');
      setArticleFormVideoTranscript(art.videoInfo.transcript || '');
    } else {
      setArticleFormVideoUrl('');
      setArticleFormVideoDuration('08分30秒');
      setArticleFormVideoCover('');
      setArticleFormVideoSourceName('全案实景拍摄');
      setArticleFormVideoTranscript('');
    }

    setArticleModalTab('builtin');
    setArticleModalStepTab('content');
    setArticleModalTagSearch('');
    setArticleModalCustomTagInput('');
    setArticleModalInlineAddValue({});
    setIsArticleModalOpen(true);
  };

  // Category lookup helper for review policy checking
  const findCategoryByPathOrName = (catPath: string): KBCategory | null => {
    if (!catPath) return null;
    const parts = catPath.split(/[\/\->]/).map((s) => s.trim());
    const targetName = parts[parts.length - 1] || catPath;

    const searchTree = (nodes: KBCategory[]): KBCategory | null => {
      for (const node of nodes) {
        if (node.name === targetName || node.name === catPath || catPath.includes(node.name)) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = searchTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return searchTree(categoryList);
  };

  // Review Workflow Action Handlers
  const handleApproveArticle = (article: KBArticle, comment?: string) => {
    const isDelete = article.pendingAction === 'delete';
    if (isDelete) {
      setContentList((prev) => prev.filter((c) => c.id !== article.id));
      setSelectedContentIds((prev) => {
        const next = new Set(prev);
        next.delete(article.id);
        return next;
      });
      showToast(`✅ 条目「${article.title}」删除复核已通过，已正式下线！`);
      return;
    }

    const newVer = article.pendingVersion
      ? article.pendingVersion.replace('-rc', '')
      : article.version.includes('-rc')
      ? article.version.replace('-rc', '')
      : article.version;

    const auditLog: KBAuditLog = {
      id: `LOG-${Date.now()}`,
      articleId: article.id,
      operator: 'Sophia (平台管理员)',
      operatorRole: '平台管理员',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'approve',
      actionLabel: '平台管理员复核通过',
      version: newVer,
      wasPublished: true,
      reviewComment: comment || '经平台管理员合规核对无误，符合外贸定制知识规范，复核通过',
      diffSummary: `平台管理员复核通过，版本定稿 ${newVer} 正式发布上线`,
      afterSnapshot: {
        title: article.title,
        category: article.category,
        content: article.content,
        version: newVer,
        status: '已发布',
        tags: article.tags
      }
    };

    setContentList((prev) =>
      prev.map((item) =>
        item.id === article.id
          ? {
              ...item,
              status: '已发布',
              reviewStatus: 'approved',
              reviewer: 'Sophia (平台管理员)',
              reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              reviewComment: comment || '复核通过',
              pendingAction: undefined,
              pendingVersion: undefined,
              wasPublished: true,
              version: newVer,
              auditLogs: [auditLog, ...(item.auditLogs || [])]
            }
          : item
      )
    );

    setPreviewArticle((prev) =>
      prev && prev.id === article.id
        ? {
            ...prev,
            status: '已发布',
            reviewStatus: 'approved',
            reviewer: 'Sophia (平台管理员)',
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            reviewComment: comment || '复核通过',
            pendingAction: undefined,
            pendingVersion: undefined,
            wasPublished: true,
            version: newVer,
            auditLogs: [auditLog, ...(prev.auditLogs || [])]
          }
        : prev
    );

    showToast(`✅ 知识条目「${article.title}」复核通过并已正式发布！`);
  };

  const handleRejectArticle = (article: KBArticle, reason: string) => {
    const auditLog: KBAuditLog = {
      id: `LOG-${Date.now()}`,
      articleId: article.id,
      operator: 'Sophia (平台管理员)',
      operatorRole: '平台管理员',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'reject',
      actionLabel: '平台管理员复核驳回',
      version: article.pendingVersion || article.version,
      wasPublished: Boolean(article.wasPublished),
      reviewComment: reason,
      diffSummary: `复核不通过驳回：${reason}`,
      beforeSnapshot: {
        title: article.title,
        category: article.category,
        content: article.content,
        version: article.version,
        status: article.status,
        tags: article.tags
      }
    };

    setContentList((prev) =>
      prev.map((item) =>
        item.id === article.id
          ? {
              ...item,
              status: item.wasPublished ? '已发布' : '复核不通过',
              reviewStatus: 'rejected',
              pendingVersion: undefined,
              pendingAction: undefined,
              reviewer: 'Sophia (平台管理员)',
              reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              reviewComment: reason,
              auditLogs: [auditLog, ...(item.auditLogs || [])]
            }
          : item
      )
    );

    setPreviewArticle((prev) =>
      prev && prev.id === article.id
        ? {
            ...prev,
            status: prev.wasPublished ? '已发布' : '复核不通过',
            reviewStatus: 'rejected',
            pendingVersion: undefined,
            pendingAction: undefined,
            reviewer: 'Sophia (平台管理员)',
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            reviewComment: reason,
            auditLogs: [auditLog, ...(prev.auditLogs || [])]
          }
        : prev
    );

    showToast(`❌ 知识条目「${article.title}」复核已驳回，原因已记录至详情日志`);
  };

  const handleBatchApprove = (articleIds: string[], comment?: string) => {
    if (articleIds.length === 0) return;
    const count = articleIds.length;
    articleIds.forEach((id) => {
      const art = contentList.find((c) => c.id === id);
      if (art) handleApproveArticle(art, comment);
    });
    showToast(`✅ 批量复核完成，已审批通过 ${count} 条知识条目！`);
  };

  const handleBatchReject = (articleIds: string[], reason: string) => {
    if (articleIds.length === 0) return;
    const count = articleIds.length;
    articleIds.forEach((id) => {
      const art = contentList.find((c) => c.id === id);
      if (art) handleRejectArticle(art, reason);
    });
    showToast(`❌ 批量驳回完成，已驳回 ${count} 条知识条目！`);
  };

  const handleRollbackArticle = (article: KBArticle, log: KBAuditLog) => {
    const targetSnapshot = log.beforeSnapshot || log.afterSnapshot;
    if (!targetSnapshot) {
      showToast('⚠️ 该历史日志未包含快照数据，无法执行回滚！');
      return;
    }

    const currentVerNum = parseFloat(article.version.replace(/[^0-9.]/g, '')) || 2.0;
    const newRollbackVersion = `v${(currentVerNum + 0.1).toFixed(1)}.0-rollback`;

    const rollbackAuditLog: KBAuditLog = {
      id: `LOG-${Date.now()}`,
      articleId: article.id,
      operator: 'Sophia (平台管理员)',
      operatorRole: '平台管理员',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'rollback',
      actionLabel: `版本回滚到历史版本 ${log.version}`,
      version: newRollbackVersion,
      wasPublished: true,
      diffSummary: `执行版本回滚，将知识正文、标题与成对标签恢复至 ${log.version} (${log.timestamp}) 状态`,
      beforeSnapshot: {
        title: article.title,
        category: article.category,
        content: article.content,
        version: article.version,
        status: article.status,
        tags: article.tags
      },
      afterSnapshot: {
        title: targetSnapshot.title || article.title,
        category: targetSnapshot.category || article.category,
        content: targetSnapshot.content || article.content,
        version: newRollbackVersion,
        status: '已发布',
        tags: targetSnapshot.tags || article.tags
      }
    };

    const updatedArticle: KBArticle = {
      ...article,
      title: targetSnapshot.title || article.title,
      category: targetSnapshot.category || article.category,
      content: targetSnapshot.content || article.content,
      tags: targetSnapshot.tags || article.tags,
      version: newRollbackVersion,
      status: '已发布',
      reviewStatus: 'approved',
      pendingAction: undefined,
      updatedAt: new Date().toISOString().split('T')[0],
      auditLogs: [rollbackAuditLog, ...(article.auditLogs || [])]
    };

    setContentList((prev) => prev.map((c) => (c.id === article.id ? updatedArticle : c)));
    setPreviewArticle(updatedArticle);
    showToast(`⏪ 知识条目「${article.title}」已成功回滚至 ${log.version}，生成定稿版本 ${newRollbackVersion}！`);
  };

  const handleSaveArticleForm = () => {
    if (!articleFormTitle.trim()) {
      showToast('请输入知识条目标题！');
      return;
    }

    if (articleFormRegions.length === 0) {
      showToast('请至少选择一个适用地区/语种！');
      return;
    }

    if (articleFormExpiryType === 'custom') {
      if (!articleFormStartDate) {
        showToast('请选择有效期开始日期！');
        return;
      }
      if (!articleFormEndDate) {
        showToast('请选择有效期结束日期！');
        return;
      }
      if (articleFormEndDate < articleFormStartDate) {
        showToast('有效期结束日期不能小于开始日期！');
        return;
      }
    }

    const tagsArray = articleFormTags
      .split(/[,，\n]/)
      .map((t) => t.trim())
      .filter(Boolean);

    // Compute fileType, size, chunks
    let finalFileType: 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'VIDEO' | 'MD' | 'MANUAL' = 'MD';
    let finalSize = `${(articleFormContent.length * 2 / 1024).toFixed(1)} KB`;
    let finalChunks = Math.max(1, Math.ceil(articleFormContent.length / 150));

    if (articleContentType === 'video') {
      finalFileType = 'VIDEO';
      finalSize = '128.0 MB';
      finalChunks = Math.max(12, Math.ceil((articleFormContent.length + (articleFormVideoTranscript?.length || 0)) / 100));
    } else if (articleContentType === 'document') {
      finalFileType = articleFormDocType;
      finalSize = articleFormDocFile?.size || '6.5 MB';
      finalChunks = Math.max(16, Math.ceil(articleFormContent.length / 120));
    } else {
      finalFileType = 'MD';
    }

    const attachmentPayload = articleContentType === 'document' ? {
      name: articleFormDocFile?.name || `${articleFormTitle}.${articleFormDocType.toLowerCase()}`,
      size: articleFormDocFile?.size || finalSize,
      type: 'document',
      ext: articleFormDocType.toLowerCase()
    } : undefined;

    const videoPayload = articleContentType === 'video' ? {
      url: articleFormVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-with-wooden-furniture-41487-large.mp4',
      duration: articleFormVideoDuration || '08分30秒',
      coverUrl: articleFormVideoCover || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      sourceName: articleFormVideoSourceName || '工厂工艺教学实录',
      transcript: articleFormVideoTranscript || articleFormContent
    } : undefined;

    // Check category review rule
    const targetCatObj = findCategoryByPathOrName(articleFormCategory);

    if (editingArticle) {
      const isPendingEffectiveArticle = Boolean(editingArticle.pendingEffectiveVersion);
      const requiresReview = !isPendingEffectiveArticle && Boolean(
        targetCatObj?.requireReview && (targetCatObj.reviewTriggers?.onEdit !== false)
      );

      const wasAlreadyPublished = Boolean(editingArticle.wasPublished || editingArticle.status === '已发布');

      const nextVer = editingArticle.version.startsWith('v')
        ? `v${(parseFloat(editingArticle.version.slice(1)) + 0.1).toFixed(1)}.0`
        : 'v2.0.0';

      const finalVersion = isPendingEffectiveArticle
        ? editingArticle.version
        : requiresReview
        ? (wasAlreadyPublished ? editingArticle.version : `${nextVer}-rc`)
        : nextVer;

      const pendingVer = isPendingEffectiveArticle
        ? undefined
        : requiresReview && wasAlreadyPublished
        ? `${nextVer}-rc`
        : undefined;
      const finalStatus = isPendingEffectiveArticle
        ? editingArticle.status
        : requiresReview
        ? '等待复核'
        : '已发布';
      const finalWasPublished = wasAlreadyPublished || !requiresReview;

      const auditLog: KBAuditLog = {
        id: `LOG-${Date.now()}`,
        articleId: editingArticle.id,
        operator: 'Sophia (主管)',
        operatorRole: '业务主管',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: isPendingEffectiveArticle ? 'edit' : requiresReview ? 'submit_review' : 'edit',
        actionLabel: isPendingEffectiveArticle
          ? `编辑待生效新版本【${editingArticle.pendingEffectiveVersion}】`
          : requiresReview
          ? (editingArticle.status === '复核不通过' ? '重新编辑并提交复核' : '编辑知识条目并提交复核')
          : '直接更新发布知识条目',
        version: isPendingEffectiveArticle ? (editingArticle.pendingEffectiveVersion || finalVersion) : (pendingVer || finalVersion),
        wasPublished: finalWasPublished,
        diffSummary: isPendingEffectiveArticle
          ? `修改待生效新版条目【${articleFormTitle}】内容与配置（新版本 ${editingArticle.pendingEffectiveVersion} 排期于 ${editingArticle.pendingEffectiveStartDate || '设定日'} 生效）`
          : requiresReview
          ? (wasAlreadyPublished
              ? `修改已发布条目【${articleFormTitle}】，生成新版本 ${pendingVer} 提交平台管理员复核（当前 ${finalVersion} 继续生效）`
              : `修改条目【${articleFormTitle}】（所属分类开启了编辑复核规则），已提交平台管理员复核`)
          : `直接更新知识条目【${articleFormTitle}】`,
        beforeSnapshot: {
          title: editingArticle.title,
          category: editingArticle.category,
          content: editingArticle.content,
          version: editingArticle.version,
          status: editingArticle.status,
          tags: editingArticle.tags
        },
        afterSnapshot: {
          title: articleFormTitle,
          category: articleFormCategory,
          content: articleFormContent,
          version: isPendingEffectiveArticle ? (editingArticle.pendingEffectiveVersion || finalVersion) : (pendingVer || finalVersion),
          status: finalStatus,
          tags: tagsArray
        }
      };

      setContentList((prev) =>
        prev.map((item) =>
          item.id === editingArticle.id
            ? {
                ...item,
                title: articleFormTitle,
                category: articleFormCategory,
                code: editingArticle.code,
                version: finalVersion,
                pendingVersion: pendingVer,
                pendingEffectiveVersion: editingArticle.pendingEffectiveVersion,
                pendingEffectiveStartDate: editingArticle.pendingEffectiveStartDate,
                wasPublished: finalWasPublished,
                status: finalStatus,
                reviewStatus: isPendingEffectiveArticle ? (editingArticle.reviewStatus || 'approved') : requiresReview ? 'pending' : undefined,
                pendingAction: isPendingEffectiveArticle ? undefined : requiresReview ? 'update' : undefined,
                tags: tagsArray,
                contentType: articleContentType,
                fileType: finalFileType,
                fileSize: finalSize,
                chunksCount: finalChunks,
                content: articleFormContent,
                applicableRoles: targetCatObj?.applicableRoles || editingArticle.applicableRoles || ['全员通用'],
                applicableRegions: articleFormRegions,
                securityLevel: editingArticle.securityLevel || '内部',
                expiryType: articleFormExpiryType,
                validityStartDate: articleFormExpiryType === 'custom' ? articleFormStartDate : undefined,
                validityEndDate: articleFormExpiryType === 'custom' ? articleFormEndDate : undefined,
                expiryDate: articleFormExpiryType === 'custom' ? articleFormEndDate : undefined,
                relatedArticleIds: articleFormRelatedIds,
                attachmentFile: attachmentPayload,
                videoInfo: videoPayload,
                updatedAt: new Date().toISOString().split('T')[0],
                auditLogs: [auditLog, ...(item.auditLogs || [])]
              }
            : item
        )
      );

      if (isPendingEffectiveArticle) {
        showToast(`已成功保存待生效条目「${articleFormTitle}」（新版本 ${editingArticle.pendingEffectiveVersion} 将于 ${editingArticle.pendingEffectiveStartDate || '设定日'} 生效）`);
      } else if (requiresReview) {
        showToast(`📝 知识条目「${articleFormTitle}」修改已提交！因所属分类开启了复核，需平台管理员审核通过后正式发布。`);
      } else {
        showToast(`已成功更新知识条目「${articleFormTitle}」`);
      }
    } else {
      // Create new article
      const requiresReview = Boolean(
        targetCatObj?.requireReview && (targetCatObj.reviewTriggers?.onUpload !== false)
      );
      const autoCode = `KB-ART-${Date.now().toString().slice(-6)}`;
      const newId = `KB-${Date.now()}`;

      const auditLog: KBAuditLog = {
        id: `LOG-${Date.now()}`,
        articleId: newId,
        operator: 'Sophia (主管)',
        operatorRole: '业务主管',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: requiresReview ? 'submit_review' : 'create',
        actionLabel: requiresReview ? '新建知识条目并提交复核' : '新建并发布知识条目',
        version: requiresReview ? 'v1.0.0-rc' : 'v1.0.0',
        wasPublished: !requiresReview,
        diffSummary: requiresReview
          ? `新建条目【${articleFormTitle}】（所属分类开启了上传复核规则），已提交平台管理员复核`
          : `新建并发布知识条目【${articleFormTitle}】`,
        afterSnapshot: {
          title: articleFormTitle,
          category: articleFormCategory,
          content: articleFormContent,
          version: requiresReview ? 'v1.0.0-rc' : 'v1.0.0',
          status: requiresReview ? '等待复核' : '已发布',
          tags: tagsArray
        }
      };

      const newArticle: KBArticle = {
        id: newId,
        title: articleFormTitle,
        category: articleFormCategory,
        code: autoCode,
        version: requiresReview ? 'v1.0.0-rc' : 'v1.0.0',
        author: 'Sophia (主管)',
        updatedAt: new Date().toISOString().split('T')[0],
        content: articleFormContent,
        status: requiresReview ? '等待复核' : '已发布',
        reviewStatus: requiresReview ? 'pending' : undefined,
        pendingAction: requiresReview ? 'create' : undefined,
        viewCount: 1,
        contentType: articleContentType,
        fileType: finalFileType,
        fileSize: finalSize,
        chunksCount: finalChunks,
        tags: tagsArray,
        applicableRoles: targetCatObj?.applicableRoles || ['全员通用'],
        applicableRegions: articleFormRegions,
        securityLevel: '内部',
        expiryType: articleFormExpiryType,
        validityStartDate: articleFormExpiryType === 'custom' ? articleFormStartDate : undefined,
        validityEndDate: articleFormExpiryType === 'custom' ? articleFormEndDate : undefined,
        expiryDate: articleFormExpiryType === 'custom' ? articleFormEndDate : undefined,
        relatedArticleIds: articleFormRelatedIds,
        attachmentFile: attachmentPayload,
        videoInfo: videoPayload,
        auditLogs: [auditLog]
      };
      setContentList((prev) => [newArticle, ...prev]);

      if (requiresReview) {
        showToast(`🛡️ 知识条目「${articleFormTitle}」已创建并提交复核（当前分类需管理员审批通过后上线）`);
      } else {
        showToast(`已成功创建「${articleContentType === 'video' ? '视频知识' : articleContentType === 'document' ? '文档知识' : 'Markdown知识'}」并完成配置！`);
      }
    }
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (id: string, title: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const art = contentList.find((c) => c.id === id);
    const targetCatObj = art ? findCategoryByPathOrName(art.category) : null;
    const requiresReview = Boolean(
      targetCatObj?.requireReview && (targetCatObj.reviewTriggers?.onDelete !== false)
    );

    if (requiresReview && art) {
      const auditLog: KBAuditLog = {
        id: `LOG-${Date.now()}`,
        articleId: art.id,
        operator: 'Sophia (业务员)',
        operatorRole: '业务员',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: 'delete_request',
        actionLabel: '申请删除知识条目 (提交复核)',
        version: art.version,
        wasPublished: art.status === '已发布',
        diffSummary: `申请删除知识条目【${title}】，等待平台管理员复核下线`,
        beforeSnapshot: {
          title: art.title,
          category: art.category,
          content: art.content,
          version: art.version,
          status: art.status,
          tags: art.tags
        }
      };

      setContentList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: '等待复核',
                reviewStatus: 'pending',
                pendingAction: 'delete',
                auditLogs: [auditLog, ...(item.auditLogs || [])]
              }
            : item
        )
      );
      showToast(`🛡️ 已提交删除申请！因「${art.category}」配置了删除复核规则，需平台管理员在复核中心确认。`);
    } else {
      setContentList((prev) => prev.filter((item) => item.id !== id));
      setSelectedContentIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast(`已删除「${title}」`);
    }
  };

  const handleRevectorize = (art: KBArticle, e?: React.MouseEvent) => {
    e?.stopPropagation();
    showToast(`正在对「${art.title}」重新生成语义切片与向量索引...`);
    setTimeout(() => {
      showToast(`「${art.title}」向量索引更新完毕，已同步至大模型检索库！`);
    }, 1000);
  };

  const handleOpenMoveCategory = (art: KBArticle, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMoveTargetArticle(art);
    setTargetCategoryPath(art.category);
  };

  const handleConfirmMoveCategory = () => {
    if (!moveTargetArticle || !targetCategoryPath) return;
    setContentList((prev) =>
      prev.map((item) =>
        item.id === moveTargetArticle.id ? { ...item, category: targetCategoryPath } : item
      )
    );
    showToast(`已将「${moveTargetArticle.title}」移动至「${targetCategoryPath}」`);
    setMoveTargetArticle(null);
  };

  // Batch Operations
  const handleToggleSelectAll = () => {
    const isAllPageSelected =
      paginatedContentList.length > 0 &&
      paginatedContentList.every((item) => selectedContentIds.has(item.id));
    if (isAllPageSelected) {
      setSelectedContentIds((prev) => {
        const next = new Set(prev);
        paginatedContentList.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      setSelectedContentIds((prev) => {
        const next = new Set(prev);
        paginatedContentList.forEach((item) => next.add(item.id));
        return next;
      });
    }
  };

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedContentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBatchDelete = () => {
    if (selectedContentIds.size === 0) return;
    const count = selectedContentIds.size;
    setContentList((prev) => prev.filter((item) => !selectedContentIds.has(item.id)));
    setSelectedContentIds(new Set());
    showToast(`已批量删除 ${count} 条知识库内容！`);
  };

  const handleBatchRevectorize = () => {
    if (selectedContentIds.size === 0) return;
    const count = selectedContentIds.size;
    showToast(`已触发 ${count} 个条目的批量重新切片与向量库重构...`);
  };

  // Upload Simulation
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      const targetCat = uploadCategory || (selectedCategoryFilter ? selectedCategoryFilter : '产品与技术百科 / 产品百科 / 按单品 / 柜类');
      const targetCatObj = findCategoryByPathOrName(targetCat);
      const requiresReview = Boolean(
        targetCatObj?.requireReview && (targetCatObj.reviewTriggers?.onUpload !== false)
      );

      const newArticles: KBArticle[] = Array.from(files).map((f, idx) => {
        const ext = f.name.split('.').pop()?.toUpperCase() || 'FILE';
        const cleanTitle = f.name.replace(/\.[^/.]+$/, '');
        const fileType: 'PDF' | 'DOCX' | 'XLSX' | 'MD' | 'MANUAL' =
          ext === 'PDF' ? 'PDF' : ext === 'DOCX' || ext === 'DOC' ? 'DOCX' : ext === 'XLSX' || ext === 'XLS' ? 'XLSX' : 'MD';
        const newArtId = `KB-UPLOAD-${Date.now()}-${idx}`;
        const autoCode = `KB-DOC-${Date.now().toString().slice(-4)}-${idx + 1}`;
        const autoVersion = requiresReview ? 'v1.0.0-rc' : 'v1.0.0';

        const auditLog: KBAuditLog = {
          id: `LOG-UP-${Date.now()}-${idx}`,
          articleId: newArtId,
          operator: 'Sophia (主管)',
          operatorRole: '业务录入员',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: requiresReview ? 'submit_review' : 'create',
          actionLabel: requiresReview ? '批量上传文档并提交复核' : '批量上传并发布文档',
          version: autoVersion,
          wasPublished: !requiresReview,
          diffSummary: requiresReview
            ? `批量上传知识《${cleanTitle}》（所属分类开启了上传复核规则），已提交平台管理员复核`
            : `批量上传并发布知识《${cleanTitle}》`,
          afterSnapshot: {
            title: cleanTitle,
            category: targetCat,
            content: `【文件提取内容】：已对文档《${f.name}》完成 OCR 与高精度版面分析，共提取语义段落。`,
            version: autoVersion,
            status: requiresReview ? '等待复核' : '已发布',
            tags: ['批量上传', ext, '最新向量化']
          }
        };

        return {
          id: newArtId,
          title: cleanTitle,
          category: targetCat,
          code: autoCode,
          version: autoVersion,
          author: 'Sophia (主管)',
          updatedAt: new Date().toISOString().split('T')[0],
          content: `【文件提取内容】：已对文档《${f.name}》完成 OCR 与高精度版面分析，共提取语义段落。支持智能体在全屋定制业务对话中根据关键词自动召回本知识分段。`,
          status: requiresReview ? '等待复核' : '已发布',
          reviewStatus: requiresReview ? 'pending' : undefined,
          pendingAction: requiresReview ? 'create' : undefined,
          viewCount: 1,
          fileType,
          fileSize: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          chunksCount: Math.floor(Math.random() * 60) + 30,
          tags: ['批量上传', ext, '最新向量化'],
          auditLogs: [auditLog]
        };
      });

      setContentList((prev) => [...newArticles, ...prev]);
      setIsUploading(false);
      setIsUploadModalOpen(false);
      if (requiresReview) {
        showToast(`🛡️ 已上传 ${newArticles.length} 篇文档！因「${targetCat}」开启了复核，已提交平台管理员审批。`);
      } else {
        showToast(`已成功上传 ${newArticles.length} 篇知识文档并完成向量嵌入！`);
      }
    }, 1200);
  };

  // ==========================================
  // Category Management Handlers (for 分类管理 View)
  // ==========================================
  const handleOpenAddCatModal = (parentNode: KBCategory | null, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalParentNode(parentNode);
    setNewCatName('');
    setNewCatCode(parentNode ? `${parentNode.code}-SUB` : 'KB-CAT-NEW');
    setNewCatManagementDept(parentNode?.managementDept || '产品中心');
    setIsNewCatManagementDropdownOpen(false);
    setNewCatViewableDepts(
      parentNode?.viewableDepts && parentNode.viewableDepts.length > 0
        ? [...parentNode.viewableDepts]
        : (parentNode?.applicableRoles && parentNode.applicableRoles.length > 0 ? [...parentNode.applicableRoles] : ['全公司/全员'])
    );
    setIsNewCatViewableDropdownOpen(false);
    setNewCatCustomViewableDeptInput('');
    setNewCatRequireReview(false);
    setNewCatReviewTriggers({ onUpload: true, onEdit: true, onDelete: true });
    setIsAddCatModalOpen(true);
  };

  const handleConfirmAddCat = () => {
    if (!newCatName.trim()) {
      showToast('请输入分类名称！');
      return;
    }

    const newNode: KBCategory = {
      id: `CAT-CUSTOM-${Date.now()}`,
      name: newCatName.trim(),
      code: newCatCode.trim() || `KB-CAT-${Date.now().toString().slice(-4)}`,
      managementDept: newCatManagementDept || '产品中心',
      viewableDepts: newCatViewableDepts.length > 0 ? newCatViewableDepts : ['全公司/全员'],
      applicableRoles: newCatViewableDepts.length > 0 ? newCatViewableDepts : ['全公司/全员'],
      itemCount: 0,
      isBuiltin: false,
      requireReview: newCatRequireReview,
      reviewTriggers: newCatRequireReview ? newCatReviewTriggers : undefined,
      children: []
    };

    const addNodeRecursive = (list: KBCategory[], parentId: string | null): KBCategory[] => {
      if (!parentId) {
        return [...list, newNode];
      }
      return list.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: item.children ? [...item.children, newNode] : [newNode]
          };
        }
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: addNodeRecursive(item.children, parentId)
          };
        }
        return item;
      });
    };

    setCategoryList((prev) => addNodeRecursive(prev, modalParentNode ? modalParentNode.id : null));
    if (modalParentNode) {
      setExpandedNodeIds((prev) => new Set(prev).add(modalParentNode.id));
    }
    setIsAddCatModalOpen(false);
    showToast(`分类「${newNode.name}」添加成功！${newCatRequireReview ? '（已开启管理员复核机制）' : ''}`);
  };

  const handleOpenEditCatModal = (node: KBCategory, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingCatNode(node);
    setEditCatName(node.name);
    setEditCatCode(node.code);
    setEditCatManagementDept(node.managementDept || '产品中心');
    setIsEditCatManagementDropdownOpen(false);
    setEditCatViewableDepts(
      node.viewableDepts && node.viewableDepts.length > 0
        ? [...node.viewableDepts]
        : (node.applicableRoles && node.applicableRoles.length > 0 ? [...node.applicableRoles] : ['全公司/全员'])
    );
    setIsEditCatViewableDropdownOpen(false);
    setEditCatCustomViewableDeptInput('');
    setEditCatRequireReview(Boolean(node.requireReview));
    setEditCatReviewTriggers({
      onUpload: node.reviewTriggers?.onUpload ?? true,
      onEdit: node.reviewTriggers?.onEdit ?? true,
      onDelete: node.reviewTriggers?.onDelete ?? true,
    });
    setIsEditCatModalOpen(true);
  };

  const handleConfirmEditCat = () => {
    if (!editingCatNode || !editCatName.trim()) return;

    const updateRecursive = (list: KBCategory[]): KBCategory[] => {
      return list.map((item) => {
        if (item.id === editingCatNode.id) {
          return {
            ...item,
            name: editCatName.trim(),
            code: editCatCode.trim() || item.code,
            managementDept: editCatManagementDept || '产品中心',
            viewableDepts: editCatViewableDepts.length > 0 ? editCatViewableDepts : ['全公司/全员'],
            applicableRoles: editCatViewableDepts.length > 0 ? editCatViewableDepts : ['全公司/全员'],
            requireReview: editCatRequireReview,
            reviewTriggers: editCatRequireReview ? editCatReviewTriggers : undefined
          };
        }
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: updateRecursive(item.children)
          };
        }
        return item;
      });
    };

    setCategoryList((prev) => updateRecursive(prev));
    setIsEditCatModalOpen(false);
    showToast(`分类「${editCatName}」修改成功！`);
  };

  const handleDeleteCatNode = (id: string, name: string, isBuiltin?: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isBuiltin) {
      showToast('系统内置核心分类受系统基础逻辑保护不可删除！');
      return;
    }

    const deleteRecursive = (list: KBCategory[]): KBCategory[] => {
      return list
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.children && item.children.length > 0) {
            return {
              ...item,
              children: deleteRecursive(item.children)
            };
          }
          return item;
        });
    };

    setCategoryList((prev) => deleteRecursive(prev));
    if (selectedCategoryFilter === name) {
      setSelectedCategoryFilter(null);
    }
    showToast(`分类「${name}」已删除！`);
  };

  const handleMoveCatNode = (id: string, direction: 'up' | 'down', _isBuiltin?: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const moveInArray = (arr: KBCategory[]): KBCategory[] => {
      const index = arr.findIndex((item) => item.id === id);
      if (index !== -1) {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= arr.length) return arr;
        const newArr = [...arr];
        const [moved] = newArr.splice(index, 1);
        newArr.splice(targetIndex, 0, moved);
        return newArr;
      }
      return arr.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: moveInArray(item.children)
          };
        }
        return item;
      });
    };

    setCategoryList((prev) => moveInArray(prev));
    showToast(`已${direction === 'up' ? '上移' : '下移'}同级分类`);
  };

  // 分类管理同级上下拖拽排序交互处理
  const handleCatDragStart = (node: KBCategory, parentId: string | null, e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedCatInfo({ id: node.id, name: node.name, parentId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleCatDragOver = (node: KBCategory, parentId: string | null, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedCatInfo) return;

    // 仅允许在同级节点之间上下拖动排序
    if (draggedCatInfo.parentId !== parentId || draggedCatInfo.id === node.id) {
      e.dataTransfer.dropEffect = 'none';
      if (dragOverCatInfo) setDragOverCatInfo(null);
      return;
    }

    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const position = offsetY < rect.height / 2 ? 'before' : 'after';

    if (!dragOverCatInfo || dragOverCatInfo.id !== node.id || dragOverCatInfo.position !== position) {
      setDragOverCatInfo({ id: node.id, position });
    }
  };

  const handleCatDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
  };

  const handleCatDragEnd = () => {
    setDraggedCatInfo(null);
    setDragOverCatInfo(null);
  };

  const handleCatDrop = (targetNode: KBCategory, parentId: string | null, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedCatInfo || !dragOverCatInfo) {
      handleCatDragEnd();
      return;
    }
    if (draggedCatInfo.parentId !== parentId || draggedCatInfo.id === targetNode.id) {
      handleCatDragEnd();
      return;
    }

    const { position } = dragOverCatInfo;
    const draggedId = draggedCatInfo.id;
    const targetId = targetNode.id;

    const reorderList = (list: KBCategory[]): KBCategory[] => {
      if (parentId === null) {
        const fromIdx = list.findIndex((c) => c.id === draggedId);
        const toIdx = list.findIndex((c) => c.id === targetId);
        if (fromIdx === -1 || toIdx === -1) return list;
        const copy = [...list];
        const [moved] = copy.splice(fromIdx, 1);
        let insertIdx = copy.findIndex((c) => c.id === targetId);
        if (position === 'after') {
          insertIdx += 1;
        }
        copy.splice(insertIdx, 0, moved);
        return copy;
      }

      return list.map((item) => {
        if (item.id === parentId && item.children) {
          const fromIdx = item.children.findIndex((c) => c.id === draggedId);
          const toIdx = item.children.findIndex((c) => c.id === targetId);
          if (fromIdx === -1 || toIdx === -1) return item;
          const newChildren = [...item.children];
          const [moved] = newChildren.splice(fromIdx, 1);
          let insertIdx = newChildren.findIndex((c) => c.id === targetId);
          if (position === 'after') {
            insertIdx += 1;
          }
          newChildren.splice(insertIdx, 0, moved);
          return { ...item, children: newChildren };
        }
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: reorderList(item.children)
          };
        }
        return item;
      });
    };

    setCategoryList((prev) => reorderList(prev));
    showToast(`已成功将「${draggedCatInfo.name}」拖动完成同级排序！`);
    handleCatDragEnd();
  };

  // Render left sidebar category tree row (for Content Upload view)
  const renderSidebarTreeRow = (node: KBCategory, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isSelected = selectedCategoryFilter === node.name;

    // Filter by tree search
    if (treeSearchQuery.trim()) {
      const match = node.name.toLowerCase().includes(treeSearchQuery.toLowerCase()) ||
        node.code.toLowerCase().includes(treeSearchQuery.toLowerCase());
      const childMatch = node.children?.some(c => c.name.toLowerCase().includes(treeSearchQuery.toLowerCase()));
      if (!match && !childMatch) return null;
    }

    // Count direct articles in this category
    const directCount = contentList.filter(c => c.category.includes(node.name)).length;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => setSelectedCategoryFilter(isSelected ? null : node.name)}
          className={`flex items-center justify-between py-1.5 px-2 rounded-xl text-xs cursor-pointer transition-all ${
            isSelected
              ? 'bg-[#EA3A20]/10 text-[#EA3A20] font-bold shadow-2xs'
              : 'hover:bg-slate-100/80 text-slate-700 font-medium'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleNodeExpand(node.id, e)}
                className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}

            {hasChildren && isExpanded ? (
              <FolderOpen className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#EA3A20]' : 'text-amber-500'}`} />
            ) : (
              <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#EA3A20]' : 'text-amber-500'}`} />
            )}

            <span className="truncate text-[12px]">{node.name}</span>
          </div>

          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md shrink-0 ml-1 ${
              isSelected
                ? 'bg-[#EA3A20] text-white font-bold'
                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
            }`}
          >
            {directCount || node.itemCount || 0}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {node.children!.map((child) => renderSidebarTreeRow(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render Category Table Row (for 分类管理 View)
  const renderCategoryTableRow = (node: KBCategory, depth = 0, parentId: string | null = null) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isBuiltin = node.isBuiltin;

    const isBeingDragged = draggedCatInfo?.id === node.id;
    const isDragOver = dragOverCatInfo?.id === node.id;
    const isDropBefore = isDragOver && dragOverCatInfo.position === 'before';
    const isDropAfter = isDragOver && dragOverCatInfo.position === 'after';

    return (
      <React.Fragment key={node.id}>
        <div
          onDragOver={(e) => handleCatDragOver(node, parentId, e)}
          onDragLeave={handleCatDragLeave}
          onDrop={(e) => handleCatDrop(node, parentId, e)}
          onDragEnd={handleCatDragEnd}
          className={`group relative flex items-center justify-between py-2 px-3 hover:bg-slate-50 transition-all border-b border-slate-100/70 text-xs select-none ${
            isBeingDragged ? 'opacity-40 bg-slate-100' : ''
          } ${isDropBefore ? 'border-t-2 !border-t-[#EA3A20] bg-red-50/20' : ''} ${
            isDropAfter ? 'border-b-2 !border-b-[#EA3A20] bg-red-50/20' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          {/* Left: Drag Handle, Expand/Collapse & Name */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {/* Drag Handle for Same-Level Reordering */}
            <div
              draggable={true}
              onDragStart={(e) => handleCatDragStart(node, parentId, e)}
              title="按住上下拖动，在同级分类中排序"
              className="p-1 -ml-1 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing rounded hover:bg-slate-200/60 transition-colors shrink-0 flex items-center justify-center"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleNodeExpand(node.id, e)}
                className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}

            {hasChildren && isExpanded ? (
              <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-500 shrink-0" />
            )}

            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-slate-800 truncate">{node.name}</span>
              {isBuiltin && (
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded font-medium shrink-0">
                  内置
                </span>
              )}
              {node.requireReview && (
                <span
                  title={`需复核: ${[
                    node.reviewTriggers?.onUpload !== false ? '上传' : '',
                    node.reviewTriggers?.onEdit !== false ? '编辑' : '',
                    node.reviewTriggers?.onDelete !== false ? '删除' : ''
                  ].filter(Boolean).join(' / ')}`}
                  className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded font-medium shrink-0 flex items-center gap-1"
                >
                  <ShieldCheck className="w-2.5 h-2.5 text-amber-600" />
                  需复核
                </span>
              )}
            </div>
          </div>

          {/* Right: Management Dept, Viewable Depts (with view-all popover), Code, Count & CRUD Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* 知识库管理部门 (普通文字展示) */}
            <span
              className="text-xs text-slate-600 shrink-0 w-28 truncate hidden sm:inline-block"
              title={`管理部门：${node.managementDept || '产品中心'}`}
            >
              {node.managementDept || '产品中心'}
            </span>

            {/* 可查看部门展示区（多选，可点击展开查看全部） */}
            <div className="relative hidden lg:block">
              {(() => {
                const depts = (node.viewableDepts && node.viewableDepts.length > 0)
                  ? node.viewableDepts
                  : (node.applicableRoles && node.applicableRoles.length > 0 ? node.applicableRoles : ['全公司/全员']);
                return (
                  <>
                    <div
                      onClick={(e) => {
                        if (depts && depts.length > 0) {
                          e.stopPropagation();
                          setActiveDeptsPopoverNode(activeDeptsPopoverNode?.id === node.id ? null : node);
                        }
                      }}
                      title={`可查看部门：${depts.join('、')}（点击查看全部）`}
                      className="flex items-center gap-1 w-44 overflow-hidden text-ellipsis flex-wrap cursor-pointer group/depts py-0.5 rounded-lg hover:bg-slate-100/70 transition-colors"
                    >
                      {depts.slice(0, 2).map((dept) => (
                        <span
                          key={dept}
                          className="text-[10px] text-blue-700 bg-blue-50 group-hover/depts:bg-blue-100/70 border border-blue-200/70 px-1.5 py-0.5 rounded font-medium shrink-0 transition-colors"
                        >
                          {dept}
                        </span>
                      ))}
                      {depts.length > 2 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDeptsPopoverNode(activeDeptsPopoverNode?.id === node.id ? null : node);
                          }}
                          className="text-[9px] text-[#EA3A20] bg-red-50 hover:bg-red-100 border border-red-200/80 px-1.5 py-0.5 rounded font-bold transition-colors shrink-0 shadow-2xs cursor-pointer flex items-center gap-0.5"
                        >
                          +{depts.length - 2}
                        </button>
                      )}
                    </div>

                    {/* Popover Card for Viewing All Viewable Depts */}
                    {activeDeptsPopoverNode?.id === node.id && (
                      <div
                        className="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3.5 min-w-[260px] max-w-[340px] animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#EA3A20]" />
                            <span className="text-xs font-bold text-slate-800">
                              【{node.name}】可查看部门
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-medium">
                              共 {depts.length} 个
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDeptsPopoverNode(null);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-0.5 custom-scrollbar">
                          {depts.map((dept) => (
                            <span
                              key={dept}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200/70 rounded-lg text-xs font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {dept}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">分类下知识继承此部门查看权限</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDeptsPopoverNode(null);
                              handleOpenEditCatModal(node, e);
                            }}
                            className="text-[#EA3A20] hover:underline font-bold cursor-pointer"
                          >
                            去编辑
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <span className="font-mono text-[11px] text-slate-400 hidden sm:inline-block w-28 truncate">
              {node.code}
            </span>

            <span className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md min-w-14 text-center">
              {contentList.filter(c => c.category.includes(node.name)).length || node.itemCount || 0} 篇
            </span>

            {/* 操作按钮区：新增、编辑、同级上下移、删除 */}
            <div className="flex items-center gap-0.5 w-28 justify-end">
              <button
                type="button"
                onClick={(e) => handleOpenAddCatModal(node, e)}
                title="添加子分类"
                className="p-1 rounded text-slate-400 hover:text-[#EA3A20] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* 编辑分类操作（所有分类均可编辑） */}
              <button
                type="button"
                onClick={(e) => handleOpenEditCatModal(node, e)}
                title="编辑分类"
                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {!isBuiltin ? (
                <button
                  type="button"
                  onClick={(e) => handleDeleteCatNode(node.id, node.name, node.isBuiltin, e)}
                  title="删除分类"
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span
                  title="系统内置核心分类受保护不可删除（支持编辑与拖拽排序）"
                  className="p-1 text-slate-300 flex items-center justify-center cursor-not-allowed"
                >
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children!.map((child) => renderCategoryTableRow(child, depth + 1, node.id))}</div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-4 lg:px-6 pb-6 pt-1">
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-10 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#EA3A20]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Action Bar */}
      <div className="flex items-center justify-between py-1 mb-2 shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h1 className="text-sm font-black text-slate-900 shrink-0">
            {currentView === '分类管理'
              ? '知识库分类管理'
              : currentView === '标签管理'
              ? '知识库标签管理'
              : currentView === '知识复核'
              ? '知识复核中心'
              : '知识库内容管理'}
          </h1>
          {currentView === '知识复核' ? (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>审批工作流 · {contentList.filter(a => a.status === '等待复核').length} 条待复核</span>
            </span>
          ) : currentView === '分类管理' ? (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md shrink-0">
              共 {totalNodes} 个分类 · {totalItems} 条知识
            </span>
          ) : currentView === '标签管理' ? (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md shrink-0">
              共 {tagList.length} 个标签
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md shrink-0">
              共 {contentList.length} 篇知识条目
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {currentView === '分类管理' && (
            <>
              <div className="relative w-48 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索分类名称或编码..."
                  value={treeSearchQuery}
                  onChange={(e) => setTreeSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] shadow-2xs"
                />
                {treeSearchQuery && (
                  <button
                    onClick={() => setTreeSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={expandAllNodes}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium cursor-pointer transition-colors shrink-0"
              >
                全部展开
              </button>
              <button
                onClick={collapseAllNodes}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium cursor-pointer transition-colors shrink-0"
              >
                全部折叠
              </button>

              <button
                onClick={() => handleOpenAddCatModal(null)}
                className="h-8 px-4 rounded-full bg-[#EA3A20] text-white hover:bg-[#c42810] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增顶级分类</span>
              </button>
            </>
          )}

          {currentView === '标签管理' && (
            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索标签名称或标签值..."
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  className="w-full pl-8.5 pr-7 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] shadow-2xs"
                />
                {tagSearchQuery && (
                  <button
                    onClick={() => setTagSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsBatchAddTagModalOpen(true)}
                className="h-8 px-3.5 rounded-full bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0 active:scale-95"
                title="批量导入标签"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span>批量导入</span>
              </button>

              <button
                onClick={handleOpenAddTagModal}
                className="h-8 px-3.5 rounded-full bg-[#EA3A20] text-white hover:bg-[#c42810] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建标签</span>
              </button>
            </div>
          )}

          {currentView === '内容上传' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreateArticle}
                className="h-8.5 px-3.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#EA3A20]" />
                <span>新建知识</span>
              </button>
              <button
                onClick={() => {
                  setUploadCategory(selectedCategoryFilter || allCategoryPaths[0]?.fullPath || '产品与技术百科 / 产品百科 / 按单品 / 柜类');
                  setIsUploadModalOpen(true);
                }}
                className="h-8.5 px-4 rounded-full bg-[#EA3A20] text-white hover:bg-[#c42810] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>上传文档</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* ========================================================================= */}
        {/* TAB 1: 知识库内容上传与管理 (Two-Part Split View: Category Tree + Content List) */}
        {/* ========================================================================= */}
        {currentView === '内容上传' && (
          <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
            {/* ----------------------------------------------------------------------- */}
            {/* PART 1 (LEFT): 知识库分类层级 (Category Hierarchy Tree) */}
            {/* ----------------------------------------------------------------------- */}
            <div className="w-64 sm:w-72 lg:w-80 shrink-0 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              {/* Left Header */}
              <div className="p-3.5 border-b border-slate-100 space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-[#EA3A20]" />
                    <span className="text-xs font-bold text-slate-900">知识库分类层级</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {totalNodes} 个节点
                  </span>
                </div>

                {/* Quick Search */}
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="筛选层级..."
                    value={treeSearchQuery}
                    onChange={(e) => setTreeSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-6 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                  />
                  {treeSearchQuery && (
                    <button
                      onClick={() => setTreeSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Tree Scrollable List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                {/* All Categories Option */}
                <div
                  onClick={() => setSelectedCategoryFilter(null)}
                  className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    selectedCategoryFilter === null
                      ? 'bg-[#EA3A20]/10 text-[#EA3A20] font-bold shadow-2xs'
                      : 'hover:bg-slate-100/80 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className={`w-3.5 h-3.5 ${selectedCategoryFilter === null ? 'text-[#EA3A20]' : 'text-slate-500'}`} />
                    <span>全部知识分类</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      selectedCategoryFilter === null
                        ? 'bg-[#EA3A20] text-white font-bold'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {contentList.length}
                  </span>
                </div>

                <div className="my-1 border-t border-slate-100/80" />

                {categoryList.map((node) => renderSidebarTreeRow(node, 0))}
              </div>

              {/* Left Footer Info */}
              {selectedCategoryFilter && (
                <div className="p-2 px-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
                  <span className="truncate">已筛选：{selectedCategoryFilter}</span>
                  <button
                    onClick={() => setSelectedCategoryFilter(null)}
                    className="text-[#EA3A20] hover:underline cursor-pointer font-medium shrink-0 ml-2"
                  >
                    清除
                  </button>
                </div>
              )}
            </div>

            {/* ----------------------------------------------------------------------- */}
            {/* PART 2 (RIGHT): 层级对应的内容列表 & 内容管理操作 */}
            {/* ----------------------------------------------------------------------- */}
            <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
              {/* Right Header & Filters */}
              <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Selected Breadcrumb */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-slate-400 shrink-0">当前层级：</span>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {selectedCategoryFilter || '全部分类知识库'}
                      </span>
                      <span className="text-[10px] font-mono text-[#EA3A20] font-bold bg-red-50 border border-red-100 px-2 py-0.5 rounded-full shrink-0">
                        {filteredContentList.length} 篇
                      </span>
                    </div>
                  </div>

                  {/* Filter Pills & Search */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Content Type Filter */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
                      <button
                        onClick={() => setContentTypeFilter('all')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          contentTypeFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                        }`}
                      >
                        全部
                      </button>
                      <button
                        onClick={() => setContentTypeFilter('markdown')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                          contentTypeFilter === 'markdown' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                        }`}
                      >
                        <FileCode className="w-3 h-3 text-amber-600" />
                        <span>文本</span>
                      </button>
                      <button
                        onClick={() => setContentTypeFilter('document')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                          contentTypeFilter === 'document' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                        }`}
                      >
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span>文档</span>
                      </button>
                      <button
                        onClick={() => setContentTypeFilter('video')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                          contentTypeFilter === 'video' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                        }`}
                      >
                        <Video className="w-3 h-3 text-purple-600" />
                        <span>视频</span>
                      </button>
                    </div>

                    {/* Search in Content */}
                    <div className="relative w-48 sm:w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="搜索标题/编码/关键词..."
                        value={contentSearchQuery}
                        onChange={(e) => setContentSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                      />
                      {contentSearchQuery && (
                        <button
                          onClick={() => setContentSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Batch Action Bar (Visible when rows selected) */}
                {selectedContentIds.size > 0 && (
                  <div className="p-2 px-3 bg-red-50/70 border border-[#EA3A20]/20 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <CheckSquare className="w-4 h-4 text-[#EA3A20]" />
                      <span>已选中 {selectedContentIds.size} 项知识条目</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBatchRevectorize}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>重新向量化</span>
                      </button>
                      <button
                        onClick={handleBatchDelete}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>批量删除</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Table Column Headers */}
              <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 shrink-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={handleToggleSelectAll}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {paginatedContentList.length > 0 &&
                    paginatedContentList.every((item) => selectedContentIds.has(item.id)) ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#EA3A20]" />
                    ) : (
                      <Square className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span>知识条目标题</span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden md:inline-block w-28 text-left">归属分类</span>
                  <span className="hidden lg:inline-block w-24 text-left">切片</span>
                  <span className="hidden sm:inline-block w-44 xl:w-48 text-left">版本/更新</span>
                  <span className="w-32 text-right">操作</span>
                </div>
              </div>

              {/* Scrollable Content Items Table */}
              <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                {filteredContentList.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                    <FileText className="w-8 h-8 text-slate-300 stroke-1" />
                    <p>该分类下暂无知识内容或未匹配到搜索结果</p>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleOpenCreateArticle}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                      >
                        新建条目
                      </button>
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-3 py-1.5 rounded-full bg-[#EA3A20] hover:bg-[#c42810] text-white font-bold cursor-pointer"
                      >
                        上传文档
                      </button>
                    </div>
                  </div>
                ) : (
                  paginatedContentList.map((item) => {
                    const isSelected = selectedContentIds.has(item.id);
                    // Version & Review status logic
                    const isExpired = item.status === '失效' || (item.expiryType === 'custom' && Boolean(item.validityEndDate || item.expiryDate) && (item.validityEndDate || item.expiryDate)! < '2026-08-26');
                    const hasPublished = Boolean(item.wasPublished || item.status === '已发布');
                    const hasPendingReview = Boolean(item.pendingVersion || (item.status === '等待复核' && item.wasPublished));
                    const hasRejectedReview = Boolean(item.rejectedVersion || (item.status === '复核不通过' && item.wasPublished));
                    const hasPendingEffective = Boolean(item.pendingEffectiveVersion);
                    const isReviewLock = !item.wasPublished && item.status === '等待复核';
                    const isRejectedNeverPub = !item.wasPublished && item.status === '复核不通过';
                    const isDraft = item.status === '草稿';

                    return (
                      <div
                        key={item.id}
                        onClick={() => setPreviewArticle(item)}
                        className={`px-4 py-3 flex items-center justify-between gap-4 text-xs transition-colors cursor-pointer group ${
                          isSelected ? 'bg-red-50/30' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Title & File Type */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={(e) => handleToggleSelectOne(item.id, e)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-3.5 h-3.5 text-[#EA3A20]" />
                            ) : (
                              <Square className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            item.fileType === 'VIDEO' || item.contentType === 'video'
                              ? 'bg-purple-50 text-purple-600'
                              : item.fileType === 'PPTX'
                              ? 'bg-amber-50 text-amber-600'
                              : item.fileType === 'DOCX'
                              ? 'bg-blue-50 text-blue-600'
                              : item.fileType === 'PDF'
                              ? 'bg-red-50 text-red-500'
                              : item.fileType === 'XLSX'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.fileType === 'VIDEO' || item.contentType === 'video' ? (
                              <Video className="w-4 h-4" />
                            ) : item.fileType === 'PPTX' ? (
                              <Presentation className="w-4 h-4" />
                            ) : item.fileType === 'PDF' ? (
                              <FileText className="w-4 h-4" />
                            ) : item.fileType === 'DOCX' ? (
                              <FileText className="w-4 h-4" />
                            ) : item.fileType === 'XLSX' ? (
                              <FileSpreadsheet className="w-4 h-4" />
                            ) : (
                              <FileCode className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <p
                              onMouseEnter={(e) => {
                                const el = e.currentTarget;
                                // Only trigger floating tooltip if text is actually truncated/overflowed
                                if (el.scrollWidth > el.clientWidth + 1) {
                                  const rect = el.getBoundingClientRect();
                                  setHoveredTitle({
                                    id: item.id,
                                    title: item.title,
                                    rect: {
                                      top: rect.top,
                                      left: rect.left,
                                      width: rect.width,
                                      height: rect.height
                                    }
                                  });
                                }
                              }}
                              onMouseLeave={() => setHoveredTitle(null)}
                              className="font-bold text-slate-800 truncate group-hover:text-[#EA3A20] transition-colors"
                            >
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="font-mono">{item.code}</span>
                              {item.fileSize && (
                                <>
                                  <span>•</span>
                                  <span>{item.fileSize}</span>
                                </>
                              )}
                              <span className="md:hidden">• {item.category}</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle Columns */}
                        <div className="flex items-center gap-4 shrink-0">
                          {/* Category Column */}
                          <div className="hidden md:block w-28 truncate text-[11px] text-slate-500 font-medium">
                            <span className="truncate block" title={item.category}>
                              {item.category.split('/').pop()?.trim() || item.category}
                            </span>
                          </div>

                          {/* Chunks Column */}
                          <div className="hidden lg:block w-24">
                            <span className="text-[11px] font-mono text-slate-600 block">
                              {item.chunksCount || 24} 个切片
                            </span>
                          </div>

                          {/* Version & Date Column */}
                          <div className="hidden sm:flex flex-col items-start justify-center w-44 xl:w-48 min-w-0">
                            {isExpired ? (
                              hasPendingReview ? (
                                // 情况 A: 已过有效期 + 新版复核审批中
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-400 line-through font-mono text-[11px] font-medium shadow-2xs">
                                      {item.version}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-medium shadow-2xs" title="原版本已过有效期">
                                      已过有效期
                                    </span>
                                  </div>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold shadow-2xs">
                                    <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                    <span className="whitespace-nowrap">新版 {item.pendingVersion || '审核中'}(审批中)</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              ) : hasRejectedReview ? (
                                // 情况 B: 已过有效期 + 新版复核不通过 (符合用户截图样式)
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  {/* Row 1: Baseline Version Badge + Expired Badge */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-400 line-through font-mono text-[11px] font-medium shadow-2xs">
                                      {item.version}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-medium shadow-2xs">
                                      已过期
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRejectionDetailArticle(item);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                                    title="查看驳回原因并重新提交"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span>新版 {item.rejectedVersion || 'v1.1.0'} 驳回 (查看原因)</span>
                                  </button>
                                </div>
                              ) : hasPendingEffective ? (
                                // 情况 C: 已过有效期 + 新版过审排期待生效
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-400 line-through font-mono text-[11px] font-medium shadow-2xs">
                                      {item.version}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-medium shadow-2xs" title="原版本已过有效期">
                                      已过有效期
                                    </span>
                                  </div>
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold shadow-2xs"
                                    title={`新版本 ${item.pendingEffectiveVersion} 已复核通过，将于 ${item.pendingEffectiveStartDate || '排期日期'} 自动生效上线`}
                                  >
                                    <CalendarClock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    <span className="whitespace-nowrap">新版 {item.pendingEffectiveVersion}(待生效{item.pendingEffectiveStartDate ? `:${item.pendingEffectiveStartDate.slice(5)}` : ''})</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              ) : (
                                // 情况 D: 已过有效期，无新版本
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-400 line-through font-mono text-[11px] font-medium shadow-2xs">
                                      {item.version}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-medium shadow-2xs" title="该条目历史复核通过并曾正式发布，现已过有效期且暂无新版">
                                      已过有效期
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              )
                            ) : !hasPublished ? (
                              // 没有发布过历史版本
                              isDraft ? (
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">{item.version}</span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                                      <FileText className="w-3 h-3 text-slate-500" />
                                      <span>草稿</span>
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              ) : isReviewLock ? (
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">{item.version}</span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                                      <Clock className="w-3 h-3 text-blue-600" />
                                      <span>复核审批中</span>
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              ) : isRejectedNeverPub ? (
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  {/* Initial Version Badge */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                                      {item.version}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRejectionDetailArticle(item);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                                    title="查看驳回原因并重新提交"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span>新版 {item.rejectedVersion || item.version} 驳回 (查看原因)</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-start gap-0.5">
                                  <span className="text-[10px] font-mono text-slate-600">{item.version}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              )
                            ) : (
                              // 已经有历史发布版本且处于有效期限内
                              hasPendingReview ? (
                                // 情况 2: 已有发布的版本，新版本复核审批中
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">{item.version}</span>
                                    <span className="px-2 py-0.5 rounded-md border border-emerald-200/80 bg-emerald-50 text-emerald-700 text-[10px] font-medium shadow-2xs">
                                      生效中
                                    </span>
                                  </div>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold shadow-2xs">
                                    <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                    <span className="whitespace-nowrap">新版 {item.pendingVersion || '审核中'}(审批中)</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              ) : hasRejectedReview ? (
                                // 情况 1: 已有发布的版本，但是新的版本复核不通过 (符合用户截图样式)
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  {/* Row 1: Baseline Version Badge + Active Badge */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                                      {item.version}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md border border-emerald-200/80 bg-emerald-50 text-emerald-700 text-[10px] font-medium shadow-2xs">
                                      生效中
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRejectionDetailArticle(item);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                                    title="查看驳回原因并重新提交"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span>新版 {item.rejectedVersion || 'v1.1.0'} 驳回 (查看原因)</span>
                                  </button>
                                </div>
                              ) : hasPendingEffective ? (
                                // 情况 3: 已有发布的版本，新版本复核已通过，但新版本生效日期尚未到达 (待生效)
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">{item.version}</span>
                                    <span className="px-2 py-0.5 rounded-md border border-emerald-200/80 bg-emerald-50 text-emerald-700 text-[10px] font-medium shadow-2xs">
                                      生效中
                                    </span>
                                  </div>
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold shadow-2xs"
                                    title={`新版本 ${item.pendingEffectiveVersion} 已复核通过，将于 ${item.pendingEffectiveStartDate || '排期日期'} 自动生效上线`}
                                  >
                                    <CalendarClock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    <span className="whitespace-nowrap">新版 {item.pendingEffectiveVersion}(待生效{item.pendingEffectiveStartDate ? `:${item.pendingEffectiveStartDate.slice(5)}` : ''})</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              ) : (
                                // 常规生效中版本 (统一显示为 生效中)
                                <div className="flex flex-col items-start gap-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">{item.version}</span>
                                    <span className="px-2 py-0.5 rounded-md border border-emerald-200/80 bg-emerald-50 text-emerald-700 text-[10px] font-medium shadow-2xs">
                                      生效中
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.updatedAt}</span>
                                </div>
                              )
                            )}
                          </div>

                          {/* Operations Column */}
                          <div
                            className="flex items-center gap-1 w-32 justify-end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setPreviewArticle(item)}
                              title="查看详情与切片"
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* 编辑按钮：统一规范颜色与图标，不再区分琥珀/蓝色等多种杂色 */}
                            <button
                              type="button"
                              onClick={(e) => {
                                if (isReviewLock) {
                                  e.stopPropagation();
                                  showToast('该知识条目正在复核审批中');
                                  return;
                                }
                                if (hasPendingReview) {
                                  e.stopPropagation();
                                  showToast(isExpired ? `新版本【${item.pendingVersion || ''}】正在复核中` : `新版本【${item.pendingVersion || ''}】正在复核中`);
                                  return;
                                }
                                handleOpenEditArticle(item, e);
                              }}
                              title={
                                isReviewLock
                                  ? '复核审批中'
                                  : hasPendingReview
                                  ? '新版本复核中'
                                  : hasPendingEffective
                                  ? '编辑待生效新版本'
                                  : hasRejectedReview || isRejectedNeverPub
                                  ? '编辑并重新提交'
                                  : isDraft
                                  ? '编辑草稿'
                                  : '编辑条目'
                              }
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleOpenMoveCategory(item, e)}
                              title="变更分类"
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteArticle(item.id, item.title, e)}
                              title="删除"
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Table Footer with Pagination */}
              <Pagination
                currentPage={contentCurrentPage}
                totalItems={filteredContentList.length}
                pageSize={contentPageSize}
                onPageChange={setContentCurrentPage}
                onPageSizeChange={(newSize) => {
                  setContentPageSize(newSize);
                  setContentCurrentPage(1);
                }}
                itemUnit="篇"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: 知识复核 (Review Workflow SubView) */}
        {/* ========================================================================= */}
        {currentView === '知识复核' && (
          <div className="flex-1 flex flex-col min-h-0">
            <ArticleReviewSubView
              articles={contentList}
              categories={allCategoryPaths}
              onApprove={handleApproveArticle}
              onReject={handleRejectArticle}
              onBatchApprove={handleBatchApprove}
              onBatchReject={handleBatchReject}
              onPreviewArticle={(art) => setPreviewArticle(art)}
              onEditArticle={(art) => handleOpenEditArticle(art)}
              onRollback={handleRollbackArticle}
              renderPairedTagBadge={renderPairedTagBadge}
              showToast={showToast}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 分类管理 (Clean Tree Table View) */}
        {/* ========================================================================= */}
        {currentView === '分类管理' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              {/* Header (Fixed) */}
              <div className="shrink-0 flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-100 px-3">
                <span>分类名称与层级</span>
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="hidden sm:inline-block w-28 text-left">知识库管理部门</span>
                  <span className="hidden lg:inline-block w-44 text-left">可查看部门</span>
                  <span className="hidden sm:inline-block w-28 text-left">编码</span>
                  <span className="min-w-14 text-center">关联知识</span>
                  <span className="w-28 text-right">操作</span>
                </div>
              </div>

              {/* Scrollable Tree Table */}
              <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100/40">
                {categoryList.map((node) => renderCategoryTableRow(node, 0, null))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 标签管理 (标签维度与候选值管理) */}
        {/* ========================================================================= */}
        {currentView === '标签管理' && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {/* Tag Cards Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-0 flex flex-col justify-between">
              {filteredTags.length === 0 ? (
                <div className="my-auto p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
                    <Hash className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">暂无匹配的标签</p>
                  <button
                    onClick={handleOpenAddTagModal}
                    className="px-4 py-1.5 rounded-full bg-[#EA3A20] text-white text-xs font-bold hover:bg-[#c42810] cursor-pointer inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新建标签</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredTags.map((tag) => {
                    const usageCount = getTagUsageCount(tag);
                    const valuesList = tag.values || [];

                    return (
                      <div
                        key={tag.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-150 flex flex-col justify-between gap-3 group hover:shadow-xs"
                      >
                        {/* Top: Tag Header & Actions */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${getTagBadgeStyle(
                                tag.color
                              )}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${getTagDotColor(tag.color)}`} />
                              <span>{tag.name}</span>
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleOpenEditTag(tag, e)}
                                title="编辑标签"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleOpenDeleteTag(tag, e)}
                                title="删除标签"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Description if present */}
                          {tag.description && (
                            <p className="text-slate-500 text-[11px] line-clamp-1 leading-relaxed">
                              {tag.description}
                            </p>
                          )}
                        </div>

                        {/* Middle: Values Candidate Chips List */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span>包含候选值 ({valuesList.length})：</span>
                            <button
                              onClick={() => setActiveTagForArticlesDrawer({ tag })}
                              className="hover:text-[#EA3A20] transition-colors cursor-pointer flex items-center gap-0.5"
                            >
                              <span>关联 {usageCount} 篇知识</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap max-h-32 overflow-y-auto custom-scrollbar p-1.5 bg-slate-50/70 rounded-xl border border-slate-100">
                            {valuesList.length === 0 ? (
                              <span className="text-[11px] text-slate-400 italic py-1 px-1">
                                暂无候选值，可在下方快速添加
                              </span>
                            ) : (
                              valuesList.map((val) => {
                                const valUsage = getTagValueUsageCount(tag.name, val);

                                return (
                                  <span
                                    key={val}
                                    onClick={() => setActiveTagForArticlesDrawer({ tag, value: val })}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 text-[11px] font-medium cursor-pointer transition-all hover:scale-102 group/val shadow-2xs"
                                    title={`查看关联「${tag.name}: ${val}」知识`}
                                  >
                                    <span className="font-semibold">{val}</span>
                                    {valUsage > 0 && (
                                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-100/70 text-emerald-700 font-bold">
                                        {valUsage}
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={(e) => handleQuickRemoveTagValue(tag.id, val, e)}
                                      title="移除此标签值"
                                      className="text-slate-400 hover:text-red-600 rounded-full p-0.5 transition-colors cursor-pointer"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Bottom: Fast Inline Add Input */}
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder={`+ 为「${tag.name}」添加新值，回车确认...`}
                            value={quickAddValues[tag.id] || ''}
                            onChange={(e) =>
                              setQuickAddValues((prev) => ({ ...prev, [tag.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleQuickAddTagValue(tag.id);
                              }
                            }}
                            className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20]"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickAddTagValue(tag.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all shrink-0 active:scale-95"
                          >
                            添加
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Summary */}
              {filteredTags.length > 0 && (
                <div className="pt-3 mt-3 border-t border-slate-100/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>共 {filteredTags.length} 个标签维度</span>
                  <span>输入框内按回车可快速添加候选值</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: BATCH UPLOAD DRAWER (右侧抽屉式面板) */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsUploadModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">批量上传知识库文件</h3>
                  <p className="text-[11px] text-slate-400">支持批量解析、切片与向量化入库</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              {/* Target Category Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>选择归属知识库分类
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full min-w-0 max-w-full truncate px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] cursor-pointer text-xs"
                >
                  {allCategoryPaths.map((c) => (
                    <option key={c.id} value={c.fullPath}>
                      {c.fullPath}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drag & Drop Box */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[#EA3A20] bg-red-50/40 scale-[0.99]'
                    : 'border-slate-200/90 hover:border-[#EA3A20]/60 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-[#EA3A20] mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  点击选择文件，或将知识库文档直接拖拽至此处
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  支持 PDF、DOCX、XLSX、Markdown 等格式，单文件最大 50MB
                </p>
                <div className="flex items-center gap-2 mt-5">
                  <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-bold text-slate-500">PDF</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-bold text-slate-500">DOCX</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-bold text-slate-500">XLSX</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-bold text-slate-500">MD</span>
                </div>
              </div>

              {isUploading && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800 animate-pulse">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                    <span>正在执行大模型解析、切片与向量化嵌入...</span>
                  </div>
                  <span className="font-mono font-bold">Processing</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 text-sm font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                选择文件上传
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT ARTICLE DRAWER (右侧抽屉式面板) */}
      {/* ========================================================================= */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsArticleModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingArticle ? '编辑知识条目' : '新建知识条目'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    配置知识属性、成对标签与正文，将自动同步向量数据库并供 AI 对话实时召回
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status notice banner */}
            {editingArticle && (
              <>
                {editingArticle.status === '复核不通过' && (
                  <div className="mx-6 mt-3 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 shrink-0">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold">上次复核未通过（已驳回）</p>
                      <p className="text-[11px] text-rose-700">
                        驳回原因：{editingArticle.reviewComment || '不符合合规要求，请根据审核意见修改知识正文后重新提交复核'}
                      </p>
                      <p className="text-[10px] text-rose-600">
                        修改完成后点击下方“重新提交复核”即可再次提交平台管理员复核。
                      </p>
                    </div>
                  </div>
                )}
                {editingArticle.status === '草稿' && (
                  <div className="mx-6 mt-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600 shrink-0">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>条目为未发布草稿</span>
                  </div>
                )}
                {editingArticle.pendingVersion && (
                  <div className="mx-6 mt-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>新版本【{editingArticle.pendingVersion}】审核中，保存将更新该待审核版本</span>
                  </div>
                )}
                {editingArticle.pendingEffectiveVersion && (
                  <div className="mx-6 mt-3 px-3.5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-2.5 text-xs text-indigo-900 shrink-0">
                    <CalendarClock className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold">
                        新版本【{editingArticle.pendingEffectiveVersion}】审批已通过（排期待生效）
                      </p>
                      <p className="text-[11px] text-indigo-700">
                        排期将于 {editingArticle.pendingEffectiveStartDate || '设定排期日'} 正式生效。在生效日前，支持随时根据业务调整编辑更新内容。
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step Tabs Navigation Header */}
            <div className="px-6 pt-3 pb-2 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setArticleModalStepTab('content')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    articleModalStepTab === 'content'
                      ? 'bg-white text-[#EA3A20] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>知识正文</span>
                </button>

                <button
                  type="button"
                  onClick={() => setArticleModalStepTab('tags')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    articleModalStepTab === 'tags'
                      ? 'bg-white text-[#EA3A20] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>业务标签</span>
                </button>

                <button
                  type="button"
                  onClick={() => setArticleModalStepTab('permissions')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    articleModalStepTab === 'permissions'
                      ? 'bg-white text-[#EA3A20] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>范围与时效</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Active Step View */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-xs">
              {articleModalStepTab === 'content' && (
                <ArticleContentTab
                  editingArticle={editingArticle}
                  articleFormTitle={articleFormTitle}
                  setArticleFormTitle={setArticleFormTitle}
                  articleFormCategory={articleFormCategory}
                  setArticleFormCategory={setArticleFormCategory}
                  allCategoryPaths={allCategoryPaths}
                  articleContentType={articleContentType}
                  setArticleContentType={setArticleContentType}
                  articleMarkdownView={articleMarkdownView}
                  setArticleMarkdownView={setArticleMarkdownView}
                  articleFormContent={articleFormContent}
                  setArticleFormContent={setArticleFormContent}
                  articleFormDocType={articleFormDocType}
                  setArticleFormDocType={setArticleFormDocType}
                  articleFormDocFile={articleFormDocFile}
                  setArticleFormDocFile={setArticleFormDocFile}
                  articleFormVideoUrl={articleFormVideoUrl}
                  setArticleFormVideoUrl={setArticleFormVideoUrl}
                  articleFormVideoDuration={articleFormVideoDuration}
                  setArticleFormVideoDuration={setArticleFormVideoDuration}
                  articleFormVideoCover={articleFormVideoCover}
                  setArticleFormVideoCover={setArticleFormVideoCover}
                  articleFormVideoSourceName={articleFormVideoSourceName}
                  setArticleFormVideoSourceName={setArticleFormVideoSourceName}
                  articleFormVideoTranscript={articleFormVideoTranscript}
                  setArticleFormVideoTranscript={setArticleFormVideoTranscript}
                  docFileInputRef={docFileInputRef}
                  videoFileInputRef={videoFileInputRef}
                  showToast={showToast}
                />
              )}

              {articleModalStepTab === 'tags' && (
                <ArticleTagsTab
                  articleFormTags={articleFormTags}
                  setArticleFormTags={setArticleFormTags}
                  tagList={tagList}
                  setTagList={setTagList}
                  contentList={contentList}
                  articleModalTab={articleModalTab}
                  setArticleModalTab={setArticleModalTab}
                  articleModalTagSearch={articleModalTagSearch}
                  setArticleModalTagSearch={setArticleModalTagSearch}
                  articleModalInlineAddValue={articleModalInlineAddValue}
                  setArticleModalInlineAddValue={setArticleModalInlineAddValue}
                  isArticleModalAddingDim={isArticleModalAddingDim}
                  setIsArticleModalAddingDim={setIsArticleModalAddingDim}
                  articleModalNewDimName={articleModalNewDimName}
                  setArticleModalNewDimName={setArticleModalNewDimName}
                  articleModalNewDimValues={articleModalNewDimValues}
                  setArticleModalNewDimValues={setArticleModalNewDimValues}
                  parseTagPair={parseTagPair}
                  showToast={showToast}
                />
              )}

              {articleModalStepTab === 'permissions' && (
                <ArticlePermissionsTab
                  articleFormRegions={articleFormRegions}
                  setArticleFormRegions={setArticleFormRegions}
                  isRegionsDropdownOpen={isRegionsDropdownOpen}
                  setIsRegionsDropdownOpen={setIsRegionsDropdownOpen}
                  customRegionInput={customRegionInput}
                  setCustomRegionInput={setCustomRegionInput}
                  PRESET_REGIONS={PRESET_REGIONS}
                  articleFormExpiryType={articleFormExpiryType}
                  setArticleFormExpiryType={setArticleFormExpiryType}
                  articleFormStartDate={articleFormStartDate}
                  setArticleFormStartDate={setArticleFormStartDate}
                  articleFormEndDate={articleFormEndDate}
                  setArticleFormEndDate={setArticleFormEndDate}
                  articleFormExpiryDate={articleFormExpiryDate}
                  setArticleFormExpiryDate={setArticleFormExpiryDate}
                  articleFormRelatedIds={articleFormRelatedIds}
                  setArticleFormRelatedIds={setArticleFormRelatedIds}
                  relatedSearchQuery={relatedSearchQuery}
                  setRelatedSearchQuery={setRelatedSearchQuery}
                  isRelatedDropdownOpen={isRelatedDropdownOpen}
                  setIsRelatedDropdownOpen={setIsRelatedDropdownOpen}
                  contentList={contentList}
                  editingArticle={editingArticle}
                />
              )}
            </div>

            {/* Drawer Footer with Step Navigation & Save */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {articleModalStepTab !== 'content' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (articleModalStepTab === 'permissions') setArticleModalStepTab('tags');
                      else if (articleModalStepTab === 'tags') setArticleModalStepTab('content');
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    上一步
                  </button>
                )}
                {articleModalStepTab !== 'permissions' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (articleModalStepTab === 'content') setArticleModalStepTab('tags');
                      else if (articleModalStepTab === 'tags') setArticleModalStepTab('permissions');
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200/80 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    下一步
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveArticleForm}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingArticle?.status === '复核不通过'
                      ? '重新提交复核'
                      : editingArticle?.status === '草稿'
                      ? '提交复核'
                      : editingArticle
                      ? '保存修改'
                      : '创建知识条目'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PREVIEW ARTICLE & CHUNKS DRAWER (右侧抽屉式面板) */}
      {/* ========================================================================= */}
      <ArticleDetailDrawer
        article={previewArticle}
        onClose={() => setPreviewArticle(null)}
        onEdit={(art) => {
          setPreviewArticle(null);
          handleOpenEditArticle(art);
        }}
        onRollback={handleRollbackArticle}
        onSelectRelated={(art) => setPreviewArticle(art)}
        allArticles={contentList}
        renderPairedTagBadge={renderPairedTagBadge}
        onShowToast={showToast}
        isReviewMode={currentView === '知识复核'}
        onApprove={(art, comment) => {
          handleApproveArticle(art, comment);
          setPreviewArticle(null);
        }}
        onReject={(art, reason) => {
          handleRejectArticle(art, reason);
          setPreviewArticle(null);
        }}
      />

      {/* ========================================================================= */}
      {/* MODAL: REJECTION REASON DETAIL MODAL (复核不通过原因详情弹窗) */}
      {/* ========================================================================= */}
      {rejectionDetailArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setRejectionDetailArticle(null)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4.5 bg-gradient-to-r from-rose-50 via-red-50/50 to-white border-b border-rose-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs border border-rose-200/80">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">复核未通过 · 驳回原因详情</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      退回修订
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    查看平台管理员针对该知识条目给出的合规审核意见与修订指引
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRejectionDetailArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
              {/* 1. Article Meta Overview */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">知识条目标题</span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {rejectionDetailArticle.title}
                    </h4>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      {rejectionDetailArticle.code}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">被驳回版本</span>
                    <span className="font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 inline-block mt-0.5">
                      {rejectionDetailArticle.rejectedVersion || rejectionDetailArticle.pendingVersion || rejectionDetailArticle.version}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">复核审核人</span>
                    <span className="font-medium text-slate-700 block mt-0.5">
                      {rejectionDetailArticle.reviewer || '平台管理员'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">审核驳回时间</span>
                    <span className="font-mono text-slate-600 block mt-0.5">
                      {rejectionDetailArticle.reviewedAt || rejectionDetailArticle.updatedAt || '2026-08-20 15:40'}
                    </span>
                  </div>
                </div>

                <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-400">归属分类:</span>
                    <span className="text-slate-700 font-medium">{rejectionDetailArticle.category}</span>
                  </div>
                  <div>
                    {rejectionDetailArticle.wasPublished ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                        线上正式版 {rejectionDetailArticle.version} 正常生效中
                      </span>
                    ) : (
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                        初次提审 (尚未正式发布上线)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Rejection Reason Box (Highlight) */}
              <div className="p-4 bg-rose-50/70 border-2 border-rose-200/90 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>管理员合规复核意见 / 驳回详细说明</span>
                </div>
                <div className="p-3.5 bg-white rounded-lg border border-rose-200 shadow-2xs text-rose-950 font-normal leading-relaxed text-xs whitespace-pre-wrap selection:bg-rose-100">
                  {rejectionDetailArticle.reviewComment || '该知识条目修订草案经平台合规与技术专家审核，不符合对外发布标准。请结合公司合规政策与技术规范，修正正文内容后重新提交复核。'}
                </div>
              </div>

              {/* 3. Actionable Next Steps / Advice */}
              <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>后续修改与重新提交指引</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-amber-800/90 space-y-1 leading-relaxed pl-1">
                  <li>
                    点击下方【去修改正文并重提】按钮，即可直接打开编辑器修订知识正文与配置参数。
                  </li>
                  <li>
                    修改完成后在编辑器中点击【重新提交复核】，条目将生成新修订草案并重新进入管理员复核流。
                  </li>
                  {rejectionDetailArticle.wasPublished && (
                    <li>
                      在重新提交并审核通过前，知识库的智能检索将继续以线上正式版本（{rejectionDetailArticle.version}）为准。
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  const art = rejectionDetailArticle;
                  setRejectionDetailArticle(null);
                  setPreviewArticle(art);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>查看条目完整详情与切片</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRejectionDetailArticle(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const art = rejectionDetailArticle;
                    setRejectionDetailArticle(null);
                    handleOpenEditArticle(art);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EA3A20] hover:bg-[#c42810] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>去修改正文并重提</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: MOVE CATEGORY MODAL (居中弹出框) */}
      {/* ========================================================================= */}
      {moveTargetArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMoveTargetArticle(null)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">变更知识条目归属分类</h3>
                  <p className="text-[11px] text-slate-400">调整条目在知识库树形目录中的挂载节点</p>
                </div>
              </div>
              <button
                onClick={() => setMoveTargetArticle(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">当前目标条目</span>
                <p className="font-bold text-sm text-slate-800">{moveTargetArticle.title}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <span>原归属分类：{moveTargetArticle.category}</span>
                </p>
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>选择目标新分类
                </label>
                <select
                  value={targetCategoryPath}
                  onChange={(e) => setTargetCategoryPath(e.target.value)}
                  className="w-full min-w-0 max-w-full truncate px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] cursor-pointer text-xs"
                >
                  {allCategoryPaths.map((c) => (
                    <option key={c.id} value={c.fullPath}>
                      {c.fullPath}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setMoveTargetArticle(null)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmMoveCategory}
                className="px-5 py-2 text-sm font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                确认移动
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADD CATEGORY MODAL (居中弹出框) */}
      {/* ========================================================================= */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsAddCatModalOpen(false)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <FolderTree className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {modalParentNode ? `新增「${modalParentNode.name}」的子分类` : '新增顶级知识库分类'}
                  </h3>
                  <p className="text-[11px] text-slate-400">建立层级树结构以归类组织知识库条目</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCatModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              {modalParentNode && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">父级挂载节点</span>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 mt-1 text-sm">
                    <Folder className="w-4 h-4 text-amber-500" />
                    <span>{modalParentNode.name} ({modalParentNode.code})</span>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-red-500 mr-1">*</span>分类名称
                  </label>
                  <input
                    type="text"
                    placeholder="例如：全卫定制、五金与板材百科、门墙系统..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] text-xs"
                  />
                </div>

                {/* 知识库管理部门配置 (组织结构树单选) */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>知识库管理部门</span>
                      <span className="text-red-500 font-bold">*</span>
                    </div>
                  </label>
                  <DeptTreeSelect
                    value={newCatManagementDept}
                    onChange={(val) => setNewCatManagementDept(val)}
                    multiple={false}
                    themeColor="purple"
                    placeholder="请选择知识库管理部门..."
                  />
                </div>

                {/* 可查看部门配置 (组织结构树多选) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>可查看部门</span>
                  </label>
                  <DeptTreeSelect
                    value={newCatViewableDepts}
                    onChange={(val) => setNewCatViewableDepts(val)}
                    multiple={true}
                    allowAll={true}
                    themeColor="blue"
                    placeholder="请选择可查看部门（支持多选）..."
                  />
                </div>

                {/* 管理部门负责人复审策略配置 */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>开启管理部门负责人复审</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={newCatRequireReview}
                          onChange={(e) => setNewCatRequireReview(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pl-5.5">
                      如果开启该功能，员工在该知识库分类下需要新发布/更新发布知识条目时，都需要管理知识库的部门负责人审核，通过才能成功发布。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsAddCatModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAddCat}
                className="px-5 py-2 text-sm font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                确认创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: EDIT CATEGORY MODAL (居中弹出框) */}
      {/* ========================================================================= */}
      {isEditCatModalOpen && editingCatNode && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsEditCatModalOpen(false)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">编辑分类信息</h3>
                  <p className="text-[11px] text-slate-400">修改知识库层级分类节点与编码</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditCatModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-red-500 mr-1">*</span>分类名称
                  </label>
                  <input
                    type="text"
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] text-xs"
                  />
                </div>

                {/* 知识库管理部门配置 (组织结构树单选) */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>知识库管理部门</span>
                      <span className="text-red-500 font-bold">*</span>
                    </div>
                  </label>
                  <DeptTreeSelect
                    value={editCatManagementDept}
                    onChange={(val) => setEditCatManagementDept(val)}
                    multiple={false}
                    themeColor="purple"
                    placeholder="请选择知识库管理部门..."
                  />
                </div>

                {/* 可查看部门配置 (组织结构树多选) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>可查看部门</span>
                  </label>
                  <DeptTreeSelect
                    value={editCatViewableDepts}
                    onChange={(val) => setEditCatViewableDepts(val)}
                    multiple={true}
                    allowAll={true}
                    themeColor="blue"
                    placeholder="请选择可查看部门（支持多选）..."
                  />
                </div>

                {/* 管理部门负责人复审策略配置 */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>开启管理部门负责人复审</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={editCatRequireReview}
                          onChange={(e) => setEditCatRequireReview(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pl-5.5">
                      如果开启该功能，员工在该知识库分类下需要新发布/更新发布知识条目时，都需要管理知识库的部门负责人审核，通过才能成功发布。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsEditCatModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmEditCat}
                className="px-5 py-2 text-sm font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                保存更新
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: CREATE SINGLE TAG MODAL (成对标签创建 - 居中弹出框) */}
      {/* ========================================================================= */}
      {isAddTagModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsAddTagModalOpen(false)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">新建成对标签维度</h3>
                  <p className="text-[11px] text-slate-400">配置多值检索维度，支持按规范筛选与知识关联</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTagModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>标签名称
                </label>
                <input
                  type="text"
                  placeholder="例如：风格、色系、材质、空间"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  预设候选值 (支持逗号、顿号或换行分隔)
                </label>
                <textarea
                  rows={4}
                  placeholder="例如：地中海、现代简约、意式极简、轻奢、新中式"
                  value={newTagValuesInput}
                  onChange={(e) => setNewTagValuesInput(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] resize-y leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">色彩视觉标识</label>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {colorOptions.map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => setNewTagColor(col.key)}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
                        newTagColor === col.key ? 'scale-110 shadow-xs border-slate-800' : 'border-white opacity-70 hover:opacity-100'
                      } ${col.bgClass}`}
                      title={col.label}
                    >
                      {newTagColor === col.key && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">标签说明 (选填)</label>
                <textarea
                  rows={2}
                  placeholder="简要说明此标签的用途或定义..."
                  value={newTagDesc}
                  onChange={(e) => setNewTagDesc(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20]"
                />
              </div>

              {/* Tag Preview */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">样式效果预览:</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${getTagBadgeStyle(newTagColor)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getTagDotColor(newTagColor)}`} />
                  <span>{newTagName.trim() || '风格'}: {newTagValuesInput.split(/[,，\n、]/)[0]?.trim() || '地中海'}</span>
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsAddTagModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAddTag}
                className="px-5 py-2 text-sm font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>立即创建</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: BATCH ADD TAGS MODAL (批量成对标签导入 - 居中弹出框) */}
      {/* ========================================================================= */}
      {isBatchAddTagModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsBatchAddTagModalOpen(false)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">批量快捷添加成对标签</h3>
                  <p className="text-[11px] text-slate-400">支持成对格式解析与批量导入</p>
                </div>
              </div>
              <button
                onClick={() => setIsBatchAddTagModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>标签与候选值列表 (每行一条，格式如 风格: 地中海、现代简约)
                </label>
                <textarea
                  rows={8}
                  placeholder="示例：&#10;风格: 地中海、现代简约、意式极简&#10;色系: 暖色调、冷色调、黑白灰&#10;材质: 实木、岩板、皮艺"
                  value={batchTagsInput}
                  onChange={(e) => setBatchTagsInput(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] resize-y"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
                <span>提示：冒号前为标签名，冒号后为候选值（以逗号或顿号分隔），系统将自动解析导入。</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsBatchAddTagModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmBatchAddTags}
                className="px-5 py-2 text-sm font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>立即导入</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 9: EDIT TAG MODAL (标签编辑 - 居中弹出框) */}
      {/* ========================================================================= */}
      {isEditTagModalOpen && editingTag && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsEditTagModalOpen(false)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">编辑标签</h3>
                  <p className="text-[11px] text-slate-400">修改标签名称与预设候选值</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditTagModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>标签名称
                </label>
                <input
                  type="text"
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] text-xs"
                />
              </div>

              {/* Tag Values Manager inside Edit Modal */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <label className="font-bold text-slate-700 block flex items-center justify-between">
                  <span>候选值列表 ({editTagValues.length})</span>
                </label>

                <div className="flex items-center gap-1.5 flex-wrap min-h-12 p-2 bg-white rounded-lg border border-slate-200">
                  {editTagValues.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">暂无候选值</span>
                  ) : (
                    editTagValues.map((val) => (
                      <span
                        key={val}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium"
                      >
                        <span>{val}</span>
                        <button
                          type="button"
                          onClick={() => setEditTagValues(editTagValues.filter((v) => v !== val))}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="输入新候选值，回车添加..."
                    value={editTagNewValueInput}
                    onChange={(e) => setEditTagNewValueInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = editTagNewValueInput.trim();
                        if (val && !editTagValues.includes(val)) {
                          setEditTagValues([...editTagValues, val]);
                          setEditTagNewValueInput('');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = editTagNewValueInput.trim();
                      if (val && !editTagValues.includes(val)) {
                        setEditTagValues([...editTagValues, val]);
                        setEditTagNewValueInput('');
                      }
                    }}
                    className="px-3.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    添加
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">色彩视觉标识</label>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {colorOptions.map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => setEditTagColor(col.key)}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
                        editTagColor === col.key ? 'scale-110 shadow-xs border-slate-800' : 'border-white opacity-70 hover:opacity-100'
                      } ${col.bgClass}`}
                      title={col.label}
                    >
                      {editTagColor === col.key && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">标签说明 (选填)</label>
                <textarea
                  rows={2}
                  placeholder="说明此标签维度的定义或适用场景..."
                  value={editTagDesc}
                  onChange={(e) => setEditTagDesc(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20]"
                />
              </div>

              {/* Tag Preview */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">效果预览:</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${getTagBadgeStyle(editTagColor)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getTagDotColor(editTagColor)}`} />
                  <span>{editTagName.trim() || '标签'}: {editTagValues[0] || '默认值'}</span>
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsEditTagModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmEditTag}
                className="px-5 py-2 text-sm font-bold text-white bg-[#EA3A20] hover:bg-[#c42810] rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 10: DELETE TAG CONFIRMATION MODAL (删除标签确认 - 居中弹出框) */}
      {/* ========================================================================= */}
      {isDeleteTagModalOpen && deletingTag && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsDeleteTagModalOpen(false)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">确认删除成对标签</h3>
                  <p className="text-[11px] text-slate-400">永久移除此标签维度及其在知识库中的引用</p>
                </div>
              </div>
              <button
                onClick={() => setIsDeleteTagModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              <div className="p-4 bg-red-50/60 rounded-xl border border-red-100 text-xs text-red-900 space-y-2.5">
                <p className="font-bold text-sm">
                  您确定要删除标签维度「{deletingTag.name}」及其所有候选值吗？
                </p>
                <p className="text-xs text-red-700 leading-relaxed">
                  当前有 <strong className="font-mono text-red-800 text-sm">{getTagUsageCount(deletingTag)}</strong> 篇知识条目关联了此维度下的标签值。删除后，系统将自动从所有关联条目中移除对应标签，此操作不可撤销。
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">待删除维度信息</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-flex items-center gap-1.5 ${getTagBadgeStyle(deletingTag.color)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getTagDotColor(deletingTag.color)}`} />
                    <span>{deletingTag.name}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">({deletingTag.values.length} 个候选值)</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsDeleteTagModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteTag}
                className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 11: BATCH DELETE TAGS CONFIRMATION MODAL (批量删除标签 - 居中弹出框) */}
      {/* ========================================================================= */}
      {isBatchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsBatchDeleteModalOpen(false)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">批量删除所选标签</h3>
                  <p className="text-[11px] text-slate-400">将选中的多个标签维度同时移除</p>
                </div>
              </div>
              <button
                onClick={() => setIsBatchDeleteModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              <div className="p-4 bg-red-50/60 rounded-xl border border-red-100 text-xs text-red-900 space-y-2.5">
                <p className="font-bold text-sm">
                  您即将批量删除选中的 <strong className="font-mono text-red-600 text-base">{selectedTagIds.size}</strong> 个知识库标签。
                </p>
                <p className="text-xs text-red-700 leading-relaxed">
                  这些标签从知识库中移除后，所有对应知识条目的标签绑定将自动被清理解绑。
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsBatchDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmBatchDeleteTags}
                className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                确认全部删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 12: ACTIVE TAG ARTICLES MODAL (标签关联条目 - 居中弹出框) */}
      {/* ========================================================================= */}
      {activeTagForArticlesDrawer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 my-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setActiveTagForArticlesDrawer(null)}
          />

          {/* Centered Modal Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    标签关联知识条目
                  </h3>
                  <p className="text-[11px] text-slate-400">查看引用当前标签维度的所有知识文档</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTagForArticlesDrawer(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tag Info Card */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-flex items-center gap-1.5 ${getTagBadgeStyle(activeTagForArticlesDrawer.tag.color)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getTagDotColor(activeTagForArticlesDrawer.tag.color)}`} />
                  <span>
                    {activeTagForArticlesDrawer.tag.name}
                    {activeTagForArticlesDrawer.value && `: ${activeTagForArticlesDrawer.value}`}
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 line-clamp-1">{activeTagForArticlesDrawer.tag.description || '成对标签体系'}</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-200/80 text-slate-700 text-xs font-bold">
                {activeTagForArticlesDrawer.tag.categoryGroup}
              </span>
            </div>

            {/* Filtered Articles List */}
            {(() => {
              const matchedArticles = contentList.filter((art) => {
                if (!art.tags || art.tags.length === 0) return false;
                const targetKey = activeTagForArticlesDrawer.tag.name.toLowerCase();
                const targetVal = activeTagForArticlesDrawer.value?.toLowerCase();

                return art.tags.some((tStr) => {
                  const { key, value } = parseTagPair(tStr);
                  if (targetVal) {
                    return key.toLowerCase() === targetKey && value.toLowerCase() === targetVal;
                  }
                  return key.toLowerCase() === targetKey || tStr.toLowerCase().includes(targetKey);
                });
              });

              return (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                  {matchedArticles.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                      <Tag className="w-8 h-8 text-slate-300 mx-auto" />
                      <p>暂无知识条目绑定此标签</p>
                    </div>
                  ) : (
                    matchedArticles.map((article) => (
                      <div
                        key={article.id}
                        onClick={() => setPreviewArticle(article)}
                        className="p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl space-y-2 cursor-pointer transition-all hover:shadow-xs group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-[#EA3A20] font-bold">{article.code}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{article.updatedAt}</span>
                        </div>
                        <p className="font-bold text-xs text-slate-800 group-hover:text-[#EA3A20] transition-colors leading-snug">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {article.tags?.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="scale-95 origin-left">
                              {renderPairedTagBadge(t)}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 pt-1 border-t border-slate-100">
                          <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{article.category}</span>
                        </p>
                      </div>
                    ))
                  )}
                </div>
              );
            })()}

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 shrink-0 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                关联知识检索结果
              </span>
              <button
                onClick={() => setActiveTagForArticlesDrawer(null)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tooltip for Truncated Titles on Hover */}
      {hoveredTitle && (
        <div
          style={{
            position: 'fixed',
            top: Math.max(12, hoveredTitle.rect.top - 8),
            left: Math.max(16, Math.min(window.innerWidth - 440, hoveredTitle.rect.left)),
            transform: 'translateY(-100%)',
            zIndex: 99999,
          }}
          className="pointer-events-none max-w-sm sm:max-w-md p-2.5 px-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700/80 text-xs font-normal leading-relaxed break-words animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-[#EA3A20]" />
            <span>知识条目完整标题</span>
          </div>
          <div className="font-bold text-slate-100 text-xs leading-normal select-none">
            {hoveredTitle.title}
          </div>
          {/* Tooltip downward pointer */}
          <div className="absolute left-6 -bottom-1 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/80" />
        </div>
      )}
    </div>
  );
};
