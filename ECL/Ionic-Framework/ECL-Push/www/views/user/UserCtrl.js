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
	.controller('UserCtrl', ['$scope', '$rootScope', '$state', '$stateParams',
		function($scope, $rootScope, $state, $stateParams) {

			// bit of hackery for the map
			$rootScope.Screen = {
				innerHeight: window.innerHeight - 230,
				innerWidth: window.innerWidth
			};

			$scope.profileUser = _.findWhere($rootScope.currentOrg.list, {
				id: $stateParams.id
			});

			$scope.profilePhotoBackground = $scope.profileUser.image;
			$scope.profilePhoto = $scope.profileUser.image;
			$scope.address = $scope.profileUser.address;

			// contact setup - used for invoking phone, email, etc
			$scope.profileUser.contact = [];
			var contactObject = {
				officePhone: $scope.profileUser.officePhone,
				cellPhone: $scope.profileUser.cellPhone,
				email: $scope.profileUser.email,
				bbPin: $scope.profileUser.bbPin
			};

			for (var type in contactObject) {
				var contactItem = {};
				var iconImg, contactType;

				if (type === 'officePhone') {
					iconImg = 'ios-telephone';
					contactType = 'Office';
				}
				else if (type === 'cellPhone') {
					iconImg = 'ios-telephone';
					contactType = 'Cell';
				}
				else if (type === 'email') {
					iconImg = 'email';
					contactType = 'Email';
				}
				else if (type === 'bbPin') {
					iconImg = 'person-add';
					contactType = 'PIN';
				}

				contactItem = {
					icon: iconImg,
					type: contactType,
					data: contactObject[type]
				};

				if ($rootScope.hideUnsupported) {
					if (type !== 'bbPin') {
						$scope.profileUser.contact.push(contactItem);
					}
				}
				else {
					$scope.profileUser.contact.push(contactItem);
				}
			}

			// invoke contact
			$scope.contactUser = function(index) {
				var type = $scope.profileUser.contact[index].type;
				var data = $scope.profileUser.contact[index].data;

				// case sensitive
				if (type === 'Email') {
					window.location.href = 'mailto:' + data;
				}
				else if (type === 'Cell' || type === 'Office') {
					window.location.href = 'tel:' + data;
				}
				else if (type === 'PIN') {
					blackberry.invoke.invoke({
						uri: 'pinto:' + data + '?subject=ECL Message&body=You have received this message in an emergency situation.'
					}, function() {
						console.log('pin success');
					}, function() {
						console.log('pin fail');
					});
				}
			};

			// view user profile
			$scope.viewBackupUser = function(user) {
				console.log('> view backup');

				var backupUser = _.findWhere($rootScope.currentOrg.list, {
					id: user.id
				}) || false;

				if (backupUser) {
					$state.go('app.user', {
						id: user.id
					});
				}
				else {
					$scope.$parent.dialog('No data available');
				}
			};
		}
	]);
