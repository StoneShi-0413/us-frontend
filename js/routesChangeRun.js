'use strict';

var routerRun = function($rootScope, $state, voucherService, $stateParams, AppConstants) {
    var userRoles = AppConstants.buildRoles(AppConstants.roles);

    $('body').hide();
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
        
        if (!('data' in toState) || !('access' in toState.data)) {
            $rootScope.error = 'Access undefined for this state';
            event.preventDefault();
        } else {
            if(AppConstants.authenticated === false){
                voucherService.getAuth().then(function(response) {

                    var authJson = response.data, 
                        user = {},
                        value = authJson.hasOwnProperty('union_id') ? 'union_id' : (authJson.hasOwnProperty('uid') ? 'uid' : (authJson.hasOwnProperty('redirect') ? 'redirect' : 'redirect')),
                        tempUser = {
                            userObj: authJson,
                            role: userRoles[value]
                        };
                    if (!voucherService.authorize(toState.data.access, tempUser.role)) {

                        $state.go('notAuth', {
                            redirect: tempUser.userObj.redirect
                        });
                        event.preventDefault();
                    }else{
                        AppConstants.authenticated = true;
                    }
                    $('body').show();
                });                
            }
        }
    });
};

module.exports = routerRun;
