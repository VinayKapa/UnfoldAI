import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { School, BookOpen, GraduationCap, CheckCircle2, Sparkles, ArrowRight, Compass, Shield, Award } from 'lucide-react';
import { EducationLevel } from '../types';

interface StudentLevelsSectionProps {
  currentLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
  onOpenKnowYou: () => void;
  onOpenAuth: () => void;
}

export const StudentLevelsSection: React.FC<StudentLevelsSectionProps> = ({
  currentLevel,
  setEducationLevel,
  onOpenKnowYou,
  onOpenAuth,
}) => {
  const [hoveredLevel, setHoveredLevel] = useState<EducationLevel | null>(null);

  const activeLevel = hoveredLevel || currentLevel;

  const levels = [
    {
      id: 'school' as EducationLevel,
      title: 'School Level',
      subtitle: 'Class 6 - 10 Students',
      theme: 'Friendly & Interactive UI',
      description: 'Encouraging exploratory discovery through gamified skill badges, robotics, science projects, and basic logic introduction.',
      icon: School,
      previewTitle: 'Friendly Discovery Hub',
      previewItems: [
        'Interactive Math & Robotics Quest',
        'Scratch & Python Code Tinkering',
        'Stream Curiosity Finder (PCM / PCB / Commerce / Arts)',
      ],
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      id: 'intermediate' as EducationLevel,
      title: 'Intermediate Level',
      subtitle: 'Class 11 - 12 / Diploma',
      theme: 'Academic & Professional Focus',
      description: 'Stream alignment, competitive exam planning (JEE/NEET/SAT/CUET), diploma paths, and early software/design foundations.',
      icon: BookOpen,
      previewTitle: 'Academic Strategy Board',
      previewItems: [
        'Stream Alignment & Target College Radar',
        'Competitive Entrance Milestone Tracker',
        'Foundation Projects in Web Dev, CAD & Design',
      ],
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
    {
      id: 'graduation' as EducationLevel,
      title: 'Graduation Level',
      subtitle: 'UG / PG College Students',
      theme: 'Minimal & Industry Ready',
      description: 'Production-level skill trees, ATS resume auditor, top company interview prep, hackathons, and internship matching.',
      icon: GraduationCap,
      previewTitle: 'Placement & Career OS',
      previewItems: [
        'Full Stack / ML Production Roadmap',
        'ATS Resume & GitHub Skill Auditor',
        'Tier-1 Internship Match Engine',
      ],
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300',
    },
  ];

  return (
    <section id="levels-section" className="py-24 bg-[#FAFAFA] dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 text-xs font-mono font-semibold uppercase">
            <span>Adaptive Student Intelligence</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
            Tailored Experiences for Every Stage
          </h2>
          <p className="text-base text-[#6B7280] dark:text-slate-400">
            Unfold AI automatically morphs its visual tone and roadmap complexity depending on where you are in school or college.
          </p>
        </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((lvl) => {
            const Icon = lvl.icon;
            const isSelected = activeLevel === lvl.id;

            return (
              <motion.div
                key={lvl.id}
                onMouseEnter={() => setHoveredLevel(lvl.id)}
                onMouseLeave={() => setHoveredLevel(null)}
                onClick={() => setEducationLevel(lvl.id)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`geo-card p-6 flex flex-col justify-between cursor-pointer transition-all relative ${
                  isSelected ? 'ring-2 ring-[#4F46E5] shadow-lg' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950 flex items-center justify-center text-[#4F46E5] dark:text-indigo-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${lvl.badgeColor}`}>
                      {lvl.theme}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#111827] dark:text-white">
                    {lvl.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#4F46E5] dark:text-indigo-400 mb-3">
                    {lvl.subtitle}
                  </p>

                  <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed mb-6">
                    {lvl.description}
                  </p>

                  {/* Dashboard Preview Box */}
                  <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-slate-800/80 border border-[#E5E7EB] dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
                        {lvl.previewTitle}
                      </span>
                      <span className="text-[10px] font-mono text-[#6B7280]">Preview</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {lvl.previewItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-[#6B7280] dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111827] dark:text-white">
                    {isSelected ? 'Selected Mode' : 'Click to Select'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEducationLevel(lvl.id);
                      onOpenAuth();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] dark:text-indigo-400 hover:underline"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
