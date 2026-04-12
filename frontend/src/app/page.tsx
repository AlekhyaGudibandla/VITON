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
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Upload Your Photo",
    description:
      "Take or upload a clear front-facing photo showing your upper body.",
  },
  {
    icon: Shirt,
    title: "Choose Clothing",
    description:
      "Upload a clothing image or paste a product URL from any fashion store.",
  },
  {
    icon: Wand2,
    title: "AI Magic",
    description:
      "Our AI detects your pose, warps the clothing, and generates a realistic preview.",
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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[200px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-8 animate-float">
            <Sparkles className="w-4 h-4 text-primary-light" />
            <span className="text-sm font-medium text-primary-light">
              AI-Powered Fashion Technology
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Try Before You{" "}
            <span className="gradient-text">Buy</span>
            <br />
            <span className="text-muted text-3xl sm:text-4xl lg:text-5xl font-normal mt-2 block">
              Virtual Fitting Room Powered by AI
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your photo and any clothing item. Our AI will show you
            exactly how it looks on you — no fitting room needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              id="start-tryon-btn"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary/90 transition-all duration-300 glow-hover shadow-2xl"
            >
              <Sparkles className="w-5 h-5" />
              Start Try-On
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl font-semibold text-lg text-foreground border border-border hover:border-primary/50 hover:bg-card transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Three simple steps to see your perfect outfit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group glass rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-300 glass-hover"
                >
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary-light text-sm font-bold mb-6">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary-light" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className="w-8 h-8 text-primary-light mx-auto mb-3" />
                    <div className="text-3xl font-bold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your{" "}
            <span className="gradient-text">Perfect Fit</span>?
          </h2>
          <p className="text-lg text-muted mb-10 leading-relaxed">
            Stop guessing and start knowing. See exactly how clothes will look
            on you before you buy.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary/90 transition-all glow animate-pulse-glow shadow-2xl"
          >
            <Sparkles className="w-6 h-6" />
            Try It Now — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold gradient-text">VirtualFit</span>
          </div>
          <p className="text-sm text-muted">
            © 2026 VirtualFit. AI-Powered Virtual Try-On.
          </p>
        </div>
      </footer>
    </div>
  );
}
