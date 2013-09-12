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

    return BaseUIController;
});