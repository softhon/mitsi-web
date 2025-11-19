import { useEffect, useState } from 'react';

const DynamicBg = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="fixed inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-black">
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
  );
};

export default DynamicBg;
