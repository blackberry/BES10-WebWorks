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
 * This javascript is a common place for all utility functions, that are
 * used by the application in various places.
 *=================================================================================*/

app.utils = function() {'use strict';
    var pub = {};

    /*=================================================================================
     * Invoke email composer to send an email.
     *=================================================================================*/
    pub.sendEmail = function(email) {
        blackberry.invoke.card.invokeEmailComposer({
            subject : "RE: Emergency contact",
            to : [ email ]
        }, function(done) {
            console.log(done);
        }, function(cancel) {
            console.log(cancel)
        }, function(invokeError) {
            console.log(invokeError);
        });
    };

    /*=================================================================================
     * Send an email to the contact.
     *=================================================================================*/
    pub.emailByName = function(contactName) {
        console.log("utils.emailByName()");
        var contact = app.model.findContactByName(contactName);
        if (contact.email) {
            // Send to a single email address as given
            app.utils.sendEmail(contact.email);
        }
    };

    /*=================================================================================
     * Call a contact by phone number.
     *=================================================================================*/
    pub.callNumber = function(number) {
        console.log("utils.callNumber()");
        blackberry.invoke.invoke({
            uri : 'tel: ' + number
        }, pub.onInvokeSuccess, pub.onInvokeError);
    };

    /*=================================================================================
     * PIN Message by ID.
     *=================================================================================*/
    pub.pinMessage = function(pin) {
        console.log("utils.pinMessage()");
        blackberry.invoke.invoke({
        	//target: "sys.browser",
            uri : 'pin:' + pin
        }, pub.onInvokeSuccess, pub.onInvokeError);
    };

    /*=================================================================================
     * Call the phone number in the contact.
     * If the contact has more than one number ,
     * show them in a list for the user to chose.
     *=================================================================================*/
    pub.pinByName = function(contactName) {
    	//alert('Pinning by name: '+contactName);
    	
        var contact = app.model.findContactByName(contactName);
        app.utils.pinMessage(contact.bbPin);
    };


    /*=================================================================================
     * Call the phone number in the contact.
     * If the contact has more than one number ,
     * show them in a list for the user to chose.
     *=================================================================================*/
    pub.callByName = function(contactName) {
        console.log("utils.callByName()");
        var contact = app.model.findContactByName(contactName);

        if (contact.cellPhone && contact.officePhone) {
            // multiple phone numbers so show phone list
            app.phoneList.setContact(contact);
            bb.pushScreen('phonelist.htm', 'phoneList');
        } else if (contact.cellPhone) {
            app.utils.callNumber(contact.cellPhone);
        } else if (contact.officePhone) {
            app.utils.callNumber(contact.officePhone);
        }
    };

    /*=================================================================================
     * Application Invocation success callback.
     *=================================================================================*/
    pub.onInvokeSuccess = function() {
        console.log("Invocation successful!!");
    };

    /*=================================================================================
     * Application Invocation failure callback.
     *=================================================================================*/
    pub.onInvokeError = function(error) {
        console.log("Invocation failed, error: " + error);
    };

    return pub;
}();
