

var controllersModule = require('./controllers');
var controllerName = 'MessageController';
var MessageCtrl = function($scope, $stateParams) {
    
    var messageObj = JSON.parse($stateParams.messages);
    $scope.message = messageObj.reason;
};
controllersModule.controller(controllerName, MessageCtrl);
