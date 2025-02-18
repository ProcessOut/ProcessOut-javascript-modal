/// <reference path="../../references.ts" />

module ProcessOut {
  export class ApmPaymentMethod extends PaymentMethodButton {
    private redirectArrowUrl =
      "https://js.processout.com/images/dynamic-checkout-assets/apm-redirect-arrow.svg"

    private processOutInstance: ProcessOut
    private paymentConfig: DynamicCheckoutPublicConfig
    private paymentMethod: PaymentMethod
    private theme: DynamicCheckoutThemeType
    private resetContainerHtml: () => HTMLElement

    constructor(
      processOutInstance: ProcessOut,
      paymentMethod: PaymentMethod,
      paymentConfig: DynamicCheckoutPublicConfig,
      theme: DynamicCheckoutThemeType,
      resetContainerHtml: () => HTMLElement,
    ) {
      super(paymentMethod.display.name, paymentMethod.display.logo.dark_url.vector)

      this.processOutInstance = processOutInstance
      this.paymentConfig = paymentConfig
      this.paymentMethod = paymentMethod
      this.theme = theme
      super.appendChildren(this.getChildrenElement())

      this.resetContainerHtml = resetContainerHtml
    }

    private proceedToApmPayment() {
      const { apm, display } = this.paymentMethod
      const { clientSecret } = this.paymentConfig

      const actionHandlerOptions = new ActionHandlerOptions(
        apm.gateway_name,
        apm.gateway_logo.dark_url.raster,
      )

      const cardPaymentOptions = {
        authorize_only: !this.paymentConfig.capturePayments,
        allow_fallback_to_sale: this.paymentConfig.allowFallbackToSale,
        save_source: false,
      }

      const requestOptions = {
        clientSecret,
      }

      const saveForFutureCheckbox = document.getElementById(
        `save-apm-for-future-${display.name}`,
      ) as HTMLInputElement | null

      if (saveForFutureCheckbox) {
        cardPaymentOptions["save_source"] = saveForFutureCheckbox.checked
      }

      if (apm.saving_allowed && cardPaymentOptions["save_source"]) {
        return this.handleApmPaymentWithSaveForFuture(
          cardPaymentOptions,
          actionHandlerOptions,
          requestOptions,
        )
      }

      cardPaymentOptions["allow_fallback_to_sale"] = true
      this.handleApmPayment(cardPaymentOptions, actionHandlerOptions, requestOptions)
    }

    private handleApmPayment(
      cardPaymentOptions: any,
      actionHandlerOptions: ActionHandlerOptions,
      requestOptions: any,
    ) {
      const { apm } = this.paymentMethod

      this.processOutInstance.handleAction(
        apm.redirect_url,
        paymentToken => {
          this.processOutInstance.makeCardPayment(
            this.paymentConfig.invoiceId,
            paymentToken,
            cardPaymentOptions,
            invoiceId => {
              this.resetContainerHtml().appendChild(
                new DynamicCheckoutPaymentSuccessView(this.paymentConfig).element,
              )

              DynamicCheckoutEventsUtils.dispatchPaymentSuccessEvent(invoiceId)
            },
            error => {
              this.resetContainerHtml().appendChild(
                new DynamicCheckoutPaymentErrorView(this.paymentConfig).element,
              )

              DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent(error)
            },
            requestOptions,
          )
        },
        DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent,
        actionHandlerOptions,
      )
    }

    private handleApmPaymentWithSaveForFuture(
      cardPaymentOptions: any,
      actionHandlerOptions: ActionHandlerOptions,
      requestOptions: any,
    ) {
      const { apm } = this.paymentMethod

      const options = {
        ...cardPaymentOptions,
        source: apm.gateway_configuration_id,
      }

      this.processOutInstance.apiRequest(
        "POST",
        `invoices/${this.paymentConfig.invoiceId}/capture`,
        options,
        data => {
          this.processOutInstance.handleAction(
            data.customer_action.value,
            paymentToken => {
              this.processOutInstance.makeCardPayment(
                this.paymentConfig.invoiceId,
                paymentToken,
                options,
                invoiceId => {
                  this.resetContainerHtml().appendChild(
                    new DynamicCheckoutPaymentSuccessView(this.paymentConfig).element,
                  )

                  DynamicCheckoutEventsUtils.dispatchPaymentSuccessEvent(invoiceId)
                },
                error => {
                  this.resetContainerHtml().appendChild(
                    new DynamicCheckoutPaymentErrorView(this.paymentConfig).element,
                  )

                  DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent(error)
                },
                requestOptions,
              )
            },
            DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent,
            actionHandlerOptions,
          )
        },
        error => {
          this.resetContainerHtml().appendChild(
            new DynamicCheckoutPaymentErrorView(this.paymentConfig).element,
          )

          DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent(error)
        },
        0,
        requestOptions,
      )
    }

    private getChildrenElement() {
      const [
        childrenWrapper,
        messageWrapper,
        messageImg,
        messageText,
        saveForFutureWrapper,
        saveForFutureCheckbox,
        saveForFutureLabel,
        payButton,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-payment-method-button-children-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-button-message-wrapper"],
        },
        {
          tagName: "img",
          classNames: ["dco-payment-method-button-message-img"],
          attributes: {
            src: this.redirectArrowUrl,
          },
        },
        {
          tagName: "p",
          textContent: Translations.getText("apm-redirect-message", this.paymentConfig.locale),
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-button-save-for-future-wrapper"],
        },
        {
          tagName: "input",
          attributes: {
            type: "checkbox",
            name: "save-apm-for-future",
            id: `save-apm-for-future-${this.paymentMethod.display.name}`,
          },
        },
        {
          tagName: "label",
          classNames: ["dco-payment-method-button-save-for-future-label"],
          attributes: {
            for: `save-apm-for-future-${this.paymentMethod.display.name}`,
          },
          textContent: Translations.getText("save-for-future-label", this.paymentConfig.locale),
        },
        {
          tagName: "button",
          classNames: ["dco-payment-method-button-pay-button"],
          textContent: `${Translations.getText(
            "continue-with-apm-button",
            this.paymentConfig.locale,
          )} ${this.paymentMethod.display.name}`,
        },
      ])

      HTMLElements.appendChildren(saveForFutureWrapper, [saveForFutureCheckbox, saveForFutureLabel])
      HTMLElements.appendChildren(messageWrapper, [messageImg, messageText])

      const children = [
        messageWrapper,
        this.paymentMethod.apm.saving_allowed ? saveForFutureWrapper : null,
        payButton,
      ].filter(Boolean)

      HTMLElements.appendChildren(childrenWrapper, children)

      if (this.theme && this.theme.payButtonColor) {
        payButton.style.backgroundColor = this.theme.payButtonColor
      }

      if (this.theme && this.theme.payButtonTextColor) {
        payButton.style.color = this.theme.payButtonTextColor
      }

      payButton.addEventListener("click", () => {
        this.proceedToApmPayment()
      })

      return childrenWrapper
    }
  }
}
