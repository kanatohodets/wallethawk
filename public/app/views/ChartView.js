define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');

  module.exports = Backbone.View.extend({
    el: $('#app'),
    render: function () {
      this.$el.html('<span>this is where the graph will go </span>');
    }
  });

});
