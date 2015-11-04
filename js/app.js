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

var AppConstants = require('./constants'),
    requires = [
        'ui.router',
        'ngAnimate',
        'ngTouch',
        'angular-loading-bar',
        'app.controllers',
        'app.services',
        'app.filters',
        'app.directives'
    ],
    userRoles = AppConstants.buildRoles(AppConstants.roles),
    lot = AppConstants.queryString().lot,
    app = angular.module('app', requires);

function bootstrapApplication() {
    angular.element(document).ready(function() {
        app.constant('AppConstants', AppConstants);
        app.config(require('./routes'));
        app.value('friendQueue', {
            'queue': '',
            'myProfile': '',
            'lot': lot
        });
        app.run(require('./routesChangeRun'));
        angular.bootstrap($('body'), ['app']);
    });
}

function fetchData() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var url = AppConstants.getApiPrefix() + '/auth';
    return $http.get(url).then(function(response) {
        var authJson = response.data,
            value = authJson.hasOwnProperty('us_id') ? 'us_id' : (authJson.hasOwnProperty('uid') ? 'uid' : (authJson.hasOwnProperty('redirect') ? 'redirect' : 'redirect')),
            tempUser = {
                userObj: authJson,
                role: userRoles[value]
            };

        if (authJson.hasOwnProperty('redirect')) {
            window.location.href = authJson.redirect;
        } else if (!lot) {
            return;
        } else {
            AppConstants.AppUser = tempUser;
            bootstrapApplication();
        }

    });
/*
    var authJson = {
            "id": 469,
            "us_id": "o-AMtt_hv8xAxjowLwMxaVO4U3IU",
            "name": "stone",
            "iconid": 4066,
            "coupons": "[5]",
            "lot_date": 1445515636000
        },
        value = authJson.hasOwnProperty('us_id') ? 'us_id' : (authJson.hasOwnProperty('uid') ? 'uid' : (authJson.hasOwnProperty('redirect') ? 'redirect' : 'redirect')),
        tempUser = {
            userObj: authJson,
            role: userRoles[value]
        };


    AppConstants.AppUser = tempUser;
    bootstrapApplication();*/
}


fetchData();
