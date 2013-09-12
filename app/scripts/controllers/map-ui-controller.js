/*global define */
define(['controllers/base-ui-controller', 'views/map-view', 'models/map-model'], function (BaseUIController, MapView, MapModel) {
    'use strict';

    function MapUIController() {
        BaseUIController.call(this);

        var mapView = new MapView();
        var mapModel = new MapModel();

        this.getMapView = function () {
            return mapView;
        }

        this.getMapModel = function() {
            return mapModel;
        }

        this.init();
    }

    // The MapUIController class extends the BaseUIController class.
    MapUIController.prototype = Object.create( BaseUIController.prototype );

    MapUIController.prototype.getView = function() {
        return this.getMapView().getDomElement();
    }

    MapUIController.prototype.addedToDom = function() {
        this.getMapView().loadGoogleMaps();
    }

    MapUIController.prototype.onRemovePage = function () {
        var mapView = this.getMapView();
        mapView.cleanUp();
    }

    MapUIController.prototype.init = function() {
        this.getMapModel().getModelData(this.onDataLoaded.bind(this), function() {
            console.error('map-ui-controller: getModelData Failed - TODO: Handle this event');
        });
    }

    MapUIController.prototype.onDataLoaded = function() {
        this.getMapView().setModel(this.getMapModel());
    }

    return MapUIController;
});