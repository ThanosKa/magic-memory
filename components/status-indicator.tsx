"use client";

import useSWR from "swr";
import { z } from "zod";

import { cn } from "@/lib/utils";

const STATUS_PAGE_URL = "https://thanoska.betteruptime.com";
const STATUS_FEED_URL = `${STATUS_PAGE_URL}/index.json`;
const STATUS_RESOURCE_NAME = "Magic Memory";
const STATUS_TIMEOUT_MS = 5000;

const serviceStateSchema = z.enum(["operational", "degraded", "downtime", "maintenance"]);

type ServiceState = z.infer<typeof serviceStateSchema>;

const statusFeedSchema = z.object({
  data: z.object({ attributes: z.object({ aggregate_state: z.string() }) }),
  included: z
    .array(
      z.object({
        type: z.string(),
        attributes: z.object({ public_name: z.string().nullish(), status: z.string().nullish() }),
      })
    )
    .default([]),
});

const STATE_DISPLAY = {
  operational: { label: "All systems normal", dotClassName: "bg-success" },
  degraded: { label: "Partial outage", dotClassName: "bg-ember" },
  downtime: { label: "Major outage", dotClassName: "bg-destructive" },
  maintenance: { label: "Under maintenance", dotClassName: "bg-paper/60" },
} satisfies Record<ServiceState, { label: string; dotClassName: string }>;

function readServiceState(body: unknown): ServiceState | null {
  const feed = statusFeedSchema.safeParse(body);
  if (!feed.success) return null;
  const resource = feed.data.included.find(
    (item) => item.type === "status_page_resource" && item.attributes.public_name === STATUS_RESOURCE_NAME
  );
  const state = serviceStateSchema.safeParse(resource?.attributes.status ?? feed.data.data.attributes.aggregate_state);
  return state.success ? state.data : null;
}

async function fetchServiceState(url: string): Promise<ServiceState | null> {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(STATUS_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`Status feed returned ${response.status}`);
  return readServiceState(await response.json());
}

export function StatusIndicator({ className }: { className?: string }) {
  const { data: state } = useSWR(STATUS_FEED_URL, fetchServiceState, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });
  const display = state ? STATE_DISPLAY[state] : null;

  return (
    <a
      href={STATUS_PAGE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "focus-ring inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60 transition-colors hover:text-paper motion-reduce:transition-none",
        className
      )}
    >
      {display ? <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", display.dotClassName)} /> : null}
      <span>{display?.label ?? "Status"}</span>
    </a>
  );
}
