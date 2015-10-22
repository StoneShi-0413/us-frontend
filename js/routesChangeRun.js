'use strict';



var routerRun = function($rootScope, $state, voucherService, $stateParams, AppConstants, friendQueue, $window) {
    var userRoles = AppConstants.buildRoles(AppConstants.roles);

    $('body').hide();
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {

        if (!('data' in toState) || !('access' in toState.data)) {
            event.preventDefault();
        } else {
            var lot = AppConstants.queryString().lot;
            if (!lot) {
                return;
            }
            if (AppConstants.authenticated === false) {
                voucherService.getAuth().then(function(response) {
                    var authJson = response.data,
                        user = {},
                        value = authJson.hasOwnProperty('us_id') ? 'us_id' : (authJson.hasOwnProperty('uid') ? 'uid' : (authJson.hasOwnProperty('redirect') ? 'redirect' : 'redirect')),
                        tempUser = {
                            userObj: authJson,
                            role: userRoles[value]
                        };
                    if (!voucherService.authorize(toState.data.access, tempUser.role)) {
                        $state.go('notAuth', {
                            redirect: tempUser.userObj.redirect
                        });
                        event.preventDefault();
                    } else {
                        voucherService.getParticipants(lot).then(function(rep) {

                            var rslt = rep.data,
                                indexSplice = -1;
                            angular.forEach(rslt, function(item, index) {
                                if (item.us_id === authJson.us_id) {
                                    indexSplice = index;
                                }

                            });
                            AppConstants.authenticated = true;

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

                            $('body').show();
                        });
                    }
                });
            }
        }
    });
};



module.exports = routerRun;
