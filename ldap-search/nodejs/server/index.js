/*
* Copyright BlackBerry Limited.
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

// index.js
// 8 March 2014 Dennis Reumer
// index file for NodeJS sample for LDAP search through Active Directory using NodeJS.

// Learning more about NodeJS 
// - http://www.nodebeginner.org/ - Good Starting manual
// - http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb - explaning the basics of NodeJS
// - https://github.com/joyent/node/wiki - NodeJS Wiki

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}

handle["/"] = requestHandlers.search;
handle["/search"] = requestHandlers.search;

server.start(router.route, handle);
