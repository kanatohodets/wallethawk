define(function (require, exports, module) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  var LedgerView = require('./app/views/LedgerView.js');
  var ChartView = require('./app/views/ChartView.js');
  var AuthView = require('./app/views/AuthView.js');
  var Auth = require('./app/models/auth.js');
  var Ledger = require('./app/collections/ledger.js');

  var $appContainer = $('#app');

  var data = JSON.parse(window.bootstrapData);
  var ledger = new Ledger(data, {parse: true});
  var auth = new Auth();
  var authView = new AuthView({model: auth, ledger: ledger, app: $appContainer});

  authView.render();

  module.exports = Backbone.Router.extend({
    routes: {
      '': 'ledger',
      'ledger': 'ledger',
      'chart': 'chart'
    },

    login: function () {
      ledger.reset();
      $appContainer.html('');
      console.log('hit sign in to start!');
    },

    ledger: function () {
      var ledgerView = new LedgerView({collection: ledger});
      if (auth.loggedIn()) {
        ledgerView.render();
      } else {
        ledgerView.remove();
        this.login();
      }
    },

    chart: function () {
      var chartView = new ChartView({collection: ledger});
      if (auth.loggedIn()) {
        chartView.render();
      } else {
        chartView.remove();
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
