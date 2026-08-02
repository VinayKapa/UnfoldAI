import React, { useState, useEffect, useRef } from 'react';
import { Dna, Moon, Sun, User, Globe, ChevronDown, Check, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { EducationLevel } from '../types';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
  onOpenKnowYou: () => void;
  onOpenAuth: () => void;
  onViewDemo: () => void;
  currentView: 'landing' | 'workspace';
  setCurrentView: (view: 'landing' | 'workspace') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  educationLevel,
  setEducationLevel,
  onOpenKnowYou,
  onOpenAuth,
  onViewDemo,
  currentView,
  setCurrentView,
}) => {
  const { currentLanguage, setLanguageByCode, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    const q = langSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const { user, userProfile, logoutUser } = useAuth();

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm'
        : 'bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm border-b border-slate-100 dark:border-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="flex items-center gap-2.5 cursor-pointer group"
          id="brand-logo"
        >
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Dna className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 notranslate" translate="no">
            Unfold <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 font-mono font-semibold">AI</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          
          {/* Features Direct Nav Link */}
          <button 
            onClick={() => scrollTo('features-section')}
            className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            id="nav-features-btn"
          >
            {t('nav.features', 'Features')}
          </button>

          {/* How It Works Nav Link */}
          <button 
            onClick={() => scrollTo('how-it-works-section')}
            className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            id="nav-howitworks-btn"
          >
            {t('nav.howitworks', 'How it Works')}
          </button>

          {/* About / Student Scope Link */}
          <button 
            onClick={() => scrollTo('levels-section')}
            className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            id="nav-about-btn"
          >
            {t('nav.about', 'About')}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* LANGUAGE SELECTOR DROPDOWN */}
          <div className="relative notranslate" translate="no" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setLangSearch('');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-100 text-xs font-semibold transition-all shadow-2xs group"
              id="language-selector-btn"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:rotate-12 transition-transform" />
              <span className="font-semibold text-xs tracking-tight text-slate-800 dark:text-slate-100">
                {currentLanguage.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Selection Popover */}
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2.5 space-y-2.5">
                {/* Header */}
                <div className="px-2 pt-1 pb-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Select App Language</span>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950">
                    {SUPPORTED_LANGUAGES.length} Available
                  </span>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Search languages..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    autoFocus
                  />
                </div>

                {/* Language List */}
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => {
                      const isSelected = currentLanguage.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguageByCode(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base shrink-0">{lang.flag}</span>
                            <div className="truncate flex items-center gap-1.5">
                              <span className="text-xs font-semibold">{lang.name}</span>
                              {lang.nativeName !== lang.name && (
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                                  ({lang.nativeName})
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No matching language found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title={darkMode ? "Dark Mode Active" : "Light Mode Active"}
            id="theme-toggle-btn"
          >
            {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Auth State or Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              {currentView === 'landing' ? (
                <button
                  onClick={() => setCurrentView('workspace')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-semibold transition-all border border-indigo-200 dark:border-indigo-800"
                  id="nav-workspace-btn"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Workspace</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('landing')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                  id="back-to-landing-btn"
                >
                  {t('nav.backToHome', 'Back to Home')}
                </button>
              )}

              {/* User badge & logout */}
              <div className="flex items-center gap-1.5 pl-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate max-w-[100px]" title={userProfile?.name || user.email || ''}>
                    {userProfile?.name || user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={() => logoutUser()}
                  className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                  title="Sign Out"
                  id="logout-nav-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            currentView === 'landing' ? (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-sm transition-all transform active:scale-95"
                id="login-nav-btn"
              >
                <User className="w-3.5 h-3.5 text-white" />
                <span>{t('nav.login', 'Login')}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('landing')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                id="back-to-landing-btn"
              >
                {t('nav.backToHome', 'Back to Home')}
              </button>
            )
          )}

        </div>

      </div>
    </header>
  );
};
