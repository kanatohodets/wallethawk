define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');
  var LineItem = require('models/LineItem');

  module.exports = Backbone.Collection.extend({
    initialize: function () {
      this.on("add", function (model) {
        if (model.isNew()) {
          model.save();
        }
      });
      this.on("remove", function (model) {
        model.destroy();
      });
    },

    model: LineItem,
    url: '/api/ledger',
    parse: function (response) {
      var models = [];
      _.each(response, function (data, index) {
        var lineItem = new LineItem({
          id: data.id,
          // Money is stored in 'millimoneys' server side to avoid problematic
          // rounding issues with 'the truth'. It'd be better to show people
          // more normal looking values, though.
          amount: data.amount / 1000,
          category: data.category,
          description: data.description,
          dateCreated: "" + data.dateCreated,
          dateModified: "" + data.dateModified,
          isIncome: data.isIncome
        });
        models.push(lineItem);
      });
      return models;
    }
  });
});