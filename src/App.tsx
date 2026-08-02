/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { TrustSection } from './components/TrustSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { StudentLevelsSection } from './components/StudentLevelsSection';
import { CareerTimelineSection } from './components/CareerTimelineSection';
import { CareerSimulationSection } from './components/CareerSimulationSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CTASection } from './components/CTASection';
import { KnowYouModal } from './components/KnowYouModal';
import { AuthModal } from './components/AuthModal';
import { PersonalWorkspace } from './components/PersonalWorkspace';
import { Footer } from './components/Footer';
import { EducationLevel, StudentProfile, CareerDnaResult } from './types';
import { SAMPLE_PROFILES } from './data/mockData';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('careerdna_dark_mode');
    if (saved !== null) return saved === 'true';
    return false;
  });
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('graduation');
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [isKnowYouOpen, setIsKnowYouOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('register');

  const handleOpenLogin = () => {
    setAuthInitialMode('login');
    setIsAuthOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthInitialMode('register');
    setIsAuthOpen(true);
  };

  // Default initial profile set from graduation sample profile
  const defaultSample = SAMPLE_PROFILES.find((p) => p.level === educationLevel) || SAMPLE_PROFILES[2];

  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: defaultSample.name,
    educationLevel: defaultSample.level,
    gradeOrField: defaultSample.grade,
    inputs: defaultSample.inputs,
    qnaHistory: []
  });

  const [careerDna, setCareerDna] = useState<CareerDnaResult>(defaultSample.dna);

  // Sync dark mode class on root element and body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('careerdna_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('careerdna_dark_mode', 'false');
    }
  }, [darkMode]);

  // When education level changes while on landing, sync default profile sample
  useEffect(() => {
    const matchedSample = SAMPLE_PROFILES.find((p) => p.level === educationLevel);
    if (matchedSample && currentView === 'landing') {
      setStudentProfile({
        name: matchedSample.name,
        educationLevel: matchedSample.level,
        gradeOrField: matchedSample.grade,
        inputs: matchedSample.inputs,
        qnaHistory: []
      });
      setCareerDna(matchedSample.dna);
    }
  }, [educationLevel, currentView]);

  // Handle Live Demo Load
  const handleViewDemo = () => {
    const matchedSample = SAMPLE_PROFILES.find((p) => p.level === educationLevel) || SAMPLE_PROFILES[2];
    setStudentProfile({
      name: matchedSample.name,
      educationLevel: matchedSample.level,
      gradeOrField: matchedSample.grade,
      inputs: matchedSample.inputs,
      qnaHistory: []
    });
    setCareerDna(matchedSample.dna);
    setCurrentView('workspace');
  };

  // Handle Onboarding Completion
  const handleKnowYouComplete = (profile: StudentProfile, resDna?: CareerDnaResult) => {
    setIsKnowYouOpen(false);
    setEducationLevel(profile.educationLevel);
    setStudentProfile(profile);

    if (resDna && resDna.topCareers && resDna.topCareers.length > 0) {
      setCareerDna(resDna);
    } else {
      const matchedSample = SAMPLE_PROFILES.find((p) => p.level === profile.educationLevel) || SAMPLE_PROFILES[2];
      setCareerDna(matchedSample.dna);
    }

    setCurrentView('workspace');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 text-[#111827] dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-[#4F46E5] selection:text-white">
      
      {/* Sticky Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        educationLevel={educationLevel}
        setEducationLevel={setEducationLevel}
        onOpenKnowYou={() => setIsKnowYouOpen(true)}
        onOpenAuth={handleOpenLogin}
        onViewDemo={handleViewDemo}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* View Switcher */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          {/* 1. Hero Section */}
          <LandingHero
            onOpenKnowYou={() => setIsKnowYouOpen(true)}
            onOpenAuth={handleOpenRegister}
            onViewDemo={handleViewDemo}
            educationLevel={educationLevel}
          />

          {/* 2. Trust Section (Stats) */}
          <TrustSection />

          {/* 3. Features Section (8 Cards) */}
          <FeaturesSection />

          {/* 4. How It Works (5 Steps Timeline) */}
          <HowItWorksSection />

          {/* 5. Student Levels (3 Interactive Cards) */}
          <StudentLevelsSection
            currentLevel={educationLevel}
            setEducationLevel={setEducationLevel}
            onOpenKnowYou={() => setIsKnowYouOpen(true)}
            onOpenAuth={handleOpenRegister}
          />

          {/* 6. Career Timeline Section */}
          <CareerTimelineSection />

          {/* 7. Career Simulation Widget */}
          <CareerSimulationSection />

          {/* 8. Testimonials Section */}
          <TestimonialsSection />

          {/* 9. CTA Section */}
          <CTASection
            onOpenKnowYou={() => setIsKnowYouOpen(true)}
            onOpenAuth={handleOpenRegister}
            onViewDemo={handleViewDemo}
          />

          {/* 10. Minimal Footer */}
          <Footer />
        </main>
      ) : (
        <div className="flex-1">
          {/* Personal Student Workspace */}
          <PersonalWorkspace
            profile={studentProfile}
            careerDna={careerDna}
            setProfile={setStudentProfile}
            setCareerDna={setCareerDna}
            onOpenKnowYou={() => setIsKnowYouOpen(true)}
          />
        </div>
      )}

      {/* Onboarding Modal ("Let's Know You") */}
      <KnowYouModal
        isOpen={isKnowYouOpen}
        onClose={() => setIsKnowYouOpen(false)}
        educationLevel={educationLevel}
        setEducationLevel={setEducationLevel}
        onComplete={handleKnowYouComplete}
      />

      {/* Authentication Modal (Login / Register / Forgot / Reset) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(email) => {
          setIsAuthOpen(false);
          // Auto launch onboarding / level selection for authenticated student
          setIsKnowYouOpen(true);
        }}
      />

    </div>
  );
}

