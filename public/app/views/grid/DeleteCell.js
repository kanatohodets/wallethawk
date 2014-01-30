define(function (require, exports, module) {
  var Backbone = require('backbone');
  var Backgrid = require('backgrid');

  module.exports = Backgrid.Cell.extend({
    template: _.template('<button class="btn btn-xs btn-danger">X</button>'),
    events: {
      "click": "deleteRow"
    },
    deleteRow: function (e) {
      e.preventDefault();
      this.model.collection.remove(this.model);
    },
    render: function () {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  });
});


