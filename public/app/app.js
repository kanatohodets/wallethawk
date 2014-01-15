define(function(require, exports, module){
  var Backbone = require('backbone');

  var LedgerView = require('./app/views/LedgerView.js');
  var ChartView = require('./app/views/ChartView.js');
  var LedgerCollection = require('./app/collections/ledger.js');

  var ledger = new LedgerCollection();
  var ledgerView = new LedgerView({collection: ledger});
  var chartView = new ChartView({collection: ledger});

  module.exports = Backbone.Router.extend({
    routes: {
      '': 'ledgerView',
      'ledger': 'ledgerView',
      'chart': 'chartView'
    },

    ledgerView: function () {
        ledgerView.bootstrap();
    },

    chartView: function () {
        chartView.bootstrap();
    }
  });
});
