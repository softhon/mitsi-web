import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  // Monitor,
  // MessageCircle,
  Zap,
  Check,
  Github,
  // Star,
  // GitFork,
  Users,
  ArrowRight,
  Play,
  Shield,
  Globe,
  // Cpu,
  // ChevronDown,
  Sparkles,
  Clock,
  // Lock,
  Layers,
  BarChart3,
  Headphones,
} from 'lucide-react';

const MitsiLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: Video,
      title: '4K Ultra HD',
      subtitle: 'Crystal Clear Video',
      description:
        'AI-enhanced video processing with automatic background optimization and intelligent framing.',
      metrics: 'Up to 4K@60fps',
    },
    {
      icon: Zap,
      title: 'Sub-25ms',
      subtitle: 'Lightning Fast',
      description:
        'Industry-leading latency powered by our custom Mediasoup SFU implementation.',
      metrics: '< 25ms globally',
    },
    {
      icon: Shield,
      title: 'Zero-Trust',
      subtitle: 'Military Grade Security',
      description:
        'End-to-end encryption with quantum-resistant algorithms and compliance certifications.',
      metrics: 'AES-256 + E2EE',
    },
    {
      icon: Globe,
      title: '20K+ Users',
      subtitle: 'Infinite Scale',
      description:
        'Distributed architecture that grows with your organization without performance degradation.',
      metrics: 'Auto-scaling SFU',
    },
  ];

  const techSpecs = [
    { label: 'Latency', value: '< 25ms', icon: Clock },
    { label: 'Concurrent Users', value: '20,000+', icon: Users },
    { label: 'Uptime SLA', value: '99.99%', icon: BarChart3 },
    { label: 'Audio Quality', value: '48kHz', icon: Headphones },
  ];

  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
          }}
        />

        {/* Floating Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
              transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.1}px)`,
            }}
          />
        </div>

        {/* Ambient Orbs */}
        <div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ transform: `translateY(${-parallaxOffset}px)` }}
        />
      </div>

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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-light tracking-wider">
                  Mitsi
                </span>
                <div className="text-xs text-slate-400 -mt-1">Ultra</div>
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
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-white/5"
              >
                <Github className="w-4 h-4 mr-2" />
                Source
              </Button>
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
            {/* Premium Badge */}
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 px-6 py-3 text-sm font-light tracking-wide backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Introducing Mitsi Ultra
              </Badge>
            </div>

            {/* Hero Headlines */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tighter leading-none">
                <span className="block text-white/90">The future of</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-light">
                  meetings
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-extralight tracking-wide">
                Ultra-low latency video conferencing that feels like being in
                the same room.
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

            {/* Tech Specs Bar */}
            <div className="pt-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {techSpecs.map((spec, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                      <spec.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-light text-white mb-1">
                      {spec.value}
                    </div>
                    <div className="text-sm text-slate-400 font-light">
                      {spec.label}
                    </div>
                  </div>
                ))}
              </div>
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

      {/* Features Section - Premium Redesign */}
      <section id="features" className="py-32 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-extralight tracking-tight mb-8 text-white/90">
              Engineered for
              <span className="block text-slate-400">excellence</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Every component meticulously crafted for performance, security,
              and scale.
              <br />
              This is what professional-grade video conferencing looks like.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group bg-gradient-to-br from-white/5 to-white/2 border-white/10 backdrop-blur-xl hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-500 overflow-hidden relative"
              >
                <CardContent className="p-12">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10">
                      <feature.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20 font-light">
                      {feature.metrics}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-light text-white mb-2">
                        {feature.title}
                      </div>
                      <div className="text-lg text-slate-400 font-light">
                        {feature.subtitle}
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-light text-lg">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section
        id="technology"
        className="py-32 px-8 bg-gradient-to-b from-transparent to-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-5xl font-extralight tracking-tight mb-8 text-white/90">
                  Mediasoup SFU
                  <span className="block text-slate-400 text-3xl mt-2">
                    Next-generation architecture
                  </span>
                </h3>
                <p className="text-xl text-slate-300 leading-relaxed font-light">
                  Our custom-built Selective Forwarding Unit delivers
                  unprecedented performance with intelligent routing, adaptive
                  bitrate, and zero-compromise quality.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Global Edge Network', value: '150+ locations' },
                  { label: 'Concurrent Streams', value: 'Unlimited' },
                  { label: 'Failover Time', value: '< 100ms' },
                  { label: 'Quality Adaptation', value: 'Real-time' },
                ].map((metric, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-4 border-b border-white/10"
                  >
                    <span className="text-slate-300 font-light">
                      {metric.label}
                    </span>
                    <span className="text-white font-light">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-3xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="space-y-6">
                  {/* Network Visualization */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 p-6">
                    <div className="absolute inset-4 flex items-center justify-center">
                      <div className="relative">
                        {/* Central Node */}
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                          <Layers className="w-8 h-8 text-white" />
                        </div>

                        {/* Connected Nodes */}
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-8 h-8 bg-blue-400/30 rounded-full border-2 border-blue-400/50 animate-pulse"
                            style={{
                              top: `${Math.cos((i * Math.PI * 2) / 6) * 60 + 24}px`,
                              left: `${Math.sin((i * Math.PI * 2) / 6) * 60 + 24}px`,
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}

                        {/* Connection Lines */}
                        <svg
                          className="absolute inset-0 w-32 h-32"
                          style={{ top: '-16px', left: '-16px' }}
                        >
                          {[...Array(6)].map((_, i) => (
                            <line
                              key={i}
                              x1="32"
                              y1="32"
                              x2={Math.sin((i * Math.PI * 2) / 6) * 60 + 32}
                              y2={Math.cos((i * Math.PI * 2) / 6) * 60 + 32}
                              stroke="rgba(59, 130, 246, 0.3)"
                              strokeWidth="1"
                              className="animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="text-2xl font-light text-green-400">
                        99.9%
                      </div>
                      <div className="text-xs text-green-300">Uptime</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <div className="text-2xl font-light text-blue-400">
                        25ms
                      </div>
                      <div className="text-xs text-blue-300">Latency</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="text-2xl font-light text-purple-400">
                        20K+
                      </div>
                      <div className="text-xs text-purple-300">Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
