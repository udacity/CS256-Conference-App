/*global define */
define(['views/base-view', 'views/speaker-detail-view', 'views/session-details-view'], function (BaseView, SpeakerDetailsView, SessionDetailsView) {
    'use strict';

    function SpeakerSessionJointView() {
        BaseView.call(this);

        var model = 0;
        var speakerDetailView = new SpeakerDetailsView();

        this.getSpeakerDetailsView = function() {
            return speakerDetailView;
        }

        this.setModel = function(m) {
            model = m;
            this.updateView();
        }

        this.getModel = function() {
            return model;
        }

    };

    // The HomeUIController class extends the BaseUIController class.
    SpeakerSessionJointView.prototype = Object.create( BaseView.prototype );

    SpeakerSessionJointView.prototype.getDomElement = function() {
        var speakerDetailView = this.getSpeakerDetailsView().getDomElement();
        
        var sessionsHeader = this.generateSessionsHeader();

        var sessionsList = this.generateSessionsListView();

        var wrapper = document.createElement('section');
        wrapper.classList.add('speaker-session-wrapper');
        
        wrapper.appendChild(speakerDetailView);
        wrapper.appendChild(sessionsHeader);
        wrapper.appendChild(sessionsList);

        return wrapper;
    }

    SpeakerSessionJointView.prototype.generateSessionsHeader = function() {
        var header = document.createElement('p');
        header.classList.add('heading');
        header.appendChild(document.createTextNode('Sessions'));
        return header;
    }

    SpeakerSessionJointView.prototype.generateSessionsListView = function() {
        var listElement = document.createElement('ul');
        listElement.classList.add('speaker-session-session-list');

        return listElement;
    }

    SpeakerSessionJointView.prototype.updateView = function() {
        var model = this.getModel();
        if(!model) {
            return;
        }

        this.getSpeakerDetailsView().setModel(model);
        this.updateSessionsListView();
    }

    SpeakerSessionJointView.prototype.updateSessionsListView = function() {
        var listElement = document.querySelector('.speaker-session-session-list');
        var model = this.getModel();
        if(!model) {
            return;
        }

        var numOfTalks = model.getNumberOfTalks();
        for(var i = 0; i < numOfTalks; i++) {
            var sessionModel = model.getSessionModel(i);

            var liElement = document.createElement('li');

            var sessionDetailsView = new SessionDetailsView();
            sessionDetailsView.setModel(sessionModel);

            liElement.appendChild(sessionDetailsView.getDomElement());
            listElement.appendChild(liElement);
        }

    }

    return SpeakerSessionJointView;
});