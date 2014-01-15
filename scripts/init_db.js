var db = require("./../lib/DatabaseConnection.js");
var fs = require('fs');

// load base schema
fs.readFile("./db/base_schema.sql", function (err, data) {
  if (err) {
    throw new Error(err);
  }
  sql = data.toString();
  console.log(sql);
  db.exec(sql, function (err) {
    if (err) {
      throw new Error(err);
    }
    console.log("success, db is initialized"); 
    process.exit();
  });
});
