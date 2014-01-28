
/*
 * GET home page.
 */

var UsersLib = require('./../lib/Users.js');
var ErrorHandler = require('./../lib/ErrorHandler.js');
var Users = new UsersLib();

exports.index = function (req, res) {
  var email = req.session.email;
  var renderData = {
    title: 'WalletHawk',
    userEmail: email || '',
    csrfToken: req.csrfToken(),
    bootstrapData: []
  };

  if (email) {
    Users.getLedger({email: email}, function (err, ledger) {
      if (err) {
        ErrorHandler.warn(res, err);
        return;
      }
      renderData.bootstrapData = ledger;
      res.render('index', renderData);
    });
  } else {
    res.render('index', renderData);
  }
};
