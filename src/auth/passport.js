// src/auth/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

passport.serializeUser((user, done) => done(null, user._id.toString()));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getDb().collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user || null);
  } catch (e) {
    done(e);
  }
});

function configurePassport() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

  // Prefer explicit GOOGLE_CALLBACK_URL; else build from BASE_URL; else localhost.
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    `${(process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')}/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const users = getDb().collection('users');

          const googleId = profile.id;
          const email = profile.emails?.[0]?.value || null;
          const displayName = profile.displayName || null;

          const filter = { googleId };
          const update = {
            $set: { googleId, email, displayName, updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date(), role: 'user' }
          };

          // Options compatible with MongoDB driver v3 and v4+:
          const options = {
            upsert: true,
            returnDocument: 'after', // v4/v5
            returnOriginal: false    // v3
          };

          const result = await users.findOneAndUpdate(filter, update, options);

          // Safe follow-up fetch in case .value is null
          let user = result?.value;
          if (!user) user = await users.findOne(filter);
          if (!user) return done(new Error('Upsert appeared to succeed but no user found'));

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

module.exports = { passport, configurePassport };
