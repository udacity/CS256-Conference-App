/*global define */
define(['config'], function (config) {
    'use strict';

    function ScheduleModel() {
        var tracks = null;
        var startTime = null;
        var endTime = null;

        var eventStartDate = null;
        var eventEndDate = null;

        this.getTracks = function() {
            return tracks;
        }

        this.setTracks = function(data) {
            tracks = data;
        }

        this.setEventStartDate = function(date) {
            eventStartDate = date;
        }

        this.setEventEndDate = function(date) {
            eventEndDate = date;
        }
    };

    ScheduleModel.prototype.getTrackData = function(successCb, errorCb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', config.getRootUrl()+'/json/schedule.json', true);

        var that = this;
        xhr.onreadystatechange = (function(e) {
            if (xhr.readyState == 4) {
                if(xhr.status != 200) {
                    console.log('schedule-model: getTrackData() error()');
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

    ScheduleModel.prototype.handleScheduleResponse = function(response, successCb, errorCb) {
        if(response.error) {
            console.error('schedule-model: There was a problem getting '+
                'the schedule data: '+response.error);
            errorCb();
            return;
        }

        var data = response.data;

        this.setTracks(data.tracks);
        this.setEventStartDate(Date.parse(data['start-date']));
        this.setEventEndDate(Date.parse(data['end-date']));
        successCb();
    }

    ScheduleModel.prototype.getStartTime = function() {
        var startTime = new Date(0);
        startTime.setUTCDate(15);
        startTime.setUTCMonth(4);
        startTime.setUTCFullYear(2013);
        startTime.setUTCHours(9);
        startTime.setUTCMinutes(0);

        return startTime;
    }

    ScheduleModel.prototype.getEndTime = function() {
        var endTime = new Date(0);
        endTime.setUTCDate(18);
        endTime.setUTCMonth(4);
        endTime.setUTCFullYear(2013);
        endTime.setUTCHours(7);
        endTime.setUTCMinutes(0);

        return endTime;
    }

    return ScheduleModel;
});