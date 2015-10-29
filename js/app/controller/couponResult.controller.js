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
};

var couponResultCtrl = function($scope, $stateParams, friendQueue, voucherService, AppConstants) {
  /*
    //just test
    var rep = {
            "id": 469,
            "us_id": "o-AMtt_hv8xAxjowLwMxaVO4U3IU",
            "name": "stone",
            "iconid": 4066,
            "coupons": "[5]",
            "lot_date": 1445515636000
        },


        rslt = [{
            "id": 469,
            "us_id": "o-AMtt_hv8xAxjowLwMxaVO4U3IU",
            "name": "stone",
            "iconid": 4066,
            "coupons": "[5]",
            "lot_date": 1445515636000
        }, {
            "id": 481,
            "us_id": "o-AMtt0STmpVmQTQnJtojmwJ84UY",
            "name": "StoneShi",
            "iconid": 4166,
            "coupons": "[6]",
            "lot_date": 1445515636000
        }, {
            "id": 487,
            "us_id": "o-AMtt5Of53HcHvHpndw0n-t-4Dg",
            "name": "@左眼睛 ",
            "iconid": 133,
            "coupons": "[6]",
            "lot_date": 1445515636000
        }, {
            "id": 493,
            "us_id": "oDmUQs32j4UUlVs07T3CZsKqO680",
            "code": "4719",
            "coupons": "[7]",
            "lot_date": 1445515636000
        }];

    friendQueue.queue = rslt;
    friendQueue.myProfile = rep;
*/

    /**   test end   **/
    voucherService.shareFriend();
    var lotteryObject = friendQueue.myProfile;
    lotteryObject.couponsName = pickUpSamePackageName(friendQueue.myProfile.coupons, AppConstants);

    friendQueue.queue = angular.forEach(friendQueue.queue, function(item, index) {
        item.couponsName = pickUpSamePackageName(item.coupons, AppConstants);
        item.profileImgUrl = AppConstants.protocol + AppConstants.applicationIp + '/usmvn/image/' + item.iconid;
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

    $scope.shareFriend = function() {
        voucherService.test();
    }


};
controllersModule.controller(controllerName, couponResultCtrl);
