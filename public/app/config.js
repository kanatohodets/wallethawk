require.config({

  deps: ['main'],

  paths: {
    jquery: '../components/jquery/jquery',
    underscore: '../components/lodash/lodash',
    backbone: '../components/backbone-amd/backbone',
    markdown: '../components/markdown/lib/markdown',
    moment: '../components/moment/moment',
    tpl: '../components/requirejs-tpl/tpl',
    d3: '../components/d3/d3',
    'backbone.localStorage': '../components/backbone.localStorage/backbone.localStorage'
  },

  shim: {
  }

});
