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
    db.run(sql, params, function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result.lastID);
      }
    });
  };

  var init = function (callback) {
    var sql = "SELECT * FROM category";
    var params = {};
    db.fetch(sql, params, function (err, rows) {
      if (!rows) {
        throw new Error('No categories found! They should be loaded with scripts/init_db');
      }
      rows.forEach(function (row, i) {
        self.categoryIDs[row.name] = row.id;
      });
      callback();
    });
  };

  self.update = function (category, callback) {
    var sql = "" +
      "UPDATE category SET" +
        "name = $name," +
      "WHERE id = $categoryID";
    var params = {
      $name: category.name,
      $categoryID: category.id
    };

    db.run(sql, params, function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result.changes);
      }
    });
  };

  self.delete = function (category, callback) {
    var sql = "" +
      "DELETE FROM category" +
      "WHERE id = $categoryID";
    var params = {
      $categoryID: category.id
    };
    db.run(sql, params, function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result.changes);
      }
    });
  };

  // Ideally lib constructor interfaces would be synchronous, but needing
  // to initialize values from the DB makes that tricky, here.
  init(function () { callback(self) });
};

module.exports = Categories;
