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


angular.module('ecl')
	.controller('LoginCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', '$http', '$ionicLoading', 'Utils', '$location',
		function($scope, $rootScope, $timeout, $state, $stateParams, $http, $ionicLoading, Utils, $location) {

			$rootScope.loggedIn = false;
			$rootScope.showLogin = false;

			// placeholder photo to use until users photo downloads
			$rootScope.placeholderPhoto = 'assets/placeholder-photo.jpg';

			// TODO: don't do this for prod.
			$rootScope.loginData = {
				username: 'username',
				password: 'password'
			};


			// when view comes in to... view
			$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
				if (toState.name === 'login') {
					$rootScope.Orgs = {
						title: '',
						list: []
					};
				}

			});


			// dialog helper
			$scope.dialog = function(label) {
				$ionicLoading.show({
					template: label
				});

				$timeout(function() {
					$ionicLoading.hide();
				}, 2100);
			};


			// load saved json data from localstorage
			$scope.loadSavedData = function() {
				console.log('> loading saved data!');

				try {
					$rootScope.Orgs = JSON.parse(window.localStorage.getItem('orgdata')) || false;
					if (typeof $rootScope.Orgs === 'object') {

						$scope.dialog('Loading Org Data...');
						$timeout(function() {
							$ionicLoading.hide();
							$state.go('app.org');
						}, 1000);
					}
					else {
						// enable login buttons
						window.localStorage.clear();
						// TODO: error msg, can't load data from server!
						$rootScope.showLogin = true;
					}
				}
				catch (e) {
					window.localStorage.clear();
					// TODO: error msg, can't load data from server!
					$rootScope.showLogin = true;
					console.log(e);
				}
			};


			// login
			$scope.login = function() {
				$ionicLoading.show({
					template: 'Contacting the server...'
				});

				console.log('> logging in');
				Utils.login(
					$rootScope.loginData.username,
					function(orgMembers) {
						$rootScope.loggedIn = true;
						$ionicLoading.hide();
						$scope.loadSavedData();
					},
					function(msg) {
						// TODO add an error toast
						$ionicLoading.show({
							template: msg
						});

						$ionicLoading.hide();
					});
			};


			// logout
			$scope.logout = function() {
				$rootScope.showLogin = true;
				console.log('> refreshing data!!');
				window.localStorage.clear();
				$rootScope.Orgs = {
					title: '',
					list: []
				};
				$location.path('#/login');
			};


			// init
			$scope.init = function() {
				// check for credentials
				try {
					var savedLoginCredentials = window.localStorage.getItem('loginCredentials') || false;

					if (savedLoginCredentials) {
						savedLoginCredentials = atob(savedLoginCredentials);
						savedLoginCredentials = JSON.parse(savedLoginCredentials);
					}

					if (typeof savedLoginCredentials === 'object') {
						console.log('> credentials saved, logged in already');

						// set currentUser
						var currentUser = window.localStorage.getItem('currentUser');
						$rootScope.currentUser = JSON.parse(currentUser);

						$rootScope.loggedIn = true;
						$ionicLoading.hide();
						$scope.loadSavedData();
					}
					else {
						$rootScope.showLogin = true;
						console.log('waiting for login...');
					}
				}
				catch (e) {
					$rootScope.showLogin = true;
					console.log('waiting for login...');
				}
			};
			$scope.init();
		}
	]);
