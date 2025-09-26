// src/routes/auth.js
const router = require('express').Router();
const { passport } = require('../auth/passport');

// Start Google login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: true }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err, 'info:', info);
      return res.status(500).json({ error: 'OAuth error', details: String(err) });
    }
    if (!user) {
      console.error('Google OAuth failed:', info);
      return res.status(401).json({ error: 'Login failed', info });
    }
    req.logIn(user, (err2) => {
      if (err2) {
        console.error('Session login error:', err2);
        return res.status(500).json({ error: 'Session error', details: String(err2) });
      }
      return res.redirect('/auth/success');
    });
  })(req, res, next);
});

router.get('/me', (req, res) => {
  if (!req.user) return res.json({ authenticated: false });
  const { _id, email, displayName, role } = req.user;
  res.json({ authenticated: true, user: { _id, email, displayName, role } });
});

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(204).send();
    });
  });
});

router.get('/success', (req, res) => {
  if (!req.user) return res.redirect('/auth/failure');
  res.json({ message: 'Logged in', user: { email: req.user.email, name: req.user.displayName } });
});

router.get('/failure', (_req, res) => res.status(401).json({ error: 'Login failed' }));

module.exports = router;
