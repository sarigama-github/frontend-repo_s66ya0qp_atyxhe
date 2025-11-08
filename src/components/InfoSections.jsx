export default function InfoSections() {
  return (
    <section id="contact" className="bg-[#050a14] text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(240,0,255,0.15)]">
            <h4 className="text-xl font-semibold tracking-wider">Approach</h4>
            <p className="mt-2 text-cyan-100/80">Strategy-first, design-forward, and built for performance across devices.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <h4 className="text-xl font-semibold tracking-wider">Stack</h4>
            <p className="mt-2 text-cyan-100/80">Three.js, shaders, motion systems, and modern frameworks that scale.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(255,255,255,0.12)]">
            <h4 className="text-xl font-semibold tracking-wider">Focus</h4>
            <p className="mt-2 text-cyan-100/80">Web experiences, visual identity, and cinematic storytelling.</p>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-[#00f0ff]/10 via-transparent to-[#f000ff]/10 p-8">
          <h3 className="text-3xl md:text-4xl font-bold">Ready to start?</h3>
          <p className="mt-2 text-cyan-100/80">Send us a brief and we’ll respond within 24 hours.</p>
          <form className="mt-6 grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Name" className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400/70" />
            <input type="email" placeholder="Email" className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400/70" />
            <input type="text" placeholder="Company" className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400/70 md:col-span-2" />
            <textarea placeholder="Project details" rows="4" className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400/70 md:col-span-2" />
            <div className="md:col-span-2">
              <button type="submit" className="rounded-full border border-cyan-400/60 bg-gradient-to-r from-[#00f0ff]/20 to-[#f000ff]/20 px-6 py-3 backdrop-blur text-white hover:from-[#00f0ff]/30 hover:to-[#f000ff]/30 transition shadow-[0_0_20px_rgba(0,240,255,0.25)]">Send</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
