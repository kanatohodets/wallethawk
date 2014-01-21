/**
 * File: lib/LineItem.js
 * Synopsis: CRUD for Line Items.
 *
 */
"use strict";

var db = require("./DatabaseConnection");
var util = require('./util.js');

/**
 * Short-hand for the line item select block.
 *
 * @return string - a chunk of sql
 */
var getSQL = function () {
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
    "FROM line_item ";
  return sql;
};

var LineItem = function (categories) {
    var self = {};

    /**
     * Stick a new line item into the DB.
     *
     * @param lineItem Object
     * @callback lineItemID|null
     */
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

    /**
     * Grab a line item.
     *
     * @param lineItem Object {userID: 4, lineItemID: 3}
     * @callback lineItem|null
     */
    self.get = function (lineItem, callback) {
      var sql = "" +
        getSQL() +
        "WHERE line_item_id = $lineItemID AND user_id = $userID";
      var params = {
        $userID: lineItem.userID,
        $lineItemID: lineItem.lineItemID
      };

      db.fetch(sql, params, function (rows) {
        callback(rows[0]);
      });
    };

    self.update = function (lineItem, callback) {
      var sql = "" +
        "UPDATE line_item SET" +
          "description = $description, " +
          "category_id = $categoryID, " +
          "amount = $amount, " +
          "date_modified = strftime('%s', 'now'), " +
          "is_income = $isIncome" +
        "WHERE line_item_id = $lineItemID AND user_id = $userID";
      var params = {
        $description: lineItem.description,
        $categoryID: getCategoryIDs(lineItem.category),
        $amount: lineItem.amount,
        $isIncome: lineItem.isIncome,
        $lineItemID: lineItem.lineItemID,
        $userID: user.userID
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

LineItem.getSQL = getSQL;
module.exports = LineItem;
