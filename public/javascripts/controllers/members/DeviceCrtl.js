angular.module('DeviceCtrl', []).controller('DeviceController', function ($scope, $routeParams, $http) {
    //$scope.tagline = 'MyLastIPtestmain';
    var ID = $routeParams.id;
    var device;
    $scope.load = function () {
        $http
            .post('/api/get_device_info', {id: ID})
            .success(function (data, status, headers, config) {
                if (!data.success) $scope.message = "Device does not exist.";
                else {
                    // Get the device from response
                    device = data.device;
                    // Assign device variable to scope
                    $scope.device = device;
                    $scope.registered = device.registered_on; // TODO use angular-moment to convert
                    if (device.logdata.length == 0) {
                        $scope.ip_container = {display: 'none'};
                        $scope.message = "No log data for this device yet.";
                    }
                    else {
                        $scope.ip_container = {display: 'block'};
                        if (device.logdata.length == 1) $scope.message = device.logdata.length + " entry for this device";
                        else $scope.message = device.logdata.length + " entries for this device";
                        $scope.logdata = device.logdata;
                    }
                }
            })
            .error(function (data, status, headers, config) {
                $scope.message = "There was an error getting the data #070#" + status + " :( Please send this to the admin!";
            })
    };
    $scope.load();

    $scope.clearLog = function () {
        $http
            .post('/api/remove_all_logdata', {id: device._id})
            .success(function (data, status, headers, config) {
                if (!data.success) $scope.message = "Device does not exist.";
                else {
                    $scope.logdata = {};
                    $scope.load();
                }
            });
    }
});