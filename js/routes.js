'use strict';

var AppConstants =  require('./constants');
var router = function($stateProvider, $urlRouterProvider) {
    var userRoles = AppConstants.buildRoles(AppConstants.roles),
        accessLevels = AppConstants.buildAccessLevels(AppConstants.accessLevels, userRoles);
    //$locationProvider.html5Mode(true);

    //$urlRouterProvider.otherwise('/acquireCoupon');
    $urlRouterProvider.otherwise('/couponResult');

    // States
    $stateProvider
        .state('acquireCoupon', {
            url: '/acquireCoupon',
            views: {
                'contentview': {
                    templateUrl: './views/templates/voucher/acquireCoupon.html',
                    controller: 'AcquireCouponController',
                    data: {
                        access: accessLevels.acquireCoupon
                    }
                },
                'headerview': {
                    templateUrl: './views/templates/header.html',
                    controller: 'HeaderController'
                }
            }
        })
        .state('couponResult', {

            url: '/couponResult',
            views: {
                'contentview': {
                    templateUrl: './views/templates/voucher/couponResult.html',
                    controller: 'CouponResultController',
                    data: {
                        access: accessLevels.notFound /*accessLevels.couponResult*/
                    }
                },
                'headerview': {
                    templateUrl: './views/templates/header.html',
                    controller: 'HeaderController'
                }
            }
        })
        /*.state('notFound', {
                            url: '/notFound',
                            views: {
                                'contentview': {
                                    templateUrl: 'js/app/templates/header.html',
                                    controller: 'HeaderController',
                                    data: {
                                        access: accessLevels.notFound
                                    }
                                }
                            }
                        })*/
    ;

};

module.exports = router;
