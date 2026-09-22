import React, { useState, useMemo } from 'react';
import {
  FileText,
  FileCode,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  Check,
  Code,
  Eye,
  FileSpreadsheet,
  File,
  Search
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface SkillFileItem {
  name: string; // Full relative path, e.g. "SKILL.md", "data/stacks/react.csv"
  content: string;
  isMain?: boolean;
}

interface TreeNode {
  name: string; // folder or file name
  path: string; // full path
  isFolder: boolean;
  children?: TreeNode[];
  fileItem?: SkillFileItem;
}

interface SkillFileExplorerProps {
  files: SkillFileItem[];
  skillName: string;
  skillCode: string;
  onUpdateFiles: (updatedFiles: SkillFileItem[]) => void;
}

export const SkillFileExplorer: React.FC<SkillFileExplorerProps> = ({
  files,
  skillName,
  skillCode,
  onUpdateFiles
}) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('SKILL.md');
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'data': true,
    'data/stacks': true,
    'templates': true,
    'scripts': true
  });
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Main file (SKILL.md)
  const mainFile = useMemo(() => {
    return files.find((f) => f.name === 'SKILL.md' || f.isMain) || files[0] || {
      name: 'SKILL.md',
      content: '',
      isMain: true
    };
  }, [files]);

  // Subsidiary files (all except SKILL.md)
  const subsidiaryFiles = useMemo(() => {
    return files.filter((f) => f.name !== mainFile.name);
  }, [files, mainFile]);

  // Selected file item
  const selectedFile = useMemo(() => {
    return files.find((f) => f.name === selectedFilePath) || mainFile;
  }, [files, selectedFilePath, mainFile]);

  // Build hierarchical file tree for subsidiary files
  const fileTree = useMemo(() => {
    const root: TreeNode = { name: 'root', path: '', isFolder: true, children: [] };

    const filtered = subsidiaryFiles.filter((f) =>
      searchFilter ? f.name.toLowerCase().includes(searchFilter.toLowerCase()) : true
    );

    filtered.forEach((file) => {
      const parts = file.name.split('/');
      let current = root;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');

        if (isLast) {
          current.children = current.children || [];
          current.children.push({
            name: part,
            path: currentPath,
            isFolder: false,
            fileItem: file
          });
        } else {
          current.children = current.children || [];
          let folderNode = current.children.find((c) => c.isFolder && c.name === part);
          if (!folderNode) {
            folderNode = {
              name: part,
              path: currentPath,
              isFolder: true,
              children: []
            };
            current.children.push(folderNode);
          }
          current = folderNode;
        }
      });
    });

    // Sort folders first, then files alphabetically
    const sortNodes = (node: TreeNode) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.isFolder === b.isFolder) {
            return a.name.localeCompare(b.name);
          }
          return a.isFolder ? -1 : 1;
        });
        node.children.forEach(sortNodes);
      }
    };
    sortNodes(root);

    return root.children || [];
  }, [subsidiaryFiles, searchFilter]);

  const toggleFolder = (folderPath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const handleCopyContent = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContentChange = (newContent: string) => {
    const updated = files.map((f) =>
      f.name === selectedFile.name ? { ...f, content: newContent } : f
    );
    onUpdateFiles(updated);
  };

  const handleAddNewFile = () => {
    const fileName = window.prompt('请输入新文件路径（例如 data/custom_rule.json 或 script.py）:', 'data/new_config.json');
    if (!fileName || !fileName.trim()) return;

    const trimmed = fileName.trim();
    if (files.some((f) => f.name === trimmed)) {
      alert('该文件已存在！');
      setSelectedFilePath(trimmed);
      return;
    }

    const newFile: SkillFileItem = {
      name: trimmed,
      content: trimmed.endsWith('.json')
        ? JSON.stringify(
            {
              name: trimmed,
              version: '1.0.0',
              rules: [
                { id: 1, key: 'rule_01', name: '示例配置', enabled: true }
              ]
            },
            null,
            2
          )
        : `// ${trimmed}\n\nexport default {\n  name: "${trimmed}"\n};\n`,
      isMain: false
    };

    onUpdateFiles([...files, newFile]);
    setSelectedFilePath(trimmed);

    // Expand parent folders
    const parts = trimmed.split('/');
    if (parts.length > 1) {
      const parentPaths: Record<string, boolean> = {};
      for (let i = 1; i < parts.length; i++) {
        parentPaths[parts.slice(0, i).join('/')] = true;
      }
      setExpandedFolders((prev) => ({ ...prev, ...parentPaths }));
    }
  };

  const handleDeleteFile = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (filePath === 'SKILL.md' || filePath === mainFile.name) {
      alert('主文件 SKILL.md 不可删除！');
      return;
    }
    if (window.confirm(`确定要删除文件 ${filePath} 吗？`)) {
      const updated = files.filter((f) => f.name !== filePath);
      onUpdateFiles(updated);
      if (selectedFilePath === filePath) {
        setSelectedFilePath(mainFile.name);
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    if (fileName.endsWith('.json')) return <FileCode className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    if (fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.py')) {
      return <FileCode className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
    }
    return <File className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
  };

  // Render a tree node recursively
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    if (node.isFolder) {
      const isExpanded = expandedFolders[node.path] !== false; // default true
      return (
        <div key={node.path} className="select-none">
          <div
            onClick={(e) => toggleFolder(node.path, e)}
            className="flex items-center gap-1 px-1.5 py-1 text-xs text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            style={{ paddingLeft: `${depth * 14 + 6}px` }}
          >
            <span className="text-slate-400 p-0.5">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
            {isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="font-medium text-slate-700 truncate">{node.name}</span>
          </div>

          {isExpanded && node.children && (
            <div className="space-y-0.5">
              {node.children.map((child) => renderTreeNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf file node
    const isSelected = selectedFilePath === node.path;
    return (
      <div
        key={node.path}
        onClick={() => setSelectedFilePath(node.path)}
        className={`group flex items-center justify-between px-2 py-1 text-xs rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
        style={{ paddingLeft: `${depth * 14 + 18}px` }}
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {getFileIcon(node.name)}
          <span className="truncate" title={node.name}>
            {node.name}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => handleDeleteFile(node.path, e)}
          className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-0.5 rounded transition-opacity"
          title="删除文件"
        >
          <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
        </button>
      </div>
    );
  };

  // Render CSV content nicely as a preview table
  const renderCsvPreview = (csvContent: string) => {
    const lines = csvContent.trim().split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      return <div className="text-slate-400 text-xs italic">空文件</div>;
    }
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map((line) => line.split(',').map((c) => c.trim().replace(/^"|"$/g, '')));

    return (
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-3.5 py-2.5 font-semibold text-slate-900 border-r border-slate-200 last:border-r-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3.5 py-2 font-mono text-[11px] border-r border-slate-100 last:border-r-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden bg-white">
      {/* 1. Left Sidebar: Hierarchical File Tree matching user's screenshot */}
      <div className="w-68 border-r border-slate-200/90 bg-[#FAFBFB] flex flex-col shrink-0 min-h-0 select-none">
        
        {/* Top Header / Search */}
        <div className="p-3 border-b border-slate-200/70 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Skill 文件系统</span>
            <button
              type="button"
              onClick={handleAddNewFile}
              className="text-[11px] font-bold text-[#EA3A20] hover:bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
              title="添加新文件"
            >
              <Plus className="w-3 h-3" />
              <span>新建</span>
            </button>
          </div>
          {subsidiaryFiles.length > 8 && (
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="搜索文件..."
                className="w-full pl-7 pr-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
          )}
        </div>

        {/* Tree Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
          
          {/* Main File Section */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 px-2 pt-1">主文件</div>
            <div
              onClick={() => setSelectedFilePath(mainFile.name)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                selectedFilePath === mainFile.name
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100/60'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="truncate">{mainFile.name}</span>
            </div>
          </div>

          {/* Subsidiary Files Section */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 px-2 pt-1 flex items-center justify-between">
              <span>附属文件 {subsidiaryFiles.length}</span>
            </div>

            <div className="space-y-0.5">
              {fileTree.map((node) => renderTreeNode(node, 0))}
            </div>
          </div>

        </div>

      </div>

      {/* 2. Right Pane: Document Preview / Source Editor matching screenshot */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* Breadcrumb / Top Bar */}
        <div className="px-6 py-2.5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800">
            <span className="text-slate-400">/</span>
            <span>{selectedFile.name}</span>
            {selectedFile.isMain && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-sans font-medium">
                主规范文件
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>预览</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'edit'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3 h-3" />
                <span>源码编辑</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyContent}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="复制当前文件内容"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制'}</span>
            </button>
          </div>
        </div>

        {/* File Content Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {viewMode === 'edit' ? (
            <div className="h-full flex flex-col space-y-2">
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>编辑模式 · 支持实时修改并与技能同步</span>
                <span>{selectedFile.content.length} 字符</span>
              </div>
              <textarea
                value={selectedFile.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full flex-1 min-h-[420px] bg-slate-900 text-slate-100 font-mono text-xs p-5 rounded-2xl border border-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#EA3A20] resize-none custom-scrollbar shadow-inner"
                placeholder="在此编写或修改文件内容..."
              />
            </div>
          ) : (
            /* Preview Mode - Styled exactly like the user's screenshot */
            <div className="max-w-4xl mx-auto space-y-6">
              {selectedFile.name.endsWith('.md') ? (
                <div className="markdown-body space-y-5 text-slate-800">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 pb-2 mb-3">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-bold text-slate-900 pt-4 pb-1 mb-2 border-b border-slate-100">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-bold text-slate-900 pt-2 mb-1">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm text-slate-700 leading-relaxed mb-3">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-slate-900">{children}</strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 mb-4">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700 mb-4">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      code: ({ className, children, ...props }) => {
                        const isInline = !className && typeof children === 'string' && !children.includes('\n');
                        if (isInline) {
                          return (
                            <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs border border-slate-200">
                              {children}
                            </code>
                          );
                        }
                        return (
                          <div className="my-3 rounded-2xl bg-[#F4F4F5] p-4 font-mono text-xs text-slate-900 border border-slate-200/60 overflow-x-auto shadow-2xs leading-relaxed">
                            <code>{children}</code>
                          </div>
                        );
                      },
                      pre: ({ children }) => <>{children}</>,
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl">
                          <table className="w-full text-xs text-left divide-y divide-slate-200">{children}</table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="px-3 py-2 bg-slate-50 font-bold text-slate-800">{children}</th>
                      ),
                      td: ({ children }) => <td className="px-3 py-2 border-t border-slate-100">{children}</td>
                    }}
                  >
                    {selectedFile.content}
                  </Markdown>
                </div>
              ) : selectedFile.name.endsWith('.json') ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 font-mono flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-amber-600" />
                      <span>{selectedFile.name} (JSON 数据预览)</span>
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                      标准 JSON 格式
                    </span>
                  </div>
                  <div className="rounded-2xl bg-[#0F172A] p-5 font-mono text-xs text-emerald-300 border border-slate-800 overflow-x-auto leading-relaxed shadow-lg">
                    <pre className="text-slate-100">{selectedFile.content}</pre>
                  </div>
                </div>
              ) : selectedFile.name.endsWith('.csv') ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">数据表预览 ({selectedFile.name})</div>
                  {renderCsvPreview(selectedFile.content)}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#F4F4F5] p-5 font-mono text-xs text-slate-900 border border-slate-200 overflow-x-auto leading-relaxed">
                  <pre>{selectedFile.content}</pre>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
