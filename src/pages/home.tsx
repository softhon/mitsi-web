import { useRef } from 'react';
import { Button } from '@/components/ui/button';

import { Video, Check, Github, ArrowRight, Play } from 'lucide-react';
import DynamicBg from '@/components/dynamic-bg';

const MitsiLanding = () => {
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <DynamicBg />

      {/* Premium Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrollY > 50
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-bl from-white/15 to-white/1  backdrop-blur-xl rounded-xl flex items-center justify-center shadow-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" /> */}
              </div>
              <div>
                <span className="text-2xl font-light tracking-wider">
                  Mitsi
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-12">
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
              >
                Platform
              </a>
              <a
                href="#technology"
                className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
              >
                Technology
              </a>
              <a
                href="#enterprise"
                className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
              >
                Enterprise
              </a>
              <div className="h-6 w-px bg-slate-700" />

              <a href="https://github.com/softhon" target="_blank">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Source
                </Button>
              </a>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-xl">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Completely Redesigned */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="space-y-12">
            {/* Hero Headlines */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tighter leading-none">
                <span className="block text-white/90">The future of</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-light">
                  meetings
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-extralight tracking-wide">
                An open source video conferencing that feels like being in the
                same room.
                <br className="hidden md:block" />
                Built for teams who demand perfection.
              </p>
            </div>

            {/* Premium CTA */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-12 py-6 text-lg font-light shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Experience Mitsi
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/5 hover:border-white/40 px-12 py-6 text-lg font-light backdrop-blur-sm"
              >
                Watch Demo
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-extralight tracking-tight mb-8 text-white/90">
            Ready to elevate
            <span className="block text-slate-400">your meetings?</span>
          </h2>

          <p className="text-xl text-slate-400 mb-16 font-light max-w-2xl mx-auto leading-relaxed">
            Join forward-thinking organizations using Mitsi to transform their
            communication.
          </p>

          <div className="space-y-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-16 py-8 text-xl font-light shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
            >
              Start Your Trial
              <ArrowRight className="w-6 h-6 ml-4" />
            </Button>

            <div className="flex justify-center items-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Enterprise support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-light tracking-wider">Mitsi</span>
                <div className="text-xs text-slate-400">Ultra</div>
              </div>
            </div>

            <div className="flex items-center space-x-8 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-white transition-colors">
                API
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-500 text-sm">
            © 2025 Mitsi Ultra. Redefining communication.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MitsiLanding;
