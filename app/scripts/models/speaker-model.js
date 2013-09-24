/*global define */
define(['config', 'models/session-details-model'], function (config, SessionDetailsModel) {
    'use strict';

    function SpeakerModel() {
        var speaker = null;

        this.getSpeaker = function() {
            return speaker;
        }

        this.setSpeaker = function(data) {
            speaker = data;
        }

        this.getNumberOfTalks = function() {
            var speaker = this.getSpeaker();
            if(!speaker || !speaker.talks) {
                return 0;
            }

            return speaker.talks.length;
        }

        this.getSessionModel = function(index) {
            var model = new SessionDetailsModel();
            model.setData(speaker.talks[index]);
            return model;
        }
    };

    SpeakerModel.prototype.getSpeakerData = function(speakerId, successCb, errorCb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', config.getRootUrl()+'/json/speakers/'+speakerId+'.json', true);

        var that = this;
        xhr.onreadystatechange = (function(e) {
            if (xhr.readyState == 4) {
                if(xhr.status != 200) {
                    console.log('speaker-model: getSpeakerData() error()');
                    errorCb();
                    return;
                } else {
                    var data = JSON.parse(xhr.responseText);
                    //successCb(data);
                    this.handleScheduleResponse(data, successCb, errorCb);
                }
            }
        }).bind(this);

        xhr.send();
    }

    SpeakerModel.prototype.handleScheduleResponse = function(response, successCb, errorCb) {
        if(response.error) {
            console.error('speaker-model: There was a problem getting '+
                'the speaker data: '+response.error);
            errorCb();
            return;
        }

        var data = response.data;

        this.setSpeaker(data);

        successCb();
    }

    return SpeakerModel;
});