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

.run(function($ionicPlatform, $rootScope, Utils, $state, $timeout, $ionicLoading) {
	$ionicPlatform.ready(function() {

		// just for testing - loads the temp json into local storage. uncomment, refresh, then recomment and refresh

		// setTimeout(function() {
		// 	Utils.updateJSON(tmpJSON);
		// }, 1000);

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

		document.addEventListener("deviceready", function() {
			pushHandler.createPushService();

			// onInvoke callback
			var _invokeHandler = function(payload) {
				pushHandler.onInvoke(payload,
					function(parsedJSON) {
						Utils.updateJSON(
							parsedJSON,
							function() {
								// despite the fact that localstorage is a synch call we need to wait a few before exitting
								setTimeout(function() {
									blackberry.app.exit();
								}, 2500);
							});
					},
					function(e) {
						$ionicLoading.show({
							template: 'Error parsing update'
						});
						$timeout(function() {
							$ionicLoading.hide();
						}, 2000);
					});
			};

			document.addEventListener("invoked", _invokeHandler);
		}, false);

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
		.state('app.allOrgs', {
			url: "/allOrgs",
			views: {
				'menuContent': {
					templateUrl: "views/allOrgs/allOrgs.html",
					controller: 'AllOrgsCtrl'
				}
			}
		})
		.state('app.org', {
			url: "/org/:id",
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


// dummy json for testing
var tmpJSON = [{
	"title": "Small-sized ECL List",
	"list": [{
		"name": "Marisa Cotton",
		"title": "Yurture of Extrawear",
		"officePhone": "+1 (813) 485-3849",
		"cellPhone": "+1 (987) 477-2639",
		"email": "marisacotton@extrawear.com",
		"bbPin": "01098A8F",
		"backup": "Hattie Boyer"
	}, {
		"name": "Hattie Boyer",
		"title": "Manager",
		"officePhone": "+1 (983) 451-2681",
		"cellPhone": "+1 (996) 433-3176",
		"email": "gloverbanks@comvene.com",
		"bbPin": "07076A8F",
		"backup": "Hattie Boyer"
	}, {
		"name": "Glover Banks",
		"title": "Ronelon of Comvene",
		"officePhone": "+1 (983) 451-2681",
		"cellPhone": "+1 (996) 433-3176",
		"email": "gloverbanks@comvene.com",
		"bbPin": "07076A8F",
		"backup": "Hattie Boyer"
	}, {
		"name": "Clark Dillon",
		"title": "Empirica of Xumonk",
		"officePhone": "+1 (950) 445-2555",
		"cellPhone": "+1 (886) 537-2146",
		"email": "clarkdillon@xumonk.com",
		"bbPin": "07977A8F",
		"backup": "Hattie Boyer"
	}, {
		"name": "Gould Fulton",
		"title": "Netplode of Teraprene",
		"officePhone": "+1 (901) 461-2448",
		"cellPhone": "+1 (960) 555-2795",
		"email": "gouldfulton@teraprene.com",
		"bbPin": "08312A8F",
		"backup": "Hattie Boyer"
	}, {
		"name": "Vargas Giles",
		"title": "Quilk of Entropix",
		"officePhone": "+1 (828) 450-3857",
		"cellPhone": "+1 (993) 590-3552",
		"email": "vargasgiles@entropix.com",
		"bbPin": "06517A8F",
		"backup": "Hattie Boyer"
	}]
}, {
	"title": "Team Honotron",
	"list": [{
		"name": "Paulette Porter",
		"title": "Intergeek of Geostele",
		"officePhone": "+1 (848) 549-2852",
		"cellPhone": "+1 (925) 540-2173",
		"email": "pauletteporter@geostele.com",
		"bbPin": "04190A8F",
		"backup": "Raymond Landry"
	}, {
		"name": "Emily Burton",
		"title": "Sunclipse of Geofarm",
		"officePhone": "+1 (979) 508-2793",
		"cellPhone": "+1 (827) 525-3920",
		"email": "emilyburton@geofarm.com",
		"bbPin": "08354A8F",
		"backup": "Carlson Reeves"
	}, {
		"name": "Kimberley Greer",
		"title": "Avenetro of Deviltoe",
		"officePhone": "+1 (921) 544-3141",
		"cellPhone": "+1 (831) 539-3019",
		"email": "kimberleygreer@deviltoe.com",
		"bbPin": "06192A8F",
		"backup": "Margaret Moran"
	}, {
		"name": "Burton Hayden",
		"title": "Earthpure of Cormoran",
		"officePhone": "+1 (860) 583-3895",
		"cellPhone": "+1 (950) 482-2304",
		"email": "burtonhayden@cormoran.com",
		"bbPin": "04005A8F",
		"backup": "Melinda Sellers"
	}, {
		"name": "Billie Koch",
		"title": "Capscreen of Xiix",
		"officePhone": "+1 (857) 543-3819",
		"cellPhone": "+1 (893) 429-3785",
		"email": "billiekoch@xiix.com",
		"bbPin": "08796A8F",
		"backup": "Reese Tyson"
	}]
}];
