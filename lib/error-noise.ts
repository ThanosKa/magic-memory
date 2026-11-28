import type { ErrorEvent } from "@sentry/browser";

const AUTOMATED_USER_AGENT =
  /bot\/|\bbot\b|crawl|spider|slurp|headless|lighthouse|chatgpt|facebookexternalhit|bingpreview/i;

const LOAD_FAILURE =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading (CSS )?chunk \S+ failed|ChunkLoadError/i;

const HYDRATION_MISMATCH = /Minified React error #(418|423|425)\b|Hydration failed/i;

const TRANSLATED_PAGE = /\btranslated-(ltr|rtl)\b/;

/** Script URLs of browser extensions, for Sentry's `denyUrls`: their errors are not ours. */
export const EXTENSION_URLS = [/^(chrome|moz|safari|safari-web|ms-browser)-extension:\/\//i, /^webkit-masked-url:/i];

export type PageState = { unloading: boolean; translated: boolean };

/** True for crawlers and automation-driven browsers, whose errors say nothing about real visitors. */
export function isAutomatedBrowser({ userAgent, webdriver }: { userAgent: string; webdriver: boolean }): boolean {
  return webdriver || AUTOMATED_USER_AGENT.test(userAgent);
}

/** True when Chrome's built-in translation has rewritten the page, which it marks with a class on `<html>`. */
export function isTranslatedPage({ className }: { className: string }): boolean {
  return TRANSLATED_PAGE.test(className);
}

function eventText(event: ErrorEvent): string {
  const values = event.exception?.values ?? [];
  return [event.message, ...values.flatMap((value) => [value.type, value.value])]
    .filter((part): part is string => typeof part === "string")
    .join("\n");
}

/**
 * True for errors the visitor's browser caused rather than our code: a script download cut off because
 * the visitor left the page, or a hydration mismatch on a page the browser translated before React loaded.
 */
export function isNoise({ event, page }: { event: ErrorEvent; page: PageState }): boolean {
  const text = eventText(event);
  return (page.unloading && LOAD_FAILURE.test(text)) || (page.translated && HYDRATION_MISMATCH.test(text));
}
