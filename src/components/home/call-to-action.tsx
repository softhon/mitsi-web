import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-32 px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-extralight tracking-tight mb-8 text-white/90">
          Ready to elevate
          <span className="block text-slate-400">your meetings?</span>
        </h2>

        <p className="text-xl text-slate-400 mb-16 font-light max-w-2xl mx-auto leading-relaxed">
          Get started with Mitsi today and transform the way your meetings
        </p>

        <div className="space-y-8">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-16 py-6 text-lg font-light shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
            Get Started
            <ArrowRight className="w-6 h-6 ml-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
