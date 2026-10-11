import type { BillingAdapter, CreateCheckoutParams } from "./types"

export class PaymobAdapter implements BillingAdapter {
  async createCheckout(_params: CreateCheckoutParams): Promise<{ checkoutUrl: string }> {
    throw new Error("Paymob adapter not implemented")
  }

  async handleWebhook(_payload: Record<string, unknown>, _signature: string): Promise<{ handled: boolean }> {
    throw new Error("Paymob adapter not implemented")
  }

  async cancelSubscription(_externalSubscriptionId: string): Promise<{ success: boolean }> {
    throw new Error("Paymob adapter not implemented")
  }
}

export const paymobAdapter = new PaymobAdapter()
