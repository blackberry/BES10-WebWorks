/*
 * Copyright 2015 Blackberry Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


// Configure this to be the same as the one set in config.xml
window.pushTarget = "com.ctetreault.eclpush1.invoke.push";

var pushHandler = function() {
	'use strict';
	var pub = {};
	window.pushService = false;

	// create push service
	pub.createPushService = function() {
		var ops = {
			appId: blackberry.app.id,
			invokeTargetId: pushTarget
		};
		if (blackberry.push)
			blackberry.push.PushService.create(ops, pub.successCreatePushService, pub.failCreatePushService, pub.onSimChange, pub.onPushTransportReady);
	};


	// create success callback
	pub.successCreatePushService = function(service) {
		window.pushService = service;
		service.launchApplicationOnPush(true, pub.launchApplicationCallback);
		service.createChannel(pub.createChannelCallback);
	};


	// gets called when creating the push service failed.
	pub.failCreatePushService = function(result) {
		if (result == blackberry.push.PushService.INTERNAL_ERROR) {
			console.log("Error: You are likely trying to run this application from the Personal Space, push will be disabled.");
		}
		else if (result == blackberry.push.PushService.MISSING_INVOKE_TARGET_ID) {
			console.log("Error: Called blackberry.push.PushService.create with a missing " + "invokeTargetId value. It usually means a programming error.");
		}
		else if (result == blackberry.push.PushService.SESSION_ALREADY_EXISTS) {
			console.log("Error: Called blackberry.push.PushService.create with an appId or " + "invokeTargetId value that matches another application. It usually means a " + "programming error.");
		}
		else {
			console.log("Error: Received error code (" + result + ") after " + "calling blackberry.push.PushService.create.");
		}
	};


	// sim change callback
	pub.onSimChange = function() {
		console.log("pushHandler.onSimChange()");
	};


	// transport ready callback
	pub.onPushTransportReady = function(lastFailedOperation) {
		console.log("pushHandler.onPushTransportReady()");
		if (lastFailedOperation === blackberry.push.PushService.CREATE_CHANNEL_OPERATION) {
			pushService.createChannel(pub.createChannelCallback);
		}
		else if (lastFailedOperation === blackberry.push.PushService.DESTROY_CHANNEL_OPERATION) {
			pushService.destroyChannel(pub.destroyChannelCallback);
		}
	};


	// launch app on push callback
	pub.launchApplicationCallback = function(result) {};


	// when app is invoked by a push
	pub.onInvoke = function(invokeRequest, success, fail) {
		if (invokeRequest.action !== null && invokeRequest.action == "bb.action.PUSH") {
			// if the pushService object isn't available yet (because app is loading still) we need to wait for it.
			// if it's not ready after 10 seconds, we give up.
			var timeout = 10000; // ms
			var pushPayload;

			window.pushServiceCheck = window.setInterval(function() {
				if (pushService) {
					clearInterval(pushServiceCheck);
					clearTimeout(pushCheckTimeout);

					var pushPayload = pushService.extractPushPayload(invokeRequest);
					var parsedPayload = pub.pushNotificationHandler(
						pushPayload,
						function(parsed) {
							success(parsed);
						},
						function(e) {
							fail();
						});
				}
			}, 250);

			window.pushCheckTimeout = window.setTimeout(function() {
				clearInterval(window.pushServiceCheck);
				fail('Failed to load Push Service');
			}, timeout);

		}
	};


	// Callback that handles the actual push notification
	pub.pushNotificationHandler = function(pushpayload, success, fail) {
		pushHandler.blobToTextString(
			pushpayload.data,
			function(parsed) {
				success(parsed);
			},
			function() {
				fail();
			});
	};


	// fetch json from url
	pub.getPokePull = function(url, success, fail) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				success(xmlhttp.responseText);
			}
			else if (xmlhttp.readyState == 4 && xmlhttp.status !== 200) {
				fail('Invalid username or password');
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	};


	// parse json data
	pub.parseData = function(raw, success, fail) {
		try {
			var json = JSON.parse(raw);
			success(json);
		}
		catch (e) {
			console.log('invalid json');
			console.log(e);
			fail();
		}
	};


	// convert the blob into a push payload/text
	pub.blobToTextString = function(myBlob, success, fail) {
		var parsedData;
		var reader = new FileReader();
		reader.onload = function(evt) {
			// Check if HTTP poke/pull request incoming...
			if (evt.target.result.substring(0, 4) == 'http') {
				console.log('Received URL to grab JSON');

				pushHandler.getPokePull(
					evt.target.result,

					function(payload) {
						pushHandler.parseData(
							payload,
							function(parsedData) {
								success(parsedData);
							},
							function() {
								fail();
							});
					},
					function() {
						fail();
					}
				);
			}
			else {
				console.log('Received standard JSON payload');
				pushHandler.parseData(
					evt.target.result,
					function(parsedData) {
						success(parsedData);
					},
					function() {
						fail('error parsing');
					});
			}
		};

		reader.onabort = function(evt) {
			console.log("Abort converting incoming data: " + evt.target.error);
			fail();
		};
		reader.onerror = function(evt) {
			console.log("Error converting incoming data: " + evt.target.error);
			fail();
		};

		reader.readAsText(myBlob, "UTF-8");
	};


	// push channel creation callback
	pub.createChannelCallback = function(result, token) {
		if (result == blackberry.push.PushService.SUCCESS) {
			console.log("pushHandler.createChannelCallback() : createChannel succeeded");
		}
		else {
			if (result == blackberry.push.PushService.INTERNAL_ERROR) {
				console.log("Error: An internal error occurred during " + "the create channel. Try registering again.");
			}
			else if (result == blackberry.push.PushService.CREATE_SESSION_NOT_DONE) {
				console.log("Error: No call to blackberry.push.PushService.create " + "was done before creating the channel. It usually means a programming error.");
			}
			else if (result == blackberry.push.PushService.MISSING_PORT_FROM_PPG) {
				console.log("Error: A port could not be obtained from the " + "PPG during the create channel. Try registering again.");
			}
			else {
				console.log("Error: Received error code (" + result + ") from the create channel.");
			}
		}
	};


	// destroy the push channel
	pub.destroyPushChannel = function() {
		console.log("pushHandler.destroyPushChannel()");
		pushService.destroyChannel(pub.destroyChannelCallback);
	};


	// channel destroy callback
	pub.destroyChannelCallback = function(result) {
		if (result == blackberry.push.PushService.SUCCESS || result == blackberry.push.PushService.CHANNEL_ALREADY_DESTROYED || result == blackberry.push.PushService.CHANNEL_ALREADY_DESTROYED_BY_PROVIDER || result == blackberry.push.PushService.CHANNEL_SUSPENDED_BY_PROVIDER || result == blackberry.push.PushService.PPG_SUBSCRIBER_NOT_FOUND || result == blackberry.push.PushService.CREATE_CHANNEL_NOT_DONE) {
			console.log("pushHandler.destroyChannelCallback() : destroyChannel succeeded");
		}
		else {
			if (result == blackberry.push.PushService.INTERNAL_ERROR) {
				console.log("Error: An internal error occurred during " + "the destroy channel. Try unregistering again.");
			}
			else if (result == blackberry.push.PushService.CREATE_SESSION_NOT_DONE) {
				console.log("Error: No call to blackberry.push.PushService.create " + "was done before destroying the channel. It usually means a programming error.");
			}
			else {
				console.log("Error: Received error code (" + result + ") from the destroy channel.");
			}
		}
	};
	return pub;

}();
