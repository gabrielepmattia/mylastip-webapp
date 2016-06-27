angular.module('UserLoginCrtl', []).controller('UserLoginController', function ($scope, $http, $window, $cookies) {
    $scope.user = {username: 'jane.doe', password: 'jane.doe'};
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
                    $scope.message = 'Welcome!';
                    $window.location = "/members";
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