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
