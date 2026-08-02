# Unfold AI — Next-Gen Student-to-Graduate AI Career & Academic Platform

**Unfold AI** is an intelligent academic and career planning ecosystem designed to navigate students from Middle School (Classes 6th–10th) through Intermediate (11th–12th PCM/PCB/JEE/NEET) and Graduation (B.Tech, Degree & Specializations) to high-impact career placements (₹22–₹45 LPA).

---

## 🌟 Key Features

- **Sci-Fi Interactive Neural Pathway Graph**: Visually connected stage network featuring animated SVG connectors, glowing node paths, and real-time traveling energy pulses across 5 core stages:
  - **School Foundation (Classes 6th–10th NCERT & Olympiads)** — Amber Flame Node
  - **Intermediate Stream (11th–12th PCM/PCB, JEE & NEET)** — Indigo CPU Node
  - **Unfold AI Core (Pathway Intelligence Synthesis)** — Central Dual-Ring AI Engine
  - **B.Tech & Specialization (GenAI, Full-Stack & Capstones)** — Emerald Book Node
  - **Career Launch (Tier-1 Placements: ₹22 – ₹45 LPA)** — Teal Indian Rupee Node

- **Dynamic Student-to-Graduate Roadmap Generator**: Tailored roadmaps according to education levels, target exam benchmarks, recommended textbooks, and phase milestones.

- **Interactive Daily Effort & Salary Simulator**: Adjust daily study/work hours to dynamically calculate estimated percentiles, skill acquisition scores, and career salary projections.

- **AI Career Simulation & Skill Diagnostic**: Benchmark core skill readiness with AI-assisted diagnostics, personalized career paths, and step-by-step actionable recommendations.

- **Transparent & Explainable AI**: Clear explanations for AI recommendations to ensure confidence in suggested academic paths and preparation milestones.

---

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling & UI**: Tailwind CSS, Lucide React Icons, Framer Motion animations
- **Backend API Server**: Node.js + Express (Full-stack API proxy setup)
- **AI Integration**: Google Gemini API via `@google/genai`
- **Build System**: Vite (client SPA) + esbuild (CJS server output)

---

## 📁 Project Structure

```
├── server.ts              # Express server with Vite dev middleware & API endpoints
├── src/
│   ├── App.tsx            # Main Application Shell & Route State
│   ├── components/        # UI Components & Modules
│   │   ├── LandingHero.tsx                # Hero section with Sci-Fi Neural Canvas
│   │   ├── EducationLevelsShowcase.tsx    # Interactive levels breakdown
│   │   ├── CareerRoadmapEngine.tsx       # Dynamic AI roadmap generator
│   │   ├── StudentLevelsSection.tsx       # Grade-specific path visualizer
│   │   ├── HowItWorksSection.tsx          # 4-step AI guidance workflow
│   │   ├── ExplainableAiWorkspace.tsx     # Transparent AI explainability
│   │   ├── CareerSimulationSection.tsx   # Skill diagnostic & career simulator
│   │   ├── PersonalWorkspace.tsx          # Student dashboard & workspace
│   │   ├── AuthModal.tsx                  # Student sign-in / registration modal
│   │   ├── KnowYouModal.tsx               # Quick student assessment modal
│   │   └── Navbar.tsx & Footer.tsx        # Navigation & footer bars
│   ├── context/           # React Context state management
│   ├── data/              # Curated roadmaps & mock reference data
│   └── types.ts           # Shared TypeScript type declarations
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite bundler configuration
└── metadata.json          # Platform metadata
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure your keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Development Server

Start the local development server (runs on port 3000):

```bash
npm run dev
```

### 4. Build for Production

Build both client SPA assets and server CommonJS bundle:

```bash
npm run build
```

### 5. Start Production Server

```bash
npm run start
```

---

## 📄 License

This project is licensed under the MIT License.
