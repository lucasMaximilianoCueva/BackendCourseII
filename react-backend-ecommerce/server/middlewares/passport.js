import facebook from 'passport-facebook'
import config from '../config/config.js';
const facebookStrategy = facebook.Strategy;



const passportConfig = (passport) => {
  passport.use(
    new facebookStrategy({    // Obj Process
      clientID: config.CLIENT_ID || '285367766706574', 
      clientSecret: config.CLIENT_SECRET || '48cc6580360da394ca2fb3eee0ebe982',
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
      scope: ['email']
  }, function (accessToken, refreshToken, userProfile, done) {
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