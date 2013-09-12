/*global define */
define(['controllers/base-ui-controller', 'views/session-view', 'models/session-model'], function (BaseUIController, SessionView, SessionModel) {
    'use strict';

    function SessionUIController(id) {
        BaseUIController.call(this);

        console.log('session-ui-controller.js id = '+id);

        var sessionId = id;
        var sessionView = new SessionView();
        var sessionModel = new SessionModel(sessionId);

        this.getSessionView = function () {
            return sessionView;
        }

        this.getSessionModel = function() {
            return sessionModel;
        }

        this.init();
    }

    // The SessionUIController class extends the BaseUIController class.
    SessionUIController.prototype = Object.create( BaseUIController.prototype );

    SessionUIController.prototype.getView = function() {
        return this.getSessionView().getDomElement();
    }

    SessionUIController.prototype.init = function() {
        this.getSessionModel().getModelData(this.onDataLoaded.bind(this), function() {
            console.error('session-ui-controller: getModelData Failed - TODO: Handle this event');
        });
    }

    SessionUIController.prototype.onDataLoaded = function() {
        this.getSessionView().setModel(this.getSessionModel());
    }

    return SessionUIController;
});