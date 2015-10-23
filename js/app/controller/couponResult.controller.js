'use strict';

var controllersModule = require('./controllers');
var controllerName = 'CouponResultController';
var wx = require('../../../components/weixin-js-sdk');

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

var couponResultCtrl = function($scope, $stateParams, friendQueue, AppConstants) {
     var lotteryObject = friendQueue.myProfile;
     lotteryObject.couponsName = pickUpSamePackageName( friendQueue.myProfile.coupons, AppConstants);
     
     alert('lotteryObject   --->  ' + JSON.stringify(lotteryObject));

     alert('before --->' + JSON.stringify(friendQueue.queue));

     friendQueue.queue = angular.forEach( friendQueue.queue, function(item, index) {
         item.couponsName = pickUpSamePackageName(item.coupons, AppConstants);
         item.profileImgUrl = 'http://www.us-app.com/usmvn/image/' + item.iconid;
         return item;
     });

     alert('final --->'+JSON.stringify(friendQueue.queue));

     
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
        /*wx.config({
            debug: false,
            appId: '<?php echo $signPackage["appId"];?>',
            timestamp: <?php echo $signPackage["timestamp"];?>,
            nonceStr: '<?php echo $signPackage["nonceStr"];?>',
            signature: '<?php echo $signPackage["signature"];?>',
            jsApiList: [
                // 所有要调用的 API 都要加到这个列表中
                'checkJsApi',
                'openLocation',
                'getLocation',
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        });

        wx.onMenuShareAppMessage({
            title: '', // 分享标题
            desc: '', // 分享描述
            link: '', // 分享链接
            imgUrl: '', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });*/
    }


};
controllersModule.controller(controllerName, couponResultCtrl);
