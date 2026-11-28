import type { ErrorEvent } from "@sentry/browser";
import { describe, expect, it } from "vitest";
import { EXTENSION_URLS, isAutomatedBrowser, isNoise, isTranslatedPage } from "@/lib/error-noise";

const CHROME_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36";

function errorEvent(type: string, value: string): ErrorEvent {
  return { type: undefined, exception: { values: [{ type, value }] } };
}

const chunkFailure = errorEvent(
  "TypeError",
  "Failed to fetch dynamically imported module: https://example.com/_next/static/chunks/DfWVYgV9.js",
);
const clerkChunkFailure = errorEvent("ChunkLoadError", "Loading chunk 9573 failed.");
const hydrationMismatch = errorEvent(
  "Error",
  "Minified React error #418; visit https://react.dev/errors/418?args[]=HTML",
);
const unrelated = errorEvent("TypeError", "Cannot read properties of undefined (reading 'id')");

const idle = { unloading: false, translated: false };

describe("isAutomatedBrowser", () => {
  it.each([
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ChatGPT-User/1.0; +https://openai.com/bot)",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/152.0.0.0 Safari/537.36",
  ])("flags %s", (userAgent) => {
    expect(isAutomatedBrowser({ userAgent, webdriver: false })).toBe(true);
  });

  it("flags a browser driven by automation even with a normal user agent", () => {
    expect(isAutomatedBrowser({ userAgent: CHROME_MAC, webdriver: true })).toBe(true);
  });

  it.each([
    CHROME_MAC,
    "Mozilla/5.0 (Linux; Android 13; CUBOT KINGKONG 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36",
  ])("lets a real visitor through: %s", (userAgent) => {
    expect(isAutomatedBrowser({ userAgent, webdriver: false })).toBe(false);
  });
});

describe("isTranslatedPage", () => {
  it("recognises the class Chrome translation adds to <html>", () => {
    expect(isTranslatedPage({ className: "dark translated-rtl" })).toBe(true);
  });

  it("ignores an untranslated page", () => {
    expect(isTranslatedPage({ className: "dark" })).toBe(false);
  });
});

describe("isNoise", () => {
  it("drops a script download that failed because the visitor was leaving the page", () => {
    expect(isNoise({ event: chunkFailure, page: { ...idle, unloading: true } })).toBe(true);
    expect(isNoise({ event: clerkChunkFailure, page: { ...idle, unloading: true } })).toBe(true);
  });

  it("keeps a script download that failed while the visitor stayed, since that can be a broken deploy", () => {
    expect(isNoise({ event: chunkFailure, page: idle })).toBe(false);
  });

  it("drops a hydration mismatch on a translated page", () => {
    expect(isNoise({ event: hydrationMismatch, page: { ...idle, translated: true } })).toBe(true);
  });

  it("keeps a hydration mismatch on an untranslated page, since that can be our bug", () => {
    expect(isNoise({ event: hydrationMismatch, page: idle })).toBe(false);
  });

  it("keeps every other error whatever the page is doing", () => {
    expect(isNoise({ event: unrelated, page: { unloading: true, translated: true } })).toBe(false);
  });

  it("reads a message-only event", () => {
    expect(
      isNoise({ event: { type: undefined, message: "Hydration failed" }, page: { ...idle, translated: true } }),
    ).toBe(true);
  });
});

describe("EXTENSION_URLS", () => {
  it.each(["chrome-extension://abcdef/content.js", "moz-extension://1234/inject.js", "safari-web-extension://x/y.js"])(
    "matches %s",
    (url) => {
      expect(EXTENSION_URLS.some((pattern) => pattern.test(url))).toBe(true);
    },
  );

  it("does not match our own scripts", () => {
    expect(EXTENSION_URLS.some((pattern) => pattern.test("https://example.com/_next/static/chunks/a.js"))).toBe(
      false,
    );
  });
});
