angular.module('membersRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
    // home page
        .when('/', {
            templateUrl: '/views/members/home.html',
            controller: 'MainController'
        });
    $locationProvider.html5Mode(true);
}]);