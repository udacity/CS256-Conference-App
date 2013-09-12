/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function PanView() {
        BaseView.call(this);

        var startTime = null;
        var endTime = null;
        var tracks = null;

        var timeLineView = null;
        var sessionsView = null;
        var tracksView = null;

        var pixelsPerMinute = 4;
        var borderWidth = 1;
        var padding = 8;
        var rowHeight = 120;

        var timelineWidth = 0;
        var trackingScrolling = false;

        var sessionScrollValues = {
            left: 99,
            top: 0
        };

        var trackingTimeout;

        var panView = document.createElement('section');
        panView.classList.add('pan-view');

        this.getRootView = function() {
            return panView;
        }

        this.getSessionScrollValues = function() {
            return sessionScrollValues;
        }

        this.setSessionScrollValues = function(values) {
            sessionScrollValues = values;
        }

        this.getTrackingTimeout = function() {
            return trackingTimeout;
        }

        this.setTrackingTimeout = function(timeout) {
            trackingTimeout = timeout;
        }

        this.getStartTime = function() {
            return startTime;
        }

        this.setStartTime = function(time) {
            startTime = time;
        }

        this.getEndTime = function() {
            return endTime;
        }

        this.setEndTime = function(time) {
            endTime = time;
        }

        this.getPixelsPerMinute = function() {
            return pixelsPerMinute;
        }

        this.getBorderWidth = function() {
            return borderWidth;
        }

        this.getPadding = function() {
            return padding;
        }

        this.getRowHeight = function() {
            return rowHeight;
        }

        this.getTracks = function() {
            return tracks;
        }

        this.setTracks = function(data) {
            tracks = data;
        }

        this.getTimeLineWidth = function() {
            return timelineWidth;
        }

        this.setTimeLineWidth = function(width) {
            timelineWidth = width;
        }

        this.isTrackingScrolling = function() {
            return trackingScrolling;
        }

        this.setTrackingScrolling = function(tracking) {
            trackingScrolling = tracking;
        }

        this.getTimeLineView = function() {
            return timeLineView;
        }

        this.setTimeLineView = function(view) {
            timeLineView = view;
        }

        this.getSessionsView = function() {
            return sessionsView;
        }

        this.setSessionsView = function(view) {
            sessionsView = view;
        }

        this.getTracksView = function() {
            return tracksView;
        }
        
        this.setTracksView = function(view) {
            tracksView = view;
        }
    };

    // The HomeUIController class extends the BaseUIController class.
    PanView.prototype = Object.create( BaseView.prototype );

    PanView.prototype.getDomElement = function() {
        return this.getRootView();
    };

    PanView.prototype.setUpScrollHandlers = function() {
        var timeline = this.getTimeLineView();
        var tracks = this.getTracksView();
        var sessions = this.getSessionsView();

        if(!(timeline && tracks && sessions)) {
            return;
        }

        sessions.addEventListener('scroll', this.onSessionScroll.bind(this));
        sessions.addEventListener('touchmove', this.onSessionScroll.bind(this));
    };

    PanView.prototype.onSessionScroll = function (e) {
        var sessionsView = this.getSessionsView();
        
        var sessionScrollValues = this.getSessionScrollValues();
        sessionScrollValues.left = sessionsView.scrollLeft;
        sessionScrollValues.top = sessionsView.scrollTop;

        if(!this.isTrackingScrolling()) {
            this.setTrackingScrolling(true);

            window.requestAnimFrame(this.animFrameUpdate.bind(this));
        }

        clearTimeout(this.getTrackingTimeout());
        var timeout = setTimeout((function stopScrollSyncs() {
                this.setTrackingScrolling(false);
            }).bind(this), 1500);
        this.setTrackingTimeout(timeout);
    }

    PanView.prototype.animFrameUpdate = function() {
        var sessionScrollValues = this.getSessionScrollValues();

        this.getTimeLineView().scrollLeft = sessionScrollValues.left;
        this.getTracksView().scrollTop = sessionScrollValues.top;

        if (this.isTrackingScrolling()) {
            window.requestAnimFrame(this.animFrameUpdate.bind(this));
        }
    }

    PanView.prototype.generateTimeLine = function() {
        if(!this.getStartTime || !this.getEndTime() ||
            !this.getPixelsPerMinute() || !this.getBorderWidth()) {
            return;
        }

        var startTime = this.getStartTime();
        var endTime = this.getEndTime();

        var pixelsPerMinute = this.getPixelsPerMinute();

        var timelineMinuteSteps = 60;
        var gridDuration = ((endTime - startTime) / 1000) / 60;
        var noOfSteps = gridDuration / timelineMinuteSteps;

        var elementMinWidth = (timelineMinuteSteps * pixelsPerMinute);
        this.setTimeLineWidth(elementMinWidth * noOfSteps);

        var timeline = document.createElement('ol');
        timeline.classList.add('timeline');
        var timeLineElement;
        var textNode;
        var startStep = new Date(startTime.getTime());

        for(var i = 0; i < noOfSteps; i++) {
            timeLineElement = document.createElement('li');
            textNode = document.createTextNode(this.getTimeString(startStep));
            timeLineElement.appendChild(textNode);

            timeLineElement.style['min-width'] = elementMinWidth+'px';

            timeline.appendChild(timeLineElement);

            startStep = new Date(startStep.getTime() + timelineMinuteSteps*60000);
        }

        return timeline;
    }

    PanView.prototype.getSessionRows = function() {
        var tracks = this.getTracks();
        if(tracks == null) {
            return;
        }

        var mainContent = document.createElement('div');
        mainContent.classList.add('content-container');

        var tracksContainer = document.createElement('ul');
        tracksContainer.classList.add('tracks');

        var sessionContainer = document.createElement('div');
        sessionContainer.classList.add('session-container');

        for(var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            if(track.sessions.length > 0) {
                var sessionRowViews = this.populateTrackSessionsViews(track);
                for(var j = 0; j < sessionRowViews.length; j++) {
                    sessionContainer.appendChild(sessionRowViews[j]);
                }

                var trackView = this.createTrackTitle(track, sessionRowViews.length);
                tracksContainer.appendChild(trackView);
                //createTrackTitle(track, numberOfRows, borderWidth, rowHeight);
            }
        }

        mainContent.appendChild(tracksContainer);
        mainContent.appendChild(sessionContainer);

        return mainContent;
    }

    PanView.prototype.createTrackTitle = function(track, rowCount) {
        var trackTitleElement = document.createElement('li');
        trackTitleElement.style.height = (rowCount * (this.getRowHeight()+this.getBorderWidth()))+'px';

        var titleTextNode = document.createTextNode(track.title);

        var span = document.createElement('span');
        span.appendChild(titleTextNode);
        span.style['min-width'] = trackTitleElement.style.height;

        trackTitleElement.appendChild(span);

        
        //trackTitleElement.style.width = trackTitleElement.style.height;
        trackTitleElement.classList.add(track.class);

        return trackTitleElement;
    }

    PanView.prototype.createSessionsRowView = function(className) {
        var rowHeight = this.getRowHeight();

        var rowElement = document.createElement('div');
        rowElement.classList.add('first-row');

        rowElement.style.height = rowHeight+'px';
        rowElement.style.width = this.getTimeLineWidth()+'px';
        rowElement.classList.add('row');
        
        if(typeof className !== undefined && className > 0) {
            sessionsRow.classList.add(className);
        }

        return rowElement;
    }

    PanView.prototype.populateTrackSessionsViews = function(track) {
        var trackRows = [];

        var rowHeight = this.getRowHeight();
        var borderWidth = this.getBorderWidth();

        var sessionsRow = this.createSessionsRowView(track.class);
        
        trackRows.push(sessionsRow);

        var currentEndTime = null;
        var currentTrackRow = 0;

        var sessions = track.sessions;
        for(var i = 0; i < sessions.length; i++) {
            if(currentEndTime === null ||
                currentEndTime <= Date.parse(sessions[i]['start-date'])) {
                currentTrackRow = 0;
                currentEndTime = Date.parse(sessions[i]['end-date']);
            }

            var sessionElement = this.createSessionView(sessions[i]);

            if(currentTrackRow >= trackRows.length) {
                trackRows.push(this.createSessionsRowView(track.class));
            }

            trackRows[currentTrackRow].appendChild(sessionElement);

            currentTrackRow++;
        }

        for(i = 0; i < trackRows.length; i++) {
            trackRows[i].style['padding-bottom'] = this.getBorderWidth()+'px';
        }

        return trackRows;
    }

    PanView.prototype.createSessionView = function(sessionData) {
        var sessionElement = document.createElement('div');
        sessionElement.appendChild(document.createTextNode(sessionData.title));

        var gridStart = this.getStartTime();
        var sessionStart = Date.parse(sessionData['start-date']);
        var sessionEnd = Date.parse(sessionData['end-date']);

        var pixelsPerMinute = this.getPixelsPerMinute();
        var rowHeight = this.getRowHeight();

        var startOffsetMins = Math.round(((sessionStart-gridStart) / 1000) / 60);
        var durationMins = Math.round(((sessionEnd-sessionStart) / 1000) / 60);
        var leftOffset = startOffsetMins * pixelsPerMinute;
        var sessionWidth = (durationMins * pixelsPerMinute);

        sessionElement.style.left = leftOffset+'px';
        sessionElement.style.width = (sessionWidth - this.getBorderWidth())+'px';
        sessionElement.style.height = rowHeight +'px';
        sessionElement.style['margin-left'] = this.getBorderWidth()+'px';

        var that = this;
        sessionElement.addEventListener('click', function(sessionData) {
            return function() {
                that.eventDispatchFunction('ShowSession', window, sessionData)();
            };
        }(sessionData), false);

        return sessionElement;
    }

    PanView.prototype.getTimeString = function(date) {
        var hours = date.getUTCHours();
        if(hours < 10) {
            hours = '0'+hours;
        }
        var minutes = date.getUTCMinutes();
        if(minutes < 10) {
            minutes = '0'+minutes;
        }

        return hours+':'+minutes;
    }

    PanView.prototype.updateView = function() {
        console.log('panView updateView');
        var panView = this.getRootView();
        var firstChild = panView.firstChild;
        while(firstChild) {
            panView.removeChild(firstChild);
            firstChild = panView.firstChild;
        }

        var timeline = this.generateTimeLine();
        var sessions = this.getSessionRows();

        if(timeline) {
            panView.appendChild(timeline);

            this.setTimeLineView(timeline);
        }

        if(sessions) {
            panView.appendChild(sessions);

            this.setSessionsView(sessions.querySelector('.session-container'));
            this.setTracksView(sessions.querySelector('.tracks'));
        }

        this.setUpScrollHandlers();
    }

    return PanView;
});