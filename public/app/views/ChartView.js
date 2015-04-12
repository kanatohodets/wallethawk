define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');
  var Chart = require('views/charts/Sunburst');
  var _ = require('underscore');

  module.exports = Backbone.View.extend({
    el: $('#app'),

    /**
     * Create a hierarchical representation of the ledger.
     *
     * The result looks like this:
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

      this.collection.each(function (lineItem) {
        var isIncome = lineItem.get("isIncome");
        if (isIncome) {
          addLineItemToHierarchicalLedger(classify.income, lineItem);
        } else {
          addLineItemToHierarchicalLedger(classify.expenses, lineItem);
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
      if (this.collection.length > 0) {
        var chart = new Chart(this.el);
        chart.render(this.formatLedgerForChart());
      } else {
        this.$el.html('No data yet!');
      }
    }
  });

  /**
   * Process a line item into the chart-representation of the ledger.
   *
   * @param type {} : object containing all of the 'income' or 'expenses'
   * items.
   * @param lineItem LineItem
   */
  function addLineItemToHierarchicalLedger (type, lineItem) {
    var category = lineItem.get("category"),
        amount = lineItem.get("amount"),
        description = lineItem.get("description");

    var categoryMembers = type[category];
    if (!categoryMembers) {
      categoryMembers = type[category] = {name: category, children: []};
    }
    categoryMembers.children.push({name: description, size: amount});
  }
});
