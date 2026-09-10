import { useState, useCallback, ClipboardEvent, DragEvent } from 'react';

export interface ChatAttachmentItem {
  id: string;
  file?: File;
  name: string;
  size: string;
  type: 'image' | 'file';
  previewUrl: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function useChatAttachment() {
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachmentItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Process a list of File objects (from paste or drop or file picker)
  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(file.name);
      const id = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const sizeStr = formatFileSize(file.size);

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewUrl = (e.target?.result as string) || URL.createObjectURL(file);
          setPendingAttachments((prev) => [
            ...prev,
            {
              id,
              file,
              name: file.name || `剪贴板截图_${new Date().toLocaleTimeString().replace(/:/g, '')}.png`,
              size: sizeStr,
              type: 'image',
              previewUrl
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        const previewUrl = URL.createObjectURL(file);
        setPendingAttachments((prev) => [
          ...prev,
          {
            id,
            file,
            name: file.name,
            size: sizeStr,
            type: 'file',
            previewUrl
          }
        ]);
      }
    });
  }, []);

  // Handle Ctrl+V (or Cmd+V) paste
  const handlePaste = useCallback(
    (e: ClipboardEvent<any>) => {
      // 1. Check clipboardData.files
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        e.preventDefault();
        processFiles(files);
        return;
      }

      // 2. Check clipboardData.items for image or file items (e.g. screenshot pasted directly)
      const items = e.clipboardData?.items;
      if (items) {
        const extractedFiles: File[] = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) extractedFiles.push(file);
          }
        }
        if (extractedFiles.length > 0) {
          e.preventDefault();
          processFiles(extractedFiles);
        }
      }
    },
    [processFiles]
  );

  // Handle Drag Over
  const handleDragOver = useCallback((e: DragEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  }, [isDragOver]);

  // Handle Drag Enter
  const handleDragEnter = useCallback((e: DragEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  // Handle Drag Leave
  const handleDragLeave = useCallback((e: DragEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving the container boundaries
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  }, []);

  // Handle Drop
  const handleDrop = useCallback(
    (e: DragEvent<any>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  // Remove single attachment
  const removeAttachment = useCallback((id: string) => {
    setPendingAttachments((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear all attachments
  const clearAttachments = useCallback(() => {
    setPendingAttachments([]);
  }, []);

  return {
    pendingAttachments,
    isDragOver,
    handlePaste,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    processFiles,
    removeAttachment,
    clearAttachments,
    setPendingAttachments
  };
}
