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

			// run on init
			var settings = {
				companyName: 'Company Name Ltd',
			};

			// where all the magic is stored
			$rootScope.Orgs = {
				title: '',
				list: []
			};

			return {

				/**
				in a perfect world, this would be handled by the server to allow the app to
				simply display the data received with minimal processing

				here's an example of parsing some sample user data
				the parsing is likely to be different for every case, here's a small example of one
				**/

				parseLoginData: function(j, success, fail) {

					// org name
					$rootScope.Orgs.title = j.orgunitName;

					// setup current user
					var userObject = {
						isManager: false,
						id: j.networkId,
						name: j.displayName,
						title: j.position,
						officePhone: j.telephone,
						cellPhone: j.mobile,
						email: j.emailaddress,
						image: j.picture,
						address: j.workStateOrProvince + ', ' + j.country,
						bbPin: 'F1100000',
						backup: [{
							id: j.Manager.networkId,
							name: j.Manager.displayName,
							title: j.Manager.position,
							image: j.Manager.picture,
						}]
					};

					// set logged in user as 'current user'
					$rootScope.currentUser = userObject;

					// parse peers
					var tmpPeers = [];
					for (var x = 0; x < j.Peers.length; x++) {

						var peerObject = {
							isManager: false,
							id: j.Peers[x].networkId,
							name: j.Peers[x].displayName,
							title: j.Peers[x].position,
							officePhone: j.Peers[x].telephone,
							cellPhone: j.Peers[x].mobile,
							email: j.Peers[x].emailaddress,
							image: j.Peers[x].picture,
							address: j.Peers[x].workStateOrProvince + ', ' + j.Peers[x].country,
							bbPin: 'F1100000',
							backup: [{
								id: j.Peers[x].Manager.networkId,
								name: j.Peers[x].Manager.displayName,
								title: j.Peers[x].Manager.position,
								image: j.Peers[x].Manager.picture,
							}]
						};
						tmpPeers.push(peerObject);
					}

					// parse manager
					var managerObject = {
						isManager: true,
						id: j.Manager.networkId,
						name: j.Manager.displayName,
						title: j.Manager.position,
						officePhone: j.Manager.telephone,
						cellPhone: j.Manager.mobile,
						email: j.Manager.emailaddress,
						image: j.Manager.picture,
						address: j.Manager.workStateOrProvince + ', ' + j.Manager.country,
						bbPin: 'F1100000',
						backup: []
					};

					// set manager for current user
					tmpPeers.push(managerObject);
					$rootScope.Orgs.list = tmpPeers;

					window.localStorage.setItem('currentUser', JSON.stringify(userObject));
					window.localStorage.setItem('orgdata', JSON.stringify($rootScope.Orgs));
					success();
				},


				// verify login
				login: function(user, success, fail) {
					var _this = this;

					// this sample shows a basic auth http post
					var username = $rootScope.loginData.username;
					var password = $rootScope.loginData.password;

					var xmlhttp = new XMLHttpRequest();
					var url = 'https://api.myjson.com/bins/1pgg6';

					xmlhttp.onreadystatechange = function() {
						if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
							var loginJSON = xmlhttp.responseText;

							try {
								var loginCredentials = btoa(JSON.stringify($rootScope.loginData));
								_this.parseLoginData(
									JSON.parse(loginJSON),
									function() {
										window.localStorage.setItem('loginCredentials', loginCredentials);
										success();
									},
									function(e) {
										fail(e);
									});
							}
							catch (e) {
								fail('Caught an error: ' + e);
								window.localStorage.clear();
							}
						}
						else if (xmlhttp.readyState == 4 && xmlhttp.status == 401) {
							fail('Invalid username or password');
						}
					};

					// xmlhttp.withCredentials = true; // uncomment if you wish to use basic auth
					xmlhttp.open("GET", url, true);
					// xmlhttp.setRequestHeader("Authorization", "Basic " + btoa(username + ':' + password)); // uncomment if you wish to use basic auth
					xmlhttp.send();
				}
			};
		}
	]);
