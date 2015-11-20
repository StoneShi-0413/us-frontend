'use strict';

var controllersModule = require('./controllers');
var controllerName = 'AcquireCouponController';
var AcquireCouponCtrl = function($scope, $stateParams, $state, voucherService, AppConstants, friendQueue, $window) {

    /** click coupon ,get the lottery result **/
    $scope.couponResult = function(event) {
        event.preventDefault()
        var lotParam = AppConstants.queryString().lot;
        voucherService.lottery(lotParam).success(function(response) {
            var rep = response;
            if (rep.result == "OK") {
                friendQueue.myProfile = rep;
                $window.sessionStorage.setItem('myProfile', JSON.stringify(friendQueue.myProfile));
                $state.go('couponResult');
            } else {
                $state.go('notFound');
            }
        }).error(function(data) {
            alert(data.reason);
        });
        /*
        //just test
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

    /** when click share button , show wechat indicate tip**/
    $scope.wxDownloadTip = function($event) {
        window.location.href = './views/templates/download.html';
    };

};
controllersModule.controller(controllerName, AcquireCouponCtrl);
