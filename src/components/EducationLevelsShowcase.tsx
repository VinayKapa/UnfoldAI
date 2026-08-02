import React from 'react';
import { motion } from 'motion/react';
import { School, BookOpen, GraduationCap, CheckCircle2, Award, Trophy, Code2, Briefcase, Sparkles, Compass } from 'lucide-react';
import { EducationLevel } from '../types';

interface EducationLevelsShowcaseProps {
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
  onOpenKnowYou: () => void;
}

export const EducationLevelsShowcase: React.FC<EducationLevelsShowcaseProps> = ({
  educationLevel,
  setEducationLevel,
  onOpenKnowYou,
}) => {
  return (
    <section id="levels-section" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Tailored For Every Academic Stage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            One Platform. Three Adaptive Experiences.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            CareerDNA AI completely changes its tone, language complexity, guidance modules, and palette depending on where you are in your education.
          </p>
        </div>

        {/* 3 Option Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* OPTION 1: SCHOOL (Classes 6-10) */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setEducationLevel('school')}
            className={`cursor-pointer rounded-2xl p-6 transition-all border ${
              educationLevel === 'school'
                ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                <School className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                Option 1
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              School Students
            </h3>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
              Classes 6 – 10
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              Friendly, encouraging, simple English explanations with visual career trees, Olympiads, subjects to focus on, and guidance for parents.
            </p>

            <div className="space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Subjects to Focus (Math, Science, Coding)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Olympiads & Science Fairs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Future High School Stream Recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Parents Guidance & Tips</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Theme: Vibrant & Friendly</span>
              <span className="underline">Select Mode →</span>
            </div>
          </motion.div>

          {/* OPTION 2: INTERMEDIATE / DIPLOMA (Classes 11-12) */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setEducationLevel('intermediate')}
            className={`cursor-pointer rounded-2xl p-6 transition-all border ${
              educationLevel === 'intermediate'
                ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Option 2
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Intermediate / Diploma
            </h3>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
              Classes 11 – 12 / Diploma
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              Professional, goal-oriented academic roadmaps focusing on entrance exams, degree suggestions, scholarships, and top university targets.
            </p>

            <div className="space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Entrance Exams (JEE / BITSAT / SAT / CUET)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Top University & Degree Mapping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Scholarships & Recommended Certifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Industry Demand & Expected Salaries</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Theme: Academic & Focused</span>
              <span className="underline">Select Mode →</span>
            </div>
          </motion.div>

          {/* OPTION 3: GRADUATION / UNDERGRAD */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setEducationLevel('graduation')}
            className={`cursor-pointer rounded-2xl p-6 transition-all border ${
              educationLevel === 'graduation'
                ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                Option 3
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Graduation
            </h3>
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-3">
              Undergraduate / Postgraduate
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              Sleek, minimal, industry-driven SaaS workspace for resume analysis, internships, open source, placement readiness, and tech stack skill gap analysis.
            </p>

            <div className="space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Resume & ATS Score Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Internships & Open Source Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>GitHub & LinkedIn Profile Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Placement Readiness & Salary Benchmarks</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Theme: Minimal Luxury SaaS</span>
              <span className="underline">Select Mode →</span>
            </div>
          </motion.div>

        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Ready to generate your CareerDNA profile?
            </h3>
            <p className="text-xs text-indigo-200">
              Selected Level: <span className="font-bold text-white uppercase">{educationLevel}</span>. Starts immediately with zero form fatigue.
            </p>
          </div>

          <button
            onClick={onOpenKnowYou}
            className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-lg shrink-0 transform active:scale-95"
            id="levels-cta-btn"
          >
            Launch "Let's Know You" →
          </button>
        </div>

      </div>
    </section>
  );
};
