/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function WifiView() {
        BaseView.call(this);
    };

    WifiView.prototype = Object.create( BaseView.prototype );

    WifiView.prototype.getDomElement = function() {
        return this.generateWifiInfo();
    }

    WifiView.prototype.generateWifiInfo = function() {
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

    return WifiView;
});