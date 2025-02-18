/// <reference path="./references.ts" />

type GatewayConfiguration = {
  success: boolean
  native_apm: {
    gateway: {
      customer_action_image_url: string
      customer_action_message: string
      display_name: string
      logo_url: string
    }
    invoice: {
      amount: string
      currency_code: string
    }
    parameters: Array<NativeApmInputData>
    parameter_values?: Record<string, string>
  }
}

type PrefilledData = Record<string, string>

type NativeApmPaymentResponse = {
  success: boolean
  native_apm: {
    parameterDefinitions: Array<NativeApmInputData>
    parameterValues?: Record<string, string>
    state: string
  }
  error_type?: string
  invalid_fields?: Array<Record<string, string>>
  message?: string
}

type NativeApmCapturePaymentResponse = {
  native_apm?: {
    state: string
  }
  success: boolean
  message?: string
}

/**
 * ProcessOut module/namespace
 */
module ProcessOut {
  /**
   * ProcessOut Native APM class
   */
  export class NativeApm {
    /**
     * ProcessOut instance
     * @type {ProcessOut}
     */
    processOutInstance: ProcessOut

    /**
     * Instance of JS library which handles markdown
     * @type {any}
     */
    markdownLibraryInstance: any

    /**
     * Native APM container element for mounting the widget
     * @type {Element}
     */
    napmContainer: Element

    /**
     * Native APM widget wrapper element for styling purposes
     * @type {Element}
     */
    widgetWrapper: Element

    /**
     * Configuration of Native APM payment
     * @type {NativeApmPaymentConfig}
     */
    paymentConfig: NativeApmPaymentConfig

    /**
     * Configuration of Native APM gateway
     * @type {GatewayConfiguration}
     */
    gatewayConfiguration: GatewayConfiguration

    /**
     * Theme of the Native APM widget
     * @type {NativeApmThemeConfig}
     */
    theme: NativeApmThemeConfig

    /**
     * Prefilled data of the user
     * @type {PrefilledData}
     */
    prefilledData: PrefilledData = {}

    /**
     * Date of first capture
     * @type {number}
     */
    captureStart = null

    /**
     * NativeAPM constructor
     * @param  {NativeApmConfig} config
     */
    constructor(processOutInstance: ProcessOut, paymentConfig: NativeApmPaymentConfigType) {
      this.processOutInstance = processOutInstance
      this.paymentConfig = new NativeApmPaymentConfig(paymentConfig)
      this.theme = new NativeApmThemeConfig()
      this.loadMarkdownLibrary()
      this.loadQrCodesLibrary()
    }

    /**
     * This function mounts the Native APM widget on the page
     * @param  {string} containerSelector
     */
    public mount(containerSelector: string | HTMLElement) {
      if (typeof containerSelector === "string") {
        this.napmContainer = document.querySelector(containerSelector)
      } else {
        this.napmContainer = containerSelector
      }

      if (!this.napmContainer) {
        throw new Exception(
          "default",
          "Element with this selector does not exist. You must provide valid element selector",
        )
      }

      this.loadView(new NativeApmSpinner(this.theme).getSpinnerElement())

      this.getGatewayConfiguration({
        onFetch: EventsUtils.dispatchWidgetLoadingEvent,
        onSuccess: this.onGatewayConfigurationSuccess.bind(this),
        onError: this.onGatewayConfigurationError.bind(this),
      })
    }

    /**
     * This function gets gateway configuration of the Native APM widget
     */
    private getGatewayConfiguration(actions: {
      onFetch: Function
      onSuccess: Function
      onError: Function
    }) {
      const paymentConfig = this.paymentConfig.getConfig()

      actions.onFetch()

      this.processOutInstance.apiRequest(
        "GET",
        `invoices/${paymentConfig.invoiceId}/native-payment/${paymentConfig.gatewayConfigurationId}`,
        {},
        actions.onSuccess.bind(this),
        actions.onError.bind(this),
      )
    }

    private onGatewayConfigurationSuccess(data: GatewayConfiguration) {
      if (!data.success) {
        const errorView = new NativeApmErrorView({}, this.theme)

        EventsUtils.dispatchGatewayConfigurationErrorEvent(data)

        return this.loadView(errorView.getViewElement())
      }

      this.gatewayConfiguration = data

      if (
        this.gatewayConfiguration.native_apm &&
        this.gatewayConfiguration.native_apm.parameters.length
      ) {
        const nativeApmFormView = new NativeApmFormView(
          this.gatewayConfiguration.native_apm,
          this.proceedPayment.bind(this),
          this.theme,
          this.prefilledData,
        )

        EventsUtils.dispatchWidgetReadyEvent()

        return this.loadView(nativeApmFormView.getViewElement())
      }

      if (
        this.gatewayConfiguration.native_apm &&
        this.gatewayConfiguration.native_apm.parameters.length === 0
      ) {
        const pendingView = new NativeApmPendingView(
          this.gatewayConfiguration,
          this.markdownLibraryInstance,
          this.theme,
          this.capturePayment.bind(this),
          this.gatewayConfiguration.native_apm.parameter_values,
        )

        EventsUtils.dispatchPaymentInitEvent()

        return this.loadView(pendingView.getViewElement())
      }
    }

    private onGatewayConfigurationError(
      req: XMLHttpRequest,
      e: ProgressEvent,
      errorCode: ApiRequestError,
    ) {
      const errorView = new NativeApmErrorView({}, this.theme)

      let errorData = req.response
      if (!req.response && errorCode)
        errorData = {
          success: false,
          error_type: errorCode,
          message: Translator.translateError(errorCode),
        }

      EventsUtils.dispatchGatewayConfigurationErrorEvent(errorData)

      return this.loadView(errorView.getViewElement())
    }

    /**
     * This function proceeds Native APM payment
     */
    public proceedPayment(
      paymentData: Record<string, string>,
      onFormSubmitFinished: Function,
      onFormApiValidationError: Function,
    ) {
      const paymentConfig = this.paymentConfig.getConfig()

      const handlePaymentSuccessCallback = (data: NativeApmPaymentResponse) =>
        this.handlePaymentSuccess(data, onFormSubmitFinished, onFormApiValidationError)

      this.processOutInstance.apiRequest(
        "POST",
        `invoices/${paymentConfig.invoiceId}/native-payment`,
        {
          gateway_configuration_id: paymentConfig.gatewayConfigurationId,
          native_apm: {
            parameter_values: paymentData,
          },
        },
        handlePaymentSuccessCallback,
        this.handlePaymentError.bind(this),
      )
    }

    /**
     * This function handles success response of payment
     */
    private handlePaymentSuccess(
      data: NativeApmPaymentResponse,
      onFormSubmitFinished: Function,
      onFormApiValidationError: Function,
    ) {
      onFormSubmitFinished()

      if (ErrorsUtils.isFieldsValidationError(data)) {
        return onFormApiValidationError(data.invalid_fields)
      }

      if (ErrorsUtils.isValidationError(data)) {
        const errorView = new NativeApmErrorView(this.gatewayConfiguration.native_apm, this.theme)

        EventsUtils.dispatchPaymentErrorEvent(data)

        return this.loadView(errorView.getViewElement())
      }

      if (!data.success) {
        const errorView = new NativeApmErrorView(this.gatewayConfiguration.native_apm, this.theme)

        EventsUtils.dispatchPaymentErrorEvent(data)

        return this.loadView(errorView.getViewElement())
      }

      if (data.native_apm && data.native_apm.state === "CUSTOMER_INPUT") {
        const customerInputView = new NativeApmFormView(
          {
            gateway: this.gatewayConfiguration.native_apm.gateway,
            parameters: data.native_apm.parameterDefinitions,
            invoice: this.gatewayConfiguration.native_apm.invoice,
          },
          this.proceedPayment.bind(this),
          this.theme,
          this.prefilledData,
        )

        EventsUtils.dispatchPaymentAdditionalInputEvent()

        return this.loadView(customerInputView.getViewElement())
      }

      if (data.native_apm && data.native_apm.state === "PENDING_CAPTURE") {
        this.updatePaymentProviderLogo(data.native_apm.parameterValues["provider_logo_url"])

        const pendingView = new NativeApmPendingView(
          this.gatewayConfiguration,
          this.markdownLibraryInstance,
          this.theme,
          this.capturePayment.bind(this),
          data.native_apm.parameterValues,
        )

        EventsUtils.dispatchPaymentInitEvent()

        return this.loadView(pendingView.getViewElement())
      }
    }

    /**
     * This function handles error response of payment
     */
    private handlePaymentError(req: XMLHttpRequest, e: ProgressEvent, errorCode: ApiRequestError) {
      const errorView = new NativeApmErrorView(this.gatewayConfiguration.native_apm, this.theme)

      let errorData = req.response
      if (!req.response && errorCode)
        errorData = {
          success: false,
          error_type: errorCode,
          message: Translator.translateError(errorCode),
        }

      EventsUtils.dispatchPaymentErrorEvent(errorData)

      this.loadView(errorView.getViewElement())
    }

    /**
     * This function captures Native APM payment
     */
    public capturePayment() {
      const paymentConfig = this.paymentConfig.getConfig()
      if (!this.captureStart) {
        this.captureStart = new Date()
      }

      this.processOutInstance.apiRequest(
        "POST",
        `invoices/${paymentConfig.invoiceId}/capture`,
        {
          source: paymentConfig.gatewayConfigurationId,
        },
        this.handleCaptureSuccess.bind(this),
        this.handleCaptureError.bind(this),
      )
    }

    private checkIfCaptureTimeout() {
      const now = new Date()

      const differenceInSeconds = (now.getTime() - this.captureStart.getTime()) / 1000

      return differenceInSeconds >= this.paymentConfig.pollingMaxTimeout
    }

    /**
     * This function handles Native APM capture success
     */
    private handleCaptureSuccess(data: NativeApmCapturePaymentResponse) {
      if (
        data.success &&
        data.native_apm &&
        data.native_apm.state === "PENDING_CAPTURE" &&
        !this.checkIfCaptureTimeout()
      ) {
        return this.capturePayment()
      }

      if (
        data.success &&
        data.native_apm &&
        data.native_apm.state === "PENDING_CAPTURE" &&
        this.checkIfCaptureTimeout()
      ) {
        this.captureStart = null

        return EventsUtils.dispatchPaymentErrorEvent(data)
      }

      if (!data.success) {
        this.captureStart = null
        const errorView = new NativeApmErrorView(this.gatewayConfiguration.native_apm, this.theme)

        EventsUtils.dispatchPaymentErrorEvent(data)

        return this.loadView(errorView.getViewElement())
      }

      this.captureStart = null
      const successView = new NativeApmSuccessView(
        this.gatewayConfiguration,
        this.markdownLibraryInstance,
        this.theme,
      )

      EventsUtils.dispatchPaymentSuccessEvent({
        returnUrl: this.paymentConfig.returnUrl,
      })

      return this.loadView(successView.getViewElement())
    }

    /**
     * This function handles Native APM capture error
     */
    private handleCaptureError(req: XMLHttpRequest, e: ProgressEvent, errorCode: ApiRequestError) {
      const errorView = new NativeApmErrorView(this.gatewayConfiguration.native_apm, this.theme)

      let errorData = req.response
      if (!req.response && errorCode)
        errorData = {
          success: false,
          error_type: errorCode,
          message: Translator.translateError(errorCode),
        }

      EventsUtils.dispatchPaymentErrorEvent(errorData)

      this.loadView(errorView.getViewElement())
    }

    /**
     * This function sets theme of the Native APM widget
     * @param {NativeApmThemeConfigType} themeConfig
     */
    public setTheme(themeConfig: NativeApmThemeConfigType) {
      return this.theme.setTheme(themeConfig)
    }

    /**
     * This function prefills user data
     * @param {PrefilledData} data
     */
    public prefillData(data: PrefilledData) {
      this.prefilledData = data
    }

    /**
     * This function loads view of the widget
     */
    private loadView(view: HTMLElement) {
      if (this.widgetWrapper) {
        this.napmContainer.removeChild(this.widgetWrapper)
      }

      this.widgetWrapper = this.createWidgetWrapper()
      this.widgetWrapper.appendChild(view)

      this.napmContainer.appendChild(this.widgetWrapper)
    }

    /**
     * This function updates payment provider logo
     */
    private updatePaymentProviderLogo(logoUrl?: string) {
      if (logoUrl) {
        this.gatewayConfiguration = {
          ...this.gatewayConfiguration,
          native_apm: {
            ...this.gatewayConfiguration.native_apm,
            gateway: {
              ...this.gatewayConfiguration.native_apm.gateway,
              logo_url: logoUrl,
            },
          },
        }
      }
    }

    /**
     * This function creates widget wrapper for styling purposes
     */
    private createWidgetWrapper() {
      const widgetWrapper = document.createElement("div")
      const styleElement = this.theme.createInitialStyleTag()

      widgetWrapper.setAttribute("class", "native-apm-widget-wrapper")

      widgetWrapper.appendChild(styleElement)

      StylesUtils.styleElement(widgetWrapper, this.theme.wrapper)

      return widgetWrapper
    }

    /**
     * This function loads markdown JS library to handle custommer action messages
     */
    private loadMarkdownLibrary() {
      const markdownScript = document.createElement("script")
      markdownScript.src = "https://js.processout.com/js/libraries/showdown.min.js"
      markdownScript.onload = () => {
        this.markdownLibraryInstance =
          window.globalThis && window.globalThis.showdown
            ? new window.globalThis.showdown.Converter()
            : null
      }
      document.head.appendChild(markdownScript)
    }

    private loadQrCodesLibrary() {
      const qrCodeScript = document.createElement("script")
      qrCodeScript.src = "https://js.processout.com/js/libraries/qrcode.min.js"
      document.head.appendChild(qrCodeScript)
    }
  }
}
