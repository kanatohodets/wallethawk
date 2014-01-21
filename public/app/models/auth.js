define(function (require, exports, module) {

  var $ = require('jquery');
  var Backbone = require('backbone');


  module.exports = Backbone.Model.extend({
    initialize: function () {
      // set server side to allow sessions to continue if the user reloads
      var userEmail = $('meta[name="user"').attr('content') || null;
      console.log(userEmail);
      this.set('loggedIn', !!userEmail);
      navigator.id.watch({
        loggedInUser: userEmail,
        onlogin: this.onlogin.bind(this),
        onlogout: this.onlogout.bind(this)
      });
    },

    login: function () {
      navigator.id.request();
    },

    logout: function () {
      navigator.id.logout();
    },

    loggedIn: function () {
      return this.get('loggedIn');
    },

    onlogin: function (assertion) {
      var self = this;
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/persona/verify',
        data: {assertion: assertion},
        success: function (event) {
          self.set('loggedIn', true);
        }
      });
    },

    onlogout: function () {
      var self = this;
      $.ajax({
        type: 'post',
        url: '/persona/logout',
        success: function (event) {
          self.set('loggedIn', false);
        }
      });
    }
  });
});
