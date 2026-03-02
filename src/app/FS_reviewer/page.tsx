"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileSearch,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  Languages,
  Calculator,
  BookOpen,
  Scale,
  ClipboardCheck,
  Hash,
  Type,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const checks = [
  { icon: Hash, label: "Numbers Match", desc: "AR \u2194 EN", color: "text-blue-400" },
  { icon: Calculator, label: "Totals Verified", desc: "Math check", color: "text-purple-400" },
  { icon: Scale, label: "Cross-Statement", desc: "Consistency", color: "text-cyan-400" },
  { icon: BookOpen, label: "Note References", desc: "Tie-back", color: "text-pink-400" },
  { icon: FileText, label: "Comparative", desc: "Prior year", color: "text-emerald-400" },
  { icon: Type, label: "IFRS Terms", desc: "Compliance", color: "text-amber-400" },
  { icon: ClipboardCheck, label: "Completeness", desc: "All present", color: "text-rose-400" },
  { icon: Languages, label: "Formatting", desc: "Consistency", color: "text-indigo-400" },
];

const steps = [
  { num: "1", label: "Upload", color: "bg-blue-500" },
  { num: "2", label: "AI Analyze", color: "bg-accent-pink" },
  { num: "3", label: "Report", color: "bg-emerald-500" },
];

const ease = [0.22, 1, 0.36, 1] as const;

/* Shorthand for the adaptive overlay */
const ov = (a: number) => `rgba(var(--overlay-rgb),${a})`;

export default function ReviewerPage() {
  const router = useRouter();
  const [arabicFile, setArabicFile] = useState<File | null>(null);
  const [englishFile, setEnglishFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState<"arabic" | "english" | null>(null);

  const handleFileDrop = useCallback(
    (lang: "arabic" | "english") => (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(null);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        if (lang === "arabic") setArabicFile(files[0]);
        else setEnglishFile(files[0]);
      }
    },
    []
  );

  const handleFileInput =
    (lang: "arabic" | "english") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        if (lang === "arabic") setArabicFile(e.target.files[0]);
        else setEnglishFile(e.target.files[0]);
      }
    };

  const canSubmit = arabicFile && englishFile && status !== "uploading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabicFile || !englishFile) return;

    setStatus("uploading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("arabic_file", arabicFile);
      formData.append("english_file", englishFile);

      const res = await fetch("/api/FS_reviewer/analyze", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data: Record<string, unknown> = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || `Server error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error((data.detail as string) || `Analysis failed (${res.status})`);
      }

      sessionStorage.setItem("fs_review_results", JSON.stringify(data));
      router.push("/FS_reviewer/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("error");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-2xl mx-auto px-5 py-10 md:py-16">
        {/* Back link */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Back to QuantumByte
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-accent-cyan/15 to-accent-purple/15 border border-accent-cyan/10 mb-6"
            style={{ boxShadow: "0 0 40px rgba(var(--overlay-rgb),0.04)" }}
          >
            <FileSearch size={34} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Financial Statements
            <br />
            Reviewer
          </h1>
          <p className="text-text-muted max-w-md mx-auto leading-relaxed">
            AI-powered cross-checking of Arabic and English financial statements. Upload both versions and get a detailed audit report.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${step.color} text-white text-[11px] font-bold`}>
                  {step.num}
                </span>
                <span className="text-xs text-text-muted font-medium">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight size={12} className="text-text-muted/20" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="playground-glass p-6 md:p-8 mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Arabic */}
              <div>
                <label className="block text-[11px] font-bold text-text-muted/60 mb-2 uppercase tracking-[0.8px]">
                  Arabic Version
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver("arabic"); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={handleFileDrop("arabic")}
                  className={`relative rounded-2xl p-5 text-center transition-all duration-300 cursor-pointer group ${
                    arabicFile
                      ? "bg-emerald-500/8 border border-emerald-500/20 shadow-[0_0_20px_rgba(34,197,94,0.06)]"
                      : dragOver === "arabic"
                      ? "bg-accent-cyan/8 border-2 border-dashed border-accent-cyan/40"
                      : "border-2 border-dashed"
                  }`}
                  style={
                    !arabicFile && dragOver !== "arabic"
                      ? {
                          background: ov(0.02),
                          borderColor: ov(0.06),
                        }
                      : undefined
                  }
                >
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={handleFileInput("arabic")}
                    />
                    {arabicFile ? (
                      <div className="space-y-1.5">
                        <CheckCircle2 size={26} className="mx-auto text-emerald-400" />
                        <p className="text-sm text-emerald-400 font-semibold truncate">{arabicFile.name}</p>
                        <p className="text-[11px] text-emerald-400/50">{formatFileSize(arabicFile.size)}</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 py-1">
                        <div
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl group-hover:bg-accent-cyan/10 transition-colors"
                          style={{ background: ov(0.04) }}
                        >
                          <Upload size={20} className="text-text-muted/30 group-hover:text-accent-cyan/60 transition-colors" />
                        </div>
                        <p className="text-sm text-text-muted/50 font-medium" dir="rtl">النسخة العربية</p>
                        <p className="text-[11px] text-text-muted/25">PDF or DOCX</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* English */}
              <div>
                <label className="block text-[11px] font-bold text-text-muted/60 mb-2 uppercase tracking-[0.8px]">
                  English Version
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver("english"); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={handleFileDrop("english")}
                  className={`relative rounded-2xl p-5 text-center transition-all duration-300 cursor-pointer group ${
                    englishFile
                      ? "bg-emerald-500/8 border border-emerald-500/20 shadow-[0_0_20px_rgba(34,197,94,0.06)]"
                      : dragOver === "english"
                      ? "bg-accent-cyan/8 border-2 border-dashed border-accent-cyan/40"
                      : "border-2 border-dashed"
                  }`}
                  style={
                    !englishFile && dragOver !== "english"
                      ? {
                          background: ov(0.02),
                          borderColor: ov(0.06),
                        }
                      : undefined
                  }
                >
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={handleFileInput("english")}
                    />
                    {englishFile ? (
                      <div className="space-y-1.5">
                        <CheckCircle2 size={26} className="mx-auto text-emerald-400" />
                        <p className="text-sm text-emerald-400 font-semibold truncate">{englishFile.name}</p>
                        <p className="text-[11px] text-emerald-400/50">{formatFileSize(englishFile.size)}</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 py-1">
                        <div
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl group-hover:bg-accent-cyan/10 transition-colors"
                          style={{ background: ov(0.04) }}
                        >
                          <Upload size={20} className="text-text-muted/30 group-hover:text-accent-cyan/60 transition-colors" />
                        </div>
                        <p className="text-sm text-text-muted/50 font-medium">English Version</p>
                        <p className="text-[11px] text-text-muted/25">PDF or DOCX</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/15 text-sm text-red-400"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-4 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-2xl font-bold text-bg-primary text-[15px] hover:brightness-110 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2.5 tracking-[0.3px]"
              style={{ boxShadow: "0 4px 20px rgba(var(--color-accent-cyan),0.12)" }}
            >
              {status === "uploading" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing Documents...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Start AI Review
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Checks Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
        >
          <p className="text-[11px] text-text-muted/40 mb-4 uppercase tracking-[1px] font-bold text-center">
            Automated Audit Checks
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {checks.map((check) => {
              const Icon = check.icon;
              return (
                <div
                  key={check.label}
                  className="px-3 py-3 rounded-xl transition-all duration-300 group border"
                  style={{
                    background: ov(0.02),
                    borderColor: ov(0.05),
                  }}
                >
                  <Icon
                    size={16}
                    className={`${check.color} mb-1.5 opacity-70 group-hover:opacity-100 transition-opacity`}
                  />
                  <p className="text-[12px] font-semibold text-text-primary/80 leading-tight">
                    {check.label}
                  </p>
                  <p className="text-[10px] text-text-muted/40 mt-0.5">{check.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] text-text-muted/30">
            <ShieldCheck size={12} />
            Documents processed securely. Files are not stored.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
