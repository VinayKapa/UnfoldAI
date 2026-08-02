import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
];

// Dictionary translations for core keys
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // English (default)
  en: {
    'nav.features': 'Features',
    'nav.howitworks': 'How it Works',
    'nav.about': 'About',
    'nav.login': 'Login',
    'nav.backToHome': 'Back to Home',
    'hero.badge': 'The AI Trajectory Platform for Students',
    'hero.title1': 'Your Personal AI',
    'hero.title2': 'Career Operating System',
    'hero.subtitle': 'Discover your strengths, simulate career futures, and build step-by-step roadmaps tailored for School, 11-12th, and College students.',
    'hero.getStarted': 'Get Started',
    'cta.title': 'Ready to Shape Your Future with AI?',
    'cta.subtitle': 'Join thousands of students who have discovered their true potential and mapped out clear, actionable career paths with Unfold AI.',
    'cta.getStartedFree': 'Get Started Free',
    'footer.rights': 'All rights reserved. Empowering students worldwide with AI career trajectory intelligence.',
    'levels.title': 'Tailored Triggers for Every Student Phase',
    'levels.subtitle': 'Select your current academic stage to experience specialized AI career trajectory engines.',
    'levels.school': 'School Students',
    'levels.inter': '11th - 12th Students',
    'levels.grad': 'Graduation & College',
    'auth.welcome': 'Welcome Back',
    'auth.createAccount': 'Create Your Account',
    'auth.continueGoogle': 'Sign in with Google',
    'auth.emailAddress': 'Email Address',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
  },
  // Hindi
  hi: {
    'nav.features': 'विशेषताएं',
    'nav.howitworks': 'यह कैसे काम करता है',
    'nav.about': 'हमारे बारे में',
    'nav.login': 'लॉग इन करें',
    'nav.backToHome': 'होम पर वापस जाएं',
    'hero.badge': 'छात्रों के लिए AI करियर प्लेटफॉर्म',
    'hero.title1': 'आपका व्यक्तिगत AI',
    'hero.title2': 'करियर ऑपरेटिंग सिस्टम',
    'hero.subtitle': 'अपनी ताकत खोजें, करियर के भविष्य का अनुकरण करें और स्कूल, 11वीं-12वीं और कॉलेज के छात्रों के लिए अनुकूलित रोडमैप बनाएं।',
    'hero.getStarted': 'शुरू करें',
    'cta.title': 'AI के साथ अपना भविष्य बनाने के लिए तैयार हैं?',
    'cta.subtitle': 'हजारों ऐसे छात्रों से जुड़ें जिन्होंने अपनी वास्तविक क्षमता की खोज की है और अनफोल्ड AI के साथ स्पष्ट करियर मार्ग तैयार किया है।',
    'cta.getStartedFree': 'मुफ्त में शुरू करें',
    'footer.rights': 'सर्वाधिकार सुरक्षित। अनफोल्ड AI करियर प्लेटफॉर्म।',
    'levels.title': 'प्रत्येक छात्र चरण के लिए अनुकूलित मार्गदर्शन',
    'levels.subtitle': 'विशेष AI करियर गाइडेंस का अनुभव करने के लिए अपना वर्तमान शैक्षणिक स्तर चुनें।',
    'levels.school': 'स्कूली छात्र (कक्षा 6-10)',
    'levels.inter': '11वीं - 12वीं के छात्र',
    'levels.grad': 'कॉलेज और स्नातक',
    'auth.welcome': 'वापसी पर आपका स्वागत है',
    'auth.createAccount': 'अपना खाता बनाएं',
    'auth.continueGoogle': 'Google के साथ साइन इन करें',
    'auth.emailAddress': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूरा नाम',
  },
  // Telugu
  te: {
    'nav.features': 'లక్షణాలు',
    'nav.howitworks': 'ఇది ఎలా పనిచేస్తుంది',
    'nav.about': 'మా గురించి',
    'nav.login': 'లాగిన్',
    'nav.backToHome': 'హోమ్‌కి తిరిగి వెళ్ళు',
    'hero.badge': 'విద్యార్థుల కోసం AI కెరీర్ ప్లాట్‌ఫాం',
    'hero.title1': 'మీ వ్యక్తిగత AI',
    'hero.title2': 'కెరీర్ ఆపరేటింగ్ సిస్టమ్',
    'hero.subtitle': 'మీ సామర్థ్యాలను కనుగొనండి, కెరీర్ భవిష్యత్తును అంచనా వేయండి మరియు పాఠశాల, 11-12 మరియు కాలేజీ విద్యార్థుల కోసం రోడ్‌మ్యాప్ రూపొందించండి.',
    'hero.getStarted': 'ప్రారంభించండి',
    'cta.title': 'AI తో మీ భవిష్యత్తును తీర్చిదిద్దడానికి సిద్ధంగా ఉన్నారా?',
    'cta.subtitle': 'Unfold AI ద్వారా తమ నిజమైన నైపుణ్యాలను కనుగొని స్పష్టమైన కెరీర్ మార్గాలను ఏర్పరచుకున్న వేలాది మంది విద్యార్థులతో చేరండి.',
    'cta.getStartedFree': 'ఉచితంగా ప్రారంభించండి',
    'footer.rights': 'అన్ని హక్కులూ ప్రత్యేకించబడ్డాయి.',
    'levels.title': 'ప్రతి విద్యార్థి దశకు ప్రత్యేక గైడెన్స్',
    'levels.subtitle': 'మీ ప్రస్తుత విద్యా దశను ఎంచుకొని AI కెరీర్ మార్గాన్ని అనుభవించండి.',
    'levels.school': 'స్కూల్ విద్యార్థులు',
    'levels.inter': '11 - 12 తరగతి',
    'levels.grad': 'డిగ్రీ & కాలేజీ',
    'auth.welcome': 'స్వాగతం',
    'auth.createAccount': 'ఖాతాను సృష్టించండి',
    'auth.continueGoogle': 'Google తో సైన్ ఇన్ చేయండి',
    'auth.emailAddress': 'ఈమెయిల్ చిరునామా',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.fullName': 'పూర్తి పేరు',
  },
  // Tamil
  ta: {
    'nav.features': 'அம்சங்கள்',
    'nav.howitworks': 'இது எவ்வாறு செயல்படுகிறது',
    'nav.about': 'பற்றி',
    'nav.login': 'உள்நுழைக',
    'nav.backToHome': 'முகப்பிற்குத் திரும்பு',
    'hero.badge': 'மாணவர்களுக்கான AI தொழில் இயங்குதளம்',
    'hero.title1': 'உங்கள் தனிப்பட்ட AI',
    'hero.title2': 'கேரியர் இயக்க முறைமை',
    'hero.subtitle': 'உங்கள் திறமைகளைக் கண்டறியவும், தொழில் எதிர்காலத்தை உருவகப்படுத்தவும், தெளிவான வழிகாட்டியை உருவாக்கவும்.',
    'hero.getStarted': 'தொடங்கவும்',
    'cta.title': 'AI உடன் உங்கள் எதிர்காலத்தை உருவாக்க தயாரா?',
    'cta.subtitle': 'Unfold AI மூலம் தெளிவான தொழில் பாதைகளை அமைத்துள்ள ஆயிரக்கணக்கான மாணவர்களுடன் இணையுங்கள்.',
    'cta.getStartedFree': 'இலவசமாகத் தொடங்குங்கள்',
    'footer.rights': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'levels.title': 'ஒவ்வொரு மாணவர் நிலைக்கும் பிரத்யேக வழிகாட்டல்',
    'levels.subtitle': 'உங்கள் தற்போதைய கல்வி நிலையைத் தேர்ந்தெடுங்கள்.',
    'levels.school': 'பள்ளி மாணவர்கள்',
    'levels.inter': '11 - 12 வகுப்புகள்',
    'levels.grad': 'கல்லூரி & பட்டப்படிப்பு',
    'auth.welcome': 'நல்வரவு',
    'auth.createAccount': 'கணக்கை உருவாக்கவும்',
    'auth.continueGoogle': 'Google மூலம் உள்நுழைக',
    'auth.emailAddress': 'மின்னஞ்சல் முகவரி',
    'auth.password': 'கடவுச்சொல்',
    'auth.fullName': 'முழு பெயர்',
  },
  // Spanish
  es: {
    'nav.features': 'Características',
    'nav.howitworks': 'Cómo Funciona',
    'nav.about': 'Acerca de',
    'nav.login': 'Iniciar Sesión',
    'nav.backToHome': 'Volver al Inicio',
    'hero.badge': 'La plataforma AI para la trayectoria de los estudiantes',
    'hero.title1': 'Tu AI Personal',
    'hero.title2': 'Sistema Operativo de Carrera',
    'hero.subtitle': 'Descubre tus fortalezas, simula futuros profesionales y crea rutas paso a paso adaptadas para estudiantes de escuela, secundaria y universidad.',
    'hero.getStarted': 'Comenzar',
    'cta.title': '¿Listo para diseñar tu futuro con AI?',
    'cta.subtitle': 'Únete a miles de estudiantes que han descubierto su verdadero potencial con Unfold AI.',
    'cta.getStartedFree': 'Comenzar Gratis',
    'footer.rights': 'Todos los derechos reservados.',
    'levels.title': 'Guía personalizada para cada etapa estudiantil',
    'levels.subtitle': 'Selecciona tu nivel académico actual.',
    'levels.school': 'Estudiantes de Primaria/Secundaria',
    'levels.inter': 'Bachillerato / 11º-12º',
    'levels.grad': 'Universidad y Posgrado',
    'auth.welcome': 'Bienvenido de nuevo',
    'auth.createAccount': 'Crea tu Cuenta',
    'auth.continueGoogle': 'Continuar con Google',
    'auth.emailAddress': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.fullName': 'Nombre Completo',
  },
  // French
  fr: {
    'nav.features': 'Fonctionnalités',
    'nav.howitworks': 'Comment ça marche',
    'nav.about': 'À propos',
    'nav.login': 'Connexion',
    'nav.backToHome': 'Retour à l’accueil',
    'hero.badge': 'La plateforme IA d’orientation pour étudiants',
    'hero.title1': 'Votre IA Personnelle',
    'hero.title2': 'Système d’Orientation Professionnelle',
    'hero.subtitle': 'Découvrez vos forces, simulez vos carrières futures et créez des feuilles de route adaptées.',
    'hero.getStarted': 'Commencer',
    'cta.title': 'Prêt à façonner votre avenir avec l’IA ?',
    'cta.subtitle': 'Rejoignez des milliers d’étudiants qui ont tracé leur parcours avec Unfold AI.',
    'cta.getStartedFree': 'Commencer Gratuitement',
    'footer.rights': 'Tous droits réservés.',
    'levels.title': 'Accompagnement sur mesure pour chaque niveau',
    'levels.subtitle': 'Sélectionnez votre niveau d’études actuel.',
    'levels.school': 'Collège',
    'levels.inter': 'Lycée (11e - 12e)',
    'levels.grad': 'Université & Enseignement Supérieur',
    'auth.welcome': 'Bon retour parmi nous',
    'auth.createAccount': 'Créer votre compte',
    'auth.continueGoogle': 'Se connecter avec Google',
    'auth.emailAddress': 'Adresse e-mail',
    'auth.password': 'Mot de passe',
    'auth.fullName': 'Nom complet',
  },
  // German
  de: {
    'nav.features': 'Funktionen',
    'nav.howitworks': 'So funktioniert es',
    'nav.about': 'Über uns',
    'nav.login': 'Anmelden',
    'nav.backToHome': 'Zurück zur Startseite',
    'hero.badge': 'Die KI-Karriereplattform für Schüler und Studenten',
    'hero.title1': 'Ihre persönliche KI',
    'hero.title2': 'Karriere-Betriebssystem',
    'hero.subtitle': 'Entdecken Sie Ihre Stärken und erstellen Sie Schritt-für-Schritt-Karriere-Roadmaps.',
    'hero.getStarted': 'Jetzt starten',
    'cta.title': 'Bereit, Ihre Zukunft mit KI zu gestalten?',
    'cta.subtitle': 'Schließen Sie sich Tausenden von Schülern an, die mit Unfold AI ihren Weg gefunden haben.',
    'cta.getStartedFree': 'Kostenlos starten',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'levels.title': 'Maßgeschneiderte Pfade für jede Bildungsstufe',
    'levels.subtitle': 'Wählen Sie Ihren aktuellen Bildungsstand.',
    'levels.school': 'Schule',
    'levels.inter': 'Oberstufe / 11.-12. Klasse',
    'levels.grad': 'Studium & Universität',
    'auth.welcome': 'Willkommen zurück',
    'auth.createAccount': 'Konto erstellen',
    'auth.continueGoogle': 'Mit Google anmelden',
    'auth.emailAddress': 'E-Mail-Adresse',
    'auth.password': 'Passwort',
    'auth.fullName': 'Vollständiger Name',
  },
  // Mandarin Chinese
  zh: {
    'nav.features': '功能特点',
    'nav.howitworks': '运作原理',
    'nav.about': '关于我们',
    'nav.login': '登录',
    'nav.backToHome': '返回首页',
    'hero.badge': '面向学生的 AI 职业发展平台',
    'hero.title1': '您的专属 AI',
    'hero.title2': '职业发展操作系统',
    'hero.subtitle': '发掘您的优势，模拟未来职业走向，并制定个性化发展路线图。',
    'hero.getStarted': '立即开始',
    'cta.title': '准备好用 AI 塑造您的未来了吗？',
    'cta.subtitle': '与数万名通过 Unfold AI 规划清晰职业规划的学生一起开启未来之旅。',
    'cta.getStartedFree': '免费开始使用',
    'footer.rights': '保留所有权利。',
    'levels.title': '为每个学习阶段量身定制的指导',
    'levels.subtitle': '选择您当前的学业阶段以体验 AI 职业规划引擎。',
    'levels.school': '中小学生',
    'levels.inter': '高中 (11-12年级)',
    'levels.grad': '大学及高等教育',
    'auth.welcome': '欢迎回来',
    'auth.createAccount': '创建您的账户',
    'auth.continueGoogle': '使用 Google 账号登录',
    'auth.emailAddress': '电子邮件地址',
    'auth.password': '密码',
    'auth.fullName': '全名',
  },
  // Japanese
  ja: {
    'nav.features': '機能一覧',
    'nav.howitworks': '使い方',
    'nav.about': '概要',
    'nav.login': 'ログイン',
    'nav.backToHome': 'ホームに戻る',
    'hero.badge': '学生のためのAIキャリアプラットフォーム',
    'hero.title1': 'あなた専属のAI',
    'hero.title2': 'キャリアオペレーティングシステム',
    'hero.subtitle': '自分の強みを発見し、将来のキャリアをシミュレーションして、ステップバイステップのロードマップを作成します。',
    'hero.getStarted': '今すぐ始める',
    'cta.title': 'AIで理想の未来を描きましょう',
    'cta.subtitle': 'Unfold AIでキャリアの道筋を見つけた何千人もの学生の仲間入りをしましょう。',
    'cta.getStartedFree': '無料で始める',
    'footer.rights': 'All rights reserved.',
    'levels.title': '学年・フェーズごとの最適な学習・キャリアプラン',
    'levels.subtitle': '現在の学年またはレベルを選択してください。',
    'levels.school': '小・中学生',
    'levels.inter': '高校生 (11〜12年生)',
    'levels.grad': '大学生・大学院生',
    'auth.welcome': 'おかえりなさい',
    'auth.createAccount': 'アカウント作成',
    'auth.continueGoogle': 'Googleでサインイン',
    'auth.emailAddress': 'メールアドレス',
    'auth.password': 'パスワード',
    'auth.fullName': '氏名',
  },
  // Arabic
  ar: {
    'nav.features': 'المميزات',
    'nav.howitworks': 'كيف يعمل',
    'nav.about': 'عن المنصة',
    'nav.login': 'تسجيل الدخول',
    'nav.backToHome': 'العودة للرئيسية',
    'hero.badge': 'منصة الذكاء الاصطناعي لتوجيه الطلاب المهني',
    'hero.title1': 'ذكاؤك الاصطناعي الشخصي',
    'hero.title2': 'نظام التشغيل المهني',
    'hero.subtitle': 'اكتشف نقاط قوتك وشكّل خطتك المستقبلية للذكاء الاصطناعي.',
    'hero.getStarted': 'ابدأ الآن',
    'cta.title': 'هل أنت مستعد لبناء مستقبلك بالذكاء الاصطناعي؟',
    'cta.subtitle': 'انضم إلى آلاف الطلاب الذين اكتشفوا إمكانياتهم الحقيقية مع Unfold AI.',
    'cta.getStartedFree': 'ابدأ مجاناً',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'levels.title': 'توجيه مخصص لكل مرحلة دراسية',
    'levels.subtitle': 'اختر مرحلتك الدراسية الحالية.',
    'levels.school': 'طلاب المدارس',
    'levels.inter': 'الطلاب الثانويون (11-12)',
    'levels.grad': 'الطلاب الجامعيون',
    'auth.welcome': 'مرحباً بعودتك',
    'auth.createAccount': 'إنشاء حساب جديد',
    'auth.continueGoogle': 'متابعة باستخدام Google',
    'auth.emailAddress': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.fullName': 'الاسم الكامل',
  },
};

const GOOGLE_LANG_MAP: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  te: 'te',
  ta: 'ta',
  bn: 'bn',
  mr: 'mr',
  gu: 'gu',
  kn: 'kn',
  ml: 'ml',
  es: 'es',
  fr: 'fr',
  de: 'de',
  zh: 'zh-CN',
  ja: 'ja',
  ko: 'ko',
  ar: 'ar',
  pt: 'pt',
  ru: 'ru',
  it: 'it',
  tr: 'tr',
  vi: 'vi',
};

const REVERSE_GOOGLE_LANG_MAP: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  te: 'te',
  ta: 'ta',
  bn: 'bn',
  mr: 'mr',
  gu: 'gu',
  kn: 'kn',
  ml: 'ml',
  es: 'es',
  fr: 'fr',
  de: 'de',
  'zh-CN': 'zh',
  zh: 'zh',
  ja: 'ja',
  ko: 'ko',
  ar: 'ar',
  pt: 'pt',
  ru: 'ru',
  it: 'it',
  tr: 'tr',
  vi: 'vi',
};

const detectActiveGoogleLanguage = (): string | null => {
  if (typeof document === 'undefined') return null;

  // 1. Check Google Translate combobox if present
  const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (selectEl && selectEl.value) {
    const code = REVERSE_GOOGLE_LANG_MAP[selectEl.value] || selectEl.value;
    if (code) return code;
  }

  // 2. Check googtrans cookie
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  if (match && match[1]) {
    const parts = match[1].split('/');
    const rawCode = parts[parts.length - 1];
    if (rawCode) {
      const code = REVERSE_GOOGLE_LANG_MAP[rawCode] || rawCode;
      if (code) return code;
    }
  }

  return null;
};

const applyPageTranslation = (langCode: string): boolean => {
  const googleCode = GOOGLE_LANG_MAP[langCode] || langCode;
  const host = typeof window !== 'undefined' ? window.location.hostname : '';

  if (langCode === 'en') {
    // Clear Google Translate cookies completely to restore pure English
    const domains = ['', host, '.' + host, window.location.host];
    domains.forEach((d) => {
      const domainAttr = d ? `; domain=${d}` : '';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainAttr}`;
      document.cookie = `googtrans=/en/en; path=/${domainAttr}`;
    });
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  } else {
    // Set cookies for Google Translate widget
    const domains = ['', host, '.' + host];
    domains.forEach((d) => {
      const domainAttr = d ? `; domain=${d}` : '';
      document.cookie = `googtrans=/en/${googleCode}; path=/${domainAttr}`;
    });
    document.documentElement.lang = googleCode;
    if (langCode === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }

  // Dispatch change event to google translate combobox
  const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (selectEl) {
    let targetVal = googleCode;
    if (langCode === 'en') {
      const hasEnOption = Array.from(selectEl.options).some((opt) => opt.value === 'en');
      targetVal = hasEnOption ? 'en' : '';
    }

    if (selectEl.value !== targetVal) {
      selectEl.value = targetVal;
      selectEl.dispatchEvent(new Event('change'));
    }
    return true; // Applied successfully
  }
  return false; // Widget combo not loaded yet
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguageByCode: (code: string) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Priority: User's explicitly saved language in localStorage, defaulting strictly to English ('en')
    const saved = localStorage.getItem('unfold_app_language');
    if (saved) {
      const found = SUPPORTED_LANGUAGES.find((l) => l.code === saved);
      if (found) return found;
    }

    return SUPPORTED_LANGUAGES[0]; // English default
  });

  // Sync Google Translate with current language state
  useEffect(() => {
    applyPageTranslation(currentLanguage.code);

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const success = applyPageTranslation(currentLanguage.code);
      if (success || attempts >= 8) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [currentLanguage.code]);

  const setLanguageByCode = (code: string) => {
    const target = SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];

    setCurrentLanguage(target);
    localStorage.setItem('unfold_app_language', target.code);
    applyPageTranslation(target.code);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[currentLanguage.code];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguageByCode, t }}>
      <div lang={currentLanguage.code} className={currentLanguage.code === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
