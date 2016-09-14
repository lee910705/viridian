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


      var margin = { top: 5.5, right: 0, bottom: 5.5, left: 19.5 },
          width = 960 - margin.left - margin.right,
          height = 130 - margin.top - margin.bottom,
          size = height / 7;

      var day = function (d) { return (d.getDay() + 6) % 7; }, // monday = 0
          week = d3.time.format("%W"), // monday-based week number
          date = d3.time.format("%Y-%m-%d"),
          percent = d3.format("+.1%");

      var color = d3.scale.quantize()
          .domain([-.05, .05])
          .range(d3.range(9));

      var svg = d3.select("body").selectAll("svg")
          .data(d3.range(2016, 2017))
          .enter().append("svg")
          .attr("class", "RdYlGn")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("text")
          .attr("transform", "translate(-6," + size * 3.5 + ")rotate(-90)")
          .attr("text-anchor", "middle")
          .text(function (d) { return d; });

      var rect = svg.selectAll(".day")
          .data(function (d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
          .enter().append("rect")
          .attr("class", "day")
          .attr("width", size)
          .attr("height", size)
          .attr("x", function (d) { return week(d) * size; })
          .attr("y", function (d) { return day(d) * size; })
          .datum(date);

      rect.append("title")
          .text(function (d) { return d; });

      svg.selectAll(".month")
          .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
          .enter().append("path")
          .attr("class", "month")
          .attr("d", monthPath);


      console.log("Imported JSON");
      //var data = $scope.jsonHeatMap;
      console.log($scope.jsonHeatMap);

      //d3.json("/app/calendar/json.json", function (json) {
      var json = $scope.jsonHeatMap;
          var data = d3.nest()
              .key(function (d) { return d.Date; })
              .rollup(function (d) { return (d[0].Close - d[0].Open) / d[0].Open; })
              .map(json);

          rect.filter(function (d) { return d in data; })
              .attr("class", function (d) { return "day q" + color(data[d]) + "-9"; })
          .select("title")
              .text(function (d) { return d + ": " + percent(data[d]); });
      //});

      function monthPath(t0) {
          var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
              d0 = +day(t0), w0 = +week(t0),
              d1 = +day(t1), w1 = +week(t1);
          return "M" + (w0 + 1) * size + "," + d0 * size
              + "H" + w0 * size + "V" + 7 * size
              + "H" + w1 * size + "V" + (d1 + 1) * size
              + "H" + (w1 + 1) * size + "V" + 0
              + "H" + (w0 + 1) * size + "Z";
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