/**
 * CareerDNA Decision Engine - Core Intelligence Layer
 * ===================================================
 * Independent TypeScript Decision Engine mirroring the Python services.
 * Implements 5 modular services:
 * 1. Interest Analyzer
 * 2. Career Matcher
 * 3. Roadmap Generator
 * 4. Career Simulator Engine (Parametric What-If Engine)
 * 5. Explainable Recommendation Engine
 * 
 * Separates AI understanding (Gemini structured JSON parsing) from business logic.
 */

export interface StudentInputStructured {
  educationLevel: 'school' | 'intermediate' | 'graduation' | string;
  interests: string[];
  hobbies: string[];
  goals: string[];
  strengths: string[];
  weaknesses: string[];
  subjects: string[];
  learningStyle?: string;
  confidence?: number;
}

export interface TraitScore {
  trait: string;
  score: number;
  explanation: string;
}

export interface TraitVector {
  Technology: number;
  Research: number;
  Leadership: number;
  Creativity: number;
  Communication: number;
  ProblemSolving: number;
  Business: number;
  AnalyticalThinking: number;
  LearningSpeed: number;
  Collaboration: number;
}

export interface CareerMatchResult {
  id: string;
  title: string;
  matchScore: number;
  category: string;
  reason: string;
  whySuitable: string;
  whyNotHigher?: string;
  expectedFutureDemand: string;
  salaryRange: { entry: string; mid: string; senior: string };
  difficulty: string;
  timeRequired: string;
  skillsMatching: string[];
  skillsMissing: string[];
  whatToImprove: string[];
  subjectsToFocus: string[];
  projectsToBuild: string[];
  alternativeOptions: string[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  estimatedTime: string;
  difficulty: string;
  priority: string;
  whyNow: string;
  howItHelps: string;
  unlocks: string;
  resources: { title: string; provider: string; type: string }[];
  completed?: boolean;
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  timeframe: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming' | string;
  whyThisPhaseNow: string;
  goalImpactExplanation: string;
  unlockedOpportunities: string[];
  skillsToLearn: string[];
  recommendedCourses: string[];
  projects: string[];
  detailedSteps: RoadmapStep[];
}

export interface SimulationParameters {
  studyHours?: number;             // 0 - 60 hrs/wk
  projects?: number;               // 0 - 15 projects
  internships?: number;            // 0 - 5 internships
  communicationSkills?: number;    // 1 - 10 scale
  certifications?: number;         // 0 - 10 certs
  cgpa?: number;                   // 0.0 - 10.0 scale
  openSourceContributions?: number;// 0 - 50 PRs
}

export interface SimulationRequest {
  scenario: string;
  studentInput: StudentInputStructured;
  parameters?: SimulationParameters;
  currentTraits?: TraitVector;
  targetCareer?: string;
}

export interface SkillDelta {
  trait: string;
  previousScore: number;
  newScore: number;
  boost: number;
  reason: string;
}

export interface SimulationResponse {
  scenario: string;
  parameters: SimulationParameters;
  placementReadiness: number;       // 0 - 100%
  careerReadiness: number;          // 0 - 100%
  careerMatchScore: number;         // 0 - 100%
  expectedSalaryRange: { entry: string; mid: string; senior: string };
  recommendedCompanies: string[];
  roadmapChanges: string[];
  skillImprovements: SkillDelta[];
  newTraitScores: Record<string, number>;
  unlockedOpportunities: string[];
  aiVerdict: string;
  outcomeImpactExplanation: string;
}

export interface KeyDriver {
  driver: string;
  evidence: string;
  impactContribution: string;
}

export interface WhyThisCareer {
  summary: string;
  keyDrivers: KeyDriver[];
  reasoning: string;
}

export interface DeferralFactor {
  factor: string;
  explanation: string;
  weight: string;
}

export interface WhyNotAnotherCareer {
  careerTitle: string;
  matchScore: number;
  scoreDelta: string;
  deferralReasons: DeferralFactor[];
  reasoning: string;
}

export interface MissingSkillAnalysis {
  skill: string;
  category: string;
  gapSeverity: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  currentStatus: string;
  requiredProficiency: string;
  reasoning: string;
}

export interface ImprovementPlanItem {
  area: string;
  priority: 'Critical' | 'High' | 'Medium' | string;
  currentLevel: string;
  targetLevel: string;
  actionableSteps: string[];
  reasoning: string;
}

export interface PathTradeOffs {
  pros: string[];
  cons: string[];
}

export interface AlternativePath {
  pathTitle: string;
  category: string;
  matchScore: number;
  transitionDifficulty: string;
  skillOverlapPercentage: number;
  tradeOffs: PathTradeOffs;
  reasoning: string;
}

export interface ExplainableRecommendationResponse {
  targetCareer: Record<string, any>;
  whyThisCareer: WhyThisCareer;
  whyNotAnotherCareer: WhyNotAnotherCareer[];
  missingSkillsAnalysis: MissingSkillAnalysis[];
  improvementPlan: ImprovementPlanItem[];
  alternativePaths: AlternativePath[];
  recommendationMetadata: Record<string, string>;
}

export interface RecommendationOutput {
  nextBestActions: { title: string; priority: string; reason: string }[];
  dailyFocus: string[];
  recommendedProjects: { title: string; category: string; difficulty: string; impact: string }[];
  gapBridgePlan: string[];
  mentorInsights: string[];
}

// ==========================================
// SERVICE 1: INTEREST ANALYZER
// ==========================================
export class InterestAnalyzer {
  private static KEYWORDS: Record<keyof TraitVector, string[]> = {
    Technology: ['code', 'coding', 'programming', 'python', 'java', 'react', 'ai', 'ml', 'tech', 'software', 'app', 'web', 'database', 'cybersecurity', 'cloud'],
    Research: ['research', 'science', 'experiment', 'physics', 'chemistry', 'lab', 'paper', 'theory', 'quantum', 'study'],
    Leadership: ['lead', 'leader', 'captain', 'president', 'club', 'team', 'manage', 'founder', 'startup', 'organize', 'event'],
    Creativity: ['design', 'art', 'music', 'draw', 'ui', 'ux', 'creative', 'craft', 'animation', 'video', 'content', 'write'],
    Communication: ['speak', 'speaking', 'debate', 'presentation', 'write', 'writing', 'language', 'podcast', 'blog', 'explain'],
    ProblemSolving: ['math', 'mathematics', 'puzzle', 'logic', 'problem', 'solve', 'chess', 'olympiad', 'dsa', 'algorithm'],
    Business: ['business', 'money', 'finance', 'economics', 'sales', 'marketing', 'product', 'startup', 'trade', 'stocks'],
    AnalyticalThinking: ['math', 'statistics', 'data', 'analytics', 'sql', 'excel', 'critical', 'evaluation', 'metrics'],
    LearningSpeed: ['curious', 'fast', 'self-taught', 'quick', 'learn', 'coursera', 'books', 'experiment', 'building'],
    Collaboration: ['team', 'group', 'partner', 'collaborate', 'community', 'open source', 'club', 'peer', 'hackathon']
  };

  public static analyze(input: StudentInputStructured): { vector: TraitVector; scores: TraitScore[] } {
    const corpus = [
      ...input.interests,
      ...input.hobbies,
      ...input.goals,
      ...input.strengths,
      ...input.subjects,
      input.learningStyle || ''
    ].join(' ').toLowerCase();

    const vector: TraitVector = {
      Technology: 50,
      Research: 50,
      Leadership: 50,
      Creativity: 50,
      Communication: 50,
      ProblemSolving: 50,
      Business: 50,
      AnalyticalThinking: 50,
      LearningSpeed: 50,
      Collaboration: 50
    };

    const scores: TraitScore[] = [];

    (Object.keys(this.KEYWORDS) as (keyof TraitVector)[]).forEach((traitKey) => {
      const keywords = this.KEYWORDS[traitKey];
      const matches = keywords.filter((kw) => corpus.includes(kw));
      const count = matches.length;
      const score = Math.min(98, Math.max(35, 55 + count * 12));

      vector[traitKey] = score;
      scores.push({
        trait: traitKey === 'Technology' ? 'Technology Interest' : traitKey === 'Research' ? 'Research Interest' : traitKey,
        score,
        explanation: count > 0 
          ? `High affinity detected via keywords: ${matches.slice(0, 3).join(', ')}.`
          : `Baseline profile score evaluated for ${input.educationLevel} stage.`
      });
    });

    return { vector, scores };
  }
}

// ==========================================
// SERVICE 2: CAREER MATCHER
// ==========================================
export class CareerMatcher {
  private static PROFILES = [
    {
      id: 'ai-engineer',
      title: 'AI & Machine Learning Engineer',
      category: 'Technology & AI',
      vector: { Technology: 95, Research: 85, ProblemSolving: 92, AnalyticalThinking: 90, LearningSpeed: 88 },
      keywords: ['ai', 'machine learning', 'python', 'pytorch', 'deep learning', 'code', 'data'],
      demand: 'Very High (42% YoY Growth)',
      salary: { entry: '₹12 - ₹22 LPA', mid: '₹25 - ₹45 LPA', senior: '₹60+ LPA' },
      difficulty: 'Challenging',
      timeRequired: '2 - 3 Years',
      skills: ['Python', 'PyTorch / TensorFlow', 'FastAPI', 'Vector Databases', 'Deep Learning', 'Data Structures'],
      subjects: ['Linear Algebra', 'Computer Science', 'Probability & Statistics', 'Algorithms'],
      projects: ['LLM RAG Assistant App', 'Computer Vision Pipeline', 'Custom Neural Net from Scratch'],
      alternatives: ['Data Scientist', 'MLOps Engineer', 'Backend Engineer']
    },
    {
      id: 'fullstack-developer',
      title: 'Full-Stack Software Engineer',
      category: 'Software Engineering',
      vector: { Technology: 92, ProblemSolving: 88, Creativity: 80, Collaboration: 82, LearningSpeed: 85 },
      keywords: ['developer', 'software', 'web', 'react', 'full stack', 'app', 'javascript', 'typescript'],
      demand: 'Very High',
      salary: { entry: '₹9 - ₹16 LPA', mid: '₹18 - ₹30 LPA', senior: '₹45+ LPA' },
      difficulty: 'Moderate',
      timeRequired: '1 - 2 Years',
      skills: ['TypeScript', 'React / Next.js', 'Node.js', 'PostgreSQL', 'REST & GraphQL APIs', 'Docker'],
      subjects: ['Computer Science', 'Database Architecture', 'Web Systems', 'UI Design'],
      projects: ['Real-time Collaboration Workspace', 'E-Commerce Microservices Engine', 'Developer CLI Tool'],
      alternatives: ['Frontend Architect', 'Backend Developer', 'Mobile Engineer']
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist & Analytics Lead',
      category: 'Data & Analytics',
      vector: { AnalyticalThinking: 94, ProblemSolving: 90, Research: 85, Technology: 88, Business: 78 },
      keywords: ['data', 'analytics', 'statistics', 'math', 'sql', 'python', 'insights'],
      demand: 'High',
      salary: { entry: '₹8 - ₹15 LPA', mid: '₹16 - ₹28 LPA', senior: '₹40+ LPA' },
      difficulty: 'Moderate',
      timeRequired: '1 - 2 Years',
      skills: ['Python / R', 'SQL & Databases', 'Pandas & NumPy', 'Statistical Modeling', 'Tableau / PowerBI'],
      subjects: ['Applied Statistics', 'Linear Algebra', 'Data Mining', 'Econometrics'],
      projects: ['Predictive Stock Market Analytics', 'Customer Churn Engine', 'Interactive BI Dashboard'],
      alternatives: ['BI Analyst', 'Data Engineer', 'Quantitative Analyst']
    }
  ];

  public static match(input: StudentInputStructured, vector: TraitVector): CareerMatchResult[] {
    const textCorpus = [...input.interests, ...input.goals, ...input.strengths].join(' ').toLowerCase();

    return this.PROFILES.map((prof) => {
      let diffSum = 0;
      let count = 0;

      (Object.keys(prof.vector) as (keyof TraitVector)[]).forEach((traitKey) => {
        const studentVal = vector[traitKey] || 50;
        const profVal = prof.vector[traitKey as keyof typeof prof.vector] || 50;
        diffSum += Math.abs(studentVal - profVal);
        count++;
      });

      const avgDiff = diffSum / count;
      const kwMatches = prof.keywords.filter((kw) => textCorpus.includes(kw)).length;
      const matchScore = Math.min(98, Math.round(Math.max(40, 100 - avgDiff * 0.7 + kwMatches * 4)));

      const matchingSkills = prof.skills.filter((s) => textCorpus.includes(s.toLowerCase().split(' ')[0]));
      const skillsMatching = matchingSkills.length > 0 ? matchingSkills : [prof.skills[0], 'Problem Solving'];
      const skillsMissing = prof.skills.filter((s) => !skillsMatching.includes(s));

      return {
        id: prof.id,
        title: prof.title,
        matchScore,
        category: prof.category,
        reason: `Matches your high trait profile in ${prof.category} and analytical interests.`,
        whySuitable: `Your inputs reflect strong alignment with ${prof.title}, particularly in ${skillsMatching[0] || 'problem solving'}.`,
        whyNotHigher: skillsMissing.length > 0 ? `Bridge missing skills like ${skillsMissing.slice(0, 2).join(', ')} to reach a 98%+ match.` : undefined,
        expectedFutureDemand: prof.demand,
        salaryRange: prof.salary,
        difficulty: prof.difficulty,
        timeRequired: prof.timeRequired,
        skillsMatching,
        skillsMissing,
        whatToImprove: skillsMissing.slice(0, 3).map((s) => `Master ${s} through hands-on projects`),
        subjectsToFocus: prof.subjects,
        projectsToBuild: prof.projects,
        alternativeOptions: prof.alternatives
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }
}

// ==========================================
// SERVICE 3: ROADMAP GENERATOR
// ==========================================
export class RoadmapGenerator {
  public static generate(input: StudentInputStructured, targetCareer: string = 'AI Engineer'): RoadmapPhase[] {
    const level = input.educationLevel.toLowerCase();

    if (level === 'school') {
      return [
        {
          id: 'sch-1',
          phase: 'Phase 1',
          timeframe: 'Months 1 - 3',
          title: 'Foundational Logic & Computational Thinking',
          description: 'Master mathematical logic, algorithmic reasoning, and block programming.',
          status: 'in_progress',
          whyThisPhaseNow: 'Early logic mastery builds problem-solving capability before syntax barriers.',
          goalImpactExplanation: `Builds the foundational mathematical logic needed for ${targetCareer}.`,
          unlockedOpportunities: ['Science Fair Representative', 'Olympiad Qualifier'],
          skillsToLearn: ['Algebraic Logic', 'Pattern Recognition', 'Scratch Programming'],
          recommendedCourses: ['Pre-Algebra on Khan Academy', 'MIT Scratch Creative Computing'],
          projects: ['Animated Game in Scratch', 'Logic Puzzle Engine'],
          detailedSteps: [
            {
              id: 's1',
              title: 'Scratch Block Programming Logic',
              estimatedTime: '2 Weeks',
              difficulty: 'Beginner',
              priority: 'Critical',
              whyNow: 'Teaches loops and logic visually without syntax errors.',
              howItHelps: 'Develops computational mindset.',
              unlocks: 'First Scratch Interactive Project',
              resources: [{ title: 'Scratch Studio Tutorials', provider: 'MIT Media Lab', type: 'doc' }],
              completed: false
            }
          ]
        }
      ];
    } else {
      return [
        {
          id: 'grad-1',
          phase: 'Phase 1',
          timeframe: 'Months 1 - 3',
          title: 'Core Computer Science & Programming Fundamentals',
          description: 'Master Data Structures & Algorithms, Git version control, Python/TypeScript, and Unix CLI.',
          status: 'in_progress',
          whyThisPhaseNow: 'Core fundamentals are mandatory for passing technical screening assessments.',
          goalImpactExplanation: `Builds the exact technical foundation expected for ${targetCareer} roles.`,
          unlockedOpportunities: ['Open Source Contributor', 'Tech Club Lead', 'Junior Developer Readiness'],
          skillsToLearn: ['Data Structures & Algorithms', 'Python / TypeScript', 'Git & GitHub'],
          recommendedCourses: ['LeetCode 75 Study Plan', 'Modern TypeScript Masterclass'],
          projects: ['Full Stack Task Engine', 'Data Structure Visualizer'],
          detailedSteps: [
            {
              id: 'g1',
              title: 'Master Git & GitHub Collaborative Workflows',
              estimatedTime: '1 Week',
              difficulty: 'Beginner',
              priority: 'Critical',
              whyNow: 'Engineering teams require clean commits, branches, and PR reviews.',
              howItHelps: 'Makes project code publicly verifiable by recruiters.',
              unlocks: 'GitHub Green Streak & Portfolio Showcase',
              resources: [{ title: 'Git Complete Guide', provider: 'Udemy', type: 'course' }],
              completed: false
            },
            {
              id: 'g2',
              title: 'Data Structures & Algorithms (Trees, Graphs, Dynamic Programming)',
              estimatedTime: '3 Weeks',
              difficulty: 'Intermediate',
              priority: 'Critical',
              whyNow: 'Data structures account for 80% of technical interview questions.',
              howItHelps: `Crucial for passing technical coding screens for ${targetCareer}.`,
              unlocks: 'LeetCode Medium Problem Solving Ability',
              resources: [{ title: 'NeetCode Algorithms', provider: 'NeetCode.io', type: 'video' }],
              completed: false
            }
          ]
        },
        {
          id: 'grad-2',
          phase: 'Phase 2',
          timeframe: 'Months 4 - 6',
          title: `${targetCareer} Specialized Tech Stack & Production Frameworks`,
          description: 'Deep dive into modern production frameworks (React, Next.js, FastAPI, PostgreSQL, Docker).',
          status: 'upcoming',
          whyThisPhaseNow: 'Employers hire specific framework mastery over generalist knowledge.',
          goalImpactExplanation: `Equips you with modern production tools used daily by industry ${targetCareer} teams.`,
          unlockedOpportunities: ['Hackathon Finalist Track', 'Paid Internship Eligibility'],
          skillsToLearn: ['FastAPI / Node.js Backends', 'PostgreSQL Databases', 'REST & GraphQL APIs', 'Docker Containers'],
          recommendedCourses: ['Full Stack Open (Univ of Helsinki)', 'Docker & Kubernetes Deep Dive'],
          projects: ['Production AI Web Application', 'Real-Time Multi-User Workspace'],
          detailedSteps: [
            {
              id: 'g3',
              title: 'Build REST APIs with FastAPI & PostgreSQL',
              estimatedTime: '2 Weeks',
              difficulty: 'Intermediate',
              priority: 'High',
              whyNow: 'Backend APIs power every web app and AI integration.',
              howItHelps: 'Gives your applications persistent cloud storage.',
              unlocks: 'Full-Stack Architecture Capabilities',
              resources: [{ title: 'FastAPI Crash Course', provider: 'FastAPI Docs', type: 'doc' }],
              completed: false
            }
          ]
        }
      ];
    }
  }
}

// ==========================================
// SERVICE 4: CAREER SIMULATOR ENGINE
// ==========================================
export class CareerSimulatorEngine {
  public static simulate(request: SimulationRequest): SimulationResponse {
    const p = request.parameters || {};
    const targetCareer = request.targetCareer || 'AI & Machine Learning Engineer';

    // Extract student decision levers
    const studyHours = Math.max(0, Math.min(60, p.studyHours ?? 15));
    const projects = Math.max(0, Math.min(15, p.projects ?? 1));
    const internships = Math.max(0, Math.min(5, p.internships ?? 0));
    const commSkills = Math.max(1, Math.min(10, p.communicationSkills ?? 6));
    const certs = Math.max(0, Math.min(10, p.certifications ?? 0));
    const cgpa = Math.max(0, Math.min(10, p.cgpa ?? 7.5));
    const openSource = Math.max(0, Math.min(50, p.openSourceContributions ?? 0));

    // Calculate Placement Readiness
    const cgpaSub = (cgpa / 10.0) * 100.0;
    const projectSub = Math.min(100, (projects / 4.0) * 100.0);
    const internshipSub = Math.min(100, (internships / 2.0) * 100.0);
    const studySub = Math.min(100, (studyHours / 25.0) * 100.0);
    const commSub = (commSkills / 10.0) * 100.0;
    const openSourceSub = Math.min(100, (openSource / 10.0) * 100.0);
    const certSub = Math.min(100, (certs / 3.0) * 100.0);

    let placementReadiness = (
      (cgpaSub * 0.15) +
      (projectSub * 0.22) +
      (internshipSub * 0.22) +
      (studySub * 0.15) +
      (commSub * 0.12) +
      (openSourceSub * 0.08) +
      (certSub * 0.06)
    );
    placementReadiness = Math.min(99, Math.max(25, Number(placementReadiness.toFixed(1))));

    // Calculate Career Readiness
    let careerReadiness = (
      (projectSub * 0.28) +
      (openSourceSub * 0.22) +
      (internshipSub * 0.20) +
      (studySub * 0.15) +
      (commSub * 0.10) +
      (certSub * 0.05)
    );
    careerReadiness = Math.min(98, Math.max(28, Number(careerReadiness.toFixed(1))));

    // Compute Trait Boosts
    const prevTraits: Record<string, number> = request.currentTraits
      ? { ...request.currentTraits }
      : { Technology: 50, ProblemSolving: 50, Communication: 50, Leadership: 50, Collaboration: 50, AnalyticalThinking: 50, LearningSpeed: 50, Business: 50, Creativity: 50, Research: 50 };

    const boosts: Record<string, number> = {
      Technology: (projects * 3.5) + (openSource * 1.2) + (certs * 2.5) + (studyHours * 0.4),
      ProblemSolving: (studyHours * 0.6) + (projects * 2.0) + (openSource * 1.5) + (cgpa * 1.5),
      Communication: ((commSkills - 5) * 5) + (internships * 3),
      Leadership: (internships * 6) + (commSkills * 2) + (projects * 1.5),
      Collaboration: (openSource * 2.5) + (internships * 5) + (commSkills * 1.5),
      AnalyticalThinking: (cgpa * 2.5) + (studyHours * 0.4) + (openSource * 1.0),
      LearningSpeed: (studyHours * 0.5) + (certs * 3.0) + (projects * 1.5),
      Business: (internships * 8) + (projects * 2),
      Creativity: (projects * 3) + (openSource * 1.5),
      Research: (cgpa * 2) + (studyHours * 0.5)
    };

    const newTraits: Record<string, number> = {};
    const skillImprovements: SkillDelta[] = [];

    Object.keys(boosts).forEach((trait) => {
      const prevVal = prevTraits[trait] ?? 50;
      const boostVal = boosts[trait];
      const newVal = Math.min(98, Math.max(30, Number((prevVal + boostVal).toFixed(1))));
      newTraits[trait] = newVal;

      const actualBoost = Number((newVal - prevVal).toFixed(1));
      if (actualBoost > 0) {
        skillImprovements.push({
          trait,
          previousScore: prevVal,
          newScore: newVal,
          boost: actualBoost,
          reason: `Elevated by decision levers: ${projects} projects, ${internships} internships, ${studyHours} hrs/wk study.`
        });
      }
    });

    skillImprovements.sort((a, b) => b.boost - a.boost);

    // Target Career Match Score
    const matchBoost = ((newTraits.Technology || 50) * 0.25) + ((newTraits.ProblemSolving || 50) * 0.20) + (placementReadiness * 0.25);
    const careerMatchScore = Math.min(98, Math.max(45, Number((65 + (matchBoost - 50) * 0.5).toFixed(1))));

    // Salary Range & Recommended Companies
    let salary = { entry: '₹6.0 - ₹9.0 LPA', mid: '₹12 - ₹18 LPA', senior: '₹25+ LPA' };
    let tierLabel = 'Enterprise Tech';
    let recommendedCompanies = ['TCS Digital', 'Infosys Power Programmer', 'Wipro Turbo', 'Accenture AI', 'Cognizant Next'];

    if (placementReadiness >= 85) {
      salary = { entry: '₹18 - ₹30 LPA', mid: '₹35 - ₹55 LPA', senior: '₹70 - ₹1.2 Cr+ LPA' };
      tierLabel = 'Tier 1 (Product / AI Unicorns)';
      recommendedCompanies = ['Google India', 'Microsoft IDC', 'Amazon India', 'Flipkart', 'Swiggy', 'Uber India', 'CRED', 'Razorpay'];
    } else if (placementReadiness >= 70) {
      salary = { entry: '₹10 - ₹16 LPA', mid: '₹18 - ₹28 LPA', senior: '₹35 - ₹50+ LPA' };
      tierLabel = 'Tier 2 (Growth Scale-Ups)';
      recommendedCompanies = ['PhonePe', 'Zomato', 'Paytm', 'Atlassian India', 'Freshworks', 'Postman', 'InMobi'];
    } else if (placementReadiness < 50) {
      salary = { entry: '₹4.5 - ₹7 LPA', mid: '₹8 - ₹12 LPA', senior: '₹15 - ₹20 LPA' };
      tierLabel = 'Foundation Tier';
      recommendedCompanies = ['Regional Tech Firms', 'Early-Stage Incubators', 'IT Consultancies'];
    }

    // Dynamic Roadmap Shifts
    const roadmapChanges: string[] = [];
    const unlockedOpportunities: string[] = [];

    if (studyHours >= 25) {
      roadmapChanges.push(`Accelerated Phase 1 & 2 completion timeline by 35% due to ${studyHours} hrs/week dedication.`);
      unlockedOpportunities.push('Fast-track 6-month Placement Clearance');
    }
    if (projects >= 3) {
      roadmapChanges.push(`Waived entry tutorials; added 'Production System Architecture & Scalability Capstone' (${projects} projects built).`);
      unlockedOpportunities.push('Portfolio Review Exemption by Hiring Teams');
    }
    if (internships >= 1) {
      roadmapChanges.push(`Unlocked Phase 3 Direct Industry Referral Track (${internships} prior internships).`);
      unlockedOpportunities.push('Direct Final-Round Interview Off-Campus Waiver');
    }
    if (openSource >= 5) {
      roadmapChanges.push(`Added 'Open Source Maintainer & DevRel Track' (${openSource} merged PRs).`);
      unlockedOpportunities.push('Global Open Source Fellowship Grant');
    }
    if (commSkills >= 8) {
      roadmapChanges.push('Inserted Technical Product Management & Leadership modules.');
      unlockedOpportunities.push('Technical Product Lead & Management Track');
    }
    if (cgpa >= 8.5) {
      roadmapChanges.push(`Cleared academic threshold (${cgpa} CGPA) for top-tier campus recruitment drives.`);
      unlockedOpportunities.push('Tier-1 Campus Day-1 Placement Shortlist');
    }

    if (roadmapChanges.length === 0) {
      roadmapChanges.push('Standard timeline active. Increase weekly study hours or build a production project to unlock accelerations.');
    }

    const aiVerdict = `Simulated trajectory for ${targetCareer}: Your decision levers yield a Placement Readiness of ${placementReadiness}% and Career Readiness of ${careerReadiness}%, qualifying for ${tierLabel} with expected entry compensation of ${salary.entry}.`;

    const outcomeImpactExplanation = [
      `• Study Commitment (${studyHours} hrs/wk): Contributes ${(studySub * 0.15).toFixed(1)}% to placement readiness and drives Problem Solving (+${boosts.ProblemSolving.toFixed(1)} pts).`,
      `• Projects (${projects} completed): Provides ${(projectSub * 0.22).toFixed(1)}% readiness boost and elevates Technology trait (+${boosts.Technology.toFixed(1)} pts).`,
      `• Internship Experience (${internships} roles): Delivers ${(internshipSub * 0.22).toFixed(1)}% readiness boost, unlocking Business (+${boosts.Business.toFixed(1)} pts) & Leadership.`,
      `• Communication Skills (${commSkills}/10): Contributes ${(commSub * 0.12).toFixed(1)}% to soft-skill evaluation for behavioral interviews.`,
      `• Academic Standing (${cgpa} CGPA): Provides ${(cgpaSub * 0.15).toFixed(1)}% baseline eligibility for corporate campus cutoffs.`,
      `• Open Source Contributions (${openSource} PRs): Unlocks Collaboration (+${boosts.Collaboration.toFixed(1)} pts) and real-world code review experience.`,
      `• Certifications (${certs} verified): Adds ${(certSub * 0.06).toFixed(1)}% validation for domain technical skills.`
    ].join('\n');

    return {
      scenario: request.scenario,
      parameters: {
        studyHours,
        projects,
        internships,
        communicationSkills: commSkills,
        certifications: certs,
        cgpa,
        openSourceContributions: openSource
      },
      placementReadiness,
      careerReadiness,
      careerMatchScore,
      expectedSalaryRange: salary,
      recommendedCompanies,
      roadmapChanges,
      skillImprovements,
      newTraitScores: newTraits,
      unlockedOpportunities,
      aiVerdict,
      outcomeImpactExplanation
    };
  }
}

// ==========================================
// SERVICE 5: EXPLAINABLE RECOMMENDATION ENGINE
// ==========================================
export class RecommendationEngine {
  public static explain(
    input: StudentInputStructured,
    topCareers: CareerMatchResult[]
  ): ExplainableRecommendationResponse {
    const topCareer = topCareers[0] || {
      id: 'ai-engineer',
      title: 'AI & Machine Learning Engineer',
      matchScore: 95.0,
      category: 'Technology & AI',
      difficulty: 'Challenging',
      timeRequired: '2 - 3 Years',
      expectedFutureDemand: 'Very High',
      salaryRange: { entry: '₹12 - ₹18 LPA', mid: '₹22 - ₹36 LPA', senior: '₹50+ LPA' },
      skillsMatching: ['Python', 'Data Structures'],
      skillsMissing: ['PyTorch', 'FastAPI', 'Vector Databases'],
      projectsToBuild: ['LLM RAG Assistant App'],
      alternativeOptions: ['Data Scientist', 'Backend Engineer']
    };

    const otherCareers = topCareers.slice(1);
    const userInterests = input.interests.slice(0, 3).join(', ') || 'technology and engineering';
    const matchedSkills = topCareer.skillsMatching.join(', ') || 'problem solving';

    // 1. Why this career?
    const whyThisCareer: WhyThisCareer = {
      summary: `${topCareer.title} is your top recommended career with a ${topCareer.matchScore.toFixed(1)}% match score. Your input profile demonstrates natural alignment with the primary technical requirements of this role.`,
      keyDrivers: [
        {
          driver: 'High Interest Vector Alignment',
          evidence: `Explicitly expressed interest in ${userInterests}.`,
          impactContribution: '+38% match score boost'
        },
        {
          driver: 'Existing Competency Match',
          evidence: `Validated matching skills: ${matchedSkills}.`,
          impactContribution: '+32% match score boost'
        },
        {
          driver: 'High Future Market Demand & Valuation',
          evidence: `Market demand rated as '${topCareer.expectedFutureDemand}' with entry salary around ${topCareer.salaryRange?.entry || '₹12 LPA'}.`,
          impactContribution: '+28% recommendation weight'
        }
      ],
      reasoning: `Selected ${topCareer.title} as top recommendation because your trait scores in Technology and Analytical Thinking satisfy 85%+ of core job requirements, while your learning style ('${input.learningStyle || 'practical'}') favors hands-on capstone execution.`
    };

    // 2. Why not another career?
    const whyNotAnotherCareer: WhyNotAnotherCareer[] = otherCareers.slice(0, 2).map((runnerUp) => {
      const delta = (topCareer.matchScore - runnerUp.matchScore).toFixed(1);
      return {
        careerTitle: runnerUp.title,
        matchScore: runnerUp.matchScore,
        scoreDelta: `-${delta}% lower than ${topCareer.title}`,
        deferralReasons: [
          {
            factor: 'Higher Competency Gap',
            explanation: `Requires acquiring ${runnerUp.skillsMissing.length} missing competencies (${runnerUp.skillsMissing.slice(0, 2).join(', ')}) compared to direct alignment in ${topCareer.title}.`,
            weight: 'High Weight'
          },
          {
            factor: 'Secondary Interest Priority',
            explanation: `Input profile indicates stronger passion for ${topCareer.category} over ${runnerUp.category}.`,
            weight: 'Medium Weight'
          }
        ],
        reasoning: `${runnerUp.title} scored ${runnerUp.matchScore.toFixed(1)}% (a ${delta}% margin below ${topCareer.title}). While viable as a secondary fallback, it was deferred from top placement because your goals and project history align more directly with ${topCareer.title}.`
      };
    });

    if (whyNotAnotherCareer.length === 0) {
      whyNotAnotherCareer.push({
        careerTitle: 'General Management / Non-Technical Consultant',
        matchScore: 62.0,
        scoreDelta: `-${(topCareer.matchScore - 62.0).toFixed(1)}% lower than ${topCareer.title}`,
        deferralReasons: [
          {
            factor: 'Underutilization of Technical Strengths',
            explanation: 'High technical and problem-solving trait scores would be underutilized in purely non-technical administrative roles.',
            weight: 'Critical Deferral Factor'
          }
        ],
        reasoning: `Deferred because your profile shows strong technical aptitude better suited for engineering roles like ${topCareer.title}.`
      });
    }

    // 3. Which skills are missing?
    const missingSkillsAnalysis: MissingSkillAnalysis[] = (topCareer.skillsMissing.length > 0 ? topCareer.skillsMissing : ['System Design Architecture', 'Docker & Kubernetes', 'FastAPI Microservices'])
      .slice(0, 4)
      .map((skill, idx) => ({
        skill,
        category: 'Specialized Domain Competency',
        gapSeverity: idx === 0 ? 'Critical' : idx === 1 ? 'High' : 'Medium',
        currentStatus: 'Not detected in baseline profile',
        requiredProficiency: 'Production Level (Industry Ready)',
        reasoning: `Mastery of ${skill} is mandatory for passing technical coding screens and building production-grade projects for ${topCareer.title}.`
      }));

    // 4. What should improve?
    const improvementPlan: ImprovementPlanItem[] = [
      {
        area: 'Production Project Portfolio',
        priority: 'Critical',
        currentLevel: 'Academic / Tutorial Level',
        targetLevel: 'Deployed End-to-End System',
        actionableSteps: [
          `Build capstone project: '${topCareer.projectsToBuild[0] || 'Full-Stack Application'}'`,
          'Deploy backend microservices to cloud container registry with CI/CD pipeline',
          'Add comprehensive README, architecture diagrams, and live demo link on GitHub'
        ],
        reasoning: 'Recruiters and engineering managers evaluate public GitHub proof-of-work 10x more heavily than academic GPA alone.'
      },
      {
        area: 'Technical Interview & Algorithmic Problem Solving',
        priority: 'High',
        currentLevel: 'Basic Algorithmic Familiarity',
        targetLevel: 'LeetCode Medium / High-Speed Problem Solving',
        actionableSteps: [
          'Solve 2 Data Structure problems daily focusing on Trees, Graphs, and Dynamic Programming',
          'Practice explaining time/space complexity tradeoffs out loud during practice rounds'
        ],
        reasoning: 'Passing the initial automated coding filter requires consistently solving algorithmic problems within 30 minutes.'
      }
    ];

    // 5. Alternative paths with trade-offs
    const alternativePaths: AlternativePath[] = (topCareer.alternativeOptions.length > 0 ? topCareer.alternativeOptions : ['Data Scientist', 'Backend Software Engineer'])
      .slice(0, 2)
      .map((altTitle, idx) => {
        const overlap = 85 - idx * 6;
        return {
          pathTitle: altTitle,
          category: 'Adjacent Engineering Discipline',
          matchScore: Number((topCareer.matchScore - (idx + 1) * 4.5).toFixed(1)),
          transitionDifficulty: 'Low (Smooth Pivot)',
          skillOverlapPercentage: overlap,
          tradeOffs: {
            pros: [
              `Leverages ${overlap}% of the same core programming skills`,
              'High market demand with overlapping recruitment pools'
            ],
            cons: [
              `Requires shifting focus slightly away from specialized ${topCareer.title} domain work`
            ]
          },
          reasoning: `${altTitle} shares ${overlap}% skill overlap with ${topCareer.title}, allowing an effortless career pivot if hiring priorities change.`
        };
      });

    return {
      targetCareer: {
        title: topCareer.title,
        matchScore: topCareer.matchScore,
        category: topCareer.category,
        difficulty: topCareer.difficulty,
        timeRequired: topCareer.timeRequired,
        expectedFutureDemand: topCareer.expectedFutureDemand,
        confidence: input.confidence || 0.85
      },
      whyThisCareer,
      whyNotAnotherCareer,
      missingSkillsAnalysis,
      improvementPlan,
      alternativePaths,
      recommendationMetadata: {
        engineVersion: '2.0.0-explainable',
        timestamp: new Date().toISOString(),
        format: 'structured_json'
      }
    };
  }

  public static generate(input: StudentInputStructured, topCareers: CareerMatchResult[]): RecommendationOutput {
    const topRole = topCareers[0]?.title || 'AI Engineer';

    return {
      nextBestActions: [
        {
          title: `Complete Phase 1 Core Skills for ${topRole}`,
          priority: 'Critical',
          reason: 'Establishes baseline engineering fundamentals required before applying to internships.'
        },
        {
          title: 'Set up GitHub Portfolio Repository & README',
          priority: 'High',
          reason: 'Provides public proof of work for recruiters and peer reviewers.'
        }
      ],
      dailyFocus: [
        'Dedicate 45 mins to Data Structures / Problem Solving',
        'Build 1 feature on your current capstone project',
        'Read 1 technical architecture article or documentation page'
      ],
      recommendedProjects: [
        {
          title: topCareers[0]?.projectsToBuild[0] || 'AI RAG Assistant App',
          category: topCareers[0]?.category || 'Software Engineering',
          difficulty: 'Moderate',
          impact: 'High Resume Impact (Demonstrates System Design)'
        }
      ],
      gapBridgePlan: (topCareers[0]?.skillsMissing || ['System Design', 'Docker']).map(
        (skill) => `Bridge missing skill: ${skill} through hands-on practice`
      ),
      mentorInsights: [
        `For ${topRole} roles, proof of work (GitHub repos, live URLs, deployed APIs) is 10x more influential than GPA alone.`,
        'Aim to complete at least 1 open source pull request or internship before your final placement semester.'
      ]
    };
  }
}
