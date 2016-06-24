var mylastip = angular.module('mylastip', ['ngCookies']);

mylastip.controller('UserLogin', function ($scope, $http, $window, $cookies) {
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
                    // Leave the token even in the session storage
                    $window.sessionStorage.token = data.token;
                    // Let's prepare the cookie!
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1); // 1 day for now
                    $cookies.put("token", data.token, {'expires': expireDate});
                    // Update the message
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

/**
 * This is not used for now but I think it can be used to speed up login process. Interceptor works only
 * withing the $http calls and not for every get request in the browser, so how can I set the auth header
 * with this method? User uses the browser to navigate, you know.. :)
 */
mylastip.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        "request": function (config) {

            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = $window.sessionStorage.token;
            }
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