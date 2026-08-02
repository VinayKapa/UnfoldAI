import React from 'react';
import { motion } from 'motion/react';
import { Flag, Check, Compass, BookOpen, GraduationCap, Briefcase, Sparkles } from 'lucide-react';

export const CareerTimelineSection: React.FC = () => {
  const timelineNodes = [
    {
      stage: 'Phase 1: School Discovery (Class 6-10)',
      title: 'Strength & Interest Profiling',
      details: 'Identify natural affinities for logic, design, tinkering, or leadership through playful project creation and science explorations.',
      icon: Compass,
      status: 'Foundational',
    },
    {
      stage: 'Phase 2: Intermediate Stream Alignment (11-12th / Diploma)',
      title: 'Target Stream & College Mapping',
      details: 'Select science, commerce, or vocational diploma streams matching your CareerDNA, supported by entrance exam strategy.',
      icon: BookOpen,
      status: 'Strategic',
    },
    {
      stage: 'Phase 3: Undergraduate Mastery (Year 1 - 3)',
      title: 'Production Projects & Portfolio',
      details: 'Build real-world software, hardware prototypes, or design systems while mastering core industry frameworks.',
      icon: GraduationCap,
      status: 'Execution',
    },
    {
      stage: 'Phase 4: Graduation & Employment (Final Year)',
      title: 'Internships & Career Placement',
      details: 'ATS resume audit, mock technical interview coaching, and direct application to high-fit companies.',
      icon: Briefcase,
      status: 'Outcome',
    },
  ];

  return (
    <section id="roadmap-section" className="py-24 bg-white dark:bg-slate-900 border-t border-[#E5E7EB] dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 text-xs font-mono font-semibold uppercase">
            <span>End-to-End Trajectory</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
            The Continuous Student Career Timeline
          </h2>
          <p className="text-base text-[#6B7280] dark:text-slate-400">
            A single living roadmap that evolves with you year after year, ensuring no gap in your career readiness.
          </p>
        </div>

        {/* Timeline Grid Layout */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Middle Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#E5E7EB] dark:bg-slate-800 -translate-x-1/2" />

          <div className="space-y-12">
            {timelineNodes.map((node, idx) => {
              const Icon = node.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={node.stage}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  
                  {/* Card Content */}
                  <div className="w-full md:w-1/2 px-0 md:px-8">
                    <div className="geo-card p-6 relative group">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-[#4F46E5] dark:text-indigo-400 uppercase">
                          {node.stage}
                        </span>
                        <span className="geo-status-pill">{node.status}</span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#111827] dark:text-white mb-2">
                        {node.title}
                      </h3>

                      <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
                        {node.details}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Pin */}
                  <div className="my-4 md:my-0 shrink-0 w-12 h-12 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shadow-md shadow-indigo-500/20 z-10 font-bold">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Spacer for 2-column balance */}
                  <div className="hidden md:block w-1/2" />

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
