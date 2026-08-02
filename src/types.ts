export type EducationLevel = 'school' | 'intermediate' | 'graduation';

export interface QnAItem {
  question: string;
  answer: string;
}

export interface StudentProfile {
  name: string;
  educationLevel: EducationLevel;
  gradeOrField: string; // e.g., "Class 8", "12th PCM", "B.Tech Computer Science"
  inputs: string[];
  qnaHistory: QnAItem[];
}

export interface LearningResource {
  title: string;
  type: 'course' | 'book' | 'app' | 'platform' | 'video';
  description: string;
  url?: string;
}

export interface CareerMatch {
  id: string;
  title: string;
  matchScore: number; // 0 - 100
  category: string;
  reason?: string; // Brief core reason
  why?: string; // Optional synonym for reason
  competitions?: string[]; // Optional target competitions
  expectedFutureDemand?: string; // e.g. "Very High", "Emerging", "Stable"
  salaryRange?: {
    entry: string;
    mid: string;
    senior: string;
  };
  difficulty?: 'Beginner' | 'Moderate' | 'Challenging' | 'Advanced' | string;
  timeRequired?: string; // e.g. "2 - 4 Years"
  
  // "Explain Why" Section
  whySuitable?: string;
  skillsMatching?: string[];
  skillsMissing?: string[];
  whatToImprove?: string[];
  subjectsToFocus?: string[];
  projectsToBuild?: string[];

  // Extended Details
  benefits?: string[];
  challenges?: string[];
  requiredSkills?: string[];
  futureScope?: string;
  learningResources?: LearningResource[];
  projects?: string[];
  timelineSummary?: string;
  alternativeOptions?: string[];
  entranceExams?: string[];
  topColleges?: string[];
  internships?: string[];
  openSourceSuggestions?: string[];
  githubLinkedInTips?: string[];
  parentsTips?: string[];
  interestingFacts?: string[];
}

export interface TraitScore {
  trait: string; // e.g., "Analytical Thinking", "Creativity", "Leadership", "Communication", "Technology Interest", "Business Interest", "Research Interest"
  score: number; // 0 - 100
}

export interface RoadmapStepDetail {
  id: string;
  title: string;
  estimatedTime?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  priority?: 'Critical' | 'High' | 'Medium' | 'Foundational';
  whyNow?: string;
  howItHelps?: string;
  unlocks?: string;
  resources?: { title: string; provider: string; type: string; url?: string }[];
  completed?: boolean;
}

export interface RoadmapMilestone {
  id: string;
  phase: string;
  timeframe: string;
  title: string;
  description: string;
  skillsToLearn: string[];
  recommendedCourses: string[];
  projects: string[];
  competitions?: string[];
  certifications?: string[];
  internships?: string[];
  status: 'completed' | 'in_progress' | 'upcoming';
  // Rich AI Engine Additions
  estimatedDurationWeeks?: number;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  whyThisPhaseNow?: string;
  goalImpactExplanation?: string;
  unlockedOpportunities?: string[];
  detailedSteps?: RoadmapStepDetail[];
  resourcesList?: { title: string; provider: string; type: 'course' | 'doc' | 'video' | 'project'; link?: string }[];
}

export interface RoadmapCustomizationSettings {
  targetCareerGoal: string;
  weeklyStudyHours: number;
  targetTimelineMonths: number;
  learningStyle: 'practical' | 'video' | 'structured' | 'bootcamp';
  educationLevel: EducationLevel;
}

export interface SkillGapItem {
  skill: string;
  currentLevel: number; // 1-100
  targetLevel: number; // 1-100
  category: string;
}

export interface CareerDnaResult {
  confidenceScore?: number; // 0 - 100%
  studentSummary: string;
  primaryTraits: string[];
  traitScores?: TraitScore[];
  topCareers: CareerMatch[];
  roadmap: RoadmapMilestone[];
  skillGapAnalysis: SkillGapItem[];
  industryDemand: {
    trend: 'High' | 'Growing' | 'Emerging' | 'Stable';
    demandScore: number; // 1-100
    keyInsights: string;
  };
  suggestedScenarios: string[];
}

export interface FollowUpQuestion {
  question: string;
  subtitle: string;
  options: string[];
}

export interface KnowYouResponse {
  complete: boolean;
  confidenceScore?: number;
  followUpQuestion?: FollowUpQuestion;
  careerDna?: CareerDnaResult;
}

export interface SimulationResult {
  scenario: string;
  roadmapChanges: string[];
  readinessIncrease: number;
  unlockedOpportunities: string[];
  realisticCompaniesOrInstitutes: string[];
  aiVerdict: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  recommendedProjects: string[];
  linkedInOptimization: string[];
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

