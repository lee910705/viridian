'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'myApp.config',
    'myApp.dashboard',
    'myApp.runoff',
    'myApp.calendar',
    'myApp.calendarEntry'
])
  
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/dashboard'
    });
  }])
  
  /**.run(['$rootScope', 'Auth', function($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);**/
