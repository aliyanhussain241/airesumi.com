import { ResumeData } from "../lib/types";

export type DesignId =
  | 'classic' | 'modern' | 'minimal' | 'split'
  | 'creative-orange' | 'corporate-dark' | 'modern-block' | 'contrast-bold'
  | 'navy-executive' | 'green-fresh' | 'purple-creative' | 'red-impact'
  | 'elegant-serif' | 'tech-dark' | 'pastel-soft' | 'gold-luxury'
  | 'blue-professional' | 'teal-modern'
  | 'slate-clean' | 'rose-minimal'
  | 'pro-executive' | 'pro-infographic' | 'pro-developer' | 'pro-agency' | 'pro-elegant';

export function ResumePreview({ data, designId = 'classic' }: { data: ResumeData, designId?: DesignId }) {

  // ==================== NEW PREMIUM DESIGNS ====================

  if (designId === 'pro-executive') {
    return (
      <div className="bg-white mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] flex font-sans overflow-hidden border border-gray-200">
        <div className="w-[35%] bg-slate-900 text-white p-8 flex flex-col items-center pt-12">
          {data.header.profilePicture && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 mb-6 shrink-0">
              <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 w-full border-b border-slate-700 pb-2">Contact</h2>
          <div className="space-y-3 text-xs text-slate-300 w-full mb-8">
            {data.header.contactInfo.split('|').map((info, i) => <span key={i} className="block break-words">{info.trim()}</span>)}
          </div>
          
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 w-full border-b border-slate-700 pb-2">Skills</h2>
          <div className="w-full space-y-4 mb-8">
            {data.skills.map((sg, i) => (
              <div key={i}>
                <span className="text-xs font-bold text-white block mb-2">{sg.category}</span>
                <div className="space-y-2">
                  {sg.items.map((item, ii) => (
                    <div key={ii}>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>{item}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.max(40, 100 - (ii * 15))}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[65%] p-10 pt-12 bg-slate-50">
          <div className="mb-10">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2 uppercase">{data.header.fullName}</h1>
            <p className="text-xl text-amber-500 font-bold uppercase tracking-widest">{data.header.title}</p>
          </div>
          
          <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span> Professional Profile
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
          </div>

          <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span> Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 bg-amber-400 rounded-full -left-[7px] top-1 border-2 border-slate-50"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 text-base">{exp.title}</h3>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded shadow-sm">{exp.dateRange}</span>
                  </div>
                  <p className="text-sm font-semibold text-amber-500 mb-3">{exp.company}</p>
                  <ul className="list-disc pl-4 space-y-1.5">
                    {exp.bullets.map((b, bi) => <li key={bi} className="text-sm text-slate-600 leading-relaxed">{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span> Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-sm text-slate-600">{edu.institution}</p>
                  <span className="text-xs font-bold text-amber-500 mt-1 block">{edu.dateRange}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (designId === 'pro-infographic') {
    return (
      <div className="bg-slate-50 mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] font-sans overflow-hidden">
        <div className="bg-indigo-600 p-10 flex items-center gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
          {data.header.profilePicture && (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 shrink-0">
              <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white mb-1 tracking-tight">{data.header.fullName}</h1>
            <p className="text-indigo-200 text-xl font-medium mb-4">{data.header.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/90">
              {data.header.contactInfo.split('|').map((info, i) => <span key={i} className="bg-indigo-500/50 px-3 py-1 rounded-full">{info.trim()}</span>)}
            </div>
          </div>
        </div>
        <div className="p-10 grid grid-cols-[2fr_1fr] gap-10">
          <div>
            <div className="mb-10">
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-indigo-600"></span> Summary
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium bg-white p-5 rounded-xl shadow-sm border border-slate-100">{data.summary}</p>
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-indigo-600"></span> Work Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{exp.title}</h3>
                        <p className="text-sm font-bold text-indigo-500">{exp.company}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{exp.dateRange}</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 mt-4">
                      {exp.bullets.map((b, bi) => <li key={bi} className="text-sm text-slate-600">{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-10">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-indigo-600"></span> Skills
              </h2>
              <div className="space-y-4">
                {data.skills.map((sg, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block mb-3 uppercase">{sg.category}</span>
                    <div className="flex flex-wrap gap-2">
                      {sg.items.map((item, ii) => (
                        <span key={ii} className="text-[11px] font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md border border-indigo-100">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-indigo-600"></span> Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500">
                    <h3 className="text-sm font-bold text-slate-800">{edu.degree}</h3>
                    <p className="text-xs text-slate-500 mt-1">{edu.institution}</p>
                    <span className="text-xs font-bold text-indigo-500 mt-2 block">{edu.dateRange}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (designId === 'pro-developer') {
    return (
      <div className="bg-[#0d1117] text-[#c9d1d9] mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] font-mono border-2 border-[#30363d] overflow-hidden rounded-xl shadow-2xl">
        <div className="bg-[#161b22] px-4 py-3 flex items-center gap-2 border-b border-[#30363d]">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          <div className="ml-4 text-xs text-[#8b949e] font-mono select-none">~/developer/resume.ts</div>
        </div>
        <div className="p-10">
          <div className="flex items-start gap-8 mb-10 border-b border-[#30363d] pb-10">
            {data.header.profilePicture && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-[#30363d] shrink-0 grayscale hover:grayscale-0 transition-all duration-500">
                <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <div className="text-[#8b949e] text-xs mb-2">const developer = {"{"}</div>
              <h1 className="text-4xl font-bold text-[#58a6ff] mb-2 pl-4">name: '{data.header.fullName}',</h1>
              <p className="text-xl text-[#7ee787] mb-2 pl-4">role: '{data.header.title}',</p>
              <div className="pl-4 text-sm text-[#c9d1d9]">
                contact: [
                {data.header.contactInfo.split('|').map((info, i) => <span key={i} className="text-[#a5d6ff]"> '{info.trim()}',</span>)} ]
              </div>
              <div className="text-[#8b949e] text-xs mt-2">{"};"}</div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-12">
            <div className="space-y-10">
              <div>
                <h2 className="text-[#ff7b72] text-sm font-bold uppercase tracking-widest mb-4">## Skills</h2>
                <div className="space-y-4">
                  {data.skills.map((sg, i) => (
                    <div key={i}>
                      <span className="text-xs font-bold text-[#d2a8ff] block mb-2">{sg.category}:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {sg.items.map((item, ii) => (
                          <span key={ii} className="text-[10px] bg-[#21262d] border border-[#30363d] text-[#c9d1d9] px-2 py-1 rounded">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-[#ff7b72] text-sm font-bold uppercase tracking-widest mb-4">## Education</h2>
                <div className="space-y-5">
                  {data.education.map((edu, i) => (
                    <div key={i} className="border-l-2 border-[#30363d] pl-4">
                      <h3 className="text-sm font-bold text-[#7ee787]">{edu.degree}</h3>
                      <p className="text-xs text-[#8b949e] my-1">{edu.institution}</p>
                      <span className="text-xs text-[#58a6ff]">{edu.dateRange}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="text-[#ff7b72] text-sm font-bold uppercase tracking-widest mb-4">## About</h2>
                <p className="text-sm text-[#8b949e] leading-relaxed">
                  <span className="text-[#7ee787]">/*</span><br/>
                  {data.summary}<br/>
                  <span className="text-[#7ee787]">*/</span>
                </p>
              </div>
              <div>
                <h2 className="text-[#ff7b72] text-sm font-bold uppercase tracking-widest mb-6">## Experience</h2>
                <div className="space-y-8">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="relative">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-bold text-[#58a6ff] text-base">{exp.title}</h3>
                        <span className="text-xs text-[#8b949e] bg-[#21262d] px-2 py-1 rounded">{exp.dateRange}</span>
                      </div>
                      <p className="text-sm text-[#d2a8ff] mb-3">@{exp.company}</p>
                      <ul className="space-y-2">
                        {exp.bullets.map((b, bi) => (
                          <li key={bi} className="text-sm text-[#c9d1d9] flex items-start">
                            <span className="text-[#ff7b72] mr-2">{">"}</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (designId === 'pro-agency') {
    return (
      <div className="bg-white mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] flex font-sans overflow-hidden">
        <div className="w-[45%] bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 p-10 text-white flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex-1">
            {data.header.profilePicture && (
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl mb-8 transform -rotate-3">
                <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-5xl font-black mb-2 leading-none tracking-tighter">{data.header.fullName}</h1>
            <p className="text-xl font-bold text-white/90 mb-8 uppercase tracking-widest">{data.header.title}</p>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 mb-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-white/70 mb-4">Contact</h2>
              <div className="space-y-3 text-sm font-medium">
                {data.header.contactInfo.split('|').map((info, i) => <span key={i} className="block break-words">{info.trim()}</span>)}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h2 className="text-xs font-black uppercase tracking-widest text-white/70 mb-4">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-bold">{edu.degree}</h3>
                    <p className="text-xs text-white/80">{edu.institution}</p>
                    <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded inline-block mt-2">{edu.dateRange}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[55%] p-10 bg-slate-50">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-800 mb-4 lowercase tracking-tighter relative inline-block">
              about_me
              <div className="absolute bottom-1 left-0 w-full h-3 bg-orange-400/30 -z-10"></div>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{data.summary}</p>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-800 mb-6 lowercase tracking-tighter relative inline-block">
              experience
              <div className="absolute bottom-1 left-0 w-full h-3 bg-pink-400/30 -z-10"></div>
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="group">
                  <span className="text-xs font-black text-orange-500 mb-1 block">{exp.dateRange}</span>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{exp.title}</h3>
                  <p className="text-sm font-bold text-slate-500 mb-3">{exp.company}</p>
                  <ul className="space-y-2">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="text-sm text-slate-600 flex items-start">
                        <span className="text-pink-500 mr-2 font-black">+</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-6 lowercase tracking-tighter relative inline-block">
              skills
              <div className="absolute bottom-1 left-0 w-full h-3 bg-red-400/30 -z-10"></div>
            </h2>
            <div className="space-y-4">
              {data.skills.map((sg, i) => (
                <div key={i}>
                  <span className="text-xs font-black text-slate-800 uppercase block mb-2">{sg.category}</span>
                  <div className="flex flex-wrap gap-2">
                    {sg.items.map((item, ii) => (
                      <span key={ii} className="text-[11px] font-bold bg-white shadow-sm border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (designId === 'pro-elegant') {
    return (
      <div className="bg-[#fdfbf7] mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] font-serif overflow-hidden border-[12px] border-[#2c3e50] p-10">
        <header className="flex flex-col items-center text-center border-b-[3px] border-[#d4af37] pb-8 mb-8">
          {data.header.profilePicture && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-[#2c3e50] p-1 mb-6">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover grayscale" />
              </div>
            </div>
          )}
          <h1 className="text-5xl font-normal text-[#2c3e50] mb-3 tracking-widest uppercase">{data.header.fullName}</h1>
          <p className="text-xl text-[#d4af37] italic mb-6">{data.header.title}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#7f8c8d] uppercase tracking-widest font-sans font-bold">
            {data.header.contactInfo.split('|').map((info, i) => <span key={i}>{info.trim()}</span>)}
          </div>
        </header>

        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-sm text-[#34495e] leading-loose italic">{data.summary}</p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-10">
          <div className="space-y-10">
            <div>
              <h2 className="text-sm font-bold text-[#2c3e50] uppercase tracking-[0.3em] mb-6 text-center flex flex-col items-center">
                Experience
                <span className="w-10 h-0.5 bg-[#d4af37] mt-3 block"></span>
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp, i) => (
                  <div key={i} className="text-center">
                    <h3 className="font-bold text-[#2c3e50] text-base uppercase tracking-wider">{exp.title}</h3>
                    <p className="text-sm text-[#d4af37] font-bold my-1">{exp.company}</p>
                    <span className="text-[10px] text-[#7f8c8d] uppercase tracking-widest font-sans block mb-3">{exp.dateRange}</span>
                    <ul className="text-sm text-[#34495e] space-y-2 text-left list-disc pl-5">
                      {exp.bullets.map((b, bi) => <li key={bi} className="leading-relaxed">{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-px bg-[#d4af37]/30"></div>

          <div className="space-y-10">
            <div>
              <h2 className="text-sm font-bold text-[#2c3e50] uppercase tracking-[0.3em] mb-6 text-center flex flex-col items-center">
                Education
                <span className="w-10 h-0.5 bg-[#d4af37] mt-3 block"></span>
              </h2>
              <div className="space-y-6">
                {data.education.map((edu, i) => (
                  <div key={i} className="text-center">
                    <h3 className="font-bold text-[#2c3e50] text-sm uppercase tracking-wider">{edu.degree}</h3>
                    <p className="text-sm text-[#7f8c8d] italic my-1">{edu.institution}</p>
                    <span className="text-[10px] text-[#d4af37] uppercase tracking-widest font-sans font-bold">{edu.dateRange}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#2c3e50] uppercase tracking-[0.3em] mb-6 text-center flex flex-col items-center">
                Skills
                <span className="w-10 h-0.5 bg-[#d4af37] mt-3 block"></span>
              </h2>
              <div className="space-y-5 text-center">
                {data.skills.map((sg, i) => (
                  <div key={i}>
                    <span className="text-xs font-bold text-[#2c3e50] uppercase tracking-widest block mb-2">{sg.category}</span>
                    <span className="text-sm text-[#7f8c8d] leading-relaxed italic block">{sg.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== NEW FREE DESIGNS ====================

  if (designId === 'slate-clean') {
    return (
      <div className="bg-white text-[#334155] mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] font-sans p-12 overflow-hidden border-t-[12px] border-[#334155]">
        <header className="mb-10 pb-6 border-b-2 border-[#e2e8f0]">
          <h1 className="text-4xl font-bold tracking-tight text-[#0f172a] mb-2">{data.header.fullName}</h1>
          <p className="text-xl text-[#475569] mb-4">{data.header.title}</p>
          <div className="text-sm text-[#64748b] flex flex-wrap gap-x-4">
            {data.header.contactInfo.split('|').map((info, idx) => (<span key={idx}>{info.trim()}</span>))}
          </div>
        </header>
        <section className="mb-8">
          <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-3">Profile</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
        <section className="mb-8">
          <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-5">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-[#0f172a]">{exp.title}</h3>
                  <span className="text-xs text-[#64748b]">{exp.dateRange}</span>
                </div>
                <p className="text-sm font-medium mb-2">{exp.company}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {exp.bullets.map((b, bi) => <li key={bi} className="text-sm">{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-2 gap-8">
          <section>
            <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-4">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-[#0f172a] text-sm">{edu.degree}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  <span className="text-xs text-[#64748b]">{edu.dateRange}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider mb-4">Skills</h2>
            <div className="space-y-3">
              {data.skills.map((sg, idx) => (
                <div key={idx}>
                  <span className="font-bold text-sm block">{sg.category}</span>
                  <span className="text-sm">{sg.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (designId === 'rose-minimal') {
    return (
      <div className="bg-white text-[#1f2937] mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] font-sans p-10 overflow-hidden">
        <header className="border-l-[3px] border-[#e11d48] pl-6 mb-10">
          <h1 className="text-4xl font-light tracking-tight mb-2">{data.header.fullName}</h1>
          <p className="text-lg font-medium text-[#e11d48] mb-4">{data.header.title}</p>
          <div className="text-sm text-[#6b7280] flex flex-wrap gap-x-4 gap-y-2">
            {data.header.contactInfo.split('|').map((info, idx) => (<span key={idx} className="bg-[#fff1f2] px-2 py-1 rounded text-[#9f1239]">{info.trim()}</span>))}
          </div>
        </header>
        <section className="mb-10">
          <p className="text-sm leading-relaxed text-[#4b5563]">{data.summary}</p>
        </section>
        <div className="grid grid-cols-[1fr_2fr] gap-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-4 border-b border-[#f3f4f6] pb-2">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                    <p className="text-xs text-[#6b7280] my-1">{edu.institution}</p>
                    <span className="text-[10px] text-[#e11d48] font-bold">{edu.dateRange}</span>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-4 border-b border-[#f3f4f6] pb-2">Skills</h2>
              <div className="space-y-4">
                {data.skills.map((sg, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-sm block mb-1">{sg.category}</span>
                    <span className="text-xs text-[#4b5563] leading-relaxed block">{sg.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section>
            <h2 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-4 border-b border-[#f3f4f6] pb-2">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base">{exp.title}</h3>
                    <span className="text-[10px] text-[#e11d48] font-bold">{exp.dateRange}</span>
                  </div>
                  <p className="text-sm font-medium text-[#6b7280] mb-3">{exp.company}</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {exp.bullets.map((b, bi) => <li key={bi} className="text-sm text-[#4b5563] leading-relaxed">{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ==================== NAVY EXECUTIVE ====================
  if (designId === 'navy-executive') {
    return (
      <div className="bg-white mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] font-sans overflow-hidden">
        <div className="bg-[#1B2A4A] text-white p-10 pb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-1">{data.header.fullName}</h1>
          <p className="text-[#93B4D9] text-lg font-medium mb-4">{data.header.title}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#B8CCE4]">
            {data.header.contactInfo.split('|').map((info, i) => <span key={i}>{info.trim()}</span>)}
          </div>
        </div>
        <div className="flex">
          <div className="w-[65%] p-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1B2A4A] border-b-2 border-[#1B2A4A] pb-1 mb-4">Professional Summary</h2>
            <p className="text-sm text-[#374151] leading-relaxed mb-8">{data.summary}</p>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1B2A4A] border-b-2 border-[#1B2A4A] pb-1 mb-4">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold text-[#1B2A4A]">{exp.title}</h3>
                    <span className="text-xs text-[#6b7280] bg-[#EEF2F7] px-2 py-1 rounded">{exp.dateRange}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#93B4D9] mb-2">{exp.company}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {exp.bullets.map((b, bi) => <li key={bi} className="text-sm text-[#4b5563] leading-relaxed">{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[35%] bg-[#EEF2F7] p-8">
            {data.header.profilePicture && (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#1B2A4A] mx-auto mb-6">
                <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1B2A4A] border-b-2 border-[#1B2A4A] pb-1 mb-4">Education</h2>
            <div className="space-y-4 mb-8">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-[#1B2A4A]">{edu.degree}</h3>
                  <p className="text-xs text-[#6b7280]">{edu.institution}</p>
                  <span className="text-xs text-[#93B4D9]">{edu.dateRange}</span>
                </div>
              ))}
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1B2A4A] border-b-2 border-[#1B2A4A] pb-1 mb-4">Skills</h2>
            <div className="space-y-3">
              {data.skills.map((sg, i) => (
                <div key={i}>
                  <span className="text-xs font-bold text-[#1B2A4A] block mb-1">{sg.category}</span>
                  <div className="flex flex-wrap gap-1">
                    {sg.items.map((item, ii) => <span key={ii} className="text-[10px] bg-[#1B2A4A] text-white px-2 py-0.5 rounded">{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== GREEN FRESH ====================
  if (designId === 'green-fresh') {
    return (
      <div className="bg-white mx-auto print:mx-0 w-full max-w-[850px] min-h-[1100px] font-sans p-10 overflow-hidden">
        <div className="flex items-center gap-8 mb-10 pb-8 border-b-4 border-[#059669]">
          {data.header.profilePicture && (
            <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0">
              <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-extrabold text-[#064E3B] mb-1">{data.header.fullName}</h1>
            <p className="text-xl text-[#059669] font-medium mb-3">{data.header.title}</p>
            <div className="flex flex-wrap gap-x-4 text-sm text-[#6b7280]">
              {data.header.contactInfo.split('|').map((info, i) => <span key={i}>{info.trim()}</span>)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-10">
          <div>
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#059669] mb-3 flex items-center gap-2"><span className="w-4 h-1 bg-[#059669] inline-block"></span> About Me</h2>
              <p
