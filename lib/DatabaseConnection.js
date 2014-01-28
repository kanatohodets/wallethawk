/**
 * File: lib/DatabaseConnection.js
 * Synopsis: wrapper around sqlite3
 * (to avoid the connection boilerplate infecting
 * every model lib)
 *
 */
"use strict";

var sqlite3 = require("sqlite3").verbose();
var config = require("config");
var DatabaseConnection = function () {
  var self = {};
  var db = new sqlite3.Database(config.db.location + config.app.name + ".db");

  self.fetch = function (sql, params, callback) {
    db.all(sql, params, function (err, rows) {
      if (err) {
        callback(new Error(err));
      } else {
        callback(null, rows);
      }
    });
  };

  self.exec = function (sql, callback) {
    db.exec(sql, callback);
  };

  self.run = function (sql, params, callback) {
    db.run(sql, params, function (err) {
      if (err) {
        callback(new Error(err));
      } else {
        // sqlite3 API is a bit weird, here.
        // successful INSERTs have a lastID prop on the context to indicate last
        // insert ID.
        // successful DELETEs or UPDATEs tell you the number of changed rows
        if (sql.search("INSERT") !== -1) {
          callback(null, {lastID: this.lastID});
        } else if (sql.search("UPDATE|DELETE" !== -1)) {
          callback(null, {changes: this.changes});
        }
      }
    });
  };

  return self;
};

module.exports = new DatabaseConnection();
