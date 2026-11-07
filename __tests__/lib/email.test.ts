import { describe, expect, it, vi } from "vitest";

// vitest.setup.ts mocks this module for every test; here we need the real one.
vi.unmock("@/lib/email");

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn() };
  },
}));

import { buildPurchaseHtml, buildWelcomeHtml } from "@/lib/email";

describe("welcome email", () => {
  it("greets by first name only", () => {
    const html = buildWelcomeHtml("Maria Papadopoulou");
    expect(html).toContain("Welcome, <em>Maria.</em>");
    expect(html).not.toContain("Papadopoulou");
  });

  it("greets generically without a name", () => {
    expect(buildWelcomeHtml(null)).toContain("Welcome to <em>Magic Memory.</em>");
  });

  it("escapes a name that contains HTML", () => {
    const html = buildWelcomeHtml("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});

describe("purchase email", () => {
  it("greets generically without a name", () => {
    expect(buildPurchaseHtml(null, "Starter", 20)).toContain("Hi there,");
  });

  it("escapes a name that contains HTML", () => {
    const html = buildPurchaseHtml("<script>", "Starter", 20);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("names the pack and the restorations", () => {
    const html = buildPurchaseHtml("Maria", "Starter", 20);
    expect(html).toContain("Starter");
    expect(html).toContain("20 restorations");
  });
});
