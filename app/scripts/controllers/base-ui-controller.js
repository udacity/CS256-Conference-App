/*global define */
define(['utils'], function (Utils) {
    'use strict';

    function BaseUIController() {}

    BaseUIController.prototype.getView = function() {
    	console.error('BaseUIController.getView: This method ' +
    		'must be overriden');
    }

    BaseUIController.prototype.addedToDom = function() {

    }

    BaseUIController.prototype.onRemovePage = function () {

    }

    BaseUIController.prototype.getPageURL = function() {
        return "";
    }

    BaseUIController.prototype.getState = function() {
        return null;
    }

    BaseUIController.prototype.generatePageContainer = function(className, elements) {
        var container = document.createElement('section');
        container.classList.add('page');
        container.classList.add(className);

        if(elements) {
            for(var i = 0; i < elements.length; i++) {
                container.appendChild(elements[i]);
            }
        }

        return container;
    }

    BaseUIController.prototype.generateTopBar = function(title, actions) {
        var header = document.createElement('header');

        var icon = document.createElement('img');
        icon.classList.add('icon');
        icon.src = "images/icon.png";
        icon.addEventListener('click', this.eventDispatchFunction('Home', window), false);

        var actionsContainer = document.createElement('div');
        actionsContainer.classList.add('actions');

        for(var i = 0; i < actions.length; i++) {
            if(!actions[i].imgSrc || !actions[i].eventName) {
                console.error('BaseUIController: Tried to add action, ' +
                    'but it doesn\'t have all the appropriate properties');
                console.error('BaseUIController: actions['+i+'].imgSrc = ' +
                    actions[i].imgSrc);
                console.error('BaseUIController: actions['+i+'].eventName = ' +
                    actions[i].eventName);
                continue;
            }

            var actionImg = document.createElement('img');
            actionImg.src = actions[i].imgSrc;

            var actionAnchor = document.createElement('a');
            actionAnchor.appendChild(actionImg);
            actionAnchor.addEventListener('click', this.eventDispatchFunction(actions[i].eventName, header), false);

            actionsContainer.appendChild(actionAnchor);
        }

        header.appendChild(icon);
        header.appendChild(actionsContainer);

        return header;
    }

    BaseUIController.prototype.eventDispatchFunction = function(eventName, target, data) {
        return function(e) {
            Utils.dispatchEvent(eventName, target, data);
        };
    }

    return BaseUIController;
});