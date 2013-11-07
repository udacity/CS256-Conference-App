/*global define */
define(['config'], function (config) {
    'use strict';

    function ProfileModel() {
        var firstName = localStorage["firstname"];
        var lastName = localStorage["lastname"];
        var email = localStorage["email"];
        var homepage = localStorage["homepage"];
        var telephone = localStorage["telephone"];
        var followers = localStorage["followers"];
        var birthday = localStorage["birthday"];
        var tShirtColor = localStorage["tshirtcolor"];
        var picture = localStorage["picture"];

        this.getFirstName = function() {
            return firstName;
        }

        this.setFirstName = function(name) {
            firstName = name;
            localStorage["firstname"]=name;
        }

        this.getLastName = function() {
            return lastName;
        }

        this.setLastName = function(name) {
            lastName = name;
            localStorage["lastname"]=name;
        }

        this.getEmail = function() {
            return email;
        }

        this.setEmail = function(em) {
            email = em;
            localStorage["email"]=em;
        }

        this.getHomepage = function() {
            return homepage;
        }

        this.setHomepage = function(url) {
            homepage = url;
            localStorage["homepage"]=url;
        }

        this.getTelephone = function() {
            return telephone;
        }

        this.setTelephone = function(t) {
            telephone = t;
            localStorage["telephone"]=t;
        }

        this.getFollowers = function() {
            return followers;
        }

        this.setFollowers = function(number) {
            followers = number;
            localStorage["followers"]=number;
        }

        this.getBirthday = function() {
            return birthday;
        }

        this.setBirthday = function(date) {
            birthday = date;
            localStorage["birthday"]=date;
        }

        this.getTShirtColor = function() {
            return tShirtColor;
        }

        this.setTShirtColor = function(color) {
            tShirtColor = color;
            localStorage["tshirtcolor"]=color;
        }

        this.getPicture = function() {
            return picture;
        }

        this.setPicture = function(url) {
            picture = url;
            localStorage["picture"]=url;
        }

    };

    return ProfileModel;
});