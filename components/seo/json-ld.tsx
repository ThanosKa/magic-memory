type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/** Renders one `application/ld+json` script per object, in order. */
export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
