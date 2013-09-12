/*global define */
define(['config'], function (config) {
    'use strict';

    function MapModel() {
        var lat = null;
        var lon = null;
        var initZoomLevel = null;
        var numberOfFloors = 0;
        var floorMarkers = [];

        this.setEventLatLong = function(la, lo) {
            lat = la;
            lon = lo;
        }

        this.getLat = function() {
            return lat;
        }

        this.getLong = function() {
            return lon;
        }

        this.setTracks = function(data) {
            tracks = data;
        }

        this.setEventStartDate = function(date) {
            eventStartDate = date;
        }

        this.setEventEndDate = function(date) {
            eventEndDate = date;
        }

        this.setInitZoomLevel = function(zoom) {
            initZoomLevel = zoom;
        }

        this.getInitZoomLevel = function() {
            return initZoomLevel;
        }

        this.getNumberOfFloors = function() {
            return numberOfFloors;
        }

        this.setNumberOfFloors = function(num) {
            numberOfFloors = num;
        }

        this.setMapMarkers = function(markers) {
            floorMarkers = markers;
        }

        this.getMapMarkers = function() {
            return floorMarkers;
        }
    };

    MapModel.prototype.getModelData = function(successCb, errorCb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', config.getRootUrl()+'/json/maps.json', true);

        var that = this;
        xhr.onreadystatechange = (function(e) {
            if (xhr.readyState == 4) {
                if(xhr.status != 200) {
                    console.log('map-model: getModelData() error()');
                    errorCb();
                    return;
                } else {
                    var data = JSON.parse(xhr.responseText);
                    this.handleAPIResponse(data, successCb, errorCb);
                }
            }
        }).bind(this);

        xhr.send();
    }

    MapModel.prototype.handleAPIResponse = function(response, successCb, errorCb) {
        if(response.error) {
            console.error('map-model: There was a problem getting '+
                'the map data: '+response.error);
            errorCb();
            return;
        }

        var data = response.data;

        this.setEventLatLong(data['event-lat'], data['event-long']);
        this.setInitZoomLevel(data['initial-zoom']);
        this.setNumberOfFloors(data['number-of-floors']);

        var markersData = data['map-markers'];
        var floorMarkers = [];
        for(var i = 0; i < markersData.length; i++) {
            floorMarkers[markersData[i]['floor']] = markersData[i]['markers'];
        }
        this.setMapMarkers(floorMarkers);

        successCb();
    }

    return MapModel;
});