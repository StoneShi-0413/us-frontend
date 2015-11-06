'use strict';

var controllersModule = require('./controllers');
var controllerName = 'CouponResultController';


/**pick up voucher name  by the coupons**/
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


var getArrayItems = function(num, AppConstants) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    var arr = AppConstants.sentences,
        temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的数值项,保存在此数组
    var return_array = new Array();
    for (var i = 0; i < num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length > 0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
};


var couponResultCtrl = function($scope, $window, $stateParams, friendQueue, voucherService, AppConstants) {


    //get my profile info from sessionStorage when click download and then click come back button
    var myProfile = $window.sessionStorage.getItem('myProfile');

    // get the friend queue info from sessionStorage when click download and then click come back button
    var queue = $window.sessionStorage.getItem('queue');
    var lotteryObject,
        queueObject;
    if (!myProfile || !queue) {
        lotteryObject = friendQueue.myProfile;
        queueObject = friendQueue.queue;
    } else {
        lotteryObject = JSON.parse(myProfile);
        queueObject = JSON.parse(queue);
    }
    //get the array sentence from constants file by random
    var sentences = getArrayItems(queueObject.length, AppConstants);
    //define the coupons name by above method
    lotteryObject.couponsName = pickUpSamePackageName(lotteryObject.coupons, AppConstants);
    //define the query object which is obtained (name , default icon ……)by myself
    queueObject = angular.forEach(queueObject, function(item, index) {
        item.couponsName = pickUpSamePackageName(item.coupons, AppConstants);
        if (item.information) {
            item.information = JSON.parse(item.information);
        } else {
            item.information = {
                image_url: AppConstants.protocol + AppConstants.applicationIp + '/usmvn/image/' + item.iconid,
                name: item.name
            };
        }
        item.sentence = sentences[index];
        return item;
    });


    $scope.lotteryObj = lotteryObject;
    $scope.friendQueues = queueObject;

    //show the code by the return data 
    $scope.isShow = function(voucher) {
        if ($scope.lotteryObj.hasOwnProperty('code')) {
            $scope.code = lotteryObject.code;
        } else {
            $scope.code = '';
        }

    };


    /** when click download button , show wechat indicate tip**/
    $scope.wxDownloadTip = function(event) {
        event.preventDefault();
        window.location.href = './views/templates/download.html';
    };

    /** when click share button , show wechat indicate tip**/
    $scope.wxShareTip = function(event) {
        event.preventDefault();
        console.log(event);
        $scope.orientation = AppConstants.orientation;
        $('.wxShareTip').addClass('on');
        setTimeout(function() {
            $(".wxShareTip").removeClass('on');
        }, 3000);
    };

};
controllersModule.controller(controllerName, couponResultCtrl);
