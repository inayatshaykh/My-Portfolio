import { motion } from "framer-motion";
import { Zap, Search, Palette, ShieldCheck, Headphones, Rocket } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Fast Delivery", desc: "Launch your website in as little as 7 days. We respect your timeline and deliver on schedule." },
  { icon: Search, title: "SEO Optimized", desc: "Built with search engines in mind so your Indian business ranks higher on Google from day one." },
  { icon: Palette, title: "Modern Design", desc: "Stunning, conversion-focused designs that reflect the premium standards of the Indian market." },
  { icon: ShieldCheck, title: "Secure & Reliable", desc: "SSL certificates, regular backups, and enterprise-grade hosting to keep your site safe 24/7." },
  { icon: Headphones, title: "Dedicated Support", desc: "Ongoing maintenance and priority support so you're never left without help when you need it." },
  { icon: Rocket, title: "Performance First", desc: "Lightning-fast load times optimized for mobile users across India and beyond." },
];

const BenefitsSection = () => (
  <section id="benefits" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">Why Choose Us</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
          Built for <span className="text-gradient-gold">Success</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto font-body">
          Every project we deliver is engineered for performance, beauty, and results.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-gold transition-shadow">
              <b.icon size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-display font-bold text-foreground mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
