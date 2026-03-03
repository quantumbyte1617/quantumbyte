"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  KeyRound,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";

const steps = [
  { num: "1", label: "Upload", color: "bg-cyan-500" },
  { num: "2", label: "Unlock", color: "bg-purple-500" },
  { num: "3", label: "Download", color: "bg-emerald-500" },
];

const ease = [0.22, 1, 0.36, 1] as const;
const ov = (a: number) => `rgba(var(--overlay-rgb),${a})`;

export default function PdfUnlockerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<"known" | "recover">("known");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("");
  const [foundPassword, setFoundPassword] = useState("");

  useEffect(() => {
    return () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); };
  }, [downloadUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const resetResult = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");
    setDownloadFilename("");
    setFoundPassword("");
    setStatus("idle");
    setError("");
  };

  const handleReset = () => {
    resetResult();
    setFile(null);
    setPassword("");
    setShowPassword(false);
  };

  const switchMode = (m: "known" | "recover") => {
    setMode(m);
    resetResult();
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !password.trim()) return;
    resetResult();
    setStatus("loading");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const res = await fetch("/api/pdf-unlocker", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error (${res.status})`);
      }

      const blob = await res.blob();
      const baseName = file.name.replace(/\.pdf$/i, "");
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`${baseName}_unlocked.pdf`);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    resetResult();
    setStatus("loading");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);

      const res = await fetch("/api/pdf-unlocker/recover", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error (${res.status})`);
      }

      const blob = await res.blob();
      const pwd = res.headers.get("X-Found-Password") ?? "";
      const baseName = file.name.replace(/\.pdf$/i, "");
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`${baseName}_unlocked.pdf`);
      setFoundPassword(pwd);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const canUnlock = file && password.trim() !== "" && status !== "loading";
  const canRecover = file && status !== "loading";

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-xl mx-auto px-5 py-10 md:py-16">
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
            <KeyRound size={34} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">PDF Unlocker</h1>
          <p className="text-text-muted max-w-sm mx-auto leading-relaxed">
            Remove the password from a protected PDF. Know the password, or let us try to recover it.
          </p>
        </motion.div>

        {/* Steps */}
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
              {i < steps.length - 1 && <ArrowRight size={12} className="text-text-muted/20" />}
            </div>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="playground-glass p-6 md:p-8 mb-6"
        >
          {/* Mode toggle */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: ov(0.04) }}>
            <button
              type="button"
              onClick={() => switchMode("known")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "known"
                  ? "bg-accent-cyan/15 text-accent-cyan"
                  : "text-text-muted/50 hover:text-text-muted"
              }`}
            >
              <KeyRound size={14} />
              I know the password
            </button>
            <button
              type="button"
              onClick={() => switchMode("recover")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "recover"
                  ? "bg-accent-purple/15 text-accent-purple"
                  : "text-text-muted/50 hover:text-text-muted"
              }`}
            >
              <HelpCircle size={14} />
              Forgot password
            </button>
          </div>

          <form onSubmit={mode === "known" ? handleUnlock : handleRecover} className="space-y-5">
            {/* File Drop Zone */}
            <div>
              <label className="block text-[11px] font-bold text-text-muted/60 mb-2 uppercase tracking-[0.8px]">
                PDF File
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group ${
                  file
                    ? "bg-emerald-500/8 border border-emerald-500/20 shadow-[0_0_20px_rgba(34,197,94,0.06)]"
                    : dragOver
                    ? "bg-accent-cyan/8 border-2 border-dashed border-accent-cyan/40"
                    : "border-2 border-dashed"
                }`}
                style={!file && !dragOver ? { background: ov(0.02), borderColor: ov(0.06) } : undefined}
              >
                <label className="cursor-pointer block">
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
                  {file ? (
                    <div className="space-y-1.5">
                      <CheckCircle2 size={28} className="mx-auto text-emerald-400" />
                      <p className="text-sm text-emerald-400 font-semibold truncate px-4">{file.name}</p>
                      <p className="text-[11px] text-emerald-400/50">{formatFileSize(file.size)}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-1">
                      <div
                        className="inline-flex items-center justify-center w-11 h-11 rounded-xl group-hover:bg-accent-cyan/10 transition-colors"
                        style={{ background: ov(0.04) }}
                      >
                        <Upload size={22} className="text-text-muted/30 group-hover:text-accent-cyan/60 transition-colors" />
                      </div>
                      <p className="text-sm text-text-muted/50 font-medium">Drop your PDF here</p>
                      <p className="text-[11px] text-text-muted/25">or click to browse · PDF only · max 50 MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Password input — only in "known" mode */}
            <AnimatePresence>
              {mode === "known" && (
                <motion.div
                  key="password-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[11px] font-bold text-text-muted/60 mb-2 uppercase tracking-[0.8px]">
                    PDF Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the PDF password"
                      className="w-full px-4 py-3 pr-11 rounded-2xl text-sm text-text-primary placeholder:text-text-muted/30 border outline-none transition-all duration-200 focus:border-accent-cyan/30 focus:shadow-[0_0_0_3px_rgba(var(--color-accent-cyan),0.06)]"
                      style={{ background: ov(0.04), borderColor: ov(0.08) }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/40 hover:text-text-muted/80 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recover mode hint */}
            <AnimatePresence>
              {mode === "recover" && (
                <motion.div
                  key="recover-hint"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm text-accent-purple/80"
                    style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.12)" }}
                  >
                    <Sparkles size={15} className="flex-shrink-0 mt-0.5" />
                    <span>We&apos;ll automatically try blank, common numbers, years, and the filename as the password.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {status === "error" && error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/15 text-sm text-red-400"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={mode === "known" ? !canUnlock : !canRecover}
              className={`w-full py-4 rounded-2xl font-bold text-bg-primary text-[15px] hover:brightness-110 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 tracking-[0.3px] ${
                mode === "recover"
                  ? "bg-gradient-to-r from-accent-purple to-accent-pink"
                  : "bg-gradient-to-r from-accent-cyan to-accent-purple"
              }`}
              style={{ boxShadow: "0 4px 20px rgba(var(--color-accent-cyan),0.12)" }}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {mode === "recover" ? "Trying passwords..." : "Unlocking PDF..."}
                </>
              ) : mode === "recover" ? (
                <>
                  <Sparkles size={18} />
                  Try to Recover
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  Unlock PDF
                </>
              )}
            </button>
          </form>

          {/* Success */}
          {status === "done" && downloadUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-5 rounded-2xl bg-emerald-500/8 border border-emerald-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">PDF Unlocked Successfully</p>
                  {foundPassword !== "" && (
                    <p className="text-[11px] text-emerald-400/60 mt-0.5">
                      Password found: <span className="font-mono font-bold">{foundPassword || "(blank)"}</span>
                    </p>
                  )}
                  {foundPassword === "" && mode === "known" && (
                    <p className="text-[11px] text-emerald-400/50 mt-0.5">Password removed · ready to download</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={downloadUrl}
                  download={downloadFilename}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 transition-colors rounded-xl text-sm font-bold text-white"
                >
                  <Download size={16} />
                  Download Unlocked PDF
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-text-muted/60 hover:text-text-muted transition-colors border"
                  style={{ borderColor: ov(0.08), background: ov(0.02) }}
                >
                  New File
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] text-text-muted/30">
            <ShieldCheck size={12} />
            Files are not stored. Everything is processed in memory.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
