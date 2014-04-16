/*
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

var _self = {},
    exec = cordova.require("cordova/exec"),
    _ID = "com.blackberry.push",
    PushService,
    PushPayload,
    createInvokeTargetId = null,
    createAppId = null,
    noop = function () {},
    SUCCESS = 0,
    INTERNAL_ERROR = 500,
    INVALID_DEVICE_PIN = 10001,
    INVALID_PROVIDER_APPLICATION_ID = 10002,
    CHANNEL_ALREADY_DESTROYED = 10004,
    CHANNEL_ALREADY_DESTROYED_BY_PROVIDER = 10005,
    INVALID_PPG_SUBSCRIBER_STATE = 10006,
    PPG_SUBSCRIBER_NOT_FOUND = 10007,
    EXPIRED_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG = 10008,
    INVALID_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG = 10009,
    PPG_SUBSCRIBER_LIMIT_REACHED = 10010,
    INVALID_OS_VERSION_OR_DEVICE_MODEL_NUMBER = 10011,
    CHANNEL_SUSPENDED_BY_PROVIDER = 10012,
    CREATE_SESSION_NOT_DONE = 10100,
    MISSING_PPG_URL = 10102,
    PUSH_TRANSPORT_UNAVAILABLE = 10103,
    OPERATION_NOT_SUPPORTED = 10105,
    CREATE_CHANNEL_NOT_DONE = 10106,
    MISSING_PORT_FROM_PPG = 10107,
    MISSING_SUBSCRIPTION_RETURN_CODE_FROM_PPG = 10108,
    PPG_SERVER_ERROR = 10110,
    MISSING_INVOKE_TARGET_ID = 10111,
    SESSION_ALREADY_EXISTS = 10112,
    INVALID_PPG_URL = 10114,
    CREATE_CHANNEL_OPERATION = 1,
    DESTROY_CHANNEL_OPERATION = 2;

function defineReadOnlyField(obj, field, value) {
    Object.defineProperty(obj, field, {
        "value": value,
        "writable": false
    });
}

/*
 * Define methods of push.PushService
 */

PushService = function () {
};

PushService.create = function (options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback) {
    var args = { "invokeTargetId" : options.invokeTargetId || "",
                 "appId" : options.appId || "",
                 "ppgUrl" : options.ppgUrl || "" },
        createCallback = function (result) {
            if (result === SUCCESS) {
                if (simChangeCallback) {
                    exec(simChangeCallback, noop, _ID, "registerCallback", {id: "push.create.simChangeCallback"});
                }

                if (pushTransportReadyCallback) {
                    exec(pushTransportReadyCallback, noop, _ID, "registerCallback", {id: "push.create.pushTransportReadyCallback"});
                }

                if (successCallback) {
                    successCallback(new PushService());
                }
            } else {
                if (failCallback) {
                    failCallback(result);
                }

                createInvokeTargetId = null;
                createAppId = null;
            }
        };

    // Check if create() called more than once
    if (createInvokeTargetId !== null) {
        if (args.invokeTargetId !== createInvokeTargetId) {
            throw "push.PushService.create: cannot call create() multiple times with different invokeTargetId's";
        }
    }

    if (createAppId !== null) {
        if (args.appId !== createAppId) {
            throw "push.PushService.create: cannot call create() multiple times with different appId's";
        }
    }

    createInvokeTargetId = args.invokeTargetId;
    createAppId = args.appId;

    // Send command to framework to start Push service
    exec(createCallback, noop, _ID, "startService", args);
};

PushService.prototype.createChannel = function (createChannelCallback) {
    // Send command to framework to create Push channel
    exec(function (info) {
        if (createChannelCallback) {
            createChannelCallback(info.result, info.token);
        }
    }, noop, _ID, "createChannel", null);
};

PushService.prototype.destroyChannel = function (destroyChannelCallback) {
    // Send command to framework to destroy Push channel
    exec(destroyChannelCallback, noop, _ID, "destroyChannel", null);
};

PushService.prototype.extractPushPayload = function (invokeObject) {
    var args,
        payload,
        data_array,
        blob_builder,
        error_string,
        success = function (data, response) {
            payload = data;
        },
        fail = function (data, response) {
            throw data;
        };

    error_string = "push.PushService.extractPushPayload: the invoke object was invalid and no PushPayload could be extracted from it";

    if (!invokeObject.data || invokeObject.action !== "bb.action.PUSH") {
        throw error_string;
    }

    // Send command to framework to get the Push payload object
    args = { "data" : invokeObject.data };
    exec(success, fail, _ID, "extractPushPayload", args);

    if (!payload.valid) {
        throw error_string;
    }

    // Data is returned as byte array.  Convert to blob.
    if (payload.data) {
        data_array = new Uint8Array(payload.data);
        window.BlobBuilder = window.WebKitBlobBuilder || window.BlobBuilder;

        if (window.BlobBuilder) {
            blob_builder = new window.BlobBuilder();
            blob_builder.append(data_array.buffer);
            payload.data = blob_builder.getBlob("arraybuffer");
        } else {
            payload.data = new window.Blob([data_array.buffer], { "type" : "arraybuffer" });
        }
    }

    // Create push.PushPayload object and return it
    return new PushPayload(payload);
};

PushService.prototype.launchApplicationOnPush = function (shouldLaunch, launchApplicationCallback) {
    var args = { "shouldLaunch" : shouldLaunch };

    // Send command to framework to set the launch flag
    exec(launchApplicationCallback, noop, _ID, "launchApplicationOnPush", args);
};

/*
 * Define constants of push.PushService
 */
defineReadOnlyField(PushService, "SUCCESS", SUCCESS);
defineReadOnlyField(PushService, "INTERNAL_ERROR", INTERNAL_ERROR);
defineReadOnlyField(PushService, "INVALID_DEVICE_PIN", INVALID_DEVICE_PIN);
defineReadOnlyField(PushService, "INVALID_PROVIDER_APPLICATION_ID", INVALID_PROVIDER_APPLICATION_ID);
defineReadOnlyField(PushService, "CHANNEL_ALREADY_DESTROYED", CHANNEL_ALREADY_DESTROYED);
defineReadOnlyField(PushService, "CHANNEL_ALREADY_DESTROYED_BY_PROVIDER", CHANNEL_ALREADY_DESTROYED_BY_PROVIDER);
defineReadOnlyField(PushService, "INVALID_PPG_SUBSCRIBER_STATE", INVALID_PPG_SUBSCRIBER_STATE);
defineReadOnlyField(PushService, "PPG_SUBSCRIBER_NOT_FOUND", PPG_SUBSCRIBER_NOT_FOUND);
defineReadOnlyField(PushService, "EXPIRED_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG", EXPIRED_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG);
defineReadOnlyField(PushService, "INVALID_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG", INVALID_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG);
defineReadOnlyField(PushService, "PPG_SUBSCRIBER_LIMIT_REACHED", PPG_SUBSCRIBER_LIMIT_REACHED);
defineReadOnlyField(PushService, "INVALID_OS_VERSION_OR_DEVICE_MODEL_NUMBER", INVALID_OS_VERSION_OR_DEVICE_MODEL_NUMBER);
defineReadOnlyField(PushService, "CHANNEL_SUSPENDED_BY_PROVIDER", CHANNEL_SUSPENDED_BY_PROVIDER);
defineReadOnlyField(PushService, "CREATE_SESSION_NOT_DONE", CREATE_SESSION_NOT_DONE);
defineReadOnlyField(PushService, "MISSING_PPG_URL", MISSING_PPG_URL);
defineReadOnlyField(PushService, "PUSH_TRANSPORT_UNAVAILABLE", PUSH_TRANSPORT_UNAVAILABLE);
defineReadOnlyField(PushService, "OPERATION_NOT_SUPPORTED", OPERATION_NOT_SUPPORTED);
defineReadOnlyField(PushService, "CREATE_CHANNEL_NOT_DONE", CREATE_CHANNEL_NOT_DONE);
defineReadOnlyField(PushService, "MISSING_PORT_FROM_PPG", MISSING_PORT_FROM_PPG);
defineReadOnlyField(PushService, "MISSING_SUBSCRIPTION_RETURN_CODE_FROM_PPG", MISSING_SUBSCRIPTION_RETURN_CODE_FROM_PPG);
defineReadOnlyField(PushService, "PPG_SERVER_ERROR", PPG_SERVER_ERROR);
defineReadOnlyField(PushService, "MISSING_INVOKE_TARGET_ID", MISSING_INVOKE_TARGET_ID);
defineReadOnlyField(PushService, "SESSION_ALREADY_EXISTS", SESSION_ALREADY_EXISTS);
defineReadOnlyField(PushService, "INVALID_PPG_URL", INVALID_PPG_URL);
defineReadOnlyField(PushService, "CREATE_CHANNEL_OPERATION", CREATE_CHANNEL_OPERATION);
defineReadOnlyField(PushService, "DESTROY_CHANNEL_OPERATION", DESTROY_CHANNEL_OPERATION);

/*
 * Define push.PushPayload
 */
PushPayload = function (payload) {
    defineReadOnlyField(this, "data", payload.data);
    defineReadOnlyField(this, "headers", payload.headers);
    defineReadOnlyField(this, "id", payload.id);
    defineReadOnlyField(this, "isAcknowledgeRequired", payload.isAcknowledgeRequired);
};

PushPayload.prototype.acknowledge = function (shouldAcceptPush) {
    var args = {"id" : this.id, "shouldAcceptPush" : shouldAcceptPush};

    // Send command to framework to acknowledge the Push payload
    exec(noop, noop, _ID, "acknowledge", args);
};

_self.PushService = PushService;
_self.PushPayload = PushPayload;

module.exports = _self;
