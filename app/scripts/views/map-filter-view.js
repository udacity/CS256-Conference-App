/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function FilterView() {
        BaseView.call(this);

        var displayFilter = false;
        var layersContainer = null;
        var model = null;

        this.isFilterDisplayed = function() {
            return displayFilter;
        }

        this.toggleDisplayFilter = function() {
            displayFilter = !displayFilter;
            this.updateView();
        }

        this.setDisplayFilterView = function(display) {
            if(displayFilter != display) {
                displayFilter = display;
                this.updateView();
            }
        }

        this.setLayersContainer = function(container) {
            layersContainer = container;
        }

        this.getLayersContainer = function() {
            return layersContainer;
        }

        this.getModel = function() {
            return model;
        }

        this.setModel = function(m) {
            model = m;
            this.updateView();
        }
    };

    // The HomeUIController class extends the BaseUIController class.
    FilterView.prototype = Object.create( BaseView.prototype );

    FilterView.prototype.getDomElement = function() {
        return this.generateFilterView();
    }

    FilterView.prototype.generateFilterView = function() {
        var mapLayerOptions = document.createElement('div');
        mapLayerOptions.classList.add('map-layer-options');
        
        var layerOptions = this.getLayers();

        for(var i = 0; i < layerOptions.length; i++) {
            var optionContainer = document.createElement('div');
            optionContainer.classList.add('layer-option');
            optionContainer.classList.add(layerOptions[i].className);

            var icon = document.createElement('div');
            icon.classList.add('icon');

            optionContainer.appendChild(icon);

            var span = document.createElement('span');
            span.appendChild(document.createTextNode(layerOptions[i].title));

            optionContainer.appendChild(span);
            optionContainer.addEventListener('click', layerOptions[i].cb, false);

            mapLayerOptions.appendChild(optionContainer);
        }

        var roomButton = document.createElement('a');
        roomButton.classList.add('room-selection');
        roomButton.appendChild(document.createTextNode('Find Room'));

        var container = document.createElement('div');
        container.classList.add('filters-container');

        container.appendChild(mapLayerOptions);
        container.appendChild(roomButton);

        container.style['display'] = this.isFilterDisplayed() ? 'block' : 'none';

        this.setLayersContainer(container);

        return container;
    }

    FilterView.prototype.getLayers = function() {
        return [
            {
                className: 'toilets',
                title: 'Toilets',
                type: 'toilet',
                cb: this.getFilterOptionSwitch('toilet')
            },{
                className: 'power',
                title: 'Power',
                type: 'power',
                cb: this.getFilterOptionSwitch('power')
            },{
                className: 'food',
                title: 'Food',
                type: 'food',
                cb: this.getFilterOptionSwitch('food')
            },{
                className: 'info',
                title: 'Info',
                type: 'info',
                cb: this.getFilterOptionSwitch('info')
            },{
                className: 'room',
                title: 'Rooms',
                type: 'room',
                cb: this.getFilterOptionSwitch('room')
            }
        ];
    }

    FilterView.prototype.getFilterOptionSwitch = function(type) {
        return function() {
            var model = this.getModel();
            if(!model) {
                return;
            }

            var display = model.getShowFilter(type);
            model.setShowFilters(type, !display);
            this.updateView();
        }.bind(this);
    }

    FilterView.prototype.updateView = function() {
        var layersContainer = this.getLayersContainer();
        if(layersContainer) {
            layersContainer.style['display'] = this.isFilterDisplayed() ? 'block' : 'none';
        }

        var mapLayersContainer = layersContainer.querySelector('.map-layer-options');
        var layers = this.getLayers();
        for(var i = 0; i < layers.length; i++) {
            var className = layers[i].className;
            var layerElement = mapLayersContainer.querySelector('.'+className);
            if(!layerElement) {
                continue;
            }

            var model = this.getModel();
            var isDisabled = true;

            if(model && model.getShowFilter(layers[i].type)) {
                isDisabled = false;
            }

            if(isDisabled) {
                layerElement.classList.add('disabled');
            } else {
                layerElement.classList.remove('disabled');
            }
        }
    }

    return FilterView;
});