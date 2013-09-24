/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function GeoView() {
        BaseView.call(this);

        var displayGeoFilter = false;
        var mapDirectionButton = null;
        var geoFilterView = null;
        var model = null;
        var directionsService = null;

        this.toggleGeoDisplayFilter = function() {
            displayGeoFilter = !displayGeoFilter;
            this.updateView();
        }

        this.isGeoFilterDisplayed = function() {
            return displayGeoFilter;
        }

        this.setDisplayGeoView = function(display) {
            if(displayGeoFilter != display) {
                displayGeoFilter = display;
                this.updateView();
            }
        }

        this.setDirectionButton = function(button){
            mapDirectionButton = button;
        }

        this.getDirectionButton = function(){
            return mapDirectionButton;
        }

        this.setGeoFilterView = function(view) {
            geoFilterView = view;
        }

        this.getGeoFilterView = function() {
            return geoFilterView;
        }

        this.setModel = function(m) {
            model = m;
        }

        this.getModel = function() {
            return model;
        }

        this.getDirectionsService = function(){
            return directionsService;
        }

        this.setDirectionsService = function(service){
            directionsService = service;
        }
    };

    // The HomeUIController class extends the BaseUIController class.
    GeoView.prototype = Object.create( BaseView.prototype );

    GeoView.prototype.getDomElement = function() {
        return this.generateGeolocationPanel();
    }

    GeoView.prototype.generateGeolocationPanel = function() {
        var sectionContainer = document.createElement('section');
        sectionContainer.classList.add('info-pane');

        return sectionContainer;
    }

    GeoView.prototype.generateGeolocationPanel = function() {

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

    GeoView.prototype.updateView = function() {
        var filterGeoContainer = this.getGeoFilterView();
        if(filterGeoContainer){
            filterGeoContainer.style['display'] = this.isGeoFilterDisplayed() ? 'block' : 'none';   
        }
    }

    GeoView.prototype.triggerGeolocation = function(){
        var directionsService = this.getDirectionsService();
        if(!directionsService) {
            if(typeof google === 'undefined' && typeof google.maps === 'undefined') {
                return;
            }
            directionsService = new google.maps.DirectionsService();
            this.setDirectionsService(directionsService);
        }

        var directionButton = this.getDirectionButton();
        directionButton.classList.remove('error');
        directionButton.classList.add('disabled');
        directionButton.removeAttribute('href');
        directionButton.removeAttribute('target');
        directionButton.textContent = 'Retrieving Your Position';

        navigator.geolocation.getCurrentPosition( 
            function(position){
                console.log('triggerGeolocation Position Found');
                console.log(position);
                this.elaborateDistance(position);
            }.bind(this),
            function(error){
                console.log('triggerGeolocation Error()');
                directionButton.classList.remove('disabled');
                directionButton.classList.add('error');
                directionButton.textContent = 'Sorry We Couldn\'t Find Your Location';

                console.error(error);    
            }.bind(this),
            {   
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        )
    }

    GeoView.prototype.elaborateDistance = function(position){
        var model = this.getModel();
        var confPos = new google.maps.LatLng(model.getLat(),model.getLong());
        var userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
        var directionsService = this.getDirectionsService();
        var directionButton = this.getDirectionButton();

        console.log('lat = '+model.getLat()+' long = '+model.getLong());

        directionsService.route({
                origin: userPos,
                destination: confPos,
                travelMode: google.maps.TravelMode.DRIVING
            }, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var stats = result.routes[0].legs[0];
                    directionButton.classList.remove('disabled');
                    directionButton.textContent = stats.distance.text + ", " + stats.duration.text + " - tap for route";
                    directionButton.setAttribute('href', "http://maps.google.com/maps?saddr="+position.coords.latitude+","+position.coords.longitude+"&daddr="+model.getLat()+","+model.getLong());
                    directionButton.setAttribute('target', '_blank');
                } else {
                    directionButton.classList.remove('disabled');
                    directionButton.classList.add('error');
                    directionButton.textContent = "error: " + status.toLowerCase();
                }
            }.bind(this)
        );
    }

    return GeoView;
});