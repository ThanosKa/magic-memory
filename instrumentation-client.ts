import { init } from "@sentry/browser";
import { getErrorTrackingOptions } from "@/lib/error-tracking";

init({
  ...getErrorTrackingOptions(),
  integrations: (defaults) => defaults.filter(({ name }) => name !== "BrowserSession"),
});
