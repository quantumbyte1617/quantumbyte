"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Braces, Palette, KeyRound, Copy, Check, RefreshCw } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeInUp, viewportConfig } from "@/lib/animations";

const tabs = [
  { id: "json", label: "JSON Formatter", icon: Braces },
  { id: "password", label: "Password Gen", icon: KeyRound },
  { id: "color", label: "Color Picker", icon: Palette },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function PlaygroundSection() {
  const [activeTab, setActiveTab] = useState<TabId>("json");

  return (
    <section id="playground" className="py-28 px-6 bg-bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Playground"
          subtitle="Try tools right here — no downloads, no sign-ups."
        />

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
                      : "text-text-muted border border-transparent hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tool Area */}
          <div className="playground-glass p-6 md:p-8 min-h-[400px]">
            {activeTab === "json" && <JsonFormatter />}
            {activeTab === "password" && <PasswordGenerator />}
            {activeTab === "color" && <ColorPicker />}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── JSON Syntax Highlighter ─── */
function highlightJson(json: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let idx = 0;
  const regex = /("(?:[^"\\]|\\.)*")(\s*:)?|(\btrue\b|\bfalse\b)|(\bnull\b)|(-?\d+\.?\d*(?:[eE][+-]?\d+)?)|([{}[\],])|(\n)|( +)/g;
  let match;

  while ((match = regex.exec(json)) !== null) {
    const [, str, colon, bool, nul, num, punct, newline, spaces] = match;
    if (str) {
      if (colon) {
        tokens.push(<span key={idx++} className="json-key">{str}</span>);
        tokens.push(<span key={idx++} className="json-punctuation">{colon}</span>);
      } else {
        tokens.push(<span key={idx++} className="json-string">{str}</span>);
      }
    } else if (bool) {
      tokens.push(<span key={idx++} className="json-boolean">{bool}</span>);
    } else if (nul) {
      tokens.push(<span key={idx++} className="json-null">{nul}</span>);
    } else if (num) {
      tokens.push(<span key={idx++} className="json-number">{num}</span>);
    } else if (punct) {
      tokens.push(<span key={idx++} className="json-punctuation">{punct}</span>);
    } else if (newline) {
      tokens.push("\n");
    } else if (spaces) {
      tokens.push(spaces);
    }
  }
  return tokens;
}

/* ─── JSON Formatter ─── */
function JsonFormatter() {
  const [input, setInput] = useState('{"name":"QuantumByte","tools":["downloader","compressor"],"open_source":true,"version":2.1}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch {
      setError("Invalid JSON — check your syntax");
      setOutput("");
    }
  };

  const highlighted = useMemo(() => {
    if (!output) return null;
    return highlightJson(output);
  }, [output]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">JSON Formatter</h3>
        <span className="text-xs text-text-muted">Paste JSON → Format → Copy</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JSON here..."
        className="w-full h-32 p-4 rounded-lg bg-bg-primary border border-border text-sm font-mono text-text-primary placeholder:text-text-muted/40 focus:border-accent-cyan/40 focus:outline-none resize-none"
      />
      <div className="flex gap-3">
        <button onClick={format} className="px-5 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity">
          Format
        </button>
        {output && (
          <button onClick={copy} className="px-4 py-2.5 border border-border rounded-lg text-sm text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all flex items-center gap-2">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {highlighted && (
        <pre className="p-4 rounded-lg bg-bg-primary border border-border text-sm font-mono overflow-x-auto max-h-60 overflow-y-auto leading-relaxed">
          {highlighted}
        </pre>
      )}
    </div>
  );
}

/* ─── Password Generator ─── */
function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Password Generator</h3>
        <span className="text-xs text-text-muted">Cryptographically secure</span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-sm text-text-muted">Length:</label>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-32 accent-[#00f0ff]"
          />
          <span className="text-sm font-mono text-accent-cyan w-6">{length}</span>
        </div>
        <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
          <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="accent-[#00f0ff]" />
          Numbers
        </label>
        <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
          <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="accent-[#00f0ff]" />
          Symbols
        </label>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="px-5 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity flex items-center gap-2">
          <RefreshCw size={14} />
          Generate
        </button>
        {password && (
          <button onClick={copy} className="px-4 py-2.5 border border-border rounded-lg text-sm text-text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all flex items-center gap-2">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {password && (
        <div className="p-4 rounded-lg bg-bg-primary border border-border font-mono text-lg text-accent-cyan break-all tracking-wide">
          {password}
        </div>
      )}
    </div>
  );
}

/* ─── Color Picker ─── */
function ColorPicker() {
  const [color, setColor] = useState("#00f0ff");
  const [copied, setCopied] = useState("");

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(""), 2000);
  };

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: hexToRgb(color) },
    { label: "HSL", value: hexToHsl(color) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Color Picker</h3>
        <span className="text-xs text-text-muted">Pick → Copy in any format</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative">
          <div
            className="w-32 h-32 rounded-xl border-2 border-border"
            style={{ backgroundColor: color }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="block text-xs text-text-muted mt-2 text-center">Click to pick</span>
        </div>

        <div className="flex-1 space-y-3 w-full">
          {formats.map((f) => (
            <button
              key={f.label}
              onClick={() => copyValue(f.value)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-primary border border-border hover:border-accent-cyan/30 transition-all text-left group"
            >
              <div>
                <span className="text-xs text-text-muted block">{f.label}</span>
                <span className="font-mono text-sm text-text-primary">{f.value}</span>
              </div>
              <span className="text-text-muted group-hover:text-accent-cyan transition-colors">
                {copied === f.value ? <Check size={14} /> : <Copy size={14} />}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
