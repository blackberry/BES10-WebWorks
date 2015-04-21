cordova.define("com.blackberry.identity.client", function(require, exports, module) { /*
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
    _ID = "com.blackberry.identity",
    exec = cordova.require("cordova/exec"),
    _fields;

function defineReadOnlyField(obj, field, value) {
    Object.defineProperty(obj, field, {
        "value": value,
        "writable": false
    });
}

function getFieldValue(field) {
    var value,
        success = function (data, response) {
            _fields = data;
        },
        fail = function (data, response) {
            throw data;
        };

    if (!_fields) {
        try {
            exec(success, fail, _ID, "getFields", null);
        } catch (e) {
            console.error(e);
        }
    }

    value = _fields ? _fields[field] : null;

    return value;
}

defineReadOnlyField(_self, "uuid", getFieldValue("uuid"));
defineReadOnlyField(_self, "IMSI", getFieldValue("IMSI"));
defineReadOnlyField(_self, "IMEI", getFieldValue("IMEI"));

module.exports = _self;

});
