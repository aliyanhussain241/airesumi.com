import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, CheckCircle2, AlertCircle, TrendingUp, DollarSign, Award, Target, HelpCircle, Briefcase, Minus, Plus, Settings, Copy, Download, ArrowLeft } from 'lucide-react';

const CURRENCIES = [
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF",
  "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC",
  "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL",
  "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR",
  "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
  "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR",
  "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR",
  "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL",
  "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS",
  "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR",
  "ZMW", "ZWL"
];

export function SalaryAnalyzer({ onNavigate }: { onNavigate: (step: any) => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: '',
    experience: '1-3',
    industry: 'Technology',
    location: '',
    currentSalary: '',
    currency: 'USD',
    education: "Bachelor's",
    workType: 'Remote'
  });

  const [results, setResults] = useState<any>(null);

  const simulateAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setShowResults(false);

    setTimeout(() => {
      const baseValue = formData.industry === 'Technology' ? 95000 : 75000;
      const expMultiplier = formData.experience === '0-1' ? 0.8 : formData.experience === '1-3' ? 1 : formData.experience === '3-5' ? 1.2 : formData.experience === '5-10' ? 1.5 : 1.8;
      const salaryNumber = parseInt(formData.currentSalary || '0');
      
      const median = baseValue * expMultiplier;
      const low = median * 0.8;
      const high = median * 1.3;

      let status = 'Fair Market Rate';
      if (salaryNumber > 0) {
        if (salaryNumber < low) status = 'Below Market';
        else if (salaryNumber > high * 0.9) status = 'Above Market';
      }

      setResults({
        median,
        low,
        high,
        top10: high * 1.1,
        entryLevel: median * 0.7,
        status,
        score: Math.floor(Math.random() * 20) + 70, // 70-90
        insights: [
          `Your role in ${formData.industry} commands a strong market position right now.`,
          `${formData.workType} workers in this field typically see a 10-15% variance depending on company HQ.`,
          `With ${formData.education}, you meet the standard requirements for top-tier brackets.`
        ],
        skills: [
          { name: 'Leadership', boost: 12 },
          { name: 'Advanced Tools', boost: 18 },
          { name: 'Project Management', boost: 15 },
          { name: 'Data Analysis', boost: 22 }
        ]
      });

      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  const formFields = (
    <form onSubmit={simulateAnalysis} className="space-y-6 bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(37,99,235,0.08)] border border-gray-100 relative z-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Job Title</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              required
              type="text" 
              placeholder="e.g. Senior Product Manager"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-[#FF6321] outline-none transition-all"
              value={formData.jobTitle}
              onChange={e => setFormData({...formData, jobTitle: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Years of Experience</label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-[#FF6321] outline-none appearance-none bg-white font-medium"
            value={formData.experience}
            onChange={e => setFormData({...formData, experience: e.target.value})}
          >
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10-15">10-15 years</option>
            <option value="15+">15+ years</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Industry / Field</label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-[#FF6321] outline-none appearance-none bg-white"
            value={formData.industry}
            onChange={e => setFormData({...formData, industry: e.target.value})}
          >
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Finance</option>
            <option>Marketing</option>
            <option>Education</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>Sales</option>
            <option>HR</option>
            <option>Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Location</label>
          <input 
            required
            type="text" 
            placeholder="e.g. New York, USA"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-[#FF6321] outline-none"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Current Salary (Optional)</label>
          <div className="flex gap-2">
            <select 
              className="w-24 px-3 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-[#FF6321] outline-none bg-gray-50"
              value={formData.currency}
              onChange={e => setFormData({...formData, currency: e.target.value})}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="PKR">PKR</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
              <option disabled>──────────</option>
              {CURRENCIES.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="e.g. 85000"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-[#FF6321] outline-none"
              value={formData.currentSalary}
              onChange={e => setFormData({...formData, currentSalary: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Education Level</label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-[#FF6321] outline-none appearance-none bg-white"
            value={formData.education}
            onChange={e => setFormData({...formData, education: e.target.value})}
          >
            <option>High School</option>
            <option>Bachelor's</option>
            <option>Master's</option>
            <option>PhD</option>
            <option>Bootcamp/Self-taught</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-gray-100">
        <label className="text-sm font-semibold text-gray-700">Work Type</label>
        <div className="flex gap-3">
          {['Remote', 'Hybrid', 'On-site'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({...formData, workType: type})}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${formData.workType === type ? 'bg-[#FF6321] text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isAnalyzing}
        className="w-full mt-6 bg-[#FF6321] hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Market Data...
          </>
        ) : (
          'Analyze My Salary'
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#FF6321] selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(0)}>
            <div className="w-10 h-10 bg-[#FF6321] text-white rounded-xl flex items-center justify-center font-serif text-2xl font-bold">R</div>
            <span className="text-xl font-bold text-gray-900">airesumi</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate(0)}
              className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
            <button 
              onClick={() => onNavigate(1)}
              className="px-6 py-2.5 bg-[#1a202c] hover:bg-black text-white font-medium rounded-full transition-all text-sm"
            >
              Try Resume Builder
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent z-0" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#FF6321] font-semibold text-sm mb-6 border border-orange-100">
              <TrendingUp className="w-4 h-4" />
              2026 Salary Insights
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Find Out If You're Being <span className="text-[#FF6321]">Paid Fairly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Enter your details below and get an instant salary analysis based on your role, experience, and location. Data backed by millions of professional records.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            {formFields}
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto px-6 pb-24"
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-orange-900/5 border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Salary Analysis</h2>
                  <p className="text-gray-500">Based on {formData.jobTitle} in {formData.location}</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors border border-gray-200">
                    <Copy className="w-4 h-4" /> Share
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-[#FF6321] font-medium rounded-xl transition-colors border border-orange-100">
                    <Download className="w-4 h-4" /> Report
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-12">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                  results.status === 'Below Market' ? 'bg-red-50 text-[#DC2626] border border-red-100' :
                  results.status === 'Above Market' ? 'bg-purple-50 text-[#7C3AED] border border-purple-100' :
                  'bg-green-50 text-[#16A34A] border border-green-100'
                }`}>
                  {results.status === 'Below Market' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {results.status}
                </div>
              </div>

              {/* Range Bar */}
              <div className="mb-16">
                <div className="flex justify-between text-sm font-semibold text-gray-500 mb-3">
                  <span>Low: {formData.currency} {results.low.toLocaleString()}</span>
                  <span className="text-gray-900">Median: {formData.currency} {results.median.toLocaleString()}</span>
                  <span>High: {formData.currency} {results.high.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-orange-300 via-[#FF6321] to-purple-500"
                  />
                  {/* Current Salary Marker if provided */}
                  {formData.currentSalary && parseInt(formData.currentSalary) > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 }}
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-gray-900 rounded-full shadow-lg"
                      style={{ 
                        left: `${Math.min(100, Math.max(0, ((parseInt(formData.currentSalary) - results.low) / (results.high - results.low)) * 100))}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded">
                        You
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50">
                  <div className="w-10 h-10 bg-orange-100 text-[#FF6321] rounded-xl flex items-center justify-center mb-4">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Median Salary</p>
                  <p className="text-3xl font-bold text-gray-900">{formData.currency} {results.median.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100/50">
                  <div className="w-10 h-10 bg-purple-100 text-[#7C3AED] rounded-xl flex items-center justify-center mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Top 10% Earners</p>
                  <p className="text-3xl font-bold text-gray-900">{formData.currency} {results.top10.toLocaleString()}</p>
                </div>
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50">
                  <div className="w-10 h-10 bg-green-100 text-[#16A34A] rounded-xl flex items-center justify-center mb-4">
                    <Target className="w-5 h-5" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Entry Level</p>
                  <p className="text-3xl font-bold text-gray-900">{formData.currency} {results.entryLevel.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Insights and Negotiation Score */}
                <div>
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                        <motion.path 
                          initial={{ strokeDasharray: "0, 100" }}
                          animate={{ strokeDasharray: `${results.score}, 100` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" 
                          stroke="#FF6321" 
                          strokeWidth="3" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-xl font-bold text-gray-900">{results.score}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Negotiation Score</h3>
                      <p className="text-sm text-gray-500">Your leverage in your next interview.</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h3>
                  <ul className="space-y-3">
                    {results.insights.map((insight: string, i: number) => (
                      <li key={i} className="flex gap-3 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6321] shrink-0 fill-orange-50" />
                        <span className="text-sm leading-relaxed">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Skills That Increase Your Salary</h3>
                  <div className="space-y-4">
                    {results.skills.map((skill: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm text-sm">{skill.name}</span>
                        <span className="text-[#16A34A] font-bold text-sm bg-green-50 px-2.5 py-1 rounded-md border border-green-100">+{skill.boost}%</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => onNavigate(1)} className="w-full mt-8 py-3 bg-white border-2 border-[#FF6321] text-[#FF6321] rounded-xl font-bold hover:bg-orange-50 transition-colors">
                    Add These to Your Resume
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        
        {/* How Salary Ranges Work */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Salary Ranges Work</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Understanding percentiles is the key to knowing your market worth and negotiating effectively.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-[#FF6321] font-bold text-lg">25th</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Entry Level / Low</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Typically for those with less experience, in smaller markets, or starting fresh in a new industry. Still negotiating room here.</p>
             </div>
             <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-md transform md:-translate-y-4 ring-1 ring-orange-100">
                <div className="w-12 h-12 bg-[#FF6321] rounded-xl flex items-center justify-center mb-6">
                  <span className="text-white font-bold text-lg">50th</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">The Median Rate</h3>
                <p className="text-gray-600 text-sm leading-relaxed">The true market average. If you have the standard experience and skills required, this should be your baseline target.</p>
             </div>
             <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-[#7C3AED] font-bold text-lg">75th</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Top Tier / High</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Reserved for specialized expertise, top-tier markets (like SF or NY), or candidates checking every single box perfectly.</p>
             </div>
          </div>
        </section>

        {/* How to Negotiate */}
        <section>
          <div className="bg-white rounded-3xl p-10 md:p-16 border border-gray-100 shadow-lg shadow-gray-200/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How to Negotiate Your Salary</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Research', desc: 'Use tools like this to find your exact market rate based on your unique profile.', icon: Search },
                { step: '02', title: 'Anchor High', desc: 'Always provide a range where your ideal number is actually at the bottom.', icon: Target },
                { step: '03', title: 'Show Value', desc: 'Don\'t just ask for more money. Reiterate the exact value you will bring.', icon: Briefcase },
                { step: '04', title: 'Be Ready', desc: 'Know your walk-away number and be prepared to use it if they lowball.', icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-black text-gray-100 absolute -top-6 -left-4 z-0 tracking-tighter">{item.step}</div>
                  <div className="relative z-10 space-y-4 pt-4">
                    <div className="w-10 h-10 bg-orange-50 text-[#FF6321] rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Salary by Industry Chart (Visual representation) */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Average Salary by Industry</h2>
          <div className="space-y-6 max-w-3xl">
             {[
               { name: 'Technology (Software)', val: 95, label: '$115k' },
               { name: 'Finance / Investment', val: 85, label: '$95k' },
               { name: 'Healthcare (Clinical)', val: 80, label: '$88k' },
               { name: 'Engineering (Civil/Mech)', val: 75, label: '$82k' },
               { name: 'Marketing / Advertising', val: 65, label: '$75k' },
               { name: 'Education', val: 50, label: '$60k' }
             ].map((ind, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">{ind.name}</span>
                    <span className="text-gray-900">{ind.label}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${ind.val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#FF6321] to-orange-400"
                    />
                  </div>
                </div>
             ))}
          </div>
        </section>

        {/* FAQ Area */}
        <FAQSection />

      </div>

      {/* CTA Footer Form */}
      <section className="bg-[#1a202c] text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Land a Higher-Paying Job?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Your salary potential is heavily influenced by how you present yourself. Upgrade your resume with AI before your next interview.
          </p>
          <button onClick={() => onNavigate(1)} className="px-10 py-5 bg-[#FF6321] hover:bg-[#ff7a40] text-white font-bold rounded-full text-lg transition-transform transform hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-orange-500/20">
            Build Your AI Resume Now
          </button>
        </div>
      </section>

    </div>
  );
}

function FAQSection() {
  const faqs = [
    { q: "How accurate is the salary data?", a: "Our data is aggregated from millions of active job postings, self-reported salaries, and recruiter data. It provides a highly accurate estimate for the current market rate." },
    { q: "Should I include my current salary in applications?", a: "Generally, no. In many places, it's actually illegal for employers to ask for your salary history. Focus on your target compensation instead." },
    { q: "How much should I counter-offer?", a: "A standard counter-offer is between 10% and 20% above the initial offer. Always base your counter on market research and the value you bring to the role." },
    { q: "Do remote jobs pay less?", a: "It depends. Some companies pay based on your local cost of living, while others offer a standard rate regardless of location. Our tool factors in work type to provide the best estimate." },
    { q: "When is the best time to negotiate?", a: "The best time to negotiate is after you have received a formal offer and before you sign it. This is when you have the most leverage." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
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
    </section>
  );
}
