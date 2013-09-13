/*global define */
define([], function () {
    'use strict';

    /**
        Only want to set this up once for anywhere we want
        to use request animation frame
    **/
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    /**
        
        This is the entry point to our application it
        handles the navigation as well as UI changes

    **/

    var STATE_HOME = 0;
    var STATE_SCHEDULE = 1;
    var STATE_MAP = 2;
    var STATE_SESSION = 3;

    var currentState;
    var changingState = false;

    var currentViewController = null;

    function changeCoreController(state, uiController) {
        var domElement = uiController.getView();

        if(currentViewController) {
            currentViewController.onRemovePage();
            currentViewController = null;
        }

        var currentPage = document.querySelector('.current-page');
        if(currentPage) {
            document.body.removeChild(currentPage);
        }

        domElement.classList.add('current-page');

        var firstChild = document.body.firstChild;
        if(firstChild) {
            document.body.insertBefore(domElement, firstChild);
        } else {
            document.body.appendChild(domElement);
        }

        uiController.addedToDom();

        if(window.history) {
            history.pushState({
                appState: state,
                controllerData: uiController.getState()
            }, "", uiController.getPageURL());
        }

        currentViewController = uiController;
    }

    function changeState(newState, data) {
        if(changingState || currentState == newState) {
            // States are the same, nothing to do
            return;
        }

        changingState = true;

        var nextUIController = null;

        // NOTE: Need full js files to avoid minification by grunt
        // and preventing this from working. The tool looks for full
        // file names in require call
        switch(newState) {
            case STATE_HOME:
                require(['controllers/home-ui-controller'], function(UiController) {
                    changeCoreController(newState, new UiController());

                    currentState = newState;
                    changingState = false;
                });
                break;
            case STATE_SCHEDULE:
                require(['controllers/schedule-ui-controller'], function(UiController) {
                    changeCoreController(newState, new UiController());

                    currentState = newState;
                    changingState = false;
                });
                break;
            case STATE_MAP:
                require(['controllers/map-ui-controller'], function(UiController) {
                    changeCoreController(newState, new UiController(data));

                    currentState = newState;
                    changingState = false;
                });
                break;
            case STATE_SESSION:
                require(['controllers/session-ui-controller'], function(UiController) {
                    changeCoreController(newState, new UiController(data));

                    currentState = newState;
                    changingState = false;
                });   
                break;
        }

        if(nextUIController !== null) {
                    }
    }

    function registerEventListeners() {
        var events = [
            {
                eventName: 'ShowSchedule',
                callback: function() {changeState(STATE_SCHEDULE);}
            },{
                eventName: 'Home',
                callback: function() {changeState(STATE_HOME);}
            },{
                eventName: 'ShowMap',
                callback: function() {changeState(STATE_MAP);}
            },{
                eventName: 'ShowSession',
                callback: function(e) {
                    changeState(STATE_SESSION, e.detail.id);
                }
            }, {
                eventName: 'popstate',
                callback: function(event) {
                    if(!event.state) {
                        return;
                    }
                    changeState(event.state.appState, event.state.controllerData);
                }
            }
        ];

        for(var i = 0; i < events.length; i++) {
            window.addEventListener(events[i].eventName, events[i].callback, false);
        }
    }

    function init() {
        // Find the URL we need to load
        changeState(STATE_HOME);
        registerEventListeners();
    }

    init();
});