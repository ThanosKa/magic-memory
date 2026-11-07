import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { POST } from "@/app/api/stripe/webhook/route";
import { CREDIT_PACKAGES } from "@/lib/constants";
import { sendPurchaseEmail } from "@/lib/email";

vi.mock("@/lib/supabase/server");
vi.mock("@/lib/logger");

const { mockStripeConstructEvent } = vi.hoisted(() => {
  return { mockStripeConstructEvent: vi.fn() };
});

vi.mock("stripe", () => {
  return {
    default: function () {
      return {
        webhooks: {
          constructEventAsync: mockStripeConstructEvent,
        },
      };
    },
  };
});

function createMockRequest(
  body: string,
  signature = "valid_signature"
): NextRequest {
  return {
    text: () => Promise.resolve(body),
    headers: new Headers({
      "stripe-signature": signature,
    }),
  } as unknown as NextRequest;
}

describe("POST /api/stripe/webhook", () => {
  const originalStripeSecret = process.env.STRIPE_SECRET_KEY;
  const originalWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStripeConstructEvent.mockReset();
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_dummy";
  });

  afterAll(() => {
    process.env.STRIPE_SECRET_KEY = originalStripeSecret;
    process.env.STRIPE_WEBHOOK_SECRET = originalWebhookSecret;
  });

  it("returns 400 for invalid signature", async () => {
    mockStripeConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const request = createMockRequest("{}");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Webhook processing failed");
  });

  it("returns received: true for non-checkout events", async () => {
    mockStripeConstructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: { object: {} },
    });

    const request = createMockRequest("{}");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data?.received).toBe(true);
  });

  describe("checkout.session.completed", () => {
    const originalPriceId = CREDIT_PACKAGES.starter.priceId;

    function setStarterPriceId(value: string) {
      Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", {
        value,
        writable: true,
        configurable: true,
      });
    }

    function deliver(overrides: Record<string, unknown> = {}) {
      mockStripeConstructEvent.mockReturnValue({
        type: "checkout.session.completed",
        id: "evt_123",
        data: {
          object: {
            id: "cs_test_123",
            metadata: {
              userId: "user-uuid",
              packageType: "starter",
              credits: "20",
              priceId: "price_starter",
            },
            payment_intent: "pi_new_123",
            amount_total: 999,
            currency: "eur",
            customer_details: { email: "buyer@example.com", name: "Buyer" },
            ...overrides,
          },
        },
      });

      return POST(createMockRequest("{}"));
    }

    function useGrantResult(result: { data: boolean | null; error: { message: string } | null }) {
      const rpc = vi.fn().mockResolvedValue(result);
      vi.mocked(getSupabaseAdminClient).mockReturnValue({
        rpc,
      } as unknown as ReturnType<typeof getSupabaseAdminClient>);
      return rpc;
    }

    beforeEach(() => {
      vi.mocked(sendPurchaseEmail).mockClear();
      setStarterPriceId("price_starter");
    });

    afterAll(() => {
      setStarterPriceId(originalPriceId);
    });

    it("grants the package through one atomic call and emails the buyer", async () => {
      const rpc = useGrantResult({ data: true, error: null });

      const response = await deliver();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data?.received).toBe(true);
      expect(rpc).toHaveBeenCalledWith("grant_purchase_credits", {
        p_user_id: "user-uuid",
        p_stripe_payment_id: "pi_new_123",
        p_credits: 20,
        p_amount_paid: 999,
        p_package_type: "starter",
      });
      expect(sendPurchaseEmail).toHaveBeenCalledTimes(1);
    });

    it("answers 500 when the grant fails, so Stripe redelivers", async () => {
      useGrantResult({ data: null, error: { message: "database unavailable" } });

      const response = await deliver();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(sendPurchaseEmail).not.toHaveBeenCalled();
    });

    it("answers 200 without a second email when the payment was already granted", async () => {
      useGrantResult({ data: false, error: null });

      const response = await deliver();

      expect(response.status).toBe(200);
      expect(sendPurchaseEmail).not.toHaveBeenCalled();
    });

    it("records what was actually paid on a discounted checkout", async () => {
      const rpc = useGrantResult({ data: true, error: null });

      const response = await deliver({
        payment_intent: "pi_discount_123",
        amount_total: 799,
        amount_subtotal: 999,
        total_details: { amount_discount: 200 },
      });

      expect(response.status).toBe(200);
      expect(rpc).toHaveBeenCalledWith(
        "grant_purchase_credits",
        expect.objectContaining({
          p_stripe_payment_id: "pi_discount_123",
          p_credits: 20,
          p_amount_paid: 799,
        })
      );
    });

    it("uses the session id as the payment id on a 100% discount", async () => {
      const rpc = useGrantResult({ data: true, error: null });

      const response = await deliver({
        id: "cs_test_full_discount",
        payment_intent: null,
        amount_total: 0,
        amount_subtotal: 999,
        total_details: { amount_discount: 999 },
        payment_status: "no_payment_required",
      });

      expect(response.status).toBe(200);
      expect(rpc).toHaveBeenCalledWith(
        "grant_purchase_credits",
        expect.objectContaining({
          p_stripe_payment_id: "cs_test_full_discount",
          p_credits: 20,
          p_amount_paid: 0,
        })
      );
    });

    it("grants nothing when the amount does not match the package", async () => {
      const rpc = useGrantResult({ data: true, error: null });

      const response = await deliver({ amount_total: 100, amount_subtotal: 100 });

      expect(response.status).toBe(200);
      expect(rpc).not.toHaveBeenCalled();
    });
  });
});
