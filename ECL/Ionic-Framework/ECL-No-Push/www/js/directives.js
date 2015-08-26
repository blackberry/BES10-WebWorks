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


angular.module('ecl.directives', [])

// image placeholder
.directive('placeholder', function() {
	return {
		link: function($scope, element, attr) {
			var img = angular.element('<img />');
			img.src = $scope.ngSrc;

			// fallback to placeholder on load error
			element.bind('error', function() {
				element[0].src = 'assets/placeholder-photo.jpg';
			});

			img.on('load', function() {
				if (img.src !== undefined) {
					element[0].src = img.src;
				}
			});
		},
	};
});
