/// <reference path="../references.ts" />

module ProcessOut {
  export type DynamicCheckoutPublicConfig = {
    invoiceId: string
    projectId: string
    locale?: string
    clientSecret?: string
    capturePayments?: boolean
    allowFallbackToSale?: boolean
  }

  export type DynamicCheckoutInternalConfig = {
    invoiceDetails: Invoice
  }

  export class DynamicCheckoutPaymentConfig {
    invoiceId: DynamicCheckoutPublicConfig["invoiceId"]
    projectId: DynamicCheckoutPublicConfig["projectId"]
    clientSecret: DynamicCheckoutPublicConfig["clientSecret"]
    locale: DynamicCheckoutPublicConfig["locale"] = "en"
    capturePayments: DynamicCheckoutPublicConfig["capturePayments"] = false
    allowFallbackToSale: DynamicCheckoutPublicConfig["allowFallbackToSale"] = false
    invoiceDetails: DynamicCheckoutInternalConfig["invoiceDetails"]

    constructor(config: DynamicCheckoutPublicConfig) {
      this.setInitialConfig(config)
    }

    public getConfig(): DynamicCheckoutPublicConfig & DynamicCheckoutInternalConfig {
      return {
        invoiceId: this.invoiceId,
        projectId: this.projectId,
        locale: this.locale,
        invoiceDetails: this.invoiceDetails,
        capturePayments: this.capturePayments,
        allowFallbackToSale: this.allowFallbackToSale,
      }
    }

    public setInvoiceDetails(invoiceDetails: Invoice) {
      this.invoiceDetails = invoiceDetails
    }

    private setInitialConfig(config: DynamicCheckoutPublicConfig) {
      if (!this.isValidConfig(config)) {
        throw new Error(
          "You must instantiate Dynamic Checkout with a valid config in order to use it",
        )
      }

      this.invoiceId = config.invoiceId
      this.projectId = config.projectId
      this.locale = config.locale || "en"
      this.clientSecret = config.clientSecret
      this.capturePayments = config.capturePayments || false
      this.allowFallbackToSale = config.allowFallbackToSale || false
    }

    private isValidConfig(config: DynamicCheckoutPublicConfig) {
      return !!config.projectId && !!config.invoiceId
    }
  }
}
