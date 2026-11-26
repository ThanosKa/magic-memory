import { withSentry } from "@sentry/cloudflare";
import vinext from "vinext/server/fetch-handler";
import { getErrorTrackingOptions } from "@/lib/error-tracking";

export * from "vinext/server/fetch-handler";

export default withSentry(() => getErrorTrackingOptions(), vinext);
