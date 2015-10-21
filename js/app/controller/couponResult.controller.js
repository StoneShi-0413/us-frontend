'use strict';

var controllersModule = require('./controllers');
var controllerName = 'CouponResultController';
var couponResultCtrl = function($scope, $stateParams) {
	var lotteryObject = JSON.parse($stateParams.lotteryObj);
	if(lotteryObject.hasOwnProperty('code')){
		$scope.code = lotteryObject.code;
		$scope.img_url = './img/vouchered2.jpg';
	}else{
		$scope.code = '';
		$scope.img_url = './img/vouchered1.jpg';
	}
};
controllersModule.controller(controllerName, couponResultCtrl);
