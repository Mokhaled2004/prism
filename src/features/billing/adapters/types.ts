import type { PlanId } from "../plans"

export interface CreateCheckoutParams {
  organizationId: string
  planId: PlanId
  successUrl: string
  cancelUrl: string
}

export interface BillingAdapter {
  createCheckout(params: CreateCheckoutParams): Promise<{ checkoutUrl: string }>
  handleWebhook(payload: Record<string, unknown>, signature: string): Promise<{ handled: boolean }>
  cancelSubscription(externalSubscriptionId: string): Promise<{ success: boolean }>
}
