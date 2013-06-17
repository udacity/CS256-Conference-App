/*global define */
define(['grid-view'], function (gridView) {
    'use strict';

    var exports = {};

    var tracks = [
        {
            title: 'Android',
            class: 'android',
            sessions: [
                {
                    sessionId: 0,
                    title: 'Android Protips: Making Apps Work Like Magic',
                    roomId: 12,
                    startTime: new Date(2013, 5,16, 10, 0, 0),
                    endTime: new Date(2013, 5,16, 11, 0, 0)
                },
                {
                    sessionId: 0,
                    title: 'Enabling Blind and Low-Vision Accessibility On Android',
                    roomId: 8,
                    startTime: new Date(2013, 5,16, 10, 0, 0),
                    endTime: new Date(2013, 5,16, 11, 0, 0)
                },
                {
                    sessionId: 0,
                    title: 'Google+ Sign-In for Android Developers',
                    roomId: 1,
                    startTime: new Date(2013, 5,16, 11, 15, 0),
                    endTime: new Date(2013, 5,16, 11, 55, 0)
                },
                {
                    sessionId: 0,
                    title: 'Beyond the Blue Dot: New Features in Android Location',
                    roomId: 8,
                    startTime: new Date(2013, 5,16, 11, 15, 0),
                    endTime: new Date(2013, 5,16, 11, 55, 0)
                },
                {
                    sessionId: 0,
                    title: 'What\'s New in Google Play Services',
                    roomId: 12,
                    startTime: new Date(2013, 5,16, 12, 45, 0),
                    endTime: new Date(2013, 5,16, 13, 25, 0)
                },
                {
                    sessionId: 0,
                    title: 'Enchant, Simplify, Amaze: Android\'s Design Principles',
                    roomId: 5,
                    startTime: new Date(2013, 5,16, 12, 45, 0),
                    endTime: new Date(2013, 5,16, 13, 25, 0)
                },
                {
                    sessionId: 0,
                    title: 'Google Cloud Messaging',
                    roomId: 12,
                    startTime: new Date(2013, 5,16, 13, 40, 0),
                    endTime: new Date(2013, 5,16, 14, 20, 0)
                },
                {
                    sessionId: 0,
                    title: 'Agile UX Research Practice in Android',
                    roomId: 8,
                    startTime: new Date(2013, 5,16, 13, 40, 0),
                    endTime: new Date(2013, 5,16, 14, 20, 0)
                },
                {
                    sessionId: 0,
                    title: 'Android Graphics Performance',
                    roomId: 12,
                    startTime: new Date(2013, 5,16, 14, 35, 0),
                    endTime: new Date(2013, 5,16, 15, 15, 0)
                },
                {
                    sessionId: 0,
                    title: 'Structure in Android App Design',
                    roomId: 5,
                    startTime: new Date(2013, 5,16, 14, 35, 0),
                    endTime: new Date(2013, 5,16, 15, 15, 0)
                },
                {
                    sessionId: 0,
                    title: 'From Nothing to Nirvana in Minutes: Cloud Backend for Your Android Application',
                    roomId: 2,
                    startTime: new Date(2013, 5,16, 15, 30, 0),
                    endTime: new Date(2013, 5,16, 16, 10, 0)
                },
                {
                    sessionId: 0,
                    title: 'When Android Meets Maps',
                    roomId: 5,
                    startTime: new Date(2013, 5,16, 15, 30, 0),
                    endTime: new Date(2013, 5,16, 16, 10, 0)
                },
                {
                    sessionId: 0,
                    title: 'Android Design for UI Developers',
                    roomId: 12,
                    startTime: new Date(2013, 5,16, 15, 30, 0),
                    endTime: new Date(2013, 5,16, 16, 10, 0)
                },
                {
                    sessionId: 0,
                    title: 'High Performance Audio',
                    roomId: 5,
                    startTime: new Date(2013, 5,16, 16, 25, 0),
                    endTime: new Date(2013, 5,16, 17, 5, 0)
                },
                {
                    sessionId: 0,
                    title: 'A Moving Experience',
                    roomId: 12,
                    startTime: new Date(2013, 5,16, 16, 25, 0),
                    endTime: new Date(2013, 5,16, 17, 5, 0)
                },
                {
                    sessionId: 0,
                    title: 'Fireside Chat with the Android Team',
                    roomId: 12,
                    startTime: new Date(2013, 5,16, 17, 20, 0),
                    endTime: new Date(2013, 5,16, 18, 0, 0)
                }
            ]
        },
        {
            title: 'Chrome & Apps',
            class: 'chrome',
            sessions: [
                {
                    sessionId: 0,
                    title: 'Stunning Mobile Visualization with CSS Filters',
                    roomId: 6,
                    startTime: new Date(2013, 5,16, 10, 0, 0),
                    endTime: new Date(2013, 5,16, 11, 0, 0)
                },
                {
                    sessionId: 0,
                    title: 'Getting Your App Noticed Inside Google Drive',
                    roomId: 11,
                    startTime: new Date(2013, 5,16, 10, 0, 0),
                    endTime: new Date(2013, 5,16, 11, 0, 0)
                },
                {
                    sessionId: 0,
                    title: 'Web Language and VMs: Fast Code is Always in Fashion',
                    roomId: 10,
                    startTime: new Date(2013, 5,16, 10, 0, 0),
                    endTime: new Date(2013, 5,16, 11, 0, 0)
                },
                {
                    sessionId: 0,
                    title: 'Web Page Design with the GPU in Mind',
                    roomId: 6,
                    startTime: new Date(2013, 5,16, 11, 15, 0),
                    endTime: new Date(2013, 5,16, 11, 55, 0)
                },
                {
                    sessionId: 0,
                    title: 'Web Components: A Tectonic Shift for Web Development',
                    roomId: 10,
                    startTime: new Date(2013, 5,16, 11, 15, 0),
                    endTime: new Date(2013, 5,16, 11, 55, 0)
                },
                {
                    sessionId: 0,
                    title: 'Web Components in Action',
                    roomId: 10,
                    startTime: new Date(2013, 5,16, 12, 45, 0),
                    endTime: new Date(2013, 5,16, 13, 25, 0)
                },
                {
                    sessionId: 0,
                    title: 'What\'s New in Dart: Your First-Class Upgrade to Web Development',
                    roomId: 6,
                    startTime: new Date(2013, 5,16, 12, 45, 0),
                    endTime: new Date(2013, 5,16, 13, 25, 0)
                },
                {
                    sessionId: 0,
                    title: 'Introducing a New Way to Administer Businesses on Google',
                    roomId: 3,
                    startTime: new Date(2013, 5,16, 12, 45, 0),
                    endTime: new Date(2013, 5,16, 13, 25, 0)
                },
                {
                    sessionId: 0,
                    title: 'Integrate Google Drive with Google Apps Script',
                    roomId: 8,
                    startTime: new Date(2013, 5,16, 13, 40, 0),
                    endTime: new Date(2013, 5,16, 14, 20, 0)
                },
                {
                    sessionId: 0,
                    title: 'Accelerating Oz with V8: Follow the Yellow Brick Road to Javascript Performance',
                    roomId: 10,
                    startTime: new Date(2013, 5,16, 13, 40, 0),
                    endTime: new Date(2013, 5,16, 14, 20, 0)
                },
                {
                    sessionId: 0,
                    title: 'Mobile HTML: The Future of Your Sites',
                    roomId: 6,
                    startTime: new Date(2013, 5,16, 13, 40, 0),
                    endTime: new Date(2013, 5,16, 14, 20, 0)
                },
            ]
        },
        {
            title: 'Google+',
            class: 'g-plus',
            sessions: []
        },
        {
            title: 'Google Cloud Platform',
            class: 'cloud',
            sessions: []
        },
        {
            title: 'Google Maps',
            class: 'maps',
            sessions: []
        },
        {
            title: 'YouTube',
            class: 'youtube',
            sessions: []
        },
        {
            title: 'Glass',
            class: 'glass',
            sessions: []
        },
        {
            title: 'Google Ads',
            class: 'ads',
            sessions: []
        },
        {
            title: 'Google Wallet',
            class: 'wallet',
            sessions: []
        },
        {
            title: 'Knowledge & Strctured Data',
            class: 'knowledge',
            sessions: []
        },
        {
            title: 'Tech Talk',
            class: 'tech-talk',
            sessions: []
        }
    ];



    exports.updateSessionsData = function () {
        gridView.setSessionData(tracks);
    };

    return exports;
});