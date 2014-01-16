/**
 * File: lib/LineItems.js
 * Synopsis: CRUD for Line Items.
 *
 */
"use strict";

var db = require("./DatabaseConnection");
var util = require('./util.js');

var LineItem = function (categories) {
    var self = {};

    self.create = function (lineItem, callback) {
      var sql = "" +
        "INSERT INTO line_item " +
          "(description, amount, category_id, is_income, user_id)" +
          "VALUES ($description, $amount, $categoryID, $isIncome, $userID)";

      var categoryID = categories.getCategoryID(lineItem.category);
      if (!categoryID) {
        callback(new Error('no such category: ' + lineItem.category));
        return;
      }

      var params = {
        $userID: lineItem.userID,
        $description: lineItem.description,
        $categoryID: categoryID,
        $amount: lineItem.amount,
        $isIncome: lineItem.isIncome
      };
      db.run(sql, params, function (result) {
        callback(null, result.lastID);
      });
    };

    self.fetchAll = function (details, callback) {
      if (!details.userID) {
        callback([]);
      } else {
        var sql = "" +
          "SELECT "+
            "line_item_id as lineItemID," +
            "user_id as userID, " +
            "date_created as dateCreated, " +
            "date_modified as dateModified, " +
            "description as description, " +
            "amount as amount, " +
            "is_income as isIncome, " +
            "category.name as category " +
          "FROM line_item " +
          "JOIN category "  +
          "ON line_item.category_id = category.category_id " +
          "WHERE user_id = $userID";

        var params = { $userID: details.userID };
        db.fetch(sql, params, function (rows) {
          callback(rows);
        });
      }
    };

    self.update = function (lineItem, callback) {
      var sql = "" +
        "UPDATE line_item SET" +
          "description = $description," +
          "category_id = $categoryID" +
          "amount = $amount," +
          "date_modified = datetime('now', 'unixepoch')" +
          "is_income = $isIncome" +
        "WHERE line_item_id = $lineItemID";
      var params = {
        $description: lineItem.description,
        $categoryID: getCategoryIDs(lineItem.category),
        $amount: lineItem.amount,
        $isIncome: lineItem.isIncome,
        $lineItemID: lineItem.id
      };

      db.run(sql, params, function (result) {
        callback(result.changes);
      });
    };

    self.delete = function (userID, lineItemID, callback) {
      var sql = "" +
        "DELETE FROM line_item WHERE line_item_id = $lineItemID AND user_id = $userID";
      var params = {
        $lineItemID: lineItemID,
        $userID: userID
      };

      db.run(sql, params, function (result) {
        callback(result.changes);
      });
    };

    return self;
};

module.exports = LineItem;
