import { InquiryItem } from '../types';

/**
 * 导出询盘客户列表到本地 Excel (UTF-8 BOM CSV 格式，原生兼容 Microsoft Excel / WPS / Numbers)
 */
export const exportInquiriesToExcel = (
  items: InquiryItem[],
  customFilename?: string
): void => {
  if (!items || items.length === 0) {
    alert('暂无符合条件的询盘数据可供导出');
    return;
  }

  const headers = [
    '询盘编号 (Inquiry No)',
    '询盘时间 (Inquiry Time)',
    '客户姓名 (Buyer Name)',
    '公司/机构 (Company)',
    '国家/地区 (Country)',
    'WordPress号码 (Phone Number)',
    '联系邮箱 (Email)',
    '采购品类与需求 (Category)',
    '接待状态/对话轮数 (Bot Turns)'
  ];

  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const cleanStr = String(value).replace(/"/g, '""').replace(/\r?\n/g, ' ');
    return `"${cleanStr}"`;
  };

  const rows = items.map((item) => {
    const chatTurns = item.chatHistory?.length || item.botTurns || 4;

    return [
      escapeCSV(item.inquiryNo || item.id),
      escapeCSV(item.createdAt || item.receivedAt),
      escapeCSV(item.buyerName),
      escapeCSV(item.companyName),
      escapeCSV(`${item.country} (${item.countryCode})`),
      escapeCSV(item.contactNumber),
      escapeCSV(item.email || '-'),
      escapeCSV(item.furnitureCategory),
      escapeCSV(`${chatTurns} 轮会话`)
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) ensures Excel handles Chinese characters without garbled text
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const dateSuffix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const filename = customFilename || `HomeCraft_WordPress售前询盘客户表_${dateSuffix}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 快速复制客户档案和聊天摘要（供业务员一键粘贴至 CRM 安排对接）
 */
export const copyCustomerCRMText = (item: InquiryItem): string => {
  return `【HomeCraft WordPress 售前询盘 - 客户建档信息】
询盘编号：${item.inquiryNo || item.id}
询盘时间：${item.createdAt || item.receivedAt}
客户姓名：${item.buyerName}
所属公司：${item.companyName}
国家地区：${item.country} (${item.countryCode})
WordPress号码：${item.contactNumber}
工作邮箱：${item.email || '-'}
采购品类：${item.furnitureCategory}
预算规模：${item.budget}
采购数量：${item.quantity}
AI意向评级：${item.intentLevel} (${item.aiScore}分)
售前机器人摘要：${item.aiAnalysis?.summary || item.content}
客户原始诉求：${item.rawContent || item.content}
`;
};
