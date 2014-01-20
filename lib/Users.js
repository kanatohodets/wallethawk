/**
 * File: lib/Users.js
 * Synopsis: CRUD for users
 *
 */
"use strict";

var db = require("./DatabaseConnection");
var uuid = require("uuid");

var Users = function (lineItem) {
    var self = {};

    var getByCredentials = function (creds, callback) {
      var sql = "SELECT user_id as userID from user WHERE email = $email OR api_key = $apiKey";
      var params = {
        $email: creds.email,
        $apiKey: creds.apiKey
      };
      db.fetch(sql, params, function (err, rows) {
        callback(rows[0]);
      });
    };

    self.get = function (creds, callback) {
      getByCredentials(creds, function (existingUser) {
        if (!existingUser) {
          callback(null);
        } else {
          callback(existingUser.userID);
        }
      });
    };

    self.getLedger = function (userID, callback) {
      if (!userID) {
        callback([]);
      } else {
        var sql = "" +
          lineItem.getSQL() +
          "JOIN category "  +
          "ON line_item.category_id = category.category_id " +
          "WHERE user_id = $userID";

        var params = { $userID: userID };
        db.fetch(sql, params, function (rows) {
          callback(rows);
        });
      }
    };

    self.create = function (email, callback) {
      var sql = "" +
        "INSERT INTO user " +
          "(email, api_key)" +
          "VALUES ($email, $apiKey)";
      var params = {
        $email: email,
        $apiKey: uuid.v4()
      };

      db.run(sql, params, function (result) {
        callback(result.lastID);
      });
    };

    return self;
};

module.exports = Users;
