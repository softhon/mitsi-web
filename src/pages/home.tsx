import DynamicBg from '@/components/dynamic-bg';
import Navbar from '@/components/home/navbar';
import Hero from '@/components/home/hero';
import CallToAction from '@/components/home/call-to-action';
import Footer from '@/components/home/footer';
import Showcase from '@/components/home/showcase';

const MitsiLanding = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <DynamicBg />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section  */}
      <Hero />

      {/* Showcase section */}
      <Showcase />

      {/*  CTA */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MitsiLanding;
