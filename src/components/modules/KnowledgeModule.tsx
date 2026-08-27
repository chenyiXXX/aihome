import React, { useState, useRef } from 'react';
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

// 预设配置选项 (用于知识条目新建/编辑配置)
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
  const [articleMarkdownView, setArticleMarkdownView] = useState<'edit' | 'preview'>('edit');
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
  // 1. 适用岗位* (多选下拉)
  const [articleFormRoles, setArticleFormRoles] = useState<string[]>(['外贸销售岗', '内容推广岗']);
  const [isRolesDropdownOpen, setIsRolesDropdownOpen] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');

  // 2. 适用地区/语种* (多选下拉)
  const [articleFormRegions, setArticleFormRegions] = useState<string[]>(['GCC中东六国', '英文/阿拉伯语']);
  const [isRegionsDropdownOpen, setIsRegionsDropdownOpen] = useState(false);
  const [customRegionInput, setCustomRegionInput] = useState('');

  // 3. 知识密级 (单选: 公开 / 内部 / 机密)
  const [articleFormSecurityLevel, setArticleFormSecurityLevel] = useState<'公开' | '内部' | '机密'>('内部');

  // 4. 有效期限 (永久有效 或 设置有效期：开始日期与结束日期)
  const [articleFormExpiryType, setArticleFormExpiryType] = useState<'permanent' | 'custom'>('permanent');
  const [articleFormStartDate, setArticleFormStartDate] = useState<string>('');
  const [articleFormEndDate, setArticleFormEndDate] = useState<string>('');
  const [articleFormExpiryDate, setArticleFormExpiryDate] = useState<string>('');

  // 5. 关联条目 (搜索多选选择框)
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
  const [editCatRequireReview, setEditCatRequireReview] = useState<boolean>(false);
  const [editCatReviewTriggers, setEditCatReviewTriggers] = useState<{ onUpload: boolean; onEdit: boolean; onDelete: boolean }>({
    onUpload: true,
    onEdit: true,
    onDelete: true
  });

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
  const currentView: '内容上传' | '知识复核' | '分类管理' | '标签管理' | '版本记录' =
    subView.includes('复核')
      ? '知识复核'
      : subView.includes('分类')
      ? '分类管理'
      : subView.includes('标签')
      ? '标签管理'
      : subView.includes('版本')
      ? '版本记录'
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
      const matchSearch =
        !q ||
        tag.name.toLowerCase().includes(q) ||
        (tag.values && tag.values.some((v) => v.toLowerCase().includes(q))) ||
        (tag.description && tag.description.toLowerCase().includes(q)) ||
        (tag.categoryGroup && tag.categoryGroup.toLowerCase().includes(q)) ||
        (tag.creator && tag.creator.toLowerCase().includes(q));

      const matchGroup = selectedTagGroup === '全部' || tag.categoryGroup === selectedTagGroup;
      const matchType =
        selectedTagTypeFilter === 'all' ||
        (selectedTagTypeFilter === 'builtin' && Boolean(tag.isBuiltin)) ||
        (selectedTagTypeFilter === 'custom' && !tag.isBuiltin);

      return matchSearch && matchGroup && matchType;
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
    // 业务分组默认选当前筛选的有效业务大类或'通用'
    const defaultGrp =
      selectedTagGroup !== '全部' && allTagGroupOptions.includes(selectedTagGroup)
        ? selectedTagGroup
        : '通用';
    setNewTagGroup(defaultGrp);
    setNewTagCustomGroup('');
    setNewTagColor('purple');
    setNewTagDesc('');
    // 规则：只有平台管理才可以新增内置标签，其他的人默认新增自定义标签
    setNewTagIsBuiltin(currentUserRole === 'admin');
    setIsAddTagModalOpen(true);
  };

  const handleConfirmAddTag = () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) {
      showToast('⚠️ 请输入标签名 (如：风格、色系、空间、材质)');
      return;
    }

    // Check duplicate
    if (tagList.some((t) => t.name.toLowerCase() === trimmedName.toLowerCase())) {
      showToast(`⚠️ 标签名「${trimmedName}」已存在，请勿重复创建`);
      return;
    }

    // 权限规则严格校验：只有平台管理才可以新增内置标签，其他人员无论如何默认强制为自定义标签
    const actualIsBuiltin = currentUserRole === 'admin' ? Boolean(newTagIsBuiltin) : false;

    const finalGroup = newTagGroup === '__custom__' ? (newTagCustomGroup.trim() || '通用') : (newTagGroup || '通用');

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
      isBuiltin: actualIsBuiltin,
      builtinValues: actualIsBuiltin ? [...distinctValues] : [],
      color: newTagColor,
      categoryGroup: finalGroup,
      description: newTagDesc.trim() || undefined,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      creator: actualIsBuiltin ? 'Franklin Jr (平台管理员)' : 'Alex (外贸业务员)'
    };

    setTagList([newTagItem, ...tagList]);
    setIsAddTagModalOpen(false);
    showToast(`✅ ${actualIsBuiltin ? '🏢 公司内置' : '🏷️ 自定义'}标签「${trimmedName}」创建成功，归属【${finalGroup}】分组`);
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
    const actualIsBuiltin = currentUserRole === 'admin';
    const finalBatchGroup = batchTagGroup || '通用';

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
          isBuiltin: actualIsBuiltin,
          builtinValues: actualIsBuiltin ? [...dVals] : [],
          color: batchTagColor,
          categoryGroup: finalBatchGroup,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          creator: actualIsBuiltin ? 'Franklin Jr (平台管理员)' : 'Alex (外贸业务员)'
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
    showToast(`✅ 成功批量添加 ${addedCount} 个成对标签（归属【${finalBatchGroup}】）`);
  };

  const handleOpenEditTag = (tag: KBTag, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingTag(tag);
    setEditTagName(tag.name);
    setEditTagValues([...(tag.values || [])]);
    setEditTagNewValueInput('');
    setEditTagGroup(allTagGroupOptions.includes(tag.categoryGroup) ? tag.categoryGroup : '__custom__');
    setEditTagCustomGroup(allTagGroupOptions.includes(tag.categoryGroup) ? '' : tag.categoryGroup);
    setEditTagColor(tag.color);
    setEditTagDesc(tag.description || '');
    setEditTagIsBuiltin(Boolean(tag.isBuiltin));
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

    // 权限校验：如果是非平台管理员，不能把自定义标签修改为内置标签
    const actualIsBuiltin = currentUserRole === 'admin' ? editTagIsBuiltin : (editingTag.isBuiltin ? true : false);

    const finalGroup = editTagGroup === '__custom__' ? (editTagCustomGroup.trim() || '通用') : (editTagGroup || '通用');
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
              isBuiltin: actualIsBuiltin,
              color: editTagColor,
              categoryGroup: finalGroup,
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
    setArticleFormRoles(['外贸销售岗', '内容推广岗']);
    setIsRolesDropdownOpen(false);
    setCustomRoleInput('');
    setArticleFormRegions(['GCC中东六国', '英文/阿拉伯语']);
    setIsRegionsDropdownOpen(false);
    setCustomRegionInput('');
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date();
    defaultEnd.setMonth(defaultEnd.getMonth() + 3);
    const endStr = defaultEnd.toISOString().split('T')[0];

    setArticleFormSecurityLevel('内部');
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
    setArticleFormRoles(art.applicableRoles && art.applicableRoles.length > 0 ? art.applicableRoles : ['外贸销售岗', '内容推广岗']);
    setIsRolesDropdownOpen(false);
    setCustomRoleInput('');
    setArticleFormRegions(art.applicableRegions && art.applicableRegions.length > 0 ? art.applicableRegions : ['GCC中东六国', '英文/阿拉伯语']);
    setIsRegionsDropdownOpen(false);
    setCustomRegionInput('');
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date();
    defaultEnd.setMonth(defaultEnd.getMonth() + 3);
    const endStr = defaultEnd.toISOString().split('T')[0];

    setArticleFormSecurityLevel(art.securityLevel || '内部');
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

    if (articleFormRoles.length === 0) {
      showToast('请至少选择一个适用岗位！');
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
      const requiresReview = Boolean(
        targetCatObj?.requireReview && (targetCatObj.reviewTriggers?.onEdit !== false)
      );

      const wasAlreadyPublished = Boolean(editingArticle.wasPublished || editingArticle.status === '已发布');

      const nextVer = editingArticle.version.startsWith('v')
        ? `v${(parseFloat(editingArticle.version.slice(1)) + 0.1).toFixed(1)}.0`
        : 'v2.0.0';

      const finalVersion = requiresReview
        ? (wasAlreadyPublished ? editingArticle.version : `${nextVer}-rc`)
        : nextVer;

      const pendingVer = requiresReview && wasAlreadyPublished ? `${nextVer}-rc` : undefined;
      const finalStatus = requiresReview ? '等待复核' : '已发布';
      const finalWasPublished = wasAlreadyPublished || !requiresReview;

      const auditLog: KBAuditLog = {
        id: `LOG-${Date.now()}`,
        articleId: editingArticle.id,
        operator: 'Sophia (主管)',
        operatorRole: '业务主管',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: requiresReview ? 'submit_review' : 'edit',
        actionLabel: requiresReview ? (editingArticle.status === '复核不通过' ? '重新编辑并提交复核' : '编辑知识条目并提交复核') : '直接更新发布知识条目',
        version: pendingVer || finalVersion,
        wasPublished: finalWasPublished,
        diffSummary: requiresReview
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
          version: pendingVer || finalVersion,
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
                wasPublished: finalWasPublished,
                status: finalStatus,
                reviewStatus: requiresReview ? 'pending' : undefined,
                pendingAction: requiresReview ? 'update' : undefined,
                tags: tagsArray,
                contentType: articleContentType,
                fileType: finalFileType,
                fileSize: finalSize,
                chunksCount: finalChunks,
                content: articleFormContent,
                applicableRoles: articleFormRoles,
                applicableRegions: articleFormRegions,
                securityLevel: articleFormSecurityLevel,
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

      if (requiresReview) {
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
        applicableRoles: articleFormRoles,
        applicableRegions: articleFormRegions,
        securityLevel: articleFormSecurityLevel,
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
    if (selectedContentIds.size === filteredContentList.length) {
      setSelectedContentIds(new Set());
    } else {
      setSelectedContentIds(new Set(filteredContentList.map((item) => item.id)));
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
    if (node.isBuiltin) {
      showToast('系统内置分类不可编辑！');
      return;
    }
    setEditingCatNode(node);
    setEditCatName(node.name);
    setEditCatCode(node.code);
    setEditCatRequireReview(Boolean(node.requireReview));
    setEditCatReviewTriggers(node.reviewTriggers || { onUpload: true, onEdit: true, onDelete: true });
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
      showToast('系统内置分类不可删除！');
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

  const handleMoveCatNode = (id: string, direction: 'up' | 'down', isBuiltin?: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isBuiltin) {
      showToast('系统内置分类不允许排序！');
      return;
    }

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
    showToast(`已${direction === 'up' ? '上移' : '下移'}分类`);
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
  const renderCategoryTableRow = (node: KBCategory, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isBuiltin = node.isBuiltin;

    return (
      <React.Fragment key={node.id}>
        <div
          className="group flex items-center justify-between py-2 px-3 hover:bg-slate-50 transition-colors border-b border-slate-100/70 text-xs"
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          {/* Left: Name & Expand/Collapse */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
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

          {/* Right: Code, Count & CRUD Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="font-mono text-[11px] text-slate-400 hidden sm:inline-block">
              {node.code}
            </span>

            <span className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md min-w-14 text-center">
              {contentList.filter(c => c.category.includes(node.name)).length || node.itemCount || 0} 篇
            </span>

            <div className="flex items-center gap-0.5 w-28 justify-end">
              <button
                onClick={(e) => handleOpenAddCatModal(node, e)}
                title="添加子分类"
                className="p-1 rounded text-slate-400 hover:text-[#EA3A20] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {!isBuiltin ? (
                <>
                  <button
                    onClick={(e) => handleOpenEditCatModal(node, e)}
                    title="编辑分类"
                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleMoveCatNode(node.id, 'up', node.isBuiltin, e)}
                    title="上移"
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleMoveCatNode(node.id, 'down', node.isBuiltin, e)}
                    title="下移"
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteCatNode(node.id, node.name, node.isBuiltin, e)}
                    title="删除分类"
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <span
                  title="系统内置分类不可编辑、排序或删除"
                  className="p-1 text-slate-300 flex items-center justify-center cursor-not-allowed"
                >
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children!.map((child) => renderCategoryTableRow(child, depth + 1))}</div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-8 pb-8">
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-10 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#EA3A20]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Action Bar */}
      <div className="flex items-center justify-between py-2.5 mb-2 shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h1 className="text-sm font-black text-slate-900 shrink-0">
            {currentView === '分类管理'
              ? '知识库分类管理'
              : currentView === '标签管理'
              ? '知识库标签管理'
              : currentView === '知识复核'
              ? '知识复核中心'
              : currentView === '版本记录'
              ? '知识库版本记录'
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
              共 {tagList.length} 个成对标签体系
            </span>
          ) : currentView === '内容上传' ? (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shrink-0">
              <span>共 {contentList.length} 篇知识条目</span>
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> 向量库同步在线
              </span>
            </span>
          ) : (
            <>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs text-slate-500 shrink-0">版本发布日志与索引审计</span>
            </>
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
              {/* Role Toggle for Tag Creation & Management */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/90 rounded-full border border-slate-200/80 text-xs shrink-0">
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">操作身份:</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = currentUserRole === 'admin' ? 'staff' : 'admin';
                    setCurrentUserRole(next);
                    showToast(
                      next === 'admin'
                        ? '👑 已切换为【平台管理员】身份（支持新增公司内置标签和自定义标签）'
                        : '👤 已切换为【普通人员/业务员】身份（默认仅可新增团队自定义标签）'
                    );
                  }}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-2xs active:scale-95 ${
                    currentUserRole === 'admin'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                  title="点击切换操作身份体验内置标签权限控制"
                >
                  {currentUserRole === 'admin' ? (
                    <>
                      <Building2 className="w-3 h-3" />
                      <span>平台管理员</span>
                    </>
                  ) : (
                    <>
                      <Tag className="w-3 h-3" />
                      <span>普通人员 (Alex)</span>
                    </>
                  )}
                  <span className="text-[9px] opacity-75 underline ml-0.5">切换</span>
                </button>
              </div>

              <div className="relative w-44 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索标签名或候选值..."
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  className="w-full pl-8.5 pr-7 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA3A20] shadow-2xs"
                />
                {tagSearchQuery && (
                  <button
                    onClick={() => setTagSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsBatchAddTagModalOpen(true)}
                className="h-8 px-3 rounded-full bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0 active:scale-95"
                title="批量导入成对标签"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">批量导入</span>
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
                <span>新建条目</span>
              </button>
              <button
                onClick={() => {
                  setUploadCategory(selectedCategoryFilter || allCategoryPaths[0]?.fullPath || '产品与技术百科 / 产品百科 / 按单品 / 柜类');
                  setIsUploadModalOpen(true);
                }}
                className="h-8.5 px-4 rounded-full bg-[#EA3A20] text-white hover:bg-[#c42810] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>批量上传文档</span>
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
              <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
                <span>点击分类可快速过滤右侧内容</span>
                {selectedCategoryFilter && (
                  <button
                    onClick={() => setSelectedCategoryFilter(null)}
                    className="text-[#EA3A20] hover:underline cursor-pointer font-medium"
                  >
                    清除筛选
                  </button>
                )}
              </div>
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
                    {selectedContentIds.size > 0 && selectedContentIds.size === filteredContentList.length ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#EA3A20]" />
                    ) : (
                      <Square className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span>知识条目标题</span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden md:inline-block w-28 text-left">归属分类</span>
                  <span className="hidden lg:inline-block w-24 text-left">切片 & 向量</span>
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
                  filteredContentList.map((item) => {
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

                          {/* Chunks & Vector Column */}
                          <div className="hidden lg:block w-24">
                            <span className="text-[11px] font-mono text-slate-600 block">
                              {item.chunksCount || 24} 个切片
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 className="w-2.5 h-2.5" /> 已向量化
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
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-medium shadow-2xs" title="原版本已过有效期">
                                      已过有效期
                                    </span>
                                  </div>

                                  {/* Row 2: Rejected Revision Red Pill */}
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold shadow-2xs">
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span className="whitespace-nowrap">新版 {item.rejectedVersion || 'v1.1.0'} (复核不通过)</span>
                                  </div>

                                  {/* Row 3: Dedicated Clickable Action Line */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRejectionDetailArticle(item);
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 cursor-pointer transition-colors group/link mt-0.5 text-left"
                                    title="点击查看管理员复核驳回原因与详细修改意见并重新提交"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span className="group-hover/link:underline underline-offset-2">查看驳回意见并重新提交</span>
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
                                  {/* Row 1: Initial Version Badge */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                                      {item.version}
                                    </span>
                                  </div>

                                  {/* Row 2: Rejected Red Pill */}
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold shadow-2xs">
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span className="whitespace-nowrap">新版 {item.rejectedVersion || item.version} (复核不通过)</span>
                                  </div>

                                  {/* Row 3: Dedicated Clickable Action Line */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRejectionDetailArticle(item);
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 cursor-pointer transition-colors group/link mt-0.5 text-left"
                                    title="点击查看管理员复核驳回原因与详细修改意见并重新提交"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span className="group-hover/link:underline underline-offset-2">查看驳回意见并重新提交</span>
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

                                  {/* Row 2: Rejected Revision Red Pill */}
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold shadow-2xs">
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span className="whitespace-nowrap">新版 {item.rejectedVersion || 'v1.1.0'} (复核不通过)</span>
                                  </div>

                                  {/* Row 3: Dedicated Clickable Action Line */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRejectionDetailArticle(item);
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 cursor-pointer transition-colors group/link mt-0.5 text-left"
                                    title="点击查看管理员复核驳回原因与详细修改意见并重新提交"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span className="group-hover/link:underline underline-offset-2">查看驳回意见并重新提交</span>
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

                            {isReviewLock ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showToast('⚠️ 该知识条目正在复核审批中，已被系统锁定编辑，待管理员审批完成。');
                                }}
                                title="复核审批中，暂时不能编辑"
                                className="p-1 rounded-lg text-slate-300 hover:text-slate-400 hover:bg-slate-100/50 cursor-not-allowed transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            ) : hasPendingReview ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showToast(isExpired ? `⚠️ 该条目原版本已过有效期，新版本【${item.pendingVersion || ''}】正在复核审批中。` : `⚠️ 该条目已有新版本【${item.pendingVersion || ''}】在复核审批中，线上版本正常运行中。`);
                                }}
                                title={isExpired ? '已过有效期，新版本正在复核审批中' : '已有新版本在复核审批中'}
                                className="p-1 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 transition-colors cursor-pointer"
                              >
                                <Clock className="w-3.5 h-3.5" />
                              </button>
                            ) : hasPendingEffective ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showToast(isExpired ? `ℹ️ 该条目原版本已过有效期，新版本【${item.pendingEffectiveVersion || ''}】已复核通过，将于 ${item.pendingEffectiveStartDate || '排期日期'} 自动生效。` : `ℹ️ 该条目新版本【${item.pendingEffectiveVersion || ''}】已复核通过，将于 ${item.pendingEffectiveStartDate || '排期日期'} 自动生效切换。`);
                                }}
                                title={isExpired ? `已过有效期，新版本 ${item.pendingEffectiveVersion} 已复核通过，排期待生效` : `新版本 ${item.pendingEffectiveVersion} 已复核通过，排期待生效`}
                                className="p-1 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 transition-colors cursor-pointer"
                              >
                                <CalendarClock className="w-3.5 h-3.5" />
                              </button>
                            ) : hasRejectedReview || isRejectedNeverPub ? (
                              <button
                                type="button"
                                onClick={(e) => handleOpenEditArticle(item, e)}
                                title={isExpired ? '已过有效期，新版本复核未通过，点击修改后重新提审' : '复核不通过，点击重新编辑并再次提交复核'}
                                className="p-1 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => handleOpenEditArticle(item, e)}
                                title={isDraft ? '编辑草稿并提交复核' : isExpired ? '已过有效期（无新版本），点击编辑重新生效或提交新版复核' : '编辑条目'}
                                className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={(e) => handleOpenMoveCategory(item, e)}
                              title="变更分类"
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleRevectorize(item, e)}
                              title="重新向量化"
                              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
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

              {/* Table Footer */}
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
                <span>显示 {filteredContentList.length} 条记录（总计 {contentList.length} 篇）</span>
                <span className="font-mono text-[10px]">向量检索引擎: Active · HNSW Index</span>
              </div>
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
                <div className="flex items-center gap-6">
                  <span className="hidden sm:inline-block">编码</span>
                  <span>关联知识</span>
                  <span className="w-28 text-right">操作</span>
                </div>
              </div>

              {/* Scrollable Tree Table */}
              <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100/40">
                {categoryList.map((node) => renderCategoryTableRow(node, 0))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 标签管理 (成对标签管理: 标签名与标签值增删查改) */}
        {/* ========================================================================= */}
        {currentView === '标签管理' && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {/* Unified Single-Row Filter Bar */}
            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 flex-wrap shrink-0">
              {/* Left: Built-in vs Custom Filter Segment + Category Group Filter */}
              <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                {/* Type Filter Buttons */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setSelectedTagTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      selectedTagTypeFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    全部 ({tagList.length})
                  </button>
                  <button
                    onClick={() => setSelectedTagTypeFilter('builtin')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      selectedTagTypeFilter === 'builtin'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    内置标签 ({tagList.filter((t) => t.isBuiltin).length})
                  </button>
                  <button
                    onClick={() => setSelectedTagTypeFilter('custom')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      selectedTagTypeFilter === 'custom'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    自定义标签 ({tagList.filter((t) => !t.isBuiltin).length})
                  </button>
                </div>

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                {/* Category Groups Pills */}
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-full">
                  <button
                    onClick={() => setSelectedTagGroup('全部')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                      selectedTagGroup === '全部'
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    全部业务大类
                  </button>
                  {allTagGroupOptions.map((grp) => (
                    <button
                      key={grp}
                      onClick={() => setSelectedTagGroup(grp)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                        selectedTagGroup === grp
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Sort By */}
              <div className="flex items-center gap-2 text-xs shrink-0">
                <span className="text-slate-400 text-[11px]">排序:</span>
                <select
                  value={tagSortBy}
                  onChange={(e) => setTagSortBy(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#EA3A20] text-xs cursor-pointer"
                >
                  <option value="usage">按知识关联热度</option>
                  <option value="name">按名称首字母</option>
                  <option value="time">按创建时间</option>
                </select>
              </div>
            </div>

            {/* Tag Cards Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-0 flex flex-col justify-between">
              {filteredTags.length === 0 ? (
                <div className="my-auto p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
                    <Hash className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">未找到匹配的成对标签</p>
                  <p className="text-[11px] text-slate-400">
                    您可以尝试切换筛选、搜索标签名或标签值，或点击右上角「新建标签」创建
                  </p>
                  <button
                    onClick={handleOpenAddTagModal}
                    className="px-4 py-1.5 rounded-full bg-[#EA3A20] text-white text-xs font-bold hover:bg-[#c42810] cursor-pointer inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新建成对标签</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredTags.map((tag) => {
                    const usageCount = getTagUsageCount(tag);
                    const valuesList = tag.values || [];
                    const isBuiltin = Boolean(tag.isBuiltin);
                    const builtinSet = new Set(tag.builtinValues || tag.values || []);

                    return (
                      <div
                        key={tag.id}
                        className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between gap-3 group hover:shadow-sm ${
                          isBuiltin
                            ? 'border-slate-200/90 bg-slate-50/40 hover:bg-white'
                            : 'border-amber-200/80 bg-amber-50/20 hover:bg-white'
                        }`}
                      >
                        {/* Top: Tag Key Header & Built-in vs Custom Badges */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${getTagBadgeStyle(
                                  tag.color
                                )}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${getTagDotColor(tag.color)}`} />
                                <span>{tag.name}</span>
                              </span>

                              {/* Prominent Builtin vs Custom Indicator */}
                              {isBuiltin ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 shadow-2xs">
                                  <Building2 className="w-3 h-3 text-blue-600" />
                                  <span>公司内置标准</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 shadow-2xs">
                                  <Tag className="w-3 h-3 text-amber-600" />
                                  <span>团队自定义</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-medium px-2 py-0.5 bg-white text-slate-500 rounded-md border border-slate-200/70 shrink-0">
                                {tag.categoryGroup}
                              </span>
                              <button
                                onClick={(e) => handleOpenEditTag(tag, e)}
                                title="编辑标签名及配置"
                                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleOpenDeleteTag(tag, e)}
                                title="删除标签"
                                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
                              <span>总计关联 {usageCount} 篇知识</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap max-h-32 overflow-y-auto custom-scrollbar p-1.5 bg-white rounded-xl border border-slate-100">
                            {valuesList.length === 0 ? (
                              <span className="text-[11px] text-slate-400 italic py-1 px-1">
                                暂无预设值，请在下方快速添加
                              </span>
                            ) : (
                              valuesList.map((val) => {
                                const valUsage = getTagValueUsageCount(tag.name, val);
                                const isCustomVal = isBuiltin && !builtinSet.has(val);

                                return (
                                  <span
                                    key={val}
                                    onClick={() => setActiveTagForArticlesDrawer({ tag, value: val })}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-all hover:scale-102 group/val ${
                                      isCustomVal
                                        ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                                    }`}
                                    title={`点击查阅「${tag.name}: ${val}」关联知识${isCustomVal ? ' (团队自定义扩充值)' : ''}`}
                                  >
                                    <span className="font-semibold">{val}</span>
                                    {isCustomVal && (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-200/80 text-amber-900 font-bold">
                                        自
                                      </span>
                                    )}
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
                            placeholder={`+ 为「${tag.name}」扩充新值，回车确认...`}
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
                <div className="pt-4 mt-3 border-t border-slate-100/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>显示 {filteredTags.length} 组成对标签维度（支持标签名与标签值对齐）</span>
                  <span>输入框内按回车可极速添加新标签值</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 版本记录 (Version Release Log) */}
        {/* ========================================================================= */}
        {currentView === '版本记录' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <GitBranch className="w-4 h-4 text-[#EA3A20]" /> 知识库大版本迭代与安全审计
              </h2>

              <div className="space-y-4">
                {versions.map((ver, idx) => (
                  <div key={idx} className="p-4.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-[#EA3A20]">{ver.version}</span>
                      <span className="text-slate-400">{ver.releaseDate} by {ver.author}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100 font-medium">
                      {ver.changeLog}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>已同步覆盖 {ver.articleCount} 条业务条款与问答索引</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 线上生效中
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
                  <div className="mx-6 mt-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 shrink-0">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold">当前知识条目为【草稿】状态（未发布）</p>
                      <p className="text-[11px] text-slate-600">
                        您可以自由完善知识内容、适用岗位与标签配置，保存并提交复核。
                      </p>
                    </div>
                  </div>
                )}
                {editingArticle.pendingVersion && (
                  <div className="mx-6 mt-3 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800 shrink-0">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold">当前已有新版本【{editingArticle.pendingVersion}】在复核中</p>
                      <p className="text-[11px] text-amber-700">
                        当前生效版本为 {editingArticle.version}，继续保存将覆盖复核中的待审核版本草稿。
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 3 Step Tabs Navigation Header */}
            <div className="px-6 pt-3 pb-2 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setArticleModalStepTab('content')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    articleModalStepTab === 'content'
                      ? 'bg-white text-[#EA3A20] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    articleModalStepTab === 'content' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>1</span>
                  <span>设置知识内容</span>
                </button>

                <button
                  type="button"
                  onClick={() => setArticleModalStepTab('tags')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    articleModalStepTab === 'tags'
                      ? 'bg-white text-[#EA3A20] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    articleModalStepTab === 'tags' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>2</span>
                  <span>打标签</span>
                </button>

                <button
                  type="button"
                  onClick={() => setArticleModalStepTab('permissions')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    articleModalStepTab === 'permissions'
                      ? 'bg-white text-[#EA3A20] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    articleModalStepTab === 'permissions' ? 'bg-[#EA3A20] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>3</span>
                  <span>配置业务范围和权限</span>
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
                  setArticleFormVideoDuration={setArticleFormVideoDuration}
                  articleFormVideoCover={articleFormVideoCover}
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
                  articleFormRoles={articleFormRoles}
                  setArticleFormRoles={setArticleFormRoles}
                  isRolesDropdownOpen={isRolesDropdownOpen}
                  setIsRolesDropdownOpen={setIsRolesDropdownOpen}
                  customRoleInput={customRoleInput}
                  setCustomRoleInput={setCustomRoleInput}
                  PRESET_ROLES={PRESET_ROLES}
                  articleFormRegions={articleFormRegions}
                  setArticleFormRegions={setArticleFormRegions}
                  isRegionsDropdownOpen={isRegionsDropdownOpen}
                  setIsRegionsDropdownOpen={setIsRegionsDropdownOpen}
                  customRegionInput={customRegionInput}
                  setCustomRegionInput={setCustomRegionInput}
                  PRESET_REGIONS={PRESET_REGIONS}
                  articleFormSecurityLevel={articleFormSecurityLevel}
                  setArticleFormSecurityLevel={setArticleFormSecurityLevel}
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
                      ? '保存并提交'
                      : '保存并更新向量库'}
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
      {/* MODAL 4: MOVE CATEGORY DRAWER (右侧抽屉式面板) */}
      {/* ========================================================================= */}
      {moveTargetArticle && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMoveTargetArticle(null)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
      {/* MODAL 5: ADD CATEGORY DRAWER (右侧抽屉式面板) */}
      {/* ========================================================================= */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsAddCatModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">分类唯一编码 (Code)</label>
                  <input
                    type="text"
                    placeholder="例如：KB-PROD-BATH"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20]"
                  />
                  <p className="text-[11px] text-slate-400">用于系统或外部 API 对接的唯一标识码，留空自动生成</p>
                </div>

                {/* 平台管理员复核策略配置 */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-start justify-between gap-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>开启平台管理员复核 (发布控制)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        设置此分类下的知识上传、编辑或删除时是否需要平台管理员复核。开启后条目必须复核通过才能正式发布。
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={newCatRequireReview}
                        onChange={(e) => setNewCatRequireReview(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {newCatRequireReview && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 animate-in fade-in">
                      <span className="text-[11px] font-bold text-slate-700 block">触发复核的具体操作场景</span>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={newCatReviewTriggers.onUpload}
                            onChange={(e) =>
                              setNewCatReviewTriggers((prev) => ({ ...prev, onUpload: e.target.checked }))
                            }
                            className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-xs text-slate-700 font-medium">上传新知识</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={newCatReviewTriggers.onEdit}
                            onChange={(e) =>
                              setNewCatReviewTriggers((prev) => ({ ...prev, onEdit: e.target.checked }))
                            }
                            className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-xs text-slate-700 font-medium">编辑修改</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={newCatReviewTriggers.onDelete}
                            onChange={(e) =>
                              setNewCatReviewTriggers((prev) => ({ ...prev, onDelete: e.target.checked }))
                            }
                            className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-xs text-slate-700 font-medium">删除知识</span>
                        </label>
                      </div>
                    </div>
                  )}
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
      {/* MODAL 6: EDIT CATEGORY DRAWER (右侧抽屉式面板) */}
      {/* ========================================================================= */}
      {isEditCatModalOpen && editingCatNode && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsEditCatModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">分类唯一编码 (Code)</label>
                  <input
                    type="text"
                    value={editCatCode}
                    onChange={(e) => setEditCatCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20]"
                  />
                </div>

                {/* 平台管理员复核策略配置 */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-start justify-between gap-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>开启平台管理员复核 (发布控制)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        设置此分类下的知识上传、编辑或删除时是否需要平台管理员复核。开启后条目必须复核通过才能正式发布。
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={editCatRequireReview}
                        onChange={(e) => setEditCatRequireReview(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {editCatRequireReview && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 animate-in fade-in">
                      <span className="text-[11px] font-bold text-slate-700 block">触发复核的具体操作场景</span>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={editCatReviewTriggers.onUpload}
                            onChange={(e) =>
                              setEditCatReviewTriggers((prev) => ({ ...prev, onUpload: e.target.checked }))
                            }
                            className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-xs text-slate-700 font-medium">上传新知识</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={editCatReviewTriggers.onEdit}
                            onChange={(e) =>
                              setEditCatReviewTriggers((prev) => ({ ...prev, onEdit: e.target.checked }))
                            }
                            className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-xs text-slate-700 font-medium">编辑修改</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={editCatReviewTriggers.onDelete}
                            onChange={(e) =>
                              setEditCatReviewTriggers((prev) => ({ ...prev, onDelete: e.target.checked }))
                            }
                            className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-xs text-slate-700 font-medium">删除知识</span>
                        </label>
                      </div>
                    </div>
                  )}
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
      {/* MODAL 7: CREATE SINGLE TAG DRAWER (成对标签创建 - 右侧抽屉) */}
      {/* ========================================================================= */}
      {isAddTagModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsAddTagModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              {/* Role Permission Notice Banner */}
              {currentUserRole !== 'admin' && (
                <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>权限说明：仅平台管理可新增内置标签</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-tight">
                    当前操作身份为【普通人员/业务员】，新建标签默认作为【团队自定义标签】。公司内置标准标签需由平台管理员统一定义。
                  </p>
                </div>
              )}

              {/* Tag Nature Selector: Built-in vs Custom */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-red-500 mr-1">*</span>标签性质类型
                  </label>
                  {currentUserRole === 'admin' ? (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>平台管理员特权</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      普通人员默认自定义
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUserRole === 'admin') {
                        setNewTagIsBuiltin(true);
                      } else {
                        showToast('⚠️ 权限限制：只有平台管理才可以新增内置标签，其他人员默认新增自定义标签。');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      currentUserRole !== 'admin'
                        ? 'opacity-60 bg-slate-100/70 border-dashed border-slate-200 cursor-not-allowed'
                        : newTagIsBuiltin
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 shrink-0 mt-0.5 ${newTagIsBuiltin && currentUserRole === 'admin' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs block">🏢 公司内置标准</span>
                        {currentUserRole !== 'admin' && (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.2 rounded">
                            🔒 仅平台管理
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        全公司统一的标准标签体系，规范统一下发
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTagIsBuiltin(false)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      !newTagIsBuiltin || currentUserRole !== 'admin'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Tag className={`w-4 h-4 shrink-0 mt-0.5 ${!newTagIsBuiltin || currentUserRole !== 'admin' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs block">🏷️ 团队自定义</span>
                        {currentUserRole !== 'admin' && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            ✓ 默认适用
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        由业务团队个性化扩充的灵活维度
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>标签名称 / 维度名 <span className="text-[11px] text-slate-400 font-normal">(例如：风格、色系、材质、空间、环保等级)</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：风格 或 色系"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  预设标签候选值 (以逗号、顿号或换行分隔)
                </label>
                <textarea
                  rows={4}
                  placeholder="例如：地中海、现代简约、意式极简、轻奢、新中式"
                  value={newTagValuesInput}
                  onChange={(e) => setNewTagValuesInput(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] resize-y leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 min-w-0">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-red-500 mr-1">*</span>业务分组
                  </label>
                  <select
                    value={newTagGroup}
                    onChange={(e) => setNewTagGroup(e.target.value)}
                    className="w-full min-w-0 max-w-full truncate px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] cursor-pointer text-xs"
                  >
                    <option value="通用">🌐 通用 (全库通用维度)</option>
                    {kbFirstLevelCategories.map((catName) => (
                      <option key={catName} value={catName}>
                        📁 {catName}
                      </option>
                    ))}
                    {allTagGroupOptions
                      .filter((g) => g !== '通用' && !kbFirstLevelCategories.includes(g))
                      .map((grp) => (
                        <option key={grp} value={grp}>
                          🏷️ {grp}
                        </option>
                      ))}
                    <option value="__custom__">+ 自定义新分组...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">色彩视觉标识</label>
                  <div className="flex items-center gap-1.5 pt-2 flex-wrap">
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
              </div>

              {newTagGroup === '__custom__' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-red-500 mr-1">*</span>输入新分组名称
                  </label>
                  <input
                    type="text"
                    placeholder="输入自定义分组名称..."
                    value={newTagCustomGroup}
                    onChange={(e) => setNewTagCustomGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] text-xs"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">标签说明与适用场景</label>
                <textarea
                  rows={2}
                  placeholder="简要说明此成对标签维度的用途、业务定义..."
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
      {/* MODAL 8: BATCH ADD TAGS DRAWER (批量成对标签导入 - 右侧抽屉) */}
      {/* ========================================================================= */}
      {isBatchAddTagModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsBatchAddTagModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              <div className="space-y-1.5 min-w-0">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>批量归属分组
                </label>
                <select
                  value={batchTagGroup}
                  onChange={(e) => setBatchTagGroup(e.target.value)}
                  className="w-full min-w-0 max-w-full truncate px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] cursor-pointer text-xs"
                >
                  <option value="通用">🌐 通用 (全库通用维度)</option>
                  {kbFirstLevelCategories.map((catName) => (
                    <option key={catName} value={catName}>
                      📁 {catName}
                    </option>
                  ))}
                  {allTagGroupOptions
                    .filter((g) => g !== '通用' && !kbFirstLevelCategories.includes(g))
                    .map((grp) => (
                      <option key={grp} value={grp}>
                        🏷️ {grp}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>标签名与值列表 (支持成对格式，每行一条)
                </label>
                <textarea
                  rows={8}
                  placeholder="格式示例：&#10;风格: 地中海、现代简约、意式极简&#10;色系: 暖色调、冷色调、黑白灰&#10;五金配件: 百隆阻尼、海蒂诗导轨"
                  value={batchTagsInput}
                  onChange={(e) => setBatchTagsInput(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] resize-y"
                />
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-700 leading-relaxed space-y-1">
                <p className="font-bold">💡 格式提示说明：</p>
                <p>支持以冒号分隔标签名与标签值（如 <code>风格: 地中海、现代</code>），系统将自动解析构建成对标签体系。</p>
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
                <span>批量导入创建</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 9: EDIT TAG DRAWER (成对标签编辑 - 右侧抽屉) */}
      {/* ========================================================================= */}
      {isEditTagModalOpen && editingTag && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsEditTagModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EA3A20] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">编辑成对标签维度</h3>
                  <p className="text-[11px] text-slate-400">修改标签维度定义、预设值与颜色分组</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditTagModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-xs">
              {/* Role Permission Notice Banner */}
              {currentUserRole !== 'admin' && (
                <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>权限说明：非平台管理员不可修改或设为内置标签</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-tight">
                    当前操作身份为【普通人员/业务员】。内置标准标签由平台管理统一定义维护。
                  </p>
                </div>
              )}

              {/* Tag Nature Selector: Built-in vs Custom */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-red-500 mr-1">*</span>标签性质类型
                  </label>
                  {currentUserRole === 'admin' ? (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>平台管理员特权</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      普通人员
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUserRole === 'admin') {
                        setEditTagIsBuiltin(true);
                      } else {
                        showToast('⚠️ 权限限制：只有平台管理才可以设置或维护内置标签。');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      currentUserRole !== 'admin' && !editTagIsBuiltin
                        ? 'opacity-60 bg-slate-100/70 border-dashed border-slate-200 cursor-not-allowed'
                        : editTagIsBuiltin
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 shrink-0 mt-0.5 ${editTagIsBuiltin ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs block">🏢 公司内置标准</span>
                        {currentUserRole !== 'admin' && (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.2 rounded">
                            🔒 仅平台管理
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        全公司统一的标准标签体系
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentUserRole === 'admin' || !editingTag?.isBuiltin) {
                        setEditTagIsBuiltin(false);
                      } else {
                        showToast('⚠️ 权限限制：普通人员不可修改内置标签性质。');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      !editTagIsBuiltin
                        ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Tag className={`w-4 h-4 shrink-0 mt-0.5 ${!editTagIsBuiltin ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs block">🏷️ 团队自定义</span>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        业务团队个性化扩充的维度
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  <span className="text-red-500 mr-1">*</span>标签名称 / 维度名
                </label>
                <input
                  type="text"
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] text-xs"
                />
                <p className="text-[11px] text-amber-600 mt-1">
                  注意：修改标签名将自动同步更新所有已关联的知识条目标签。
                </p>
              </div>

              {/* Tag Values Manager inside Edit Modal */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <label className="font-bold text-slate-700 block flex items-center justify-between">
                  <span>标签候选值列表 ({editTagValues.length})</span>
                  <span className="text-[11px] text-slate-400 font-normal">点击删除或在下方添加</span>
                </label>

                <div className="flex items-center gap-1.5 flex-wrap min-h-12 p-2 bg-white rounded-lg border border-slate-200">
                  {editTagValues.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">暂无标签值</span>
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
                    placeholder="输入新标签值，回车或点击添加..."
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
                    添加值
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 min-w-0">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-red-500 mr-1">*</span>业务分组
                  </label>
                  <select
                    value={editTagGroup}
                    onChange={(e) => setEditTagGroup(e.target.value)}
                    className="w-full min-w-0 max-w-full truncate px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] cursor-pointer text-xs"
                  >
                    <option value="通用">🌐 通用 (全库通用维度)</option>
                    {kbFirstLevelCategories.map((catName) => (
                      <option key={catName} value={catName}>
                        📁 {catName}
                      </option>
                    ))}
                    {allTagGroupOptions
                      .filter((g) => g !== '通用' && !kbFirstLevelCategories.includes(g))
                      .map((grp) => (
                        <option key={grp} value={grp}>
                          🏷️ {grp}
                        </option>
                      ))}
                    <option value="__custom__">+ 自定义新分组...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">色彩视觉标识</label>
                  <div className="flex items-center gap-1.5 pt-2 flex-wrap">
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
              </div>

              {editTagGroup === '__custom__' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="font-bold text-slate-700 block">
                    <span className="text-red-500 mr-1">*</span>输入新分组名称
                  </label>
                  <input
                    type="text"
                    placeholder="输入自定义分组名称..."
                    value={editTagCustomGroup}
                    onChange={(e) => setEditTagCustomGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EA3A20] text-xs"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">标签说明与适用场景</label>
                <textarea
                  rows={2}
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
      {/* MODAL 10: DELETE TAG CONFIRMATION DRAWER (删除标签确认 - 右侧抽屉) */}
      {/* ========================================================================= */}
      {isDeleteTagModalOpen && deletingTag && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsDeleteTagModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
      {/* MODAL 11: BATCH DELETE TAGS CONFIRMATION DRAWER (批量删除标签 - 右侧抽屉) */}
      {/* ========================================================================= */}
      {isBatchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsBatchDeleteModalOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
      {/* MODAL 12: ACTIVE TAG ARTICLES DRAWER (标签关联条目抽屉) */}
      {/* ========================================================================= */}
      {activeTagForArticlesDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setActiveTagForArticlesDrawer(null)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-in slide-in-from-right duration-200">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
