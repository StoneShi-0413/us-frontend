'use strict';

var AppConstants = require('./constants');
var router = function($stateProvider, $urlRouterProvider) {
    var userRoles = AppConstants.buildRoles(AppConstants.roles),
        accessLevels = AppConstants.buildAccessLevels(AppConstants.accessLevels, userRoles);
    //$locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/acquireCoupon');
    //$urlRouterProvider.otherwise('/couponResult');

    // States
    $stateProvider
        .state('acquireCoupon', {
            url: '/acquireCoupon?lot',
            data: {
                access: accessLevels.acquireCoupon
            },
            views: {
                'contentview': {
                    templateUrl: './views/templates/voucher/acquireCoupon.html',
                    controller: 'AcquireCouponController',
                },
                'headerview': {
                    templateUrl: './views/templates/header.html',
                    controller: 'HeaderController'
                }
            }
        })
        .state('couponResult', {

            url: '/couponResult/:lotteryObj',
            data: {
                access: accessLevels.couponResult
            },
            views: {
                'contentview': {
                    templateUrl: './views/templates/voucher/couponResult.html',
                    controller: 'CouponResultController'
                },
                'headerview': {
                    templateUrl: './views/templates/header.html',
                    controller: 'HeaderController'
                }
            }
        })
        .state('notAuth', {
            url: '/notAuth/:redirect',
            data: {
                access: accessLevels.notAuth
            },
            resolve: {
                redirect: function($stateParams,$window) {
                    if($stateParams.redirect){
                        var url = decodeURIComponent($stateParams.redirect);
                        $window.location.href = url;
                    }
                }
            }
        })
        .state('message', {
            url: '/message/:messages',
            data: {
                access: accessLevels.message
            },
            views: {
                'contentview': {
                    templateUrl: './views/templates/voucher/message.html',
                    controller: 'MessageController'
                },
                'headerview': {
                    templateUrl: './views/templates/header.html',
                    controller: 'HeaderController'
                }
            }
        });

};

module.exports = router;
