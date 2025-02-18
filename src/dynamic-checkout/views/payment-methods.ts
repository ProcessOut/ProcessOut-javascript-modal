/// <reference path="../references.ts" />

module ProcessOut {
  export class DynamicCheckoutPaymentMethodsView {
    processOutInstance: ProcessOut
    dynamicCheckout: DynamicCheckout
    paymentConfig: DynamicCheckoutPaymentConfig
    theme: DynamicCheckoutThemeType
    element: HTMLElement

    constructor(
      dynamicCheckout: DynamicCheckout,
      processOutInstance: ProcessOut,
      paymentConfig: DynamicCheckoutPaymentConfig,
      theme: DynamicCheckoutThemeType,
    ) {
      this.dynamicCheckout = dynamicCheckout
      this.processOutInstance = processOutInstance
      this.paymentConfig = paymentConfig
      this.theme = theme
      this.element = this.createViewElement()
    }

    private createViewElement() {
      const {
        wrapper,
        walletCheckoutWrapper,
        walletPaymentMethods,
        expressPaymentMethods,
        expressCheckoutWrapper,
        expressPaymentMethodsWrapper,
        regularPaymentMethodsSectionWrapper,
        regularPaymentMethods,
        regularPaymentMethodsList,
      } = this.getUiElements()

      if (walletPaymentMethods.length > 0) {
        walletPaymentMethods.forEach(paymentMethod => {
          walletCheckoutWrapper.appendChild(paymentMethod.element)
        })

        expressCheckoutWrapper.appendChild(walletCheckoutWrapper)
      }

      if (expressPaymentMethods.length > 0) {
        expressPaymentMethods.forEach(paymentMethod => {
          expressPaymentMethodsWrapper.appendChild(paymentMethod.element)
        })

        expressCheckoutWrapper.appendChild(expressPaymentMethodsWrapper)
      }

      if (regularPaymentMethods.length > 0) {
        regularPaymentMethods.forEach(paymentMethod => {
          regularPaymentMethodsList.appendChild(paymentMethod.element)
        })

        regularPaymentMethodsSectionWrapper.appendChild(regularPaymentMethodsList)
      }

      if (expressPaymentMethods.length > 0 || walletPaymentMethods.length > 0) {
        wrapper.appendChild(expressCheckoutWrapper)
      }

      if (regularPaymentMethods.length > 0) {
        wrapper.appendChild(regularPaymentMethodsSectionWrapper)
      }

      return wrapper
    }

    private getUiElements() {
      const wrapper = HTMLElements.createElement({
        tagName: "div",
        classNames: ["dco-payment-methods-wrapper"],
      })

      const { walletPaymentMethods, expressPaymentMethods, regularPaymentMethods } =
        this.getPaymentMethodsElements()

      const { expressCheckoutWrapper, walletCheckoutWrapper, expressPaymentMethodsWrapper } =
        this.getExpressCheckoutElements()

      const { regularPaymentMethodsSectionWrapper, regularPaymentMethodsList } =
        this.getRegularPaymentMethodsElements([...expressPaymentMethods, ...walletPaymentMethods])

      return {
        wrapper,
        walletPaymentMethods,
        expressPaymentMethods,
        expressCheckoutWrapper,
        walletCheckoutWrapper,
        expressPaymentMethodsWrapper,
        regularPaymentMethodsSectionWrapper,
        regularPaymentMethods,
        regularPaymentMethodsList,
      }
    }

    private getExpressCheckoutElements() {
      const [
        expressCheckoutWrapper,
        expressCheckoutHeader,
        walletCheckoutWrapper,
        expressPaymentMethodsWrapper,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-express-checkout-wrapper"],
        },
        {
          tagName: "span",
          classNames: ["dco-express-checkout-header"],
          textContent: Translations.getText("express-checkout-header", this.paymentConfig.locale),
        },
        {
          tagName: "div",
          classNames: ["dco-wallet-checkout-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-express-checkout-payment-methods-wrapper"],
        },
      ])

      expressCheckoutWrapper.appendChild(expressCheckoutHeader)

      return {
        expressCheckoutWrapper,
        walletCheckoutWrapper,
        expressPaymentMethodsWrapper,
      }
    }

    private getRegularPaymentMethodsElements(expressPaymentMethods: PaymentMethod[]) {
      const [
        regularPaymentMethodsSectionWrapper,
        regularPaymentMethodsSectionHeader,
        regularPaymentMethodsList,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-regular-payment-methods-section-wrapper"],
        },
        {
          tagName: "span",
          classNames: ["dco-regular-payment-methods-section-header"],
          textContent: Translations.getText(
            expressPaymentMethods.length > 0
              ? "other-payment-methods-header"
              : "select-payment-method-label",
            this.paymentConfig.locale,
          ),
        },
        {
          tagName: "div",
          classNames: ["dco-regular-payment-methods-list-wrapper"],
        },
      ])

      regularPaymentMethodsSectionWrapper.appendChild(regularPaymentMethodsSectionHeader)

      return { regularPaymentMethodsSectionWrapper, regularPaymentMethodsList }
    }

    private getPaymentMethodsElements() {
      let walletPaymentMethods = []
      let expressPaymentMethods = []
      let regularPaymentMethods = []

      this.paymentConfig.invoiceDetails.payment_methods.forEach(paymentMethod => {
        switch (paymentMethod.type) {
          case "googlepay":
            const googlePayPaymentMethod = new GooglePayPaymentMethod(
              this.processOutInstance,
              this.paymentConfig.invoiceDetails,
              this.resetContainerHtml.bind(this),
            )

            return walletPaymentMethods.push(googlePayPaymentMethod)

          case "applepay":
            const applePayPaymentMethod = new ApplePayPaymentMethod(
              this.processOutInstance,
              this.paymentConfig,
              this.paymentConfig.invoiceDetails,
              this.resetContainerHtml.bind(this),
            )

            return walletPaymentMethods.push(applePayPaymentMethod)

          case "apm_customer_token":
            const savedApmPaymentMethod = new SavedApmPaymentMethod(
              this.processOutInstance,
              paymentMethod,
              this.paymentConfig,
              this.theme,
              this.resetContainerHtml.bind(this),
            )

            return expressPaymentMethods.push(savedApmPaymentMethod)

          case "card_customer_token":
            const savedCardPaymentMethod = new SavedCardPaymentMethod(
              this.processOutInstance,
              paymentMethod,
              this.paymentConfig,
              this.theme,
              this.resetContainerHtml.bind(this),
            )

            return expressPaymentMethods.push(savedCardPaymentMethod)

          case "apm":
            const apmPaymentMethod = paymentMethod.apm.redirect_url
              ? new ApmPaymentMethod(
                  this.processOutInstance,
                  paymentMethod,
                  this.paymentConfig,
                  this.theme,
                  this.resetContainerHtml.bind(this),
                )
              : new NativeApmPaymentMethod(
                  this.processOutInstance,
                  paymentMethod,
                  this.paymentConfig,
                  this.theme,
                  this.resetContainerHtml.bind(this),
                )

            return regularPaymentMethods.push(apmPaymentMethod)

          case "card":
            const cardPaymentMethod = new CardPaymentMethod(
              this.processOutInstance,
              paymentMethod,
              this.paymentConfig,
              this.theme,
              this.resetContainerHtml.bind(this),
            )

            return regularPaymentMethods.push(cardPaymentMethod)

          default:
            break
        }
      })

      return {
        walletPaymentMethods,
        expressPaymentMethods,
        regularPaymentMethods,
      }
    }

    private resetContainerHtml() {
      this.element.innerHTML = ""
      return this.element
    }
  }
}
