/*
 * Copyright 2012 Blackberry Limited.
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

/*=================================================================================
 * This javascript handles push notifications that the application receives
 * and posts a notification on the hub.
 *=================================================================================*/

app.pushHandler = function() {'use strict';
	var pub = {};

	var pushService = null;

	/*=================================================================================
	 * Create the push service
	 *=================================================================================*/
	pub.createPushService = function() {
		console.log("pushHandler.createPushService()");

		var ops = {
			appId : "ecl_webworks",
			invokeTargetId : "bb10.webworks.ecl.invoke.waa.push"
		};
		if (blackberry.push)
			blackberry.push.PushService.create(ops, pub.successCreatePushService, pub.failCreatePushService, pub.onSimChange, pub.onPushTransportReady);
	};

	/*=================================================================================
	 * gets called when creating the push service succeeded.
	 *=================================================================================*/
	pub.successCreatePushService = function(service) {
		console.log("pushHandler.successCreatePushService()");
		app.pushService = service;

		service.launchApplicationOnPush(true, pub.launchApplicationCallback);

		// Create a push channel
		service.createChannel(pub.createChannelCallback);
	};

	/*=================================================================================
	 * gets called when creating the push service failed.
	 *=================================================================================*/
	pub.failCreatePushService = function(result) {
		console.log("pushHandler.failCreatePushService()");
		if (result == blackberry.push.PushService.INTERNAL_ERROR) {
			alert("Error: You are likely trying to run this application from the Personal Space, push will be disabled.");
		} else if (result == blackberry.push.PushService.MISSING_INVOKE_TARGET_ID) {
			alert("Error: Called blackberry.push.PushService.create with a missing " + "invokeTargetId value. It usually means a programming error.");
		} else if (result == blackberry.push.PushService.SESSION_ALREADY_EXISTS) {
			alert("Error: Called blackberry.push.PushService.create with an appId or " + "invokeTargetId value that matches another application. It usually means a " + "programming error.");
		} else {
			alert("Error: Received error code (" + result + ") after " + "calling blackberry.push.PushService.create.");
		}
	};

	/*=================================================================================
	 * SIM change callback
	 *=================================================================================*/
	pub.onSimChange = function() {
		console.log("pushHandler.onSimChange()");
	};

	/*=================================================================================
	 * Transport ready callback
	 *=================================================================================*/
	pub.onPushTransportReady = function(lastFailedOperation) {
		console.log("pushHandler.onPushTransportReady()");
		// This callback will be called when a create channel
		// or destroy channel was previously attempted and it
		// failed with a PUSH_TRANSPORT_UNAVAILABLE or a
		// PPG_SERVER_ERROR error code and now the
		// network/push transport/PPG is available again.
		// The operation indicated by lastFailedOperation should
		// be retried again.
		if (lastFailedOperation === blackberry.push.PushService.CREATE_CHANNEL_OPERATION) {
			app.pushService.createChannel(pub.createChannelCallback);
		} else if (lastFailedOperation === blackberry.push.PushService.DESTROY_CHANNEL_OPERATION) {
			app.pushService.destroyChannel(pub.destroyChannelCallback);
		}
	};

	/*=================================================================================
	 * Launch Application callback
	 *=================================================================================*/
	pub.launchApplicationCallback = function(result) {
		if (result == blackberry.push.PushService.SUCCESS) {
			console.log("pushHandler.launchApplicationCallback() : launchApplicationOnPush succeeded");
		} else {
			if (result == blackberry.push.PushService.INTERNAL_ERROR) {
				alert("Error: An internal error occurred while calling launchApplicationOnPush. " + "Try restarting the application.");
			} else if (result == blackberry.push.PushService.CREATE_SESSION_NOT_DONE) {
				alert("Error: Called launchApplicationOnPush without an " + "existing session. It usually means a programming error.");
			} else {
				alert("Error: Received error code (" + result + ") after " + "calling launchApplicationOnPush.");
			}
		}
	};

	/*=================================================================================
	 * Application invocation callback.
	 *=================================================================================*/
	pub.onInvoke = function(invokeRequest) {
		if (invokeRequest.action != null && invokeRequest.action == "bb.action.PUSH") {
			console.log("pushHandler.onInvoke() : PUSH invoked");
			var pushPayload = app.pushService.extractPushPayload(invokeRequest);
			pub.pushNotificationHandler(pushPayload);
		} else if (invokeRequest.action != null && invokeRequest.action == "bb.action.OPEN") {
			console.log("pushHandler.onInvoke() : OPEN invoked");
		}
	};

	/*=================================================================================
	 * Callback that handles the actual push notification.
	 *=================================================================================*/
	pub.pushNotificationHandler = function(pushpayload) {
		console.log("pushHandler.pushNotificationHandler()");

		// Convert raw text to text string and parse out...
		app.pushHandler.blobToTextString(pushpayload.data);

		// Send notification to hub that new list arrived.
		app.pushHandler.notifyHub();

		if (pushpayload.isAcknowledgeRequired) {
			pushpayload.acknowledge(true);
		}
	};

	// A more efficient packing transport than JSON.parse or base64...
	pub.convert2Bytes = function(hex_str) {
		var count = 0, hex_arr, hex_data = [], hex_len, i;
		if (hex_str.trim() == "")
			return [];
		// Check for invalid hex characters.
		if (/[^0-9a-fA-F\s]/.test(hex_str))
			return false;
		// Split on every 2 characters... pack it in tight!
		hex_arr = hex_str.match(/.{2}/g);
		hex_len = hex_arr.length;
		for ( i = 0; i < hex_len; ++i) {
			if (hex_arr[i].trim() == "")
				continue;
			hex_data[count++] = parseInt(hex_arr[i], 16);
		}
		return hex_data;
	};

	/*=================================================================================
	 * Convert the Blob in the push payload to text.
	 *=================================================================================*/
	pub.blobToTextString = function(myBlob) {
		console.log("pushHandler.blobToTextString");
		var reader = new FileReader();
		reader.onload = function(evt) {
			// Check if compressed stream incoming...
			if (evt.target.result.substring(0,4) == '5d00') {
				console.log('Excellent, you\'ve received a compressed payload!  Uncompressing now...');
				var byteArr = app.pushHandler.convert2Bytes(evt.target.result);
				my_lzma.decompress(byteArr, function(raw) {
					// No errors, parse the JSON into UI element
					app.model.setList(JSON.parse(raw));
				}, function(percent) {
					/// Decompressing progress code goes here.
					document.getElementById('listContent').innerHTML = "Decompressing: " + (percent * 100) + "%";
				});
			} else {
				var myData = JSON.parse(evt.target.result);
				// No compression detected, make sure it's sane...
				if (myData[0].title) {
					app.model.setList(myData);
				} else { 
					alert('The pushed content is not in a recognized format.  \n\nPlease try to re-send or contact your BES administrator.');
				}
			}
		};
		reader.onabort = function(evt) {
			alert("Abort converting incoming data: " + evt.target.error);
		};
		reader.onerror = function(evt) {
			alert("Error converting incoming data: " + evt.target.error);
		};
		reader.readAsText(myBlob, "UTF-8");
	};

	/*=================================================================================
	 * Callback indicating creation of the channel.
	 *=================================================================================*/
	pub.createChannelCallback = function(result, token) {
		if (result == blackberry.push.PushService.SUCCESS) {
			console.log("pushHandler.createChannelCallback() : createChannel succeeded");
		} else {
			if (result == blackberry.push.PushService.INTERNAL_ERROR) {
				alert("Error: An internal error occurred during " + "the create channel. Try registering again.");
			} else if (result == blackberry.push.PushService.CREATE_SESSION_NOT_DONE) {
				alert("Error: No call to blackberry.push.PushService.create " + "was done before creating the channel. It usually means a programming error.");
			} else if (result == blackberry.push.PushService.MISSING_PORT_FROM_PPG) {
				alert("Error: A port could not be obtained from the " + "PPG during the create channel. Try registering again.");
			} else {
				alert("Error: Received error code (" + result + ") from the create channel.");
			}
		}
	};

	/*=================================================================================
	 * Add a new notification in the hub.
	 *=================================================================================*/
	pub.notifyHub = function() {
		console.log("pushHandler.notifyHub()");

		// Add a notification to the BlackBerry Hub for this push
		var title = "Emergency Contact List";
		var options = {
			body : "New Emergency Contact List received",
			target : "bb10.webworks.ecl.invoke.waa.open",
			targetAction : "bb.action.OPEN"
		};
		new Notification(title, options);
	};

	/*=================================================================================
	 * Destroy the push channel.
	 *=================================================================================*/
	pub.destroyPushChannel = function() {
		console.log("pushHandler.destroyPushChannel()");
		app.pushService.destroyChannel(pub.destroyChannelCallback);
	};

	/*=================================================================================
	 * Callback function for pushService.destroyChannel
	 *=================================================================================*/
	pub.destroyChannelCallback = function(result) {
		if (result == blackberry.push.PushService.SUCCESS || result == blackberry.push.PushService.CHANNEL_ALREADY_DESTROYED || result == blackberry.push.PushService.CHANNEL_ALREADY_DESTROYED_BY_PROVIDER || result == blackberry.push.PushService.CHANNEL_SUSPENDED_BY_PROVIDER || result == blackberry.push.PushService.PPG_SUBSCRIBER_NOT_FOUND || result == blackberry.push.PushService.CREATE_CHANNEL_NOT_DONE) {
			console.log("pushHandler.destroyChannelCallback() : destroyChannel succeeded");
		} else {
			if (result == blackberry.push.PushService.INTERNAL_ERROR) {
				alert("Error: An internal error occurred during " + "the destroy channel. Try unregistering again.");
			} else if (result == blackberry.push.PushService.CREATE_SESSION_NOT_DONE) {
				alert("Error: No call to blackberry.push.PushService.create " + "was done before destroying the channel. It usually means a programming error.");
			} else {
				alert("Error: Received error code (" + result + ") from the destroy channel.");
			}
		}
	};

	return pub;
}();
