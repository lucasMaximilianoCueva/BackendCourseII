const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("http://localhost:3000/login");
    }
  };

export { isAuth }  