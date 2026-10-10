const ledgerService = require('../../services/ledger.service');
const asyncHandler = require('../../lib/asyncHandler');

exports.summary = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const result = await ledgerService.summary({ from, to });
  res.json(result);
});

exports.breakdown = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const result = await ledgerService.breakdown({ from, to });
  res.json(result);
});

exports.eventPnl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await ledgerService.eventPnl(id);
  res.json(result);
});

exports.ledger = asyncHandler(async (req, res) => {
  const { from, to, category, type, eventId, fundraiserId, page, pageSize } = req.query;
  const result = await ledgerService.list({
    from,
    to,
    category,
    type,
    eventId,
    fundraiserId,
    page,
    pageSize,
  });
  res.json(result);
});

exports.exportCsv = asyncHandler(async (req, res) => {
  const { from, to, category, type, eventId } = req.query;
  const { items } = await ledgerService.list({
    from,
    to,
    category,
    type,
    eventId,
    page: 1,
    pageSize: 10000,
  });

  const csv = ledgerService.toCsv(items);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="skyline-ledger.csv"');
  res.send(csv);
});
