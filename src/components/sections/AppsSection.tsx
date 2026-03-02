"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import PhoneFrame from "@/components/mockups/PhoneFrame";
import FeaturedAppMockupContent from "@/components/mockups/FeaturedAppMockupContent";
import { apps } from "@/lib/constants";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

export default function AppsSection() {
  const featuredApp = apps.find((a) => a.status === "live");
  const otherApps = apps.filter((a) => a !== featuredApp);

  return (
    <section id="apps" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Apps Developed"
          subtitle="Tools we've built to solve real problems. Simple, fast, and free to use."
        />

        {/* Featured App — Full Width */}
        {featuredApp && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="mb-10"
          >
            <div className="featured-card rounded-2xl p-8 md:p-10 group">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors">
                      <featuredApp.icon
                        size={28}
                        className="text-accent-cyan"
                      />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20 flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Live
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-accent-cyan transition-colors">
                    {featuredApp.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed mb-6 max-w-lg">
                    {featuredApp.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredApp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs rounded-lg bg-accent-cyan/8 text-accent-cyan/80 border border-accent-cyan/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={featuredApp.href}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-medium text-bg-primary hover:opacity-90 transition-all glow-cyan-sm text-sm"
                  >
                    Open App
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Phone mockup */}
                <div className="hidden md:block relative flex-shrink-0">
                  {/* Ambient glow */}
                  <div className="absolute -inset-6 -z-10">
                    <Image
                      src="/images/featured-ambient.webp"
                      alt=""
                      fill
                      className="object-cover ambient-image blur-xl rounded-3xl"
                      sizes="400px"
                    />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-b from-accent-cyan/6 to-accent-purple/6 blur-2xl rounded-3xl -z-10" />
                  <PhoneFrame>
                    <FeaturedAppMockupContent />
                  </PhoneFrame>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other Apps Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {otherApps.map((app) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.title}
                variants={fadeInUp}
                className="glass-card rounded-xl p-7 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/8 transition-colors`}>
                    <Icon size={24} className={app.accent} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20 flex items-center gap-1">
                      <Sparkles size={10} />
                      Live
                    </span>
                </div>

                <h3 className={`text-lg font-semibold mb-2 text-text-primary group-hover:${app.accent} transition-colors`}>
                  {app.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-5 flex-1">
                  {app.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-white/4 text-text-muted/80 border border-white/4"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={app.href}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-medium text-bg-primary hover:opacity-90 transition-all glow-cyan-sm text-xs"
                >
                  Open App
                  <ArrowRight size={14} />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
