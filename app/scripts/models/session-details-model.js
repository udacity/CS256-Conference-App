/*global define */
define(['config'], function (config) {
    'use strict';

    function SessionDetailsModel(id) {
        var sessionId = id;
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

    SessionDetailsModel.prototype.setData = function(data) {
        this.setStartTime(new Date(Date.parse(data['start-date'])));
        this.setEndTime(new Date(Date.parse(data['end-date'])));
        this.setTitle(data.title);
        this.setDescription(data.description);
        this.setRoomName(data['room-name']);
        this.setRoomId(data['room-id']);
        this.setLevel(data['level']);
    }

    return SessionDetailsModel;
});