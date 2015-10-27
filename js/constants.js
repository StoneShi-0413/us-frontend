'use strict';

var AppConstants = {
    protocol: 'http://',
    //protocol : 'https://',

    /*local test */
    applicationIp: 'm.us-app.com',

    applicationPrefix: 'usmvn/weixin',

    applicationPort: '8080',

    wxAppId : 'wx31332c571c074678',

    roles: [
        'redirect', //'public',
        'us_id',
        'result',
        'public'
    ],

    accessLevels: {
        'couponResult': ['us_id', 'result'],
        'acquireCoupon': ['us_id'],
        'notAuth': ['redirect']
    },

    vouchers: [
        {'group':'[5]','name':'10元'},
        {'group':'[6]','name':'20元'},
        {'group':'[7]','name':'30元'},
        {'group':'[8]','name':'75折'},
        {'group':'[5,5,6,6,7,7,8]','name':'大礼包'}

    ],

    getApiPrefix: function() {
        var apiPrefix = AppConstants.protocol + AppConstants.applicationIp + '/' + AppConstants.applicationPrefix;

        return apiPrefix;
    },

    queryString: function() {
        var queryString = {};
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            // If first entry with this name
            if (typeof queryString[pair[0]] === 'undefined') {
                queryString[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof queryString[pair[0]] === 'string') {
                var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
                queryString[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                queryString[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return queryString;
    },

    buildRoles: function(roles) {

        var bitMask = '01';
        var userRoles = {};

        for (var role in roles) {
            var intCode = parseInt(bitMask, 2);
            userRoles[roles[role]] = {
                bitMask: intCode,
                title: roles[role]
            };
            bitMask = (intCode << 1).toString(2);
        }
        return userRoles;
    },

    buildAccessLevels: function(accessLevelDeclarations, userRoles) {

        var accessLevels = {};
        for (var level in accessLevelDeclarations) {
            if (typeof accessLevelDeclarations[level] === 'string') {
                if (accessLevelDeclarations[level] === '*') {

                    var resultBitMasks = '';

                    for (var temRole in userRoles) {
                        resultBitMasks += '1';
                    }
                    //accessLevels[level] = parseInt(resultBitMask, 2);
                    accessLevels[level] = {
                        bitMask: parseInt(resultBitMasks, 2)
                    };
                }
            } else {
                var resultBitMask = 0;
                for (var role in accessLevelDeclarations[level]) {
                    if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
                }
                accessLevels[level] = {
                    bitMask: resultBitMask
                };
            }
        }
        return accessLevels;
    }
};

module.exports = AppConstants;
