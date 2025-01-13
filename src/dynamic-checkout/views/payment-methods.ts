/// <reference path="../references.ts" />

module ProcessOut {
  export class DynamicCheckoutPaymentMethodsView {
    processOutInstance: ProcessOut;
    dynamicCheckout: DynamicCheckout;
    paymentConfig: DynamicCheckoutPaymentConfigType;
    paymentMethodsManager: PaymentMethodsManager;
    theme: DynamicCheckoutThemeType;
    element: HTMLElement;

    constructor(
      dynamicCheckout: DynamicCheckout,
      processOutInstance: ProcessOut,
      paymentConfig: DynamicCheckoutPaymentConfigType,
      theme: DynamicCheckoutThemeType
    ) {
      this.dynamicCheckout = dynamicCheckout;
      this.processOutInstance = processOutInstance;
      this.paymentConfig = paymentConfig;
      this.theme = theme;
      this.element = this.createViewElement();
      this.loadTingleLibrary();
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
      } = this.getUiElements();

      if (walletPaymentMethods.length > 0) {
        walletPaymentMethods.forEach((paymentMethod) => {
          walletCheckoutWrapper.appendChild(paymentMethod.element);
        });

        expressCheckoutWrapper.appendChild(walletCheckoutWrapper);
      }

      if (expressPaymentMethods.length > 0) {
        expressPaymentMethods.forEach((paymentMethod) => {
          expressPaymentMethodsWrapper.appendChild(paymentMethod.element);
        });

        expressCheckoutWrapper.appendChild(expressPaymentMethodsWrapper);
      }

      if (regularPaymentMethods.length > 0) {
        regularPaymentMethods.forEach((paymentMethod) => {
          regularPaymentMethodsList.appendChild(paymentMethod.element);
        });

        regularPaymentMethodsSectionWrapper.appendChild(
          regularPaymentMethodsList
        );
      }

      if (expressPaymentMethods.length > 0 || walletPaymentMethods.length > 0) {
        wrapper.appendChild(expressCheckoutWrapper);
      }

      if (regularPaymentMethods.length > 0) {
        wrapper.appendChild(regularPaymentMethodsSectionWrapper);
      }

      return wrapper;
    }

    private getUiElements() {
      const wrapper = HTMLElements.createElement({
        tagName: "div",
        classNames: ["dco-payment-methods-wrapper"],
      });

      const {
        walletPaymentMethods,
        expressPaymentMethods,
        regularPaymentMethods,
      } = this.getPaymentMethodsElements();

      const {
        expressCheckoutWrapper,
        walletCheckoutWrapper,
        expressPaymentMethodsWrapper,
      } = this.getExpressCheckoutElements();

      const { regularPaymentMethodsSectionWrapper, regularPaymentMethodsList } =
        this.getRegularPaymentMethodsElements([
          ...expressPaymentMethods,
          ...walletPaymentMethods,
        ]);

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
      };
    }

    private getExpressCheckoutElements() {
      const [
        expressCheckoutWrapper,
        expressCheckoutHeader,
        expressCheckoutHeaderText,
        walletCheckoutWrapper,
        expressPaymentMethodsWrapper,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-express-checkout-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-express-checkout-header-wrapper"],
        },
        {
          tagName: "span",
          classNames: ["dco-express-checkout-header"],
          textContent: Translations.getText(
            "express-checkout-header",
            this.paymentConfig.locale
          ),
        },
        {
          tagName: "div",
          classNames: ["dco-wallet-checkout-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-express-checkout-payment-methods-wrapper"],
        },
      ]);

      expressCheckoutHeader.appendChild(expressCheckoutHeaderText);
      expressCheckoutWrapper.appendChild(expressCheckoutHeader);

      if (this.shouldShowSettingsButton()) {
        this.createPaymentMethodsManager(expressCheckoutHeader);
      }

      return {
        expressCheckoutWrapper,
        walletCheckoutWrapper,
        expressPaymentMethodsWrapper,
      };
    }

    private createPaymentMethodsManager(expressCheckoutHeader: Element) {
      const settingsButton = document.querySelector(
        ".dco-express-checkout-header-settings-button"
      );

      if (settingsButton) {
        settingsButton.remove();
      }

      const { expressPaymentMethods } = this.getPaymentMethodsElements(true);

      if (expressPaymentMethods.length === 0) {
        return;
      }

      this.paymentMethodsManager = new PaymentMethodsManager(
        expressPaymentMethods,
        this.paymentConfig
      );

      expressCheckoutHeader.appendChild(this.paymentMethodsManager.element);
    }

    private getRegularPaymentMethodsElements(
      expressPaymentMethods: PaymentMethod[]
    ) {
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
            this.paymentConfig.locale
          ),
        },
        {
          tagName: "div",
          classNames: ["dco-regular-payment-methods-list-wrapper"],
        },
      ]);

      regularPaymentMethodsSectionWrapper.appendChild(
        regularPaymentMethodsSectionHeader
      );

      return { regularPaymentMethodsSectionWrapper, regularPaymentMethodsList };
    }

    private getPaymentMethodsElements(deleteMode?: boolean) {
      let walletPaymentMethods = [];
      let expressPaymentMethods = [];
      let regularPaymentMethods = [];

      this.paymentConfig.invoiceDetails.payment_methods.forEach(
        (paymentMethod) => {
          switch (paymentMethod.type) {
            case "googlepay":
              const googlePayPaymentMethod = new GooglePayPaymentMethod(
                this.processOutInstance,
                this.paymentConfig.invoiceDetails,
                this.resetContainerHtml.bind(this)
              );

              return walletPaymentMethods.push(googlePayPaymentMethod);

            case "applepay":
              const applePayPaymentMethod = new ApplePayPaymentMethod(
                this.processOutInstance,
                this.paymentConfig,
                this.paymentConfig.invoiceDetails,
                this.resetContainerHtml.bind(this)
              );

              return walletPaymentMethods.push(applePayPaymentMethod);

            case "apm_customer_token":
              const savedApmPaymentMethod = new SavedApmPaymentMethod(
                this.processOutInstance,
                paymentMethod,
                this.paymentConfig,
                this.theme,
                this.resetContainerHtml.bind(this),
                deleteMode,
                () => this.handleDeletePaymentMethod(paymentMethod)
              );

              return expressPaymentMethods.push(savedApmPaymentMethod);

            case "card_customer_token":
              const savedCardPaymentMethod = new SavedCardPaymentMethod(
                this.processOutInstance,
                paymentMethod,
                this.paymentConfig,
                this.theme,
                this.resetContainerHtml.bind(this),
                deleteMode,
                () => this.handleDeletePaymentMethod(paymentMethod)
              );

              return expressPaymentMethods.push(savedCardPaymentMethod);

            case "apm":
              const apmPaymentMethod = paymentMethod.apm.redirect_url
                ? new ApmPaymentMethod(
                    this.processOutInstance,
                    paymentMethod,
                    this.paymentConfig,
                    this.theme,
                    this.resetContainerHtml.bind(this)
                  )
                : new NativeApmPaymentMethod(
                    this.processOutInstance,
                    paymentMethod,
                    this.paymentConfig,
                    this.theme,
                    this.resetContainerHtml.bind(this)
                  );

              return regularPaymentMethods.push(apmPaymentMethod);

            case "card":
              const cardPaymentMethod = new CardPaymentMethod(
                this.processOutInstance,
                paymentMethod,
                this.paymentConfig,
                this.theme,
                this.resetContainerHtml.bind(this)
              );

              return regularPaymentMethods.push(cardPaymentMethod);

            default:
              break;
          }
        }
      );

      return {
        walletPaymentMethods,
        expressPaymentMethods,
        regularPaymentMethods,
      };
    }

    private resetContainerHtml() {
      this.element.innerHTML = "";
      return this.element;
    }

    private shouldShowSettingsButton() {
      let shouldShowSettingsButton = false;

      this.paymentConfig.invoiceDetails.payment_methods.forEach(
        (paymentMethod) => {
          const canDeleteApm =
            paymentMethod.type === "apm_customer_token" &&
            paymentMethod.apm_customer_token &&
            paymentMethod.apm_customer_token.deleting_allowed;

          const canDeleteCard =
            paymentMethod.type === "card_customer_token" &&
            paymentMethod.card_customer_token &&
            paymentMethod.card_customer_token.deleting_allowed;

          if (canDeleteApm || canDeleteCard) {
            shouldShowSettingsButton = true;
          }
        }
      );

      return shouldShowSettingsButton;
    }

    private handleDeletePaymentMethod(paymentMethod: PaymentMethod) {
      const isCardToken = paymentMethod.type === "card_customer_token";

      const tokenId = isCardToken
        ? paymentMethod.card_customer_token.customer_token_id
        : paymentMethod.apm_customer_token.customer_token_id;

      const customerId = this.paymentConfig.invoiceDetails.customer_id;

      this.processOutInstance.apiRequest(
        "delete",
        `customers/${customerId}/tokens/${tokenId}`,
        {},
        () => {
          this.deletePaymentMethodFromDom(tokenId, isCardToken);
          DynamicCheckoutEventsUtils.dispatchDeletePaymentMethodEvent();
        },
        (err) => {
          DynamicCheckoutEventsUtils.dispatchDeletePaymentMethodErrorEvent(err);
        },
        0,
        {
          clientSecret: this.paymentConfig.clientSecret,
        }
      );
    }

    private deletePaymentMethodFromDom(id: string, isCardToken: boolean) {
      const paymentMethodElements = document.querySelectorAll(`[data-id=${id}`);
      const paymentManagerMethodsList = document.querySelector(
        ".dco-modal-payment-methods-list"
      );
      const expressCheckoutMethodsList = document.querySelector(
        ".dco-express-checkout-payment-methods-wrapper"
      );

      const expressCheckoutHeader = document.querySelector(
        ".dco-express-checkout-header-wrapper"
      );

      paymentMethodElements.forEach((element) => element.remove());

      this.paymentConfig.invoiceDetails.payment_methods =
        this.paymentConfig.invoiceDetails.payment_methods.filter(
          (paymentMethod) => {
            if (isCardToken && paymentMethod.card_customer_token) {
              return paymentMethod.card_customer_token.customer_token_id !== id;
            }

            if (paymentMethod.apm_customer_token) {
              return paymentMethod.apm_customer_token.customer_token_id !== id;
            }

            return true;
          }
        );

      if (paymentManagerMethodsList.childNodes.length === 0) {
        this.createPaymentsManagerEmptyState(paymentManagerMethodsList);
      }

      if (expressCheckoutMethodsList.childNodes.length === 0) {
        expressCheckoutMethodsList.remove();
      }

      this.createPaymentMethodsManager(expressCheckoutHeader);
    }

    private createPaymentsManagerEmptyState(
      paymentsManagerMethodsList: Element
    ) {
      const [
        noSavedPaymentMethodsWrapper,
        noSavedPaymentMethodsIconWrapper,
        noSavedPaymentMethodsIcon,
        noSavedPaymentMethodsTextWrapper,
        noSavedPaymentMethodsHeader,
        noSavedPaymentMethodsMessage,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-no-saved-payment-methods-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-no-saved-payment-methods-icon-wrapper"],
        },
        {
          tagName: "img",
          classNames: ["dco-no-saved-payment-methods-icon"],
          attributes: {
            src: CREDIT_CARD_ICON,
          },
        },
        {
          tagName: "div",
          classNames: ["dco-no-saved-payment-methods-text-wrapper"],
        },
        {
          tagName: "span",
          classNames: ["dco-no-saved-payment-methods-header"],
          textContent: Translations.getText(
            "no-saved-payment-methods-header",
            this.paymentConfig.locale
          ),
        },
        {
          tagName: "span",
          classNames: ["dco-no-saved-payment-methods-message"],
          textContent: Translations.getText(
            "no-saved-payment-methods-message",
            this.paymentConfig.locale
          ),
        },
      ]);

      noSavedPaymentMethodsIconWrapper.appendChild(noSavedPaymentMethodsIcon);

      noSavedPaymentMethodsTextWrapper.appendChild(noSavedPaymentMethodsHeader);
      noSavedPaymentMethodsTextWrapper.appendChild(
        noSavedPaymentMethodsMessage
      );

      noSavedPaymentMethodsWrapper.appendChild(
        noSavedPaymentMethodsIconWrapper
      );
      noSavedPaymentMethodsWrapper.appendChild(
        noSavedPaymentMethodsTextWrapper
      );

      paymentsManagerMethodsList.appendChild(noSavedPaymentMethodsWrapper);
      paymentsManagerMethodsList.classList.add(
        "dco-modal-payment-methods-list--no-methods"
      );
    }

    private loadTingleLibrary() {
      const tingleScriptElement = document.createElement("script");
      tingleScriptElement.src = tingleLibrary;
      document.head.appendChild(tingleScriptElement);
    }
  }
}
