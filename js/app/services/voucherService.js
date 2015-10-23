'use strict';

var servicesModule = require('./services.js');
var serviceName = 'voucherService';
var voucherService = function($http, $window, $location, $q, AppConstants) {

    var service = {};

    var promise = function(url, method) {

        var promise = $http({
            method: method,
            url: url,
            cache: 'false'
        });

        return promise;
    };

    service.getAuth = function() {
        var url = AppConstants.getApiPrefix() + '/auth';

        return promise(url, 'GET');

    };

    service.authorize = function(accessLevel, role) {
        if (role === undefined) {
            role = {
                bitMask: 1,
                title: "redirect"
            };
        }
        return accessLevel.bitMask & role.bitMask;
    };

    service.lottery = function(lot) {
        var url = AppConstants.getApiPrefix() + '/lottery?lot=:lot';

        url = url.replace(':lot', lot);

        return promise(url, 'GET');
    };

    service.getParticipants = function(lot) {
        var url = AppConstants.getApiPrefix() + '/lottery/history?lot=:lot';

        url = url.replace(':lot', lot);

        return promise(url, 'GET');
    };

    return service;
};

servicesModule.factory(serviceName, voucherService);

