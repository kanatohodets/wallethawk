define(function(require, exports, module){

  var Backbone = require('backbone');
  var LineItem = require('models/LineItem');

  module.exports = Backbone.Model.extend({
    model: LineItem,
    url: '/api/ledger'
  });

});
