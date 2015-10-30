'use strict';

var bootstrapStart = {

    isAndroid: function() {
        var ua = navigator.userAgent.toLowerCase();
        var isAndroidDevice = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if (isAndroidDevice) {
            // Do something!
            // Redirect to Android-site?
          	
        }
    }

    
};

module.exports = bootstrapStart;
