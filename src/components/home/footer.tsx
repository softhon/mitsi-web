import { Video } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-8 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-bl from-white/15 to-white/1  backdrop-blur-xl rounded-xl flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-light tracking-wider">Mitsi</span>
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
          © 2025 Mitsi. Redefining communication.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
