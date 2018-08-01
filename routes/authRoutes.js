const passport = require('passport');


module.exports = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  // Will see the code in the URL and retrieve user profile
  app.get('/auth/google/callback', passport.authenticate('google'));
}
