/*
* Copyright 2010-2014 Research In Motion Limited.
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
* Author: Dennis Reumer, BlackBerry
* Date: April 2014
*/
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      //
      switch (id) {
        case "deviceready":
            app.launchWeblink( blackberry.app.authorURL );
            break;
        default:
            //nothing happens
      }
    },
    //The weblink launcher and closer.
    launchWeblink: function( url ) {
        // _system target to have teh system browser open the url
        var target = '_system';
        //Launch the url in the Browser
        var ref = window.open( encodeURI( url ), target );
        //Exit the app
        blackberry.app.exit();
    }
};
