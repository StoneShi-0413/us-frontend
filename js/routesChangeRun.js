'use strict';

var routerRun = function($rootScope, $state, voucherService) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
        if (!('data' in toState.views.contentview) || !('access' in toState.views.contentview.data)) {
            $rootScope.error = 'Access undefined for this state';
            event.preventDefault();
        } else {

            var user = voucherService.getCurrentUser();
            if (user === null) {
                voucherService.getAuth().then(function() {
                    if (!voucherService.authorize(toState.views.contentview.data.access)) {
                        $rootScope.error = 'Seems like you tried accessing a route you don\'t have access to...';
                        event.preventDefault();

                        if (fromState.url === '^') {
                            $state.go('notFound');
                        }
                    }
                });
            } else {
                if (!voucherService.authorize(toState.views.contentview.data.access)) {
                    $rootScope.error = 'Seems like you tried accessing a route you don\'t have access to...';
                    event.preventDefault();

                    if (fromState.url === '^') {
                        $state.go('notFound');
                    }
                }
            }
        }
    });
};

module.exports = routerRun;
