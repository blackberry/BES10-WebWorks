/*

 Copyright 2014 BlackBerry Ltd. 

 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var _ID = "com.blackberry.ui.cover",
    _self = {},
    exec = cordova.require("cordova/exec"),
    events = ["entercover", "exitcover"];

events.map(function (eventName) {
    var channel = cordova.addDocumentEventHandler(eventName),
        success = function (data) {
            channel.fire(data);
        },
        fail = function (error) {
            console.log("Error initializing " + eventName + " listener: ", error);
        };
    channel.onHasSubscribersChange = function () {
        if (this.numHandlers === 1) {
            exec(success, fail, _ID, "startEvent", {eventName: eventName});
        } else if (this.numHandlers === 0) {
            exec(function () {}, function () {}, _ID, "stopEvent", {eventName: eventName});
        }
    };
});

_self.resetCover = function (name, success, fail) {
    exec(success, fail, _ID, "resetCover", { "name": name});
};

_self.updateCovers = function (covers, success, fail) {
    exec(success, fail, _ID, "updateCovers", {"covers": covers});
};

_self.getCoverSizes = function (success, fail) {
    exec(success, fail, _ID, "coverSizes");
};

Object.defineProperty(_self, "TYPE_IMAGE", {"value": "file", "writable": false});
Object.defineProperty(_self, "TYPE_SNAPSHOT", {"value": "snapshot", "writable": false});
Object.defineProperty(_self, "TRANSITION_FADE", {"value": "fade", "writable": false});
Object.defineProperty(_self, "TRANSITION_NONE", {"value": "none", "writable": false});
Object.defineProperty(_self, "TRANSITION_DEFAULT", {"value": "default", "writable": false});
Object.defineProperty(_self, "TRANSITION_SLIDE", {"value": "slide", "writable": false});

_self.Label = function (label, size, wrap) {
    this.label = label;
    this.size = size;
    this.wrap = typeof wrap === 'undefined' ? true : !!wrap; 
};

_self.Cover = function (name, type) {
    var coverType = type;
    this.name = name;
    this.__defineGetter__('type', function () {
        return coverType;
    });
    this.__defineSetter__('type', function (val) {
        coverType = val;
        if (val === 'file') {
            delete this.capture;
            this.path = '';
        } else if (val === 'snapshot') {
            delete this.file;
            this.capture = {
                x: 0, 
                y: 0,
                width: 100,
                height: 200
            };
        }
    });
    this.type = coverType;
    this.text = [];
    this.transition = 'default';
    this.badges = true;
};

module.exports = _self;
