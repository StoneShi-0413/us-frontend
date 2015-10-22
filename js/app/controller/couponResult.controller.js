'use strict';

var controllersModule = require('./controllers');
var controllerName = 'CouponResultController';
var couponResultCtrl = function($scope, $stateParams, friendQueue) {

    var lotteryObject = friendQueue.myProfile;

    var arr1 = eval(friendQueue.queue),
        vouchers = AppConstants.vouchers,
        voucherName = '';
    angular.forEach(vouchers, function(item, index) {
        var arr2 = eval(item.group);
        if ($(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0) {
            voucherName = vouchers[index].name;
        }
    });
    alert(voucherName);
    $scope.friendQueues = voucherName;
    if (lotteryObject.hasOwnProperty('code')) {
        $scope.code = lotteryObject.code;
        $scope.img_url = './img/vouchered2.jpg';
    } else {
        $scope.code = '';
        $scope.img_url = './img/vouchered1.jpg';
    }
    alert(JSON.stringify(friendQueue.queue));
};
controllersModule.controller(controllerName, couponResultCtrl);
