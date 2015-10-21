'use strict';

var AppConstants = {
    protocol: 'http://',
    //protocol : 'https://',

    /*local test */
    applicationIp: 'www.us-app.com',

    applicationPrefix: 'usmvn/weixin',

    applicationPort: '8080',

    authenticated : false,

    roles: [
        'redirect', //'public',
        'uid', //'usUser',
        'union_id', //'wechatUser'
        'result',
        'public'
    ],

    accessLevels: {
        'couponResult': ['uid', 'union_id', 'result'],
        'acquireCoupon': ['uid', 'union_id'],
        'notAuth': ['redirect'],
        'message': '*'
    },

    getApiPrefix: function() {
        var apiPrefix = AppConstants.protocol + AppConstants.applicationIp + '/' + AppConstants.applicationPrefix;

        return apiPrefix;
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
                } else console.log('Access Control Error: Could not parse' + accessLevelDeclarations[level] + ' as access definition for level ' + level);

            } else {
                var resultBitMask = 0;
                for (var role in accessLevelDeclarations[level]) {
                    if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
                    else console.log('Access Control Error: Could not find role' + accessLevelDeclarations[level][role] + ' in registered roles while building access for ' + level);
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
