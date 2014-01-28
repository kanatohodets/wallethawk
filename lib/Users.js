/**
 * File: lib/Users.js
 * Synopsis: CRUD for users
 *
 */
"use strict";

var db = require("./DatabaseConnection");
var uuid = require("uuid");
var LineItem = require("./LineItem");

var Users = function () {
    var self = {};

    var getByCredentials = function (creds, callback) {
      console.log(creds);
      var sql = "SELECT id as id from user WHERE email = $email OR api_key = $apiKey";
      var params = {
        $email: creds.email || '',
        $apiKey: creds.apiKey || ''
      };
      db.fetch(sql, params, function (err, rows) {
        if (rows) {
          callback(null, rows[0]);
        } else {
          callback();
        }
      });
    };

    /**
     * Get a userID from an email or API key.
     *
     * @param creds Object {email: 'bob@bob.com', 'apiKey': 'blah'}
     * @callback userID|null
     */
    self.get = function (creds, callback) {
      getByCredentials(creds, function (err, existingUser) {
        if (err) {
          callback(err);
        } else {
          if (!existingUser) {
            if (creds.email) {
              self.create(creds.email, callback);
            } else {
              callback();
            }
          } else {
            callback(null, existingUser.id);
          }
        }
      });
    };

    /**
     * Get a user's Ledger (a bunch of line items).
     *
     * @param creds Object {email: 'bob@bob.com', 'userID': 4, 'apiKey': 'blah'}
     *  Any of the 3 are ok.
     * @callback [] of lineItems
     */
    self.getLedger = function (creds, callback) {
      var getLedger = function (userID) {
        if (userID) {
          var sql = "" +
            LineItem.getSQL() +
            "JOIN category "  +
            "ON line_item.category_id = category.id " +
            "WHERE user_id = $userID " +
            "ORDER BY date_created DESC";

          var params = { $userID: userID };
          db.fetch(sql, params, callback);
        } else {
          callback(null, []);
        }
      };

      // Minor hackery to allow getLedger to be called with either a userID or
      // an email/apiKey.
      if (creds && creds.userID) {
        getLedger(creds.userID);
      } else {
        getByCredentials(creds, function (err, user) {
          if (err) {
            callback(err);
          } else {
            if (user && user.id) {
              getLedger(user.id);
            } else {
              callback(null, []);
            }
          }
        });
      }
    };

    /**
     * Make a new user based on an email address.
     *
     * Note: there's a unique key constraint on user.email, so check for
     * an existing user before hitting this.
     *
     * @param email string 'bob@bob.com'
     * @callback userID|null
     */
    self.create = function (email, callback) {
      // In the future, do some validation of the email.
      if (email) {
        var sql = "" +
          "INSERT INTO user " +
            "(email, api_key)" +
            "VALUES ($email, $apiKey)";
        var params = {
          $email: email,
          $apiKey: uuid.v4()
        };

        db.run(sql, params, function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result.lastID);
          }
        });
      } else {
        callback();
      }
    };

    return self;
};

module.exports = Users;
