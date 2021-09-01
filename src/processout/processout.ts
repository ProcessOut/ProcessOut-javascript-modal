/// <reference path="../references.ts" />

// declare the IE specific XDomainRequest object
declare var XDomainRequest: any;
interface Window {
    XDomainRequest?: any;
}

/**
 * ProcessOut module/namespace
 */
module ProcessOut {

    export const DEBUG = false;
    export const TestModePrefix = "test-";

    /**
     * ProcessOut main class
     */
    export class ProcessOut {

        /**
         * Project ID
         * @type {string}
         */
        protected projectID: string;

        /**
         * Bind is an object used during the tokenization flow
         * @type {string}
         */
        protected bind?: string;

        /**
         * Current resource ID. Can be invoice, subscription or authorization
         * request
         * @type {string}
         */
        protected resourceID: string;

        /**
         * Timeout before considering the modal could not be loaded, in ms
         * @type {Number}
         */
        public timeout = 10000;

        /**
        * Sandbox mode. Is set to true if a project ID prefixed with `test-`
        * (cf TestModePrefix) is used
        * @type {boolean}
        */
        public sandbox = false;
        
        /**
        * Host of ProcessOut. Is automatically updated to the correct one 
        * when the library loads
        * @type {string}
        */
        protected host = "processout.com";

        /**
         * Path to the ProcessOut field to be used to load the card forms
         * @type {string}
         */
        protected processOutFieldEndpoint = "";

        /**
         * Path to the ProcessOut message hub used to communicate between windows
         * @type {string}
         */
        protected processOutMessageHubEndpoint = "";

        /**
        * Version of the API used by ProcessOut.js
        * @type {string}
        */
        public apiVersion = "1.3.0.0";

        /**
         * Expose the ApplePay class in the instance
         * @type {ApplePayWrapper}
         */
        public applePay: ApplePayWrapper;

        /**
         * Expose the ThreeDS class in the instance
         * @type {ThreeDSWrapper}
         */
        public threeDS: ThreeDSWrapper;

        /**
         * ProcessOut constructor
         * @param  {string} projectID
         * @param  {string} resourceID
         */
        constructor(projectID: string, resourceID?: string) {
            // We want to make sure ProcessOut.js is loaded from ProcessOut CDN.
            var scripts = document.getElementsByTagName("script");
            var jsHost = "";
            if (/^https?:\/\/.*\.processout\.((com)|(ninja)|(dev))\//.test(
                window.location.href)) {

                jsHost = window.location.href;
            } else {
                // Otherwise loop through the scripts on the page and check
                // we have at least one script coming from ProcessOut
                for (var i = 0; i < scripts.length; i++) {
                    if (/^https?:\/\/.*\.processout\.((com)|(ninja)|(dev))\//.test(
                        scripts[i].getAttribute("src"))) {

                        jsHost = scripts[i].getAttribute("src");
                    }
                }
            }

            if (jsHost == "" && !DEBUG) {
                throw new Exception("processout-js.not-hosted");
            }
            if (/^https?:\/\/.*\.processout\.ninja\//.test(jsHost)) {
                this.host = "processout.ninja";
            } else if (/^https?:\/\/.*\.processout\.dev\//.test(jsHost)) {
                this.host = "processout.dev";
            } else {
                this.host = "processout.com";
            }

            if (!projectID)
                throw new Exception("processout-js.missing-project-id");

            this.projectID = projectID;
            if (this.projectID.lastIndexOf(TestModePrefix, 0) === 0)
                this.sandbox = true;

            this.resourceID = resourceID;
            if (this.resourceID &&
                this.resourceID != "" &&
                this.resourceID.substring(0, 3) != "iv_" &&
                this.resourceID.substring(0, 4) != "sub_" &&
                this.resourceID.substring(0, 9) != "auth_req_") {

                throw new Exception("resource.invalid-type");
            }

            this.applePay = new ApplePayWrapper(this);
            this.threeDS = new ThreeDSWrapper(this);
        }

        /**
         * Return the ID of the resource in the current context
         * @return {string}
         */
        public getResourceID(): string {
            return this.resourceID;
        }

        /**
         * Return the ID of the project in the current context
         * @return {string}
         */
        public getProjectID(): string {
            return this.projectID;
        }

        /**
         * Return the ProcessOut field endpoint
         * @return {string}
         */
        public getProcessOutFieldEndpoint(suffix: string): string {
            var endpoint = this.endpoint("js", "/ccfield.html");
            if (DEBUG && this.processOutFieldEndpoint) endpoint = this.processOutFieldEndpoint;
            return `${endpoint}${suffix}`;
        }

        /**
         * Return the ProcessOut field endpoint
         * @return {string}
         */
        public getProcessOutMessageHubEndpoint(suffix: string): string {
            var endpoint = this.endpoint("js", "/messagehub.html");
            if (DEBUG && this.processOutMessageHubEndpoint) endpoint = this.processOutMessageHubEndpoint;
            return `${endpoint}${suffix}`;
        }

        /**
         * Set a custom processout field endpoint
         * @return {string}
         */
        public setProcessOutFieldEndpoint(endpoint: string): void {
            if (!DEBUG) return;
            this.processOutFieldEndpoint = endpoint;
        }

        /**
         * Set a custom processout message hub endpoint
         * @return {string}
         */
        public setProcessOutMessageHubEndpoint(endpoint: string): void {
            if (!DEBUG) return;
            this.processOutMessageHubEndpoint = endpoint;
        }

        /**
         * Get the ProcessOut endpoint of the given subdomain
         * @param  {string} subdomain
         * @param  {string} path
         * @return {string}
         */
        public endpoint(subdomain: string, path: string): string {
            return `https://${subdomain}.${this.host}${path}`;
        }

        /**
         * Perform a request to the ProcessOut API
         * @param  {string} method
         * @param  {string} path
         * @param  {Object} data
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
        public apiRequest(method: string, path: string, data,
            success: (data: any, req: XMLHttpRequest, e: Event) => void,
            error:   (req: XMLHttpRequest, e: Event) => void,
            retry?:   number): void {

            if (!retry) retry = 0;

            method = method.toLowerCase();

            if (path.substring(0, 4) != "http" && path[0] != "/")
                path = this.endpoint("api", "/"+path);

            var headers = {
                "Content-Type": "application/json",
                "API-Version":  this.apiVersion
            };
            if (this.projectID)
                headers["Authorization"] = `Basic ${btoa(this.projectID+":")}`;

            // We need the data to at least be an empty object
            if (!data) data = {};

            if (data.idempotency_key) {
                headers["Idempotency-Key"] = data.idempotency_key;
                delete data.idempotency_key;
            }

            // We need to hack our project ID in the URL itself so that
            // ProcessOut's load-balancers and routers can route the request
            // to the project's region
            path += `?legacyrequest=true&project_id=${this.projectID}`
            
            // We also need to hack our request headers for legacy browsers to 
            // work, but also for modern browsers with extensions playing with 
            // headers (such as antiviruses)
            for (var k in headers)
                path += `&x-${k}=${headers[k]}`;

            if (method == "get") {
                for (var key in data)
                    path += `&${key}=${encodeURIComponent(data[key])}`;
            }

            var request = new XMLHttpRequest();
            if (window.XDomainRequest)
                request = new XDomainRequest();
            request.open(method, path, true);

            // We still want to push the headers when we can
            if (!window.XDomainRequest) {
                for (var k in headers)	
                    request.setRequestHeader(k, headers[k]);
            }

            request.timeout = 0;
            request.onload = function(e: any) {
                // Parse the response in a try catch so we can properly
                // handle bad connectivity/proxy error cases
                var parsed: any;
                try {
                    parsed = JSON.parse(request.responseText);
                } catch (e) {
                    // Set sensible default for the success calls below to
                    // behave as expected down the chain
                    parsed = {};
                }

                if (window.XDomainRequest)
                    success(parsed, request, e);
                else if (e.currentTarget.readyState == 4)
                    success(parsed, request, e);
                return;
            };
            request.onerror = function(e: ProgressEvent) {
                if (request.status && request.status >= 200 && 
                    request.status < 500 && request.responseText)

                    request.onload(<ProgressEvent>e);
                else
                    error(request, e);
            };
            request.ontimeout  = function() {}; // Prevent IE from aborting
            request.onprogress = function() {}; // ''
            request.onabort = function() {
                // We want to retry the call: in some cases IE fails
                // to finish requests
                if (retry > 3) error(request, null);
                else           this.request(method, path, data, success, error, retry + 1);
            }.bind(this);

            request.send(JSON.stringify(data));
        }

        /**
         * SetupForm setups a new form and embed the credit cards fields
         * to it, and returns the created card form
         * @param {HTMLElement} form
         * @param {callback} success
         * @param {callback} error
         * @return {CardForm}
         */
        public setupForm(form: HTMLElement, options: CardFieldOptions | ((form: CardForm) => void),
            success: ((form: CardForm) => void) | ((err: Exception) => void),
            error?:   (err: Exception) => void): CardForm {

            if (!this.projectID)
                throw new Exception("default", "You must instanciate ProcessOut.js with a valid project ID in order to use ProcessOut's hosted forms.");

            if (!form)
                throw new Exception("default", "The provided form element wasn't set. Make sure to provide setupForm with a valid form element.");

            if (typeof options == "function")
                return new CardForm(this, form).setup(
                    new CardFieldOptions(""), <any>options, <any>success);

            return new CardForm(this, form).setup(options, <any>success, error);
        }

        /**
         * Tokenize takes the credit card object and creates a ProcessOut
         * token that can be sent to your server and used to charge your
         * customer
         * A CardForm may also be provided instead of a card if the fields
         * are hosted by ProcessOut
         * @param  {Card | CardForm | ApplePay | PaymentToken} card
         * @param  {any} data
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
        public tokenize(val: Card | CardForm | ApplePay | PaymentToken, data: any,
                        success: (token: string)  => void,
                        error:   (err: Exception) => void): void {

            if (val instanceof Card)
                return this.tokenizeCard(<Card>val, data, success, error);
            if (val instanceof CardForm)
                return this.tokenizeForm(<CardForm>val, data, success, error);
            if (val instanceof PaymentToken)
                return this.tokenizePaymentToken(<PaymentToken>val, success, error);
            if (val instanceof ApplePay)
                return (<ApplePay>val).tokenize(data, success, error);

            throw new Exception("processout-js.invalid-type",
                "The first parameter had an unknown type/instance. The value must be an instance of either Card, CardForm or ApplePay.");
        }

        /**
         * tokenizePaymentToken takes the payment token payload
         * and encodes in base64. Then it creates a ProcessOut
         * token that can be sent to your server and used to charge your
         * customer
         * @param  {PaymentToken} token
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
         protected tokenizePaymentToken(token: PaymentToken,
                                        success: (token: string) => void,
                                        error:   (err: Exception) => void): void {

            let data = {}
            const tokenType = token.getTokenType();
            
            switch(tokenType) {
                case TokenType.GooglePay:
                    let encodedPayload = btoa(JSON.stringify(token.getPayload()));

                    data = {
                        token_type: tokenType,
                        payment_token: encodedPayload
                    };
                    break;
            }
            
            // and send it
            this.apiRequest("post", "cards", data, function(data: any,
                req: XMLHttpRequest, e: Event): void {

                if (!data.success) {
                    error(new Exception(data.error_type, data.message));
                    return
                }

                success(data.card.id);
            }, function(req: XMLHttpRequest, e: Event): void {
                error(new Exception("processout-js.network-issue"));
            });
        }    

        /**
         * TokenizeCard takes the credit card object and creates a ProcessOut
         * token that can be sent to your server and used to charge your
         * customer
         * @param  {Card | CardForm} card
         * @param  {any} data
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
        protected tokenizeCard(card: Card, data: any,
            success: (token: string) => void,
            error:   (err: Exception) => void): void {

            // Let's first validate the card
            var err = card.validate();
            if (err) {
                error(err);
                return;
            }

            if (!data)           data = {};
            if (!data.contact)   data.contact = {};

            data = this.injectDeviceData(data);

            // fill up the request
            data.number    = card.getNumber();
            data.exp_month = card.getExpiry().getMonth().toString();
            data.exp_year  = card.getExpiry().getYear().toString();
            data.cvc2      = card.getCVC();

            // and send it
            this.apiRequest("post", "cards", data, function(data: any,
                req: XMLHttpRequest, e: Event): void {

                if (!data.success) {
                    error(new Exception(data.error_type, data.message));
                    return
                }

                success(data.card.id);
            }, function(req: XMLHttpRequest, e: Event): void {
                error(new Exception("processout-js.network-issue"));
            });
        }

        protected injectDeviceData(data: any): any {
            var device = {};
            // Flag the device with appropriate data
            device["request_origin"] = "web";

            if (screen.colorDepth)
                device["app_color_depth"] = Number(screen.colorDepth);
            var language = navigator.language || (<any>navigator).userLanguage;
            if (language)
                device["app_language"] = language;
            if (screen.height)
                device["app_screen_height"] = screen.height;
            if (screen.width)
                device["app_screen_width"] = screen.width;
            device["time_zone_offset"] = Number(new Date().getTimezoneOffset());
            if (window.navigator)
                device["app_java_enabled"] = window.navigator.javaEnabled();

            data["device"] = device;

            // Legacy: also inject at root level
            Object.keys(device).forEach(function(key) {
                data[key] = device[key];
            });

            return data;
        }

        /**
         * TokenizeForm takes the card form and tokenizes the card
         * @param  {CardForm} form
         * @param  {any} data
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
        protected tokenizeForm(form: CardForm, data: any,
            success: (token: string)  => void,
            error:   (err: Exception) => void): void {

            form.validate(function() {
                form.tokenize(data, success, error);
            }.bind(this), error);
        }

        /**
         * setupFormCVC setups a new form and embed the CVC field
         * to it, and returns the created card form
         * @param {HTMLElement} form
         * @param {callback} success
         * @param {callback} error
         * @param {callback?} eventCallback
         * @return {CardForm}
         */
        public setupFormCVC(form: HTMLElement, options: CardFieldOptions | ((form: CardForm) => void),
            success: ((form: CardForm) => void) | ((err: Exception) => void),
            error?:   (err: Exception) => void): CardForm {

            if (typeof options == "function")
                return new CardForm(this, form).setupCVC(
                    new CardFieldOptions(""), <any>options, <any>success);

            return new CardForm(this, form).setupCVC(options, <any>success, error);
        }

        /**
         * RefreshCVC updates the given card CVC code so that it can be used
         * to process the next payment.
         * A CardForm may also be provided instead of a string if the CVC
         * field is hosted by ProcessOut
         * @param  {string} cardUID
         * @param  {string | CardForm} card
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
        public refreshCVC(cardUID: string, val: string | CardForm,
            success: (token: string)  => void,
            error:   (err: Exception) => void): void {

            if (val instanceof CardForm)
                return this.refreshCVCForm(cardUID, <CardForm>val, 
                    success, error);

            return this.refreshCVCString(cardUID, <string>val, success, error);
        }

        /**
         * refreshCVCForm refreshes the card CVC using the given form to 
         * fetch the CVC value
         * @param  {string}   cardUID
         * @param  {CardForm} form
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
        protected refreshCVCForm(cardUID: string, form: CardForm,
            success: (token: string)  => void,
            error:   (err: Exception) => void): void {

            form.validate(function() {
                form.refreshCVC(cardUID, success, error);
            }.bind(this), error);
        }

        /**
         * refreshCVCString refreshes the given card CVC
         * @param  {string}   cardUID
         * @param  {string}   cvc
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
        protected refreshCVCString(cardUID: string, cvc: string,
            success: (token: string) => void,
            error:   (err: Exception) => void): void {

            // Let's first validate the CVC
            var err = Card.validateCVC(cvc);
            if (err) {
                error(err);
                return;
            }

            this.apiRequest("put", `cards/${cardUID}`, {
                "cvc": cvc
            }, function(data: any, req: XMLHttpRequest, e: Event): void {
                if (!data.success) {
                    error(new Exception("card.invalid"));
                    return
                }

                success(data.card.id);
            }, function(req: XMLHttpRequest, e: Event): void {
                error(new Exception("processout-js.network-issue"));
            });
        }

        /**
         * Create a new modal
         * @param  {string|object}   url
         * @param  {callback} onReady
         * @param  {callback} onError
         * @return {void}
         */
        public newModal(options: string|any, 
            onReady?: (modal: Modal)     => void,
            onError?: (err:   Exception) => void): void {

            var url = '';
            if (typeof(options) == 'object') {
                url = options.url;
                onReady = options.onReady;
                onError = options.onError;

                // Let's try to build the URL ourselves
                if (!url) {
                    url = this.endpoint("checkout", `/${this.getProjectID()}/oneoff`+
                        `?amount=${encodeURIComponent(options.amount)}`+
                        `&currency=${encodeURIComponent(options.currency)}`+
                        `&name=${encodeURIComponent(options.name)}`);

                    if (options.metadata && typeof options.metadata == 'object') {
                        for (var i in options.metadata) {
                            if (!options.metadata.hasOwnProperty(i))
                                continue;

                            url += `&metadata[${i}]=${encodeURIComponent(options.metadata[i])}`;
                        }
                    }
                }
            }

            var uniqId = Math.random().toString(36).substr(2, 9);
            var iframe = document.createElement('iframe');
            iframe.className = "processout-iframe";
            iframe.setAttribute("id", "processout-iframe-" + uniqId);
            iframe.setAttribute("src", url);
            iframe.setAttribute("style", "position: fixed; top: 0; left: 0; background: none; z-index: 9999999;");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowtransparency", "1");

            // Hide and add our iframe to the DOM
            iframe.style.display = "none";

            var iframeError = setTimeout(function() {
                if (typeof(onError) === typeof(Function))
                    onError(new Exception("processout-js.modal.unavailable"));
            }, this.timeout);
            iframe.onload = function() {
                clearTimeout(iframeError);
                if (typeof(onReady) === typeof(Function))
                    onReady(new Modal(this, iframe, uniqId));
            }.bind(this);

            document.body.appendChild(iframe);
        }

        /**
         * FetchGatewayConfigurations fetches the gateway configurations enabled
         * on the project matching the given configuration. Config supports
         * the following options:
         * - {bool} alternativePaymentMethods: matches APMs
         * - {bool} tokenization:              matches gateways supporting tokenization
         * @param {any} config
         * @param {callback} success 
         * @param {callback} error 
         */
        public fetchGatewayConfigurations(
            config:  any,
            success: (confs: any[])     => void,
            error:   (err:   Exception) => void): void {

            if (!config) config = {};

            if (!config.invoiceID && (!config.customerID !== !config.tokenID))
                throw new Exception("processout-js.missing-resource-id");

            this.apiRequest("GET", "gateway-configurations", {
                "filter":                   config.filter,
                "expand_merchant_accounts": "true"
            },
                function(data: any): void {
                    if (!data.success) {
                        error(new Exception(data.error_type, data.message));
                        return;
                    }

                    // We want to inject some helpers in our gateway confs
                    var confs = [];
                    for (var conf of data.gateway_configurations) {
                        conf.getInvoiceActionURL = this.buildGetInvoiceActionURL(config.invoiceID, conf);
                        conf.handleInvoiceAction = this.buildHandleInvoiceAction(config.invoiceID, conf);
                        conf.hookForInvoice = this.buildConfHookForInvoice(conf);

                        conf.getCustomerTokenActionURL = this.buildGetCustomerTokenActionURL(config.customerID, config.tokenID, conf);
                        conf.handleCustomerTokenAction = this.buildHandleCustomerTokenAction(config.customerID, config.tokenID, conf);
                        conf.hookForCustomerToken = this.buildConfHookForCustomerToken(conf);
                        confs.push(conf);
                    }
                    success(confs);
                }.bind(this), function(req: XMLHttpRequest, e: Event): void {
                    error(new Exception("processout-js.network-issue"));
                });
        }

        /**
         * BuildGetInvoiceActionURL returns the invoice action URL
         * @param {string} invoiceID
         * @param {any|string} gatewayConf 
         * @return {string}
         */
        public getInvoiceActionURL(
            invoiceID:      string,
            gatewayConf:    any,
            additionalData: any
        ): string {
            if (!additionalData) additionalData = {};

            var gatewayConfID = gatewayConf;
            if (gatewayConf && gatewayConf.id) {
                gatewayConfID = gatewayConf.id;
            }

            if (!invoiceID) {
                throw new Exception("processout-js.missing-resource-id", "An Invoice Action was requested, but the Invoice ID was missing. Make sure you didn't rather want to call `customerToken` helpers on the gateway configuration instead of `invoice` ones.")
            }

            var suffix = "?"
            for (var key in additionalData) {
                suffix += `additional_data[${key}]=${encodeURI(additionalData[key])}&`;
            }

            return this.endpoint("checkout", `/${this.getProjectID()}/${invoiceID}/redirect/${gatewayConfID}${suffix.substring(0, suffix.length - 1)}`);
        }

        /**
         * HandleInvoiceAction handles the invoice action for the given invoice
         * ID and gateway configuration. This creates a new tab, iFrame or
         * window depending on the gateway used
         * @param {string} invoiceID
         * @param {any|string} gatewayConf
         * @param {callback} tokenized 
         * @param {callback} tokenError 
         * @return {ActionHandler}
         */
        public handleInvoiceAction(
            invoiceID:   string,
            gatewayConf: any,
            tokenized:   (token: string)    => void,
            tokenError:  (err:   Exception) => void
        ): ActionHandler {

            return this.handleInvoiceActionAdditionalData(invoiceID, gatewayConf, {}, tokenized, tokenError);
        }

        /**
         * HandleInvoiceActionAdditionalData behaves almost the same as
         * handleInvoiceAction, except it also sends back some additional data
         * that can be used to improve the APM experience. For example, it also
         * for preselection of an issuing bank on iDeal on Adyen
         * @param {string} invoiceID
         * @param {any|string} gatewayConf
         * @param {object}   additionalData
         * @param {callback} tokenized 
         * @param {callback} tokenError 
         * @return {ActionHandler}
         */
        public handleInvoiceActionAdditionalData(
            invoiceID:   string,
            gatewayConf: any,
            additionalData: any,
            tokenized:   (token: string)    => void,
            tokenError:  (err:   Exception) => void
        ): ActionHandler {
            var gatewayName = null;
            var gatewayLogo = null;
            if (gatewayConf && gatewayConf.id && gatewayConf.gateway) {
                gatewayName = gatewayConf.gateway.name;
                gatewayLogo = gatewayConf.gateway.logo_url;
            }

            var options = new ActionHandlerOptions(gatewayName, gatewayLogo);
            return this.handleAction(this.getInvoiceActionURL(invoiceID, gatewayConf, additionalData), 
                tokenized, tokenError, options);
        }

        protected buildGetInvoiceActionURL(
            invoiceID:   string, 
            gatewayConf: any
        ): () => string {

            return function(): string {
                return this.getInvoiceActionURL(invoiceID, gatewayConf);
            }.bind(this);
        }

        protected buildHandleInvoiceAction(
            invoiceID:   string, 
            gatewayConf: any
        ): (
            tokenized:   (token: string)    => void,
            tokenError:  (err:   Exception) => void
        ) => ActionHandler {

            return function(
                tokenized:   (token: string)    => void,
                tokenError:  (err:   Exception) => void
            ): ActionHandler {

                return this.handleInvoiceAction(invoiceID, gatewayConf, tokenized, tokenError);
            }.bind(this);
        }

        protected buildConfHookForInvoice(
            gatewayConf: any
        ): (
            el:      HTMLElement, 
            success: (token: string)    => void, 
            error:   (err:   Exception) => void
        ) => void {

            return function(
                el:         HTMLElement,
                tokenized:  (token: string) => void,
                tokenError: (err: Exception) => void) {

                el.addEventListener("click", function(e) {
                    // Prevent from doing the default redirection
                    e.preventDefault();

                    gatewayConf.handleInvoiceAction(tokenized, tokenError);
                    return false;
                }.bind(this));
            }.bind(this);
        }

        /**
         * getCustomerTokenActionURL returns the customer token action URL
         * @param {string} customerID
         * @param {string} tokenID
         * @param {any|string} gatewayConf 
         * @return {string}
         */
        public getCustomerTokenActionURL(
            customerID:  string,
            tokenID:     string,
            gatewayConf: any
        ): string {
            var gatewayConfID = gatewayConf;
            if (gatewayConf && gatewayConf.id) {
                gatewayConfID = gatewayConf.id;
            }

            if (!customerID || !tokenID) {
                throw new Exception("processout-js.missing-resource-id", "A Customer Token Action was requested, but a customer ID or a token ID was missing. Make sure you didn't rather want to call `invoice` helpers on the gateway configuration instead of `customerToken` ones.")
            }

            return this.endpoint("checkout", `/${this.getProjectID()}/${customerID}/${tokenID}/redirect/${gatewayConfID}`);
        }

        /**
         * HandleCustomerTokenAction handles the tokenization action for the 
         * given customer token ID and gateway configuration. This creates a new 
         * tab, iFrame or window depending on the gateway used
         * @param {string} customerID
         * @param {string} tokenID
         * @param {any|string} gatewayConf
         * @param {callback} tokenized 
         * @param {callback} tokenError 
         * @return {ActionHandler}
         */
        public handleCustomerTokenAction(
            customerID:  string,
            tokenID:     string,
            gatewayConf: any,
            tokenized:   (token: string)    => void,
            tokenError:  (err:   Exception) => void
        ): ActionHandler {
            var gatewayName = null;
            var gatewayLogo = null;
            if (gatewayConf && gatewayConf.id && gatewayConf.gateway) {
                gatewayName = gatewayConf.gateway.name;
                gatewayLogo = gatewayConf.gateway.logo_url;
            }

            var options = new ActionHandlerOptions(gatewayName, gatewayLogo);
            return this.handleAction(this.getCustomerTokenActionURL(customerID, tokenID, gatewayConf), 
                tokenized, tokenError, options);
        }

        protected buildGetCustomerTokenActionURL(
            customerID:  string, 
            tokenID:     string,
            gatewayConf: any
        ): () => string {

            return function(): string {
                return this.getCustomerTokenActionURL(customerID, tokenID, gatewayConf);
            }.bind(this);
        }

        protected buildHandleCustomerTokenAction(
            customerID:  string,
            tokenID:     string,
            gatewayConf: any
        ): (
            tokenized:   (token: string)    => void,
            tokenError:  (err:   Exception) => void
        ) => ActionHandler {

            return function(
                tokenized:   (token: string)    => void,
                tokenError:  (err:   Exception) => void
            ): ActionHandler {

                return this.handleCustomerTokenAction(customerID, tokenID, gatewayConf, tokenized, tokenError);
            }.bind(this);
        }

        protected buildConfHookForCustomerToken(
            gatewayConf: any
        ): (
            el:      HTMLElement, 
            success: (token: string)    => void, 
            error:   (err:   Exception) => void
        ) => void {

            return function(
                el:         HTMLElement,
                tokenized:  (token: string) => void,
                tokenError: (err: Exception) => void) {

                el.addEventListener("click", function(e) {
                    // Prevent from doing the default redirection
                    e.preventDefault();

                    gatewayConf.handleCustomerTokenAction(tokenized, tokenError);
                    return false;
                }.bind(this));
            }.bind(this);
        }

        /**
         * HandleAction handles the action needed to be performed by the
         * customer for the given gateway configuration
         * @param  {string}   url
         * @param  {callback} success
         * @param  {callback} error
         * @param  {ActionHandlerOptions?} options
         * @return {ActionHandler}
         */
        public handleAction(
            url:     string,
            success: (data:  any)       => void,
            error:   (err:   Exception) => void,
            options?: ActionHandlerOptions): ActionHandler {

            var handler = new ActionHandler(this, options);
            return handler.handle(url, success, error);
        }

        /**
         * MakeCardToken finishes a Customer Token using the card ID, Card Object
         * or CardForm object as the source. If any customer action is required,
         * makeCardToken handles them automatically, such as authentication for SCA
         * @param {string|Card|CardForm} val
         * @param {string} customerID
         * @param {string} customerTokenID 
         * @param {any} options 
         * @param {callback} success 
         * @param {callback} error
         */
        public makeCardToken(val: string|Card|CardForm, customerID: string, customerTokenID: string,
            options: any, 
            success:  (data: any)       => void, 
            error:    (err:  Exception) => void): void {

            if ((val instanceof Card) || (val instanceof CardForm))
                return this.tokenize(val, options, function(token: string): void {
                    return this.makeCardTokenFromCardID(token, customerID, customerTokenID, options, success, error);
                }.bind(this), error);

            return this.makeCardTokenFromCardID(<string>val, customerID, customerTokenID, options, success, error);
        }

        protected makeCardTokenFromCardID(cardID: string, customerID: string, customerTokenID: string, options: any, 
            success:  (data: any)       => void, 
            error:    (err:  Exception) => void): void {

            this.handleCardActions("PUT", `customers/${customerID}/tokens/${customerTokenID}`, customerTokenID, 
                cardID, options, success, error);
        }

        /**
         * MakeCardPayment makes a full card payment, handling any required
         * customer action such as authentication for SCA (like 3DS 1 or 2)
         * @param {string} invoiceID
         * @param {string} cardID 
         * @param {any} options 
         * @param {callback} success 
         * @param {callback} error
         */
        public makeCardPayment(invoiceID: string, cardID: string,
            options: any,
            success:  (data: any)       => void, 
            error:    (err:  Exception) => void): void {

            this.handleCardActions("POST", `invoices/${invoiceID}/capture`, invoiceID, 
                cardID, options, success, error);
        }

        /**
         * makeIncrementalAuthorizationPayment requests an authorization against
         * a specified invoice and marks it as an incremental invoice
         * @param {string} invoiceID
         * @param {string} cardID
         * @param {any} options
         * @param {callback} success
         * @param {callback} error
         */
        public makeIncrementalAuthorizationPayment(invoiceID: string, cardID: string,
            options: any,
            success:  (data: any)       => void,
            error:    (err:  Exception) => void): void {

            if (!options) options = {};
            options.incremental = true;
            this.handleCardActions("POST", `invoices/${invoiceID}/authorize`, invoiceID,
                cardID, options, success, error);
        }

        /**
         * incrementAuthorizationAmount increments the authorization of an applicable
         * invoice by a given amount
         * @param {string} invoiceID
         * @param {number} amount
         * @param {callback} success
         * @param {callback} error
         */
        public incrementAuthorizationAmount(invoiceID: string, amount: number,
            success:  (data: any)       => void,
            error:    (err:  Exception) => void): void {

            this.apiRequest(
                "POST",
                `invoices/${invoiceID}/increment_authorization`,
                { "amount": amount },
                function(data: any, req: XMLHttpRequest, e: Event): void {
                    if (!data.success) {
                        error(new Exception("request.validation.error"));
                        return
                    }

                    success(data);
                }, function(req: XMLHttpRequest, e: Event): void {
                    error(new Exception("processout-js.network-issue"));
                });
        }

        protected handleCardActions(method: string, endpoint: string, 
            resourceID: string, cardID: string,
            options: any,
            success:  (data: any)       => void, 
            error:    (err:  Exception) => void): void {

            if (!options) options = {};

            var source = cardID;
            if (options.gatewayRequestSource)
                source = options.gatewayRequestSource;

            var payload = <any>{
                "authorize_only":  options.authorize_only,
                "capture_amount":  options.capture_amount,
                "auto_capture_at": options.auto_capture_at,
                "source":          source,

                "enable_three_d_s_2": true,

                "verify":          options.verify,
                "verify_metadata": options.verify_metadata,
                "set_default":     options.set_default,
                "incremental":     options.incremental
            };
            payload = this.injectDeviceData(payload);

            if (options.idempotency_key) {
                // As we're executing this multiple times, we need to keep
                // track of the executing number
                if (!options.iterationNumber) options.iterationNumber = 1;
                payload.idempotency_key = `${options.idempotency_key}-${options.iterationNumber}`;
                options.iterationNumber++;
            }

            this.apiRequest(method, endpoint, payload, function(data: any): void {
                if (!data.success) {
                    error(new Exception(data.error_type, data.message));
                    return;
                }

                if (!data.customer_action) {
                    success(resourceID);
                    return;
                }

                var nextStep = function(data: any): void {
                    options.gatewayRequestSource = data;
                    this.handleCardActions(method, endpoint, resourceID, cardID, options, success, error);
                }.bind(this);

                switch (data.customer_action.type) {
                case "url":
                    // This is for 3DS1
                    this.handleAction(data.customer_action.value, function(data: any): void {
                        options.gatewayRequestSource = null;
                        this.handleCardActions(method, endpoint, resourceID, cardID, options, success, error);
                    }.bind(this), error, new ActionHandlerOptions(ActionHandlerOptions.ThreeDSChallengeFlow));
                    break;

                case "fingerprint":
                    this.handleAction(data.customer_action.value, nextStep, function(err) {
                        var gReq = new GatewayRequest();
                        gReq.url = data.customer_action.value;
                        gReq.method = "POST";
                        gReq.headers = {
                            "Content-Type": "application/x-www-form-urlencoded"
                        };
                        // We're encoding the timeout in a custom field in the
                        // body so that internal services can detect when
                        // the fingerprinting has timed out. We're using
                        // the camelCase convention for this field as it is
                        // what drives the 3DS specs
                        gReq.body = `threeDSMethodData={"threeDS2FingerprintTimeout":true}`;
                        nextStep(gReq.token());
                    }, new ActionHandlerOptions(ActionHandlerOptions.ThreeDSFingerprintFlow));
                    break;

                case "redirect":
                    // This is for 3DS2
                    this.handleAction(data.customer_action.value, nextStep, error, 
                        new ActionHandlerOptions(ActionHandlerOptions.ThreeDSChallengeFlow));
                    break;

                default:
                    error(new Exception("processout-js.wrong-type-for-action", 
                        `The customer action type ${data.customer_action.type} is not supported.`));
                    break;
                }
            }.bind(this), function(req: XMLHttpRequest, e: Event): void {
                error(new Exception("processout-js.network-issue"));
            });
        }
    }
}
