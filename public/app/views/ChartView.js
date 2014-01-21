define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');
  var d3 = require('d3');

  module.exports = Backbone.View.extend({
    el: $('#app'),
    render: function () {
      this.$el.html('<span>this is where the graph will go </span>');
    }
  });

});
