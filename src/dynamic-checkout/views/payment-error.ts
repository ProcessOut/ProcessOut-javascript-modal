/// <reference path="../references.ts" />

module ProcessOut {
  export class DynamicCheckoutPaymentErrorView {
    public element: Element

    constructor(paymentConfig: DynamicCheckoutPublicConfig, errorMessage?: string) {
      const [element, image, message] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-card-payment-success"],
        },
        {
          tagName: "img",
          classNames: ["dco-card-payment-success-image"],
          attributes: {
            src: PAYMENT_ERROR_IMAGE_ASSET,
          },
        },
        {
          tagName: "div",
          classNames: ["dco-card-payment-error-text"],
          textContent:
            errorMessage || Translations.getText("payment-error-message", paymentConfig.locale),
        },
      ])

      HTMLElements.appendChildren(element, [image, message])

      this.element = element
    }
  }
}
