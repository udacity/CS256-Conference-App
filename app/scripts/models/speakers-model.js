/*global define */
define(['config'], function (config) {
    'use strict';

    function SpeakersModel() {
        var speakers = null;

        this.getSpeakers = function() {
            return speakers;
        }

        this.setSpeakers = function(data) {
            speakers = data;
        }
    };

    SpeakersModel.prototype.getSpeakerData = function(successCb, errorCb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', config.getRootUrl()+'/json/speakers.json', true);

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

    SpeakersModel.prototype.handleScheduleResponse = function(response, successCb, errorCb) {
        if(response.error) {
            console.error('speaker-model: There was a problem getting '+
                'the speaker data: '+response.error);
            errorCb();
            return;
        }

        var data = response.data;

        this.setSpeakers(data.speakers);

        successCb();
    }

    return SpeakersModel;
});