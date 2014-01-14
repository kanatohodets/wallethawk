/*
 * File: lib/user.js
 * Synopsis: user model
 *
 */
"use strict";

var db = require("./DatabaseConnection");

var Users = function () {
    var self = {};

    self.create = function (email) {
        var id = redis.incr("user:max_id", function (err, reply) {
            if (err) {
                next(err);
            }
            self.id = id;
        });

    };

    self.getName = function () {

    };
};

module.exports = User;
