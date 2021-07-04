import facebook from 'passport-facebook'
const facebookStrategy = facebook.Strategy;



const passportConfig = (passport) => {
  passport.use(
    new facebookStrategy({
      clientID: '',
      clientSecret: '',
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
      scope: ['email']
  }, function (accessToken, refreshToken, userProfile, done) {
      console.log(userProfile)
      return done(null, userProfile);
  }));

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
      cb(null, obj);
  });
};

export default passportConfig;