import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Zap,
  BookOpen,
  Code2,
  Award,
  ChevronDown,
  ChevronUp,
  Sliders,
  RotateCw,
  Target,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Flame,
  Check,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Layers,
  Lightbulb,
  ShieldCheck,
  Star,
  PartyPopper,
  X
} from 'lucide-react';
import {
  StudentProfile,
  CareerDnaResult,
  RoadmapMilestone,
  RoadmapCustomizationSettings,
  EducationLevel
} from '../types';

interface CareerRoadmapEngineProps {
  profile: StudentProfile;
  careerDna: CareerDnaResult;
  onUpdateRoadmap?: (newRoadmap: RoadmapMilestone[]) => void;
}

// Stage-tailored AI Roadmap Generator Helper
const generateTailoredRoadmap = (
  level: EducationLevel,
  goal: string,
  weeklyHours: number,
  timelineMonths: number,
  style: string
): RoadmapMilestone[] => {
  const goalLower = goal.toLowerCase();
  const isTech = goalLower.includes('tech') || goalLower.includes('ai') || goalLower.includes('code') || goalLower.includes('developer') || goalLower.includes('software') || goalLower.includes('data');
  
  if (level === 'school') {
    return [
      {
        id: 'sch-phase-1',
        phase: 'Phase 1',
        timeframe: 'Months 1 - 2',
        title: 'Core Fundamentals & Logical Thinking',
        description: 'Build strong analytical problem-solving through advanced mathematics, logic puzzles, and foundational science.',
        status: 'in_progress',
        estimatedDurationWeeks: 8,
        difficultyLevel: 'Beginner',
        whyThisPhaseNow: 'Early mastery of mathematical logic creates the neural pathways required for STEM and high-order reasoning.',
        goalImpactExplanation: `Lays the foundational problem-solving engine required for a future as a ${goal}.`,
        unlockedOpportunities: ['School Science Fair Representative', 'Math Olympiad Qualifier', 'Basic Block Coding Badge'],
        skillsToLearn: ['Algebra & Geometry Logic', 'Pattern Recognition', 'Scratch / Block Programming', 'Science Lab Basics'],
        recommendedCourses: ['Khan Academy Pre-Algebra', 'MIT Scratch Creative Computing', 'Coursera STEM for Kids'],
        projects: ['Interactive Maze Game in Scratch', 'Solar Energy Physics Model', 'Logic Puzzle Workbook'],
        competitions: ['National Cyber Olympiad (NCO)', 'International Math Olympiad (IMO)', 'Inspire Awards MANAK'],
        detailedSteps: [
          {
            id: 'sch-step-1',
            title: 'Master Scratch / Block Coding Algorithms',
            estimatedTime: '2 Weeks',
            difficulty: 'Beginner',
            priority: 'Critical',
            whyNow: 'Scratch teaches variables, loops, and conditions without syntax friction.',
            howItHelps: `Teaches computational thinking needed for ${goal}.`,
            unlocks: 'First Interactive Game Project',
            resources: [
              { title: 'Scratch Studio Official Tutorials', provider: 'MIT Media Lab', type: 'doc' },
              { title: 'Block Coding for Young Innovators', provider: 'YouTube', type: 'video' }
            ]
          },
          {
            id: 'sch-step-2',
            title: 'Advanced School Mathematics & Algebra',
            estimatedTime: '3 Weeks',
            difficulty: 'Beginner',
            priority: 'High',
            whyNow: 'Algebra is the bedrock of computer logic and quantitative analysis.',
            howItHelps: 'Improves logic placement in competitive exams.',
            unlocks: 'Olympiad Stage 1 Preparation',
            resources: [
              { title: 'Algebra Foundations', provider: 'Khan Academy', type: 'course' }
            ]
          }
        ]
      },
      {
        id: 'sch-phase-2',
        phase: 'Phase 2',
        timeframe: 'Months 3 - 5',
        title: 'Introduction to Real World STEM & Robotics',
        description: 'Move from block coding to basic Python syntax, micro-controllers, and hands-on science experiments.',
        status: 'upcoming',
        estimatedDurationWeeks: 12,
        difficultyLevel: 'Beginner',
        whyThisPhaseNow: 'Connecting software logic to physical devices or real calculations boosts engagement and intuition.',
        goalImpactExplanation: `Builds early confidence with text-based tools used in ${goal}.`,
        unlockedOpportunities: ['School Tinkering Club Lead', 'State Robotics Competition', 'Young Scientist Award'],
        skillsToLearn: ['Basic Python Syntax', 'Variables & Loops', 'Arduino / Raspberry Pi Basics', 'Scientific Experimentation'],
        recommendedCourses: ['Python for Beginners by University of Michigan', 'Tinkercad Circuits Masterclass'],
        projects: ['Smart Plant Watering System with Micro:bit', 'Calculator App in Python', 'Weather Tracker'],
        competitions: ['ATL Marathon (Atal Innovation Mission)', 'Google Science Fair'],
        detailedSteps: [
          {
            id: 'sch-step-3',
            title: 'Write Your First Python Script',
            estimatedTime: '3 Weeks',
            difficulty: 'Beginner',
            priority: 'Critical',
            whyNow: 'Python is the world\'s most readable and versatile programming language.',
            howItHelps: 'Essential stepping stone for coding mastery.',
            unlocks: 'Python Micro-Projects',
            resources: [
              { title: 'Python for Everybody', provider: 'Coursera', type: 'course' }
            ]
          }
        ]
      },
      {
        id: 'sch-phase-3',
        phase: 'Phase 3',
        timeframe: 'Months 6 - 8',
        title: 'High School Stream Selection & Future Readiness',
        description: 'Evaluate senior high school streams (PCM / PCB / Commerce / Vocational) aligned with your CareerDNA.',
        status: 'upcoming',
        estimatedDurationWeeks: 10,
        difficultyLevel: 'Intermediate',
        whyThisPhaseNow: 'Selecting the right 11th-12th stream guarantees smooth university admission pathways.',
        goalImpactExplanation: `Ensures subject prerequisites match entrance requirements for ${goal}.`,
        unlockedOpportunities: ['Stream Mastery Certificate', 'Senior High School Scholarship'],
        skillsToLearn: ['Career Stream Analysis', 'Physics & Chemistry Concepts', 'Technical Communication', 'Time Management'],
        recommendedCourses: ['CareerDNA Stream Navigator', 'CBSE / ICSE Foundation Preparation'],
        projects: ['High School Career Vision Document', 'Science Exhibition Model'],
        competitions: ['NTSE (National Talent Search Examination)', 'KVPY Foundation']
      }
    ];
  }

  if (level === 'intermediate') {
    return [
      {
        id: 'int-phase-1',
        phase: 'Phase 1',
        timeframe: 'Months 1 - 3',
        title: 'Stream Alignment & Entrance Exam Prep',
        description: 'Master core 11th/12th concepts (Physics, Chemistry, Math/CS) while building an entrance examination strategy.',
        status: 'in_progress',
        estimatedDurationWeeks: 12,
        difficultyLevel: 'Intermediate',
        whyThisPhaseNow: 'Competitive exam scores decide tier-1 college allocations and merit scholarships.',
        goalImpactExplanation: `Secures admission into top universities for ${goal}.`,
        unlockedOpportunities: ['Tier-1 College Qualification', 'National Merit Scholarship Eligibility'],
        skillsToLearn: ['PCM Concept Mastery', 'Speed Problem Solving', 'Mock Test Strategy', 'Analytical Chemistry / Physics'],
        recommendedCourses: ['JEE / CUET Master Series', 'NCERT Deep Dive', 'Unacademy Competitive Prep'],
        projects: ['Physics Simulation App', 'Formula Vault Database', 'Entrance Exam Strategy Planner'],
        competitions: ['JEE Main & Advanced', 'CUET (Common University Entrance Test)', 'SAT / BITSAT'],
        detailedSteps: [
          {
            id: 'int-step-1',
            title: 'Master Calculus & Linear Mathematics',
            estimatedTime: '4 Weeks',
            difficulty: 'Intermediate',
            priority: 'Critical',
            whyNow: 'Calculus powers engineering physics, machine learning, and quantitative finance.',
            howItHelps: 'Directly tested in top entrance examinations.',
            unlocks: 'Physics Mechanics Mastery',
            resources: [{ title: 'Calculus 1 & 2', provider: 'Khan Academy', type: 'course' }]
          },
          {
            id: 'int-step-2',
            title: 'Build Foundations in Python & Web Syntax',
            estimatedTime: '3 Weeks',
            difficulty: 'Beginner',
            priority: 'High',
            whyNow: 'Early coding gives you a 1-year head start over university peers.',
            howItHelps: `Early proof of passion for ${goal}.`,
            unlocks: 'First Web App Deployment',
            resources: [{ title: 'CS50x: Intro to Computer Science', provider: 'Harvard edX', type: 'course' }]
          }
        ]
      },
      {
        id: 'int-phase-2',
        phase: 'Phase 2',
        timeframe: 'Months 4 - 6',
        title: 'University Mapping & Practical Projects',
        description: 'Shortlist top colleges, apply for merit scholarships, and build 2 real-world projects to showcase in admissions.',
        status: 'upcoming',
        estimatedDurationWeeks: 12,
        difficultyLevel: 'Intermediate',
        whyThisPhaseNow: 'Admissions committees now favor candidates with practical project portfolios over pure marks.',
        goalImpactExplanation: `Differentiates your college application for ${goal}.`,
        unlockedOpportunities: ['Early University Offer Letters', 'Admissions Interview Readiness'],
        skillsToLearn: ['College Selection Strategy', 'Portfolio Website Creation', 'SOP Writing', 'Technical Writing'],
        recommendedCourses: ['College Admissions Mastery', 'HTML/CSS/JS Project Workshop'],
        projects: ['Personal Student Portfolio Site', 'Community Problem Solver Web Tool'],
        competitions: ['Hackerearth Student Hackathons', 'Google Code-in Archives']
      },
      {
        id: 'int-phase-3',
        phase: 'Phase 3',
        timeframe: 'Months 7 - 9',
        title: 'Degree Onboarding & Skill Acceleration',
        description: 'Complete pre-university bootcamp modules in Git, Linux terminal, and modern tech stacks.',
        status: 'upcoming',
        estimatedDurationWeeks: 12,
        difficultyLevel: 'Advanced',
        whyThisPhaseNow: 'Hitting college with developer tools already installed makes you an immediate standout.',
        goalImpactExplanation: `Accelerates your transition into an elite ${goal} candidate.`,
        unlockedOpportunities: ['Campus Tech Club Lead', 'First Year Research Internship'],
        skillsToLearn: ['Git & GitHub', 'Linux Command Line', 'Data Structures Intro', 'Technical Collaboration'],
        recommendedCourses: ['The Missing Semester of Your CS Education (MIT)', 'Git Complete Guide'],
        projects: ['Open Source Documentation PR', 'CLI Productivity Tool']
      }
    ];
  }

  // Default: Graduation Level
  return [
    {
      id: 'grad-phase-1',
      phase: 'Phase 1',
      timeframe: `Months 1 - ${Math.max(2, Math.round(timelineMonths * 0.2))}`,
      title: 'CS Foundations & Core Language Mastery',
      description: `Master high-level programming (${isTech ? 'Python & TypeScript' : 'Core Analytics Stack'}), Data Structures, Git version control, and Unix CLI fundamentals.`,
      status: 'in_progress',
      estimatedDurationWeeks: Math.round((weeklyHours >= 20 ? 6 : 10)),
      difficultyLevel: 'Beginner',
      whyThisPhaseNow: 'Solid fundamentals are the non-negotiable prerequisite for passing top-tier technical screening assessments.',
      goalImpactExplanation: `Builds the exact technical foundation expected by top employers hiring for ${goal}.`,
      unlockedOpportunities: ['Tech Club Member', 'Open Source Contributor Status', 'Junior Developer Readiness'],
      skillsToLearn: ['Data Structures & Algorithms', 'Python / TypeScript', 'Git Workflow & GitHub', 'Object Oriented Design'],
      recommendedCourses: ['LeetCode 75 Study Plan', 'NeetCode Algorithms', 'Modern TypeScript Masterclass'],
      projects: ['Full Stack Task Engine', 'Data Structure Visualizer', 'CLI System Monitor'],
      certifications: ['AWS Certified Cloud Practitioner', 'MetaData Science Associate'],
      detailedSteps: [
        {
          id: 'grad-step-1',
          title: 'Master Git & GitHub Collaborative Workflows',
          estimatedTime: '1 Week',
          difficulty: 'Beginner',
          priority: 'Critical',
          whyNow: 'Every engineering team requires clean git commits, branch management, and PR reviews.',
          howItHelps: 'Makes your project code publicly verifiable by recruiters.',
          unlocks: 'GitHub Green Streak & Portfolio Showcase',
          resources: [
            { title: 'Git & GitHub Complete Bootcamp', provider: 'Udemy', type: 'course' },
            { title: 'Pro Git Book (Free)', provider: 'Git-SCM', type: 'doc' }
          ]
        },
        {
          id: 'grad-step-2',
          title: 'Master Core Data Structures (Arrays, Trees, Graphs)',
          estimatedTime: '3 Weeks',
          difficulty: 'Intermediate',
          priority: 'Critical',
          whyNow: 'Data structures account for 80% of technical interview questions.',
          howItHelps: `Crucial for passing coding screens for ${goal} roles.`,
          unlocks: 'LeetCode Medium Problem Solving Ability',
          resources: [
            { title: 'Data Structures in Python / C++', provider: 'NeetCode.io', type: 'video' },
            { title: 'Algorithm Design Manual', provider: 'Book', type: 'doc' }
          ]
        }
      ]
    },
    {
      id: 'grad-phase-2',
      phase: 'Phase 2',
      timeframe: `Months ${Math.max(3, Math.round(timelineMonths * 0.25))} - ${Math.round(timelineMonths * 0.5)}`,
      title: `${goal} Specialized Tech Stack & Framework Deep-Dive`,
      description: `Dive deep into modern domain frameworks (e.g. ${isTech ? 'React, Next.js, FastAPI, PyTorch, Docker, PostgreSQL' : 'Advanced Analytics, PowerBI, SQL, Financial Models'}).`,
      status: 'upcoming',
      estimatedDurationWeeks: 10,
      difficultyLevel: 'Intermediate',
      whyThisPhaseNow: 'Generalist skills don\'t land top jobs—employers hire candidates with specific, production-grade framework mastery.',
      goalImpactExplanation: `Equips you with modern tools used daily by industry ${goal} teams.`,
      unlockedOpportunities: ['Hackathon Finalist Track', 'Freelance Project Eligibility', 'Startup Paid Internship'],
      skillsToLearn: ['FastAPI / Node.js Backends', 'PostgreSQL / Vector DBs', 'REST & GraphQL APIs', 'Docker Containerization'],
      recommendedCourses: ['Full Stack Open (University of Helsinki)', 'Docker & Kubernetes Deep Dive'],
      projects: ['Production AI Web Application', 'Real-time Multi-user Workspace', 'Distributed API Proxy Engine'],
      certifications: ['PostgreSQL Certified Developer', 'TensorFlow / PyTorch Specialist'],
      detailedSteps: [
        {
          id: 'grad-step-3',
          title: 'Build REST APIs with FastAPI & Postgres',
          estimatedTime: '2 Weeks',
          difficulty: 'Intermediate',
          priority: 'High',
          whyNow: 'Backend APIs power every web application and AI model integration.',
          howItHelps: 'Gives your frontend tools full database persistence.',
          unlocks: 'Full-Stack Architecture Capabilities',
          resources: [{ title: 'FastAPI Official Documentation & Crash Course', provider: 'FastAPI.tiangolo.com', type: 'doc' }]
        }
      ]
    },
    {
      id: 'grad-phase-3',
      phase: 'Phase 3',
      timeframe: `Months ${Math.round(timelineMonths * 0.55)} - ${Math.round(timelineMonths * 0.75)}`,
      title: 'Production Projects, Open Source & High-Impact Internships',
      description: 'Ship 2 production-ready capstone applications with live URLs, contribute to open source repos, and land target internships.',
      status: 'upcoming',
      estimatedDurationWeeks: 12,
      difficultyLevel: 'Advanced',
      whyThisPhaseNow: 'Proof of work is 10x more valuable to hiring managers than academic grades alone.',
      goalImpactExplanation: `Builds the irresistible resume proof needed to secure ${goal} interviews.`,
      unlockedOpportunities: ['Pre-Placement Offer (PPO)', 'Paid Industry Internship', 'Tech Speaker / Writer'],
      skillsToLearn: ['CI/CD Deployment Pipelines', 'System Architecture Design', 'Production Monitoring', 'Agile Teamwork'],
      recommendedCourses: ['Open Source Contributor Playbook', 'System Design Primer'],
      projects: ['Deployed SaaS Product on Cloud Run / Vercel', 'Popular Open Source GitHub PR'],
      internships: ['Tier-1 Product Startup Developer Intern', 'Big Tech Summer Analyst'],
      certifications: ['AWS Solutions Architect Associate']
    },
    {
      id: 'grad-phase-4',
      phase: 'Phase 4',
      timeframe: `Months ${Math.round(timelineMonths * 0.8)} - ${timelineMonths}`,
      title: 'ATS Resume Optimization, Mock Interviews & Placement Strategy',
      description: 'Optimize resume for ATS parsers (90+ score), practice live technical mock interviews, and apply strategically to target companies.',
      status: 'upcoming',
      estimatedDurationWeeks: 8,
      difficultyLevel: 'Advanced',
      whyThisPhaseNow: 'Translates your months of hard work into concrete job offers with maximum salary leverage.',
      goalImpactExplanation: `Final execution step to secure your dream offer as a ${goal}.`,
      unlockedOpportunities: ['Multiple Full-time Offer Letters', 'High-Package Placement', 'Career Freedom'],
      skillsToLearn: ['System Design Interviews', 'Behavioral Interviewing (STAR Method)', 'Salary Negotiation', 'ATS Formatting'],
      recommendedCourses: ['Grokking the System Design Interview', 'CareerDNA Placement Accelerator'],
      projects: ['Interactive Live Portfolio Site', 'System Architecture Deck'],
      internships: ['Pre-Placement Offer (PPO) Conversion']
    }
  ];
};

export const CareerRoadmapEngine: React.FC<CareerRoadmapEngineProps> = ({
  profile,
  careerDna,
  onUpdateRoadmap
}) => {
  // Customization state
  const [settings, setSettings] = useState<RoadmapCustomizationSettings>({
    targetCareerGoal: careerDna.topCareers?.[0]?.title || 'AI Engineer',
    weeklyStudyHours: 15,
    targetTimelineMonths: profile.educationLevel === 'school' ? 24 : profile.educationLevel === 'intermediate' ? 18 : 12,
    learningStyle: (profile.inputs?.[0]?.toLowerCase().includes('video') ? 'video' : 'practical'),
    educationLevel: profile.educationLevel
  });

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenStep, setRegenStep] = useState(0);

  // Active filter tab
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for roadmap milestones and completed tasks
  const [roadmapMilestones, setRoadmapMilestones] = useState<RoadmapMilestone[]>(() => {
    if (careerDna.roadmap && careerDna.roadmap.length > 0) {
      return careerDna.roadmap;
    }
    return generateTailoredRoadmap(
      profile.educationLevel,
      settings.targetCareerGoal,
      settings.weeklyStudyHours,
      settings.targetTimelineMonths,
      settings.learningStyle
    );
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({
    'grad-step-1': true // sample initial completed task
  });

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    [roadmapMilestones[0]?.id || 'p1']: true
  });

  // Toast / Milestone Celebration state
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalItems = 0;
    let completedItems = 0;

    roadmapMilestones.forEach((m) => {
      // count skills
      m.skillsToLearn?.forEach((sk, idx) => {
        totalItems++;
        if (completedTaskIds[`${m.id}-sk-${idx}`]) completedItems++;
      });
      // count projects
      m.projects?.forEach((pj, idx) => {
        totalItems++;
        if (completedTaskIds[`${m.id}-pj-${idx}`]) completedItems++;
      });
      // count detailed steps
      m.detailedSteps?.forEach((st) => {
        totalItems++;
        if (completedTaskIds[st.id]) completedItems++;
      });
    });

    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    return {
      totalItems,
      completedItems,
      remainingItems: totalItems - completedItems,
      percent
    };
  }, [roadmapMilestones, completedTaskIds]);

  // Toggle Task Completion
  const toggleTask = (taskId: string, title?: string) => {
    setCompletedTaskIds((prev) => {
      const isNowDone = !prev[taskId];
      const next = { ...prev, [taskId]: isNowDone };

      if (isNowDone) {
        setCelebrationMessage(
          title ? `🎉 Task Completed: "${title}"!` : '🎉 Milestone Progress Saved! Keep building momentum!'
        );
        setTimeout(() => setCelebrationMessage(null), 4000);
      }

      return next;
    });
  };

  // Toggle Phase Expanded Accordion
  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Trigger AI Roadmap Regeneration
  const handleRegenerateRoadmap = () => {
    setIsRegenerating(true);
    setRegenStep(0);

    const steps = [
      'Analyzing student profile & CareerDNA scores...',
      'Recalculating learning pace for ' + settings.weeklyStudyHours + ' hrs/week...',
      'Structuring stage-adapted roadmap phases for ' + settings.targetCareerGoal + '...',
      'Synthesizing real-world project ideas and course links...',
      'Finalizing your customized AI Career Roadmap!'
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setRegenStep(current);
      } else {
        clearInterval(interval);
        const newRoadmap = generateTailoredRoadmap(
          settings.educationLevel,
          settings.targetCareerGoal,
          settings.weeklyStudyHours,
          settings.targetTimelineMonths,
          settings.learningStyle
        );
        setRoadmapMilestones(newRoadmap);
        if (onUpdateRoadmap) {
          onUpdateRoadmap(newRoadmap);
        }
        setIsRegenerating(false);
        setIsCustomizing(false);
        setExpandedPhases({ [newRoadmap[0]?.id || 'p1']: true });
        setCelebrationMessage(`✨ AI Roadmap successfully regenerated for ${settings.targetCareerGoal}!`);
        setTimeout(() => setCelebrationMessage(null), 4000);
      }
    }, 600);
  };

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return roadmapMilestones.filter((m) => {
      if (statusFilter !== 'all') {
        if (statusFilter === 'in_progress' && m.status !== 'in_progress') return false;
        if (statusFilter === 'upcoming' && m.status !== 'upcoming') return false;
        if (statusFilter === 'completed' && m.status !== 'completed') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = m.title.toLowerCase().includes(q);
        const inDesc = m.description.toLowerCase().includes(q);
        const inSkills = m.skillsToLearn?.some((s) => s.toLowerCase().includes(q));
        const inProjects = m.projects?.some((p) => p.toLowerCase().includes(q));
        return inTitle || inDesc || inSkills || inProjects;
      }

      return true;
    });
  }, [roadmapMilestones, statusFilter, searchQuery]);

  return (
    <div className="space-y-8">
      
      {/* Toast / Celebration Banner */}
      <AnimatePresence>
        {celebrationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <PartyPopper className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-xs font-bold">{celebrationMessage}</p>
                <p className="text-[11px] text-emerald-100">AI Mentor logged your progress into CareerDNA analytics.</p>
              </div>
            </div>

            <button
              onClick={() => setCelebrationMessage(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Roadmap Header Control Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Top Title & Target Goal */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Adaptive Career Roadmap
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold capitalize">
                Stage: {profile.educationLevel}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Target: {settings.targetCareerGoal}</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({settings.weeklyStudyHours} hrs/wk • {settings.targetTimelineMonths} Months)
              </span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              An evolving AI-driven journey. Completed steps recalibrate downstream milestone estimates and unlock new opportunities.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
              id="customize-roadmap-btn"
            >
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>{isCustomizing ? 'Close Parameters' : 'Customize AI Parameters'}</span>
            </button>

            <button
              onClick={handleRegenerateRoadmap}
              disabled={isRegenerating}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              id="regenerate-roadmap-btn"
            >
              <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate AI Roadmap'}</span>
            </button>
          </div>
        </div>

        {/* Overall Progress Meter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Target className="w-4 h-4" />
                Overall Roadmap Completion
              </span>
              <span className="font-mono text-sm">{stats.percent}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percent}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 h-full rounded-full shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-0.5">
              <span>{stats.completedItems} of {stats.totalItems} milestone items verified</span>
              <span>{stats.remainingItems} tasks remaining</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Weekly Commitment</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{settings.weeklyStudyHours} Hours / Week</p>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">~{(settings.weeklyStudyHours / 7).toFixed(1)} hrs daily pace</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Estimated Timeline</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{settings.targetTimelineMonths} Months</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">On track for placement</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Customization Drawer Form */}
        <AnimatePresence>
          {isCustomizing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4"
            >
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    Adjust AI Roadmap Parameters
                  </h3>
                  <span className="text-[11px] text-slate-500">Regenerating creates custom tailored learning stages</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  
                  {/* Target Career Goal */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                      Target Career Goal
                    </label>
                    <input
                      type="text"
                      value={settings.targetCareerGoal}
                      onChange={(e) => setSettings({ ...settings, targetCareerGoal: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. AI Engineer, Full Stack"
                    />
                  </div>

                  {/* Weekly Study Hours */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                      Study Time: <span className="text-indigo-600 font-bold">{settings.weeklyStudyHours} hrs/wk</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      step={5}
                      value={settings.weeklyStudyHours}
                      onChange={(e) => setSettings({ ...settings, weeklyStudyHours: Number(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer mt-2"
                    />
                  </div>

                  {/* Target Timeline */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                      Target Timeline
                    </label>
                    <select
                      value={settings.targetTimelineMonths}
                      onChange={(e) => setSettings({ ...settings, targetTimelineMonths: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={6}>6 Months (Fast Track)</option>
                      <option value={12}>1 Year (Recommended)</option>
                      <option value={18}>18 Months (Balanced)</option>
                      <option value={24}>2 Years (Full Academic)</option>
                      <option value={48}>4 Years (Degree Span)</option>
                    </select>
                  </div>

                  {/* Learning Style */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                      Preferred Learning Style
                    </label>
                    <select
                      value={settings.learningStyle}
                      onChange={(e) => setSettings({ ...settings, learningStyle: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="practical">Practical / Project-First</option>
                      <option value="video">Video & Guided Tutorials</option>
                      <option value="structured">Structured Documentation</option>
                      <option value="bootcamp">Intensive Sprint Bootcamp</option>
                    </select>
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleRegenerateRoadmap}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Apply Settings & Regenerate Roadmap</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Loading Screen Overlay */}
        {isRegenerating && (
          <div className="p-6 rounded-2xl bg-indigo-950 text-white space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
              <div>
                <h3 className="font-bold text-sm">CareerDNA AI Engine in Progress</h3>
                <p className="text-xs text-indigo-200">{['Analyzing profile...', 'Recalculating pace...', 'Structuring roadmap...', 'Formatting resources...', 'Finalizing!'][regenStep]}</p>
              </div>
            </div>
            <div className="w-full bg-indigo-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-400 h-full transition-all duration-500"
                style={{ width: `${((regenStep + 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Phases ({roadmapMilestones.length})
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === 'in_progress'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            In Active Focus
          </button>

          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === 'upcoming'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Upcoming Stages
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, projects..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Dynamic AI Mentor Guidance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white text-xs flex items-center gap-3.5 shadow-md">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300 flex items-center gap-1">
            <span>AI MENTOR INSIGHT FOR ROADMAP ACCELERATION</span>
          </span>
          <p className="text-slate-200 leading-relaxed">
            {profile.educationLevel === 'school' && 'Focus on logic puzzles and Scratch coding before jumping to syntax. Small consistent wins build long-term confidence!'}
            {profile.educationLevel === 'intermediate' && 'Combine entrance exam formulas with 1 functional Python project to build a stand-out college application profile.'}
            {profile.educationLevel === 'graduation' && `Completing Phase 1 (DS & Git) by end of this month puts you in the top 10% of candidates applying for ${settings.targetCareerGoal} internships.`}
          </p>
        </div>
      </div>

      {/* Visual Roadmap Phases List */}
      <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-10">
        
        {filteredMilestones.map((milestone, phaseIdx) => {
          const isExpanded = !!expandedPhases[milestone.id];

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIdx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-4 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center font-bold text-[10px] ${
                  milestone.status === 'in_progress'
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                    : milestone.status === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {milestone.status === 'completed' ? <Check className="w-3 h-3" /> : phaseIdx + 1}
              </div>

              {/* Main Phase Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        {milestone.phase} • {milestone.timeframe}
                      </span>
                      {milestone.difficultyLevel && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {milestone.difficultyLevel}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{milestone.title}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        milestone.status === 'in_progress'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                          : milestone.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {milestone.status === 'in_progress'
                        ? '🔥 Active Focus'
                        : milestone.status === 'completed'
                        ? '✓ Phase Completed'
                        : 'Upcoming Stage'}
                    </span>

                    <button
                      onClick={() => togglePhaseExpand(milestone.id)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                      id={`toggle-phase-${milestone.id}`}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {milestone.description}
                </p>

                {/* AI Reasoning Box: Why This Phase Now & Goal Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      WHY THIS PHASE NOW:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {milestone.whyThisPhaseNow || 'Positions foundational logic before high-order engineering tasks.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      IMPACT ON {settings.targetCareerGoal.toUpperCase()}:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {milestone.goalImpactExplanation || `Directly satisfies technical benchmarks required for ${settings.targetCareerGoal}.`}
                    </p>
                  </div>
                </div>

                {/* Expanded Content (Detailed Steps & Action Items) */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 pt-2 border-t border-slate-100 dark:border-slate-800"
                  >

                    {/* Detailed Steps Cards (if present) */}
                    {milestone.detailedSteps && milestone.detailedSteps.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-indigo-500" />
                          Detailed Actionable Micro-Steps
                        </h4>

                        <div className="space-y-3">
                          {milestone.detailedSteps.map((step) => {
                            const isDone = !!completedTaskIds[step.id];
                            return (
                              <div
                                key={step.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                  isDone
                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1.5 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <button
                                        onClick={() => toggleTask(step.id, step.title)}
                                        className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white hover:text-indigo-600 text-left"
                                      >
                                        {isDone ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        ) : (
                                          <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                                        )}
                                        <span className={isDone ? 'line-through text-slate-400' : ''}>
                                          {step.title}
                                        </span>
                                      </button>

                                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                                        {step.estimatedTime}
                                      </span>

                                      {step.priority && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                          step.priority === 'Critical'
                                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                                            : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                                        }`}>
                                          {step.priority} Priority
                                        </span>
                                      )}
                                    </div>

                                    {step.whyNow && (
                                      <p className="text-xs text-slate-600 dark:text-slate-300 pl-6">
                                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Why Now: </span>
                                        {step.whyNow}
                                      </p>
                                    )}

                                    {/* Step Resources */}
                                    {step.resources && step.resources.length > 0 && (
                                      <div className="pl-6 pt-1 flex flex-wrap gap-2">
                                        {step.resources.map((res, rIdx) => (
                                          <a
                                            key={rIdx}
                                            href={res.url || '#'}
                                            onClick={(e) => {
                                              if (!res.url) e.preventDefault();
                                            }}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                                          >
                                            <BookOpen className="w-3 h-3 text-indigo-500" />
                                            <span>{res.title} ({res.provider})</span>
                                            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => toggleTask(step.id, step.title)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                                      isDone
                                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                    }`}
                                  >
                                    {isDone ? 'Completed ✓' : 'Start / Mark Done'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Checkbox Grids: Skills To Learn & Projects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Skills Checkbox List */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                          <Code2 className="w-4 h-4 text-indigo-500" />
                          Target Skills to Master
                        </h4>

                        <div className="space-y-2">
                          {milestone.skillsToLearn?.map((skill, sIdx) => {
                            const taskId = `${milestone.id}-sk-${sIdx}`;
                            const isDone = !!completedTaskIds[taskId];

                            return (
                              <button
                                key={sIdx}
                                onClick={() => toggleTask(taskId, skill)}
                                className="w-full flex items-center gap-2.5 text-xs text-left p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                                )}
                                <span className={`font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {skill}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Milestone Projects & Competitions */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Capstone Projects & Target Competitions
                        </h4>

                        <div className="space-y-2">
                          {milestone.projects?.map((proj, pIdx) => {
                            const taskId = `${milestone.id}-pj-${pIdx}`;
                            const isDone = !!completedTaskIds[taskId];

                            return (
                              <button
                                key={pIdx}
                                onClick={() => toggleTask(taskId, proj)}
                                className="w-full flex items-center gap-2.5 text-xs text-left p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                                )}
                                <span className={`font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {proj}
                                </span>
                              </button>
                            );
                          })}

                          {/* Competitions or Entrance Exams (if present) */}
                          {milestone.competitions && milestone.competitions.length > 0 && (
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Target Exams / Hackathons</span>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {milestone.competitions.map((comp, cIdx) => (
                                  <span key={cIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                                    🏆 {comp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Unlocked Opportunities Badges */}
                    {milestone.unlockedOpportunities && milestone.unlockedOpportunities.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                        <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          UNLOCKED MILESTONE BADGES & OPPORTUNITIES:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {milestone.unlockedOpportunities.map((opp, oIdx) => (
                            <span
                              key={oIdx}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                            >
                              <Star className="w-3 h-3 text-amber-500" />
                              <span>{opp}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </motion.div>
                )}

              </div>
            </motion.div>
          );
        })}

        {filteredMilestones.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">No phases match your search or status filter.</p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
