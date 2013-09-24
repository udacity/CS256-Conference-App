/*global define */
define([], function () {
    'use strict';

    function BaseView() {

    }

    BaseView.prototype.getDomElement = function() {
    	console.error('BaseUIController.getDomElement: This method ' +
    		'must be overriden');
    }

    BaseView.prototype.clearChildViews = function(view) {
        if(!view) {
            return;
        }
        
        var firstChild = view.firstChild;
        while(firstChild) {
            console.log('Removing first child');
            view.removeChild(firstChild);
            firstChild = view.firstChild;
        }
    }


    return BaseView;
});