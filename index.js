const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },
  (accessToken) => {
    console.log(accessToken);
  })
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Will see the code in the URL and retrieve user profile
app.get('/auth/google/callback', passport.authenticate('google'));

const PORT = process.env.PORT || 5000;
app.listen(PORT);


//https://accounts.google.com/o/
// oauth2/v2/auth?response_type=code&redirect_uri=http
// %3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback&scope=pr
// ofile%20email&client_id=129497910079-ier91g5l182cakpd25ng4d0
// 1lgmb8ied.apps.googleusercontent.com
