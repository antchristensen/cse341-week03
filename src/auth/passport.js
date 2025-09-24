const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

passport.serializeUser((user, done) => done(null, user._id.toString()));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getDb().collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user || null);
  } catch (e) { done(e); }
});

function configurePassport() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL } = process.env;
  passport.use(new GoogleStrategy(
    { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL: `${BASE_URL}/auth/google/callback` },
    async (_at, _rt, profile, done) => {
      try {
        const users = getDb().collection('users');
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const displayName = profile.displayName || null;
        const upd = {
          $set: { googleId, email, displayName, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date(), role: 'user' }
        };
        const result = await users.findOneAndUpdate({ googleId }, upd, { upsert: true, returnDocument: 'after' });
        return done(null, result.value);
      } catch (err) { return done(err); }
    }
  ));
}
module.exports = { passport, configurePassport };
