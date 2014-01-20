
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title: 'WalletHawk',
    csrf_token: req.csrfToken()
  });
};
