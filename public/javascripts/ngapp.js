var mylastip = angular.module('mylastip', []);

mylastip.controller('UserLogin', function ($scope, $http, $window) {
    $scope.user = {username: 'john.doe', password: 'foobar'};
    $scope.message = '';
    $scope.submit = function () {
        $scope.message = 'Loading..';
        $http
            .post('/api/authenticate', $scope.user)
            .success(function (data, status, headers, config) {
                // If response of authentication is positive..
                if (!data.success) {
                    $scope.message = 'Name or password are invalid.';
                }
                else {
                    $window.sessionStorage.token = data.token;
                    $scope.message = 'Welcome';
                }
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;
                // Handle login errors here
                $scope.message = 'There was an error during login. Please contact the admin.';
            });
    };
});

mylastip.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = $window.sessionStorage.token;
                config.headers['TestHEADER'] = "this is a test present";
            } else {
                config.headers['TestHEADER'] = "this is a test not present";
            }
            config.headers['TestHEADER'] = "test";
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        }
    };
});

mylastip.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});