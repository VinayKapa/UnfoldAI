import React from 'react';
import { motion } from 'motion/react';
import { Mic, Cpu, HelpCircle, Dna, Compass, ArrowRight, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Mic,
      title: 'Student Shares Interests',
      desc: 'Type or speak in natural language (e.g. "I love math and drawing anime" or "I want to start a tech business"). No fixed forms!',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    {
      num: '02',
      icon: Cpu,
      title: 'AI Understands Context',
      desc: 'Gemini AI evaluates psychological traits, hobbies, academic level, and implicit talents without rigid questionnaires.',
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200'
    },
    {
      num: '03',
      icon: HelpCircle,
      title: 'Adaptive Questioning',
      desc: 'If AI confidence is low, it asks ONLY ONE OR TWO intelligent follow-up questions with quick options. Never an annoying interview!',
      color: 'bg-amber-500/10 text-amber-600 border-amber-200'
    },
    {
      num: '04',
      icon: Dna,
      title: 'CareerDNA Generated',
      desc: 'Generates Career Match Scores (e.g., 96% AI Engineer) with complete "WHY" reasoning, salary ranges, pros/cons, and skill gaps.',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200'
    },
    {
      num: '05',
      icon: Compass,
      title: 'Interactive Roadmap & Mentor',
      desc: 'Receives an evolving visual timeline (Today → Skills → Projects → Internships → Job) plus 24/7 AI Mentor & What-If Simulator.',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    }
  ];

  return (
    <section id="how-it-works-section" className="py-20 bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frictionless AI Discovery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            How The CareerDNA AI Engine Works
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Designed to feel like chatting with a brilliant personal career mentor, not taking a boring school test.
          </p>
        </div>

        {/* Workflow Steps Horizontal/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 relative group hover:border-indigo-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-700">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
