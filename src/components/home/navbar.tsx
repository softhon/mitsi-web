import uniqid from 'uniqid';
import { Github } from 'lucide-react';
import { Button } from '../ui/button';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Assets } from '@/assets';
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
              <img src={Assets.logo} className="w-8 h-8" alt="Logo" />

              {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" /> */}
            </div>
            <div>
              <span className="text-2xl font-light tracking-wider">Mitsi</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-12">
            <a
              title="Coming soon"
              href="#"
              className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
            >
              Documentations
            </a>
            <a
              title="Coming soon"
              href="#"
              className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
            >
              Projects
            </a>
            <a
              title="Coming soon"
              href="#"
              className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
            >
              Community
            </a>
            <div className="h-6 w-px bg-slate-700" />

            <a href="https://github.com/softhon/mitsi-web" target="_blank">
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
              className=" cursor-pointer bg-linear-to-r text-white from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-xl"
            >
              Host a Meeting
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
