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

var gridScrollValues = {left: 0, top: 0};
var trackingScroll = false;
var killTrackTimeout;

var gridContent = document.querySelector('#grid-content');
var locations = document.querySelector('#locations');
var timeline = document.querySelector('#timeline');

function prepareSticky() {
    gridContent.addEventListener('scroll', onGridScroll);
}

function onGridScroll(e) {
    gridScrollValues.left = gridContent.scrollLeft;
    gridScrollValues.top = gridContent.scrollTop;

    if(!trackingScroll) {
        requestAnimationFrame(syncScrolls);
    }

    clearTimeout(killTrackTimeout);
    killTrackTimeout = setTimeout(stopScrollSyncs, 1500);

    trackingScroll = true;
}

function syncScrolls() {
    timeline.scrollLeft = gridScrollValues.left;
    locations.scrollTop = gridScrollValues.top;

    if (trackingScroll) {
        requestAnimationFrame(syncScrolls);
    }
}

function stopScrollSyncs() {
    trackingScroll = false;
}

require(['jquery'], function ($) {
    'use strict';
    prepareSticky();
});

