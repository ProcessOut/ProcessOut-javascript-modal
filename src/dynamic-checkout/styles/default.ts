/// <reference path="../references.ts" />

const defaultStyles = `
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  input,input::placeholder {
    font-family: inherit;
    color: #696F79;
  }

  .native-apm-select-input, .native-apm-text-input {
    height: 40px !important;
    border-radius: 4px !important;
    border: 1px solid #CCD1D6 !important;
    box-shadow: none;
    padding: 8px !important;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 1rem !important;
  }

  .native-apm-spinner {
    width: 40px !important;
    height: 40px !important; 
    border-color: #dedede !important;
    border-bottom-color: #242C38 !important;
  }

  .native-apm-message {
    text-align: center;
    font-size: 1rem !important;
  }

  .native-apm-button {
    width: 100% !important;
    height: 40px !important;
    font-size: 0.9rem !important;
  }

  .native-apm-input-error {
    font-size: 1rem !important;
  }

  .native-apm-input-label, .native-apm-input-label {
    font-size: 1rem !important; 
  }

  .native-apm-numeric-input {
    display: flex !important;
    justify-content: flex-start !important;
    gap: 10px !important;
  }

  .native-apm-payment-provider-logo {
    display: none !important;
  }

  .native-apm-numeric-input-character {
    height: 40px !important;
    width: 40px !important;
    font-size: 1rem !important;
    padding: 0 !important;
    border-radius: 4px !important;
    border: 1px solid #CCD1D6 !important;
    background-color: #fff !important;
  }

  .native-apm-payment-provider-logo {
    width: 50% !important;
  }

  .native-apm-input-error {
    font-size: 0.9rem !important;
    color: #e74c3c !important;
  }

  #button-loading-spinner {
    width: 18px !important;
    height: 18px !important;
  }

  .dco-card-payment-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .dco-card-payment-success-image {
    display: block;
    width: 120px;
    height: 120px;
  }

  .dco-card-payment-success-text {
    font-weight: 500;
    font-size: 1.2rem;
    display: block;
    text-align: center;
  }

  apple-pay-button {
    --apple-pay-button-width: 100%;
    --apple-pay-button-height: 40px;
    --apple-pay-button-border-radius: 4px;
    --apple-pay-button-padding: 5px;
    --apple-pay-button-box-sizing: border-box;

    display: initial;
  }

  #apple-pay-button-container {
    display: none;
  }

  #apple-pay-button-container.visible {
    display: block;
  }

  .dco-wallet-checkout {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .dco-payment-methods-wrapper * {
    box-sizing: border-box;
  }

  .dco-payment-methods-wrapper {
    min-width: 320px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;

    @media (max-width: 480px) {
      min-width: 100%;
    }
  }

  .dco-express-checkout-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .dco-express-checkout-payment-methods-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #dde0e3;
    border-radius: 4px;
    overflow: hidden;
  }

  .dco-express-checkout-header {
    font-weight: 500;
    font-size: 1.1rem;
  }

  .dco-wallet-checkout-wrapper {
    display: flex;
    width: 100%;
    gap: 10px;
  }

  .dco-wallet-checkout-button {
   flex: 1;
  }

  .dco-regular-express-checkout-wrapper {
    display: flex;
    gap: 10px;
  }

  .dco-regular-payment-methods-section-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .dco-regular-payment-methods-section-header {
    font-weight: 500;
    font-size: 1.1rem;
  }

  .dco-regular-payment-methods-list-wrapper {
    display: flex;
    flex-direction: column;
    border: 1px solid #dde0e3;
    border-radius: 4px;
    overflow: hidden;
  }

  .dco-payment-method-wrapper {
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 100%;
    border-bottom: 1px solid #dde0e3;
    cursor: pointer;
  }

  .dco-payment-method-wrapper--delete-mode {
    cursor: default;
    pointer-events: none;
  }

  .dco-payment-method-wrapper:has(input[type="radio"]:checked) {
    background-color: #F6F6F7;
  }

  .dco-payment-method-wrapper:has(input[type="radio"]:checked) .dco-payment-method-button-general-children-container {
    visibility: visible;
    opacity: 1;
    max-height: 100%;
    margin-top: 20px;
  }

  .dco-payment-method-button-general-children-container {
    visibility: hidden;
    opacity: 0;
    max-height: 0;
    transition: visibility 0s, opacity 0.3s ease-in-out;
  }

  .dco-payment-method-wrapper:last-child {
    border-bottom: none;
    overflow: hidden;
  }

  .dco-payment-method-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;
  }

  .dco-payment-method-button-info {
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 500;
  }

  .dco-payment-method-button-info-logo {
    width: 48px;
    height: 48px;
  }

  .dco-payment-method-button-right-content-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .dco-payment-method-button-children-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .dco-payment-method-button-message-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
  }

  .dco-payment-method-button-message-img {
    width: 40px;
    height: 40px;
  }

  .dco-payment-method-button-message-text {
    font-size: 0.9rem;
  }


  .dco-payment-method-button-pay-button {
    width: 100%;
    font-size: 0.9rem;
    height: 40px;
    border-radius: 4px;
    background-color: #242C38;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }

  .dco-payment-method-button-save-for-future-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: -10px;
  }

  .dco-payment-method-button-save-for-future-checkbox {
    width: 16px;
    height: 16px;
  }

  .dco-payment-method-button-save-for-future-label {
    font-size: 0.9rem;
    color: #696F79;
  }

  .dco-native-apm-payment-method-wrapper {
    width: 100%;
    display: flex;
    min-height: 150px;
    align-items: center;
  }

  .dco-payment-method-card-form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .dco-payment-method-card-form-sections-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .dco-payment-method-card-form-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .dco-payment-method-card-form-section-title {
    font-weight: 500;
  }

  .dco-payment-method-card-form-input {
    height: 40px;
    border-radius: 4px;
    border: 1px solid #dde0e3;
    background-color: #fff;
    padding: 8px;
    color: #000;
    width: 100%;
  }

  .dco-payment-method-card-form-input:placeholder {
    color: #c2c2c2;
  }

  .dco-payment-method-card-form-section-inputs-wrapper {
    display: flex;
    gap: 10px;
    flex-direction: column;
  }

  .dco-payment-method-card-form-input-cardholder-name {
    border: 1px solid #dde0e3;
    border-radius: 4px;
  }

  .dco-payment-method-card-form-split-card-input-row {
    display: flex;
    gap: 10px;
  }

  .dco-payment-method-card-form-billing-address-fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .dco-payment-method-card-form-input-error-message {
    font-size: 0.9rem;
    color: #e74c3c;
  }

  .dco-payment-method-card-form-billing-address-fields-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .dco-payment-method-card-available-card-providers {
    display: flex;
    gap: 5px;
  }

  .dco-payment-method-card-available-card-provider {
    width: 24px;
    height: 24px;
  }

  .dco-card-payment-error-text {
    text-align: center;
  }

  .dco-payment-method-button-pay-button-spinner {
    width: 18px;
    height: 18px;
    border: 3px solid #f2f2f2;
    border-bottom-color: #bfbfbf;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  .dco-payment-method-right-content {
    font-size: 0.9rem;
    background-color: #1B20290F;
    border-radius: 4px;
    font-weight: 500;
    padding: 5px 8px;
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .dco-card-schemes-wrapper {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .dco-card-scheme-logo {
    width: 24px;
  }

  .dco-payment-method-button-radio-button {
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    margin: 0;
    font: inherit;
    color: #A1A6B0;
    width: 16px;
    height: 16px;
    border: 1px solid #A1A6B0;
    border-radius: 50%;
    display: grid;
    place-content: center;
  }

  .dco-payment-method-button-radio-button::before {
    content: "";
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    border: 4px solid #000;
  }

  .dco-payment-method-button-radio-button:checked::before {
    transform: scale(1);
  }

  .dco-invoice-loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dco-invoice-loading {
    width: 40px;
    height: 40px; 
    border: 5px solid #dedede;
    border-bottom-color: #242C38;
    display: inline-block;
    border-radius: 50%;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
    
  .dco-express-checkout-header-settings-button {
    width: 32px;
    height: 32px;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all .4s;
    border-radius: 4px;
  }

  .dco-delete-payment-method-button {
    width: 32px;
    height: 32px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all .4s;
    border-radius: 4px;
    pointer-events: auto;
  }

  .dco-delete-payment-method-button:hover, .dco-express-checkout-header-settings-button:hover {
    background-color: #1213140f;
  }

  .dco-express-checkout-header-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .modal-box {
    width: 600px;
  }

  .close-modal-btn {
    background-color: #F2F2F2;
    border: none;
    padding: 14px 16px;
    float: right;
    border-radius: 4px;
    cursor: pointer;
  }

  .dco-modal-content-header {
    padding: 24px;
    font-size: 20px;
    font-weight: 600;
    border-bottom: 1px solid #F2F2F2;
  }

  .dco-modal-content-body {
    padding: 24px;
    height: 379px;
    overflow-y: auto;
  }
  

  .dco-modal-payment-methods-list {
    width: 100%;
    border: 1px solid #dde0e3;
    border-radius: 4px;
  }

  .dco-modal-payment-methods-list--no-methods {
    border: none;
    height: 100%;
  }

.tingle-modal * {
  box-sizing: border-box;
}

.tingle-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  visibility: hidden;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow-y: auto;
  background: rgba(0, 0, 0, .8);
  opacity: 0;
  transition: opacity .2s ease;
  align-items: center;
  -webkit-transition: opacity .2s ease;
  -webkit-box-align: center;
  -ms-flex-align: center;
}

.tingle-modal--confirm .tingle-modal-box {
  text-align: center;
}

.tingle-modal--noClose {
  cursor: default;
}

.tingle-modal--noClose .tingle-modal__close {
  display: none;
}

.tingle-modal__close {
  position: fixed;
  top: 1vw;
  right: 1vw;
  z-index: 1000;
  padding: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #fff;
  font-size: 40px;
  line-height: normal;
  cursor: pointer;
}

.tingle-modal-box {
  position: relative;
  margin-top: auto;
  margin-bottom: auto;
  width: 100%;
  max-width: 600px;
  border-radius: 4px;
  height: 490px;
  background: #fff;
  opacity: 1;
  cursor: auto;
  -webkit-transition: -webkit-transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: -webkit-transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275), -webkit-transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -webkit-transform: scale(.8);
  -ms-transform: scale(.8);
  transform: scale(.8);
  -ms-flex-negative: 0;
  flex-shrink: 0;
}

.tingle-modal-box__content {
  padding: 0;
}

.tingle-modal-box__footer {
  padding: 16px;
  width: auto;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top: 1px solid #F2F2F2;
  background-color: #FFF;
  cursor: auto;
}

.tingle-modal-box__footer::after {
  display: table;
  clear: both;
  content: "";
}

.tingle-modal-box__footer--sticky {
  position: fixed;
  bottom: -200px;
  z-index: 10001;
  opacity: 1;
  -webkit-transition: bottom .3s ease-in-out .3s;
  transition: bottom .3s ease-in-out .3s;;
}

.tingle-enabled {
  overflow: hidden;
  height: 100%;
}

.tingle-modal--visible .tingle-modal-box__footer {
  bottom: 0;
}

.tingle-enabled .tingle-content-wrapper {
  -webkit-filter: blur(15px);
  filter: blur(15px);
}

.tingle-modal--visible {
  visibility: visible;
  opacity: 1;
}

.tingle-modal__close {
  display: none;
}

.tingle-modal--visible .tingle-modal-box {
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

.tingle-modal--overflow {
  padding-top: 5vh;
}

.tingle-btn {
  display: inline-block;
  margin: 0 .5rem;
  padding: 1rem 2rem;
  border: none;
  background-color: grey;
  box-shadow: none;
  color: #fff;
  vertical-align: middle;
  text-decoration: none;
  font-size: inherit;
  font-family: inherit;
  line-height: normal;
  cursor: pointer;
  -webkit-transition: background-color .4s;
  transition: background-color .4s;
}

.tingle-btn--primary {
  background-color: #3498db;
}

.tingle-btn--danger {
  background-color: #e74c3c;
}

.tingle-btn--default {
  background-color: #34495e;
}

.tingle-btn--pull-left {
  float: left;
}

.tingle-btn--pull-right {
  float: right;
}

.dco-invoice-loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dco-invoice-loading {
  width: 40px;
  height: 40px; 
  border: 5px solid #dedede;
  border-bottom-color: #242C38;
  display: inline-block;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.dco-no-saved-payment-methods-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  height: 100%;
  width: 100%;
  gap: 24px;
}

.dco-no-saved-payment-methods-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
}

.dco-no-saved-payment-methods-header {
  font-size: 16px;
  font-weight: bold;
}

.dco-no-saved-payment-methods-message {
  font-size: 14px;
  color: #696F79;
  font-weight: 400;
}

.dco-no-saved-payment-methods-icon-wrapper {
  border-radius: 4px;
  padding: 12px;
  background-color: #1213140a;
}
`;
