import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  clerk_user_id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  profile_image: z.string().url().nullable(),
  paid_credits: z.number().int().nonnegative().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;

export const userInsertSchema = z.object({
  clerk_user_id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  profile_image: z.string().url().nullable().optional(),
  paid_credits: z.number().int().nonnegative().optional().default(0),
});

export type UserInsert = z.infer<typeof userInsertSchema>;

export const restorationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  original_image_url: z.string().url(),
  restored_image_url: z.string().url(),
  used_free_credit: z.boolean(),
  created_at: z.string().datetime(),
});

export type Restoration = z.infer<typeof restorationSchema>;

export const restorationInsertSchema = z.object({
  user_id: z.string().uuid(),
  original_image_url: z.string().url(),
  restored_image_url: z.string().url(),
  used_free_credit: z.boolean(),
});

export type RestorationInsert = z.infer<typeof restorationInsertSchema>;

export const purchaseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  stripe_payment_id: z.string(),
  credits_purchased: z.number().int().positive(),
  amount_paid: z.number().int().positive(), // in cents
  package_type: z.enum(["starter", "growth", "premium"]),
  created_at: z.string().datetime(),
});

export type Purchase = z.infer<typeof purchaseSchema>;

export const purchaseInsertSchema = z.object({
  user_id: z.string().uuid(),
  stripe_payment_id: z.string(),
  credits_purchased: z.number().int().positive(),
  amount_paid: z.number().int().positive(),
  package_type: z.enum(["starter", "growth", "premium"]),
});

export type PurchaseInsert = z.infer<typeof purchaseInsertSchema>;
