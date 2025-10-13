import { useRef } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef(null);

  return (
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
  );
};

export default Hero;
