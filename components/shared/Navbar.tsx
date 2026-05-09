export default function Navbar() {
  return (
    <nav className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 mix-blend-difference text-zinc-50 uppercase font-mono text-[10px] tracking-[0.2em]">
      <div className="flex justify-between items-start pointer-events-auto">
        <div>Arsip_Dokumentasi_v1.0</div>
        <div>JKT // IDN</div>
      </div>
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="rotate-180 [writing-mode:vertical-lr]">
          Scroll_to_explore
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:line-through">
            About
          </a>
          <a href="#" className="hover:line-through">
            Index
          </a>
        </div>
      </div>
    </nav>
  );
}
