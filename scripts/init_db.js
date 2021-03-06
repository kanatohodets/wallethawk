
var Script = require('./../lib/Script.js');
if (process.cwd().match('wallethawk/scripts')) {
  console.log("looks like the scripts dir, moving up one level so config doesn't complain");
  process.chdir('..');
}
var program = require('commander');

program
  .option('--data', 'Load mock data [db/mock_data.sql]', 'db/mock_data.sql')
  .option('--user [email]', 'Set user email for mock data')
  .parse(process.argv);

var script = new Script();
script.runFile('db/base_schema.sql');

if (program.data) {
  script.runFile(program.data);
}

if (program.user) {
  var sql = 'UPDATE user set email = "' + program.user + '" where id = 1';
  script.doQuery(sql);
}

script.execute();
