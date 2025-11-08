import TopNav from './components/TopNav';
import HeroSection from './components/HeroSection';
import NeonGridScene from './components/NeonGridScene';
import InfoSections from './components/InfoSections';

function App() {
  return (
    <div className="font-inter bg-[#050a14] text-white">
      <TopNav />
      <HeroSection />
      <NeonGridScene />
      <InfoSections />
      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center text-cyan-100/60">
          © {new Date().getFullYear()} NEXUS Studio — The Neon Grid
        </div>
      </footer>
    </div>
  );
}

export default App;
