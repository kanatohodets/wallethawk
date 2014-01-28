/**
 * File: lib/Util.js
 * Synopsis: misc utilities, like millimoney conversion.
 *
 */
"use strict";

var Util = function () {
    var self = {};

    // Avoid storing money in floating point, ensure that any rounding errors
    // that pop up are limited to (hopefully) trivial amounts. These are
    // converted back to normal-looking amounts on the client side.
    self.millimoneys = function (amount) {
        var millimoneys = amount * 1000;
        return Math.round(millimoneys);
    };

    self.convertTimeFromClient = function (data) {
      console.log(data);
      for (var key in data) {
        console.log("maybe converting ", key);
        if (key.match('/date/i')) {
          data[key] = data[key] / 1000
        }
      }
      return data;
    };

    return self;
};

module.exports = new Util();
