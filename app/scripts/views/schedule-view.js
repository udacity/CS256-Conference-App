/*global define */
define(['views/base-view', 'views/pan-view'], function (BaseView, PanView) {
    'use strict';

    function ScheduleView() {
        BaseView.call(this);

        var panView = new PanView();
        var model = null;

        this.getPanView = function() {
            return panView;
        }

        this.getModel = function() {
            return model;
        }

        this.setModel = function(m) {
            model = m;

            this.updateViews();
        }

    };

    // The HomeUIController class extends the BaseUIController class.
    ScheduleView.prototype = Object.create( BaseView.prototype );

    ScheduleView.prototype.getDomElement = function() {
        var views = [];

        var header = this.generateTopBar('Schedule', []);
        views.push(header);

        var panView = this.getPanView().getDomElement();
        if(panView) {views.push(panView);}

        var pageContainer = this.generatePageContainer('schedule-ui', views);

        return pageContainer;
    }

    ScheduleView.prototype.updateViews = function() {
        console.log('schedule-view: UpdateViews');
        var model = this.getModel();

        this.updatePanView(model);
    }

    ScheduleView.prototype.updatePanView = function(model) {
        var panView = this.getPanView();
        panView.setStartTime(model.getStartTime());
        panView.setEndTime(model.getEndTime());
        panView.setTracks(model.getTracks());
        panView.updateView();
    }

    return ScheduleView;
});