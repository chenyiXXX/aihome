import React, { useState } from 'react';
import {
  X,
  Plus,
  MessageCircle,
  Paperclip,
  Sparkles,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { InquiryItem } from '../../../types';

interface CreateInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInquiry: (inquiry: InquiryItem) => void;
}

export const CreateInquiryModal: React.FC<CreateInquiryModalProps> = ({
  isOpen,
  onClose,
  onAddInquiry
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('United States');
  const [countryCode, setCountryCode] = useState('US');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [furnitureCategory, setFurnitureCategory] = useState('全屋实木橱柜定制 Solid Wood Kitchen Cabinets');
  const [budget, setBudget] = useState('$50,000 - $80,000');
  const [quantity, setQuantity] = useState('1x40HQ Container');
  const [content, setContent] = useState('');
  const [hasCad, setHasCad] = useState(true);

  if (!isOpen) return null;

  const handleCountryChange = (c: string) => {
    setCountry(c);
    if (c.includes('United States') || c.includes('US')) setCountryCode('US');
    else if (c.includes('Germany') || c.includes('DE')) setCountryCode('DE');
    else if (c.includes('United Kingdom') || c.includes('UK')) setCountryCode('GB');
    else if (c.includes('United Arab Emirates') || c.includes('Dubai')) setCountryCode('AE');
    else if (c.includes('Australia')) setCountryCode('AU');
    else if (c.includes('France')) setCountryCode('FR');
    else if (c.includes('Italy')) setCountryCode('IT');
    else if (c.includes('Spain')) setCountryCode('ES');
    else if (c.includes('Japan')) setCountryCode('JP');
    else if (c.includes('Switzerland')) setCountryCode('CH');
    else setCountryCode('GLOBAL');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INQ-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const randomRfq = `RFQ-${Math.floor(Math.random() * 8999 + 1000)}-${countryCode}`;

    const newInquiry: InquiryItem = {
      id: newId,
      inquiryNo: randomRfq,
      buyerName: buyerName.trim() || 'Alex Turner',
      companyName: companyName.trim() || 'Horizon Global Interiors Ltd.',
      country: country,
      countryCode: countryCode,
      channel: 'WhatsApp',
      platform: 'WhatsApp Business API',
      contactNumber: contactNumber.trim() || '+1 (555) 019-2834',
      email: email.trim() || 'inquiry@buyer-corp.com',
      furnitureCategory: furnitureCategory,
      budget: budget || '$50,000+',
      quantity: quantity || 'Standard Bulk Order',
      intentLevel: 'Hot (S级)',
      status: '待跟进',
      createdAt: '刚刚',
      assignedSales: 'Sophia (外贸主管)',
      title: `${buyerName || 'Client'} WhatsApp Custom Furniture Inquiry`,
      content: content.trim() || 'Customer sent WhatsApp message requesting custom bespoke joinery quotation with CAD drawing verification.',
      rawContent: content.trim() || 'Customer sent WhatsApp message requesting custom bespoke joinery quotation with CAD drawing verification.',
      attachments: hasCad
        ? [
            { name: 'Floorplan_Project_CAD.pdf', url: '#', size: '3.4 MB', type: 'pdf' },
            { name: 'Finish_Spec_Requirements.png', url: '#', size: '1.2 MB', type: 'image' }
          ]
        : [],
      aiScore: 92,
      aiAnalysis: {
        intentLevel: 'Hot (S级新进线)',
        confidenceScore: 0.94,
        summary: `通过 WhatsApp Business 官方通道进线的高意向海外询盘，前置处理智能体已完成初步清洗与采购诉求识别。`,
        suggestedReply: `Dear ${buyerName || 'Valued Customer'},\n\nThank you for reaching out via WhatsApp! We have reviewed your preliminary specifications for ${furnitureCategory}. Our engineering team is preparing an initial FOB quotation and CAD review.`
      }
    };

    onAddInquiry(newInquiry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">新建询盘</h3>
              <p className="text-[11px] text-slate-400">录入海外买家进线需求，系统将自动进行意向评级与跟进归档</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
          {/* Buyer & Company Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">买家姓名</label>
              <input
                type="text"
                placeholder="例如: David Miller"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">公司机构</label>
              <input
                type="text"
                placeholder="例如: Apex Architecture & Interior Group"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">国家 / 地区</label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
              >
                <option value="United States">🇺🇸 美国 (United States)</option>
                <option value="Germany">🇩🇪 德国 (Germany)</option>
                <option value="United Kingdom">🇬🇧 英国 (United Kingdom)</option>
                <option value="United Arab Emirates">🇦🇪 阿联酋 (Dubai/UAE)</option>
                <option value="Australia">🇦🇺 澳大利亚 (Australia)</option>
                <option value="France">🇫🇷 法国 (France)</option>
                <option value="Italy">🇮🇹 意大利 (Italy)</option>
                <option value="Spain">🇪🇸 西班牙 (Spain)</option>
                <option value="Japan">🇯🇵 日本 (Japan)</option>
                <option value="Switzerland">🇨🇭 瑞士 (Switzerland)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                WhatsApp 号码 <span className="text-emerald-600">*</span>
              </label>
              <input
                type="text"
                placeholder="+1 (415) 890-2134"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">电子邮箱</label>
              <input
                type="email"
                placeholder="david.miller@apex.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Furniture Category, Budget & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">采购品类</label>
              <input
                type="text"
                value={furnitureCategory}
                onChange={(e) => setFurnitureCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">预算金额</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">采购体量 / 柜型</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Inbound WhatsApp message content */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              进线消息原文
            </label>
            <textarea
              rows={3}
              placeholder="例如: Hi, we are looking for a custom furniture supplier for a luxury villa project in California. Need solid wood cabinets with Blum soft-close hinges. CAD floorplan attached..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Attachments */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Paperclip className="w-4 h-4 text-slate-500" />
              <div className="text-xs">
                <span className="font-semibold text-slate-800">关联图纸附件 (CAD/BOQ)</span>
                <span className="text-[11px] text-slate-400 ml-2">自动包含项目平面图与材质要求附件</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasCad}
              onChange={(e) => setHasCad(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>确认新建</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
