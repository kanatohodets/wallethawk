/*
 * File: lib/lineItem.js
 * Synopsis: line item model
 *
 */
"use strict";

var db = require("./DatabaseConnection");
var util = require('./util.js');

var LineItem = function (user) {
    var self = {};
    var categories = getCategories();

    self.fetchAll = function (sort, callback) {
      var sql = "SELECT * FROM line_item WHERE user_id = $userID ORDER BY date_created DESC";
      var params = { $userID: user.id };
      db.fetch(function (err, rows) {
        callback(null, container);
      });
    };

    self.delete = function (callback) {

    };

    self.create = function (callback) {
      var sql = "INSERT INTO line_item (

    };

    return self;
};

module.exports = LineItem;
