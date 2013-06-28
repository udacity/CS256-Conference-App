
var googleapis = require('googleapis');
var gapi;

var API_KEY = 'AIzaSyDZcJKjkTzWGACBSF7-6whhkoZN47gBgtg';
var EVENT_ID = 'googleio2013';

var loadedCb;

googleapis.discover('googledevelopers', 'v1')
  .execute(function(err, client) {
    gapi = {client: client};
    if(typeof loadedCb !== 'undefined' && loadedCb !== null) {
      loadedCb(gapi);
    }
  });

exports.setOnLoadedListener = function(lCb) {
  loadedCb = lCb;
  if (typeof gapi !== 'undefined') {
    loadedCb(gapi);
    return;
  }
}







