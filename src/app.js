const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.send('OK'));

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/applications', require('./modules/applications/applications.routes'));
app.use('/api/events', require('./modules/events/events.routes'));
app.use('/api/shop', require('./modules/shop/shop.routes'));
app.use('/api/tickets', require('./modules/tickets/tickets.routes'));
app.use('/api/finance', require('./modules/finance/finance.routes'));
app.use('/api/announcements', require('./modules/announcements/announcements.routes'));
app.use('/api/expenses', require('./modules/expenses/expenses.routes'));
app.use('/api/roles', require('./modules/roles/roles.routes'));

app.use(errorHandler);

module.exports = app;
