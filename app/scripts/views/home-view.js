/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function HomeView() {
        BaseView.call(this);
    };

    // The HomeUIController class extends the BaseUIController class.
    HomeView.prototype = Object.create( BaseView.prototype );

    HomeView.prototype.getDomElement = function() {
        var header = this.generateTopBar('Home', []);
        var infoPane = this.generateInfoPane();
        var menuItems = this.generateHomeButtons();
        var wifiInfo = this.generateWifiInfo();

        var pageContainer = this.generatePageContainer('home-ui', [header, infoPane, menuItems, wifiInfo]);

        return pageContainer;
    }

    HomeView.prototype.generateInfoPane = function() {
        var sectionContainer = document.createElement('section');
        sectionContainer.classList.add('info-pane');

        return sectionContainer;
    }

    HomeView.prototype.generateHomeButtons = function() {
        var sectionContainer = document.createElement('section');
        sectionContainer.classList.add('menu-items-grid');

        var anchors = [
            {
                text: 'Schedule',
                eventName: 'ShowSchedule'
            }, {
                text: 'Map',
                eventName: 'ShowMap'
            }, {
                text: 'Speakers',
                eventName: ''
            }, {
                text: 'Info',
                eventName: ''
            }
        ];

        for(var i = 0; i < anchors.length; i++) {
            var contentSpan = document.createElement('span');
            contentSpan.appendChild(document.createTextNode(anchors[i].text));

            var anchor = document.createElement('a');
            anchor.classList.add('button');
            anchor.appendChild(contentSpan);

            if(anchors[i].eventName && anchors[i].eventName.length > 0) {
                anchor.addEventListener('click', this.eventDispatchFunction(anchors[i].eventName, window), false);
            }

            sectionContainer.appendChild(anchor);
        }

        return sectionContainer;
    }

    HomeView.prototype.generateWifiInfo = function() {
        var titleTag = document.createElement('h2');
        titleTag.appendChild(document.createTextNode('Wifi'));

        var titleCol = document.createElement('td');
        titleCol.rowSpan = 2;
        titleCol.appendChild(titleTag);

        var col1 = document.createElement('td');
        col1.appendChild(document.createTextNode('SSID:'));
        var col2 = document.createElement('td');
        col2.appendChild(document.createTextNode('UdaciConf'));

        var firstRow = document.createElement('tr');
        firstRow.appendChild(titleCol);
        firstRow.appendChild(col1);
        firstRow.appendChild(col2);

        col1 = document.createElement('td');
        col1.appendChild(document.createTextNode('Password:'));
        col2 = document.createElement('td');
        col2.appendChild(document.createTextNode('SecretPassword'));

        var secondRow = document.createElement('tr');
        secondRow.appendChild(col1);
        secondRow.appendChild(col2);

        var table = document.createElement('table');
        table.appendChild(firstRow);
        table.appendChild(secondRow);

        var sectionContainer = document.createElement('section');
        sectionContainer.classList.add('wifi-details');
        sectionContainer.appendChild(table);

        return sectionContainer;
    }

    return HomeView;
});