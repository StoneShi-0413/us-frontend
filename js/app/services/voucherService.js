'use strict';

var servicesModule = require('./services.js');
var serviceName = 'voucherService';
var voucherService = function ($http, $window, $location, $q, AppConstants) {

    var service = {};


    //initial data;
    var userRoles = AppConstants.buildRoles(AppConstants.roles),
        accessLevels = AppConstants.buildAccessLevels(AppConstants.accessLevels, userRoles);


    service.isExistCoupon = function() {
        //var url = 'http://www.us-app.com/usmvn/wexin/auth';
        var url = 'http://www.us-app.com/usmvn/party';

        return promise(url, 'GET');
    };

    service.isBindingUsApp = function() {
        //var url = 'http://www.us-app.com/usmvn/wexin/auth';
        var url = 'http://www.us-app.com/usmvn/party';

        // Return the promise to the controller
        return promise(url, 'GET');
    };

    var promise = function(url, method) {

        var promise = $http({
            method: method,
            url: url,
            cache: 'false'
        });

        return promise;
    };

    service.getAuth = function() {
        var url = 'http://www.us-app.com/usmvn/weixin/auth';
        //var url = 'http://www.us-app.com/usmvn/party';

        return promise(url, 'GET').then(function(response) {

            var authJson = {
                    //redirect: 'http://www.baidu.com',
                    union_id: 'union_id_00001',
                    uid: 'us_00000001'
                }, //response.data,
                user = {},
                value = authJson.hasOwnProperty('union_id') ? 'union_id' : (authJson.hasOwnProperty('uid') ? 'uid' : (authJson.hasOwnProperty('redirect') ? 'redirect' : 'redirect')),
                tempUser = JSON.stringify({
                    userObj: {},
                    role: userRoles[value]
                });
            /*
                            if(response.data.redirect){
                                $window.location.href = response.data.redirect;
                            }*/

            $window.sessionStorage.setItem('user', tempUser);

            return authJson;

        });

    };

    service.getCurrentUser = function() {
        return JSON.parse($window.sessionStorage.getItem('user'));
    };

    service.authorize = function(accessLevel, role) {
        if (role === undefined) {
            role = this.getCurrentUser().role;
        }
        return accessLevel.bitMask & role.bitMask;
    };

    return service;
}

//var AppConstants =  require('./constants');
servicesModule.service(serviceName, ['$http', '$window', '$location', '$q', 'AppConstants', voucherService]);
