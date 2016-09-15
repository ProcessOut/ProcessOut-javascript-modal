/// <reference path="../references.ts" />

/**
 * ProcessOut module/namespace
 */
module ProcessOut {

    /**
     * ProcessOut main class
     */
    export class ProcessOut {

        /**
         * Project ID
         * @type {string}
         */
        projectID: string;

        /**
         * Timeout before considering the modal could not be loaded, in ms
         * @type {Number}
         */
        timeout = 10000;

        /**
        * Debug mode (will for instance load the sandboxed libraries of the
        * gateways instead of the live ones)
        * @type {string}
        */
        debug = false;

        /**
         * ProcessOut constructor
         * @param  {string} projectID ProcessOut project ID
         */
        constructor(projectID: string) {
            // We want to make sure ProcessOut.js is loaded from ProcessOut CDN.
            var scripts = document.getElementsByTagName("script");
            var ok = false;
            for (var i = 0; i < scripts.length; i++) {
                if (/^https?:\/\/cdn\.processout\.((com)|(ninja)|(dev))\//.test(
                    scripts[i].getAttribute("src"))) {

                    ok = true;
                }
            }

            if (!ok) {
                throw new Error("ProcessOut.js was not loaded from ProcessOut CDN. Please do not host ProcessOut.js yourself but rather use ProcessOut CDN: https://cdn.processout.com/processout-min.js")
            }

            this.projectID = projectID;

            if (this.projectID == "") {
                console.log("No project ID was specified, skipping setup.");
                return;
            }
            this.setup();
        }

        /**
         * Get the ProcessOut endpoint of the given subdomain
         * @param  {string} subdomain
         * @param  {string} path
         * @return {string}
         */
        endpoint(subdomain: string, path: string): string {
            return `https://${subdomain}.processout.com${path}`;
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
        apiRequest(method: string, path: string, data,
            success: (data: any, code: number, req: XMLHttpRequest) => void,
            error: (code: number, req: XMLHttpRequest) => void): void {

            if (method != "get")
                data = JSON.stringify(data);
            else {
                path += "?";
                for (var key in data) {
                    path += `${key}=${encodeURIComponent(data[key])}&`;
                }
            }

            var request = new XMLHttpRequest();
            request.open(method, this.endpoint("api", path), true);
            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("API-Version", "1.1.0.0");
            request.setRequestHeader("Authorization", "Basic " + btoa(this.projectID+":"));

            request.onload = function() {
                if (request.status >= 200 && request.status < 300) {
                    success(JSON.parse(request.responseText), request.status, request);
                    return;
                }

                error(request.status, request);
            };
            request.onerror = function() {
                error(request.status, request);
            };

            request.send(data);
        }

        /**
         * Setup the gateways enabled on the current project
         * @return {void}
         */
        setup(): void {
            this.apiRequest("get", `/gateways`, {},
            function(data, code, jqxhr) {
                if (!data.success) {
                    throw new Error(data.message);
                }

                for (var gateway of data.gateways) {
                    var g = Gateways.Handler.buildGateway(
                        this, gateway, "", Flow.None);
                    console.log(g);
                    g.setup();
                }
            }, function() {
                throw new Error("Could not load project's gateways. Are you sure your project ID is valid?");
            });
        }

        /**
         * Create a new modal
         * @param  {string}   url
         * @param  {callback} success
         * @param  {callback} error
         * @return {void}
         */
        newModal(url: string, success: (modal: Modal) => void,
            error: (err: Error) => void): void {

            var uniqId = Math.random().toString(36).substr(2, 9);
            var iframe = document.createElement('iframe');
            iframe.className = "processout-iframe";
            iframe.setAttribute("id", "processout-iframe-" + uniqId);
            iframe.setAttribute("src", url);
            iframe.setAttribute("style", "position: fixed; top: 0; left: 0; background: none;"
                    // We need to use translateZ instead of z-index, otherwise
                    // z-index might not work on some mobiles
                    +`-webkit-transform:translateZ(1px);
                    -moz-transform:translateZ(1px);
                    -o-transform:translateZ(1px);
                    transform:translateZ(1px);`);
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowtransparency", "1");

            // Hide and add our iframe to the DOM
            iframe.style.display = "none";

            var t = this;
            var iframeError = setTimeout(function() {
                if (typeof(error) === typeof(Function))
                    error(<Error>{
                        code:    ErrorCode.ProcessOutUnavailable,
                        message: "Could not properly load the modal."
                    });
            }, this.timeout);
            iframe.onload = function() {
                clearTimeout(iframeError);
                if (typeof(success) === typeof(Function))
                    success(new Modal(t, iframe, uniqId));
            };

            document.body.appendChild(iframe);
        }

    }

}
