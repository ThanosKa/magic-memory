const SCRIPT = `(function () {
  var root = document.documentElement;
  function sync() {
    var meta = document.querySelector('meta[name="theme-color"]');
    var ink = window.getComputedStyle(root).getPropertyValue("--ink").trim();
    if (meta && ink) meta.setAttribute("content", ink);
  }
  try {
    sync();
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  } catch (e) {}
})();`;

/**
 * Keeps <meta name="theme-color"> (browser chrome on phones) in step with the
 * page colour. It runs before first paint, right after the next-themes script
 * has set <html data-theme> (so render it inside ThemeProvider), then again on
 * every theme switch. It reads --ink from app/globals.css, so no colour lives here.
 */
export function ThemeColorScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
