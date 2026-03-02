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
  tagline: "A platform of useful tools",
  description:
    "Free, fast, and simple tools built to make your life easier. No sign-ups, no fluff — just tools that work.",
  email: "hello@quantumbyte.app",
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Apps", href: "#apps" },
  { label: "Playground", href: "#playground" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export interface App {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  status: "live";
  tags: string[];
  accent: string;
  accentBg: string;
}

export const apps: App[] = [
  {
    icon: Download,
    title: "Social Media Video Downloader",
    description:
      "Download videos from YouTube, Instagram, TikTok, Twitter, and more. Paste a link, pick a format, and download.",
    href: "/Video_downloader",
    status: "live",
    tags: ["YouTube", "Instagram", "TikTok", "Twitter"],
    accent: "text-accent-cyan",
    accentBg: "bg-accent-cyan",
  },
  {
    icon: FileSearch,
    title: "Financial Statements Reviewer",
    description:
      "AI-powered cross-checking of Arabic and English financial statements. Validates numbers, terminology, and IFRS compliance.",
    href: "/FS_reviewer",
    status: "live",
    tags: ["Arabic/English", "IFRS", "Audit", "AI"],
    accent: "text-accent-purple",
    accentBg: "bg-accent-purple",
  },
  {
    icon: MessageSquare,
    title: "AI Discussion",
    description:
      "A real-time AI discussion room where Claude, GPT, and Gemini debate any topic you choose. Watch the models think, argue, and agree.",
    href: "/ai_discussion",
    status: "live",
    tags: ["Claude", "GPT", "Gemini", "Real-time"],
    accent: "text-accent-pink",
    accentBg: "bg-accent-pink",
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
