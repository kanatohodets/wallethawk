define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');
  var Chart = require('views/charts/BilevelPartition');
  var _ = require('underscore');

  module.exports = Backbone.View.extend({
    el: $('#app'),

    /**
     * Create a hierarchical representation of the ledger.
     *
     * This needs to look like this:
     * {
     *  "name": "income",
     *  "children": [
     *    {
     *      "name": "groceries",
     *      "children": [
     *        {"name": "an apple", size: 20}
     *      ]
     *    }
     *  ]
     * }
     */
    formatLedgerForChart: function () {
      var classify = {income: {}, expenses: {}};

      var addItem = function (type, lineItem) {
        var category = lineItem.get("category"),
            amount = lineItem.get("amount"),
            description = lineItem.get("description");

        var categoryMembers = type[category];
        if (!categoryMembers) {
          categoryMembers = type[category] = {name: category, children: []};
        }
        categoryMembers.children.push({name: description, size: amount});
      };

      this.collection.each(function (lineItem) {
        var isIncome = lineItem.get("isIncome");
        if (isIncome) {
          addItem(classify.income, lineItem);
        } else {
          addItem(classify.expenses, lineItem);
        }
      });

      var result = {name: "money", children: []};
      for (var key in classify) {
        result.children.push({name: key, children: _.values(classify[key])});
      }
      return result;
    },
    render: function () {
      this.$el.html('');
      var chart = new Chart(this.el);
      var data = {
        "name": "money",
        "children": [
        {
         "name": "income",
         "children": [
          {
           "name": "paychecks",
           "children": [
            {"name": "PAYDAY", "size": 3938},
            {"name": "won hte lottery", "size": 743}
           ]
          }]
        },
        {
          "name": "expenses",
          "children": [
          {
            "name": "groceries",
            "children": [
              {"name": "some applies", "size": 40},
              {"name": "carrots", "size": 30},
              {"name": "tea", "size": 3},
              {"name": "pie", "size": 8},
            ]
          },
          {
            "name": "rent",
            "children": [
              {"name": "january", "size": 400},
              {"name": "december", "size": 400},
            ]
          }]
        }]
      };
      chart.render(this.formatLedgerForChart());
    }
  });

});
