// server.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

const { connectToDb } = require('./src/db/connection');
const errorHandler = require('./src/middleware/errorHandler');

//  OAuth 
const { passport, configurePassport } = require('./src/auth/passport');
const requireAuth = require('./src/middleware/requireAuth');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger/swagger.json');

const app = express();
const port = process.env.PORT || 3000;

/* ---------- Core app & security ---------- */

// Needed on Render so secure cookies work behind proxy
app.set('trust proxy', 1);

// Helmet (relax CSP for Swagger UI assets)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
  })
);

// CORS: allow same-origin Swagger UI & cookies
app.use(
  cors({
    origin: true,          // reflect request origin
    credentials: true      // allow cookies
  })
);

// Body parsers & logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ---------- Sessions & Passport ---------- */

app.use(
  session({
    secret: process.env.SESSION_SECRET, // set in .env / Render Env
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: process.env.BASE_URL?.startsWith('https://') ? true : false, // https in production
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8 // 8 hours
    }
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

/* ---------- Swagger Docs ---------- */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));

/* ---------- Health ---------- */

app.get('/', (_req, res) => {
  res.json({ status: 'OK', message: 'Week 03/04 MTB API is running' });
});

/* ---------- Routes ---------- */

// Auth (Google OAuth, session info, logout)
app.use('/auth', require('./src/routes/auth'));

// Protect only write methods for API collections
const protectWrites = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return requireAuth(req, res, next);
  }
  return next();
};

// Collections
app.use('/api/bikes', protectWrites, require('./src/routes/bikes'));
app.use('/api/brands', protectWrites, require('./src/routes/brands'));

/* ---------- 404 & Error Handler ---------- */

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

/* ---------- Start after DB connects ---------- */

connectToDb()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });
