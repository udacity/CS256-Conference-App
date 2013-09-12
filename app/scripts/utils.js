/*global define */
define([], function () {
    'use strict';

    var Utils = {};

    Utils.dispatchEvent = function(eventName, target, data) {
        var evt = new CustomEvent(eventName, {"detail": data});
        target.dispatchEvent(evt);
    }

    return Utils;
});