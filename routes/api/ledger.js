var LineItem = require("./../../lib/lineItem.js");
var lineItem = new LineItem();

var ledger = function (app) {

  // grab a user's ledger, a collection of 
  // LineItems.
  app.get('/ledger', function (req, res) {
    lineItem.fetchAll(function (err, lineItems) {
      if (err) {
        next(err);
      }

      res.json(lineItems);
    });
  });

  // create a new line item
  app.post('/ledger', function (req, res) {
    lineItem.create(details, function (err) {
      if (err) {
        next(err);
      }

      res.send(201);
    });
  });

  // delete a line item
  app.delete('/ledger/:id', function (req, res) {
    lineItem.delete(lineItemID, function (err) {
      if (err) {
        next(err);
      }

      res.send(201);
    });
  });

};

module.exports = ledger;
