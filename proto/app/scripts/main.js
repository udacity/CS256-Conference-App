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

function fakeFullscreen () {
    'use strict';
    window.scrollTo(0, 1);
}

require([], function () {
    'use strict';
    // use app here

    fakeFullscreen();

    var url = window.location.pathname;
    if(url.indexOf('schedule.html') > 0) {
        require(['grid-controller'], function() {});
    }
    if(url.indexOf('speakers.html') > 0) {
        require(['speakers'], function() {});
    }
});

