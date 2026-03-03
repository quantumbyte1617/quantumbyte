import { describe, it, expect } from "vitest";
import { quickNumbersCheck } from "../lib/reviewer/comparison";

describe("quickNumbersCheck", () => {
  it("returns empty findings when numbers match", () => {
    const findings = quickNumbersCheck("Total: 1,000,000", "Total: 1,000,000");
    expect(findings).toHaveLength(0);
  });

  it("detects number in English but not in Arabic", () => {
    const findings = quickNumbersCheck("Total: 500", "Total: 2,000,000");
    const englishOnly = findings.find((f) => f.english_value === "2000000");
    expect(englishOnly).toBeDefined();
  });

  it("detects number in Arabic but not in English", () => {
    const findings = quickNumbersCheck("Total: 2,000,000", "Total: 500");
    const arabicOnly = findings.find((f) => f.arabic_value === "2000000");
    expect(arabicOnly).toBeDefined();
  });

  it("ignores small numbers below 10", () => {
    const findings = quickNumbersCheck("Note 1", "Note 2");
    expect(findings).toHaveLength(0);
  });

  it("returns Finding objects with correct shape", () => {
    const findings = quickNumbersCheck("AR: 999,999", "EN: 888,888");
    expect(findings.length).toBeGreaterThan(0);
    const f = findings[0];
    expect(f).toHaveProperty("id");
    expect(f).toHaveProperty("category", "numbers_mismatch");
    expect(f).toHaveProperty("severity");
    expect(f).toHaveProperty("title");
  });
});
