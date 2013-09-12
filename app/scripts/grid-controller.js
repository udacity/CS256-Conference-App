/*global define */
define(['tracks-model', 'grid-view'], function (tracksModel, gridView) {
    'use strict';

    var exports = {};

    function getTrackData(cb) {
        if(tracksModel) {
            tracksModel.getTracks(cb);
        }

        return null;
    }

    exports.updateSessionsData = function () {
        getTrackData(function(tracksData) {
            gridView.setSessionData(tracksData, []);
        });
    };

    exports.updateSessionsData();

    return exports;
});