import Spline from '@splinetool/react-spline';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10) setHintVisible(false);
      else setHintVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050a14]">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/YMbQm4jphL7pTceL/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(0,240,255,0.35)]">
            NEXUS
          </h1>
          <p className="mt-4 text-lg md:text-xl text-cyan-100/80 max-w-xl mx-auto">
            The Neon Grid — a cyberpunk studio forging immersive digital worlds.
          </p>
        </div>
      </div>
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">
        <div className={`transition-opacity duration-700 ${hintVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 text-cyan-100/80">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_12px_#00f0ff]" />
            <span className="text-sm md:text-base tracking-widest">SCROLL TO EXPLORE</span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#f000ff] animate-pulse shadow-[0_0_12px_#f000ff]" />
          </div>
        </div>
      </div>
    </section>
  );
}
