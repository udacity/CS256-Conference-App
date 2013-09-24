/*global define */
define(['views/base-view', 'utils'], function (BaseView, Utils) {
    'use strict';

    function MapView() {
        BaseView.call(this);

        var centeredMap = false;

        var mapView = null;
        var floorSelectorView = null;

        var floorMapOverlay = null;
        var floorOverlays = [];
        var currentOverlay = null;

        var floorLevel = 0;
        var floorMarkers = [];

        var mapContainer = null;

        var floorChangeListener = null;
        var sessionClickListener = null;

        var model = null;

        this.getOnFloorChangeListener = function() {
            return floorChangeListener;
        }

        this.setOnFloorChangeListener = function(listener) {
            floorChangeListener = listener;
        }

        this.getOnSessionClickListener = function() {
            return sessionClickListener;
        }

        this.setOnSessionClickListener = function(listener) {
            sessionClickListener = listener;
        }

        this.cleanUp = function() {
            if(floorOverlays) {
                for(var i = 0; i < floorOverlays.length; i++) {
                    floorOverlays[i].setMap(null);
                }
            }

            floorOverlays = [];

            if(currentOverlay) {
                currentOverlay.setMap(null);
                currentOverlay = null;
            }

            if(mapView) {
                mapView = null;
            }

            mapContainer = null;
        }

        this.setModel = function(m) {
            model = m;
            this.updateView();
        }

        this.getModel = function() {
            return model;
        }

        this.hasCenteredMap = function() {
            return centeredMap;
        }

        this.setHasCenteredMap = function(centered) {
            centeredMap = centered;
        }

        this.getMapView = function() {
            return mapView;
        }

        this.setMapView = function(map) {
            mapView = map;
        }

        this.setFloorLevel = function(level) {
            floorLevel = level;
        }

        this.getFloorLevel = function() {
            if(!model) {
                return -1;
            }

            var numOfFloors = model.getNumberOfFloors();
            if(numOfFloors <= 0) {
                return -1;
            }

            if(floorLevel >= numOfFloors) {
                floorLevel = 0;
            }

            return floorLevel;
        }

        this.setFloorSelectorView = function(view) {
            floorSelectorView = view;
        }

        this.getFloorSelectorView = function() {
            return floorSelectorView;
        }

        this.setFloorMapOverlay = function(overlay) {
            floorMapOverlay = overlay;
        }

        this.getFloorMapOverlay = function() {
            return floorMapOverlay;
        }

        this.setFloorMarkers = function(markers) {
            floorMarkers = markers;
        }

        this.getFloorOverlays = function() {
            if(floorOverlays == null) {
                floorOverlays = [];
            }
            return floorOverlays;
        }

        this.setFloorOverlays = function(overlays) {
            floorOverlays = overlays;
        }

        this.setCurrentOverlay = function(overlay) {
            currentOverlay = overlay;
        }

        this.getCurrentOverlay = function() {
            return currentOverlay;
        }

        this.setMapContainer = function(container) {
            mapContainer = container;
        }

        this.getMapContainer = function() {
            return mapContainer;
        }
    };

    MapView.prototype = Object.create( BaseView.prototype );

    MapView.prototype.getDomElement = function() {
        return this.generateGoogleMap();
    }

    MapView.prototype.generateGoogleMap = function() {
        var gMap = document.createElement('div');
        gMap.id = "map-canvas";
        gMap.classList.add('google-map');

        var floorSelector = document.createElement('ol');
        floorSelector.classList.add('floor-selector');

        this.setFloorSelectorView(floorSelector);

        var mapContainer = document.createElement('div');
        mapContainer.classList.add('map-container');

        mapContainer.appendChild(gMap);
        mapContainer.appendChild(floorSelector);

        this.setMapContainer(mapContainer);

        return mapContainer;
    }

    MapView.prototype.initaliseMap = function() {
        var mapContainer = this.getMapContainer();
        var mapElement = mapContainer.querySelector('#map-canvas');

        // Enable the visual refresh
        google.maps.visualRefresh = true;
        
        var mapOptions = {
            zoom: 8,
            zoomControl: false,
            mapTypeControl: false,
            center: new google.maps.LatLng(-34.397,150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        
        var map = new google.maps.Map(mapElement, mapOptions);
        google.maps.event.addListener(map, 'click', function(event) {
            var overlay = this.getCurrentOverlay();
            if(overlay != null) {
                overlay.setMap(null);
                this.setCurrentOverlay(null);
            }
        }.bind(this));
        
        this.setMapView(map);

        this.updateView();
    }

    MapView.prototype.loadGoogleMaps = function() {
        var mapContainer = this.getMapContainer();
        var mapElement = mapContainer.querySelector('#map-canvas');
        mapElement.addEventListener('GoogleMapsLoaded', function(){
            this.initaliseMap();
        }.bind(this));

        window.mapsAPILoaded = function() {
            Utils.dispatchEvent('GoogleMapsLoaded', mapElement);
        }.bind(this);

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDDe8D78sJVN5DHJj7MaNae5qKMfrTx9K0&sensor=false&callback=mapsAPILoaded";
        document.body.appendChild(script);
    }

    MapView.prototype.updateView = function() {
        var mapView = this.getMapView();
        if(!mapView) {
            return;
        }

        var model = this.getModel();
        if(!model) {
            return;
        }

        if(!this.hasCenteredMap() && model.getLat() && model.getLong()) {
            this.setHasCenteredMap(true);

            mapView.setCenter(new google.maps.LatLng(model.getLat(), model.getLong()));
            mapView.setZoom(model.getInitZoomLevel());
        }

        this.prepareFloorLevels();

        this.displayFloorOverlay();        

        this.displayMapPins();
    }

    MapView.prototype.prepareFloorLevels = function() {
        var model = this.getModel();

        var selectedFoorLevel = this.getFloorLevel();
        var floorSelectorView = this.getFloorSelectorView();

        var numberOfFloors = model.getNumberOfFloors();
        if(numberOfFloors != floorSelectorView.childNodes.length) {
            this.clearChildViews(floorSelectorView);

            for(var i = 0; i < numberOfFloors; i++) {
                var anchor = document.createElement('a');
                anchor.appendChild(document.createTextNode(i+1));

                var floorValue = document.createElement('li');
                floorValue.appendChild(anchor);

                if(i == selectedFoorLevel) {
                    floorValue.classList.add('selected-floor');
                }

                var that = this;
                floorValue.addEventListener('click', function(floorLevel) {
                    return function() {
                        var overlay = this.getCurrentOverlay();
                        if(overlay != null) {
                            overlay.setMap(null);
                            this.setCurrentOverlay(null);
                        }
                        this.setFloorLevel(floorLevel);
                        this.updateView();
                        var floorListener = this.getOnFloorChangeListener();
                        if(floorListener != null) {
                            floorListener(floorLevel);
                        }
                    }.bind(that);
                }(i), false);

                floorSelectorView.appendChild(floorValue);
            }
        } else {
            for(var i = 0; i < floorSelectorView.childNodes.length; i++) {
                var child = floorSelectorView.childNodes[i];
                if(i !== selectedFoorLevel) {
                    child.classList.remove('selected-floor');
                } else {
                    child.classList.add('selected-floor');
                }
            }
        }
    }

    MapView.prototype.displayFloorOverlay = function() {
        var mapView = this.getMapView();
        var selectedFoorLevel = this.getFloorLevel();

        var swCoord = new google.maps.LatLng(37.782183491969200, -122.40508084900665);
        var neCoord = new google.maps.LatLng(37.783841211929845, -122.40297799713898);

        // Useful tool to figure out rough position: http://jsfiddle.net/yV6xv/16/embedded/result/
        // This markers are great for debugging ground overlay
        /**var marker = new google.maps.Marker({
            position: swCoord,
            map: mapView,
            title: 'SW'
        });

        var marker2 = new google.maps.Marker({
            position: neCoord,
            map: mapView,
            title: 'NE'
        });**/

        var imageBounds = new google.maps.LatLngBounds(
            swCoord,
            neCoord);

        var previousFloorOverlay = this.getFloorMapOverlay();
        if(previousFloorOverlay) {
            previousFloorOverlay.setMap(null);
        }

        var newFloorOverlay = new google.maps.GroundOverlay(
            'images/maptiles/floor'+selectedFoorLevel+'-v2.svg',
            imageBounds);

        newFloorOverlay.setMap(mapView);
        this.setFloorMapOverlay(newFloorOverlay);
    }

    MapView.prototype.getRoomMarkerClickFunction = function(roomDetails, mapView) {
        return function() {
            var that = this;
            require(['views/room-overlay-view'], function (RoomOverlayView) {
                var currentOverlay = that.getCurrentOverlay();
                if(currentOverlay != null) {
                    currentOverlay.setMap(null);
                }

                var currentSession = {
                    title: 'A More Awesome Web: Features You\'ve Always Wanted',
                    start: '09:00',
                    end: '10:30',
                    id: 'session01'
                };
                var nextSession = {
                    title: 'The Modern Workflow for Developing the Mobile Web',
                    start: '11:00',
                    end: '12:30',
                    id: 'session02'
                };

                // On mobile this leads to a poor experience, so switched off
                var panTo = true;
                var overlay = new RoomOverlayView(roomDetails, currentSession, nextSession, mapView, panTo, function(session){
                    var listener = that.getOnSessionClickListener();
                    if(listener != null) {
                        listener(session);
                    }
                });
                that.setCurrentOverlay(overlay);
            }); 
        }.bind(this);
    }

    MapView.prototype.displayMapPins = function() {
        var model = this.getModel();
        var allFloorMarkers = model.getMapMarkers();
        var mapView = this.getMapView();
        var selectedFoorLevel = this.getFloorLevel();

        var oldFloorOverlays = this.getFloorOverlays();
        for(var i = 0; i < oldFloorOverlays.length; i++) {
            oldFloorOverlays[i].setMap(null);
        }

        if(!allFloorMarkers) {
            return;
        }

        var floorOverlays = [];

        if(selectedFoorLevel < allFloorMarkers.length) {
            var markers = allFloorMarkers[selectedFoorLevel];
            if(markers) {
                for(var i = 0; i < markers.length; i++) {
                    var singleMarker = markers[i];
                    var display = model.getShowFilter(singleMarker['type']);
                    if(!display) {
                        continue;
                    }

                    var markerOptions = {
                        position: new google.maps.LatLng(singleMarker['lat'], singleMarker['lng']),
                        map: mapView,
                        title: singleMarker['title']
                    };

                    var icon = null;
                    var callback = null
                    switch(singleMarker['type']) {
                        case 'food':
                            icon = 'images/mapmarkers/food.svg';
                            callback = this.centerMapClickFunction(singleMarker, mapView);
                            break;
                        case 'info':
                            icon = 'images/mapmarkers/info.svg';
                            callback = this.centerMapClickFunction(singleMarker, mapView);
                            break;
                        case 'room':
                            icon = 'images/mapmarkers/room.svg';
                            callback = this.getRoomMarkerClickFunction(singleMarker, mapView).bind(this);
                            break;
                        case 'toilet':
                            icon = 'images/mapmarkers/toilet.svg';
                            callback = this.centerMapClickFunction(singleMarker, mapView);
                            break;
                        case 'power':
                            icon = 'images/mapmarkers/power.svg';
                            callback = this.centerMapClickFunction(singleMarker, mapView);
                            break;
                    }

                    if(icon != null) {
                        markerOptions.icon = icon;
                    }

                    var marker = new google.maps.Marker(markerOptions);
                    floorOverlays.push(marker);

                    if(callback) {
                        google.maps.event.addListener(marker, 'click', callback);
                    }
                }
            }
        }

        this.setFloorOverlays(floorOverlays);
    }

    MapView.prototype.centerMapClickFunction = function(markerDetails, mapView) {
        return function() {
            mapView.panTo(new google.maps.LatLng(markerDetails['lat'], markerDetails['lng']));
        };
    }

    return MapView;
});