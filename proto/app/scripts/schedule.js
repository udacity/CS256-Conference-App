require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});



require(['jquery', 'grid-controller'], function ($, gridController) {
    'use strict';

    gridController.updateSessionsData();
});

