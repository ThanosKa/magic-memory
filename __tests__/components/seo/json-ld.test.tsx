import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JsonLd } from "@/components/seo/json-ld";

describe("JsonLd", () => {
  it("renders one ld+json script per object, in order, with JSON.stringify output", () => {
    const data = [
      { "@context": "https://schema.org", "@type": "A", name: "one" },
      { "@context": "https://schema.org", "@type": "B", name: "two" },
      { "@context": "https://schema.org", "@type": "C", name: "three" },
    ];
    const html = renderToStaticMarkup(<JsonLd data={data} />);
    const scripts = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    expect(scripts).toHaveLength(3);
    expect(scripts.map((m) => m[1])).toEqual(
      data.map((d) => JSON.stringify(d)),
    );
  });

  it("renders one script for a single object", () => {
    const html = renderToStaticMarkup(<JsonLd data={{ "@type": "A" }} />);
    expect(html.match(/<script/g)).toHaveLength(1);
  });

  it("writes every < as \u003c and parses back to the original object", () => {
    const data = { "@type": "A", name: "a </script><script>x</script> b <" };
    const html = renderToStaticMarkup(<JsonLd data={data} />);
    const match = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(match?.[1]).not.toContain("<");
    expect(match?.[1]).toContain("\\u003c/script>");
    expect(JSON.parse(match?.[1] ?? "")).toEqual(data);
  });
});
