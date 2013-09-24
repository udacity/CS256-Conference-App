/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function SessionDetailsView() {
        BaseView.call(this);

        var model;
        var sessionElement = null;

        this.getModel = function() {
            return model;
        }

        this.setModel = function(m) {
            model = m;

            this.updateViews();
        }

        this.setSessionElement = function(element) {
            sessionElement = element;
        }

        this.getSessionElement = function() {
            return sessionElement;
        }
    };

    SessionDetailsView.prototype = Object.create( BaseView.prototype );

    SessionDetailsView.prototype.getDomElement = function() {
        var sessionSection = this.generateSessionSection();
        
        var model = this.getModel();
        if(model) {
            this.updateViews();
        }

        return sessionSection;
    }

    SessionDetailsView.prototype.generateSessionSection = function() {
        var container = document.createElement('section');
        container.classList.add('session-details-section');
        this.setSessionElement(container);

        return container;
    }

    SessionDetailsView.prototype.updateViews = function() {
        var model = this.getModel();
        var sessionElement = this.getSessionElement();
        if(!model || !sessionElement) {
            return;
        }

        this.clearChildViews(sessionElement);

        var title = document.createElement('h1');
        title.classList.add('session-title');
        title.appendChild(document.createTextNode(model.getTitle()));

        var date = this.generateDateElement();

        var room = document.createElement('h2');
        room.classList.add('session-room');
        room.appendChild(document.createTextNode(model.getRoomName()));

        

        var paragraph = document.createElement('p');
        paragraph.appendChild(document.createTextNode(model.getDescription()));

        sessionElement.appendChild(title);
        sessionElement.appendChild(date);
        sessionElement.appendChild(room);
        sessionElement.appendChild(paragraph);
    }

    SessionDetailsView.prototype.generateDateElement = function() {
        var model = this.getModel();
        var date = document.createElement('h2');
        date.classList.add('session-date');

        var startTime = model.getStartTime();
        var startHours = startTime.getHours();
        var startMinutes = startTime.getMinutes();

        var endTime = model.getEndTime();
        var endHours = endTime.getHours();
        var endMinutes = endTime.getMinutes();

        var dateString = startTime.toDateString() + ' ';
        dateString += (startHours < 10) ? '0'+startHours : startHours;
        dateString += ':';
        dateString += (startMinutes < 10) ? '0'+startMinutes : startMinutes;
        dateString += ' - ';
        dateString += (endHours < 10) ? '0'+endHours : endHours;
        dateString += ':';
        dateString += (endMinutes < 10) ? '0'+endMinutes : endMinutes;

        date.appendChild(document.createTextNode(dateString));

        return date;
    }

    return SessionDetailsView;
});