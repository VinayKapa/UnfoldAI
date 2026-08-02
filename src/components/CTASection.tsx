import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CTASectionProps {
  onOpenKnowYou: () => void;
  onOpenAuth: () => void;
  onViewDemo: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onOpenKnowYou,
  onOpenAuth,
  onViewDemo,
}) => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-[#FAFAFA] dark:bg-slate-950 border-t border-[#E5E7EB] dark:border-slate-800 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#4F46E5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="geo-card p-10 sm:p-16 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 space-y-8 shadow-2xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 text-xs font-mono font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Career Intelligence</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#111827] dark:text-white tracking-tight max-w-2xl mx-auto leading-tight">
            {t('cta.title', 'Ready to Shape Your Future with AI?')}
          </h2>

          <p className="text-base sm:text-lg text-[#6B7280] dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            {t('cta.subtitle', 'Join thousands of students who have discovered their true potential and mapped out clear, actionable career paths with Unfold AI.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenAuth}
              className="px-8 py-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2.5 transform active:scale-95 group"
              id="cta-start-free-btn"
            >
              <span>{t('cta.getStartedFree', 'Get Started Free')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-xs text-[#6B7280] dark:text-slate-500 pt-2 font-mono">
            Free forever for students • No credit card required
          </p>

        </div>

      </div>
    </section>
  );
};
