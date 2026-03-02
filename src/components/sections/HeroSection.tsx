"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ChevronDown } from "lucide-react";
import ParticleCanvas from "@/components/effects/ParticleCanvas";
import BrowserFrame from "@/components/mockups/BrowserFrame";
import HeroMockupContent from "@/components/mockups/HeroMockupContent";
import {
  heroTextReveal,
  staggerContainer,
  fadeIn,
  mockupReveal,
} from "@/lib/animations";
import { siteConfig } from "@/lib/constants";

export default function HeroSection() {
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <ParticleCanvas />
      <div className="mesh-gradient" />

      {/* Ambient background image */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src="/images/hero-ambient.webp"
          alt=""
          fill
          className="object-cover ambient-image blur-2xl scale-110"
          priority
          sizes="100vw"
        />
      </div>

      <div className="orb w-[600px] h-[600px] bg-accent-purple/20 -top-40 -left-40" />
      <div className="orb w-[500px] h-[500px] bg-accent-cyan/12 -bottom-28 -right-28" />
      <div className="orb w-[300px] h-[300px] bg-accent-pink/8 top-1/3 right-1/4" />

      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Text content */}
        <motion.div
          className="text-center lg:text-left"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeIn} className="mb-8">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium border border-accent-cyan/20 text-accent-cyan bg-accent-cyan/5">
              <span className="w-2 h-2 rounded-full bg-accent-cyan mr-2 animate-pulse" />
              Free &amp; Open Tools
            </span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              variants={heroTextReveal}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter"
            >
              <span className="gradient-text text-glow-cyan">
                QuantumByte
              </span>
            </motion.h1>
          </div>

          <motion.p
            variants={heroTextReveal}
            className="text-base md:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            variants={heroTextReveal}
            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
          >
            <button
              onClick={() => handleScroll("#apps")}
              className="group px-8 py-3.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-medium text-bg-primary hover:opacity-90 transition-all duration-300 glow-cyan flex items-center gap-2"
            >
              Explore Apps
              <ArrowDown
                size={16}
                className="group-hover:translate-y-1 transition-transform"
              />
            </button>
            <button
              onClick={() => handleScroll("#playground")}
              className="px-8 py-3.5 border border-border rounded-lg font-medium text-text-primary hover:border-accent-cyan/30 hover:bg-accent-cyan/5 transition-all duration-300"
            >
              Try Playground
            </button>
          </motion.div>
        </motion.div>

        {/* Right: Browser mockup */}
        <motion.div
          variants={mockupReveal}
          initial="hidden"
          animate="visible"
          className="hidden md:block relative"
        >
          {/* Glow behind mockup */}
          <div className="absolute -inset-8 bg-gradient-to-r from-accent-cyan/8 to-accent-purple/8 blur-3xl rounded-3xl -z-10" />

          {/* Floating animation wrapper */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mockup-perspective"
          >
            <BrowserFrame url="quantumbyte.app">
              <HeroMockupContent />
            </BrowserFrame>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          onClick={() => handleScroll("#apps")}
          className="text-text-muted hover:text-accent-cyan transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown size={28} />
        </button>
      </motion.div>
    </section>
  );
}
