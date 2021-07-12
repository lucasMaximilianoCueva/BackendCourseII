import facebook from 'passport-facebook'
const facebookStrategy = facebook.Strategy;



const passportConfig = (passport) => {
  passport.use(
    new facebookStrategy({    // Obj Process
      clientID: process.argv[3] || '285367766706574', 
      clientSecret: process.argv[4] || '48cc6580360da394ca2fb3eee0ebe982',
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
      scope: ['email']
  }, function (accessToken, refreshToken, userProfile, done) {
      return done(null, userProfile);
  }));

  console.log(process.argv)

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
      cb(null, obj);
  });
};

export default passportConfig;