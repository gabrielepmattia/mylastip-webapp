angular.module('MainCtrl', []).controller('MainController', function ($scope, $http, $window) {
    //$scope.tagline = 'MyLastIPtestmain';
    $scope.load = function () {
        $http
            .post('/api/get_user_devices', {})
            .success(function (data, status, headers, config) {
                if (!data.success) $scope.message = "You have no device registered.";
                else {
                    $scope.message = "";
                    $scope.devices = data.devices;
                }
            })
            .error(function (data, status, headers, config) {
                $scope.message = "There was an error getting the data. Please contact the admin";
            })
    };
    $scope.load();

    /**
     * Add device button
     */
    $scope.addDevice = function () {
        $scope.add_form = {display: 'block'};
    };

    /**
     * Save device logic
     */
    $scope.saveDevice = function () {
        $http
            .post('/api/add_user_device', $scope.new_device)
            .success(function (data, status, headers, config) {
                if (!data.success) $scope.new_device_message = data.msg;
                else $scope.new_device_message = data.msg;
                $scope.add_form = {display: 'none'};
                $scope.load();
            })
            .error(function (data, status, headers, config) {
                $scope.new_device_message = "There was an error saving the device. Please contact the admin";
            })
    }
});