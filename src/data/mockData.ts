import { CareerDnaResult, EducationLevel } from '../types';

export interface SampleProfile {
  id: string;
  name: string;
  level: EducationLevel;
  grade: string;
  avatar: string;
  inputs: string[];
  summary: string;
  dna: CareerDnaResult;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'school-demo',
    name: 'Aarav Sharma',
    level: 'school',
    grade: 'Class 8',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
    inputs: ['I love mathematics and drawing robots.', 'I enjoy solving logic puzzles and lego building.'],
    summary: 'A creative young mind fascinated by mechanics, visual art, and logical problem solving.',
    dna: {
      confidenceScore: 92,
      studentSummary: 'Aarav demonstrates a unique blend of spatial visual design (drawing) and structured logical reasoning (mathematics & puzzles). In Class 8, this points toward Robotics, Visual Game Engineering, and AI Design.',
      primaryTraits: ['Visual Spatial', 'Logical Mathematical', 'Creative Tinkerer', 'Curious Explorer'],
      traitScores: [
        { trait: 'Analytical Thinking', score: 92 },
        { trait: 'Creativity', score: 88 },
        { trait: 'Leadership', score: 68 },
        { trait: 'Communication', score: 75 },
        { trait: 'Technology Interest', score: 96 },
        { trait: 'Business Interest', score: 45 },
        { trait: 'Research Interest', score: 85 }
      ],
      topCareers: [
        {
          id: 'robotics-eng',
          title: 'Robotics & Automation Engineer',
          matchScore: 96,
          category: 'Robotics & Hardware',
          reason: 'Combines your love for building physical items (lego/robots) with mathematical precision and design creativity.',
          expectedFutureDemand: 'Very High',
          salaryRange: {
            entry: '₹6.5 - ₹10 LPA',
            mid: '₹14 - ₹22 LPA',
            senior: '₹28 - ₹45+ LPA'
          },
          difficulty: 'Moderate',
          timeRequired: '2 - 4 Years',
          whySuitable: 'Combines your love for building physical items (lego/robots) with mathematical precision and design creativity.',
          skillsMatching: ['Logical Reasoning', 'Visual Sketching', 'Math Fundamentals', 'Lego / Physical Tinkering'],
          skillsMissing: ['C++ / Python Syntax', 'Basic Circuit Design', 'Microcontrollers (Arduino)'],
          whatToImprove: ['Start with Scratch block coding and transition to Python', 'Explore beginner Arduino electronics kits'],
          subjectsToFocus: ['Mathematics (Algebra & Geometry)', 'Science (Physics - Electricity & Motion)', 'Computer Science (Scratch/Python)'],
          projectsToBuild: ['Virtual Robot in Tinkercad', 'Obstacle-Avoiding Robot Car', 'Animated Scratch Game'],
          benefits: ['High hands-on creativity', 'Fast-growing industry in AI hardware', 'Combines coding and physical tinkering'],
          challenges: ['Requires patience with physics concepts', 'Needs both hardware & software skill balance'],
          requiredSkills: ['Scratch / Python Basics', 'Basic Electronics & Arduino', 'Geometry & Physics Fundamentals', '3D Design Curiosity'],
          futureScope: 'Extremely high demand as AI and smart robotics expand in healthcare, space, and home automation.',
          learningResources: [
            { title: 'Tinkercad Circuits & 3D Design', type: 'app', description: 'Free online browser tool for building 3D models and virtual Arduino circuits.' },
            { title: 'MIT Scratch Robotics Animations', type: 'platform', description: 'Visual block programming to bring robot characters to life.' },
            { title: 'LEGO Mindstorms / FIRST LEGO League', type: 'platform', description: 'Hands-on robotics kit and worldwide competition.' }
          ],
          projects: ['Build a Virtual Robot in Tinkercad', 'Code an Obstacle-Avoiding Robot Car with Arduino', 'Design an Animated Robot Comic in Scratch'],
          timelineSummary: 'Focus on Math & Science in Classes 8-10, participate in LEGO/Science Fairs, transition to Python in High School.',
          alternativeOptions: ['Game Designer', 'AI Interaction Designer', 'Mechatronics Engineer'],
          competitions: ['National Science Olympiad (NSO)', 'FIRST LEGO League (FLL)', 'World Robot Olympiad (WRO) Junior'],
          parentsTips: [
            'Encourage Aarav with beginner Arduino starter kits rather than expensive gadgets.',
            'Support participation in local science exhibitions to build presentation confidence.',
            'Maintain a balanced focus on core school subjects alongside tinkering.'
          ],
          interestingFacts: [
            'Did you know NASA lunar rovers use the same motor principles Aarav can learn in Class 8 physics?',
            'Robotics engineers use drawing skills to sketch mechanical limbs before building them!'
          ]
        },
        {
          id: 'game-designer',
          title: 'Interactive Game & AI Designer',
          matchScore: 90,
          category: 'Creative Tech',
          reason: 'Fuses drawing & visual arts directly with interactive logic and storytelling.',
          expectedFutureDemand: 'High',
          salaryRange: {
            entry: '₹6.0 - ₹9.5 LPA',
            mid: '₹12 - ₹18 LPA',
            senior: '₹24 - ₹40+ LPA'
          },
          difficulty: 'Moderate',
          timeRequired: '2 - 4 Years',
          whySuitable: 'Fuses drawing & visual arts directly with interactive logic and storytelling.',
          skillsMatching: ['Character Drawing', 'Logic Puzzles', 'Creative Storytelling'],
          skillsMissing: ['2D/3D Game Engines', 'Pygame Basics', 'Coordinate Mathematics'],
          whatToImprove: ['Learn Roblox Studio / Construct 3', 'Practice 2D character animation'],
          subjectsToFocus: ['Art & Design', 'Mathematics (Coordinate Geometry)', 'English Literature (Storytelling)'],
          projectsToBuild: ['2D Platformer Game', 'Interactive Story Comic'],
          benefits: ['Express visual artistic talent', 'Immediate satisfying feedback seeing games run'],
          challenges: ['Requires balancing story design with math/physics engine rules'],
          requiredSkills: ['2D Sketching & Character Design', 'Logic Flowcharts', 'Scratch / Pygame'],
          futureScope: 'Gaming is larger than film & music combined, with growing demand for AI interactive virtual worlds.',
          learningResources: [
            { title: 'Khan Academy Computer Animation', type: 'course', description: 'Learn how Pixar uses math to animate characters.' },
            { title: 'Construct 3 / Roblox Studio', type: 'platform', description: 'Easy 2D game creation without complex code.' }
          ],
          projects: ['Create a 2D Platformer Game with custom drawn robot avatar', 'Design a Comic Book with interactive choices'],
          timelineSummary: 'Build visual arts portfolio in middle school, learn Python in 9th, study Computer Graphics in High School.',
          alternativeOptions: ['UI/UX Designer', 'VFX Artist', 'AR/VR Developer'],
          competitions: ['Bebras International Challenge on Informatics', 'Local Game Jam Junior'],
          parentsTips: ['Allow structured screen time dedicated specifically to game creation, not just play.'],
          interestingFacts: ['The popular game Minecraft was built by a single developer before becoming a global phenomenon!']
        }
      ],
      roadmap: [
        {
          id: 'school-p1',
          phase: 'Class 8 (Current)',
          timeframe: 'Months 1 - 6',
          title: 'Foundations of Logic & Tinkering',
          description: 'Master middle school math concepts while exploring visual coding & Tinkercad electronics.',
          skillsToLearn: ['Geometry & Basic Algebra', 'Scratch Block Logic', 'Tinkercad 3D Design'],
          recommendedCourses: ['Khan Academy Pre-Algebra', 'Tinkercad 3D Modeling Basics'],
          projects: ['Design a custom 3D Robot Mascot', 'Create an Interactive Math Quiz in Scratch'],
          competitions: ['National Cyber Olympiad (NCO)', 'School Science Fair'],
          certifications: ['Scratch Creator Certificate'],
          internships: [],
          status: 'in_progress'
        },
        {
          id: 'school-p2',
          phase: 'Class 9',
          timeframe: 'Next Academic Year',
          title: 'Transition to Text Coding (Python)',
          description: 'Step up from block coding to Python programming and physical electronics with Arduino.',
          skillsToLearn: ['Python Fundamentals', 'Basic Arduino C++', 'Physics Mechanics'],
          recommendedCourses: ['Python for Beginners (Coursera/Codecademy)', 'Arduino Junior Maker Kit'],
          projects: ['Build a Temperature Sensor with LED Display', 'Program a Python Text Adventure Game'],
          competitions: ['FIRST LEGO League', 'Junior Science Talent Search'],
          certifications: ['Python Entry-Level Programmer (PCEP) Prep'],
          internships: [],
          status: 'upcoming'
        },
        {
          id: 'school-p3',
          phase: 'Class 10',
          timeframe: 'Board Exam & Stream Selection',
          title: 'Strengthening Core Science & Choosing High School Stream',
          description: 'Achieve high academic scores in Math & Science while preparing for Science/PCM Stream in 11th.',
          skillsToLearn: ['Advanced Physics Fundamentals', 'Coordinate Geometry', 'Logical Reasoning'],
          recommendedCourses: ['NCERT Science & Math Mastery', 'Pygame Graphics Library'],
          projects: ['Build a Bluetooth Controlled Robot', 'Participate in Regional Science Exhibition'],
          competitions: ['National Science Olympiad (NSO)', 'Bebras Computational Thinking Contest'],
          certifications: [],
          internships: [],
          status: 'upcoming'
        }
      ],
      skillGapAnalysis: [
        { skill: 'Math & Geometry', currentLevel: 75, targetLevel: 90, category: 'Academics' },
        { skill: 'Visual Design & Sketching', currentLevel: 80, targetLevel: 85, category: 'Creativity' },
        { skill: 'Scratch / Logic Flow', currentLevel: 70, targetLevel: 85, category: 'Coding' },
        { skill: 'Python / Code Syntax', currentLevel: 25, targetLevel: 75, category: 'Coding' },
        { skill: 'Hardware / Electronics', currentLevel: 30, targetLevel: 70, category: 'Engineering' }
      ],
      industryDemand: {
        trend: 'High',
        demandScore: 94,
        keyInsights: 'Robotics, AI hardware, and smart automation are expanding rapidly globally with strong long-term career stability.'
      },
      suggestedScenarios: [
        'If I learn Python in Class 8 instead of Class 9',
        'If I participate in the FIRST LEGO League robotics competition',
        'If I choose Science (PCM) vs Commerce stream in Class 11'
      ]
    }
  },
  {
    id: 'inter-demo',
    name: 'Ananya Reddy',
    level: 'intermediate',
    grade: 'Class 12 (PCM)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    inputs: ['I like computer science, physics and solving real-world business problems.', 'I want to build software startups in future.'],
    summary: 'Goal-oriented high school senior in Science stream aiming for top Engineering & Computer Science universities with entrepreneurial ambitions.',
    dna: {
      studentSummary: 'Ananya combines analytical engineering aptitude (Physics & Math) with a strong strategic drive toward building software products and tech startups.',
      primaryTraits: ['Analytical Engineer', 'Entrepreneurial Mindset', 'Strategic Problem Solver', 'Tech Optimist'],
      topCareers: [
        {
          id: 'ai-software-eng',
          title: 'AI & Full-Stack Software Engineer / Founder',
          matchScore: 96,
          category: 'Software & AI',
          why: 'Perfect alignment for students who want to build high-impact software applications and launch tech ventures.',
          benefits: ['Highest placement demand', 'High starting salaries', 'Abundant remote work & startup ecosystem opportunities'],
          challenges: ['Fast-paced tech changes requiring continuous self-learning', 'Competitive university entrance exams'],
          requiredSkills: ['Data Structures & Algorithms', 'TypeScript & React', 'Python & PyTorch', 'System Architecture Basics'],
          futureScope: 'Generative AI and automated software platforms continue to revolutionize every global industry.',
          salaryRange: {
            entry: '₹18 - ₹30 LPA',
            mid: '₹40 - ₹70 LPA',
            senior: '₹80+ LPA'
          },
          learningResources: [
            { title: 'CS50: Introduction to Computer Science (Harvard)', type: 'course', description: 'Gold standard foundational computer science course.' },
            { title: 'LeetCode & HackerRank', type: 'platform', description: 'Practice algorithmic problem solving for university entrance and interview prep.' },
            { title: 'Full Stack Open (University of Helsinki)', type: 'course', description: 'Comprehensive modern web development.' }
          ],
          projects: ['Build an AI Notes Summarizer Web App', 'Create a High School Student Event Planner Portal', 'Develop a Python Physics Simulator'],
          timelineSummary: 'Excel in 12th Board Exams & Entrance Tests (JEE / SAT / BITSAT), target B.Tech Computer Science or AI/ML specialization.',
          alternativeOptions: ['Product Manager', 'Data Scientist', 'FinTech Engineer'],
          entranceExams: ['JEE Main & Advanced', 'BITSAT', 'CUET / SAT', 'State Engineering CETs'],
          topColleges: ['IIT Bombay / Delhi / Madras', 'BITS Pilani', 'IIIT Hyderabad', 'Top US/UK Universities (Stanford, CMU, Imperial)'],
          competitions: ['KVPY / Science Olympiad', 'Smart India Hackathon Junior', 'Google Summer of Code Prep']
        },
        {
          id: 'data-scientist',
          title: 'Data Scientist & Quantitative Analyst',
          matchScore: 88,
          category: 'Analytics & Finance',
          why: 'Leverages deep mathematical intuition, statistics, and business insight.',
          benefits: ['High analytical decision-making power', 'Lucrative roles in finance, tech, and healthcare'],
          challenges: ['Requires strong calculus, linear algebra, and probability foundation'],
          requiredSkills: ['Python (Pandas, NumPy)', 'Statistics & Probability', 'SQL Databases', 'Machine Learning Models'],
          futureScope: 'Data-driven business strategies dominate modern enterprise growth.',
          salaryRange: {
            entry: '₹12 - ₹18 LPA',
            mid: '₹22 - ₹36 LPA',
            senior: '₹50+ LPA'
          },
          learningResources: [
            { title: 'Applied Data Science with Python (Coursera)', type: 'course', description: 'Hands-on data visualization and machine learning.' }
          ],
          projects: ['Analyze Stock Market Predictions with Python', 'Build a Predictive Model for High School Graduation Scores'],
          timelineSummary: 'Study B.S./B.Tech in Mathematics & Computing, Data Science or Statistics.',
          alternativeOptions: ['Quantitative Trader', 'Business Intelligence Lead'],
          entranceExams: ['JEE Main', 'ISI Admission Test (Indian Statistical Institute)', 'CMI Test'],
          topColleges: ['Indian Statistical Institute (ISI)', 'Chennai Mathematical Institute (CMI)', 'IIT Kharagpur Data Science']
        }
      ],
      roadmap: [
        {
          id: 'inter-p1',
          phase: 'Class 12 (Current)',
          timeframe: 'Months 1 - 4',
          title: 'Entrance Exam & Board Preparation',
          description: 'Focus heavily on Physics, Chemistry, Math concepts alongside solving past 10 years entrance exam papers.',
          skillsToLearn: ['Calculus & Linear Algebra', 'Physics Mechanics & Electromagnetism', 'Problem Solving Speed'],
          recommendedCourses: ['JEE Advanced Problem Solving Series', 'NCERT Exemplar Solutions'],
          projects: ['Class 12 Computer Science Project in Python/SQL'],
          competitions: ['JEE Main Mock Tests', 'BITSAT Practice Series'],
          certifications: [],
          internships: [],
          status: 'in_progress'
        },
        {
          id: 'inter-p2',
          phase: 'College Admission & Summer',
          timeframe: 'Months 5 - 8',
          title: 'University Onboarding & First Open Source Code',
          description: 'Secure CS degree admission and build foundational Git/GitHub skills before Semester 1.',
          skillsToLearn: ['Git & GitHub', 'C++ / Python Data Structures', 'Linux CLI'],
          recommendedCourses: ['CS50x Harvard', 'The Odin Project Foundations'],
          projects: ['Build and deploy personal Developer Portfolio on Vercel', 'Contribute to an open-source documentation repo'],
          competitions: ['Hacktoberfest', 'Beginner College Hackathons'],
          certifications: ['FreeCodeCamp Responsive Web Design'],
          internships: [],
          status: 'upcoming'
        },
        {
          id: 'inter-p3',
          phase: 'B.Tech Year 1',
          timeframe: 'College Freshman Year',
          title: 'Core Computer Science & Web Stack',
          description: 'Excel in College GPA while mastering React, TypeScript, and Data Structures.',
          skillsToLearn: ['Data Structures & Algorithms', 'TypeScript / React', 'Relational Databases (PostgreSQL/SQL)'],
          recommendedCourses: ['NeetCode 150 DSA', 'Full Stack Open'],
          projects: ['Build a Full-Stack Campus Marketplace App', 'Develop a Real-Time Chat App with WebSockets'],
          competitions: ['ACM ICPC Preliminary Rounds', 'Smart India Hackathon'],
          certifications: ['AWS Certified Cloud Practitioner'],
          internships: ['Summer Research Assistant / Early Tech Internship'],
          status: 'upcoming'
        }
      ],
      skillGapAnalysis: [
        { skill: 'Calculus & Physics', currentLevel: 85, targetLevel: 95, category: 'Entrance Prep' },
        { skill: 'Data Structures (DSA)', currentLevel: 40, targetLevel: 85, category: 'Coding' },
        { skill: 'Full Stack Web Dev', currentLevel: 50, targetLevel: 80, category: 'Software' },
        { skill: 'Git & Open Source', currentLevel: 35, targetLevel: 75, category: 'Dev Tools' },
        { skill: 'System Design', currentLevel: 20, targetLevel: 70, category: 'Architecture' }
      ],
      industryDemand: {
        trend: 'High',
        demandScore: 98,
        keyInsights: 'Software & AI engineers with strong problem-solving skills enjoy unmatched career mobility and startup funding opportunities.'
      },
      suggestedScenarios: [
        'If I secure top 1000 rank in JEE Advanced vs BITS Pilani',
        'If I complete 100 LeetCode problems in my freshman summer',
        'If I publish 2 open-source packages on GitHub'
      ]
    }
  },
  {
    id: 'grad-demo',
    name: 'Rohan Verma',
    level: 'graduation',
    grade: 'B.Tech CS (3rd Year)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    inputs: ['I am in 3rd year Computer Science. I know React, Node.js and basic ML.', 'I want to crack high-paying Product Company internships and SDE roles.'],
    summary: 'Driven undergraduate engineer targeting Tier-1 Product Companies (FAANG / Unicorn Startups) with a focus on Full Stack & AI Systems.',
    dna: {
      studentSummary: 'Rohan has solid web development foundations and basic ML exposure. To crack elite SDE-1 roles and $120k+ placements, he needs System Design, advanced DSA, and AI integration experience.',
      primaryTraits: ['Full Stack Builder', 'Product Thinker', 'Systems Enthusiast', 'Career-Focused'],
      topCareers: [
        {
          id: 'fullstack-ai-sde',
          title: 'Senior Software Development Engineer (SDE-1 / AI Product Engineer)',
          matchScore: 98,
          category: 'Core Engineering',
          why: 'Direct alignment with your current React & Node.js skills, elevated by Generative AI SDKs and cloud microservices.',
          benefits: ['Highest tier entry packages ($110k - $160k / 24-45 LPA)', 'Rapid promotion track', 'High impact on millions of users'],
          challenges: ['Rigorous technical interview process (System Design + Live Coding)', 'High bar for production code quality'],
          requiredSkills: ['Advanced DSA (Trees, Graphs, DP)', 'TypeScript, React, Node.js/Express', 'Generative AI APIs & Vector DBs', 'System Design & Redis/PostgreSQL'],
          futureScope: 'AI Product Engineers who can craft full-stack experiences powered by LLMs are the most sought-after engineers in modern software.',
          salaryRange: {
            entry: '₹22 - ₹35 LPA',
            mid: '₹45 - ₹75 LPA',
            senior: '₹90+ LPA'
          },
          learningResources: [
            { title: 'System Design Primer (GitHub)', type: 'platform', description: 'Open source guide to scalable distributed architectures.' },
            { title: 'NeetCode 150 DSA Roadmap', type: 'course', description: 'Curated list of technical interview coding problems.' },
            { title: 'ByteByteGo System Design', type: 'book', description: 'Visual system design breakdown for real-world tech giants.' }
          ],
          projects: [
            'Build a Serverless AI SaaS with Gemini API, Stripe, & PostgreSQL',
            'Develop a Distributed Microservices Rate Limiter in Node.js/Redis',
            'Create a Collaborative Real-time Markdown Workspace with WebSockets'
          ],
          timelineSummary: 'Grind DSA in Semester 5-6, apply for Summer Internships, target Pre-Placement Offers (PPO) in Year 4.',
          alternativeOptions: ['Backend Infrastructure Engineer', 'DevOps / Cloud Architect', 'AI Solutions Architect'],
          internships: ['Google STEP / SWE Intern', 'Microsoft Explore / SWE Intern', 'Atlassian / Stripe / Uber Engineering Intern'],
          openSourceSuggestions: ['Contribute to LangChain / LlamaIndex / Next.js repositories', 'Create a npm package with 500+ downloads'],
          githubLinkedInTips: [
            'Clean GitHub profile readme with automated streak counter and pinned full-stack projects.',
            'LinkedIn post series demonstrating project build breakdowns with video demos.',
            'Resume with quantified impact metrics (e.g. "Reduced API response time by 42% using Redis caching").'
          ]
        },
        {
          id: 'ai-ml-eng',
          title: 'Machine Learning Engineer / AI Engineer',
          matchScore: 92,
          category: 'AI & Data Engineering',
          why: 'Leverages your interest in ML algorithms combined with production API engineering.',
          benefits: ['Frontier innovation space', 'Exceptionally high compensation in AI research labs & enterprise'],
          challenges: ['Deep math/linear algebra requirement', 'Needs experience training/finetuning LLMs and model deployment'],
          requiredSkills: ['PyTorch / TensorFlow', 'Hugging Face Transformers', 'Vector Databases (Pinecone/Chroma)', 'Python Async FastAPI'],
          futureScope: 'Exponential enterprise investment into autonomous AI agents and enterprise RAG systems.',
          salaryRange: {
            entry: '₹25 - ₹40 LPA',
            mid: '₹50 - ₹85 LPA',
            senior: '₹1.2 Cr+ / yr'
          },
          learningResources: [
            { title: 'DeepLearning.AI Generative AI Specialization', type: 'course', description: 'Hands-on LLM orchestration and fine-tuning.' }
          ],
          projects: ['Build an Autonomous Code Review Agent using Gemini API', 'Fine-tune Llama 3 on Domain Legal/Medical Data'],
          timelineSummary: 'Publish research paper or build production AI SaaS during 4th year capstone project.',
          alternativeOptions: ['Research Scientist', 'NLP Engineer'],
          internships: ['NVIDIA AI Intern', 'Meta AI Research Intern', 'OpenAI Fellow'],
          openSourceSuggestions: ['Hugging Face Transformers PRs', 'ChromaDB integration connectors'],
          githubLinkedInTips: ['Host live HuggingFace Spaces & interactive Streamlit demo apps.']
        }
      ],
      roadmap: [
        {
          id: 'grad-p1',
          phase: '3rd Year (Sem 5-6)',
          timeframe: 'Months 1 - 5',
          title: 'Internship Grind & Production Project',
          description: 'Master top 150 DSA questions, complete 1 production-grade full stack AI app, and apply for tier-1 summer internships.',
          skillsToLearn: ['Graphs, Dynamic Programming, Heap DSA', 'Next.js & Serverless Architecture', 'Docker & CI/CD Pipelines'],
          recommendedCourses: ['NeetCode 150', 'Execute Program TypeScript'],
          projects: ['Build an AI SaaS Platform with Gemini API & Stripe Billing'],
          competitions: ['Google Summer of Code (GSoC)', 'Meta Hacker Cup'],
          certifications: ['AWS Certified Solutions Architect Associate'],
          internships: ['Targeting Product Company Summer Internship'],
          status: 'in_progress'
        },
        {
          id: 'grad-p2',
          phase: 'Summer Internship / Sem 7',
          timeframe: 'Months 6 - 9',
          title: 'Placement Season & System Design',
          description: 'Convert summer internship to Pre-Placement Offer (PPO) or crack campus placement rounds with System Design.',
          skillsToLearn: ['System Design (Caching, Load Balancing, DB Sharding)', 'Behavioral Interview STAR Method', 'High Concurrency Node.js'],
          recommendedCourses: ['Grokking the System Design Interview', 'Designing Data-Intensive Applications'],
          projects: ['Build a Distributed Redis-like Cache from scratch'],
          competitions: ['ICPC Asia Regional', 'Major Company Hackathons'],
          certifications: [],
          internships: ['Full-Time Summer Internship in Tier-1 Company'],
          status: 'upcoming'
        },
        {
          id: 'grad-p3',
          phase: '4th Year (Sem 8)',
          timeframe: 'Final Graduation Semester',
          title: 'Career Launch & Open Source Mastery',
          description: 'Finalize offer letters, complete capstone open-source project, and prepare for smooth onboarding as SDE-1.',
          skillsToLearn: ['Production Monitoring & Sentry', 'Kubernetes Basics', 'Financial Literacy & Tax Planning'],
          recommendedCourses: ['Advanced Distributed Systems', 'Pragmatic Programmer'],
          projects: ['Open Source Capstone Library with 100+ GitHub Stars'],
          competitions: [],
          certifications: [],
          internships: [],
          status: 'upcoming'
        }
      ],
      skillGapAnalysis: [
        { skill: 'React & TypeScript', currentLevel: 80, targetLevel: 90, category: 'Frontend' },
        { skill: 'Node.js & Express', currentLevel: 75, targetLevel: 85, category: 'Backend' },
        { skill: 'Data Structures & Algorithms', currentLevel: 55, targetLevel: 90, category: 'Interviews' },
        { skill: 'System Design', currentLevel: 30, targetLevel: 80, category: 'Architecture' },
        { skill: 'Generative AI & Vector DBs', currentLevel: 45, targetLevel: 85, category: 'AI Tech' }
      ],
      industryDemand: {
        trend: 'High',
        demandScore: 99,
        keyInsights: 'Full Stack AI engineers who combine strong computer science fundamentals with modern GenAI integration command top tier salary packages.'
      },
      suggestedScenarios: [
        'If I convert my summer internship into a Pre-Placement Offer (PPO)',
        'If I complete 200 LeetCode Medium/Hard problems before campus drive',
        'If I build an open source AI tool that gains 500+ GitHub stars'
      ]
    }
  }
];
