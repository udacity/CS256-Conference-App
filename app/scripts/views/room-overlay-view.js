/*global define */
define([], function () {
    'use strict';

    RoomOverlayView.prototype = new google.maps.OverlayView();

    function RoomOverlayView(rDetails, cSession, nSession, m, pan, cb) {
        this.roomDetails = rDetails;
        this.currentSession = cSession;
        this.nextSession = nSession;
        this.map = m;
        this.element = null;
        this.panOnAdd = pan;
        this.sessionClickCb = cb;

        this.setMap(m)
    };

    RoomOverlayView.prototype.onAdd = function() {
        var container = document.createElement('div');
        container.classList.add('talk-overlay');
        container.style.position = 'absolute';

        var title = document.createElement('h1');
        title.classList.add('room-title');
        title.appendChild(document.createTextNode(this.roomDetails.title));

        container.appendChild(title);

        var currentSessionContainer = document.createElement('section');
        currentSessionContainer.addEventListener('click', function() {
            this.sessionClickCb(this.currentSession);
        }.bind(this), true);

        var currentTitle = document.createElement('h2');
        currentTitle.appendChild(document.createTextNode('Current Talk'));

        var currentTimeContainer = document.createElement('div');
        currentTimeContainer.classList.add('time-container');

        var currentTalkTitle = document.createElement('span');
        currentTalkTitle.classList.add('talk-title');
        currentTalkTitle.appendChild(document.createTextNode(this.currentSession.title));

        var currentTalkTime = document.createElement('span');
        currentTalkTime.classList.add('talk-time');
        currentTalkTime.appendChild(document.createTextNode(this.currentSession.start+' - '+this.currentSession.end));

        currentSessionContainer.appendChild(currentTitle);
        currentTimeContainer.appendChild(currentTalkTitle);
        currentTimeContainer.appendChild(currentTalkTime);
        currentSessionContainer.appendChild(currentTimeContainer);

        container.appendChild(currentSessionContainer);

        var nextSessionContainer = document.createElement('section');
        nextSessionContainer.addEventListener('click', function() {
            this.sessionClickCb(this.nextSession);
        }.bind(this), true);

        var nextTitle = document.createElement('h2');
        nextTitle.appendChild(document.createTextNode('Next Talk'));

        var timeContainer = document.createElement('div');
        timeContainer.classList.add('time-container');

        var nextTalkTitle = document.createElement('span');
        nextTalkTitle.classList.add('talk-title');
        nextTalkTitle.appendChild(document.createTextNode(this.nextSession.title));

        var nextTalkTime = document.createElement('span');
        nextTalkTime.classList.add('talk-time');
        nextTalkTime.appendChild(document.createTextNode(this.nextSession.start+' - '+this.nextSession.end));

        nextSessionContainer.appendChild(nextTitle);
        timeContainer.appendChild(nextTalkTitle);
        timeContainer.appendChild(nextTalkTime);
        nextSessionContainer.appendChild(timeContainer);

        container.appendChild(nextSessionContainer);
        
        this.element = container;

        var panes = this.getPanes();
        panes.floatPane.appendChild(container);

        if(this.panOnAdd) {
            //var position = new google.maps.LatLng(this.roomDetails.lat, this.roomDetails.lng);

            //this.map.panTo(position);
            //this.panOnAdd = false;
        }
    }

    RoomOverlayView.prototype.draw = function() {
        // Size and position the overlay. We use a southwest and northeast
        // position of the overlay to peg it to the correct position and size.
        // We need to retrieve the projection from this overlay to do this.
        var overlayProjection = this.getProjection();

        // Retrieve the southwest and northeast coordinates of this overlay
        // in latlngs and convert them to pixels coordinates.
        // We'll use these coordinates to resize the DIV.
        var position = new google.maps.LatLng(this.roomDetails.lat, this.roomDetails.lng);
        var bounds = overlayProjection.fromLatLngToDivPixel(position);

        // Resize the image's DIV to fit the indicated dimensions.
        var div = this.element;
        div.style.left = bounds.x + 'px';
        div.style.top = bounds.y + 'px';

        var markerHeight = 54;
        var pointHeight = 16;
        var optionPadding = 4;
        var marginTopValue = (-div.offsetHeight - markerHeight - pointHeight - optionPadding);
        div.style.marginTop = marginTopValue+'px';

        if(this.panOnAdd) {
            var centerX = bounds.x;
            var centerY = bounds.y + (marginTopValue / 2);
            var overlayCenterPoint = new google.maps.Point(centerX, centerY);
            var centerLatLong = overlayProjection.fromDivPixelToLatLng(overlayCenterPoint, true);
            this.map.panTo(centerLatLong);

            this.panOnAdd = false;
        }
    }
    
    RoomOverlayView.prototype.onRemove = function() {
        this.element.parentNode.removeChild(this.element);
        this.element = null;
    }

    return RoomOverlayView;
});