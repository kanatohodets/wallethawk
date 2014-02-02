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
    MomentCell: '../components/backgrid-moment-cell/backgrid-moment-cell'
  },

  shim: {
    backgrid: {
      deps: ['jquery', 'backbone', 'underscore'],
      exports: 'Backgrid'
    },
    MomentCell: {
      deps: ['jquery', 'backbone', 'underscore', 'backgrid'],
      exports: 'MomentCell'
    }
  }

});
