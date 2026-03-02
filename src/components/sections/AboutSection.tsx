"use client";

import { motion } from "framer-motion";
import { Zap, Lock, Code2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  fadeInUp,
  staggerContainer,
  viewportConfig,
} from "@/lib/animations";

const values = [
  {
    icon: Zap,
    title: "Fast & Simple",
    description: "No sign-ups, no ads wall. Open a tool, use it, done.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data stays on your device. We don't store or track anything.",
  },
  {
    icon: Code2,
    title: "Built in the Open",
    description: "Open-source tools you can inspect, contribute to, or self-host.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="About QuantumByte"
          subtitle="A growing collection of tools built with one goal — be useful."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="text-center p-8 rounded-xl bg-bg-card border border-border"
              >
                <div className="w-14 h-14 rounded-lg bg-accent-cyan/10 flex items-center justify-center mx-auto mb-5">
                  <Icon size={28} className="text-accent-cyan" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="max-w-2xl mx-auto text-center text-text-muted leading-relaxed"
        >
          <p>
            QuantumByte started as a personal project — a place to host small
            utilities that kept being useful. Over time it grew into a platform.
            Every tool here exists because someone needed it and it didn&apos;t
            need to be complicated.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
