const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const { uploadDir } = require('./middleware/upload');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing middleware
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts.shift().trim();
      const value = decodeURIComponent(parts.join('='));
      if (name) req.cookies[name] = value;
    });
  }
  next();
});

// Serve uploads
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// API Module Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/applications', require('./modules/applications/applications.routes'));
app.use('/api/memberships', require('./modules/memberships/memberships.routes'));
app.use('/api/events', require('./modules/events/events.routes'));
app.use('/api/tickets', require('./modules/tickets/tickets.routes'));
app.use('/api/products', require('./modules/shop/shop.routes'));
app.use('/api/orders', require('./modules/shop/shop.routes'));
app.use('/api/shop', require('./modules/shop/shop.routes'));
app.use('/api/announcements', require('./modules/announcements/announcements.routes'));
app.use('/api/fundraisers', require('./modules/tasks/tasks.routes'));
app.use('/api/tasks', require('./modules/tasks/tasks.routes'));
app.use('/api/expenses', require('./modules/expenses/expenses.routes'));
app.use('/api/finance', require('./modules/finance/finance.routes'));
app.use('/api/sponsors', require('./modules/sponsors/sponsors.routes'));
app.use('/api/contributions', require('./modules/sponsors/sponsors.routes'));
app.use('/api/deliverables', require('./modules/sponsors/sponsors.routes'));
app.use('/api/handover', require('./modules/handover/handover.routes'));
app.use('/api/roles', require('./modules/roles/roles.routes'));
app.use('/api/admin', require('./modules/admin/admin.routes'));

// 404 & Central Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
