'use strict';


var AppConstants = require('./constants');
var bootstrapStart = {

    getDeviceOrientation: function() {
        if (Math.abs(window.orientation) === 90) {
            // Landscape Mode
            AppConstants.orientation = 0;
           
        } else {
            // Portrait Mode
            AppConstants.orientation = 1;
        }

    },


    appStart: function() {
        window.addEventListener('orientationchange', bootstrapStart.getDeviceOrientation);
    }


};

module.exports = bootstrapStart;
