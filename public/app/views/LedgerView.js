define(function (require, exports, module) {

  var Backbone = require('backbone');
  var Backgrid = require('backgrid');
  var moment = require('moment');

  var LedgerColumns = require('views/grid/LedgerColumns');

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
        ['Restaurants', 'restaurants'],
        ['Entertainment', 'entertainment'],
        ['Rent', 'rent'],
        ['Utilities', 'utilities'],
        ['Home', 'home'],
        ['Tech', 'tech'],
        ['Clothing', 'clothing'],
        ['Work Expenses', 'work_expenses']
      ];

      self.options.grid = new Backgrid.Grid({
        emptyText: "No data yet!",
        columns: new LedgerColumns(this.options.categories),
        collection: self.collection
      });
    },

    addLineItemTemplate: require("tpl!templates/AddLineItemTemplate.ejs"),

    events: {
      "click #expense": "addExpense",
      "click #income": "addIncome",
      "keydown": function (event) {
        // enter key, fake form submit. Unfortunately using a normal form
        // submit here doesn't allow auto-detection for what kind of line item
        // it is (expense/income).
        var code = event.keyCode || event.which;
        if (code == 13) {
          var isIncome = this.$('#income').hasClass('btn-primary');
          this.addLineItem(event, isIncome);
        }
      },

      "change select": "updateButtons"
    },

    /**
     * Change the highlighted submit button (income/expense) based on the
     * category selected.
     */
    updateButtons: function (event) {
      var newCategory = this.$('#category').val();
      var $income = this.$('#income');
      var $expense = this.$('#expense');
      if (newCategory == 'paychecks') {
        $expense.removeClass('btn-primary').addClass('btn-default');
        $income.removeClass('btn-default').addClass('btn-primary').focus();
      } else {
        $expense.removeClass('btn-default').addClass('btn-primary').focus();
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
      // Don't let errors pile up from previous submissions.
      this.dismissErrors();
      var data = this.getNewLineItem();
      if (!data) {
        return false;
      }
      data.isIncome = +isIncome;
      this.collection.add(data);
      this.resetForm();
    },

    /**
     * Cheapo error "flash"
     */
    showError: function (message) {
      var self = this;
      var $el = $('<div class="alert alert-warning">' + message + '</div>');
      $el.hide();
      self.$el.prepend($el);
      $el.slideDown();
      setTimeout(function () {
        $el.slideUp(function () {
          $el.remove();
        });
      }, 3000);
    },

    dismissErrors: function () {
      this.$('.alert').remove();
    },

    /**
     * Validate and extract the form data to create a new line item.
     */
    getNewLineItem: function () {
      var data = {
        amount: parseFloat(this.$('#amount').val()),
        dateCreated: moment(this.$('#date').val()),
        description: this.$('#description').val(),
        category: this.$('#category').val()
      };

      var valid = true;
      if (isNaN(data.amount) || data.amount <= 0) {
        valid = false;
        this.showError('Check the amount! gibberish or <= 0 are no good');
      }

      var sanityYear = moment().subtract('years', 50);
      if (!data.dateCreated.isValid() || data.dateCreated < sanityYear) {
        valid = false;
        this.showError('That date is incomprehensible, or more than 50 years ago.');
      }

      if (data.description == '') {
        valid = false;
        this.showError('Enter a description!');
      }

      if (valid) {
        data.dateCreated = data.dateCreated.add('hours', 12);
        data.dateCreated = "" + data.dateCreated.unix();
        return data;
      }

      return false;
    },

    resetForm: function () {
      this.$('#amount').val('');
      this.$('#date').val('');
      this.$('#description').val('');
      this.$('#category').val('');
    },

    render: function () {
      var self = this;
      self.$el.html(self.addLineItemTemplate({
        today: moment().format('YYYY-MM-DD'),
        exampleDescription: "Some apples",
        categories: self.options.categories
      }));

      // rows re-render on change events, so trigger dateModified changes in
      // order to force updates on moment's fromNow text.
      if (!self.interval) {
        self.interval = setInterval(function () {
          self.collection.each(function (model) {
            model.trigger('change:dateModified');
          });
        }, 1000);
      }

      self.$el.append(self.options.grid.render().el);
    }
  });
});
