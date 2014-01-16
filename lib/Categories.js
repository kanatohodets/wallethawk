/**
 * File: lib/Categories.js
 * Synopsis: model for line item category
 *
 */
"use strict";

var db = require("./DatabaseConnection");

var Categories = {};

Categories.load = function (callback) {
  var self = {};

  self.categoryIDs = {};

  self.getCategoryID = function (name) {
    if (self.categoryIDs[name]) {
      return self.categoryIDs[name];
    } else {
      return false;
    }
  };

  self.create = function (name, callback) {
    var sql = "" +
      "INSERT INTO category " +
        "(name)" +
        "VALUES ($name)";
    var params = {
      $name: name
    };
    db.run(sql, params, function (result) {
      callback(result.lastID);
    });
  };

  var init = function (callback) {
    var sql = "SELECT * FROM category";
    var params = {};
    db.fetch(sql, params, function (rows) {
      rows.forEach(function (row, i) {
        self.categoryIDs[row.name] = row.category_id;
      });
      callback();
    });
  };

  self.update = function (category, callback) {
    var sql = "" +
      "UPDATE category SET" +
        "name = $name," +
      "WHERE category_id = $categoryID";
    var params = {
      $name: category.name,
      $categoryID: category.id
    };

    db.run(sql, params, function (result) {
      callback(result.changes);
    });
  };

  self.delete = function (category, callback) {
    var sql = "" +
      "DELETE FROM category" +
      "WHERE category_id = $categoryID";
    var params = {
      $categoryID: category.id
    };
    db.run(sql, params, function (err, result) {
      callback(result.changes);
    });
  };

  // Ideally lib constructor interfaces would be synchronous, but needing
  // to initialize values from the DB makes that tricky, here.
  init(function () { callback(self) });
};

module.exports = Categories;
