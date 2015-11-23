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

                var couponsInfo = [];
                rep.coupons = eval(rep.coupons);
                if (rep.coupons.length == 1) {
                    couponsInfo.push(rep.coupons[0]);
                }
                voucherService.setCouponInfo(couponsInfo).then(function(repCouponsInfo) {
                    angular.forEach(repCouponsInfo, function(item, index) {
                        var coupons = {
                            'group': '[' + item.data.id + ']',
                            'name': item.data.percent === 0 ? item.data.discount / 100 + '.00元' : item.data.percent / 10 + '折'
                        };
                        AppConstants.vouchers.push(coupons);
                    });

                    $window.sessionStorage.setItem('vouchers', JSON.stringify(AppConstants.vouchers));
                    $state.go('couponResult');
                });
            } else {
                $state.go('notFound');
            }
        }).error(function(data) {
            alert(data.reason);
        });
    };

    /** when click share button , show wechat indicate tip**/
    $scope.wxDownloadTip = function($event) {
        window.location.href = './views/templates/download.html';
    };

};
controllersModule.controller(controllerName, AcquireCouponCtrl);
