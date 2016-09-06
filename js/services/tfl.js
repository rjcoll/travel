angular.module('tflLiveData', []).
service('Data', ['$http', '$q', function ($http, $q) {
  var my_Date = new Date();
  var rates = {};
  var urlBase = function(id) {
    return "https://api.tfl.gov.uk/StopPoint/" + id+ "/Arrivals?app_id=&app_key="
  }



  this.getTimes = function (id) {
    return $http({
       method: 'Get',
       url: urlBase(id),
    }).then(function(results) {
       console.log(results);
       return results.data
    }, function(error) {
       console.log(error);
       return $q.reject(error);
    });
  };
}]);

app.controller('tflController', ['$scope', '$timeout', 'Data', function($scope, $timeout, Data) {
  $scope.init = function(id) {
    $scope.data = [];
    var rates = {};
    (function tick() {
      Data.getTimes(id).then(function(data){
        $scope.data = data;
        console.log(data)
      })['finally'](function() {
        $timeout(tick, 1000);
      });
    })();
  }

}]);
