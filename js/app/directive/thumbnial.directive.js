'use strict';
var directiveModule = require('./directives');
var directiveName = 'thumbnail';
var ThumbnailDirective = function() {
    return {
        restrict: 'E',
        scope: true,
        replace:true,
        template: '<div class="thumbnail col-sm-2"><img src="{{friend.profileImgUrl}}" class="ra-avatar img-responsive" /></div> ',
        link: function(scope, elem, attrs) {
            var ua = navigator.userAgent.toLowerCase();
            var isAndroidDevice = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
            if (isAndroidDevice) {
                if ($('.col-sm-2')) {
                    elem.find('img').addClass('android-img');
                    $('.row').css('margin-left','-2%');
                }
            }
        }
    };
};
directiveModule.directive(directiveName, ThumbnailDirective);
