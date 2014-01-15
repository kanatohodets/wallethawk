/**
 * File: lib/Users.js
 * Synopsis: CRUD for users
 *
 */
"use strict";

var db = require("./DatabaseConnection");

var Users = function () {
    var self = {};

    self.create = function (email, callback) {
      self.getByEmail(email, function (existingUsers) {
        if (existingUsers.length === 0) {
          var sql = "" +
            "INSERT INTO user " +
              "(email)" +
              "VALUES ($email)";
          var params = {
            $email: email
          };
          db.run(sql, params, function (result) {
            callback(result.lastID);
          });
        } else {
          // just grab the first match.
          callback(existingUsers[0].userID);
        }

      });
    };

    self.getByEmail = function(email, callback) {
      var sql = "SELECT user_id as userID, email as email from user WHERE email = $email";
      var params = {
        $email: email
      };
      db.fetch(sql, params, function (err, rows) {
        callback(result.lastID);
      });
    };
};

module.exports = User;
