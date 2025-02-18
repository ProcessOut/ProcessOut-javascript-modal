/// <reference path="../../references.ts" />

module ProcessOut {
  export class CardPaymentMethod extends PaymentMethodButton {
    private procesoutInstance: ProcessOut
    private paymentMethod: PaymentMethod
    private paymentConfig: DynamicCheckoutPaymentConfig
    private theme: DynamicCheckoutThemeType
    private resetContainerHtml: () => HTMLElement

    constructor(
      procesoutInstance: ProcessOut,
      paymentMethod: PaymentMethod,
      paymentConfig: DynamicCheckoutPaymentConfig,
      theme: DynamicCheckoutThemeType,
      resetContainerHtml: () => HTMLElement,
    ) {
      const { display } = paymentMethod

      const rightContent = HTMLElements.createElement({
        tagName: "div",
        classNames: ["dco-card-schemes-wrapper"],
      })

      Object.keys(CARD_SCHEMES_ASSETS).forEach(schema => {
        const logo = HTMLElements.createElement({
          tagName: "img",
          classNames: ["dco-card-scheme-logo"],
          attributes: {
            src: CARD_SCHEMES_ASSETS[schema],
          },
        })

        rightContent.appendChild(logo)
      })

      super(display.name, display.logo.dark_url.vector, rightContent)

      this.procesoutInstance = procesoutInstance
      this.paymentMethod = paymentMethod
      this.paymentConfig = paymentConfig
      this.theme = theme
      this.resetContainerHtml = resetContainerHtml

      const cardForm = this.getChildrenElement()
      super.appendChildren(cardForm)
      this.setupCardForm(cardForm)
    }

    private setupCardForm(form: HTMLElement): void {
      this.procesoutInstance.setupForm(
        form,
        this.getCardFormOptions(),
        cardForm => {
          this.getCardDetailsSectionEventListeners()
          cardForm.addEventListener("submit", e => {
            e.preventDefault()

            const cardholderNameValid = this.isCardHolderInputValid()

            if (!cardholderNameValid) {
              this.handleValidationError({
                code: "card.missing-name",
              })
            }

            cardForm.validate(() => {
              if (!cardholderNameValid) {
                return this.handleValidationError({
                  code: "card.missing-name",
                })
              }

              this.setButtonLoading()

              this.procesoutInstance.tokenize(
                cardForm,
                this.getAdditionalFormValues(form),
                this.handleTokenizeSuccess.bind(this),
                this.handleTokenizeError.bind(this),
              )
            }, this.handleValidationError.bind(this))
          })
        },
        DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent,
      )
    }

    private handleTokenizeSuccess(cardToken: string) {
      const cardPaymentOptions = {
        authorize_only: !this.paymentConfig.capturePayments,
        allow_fallback_to_sale: this.paymentConfig.allowFallbackToSale,
      }

      const saveForFutureCheckbox = document.getElementById(
        "save-card-for-future",
      ) as HTMLInputElement | null

      if (saveForFutureCheckbox) {
        cardPaymentOptions["save_source"] = saveForFutureCheckbox.checked
      }

      this.procesoutInstance.makeCardPayment(
        this.paymentConfig.invoiceId,
        cardToken,
        cardPaymentOptions,
        this.handleCardPaymentSuccess.bind(this),
        this.handleCardPaymentError.bind(this),
        {
          clientSecret: this.paymentConfig.clientSecret,
        },
      )
    }

    private handleTokenizeError(error) {
      DynamicCheckoutEventsUtils.dispatchTokenizePaymentErrorEvent(error)
    }

    private handleCardPaymentSuccess(invoiceId: string) {
      this.resetContainerHtml().appendChild(
        new DynamicCheckoutPaymentSuccessView(this.paymentConfig).element,
      )
      DynamicCheckoutEventsUtils.dispatchPaymentSuccessEvent({
        invoiceId,
        returnUrl: this.paymentConfig.invoiceDetails.return_url,
      })
    }

    private handleCardPaymentError(error) {
      this.resetContainerHtml().appendChild(
        new DynamicCheckoutPaymentErrorView(this.paymentConfig).element,
      )
      DynamicCheckoutEventsUtils.dispatchPaymentErrorEvent(error)
    }

    private getCardFormOptions() {
      const options = new CardFieldOptions("")

      // @ts-ignore
      options.style = {
        fontSize: "14px",
      }

      options.placeholder = ""
      options.expiryAutoNext = false
      options.cardNumberAutoNext = true
      options.requireCVC = this.paymentMethod.card.cvc_required

      return options
    }

    private getAdditionalFormValues(form: HTMLElement) {
      const cardholderName = form.querySelector('input[name="cardholder-name"]') as HTMLInputElement

      const country = form.querySelector('select[name="country"]') as HTMLSelectElement

      const state = form.querySelector('select[name="state"]') as HTMLSelectElement

      const city = form.querySelector('input[name="city"]') as HTMLInputElement

      const postcode = form.querySelector('input[name="postcode"]') as HTMLInputElement

      const addressLine1 = form.querySelector('input[name="street1"]') as HTMLInputElement

      const addressLine2 = form.querySelector('input[name="street2"]') as HTMLInputElement

      return {
        name: cardholderName ? cardholderName.value : "",
        contact: {
          country: country ? country.value : "",
          state: state ? state.value : "",
          city: city ? city.value : "",
          zip: postcode ? postcode.value : "",
          address1: addressLine1 ? addressLine1.value : "",
          address2: addressLine2 ? addressLine2.value : "",
        },
      }
    }

    private getChildrenElement() {
      const [
        cardFormWrapper,
        cardFormSectionsWrapper,
        saveForFutureWrapper,
        saveForFutureCheckbox,
        saveForFutureLabel,
        payButton,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "form",
          classNames: ["dco-payment-method-card-form-wrapper"],
          attributes: {
            id: "card-form",
          },
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-sections-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-button-save-for-future-wrapper"],
        },
        {
          tagName: "input",
          classNames: ["dco-payment-method-button-save-for-future-checkbox"],
          attributes: {
            id: "save-card-for-future",
            type: "checkbox",
            name: "save-card-for-future",
          },
        },
        {
          tagName: "label",
          classNames: ["dco-payment-method-button-save-for-future-label"],
          attributes: {
            for: "save-card-for-future",
          },
          textContent: Translations.getText("save-for-future-label", this.paymentConfig.locale),
        },
        {
          tagName: "button",
          classNames: ["dco-payment-method-button-pay-button"],
          attributes: {
            id: "dco-card-pay-button",
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

      HTMLElements.appendChildren(saveForFutureWrapper, [saveForFutureCheckbox, saveForFutureLabel])

      const cardFormSectionsChildren = [
        this.getCardDetailsSection(),
        this.getCardBillingAddressSection(),
      ].filter(Boolean)

      HTMLElements.appendChildren(cardFormSectionsWrapper, cardFormSectionsChildren)

      const children = [
        cardFormSectionsWrapper,
        this.paymentMethod.card.saving_allowed ? saveForFutureWrapper : null,
        payButton,
      ].filter(Boolean)

      HTMLElements.appendChildren(cardFormWrapper, children)

      return cardFormWrapper
    }

    private getCardDetailsSection() {
      const [
        cardDetailsSection,
        cardDetailsSectionTitle,
        cardDetailsSectionInputsWrapper,
        cardNumberInputWrapper,
        cardNumberInput,
        cardNumberInputErrorMessage,
        splitCardInputRow,
        expiryDateInputWrapper,
        expiryDateInput,
        expiryDateInputErrorMessage,
        cvcInputWrapper,
        cvcInput,
        cvcInputErrorMessage,
        cardHolderNameInputWrapper,
        cardHolderNameInput,
        cardHolderNameInputErrorMessage,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-section"],
        },
        {
          tagName: "span",
          classNames: ["dco-payment-method-card-form-section-title"],
          textContent: Translations.getText(
            "card-details-section-title",
            this.paymentConfig.locale,
          ),
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-section-inputs-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-input-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-input"],
          attributes: {
            "data-processout-input": "cc-number",
            "data-processout-placeholder": "4242 4242 4242 4242",
          },
        },
        {
          tagName: "span",
          classNames: ["dco-payment-method-card-form-input-error-message"],
          attributes: {
            id: "card-number-error-message",
          },
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-split-card-input-row"],
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-input-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-input"],
          attributes: {
            "data-processout-input": "cc-exp",
            "data-processout-placeholder": "MM/YY",
          },
        },
        {
          tagName: "span",
          classNames: ["dco-payment-method-card-form-input-error-message"],
          attributes: {
            id: "expiry-date-error-message",
          },
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-input-wrapper"],
        },
        {
          tagName: "div",
          classNames: [
            "dco-payment-method-card-form-input",
            "dco-payment-method-card-form-input-card-details",
          ],
          attributes: {
            "data-processout-input": "cc-cvc",
            "data-processout-placeholder": "CVC",
          },
        },
        {
          tagName: "span",
          classNames: ["dco-payment-method-card-form-input-error-message"],
          attributes: {
            id: "cvc-error-message",
          },
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-input-wrapper"],
        },
        {
          tagName: "input",
          classNames: [
            "dco-payment-method-card-form-input",
            "dco-payment-method-card-form-input-cardholder-name",
          ],
          attributes: {
            name: "cardholder-name",
            placeholder: Translations.getText("cardholder-name-label", this.paymentConfig.locale),
          },
        },
        {
          tagName: "span",
          classNames: ["dco-payment-method-card-form-input-error-message"],
          attributes: {
            id: "cardholder-name-error-message",
          },
        },
      ])

      HTMLElements.appendChildren(cardNumberInputWrapper, [
        cardNumberInput,
        cardNumberInputErrorMessage,
      ])

      HTMLElements.appendChildren(cardDetailsSectionInputsWrapper, [
        cardNumberInputWrapper,
        splitCardInputRow,
      ])

      HTMLElements.appendChildren(expiryDateInputWrapper, [
        expiryDateInput,
        expiryDateInputErrorMessage,
      ])

      HTMLElements.appendChildren(cvcInputWrapper, [cvcInput, cvcInputErrorMessage])

      HTMLElements.appendChildren(splitCardInputRow, [expiryDateInputWrapper, cvcInputWrapper])

      HTMLElements.appendChildren(cardHolderNameInputWrapper, [
        cardHolderNameInput,
        cardHolderNameInputErrorMessage,
      ])

      const children = [
        cardDetailsSectionTitle,
        cardDetailsSectionInputsWrapper,
        this.paymentMethod.card.cardholder_name_required ? cardHolderNameInputWrapper : null,
      ].filter(Boolean)

      HTMLElements.appendChildren(cardDetailsSection, children)

      return cardDetailsSection
    }

    private getCardDetailsSectionEventListeners() {
      const cardholderNameInput = document.querySelector(
        'input[name="cardholder-name"]',
      ) as HTMLInputElement

      cardholderNameInput &&
        cardholderNameInput.addEventListener("input", () => {
          this.cleanErrorMessages()
        })

      // ProcessOut inputs doesn't have onChange event, so we need to listen to messages from the iframe
      window.addEventListener("message", e => {
        if (e.origin === this.procesoutInstance.endpoint("js", "")) {
          const eventData = e.data ? JSON.parse(e.data) : {}

          if (eventData.action === "inputEvent") {
            this.cleanErrorMessages()
          }
        }
      })
    }

    private getCardBillingAddressSection() {
      if (this.paymentMethod.card.billing_address.collection_mode === "never") {
        return null
      }

      const [
        cardBillingAddressSection,
        cardBillingAddressSectionTitle,
        cardBillingAddressSectionInputsWrapper,
        billingAddressFieldsWrapper,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-section"],
        },
        {
          tagName: "span",
          classNames: ["dco-payment-method-card-form-section-title"],
          textContent: Translations.getText(
            "billing-address-section-title",
            this.paymentConfig.locale,
          ),
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-billing-address-fields-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-card-form-billing-address-fields"],
        },
      ])

      HTMLElements.appendChildren(cardBillingAddressSection, [
        cardBillingAddressSectionTitle,
        cardBillingAddressSectionInputsWrapper,
      ])

      HTMLElements.appendChildren(cardBillingAddressSectionInputsWrapper, [
        this.getCountryInput(billingAddressFieldsWrapper),
        billingAddressFieldsWrapper,
      ])

      return cardBillingAddressSection
    }

    private setButtonLoading() {
      const payButton = document.getElementById("dco-card-pay-button") as HTMLButtonElement

      payButton.disabled = true
      payButton.textContent = ""

      const spinner = HTMLElements.createElement({
        tagName: "span",
        classNames: ["dco-payment-method-button-pay-button-spinner"],
      })

      HTMLElements.appendChildren(payButton, [spinner])
    }

    private getCountryInput(billingAddressFieldsWrapper: HTMLElement) {
      const countryInput = HTMLElements.createElement({
        tagName: "select",
        classNames: ["dco-payment-method-card-form-input"],
        attributes: {
          name: "country",
          placeholder: Translations.getText("country-label", this.paymentConfig.locale),
        },
      })

      const countries = Object.keys(billingAddressConfig)
      const restrictedCountries =
        this.paymentMethod.card.billing_address.restrict_to_country_codes || []

      HTMLElements.appendChildren(countryInput, [
        this.getDefaultSelectOption(
          Translations.getText("select-country-placeholder", this.paymentConfig.locale),
        ),
      ])

      countries.forEach(country => {
        let shouldShow = true

        restrictedCountries.forEach(restrictedCountry => {
          if (restrictedCountry === country) {
            shouldShow = false
          }
        })

        if (shouldShow) {
          const countryOption = HTMLElements.createElement({
            tagName: "option",
            textContent: billingAddressConfig[country].name,
            attributes: {
              value: country,
            },
          })

          HTMLElements.appendChildren(countryInput, [countryOption])
        }
      })

      countryInput.addEventListener("change", e => {
        const selectElement = e.target as HTMLSelectElement

        HTMLElements.replaceChildren(
          billingAddressFieldsWrapper,
          this.getBillingAddressField(selectElement.value),
        )
      })

      return countryInput
    }

    private getBillingAddressField(country: string) {
      const countryConfig = billingAddressConfig[country]

      const automaticMode = this.paymentMethod.card.billing_address.collection_mode === "automatic"

      const shouldShowPostcodeForAutomaticMode =
        country === "US" || country === "CA" || country === "GB"

      const noBillingAddressConfig = !countryConfig || !countryConfig.units

      if (noBillingAddressConfig || (automaticMode && !shouldShowPostcodeForAutomaticMode)) {
        return []
      }

      if (automaticMode && shouldShowPostcodeForAutomaticMode) {
        return [
          HTMLElements.createElement({
            tagName: "input",
            classNames: ["dco-payment-method-card-form-input"],
            attributes: {
              name: "postcode",
              placeholder: billingAddressUnitsData(this.paymentConfig).postcode.placeholder,
            },
          }),
        ]
      }

      let billingAddressFields = []

      countryConfig.units.forEach(unit => {
        let input

        if (unit === "state" && countryConfig.states) {
          input = HTMLElements.createElement({
            tagName: "select",
            classNames: ["dco-payment-method-card-form-input"],
            attributes: {
              name: unit,
            },
          })

          HTMLElements.appendChildren(input, [
            this.getDefaultSelectOption(
              Translations.getText("select-state-placeholder", this.paymentConfig.locale),
            ),
          ])

          countryConfig.states.forEach(state => {
            const stateOption = HTMLElements.createElement({
              tagName: "option",
              textContent: state.name,
              attributes: {
                value: state.abbreviation,
              },
            })

            HTMLElements.appendChildren(input, [stateOption])
          })
        } else {
          input = HTMLElements.createElement({
            tagName: "input",
            classNames: ["dco-payment-method-card-form-input"],
            attributes: {
              name: unit,
              placeholder: billingAddressUnitsData(this.paymentConfig)[unit].placeholder,
            },
          })
        }

        billingAddressFields.push(input)
      })

      const cityPostCodeSplitRow = HTMLElements.createElement({
        tagName: "div",
        classNames: ["dco-payment-method-card-form-split-card-input-row"],
      })

      let mappedBillingAddressFields = []

      billingAddressFields.forEach(field => {
        if (field.getAttribute("name") === "city" || field.getAttribute("name") === "postcode") {
          HTMLElements.appendChildren(cityPostCodeSplitRow, [field])
        } else {
          mappedBillingAddressFields.push(field)
        }
      })

      return [...mappedBillingAddressFields, cityPostCodeSplitRow]
    }

    // Needs to do it here also because cardholder name is not validated by the card form
    private isCardHolderInputValid() {
      let cardholderNameValid = true

      const cardholderName = document.querySelector(
        'input[name="cardholder-name"]',
      ) as HTMLInputElement

      if (cardholderName && !cardholderName.value.length) {
        cardholderNameValid = false
      }

      return cardholderNameValid
    }

    private handleValidationError(error) {
      switch (error.code) {
        case "card.invalid-number":
          const cardNumberErrorMessage = document.getElementById("card-number-error-message")

          if (cardNumberErrorMessage) {
            cardNumberErrorMessage.textContent = Translations.getText(
              "card-number-error-message",
              this.paymentConfig.locale,
            )
          }
          break
        case "card.invalid-month":
        case "card.invalid-year":
          const cardExpiryErrorMessage = document.getElementById("expiry-date-error-message")

          if (cardExpiryErrorMessage) {
            cardExpiryErrorMessage.textContent = Translations.getText(
              "expiry-date-error-message",
              this.paymentConfig.locale,
            )
          }
          break
        case "card.missing-cvc":
        case "card.invalid-cvc":
          const cardCvcErrorMessage = document.getElementById("cvc-error-message")

          if (cardCvcErrorMessage) {
            cardCvcErrorMessage.textContent = Translations.getText(
              "cvc-error-message",
              this.paymentConfig.locale,
            )
          }
          break
        case "card.missing-name":
          const cardNameErrorMessage = document.getElementById("cardholder-name-error-message")

          if (cardNameErrorMessage) {
            cardNameErrorMessage.textContent = Translations.getText(
              "cardholder-name-error-message",
              this.paymentConfig.locale,
            )
          }
          break
        default:
          break
      }
    }

    private cleanErrorMessages() {
      const cardForm = document.getElementById("card-form")

      cardForm
        .querySelectorAll(".dco-payment-method-card-form-input-error-message")
        .forEach(errorMessage => {
          errorMessage.textContent = ""
        })
    }

    private getDefaultSelectOption(text: string) {
      const defaultStateOption = HTMLElements.createElement({
        tagName: "option",
        textContent: text,
        attributes: {
          value: "",
          selected: "selected",
          disabled: "disabled",
        },
      })

      return defaultStateOption
    }
  }
}
