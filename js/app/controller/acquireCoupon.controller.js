'use strict';

var controllersModule = require('./controllers');
var controllerName = 'AcquireCouponController';
var AcquireCouponCtrl = function($scope, $state) {
    $scope.couponResult = function() {
        //isExistCoupon
        voucherService.isExistCoupon().then(function(data) {
            $state.go('couponResult');
        });
    };
};
controllersModule.controller(controllerName, AcquireCouponCtrl);
