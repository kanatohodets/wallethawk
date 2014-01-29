define(function(require, exports, module){
  var $ = require('jquery');
  var App = require('app');
  var Backbone = require('backbone');

  $(function(){
    var csrfToken = $('meta[name="_csrf"]').attr('content');
    $.ajaxPrefilter(function (options, _, xhr) {
      if (!xhr.crossDomain) {
        xhr.setRequestHeader('X-CSRF-Token', csrfToken);
      }
    });
    window.app = new App();
    app.start();
    Backbone.history.start({pushState: true});
  });
});
