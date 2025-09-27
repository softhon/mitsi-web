const Decoration = () => {
  return (
    <>
      {/* Top section decorations */}
      <div className="absolute top-20 left-8 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse" />
      <div className="absolute top-32 left-20 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-pulse delay-700" />
      <div className="absolute top-16 right-16 w-2 h-2 bg-cyan-400/35 rounded-full animate-pulse delay-300" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-blue-200/50 rounded-full animate-pulse delay-1200" />

      {/* Middle section decorations */}
      <div className="absolute top-1/2 left-12 w-2.5 h-2.5 bg-indigo-400/25 rounded-full animate-pulse delay-500" />
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-violet-300/40 rounded-full animate-pulse delay-900" />
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-300/45 rounded-full animate-pulse delay-1500" />
      <div className="absolute top-1/2 right-12 w-2 h-2 bg-teal-400/30 rounded-full animate-pulse delay-200" />

      {/* Bottom section decorations */}
      <div className="absolute bottom-1/4 left-10 w-3 h-3 bg-purple-400/35 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-200/40 rounded-full animate-pulse delay-1800" />
      <div className="absolute bottom-1/4 right-10 w-2.5 h-2.5 bg-cyan-300/25 rounded-full animate-pulse delay-600" />
      <div className="absolute bottom-32 right-20 w-1.5 h-1.5 bg-indigo-300/35 rounded-full animate-pulse delay-400" />

      {/* Corner decorations */}
      <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-blue-400/30 rounded-full animate-pulse delay-1100" />
      <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-purple-300/25 rounded-full animate-pulse delay-800" />
      <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-teal-300/40 rounded-full animate-pulse delay-1400" />
      <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-violet-400/35 rounded-full animate-pulse delay-100" />

      {/* Floating rings */}
      <div className="absolute top-1/3 left-1/4 w-8 h-8 border border-blue-400/20 rounded-full animate-pulse delay-2000" />
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 border border-purple-400/15 rounded-full animate-pulse delay-1600" />
      <div className="absolute top-2/3 left-1/6 w-4 h-4 border border-cyan-400/25 rounded-full animate-pulse delay-2200" />

      {/* Additional scattered dots */}
      <div className="absolute top-1/5 left-1/3 w-0.5 h-0.5 bg-blue-300/60 rounded-full animate-pulse delay-300" />
      <div className="absolute top-4/5 left-2/3 w-0.5 h-0.5 bg-purple-200/50 rounded-full animate-pulse delay-1700" />
      <div className="absolute top-1/6 right-1/3 w-1 h-1 bg-indigo-200/40 rounded-full animate-pulse delay-2400" />
      <div className="absolute bottom-1/6 left-1/2 w-0.5 h-0.5 bg-cyan-300/55 rounded-full animate-pulse delay-900" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/5 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full animate-pulse delay-1300 blur-sm" />
      <div className="absolute bottom-1/4 left-1/5 w-16 h-16 bg-gradient-to-tr from-purple-500/8 to-cyan-500/4 rounded-full animate-pulse delay-1900 blur-md" />
      <div className="absolute top-1/2 left-1/8 w-10 h-10 bg-gradient-to-bl from-indigo-500/12 to-teal-500/6 rounded-full animate-pulse delay-2600 blur-sm" />
    </>
  );
};

export default Decoration;
