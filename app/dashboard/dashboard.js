(function (angular) {
  "use strict";

  var app = angular.module('myApp.dashboard', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('DashboardCtrl', [function() {
    }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl'
    });
  }]);

})(angular);