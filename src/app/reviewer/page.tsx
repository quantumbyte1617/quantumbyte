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
} from "lucide-react";

const checks = [
  { icon: Hash, label: "Numbers match AR/EN" },
  { icon: Calculator, label: "Totals verified" },
  { icon: Scale, label: "Cross-statement ties" },
  { icon: BookOpen, label: "Note references" },
  { icon: FileText, label: "Comparative figures" },
  { icon: Type, label: "IFRS terminology" },
  { icon: ClipboardCheck, label: "Completeness" },
  { icon: Languages, label: "Formatting check" },
];

export default function ReviewerPage() {
  const router = useRouter();
  const [arabicFile, setArabicFile] = useState<File | null>(null);
  const [englishFile, setEnglishFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  const handleFileDrop = useCallback(
    (lang: "arabic" | "english") => (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        if (lang === "arabic") setArabicFile(files[0]);
        else setEnglishFile(files[0]);
      }
    },
    []
  );

  const handleFileInput = (lang: "arabic" | "english") => (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const uploadRes = await fetch("/api/reviewer/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.detail || "Upload failed");
      }

      const { session_id } = await uploadRes.json();

      // Start the review
      const reviewRes = await fetch(`/api/reviewer/review/${session_id}`, {
        method: "POST",
      });

      if (!reviewRes.ok) {
        const err = await reviewRes.json();
        throw new Error(err.detail || "Failed to start review");
      }

      router.push(`/reviewer/review/${session_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Background effects */}
      <div className="mesh-gradient fixed inset-0 pointer-events-none" />
      <div className="orb w-[500px] h-[500px] bg-accent-cyan/15 -top-40 -right-40 fixed" />
      <div className="orb w-[400px] h-[400px] bg-accent-purple/10 bottom-0 -left-40 fixed" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
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
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-cyan/10 mb-6">
            <FileSearch size={32} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Financial Statements Reviewer</span>
          </h1>
          <p className="text-text-muted max-w-md mx-auto">
            Upload Arabic and English versions of financial statements for AI-powered cross-checking and validation.
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="playground-glass p-8 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Arabic File */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Arabic Version / النسخة العربية
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop("arabic")}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    arabicFile
                      ? "border-green-400/40 bg-green-400/5"
                      : "border-border hover:border-accent-cyan/30 hover:bg-accent-cyan/3"
                  }`}
                >
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={handleFileInput("arabic")}
                    />
                    {arabicFile ? (
                      <>
                        <CheckCircle2 size={28} className="mx-auto mb-2 text-green-400" />
                        <p className="text-sm text-green-400 font-medium truncate">{arabicFile.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload size={28} className="mx-auto mb-2 text-text-muted/40" />
                        <p className="text-sm text-text-muted/60" dir="rtl">اسحب الملف أو انقر</p>
                        <p className="text-xs text-text-muted/30 mt-1">PDF / DOCX</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* English File */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  English Version
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop("english")}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    englishFile
                      ? "border-green-400/40 bg-green-400/5"
                      : "border-border hover:border-accent-cyan/30 hover:bg-accent-cyan/3"
                  }`}
                >
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={handleFileInput("english")}
                    />
                    {englishFile ? (
                      <>
                        <CheckCircle2 size={28} className="mx-auto mb-2 text-green-400" />
                        <p className="text-sm text-green-400 font-medium truncate">{englishFile.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload size={28} className="mx-auto mb-2 text-text-muted/40" />
                        <p className="text-sm text-text-muted/60">Drag file or click</p>
                        <p className="text-xs text-text-muted/30 mt-1">PDF / DOCX</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-medium text-bg-primary hover:opacity-90 transition-all glow-cyan-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "uploading" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading & Starting Review...
                </>
              ) : (
                <>
                  <FileSearch size={18} />
                  Start Review
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Checks Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-xs text-text-muted/60 mb-3 uppercase tracking-wider">
            Automated Checks Performed
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {checks.map((check) => {
              const Icon = check.icon;
              return (
                <div
                  key={check.label}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium bg-white/4 border border-white/5 text-text-muted flex items-center gap-2"
                >
                  <Icon size={14} className="text-accent-cyan/60 flex-shrink-0" />
                  {check.label}
                </div>
              );
            })}
          </div>
          <p className="text-text-muted/40 text-[11px] mt-6">
            Documents are processed securely. Files are not stored permanently.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
