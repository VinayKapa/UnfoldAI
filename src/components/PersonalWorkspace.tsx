import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dna, Compass, Zap, BarChart3, Code2, FileText, MessageSquare, TrendingUp, Settings,
  CheckCircle2, Circle, ArrowRight, Sparkles, ExternalLink, RefreshCw, Send, User,
  Award, School, BookOpen, GraduationCap, IndianRupee, Lightbulb, AlertTriangle, Play, HelpCircle, Briefcase, Network, Brain
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { StudentProfile, CareerDnaResult, SimulationResult, MentorMessage } from '../types';
import { CareerRoadmapEngine } from './CareerRoadmapEngine';
import { ExplainableAiWorkspace } from './ExplainableAiWorkspace';
import { ExplainabilityModal } from './ExplainabilityModal';

interface PersonalWorkspaceProps {
  profile: StudentProfile;
  careerDna: CareerDnaResult;
  setProfile: (p: StudentProfile) => void;
  setCareerDna: (c: CareerDnaResult) => void;
  onOpenKnowYou: () => void;
}

export const PersonalWorkspace: React.FC<PersonalWorkspaceProps> = ({
  profile,
  careerDna,
  setProfile,
  setCareerDna,
  onOpenKnowYou,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dna' | 'roadmap' | 'simulator' | 'skills' | 'projects' | 'resume' | 'mentor' | 'analytics' | 'settings' | 'explainability'
  >('dna');

  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [explainTarget, setExplainTarget] = useState<{ id: string; title: string }>({
    id: 'rec_mlops',
    title: 'MLOps & Systems Architecture'
  });

  const handleOpenExplainModal = (id: string, title: string) => {
    setExplainTarget({ id, title });
    setExplainModalOpen(true);
  };

  const [selectedCareerId, setSelectedCareerId] = useState<string>(
    careerDna.topCareers?.[0]?.id || ''
  );

  // Simulator state
  const [simulationInput, setSimulationInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  // Resume state
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [resumeResult, setResumeResult] = useState<any | null>(null);

  // Mentor Chat state
  const [mentorInput, setMentorInput] = useState('');
  const [isMentorThinking, setIsMentorThinking] = useState(false);
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${profile.name}! I am your 24/7 Unfold AI Mentor. Based on your profile (${profile.gradeOrField}), your top career match is ${careerDna.topCareers?.[0]?.title || 'Software & AI Engineer'}. How can I guide you today?`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'How should I prepare for this role over the next 6 months?',
        'What are the best open-source projects or hackathons to join?',
        'How can I improve my skill gap scores?'
      ]
    }
  ]);

  // Roadmap task check state
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentCareer =
    careerDna.topCareers?.find((c) => c.id === selectedCareerId) ||
    careerDna.topCareers?.[0];

  // Run Simulator
  const handleRunSimulation = async (scenarioToRun?: string) => {
    const sc = scenarioToRun || simulationInput.trim();
    if (!sc) return;

    setIsSimulating(true);
    setSimResult(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: sc, studentProfile: profile, careerDna })
      });

      if (!res.ok) throw new Error('Simulation failed');
      const data: SimulationResult = await res.json();
      setSimResult(data);
    } catch (err) {
      console.error(err);
      // Fallback result
      setSimResult({
        scenario: sc,
        roadmapChanges: [
          'Accelerates Python & Data Structures mastery by 2 terms',
          'Unlocks Tier-1 competitive hackathon invitations',
          'Adds 2 capstone projects to portfolio'
        ],
        readinessIncrease: 22,
        unlockedOpportunities: ['GSoC Open Source Contributor', 'High-Tier Internship Fast-Track', 'Direct Tech Mentor Referrals'],
        realisticCompaniesOrInstitutes: ['Google', 'Atlassian', 'Microsoft', 'Uber'],
        aiVerdict: `Executing "${sc}" boosts placement readiness significantly and opens direct tier-1 company opportunities.`
      });
    } finally {
      setIsSimulating(false);
    }
  };

  // Run Resume Analyzer
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzingResume(true);

    try {
      const res = await fetch('/api/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          educationLevel: profile.educationLevel,
          targetRole: currentCareer?.title
        })
      });

      if (!res.ok) throw new Error('Resume analysis failed');
      const data = await res.json();
      setResumeResult(data);
    } catch (err) {
      console.error(err);
      setResumeResult({
        overallScore: 78,
        strengths: ['Clear project technical stack', 'Good academic background', 'Relevant coursework listed'],
        improvements: ['Quantify project impact metrics (e.g. reduced response time by 30%)', 'Add link to GitHub and live Vercel deployments', 'Highlight system design fundamentals'],
        missingKeywords: ['TypeScript', 'Generative AI', 'PostgreSQL', 'Docker', 'CI/CD'],
        recommendedProjects: ['Full-Stack AI SaaS with Gemini API', 'Distributed Cache with Node.js & Redis'],
        linkedInOptimization: ['Feature video walk-throughs of top projects', 'Add clean developer bio mentioning primary tech stack']
      });
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  // Send Mentor Message
  const handleSendMentorMessage = async (promptOverride?: string) => {
    const textToSend = promptOverride || mentorInput.trim();
    if (!textToSend) return;

    const userMsg: MentorMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMentorMessages((prev) => [...prev, userMsg]);
    setMentorInput('');
    setIsMentorThinking(true);

    try {
      const res = await fetch('/api/career-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          studentProfile: profile,
          careerDna,
          history: mentorMessages.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!res.ok) throw new Error('Mentor API error');
      const data = await res.json();

      const aiMsg: MentorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Great question! Let us tackle this step by step.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: [
          'What are the 3 key milestones for next month?',
          'How do I balance coursework with career projects?'
        ]
      };

      setMentorMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const aiMsg: MentorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `That's a great direction, ${profile.name}! I recommend prioritizing your top skill gap (${careerDna.skillGapAnalysis?.[0]?.skill || 'Core Fundamentals'}) while building 1 practical project.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMentorMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsMentorThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors">
      
      {/* Sidebar Navigation - Fixed & Non-Scrolling on Desktop */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-3.5 shrink-0 flex flex-col justify-between md:sticky md:top-0 md:h-screen md:max-h-screen md:overflow-y-auto z-20">
        
        <div className="space-y-4">
          
          {/* Student Profile Card Header */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              {profile.name.charAt(0) || 'S'}
            </div>
            <div className="overflow-hidden min-w-0">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{profile.name}</h4>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                {profile.gradeOrField || (profile.educationLevel === 'intermediate' ? 'Class 11-12 / Inter' : profile.educationLevel === 'graduation' ? 'Undergraduate / College' : 'Class 6-10 / School')}
              </p>
            </div>
          </div>

          {/* Perspective Label */}
          <div className="px-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>
              {profile.educationLevel === 'intermediate'
                ? 'Inter Dashboard'
                : profile.educationLevel === 'graduation'
                ? 'Graduate Dashboard'
                : 'School Dashboard'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {profile.educationLevel === 'intermediate' ? '11th-12th' : profile.educationLevel === 'graduation' ? 'Degree' : '6th-10th'}
            </span>
          </div>

          {/* Navigation Items - Dynamically Mapped by Perspective */}
          <nav className="space-y-1 overflow-x-auto md:overflow-x-visible flex md:flex-col pb-2 md:pb-0 gap-1 md:gap-0">
            
            {/* 1. MATCHES */}
            <button
              onClick={() => setActiveTab('dna')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                activeTab === 'dna'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Dna className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                {profile.educationLevel === 'intermediate'
                  ? 'Inter Career & Stream Matches'
                  : profile.educationLevel === 'graduation'
                  ? 'Graduate Career Matches'
                  : 'School AI Matches'}
              </span>
            </button>

            {/* 2. ROADMAP */}
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                {profile.educationLevel === 'intermediate'
                  ? 'Stream & Entrance Roadmap'
                  : profile.educationLevel === 'graduation'
                  ? 'Career & Placement Roadmap'
                  : 'Stream & High School Roadmap'}
              </span>
            </button>

            {/* 3. SIMULATOR */}
            <button
              onClick={() => setActiveTab('simulator')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">
                {profile.educationLevel === 'intermediate'
                  ? 'Stream & Exam Simulator'
                  : profile.educationLevel === 'graduation'
                  ? 'Career & Salary Simulator'
                  : 'Interest & Stream Simulator'}
              </span>
            </button>

            {/* 4. SKILL RADAR */}
            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                activeTab === 'skills'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                {profile.educationLevel === 'intermediate'
                  ? 'Subject Foundation Radar'
                  : profile.educationLevel === 'graduation'
                  ? 'Industry Skill Gap Radar'
                  : 'Subject & Aptitude Radar'}
              </span>
            </button>

            {/* 5. PROJECTS / EXAMS (For Inter & Graduate) */}
            {profile.educationLevel !== 'school' && (
              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                  activeTab === 'projects'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {profile.educationLevel === 'intermediate' ? (
                  <Award className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Code2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {profile.educationLevel === 'intermediate'
                    ? 'Entrance Exams & Colleges'
                    : 'Projects & Open Source'}
                </span>
              </button>
            )}

            {/* 6. RESUME & PLACEMENT ANALYZER (For Graduation) */}
            {profile.educationLevel === 'graduation' && (
              <button
                onClick={() => setActiveTab('resume')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                  activeTab === 'resume'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Resume & ATS Analyzer</span>
              </button>
            )}

            {/* 7. AI MENTOR / COUNSELOR */}
            <button
              onClick={() => setActiveTab('mentor')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                activeTab === 'mentor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="whitespace-nowrap">
                {profile.educationLevel === 'intermediate'
                  ? '24/7 AI Inter Counselor'
                  : profile.educationLevel === 'graduation'
                  ? '24/7 AI Career Mentor'
                  : '24/7 AI School Counselor'}
              </span>
            </button>

            {/* 8. INDUSTRY DEMAND / TRENDS */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                {profile.educationLevel === 'intermediate'
                  ? 'Degree Scope & Growth'
                  : profile.educationLevel === 'graduation'
                  ? 'Industry & Hiring Demand'
                  : 'Future Career Trends'}
              </span>
            </button>

            {/* 9. EXPLAINABLE AI */}
            <button
              onClick={() => setActiveTab('explainability')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                activeTab === 'explainability'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className="whitespace-nowrap">Explainable AI (Why?)</span>
            </button>

            {/* 10. SETTINGS */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Profile Settings</span>
            </button>

          </nav>

        </div>

        {/* Retake / Regenerate Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
          <button
            onClick={onOpenKnowYou}
            className="w-full py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Update "Let's Know You"</span>
          </button>
        </div>

      </aside>

      {/* Main Workspace Workspace Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-6xl mx-auto space-y-8">
        
        {/* Workspace Top Banner Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.name}'s Personal Workspace
              </h1>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5 ${
                profile.educationLevel === 'school'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : profile.educationLevel === 'intermediate'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
              }`}>
                {profile.educationLevel === 'school' && <School className="w-3.5 h-3.5 text-blue-500" />}
                {profile.educationLevel === 'intermediate' && <BookOpen className="w-3.5 h-3.5 text-purple-500" />}
                {profile.educationLevel === 'graduation' && <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />}
                <span>
                  {profile.educationLevel === 'school' ? 'School Student (Class 6-10)' : profile.educationLevel === 'intermediate' ? 'High School / 12th' : 'Undergraduate (College)'}
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {profile.educationLevel === 'school' && "🎯 Customized for Middle School & Class 10 Stream Selection, Science Fairs & Olympiads."}
              {profile.educationLevel === 'intermediate' && "🎯 Customized for 11th/12th Competitive Exams (JEE/NEET/CUET), Target Colleges & Degree Selection."}
              {profile.educationLevel === 'graduation' && "🎯 Customized for College Undergraduates: Internships, Open Source, High-Paying Careers & Resumes."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Active AI Guidance
            </span>
          </div>
        </div>

        {/* TAB 1: CAREER DNA MATCHES */}
        {activeTab === 'dna' && (
          <div className="space-y-6">

            {/* LEVEL SPECIFIC HIGHLIGHT BANNER */}
            {profile.educationLevel === 'school' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white space-y-3 shadow-md border border-blue-800/50">
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-blue-100">School Student Dashboard (Classes 6 to 10)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800 text-xs space-y-1">
                    <p className="font-bold text-blue-300">Class 10 Stream Path</p>
                    <p className="text-slate-300 text-[11px]">Recommended: PCM / Computer Science based on your spatial and logical math scores.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800 text-xs space-y-1">
                    <p className="font-bold text-amber-300">Olympiads & Fairs</p>
                    <p className="text-slate-300 text-[11px]">Inspire MANAK, NSO (Science), IMO (Maths) & FIRST LEGO League.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800 text-xs space-y-1">
                    <p className="font-bold text-emerald-300">Early Tinkering</p>
                    <p className="text-slate-300 text-[11px]">Scratch block coding, Tinkercad 3D modeling & beginner Arduino kits.</p>
                  </div>
                </div>
              </div>
            )}

            {profile.educationLevel === 'intermediate' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 text-white space-y-3 shadow-md border border-purple-800/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-purple-100">High School & Entrance Exam Dashboard (11th & 12th)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800 text-xs space-y-1">
                    <p className="font-bold text-purple-300">Target Entrance Exams</p>
                    <p className="text-slate-300 text-[11px]">JEE Main & Advanced, BITSAT, NEET UG, CUET & SAT International.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800 text-xs space-y-1">
                    <p className="font-bold text-amber-300">Top Target Institutes</p>
                    <p className="text-slate-300 text-[11px]">IITs, NITs, BITS Pilani, AIIMS, SRCC, NIPER & Top State Universities.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800 text-xs space-y-1">
                    <p className="font-bold text-emerald-300">Degree Alignment</p>
                    <p className="text-slate-300 text-[11px]">B.Tech AI / CS, MBBS / Pharma, B.Com / CA, or Corporate Law.</p>
                  </div>
                </div>
              </div>
            )}

            {profile.educationLevel === 'graduation' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white space-y-3 shadow-md border border-indigo-800/50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-indigo-100">Undergraduate & Career Placement Accelerator (College)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-800 text-xs space-y-1">
                    <p className="font-bold text-indigo-300">Placement Benchmark</p>
                    <p className="text-slate-300 text-[11px]">Target Package: $70,000 - $180,000 / yr across Tier-1 Tech & Corporate.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-800 text-xs space-y-1">
                    <p className="font-bold text-amber-300">Internship & Open Source</p>
                    <p className="text-slate-300 text-[11px]">GSoC GitHub contributions, capstone SaaS projects & PPO tracks.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-800 text-xs space-y-1">
                    <p className="font-bold text-emerald-300">ATS Resume Optimizer</p>
                    <p className="text-slate-300 text-[11px]">Live ATS Keyword scoring, system design metrics & GitHub linkage.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Trait Scores Bar Chart / Progress Section */}
            {careerDna.traitScores && careerDna.traitScores.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    <span>Psychological Trait Scores (CareerDNA)</span>
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950">
                    Confidence: {careerDna.confidenceScore || 92}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {careerDna.traitScores.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-200 truncate">{t.trait}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{t.score}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${t.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Match Score Selector */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Dna className="w-4 h-4 text-indigo-500" />
                <span>AI Generated Career Match Scores</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {careerDna.topCareers?.map((career) => {
                  const isSelected = career.id === currentCareer?.id;
                  return (
                    <button
                      key={career.id}
                      onClick={() => setSelectedCareerId(career.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {career.category}
                        </span>
                        <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          {career.matchScore}%
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{career.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{career.why}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Career Detailed Breakdown */}
            {currentCareer && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                
                {/* Career Title & WHY */}
                <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{currentCareer.title}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold">
                        {currentCareer.matchScore}% Match
                      </span>
                    </h3>
                    <button
                      onClick={() => handleOpenExplainModal(currentCareer.id, currentCareer.title)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Why? (Graph Reasoning)</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        WHY THIS WAS RECOMMENDED FOR YOU:
                      </span>
                      <button
                        onClick={() => handleOpenExplainModal(currentCareer.id, currentCareer.title)}
                        className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <Network className="w-3 h-3" />
                        Inspect Decision Graph & Pathways →
                      </button>
                    </div>
                    <p className="leading-relaxed">{currentCareer.why}</p>
                  </div>
                </div>

                {/* Salary Range & Future Scope */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-emerald-500" />
                      Expected Salary Benchmarks (LPA)
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] text-slate-400">Entry Level</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{currentCareer.salaryRange?.entry}</p>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] text-slate-400">Mid Career</p>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{currentCareer.salaryRange?.mid}</p>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] text-slate-400">Senior Lead</p>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{currentCareer.salaryRange?.senior}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Future Industry Scope
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentCareer.futureScope}
                    </p>
                  </div>
                </div>

                {/* Level Specific Modules */}
                {/* SCHOOL SPECIFIC */}
                {profile.educationLevel === 'school' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {currentCareer.subjectsToFocus && (
                      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2">
                        <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          Subjects To Focus (Class 6-10)
                        </h4>
                        <ul className="space-y-1">
                          {currentCareer.subjectsToFocus.map((s, i) => (
                            <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentCareer.parentsTips && (
                      <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Tips for Parents
                        </h4>
                        <ul className="space-y-1">
                          {currentCareer.parentsTips.map((t, i) => (
                            <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* INTERMEDIATE SPECIFIC */}
                {profile.educationLevel === 'intermediate' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {currentCareer.entranceExams && (
                      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                        <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-indigo-500" />
                          Target Entrance Exams
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {currentCareer.entranceExams.map((e, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-medium">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentCareer.topColleges && (
                      <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2">
                        <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-purple-500" />
                          Target Universities & Institutes
                        </h4>
                        <ul className="space-y-1">
                          {currentCareer.topColleges.map((c, i) => (
                            <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* GRADUATION SPECIFIC */}
                {profile.educationLevel === 'graduation' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {currentCareer.internships && (
                      <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2">
                        <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-purple-500" />
                          Target Internships & PPO Tracks
                        </h4>
                        <ul className="space-y-1">
                          {currentCareer.internships.map((int, i) => (
                            <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                              <span>{int}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentCareer.githubLinkedInTips && (
                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-indigo-500" />
                          GitHub & LinkedIn Optimization
                        </h4>
                        <ul className="space-y-1">
                          {currentCareer.githubLinkedInTips.map((tip, i) => (
                            <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Benefits & Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Key Benefits & Perks
                    </h4>
                    <ul className="space-y-1">
                      {currentCareer.benefits?.map((b, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Realities & Challenges
                    </h4>
                    <ul className="space-y-1">
                      {currentCareer.challenges?.map((ch, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{ch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Learning Resources */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Recommended Learning Resources
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentCareer.learningResources?.map((res, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          {res.type}
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{res.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{res.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </div>
        )}

        {/* TAB 2: VISUAL ROADMAP TIMELINE ENGINE */}
        {activeTab === 'roadmap' && (
          <CareerRoadmapEngine
            profile={profile}
            careerDna={careerDna}
            onUpdateRoadmap={(newRoadmap) =>
              setCareerDna({
                ...careerDna,
                roadmap: newRoadmap,
              })
            }
          />
        )}

        {/* TAB 3: CAREER SIMULATOR ("WHAT-IF") */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold">Career Outcome Simulator</h3>
              </div>
              <p className="text-xs text-amber-100 max-w-2xl leading-relaxed">
                Test "what-if" scenarios to simulate future outcomes! See how completing internships, learning specific tech stacks, or clearing entrance exams dynamically shifts your career trajectory and company options.
              </p>
            </div>

            {/* Suggested Scenario Chips */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500">Quick preset scenarios to test:</span>
              <div className="flex flex-wrap gap-2">
                {careerDna.suggestedScenarios?.map((scenario, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSimulationInput(scenario);
                      handleRunSimulation(scenario);
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-500 hover:text-amber-600 font-medium transition-all shadow-sm"
                  >
                    ⚡ "{scenario}"
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Scenario Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={simulationInput}
                onChange={(e) => setSimulationInput(e.target.value)}
                placeholder="e.g. If I build 5 open-source full-stack projects in Python & React..."
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => handleRunSimulation()}
                disabled={isSimulating}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-slate-950" />}
                Run Simulation
              </button>
            </div>

            {/* Simulation Results Box */}
            {simResult && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-lg space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Simulation Outcome</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">"{simResult.scenario}"</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      +{simResult.readinessIncrease}%
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium">Placement Readiness Boost</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-1">AI VERDICT:</span>
                  <p>{simResult.aiVerdict}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Roadmap Adjustments</h5>
                    <ul className="space-y-1">
                      {simResult.roadmapChanges?.map((rc, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{rc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Realistic Company / Institute Tiers Unlocked</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {simResult.realisticCompaniesOrInstitutes?.map((comp, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>
        )}

        {/* TAB 4: SKILLS & SKILL GAP RADAR CHART */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  <span>Skill Gap Analysis Radar</span>
                </h3>
                <p className="text-xs text-slate-500">Compares your estimated current skill level against target proficiency.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Radar Chart */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-[360px] flex flex-col justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={careerDna.skillGapAnalysis}>
                    <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="skill" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Current Level" dataKey="currentLevel" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                    <Radar name="Target Level" dataKey="targetLevel" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Skill Bars List */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Skill</span>
                  <span>Gap Progress</span>
                </div>

                {careerDna.skillGapAnalysis?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <span>{item.skill}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{item.currentLevel} / {item.targetLevel} pts</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${item.currentLevel}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: PROJECTS & OPEN SOURCE */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-500" />
                  <span>Curated Capstone Projects & Open Source</span>
                </h3>
                <p className="text-xs text-slate-500">Build these projects to elevate your real-world portfolio.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentCareer?.projects?.map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-indigo-400 transition-all shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{proj}</h4>
                  <p className="text-xs text-slate-500">
                    Handcrafted project blueprint tailored to demonstrate your technical ability to recruiters & college evaluators.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('mentor');
                      handleSendMentorMessage(`Can you give me a step-by-step build architecture for the project: "${proj}"?`);
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Ask Mentor for Build Guide →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: RESUME & PLACEMENT ANALYZER */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <span>Resume & Skill Profile Analyzer</span>
              </h3>
              <p className="text-xs text-slate-500">
                Paste your resume text or skill summary to evaluate against tier-1 company requirements for <strong className="text-slate-800 dark:text-slate-200">{currentCareer?.title}</strong>.
              </p>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={6}
                placeholder="Paste your resume content, project list, or technical skills profile here..."
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzingResume}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isAnalyzingResume ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Analyze Resume
                </button>
              </div>
            </div>

            {/* Resume Analysis Output */}
            {resumeResult && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-600">ATS Evaluation Score</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Profile Readiness</h4>
                  </div>
                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {resumeResult.overallScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Strengths Identified</h5>
                    <ul className="space-y-1">
                      {resumeResult.strengths?.map((s: string, i: number) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Missing Keywords</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {resumeResult.missingKeywords?.map((kw: string, i: number) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-900">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>
        )}

        {/* TAB 7: 24/7 AI MENTOR CHAT */}
        {activeTab === 'mentor' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col h-[580px] shadow-sm">
            
            {/* Header */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">24/7 AI Career Mentor</h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Online • Context-Aware</p>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 py-4 overflow-y-auto space-y-4 pr-2">
              {mentorMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="text-[9px] opacity-60 block text-right mt-1">{msg.timestamp}</span>
                  </div>

                  {msg.suggestedPrompts && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-xl">
                      {msg.suggestedPrompts.map((sp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMentorMessage(sp)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all"
                        >
                          "{sp}"
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isMentorThinking && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Mentor is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={mentorInput}
                onChange={(e) => setMentorInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMentorMessage()}
                placeholder="Ask your career mentor anything..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleSendMentorMessage()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 8: ANALYTICS & INDUSTRY DEMAND */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <span>Industry Demand Analytics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Demand Trend</span>
                  <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                    {careerDna.industryDemand?.trend} Demand
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Demand Index Score: {careerDna.industryDemand?.demandScore} / 100
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Key Industry Insights</span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {careerDna.industryDemand?.keyInsights}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile & Preferences</h3>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Education Level
                </label>
                <select
                  value={profile.educationLevel}
                  onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="school">School (Classes 6-10)</option>
                  <option value="intermediate">Intermediate / Diploma (11-12th)</option>
                  <option value="graduation">Graduation / Undergraduate</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenKnowYou}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-sm"
                >
                  Re-run "Let's Know You" AI Onboarding
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: EXPLAINABLE AI WORKSPACE */}
        {activeTab === 'explainability' && (
          <ExplainableAiWorkspace
            recommendationId={currentCareer?.id || 'rec_mlops'}
            recommendationTitle={currentCareer?.title || 'MLOps & Systems Architecture'}
          />
        )}

      </main>

      {/* Interactive AI Graph Explainability Modal */}
      <ExplainabilityModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        recommendationId={explainTarget.id}
        recommendationTitle={explainTarget.title}
      />

    </div>
  );
};
