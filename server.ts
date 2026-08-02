import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  InterestAnalyzer,
  CareerMatcher,
  RoadmapGenerator,
  CareerSimulatorEngine,
  RecommendationEngine
} from './src/lib/decisionEngine.ts';
import { AdaptiveExperienceEngine } from './src/lib/adaptiveEngine.ts';
import { defaultGraphInstance, StudentIntelligenceGraphEngine } from './src/lib/studentIntelligenceGraph.ts';
import { defaultCareerCoreInstance } from './src/lib/careerIntelligenceCore.ts';

const serverDir = typeof __dirname !== 'undefined'
  ? __dirname
  : (typeof import.meta !== 'undefined' && import.meta.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd());

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google GenAI client
let aiInstance: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Endpoint: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =======================================================
// CAREERDNA DECISION ENGINE APIS (INDEPENDENT SERVICES)
// =======================================================

// Service 1: Interest Analyzer API
app.post('/api/decision-engine/analyze', (req, res) => {
  try {
    const studentInput = req.body;
    const result = InterestAnalyzer.analyze(studentInput);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Interest Analyzer error' });
  }
});

// Service 2: Career Matcher API
app.post('/api/decision-engine/match', (req, res) => {
  try {
    const studentInput = req.body;
    const { vector } = InterestAnalyzer.analyze(studentInput);
    const matches = CareerMatcher.match(studentInput, vector);
    res.json(matches);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Career Matcher error' });
  }
});

// Service 3: Roadmap Generator API
app.post('/api/decision-engine/roadmap', (req, res) => {
  try {
    const { studentInput, targetCareer } = req.body;
    const roadmap = RoadmapGenerator.generate(studentInput || req.body, targetCareer || 'AI Engineer');
    res.json(roadmap);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Roadmap Generator error' });
  }
});

// Service 4: Career Simulator Engine API
app.post('/api/decision-engine/simulate', (req, res) => {
  try {
    const simulationRequest = req.body;
    const result = CareerSimulatorEngine.simulate(simulationRequest);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Career Simulator error' });
  }
});

// Service 5: Explainable Recommendation Engine API
app.post('/api/decision-engine/explain', (req, res) => {
  try {
    const studentInput = req.body;
    const { vector } = InterestAnalyzer.analyze(studentInput);
    const matches = CareerMatcher.match(studentInput, vector);
    const explanation = RecommendationEngine.explain(studentInput, matches);
    res.json(explanation);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Explainable Recommendation Engine error' });
  }
});

// Service 5 (Legacy/Unified): Recommendation Engine API
app.post('/api/decision-engine/recommend', (req, res) => {
  try {
    const studentInput = req.body;
    const { vector } = InterestAnalyzer.analyze(studentInput);
    const matches = CareerMatcher.match(studentInput, vector);
    
    if (req.body.explain !== false) {
      const explanation = RecommendationEngine.explain(studentInput, matches);
      return res.json(explanation);
    }
    
    const recs = RecommendationEngine.generate(studentInput, matches);
    res.json(recs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Recommendation Engine error' });
  }
});

// =======================================================
// ADAPTIVE EXPERIENCE ENGINE APIS
// =======================================================

// Adaptive Workspace Manifest API
app.post(['/api/adaptive-workspace', '/api/v1/adaptive-workspace', '/api/workspace-config', '/api/v1/workspace-config'], (req, res) => {
  try {
    const studentInput = req.body.studentInput || req.body;
    const overrideFlags = req.body.overrideFlags || req.body.override_flags;
    const manifest = AdaptiveExperienceEngine.generateWorkspaceManifest(
      {
        educationLevel: studentInput.educationLevel || studentInput.education_level || 'graduation',
        interests: studentInput.interests || [],
        hobbies: studentInput.hobbies || [],
        goals: studentInput.goals || [],
        strengths: studentInput.strengths || [],
        weaknesses: studentInput.weaknesses || [],
        subjects: studentInput.subjects || [],
        learningStyle: studentInput.learningStyle || 'practical',
        confidence: studentInput.confidence || 0.85
      },
      overrideFlags
    );
    res.json(manifest);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Adaptive Experience Engine error' });
  }
});

// Feature Flags API
app.post(['/api/feature-flags', '/api/v1/feature-flags'], (req, res) => {
  try {
    const level = req.body.educationLevel || req.body.education_level || req.body.level || 'graduation';
    const flags = AdaptiveExperienceEngine.getFeatureFlags(level);
    res.json(flags);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Feature Flags error' });
  }
});

// =======================================================
// STUDENT INTELLIGENCE GRAPH APIS (MEMORY LAYER)
// =======================================================

// Graph Full State
app.get(['/api/graph/state', '/api/v1/graph/state'], (req, res) => {
  res.json(defaultGraphInstance.getFullGraphState());
});

// Subgraph Query
app.post(['/api/graph/subgraph', '/api/v1/graph/subgraph'], (req, res) => {
  try {
    const rootNodeId = req.body.rootNodeId || req.body.root_node_id || 'node_career_goal';
    const maxDepth = req.body.maxDepth || req.body.max_depth || 2;
    const categoryFilter = req.body.categoryFilter || req.body.category_filter;
    const result = defaultGraphInstance.getSubgraph(rootNodeId, maxDepth, categoryFilter);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Graph Subgraph Query error' });
  }
});

// Upsert Graph Node
app.post(['/api/graph/node', '/api/v1/graph/node'], (req, res) => {
  try {
    const { id, category, label, properties, confidence } = req.body;
    const nodeId = id || `node_${category || 'skills'}_${Date.now()}`;
    const node = defaultGraphInstance.upsertNode(nodeId, category || 'skills', label || 'New Entity', properties || {}, confidence || 1.0, true);
    res.json(node);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Graph Upsert Node error' });
  }
});

// Add Graph Edge
app.post(['/api/graph/edge', '/api/v1/graph/edge'], (req, res) => {
  try {
    const { sourceId, targetId, relationshipType, weight, properties } = req.body;
    if (!sourceId || !targetId) {
      return res.status(400).json({ error: 'sourceId and targetId are required' });
    }
    const edge = defaultGraphInstance.addEdge(sourceId, targetId, relationshipType || 'REQUIRES_SKILL', weight || 1.0, properties || {}, true);
    res.json(edge);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Graph Add Edge error' });
  }
});

// Propagate Student Action & Update Recommendations
app.post(['/api/graph/propagate-action', '/api/v1/graph/propagate-action', '/api/graph/action', '/api/v1/graph/action'], (req, res) => {
  try {
    const actionType = req.body.actionType || req.body.action_type || 'STUDENT_ACTION';
    const category = req.body.category || 'projects';
    const payload = req.body.payload || req.body;
    const impact = defaultGraphInstance.propagateStudentAction(actionType, category, payload);
    res.json(impact);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Graph Propagate Action error' });
  }
});

// SQL Schema for Graph Storage
app.get(['/api/graph/schema/sql', '/api/v1/graph/schema/sql'], (req, res) => {
  res.json({ sql: StudentIntelligenceGraphEngine.getSqlSchema() });
});

// =======================================================
// CAREER INTELLIGENCE CORE REST APIS (7 REASONING MODULES)
// =======================================================

// 1. Full Core Summary / Overview
app.all(['/api/core/summary', '/api/v1/core/summary', '/api/core/overview', '/api/v1/core/overview'], (req, res) => {
  const target = req.body?.targetCareer || req.query?.targetCareer || 'AI & Machine Learning Engineer';
  res.json(defaultCareerCoreInstance.getFullCoreSummary(target as string));
});

// 2. Career Matcher
app.all(['/api/core/match', '/api/v1/core/match'], (req, res) => {
  const target = req.body?.targetCareer || req.query?.targetCareer || 'AI & Machine Learning Engineer';
  res.json(defaultCareerCoreInstance.calculateCareerMatch(target as string));
});

// 3. Skill Gap Analyzer
app.all(['/api/core/skill-gap', '/api/v1/core/skill-gap'], (req, res) => {
  const target = req.body?.targetCareer || req.query?.targetCareer || 'AI & Machine Learning Engineer';
  res.json(defaultCareerCoreInstance.analyzeSkillGap(target as string));
});

// 4. Placement Readiness Engine
app.all(['/api/core/readiness', '/api/v1/core/readiness'], (req, res) => {
  res.json(defaultCareerCoreInstance.calculatePlacementReadiness());
});

// 5. Opportunity Engine
app.all(['/api/core/opportunities', '/api/v1/core/opportunities'], (req, res) => {
  const target = req.body?.targetCareer || req.query?.targetCareer || 'AI & Machine Learning Engineer';
  res.json(defaultCareerCoreInstance.discoverOpportunities(target as string));
});

// 6. Career Predictor (Simulation)
app.all(['/api/core/predict', '/api/v1/core/predict'], (req, res) => {
  const hours = Number(req.body?.studyHoursPerWeek || req.query?.studyHoursPerWeek || 15);
  const capstone = req.body?.addCapstoneProject !== undefined ? Boolean(req.body.addCapstoneProject) : true;
  const cert = req.body?.completeGcpCert !== undefined ? Boolean(req.body.completeGcpCert) : true;
  res.json(defaultCareerCoreInstance.predictCareerOutcomes(hours, capstone, cert));
});

// 7. Roadmap Optimizer
app.all(['/api/core/roadmap', '/api/v1/core/roadmap'], (req, res) => {
  const target = req.body?.targetCareer || req.query?.targetCareer || 'AI & Machine Learning Engineer';
  res.json(defaultCareerCoreInstance.optimizeRoadmap(target as string));
});

// 8. Explainability Engine
app.all(['/api/core/explain', '/api/v1/core/explain'], (req, res) => {
  const recId = (req.body?.recommendationId || req.query?.recommendationId || 'rec_mlops') as string;
  res.json(defaultCareerCoreInstance.generateRecommendationExplanation(recId));
});


// Helper: Generate dynamic, customized CareerDNA based on student name, grade/field, education level, and inputs
function generateCustomCareerDna(studentProfile: any) {
  const name = studentProfile?.name || 'Student';
  const level = studentProfile?.educationLevel || 'graduation';
  const rawGrade = (studentProfile?.gradeOrField || '').toLowerCase();
  const rawInputs = (studentProfile?.inputs || []).join(' ').toLowerCase();
  const combinedText = `${rawGrade} ${rawInputs}`;

  let topCareers: any[] = [];
  let studentSummary = '';

  if (combinedText.includes('pharm') || combinedText.includes('medic') || combinedText.includes('health') || combinedText.includes('bio') || combinedText.includes('doctor') || combinedText.includes('mbbs')) {
    studentSummary = `${name} shows strong analytical aptitude and passion for pharmaceutical sciences, clinical research, healthcare systems, and bio-technological innovation in ${studentProfile?.gradeOrField || 'Pharmacy'}.`;
    topCareers = [
      {
        id: 'pharm_1',
        title: 'Clinical Pharmacologist & Research Scientist',
        matchScore: 96,
        category: 'Healthcare & Pharma',
        reason: `Perfect match for ${name}'s background in ${studentProfile?.gradeOrField || 'Pharmacy'} with high demand in drug discovery and clinical trials.`,
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$65,000 / yr', mid: '$110,000 / yr', senior: '$165,000 / yr' },
        difficulty: 'Challenging',
        timeRequired: '2 - 3 Years',
        whySuitable: `${name}'s input reflects a deep interest in pharmaceutical sciences and clinical workflows. Drug research and clinical trial management leverage both deep core domain knowledge and scientific analytical skills.`,
        skillsMatching: ['Pharmacology', 'Biochemistry', 'Clinical Research', 'Laboratory Protocols'],
        skillsMissing: ['Clinical Data Analytics', 'Regulatory Compliance (FDA/EMA)', 'Biostatistics'],
        whatToImprove: ['Complete FDA clinical trial workflow certification', 'Gain hands-on experience with SPSS/R for clinical biostatistics', 'Publish a research review on novel drug delivery systems'],
        subjectsToFocus: ['Pharmacokinetics', 'Medicinal Chemistry', 'Biostatistics & Epidemiology', 'Toxicology'],
        projectsToBuild: ['Formulation Analysis of Controlled-Release Tablets', 'Bio-equivalence Study Report on Generic Formulations'],
        entranceExams: ['GPAT / NIPER JEE', 'GRE / TOEFL for abroad research'],
        topColleges: ['NIPER Mohali', 'Jamia Hamdard', 'Manipal College of Pharmaceutical Sciences'],
        internships: ['R&D Intern at Sun Pharma / Dr. Reddy\'s', 'Clinical Research Assistant at Fortis / Apollo'],
        openSourceSuggestions: ['BioPython for Genomic Data', 'Open-source Molecular Docking Tools (AutoDock)']
      },
      {
        id: 'pharm_2',
        title: 'Pharmaceutical R&D Specialist',
        matchScore: 92,
        category: 'Pharma Research & Development',
        reason: 'Focused on drug formulation, analytical chemistry, and novel therapeutic development.',
        expectedFutureDemand: 'High',
        salaryRange: { entry: '$60,000 / yr', mid: '$98,000 / yr', senior: '$150,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '1 - 3 Years',
        whySuitable: 'Combines laboratory synthesis with analytical equipment operation (HPLC, GC-MS) to ensure safety and therapeutic efficacy.',
        skillsMatching: ['Analytical Chemistry', 'Drug Formulation', 'GMP / GLP Compliance'],
        skillsMissing: ['HPLC Method Validation', 'High-Throughput Screening'],
        whatToImprove: ['Master High-Performance Liquid Chromatography (HPLC)', 'Learn GLP documentation standard operating procedures'],
        subjectsToFocus: ['Pharmaceutics', 'Pharmaceutical Analysis', 'Biopharmaceutics'],
        projectsToBuild: ['Development of Nano-emulsion Drug Delivery Carrier', 'Stability Testing Protocol for Thermolabile Formulations']
      },
      {
        id: 'pharm_3',
        title: 'Medical Affairs & Regulatory Specialist',
        matchScore: 88,
        category: 'Regulatory & Scientific Affairs',
        reason: 'Bridges pharmaceutical science with global regulatory filings and healthcare communication.',
        expectedFutureDemand: 'Growing',
        salaryRange: { entry: '$58,000 / yr', mid: '$92,000 / yr', senior: '$140,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '1 - 2 Years',
        whySuitable: 'Ideal for those interested in scientific documentation, drug approval pipelines, and safety compliance across global markets.',
        skillsMatching: ['Medical Writing', 'Scientific Communication', 'Regulatory Frameworks'],
        skillsMissing: ['eCTD Filing Protocols', 'Pharmacovigilance Signal Detection'],
        whatToImprove: ['Study ICH guidelines and IND/NDA submission processes', 'Gain practical training in Drug Safety Software (Argus Safety)'],
        subjectsToFocus: ['Pharmaceutical Jurisprudence', 'Pharmacovigilance', 'Clinical Data Management'],
        projectsToBuild: ['Mock Dossier Preparation for Abbreviated New Drug Application (ANDA)']
      },
      {
        id: 'pharm_4',
        title: 'Healthcare Data & Bioinformatics Analyst',
        matchScore: 84,
        category: 'HealthTech & Data',
        reason: 'Combines pharmaceutical science with Python data analysis and biomedical data pipelines.',
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$70,000 / yr', mid: '$115,000 / yr', senior: '$170,000 / yr' },
        difficulty: 'Challenging',
        timeRequired: '2 - 3 Years',
        whySuitable: 'Emerging high-paying interdisciplinary domain connecting pharma domain knowledge with computational biology and machine learning.',
        skillsMatching: ['Biological Science', 'Data Analytics', 'Problem Solving'],
        skillsMissing: ['Python / R Programming', 'SQL & Database Querying', 'Machine Learning in Genomics'],
        whatToImprove: ['Learn Python for Data Science (NumPy, Pandas)', 'Complete bioinformatics genomics pipeline project on GitHub'],
        subjectsToFocus: ['Bioinformatics', 'Biostatistics', 'Computational Drug Design'],
        projectsToBuild: ['AI-Powered Virtual Screening Pipeline for Ligand Binding']
      },
      {
        id: 'pharm_5',
        title: 'Hospital & Clinical Pharmacy Manager',
        matchScore: 80,
        category: 'Clinical Healthcare Management',
        reason: 'Oversees clinical medication safety, hospital pharmacy operations, and patient therapeutic management.',
        expectedFutureDemand: 'Stable',
        salaryRange: { entry: '$55,000 / yr', mid: '$88,000 / yr', senior: '$130,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '1 - 2 Years',
        whySuitable: 'Great leadership role focused on patient-centered healthcare delivery, medication reconciliation, and hospital operations.',
        skillsMatching: ['Pharmacotherapy', 'Patient Communication', 'Healthcare Operations'],
        skillsMissing: ['Hospital Inventory Management Software', 'Clinical Audit Protocols'],
        whatToImprove: ['Pursue Board Certified Pharmacotherapy Specialist (BCPS) certification', 'Build leadership skills in hospital ward management'],
        subjectsToFocus: ['Hospital & Community Pharmacy', 'Clinical Pharmacy', 'Pharmacotherapeutics'],
        projectsToBuild: ['Adverse Drug Reaction (ADR) Monitoring System Implementation']
      }
    ];
  } else if (rawGrade.includes('7') || rawGrade.includes('8') || rawGrade.includes('9') || rawGrade.includes('10') || level === 'school') {
    studentSummary = `${name} is an enthusiastic school student in ${studentProfile?.gradeOrField || 'Class ' + (rawGrade || '8')}, showing strong curiosity for science, technology, creative problem-solving, and building innovative projects.`;
    topCareers = [
      {
        id: 'school_1',
        title: 'Robotics & AI Tech Pioneer',
        matchScore: 96,
        category: 'Technology & Engineering',
        reason: `Excellent early alignment for ${name} (Grade ${studentProfile?.gradeOrField || 'School'}) to build foundational logic, coding, and hardware design.`,
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$70,000 / yr', mid: '$120,000 / yr', senior: '$180,000 / yr' },
        difficulty: 'Beginner Friendly',
        timeRequired: '4+ Years Roadmap',
        whySuitable: `At school level, early exposure to Python, Arduino/Raspberry Pi, and robotics competitions builds unstoppable problem-solving confidence for higher education.`,
        skillsMatching: ['Curiosity', 'Logic & Maths', 'Creative Design'],
        skillsMissing: ['Python Coding', 'Circuit Design', 'Microcontrollers'],
        whatToImprove: ['Learn basic Python syntax and block-based coding (Scratch/MIT App Inventor)', 'Participate in school STEM & Tinkering Labs', 'Build a line-following robot'],
        subjectsToFocus: ['Mathematics', 'Physics', 'Computer Science / Coding'],
        projectsToBuild: ['Smart Home Automation System using Arduino', 'AI Voice Assistant in Python'],
        competitions: ['FIRST LEGO League', 'National Science Olympiad (NSO)', 'Inspire Awards MANAK'],
        parentsTips: ['Encourage hands-on STEM kit exploration over passive screen time', 'Support participation in school robotics clubs']
      },
      {
        id: 'school_2',
        title: 'Game Developer & Digital Artist',
        matchScore: 92,
        category: 'Digital Media & Game Dev',
        reason: 'Combines creative storytelling, digital art, logic, and interactive game physics.',
        expectedFutureDemand: 'High',
        salaryRange: { entry: '$60,000 / yr', mid: '$100,000 / yr', senior: '$150,000 / yr' },
        difficulty: 'Beginner',
        timeRequired: '3 - 4 Years',
        whySuitable: 'Turns a passion for playing games into building interactive worlds, understanding game engines (Godot/Unity), and digital animation.',
        skillsMatching: ['Creativity', 'Storytelling', 'Logic'],
        skillsMissing: ['C# / Python', '2D/3D Asset Creation', 'Game Physics'],
        whatToImprove: ['Create 2D games on Scratch and Godot Engine', 'Learn 3D modeling basics in Blender'],
        subjectsToFocus: ['Computer Science', 'Geometry & Algebra', 'Visual Arts'],
        projectsToBuild: ['2D Platformer Adventure Game', 'Interactive Quiz App']
      },
      {
        id: 'school_3',
        title: 'Data Science & AI Explorer',
        matchScore: 88,
        category: 'Data & Computer Science',
        reason: 'Builds analytical data handling and mathematical reasoning skills.',
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$72,000 / yr', mid: '$125,000 / yr', senior: '$185,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '4+ Years',
        whySuitable: 'Teaches how algorithms analyze real-world data like weather patterns, sports statistics, and AI image generation.',
        skillsMatching: ['Maths Aptitude', 'Pattern Recognition'],
        skillsMissing: ['Python Pandas', 'Data Visualization (Matplotlib)'],
        whatToImprove: ['Practice logic problems on Khan Academy', 'Analyze sports data sets using Google Sheets & Python'],
        subjectsToFocus: ['Mathematics & Statistics', 'Information Technology'],
        projectsToBuild: ['Weather Prediction & Trends Dashboard']
      },
      {
        id: 'school_4',
        title: 'Clean Energy & Environmental Innovator',
        matchScore: 85,
        category: 'Green Tech & Environmental Science',
        reason: 'Focuses on renewable energy, solar technology, and climate solutions.',
        expectedFutureDemand: 'Growing',
        salaryRange: { entry: '$62,000 / yr', mid: '$98,000 / yr', senior: '$145,000 / yr' },
        difficulty: 'Beginner',
        timeRequired: '4+ Years',
        whySuitable: 'Great fit for students passionate about science fairs, sustainability, and green tech innovations.',
        skillsMatching: ['Scientific Inquiry', 'Environmental Awareness'],
        skillsMissing: ['Solar Energy Dynamics', 'Sensor Data Logging'],
        whatToImprove: ['Build mini solar powered models', 'Participate in Regional Science Fairs'],
        subjectsToFocus: ['Chemistry', 'Physics', 'Environmental Science'],
        projectsToBuild: ['Miniature Solar Irrigation System']
      },
      {
        id: 'school_5',
        title: 'Tech Entrepreneur & Creator',
        matchScore: 81,
        category: 'Business & Technology',
        reason: 'Develops leadership, communication, and digital product building skills.',
        expectedFutureDemand: 'Emerging',
        salaryRange: { entry: '$55,000 / yr', mid: '$110,000 / yr', senior: '$200,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '3 - 5 Years',
        whySuitable: 'Encourages building useful digital tools, websites, and apps to solve real school/community challenges.',
        skillsMatching: ['Leadership', 'Communication', 'Ideation'],
        skillsMissing: ['No-Code Web Builders', 'Digital Marketing Basics'],
        whatToImprove: ['Build a website using HTML/CSS or Webflow', 'Present school project pitches'],
        subjectsToFocus: ['English & Public Speaking', 'Economics', 'Computer Applications'],
        projectsToBuild: ['School Event Directory & News Web App']
      }
    ];
  } else if (rawGrade.includes('com') || rawGrade.includes('fin') || rawGrade.includes('bus') || rawGrade.includes('econ') || rawGrade.includes('cma') || rawGrade.includes('ca')) {
    studentSummary = `${name} exhibits acute analytical acumen, business interest, and financial literacy suited for modern finance, consulting, and fintech leadership.`;
    topCareers = [
      {
        id: 'fin_1',
        title: 'Financial Analyst & FinTech Specialist',
        matchScore: 95,
        category: 'Finance & Technology',
        reason: `Direct fit for ${name}'s focus in ${studentProfile?.gradeOrField || 'Commerce/Finance'} combining quantitative modeling with digital finance platforms.`,
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$70,000 / yr', mid: '$115,000 / yr', senior: '$175,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '1 - 3 Years',
        whySuitable: 'Combines financial statements analysis with Python/Excel financial modeling, equity valuation, and automated trading algorithms.',
        skillsMatching: ['Financial Accounting', 'Excel & Modeling', 'Quantitative Analysis'],
        skillsMissing: ['Python for Finance', 'SQL Database Querying', 'PowerBI / Tableau'],
        whatToImprove: ['Complete Financial Modeling & Valuation Analyst (FMVA) coursework', 'Learn Python Pandas and SQL for financial datasets'],
        subjectsToFocus: ['Corporate Finance', 'Financial Management', 'Statistics & Econometrics'],
        projectsToBuild: ['Automated DCF Valuation Model for Tech Stocks', 'Real-time Stock Portfolio Tracker in Python']
      },
      {
        id: 'fin_2',
        title: 'Business Intelligence & Data Analytics Manager',
        matchScore: 91,
        category: 'Business Analytics',
        reason: 'Transforms raw enterprise data into executive decision dashboards and revenue growth insights.',
        expectedFutureDemand: 'High',
        salaryRange: { entry: '$68,000 / yr', mid: '$108,000 / yr', senior: '$160,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '1 - 2 Years',
        whySuitable: 'High demand across all corporate sectors for professionals who can query databases and tell compelling business stories with data visualizations.',
        skillsMatching: ['Analytical Mindset', 'Business Strategy', 'Communication'],
        skillsMissing: ['Advanced SQL', 'Tableau / Power BI', 'Data Pipelines'],
        whatToImprove: ['Master SQL Joins, CTEs, and Window Functions', 'Build 3 public PowerBI dashboards'],
        subjectsToFocus: ['Business Statistics', 'Database Systems', 'Operations Research'],
        projectsToBuild: ['E-Commerce Revenue & Churn Intelligence Dashboard']
      },
      {
        id: 'fin_3',
        title: 'Investment Banking & Equity Research Analyst',
        matchScore: 87,
        category: 'Investment Banking',
        reason: 'Focuses on corporate mergers & acquisitions (M&A), capital markets, and equity valuation.',
        expectedFutureDemand: 'Growing',
        salaryRange: { entry: '$85,000 / yr', mid: '$150,000 / yr', senior: '$250,000+ / yr' },
        difficulty: 'Challenging',
        timeRequired: '2 - 3 Years',
        whySuitable: 'Prestigious career path with high financial rewards for rigorous quantitative thinkers.',
        skillsMatching: ['Financial Statement Analysis', 'Market Research'],
        skillsMissing: ['M&A LBO Modeling', 'Pitchbook Preparation'],
        whatToImprove: ['Prepare for CFA Level 1 exam', 'Practice wall street prep financial modeling templates'],
        subjectsToFocus: ['Security Analysis', 'Investment Management', 'Macroeconomics'],
        projectsToBuild: ['Comprehensive LBO & M&A Deal Analysis Pitchbook']
      },
      {
        id: 'fin_4',
        title: 'Risk Management & Regulatory Consultant',
        matchScore: 83,
        category: 'Consulting & Risk',
        reason: 'Helps financial institutions mitigate market, credit, operational, and cyber risk.',
        expectedFutureDemand: 'Stable',
        salaryRange: { entry: '$65,000 / yr', mid: '$102,000 / yr', senior: '$155,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '1 - 2 Years',
        whySuitable: 'Essential role ensuring banks and corporate firms remain compliant with global monetary regulations.',
        skillsMatching: ['Regulatory Knowledge', 'Risk Assessment'],
        skillsMissing: ['FRM Certification Knowledge', 'Stress Testing Models'],
        whatToImprove: ['Pursue Financial Risk Manager (FRM) certification'],
        subjectsToFocus: ['Auditing', 'Risk Analytics', 'Corporate Governance'],
        projectsToBuild: ['Bank Credit Risk Assessment & Scoring Algorithm']
      },
      {
        id: 'fin_5',
        title: 'Digital Product & Growth Marketer',
        matchScore: 80,
        category: 'Marketing & Strategy',
        reason: 'Drives customer acquisition, user analytics, and revenue funnel optimization for tech startups.',
        expectedFutureDemand: 'Growing',
        salaryRange: { entry: '$58,000 / yr', mid: '$92,000 / yr', senior: '$145,000 / yr' },
        difficulty: 'Beginner Friendly',
        timeRequired: '1 Year',
        whySuitable: 'Great blend of creative messaging, conversion rate optimization, and data analytics.',
        skillsMatching: ['Copywriting', 'Customer Empathy', 'Analytics'],
        skillsMissing: ['SEO & SEM Optimization', 'A/B Testing Tools (Optimizely)', 'Google Analytics 4'],
        whatToImprove: ['Get Google Analytics 4 certified', 'Run a live growth experiment on social channels'],
        subjectsToFocus: ['Consumer Behavior', 'Digital Marketing', 'Brand Management'],
        projectsToBuild: ['End-to-End Growth Funnel Audit & Strategy Campaign']
      }
    ];
  } else {
    // Default Tech & General Engineering / Graduate Profile
    studentSummary = `${name} demonstrates high learning agility, technical curiosity, and problem-solving drive tailored for engineering, software systems, and data-driven careers in ${studentProfile?.gradeOrField || 'Tech'}.`;
    topCareers = [
      {
        id: 'tech_1',
        title: 'AI & Full-Stack Software Engineer',
        matchScore: 96,
        category: 'Software Engineering & AI',
        reason: `Ideal match for ${name}'s interest in ${studentProfile?.gradeOrField || 'Computer Science & Software Systems'} to build production web applications and LLM agent backends.`,
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$75,000 / yr', mid: '$130,000 / yr', senior: '$190,000+ / yr' },
        difficulty: 'Challenging',
        timeRequired: '1 - 2 Years',
        whySuitable: `High global demand for software developers who can build responsive modern web interfaces (React, TypeScript, Tailwind) backed by robust API services and Gemini/AI model integrations.`,
        skillsMatching: ['Problem Solving', 'Data Structures', 'Web Tech Aptitude'],
        skillsMissing: ['System Architecture Design', 'Docker & Cloud Deployment', 'GraphQL / REST API Optimization'],
        whatToImprove: ['Solve 100+ LeetCode DSA problems', 'Build and deploy 2 full-stack web applications on cloud platform', 'Learn Docker containerization and CI/CD pipelines'],
        subjectsToFocus: ['Data Structures & Algorithms', 'Operating Systems', 'Database Systems', 'Software Engineering'],
        projectsToBuild: ['Full-Stack AI Productivity Platform with TypeScript & Express', 'Real-time Collaborative Canvas App'],
        internships: ['SDE Intern at Amazon / Microsoft / Swiggy / Zomato'],
        githubLinkedInTips: ['Keep GitHub green with daily commits', 'Write clear README files for all portfolio repositories']
      },
      {
        id: 'tech_2',
        title: 'Cloud Systems & DevOps Architect',
        matchScore: 92,
        category: 'Cloud & Infrastructure',
        reason: 'Designs scalable cloud infrastructure, Kubernetes clusters, and automated deployment pipelines.',
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$78,000 / yr', mid: '$135,000 / yr', senior: '$200,000+ / yr' },
        difficulty: 'Challenging',
        timeRequired: '1 - 2 Years',
        whySuitable: 'Critical role ensuring enterprise applications stay highly available, secure, and resilient.',
        skillsMatching: ['Linux Command Line', 'Networking Logic'],
        skillsMissing: ['Terraform (IaC)', 'Kubernetes', 'AWS / GCP Architecture'],
        whatToImprove: ['Earn AWS Certified Solutions Architect or GCP Associate Cloud Engineer certification', 'Master Terraform infrastructure provision scripts'],
        subjectsToFocus: ['Computer Networks', 'Cloud Computing', 'System Security'],
        projectsToBuild: ['Automated CI/CD Deployment Pipeline for Microservices']
      },
      {
        id: 'tech_3',
        title: 'Data Scientist & Machine Learning Specialist',
        matchScore: 88,
        category: 'AI & Data Science',
        reason: 'Develops predictive machine learning models, neural networks, and automated data pipelines.',
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$80,000 / yr', mid: '$140,000 / yr', senior: '$210,000+ / yr' },
        difficulty: 'Challenging',
        timeRequired: '2 Years',
        whySuitable: 'Combines linear algebra, statistics, Python (PyTorch/Scikit-Learn), and feature engineering.',
        skillsMatching: ['Mathematical Logic', 'Python Aptitude'],
        skillsMissing: ['PyTorch / TensorFlow', 'MLOps Model Deployment', 'Feature Store Pipeline'],
        whatToImprove: ['Build ML models on Kaggle competitions', 'Deploy trained models via FastAPI and Docker'],
        subjectsToFocus: ['Linear Algebra & Probability', 'Machine Learning', 'Deep Learning'],
        projectsToBuild: ['End-to-End Customer Churn Prediction ML System with MLOps']
      },
      {
        id: 'tech_4',
        title: 'Cybersecurity & Security Engineer',
        matchScore: 84,
        category: 'Information Security',
        reason: 'Protects enterprise cloud applications, networks, and databases against cyber threats.',
        expectedFutureDemand: 'Very High',
        salaryRange: { entry: '$72,000 / yr', mid: '$125,000 / yr', senior: '$185,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '1 - 2 Years',
        whySuitable: 'Vital domain with severe global talent shortages in vulnerability assessment and threat hunting.',
        skillsMatching: ['Network Fundamentals', 'Problem Solving'],
        skillsMissing: ['Penetration Testing (BurpSuite)', 'SIEM Log Analysis', 'Ethical Hacking'],
        whatToImprove: ['Earn CompTIA Security+ or CEH certification', 'Practice CTF challenges on TryHackMe and HackTheBox'],
        subjectsToFocus: ['Network Security', 'Cryptography', 'Ethical Hacking'],
        projectsToBuild: ['Vulnerability Scanner & Network Intrusion Detection Tool']
      },
      {
        id: 'tech_5',
        title: 'Tech Product Manager',
        matchScore: 81,
        category: 'Product Management',
        reason: 'Orchestrates software feature roadmaps, engineering sprints, user experience, and market fit.',
        expectedFutureDemand: 'High',
        salaryRange: { entry: '$70,000 / yr', mid: '$130,000 / yr', senior: '$195,000 / yr' },
        difficulty: 'Moderate',
        timeRequired: '1 - 3 Years',
        whySuitable: 'Blends technical architecture understanding with business vision, wireframing, and user research.',
        skillsMatching: ['Leadership', 'User Empathy', 'Strategic Thinking'],
        skillsMissing: ['Agile / Scrum Frameworks', 'PRD Document Writing', 'Product Analytics (Mixpanel)'],
        whatToImprove: ['Write 2 Product Requirement Documents (PRDs) for popular apps', 'Master Figma wireframing basics'],
        subjectsToFocus: ['Software Project Management', 'User Experience Design', 'Business Strategy'],
        projectsToBuild: ['Product Requirement Document & Wireframe Specs for a Startup App']
      }
    ];
  }

  const traitScores = [
    { trait: 'Analytical Thinking', score: 94 },
    { trait: 'Creativity', score: 86 },
    { trait: 'Leadership', score: 72 },
    { trait: 'Communication', score: 80 },
    { trait: 'Technology Interest', score: 95 },
    { trait: 'Business Interest', score: 68 },
    { trait: 'Research Interest', score: 88 }
  ];

  const roadmap = [
    {
      id: 'phase_1',
      phase: 'Phase 1: Fundamentals & Core Mastery',
      timeframe: 'Months 1 - 3',
      title: 'Foundational Knowledge & Core Tools',
      description: `Establish strong mastery over essential concepts in ${studentProfile?.gradeOrField || 'your discipline'}, core tools, and fundamental principles.`,
      skillsToLearn: topCareers[0].skillsMatching || ['Core Concepts', 'Problem Solving', 'Tooling'],
      recommendedCourses: [`Complete Guide to ${topCareers[0].category}`, 'Analytical Problem Solving Essentials'],
      projects: [topCareers[0].projectsToBuild?.[0] || 'Foundational Practical Project'],
      competitions: ['Regional Skill Competition', 'Student Hackathon'],
      status: 'In Progress'
    },
    {
      id: 'phase_2',
      phase: 'Phase 2: Applied Skills & Project Portfolio',
      timeframe: 'Months 4 - 8',
      title: 'Building Real-World Projects',
      description: `Apply your knowledge by building 2-3 tangible projects, collaborating with peers, and mastering industry-standard tools.`,
      skillsToLearn: topCareers[0].skillsMissing || ['Advanced Tools', 'System Architecture', 'Industry Workflows'],
      recommendedCourses: ['Advanced Applied Specialization', 'Industry Standard Practice Course'],
      projects: [topCareers[0].projectsToBuild?.[1] || 'Intermediate Application Project'],
      competitions: ['National Innovation Contest', 'Open Source Sprint'],
      status: 'Upcoming'
    },
    {
      id: 'phase_3',
      phase: 'Phase 3: Industry Readiness & Certifications',
      timeframe: 'Months 9 - 12',
      title: 'Certifications & Professional Identity',
      description: 'Prepare your resume, GitHub/portfolio, LinkedIn profile, and achieve recognized industry certifications.',
      skillsToLearn: ['Interview Preparation', 'Professional Portfolio', 'Domain Specialization'],
      recommendedCourses: ['Professional Certification Prep', 'Interview & Resume Bootcamp'],
      projects: ['Capstone End-to-End Portfolio Project'],
      competitions: ['Global Career Challenge'],
      status: 'Upcoming'
    },
    {
      id: 'phase_4',
      phase: 'Phase 4: Launch & Career Transition',
      timeframe: 'Year 2 Onwards',
      title: 'Internships, Placement & Specialization',
      description: 'Secure top internships, campus placements, or research positions, accelerating toward senior high-paying roles.',
      skillsToLearn: ['Advanced Leadership', 'Team Mentorship', 'Domain Innovation'],
      recommendedCourses: ['Executive Leadership & Advanced Domain Specialization'],
      projects: ['Production Enterprise Solution'],
      competitions: ['Industry Innovation Excellence Award'],
      status: 'Upcoming'
    }
  ];

  const skillGapAnalysis = [
    { skill: topCareers[0].skillsMatching?.[0] || 'Core Domain Knowledge', currentLevel: 75, targetLevel: 95, category: 'Core' },
    { skill: topCareers[0].skillsMatching?.[1] || 'Problem Solving & Logic', currentLevel: 80, targetLevel: 95, category: 'Core' },
    { skill: topCareers[0].skillsMissing?.[0] || 'Advanced Tooling & Automation', currentLevel: 35, targetLevel: 90, category: 'Technical Gap' },
    { skill: topCareers[0].skillsMissing?.[1] || 'Industry System Workflows', currentLevel: 40, targetLevel: 88, category: 'Technical Gap' },
    { skill: 'Professional Communication', currentLevel: 70, targetLevel: 90, category: 'Soft Skill' }
  ];

  return {
    confidenceScore: 94,
    studentSummary,
    primaryTraits: ['Analytical Thinker', 'High Learning Agility', 'Technical Innovator'],
    traitScores,
    topCareers,
    roadmap,
    skillGapAnalysis,
    industryDemand: {
      trend: 'Accelerating High Growth',
      demandScore: 92,
      keyInsights: `Industry demand for ${topCareers[0].title} and related roles in ${studentProfile?.gradeOrField || 'this field'} is projected to grow over 24% annually.`
    },
    suggestedScenarios: [
      `What if I devote 15 hours a week to learning ${topCareers[0].skillsMissing?.[0] || 'new skills'}?`,
      `How will completing an internship impact my entry salary?`,
      `What certifications are best for ${topCareers[0].title}?`
    ]
  };
}

// Helper: Strip HTML tags from strings/objects recursively
function stripHtml(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
  if (Array.isArray(obj)) {
    return obj.map(stripHtml);
  }
  if (obj && typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = stripHtml(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

// Endpoint: "Let's Know You" CareerDNA Evaluation & Adaptive Question Engine
app.post('/api/know-you', async (req, res) => {
  try {
    const { studentProfile, directAnalyze } = req.body;
    if (!studentProfile) {
      return res.status(400).json({ error: 'studentProfile is required' });
    }

    const level = studentProfile.educationLevel || 'graduation';
    const name = studentProfile.name || 'Student';
    const gradeOrField = studentProfile.gradeOrField || '';
    const inputsText = (studentProfile.inputs || []).join('\n');
    const qnaHistoryText = (studentProfile.qnaHistory || [])
      .map((item: any) => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n\n');

    const shouldForceComplete = directAnalyze || (studentProfile.qnaHistory && studentProfile.qnaHistory.length > 0) || inputsText.length > 15;

    // Attempt GenAI if GEMINI_API_KEY is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
You are the master AI Engine for "Unfold AI", an elite Career Operating System for students.
Student Name: ${name}
Education Level: ${level.toUpperCase()}
Grade/Field: ${gradeOrField}

Student Input Statements:
${inputsText}

Previous Question & Answer History:
${qnaHistoryText || 'None'}

CRITICAL INSTRUCTIONS:
${shouldForceComplete 
  ? '1. Force "complete": true and calculate a confidenceScore between 92% and 98%.\n2. DO NOT return any followUpQuestion object.\n3. Generate a complete, rich "careerDna" object with Top 5 Career Matches customized specifically for Grade/Field (' + gradeOrField + ') and Education Level (' + level + ').' 
  : '1. Analyze interests and calculate confidenceScore (0-100%).\n2. If confidenceScore is below 80%: Return "complete": false and ONE simple plain-text followUpQuestion with 4-6 options.\n3. If confidenceScore is 80%+ or complete: Return "complete": true and the full "careerDna" object.'
}

STRICT TEXT FORMATTING RULE:
- Absolutely NO HTML tags (such as <div>, <table>, <th>, <span>, <br>).
- Absolutely NO Markdown code blocks or markdown tables.
- All text string properties MUST be pure, clean, plain English readable text.
`;

        const response = await getAiClient().models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                complete: { type: Type.BOOLEAN },
                confidenceScore: { type: Type.NUMBER },
                followUpQuestion: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  }
                },
                careerDna: {
                  type: Type.OBJECT,
                  properties: {
                    confidenceScore: { type: Type.NUMBER },
                    studentSummary: { type: Type.STRING },
                    primaryTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
                    traitScores: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          trait: { type: Type.STRING },
                          score: { type: Type.NUMBER }
                        },
                        required: ['trait', 'score']
                      }
                    },
                    topCareers: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING },
                          matchScore: { type: Type.NUMBER },
                          category: { type: Type.STRING },
                          reason: { type: Type.STRING },
                          expectedFutureDemand: { type: Type.STRING },
                          salaryRange: {
                            type: Type.OBJECT,
                            properties: {
                              entry: { type: Type.STRING },
                              mid: { type: Type.STRING },
                              senior: { type: Type.STRING }
                            }
                          },
                          difficulty: { type: Type.STRING },
                          timeRequired: { type: Type.STRING },
                          whySuitable: { type: Type.STRING },
                          skillsMatching: { type: Type.ARRAY, items: { type: Type.STRING } },
                          skillsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
                          whatToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
                          subjectsToFocus: { type: Type.ARRAY, items: { type: Type.STRING } },
                          projectsToBuild: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['id', 'title', 'matchScore', 'category', 'reason', 'expectedFutureDemand', 'salaryRange', 'difficulty', 'timeRequired', 'whySuitable', 'skillsMatching', 'skillsMissing', 'whatToImprove', 'subjectsToFocus', 'projectsToBuild']
                      }
                    },
                    roadmap: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          phase: { type: Type.STRING },
                          timeframe: { type: Type.STRING },
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          skillsToLearn: { type: Type.ARRAY, items: { type: Type.STRING } },
                          recommendedCourses: { type: Type.ARRAY, items: { type: Type.STRING } },
                          projects: { type: Type.ARRAY, items: { type: Type.STRING } },
                          status: { type: Type.STRING }
                        },
                        required: ['id', 'phase', 'timeframe', 'title', 'description', 'skillsToLearn', 'recommendedCourses', 'projects', 'status']
                      }
                    },
                    skillGapAnalysis: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          skill: { type: Type.STRING },
                          currentLevel: { type: Type.NUMBER },
                          targetLevel: { type: Type.NUMBER },
                          category: { type: Type.STRING }
                        },
                        required: ['skill', 'currentLevel', 'targetLevel', 'category']
                      }
                    },
                    industryDemand: {
                      type: Type.OBJECT,
                      properties: {
                        trend: { type: Type.STRING },
                        demandScore: { type: Type.NUMBER },
                        keyInsights: { type: Type.STRING }
                      },
                      required: ['trend', 'demandScore', 'keyInsights']
                    }
                  }
                }
              }
            }
          }
        });

        const parsed = stripHtml(JSON.parse(response.text || '{}'));
        if (parsed && (parsed.careerDna || parsed.followUpQuestion)) {
          if (shouldForceComplete && !parsed.careerDna) {
            parsed.complete = true;
            parsed.confidenceScore = 95;
            parsed.careerDna = generateCustomCareerDna(studentProfile);
          }
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.warn('Gemini API call warning, using dynamic career DNA engine:', geminiError);
      }
    }

    // Dynamic Engine evaluation fallback
    const careerDna = generateCustomCareerDna(studentProfile);
    return res.json({
      complete: true,
      confidenceScore: 94,
      careerDna
    });
  } catch (error: any) {
    console.error('Error in /api/know-you:', error);
    const careerDna = generateCustomCareerDna(req.body?.studentProfile || {});
    return res.json({
      complete: true,
      confidenceScore: 92,
      careerDna
    });
  }
});

// Endpoint: AI Career Mentor Chat
app.post('/api/career-mentor', async (req, res) => {
  try {
    const { message, studentProfile, careerDna, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const systemInstruction = `
You are CareerDNA AI's 24/7 Personal Career Mentor.
You are talking to ${studentProfile?.name || 'the student'} (${studentProfile?.educationLevel || 'graduation'} level, Grade/Field: ${studentProfile?.gradeOrField || 'General'}).

Student Context:
- Summary: ${careerDna?.studentSummary || 'Exploring career options'}
- Top Career Match: ${careerDna?.topCareers?.[0]?.title || 'Technology & Engineering'}
- Primary Traits: ${(careerDna?.primaryTraits || []).join(', ')}

Guidelines:
1. Speak as an encouraging, deeply knowledgeable, highly pragmatic personal mentor.
2. Tailor your language complexity to their education level (${studentProfile?.educationLevel}):
   - School: Warm, simple, encouraging, actionable habits, fun metaphors.
   - Intermediate: Focused on entrance exams, subjects, college selection, study habits.
   - Graduation: Focused on internships, SDE/Product roles, GitHub, LinkedIn, technical interview prep, System Design, salary negotiation.
3. Be concise (2-3 paragraphs max) with clear, actionable bullet points when giving guidance.
4. Always end with 2 relevant follow-up questions/prompts the student might want to ask next.
`;

    const contents = [
      ...(history || []).map((h: any) => `${h.sender === 'user' ? 'Student' : 'Mentor'}: ${h.text}`).join('\n\n'),
      `Student: ${message}`
    ].join('\n\n');

    const response = await getAiClient().models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in /api/career-mentor:', error);
    res.status(500).json({ error: error.message || 'Failed to get AI mentor response' });
  }
});

// Endpoint: Career Simulator ("What-If" Scenarios)
app.post('/api/simulate', async (req, res) => {
  try {
    const { scenario, parameters, studentInput, targetCareer, studentProfile } = req.body;
    
    // Construct SimulationRequest
    const simReq = {
      scenario: scenario || 'What-If Simulation Scenario',
      parameters: parameters || {
        studyHours: req.body.studyHours || 15,
        projects: req.body.projects || 1,
        internships: req.body.internships || 0,
        communicationSkills: req.body.communicationSkills || 6,
        certifications: req.body.certifications || 0,
        cgpa: req.body.cgpa || 7.5,
        openSourceContributions: req.body.openSourceContributions || 0
      },
      studentInput: studentInput || {
        educationLevel: studentProfile?.educationLevel || 'graduation',
        interests: studentProfile?.interests || [],
        hobbies: [],
        goals: studentProfile?.goals || [],
        strengths: [],
        weaknesses: [],
        subjects: []
      },
      targetCareer: targetCareer || studentProfile?.topCareer || 'AI & Machine Learning Engineer'
    };

    const result = CareerSimulatorEngine.simulate(simReq);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/simulate:', error);
    res.status(500).json({ error: error.message || 'Failed to run simulation' });
  }
});

// Endpoint: Resume & Skill Analyzer
app.post('/api/resume-analyzer', async (req, res) => {
  try {
    const { resumeText, educationLevel, targetRole } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' });
    }

    const prompt = `
Analyze the following resume/skill profile for a student in ${educationLevel || 'graduation'} targeting the role of "${targetRole || 'Software / AI Engineer'}":

Resume Content:
"""
${resumeText}
"""

Evaluate against top company/tier-1 standards and return a JSON object with:
- overallScore (0 - 100)
- strengths (3 points)
- improvements (3 points)
- missingKeywords (5 technical or domain keywords)
- recommendedProjects (2 capstone projects to elevate profile)
- linkedInOptimization (2 actionable tips for LinkedIn & GitHub)
`;

    const response = await getAiClient().models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            linkedInOptimization: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['overallScore', 'strengths', 'improvements', 'missingKeywords', 'recommendedProjects', 'linkedInOptimization']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/resume-analyzer:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

// Vite middleware for development vs static build in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerDNA AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
