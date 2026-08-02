import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Mic, MicOff, Sparkles, ArrowRight, Dna, CheckCircle2, Loader2,
  RefreshCw, School, BookOpen, GraduationCap, Send, Lightbulb, Keyboard,
  HelpCircle, AlertCircle, BarChart2, Flame, Award, Clock, Compass, Target
} from 'lucide-react';
import { EducationLevel, StudentProfile, QnAItem, KnowYouResponse, CareerDnaResult, TraitScore } from '../types';

interface KnowYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
  onComplete: (profile: StudentProfile, careerDna: any) => void;
}

export const KnowYouModal: React.FC<KnowYouModalProps> = ({
  isOpen,
  onClose,
  educationLevel,
  setEducationLevel,
  onComplete,
}) => {
  // Steps: 1 = Stage & Name, 2 = Natural Input (Type/Speak), 3 = FollowUp Question, 4 = Understanding/Loading, 5 = CareerDNA Result View
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [inputMethod, setInputMethod] = useState<'type' | 'speak'>('type');
  
  const [studentName, setStudentName] = useState('');
  const [gradeOrField, setGradeOrField] = useState('');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [qnaHistory, setQnaHistory] = useState<QnAItem[]>([]);
  const [currentFollowUp, setCurrentFollowUp] = useState<any | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [confidenceScore, setConfidenceScore] = useState<number>(65);
  
  // Final Generated CareerDNA
  const [generatedDna, setGeneratedDna] = useState<CareerDnaResult | null>(null);
  const [activeCareerIndex, setActiveCareerIndex] = useState<number>(0);
  const [activeExplainTab, setActiveExplainTab] = useState<'why' | 'matching' | 'missing' | 'improve' | 'subjects' | 'projects'>('why');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Understanding your interests...');
  const [errorMessage, setErrorMessage] = useState('');

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  // Speech Recognition Handler
  const toggleSpeechRecognition = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in your browser. Please type your answer below.');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.warn('Speech stop warning:', e);
      }
      setIsRecording(false);
      return;
    }

    setErrorMessage('');

    // Request audio access explicitly if possible to trigger browser permission dialog
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true }).catch((err) => {
          console.warn('Microphone permission request warning:', err);
        });
      }
    } catch (e) {
      console.warn('Microphone permission exception:', e);
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Capture current input text so new voice input appends cleanly
      baseTextRef.current = step === 2 ? inputText : followUpAnswer;

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMessage('');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');

        const prefix = baseTextRef.current ? baseTextRef.current.trim() : '';
        const combined = prefix ? `${prefix} ${transcript}` : transcript;

        if (step === 2) {
          setInputText(combined);
        } else if (step === 3) {
          setFollowUpAnswer(combined);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('Microphone access is restricted or denied. Please check your browser microphone permissions or type your answer.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please speak into your microphone or try typing.');
        } else if (event.error === 'network') {
          setErrorMessage('Speech network error. You can continue by typing your preferences.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
      setErrorMessage('Unable to start microphone. Please type your preferences.');
    }
  };

  // Quick Select Chip Toggle Handler (populates text area for user editing before submission)
  const handleQuickSelectToggle = (chipText: string) => {
    const cleanChip = chipText.trim();
    if (!inputText.trim()) {
      setInputText(cleanChip);
      return;
    }

    const cleanMatchStr = cleanChip.replace(/^[^\w\s]+/, '').trim().toLowerCase();
    const isPresent = inputText.toLowerCase().includes(cleanMatchStr);

    if (isPresent) {
      // Remove option from inputText
      const items = inputText.split(',').map(s => s.trim()).filter(Boolean);
      const remaining = items.filter(i => !i.toLowerCase().includes(cleanMatchStr));
      setInputText(remaining.join(', '));
    } else {
      // Append option to inputText
      setInputText(`${inputText.trim()}, ${cleanChip}`);
    }
  };

  const sampleExamplesByLevel = {
    school: [
      "🧪 Science & Lab Experiments",
      "📐 Math & Logic Puzzles",
      "🤖 Robotics, Coding & Computers",
      "🎨 Drawing, Comics & Digital Art",
      "📖 Storywriting & Reading",
      "🏆 Olympiads & Sports"
    ],
    intermediate: [
      "⚛️ PCM (Physics, Chem, Math & Engineering)",
      "🧬 PCB (Biology, Chem & Medical/Pharmacy)",
      "📊 Commerce, Accounts, Economics & CA",
      "🎨 Arts, Psychology, Humanities & Law",
      "💻 Computer Science, AI & Web Basics",
      "🎯 Entrance Exams (JEE, NEET, CUET, SAT)"
    ],
    graduation: [
      "💻 Computer Science, Software & AI Engineering",
      "💊 Pharmacy, Biotech & Clinical Research",
      "📈 Commerce, Finance, CFA & Business Analytics",
      "⚙️ Mechanical, Electrical & Core Engineering",
      "🩺 Medicine, Healthcare & Nursing",
      "⚖️ Corporate Law, Management & Strategy"
    ]
  };

  // Reset modal step & state whenever opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoadingProgress(0);
      setIsLoading(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleSubmitInput = async (overrideInputs?: string[]) => {
    setErrorMessage('');
    let rawText = (inputText || '').trim();
    if (!rawText && (!overrideInputs || !overrideInputs[0])) {
      rawText = `Exploring career pathways and opportunities for ${gradeOrField.trim() || educationLevel}`;
    }
    const finalInputs = overrideInputs || [rawText];

    const profile: StudentProfile = {
      name: studentName.trim() || 'Student',
      educationLevel,
      gradeOrField: gradeOrField.trim() || (educationLevel === 'school' ? 'Class 8' : educationLevel === 'intermediate' ? '12th PCM' : 'B.Tech / Degree'),
      inputs: finalInputs,
      qnaHistory
    };

    setIsLoading(true);
    setStep(4);
    setLoadingProgress(0);

    const DURATION = 3000;
    const startTime = Date.now();

    // Smooth 3-second progress interval
    let progressTimer: any = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / DURATION) * 100), 100);
      setLoadingProgress(pct);

      if (pct < 35) {
        setLoadingText(`Analyzing profile for ${profile.name}...`);
      } else if (pct < 70) {
        setLoadingText(`Evaluating level-tailored CareerDNA pathways for ${profile.educationLevel.toUpperCase()}...`);
      } else {
        setLoadingText(`Preparing your customized ${profile.educationLevel} workspace...`);
      }

      if (pct >= 100) {
        clearInterval(progressTimer);
      }
    }, 40);

    // Fetch API with timeout controller (max 2.5s)
    let fetchedDna: CareerDnaResult | null = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const res = await fetch('/api/know-you', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentProfile: profile,
          directAnalyze: true
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data: KnowYouResponse = await res.json();
        if (data && data.careerDna && data.careerDna.topCareers && data.careerDna.topCareers.length > 0) {
          fetchedDna = data.careerDna;
        }
      }
    } catch (err: any) {
      console.warn('API fetch aborted or fallback used:', err?.message || err);
    }

    // Calculate remaining time to fulfill exact 3-second experience
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, DURATION - elapsed);

    setTimeout(() => {
      clearInterval(progressTimer);
      setIsLoading(false);
      setStep(1);

      // Trigger completion & workspace transition
      onComplete(profile, fetchedDna);
    }, remainingTime);
  };

  const handleAnswerFollowUp = async (selectedOption?: string) => {
    const ans = selectedOption || followUpAnswer.trim();
    if (!ans) return;

    const newQna: QnAItem[] = [
      ...qnaHistory,
      { question: currentFollowUp?.question || 'Follow-up Question', answer: ans }
    ];
    setQnaHistory(newQna);
    setFollowUpAnswer('');
    
    setIsLoading(true);
    setStep(4);
    setLoadingText('Finding the best possibilities...');

    const profile: StudentProfile = {
      name: studentName.trim() || 'Student',
      educationLevel,
      gradeOrField: gradeOrField.trim() || 'General',
      inputs: [inputText],
      qnaHistory: newQna
    };

    try {
      const res = await fetch('/api/know-you', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentProfile: profile })
      });

      if (!res.ok) throw new Error('Evaluation failed');
      const data: KnowYouResponse = await res.json();

      if (data.confidenceScore) {
        setConfidenceScore(data.confidenceScore);
      }

      if (!data.complete && data.followUpQuestion && newQna.length < 3) {
        setCurrentFollowUp(data.followUpQuestion);
        setIsLoading(false);
        setStep(3);
      } else {
        setLoadingText('Synthesizing your CareerDNA...');
        setGeneratedDna(data.careerDna || null);
        setTimeout(() => {
          setIsLoading(false);
          setStep(5);
        }, 1200);
      }
    } catch (err: any) {
      console.error('Follow-up error:', err);
      setIsLoading(false);
      setStep(5);
    }
  };

  const handleFinalizeWorkspace = () => {
    const profile: StudentProfile = {
      name: studentName.trim() || 'Student',
      educationLevel,
      gradeOrField: gradeOrField.trim() || 'General',
      inputs: [inputText],
      qnaHistory
    };
    onComplete(profile, generatedDna);
  };

  if (!isOpen) return null;

  const currentCareer = generatedDna?.topCareers?.[activeCareerIndex] || generatedDna?.topCareers?.[0];

  const defaultTraits: TraitScore[] = generatedDna?.traitScores || [
    { trait: 'Analytical Thinking', score: 92 },
    { trait: 'Creativity', score: 84 },
    { trait: 'Leadership', score: 69 },
    { trait: 'Communication', score: 77 },
    { trait: 'Technology Interest', score: 96 },
    { trait: 'Business Interest', score: 48 },
    { trait: 'Research Interest', score: 90 }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-3xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  Let's Know You
                </h3>
                <p className="text-xs text-slate-500">
                  Help us understand you so we can build a career roadmap that's truly yours.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              id="close-know-you-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">

            {/* STEP 1: Academic Stage & Student Name */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Welcome! What is your current level?</h4>
                  <p className="text-xs text-slate-500 mt-1">This usually takes less than 2 minutes.</p>
                </div>

                {/* Level Toggle Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setEducationLevel('school')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      educationLevel === 'school'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <School className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">School Student</p>
                    <p className="text-[11px] text-slate-500">Classes 6 to 10</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEducationLevel('intermediate')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      educationLevel === 'intermediate'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <BookOpen className="w-6 h-6 text-indigo-500 mb-2" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">High School / 12th</p>
                    <p className="text-[11px] text-slate-500">Class 11, 12, Diploma</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEducationLevel('graduation')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      educationLevel === 'graduation'
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <GraduationCap className="w-6 h-6 text-purple-500 mb-2" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Undergraduate</p>
                    <p className="text-[11px] text-slate-500">College / University</p>
                  </button>
                </div>

                {/* Name & Grade Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Grade or Stream / Field
                    </label>
                    <input
                      type="text"
                      value={gradeOrField}
                      onChange={(e) => setGradeOrField(e.target.value)}
                      placeholder={
                        educationLevel === 'school' 
                          ? 'e.g. 7, Class 8, or 10th' 
                          : educationLevel === 'intermediate' 
                          ? 'e.g. 11th, 12th PCM, Diploma' 
                          : 'e.g. B.Tech, Pharmacy, B.Com, MBBS'
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 font-medium">Step 1 of 2: Profile & Stage</p>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
                    id="step1-proceed-btn"
                  >
                    Start Discovery
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            )}

            {/* STEP 2: Level-Tailored Discovery Conversation */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* Header tailored to education level */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                      {educationLevel === 'school' && `Welcome ${studentName.trim() || 'Student'}! What excites you most at school?`}
                      {educationLevel === 'intermediate' && `Welcome ${studentName.trim() || 'Student'}! Which stream or entrance path interests you?`}
                      {educationLevel === 'graduation' && `Welcome ${studentName.trim() || 'Student'}! What is your major or career direction?`}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {educationLevel === 'school' && "Select your favorite subjects, hobbies or topics below, or write your own thoughts."}
                      {educationLevel === 'intermediate' && "Choose your preferred stream (PCM/PCB/Commerce/Arts) or target entrance exam."}
                      {educationLevel === 'graduation' && "Select your primary degree specialization or target tech/corporate domain."}
                    </p>
                  </div>

                  {/* Input Method Toggle */}
                  <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setInputMethod('type');
                        if (isRecording) toggleSpeechRecognition();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        inputMethod === 'type'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                      ⌨ Type
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInputMethod('speak');
                        toggleSpeechRecognition();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isRecording
                          ? 'bg-rose-500 text-white shadow-sm animate-pulse'
                          : inputMethod === 'speak'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isRecording ? 'Stop Speaking' : '🎤 Speak'}</span>
                    </button>
                  </div>
                </div>

                {/* Level-Tailored Option Chips Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Quick Select (Tailored for {educationLevel === 'school' ? 'Classes 6-10' : educationLevel === 'intermediate' ? 'Classes 11-12' : 'College / Degree'}):</span>
                    </p>
                    <span className="text-[11px] text-slate-400">Click chips to add/remove, then edit below</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {sampleExamplesByLevel[educationLevel].map((ex, i) => {
                      const cleanMatchStr = ex.replace(/^[^\w\s]+/, '').trim().toLowerCase();
                      const isSelected = inputText.toLowerCase().includes(cleanMatchStr);

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleQuickSelectToggle(ex)}
                          className={`p-3.5 rounded-2xl border text-xs font-semibold text-left transition-all shadow-sm flex items-center justify-between group ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                              : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span className="group-hover:scale-105 transition-transform">{ex}</span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Main Textarea Input for Custom Answers */}
                <div className="relative space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-500">
                      Or write / customize your goals & preferences:
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition()}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isRecording
                          ? 'bg-rose-500 text-white animate-pulse shadow-md'
                          : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isRecording ? 'Listening... (Click to stop)' : 'Voice Input'}</span>
                    </button>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                    placeholder={
                      educationLevel === 'school'
                        ? "e.g. I love drawing comics, building Lego sets, and solving math puzzles..."
                        : educationLevel === 'intermediate'
                        ? "e.g. Planning to take PCM with Computer Science, targeting JEE and B.Tech in AI..."
                        : "e.g. Currently in 3rd year Computer Science, interested in AI systems, full-stack, and high-paying roles..."
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                  />

                  {/* Speech Indicator */}
                  {isRecording && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span>Microphone Active — Speak now. Your words will appear above in real-time.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSpeechRecognition()}
                        className="px-2 py-0.5 rounded bg-rose-500 text-white text-[11px] font-bold"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-600 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    ← Change Stage / Level
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmitInput()}
                    className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xl shadow-indigo-500/20 flex items-center gap-2 transition-all"
                    id="submit-natural-input-btn"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Analyze Profile & Build Roadmap
                  </button>
                </div>

              </motion.div>
            )}

            {/* STEP 3: Adaptive Follow-Up Question */}
            {step === 3 && currentFollowUp && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>I'd love to understand a little more...</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentFollowUp.question}
                  </h4>
                  {currentFollowUp.subtitle && (
                    <p className="text-xs text-slate-600 dark:text-slate-300">{currentFollowUp.subtitle}</p>
                  )}
                </div>

                {/* Option Chips */}
                {currentFollowUp.options && currentFollowUp.options.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500">Pick what describes you best:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentFollowUp.options.map((opt: string, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAnswerFollowUp(opt)}
                          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-xs font-semibold text-left transition-all shadow-sm"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Typed / Spoken Answer */}
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">Or write in your own words:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={followUpAnswer}
                      onChange={(e) => setFollowUpAnswer(e.target.value)}
                      placeholder="Type your reply here..."
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAnswerFollowUp()}
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shrink-0"
                    >
                      Send
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* STEP 4: 3-Second Loading Animation & Progress Bar */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center space-y-6">
                
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative">
                    <Dna className="w-12 h-12 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Synthesizing Your CareerDNA</h4>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                    {loadingText}
                  </p>
                </div>

                {/* 3-second Progress Bar */}
                <div className="max-w-xs mx-auto space-y-2">
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-75"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>{loadingProgress}% Complete</span>
                    <span>Opening Dashboard...</span>
                  </div>
                </div>

                <div className="max-w-xs mx-auto space-y-2 text-left pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${loadingProgress > 30 ? 'text-emerald-500' : 'text-slate-400'} shrink-0`} />
                    <span>Analyzing stage & preferences</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${loadingProgress > 65 ? 'text-emerald-500' : 'text-slate-400'} shrink-0`} />
                    <span>Matching {educationLevel.toUpperCase()} career pathways</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${loadingProgress > 90 ? 'text-emerald-500' : 'text-slate-400'} shrink-0`} />
                    <span>Launching level-tailored workspace</span>
                  </div>
                </div>

              </motion.div>
            )}

            {/* STEP 5: CareerDNA Presentation View */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                
                {/* Confidence Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                      {confidenceScore}%
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Unfold AI High Confidence Match</h4>
                      <p className="text-xs text-slate-500">Deep psychological & academic profile complete.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleFinalizeWorkspace}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
                    id="open-full-workspace-btn"
                  >
                    Enter Workspace
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Trait Scores with Animated Progress Bars */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-indigo-500" />
                    <span>Your Psychological Trait Scores</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {defaultTraits.map((t, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200">{t.trait}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{t.score}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${t.score}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top 5 Career Matches Header */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span>Top 5 Recommended Careers</span>
                  </h4>

                  {/* Career selector chips */}
                  <div className="flex flex-wrap gap-2">
                    {generatedDna?.topCareers?.map((c, idx) => (
                      <button
                        key={c.id || idx}
                        onClick={() => setActiveCareerIndex(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          activeCareerIndex === idx
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <span>{c.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-extrabold">
                          {c.matchScore}%
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Active Selected Career Card Details & Explain Why */}
                  {currentCareer && (
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-6">
                      
                      {/* Title Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentCareer.title}</h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold">
                              {currentCareer.matchScore}% Match
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{currentCareer.reason}</p>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                            Demand: {currentCareer.expectedFutureDemand || 'High'}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
                            Time: {currentCareer.timeRequired || '2 - 4 Years'}
                          </span>
                        </div>
                      </div>

                      {/* Explain Why Navigation Tabs */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Explain Why Section</span>
                        </p>

                        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
                          <button
                            onClick={() => setActiveExplainTab('why')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeExplainTab === 'why' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Why Suitable
                          </button>
                          <button
                            onClick={() => setActiveExplainTab('matching')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeExplainTab === 'matching' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Skills Matching
                          </button>
                          <button
                            onClick={() => setActiveExplainTab('missing')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeExplainTab === 'missing' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Skills Missing
                          </button>
                          <button
                            onClick={() => setActiveExplainTab('improve')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeExplainTab === 'improve' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            What to Improve
                          </button>
                          <button
                            onClick={() => setActiveExplainTab('subjects')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeExplainTab === 'subjects' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Focus Subjects
                          </button>
                          <button
                            onClick={() => setActiveExplainTab('projects')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeExplainTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Projects to Build
                          </button>
                        </div>

                        {/* Explain Tab Content Box */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-h-[100px]">
                          {activeExplainTab === 'why' && (
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {currentCareer.whySuitable || currentCareer.reason}
                            </p>
                          )}

                          {activeExplainTab === 'matching' && (
                            <div className="flex flex-wrap gap-2">
                              {(currentCareer.skillsMatching || ['Problem Solving', 'Creativity', 'Logical Thinking']).map((sk, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}

                          {activeExplainTab === 'missing' && (
                            <div className="flex flex-wrap gap-2">
                              {(currentCareer.skillsMissing || ['Advanced Coding Syntax', 'System Architecture']).map((sk, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                                  • {sk}
                                </span>
                              ))}
                            </div>
                          )}

                          {activeExplainTab === 'improve' && (
                            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                              {(currentCareer.whatToImprove || ['Practice structured coding problems daily', 'Build 2 hands-on projects']).map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {activeExplainTab === 'subjects' && (
                            <div className="flex flex-wrap gap-2">
                              {(currentCareer.subjectsToFocus || ['Mathematics', 'Computer Science', 'Physics']).map((subj, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                  {subj}
                                </span>
                              ))}
                            </div>
                          )}

                          {activeExplainTab === 'projects' && (
                            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                              {(currentCareer.projectsToBuild || ['Build an AI Notes Summarizer App', 'Design a 2D Game in Scratch/Python']).map((proj, i) => (
                                <li key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
                                  🚀 {proj}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* Final Enter Workspace Action */}
                <div className="pt-4 flex justify-end border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={handleFinalizeWorkspace}
                    className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all"
                  >
                    <span>Enter Personal Career Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            )}

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};

