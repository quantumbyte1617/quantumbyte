import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/reviewer/extract";
import { extractFinancialData, compareVersions } from "@/lib/reviewer/claude";
import { quickNumbersCheck } from "@/lib/reviewer/comparison";
import type { Finding, StatementSummary, ReviewResults } from "@/lib/reviewer/types";

export const maxDuration = 60;

const ALLOWED_EXTENSIONS = new Set(["pdf", "docx"]);
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const arabicFile = formData.get("arabic_file") as File | null;
    const englishFile = formData.get("english_file") as File | null;

    if (!arabicFile || !englishFile) {
      return NextResponse.json(
        { detail: "Both arabic_file and english_file are required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { detail: "ANTHROPIC_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // Validate
    for (const [label, file] of [
      ["Arabic", arabicFile],
      ["English", englishFile],
    ] as const) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { detail: `${label} file must be .pdf or .docx (got .${ext})` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { detail: `${label} file is too large (max 20 MB)` },
          { status: 400 }
        );
      }
    }

    // 1. Extract text
    const [arabicBuffer, englishBuffer] = await Promise.all([
      arabicFile.arrayBuffer().then((ab) => Buffer.from(ab)),
      englishFile.arrayBuffer().then((ab) => Buffer.from(ab)),
    ]);

    let arabicText: string;
    let englishText: string;

    try {
      arabicText = await extractText(arabicBuffer, arabicFile.name);
    } catch (err) {
      return NextResponse.json(
        { detail: `Failed to read Arabic file: ${err instanceof Error ? err.message : "Unknown error"}` },
        { status: 422 }
      );
    }

    try {
      englishText = await extractText(englishBuffer, englishFile.name);
    } catch (err) {
      return NextResponse.json(
        { detail: `Failed to read English file: ${err instanceof Error ? err.message : "Unknown error"}` },
        { status: 422 }
      );
    }

    if (!arabicText.trim()) {
      return NextResponse.json(
        { detail: "No text found in Arabic file. It may be scanned/image-based." },
        { status: 422 }
      );
    }
    if (!englishText.trim()) {
      return NextResponse.json(
        { detail: "No text found in English file. It may be scanned/image-based." },
        { status: 422 }
      );
    }

    // 2. Extract structured financial data (parallel)
    const [arabicData, englishData] = await Promise.all([
      extractFinancialData(arabicText, "Arabic"),
      extractFinancialData(englishText, "English"),
    ]);

    // 3. AI comparison
    const comparisonResults = await compareVersions(
      arabicData,
      englishData,
      arabicText,
      englishText
    );

    // 4. Local number checks
    const localFindings = quickNumbersCheck(arabicText, englishText);

    // 5. Build results
    const rawFindings =
      (comparisonResults.findings as Record<string, unknown>[]) || [];
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

    const rawSummaries =
      (comparisonResults.statement_summaries as Record<string, unknown>[]) ||
      [];
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
      session_id: "local",
      status: "completed",
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      arabic_filename: arabicFile.name,
      english_filename: englishFile.name,
      findings,
      summary: (comparisonResults.summary as Record<string, unknown>) || {},
      statement_summaries: statementSummaries,
      total_findings: findings.length,
      critical_count: critical,
      warning_count: warning,
      info_count: info,
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error("[FS_reviewer] Analyze error:", error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
