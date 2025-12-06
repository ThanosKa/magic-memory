import { describe, it, expect } from "vitest"
import { CREDIT_PACKAGES, APP_CONFIG, type PackageType } from "@/lib/constants"

describe("constants", () => {
    describe("CREDIT_PACKAGES", () => {
        it("has correct credit values for each package", () => {
            expect(CREDIT_PACKAGES.starter.credits).toBe(100)
            expect(CREDIT_PACKAGES.growth.credits).toBe(350)
            expect(CREDIT_PACKAGES.premium.credits).toBe(1000)
        })

        it("has correct prices in cents", () => {
            expect(CREDIT_PACKAGES.starter.price).toBe(999)
            expect(CREDIT_PACKAGES.growth.price).toBe(1999)
            expect(CREDIT_PACKAGES.premium.price).toBe(2999)
        })

        it("has display prices in EUR format", () => {
            expect(CREDIT_PACKAGES.starter.priceDisplay).toBe("€9.99")
            expect(CREDIT_PACKAGES.growth.priceDisplay).toBe("€19.99")
            expect(CREDIT_PACKAGES.premium.priceDisplay).toBe("€29.99")
        })

        it("has unique package names", () => {
            const names = Object.values(CREDIT_PACKAGES).map((pkg) => pkg.name)
            const uniqueNames = new Set(names)
            expect(uniqueNames.size).toBe(names.length)
        })

        it("marks only growth as popular", () => {
            expect(CREDIT_PACKAGES.starter.popular).toBe(false)
            expect(CREDIT_PACKAGES.growth.popular).toBe(true)
            expect(CREDIT_PACKAGES.premium.popular).toBe(false)
        })

        it("all packages have features array", () => {
            const packageTypes: PackageType[] = ["starter", "growth", "premium"]
            packageTypes.forEach((type) => {
                expect(Array.isArray(CREDIT_PACKAGES[type].features)).toBe(true)
                expect(CREDIT_PACKAGES[type].features.length).toBeGreaterThan(0)
            })
        })
    })

    describe("APP_CONFIG", () => {
        it("has correct maxFileSize of 10MB", () => {
            expect(APP_CONFIG.maxFileSize).toBe(10 * 1024 * 1024)
        })

        it("has correct maxImageDimension", () => {
            expect(APP_CONFIG.maxImageDimension).toBe(4000)
        })

        it("has correct freeRestorationPerDay", () => {
            expect(APP_CONFIG.freeRestorationPerDay).toBe(1)
        })

        it("includes expected supported formats", () => {
            expect(APP_CONFIG.supportedFormats).toContain("image/jpeg")
            expect(APP_CONFIG.supportedFormats).toContain("image/png")
            expect(APP_CONFIG.supportedFormats).toContain("image/webp")
        })

        it("has processing time range", () => {
            expect(APP_CONFIG.processingTimeSeconds.min).toBe(5)
            expect(APP_CONFIG.processingTimeSeconds.max).toBe(60)
        })

        it("has app name and description", () => {
            expect(APP_CONFIG.name).toBe("Magic Memory")
            expect(APP_CONFIG.description).toBeDefined()
        })
    })
})
