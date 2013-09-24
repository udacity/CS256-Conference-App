/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function InfoView() {
        BaseView.call(this);
    };

    // The HomeUIController class extends the BaseUIController class.
    InfoView.prototype = Object.create( BaseView.prototype );

    InfoView.prototype.getDomElement = function() {
        return this.generateInfoPane();
    }

    InfoView.prototype.generateInfoPane = function() {
        var sectionContainer = document.createElement('section');
        sectionContainer.classList.add('info-pane');

        return sectionContainer;
    }

    return InfoView;
});