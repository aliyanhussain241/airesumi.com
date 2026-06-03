import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageSquare, CreditCard, Handshake, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = ({ onNavigate }: { onNavigate: (step: any) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-[0_1px_3px_rgba(37,99,235,0.10)] border-b border-[#FF6321]/20' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => onNavigate(0)}>
          <div className="w-10 h-10 bg-[#FF6321] text-white rounded-xl flex items-center justify-center font-serif text-2xl font-bold">R</div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">Rezumi</span>
        </div>
        
        <div className="hidden lg:flex gap-6 items-center">
          <button onClick={() => onNavigate(1)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Resume Builder</button>
          <button onClick={() => onNavigate(11)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Resume Examples</button>
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">ATS Checker</button>
          <button onClick={() => onNavigate(10)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Interview Questions</button>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => onNavigate(1)}
            className="px-4 py-2 sm:px-6 sm:py-2.5 bg-[#FF6321] hover:bg-orange-700 text-white font-medium rounded-full transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Build My Free Resume</span>
            <span className="sm:hidden">Build Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export const TermsOfService = ({ onNavigate }: { onNavigate: (step: any) => void }) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-[#FF6321] selection:text-white pb-20 pt-24">
      <Navbar onNavigate={onNavigate} />
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-1 hidden md:block">
          <div className="sticky top-32 space-y-3">
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Contents</h3>
            <button onClick={() => scrollTo('sec-1')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">1. Acceptance of Terms</button>
            <button onClick={() => scrollTo('sec-2')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">2. Description of Service</button>
            <button onClick={() => scrollTo('sec-3')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">3. Account Registration</button>
            <button onClick={() => scrollTo('sec-4')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">4. Free and Paid Plans</button>
            <button onClick={() => scrollTo('sec-5')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">5. Acceptable Use Policy</button>
            <button onClick={() => scrollTo('sec-6')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">6. Intellectual Property</button>
            <button onClick={() => scrollTo('sec-7')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">7. AI-Generated Content</button>
            <button onClick={() => scrollTo('sec-8')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">8. Disclaimer of Warranties</button>
            <button onClick={() => scrollTo('sec-9')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">9. Limitation of Liability</button>
            <button onClick={() => scrollTo('sec-10')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">10. Termination</button>
            <button onClick={() => scrollTo('sec-11')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">11. Governing Law</button>
            <button onClick={() => scrollTo('sec-12')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">12. Changes to Terms</button>
            <button onClick={() => scrollTo('sec-13')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">13. Contact Us</button>
          </div>
        </div>

        <div className="md:col-span-3 prose prose-orange max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#FF6321]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Terms of Service — Rezumi User Agreement</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium mb-4">These Terms of Service govern your use of Rezumi and all related career tools. By using AIResumi, you agree to these terms. Please read them carefully.</p>
          <div className="inline-block bg-gray-100 text-gray-600 text-sm font-bold px-4 py-2 rounded-lg mb-8">Last Updated: January 1, 2025 | Effective: January 1, 2025</div>

          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl mb-12">
            <p className="font-medium text-[#FF6321] m-0">In plain English: Use Rezumi honestly and for your own career. Do not misuse the service, steal content, or violate others' rights. We provide tools in good faith and ask you to use them in good faith. Full legal details below.</p>
          </div>

          <div id="sec-1" className="mb-12 scroll-mt-32">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using Rezumi (airesumi.com) and any related services, applications, or tools (collectively, the 'Service'), you agree to be bound by these Terms of Service ('Terms') and our Privacy Policy, which is incorporated into these Terms by reference.</p>
            <p>If you are using Rezumi on behalf of an organization, company, or institution, you represent that you have the authority to bind that organization to these Terms.</p>
            <p>If you do not agree to these Terms, you may not access or use Rezumi. Your continued use of the Service following any updates to these Terms constitutes your acceptance of the revised Terms.</p>
            <p>These Terms constitute a legally binding agreement between you ('User') and Rezumi ('Company', 'we', 'us', 'our').</p>
          </div>

          <div id="sec-2" className="mb-12 scroll-mt-32">
            <h2>2. Description of Service</h2>
            <p>Rezumi provides an AI-powered resume building and career tools platform, including but not limited to:</p>
            <ul>
              <li><strong>AI Resume Builder:</strong> An artificial intelligence tool that generates, formats, and optimizes professional resumes based on information provided by the user.</li>
              <li><strong>ATS Resume Checker:</strong> A tool that analyzes resume content and formatting for compatibility with Applicant Tracking Systems used by employers.</li>
              <li><strong>Resume Examples Library:</strong> A collection of professional resume samples organized by job title, industry, and experience level for educational and reference purposes.</li>
              <li><strong>Cover Letter Generator:</strong> An AI tool that generates personalized cover letters based on user-provided job and experience information.</li>
              <li><strong>Interview Questions Generator:</strong> A tool that provides role-specific interview questions and model answers for interview preparation.</li>
              <li><strong>Salary Analyzer:</strong> A tool that provides salary range estimates based on job title, experience, location, and industry data.</li>
            </ul>
            <p>Rezumi reserves the right to modify, suspend, or discontinue any part of the Service at any time with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.</p>
          </div>

          <div id="sec-3" className="mb-12 scroll-mt-32">
            <h2>3. Account Registration and Security</h2>
            <ul>
              <li><strong>Creating an Account:</strong> To access certain features of Rezumi, you must create an account by providing a valid email address and password, or by using Google or LinkedIn OAuth authentication. You must be at least 16 years of age to create a Rezumi account.</li>
              <li><strong>Account Accuracy:</strong> You agree to provide accurate, current, and complete information during registration and to keep your account information updated. Rezumi is not responsible for problems caused by inaccurate account information.</li>
              <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials. You agree to notify Rezumi immediately at info@airesumi.com if you become aware of any unauthorized use of your account or any security breach.</li>
              <li><strong>One Account Per User:</strong> Each user may maintain only one free account. Creating multiple accounts to circumvent free tier limits is a violation of these Terms and may result in all associated accounts being suspended.</li>
              <li><strong>Account Responsibility:</strong> You are responsible for all activity that occurs under your account, whether or not you authorized that activity.</li>
            </ul>
          </div>

          <div id="sec-4" className="mb-12 scroll-mt-32">
            <h2>4. Free Plan, Pro Subscription, and Payments</h2>
            <ul>
              <li><strong>Free Plan:</strong> Rezumi offers a free plan that allows users to create, edit, and preview resumes with core functionality. Free plan users may create up to 3 resumes and access basic templates. Free plan features may be modified at any time.</li>
              <li><strong>Pro Subscription:</strong> Rezumi Pro is a paid subscription that unlocks unlimited resumes, premium templates, PDF and DOCX downloads, the cover letter generator, advanced ATS analysis, and other premium features. Pro pricing is displayed on our Pricing page and may change with 30 days notice to existing subscribers.</li>
              <li><strong>Billing:</strong> Pro subscriptions are billed monthly or annually in advance. Payments are processed securely by Stripe. By subscribing to Pro, you authorize Rezumi to charge your payment method on a recurring basis until you cancel.</li>
              <li><strong>Cancellation:</strong> You may cancel your Pro subscription at any time from Account Settings. Cancellation takes effect at the end of your current billing period. You will retain Pro access until the period ends. We do not provide partial refunds for unused subscription periods except as described in our Refund Policy.</li>
              <li><strong>Refunds:</strong> We offer a full refund within 7 days of your initial Pro subscription purchase if you are not satisfied. After 7 days, refunds are evaluated on a case-by-case basis. Contact info@airesumi.com to request a refund.</li>
              <li><strong>Free Trial:</strong> If Rezumi offers a free trial of Pro features, your payment method will be charged at the end of the trial period unless you cancel before the trial expires. Trial terms will be clearly stated at sign-up.</li>
            </ul>
          </div>

          <div id="sec-5" className="mb-12 scroll-mt-32">
            <h2>5. Acceptable Use Policy</h2>
            <p>You agree to use Rezumi only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul>
              <li><strong>Misrepresent Information:</strong> Use Rezumi to create resumes containing deliberately false, fabricated, or misleading work experience, qualifications, certifications, or educational credentials. While Rezumi helps you present your real experience powerfully, we do not support fraud or misrepresentation.</li>
              <li><strong>Violate Laws:</strong> Use the Service in any way that violates applicable local, national, or international law or regulation.</li>
              <li><strong>Infringe Intellectual Property:</strong> Upload, generate, or distribute content that infringes the copyright, trademark, patent, or other intellectual property rights of any third party.</li>
              <li><strong>Abuse the Service:</strong> Attempt to gain unauthorized access to Rezumi systems, reverse engineer the AI models, scrape resume data at scale, or use automated bots to access the Service.</li>
              <li><strong>Harm Others:</strong> Use Rezumi to harass, impersonate, or harm other users, or to generate content that is defamatory, threatening, or discriminatory.</li>
              <li><strong>Circumvent Limits:</strong> Create multiple accounts, use VPNs, or take other actions to circumvent free plan limits or access paid features without a valid subscription.</li>
              <li><strong>Commercial Resale:</strong> Resell, redistribute, or sublicense access to Rezumi without written permission from Rezumi.</li>
            </ul>
            <p>Violation of this Acceptable Use Policy may result in immediate suspension or termination of your account without refund.</p>
          </div>

          <div id="sec-6" className="mb-12 scroll-mt-32">
            <h2>6. Intellectual Property Rights</h2>
            <ul>
              <li><strong>Rezumi's Intellectual Property:</strong> The Rezumi platform, including its design, code, AI models, resume templates, example library, written content, logos, and trademarks, is owned by Rezumi and protected by copyright, trademark, and other intellectual property laws. You may not copy, reproduce, distribute, or create derivative works from Rezumi's proprietary content without written permission.</li>
              <li><strong>Your Content:</strong> You retain full ownership of the personal content you provide to Rezumi — including your work history, skills, education, and contact details. By using Rezumi, you grant us a limited, non-exclusive license to process and store your content solely for the purpose of providing the Service to you.</li>
              <li><strong>Resume Examples:</strong> The resume examples in our library are provided for educational and reference purposes. You may study and adapt the format and structure of resume examples. You may not copy the exact text of example resumes verbatim and represent it as your own work.</li>
              <li><strong>AI-Generated Resumes:</strong> Resumes generated by our AI based on your input are your property. You are free to use, edit, and distribute your AI-generated resume for your personal job search.</li>
            </ul>
          </div>

          <div id="sec-7" className="mb-12 scroll-mt-32">
            <h2>7. AI-Generated Content — Important Notice</h2>
            <p>Rezumi uses artificial intelligence to generate resume content, cover letters, and interview preparation materials. By using our AI tools, you acknowledge and agree to the following:</p>
            <ul>
              <li><strong>Review Responsibility:</strong> You are responsible for reviewing all AI-generated content before submitting it to employers. While our AI is trained to produce accurate, professional resume content, it may occasionally generate information that requires correction, clarification, or adaptation to your specific situation.</li>
              <li><strong>Accuracy:</strong> AI-generated content reflects general best practices for resume writing. It does not constitute legal, career, financial, or professional advice. Rezumi does not guarantee that any AI-generated resume will result in interviews, job offers, or employment.</li>
              <li><strong>Factual Accuracy:</strong> Our AI generates content based on information you provide. If you provide inaccurate information, the AI will generate inaccurate content. You are responsible for ensuring all claims in your final resume are truthful and accurate.</li>
              <li><strong>No Employment Guarantee:</strong> Rezumi does not guarantee employment, interviews, callbacks, ATS passage, or any specific outcome from using our service. Job search results depend on many factors outside our control including job market conditions, recruiter preferences, and employer requirements.</li>
            </ul>
          </div>

          <div id="sec-8" className="mb-12 scroll-mt-32">
            <h2>8. Disclaimer of Warranties</h2>
            <p>THE SERVICE IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
            <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, REZUMI DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
            <ul>
              <li>Implied warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
              <li>Warranties regarding the accuracy, completeness, or reliability of any content or AI-generated output</li>
              <li>Warranties that the Service will meet your specific requirements or produce specific results</li>
            </ul>
            <p>Rezumi does not warrant that your resume will pass any particular ATS system, result in interviews, or lead to employment. ATS systems vary by employer and are updated frequently. Our ATS scores are estimates based on general ATS behavior patterns and are not guarantees of actual ATS performance.</p>
          </div>

          <div id="sec-9" className="mb-12 scroll-mt-32">
            <h2>9. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, REZUMI AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:</p>
            <ul>
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Damages resulting from your use or inability to use the Service</li>
              <li>Damages resulting from unauthorized access to your account</li>
              <li>Damages resulting from errors or inaccuracies in AI-generated content</li>
              <li>Any damages exceeding the total amount you paid to Rezumi in the 12 months preceding the claim</li>
            </ul>
            <p>Some jurisdictions do not allow the exclusion or limitation of liability for certain damages. In such jurisdictions, our liability is limited to the maximum extent permitted by law.</p>
            <p>Nothing in these Terms limits Rezumi's liability for fraud, gross negligence, willful misconduct, or any liability that cannot be excluded under applicable law.</p>
          </div>

          <div id="sec-10" className="mb-12 scroll-mt-32">
            <h2>10. Termination</h2>
            <ul>
              <li><strong>Termination by You:</strong> You may terminate your Rezumi account at any time by going to Account Settings and selecting Delete Account. Upon deletion, your personal data and resume content will be permanently deleted within 30 days.</li>
              <li><strong>Termination by Rezumi:</strong> Rezumi reserves the right to suspend or terminate your account immediately, without notice or liability, if you:
                <ul>
                  <li>Violate these Terms of Service or our Acceptable Use Policy</li>
                  <li>Engage in fraudulent, abusive, or illegal activity</li>
                  <li>Create multiple accounts to circumvent free plan limits</li>
                  <li>Attempt to harm the Service, other users, or Rezumi</li>
                </ul>
              </li>
              <li><strong>Effect of Termination:</strong> Upon termination, your right to use the Service immediately ceases. If your account is terminated for violation of these Terms, you will not be entitled to a refund of any paid subscription fees.</li>
              <li><strong>Survival:</strong> Sections relating to intellectual property, disclaimer of warranties, limitation of liability, and governing law survive termination of these Terms.</li>
            </ul>
          </div>

          <div id="sec-11" className="mb-12 scroll-mt-32">
            <h2>11. Governing Law and Dispute Resolution</h2>
            <ul>
              <li><strong>Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles.</li>
              <li><strong>Informal Resolution:</strong> Before filing any formal legal claim, you agree to contact Rezumi at info@airesumi.com to attempt to resolve the dispute informally. We will make good faith efforts to resolve disputes within 30 days.</li>
              <li><strong>Arbitration:</strong> If informal resolution fails, any dispute arising from these Terms or your use of Rezumi shall be resolved through binding individual arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. You waive your right to participate in class action lawsuits.</li>
              <li><strong>Exceptions:</strong> Either party may seek emergency injunctive relief from a court of competent jurisdiction. Claims of intellectual property infringement may be brought in court.</li>
              <li><strong>EU/UK Users:</strong> If you are located in the European Union or United Kingdom, you may have the right to resolve disputes through your local courts or consumer protection agencies under applicable EU or UK law.</li>
            </ul>
          </div>

          <div id="sec-12" className="mb-12 scroll-mt-32">
            <h2>12. Changes to These Terms</h2>
            <p>Rezumi reserves the right to update these Terms of Service at any time. When we make material changes, we will:</p>
            <ul>
              <li>Update the 'Last Updated' date at the top of this page</li>
              <li>Send an email notification to all registered users at least 14 days before the changes take effect</li>
              <li>Display a prominent notice on the Rezumi platform</li>
            </ul>
            <p>Material changes include changes to payment terms, intellectual property rights, arbitration provisions, or limitations of liability. Non-material changes such as grammatical corrections or clarifications may be made without notice.</p>
            <p>Your continued use of Rezumi after the effective date of updated Terms constitutes your acceptance of those Terms. If you do not agree to the updated Terms, you must stop using the Service and delete your account before the effective date.</p>
          </div>

          <div id="sec-13" className="mb-12 scroll-mt-32">
            <h2>13. Contact Us About These Terms</h2>
            <p>If you have questions about these Terms of Service, need clarification on any provision, or want to report a violation, please contact us:</p>
            <ul>
              <li><strong>General Terms Questions:</strong> info@airesumi.com</li>
              <li><strong>Legal Notices:</strong> info@airesumi.com</li>
              <li><strong>Privacy Matters:</strong> info@airesumi.com</li>
              <li><strong>Billing Disputes:</strong> info@airesumi.com</li>
              <li><strong>Response Time:</strong> We respond to all legal and compliance inquiries within 5 business days.</li>
            </ul>
            <br />
            <p>
              <strong>Mailing Address:</strong><br />
              Rezumi<br />
              Latifabad<br />
              Hyderabad, Sindh<br />
              Pakistan
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicy = ({ onNavigate }: { onNavigate: (step: any) => void }) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-[#FF6321] selection:text-white pb-20 pt-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-1 hidden md:block">
          <div className="sticky top-32 space-y-3">
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Contents</h3>
            <button onClick={() => scrollTo('sec-1')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">1. Information We Collect</button>
            <button onClick={() => scrollTo('sec-2')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">2. How We Use Your Information</button>
            <button onClick={() => scrollTo('sec-3')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">3. How We Store and Protect Your Data</button>
            <button onClick={() => scrollTo('sec-4')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">4. Cookies and Tracking Technologies</button>
            <button onClick={() => scrollTo('sec-5')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">5. Third Party Services We Use</button>
            <button onClick={() => scrollTo('sec-6')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">6. Your Rights and Choices</button>
            <button onClick={() => scrollTo('sec-7')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">7. Children's Privacy</button>
            <button onClick={() => scrollTo('sec-8')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">8. International Data Transfers</button>
            <button onClick={() => scrollTo('sec-9')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">9. Changes to This Privacy Policy</button>
            <button onClick={() => scrollTo('sec-10')} className="block text-left text-sm text-gray-600 hover:text-[#FF6321] font-medium transition-colors">10. Contact Us About Privacy</button>
          </div>
        </div>

        <div className="md:col-span-3 prose prose-orange max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#FF6321]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Privacy Policy — How Rezumi Protects Your Data</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium mb-4">Your privacy is not a checkbox for us — it is a core part of how we build Rezumi. We never sell your data, never share your resume with employers, and give you full control over your information.</p>
          <div className="inline-block bg-gray-100 text-gray-600 text-sm font-bold px-4 py-2 rounded-lg mb-8">Last Updated: January 1, 2025</div>

          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl mb-12">
            <p className="font-medium text-[#FF6321] m-0">In plain English: We collect only the data we need to run our service. We store it securely. We never sell it. We never share it with employers or recruiters. You can delete it anytime. The full legal details are below.</p>
          </div>

          <div id="sec-1" className="mb-12 scroll-mt-32">
            <h2>1. Information We Collect</h2>
            <h3>Information You Provide Directly</h3>
            <p>When you create a Rezumi account or use our resume builder, we collect the following information that you provide directly:</p>
            <ul>
              <li><strong>Account Information:</strong> Your name, email address, and password when you register for a Rezumi account. If you sign up using Google or LinkedIn OAuth, we receive your name and email from those services only.</li>
              <li><strong>Resume Content:</strong> The work experience, education, skills, contact details, and other career information you enter into our resume builder. This is your personal professional data and is stored securely under your account.</li>
              <li><strong>Payment Information:</strong> If you subscribe to Rezumi Pro, your payment is processed by Stripe. We never see or store your full credit card number. We receive only a payment confirmation token and your billing address from Stripe.</li>
              <li><strong>Communications:</strong> If you contact our support team, we store your email address and the content of your messages to help us respond to you and improve our service.</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <p>When you use Rezumi, we automatically collect certain technical information:</p>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, features used, buttons clicked, time spent on each section, and which tools you use within Rezumi. This helps us understand how people use our service and improve it.</li>
              <li><strong>Device and Browser Data:</strong> Your browser type, operating system, screen resolution, and device type. We use this to ensure Rezumi works correctly across all devices.</li>
              <li><strong>IP Address:</strong> Your approximate location based on IP address, used for fraud prevention and to ensure compliance with regional privacy laws.</li>
              <li><strong>Cookies:</strong> Small text files placed on your device to keep you logged in and remember your preferences. See our Cookies section for full details.</li>
            </ul>
          </div>

          <div id="sec-2" className="mb-12 scroll-mt-32">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes only:</p>
            <ul>
              <li><strong>To Provide and Improve Our Service:</strong> Your resume content is used to generate, format, and display your AI-optimized resume. We analyze usage patterns to identify bugs, improve features, and build new tools that job seekers need.</li>
              <li><strong>To Process Payments:</strong> Your billing information is used solely to process your Pro subscription payment through Stripe. We do not store payment card details on our servers.</li>
              <li><strong>To Send Service Communications:</strong> We send account-related emails such as password resets, subscription confirmations, and important security notices. We do not send marketing emails without your explicit opt-in.</li>
              <li><strong>To Provide Customer Support:</strong> When you contact our support team, we use your account information and message history to resolve your issue efficiently.</li>
              <li><strong>To Protect Against Fraud and Abuse:</strong> We analyze usage patterns and IP data to detect and prevent fraudulent accounts, spam, and abuse of our free tier.</li>
            </ul>
            <h3>What We Do NOT Do With Your Data:</h3>
            <ul>
              <li>We never sell your personal information or resume data to any third party</li>
              <li>We never share your resume with employers, recruiters, or job boards</li>
              <li>We never use your resume content to train third-party AI models without your consent</li>
              <li>We never send marketing emails without your opt-in</li>
              <li>We never profile you for advertising purposes</li>
            </ul>
          </div>

          <div id="sec-3" className="mb-12 scroll-mt-32">
            <h2>3. How We Store and Protect Your Data</h2>
            <ul>
              <li><strong>Encryption:</strong> All data transmitted between your browser and Rezumi is encrypted using TLS 1.3 (HTTPS). Your resume data stored on our servers is encrypted at rest using AES-256 encryption — the same standard used by banks and government agencies.</li>
              <li><strong>Server Security:</strong> Rezumi is hosted on Amazon Web Services (AWS) with enterprise-grade security configurations, automatic backup systems, and 99.9% uptime guarantees. Our servers are located in the United States and the European Union.</li>
              <li><strong>Access Controls:</strong> Only authorized Rezumi engineers with a legitimate business need can access user data, and only through secure authenticated channels with full audit logging. No Rezumi employee can access your resume content without your permission.</li>
              <li><strong>Data Retention:</strong> We retain your account data for as long as your account is active. If you delete your account, we permanently delete all your personal data and resume content within 30 days. Billing records are retained for 7 years as required by financial regulations.</li>
              <li><strong>Breach Notification:</strong> In the unlikely event of a data breach affecting your personal information, we will notify you by email within 72 hours of discovery, as required by applicable privacy laws.</li>
            </ul>
          </div>

          <div id="sec-4" className="mb-12 scroll-mt-32">
            <h2>4. Cookies and Tracking Technologies</h2>
            <p><strong>What Are Cookies:</strong> Cookies are small text files stored on your device by your browser. Rezumi uses cookies to keep you logged in, remember your preferences, and understand how our service is used.</p>
            <h3>Types of Cookies We Use:</h3>
            <ul>
              <li><strong>Essential Cookies (Required):</strong> These cookies are necessary for Rezumi to function. They keep you logged into your account and prevent cross-site request forgery attacks. You cannot disable these while using our service.</li>
              <li><strong>Analytics Cookies (Optional):</strong> We use Google Analytics and a self-hosted analytics tool to understand how users navigate Rezumi, which features are most used, and where users encounter problems. This data is aggregated and anonymized. You can opt out of analytics cookies in your Account Settings.</li>
              <li><strong>Functional Cookies (Optional):</strong> These remember your language preference, resume template selection, and other UI preferences to improve your experience. You can disable these without affecting core functionality.</li>
            </ul>
            <p><strong>What We Do NOT Use:</strong> We do not use advertising cookies, cross-site tracking cookies, or third-party marketing pixels. We do not sell cookie data to advertisers or data brokers.</p>
            <p><strong>How to Control Cookies:</strong> You can manage cookies through your browser settings at any time. Note that disabling essential cookies will prevent you from staying logged into your Rezumi account.</p>
          </div>

          <div id="sec-5" className="mb-12 scroll-mt-32">
            <h2>5. Third Party Services We Use</h2>
            <p>Rezumi uses a small number of trusted third-party services to operate our platform. Each has been evaluated for privacy compliance:</p>
            <ul>
              <li><strong>Stripe</strong> — Payment processing. Stripe is PCI DSS Level 1 certified. We share only the minimum billing information required to process your payment. Stripe Privacy Policy: stripe.com/privacy</li>
              <li><strong>Google Analytics</strong> — Website analytics (optional, opt-out available). Data is anonymized and aggregated. Google Privacy Policy: policies.google.com/privacy</li>
              <li><strong>Amazon Web Services (AWS)</strong> — Cloud hosting and data storage. AWS maintains SOC 2, ISO 27001, and GDPR compliance certifications. AWS Privacy Policy: aws.amazon.com/privacy</li>
              <li><strong>Google Gemini API</strong> — AI resume generation. Your data is sent to Google's Gemini API. Google Privacy Policy: policies.google.com/privacy</li>
              <li><strong>Clerk</strong> — User authentication. Handles secure login, password management, and OAuth connections. Clerk is SOC 2 Type II certified. Clerk Privacy Policy: clerk.com/privacy</li>
            </ul>
            <p>We do not use Facebook Pixel, advertising networks, data brokers, or any other third-party tracking services.</p>
          </div>

          <div id="sec-6" className="mb-12 scroll-mt-32">
            <h2>6. Your Rights and Choices</h2>
            <p>Depending on where you live, you have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Right to Access:</strong> You can request a complete export of all personal data we hold about you at any time. Email info@airesumi.com with 'Data Access Request' in the subject line and we will send your data within 30 days.</li>
              <li><strong>Right to Deletion:</strong> You can delete your Rezumi account and all associated data at any time from Account Settings → Delete Account. We permanently delete your data within 30 days. This includes your resume content, account information, and usage history.</li>
              <li><strong>Right to Correction:</strong> If any personal information we hold about you is inaccurate, you can update it directly in your Account Settings or contact our support team.</li>
              <li><strong>Right to Portability:</strong> You can export your resume data in PDF or DOCX format at any time from the resume builder. You can also request a JSON export of your raw account data by contacting info@airesumi.com.</li>
              <li><strong>Right to Object:</strong> You can opt out of optional analytics cookies, marketing emails, and non-essential data processing at any time through your Account Settings.</li>
              <li><strong>GDPR Rights (EU/EEA users):</strong> If you are located in the European Union or European Economic Area, you have additional rights under the General Data Protection Regulation including the right to lodge a complaint with your local Data Protection Authority.</li>
              <li><strong>CCPA Rights (California users):</strong> If you are a California resident, you have the right to know what personal information we collect, the right to delete it, and the right to opt out of the sale of personal information. We do not sell personal information to third parties.</li>
            </ul>
            <p>To exercise any of these rights, contact us at info@airesumi.com. We respond to all privacy requests within 30 days.</p>
          </div>

          <div id="sec-7" className="mb-12 scroll-mt-32">
            <h2>7. Children's Privacy</h2>
            <p>Rezumi is designed for adults and professional job seekers. Our service is not directed at children under the age of 16. We do not knowingly collect personal information from anyone under 16 years of age.</p>
            <p>If you are a parent or guardian and believe your child has provided personal information to Rezumi, please contact us immediately at info@airesumi.com. We will delete the information promptly upon verification.</p>
          </div>

          <div id="sec-8" className="mb-12 scroll-mt-32">
            <h2>8. International Data Transfers</h2>
            <p>Rezumi is operated from the United States. If you are accessing our service from outside the United States — including from the European Union, United Kingdom, Canada, Pakistan, India, Australia, or any other country — your data will be transferred to and processed in the United States.</p>
            <p>For users in the European Union and United Kingdom, we ensure that international data transfers comply with GDPR requirements through Standard Contractual Clauses (SCCs) approved by the European Commission.</p>
            <p>For users in other regions, we apply the same high standards of data protection regardless of where data is processed.</p>
          </div>

          <div id="sec-9" className="mb-12 scroll-mt-32">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time as our service evolves, new laws come into effect, or we add new features. When we make material changes, we will:</p>
            <ul>
              <li>Update the 'Last Updated' date at the top of this page</li>
              <li>Send an email notification to all registered Rezumi users</li>
              <li>Display a notice on the Rezumi homepage for 30 days after the change</li>
            </ul>
            <p>We encourage you to review this Privacy Policy periodically. Your continued use of Rezumi after changes are posted constitutes your acceptance of the updated policy.</p>
            <p>If we ever change our policy on selling user data (which we currently never do), we will give you 60 days notice and the opportunity to delete your account and all data before the change takes effect.</p>
          </div>

          <div id="sec-10" className="mb-12 scroll-mt-32">
            <h2>10. Contact Us About Privacy</h2>
            <p>If you have questions about this Privacy Policy, want to exercise your privacy rights, or have a concern about how we handle your data, please contact our Privacy team:</p>
            <ul>
              <li><strong>Email:</strong> info@airesumi.com</li>
              <li><strong>Subject line:</strong> Please include 'Privacy Request' or 'Data Question' for fastest response</li>
              <li><strong>Response time:</strong> We respond to all privacy requests within 5 business days</li>
            </ul>
            <br />
            <p>
              <strong>Mailing Address:</strong><br />
              Rezumi<br />
              Latifabad<br />
              Hyderabad, Sindh<br />
              Pakistan
            </p>
            <p>If you are an EU resident and are not satisfied with our response, you have the right to lodge a complaint with your national Data Protection Authority.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export const Contact = ({ onNavigate }: { onNavigate: (step: any) => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Resume Builder Help', message: '', agree: false });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || formData.message.length < 20 || !formData.agree) return;
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-[#FF6321] selection:text-white pb-20 pt-24">
      <Navbar onNavigate={onNavigate} />
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Contact Rezumi — We Are Here to Help</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">Have a question about your resume, our AI tools, your account, or a partnership opportunity? Our team responds to every message within 24 hours.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-50 text-[#FF6321] rounded-2xl flex items-center justify-center mx-auto mb-4"><MessageSquare /></div>
            <h3 className="font-bold text-gray-900 mb-2">Resume & Tool Support</h3>
            <p className="text-gray-500 text-sm mb-4">Questions about the AI resume builder, ATS checker, cover letter generator, or any of our career tools.</p>
            <button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} className="text-[#FF6321] font-bold text-sm w-full py-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors mb-2">Send a Message</button>
            <div className="text-xs text-gray-400 font-medium">Avg response: 4 hours</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-50 text-[#FF6321] rounded-2xl flex items-center justify-center mx-auto mb-4"><CreditCard /></div>
            <h3 className="font-bold text-gray-900 mb-2">Billing & Account Help</h3>
            <p className="text-gray-500 text-sm mb-4">Questions about your subscription, payment, invoice, cancellation, or account settings.</p>
            <a href="mailto:info@airesumi.com" className="block text-[#FF6321] font-bold text-sm w-full py-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors mb-2">Email Billing Team</a>
            <div className="text-xs text-gray-400 font-medium">Avg response: 2 hours</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-50 text-[#FF6321] rounded-2xl flex items-center justify-center mx-auto mb-4"><Handshake /></div>
            <h3 className="font-bold text-gray-900 mb-2">Partnerships & Press</h3>
            <p className="text-gray-500 text-sm mb-4">Interested in partnering with Rezumi, featuring us in an article, or exploring integration opportunities?</p>
            <a href="mailto:info@airesumi.com" className="block text-[#FF6321] font-bold text-sm w-full py-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors mb-2">Email Partnerships</a>
            <div className="text-xs text-gray-400 font-medium">Avg response: 1 business day</div>
          </div>
        </div>

        <div id="contact-form" className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
          <p className="text-gray-500 mb-8">Fill in the form below and a member of our team will get back to you within 24 hours. For faster help, check our FAQ section below first.</p>
          
          {status === 'success' ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-2xl font-medium text-center border border-green-100">
              Your message has been sent! We will reply to {formData.email} within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6321]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6321]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6321] bg-white appearance-none">
                  <option>Resume Builder Help</option>
                  <option>ATS Checker Question</option>
                  <option>Cover Letter Generator</option>
                  <option>Interview Questions Tool</option>
                  <option>Salary Analyzer</option>
                  <option>Account & Login Issues</option>
                  <option>Billing & Subscription</option>
                  <option>Partnership Opportunity</option>
                  <option>Press & Media Inquiry</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea required minLength={20} maxLength={2000} rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6321] resize-y" placeholder="How can we help you? (min 20 characters)" />
              </div>
              <div className="flex items-start gap-3">
                <input required type="checkbox" id="agree" checked={formData.agree} onChange={e => setFormData({...formData, agree: e.target.checked})} className="mt-1 w-4 h-4 text-[#FF6321] border-gray-300 rounded focus:ring-[#FF6321]" />
                <label htmlFor="agree" className="text-sm text-gray-600">I agree to the Privacy Policy</label>
              </div>
              <button type="submit" disabled={status === 'sending'} className="w-full py-4 bg-[#FF6321] text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-70">
                {status === 'sending' ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Rezumi Company Information</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Response Time</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>General Support: Within 4 hours</li>
              <li>Billing: Within 2 hours</li>
              <li>Partnerships: Within 1 business day</li>
              <li>Support hours: Mon–Fri, 9am–6pm EST</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Before You Contact</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
              <li>Check our FAQ — most questions answered instantly</li>
              <li>Check our Resume Builder Guide for tool help</li>
              <li>Check your spam folder for our reply emails</li>
              <li>Make sure you are logged into the correct account</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Connect With Us</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Twitter/X: @Rezumi</li>
              <li>LinkedIn: /company/resumeai</li>
              <li>YouTube: /Rezumi</li>
              <li>Product Hunt: Rezumi</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions — Get Instant Answers</h2>
        <p className="text-gray-500 mb-8">Before sending us a message, check if your question is answered here. Most support queries are covered in our FAQ.</p>
        <div className="space-y-4 mb-20">
          {[
            { q: "Is Rezumi completely free to use?", a: "Our core AI resume builder is free to use with no credit card required. You can create, edit, and preview your resume for free. Our Pro plan unlocks unlimited downloads, premium templates, the cover letter generator, and advanced ATS analysis. You can upgrade at any time from your account dashboard." },
            { q: "How do I download my resume as a PDF?", a: "Once you have built your resume in the Rezumi builder, click the Download button in the top right corner of the editor. Free users can download one resume as a PDF. Pro users can download unlimited resumes in both PDF and DOCX format. If your download is not working, try using Google Chrome and disabling any ad blockers." },
            { q: "Can I cancel my Pro subscription at any time?", a: "Yes. You can cancel your Rezumi Pro subscription at any time from your Account Settings page under Billing. Your Pro access continues until the end of your current billing period. We do not charge cancellation fees. If you have any trouble cancelling, email info@airesumi.com and we will process it within 2 hours." },
            { q: "How does the ATS resume checker work?", a: "Our ATS checker analyzes your resume against the formatting rules and keyword scanning logic used by major Applicant Tracking Systems including Workday, Greenhouse, Taleo, and Lever. It checks for ATS-incompatible formatting (tables, columns, images, unusual fonts), missing keywords compared to a target job description, section structure, and content completeness. You receive a score out of 100 with specific recommendations to improve it." },
            { q: "Is my resume data private and secure?", a: "Yes. Your resume data is encrypted and stored securely. We never sell your personal information or resume content to third parties. We never share your data with employers, recruiters, or job boards without your explicit consent. You can delete your account and all associated data at any time from Account Settings. Read our full Privacy Policy for complete details." },
            { q: "How do I reset my password?", a: "Click Sign In on the Rezumi homepage, then click Forgot Password below the login form. Enter your registered email address and we will send you a password reset link within 5 minutes. Check your spam folder if you do not see it. If you still have trouble accessing your account, contact info@airesumi.com." },
            { q: "Do you offer refunds?", a: "We offer a full refund within 7 days of your first Pro subscription payment if you are not satisfied — no questions asked. After 7 days, refunds are considered on a case-by-case basis. Contact info@airesumi.com with your account email and order details to request a refund." },
            { q: "Can I use Rezumi for multiple resumes?", a: "Yes. Free users can create and save up to 3 resumes. Pro users can create unlimited resumes and tailor each one to a different job description. This is especially useful for job seekers applying to multiple roles or industries simultaneously." }
          ].map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>

        <div className="bg-[#FF6321] text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help? We Are One Message Away</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">Our support team is real humans who genuinely want to help you get your resume right and land your next job. Send us a message and we will get back to you fast.</p>
          <button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-[#FF6321] px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg">Send Us a Message →</button>
        </div>
      </div>
    </div>
  );
};

function FAQItem({ question, answer }: { question: string, answer: string, key?: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#FF6321]/30 transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
        <span className="font-bold text-lg text-gray-900">{question}</span>
        <div className={`transform transition-transform duration-300 ${open ? 'rotate-180 text-[#FF6321]' : 'text-gray-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
             <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 cursor-text">
               {answer}
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export const About = ({ onNavigate }: { onNavigate: (step: any) => void }) => {
  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-[#FF6321] selection:text-white pb-20 pt-24">
      <Navbar onNavigate={onNavigate} />
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            We Are Rezumi — Helping Job Seekers Get Hired Faster With AI
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            Rezumi was built for one reason: too many qualified people were losing jobs to bad resumes. We built the smartest AI resume builder on the internet to fix that — for free.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-600 mb-20">
          <p>
            Every year, over 250 million people apply for jobs and get rejected — not because they lack the skills, but because their resume failed an ATS scan before a human ever read it. Rezumi exists to solve that problem. We combine artificial intelligence with expert resume writing knowledge to help every job seeker — from fresh graduates to senior executives — write a professional, ATS-optimized resume that gets interviews. Since launching, we have helped over 500,000 job seekers in 120+ countries build better resumes and land jobs at companies like Google, Amazon, Microsoft, and thousands of small businesses worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 border-y border-gray-200 py-12">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-[#FF6321] mb-2">500,000+</div>
            <div className="font-bold text-gray-900">Resumes Created</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-[#FF6321] mb-2">120+</div>
            <div className="font-bold text-gray-900">Countries Reached</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-[#FF6321] mb-2">94%</div>
            <div className="font-bold text-gray-900">Average ATS Score</div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission — Make Professional Resume Writing Accessible to Everyone</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 text-gray-600 text-lg">
            <p>
              The resume writing industry is broken. Career coaches charge $200 to $500 to write a single resume. Resume writing services take days to deliver. Most job seekers cannot afford either — and they end up submitting weak resumes that never get seen.
            </p>
            <p>
              We built Rezumi to change that. Our AI resume builder gives every job seeker access to the same quality of resume writing that top executives pay hundreds of dollars for — in 2 minutes, for free. Whether you are writing your first resume with no experience, switching careers after 10 years, or applying for a senior leadership role, Rezumi tailors your resume to the exact job description and ensures it passes every major ATS system.
            </p>
            <p>
              We believe that your resume should never be the reason you do not get the job. That is what drives everything we build.
            </p>
          </div>
          <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 flex items-center justify-center">
             <div className="text-[#FF6321] font-serif text-9xl font-bold opacity-20">R</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Free For Everyone</h3>
            <p className="text-gray-600 text-sm">Our core resume builder will always be free. We believe financial barriers should never stop someone from accessing a job opportunity.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">ATS-First Approach</h3>
            <p className="text-gray-600 text-sm">Every resume we generate is tested against major ATS platforms including Workday, Greenhouse, and Taleo. We do not just make resumes look good — we make them work.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">AI That Actually Understands Resumes</h3>
            <p className="text-gray-600 text-sm">Our AI is trained on thousands of real resumes that got people hired at top companies. It understands what recruiters look for, what ATS systems scan for, and how to make your experience sound impressive.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Story Behind Rezumi — Why We Built This</h2>
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-gray-600 text-lg mb-24">
          <p>Rezumi started with a frustration that millions of job seekers share.</p>
          <p>Our founder spent months applying for jobs after university, sending hundreds of carefully written resumes into what felt like a black hole. No callbacks. No interviews. Just silence. After finally getting help from a career coach — and paying $350 for a single resume rewrite — the callbacks started coming immediately. The resume content had not changed dramatically. The format had changed. The keywords had changed. The ATS compliance had changed.</p>
          <p>That experience raised a simple but powerful question: why should getting your resume right cost $350? Why is this knowledge locked behind expensive career coaches and resume writing services that most people cannot afford?</p>
          <p>We spent two years building an AI system that understands resume writing the way an expert career coach does — analyzing job descriptions, identifying the right keywords, structuring achievements for maximum impact, and formatting everything to pass ATS screening automatically.</p>
          <p>Today, Rezumi is used by job seekers in 120+ countries — from fresh graduates applying for their first internship to senior executives targeting C-suite positions. Every resume we help create reflects our core belief: the right resume should not be a privilege. It should be a right.</p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our AI Resume Tools — Everything You Need to Land Your Next Job</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            { t: "AI Resume Builder", d: "Our flagship tool. Enter your job title, experience, and skills — our AI writes a complete, ATS-optimized resume in under 2 minutes. Tailored to any job description automatically." },
            { t: "ATS Resume Checker", d: "Paste your existing resume and get an instant ATS compatibility score. See exactly which keywords are missing, which formatting issues will cause rejection, and how to fix them." },
            { t: "Resume Examples Library", d: "Browse 500+ professional resume examples by job title and industry. Study real resumes that got people hired and use our AI to build your own version instantly." },
            { t: "Cover Letter Generator", d: "Generate a personalized, job-specific cover letter in 60 seconds. Our AI matches your cover letter tone and keywords to the job description automatically." },
            { t: "Interview Questions Generator", d: "Get role-specific interview questions with expert model answers before your interview. Practice behavioral, technical, and situational questions for any job title." },
            { t: "Salary Analyzer", d: "Find out if you are being paid fairly. Enter your job title, experience, and location and get an instant salary analysis with negotiation tips based on real market data." }
          ].map((c, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#FF6321] transition-colors">
              <h3 className="font-bold text-gray-900 mb-3">{c.t}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Values That Drive Rezumi</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { t: "Accessibility", d: "Career tools should be available to everyone — not just those who can afford career coaches. We price our premium features fairly and keep our core tools free forever." },
            { t: "Transparency", d: "We tell you exactly how our AI works, what data we use, and how we generate your resume. No black boxes. No misleading claims. Just honest, useful tools." },
            { t: "Privacy", d: "Your resume data is your private information. We never sell your data to third parties, never share your information with employers, and give you full control to delete your data at any time." },
            { t: "Continuous Improvement", d: "The job market changes every year. ATS systems evolve. Recruiter preferences shift. We update our AI models continuously to reflect the latest hiring practices across every industry." }
          ].map((c, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">{c.t}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">The Team Behind Rezumi</h2>
        <p className="text-gray-600 mb-8 text-lg">Rezumi is built by a small, passionate team of engineers, career coaches, and product designers who have all personally experienced the frustration of the job search process.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            { n: "Alex Rahman", r: "CEO & Co-Founder", d: "Former software engineer turned career coach. Helped 2,000+ professionals rewrite their resumes before building Rezumi to scale that impact." },
            { n: "Sarah Chen", r: "Head of AI", d: "Machine learning engineer with 8 years of NLP experience. Previously built language models at a Fortune 500 tech company. Leads all AI development at Rezumi." },
            { n: "Maria Torres", r: "Head of Career Content", d: "Certified professional resume writer (CPRW) with 12 years of experience. Former recruiter at two global staffing agencies. Ensures every AI output meets recruiter standards." }
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-orange-100 text-[#FF6321] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {t.n.split(' ').map(n=>n[0]).join('')}
              </div>
              <h3 className="font-bold text-gray-900">{t.n}</h3>
              <p className="text-[#FF6321] text-sm mb-4 font-medium">{t.r}</p>
              <p className="text-gray-600 text-sm">{t.d}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Rezumi in the News</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {[
            "Featured in Forbes — Best AI Career Tools of 2025",
            "Product Hunt — #1 Product of the Day",
            "TechCrunch — Top 10 AI Startups to Watch",
            "G2 — Highest Rated Resume Builder 2025"
          ].map((n, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm font-medium text-gray-800 text-center">
              {n}
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trusted by 500,000+ Job Seekers Worldwide</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            { q: "I applied to 40 jobs with my old resume and heard nothing. I rebuilt it with Rezumi in 10 minutes and got 3 interview calls in the first week. The ATS score feature showed me exactly what was wrong.", a: "James K.", r: "Software Engineer hired at Amazon" },
            { q: "As a career changer with no direct experience in marketing, I was struggling to frame my skills. Rezumi helped me write a resume that made my background look relevant. I landed my first marketing role within 6 weeks.", a: "Priya S.", r: "Career Changer → Marketing Manager" },
            { q: "I am a nurse who had not updated my resume in 8 years. Rezumi built me a completely modern, ATS-optimized resume in minutes. I got called for 4 interviews in 2 weeks.", a: "Lisa M.", r: "Registered Nurse, Houston" }
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <p className="text-gray-600 italic mb-6 flex-1">"{t.q}"</p>
              <div>
                <p className="font-bold text-gray-900">{t.a}</p>
                <p className="text-sm text-gray-500">{t.r}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#FF6321] text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Write a Resume That Actually Gets Interviews?</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">Join 500,000+ job seekers who have used Rezumi to build ATS-optimized resumes, land more interviews, and get hired faster. It takes 2 minutes. It is free to start.</p>
          <button onClick={() => onNavigate(1)} className="bg-white text-[#FF6321] px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg">Build My Free Resume Now →</button>
          <p className="text-orange-200 text-sm mt-4 font-medium">No credit card required. ATS score shown instantly. Used in 120+ countries.</p>
        </div>
      </div>
    </div>
  );
};
