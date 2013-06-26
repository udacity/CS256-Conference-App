/*global define */
define([], function () {
    'use strict';

    var exports = {};

    var API_KEY = 'AIzaSyDZcJKjkTzWGACBSF7-6whhkoZN47gBgtg';
    var EVENT_ID = 'googleio2013';

    var loadedCb;

    // Don't load gapi if it's already present
    if (typeof gapi === 'undefined') {
      require(['https://apis.google.com/js/client.js?onload=define'], function() {
        // Poll until gapi is ready
        function checkGAPI() {
          if (gapi && gapi.client) {
            gapi.client.setApiKey(API_KEY);
            gapi.client.load('googledevelopers', 'v1', function() {
              if(typeof loadedCb !== 'undefined' && loadedCb !== null) {
                loadedCb(gapi);
              }
            });
          } else {
            setTimeout(checkGAPI, 100);
          }
        }

        checkGAPI();
      });
    }

    exports.setOnLoadedListener = function(lCb) {
      loadedCb = lCb;
      if (typeof gap !== 'undefined') {
        loadedCb(gapi);
        return;
      }
    }

    return exports;
});






