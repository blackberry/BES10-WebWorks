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
 * of the Contact Details screen.
 *=================================================================================*/


app.details = function () {
    'use strict';
    var pub = {};
    var contact = {};
    var backupList = [];
    var index = 0;

    pub.onDomReady = function () {
        console.log('details.onDomReady()');
        pub.populateDetails();
    };

    pub.setPrev = function() {
        console.log('details.setPrev()');
        var tmpContact;
        if (index <= 1) {
            backupList = [];
            index = 0;
            return;
        }
        index -= 2;
        tmpContact = app.model.findContactByName(backupList[index]);
        app.details.setContact(tmpContact);
        backupList.pop();
    };

    /*=================================================================================
     * Populate the 'Details' screen.
     *=================================================================================*/
    pub.populateDetails = function() {
        console.log('details.populateDetails()');
        var titleDivElement = document.getElementById('detailsTitle');
        var infoDivElement = document.getElementById('extraInfo');
        var listDivElement = document.getElementById('detailsList');
        var items = [];
        var item;
        var hasBackup = false;
        var showExtraInfo = false;

        if (titleDivElement) {
            detailsTitle.setCaption(contact.name);
        } else {
            console.log("Could not get title div.");
        }

        if (contact.title) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'label'); // Display as bbui.js
            item.innerHTML = "Title: " + contact.title;
            infoDivElement.appendChild(item);
            showExtraInfo = true;
        }

        if (contact.backup && app.model.findContactByName(contact.backup)) {
            hasBackup = true;
        }

        // if backup is in contact list show as contact item, otherwise show in extra info area
        if (contact.backup && !hasBackup) { // backup name exists but is not in the contact list
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'label'); // Display as bbui.js
            item.innerHTML = "Primary Backup: " + contact.backup;
            infoDivElement.appendChild(item);
            showExtraInfo = true;
        }

        // show round panel around any extra info
        if (showExtraInfo) {
            document.getElementById('extraInfo').style.display = "block";
        }

        if (contact.cellPhone || contact.officePhone) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'header'); // Display as bbui.js
            items.push(item);
        }

        if (contact.cellPhone) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
            item.setAttribute('data-bb-title', contact.cellPhone);
            item.setAttribute('data-bb-img', 'img/actionbar/device.png');
            item.setAttribute('onclick', "app.utils.callNumber('" + contact.cellPhone + "');");
            item.innerHTML = "Cell";
            items.push(item);
        }

        if (contact.officePhone) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
            item.setAttribute('data-bb-title', contact.officePhone);
            item.setAttribute('data-bb-img', 'img/actionbar/suitcase.png');
            item.setAttribute('onclick', "app.utils.callNumber('" + contact.officePhone + "');");
            item.innerHTML = "Office";
            items.push(item);
        }

        if (contact.cellPhone || contact.officePhone) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'header'); // Display as bbui.js
            items.push(item);
        }

        if (contact.cellPhone) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
            item.setAttribute('data-bb-title', contact.cellPhone);
            item.setAttribute('data-bb-img', 'img/actionbar/chat2.png');
            item.setAttribute('onclick', "app.utils.textNumber('" + contact.cellPhone + "');");
            item.innerHTML = "SMS Cell";
            items.push(item);
        }

        if (contact.officePhone) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
            item.setAttribute('data-bb-title', contact.officePhone);
            item.setAttribute('data-bb-img', 'img/actionbar/chat2.png');
            item.setAttribute('onclick', "app.utils.textNumber('" + contact.officePhone + "');");
            item.innerHTML = "SMS Office";
            items.push(item);
        }
        
        if (contact.email) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'header'); // Display as bbui.js
            items.push(item);

            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
            item.setAttribute('data-bb-title', contact.email);
            item.setAttribute('data-bb-img', 'img/actionbar/mail2.png');
            item.setAttribute('onclick', "app.utils.sendEmail('" + contact.email + "');");
            item.innerHTML = "Email";
            items.push(item);
        }

        if (contact.bbPin) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
            item.setAttribute('data-bb-title', contact.bbPin);
            item.setAttribute('data-bb-img', 'img/actionbar/device.png');
            item.setAttribute('onclick', "app.utils.pinMessage('" + contact.bbPin + "');");
            item.innerHTML = "BlackBerry PIN Message";
            items.push(item);
        }
        
        if (hasBackup == true) {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'header'); // Display as bbui.js
            items.push(item);

            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item'); // Display as bbui.js
            item.setAttribute('data-bb-title', contact.backup);
            item.setAttribute('data-bb-img', 'img/actionbar/details.png');
            item.setAttribute('onclick', "app.contactList.showDetails('" + contact.backup + "');");
            item.innerHTML = "Primary Backup";
            items.push(item);
        }
        backupList[index] = contact.name;
        index += 1;
        listDivElement.refresh(items);
    };

    pub.setContact = function (selectedContact) {
        console.log('details.setContact() name = ' + selectedContact.name);
        contact = selectedContact;
    };

    return pub;
}();