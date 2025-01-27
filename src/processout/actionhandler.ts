/// <reference path="../references.ts" />

/**
 * ProcessOut module/namespace
 */
module ProcessOut {

    class MockedIFrameWindow {
        protected element: HTMLElement;
        protected iframe:  HTMLIFrameElement;
        public closed:     boolean;

        constructor(el: HTMLElement, iframe: HTMLIFrameElement) {
            this.element = el;
            this.iframe  = iframe;

            window.addEventListener("resize", function(event) {
                var width = Math.max(document.body.clientWidth,
                    document.documentElement.clientWidth);
                this.element.style.width = width + "px";
                var height = Math.max(document.body.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight);
                this.element.style.height = height + "px";
                this.element.style.maxHeight = "100%";
            }.bind(this));
            if(typeof(Event) === "function") {
                var event = new Event("resize");
            } else {
                var event = document.createEvent("Event");
                event.initEvent("resize", true, true);
            }
            window.dispatchEvent(event);
        }

        public open(url: string) {
            // Load the page in our modal
            this.iframe.setAttribute("src", url);
            // Make sure that we can't scroll behind the modal
            document.body.style.overflow = "hidden";

            // And finally show the modal to the user
            document.body.appendChild(this.element);
        }

        public close() {
            document.body.style.overflow = "";
            this.closed = true;
            this.element.remove();
        }
    }

    export enum ActionFlow {
        NewTab,
        NewWindow,
        IFrame,
        FingerprintIframe,
        CurrentWindow,
    }

    export type IframeOverride = {
        width: number | string,
        height: number | string,
    }

    export class ActionHandlerOptions {
        public flow: ActionFlow;

        // newWindowHeight and Widths used when the action is done on a new
        // window
        public newWindowHeight?: number;
        public newWindowWidth?: number;

        // Specifies how big the iframe is, it can be overridden by IframeOverride
        public iframeWidth: number | string = 440;
        public iframeHeight: number | string = 480;

        // gatewayLogo is shown when the action is done on another tab or window
        public gatewayLogo?: string;

        public static ThreeDSChallengeFlow = "three-d-s-challenge-flow";
        public static ThreeDSChallengeFlowNoIframe = "three-d-s-challenge-flow-no-iframe";
        public static ThreeDSFingerprintFlow = "three-d-s-fingerprint-flow";

        /**
         *
         * @param actionType gateway string
         * @param gatewayLogo gateway logo url
         * @param override If specified, the flow will use iframe with width and height override setting.
         */
        constructor(actionType?: string, gatewayLogo?: string, override?: IframeOverride) {
            this.gatewayLogo = gatewayLogo;

            switch (actionType) {
            // The 3DS flow is a special one where we always want to load it
            // in an iframe (if it is supported)
            case ActionHandlerOptions.ThreeDSChallengeFlow:
                this.flow = ActionFlow.IFrame;
                break;

            // The 3DS flow where iframe is not supported
            case ActionHandlerOptions.ThreeDSChallengeFlowNoIframe:
                this.flow = ActionFlow.CurrentWindow;
                break;

            // The 3DS Fingerprint flow is another special one where we
            // only want to load the iframe in the back, hidden from the user
            case ActionHandlerOptions.ThreeDSFingerprintFlow:
                this.flow = ActionFlow.FingerprintIframe;
                break;

            // For PayPal we want to open a new window on top of
            // the payment page to emulate the "in-context" flow
            case "paypal":
            case "paypalexpresscheckout":
            case "paypal-rest":
                this.flow = ActionFlow.NewWindow;
                this.newWindowHeight = 645;
                this.newWindowWidth  = 450;
                break;

            // For sandbox mode we also want to emulate it like that
            case "test-credit-card":
            case "test-alternative-payment":
                this.flow = ActionFlow.NewWindow;
                this.newWindowHeight = 645;
                this.newWindowWidth  = 450;
                break;

            // By default we just want a new tab
            default:
                this.flow = ActionFlow.NewTab;
            }

            if (this.flow == ActionFlow.NewWindow) {
                // If we're on mobile, sometimes creating a new window will
                // break the browser
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    this.flow = ActionFlow.NewTab;
                }
            }

            if(override) {
                this.flow = ActionFlow.IFrame;

                if (override.width) {
                    this.iframeWidth = override.width;
                }

                if (override.height) {
                    this.iframeHeight = override.height;
                }
            }
        }
    }

    /**
     * ActionHandler is the class handling the customer actions
     */
    export class ActionHandler {

        /**
         * ProcessOut instance of the current context
         * @type {ProcessOut}
         */
        protected instance: ProcessOut;

        /**
         * Current gateway configuration ID
         * @type {string}
         */
        protected gatewayConfigurationID: string;

        /**
         * Current resource ID. Can be invoice, subscription or authorization
         * request
         * @type {string}
         */
        protected resourceID: string;

        /**
         * Defines whether or not the current action is canceled
         * @type {boolean}
         */
        protected canceled = false;

        /**
         * IFrame wrapper to be used instead of a new tab to handle the
         * given customer action
         * @type {HTMLElement}
         */
        protected iframeWrapper: MockedIFrameWindow;

        /**
         * Options contains the options for the action handler
         * @type {ActionHandlerOptions}
         */
        protected options: ActionHandlerOptions;

        /**
         * listenerCount is the number of listener that were set
         * @type {number}
         */
        protected static listenerCount = 0;

        /**
         * newWindowName is the name of the new windows created by the
         * ActionHandler
         * @type {string}
         */
        protected newWindowName = 'processout.checkout-window';

        /**
         * ActionHandler constructor
         * @param {ProcessOut} instance
         * @param {string} resourceID
         */
        constructor(instance: ProcessOut, options?: ActionHandlerOptions) {
            this.instance = instance;
            this.options  = options;

            if (!this.options) this.options = new ActionHandlerOptions();

            // We need to create the wrapper beforehand
            if (this.options.flow == ActionFlow.IFrame) {
                var iframeWrapper = document.createElement("div");
                iframeWrapper.id = "processoutjs-action-modal";
                iframeWrapper.style.position = "fixed";
                iframeWrapper.style.top = "0";
                iframeWrapper.style.left = "0";
                iframeWrapper.style.height = "100%";
                iframeWrapper.style.width = "100%";
                iframeWrapper.setAttribute("style", "position: fixed; top: 0; left: 0; background: rgba(0, 0, 0, 0.5); z-index: 9999999; overflow: auto;");


                // If the option is number it means that we should use pixels here for the sake of 
                // backward compatibility. If not - then we use it as value since user can pass
                // any unit like percentages e.g. 100%, calc(100% - 80px), 30rem etc
                const width = typeof this.options.iframeWidth === 'number' ? `${this.options.iframeWidth}px` : this.options.iframeWidth
                const height = typeof this.options.iframeHeight === 'number' ? `${this.options.iframeHeight}px` : this.options.iframeHeight;

                // Create the iframe to be used later
                var iframe = document.createElement("iframe");
                iframe.setAttribute("style", `margin: 1em auto; width: ${width}; height: ${height}; max-width: 100%; max-height: 100%; display: block; box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07); background-color: #ECEFF1; background-image: url("${this.instance.endpoint("js", "/images/loader.gif")}"); background-repeat: no-repeat; background-position: center;")`);
                iframe.setAttribute("frameborder", "0");
                iframe.onload = function() {
                    // Remove the background loader once it is actually loaded
                    iframe.style.backgroundImage = null;
                };

                // And create the cancel button
                var buttonWrapper = document.createElement("div");
                buttonWrapper.setAttribute("style", "width: 150px; text-align: center; margin: 0 auto 1em auto;");
                var button = document.createElement("div");
                button.setAttribute("style", "cursor: pointer; color: white;");
                button.innerHTML = Translator.translateMessage("label.cancel", "Cancel");
                buttonWrapper.appendChild(button);

                iframeWrapper.appendChild(iframe);
                iframeWrapper.appendChild(buttonWrapper);
                this.iframeWrapper = new MockedIFrameWindow(iframeWrapper, iframe);
                button.onclick = function() {
                    this.iframeWrapper.close();
                }.bind(this);
            }
        }

        /**
         * Handle will execute the customer action
         * @param  {callback} success
         * @param  {callback} error
         * @return {ActionHandler}
         */
        public handle(
            url:     string,
            success: (data:  any)    => void,
            error:   (err:   Exception) => void): ActionHandler {

            var t         = this;
            var timeout;
            var topLayer;
            var newWindow;

            var refocus = function() {
                if (topLayer) topLayer.remove();
                window.focus();
            }

            switch (this.options.flow) {
            case ActionFlow.NewWindow:
                ({topLayer, newWindow} = this.createNewWindow(url));
                break;

            case ActionFlow.IFrame:
                newWindow = this.iframeWrapper;
                newWindow.open(url);
                break;

            case ActionFlow.FingerprintIframe:
                newWindow = this.createFingerprintIFrame();
                newWindow.open(url);
                // The fingerprint should always finish up after max 10s, so
                // we'll auto timeout after that time
                timeout = setTimeout(function() {
                    clearInterval(timer); timer = null;
                    newWindow.close()
                    error(new Exception("three-d-s-2.fingerprint-timed-out"));
                }, 10000);
                break;

            case ActionFlow.CurrentWindow:
                newWindow = window;
                window.location.replace(url);
                break;

            default:
                // Default to new tab
                ({topLayer, newWindow} = this.createNewTabOrWindow(url));
            }

            if (!newWindow) {
                error(new Exception("customer.popup-blocked"));
                refocus();
                return null;
            }

            // We now want to monitor the payment page
            var timer = setInterval(function() {
                if (!timer) return;

                if (t.isCanceled()) {
                    clearInterval(timer); timer = null;
                    newWindow.close();
                    error(new Exception("customer.canceled"));
                    refocus();
                    return;
                }

                var cancelf = function() {
                    // The payment window was closed
                    clearInterval(timer); timer = null;
                    error(new Exception("customer.canceled"));
                    refocus();
                }
                try {
                    // We want to run the newWindow.closed condition in a try
                    // catch as Chrome has a bug in which the access to the
                    // window is lost when the user navigates back (ie clicks
                    // on the back button)
                    if (!newWindow || newWindow.closed) {
                        cancelf();
                    }
                } catch (err) {
                    // Close the newWindow, just in case it didn't crash for
                    // that reason
                    try { newWindow.close(); } catch (err) { }
                    cancelf();
                }
            }, 500);

            this.listenEvents(newWindow, timer, refocus,
                function(data: any): void {
                    if (timeout) clearTimeout(timeout);
                    success(data);
                }, function(err: Exception): void {
                    if (timeout) clearTimeout(timeout);
                    error(err);
                });
            return this;
        }

        protected createNewTabOrWindow(url: string): any {
            // The following will open a new tab or window, depending on the
            // user's browser preference
            var win = window.open(url, this.newWindowName);
            return this.setupWindowObject(win);
        }

        protected createNewWindow(url: string): any {
            // As we force a window size, the following should force a new
            // window to pop
            var h = this.options.newWindowHeight;
            var w = this.options.newWindowWidth;
            var y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
            var x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
            var win = window.open(url, this.newWindowName,
                `menubar=false,toolbar=false,width=${w},height=${h},top=${y},left=${x}`);
            return this.setupWindowObject(win);
        }

        protected setupWindowObject(newWindow: any): any {
            if (!newWindow) {
                return {};
            }

            var ret = {
                topLayer:  null,
                newWindow: newWindow
            };

            // Add a handler to this window to close child windows/tabs
            // when this tab closes.
            var onunload = function(e) {
                try {
                    ret.newWindow.close();
                } catch(err) {
                    //
                }
            }
            window.addEventListener("beforeunload", onunload, false);
            window.addEventListener("pagehide", onunload, false); // for iOS and new browsers

            // Add a layer on top of the website to prevent other actions
            // from the user during checkout
            ret.topLayer = document.createElement("div");
            ret.topLayer.id = "processoutjs-action-modal";
            ret.topLayer.setAttribute("style", "position: fixed; top: 0; left: 0; background: rgba(0, 0, 0, 0.7); z-index: 9999999; overflow: auto; height: 100%; width: 100%;");

            // Also add a friendly little message
            var topLayerMessage = document.createElement("div");
            topLayerMessage.setAttribute("style", "text-align: center; color: white; max-width: 350px; margin: 0 auto; margin-top: 10%; cursor: pointer;");
            if (this.options.gatewayLogo) {
                var topLayerMessageImage = document.createElement("img");
                topLayerMessageImage.setAttribute("style", "max-height: 70px; max-width: 230px; filter: saturate(0) grayscale(1) brightness(0.6) contrast(100000) invert(1); margin-bottom: 2em;");
                topLayerMessageImage.setAttribute("src", this.options.gatewayLogo);
                topLayerMessage.appendChild(topLayerMessageImage);
            }
            var topLayerMessageText = document.createElement("div");
            topLayerMessageText.innerHTML = Translator.translateMessage("label.apm-description");
            topLayerMessage.appendChild(topLayerMessageText);
            ret.topLayer.appendChild(topLayerMessage);

            topLayerMessage.addEventListener("click", function() {
                ret.newWindow.focus();
            }.bind(this), false);

            var topLayerCancel = document.createElement("div");
            topLayerCancel.setAttribute("style", "text-align: center; color: white; max-width: 350px; margin: 0 auto; margin-top: 3em; cursor: pointer; opacity: 0.9;");
            topLayerCancel.innerHTML = Translator.translateMessage("label.cancel");
            ret.topLayer.appendChild(topLayerCancel);

            topLayerCancel.addEventListener("click", function() {
                this.cancel();
            }.bind(this), false);

            document.body.appendChild(ret.topLayer);
            return ret;
        }

        protected createFingerprintIFrame(): MockedIFrameWindow {
            var iframeWrapper = document.createElement("div");
            iframeWrapper.id = "processoutjs-fingerprint-wrapper";
            iframeWrapper.style.height = "0";
            iframeWrapper.style.width = "0";

            // Create the iFrame to be used later
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.setAttribute("frameborder", "0");

            iframeWrapper.appendChild(iframe);
            var wrapper = new MockedIFrameWindow(iframeWrapper, iframe);
            return wrapper;
        }

        protected listenEvents(newWindow: Window, timer: number,
            refocus: ()                => void,
            success: (data: any)       => void,
            error:   (err:  Exception) => void): void {

            ActionHandler.listenerCount++;
            var cur = ActionHandler.listenerCount;

            var alreadyDone = false;
            var handler = function(event) {
                var data = Message.parseEvent(event);
                if (data.namespace != Message.checkoutNamespace)
                    return;

                // Not the latest listener anymore
                if (ActionHandler.listenerCount != cur) {
                    // Reset the timer if it hasn't been done already
                    if (timer) { clearInterval(timer); timer = null; }
                    return;
                }

                if (alreadyDone) return;
                alreadyDone = true;

                switch (data.action) {
                case "success":
                    if (timer) { clearInterval(timer); timer = null; }
                    newWindow.close();

                    // The checkout page sent us the token we want
                    success(data.data);
                    refocus();
                    break;

                case "canceled":
                    if (timer) { clearInterval(timer); timer = null; }
                    newWindow.close();

                    error(new Exception("customer.canceled"));
                    refocus();
                    break;

                case "none":
                    // There's nothing to be done on the page
                    if (timer) { clearInterval(timer); timer = null; }
                    newWindow.close();

                    error(new Exception("processout-js.no-customer-action"));
                    refocus();
                    break;

                case "error":
                    if (timer) { clearInterval(timer); timer = null; }
                    newWindow.close();

                    error(new Exception(data.errorCode, data.errorMessage));
                    refocus();
                    break;

                default:
                    // By default we shouldn't have received something with
                    // a correct namespace by unknown action
                    if (timer) { clearInterval(timer); timer = null; }
                    newWindow.close();

                    error(new Exception("default"));
                    refocus();
                    break;
                }
            };
            window.addEventListener("message", handler);

            new MessageHub(this.instance, null, function(k: string, v: string) {
                var data = Message.parseEvent(<MessageEvent>{
                    data: v,
                });
                data.namespace = k;
                handler({
                    data: JSON.stringify(data)
                });
            });
        }

        /**
         * Cancel any ongoing action
         * @return {void}
         */
        public cancel(): void {
            this.canceled = true;
        }

        /**
         * Returns true if the action was previously canceled, false otherwise
         * @return {boolean}
         */
        public isCanceled(): boolean {
            return this.canceled;
        }

    }

}
