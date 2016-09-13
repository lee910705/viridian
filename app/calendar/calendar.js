(function (angular) {
  "use strict";

  var app = angular.module('myApp.calendar', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('CalendarCtrl', ['$scope', function ($scope) {
      $scope.getData = function () {
          console.log("Getting data");
          // Get a database reference to our posts
          var ref = new Firebase("https://viridian-49902.firebaseio.com/calendarEntries");
          // Attach an asynchronous callback to read the data at our posts reference
          ref.on("value", function (snapshot) {
              console.log(snapshot.val());
              console.log(angular.toJson(snapshot.val()));
          }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
          });
      }
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