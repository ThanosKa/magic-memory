import { describe, expect, it, vi } from "vitest";

// vitest.setup.ts mocks this module for every test; here we need the real one.
vi.unmock("@/lib/email");

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn() };
  },
}));

import { buildPurchaseHtml, buildWelcomeHtml } from "@/lib/email";

describe("email templates", () => {
  it("greets by first name only", () => {
    const html = buildWelcomeHtml("Maria Papadopoulou");
    expect(html).toContain("Welcome, <em>Maria.</em>");
    expect(html).not.toContain("Papadopoulou");
  });

  it("falls back to a generic greeting without a name", () => {
    expect(buildWelcomeHtml(null)).toContain("Welcome to <em>Magic Memory.</em>");
    expect(buildPurchaseHtml(null, "Starter", 20)).toContain("Hi there,");
  });

  it("escapes names before they reach the HTML", () => {
    const welcome = buildWelcomeHtml("<img>");
    const purchase = buildPurchaseHtml("<img>", "Starter", 20);
    expect(welcome).toContain("&lt;img&gt;");
    expect(purchase).toContain("&lt;img&gt;");
    expect(welcome).not.toContain("<img>");
    expect(purchase).not.toContain("<img>");
  });

  it("names the pack and the credits on the receipt", () => {
    const html = buildPurchaseHtml("Maria", "Starter", 20);
    expect(html).toContain("Pack");
    expect(html).toContain("Starter");
    expect(html).toContain("20 restorations");
  });

  it("uses the darkroom palette, not the retired purple", () => {
    for (const html of [buildWelcomeHtml("Maria"), buildPurchaseHtml("Maria", "Starter", 20)]) {
      expect(html).toContain("#0d0b09");
      expect(html.toLowerCase()).not.toContain("#7c3aed");
    }
  });
});
