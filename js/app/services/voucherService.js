'use strict';

var servicesModule = require('./services.js');
var wx = require('../../../components/weixin-js-sdk');
var serviceName = 'voucherService';
var voucherService = function($http, $window, $location, $q, AppConstants) {

    var service = {};

    var promise = function(url, method) {
        var promise = $http({
            method: method,
            url: url,
            cache: 'false'
        });
        return promise;
    };

    service.authorize = function(accessLevel, role) {
        if (role === undefined) {
            role = {
                bitMask: 1,
                title: "redirect"
            };
        }
        return accessLevel.bitMask & role.bitMask;
    };

    service.lottery = function(lot) {
        var url = AppConstants.getApiPrefix() + '/lottery?lot=:lot';
        url = url.replace(':lot', lot);
        return promise(url, 'GET');
    };

    service.getParticipants = function(lot) {
        var url = AppConstants.getApiPrefix() + '/lottery/history?lot=:lot';
        url = url.replace(':lot', lot);
        return promise(url, 'GET');
    };

    var getSignature = function() {
        var url = AppConstants.getApiPrefix() + '/signature';
        return promise(url, 'GET');
    };

    var initialWxConfigObj = function(signatureObj) {
        var wxConfigObj = {
            debug: false,
            appId: AppConstants.wxAppId,
            timestamp: signatureObj.timestamp,
            nonceStr: signatureObj.noncestr,
            signature: signatureObj.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        };
        return wxConfigObj;
    }

    service.configWeChat = function() {
        getSignature().then(function(response) {
            var wxConfigObj = initialWxConfigObj(response.data);
            wx.config(wxConfigObj);
        });
    };


    service.shareFriend = function(redPackObj) {
        var wxImgLink = '',
            wxLink = $window.location.href.split('&from=')[0];
        if (redPackObj !== null) {
            wxImgLink = 'http://m.us-app.com/usmvn/image/' + redPackObj.image_id;
            redPackObj = {
                title: redPackObj.title,
                desc: redPackObj.body,
                wxLink: wxLink,
                wxImgLink: wxImgLink
            };
        } else {
            wxImgLink = $window.location.href.split('?lot=')[0] + 'img/' + AppConstants.redPackObj.img;
            redPackObj = {
                title: AppConstants.redPackObj.title,
                desc: AppConstants.redPackObj.desc,
                wxLink: wxLink,
                wxImgLink: wxImgLink
            };
        }
        wx.ready(function() {
            wx.onMenuShareAppMessage({
                title: redPackObj.title, // 分享标题
                desc: redPackObj.desc, // 分享描述
                link: redPackObj.wxLink, // 分享链接
                imgUrl: redPackObj.wxImgLink, // 分享图标
                success: function() {},
                cancel: function() {}
            });

            wx.onMenuShareTimeline({
                title: redPackObj.title, // 分享标题
                link: redPackObj.wxLink, // 分享链接
                imgUrl: redPackObj.wxImgLink, // 分享图标
                success: function() {},
                cancel: function() {}
            });
        });
    };

    service.getLotSource = function() {
        var url = 'http://m.us-app.com/usmvn/coupon/info/:lot';
        url = url.replace(':lot', AppConstants.queryString().lot);
        return promise(url, 'GET');
    };

    service.setCouponInfo = function(couponIds) {

        var promises = [];

        angular.forEach(couponIds, function(couponId) {

            var url = 'http://m.us-app.com/usmvn/coupon/:couponId';
            url = url.replace(':couponId', couponId);

            promises.push(promise(url, 'GET'));

        });
        return $q.all(promises);
    };

    return service;
};

servicesModule.factory(serviceName, voucherService);
