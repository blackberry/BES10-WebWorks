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


angular.module('ecl', [
	'ionic',
	'ecl.services',
	'ecl.directives',
	'ng-mfb'
])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		console.log('> ionic is ready');
	});
})

// ionic global config
.config(function($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {

	// enable native scrolling
	if (!ionic.Platform.isIOS()) {
		$ionicConfigProvider.scrolling.jsScrolling(false);
	}

	// ionic overrides
	$ionicConfigProvider.navBar.alignTitle('center');
	$ionicConfigProvider.tabs.position('bottom');
	$ionicConfigProvider.tabs.style('standard');

	// URI whitelist setup
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|sms|tel|local|file|geo):/);
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|local|blob):|data:image\//);

	// state(s) setup
	$stateProvider
		.state('app', {
			url: "/app",
			abstract: true,
			templateUrl: "views/menu/menu.html",
			controller: 'LoginCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'views/login/login.html',
			contorller: 'LoginCtrl'
		})
		.state('app.org', {
			url: "/org",
			views: {
				'menuContent': {
					templateUrl: "views/org/org.html",
					controller: 'OrgCtrl'
				}
			}
		})
		.state('app.user', {
			url: "/user/:id",
			views: {
				'menuContent': {
					templateUrl: "views/user/user.html",
					controller: 'UserCtrl'
				}
			}
		});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/login');
});
