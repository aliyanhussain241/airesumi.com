// i18n setup for airesumi — English only. Multi-language support removed.
// The i18next runtime is kept so existing `t(...)` calls continue to work.

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type LangCode =
  | "en" | "es" | "fr" | "de" | "pt" | "ar" | "hi" | "zh" | "ja" | "ru";

export const LANGUAGES: { code: LangCode; native: string; english: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", native: "English",   english: "English",             dir: "ltr" },
  { code: "es", native: "Español",   english: "Spanish",             dir: "ltr" },
  { code: "fr", native: "Français",  english: "French",              dir: "ltr" },
  { code: "de", native: "Deutsch",   english: "German",              dir: "ltr" },
  { code: "pt", native: "Português", english: "Portuguese",          dir: "ltr" },
  { code: "ar", native: "العربية",   english: "Arabic",              dir: "rtl" },
  { code: "hi", native: "हिन्दी",      english: "Hindi",               dir: "ltr" },
  { code: "zh", native: "中文",       english: "Chinese (Simplified)", dir: "ltr" },
  { code: "ja", native: "日本語",      english: "Japanese",            dir: "ltr" },
  { code: "ru", native: "Русский",   english: "Russian",             dir: "ltr" },
];

export const LANG_ENGLISH_NAME: Record<LangCode, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l.english])
) as Record<LangCode, string>;

// Translation resources. English is the source; other languages override.
const resources = {
  en: { common: {
    nav: { home: "Home", resumeTools: "Resume Tools", otherTools: "Other Tools", examples: "Examples", blog: "Blog" },
    cta: { login: "Login", loginSignup: "Login / Sign Up", logout: "Logout", myResumes: "My Resumes", buildResume: "Build My Resume →", start: "Start →", startFree: "Start Free →", startFreeShort: "Start Free", buildResumeFree: "Build My Resume Free →", startFreeArrow: "Start free →", explore: "Explore →" },
    dropdown: { resumeToolsLabel: "Resume Tools", otherToolsLabel: "Other Tools", resumeToolsCount: "{{count}} resume tools", otherToolsCount: "{{count}} other tools" },
    tools: {
      resumeBuilder:   { name: "AI Resume Builder",    desc: "ATS-optimized resume in minutes" },
      bulletWriter:    { name: "Resume Bullet Writer", desc: "Stronger bullet points instantly" },
      summary:         { name: "Resume Summary",       desc: "Generate a compelling summary" },
      keywordScanner:  { name: "Keyword Scanner",      desc: "Match keywords to job posting" },
      coverLetter:     { name: "Cover Letter",         desc: "Tailored cover letters" },
      linkedinBio:     { name: "LinkedIn Bio",         desc: "Profile generator" },
      atsChecker:      { name: "ATS Checker",          desc: "Score your resume" },
      interviewPrep:   { name: "Interview Prep",       desc: "Practice questions" },
      resignation:     { name: "Resignation Letter",   desc: "Leave on good terms" },
      pdfScanner:      { name: "PDF Scanner",          desc: "Scan documents to PDF" },
      jobSearch:       { name: "Job Search",           desc: "Salary & market insights" },
    },
    footer: {
      tagline: "The fastest, most effective way to secure your next role. Built with top recruiters and AI.",
      resumeTools: "Resume Tools", otherTools: "Other Tools", resources: "Resources", company: "Company",
      pro: "Airesumi Pro", careerBlog: "Career Blog", resumeExamples: "Resume Examples",
      interviewQuestions: "Interview Questions", salaryAnalyzer: "Salary Analyzer",
      about: "About Us", contact: "Contact", privacy: "Privacy Policy", terms: "Terms of Service",
      privacyShort: "Privacy", termsShort: "Terms",
      copyright: "© {{year}} airesumi. All rights reserved.",
    },
    language: { switch: "Language", select: "Select language" },
    theme: { toggle: "Toggle dark mode" },
  }},

  es: { common: {
    nav: { home: "Inicio", resumeTools: "Herramientas de CV", otherTools: "Otras herramientas", examples: "Ejemplos", blog: "Blog" },
    cta: { login: "Iniciar sesión", loginSignup: "Iniciar sesión / Registrarse", logout: "Cerrar sesión", myResumes: "Mis CV", buildResume: "Crear mi CV →", start: "Empezar →", startFree: "Empezar gratis →", startFreeShort: "Empezar gratis", buildResumeFree: "Crear mi CV gratis →", startFreeArrow: "Empezar gratis →", explore: "Explorar →" },
    dropdown: { resumeToolsLabel: "Herramientas de CV", otherToolsLabel: "Otras herramientas", resumeToolsCount: "{{count}} herramientas de CV", otherToolsCount: "{{count}} otras herramientas" },
    tools: {
      resumeBuilder:   { name: "Creador de CV con IA",    desc: "CV optimizado para ATS en minutos" },
      bulletWriter:    { name: "Escritor de viñetas",     desc: "Viñetas más sólidas al instante" },
      summary:         { name: "Resumen de CV",           desc: "Genera un resumen convincente" },
      keywordScanner:  { name: "Escáner de palabras clave", desc: "Empareja palabras clave con la oferta" },
      coverLetter:     { name: "Carta de presentación",   desc: "Cartas personalizadas" },
      linkedinBio:     { name: "Bio de LinkedIn",         desc: "Generador de perfiles" },
      atsChecker:      { name: "Verificador ATS",         desc: "Puntúa tu CV" },
      interviewPrep:   { name: "Preparación entrevista",  desc: "Practica preguntas" },
      resignation:     { name: "Carta de renuncia",       desc: "Despídete en buenos términos" },
      pdfScanner:      { name: "Escáner PDF",             desc: "Escanea documentos a PDF" },
      jobSearch:       { name: "Búsqueda de empleo",      desc: "Salarios e información del mercado" },
    },
    footer: {
      tagline: "La forma más rápida y eficaz de conseguir tu próximo empleo. Hecho con reclutadores e IA.",
      resumeTools: "Herramientas de CV", otherTools: "Otras herramientas", resources: "Recursos", company: "Empresa",
      pro: "Airesumi Pro", careerBlog: "Blog de carrera", resumeExamples: "Ejemplos de CV",
      interviewQuestions: "Preguntas de entrevista", salaryAnalyzer: "Analizador de salario",
      about: "Sobre nosotros", contact: "Contacto", privacy: "Política de privacidad", terms: "Términos del servicio",
      privacyShort: "Privacidad", termsShort: "Términos",
      copyright: "© {{year}} airesumi. Todos los derechos reservados.",
    },
    language: { switch: "Idioma", select: "Seleccionar idioma" },
    theme: { toggle: "Alternar modo oscuro" },
  }},

  fr: { common: {
    nav: { home: "Accueil", resumeTools: "Outils CV", otherTools: "Autres outils", examples: "Exemples", blog: "Blog" },
    cta: { login: "Connexion", loginSignup: "Connexion / Inscription", logout: "Déconnexion", myResumes: "Mes CV", buildResume: "Créer mon CV →", start: "Démarrer →", startFree: "Démarrer gratuit →", startFreeShort: "Démarrer gratuit", buildResumeFree: "Créer mon CV gratuitement →", startFreeArrow: "Démarrer gratuit →", explore: "Explorer →" },
    dropdown: { resumeToolsLabel: "Outils CV", otherToolsLabel: "Autres outils", resumeToolsCount: "{{count}} outils CV", otherToolsCount: "{{count}} autres outils" },
    tools: {
      resumeBuilder:   { name: "Générateur de CV IA",      desc: "CV optimisé ATS en quelques minutes" },
      bulletWriter:    { name: "Rédacteur de puces",       desc: "Des puces plus percutantes" },
      summary:         { name: "Résumé de CV",             desc: "Générer un résumé percutant" },
      keywordScanner:  { name: "Scanner de mots-clés",     desc: "Faire correspondre les mots-clés" },
      coverLetter:     { name: "Lettre de motivation",     desc: "Lettres personnalisées" },
      linkedinBio:     { name: "Bio LinkedIn",             desc: "Générateur de profil" },
      atsChecker:      { name: "Vérificateur ATS",         desc: "Notez votre CV" },
      interviewPrep:   { name: "Préparation entretien",    desc: "Questions d'entraînement" },
      resignation:     { name: "Lettre de démission",      desc: "Partir en bons termes" },
      pdfScanner:      { name: "Scanner PDF",              desc: "Scanner des documents en PDF" },
      jobSearch:       { name: "Recherche d'emploi",       desc: "Salaires et tendances du marché" },
    },
    footer: {
      tagline: "Le moyen le plus rapide et efficace de décrocher votre prochain emploi.",
      resumeTools: "Outils CV", otherTools: "Autres outils", resources: "Ressources", company: "Entreprise",
      pro: "Airesumi Pro", careerBlog: "Blog Carrière", resumeExamples: "Exemples de CV",
      interviewQuestions: "Questions d'entretien", salaryAnalyzer: "Analyseur de salaire",
      about: "À propos", contact: "Contact", privacy: "Politique de confidentialité", terms: "Conditions d'utilisation",
      privacyShort: "Confidentialité", termsShort: "Conditions",
      copyright: "© {{year}} airesumi. Tous droits réservés.",
    },
    language: { switch: "Langue", select: "Choisir la langue" },
    theme: { toggle: "Activer le mode sombre" },
  }},

  de: { common: {
    nav: { home: "Startseite", resumeTools: "Lebenslauf-Tools", otherTools: "Weitere Tools", examples: "Beispiele", blog: "Blog" },
    cta: { login: "Anmelden", loginSignup: "Anmelden / Registrieren", logout: "Abmelden", myResumes: "Meine Lebensläufe", buildResume: "Lebenslauf erstellen →", start: "Starten →", startFree: "Gratis starten →", startFreeShort: "Gratis starten", buildResumeFree: "Lebenslauf kostenlos erstellen →", startFreeArrow: "Gratis starten →", explore: "Entdecken →" },
    dropdown: { resumeToolsLabel: "Lebenslauf-Tools", otherToolsLabel: "Weitere Tools", resumeToolsCount: "{{count}} Lebenslauf-Tools", otherToolsCount: "{{count}} weitere Tools" },
    tools: {
      resumeBuilder:   { name: "KI-Lebenslauf-Generator", desc: "ATS-optimierter Lebenslauf in Minuten" },
      bulletWriter:    { name: "Stichpunkt-Schreiber",    desc: "Stärkere Stichpunkte sofort" },
      summary:         { name: "Lebenslauf-Zusammenfassung", desc: "Überzeugende Zusammenfassung erstellen" },
      keywordScanner:  { name: "Keyword-Scanner",         desc: "Schlüsselwörter abgleichen" },
      coverLetter:     { name: "Anschreiben",             desc: "Maßgeschneiderte Anschreiben" },
      linkedinBio:     { name: "LinkedIn-Bio",            desc: "Profil-Generator" },
      atsChecker:      { name: "ATS-Checker",             desc: "Lebenslauf bewerten" },
      interviewPrep:   { name: "Interview-Vorbereitung",  desc: "Übungsfragen" },
      resignation:     { name: "Kündigungsschreiben",     desc: "Im Guten gehen" },
      pdfScanner:      { name: "PDF-Scanner",             desc: "Dokumente als PDF scannen" },
      jobSearch:       { name: "Jobsuche",                desc: "Gehalt & Markttrends" },
    },
    footer: {
      tagline: "Der schnellste und effektivste Weg zu Ihrem nächsten Job. Mit Top-Recruitern und KI entwickelt.",
      resumeTools: "Lebenslauf-Tools", otherTools: "Weitere Tools", resources: "Ressourcen", company: "Unternehmen",
      pro: "Airesumi Pro", careerBlog: "Karriere-Blog", resumeExamples: "Lebenslauf-Beispiele",
      interviewQuestions: "Interviewfragen", salaryAnalyzer: "Gehaltsanalyse",
      about: "Über uns", contact: "Kontakt", privacy: "Datenschutz", terms: "Nutzungsbedingungen",
      privacyShort: "Datenschutz", termsShort: "AGB",
      copyright: "© {{year}} airesumi. Alle Rechte vorbehalten.",
    },
    language: { switch: "Sprache", select: "Sprache wählen" },
    theme: { toggle: "Dunkelmodus umschalten" },
  }},

  pt: { common: {
    nav: { home: "Início", resumeTools: "Ferramentas de Currículo", otherTools: "Outras ferramentas", examples: "Exemplos", blog: "Blog" },
    cta: { login: "Entrar", loginSignup: "Entrar / Cadastrar", logout: "Sair", myResumes: "Meus currículos", buildResume: "Criar meu currículo →", start: "Começar →", startFree: "Começar grátis →", startFreeShort: "Começar grátis", buildResumeFree: "Criar meu currículo grátis →", startFreeArrow: "Começar grátis →", explore: "Explorar →" },
    dropdown: { resumeToolsLabel: "Ferramentas de Currículo", otherToolsLabel: "Outras ferramentas", resumeToolsCount: "{{count}} ferramentas de currículo", otherToolsCount: "{{count}} outras ferramentas" },
    tools: {
      resumeBuilder:   { name: "Criador de Currículo IA", desc: "Currículo otimizado para ATS em minutos" },
      bulletWriter:    { name: "Escritor de bullets",     desc: "Bullets mais fortes instantaneamente" },
      summary:         { name: "Resumo do currículo",     desc: "Gere um resumo convincente" },
      keywordScanner:  { name: "Scanner de palavras-chave", desc: "Combine palavras-chave com a vaga" },
      coverLetter:     { name: "Carta de apresentação",   desc: "Cartas personalizadas" },
      linkedinBio:     { name: "Bio do LinkedIn",         desc: "Gerador de perfil" },
      atsChecker:      { name: "Verificador ATS",         desc: "Pontue seu currículo" },
      interviewPrep:   { name: "Preparação entrevista",   desc: "Pratique perguntas" },
      resignation:     { name: "Carta de demissão",       desc: "Saia em bons termos" },
      pdfScanner:      { name: "Scanner PDF",             desc: "Digitalize documentos para PDF" },
      jobSearch:       { name: "Busca de emprego",        desc: "Salário e mercado" },
    },
    footer: {
      tagline: "A forma mais rápida e eficaz de conquistar sua próxima vaga. Feito com recrutadores e IA.",
      resumeTools: "Ferramentas de Currículo", otherTools: "Outras ferramentas", resources: "Recursos", company: "Empresa",
      pro: "Airesumi Pro", careerBlog: "Blog de Carreira", resumeExamples: "Exemplos de currículo",
      interviewQuestions: "Perguntas de entrevista", salaryAnalyzer: "Analisador de salário",
      about: "Sobre nós", contact: "Contato", privacy: "Política de privacidade", terms: "Termos de serviço",
      privacyShort: "Privacidade", termsShort: "Termos",
      copyright: "© {{year}} airesumi. Todos os direitos reservados.",
    },
    language: { switch: "Idioma", select: "Selecionar idioma" },
    theme: { toggle: "Alternar modo escuro" },
  }},

  ar: { common: {
    nav: { home: "الرئيسية", resumeTools: "أدوات السيرة الذاتية", otherTools: "أدوات أخرى", examples: "أمثلة", blog: "المدونة" },
    cta: { login: "تسجيل الدخول", loginSignup: "تسجيل الدخول / إنشاء حساب", logout: "تسجيل الخروج", myResumes: "سيرتي الذاتية", buildResume: "أنشئ سيرتي ←", start: "ابدأ ←", startFree: "ابدأ مجانًا ←", startFreeShort: "ابدأ مجانًا", buildResumeFree: "أنشئ سيرتي مجانًا ←", startFreeArrow: "ابدأ مجانًا ←", explore: "استكشف ←" },
    dropdown: { resumeToolsLabel: "أدوات السيرة الذاتية", otherToolsLabel: "أدوات أخرى", resumeToolsCount: "{{count}} أدوات للسيرة الذاتية", otherToolsCount: "{{count}} أدوات أخرى" },
    tools: {
      resumeBuilder:   { name: "منشئ السيرة الذاتية بالذكاء الاصطناعي", desc: "سيرة محسّنة لـ ATS خلال دقائق" },
      bulletWriter:    { name: "كاتب النقاط",            desc: "نقاط أقوى فورًا" },
      summary:         { name: "ملخص السيرة الذاتية",    desc: "أنشئ ملخصًا مقنعًا" },
      keywordScanner:  { name: "ماسح الكلمات المفتاحية",  desc: "طابق الكلمات مع الوظيفة" },
      coverLetter:     { name: "خطاب التغطية",           desc: "خطابات مخصصة" },
      linkedinBio:     { name: "السيرة على LinkedIn",     desc: "منشئ الملفات الشخصية" },
      atsChecker:      { name: "مدقق ATS",               desc: "قيّم سيرتك" },
      interviewPrep:   { name: "تحضير المقابلة",         desc: "تدرب على الأسئلة" },
      resignation:     { name: "خطاب الاستقالة",         desc: "غادر بسلام" },
      pdfScanner:      { name: "ماسح PDF",               desc: "امسح المستندات إلى PDF" },
      jobSearch:       { name: "البحث عن وظيفة",         desc: "الرواتب ورؤى السوق" },
    },
    footer: {
      tagline: "أسرع وأكثر الطرق فعالية لتأمين وظيفتك التالية. مبني مع كبار المُوظِّفين والذكاء الاصطناعي.",
      resumeTools: "أدوات السيرة الذاتية", otherTools: "أدوات أخرى", resources: "موارد", company: "الشركة",
      pro: "Airesumi Pro", careerBlog: "مدونة المهن", resumeExamples: "أمثلة سيرة ذاتية",
      interviewQuestions: "أسئلة المقابلة", salaryAnalyzer: "محلل الرواتب",
      about: "من نحن", contact: "اتصل بنا", privacy: "سياسة الخصوصية", terms: "شروط الخدمة",
      privacyShort: "الخصوصية", termsShort: "الشروط",
      copyright: "© {{year}} airesumi. جميع الحقوق محفوظة.",
    },
    language: { switch: "اللغة", select: "اختر اللغة" },
    theme: { toggle: "تبديل الوضع الداكن" },
  }},

  hi: { common: {
    nav: { home: "होम", resumeTools: "रिज़्यूमे टूल्स", otherTools: "अन्य टूल्स", examples: "उदाहरण", blog: "ब्लॉग" },
    cta: { login: "लॉगिन", loginSignup: "लॉगिन / साइन अप", logout: "लॉगआउट", myResumes: "मेरे रिज़्यूमे", buildResume: "मेरा रिज़्यूमे बनाएँ →", start: "शुरू करें →", startFree: "मुफ्त शुरू करें →", startFreeShort: "मुफ्त शुरू करें", buildResumeFree: "मेरा रिज़्यूमे मुफ्त बनाएँ →", startFreeArrow: "मुफ्त शुरू करें →", explore: "एक्सप्लोर →" },
    dropdown: { resumeToolsLabel: "रिज़्यूमे टूल्स", otherToolsLabel: "अन्य टूल्स", resumeToolsCount: "{{count}} रिज़्यूमे टूल्स", otherToolsCount: "{{count}} अन्य टूल्स" },
    tools: {
      resumeBuilder:   { name: "AI रिज़्यूमे बिल्डर",     desc: "मिनटों में ATS-अनुकूलित रिज़्यूमे" },
      bulletWriter:    { name: "बुलेट राइटर",            desc: "तुरंत मज़बूत बुलेट पॉइंट्स" },
      summary:         { name: "रिज़्यूमे सारांश",         desc: "प्रभावशाली सारांश बनाएँ" },
      keywordScanner:  { name: "कीवर्ड स्कैनर",          desc: "जॉब पोस्ट से कीवर्ड मिलाएँ" },
      coverLetter:     { name: "कवर लेटर",               desc: "अनुकूलित कवर लेटर" },
      linkedinBio:     { name: "LinkedIn बायो",          desc: "प्रोफ़ाइल जेनरेटर" },
      atsChecker:      { name: "ATS चेकर",               desc: "अपने रिज़्यूमे को स्कोर करें" },
      interviewPrep:   { name: "इंटरव्यू तैयारी",          desc: "प्रश्नों का अभ्यास" },
      resignation:     { name: "इस्तीफ़ा पत्र",           desc: "अच्छे संबंधों के साथ छोड़ें" },
      pdfScanner:      { name: "PDF स्कैनर",             desc: "दस्तावेज़ों को PDF में स्कैन करें" },
      jobSearch:       { name: "नौकरी खोज",              desc: "वेतन और बाज़ार जानकारी" },
    },
    footer: {
      tagline: "अगली नौकरी पाने का सबसे तेज़ और प्रभावी तरीका। शीर्ष भर्तीकर्ताओं और AI के साथ बनाया गया।",
      resumeTools: "रिज़्यूमे टूल्स", otherTools: "अन्य टूल्स", resources: "संसाधन", company: "कंपनी",
      pro: "Airesumi Pro", careerBlog: "करियर ब्लॉग", resumeExamples: "रिज़्यूमे उदाहरण",
      interviewQuestions: "इंटरव्यू प्रश्न", salaryAnalyzer: "वेतन विश्लेषक",
      about: "हमारे बारे में", contact: "संपर्क", privacy: "गोपनीयता नीति", terms: "सेवा शर्तें",
      privacyShort: "गोपनीयता", termsShort: "शर्तें",
      copyright: "© {{year}} airesumi. सर्वाधिकार सुरक्षित।",
    },
    language: { switch: "भाषा", select: "भाषा चुनें" },
    theme: { toggle: "डार्क मोड टॉगल करें" },
  }},

  zh: { common: {
    nav: { home: "首页", resumeTools: "简历工具", otherTools: "其他工具", examples: "示例", blog: "博客" },
    cta: { login: "登录", loginSignup: "登录 / 注册", logout: "退出", myResumes: "我的简历", buildResume: "制作我的简历 →", start: "开始 →", startFree: "免费开始 →", startFreeShort: "免费开始", buildResumeFree: "免费制作我的简历 →", startFreeArrow: "免费开始 →", explore: "探索 →" },
    dropdown: { resumeToolsLabel: "简历工具", otherToolsLabel: "其他工具", resumeToolsCount: "{{count}} 个简历工具", otherToolsCount: "{{count}} 个其他工具" },
    tools: {
      resumeBuilder:   { name: "AI 简历生成器",         desc: "几分钟生成 ATS 优化简历" },
      bulletWriter:    { name: "要点撰写器",            desc: "瞬间打造更强要点" },
      summary:         { name: "简历摘要",              desc: "生成有说服力的摘要" },
      keywordScanner:  { name: "关键词扫描器",          desc: "匹配职位关键词" },
      coverLetter:     { name: "求职信",                desc: "量身定制的求职信" },
      linkedinBio:     { name: "LinkedIn 简介",         desc: "个人资料生成器" },
      atsChecker:      { name: "ATS 检查器",            desc: "为简历评分" },
      interviewPrep:   { name: "面试准备",              desc: "练习题目" },
      resignation:     { name: "辞职信",                desc: "好聚好散" },
      pdfScanner:      { name: "PDF 扫描器",            desc: "扫描文档为 PDF" },
      jobSearch:       { name: "求职",                  desc: "薪资与市场洞察" },
    },
    footer: {
      tagline: "获得下一份工作最快、最有效的方式。由顶级招聘官与 AI 共同打造。",
      resumeTools: "简历工具", otherTools: "其他工具", resources: "资源", company: "公司",
      pro: "Airesumi Pro", careerBlog: "职业博客", resumeExamples: "简历示例",
      interviewQuestions: "面试问题", salaryAnalyzer: "薪资分析",
      about: "关于我们", contact: "联系我们", privacy: "隐私政策", terms: "服务条款",
      privacyShort: "隐私", termsShort: "条款",
      copyright: "© {{year}} airesumi。保留所有权利。",
    },
    language: { switch: "语言", select: "选择语言" },
    theme: { toggle: "切换深色模式" },
  }},

  ja: { common: {
    nav: { home: "ホーム", resumeTools: "履歴書ツール", otherTools: "その他のツール", examples: "サンプル", blog: "ブログ" },
    cta: { login: "ログイン", loginSignup: "ログイン / 新規登録", logout: "ログアウト", myResumes: "マイ履歴書", buildResume: "履歴書を作成 →", start: "はじめる →", startFree: "無料で始める →", startFreeShort: "無料で始める", buildResumeFree: "無料で履歴書を作成 →", startFreeArrow: "無料で始める →", explore: "もっと見る →" },
    dropdown: { resumeToolsLabel: "履歴書ツール", otherToolsLabel: "その他のツール", resumeToolsCount: "{{count}} 履歴書ツール", otherToolsCount: "{{count}} その他のツール" },
    tools: {
      resumeBuilder:   { name: "AI 履歴書ビルダー",        desc: "数分でATS最適化履歴書" },
      bulletWriter:    { name: "箇条書きライター",         desc: "より強い箇条書きを瞬時に" },
      summary:         { name: "履歴書サマリー",           desc: "説得力のあるサマリーを生成" },
      keywordScanner:  { name: "キーワードスキャナー",     desc: "求人のキーワードと照合" },
      coverLetter:     { name: "カバーレター",             desc: "オーダーメイドのカバーレター" },
      linkedinBio:     { name: "LinkedIn 自己紹介",        desc: "プロフィール生成" },
      atsChecker:      { name: "ATS チェッカー",            desc: "履歴書をスコアリング" },
      interviewPrep:   { name: "面接対策",                 desc: "練習問題" },
      resignation:     { name: "退職届",                   desc: "円満退職" },
      pdfScanner:      { name: "PDF スキャナー",            desc: "文書を PDF にスキャン" },
      jobSearch:       { name: "求人検索",                 desc: "給与と市場動向" },
    },
    footer: {
      tagline: "次の仕事を確実に勝ち取る最速かつ最も効果的な方法。トップリクルーターとAIが共同開発。",
      resumeTools: "履歴書ツール", otherTools: "その他のツール", resources: "リソース", company: "会社",
      pro: "Airesumi Pro", careerBlog: "キャリアブログ", resumeExamples: "履歴書サンプル",
      interviewQuestions: "面接質問", salaryAnalyzer: "給与分析",
      about: "私たちについて", contact: "お問い合わせ", privacy: "プライバシーポリシー", terms: "利用規約",
      privacyShort: "プライバシー", termsShort: "規約",
      copyright: "© {{year}} airesumi. 無断複写・転載を禁じます。",
    },
    language: { switch: "言語", select: "言語を選択" },
    theme: { toggle: "ダークモード切替" },
  }},

  ru: { common: {
    nav: { home: "Главная", resumeTools: "Инструменты резюме", otherTools: "Другие инструменты", examples: "Примеры", blog: "Блог" },
    cta: { login: "Войти", loginSignup: "Войти / Регистрация", logout: "Выйти", myResumes: "Мои резюме", buildResume: "Создать резюме →", start: "Начать →", startFree: "Начать бесплатно →", startFreeShort: "Начать бесплатно", buildResumeFree: "Создать резюме бесплатно →", startFreeArrow: "Начать бесплатно →", explore: "Исследовать →" },
    dropdown: { resumeToolsLabel: "Инструменты резюме", otherToolsLabel: "Другие инструменты", resumeToolsCount: "{{count}} инструментов резюме", otherToolsCount: "{{count}} других инструментов" },
    tools: {
      resumeBuilder:   { name: "AI Конструктор резюме",   desc: "Резюме под ATS за минуты" },
      bulletWriter:    { name: "Генератор пунктов",       desc: "Сильные пункты мгновенно" },
      summary:         { name: "Резюме-саммари",          desc: "Создать убедительное саммари" },
      keywordScanner:  { name: "Сканер ключевых слов",    desc: "Сопоставление с вакансией" },
      coverLetter:     { name: "Сопроводительное письмо", desc: "Персональные письма" },
      linkedinBio:     { name: "Био LinkedIn",            desc: "Генератор профиля" },
      atsChecker:      { name: "ATS-проверка",            desc: "Оценить ваше резюме" },
      interviewPrep:   { name: "Подготовка к интервью",   desc: "Тренировочные вопросы" },
      resignation:     { name: "Заявление об увольнении", desc: "Уйти красиво" },
      pdfScanner:      { name: "PDF-сканер",              desc: "Сканировать документы в PDF" },
      jobSearch:       { name: "Поиск работы",            desc: "Зарплаты и рынок" },
    },
    footer: {
      tagline: "Самый быстрый и эффективный способ получить новую работу. Создано с топ-рекрутерами и AI.",
      resumeTools: "Инструменты резюме", otherTools: "Другие инструменты", resources: "Ресурсы", company: "Компания",
      pro: "Airesumi Pro", careerBlog: "Карьерный блог", resumeExamples: "Примеры резюме",
      interviewQuestions: "Вопросы интервью", salaryAnalyzer: "Анализатор зарплат",
      about: "О нас", contact: "Контакты", privacy: "Политика конфиденциальности", terms: "Условия использования",
      privacyShort: "Конфиденциальность", termsShort: "Условия",
      copyright: "© {{year}} airesumi. Все права защищены.",
    },
    language: { switch: "Язык", select: "Выберите язык" },
    theme: { toggle: "Переключить тёмный режим" },
  }},
} as const;

let initialized = false;

export function initI18n() {
  if (initialized) return i18n;
  initialized = true;

  i18n.use(initReactI18next).init({
    resources: { en: resources.en },
    lng: "en",
    fallbackLng: "en",
    defaultNS: "common",
    supportedLngs: ["en"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  if (typeof document !== "undefined") {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }

  return i18n;
}

// Kept as no-ops for backward compatibility with any remaining callers.
export function setLanguage(_code: LangCode) {}
export function getCurrentLanguage(): LangCode { return "en"; }

export default i18n;
