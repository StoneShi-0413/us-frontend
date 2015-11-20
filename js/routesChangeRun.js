'use strict';

var bootstraps = require('./bootstrapOn');
var routerRun = function($rootScope, $state, voucherService, $stateParams, AppConstants) {

    //every route state change , then the current  user is valid
    $rootScope.$on('$stateChangeStart', function(event, toState) {
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
    //start wechat api
    voucherService.configWeChat();
    //start our application additional plugin
    bootstraps.appStart();

};

module.exports = routerRun;
