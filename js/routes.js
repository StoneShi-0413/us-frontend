'use strict';

var AppConstants = require('./constants');
var router = function($stateProvider, $urlRouterProvider) {
    var userRoles = AppConstants.buildRoles(AppConstants.roles),
        accessLevels = AppConstants.buildAccessLevels(AppConstants.accessLevels, userRoles);
    //$locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/acquireCoupon');

    // States
    $stateProvider
        .state('acquireCoupon', {
            url: '/acquireCoupon',
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
            },
            resolve: {
                getFriendQueue: function(AppConstants, friendQueue, voucherService, $state) {
                    voucherService.getParticipants(friendQueue.lot).then(function(rep) {

                        var rslt = rep.data,
                            indexSplice = -1;
                        angular.forEach(rslt, function(item, index) {
                            if (item.us_id === AppConstants.AppUser.userObj.us_id) {
                                indexSplice = index;
                            }

                        });

                        //if has lotteried
                        if (indexSplice > -1) {
                            var myRslt = rslt[indexSplice];
                            rslt.splice(indexSplice, 1);
                            friendQueue.queue = rslt;
                            friendQueue.myProfile = myRslt;
                            $state.go('couponResult');
                        } else {
                            friendQueue.queue = rslt;
                        }
                    });
                }
            }
        })
        .state('couponResult', {

            url: '/couponResult',
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
            url: '/notAuth?:redirect',
            data: {
                access: accessLevels.notAuth
            },
            resolve: {
                redirect: function($stateParams, $window) {
                    if ($stateParams.redirect) {
                        var url = decodeURIComponent($stateParams.redirect);

                        $window.location.href = url;
                    }
                }
            }
        });

};

module.exports = router;
