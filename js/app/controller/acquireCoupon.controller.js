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
                friendQueue.myProfile = rep;
                $state.go('couponResult');
            }
        }).error(function(data) {
            alert(data.reason);
        });
        
        /*//just test
        var rep = {
            "id": 469,
            "us_id": "o-AMtt_hv8xAxjowLwMxaVO4U3IU",
            "name": "stone",
            "iconid": 4066,
            "coupons": "[5]",
            "lot_date": 1445515636000
        };
        friendQueue.myProfile = rep;
        $state.go('couponResult');*/
    };
};
controllersModule.controller(controllerName, AcquireCouponCtrl);
