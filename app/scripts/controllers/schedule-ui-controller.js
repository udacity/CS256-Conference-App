/*global define */
define(['controllers/base-ui-controller', 'views/schedule-view', 'models/schedule-model'], function (BaseUIController, ScheduleView, ScheduleModel) {
    'use strict';

    function ScheduleUIController() {
        BaseUIController.call(this);

        var scheduleView = new ScheduleView();
        var scheduleModel = new ScheduleModel();

        scheduleView.setOnItemClickListener(this.onItemClick.bind(this));

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
        var header = this.generateTopBar('Schedule', []);
        var scheduleView = this.getScheduleView().getDomElement();
        var pageContainer = this.generatePageContainer('schedule-ui', [header, scheduleView]);

        return pageContainer;
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
        return "/schedule";
    }

    ScheduleUIController.prototype.onItemClick = function(sessionData) {
        this.eventDispatchFunction('ShowSession', window, sessionData)();
    }

    return ScheduleUIController;
});