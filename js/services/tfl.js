angular.module('tflLiveData', []).
service('Data', ['$http', '$q', function ($http, $q) {
  var my_Date = new Date();
  var rates = {};
  var urlBaseStop = function(key) {
    return "https://api.tfl.gov.uk/StopPoint/" + key
  }



  this.getTimes = function (key) {
    return $http({
       method: 'Get',
       url: urlBaseStop(key) + "/Arrivals?app_id=&app_key=",
    }).then(function(results) {
       console.log(results);
       return results.data
    }, function(error) {
       console.log(error);
       return $q.reject(error);
    });
  };

  this.getStation = function (key) {
    return $http({
       method: 'Get',
       url: urlBaseStop(key),
    }).then(function(results) {
       return results.data
    }, function(error) {
       console.log(error);
       return $q.reject(error);
    });
  };
}]);

app.controller('stationController', ['$scope','$http', function($scope, $http) {
  $http.get('config.json')
    .success(function(data) {
      $scope.list = data.list
    });
}]);

app.controller('timeController', ['$scope','$timeout','$http','Data', function($scope, $timeout, $http, Data) {


  (function tick() {
    Data.getTimes("910GHONROPK").then(function(data){
      $scope.data = data;
      console.log(data);

      svg = d3.select("svg");
      g = svg.append("g");
      width = svg.attr("width");
      height = svg.attr("height");

      var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

      var x = d3.scaleTime().range([width - 40, 0])


      d3.selectAll(".axis").remove()

      d3.selectAll("g.bus").remove()

      x.domain([
        Date.now(),
        d3.max(data, function(d) {return Date.parse(d.expectedArrival)})
      ])

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(20," + (height - 20)+ ")")
        .call(d3.axisBottom(x));

      bus = g.selectAll("g.bus")
        .data(data)
          .enter()
        .append("g")
          .attr("class", "bus");

      bus
        .append('circle')
        .attr("r", 4)
        .attr("cy", height - 20)
        .attr("cx", function(d) {return x(Date.parse(d.expectedArrival)) + 20})
        .attr("fill", "black")


    })['finally'](function() {
      $timeout(tick, 1000)
    });
  })();

}]);




  app.controller('tflDataController', ['$scope', '$timeout', 'Data', function($scope, $timeout, Data) {
    var key = $scope.stop
    $scope.data = [];
    $scope.station = "";

    Data.getStation(key).then(function(data){
      $scope.station = data
      console.log(data)
    });

    (function tick() {
      Data.getTimes(key).then(function(data){
        $scope.data = data;
        console.log(data);
      })['finally'](function() {
        $timeout(tick, 1000);
      });
    })();
}]);

app.directive('tablewidget', function(){
    return {
      restrict: "E",
      scope: {
        stop: "="
      },
      templateUrl : 'js/services/tableWidget.html',
      controller: 'tflDataController'
    }
  })
