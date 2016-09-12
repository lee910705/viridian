(function (angular) {
  "use strict";

  var app = angular.module('myApp.calendar', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('CalendarCtrl', ['$scope', function($scope) {

    }]);

  app.factory('calendarList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/calendar', {
      templateUrl: 'calendar/calendar.html',
      controller: 'CalendarCtrl'
    });
  }]);

})(angular);