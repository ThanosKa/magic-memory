import { describe, it, expect } from "vitest"
import { CREDIT_PACKAGES, perPhotoPrice } from "@/lib/constants"

describe("constants", () => {
    describe("CREDIT_PACKAGES", () => {
        it("has correct credit values for each package", () => {
            expect(CREDIT_PACKAGES.starter.credits).toBe(20)
            expect(CREDIT_PACKAGES.growth.credits).toBe(60)
            expect(CREDIT_PACKAGES.premium.credits).toBe(120)
        })

        it("states each pack's restoration count in its features", () => {
            expect(CREDIT_PACKAGES.starter.features).toContain("20 photo restorations")
            expect(CREDIT_PACKAGES.growth.features).toContain("60 photo restorations")
            expect(CREDIT_PACKAGES.premium.features).toContain("120 photo restorations")
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

        it("shows each pack's price per photo in euros", () => {
            expect(perPhotoPrice(CREDIT_PACKAGES.starter)).toBe("€0.50")
            expect(perPhotoPrice(CREDIT_PACKAGES.growth)).toBe("€0.33")
            expect(perPhotoPrice(CREDIT_PACKAGES.premium)).toBe("€0.25")
        })
    })
})
