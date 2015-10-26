'use strict';

var servicesModule = require('./services.js');
var serviceName = 'voucherService';
var wx = require('../../../components/weixin-js-sdk');
var sha1 = require('../../../components/SHA-1/sha1');
var moment = require('../../../components/moment/moment');
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

    var getAccessToken = function() {

        var url = AppConstants.wxApi + 'token?grant_type=client_credential&appid=:APPID&secret=:APPSECRET';

        url = url.replace(':APPID', AppConstants.wxAppId).replace(':APPSECRET', AppConstants.wxAppSecret);

        return promise(url, 'GET');

    };


    var getTicket = function(token) {

        var url = AppConstants.wxApi + 'ticket/getticket?access_token=:ACCESS_TOKEN&type=jsapi';

        url = url.replace(':ACCESS_TOKEN', token);
        return promise(url, 'GET');

    };

    var invokeWxShareFriendApi = function(wxConfigObj, ticket, lot) {
        wxConfigObj.ticket = ticket;
        wxConfigObj.signature = generateSignature(wxConfigObj);
        var appLink = AppConstants.protocol + AppConstants.applicationIp + '/upload/coupon/?lot=' + lot;
        //http://www.us-app.com/upload/coupon/?lot=20151020145322437#/acquireCoupon
        console.log(appLink);
        wx.config({
            debug: true,
            appId: wxConfigObj.appId,
            timestamp: wxConfigObj.timestamp,
            nonceStr: wxConfigObj.nonceStr,
            signature: wxConfigObj.signature,
            jsApiList: [
                'onMenuShareAppMessage',
                'checkJsApi'
            ]
        });
        wx.checkJsApi({
            jsApiList: [
                'onMenuShareAppMessage'
            ],
            success: function(res) {
                alert(JSON.stringify(res));
            },
            fail: function(re) {
                alert(JSON.stringify(re));
            }
        });

        wx.ready(function(res) {
            alert(0);

            wx.onMenuShareAppMessage({
                title: 'message title', // 分享标题
                desc: 'message desc', // 分享描述
                link: appLink, // 分享链接
                imgUrl: 'http://www.us-app.com/usmvn/image/4166', // 分享图标
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

        wx.error(function(){
            alert(1);
        })
    };

    var generateRandomString = function() {
        var text = '',
            possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            textLength = Math.floor(Math.random() * 5) + 5;

        for (var i = 0; i < textLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;

    };


    var generateSignature = function(wxConfigObj) {

        var jsurl = $window.location.href.split('#')[0],
            content = '',
            signature = '',
            parameterArray = ["jsapi_ticket=" + wxConfigObj.ticket, "timestamp=" + +wxConfigObj.timestamp, "noncestr=" + wxConfigObj.nonceStr, "url=" + jsurl];
        parameterArray = parameterArray.sort();
        content = parameterArray.join("&");
        if (content !== '') {
            signature = sha1(content);
        }

        alert('signature ++++ ' + signature);

        return signature;
    };

    service.shareFriend = function() {

        var currentTimestamp = moment().unix(),
            ticketStorage = $window.sessionStorage.getItem('wxTicket'),
            tokenStorage = $window.sessionStorage.getItem('wxToken'),
            lot = AppConstants.queryString().lot,
            wxConfigObj = {
                debug: false,
                appId: AppConstants.wxAppId,
                timestamp: currentTimestamp,
                nonceStr: generateRandomString(),
                signature: '',
                jsApiList: [
                    'onMenuShareAppMessage'
                ],
                ticket: '',
                token: ''
            };

        if (!tokenStorage) {
            getAccessToken().then(function(response) {
                var tokenRep = JSON.stringify(response.data);
                $window.sessionStorage.setItem('wxToken', tokenRep);
                wxConfigObj.token = response.data.access_token;
                return getTicket(response.data.access_token);
            }).then(function(response) {

                var ticketRep = JSON.stringify(response.data);
                $window.sessionStorage.setItem('wxTicket', ticketRep);
                invokeWxShareFriendApi(wxConfigObj, response.data.ticket, lot);
            });
        } else {
            var tokenTemp = JSON.parse(tokenStorage);
            wxConfigObj.token = tokenTemp.access_token;
            if (!ticketStorage) {
                getTicket(tokenTemp.access_token).then(function(response) {

                    var ticketRep = JSON.stringify(response.data);
                    $window.sessionStorage.setItem('wxTicket', ticketRep);
                    invokeWxShareFriendApi(wxConfigObj, response.data.ticket, lot);

                });
            } else {
                var ticketTemp = JSON.parse(ticketStorage);

                invokeWxShareFriendApi(wxConfigObj, ticketTemp.ticket, lot);
            }
        }


    };




    return service;
};

servicesModule.factory(serviceName, voucherService);
