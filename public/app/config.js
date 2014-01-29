require.config({

  deps: ['main'],

  paths: {
    jquery: '../components/jquery/jquery',
    underscore: '../components/lodash/lodash',
    backbone: '../components/backbone-amd/backbone',
    moment: '../components/moment/moment',
    tpl: '../components/requirejs-tpl/tpl',
    d3: '../components/d3/d3',
    backgrid: '../components/backgrid/lib/backgrid',
    'backbone.localStorage': '../components/backbone.localStorage/backbone.localStorage'
  },

  shim: {
    backgrid: {
      deps: ['jquery', 'backbone', 'underscore'],
      exports: 'Backgrid'
    }
  }

});
