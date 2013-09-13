/*global define */
define([], function () {
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

    return BaseUIController;
});