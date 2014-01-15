/**
 * File: lib/DatabaseConnection.js
 * Synopsis: wrapper around sqlite3
 * (mostly to avoid the connection boilerplate infecting
 * every model lib)
 *
 */
"use strict";

var sqlite3 = require("sqlite3").verbose();
var dbConfig = require("config").db;
var DatabaseConnection = function () {
  var self = {};
  var db = new sqlite3.Database(dbConfig.location + dbConfig.name);


  self.fetch = function (sql, params, callback) {
    db.all(sql, params, function (err, rows) {
      if (err) {
        throw new Error(err);
      }
      callback(rows);
    });
  };

  self.exec = function (sql, callback) {
    db.exec(sql, callback);
  };

  self.run = function (sql, params, callback) {
    db.run(sql, params, function (err) {
      if (err) {
        //die/log, let recovery fall to process monitor restarting server
        throw new Error(err);
      }

      // sqlite3 API is a bit weird, here.
      // successful INSERTs have a lastID prop on the context to indicate last
      // insert ID.
      // successful DELETEs or UPDATEs tell you the number of changed rows
      if (sql.search("INSERT") !== -1) {
        callback({lastID: this.lastID});
      } else if (sql.search("UPDATE|DELETE" !== -1)) {
        callback({changes: this.changes});
      }
    });
  };

  return self;
};

module.exports = new DatabaseConnection();
