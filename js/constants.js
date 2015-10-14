'use strict';

var AppConstants = {
    protocol: 'http://',
    //protocol : 'https://',

    /*local test */
    applicationIp: 'localhost',

    applicationPort: '8080',

    roles: [
        'redirect', //'public',
        'uid', //'usUser',
        'union_id' //'wechatUser'
    ],

    accessLevels: {
        'couponResult': ['uid', 'union_id'],
        'acquireCoupon': ['uid', 'union_id'],
        'notFound': '*'
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
