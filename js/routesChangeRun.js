'use strict';

var routerRun = function($rootScope, $state, voucherService, $stateParams, AppConstants) {
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        if (!('data' in toState) || !('access' in toState.data)) {
            event.preventDefault();
        } else {
            var tempUser = AppConstants.AppUser;

            if (!voucherService.authorize(toState.data.access, tempUser.role)) {
                $state.go('notAuth', {
                    redirect: tempUser.userObj.redirect
                });
                event.preventDefault();
            } 
        }
    });
    voucherService.configWeChat();

};

module.exports = routerRun;
