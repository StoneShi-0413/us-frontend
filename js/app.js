'use strict';

// require angular
require('../components/angular/angular.min');
require('../components/angular-ui-router/release/angular-ui-router.min');
require('../components/angular-touch/angular-touch.min');
require('../components/angular-animate/angular-animate.min');
require('../components/jquery/jquery.min');
require('../components/flexible');
require('../components/loading-bar');
require('./app/controller/controllers');
require('./app/services/services');
require('./app/directive/directives');
require('./app/filter/filters');

angular.element(document).ready(function() {
    var requires = [
        'ui.router',
        'ngAnimate',
        'ngTouch',
        'angular-loading-bar',
        'app.controllers',
        'app.services',
        'app.filters',
        'app.directives'
    ];

    var AppConstants = require('./constants');
    // mount on win dow for testing   /dist/angular-spinners.min
    window.app = angular.module('app', requires);
    angular.module('app').constant('AppConstants', AppConstants);
    angular.module('app').config(require('./routes'));
    angular.module('app').value('friendQueue',{'queue':'','myProfile':'','lot':''});
    angular.module('app').run(require('./routesChangeRun'));
    angular.bootstrap($('body'), ['app']);
    
});
