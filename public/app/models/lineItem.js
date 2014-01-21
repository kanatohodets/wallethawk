define(function (require, exports, module) {

  var Backbone = require('backbone');

  module.exports = Backbone.Model.extend({
    urlRoot: '/api/ledger',
    initialize: function () {

    },

    validate: function (attrs) {

    }
  });
});
