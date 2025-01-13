/// <reference path="../references.ts" />

module ProcessOut {
  export abstract class PaymentMethodButton {
    public element: HTMLElement;

    constructor(
      name: string,
      logoUrl: string,
      id: string,
      rightContent?: HTMLElement,
      deleteMode: boolean = false,
      deletingAllowed: boolean = false,
      handleDeletePaymentMethod?: () => void
    ) {
      this.element = this.createElement(
        name,
        logoUrl,
        id,
        deleteMode,
        deletingAllowed,
        rightContent,
        handleDeletePaymentMethod
      );
    }

    private createElement(
      name: string,
      logoUrl: string,
      id: string,
      deleteMode: boolean,
      deletingAllowed: boolean,
      rightContent?: HTMLElement,
      handleDeletePaymentMethod?: () => void
    ) {
      const [
        element,
        paymentMethodButtonWrapper,
        paymentMethodInfo,
        paymentMethodLogo,
        paymentMethodName,
        rightContentWrapper,
        radioButton,
        deleteButton,
        deleteButtonIcon,
      ] = HTMLElements.createMultipleElements([
        {
          tagName: "label",
          classNames: [
            "dco-payment-method-wrapper",
            deleteMode && "dco-payment-method-wrapper--delete-mode",
          ],
          attributes: {
            "data-id": id,
          },
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-button-wrapper"],
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-button-info"],
        },
        {
          tagName: "img",
          classNames: ["dco-payment-method-button-info-logo"],
          attributes: {
            src: logoUrl,
            alt: name,
          },
        },
        {
          tagName: "span",
          textContent: name,
        },
        {
          tagName: "div",
          classNames: ["dco-payment-method-button-right-content-wrapper"],
        },
        {
          tagName: "input",
          classNames: ["dco-payment-method-button-radio-button"],
          attributes: {
            type: "radio",
            name: "payment-method",
          },
        },
        {
          tagName: "button",
          classNames: ["dco-delete-payment-method-button"],
        },
        {
          tagName: "img",
          classNames: ["dco-delete-payment-method-icon"],
          attributes: {
            src: TRASH_ICON,
          },
        },
      ]);

      if (rightContent) {
        HTMLElements.appendChildren(rightContentWrapper, [rightContent]);
      }

      HTMLElements.appendChildren(paymentMethodInfo, [
        paymentMethodLogo,
        paymentMethodName,
      ]);

      HTMLElements.appendChildren(element, [paymentMethodButtonWrapper]);

      HTMLElements.appendChildren(paymentMethodButtonWrapper, [
        paymentMethodInfo,
        rightContentWrapper,
      ]);

      if (deleteMode && deletingAllowed) {
        HTMLElements.appendChildren(deleteButton, [deleteButtonIcon]);
        HTMLElements.appendChildren(rightContentWrapper, [deleteButton]);

        deleteButton.addEventListener("click", () => {
          deleteButton.setAttribute("disabled", "true");
          handleDeletePaymentMethod();
        });
      }

      if (!deleteMode) {
        HTMLElements.appendChildren(rightContentWrapper, [radioButton]);
      }

      return element;
    }

    public appendChildren(children: HTMLElement) {
      const childrenWrapper = HTMLElements.createElement({
        tagName: "div",
        classNames: ["dco-payment-method-button-general-children-container"],
      });

      HTMLElements.appendChildren(childrenWrapper, [children]);
      HTMLElements.appendChildren(this.element, [childrenWrapper]);
    }
  }
}
