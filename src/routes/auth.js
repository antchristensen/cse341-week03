const router = require('express').Router();
const { passport } = require('../auth/passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (_req, res) => res.redirect('/auth/success')
);

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
