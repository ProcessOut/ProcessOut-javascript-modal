/// <reference path="../references.ts" />

module ProcessOut {
  export class SavedCardPaymentMethod extends PaymentMethodButton {
    private processOutInstance: ProcessOut
    private paymentConfig: DynamicCheckoutPaymentConfig
    private paymentMethod: PaymentMethod
    private theme: DynamicCheckoutThemeType
    private resetContainerHtml: () => HTMLElement

    constructor(
      processOutInstance: ProcessOut,
      paymentMethod: PaymentMethod,
      paymentConfig: DynamicCheckoutPaymentConfig,
      theme: DynamicCheckoutThemeType,
      resetContainerHtml: () => HTMLElement,
    ) {
      const rightContentElement = HTMLElements.createElement({
        tagName: "div",
        classNames: ["dco-payment-method-right-content"],
      })

      rightContentElement.textContent = paymentMethod.display.description

      super(
        paymentMethod.display.name,
        paymentMethod.display.logo.dark_url.vector,
        rightContentElement,
      )

      this.processOutInstance = processOutInstance
      this.paymentConfig = paymentConfig
      this.paymentMethod = paymentMethod
      this.theme = theme
      this.resetContainerHtml = resetContainerHtml

      super.appendChildren(this.getChildrenElement())
    }

    private getChildrenElement() {
      const [wrapper, payButton] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-saved-card-payment-method-wrapper"],
        },
        {
          tagName: "button",
          classNames: ["dco-payment-method-button-pay-button"],
          attributes: {
            id: `dco-saved-card-pay-button-${this.paymentMethod.display.description}`,
          },
          textContent: `${Translations.getText(
            "pay-button-text",
            this.paymentConfig.locale,
          )} ${this.paymentConfig.invoiceDetails.amount} ${
            this.paymentConfig.invoiceDetails.currency
          }`,
        },
      ])

      if (this.theme && this.theme.payButtonColor) {
        payButton.style.backgroundColor = this.theme.payButtonColor
      }

      if (this.theme && this.theme.payButtonTextColor) {
        payButton.style.color = this.theme.payButtonTextColor
      }

      HTMLElements.appendChildren(wrapper, [payButton])

      payButton.addEventListener("click", this.handlePayment.bind(this))

      return wrapper
    }

    private handlePayment() {
      this.setButtonLoading()

      this.processOutInstance.makeCardPayment(
        this.paymentConfig.invoiceId,
        this.paymentMethod.card_customer_token.customer_token_id,
        {
          authorize_only: !this.paymentConfig.capturePayments,
          allow_fallback_to_sale: this.paymentConfig.allowFallbackToSale,
        },
        this.handlePaymentSuccess.bind(this),
        this.handlePaymentError.bind(this),
      )
    }

    private handlePaymentSuccess(invoiceId: string) {
      this.resetContainerHtml().appendChild(
        new DynamicCheckoutPaymentSuccessView(this.paymentConfig).element,
      )
      DynamicCheckoutEventsUtils.dispatchPaymentSuccessEvent({
        invoiceId,
        returnUrl: this.paymentConfig.invoiceDetails.return_url,
      })
    }

    private handlePaymentError(error) {
      this.resetContainerHtml().appendChild(
        new DynamicCheckoutPaymentErrorView(this.paymentConfig).element,
      )
      DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent(error)
    }

    private setButtonLoading() {
      const payButton = document.getElementById(
        `dco-saved-card-pay-button-${this.paymentMethod.display.description}`,
      ) as HTMLButtonElement

      payButton.disabled = true
      payButton.textContent = ""

      const spinner = HTMLElements.createElement({
        tagName: "span",
        classNames: ["dco-payment-method-button-pay-button-spinner"],
      })

      HTMLElements.appendChildren(payButton, [spinner])
    }
  }
}
