import { motion } from "framer-motion";
import { Globe, Briefcase, ShoppingCart, Code2, Check, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Starter Website",
    price: "7,999",
    features: ["Up to 5 Pages", "Mobile Responsive", "Basic Contact Form", "Standard Delivery"],
    popular: false,
  },
  {
    icon: Briefcase,
    title: "Business Website",
    price: "17,999",
    features: ["Up to 10 Pages", "Custom Design", "On-Page SEO Setup", "Analytics Integration", "Social Media Links"],
    popular: true,
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Website",
    price: "34,999",
    features: ["Product Catalog", "Payment Gateway Integration", "Admin Panel", "Basic SEO Setup", "Standard Support"],
    popular: false,
  },
  {
    icon: Code2,
    title: "Custom Project",
    price: null,
    features: ["Scope-Based Pricing", "Custom Functionality", "API Integration", "Dedicated Communication"],
    popular: false,
  },
];

const ServicesSection = () => (
  <section id="services" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">Our Services</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
          Solutions That <span className="text-gradient-gold">Deliver Results</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto font-body">
          From startups to enterprises, we craft websites that drive growth for Indian businesses.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-xl p-6 border transition-all hover:-translate-y-1 hover:shadow-gold ${
              s.popular
                ? "border-primary bg-card shadow-gold"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            {s.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <s.icon className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-display font-bold text-foreground mb-2">{s.title}</h3>
            <div className="mb-5">
              {s.price ? (
                <span className="text-3xl font-display font-bold text-gradient-gold">
                  ₹ {s.price}
                </span>
              ) : (
                <span className="text-lg font-body font-semibold text-primary">Contact for Price</span>
              )}
            </div>
            <ul className="space-y-2 mb-6">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                  <Check size={14} className="text-primary flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-md text-sm font-semibold transition-all ${
                s.popular
                  ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
                  : "border border-primary/40 text-primary hover:bg-primary/10"
              }`}
            >
              {s.price ? "Order Now" : "Contact Us"} <ArrowRight size={16} />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
