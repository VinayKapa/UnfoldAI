import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      initials: 'AK',
      name: 'Aarav K.',
      role: 'Class 10 Student',
      institute: 'Delhi Public School',
      quote: 'CareerDNA AI stopped my confusion between Science and Commerce. It analyzed my interest in game modding and physics to show me a direct AI Graphics pathway.',
    },
    {
      initials: 'PS',
      name: 'Priya S.',
      role: 'B.Tech 3rd Year',
      institute: 'IIT Hyderabad',
      quote: 'The What-If Simulator convinced me to apply for summer research internships. It predicted a +20% jump in my placement readiness, which came true!',
    },
    {
      initials: 'RD',
      name: 'Rohan D.',
      role: '12th Stream Applicant',
      institute: 'St. Xavier Junior College',
      quote: 'I love how clean and straightforward the app is. No 50-page boring PDF surveys — just a quick conversational chat and my custom roadmap was generated.',
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-[#E5E7EB] dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 text-xs font-mono font-semibold uppercase">
            <span>Student Testimonials</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
            Trusted by Thousands of Next-Gen Learners
          </h2>
          <p className="text-base text-[#6B7280] dark:text-slate-400">
            Real feedback from students discovering their unique potential across school, 12th grade, and college.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="geo-card p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                </div>

                <p className="text-sm text-[#111827] dark:text-slate-200 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center gap-3">
                {/* Initials Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold text-sm font-num shrink-0">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111827] dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400">
                    {item.role} • {item.institute}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
