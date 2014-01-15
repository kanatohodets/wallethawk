var LineItems = require("./../../lib/LineItems.js");
var Categories = require("./../../lib/Categories.js");

var Ledger = function (app) {
  Categories.load(function (categories) {
    var lineItems = new LineItems(categories);

    // grab a user's ledger, a collection of 
    // LineItems.
    app.get('/ledger', function (req, res) {
      var details = req.body || {};
      lineItems.fetchAll(details, function (lineItems) {
        console.log(lineItems);
        res.json(lineItems);
      });
    });

    // create a new line item
    app.post('/ledger', function (req, res) {
      lineItems.create(details, function (lineItemID) {
        res.json({lineItemID: lineItemID});
      });
    });

    // delete a line item
    app.delete('/ledger/:id', function (req, res) {
      var details = {
        lineItemID: req.lineItemID
      };

      lineItems.delete(details, function (changed) {
        if (changed === 1) {
          res.send(200);
        }
      });
    });
  });
};

module.exports = Ledger;
