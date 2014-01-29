define(function (require, exports, module) {

  var Backbone = require('backbone');
  var Backgrid = require('backgrid');
  var moment = require('moment');

  module.exports = Backbone.View.extend({
    el: $('#app'),
    initialize: function () {
      var self = this;
      if (!self.collection) {
        throw new Error('ledger view needs a collection');
      }

      this.options.categories = [
        ['Groceries', 'groceries'],
        ['Paychecks', 'paychecks'],
        ['Restraurants', 'restaurants'],
        ['Entertainment', 'entertainment'],
        ['Rent', 'rent'],
        ['Utilities', 'utilities'],
        ['Work Expenses', 'work']
      ];

      var columns = [
        { name: "amount", label: "amount", cell: "number"},
        { name: "description", label: "Description", cell: "string" },
        { name: "dateCreated", label: "Date", cell: "date"},
        { name: "category", label: "Category",
          cell: Backgrid.SelectCell.extend({ optionValues: this.options.categories
        })}
      ];
      this.options.grid = new Backgrid.Grid({
        columns: columns,
        collection: self.collection
      });

      // Better to splice in/out specific elements to save painting time, but
      // ... the lazy.
      self.listenTo(self.collection, 'add', function () {
        self.render();
      });
      self.listenTo(self.collection, 'remove', function () {
        self.render();
      });
    },

    addLineItemTemplate: require("tpl!templates/AddLineItemTemplate.ejs"),

    events: {
      "click #expense": "addExpense",
      "click #income": "addIncome",
      "submit form": "addLineItem",
      "change select": "updateButtons"
    },

    updateButtons: function (event) {
      console.log(event);
      var newCategory = this.$('#category').val();
      var $income = this.$('#income');
      var $expense = this.$('#expense');
      if (newCategory == 'paychecks') {
        $expense.removeClass('btn-primary').addClass('btn-default');
        $income.removeClass('btn-default').addClass('btn-primary');
      } else {
        $expense.removeClass('btn-default').addClass('btn-primary');
        $income.removeClass('btn-primary').addClass('btn-default');
      }
    },


    addExpense: function (event) {
      this.addLineItem(event, false);
    },

    addIncome: function (event) {
      this.addLineItem(event, true);
    },

    addLineItem: function (event, isIncome) {
      event.preventDefault();
      if (isIncome === undefined) {
        isIncome = this.$('#income').hasClass('btn-primary');
      }
      // let moment parse whatever got entered, then
      // convert it to js time.
      var date = moment(this.$('#date').val()).toDate().getTime();
      this.collection.add({
        amount: +this.$('#amount').val(),
        dateCreated: date,
        description: this.$('#description').val(),
        category: this.$('#category').val(),
        isIncome: isIncome
      });
      console.log(this.collection);
    },

    error: function () {

    },

    render: function () {
      var self = this;
      self.$el.html(self.addLineItemTemplate({exampleDescription: "Some apples", categories: this.options.categories}));
      if (self.collection.length > 0) {
        self.$el.append(self.options.grid.render().el);
      } else {
        self.$el.append("<div>No data, enter some to get started!</div>");
      }
    }
  });

});
