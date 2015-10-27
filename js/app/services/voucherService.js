'use strict';

var servicesModule = require('./services.js');
var serviceName = 'voucherService';
var wx = require('../../../components/weixin-js-sdk');
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

    service.getAuth = function() {
        var url = AppConstants.getApiPrefix() + '/auth';
        return promise(url, 'GET');
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


    var invokeWxShareFriendApi = function(wxConfigObj) {
        wx.config(wxConfigObj);
    };

    var getSignature = function() {
        var url = AppConstants.getApiPrefix() + '/signature';
        return promise(url, 'GET');
    };

    service.configWeChat = function() {
        var wxConfigObj = $window.sessionStorage.getItem('wxConfigObj');
        if (!wxConfigObj) {
            getSignature().then(function(response) {
                wxConfigObj = {
                    debug: true,
                    appId: AppConstants.wxAppId,
                    timestamp: response.data.timestamp,
                    nonceStr: response.data.noncestr,
                    signature: response.data.signature,
                    jsApiList: [
                        'onMenuShareAppMessage'
                    ]
                };
                $window.sessionStorage.setItem('wxConfigObj', JSON.stringify(wxConfigObj));
                invokeWxShareFriendApi(wxConfigObj);
            });
        } else {
            wxConfigObj = JSON.parse(wxConfigObj);
            invokeWxShareFriendApi(wxConfigObj);
        }
    };


    service.shareFriend = function() {
        var wxLink =$window.location.href.split('#')[0];
        alert(wxLink);
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

    return service;
};

servicesModule.factory(serviceName, voucherService);
