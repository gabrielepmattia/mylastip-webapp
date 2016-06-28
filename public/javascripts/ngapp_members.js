var mylastip_members = angular.module('mylastip_members', [
    'ngCookies',
    'ngRoute',
    'MainCtrl',
    'DeviceCtrl',
    'membersRoutes'
]);

mylastip_members.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
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

mylastip_members.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});