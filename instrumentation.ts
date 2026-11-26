import { captureException, flush } from "@sentry/cloudflare";
import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (error, _request, context) => {
  captureException(error, {
    tags: { routePath: context.routePath, routeType: context.routeType },
  });
  await flush(2000);
};
