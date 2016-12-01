'use strict';

// Declare app level module which depends on views, and components
angular.module('brainsApp', [
	'ngRoute',
	'brainsApp.view'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view'});
}]);
