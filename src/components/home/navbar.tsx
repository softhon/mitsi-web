import uniqid from 'uniqid';
import { Github, Video } from 'lucide-react';
import { Button } from '../ui/button';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const roomId = uniqid.time();
  const openJoinPage = useCallback(() => {
    navigate(roomId);
  }, [roomId, navigate]);
  return (
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
              <span className="text-2xl font-light tracking-wider">Mitsi</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-12">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
            >
              Documentations
            </a>
            <a
              href="#technology"
              className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
            >
              Projects
            </a>
            <a
              href="#enterprise"
              className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
            >
              Community
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
            <Button
              onClick={openJoinPage}
              className="bg-linear-to-r text-white from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-xl"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
