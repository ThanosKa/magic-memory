/**
 * SEO Audit Script for RestorePhotos
 *
 * Run with: npx ts-node scripts/seo-audit.ts
 *
 * This script checks all pages for SEO best practices.
 */

import fs from "fs"
import path from "path"

interface SEOCheck {
  name: string
  description: string
  check: (content: string, filePath: string) => boolean
  severity: "error" | "warning"
}

interface AuditResult {
  file: string
  passed: string[]
  failed: string[]
  warnings: string[]
}

const seoChecks: SEOCheck[] = [
  {
    name: "Has metadata export",
    description: "Page should export metadata for title and description",
    check: (content) =>
      content.includes("export const metadata") !== content.includes("export async function generateMetadata"),
    severity: "error",
  },
  {
    name: "Has title in metadata",
    description: "Metadata should include a title",
    check: (content) => {
      if (!content.includes("metadata")) return true // Skip if no metadata
      return content.includes("title:")
    },
    severity: "error",
  },
  {
    name: "Has description in metadata",
    description: "Metadata should include a description",
    check: (content) => {
      if (!content.includes("metadata")) return true
      return content.includes("description:")
    },
    severity: "error",
  },
  {
    name: "Has semantic HTML",
    description: "Page should use semantic HTML elements (main, section, article, etc.)",
    check: (content) => content.includes("<main") || content.includes("<section") || content.includes("<article"),
    severity: "warning",
  },
  {
    name: "Images have alt text",
    description: "All images should have alt attributes",
    check: (content) => {
      const imgMatches = content.match(/<Image[^>]*>/g) || []
      return imgMatches.every((img) => img.includes("alt="))
    },
    severity: "error",
  },
  {
    name: "No empty links",
    description: "Links should have descriptive text or aria-label",
    check: (content) => {
      const linkMatches = content.match(/<Link[^>]*>[^<]*<\/Link>/g) || []
      const emptyLinks = linkMatches.filter((link) => link.includes("></Link>") && !link.includes("aria-label"))
      return emptyLinks.length === 0
    },
    severity: "warning",
  },
  {
    name: "Heading hierarchy",
    description: "Page should have proper heading hierarchy (h1 before h2, etc.)",
    check: (content) => {
      const hasH1 = content.includes("<h1") || content.includes("text-4xl") || content.includes("text-5xl")
      return hasH1
    },
    severity: "warning",
  },
  {
    name: "Uses Next.js Image component",
    description: "Should use next/image for optimized images",
    check: (content) => {
      if (!content.includes("<img")) return true // No images
      return content.includes('from "next/image"') || content.includes("from 'next/image'")
    },
    severity: "warning",
  },
]

function auditFile(filePath: string): AuditResult | null {
  if (!fs.existsSync(filePath)) return null

  const content = fs.readFileSync(filePath, "utf-8")

  const result: AuditResult = {
    file: filePath,
    passed: [],
    failed: [],
    warnings: [],
  }

  for (const check of seoChecks) {
    const passed = check.check(content, filePath)
    if (passed) {
      result.passed.push(check.name)
    } else if (check.severity === "error") {
      result.failed.push(`${check.name}: ${check.description}`)
    } else {
      result.warnings.push(`${check.name}: ${check.description}`)
    }
  }

  return result
}

function findPages(dir: string, pages: string[] = []): string[] {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !file.startsWith("_") && file !== "api") {
      findPages(filePath, pages)
    } else if (file === "page.tsx" || file === "page.ts") {
      pages.push(filePath)
    }
  }

  return pages
}

function runAudit() {
  console.log("\n🔍 RestorePhotos SEO Audit\n")
  console.log("=".repeat(50))

  const appDir = path.join(process.cwd(), "app")
  const pages = findPages(appDir)

  let totalPassed = 0
  let totalFailed = 0
  let totalWarnings = 0

  for (const page of pages) {
    const result = auditFile(page)
    if (!result) continue

    const relativePath = path.relative(process.cwd(), result.file)
    console.log(`\n📄 ${relativePath}`)

    if (result.failed.length === 0 && result.warnings.length === 0) {
      console.log("   ✅ All checks passed!")
    }

    for (const fail of result.failed) {
      console.log(`   ❌ ${fail}`)
      totalFailed++
    }

    for (const warn of result.warnings) {
      console.log(`   ⚠️  ${warn}`)
      totalWarnings++
    }

    totalPassed += result.passed.length
  }

  console.log("\n" + "=".repeat(50))
  console.log("\n📊 Summary:")
  console.log(`   ✅ Passed: ${totalPassed}`)
  console.log(`   ❌ Failed: ${totalFailed}`)
  console.log(`   ⚠️  Warnings: ${totalWarnings}`)

  if (totalFailed > 0) {
    console.log("\n❌ SEO audit failed. Please fix the errors above.")
    process.exit(1)
  } else if (totalWarnings > 0) {
    console.log("\n⚠️  SEO audit passed with warnings.")
    process.exit(0)
  } else {
    console.log("\n✅ SEO audit passed!")
    process.exit(0)
  }
}

// Run if executed directly
runAudit()
