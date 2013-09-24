/*global define */
define(['controllers/base-ui-controller', 'views/home-menu-view', 'views/home-info-view', 'views/home-wifi-view'], function (BaseUIController, MenuView, InfoView, WifiView) {
    'use strict';

    function HomeUIController() {
        BaseUIController.call(this);

        var menuView = new MenuView();
        var infoView = new InfoView();
        var wifiView = new WifiView();

        menuView.setOnButtonClickListener(this.onButtonClickListener.bind(this));

        this.getMenuView = function () {
            return menuView;
        }

        this.getInfoView = function() {
            return infoView;
        }

        this.getWifiView = function() {
            return wifiView;
        }
    }

    // The HomeUIController class extends the BaseUIController class.
    HomeUIController.prototype = Object.create( BaseUIController.prototype );

    HomeUIController.prototype.getView = function() {
        var header = this.generateTopBar('Home', []);

        var infoPane = this.getInfoView().getDomElement();
        var menuView = this.getMenuView().getDomElement();
        var wifiView = this.getWifiView().getDomElement();

        var pageContainer = this.generatePageContainer('home-ui', [header, infoPane, menuView, wifiView]);
        return pageContainer;
    }

    HomeUIController.prototype.getPageURL = function() {
        return "/";
    }

    HomeUIController.prototype.onButtonClickListener = function(actionName) {
        this.eventDispatchFunction(actionName, window)();
    }

    return HomeUIController;
});