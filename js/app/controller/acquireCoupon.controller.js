'use strict';

var controllersModule = require('./controllers');
var controllerName = 'AcquireCouponController';
var AcquireCouponCtrl = function($scope, $stateParams, $state, voucherService) {
    $scope.couponResult = function($event) {

        $event.preventDefault()
        var lotParam = $stateParams.lot;
        voucherService.lottery(lotParam).success(function(response) {
            var rep = response;
            if (rep.result) {
                console.log(rep);
                $state.go('couponResult', {
                    lotteryObj: JSON.stringify(rep)
                });
            }
        }).error(function(data) {
            $state.go('message', {
                messages: JSON.stringify(data)
            });
        });
    };
};
controllersModule.controller(controllerName, AcquireCouponCtrl);
