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

var _appEvents = require("./../../lib/events/applicationEvents"),
    _listeners = {},
    _actionMap = {
        entercover: {
            event: "windowCoverEnter",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        },
        exitcover: {
            event: "windowCoverExit",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        }
    };



module.exports = {

    startEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            systemEvent = _actionMap[eventName].event,
            listener = _actionMap[eventName].trigger.bind(null, result);

        if (!_listeners[eventName]) {
            _listeners[eventName] = {};
        }

        if (_listeners[eventName][env.webview.id]) {
            //TODO: Change back to erroring out after reset is implemented
            //result.error("Underlying listener for " + eventName + " already running for webview " + env.webview.id);
            _appEvents.removeEventListener(systemEvent, _listeners[eventName][env.webview.id]);
        }

        _appEvents.addEventListener(systemEvent, listener);
        _listeners[eventName][env.webview.id] = listener;
        result.noResult(true);
    },

    stopEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            listener = _listeners[eventName][env.webview.id],
            systemEvent = _actionMap[eventName].event;

        if (!listener) {
            result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        } else {
            _appEvents.removeEventListener(systemEvent, listener);
            delete _listeners[eventName][env.webview.id];
            result.noResult(false);
        }
    },

    resetCover: function (success, fail, args, env) {
        var app = window.qnx.webplatform.getApplication(),
            name = JSON.parse(decodeURIComponent(args.name)),
            reset = {};
        try {
            if (app.updateCovers) {
                reset[name] = { cover: "reset" };
                app.updateCovers(reset);
            } else {
                app.updateCover({ cover: "reset"});
            }
            success();
        } catch (e) {
            console.log(e);
            fail("Unable to reset cover");
        }
    },

    coverSizes: function (success, fail, args, env) {
        var app = window.qnx.webplatform.getApplication(),
            coverSizes;
        try {
            if (app.coverSizes) {
                coverSizes = (typeof app.coverSizes === "string") ? JSON.parse(app.coverSizes) : app.coverSizes;
            } else {
                coverSizes = { fullSize: (typeof app.coverSize === 'string') ? JSON.parse(app.coverSize) : app.coverSize };
            }
            success(coverSizes);
        } catch (e) {
            console.log(e);
            fail("Unable to get coverSize");
        }
    },

    updateCovers: function (success, fail, args, env) {
        var i,
            translatedCovers = {},
            app = window.qnx.webplatform.getApplication(),
            covers = JSON.parse(decodeURIComponent(args.covers));
        for (i = 0; i < covers.length; i++) {
            translatedCovers[covers[i].name] = {
                cover: {
                    type: covers[i].type
                },
                text: covers[i].text,
                transition: covers[i].transition,
                badges: covers[i].badges
            };
            if (covers[i].type === 'file') {
                translatedCovers[covers[i].name].cover.path = covers[i].path.replace(/file:\/\//, '');
                if (translatedCovers[covers[i].name].cover.path.indexOf('local:///') === 0) {
                    translatedCovers[covers[i].name].cover.path =                    
                        app.getEnv("HOME").replace("/data", "/app/native/") + 
                        translatedCovers[covers[i].name].cover.path.substring(9);
                }
            } else if (covers[i].type === 'snapshot') {
                translatedCovers[covers[i].name].cover.capture = covers[i].capture;
            }
        }
        try {
            if (app.updateCovers) {
                app.updateCovers(translatedCovers);
            } else {
                app.updateCover(translatedCovers.fullSize);
            }
            success();
        } catch (e) {
            console.log(e);
            fail("Unable to update cover");
        }
    }
};
