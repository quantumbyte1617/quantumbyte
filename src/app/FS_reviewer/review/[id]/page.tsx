"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileSearch,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Printer,
  RotateCcw,
  Languages,
  Hash,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Tab = "findings" | "comparison" | "numbers";

interface Finding {
  id: string;
  category: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  arabic_value: string | null;
  english_value: string | null;
  location: string;
  recommendation: string;
}

interface StatementSummary {
  statement_type: string;
  title_en: string;
  title_ar: string;
  line_items_count: number;
  total_amount: number | null;
  issues_count: number;
}

interface ReviewResults {
  session_id: string;
  findings: Finding[];
  summary: Record<string, string | number>;
  statement_summaries: StatementSummary[];
  total_findings: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
}

interface StatusData {
  status: string;
  progress: number;
  current_step: string;
}

const SEVERITY_CONFIG = {
  critical: {
    bg: "bg-red-500/8",
    border: "border-red-500/15",
    badge: "bg-red-500/15 text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.06)]",
    icon: AlertCircle,
  },
  warning: {
    bg: "bg-amber-500/8",
    border: "border-amber-500/15",
    badge: "bg-amber-500/15 text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.06)]",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-blue-500/8",
    border: "border-blue-500/15",
    badge: "bg-blue-500/15 text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.06)]",
    icon: Info,
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  numbers_mismatch: "Numbers Mismatch",
  totals_error: "Totals Error",
  cross_statement: "Cross-Statement",
  notes_reference: "Notes Reference",
  comparative_figures: "Comparative Figures",
  terminology: "Terminology",
  completeness: "Completeness",
  formatting: "Formatting",
};

const STATEMENT_LABELS: Record<string, string> = {
  balance_sheet: "Balance Sheet / \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0627\u0644\u064a",
  income_statement: "Income Statement / \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062f\u062e\u0644",
  cash_flow: "Cash Flow / \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062a\u062f\u0641\u0642\u0627\u062a \u0627\u0644\u0646\u0642\u062f\u064a\u0629",
  equity_changes: "Equity Changes / \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062a\u063a\u064a\u0631\u0627\u062a \u0641\u064a \u062d\u0642\u0648\u0642 \u0627\u0644\u0645\u0644\u0643\u064a\u0629",
};

const ease = [0.22, 1, 0.36, 1] as const;

const PROGRESS_STEPS = [
  { key: "extracting", label: "Extract", pct: 25 },
  { key: "analyzing", label: "Analyze", pct: 50 },
  { key: "comparing", label: "Compare", pct: 75 },
  { key: "completed", label: "Report", pct: 100 },
];

/* Shorthand for the adaptive overlay */
const ov = (a: number) => `rgba(var(--overlay-rgb),${a})`;

export default function ReviewResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [results, setResults] = useState<ReviewResults | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("findings");
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch(`/api/FS_reviewer/review/${sessionId}/results`);
      if (res.ok) {
        setResults(await res.json());
      }
    } catch {
      /* not ready yet */
    }
  }, [sessionId]);

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/FS_reviewer/review/${sessionId}/status`);
      if (!res.ok) {
        setError("Session not found");
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      const data: StatusData = await res.json();
      setStatusData(data);

      if (data.status === "completed") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        await fetchResults();
      } else if (data.status === "failed") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setError(data.current_step);
      }
    } catch {
      setError("Failed to connect to the server");
    }
  }, [sessionId, fetchResults]);

  useEffect(() => {
    pollStatus();
    intervalRef.current = setInterval(pollStatus, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pollStatus]);

  const isComplete = statusData?.status === "completed" && results;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-5xl mx-auto px-5 py-10 md:py-16">
        {/* Back link */}
        <motion.a
          href="/FS_reviewer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Back to Reviewer
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-accent-cyan/15 to-accent-purple/15 border border-accent-cyan/10 mb-6">
            <FileSearch size={34} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Review Results
          </h1>
          <p className="text-text-muted/50 text-sm font-mono">
            Session: {sessionId.slice(0, 8)}...
          </p>
        </motion.div>

        {/* Progress (while loading) */}
        {!isComplete && statusData && statusData.status !== "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="playground-glass p-6 md:p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Loader2 size={18} className="text-accent-cyan animate-spin" />
              <span className="text-sm text-text-muted font-medium">
                {statusData.current_step}
              </span>
              <span className="ml-auto text-sm font-bold text-accent-cyan">
                {statusData.progress}%
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="h-2 rounded-full overflow-hidden mb-8"
              style={{ background: ov(0.04) }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                initial={{ width: 0 }}
                animate={{ width: `${statusData.progress}%` }}
                transition={{ duration: 0.5, ease }}
              />
            </div>

            {/* Step indicators */}
            <div className="grid grid-cols-4 gap-3">
              {PROGRESS_STEPS.map((step) => {
                const isDone = statusData.progress >= step.pct;
                const isActive =
                  statusData.progress >= step.pct - 20 && !isDone;
                return (
                  <div key={step.key} className="text-center">
                    <div
                      className={`w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                        isDone
                          ? "bg-gradient-to-br from-accent-cyan to-accent-purple text-bg-primary"
                          : isActive
                          ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30"
                          : "text-text-muted/25"
                      }`}
                      style={
                        !isDone && !isActive
                          ? {
                              background: ov(0.03),
                              borderWidth: 1,
                              borderColor: ov(0.05),
                            }
                          : undefined
                      }
                    >
                      {isDone ? <CheckCircle2 size={16} /> : step.label[0]}
                    </div>
                    <p
                      className={`text-[11px] font-medium ${
                        isDone
                          ? "text-accent-cyan"
                          : isActive
                          ? "text-text-muted/60"
                          : "text-text-muted/25"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {error && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="playground-glass p-6 md:p-8 mb-8 border border-red-500/15"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-bold mb-1">Review Failed</p>
                <p className="text-text-muted/60 text-sm mb-5 leading-relaxed">
                  {error}
                </p>
                <a
                  href="/FS_reviewer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl text-sm font-bold text-bg-primary hover:brightness-110 transition-all duration-300"
                >
                  <RotateCcw size={14} />
                  Start New Review
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Findings", value: results.total_findings, color: "text-text-primary" },
                  { label: "Critical", value: results.critical_count, color: "text-red-400" },
                  { label: "Warnings", value: results.warning_count, color: "text-amber-400" },
                  { label: "Info", value: results.info_count, color: "text-blue-400" },
                ].map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.5, ease }}
                    className={`rounded-2xl p-5 text-center backdrop-blur-sm border`}
                    style={{
                      background: ov(0.03),
                      borderColor: ov(0.06),
                    }}
                  >
                    <p className={`text-4xl font-bold ${card.color} tracking-tight`}>
                      {card.value}
                    </p>
                    <p className="text-[11px] text-text-muted/40 mt-1.5 font-medium uppercase tracking-[0.5px]">
                      {card.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Overall assessment */}
              {results.summary?.overall_assessment && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease }}
                  className="playground-glass p-5 md:p-6 mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-accent-cyan" />
                    <p className="text-[11px] font-bold text-text-muted/50 uppercase tracking-[0.8px]">
                      Overall Assessment
                    </p>
                  </div>
                  <p className="text-text-primary/80 text-sm leading-relaxed">
                    {results.summary.overall_assessment as string}
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease }}
                className="flex gap-3 mb-8"
              >
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary transition-all duration-300 border"
                  style={{
                    background: ov(0.03),
                    borderColor: ov(0.06),
                  }}
                >
                  <Printer size={14} />
                  Print Report
                </button>
                <a
                  href="/FS_reviewer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl text-sm font-bold text-bg-primary hover:brightness-110 transition-all duration-300"
                >
                  <RotateCcw size={14} />
                  New Review
                </a>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease }}
                className="flex gap-1 mb-6 p-1 rounded-2xl w-fit border"
                style={{
                  background: ov(0.03),
                  borderColor: ov(0.05),
                }}
              >
                {[
                  { key: "findings" as Tab, label: "All Findings", icon: AlertTriangle },
                  { key: "comparison" as Tab, label: "Side-by-Side", icon: Languages },
                  { key: "numbers" as Tab, label: "Numbers", icon: Hash },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-accent-cyan/15 to-accent-purple/10 text-accent-cyan"
                          : "text-text-muted/50 hover:text-text-primary"
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </motion.div>

              {/* Tab Content: Findings */}
              {activeTab === "findings" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {results.findings.length === 0 ? (
                    <div className="playground-glass p-10 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-4">
                        <CheckCircle2 size={32} className="text-emerald-400" />
                      </div>
                      <p className="text-text-primary font-bold text-lg">No discrepancies found</p>
                      <p className="text-text-muted/50 text-sm mt-1">Both versions appear consistent.</p>
                    </div>
                  ) : (
                    results.findings.map((finding, i) => {
                      const config = SEVERITY_CONFIG[finding.severity];
                      const SevIcon = config.icon;
                      return (
                        <motion.div
                          key={finding.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.03 * i, duration: 0.4, ease }}
                          className={`${config.bg} ${config.border} ${config.glow} border rounded-2xl p-5`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <SevIcon size={16} className={config.badge.split(" ")[1]} />
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.5px] ${config.badge}`}>
                                {finding.severity}
                              </span>
                              <span
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.5px] text-text-muted/50 border"
                                style={{ background: ov(0.04), borderColor: ov(0.05) }}
                              >
                                {CATEGORY_LABELS[finding.category] || finding.category}
                              </span>
                            </div>
                            {finding.location && (
                              <span className="text-[10px] text-text-muted/30 font-mono">{finding.location}</span>
                            )}
                          </div>
                          <h4 className="font-bold text-text-primary mb-1.5">{finding.title}</h4>
                          <p className="text-sm text-text-muted/60 mb-3 leading-relaxed">{finding.description}</p>

                          {(finding.arabic_value || finding.english_value) && (
                            <div className="flex flex-wrap gap-3 mb-3">
                              {finding.arabic_value && (
                                <div
                                  className="rounded-xl px-4 py-2 text-sm border"
                                  style={{ background: ov(0.03), borderColor: ov(0.05) }}
                                >
                                  <span className="text-text-muted/30 text-[10px] font-bold uppercase tracking-[0.5px]">AR </span>
                                  <span dir="rtl" className="font-semibold text-text-primary/80">{finding.arabic_value}</span>
                                </div>
                              )}
                              {finding.english_value && (
                                <div
                                  className="rounded-xl px-4 py-2 text-sm border"
                                  style={{ background: ov(0.03), borderColor: ov(0.05) }}
                                >
                                  <span className="text-text-muted/30 text-[10px] font-bold uppercase tracking-[0.5px]">EN </span>
                                  <span className="font-semibold text-text-primary/80">{finding.english_value}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {finding.recommendation && (
                            <div
                              className="rounded-xl px-4 py-2.5 border"
                              style={{ background: ov(0.02), borderColor: ov(0.04) }}
                            >
                              <p className="text-[11px] text-text-muted/40 leading-relaxed">{finding.recommendation}</p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}

              {/* Tab Content: Side-by-Side Comparison */}
              {activeTab === "comparison" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {results.statement_summaries.length === 0 ? (
                    <div className="playground-glass p-10 text-center text-text-muted/50">
                      No statement summaries available.
                    </div>
                  ) : (
                    results.statement_summaries.map((summary, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.4, ease }}
                        className="rounded-2xl overflow-hidden backdrop-blur-sm border"
                        style={{ background: ov(0.02), borderColor: ov(0.06) }}
                      >
                        <div
                          className="px-5 py-3.5 border-b"
                          style={{ borderColor: ov(0.05), background: ov(0.03) }}
                        >
                          <h4 className="font-bold text-text-primary text-sm">
                            {STATEMENT_LABELS[summary.statement_type] || summary.statement_type}
                          </h4>
                        </div>
                        <div
                          className="grid grid-cols-2"
                          style={{ columnGap: 0 }}
                        >
                          <div className="p-5" style={{ borderRight: `1px solid ${ov(0.05)}` }}>
                            <p className="text-[10px] text-text-muted/30 uppercase tracking-[1px] font-bold mb-2.5">English</p>
                            <p className="font-semibold text-text-primary/80 text-sm">{summary.title_en || "\u2014"}</p>
                            <div className="mt-3 space-y-1 text-xs text-text-muted/40">
                              <p>Items: <span className="text-text-muted/60 font-medium">{summary.line_items_count}</span></p>
                              {summary.total_amount !== null && (
                                <p>Total: <span className="text-text-muted/60 font-medium">{summary.total_amount?.toLocaleString()}</span></p>
                              )}
                            </div>
                          </div>
                          <div className="p-5" dir="rtl">
                            <p className="text-[10px] text-text-muted/30 uppercase tracking-[1px] font-bold mb-2.5">{"\u0627\u0644\u0639\u0631\u0628\u064a\u0629"}</p>
                            <p className="font-semibold text-text-primary/80 text-sm">{summary.title_ar || "\u2014"}</p>
                            <div className="mt-3 space-y-1 text-xs text-text-muted/40">
                              <p>{"\u0627\u0644\u0628\u0646\u0648\u062f"}: <span className="text-text-muted/60 font-medium">{summary.line_items_count}</span></p>
                              {summary.total_amount !== null && (
                                <p>{"\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a"}: <span className="text-text-muted/60 font-medium">{summary.total_amount?.toLocaleString()}</span></p>
                              )}
                            </div>
                          </div>
                        </div>
                        {summary.issues_count > 0 && (
                          <div className="bg-red-500/8 px-5 py-2.5 border-t border-red-500/10">
                            <p className="text-[11px] text-red-400 font-bold">
                              {summary.issues_count} issue{summary.issues_count > 1 ? "s" : ""} found
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {/* Tab Content: Numbers Table */}
              {activeTab === "numbers" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="playground-glass overflow-hidden rounded-2xl"
                >
                  {(() => {
                    const numberFindings = results.findings.filter(
                      (f) => f.category === "numbers_mismatch" && (f.arabic_value || f.english_value)
                    );
                    if (numberFindings.length === 0) {
                      return (
                        <div className="p-10 text-center">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 mb-3">
                            <CheckCircle2 size={28} className="text-emerald-400" />
                          </div>
                          <p className="text-text-primary font-bold">No number discrepancies found</p>
                          <p className="text-text-muted/40 text-sm mt-1">All figures match between versions.</p>
                        </div>
                      );
                    }
                    return (
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${ov(0.05)}`, background: ov(0.02) }}>
                            <th className="text-left px-5 py-3.5 text-text-muted/30 text-[10px] font-bold uppercase tracking-[1px]">Issue</th>
                            <th className="text-left px-5 py-3.5 text-text-muted/30 text-[10px] font-bold uppercase tracking-[1px]">EN Value</th>
                            <th className="text-right px-5 py-3.5 text-text-muted/30 text-[10px] font-bold uppercase tracking-[1px]">AR Value</th>
                            <th className="text-left px-5 py-3.5 text-text-muted/30 text-[10px] font-bold uppercase tracking-[1px]">Severity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {numberFindings.map((f, i) => (
                            <tr
                              key={f.id}
                              className="transition-colors duration-200"
                              style={{ borderBottom: i < numberFindings.length - 1 ? `1px solid ${ov(0.04)}` : undefined }}
                            >
                              <td className="px-5 py-3.5 text-text-primary/80 font-medium">{f.title}</td>
                              <td className="px-5 py-3.5 font-mono text-text-muted/50 text-[13px]">{f.english_value || "\u2014"}</td>
                              <td className="px-5 py-3.5 font-mono text-text-muted/50 text-right text-[13px]" dir="rtl">{f.arabic_value || "\u2014"}</td>
                              <td className="px-5 py-3.5">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.5px] ${SEVERITY_CONFIG[f.severity].badge}`}>
                                  {f.severity}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-10"
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
