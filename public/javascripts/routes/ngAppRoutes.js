// public/js/appRoutes.js
angular.module('ngAppRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        // home page
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'MainController'
        })

        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'UserLoginController'
        });
    $locationProvider.html5Mode(true);
}]);