/*global define */
define([], function () {
    'use strict';

    var exports = {};

    function onMapsLoaded() {
        console.log("onMapsLoaded");
        // Enable the visual refresh
        google.maps.visualRefresh = true;
        
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(-34.397, 150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        console.log("onMapsLoaded() Fin");
    }

    function loadGoogleMaps() {
        console.log("loadGoogleMaps()");
        window.mapsAPILoaded = onMapsLoaded;

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDDe8D78sJVN5DHJj7MaNae5qKMfrTx9K0&sensor=false&callback=mapsAPILoaded";
        document.body.appendChild(script);
    }

    function init() {
        console.log('Initialising the map');
        var filter = document.querySelector('.filter');

        if(window.location.hash == '#filters') {
            filter.hash = '#';    
        } else {
            filter.hash = '#filters';    
        }
        
        filter.addEventListener('click', function(e) {
            e.preventDefault();

            window.location.hash = filter.hash;

            console.log('Filter button clicked filter.href = '+filter.href);
            if(filter.hash == '#filters') {
                filter.hash = '#';
            } else {
                filter.hash = '#filters';
            }
        }, false);


        loadGoogleMaps();
    }

    init();

    return exports;
});