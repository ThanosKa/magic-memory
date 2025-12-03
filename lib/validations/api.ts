import { z } from "zod"

// API request validation schemas

export const restorePhotoRequestSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  originalFilename: z.string().optional().default("photo"),
})

export type RestorePhotoRequest = z.infer<typeof restorePhotoRequestSchema>

// Stripe checkout request
export const createCheckoutRequestSchema = z.object({
  packageType: z.enum(["starter", "growth", "premium"], {
    errorMap: () => ({ message: "Invalid package type" }),
  }),
})

export type CreateCheckoutRequest = z.infer<typeof createCheckoutRequestSchema>

// Generic API response schema
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  })

// Credit balance response
export const creditBalanceSchema = z.object({
  paidCredits: z.number().int().nonnegative(),
  hasFreeDaily: z.boolean(),
  totalCredits: z.number().int().nonnegative(),
  freeResetTime: z.string().optional(),
})

export type CreditBalance = z.infer<typeof creditBalanceSchema>

export const uploadResponseSchema = z.object({
  url: z.string().url(),
  path: z.string(),
  signedUrl: z.string().url().optional(),
  originalFilename: z.string().optional(),
})

export type UploadResponse = z.infer<typeof uploadResponseSchema>

export const restoreResponseSchema = z.object({
  restoredImageUrl: z.string().url(),
  restoredImagePath: z.string().optional(),
  usedFreeCredit: z.boolean(),
  remainingPaidCredits: z.number().int().nonnegative().optional(),
  restorationId: z.string().uuid().optional(),
})

export type RestoreResponse = z.infer<typeof restoreResponseSchema>
