import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, MapPin, Mail, Phone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addSubmission } from "@/lib/submissions";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919220612315";

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) errs.phone = "Invalid phone number";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // Simulate async submission
      await new Promise((res) => setTimeout(res, 800));
      addSubmission(form);
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in your web development services.")}`;

  const inputClass = (field: keyof typeof form) =>
    `w-full bg-card border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">Contact Us</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
            Let's Build Something <span className="text-gradient-gold">Amazing</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {(["name", "email", "phone"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={field} className="sr-only">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  placeholder={field === "name" ? "Your Name" : field === "email" ? "Your Email" : "Phone Number"}
                  value={form[field]}
                  onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: undefined }); }}
                  className={inputClass(field)}
                  aria-describedby={errors[field] ? `${field}-error` : undefined}
                />
                {errors[field] && (
                  <p id={`${field}-error`} className="text-destructive text-xs mt-1 font-body">{errors[field]}</p>
                )}
              </div>
            ))}

            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: undefined }); }}
                className={`${inputClass("message")} resize-none`}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-destructive text-xs mt-1 font-body">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 shadow-gold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
            </button>
          </motion.form>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-display font-bold text-foreground mb-4">Get In Touch</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                Ready to elevate your online presence? Contact us today for a free consultation. We serve businesses across Delhi, Mumbai, and all of India.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: MapPin, text: "Delhi, India" },
                { icon: Mail, text: "hello@devcraft.in" },
                { icon: Phone, text: "+91 92206 12315" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="text-muted-foreground font-body text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[hsl(142,70%,40%)] text-white px-6 py-3 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle size={18} aria-hidden="true" /> Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
