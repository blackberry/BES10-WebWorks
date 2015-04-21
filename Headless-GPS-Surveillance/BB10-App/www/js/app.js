/*
 * Copyright 2014 BlackBerry Limited.
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
 
var predefined = {
	eodPhoneNumber : "+1 866 957 0761",
	debug: false
}

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
		document.getElementById("appVersion").innerHTML=blackberry.app.version;	
		document.getElementById("appTitle").innerHTML=blackberry.app.name;
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
	},
	showPin: function(output){
		var option = {dismissCallback: function(){}}		
		var mypin = blackberry.identity.uuid;
		mypin= mypin.slice(2);
	    try {
	        blackberry.ui.dialog.standardAskAsync("My Pin: "+mypin, blackberry.ui.dialog.D_OK, function(){
				if(predefined.debug) console.log("PIN ="+mypin);
	        }, 
	        {
		        title : "PIN"
		    }
	        );
	    } catch (e) {
			if(predefined.debug) console.log("Error 103: could not obtain PIN");
			blackberry.ui.toast.show("Error 103: obtaining PIN", option);
	    }
		
		return;
	},
	callEOC: function(){
	    try {
			var option = {dismissCallback: function(){}}		
		    
	        blackberry.ui.dialog.standardAskAsync(predefined.eodPhoneNumber, blackberry.ui.dialog.D_OK_CANCEL, function(selectedButtonObject){
		        if(selectedButtonObject.return=="Cancel"){
					blackberry.ui.toast.show("Call Canceled", option);
					return;
				}			         
		        blackberry.invoke.invoke(
		        	{
			        	uri: "tel:"+predefined.eodPhoneNumber
			    	},
		            function(){
			        // onSuccess
			        
						if(predefined.debug) console.log("success! Calling EOD");
						blackberry.ui.toast.show("Calling " + predefined.eodPhoneNumber, option);
			        }, 
			        function(){
				    // onError
						if(predefined.debug) console.log("success! Calling EOD");
						blackberry.ui.toast.show("EOC Call failed", option);
			        }
			    );
	        }, 
	        {
		        title : "Call EOD"
		    }
	        );
	    } catch (e) {
			if(predefined.debug) console.log("Error 101: Error invoking Phone app with phone number");
			blackberry.ui.toast.show("Error 101: Error invoking Phone app with phone number");
	    }
		
	},
    sendLocation: function() {
		//blackberry.ui.toast.show("Sending Test Location");
		var option = {dismissCallback: function(){}}		
        
        blackberry.invoke.invoke({
            target: "community.surveillance.gps.HeadlessService",
            action: "community.surveillance.gps.HeadlessService.RESET"
        }, function(){	        
	        // onSuccess
			if(predefined.debug) console.log("success! sending GPS location now");
			blackberry.ui.toast.show("Sending GPS Location now.", option);
	            
        }, function(){
		    // onError
			if(predefined.debug) console.log("error 100! sending GPS location error");
			blackberry.ui.toast.show("Error 100: Could not send GPS location. This likely means the headless portion of the app isn't running. This app is only desiged for BB 10.3+ ", option);    
        });
    }	
};