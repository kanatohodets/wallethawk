define(function (require, exports, module) {

  var Backbone = require('backbone');
  var Backgrid = require('backgrid');
  var MomentCell = require('MomentCell');
  var moment = require('moment');

  var DeleteCell = require('views/grid/DeleteCell');

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
        ['Work Expenses', 'work_expenses']
      ];

      var columns = [
        { name: "delete", label: "", cell: DeleteCell},
        { name: "isIncome", label: "Change",
          cell: Backgrid.SelectCell.extend({ optionValues: [['+', '+'], ['-', '-']]}),
          formatter: {
            fromRaw: function (data, model) {
              if (!!data) {
                return '+';
              } else {
                return '-';
              }
            },
            toRaw: function (formattedData, model) {
              if (formattedData == '+') {
                return 1;
              }
              return 0;
            }
          }
        },
        { name: "amount", label: "Amount", cell: "number"},
        { name: "description", label: "Description", cell: "string" },
        { name: "dateCreated", label: "Date",
          cell: Backgrid.Extension.MomentCell.extend({
            modelFormat: "X",
            displayFormat: "MMM-DD-YYYY"})
        },
        { name: "dateModified", label: "Updated", editable: false,
          cell: Backgrid.Extension.MomentCell.extend({
            formatter: {
              fromRaw: function (data, model) {
                data = +data;
                return moment.unix(data).fromNow();
              },
              // not editable, no-op
              toRaw: function (formattedData, model) { }
            }
          })
        },

        { name: "category", label: "Category",
          cell: Backgrid.SelectCell.extend({ optionValues: this.options.categories})
        }
      ];

      self.options.grid = new Backgrid.Grid({
        emptyText: "No data yet!",
        columns: columns,
        collection: self.collection
      });
    },

    addLineItemTemplate: require("tpl!templates/AddLineItemTemplate.ejs"),

    events: {
      "click #expense": "addExpense",
      "click #income": "addIncome",
      "keydown": function (event) {
        // enter key
        var code = event.keyCode || event.which;
        if (code == 13) {
          var isIncome = this.$('#income').hasClass('btn-primary');
          this.addLineItem(event, isIncome);
        }
      },

      "change select": "updateButtons"
    },

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
      this.dismissErrors();
      var data = this.getNewLineItem();
      if (!data) {
        return false;
      }
      data.isIncome = +isIncome;
      this.collection.add(data);
    },

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

    getNewLineItem: function () {
      var data = {
        amount: +this.$('#amount').val(),
        dateCreated: moment(this.$('#date').val()),
        description: this.$('#description').val(),
        category: this.$('#category').val(),
      }

      var valid = true;
      if (data.amount <= 0) {
        valid = false;
        this.showError('Check the amount! 0 or less is no good');
      }

      var sanityYear = moment().subtract('years', 50);
      if (!data.dateCreated.isValid() || data.dateCreated < sanityYear) {
        valid = false;
        this.showError('That date is incomprehensible, or more than 50 years ago.');
      }

      if (data.description == '') {
        valid = false;
        this.showError('empty description!');
      }

      if (valid) {
        data.dateCreated = "" + data.dateCreated.unix();
        return data;
      }

      return false;
    },


    render: function () {
      var self = this;
      self.$el.html(self.addLineItemTemplate({
        today: moment().format('YYYY-MM-DD'),
        exampleDescription: "Some apples",
        categories: self.options.categories
      }));

      self.$el.append(self.options.grid.render().el);
      // rows re-render on change events, so trigger dateModified changes in
      // order to force updates on moment's fromNow text.
      if (!self.interval) {
        self.interval = setInterval(function () {
          self.collection.each(function (model) {
            model.trigger('change:dateModified');
          });
        }, 1000);
      }
    }
  });

});
