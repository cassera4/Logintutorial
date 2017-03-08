var express = require('express');
var router = express.Router();
//Get Dashboard
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next;
  } else {
    req.flash('error_msg', "You are not logged in");
    res.redirect('/users/login');
  }
}


router.get('/postlogin', /*ensureAuthenticated, */function(req, res) {
  res.render('postlogin');
});

module.exports = router;
