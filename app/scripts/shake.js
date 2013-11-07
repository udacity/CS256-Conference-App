/*
 * To detect the shaking of device
 * Events - 
 *        shakingStarted
 *        shakingStopped
 * Author: Vikash Agrawal <vikashagrawal1990@gmail.com> / @iam_vikash
 */
define([], function () {
  'use strict';

  var shake;

  if (typeof window.DeviceMotionEvent === 'function') {
    window.isMotionSupported = true;
  } else {
    if (typeof console !== "undefined" && console !== null) {
      console.log('Device motion is not supported yet.');
    }
  }

  if (typeof window.DeviceOrientationEvent === 'function') {
    window.isOrientationSupported = true;
  } else {
    if (typeof console !== "undefined" && console !== null) {
      console.log('Device orientation is not supported yet.');
    }
  }

  if (window.isMotionSupported) {
    shake = {
      events: {},
      starting: false,
      stopping: false,
      shaking: false,
      sensitivity: 5,
      currentCoordinates: null,
      init: function() {
        if (typeof document.CustomEvent === "function") {
          this.events['start'] = new document.CustomEvent("shakingStarted", {
            bubbles: true,
            cancelable: true
          });
        } else if (typeof document.createEvent === "function") {
          this.events['start'] = document.createEvent("Event");
          this.events['start'].initEvent("shakingStarted", true, true);
        } else {
          false;
        }
        if (typeof document.CustomEvent === "function") {
          this.events['stop'] = new document.CustomEvent("shakingStopped", {
            bubbles: true,
            cancelable: true
          });
        } else if (typeof document.createEvent === "function") {
          this.events['stop'] = document.createEvent("Event");
          this.events['stop'].initEvent("shakingStopped", true, true);
        } else {
          false;
        }
        return this.listen();
      },

      start: function() {
        this.shaking = true;
        return window.dispatchEvent(this.events["start"]);
      },

      stop: function() {
        this.shaking = false;
        this.lastStop = new Date().getTime();
        return window.dispatchEvent(this.events["stop"]);
      },

      listen: function() {
        var self;
        self = this;
        return window.addEventListener("devicemotion", (function(e) {
          var change, newCoordinatesX, newCoordinatesY, newCoordinatesZ;
          change = 0;
          newCoordinatesX = e.accelerationIncludingGravity.x;
          newCoordinatesY = e.accelerationIncludingGravity.y;
          newCoordinatesZ = e.accelerationIncludingGravity.z;
          if (self.currentCoordinates != null) {
            change = Math.abs(self.currentCoordinates.x - newCoordinatesX + self.currentCoordinates.y - newCoordinatesY + self.currentCoordinates.z - newCoordinatesZ);
          } else {
            self.currentCoordinates = {};
          }
          self.currentCoordinates.x = newCoordinatesX;
          self.currentCoordinates.y = newCoordinatesY;
          self.currentCoordinates.z = newCoordinatesZ;
          if (change >= self.sensitivity) {
            if (!self.shaking) {
              if (self.starting) {
                self.start();
                return self.starting = false;
              } else {
                return self.starting = true;
              }
            }
          } else {
            if (self.shaking) {
              if (self.stopping) {
                self.stop();
                return self.stopping = false;
              } else {
                return self.stopping = true;
              }
            }
          }
        }), false);
      }
    };

    return shake.init();
  }
});
