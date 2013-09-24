/*global define */
define(['controllers/base-ui-controller', 'models/speaker-model', 'views/speaker-session-joint-view'], function (BaseUIController, SpeakerModel, SpeakerSessionJointView) {
    'use strict';

    function SpeakerDetailsUIController(id) {
        BaseUIController.call(this);

        var speakerId = id;
        var speakerSessionJointView = new SpeakerSessionJointView();
        var speakerModel = new SpeakerModel();

        this.getSpeakerId = function() {
            return speakerId;
        }

        this.getSpeakerSessionView = function() {
            return speakerSessionJointView;
        }

        this.getSpeakerModel = function() {
            return speakerModel;
        }

        this.init();
    }

    // The HomeUIController class extends the BaseUIController class.
    SpeakerDetailsUIController.prototype = Object.create( BaseUIController.prototype );

    SpeakerDetailsUIController.prototype.getView = function() {
        var header = this.generateTopBar('Speaker Details', []);

        var speakerSessionView = this.getSpeakerSessionView().getDomElement();

        var pageContainer = this.generatePageContainer('speaker-details-ui', [header, speakerSessionView]);

        return pageContainer;
    }

    SpeakerDetailsUIController.prototype.init = function() {
        this.getSpeakerModel().getSpeakerData(this.getSpeakerId(), this.onDataLoaded.bind(this), function() {
            console.error('speaker-details-ui-controller: getTrackData Failed - TODO: Handle this event');
        });
    }

    SpeakerDetailsUIController.prototype.onDataLoaded = function() {
        this.getSpeakerSessionView().setModel(this.getSpeakerModel());
    }

    

    SpeakerDetailsUIController.prototype.getPageURL = function() {
        return "/speaker-details";
    }

    return SpeakerDetailsUIController;
});