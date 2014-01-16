var LineItems = require("./../../lib/LineItems.js");
var Categories = require("./../../lib/Categories.js");

var Ledger = function (app) {
  Categories.load(function (categories) {
    var lineItems = new LineItems(categories);

    // grab a user's ledger, a collection of
    // LineItems.
    app.get('/api/ledger/:id', function (req, res) {
      var userID = req.params.id || null;
      var details = {userID: userID};
      lineItems.fetchAll(details, function (lineItems) {
        res.json(lineItems);
      });
    });

    // create a new line item
    app.post('/api/ledger/:userID', function (req, res) {
      console.log(req.body);
      var userID = req.params.userID;
      console.log(userID);
      if (userID) {
        var details = req.body || {};
        details.userID = userID;
        lineItems.create(details, function (err, lineItemID) {
          if (err) {
            res.send(err.toString(), 400);
          }
          res.json({lineItemID: lineItemID});
        });
      } else {
        res.send("must specify user ledger", 400);
      }
    });

    // delete a line item
    app.delete('/api/ledger/:userID/:itemID', function (req, res) {
      var userID = req.params.userID || null;
      var lineItemID = req.params.itemID || null;

      var details = {
        userID: userID,
        lineItemID: lineItemID
      };

      lineItems.delete(userID, lineItemID, function (changed) {
        if (changed === 1) {
          res.send(200);
        }
      });
    });
  });
};

module.exports = Ledger;
