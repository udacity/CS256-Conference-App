/*global define */
define(['controllers/base-ui-controller', 
    'views/map-view', 
    'models/map-model', 
    'views/map-filter-view',
    'views/map-geo-view'], 
    function (BaseUIController, MapView, MapModel, FilterView, GeoView) {
    'use strict';

    function MapUIController(data) {
        BaseUIController.call(this);

        var mapView = new MapView();
        mapView.setOnFloorChangeListener(this.onFloorChange.bind(this));
        mapView.setOnSessionClickListener(this.onSessionClick.bind(this));

        var filterView = new FilterView();
        var geoView = new GeoView();

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

        this.getFilterView = function() {
            return filterView;
        }

        this.getGeoView = function() {
            return geoView;
        }

        this.init();
    }

    // The MapUIController class extends the BaseUIController class.
    MapUIController.prototype = Object.create( BaseUIController.prototype );

    MapUIController.prototype.getView = function() {
        var header = this.generateTopBar('Map', [{
            imgSrc: 'images/locate_icon.png',
            eventName: 'GeolocationAction'            
        }, {
            imgSrc: 'images/filter_icon.png',
            eventName: 'FilterAction'
        }]);

        header.addEventListener('FilterAction', function() {
            var filterView = this.getFilterView();
            filterView.toggleDisplayFilter();

            var geoView = this.getGeoView();
            geoView.setDisplayGeoView(false);
        }.bind(this), false);

        header.addEventListener('GeolocationAction', function(){
            var geoView = this.getGeoView();
            geoView.toggleGeoDisplayFilter();
            geoView.triggerGeolocation();

            var filterView = this.getFilterView();
            filterView.setDisplayFilterView(false);
        }.bind(this), false)

        var filterView = this.getFilterView().getDomElement();
        var geoView = this.getGeoView().getDomElement();
        var mapView = this.getMapView().getDomElement();
        /**mapView.addEventListener('FloorLevelChange', );**/

        return this.generatePageContainer('map-ui', [header, filterView, geoView, mapView]);
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
        this.getMapModel().setOnFilterChangeListener(this.onFilterChange.bind(this));
        this.getMapView().setModel(this.getMapModel());
        this.getFilterView().setModel(this.getMapModel());
        this.getGeoView().setModel(this.getMapModel());

        var data = this.getStoredState();
        if(data && data.floorLevel) {
            this.getMapView().setFloorLevel(data.floorLevel);
            this.getMapView().updateView();
        }
    }

    MapUIController.prototype.onFloorChange = function() {
        if(window.history) {
            var currentState = history.state;
            currentState.controllerData = this.getState();
            history.replaceState(currentState, "", this.getPageURL());
        }
    }

    MapUIController.prototype.onSessionClick = function(session) {
        this.eventDispatchFunction('ShowSession', window, session)();
    }

    MapUIController.prototype.onFilterChange = function() {
        this.getMapView().updateView();
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