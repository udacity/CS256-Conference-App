/*

email
url
tel
number (of times they have attended)
date
color
profile pic → For now this is just a placeholder; Chris will add the steps on how to get a camera pic in Device Access chapter (Upload your picture here)
*/


/*global define */
define(['controllers/base-ui-controller', 'views/profile-view', 'models/profile-model'], function (BaseUIController, ProfileView, ProfileModel) {
    'use strict';

    function ProfileUIController() {
        BaseUIController.call(this);

        var profileView = new ProfileView();
        var profileModel = new ProfileModel();

        profileView.setModel(profileModel);

        this.getProfileView = function () {
            return profileView;
        }

        this.getProfileModel = function() {
            return profileModel;
        }

        this.init();
    }

    // The HomeUIController class extends the BaseUIController class.
    ProfileUIController.prototype = Object.create( BaseUIController.prototype );

    ProfileUIController.prototype.getView = function() {
        var header = this.generateTopBar('My Profile', []);

        var wrapper = this.getProfileView().getDomElement();
        var pageContainer = this.generatePageContainer('profile-ui', [header, wrapper]);

        return pageContainer;
    }

    ProfileUIController.prototype.init = function() {
        this.getProfileView().updateViews();
    }

    ProfileUIController.prototype.onDataLoaded = function() {
        this.getProfileView().setModel(this.getProfileModel());
    }

    ProfileUIController.prototype.onCameraClick = function(foo) {
    }

    ProfileUIController.prototype.getPageURL = function() {
        return "/profile";
    }

    return ProfileUIController;
});