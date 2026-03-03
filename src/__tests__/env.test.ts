import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("Environment validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws when ANTHROPIC_API_KEY is missing", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    await expect(() => import("../lib/env")).rejects.toThrow();
  });
});
