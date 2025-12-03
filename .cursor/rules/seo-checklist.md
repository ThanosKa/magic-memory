# SEO Checklist for Cursor

## Every Page Must Have

- [ ] Unique `title` in metadata
- [ ] Unique `description` in metadata (150-160 chars)
- [ ] Proper heading hierarchy (h1 > h2 > h3)
- [ ] Alt text on all images
- [ ] Semantic HTML (main, section, article, nav, footer)

## Layout Must Have

- [ ] `lang` attribute on html
- [ ] Viewport meta tag
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URL
- [ ] Structured data (JSON-LD)
- [ ] Font display: swap

## Performance

- [ ] Use Next.js Image component
- [ ] Lazy load below-fold images
- [ ] Preload critical resources
- [ ] Minimize bundle size
- [ ] Use font-display: swap

## Accessibility (helps SEO)

- [ ] Skip to content link (if applicable)
- [ ] Focus indicators
- [ ] Color contrast (4.5:1 minimum)
- [ ] Screen reader text where needed

## Run Audit

\`\`\`bash
pnpm seo:audit
\`\`\`
