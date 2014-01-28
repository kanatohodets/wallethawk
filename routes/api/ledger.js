var LineItemLib = require('./../../lib/LineItem.js');
var Categories = require('./../../lib/Categories.js');
var UsersLib = require('./../../lib/Users.js');
var ErrorHandler = require('./../../lib/ErrorHandler.js');

var Ledger = function (app) {
  Categories.load(function (categories) {

    var LineItem = new LineItemLib(categories);
    var Users = new UsersLib();

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
          apiKey: req.params.key
        };
        Users.get(credentials, function (err, userID) {
          if (err) {
            ErrorHandler.warn(res, err);
          } else {
            if (userID) {
              callback(userID);
            } else {
              res.send(401);
            }
          }
        });
      } else {
        res.send(401);
      }
    };

    // fetch a user's ledger, a collection of line items.
    app.get('/api/ledger', function (req, res) {
      auth(req, res, function (userID) {
        Users.getLedger({userID: userID}, function (err, lineItems) {
          if (err) {
            ErrorHandler.warn(res, err);
          } else {
            res.json(lineItems);
          }
        });
      });
    });

    // add a line item to the ledger
    app.post('/api/ledger', function (req, res) {
      auth(req, res, function (userID) {
        var details = req.body || {};
        details.userID = userID;
        LineItem.create(details, function (err, lineItemID) {
          if (err) {
            ErrorHandler.warn(res, err);
          } else {
            res.json({id: lineItemID});
          }
        });
      });
    });

    // update an existing line item
    app.put('/api/ledger/:lineItemID', function (req, res) {
      auth(req, res, function (userID) {
        var details = req.body || {};
        console.log(details);
        details.userID = userID;
        LineItem.update(details, function (err, rowsChanged) {
          if (err) {
            ErrorHandler.warn(res, err);
          } else {
            res.send(200);
          }
        });
      });
    });

    // delete a line item from the ledger
    app.delete('/api/ledger/:lineItemID', function (req, res) {
      auth(req, res, function (userID) {
        var lineItemID = req.params.id || null;

        LineItem.delete(userID, lineItemID, function (err, changed) {
          if (err) {
            ErrorHandler.warn(res, err);
          } else {
            if (changed === 1) {
              res.send(200);
            }
          }
        });
      });
    });
  });
};

module.exports = Ledger;
