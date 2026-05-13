import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How long does it take to build a website?", a: "Most projects are completed within 7–21 days depending on complexity. A basic website takes about 7 days, while custom or e-commerce sites may take 2–3 weeks." },
  { q: "Do you offer website maintenance after launch?", a: "Yes! All our packages include post-launch support (1–6 months depending on the plan). We also offer ongoing monthly maintenance packages starting from ₹1,499/month." },
  { q: "Can you redesign my existing website?", a: "Absolutely. We specialize in modern redesigns that improve user experience, speed, and conversion rates. Contact us for a free audit of your current site." },
  { q: "Do your websites work on mobile devices?", a: "Every website we build is fully responsive and optimized for all devices — smartphones, tablets, and desktops. Mobile-first design is our standard." },
  { q: "What payment methods do you accept?", a: "We accept bank transfers, credit/debit cards, and cash payments. For larger projects, we offer flexible payment plans — typically 50% upfront and 50% on delivery." },
  { q: "Will my website rank on Google?", a: "All our websites are built with SEO best practices including fast load times, clean code, meta tags, and mobile optimization. We also offer dedicated SEO packages for ongoing ranking improvements." },
  { q: "Do you provide hosting and domain registration?", a: "Yes, we can handle domain registration and premium hosting setup for you. Annual hosting packages start from ₹3,999/year with SSL included." },
];

const FaqSection = () => (
  <section id="faq" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">FAQ</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
          Frequently Asked <span className="text-gradient-gold">Questions</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border bg-card rounded-xl px-5 data-[state=open]:border-primary/40 transition-colors"
            >
              <AccordionTrigger className="text-left font-display font-semibold text-foreground text-sm hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-body text-sm leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FaqSection;
