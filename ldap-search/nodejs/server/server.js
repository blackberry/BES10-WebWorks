/*
* Copyright 2010-2014 BlackBerry Limited.
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

// server.js
// 8 March 2014 Dennis Reumer
// LDAP search against Active Directory in NodeJS

var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		var parameters = url.parse(request.url).query;
		console.log("Request for " + pathname + " parameters: " + parameters + " received.");
		route(handle, pathname, response, parameters);
		}
	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
	}

exports.start = start;


