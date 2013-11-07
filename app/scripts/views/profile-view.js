/*global define */
define(['views/base-view'], function (BaseView) {
    'use strict';

    function ProfileView() {
        BaseView.call(this);

        var model;
        var profileElement = null;

        this.getModel = function() {
            return model;
        }

        this.setModel = function(m) {
            model = m;

            this.updateViews();
        }

        this.setProfileElement = function(element) {
            profileElement = element;
        }

        this.getProfileElement = function() {
            return profileElement;
        }
    };

    ProfileView.prototype = Object.create( BaseView.prototype );

    ProfileView.prototype.getDomElement = function() {
        var profileSection = this.generateProfileSection();
        
        var model = this.getModel();
        if(model) {
            this.updateViews();
        }

        return profileSection;
    }

    function createLineItem(label, id, value) {
        var e = document.createElement('label');
        e.className = "profile-line-item";
        var l = document.createElement('span');
        l.className = "profile-label-text";
        l.appendChild(document.createTextNode(label + ": "));
        e.appendChild(l);
        var input = document.createElement("input");
        input.id = id;
        input.type = "text";
        input.value = value || "";
        input.className = "profile-input-field";
        e.appendChild(input);
        return e;
    }

    ProfileView.prototype.generateProfileSection = function() {
        var container = document.createElement('section');
        container.classList.add('profile-container');
        this.setProfileElement(container);

        container.appendChild( createLineItem( "First Name", "firstname", this.getModel().getFirstName()));
        container.appendChild( createLineItem( "Last Name", "lastname", this.getModel().getLastName()));
        container.appendChild( createLineItem( "Email", "email", this.getModel().getEmail()));
        container.appendChild( createLineItem( "Birthday", "birthday", this.getModel().getBirthday()));
        container.appendChild( createLineItem( "Homepage", "homepage", this.getModel().getHomepage()));
        container.appendChild( createLineItem( "Telephone", "telephone", this.getModel().getTelephone()));
        container.appendChild( createLineItem( "G+ followers", "followers", this.getModel().getFollowers()));
        container.appendChild( createLineItem( "T-shirt color", "tshirt", this.getModel().getTShirtColor()));
        container.appendChild( createLineItem( "Picture", "picture", this.getModel().getPicture()));

        var saveButton = document.createElement("button");
        saveButton.appendChild(document.createTextNode("save"));
        saveButton.onclick = this.updateModel.bind(this);
        container.appendChild(saveButton);

        return container;
    }

    ProfileView.prototype.updateModel = function() {
        var model = this.getModel();
        model.setFirstName(document.getElementById("firstname").value );
        model.setLastName(document.getElementById("lastname").value );
        model.setEmail(document.getElementById("email").value );
        model.setBirthday(document.getElementById("birthday").value );
        model.setHomepage(document.getElementById("homepage").value );
        model.setTelephone(document.getElementById("telephone").value );
        model.setFollowers(document.getElementById("followers").value );
        model.setTShirtColor(document.getElementById("tshirt").value );
        model.setPicture(document.getElementById("picture").value );
    }

    ProfileView.prototype.updateViews = function() {
        var model = this.getModel();
        var profileElement = this.getProfileElement();
        if(!model || !profileElement) {
            return;
        }

//        this.clearChildViews(profileElement);
//model.getTitle()

/*
        var date = this.generateDateElement();

        var room = document.createElement('h2');
        room.classList.add('session-room');
        room.appendChild(document.createTextNode(model.getRoomName()));

        

        var paragraph = document.createElement('p');
        paragraph.appendChild(document.createTextNode(model.getDescription()));

        sessionElement.appendChild(date);
        sessionElement.appendChild(room);
        sessionElement.appendChild(paragraph);
        */
//        profileElement.appendChild(title);
    }

/*
    ProfileView.prototype.generateDateElement = function() {
        var model = this.getModel();
        var date = document.createElement('h2');
        date.classList.add('session-date');

        var startTime = model.getStartTime();
        var startHours = startTime.getHours();
        var startMinutes = startTime.getMinutes();

        var endTime = model.getEndTime();
        var endHours = endTime.getHours();
        var endMinutes = endTime.getMinutes();

        var dateString = startTime.toDateString() + ' ';
        dateString += (startHours < 10) ? '0'+startHours : startHours;
        dateString += ':';
        dateString += (startMinutes < 10) ? '0'+startMinutes : startMinutes;
        dateString += ' - ';
        dateString += (endHours < 10) ? '0'+endHours : endHours;
        dateString += ':';
        dateString += (endMinutes < 10) ? '0'+endMinutes : endMinutes;

        date.appendChild(document.createTextNode(dateString));

        return date;
    }
*/
    return ProfileView;
});