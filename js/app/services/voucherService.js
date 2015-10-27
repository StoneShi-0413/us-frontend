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
            debug: true,
            appId: AppConstants.wxAppId,
            timestamp: signatureObj.timestamp,
            nonceStr: signatureObj.noncestr,
            signature: signatureObj.signature,
            jsApiList: [
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


    service.shareFriend = function() {
        var wxLink = $window.location.href.split('#')[0];
        wx.ready(function() {
            wx.onMenuShareAppMessage({
                title: 'message title', // 分享标题
                desc: 'message desc', // 分享描述
                link: wxLink, // 分享链接
                imgUrl: AppConstants.protocol + AppConstants.applicationIp + '/usmvn/image/4166', // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    alert('success');
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    alert('faile');
                }
            });
        });
    };

    service.test = function() {};

    return service;
};

servicesModule.factory(serviceName, voucherService);
