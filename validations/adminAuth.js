const isAuth = (req, res, next) => {
  if (!req.session.adminLoggedIn) {
    res.redirect("/");
  }
  next();
};

module.exports = isAuth;
