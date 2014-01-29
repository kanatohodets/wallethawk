define(function (require, exports, module) {

  var Backbone = require('backbone');
  var LineItem = require('models/LineItem');

  module.exports = Backbone.Collection.extend({
    initialize: function () {
      this.on("add", function (model) {
        model.save();
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
          // TODO: deal with dates more consistently. convert here?
          dateCreated: data.dateCreated,
          dateModified: data.dateModified,
          isIncome: data.isIncome
        });
        models.push(lineItem);
      });
      return models;
    }
  });
});
