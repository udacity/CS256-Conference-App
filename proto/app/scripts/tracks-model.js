/*global define */
define([], function () {
    'use strict';

    var exports = {};

    var EVENT_ID = 'googleio2013';

    var tracks;

    exports.getTracks = function(cb) {
      if (typeof gapi === 'undefined') {
        return;
      }

      gapi.client.googledevelopers.events.tracks.list({eventId: EVENT_ID}).execute(function(resp) {
        var responseTracks = resp.tracks;
        tracks = [];

        var singleResponseTrack;
        for(var i = 0; i < responseTracks.length; i++) {
          singleResponseTrack = responseTracks[i];

          var className = getClassName(singleResponseTrack.id);
          if(className.length > 0) {
            tracks.push({
              'id': singleResponseTrack.id,
              'title': singleResponseTrack.title,
              'class': className,
              'sessions': []
            });
          }
        }

        cb(tracks);
      });
    }

    function getClassName(id) {
      var className = '';
      switch(id) {
            case '324437288':
              // Android
              className = 'android';
              break;
            case '324543074':
              className = 'chrome';
              break;
            case '325521271':
              className = 'glass';
              break;
            case '326519001':
              className = 'maps';
              break;
            case '328270232':
              className = 'tech-talk';
              break;
            case '328366324':
              className = 'youtube';
              break;
            case '331178416':
              className = 'wallet';
              break;
            case '331436367':
              className = 'g-plus';
              break;
            case '331487867':
              className = 'knowledge';
              break;
            case '331963319':
              className = 'cloud';
              break;
            case '332109105':
              className = 'ads';
              break;
            case '351003781':
              // DO NOT INCLUDE IN UI
              //className = 'android-design';
              break;
            case '351024538':
              // DO NOT INCLUDE IN UI
              //className = 'android-games';
              break;
            case '496738724':
              className = 'accessibility';
              break;
            case '497058120':
              className = 'gtv';
              break;
            case '497574398':
              className = 'develop-good';
              break;
            case '506058779':
              className = 'gdg';
              break;
            case '516498440':
              // DO NOT INCLUDE IN UI
              //className = 'search';
              break;
          }
      return className;
    }

    return exports;
});