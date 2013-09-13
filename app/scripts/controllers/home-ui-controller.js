/*global define */
define(['controllers/base-ui-controller', 'views/home-view'], function (BaseUIController, HomeView) {
    'use strict';

    function HomeUIController() {
        BaseUIController.call(this);

        var homeView = new HomeView();

        this.getHomeView = function () {
            return homeView;
        }
    }

    // The HomeUIController class extends the BaseUIController class.
    HomeUIController.prototype = Object.create( BaseUIController.prototype );

    HomeUIController.prototype.getView = function() {
        return this.getHomeView().getDomElement();
    }

    HomeUIController.prototype.getPageURL = function() {
        return "/";
    }

    return HomeUIController;
});