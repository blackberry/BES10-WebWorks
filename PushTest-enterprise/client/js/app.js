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

/*jslint devel: true, browser: true, white: true, nomen: true */

/* ===========================================================================
 * app.js
 *
 * @description
 *
 *
 * @author Brent Thornton
 * ===========================================================================
 */

/**
 *
 */
var app = {
    name: 'WAA Push Test',
    version: '1.0.1',
    pushService: null,          // the main push service object.
    onInvokedInfo: null         // stores the invoke data for when the push service object is not setup yet.
};

// Options to pass to the push service object.
var ops = {
    invokeTargetId : 'waa.pushtest.target',         // must match the invoke-id in config.xml
    appId : 'waapushtest'                          // can be string or port#
};

/*
The function called when the webworksready event fires.
*/
app.init = function (lang) {

    document.getElementById('server_link').innerHTML = '<a href="javascript:app.openServerLinkInBrowser();">Create a Push on Server</a>';
    //make sure you setup the invoke listener before setting up push. this makes a "launch on push" work for some reason???
    blackberry.event.addEventListener("invoked", app.invokedCallbackFunc);
    app.setupPushService();

    // reset the cover settings upon maximizing the app
    blackberry.event.addEventListener("exitcover", function() {
        blackberry.ui.cover.resetCover();
        // clear the notification here too
        Notification.remove('push_test');
    });
};

/*
Open the server push url in the browser.
*/
app.openServerLinkInBrowser = function() {
    // get pin
    var pin = blackberry.identity.uuid;
    if (pin.indexOf('0x') > -1) pin = pin.substring(2);
    app.debug(pin);
    // open web link in browser
    blackberry.invoke.invoke({
        target: "sys.browser",
        uri: 'http://waa001cnc.rim.net/webapps/PushServerTest_JS/index.html?' +
            'email=' + pin +
            '&bes=attts-fusion01.attlab.sw.rim.net' +
            '&mdsPort=8080' +
            '&appPort=' + ops.appId
    }, null, null);
};

/*
Setup the push service object using the options set above
CallBack: app.successCallback
*/
app.setupPushService = function (){
    try {
        blackberry.push.PushService.create(ops,
            app.successCallback,
            app.failCallback,
            app.simChangeCallback,
            app.pushTransportReadyCallback);
    } catch (err) {
        app.debug("Create was called more than once with different values for options.invokeTargetId or options.appId.");
        app.debug(err);
    }
};

/*
The push service object is now setup. Create the push channel.
Save the push service object to global for later use
*/
app.successCallback = function (pushService) {
    if (app.onInvokedInfo !== null){
        // there is data waiting already so parse it.
        // the channel has already been created.
        app.debug("app.onInvokedInfo is not null so parsing...");
        app.pushService = pushService;
        app.parsePayload();
    } else {
        // the channel is not created to create it.
        // also set the ability to launch the app on push
        pushService.launchApplicationOnPush(true, app.launchApplicationOnPushCallBack);
        pushService.createChannel(app.createChannelCallback);

        // save push service globally
        app.pushService = pushService;
    }
};

/*
To-do: figure out what this callback would be useful for.
*/
app.launchApplicationOnPushCallBack = function (result){
    app.debug("in app.launchApplicationOnPushCallBack");
};

/*
Push service object creating failed.
*/
app.failCallback = function (result) {
    app.debug("app.failCallback: " + result);
    if (result == blackberry.push.PushService.INTERNAL_ERROR) {
        app.debug("Error: An internal error occurred during the create channel. Try registering again.");
    } else if (result == blackberry.push.PushService.CREATE_SESSION_NOT_DONE) {
        app.debug("Error: No call to blackberry.push.PushService.create was done before creating the channel. It usually means a programming error.");
    } else if (result == blackberry.push.PushService.MISSING_PORT_FROM_PPG) {
        app.debug("Error: A port could not be obtained from the PPG during the create channel. Try registering again.");
    } else if (result == blackberry.push.PushService.SESSION_ALREADY_EXISTS){
        app.debug( "Error: The App ID / Port is already in use by another push app.");
    } else {
        app.debug( "Error: Received error code (" + result + ") from the create channel.");
    }
};

/*
To-do: figure out if this is needed by enterprise
*/
app.simChangeCallback = function() {
    // The SIM card was changed and the channel has been
    // destroyed since a new user might be using the device.
};

/*
To-do: figure out what this does.
*/
app.pushTransportReadyCallback = function (lastFailedOperation) {
    app.debug('app.pushTransportReadyCallback');
    // This callback will be called when a create channel
    // or destroy channel was previously attempted and it
    // failed with a PUSH_TRANSPORT_UNAVAILABLE or a
    // PPG_SERVER_ERROR error code and now the
    // network/push transport/PPG is available again.
    // The operation indicated by lastFailedOperation should
    // be retried again.
    if (lastFailedOperation ===
        blackberry.push.PushService.CREATE_CHANNEL_OPERATION) {
        pushService.createChannel(createChannelCallback);
    } else if (lastFailedOperation ===
        blackberry.push.PushService.DESTROY_CHANNEL_OPERATION) {
        pushService.destroyChannel(destroyChannelCallback);
    }
};

/*
Called when destorying the push channel.
*/
app.destroyChannelCallback = function (result) {
    app.debug('app.destroyChannelCallback: ' + result );
};

/*
Push channel was created correctly.
*/
app.createChannelCallback = function (result, token) {
    //app.debug("createChannelCallBack: " + result);
    if (result === blackberry.push.PushService.SUCCESS) {
        app.debug("Channel created ... Ready for Push");
    } else if (result === blackberry.push.PushService.INTERNAL_ERROR) {
        app.debug("channel creation error");
    }
};

/*
This function is called when the app is invoked via the Push
When the application isn't launched already when the push comes in we
save the onInovkedInfo object so it can be used when the push service object
is ready.
*/
app.invokedCallbackFunc = function (onInvokedInfo) {
    app.debug("in app.invokedCallbackFunc");
    app.onInvokedInfo = onInvokedInfo;

    // if(onInvokedInfo.source) {
    //  app.debug("Source: " + onInvokedInfo.source);
    // }
    // if(onInvokedInfo.target) {
    //  app.debug("Target(me): " + onInvokedInfo.target);
    // }
    // if(onInvokedInfo.action) {
    //  app.debug("Action: " + onInvokedInfo.action);
    // }
    /*
    // You can view the data this way but it includes the headers the Invocation framework uses
    // better to do what is done in app.parsePayload()
    if(onInvokedInfo.data) {
        app.debug("Data: " + onInvokedInfo.data);
        //the data comes in as a base64 string you can convert it using atob(...)
        //note that atob will fail if you are being passed unicode strings
        app.debug("Data: " + atob(onInvokedInfo.data));
    }
    */

    // detect if it is a PUSH invoke or an OPEN invoke (from hub)
    if (onInvokedInfo.action == 'bb.action.PUSH')
        app.parsePayload();
    else if (onInvokedInfo.action == 'bb.action.OPEN')
        app.debug('Open from hub so no need to parse.');
};

/*
Parse the push data.
*/
app.parsePayload = function (){
    try{
        if (app.pushService !== null){
            var pushPayload = app.pushService.extractPushPayload(app.onInvokedInfo);

            // If an acknowledgement of the push is required (that is, the push was sent as a confirmed push
            // - which is equivalent terminology to the push being sent with application level reliability),
            // then you must either accept the push or reject the push
            if (pushPayload.isAcknowledgeRequired) {
                // In our sample, we always accept the push, but situations might arise where an application
                // might want to reject the push (for example, after looking at the headers that came with the push
                // or the data of the push, we might decide that the push received did not match what we expected
                // and so we might want to reject it)
                pushPayload.acknowledge(true);
            }

            app.blobToText(pushPayload.data, "UTF-8", app.textConversionCallback);

            //set to null so this isnt reparsed later
            app.onInvokedInfo = null;
        }
        // if app.pushService doesnt exist forget about it for now because the app just launched and
        // once the push service object is ready the invoke info will be parsed.
    } catch (err) {
        app.debug("Was unable to parse the invoke request.");
        app.debug(err);
    }

};

/*
Parse the push data.
*/
app.blobToText = function (blob, encoding, callback) {
    var reader = new FileReader();

    reader.onload = function(evt) {
        // No errors, get the result and call the callback
        callback(evt.target.result);
    };

    reader.onerror = function(evt) {
        app.debug("Error converting Blob to string: " + evt.target.error);
    };
    reader.readAsText(blob, encoding);
};

app.textConversionCallback = function(str) {
    app.debug("Data received: " + str);
    notify.toast('Push Received!');
    notify.hub('Push Received!', str);
    notify.cover('Push Received!');
};


/*
Debug Functions:
*/

app.debug = function(result){
    //app.debug('here');
    document.getElementById('debug').innerHTML += '<br / >' + result;
};

app.clearDebug = function(){
    //app.debug('here');
    document.getElementById('debug').innerHTML = '';
};

/*
Notifications
*/

var notify = {};

// Pop up a toast dialog
notify.toast = function(str) {
    toastId = blackberry.ui.toast.show(str);
};

// Add a notification in the Hub
notify.hub = function(str, theBody) {
    if (theBody !== undefined)
        // tag so we can remove the notification when the app is opened
        new Notification(str, {tag: 'push_test', body: theBody});
    else
        new Notification(str, {tag: 'push_test'});
};

// Add a window cover when app is minified
notify.cover = function (str) {
    //maybe clear the labels ?
    // do we add push data if small enough?
    //also add an image
    // set cover label
    blackberry.ui.cover.labels.push({
        label: str,
        size: 10,   //font size
        wrap: true
    });

    // add image to window cover
    blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {
        path: 'local:///img/splat.jpg'
    });

    blackberry.ui.cover.updateCover();
};