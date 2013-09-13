/*global define */
define(['controllers/base-ui-controller', 'views/schedule-view', 'models/schedule-model'], function (BaseUIController, ScheduleView, ScheduleModel) {
    'use strict';

    function ScheduleUIController() {
        BaseUIController.call(this);

        var scheduleView = new ScheduleView();
        var scheduleModel = new ScheduleModel();

        this.getScheduleView = function () {
            return scheduleView;
        }

        this.getScheduleModel = function () {
            return scheduleModel;
        }

        this.init();
    }

    // The HomeUIController class extends the BaseUIController class.
    ScheduleUIController.prototype = Object.create( BaseUIController.prototype );

    ScheduleUIController.prototype.getView = function() {
        return this.getScheduleView().getDomElement();
    }

    ScheduleUIController.prototype.init = function() {
        this.getScheduleModel().getTrackData(this.onDataLoaded.bind(this), function() {
            console.error('schedule-ui-controller: getTrackData Failed - TODO: Handle this event');
        });
    }

    ScheduleUIController.prototype.onDataLoaded = function() {
        this.getScheduleView().setModel(this.getScheduleModel());
    }

    ScheduleUIController.prototype.getPageURL = function() {
        return "schedule";
    }

    return ScheduleUIController;
});