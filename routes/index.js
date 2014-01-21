
/*
 * GET home page.
 */

var Users = require('./../lib/Users.js');
var users = new Users();

exports.index = function (req, res) {
  var email = req.session.email;
  var renderData = {
    title: 'WalletHawk',
    userEmail: email || '',
    csrfToken: req.csrfToken(),
    bootstrapData: []
  };

  if (email) {
    users.getLedger({email: email}, function (ledger) {
      renderData.bootstrapData = ledger;
      res.render('index', renderData);
    });
  } else {
    res.render('index', renderData);
  }
};
