(function (angular) {
  "use strict";

  var app = angular.module('myApp.calendar', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('CalendarCtrl', ['$scope', '$firebaseObject', function ($scope, $firebaseObject) {

      $scope.jsonHeatMap = {};
      $scope.getData = function () {
          var objectHeatMap = [];
          var ref = new Firebase("https://viridian-49902.firebaseio.com/calendarEntries");
          // Attach an asynchronous callback to read the data at our posts reference
          var snapshot = $firebaseObject(ref);
          /**obj.$loaded().then(function () {
              console.log("loaded record:", obj.$id);
          });
          **/
          //ref.$bindTo($scope, "data");
          /**$scope.data = snapshot;
          snapshot.$bindTo($scope, "data").then(function () {
              console.log("Snapshot taken");
              console.log(snapshot);
          });
          **/



           /*
           suggestion:
           require $q, then 1
           var obj = ref.$loaded();

           var arrayOfStuffINeed = [];
           var defer = $q.defer;

           for (key in obj){
           arrayOfStuffINeed.push(obj.key);
           defer.resolve(arrayOfStuffINeed)
           };

           $q.all(arrayOfStuffINeed).then(function(dataIJustGot){

           })
           */


          ref.on("value", function (snapshot) {
              angular.forEach(snapshot.val(), function (entry) {
                  var date = $scope.createDate(entry["startDate"]);
                  var maxROOT = $scope.getMax(entry["ROOT"]);
                  var maxVEG = $scope.getMax(entry["VEG"]);
                  var maxFLOWER = $scope.getMax(entry["FLOWER"]);
                  var maxTRIM = $scope.getMax(entry["TRIM"]);

                  var objROOT = entry["ROOT"];

                  for (var i = 0; i < maxROOT; i++) {
                      var tempObj = {};
                      tempObj["date"] = new Date(date);
                      tempObj["phase"] = "ROOT"
                      if (entry.hasOwnProperty("ROOT")) {
                          if ($scope.dayExists(entry["ROOT"], i + 1)) {
                              tempObj["hours"] = $scope.getDay(entry["ROOT"], i + 1);
                              tempObj["task"] = $scope.getTask(entry["ROOT"], i + 1);
                          } else {
                              tempObj["hours"] = null;
                              tempObj["task"] = null;
                          }
                      }
                      objectHeatMap.push(tempObj);
                      date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                      
                  }

                  for (var i = 0; i < maxVEG; i++) {
                      var tempObj = {};
                      tempObj["date"] = new Date(date);
                      tempObj["phase"] = "VEG"
                      if (entry.hasOwnProperty("VEG")) {
                          if (entry.hasOwnProperty("VEG")) {
                              if ($scope.dayExists(entry["VEG"], i + 1)) {
                                  tempObj["hours"] = $scope.getDay(entry["VEG"], i + 1);
                                  tempObj["task"] = $scope.getTask(entry["VEG"], i + 1);
                              } else {
                                  tempObj["hours"] = null;
                                  tempObj["task"] = null;
                              }
                          }
                      }
                      objectHeatMap.push(tempObj);
                      date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                  }

                  for (var i = 0; i < maxFLOWER; i++) {
                      var tempObj = {};
                      tempObj["date"] = new Date(date);
                      tempObj["phase"] = "FLOWER"
                      if (entry.hasOwnProperty("FLOWER")) {
                          if (entry.hasOwnProperty("FLOWER")) {
                              if ($scope.dayExists(entry["FLOWER"], i + 1)) {
                                  tempObj["hours"] = $scope.getDay(entry["FLOWER"], i + 1);
                                  tempObj["task"] = $scope.getTask(entry["FLOWER"], i + 1);
                              } else {
                                  tempObj["hours"] = null;
                                  tempObj["task"] = null;
                              }
                          }
                      }

                      objectHeatMap.push(tempObj);
                      date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                  }

                  for (var i = 0; i < maxTRIM; i++) {
                      var tempObj = {};
                      tempObj["date"] = new Date(date);
                      tempObj["phase"] = "TRIM"
                      if (entry.hasOwnProperty("TRIM")) {
                          if (entry.hasOwnProperty("TRIM")) {
                              if ($scope.dayExists(entry["TRIM"], i + 1)) {
                                  tempObj["hours"] = $scope.getDay(entry["TRIM"], i + 1);
                                  tempObj["task"] = $scope.getTask(entry["TRIM"], i + 1);
                              } else {
                                  tempObj["hours"] = null;
                                  tempObj["task"] = null;
                              }
                          }
                      }

                      objectHeatMap.push(tempObj);

                      date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                  }
                         
              });
             
              //$scope.jsonHeatMap = angular.toJson(objectHeatMap);
              $scope.jsonHeatMap = objectHeatMap;
              $scope.showHeatMap();

          }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
          });
      }

      $scope.createDate = function (str) {
          var day = parseInt(str.slice(0, 2));
          var month = parseInt(str.slice(3, 5));
          var year = parseInt(str.slice(6, 10));
          var date = new Date(year, month-1, day);
          return date;
      }

      $scope.getMax = function (obj) {
          var max = 0;
          angular.forEach(obj, function (value) {
              if (parseInt(value["day"]) > max) {
                  max = parseInt(value["day"]);
              }
          });
          return max;
      }

      $scope.dayExists = function (objArray, day) {
          for (var i = 0; i < objArray.length; i++) {
              if (objArray[i]["day"] == day) return true;
          }
          return false;
      }

      $scope.getDay = function(objArray, day){
          for(var i = 0; i < objArray.length; i++){
              if(objArray[i]["day"] == day) return objArray[i]["day"];
          }
      }
      
      $scope.getTask = function(objArray, day){
          for(var i = 0; i < objArray.length; i++){
              if(objArray[i]["day"] == day) return objArray[i]["task"];
          }
      }

      $scope.showHeatMap = function () {
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
              //.range(d3.range(4));
              .range(d3.range(4).map(function (d) {
                  if (d === "ROOT") { return 0; }
                  if (d === "VEG") { return 1; }
                  if (d === "FLOWER") { return 2; }
                  if (d === "TRIM") { return 3; }
              }));

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

          var json = $scope.jsonHeatMap;
          
          var data = d3.nest()
              .key(function (d) {
                  var currentDate = new Date(d.date);
                  var day = ('0' + currentDate.getDate()).slice(-2);
                  var month = ('0'+(parseInt(currentDate.getMonth())+1)).slice(-2);
                  var year = currentDate.getFullYear();
                  var dateString = year + '-' + month + '-' + day;
          
                  return dateString;
              })
              .sortKeys(d3.ascending)
              .rollup(function (d) {
                  return {
                      phase: d[0].phase
                  }
              })
              .map(json);

         

          rect.filter(function (d) { return d in data; })
              .style('fill', function (d) {
                  var phase = data[d]["phase"];
                  if (phase === "ROOT") { return '#ff0000'; }
                  if (phase === "VEG") { return '#00994c'; }
                  if (phase === "FLOWER") { return '#ffff00'; }
                  if (phase === "TRIM") { return '#66b2ff'; }
              })
              .select("title")
                .text(function (d) { return d + ": " + percent(data[d]); });

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