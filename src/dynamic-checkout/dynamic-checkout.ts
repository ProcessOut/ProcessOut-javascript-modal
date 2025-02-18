/// <reference path="./references.ts" />

module ProcessOut {
  export class DynamicCheckout {
    processOutInstance: ProcessOut
    paymentConfig: DynamicCheckoutPaymentConfig
    theme: DynamicCheckoutTheme
    dcoContainer: Element
    widgetWrapper: Element
    invoiceDetails: Invoice

    constructor(
      processOutInstance: ProcessOut,
      config: DynamicCheckoutPublicConfig,
      theme?: DynamicCheckoutThemeType,
    ) {
      this.processOutInstance = processOutInstance
      this.paymentConfig = new DynamicCheckoutPaymentConfig(config)

      if (theme) {
        this.theme = new DynamicCheckoutTheme(theme)
      }

      this.applyDefaultStyles()
    }

    public mount(element: string | HTMLElement) {
      this.dcoContainer = element instanceof HTMLElement ? element : document.querySelector(element)

      if (!this.dcoContainer) {
        throw new Error(
          "Element with this selector does not exist. You must provide a valid element selector",
        )
      }

      return this.getInvoiceDetails(
        this.onGetInvoiceLoading.bind(this),
        this.onGetInvoiceSuccess.bind(this),
        this.onGetInvoiceError.bind(this),
      )
    }

    public loadDynamicCheckoutView() {
      const paymentMethodsView = new DynamicCheckoutPaymentMethodsView(
        this,
        this.processOutInstance,
        this.paymentConfig,
        this.theme,
      )

      this.loadView(paymentMethodsView.element)

      DynamicCheckoutEventsUtils.dispatchWidgetReadyEvent()
    }

    private getInvoiceDetails(onFetch: Function, onSuccess: Function, onError: Function) {
      onFetch()

      this.processOutInstance.apiRequest(
        "GET",
        `invoices/${this.paymentConfig.invoiceId}?expand=transaction`,
        {},
        onSuccess.bind(this),
        onError.bind(this),
        0,
        {
          isLegacy: false,
          clientSecret: this.paymentConfig.clientSecret,
        },
      )
    }

    private onGetInvoiceLoading() {
      this.loadView(new DynamicCheckoutInvoiceLoadingView().element)

      DynamicCheckoutEventsUtils.dispatchWidgetLoadingEvent()
    }

    private onGetInvoiceSuccess(data: any) {
      if (!data.success) {
        this.loadView(new DynamicCheckoutPaymentErrorView(this.paymentConfig).element)

        return DynamicCheckoutEventsUtils.dispatchInvoiceFetchingErrorEvent(data)
      }

      if (!data.invoice.payment_methods) {
        this.loadView(
          new DynamicCheckoutPaymentErrorView(
            this.paymentConfig,
            Translations.getText("payment-error-generic-message", this.paymentConfig.locale),
          ).element,
        )

        return DynamicCheckoutEventsUtils.dispatchNoDynamicCheckoutConfigurationEvent({
          invoiceId: data.invoice.id,
        })
      }

      if (data.invoice.transaction.status !== "waiting") {
        this.loadView(
          new DynamicCheckoutPaymentErrorView(
            this.paymentConfig,
            Translations.getText("payment-error-generic-message", this.paymentConfig.locale),
          ).element,
        )

        return DynamicCheckoutEventsUtils.dispatchTransactionErrorEvent({
          invoiceId: data.invoice.id,
          returnUrl: data.invoice.return_url,
        })
      }

      this.paymentConfig.setInvoiceDetails(data.invoice)

      this.loadDynamicCheckoutView()
    }

    private onGetInvoiceError(req: XMLHttpRequest, e: ProgressEvent, errorCode: ApiRequestError) {
      let errorData = req.response

      if (!errorData && errorCode)
        errorData = {
          success: false,
          error_type: errorCode,
          message: Translator.translateError(errorCode),
        }

      DynamicCheckoutEventsUtils.dispatchInvoiceFetchingErrorEvent(errorData)

      this.loadView(new DynamicCheckoutPaymentErrorView(this.paymentConfig).element)
    }

    private loadView(view: Element) {
      if (this.widgetWrapper) {
        this.dcoContainer.removeChild(this.widgetWrapper)
      }

      this.widgetWrapper = document.createElement("div")
      this.widgetWrapper.setAttribute("class", "dynamic-checkout-widget-wrapper")

      this.widgetWrapper.appendChild(view)
      this.dcoContainer.appendChild(this.widgetWrapper)
    }

    private applyDefaultStyles() {
      const styleElement = document.createElement("style")

      styleElement.innerHTML = defaultStyles

      document.head.appendChild(styleElement)
    }
  }
}
