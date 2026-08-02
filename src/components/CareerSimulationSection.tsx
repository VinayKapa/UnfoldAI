import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Sliders, TrendingUp, IndianRupee, Award, ArrowUpRight, Sparkles } from 'lucide-react';

export const CareerSimulationSection: React.FC = () => {
  const [studyHours, setStudyHours] = useState<number>(4);
  const [projectsCount, setProjectsCount] = useState<number>(3);
  const [internshipsCount, setInternshipsCount] = useState<number>(1);
  const [commLevel, setCommLevel] = useState<number>(3); // 1 to 4

  // Live simulation math
  const probability = Math.min(
    99,
    Math.round(45 + studyHours * 4 + projectsCount * 5 + internshipsCount * 12 + commLevel * 4)
  );

  const minSalary = Math.round(5 + projectsCount * 1.2 + internshipsCount * 3 + studyHours * 0.6);
  const maxSalary = Math.round(minSalary * 1.7 + commLevel * 2.5);

  const readinessScore = Math.min(
    100,
    Math.round(50 + studyHours * 3 + projectsCount * 4 + internshipsCount * 10)
  );

  return (
    <section id="simulator-section" className="py-24 bg-[#FAFAFA] dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 text-xs font-mono font-semibold uppercase">
            <span>Interactive AI Sandbox</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
            Live Career Outcome Simulator
          </h2>
          <p className="text-base text-[#6B7280] dark:text-slate-400">
            Adjust your daily study effort, project velocity, internships, and communication skills to see instant real-time predictions.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 geo-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="font-display text-lg font-bold text-[#111827] dark:text-white">
                  Input Variables
                </h3>
              </div>
              <span className="text-xs font-mono text-[#6B7280]">Live Reactivity</span>
            </div>

            {/* Slider 1: Study Hours */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#111827] dark:text-slate-200">
                  Daily Focused Study Hours
                </label>
                <span className="font-num font-bold text-[#4F46E5]">{studyHours} hrs / day</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                className="w-full accent-[#4F46E5] bg-slate-200 dark:bg-slate-700 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Projects Count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#111827] dark:text-slate-200">
                  Completed Hands-on Projects
                </label>
                <span className="font-num font-bold text-[#4F46E5]">{projectsCount} Projects</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                value={projectsCount}
                onChange={(e) => setProjectsCount(Number(e.target.value))}
                className="w-full accent-[#4F46E5] bg-slate-200 dark:bg-slate-700 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Internships Count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#111827] dark:text-slate-200">
                  Industry Internships
                </label>
                <span className="font-num font-bold text-[#4F46E5]">{internshipsCount} Internships</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={internshipsCount}
                onChange={(e) => setInternshipsCount(Number(e.target.value))}
                className="w-full accent-[#4F46E5] bg-slate-200 dark:bg-slate-700 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: Communication Skills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#111827] dark:text-slate-200">
                  Communication & Presentation Score
                </label>
                <span className="font-num font-bold text-[#4F46E5]">
                  {commLevel === 1 ? 'Basic' : commLevel === 2 ? 'Intermediate' : commLevel === 3 ? 'Advanced' : 'Fluent / Leader'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={commLevel}
                onChange={(e) => setCommLevel(Number(e.target.value))}
                className="w-full accent-[#4F46E5] bg-slate-200 dark:bg-slate-700 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* AI Outputs Column */}
          <div className="lg:col-span-5 geo-card p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white to-[#EEF2FF]/30 dark:from-slate-900 dark:to-slate-900/90">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display text-lg font-bold text-[#111827] dark:text-white">
                    AI Outcome Output
                  </h3>
                </div>
                <span className="geo-status-pill">Calculated</span>
              </div>

              {/* Output Metric 1: Career Probability */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Placement Probability</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-num font-extrabold text-[#111827] dark:text-white">
                  {probability}%
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-[#4F46E5] h-full rounded-full"
                    animate={{ width: `${probability}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Output Metric 2: Estimated Salary Range */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Estimated Annual Salary Range</span>
                  <IndianRupee className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="text-2xl font-num font-extrabold text-[#4F46E5] dark:text-indigo-400">
                  ₹{minSalary} LPA – ₹{maxSalary} LPA <span className="text-xs font-normal text-[#6B7280]">/ yr</span>
                </div>
              </div>

              {/* Output Metric 3: Placement Readiness */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Workplace Readiness Index</span>
                  <Award className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-num font-extrabold text-[#111827] dark:text-white">
                  {readinessScore} / 100
                </div>
              </div>
            </div>

            <div className="geo-ai-insight">
              <p>
                <span>AI Recommendation:</span> "Completing <span>1 additional internship</span> will boost your salary upper ceiling by <span>+₹3.5 LPA</span>."
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
