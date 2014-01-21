var db = require('./../lib/DatabaseConnection.js');
var fs = require('fs');
var async = require('async');
var program = require('commander');
var _ = require('lodash');

program
  .option('--data', 'Load mock data [db/mock_data.sql]', 'db/mock_data.sql')
  .parse(process.argv);

var tasks = ['db/base_schema.sql'];
if (program.data) {
  tasks.push(program.data);
}
var runFile = function (file) {
  var run = function (callback) {
    fs.readFile('./' + file, function (err, data) {
      if (err) {
        throw new Error(err);
      }
      sql = data.toString();
      console.log(sql);
      db.exec(sql, function (err) {
        if (err) {
          throw new Error(err);
        }
        callback(null);
      });
    });
  };
  return run;
};

tasks = _.map(tasks, runFile);
tasks.push(function (err, result) {
  console.log('all done!');
  process.exit();
});

async.series(tasks);
