import React from 'react';
import { Dna } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#FAFAFA] dark:bg-slate-950 text-[#6B7280] dark:text-slate-400 py-12 border-t border-[#E5E7EB] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E5E7EB] dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-bold">
              <Dna className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-[#111827] dark:text-white tracking-tight notranslate" translate="no">
                Unfold <span className="text-[#4F46E5]">AI</span>
              </span>
              <span className="text-[11px] font-medium text-[#6B7280]">
                Discover Yourself. Design Your Future.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-slate-400">
            <a href="#features-section" className="hover:text-[#111827] dark:hover:text-white transition-colors">{t('nav.features', 'Features')}</a>
            <a href="#how-it-works-section" className="hover:text-[#111827] dark:hover:text-white transition-colors">{t('nav.howitworks', 'How it Works')}</a>
            <a href="#levels-section" className="hover:text-[#111827] dark:hover:text-white transition-colors">{t('nav.about', 'About')}</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6B7280]">
          <p>© {new Date().getFullYear()} Unfold AI Operating System. {t('footer.rights', 'All rights reserved.')}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#111827] transition-colors cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-[#111827] transition-colors cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-[#111827] transition-colors cursor-pointer">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
