const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies (for `application/x-www-form-urlencoded`)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies (if you also receive JSON)
app.use(express.json({ limit: '100kb' }));

// Simple logging setup using winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Route to handle POST requests to /pp-hosted/secure/webhook
app.post('/pp-hosted/secure/webhook', (req, res) => {
  logger.info('Webhook received.');

  // Log the received data
  logger.info('Request body:', req.body);

  // Respond with a 200 status code
  res.status(200).send('Webhook received successfully.');
});

// Start the server
const server = app.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
