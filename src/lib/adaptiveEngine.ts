/**
 * Adaptive Experience Engine - Configuration-Driven Rendering & Feature Flags
 * ===========================================================================
 * Dynamically configures a single unified workspace shell to adaptively render:
 * 1. School Workspace (Classes 6-10)
 * 2. Intermediate Workspace (Classes 11-12 / Diploma)
 * 3. Graduation Workspace (Undergrad / Postgrad)
 * 
 * Avoids maintaining three separate codebases or application instances.
 */

import { StudentInputStructured } from './decisionEngine';

export interface FeatureFlagManifest {
  enableSalaryProjections: boolean;
  enableEntranceExamCalculator: boolean;
  enableGithubLinkedinAuditor: boolean;
  enableParentGuardianInsights: boolean;
  enableOlympiadCompetitions: boolean;
  enablePlacementSimulation: boolean;
  enableStreamSelectionAdvisor: boolean;
  enableScratchCodingLab: boolean;
  enableResumeAtsAnalyzer: boolean;
  enableInternshipRadar: boolean;
  aiPromptPersona: 'encouraging_tutor' | 'academic_advisor' | 'industry_mentor' | string;
  themeMode: 'vibrant_gamified' | 'focused_academic' | 'sleek_enterprise' | string;
  primaryMetricLabel: string;
  primaryMetricScale: string;
}

export interface WorkspaceComponentConfig {
  componentId: string;
  name: string;
  componentType: string;
  order: number;
  visibility: boolean;
  props?: Record<string, any>;
}

export interface NavigationTabConfig {
  id: string;
  label: string;
  icon: string;
}

export interface AdaptiveWorkspaceManifest {
  educationLevel: 'school' | 'intermediate' | 'graduation' | string;
  workspaceTitle: string;
  workspaceDescription: string;
  themePreset: string;
  featureFlags: FeatureFlagManifest;
  navigationTabs: NavigationTabConfig[];
  activeComponents: WorkspaceComponentConfig[];
  stageSpecificMetrics: Record<string, any>;
  aiMentorPersona: {
    name: string;
    avatar: string;
    systemRole: string;
    greeting: string;
  };
}

export class AdaptiveExperienceEngine {
  public static resolveStage(level: string): 'school' | 'intermediate' | 'graduation' {
    const lvl = (level || '').trim().toLowerCase();
    if (lvl.includes('school') || lvl.includes('class') || ['6', '7', '8', '9', '10'].some((c) => lvl.includes(c))) {
      return 'school';
    } else if (lvl.includes('intermediate') || lvl.includes('11') || lvl.includes('12') || lvl.includes('diploma') || lvl.includes('inter')) {
      return 'intermediate';
    } else {
      return 'graduation';
    }
  }

  public static getFeatureFlags(educationLevel: string): FeatureFlagManifest {
    const stage = this.resolveStage(educationLevel);

    if (stage === 'school') {
      return {
        enableSalaryProjections: false,
        enableEntranceExamCalculator: false,
        enableGithubLinkedinAuditor: false,
        enableParentGuardianInsights: true,
        enableOlympiadCompetitions: true,
        enablePlacementSimulation: false,
        enableStreamSelectionAdvisor: true,
        enableScratchCodingLab: true,
        enableResumeAtsAnalyzer: false,
        enableInternshipRadar: false,
        aiPromptPersona: 'encouraging_tutor',
        themeMode: 'vibrant_gamified',
        primaryMetricLabel: 'Curiosity & Fundamental Readiness',
        primaryMetricScale: 'Level 1 - 10 Skills'
      };
    } else if (stage === 'intermediate') {
      return {
        enableSalaryProjections: true,
        enableEntranceExamCalculator: true,
        enableGithubLinkedinAuditor: false,
        enableParentGuardianInsights: true,
        enableOlympiadCompetitions: true,
        enablePlacementSimulation: true,
        enableStreamSelectionAdvisor: true,
        enableScratchCodingLab: false,
        enableResumeAtsAnalyzer: false,
        enableInternshipRadar: false,
        aiPromptPersona: 'academic_advisor',
        themeMode: 'focused_academic',
        primaryMetricLabel: 'Cutoff & Entrance Percentile',
        primaryMetricScale: '0 - 100% Target Score'
      };
    } else {
      return {
        enableSalaryProjections: true,
        enableEntranceExamCalculator: false,
        enableGithubLinkedinAuditor: true,
        enableParentGuardianInsights: false,
        enableOlympiadCompetitions: false,
        enablePlacementSimulation: true,
        enableStreamSelectionAdvisor: false,
        enableScratchCodingLab: false,
        enableResumeAtsAnalyzer: true,
        enableInternshipRadar: true,
        aiPromptPersona: 'industry_mentor',
        themeMode: 'sleek_enterprise',
        primaryMetricLabel: 'Placement & Corporate Career Readiness',
        primaryMetricScale: '0 - 100% Industry Score'
      };
    }
  }

  public static generateWorkspaceManifest(
    input: StudentInputStructured,
    overrideFlags?: Partial<FeatureFlagManifest>
  ): AdaptiveWorkspaceManifest {
    const stage = this.resolveStage(input.educationLevel);
    const flags: FeatureFlagManifest = {
      ...this.getFeatureFlags(stage),
      ...(overrideFlags || {})
    };

    if (stage === 'school') {
      return {
        educationLevel: 'school',
        workspaceTitle: 'Junior Explorer Workspace',
        workspaceDescription: 'Gamified curiosity portal for school students (Classes 6-10) discovering STEM, logic, and creative disciplines.',
        themePreset: 'vibrant_gamified',
        featureFlags: flags,
        navigationTabs: [
          { id: 'overview', label: 'Exploration Dashboard', icon: 'Sparkles' },
          { id: 'logic_lab', label: 'Scratch & Logic Lab', icon: 'Code2' },
          { id: 'olympiads', label: 'Olympiads & Science Fairs', icon: 'Trophy' },
          { id: 'stream_advisor', label: 'High School Stream Advisor', icon: 'Compass' },
          { id: 'parents_guide', label: 'Parents & Guardian Portal', icon: 'HeartHandshake' }
        ],
        activeComponents: [
          {
            componentId: 'curiosity_overview',
            name: 'Curiosity & Interest Radar',
            componentType: 'RadarChart',
            order: 1,
            visibility: true,
            props: { badge: 'Class 6-10 Stage', highlightTop: 3 }
          },
          {
            componentId: 'scratch_lab',
            name: 'Creative Logic Studio',
            componentType: 'InteractiveScratchLab',
            order: 2,
            visibility: flags.enableScratchCodingLab,
            props: { starterProjects: ['Game Physics', 'Animated Story', 'Math Puzzle'] }
          },
          {
            componentId: 'olympiad_tracker',
            name: 'Science Fair & Olympiad Hub',
            componentType: 'CompetitionHub',
            order: 3,
            visibility: flags.enableOlympiadCompetitions,
            props: { competitions: ['National Science Olympiad (NSO)', 'International Math Olympiad (IMO)', 'Google Science Fair'] }
          },
          {
            componentId: 'parents_insights',
            name: 'Guardian & Parent Nurture Guide',
            componentType: 'ParentInsightsWidget',
            order: 4,
            visibility: flags.enableParentGuardianInsights,
            props: { weeklySummary: 'Focus on encouraging natural mathematical curiosity and block programming logic.' }
          }
        ],
        stageSpecificMetrics: {
          curiosityScore: 88,
          logicLevel: 'Intermediate Scratch Builder',
          topStreamRecommendation: 'Science (PCM / Computer Science)',
          recommendedWeeklyHours: 8.0
        },
        aiMentorPersona: {
          name: 'Sparky - Friendly AI Learning Buddy',
          avatar: 'Bot',
          systemRole: 'encouraging_tutor',
          greeting: 'Hi there! Ready to explore cool projects, solve puzzles, and discover your super-skills today?'
        }
      };
    } else if (stage === 'intermediate') {
      return {
        educationLevel: 'intermediate',
        workspaceTitle: 'Academic Target Workspace',
        workspaceDescription: 'Goal-driven workspace for 11th & 12th / Diploma students focused on entrance exams, degree selection, and competitive cutoffs.',
        themePreset: 'focused_academic',
        featureFlags: flags,
        navigationTabs: [
          { id: 'overview', label: 'Academic Command Center', icon: 'Target' },
          { id: 'entrance_exams', label: 'Entrance Exam Tracker', icon: 'BookOpen' },
          { id: 'college_shortlister', label: 'Tier-1 College Shortlister', icon: 'GraduationCap' },
          { id: 'simulator', label: 'Score & Percentile Simulator', icon: 'Sliders' },
          { id: 'roadmap', label: 'Degree & Skill Roadmap', icon: 'MapPin' }
        ],
        activeComponents: [
          {
            componentId: 'academic_summary',
            name: 'Cutoff & Entrance Exam Readiness',
            componentType: 'PercentileGauge',
            order: 1,
            visibility: true,
            props: { targetExams: ['JEE Main / Advanced', 'BITSAT', 'CUET', 'NEET'] }
          },
          {
            componentId: 'entrance_calculator',
            name: 'Entrance Exam Cutoff Predictor',
            componentType: 'ExamCutoffCalculator',
            order: 2,
            visibility: flags.enableEntranceExamCalculator,
            props: { branches: ['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Electronics & Communication'] }
          },
          {
            componentId: 'college_shortlister',
            name: 'University & Institute Shortlister',
            componentType: 'CollegeListWidget',
            order: 3,
            visibility: true,
            props: { tiers: ['IITs / NITs', 'BITS Pilani', 'Top State Engineering Universities'] }
          },
          {
            componentId: 'parametric_simulator',
            name: 'Academic Commitment Simulator',
            componentType: 'ParametricSimulatorWidget',
            order: 4,
            visibility: flags.enablePlacementSimulation,
            props: { levers: ['Study Hours', 'Mock Test Frequency', 'Physics/Math Foundation'] }
          }
        ],
        stageSpecificMetrics: {
          entranceExamReadiness: 78,
          projectedPercentile: '96.4th Percentile',
          topTargetDegree: 'B.Tech in Computer Science & AI',
          recommendedWeeklyHours: 25.0
        },
        aiMentorPersona: {
          name: 'Mentor Nova - Academic & Entrance Advisor',
          avatar: 'UserCheck',
          systemRole: 'academic_advisor',
          greeting: "Welcome back! Let's review your mock exam progress, target college cutoffs, and subject preparation strategy."
        }
      };
    } else {
      return {
        educationLevel: 'graduation',
        workspaceTitle: 'Enterprise Career Operating System',
        workspaceDescription: 'Professional production environment for Undergrad/Postgrad students targeting Tier-1 tech placements, open-source mastery, and high-growth careers.',
        themePreset: 'sleek_enterprise',
        featureFlags: flags,
        navigationTabs: [
          { id: 'overview', label: 'Placement Command Center', icon: 'Briefcase' },
          { id: 'simulator', label: 'Career Decision Simulator', icon: 'Activity' },
          { id: 'capstone_hub', label: 'Production Capstone Showcase', icon: 'FolderKanban' },
          { id: 'github_auditor', label: 'GitHub & Resume ATS Auditor', icon: 'FileCheck' },
          { id: 'explainability', label: 'Explainable Decision Engine', icon: 'BrainCircuit' }
        ],
        activeComponents: [
          {
            componentId: 'placement_readiness',
            name: 'Tier-1 Corporate Placement Readiness',
            componentType: 'ReadinessGaugeGroup',
            order: 1,
            visibility: true,
            props: { metrics: ['Placement Readiness', 'Career Readiness', 'Target Role Match Score'] }
          },
          {
            componentId: 'github_linkedin_auditor',
            name: 'GitHub & LinkedIn Public Proof-of-Work Auditor',
            componentType: 'ProofOfWorkAuditor',
            order: 2,
            visibility: flags.enableGithubLinkedinAuditor,
            props: { auditItems: ['Commit Frequency', 'README Documentation', 'Deployed Microservices', 'LinkedIn Summary'] }
          },
          {
            componentId: 'resume_ats_analyzer',
            name: 'Resume ATS Keyword Gap Analyzer',
            componentType: 'ResumeATSAnalyzerWidget',
            order: 3,
            visibility: flags.enableResumeAtsAnalyzer,
            props: { targetRole: 'AI & Machine Learning Engineer' }
          },
          {
            componentId: 'internship_radar',
            name: 'Off-Campus Internship & Hiring Radar',
            componentType: 'InternshipRadarWidget',
            order: 4,
            visibility: flags.enableInternshipRadar,
            props: { tiers: ['Tier 1 FAANG / AI Unicorns', 'Tier 2 Scale-Ups'] }
          },
          {
            componentId: 'explainable_recommendations',
            name: 'Explainable Decision Justification Engine',
            componentType: 'ExplainableDecisionCard',
            order: 5,
            visibility: true,
            props: { schemaVersion: '2.0.0-structured-json' }
          }
        ],
        stageSpecificMetrics: {
          placementReadiness: 88.5,
          careerReadiness: 85.0,
          expectedSalaryTier: '₹18 - ₹30 LPA',
          recommendedWeeklyHours: 15.0
        },
        aiMentorPersona: {
          name: 'Apex AI - Senior Career & System Design Mentor',
          avatar: 'ShieldCheck',
          systemRole: 'industry_mentor',
          greeting: "System ready. Let's optimize your microservices portfolio, LeetCode performance, and off-campus placement strategy."
        }
      };
    }
  }
}
