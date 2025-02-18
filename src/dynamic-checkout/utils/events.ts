/// <reference path="../references.ts" />

module ProcessOut {
  const DYNAMIC_CHECKOUT_EVENTS = {
    WIDGET_LOADING: "processout_dynamic_checkout_loading",
    WIDGET_READY: "processout_dynamic_checkout_ready",
    INVOICE_FETCHING_ERROR:
      "processout_dynamic_checkout_invoice_fetching_error",
    TOKENIZE_PAYMENT_SUCCESS:
      "processout_dynamic_checkout_tokenize_payment_success",
    TOKENIZE_PAYMENT_ERROR:
      "processout_dynamic_checkout_tokenize_payment_error",
    NO_DYNAMIC_CHECKOUT_CONFIGURATION:
      "processout_dynamic_checkout_no_dynamic_checkout_configuration",
    PAYMENT_ERROR: "processout_dynamic_checkout_payment_error",
    PAYMENT_SUCCESS: "processout_dynamic_checkout_payment_success",
    TRANSACTION_ERROR: "processout_dynamic_checkout_transaction_error",
    GOOGLE_PAY_LOAD_ERROR: "processout_dynamic_checkout_google_pay_load_error",
    APPLE_PAY_NEW_SESSION: "processout_dynamic_checkout_apple_pay_new_session",
    APPLE_PAY_SESSION_ERROR:
      "processout_dynamic_checkout_apple_pay_session_error",
    APPLE_PAY_AUTHORIZED_POST_PROCESS:
      "processout_dynamic_checkout_apple_pay_authorized_post_process",
    DELETE_PAYMENT_METHOD: "processout_dynamic_checkout_delete_payment_method",
    DELETE_PAYMENT_METHOD_ERROR:
      "processout_dynamic_checkout_delete_payment_method_error",
  };

  export class DynamicCheckoutEventsUtils {
    static dispatchInvoiceFetchingErrorEvent(errorData: any) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.INVOICE_FETCHING_ERROR,
        errorData
      );

      return window.dispatchEvent(event);
    }

    static dispatchWidgetLoadingEvent() {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.WIDGET_LOADING
      );
      return window.dispatchEvent(event);
    }

    static dispatchWidgetReadyEvent() {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.WIDGET_READY
      );
      return window.dispatchEvent(event);
    }

    static dispatchTokenizePaymentSuccessEvent(token: string) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.TOKENIZE_PAYMENT_SUCCESS,
        {
          token,
        }
      );
      return window.dispatchEvent(event);
    }

    static dispatchTokenizePaymentErrorEvent(errorData: any) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.TOKENIZE_PAYMENT_ERROR,
        errorData
      );
      return window.dispatchEvent(event);
    }

    static dispatchNoDynamicCheckoutConfigurationEvent(errorData: any) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.NO_DYNAMIC_CHECKOUT_CONFIGURATION,
        errorData
      );
      return window.dispatchEvent(event);
    }

    static dispatchPaymentErrorEvent(errorData: any) {
      // TODO: Temporary fix until we fix properly the field unavailable error
      if (errorData.code === "processout-js.field.unavailable") {
        return;
      }

      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.PAYMENT_ERROR,
        errorData
      );
      return window.dispatchEvent(event);
    }

    static dispatchPaymentSuccessEvent(response: {
      invoiceId: string;
      returnUrl: string;
    }) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.PAYMENT_SUCCESS,
        response
      );

      return window.dispatchEvent(event);
    }

    static dispatchApplePayNewSessionEvent() {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.APPLE_PAY_NEW_SESSION
      );

      return window.dispatchEvent(event);
    }

    static dispatchApplePayAuthorizedPostProcessEvent() {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.APPLE_PAY_AUTHORIZED_POST_PROCESS
      );

      return window.dispatchEvent(event);
    }

    static dispatchApplePaySessionError(err: any) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.APPLE_PAY_SESSION_ERROR
      );

      return window.dispatchEvent(event);
    }

    static dispatchDeletePaymentMethodEvent() {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.DELETE_PAYMENT_METHOD
      );

      return window.dispatchEvent(event);
    }

    static dispatchDeletePaymentMethodErrorEvent(err: any) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.DELETE_PAYMENT_METHOD_ERROR,
        err
      );

      return window.dispatchEvent(event);
    }

    static dispatchTransactionErrorEvent(errorData: {
      invoiceId: string;
      returnUrl: string;
    }) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.TRANSACTION_ERROR,
        errorData
      );

      return window.dispatchEvent(event);
    }

    static dispatchGooglePayLoadError(errorData: {
      invoiceId: string;
      returnUrl: string;
    }) {
      const event = EventsUtils.createEvent(
        DYNAMIC_CHECKOUT_EVENTS.GOOGLE_PAY_LOAD_ERROR,
        errorData
      );

      return window.dispatchEvent(event);
    }

    // IE 11 polyfill
    static createEvent(eventName: string, data?: any) {
      if (typeof window.CustomEvent === "function") {
        return new CustomEvent(eventName, {
          bubbles: true,
          detail: data,
        });
      } else {
        const event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, true, false, data);
        return event;
      }
    }
  }
}
