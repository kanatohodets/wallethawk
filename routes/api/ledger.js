var LineItem = require("./../../lib/LineItem.js");
var Categories = require("./../../lib/Categories.js");
var Users = require("./../../lib/Users.js");

var Ledger = function (app) {
  Categories.load(function (categories) {

    var lineItem = new LineItem(categories);
    var users = new Users(lineItem);

    /**
     * Turn a credential into a userID for fetching data.
     *
     * req.session.email is available once mozilla persona authentication
     * completes. Alternatively, the secret API key will work.
     *
     * @param req
     * @param res
     * @param callback
     * @callback userID
     */
    var auth = function (req, res, callback) {
      if (req.session.email || req.params.key) {
        var credentials = {
          email: req.session.email,
          key: req.params.key
        };
        users.get(credentials, function (userID) {
          if (userID) {
            callback(userID);
          } else {
            res.send(404);
          }
        });
      } else {
        res.send(401);
      }
    };

    // fetch a user's ledger, a collection of line items.
    app.get('/api/ledger', function (req, res) {
      auth(req, res, function (userID) {
        users.getLedger(userID, function (lineItems) {
          res.json(lineItems);
        });
      });
    });

    // add a line item to the ledger
    app.post('/api/ledger', function (req, res) {
      auth(req, res, function (userID) {
        var details = req.body || {};
        details.userID = userID;
        lineItem.create(details, function (err, lineItemID) {
          if (err) {
            res.send(err.toString(), 400);
          }
          res.json({lineItemID: lineItemID});
        });
      });
    });

    // update an existing line item
    app.put('/api/ledger/:lineItemID', function (req, res) {
      auth(req, res, function (userID) {
        var details = req.body || {};
        details.userID = userID;
        lineItem.update(details, function (err, lineItemID) {
          if (err) {
            res.send(err.toString(), 400);
          }
          res.json({lineItemID: lineItemID});
        });
      });
    });

    // delete a line item from the ledger
    app.delete('/api/ledger/:lineItemID', function (req, res) {
      auth(req, res, function (userID) {
        var lineItemID = req.params.lineItemID || null;

        var details = {
          userID: userID,
          lineItemID: lineItemID
        };

        lineItem.delete(userID, lineItemID, function (changed) {
          if (changed === 1) {
            res.send(200);
          }
        });
      });
    });
  });
};

module.exports = Ledger;
