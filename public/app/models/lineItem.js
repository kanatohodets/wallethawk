define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');

  module.exports = Backbone.Model.extend({
    urlRoot: '/api/ledger',
    initialize: function (attrs) {
      this.on('change', function (model, attrs) {
        model.set('dateModified', "" + moment().unix(), {silent: true});
        // no need to save after setting the new ID when hearing back from the
        // server after creating it.
        if (!model.changed.id) {
          this.save();
        }
      });
    }
  });
});
