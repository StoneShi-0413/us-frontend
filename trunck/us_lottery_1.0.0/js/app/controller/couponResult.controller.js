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

var couponResultCtrl = function($scope, $window, $stateParams, friendQueue, voucherService, AppConstants) {
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
    voucherService.shareFriend();

    var myProfile = $window.sessionStorage.getItem('myProfile');
    var queue = $window.sessionStorage.getItem('queue');
    var lotteryObject,
        queueObject;
    if(!myProfile || !queue){
        lotteryObject = friendQueue.myProfile;
        queueObject = friendQueue.queue;
    }else{
        lotteryObject = JSON.parse(myProfile);
        queueObject = JSON.parse(queue);
    }
    /**   test end   **/
    lotteryObject.couponsName = pickUpSamePackageName(lotteryObject.coupons, AppConstants);
    queueObject = angular.forEach(queueObject, function(item, index) {
        item.couponsName = pickUpSamePackageName(item.coupons, AppConstants);
        if (!item.iconid) {
            item.profileImgUrl = $window.location.href.split('index.html')[0] + '/img/icon_default.jpg';
        } else {
            item.profileImgUrl = AppConstants.protocol + AppConstants.applicationIp + '/usmvn/image/' + item.iconid;
        }

        return item;
    });


    $scope.lotteryObj = lotteryObject;
    $scope.friendQueues = queueObject;


    $scope.shareFriend = function() {
        voucherService.test();
    };

    $scope.isShow = function(voucher) {
        if ($scope.lotteryObj.hasOwnProperty('code')) {
            $scope.code = lotteryObject.code;
        } else {
            $scope.code = '';
        }

    };

    $scope.wxTip = function($event) {
        window.location.href='./views/templates/download.html';
    };

};
controllersModule.controller(controllerName, couponResultCtrl);
