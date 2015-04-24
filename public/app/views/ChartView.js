define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');
  var Chart = require('views/charts/Sunburst');
  var _ = require('underscore');

  module.exports = Backbone.View.extend({
    el: $('#app'),

    events: {
        "click #reset_chart"         : "rerenderChart"
    },

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
    formatLedgerForChart: function (earliestMoment, latestMoment) {

      var classify = {income: {}, expenses: {}};

      this.collection.each(function (lineItem) {
        var unixDateCreated = lineItem.get('dateCreated');
        var momentDateCreated = moment.unix(unixDateCreated).format('YYYY-MM-DD');

        if ((momentDateCreated < earliestMoment) || (latestMoment < momentDateCreated)) {
            return true;
        }
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

    rerenderChart: function () {
      var earliestMoment = this.$("#display_from").val();
      var latestMoment = this.$("#display_to").val();

      this.$('svg').remove();
      var chart = new Chart(this.el);
      chart.render(this.formatLedgerForChart(earliestMoment, latestMoment));
    },

    dateFilterTemplate: require("tpl!templates/DateFilterTemplate.ejs"),

    render: function () {
      if (this.collection.length > 0) {
        this.collection.sort();

        var earliestMoment = getDateFromNthLineItem(this.collection, this.collection.length - 1);
        var latestMoment = getDateFromNthLineItem(this.collection, 0);

        this.$el.html(this.dateFilterTemplate({
            earliestMoment: earliestMoment,
            latestMoment: latestMoment
        }));

        this.rerenderChart();
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

  function getDateFromNthLineItem (collection, index) {
      var nthLineItem = collection.at(index);
      var dateCreated = nthLineItem.get('dateCreated');
      return moment.unix(dateCreated).format('YYYY-MM-DD');
  }

});
