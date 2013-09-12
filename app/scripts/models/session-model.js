/*global define */
define(['config'], function (config) {
    'use strict';

    function SessionModel(id) {
        var sessionId = id;
        var speakers = null;
        var startTime = null;
        var endTime = null;
        var title = null;
        var description = null;
        var roomName = null;
        var roomId = null;
        var level = null;

        this.getSessionId = function() {
            return sessionId;
        }

        this.setSpeakers = function(info) {
            speakers = info;
        }

        this.getSpeakers = function() {
            if(!speakers) {
                return [];
            }

            return speakers;
        }

        this.setStartTime = function(time) {
            startTime = time;
        }

        this.getStartTime = function() {
            return startTime;
        }

        this.setEndTime = function(time) {
            endTime = time;
        }

        this.getEndTime = function() {
            return endTime;
        }

        this.setDescription = function(d) {
            description = d;
        }

        this.getDescription = function() {
            return description;
        }

        this.setTitle = function(t) {
            title = t;
        }

        this.getTitle = function() {
            if(!title) {
                return '';
            }

            return title;
        }

        this.setRoomName = function(name) {
            roomName = name;
        }

        this.getRoomName = function() {
            return roomName;
        }

        this.setRoomId = function(id) {
            roomId = id;
        }

        this.getRoomId = function() {
            return roomId;
        }

        this.setLevel = function(l) {
            level = l;
        }

        this.getLevel = function() {
            return level;
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
        this.setStartTime(new Date(Date.parse(data['start-date'])));
        this.setEndTime(new Date(Date.parse(data['end-date'])));
        this.setTitle(data.title);
        this.setDescription(data.description);
        this.setRoomName(data['room-name']);
        this.setRoomId(data['room-id']);
        this.setLevel(data['level']);
        successCb();
    }

    return SessionModel;
});