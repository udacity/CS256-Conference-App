/*global define */
define(['controllers/base-ui-controller', 'views/speakers-list-view', 'models/speakers-model', 'views/speaker-session-joint-view', 'models/speaker-model'], function (BaseUIController, SpeakersListView, SpeakersModel, SpeakerSessionJointView, SpeakerModel) {
    'use strict';

    function SpeakersUIController() {
        BaseUIController.call(this);

        var speakersListView = new SpeakersListView();
        var speakersModel = new SpeakersModel();
        var speakerModel = new SpeakerModel();
        var speakerDetailsPlaceholder = null;
        var speakerSessionView = null;

        this.getSpeakersListView = function () {
            return speakersListView;
        }

        this.getSpeakersModel = function() {
            return speakersModel;
        }

        this.getSpeakerModel = function() {
            return speakerModel;
        }

        this.setSpeakerDetailsPlaceHolder = function(element) {
            speakerDetailsPlaceholder = element;
        }

        this.getSpeakerDetailsPlaceHolder = function() {
            return speakerDetailsPlaceholder;
        }

        this.getCurrentSpeakerSessionView = function() {
            return speakerSessionView;
        }

        this.setCurrentSpeakerSessionView = function(view) {
            speakerSessionView = view;
        }

        this.init();
    }

    // The HomeUIController class extends the BaseUIController class.
    SpeakersUIController.prototype = Object.create( BaseUIController.prototype );

    SpeakersUIController.prototype.getView = function() {
        var header = this.generateTopBar('Speakers', []);

        var speakersListView = this.getSpeakersListView().getDomElement();

        var speakerDetailsPlaceHolder = document.createElement('section');
        speakerDetailsPlaceHolder.classList.add('speaker-list-details-placeholder');
        this.setSpeakerDetailsPlaceHolder(speakerDetailsPlaceHolder);

        var wrapper = document.createElement('section');
        wrapper.classList.add('speaker-container');

        wrapper.appendChild(speakersListView);
        wrapper.appendChild(speakerDetailsPlaceHolder);

        var pageContainer = this.generatePageContainer('speakers-ui', [header, wrapper]);

        return pageContainer;
    }

    SpeakersUIController.prototype.init = function() {
        this.getSpeakersListView().setOnSpeakerClickListener(this.onSpeakerClick.bind(this));
        this.getSpeakersModel().getSpeakerData(this.onDataLoaded.bind(this), function() {
            console.error('speaker-ui-controller: getTrackData Failed - TODO: Handle this event');
        });
    }

    SpeakersUIController.prototype.onDataLoaded = function() {
        this.getSpeakersListView().setModel(this.getSpeakersModel());
    }

    SpeakersUIController.prototype.onSpeakerClick = function(speakerDetails) {
        if(this.isSpeakersDetailsVisible()) {
            console.log('Open "'+speakerDetails.name+'" Locally on page');
            
            var details = this.getSpeakerDetailsPlaceHolder();
            var firstChild = details.firstChild;
            while(firstChild) {
                details.removeChild(firstChild);
                firstChild = details.firstChild;
            }

            var speakerSessionView = new SpeakerSessionJointView();
            this.setCurrentSpeakerSessionView(speakerSessionView);
            details.appendChild(speakerSessionView.getDomElement());

            var speakerModel = this.getSpeakerModel();
            speakerModel.getSpeakerData(speakerDetails.id, this.onSpeakDetailsLoaded.bind(this), function() {
                console.error('speakers-ui-controller: getTrackData Failed - TODO: Handle this event');
            });
        } else {
            console.log('Dispatching "'+speakerDetails.id+'" Event');
            this.eventDispatchFunction('ShowSpeakerDetails', window, {id: speakerDetails.id})();
        }
    }

    SpeakersUIController.prototype.isSpeakersDetailsVisible = function() {
        var details = this.getSpeakerDetailsPlaceHolder();
        if(details && getComputedStyle(details, null).display === "none") {
            return false;
        }
        return true;
    }

    SpeakersUIController.prototype.onSpeakDetailsLoaded = function() {
        this.getCurrentSpeakerSessionView().setModel(this.getSpeakerModel());
    }

    SpeakersUIController.prototype.getPageURL = function() {
        return "/speakers";
    }

    return SpeakersUIController;
});