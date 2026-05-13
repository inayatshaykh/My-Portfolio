import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-dubai.jpg";

const HeroSection = () => (
  <section
    id="home"
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="Dubai skyline" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
    </div>

    <div className="container relative z-10 mx-auto px-4 text-center py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block text-primary font-body text-sm font-semibold tracking-widest uppercase mb-4">
          India's Premier Web Agency
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6">
          Premium Website
          <br />
          <span className="text-gradient-gold">Development Services</span>
          <br />
          in Delhi, India
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body">
          We build high-converting, modern websites for your business. Fast delivery, SEO optimized, and stunning design.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="bg-gradient-gold text-primary-foreground px-8 py-4 rounded-md text-base font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 shadow-gold"
          >
            Get a Free Quote <ArrowRight size={18} />
          </a>
          <a
            href="#services"
            className="border border-primary/40 text-primary px-8 py-4 rounded-md text-base font-semibold hover:bg-primary/10 transition-colors inline-flex items-center justify-center"
          >
            View Services
          </a>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-20"
      >
        {[
          { value: "150+", label: "Projects Delivered" },
          { value: "98%", label: "Client Satisfaction" },
          { value: "5+", label: "Years Experience" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-3xl md:text-4xl font-display font-bold text-gradient-gold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1 font-body">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
