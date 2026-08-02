import React from 'react';
import { motion } from 'motion/react';
import {
  Dna,
  Zap,
  Compass,
  FileText,
  Briefcase,
  TrendingUp,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Unfold DNA',
      tagline: 'Deep Mind & Affinity Profiling',
      description: 'Discovers your core strengths, cognitive preferences, and intrinsic motivations through open conversational storytelling.',
      icon: Dna,
      badge: 'Core Engine',
    },
    {
      title: 'Career Simulator',
      tagline: 'What-If Outcome Prediction',
      description: 'Simulate how adding hours, learning specific skills, or completing internships dynamically changes your hiring probability.',
      icon: Zap,
      badge: 'Predictive AI',
    },
    {
      title: 'Roadmap',
      tagline: 'Step-by-Step Execution Plan',
      description: 'Personalized chronological milestones from Class 6 school projects all the way to college graduation job placement.',
      icon: Compass,
      badge: 'Adaptive',
    },
    {
      title: 'Resume Intelligence',
      tagline: 'ATS & Skill Gap Auditor',
      description: 'Scans your draft resume or projects against top company benchmarks to detect missing keywords and impact metrics.',
      icon: FileText,
      badge: 'Automated',
    },
    {
      title: 'Internship Matching',
      tagline: 'High-Fit Opportunities',
      description: 'Connects your verified skill DNA with top startups, tech firms, and research labs actively seeking fresh student talent.',
      icon: Briefcase,
      badge: 'Opportunity',
    },
    {
      title: 'Trending Skills',
      tagline: 'Real-Time Market Radar',
      description: 'Tracks shifting technology stacks and industry demands so you study high-leverage frameworks before they peak.',
      icon: TrendingUp,
      badge: 'Live Radar',
    },
    {
      title: 'AI Mentor',
      tagline: '24/7 Contextual Guidance',
      description: 'An empathetic, always-on AI advisor tailored to your exact grade level that answers career questions in plain language.',
      icon: MessageSquare,
      badge: '24/7 Available',
    },
    {
      title: 'Career Analytics',
      tagline: 'Quantified Progress Metrics',
      description: 'Visual dashboards tracking your readiness score, skill mastery velocity, and streak consistency over time.',
      icon: BarChart3,
      badge: 'Insights',
    },
  ];

  return (
    <section id="features-section" className="py-24 bg-[#FAFAFA] dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 text-xs font-mono font-semibold uppercase">
            <span>Unified Architecture</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
            Engineered for Precision Career Discovery
          </h2>
          <p className="text-base text-[#6B7280] dark:text-slate-400">
            Eight synchronized AI modules working together to unlock your potential and build a future-proof trajectory.
          </p>
        </div>

        {/* 8 Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="geo-card p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950 flex items-center justify-center text-[#4F46E5] dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#6B7280] dark:text-slate-400">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#111827] dark:text-white flex items-center gap-1.5 group-hover:text-[#4F46E5] transition-colors">
                    {item.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#4F46E5]" />
                  </h3>

                  <p className="text-xs font-semibold text-[#4F46E5] dark:text-indigo-400 mt-1 mb-2">
                    {item.tagline}
                  </p>

                  <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#E5E7EB] dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-[#6B7280]">
                  <span>Module 0{idx + 1}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
