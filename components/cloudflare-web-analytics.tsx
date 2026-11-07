// The beacon token is public: it ships in every page's HTML by design.
const BEACON_TOKEN = "e8227c25760e45718b937d95530dcdb2";

/** Cloudflare Web Analytics beacon. It sets no cookies. */
export function CloudflareWebAnalytics() {
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: BEACON_TOKEN })}
    />
  );
}
