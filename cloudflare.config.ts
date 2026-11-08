import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "magic-memory",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-07",
    compatibilityFlags: ["nodejs_compat"],
    observability: { enabled: true },
    domains: ["magic-memory.dev"],
    // magic-memory.dev is the only public address. workers.dev would skip the
    // zone's rules and serve a duplicate site where Clerk sign-in fails.
    workersDev: false,
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      // Only declared names reach the Worker's process.env. Values come from
      // .env.<mode>.local locally and from Worker secrets once deployed.
      CLERK_SECRET_KEY: bindings.secret(),
      CLERK_WEBHOOK_SECRET: bindings.secret(),
      // Not really secret. To make it bindings.text("info"), first delete the
      // remote LOG_LEVEL secret, or cf deploy aborts on the name clash.
      LOG_LEVEL: bindings.secret(),
      REPLICATE_API_TOKEN: bindings.secret(),
      RESEND_API_KEY: bindings.secret(),
      STRIPE_SECRET_KEY: bindings.secret(),
      STRIPE_WEBHOOK_SECRET: bindings.secret(),
      SUPABASE_SERVICE_ROLE_KEY: bindings.secret(),
      UPSTASH_REDIS_REST_TOKEN: bindings.secret(),
      UPSTASH_REDIS_REST_URL: bindings.secret(),
    },
  }),
});
