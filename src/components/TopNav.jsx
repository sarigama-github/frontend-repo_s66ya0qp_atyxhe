export default function TopNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-30">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-white font-extrabold tracking-widest text-xl">
          NEXUS
        </a>
        <nav className="hidden md:flex items-center gap-6 text-cyan-100/80">
          <a href="#" className="hover:text-white">Work</a>
          <a href="#" className="hover:text-white">Services</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
      </div>
    </header>
  );
}
