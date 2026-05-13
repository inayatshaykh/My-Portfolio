import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Al Mishk Premium Attars",
    role: "E-commerce — almishk.in",
    text: "DevCraft built us a stunning e-commerce platform that perfectly captures the luxury feel of our brand. Sales went up significantly after launch and our customers love how easy it is to browse and order. Truly professional work.",
    stars: 5,
    url: "https://almishk.in",
  },
  {
    name: "Nassk Hub",
    role: "Custom Merchandise Platform — nasskhub.vercel.app",
    text: "Our custom printing and merchandise store came to life exactly as we envisioned. The product catalog, cart, and order flow are seamless. DevCraft delivered on time and the quality of the code is excellent.",
    stars: 5,
    url: "https://nasskhub.vercel.app",
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">Testimonials</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
          What Our <span className="text-gradient-gold">Clients Say</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
          >
            <Quote className="text-primary/30 mb-3" size={28} />
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-5">"{t.text}"</p>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: t.stars }).map((_, j) => (
                <Star key={j} size={14} className="fill-primary text-primary" />
              ))}
            </div>
            <div className="font-display font-bold text-foreground">{t.name}</div>
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary/70 font-body hover:text-primary transition-colors"
            >
              {t.role}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
