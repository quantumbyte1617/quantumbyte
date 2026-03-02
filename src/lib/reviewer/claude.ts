import Anthropic from "@anthropic-ai/sdk";

const EXTRACTION_PROMPT = `You are a financial statement auditor. Extract all structured financial data from this {language} financial statement document.

Return a JSON object with this exact structure:
{
  "statements": [
    {
      "statement_type": "balance_sheet" | "income_statement" | "cash_flow" | "equity_changes",
      "title": "Statement title as it appears",
      "currency": "SAR or USD etc.",
      "period": "The reporting period",
      "line_items": [
        {
          "label": "Line item name",
          "amount": 123456.00,
          "note_ref": "Note number if referenced, e.g. '5'",
          "is_total": true/false,
          "indent_level": 0
        }
      ]
    }
  ],
  "notes": {
    "1": "Summary of note 1 content",
    "2": "Summary of note 2 content"
  }
}

Important:
- Extract ALL numbers exactly as they appear (do not convert or round)
- Capture every note reference
- Mark totals and subtotals with is_total: true
- For Arabic documents, keep the original Arabic text for labels
- Include ALL line items, even zero-value ones
- If amounts are in thousands, note this in the currency field (e.g. "SAR thousands")

Document text:
{document_text}`;

const COMPARISON_PROMPT = `You are an expert external auditor performing a cross-language review of financial statements.
You have the Arabic version and English version of the same financial statements.

Perform these checks and return findings as JSON:

1. **Numbers Match**: Every number in English must exist in Arabic and vice versa
2. **Statement Totals**: Verify all subtotals and totals add up correctly in both versions
3. **Cross-Statement Consistency**: Cash on balance sheet = ending cash on cash flow, net income ties between statements
4. **Notes References**: Every note referenced exists, note figures match statement figures
5. **Comparative Figures**: Prior year numbers are consistent across both versions
6. **Terminology**: IFRS-compliant terms in English, standard Arabic accounting terms
7. **Completeness**: All required statements present in both versions
8. **Formatting**: Number formatting consistency (thousands separators, decimals)

Return JSON:
{
  "findings": [
    {
      "category": "numbers_mismatch" | "totals_error" | "cross_statement" | "notes_reference" | "comparative_figures" | "terminology" | "completeness" | "formatting",
      "severity": "critical" | "warning" | "info",
      "title": "Brief finding title",
      "description": "Detailed description of the issue",
      "arabic_value": "Value from Arabic version (if applicable)",
      "english_value": "Value from English version (if applicable)",
      "location": "Where in the statements this was found",
      "recommendation": "Suggested action to resolve"
    }
  ],
  "summary": {
    "total_checks_performed": 0,
    "statements_reviewed": [],
    "overall_assessment": "Brief overall assessment",
    "numbers_accuracy_score": "percentage or rating",
    "translation_quality_score": "percentage or rating"
  },
  "statement_summaries": [
    {
      "statement_type": "balance_sheet",
      "title_en": "English title",
      "title_ar": "Arabic title",
      "line_items_count": 0,
      "total_amount": 0,
      "issues_count": 0
    }
  ]
}

Be thorough but precise. Only report genuine discrepancies, not formatting-only differences.
Flag missing items as critical. Flag number mismatches as critical. Flag terminology issues as warning.

ARABIC VERSION EXTRACTED DATA:
{arabic_data}

ENGLISH VERSION EXTRACTED DATA:
{english_data}

ARABIC RAW TEXT:
{arabic_text}

ENGLISH RAW TEXT:
{english_text}`;

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

function parseJsonResponse(text: string): Record<string, unknown> {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    const jsonLines: string[] = [];
    let started = false;
    for (const line of lines) {
      if (!started && line.startsWith("```")) {
        started = true;
        continue;
      }
      if (started && line.trim() === "```") break;
      if (started) jsonLines.push(line);
    }
    cleaned = jsonLines.join("\n");
  }
  return JSON.parse(cleaned);
}

export async function extractFinancialData(
  documentText: string,
  language: string
): Promise<Record<string, unknown>> {
  const client = getClient();
  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";

  const prompt = EXTRACTION_PROMPT.replace("{language}", language).replace(
    "{document_text}",
    documentText.slice(0, 80000)
  );

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return parseJsonResponse(block.text);
}

export async function compareVersions(
  arabicData: Record<string, unknown>,
  englishData: Record<string, unknown>,
  arabicText: string,
  englishText: string
): Promise<Record<string, unknown>> {
  const client = getClient();
  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";

  const prompt = COMPARISON_PROMPT.replace(
    "{arabic_data}",
    JSON.stringify(arabicData, null, 2).slice(0, 40000)
  )
    .replace(
      "{english_data}",
      JSON.stringify(englishData, null, 2).slice(0, 40000)
    )
    .replace("{arabic_text}", arabicText.slice(0, 20000))
    .replace("{english_text}", englishText.slice(0, 20000));

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return parseJsonResponse(block.text);
}
