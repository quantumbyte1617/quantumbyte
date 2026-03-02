import {
  Download,
  FileSearch,
  FileText,
  Image,
  Link,
  Wrench,
  QrCode,
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
  status: "live" | "coming-soon";
  tags: string[];
  accent: string;
  accentBg: string;
  progress?: number;
}

export const apps: App[] = [
  {
    icon: Download,
    title: "Social Media Video Downloader",
    description:
      "Download videos from YouTube, Instagram, TikTok, Twitter, and more. Paste a link, pick a format, and download.",
    href: "/downloader",
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
    href: "/reviewer",
    status: "live",
    tags: ["Arabic/English", "IFRS", "Audit", "AI"],
    accent: "text-accent-purple",
    accentBg: "bg-accent-purple",
  },
  {
    icon: Image,
    title: "Image Compressor",
    description:
      "Compress and resize images without losing quality. Supports PNG, JPEG, and WebP.",
    href: "#",
    status: "coming-soon",
    tags: ["PNG", "JPEG", "WebP"],
    accent: "text-accent-purple",
    accentBg: "bg-accent-purple",
    progress: 70,
  },
  {
    icon: FileText,
    title: "PDF Tools",
    description:
      "Merge, split, and convert PDFs. Simple tools for everyday document tasks.",
    href: "#",
    status: "coming-soon",
    tags: ["Merge", "Split", "Convert"],
    accent: "text-accent-pink",
    accentBg: "bg-accent-pink",
    progress: 45,
  },
  {
    icon: Link,
    title: "URL Shortener",
    description:
      "Shorten long URLs into clean, shareable links with click tracking.",
    href: "#",
    status: "coming-soon",
    tags: ["Short Links", "Analytics"],
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400",
    progress: 30,
  },
  {
    icon: QrCode,
    title: "QR Code Generator",
    description:
      "Generate QR codes for URLs, text, Wi-Fi, and contacts. Download as PNG or SVG.",
    href: "#",
    status: "coming-soon",
    tags: ["URL", "Wi-Fi", "vCard"],
    accent: "text-amber-400",
    accentBg: "bg-amber-400",
    progress: 20,
  },
  {
    icon: Wrench,
    title: "Dev Toolbox",
    description:
      "JSON formatter, Base64 encoder, color picker, regex tester, and more — all in one place.",
    href: "#",
    status: "coming-soon",
    tags: ["JSON", "Base64", "Regex"],
    accent: "text-rose-400",
    accentBg: "bg-rose-400",
    progress: 55,
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
