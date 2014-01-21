define(function (require, exports, module) {

  var Backbone = require('backbone');
  var LineItem = require('models/LineItem');

  module.exports = Backbone.Collection.extend({
    initialize: function () {
    },

    model: LineItem,
    url: '/api/ledger',
    parse: function (response) {
      console.log("parsing", response);
      var models = [];
      _.each(response, function (data, index) {
        console.log('data: ', data);
        var lineItem = new LineItem({
          id: data.lineItemID,
          amount: data.amount,
          category: data.category,
          description: data.description,
          dateCreated: moment.unix(data.dateCreated),
          dateModified: moment.unix(data.dateModified),
          isIncome: !!data.isIncome
        });
        models.push(lineItem);
      });
      return models;
    }
  });
});
