/*global define */
define(['views/base-view', 'views/speaker-detail-view', 'views/session-details-view'], function (BaseView, SpeakerDetailsView, SessionDetailsView) {
    'use strict';

    var SCROLL_END_LIMIT = 200;
    var SCROLL_STEP_SIZE = 0.4;

    var TRANSITION_END = 'webkitTransitionEnd',
    TRANSITION_CSS = '-webkit-transition',
    TRANSFORM_CSS = '-webkit-transform',
    TRANSFORM_STYLE = 'webkitTransform',
    TRANSITION_STYLE = 'webkitTransition';

    function SessionView() {
        BaseView.call(this);

        var model = null;
        var tabElement = null;
        var titleElement = null;
        var descripElement = null;
        var speakerElement = null;
        var paneContainerElement = null;
        var tabIndicatorElement = null;
        
        var isBeingTouched = false;
        var touchStartCoords = null;
        var touchCurrentCoords = null;
        var isLocked = false;
        var scrollHorizontally = false;
        var isTrackingScrolling = false;
        var trackingTimeout = null;
        var bodyWidth = 0;
        var touchSlop = 0;
        var lastScrollEvent = 0;

        var scrollToLeft = 0;
        var performScrollAnimation = false;

        var sessionDetails;

        this.setSessionDetailsView = function(view) {
            sessionDetails = view;
        }

        this.getSessionDetailsView = function() {
            return sessionDetails;
        }

        this.setSessionModel = function(m) {
            model = m;
        }

        this.getSessionModel = function() {
            return model;
        }

        this.setPaneContainerElement = function(element) {
            paneContainerElement = element;
        }

        this.getPaneContainerElement = function() {
            return paneContainerElement;
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

        this.setTabIndicator = function(element) {
            tabIndicatorElement = element;
        }

        this.getTabIndicator = function() {
            return tabIndicatorElement;
        }

        this.resetTouchEvents = function() {
            //isBeingTouched = false
            isLocked = false;
            scrollHorizontally = false;
            bodyWidth = document.body.clientWidth;
            touchSlop = bodyWidth / 3;
        }

        this.isBeingTouched = function() {
            return isBeingTouched;
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

        this.updateScrollEventTime = function() {
            lastScrollEvent = Date.now();
        }

        this.getLastScrollEventTime = function() {
            return lastScrollEvent;
        }

        this.beginScrollTo = function(pixelValue) {
            scrollToLeft = pixelValue;
            performScrollAnimation = true;
        }

        this.performScrollAnimation = function() {
            return performScrollAnimation;
        }

        this.endScrollAnimation = function() {
            performScrollAnimation = false;
        }

        this.getScrollToLeftGoal = function() {
            return scrollToLeft;
        }

        this.onTouchStart = function() {
            isBeingTouched = true;
        }

        this.onTouchEnd = function() {
            isBeingTouched = false;
        }
    };

    SessionView.prototype = Object.create( BaseView.prototype );

    SessionView.prototype.getDomElement = function() {
        var contentContainer = document.createElement('div');
        contentContainer.classList.add('session-panes-container');
        this.setPaneContainerElement(contentContainer);

        var tabSection = this.generateTabs();
        this.setTabElement(tabSection);

        var infoPane = this.generateInfoPane();
        var qaPane = this.generateQAPane();
        var reviewPane = this.generateReviewPane();

        contentContainer.appendChild(infoPane);
        contentContainer.appendChild(qaPane);
        contentContainer.appendChild(reviewPane);

        var that = this;
        contentContainer.addEventListener('scroll', function(e) {
            that.updateScrollEventTime();

            if(!that.isTrackingScrolling()) {
                that.setTrackingScrolling(true);

                window.requestAnimFrame(that.animFrameUpdate.bind(that));
            }

        }, false);
        contentContainer.addEventListener('touchstart', function(e) {
            that.endScrollAnimation();
        }, false);
        
        var wrapper = document.createElement('div');
        wrapper.classList.add('tab-wrapper');
        wrapper.appendChild(tabSection);
        wrapper.appendChild(contentContainer);

        this.updateView();

        return wrapper;
    }

    SessionView.prototype.animFrameUpdate = function() {
        var paneContainer = this.getPaneContainerElement();

        if(this.performScrollAnimation()) {
            var currentScrollLeft = paneContainer.scrollLeft;
            var target = this.getScrollToLeftGoal();

            if(currentScrollLeft == target) {
                this.setTrackingScrolling(false);
                this.endScrollAnimation();
            } else {
                var scrollOffset = (target-currentScrollLeft) * SCROLL_STEP_SIZE;

                if(Math.abs(scrollOffset) < 1) {
                    scrollOffset = (scrollOffset < 0) ? -1 : 1;
                }

                paneContainer.scrollLeft = scrollOffset + currentScrollLeft;
            }
        } else {
            var prevTime = this.getLastScrollEventTime();
            if(!this.isBeingTouched() && (Date.now() - prevTime) > SCROLL_END_LIMIT) {
                var width = paneContainer.clientWidth;
                var scrollWidth = paneContainer.scrollWidth;

                var remainderOfPixels = paneContainer.scrollLeft % width;
                var leftMostIndex = (paneContainer.scrollLeft - remainderOfPixels) / width;

                if(remainderOfPixels > (width / 2)) {
                    leftMostIndex++;
                }

                var scrollToPixel = leftMostIndex * width;
                
                this.beginScrollTo(scrollToPixel);
            }
        }

        var ratioOfScrollPosition = paneContainer.scrollLeft / paneContainer.scrollWidth;
        var tabLeftPosition = paneContainer.clientWidth * ratioOfScrollPosition;

        var tabIndicatorElement = this.getTabIndicator();
        tabIndicatorElement.style[TRANSITION_STYLE] = '0s ease-out';
        tabIndicatorElement.style[TRANSFORM_STYLE] = 'translate('+tabLeftPosition+'px,0)';

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

        //var titleSection = this.generateSessionTitle();
        //this.setTitleElement(titleSection);

        //var descriptionSection = this.generateDescription();
        //this.setDescriptionElement(descriptionSection);

        var sessionSection = this.generateSessionSection();

        var speakerSection = this.generateSpeakerSection();
        this.setSpeakerElement(speakerSection);

        //infoPane.appendChild(titleSection);
        //infoPane.appendChild(descriptionSection);
        infoPane.appendChild(sessionSection);
        infoPane.appendChild(speakerSection);

        return infoPane;
    }

    SessionView.prototype.generateQAPane = function() {
        var qaPane = document.createElement('div');
        qaPane.classList.add('session-qa-pane');
        qaPane.classList.add('session-pane');

        var questionInputContainer = document.createElement('div');
        questionInputContainer.classList.add('session-qa-input-container');

        var inputBox = document.createElement('textarea');
        inputBox.placeholder = 'Please type your question here...';

        var questionButton = document.createElement('button');
        questionButton.appendChild(document.createTextNode('Submit'));
        questionButton.addEventListener('click', function() {
            alert('TODO: Submit your question');
        }, false);

        questionInputContainer.appendChild(inputBox);
        questionInputContainer.appendChild(questionButton);

        qaPane.appendChild(questionInputContainer);

        var questionList = document.createElement('div');
        questionList.classList.add('session-qa-questions');
        

        return qaPane;
    }

    SessionView.prototype.generateReviewPane = function() {
        var reviewPane = document.createElement('div');
        reviewPane.classList.add('session-review-pane');
        reviewPane.classList.add('session-pane');

        //var titleSection = this.generateSessionTitle();
        //titleSection.appendChild(document.createTextNode('I\'m the Review Pane'));

        var reviewText = document.createElement('p');
        reviewText.appendChild(document.createTextNode('I\'m the Review Pane'));

        reviewPane.appendChild(reviewText);

        return reviewPane;
    }

    SessionView.prototype.generateSessionSection = function() {
        var sessionDetails = new SessionDetailsView();
        this.setSessionDetailsView(sessionDetails);
        return sessionDetails.getDomElement();
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
        //this.updateTitleSection();
        //this.updateDescriptionSection();
        this.updateSessionSection();
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

            var that = this;
            title.addEventListener('click', function(index) {
                return function(e) {
                    var width = that.getPaneContainerElement().clientWidth;
                    that.beginScrollTo(index * width);

                    if(!that.isTrackingScrolling()) {
                        that.setTrackingScrolling(true);

                        window.requestAnimFrame(that.animFrameUpdate.bind(that));
                    }
                };
            }(i), false);
        }

        var tabIndicatorElement = document.createElement('div');
        tabIndicatorElement.classList.add('session-tabs-indicator');
        tabIndicatorElement.style.width = 100 / tabTitles.length+'%';

        tabElement.appendChild(tabIndicatorElement);

        this.setTabIndicator(tabIndicatorElement);
    }

    SessionView.prototype.updateSessionSection = function() {
        var model = this.getSessionModel();
        var sessionDetailsView = this.getSessionDetailsView();
        if(!model || !sessionDetailsView) {
            return;
        }

        sessionDetailsView.setModel(model.getSessionDetailsModel());
    }

    SessionView.prototype.updateSpeakerSection = function() {
        var model = this.getSessionModel();
        var speakerElement = this.getSpeakerElement();
        if(!model || !speakerElement) {
            return;
        }

        var listElement = speakerElement.querySelector('.speaker-list');
        this.clearChildViews(listElement);

        var numOfSpeakers = model.getNumberOfSpeakers();
        for(var i = 0; i < numOfSpeakers; i++) {
            var speakerModel = model.getSpeakerModel(i);

            var liElement = document.createElement('li');

            var speakerView = new SpeakerDetailsView();
            speakerView.setModel(speakerModel);

            liElement.appendChild(speakerView.getDomElement());

            listElement.appendChild(liElement);
        }
    }

    SessionView.prototype.setModel = function(model) {
        this.setSessionModel(model);
        this.updateView();
    }

    return SessionView;
});