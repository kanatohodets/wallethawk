/**
 * WalletHawk!
 *
 */

var config = require('config');
var fs = require('fs');
if (!fs.existsSync(config.db.location + config.app.name + ".db")) {
  console.log("No DB file found - you may need to run scripts/init_db");
  process.exit(1);
}

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var port = config.server.port || 3000;
var appName = config.app.name || 'WalletHawk';

var app = express();


// all environments
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.logger('dev'))
  .use(express.json())
  .use(express.urlencoded())
  .use(express.methodOverride())
  .use(express.cookieParser(config.session.secret))
  .use(express.session({secret: config.session.secret}))
  .use(express.csrf());


var personaAudience = config.app.audience || "localhost";
if (personaAudience == 'localhost') {
  personaAudience += ':' + port;
}
require("express-persona")(app, {
  audience: "http://" + personaAudience
});

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
app.get('/ledger', routes.index);
app.get('/chart', routes.index);
require('./routes/api/ledger.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log(appName + ' server listening on port ' + app.get('port'));
});
