
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var persona = require('express-persona');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Simple-minded error handling. Doing it properly seems to involve futzing
// with domains/cluster.
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send(500);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
require('./routes/api/ledger.js')(app);
//require('routes/auth/ledger.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('WalletHawk server listening on port ' + app.get('port'));
});
