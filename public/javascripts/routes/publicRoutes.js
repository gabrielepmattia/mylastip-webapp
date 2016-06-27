angular.module('publicRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
    // home page
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'MainController'
        })

        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'UserLoginController'
        })
        .when('/members', {
            redirectTo: '/members'
            //template:'<META http-equiv="refresh" content="1;URL=/members">Authenticating in 1 second...'
            //templateUrl: '/views/login.html',
            //controller: 'UserLoginController'
        });
    $locationProvider.html5Mode(true);
}]);