const SiteFooter = () => (
  <footer className="border-t border-border mt-10 py-8 px-5" style={{ background: "hsl(220 40% 5%)" }}>
    <div className="section-max-width grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <h4 className="text-primary font-bold text-sm mb-2.5">About</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Premium notebooks and stationery curated for students and professionals. Quality materials, thoughtful design.
        </p>
      </div>
      <div>
        <h4 className="text-primary font-bold text-sm mb-2.5">Quick Links</h4>
        <ul className="space-y-2">
          {["Home", "Shop", "Collections", "Blog"].map(l => (
            <li key={l}><a href="#" className="text-xs text-foreground/85 hover:text-foreground transition-colors">{l}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-primary font-bold text-sm mb-2.5">Customer Service</h4>
        <ul className="space-y-2">
          {["Shipping", "Returns", "Contact Us", "FAQs"].map(l => (
            <li key={l}><a href="#" className="text-xs text-foreground/85 hover:text-foreground transition-colors">{l}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-primary font-bold text-sm mb-2.5">Follow Us</h4>
        <div className="flex gap-2.5">
          {["IG", "FB", "TW"].map(s => (
            <a key={s} href="#" className="w-9 h-9 rounded-lg glass-surface flex items-center justify-center text-xs font-bold text-foreground hover:bg-muted transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="section-max-width mt-5 pt-3.5 border-t border-border/50">
      <small className="text-xs text-muted-foreground">© 2026 Sri Rama Notebook — All rights reserved.</small>
    </div>
  </footer>
);

export default SiteFooter;
