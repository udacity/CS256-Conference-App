/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function SpeakersListView() {
        BaseView.call(this);

        var model;
        var speakerClickListener = null;

        this.getModel = function() {
            return model;
        }

        this.setModel = function(m) {
            model = m;

            this.updateViews();
        }

        this.setOnSpeakerClickListener = function(cb) {
            speakerClickListener = cb;
        }

        this.getOnSpeakerClickListener = function() {
            return speakerClickListener;
        }
    };

    SpeakersListView.prototype = Object.create( BaseView.prototype );

    SpeakersListView.prototype.getDomElement = function() {
        return this.generateSpeakerList();
    }

    SpeakersListView.prototype.generateSpeakerList = function() {
        var speakerListElement = document.createElement('ol');
        speakerListElement.classList.add('speakers-list');
        return speakerListElement;
    }

    SpeakersListView.prototype.updateViews = function() {
        var model = this.getModel();
        var speakers = model.getSpeakers();

        var speakerListElement = document.querySelector('.speakers-list');
        this.clearChildViews(speakerListElement);

        var currentHeading = null;
        var currentHeadingListElement = null;
        for(var i = 0; i < speakers.length; i++) {
            var initalChar = speakers[i].name.charAt(0).toUpperCase();
            if(currentHeading == null || currentHeading != initalChar) {
                currentHeading = initalChar;

                currentHeadingListElement = document.createElement('ol');

                var headingElement = document.createElement('li');
                headingElement.classList.add('heading');
                headingElement.appendChild(document.createTextNode(currentHeading));

                currentHeadingListElement.appendChild(headingElement);

                var newListItme = document.createElement('li');
                newListItme.appendChild(currentHeadingListElement);

                speakerListElement.appendChild(newListItme);
            }

            var speakerItemElement = document.createElement('li');
            speakerItemElement.classList.add('speaker');
            speakerItemElement.addEventListener('click', function(speakerDetails) {
                return function() {
                    var cb = this.getOnSpeakerClickListener();
                    if(cb != null) {
                        cb(speakerDetails);
                    }
                };
            }(speakers[i]).bind(this), true);

            var imgElement = document.createElement('img');
            imgElement.src = speakers[i].photoUrl;
            speakerItemElement.appendChild(imgElement);

            var speakerInfoContainer = document.createElement('div');
            speakerInfoContainer.classList.add('speaker-info-container');

            var nameElement = document.createElement('h1');
            nameElement.classList.add('speaker');
            nameElement.appendChild(document.createTextNode(speakers[i].name));
            speakerInfoContainer.appendChild(nameElement);

            var sessions = speakers[i].sessions;
            for(var j = 0; j < sessions.length; j++) {
                var sessionTitleElement = document.createElement('h2');
                sessionTitleElement.appendChild(document.createTextNode(sessions[j].title));
                speakerInfoContainer.appendChild(sessionTitleElement);
            }

            speakerItemElement.appendChild(speakerInfoContainer);

            currentHeadingListElement.appendChild(speakerItemElement);
            //speakerListElement.appendChild(speakerItemElement);
        }
    }

    return SpeakersListView;
});
