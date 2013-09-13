/*global define */
define(['controllers/base-ui-controller', 'views/map-view', 'models/map-model'], function (BaseUIController, MapView, MapModel) {
    'use strict';

    function MapUIController(data) {
        BaseUIController.call(this);

        console.log(data);

        var mapView = new MapView();
        var mapModel;
        if(data && data.mapModel) {
            mapModel = data.mapModel;
        } else {
            mapModel = new MapModel();
        }
        var storedState = data;
        if(!storedState) {
            storedState = {};
        }

        this.getMapView = function () {
            return mapView;
        }

        this.getMapModel = function() {
            return mapModel;
        }

        this.getStoredState = function() {
            return storedState;
        }

        this.init();
    }

    // The MapUIController class extends the BaseUIController class.
    MapUIController.prototype = Object.create( BaseUIController.prototype );

    MapUIController.prototype.getView = function() {
        var element = this.getMapView().getDomElement();
        element.addEventListener('FloorLevelChange', function(event) {
            if(window.history) {
                var currentState = history.state;
                currentState.controllerData = this.getState();
                history.replaceState(currentState, "", this.getPageURL());
            }
        }.bind(this));

        return element;
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

    MapUIController.prototype.onDataLoaded = function(mapState) {
        this.getMapView().setModel(this.getMapModel());

        var data = this.getStoredState();
        if(data && data.floorLevel) {
            console.log('onDataLoaded data.floorLevel = '+data.floorLevel);
            this.getMapView().setFloorLevel(data.floorLevel);
            this.getMapView().updateView();
        }
    }

    MapUIController.prototype.getPageURL = function() {
        return "/map";
    }

    MapUIController.prototype.getState = function() {
        return {
            floorLevel: this.getMapView().getFloorLevel()
        };
    }

    return MapUIController;
});