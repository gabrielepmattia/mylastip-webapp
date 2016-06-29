angular.module('membersRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
    // home page
        .when('/', {
            templateUrl: '/views/members/home.html',
            controller: 'MainController'
        })
        .when('/device/:id', {
            templateUrl: '/views/members/device.html',
            controller: 'DeviceController'
        });
    $locationProvider.html5Mode(true);
}]);