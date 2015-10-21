'use strict';
var controllersName = 'app.controllers';
var controllers = angular.module(controllersName, []);
module.exports = controllers;
require('./couponResult.controller');
require('./header.controller');
require('./acquireCoupon.controller');
require('./message.controller');
