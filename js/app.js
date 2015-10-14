'use strict';

// require angular
require('../components/angular/angular.min');
require('../components/angular-ui-router/release/angular-ui-router.min');
require('../components/angular-touch/angular-touch.min');
require('../components/angular-animate/angular-animate.min');
require('../components/jquery/jquery.min');
require('../components/flexible');
require('./app/controller/controllers');
require('./app/services/services');
require('./app/directive/directives');
require('./app/filter/filters');

angular.element(document).ready(function() {
    var requires = [
        'ui.router',
        'ngAnimate',
        'ngTouch',
        'app.controllers',
        'app.services',
        'app.filters',
        'app.directives'
    ];
    // mount on win dow for testing
    window.app = angular.module('app', requires);
    angular.module('app').constant('AppConstants', require('./constants'));
    angular.module('app').config(require('./routes'));
    angular.module('app').run(require('./routesChangeRun'));

    angular.bootstrap($('body'), ['app']);

});
