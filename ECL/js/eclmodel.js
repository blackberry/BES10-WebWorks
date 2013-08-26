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
 * This javascript is the data model for the Contact details which is used
 * in all other screens.
 *=================================================================================*/

app.model = function() {
    'use strict';
    var pub = {};

    var emergencyContactList = {};
    var ls_name = "contact list";
    var updateDate = undefined;
    var listUpdateCallback = null;

    // A dummy list for testing offline
    var dummyList = [{
        title : "Operations Team",
        list : [{
            name : "John Doe",
            title : "Sr. Vice President, Operations",
            officePhone : "519 555-1111",
            cellPhone : "519 555-1222",
            email : "john.doe@email.xyz.com",
            bbPin : "3333858E",
            backup : "John Flow"
        }, {
            name : "John Flow",
            title : "Manager, Manufacturing Operations",
            officePhone : "519 555-2111",
            cellPhone : "519 555-2222",
            email : "john.flow@email.xyz.com",
            bbPin : "2222222F",
            backup : undefined
        }, {
            name : "John Snow",
            title : "Manager, Transportation Operations",
            officePhone : "519 555-3111",
            cellPhone : "519 555-3222",
            email : "john.snow@email.xyz.com",
            bbPin : "3333333F",
            backup : "Julian Migs"
        }]
    }, {
        title : "Support Team",
        list : [{
            name : "Julian Migs",
            title : "Team Planner",
            officePhone : "519 555-4111",
            cellPhone : "519 555-4222",
            email : "julian@email.xyz.com",
            bbPin : undefined,
            backup : "Ricky Williams"
        }, {
            name : "Ricky Williams",
            title : "Vice President, Plannning",
            officePhone : "519 555-5111",
            cellPhone : "519 555-2222",
            email : "ricky@email.xyz.com",
            bbPin : undefined,
            backup : undefined
        }, {
            name : "Randy Whitt",
            title : "Assistant Weekend Supervisor",
            officePhone : "519 555-7111",
            cellPhone : "519 555-7222",
            email : "randy@email.xyz.com",
            bbPin : undefined,
            backup : undefined
        }]
    }, {
        title : "Communications Team",
        list : [{
            name : "Linus Luther",
            title : "Head Pianist",
            officePhone : "519 555-8111",
            cellPhone : "519 555-8222",
            email : undefined,
            bbPin : undefined,
            backup : "Lucy Lu"
        }, {
            name : "Lucy Lu",
            title : "Pianist's Shadow",
            officePhone : "519 555-9111",
            cellPhone : "519 555-9222",
            email : undefined,
            bbPin : "9999999F",
            backup : undefined
        }, {
            name : "Lucy aaa",
            title : "Pianist's Shadow",
            officePhone : "519 555-9222",
            email : undefined,
            backup : "Doreen"
        }, {
            name : "Joe Mysterious",
            cellPhone : "519 555-9222"
        }]
    }];

    /*=================================================================================
     * Set up a dummy list for demo purposes.
     *=================================================================================*/
    pub.setDemoList = function(list) {
        app.model.setList(dummyList);
    };

    /*=================================================================================
     * Set up the model with the list that is pushed into the device.
     *=================================================================================*/
    pub.setList = function(list) {
        console.log("model.setList()");

        var updateLocalStorage = true;
        // assume true unless we read list from local storage
        if (list) {
            console.log("   Got list from parameter.");
            emergencyContactList = list;
        } else {
            pub.read();
		
            if (emergencyContactList) {
                console.log("   Got list from local storage.");
                updateLocalStorage = false;
            }
        }

        if (updateLocalStorage) {
            pub.write();
            // Write to local storage.
            updateDate = new Date();
        }

        if (listUpdateCallback) {
            console.log("Call listUpdateCallback()");
            listUpdateCallback();
        }
    };

    /*=================================================================================
     * Retrieve the Emergency contact list.
     *=================================================================================*/
    pub.getList = function() {
        console.log("model.getList()");
        return emergencyContactList;
    };

    /*=================================================================================
     * Save the emergency contact list to the local storage.
     *=================================================================================*/
    pub.write = function() {
        console.log("model.write()");
        if (!window.localStorage) {
            return;
        }
        localStorage.setItem(ls_name, JSON.stringify(emergencyContactList));
    };

    /*=================================================================================
     * Retrieve the emergency contact list from the local storage.
     *=================================================================================*/
    pub.read = function() {
        console.log("model.read()");
        if (!window.localStorage) {
            return;
        }
        emergencyContactList = JSON.parse(localStorage.getItem(ls_name));
    };

    /*=================================================================================
     * Find a contact by the name.
     *=================================================================================*/
    pub.findContactByName = function(name) {
        console.log("model.findContactByName()");
        var eclList = pub.getList();
        var teamIdx;
        var contactIdx;

        for (teamIdx in eclList) {
            var team = eclList[teamIdx];

            for (contactIdx in team.list) {
                var contact = team.list[contactIdx];

                if (contact.name === name) {
                    return contact;
                }
            }
        }
    };

    /*=================================================================================
     * Register a callback for the list update event.
     *=================================================================================*/
    pub.registerListUpdateCallback = function(callback) {
        listUpdateCallback = callback;
    };

    return pub;
}();
