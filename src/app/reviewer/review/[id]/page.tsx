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
  critical: { bg: "bg-red-500/10", border: "border-red-500/20", badge: "bg-red-500/15 text-red-400", icon: AlertCircle },
  warning: { bg: "bg-amber-500/10", border: "border-amber-500/20", badge: "bg-amber-500/15 text-amber-400", icon: AlertTriangle },
  info: { bg: "bg-blue-500/10", border: "border-blue-500/20", badge: "bg-blue-500/15 text-blue-400", icon: Info },
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
  balance_sheet: "Balance Sheet / قائمة المركز المالي",
  income_statement: "Income Statement / قائمة الدخل",
  cash_flow: "Cash Flow / قائمة التدفقات النقدية",
  equity_changes: "Equity Changes / قائمة التغيرات في حقوق الملكية",
};

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
      const res = await fetch(`/api/reviewer/review/${sessionId}/results`);
      if (res.ok) {
        setResults(await res.json());
      }
    } catch { /* not ready yet */ }
  }, [sessionId]);

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviewer/review/${sessionId}/status`);
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
      <div className="mesh-gradient fixed inset-0 pointer-events-none" />
      <div className="orb w-[500px] h-[500px] bg-accent-cyan/15 -top-40 -right-40 fixed" />
      <div className="orb w-[400px] h-[400px] bg-accent-purple/10 bottom-0 -left-40 fixed" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Back link */}
        <motion.a
          href="/reviewer"
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
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-cyan/10 mb-4">
            <FileSearch size={28} className="text-accent-cyan" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Review Results</span>
          </h1>
          <p className="text-text-muted/60 text-sm">Session: {sessionId.slice(0, 8)}...</p>
        </motion.div>

        {/* Progress (while loading) */}
        {!isComplete && statusData && statusData.status !== "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="playground-glass p-8 mb-8"
          >
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-text-muted">{statusData.current_step}</span>
                <span className="text-sm text-text-muted">{statusData.progress}%</span>
              </div>
              <div className="progress-bar h-2 rounded-full">
                <div
                  className="progress-bar-fill bg-accent-cyan rounded-full transition-all duration-500"
                  style={{ width: `${statusData.progress}%`, height: "100%" }}
                />
              </div>
            </div>

            {/* Step indicators */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { key: "extracting", label: "Extract", pct: 25 },
                { key: "analyzing", label: "Analyze", pct: 50 },
                { key: "comparing", label: "Compare", pct: 75 },
                { key: "completed", label: "Report", pct: 100 },
              ].map((step) => {
                const isDone = statusData.progress >= step.pct;
                const isActive = statusData.progress >= step.pct - 20 && !isDone;
                return (
                  <div key={step.key} className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-medium transition-colors ${
                        isDone
                          ? "bg-accent-cyan text-bg-primary"
                          : isActive
                          ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40"
                          : "bg-white/5 text-text-muted/30"
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={14} /> : step.label[0]}
                    </div>
                    <p className={`text-[11px] ${isDone ? "text-accent-cyan" : "text-text-muted/30"}`}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="playground-glass p-8 mb-8 border border-red-500/20"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium mb-1">Review Failed</p>
                <p className="text-text-muted text-sm mb-4">{error}</p>
                <a
                  href="/reviewer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg text-sm hover:bg-accent-cyan/20 transition-colors"
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
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Findings", value: results.total_findings, color: "text-text-primary" },
                  { label: "Critical", value: results.critical_count, color: "text-red-400" },
                  { label: "Warnings", value: results.warning_count, color: "text-amber-400" },
                  { label: "Info", value: results.info_count, color: "text-blue-400" },
                ].map((card) => (
                  <div key={card.label} className="glass-card rounded-xl p-4 text-center">
                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    <p className="text-xs text-text-muted mt-1">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Overall assessment */}
              {results.summary?.overall_assessment && (
                <div className="playground-glass p-5 mb-6">
                  <p className="text-sm text-text-muted mb-1 font-medium">Overall Assessment</p>
                  <p className="text-text-primary text-sm leading-relaxed">
                    {results.summary.overall_assessment as string}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-white/8 transition-colors"
                >
                  <Printer size={14} />
                  Print Report
                </button>
                <a
                  href="/reviewer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg text-sm hover:bg-accent-cyan/20 transition-colors"
                >
                  <RotateCcw size={14} />
                  New Review
                </a>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-xl w-fit">
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
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.key
                          ? "bg-accent-cyan/15 text-accent-cyan"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content: Findings */}
              {activeTab === "findings" && (
                <div className="space-y-3">
                  {results.findings.length === 0 ? (
                    <div className="playground-glass p-8 text-center">
                      <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
                      <p className="text-text-primary font-medium">No discrepancies found</p>
                      <p className="text-text-muted text-sm mt-1">Both versions appear consistent.</p>
                    </div>
                  ) : (
                    results.findings.map((finding) => {
                      const config = SEVERITY_CONFIG[finding.severity];
                      const SevIcon = config.icon;
                      return (
                        <div
                          key={finding.id}
                          className={`${config.bg} ${config.border} border rounded-xl p-5`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <SevIcon size={16} className={config.badge.split(" ")[1]} />
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${config.badge}`}>
                                {finding.severity}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 text-text-muted">
                                {CATEGORY_LABELS[finding.category] || finding.category}
                              </span>
                            </div>
                            {finding.location && (
                              <span className="text-[11px] text-text-muted/50">{finding.location}</span>
                            )}
                          </div>
                          <h4 className="font-medium text-text-primary mb-1">{finding.title}</h4>
                          <p className="text-sm text-text-muted mb-3">{finding.description}</p>

                          {(finding.arabic_value || finding.english_value) && (
                            <div className="flex gap-3 mb-3">
                              {finding.arabic_value && (
                                <div className="bg-white/5 rounded-lg px-3 py-1.5 text-sm border border-white/5">
                                  <span className="text-text-muted/60 text-xs">AR: </span>
                                  <span dir="rtl" className="font-medium">{finding.arabic_value}</span>
                                </div>
                              )}
                              {finding.english_value && (
                                <div className="bg-white/5 rounded-lg px-3 py-1.5 text-sm border border-white/5">
                                  <span className="text-text-muted/60 text-xs">EN: </span>
                                  <span className="font-medium">{finding.english_value}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {finding.recommendation && (
                            <p className="text-xs text-text-muted/60 italic">
                              {finding.recommendation}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Tab Content: Side-by-Side Comparison */}
              {activeTab === "comparison" && (
                <div className="space-y-4">
                  {results.statement_summaries.length === 0 ? (
                    <div className="playground-glass p-8 text-center text-text-muted">
                      No statement summaries available.
                    </div>
                  ) : (
                    results.statement_summaries.map((summary, i) => (
                      <div key={i} className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-white/5 bg-white/3">
                          <h4 className="font-medium text-text-primary text-sm">
                            {STATEMENT_LABELS[summary.statement_type] || summary.statement_type}
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-white/5">
                          <div className="p-5">
                            <p className="text-[10px] text-text-muted/40 uppercase tracking-wider mb-2">English</p>
                            <p className="font-medium text-text-primary text-sm">{summary.title_en || "—"}</p>
                            <div className="mt-2 space-y-1 text-xs text-text-muted">
                              <p>Items: {summary.line_items_count}</p>
                              {summary.total_amount !== null && (
                                <p>Total: {summary.total_amount?.toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                          <div className="p-5" dir="rtl">
                            <p className="text-[10px] text-text-muted/40 uppercase tracking-wider mb-2">العربية</p>
                            <p className="font-medium text-text-primary text-sm">{summary.title_ar || "—"}</p>
                            <div className="mt-2 space-y-1 text-xs text-text-muted">
                              <p>البنود: {summary.line_items_count}</p>
                              {summary.total_amount !== null && (
                                <p>الإجمالي: {summary.total_amount?.toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        {summary.issues_count > 0 && (
                          <div className="bg-red-500/10 px-5 py-2 border-t border-red-500/10">
                            <p className="text-xs text-red-400 font-medium">
                              {summary.issues_count} issue{summary.issues_count > 1 ? "s" : ""}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab Content: Numbers Table */}
              {activeTab === "numbers" && (
                <div className="playground-glass overflow-hidden rounded-xl">
                  {(() => {
                    const numberFindings = results.findings.filter(
                      (f) => f.category === "numbers_mismatch" && (f.arabic_value || f.english_value)
                    );
                    if (numberFindings.length === 0) {
                      return (
                        <div className="p-8 text-center">
                          <CheckCircle2 size={32} className="mx-auto mb-2 text-green-400" />
                          <p className="text-text-muted">No number discrepancies found.</p>
                        </div>
                      );
                    }
                    return (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/3">
                            <th className="text-left px-4 py-3 text-text-muted/60 text-xs font-medium">Issue</th>
                            <th className="text-left px-4 py-3 text-text-muted/60 text-xs font-medium">EN Value</th>
                            <th className="text-right px-4 py-3 text-text-muted/60 text-xs font-medium">AR Value</th>
                            <th className="text-left px-4 py-3 text-text-muted/60 text-xs font-medium">Severity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {numberFindings.map((f) => (
                            <tr key={f.id} className="hover:bg-white/3 transition-colors">
                              <td className="px-4 py-3 text-text-primary">{f.title}</td>
                              <td className="px-4 py-3 font-mono text-text-muted">{f.english_value || "—"}</td>
                              <td className="px-4 py-3 font-mono text-text-muted text-right" dir="rtl">{f.arabic_value || "—"}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${SEVERITY_CONFIG[f.severity].badge}`}>
                                  {f.severity}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
