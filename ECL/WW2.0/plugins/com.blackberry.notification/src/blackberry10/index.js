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
var _config = require("./../../lib/config"),
    _notification = qnx.webplatform.notification;

module.exports = {
    notify: function (success, fail, sourceArgs, env) {
        var result = new PluginResult(sourceArgs, env),
            args = {},
            key;

        for (key in sourceArgs) {
            if (sourceArgs.hasOwnProperty(key)) {
                args[key] = JSON.parse(decodeURIComponent(sourceArgs[key]));
            }
        }

        // Set the target if not provided in the options but appears in the config.xml
        // Set targetAction to default when there is target but no action.
        if (!args.options.target || args.options.target.length === 0) {
            for (key in _config['invoke-target']) {
                if (_config['invoke-target'].hasOwnProperty(key)) {
                    if (_config['invoke-target'][key].type.toLowerCase() === "application") {
                        args.options.target = _config['invoke-target'][key]["@"].id;
                        break;
                    }
                }
            }
        }

        if ((args.options.target && args.options.target.length > 0) &&
            (!args.options.targetAction || args.options.targetAction.length === 0)) {
            args.options.targetAction = "bb.action.OPEN";
        }

        // Calling delete with tag before writing new notification
        // This ensures new notification will override the old one.
        _notification.remove(args.options.tag);
        _notification.notify(args, function (e) {
            if (e) {
                result.callbackError(e);
            } else {
                result.callbackOk();
            }
        });

        result.noResult(true);
    },

    remove: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            tag;

        if (!args || !args.tag) {
            result.error("No tag provided for notification removal");
        } else {
            tag = JSON.parse(decodeURIComponent(args.tag));
            _notification.remove(tag);
            result.ok();
        }
    }
};
