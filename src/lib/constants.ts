import {
  Download,
  FileSearch,
  MessageSquare,
  Github,
  Twitter,
  Linkedin,
  Mail,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "QuantumByte",
  tagline: "Free tools that just work",
  description:
    "Fast, free, and simple tools built to make your life easier. No sign-ups, no fluff.",
  email: "hello@quantumbyte.app",
};

export const navLinks = [
  { label: "Tools", href: "#tools" },
  { label: "Playground", href: "#playground" },
];

export interface App {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  tags: string[];
  accent: string;
}

export const apps: App[] = [
  {
    icon: Download,
    title: "Video Downloader",
    description:
      "Download videos from YouTube, Instagram, TikTok, and more. Paste a link, pick a format, done.",
    href: "/Video_downloader",
    tags: ["YouTube", "Instagram", "TikTok", "Twitter"],
    accent: "text-accent-cyan",
  },
  {
    icon: FileSearch,
    title: "FS Reviewer",
    description:
      "AI-powered cross-checking of Arabic and English financial statements. Validates numbers, terminology, and IFRS compliance.",
    href: "/FS_reviewer",
    tags: ["Arabic/English", "IFRS", "Audit", "AI"],
    accent: "text-accent-purple",
  },
  {
    icon: MessageSquare,
    title: "AI Discussion",
    description:
      "A real-time discussion room where Claude, GPT, and Gemini debate any topic you choose.",
    href: "/ai_discussion",
    tags: ["Claude", "GPT", "Gemini", "Real-time"],
    accent: "text-accent-pink",
  },
];

export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@quantumbyte.app", label: "Email" },
];
