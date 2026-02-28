import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg({ text: "Please enter a valid email address.", ok: false });
      return;
    }
    setMsg({ text: "Thanks — you're subscribed!", ok: true });
    setEmail("");
  };

  return (
    <section className="section-max-width px-5 my-8" id="newsletter">
      <div className="rounded-2xl p-7 text-center" style={{ background: 'linear-gradient(180deg, hsl(340 60% 90% / 0.15) 0%, hsl(340 70% 75% / 0.45) 100%)' }}>
        <h3 className="text-xl font-extrabold text-foreground">Join our newsletter</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-5">Get updates on new arrivals and exclusive offers.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto" noValidate>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl bg-muted border-0 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button type="submit" className="px-5 py-3 rounded-xl gradient-cta font-extrabold text-sm whitespace-nowrap">
            Subscribe
          </button>
        </form>
        {msg && (
          <p className={`mt-3 text-sm font-medium ${msg.ok ? "text-primary" : "text-destructive"}`}>
            {msg.text}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
