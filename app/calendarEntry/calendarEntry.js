(function (angular) {
    "use strict";

    var app = angular.module('myApp.calendarEntry', ['ngRoute', 'firebase.utils', 'firebase']);



    app.controller('CalendarEntryCtrl', ['$scope', '$filter', 'calendarEntryList', function($scope, $filter, calendarEntryList) {
        $scope.currentPhase = "ROOT";
        $scope.tasks = [];
        $scope.program = {
            startDate: "",
            ROOT: [],
            VEG: [],
            FLOWER: [],
            TRIM: []
        }
        $scope.orig = $scope.program;

        $scope.changePhase = function (changePhase) {
            $scope.currentPhase = changePhase;
            $scope.showTask($scope.currentPhase);
        }

        $scope.addTask = function (currentPhase, newDay, newHours, newTask) {
            //Firebase will treat some of the objects as array if more than half of the keys 
            // between 0 and the maximum key in the object have non-empty values
            // need to fix this later!!!!
            var tmpTask = {"day": parseInt(newDay), "hours": parseInt(newHours), "task": newTask};
            //console.log(typeof tmpTask['day']);
            $scope.program[currentPhase].push(tmpTask);
        }
        
       /** $scope.toArray = function(object){
            var array = [];
            for (var key in object) {
                array.push(object[key]);
            }

            array.sort(function (a, b) {
                a = parseInt(a[key]);
                b = parseInt(b[key]);
                return a - b;
            });
            return array;
        }**/

        $scope.showTask = function (currentPhase) {
            console.log($scope.program[currentPhase]);
            $scope.tasks = $scope.program[currentPhase];
        }

        $scope.addStartDate = function (date) {
            console.log(date);
            console.log(date.getTime());
            console.log(date.getDate());
            var dateConverted = $filter('date')(date, "dd/MM/yyyy");
            console.log(dateConverted);
            $scope.program["startDate"] = dateConverted;
        }

        $scope.calendarEntries = calendarEntryList;
        $scope.addProgram = function () {
            console.log($scope.program);
            var ref = new Firebase("https://viridian-49902.firebaseio.com");
            var cEntries = ref.child("calendarEntries");
            var data = angular.copy($scope.program);
            cEntries.push(data);
            console.log(data);
            //$scope.calendarEntries.$add($scope.program);
            $scope.program = {
                startDate: "",
                ROOT: [],
                VEG: [],
                FLOWER: [],
                TRIM: []
            }
            $scope.currentPhase = "ROOT";
            $scope.tasks = [];
            console.log($scope.tasks);
      };

    }]);

  app.factory('calendarEntryList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
      var ref = fbutil.ref('calendarEntries');
    return $firebaseArray(ref);
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/calendarEntry', {
      templateUrl: 'calendarEntry/calendarEntry.html',
      controller: 'CalendarCtrl'
    });
  }]);

})(angular);
