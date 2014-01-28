/**
 * File: lib/LineItem.js
 * Synopsis: CRUD for Line Items.
 *
 */
"use strict";

var db = require("./DatabaseConnection");
var Util = require('./util.js');

/**
 * Short-hand for the line item select block.
 *
 * @return string - a chunk of sql
 */
var getSQL = function () {
  var sql = "" +
    "SELECT "+
      "line_item.id as id," +
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
      } else {

        var params = {
          $userID: lineItem.userID,
          $description: lineItem.description,
          $categoryID: categoryID,
          $amount: Util.millimoneys(lineItem.amount),
          $isIncome: lineItem.isIncome
        };
        db.run(sql, params, function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result.lastID);
          }
        });
      }
    };

    /**
     * Grab a line item.
     *
     * @param lineItem Object {userID: 4, id: 3}
     * @callback lineItem|null
     */
    self.get = function (lineItem, callback) {
      var sql = "" +
        getSQL() +
        "WHERE id = $id AND user_id = $userID";
      var params = {
        $userID: lineItem.userID,
        $id: lineItem.id
      };

      db.fetch(sql, params, function (err, rows) {
        if (err) {
          callback(err);
        } else {
          callback(null, rows[0]);
        }
      });
    };

    self.update = function (lineItem, callback) {
      lineItem = Util.convertTimeFromClient(lineItem);
      var sql = "" +
        "UPDATE line_item SET " +
          "description = $description, " +
          "category_id = $categoryID, " +
          "amount = $amount, " +
          "date_created = $dateCreated, " +
          "date_modified = strftime('%s', 'now'), " +
          "is_income = $isIncome " +
        "WHERE id = $id AND user_id = $userID";
      var params = {
        $description: lineItem.description,
        $dateCreated: lineItem.dateCreated,
        $categoryID: categories.getCategoryID(lineItem.category),
        $amount: Util.millimoneys(lineItem.amount),
        $isIncome: lineItem.isIncome,
        $id: lineItem.id,
        $userID: lineItem.userID
      };

      db.run(sql, params, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result.changed);
        }
      });
    };

    self.delete = function (userID, lineItemID, callback) {
      var sql = "" +
        "DELETE FROM line_item WHERE id = $id AND user_id = $userID";
      var params = {
        $id: lineItemID,
        $userID: userID
      };

      db.run(sql, params, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result.changed);
        }
      });
    };

    return self;
};

LineItem.getSQL = getSQL;
module.exports = LineItem;
