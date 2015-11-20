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


                getFriendQueue: function(AppConstants, friendQueue, voucherService, $state, $window) {
                    voucherService.getParticipants(friendQueue.lot).then(function successCallback(rep) {
                        $window.sessionStorage.clear();
                        var indexSplice = -1,
                            rslt = rep.data;

                        angular.forEach(rslt, function(item, index) {
                            if (item.us_id === AppConstants.AppUser.userObj.us_id) {
                                indexSplice = index;
                            }

                        });

                        voucherService.getLotSource().then(function(response) {
                            //invoke share frined api
                            alert(JSON.stringify(response.data));
                            voucherService.shareFriend(response.data);
                            if (indexSplice > -1) {
                                var myRslt = rslt[indexSplice];
                                rslt.splice(indexSplice, 1);
                                friendQueue.queue = rslt;
                                friendQueue.myProfile = myRslt;
                                $window.sessionStorage.setItem('myProfile', JSON.stringify(friendQueue.myProfile));
                                $window.sessionStorage.setItem('queue', JSON.stringify(friendQueue.queue));
                                $state.go('couponResult');
                            } else {
                                friendQueue.queue = rslt;
                                $window.sessionStorage.setItem('queue', JSON.stringify(friendQueue.queue));
                            }
                        });

                        //if has lotteried
                    }, function errorCallback(response) {
                        var messageObj = response.data;
                        if (messageObj.reason === '无效的lot值') {
                            $state.go('notFound');
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
        })
        .state('notFound', {
            url: '/notFound',
            data: {
                access: accessLevels.notFound
            },
            views: {
                'contentview': {
                    templateUrl: './views/templates/notFound.html',
                    controller: 'NotFoundController'
                }
            }
        });

};

module.exports = router;
