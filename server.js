require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { connectToDb } = require('./src/db/connection');
const errorHandler = require('./src/middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger/swagger.json');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));

// Health route
app.get('/', (_req, res) => {
  res.json({ status: 'OK', message: 'Week 03 Mountain Bikes CRUD API is running' });
});

// Routes
app.use('/api/bikes', require('./src/routes/bikes'));
app.use('/api/brands', require('./src/routes/brands'));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use(errorHandler);

// Start server after DB connects
connectToDb()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });
