"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig, socialLinks } from "@/lib/constants";
import {
  slideInLeft,
  slideInRight,
  viewportConfig,
} from "@/lib/animations";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted/50 focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/20 transition-all duration-300 text-sm";

  return (
    <section id="contact" className="py-24 px-6 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Contact"
          subtitle="Have a suggestion, found a bug, or want to say hi?"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-5"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClasses}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputClasses}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <textarea
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className={`${inputClasses} resize-none`}
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="group px-8 py-3.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-medium text-bg-primary hover:opacity-90 transition-all duration-300 glow-cyan flex items-center gap-2"
            >
              {submitted ? "Sent!" : "Send Message"}
              <Send
                size={16}
                className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>

            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-accent-cyan text-sm"
              >
                Thanks! We&apos;ll get back to you.
              </motion.p>
            )}
          </motion.form>

          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div className="p-6 rounded-xl bg-bg-card border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-accent-cyan" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Email</h4>
                  <p className="text-text-muted text-sm">{siteConfig.email}</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-card border border-border">
              <h4 className="font-medium text-text-primary mb-4">Find Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30 hover:bg-accent-cyan/5 transition-all duration-300"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
