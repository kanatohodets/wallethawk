/**
 * File: lib/ErrorHandler.js
 * Synopsis: deal with errors: die or warn.
 *
 * In the Future(tm), this'll do something more robust.
 *
 */
"use strict";

var ErrorHandler = function () {
  var self = {};

  self.die = function (res, err) {
    res.send(500);
    throw err;
  };

  self.warn = function (res, err) {
    res.send(500);
    console.log(err);
  };

  return self;
};


module.exports = new ErrorHandler();
