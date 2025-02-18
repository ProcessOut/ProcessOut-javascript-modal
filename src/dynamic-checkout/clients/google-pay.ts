/// <reference path="../references.ts" />

module ProcessOut {
  export class GooglePayClient {
    googleClient: any
    processOutInstance: ProcessOut
    isReadyToPayRequest: {
      apiVersion: number
      apiVersionMinor: number
      allowedPaymentMethods: {
        type: string
        parameters: {
          allowedAuthMethods: string[]
          allowedCardNetworks: string[]
        }
        tokenizationSpecification: {
          type: string
          parameters: {
            gateway: string
            gatewayMerchantId: string
          }
        }
      }[]
    }

    paymentRequest: {
      apiVersion: number
      apiVersionMinor: number
      allowedPaymentMethods: {
        type: string
        parameters: {
          allowedAuthMethods: string[]
          allowedCardNetworks: string[]
        }
        tokenizationSpecification: {
          type: string
          parameters: {
            gateway: string
            gatewayMerchantId: string
          }
        }
      }[]
      transactionInfo: {
        totalPriceStatus: string
        totalPrice: string
        currencyCode: string
      }
      merchantInfo: {
        merchantName: string
      }
    }

    constructor(processOutInstance: ProcessOut) {
      this.processOutInstance = processOutInstance
    }

    public loadButton(
      buttonContainer: HTMLElement,
      invoiceData: Invoice,
      getViewContainer: () => HTMLElement,
    ) {
      const googleClientScript = document.createElement("script")

      googleClientScript.src = googlePaySdkUrl
      googleClientScript.onload = () => {
        this.googleClient =
          window.globalThis && window.globalThis.google
            ? new window.globalThis.google.payments.api.PaymentsClient({
                environment: DEBUG ? "TEST" : "PRODUCTION",
              })
            : null

        this.initizalizeGooglePay(buttonContainer, getViewContainer, invoiceData)
      }

      document.head.appendChild(googleClientScript)
    }

    private initizalizeGooglePay(
      buttonContainer: HTMLElement,
      getViewContainer: () => HTMLElement,
      invoiceData: Invoice,
    ) {
      this.prepareIsReadyToPayRequest(invoiceData)
      this.preparePaymentRequest(invoiceData)

      this.googleClient
        .isReadyToPay(this.isReadyToPayRequest)
        .then(response => {
          if (response.result) {
            const button = this.googleClient.createButton({
              buttonColor: "default",
              buttonType: "plain",
              buttonRadius: 4,
              buttonSizeMode: "fill",
              onClick: () => this.makePayment(invoiceData, getViewContainer),
            })

            buttonContainer.appendChild(button)
          }
        })
        .catch(DynamicCheckoutEventsUtils.dispatchGooglePayLoadError)
    }

    private makePayment(invoiceData: Invoice, getViewContainer: () => HTMLElement) {
      this.googleClient
        .loadPaymentData(this.paymentRequest)
        .then(paymentData => {
          const paymentToken = new PaymentToken(
            TokenType.GooglePay,
            JSON.parse(paymentData.paymentMethodData.tokenizationData.token),
          )

          const processOutInstance = this.processOutInstance

          processOutInstance.tokenize(
            paymentToken,
            {},
            function (token) {
              DynamicCheckoutEventsUtils.dispatchTokenizePaymentSuccessEvent(token)

              processOutInstance.makeCardPayment(
                invoiceData.id,
                token,
                {
                  authorize_only: !this.paymentConfig.capturePayments,
                  allow_fallback_to_sale: this.paymentConfig.allowFallbackToSale,
                },
                function (invoiceId) {
                  this.resetContainerHtml().appendChild(
                    new DynamicCheckoutPaymentSuccessView(this.paymentConfig).element,
                  )
                  DynamicCheckoutEventsUtils.dispatchPaymentSuccessEvent({
                    invoiceId,
                    returnUrl: this.paymentConfig.invoiceDetails.return_url,
                  })
                },
                function (error) {
                  this.resetContainerHtml().appendChild(
                    new DynamicCheckoutPaymentErrorView(this.paymentConfig).element,
                  )
                  DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent(error)
                },
              )
            },
            function (err) {
              this.resetContainerHtml().appendChild(
                new DynamicCheckoutPaymentErrorView(this.paymentConfig).element,
              )
              DynamicCheckoutEventsUtils.dispatchTokenizePaymentErrorEvent({
                message: `Tokenize payment error: ${JSON.stringify(err, undefined, 2)}`,
              })
            },
          )
        })
        .catch(DynamicCheckoutEventsUtils.dispatchGooglePayLoadError)
    }

    private prepareIsReadyToPayRequest(invoiceData: Invoice) {
      const googlePayMethod = this.getGooglePayMethodData(invoiceData)

      if (!googlePayMethod) {
        return
      }

      this.isReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: googlePayMethod.googlepay.allowed_auth_methods,
              allowedCardNetworks: googlePayMethod.googlepay.allowed_card_networks,
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: googlePayMethod.googlepay.gateway,
                gatewayMerchantId: googlePayMethod.googlepay.gateway_merchant_id,
              },
            },
          },
        ],
      }
    }

    private preparePaymentRequest(invoiceData: Invoice) {
      const googlePayMethod = this.getGooglePayMethodData(invoiceData)

      if (!googlePayMethod) {
        return
      }

      this.paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: googlePayMethod.googlepay.allowed_auth_methods,
              allowedCardNetworks: googlePayMethod.googlepay.allowed_card_networks,
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: googlePayMethod.googlepay.gateway,
                gatewayMerchantId: googlePayMethod.googlepay.gateway_merchant_id,
              },
            },
          },
        ],
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: invoiceData.amount,
          currencyCode: invoiceData.currency,
        },
        merchantInfo: {
          merchantName: invoiceData.name,
        },
      }
    }

    private getGooglePayMethodData(invoiceData: Invoice) {
      let googlePayMethod

      invoiceData.payment_methods.forEach(paymentMethod => {
        if (paymentMethod.type === "googlepay") {
          googlePayMethod = paymentMethod
        }
      })

      return googlePayMethod
    }
  }
}
