/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var toast,
    _overlayWebView;

function show(success, fail, args, env) {
    var result = new PluginResult(args, env),
        message = args.message !== 'undefined' ? JSON.parse(decodeURIComponent(args.message)) : undefined,
        options = args.options !== 'undefined' ? JSON.parse(decodeURIComponent(args.options)) : {};

    options.dismissHandler = function (toastId) {
        result.callbackOk({reason: "dismissed", toastId: toastId}, false);
    };
    options.callbackHandler = function (toastId) {
        result.callbackOk({reason: "buttonClicked", toastId: toastId}, true);
    };

    // Return the toastId to the client from WP created toast
    result.ok({reason: "created", toastId: _overlayWebView.toast.show(message, options)}, true);
}

toast = {
    show : show
};

qnx.webplatform.getController().addEventListener('overlayWebView.initialized', function (webview) {
    _overlayWebView = webview;
});

module.exports = toast;
