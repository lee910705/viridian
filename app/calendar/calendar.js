(function (angular) {
  "use strict";

  var app = angular.module('myApp.calendar', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('CalendarCtrl', ['$scope', function ($scope) {
      $scope.jsonHeatMap = {};
      $scope.getData = function () {
          var objectHeatMap = {};
          // Get a database reference to our posts
          var ref = new Firebase("https://viridian-49902.firebaseio.com/calendarEntries");
          // Attach an asynchronous callback to read the data at our posts reference
          ref.on("value", function (snapshot) {
              angular.forEach(snapshot.val(), function(value){
                  var date = $scope.createDate(value["startDate"]);
                  var maxROOT = $scope.getMax(value["ROOT"]);
                  
                  for (var i = 0; i < maxROOT; i++) {
                      objectHeatMap[date] = "ROOT";
                      date.setDate(date.getDate() + 1);
                  }

                  var maxVEG = $scope.getMax(value["VEG"]);

                  for (var i = 0; i < maxVEG; i++) {
                      objectHeatMap[date] = "VEG";
                      date.setDate(date.getDate() + 1);
                  }

                  var maxFLOWER = $scope.getMax(value["FLOWER"]);

                  for (var i = 0; i < maxFLOWER; i++) {
                      objectHeatMap[date] = "FLOWER";
                      date.setDate(date.getDate() + 1);
                  }

                  var maxTRIM = $scope.getMax(value["TRIM"]);

                  for (var i = 0; i < maxTRIM; i++) {
                      objectHeatMap[date] = "TRIM";
                      date.setDate(date.getDate() + 1);
                  }

              });
             
              $scope.jsonHeatMap = angular.toJson(objectHeatMap);
              console.log($scope.jsonHeatMap);

          }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
          });
      }

      $scope.createDate = function (str) {
          var day = parseInt(str.slice(0, 2));
          var month = parseInt(str.slice(3, 5));
          var year = parseInt(str.slice(6, 10));
          var date = new Date(year, month, day);
          return date;
      }

      $scope.getMax = function (obj) {
          var max = 0;
          angular.forEach(obj, function (value, key) {
              if (parseInt(key) > max) {
                  max = parseInt(key);
              }
          });
          return max;
      }
      var init = function () {
          $scope.getData();
      }
      init();
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