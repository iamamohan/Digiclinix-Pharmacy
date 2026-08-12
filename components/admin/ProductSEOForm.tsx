'use client';

import React from 'react';
import { SITE_URL } from '@/lib/utils/seo';
import { Sparkles, Globe, FileText, AlertTriangle, Search } from 'lucide-react';

interface ProductSEOFormProps {
  productName: string;
  slug?: string;
  uses: string;
  warnings: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  onChange: (field: string, value: string) => void;
}

export const ProductSEOForm: React.FC<ProductSEOFormProps> = ({
  productName,
  slug,
  uses,
  warnings,
  seoTitle,
  seoDescription,
  seoKeywords,
  onChange,
}) => {
  const displayTitle = seoTitle.trim() || `${productName || 'Medicine Name'} | Digiclinix Pharmacy`;
  const displaySlug = slug?.trim() || 'medicine-name';
  const displayUrl = `${SITE_URL.replace(/^https?:\/\//, '')}/products/${displaySlug}`;
  const displayDescription =
    seoDescription.trim() ||
    `${productName || 'Medicine'} at Digiclinix Pharmacy. View product information, uses, warnings, price and availability.`;

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
      {/* Medical Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Medical Information (Admin Managed)
          </h3>
        </div>

        {/* Uses */}
        <div>
          <label htmlFor="input-uses" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Uses & Indications
          </label>
          <textarea
            id="input-uses"
            rows={2}
            value={uses}
            onChange={(e) => onChange('uses', e.target.value)}
            placeholder="e.g. Relief of mild to moderate pain and reduction of fever..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Warnings */}
        <div>
          <label htmlFor="input-warnings" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Warnings & Precautions
          </label>
          <textarea
            id="input-warnings"
            rows={2}
            value={warnings}
            onChange={(e) => onChange('warnings', e.target.value)}
            placeholder="e.g. Do not exceed recommended dosage. Avoid alcohol consumption..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* SEO & Search Settings */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            SEO & Google Search Controls
          </h3>
        </div>

        {/* SEO Title */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="input-seo-title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Meta Title
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{seoTitle.length} / 60 chars</span>
          </div>
          <input
            id="input-seo-title"
            type="text"
            value={seoTitle}
            onChange={(e) => onChange('seoTitle', e.target.value)}
            placeholder={`${productName || 'Medicine Name'} | Digiclinix Pharmacy`}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* SEO Description */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="input-seo-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Meta Description
            </label>
            <span className="text-[10px] text-slate-400 font-mono">{seoDescription.length} / 160 chars</span>
          </div>
          <textarea
            id="input-seo-desc"
            rows={2}
            value={seoDescription}
            onChange={(e) => onChange('seoDescription', e.target.value)}
            placeholder="Search snippet summary..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* SEO Keywords */}
        <div>
          <label htmlFor="input-seo-keywords" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Content Keywords (Admin Tagging)
          </label>
          <input
            id="input-seo-keywords"
            type="text"
            value={seoKeywords}
            onChange={(e) => onChange('seoKeywords', e.target.value)}
            placeholder="e.g. paracetamol, fever reducer, pain relief"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Live Google Search Snippet Preview */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1220] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Google Search Result Snippet Preview</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 font-sans space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">
                D
              </span>
              <span className="truncate max-w-[280px]">{displayUrl}</span>
            </div>
            <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer truncate">
              {displayTitle}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
              {displayDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
