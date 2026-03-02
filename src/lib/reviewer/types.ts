export type ReviewStatus =
  | "pending"
  | "extracting"
  | "analyzing"
  | "comparing"
  | "completed"
  | "failed";

export type Severity = "critical" | "warning" | "info";

export type FindingCategory =
  | "numbers_mismatch"
  | "totals_error"
  | "cross_statement"
  | "notes_reference"
  | "comparative_figures"
  | "terminology"
  | "completeness"
  | "formatting";

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  arabic_value: string | null;
  english_value: string | null;
  location: string;
  recommendation: string;
}

export interface StatementSummary {
  statement_type: string;
  title_en: string;
  title_ar: string;
  line_items_count: number;
  total_amount: number | null;
  issues_count: number;
}

export interface ReviewSession {
  status: ReviewStatus;
  progress: number;
  current_step: string;
  created_at: string;
  arabic_filename: string;
  english_filename: string;
  arabic_text?: string;
  english_text?: string;
  results?: ReviewResults;
  error?: string;
}

export interface ReviewResults {
  session_id: string;
  status: ReviewStatus;
  created_at: string;
  completed_at: string;
  arabic_filename: string;
  english_filename: string;
  findings: Finding[];
  summary: Record<string, unknown>;
  statement_summaries: StatementSummary[];
  total_findings: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
}
