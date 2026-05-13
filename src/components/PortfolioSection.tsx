import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import almishkImg from "@/assets/al mishk.png";
import nasskhubImg from "@/assets/nasskhub.png";

const projects = [
  {
    image: almishkImg,
    title: "Al Mishk Premium Attars",
    category: "E-commerce",
    desc: "Full-featured fragrance e-commerce store with product catalog, combo deals, cart, and WhatsApp ordering for a premium Indian attar brand.",
    url: "https://almishk.in",
  },
  {
    image: nasskhubImg,
    title: "Nassk Hub",
    category: "E-commerce / Print",
    desc: "Custom merchandise and printing platform with product categories, cart, and order management for a Delhi-based print business.",
    url: "https://nasskhub.vercel.app",
  },
];

const PortfolioSection = () => (
  <section id="portfolio" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">Portfolio</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
          Our <span className="text-gradient-gold">Recent Work</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-background/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-6">
              <span className="text-primary text-xs font-semibold tracking-widest uppercase font-body mb-2">{p.category}</span>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground font-body mb-5">{p.desc}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Visit Site <ExternalLink size={13} />
              </a>
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-foreground text-sm">{p.title}</h3>
                  <span className="text-xs text-primary font-body">{p.category}</span>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${p.title}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PortfolioSection;
