import React from 'react';
import { motion } from 'motion/react';
import { MessageSquareText, BrainCircuit, Dna, Map, Sparkles, ArrowDown } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Tell AI about yourself',
      description: 'Share your interests, hobbies, favorite school subjects, or side projects in natural spoken voice or plain text. No rigid 50-question forms required.',
      icon: MessageSquareText,
      pill: 'Input Layer',
    },
    {
      number: '02',
      title: 'AI understands you',
      description: 'Our neural intelligence engine synthesizes your natural story to identify underlying problem-solving styles, visual aptitudes, and core drives.',
      icon: BrainCircuit,
      pill: 'Neural Synthesis',
    },
    {
      number: '03',
      title: 'Unfold DNA generated',
      description: 'A multi-dimensional profile mapping your affinity scores across 10,000+ career trajectories with high match precision.',
      icon: Dna,
      pill: 'Profile Output',
    },
    {
      number: '04',
      title: 'Personal roadmap',
      description: 'An actionable step-by-step milestone plan customized specifically to your current grade level (Class 6-10, 11-12th, or UG).',
      icon: Map,
      pill: 'Execution Plan',
    },
    {
      number: '05',
      title: 'Continuous mentoring',
      description: 'Your 24/7 AI Mentor tracks your progress, suggests monthly goal updates, and prepares you for internships and job placement.',
      icon: Sparkles,
      pill: 'Ongoing Growth',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-24 bg-white dark:bg-slate-900 border-t border-[#E5E7EB] dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 text-xs font-mono font-semibold uppercase">
            <span>5-Step Methodology</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
            How Unfold AI Transforms Your Journey
          </h2>
          <p className="text-base text-[#6B7280] dark:text-slate-400">
            From initial conversational discovery to continuous mentoring throughout your student life.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="max-w-4xl mx-auto relative space-y-8">
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#4F46E5] via-indigo-300 to-emerald-500 opacity-30 pointer-events-none hidden sm:block" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col sm:flex-row items-start gap-6 geo-card p-6 sm:p-8"
              >
                {/* Step Number & Icon Circle */}
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20 font-num font-bold text-lg">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#4F46E5] uppercase tracking-wider">
                      Step {step.number} — {step.pill}
                    </span>
                    <span className="text-[11px] font-mono text-[#6B7280]">
                      Phase 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#111827] dark:text-white">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
