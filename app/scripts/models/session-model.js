/*global define */
define(['config', 'models/speaker-model', 'models/session-details-model'], function (config, SpeakerModel, SessionDetailsModel) {
    'use strict';

    function SessionModel(id) {
        var sessionId = id;
        var speakers = null;
        var sessionDetailsModel = null;

        this.getSessionId = function() {
            return sessionId;
        }

        this.setSpeakers = function(info) {
            speakers = info;
        }

        this.getNumberOfSpeakers = function() {
            if(!speakers) {
                return 0;
            }

            return speakers.length;
        }

        this.getSpeakerModel = function(index) {
            var model = new SpeakerModel();
            model.setSpeaker(speakers[index]);
            return model;
        }

        this.setSessionDetailsModel = function(model) {
            sessionDetailsModel = model;
        }

        this.getSessionDetailsModel = function() {
            return sessionDetailsModel;
        }
    };

    SessionModel.prototype.getModelData = function(successCb, errorCb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', config.getRootUrl()+'/json/sessions/'+this.getSessionId()+'.json', true);

        var that = this;
        xhr.onreadystatechange = (function(e) {
            if (xhr.readyState == 4) {
                if(xhr.status != 200) {
                    console.log('session-model: getModelData() error()');
                    errorCb();
                    return;
                } else {
                    var data = JSON.parse(xhr.responseText);
                    this.handleAPIResponse(data, successCb, errorCb);
                }
            }
        }).bind(this);

        xhr.send();
    }

    SessionModel.prototype.handleAPIResponse = function(response, successCb, errorCb) {
        if(response.error) {
            console.error('session-model: There was a problem getting '+
                'the session data: '+response.error);
            errorCb();
            return;
        }

        var data = response.data;

        this.setSpeakers(data.speakers);

        var sessionDetailsModel = new SessionDetailsModel();
        sessionDetailsModel.setData(data);
        this.setSessionDetailsModel(sessionDetailsModel);
        
        successCb();
    }

    return SessionModel;
});