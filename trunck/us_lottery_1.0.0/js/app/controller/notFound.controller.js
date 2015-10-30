'use strict';

var controllersModule = require('./controllers');
var controllerName = 'NotFoundController';
var notFoundCtrl = function($scope) {
};

controllersModule.controller(controllerName, notFoundCtrl);
