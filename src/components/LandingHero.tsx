import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Dna, Play, Shield, Compass, Cpu, Target, CheckCircle2, TrendingUp, MessageSquare, Zap, User, BookOpen, GraduationCap, School, CheckSquare, IndianRupee, Sliders, ChevronRight, Flame } from 'lucide-react';
import { EducationLevel } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LandingHeroProps {
  onOpenKnowYou: () => void;
  onOpenAuth: () => void;
  onViewDemo: () => void;
  educationLevel: EducationLevel;
}

interface RoadmapMilestone {
  id: string;
  title: string;
  sub: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  resources: string[];
  expectedOutcome: string;
  completedTasks: number;
  totalTasks: number;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenKnowYou,
  onOpenAuth,
  onViewDemo,
  educationLevel,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'roadmap' | 'matcher' | 'effort' | 'advisor'>('roadmap');
  const [selectedStage, setSelectedStage] = useState<'school' | 'intermediate' | 'graduation'>('intermediate');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('m2');
  const [interactiveHours, setInteractiveHours] = useState<number>(5);

  // Dynamic roadmaps for each level
  const stageRoadmaps: Record<'school' | 'intermediate' | 'graduation', { title: string; target: string; milestones: RoadmapMilestone[] }> = {
    school: {
      title: 'Class 6 - 10 Foundation Roadmap',
      target: 'Science & Math Olympiad + Class 10 Board Excellence (95%+)',
      milestones: [
        {
          id: 's1',
          title: 'NCERT Math & Science Mastery',
          sub: 'Core Concepts, Formulas & Exercises',
          status: 'completed',
          resources: ['NCERT Exemplar', 'Pearson Foundation Series', 'RD Sharma Math'],
          expectedOutcome: '100% Concept Clarity in Algebra & Physics Fundamentals',
          completedTasks: 4,
          totalTasks: 4
        },
        {
          id: 's2',
          title: 'Olympiad & NTSE Prep Track',
          sub: 'Logical Reasoning & Analytical Aptitude',
          status: 'in-progress',
          resources: ['NSEJS Previous Papers', 'SOF Math Olympiad Practice', 'Mental Ability Drills'],
          expectedOutcome: 'State Rank < 500 in National Talent Search',
          completedTasks: 2,
          totalTasks: 4
        },
        {
          id: 's3',
          title: 'Coding & Robotics Basics',
          sub: 'Block Coding, Python & Logic Building',
          status: 'upcoming',
          resources: ['Scratch 3.0 Projects', 'Python for Kids / Beginners', 'Arduino Robotics'],
          expectedOutcome: 'Build 3 Interactive Games & Basic Sensor Hardware Project',
          completedTasks: 0,
          totalTasks: 3
        }
      ]
    },
    intermediate: {
      title: '11th & 12th PCM / MPC Stream Roadmap',
      target: 'JEE Main / Advanced (99+ Percentile) & BITSAT / EAMCET Top Rank',
      milestones: [
        {
          id: 'm1',
          title: 'Class 11 Physics & Math Foundations',
          sub: 'Mechanics, Calculus & Organic Chemistry',
          status: 'completed',
          resources: ['HC Verma Concepts of Physics', 'Cengage Calculus Series', 'MS Chouhan Organic'],
          expectedOutcome: '98% Accuracy in Mechanics & Coordinate Geometry Mock Tests',
          completedTasks: 5,
          totalTasks: 5
        },
        {
          id: 'm2',
          title: 'JEE Main & Advanced Test Series',
          sub: 'Chapterwise PYQs & Full Mock Drills',
          status: 'in-progress',
          resources: ['46 Years JEE Advanced Chapterwise PYQs', 'MathonGo Test Series', 'Allen Mock Papers'],
          expectedOutcome: 'Estimated JEE Main Percentile: 99.2+',
          completedTasks: 3,
          totalTasks: 5
        },
        {
          id: 'm3',
          title: 'College Stream & Specialization Choice',
          sub: 'B.Tech CS / AI vs Electronics Evaluation',
          status: 'upcoming',
          resources: ['IIT/NIT Cutoff Predictor', 'Unfold AI Career DNA Match', 'Branch vs College Analyzer'],
          expectedOutcome: 'Admission into Tier-1 Engineering Institute (IIT/NIT/IIIT/BITS)',
          completedTasks: 1,
          totalTasks: 4
        }
      ]
    },
    graduation: {
      title: 'B.Tech Computer Science & AI Roadmap',
      target: 'Tier-1 SDE / AI Engineer Placement (₹22 LPA - ₹45 LPA)',
      milestones: [
        {
          id: 'g1',
          title: 'DSA & Computer Science Core',
          sub: 'Arrays, Trees, Graphs, DP & System Design',
          status: 'completed',
          resources: ['Striver A2Z DSA Sheet', 'LeetCode Medium/Hard 250+', 'NeetCode 150'],
          expectedOutcome: 'Solve 300+ LeetCode problems with 95% optimal runtime',
          completedTasks: 5,
          totalTasks: 5
        },
        {
          id: 'g2',
          title: 'Full Stack & Generative AI Capstone',
          sub: 'React, Node.js, Vector DBs & LLM Pipelines',
          status: 'in-progress',
          resources: ['Full Stack Open', 'LangChain & Pinecone Docs', 'FastAPI Production Template'],
          expectedOutcome: 'Deploy 2 Live SaaS Applications with Active Users',
          completedTasks: 3,
          totalTasks: 4
        },
        {
          id: 'g3',
          title: 'Off-Campus & Tier-1 Campus Placement',
          sub: 'System Design Mock Interviews & ATS Resume',
          status: 'upcoming',
          resources: ['System Design Primer', 'Pramp / Interviewing.io Mocks', 'Unfold AI ATS Optimizer'],
          expectedOutcome: 'Tier-1 Product Company Offer (₹25+ LPA)',
          completedTasks: 1,
          totalTasks: 4
        }
      ]
    }
  };

  const currentRoadmap = stageRoadmaps[selectedStage];
  const activeMilestone = currentRoadmap.milestones.find((m) => m.id === selectedMilestoneId) || currentRoadmap.milestones[1] || currentRoadmap.milestones[0];

  // Dynamic calculation for effort tab
  const calculatedPercentile = Math.min(99.8, 85 + interactiveHours * 2.2).toFixed(1);
  const calculatedSalary = Math.round(6 + interactiveHours * 3.2);

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#FAFAFA] dark:bg-slate-950 transition-colors">
      
      {/* Background Subtle Mesh Grid Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Primary Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Small Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/80 border border-[#E0E7FF] dark:border-indigo-800 text-[#4F46E5] dark:text-indigo-300 text-xs font-mono font-semibold tracking-wide uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Powered Career Intelligence</span>
            </motion.div>

            {/* Large Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] dark:text-white leading-[1.08]"
            >
              The AI That <span className="text-[#4F46E5] dark:text-indigo-400">Understands You</span> Before Recommending Your Future.
            </motion.h1>

            {/* Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#6B7280] dark:text-slate-300 max-w-xl font-normal leading-relaxed"
            >
              Unfold AI helps students discover their strengths, explore careers, build roadmaps, and continuously grow with personalized AI guidance from school to graduation.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={onOpenAuth}
                className="px-8 py-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2.5 transform active:scale-95 group"
                id="hero-get-started-btn"
              >
                <span>{t('hero.getStarted', 'Get Started')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Micro Feature Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#6B7280] dark:text-slate-400 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Form Surveys</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Natural Voice or Text Input</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>School to Graduation Scope</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Sci-Fi Interactive Neural Pathway Canvas */}
          <div className="lg:col-span-6 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative rounded-2xl bg-[#090D16] border border-slate-800 shadow-2xl overflow-hidden text-slate-100"
            >
              
              {/* Application Top Bar */}
              <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
                  <span className="ml-1 text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" /> Student-to-Graduate AI Neural Network
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-300">Live Dynamic Network</span>
                </div>
              </div>

              {/* Interactive Neural Path Visual Stage Canvas */}
              <div className="relative w-full h-[350px] sm:h-[380px] bg-[#070A12] overflow-hidden select-none flex items-center justify-center p-2">
                {/* Background Grid & Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

                {/* SVG Connections & Animated Pulses */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 380" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="glowLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Outer Perimeter Connections */}
                  <line x1="110" y1="75" x2="490" y2="75" stroke="#334155" strokeWidth="1.5" strokeDasharray="5 5" />
                  <line x1="490" y1="75" x2="490" y2="305" stroke="#334155" strokeWidth="1.5" strokeDasharray="5 5" />
                  <line x1="490" y1="305" x2="110" y2="305" stroke="#334155" strokeWidth="1.5" strokeDasharray="5 5" />
                  <line x1="110" y1="305" x2="110" y2="75" stroke="#334155" strokeWidth="1.5" strokeDasharray="5 5" />

                  {/* Central Diagonal Cross Connectors */}
                  <line x1="110" y1="75" x2="300" y2="190" stroke={selectedStage === 'school' ? '#f59e0b' : '#334155'} strokeWidth={selectedStage === 'school' ? "2.5" : "1.5"} filter={selectedStage === 'school' ? "url(#glowEffect)" : undefined} strokeDasharray={selectedStage === 'school' ? undefined : "4 4"} />
                  <line x1="490" y1="75" x2="300" y2="190" stroke={selectedStage === 'intermediate' ? '#6366f1' : '#334155'} strokeWidth={selectedStage === 'intermediate' ? "2.5" : "1.5"} filter={selectedStage === 'intermediate' ? "url(#glowEffect)" : undefined} strokeDasharray={selectedStage === 'intermediate' ? undefined : "4 4"} />
                  <line x1="300" y1="190" x2="110" y2="305" stroke={selectedStage === 'graduation' ? '#10b981' : '#334155'} strokeWidth={selectedStage === 'graduation' ? "2.5" : "1.5"} filter={selectedStage === 'graduation' ? "url(#glowEffect)" : undefined} strokeDasharray={selectedStage === 'graduation' ? undefined : "4 4"} />
                  <line x1="300" y1="190" x2="490" y2="305" stroke={selectedStage === 'graduation' ? '#06b6d4' : '#334155'} strokeWidth={selectedStage === 'graduation' ? "2.5" : "1.5"} filter={selectedStage === 'graduation' ? "url(#glowEffect)" : undefined} strokeDasharray={selectedStage === 'graduation' ? undefined : "4 4"} />

                  {/* Animated Traveling Pulses */}
                  <circle cx="205" cy="132" r="3" fill="#f59e0b" className="animate-ping" />
                  <circle cx="395" cy="132" r="3" fill="#818cf8" className="animate-ping" />
                  <circle cx="205" cy="248" r="3" fill="#34d399" className="animate-ping" />
                  <circle cx="395" cy="248" r="3" fill="#22d3ee" className="animate-ping" />
                </svg>

                {/* Node 1: Top-Left (School Foundation) */}
                <div 
                  onClick={() => {
                    setSelectedStage('school');
                    setSelectedMilestoneId('s2');
                  }}
                  className={`absolute top-[5%] left-[5%] sm:left-[8%] group cursor-pointer transition-all duration-300 flex flex-col items-center ${selectedStage === 'school' ? 'scale-110 z-20' : 'hover:scale-105 z-10'}`}
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative transition-all ${
                    selectedStage === 'school' 
                      ? 'bg-amber-500/20 border-2 border-amber-400 ring-4 ring-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.6)]' 
                      : 'bg-slate-900/90 border border-amber-500/40 hover:border-amber-400'
                  }`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 flex items-center justify-center">
                      <Flame className={`w-5 h-5 ${selectedStage === 'school' ? 'text-amber-400 animate-pulse' : 'text-amber-500/80 group-hover:text-amber-400'}`} />
                    </div>
                  </div>
                  <div className="mt-1.5 text-center">
                    <div className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-amber-400">
                      SCHOOL FOUNDATION
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Class 6th – 10th NCERT</div>
                  </div>
                </div>

                {/* Node 2: Top-Right (Intermediate PCM/PCB) */}
                <div 
                  onClick={() => {
                    setSelectedStage('intermediate');
                    setSelectedMilestoneId('m2');
                  }}
                  className={`absolute top-[5%] right-[5%] sm:right-[8%] group cursor-pointer transition-all duration-300 flex flex-col items-center ${selectedStage === 'intermediate' ? 'scale-110 z-20' : 'hover:scale-105 z-10'}`}
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative transition-all ${
                    selectedStage === 'intermediate' 
                      ? 'bg-indigo-500/20 border-2 border-indigo-400 ring-4 ring-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.6)]' 
                      : 'bg-slate-900/90 border border-indigo-500/40 hover:border-indigo-400'
                  }`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 flex items-center justify-center">
                      <Cpu className={`w-5 h-5 ${selectedStage === 'intermediate' ? 'text-indigo-400 animate-pulse' : 'text-indigo-400/80 group-hover:text-indigo-300'}`} />
                    </div>
                  </div>
                  <div className="mt-1.5 text-center">
                    <div className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-400">
                      INTERMEDIATE STREAM
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">11–12th PCM / JEE & NEET</div>
                  </div>
                </div>

                {/* Node 3: Center Core Unfold AI Engine */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 flex flex-col items-center z-30"
                  onClick={() => onOpenKnowYou()}
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-indigo-900/80 via-slate-900 to-purple-950/80 border-2 border-indigo-500/60 p-1 ring-4 ring-indigo-500/20 shadow-[0_0_35px_rgba(99,102,241,0.5)] flex items-center justify-center hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden border border-indigo-400/30">
                      <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
                      <GraduationCap className="w-7 h-7 text-indigo-300 relative z-10" />
                    </div>
                  </div>
                  <div className="mt-1.5 text-center">
                    <div className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-300 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> UNFOLD AI CORE
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Pathway Intelligence Engine</div>
                  </div>
                </div>

                {/* Node 4: Bottom-Left (B.Tech & Specialization) */}
                <div 
                  onClick={() => {
                    setSelectedStage('graduation');
                    setSelectedMilestoneId('g1');
                  }}
                  className={`absolute bottom-[5%] left-[5%] sm:left-[8%] group cursor-pointer transition-all duration-300 flex flex-col items-center ${selectedStage === 'graduation' && selectedMilestoneId !== 'g3' ? 'scale-110 z-20' : 'hover:scale-105 z-10'}`}
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative transition-all ${
                    selectedStage === 'graduation' && selectedMilestoneId !== 'g3'
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 ring-4 ring-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.6)]' 
                      : 'bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400'
                  }`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 flex items-center justify-center">
                      <BookOpen className={`w-5 h-5 ${selectedStage === 'graduation' && selectedMilestoneId !== 'g3' ? 'text-emerald-400 animate-pulse' : 'text-emerald-400/80 group-hover:text-emerald-300'}`} />
                    </div>
                  </div>
                  <div className="mt-1.5 text-center">
                    <div className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-emerald-400">
                      B.TECH & SPECIALIZATION
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">GenAI, Full-Stack & Projects</div>
                  </div>
                </div>

                {/* Node 5: Bottom-Right (Career Launch) */}
                <div 
                  onClick={() => {
                    setSelectedStage('graduation');
                    setSelectedMilestoneId('g3');
                  }}
                  className={`absolute bottom-[5%] right-[5%] sm:right-[8%] group cursor-pointer transition-all duration-300 flex flex-col items-center ${selectedMilestoneId === 'g3' ? 'scale-110 z-20' : 'hover:scale-105 z-10'}`}
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative transition-all ${
                    selectedMilestoneId === 'g3'
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 ring-4 ring-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.6)]' 
                      : 'bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400'
                  }`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 flex items-center justify-center">
                      <IndianRupee className={`w-5 h-5 ${selectedMilestoneId === 'g3' ? 'text-cyan-300 animate-pulse' : 'text-cyan-400/80 group-hover:text-cyan-300'}`} />
                    </div>
                  </div>
                  <div className="mt-1.5 text-center">
                    <div className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-cyan-300">
                      CAREER LAUNCH
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">₹22 – ₹45 LPA Placements</div>
                  </div>
                </div>

              </div>

              {/* Dynamic Interactive Detail Panel Below Canvas */}
              <div className="p-4 bg-slate-900/95 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      Selected Stage Inspection
                    </span>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {currentRoadmap.title}
                    </h4>
                  </div>

                  {/* Phase selector buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {currentRoadmap.milestones.map((m, idx) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMilestoneId(m.id)}
                        className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${
                          m.id === activeMilestone.id 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Phase 0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milestone Detail Card */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300">{activeMilestone.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                      Outcome: {activeMilestone.expectedOutcome}
                    </span>
                  </div>

                  {/* Recommended Resources */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-medium">Recommended Books:</span>
                    {activeMilestone.resources.map((res, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Study Hours Effort Simulator */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Dynamic Effort Simulator:
                    </label>
                    <span className="font-mono font-bold text-indigo-300 bg-indigo-900/80 px-2 py-0.5 rounded text-[11px]">
                      {interactiveHours} Hours Daily Target
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={interactiveHours}
                    onChange={(e) => setInteractiveHours(Number(e.target.value))}
                    className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-2 text-center pt-0.5">
                    <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Est Percentile</span>
                      <div className="text-xs font-mono font-bold text-indigo-300">
                        {selectedStage === 'intermediate' ? `${calculatedPercentile}%ile` : selectedStage === 'school' ? `${Math.min(99, 82 + interactiveHours * 1.8)}%` : `${Math.min(99, 70 + interactiveHours * 2.8)}/100`}
                      </div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Career Salary Potential</span>
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        ₹{calculatedSalary} LPA
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
};

