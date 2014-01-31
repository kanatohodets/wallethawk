define(function (require, exports, module) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  var LedgerView = require('./app/views/LedgerView.js');
  var ChartView = require('./app/views/ChartView.js');
  var AuthView = require('./app/views/AuthView.js');
  var Auth = require('./app/models/auth.js');
  var Ledger = require('./app/collections/ledger.js');

  var $app = $('#app');

  var data = JSON.parse(window.bootstrapData);
  var ledger = new Ledger(data, {parse: true});
  var auth = new Auth();
  var authView = new AuthView({model: auth, ledger: ledger});
  authView.render();

  var chartView = new ChartView({collection: ledger});
  var ledgerView = new LedgerView({collection: ledger});

  module.exports = Backbone.Router.extend({
    initialize: function () {
      var self = this;
      // re-trigger route after log in
      // TODO: fix this to respect initial entry point and send back there
      // after logging in
      self.listenTo(authView, "login", function () {
        self.navigate('ledger', {trigger: true});
      });

      self.listenTo(authView, "logout", function () {
        self.navigate('ledger', {trigger: true});
      });
    },

    routes: {
      '': 'ledger',
      'ledger': 'ledger',
      'chart': 'chart'
    },

    login: function () {
      ledger.reset();
      $app.html('log in!');
    },

    ledger: function () {
      if (auth.loggedIn()) {
        ledgerView.render();
      } else {
        this.login();
      }
    },

    chart: function () {
      if (auth.loggedIn()) {
        chartView.render();
      } else {
        this.login();
      }
    },

    start: function () {
      // borrowed from backbone-express-spa. change links on this domain to run
      // through the router, rather than triggering new page loads
      $(window.document).on('click', 'a[href]:not([data-bypass])', function(evt) {
        var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
        var root = window.location.protocol + '//' + window.location.host + '/';

        if (href.prop.slice(0, root.length) === root) {
            evt.preventDefault();
            Backbone.history.navigate(href.attr, true);
        }
      });
    }
  });
});
