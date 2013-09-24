/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function SpeakerDetailsView() {
        BaseView.call(this);

        var model;
        var speakerElement = null;

        this.getModel = function() {
            return model;
        }

        this.setModel = function(m) {
            model = m;

            this.updateViews();
        }

        this.setSpeakerElement = function(element) {
            speakerElement = element;
        }

        this.getSpeakerElement = function() {
            return speakerElement;
        }
    };

    SpeakerDetailsView.prototype = Object.create( BaseView.prototype );

    SpeakerDetailsView.prototype.getDomElement = function() {
        var speakerSection = this.generateSpeakerSection();
        
        var model = this.getModel();
        if(model) {
            this.updateViews();
        }

        return speakerSection;
    }

    SpeakerDetailsView.prototype.generateSpeakerSection = function() {
        var container = document.createElement('section');
        container.classList.add('speaker-details-section');
        this.setSpeakerElement(container);
        return container;
    }

    SpeakerDetailsView.prototype.updateViews = function() {
        var model = this.getModel();
        if(!model) {
            return;
        }

        var speakerElement = this.getSpeakerElement();
        if(!speakerElement) {
            return;
        }

        this.clearChildViews(speakerElement);

        var speaker = model.getSpeaker();

        var imageContainer = document.createElement('div');
        imageContainer.classList.add('speaker-details-img-container');

        var speakerImg = document.createElement('img');
        speakerImg.src = speaker.photoUrl;
        imageContainer.appendChild(speakerImg);

        speakerElement.appendChild(imageContainer);

        var detailsContainer = document.createElement('div');
        detailsContainer.classList.add('speaker-details-container');

        var speakerName = document.createElement('h4');
        speakerName.appendChild(document.createTextNode(speaker.name));
        detailsContainer.appendChild(speakerName);

        var bio = document.createElement('p');
        bio.appendChild(document.createTextNode(speaker.bio));
        detailsContainer.appendChild(bio);

        var url = document.createElement('a');
        url.classList.add('btn');
        url.classList.add(speaker.urlType);
        url.href = speaker.url;
        url.appendChild(document.createTextNode(speaker.urlText));
        detailsContainer.appendChild(url);

        speakerElement.appendChild(detailsContainer);
    }

    return SpeakerDetailsView;
});