'use strict';

var controllersModule = require('./controllers');
var controllerName = 'AcquireCouponController';
var AcquireCouponCtrl = function($scope, $stateParams, $state, voucherService, AppConstants, friendQueue) {
    $scope.couponResult = function($event) {
        $event.preventDefault()
        var lotParam = AppConstants.queryString().lot;
        voucherService.lottery(lotParam).success(function(response) {
            var rep = response;
            if (rep.result=="OK") {
                alert(JSON.stringify(rep));
                friendQueue.myProfile = rep;
                $state.go('couponResult');
            }
        }).error(function(data) {
            alert(data.reason);
        });
    };
};
controllersModule.controller(controllerName, AcquireCouponCtrl);
