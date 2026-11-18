export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-neutral-500 md:flex-row">
        <span>© {new Date().getFullYear()} Lamas Fitness — Personal Trainer</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-red-500">
            Instagram
          </a>
          <a href="#" className="hover:text-red-500">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
