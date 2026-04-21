"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, Layout, Database, 
  ShieldCheck, Zap, BarChart3, Users, 
  Building2, MousePointer2, Smartphone, Globe
} from 'lucide-react';

// Reusable Components
const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-primary">
        EstateFlow
      </div>
      <div className="hidden md:flex items-center gap-8">
        <Link href="#features" className="text-sm font-semibold text-slate-500 hover:text-primary transition">Features</Link>
        <Link href="#how-it-works" className="text-sm font-semibold text-slate-500 hover:text-primary transition">Workflow</Link>
        <Link href="/login" className="text-sm font-semibold text-slate-900 border px-4 py-2 rounded-xl hover:bg-slate-50 transition">Log in</Link>
        <Link href="/register" className="btn-primary !py-2.5 !px-6 !text-sm !rounded-xl">Start Trial</Link>
      </div>
    </div>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group p-8 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
    <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const SectionWrapper = ({ children, id, className = "" }) => (
  <section id={id} className={`py-24 md:py-32 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

export default function RedesignedLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 z-0"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm"
            >
              <Zap size={14} className="text-primary" /> The future of property management
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-slate-900"
            >
              Close more <br/>
              <span className="text-primary italic">deals together.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mx-auto lg:mx-0 text-xl text-slate-500 font-medium leading-relaxed"
            >
              Synchronize your entire sales pipeline. From lead generation to final commission, EstateFlow brings data clarity to every transaction.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link href="/register" className="btn-primary !px-10 !py-4.5 !text-lg shadow-2xl shadow-primary/20 w-full sm:w-auto">
                Get Started Free <ArrowRight size={20} className="ml-1" />
              </Link>
              <Link href="/login" className="px-10 py-4.5 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50 transition w-full sm:w-auto text-center text-lg">
                View Dashboard
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 w-full max-w-2xl"
          >
            {/* Perspective UI Mock Frame */}
            <div className="relative aspect-[4/3] bg-white border border-slate-200 rounded-[32px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] p-2">
              <div className="w-full h-full bg-slate-50 rounded-[28px] border border-slate-100 overflow-hidden relative">
                <div className="h-14 bg-white border-b border-slate-100 flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-8 space-y-8 animate-pulse">
                  <div className="flex gap-4">
                    <div className="flex-1 h-32 bg-white rounded-2xl"></div>
                    <div className="flex-1 h-32 bg-white rounded-2xl"></div>
                    <div className="flex-1 h-32 bg-white rounded-2xl"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white w-2/3 rounded-full"></div>
                    <div className="h-32 bg-white rounded-2xl"></div>
                    <div className="h-4 bg-white w-1/2 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <SectionWrapper id="features" className="bg-slate-50/50">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Infrastructure</h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900">Engineered for real estate velocity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Users} 
            title="Lead Intelligence" 
            description="Automated assignment and priority scoring to ensure you never miss a high-intent buyer again."
          />
          <FeatureCard 
            icon={Building2} 
            title="Dynamic Catalog" 
            description="Manage your entire inventory with high-resolution image support and real-time status syncing."
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Financial Pipeline" 
            description="Track every cent. Automated commission calculation and deal stage visualization at your fingertips."
          />
          <FeatureCard 
            icon={Smartphone} 
            title="Native Mobile Ready" 
            description="A fluid, responsive interface that feels like a native app on every field agent's device."
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Enterprise Security" 
            description="Bank-grade JWT authentication and granular role-based permissions for total data control."
          />
          <FeatureCard 
            icon={Globe} 
            title="Real-Time Engine" 
            description="No partial reloads. Every update to leads or properties reflects across the system instantly."
          />
        </div>
      </SectionWrapper>

      {/* How It Works Timeline */}
      <SectionWrapper id="how-it-works">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">How EstateFlow <br/>Works.</h2>
            <div className="space-y-12 relative before:absolute before:h-full before:w-px before:bg-slate-100 before:left-6 lg:before:left-6">
              {[
                { title: "Capture & Qualify", desc: "Leads enter the system through ads or manual entry and are qualified with budget data." },
                { title: "Smart Assignment", desc: "Admins assign leads to the most relevant agents based on workload and performance." },
                { title: "Convert to Deals", desc: "Qualified leads are linked to available properties to start the official negotiation flow." }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-16">
                  <div className="absolute left-0 w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-primary z-10">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 aspect-square bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center relative border border-slate-800">
             {/* Visual Decorator */}
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="w-64 h-64 border-2 border-slate-800 border-dashed rounded-full"
             ></motion.div>
             <div className="absolute flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl">
                  <MousePointer2 size={32} />
                </div>
                <p className="text-white font-bold tracking-tight">Automated Sales Ops</p>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Call to Action Grid */}
      <section className="px-6 py-20 pb-40">
        <div className="max-w-7xl mx-auto bg-primary rounded-[40px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 relative z-10"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none">Your future in real estate <br/>is synchronized.</h2>
            <p className="max-w-xl mx-auto text-lg text-white/70 font-medium">Join the next generation of property agents today. No setup fees, no legacy data migration headaches.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/register" className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-100 transition shadow-xl shadow-black/10">
                Kickstart Free Trial
              </Link>
              <Link href="/login" className="px-10 py-5 rounded-2xl border border-white/20 font-bold hover:bg-white/10 transition text-lg">
                Member Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="footer-bg py-16 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="font-black text-2xl tracking-tighter text-primary">EstateFlow</div>
            <p className="text-slate-400 text-sm max-w-xs font-medium">Streamlining the world's most valuable transactions through data clarity.</p>
          </div>
          <div className="flex gap-12 text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-primary transition">Privacy Policy</Link>
            <Link href="/" className="hover:text-primary transition">Terms of Service</Link>
            <Link href="mailto:hello@estateflow.com" className="hover:text-primary transition">Support</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          © 2026 EstateFlow • Product of synchronized Labs • Built with Next.js & Node.js
        </div>
      </footer>
    </div>
  );
}
