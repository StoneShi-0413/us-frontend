'use strict';

var controllersModule = require('./controllers');
var controllerName = 'NotFoundController';
var notFoundCtrl = function($scope, $stateParams) {
	var msg = '页面没找到';
	if($stateParams.message){
    	msg = $stateParams.message;
	}
	$scope.message = msg;
};

controllersModule.controller(controllerName, notFoundCtrl);
