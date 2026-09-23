import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ChevronRight,
  ChevronDown,
  Check,
  Building2,
  Users,
  Folder,
  CheckSquare,
  Square,
  MinusSquare,
  Sparkles
} from 'lucide-react';
import { OrgDeptNode } from '../../types';
import { initialOrgTree } from '../../data/mockData';

export interface DeptTreeSelectProps {
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  placeholder?: string;
  allowAll?: boolean; // For multi-select: whether to support "全公司/全员"
  themeColor?: 'purple' | 'blue' | 'red';
  className?: string;
}

export const DeptTreeSelect: React.FC<DeptTreeSelectProps> = ({
  value,
  onChange,
  multiple = false,
  placeholder = '请选择部门',
  allowAll = false,
  themeColor = 'purple',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(() => {
    // Default expand all first-level nodes
    return new Set(initialOrgTree.map((n) => n.id));
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Selected values normalized to array
  const selectedValues: string[] = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : value ? [value] : [];
    }
    return typeof value === 'string' && value ? [value] : [];
  }, [value, multiple]);

  const isAllSelected = multiple && selectedValues.includes('全公司/全员');

  // Filter tree nodes by search query
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialOrgTree;
    }

    const q = searchQuery.trim().toLowerCase();

    const filterNode = (node: OrgDeptNode): OrgDeptNode | null => {
      const isMatch = node.name.toLowerCase().includes(q);
      const matchedChildren: OrgDeptNode[] = [];

      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const filteredChild = filterNode(child);
          if (filteredChild) {
            matchedChildren.push(filteredChild);
          }
        }
      }

      if (isMatch || matchedChildren.length > 0) {
        return {
          ...node,
          children: matchedChildren.length > 0 ? matchedChildren : node.children
        };
      }

      return null;
    };

    const results: OrgDeptNode[] = [];
    for (const root of initialOrgTree) {
      const res = filterNode(root);
      if (res) {
        results.push(res);
      }
    }
    return results;
  }, [searchQuery]);

  // Expand matching nodes when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const allIds = new Set<string>();
      const collectIds = (nodes: OrgDeptNode[]) => {
        for (const n of nodes) {
          allIds.add(n.id);
          if (n.children) collectIds(n.children);
        }
      };
      collectIds(filteredTree);
      setExpandedNodeIds(allIds);
    }
  }, [searchQuery, filteredTree]);

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleSelectNode = (deptName: string) => {
    if (multiple) {
      if (deptName === '全公司/全员') {
        onChange(['全公司/全员']);
        return;
      }

      let next: string[];
      const withoutAll = selectedValues.filter((v) => v !== '全公司/全员');
      if (withoutAll.includes(deptName)) {
        next = withoutAll.filter((v) => v !== deptName);
      } else {
        next = [...withoutAll, deptName];
      }

      if (next.length === 0 && allowAll) {
        next = ['全公司/全员'];
      }
      onChange(next);
    } else {
      onChange(deptName);
      setIsOpen(false);
    }
  };

  const handleRemoveTag = (deptName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const next = selectedValues.filter((v) => v !== deptName);
      if (next.length === 0 && allowAll) {
        onChange(['全公司/全员']);
      } else {
        onChange(next);
      }
    } else {
      onChange('');
    }
  };

  // Theme color styling
  const themeClasses = {
    purple: {
      badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
      activeItem: 'bg-purple-50 text-purple-700 font-bold border-purple-200',
      checkIcon: 'text-purple-600',
      dot: 'bg-purple-500',
      focusRing: 'focus:border-purple-500 focus:ring-purple-500/20'
    },
    blue: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
      activeItem: 'bg-blue-50 text-blue-700 font-bold border-blue-200',
      checkIcon: 'text-blue-600',
      dot: 'bg-blue-500',
      focusRing: 'focus:border-blue-500 focus:ring-blue-500/20'
    },
    red: {
      badge: 'bg-red-50 text-[#EA3A20] border-red-200/80',
      activeItem: 'bg-red-50 text-[#EA3A20] font-bold border-red-200',
      checkIcon: 'text-[#EA3A20]',
      dot: 'bg-[#EA3A20]',
      focusRing: 'focus:border-[#EA3A20] focus:ring-red-500/20'
    }
  }[themeColor];

  // Render tree node recursive
  const renderTreeNode = (node: OrgDeptNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isSelected = selectedValues.includes(node.name);

    return (
      <React.Fragment key={node.id}>
        <div
          onClick={() => handleSelectNode(node.name)}
          style={{ paddingLeft: `${depth * 18 + 8}px` }}
          className={`flex items-center justify-between py-1.5 pr-2.5 rounded-lg text-xs cursor-pointer transition-colors group ${
            isSelected
              ? themeClasses.activeItem
              : 'text-slate-700 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors shrink-0 cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}

            {depth === 0 ? (
              <Building2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? themeClasses.checkIcon : 'text-slate-400 group-hover:text-slate-600'}`} />
            ) : (
              <Users className={`w-3.5 h-3.5 shrink-0 ${isSelected ? themeClasses.checkIcon : 'text-slate-400 group-hover:text-slate-600'}`} />
            )}

            <span className="truncate font-medium">{node.name}</span>
          </div>

          {/* Right indicator: Checkbox for multiple or check icon for single */}
          <div className="shrink-0 flex items-center">
            {multiple ? (
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                  isSelected
                    ? themeColor === 'purple'
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : themeColor === 'blue'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-[#EA3A20] border-[#EA3A20] text-white'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            ) : (
              isSelected && <Check className={`w-4 h-4 ${themeClasses.checkIcon} stroke-[2.5]`} />
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[42px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-all hover:bg-slate-100/70 ${
          isOpen ? `ring-2 ${themeColor === 'purple' ? 'ring-purple-500/20 border-purple-500' : 'ring-blue-500/20 border-blue-500'} bg-white` : ''
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="text-slate-400 text-xs">{placeholder}</span>
          ) : multiple ? (
            selectedValues.map((dept) => (
              <span
                key={dept}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border shadow-2xs ${themeClasses.badge}`}
              >
                <span>{dept}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveTag(dept, e)}
                  className="hover:opacity-75 transition-opacity cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className={`w-2 h-2 rounded-full ${themeClasses.dot} shrink-0`} />
              <span>{selectedValues[0]}</span>
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-1 text-slate-400">
          {multiple && selectedValues.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200/80 text-slate-600">
              {selectedValues.length}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-slate-600' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Tree Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-3 animate-in fade-in zoom-in-95 duration-150 max-h-[360px] flex flex-col">
          {/* Search Input (按部门名称查询) */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="按部门名称查询..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-300"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Option: 全公司/全员 (if allowAll & multiple) */}
          {multiple && allowAll && !searchQuery && (
            <div className="pb-2 mb-2 border-b border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectNode('全公司/全员')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isAllSelected
                    ? themeClasses.activeItem
                    : 'text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-3.5 h-3.5 ${isAllSelected ? themeClasses.checkIcon : 'text-amber-500'}`} />
                  <span>全公司 / 全员 (开放全部部门查阅)</span>
                </div>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    isAllSelected
                      ? themeColor === 'purple'
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : themeColor === 'blue'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-[#EA3A20] border-[#EA3A20] text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          )}

          {/* Tree Node List */}
          <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
            {filteredTree.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                未找到匹配「{searchQuery}」的部门
              </div>
            ) : (
              filteredTree.map((rootNode) => renderTreeNode(rootNode, 0))
            )}
          </div>

          {/* Bottom Actions for Multi-select */}
          {multiple && (
            <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                已选 <strong className="text-slate-700">{selectedValues.length}</strong> 个部门
              </span>
              <div className="flex items-center gap-2">
                {selectedValues.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange(allowAll ? ['全公司/全员'] : [])}
                    className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    重置
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
