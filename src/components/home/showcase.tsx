import { Assets } from '@/assets';

const Showcase = () => {
  return (
    <section id="features" className="py-32 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-extralight tracking-tight mb-8 text-white/90">
            Engineered for
            <span className="block text-slate-400">excellence</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Every component meticulously crafted for performance, security, and
            scale.
            <br />
            This is what professional-grade video conferencing looks like.
          </p>
        </div>

        <div className="p-2 rounded-lg border-transparent  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 ">
          <img src={Assets.mitsiUi} alt="mitui" className="rounded-lg" />
        </div>
      </div>
    </section>
  );
};

export default Showcase;
