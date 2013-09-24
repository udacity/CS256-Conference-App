/*global define */
define([''], function () {
    'use strict';

    var config = {};

    config.getRootUrl = function() {
        return 'http://udacity-conf.appspot.com';
        //return 'http://localhost:9000'
    }

    return config;
});