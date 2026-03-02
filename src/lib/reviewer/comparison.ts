import { Finding } from "./types";

function extractNumbers(text: string): Set<string> {
  const pattern = /[\d,]+\.?\d*/g;
  const matches = text.match(pattern) || [];
  const numbers = new Set<string>();
  for (const m of matches) {
    const normalized = m.replace(/,/g, "");
    if (normalized.replace(/\./g, "").length > 0) {
      numbers.add(normalized);
    }
  }
  return numbers;
}

export function quickNumbersCheck(
  arabicText: string,
  englishText: string
): Finding[] {
  const arabicNumbers = extractNumbers(arabicText);
  const englishNumbers = extractNumbers(englishText);
  const findings: Finding[] = [];
  let counter = 0;

  // Numbers in English but not in Arabic
  for (const num of englishNumbers) {
    if (!arabicNumbers.has(num)) {
      try {
        if (parseFloat(num) < 10) continue;
      } catch {
        continue;
      }
      findings.push({
        id: `local-${++counter}`,
        category: "numbers_mismatch",
        severity: "warning",
        title: `Number ${num} found only in English version`,
        description: `The number ${num} appears in the English document but was not found in the Arabic document.`,
        arabic_value: null,
        english_value: num,
        location: "Cross-document comparison",
        recommendation:
          "Verify this number exists in the Arabic version with correct formatting.",
      });
    }
  }

  // Numbers in Arabic but not in English
  for (const num of arabicNumbers) {
    if (!englishNumbers.has(num)) {
      try {
        if (parseFloat(num) < 10) continue;
      } catch {
        continue;
      }
      findings.push({
        id: `local-${++counter}`,
        category: "numbers_mismatch",
        severity: "warning",
        title: `Number ${num} found only in Arabic version`,
        description: `The number ${num} appears in the Arabic document but was not found in the English document.`,
        arabic_value: num,
        english_value: null,
        location: "Cross-document comparison",
        recommendation:
          "Verify this number exists in the English version with correct formatting.",
      });
    }
  }

  return findings;
}
