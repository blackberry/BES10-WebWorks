/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the 'License');
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an 'AS IS' BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License.  */


angular.module('ecl.services', [])
	.factory('Utils', ['$rootScope', '$http',
		function($rootScope, $http) {

			// where all the magic is stored
			$rootScope.Orgs = {
				list: []
			};

			return {

				// this is where you can modify the JSON to meet your needds
				// we need this to provide backwards compatibility with ECL v1.
				updateJSON: function(data, success, fail) {
					console.log('formatting JSON');

					var orgs = data;
					var allOrgs = [];

					// loop through each org
					for (var x = 0; x < orgs.length; x++) {
						var org = orgs[x];
						var members = org.list;

						var updatedOrg = {
							id: 'orgid' + x,
							list: [],
							title: org.title,
						};

						// loop through each member
						for (var y = 0; y < members.length; y++) {
							var user = members[y];

							// setup current user
							var userObject = {
								isManager: false,
								id: user.name,
								name: user.name,
								title: user.title,
								officePhone: user.officePhone,
								cellPhone: user.cellPhone,
								email: user.email,
								image: 'assets/placeholder-photo.jpg', // placeholder for an image
								address: 'Ontario, Canada',
								bbPin: user.bbPin,
								backup: [{ // you can now have multiple backups if you wish
									id: user.backup, // if you want the user to be able to click on the contact, the contact must be in the json or it has nothing to load
									name: user.backup,
									title: user.name + '\'s Backup',
									image: 'assets/placeholder-photo.jpg', // placeholder for an image
								}]
							};
							updatedOrg.list.push(userObject);
						}
						allOrgs.push(updatedOrg);
					}

					window.localStorage.clear();
					window.localStorage.setItem('orgdata', JSON.stringify(allOrgs));

					// Add a new notification in the hub.
					var title = "Emergency Contact List";
					var options = {
						body: 'Emergency Contact List has been updated.',
						target: window.pushTarget,
						targetAction: "bb.action.OPEN"
					};
					new Notification(title, options);

					success();
				}
			};
		}
	]);
