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

export function ThemeColorScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
