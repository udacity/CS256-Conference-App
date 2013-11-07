/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function MenuView() {
        BaseView.call(this);

        var buttonClickListener = null;

        this.setOnButtonClickListener = function(listener) {
            buttonClickListener = listener;
        }

        this.getOnButtonClickListener = function() {
            return buttonClickListener;
        }
    };

    // The HomeUIController class extends the BaseUIController class.
    MenuView.prototype = Object.create( BaseView.prototype );

    MenuView.prototype.getDomElement = function() {
        return this.generateHomeButtons();
    }

    MenuView.prototype.generateHomeButtons = function() {
        var sectionContainer = document.createElement('section');
        sectionContainer.classList.add('menu-items-grid');

        var anchors = [
            {
                text: 'Schedule',
                eventName: 'ShowSchedule'
            }, {
                text: 'Map',
                eventName: 'ShowMap'
            }, {
                text: 'Speakers',
                eventName: 'ShowSpeakers'
            }, {
                text: 'Profile',
                eventName: 'ShowProfile'
            }
        ];

        for(var i = 0; i < anchors.length; i++) {
            var contentSpan = document.createElement('span');
            contentSpan.appendChild(document.createTextNode(anchors[i].text));

            var anchor = document.createElement('a');
            anchor.classList.add('button');
            anchor.appendChild(contentSpan);

            if(anchors[i].eventName && anchors[i].eventName.length > 0) {
                //anchor.addEventListener('click', this.eventDispatchFunction(anchors[i].eventName, window), false);
                anchor.addEventListener('click', function(actionName) {
                    return function() {
                        var listener = this.getOnButtonClickListener();
                        if(listener != null) {
                            listener(actionName);
                        }
                    };
                }(anchors[i].eventName).bind(this), false)
            }

            sectionContainer.appendChild(anchor);
        }

        return sectionContainer;
    }

    

    return MenuView;
});