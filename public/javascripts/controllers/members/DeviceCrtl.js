angular.module('DeviceCtrl', []).controller('DeviceController', function($scope, $routeParams) {
    //$scope.tagline = 'MyLastIPtestmain';
    var ID = $routeParams.ID;
    $scope.message = "Device #" + ID;
    //$scope.message = "Device #";
});