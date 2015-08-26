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
	.controller('OrgCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$ionicLoading', '$ionicNavBarDelegate',
		function($scope, $rootScope, $state, $stateParams, $timeout, $ionicLoading, $ionicNavBarDelegate) {

			$rootScope.selectedUsers = [];
			$rootScope.selectedEls = [];

			$rootScope.currentOrg = _.findWhere($rootScope.allOrgs, {
				id: $stateParams.id
			});

			// bulk sms
			$scope.bulkSMS = function() {

				if ($rootScope.selectedUsers.length <= 0) {
					$scope.$parent.dialog('Tap an avatar to select a user');
				}
				else {
					console.log('> bulk sms');

					// collect all numbers
					var cells = '';
					for (var x = 0; x < $rootScope.selectedUsers.length; x++) {
						if ($rootScope.selectedUsers[x].cellPhone !== '') {
							cells += $rootScope.selectedUsers[x].sms;
							cells += ',';
						}
					}
					window.location.href = 'sms:' + cells;

					$timeout(function() {
						$scope.clearAllSelectedUsers();
					}, 800);

				}
			};

			$scope.bulkEmail = function() {
				if ($rootScope.selectedUsers.length <= 0) {
					$scope.$parent.dialog('Tap an avatar to select a user');
				}
				else {
					console.log('> bulk email');

					var emails = '';
					for (var y = 0; y < $rootScope.selectedUsers.length; y++) {
						if ($rootScope.selectedUsers[y].email !== '') {
							emails += $rootScope.selectedUsers[y].email;
							emails += ',';
						}
					}
					window.location.href = 'mailto:' + emails;
				}

				$timeout(function() {
					$scope.clearAllSelectedUsers();
				}, 800);
			};


			$scope.bulkPIN = function() {
				if ($rootScope.selectedUsers.length <= 0) {
					$scope.$parent.dialog('Tap an avatar to select a user');
				}
				else {
					console.log('> bulk pin');
					var pins = '';
					for (var y = 0; y < $rootScope.selectedUsers.length; y++) {
						if ($rootScope.selectedUsers[y].bbPin !== '') {
							pins += $rootScope.selectedUsers[y].bbPin;
							pins += ',';
						}
					}
					blackberry.invoke.invoke({
						uri: 'pinto:' + pins + '?subject=ECL Message&body=You have received this message in an emergency situation.'
					}, function() {
						console.log('pin success');
					}, function() {
						console.log('pin fail');
					});
				}

				$timeout(function() {
					$scope.clearAllSelectedUsers();
				}, 800);
			};


			// toggle select
			$scope.selectUser = function(user, $event) {
				$event.stopPropagation();

				var el = angular.element($event.currentTarget);
				var parentEl = angular.element(el).parent();
				var isSelected = angular.element(parentEl).hasClass('selected-user');

				// de-select
				if (isSelected) {
					this.clearSelection(el, parentEl, user.id);

					if ($rootScope.selectedUsers.length <= 0) {
						$rootScope.clearSelects = false;
						$timeout(function() {
							$rootScope.selectMode = false;
						}, 250);

					}
				}

				// select
				else {
					$rootScope.selectMode = true;
					$timeout(function() {
						$rootScope.clearSelects = true;
					}, 250);

					ionic.on('webkitAnimationEnd', function() {
						var alreadyHasListener = el.attr('hasSelectListener');
						if (alreadyHasListener) {
							el.css('opacity', 1);
							el[0].src = "assets/selectedIcon.jpg";
							return;
						}
						el.css('opacity', 1);
						el[0].src = "assets/selectedIcon.jpg";
						el.attr('hasSelectListener', true);

					}, $event.currentTarget);

					el.addClass('spin-thumbnail');
					parentEl.addClass('selected-user');

					var _user = {
						id: user.id,
						sms: user.cellPhone,
						email: user.email,
						bbPin: user.bbPin
					};

					$rootScope.selectedUsers.push(_user);
					$rootScope.selectedEls.push(el);
				}
			};


			// clear specific selection
			$scope.clearSelection = function(el, parentEl, id) {
				el[0].src = el.attr('ng-src');
				el.removeClass('spin-thumbnail');
				parentEl.removeClass('selected-user');
				$rootScope.selectedUsers = _.without($rootScope.selectedUsers, _.findWhere($rootScope.selectedUsers, {
					id: id
				}));
			};


			// clear all selections
			$scope.clearAllSelectedUsers = function() {
				for (var el in $rootScope.selectedEls) {
					var _el = $rootScope.selectedEls[el][0];
					var _parent = $rootScope.selectedEls[el].parent();
					_el.src = $rootScope.selectedEls[el].attr('ng-src');
					$rootScope.selectedEls[el].removeClass('spin-thumbnail');
					_parent.removeClass('selected-user');
				}

				$timeout(function() {
					$rootScope.selectMode = false;
				}, 250);

				$rootScope.clearSelects = false;
				$rootScope.selectedUsers.length = 0;
				$rootScope.selectedEls.length = 0;
				$scope.fabState = 'closed'; // causes the cancel selection to fire
			};


			// view user profile
			$scope.viewUser = function(id) {
				console.log('> view user');
				$state.go('app.user', {
					id: id
				});

				$timeout(function() {
					$scope.clearAllSelectedUsers();
				}, 800);
			};

		}
	]);
