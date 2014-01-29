define(function (require, exports, module) {

  var Backbone = require('backbone');
  var moment = require('moment');

  module.exports = Backbone.Model.extend({
    urlRoot: '/api/ledger',
    initialize: function (attrs) {
      this.on('change', function (model, attrs) {
        var date = this.get('dateCreated');
        var jsDate = moment(date).toDate().getTime();
        this.set('dateCreated', jsDate, {silent: true});
        this.save();
      });
    }
  });
});
