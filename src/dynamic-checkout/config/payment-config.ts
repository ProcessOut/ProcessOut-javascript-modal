/// <reference path="../references.ts" />

module ProcessOut {
  export type DynamicCheckoutPaymentConfigType = {
    invoiceId: string;
    projectId: string;
    locale?: string;
    clientSecret?: string;
    capturePayments?: boolean;
    invoiceDetails: Invoice;
  };

  export class DynamicCheckoutPaymentConfig {
    invoiceId: DynamicCheckoutPaymentConfigType["invoiceId"];
    projectId: DynamicCheckoutPaymentConfigType["projectId"];
    clientSecret: DynamicCheckoutPaymentConfigType["clientSecret"];
    locale: DynamicCheckoutPaymentConfigType["locale"] = "en";
    capturePayments: DynamicCheckoutPaymentConfigType["capturePayments"] =
      false;
    invoiceDetails: DynamicCheckoutPaymentConfigType["invoiceDetails"];

    constructor(config: DynamicCheckoutPaymentConfigType) {
      this.setInitialConfig(config);
    }

    public getConfig(): DynamicCheckoutPaymentConfigType {
      return {
        invoiceId: this.invoiceId,
        projectId: this.projectId,
        locale: this.locale,
        invoiceDetails: this.invoiceDetails,
        capturePayments: this.capturePayments,
      };
    }

    public setInvoiceDetails(invoiceDetails: Invoice) {
      this.invoiceDetails = invoiceDetails;
    }

    private setInitialConfig(config: DynamicCheckoutPaymentConfigType) {
      if (!this.isValidConfig(config)) {
        throw new Error(
          "You must instantiate Dynamic Checkout with a valid config in order to use it"
        );
      }

      this.invoiceId = config.invoiceId;
      this.projectId = config.projectId;
      this.locale = config.locale || "en";
      this.clientSecret = config.clientSecret;
      this.capturePayments = config.capturePayments || false;
    }

    private isValidConfig(config: DynamicCheckoutPaymentConfigType) {
      return !!config.projectId && !!config.invoiceId;
    }
  }
}
