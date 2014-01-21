define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');

  module.exports = Backbone.View.extend({
    el: $('#app'),
    initialize: function () {
      var self = this;
      if (!self.collection) {
        throw new Error('ledger view needs a collection');
      }

      // Better to splice in/out specific elements to save painting time, but
      // ... the lazy.
      self.listenTo(self.collection, 'add', function () {
        self.render();
      });
      self.listenTo(self.collection, 'remove', function () {
        self.render();
      });
    },

    template: require('tpl!templates/LineItemTemplate.ejs'),

    render: function () {
      var self = this;
      self.$el.html('');
      self.collection.each(function (lineItem, index) {
        self.$el.prepend(self.template(lineItem.attributes));
      });
      return this;
    }
  });

});
