/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function SessionView() {
        BaseView.call(this);

        var model = null;
        var tabElement = null;
        var titleElement = null;
        var descripElement = null;
        var speakerElement = null;
        
        var isBeingTouched = false;
        var touchStartCoords = null;
        var touchCurrentCoords = null;
        var isLocked = false;
        var scrollHorizontally = false;
        var isTrackingScrolling = false;
        var trackingTimeout = null;
        var bodyWidth = 0;
        var touchSlop = 0;

        this.setSessionModel = function(m) {
            model = m;
        }

        this.getSessionModel = function() {
            return model;
        }

        this.setTabElement = function(element) {
            tabElement = element;
        }

        this.getTabElement = function() {
            return tabElement;
        }

        this.setTitleElement = function(element) {
            titleElement = element;
        }

        this.getTitleElement = function() {
            return titleElement;
        }

        this.setDescriptionElement = function(element) {
            descripElement = element;
        }

        this.getDescriptionElement = function() {
            return descripElement;
        }

        this.setSpeakerElement = function(element) {
            speakerElement = element;
        }

        this.getSpeakerElement = function() {
            return speakerElement;
        }

        this.resetTouchEvents = function() {
            isBeingTouched = false
            isLocked = false;
            scrollHorizontally = false;
            bodyWidth = document.body.clientWidth;
            touchSlop = bodyWidth / 3;
        }

        this.isBeingTouched = function() {
            return isBeingTouched;
        }

        this.setStartTouchCoords = function(coords) {
            touchStartCoords = coords;
            touchCurrentCoords = coords;
            isBeingTouched = true;
        }

        this.getStartTouchCoords = function() {
            return touchStartCoords;
        }

        this.setCurrentTouchCoords = function(coords) {
            touchCurrentCoords = coords;
        }

        this.getCurrentTouchCoords = function() {
            return touchCurrentCoords;
        }

        this.isScrollingLocked = function() {
            return isLocked;
        }

        this.isScrollingHorizontally = function() {
            return scrollHorizontally;
        }

        this.setScrollLock = function(isScrollHorizontal) {
            isLocked = true;
            scrollHorizontally = isScrollHorizontal;
        }

        this.setTrackingScrolling = function(tracking) {
            isTrackingScrolling = tracking;
        }

        this.isTrackingScrolling = function() {
            return isTrackingScrolling;
        }

        this.getTrackingTimeout = function() {
            return trackingTimeout;
        }

        this.setTrackingTimeout = function(timeout) {
            trackingTimeout = timeout;
        }

        this.getTouchSlop = function() {
            return touchSlop;
        }
    };

    // The HomeUIController class extends the BaseUIController class.
    SessionView.prototype = Object.create( BaseView.prototype );

    SessionView.prototype.getDomElement = function() {
        var header = this.generateTopBar('Session', [{
            imgSrc: 'images/favorite_icon.png',
            eventName: 'Favorite'
        }]);

        var contentContainer = document.createElement('div');
        contentContainer.classList.add('session-panes-container');

        var tabSection = this.generateTabs();
        this.setTabElement(tabSection);

        var infoPane = this.generateInfoPane();
        var qaPane = this.generateQAPane();
        var reviewPane = this.generateReviewPane();

        contentContainer.appendChild(infoPane);
        contentContainer.appendChild(qaPane);
        contentContainer.appendChild(reviewPane);

        var pageContainer = this.generatePageContainer('session-ui', [header, tabSection, contentContainer]);
        var that = this;
        contentContainer.addEventListener('touchstart', function(e) {
            if(e.touches.length != 1) {
                return;
            }

            e.preventDefault();
            that.resetTouchEvents();

            that.setStartTouchCoords({x: e.touches[0].screenX, y: e.touches[0].screenY});
        }, true);
        contentContainer.addEventListener('touchmove', function(e) {
            e.preventDefault();
            
            that.setCurrentTouchCoords({x: e.touches[0].screenX, y: e.touches[0].screenY});

            if(!that.isTrackingScrolling() && !(that.isScrollingLocked() && !that.isScrollingHorizontally())) {
                that.setTrackingScrolling(true);

                window.requestAnimFrame(that.animFrameUpdate.bind(that));
            }

            clearTimeout(that.getTrackingTimeout());

            var timeout = setTimeout((function stopScrollSyncs() {
                    this.setTrackingScrolling(false);
                }).bind(that), 1500);
            that.setTrackingTimeout(timeout);

        }, true);
        contentContainer.addEventListener('touchend', function(e) {
            e.preventDefault();
            that.resetTouchEvents();
        }, true);
        contentContainer.addEventListener('touchcancel', function(e) {
            e.preventDefault();
            that.resetTouchEvents();
        }, true);


        this.updateView();

        return pageContainer;
    }

    SessionView.prototype.animFrameUpdate = function() {
        console.log('session-view: animFrameUpdate()');
        /**var sessionScrollValues = this.getSessionScrollValues();

        this.getTimeLineView().scrollLeft = sessionScrollValues.left;
        this.getTracksView().scrollTop = sessionScrollValues.top;**/

        var startCoord = this.getStartTouchCoords();
        var currentCoord = this.getCurrentTouchCoords();

        var horizontalDistance = startCoord.x - currentCoord.x;
        var verticalDistance = startCoord.y - currentCoord.y;

        if(this.isScrollingLocked) {
            if(this.getTouchSlop() < Math.abs(horizontalDistance)) {
                this.setScrollLock(true);
            } else if(this.getTouchSlop() < Math.abs(verticalDistance)) {
                this.setScrollLock(false);
            }
        }

        if (this.isTrackingScrolling()) {
            window.requestAnimFrame(this.animFrameUpdate.bind(this));
        }
    }

    SessionView.prototype.generateTabs = function() {
        var container = document.createElement('section');
        container.classList.add('session-tabs');

        return container;
    }

    SessionView.prototype.generateInfoPane = function() {
        var infoPane = document.createElement('div');
        infoPane.classList.add('session-info-pane');
        infoPane.classList.add('session-pane');

        var titleSection = this.generateSessionTitle();
        this.setTitleElement(titleSection);

        var descriptionSection = this.generateDescription();
        this.setDescriptionElement(descriptionSection);

        var speakerSection = this.generateSpeakerSection();
        this.setSpeakerElement(speakerSection);

        infoPane.appendChild(titleSection);
        infoPane.appendChild(descriptionSection);
        infoPane.appendChild(speakerSection);

        return infoPane;
    }

    SessionView.prototype.generateQAPane = function() {
        var qaPane = document.createElement('div');
        qaPane.classList.add('session-qa-pane');
        qaPane.classList.add('session-pane');

        var titleSection = this.generateSessionTitle();
        titleSection.appendChild(document.createTextNode('I\'m the QA Pane'));

        qaPane.appendChild(titleSection);

        return qaPane;
    }

    SessionView.prototype.generateReviewPane = function() {
        var reviewPane = document.createElement('div');
        reviewPane.classList.add('session-review-pane');
        reviewPane.classList.add('session-pane');

        var titleSection = this.generateSessionTitle();
        titleSection.appendChild(document.createTextNode('I\'m the Review Pane'));

        reviewPane.appendChild(titleSection);

        return reviewPane;
    }

    SessionView.prototype.generateSessionTitle = function() {
        var container = document.createElement('section');
        container.classList.add('session-header');

        var title = document.createElement('h1');
        title.classList.add('session-title');

        container.appendChild(title);

        var date = document.createElement('h2');
        date.classList.add('session-date');

        container.appendChild(date);

        var room = document.createElement('h2');
        room.classList.add('session-room');

        container.appendChild(room);

        return container;
    }

    SessionView.prototype.generateDescription = function() {
        var container = document.createElement('section');
        container.classList.add('session-description');

        return container;
    }

    SessionView.prototype.generateSpeakerSection = function() {
        var container = document.createElement('section');
        container.classList.add('session-speaker');

        var list = document.createElement('ul');
        list.classList.add('speaker-list');

        container.appendChild(list);

        return container;
    }

    SessionView.prototype.updateView = function() {
        var model = this.getSessionModel();
        if(!model) {
            return;
        }

        this.updateTabSection();
        this.updateTitleSection();
        this.updateDescriptionSection();
        this.updateSpeakerSection();
    }

    SessionView.prototype.updateTabSection = function() {
        var tabElement = this.getTabElement();
        if(!tabElement) {
            return;
        }

        this.clearChildViews(tabElement);

        var tabTitles = [
            'Info',
            'Q & A',
            'Reviews'
        ];

        
        for(var i = 0; i < tabTitles.length; i++) {
            var title = document.createElement('h2');
            title.appendChild(document.createTextNode(tabTitles[i]));

            tabElement.appendChild(title);
        }
    }

    SessionView.prototype.updateTitleSection = function() {
        var model = this.getSessionModel();
        var header = this.getTitleElement();
        if(!model || !header) {
            return;
        }

        var titleElement = header.querySelector('.session-title');
        this.clearChildViews(titleElement);

        titleElement.appendChild(document.createTextNode(model.getTitle()));

        var dateElement = header.querySelector('.session-date');
        this.clearChildViews(dateElement);

        var startTime = model.getStartTime();
        var startHours = startTime.getHours();
        var startMinutes = startTime.getMinutes();

        var endTime = model.getEndTime();
        var endHours = endTime.getHours();
        var endMinutes = endTime.getMinutes();

        var dateString = startTime.toDateString() + ' ';
        dateString += (startHours < 10) ? '0'+startHours : startHours;
        dateString += ':';
        dateString += (startMinutes < 10) ? '0'+startMinutes : startMinutes;
        dateString += ' - ';
        dateString += (endHours < 10) ? '0'+endHours : endHours;
        dateString += ':';
        dateString += (endMinutes < 10) ? '0'+endMinutes : endMinutes;

        dateElement.appendChild(document.createTextNode(dateString));

        var roomElement = header.querySelector('.session-room');
        this.clearChildViews(roomElement);

        roomElement.appendChild(document.createTextNode(model.getRoomName()));
    }

    SessionView.prototype.updateDescriptionSection = function() {
        var model = this.getSessionModel();
        var descripElement = this.getDescriptionElement();
        if(!model || !descripElement) {
            return;
        }

        this.clearChildViews(descripElement);

        var paragraph = document.createElement('p');
        paragraph.appendChild(document.createTextNode(model.getDescription()));

        descripElement.appendChild(paragraph);
    }

    SessionView.prototype.updateSpeakerSection = function() {
        var model = this.getSessionModel();
        var speakerElement = this.getSpeakerElement();
        if(!model || !speakerElement) {
            return;
        }

        var listElement = speakerElement.querySelector('.speaker-list');
        this.clearChildViews(listElement);

        var speakers = model.getSpeakers();
        console.log('speakers.length = '+speakers.length);
        for(var i = 0; i < speakers.length; i++) {
            var speaker = speakers[i];

            var liElement = document.createElement('li');

            var imageContainer = document.createElement('div');
            imageContainer.classList.add('speaker-img-container');

            var speakerImg = document.createElement('img');
            speakerImg.src = speaker.photoUrl;
            imageContainer.appendChild(speakerImg);

            liElement.appendChild(imageContainer);

            var detailsContainer = document.createElement('div');
            detailsContainer.classList.add('speaker-details');

            var speakerName = document.createElement('h4');
            speakerName.appendChild(document.createTextNode(speaker.name));
            detailsContainer.appendChild(speakerName);

            var bio = document.createElement('p');
            bio.appendChild(document.createTextNode(speaker.bio));
            detailsContainer.appendChild(bio);

            var url = document.createElement('a');
            url.classList.add('btn');
            url.classList.add(speaker.urlType);
            url.href = speaker.url;
            url.appendChild(document.createTextNode(speaker.urlText));
            detailsContainer.appendChild(url);

            liElement.appendChild(detailsContainer);

            listElement.appendChild(liElement);
        }
    }

    SessionView.prototype.setModel = function(model) {
        this.setSessionModel(model);
        this.updateView();
    }

    return SessionView;
});