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
 * This javascript takes care of handling the behaviour and event handling
 * of the Phone list screen.
 *=================================================================================*/


app.phoneList = function () {
    'use strict';
    var pub = {};
    var contact = {};

    pub.onDomReady = function () {
        console.log('app.phoneList.onDomReady()');
        pub.populatePhoneList();
    };

    /*=================================================================================
     * Populate the phone list screen
     *=================================================================================*/
    pub.populatePhoneList = function() {
        console.log('app.phoneList.populateContactList()');
        var titleDivElement = document.getElementById('phoneListTitle');
        var listDivElement = document.getElementById('phoneImageList');
        var items = [];
        var item;

        if (titleDivElement) {
            phoneListTitle.setCaption('Call ' + contact.name);

            console.log(titleDivElement);
        } else {
            console.log("Could not get title div.");
        }

        item = document.createElement('div');
        item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
        item.setAttribute('data-bb-title', contact.cellPhone);
        item.setAttribute('data-bb-img', 'img/actionbar/device.png');
        item.setAttribute('onclick', "app.utils.callNumber('" + contact.cellPhone + "');");
        item.innerHTML = "Cell";
        items.push(item);

        item = document.createElement('div');
        item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
        item.setAttribute('data-bb-title', contact.officePhone);
        item.setAttribute('data-bb-img', 'img/actionbar/suitcase.png');
        item.setAttribute('onclick', "app.utils.callNumber('" + contact.officePhone + "');");
        item.innerHTML = "Office";
        items.push(item);

        listDivElement.refresh(items);
    };

    pub.setContact = function(selectedContact) {
        console.log('set contact to ' + selectedContact.name);
        contact = selectedContact;
    };

    return pub;
}();
