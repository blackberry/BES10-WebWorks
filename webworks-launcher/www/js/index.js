/*
 * Copyright 2015 BlackBerry Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/* EDIT THE FOLLOWING VARIABLES */
var url = 'http://blackberry.com';

/* !!! DO NOT EDIT ANYTHING BELOW HERE !!! */
/* !!! DO NOT EDIT ANYTHING BELOW HERE !!! */
/* !!! DO NOT EDIT ANYTHING BELOW HERE !!! */
var target = '_system';

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {

		// for bb10 we must use the invoke framework as _system target doesn't open system browser, but in app
		var isBlackberry = window.blackberry || false;

		// for bb we have to use their own api
		if (isBlackberry) {
			blackberry.invoke.invoke({
				target: "sys.browser",
				uri: url
			}, function() {
				blackberry.app.exit();
			}, function() {});

			// the rest, we can use navigator
			// NOTE: iOS doesn't allow devs to close an app, no way around this, platform limitation
		}
		else {
			var windowRef = window.open(url, target);

			setTimeout(function() {
				try {
					navigator.app.exitApp();
				}
				catch (e) {}
			}, 500);
		}
	},
};

app.initialize();
