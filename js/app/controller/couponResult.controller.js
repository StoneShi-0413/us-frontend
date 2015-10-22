'use strict';

var controllersModule = require('./controllers');
var controllerName = 'CouponResultController';

var pickUpSamePackageName = function(arr, AppConstants) {
    var vouchers = AppConstants.vouchers,
        arr1 = eval(arr),
        voucherName = '';
    angular.forEach(vouchers, function(item, index) {
        var arr2 = eval(item.group);
        if ($(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0) {
            voucherName = vouchers[index].name;
        }
    });
    return voucherName;
}
var couponResultCtrl = function($scope, $stateParams, friendQueue, AppConstants) {

    var lotteryObject = friendQueue.myProfile;
    lotteryObject.couponsName = pickUpSamePackageName(friendQueue.myProfile.coupons, AppConstants);

    friendQueue.queue = angular.forEach(friendQueue.queue, function(item, index) {
        item.couponsName = pickUpSamePackageName(item.coupons, AppConstants);
        item.profileImgUrl ='http://www.us-app.com/usmvn/image/'+item.iconid;
        return item;
    });

    $scope.lotteryObj = lotteryObject;
    $scope.friendQueues = friendQueue.queue;
    if (lotteryObject.hasOwnProperty('code')) {
        $scope.code = lotteryObject.code;
        $scope.img_url = './img/vouchered2.jpg';
    } else {
        $scope.code = '';
        $scope.img_url = './img/vouchered1.jpg';
    }
};
controllersModule.controller(controllerName, couponResultCtrl);
