define(function(require, exports, module){
  var $ = require('jquery');
  var App = require('app');
  var Backbone = require('backbone');

  $(function(){
    window.app = new App();
    Backbone.history.start({pushState: true});
  });
});
