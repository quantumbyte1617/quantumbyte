import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/reviewer/store";
import { extractFinancialData, compareVersions } from "@/lib/reviewer/claude";
import { quickNumbersCheck } from "@/lib/reviewer/comparison";
import type { Finding, StatementSummary, ReviewResults } from "@/lib/reviewer/types";

export const maxDuration = 60;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;
  const session = getSession(sessionId);

  if (!session) {
    return NextResponse.json(
      { detail: "Session not found. Upload files first." },
      { status: 404 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { detail: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  if (!session.arabic_text || !session.english_text) {
    return NextResponse.json(
      { detail: "Document text not found in session." },
      { status: 400 }
    );
  }

  // Start async review pipeline (fire and forget — errors are caught inside runReview)
  runReview(sessionId).catch((err) => {
    console.error(`[FS_reviewer] Unhandled review error for ${sessionId}:`, err);
  });

  return NextResponse.json({
    session_id: sessionId,
    status: "pending",
    message: "Review started. Poll status endpoint for progress.",
  });
}

async function runReview(sessionId: string) {
  const session = getSession(sessionId);
  if (!session || !session.arabic_text || !session.english_text) return;

  try {
    // Step 1: Extract structured data from Arabic
    updateSession(sessionId, {
      status: "extracting",
      progress: 15,
      current_step: "Extracting structured data from Arabic document...",
    });

    const arabicData = await extractFinancialData(session.arabic_text, "Arabic");

    updateSession(sessionId, {
      progress: 35,
      current_step: "Extracting structured data from English document...",
    });

    const englishData = await extractFinancialData(session.english_text, "English");

    // Step 2: AI comparison
    updateSession(sessionId, {
      status: "analyzing",
      progress: 55,
      current_step: "AI analyzing and comparing both versions...",
    });

    const comparisonResults = await compareVersions(
      arabicData,
      englishData,
      session.arabic_text,
      session.english_text
    );

    // Step 3: Local number comparison
    updateSession(sessionId, {
      status: "comparing",
      progress: 85,
      current_step: "Running supplementary number checks...",
    });

    const localFindings = quickNumbersCheck(
      session.arabic_text,
      session.english_text
    );

    // Build findings
    const rawFindings = (comparisonResults.findings as Record<string, unknown>[]) || [];
    const findings: Finding[] = rawFindings.map(
      (f: Record<string, unknown>, i: number) => ({
        id: (f.id as string) || `claude-${i + 1}`,
        category: (f.category as Finding["category"]) || "numbers_mismatch",
        severity: (f.severity as Finding["severity"]) || "info",
        title: (f.title as string) || "",
        description: (f.description as string) || "",
        arabic_value: (f.arabic_value as string) || null,
        english_value: (f.english_value as string) || null,
        location: (f.location as string) || "",
        recommendation: (f.recommendation as string) || "",
      })
    );

    // Add unique local findings
    const claudeKeys = new Set(
      findings
        .filter((f) => f.category === "numbers_mismatch")
        .map((f) => `${f.arabic_value}|${f.english_value}`)
    );
    for (const lf of localFindings) {
      if (!claudeKeys.has(`${lf.arabic_value}|${lf.english_value}`)) {
        findings.push(lf);
      }
    }

    // Build statement summaries
    const rawSummaries =
      (comparisonResults.statement_summaries as Record<string, unknown>[]) || [];
    const statementSummaries: StatementSummary[] = rawSummaries.map(
      (s: Record<string, unknown>) => ({
        statement_type: (s.statement_type as string) || "",
        title_en: (s.title_en as string) || "",
        title_ar: (s.title_ar as string) || "",
        line_items_count: (s.line_items_count as number) || 0,
        total_amount: (s.total_amount as number) ?? null,
        issues_count: (s.issues_count as number) || 0,
      })
    );

    const critical = findings.filter((f) => f.severity === "critical").length;
    const warning = findings.filter((f) => f.severity === "warning").length;
    const info = findings.filter((f) => f.severity === "info").length;

    const results: ReviewResults = {
      session_id: sessionId,
      status: "completed",
      created_at: session.created_at,
      completed_at: new Date().toISOString(),
      arabic_filename: session.arabic_filename,
      english_filename: session.english_filename,
      findings,
      summary: (comparisonResults.summary as Record<string, unknown>) || {},
      statement_summaries: statementSummaries,
      total_findings: findings.length,
      critical_count: critical,
      warning_count: warning,
      info_count: info,
    };

    updateSession(sessionId, {
      status: "completed",
      progress: 100,
      current_step: "Review complete!",
      results,
    });
  } catch (error) {
    updateSession(sessionId, {
      status: "failed",
      current_step: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      error: String(error),
    });
  }
}
