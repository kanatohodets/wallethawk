define(function (require, exports, module) {

  var Backbone = require('backbone');
  var Backgrid = require('backgrid');

  module.exports = {
    name: "isIncome",
    label: "Change",
    cell: Backgrid.SelectCell.extend({
      optionValues: [['+', '+'], ['-', '-']]
    }),
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
    },
    sortValue: function (model, string) {
      // use the 'true' change (as in -200 or +100) to sort this column,
      // rather than just true/false.
      var amount = model.get('amount');
      var mult = +model.get('isIncome') || -1;
      return +amount * mult;
    }
  };
});

