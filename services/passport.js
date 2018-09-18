const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');
const Star = mongoose.model('stars');

const {configStars} = require('../services/stars/configStars');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    let username = "User";
    if (profile.name && profile.name.givenName) {
      username = profile.name.givenName;
      if (profile.name.familyName) {
        username += " " + profile.name.familyName;
      }
    }
    const existingUser = await User.findOne({googleId: profile.id})

    if (existingUser) {
        return done(null, existingUser);
    }

    const user = await new User({googleId: profile.id}).save();
    configStars(user, username);


    done(null, user);
 })
);
