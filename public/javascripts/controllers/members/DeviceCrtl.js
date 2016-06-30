angular.module('DeviceCtrl', []).controller('DeviceController', function ($scope, $routeParams, $http) {
    //$scope.tagline = 'MyLastIPtestmain';
    var ID = $routeParams.id;
    $scope.message = "Device #" + ID;
    $scope.load = function () {
        $http
            .post('/api/get_device_info', {id: ID})
            .success(function (data, status, headers, config) {
                if (!data.success) $scope.message = "Device does not exist.";
                else {
                    var device = data.device;
                    $scope.device_name = device.name;
                    $scope.device_key = device.key;
                    $scope.registered = device.registered_on; // TODO use angular-moment to convert
                    if (device.data.length == 0) $scope.message = "No log data for this device yet.";
                    else {
                        $scope.message = "";
                        $scope.logdata = device.data;
                    }
                }
            })
            .error(function (data, status, headers, config) {
                $scope.message = "There was an error getting the data #070#" + status + " :( Please send this to the admin!";
            })
    };
    $scope.load();
});