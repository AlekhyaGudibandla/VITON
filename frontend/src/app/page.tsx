"use client";

import Link from "next/link";
import {
  Sparkles,
  Camera,
  Shirt,
  Wand2,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Upload Your Photo",
    description:
      "Take or upload a clear front-facing photo showing your upper body.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Shirt,
    title: "Choose Clothing",
    description:
      "Upload a clothing image or paste a product URL from any fashion store.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Wand2,
    title: "AI Magic",
    description:
      "Our AI detects your pose, warps the clothing, and generates a realistic preview.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

const stats = [
  { icon: Zap, label: "Fast Generation", value: "5-20s" },
  { icon: Shield, label: "Secure & Private", value: "100%" },
  { icon: Clock, label: "Available", value: "24/7" },
];

export default function LandingPage() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-200/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-primary mb-10 animate-float shadow-sm border border-primary/10">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              AI-Powered Fashion Studio
            </span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-foreground">
            Wear the <br />
            <span className="text-primary italic">Future.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            The world's first minimalist virtual fitting room. <br className="hidden md:block" />
            Upload your clothes, see them on yourself instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl-soft bg-primary text-white font-bold text-lg hover:bg-primary-hover shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              Start Designing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl-soft bg-white border border-border text-foreground font-bold text-lg hover:bg-secondary/20 transition-all shadow-soft"
            >
              Enter Studio
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-sm font-bold uppercase tracking-widest text-muted">Trusted by 10k+ users</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Three Steps to <span className="text-primary italic">Perfect Style</span>
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto font-medium">
              We&apos;ve made virtual fitting as simple as a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative glass rounded-2xl-soft p-10 transition-all duration-300 glass-hover border-none"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted leading-relaxed font-medium">
                    {feature.description}
                  </p>
                  
                  <div className="absolute top-6 right-8 text-4xl font-black text-primary/5 italic select-none">
                    0{index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-primary rounded-3xl p-12 sm:p-20 shadow-glow relative overflow-hidden">
            {/* Abstract shapes for stat box */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center sm:text-left border-white/10 sm:odd:border-r sm:even:border-r last:border-0 pr-4">
                    <Icon className="w-8 h-8 text-primary-light mb-4 mx-auto sm:mx-0" />
                    <div className="text-4xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-primary-light font-bold uppercase tracking-wider text-xs">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="py-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-8">
                 <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                    Professional Grade <br/>
                    <span className="text-primary italic">AI Fitting Room</span>
                 </h2>
                 <p className="text-lg text-muted font-medium leading-relaxed">
                    Our proprietary model ensures every fold and texture is accurately represented, giving you the most realistic preview possible.
                 </p>
                 <ul className="space-y-4">
                    {[
                      "Realistic cloth draping & warping",
                      "Support for all clothing categories",
                      "High-resolution output results",
                      "Fast processing in under 15 seconds"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 font-semibold text-foreground">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        {item}
                      </li>
                    ))}
                 </ul>
                 <div className="pt-4">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all">
                       Explore features <ArrowRight className="w-5 h-5" />
                    </Link>
                 </div>
              </div>
              <div className="flex-1 relative">
                 <div className="relative z-10 rounded-2xl-soft overflow-hidden shadow-2xl rotate-3 scale-95 hover:rotate-0 hover:scale-100 transition-all duration-700">
                    <div className="aspect-[4/5] bg-secondary flex items-center justify-center p-8">
                        <Sparkles className="w-20 h-20 text-primary/20" />
                    </div>
                 </div>
                 <div className="absolute -inset-4 bg-primary/5 rounded-3xl -z-10 blur-xl" />
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center px-10 py-20 rounded-3xl bg-secondary/50 border border-primary/10 relative overflow-hidden">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tight">
            Ready to find your <span className="text-primary italic">Perfect Fit</span>?
          </h2>
          <p className="text-lg text-muted mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of users who are revolutionizing their shopping experience with VirtualFit.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl-soft font-bold text-xl text-white bg-primary hover:bg-primary-hover transition-all shadow-glow hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-6 h-6" />
            Try it for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
               <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">VirtualFit</span>
          </div>
          
          <div className="flex gap-8 text-sm font-semibold text-muted">
             <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
             <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>

          <p className="text-sm text-muted font-medium">
            © 2026 VirtualFit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
