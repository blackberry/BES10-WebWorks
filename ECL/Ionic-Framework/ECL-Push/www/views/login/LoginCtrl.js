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
	.controller('LoginCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', '$ionicLoading', 'Utils',
		function($scope, $rootScope, $timeout, $state, $stateParams, $ionicLoading, Utils) {

			$rootScope.showWaiting = false;

			// when view comes in to... view
			$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

				// login
				if (toState.name === 'login') {
					$timeout(function() {
						$scope.init();
					}, 1500);
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
				try {
					$rootScope.allOrgs = JSON.parse(window.localStorage.getItem('orgdata')) || false;
					if (typeof $rootScope.allOrgs === 'object') {
						$scope.dialog('Loading Contacts');

						// timeout helps it appear more smooth so user doesn't get thrown into allOrgs view right away
						$timeout(function() {
							$ionicLoading.hide();
							$state.go('app.allOrgs');
						}, 1500);
					}
					else {
						window.localStorage.clear();
						$ionicLoading.show({
							template: 'Waiting for Push data'
						});
						$rootScope.showWaiting = true;
					}
				}
				catch (e) {
					window.localStorage.clear();
					$scope.dialog('Error parsing Org Data');
					$rootScope.showWaiting = true;
					console.log(e);
				}
			};


			// init
			$scope.init = function() {
				$scope.loadSavedData();
			};

		}
	]);
