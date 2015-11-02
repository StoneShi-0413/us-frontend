'use strict';

var bootstrapStart = {

    isAndroid: function() {
        var ua = navigator.userAgent.toLowerCase();
        var isAndroidDevice = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

    }


};

module.exports = bootstrapStart;
