define(function (require, exports, module) {

  var Backbone = require('backbone');

  module.exports = Backbone.View.extend({
    el: $('#auth'),
    initialize: function () {
      var self = this;
      if (!self.model) {
        throw new Error('AuthView needs a login model');
      }

      self.listenTo(self.model, 'change:loggedIn', function (authModel, loggedIn) {
        console.log('loggedIn changed: ', loggedIn);
        if (loggedIn) {
          self.options.ledger.fetch();
        } else {
          self.options.ledger.reset([]);
          self.options.app.html('');
        }
        self.render();
      });
    },

    render: function () {
      if (this.model.loggedIn()) {
        this.$el.text('Logout');
      } else {
        this.$el.text('Login');
      }
    },

    events: {
      'click': 'auth',
    },

    auth: function (event) {
      if (this.model.loggedIn()) {
        this.logout();
      } else {
        this.login();
      }
    },

    login: function (event) {
      this.model.login();
    },

    logout: function (event) {
      this.model.logout();
    }
  });
});
