import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, Search, CheckCircle2, AlertCircle, 
  HelpCircle, Briefcase, Settings, Copy, Download, 
  ArrowLeft, MessageSquare, Star, BookOpen, UserCheck, 
  Lightbulb, Zap, CheckSquare, Square,
  Clock, AlertTriangle
} from 'lucide-react';

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Marketing", 
  "Education", "Engineering", "Design", "Sales", 
  "HR", "Legal", "Other"
];

const QUESTION_TYPES = [
  "Behavioral", "Technical", "Situational", 
  "Culture Fit", "Salary Negotiation", "Case Study"
];

// Mock database of questions
const QUESTIONS_DB = [
  {
    q: "Tell me about a time you handled a difficult deadline.",
    type: "Behavioral",
    difficulty: "Medium",
    expertAnswer: "Use the STAR method: Situation — I was working on a critical project with a strict deadline when a key team member fell ill. Task — I had to reallocate resources and prioritize tasks to ensure we met the deadline without compromising quality. Action — I organized a quick meeting, reassigned critical tasks, and put in some extra hours myself to cover the gap. Result — We delivered the project on time, and the client was thrilled with the result. It taught me the importance of adaptability and team cross-training.",
    whyTheyAsk: "Employers want to assess your time management, adaptability, and composure under pressure."
  },
  {
    q: "How do you explain complex technical concepts to non-technical stakeholders?",
    type: "Behavioral",
    difficulty: "Medium",
    expertAnswer: "I focus on analogies and business value rather than jargon. Situation: In my last role, I had to explain a database migration to the sales team. Action: Instead of talking about latency, I explained it like moving our store to a new, faster building—there might be a little downtime moving the boxes, but afterwards, checkout will be twice as fast. Result: They understood the impact and were supportive of the planned downtime.",
    whyTheyAsk: "Communication skills and empathy for other departments are critical in almost every role."
  },
  {
    q: "Describe a time when you disagreed with your manager.",
    type: "Situational",
    difficulty: "Hard",
    expertAnswer: "Situation: My manager wanted to launch a feature quickly, but I noticed a potential security vulnerability. Action: I gathered data on the potential risks and presented it privately, offering a workaround that would only delay the launch by two days. Result: They appreciated the data-driven approach and agreed to the delay to fix the issue. We launched safely.",
    whyTheyAsk: "Assessing conflict resolution skills, professionalism, and ability to handle authority gracefully."
  },
  {
    q: "What is your expected salary for this role?",
    type: "Salary Negotiation",
    difficulty: "Medium",
    expertAnswer: "Based on my market research for this role in this city with my level of experience, I am looking for a range between $X and $Y. However, I'm very interested in the total compensation package, including benefits and growth opportunities, and I'm open to seeing what you're able to offer.",
    whyTheyAsk: "Checking if your expectations align with their budget before proceeding too far."
  },
  {
    q: "Where do you see yourself in five years?",
    type: "Culture Fit",
    difficulty: "Easy",
    expertAnswer: "In five years, I hope to have deepened my expertise in [Skill] and taken on more leadership responsibilities. I am specifically interested in how this company is growing its [Department/Initiative], and I would love to be playing a key role in driving that forward.",
    whyTheyAsk: "To see if your long-term career goals align with the company's trajectory and if you plan to stay."
  },
  {
    q: "Explain a concept or technology you recently learned.",
    type: "Technical",
    difficulty: "Medium",
    expertAnswer: "[Choose something relevant to your field]. For example: I recently spent time learning [Technology/Concept] to improve [Specific Process]. I took an online course and then built a small proof-of-concept project. I found that it reduced processing time by 20%.",
    whyTheyAsk: "Testing your intellectual curiosity, continuous learning habits, and ability to communicate clearly."
  },
  {
    q: "How do you prioritize your work when everything seems urgent?",
    type: "Behavioral",
    difficulty: "Medium",
    expertAnswer: "I use the Eisenhower Matrix to categorize tasks by urgency and importance. I also communicate proactively with stakeholders. For example, last month I had three 'urgent' requests. I spoke with the requesters, clarified the actual business impact of each, and negotiated new deadlines for two of them, allowing me to focus on the truly critical one first.",
    whyTheyAsk: "Checking organizational skills, stress management, and ability to negotiate priorities."
  },
  {
    q: "Why do you want to work for our company?",
    type: "Culture Fit",
    difficulty: "Easy",
    expertAnswer: "I've been following your recent work in [Specific Area]. I really admire your commitment to [Company Value]. Coming from a background in [Your Background], I feel I could make an immediate impact on your [Specific Team/Project], while also growing within a culture that values [Value].",
    whyTheyAsk: "To see if you've done your research and if you genuinely care about the company, not just getting any job."
  },
  {
    q: "Tell me about a time you failed.",
    type: "Behavioral",
    difficulty: "Hard",
    expertAnswer: "Early in my career, I missed a detail on a client report because I didn't have a peer review it. The client caught it. I immediately took responsibility, corrected the error, and then implemented a new checklist system for my team to ensure every report had a secondary review. We never made that mistake again.",
    whyTheyAsk: "Assessing self-awareness, accountability, and ability to learn and grow from mistakes."
  },
  {
    q: "How would you handle a colleague who is not doing their share of the work?",
    type: "Situational",
    difficulty: "Medium",
    expertAnswer: "First, I'd approach them reasonably to see if there's a blocker or personal issue I'm unaware of. 'Hey, I noticed we're behind on X, is there anything I can do to help?' Often, it's a misunderstanding. If it continues and impacts the project, I would document the specific instances and discuss it with our manager to find a resolution.",
    whyTheyAsk: "Conflict management, teamwork, and professionalism."
  }
];

// Duplicate and expand questions to reach a good number for generation simulation
const GENERATE_DB = [...QUESTIONS_DB, ...QUESTIONS_DB, ...QUESTIONS_DB, ...QUESTIONS_DB].map((q, i) => ({...q, id: i.toString()}));

export function InterviewGenerator({ onNavigate }: { onNavigate: (step: any) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    industry: 'Technology',
    experience: 'Mid Level',
    types: ['Behavioral', 'Technical'] as string[],
    companyType: 'Mid-size Company',
    questionCount: 10
  });

  const [formError, setFormError] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [showCopied, setShowCopied] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false, false]);

  useEffect(() => {
    const saved = localStorage.getItem('interview_bookmarks');
    if (saved) {
      try {
        setBookmarked(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleBookmark = (id: string) => {
    const newBookmarks = bookmarked.includes(id) 
      ? bookmarked.filter(b => b !== id)
      : [...bookmarked, id];
    
    setBookmarked(newBookmarks);
    localStorage.setItem('interview_bookmarks', JSON.stringify(newBookmarks));
  };

  const handleTypeToggle = (type: string) => {
    if (formData.types.includes(type)) {
      if (formData.types.length > 1) {
        setFormData({...formData, types: formData.types.filter(t => t !== type)});
      }
    } else {
      setFormData({...formData, types: [...formData.types, type]});
    }
  };

  const generateQuestions = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.jobTitle.trim()) {
      setFormError('Please enter a job title');
      return;
    }
    setFormError('');
    setIsGenerating(true);
    setShowResults(false);
    
    setTimeout(() => {
      // Simulate filtering/randomizing from database based on types
      let pool = GENERATE_DB.filter(q => formData.types.includes(q.type));
      if (pool.length < formData.questionCount) {
        // Fallback if not enough
        pool = [...pool, ...GENERATE_DB].slice(0, formData.questionCount);
      }
      
      // Shuffle
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setResults(shuffled.slice(0, formData.questionCount));
      setIsGenerating(false);
      setShowResults(true);
      window.scrollTo({ top: document.getElementById('results-section')?.offsetTop ? document.getElementById('results-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
    }, 2000);
  };

  const copyAll = () => {
    const text = results.map((q, i) => `${i+1}. ${q.q}\\nAnswer: ${q.expertAnswer}`).join('\\n\\n');
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Behavioral': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Technical': return 'bg-green-100 text-green-800 border-green-200';
      case 'Situational': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Culture Fit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Salary Negotiation': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#FF6321] selection:text-white pb-24 pt-[68px]">


      {/* Hero */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-orange-50/50 z-0" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-[#FF6321] font-bold text-sm mb-6 border border-orange-200">
              <MessageSquare className="w-4 h-4" /> AI Interview Prep
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Ace Your Interview With <span className="text-[#FF6321]">AI-Generated Questions</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get role-specific interview questions with expert answers — tailored to your job title, industry, and experience level.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="max-w-3xl mx-auto text-left">
            <form onSubmit={generateQuestions} className="bg-white p-8 rounded-2xl shadow-xl shadow-orange-900/5 border border-gray-100">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Software Engineer"
                    className={`w-full px-4 py-3 rounded-lg border ${formError ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#FF6321] outline-none transition-all`}
                    value={formData.jobTitle}
                    onChange={e => {setFormData({...formData, jobTitle: e.target.value}); setFormError('')}}
                  />
                  {formError && <p className="text-red-500 text-xs mt-1">{formError}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Industry</label>
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none"
                    value={formData.industry}
                    onChange={e => setFormData({...formData, industry: e.target.value})}
                  >
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Experience Level</label>
                <div className="flex flex-wrap gap-3">
                  {['Entry Level', 'Mid Level', 'Senior Level', 'Leadership'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({...formData, experience: lvl})}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${formData.experience === lvl ? 'bg-[#FF6321] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Interview Types</label>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeToggle(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${formData.types.includes(type) ? 'border-[#FF6321] bg-orange-50 text-[#C2410C] dark:text-orange-300' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8 border-t border-gray-100 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Company Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none"
                    value={formData.companyType}
                    onChange={e => setFormData({...formData, companyType: e.target.value})}
                  >
                    {['Startup', 'Mid-size Company', 'Large Corporation', 'Government', 'Non-profit', 'Freelance/Agency'].map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex justify-between">
                    Number of Questions <span>{formData.questionCount}</span>
                  </label>
                  <input 
                    type="range" min="5" max="30" step="1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6321] mt-3"
                    value={formData.questionCount}
                    onChange={e => setFormData({...formData, questionCount: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-[#FF6321] hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>Generating your questions...</span>
                  </>
                ) : (
                  <><Lightbulb className="w-5 h-5" /> Generate Interview Questions</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            id="results-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-6 py-12"
          >
            {/* Top Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Interview Setup</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="px-3 py-1 bg-gray-100 font-medium rounded-md text-gray-700">{formData.jobTitle}</span>
                  <span className="text-gray-300">•</span>
                  <span className="px-3 py-1 bg-gray-100 font-medium rounded-md text-gray-700">{formData.industry}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600 font-medium"><strong className="text-gray-900">{results.length}</strong> Questions Generated</span>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={copyAll} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors border border-gray-200">
                  {showCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} 
                  {showCopied ? 'Copied!' : 'Copy All'}
                </button>
                <div className="relative group flex-1 md:flex-none">
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-[#FF6321] font-medium rounded-xl transition-colors border border-orange-100 cursor-not-allowed opacity-80">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Questions Column */}
              <div className="lg:col-span-2 space-y-6">
                {results.map((q, idx) => (
                  <QuestionCard key={idx} question={q} index={idx + 1} bookmarked={bookmarked.includes(q.id)} onBookmark={() => toggleBookmark(q.id)} typeColor={getTypeColor(q.type)} dColor={getDifficultyColor(q.difficulty)} />
                ))}
                
                <button onClick={() => generateQuestions()} className="w-full py-4 mt-8 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate Questions
                </button>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Tips */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> Prep Tips for {formData.experience}</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-[#FF6321] mt-1.5 shrink-0" /> Focus on quantifiable results. Use metrics and numbers whenever possible to describe your impact.</li>
                    <li className="flex gap-3 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-[#FF6321] mt-1.5 shrink-0" /> Research {formData.companyType.toLowerCase()}s. They value adaptability and understanding of their specific scale challenges.</li>
                    <li className="flex gap-3 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-[#FF6321] mt-1.5 shrink-0" /> Prepare 3 strong questions to ask THEM at the end.</li>
                  </ul>
                </div>

                {/* Common Mistakes */}
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                  <h3 className="font-bold text-red-900 text-lg mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> Common Mistakes</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-red-800"><span className="font-bold shrink-0">1.</span> Rambling without structure (Use STAR).</li>
                    <li className="flex gap-2 text-sm text-red-800"><span className="font-bold shrink-0">2.</span> Speaking negatively about past employers.</li>
                    <li className="flex gap-2 text-sm text-red-800"><span className="font-bold shrink-0">3.</span> Admitting a weakness without sharing how you're actively fixing it.</li>
                  </ul>
                </div>

                {/* Duration */}
                <div className="bg-gray-900 text-white rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2 text-gray-400 font-medium text-sm w-full"><Clock className="w-4 h-4" /> Estimated Duration</div>
                  <div className="text-3xl font-extrabold">{Math.floor(formData.questionCount * 2.5)} mins</div>
                  <p className="text-gray-400 text-sm mt-1">Based on 2.5 mins per question + buffer.</p>
                </div>

                {/* Confidence Checklist */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-green-500" /> Confidence Checklist</h3>
                  <div className="space-y-3">
                    {[
                      "I have reviewed the job description.",
                      "I have 3 STAR stories prepared.",
                      "I know the company's core values.",
                      "My background setup is professional.",
                      "I have questions ready to ask them."
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 cursor-pointer" onClick={() => {
                        const next = [...checklist];
                        next[i] = !next[i];
                        setChecklist(next);
                      }}>
                        <div className="mt-0.5">
                          {checklist[i] ? <CheckSquare className="w-5 h-5 text-[#FF6321]" /> : <Square className="w-5 h-5 text-gray-300" />}
                        </div>
                        <span className={`text-sm ${checklist[i] ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO Content Sections */}
      <div className="max-w-5xl mx-auto px-6 py-20 divide-y divide-gray-100">
        
        {/* How it Works */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get fully customized interview preparation in seconds.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: UserCheck, t: "1. Enter Role Details", d: "Tell us the job title, your experience level, and the type of company you are interviewing for." },
               { icon: Zap, t: "2. AI Generates Questions", d: "Our model matches your context with the most critical questions employers use to screen candidates." },
               { icon: BookOpen, t: "3. Practice Expert Answers", d: "Read through what recruiters are actually looking for, and learn how to structure your best response." }
             ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                   <div className="w-14 h-14 bg-orange-50 text-[#FF6321] rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <item.icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3">{item.t}</h3>
                   <p className="text-gray-600 text-sm leading-relaxed">{item.d}</p>
                </div>
             ))}
          </div>
        </div>

        {/* Types Explained */}
        <div className="py-16">
           <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Interview Question Types Explained</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                  <h4 className="font-bold text-orange-900 mb-2">Behavioral</h4>
                  <p className="text-sm text-orange-800/80">Questions about past situations to predict future behavior. Always use the STAR method to answer these.</p>
               </div>
               <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                  <h4 className="font-bold text-green-900 mb-2">Technical</h4>
                  <p className="text-sm text-green-800/80">Assesses your hard skills. Even if you don't know the exact answer, talk through your problem-solving thought process.</p>
               </div>
               <div className="bg-yellow-50/50 p-6 rounded-2xl border border-yellow-100">
                  <h4 className="font-bold text-yellow-900 mb-2">Situational</h4>
                  <p className="text-sm text-yellow-800/80">Hypothetical scenarios. Employers want to see your logic, conflict resolution, and decision-making frameworks.</p>
               </div>
               <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-purple-900 mb-2">Culture Fit</h4>
                  <p className="text-sm text-purple-800/80">Verifies your values align with the company's. Research their mission statement and weave it into your answers.</p>
               </div>
           </div>
        </div>

        {/* Industry Questions Tabs */}
        <div className="py-16">
          <IndustryTabsSection />
        </div>

        {/* STAR Method */}
        <div className="py-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Mastering the STAR Method</h2>
              <p className="text-gray-600">The gold standard for answering behavioral interview questions.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
               <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-l-[#FF6321]">
                  <div className="font-black text-2xl text-orange-200 mb-2">S</div>
                  <h4 className="font-bold text-orange-900 mb-2">Situation</h4>
                  <p className="text-sm text-orange-800/80">Set the scene and give the necessary context of your example.</p>
               </div>
               <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-l-[#FF6321]">
                  <div className="font-black text-2xl text-orange-200 mb-2">T</div>
                  <h4 className="font-bold text-orange-900 mb-2">Task</h4>
                  <p className="text-sm text-orange-800/80">Describe what your specific responsibility was in that situation.</p>
               </div>
               <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-l-[#FF6321]">
                  <div className="font-black text-2xl text-orange-200 mb-2">A</div>
                  <h4 className="font-bold text-orange-900 mb-2">Action</h4>
                  <p className="text-sm text-orange-800/80">Explain exactly what steps YOU took to address it.</p>
               </div>
               <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-l-[#FF6321]">
                  <div className="font-black text-2xl text-orange-200 mb-2">R</div>
                  <h4 className="font-bold text-orange-900 mb-2">Result</h4>
                  <p className="text-sm text-orange-800/80">Share the outcome, using quantifiable metrics if possible.</p>
               </div>
            </div>
          </div>
        </div>

        {/* FAQ Area */}
        <div className="py-16">
          <FAQSection />
        </div>

      </div>

      {/* CTA Footer Form */}
      <section className="bg-[#FF6321] text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">Got the Interview? <br/>Now Perfect Your Resume.</h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Make sure your paper profile matches your interview skills before you walk in the door. Build a tailored resume with AI.
          </p>
          <button onClick={() => onNavigate(1)} className="px-10 py-5 bg-white text-[#FF6321] font-bold rounded-full text-lg transition-transform transform hover:scale-[1.03] active:scale-[0.98] shadow-xl">
            Build My AI Resume Now
          </button>
        </div>
      </section>

    </div>
  );
}

const QuestionCard = ({ question, index, bookmarked, onBookmark, typeColor, dColor }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-gray-300">
      <div className="p-6 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex justify-between items-start gap-4 mb-4">
           <div className="flex items-center gap-3">
             <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${typeColor}`}>{question.type}</span>
             <div className="flex items-center gap-1.5 opacity-70">
                <div className={`w-2 h-2 rounded-full ${dColor}`} />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{question.difficulty}</span>
             </div>
           </div>
           <button 
             onClick={(e) => { e.stopPropagation(); onBookmark(); }} 
             className="text-gray-400 hover:text-yellow-500 transition-colors"
           >
             <Star className={`w-5 h-5 ${bookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
           </button>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 pr-8">
          <span className="text-gray-400 mr-2">{index}.</span>
          {question.q}
        </h3>

        <div className="mt-4 flex items-center text-sm font-medium text-[#FF6321]">
           {open ? 'Hide Expert Answer' : 'Show Expert Answer'}
           <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-gray-50 border-t border-gray-100"
      >
           <div className="p-6 space-y-6">
              <div>
                 <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Expert Answer Strategy</h4>
                 <p className="text-gray-600 text-sm leading-relaxed">{question.expertAnswer}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                 <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500"/> Why They Ask This</h4>
                 <p className="text-gray-600 text-sm">{question.whyTheyAsk}</p>
              </div>
           </div>
      </motion.div>
    </div>
  );
};

function FAQSection() {
  const faqs = [
    { q: "How many interview questions should I prepare?", a: "Aim to have 5-8 strong 'STAR' stories that can be adapted to answer various questions. You don't need a unique story for every single question." },
    { q: "What is the STAR method?", a: "Situation, Task, Action, Result. It's a structured manner of responding to a behavioral-based interview question by discussing the specific situation, task, action, and result of the situation you are describing." },
    { q: "How do I answer salary questions in interviews?", a: "Try to delay discussing specifics until you have an offer. If pressed, provide a well-researched range, or state you are open to discussing total compensation based on the full scope of the role." },
    { q: "What questions should I ask the interviewer?", a: "Always have questions ready! Ask about the team dynamics, the biggest challenge the person in this role will face in the first 90 days, or how success is measured." },
    { q: "How do I prepare for a technical interview?", a: "Review core concepts, practice coding on a whiteboard or blank screen (without IDE auto-complete), and remember to vocalize your thought process to the interviewer. They care about *how* you solve it as much as the solution." },
    { q: "What are the most common interview mistakes?", a: "Showing up late (even on Zoom!), negative speaking about past employers, rambling without answering the actual question, and having no questions to ask at the end." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow">
            <button 
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className="font-bold text-lg text-gray-900">{faq.q}</span>
              <div className={`transform transition-transform duration-300 ${openIdx === i ? 'rotate-180 text-[#FF6321]' : 'text-gray-400'}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndustryTabsSection() {
  const [activeTab, setActiveTab] = useState('Tech');
  const industries = ['Tech', 'Finance', 'Healthcare', 'Marketing', 'Design'];
  
  const sampleQuestions: Record<string, string[]> = {
    'Tech': [
      "Explain the difference between clustered and non-clustered indexes.",
      "How would you design a scalable system for a real-time chat application?",
      "Tell me about a time you had to debug a complex system issue under pressure."
    ],
    'Finance': [
      "Walk me through the three financial statements.",
      "How would you value a company that has no revenue?",
      "Describe a time when your financial analysis directly influenced a business decision."
    ],
    'Healthcare': [
      "How do you ensure compliance with HIPAA regulations in your daily work?",
      "Tell me about a time you had to deal with a difficult or non-compliant patient.",
      "Explain how you prioritize tasks when you have multiple critical patients needing attention."
    ],
    'Marketing': [
      "How do you measure the ROI of a marketing campaign?",
      "Tell me about a time a campaign failed and what you learned from it.",
      "If you had a budget of $50,000 to launch our new product, how would you allocate it?"
    ],
    'Design': [
      "Walk me through your design process from ideation to handoff.",
      "How do you balance user needs with business goals?",
      "Tell me about a time you received harsh feedback on a design. How did you handle it?"
    ]
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sample Questions by Industry</h2>
        <p className="text-gray-600">Get a feel for the types of specific questions you might face.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {industries.map(ind => (
          <button
            key={ind}
            onClick={() => setActiveTab(ind)}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === ind ? 'bg-[#FF6321] text-white shadow-md transform scale-[1.02]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {ind}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4"
        >
          {sampleQuestions[activeTab]?.map((q, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6321] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <p className="text-gray-800 font-medium pt-1">{q}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
