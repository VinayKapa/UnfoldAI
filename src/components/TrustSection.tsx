import React from 'react';
import { motion } from 'motion/react';
import { Compass, Cpu, Layers, Sparkles } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const stats = [
    {
      value: '10,000+',
      label: 'Career Paths',
      description: 'Indexed across tech, design, engineering & management',
      icon: Compass,
    },
    {
      value: '500+',
      label: 'Skills',
      description: 'Mapped to real-world workplace skill graphs',
      icon: Layers,
    },
    {
      value: '100+',
      label: 'Technologies',
      description: 'Continuously updated with modern industry tools',
      icon: Cpu,
    },
    {
      value: 'AI Powered',
      label: 'Career Intelligence',
      description: 'Zero static surveys; personalized to your narrative',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-[#E5E7EB] dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="geo-card p-6 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950 flex items-center justify-center text-[#4F46E5] dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#6B7280] dark:text-slate-400">
                    Live Data
                  </span>
                </div>

                <div>
                  <div className="text-3xl font-num font-extrabold text-[#111827] dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-[#4F46E5] dark:text-indigo-400 mt-0.5">
                    {stat.label}
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-2 leading-relaxed">
                    {stat.description}
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
