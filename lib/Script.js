/**
 * File: lib/Script.js
 * Synopsis: command line script tools
 *
 *
 */
"use strict";

var fs = require('fs');
var db = require('./DatabaseConnection.js');
var async = require('async');
var _ = require('lodash');

var Script = function () {
  var self = {};
  var tasks = [];

  self.runFile = function (file) {
    var run = function (callback) {
      fs.readFile('./' + file, function (err, data) {
        if (err) {
          throw new Error(err);
        }
        var sql = data.toString();
        console.log(sql);
        db.exec(sql, function (err) {
          if (err) {
            throw new Error(err);
          }
          callback(null);
        });
      });
    };
    tasks.push(run);
  };

  self.doQuery = function (sql) {
    var run = function (callback) {
      console.log(sql);
      db.exec(sql, function (err) {
        if (err) { throw new Error(err); }
        callback(null);
      });
    };
    tasks.push(run);
  };

  self.execute = function () {
    tasks.push(function () {
      console.log('all done!');
      process.exit();
    });
    async.series(tasks);
  };

  return self;
};

module.exports = Script;
