define(function (require, exports, module) {

  var Backbone = require('backbone');
  var Backgrid = require('backgrid');
  var MomentCell = require('MomentCell');
  var moment = require('moment');

  var DeleteCell = require('views/grid/DeleteCell');
  var IsIncomeColumn = require('views/grid/IsIncomeColumn');

  module.exports = function (categories) {
    return [
      { name: "delete", label: "", cell: DeleteCell},
      IsIncomeColumn,
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
            }
          }
        })
      },

      { name: "category", label: "Category",
        cell: Backgrid.SelectCell.extend({ optionValues: categories})
      }
    ];
  };

});
