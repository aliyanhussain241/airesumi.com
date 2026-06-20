import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Crown, CheckCircle2, ArrowRight } from "lucide-react";

function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#111827] text-white pt-[68px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-lg mx-auto px-6 py-16"
      >
        {/* Success Icon */}
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} className="text-green-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <Crown size={18} className="text-white fill-white" />
          </div>
        </div>

        <h1 className="text-[40px] font-bold mb-3">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Pro!
          </span>
        </h1>
        <p className="text-[16px] text-gray-400 mb-10 leading-relaxed">
          Your payment was successful. You now have unlimited access to all airesumi Pro features.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-3">
          {[
            "Unlimited resume generations",
            "ATS Checker — unlimited scans",
            "Cover Letter Generator — unlimited",
            "Resume Bullet Writer & Summary Generator",
            "No watermarks on PDF downloads",
          ].map(f => (
            <div key={f} className="flex items-center gap-3 text-[14px] text-gray-300">
              <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <Link to="/resume"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[16px] rounded-full hover:scale-105 transition-all shadow-[0_10px_40px_-10px_rgba(249,115,22,0.8)] no-underline">
          Build My Resume Now <ArrowRight size={18} />
        </Link>

        <p className="text-[13px] text-gray-600 mt-6">
          Confirmation email sent. Questions?{" "}
          <Link to="/contact" className="text-orange-400 hover:underline no-underline">Contact support</Link>
        </p>
      </motion.div>
    </div>
  );
}

export const Route = createFileRoute("/premium /success")({
  head: () => ({
    meta: [{ title: "Payment Successful — airesumi Pro" }],
  }),
  component: SuccessPage,
});
