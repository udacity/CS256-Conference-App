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

function launchFullScreen(element) {
    'use strict';
    console.log('Attempting fullscreen');
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}

require(['app', 'jquery'], function (app, $) {
    'use strict';
    // use app here

    launchFullScreen(document.documentElement);

    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});

