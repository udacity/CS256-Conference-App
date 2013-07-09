/*global define */
define([], function () {
    'use strict';

    var exports = {};

    var gridScrollValues = {left: 0, top: 0};
    var trackingScroll = false;
    var killTrackTimeout;
    var gridContent = document.querySelector('#grid-content');
    var tracksContainer = document.querySelector('#tracks');
    var timeline = document.querySelector('#timeline');

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    function onGridScroll() {
        console.log('onGridScroll() :)');
        gridScrollValues.left = gridContent.scrollLeft;
        gridScrollValues.top = gridContent.scrollTop;

        if(!trackingScroll) {
            window.requestAnimFrame(syncScrolls);
        }

        clearTimeout(killTrackTimeout);
        killTrackTimeout = setTimeout(stopScrollSyncs, 1500);

        trackingScroll = true;
    }

    function syncScrolls() {
        timeline.scrollLeft = gridScrollValues.left;
        tracksContainer.scrollTop = gridScrollValues.top;

        if (trackingScroll) {
            window.requestAnimFrame(syncScrolls);
        }
    }

    function stopScrollSyncs() {
        trackingScroll = false;
    }

    function getTimeString(date) {
        var adjustedDate = new Date(date);
        adjustedDate.setUTCHours(adjustedDate.getUTCHours() - (8 + (adjustedDate.getTimezoneOffset() / 60)));
        var hours = adjustedDate.getUTCHours();
        if(hours < 10) {
            hours = '0'+hours;
        }
        var minutes = adjustedDate.getUTCMinutes();
        if(minutes < 10) {
            minutes = '0'+minutes;
        }

        return hours+':'+minutes;
    }

    function resetElements() {
        tracksContainer.innerHTML = '';
        gridContent.innerHTML = '';
        timeline.innerHTML = '';
    }

    function createTimeLine(pixelsPerMinute, borderWidth, padding, startTime, endTime) {
        var timelineMinuteSteps = 60;
        var gridDuration = ((endTime - startTime) / 1000) / 60;
        var noOfSteps = gridDuration / timelineMinuteSteps;

        var totalElementWidth = (timelineMinuteSteps * pixelsPerMinute);
        var elementMinWidth = totalElementWidth - borderWidth - (2 * padding);

        var timeLineElement;
        var textNode;
        var startStep = new Date(startTime.getTime());

        for(var i = 0; i < noOfSteps; i++) {
            timeLineElement = document.createElement('li');
            textNode = document.createTextNode(getTimeString(startStep));
            timeLineElement.appendChild(textNode);

            timeLineElement.style['min-width'] = elementMinWidth+'px';
            timeLineElement.style.padding = padding+'px';

            timeline.appendChild(timeLineElement);

            startStep = new Date(startStep.getTime() + timelineMinuteSteps*60000);
        }

        return totalElementWidth * noOfSteps;
    }

    function createTrackRow(rowHeight, track, timelineWidth) {
        // Require at least one row
        var rowElement = document.createElement('div');
        rowElement.style.height = rowHeight +'px';
        rowElement.style.width = timelineWidth+'px';
        rowElement.classList.add('row');
        if(typeof track.class !== undefined && track.class.length > 0) {
            rowElement.classList.add(track.class);
        }

        return rowElement;
    }

    function createSessionElement(sessionData, gridStartTime, borderWidth, padding, pixelsPerMinute, rowHeight) {
        var sessionElement = document.createElement('div');
        var textNode = document.createTextNode(sessionData.title);
        sessionElement.appendChild(textNode);

        var gridStart = gridStartTime.getTime() / 1000;
        var sessionStart = parseInt(sessionData.startTimestamp, 10);
        var sessionEnd = parseInt(sessionData.endTimestamp, 10);

        /**console.log('sessionData.title = '+sessionData.title);

        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        
        d.setUTCSeconds(sessionStart);
        console.log('sessionStart = '+d);

        d = new Date(0);
        d.setUTCSeconds(sessionEnd);
        console.log('sessionEnd = '+d);

        d = new Date(0);
        d.setUTCSeconds(gridStart);
        console.log('gridStartTime = '+d);

        console.log('gridStart = '+gridStart);
        console.log('sessionStart = '+sessionStart);**/

        var startOffsetMins = ((sessionStart-gridStart)) / 60;
        var durationMins = ((sessionEnd-sessionStart)) / 60;
        var leftOffset = startOffsetMins * pixelsPerMinute;
        var sessionWidth = (durationMins * pixelsPerMinute) - (2 * borderWidth);

        sessionElement.style.left = leftOffset+'px';
        sessionElement.style.width = sessionWidth - (2 * padding)+'px';
        sessionElement.style.height = (rowHeight - borderWidth - (2 * padding)) +'px';
        sessionElement.style.padding = padding+'px';

        return sessionElement;
    }

    function createTrack(trackData, gridStartTime, rowHeight, timelineWidth, borderWidth, padding, pixelsPerMinute) {
        var trackRows = [];
        // We want a minimum of one row per track;
        var rowElement = createTrackRow(rowHeight, trackData, timelineWidth);
        rowElement.classList.add('first-row');
        rowElement.style.height = (rowHeight+borderWidth) +'px';
        trackRows.push(rowElement);
        gridContent.appendChild(trackRows[0]);

        var currentEndTime;
        var currentTrackRow = 0;

        var sessions = trackData.sessions;
        for(var i = 0; i < sessions.length; i++) {
            if(currentEndTime === null || typeof(currentEndTime) === 'undefined' ||
                currentEndTime < sessions[i].startTime) {
                currentTrackRow = 0;
                currentEndTime = sessions[i].endTime;
            }

            var sessionElement = createSessionElement(sessions[i], gridStartTime, borderWidth, padding, pixelsPerMinute, rowHeight);

            if(currentTrackRow >= trackRows.length) {
                trackRows.push(createTrackRow(rowHeight, trackData, timelineWidth));
                gridContent.appendChild(trackRows[trackRows.length - 1]);
            }
            trackRows[currentTrackRow].appendChild(sessionElement);

            currentTrackRow++;
        }

        return trackRows.length;
    }

    function createTrackTitle(track, numberOfRows, borderWidth, rowHeight) {
        var trackTitleElement = document.createElement('li');
        var titleTextNode = document.createTextNode(track.title);
        trackTitleElement.appendChild(titleTextNode);

        trackTitleElement.style.height = (numberOfRows * rowHeight) + 'px';
        trackTitleElement.classList.add(track.class);
        tracksContainer.appendChild(trackTitleElement);
    }

    gridContent.addEventListener('scroll', onGridScroll);
    gridContent.addEventListener('touchmove', onGridScroll);

    exports.setSessionData = function(trackData, sessionData) {
        if(tracksContainer === null || typeof(tracksContainer) === 'undefined') {
            return;
        }

        resetElements();

        // Constant Variables
        var rowHeight = 150;
        var borderWidth = 1;
        var pixelsPerMinute = 4;
        var padding = 8;

        // Method Variables - Fix up http://www.worldtimebuddy.com/
        var gridStartTime = new Date(0);
        gridStartTime.setUTCDate(15);
        gridStartTime.setUTCMonth(4);
        gridStartTime.setUTCFullYear(2013);
        gridStartTime.setUTCHours(16);
        gridStartTime.setUTCMinutes(0);

        var gridEndTime = new Date(0);
        gridEndTime.setUTCDate(18);
        gridEndTime.setUTCMonth(4);
        gridEndTime.setUTCFullYear(2013);
        gridEndTime.setUTCHours(3);
        gridEndTime.setUTCMinutes(0);

        // Create Timeline
        var timelineWidth = createTimeLine(pixelsPerMinute, borderWidth, padding, gridStartTime, gridEndTime);

        // Create Tracks
        var tracks = trackData;
        for(var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            if(track.sessions.length > 0) {
                var numberOfRows = createTrack(track, gridStartTime, rowHeight, timelineWidth, borderWidth, padding, pixelsPerMinute);
                createTrackTitle(track, numberOfRows, borderWidth, rowHeight);
            }
        }
    };

    return exports;
});