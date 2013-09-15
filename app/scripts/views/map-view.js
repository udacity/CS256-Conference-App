/*global define */
define(['views/base-view', 'utils'], function (BaseView, Utils) {
    'use strict';

    function MapView() {
        BaseView.call(this);

        var displayFilter = false;
        var displayGeoFilter = false;
        var centeredMap = false;

        var lat = null;
        var lon = null;
        var zoomLevel = null;

        var mapView = null;
        var floorSelectorView = null;

        var floorMapOverlay = null;
        var floorOverlays = [];
        var currentOverlay = null;

        var floorLevel = 0;
        var numOfFloors = 0;
        var floorMarkers = [];
        var filtersDisplay = {};

        var filterView = null;
        var geoFilterView = null;
        var mapDirectionButton = null;
        var mapContainer = null;
        var pageContainer = null;

        var directionsService = null;

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

            filterView = null;
            mapContainer = null;
        }

        this.isFilterDisplayed = function() {
            return displayFilter;
        }

        this.toggleDisplayFilter = function() {
            displayFilter = !displayFilter;
        }

        this.toggleGeoDisplayFilter = function() {
            displayGeoFilter = !displayGeoFilter;
        }

        this.setDisplayFilter = function(flag) {
            displayFilter = flag;
        }

        this.setGeoDisplayFilter = function(flag) {
            displayGeoFilter = flag;
        }        

        this.isGeoFilterDisplayed = function() {
            return displayGeoFilter;
        }        

        this.setLatLong = function(la, lo) {
            lat = la;
            lon = lo;
        }

        this.getLat = function() {
            return lat;
        }

        this.getLong = function() {
            return lon;
        }

        this.setZoomLevel = function(zoom) {
            zoomLevel = zoom;
        }

        this.getZoomLevel = function() {
            return zoomLevel;
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
            if(numOfFloors == 0) {
                return -1;
            }
            if(floorLevel >= numOfFloors) {
                floorLevel = 0;
            }

            return floorLevel;
        }

        this.setNumberOfFloors = function(count) {
            numOfFloors = count;
        }

        this.getNumberOfFloors = function() {
            return numOfFloors;
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

        this.getFloorMarkers = function() {
            if(floorMarkers == null) {
                floorMarkers = [];
            }

            return floorMarkers;
        }

        this.setFloorOverlays = function(overlays) {
            floorOverlays = overlays;
        }

        this.getFloorOverlays = function() {
            if(floorOverlays == null) {
                floorOverlays = [];
            }
            return floorOverlays;
        }

        this.setShowFilters = function(filterName, display) {
            filtersDisplay[filterName] = display;
        }

        this.getShowFilter = function(filterName) {
            var display = filtersDisplay[filterName];
            if(typeof display === 'undefined') {
                display = true;
            }
            return display;
        }

        this.setCurrentOverlay = function(overlay) {
            currentOverlay = overlay;
        }

        this.getCurrentOverlay = function() {
            return currentOverlay;
        }

        this.setFilterView = function(view) {
            filterView = view;
        }

        this.getFilterView = function() {
            return filterView;
        }

        this.setGeoFilterView = function(view) {
            geoFilterView = view;
        }

        this.setDirectionButton = function(button){
            mapDirectionButton = button;
        }

        this.getDirectionButton = function(){
            return mapDirectionButton;
        }        

        this.getGeoFilterView = function() {
            return geoFilterView;
        }        

        this.setMapContainer = function(container) {
            mapContainer = container;
        }

        this.getMapContainer = function() {
            return mapContainer;
        }

        this.setPageContainer = function(container) {
            pageContainer = container;
        }

        this.getPageContainer = function() {
            return pageContainer;
        }

        this.getDirectionsService = function(){
            return directionsService;
        }

        this.setDirectiosService = function(service){
            directionsService = service;
        }
    };

    // The HomeUIController class extends the BaseUIController class.
    MapView.prototype = Object.create( BaseView.prototype );

    MapView.prototype.getDomElement = function() {
        var views = [];

        var header = this.generateTopBar('Map', [{
            imgSrc: 'images/filter_icon.png',
            eventName: 'FilterAction'
        },{
            imgSrc: 'images/locate_icon.png',
            eventName: 'GeolocationAction'            
        }]);

        if(header) {
            views.push(header);
        
            header.addEventListener('FilterAction', function() {
                this.toggleDisplayFilter();
                this.setGeoDisplayFilter(false);
                this.updateView();
            }.bind(this), false);

            header.addEventListener('GeolocationAction', function(){
                this.toggleGeoDisplayFilter();
                this.setDisplayFilter(false);
                this.triggerGeolocation();
                this.updateView();
            }.bind(this), false)
        }

        var locationView = this.generateGeolocationPanel();
        views.push(locationView);
        
        var filterView = this.generateFilterOptions();
        views.push(filterView);

        var mapContainer = this.generateGoogleMap();
        views.push(mapContainer);

        var pageContainer = this.generatePageContainer('map-ui', views);
        this.setPageContainer(pageContainer);
        return pageContainer;
    }

    MapView.prototype.triggerGeolocation = function(){
        var directionButton = this.getDirectionButton();
        directionButton.classList.remove('error');
        directionButton.classList.add('disabled');
        directionButton.removeAttribute('href');
        directionButton.removeAttribute('target');
        directionButton.textContent = 'retrieving current position ...';

        navigator.geolocation.getCurrentPosition( 
            function(position){
                this.elaborateDistance(position);
            }.bind(this),
            function(error){
                directionButton.classList.remove('disabled');
                directionButton.classList.add('error');
                directionButton.textContent = error.message;    
            }.bind(this),
            {   
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        )
    }

    MapView.prototype.elaborateDistance = function(position){
        var confPos = new google.maps.LatLng(this.getLat(),this.getLong());
        var userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
        var directionsService = this.getDirectionsService();
        var directionButton = this.getDirectionButton();

        directionsService.route({
                origin: userPos,
                destination: confPos,
                travelMode: google.maps.TravelMode.DRIVING
            }, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var stats = result.routes[0].legs[0];
                    directionButton.classList.remove('disabled');
                    directionButton.textContent = stats.distance.text + ", " + stats.duration.text + " - tap for route";
                    directionButton.setAttribute('href', "http://maps.google.com/maps?saddr="+position.coords.latitude+","+position.coords.longitude+"&daddr="+this.getLat()+","+this.getLong());
                    directionButton.setAttribute('target', '_blank');
                }else{
                    directionButton.classList.remove('disabled');
                    directionButton.classList.add('error');
                    directionButton.textContent = "error: " + status.toLowerCase();
                }
            }.bind(this)
        );
    }

    MapView.prototype.getFilterOptionSwitch = function(type) {
        return function() {
            var display = this.getShowFilter(type);
            this.setShowFilters(type, !display);
            this.updateView();
        }.bind(this);
    }

    MapView.prototype.getLayers = function() {
        return [
            {
                className: 'toilets',
                title: 'Toilets',
                type: 'toilet',
                cb: this.getFilterOptionSwitch('toilet')
            },{
                className: 'power',
                title: 'Power',
                type: 'power',
                cb: this.getFilterOptionSwitch('power')
            },{
                className: 'food',
                title: 'Food',
                type: 'food',
                cb: this.getFilterOptionSwitch('food')
            },{
                className: 'info',
                title: 'Info',
                type: 'info',
                cb: this.getFilterOptionSwitch('info')
            },{
                className: 'room',
                title: 'Rooms',
                type: 'room',
                cb: this.getFilterOptionSwitch('room')
            }
        ];
    }

    MapView.prototype.generateGeolocationPanel = function(){

        var directionButton = document.createElement('a');
        directionButton.classList.add('get-direction');
        directionButton.appendChild(document.createTextNode('Get Directions'));

        var container = document.createElement('div');
        container.classList.add('geolocation-container');

        container.style['display'] = this.isGeoFilterDisplayed() ? 'block' : 'none';
        container.appendChild(directionButton);

        this.setDirectionButton(directionButton);
        this.setGeoFilterView(container);

        return container;
    }

    MapView.prototype.generateFilterOptions = function() {
        var layerOptions = this.getLayers();

        var mapLayerOptions = document.createElement('div');
        mapLayerOptions.classList.add('map-layer-options');
        for(var i = 0; i < layerOptions.length; i++) {
            var optionContainer = document.createElement('div');
            optionContainer.classList.add('layer-option');
            optionContainer.classList.add(layerOptions[i].className);

            var icon = document.createElement('div');
            icon.classList.add('icon');

            optionContainer.appendChild(icon);

            var span = document.createElement('span');
            span.appendChild(document.createTextNode(layerOptions[i].title));

            optionContainer.appendChild(span);
            optionContainer.addEventListener('click', layerOptions[i].cb, false);

            mapLayerOptions.appendChild(optionContainer);
        }

        var roomButton = document.createElement('a');
        roomButton.classList.add('room-selection');
        roomButton.appendChild(document.createTextNode('Find Room'));

        var container = document.createElement('div');
        container.classList.add('filters-container');

        container.appendChild(mapLayerOptions);
        container.appendChild(roomButton);

        container.style['display'] = this.isFilterDisplayed() ? 'block' : 'none';

        this.setFilterView(container);

        return container;
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
        if(typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            this.initaliseMap();
            this.setDirectiosService(new google.maps.DirectionsService());
            return;
        }

        var mapContainer = this.getMapContainer();
        var mapElement = mapContainer.querySelector('#map-canvas');
        mapElement.addEventListener('GoogleMapsLoaded', function(){
            this.initaliseMap();
            this.setDirectiosService(new google.maps.DirectionsService());
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
        var filterContainer = this.getFilterView();
        var filterGeoContainer = this.getGeoFilterView();
        if(filterContainer) {
            filterContainer.style['display'] = this.isFilterDisplayed() ? 'block' : 'none';
        }
        if(filterGeoContainer){
            filterGeoContainer.style['display'] = this.isGeoFilterDisplayed() ? 'block' : 'none';   
        }


        var mapLayersContainer = filterContainer.querySelector('.map-layer-options');
        var layers = this.getLayers();
        for(var i = 0; i < layers.length; i++) {
            var className = layers[i].className;
            var layerElement = mapLayersContainer.querySelector('.'+className);
            if(!layerElement) {
                continue;
            }

            if(!this.getShowFilter(layers[i].type)) {
                layerElement.classList.add('disabled');
            } else {
                layerElement.classList.remove('disabled');
            }
        }

        var mapView = this.getMapView();

        if(!mapView) {
            return;
        }

        if(!this.hasCenteredMap() && this.getLat() && this.getLong()) {
            this.setHasCenteredMap(true);

            mapView.setCenter(new google.maps.LatLng(this.getLat(), this.getLong()));
            mapView.setZoom(this.getZoomLevel());
        }

        var selectedFoorLevel = this.getFloorLevel();
        var floorSelectorView = this.getFloorSelectorView();

        var numberOfFloors = this.getNumberOfFloors();
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
                            overley.setMap(null);
                            this.setCurrentOverlay(null);
                        }
                        this.setFloorLevel(floorLevel);
                        this.updateView();
                        this.eventDispatchFunction('FloorLevelChange', this.getPageContainer(), {floorLevel: floorLevel})();
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

        var allFloorMarkers = this.getFloorMarkers();
        var floorOverlays = [];

        var oldFloorOverlays = this.getFloorOverlays();
        for(var i = 0; i < oldFloorOverlays.length; i++) {
            oldFloorOverlays[i].setMap(null);
        }

        if(selectedFoorLevel < allFloorMarkers.length) {
            var markers = allFloorMarkers[selectedFoorLevel];
            if(markers) {
                for(var i = 0; i < markers.length; i++) {
                    var singleMarker = markers[i];
                    var display = this.getShowFilter(singleMarker['type']);
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
                    that.eventDispatchFunction('ShowSession', window, session)();
                });
                that.setCurrentOverlay(overlay);
            }); 
        }.bind(this);
    }

    MapView.prototype.centerMapClickFunction = function(markerDetails, mapView) {
        return function() {
            mapView.panTo(new google.maps.LatLng(markerDetails['lat'], markerDetails['lng']));
        };
    }

    MapView.prototype.setModel = function(model) {
        this.setLatLong(model.getLat(), model.getLong());
        this.setZoomLevel(model.getInitZoomLevel());
        this.setNumberOfFloors(model.getNumberOfFloors());
        this.setFloorMarkers(model.getMapMarkers());
        this.updateView();
    }

    return MapView;
});