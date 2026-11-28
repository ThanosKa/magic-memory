import { init } from "@sentry/browser";
import { EXTENSION_URLS, isAutomatedBrowser, isNoise, isTranslatedPage } from "@/lib/error-noise";
import { getErrorTrackingOptions } from "@/lib/error-tracking";

let unloading = false;

function watchUnload(): void {
  const markUnloading = (): void => {
    unloading = true;
  };
  window.addEventListener("beforeunload", markUnloading);
  window.addEventListener("pagehide", markUnloading);
  window.addEventListener("pageshow", () => {
    unloading = false;
  });
}

const options = getErrorTrackingOptions();
const automated = isAutomatedBrowser(navigator);

if (options.enabled && !automated) watchUnload();

init({
  ...options,
  enabled: options.enabled && !automated,
  denyUrls: EXTENSION_URLS,
  beforeSend: (event) => {
    const page = { unloading, translated: isTranslatedPage(document.documentElement) };
    return isNoise({ event, page }) ? null : options.beforeSend(event);
  },
  integrations: (defaults) => defaults.filter(({ name }) => name !== "BrowserSession"),
});
